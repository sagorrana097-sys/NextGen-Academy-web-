const express = require('express');
const { PaymentMethod } = require('../models');
const { authenticate, requireRole } = require('../middleware/auth');
const AuditService = require('../services/auditService');

const router = express.Router();

/**
 * GET /api/payments/methods & GET /api/payments-methods
 * Public endpoint - returns only active payment methods
 */
router.get('/methods', async (req, res, next) => {
  try {
    const methods = await PaymentMethod.findAll({
      where: { isActive: true },
      order: [['id', 'ASC']]
    });

    res.json({
      success: true,
      data: methods
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/admin/payments/methods & GET /api/payments/admin/methods
 * Admin endpoint - returns all payment methods (active & inactive)
 */
router.get('/admin/methods', authenticate, requireRole('ADMIN'), async (req, res, next) => {
  try {
    const methods = await PaymentMethod.findAll({
      order: [['id', 'ASC']]
    });

    res.json({
      success: true,
      data: methods
    });
  } catch (err) {
    next(err);
  }
});

router.get('/', authenticate, requireRole('ADMIN'), async (req, res, next) => {
  try {
    const methods = await PaymentMethod.findAll({
      order: [['id', 'ASC']]
    });

    res.json({
      success: true,
      data: methods
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/admin/payments/methods & POST /api/payments/admin/methods
 * Admin endpoint - Add a new payment method
 */
router.post('/admin/methods', authenticate, requireRole('ADMIN'), async (req, res, next) => {
  try {
    const { provider, accountType, accountNumber, qrCodeUrl, instructions, isActive } = req.body;

    if (!provider || !accountNumber) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_DATA', message: 'পেমেন্ট মাধ্যম (Provider) এবং অ্যাকাউন্ট নম্বর আবশ্যক' }
      });
    }

    const newMethod = await PaymentMethod.create({
      provider: String(provider).trim(),
      accountType: accountType || 'Merchant',
      accountNumber: String(accountNumber).trim(),
      qrCodeUrl: qrCodeUrl || '',
      instructions: instructions || '',
      isActive: isActive !== false
    });

    await AuditService.log({
      req,
      userId: req.user.id,
      action: 'CREATE_PAYMENT_METHOD',
      entityType: 'payment_methods',
      entityId: newMethod.id,
      newValue: newMethod
    });

    res.status(201).json({
      success: true,
      message: 'নতুন পেমেন্ট মাধ্যম সফলভাবে যুক্ত করা হয়েছে',
      data: newMethod
    });
  } catch (err) {
    next(err);
  }
});

router.post('/', authenticate, requireRole('ADMIN'), async (req, res, next) => {
  try {
    const { provider, accountType, accountNumber, qrCodeUrl, instructions, isActive } = req.body;

    if (!provider || !accountNumber) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_DATA', message: 'পেমেন্ট মাধ্যম (Provider) এবং অ্যাকাউন্ট নম্বর আবশ্যক' }
      });
    }

    const newMethod = await PaymentMethod.create({
      provider: String(provider).trim(),
      accountType: accountType || 'Merchant',
      accountNumber: String(accountNumber).trim(),
      qrCodeUrl: qrCodeUrl || '',
      instructions: instructions || '',
      isActive: isActive !== false
    });

    await AuditService.log({
      req,
      userId: req.user.id,
      action: 'CREATE_PAYMENT_METHOD',
      entityType: 'payment_methods',
      entityId: newMethod.id,
      newValue: newMethod
    });

    res.status(201).json({
      success: true,
      message: 'নতুন পেমেন্ট মাধ্যম সফলভাবে যুক্ত করা হয়েছে',
      data: newMethod
    });
  } catch (err) {
    next(err);
  }
});

/**
 * PUT /api/admin/payments/methods/:id & PUT /api/payments/admin/methods/:id
 * Admin endpoint - Update payment method details or status
 */
const handleUpdate = async (req, res, next) => {
  try {
    const methodId = Number(req.params.id);
    const existing = await PaymentMethod.findByPk(methodId);

    if (!existing) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'পেমেন্ট মাধ্যম পাওয়া যায়নি' }
      });
    }

    const { provider, accountType, accountNumber, qrCodeUrl, instructions, isActive } = req.body;

    const updatePayload = {};
    if (provider !== undefined) updatePayload.provider = String(provider).trim();
    if (accountType !== undefined) updatePayload.accountType = accountType;
    if (accountNumber !== undefined) updatePayload.accountNumber = String(accountNumber).trim();
    if (qrCodeUrl !== undefined) updatePayload.qrCodeUrl = qrCodeUrl;
    if (instructions !== undefined) updatePayload.instructions = instructions;
    if (isActive !== undefined) updatePayload.isActive = Boolean(isActive);

    await PaymentMethod.update(updatePayload, { where: { id: methodId } });
    const updatedRecord = await PaymentMethod.findByPk(methodId);

    await AuditService.log({
      req,
      userId: req.user.id,
      action: 'UPDATE_PAYMENT_METHOD',
      entityType: 'payment_methods',
      entityId: methodId,
      oldValue: existing,
      newValue: updatedRecord
    });

    res.json({
      success: true,
      message: 'পেমেন্ট মাধ্যম সফলভাবে আপডেট করা হয়েছে',
      data: updatedRecord
    });
  } catch (err) {
    next(err);
  }
};

router.put('/admin/methods/:id', authenticate, requireRole('ADMIN'), handleUpdate);
router.put('/:id', authenticate, requireRole('ADMIN'), handleUpdate);
router.patch('/admin/methods/:id', authenticate, requireRole('ADMIN'), handleUpdate);
router.patch('/:id', authenticate, requireRole('ADMIN'), handleUpdate);

/**
 * DELETE /api/admin/payments/methods/:id & DELETE /api/payments/admin/methods/:id
 * Admin endpoint - Delete a payment method
 */
const handleDelete = async (req, res, next) => {
  try {
    const methodId = Number(req.params.id);
    const existing = await PaymentMethod.findByPk(methodId);

    if (!existing) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'পেমেন্ট মাধ্যম পাওয়া যায়নি' }
      });
    }

    await PaymentMethod.destroy({ where: { id: methodId } });

    await AuditService.log({
      req,
      userId: req.user.id,
      action: 'DELETE_PAYMENT_METHOD',
      entityType: 'payment_methods',
      entityId: methodId,
      oldValue: existing
    });

    res.json({
      success: true,
      message: 'পেমেন্ট মাধ্যম সফলভাবে মুছে ফেলা হয়েছে'
    });
  } catch (err) {
    next(err);
  }
};

router.delete('/admin/methods/:id', authenticate, requireRole('ADMIN'), handleDelete);
router.delete('/:id', authenticate, requireRole('ADMIN'), handleDelete);

module.exports = router;
