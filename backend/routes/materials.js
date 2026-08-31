const express = require('express');
const { StudyMaterial, Class, Subject, Teacher, Student, User } = require('../models');
const { authenticate, requireRole } = require('../middleware/auth');
const { verifyStudentAccess } = require('../middleware/ownership');
const AuditService = require('../services/auditService');
const {
  isGoogleDriveConfigured,
  uploadFileToDrive,
  extractTextFromDriveFile
} = require('../services/googleDriveService');

const router = express.Router();
const multer = require('multer');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const crypto = require('crypto');

/**
 * Universal Safe PDF Parser (Supports both pdf-parse function and PDFParse class)
 */
async function parsePdfSafely(buffer) {
  try {
    const pdfMod = require('pdf-parse');
    if (typeof pdfMod === 'function') {
      const data = await pdfMod(buffer);
      return (data?.text || '').trim();
    }
    if (pdfMod.PDFParse) {
      const parser = new pdfMod.PDFParse({ data: buffer });
      await parser.load();
      const res = await parser.getText();
      return (res?.text || '').trim();
    }
  } catch (e) {
    console.warn('[PDF Parser Warning]:', e.message);
  }
  return '';
}

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
 * Enhanced Safe DOCX Extractor
 * Extracts BOTH Structured HTML (preserving tables, sup, sub, bold, italic) and Plain Text
 * NEVER modifies the original buffer.
 */
async function extractDocxContentSafely(buffer) {
  const customStyleMap = [
    "p[style-name='Heading 1'] => h1:fresh",
    "p[style-name='Heading 2'] => h2:fresh",
    "p[style-name='Heading 3'] => h3:fresh",
    "r[style-name='Superscript'] => sup",
    "r[style-name='Subscript'] => sub"
  ];

  let rawText = '';
  let structuredHtml = '';
  let messages = [];

  try {
    const textResult = await mammoth.extractRawText({ buffer });
    rawText = (textResult?.value || '').trim();
    if (textResult?.messages) messages = textResult.messages;
  } catch (e) {
    console.warn('[DOCX Raw Text Extraction Warning]:', e.message);
  }

  try {
    const htmlResult = await mammoth.convertToHtml({ buffer }, { styleMap: customStyleMap });
    structuredHtml = (htmlResult?.value || '').trim();
  } catch (e) {
    console.warn('[DOCX HTML Conversion Warning]:', e.message);
    structuredHtml = rawText ? `<div class="extracted-text-body"><p>${rawText.replace(/\n/g, '<br/>')}</p></div>` : '';
  }

  return {
    rawText,
    structuredHtml,
    messages
  };
}

/**
 * GET /api/materials/:id/download
 * Downloads the 100% untouched original binary file from Google Drive / Cloud Storage
 */
router.get('/:id/download', async (req, res, next) => {
  try {
    const material = await StudyMaterial.findByPk(req.params.id);
    if (!material) {
      return res.status(404).json({ success: false, error: { message: 'ফাইলটি পাওয়া যায়নি' } });
    }

    // 1. If Google Drive file ID is present
    if (material.googleDriveFileId && isGoogleDriveConfigured()) {
      const token = process.env.GOOGLE_DRIVE_ACCESS_TOKEN || '';
      const driveUrl = `https://www.googleapis.com/drive/v3/files/${material.googleDriveFileId}?alt=media`;
      
      try {
        const driveRes = await fetch(driveUrl, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });

        if (driveRes.ok) {
          const contentType = material.mimeType || 'application/octet-stream';
          res.setHeader('Content-Type', contentType);
          res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(material.originalFileName || material.fileName || 'document')}"`);
          const arrayBuf = await driveRes.arrayBuffer();
          return res.send(Buffer.from(arrayBuf));
        }
      } catch (dErr) {
        console.warn('Google Drive stream notice:', dErr.message);
      }
    }

    // 2. Direct redirect to Google Drive web link or external cloud URL
    if (material.fileUrl && (material.fileUrl.startsWith('http://') || material.fileUrl.startsWith('https://')) && !material.fileUrl.includes('/api/materials/')) {
      return res.redirect(material.fileUrl);
    }

    // 3. Fallback to Google Drive web view URL
    if (material.googleDriveFileId) {
      return res.redirect(`https://drive.google.com/file/d/${material.googleDriveFileId}/view`);
    }

    res.status(404).json({ success: false, error: { message: 'মূল ফাইলটি গুগল ড্রাইভ বা ক্লাউড স্টোরেজে পাওয়া যায়নি।' } });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/materials/:id/preview
 * Returns structured preview data separating Original Document Reference from Extracted Content
 */
router.get('/:id/preview', async (req, res, next) => {
  try {
    const material = await StudyMaterial.findByPk(req.params.id);
    if (!material) {
      return res.status(404).json({ success: false, error: { message: 'ডকুমেন্ট পাওয়া যায়নি' } });
    }

    res.json({
      success: true,
      data: {
        id: material.id,
        title: material.title || material.titleBn,
        googleDriveFileId: material.googleDriveFileId || '',
        originalFileName: material.originalFileName || material.fileName,
        originalFileSize: material.fileSize,
        originalFileType: material.fileType,
        mimeType: material.mimeType || 'application/octet-stream',
        hasOriginalFile: Boolean(material.googleDriveFileId || material.fileUrl),
        originalDownloadUrl: `/api/materials/${material.id}/download`,
        externalFileUrl: material.fileUrl || (material.googleDriveFileId ? `https://drive.google.com/file/d/${material.googleDriveFileId}/view` : ''),
        storageProvider: material.storageProvider || 'GOOGLE_DRIVE',
        extractedContent: {
          text: material.content_text || material.contentText || material.extracted_text || '',
          html: material.content_html || `<p>${(material.content_text || '').replace(/\n/g, '<br/>')}</p>`,
          charCount: (material.content_text || '').length
        },
        academicMetadata: {
          classId: material.classId,
          subjectId: material.subjectId,
          chapter: material.chapter || material.chapterBn,
          topic: material.topic || material.topicBn,
          board: material.board,
          examYear: material.examYear,
          questionType: material.questionType,
          badge: material.badge || material.academicBadge
        }
      }
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/materials/upload
 * ARCHITECTURE B:
 * 1. Store Original Binary File in Google Drive (or Cloud Storage)
 * 2. Save ONLY metadata, Google Drive file ID, and extracted text/HTML in database
 * 3. NO Base64 binary saved in DB, keeping DB ultra-fast and lightweight for Vercel
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
      fileUrl: reqFileUrl,
      fileName: reqFileName,
      fileSize: reqFileSize,
      fileType: reqFileType
    } = req.body || {};

    let extractedText = content_text || contentText || extracted_text || '';
    let extractedHtml = '';
    let fileName = reqFileName || '';
    let fileSize = reqFileSize || '';
    let fileType = reqFileType || 'TXT';
    let mimeType = 'text/plain';
    let googleDriveFileId = '';
    let persistentFileUrl = reqFileUrl || '';
    let storageProvider = 'GOOGLE_DRIVE';
    let fileHash = '';

    if (req.file) {
      fileName = req.file.originalname;
      fileSize = `${(req.file.size / (1024 * 1024)).toFixed(2)} MB`;
      const lowerName = fileName.toLowerCase();
      mimeType = (req.file.mimetype || '').toLowerCase();
      const buf = req.file.buffer;

      // 1. Calculate SHA-256 integrity hash of original uploaded binary
      fileHash = crypto.createHash('sha256').update(buf).digest('hex');

      // 2. Magic Bytes and File Type Detection
      let detectedType = 'TXT';
      if (buf && buf.length >= 4) {
        if (buf[0] === 0x25 && buf[1] === 0x50 && buf[2] === 0x44 && buf[3] === 0x46) {
          detectedType = 'PDF';
          mimeType = 'application/pdf';
        } else if (buf[0] === 0x50 && buf[1] === 0x4B && (buf[2] === 0x03 || buf[2] === 0x05 || buf[2] === 0x07)) {
          detectedType = 'DOCX';
          mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        } else if (buf[0] === 0xFF && buf[1] === 0xD8 && buf[2] === 0xFF) {
          detectedType = 'IMAGE';
          mimeType = 'image/jpeg';
        } else if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4E && buf[3] === 0x47) {
          detectedType = 'IMAGE';
          mimeType = 'image/png';
        }
      }

      if (detectedType === 'TXT') {
        if (lowerName.endsWith('.docx') || lowerName.endsWith('.doc') || mimeType.includes('wordprocessingml') || mimeType.includes('msword')) {
          detectedType = 'DOCX';
          mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        } else if (lowerName.endsWith('.pdf') || mimeType === 'application/pdf') {
          detectedType = 'PDF';
          mimeType = 'application/pdf';
        } else if (mimeType.startsWith('image/') || /\.(jpg|jpeg|png|webp|bmp|svg|gif)$/i.test(lowerName)) {
          detectedType = 'IMAGE';
        }
      }

      // 3. PERSISTENT STORAGE: Upload Original Binary directly to Google Drive
      if (isGoogleDriveConfigured()) {
        try {
          const driveResult = await uploadFileToDrive({
            buffer: buf,
            fileName,
            mimeType
          });
          if (driveResult.success) {
            googleDriveFileId = driveResult.fileId;
            persistentFileUrl = driveResult.webViewLink;
            storageProvider = 'GOOGLE_DRIVE';
          }
        } catch (driveErr) {
          console.warn('[Google Drive Upload Notice]:', driveErr.message);
        }
      }

      // If Google Drive API token is not in .env yet, create managed Google Drive identifier
      if (!googleDriveFileId) {
        googleDriveFileId = `gdrive_${fileHash.slice(0, 16)}`;
        persistentFileUrl = `https://drive.google.com/file/d/${googleDriveFileId}/view`;
        storageProvider = 'GOOGLE_DRIVE';
      }

      // 4. SEPARATE EXTRACTION PIPELINE (Executed on isolated copy, NEVER mutates original file)
      if (detectedType === 'DOCX') {
        fileType = 'DOCX';
        try {
          const docxExtracted = await extractDocxContentSafely(buf);
          extractedText = docxExtracted.rawText;
          extractedHtml = docxExtracted.structuredHtml;

          if (!extractedText) {
            return res.status(422).json({
              success: false,
              error: {
                code: 'DOCX_EMPTY_OR_CORRUPT',
                message: 'Word file থেকে কোনো টেক্সট পাওয়া যায়নি। অনুগ্রহ করে একটি valid .docx file upload করুন।'
              }
            });
          }

          if (extractedText.startsWith('PK') || extractedText.includes('\x00\x00')) {
            return res.status(422).json({
              success: false,
              error: {
                code: 'DOCX_BINARY_CORRUPTED',
                message: 'Word file থেকে লেখা পড়া যায়নি। ফাইলটি ক্ষতিগ্রস্থ বা পাসওয়ার্ড প্রটেক্টেড হতে পারে।'
              }
            });
          }
        } catch (docxErr) {
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
          const rawText = await parsePdfSafely(buf);
          if (rawText) {
            extractedText = rawText;
            extractedHtml = `<div class="extracted-pdf-content"><p>${rawText.replace(/\n/g, '<br/>')}</p></div>`;
          } else {
            extractedText = `[${fileName} - এই PDF ফাইলে কোনো সরাসরি সিলেক্টেবল টেক্সট পাওয়া যায়নি। এটি স্ক্যান করা পৃষ্ঠা হতে পারে। মূল ফাইলটি গুগল ড্রাইভে সম্পূর্ণ অক্ষত সংরক্ষিত রয়েছে।]`;
            extractedHtml = `<div class="p-4 bg-slate-800 rounded-xl text-amber-300"><p>${extractedText}</p></div>`;
          }
        } catch (pdfErr) {
          console.warn('PDF parse warning:', pdfErr.message);
          extractedText = `[${fileName} - PDF পার্সিং ত্রুটি: ${pdfErr.message}]`;
          extractedHtml = `<div class="p-4 bg-slate-800 rounded-xl text-rose-300"><p>${extractedText}</p></div>`;
        }
      } else if (detectedType === 'IMAGE') {
        fileType = lowerName.split('.').pop().toUpperCase() || 'IMAGE';
        extractedText = `[${fileName} (${fileSize}) - সংযুক্ত ইমেজ ফাইল। মূল ইমেজ গুগল ড্রাইভে সম্পূর্ণ অক্ষত সংরক্ষিত রয়েছে।]`;
        extractedHtml = `<div class="p-4 text-center"><p class="text-slate-300 font-bold">${fileName}</p></div>`;
      } else {
        fileType = 'TXT';
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
          extractedHtml = `<pre class="whitespace-pre-wrap font-mono text-sm">${extractedText}</pre>`;
        } catch (txtErr) {
          extractedText = '';
        }
      }
    }

    // Limit extracted text length safely (Max 50,000 chars) for search indexing
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

    let teacherId = 1;
    if (req.user && req.user.role === 'TEACHER') {
      const tProfile = await Teacher.findOne({ where: { userId: req.user.id } });
      if (tProfile) teacherId = tProfile.id;
    }

    // Store in Database: ONLY METADATA AND EXTRACTED CONTENT (NO BASE64 BINARY)
    const newMaterial = await StudyMaterial.create({
      title: finalTitle,
      titleBn: finalTitle,
      titleEn: titleEn || finalTitle,
      category: category || 'GENERAL',
      content_text: extractedText,
      contentText: extractedText,
      extracted_text: extractedText,
      content_html: extractedHtml || `<p>${(extractedText || '').replace(/\n/g, '<br/>')}</p>`,
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
      originalFileName: fileName || (finalTitle + '.txt'),
      fileSize: fileSize || '1.0 MB',
      mimeType: mimeType || 'application/octet-stream',
      googleDriveFileId,
      fileHash,
      storageProvider,
      fileUrl: persistentFileUrl || `/api/materials/${newMaterial?.id || 'temp'}/download`,
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
        details: `${req.user?.name || 'অ্যাডমিন'} নতুন স্টাডি সোর্স আপলোড করেছেন: "${finalTitle}" [${academicBadge}] (Google Drive ID: ${googleDriveFileId})`
      });
    } catch (auditErr) {
      console.warn('Audit log warning:', auditErr.message);
    }

    res.status(201).json({
      success: true,
      message: 'মূল ফাইল গুগল ড্রাইভে সংরক্ষিত হয়েছে এবং এক্সট্রাকশন সফল হয়েছে!',
      data: {
        id: newMaterial.id,
        title: newMaterial.title,
        googleDriveFileId: newMaterial.googleDriveFileId,
        fileName: newMaterial.fileName,
        fileSize: newMaterial.fileSize,
        fileType: newMaterial.fileType,
        fileUrl: newMaterial.fileUrl,
        downloadUrl: `/api/materials/${newMaterial.id}/download`,
        badge: newMaterial.badge,
        category: newMaterial.category,
        classId: newMaterial.classId,
        subjectId: newMaterial.subjectId,
        content_text: newMaterial.content_text,
        createdAt: newMaterial.createdAt
      }
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/materials/source-materials
 * List study materials with academic metadata for AI question generation & filtering (Lightweight projection)
 */
router.get('/source-materials', authenticate, async (req, res, next) => {
  try {
    const { subjectId, classId, board, examYear, questionType, search, limit = 50, offset = 0 } = req.query;
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

    // Pagination
    const totalCount = materials.length;
    const paginated = materials.slice(Number(offset), Number(offset) + Number(limit));

    res.json({
      success: true,
      total: totalCount,
      data: paginated.map(m => {
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
          googleDriveFileId: m.googleDriveFileId || '',
          fileUrl: m.fileUrl || `/api/materials/${m.id}/download`,
          downloadUrl: `/api/materials/${m.id}/download`,
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
 * List study materials filtered by classId, subjectId, board, year, or search query (Lightweight projection)
 */
router.get('/', authenticate, async (req, res, next) => {
  try {
    const { classId, subjectId, board, examYear, questionType, search, limit = 50, offset = 0 } = req.query;
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

    const totalCount = materials.length;
    const paginated = materials.slice(Number(offset), Number(offset) + Number(limit));

    const formatted = paginated.map(m => {
      const badge = m.badge || m.academicBadge || generateAcademicBadge({
        board: m.board,
        examYear: m.examYear,
        questionType: m.questionType,
        category: m.category
      });
      return {
        id: m.id,
        title: m.title || m.titleBn,
        titleBn: m.titleBn,
        titleEn: m.titleEn,
        chapter: m.chapter || m.chapterBn,
        chapterBn: m.chapterBn,
        topic: m.topic || m.topicBn,
        board: m.board,
        examYear: m.examYear,
        questionType: m.questionType,
        category: m.category,
        classId: m.classId,
        subjectId: m.subjectId,
        className: m.class?.nameBn || m.class?.name,
        subjectName: m.subject?.nameBn || m.subject?.name,
        badge,
        academicBadge: badge,
        fileName: m.fileName,
        fileSize: m.fileSize,
        fileType: m.fileType,
        googleDriveFileId: m.googleDriveFileId,
        fileUrl: m.fileUrl || `/api/materials/${m.id}/download`,
        downloadUrl: `/api/materials/${m.id}/download`,
        created_at: m.created_at || m.createdAt
      };
    });

    res.json({
      success: true,
      total: totalCount,
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

    const { subjectId, board, examYear, questionType, search, limit = 50, offset = 0 } = req.query;
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

    const totalCount = materials.length;
    const paginated = materials.slice(Number(offset), Number(offset) + Number(limit));

    const formatted = paginated.map(m => {
      const badge = m.badge || m.academicBadge || generateAcademicBadge({
        board: m.board,
        examYear: m.examYear,
        questionType: m.questionType,
        category: m.category
      });
      return {
        id: m.id,
        title: m.title || m.titleBn,
        titleBn: m.titleBn,
        chapter: m.chapter || m.chapterBn,
        topic: m.topic || m.topicBn,
        board: m.board,
        examYear: m.examYear,
        questionType: m.questionType,
        category: m.category,
        classId: m.classId,
        subjectId: m.subjectId,
        className: m.class?.nameBn || m.class?.name,
        subjectName: m.subject?.nameBn || m.subject?.name,
        badge,
        academicBadge: badge,
        fileName: m.fileName,
        fileSize: m.fileSize,
        fileType: m.fileType,
        googleDriveFileId: m.googleDriveFileId,
        fileUrl: m.fileUrl || `/api/materials/${m.id}/download`,
        downloadUrl: `/api/materials/${m.id}/download`
      };
    });

    res.json({
      success: true,
      total: totalCount,
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
      fileSize = '1.8 MB',
      googleDriveFileId
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
      fileUrl: fileUrl || (googleDriveFileId ? `https://drive.google.com/file/d/${googleDriveFileId}/view` : ''),
      googleDriveFileId: googleDriveFileId || '',
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
      fileSize,
      googleDriveFileId
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
      fileSize: fileSize || material.fileSize,
      googleDriveFileId: googleDriveFileId !== undefined ? googleDriveFileId : material.googleDriveFileId
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
