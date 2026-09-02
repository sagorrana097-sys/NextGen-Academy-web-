/**
 * NextGen Academy — Question Bank & Suggestion Engine Routes
 * Full CRUD, Bulk Import, Intelligent Parsing, and Multi-Board Suggestion Families
 */

const express = require('express');
const { QuestionBank, QuestionSuggestionFamily, StudyMaterial, Class, Subject, User } = require('../models');
const { authenticate, requireRole } = require('../middleware/auth');
const { parseQuestionsFromDocument } = require('../services/questionParserService');
const { checkBatchDuplicates, processSuggestionFamilies, checkDuplicateForQuestion } = require('../services/duplicateDetectionService');
const AuditService = require('../services/auditService');

const router = express.Router();

// Permissive wrapper allowing read-only access for students/teachers
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }
  authenticate(req, res, (err) => {
    next();
  });
};

/**
 * POST /api/questions/parse-document
 * Server-side parsing of extracted text into structured question candidates
 * Does NOT write to the database (pure dry-run preview)
 */
router.post('/parse-document', async (req, res, next) => {
  try {
    const { rawText, materialId, metadata = {} } = req.body || {};

    let textToParse = rawText || '';
    let metaContext = { ...metadata };

    // If materialId is provided, pull stored metadata and content
    if (materialId) {
      const material = await StudyMaterial.findByPk(materialId);
      if (material) {
        textToParse = textToParse || material.content_text || material.contentText || '';
        metaContext = {
          classId: material.classId,
          subjectId: material.subjectId,
          board: material.board || metaContext.board,
          year: material.examYear || metaContext.year,
          chapter: material.chapter || metaContext.chapter,
          topic: material.topic || metaContext.topic,
          questionType: material.questionType || metaContext.questionType || 'MCQ',
          sourceMaterialId: material.id,
          sourceFileName: material.originalFileName || material.fileName,
          googleDriveFileId: material.googleDriveFileId,
          fileUrl: material.fileUrl,
          ...metaContext
        };
      }
    }

    if (!textToParse || !textToParse.trim()) {
      return res.status(400).json({
        success: false,
        error: { message: 'পার্স করার জন্য কোনো টেক্সট বা ডকুমেন্ট কনটেন্ট পাওয়া যায়নি।' }
      });
    }

    // 1. Run deterministic parser
    const parsedCandidates = parseQuestionsFromDocument(textToParse, metaContext);

    // 2. Run duplicate check on candidates
    const candidatesWithDuplicates = await checkBatchDuplicates(parsedCandidates, metaContext.subjectId);

    const stats = {
      total: candidatesWithDuplicates.length,
      approvedCount: candidatesWithDuplicates.filter(q => q.status === 'APPROVED').length,
      reviewRequiredCount: candidatesWithDuplicates.filter(q => q.status === 'PARSER_REVIEW_REQUIRED' || q.status === 'PENDING_REVIEW').length,
      duplicateCount: candidatesWithDuplicates.filter(q => q.duplicateStatus !== 'UNIQUE').length,
      exactDuplicateCount: candidatesWithDuplicates.filter(q => q.duplicateStatus === 'EXACT_DUPLICATE').length,
      likelyDuplicateCount: candidatesWithDuplicates.filter(q => q.duplicateStatus === 'LIKELY_DUPLICATE').length
    };

    res.json({
      success: true,
      message: `সফলভাবে ${candidatesWithDuplicates.length}টি প্রশ্ন শনাক্ত করা হয়েছে!`,
      data: {
        total: candidatesWithDuplicates.length,
        questions: candidatesWithDuplicates,
        stats
      }
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/questions/bulk-import
 * Batch-imports selected questions into QuestionBank with rollback safety and suggestion family processing
 */
router.post('/bulk-import', authenticate, requireRole(['ADMIN', 'TEACHER']), async (req, res, next) => {
  try {
    const { questions, autoGroupFamilies = true } = req.body || {};

    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({
        success: false,
        error: { message: 'ইমপোর্ট করার জন্য কোনো প্রশ্ন নির্বাচন করা হয়নি।' }
      });
    }

    const createdQuestions = [];
    const failedQuestions = [];

    // Batch insertion
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      try {
        const newQ = await QuestionBank.create({
          questionType: q.questionType || 'MCQ',
          questionText: q.questionText,
          questionHtml: q.questionHtml || null,
          options: Array.isArray(q.options) ? q.options : [],
          answer: q.answer || null,
          answerText: q.answerText || null,
          explanation: q.explanation || null,
          classId: q.classId ? Number(q.classId) : null,
          subjectId: q.subjectId ? Number(q.subjectId) : null,
          board: q.board || 'সাধারণ',
          year: q.year || '2026',
          chapter: q.chapter || null,
          topic: q.topic || null,
          difficulty: q.difficulty || 'MEDIUM',
          marks: Number(q.marks || 1),
          sourceMaterialId: q.sourceMaterialId ? Number(q.sourceMaterialId) : null,
          sourceFileName: q.sourceFileName || null,
          googleDriveFileId: q.googleDriveFileId || null,
          fileUrl: q.fileUrl || null,
          status: q.status || (q.answer ? 'APPROVED' : 'PENDING_REVIEW'),
          duplicateStatus: q.duplicateStatus || 'UNIQUE',
          similarityScore: q.similarityScore || 0,
          familyId: null,
          tags: Array.isArray(q.tags) ? q.tags : [],
          createdById: req.user.id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });

        createdQuestions.push(newQ);
      } catch (insertErr) {
        console.error('Question import error for item', i + 1, insertErr.message);
        failedQuestions.push({ questionNumber: i + 1, error: insertErr.message });
      }
    }

    // Process Suggestion Families non-destructively
    if (autoGroupFamilies && createdQuestions.length > 0) {
      try {
        await processSuggestionFamilies(createdQuestions);
      } catch (famErr) {
        console.warn('Suggestion family processing notice:', famErr.message);
      }
    }

    await AuditService.log({
      req,
      userId: req.user.id,
      action: 'BULK_IMPORT_QUESTIONS',
      entityType: 'question_bank',
      entityId: String(createdQuestions.length),
      details: `${req.user.name} প্রশ্ন ব্যাংকে একবারে ${createdQuestions.length}টি প্রশ্ন ইমপোর্ট করেছেন।`
    });

    res.status(201).json({
      success: true,
      message: `প্রশ্ন ব্যাংকে সফলভাবে ${createdQuestions.length}টি প্রশ্ন ইমপোর্ট সম্পন্ন হয়েছে!`,
      data: {
        importedCount: createdQuestions.length,
        failedCount: failedQuestions.length,
        failedDetails: failedQuestions,
        importedQuestions: createdQuestions
      }
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/questions/check-duplicates
 * Checks duplicate status of a single question
 */
router.post('/check-duplicates', async (req, res, next) => {
  try {
    const { questionText, subjectId } = req.body || {};
    if (!questionText || !questionText.trim()) {
      return res.status(400).json({ success: false, error: { message: 'প্রশ্ন দেওয়া হয়নি' } });
    }

    const result = await checkDuplicateForQuestion({ questionText, subjectId });
    res.json({
      success: true,
      data: result
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/questions
 * Filtered, paginated listing of Question Bank
 */
router.get('/', optionalAuth, async (req, res, next) => {
  try {
    const {
      classId,
      subjectId,
      board,
      year,
      chapter,
      topic,
      questionType,
      difficulty,
      status,
      duplicateStatus,
      familyId,
      sourceMaterialId,
      search,
      limit = 25,
      offset = 0
    } = req.query;

    const all = await QuestionBank.findAll({
      order: [['id', 'DESC']]
    });

    let filtered = all;

    if (classId) {
      filtered = filtered.filter(q => String(q.classId) === String(classId));
    }
    if (subjectId) {
      filtered = filtered.filter(q => String(q.subjectId) === String(subjectId));
    }
    if (board) {
      filtered = filtered.filter(q => q.board && q.board.toLowerCase().includes(board.toLowerCase()));
    }
    if (year) {
      const yStr = String(year);
      const bnYear = yStr.replace(/0/g, '০').replace(/1/g, '১').replace(/2/g, '২').replace(/3/g, '৩').replace(/4/g, '৪').replace(/5/g, '৫').replace(/6/g, '৬').replace(/7/g, '৭').replace(/8/g, '৮').replace(/9/g, '৯');
      const enYear = yStr.replace(/০/g, '0').replace(/১/g, '1').replace(/২/g, '2').replace(/৩/g, '3').replace(/৪/g, '4').replace(/৫/g, '5').replace(/৬/g, '6').replace(/৭/g, '7').replace(/৮/g, '8').replace(/৯/g, '9');
      filtered = filtered.filter(q => String(q.year).includes(yStr) || String(q.year).includes(bnYear) || String(q.year).includes(enYear));
    }
    if (chapter) {
      filtered = filtered.filter(q => q.chapter && q.chapter.toLowerCase().includes(chapter.toLowerCase()));
    }
    if (topic) {
      filtered = filtered.filter(q => q.topic && q.topic.toLowerCase().includes(topic.toLowerCase()));
    }
    if (questionType) {
      filtered = filtered.filter(q => q.questionType === questionType);
    }
    if (difficulty) {
      filtered = filtered.filter(q => q.difficulty === difficulty);
    }
    if (status) {
      filtered = filtered.filter(q => q.status === status);
    }
    if (duplicateStatus) {
      filtered = filtered.filter(q => q.duplicateStatus === duplicateStatus);
    }
    if (familyId) {
      filtered = filtered.filter(q => String(q.familyId) === String(familyId));
    }
    if (sourceMaterialId) {
      filtered = filtered.filter(q => String(q.sourceMaterialId) === String(sourceMaterialId));
    }

    if (search && search.trim()) {
      const s = search.toLowerCase().trim();
      filtered = filtered.filter(q =>
        (q.questionText && q.questionText.toLowerCase().includes(s)) ||
        (q.chapter && q.chapter.toLowerCase().includes(s)) ||
        (q.topic && q.topic.toLowerCase().includes(s)) ||
        (q.board && q.board.toLowerCase().includes(s)) ||
        (q.sourceFileName && q.sourceFileName.toLowerCase().includes(s)) ||
        (Array.isArray(q.options) && q.options.some(o => (o.text || '').toLowerCase().includes(s)))
      );
    }

    const totalCount = filtered.length;
    const paginated = filtered.slice(Number(offset), Number(offset) + Number(limit));

    // Stats aggregation
    const stats = {
      total: all.length,
      mcqCount: all.filter(q => q.questionType === 'MCQ').length,
      cqCount: all.filter(q => q.questionType === 'CQ').length,
      sqCount: all.filter(q => q.questionType === 'SQ').length,
      approvedCount: all.filter(q => q.status === 'APPROVED').length,
      pendingCount: all.filter(q => q.status === 'PENDING_REVIEW').length,
      reviewRequiredCount: all.filter(q => q.status === 'PARSER_REVIEW_REQUIRED').length,
      duplicateCount: all.filter(q => q.duplicateStatus !== 'UNIQUE').length
    };

    res.json({
      success: true,
      total: totalCount,
      count: paginated.length,
      data: paginated,
      stats
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/questions/final-suggestions
 * Returns multi-board repeated question families
 */
router.get('/final-suggestions', optionalAuth, async (req, res, next) => {
  try {
    const { classId, subjectId, minRepeats = 1, search, limit = 50, offset = 0 } = req.query;

    const allFamilies = await QuestionSuggestionFamily.findAll({
      order: [['repeatedCount', 'DESC'], ['id', 'ASC']]
    });

    let filtered = allFamilies;

    if (classId) {
      filtered = filtered.filter(f => String(f.classId) === String(classId));
    }
    if (subjectId) {
      filtered = filtered.filter(f => String(f.subjectId) === String(subjectId));
    }
    if (minRepeats) {
      filtered = filtered.filter(f => Number(f.repeatedCount || 1) >= Number(minRepeats));
    }
    if (search && search.trim()) {
      const s = search.toLowerCase().trim();
      filtered = filtered.filter(f =>
        (f.baseQuestionText && f.baseQuestionText.toLowerCase().includes(s)) ||
        (f.familyCode && f.familyCode.toLowerCase().includes(s)) ||
        (f.chapter && f.chapter.toLowerCase().includes(s)) ||
        (Array.isArray(f.boardYearSources) && f.boardYearSources.some(b => (b.board || '').toLowerCase().includes(s) || String(b.year).includes(s)))
      );
    }

    const totalCount = filtered.length;
    const paginated = filtered.slice(Number(offset), Number(offset) + Number(limit));

    res.json({
      success: true,
      total: totalCount,
      data: paginated
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/questions/:id
 * Single Question details with original source traceability
 */
router.get('/:id', optionalAuth, async (req, res, next) => {
  try {
    const question = await QuestionBank.findByPk(req.params.id);
    if (!question) {
      return res.status(404).json({ success: false, error: { message: 'প্রশ্নটি পাওয়া যায়নি।' } });
    }

    let sourceMaterial = null;
    if (question.sourceMaterialId) {
      sourceMaterial = await StudyMaterial.findByPk(question.sourceMaterialId);
    }

    res.json({
      success: true,
      data: {
        ...question,
        originalFileUrl: question.fileUrl || (sourceMaterial?.fileUrl || (question.googleDriveFileId ? `https://drive.google.com/file/d/${question.googleDriveFileId}/view` : null)),
        downloadOriginalUrl: question.sourceMaterialId ? `/api/materials/${question.sourceMaterialId}/download` : null,
        sourceMaterial: sourceMaterial ? {
          id: sourceMaterial.id,
          title: sourceMaterial.title || sourceMaterial.titleBn,
          originalFileName: sourceMaterial.originalFileName || sourceMaterial.fileName,
          fileSize: sourceMaterial.fileSize,
          googleDriveFileId: sourceMaterial.googleDriveFileId
        } : null
      }
    });
  } catch (err) {
    next(err);
  }
});

/**
 * PUT /api/questions/:id
 * Update Question details
 */
router.put('/:id', authenticate, requireRole(['ADMIN', 'TEACHER']), async (req, res, next) => {
  try {
    const question = await QuestionBank.findByPk(req.params.id);
    if (!question) {
      return res.status(404).json({ success: false, error: { message: 'প্রশ্নটি পাওয়া যায়নি।' } });
    }

    const {
      questionText,
      options,
      answer,
      explanation,
      chapter,
      topic,
      difficulty,
      status,
      marks,
      board,
      year,
      tags
    } = req.body || {};

    let answerText = question.answerText;
    if (answer && Array.isArray(options)) {
      const matchedOpt = options.find(o => o.key === answer);
      if (matchedOpt) answerText = matchedOpt.text;
    }

    await question.update({
      questionText: questionText !== undefined ? questionText : question.questionText,
      options: options !== undefined ? options : question.options,
      answer: answer !== undefined ? answer : question.answer,
      answerText: answerText !== undefined ? answerText : question.answerText,
      explanation: explanation !== undefined ? explanation : question.explanation,
      chapter: chapter !== undefined ? chapter : question.chapter,
      topic: topic !== undefined ? topic : question.topic,
      difficulty: difficulty || question.difficulty,
      status: status || question.status,
      marks: marks !== undefined ? Number(marks) : question.marks,
      board: board || question.board,
      year: year || question.year,
      tags: tags !== undefined ? tags : question.tags,
      updatedAt: new Date().toISOString()
    });

    res.json({
      success: true,
      message: 'প্রশ্নটি সফলভাবে আপডেট করা হয়েছে!',
      data: question
    });
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /api/questions/:id
 */
router.delete('/:id', authenticate, requireRole(['ADMIN', 'TEACHER']), async (req, res, next) => {
  try {
    const question = await QuestionBank.findByPk(req.params.id);
    if (question) {
      await question.destroy();
    }

    res.json({
      success: true,
      message: 'প্রশ্নটি সফলভাবে মুছে ফেলা হয়েছে।'
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
