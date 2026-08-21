const express = require('express');
const { Textbook, Class, Subject } = require('../models');
const { authenticate, requireRole } = require('../middleware/auth');
const AuditService = require('../services/auditService');

const router = express.Router();

/**
 * GET /api/textbooks
 * List digital textbooks filtered by class, subject or search
 */
router.get('/', authenticate, async (req, res, next) => {
  try {
    const { classId, subjectId, search } = req.query;
    const where = {};

    if (classId) {
      where.classId = Number(classId);
    }
    if (subjectId) {
      where.subjectId = Number(subjectId);
    }

    let textbooks = await Textbook.findAll({
      where,
      include: [
        { model: Class, as: 'class' },
        { model: Subject, as: 'subject' }
      ],
      order: [['id', 'DESC']]
    });

    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      textbooks = textbooks.filter(tb => {
        const titleBn = (tb.titleBn || '').toLowerCase();
        const titleEn = (tb.titleEn || '').toLowerCase();
        const edition = (tb.edition || '').toLowerCase();
        const subName = (tb.subject?.nameBn || '').toLowerCase();
        const clsName = (tb.class?.nameBn || '').toLowerCase();
        return titleBn.includes(q) || titleEn.includes(q) || edition.includes(q) || subName.includes(q) || clsName.includes(q);
      });
    }

    res.json({
      success: true,
      data: textbooks
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/textbooks
 * Add a new Digital Textbook / E-Book (Admin & Teacher only)
 */
router.post('/', authenticate, requireRole(['ADMIN', 'TEACHER']), async (req, res, next) => {
  try {
    const {
      titleBn,
      titleEn,
      classId,
      subjectId,
      edition = 'NCTB ২০২৬ সংস্করণ (জাতীয় শিক্ষাক্রম)',
      author = 'জাতীয় শিক্ষাক্রম ও পাঠ্যপুস্তক বোর্ড (NCTB)',
      coverImage = null,
      fileUrl = 'https://nctb.gov.bd/textbooks/sample-nctb-2026.pdf',
      fileSize = '14.5 MB',
      totalPages = 180,
      description = ''
    } = req.body;

    if (!titleBn || !classId || !subjectId) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'বইয়ের নাম, শ্রেণি এবং বিষয় আবশ্যক / Book title, class, and subject are required'
        }
      });
    }

    const created = await Textbook.create({
      titleBn,
      titleEn: titleEn || titleBn,
      classId: Number(classId),
      subjectId: Number(subjectId),
      edition,
      author,
      coverImage: coverImage || null,
      fileUrl: fileUrl || 'https://nctb.gov.bd/textbooks/sample-nctb-2026.pdf',
      fileSize,
      totalPages: Number(totalPages) || 150,
      description,
      uploadedByUserId: req.user.id,
      uploadedAt: new Date().toISOString()
    });

    await AuditService.log({
      req,
      userId: req.user.id,
      action: 'CREATE_TEXTBOOK',
      entityType: 'textbook',
      entityId: created.id,
      newValue: created,
      details: `${req.user.role} নতুন পাঠ্যবই যুক্ত করেছেন: "${titleBn}" (${edition})`
    });

    const populated = await Textbook.findByPk(created.id, {
      include: [
        { model: Class, as: 'class' },
        { model: Subject, as: 'subject' }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'পাঠ্যপুস্তক সফলভাবে ই-লাইব্রেরিতে যুক্ত করা হয়েছে',
      data: populated
    });
  } catch (err) {
    next(err);
  }
});

/**
 * PUT /api/textbooks/:id
 * Update an existing Textbook
 */
router.put('/:id', authenticate, requireRole(['ADMIN', 'TEACHER']), async (req, res, next) => {
  try {
    const textbook = await Textbook.findByPk(req.params.id);
    if (!textbook) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Textbook not found' }
      });
    }

    const {
      titleBn,
      titleEn,
      classId,
      subjectId,
      edition,
      author,
      coverImage,
      fileUrl,
      fileSize,
      totalPages,
      description
    } = req.body;

    const updateData = {
      ...(titleBn && { titleBn }),
      ...(titleEn && { titleEn }),
      ...(classId && { classId: Number(classId) }),
      ...(subjectId && { subjectId: Number(subjectId) }),
      ...(edition && { edition }),
      ...(author && { author }),
      ...(coverImage !== undefined && { coverImage }),
      ...(fileUrl && { fileUrl }),
      ...(fileSize && { fileSize }),
      ...(totalPages && { totalPages: Number(totalPages) }),
      ...(description !== undefined && { description })
    };

    await Textbook.update(updateData, { where: { id: textbook.id } });

    await AuditService.log({
      req,
      userId: req.user.id,
      action: 'UPDATE_TEXTBOOK',
      entityType: 'textbook',
      entityId: textbook.id,
      details: `${req.user.role} পাঠ্যবই সম্পাদনা করেছেন: ID #${textbook.id}`
    });

    const updated = await Textbook.findByPk(textbook.id, {
      include: [
        { model: Class, as: 'class' },
        { model: Subject, as: 'subject' }
      ]
    });

    res.json({
      success: true,
      message: 'পাঠ্যবইয়ের তথ্য সফলভাবে আপডেট করা হয়েছে',
      data: updated
    });
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /api/textbooks/:id
 * Delete a Textbook from digital library
 */
router.delete('/:id', authenticate, requireRole(['ADMIN', 'TEACHER']), async (req, res, next) => {
  try {
    const textbook = await Textbook.findByPk(req.params.id);
    if (!textbook) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Textbook not found' }
      });
    }

    await Textbook.destroy({ where: { id: textbook.id } });

    await AuditService.log({
      req,
      userId: req.user.id,
      action: 'DELETE_TEXTBOOK',
      entityType: 'textbook',
      entityId: textbook.id,
      details: `${req.user.role} পাঠ্যবই মুছে ফেলেছেন: "${textbook.titleBn}" (ID #${textbook.id})`
    });

    res.json({
      success: true,
      message: 'পাঠ্যপুস্তক সফলভাবে ই-লাইব্রেরি থেকে মুছে ফেলা হয়েছে'
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
