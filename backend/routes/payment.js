const express = require('express');
const { Invoice, Payment, Student, User } = require('../models');
const { authenticate } = require('../middleware/auth');
const AuditService = require('../services/auditService');

const router = express.Router();

router.use(authenticate);

/**
 * POST /api/payments/simulate
 * Process interactive simulated MFS payment (bKash, Nagad, Card) for an invoice
 */
router.post('/simulate', async (req, res, next) => {
  try {
    const { invoiceId, method, senderPhone, cardLast4, pin } = req.body;

    if (!invoiceId || !method) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'MISSING_PAYMENT_FIELDS',
          message: 'ইনভয়েস আইডি এবং পেমেন্ট মাধ্যম নির্বাচন করা আবশ্যক / Invoice ID and payment method are required'
        }
      });
    }

    const invoice = await Invoice.findByPk(Number(invoiceId), {
      include: [{ model: Student, as: 'student', include: ['user', 'class', 'section'] }]
    });

    if (!invoice) {
      return res.status(404).json({
        success: false,
        error: { code: 'INVOICE_NOT_FOUND', message: 'ইনভয়েস খুঁজে পাওয়া যায়নি / Invoice not found' }
      });
    }

    if (invoice.status === 'PAID') {
      return res.status(400).json({
        success: false,
        error: { code: 'INVOICE_ALREADY_PAID', message: 'এই ইনভয়েসটি পূর্বেই পরিশোধ করা হয়েছে / This invoice is already paid' }
      });
    }

    // Ownership check: if Parent, student must be linked; if Student, must be self
    if (req.user.role === 'PARENT') {
      if (!req.user.linkedStudentIds.includes(invoice.studentId)) {
        return res.status(403).json({
          success: false,
          error: { code: 'FORBIDDEN_PAYMENT', message: 'আপনার এই ইনভয়েসের বিল পরিশোধের অনুমতি নেই / You are not authorized to pay for this student' }
        });
      }
    } else if (req.user.role === 'STUDENT') {
      if (req.user.studentId !== invoice.studentId) {
        return res.status(403).json({
          success: false,
          error: { code: 'FORBIDDEN_PAYMENT', message: 'অনুমতি অস্বীকৃত / Access denied' }
        });
      }
    }

    // Generate simulated transaction reference
    const randomHex = Math.random().toString(36).substring(2, 8).toUpperCase();
    const cleanMethod = String(method).toUpperCase();
    const transactionId = `${cleanMethod}-TXN-${randomHex}`;
    const now = new Date().toISOString();

    // 1. Create Payment record
    const payment = await Payment.create({
      invoiceId: invoice.id,
      transactionId,
      method: cleanMethod,
      amount: invoice.amount,
      paidByUserId: req.user.id,
      paymentStatus: 'SUCCESS',
      simulationMeta: {
        gateway: `NextGen MFS Gateway (${cleanMethod})`,
        senderPhone: senderPhone || '017XXXXXXXX',
        cardLast4: cardLast4 || null,
        simulationMode: true
      },
      paidAt: now
    });

    // 2. Update Invoice to PAID
    const oldInvoiceState = { status: invoice.status };
    await Invoice.update(
      { status: 'PAID' },
      { where: { id: invoice.id } }
    );

    // 3. Record Audit Log for payment
    await AuditService.log({
      req,
      userId: req.user.id,
      action: 'PAYMENT_RECEIVED',
      entityType: 'payments',
      entityId: payment.id,
      oldValue: oldInvoiceState,
      newValue: { invoiceId: invoice.id, status: 'PAID', transactionId, amount: invoice.amount },
      details: `Received simulated ${cleanMethod} payment of ৳${invoice.amount} for Invoice #${invoice.invoiceNo} (TRX: ${transactionId})`
    });

    // 4. Return Digital Receipt payload
    res.json({
      success: true,
      message: 'পেমেন্ট সফলভাবে সম্পন্ন হয়েছে! / Payment completed successfully!',
      data: {
        receipt: {
          receiptNo: `RCPT-2026-${payment.id.toString().padStart(5, '0')}`,
          transactionId,
          invoiceNo: invoice.invoiceNo,
          invoiceTitleBn: invoice.titleBn,
          invoiceTitleEn: invoice.titleEn,
          baseAmount: invoice.baseAmount !== undefined && invoice.baseAmount !== null ? Number(invoice.baseAmount) : Number(invoice.amount),
          discountType: invoice.discountType || 'NONE',
          discountValue: Number(invoice.discountValue || 0),
          discountReason: invoice.discountReason || null,
          discountAmount: Number(invoice.discountAmount || 0),
          amountPaid: Number(invoice.amount),
          currency: 'BDT (৳)',
          method: cleanMethod,
          paidAt: now,
          paidBy: req.user.name,
          studentName: invoice.student?.user?.name,
          studentIdNumber: invoice.student?.studentIdNumber,
          className: invoice.student?.class?.nameBn,
          sectionName: invoice.student?.section?.nameBn,
          status: 'SUCCESS'
        }
      }
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
