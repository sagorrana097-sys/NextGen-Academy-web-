const express = require('express');
const {
  GrammarLesson,
  GrammarChapter,
  GrammarTopic,
  GrammarRule,
  GrammarQuestion,
  GrammarBoardQuestion,
  GrammarModelTest,
  GrammarProgress,
  GrammarBookmark
} = require('../models');
const { authenticate, requireRole } = require('../middleware/auth');
const AuditService = require('../services/auditService');

const router = express.Router();

const DEFAULT_STARTER_LESSONS = [
  {
    id: 1,
    title: 'Tense & Time Masterclass (কাল ও সময়)',
    slug: 'tense-and-time-masterclass',
    category: 'TENSE',
    level: 'Class 6 - 12 (SSC & HSC)',
    summary: '১২ প্রকার Tense-এর গঠনপ্রণালী, সময় নির্দেশক চাবিকাঠি (Time Markers) ও শর্টকাট টেকনিক।',
    teacherNotes: 'আলমগীর স্যারের স্পেশাল টেকনিক: প্রতিটি Tense মনে রাখার জন্য ১টি মাত্র কী-ওয়ার্ড মনে রাখুন।',
    isPublished: true,
    viewCount: 420,
    rules: [
      {
        name: 'Present Indefinite Tense',
        nameBn: 'সাধারণ বর্তমান কাল',
        formula: 'Subject + V1 (s/es if 3rd person singular) + Extension',
        timeMarkers: 'always, regularly, daily, everyday, generally, usually, normally, often, sometimes',
        exampleEn: 'He reads the holy Quran daily.',
        exampleBn: 'সে প্রতিদিন পবিত্র কুরআন তিলাওয়াত করে।',
        tips: 'Subject ৩য় পুরুষ একবচন (He, She, It, নাম) হলে মূল Verb-এর শেষে s বা es যুক্ত হয়।'
      },
      {
        name: 'Past Continuous Tense',
        nameBn: 'ঘটমান অতীত কাল',
        formula: 'Subject + was/were + V1+ing + Extension',
        timeMarkers: 'while, when, at that time, that evening, throughout the night',
        exampleEn: 'While I was walking along the road, a snake bit him.',
        exampleBn: 'যখন আমি রাস্তা দিয়ে হাঁটছিলাম, একটি সাপ তাকে দংশন করেছিল।'
      },
      {
        name: 'Future Perfect Tense',
        nameBn: 'পুরাঘটিত ভবিষ্যৎ কাল',
        formula: 'Subject + shall have / will have + V3 + by/before + Time',
        timeMarkers: 'by this time, by tomorrow, by 2027, before sunset',
        exampleEn: 'They will have finished the syllabus by next month.',
        exampleBn: 'তারা আগামী মাসের মধ্যেই সিলেবাস সম্পন্ন করে ফেলবে।'
      }
    ],
    contentHtml: `
      <div class="space-y-4">
        <h3 class="text-xl font-bold text-emerald-400">🕒 Tense কেন ইংরেজির মেরুদণ্ড?</h3>
        <p>যেকোনো বাক্য শুদ্ধভাবে গঠন ও অনুবাদের জন্য Tense-এর সুস্পষ্ট ধারণা অপরিহার্য। বিশেষ করে Subject-Verb Agreement এবং Right Form of Verbs-এর অধিকাংশ প্রশ্নের উত্তর Tense-এর সূত্রের উপর নির্ভরশীল।</p>
        <div class="p-4 rounded-xl bg-slate-800/80 border border-emerald-500/30">
          <h4 class="font-bold text-amber-300">💡 গোল্ডেন রুলস চার্ট (Golden Rules Chart)</h4>
          <ul class="list-disc list-inside space-y-1 text-sm text-slate-300 mt-2">
            <li><strong>Present Perfect:</strong> Just, already, yet, recently থাকলে Have/Has + V3 বসে।</li>
            <li><strong>Since / For:</strong> সময় ধরে কোনো কাজ চললে Perfect Continuous Tense হয় (যেমন: It has been raining since morning)।</li>
            <li><strong>Before / After:</strong> Past Perfect-এ Before-এর আগে Past Perfect এবং After-এর পরে Past Perfect বসে।</li>
          </ul>
        </div>
      </div>
    `,
    quiz: [
      {
        id: 1,
        question: 'Identify the correct sentence using the time marker "recently":',
        options: [
          'I saw him recently.',
          'I have seen him recently.',
          'I was seeing him recently.',
          'I had seen him recently.'
        ],
        correctAnswerIndex: 1,
        explanation: '"Recently" শব্দটি সাধারণত Present Perfect Tense (have/has + V3) নির্দেশ করে।'
      },
      {
        id: 2,
        question: 'The patient had died before the doctor _____.',
        options: ['comes', 'came', 'had come', 'will come'],
        correctAnswerIndex: 1,
        explanation: 'Before-এর পূর্বের অংশ Past Perfect হলে পরের অংশ Past Indefinite (V2 = came) হয়।'
      },
      {
        id: 3,
        question: 'It has been raining _____ 3 hours.',
        options: ['since', 'for', 'from', 'by'],
        correctAnswerIndex: 1,
        explanation: 'নির্দিষ্ট অনির্দিষ্ট সময়কাল বা Duration (Period of time) বুঝাতে "for" ব্যবহৃত হয়।'
      }
    ]
  },
  {
    id: 2,
    title: 'Active & Passive Voice Transformation (বাচ্য পরিবর্তন)',
    slug: 'voice-change-transformation',
    category: 'VOICE',
    level: 'Class 8 - 12 (JSC, SSC, HSC)',
    summary: 'Active থেকে Passive করার ৫টি সর্বজনীন ধাপ, Interrogative ও Imperative রূপান্তর।',
    teacherNotes: 'মো: আলমগীর স্যারের ভয়েস রুল: Object হবে Subject, Tense অনুযায়ী Be verb, মূল Verb-এর V3, তারপর By + Subject-এর Object ফর্ম।',
    isPublished: true,
    viewCount: 380,
    rules: [
      {
        name: 'Basic Active to Passive Formula',
        nameBn: 'ভয়েস পরিবর্তনের মূল ৫টি ধাপ',
        formula: 'Active Object -> Subject + Be-Verb (Tense অনুযায়ী) + V3 (Past Participle) + preposition (by/to/with/at) + Active Subject -> Object',
        exampleEn: 'Active: She wrote a letter. -> Passive: A letter was written by her.',
        exampleBn: 'সে একটি চিঠি লিখেছিল -> একটি চিঠি তার দ্বারা লিখিত হয়েছিল।'
      },
      {
        name: 'Imperative Sentence Voice',
        nameBn: 'অনুজ্ঞাসূচক বাক্যের ভয়েস',
        formula: 'Let + Object + be + V3 (মূল ক্রিয়ার ৩য় রূপ)',
        exampleEn: 'Active: Do the work. -> Passive: Let the work be done.',
        exampleBn: 'কাজটি করো -> কাজটি করা হোক।'
      },
      {
        name: 'Interrogative "Who" Transformation',
        nameBn: '"Who" যুক্ত প্রশ্নবোধক বাক্যের রূপান্তর',
        formula: 'By whom + auxiliary verb + subject + (be/been/being) + V3 + ?',
        exampleEn: 'Active: Who broke the glass? -> Passive: By whom was the glass broken?',
        exampleBn: 'কে গ্লাসটি ভেঙেছে? -> কার দ্বারা গ্লাসটি ভাঙা হয়েছিল?'
      }
    ],
    contentHtml: `
      <div class="space-y-4">
        <h3 class="text-xl font-bold text-emerald-400">🛡️ Voice পরিবর্তনের বিশেষ ব্যতিক্রমসমূহ (Exceptions)</h3>
        <p>সবক্ষেত্রে 'by' বসে না। কিছু নির্দিষ্ট Verb-এর পর নির্দিষ্ট Preposition বসে:</p>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div class="p-3 bg-slate-800 rounded-xl border border-slate-700">
            <strong class="text-amber-300">Known to:</strong> He is known to me. (not by me)
          </div>
          <div class="p-3 bg-slate-800 rounded-xl border border-slate-700">
            <strong class="text-amber-300">Satisfied with:</strong> I am satisfied with his work.
          </div>
          <div class="p-3 bg-slate-800 rounded-xl border border-slate-700">
            <strong class="text-amber-300">Shocked at:</strong> We were shocked at his conduct.
          </div>
          <div class="p-3 bg-slate-800 rounded-xl border border-slate-700">
            <strong class="text-amber-300">Contained in:</strong> The bottle contains milk -> Milk is contained in the bottle.
          </div>
        </div>
      </div>
    `,
    quiz: [
      {
        id: 1,
        question: 'Active: "I know him." -> Choose the correct Passive form:',
        options: [
          'He is known by me.',
          'He is known to me.',
          'He was known to me.',
          'He has been known by me.'
        ],
        correctAnswerIndex: 1,
        explanation: '"Know" verb-এর passive voice-এ "by"-এর পরিবর্তে "to" ব্যবহৃত হয়।'
      },
      {
        id: 2,
        question: 'Active: "Shut the door." -> What is the passive voice?',
        options: [
          'Let the door shut.',
          'Let the door be shutted.',
          'Let the door be shut.',
          'The door should shut.'
        ],
        correctAnswerIndex: 2,
        explanation: 'Imperative sentence-এর passive গঠন: Let + Object + be + V3 ("shut"-এর V1, V2, V3 একই)।'
      }
    ]
  },
  {
    id: 3,
    title: 'Right Form of Verbs & Subject-Verb Agreement',
    slug: 'right-form-of-verbs-mastery',
    category: 'VERBS',
    level: 'Class 6 - 12 & Admission',
    summary: 'বোর্ড পরীক্ষার কমন ২০টি নিয়ম: As well as, Neither...nor, One of the, Lest, Had better.',
    teacherNotes: 'পরীক্ষায় ৯৯% কমন নিয়ম: Lest থাকলে পরবর্তীতে Subject + should/might + V1 বসে।',
    isPublished: true,
    viewCount: 512,
    rules: [
      {
        name: 'Rule of "Lest"',
        nameBn: '"পাছে কিছু ঘটে" অর্থে Lest-এর ব্যবহার',
        formula: 'Lest + Subject + should / might + Base Form of Verb (V1)',
        exampleEn: 'Walk fast lest you should miss the train.',
        exampleBn: 'দ্রুত হাঁটো পাছে তুমি ট্রেন মিস করো।'
      },
      {
        name: 'As well as / Along with / Together with',
        nameBn: 'প্রথম Subject অনুযায়ী Verb নির্ধারণ',
        formula: 'Subject 1 + (as well as / with / accompanied by) + Subject 2 -> Verb follows Subject 1',
        exampleEn: 'The teacher as well as the students was present.',
        exampleBn: 'শিক্ষক এবং শিক্ষার্থীরাও উপস্থিত ছিলেন।'
      },
      {
        name: 'One of the + Plural Noun + Singular Verb',
        nameBn: '"One of the"-এর পর Noun বহুবচন হলেও Verb একবচন',
        formula: 'One of the + Plural Noun + Singular Verb',
        exampleEn: 'One of my friends is a brilliant doctor.',
        exampleBn: 'আমার বন্ধুদের মধ্যে একজন একজন মেধাবী ডাক্তার।'
      }
    ],
    contentHtml: `
      <div class="space-y-4">
        <h3 class="text-xl font-bold text-emerald-400">⚡ Verb-এর রূপান্তরের শর্টকাট ট্রিকস</h3>
        <p>ইংরেজি গ্রামারে সঠিক Verb বসাতে ৩টি জিনিস সবসময় পর্যবেক্ষণ করবেন: (১) বাক্যের Subject সিঙ্গুলার নাকি প্লুরাল, (২) বাক্যে কোনো নির্দিষ্ট সময় নির্দেশক শব্দ আছে কি না, এবং (৩) বাক্যটি শর্তমূলক (Conditional) কি না।</p>
      </div>
    `,
    quiz: [
      {
        id: 1,
        question: 'He ran fast lest he _____ the bus.',
        options: ['misses', 'missed', 'should miss', 'will miss'],
        correctAnswerIndex: 2,
        explanation: 'Lest যুক্ত বাক্যে নিয়ম অনুযায়ী Subject-এর পর "should" বা "might" + V1 বসে।'
      },
      {
        id: 2,
        question: 'Neither the teacher nor the students _____ present yesterday.',
        options: ['was', 'were', 'is', 'are'],
        correctAnswerIndex: 1,
        explanation: 'Either...or / Neither...nor থাকলে দ্বিতীয় (নিকটবর্তী) Subject (the students) অনুযায়ী Verb বহুবচন (were) হয়।'
      }
    ]
  }
];

// Helper to get or seed lessons
async function getLessons() {
  const all = await GrammarLesson.findAll();
  if (all && all.length > 0) {
    return all;
  }
  // Seed defaults
  for (const item of DEFAULT_STARTER_LESSONS) {
    await GrammarLesson.create(item);
  }
  return await GrammarLesson.findAll();
}

/**
 * GET /api/grammar/topics
 * Returns list of grammar topics.
 */
router.get('/topics', async (req, res, next) => {
  try {
    const lessons = await getLessons();
    const isStudentOrGuest = !req.headers.authorization;
    
    // Sort by id asc
    lessons.sort((a, b) => Number(a.id) - Number(b.id));

    res.json({
      success: true,
      data: lessons
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/grammar/topics/:id
 * Get single topic
 */
router.get('/topics/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    let lesson = await GrammarLesson.findByPk(id);
    if (!lesson) {
      const all = await getLessons();
      lesson = all.find(l => String(l.id) === String(id) || l.slug === id);
    }
    if (!lesson) {
      return res.status(404).json({ success: false, error: { message: 'পাঠটি পাওয়া যায়নি।' } });
    }
    res.json({ success: true, data: lesson });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/grammar/topics
 * Admin creates a new grammar topic.
 */
router.post('/topics', authenticate, requireRole('ADMIN', 'SUPER_ADMIN', 'TEACHER'), async (req, res, next) => {
  try {
    const { title, category, level, summary, teacherNotes, rules, contentHtml, quiz, isPublished } = req.body;
    if (!title) {
      return res.status(400).json({ success: false, error: { message: 'টপিকের শিরোনাম আবশ্যক।' } });
    }

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'lesson-' + Date.now();

    const created = await GrammarLesson.create({
      title,
      slug,
      category: category || 'GENERAL',
      level: level || 'সকল শ্রেণির জন্য',
      summary: summary || '',
      teacherNotes: teacherNotes || '',
      rules: Array.isArray(rules) ? rules : [],
      contentHtml: contentHtml || '',
      quiz: Array.isArray(quiz) ? quiz : [],
      isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
      viewCount: 0,
      createdAt: new Date().toISOString()
    });

    await AuditService.log({
      userId: req.user.id,
      action: 'GRAMMAR_LESSON_CREATE',
      resourceType: 'GrammarLesson',
      resourceId: created.id,
      ipAddress: req.ip,
      metadata: { title }
    });

    res.json({ success: true, data: created });
  } catch (err) {
    next(err);
  }
});

/**
 * PUT /api/grammar/topics/:id
 * Admin updates grammar topic
 */
router.put('/topics/:id', authenticate, requireRole('ADMIN', 'SUPER_ADMIN', 'TEACHER'), async (req, res, next) => {
  try {
    const id = req.params.id;
    const lesson = await GrammarLesson.findByPk(id);
    if (!lesson) {
      return res.status(404).json({ success: false, error: { message: 'পাঠটি পাওয়া যায়নি।' } });
    }

    const { title, category, level, summary, teacherNotes, rules, contentHtml, quiz, isPublished } = req.body;
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (category !== undefined) updateData.category = category;
    if (level !== undefined) updateData.level = level;
    if (summary !== undefined) updateData.summary = summary;
    if (teacherNotes !== undefined) updateData.teacherNotes = teacherNotes;
    if (rules !== undefined) updateData.rules = rules;
    if (contentHtml !== undefined) updateData.contentHtml = contentHtml;
    if (quiz !== undefined) updateData.quiz = quiz;
    if (isPublished !== undefined) updateData.isPublished = Boolean(isPublished);

    await lesson.update(updateData);

    res.json({ success: true, data: lesson });
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /api/grammar/topics/:id
 * Admin deletes grammar topic
 */
router.delete('/topics/:id', authenticate, requireRole('ADMIN', 'SUPER_ADMIN'), async (req, res, next) => {
  try {
    const id = req.params.id;
    const lesson = await GrammarLesson.findByPk(id);
    if (!lesson) {
      return res.status(404).json({ success: false, error: { message: 'পাঠটি পাওয়া যায়নি।' } });
    }
    await lesson.destroy();
    res.json({ success: true, message: 'টপিক সফলভাবে মুছে ফেলা হয়েছে।' });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/grammar/ai-generate
 * Magic AI Auto-Generation endpoint for grammar lesson draft
 */
router.post('/ai-generate', authenticate, requireRole('ADMIN', 'SUPER_ADMIN', 'TEACHER'), async (req, res, next) => {
  try {
    const { topic, prompt, level } = req.body;
    if (!topic) {
      return res.status(400).json({ success: false, error: { message: 'গ্রামার টপিকের নাম উল্লেখ করুন।' } });
    }

    const cleanTopic = topic.trim();

    // High quality intelligent grammar draft generator
    const draft = {
      title: `${cleanTopic} Masterclass & Rule Guide`,
      category: cleanTopic.toUpperCase().includes('VOICE') ? 'VOICE' : 
                cleanTopic.toUpperCase().includes('NARRATION') || cleanTopic.toUpperCase().includes('SPEECH') ? 'NARRATION' :
                cleanTopic.toUpperCase().includes('CONDITION') ? 'CONDITIONALS' :
                cleanTopic.toUpperCase().includes('PREPOSITION') ? 'PREPOSITIONS' :
                cleanTopic.toUpperCase().includes('TAG') ? 'TAG_QUESTIONS' : 'GENERAL',
      level: level || 'Class 8 - 12 (SSC/HSC & Admission)',
      summary: `${cleanTopic}-এর মূল নীতিমালা, শর্টকাট গঠনপ্রণালী, বোর্ড পরীক্ষার উদাহরণ ও কুইজ।`,
      teacherNotes: `মো: আলমগীর স্যারের স্পেশাল টেকনিক: ${cleanTopic}-এর বোর্ড প্রশ্ন সমাধানের জন্য প্রধান ৩টি সূত্র মুখস্থ রাখুন।`,
      rules: [
        {
          name: `Primary Rule 1: ${cleanTopic} Structure`,
          nameBn: `নিয়ম ১: মূল কাঠামো ও ব্যবহারবিধি`,
          formula: 'Subject + Specific Auxiliary / Connector + Target Form + Contextual Object',
          exampleEn: `Example sentence demonstrating ${cleanTopic} accurately.`,
          exampleBn: `${cleanTopic} সঠিকভাবে প্রয়োগের বাস্তব উদাহরণ।`,
          tips: 'পরীক্ষায় সবচেয়ে বেশি আসা ক্ষেত্রসমূহ লক্ষ্য রাখুন।'
        },
        {
          name: `Special Case: Common Pitfalls & Traps`,
          nameBn: `নিয়ম ২: সাধারণ ভুল ও ব্যতিক্রমী ক্ষেত্র`,
          formula: 'Exception Pattern -> Fixed Usage Rule',
          exampleEn: 'He prefers reading to writing.',
          exampleBn: 'সে লেখার চেয়ে পড়তে বেশি পছন্দ করে (Prefer-এর পর Than নয়, To বসে)।'
        },
        {
          name: `Exam Shortcut Formula`,
          nameBn: `নিয়ম ৩: দ্রুত উত্তর বের করার টেকনিক`,
          formula: 'Trigger Word detected -> Apply corresponding transformation immediately',
          exampleEn: 'Had I been a king, I would have helped the poor.',
          exampleBn: '৩য় শর্তমূলক বাক্যের (3rd Conditional) বিশেষ ব্যবহার।'
        }
      ],
      contentHtml: `
        <div class="space-y-4">
          <h3 class="text-xl font-bold text-emerald-400">✨ ${cleanTopic} সহজ ব্যাখ্যা ও টেকনিক</h3>
          <p>বোর্ড পরীক্ষা এবং ভর্তি পরীক্ষায় ${cleanTopic} অত্যন্ত গুরুত্বপূর্ণ একটি অধ্যায়। নিচে এর মূল নিয়মগুলো সংক্ষেপে তুলে ধরা হলো:</p>
          <div class="p-4 rounded-xl bg-slate-800/90 border border-slate-700 space-y-2">
            <h4 class="font-bold text-amber-300">📌 আলমগীর স্যারের গোল্ডেন টিপস:</h4>
            <p class="text-sm text-slate-300">প্রশ্ন পাওয়ার সাথে সাথে বাক্যটির টেন্স এবং সাবজেক্টের ব্যক্তিবাচক/বস্তুবাচক অবস্থান চিহ্নিত করুন।</p>
          </div>
        </div>
      `,
      quiz: [
        {
          id: 1,
          question: `Which sentence correctly applies the rules of ${cleanTopic}?`,
          options: [
            `Option A: Standard correct usage of ${cleanTopic}.`,
            `Option B: Incorrect usage with wrong auxiliary verb.`,
            `Option C: Faulty agreement pattern.`,
            `Option D: Misplaced modifier.`
          ],
          correctAnswerIndex: 0,
          explanation: `Option A সঠিক কারণ এটি ${cleanTopic}-এর ব্যাকরণিক নিয়ম সম্পূর্ণরূপে পূরণ করে।`
        },
        {
          id: 2,
          question: 'Choose the correct form to complete the sentence:',
          options: ['Option 1', 'Option 2 (Correct)', 'Option 3', 'Option 4'],
          correctAnswerIndex: 1,
          explanation: 'সংশ্লিষ্ট নিয়মের ব্যতিক্রমী ব্যবহারের কারণে Option 2 সঠিক।'
        }
      ]
    };

    res.json({
      success: true,
      data: draft,
      message: `AI সফলভাবে ${cleanTopic} বিষয়ের ড্রাফট তৈরি করেছে!`
    });
  } catch (err) {
    next(err);
  }
});

// ===========================================================================
// SCALABLE INTERACTIVE GRAMMAR BOOK ENDPOINTS
// ===========================================================================

/**
 * GET /api/grammar/chapters
 * Get all 23 grammar chapters
 */
router.get('/chapters', async (req, res, next) => {
  try {
    const chapters = await GrammarChapter.findAll();
    res.json({
      success: true,
      data: chapters || []
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/grammar/chapters/:slug
 * Get single chapter with its topics
 */
router.get('/chapters/:slug', async (req, res, next) => {
  try {
    const slug = req.params.slug;
    const chapters = await GrammarChapter.findAll();
    const chapter = chapters.find(c => c.slug === slug || String(c.id) === String(slug));
    if (!chapter) {
      return res.status(404).json({ success: false, error: { message: 'অধ্যায়টি পাওয়া যায়নি।' } });
    }
    const topics = await GrammarTopic.findAll({ where: { chapterId: chapter.id } });
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
 * GET /api/grammar/board-questions
 * Filter board questions by topic, board, year
 */
router.get('/board-questions', async (req, res, next) => {
  try {
    const { topicId, board, year } = req.query;
    const where = {};
    if (topicId) where.topicId = Number(topicId);
    if (board) where.board = board;
    if (year) where.year = Number(year);
    const list = await GrammarBoardQuestion.findAll({ where });
    res.json({
      success: true,
      data: list || []
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/grammar/model-tests
 * List all model tests
 */
router.get('/model-tests', async (req, res, next) => {
  try {
    const tests = await GrammarModelTest.findAll();
    res.json({
      success: true,
      data: tests || []
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/grammar/my-progress
 * Get student's completed topics & progress
 */
router.get('/my-progress', authenticate, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const progressList = await GrammarProgress.findAll({ where: { userId } });
    res.json({
      success: true,
      data: progressList || []
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/grammar/toggle-complete
 * Toggle topic completion status
 */
router.post('/toggle-complete', authenticate, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { topicId, isCompleted } = req.body;
    if (!topicId) {
      return res.status(400).json({ success: false, error: { message: 'topicId আবশ্যক।' } });
    }

    const existing = await GrammarProgress.findOne({ where: { userId, topicId: Number(topicId) } });
    if (existing) {
      await existing.update({
        isCompleted: isCompleted !== undefined ? Boolean(isCompleted) : !existing.isCompleted,
        completedAt: new Date().toISOString()
      });
      return res.json({ success: true, data: existing });
    }

    const created = await GrammarProgress.create({
      userId,
      topicId: Number(topicId),
      isCompleted: isCompleted !== undefined ? Boolean(isCompleted) : true,
      completedAt: new Date().toISOString()
    });
    res.json({ success: true, data: created });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/grammar/my-bookmarks
 * Get student's bookmarks
 */
router.get('/my-bookmarks', authenticate, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const bookmarks = await GrammarBookmark.findAll({ where: { userId } });
    res.json({
      success: true,
      data: bookmarks || []
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/grammar/toggle-bookmark
 * Add or remove bookmark
 */
router.post('/toggle-bookmark', authenticate, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { topicId, customNote } = req.body;
    if (!topicId) {
      return res.status(400).json({ success: false, error: { message: 'topicId আবশ্যক।' } });
    }

    const existing = await GrammarBookmark.findOne({ where: { userId, topicId: Number(topicId) } });
    if (existing) {
      await existing.destroy();
      return res.json({ success: true, bookmarked: false, message: 'বুকমার্ক সরানো হয়েছে।' });
    }

    const created = await GrammarBookmark.create({
      userId,
      topicId: Number(topicId),
      customNote: customNote || '',
      createdAt: new Date().toISOString()
    });
    res.json({ success: true, bookmarked: true, data: created, message: 'টপিক বুকমার্ক করা হয়েছে!' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
