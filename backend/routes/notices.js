const express = require('express');
const { Notice, User } = require('../models');
const { authenticate, requireRole } = require('../middleware/auth');
const AuditService = require('../services/auditService');

const router = express.Router();

/**
 * GET /api/notices
 * Fetch notices with filtering by target role, category, search
 */
router.get('/', async (req, res, next) => {
  try {
    const { role, category, search } = req.query;

    let notices = await Notice.findAll({
      include: [{ model: User, as: 'author' }],
      order: [['publishedAt', 'DESC']]
    });

    if (role) {
      notices = notices.filter(
        n => n.targetRole === 'ALL' || n.targetRole === String(role).toUpperCase()
      );
    }

    if (category && category !== 'ALL') {
      notices = notices.filter(n => n.category === category);
    }

    if (search) {
      const q = search.toLowerCase();
      notices = notices.filter(n =>
        (n.titleBn && n.titleBn.toLowerCase().includes(q)) ||
        (n.titleEn && n.titleEn.toLowerCase().includes(q)) ||
        (n.contentBn && n.contentBn.toLowerCase().includes(q)) ||
        (n.contentEn && n.contentEn.toLowerCase().includes(q))
      );
    }

    // Sort order: isPinned FIRST, then Priority (URGENT > HIGH > NORMAL), then publishedAt DESC
    const priorityWeight = { URGENT: 3, HIGH: 2, NORMAL: 1 };
    notices.sort((a, b) => {
      const pinA = a.isPinned ? 1 : 0;
      const pinB = b.isPinned ? 1 : 0;
      if (pinB !== pinA) return pinB - pinA;

      const pDiff = (priorityWeight[b.priority] || 1) - (priorityWeight[a.priority] || 1);
      if (pDiff !== 0) return pDiff;

      return new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0);
    });

    res.json({
      success: true,
      data: notices
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/notices/:id
 */
router.get('/:id', async (req, res, next) => {
  try {
    const notice = await Notice.findByPk(Number(req.params.id), {
      include: [{ model: User, as: 'author' }]
    });

    if (!notice) {
      return res.status(404).json({ success: false, error: { message: 'নোটিশটি পাওয়া যায়নি / Notice not found' } });
    }

    res.json({
      success: true,
      data: notice
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/notices
 * Admin-only: Create new notice
 */
router.post('/', authenticate, requireRole('ADMIN'), async (req, res, next) => {
  try {
    const {
      titleBn,
      titleEn,
      contentBn,
      contentEn,
      category = 'ACADEMIC',
      priority = 'NORMAL',
      targetRole = 'ALL',
      isPinned = false,
      attachmentUrl = '',
      attachmentName = '',
      attachmentSize = '',
      pdfUrl = '',
      routineUrl = '',
      examDate = ''
    } = req.body;

    if (!titleBn || !contentBn) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'নোটিশের শিরোনাম ও বিস্তারিত বিবরণ বাংলায় পূরণ করা আবশ্যক'
        }
      });
    }

    const effectiveAttachment = attachmentUrl || pdfUrl || routineUrl || '';

    const newNotice = await Notice.create({
      titleBn,
      titleEn: titleEn || titleBn,
      contentBn,
      contentEn: contentEn || contentBn,
      category,
      priority,
      targetRole,
      isPinned: !!isPinned,
      attachmentUrl: effectiveAttachment,
      attachmentName: attachmentName || (effectiveAttachment ? 'Exam_Routine.pdf' : ''),
      attachmentSize: attachmentSize || '',
      pdfUrl: effectiveAttachment,
      routineUrl: effectiveAttachment,
      examDate: examDate || '',
      authorUserId: req.user.id,
      publishedAt: new Date().toISOString()
    });

    await AuditService.log({
      req,
      userId: req.user.id,
      action: 'NOTICE_PUBLISH',
      entityType: 'notices',
      entityId: newNotice.id,
      newValue: newNotice,
      details: `Published notice "${newNotice.titleBn}" (Priority: ${newNotice.priority}, Pinned: ${newNotice.isPinned})`
    });

    const populated = await Notice.findByPk(newNotice.id, {
      include: [{ model: User, as: 'author' }]
    });

    res.status(201).json({
      success: true,
      message: 'নতুন নোটিশ সফলভাবে প্রকাশ করা হয়েছে! / Notice published successfully',
      data: populated
    });
  } catch (err) {
    next(err);
  }
});

/**
 * PUT /api/notices/:id
 * Admin-only: Update notice
 */
router.put('/:id', authenticate, requireRole('ADMIN'), async (req, res, next) => {
  try {
    const noticeId = Number(req.params.id);
    const notice = await Notice.findByPk(noticeId);

    if (!notice) {
      return res.status(404).json({ success: false, error: { message: 'নোটিশটি পাওয়া যায়নি / Notice not found' } });
    }

    const {
      titleBn,
      titleEn,
      contentBn,
      contentEn,
      category,
      priority,
      targetRole,
      isPinned,
      attachmentUrl,
      attachmentName,
      attachmentSize,
      pdfUrl,
      routineUrl,
      examDate
    } = req.body;

    const updateData = {};
    if (titleBn !== undefined) updateData.titleBn = titleBn;
    if (titleEn !== undefined) updateData.titleEn = titleEn;
    if (contentBn !== undefined) updateData.contentBn = contentBn;
    if (contentEn !== undefined) updateData.contentEn = contentEn;
    if (category !== undefined) updateData.category = category;
    if (priority !== undefined) updateData.priority = priority;
    if (targetRole !== undefined) updateData.targetRole = targetRole;
    if (isPinned !== undefined) updateData.isPinned = !!isPinned;
    if (attachmentUrl !== undefined) updateData.attachmentUrl = attachmentUrl;
    if (attachmentName !== undefined) updateData.attachmentName = attachmentName;
    if (attachmentSize !== undefined) updateData.attachmentSize = attachmentSize;
    if (pdfUrl !== undefined) updateData.pdfUrl = pdfUrl;
    if (routineUrl !== undefined) updateData.routineUrl = routineUrl;
    if (examDate !== undefined) updateData.examDate = examDate;

    await Notice.update(updateData, { where: { id: noticeId } });

    await AuditService.log({
      req,
      userId: req.user.id,
      action: 'NOTICE_UPDATE',
      entityType: 'notices',
      entityId: noticeId,
      details: `Updated notice ID ${noticeId}: "${titleBn || notice.titleBn}"`
    });

    const updated = await Notice.findByPk(noticeId, {
      include: [{ model: User, as: 'author' }]
    });

    res.json({
      success: true,
      message: 'নোটিশ সফলভাবে আপডেট করা হয়েছে! / Notice updated successfully',
      data: updated
    });
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /api/notices/:id
 * Admin-only: Delete notice
 */
router.delete('/:id', authenticate, requireRole('ADMIN'), async (req, res, next) => {
  try {
    const noticeId = Number(req.params.id);
    const notice = await Notice.findByPk(noticeId);

    if (!notice) {
      return res.status(404).json({ success: false, error: { message: 'নোটিশটি পাওয়া যায়নি' } });
    }

    await Notice.destroy({ where: { id: noticeId } });

    await AuditService.log({
      req,
      userId: req.user.id,
      action: 'NOTICE_DELETE',
      entityType: 'notices',
      entityId: noticeId,
      details: `Deleted notice: "${notice.titleBn}"`
    });

    res.json({
      success: true,
      message: 'নোটিশ সফলভাবে মুছে ফেলা হয়েছে / Notice deleted successfully'
    });
  } catch (err) {
    next(err);
  }
});

/**
 * PATCH /api/notices/:id/pin
 * Admin-only: Fast toggle pinned to homepage
 */
router.patch('/:id/pin', authenticate, requireRole('ADMIN'), async (req, res, next) => {
  try {
    const noticeId = Number(req.params.id);
    const notice = await Notice.findByPk(noticeId);

    if (!notice) {
      return res.status(404).json({ success: false, error: { message: 'নোটিশটি পাওয়া যায়নি' } });
    }

    const isPinned = req.body.isPinned !== undefined ? Boolean(req.body.isPinned) : !notice.isPinned;
    await Notice.update({ isPinned }, { where: { id: noticeId } });

    res.json({
      success: true,
      message: isPinned ? 'নোটিশটি হোমপেজে পিন করা হয়েছে!' : 'নোটিশটি আনপিন করা হয়েছে!',
      isPinned
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

