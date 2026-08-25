const https = require('https');
const { parseMultiBoardPrompt, formatAcademicBadge } = require('./multiBoardDistributionEngine');
const { StudyMaterial } = require('../models');

/**
 * Universal AI-Powered Creative Question (CQ / সৃজনশীল ও প্রাথমিক মূল্যায়ন) Generator Service
 * with Multi-Board & Multi-Year Distribution Engine
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
        temperature: 0.45,
        topP: 0.95,
        maxOutputTokens: 3500,
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
      timeout: 22000
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
              const parsedCQs = JSON.parse(candidateText);
              return resolve(parsedCQs);
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

function getStageCategory(classGrade = '') {
  const cg = classGrade.toLowerCase();
  if (cg.includes('play') || cg.includes('প্লে') || cg.includes('nursery') || cg.includes('নার্সারি') || cg.includes('kg') || cg.includes('কেজি')) {
    return 'PRE_PRIMARY';
  }
  if (cg.includes('১ম') || cg.includes('২য়') || cg.includes('৩য়') || cg.includes('৪র্থ') || cg.includes('৫ম') || 
      cg.includes('class 1') || cg.includes('class 2') || cg.includes('class 3') || cg.includes('class 4') || cg.includes('class 5')) {
    return 'PRIMARY';
  }
  if (cg.includes('১১') || cg.includes('১২') || cg.includes('একাদশ') || cg.includes('দ্বাদশ') || cg.includes('hsc') || cg.includes('এইচএসসি')) {
    return 'HIGHER_SECONDARY';
  }
  return 'SECONDARY';
}

function generateFallbackAdaptive(chapterTopic, subject, classGrade, difficulty = 'MEDIUM', count = 2, examTerm = 'মডেল টেস্ট ও মূল্যায়ন', board = 'সকল বোর্ড', examYear = '2025') {
  const stage = getStageCategory(classGrade);
  const t = (chapterTopic || 'সাধারণ পাঠ্য বিষয়').trim();
  const s = (subject || 'বিজ্ঞান').trim();
  const b = (board || 'সকল বোর্ড').trim();
  const y = (examYear || '2025').trim();
  const badge = formatAcademicBadge(b, y, 'CQ');

  const generated = [];
  const targetCount = Math.max(Number(count) || 2, 1);

  for (let i = 0; i < targetCount; i++) {
    generated.push({
      id: i + 1,
      type: 'STANDARD_CQ',
      section: stage === 'HIGHER_SECONDARY' ? 'ক-বিভাগ (উচ্চ মাধ্যমিক তাত্ত্বিক)' : 'ক-বিভাগ',
      board: b,
      examYear: y,
      questionType: 'CQ',
      badge,
      stem: `[${badge}] জনাব রফিক শ্রেণিকক্ষে "${t}" বিষয়ের ওপর একটি ব্যবহারিক পরীক্ষণ প্রদর্শন করলেন। তিনি শিক্ষার্থীদের বিভিন্ন ধাপে তথ্য পর্যবেক্ষণ ও গাণিতিক সমীকরণের মাধ্যমে ফলাফল যাচাইয়ের নির্দেশ দিলেন।`,
      questions: {
        ka: { text: `জ্ঞানমূলক প্রশ্ন (১ নম্বর): "${t}" কাকে বলে?`, marks: 1, answerHint: `${t}-এর সংজ্ঞার্থ ও মূল ভিত্তি।` },
        kha: { text: `অনুধাবনমূলক প্রশ্ন (২ নম্বর): উদ্দীপকে উল্লিখিত প্রক্রিয়ার মূল তাৎপর্য ব্যাখ্যা করো।`, marks: 2, answerHint: `মৌলিক তত্ত্ব ও বৈজ্ঞানিক নিয়মের ব্যাখ্যা।` },
        ga: { text: `প্রয়োগমূলক প্রশ্ন (৩ নম্বর): উদ্দীপকের আলোকে সংশ্লিষ্ট রাশির মান ও প্রয়োজনীয় সমীকরণ নির্ণয় করো।`, marks: 3, answerHint: `সঠিক সূত্রের ব্যবহার ও সাংখ্যিক সমাধান।` },
        gha: { text: `উচ্চতর দক্ষতামূলক প্রশ্ন (৪ নম্বর): "${t}" সংক্রান্ত পরীক্ষণটির বাস্তব প্রয়োগ ও প্রাসঙ্গিকতা বিশ্লেষণ করো।`, marks: 4, answerHint: `যুক্তিনির্ভর উচ্চতর সিদ্ধান্ত ও তুলনামূলক বিশ্লেষণ।` }
      }
    });
  }

  return generated;
}

async function generateSingleCQSlice({
  board = 'সকল বোর্ড',
  examYear = '2025',
  count = 2,
  chapterTopic = '',
  subject = '',
  classGrade = '',
  difficulty = 'MEDIUM',
  chapterNotes = '',
  examTerm = 'মডেল টেস্ট ও মূল্যায়ন',
  apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY
}) {
  const badge = formatAcademicBadge(board, examYear, 'CQ');
  const stage = getStageCategory(classGrade);

  if (apiKey) {
    try {
      const sourceInstruction = chapterNotes
        ? `You are an expert curriculum specialist. Formulate Creative Questions strictly based on the following ${board} Board ${examYear} context:
"""
${chapterNotes}
"""`
        : `You are an expert senior question setter for the ${board} Education Board Bangladesh (Exam Year: ${examYear}).`;

      const prompt = `
${sourceInstruction}

Generate exactly ${count} Creative Questions (CQ / সৃজনশীল প্রশ্ন) in standard academic Bengali for:
- Education Board: ${board} Board Bangladesh
- Exam Year: ${examYear}
- Class/Grade: ${classGrade || 'Class 9-10 (SSC)'}
- Subject: ${subject || 'Science'}
- Chapter/Topic: ${chapterTopic || 'General Topic'}
- Difficulty: ${difficulty}

Output Requirements:
Return ONLY a valid JSON array of objects:
[
  {
    "id": 1,
    "type": "STANDARD_CQ",
    "section": "ক-বিভাগ",
    "board": "${board}",
    "examYear": "${examYear}",
    "badge": "${badge}",
    "stem": "[${badge}] উদ্দীপক বা দৃশ্যকল্প...",
    "questions": {
      "ka": { "text": "জ্ঞানমূলক প্রশ্ন (১ নম্বর)", "marks": 1, "answerHint": "উত্তর সংকেত..." },
      "kha": { "text": "অনুধাবনমূলক প্রশ্ন (২ নম্বর)", "marks": 2, "answerHint": "ব্যাখ্যা সংকেত..." },
      "ga": { "text": "প্রয়োগমূলক প্রশ্ন (৩ নম্বর)", "marks": 3, "answerHint": "গাণিতিক সমাধান বা নিয়ম..." },
      "gha": { "text": "উচ্চতর দক্ষতামূলক প্রশ্ন (৪ নম্বর)", "marks": 4, "answerHint": "উচ্চতর বিশ্লেষণ..." }
    }
  }
]
`;

      const aiRes = await callGeminiApi(apiKey, prompt);
      if (Array.isArray(aiRes) && aiRes.length > 0) {
        return aiRes.slice(0, count).map((q, idx) => ({
          ...q,
          id: idx + 1,
          board,
          examYear,
          questionType: 'CQ',
          badge,
          stem: q.stem || `[${badge}] উদ্দীপক...`
        }));
      }
    } catch (err) {
      console.warn(`Gemini CQ slice generation failed for ${board} ${examYear}:`, err.message);
    }
  }

  return generateFallbackAdaptive(chapterTopic, subject, classGrade, difficulty, count, examTerm, board, examYear);
}

/**
 * Main Universal CQ Generator with Multi-Board & Multi-Year Distribution Support
 */
async function generateCreativeQuestions({
  subject = '',
  classGrade = '',
  chapterTopic = '',
  difficulty = 'MEDIUM',
  questionCount = 2,
  chapterNotes = '',
  examTerm = 'মডেল টেস্ট ও মূল্যায়ন পরীক্ষা ২০২৬',
  sourceMaterialId = null,
  sourceMaterialTitle = '',
  board = 'সকল বোর্ড',
  examYear = '2025',
  distribution = null,
  apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY
}) {
  let parsedDist = null;
  if (Array.isArray(distribution) && distribution.length > 0) {
    parsedDist = {
      isMultiBoard: true,
      distributions: distribution.map(d => ({
        ...d,
        badge: d.badge || formatAcademicBadge(d.board, d.examYear, 'CQ')
      })),
      totalCount: distribution.reduce((sum, d) => sum + (Number(d.count) || 0), 0)
    };
  } else {
    parsedDist = parseMultiBoardPrompt(chapterTopic, 'CQ');
  }

  // Multi-Board Execution Pipeline
  if (parsedDist && parsedDist.distributions && parsedDist.distributions.length > 0) {
    const allGenerated = [];
    let currentId = 1;

    for (const dist of parsedDist.distributions) {
      const sliceCount = Number(dist.count) || 1;

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

      const sliceCQs = await generateSingleCQSlice({
        board: dist.board,
        examYear: dist.examYear,
        count: sliceCount,
        chapterTopic: parsedDist.cleanTopic || chapterTopic,
        subject,
        classGrade,
        difficulty,
        chapterNotes: sliceNotes,
        examTerm,
        apiKey
      });

      sliceCQs.forEach(cq => {
        allGenerated.push({
          ...cq,
          id: currentId++,
          board: dist.board,
          examYear: dist.examYear,
          questionType: 'CQ',
          badge: dist.badge || formatAcademicBadge(dist.board, dist.examYear, 'CQ')
        });
      });
    }

    return {
      source: apiKey ? 'GOOGLE_GEMINI_MULTI_BOARD_AI' : 'NCTB_MULTI_BOARD_CQ_ENGINE',
      isMultiBoard: true,
      distributionSummary: parsedDist.summaryBn,
      distributions: parsedDist.distributions,
      totalCount: allGenerated.length,
      questions: allGenerated
    };
  }

  const count = Math.min(Math.max(Number(questionCount) || 2, 1), 20);
  const questions = await generateSingleCQSlice({
    board,
    examYear,
    count,
    chapterTopic,
    subject,
    classGrade,
    difficulty,
    chapterNotes,
    examTerm,
    apiKey
  });

  return {
    source: apiKey ? 'GOOGLE_GEMINI_AI' : 'NCTB_CURRICULUM_ENGINE',
    isMultiBoard: false,
    board,
    examYear,
    badge: formatAcademicBadge(board, examYear, 'CQ'),
    questions
  };
}

module.exports = {
  generateCreativeQuestions,
  getStageCategory,
  generateFallbackAdaptive,
  parseMultiBoardPrompt
};
