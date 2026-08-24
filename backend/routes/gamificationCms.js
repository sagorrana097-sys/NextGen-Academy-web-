const express = require('express');
const { authenticate, requireRole } = require('../middleware/auth');
const AuditService = require('../services/auditService');

const router = express.Router();

// In-memory persistent state for gamification CMS
let gamificationConfig = {
  dailyLoginReward: 10,
  mcqWinReward: 50,
  quizParticipationReward: 5,
  streakBonus7Days: 50,
  rewardStoreItems: [
    {
      id: 'note-physics-ch4',
      titleBn: 'মো: আলমগীর হোসেন (সাগর) স্যারের স্পেশাল পদার্থবিজ্ঞান হ্যান্ডনোট',
      titleEn: 'Physics Hand-written Master Notes',
      category: 'SPECIAL_NOTES',
      price: 50,
      badge: 'সেরা বিক্রিত',
      isActive: true,
      description: 'কাজ, ক্ষমতা ও শক্তি এবং বলবিদ্যার সকল বোর্ড প্রশ্ন ও গাণিতিক সূত্রের হাতে লেখা রঙিন লেকচার শিট।',
      downloadUrl: 'https://example.com/notes/physics-ch4.pdf'
    },
    {
      id: 'model-test-ssc-26',
      titleBn: 'SSC ২০২৬ স্পেশাল চূড়ান্ত মডেল টেস্ট প্রশ্ন ও সমাধান',
      titleEn: 'SSC 2026 Premium Model Test Papers',
      category: 'MODEL_TESTS',
      price: 80,
      badge: 'প্রিমিয়াম',
      isActive: true,
      description: 'শীর্ষ শিক্ষাপ্রতিষ্ঠানের অভিজ্ঞ শিক্ষকদের তৈরি ১০০% কমন উপযোগী পূর্ণাঙ্গ প্রশ্নপত্র ও বিস্তারিত উত্তরমালা।',
      downloadUrl: 'https://example.com/tests/ssc-2026.pdf'
    },
    {
      id: 'ai-booster-pack',
      titleBn: '২৪/৭ এআই ডাউট সলভার আনলিমিটেড বুস্টার প্যাক',
      titleEn: '24/7 AI Doubt Solver Unlimited Booster',
      category: 'BOOSTER',
      price: 30,
      badge: 'পাওয়ার আপ',
      isActive: true,
      description: 'যেকোনো কঠিন গণিত বা বিজ্ঞানের প্রশ্নের তাৎক্ষণিক ফটো স্ক্যান ও AI সলিউশনের আনলিমিটেড অ্যাক্সেস।'
    }
  ],
  battleQuestions: [
    {
      id: 1,
      subject: 'পদার্থবিজ্ঞান',
      question: 'কোনো বস্তুর বেগ দ্বিগুণ করা হলে তার গতিশক্তি কতগুণ বৃদ্ধি পাবে?',
      optionA: '২ গুণ',
      optionB: '৪ গুণ',
      optionC: '৮ গুণ',
      optionD: 'অপরিবর্তিত থাকবে',
      correctIndex: 1,
      timeLimit: 30,
      explanation: 'গতিশক্তি E_k = 1/2 m v²। বেগ দ্বিগুণ হলে (2v)² = 4v², অর্থাৎ গতিশক্তি ৪ গুণ হবে।'
    },
    {
      id: 2,
      subject: 'উচ্চতর গণিত',
      question: 'যদি sin θ = 4/5 হয়, তবে tan θ এর মান কত?',
      optionA: '3/5',
      optionB: '4/3',
      optionC: '3/4',
      optionD: '5/4',
      correctIndex: 1,
      timeLimit: 30,
      explanation: 'sin θ = 4/5 হলে cos θ = 3/5। সুতরাং tan θ = 4/3।'
    },
    {
      id: 3,
      subject: 'রসায়ন',
      question: 'পানির অণুর (H₂O) বন্ধন কোণ (Bond Angle) কত ডিগ্রি?',
      optionA: '১০৯.৫°',
      optionB: '১০৪.৫°',
      optionC: '১২০°',
      optionD: '১৮০°',
      correctIndex: 1,
      timeLimit: 30,
      explanation: 'অক্সিজেনের ২টি নিঃসঙ্গ ইলেকট্রন জোড়ের বিকর্ষণে বন্ধন কোণ ১০৪.৫° হয়।'
    }
  ],
  formulas: [
    {
      id: 'phy-kin-1',
      subject: 'PHYSICS',
      subjectBn: 'পদার্থবিজ্ঞান',
      topic: 'গতিবিদ্যা (Kinematics)',
      titleBn: 'গতির মৌলিক সমীকরণসমূহ',
      latex: 'v = u + at \\qquad s = ut + \\frac{1}{2}at^2 \\qquad v^2 = u^2 + 2as',
      explanation: 'সমত্বরণে চলমান বস্তুর গতি সমীকরণ।'
    }
  ],
  smartNotes: [
    {
      id: 'sb-physics-ch4',
      subject: 'পদার্থবিজ্ঞান',
      chapter: 'অধ্যায় ৪: কাজ, ক্ষমতা ও শক্তি',
      date: '২০ আগস্ট ২০২৬',
      slidesCount: 8,
      summary: 'গাণিতিক সমস্যার সমাধান ও যান্ত্রিক শক্তির নিত্যতা সূত্রের প্রমাণসহ স্মার্টবোর্ড নোট।'
    }
  ]
};

/**
 * GET /api/admin/gamification/settings
 */
router.get('/settings', authenticate, async (req, res, next) => {
  try {
    res.json({
      success: true,
      data: gamificationConfig
    });
  } catch (err) {
    next(err);
  }
});

/**
 * PUT /api/admin/gamification/settings
 * Update Coin & Reward Rules
 */
router.put('/settings', authenticate, requireRole('ADMIN', 'SUPER_ADMIN'), async (req, res, next) => {
  try {
    const { dailyLoginReward, mcqWinReward, quizParticipationReward, streakBonus7Days } = req.body;
    if (dailyLoginReward !== undefined) gamificationConfig.dailyLoginReward = Number(dailyLoginReward);
    if (mcqWinReward !== undefined) gamificationConfig.mcqWinReward = Number(mcqWinReward);
    if (quizParticipationReward !== undefined) gamificationConfig.quizParticipationReward = Number(quizParticipationReward);
    if (streakBonus7Days !== undefined) gamificationConfig.streakBonus7Days = Number(streakBonus7Days);

    await AuditService.log({
      userId: req.user.id,
      action: 'UPDATE_GAMIFICATION_SETTINGS',
      resourceType: 'Settings',
      ipAddress: req.ip,
      metadata: gamificationConfig
    });

    res.json({
      success: true,
      message: 'গ্যামিফিকেশন ও রিওয়ার্ড সেটিংস সফলভাবে সংরক্ষিত হয়েছে!',
      data: gamificationConfig
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/admin/gamification/rewards
 * Add a new Reward Store Item
 */
router.post('/rewards', authenticate, requireRole('ADMIN', 'SUPER_ADMIN'), async (req, res, next) => {
  try {
    const { titleBn, category, price, description, downloadUrl, badge } = req.body;
    if (!titleBn || !price) {
      return res.status(400).json({ success: false, error: { message: 'আইটেমের নাম ও কয়েন মূল্য আবশ্যক।' } });
    }

    const newItem = {
      id: `reward-${Date.now()}`,
      titleBn,
      titleEn: req.body.titleEn || titleBn,
      category: category || 'SPECIAL_NOTES',
      price: Number(price),
      badge: badge || 'নতুন',
      isActive: true,
      description: description || '',
      downloadUrl: downloadUrl || ''
    };

    gamificationConfig.rewardStoreItems.unshift(newItem);

    res.json({
      success: true,
      message: 'রিওয়ার্ড আইটেম সফলভাবে যোগ করা হয়েছে!',
      data: newItem
    });
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /api/admin/gamification/rewards/:id
 */
router.delete('/rewards/:id', authenticate, requireRole('ADMIN', 'SUPER_ADMIN'), async (req, res, next) => {
  try {
    const { id } = req.params;
    gamificationConfig.rewardStoreItems = gamificationConfig.rewardStoreItems.filter(item => item.id !== id);
    res.json({
      success: true,
      message: 'রিওয়ার্ড আইটেম মুছে ফেলা হয়েছে।'
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/admin/gamification/battle-questions
 * Add 1v1 Battle MCQ Question
 */
router.post('/battle-questions', authenticate, requireRole('ADMIN', 'SUPER_ADMIN'), async (req, res, next) => {
  try {
    const { subject, question, optionA, optionB, optionC, optionD, correctIndex, timeLimit, explanation } = req.body;
    if (!question || !optionA || !optionB) {
      return res.status(400).json({ success: false, error: { message: 'প্রশ্ন ও অপশনগুলো পূরণ করুন।' } });
    }

    const newQ = {
      id: Date.now(),
      subject: subject || 'সাধারণ বিজ্ঞান',
      question,
      optionA,
      optionB,
      optionC: optionC || '',
      optionD: optionD || '',
      correctIndex: Number(correctIndex) || 0,
      timeLimit: Number(timeLimit) || 30,
      explanation: explanation || ''
    };

    gamificationConfig.battleQuestions.unshift(newQ);

    res.json({
      success: true,
      message: '১v১ ব্যাটেল প্রশ্ন সফলভাবে যোগ করা হয়েছে!',
      data: newQ
    });
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /api/admin/gamification/battle-questions/:id
 */
router.delete('/battle-questions/:id', authenticate, requireRole('ADMIN', 'SUPER_ADMIN'), async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    gamificationConfig.battleQuestions = gamificationConfig.battleQuestions.filter(q => q.id !== id);
    res.json({
      success: true,
      message: 'প্রশ্ন মুছে ফেলা হয়েছে।'
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/admin/gamification/formulas
 */
router.post('/formulas', authenticate, requireRole('ADMIN', 'SUPER_ADMIN'), async (req, res, next) => {
  try {
    const { subject, subjectBn, topic, titleBn, latex, explanation } = req.body;
    if (!titleBn || !latex) {
      return res.status(400).json({ success: false, error: { message: 'শিরোনাম ও LaTeX ফর্মুলা আবশ্যক।' } });
    }

    const newFormula = {
      id: `form-${Date.now()}`,
      subject: subject || 'PHYSICS',
      subjectBn: subjectBn || 'পদার্থবিজ্ঞান',
      topic: topic || 'জেনারেল',
      titleBn,
      latex,
      explanation: explanation || ''
    };

    gamificationConfig.formulas.unshift(newFormula);

    res.json({
      success: true,
      message: 'নতুন ফর্মুলা সফলভাবে যোগ করা হয়েছে!',
      data: newFormula
    });
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /api/admin/gamification/formulas/:id
 */
router.delete('/formulas/:id', authenticate, requireRole('ADMIN', 'SUPER_ADMIN'), async (req, res, next) => {
  try {
    const { id } = req.params;
    gamificationConfig.formulas = gamificationConfig.formulas.filter(f => f.id !== id);
    res.json({
      success: true,
      message: 'ফর্মুলা মুছে ফেলা হয়েছে।'
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
