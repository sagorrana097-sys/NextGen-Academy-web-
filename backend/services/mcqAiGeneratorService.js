const https = require('https');
const { parseMultiBoardPrompt, formatAcademicBadge } = require('./multiBoardDistributionEngine');
const { StudyMaterial } = require('../models');

/**
 * AI-Powered MCQ Generator Service with Multi-Board & Multi-Year Distribution Engine
 * Supports Google Gemini API (gemini-1.5-flash) and intelligent NCTB curriculum-aligned fallback generator.
 */

async function callGeminiApi(apiKey, prompt) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }]
        }
      ],
      generationConfig: {
        temperature: 0.4,
        topP: 0.95,
        maxOutputTokens: 3000,
        responseMimeType: 'application/json'
      }
    });

    const options = {
      hostname: 'generativelanguage.googleapis.com',
      port: 443,
      path: `/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      },
      timeout: 15000
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            const data = JSON.parse(body);
            const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (candidateText) {
              const parsedQuestions = JSON.parse(candidateText);
              return resolve(parsedQuestions);
            }
          }
          reject(new Error(`Gemini API Error: Status ${res.statusCode} - ${body}`));
        } catch (err) {
          reject(err);
        }
      });
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Gemini API request timed out'));
    });

    req.write(payload);
    req.end();
  });
}

/**
 * Intelligent NCTB Curriculum Fallback Generator
 */
function generateFallbackQuestions(topic, subject, classGrade, difficulty = 'MEDIUM', count = 5, notes = '', board = 'সকল বোর্ড', examYear = '2025') {
  const t = (topic || 'সাধারণ বিষয়').trim();
  const s = (subject || 'বিজ্ঞান').trim();
  const c = (classGrade || '১০ম শ্রেণি').trim();
  const b = (board || 'সকল বোর্ড').trim();
  const y = (examYear || '2025').trim();
  const badge = formatAcademicBadge(b, y, 'MCQ');

  // General Subject Knowledge Templates
  const knowledgeTemplates = [
    {
      q: (tp, sj, bd, yr) => `[${bd} বোর্ড ${yr}] ${tp}-এর ক্ষেত্রে নিচের কোন তথ্যটি সঠিক?`,
      opts: [
        'এটি একটি মৌলিক প্রাকৃতিক নীতি যা পরীক্ষালব্ধ প্রমাণের ওপর প্রতিষ্ঠিত',
        'এটি কেবলমাত্র তাত্ত্বিক ধারণা এবং বাস্তব ক্ষেত্রে প্রযোজ্য নয়',
        'এর কোনো গাণিতিক বা পরীক্ষামূলক প্রমাণ নেই',
        'এটি স্থানভেদে সম্পূর্ণ পরিবর্তিত হয়'
      ],
      ans: 0,
      exp: (tp, sj) => `${tp} সংশ্লিষ্ট বিষয়ে প্রাথমিক ও মৌলিক তত্ত্বের ওপর প্রতিষ্ঠিত।`
    },
    {
      q: (tp, sj, bd, yr) => `[${bd} বোর্ড ${yr}] ${tp} সম্পর্কিত গাণিতিক সমস্যা সমাধানে নিচের কোন এককটি ব্যবহৃত হয়?`,
      opts: ['এসআই একক (SI Unit)', 'সিজিএস একক (CGS Unit)', 'এফপিএস একক (FPS Unit)', 'কোনোটিই নয়'],
      ans: 0,
      exp: (tp, sj) => `আন্তর্জাতিক মান অনুযায়ী এসআই (SI) একক সর্বজনীনভাবে ব্যবহৃত হয়।`
    },
    {
      q: (tp, sj, bd, yr) => `[${bd} বোর্ড ${yr}] ${sj} পাঠ্যক্রম অনুযায়ী "${tp}"-এর প্রধান উদ্দেশ্য কী?`,
      opts: [
        'বাস্তব জগতের ঘটনাবলি বৈজ্ঞানিক ও যুক্তিনির্ভরভাবে ব্যাখ্যা করা',
        'শুধুমাত্র মুখস্থ তথ্যের উপর নির্ভর করা',
        'অবাস্তব অনুমানের ওপর সিদ্ধান্ত গ্রহণ',
        'প্রাকৃতিক সূত্রের গুরুত্ব হ্রাস করা'
      ],
      ans: 0,
      exp: (tp, sj) => `${sj}-এর মূল উদ্দেশ্য হলো বাস্তব পর্যবেক্ষণ ও বৈজ্ঞানিক নিয়মের সুষ্ঠু প্রয়োগ।`
    },
    {
      q: (tp, sj, bd, yr) => `[${bd} বোর্ড ${yr}] নিচের কোনটি "${tp}" প্রক্রিয়ার একটি অত্যন্ত গুরুত্বপূর্ণ বৈশিষ্ট্য?`,
      opts: [
        'শক্তির রূপান্তর ও সংরক্ষণশীলতা নীতি মেনে চলা',
        'শক্তির কোনো রূপান্তর না হওয়া',
        'ভর ও শক্তির অবিনশ্বরতা অমান্য করা',
        'প্রাকৃতিক ভারসাম্যে কোনো প্রভাব না ফেলা'
      ],
      ans: 0,
      exp: (tp, sj) => `সকল প্রাকৃতিক ও বৈজ্ঞানিক প্রক্রিয়ায় শক্তির নিত্যতা সূত্র কার্যকর থাকে।`
    },
    {
      q: (tp, sj, bd, yr) => `[${bd} বোর্ড ${yr}] ${tp} অনুশীলনের সময় সবচেয়ে বেশি কোনটি বিবেচনায় রাখতে হবে?`,
      opts: [
        'সঠিক সূত্র ও সূত্রের প্রাসঙ্গিক শর্তাবলি',
        'অসমর্থিত অনুমান',
        'একক ছাড়া সাংখ্যিক মান ব্যবহার',
        'তাত্ত্বিক তথ্যের অপব্যবহার'
      ],
      ans: 0,
      exp: (tp, sj) => `সমস্যা সমাধান ও মূল্যায়নে সঠিক সূত্র ও নির্দিষ্ট শর্তাবলি বজায় রাখা আবশ্যক।`
    },
    {
      q: (tp, sj, bd, yr) => `[${bd} বোর্ড ${yr}] বোর্ড পরীক্ষায় "${tp}" সংশ্লিষ্ট প্রশ্নে সর্বোচ্চ নম্বর পাওয়ার কার্যকর উপায় কোনটি?`,
      opts: [
        'স্পষ্ট চিত্র, সঠিক সমীকরণ ও ব্যাখ্যা উপস্থাপন',
        'কেবলমাত্র উত্তর লেখা',
        'ব্যাখ্যাহীনভাবে সূত্রের উল্লেখ',
        'অপশন অনুমানের ওপর নির্ভর করা'
      ],
      ans: 0,
      exp: (tp, sj) => `স্পষ্ট চিত্র ও সমীকরণ সহ উত্তরপত্র উপস্থাপন করলে সর্বোচ্চ নম্বর পাওয়া যায়।`
    }
  ];

  // Specific Subject Domain Banks
  const subjectSpecificBanks = {
    'physics': [
      {
        q: (tp, bd, yr) => `[${bd} '${yr.slice(-2)}] গতির সমীকরণ v = u + at-এ u কী নির্দেশ করে?`,
        opts: ['শেষ বেগ (Final Velocity)', 'আদি বেগ (Initial Velocity)', 'ত্বরণ (Acceleration)', 'সরণ (Displacement)'],
        ans: 1,
        exp: `u হলো আদি বেগ এবং v হলো নির্দিষ্ট সময় t পর অর্জিত শেষ বেগ।`
      },
      {
        q: (tp, bd, yr) => `[${bd} '${yr.slice(-2)}] বলের এসআই (SI) একক কোনটি?`,
        opts: ['নিউটন (N)', 'জুল (J)', 'প্যাসকেল (Pa)', 'ওয়াট (W)'],
        ans: 0,
        exp: `আন্তর্জাতিক পদ্ধতিতে বলের একক নিউটন (N = kg·m/s²)।`
      },
      {
        q: (tp, bd, yr) => `[${bd} '${yr.slice(-2)}] মহাকর্ষীয় ধ্রুবক G এর মান কত?`,
        opts: ['6.673 × 10⁻¹¹ N m² kg⁻²', '9.8 m s⁻²', '3 × 10⁸ m s⁻¹', '1.6 × 10⁻¹⁹ C'],
        ans: 0,
        exp: `মহাকর্ষীয় ধ্রুবক G = 6.673 × 10⁻¹¹ N m² kg⁻²।`
      },
      {
        q: (tp, bd, yr) => `[${bd} '${yr.slice(-2)}] কাজের একক ও শক্তির একক নিচের কোনটি?`,
        opts: ['জুল (Joule)', 'নিউটন (Newton)', 'ওয়াট (Watt)', 'ক্যালরি (Calorie)'],
        ans: 0,
        exp: `কাজ ও শক্তি উভয়েরই আন্তর্জাতিক একক হলো জুল (J)।`
      },
      {
        q: (tp, bd, yr) => `[${bd} '${yr.slice(-2)}] শব্দের বেগ সবচেয়ে বেশি কোন মাধ্যমে?`,
        opts: ['কঠিন মাধ্যমে (Solid)', 'তরল মাধ্যমে (Liquid)', 'বায়বীয় মাধ্যমে (Gas)', 'শূন্য মাধ্যমে (Vacuum)'],
        ans: 0,
        exp: `কঠিন মাধ্যমে কণাগুলো দৃঢ়ভাবে আবদ্ধ থাকায় শব্দের বেগ সবচেয়ে বেশি হয়।`
      },
      {
        q: (tp, bd, yr) => `[${bd} '${yr.slice(-2)}] অভিকর্ষজ ত্বরণ g এর আদর্শ মান কত ধরা হয়?`,
        opts: ['9.8 m/s²', '9.81 km/s', '10.8 m/s²', '8.9 m/s²'],
        ans: 0,
        exp: `ভূপৃষ্ঠে অভিকর্ষজ ত্বরণের গড় মান 9.8 m/s² (বা 9.80665 m/s²)।`
      }
    ],
    'chemistry': [
      {
        q: (tp, bd, yr) => `[${bd} '${yr.slice(-2)}] পর্যায় সারণির ১৮ নম্বর গ্রুপের মৌলগুলোকে কী বলা হয়?`,
        opts: ['নিষ্ক্রিয় গ্যাস (Noble Gas)', 'ক্ষার ধাতু (Alkali Metal)', 'হ্যালোজেন (Halogen)', 'মৃৎক্ষার ধাতু'],
        ans: 0,
        exp: `১৮ নম্বর গ্রুপের মৌলসমূহ স্থিতিশীল ইলেকট্রন বিন্যাসযুক্ত হওয়ায় নিষ্ক্রিয় গ্যাস বলা হয়।`
      },
      {
        q: (tp, bd, yr) => `[${bd} '${yr.slice(-2)}] পানির অণুর (H₂O) জ্যামিতিক আকৃতি কেমন?`,
        opts: ['কৌণিক (V-Shaped)', 'রৈখিক (Linear)', 'চতুস্তলকীয় (Tetrahedral)', 'সমতলীয় ত্রিকোণাকার'],
        ans: 0,
        exp: `পানির অণুর আকৃতি কৌণিক এবং বন্ধন কোণ প্রায় ১০৪.৫°।`
      },
      {
        q: (tp, bd, yr) => `[${bd} '${yr.slice(-2)}] অ্যাভোগ্যাড্রো সংখ্যা (NA) এর মান কত?`,
        opts: ['6.023 × 10²³', '6.023 × 10⁻²³', '9.8 × 10²⁴', '3 × 10⁸'],
        ans: 0,
        exp: `যেকোনো পদার্থের ১ মোলে 6.023 × 10²³ সংখ্যক কণা থাকে।`
      },
      {
        q: (tp, bd, yr) => `[${bd} '${yr.slice(-2)}] হাইড্রোক্লোরিক এসিড (HCl) ও সোডিয়াম হাইড্রোক্সাইড (NaOH)-এর বিক্রিয়ায় কী উৎপন্ন হয়?`,
        opts: ['NaCl + H₂O', 'Na₂CO₃ + H₂', 'NaH + Cl₂', 'NaOH + Cl₂'],
        ans: 0,
        exp: `এসিড ও ক্ষারের প্রশমন বিক্রিয়ায় লবণ (NaCl) ও পানি (H₂O) উৎপন্ন হয়।`
      }
    ],
    'math': [
      {
        q: (tp, bd, yr) => `[${bd} '${yr.slice(-2)}] sin²θ + cos²θ এর মান কত?`,
        opts: ['1', '0', '-1', 'tan θ'],
        ans: 0,
        exp: `ত্রিকোণমিতির মৌলিক অভেদ অনুযায়ী sin²θ + cos²θ = 1।`
      },
      {
        q: (tp, bd, yr) => `[${bd} '${yr.slice(-2)}] বৃত্তের ক্ষেত্রফলের সূত্র কোনটি?`,
        opts: ['πr²', '2πr', '4/3 πr³', '2πr(r+h)'],
        ans: 0,
        exp: `ব্যাসার্ধ r হলে বৃত্তের ক্ষেত্রফল πr² বর্গ একক।`
      }
    ],
    'biology': [
      {
        q: (tp, bd, yr) => `[${bd} '${yr.slice(-2)}] কোষের পাওয়ার হাউস (Power House of Cell) কাকে বলা হয়?`,
        opts: ['মাইটোকন্ড্রিয়া (Mitochondria)', 'রাইবোসোম', 'গলগি বডি', 'লাইসোজোম'],
        ans: 0,
        exp: `শ্বসন প্রক্রিয়ায় শক্তি উৎপাদিত ও সঞ্চিত হওয়ায় মাইটোকন্ড্রিয়াকে পাওয়ার হাউস বলা হয়।`
      },
      {
        q: (tp, bd, yr) => `[${bd} '${yr.slice(-2)}] সালোকসংশ্লেষণ প্রক্রিয়ায় উপজাত হিসেবে কোনটি তৈরি হয়?`,
        opts: ['অক্সিজেন (O₂)', 'কার্বন ডাই অক্সাইড (CO₂)', 'নাইট্রোজেন (N₂)', 'হাইড্রোজেন (H₂)'],
        ans: 0,
        exp: `উদ্ভিদ সূর্যালোকের সহায়তায় পানি ও CO₂ ব্যবহার করে শর্করা ও অক্সিজেন (O₂) তৈরি করে।`
      }
    ]
  };

  const lowerSubject = (subject || '').toLowerCase();
  let domainBank = [];
  if (lowerSubject.includes('physic') || lowerSubject.includes('পদার্থ')) {
    domainBank = subjectSpecificBanks.physics;
  } else if (lowerSubject.includes('chem') || lowerSubject.includes('রসায়ন') || lowerSubject.includes('কেমিস্ট্রি')) {
    domainBank = subjectSpecificBanks.chemistry;
  } else if (lowerSubject.includes('math') || lowerSubject.includes('গণিত') || lowerSubject.includes('হিসাব')) {
    domainBank = subjectSpecificBanks.math;
  } else if (lowerSubject.includes('bio') || lowerSubject.includes('জীব') || lowerSubject.includes('প্রাণী') || lowerSubject.includes('উদ্ভিদ')) {
    domainBank = subjectSpecificBanks.biology;
  }

  const generated = [];
  const targetCount = Math.max(Number(count) || 5, 1);

  let usedIndex = 0;
  while (generated.length < targetCount) {
    if (domainBank.length > 0 && usedIndex < domainBank.length) {
      const item = domainBank[usedIndex];
      generated.push({
        id: generated.length + 1,
        question: item.q(t, b, y),
        questionBn: item.q(t, b, y),
        options: item.opts,
        correctAnswer: item.ans,
        correctOptionIndex: item.ans,
        explanation: item.exp,
        board: b,
        examYear: y,
        questionType: 'MCQ',
        badge
      });
      usedIndex++;
    } else {
      const tmplIndex = (generated.length) % knowledgeTemplates.length;
      const tmpl = knowledgeTemplates[tmplIndex];
      generated.push({
        id: generated.length + 1,
        question: tmpl.q(t, s, b, y),
        questionBn: tmpl.q(t, s, b, y),
        options: tmpl.opts,
        correctAnswer: tmpl.ans,
        correctOptionIndex: tmpl.ans,
        explanation: typeof tmpl.exp === 'function' ? tmpl.exp(t, s) : tmpl.exp,
        board: b,
        examYear: y,
        questionType: 'MCQ',
        badge
      });
    }
  }

  return generated;
}

/**
 * Generate questions for a single board/year slice
 */
async function generateSingleSlice({
  board = 'সকল বোর্ড',
  examYear = '2025',
  count = 5,
  topic = '',
  subject = '',
  classGrade = '',
  difficulty = 'MEDIUM',
  chapterNotes = '',
  apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY
}) {
  const badge = formatAcademicBadge(board, examYear, 'MCQ');

  if (apiKey) {
    try {
      const sourceInstruction = chapterNotes
        ? `You are an expert tutor. Create questions strictly based on the following ${board} Board ${examYear} context/notes:
"""
${chapterNotes}
"""`
        : `You are an expert curriculum specialist and senior question setter for the ${board} Education Board Bangladesh (Exam Year: ${examYear}).`;

      const prompt = `
${sourceInstruction}

Generate exactly ${count} Multiple Choice Questions (MCQ) formatted for:
- Education Board: ${board} Board Bangladesh
- Exam Year: ${examYear}
- Class/Grade: ${classGrade || 'Class 9-10 (SSC)'}
- Subject: ${subject || 'Science'}
- Chapter/Topic: ${topic || 'General Curriculum Chapter'}
- Difficulty Level: ${difficulty} (EASY / MEDIUM / HARD)

Output Requirements:
1. Return ONLY a valid JSON Array with no extra text or markdown backticks outside of valid JSON.
2. The language of the questions and options must be standard academic Bengali (Bangla).
3. Each question must have 4 distinct options and one clear correct answer index (0 to 3).
4. Provide an educational explanation in Bengali for the correct answer.
5. Set "badge" to "${badge}", "board" to "${board}", "examYear" to "${examYear}".

JSON Format:
[
  {
    "id": 1,
    "question": "[${badge}] বল ও ত্বরণের সম্পর্ক কোন সূত্রে বর্ণিত?",
    "options": ["নিউটনের ১ম সূত্র", "নিউটনের ২য় সূত্র", "নিউটনের ৩য় সূত্র", "মহাকর্ষ সূত্র"],
    "correctAnswer": 1,
    "explanation": "নিউটনের ২য় সূত্র থেকে F = ma পাওয়া যায়।",
    "board": "${board}",
    "examYear": "${examYear}",
    "badge": "${badge}"
  }
]
`;

      const aiQuestions = await callGeminiApi(apiKey, prompt);
      if (Array.isArray(aiQuestions) && aiQuestions.length > 0) {
        return aiQuestions.slice(0, count).map((q, idx) => ({
          id: idx + 1,
          question: q.question || q.questionBn || `[${badge}] প্রশ্ন ${idx + 1}`,
          questionBn: q.question || q.questionBn || `[${badge}] প্রশ্ন ${idx + 1}`,
          options: Array.isArray(q.options) && q.options.length === 4 ? q.options : ['অপশন ক', 'অপশন খ', 'অপশন গ', 'অপশন ঘ'],
          correctAnswer: typeof q.correctAnswer === 'number' ? q.correctAnswer : 0,
          correctOptionIndex: typeof q.correctAnswer === 'number' ? q.correctAnswer : 0,
          explanation: q.explanation || 'সঠিক উত্তর।',
          board,
          examYear,
          questionType: 'MCQ',
          badge
        }));
      }
    } catch (err) {
      console.warn(`Gemini slice generation failed for ${board} ${examYear}:`, err.message);
    }
  }

  return generateFallbackQuestions(topic, subject, classGrade, difficulty, count, chapterNotes, board, examYear);
}

/**
 * Main Generator Function with Multi-Board & Multi-Year Distribution Support
 */
async function generateMCQs({
  topic = '',
  subject = '',
  classGrade = '',
  difficulty = 'MEDIUM',
  questionCount = 10,
  chapterNotes = '',
  sourceMaterialId = null,
  sourceMaterialTitle = '',
  board = 'সকল বোর্ড',
  examYear = '2025',
  distribution = null,
  apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY
}) {
  // 1. Check if composite multi-board command is present in topic or passed directly
  let parsedDist = null;
  if (Array.isArray(distribution) && distribution.length > 0) {
    parsedDist = {
      isMultiBoard: true,
      distributions: distribution.map(d => ({
        ...d,
        badge: d.badge || formatAcademicBadge(d.board, d.examYear, 'MCQ')
      })),
      totalCount: distribution.reduce((sum, d) => sum + (Number(d.count) || 0), 0)
    };
  } else {
    parsedDist = parseMultiBoardPrompt(topic, 'MCQ');
  }

  // 2. Multi-Board Execution Pipeline
  if (parsedDist && parsedDist.distributions && parsedDist.distributions.length > 0) {
    const allGenerated = [];
    let currentId = 1;

    for (const dist of parsedDist.distributions) {
      const sliceCount = Number(dist.count) || 5;
      
      // Attempt to find existing source material context for this specific board and year in DB
      let sliceNotes = chapterNotes || '';
      try {
        const matchingMaterial = await StudyMaterial.findOne({
          where: {
            board: dist.board,
            examYear: dist.examYear
          }
        });
        if (matchingMaterial) {
          sliceNotes = (matchingMaterial.content_text || matchingMaterial.contentText || matchingMaterial.descriptionBn || '') + '\n' + sliceNotes;
        }
      } catch (e) {}

      const sliceQuestions = await generateSingleSlice({
        board: dist.board,
        examYear: dist.examYear,
        count: sliceCount,
        topic: parsedDist.cleanTopic || topic,
        subject,
        classGrade,
        difficulty,
        chapterNotes: sliceNotes,
        apiKey
      });

      sliceQuestions.forEach(q => {
        allGenerated.push({
          ...q,
          id: currentId++,
          board: dist.board,
          examYear: dist.examYear,
          questionType: 'MCQ',
          badge: dist.badge || formatAcademicBadge(dist.board, dist.examYear, 'MCQ')
        });
      });
    }

    return {
      source: apiKey ? 'GOOGLE_GEMINI_MULTI_BOARD_AI' : 'NCTB_MULTI_BOARD_ENGINE',
      isMultiBoard: true,
      distributionSummary: parsedDist.summaryBn,
      distributions: parsedDist.distributions,
      totalCount: allGenerated.length,
      questions: allGenerated
    };
  }

  // 3. Single Board Execution Pipeline
  const count = Math.min(Math.max(Number(questionCount) || 10, 1), 100);
  const questions = await generateSingleSlice({
    board,
    examYear,
    count,
    topic,
    subject,
    classGrade,
    difficulty,
    chapterNotes,
    apiKey
  });

  return {
    source: apiKey ? 'GOOGLE_GEMINI_AI' : 'NCTB_CURRICULUM_ENGINE',
    isMultiBoard: false,
    board,
    examYear,
    badge: formatAcademicBadge(board, examYear, 'MCQ'),
    questions
  };
}

module.exports = {
  generateMCQs,
  generateFallbackQuestions,
  parseMultiBoardPrompt
};
