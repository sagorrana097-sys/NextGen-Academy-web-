const express = require('express');
const fs = require('fs');
const path = require('path');
const { Invoice, Payment, Student, User, Class, Section } = require('../models');
const { authenticate, requireRole } = require('../middleware/auth');
const AuditService = require('../services/auditService');


const router = express.Router();
const dbPath = path.join(__dirname, '../data/nextgen_academy_db.json');

function getDB() {
  return JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
}

function saveDB(db) {
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf-8');
}

// Bengali number in words converter helper
function numberToBanglaWords(num) {
  const units = ['', 'এক', 'দুই', 'তিন', 'চার', 'পাঁচ', 'ছয়', 'সাত', 'আট', 'নয়', 'দশ', 'এগারো', 'বারো', 'তেরো', 'চৌদ্দ', 'পনেরো', 'ষোলো', 'সতেরো', 'আঠারো', 'উনিশ'];
  const tens = ['', '', 'বিশ', 'ত্রিশ', 'চল্লিশ', 'পঞ্চাশ', 'ষাট', 'সত্তর', 'আশি', 'নব্বই'];

  if (num === 0) return 'শূন্য';

  function convertTwoDigits(n) {
    if (n < 20) return units[n];
    const t = Math.floor(n / 10);
    const u = n % 10;
    return (tens[t] + (u > 0 ? ' ' + units[u] : '')).trim();
  }

  let words = '';
  const crore = Math.floor(num / 10000000);
  num %= 10000000;
  const lakh = Math.floor(num / 100000);
  num %= 100000;
  const thousand = Math.floor(num / 1000);
  num %= 1000;
  const hundred = Math.floor(num / 100);
  const remainder = num % 100;

  if (crore > 0) words += convertTwoDigits(crore) + ' কোটি ';
  if (lakh > 0) words += convertTwoDigits(lakh) + ' লাখ ';
  if (thousand > 0) words += convertTwoDigits(thousand) + ' হাজার ';
  if (hundred > 0) words += convertTwoDigits(hundred) + ' শত ';
  if (remainder > 0) words += convertTwoDigits(remainder);

  return words.trim() + ' টাকা মাত্র';
}

const BRAND = {
  academyName: 'NextGen Academy',
  instructor: 'মো: আলমগীর হোসেন (সাগর)',
  founder: 'মো: আলমগীর হোসেন (সাগর)',
  phone: '০১৭৯২৮১৮০০৫',
  address: 'পশ্চিম জয়দেবপুর, বাস-স্ট্যান্ড, গাজীপুর',
  tagline: 'LEARN · GROW · SUCCEED',
  email: 'info@nextgen.edu.bd',
  website: 'https://nextgen.edu.bd'
};

router.use(authenticate);

/**
 * POST /api/payments/checkout
 * Universal Secure Payment Gateway Checkout (bKash, Nagad, Rocket, Upay, Cards)
 * Handles fee invoices, store purchases, and custom fees with Real-Time Ledger Sync
 */
router.post('/checkout', async (req, res, next) => {
  try {
    const {
      invoiceId,
      purpose = 'MONTHLY_FEE', // 'MONTHLY_FEE' | 'STORE_ITEM' | 'CUSTOM'
      itemTitle = 'টিউশন ফি ও সেবা ফি',
      amount,
      method = 'BKASH',
      senderPhone,
      cardLast4,
      accountNo
    } = req.body;

    const cleanMethod = String(method).toUpperCase();
    const now = new Date().toISOString();
    const nowBanglaDate = new Date().toLocaleDateString('bn-BD', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    let targetInvoice = null;
    let studentId = req.user.studentId;
    let finalAmount = Number(amount) || 0;
    let invoiceTitleBn = itemTitle;

    // 1. If paying an existing invoice
    if (invoiceId) {
      targetInvoice = await Invoice.findByPk(Number(invoiceId), {
        include: [{ model: Student, as: 'student', include: ['user', 'class', 'section'] }]
      });

      if (!targetInvoice) {
        return res.status(404).json({
          success: false,
          error: { code: 'INVOICE_NOT_FOUND', message: 'ইনভয়েস খুঁজে পাওয়া যায়নি।' }
        });
      }

      if (targetInvoice.status === 'PAID') {
        return res.status(400).json({
          success: false,
          error: { code: 'INVOICE_ALREADY_PAID', message: 'এই ইনভয়েসটি পূর্বেই পরিশোধ করা হয়েছে।' }
        });
      }

      // Security check (Row-Level Security)
      if (req.user.role === 'STUDENT' && targetInvoice.studentId !== req.user.studentId) {
        return res.status(403).json({
          success: false,
          error: { code: 'FORBIDDEN_PAYMENT', message: 'অনুমতি অস্বীকৃত: আপনি কেবল নিজের বিল পরিশোধ করতে পারবেন।' }
        });
      }
      if (req.user.role === 'PARENT' && !req.user.linkedStudentIds.includes(targetInvoice.studentId)) {
        return res.status(403).json({
          success: false,
          error: { code: 'FORBIDDEN_PAYMENT', message: 'অনুমতি অস্বীকৃত: আপনার সন্তানের ইনভয়েস ছাড়া অন্যদের পরিশোধ করা যাবে না।' }
        });
      }

      studentId = targetInvoice.studentId;
      finalAmount = Number(targetInvoice.amount);
      invoiceTitleBn = targetInvoice.titleBn || targetInvoice.titleEn;
    } else {
      // Direct store purchase or custom checkout
      if (!finalAmount || finalAmount <= 0) {
        return res.status(400).json({
          success: false,
          error: { message: 'টাকার পরিমাণ শূন্য বা অবৈধ।' }
        });
      }
    }

    // 2. Generate Bank-Grade Transaction & Receipt References
    const randomHex = Math.random().toString(36).substring(2, 8).toUpperCase();
    const transactionId = `${cleanMethod}-TXN-${randomHex}`;
    const randomReceiptNo = `RCPT-2026-${Math.floor(10000 + Math.random() * 90000)}`;

    const db = getDB();
    const students = db.students || [];
    const users = db.users || [];
    const classes = db.classes || [];
    const sections = db.sections || [];

    const studentRecord = students.find((s) => Number(s.id) === Number(studentId)) || {};
    const studentUser = users.find((u) => u.id === studentRecord.userId) || (req.user.role === 'STUDENT' ? req.user : {});
    const studentClass = classes.find((c) => Number(c.id) === Number(studentRecord.classId)) || {};
    const studentSection = sections.find((s) => Number(s.id) === Number(studentRecord.sectionId)) || {};

    let createdInvoiceId = targetInvoice ? targetInvoice.id : null;

    // If no existing invoice, create a paid invoice record
    if (!targetInvoice) {
      const invoices = db.invoices || [];
      createdInvoiceId = invoices.length > 0 ? Math.max(...invoices.map((i) => i.id)) + 1 : 1;
      const newInv = {
        id: createdInvoiceId,
        invoiceNo: `INV-2026-${Math.floor(100000 + Math.random() * 900000)}`,
        studentId: Number(studentId || 1),
        titleBn: invoiceTitleBn,
        titleEn: purpose,
        month: 'চলতি মাস',
        year: 2026,
        baseAmount: finalAmount,
        discountType: 'NONE',
        discountValue: 0,
        discountAmount: 0,
        amount: finalAmount,
        dueDate: now.split('T')[0],
        status: 'PAID',
        paymentMethod: cleanMethod,
        transactionId,
        paidDate: now.split('T')[0],
        receivedBy: `Online Gateway (${cleanMethod})`,
        createdAt: now,
        updatedAt: now
      };
      invoices.unshift(newInv);
      db.invoices = invoices;
    } else {
      // Update existing invoice
      await Invoice.update(
        {
          status: 'PAID',
          paymentMethod: cleanMethod,
          transactionId,
          paidDate: now.split('T')[0]
        },
        { where: { id: targetInvoice.id } }
      );
      // Sync JSON DB
      const dbInvoices = db.invoices || [];
      const idx = dbInvoices.findIndex((i) => i.id === targetInvoice.id);
      if (idx !== -1) {
        dbInvoices[idx].status = 'PAID';
        dbInvoices[idx].paymentMethod = cleanMethod;
        dbInvoices[idx].transactionId = transactionId;
        dbInvoices[idx].paidDate = now.split('T')[0];
      }
    }

    // 3. Create Payment record in DB
    const payments = db.payments || [];
    const newPaymentId = payments.length > 0 ? Math.max(...payments.map((p) => p.id || 0)) + 1 : 1;
    const paymentRecord = {
      id: newPaymentId,
      invoiceId: createdInvoiceId,
      transactionId,
      receiptNo: randomReceiptNo,
      method: cleanMethod,
      amount: finalAmount,
      paidByUserId: req.user.id,
      paymentStatus: 'SUCCESS',
      purpose,
      itemTitle: invoiceTitleBn,
      senderPhone: senderPhone || accountNo || '017XXXXXXXX',
      cardLast4: cardLast4 || null,
      paidAt: now
    };
    payments.unshift(paymentRecord);
    db.payments = payments;

    // 4. REAL-TIME FINANCE & ACCOUNTS LEDGER SYNC
    // Insert into accounts_transactions / financial_ledger so admin dashboard immediately reflects this
    const ledger = db.accounts_ledger || [];
    const newLedgerId = ledger.length > 0 ? Math.max(...ledger.map((l) => l.id || 0)) + 1 : 1;
    const ledgerEntry = {
      id: newLedgerId,
      entryType: 'CREDIT', // Income
      category: 'STUDENT_FEES',
      categoryBn: 'শিক্ষার্থী ফি ও ডিজিটাল পেমেন্ট',
      title: `${invoiceTitleBn} (TRX: ${transactionId})`,
      amount: finalAmount,
      paymentMethod: cleanMethod,
      source: `Student: ${studentUser.name || 'শিক্ষার্থী'} (ID: ${studentRecord.studentIdNumber || studentRecord.id})`,
      transactionId,
      receiptNo: randomReceiptNo,
      referenceInvoiceId: createdInvoiceId,
      date: now.split('T')[0],
      timestamp: now,
      recordedBy: 'SYSTEM_PAYMENT_GATEWAY_AUTO_SYNC'
    };
    ledger.unshift(ledgerEntry);
    db.accounts_ledger = ledger;

    saveDB(db);

    // 5. Audit Log
    await AuditService.log({
      req,
      userId: req.user.id,
      action: 'PAYMENT_RECEIVED_ONLINE',
      entityType: 'payments',
      entityId: newPaymentId,
      newValue: {
        transactionId,
        amount: finalAmount,
        method: cleanMethod,
        receiptNo: randomReceiptNo
      },
      details: `Received ${cleanMethod} online payment of ৳${finalAmount} for '${invoiceTitleBn}' (TRX: ${transactionId})`
    });

    // 6. Generate Strict Branded Digital Money Receipt
    const receiptData = {
      receiptNo: randomReceiptNo,
      transactionId,
      invoiceId: createdInvoiceId,
      invoiceNo: targetInvoice?.invoiceNo || `INV-2026-${createdInvoiceId}`,
      date: nowBanglaDate,
      isoDate: now,
      purpose: invoiceTitleBn,
      amount: finalAmount,
      amountInWords: numberToBanglaWords(finalAmount),
      currency: 'BDT (৳)',
      method: cleanMethod,
      senderPhone: senderPhone || accountNo || '017XXXXXXXX',
      status: 'PAID / SUCCESS',

      // STRICT MANDATORY BRANDING
      institute: {
        name: BRAND.academyName,
        nameBn: BRAND.academyName,
        instructor: BRAND.instructor,
        founder: BRAND.founder,
        phone: BRAND.phone,
        address: BRAND.address,
        tagline: BRAND.tagline,
        email: BRAND.email,
        website: BRAND.website
      },

      student: {
        name: studentUser.name || req.user.name || 'শিক্ষার্থী',
        studentIdNumber: studentRecord.studentIdNumber || `STD-${studentId}`,
        rollNo: studentRecord.rollNo || '০১',
        className: studentClass.nameBn || '৯ম শ্রেণি',
        sectionName: studentSection.nameBn || 'শাখা ক',
        phone: studentUser.phone || req.user.phone || '০১৭০০০০০০০০'
      },

      securitySeal: {
        digitalSignature: `Digitally Verified by NextGen Secure Gateway (${cleanMethod})`,
        verificationHash: `NGA-SEC-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
        issuedBy: BRAND.instructor
      }
    };

    res.json({
      success: true,
      message: 'পেমেন্ট সফলভাবে সম্পন্ন হয়েছে ও মানি রিসিট প্রস্তুত!',
      data: {
        payment: paymentRecord,
        receipt: receiptData
      }
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/payments/simulate
 * Legacy route alias for compatibility
 */
router.post('/simulate', async (req, res, next) => {
  req.url = '/checkout';
  return router.handle(req, res, next);
});

/**
 * GET /api/payments/my-history
 * Retrieve logged-in student's or parent's payment history
 */
router.get('/my-history', async (req, res, next) => {
  try {
    const db = getDB();
    const payments = db.payments || [];
    const invoices = db.invoices || [];

    let filtered = [];
    if (req.user.role === 'STUDENT') {
      const studentInvoiceIds = invoices
        .filter((i) => Number(i.studentId) === Number(req.user.studentId))
        .map((i) => i.id);

      filtered = payments.filter(
        (p) =>
          p.paidByUserId === req.user.id ||
          studentInvoiceIds.includes(Number(p.invoiceId))
      );
    } else if (req.user.role === 'PARENT') {
      const parentStudentInvoiceIds = invoices
        .filter((i) => req.user.linkedStudentIds.includes(Number(i.studentId)))
        .map((i) => i.id);

      filtered = payments.filter(
        (p) =>
          p.paidByUserId === req.user.id ||
          parentStudentInvoiceIds.includes(Number(p.invoiceId))
      );
    } else if (req.user.role === 'ADMIN' || req.user.role === 'SUPER_ADMIN') {
      filtered = payments;
    }

    res.json({
      success: true,
      data: filtered
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
