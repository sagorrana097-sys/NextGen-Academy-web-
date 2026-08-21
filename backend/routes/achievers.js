const express = require('express');
const { Achiever } = require('../models');
const { authenticate, requireRole } = require('../middleware/auth');
const AuditService = require('../services/auditService');

const router = express.Router();

/**
 * GET /api/achievers
 * Public endpoint: Returns all active top achievers
 */
router.get('/', async (req, res, next) => {
  try {
    const { examType, limit } = req.query;
    let achievers = await Achiever.findAll();

    if (examType && examType !== 'ALL') {
      achievers = achievers.filter(a => a.examType === examType);
    }

    // Default sort by order ASC, then id DESC
    achievers.sort((a, b) => (a.order || 99) - (b.order || 99));

    if (limit) {
      achievers = achievers.slice(0, Number(limit));
    }

    res.json({
      success: true,
      data: achievers
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/achievers (or /api/admin/achievers)
 * Admin only: Create new top achiever
 */
router.post('/', authenticate, requireRole(['ADMIN', 'SUPER_ADMIN']), async (req, res, next) => {
  try {
    const {
      nameBn,
      nameEn,
      studentPhoto,
      examType,
      examYear,
      gpa,
      institute,
      badge,
      quoteBn,
      order,
      isActive
    } = req.body;

    if (!nameBn || !gpa) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'শিক্ষার্থীর নাম ও জিপিএ/স্কোর আবশ্যক' }
      });
    }

    const created = await Achiever.create({
      nameBn,
      nameEn: nameEn || nameBn,
      studentPhoto: studentPhoto || '',
      examType: examType || 'HSC',
      examYear: examYear || '২০২৫',
      gpa,
      institute: institute || 'ঢাকা',
      badge: badge || 'Golden A+',
      quoteBn: quoteBn || 'নেক্সটজেন একাডেমিতে পড়াশোনা করে আমার স্বপ্ন পূরণ হয়েছে।',
      order: Number(order) || 1,
      isActive: isActive !== false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    await AuditService.log({
      req,
      userId: req.user.id,
      action: 'CREATE_TOP_ACHIEVER',
      entityType: 'achiever',
      entityId: String(created.id),
      details: `${req.user.name} হল অফ ফেমে নতুন কৃতি শিক্ষার্থী যোগ করেছেন: "${nameBn}" (${gpa})`
    });

    res.status(201).json({
      success: true,
      message: 'কৃতি শিক্ষার্থীর তথ্য সফলভাবে সংরক্ষিত হয়েছে!',
      data: created
    });
  } catch (err) {
    next(err);
  }
});

/**
 * PUT /api/achievers/:id
 * Admin only: Update top achiever record
 */
router.put('/:id', authenticate, requireRole(['ADMIN', 'SUPER_ADMIN']), async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const existing = await Achiever.findOne({ where: { id } });
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: { code: 'ACHIEVER_NOT_FOUND', message: 'কৃতি শিক্ষার্থীর তথ্য পাওয়া যায়নি' }
      });
    }

    const {
      nameBn,
      nameEn,
      studentPhoto,
      examType,
      examYear,
      gpa,
      institute,
      badge,
      quoteBn,
      order,
      isActive
    } = req.body;

    await Achiever.update({
      nameBn: nameBn || existing.nameBn,
      nameEn: nameEn !== undefined ? nameEn : existing.nameEn,
      studentPhoto: studentPhoto !== undefined ? studentPhoto : existing.studentPhoto,
      examType: examType || existing.examType,
      examYear: examYear || existing.examYear,
      gpa: gpa || existing.gpa,
      institute: institute !== undefined ? institute : existing.institute,
      badge: badge !== undefined ? badge : existing.badge,
      quoteBn: quoteBn !== undefined ? quoteBn : existing.quoteBn,
      order: order !== undefined ? Number(order) : existing.order,
      isActive: isActive !== undefined ? isActive : existing.isActive,
      updatedAt: new Date().toISOString()
    }, { where: { id } });

    const updated = await Achiever.findOne({ where: { id } });

    await AuditService.log({
      req,
      userId: req.user.id,
      action: 'UPDATE_TOP_ACHIEVER',
      entityType: 'achiever',
      entityId: String(id),
      details: `${req.user.name} কৃতি শিক্ষার্থীর তথ্য আপডেট করেছেন: "${updated.nameBn}"`
    });

    res.json({
      success: true,
      message: 'তথ্য সফলভাবে আপডেট করা হয়েছে!',
      data: updated
    });
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /api/achievers/:id
 * Admin only: Delete top achiever record
 */
router.delete('/:id', authenticate, requireRole(['ADMIN', 'SUPER_ADMIN']), async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const existing = await Achiever.findOne({ where: { id } });
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: { code: 'ACHIEVER_NOT_FOUND', message: 'কৃতি শিক্ষার্থীর তথ্য পাওয়া যায়নি' }
      });
    }

    await Achiever.destroy({ where: { id } });

    await AuditService.log({
      req,
      userId: req.user.id,
      action: 'DELETE_TOP_ACHIEVER',
      entityType: 'achiever',
      entityId: String(id),
      details: `${req.user.name} হল অফ ফেম থেকে শিক্ষার্থী মুছে ফেলেছেন: "${existing.nameBn}"`
    });

    res.json({
      success: true,
      message: 'কৃতি শিক্ষার্থীর রেকর্ড সফলভাবে মুছে ফেলা হয়েছে!'
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
