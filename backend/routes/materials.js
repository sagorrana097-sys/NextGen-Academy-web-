const express = require('express');
const { StudyMaterial, Class, Subject, Teacher, Student, User } = require('../models');
const { authenticate, requireRole } = require('../middleware/auth');
const { verifyStudentAccess } = require('../middleware/ownership');
const AuditService = require('../services/auditService');

const router = express.Router();
const multer = require('multer');
const pdfParse = require('pdf-parse');

// Configure multer memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 } // 25 MB max
});

/**
 * POST /api/materials/upload
 * Process & Upload PDF/Text study materials, extract text with pdf-parse and save to study_materials table
 */
router.post('/upload', authenticate, upload.single('file'), async (req, res, next) => {
  try {
    const { title, category = 'GENERAL', classId, subjectId, content_text, contentText } = req.body;
    let extractedText = content_text || contentText || '';
    let fileName = '';
    let fileSize = '';
    let fileType = 'TXT';

    if (req.file) {
      fileName = req.file.originalname;
      fileSize = `${(req.file.size / (1024 * 1024)).toFixed(2)} MB`;
      const isPdf =
        req.file.mimetype === 'application/pdf' ||
        fileName.toLowerCase().endsWith('.pdf');

      if (isPdf) {
        fileType = 'PDF';
        try {
          const parsed = await pdfParse(req.file.buffer);
          extractedText = (parsed.text || '').trim();
        } catch (pdfErr) {
          console.warn('PDF parse warning:', pdfErr.message);
          extractedText = req.file.buffer.toString('utf-8').trim();
        }
      } else {
        fileType = 'TXT';
        extractedText = req.file.buffer.toString('utf-8').trim();
      }
    }

    const finalTitle = (title || fileName || 'স্টাডি সোর্স নোট').trim();

    if (!extractedText && !finalTitle) {
      return res.status(400).json({
        success: false,
        error: { code: 'EMPTY_CONTENT', message: 'ফাইল বা টেক্সট থেকে কোনো তথ্য পাওয়া যায়নি।' }
      });
    }

    let teacherId = 1;
    if (req.user.role === 'TEACHER') {
      const tProfile = await Teacher.findOne({ where: { userId: req.user.id } });
      if (tProfile) teacherId = tProfile.id;
    }

    const newMaterial = await StudyMaterial.create({
      title: finalTitle,
      titleBn: finalTitle,
      titleEn: finalTitle,
      category: category || 'GENERAL',
      content_text: extractedText,
      contentText: extractedText,
      extracted_text: extractedText,
      descriptionBn: extractedText.slice(0, 300) + (extractedText.length > 300 ? '...' : ''),
      chapterBn: finalTitle,
      chapterEn: finalTitle,
      classId: classId ? Number(classId) : null,
      subjectId: subjectId ? Number(subjectId) : null,
      teacherId,
      fileType,
      fileName,
      fileSize: fileSize || '1.0 MB',
      fileUrl: req.body.fileUrl || '',
      created_at: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      publishedAt: new Date().toISOString()
    });

    await AuditService.log({
      req,
      userId: req.user.id,
      action: 'UPLOAD_STUDY_MATERIAL_SOURCE',
      entityType: 'study_material',
      entityId: newMaterial.id,
      details: `${req.user.name} নতুন স্টাডি সোর্স আপলোড ও টেক্সট এক্সট্রাক্ট করেছেন: "${finalTitle}" (${extractedText.length} অক্ষর)`
    });

    res.status(201).json({
      success: true,
      message: 'স্টাডি ম্যাটেরিয়াল ও সোর্স টেক্সট সফলভাবে প্রসেস এবং সংরক্ষণ করা হয়েছে!',
      data: newMaterial
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/materials/source-materials
 * List all study materials with extracted text for AI question context
 */
router.get('/source-materials', authenticate, async (req, res, next) => {
  try {
    const materials = await StudyMaterial.findAll({
      order: [['id', 'DESC']]
    });

    res.json({
      success: true,
      data: materials.map(m => ({
        id: m.id,
        title: m.title || m.titleBn || m.chapterBn || `সোর্স ম্যাটেরিয়াল #${m.id}`,
        category: m.category || 'GENERAL',
        fileType: m.fileType || 'PDF',
        fileSize: m.fileSize,
        content_text: m.content_text || m.contentText || m.extracted_text || m.descriptionBn || '',
        created_at: m.created_at || m.createdAt || m.publishedAt
      }))
    });
  } catch (err) {
    next(err);
  }
});

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
