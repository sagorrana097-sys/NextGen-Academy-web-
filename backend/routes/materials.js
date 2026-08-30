const express = require('express');
const { StudyMaterial, Class, Subject, Teacher, Student, User } = require('../models');
const { authenticate, requireRole } = require('../middleware/auth');
const { verifyStudentAccess } = require('../middleware/ownership');
const AuditService = require('../services/auditService');

const router = express.Router();
const multer = require('multer');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

// Configure multer memory storage with strict 25MB limits
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 } // 25 MB max
});

/**
 * Helper: Generate formatted academic badge like "ঢাকা - ২৫ (MCQ)" or "রাজশাহী - ২০২৪ (CQ)"
 */
function generateAcademicBadge({ board, examYear, questionType, category }) {
  const cleanBoard = (board || '').trim();
  const cleanYear = examYear ? String(examYear).trim() : '';
  const shortYear = cleanYear ? cleanYear.replace(/^20/, '').replace(/^২০/, '') : '';
  const cleanType = (questionType || (category === 'EXAM' ? 'MCQ' : category) || 'MCQ').trim();

  if (cleanBoard && shortYear && cleanType) {
    return `${cleanBoard} - ${shortYear} (${cleanType})`;
  } else if (cleanBoard && shortYear) {
    return `${cleanBoard} - ${shortYear}`;
  } else if (cleanBoard && cleanType) {
    return `${cleanBoard} (${cleanType})`;
  } else if (shortYear && cleanType) {
    return `${shortYear} (${cleanType})`;
  } else if (cleanType && cleanType !== 'GENERAL') {
    return `(${cleanType})`;
  }
  return '';
}

/**
 * POST /api/materials/upload
 * Process & Upload PDF, DOCX, TXT & Images with academic metadata (Board, Year, Question Type, Chapter, Topic)
 */
router.post('/upload', authenticate, upload.single('file'), async (req, res, next) => {
  try {
    const {
      title,
      titleBn,
      titleEn,
      category = 'GENERAL',
      classId,
      subjectId,
      chapter,
      chapterBn,
      chapterEn,
      topic,
      topicBn,
      topicEn,
      board,
      examYear,
      questionType = 'MCQ',
      badge: reqBadge,
      academicBadge: reqAcademicBadge,
      content_text,
      contentText,
      extracted_text,
      fileUrl,
      fileName: reqFileName,
      fileSize: reqFileSize,
      fileType: reqFileType
    } = req.body || {};

    let extractedText = content_text || contentText || extracted_text || '';
    let fileName = reqFileName || '';
    let fileSize = reqFileSize || '';
    let fileType = reqFileType || 'TXT';

    if (req.file) {
      fileName = req.file.originalname;
      fileSize = `${(req.file.size / (1024 * 1024)).toFixed(2)} MB`;
      const lowerName = fileName.toLowerCase();
      const mime = (req.file.mimetype || '').toLowerCase();
      const buf = req.file.buffer;

      // 1. Magic Bytes and File Type Detection
      let detectedType = 'TXT';
      if (buf && buf.length >= 4) {
        // PDF Magic Bytes: %PDF- (0x25, 0x50, 0x44, 0x46)
        if (buf[0] === 0x25 && buf[1] === 0x50 && buf[2] === 0x44 && buf[3] === 0x46) {
          detectedType = 'PDF';
        }
        // ZIP / DOCX Magic Bytes: PK\x03\x04 (0x50, 0x4B, 0x03, 0x04)
        else if (buf[0] === 0x50 && buf[1] === 0x4B && (buf[2] === 0x03 || buf[2] === 0x05 || buf[2] === 0x07) && (buf[3] === 0x04 || buf[3] === 0x06 || buf[3] === 0x08)) {
          detectedType = 'DOCX';
        }
        // JPEG Magic Bytes: 0xFF, 0xD8, 0xFF
        else if (buf[0] === 0xFF && buf[1] === 0xD8 && buf[2] === 0xFF) {
          detectedType = 'IMAGE';
        }
        // PNG Magic Bytes: 0x89, 0x50, 0x4E, 0x47
        else if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4E && buf[3] === 0x47) {
          detectedType = 'IMAGE';
        }
      }

      // Secondary check by extension / MIME if magic bytes check didn't flag PDF/DOCX/IMAGE
      if (detectedType === 'TXT') {
        if (lowerName.endsWith('.docx') || lowerName.endsWith('.doc') || mime.includes('wordprocessingml') || mime.includes('msword') || mime.includes('officedocument')) {
          detectedType = 'DOCX';
        } else if (lowerName.endsWith('.pdf') || mime === 'application/pdf') {
          detectedType = 'PDF';
        } else if (mime.startsWith('image/') || /\.(jpg|jpeg|png|webp|bmp|svg|gif)$/i.test(lowerName)) {
          detectedType = 'IMAGE';
        }
      }

      // 2. Perform Clean Extraction by Type
      if (detectedType === 'DOCX') {
        fileType = 'DOCX';
        console.log(`[DOCX] file detected: ${fileName}`);
        console.log(`[DOCX] size: ${fileSize}`);
        console.log(`[DOCX] extraction method: mammoth`);
        try {
          const docxResult = await mammoth.extractRawText({ buffer: req.file.buffer });
          const rawDocxVal = (docxResult?.value || '').trim();

          // Reject empty or corrupted extraction
          if (!rawDocxVal) {
            console.warn(`[DOCX] extraction returned empty text for: ${fileName}`);
            return res.status(422).json({
              success: false,
              error: {
                code: 'DOCX_EMPTY_OR_CORRUPT',
                message: 'Word file থেকে কোনো টেক্সট পাওয়া যায়নি। অনুগ্রহ করে একটি valid .docx file upload করুন।'
              }
            });
          }

          // Reject binary artifacts in extracted text
          if (rawDocxVal.startsWith('PK') || rawDocxVal.includes('\x00\x00')) {
            console.warn(`[DOCX] extraction produced binary artifact for: ${fileName}`);
            return res.status(422).json({
              success: false,
              error: {
                code: 'DOCX_BINARY_CORRUPTED',
                message: 'Word file থেকে লেখা পড়া যায়নি। ফাইলটি ক্ষতিগ্রস্থ বা পাসওয়ার্ড প্রটেক্টেড হতে পারে।'
              }
            });
          }

          extractedText = rawDocxVal;
          console.log(`[DOCX] extracted characters: ${extractedText.length}`);
          console.log(`[DOCX] extraction successful`);
        } catch (docxErr) {
          console.error(`[DOCX] extraction error for ${fileName}:`, docxErr.message);
          return res.status(422).json({
            success: false,
            error: {
              code: 'DOCX_EXTRACTION_FAILED',
              message: `Word file থেকে লেখা পড়া যায়নি: ${docxErr.message}`
            }
          });
        }
      } else if (detectedType === 'PDF') {
        fileType = 'PDF';
        try {
          const parsed = await pdfParse(req.file.buffer);
          const rawText = (parsed?.text || '').trim();
          if (rawText) {
            extractedText = rawText;
          } else {
            extractedText = `[${fileName} - এই PDF ফাইলে কোনো সরাসরি সিলেক্টেবল টেক্সট পাওয়া যায়নি। এটি স্ক্যান করা পৃষ্ঠা হতে পারে।]`;
          }
        } catch (pdfErr) {
          console.warn('PDF parse warning:', pdfErr.message);
          extractedText = `[${fileName} - PDF পার্সিং ত্রুটি: ${pdfErr.message}]`;
        }
      } else if (detectedType === 'IMAGE') {
        fileType = lowerName.split('.').pop().toUpperCase() || 'IMAGE';
        extractedText = `[${fileName} (${fileSize}) - সংযুক্ত ইমেজ ফাইল। OCR দিয়ে টেক্সট স্ক্যান করুন।]`;
      } else {
        // Plain Text File
        fileType = 'TXT';
        // Verify buffer is not binary before converting to utf-8
        let hasNulls = false;
        const checkLen = Math.min(buf.length, 512);
        for (let i = 0; i < checkLen; i++) {
          if (buf[i] === 0) { hasNulls = true; break; }
        }
        if (hasNulls) {
          return res.status(422).json({
            success: false,
            error: {
              code: 'UNSUPPORTED_BINARY_FILE',
              message: 'বাইনারি ফাইল ফরম্যাট সরাসরি টেক্সট হিসেবে পড়া যায় না। অনুগ্রহ করে .docx, .pdf অথবা .txt ফাইল দিন।'
            }
          });
        }
        try {
          extractedText = buf.toString('utf-8').trim();
        } catch (txtErr) {
          extractedText = '';
        }
      }
    }

    // Limit extracted text length safely to prevent excessive memory/storage bloat (Max 50,000 chars)
    if (extractedText && extractedText.length > 50000) {
      extractedText = extractedText.slice(0, 50000) + '\n\n[... দীর্ঘ টেক্সট সংক্ষেপিত করা হয়েছে ...]';
    }

    const finalTitle = (title || titleBn || titleEn || fileName || 'স্টাডি সোর্স নোট').trim();
    const finalChapter = (chapter || chapterBn || finalTitle).trim();
    const finalTopic = (topic || topicBn || '').trim();
    const finalBoard = (board || '').trim();
    const finalYear = examYear ? String(examYear).trim() : '';
    const finalType = (questionType || category || 'MCQ').trim();

    const academicBadge = reqBadge || reqAcademicBadge || generateAcademicBadge({
      board: finalBoard,
      examYear: finalYear,
      questionType: finalType,
      category
    });

    if (!extractedText && !finalTitle && !fileUrl) {
      return res.status(400).json({
        success: false,
        error: { code: 'EMPTY_CONTENT', message: 'ফাইল বা টেক্সট থেকে কোনো তথ্য পাওয়া যায়নি।' }
      });
    }

    let teacherId = 1;
    if (req.user && req.user.role === 'TEACHER') {
      const tProfile = await Teacher.findOne({ where: { userId: req.user.id } });
      if (tProfile) teacherId = tProfile.id;
    }

    const newMaterial = await StudyMaterial.create({
      title: finalTitle,
      titleBn: finalTitle,
      titleEn: titleEn || finalTitle,
      category: category || 'GENERAL',
      content_text: extractedText,
      contentText: extractedText,
      extracted_text: extractedText,
      descriptionBn: extractedText.slice(0, 300) + (extractedText.length > 300 ? '...' : ''),
      chapter: finalChapter,
      chapterBn: finalChapter,
      chapterEn: chapterEn || finalChapter,
      topic: finalTopic,
      topicBn: finalTopic,
      topicEn: topicEn || finalTopic,
      board: finalBoard,
      examYear: finalYear,
      questionType: finalType,
      badge: academicBadge,
      academicBadge,
      classId: classId ? Number(classId) : null,
      subjectId: subjectId ? Number(subjectId) : null,
      teacherId,
      fileType: fileType || 'TXT',
      fileName: fileName || (finalTitle + '.txt'),
      fileSize: fileSize || '1.0 MB',
      fileUrl: fileUrl || req.body?.fileUrl || '',
      downloadCount: 0,
      created_at: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      publishedAt: new Date().toISOString()
    });

    try {
      await AuditService.log({
        req,
        userId: req.user?.id || 1,
        action: 'UPLOAD_STUDY_MATERIAL_SOURCE',
        entityType: 'study_material',
        entityId: newMaterial.id,
        details: `${req.user?.name || 'অ্যাডমিন'} নতুন স্টাডি সোর্স আপলোড করেছেন: "${finalTitle}" [${academicBadge}]`
      });
    } catch (auditErr) {
      console.warn('Audit log warning:', auditErr.message);
    }

    res.status(201).json({
      success: true,
      message: 'স্টাডি ম্যাটেরিয়াল, একাডেমিক মেটাডাটা ও সোর্স টেক্সট সফলভাবে সংরক্ষিত হয়েছে!',
      data: newMaterial
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/materials/source-materials
 * List study materials with academic metadata for AI question generation & filtering
 */
router.get('/source-materials', authenticate, async (req, res, next) => {
  try {
    const { subjectId, classId, board, examYear, questionType, search } = req.query;
    const where = {};
    if (subjectId) where.subjectId = Number(subjectId);
    if (classId) where.classId = Number(classId);

    let materials = await StudyMaterial.findAll({
      where,
      include: [
        { model: Class, as: 'class' },
        { model: Subject, as: 'subject' }
      ],
      order: [['id', 'DESC']]
    });

    // Optional filtering by academic metadata
    if (board && board !== 'ALL') {
      materials = materials.filter(m => m.board && m.board.toLowerCase() === board.toLowerCase());
    }
    if (examYear && examYear !== 'ALL') {
      materials = materials.filter(m => m.examYear && String(m.examYear).includes(String(examYear).replace(/^20/, '')));
    }
    if (questionType && questionType !== 'ALL') {
      materials = materials.filter(m => m.questionType && m.questionType.toLowerCase() === questionType.toLowerCase());
    }
    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      materials = materials.filter(m =>
        (m.title && m.title.toLowerCase().includes(q)) ||
        (m.titleBn && m.titleBn.toLowerCase().includes(q)) ||
        (m.chapter && m.chapter.toLowerCase().includes(q)) ||
        (m.chapterBn && m.chapterBn.toLowerCase().includes(q)) ||
        (m.topic && m.topic.toLowerCase().includes(q)) ||
        (m.board && m.board.toLowerCase().includes(q)) ||
        (m.badge && m.badge.toLowerCase().includes(q)) ||
        (m.subject?.nameBn && m.subject.nameBn.toLowerCase().includes(q))
      );
    }

    res.json({
      success: true,
      data: materials.map(m => {
        const badge = m.badge || m.academicBadge || generateAcademicBadge({
          board: m.board,
          examYear: m.examYear,
          questionType: m.questionType,
          category: m.category
        });

        return {
          id: m.id,
          title: m.title || m.titleBn || m.chapterBn || `সোর্স ম্যাটেরিয়াল #${m.id}`,
          category: m.category || 'GENERAL',
          classId: m.classId,
          subjectId: m.subjectId,
          subjectName: m.subject ? (m.subject.nameBn || m.subject.name) : (m.category || ''),
          className: m.class ? (m.class.nameBn || m.class.name) : '',
          chapter: m.chapter || m.chapterBn || '',
          topic: m.topic || m.topicBn || '',
          board: m.board || '',
          examYear: m.examYear || '',
          questionType: m.questionType || 'MCQ',
          badge,
          academicBadge: badge,
          fileName: m.fileName || '',
          fileType: m.fileType || 'PDF',
          fileSize: m.fileSize,
          fileUrl: m.fileUrl || '',
          content_text: m.content_text || m.contentText || m.extracted_text || m.descriptionBn || '',
          created_at: m.created_at || m.createdAt || m.publishedAt
        };
      })
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/materials
 * List study materials filtered by classId, subjectId, board, year, or search query
 */
router.get('/', authenticate, async (req, res, next) => {
  try {
    const { classId, subjectId, board, examYear, questionType, search } = req.query;
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

    if (board && board !== 'ALL') {
      materials = materials.filter(m => m.board && m.board.toLowerCase() === board.toLowerCase());
    }
    if (examYear && examYear !== 'ALL') {
      materials = materials.filter(m => m.examYear && String(m.examYear).includes(String(examYear).replace(/^20/, '')));
    }
    if (questionType && questionType !== 'ALL') {
      materials = materials.filter(m => m.questionType && m.questionType.toLowerCase() === questionType.toLowerCase());
    }

    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      materials = materials.filter(m =>
        (m.titleBn && m.titleBn.toLowerCase().includes(q)) ||
        (m.titleEn && m.titleEn.toLowerCase().includes(q)) ||
        (m.chapterBn && m.chapterBn.toLowerCase().includes(q)) ||
        (m.topic && m.topic.toLowerCase().includes(q)) ||
        (m.board && m.board.toLowerCase().includes(q)) ||
        (m.badge && m.badge.toLowerCase().includes(q)) ||
        (m.descriptionBn && m.descriptionBn.toLowerCase().includes(q)) ||
        (m.subject?.nameBn && m.subject.nameBn.toLowerCase().includes(q))
      );
    }

    // Attach computed badges if missing
    const formatted = materials.map(m => {
      const badge = m.badge || m.academicBadge || generateAcademicBadge({
        board: m.board,
        examYear: m.examYear,
        questionType: m.questionType,
        category: m.category
      });
      return {
        ...m,
        badge,
        academicBadge: badge
      };
    });

    res.json({
      success: true,
      data: formatted
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/materials/student/:studentId
 * Get study materials for student's class (with ownership check)
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

    const { subjectId, board, examYear, questionType, search } = req.query;
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

    if (board && board !== 'ALL') {
      materials = materials.filter(m => m.board && m.board.toLowerCase() === board.toLowerCase());
    }
    if (examYear && examYear !== 'ALL') {
      materials = materials.filter(m => m.examYear && String(m.examYear).includes(String(examYear).replace(/^20/, '')));
    }
    if (questionType && questionType !== 'ALL') {
      materials = materials.filter(m => m.questionType && m.questionType.toLowerCase() === questionType.toLowerCase());
    }

    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      materials = materials.filter(m =>
        (m.titleBn && m.titleBn.toLowerCase().includes(q)) ||
        (m.chapterBn && m.chapterBn.toLowerCase().includes(q)) ||
        (m.topic && m.topic.toLowerCase().includes(q)) ||
        (m.board && m.board.toLowerCase().includes(q)) ||
        (m.badge && m.badge.toLowerCase().includes(q)) ||
        (m.descriptionBn && m.descriptionBn.toLowerCase().includes(q)) ||
        (m.subject?.nameBn && m.subject.nameBn.toLowerCase().includes(q))
      );
    }

    const formatted = materials.map(m => {
      const badge = m.badge || m.academicBadge || generateAcademicBadge({
        board: m.board,
        examYear: m.examYear,
        questionType: m.questionType,
        category: m.category
      });
      return {
        ...m,
        badge,
        academicBadge: badge
      };
    });

    res.json({
      success: true,
      data: formatted
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/materials
 * Create a new study material / lecture note with academic metadata (Teacher/Admin only)
 */
router.post('/', authenticate, requireRole(['TEACHER', 'ADMIN']), async (req, res, next) => {
  try {
    const {
      classId,
      subjectId,
      titleBn,
      titleEn,
      chapter,
      chapterBn,
      chapterEn,
      topic,
      topicBn,
      topicEn,
      board,
      examYear,
      questionType = 'MCQ',
      badge: reqBadge,
      descriptionBn,
      descriptionEn,
      fileType = 'PDF',
      fileUrl,
      fileSize = '1.8 MB'
    } = req.body;

    if (!classId || !subjectId || !titleBn) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Class, Subject, and Title are required.' }
      });
    }

    let teacherId = 1;
    if (req.user.role === 'TEACHER') {
      const tProfile = await Teacher.findOne({ where: { userId: req.user.id } });
      if (tProfile) teacherId = tProfile.id;
    }

    const finalChapter = (chapter || chapterBn || titleBn).trim();
    const finalTopic = (topic || topicBn || '').trim();
    const finalBoard = (board || '').trim();
    const finalYear = examYear ? String(examYear).trim() : '';
    const finalType = (questionType || 'MCQ').trim();

    const academicBadge = reqBadge || generateAcademicBadge({
      board: finalBoard,
      examYear: finalYear,
      questionType: finalType,
      category: 'EXAM'
    });

    const material = await StudyMaterial.create({
      classId: Number(classId),
      subjectId: Number(subjectId),
      teacherId,
      titleBn,
      titleEn: titleEn || titleBn,
      chapter: finalChapter,
      chapterBn: finalChapter,
      chapterEn: chapterEn || finalChapter,
      topic: finalTopic,
      topicBn: finalTopic,
      topicEn: topicEn || finalTopic,
      board: finalBoard,
      examYear: finalYear,
      questionType: finalType,
      badge: academicBadge,
      academicBadge,
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
      details: `Study material posted: "${titleBn}" [${academicBadge}] for class ${classId}`
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

    const {
      classId,
      subjectId,
      titleBn,
      titleEn,
      chapter,
      chapterBn,
      topic,
      topicBn,
      board,
      examYear,
      questionType,
      badge,
      descriptionBn,
      descriptionEn,
      fileType,
      fileUrl,
      fileSize
    } = req.body;

    const finalBoard = board !== undefined ? board : material.board;
    const finalYear = examYear !== undefined ? examYear : material.examYear;
    const finalType = questionType !== undefined ? questionType : material.questionType;
    const academicBadge = badge || generateAcademicBadge({
      board: finalBoard,
      examYear: finalYear,
      questionType: finalType
    });

    await material.update({
      classId: classId ? Number(classId) : material.classId,
      subjectId: subjectId ? Number(subjectId) : material.subjectId,
      titleBn: titleBn || material.titleBn,
      titleEn: titleEn || material.titleEn,
      chapter: chapter || chapterBn || material.chapter || material.chapterBn,
      chapterBn: chapterBn || chapter || material.chapterBn,
      topic: topic || topicBn || material.topic,
      topicBn: topicBn || topic || material.topicBn,
      board: finalBoard,
      examYear: finalYear,
      questionType: finalType,
      badge: academicBadge,
      academicBadge,
      descriptionBn: descriptionBn !== undefined ? descriptionBn : material.descriptionBn,
      descriptionEn: descriptionEn !== undefined ? descriptionEn : material.descriptionEn,
      fileType: fileType || material.fileType,
      fileUrl: fileUrl || material.fileUrl,
      fileSize: fileSize || material.fileSize
    });

    res.json({
      success: true,
      data: material
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

    await material.destroy();

    res.json({
      success: true,
      message: 'স্টাডি ম্যাটেরিয়াল সফলভাবে মুছে ফেলা হয়েছে।'
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
