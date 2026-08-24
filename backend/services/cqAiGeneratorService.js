const https = require('https');

/**
 * Universal AI-Powered Creative Question (CQ / সৃজনশীল ও প্রাথমিক মূল্যায়ন) Generator Service
 * Supports Play to Class 12 (Pre-Primary, Primary, Secondary & Higher Secondary HSC)
 * with Google Gemini 1.5 Flash structured generation and NCTB multi-stage knowledge engine.
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

/**
 * Determine Stage Category from Class Name
 */
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

/**
 * Pre-Primary & Primary Adaptive Question Bank (Play - Class 5)
 */
const primaryAdaptiveBank = {
  bangla: [
    {
      format: 'MATCHING',
      title: 'বাম পাশের শব্দের সাথে ডান পাশের অর্থের মিলকরণ করো:',
      pairs: [
        { left: 'প্রভাত', right: 'সকাল / ভোর' },
        { left: 'কানন', right: 'বাগান / কুঞ্জ' },
        { left: 'অসীম', right: 'যার সীমা নেই' },
        { left: 'সহোদর', right: 'এক মায়ের সন্তান' }
      ],
      marks: 4
    },
    {
      format: 'FILL_BLANKS',
      title: 'নিচের খালি জায়গায় উপযুক্ত শব্দ বসিয়ে শূন্যস্থান পূরণ করো:',
      items: [
        { sentence: 'আমাদের জাতীয় কবির নাম কাজী ___ ইসলাম।', word: 'নজরুল', marks: 1 },
        { sentence: 'সূর্য পূর্ব দিকে ___ এবং পশ্চিম দিকে অস্ত যায়।', word: 'ওঠে', marks: 1 },
        { sentence: 'শাপলা আমাদের জাতীয় ___।', word: 'ফুল', marks: 1 },
        { sentence: 'পিতা-মাতাকে সর্বদা ___ করা উচিত।', word: 'শ্রদ্ধা / সম্মান', marks: 1 }
      ],
      marks: 4
    },
    {
      format: 'CONJOINED_LETTERS',
      title: 'নিচের যুক্তবর্ণগুলো ভেঙে শব্দ গঠন করো ও বাক্যে প্রয়োগ দেখাও:',
      items: [
        { letter: 'ক্ষ', breakdown: 'ক্ + ষ', word: 'শিক্ষা', sentence: 'শিক্ষা জাতির মেরুদণ্ড।' },
        { letter: 'জ্ঞ', breakdown: 'জ্ + ঞ', word: 'জ্ঞান', sentence: 'জ্ঞানই শক্তি।' },
        { letter: 'ত্র', breakdown: 'ত্ + র-ফলা', word: 'ছাত্র', sentence: 'ছাত্রদের প্রধান কাজ পড়াশোনা করা।' }
      ],
      marks: 3
    },
    {
      format: 'PICTURE_WRITING',
      title: 'ছবি দেখে ৩টি বাক্যে বর্ণনা লিখ (প্রকৃতি ও বিদ্যালয়):',
      visualPrompt: '🎨 [একটি সুন্দর গ্রাম ও বিদ্যালয়ের চিত্র যেখানে শিক্ষার্থীরা আনন্দ নিয়ে যাচ্ছে]',
      hints: ['বিদ্যালয়ের নাম ও পরিবেশ', 'শিক্ষার্থীদের শৃঙ্খলা', 'সবুজ প্রকৃতির সৌন্দর্য'],
      marks: 5
    }
  ],
  math: [
    {
      format: 'FILL_BLANKS',
      title: 'খালি ঘরে সঠিক সংখ্যা বসাও:',
      items: [
        { sentence: '৭ × ৮ = ___', word: '৫৬', marks: 1 },
        { sentence: '১০০ পয়সায় = ___ টাকা', word: '১', marks: 1 },
        { sentence: '১ ডজন = ___ টি', word: '১২', marks: 1 },
        { sentence: '১ কেজি = ___ গ্রাম', word: '১০০০', marks: 1 }
      ],
      marks: 4
    },
    {
      format: 'MATCHING',
      title: 'জ্যামিতিক আকৃতির নামের সাথে চিত্রের মিল করো:',
      pairs: [
        { left: 'ত্রিভুজ (Triangle)', right: '৩টি বাহু দ্বারা সীমাবদ্ধ ক্ষেত্র' },
        { left: 'চতুর্ভুজ (Quadrilateral)', right: '৪টি বাহু দ্বারা সীমাবদ্ধ ক্ষেত্র' },
        { left: 'বৃত্ত (Circle)', right: 'গোলাকার বক্ররেখা দ্বারা গঠিত ক্ষেত্র' }
      ],
      marks: 3
    }
  ],
  english: [
    {
      format: 'MATCHING',
      title: 'Match the words in Column A with their opposite meanings in Column B:',
      pairs: [
        { left: 'Always', right: 'Never' },
        { left: 'Beautiful', right: 'Ugly' },
        { left: 'Friend', right: 'Enemy' },
        { left: 'Early', right: 'Late' }
      ],
      marks: 4
    },
    {
      format: 'FILL_BLANKS',
      title: 'Fill in the blanks with appropriate prepositions / articles:',
      items: [
        { sentence: 'The sun rises ___ the east.', word: 'in', marks: 1 },
        { sentence: 'He is an ___ boy.', word: 'honest', marks: 1 },
        { sentence: 'We go to school ___ foot.', word: 'on', marks: 1 }
      ],
      marks: 3
    }
  ]
};

/**
 * Secondary & Higher Secondary CQ Fallback Knowledge
 */
const secondaryCqBank = {
  physics: [
    {
      section: 'ক-বিভাগ (তাত্ত্বিক ও বলবিদ্যা)',
      stem: `একটি 500g ভরের ক্রিকেট বলকে খাড়া উপরের দিকে 40 m/s বেগে নিক্ষেপ করা হলো। একই সাথে 200m উচ্চতা থেকে 2kg ভরের অপর একটি বস্তুকে মুক্তভাবে নিচে ছেড়ে দেওয়া হলো। (g = 9.8 m/s²)`,
      ka: { text: `ত্বরণ কাকে বলে?`, marks: 1, hint: `সময়ের সাথে অসম বেগের পরিবর্তনের হারকে ত্বরণ বলে।` },
      kha: { text: `চলন্ত বাস হঠাৎ ব্রেক করলে যাত্রীরা সামনের দিকে ঝুঁকে পড়ে কেন? ব্যাখ্যা করো।`, marks: 2, hint: `গতি জড়তার কারণে যাত্রীর শরীরের নিচের অংশ স্থির হলেও উপরের অংশ গতিশীল থাকতে চায়।` },
      ga: { text: `নিক্ষেপের কত সময় পর ১ম বলটি সর্বোচ্চ উচ্চতায় পৌঁছাবে এবং সর্বোচ্চ উচ্চতা নির্ণয় করো।`, marks: 3, hint: `t = u/g = 40/9.8 = 4.08s; h = u²/(2g) = 81.63m` },
      gha: { text: `ভূমি থেকে বস্তুদ্বয়ের মিলিত হওয়ার উচ্চতায় শক্তির সংরক্ষণশীলতা নীতি বজায় থাকবে কিনা—গাণিতিকভাবে বিশ্লেষণ করো।`, marks: 4, hint: `উভয় বস্তুর মোট শক্তি (বিভব শক্তি + গতি শক্তি) সর্বদাই ধ্রুবক থাকবে।` }
    },
    {
      section: 'খ-বিভাগ (কাজ, ক্ষমতা ও শক্তি)',
      stem: `একটি 5kW ক্ষমতার মোটর দ্বারা 20m গভীর একটি কুয়া থেকে 10 মিনিটে 12000 লিটার পানি উত্তোলন করা হলো। কুয়াটি সম্পূর্ণ পানি দ্বারা পূর্ণ ছিল।`,
      ka: { text: `কর্মদক্ষতা কী?`, marks: 1, hint: `মোট কার্যকর শক্তি এবং মোট প্রদত্ত শক্তির অনুপাতকে কর্মদক্ষতা বলে।` },
      kha: { text: `ধনাত্মক কাজ ও ঋণাত্মক কাজের মধ্যে পার্থক্য লিখ।`, marks: 2, hint: `বলের দিকে সরণ হলে ধনাত্মক কাজ এবং বলের বিপরীত দিকে সরণ হলে ঋণাত্মক কাজ।` },
      ga: { text: `পাম্পটি দ্বারা সম্পাদিত কাজের পরিমাণ নির্ণয় করো।`, marks: 3, hint: `W = mgh = 12000 × 9.8 × 20 = 2.352 × 10⁶ Joule` },
      gha: { text: `পাম্পটির কর্মদক্ষতা 5% বৃদ্ধি পেলে একই পরিমাণ পানি উত্তোলনে সময়ের কী রূপ পরিবর্তন হবে—গাণিতিক মতামত দাও।`, marks: 4, hint: `η = P_out / P_in × 100%; নতুন ক্ষমতায় প্রয়োজনীয় সময় হ্রাস পাবে।` }
    }
  ],
  chemistry: [
    {
      section: 'ক-বিভাগ (পর্যায় সারণি ও রাসায়নিক বন্ধন)',
      stem: `পর্যায় সারণির ২য় ও ৩য় পর্যায়ের তিনটি মৌল যথাক্রমে X (পারমাণবিক সংখ্যা 11), Y (পারমাণবিক সংখ্যা 12) এবং Z (পারমাণবিক সংখ্যা 17)। (এখানে X, Y, Z প্রতীকী অর্থে ব্যবহৃত)`,
      ka: { text: `পর্যায় সূত্রটি লিখ।`, marks: 1, hint: `মৌলসমূহের ভৌত ও রাসায়নিক ধর্মাবলি তাদের পারমাণবিক সংখ্যা অনুসারে পর্যায়ক্রমে আবর্তিত হয়।` },
      kha: { text: `সোডিয়ামকে কেরোসিনের নিচে রাখা হয় কেন? ব্যাখ্যা করো।`, marks: 2, hint: `সোডিয়াম অত্যন্ত সক্রিয় ধাতু, খোলা বাতাসে অক্সিজেন ও জলীয় বাষ্পের সাথে তীব্র বিক্রিয়া করে।` },
      ga: { text: `X ও Z মৌলদ্বয় দ্বারা গঠিত যৌগের বন্ধন গঠন প্রক্রিয়া চিত্রসহ বর্ণনা করো।`, marks: 3, hint: `Na ইলেকট্রন ত্যাগ করে Na⁺ এবং Cl ইলেকট্রন গ্রহণ করে Cl⁻ গঠন করে আয়নিক বন্ধন তৈরি করে।` },
      ga: { text: `X ও Z মৌলদ্বয় দ্বারা গঠিত যৌগের বন্ধন গঠন প্রক্রিয়া চিত্রসহ বর্ণনা করো।`, marks: 3, hint: `Na ইলেকট্রন ত্যাগ করে Na⁺ and Cl ইলেকট্রন গ্রহণ করে Cl⁻ গঠন করে আয়নিক বন্ধন তৈরি করে।` },
      gha: { text: `X ও Y মৌলদ্বয়ের ১ম আয়নীকরণ শক্তির মানের তুলনামূলক বিশ্লেষণ করো।`, marks: 4, hint: `একই পর্যায়ে বাম থেকে ডানে পারমাণবিক ব্যাসার্ধ হ্রাস পাওয়ায় Mg এর আয়নীকরণ শক্তি Na এর চেয়ে বেশি।` }
    }
  ],
  math: [
    {
      section: 'ক-বিভাগ (বীজগণিত ও সেট)',
      stem: `A = {x ∈ N : x² > 15 এবং x³ < 225}, f(y) = (y³ + ky² - 4y - 8) / y এবং g(x) = (3x + 1) / (3x - 1)`,
      ka: { text: `সেট প্রকাশের দুটি পদ্ধতি কী কী?`, marks: 1, hint: `তালিকা পদ্ধতি ও সেট গঠন পদ্ধতি।` },
      kha: { text: `A সেটটিকে তালিকা পদ্ধতিতে প্রকাশ করে P(A) এর উপাদান সংখ্যা যাচাই করো।`, marks: 2, hint: `A = {4, 5} => P(A) এর উপাদান সংখ্যা 2² = 4` },
      ga: { text: `k এর মান কত হলে f(-2) = 0 হবে নির্ণয় করো।`, marks: 3, hint: `(-2)³ + k(-2)² - 4(-2) - 8 = 0 => 4k = 8 => k = 2` },
      gha: { text: `[g(x) + 1] / [g(x) - 1] এর মান নির্ণয় করো।`, marks: 4, hint: `যোজন-বিয়োজন করে সরলীকরণ করলে মান হবে 3x।` }
    }
  ],
  general: [
    {
      section: 'ক-বিভাগ',
      stem: (tp, sj) => `১০ম শ্রেণির বিজ্ঞান ক্লাসে শিক্ষক "${tp}" সম্পর্কিত বাস্তব দৃষ্টান্ত উপস্থাপন করলেন এবং একটি সারণির মাধ্যমে বিভিন্ন উপাত্ত প্রদর্শন করলেন। শিক্ষার্থীরা বিষয়টি গভীরভাবে পর্যবেক্ষণ করে যৌক্তিক প্রশ্নের অবতারণা করল।`,
      ka: { text: (tp, sj) => `${tp}-এর মূল সংজ্ঞা দাও।`, marks: 1, hint: (tp, sj) => `পাঠ্যবই অনুযায়ী ${tp}-এর সুস্পষ্ট জ্ঞানমূলক সংজ্ঞা।` },
      kha: { text: (tp, sj) => `${tp} ধারণাটি বাস্তব জীবনে কেন অত্যন্ত গুরুত্বপূর্ণ? ব্যাখ্যা করো।`, marks: 2, hint: (tp, sj) => `বাস্তব ক্ষেত্রে ${tp}-এর কার্যকারিতা ও প্রয়োজনীয়তা ব্যাখ্যা।` },
      ga: { text: (tp, sj) => `উদ্দীপকের আলোকে "${tp}" প্রক্রিয়ার বিভিন্ন ধাপ ও কৌশল বর্ণনা করো।`, marks: 3, hint: (tp, sj) => `উদ্দীপকের তথ্য বিশ্লেষণ করে যথাযথ নিয়ম ও সূত্রের প্রয়োগ।` },
      gha: { text: (tp, sj) => `আধুনিক বিজ্ঞানের অগ্রগতিতে "${tp}"-এর প্রভাব ও সীমাবদ্ধতা মূল্যায়ন করো।`, marks: 4, hint: (tp, sj) => `উচ্চতর দক্ষতাভিত্তিক তুলনামূলক বিশ্লেষণ ও সুনির্দিষ্ট সিদ্ধান্ত।` }
    }
  ]
};

/**
 * Fallback Generator
 */
function generateFallbackAdaptive(topic, subject, classGrade, difficulty = 'MEDIUM', count = 2, examTerm = '') {
  const stage = getStageCategory(classGrade);
  const t = (topic || 'সাধারণ পাঠ').trim();
  const s = (subject || 'বাংলা').trim();
  const lowerSub = s.toLowerCase();

  // 1. Primary / Early Childhood Stage
  if (stage === 'PRE_PRIMARY' || stage === 'PRIMARY') {
    let chosenBank = primaryAdaptiveBank.bangla;
    if (lowerSub.includes('math') || lowerSub.includes('গণিত') || lowerSub.includes('হিসাব')) {
      chosenBank = primaryAdaptiveBank.math;
    } else if (lowerSub.includes('eng') || lowerSub.includes('ইংরেজি')) {
      chosenBank = primaryAdaptiveBank.english;
    }

    return chosenBank.map((item, idx) => ({
      id: idx + 1,
      type: 'PRIMARY_ADAPTIVE',
      format: item.format,
      title: item.title,
      pairs: item.pairs || [],
      items: item.items || [],
      visualPrompt: item.visualPrompt || '',
      hints: item.hints || [],
      marks: item.marks || 4
    }));
  }

  // 2. Secondary & Higher Secondary Stage
  let domainBank = [];
  if (lowerSub.includes('physic') || lowerSub.includes('পদার্থ')) {
    domainBank = secondaryCqBank.physics;
  } else if (lowerSub.includes('chem') || lowerSub.includes('রসায়ন') || lowerSub.includes('কেমিস্ট্রি')) {
    domainBank = secondaryCqBank.chemistry;
  } else if (lowerSub.includes('math') || lowerSub.includes('গণিত') || lowerSub.includes('হিসাব')) {
    domainBank = secondaryCqBank.math;
  }

  const generated = [];
  const targetCount = Math.min(Math.max(Number(count) || 2, 1), 10);
  let usedIdx = 0;

  while (generated.length < targetCount) {
    if (domainBank.length > 0 && usedIdx < domainBank.length) {
      const item = domainBank[usedIdx];
      generated.push({
        id: generated.length + 1,
        type: 'STANDARD_CQ',
        section: stage === 'HIGHER_SECONDARY' ? (usedIdx % 2 === 0 ? 'ক-বিভাগ (১ম পত্র / তাত্ত্বিক)' : 'খ-বিভাগ (২য় পত্র / প্রয়োগ ও বিশ্লেষণ)') : item.section,
        stem: typeof item.stem === 'function' ? item.stem(t) : item.stem,
        questions: {
          ka: { text: item.ka.text, marks: 1, answerHint: item.ka.hint },
          kha: { text: item.kha.text, marks: 2, answerHint: item.kha.hint },
          ga: { text: item.ga.text, marks: 3, answerHint: item.ga.hint },
          gha: { text: item.gha.text, marks: 4, answerHint: item.gha.hint }
        }
      });
      usedIdx++;
    } else {
      const genItem = secondaryCqBank.general[0];
      generated.push({
        id: generated.length + 1,
        type: 'STANDARD_CQ',
        section: stage === 'HIGHER_SECONDARY' ? 'ক-বিভাগ (উচ্চ মাধ্যমিক তাত্ত্বিক)' : 'ক-বিভাগ',
        stem: genItem.stem(t, s),
        questions: {
          ka: { text: genItem.ka.text(t, s), marks: 1, answerHint: genItem.ka.hint(t, s) },
          kha: { text: genItem.kha.text(t, s), marks: 2, answerHint: genItem.kha.hint(t, s) },
          ga: { text: genItem.ga.text(t, s), marks: 3, answerHint: genItem.ga.hint(t, s) },
          gha: { text: genItem.gha.text(t, s), marks: 4, answerHint: genItem.gha.hint(t, s) }
        }
      });
    }
  }

  return generated;
}

/**
 * Main Universal CQ Generator
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
  apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY
}) {
  const stage = getStageCategory(classGrade);
  const count = Math.min(Math.max(Number(questionCount) || 2, 1), 10);

  if (apiKey) {
    try {
      let prompt = '';
      const sourceInstruction = chapterNotes
        ? `You are an expert tutor. Create questions ONLY based on the provided material:
"""
${chapterNotes}
"""
If the material doesn't cover a topic, do not make up facts. Formulate the questions strictly based on the text provided above.`
        : `You are an expert curriculum specialist for Bangladesh education board.`;

      if (stage === 'PRE_PRIMARY' || stage === 'PRIMARY') {
        prompt = `
${sourceInstruction}

Generate a child-friendly visual and adaptive question set in Bengali for:
- Class: ${classGrade}
- Subject: ${subject}
- Chapter/Topic: ${chapterTopic || sourceMaterialTitle || 'General Topic'}
- Exam Term: ${examTerm}

Output Requirements:
Return a JSON array of interactive primary question objects containing:
- "id": number
- "type": "PRIMARY_ADAPTIVE"
- "format": "MATCHING" (কলাম মিলকরণ) | "FILL_BLANKS" (শূন্যস্থান পূরণ) | "CONJOINED_LETTERS" (যুক্তবর্ণ) | "PICTURE_WRITING" (ছবি দেখে লেখা) | "TICK_CORRECT" (সঠিক উত্তর)
- "title": Instruction in clear Bengali
- "pairs": array of { left, right } for matching
- "items": array of { sentence, word, marks } for blanks/letters
- "visualPrompt": description of illustration or diagram
- "marks": total marks for this question block
`;
      } else {
        prompt = `
${sourceInstruction}

Generate exactly ${count} Creative Questions (CQ / সৃজনশীল প্রশ্ন) in Bengali for:
- Class: ${classGrade} ${stage === 'HIGHER_SECONDARY' ? '(HSC Stage - Include sectional paper divisions like ক-বিভাগ / খ-বিভাগ)' : ''}
- Subject: ${subject}
- Chapter/Topic: ${chapterTopic || sourceMaterialTitle || 'General Topic'}
- Exam Term: ${examTerm}
- Difficulty: ${difficulty}

Output Requirements:
Return ONLY a valid JSON array of objects:
[
  {
    "id": 1,
    "type": "STANDARD_CQ",
    "section": "${stage === 'HIGHER_SECONDARY' ? 'ক-বিভাগ (১ম পত্র)' : 'ক-বিভাগ'}",
    "stem": "উদ্দীপক বা দৃশ্যকল্প...",
    "questions": {
      "ka": { "text": "জ্ঞানমূলক প্রশ্ন (১ নম্বর)", "marks": 1, "answerHint": "উত্তর সংকেত..." },
      "kha": { "text": "অনুধাবনমূলক প্রশ্ন (২ নম্বর)", "marks": 2, "answerHint": "ব্যাখ্যা সংকেত..." },
      "ga": { "text": "প্রয়োগমূলক প্রশ্ন (৩ নম্বর)", "marks": 3, "answerHint": "গাণিতিক সমাধান বা নিয়ম..." },
      "gha": { "text": "উচ্চতর দক্ষতামূলক প্রশ্ন (৪ নম্বর)", "marks": 4, "answerHint": "উচ্চতর বিশ্লেষণ..." }
    }
  }
]
`;
      }

      const aiRes = await callGeminiApi(apiKey, prompt);
      if (Array.isArray(aiRes) && aiRes.length > 0) {
        return {
          source: 'GOOGLE_GEMINI_AI',
          stage,
          examTerm,
          questions: aiRes
        };
      }
    } catch (err) {
      console.warn('Gemini CQ generation failed, switching to NCTB adaptive engine:', err.message);
    }
  }

  // Fallback
  const fallback = generateFallbackAdaptive(chapterTopic, subject, classGrade, difficulty, count, examTerm);
  return {
    source: 'NCTB_CURRICULUM_ENGINE',
    stage,
    examTerm,
    questions: fallback
  };
}

module.exports = {
  generateCreativeQuestions,
  getStageCategory,
  generateFallbackAdaptive
};
