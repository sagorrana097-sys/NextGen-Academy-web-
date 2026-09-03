/**
 * Bangla Grammar Chapters 11–15 Content:
 * Chapter 11: যোজক (Conjunction)
 * Chapter 12: আবেগ ও অনুজ্ঞাসূচক পদ (Interjection & Imperative)
 * Chapter 13: কারক (Case)
 * Chapter 14: বিভক্তি (Inflection)
 * Chapter 15: বচন (Number)
 * 
 * Fully structured according to NCTB/SSC/HSC standard.
 */

// ============================================================================
// CHAPTER 11: যোজক (Conjunction)
// ============================================================================
const CHAPTER_11_TOPICS = [
  {
    id: 11101,
    chapterId: 111,
    parentTopicId: null,
    subject: 'BANGLA',
    topicNo: '১১.১',
    titleBn: 'যোজকের সংজ্ঞা, বৈশিষ্ট্য ও শ্রেণিবিভাগ',
    titleEn: 'Definition, Characteristics & Types of Conjunctions (Jojok)',
    slug: 'b11-jojok-shongpga-o-shrenibibhag',
    difficulty: 'BOARD_STANDARD',
    classLevel: 'Class 8 - 12 (SSC & HSC)',
    summaryBn: 'যে পদ দুটি শব্দ, বাক্য বা খণ্ডবাক্যকে সংযুক্ত, বিযুক্ত বা সংকুচিত করে, তাকে যোজক (Conjunction) বলে।',
    definitionBn: 'যোজক (Jojok / Conjunction): যে পদ একটি বাক্যের সাথে অন্য একটি বাক্যকে, অথবা একটি বাক্যাংশের সাথে অন্য বাক্যাংশকে, কিংবা একাধিক শব্দকে যুক্ত, বিযুক্ত বা তুলনা করে, তাকে যোজক বলে। যেমন: এবং, ও, আর, কিন্তু, অথবা, বা, কিংবা, সুতরাং, অতএব, কারণ, যদি...তবে।',
    definitionEn: 'A Conjunction (Jojok) connects words, phrases, or clauses, establishing logical relations such as addition, contrast, reason, or condition.',
    explanationBn: 'আধুনিক বাংলা ব্যাকরণে পূর্বে যাকে "সমুচ্চয়ী অব্যয়" বলা হতো, তাকেই সুনির্দিষ্টভাবে "যোজক" নামে অভিহিত করা হয়েছে। যোজক প্রধানত ৫ প্রকার: ১. সাধারণ বা সংযোজক যোজক: একাধিক পদ বা বাক্যকে জোড়া দেয় (এবং, ও, আর; যেমন: রহিম ও করিম দুই ভাই)। ২. বিয়োজক বা বিকল্প যোজক: একাধিক বিকল্পের মধ্যে একটিকে বেছে নেয় বা পৃথক করে (বা, অথবা, কিংবা, না হয়; যেমন: চা অথবা কফি নিন)। ৩. বিরোধমূলক যোজক: আগের বাক্যের সাথে বিপরীত ভাব প্রকাশ করে (কিন্তু, অথচ, বরঞ্চ, তথাপি; যেমন: তিনি ধনী কিন্তু কৃপণ)। ৪. কারণবাচক যোজক: একটি ঘটনার কারণ নির্দেশ করে (কারণ, কেননা, যেহেতু; যেমন: সে আসতে পারেনি কারণ তার জ্বর)। ৫. সাপেক্ষ যোজক: দুটি খণ্ডবাক্যকে শর্তাধীনভাবে যুক্ত করে (যদি...তবে, যদিও...তবুও; যেমন: যদি বৃষ্টি হয়, তবে যাব না)।',
    teacherGoldenTips: 'ম্যাজিক ফর্মুলা: (১) জোড়া দেয় → সংযোজক (এবং, ও, আর)। (২) বিকল্প দেখায় → বিয়োজক (বা, অথবা)। (৩) বিপরীত বলে → বিরোধমূলক (কিন্তু, অথচ)। (৪) কারণ দেখায় → কারণবাচক (কারণ, কেননা)। (৫) শর্ত রাখে → সাপেক্ষ (যদি...তবে)।',
    rules: [
      {
        ruleNo: 1,
        nameBn: 'বিরোধমূলক যোজকের কমা (,) বিধান',
        explanationBn: '"কিন্তু", "অথচ" ইত্যাদি বিরোধমূলক যোজকের পূর্বে সাধারণত একটি কমা (,) বসে।',
        examples: [
          {
            bn: 'তিনি চেষ্টা করেছিলেন, কিন্তু সফল হননি।',
            context: 'বিরোধমূলক যোজকে যতিচিহ্ন',
            highlight: ', কিন্তু'
          }
        ]
      },
      {
        ruleNo: 2,
        nameBn: 'কারণবাচক যোজকের অবস্থান',
        explanationBn: 'কারণবাচক যোজক প্রধান বাক্যের পরে বসে কারণ বা কৈফিয়ত প্রদানকারী খণ্ডবাক্যকে সংযুক্ত করে।',
        examples: [
          {
            bn: 'ছেলেটি ক্লাসে আসেনি, কেননা সে অসুস্থ ছিল।',
            context: 'কারণবাচক যোজক'
          }
        ]
      }
    ],
    formulas: [
      {
        label: 'যোজক শ্রেণিবিভাগ ছক',
        structure: 'সংযোজক (এবং) | বিয়োজক (বা/অথবা) | বিরোধ (কিন্তু) | কারণ (কেননা) | সাপেক্ষ (যদি...তবে)'
      }
    ],
    examples: [
      {
        bn: 'রহিম ও করিম ফুটবল খেলছে (ও = সাধারণ সংযোজক যোজক)',
        context: 'শব্দ সংযোগ'
      },
      {
        bn: 'তিনি বিদ্বান, অথচ বিনয়ী নন (অথচ = বিরোধমূলক যোজক)',
        context: 'বিরোধ প্রকাশ'
      }
    ],
    exceptions: [
      {
        titleBn: 'যোজক বনাম অনুসর্গ',
        descriptionBn: '"বিনা" বা "ছাড়া" যদি বাক্যের অংশ হিসেবে সম্পর্ক বোঝায় তবে অনুসর্গ; আর যদি দুটি খণ্ডবাক্যকে বিপরীতভাবে জোড়ে তবে যোজকতুল্য আচরণ করতে পারে।'
      }
    ],
    commonMistakes: [
      {
        incorrectBn: '"তিনি ধনী অথচ সৎ"—এখানে অথচ দিয়ে বাক্যটি ভুল।',
        correctBn: '"তিনি ধনী এবং সৎ" অথবা "তিনি দরিদ্র কিন্তু সৎ"।',
        explanationBn: 'ধনী হওয়া ও সৎ হওয়া পরস্পর বিরোধী বিষয় নয়।'
      }
    ],
    writtenPractice: [
      {
        id: 1,
        type: 'IDENTIFICATION',
        prompt: 'চিহ্নিত যোজকগুলোর শ্রেণি নির্ণয় করো: (ক) লাল বা নীল কলমটি নাও। (খ) সে অসুস্থ, তাই পরীক্ষা দিতে পারেনি।',
        correctAnswer: '(ক) "বা": বিয়োজক বা বিকল্প যোজক। (খ) "তাই": কারণবাচক বা ফলসূচক যোজক।',
        explanationBn: 'বোর্ডের গুরুত্বপূর্ণ ২ নম্বরের প্রশ্ন।'
      }
    ],
    tags: ['JOJOK', 'CONJUNCTION', 'SHONYOJOK', 'BIYOJOK', 'BIRODH', 'SSC'],
    status: 'PUBLISHED',
    orderIndex: 1,
    viewCount: 160
  }
];

const CHAPTER_11_MCQS = [
  {
    id: 111001,
    chapterId: 111,
    topicId: 11101,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: '"তিনি বিদ্বান কিন্তু বিনয়ী নন"—এখানে "কিন্তু" কোন ধরনের যোজক?',
    questionEn: 'In "Tini bidwan kintu binoyi non", what type of conjunction is "kintu"?',
    options: ['বিরোধমূলক যোজক', 'সংযোজক যোজক', 'বিয়োজক যোজক', 'কারণবাচক যোজক'],
    correctOptionIndex: 0,
    correctAnswerText: 'বিরোধমূলক যোজক',
    explanationBn: 'যে যোজক দুটি বিপরীত বা বৈসাদৃশ্যমূলক ভাবের সংযোগ ঘটায়, তাকে বিরোধমূলক যোজক বলে।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'ঢাকা বোর্ড',
    year: 2024,
    examType: 'SSC',
    tags: ['JOJOK', 'BIRODH', 'DHAKA_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 111002,
    chapterId: 111,
    topicId: 11101,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: '"যদি তুমি আসো, তবে আমি যাব"—এখানে "যদি...তবে" কোন প্রকার যোজক?',
    questionEn: 'What type of conjunction is "Jodi...tobe"?',
    options: ['সাপেক্ষ যোজক', 'বিকল্প যোজক', 'সংযোজক যোজক', 'বিরোধ যোজক'],
    correctOptionIndex: 0,
    correctAnswerText: 'সাপেক্ষ যোজক',
    explanationBn: 'শর্তসাপেক্ষে পরস্পর নির্ভরশীল হয়ে বাক্য দুটিকে সংযুক্ত করায় এটি সাপেক্ষ যোজক (Correlative Conjunction)।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'রাজশাহী বোর্ড',
    year: 2023,
    examType: 'SSC',
    tags: ['SHAPEKHO_JOJOK', 'RAJSHAHI_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 111003,
    chapterId: 111,
    topicId: 11101,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: '"চা অথবা কফি—যেকোনো একটি গ্রহণ করুন"—এখানে "অথবা" কোন ধরনের যোজক?',
    questionEn: 'What type of conjunction is "othoba"?',
    options: ['বিকল্প বা বিয়োজক যোজক', 'সংযোজক যোজক', 'কারণবাচক যোজক', 'সাপেক্ষ যোজক'],
    correctOptionIndex: 0,
    correctAnswerText: 'বিকল্প বা বিয়োজক যোজক',
    explanationBn: 'একাধিক বিষয়ের মধ্যে যেকোনো একটি বিকল্প বেছে নেওয়ার দ্যোতনা দেওয়ায় "অথবা" হলো বিকল্প বা বিয়োজক যোজক।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'যশোর বোর্ড',
    year: 2024,
    examType: 'SSC',
    tags: ['BIYOJOK', 'DISJUNCTIVE', 'JASHORE_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 111004,
    chapterId: 111,
    topicId: 11101,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: '"তিনি সৎ, সুতরাং সকলে তাঁকে শ্রদ্ধা করে"—এখানে "সুতরাং" কোন যোজক?',
    questionEn: 'In "Tini shot, shutorang...", what type of conjunction is "shutorang"?',
    options: ['ফলসূচক যোজক', 'বিরোধ যোজক', 'সাপেক্ষ যোজক', 'বিকল্প যোজক'],
    correctOptionIndex: 0,
    correctAnswerText: 'ফলসূচক যোজক',
    explanationBn: 'পূর্ববর্তী ঘটনার ফলাফল বা পরিণতি নির্দেশ করায় "সুতরাং" বা "অতএব" হলো ফলসূচক যোজক।',
    difficulty: 'MEDIUM',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'কুমিল্লা বোর্ড',
    year: 2023,
    examType: 'SSC',
    tags: ['FOLSHUCHOK', 'CUMILLA_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 111005,
    chapterId: 111,
    topicId: 11101,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: 'ঐতিহ্যবাহী ব্যাকরণের "সমুচ্চয়ী অব্যয়"-এর আধুনিক প্রমিত রূপ কোনটি?',
    questionEn: 'What is the modern standard grammatical term for traditional "Samuchchayi Abyay"?',
    options: ['যোজক পদ', 'ক্রিয়াবিশেষণ', 'অনুসর্গ', 'আবেগ পদ'],
    correctOptionIndex: 0,
    correctAnswerText: 'যোজক পদ',
    explanationBn: 'আধুনিক বাংলা ব্যাকরণ ও NCTB কারিকুলামে সমুচ্চয়ী অব্যয়কে সুনির্দিষ্টভাবে "যোজক" হিসেবে সংজ্ঞায়িত করা হয়েছে।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'চট্টগ্রাম বোর্ড',
    year: 2024,
    examType: 'SSC',
    tags: ['MODERN_TERMINOLOGY', 'JOJOK', 'CHITTAGONG_BOARD'],
    status: 'ACTIVE'
  }
];

const CHAPTER_11_MODEL_TEST = {
  id: 11101,
  subject: 'BANGLA',
  chapterId: 111,
  testTitleBn: 'অধ্যায় ১১ মডেল টেস্ট: যোজক',
  testTitleEn: 'Chapter 11 Model Test: Conjunction (Jojok)',
  descriptionBn: 'সংযোজক, বিয়োজক, বিরোধমূলক, কারণবাচক ও সাপেক্ষ যোজকের ওপর পূর্ণাঙ্গ বোর্ড স্ট্যান্ডার্ড মডেল টেস্ট।',
  durationMinutes: 10,
  totalMarks: 5,
  passPercentage: 60,
  difficulty: 'MEDIUM',
  questionCount: 5,
  questionIds: [111001, 111002, 111003, 111004, 111005],
  status: 'PUBLISHED'
};

// ============================================================================
// CHAPTER 12: আবেগ ও অনুজ্ঞাসূচক পদ (Interjection & Imperative)
// ============================================================================
const CHAPTER_12_TOPICS = [
  {
    id: 11201,
    chapterId: 112,
    parentTopicId: null,
    subject: 'BANGLA',
    topicNo: '১২.১',
    titleBn: 'আবেগ পদ ও অনুজ্ঞাসূচক ক্রিয়ার পূর্ণাঙ্গ রূপ',
    titleEn: 'Interjections (Abeg Pod) and Imperative Moods (Onugya)',
    slug: 'b12-abeg-pod-o-onugya',
    difficulty: 'BOARD_STANDARD',
    classLevel: 'Class 8 - 12 (SSC & HSC)',
    summaryBn: 'মনের তীব্র ভাব যেমন আনন্দ, শোক, বিস্ময়, ঘৃণা প্রকাশের পদ হলো আবেগ পদ। আদেশ, উপদেশ, অনুরোধ বোঝাতে ক্রিয়ার যে রূপ হয় তা অনুজ্ঞা।',
    definitionBn: 'আবেগ পদ (Interjection): যে পদ মনের আকস্মিক ও তীব্র আবেগ, যেমন: আনন্দ, বিষাদ, বিস্ময়, ঘৃণা, ভয়, ক্রোধ ইত্যাদি প্রকাশ করে এবং যার সাথে বাক্যের অন্য কোনো পদের প্রত্যক্ষ ব্যাকরণিক সম্পর্ক থাকে না, তাকে আবেগ পদ বলে। যেমন: বাঃ!, ছি ছি!, হায় হায়!, শাবাশ!। অনুজ্ঞা (Imperative Mood): আদেশ, উপদেশ, অনুরোধ, প্রার্থনা, নিষেধ ইত্যাদি বোঝাতে বর্তমান ও ভবিষ্যৎ কালের মধ্যম ও নাম পুরুষের ক্রিয়ার যে বিশেষ রূপ হয়, তাকে অনুজ্ঞা বলে। যেমন: কাজটি করো, আপনি আসুন, কাল সেখানে যেও না।',
    definitionEn: 'An Interjection (Abeg Pod) conveys spontaneous psychological emotions. An Imperative (Onugya) expresses commands, requests, prayers, or warnings.',
    explanationBn: 'আবেগ পদের পর সাধারণত একটি বিস্ময়চিহ্ন (!) বসে (যেমন: "ছি ছি! এমন কাজ তুমি করতে পারলে?"). আবেগ পদ ৮ প্রকার: ১. বিস্ময়সূচক (আরে!, ওমা!), ২. প্রশংসাসূচক (শাবাশ!, চমৎকার!), ৩. বিরক্তি বা ঘৃণাসূচক (ছি ছি!, দূর!), ৪. করুণা বা বিষাদসূচক (হায় হায়!, আহা!), ৫. ভয়সূচক (বাপরে বাপ!), ৬. আহ্বানসূচক (হে বন্ধু!, ওহে!), ৭. সম্মতিসূচক (হ্যাঁ, বেশ, তা-ই হোক), ৮. সতর্কতাসূচক (সাবধান!)। অন্যদিকে অনুজ্ঞা কখনোই উত্তম পুরুষে (আমি/আমরা) হয় না, কারণ মানুষ নিজেকে নিজে আদেশ বা অনুরোধ করে না। অনুজ্ঞা কেবল বর্তমান ও ভবিষ্যৎ কালের মধ্যম ও নাম পুরুষে প্রযুক্ত হয়।',
    teacherGoldenTips: 'মনে রাখবেন: (১) আবেগ পদের পরে বিস্ময়চিহ্ন (!) থাকে। (২) উত্তম পুরুষের (আমি/আমরা) কোনো অনুজ্ঞা রূপ ব্যাকরণে সম্ভব নয়! অনুজ্ঞা শুধু মধ্যম (তুমি/তুই/আপনি) ও নাম পুরুষে (সে/তারা/তিনি) হয়।',
    rules: [
      {
        ruleNo: 1,
        nameBn: 'অনুজ্ঞার পুরুষ ও কাল সীমাবদ্ধতা',
        explanationBn: 'অনুজ্ঞা কেবল বর্তমান ও ভবিষ্যৎ কালে হয়; অতীত কালে কখনোই অনুজ্ঞা প্রযুক্ত হতে পারে না।',
        examples: [
          {
            bn: 'অতীতের অনুজ্ঞা হয় না। বর্তমান: বইটি পড়ো। ভবিষ্যৎ: কাল স্কুলে যেয়ো।',
            context: 'অনুজ্ঞা'
          }
        ]
      }
    ],
    formulas: [
      {
        label: 'আবেগ ও অনুজ্ঞা সূত্র',
        structure: 'তীব্র আবেগ + (!) = আবেগ পদ | আদেশ/উপদেশ + মধ্যম/নাম পুরুষ = অনুজ্ঞা'
      }
    ],
    examples: [
      {
        bn: 'হায় হায়! আমার সব শেষ হয়ে গেল (হায় হায় = বিষাদসূচক আবেগ পদ)',
        context: 'আবেগ পদ'
      },
      {
        bn: 'সদা সত্য কথা বলবে (বলবে = উপদেশমূলক ভবিষ্যৎ অনুজ্ঞা)',
        context: 'অনুজ্ঞা'
      }
    ],
    exceptions: [
      {
        titleBn: 'বিস্ময়চিহ্নহীন ব্যবহার',
        descriptionBn: 'কখনো কখনো বাক্যের শেষে সামগ্রিক বিস্ময়চিহ্ন বসে, শব্দের ঠিক পরে কমা বসে (যেমন: "হায়, আমার পোড়া কপাল!")।'
      }
    ],
    commonMistakes: [
      {
        incorrectBn: 'আমি আজ কাজটি করি—এটি একটি উত্তম পুরুষের অনুজ্ঞা।',
        correctBn: 'উত্তম পুরুষের কোনো অনুজ্ঞা ব্যাকরণে নেই।',
        explanationBn: 'এটি সাধারণ বর্তমান কালের বাক্য।'
      }
    ],
    writtenPractice: [
      {
        id: 1,
        type: 'CLASSIFICATION',
        prompt: 'নিচের বাক্যগুলোতে আবেগ ও অনুজ্ঞার শ্রেণি নির্ণয় করো: (ক) ছি ছি! এমন কাজ কেউ করে? (খ) আমাকে এক গ্লাস পানি দাও।',
        correctAnswer: '(ক) "ছি ছি!": ঘৃণাসূচক আবেগ পদ। (খ) "দাও": মধ্যম পুরুষের অনুরোধমূলক অনুজ্ঞা।',
        explanationBn: 'বোর্ডের গুরুত্বপূর্ণ ২ নম্বরের প্রশ্ন।'
      }
    ],
    tags: ['ABEG_POD', 'INTERJECTION', 'ONUGYA', 'IMPERATIVE', 'SSC'],
    status: 'PUBLISHED',
    orderIndex: 1,
    viewCount: 155
  }
];

const CHAPTER_12_MCQS = [
  {
    id: 112001,
    chapterId: 112,
    topicId: 11201,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: 'ব্যাকরণে কোন পুরুষের অনুজ্ঞা হয় না?',
    questionEn: 'Which grammatical person does not have an imperative mood?',
    options: ['উত্তম পুরুষ', 'মধ্যম পুরুষ', 'নাম পুরুষ', 'সকল পুরুষেরই হয়'],
    correctOptionIndex: 0,
    correctAnswerText: 'উত্তম পুরুষ',
    explanationBn: 'উত্তম পুরুষে (আমি, আমরা) মানুষ নিজেকে নিজে আদেশ দিতে পারে না বলে উত্তম পুরুষের কোনো অনুজ্ঞা রূপ হয় না।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'ঢাকা বোর্ড',
    year: 2024,
    examType: 'SSC',
    tags: ['ONUGYA', 'PERSON', 'DHAKA_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 112002,
    chapterId: 112,
    topicId: 11201,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: '"সাবাশ! খেলায় এমন ক্রীড়া নৈপুণ্যই তো চাই"—এখানে "সাবাশ" কোন ধরনের পদ?',
    questionEn: 'In "Shabash! Khelay emon...", what part of speech is "Shabash"?',
    options: ['প্রশংসাসূচক আবেগ পদ', 'বিস্ময়সূচক আবেগ পদ', 'যোজক পদ', 'ক্রিয়াবিশেষণ'],
    correctOptionIndex: 0,
    correctAnswerText: 'প্রশংসাসূচক আবেগ পদ',
    explanationBn: '"সাবাশ" শব্দটি আন্তরিক প্রশংসা ও বাহবা প্রকাশ করায় এটি প্রশংসাসূচক আবেগ পদ (Interjection of Praise)।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'যশোর বোর্ড',
    year: 2023,
    examType: 'SSC',
    tags: ['ABEG_POD', 'PRAISE', 'JASHORE_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 112003,
    chapterId: 112,
    topicId: 11201,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: '"ছি ছি! তুমি এত নীচ কাজ করতে পারলে?"—এখানে "ছি ছি" কোন ভাব প্রকাশ করছে?',
    questionEn: 'What emotional sentiment is conveyed by "chhi chhi"?',
    options: ['ঘৃণা ও বিরক্তি', 'আনন্দ', 'ভয়', 'বিস্ময়'],
    correctOptionIndex: 0,
    correctAnswerText: 'ঘৃণা ও বিরক্তি',
    explanationBn: '"ছি ছি" হলো ঘৃণা ও তীব্র ধিক্কারসূচক আবেগ পদ।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'রাজশাহী বোর্ড',
    year: 2024,
    examType: 'SSC',
    tags: ['DISGUST', 'ABEG', 'RAJSHAHI_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 112004,
    chapterId: 112,
    topicId: 11201,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: 'কোন কালে অনুজ্ঞার প্রয়োগ ব্যাকরণগতভাবে অসম্ভব?',
    questionEn: 'In which tense is the imperative mood grammatically impossible?',
    options: ['অতীত কাল', 'বর্তমান কাল', 'ভবিষ্যৎ কাল', 'কোনোটিই নয়'],
    correctOptionIndex: 0,
    correctAnswerText: 'অতীত কাল',
    explanationBn: 'অতীতকালের কোনো ঘটনার ওপর আদেশ বা অনুরোধ প্রয়োগ সম্ভব নয় বিধায় অতীতকালে অনুজ্ঞা হয় না।',
    difficulty: 'MEDIUM',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'সিলেট বোর্ড',
    year: 2023,
    examType: 'SSC',
    tags: ['TENSE_RESTRICTION', 'ONUGYA', 'SYLHET_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 112005,
    chapterId: 112,
    topicId: 11201,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: '"সদা সত্য কথা বলবে"—এটি কোন প্রকারের অনুজ্ঞা?',
    questionEn: 'In "Shoda shotyo kotha bolbe", what type of imperative is it?',
    options: ['উপদেশমূলক ভবিষ্যৎ অনুজ্ঞা', 'আদেশমূলক বর্তমান অনুজ্ঞা', 'অনুরোধমূলক অনুজ্ঞা', 'প্রার্থনামূলক অনুজ্ঞা'],
    correctOptionIndex: 0,
    correctAnswerText: 'উপদেশমূলক ভবিষ্যৎ অনুজ্ঞা',
    explanationBn: 'চিরকালীন উপদেশ এবং ভবিষ্যৎ কালের ক্রিয়ারূপ "বলবে" থাকায় এটি উপদেশমূলক ভবিষ্যৎ অনুজ্ঞা।',
    difficulty: 'MEDIUM',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'চট্টগ্রাম বোর্ড',
    year: 2024,
    examType: 'SSC',
    tags: ['FUTURE_IMPERATIVE', 'UPODESH', 'CHITTAGONG_BOARD'],
    status: 'ACTIVE'
  }
];

const CHAPTER_12_MODEL_TEST = {
  id: 11201,
  subject: 'BANGLA',
  chapterId: 112,
  testTitleBn: 'অধ্যায় ১২ মডেল টেস্ট: আবেগ ও অনুজ্ঞাসূচক পদ',
  testTitleEn: 'Chapter 12 Model Test: Interjection & Imperative (Abeg o Onugya)',
  descriptionBn: 'আবেগসূচক পদের প্রকারভেদ, বিস্ময়চিহ্নের ব্যবহার এবং বর্তমান ও ভবিষ্যৎ অনুজ্ঞার ওপর পূর্ণাঙ্গ মডেল টেস্ট।',
  durationMinutes: 10,
  totalMarks: 5,
  passPercentage: 60,
  difficulty: 'MEDIUM',
  questionCount: 5,
  questionIds: [112001, 112002, 112003, 112004, 112005],
  status: 'PUBLISHED'
};

// ============================================================================
// CHAPTER 13: কারক (Case)
// ============================================================================
const CHAPTER_13_TOPICS = [
  {
    id: 11301,
    chapterId: 113,
    parentTopicId: null,
    subject: 'BANGLA',
    topicNo: '১৩.১',
    titleBn: 'কারকের সংজ্ঞা, প্রকারভেদ ও চেনার মাস্টার শর্টকাট',
    titleEn: 'Definition of Case (Karok), 6 Major Types & Master Identification Tricks',
    slug: 'b13-karok-shongpga-o-shrenibibhag',
    difficulty: 'BOARD_STANDARD',
    classLevel: 'Class 8 - 12 (SSC & HSC)',
    summaryBn: 'বাক্যস্থিত ক্রিয়াপদের সঙ্গে নামপদের যে সম্পর্ক, তাকে কারক বলে। কারক ৬ প্রকার: কর্তৃ, কর্ম, করণ, সম্প্রদান, অপাদান ও অধিকরণ কারক।',
    definitionBn: 'কারক (Case / Karok): বাক্যস্থিত ক্রিয়াপদের সাথে নামপদের (বিশেষ্য ও সর্বনামের) যে পারস্পরিক সম্পর্ক রয়েছে, তাকে কারক বলে ("ক্রিয়ান্বয়ি কারকম্")। কারক ৬ প্রকার: ১. কর্তৃকারক (যে ক্রিয়া সম্পাদন করে)। ২. কর্মকারক (যাকে আশ্রয় করে কর্তা ক্রিয়া সম্পন্ন করে)। ৩. করণকারক (যার সাহায্যে বা যে উপায়ে কার্য সম্পন্ন হয়)। ৪. সম্প্রদানকারক (স্বত্ব ত্যাগ করে দান করা হয়)। ৫. অপাদানকারক (যা থেকে কোনো কিছু পতিত, ভীত, বিচ্যুত, উৎপন্ন বা রক্ষিত হয়)। ৬. অধিকরণকারক (ক্রিয়া সম্পাদনের স্থান, কাল বা বিষয়)।',
    definitionEn: 'Case (Karok) signifies the grammatical relation between a verb and the noun/pronoun in a sentence. There are 6 types: Nominative, Accusative, Instrumental, Dative, Ablative, and Locative.',
    explanationBn: 'বোর্ড পরীক্ষার সবচেয়ে নির্ভরযোগ্য ও ১০০% নির্ভুল মাস্টার শর্টকাট: ১. কে / কারা প্রশ্ন করলে → কর্তৃকারক (যেমন: "রহিম" বই পড়ে)। ২. কী / কাকে প্রশ্ন করলে → কর্মকারক (যেমন: রহিম "বই" পড়ে)। ৩. কী দিয়ে / কীসের সাহায্যে প্রশ্ন করলে → করণকারক (যেমন: "কলম দিয়ে" লেখে, "টাকায়" সব হয়)। ৪. নিঃস্বার্থভাবে কাকে প্রশ্ন করলে → সম্প্রদানকারক (যেমন: "ভিক্ষুককে" ভিক্ষা দাও)। ৫. কোথা থেকে / কী হতে / কিসে ভয় প্রশ্ন করলে → অপাদানকারক (যেমন: "গাছ থেকে" পাতা পড়ে, "মেঘ থেকে" বৃষ্টি হয়, "তিলে" তৈল হয়)। ৬. কোথায় / কখন / কোন বিষয়ে প্রশ্ন করলে → অধিকরণকারক (যেমন: "পুকুরে" মাছ আছে, "প্রভাতে" সূর্য ওঠে, সে "অঙ্কে" কাঁচা কিন্তু ব্যাকরণে ভালো)।',
    teacherGoldenTips: 'আলমগীর স্যারের গোল্ডেন কারক টেবিল: (১) কে? → কর্তৃ (২) কী? → কর্ম (৩) কী দিয়ে? → করণ (৪) নিঃস্বার্থ দান? → সম্প্রদান (৫) কোথা হতে/ভয়? → অপাদান (৬) কোথায়/কখন? → অধিকরণ। এই ৬টি প্রশ্ন মনে রাখলে কারকে ভুল হওয়া অসম্ভব!',
    rules: [
      {
        ruleNo: 1,
        nameBn: 'অপাদান বনাম অধিকরণ সূক্ষ্ম পার্থক্য',
        explanationBn: 'উৎপন্ন, বিচ্যুত বা বের হওয়া বোঝালে অপাদান; কিন্তু থাকা বা অবস্থান বোঝালে অধিকরণ।',
        examples: [
          {
            bn: '"তিলে তৈল হয়" = অপাদান (উৎপন্ন হওয়া)। "তিলে তৈল আছে" = অধিকরণ (তিলের মধ্যে সর্বত্র অবস্থান)।',
            context: 'অপাদান বনাম অধিকরণের মহাবিপদ দূরীকরণ',
            highlight: 'হয় (অপাদান) বনাম আছে (অধিকরণ)'
          }
        ]
      },
      {
        ruleNo: 2,
        nameBn: 'সম্প্রদান বনাম কর্মকারক পার্থক্য',
        explanationBn: 'স্বত্ব চিরতরে ত্যাগ করলে সম্প্রদান; ফেরতযোগ্য বা ব্যবসায়িক সম্পর্ক হলে কর্মকারক।',
        examples: [
          {
            bn: '"ভিখারিকে ভিক্ষা দাও" = সম্প্রদানকারক (চিরতরে দান)। "ধোপাকে কাপড় দাও" = কর্মকারক (ধোপা কাপড় ফেরত দেবে)।',
            context: 'স্বত্ব ত্যাগের নীতি',
            highlight: 'ভিখারিকে (সম্প্রদান) বনাম ধোপাকে (কর্ম)'
          }
        ]
      }
    ],
    formulas: [
      {
        label: 'কারক নির্ণয়ের ইউনিভার্সাল ফর্মুলা',
        structure: 'কে=কর্তৃ | কী=কর্ম | কী দিয়ে=করণ | স্বত্ব ত্যাগ=সম্প্রদান | কোথা হতে=অপাদান | কোথায়/কখন=অধিকরণ'
      }
    ],
    examples: [
      {
        bn: 'শিকারি বিড়াল গোঁফে চেনা যায় (গোঁফে = করণকারক, উপায়)',
        context: 'করণকারক'
      },
      {
        bn: 'তিলে তৈল হয় (তিলে = অপাদানকারক, উৎপন্ন)',
        context: 'অপাদানকারক'
      }
    ],
    exceptions: [
      {
        titleBn: 'সম্বন্ধ ও সম্বোধন পদ কারক নয়',
        descriptionBn: 'সম্বন্ধ পদ (যেমন: "রহিমের ভাই") এবং সম্বোধন পদে (যেমন: "হে বন্ধু!") ক্রিয়ার সাথে সরাসরি অন্বয় না থাকায় সংস্কৃত ব্যাকরণে এদের খাঁটি কারক গণ্য করা হয় না।'
      }
    ],
    commonMistakes: [
      {
        incorrectBn: '"ধোপাকে কাপড় দাও"—এখানে ধোপাকে সম্প্রদানকারক।',
        correctBn: '"ধোপাকে কাপড় দাও"—এখানে ধোপাকে কর্মকারক।',
        explanationBn: 'কারণ ধোপাকে কাপড় স্বত্ব ত্যাগ করে দেওয়া হয় না, সে ধুয়ে ফেরত দেবে।'
      }
    ],
    writtenPractice: [
      {
        id: 1,
        type: 'IDENTIFICATION',
        prompt: 'কারক ও বিভক্তি নির্ণয় করো: (ক) তিলে তৈল হয়। (খ) তিলে তৈল আছে।',
        correctAnswer: '(ক) "তিলে": অপাদানে সপ্তমী বিভক্তি (উৎপন্ন হওয়া অর্থ)। (খ) "তিলে": অধিকরণে সপ্তমী বিভক্তি (অভিব্যাপক স্থানিক অবস্থান অর্থ)।',
        explanationBn: 'বোর্ড পরীক্ষার ক্লাসিক ৩ নম্বরের প্রশ্ন।'
      }
    ],
    tags: ['KAROK', 'CASE', 'NOMINATIVE', 'ACCUSATIVE', 'INSTRUMENTAL', 'ABLATIVE', 'LOCATIVE', 'SSC', 'HSC'],
    status: 'PUBLISHED',
    orderIndex: 1,
    viewCount: 350
  }
];

const CHAPTER_13_MCQS = [
  {
    id: 113001,
    chapterId: 113,
    topicId: 11301,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: 'বাক্যস্থিত ক্রিয়াপদের সাথে নামপদের সম্পর্ককে কী বলে?',
    questionEn: 'What is the relation between a verb and nominal words in a sentence called?',
    options: ['কারক', 'সমাস', 'সন্ধি', 'প্রত্যয়'],
    correctOptionIndex: 0,
    correctAnswerText: 'কারক',
    explanationBn: 'বাক্যের ক্রিয়াপদের সাথে বিশেষ্য ও সর্বনাম পদের সম্পর্ককে কারক বলে ("ক্রিয়ান্বয়ি কারকম্")।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'ঢাকা বোর্ড',
    year: 2024,
    examType: 'SSC',
    tags: ['KAROK', 'DEFINITION', 'DHAKA_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 113002,
    chapterId: 113,
    topicId: 11301,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: '"তিলে তৈল হয়"—এখানে "তিলে" কোন কারকে কোন বিভক্তি?',
    questionEn: 'In "Tile toil hoy", what case and inflection is "tile"?',
    options: ['অপাদানে সপ্তমী', 'অধিকরণে সপ্তমী', 'করণে সপ্তমী', 'কর্মে প্রথমা'],
    correctOptionIndex: 0,
    correctAnswerText: 'অপাদানে সপ্তমী',
    explanationBn: 'তিল থেকে তেল উৎপন্ন হয় বোঝাচ্ছে, তাই অপাদান কারক এবং "এ" বিভক্তি থাকায় সপ্তমী বিভক্তি।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'রাজশাহী বোর্ড',
    year: 2023,
    examType: 'SSC',
    tags: ['OPADAN', 'TILE_TOIL', 'RAJSHAHI_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 113003,
    chapterId: 113,
    topicId: 11301,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: '"ধোপাকে কাপড় দাও"—এখানে "ধোপাকে" কোন কারক?',
    questionEn: 'In "Dhopake kapor dao", what case is "Dhopake"?',
    options: ['কর্মকারক', 'সম্প্রদানকারক', 'করণকারক', 'কর্তৃকারক'],
    correctOptionIndex: 0,
    correctAnswerText: 'কর্মকারক',
    explanationBn: 'ধোপাকে কাপড় চিরতরে স্বত্ব ত্যাগ করে দান করা হয় না, ধুয়ে ফেরত দেওয়ার জন্য দেওয়া হয়; তাই এটি কর্মকারক।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'যশোর বোর্ড',
    year: 2024,
    examType: 'SSC',
    tags: ['ACCUSATIVE', 'DHOPAKE', 'JASHORE_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 113004,
    chapterId: 113,
    topicId: 11301,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: '"শিকারি বিড়াল গোঁফে চেনা যায়"—এখানে "গোঁফে" কোন কারক?',
    questionEn: 'In "Shikari biral gofe chena jay", what case is "gofe"?',
    options: ['করণকারক', 'অপাদানকারক', 'অধিকরণকারক', 'কর্তৃকারক'],
    correctOptionIndex: 0,
    correctAnswerText: 'করণকারক',
    explanationBn: 'গোঁফের সাহায্যে বা চিহ্নের দ্বারা চেনা যায় অর্থাৎ এটি উপায় বা মাধ্যম নির্দেশ করায় করণকারক।',
    difficulty: 'MEDIUM',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'দিনাজপুর বোর্ড',
    year: 2024,
    examType: 'SSC',
    tags: ['KORON', 'INSTRUMENTAL', 'DINAJPUR_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 113005,
    chapterId: 113,
    topicId: 11301,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: 'যে কারকে স্বত্ব চিরতরে ত্যাগ করে দান করা বোঝায়, তাকে কী বলে?',
    questionEn: 'What case signifies absolute relinquishment of ownership during donation?',
    options: ['সম্প্রদান কারক', 'কর্মকারক', 'করণকারক', 'অপাদান কারক'],
    correctOptionIndex: 0,
    correctAnswerText: 'সম্প্রদান কারক',
    explanationBn: 'যাকে কোনো কিছু চিরতরে স্বত্ব ত্যাগ করে নিঃস্বার্থভাবে দান করা হয়, তাকে সম্প্রদান কারক (Dative Case) বলে।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'কুমিল্লা বোর্ড',
    year: 2023,
    examType: 'SSC',
    tags: ['SHOMPRODAN', 'DATIVE', 'CUMILLA_BOARD'],
    status: 'ACTIVE'
  }
];

const CHAPTER_13_MODEL_TEST = {
  id: 11301,
  subject: 'BANGLA',
  chapterId: 113,
  testTitleBn: 'অধ্যায় ১৩ মডেল টেস্ট: কারক',
  testTitleEn: 'Chapter 13 Model Test: Case (Karok)',
  descriptionBn: 'কর্তৃ, কর্ম, করণ, সম্প্রদান, অপাদান ও অধিকরণ কারকের ইউনিভার্সাল নির্ণয় শর্টকাট ও বোর্ড প্রশ্নের ওপর মডেল টেস্ট।',
  durationMinutes: 10,
  totalMarks: 5,
  passPercentage: 60,
  difficulty: 'MEDIUM',
  questionCount: 5,
  questionIds: [113001, 113002, 113003, 113004, 113005],
  status: 'PUBLISHED'
};

// ============================================================================
// CHAPTER 14: বিভক্তি (Inflection)
// ============================================================================
const CHAPTER_14_TOPICS = [
  {
    id: 11401,
    chapterId: 114,
    parentTopicId: null,
    subject: 'BANGLA',
    topicNo: '১৪.১',
    titleBn: 'বিভক্তির সংজ্ঞা, শ্রেণিবিভাগ ও ৭টি শব্দবিভক্তি',
    titleEn: 'Definition, Types & 7 Nominal Case Inflections (Shobdo Bibhokti)',
    slug: 'b14-bibhokti-shongpga-o-shrenibibhag',
    difficulty: 'BOARD_STANDARD',
    classLevel: 'Class 8 - 12 (SSC & HSC)',
    summaryBn: 'বাক্যস্থিত একটি শব্দের সঙ্গে অন্য শব্দের অন্বয় সাধনের জন্য শব্দের সঙ্গে যে বর্ণ বা বর্ণসমষ্টি যুক্ত হয়, তাকে বিভক্তি বলে।',
    definitionBn: 'বিভক্তি (Case Ending / Inflection): বাক্যস্থিত পদগুলোর পরস্পরের মধ্যে অর্থসংগতি ও অন্বয় সাধনের জন্য শব্দের সাথে যে সকল বর্ণ বা বর্ণসমষ্টি যুক্ত হয়, সেগুলোকে বিভক্তি বলে। বিভক্তি ২ প্রকার: ১. শব্দবিভক্তি বা নামবিভক্তি (বিশেষ্য/সর্বনামের সাথে যুক্ত হয়)। ২. ক্রিয়াবিভক্তি বা ধাতুবিভক্তি (ধাতুর সাথে যুক্ত হয়)। শব্দবিভক্তি ৭ প্রকার: প্রথমা/শূন্য (০), দ্বিতীয়া (কে, রে), তৃতীয়া (দ্বারা, দিয়া, কর্তৃক), চতুর্থী (কে, রে), পঞ্চমী (হইতে, থেকে, চেয়ে), ষষ্ঠী (র, এর), সপ্তমী (এ, য়, তে, এতে)।',
    definitionEn: 'An Inflection or Case Ending (Bibhokti) is a suffix attached to nouns or verb roots to establish syntactic coherence within a sentence. Nominal inflections are traditionally 7-fold.',
    explanationBn: 'বাংলায় বিভক্তি ছাড়া কোনো শব্দ বাক্যে ব্যবহৃত হতে পারে না ("বিভক্তিহীন নামপদ অপ্রযুক্ত")। যে পদে দৃশ্যত কোনো বিভক্তি চিহ্ন দেখা যায় না, ব্যাকরণে তাকে শূন্য বিভক্তি বা প্রথমা বিভক্তি বলে (যেমন: "রহিম" ভাত খায়; রহিম + ০)। তৃতীয়া বিভক্তির "দ্বারা/দিয়া" এবং পঞ্চমী বিভক্তির "হতে/থেকে"—এরা মূলত বিভক্তিরূপে ব্যবহৃত অনুসর্গ। দ্বিতীয়া ও চতুর্থী বিভক্তির রূপ এক (কে, রে), তবে নিঃস্বার্থ সম্প্রদান কারকে চতুর্থী বিভক্তি হয় এবং অন্যান্য কারকে দ্বিতীয়া বিভক্তি হয়।',
    teacherGoldenTips: '৭ বিভক্তির মাস্টার চার্ট: ১মা = ০ | ২য়া = কে, রে | ৩য়া = দ্বারা, দিয়া | ৪র্থী = কে (সম্প্রদানে) | ৫মী = হতে, থেকে, চেয়ে | ৬ষ্ঠী = র, এর | ৭মী = এ, য়, তে।',
    rules: [
      {
        ruleNo: 1,
        nameBn: 'দ্বিতীয়া বনাম চতুর্থী বিভক্তি নির্ধারণ',
        explanationBn: 'স্বত্ব ত্যাগ করে কাউকে কিছু দিলে চতুর্থী বিভক্তি; সাধারণ কর্মকারকে দ্বিতীয়া বিভক্তি।',
        examples: [
          {
            bn: 'ভিখারিকে (৪র্থী) ভিক্ষা দাও। ধোপাকে (২য়া) কাপড় দাও।',
            context: 'দ্বিতীয়া বনাম চতুর্থী'
          }
        ]
      }
    ],
    formulas: [
      {
        label: 'বিভক্তি রূপ ছক',
        structure: 'প্রথমা(০) | দ্বিতীয়া(কে) | তৃতীয়া(দ্বারা) | চতুর্থী(কে-দানে) | পঞ্চমী(হতে) | ষষ্ঠী(র/এর) | সপ্তমী(এ/তে)'
      }
    ],
    examples: [
      {
        bn: 'তিনি বাড়ি (০ বিভক্তি) নেই',
        context: 'শূন্য বিভক্তি'
      },
      {
        bn: 'গাছে (এ = সপ্তমী বিভক্তি) ফল ধরেছে',
        context: 'সপ্তমী বিভক্তি'
      }
    ],
    exceptions: [
      {
        titleBn: 'অলুক বিভক্তি',
        descriptionBn: 'যে সমাসে বিভক্তি লোপ পায় না, তাকে অলুক সমাস বলে (যেমন: গায়ে হলুদ, দেশে-বিদেশে)।'
      }
    ],
    commonMistakes: [
      {
        incorrectBn: '"রহিম ভাত খায়"—এখানে রহিম পদে কোনো বিভক্তি নেই।',
        correctBn: 'রহিম পদে শূন্য বা প্রথমা বিভক্তি রয়েছে।',
        explanationBn: 'বাংলা বাক্যে নামপদ বিভক্তিহীন হতে পারে না।'
      }
    ],
    writtenPractice: [
      {
        id: 1,
        type: 'IDENTIFICATION',
        prompt: 'চিহ্নিত পদগুলোতে বিভক্তি নির্ণয় করো: (ক) ঘোড়ায় গাড়ি টানে। (খ) দেশের জন্য প্রাণ দাও।',
        correctAnswer: '(ক) "ঘোড়ায়": সপ্তমী (য়) বিভক্তি। (খ) "দেশের": ষষ্ঠী (এর) বিভক্তি।',
        explanationBn: 'বোর্ডের গুরুত্বপূর্ণ ২ নম্বরের প্রশ্ন।'
      }
    ],
    tags: ['BIBHOKTI', 'INFLECTION', 'CASE_SUFFIX', 'SHOBDO_BIBHOKTI', 'SSC'],
    status: 'PUBLISHED',
    orderIndex: 1,
    viewCount: 220
  }
];

const CHAPTER_14_MCQS = [
  {
    id: 114001,
    chapterId: 114,
    topicId: 11401,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: 'বাক্যে কোনো দৃশ্যমান বিভক্তি চিহ্ন না থাকলে তাকে কোন বিভক্তি ধরা হয়?',
    questionEn: 'If no visible inflection marker is present, which inflection is it considered?',
    options: ['শূন্য বা প্রথমা বিভক্তি', 'দ্বিতীয়া বিভক্তি', 'ষষ্ঠী বিভক্তি', 'সপ্তমী বিভক্তি'],
    correctOptionIndex: 0,
    correctAnswerText: 'শূন্য বা প্রথমা বিভক্তি',
    explanationBn: 'যে পদে কোনো প্রকাশ্য বিভক্তি চিহ্ন থাকে না, সেখানে শূন্য বা প্রথমা বিভক্তি বিদ্যমান থাকে।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'ঢাকা বোর্ড',
    year: 2024,
    examType: 'SSC',
    tags: ['SHUNNO_BIBHOKTI', 'DHAKA_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 114002,
    chapterId: 114,
    topicId: 11401,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: 'নিচের কোনটি সপ্তমী বিভক্তির চিহ্ন?',
    questionEn: 'Which of the following is a marker of the 7th Inflection (Saptami)?',
    options: ['এ, য়, তে', 'কে, রে', 'র, এর', 'হইতে, থেকে'],
    correctOptionIndex: 0,
    correctAnswerText: 'এ, য়, তে',
    explanationBn: 'সপ্তমী বিভক্তির প্রধান চিহ্নগুলো হলো: এ, য়, তে, এতে (যেমন: ঘরে, ঘোড়ায়, রাতে)।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'রাজশাহী বোর্ড',
    year: 2023,
    examType: 'SSC',
    tags: ['SAPTAMI', 'RAJSHAHI_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 114003,
    chapterId: 114,
    topicId: 11401,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: 'শব্দবিভক্তি বা নামবিভক্তি প্রধানত কয় প্রকার?',
    questionEn: 'How many primary types of Nominal Inflections (Shobdo Bibhokti) exist?',
    options: ['৭ প্রকার', '৫ প্রকার', '৬ প্রকার', '৮ প্রকার'],
    correctOptionIndex: 0,
    correctAnswerText: '৭ প্রকার',
    explanationBn: 'সংস্কৃত ও ঐতিহ্যবাহী বাংলা ব্যাকরণে নামবিভক্তি ৭ প্রকার: প্রথমা থেকে সপ্তমী পর্যন্ত।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'যশোর বোর্ড',
    year: 2024,
    examType: 'SSC',
    tags: ['TYPES_OF_BIBHOKTI', 'JASHORE_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 114004,
    chapterId: 114,
    topicId: 11401,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: '"র" এবং "এর" কোন বিভক্তির উদাহরণ?',
    questionEn: 'Which inflection do "r" and "er" represent?',
    options: ['ষষ্ঠী বিভক্তি', 'সপ্তমী বিভক্তি', 'পঞ্চমী বিভক্তি', 'দ্বিতীয়া বিভক্তি'],
    correctOptionIndex: 0,
    correctAnswerText: 'ষষ্ঠী বিভক্তি',
    explanationBn: '"র" ও "এর" হলো সম্বন্ধ পদ নির্দেশক ষষ্ঠী বিভক্তির চিহ্ন (যেমন: রহিমের, দেশের)।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'কুমিল্লা বোর্ড',
    year: 2023,
    examType: 'SSC',
    tags: ['SHOSTHI', 'GENITIVE', 'CUMILLA_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 114005,
    chapterId: 114,
    topicId: 11401,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: 'নিচের কোন বিভক্তিগুলো মূলত অনুসর্গ হলেও বিভক্তিতুল্য মর্যাদা পায়?',
    questionEn: 'Which markers are postpositions by origin but function as case inflections?',
    options: ['দ্বারা, দিয়া, হতে, থেকে', 'এ, য়, তে', 'কে, রে', 'র, এর'],
    correctOptionIndex: 0,
    correctAnswerText: 'দ্বারা, দিয়া, হতে, থেকে',
    explanationBn: 'তৃতীয়া ও পঞ্চমী বিভক্তির চিহ্ন হিসেবে প্রচলিত "দ্বারা, দিয়া, হতে, থেকে" মূলত শব্দানুসারী অনুসর্গ।',
    difficulty: 'MEDIUM',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'চট্টগ্রাম বোর্ড',
    year: 2024,
    examType: 'SSC',
    tags: ['POSTPOSITION_BIBHOKTI', 'CHITTAGONG_BOARD'],
    status: 'ACTIVE'
  }
];

const CHAPTER_14_MODEL_TEST = {
  id: 11401,
  subject: 'BANGLA',
  chapterId: 114,
  testTitleBn: 'অধ্যায় ১৪ মডেল টেস্ট: বিভক্তি',
  testTitleEn: 'Chapter 14 Model Test: Inflection (Bibhokti)',
  descriptionBn: 'শব্দবিভক্তি, ধাতুবিভক্তি, শূন্য বিভক্তি এবং ৭ প্রকার শব্দবিভক্তির রূপান্তরের ওপর পূর্ণাঙ্গ মডেল টেস্ট।',
  durationMinutes: 10,
  totalMarks: 5,
  passPercentage: 60,
  difficulty: 'MEDIUM',
  questionCount: 5,
  questionIds: [114001, 114002, 114003, 114004, 114005],
  status: 'PUBLISHED'
};

// ============================================================================
// CHAPTER 15: বচন (Number)
// ============================================================================
const CHAPTER_15_TOPICS = [
  {
    id: 11501,
    chapterId: 115,
    parentTopicId: null,
    subject: 'BANGLA',
    topicNo: '১৫.১',
    titleBn: 'বচনের সংজ্ঞা, শ্রেণিবিভাগ ও বহুবচন গঠনের নিয়ম',
    titleEn: 'Definition, Singular/Plural Classification & Plural Suffix Rules',
    slug: 'b15-bochon-shongpga-o-niyom',
    difficulty: 'BOARD_STANDARD',
    classLevel: 'Class 8 - 12 (SSC & HSC)',
    summaryBn: 'ব্যাকরণে বিশেষ্য বা সর্বনামের সংখ্যাগত ধারণাকে বচন বলে। বচন ২ প্রকার: একবচন ও বহুবচন।',
    definitionBn: 'বচন (Number): যে ব্যাকরণিক প্রত্যয় বা শব্দের দ্বারা বিশেষ্য ও সর্বনাম পদের সংখ্যাগত ধারণা (এক বা একাধিক) প্রকাশ পায়, তাকে বচন বলে। বচন ২ প্রকার: ১. একবচন (একটিমাত্র ব্যক্তি, বস্তু বা প্রাণীকে বোঝায়; যেমন: ছাত্র, বই, সে)। ২. বহুবচন (একের অধিক সংখ্যাকে বোঝায়; যেমন: ছাত্ররা, বইগুলো, তারা)।',
    definitionEn: 'Number (Bochon) designates the quantitative concept of singularity or plurality in nouns and pronouns. Bengali differentiates Singular (Ekbochon) and Plural (Bohubochon).',
    explanationBn: 'বহুবচন গঠনের ক্ষেত্রে ব্যাকরণে শব্দভেদে সুনির্দিষ্ট নিয়ম রয়েছে: ১. কেবল উন্নত প্রাণীবাচক বা মানুষের ক্ষেত্রে ব্যবহৃত বহুবচন প্রত্যয়: গণ, বৃন্দ, মণ্ডলী, বর্গ (যেমন: ছাত্রগণ, শিক্ষকবৃন্দ, সুধীমণ্ডলী, পণ্ডিতবর্গ)। ২. কেবল অপ্রাণিবাচক বা জড় বস্তুর ক্ষেত্রে ব্যবহৃত প্রত্যয়: কুল, মালা, রাজি, রাশি, গুচ্ছ, দাম (যেমন: পর্বতমালা, তারকারাজি, বালুকারাশি, কুসুমদাম)। ৩. প্রাণিবাচক ও অপ্রাণিবাচক উভয়ের ক্ষেত্রে প্রযোজ্য: রা, এরা, গুলো, গুলি, দিগ, দের (যেমন: ছেলেরা, বইগুলো)। সবচেয়ে মারাত্মক ভুল হলো দ্বৈত বহুবচন দোষ (যেমন: "সকল ছাত্ররা এসেছে")—একই পদে দুটি বহুবচন চিহ্ন বসানো মারাত্মক ভুল।',
    teacherGoldenTips: 'বহুবচন প্রত্যয়ের স্পেশাল চার্ট: (১) মানুষের ক্ষেত্রে → বৃন্দ, গণ, মণ্ডলী, বর্গ। (২) বস্তুর ক্ষেত্রে → মালা (পর্বতমালা), রাজি (তারকারাজি), গুচ্ছ (মেঘগুচ্ছ)। (৩) দ্বৈত বহুবচন (সকল ছাত্ররা / সমুদয় গ্রন্থাবলী) ১০০% অশুদ্ধ!',
    rules: [
      {
        ruleNo: 1,
        nameBn: 'উন্নত প্রাণী বনাম অপ্রাণিবাচক প্রত্যয় বিভাজন',
        explanationBn: 'মানুষ ছাড়া অন্য কোনো জড় বস্তু বা নিকৃষ্ট প্রাণীতে "বৃন্দ", "মণ্ডলী" বা "বর্গ" ব্যবহার করা অশুদ্ধ।',
        examples: [
          {
            bn: 'অশুদ্ধ: পক্ষীবৃন্দ, ছাগলমণ্ডলী। শুদ্ধ: পক্ষীকুল, পশুপাল।',
            context: 'প্রত্যয়ের অপপ্রয়োগ বর্জন'
          }
        ]
      },
      {
        ruleNo: 2,
        nameBn: 'দ্বৈত বহুবচন দোষ বর্জন',
        explanationBn: 'বহুবচনের দুটি রূপ একই পদে বা পাশাপাশি কখনো বসানো যাবে না।',
        examples: [
          {
            bn: 'অশুদ্ধ: সকল ছাত্ররা। শুদ্ধ: সকল ছাত্র / ছাত্ররা। অশুদ্ধ: সমুদয় গ্রন্থাবলী। শুদ্ধ: সমুদয় গ্রন্থ / গ্রন্থাবলী।',
            context: 'দ্বৈত বহুবচন বর্জন'
          }
        ]
      }
    ],
    formulas: [
      {
        label: 'বহুবচন প্রয়োগ সূত্র',
        structure: 'উন্নত প্রাণী = বৃন্দ/গণ/মণ্ডলী/বর্গ | অপ্রাণিবাচক = মালা/রাজি/রাশি/গুচ্ছ | দ্বৈত বহুবচন = অশুদ্ধ'
      }
    ],
    examples: [
      {
        bn: 'পণ্ডিতবর্গ সভায় উপস্থিত হয়েছেন (পণ্ডিতবর্গ = সম্মানসূচক বহুবচন)',
        context: 'উন্নত প্রাণী'
      },
      {
        bn: 'মেঘমালা আকাশে ভেসে বেড়াচ্ছে (মেঘমালা = অপ্রাণিবাচক বহুবচন)',
        context: 'অপ্রাণিবাচক'
      }
    ],
    exceptions: [
      {
        titleBn: 'একবচনের বহুবচনার্থে প্রয়োগ',
        descriptionBn: 'কখনো কখনো একবচনের রূপ দিয়েও সমগ্র জাতিকে বোঝায় (যেমন: "সিংহ বনে থাকে", "মানুষ মরণশীল")।'
      }
    ],
    commonMistakes: [
      {
        incorrectBn: 'সকল পাখিরা আকাশে উড়ছে।',
        correctBn: 'সব পাখি আকাশে উড়ছে / পাখিরা আকাশে উড়ছে।',
        explanationBn: 'একই সাথে "সকল" এবং "রা" বসলে দ্বৈত বহুবচন দোষ ঘটে।'
      }
    ],
    writtenPractice: [
      {
        id: 1,
        type: 'ERROR_CORRECTION',
        prompt: 'বাক্যটি শুদ্ধ করো: "সকল সদস্যগণকে সাদরে আমন্ত্রণ জানানো যাইতেছে।"',
        correctAnswer: 'চলিত রূপ: "সকল সদস্যকে সাদরে আমন্ত্রণ জানানো যাচ্ছে।" অথবা "সদস্যগণকে সাদরে আমন্ত্রণ জানানো যাচ্ছে।"',
        explanationBn: 'দ্বৈত বহুবচন (সকল+গণ) সংশোধন।'
      }
    ],
    tags: ['BOCHON', 'NUMBER', 'PLURAL', 'DWOITO_BOHUBOCHON', 'SSC'],
    status: 'PUBLISHED',
    orderIndex: 1,
    viewCount: 210
  }
];

const CHAPTER_15_MCQS = [
  {
    id: 115001,
    chapterId: 115,
    topicId: 11501,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: 'কেবলমাত্র উন্নত প্রাণীবাচক বা মানুষের বহুবচনে কোন প্রত্যয়টি ব্যবহৃত হয়?',
    questionEn: 'Which plural suffix is exclusively used for respected human beings?',
    options: ['বৃন্দ', 'মালা', 'রাজি', 'দাম'],
    correctOptionIndex: 0,
    correctAnswerText: 'বৃন্দ',
    explanationBn: '"বৃন্দ", "গণ", "মণ্ডলী", "বর্গ" কেবল উন্নত প্রাণীবাচক বা মানুষের ক্ষেত্রে বসে (যেমন: শিক্ষকবৃন্দ, ভক্তমণ্ডলী)। মালা, রাজি, দাম বস্তুর ক্ষেত্রে বসে।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'ঢাকা বোর্ড',
    year: 2024,
    examType: 'SSC',
    tags: ['BOCHON', 'BRINDO', 'DHAKA_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 115002,
    chapterId: 115,
    topicId: 11501,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: 'নিচের কোন বাক্যটিতে দ্বৈত বহুবচনজনিত ভুল রয়েছে?',
    questionEn: 'Which sentence has a redundant double-plural error?',
    options: ['সকল ছাত্ররা উপস্থিত হয়েছে।', 'পাখিরা গান গাইছে।', 'মানুষ মরণশীল।', 'শিক্ষকবৃন্দ শ্রেণিকক্ষে আছেন।'],
    correctOptionIndex: 0,
    correctAnswerText: 'সকল ছাত্ররা উপস্থিত হয়েছে।',
    explanationBn: '"সকল" এবং "রা" দুটি বহুবচন চিহ্ন একসাথে ব্যবহৃত হওয়ায় বাক্যটি দ্বৈত বহুবচন দোষে দুষ্ট।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'রাজশাহী বোর্ড',
    year: 2023,
    examType: 'SSC',
    tags: ['DWOITO_BOHUBOCHON', 'RAJSHAHI_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 115003,
    chapterId: 115,
    topicId: 11501,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: 'কেবল অপ্রাণিবাচক বা জড় শব্দের বহুবচনে কোনটি ব্যবহৃত হয়?',
    questionEn: 'Which plural suffix is exclusively used for inanimate objects?',
    options: ['রাজি', 'বর্গ', 'মণ্ডলী', 'বৃন্দ'],
    correctOptionIndex: 0,
    correctAnswerText: 'রাজি',
    explanationBn: '"রাজি", "মালা", "দাম", "রাশি" কেবল জড় বা অপ্রাণিবাচক শব্দে বসে (যেমন: তারকারাজি, পর্বতমালা)।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'যশোর বোর্ড',
    year: 2024,
    examType: 'SSC',
    tags: ['INANIMATE_PLURAL', 'RAJI', 'JASHORE_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 115004,
    chapterId: 115,
    topicId: 11501,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: '"সুধীমণ্ডলী"—এখানে "মণ্ডলী" কোন অর্থে যুক্ত হয়েছে?',
    questionEn: 'In "Shudhimondoli", in what sense is "mondoli" attached?',
    options: ['উন্নত প্রাণীবাচকে বহুবচন', 'অপ্রাণিবাচক বহুবচন', 'ক্ষুদ্রার্থে বহুবচন', 'অবজ্ঞার্থে বহুবচন'],
    correctOptionIndex: 0,
    correctAnswerText: 'উন্নত প্রাণীবাচকে বহুবচন',
    explanationBn: '"সুধীমণ্ডলী" দ্বারা সম্মানিত ব্যক্তিত্বদের সমাবেশ বোঝানোয় এটি উন্নত প্রাণীবাচকে বহুবচন প্রকাশ করেছে।',
    difficulty: 'MEDIUM',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'দিনাজপুর বোর্ড',
    year: 2023,
    examType: 'SSC',
    tags: ['MONDOLI', 'HONORIFIC_PLURAL', 'DINAJPUR_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 115005,
    chapterId: 115,
    topicId: 11501,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: '"মানুষ মরণশীল"—এই বাক্যে "মানুষ" কোন বচনের দ্যোতনা দেয়?',
    questionEn: 'In "Manush moronshil", what number nuance does "Manush" convey?',
    options: ['একবচনে সামগ্রিক বহুবচন', 'বিশুদ্ধ একবচন', 'দ্বৈত বহুবচন', 'কোনোটিই নয়'],
    correctOptionIndex: 0,
    correctAnswerText: 'একবচনে সামগ্রিক বহুবচন',
    explanationBn: 'একবচনের শব্দরূপ ব্যবহার করে সমগ্র মানবজাতিকে বোঝানো হয়েছে, যা একবচনের সমষ্টিগত বহুবচনার্থে প্রয়োগ।',
    difficulty: 'MEDIUM',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'চট্টগ্রাম বোর্ড',
    year: 2024,
    examType: 'SSC',
    tags: ['COLLECTIVE_SINGULAR', 'CHITTAGONG_BOARD'],
    status: 'ACTIVE'
  }
];

const CHAPTER_15_MODEL_TEST = {
  id: 11501,
  subject: 'BANGLA',
  chapterId: 115,
  testTitleBn: 'অধ্যায় ১৫ মডেল টেস্ট: বচন',
  testTitleEn: 'Chapter 15 Model Test: Number (Bochon)',
  descriptionBn: 'একবচন, বহুবচন গঠনের নিয়ম, প্রাণিবাচক ও অপ্রাণিবাচক শব্দে বহুবচন এবং দ্বৈত বহুবচন দোষের ওপর পূর্ণাঙ্গ মডেল টেস্ট।',
  durationMinutes: 10,
  totalMarks: 5,
  passPercentage: 60,
  difficulty: 'MEDIUM',
  questionCount: 5,
  questionIds: [115001, 115002, 115003, 115004, 115005],
  status: 'PUBLISHED'
};

module.exports = {
  CHAPTER_11_TOPICS, CHAPTER_11_MCQS, CHAPTER_11_MODEL_TEST,
  CHAPTER_12_TOPICS, CHAPTER_12_MCQS, CHAPTER_12_MODEL_TEST,
  CHAPTER_13_TOPICS, CHAPTER_13_MCQS, CHAPTER_13_MODEL_TEST,
  CHAPTER_14_TOPICS, CHAPTER_14_MCQS, CHAPTER_14_MODEL_TEST,
  CHAPTER_15_TOPICS, CHAPTER_15_MCQS, CHAPTER_15_MODEL_TEST
};
