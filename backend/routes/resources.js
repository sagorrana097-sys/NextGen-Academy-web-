const express = require('express');
const jwt = require('jsonwebtoken');
const { Class, Subject, Teacher, Student, User } = require('../models');
const { Model } = require('../config/db');
const { authenticate, requireRole, JWT_SECRET } = require('../middleware/auth');
const AuditService = require('../services/auditService');

const Resource = new Model('resources');
const router = express.Router();

// Helper: Extract user from token if available without failing
function getAuthUser(req) {
  try {
    let token = null;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }
    if (!token) return null;
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}

// Helper: Evaluate whether the user has permission to download/open non-free files
function evaluateResourceAccess(user, resource) {
  const isFree = Boolean(resource.isFree);
  if (isFree) {
    return { isLocked: false, reason: 'FREE_RESOURCE' };
  }

  if (!user) {
    return { isLocked: true, reason: 'UNAUTHENTICATED' };
  }

  if (user.role === 'ADMIN' || user.role === 'TEACHER') {
    return { isLocked: false, reason: 'STAFF_ACCESS' };
  }

  if (user.role === 'STUDENT' || user.role === 'PARENT') {
    if (user.paymentStatus === 'UNPAID' || user.isEnrolled === false) {
      return { isLocked: true, reason: 'PAYMENT_REQUIRED' };
    }
    return { isLocked: false, reason: 'ENROLLED_STUDENT' };
  }

  return { isLocked: true, reason: 'LOCKED' };
}

// Helper: Format resource response masking sensitive fileUrl if locked
function formatResourceResponse(resource, user) {
  const resObj = resource.toJSON ? resource.toJSON() : { ...resource };
  const access = evaluateResourceAccess(user, resObj);
  const isFree = Boolean(resObj.isFree);
  const isLocked = access.isLocked;

  const rawFileUrl = resObj.fileUrl || resObj.downloadUrl || '';

  return {
    ...resObj,
    isFree,
    isLocked,
    lockReason: access.reason,
    fileType: resObj.fileType || 'হ্যান্ডনোট',
    fileUrl: isLocked ? '' : rawFileUrl,
    downloadUrl: isLocked ? '' : rawFileUrl
  };
}

/**
 * GET /api/resources
 * Public endpoint to list resources (e-books, handnotes, suggestions, question banks)
 * Filterable by classId, subjectId, fileType, isFree, search
 */
router.get('/', async (req, res, next) => {
  try {
    const user = getAuthUser(req);
    const { classId, subjectId, fileType, isFree, search } = req.query;

    const where = {};
    if (classId) where.classId = Number(classId);
    if (subjectId) where.subjectId = Number(subjectId);
    if (fileType) where.fileType = fileType;
    if (isFree !== undefined) where.isFree = isFree === 'true' || isFree === true;

    let resources = await Resource.findAll({
      where,
      order: [['id', 'DESC']]
    });

    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      resources = resources.filter(r =>
        (r.title && r.title.toLowerCase().includes(q)) ||
        (r.titleBn && r.titleBn.toLowerCase().includes(q)) ||
        (r.titleEn && r.titleEn.toLowerCase().includes(q)) ||
        (r.subjectName && r.subjectName.toLowerCase().includes(q)) ||
        (r.author && r.author.toLowerCase().includes(q)) ||
        (r.description && r.description.toLowerCase().includes(q)) ||
        (r.fileType && r.fileType.toLowerCase().includes(q))
      );
    }

    const formatted = resources.map(r => formatResourceResponse(r, user));

    res.json({
      success: true,
      data: formatted
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/resources/:id
 * Retrieve a specific resource. Enforces 403 Forbidden for locked resources when accessed unauthorized.
 */
router.get('/:id', async (req, res, next) => {
  try {
    const resource = await Resource.findByPk(req.params.id);
    if (!resource) {
      return res.status(404).json({
        success: false,
        error: { code: 'RESOURCE_NOT_FOUND', message: 'রিসোর্স বা ই-বুক ফাইল খুঁজে পাওয়া যায়নি' }
      });
    }

    const user = getAuthUser(req);
    const access = evaluateResourceAccess(user, resource);

    if (access.isLocked) {
      return res.status(403).json({
        success: false,
        isLocked: true,
        error: {
          code: 'ACCESS_LOCKED',
          message: 'সম্পূর্ণ নোট ও ই-বুক পেতে অনলাইন ভর্তি সম্পন্ন করুন (Locked Resource - Admission Required)',
          reason: access.reason
        },
        data: {
          id: resource.id,
          title: resource.title || resource.titleBn,
          isFree: false,
          isLocked: true,
          fileType: resource.fileType || 'হ্যান্ডনোট',
          classGrade: resource.classGrade || 'Class 9'
        }
      });
    }

    res.json({
      success: true,
      data: formatResourceResponse(resource, user)
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/resources and /api/admin/resources
 * Add a new educational resource / e-book with isFree toggle (Admin/Teacher only)
 */
router.post('/', authenticate, requireRole(['ADMIN', 'TEACHER']), async (req, res, next) => {
  try {
    const {
      title,
      titleBn,
      titleEn,
      subjectId,
      subjectName,
      classId,
      classGrade,
      edition,
      author,
      fileType = 'হ্যান্ডনোট',
      fileUrl,
      fileSize = '2.5 MB',
      totalPages = 20,
      description = '',
      isFree = false
    } = req.body;

    const finalTitle = titleBn || title || titleEn;
    if (!finalTitle || !fileUrl) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'রিসোর্সের শিরোনাম এবং ফাইল ডাউনলোড লিঙ্ক (PDF/Drive Link) আবশ্যক।'
        }
      });
    }

    const newResource = await Resource.create({
      title: finalTitle.trim(),
      titleBn: finalTitle.trim(),
      titleEn: (titleEn || finalTitle).trim(),
      subjectId: subjectId ? Number(subjectId) : null,
      subjectName: subjectName || 'সাধারণ বিষয়',
      classId: classId ? Number(classId) : null,
      classGrade: classGrade || (classId ? `Class ${classId}` : 'সকল শ্রেণি'),
      edition: edition || 'নেক্সটজেন একাডেমি শিক্ষাবর্ষ ২০২৬',
      author: author || (req.user.name ? `${req.user.name} (${req.user.role})` : 'নেক্সটজেন শিক্ষক প্যানেল'),
      fileType: fileType || 'হ্যান্ডনোট',
      fileUrl: fileUrl.trim(),
      fileSize: fileSize || '3.5 MB',
      totalPages: Number(totalPages) || 15,
      description: description ? description.trim() : '',
      isFree: Boolean(isFree),
      downloadCount: 0,
      publishedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    await AuditService.log({
      req,
      action: 'CREATE_RESOURCE',
      entityType: 'Resource',
      entityId: newResource.id,
      newValue: newResource,
      details: `Added new resource: "${newResource.title}" (isFree: ${Boolean(isFree)}, type: ${newResource.fileType})`
    });

    res.status(201).json({
      success: true,
      message: 'রিসোর্স ও ই-বুক সফলভাবে যুক্ত করা হয়েছে',
      data: formatResourceResponse(newResource, req.user)
    });
  } catch (err) {
    next(err);
  }
});

/**
 * PUT /api/resources/:id and /api/admin/resources/:id
 * Update an existing resource with isFree toggle (Admin/Teacher only)
 */
router.put('/:id', authenticate, requireRole(['ADMIN', 'TEACHER']), async (req, res, next) => {
  try {
    const existing = await Resource.findByPk(req.params.id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'রিসোর্স খুঁজে পাওয়া যায়নি' }
      });
    }

    const finalTitle = req.body.titleBn || req.body.title || req.body.titleEn || existing.title;

    const updatePayload = {
      title: finalTitle ? finalTitle.trim() : existing.title,
      titleBn: finalTitle ? finalTitle.trim() : existing.titleBn,
      titleEn: req.body.titleEn !== undefined ? req.body.titleEn.trim() : existing.titleEn,
      subjectId: req.body.subjectId !== undefined ? (req.body.subjectId ? Number(req.body.subjectId) : null) : existing.subjectId,
      subjectName: req.body.subjectName !== undefined ? req.body.subjectName : existing.subjectName,
      classId: req.body.classId !== undefined ? (req.body.classId ? Number(req.body.classId) : null) : existing.classId,
      classGrade: req.body.classGrade !== undefined ? req.body.classGrade : existing.classGrade,
      edition: req.body.edition !== undefined ? req.body.edition : existing.edition,
      author: req.body.author !== undefined ? req.body.author : existing.author,
      fileType: req.body.fileType !== undefined ? req.body.fileType : existing.fileType,
      fileUrl: req.body.fileUrl !== undefined ? req.body.fileUrl.trim() : existing.fileUrl,
      fileSize: req.body.fileSize !== undefined ? req.body.fileSize : existing.fileSize,
      totalPages: req.body.totalPages !== undefined ? Number(req.body.totalPages) : existing.totalPages,
      description: req.body.description !== undefined ? req.body.description : existing.description,
      isFree: req.body.isFree !== undefined ? Boolean(req.body.isFree) : existing.isFree,
      updatedAt: new Date().toISOString()
    };

    await Resource.update(updatePayload, { where: { id: existing.id } });

    await AuditService.log({
      req,
      action: 'UPDATE_RESOURCE',
      entityType: 'Resource',
      entityId: existing.id,
      oldValue: existing,
      newValue: updatePayload,
      details: `Updated resource: "${updatePayload.title}" (isFree: ${updatePayload.isFree})`
    });

    const updated = await Resource.findByPk(existing.id);

    res.json({
      success: true,
      message: 'রিসোর্সের তথ্য সফলভাবে আপডেট করা হয়েছে',
      data: formatResourceResponse(updated, req.user)
    });
  } catch (err) {
    next(err);
  }
});

/**
 * PATCH /api/resources/:id/toggle-free
 * 1-Click Toggle for isFree status (Admin/Teacher only)
 */
router.patch('/:id/toggle-free', authenticate, requireRole(['ADMIN', 'TEACHER']), async (req, res, next) => {
  try {
    const existing = await Resource.findByPk(req.params.id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'রিসোর্স খুঁজে পাওয়া যায়নি' }
      });
    }

    const newIsFree = !existing.isFree;
    await Resource.update({ isFree: newIsFree, updatedAt: new Date().toISOString() }, { where: { id: existing.id } });

    res.json({
      success: true,
      message: `ফাইলটি এখন ${newIsFree ? 'ফ্রি ডাউনলোড (Free Download)' : 'লকড প্রিমিয়াম (Premium Locked)'} হিসেবে সেট করা হয়েছে`,
      data: { id: existing.id, isFree: newIsFree }
    });
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /api/resources/:id
 * Delete a resource (Admin/Teacher only)
 */
router.delete('/:id', authenticate, requireRole(['ADMIN', 'TEACHER']), async (req, res, next) => {
  try {
    const existing = await Resource.findByPk(req.params.id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'রিসোর্স খুঁজে পাওয়া যায়নি' }
      });
    }

    await Resource.destroy({ where: { id: existing.id } });

    await AuditService.log({
      req,
      action: 'DELETE_RESOURCE',
      entityType: 'Resource',
      entityId: existing.id,
      oldValue: existing,
      details: `Deleted resource: "${existing.title}"`
    });

    res.json({
      success: true,
      message: 'রিসোর্স সফলভাবে মুছে ফেলা হয়েছে'
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
