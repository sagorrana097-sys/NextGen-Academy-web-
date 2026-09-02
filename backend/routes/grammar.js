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
 * Filter MCQs
 */
router.get('/mcqs', async (req, res, next) => {
  try {
    const { topicId, chapterId, difficulty, board, year } = req.query;
    let list = await GrammarQuestion.findAll({ where: { status: 'ACTIVE' } });

    if (topicId) list = list.filter(q => String(q.topicId) === String(topicId));
    if (chapterId) list = list.filter(q => String(q.chapterId) === String(chapterId));
    if (difficulty) list = list.filter(q => q.difficulty === difficulty);
    if (board) list = list.filter(q => q.board === board);
    if (year) list = list.filter(q => String(q.year) === String(year));

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
 * POST /api/grammar/mcqs/submit
 * Submit single or bulk MCQ answers and track student performance
 */
router.post('/mcqs/submit', authenticate, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { questionId, selectedOptionIndex, submissions } = req.body;

    // Support single or batch submissions
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

      // Update student progress for this topic
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
 * Create MCQ (Admin / Teacher)
 */
router.post('/mcqs', authenticate, requireRole(['ADMIN', 'SUPER_ADMIN', 'TEACHER']), async (req, res, next) => {
  try {
    const {
      chapterId,
      topicId,
      questionEn,
      questionBn,
      options,
      correctOptionIndex,
      explanationEn,
      explanationBn,
      difficulty,
      marks,
      isBoardQuestion,
      board,
      year,
      tags
    } = req.body;

    if (!questionEn || !Array.isArray(options) || options.length < 2 || correctOptionIndex === undefined) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'প্রশ্ন, কমপক্ষে ২টি অপশন এবং সঠিক উত্তরের ইনডেক্স আবশ্যক' }
      });
    }

    if (correctOptionIndex < 0 || correctOptionIndex >= options.length) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_OPTION_INDEX', message: 'সঠিক উত্তরের ইনডেক্স অপশনের সীমার মধ্যে হতে হবে' }
      });
    }

    const newMCQ = await GrammarQuestion.create({
      chapterId: chapterId ? Number(chapterId) : null,
      topicId: topicId ? Number(topicId) : null,
      questionType: 'MCQ',
      questionEn: questionEn.trim(),
      questionBn: questionBn ? questionBn.trim() : '',
      options,
      correctOptionIndex: Number(correctOptionIndex),
      correctAnswerText: options[correctOptionIndex],
      explanationEn: explanationEn || '',
      explanationBn: explanationBn || '',
      difficulty: difficulty || 'MEDIUM',
      marks: marks ? Number(marks) : 1,
      isBoardQuestion: Boolean(isBoardQuestion),
      board: board || null,
      year: year ? Number(year) : null,
      tags: Array.isArray(tags) ? tags : [],
      status: 'ACTIVE'
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

    await GrammarQuestion.update(req.body, { where: { id } });
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
// 6. MODEL TEST SYSTEM API
// ===========================================================================

/**
 * GET /api/grammar/model-tests
 * List all model tests
 */
router.get('/model-tests', async (req, res, next) => {
  try {
    const list = await GrammarModelTest.findAll({ where: { status: 'PUBLISHED' } });
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
 * Get single test. If user is taking the test, optionally hides correct answers.
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

    // Populate questions
    let questions = [];
    if (Array.isArray(test.questionIds) && test.questionIds.length > 0) {
      questions = await GrammarQuestion.findAll({
        where: { id: { $in: test.questionIds }, status: 'ACTIVE' }
      });
    } else {
      questions = await GrammarQuestion.findAll({ where: { status: 'ACTIVE' }, limit: 20 });
    }

    res.json({
      success: true,
      data: {
        ...test,
        questions: questions.map(q => ({
          id: q.id,
          question: q.questionEn,
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
 * POST /api/grammar/model-tests/:id/submit
 * Evaluate model test, calculate marks & store submission
 */
router.post('/model-tests/:id/submit', authenticate, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const testId = Number(req.params.id);
    const { answers = {}, timeTakenSeconds = 0 } = req.body;

    const test = await GrammarModelTest.findByPk(testId);
    if (!test) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'মডেল টেস্টটি পাওয়া যায়নি' }
      });
    }

    let questions = [];
    if (Array.isArray(test.questionIds) && test.questionIds.length > 0) {
      questions = await GrammarQuestion.findAll({ where: { id: { $in: test.questionIds } } });
    } else {
      questions = await GrammarQuestion.findAll({ where: { status: 'ACTIVE' }, limit: 20 });
    }

    let correctCount = 0;
    let wrongCount = 0;
    const breakdown = [];

    for (const q of questions) {
      const userAns = answers[q.id];
      const isAttempted = userAns !== undefined && userAns !== null;
      const isCorrect = isAttempted && Number(userAns) === q.correctOptionIndex;

      if (isCorrect) correctCount++;
      else if (isAttempted) wrongCount++;

      breakdown.push({
        questionId: q.id,
        question: q.questionEn,
        selectedOptionIndex: userAns !== undefined ? userAns : null,
        correctOptionIndex: q.correctOptionIndex,
        isCorrect,
        explanation: q.explanationBn || q.explanationEn
      });
    }

    const totalQuestions = questions.length;
    const score = correctCount;
    const percentage = Math.round((score / (totalQuestions || 1)) * 100);
    const passed = score >= (test.passingMarks || Math.round(totalQuestions * 0.4));

    // Store test submission record
    const submission = await GrammarTestSubmission.create({
      userId,
      modelTestId: test.id,
      totalQuestions,
      attemptedQuestions: Object.keys(answers).length,
      correctAnswers: correctCount,
      wrongAnswers: wrongCount,
      score,
      percentage,
      passed,
      timeTakenSeconds: Number(timeTakenSeconds),
      answers,
      submittedAt: new Date().toISOString()
    });

    res.json({
      success: true,
      data: {
        submissionId: submission.id,
        testTitle: test.titleBn,
        score,
        totalQuestions,
        percentage,
        passed,
        correctCount,
        wrongCount,
        breakdown
      }
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/grammar/model-tests
 * Create Model Test (Admin / Teacher)
 */
router.post('/model-tests', authenticate, requireRole(['ADMIN', 'SUPER_ADMIN', 'TEACHER']), async (req, res, next) => {
  try {
    const { titleEn, titleBn, durationMinutes, totalMarks, passingMarks, questionIds } = req.body;

    if (!titleEn || !titleBn) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'titleEn এবং titleBn আবশ্যক' }
      });
    }

    const count = await GrammarModelTest.count();
    const newTest = await GrammarModelTest.create({
      titleEn: titleEn.trim(),
      titleBn: titleBn.trim(),
      descriptionBn: req.body.descriptionBn || '',
      durationMinutes: durationMinutes ? Number(durationMinutes) : 20,
      totalMarks: totalMarks ? Number(totalMarks) : (questionIds?.length || 20),
      passingMarks: passingMarks ? Number(passingMarks) : 12,
      difficulty: req.body.difficulty || 'BOARD_STANDARD',
      chapterId: req.body.chapterId ? Number(req.body.chapterId) : null,
      topicId: req.body.topicId ? Number(req.body.topicId) : null,
      questionIds: Array.isArray(questionIds) ? questionIds.map(Number) : [],
      targetClass: req.body.targetClass || 'Class 9-10 (SSC 2026)',
      orderIndex: count + 1,
      status: 'PUBLISHED'
    });

    res.status(201).json({
      success: true,
      data: newTest,
      message: 'মডেল টেস্ট তৈরি সফল হয়েছে / Model test created'
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
