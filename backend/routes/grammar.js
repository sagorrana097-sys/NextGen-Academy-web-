const express = require('express');
const {
  GrammarLesson,
  GrammarChapter,
  GrammarTopic,
  GrammarRule,
  GrammarQuestion,
  GrammarBoardQuestion,
  GrammarModelTest,
  GrammarTestSubmission,
  GrammarProgress,
  GrammarBookmark,
  User
} = require('../models');
const { authenticate, requireRole } = require('../middleware/auth');
const AuditService = require('../services/auditService');

const router = express.Router();

// ===========================================================================
// 1. CHAPTERS API
// ===========================================================================

/**
 * GET /api/grammar/chapters
 * List all chapters with topic counts
 */
router.get('/chapters', async (req, res, next) => {
  try {
    const chapters = await GrammarChapter.findAll({ order: [['orderIndex', 'ASC']] });
    const topics = await GrammarTopic.findAll();
    
    // Attach dynamic topic counts
    const enriched = chapters.map(c => {
      const topicCount = topics.filter(t => t.chapterId === c.id).length;
      return {
        ...c,
        topicCount: topicCount || c.estimatedTopicsCount || 0
      };
    });

    res.json({
      success: true,
      data: enriched
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/grammar/chapters/:idOrSlug
 * Get single chapter with all its topics and questions summary
 */
router.get('/chapters/:idOrSlug', async (req, res, next) => {
  try {
    const param = req.params.idOrSlug;
    const chapters = await GrammarChapter.findAll();
    const chapter = chapters.find(c => String(c.id) === param || c.slug === param);

    if (!chapter) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'অধ্যায়টি খুঁজে পাওয়া যায়নি / Chapter not found' }
      });
    }

    const topics = await GrammarTopic.findAll({
      where: { chapterId: chapter.id },
      order: [['orderIndex', 'ASC']]
    });

    res.json({
      success: true,
      data: {
        ...chapter,
        topics: topics || []
      }
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/grammar/chapters
 * Create Chapter (Admin / Teacher)
 */
router.post('/chapters', authenticate, requireRole(['ADMIN', 'SUPER_ADMIN', 'TEACHER']), async (req, res, next) => {
  try {
    const { titleEn, titleBn, chapterNo, descriptionBn, category, icon, colorGradient, status } = req.body;

    if (!titleEn || !titleBn) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'ইংরেজি ও বাংলা শিরোনাম আবশ্যক / TitleEn and TitleBn are required' }
      });
    }

    const slug = req.body.slug || titleEn.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    
    // Prevent duplicate slug
    const existing = await GrammarChapter.findOne({ where: { slug } });
    if (existing) {
      return res.status(409).json({
        success: false,
        error: { code: 'DUPLICATE_SLUG', message: 'এই স্লাগ দিয়ে ইতিমধ্যে একটি অধ্যায় রয়েছে / Chapter slug already exists' }
      });
    }

    const count = await GrammarChapter.count();
    const newChapter = await GrammarChapter.create({
      chapterNo: chapterNo || count + 1,
      titleEn: titleEn.trim(),
      titleBn: titleBn.trim(),
      slug,
      icon: icon || 'BookOpen',
      colorGradient: colorGradient || 'from-blue-600 to-indigo-600',
      descriptionBn: descriptionBn || '',
      category: category || 'CORE_GRAMMAR',
      orderIndex: req.body.orderIndex !== undefined ? req.body.orderIndex : count + 1,
      status: status || 'PUBLISHED'
    });

    AuditService.log({
      userId: req.user.id,
      action: 'CREATE_GRAMMAR_CHAPTER',
      details: `Created chapter: ${newChapter.titleEn} (ID: ${newChapter.id})`,
      ip: req.ip
    });

    res.status(201).json({
      success: true,
      data: newChapter,
      message: 'অধ্যায় সফলভাবে যুক্ত হয়েছে / Chapter created successfully'
    });
  } catch (err) {
    next(err);
  }
});

/**
 * PUT /api/grammar/chapters/:id
 * Update Chapter (Admin / Teacher)
 */
router.put('/chapters/:id', authenticate, requireRole(['ADMIN', 'SUPER_ADMIN', 'TEACHER']), async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const chapter = await GrammarChapter.findByPk(id);

    if (!chapter) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'অধ্যায়টি খুঁজে পাওয়া যায়নি / Chapter not found' }
      });
    }

    await GrammarChapter.update(req.body, { where: { id } });
    const updated = await GrammarChapter.findByPk(id);

    AuditService.log({
      userId: req.user.id,
      action: 'UPDATE_GRAMMAR_CHAPTER',
      details: `Updated chapter ID: ${id}`,
      ip: req.ip
    });

    res.json({
      success: true,
      data: updated,
      message: 'অধ্যায় সফলভাবে আপডেট করা হয়েছে / Chapter updated successfully'
    });
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /api/grammar/chapters/:id
 * Delete Chapter (Admin only)
 */
router.delete('/chapters/:id', authenticate, requireRole(['ADMIN', 'SUPER_ADMIN']), async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const chapter = await GrammarChapter.findByPk(id);

    if (!chapter) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'অধ্যায়টি খুঁজে পাওয়া যায়নি / Chapter not found' }
      });
    }

    // Cascade delete associated topics
    await GrammarTopic.destroy({ where: { chapterId: id } });
    await GrammarChapter.destroy({ where: { id } });

    AuditService.log({
      userId: req.user.id,
      action: 'DELETE_GRAMMAR_CHAPTER',
      details: `Deleted chapter ID: ${id}`,
      ip: req.ip
    });

    res.json({
      success: true,
      message: 'অধ্যায় এবং এর অধীনস্থ সকল টপিক সফলভাবে মুছে ফেলা হয়েছে / Chapter deleted successfully'
    });
  } catch (err) {
    next(err);
  }
});

// ===========================================================================
// 2. TOPICS API (Full Content Structure)
// ===========================================================================

/**
 * GET /api/grammar/topics
 * List topics with filters
 */
router.get('/topics', async (req, res, next) => {
  try {
    const { chapterId, difficulty, status, search } = req.query;
    let list = await GrammarTopic.findAll({ order: [['orderIndex', 'ASC']] });

    if (chapterId) {
      list = list.filter(t => String(t.chapterId) === String(chapterId));
    }
    if (difficulty) {
      list = list.filter(t => t.difficulty === difficulty);
    }
    if (status) {
      list = list.filter(t => t.status === status);
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(t =>
        (t.titleEn && t.titleEn.toLowerCase().includes(q)) ||
        (t.titleBn && t.titleBn.toLowerCase().includes(q)) ||
        (t.summaryBn && t.summaryBn.toLowerCase().includes(q))
      );
    }

    res.json({
      success: true,
      data: list
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/grammar/topics/:idOrSlug
 * Get complete topic with full content structure (Definition, Explanation, Rules, Examples, Exceptions, Common Mistakes, Written, MCQs, Board Questions)
 */
router.get('/topics/:idOrSlug', async (req, res, next) => {
  try {
    const param = req.params.idOrSlug;
    const allTopics = await GrammarTopic.findAll();
    const topic = allTopics.find(t => String(t.id) === param || t.slug === param);

    if (!topic) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'টপিকটি খুঁজে পাওয়া যায়নি / Topic not found' }
      });
    }

    // Increment view count non-blockingly
    GrammarTopic.update({ viewCount: (topic.viewCount || 0) + 1 }, { where: { id: topic.id } }).catch(() => {});

    // Fetch related questions & board questions
    const [mcqs, boardQuestions] = await Promise.all([
      GrammarQuestion.findAll({ where: { topicId: topic.id, status: 'ACTIVE' } }),
      GrammarBoardQuestion.findAll({ where: { topicId: topic.id, status: 'ACTIVE' } })
    ]);

    res.json({
      success: true,
      data: {
        ...topic,
        mcqs: mcqs || [],
        boardQuestions: boardQuestions || []
      }
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/grammar/topics
 * Create Topic (Admin / Teacher)
 */
router.post('/topics', authenticate, requireRole(['ADMIN', 'SUPER_ADMIN', 'TEACHER']), async (req, res, next) => {
  try {
    const {
      chapterId,
      parentTopicId,
      titleEn,
      titleBn,
      topicNo,
      difficulty,
      classLevel,
      summaryBn,
      definitionEn,
      definitionBn,
      explanationBn,
      teacherGoldenTips,
      rules,
      exceptions,
      commonMistakes,
      writtenPractice,
      tags,
      status
    } = req.body;

    if (!chapterId || !titleEn || !titleBn) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'chapterId, titleEn এবং titleBn আবশ্যক' }
      });
    }

    const chapter = await GrammarChapter.findByPk(Number(chapterId));
    if (!chapter) {
      return res.status(404).json({
        success: false,
        error: { code: 'CHAPTER_NOT_FOUND', message: 'সংশ্লিষ্ট অধ্যায়টি বিদ্যমান নেই' }
      });
    }

    const slug = req.body.slug || titleEn.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const existing = await GrammarTopic.findOne({ where: { slug } });
    if (existing) {
      return res.status(409).json({
        success: false,
        error: { code: 'DUPLICATE_SLUG', message: 'এই স্লাগ দিয়ে ইতিমধ্যে একটি টপিক বিদ্যমান' }
      });
    }

    const count = await GrammarTopic.count({ where: { chapterId: Number(chapterId) } });
    const newTopic = await GrammarTopic.create({
      chapterId: Number(chapterId),
      parentTopicId: parentTopicId ? Number(parentTopicId) : null,
      topicNo: topicNo || `${chapter.chapterNo}.${count + 1}`,
      titleEn: titleEn.trim(),
      titleBn: titleBn.trim(),
      slug,
      difficulty: difficulty || 'BEGINNER',
      classLevel: classLevel || 'Class 6 - 12 (SSC & HSC)',
      summaryBn: summaryBn || '',
      definitionEn: definitionEn || '',
      definitionBn: definitionBn || '',
      explanationBn: explanationBn || '',
      teacherGoldenTips: teacherGoldenTips || '',
      rules: Array.isArray(rules) ? rules : [],
      exceptions: Array.isArray(exceptions) ? exceptions : [],
      commonMistakes: Array.isArray(commonMistakes) ? commonMistakes : [],
      writtenPractice: Array.isArray(writtenPractice) ? writtenPractice : [],
      tags: Array.isArray(tags) ? tags : [],
      status: status || 'PUBLISHED',
      orderIndex: req.body.orderIndex !== undefined ? req.body.orderIndex : count + 1,
      viewCount: 0
    });

    AuditService.log({
      userId: req.user.id,
      action: 'CREATE_GRAMMAR_TOPIC',
      details: `Created topic: ${newTopic.titleEn} (ID: ${newTopic.id})`,
      ip: req.ip
    });

    res.status(201).json({
      success: true,
      data: newTopic,
      message: 'টপিক সফলভাবে তৈরি করা হয়েছে / Topic created successfully'
    });
  } catch (err) {
    next(err);
  }
});

/**
 * PUT /api/grammar/topics/:id
 * Update Topic (Admin / Teacher)
 */
router.put('/topics/:id', authenticate, requireRole(['ADMIN', 'SUPER_ADMIN', 'TEACHER']), async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const topic = await GrammarTopic.findByPk(id);

    if (!topic) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'টপিকটি খুঁজে পাওয়া যায়নি / Topic not found' }
      });
    }

    await GrammarTopic.update(req.body, { where: { id } });
    const updated = await GrammarTopic.findByPk(id);

    AuditService.log({
      userId: req.user.id,
      action: 'UPDATE_GRAMMAR_TOPIC',
      details: `Updated topic ID: ${id}`,
      ip: req.ip
    });

    res.json({
      success: true,
      data: updated,
      message: 'টপিক সফলভাবে আপডেট করা হয়েছে / Topic updated successfully'
    });
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /api/grammar/topics/:id
 * Delete Topic (Admin only)
 */
router.delete('/topics/:id', authenticate, requireRole(['ADMIN', 'SUPER_ADMIN']), async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const topic = await GrammarTopic.findByPk(id);

    if (!topic) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'টপিকটি খুঁজে পাওয়া যায়নি / Topic not found' }
      });
    }

    // Cascade delete questions
    await GrammarQuestion.destroy({ where: { topicId: id } });
    await GrammarBoardQuestion.destroy({ where: { topicId: id } });
    await GrammarProgress.destroy({ where: { topicId: id } });
    await GrammarBookmark.destroy({ where: { itemType: 'TOPIC', itemId: id } });
    await GrammarTopic.destroy({ where: { id } });

    AuditService.log({
      userId: req.user.id,
      action: 'DELETE_GRAMMAR_TOPIC',
      details: `Deleted topic ID: ${id}`,
      ip: req.ip
    });

    res.json({
      success: true,
      message: 'টপিক এবং সংশ্লিষ্ট কন্টেন্ট সফলভাবে মুছে ফেলা হয়েছে / Topic deleted successfully'
    });
  } catch (err) {
    next(err);
  }
});

// ===========================================================================
// 3. FULL-TEXT SEARCH API
// ===========================================================================

/**
 * GET /api/grammar/search
 * Fast search across chapters, topics, rules, and board questions
 */
router.get('/search', async (req, res, next) => {
  try {
    const q = (req.query.q || '').trim().toLowerCase();
    if (!q || q.length < 2) {
      return res.status(400).json({
        success: false,
        error: { code: 'QUERY_TOO_SHORT', message: 'অনুসন্ধানের জন্য কমপক্ষে ২টি অক্ষর লিখুন / Query must be at least 2 characters' }
      });
    }

    const [chapters, topics, questions, boardQuestions] = await Promise.all([
      GrammarChapter.findAll(),
      GrammarTopic.findAll(),
      GrammarQuestion.findAll({ where: { status: 'ACTIVE' } }),
      GrammarBoardQuestion.findAll({ where: { status: 'ACTIVE' } })
    ]);

    const matchedChapters = chapters.filter(c =>
      (c.titleEn && c.titleEn.toLowerCase().includes(q)) ||
      (c.titleBn && c.titleBn.toLowerCase().includes(q)) ||
      (c.descriptionBn && c.descriptionBn.toLowerCase().includes(q))
    ).map(c => ({ type: 'CHAPTER', id: c.id, slug: c.slug, titleEn: c.titleEn, titleBn: c.titleBn }));

    const matchedTopics = topics.filter(t =>
      (t.titleEn && t.titleEn.toLowerCase().includes(q)) ||
      (t.titleBn && t.titleBn.toLowerCase().includes(q)) ||
      (t.summaryBn && t.summaryBn.toLowerCase().includes(q)) ||
      (t.explanationBn && t.explanationBn.toLowerCase().includes(q))
    ).map(t => ({ type: 'TOPIC', id: t.id, chapterId: t.chapterId, slug: t.slug, titleEn: t.titleEn, titleBn: t.titleBn }));

    const matchedQuestions = questions.filter(qu =>
      (qu.questionEn && qu.questionEn.toLowerCase().includes(q)) ||
      (qu.questionBn && qu.questionBn.toLowerCase().includes(q)) ||
      (qu.explanationBn && qu.explanationBn.toLowerCase().includes(q))
    ).slice(0, 10).map(qu => ({ type: 'MCQ', id: qu.id, topicId: qu.topicId, question: qu.questionEn }));

    const matchedBoardQuestions = boardQuestions.filter(bq =>
      (bq.board && bq.board.toLowerCase().includes(q)) ||
      (bq.questionContext && bq.questionContext.toLowerCase().includes(q)) ||
      (bq.fullExplanationBn && bq.fullExplanationBn.toLowerCase().includes(q))
    ).slice(0, 10).map(bq => ({ type: 'BOARD_QUESTION', id: bq.id, topicId: bq.topicId, board: bq.board, year: bq.year }));

    res.json({
      success: true,
      query: q,
      totalMatches: matchedChapters.length + matchedTopics.length + matchedQuestions.length + matchedBoardQuestions.length,
      data: {
        chapters: matchedChapters,
        topics: matchedTopics,
        questions: matchedQuestions,
        boardQuestions: matchedBoardQuestions
      }
    });
  } catch (err) {
    next(err);
  }
});

// ===========================================================================
// 4. MCQ SYSTEM API
// ===========================================================================

/**
 * GET /api/grammar/mcqs
 * Advanced filter, search, and pagination for Central Grammar Question Bank
 */
router.get('/mcqs', async (req, res, next) => {
  try {
    const { topicId, chapterId, subTopicId, difficulty, board, year, sourceType, status, search, page, limit } = req.query;
    let list = await GrammarQuestion.findAll();

    // Default status: if not specified, return ACTIVE/PUBLISHED for students; if teacher/admin, allow any
    if (status && status !== 'ALL') {
      list = list.filter(q => q.status === status);
    } else if (!status) {
      list = list.filter(q => q.status === 'ACTIVE' || q.status === 'PUBLISHED' || !q.status);
    }

    if (chapterId && chapterId !== 'ALL') list = list.filter(q => String(q.chapterId) === String(chapterId));
    if (topicId && topicId !== 'ALL') list = list.filter(q => String(q.topicId) === String(topicId));
    if (subTopicId) list = list.filter(q => String(q.subTopicId) === String(subTopicId));
    if (difficulty && difficulty !== 'ALL') list = list.filter(q => q.difficulty === difficulty);
    if (board && board !== 'ALL') list = list.filter(q => q.board === board);
    if (year && year !== 'ALL') list = list.filter(q => String(q.year) === String(year));
    if (sourceType && sourceType !== 'ALL') list = list.filter(q => q.sourceType === sourceType || q.examType === sourceType);

    if (search && search.trim()) {
      const qLower = search.trim().toLowerCase();
      list = list.filter(q => {
        const textEn = (q.questionEn || '').toLowerCase();
        const textBn = (q.questionBn || '').toLowerCase();
        const opts = Array.isArray(q.options) ? q.options.join(' ').toLowerCase() : '';
        const tags = Array.isArray(q.tags) ? q.tags.join(' ').toLowerCase() : '';
        return textEn.includes(qLower) || textBn.includes(qLower) || opts.includes(qLower) || tags.includes(qLower);
      });
    }

    const total = list.length;
    const pageNum = Number(page) || 1;
    const limitNum = limit === 'all' || limit === 'ALL' ? total : (Number(limit) || 20);
    const totalPages = Math.ceil(total / (limitNum || 1)) || 1;
    const startIndex = (pageNum - 1) * limitNum;
    const paginatedData = list.slice(startIndex, startIndex + limitNum);

    res.json({
      success: true,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages,
      data: paginatedData
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/grammar/mcqs/:id
 * Get single MCQ details
 */
router.get('/mcqs/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const q = await GrammarQuestion.findByPk(id);
    if (!q) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'প্রশ্নটি খুঁজে পাওয়া যায়নি / Question not found' }
      });
    }
    res.json({ success: true, data: q });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/grammar/mcqs/topic/:topicId
 * Shortcut to get MCQs for specific topic
 */
router.get('/mcqs/topic/:topicId', async (req, res, next) => {
  try {
    const topicId = Number(req.params.topicId);
    const list = await GrammarQuestion.findAll({ where: { topicId, status: 'ACTIVE' } });
    res.json({
      success: true,
      total: list.length,
      data: list
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/grammar/quiz/random
 * Server-side Random Quiz Generator (hides correct answers for security)
 */
router.post('/quiz/random', async (req, res, next) => {
  try {
    const { chapterId, topicId, difficulty, count = 10 } = req.body;
    let pool = await GrammarQuestion.findAll({ where: { status: 'ACTIVE' } });

    if (chapterId && chapterId !== 'ALL') {
      pool = pool.filter(q => String(q.chapterId) === String(chapterId));
    }
    if (topicId && topicId !== 'ALL') {
      pool = pool.filter(q => String(q.topicId) === String(topicId));
    }
    if (difficulty && difficulty !== 'ALL') {
      pool = pool.filter(q => q.difficulty === difficulty);
    }

    if (pool.length === 0) {
      return res.status(404).json({
        success: false,
        error: { code: 'EMPTY_POOL', message: 'নির্বাচিত ফিল্টারে কোনো প্রশ্ন পাওয়া যায়নি / No questions found for chosen filters' }
      });
    }

    // Shuffle pool safely
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    const selectedCount = Math.min(shuffled.length, Number(count) || 10);
    const selected = shuffled.slice(0, selectedCount);

    // Sanitize: hide correct answer and explanations from student
    const sanitizedQuestions = selected.map((q, idx) => ({
      index: idx + 1,
      id: q.id,
      chapterId: q.chapterId,
      topicId: q.topicId,
      questionEn: q.questionEn,
      questionBn: q.questionBn,
      options: q.options,
      difficulty: q.difficulty,
      marks: q.marks || 1
    }));

    const quizSessionId = `quiz_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

    res.json({
      success: true,
      quizSessionId,
      totalQuestions: sanitizedQuestions.length,
      questions: sanitizedQuestions
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/grammar/quiz/submit
 * Server-side Quiz Evaluation & Scoring with Bengali explanations
 */
router.post('/quiz/submit', async (req, res, next) => {
  try {
    const userId = req.user?.id || 1;
    const { answers = {}, timeTakenSeconds = 0, questionIds = [] } = req.body;

    const ids = Array.isArray(questionIds) && questionIds.length > 0
      ? questionIds.map(Number)
      : Object.keys(answers).map(Number);

    if (ids.length === 0) {
      return res.status(400).json({
        success: false,
        error: { code: 'NO_QUESTIONS', message: 'কোনো প্রশ্ন নির্বাচন করা হয়নি' }
      });
    }

    const questions = await GrammarQuestion.findAll({
      where: { id: { $in: ids } }
    });

    let correctCount = 0;
    let wrongCount = 0;
    let totalMarksObtained = 0;
    const breakdown = [];
    const chapterStats = {};
    const topicStats = {};

    for (const q of questions) {
      const userAns = answers[q.id];
      const isAttempted = userAns !== undefined && userAns !== null;
      const isCorrect = isAttempted && Number(userAns) === q.correctOptionIndex;
      const marks = q.marks || 1;

      if (isCorrect) {
        correctCount++;
        totalMarksObtained += marks;
      } else if (isAttempted) {
        wrongCount++;
      }

      // Track chapter metrics
      const cId = q.chapterId || 1;
      if (!chapterStats[cId]) chapterStats[cId] = { total: 0, correct: 0, attempted: 0 };
      chapterStats[cId].total++;
      if (isAttempted) chapterStats[cId].attempted++;
      if (isCorrect) chapterStats[cId].correct++;

      // Track topic metrics
      const tId = q.topicId || 1;
      if (!topicStats[tId]) topicStats[tId] = { total: 0, correct: 0, attempted: 0 };
      topicStats[tId].total++;
      if (isAttempted) topicStats[tId].attempted++;
      if (isCorrect) topicStats[tId].correct++;

      breakdown.push({
        questionId: q.id,
        chapterId: q.chapterId,
        topicId: q.topicId,
        question: q.questionEn,
        questionBn: q.questionBn,
        options: q.options,
        selectedOptionIndex: isAttempted ? Number(userAns) : null,
        correctOptionIndex: q.correctOptionIndex,
        isCorrect,
        isAttempted,
        explanationEn: q.explanationEn,
        explanationBn: q.explanationBn || q.explanationEn,
        marksAwarded: isCorrect ? marks : 0
      });
    }

    const totalQuestions = questions.length;
    const attemptedCount = Object.keys(answers).filter(k => answers[k] !== null && answers[k] !== undefined).length;
    const unansweredCount = totalQuestions - attemptedCount;
    const percentage = Math.round((correctCount / (totalQuestions || 1)) * 100);
    const accuracy = attemptedCount > 0 ? Math.round((correctCount / attemptedCount) * 100) : 0;

    let grade = 'F';
    if (percentage >= 80) grade = 'A+';
    else if (percentage >= 70) grade = 'A';
    else if (percentage >= 60) grade = 'A-';
    else if (percentage >= 50) grade = 'B';
    else if (percentage >= 40) grade = 'C';
    else if (percentage >= 33) grade = 'D';

    const passed = percentage >= 40;

    // Persist quiz submission into test submissions
    await GrammarTestSubmission.create({
      userId,
      testType: 'RANDOM_QUIZ',
      totalQuestions,
      attemptedQuestions: attemptedCount,
      correctAnswers: correctCount,
      wrongAnswers: wrongCount,
      score: totalMarksObtained,
      percentage,
      accuracy,
      grade,
      passed,
      timeTakenSeconds: Number(timeTakenSeconds),
      answers,
      chapterBreakdown: chapterStats,
      submittedAt: new Date().toISOString()
    });

    res.json({
      success: true,
      data: {
        score: totalMarksObtained,
        totalQuestions,
        attemptedCount,
        correctCount,
        wrongCount,
        unansweredCount,
        percentage,
        accuracy,
        grade,
        passed,
        timeTakenSeconds: Number(timeTakenSeconds),
        chapterStats,
        topicStats,
        breakdown
      }
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/grammar/mcqs/submit
 * Submit single or bulk MCQ answers and track student performance
 */
router.post('/mcqs/submit', authenticate, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { questionId, selectedOptionIndex, submissions } = req.body;

    const items = submissions && Array.isArray(submissions) ? submissions : [{ questionId, selectedOptionIndex }];
    let totalAttempted = 0;
    let totalCorrect = 0;
    const results = [];

    for (const sub of items) {
      if (!sub.questionId || sub.selectedOptionIndex === undefined) continue;
      const q = await GrammarQuestion.findByPk(Number(sub.questionId));
      if (!q) continue;

      totalAttempted++;
      const isCorrect = Number(sub.selectedOptionIndex) === q.correctOptionIndex;
      if (isCorrect) totalCorrect++;

      results.push({
        questionId: q.id,
        isCorrect,
        correctOptionIndex: q.correctOptionIndex,
        correctAnswerText: q.correctAnswerText || q.options[q.correctOptionIndex],
        explanationBn: q.explanationBn,
        explanationEn: q.explanationEn,
        marksAwarded: isCorrect ? (q.marks || 1) : 0
      });

      if (q.topicId) {
        const prog = await GrammarProgress.findOne({ where: { userId, topicId: q.topicId } });
        if (prog) {
          await GrammarProgress.update({
            mcqAttempted: (prog.mcqAttempted || 0) + 1,
            mcqCorrect: (prog.mcqCorrect || 0) + (isCorrect ? 1 : 0),
            mcqWrong: (prog.mcqWrong || 0) + (isCorrect ? 0 : 1),
            lastAttemptAt: new Date().toISOString()
          }, { where: { id: prog.id } });
        } else {
          await GrammarProgress.create({
            userId,
            topicId: q.topicId,
            chapterId: q.chapterId,
            isViewed: true,
            isCompleted: false,
            mcqAttempted: 1,
            mcqCorrect: isCorrect ? 1 : 0,
            mcqWrong: isCorrect ? 0 : 1,
            lastAttemptAt: new Date().toISOString()
          });
        }
      }
    }

    res.json({
      success: true,
      totalAttempted,
      totalCorrect,
      totalWrong: totalAttempted - totalCorrect,
      score: totalCorrect,
      results
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/grammar/mcqs
 * Create MCQ with validation & duplicate detection (Admin / Teacher)
 */
router.post('/mcqs', authenticate, requireRole(['ADMIN', 'SUPER_ADMIN', 'TEACHER']), async (req, res, next) => {
  try {
    const {
      chapterId,
      topicId,
      subTopicId,
      questionEn,
      questionBn,
      options,
      correctOptionIndex,
      explanationEn,
      explanationBn,
      difficulty,
      marks,
      negativeMarks,
      sourceType,
      board,
      year,
      sourceReference,
      tags,
      status
    } = req.body;

    if (!questionEn || !Array.isArray(options) || options.length < 2 || correctOptionIndex === undefined) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'প্রশ্ন, কমপক্ষে ২টি অপশন এবং সঠিক উত্তরের ইনডেক্স আবশ্যক' }
      });
    }

    const parsedIndex = Number(correctOptionIndex);
    if (parsedIndex < 0 || parsedIndex >= options.length) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_OPTION_INDEX', message: 'সঠিক উত্তরের ইনডেক্স অপশনের সীমার মধ্যে হতে হবে' }
      });
    }

    // Duplicate detection: check if same question text exists in this chapter
    const normalizedEn = questionEn.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
    const existingQuestions = await GrammarQuestion.findAll({
      where: { chapterId: Number(chapterId) }
    });

    const isDuplicate = existingQuestions.some(q => {
      const existingNorm = (q.questionEn || '').trim().toLowerCase().replace(/[^a-z0-9]/g, '');
      return existingNorm === normalizedEn;
    });

    if (isDuplicate && !req.body.forceCreate) {
      return res.status(409).json({
        success: false,
        error: { code: 'DUPLICATE_QUESTION', message: 'এই অধ্যায়ে ইতিমধ্যে হুবহু বা অত্যন্ত সদৃশ একটি প্রশ্ন বিদ্যমান রয়েছে / Duplicate question detected' }
      });
    }

    const newMCQ = await GrammarQuestion.create({
      chapterId: chapterId ? Number(chapterId) : null,
      topicId: topicId ? Number(topicId) : null,
      subTopicId: subTopicId ? Number(subTopicId) : null,
      questionType: 'MCQ',
      questionEn: questionEn.trim(),
      questionBn: questionBn ? questionBn.trim() : '',
      options,
      correctOptionIndex: parsedIndex,
      correctAnswerText: options[parsedIndex],
      explanationEn: explanationEn || '',
      explanationBn: explanationBn || '',
      difficulty: difficulty || 'MEDIUM',
      marks: marks ? Number(marks) : 1,
      negativeMarks: negativeMarks !== undefined ? Number(negativeMarks) : 0,
      sourceType: sourceType || (board ? 'BOARD_QUESTION' : 'PRACTICE'),
      isBoardQuestion: Boolean(board && year),
      board: board || null,
      year: year ? Number(year) : null,
      sourceReference: sourceReference || null,
      tags: Array.isArray(tags) ? tags : [],
      status: status || 'ACTIVE',
      createdBy: req.user.id
    });

    res.status(201).json({
      success: true,
      data: newMCQ,
      message: 'MCQ প্রশ্ন সফলভাবে যুক্ত হয়েছে / MCQ created successfully'
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/grammar/mcqs/bulk-import
 * Bulk Import with Validation & Duplicate Detection (Admin / Teacher)
 */
router.post('/mcqs/bulk-import', authenticate, requireRole(['ADMIN', 'SUPER_ADMIN', 'TEACHER']), async (req, res, next) => {
  try {
    const { questions = [], defaultChapterId, defaultTopicId, dryRun = false } = req.body;

    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({
        success: false,
        error: { code: 'EMPTY_PAYLOAD', message: 'আমদানি করার জন্য কোনো প্রশ্ন পাওয়া যায়নি' }
      });
    }

    const existing = await GrammarQuestion.findAll();
    const existingMap = new Set(existing.map(q => `${q.chapterId}_${(q.questionEn || '').trim().toLowerCase().replace(/[^a-z0-9]/g, '')}`));

    const validQuestions = [];
    const duplicateQuestions = [];
    const invalidQuestions = [];

    questions.forEach((item, idx) => {
      const qEn = item.questionEn || item.question || item.questionText;
      const opts = item.options;
      let cIdx = item.correctOptionIndex !== undefined ? Number(item.correctOptionIndex) : item.correctAnswerIndex;

      // Handle letter answer A/B/C/D if supplied as string
      if (typeof item.correctAnswer === 'string') {
        const letter = item.correctAnswer.trim().toUpperCase();
        if (letter === 'A') cIdx = 0;
        else if (letter === 'B') cIdx = 1;
        else if (letter === 'C') cIdx = 2;
        else if (letter === 'D') cIdx = 3;
      }

      if (!qEn || !Array.isArray(opts) || opts.length < 2 || cIdx === undefined || isNaN(cIdx) || cIdx < 0 || cIdx >= opts.length) {
        invalidQuestions.push({ index: idx + 1, reason: 'Invalid format or missing correct answer', item });
        return;
      }

      const chapId = Number(item.chapterId || defaultChapterId || 1);
      const normKey = `${chapId}_${qEn.trim().toLowerCase().replace(/[^a-z0-9]/g, '')}`;

      if (existingMap.has(normKey)) {
        duplicateQuestions.push({ index: idx + 1, questionEn: qEn, chapterId: chapId });
      } else {
        existingMap.add(normKey);
        validQuestions.push({
          chapterId: chapId,
          topicId: item.topicId ? Number(item.topicId) : (defaultTopicId ? Number(defaultTopicId) : null),
          questionType: 'MCQ',
          questionEn: qEn.trim(),
          questionBn: item.questionBn ? item.questionBn.trim() : '',
          options: opts,
          correctOptionIndex: cIdx,
          correctAnswerText: opts[cIdx],
          explanationEn: item.explanationEn || item.explanation || '',
          explanationBn: item.explanationBn || item.bengaliExplanation || item.explanationEn || '',
          difficulty: item.difficulty || 'MEDIUM',
          marks: item.marks ? Number(item.marks) : 1,
          negativeMarks: item.negativeMarks ? Number(item.negativeMarks) : 0,
          sourceType: item.sourceType || 'IMPORTED',
          board: item.board || null,
          year: item.year ? Number(item.year) : null,
          tags: Array.isArray(item.tags) ? item.tags : [],
          status: item.status || 'ACTIVE',
          createdBy: req.user.id
        });
      }
    });

    if (dryRun) {
      return res.json({
        success: true,
        dryRun: true,
        summary: {
          totalProvided: questions.length,
          validCount: validQuestions.length,
          duplicateCount: duplicateQuestions.length,
          invalidCount: invalidQuestions.length
        },
        duplicates: duplicateQuestions,
        invalids: invalidQuestions,
        preview: validQuestions.slice(0, 5)
      });
    }

    // Insert valid questions
    const created = [];
    for (const v of validQuestions) {
      const q = await GrammarQuestion.create(v);
      created.push(q);
    }

    res.json({
      success: true,
      dryRun: false,
      message: `${created.length}টি প্রশ্ন সফলভাবে ডাটাবেজে যুক্ত হয়েছে`,
      insertedCount: created.length,
      duplicateSkippedCount: duplicateQuestions.length,
      invalidSkippedCount: invalidQuestions.length
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/grammar/mcqs/bulk-action
 * Bulk status update or delete (Admin / Teacher)
 */
router.post('/mcqs/bulk-action', authenticate, requireRole(['ADMIN', 'SUPER_ADMIN', 'TEACHER']), async (req, res, next) => {
  try {
    const { ids = [], action, value } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, error: { message: 'কোনো প্রশ্ন নির্বাচন করা হয়নি' } });
    }

    if (action === 'DELETE') {
      for (const id of ids) {
        await GrammarQuestion.destroy({ where: { id: Number(id) } });
      }
      return res.json({ success: true, message: `${ids.length}টি প্রশ্ন মুছে ফেলা হয়েছে` });
    }

    if (action === 'PUBLISH') {
      for (const id of ids) {
        await GrammarQuestion.update({ status: 'ACTIVE' }, { where: { id: Number(id) } });
      }
      return res.json({ success: true, message: `${ids.length}টি প্রশ্ন প্রকাশ করা হয়েছে` });
    }

    if (action === 'UNPUBLISH') {
      for (const id of ids) {
        await GrammarQuestion.update({ status: 'DRAFT' }, { where: { id: Number(id) } });
      }
      return res.json({ success: true, message: `${ids.length}টি প্রশ্ন ড্রাফটে নেওয়া হয়েছে` });
    }

    if (action === 'SET_DIFFICULTY') {
      for (const id of ids) {
        await GrammarQuestion.update({ difficulty: value || 'MEDIUM' }, { where: { id: Number(id) } });
      }
      return res.json({ success: true, message: `${ids.length}টি প্রশ্নের কাঠিন্য পরিবর্তন করা হয়েছে` });
    }

    res.status(400).json({ success: false, error: { message: 'অজানা অ্যাকশন' } });
  } catch (err) {
    next(err);
  }
});

/**
 * PUT /api/grammar/mcqs/:id
 * Update MCQ (Admin / Teacher)
 */
router.put('/mcqs/:id', authenticate, requireRole(['ADMIN', 'SUPER_ADMIN', 'TEACHER']), async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const mcq = await GrammarQuestion.findByPk(id);

    if (!mcq) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'MCQ খুঁজে পাওয়া যায়নি' }
      });
    }

    const payload = { ...req.body };
    if (payload.options && payload.correctOptionIndex !== undefined) {
      payload.correctAnswerText = payload.options[payload.correctOptionIndex];
    }
    payload.updatedBy = req.user.id;
    payload.updatedAt = new Date().toISOString();

    await GrammarQuestion.update(payload, { where: { id } });
    const updated = await GrammarQuestion.findByPk(id);

    res.json({
      success: true,
      data: updated,
      message: 'MCQ সফলভাবে আপডেট হয়েছে'
    });
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /api/grammar/mcqs/:id
 * Delete MCQ (Admin / Teacher)
 */
router.delete('/mcqs/:id', authenticate, requireRole(['ADMIN', 'SUPER_ADMIN', 'TEACHER']), async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const mcq = await GrammarQuestion.findByPk(id);

    if (!mcq) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'MCQ খুঁজে পাওয়া যায়নি' }
      });
    }

    await GrammarQuestion.destroy({ where: { id } });

    res.json({
      success: true,
      message: 'MCQ সফলভাবে মুছে ফেলা হয়েছে'
    });
  } catch (err) {
    next(err);
  }
});


// ===========================================================================
// 5. BOARD QUESTION VAULT API
// ===========================================================================

/**
 * GET /api/grammar/board-questions
 * Filter verified board questions
 */
router.get('/board-questions', async (req, res, next) => {
  try {
    const { board, year, examType, topicId, chapterId } = req.query;
    let list = await GrammarBoardQuestion.findAll({ where: { status: 'ACTIVE' } });

    if (board && board !== 'সকল বোর্ড') list = list.filter(b => b.board === board);
    if (year && year !== 'সকল বছর') list = list.filter(b => String(b.year) === String(year));
    if (examType) list = list.filter(b => b.examType === examType);
    if (topicId) list = list.filter(b => String(b.topicId) === String(topicId));
    if (chapterId) list = list.filter(b => String(b.chapterId) === String(chapterId));

    res.json({
      success: true,
      total: list.length,
      data: list
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/grammar/board-questions/:id
 * Get single board question details
 */
router.get('/board-questions/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const bq = await GrammarBoardQuestion.findByPk(id);
    if (!bq) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'বোর্ড প্রশ্নটি পাওয়া যায়নি' }
      });
    }
    res.json({ success: true, data: bq });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/grammar/board-questions
 * Create Board Question (Admin / Teacher)
 * Enforces isVerified check for authentic exam papers
 */
router.post('/board-questions', authenticate, requireRole(['ADMIN', 'SUPER_ADMIN', 'TEACHER']), async (req, res, next) => {
  try {
    const { board, year, examType, questionContext, subQuestions, fullExplanationBn } = req.body;

    if (!board || !year || !questionContext || !Array.isArray(subQuestions) || subQuestions.length === 0) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'board, year, questionContext এবং subQuestions আবশ্যক' }
      });
    }

    const newBQ = await GrammarBoardQuestion.create({
      chapterId: req.body.chapterId ? Number(req.body.chapterId) : null,
      topicId: req.body.topicId ? Number(req.body.topicId) : null,
      board: board.trim(),
      year: Number(year),
      examType: examType || 'SSC',
      classLevel: req.body.classLevel || 'Class 9-10 (SSC)',
      subject: req.body.subject || 'English 2nd Paper',
      questionType: req.body.questionType || 'CORE_GRAMMAR',
      marks: req.body.marks ? Number(req.body.marks) : 5,
      questionContext: questionContext.trim(),
      subQuestions,
      fullExplanationBn: fullExplanationBn || '',
      difficulty: req.body.difficulty || 'MEDIUM',
      isVerified: req.body.isVerified !== undefined ? Boolean(req.body.isVerified) : true,
      sourceInfo: req.body.sourceInfo || `${board} ${examType || 'SSC'} ${year}`,
      status: 'ACTIVE'
    });

    res.status(201).json({
      success: true,
      data: newBQ,
      message: 'বোর্ড প্রশ্ন সফলভাবে যুক্ত হয়েছে / Board question added'
    });
  } catch (err) {
    next(err);
  }
});

/**
 * PUT /api/grammar/board-questions/:id
 * Update Board Question (Admin / Teacher)
 */
router.put('/board-questions/:id', authenticate, requireRole(['ADMIN', 'SUPER_ADMIN', 'TEACHER']), async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const bq = await GrammarBoardQuestion.findByPk(id);

    if (!bq) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'বোর্ড প্রশ্ন পাওয়া যায়নি' }
      });
    }

    await GrammarBoardQuestion.update(req.body, { where: { id } });
    const updated = await GrammarBoardQuestion.findByPk(id);

    res.json({
      success: true,
      data: updated,
      message: 'বোর্ড প্রশ্ন সফলভাবে আপডেট করা হয়েছে'
    });
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /api/grammar/board-questions/:id
 * Delete Board Question (Admin only)
 */
router.delete('/board-questions/:id', authenticate, requireRole(['ADMIN', 'SUPER_ADMIN']), async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const bq = await GrammarBoardQuestion.findByPk(id);

    if (!bq) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'বোর্ড প্রশ্ন পাওয়া যায়নি' }
      });
    }

    await GrammarBoardQuestion.destroy({ where: { id } });
    res.json({ success: true, message: 'বোর্ড প্রশ্ন মুছে ফেলা হয়েছে' });
  } catch (err) {
    next(err);
  }
});

// ===========================================================================
// 6. MODEL TEST SYSTEM & TIMED EXAMINATION API
// ===========================================================================

/**
 * GET /api/grammar/model-tests
 * List all model tests (with optional status filter)
 */
router.get('/model-tests', async (req, res, next) => {
  try {
    const { status, difficulty, chapterId } = req.query;
    let list = await GrammarModelTest.findAll();

    if (status && status !== 'ALL') {
      list = list.filter(t => t.status === status);
    } else if (!status) {
      list = list.filter(t => t.status === 'PUBLISHED' || !t.status);
    }

    if (difficulty && difficulty !== 'ALL') list = list.filter(t => t.difficulty === difficulty);
    if (chapterId && chapterId !== 'ALL') list = list.filter(t => String(t.chapterId) === String(chapterId));

    res.json({
      success: true,
      total: list.length,
      data: list
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/grammar/model-tests/:id
 * Get single test details with sanitized question list
 */
router.get('/model-tests/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const test = await GrammarModelTest.findByPk(id);

    if (!test) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'মডেল টেস্টটি পাওয়া যায়নি / Model test not found' }
      });
    }

    let questions = [];
    if (Array.isArray(test.questionIds) && test.questionIds.length > 0) {
      questions = await GrammarQuestion.findAll({
        where: { id: { $in: test.questionIds }, status: 'ACTIVE' }
      });
    } else {
      questions = await GrammarQuestion.findAll({ where: { status: 'ACTIVE' }, limit: test.totalMarks || 20 });
    }

    // Return sanitized questions (no correct answers during test)
    res.json({
      success: true,
      data: {
        ...test,
        totalQuestions: questions.length,
        questions: questions.map((q, idx) => ({
          index: idx + 1,
          id: q.id,
          chapterId: q.chapterId,
          topicId: q.topicId,
          questionEn: q.questionEn,
          questionBn: q.questionBn,
          options: q.options,
          difficulty: q.difficulty,
          marks: q.marks || 1
        }))
      }
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/grammar/model-tests/:id/start
 * Start or Resume an Exam Attempt (creates server-aware timer session)
 */
router.post('/model-tests/:id/start', authenticate, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const testId = Number(req.params.id);
    const test = await GrammarModelTest.findByPk(testId);

    if (!test) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'মডেল টেস্টটি পাওয়া যায়নি' }
      });
    }

    // Check if student already has an unfinished IN_PROGRESS attempt
    const existingAttempt = await GrammarTestSubmission.findOne({
      where: { userId, modelTestId: testId, status: 'IN_PROGRESS' }
    });

    let questions = [];
    if (Array.isArray(test.questionIds) && test.questionIds.length > 0) {
      questions = await GrammarQuestion.findAll({
        where: { id: { $in: test.questionIds }, status: 'ACTIVE' }
      });
    } else {
      questions = await GrammarQuestion.findAll({ where: { status: 'ACTIVE' }, limit: test.totalMarks || 20 });
    }

    const sanitizedQuestions = questions.map((q, idx) => ({
      index: idx + 1,
      id: q.id,
      chapterId: q.chapterId,
      topicId: q.topicId,
      questionEn: q.questionEn,
      questionBn: q.questionBn,
      options: q.options,
      difficulty: q.difficulty,
      marks: q.marks || 1
    }));

    if (existingAttempt) {
      // Calculate remaining time
      const startTime = new Date(existingAttempt.startedAt).getTime();
      const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
      const totalAllowedSeconds = (test.durationMinutes || 20) * 60;
      const remainingSeconds = Math.max(0, totalAllowedSeconds - elapsedSeconds);

      return res.json({
        success: true,
        isResumed: true,
        attemptId: existingAttempt.id,
        testId: test.id,
        testTitleEn: test.titleEn,
        testTitleBn: test.titleBn,
        durationMinutes: test.durationMinutes,
        totalAllowedSeconds,
        remainingSeconds,
        savedAnswers: existingAttempt.answers || {},
        savedMarked: existingAttempt.markedQuestions || [],
        savedCurrentIndex: existingAttempt.currentQuestionIndex || 0,
        totalQuestions: sanitizedQuestions.length,
        questions: sanitizedQuestions
      });
    }

    // Create new attempt
    const newAttempt = await GrammarTestSubmission.create({
      userId,
      modelTestId: test.id,
      status: 'IN_PROGRESS',
      startedAt: new Date().toISOString(),
      durationMinutes: test.durationMinutes || 20,
      totalQuestions: sanitizedQuestions.length,
      answers: {},
      markedQuestions: [],
      currentQuestionIndex: 0
    });

    res.json({
      success: true,
      isResumed: false,
      attemptId: newAttempt.id,
      testId: test.id,
      testTitleEn: test.titleEn,
      testTitleBn: test.titleBn,
      durationMinutes: test.durationMinutes,
      totalAllowedSeconds: (test.durationMinutes || 20) * 60,
      remainingSeconds: (test.durationMinutes || 20) * 60,
      savedAnswers: {},
      savedMarked: [],
      savedCurrentIndex: 0,
      totalQuestions: sanitizedQuestions.length,
      questions: sanitizedQuestions
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/grammar/model-tests/attempts/:attemptId/save
 * Save In-Progress Exam State (Auto-save & resume support)
 */
router.post('/model-tests/attempts/:attemptId/save', authenticate, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const attemptId = Number(req.params.attemptId);
    const { answers = {}, markedQuestions = [], currentQuestionIndex = 0 } = req.body;

    const attempt = await GrammarTestSubmission.findByPk(attemptId);
    if (!attempt || attempt.userId !== userId) {
      return res.status(404).json({ success: false, error: { message: 'পরীক্ষার সেশন খুঁজে পাওয়া যায়নি' } });
    }

    if (attempt.status === 'SUBMITTED') {
      return res.status(400).json({ success: false, error: { message: 'পরীক্ষা ইতিমধ্যে জমা দেওয়া হয়েছে' } });
    }

    await GrammarTestSubmission.update({
      answers,
      markedQuestions,
      currentQuestionIndex: Number(currentQuestionIndex),
      lastSavedAt: new Date().toISOString()
    }, { where: { id: attemptId } });

    res.json({ success: true, message: 'প্রোগ্রেস সফলভাবে সংরক্ষিত হয়েছে' });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/grammar/model-tests/attempts/:attemptId/submit
 * Final Server-Side Evaluation & Scoring with Negative Marking & Grade
 */
router.post('/model-tests/attempts/:attemptId/submit', authenticate, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const attemptId = Number(req.params.attemptId);
    const { answers = {}, timeTakenSeconds = 0 } = req.body;

    const attempt = await GrammarTestSubmission.findByPk(attemptId);
    if (!attempt || attempt.userId !== userId) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'পরীক্ষার সেশন খুঁজে পাওয়া যায়নি' }
      });
    }

    // Avoid double evaluation
    if (attempt.status === 'SUBMITTED') {
      return res.json({
        success: true,
        alreadySubmitted: true,
        data: attempt
      });
    }

    const test = await GrammarModelTest.findByPk(attempt.modelTestId);
    if (!test) {
      return res.status(404).json({ success: false, error: { message: 'মডেল টেস্ট পাওয়া যায়নি' } });
    }

    let questions = [];
    if (Array.isArray(test.questionIds) && test.questionIds.length > 0) {
      questions = await GrammarQuestion.findAll({ where: { id: { $in: test.questionIds } } });
    } else {
      questions = await GrammarQuestion.findAll({ where: { status: 'ACTIVE' }, limit: test.totalMarks || 20 });
    }

    let correctCount = 0;
    let wrongCount = 0;
    let rawScore = 0;
    const breakdown = [];
    const chapterStats = {};
    const topicStats = {};

    const negPerQuestion = test.negativeMarkingEnabled ? (test.negativeMarkPerQuestion || 0.25) : 0;

    for (const q of questions) {
      const userAns = answers[q.id];
      const isAttempted = userAns !== undefined && userAns !== null;
      const isCorrect = isAttempted && Number(userAns) === q.correctOptionIndex;
      const marks = q.marks || 1;

      if (isCorrect) {
        correctCount++;
        rawScore += marks;
      } else if (isAttempted) {
        wrongCount++;
        rawScore -= negPerQuestion;
      }

      // Track chapter metrics
      const cId = q.chapterId || 1;
      if (!chapterStats[cId]) chapterStats[cId] = { total: 0, correct: 0, attempted: 0 };
      chapterStats[cId].total++;
      if (isAttempted) chapterStats[cId].attempted++;
      if (isCorrect) chapterStats[cId].correct++;

      // Track topic metrics
      const tId = q.topicId || 1;
      if (!topicStats[tId]) topicStats[tId] = { total: 0, correct: 0, attempted: 0 };
      topicStats[tId].total++;
      if (isAttempted) topicStats[tId].attempted++;
      if (isCorrect) topicStats[tId].correct++;

      breakdown.push({
        questionId: q.id,
        chapterId: q.chapterId,
        topicId: q.topicId,
        question: q.questionEn,
        questionBn: q.questionBn,
        options: q.options,
        selectedOptionIndex: isAttempted ? Number(userAns) : null,
        correctOptionIndex: q.correctOptionIndex,
        isCorrect,
        isAttempted,
        explanationEn: q.explanationEn,
        explanationBn: q.explanationBn || q.explanationEn,
        marksAwarded: isCorrect ? marks : (isAttempted ? -negPerQuestion : 0)
      });
    }

    const totalQuestions = questions.length;
    const attemptedCount = Object.keys(answers).filter(k => answers[k] !== null && answers[k] !== undefined).length;
    const unansweredCount = totalQuestions - attemptedCount;
    const finalScore = Math.max(0, Number(rawScore.toFixed(2)));
    const percentage = Math.round((finalScore / (test.totalMarks || totalQuestions || 1)) * 100);
    const accuracy = attemptedCount > 0 ? Math.round((correctCount / attemptedCount) * 100) : 0;
    const passed = finalScore >= (test.passingMarks || Math.round(totalQuestions * 0.4));

    let grade = 'F';
    if (percentage >= 80) grade = 'A+';
    else if (percentage >= 70) grade = 'A';
    else if (percentage >= 60) grade = 'A-';
    else if (percentage >= 50) grade = 'B';
    else if (percentage >= 40) grade = 'C';
    else if (percentage >= 33) grade = 'D';

    await GrammarTestSubmission.update({
      status: 'SUBMITTED',
      totalQuestions,
      attemptedQuestions: attemptedCount,
      correctAnswers: correctCount,
      wrongAnswers: wrongCount,
      score: finalScore,
      percentage,
      accuracy,
      grade,
      passed,
      timeTakenSeconds: Number(timeTakenSeconds),
      answers,
      chapterBreakdown: chapterStats,
      topicBreakdown: topicStats,
      breakdown,
      submittedAt: new Date().toISOString()
    }, { where: { id: attemptId } });

    res.json({
      success: true,
      data: {
        attemptId,
        testId: test.id,
        testTitleEn: test.titleEn,
        testTitleBn: test.titleBn,
        score: finalScore,
        totalMarks: test.totalMarks || totalQuestions,
        totalQuestions,
        attemptedCount,
        correctCount,
        wrongCount,
        unansweredCount,
        percentage,
        accuracy,
        grade,
        passed,
        timeTakenSeconds: Number(timeTakenSeconds),
        chapterStats,
        topicStats,
        breakdown
      }
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/grammar/model-tests/attempts/:attemptId/result
 * Get Detailed Result and Wrong-Answer Review
 */
router.get('/model-tests/attempts/:attemptId/result', authenticate, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const attemptId = Number(req.params.attemptId);
    const attempt = await GrammarTestSubmission.findByPk(attemptId);

    if (!attempt || (attempt.userId !== userId && req.user.role === 'STUDENT')) {
      return res.status(404).json({ success: false, error: { message: 'ফলাফল খুঁজে পাওয়া যায়নি' } });
    }

    const test = attempt.modelTestId ? await GrammarModelTest.findByPk(attempt.modelTestId) : null;

    res.json({
      success: true,
      data: {
        attemptId: attempt.id,
        testId: test?.id || attempt.modelTestId,
        testTitleEn: test?.titleEn || 'Grammar Quiz',
        testTitleBn: test?.titleBn || 'গ্রামার কুইজ',
        score: attempt.score,
        totalMarks: test?.totalMarks || attempt.totalQuestions,
        totalQuestions: attempt.totalQuestions,
        attemptedCount: attempt.attemptedQuestions,
        correctCount: attempt.correctAnswers,
        wrongCount: attempt.wrongAnswers,
        unansweredCount: (attempt.totalQuestions || 0) - (attempt.attemptedQuestions || 0),
        percentage: attempt.percentage,
        accuracy: attempt.accuracy || Math.round(((attempt.correctAnswers || 0) / (attempt.attemptedQuestions || 1)) * 100),
        grade: attempt.grade,
        passed: attempt.passed,
        timeTakenSeconds: attempt.timeTakenSeconds,
        chapterStats: attempt.chapterBreakdown || {},
        topicStats: attempt.topicBreakdown || {},
        breakdown: attempt.breakdown || [],
        submittedAt: attempt.submittedAt
      }
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/grammar/model-tests
 * Create Model Test with Question Pool Validation (Admin / Teacher)
 */
router.post('/model-tests', authenticate, requireRole(['ADMIN', 'SUPER_ADMIN', 'TEACHER']), async (req, res, next) => {
  try {
    const {
      titleEn,
      titleBn,
      durationMinutes,
      totalMarks,
      passingMarks,
      negativeMarkingEnabled,
      negativeMarkPerQuestion,
      difficulty,
      targetClass,
      questionIds,
      distribution
    } = req.body;

    if (!titleEn || !titleBn) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'titleEn এবং titleBn আবশ্যক' }
      });
    }

    let finalQuestionIds = Array.isArray(questionIds) ? questionIds.map(Number) : [];

    // If distribution rules provided, auto-select from pool
    if (distribution && typeof distribution === 'object') {
      const allActiveQuestions = await GrammarQuestion.findAll({ where: { status: 'ACTIVE' } });
      finalQuestionIds = [];

      for (const [chapId, reqCount] of Object.entries(distribution)) {
        const countNeeded = Number(reqCount);
        if (countNeeded <= 0) continue;
        const matching = allActiveQuestions.filter(q => q.chapterId === Number(chapId));
        if (matching.length < countNeeded) {
          return res.status(400).json({
            success: false,
            error: {
              code: 'INSUFFICIENT_POOL',
              message: `অধ্যায় ${chapId}-তে পর্যাপ্ত প্রশ্ন নেই (প্রয়োজন ${countNeeded}, আছে ${matching.length})`
            }
          });
        }
        const shuffled = [...matching].sort(() => 0.5 - Math.random());
        finalQuestionIds.push(...shuffled.slice(0, countNeeded).map(q => q.id));
      }
    }

    const count = await GrammarModelTest.count();
    const newTest = await GrammarModelTest.create({
      titleEn: titleEn.trim(),
      titleBn: titleBn.trim(),
      descriptionBn: req.body.descriptionBn || '',
      durationMinutes: durationMinutes ? Number(durationMinutes) : 20,
      totalMarks: totalMarks ? Number(totalMarks) : (finalQuestionIds.length || 20),
      passingMarks: passingMarks ? Number(passingMarks) : Math.round((finalQuestionIds.length || 20) * 0.5),
      negativeMarkingEnabled: Boolean(negativeMarkingEnabled),
      negativeMarkPerQuestion: negativeMarkPerQuestion !== undefined ? Number(negativeMarkPerQuestion) : 0.25,
      difficulty: difficulty || 'BOARD_STANDARD',
      chapterId: req.body.chapterId ? Number(req.body.chapterId) : null,
      topicId: req.body.topicId ? Number(req.body.topicId) : null,
      questionIds: finalQuestionIds,
      targetClass: targetClass || 'Class 9-10 (SSC 2026)',
      orderIndex: count + 1,
      status: req.body.status || 'PUBLISHED',
      createdBy: req.user.id
    });

    res.status(201).json({
      success: true,
      data: newTest,
      message: 'মডেল টেস্ট সফলভাবে তৈরি হয়েছে / Model test created'
    });
  } catch (err) {
    next(err);
  }
});

/**
 * PUT /api/grammar/model-tests/:id
 * Update Model Test (Admin / Teacher)
 */
router.put('/model-tests/:id', authenticate, requireRole(['ADMIN', 'SUPER_ADMIN', 'TEACHER']), async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const test = await GrammarModelTest.findByPk(id);
    if (!test) {
      return res.status(404).json({ success: false, error: { message: 'মডেল টেস্ট পাওয়া যায়নি' } });
    }

    await GrammarModelTest.update({
      ...req.body,
      updatedBy: req.user.id,
      updatedAt: new Date().toISOString()
    }, { where: { id } });

    const updated = await GrammarModelTest.findByPk(id);
    res.json({ success: true, data: updated, message: 'মডেল টেস্ট সফলভাবে আপডেট হয়েছে' });
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /api/grammar/model-tests/:id
 * Delete Model Test (Admin / Teacher)
 */
router.delete('/model-tests/:id', authenticate, requireRole(['ADMIN', 'SUPER_ADMIN', 'TEACHER']), async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const test = await GrammarModelTest.findByPk(id);
    if (!test) {
      return res.status(404).json({ success: false, error: { message: 'মডেল টেস্ট পাওয়া যায়নি' } });
    }

    await GrammarModelTest.destroy({ where: { id } });
    res.json({ success: true, message: 'মডেল টেস্ট মুছে ফেলা হয়েছে' });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/grammar/analytics/my-performance
 * Student Performance Analytics (Strengths, Weaknesses, Historical Accuracy)
 */
router.get('/analytics/my-performance', authenticate, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const submissions = await GrammarTestSubmission.findAll({ where: { userId, status: 'SUBMITTED' } });

    const totalAttempted = submissions.length;
    let totalScore = 0;
    let totalMaxMarks = 0;
    let highestPercentage = 0;
    const chapterAggregate = {};

    submissions.forEach(sub => {
      totalScore += (sub.score || 0);
      totalMaxMarks += (sub.totalQuestions || 0);
      if (sub.percentage > highestPercentage) highestPercentage = sub.percentage;

      if (sub.chapterBreakdown && typeof sub.chapterBreakdown === 'object') {
        Object.entries(sub.chapterBreakdown).forEach(([cId, stats]) => {
          if (!chapterAggregate[cId]) chapterAggregate[cId] = { total: 0, correct: 0, attempted: 0 };
          chapterAggregate[cId].total += (stats.total || 0);
          chapterAggregate[cId].attempted += (stats.attempted || 0);
          chapterAggregate[cId].correct += (stats.correct || 0);
        });
      }
    });

    const averageAccuracy = totalMaxMarks > 0 ? Math.round((totalScore / totalMaxMarks) * 100) : 0;

    // Build chapter strengths & weaknesses ranking
    const chapters = await GrammarChapter.findAll();
    const chapterPerformanceList = Object.entries(chapterAggregate).map(([cId, data]) => {
      const chap = chapters.find(c => String(c.id) === String(cId));
      const accuracy = data.attempted > 0 ? Math.round((data.correct / data.attempted) * 100) : 0;
      return {
        chapterId: Number(cId),
        titleEn: chap?.titleEn || `Chapter ${cId}`,
        titleBn: chap?.titleBn || '',
        attempted: data.attempted,
        correct: data.correct,
        accuracy,
        status: accuracy >= 70 ? 'STRENGTH' : (accuracy >= 50 ? 'AVERAGE' : 'WEAKNESS')
      };
    }).sort((a, b) => b.accuracy - a.accuracy);

    res.json({
      success: true,
      data: {
        totalAttempted,
        averageAccuracy,
        highestPercentage,
        chapterStrengths: chapterPerformanceList.filter(c => c.status === 'STRENGTH'),
        chapterWeaknesses: chapterPerformanceList.filter(c => c.status === 'WEAKNESS'),
        allChapterPerformance: chapterPerformanceList,
        recentSubmissions: submissions.slice(-10).reverse().map(s => ({
          id: s.id,
          modelTestId: s.modelTestId,
          score: s.score,
          totalQuestions: s.totalQuestions,
          percentage: s.percentage,
          grade: s.grade,
          passed: s.passed,
          submittedAt: s.submittedAt
        }))
      }
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/grammar/analytics/admin-overview
 * Admin/Teacher overview of Question Bank & Exam Activity
 */
router.get('/analytics/admin-overview', authenticate, requireRole(['ADMIN', 'SUPER_ADMIN', 'TEACHER']), async (req, res, next) => {
  try {
    const [allQuestions, allTests, allSubmissions, allChapters] = await Promise.all([
      GrammarQuestion.findAll(),
      GrammarModelTest.findAll(),
      GrammarTestSubmission.findAll({ where: { status: 'SUBMITTED' } }),
      GrammarChapter.findAll()
    ]);

    const chapterQuestionCounts = {};
    allChapters.forEach(c => { chapterQuestionCounts[c.id] = { chapterNo: c.chapterNo, titleEn: c.titleEn, count: 0 }; });
    allQuestions.forEach(q => {
      if (chapterQuestionCounts[q.chapterId]) {
        chapterQuestionCounts[q.chapterId].count++;
      }
    });

    const difficultyCounts = { EASY: 0, MEDIUM: 0, HARD: 0 };
    allQuestions.forEach(q => {
      if (difficultyCounts[q.difficulty] !== undefined) difficultyCounts[q.difficulty]++;
      else difficultyCounts.MEDIUM++;
    });

    res.json({
      success: true,
      data: {
        totalQuestions: allQuestions.length,
        activeQuestions: allQuestions.filter(q => q.status === 'ACTIVE').length,
        totalModelTests: allTests.length,
        publishedModelTests: allTests.filter(t => t.status === 'PUBLISHED').length,
        totalStudentAttempts: allSubmissions.length,
        difficultyCounts,
        chapterQuestionCounts
      }
    });
  } catch (err) {
    next(err);
  }
});


// ===========================================================================
// 7. STUDENT PROGRESS API
// ===========================================================================

/**
 * GET /api/grammar/my-progress
 * Full progress report for logged in student
 */
router.get('/my-progress', authenticate, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const [progressList, totalTopicsCount, testSubmissions] = await Promise.all([
      GrammarProgress.findAll({ where: { userId } }),
      GrammarTopic.count(),
      GrammarTestSubmission.findAll({ where: { userId } })
    ]);

    const completedTopics = progressList.filter(p => p.isCompleted);
    const totalAttemptedMCQs = progressList.reduce((sum, p) => sum + (p.mcqAttempted || 0), 0);
    const totalCorrectMCQs = progressList.reduce((sum, p) => sum + (p.mcqCorrect || 0), 0);
    const totalWrongMCQs = progressList.reduce((sum, p) => sum + (p.mcqWrong || 0), 0);

    const completionPercentage = Math.min(100, Math.round((completedTopics.length / (totalTopicsCount || 23)) * 100));

    res.json({
      success: true,
      data: {
        summary: {
          completionPercentage,
          completedTopicsCount: completedTopics.length,
          totalTopicsCount: totalTopicsCount || 23,
          totalAttemptedMCQs,
          totalCorrectMCQs,
          totalWrongMCQs,
          accuracyPercentage: totalAttemptedMCQs > 0 ? Math.round((totalCorrectMCQs / totalAttemptedMCQs) * 100) : 0,
          testsTakenCount: testSubmissions.length
        },
        topicProgress: progressList,
        recentTests: testSubmissions.slice(-5)
      }
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/grammar/progress
 * Update topic progress (Mark viewed, mark completed)
 */
router.post('/progress', authenticate, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { topicId, isCompleted, isViewed, timeSpentSeconds } = req.body;

    if (!topicId) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'topicId আবশ্যক' }
      });
    }

    const tId = Number(topicId);
    let record = await GrammarProgress.findOne({ where: { userId, topicId: tId } });

    if (record) {
      const updateData = {
        updatedAt: new Date().toISOString()
      };
      if (isCompleted !== undefined) {
        updateData.isCompleted = Boolean(isCompleted);
        if (isCompleted) updateData.completedAt = new Date().toISOString();
      }
      if (isViewed !== undefined) updateData.isViewed = Boolean(isViewed);
      await GrammarProgress.update(updateData, { where: { id: record.id } });
      record = await GrammarProgress.findByPk(record.id);
    } else {
      record = await GrammarProgress.create({
        userId,
        topicId: tId,
        isViewed: isViewed !== undefined ? Boolean(isViewed) : true,
        isCompleted: Boolean(isCompleted),
        completedAt: isCompleted ? new Date().toISOString() : null,
        timeSpentSeconds: timeSpentSeconds ? Number(timeSpentSeconds) : 0,
        mcqAttempted: 0,
        mcqCorrect: 0,
        mcqWrong: 0
      });
    }

    res.json({
      success: true,
      data: record,
      message: 'অগ্রগতি সফলভাবে সংরক্ষিত হয়েছে / Progress updated'
    });
  } catch (err) {
    next(err);
  }
});

// ===========================================================================
// 8. BOOKMARK SYSTEM API
// ===========================================================================

/**
 * GET /api/grammar/bookmarks
 * Get user bookmarks with item type preview
 */
router.get('/bookmarks', authenticate, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const bookmarks = await GrammarBookmark.findAll({ where: { userId } });
    res.json({
      success: true,
      total: bookmarks.length,
      data: bookmarks
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/grammar/bookmarks
 * Add Bookmark with Duplicate Prevention
 */
router.post('/bookmarks', authenticate, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { itemType = 'TOPIC', itemId, customNote = '' } = req.body;

    if (!itemId) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'itemId আবশ্যক' }
      });
    }

    const numItemId = Number(itemId);

    // Duplicate Prevention Check
    const existing = await GrammarBookmark.findOne({
      where: { userId, itemType, itemId: numItemId }
    });

    if (existing) {
      if (customNote) {
        await GrammarBookmark.update({ customNote }, { where: { id: existing.id } });
      }
      return res.json({
        success: true,
        isDuplicate: true,
        data: existing,
        message: 'আইটেমটি ইতিমধ্যে বুকমার্কে সংরক্ষিত রয়েছে / Already bookmarked'
      });
    }

    const created = await GrammarBookmark.create({
      userId,
      itemType,
      itemId: numItemId,
      customNote,
      createdAt: new Date().toISOString()
    });

    res.status(201).json({
      success: true,
      isDuplicate: false,
      data: created,
      message: 'বুকমার্ক সফলভাবে সংরক্ষিত হয়েছে / Bookmarked successfully'
    });
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /api/grammar/bookmarks/:id
 * Remove Bookmark
 */
router.delete('/bookmarks/:id', authenticate, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const id = Number(req.params.id);

    const bookmark = await GrammarBookmark.findOne({ where: { id, userId } });
    if (!bookmark) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'বুকমার্কটি পাওয়া যায়নি / Bookmark not found' }
      });
    }

    await GrammarBookmark.destroy({ where: { id } });

    res.json({
      success: true,
      message: 'বুকমার্ক সফলভাবে মুছে ফেলা হয়েছে / Bookmark removed'
    });
  } catch (err) {
    next(err);
  }
});

// ===========================================================================
// 9. LEGACY COMPATIBILITY ENDPOINTS (100% Backward Compatible)
// ===========================================================================

router.get('/lessons', async (req, res, next) => {
  try {
    const topics = await GrammarTopic.findAll();
    res.json({ success: true, data: topics });
  } catch (err) {
    next(err);
  }
});

router.post('/toggle-complete', authenticate, async (req, res, next) => {
  req.body.isCompleted = req.body.isCompleted !== undefined ? req.body.isCompleted : true;
  return router.handle({ ...req, url: '/progress', method: 'POST' }, res, next);
});

router.get('/my-bookmarks', authenticate, async (req, res, next) => {
  return router.handle({ ...req, url: '/bookmarks', method: 'GET' }, res, next);
});

router.post('/toggle-bookmark', authenticate, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { topicId, customNote } = req.body;
    if (!topicId) return res.status(400).json({ success: false, error: { message: 'topicId আবশ্যক' } });

    const existing = await GrammarBookmark.findOne({ where: { userId, itemType: 'TOPIC', itemId: Number(topicId) } });
    if (existing) {
      await GrammarBookmark.destroy({ where: { id: existing.id } });
      return res.json({ success: true, bookmarked: false, message: 'বুকমার্ক সরানো হয়েছে' });
    }
    const created = await GrammarBookmark.create({
      userId,
      itemType: 'TOPIC',
      itemId: Number(topicId),
      customNote: customNote || ''
    });
    res.json({ success: true, bookmarked: true, data: created, message: 'বুকমার্ক যোগ করা হয়েছে' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
