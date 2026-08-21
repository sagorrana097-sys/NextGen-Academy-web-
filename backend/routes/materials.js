const express = require('express');
const { StudyMaterial, Class, Subject, Teacher, Student, User } = require('../models');
const { authenticate, requireRole } = require('../middleware/auth');
const { verifyStudentAccess } = require('../middleware/ownership');
const AuditService = require('../services/auditService');

const router = express.Router();

/**
 * GET /api/materials
 * List study materials filtered by classId, subjectId, or search query
 */
router.get('/', authenticate, async (req, res, next) => {
  try {
    const { classId, subjectId, search } = req.query;
    const where = {};

    if (classId) where.classId = Number(classId);
    if (subjectId) where.subjectId = Number(subjectId);

    let materials = await StudyMaterial.findAll({
      where,
      include: [
        { model: Class, as: 'class' },
        { model: Subject, as: 'subject' },
        { model: Teacher, as: 'teacher', include: [{ model: User, as: 'user' }] }
      ],
      order: [['id', 'DESC']]
    });

    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      materials = materials.filter(m =>
        (m.titleBn && m.titleBn.toLowerCase().includes(q)) ||
        (m.titleEn && m.titleEn.toLowerCase().includes(q)) ||
        (m.chapterBn && m.chapterBn.toLowerCase().includes(q)) ||
        (m.descriptionBn && m.descriptionBn.toLowerCase().includes(q)) ||
        (m.subject?.nameBn && m.subject.nameBn.toLowerCase().includes(q))
      );
    }

    res.json({
      success: true,
      data: materials
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/materials/student/:studentId
 * Get study materials for student's class (with strict ownership check)
 */
router.get('/student/:studentId', authenticate, verifyStudentAccess, async (req, res, next) => {
  try {
    const student = await Student.findByPk(req.params.studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        error: { code: 'STUDENT_NOT_FOUND', message: 'Student record not found' }
      });
    }

    const { subjectId, search } = req.query;
    const where = { classId: student.classId };
    if (subjectId) where.subjectId = Number(subjectId);

    let materials = await StudyMaterial.findAll({
      where,
      include: [
        { model: Class, as: 'class' },
        { model: Subject, as: 'subject' },
        { model: Teacher, as: 'teacher', include: [{ model: User, as: 'user' }] }
      ],
      order: [['id', 'DESC']]
    });

    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      materials = materials.filter(m =>
        (m.titleBn && m.titleBn.toLowerCase().includes(q)) ||
        (m.chapterBn && m.chapterBn.toLowerCase().includes(q)) ||
        (m.descriptionBn && m.descriptionBn.toLowerCase().includes(q)) ||
        (m.subject?.nameBn && m.subject.nameBn.toLowerCase().includes(q))
      );
    }

    res.json({
      success: true,
      data: materials
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/materials
 * Create a new study material / lecture note (Teacher/Admin only)
 */
router.post('/', authenticate, requireRole(['TEACHER', 'ADMIN']), async (req, res, next) => {
  try {
    const {
      classId,
      subjectId,
      titleBn,
      titleEn,
      chapterBn,
      chapterEn,
      descriptionBn,
      descriptionEn,
      fileType = 'PDF',
      fileUrl,
      fileSize = '1.8 MB'
    } = req.body;

    if (!classId || !subjectId || !titleBn || !chapterBn) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Class, Subject, Title and Chapter are required.' }
      });
    }

    let teacherId = 1;
    if (req.user.role === 'TEACHER') {
      const tProfile = await Teacher.findOne({ where: { userId: req.user.id } });
      if (tProfile) teacherId = tProfile.id;
    }

    const material = await StudyMaterial.create({
      classId: Number(classId),
      subjectId: Number(subjectId),
      teacherId,
      titleBn,
      titleEn: titleEn || titleBn,
      chapterBn,
      chapterEn: chapterEn || chapterBn,
      descriptionBn: descriptionBn || '',
      descriptionEn: descriptionEn || descriptionBn || '',
      fileType,
      fileUrl: fileUrl || 'https://nextgen.edu.bd/downloads/materials/lecture-note.pdf',
      fileSize,
      downloadCount: 0,
      publishedAt: new Date().toISOString()
    });

    await AuditService.log({
      req,
      action: 'POST_STUDY_MATERIAL',
      entityType: 'study_material',
      entityId: material.id,
      newValue: material,
      details: `Study material posted: "${titleBn}" for class ${classId}`
    });

    const fullMaterial = await StudyMaterial.findByPk(material.id, {
      include: [
        { model: Class, as: 'class' },
        { model: Subject, as: 'subject' },
        { model: Teacher, as: 'teacher', include: [{ model: User, as: 'user' }] }
      ]
    });

    res.status(201).json({
      success: true,
      data: fullMaterial
    });
  } catch (err) {
    next(err);
  }
});

/**
 * PUT /api/materials/:id
 * Update study material
 */
router.put('/:id', authenticate, requireRole(['TEACHER', 'ADMIN']), async (req, res, next) => {
  try {
    const material = await StudyMaterial.findByPk(req.params.id);
    if (!material) {
      return res.status(404).json({
        success: false,
        error: { code: 'MATERIAL_NOT_FOUND', message: 'Study material not found' }
      });
    }

    const oldVal = { ...material };
    const {
      classId,
      subjectId,
      titleBn,
      chapterBn,
      descriptionBn,
      fileType,
      fileUrl,
      fileSize
    } = req.body;

    const updated = await StudyMaterial.update(
      {
        ...(classId && { classId: Number(classId) }),
        ...(subjectId && { subjectId: Number(subjectId) }),
        ...(titleBn && { titleBn }),
        ...(chapterBn && { chapterBn }),
        ...(descriptionBn && { descriptionBn }),
        ...(fileType && { fileType }),
        ...(fileUrl && { fileUrl }),
        ...(fileSize && { fileSize })
      },
      { where: { id: Number(req.params.id) } }
    );

    await AuditService.log({
      req,
      action: 'UPDATE_STUDY_MATERIAL',
      entityType: 'study_material',
      entityId: material.id,
      oldValue: oldVal,
      newValue: updated[0],
      details: `Study material updated: ID ${material.id}`
    });

    res.json({
      success: true,
      data: updated[0]
    });
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /api/materials/:id
 * Delete study material
 */
router.delete('/:id', authenticate, requireRole(['TEACHER', 'ADMIN']), async (req, res, next) => {
  try {
    const material = await StudyMaterial.findByPk(req.params.id);
    if (!material) {
      return res.status(404).json({
        success: false,
        error: { code: 'MATERIAL_NOT_FOUND', message: 'Study material not found' }
      });
    }

    await StudyMaterial.destroy({ where: { id: Number(req.params.id) } });

    await AuditService.log({
      req,
      action: 'DELETE_STUDY_MATERIAL',
      entityType: 'study_material',
      entityId: material.id,
      oldValue: material,
      details: `Study material deleted: ID ${material.id}`
    });

    res.json({
      success: true,
      message: 'Study material deleted successfully'
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
