/**
 * Bangla Grammar Chapters 31–35 Content:
 * Chapter 31: উক্তি পরিবর্তন (Direct & Indirect Speech Transformation)
 * Chapter 32: বাক্য সংকোচন / বাক্য সংক্ষেপণ (Sentence Contraction)
 * Chapter 33: বাগধারা ও প্রবাদ-প্রবচন (Bengali Idioms & Proverbs)
 * Chapter 34: এক কথায় প্রকাশ (One Word Substitution)
 * Chapter 35: সমার্থক শব্দ / প্রতিশব্দ (Synonyms & Lexical Substitutions)
 * 
 * Fully structured according to NCTB/SSC/HSC standards with 13-section format.
 */

// ============================================================================
// CHAPTER 31: উক্তি পরিবর্তন (Speech Transformation)
// ============================================================================
const CHAPTER_31_TOPICS = [
  {
    id: 13101,
    chapterId: 131,
    parentTopicId: null,
    subject: 'BANGLA',
    topicNo: '৩১.১',
    titleBn: 'উক্তির সংজ্ঞা, প্রত্যক্ষ ও পরোক্ষ উক্তি এবং মৌলিক রূপান্তর নিয়ম',
    titleEn: 'Definition of Speech (Ukti), Direct vs Indirect Speech & Core Transformation Rules',
    slug: 'b31-ukti-shongpga-o-moulik-niyom',
    difficulty: 'BOARD_STANDARD',
    classLevel: 'Class 8 - 12 (SSC & HSC)',
    summaryBn: 'কোনো ব্যক্তির বক্তব্য বা কথার প্রকাশভঙ্গিকে উক্তি বলে। উক্তি ২ প্রকার: প্রত্যক্ষ উক্তি ও পরোক্ষ উক্তি। উক্তি পরিবর্তনের সময় সর্বনাম, কাল ও স্থান-কালবাচক শব্দের সুনির্দিষ্ট পরিবর্তন ঘটে।',
    definitionBn: 'উক্তি (Speech / Narration / Ukti): কোনো ব্যক্তির বক্তব্য বা মনোভাব প্রকাশ করার রীতিকে উক্তি বলে। উক্তি প্রধানত দুই প্রকার:\n১. প্রত্যক্ষ উক্তি (Direct Speech): বক্তা যা বলেছেন, তা হুবহু অবিকল উদ্ধৃত চিহ্নের (" ") মধ্যে রেখে প্রকাশ করাকে প্রত্যক্ষ উক্তি বলে। যেমন: শিক্ষক বললেন, "তোমরা মন দিয়ে পড়াশোনা করো।"\n২. পরোক্ষ উক্তি (Indirect Speech): বক্তার কথাকে অবিকল উদ্ধৃত না করে তার অর্থ বা ভাব অন্যের ভাষায় প্রকাশ করাকে পরোক্ষ উক্তি বলে। এতে উদ্ধৃত চিহ্ন উঠে যায় এবং "যে" যোজক বসে। যেমন: শিক্ষক ছাত্রদের মন দিয়ে পড়াশোনা করার উপদেশ দিলেন।',
    definitionEn: 'Ukti (Narration/Speech) categorizes discourse delivery into Direct (Pratyaksha Ukti, quoting verbatim within quotation marks) and Indirect (Paroksha Ukti, paraphrased using conjunctions and shifted deictic markers).',
    explanationBn: 'প্রত্যক্ষ থেকে পরোক্ষ উক্তিতে পরিবর্তনের মৌলিক ৪টি নিয়ম:\n১. উদ্ধৃত চিহ্ন (Quotation marks) তুলে দিয়ে প্রধান খণ্ডবাক্য ও আশ্রিত খণ্ডবাক্যের মাঝে "যে" যোজক বা ভাবানুযায়ী অসমাপিকা ক্রিয়া বসাতে হয়।\n২. সর্বনাম ও পুরুষের পরিবর্তন:\n• প্রত্যক্ষ উক্তির উত্তম পুরুষ (আমি/আমরা) পরোক্ষ উক্তিতে বক্তার পুরুষানুযায়ী নাম পুরুষে (তিনি/তাঁরা/সে/তারা) পরিবর্তিত হয়।\n• প্রত্যক্ষ উক্তির মধ্যম পুরুষ (তুমি/তোমরা) পরোক্ষ উক্তিতে শ্রোতার পুরুষানুযায়ী রূপান্তরিত হয়।\n৩. ক্রিয়াপদের কাল পরিবর্তন:\nবাংলায় ইংরেজি ব্যাকরণের মতো অন্ধভাবে অতীতের পরিবর্তন ঘটে না। তবে বক্তার অতীত বক্তব্য বর্তমানে প্রকাশ করতে কাল ও ক্রিয়ার স্বাভাবিক পরিবর্তন করতে হয় (যেমন: "বলল, আমি ভাত খাব" → সে বলল যে সে ভাত খাবে)।\n৪. নৈকট্যসূচক স্থান ও কালবাচক শব্দের দূরত্বসূচক পরিবর্তন:\n• আজ → সেদিন\n• কাল (আগামীকাল) → পরদিন\n• কাল (গতকাল) → পূর্বদিন\n• এখন → তখন\n• এই → সেই\n• এখানে → সেখানে\n• আসিবে → যাইবে।',
    teacherGoldenTips: 'স্থান ও কালবাচক শব্দের রূপান্তর চার্ট মুখস্থ রাখুন:\n• আজ → সেদিন!\n• কাল (আগামী) → পরদিন!\n• কাল (অতীত) → পূর্বদিন!\n• এখন → তখন!\n• এখানে → সেখানে!\n• এই → সেই!',
    rules: [
      {
        ruleNo: 1,
        nameBn: 'উদ্ধৃত চিহ্নের অপসারণ ও সংযোজন',
        explanationBn: 'পরোক্ষ উক্তিতে কোনো উদ্ধৃত চিহ্ন বসবে না এবং বক্তব্যের ভাব স্পষ্ট করতে "যে" যোজক ব্যবহৃত হবে।',
        examples: [
          {
            bn: 'রহিম বলল, "আমি ভালো আছি" (প্রত্যক্ষ) → রহিম বলল যে সে ভালো আছে (পরোক্ষ)।',
            context: 'যোজক প্রয়োগ'
          }
        ]
      }
    ],
    formulas: [
      {
        label: 'উক্তি পরিবর্তন সমীকরণ',
        structure: 'প্রত্যক্ষ [বক্তা + উদ্ধৃতি ("আমি...")] ↔ পরোক্ষ [বক্তা + বলল যে + সে...]'
      }
    ],
    examples: [
      {
        bn: 'তিনি বললেন, "আমি আজ আসব না" (প্রত্যক্ষ)',
        context: 'প্রত্যক্ষ উক্তি'
      },
      {
        bn: 'তিনি বললেন যে তিনি সেদিন যাবেন না (পরোক্ষ)',
        context: 'পরোক্ষ উক্তি'
      }
    ],
    exceptions: [
      {
        titleBn: 'চিরন্তন সত্যের ক্ষেত্রে অপরিবর্তিত রূপ',
        descriptionBn: 'উদ্ধৃত বাক্যটি যদি চিরন্তন সত্য বা ঐতিহাসিক ঘটনা হয়, তবে পরোক্ষ উক্তিতে কালের কোনো পরিবর্তন হয় না (যেমন: শিক্ষক বললেন, "পৃথিবী গোল" → শিক্ষক বললেন যে পৃথিবী গোল)।'
      }
    ],
    commonMistakes: [
      {
        incorrectBn: 'পরোক্ষ উক্তিতে উদ্ধৃত চিহ্ন বহাল রাখা।',
        correctBn: 'পরোক্ষ উক্তিতে উদ্ধৃত চিহ্ন সম্পূর্ণ বিলুপ্ত হবে।',
        explanationBn: 'পরোক্ষ উক্তিতে কখনোই কোটেশন মার্ক ব্যবহৃত হয় না।'
      },
      {
        incorrectBn: 'তিনি বললেন যে আমি আজ স্কুলে যাব (নিজের কথা না হলেও "আমি" রাখা)।',
        correctBn: 'তিনি বললেন যে তিনি সেদিন স্কুলে যাবেন।',
        explanationBn: 'সর্বনাম বক্তার পুরুষানুযায়ী পরিবর্তিত হতে হবে।'
      }
    ],
    writtenPractice: [
      {
        id: 1,
        type: 'TRANSFORMATION',
        prompt: 'পরোক্ষ উক্তিতে রূপান্তর করো: (ক) রফিক বলল, "আমি আজ বাড়ি যাব।" (খ) শিক্ষক বললেন, "সূর্য পূর্ব দিকে ওঠে।"',
        correctAnswer: '(ক) রফিক বলল যে সে সেদিন বাড়ি যাবে। (খ) শিক্ষক বললেন যে সূর্য পূর্ব দিকে ওঠে (চিরন্তন সত্য হওয়ায় কাল অপরিবর্তিত)।',
        explanationBn: 'বোর্ড পরীক্ষার অত্যন্ত ক্লাসিক ৩ নম্বরের প্রশ্ন।'
      }
    ],
    tags: ['UKTI', 'SPEECH', 'DIRECT_SPEECH', 'INDIRECT_SPEECH', 'TRANSFORMATION', 'SSC', 'HSC'],
    status: 'PUBLISHED',
    orderIndex: 1,
    viewCount: 420
  },
  {
    id: 13102,
    chapterId: 131,
    parentTopicId: null,
    subject: 'BANGLA',
    topicNo: '৩১.২',
    titleBn: 'অর্থগত বাক্যভেদে উক্তি পরিবর্তনের বিশেষ নিয়মাবলি',
    titleEn: 'Voice Transformation Rules for Interrogative, Imperative & Optative Sentences',
    slug: 'b31-orthogoto-bakyer-ukti-poriborton',
    difficulty: 'BOARD_STANDARD',
    classLevel: 'Class 8 - 12 (SSC & HSC)',
    summaryBn: 'প্রশ্নবোধক, আদেশ-উপদেশমূলক, প্রার্থনামূলক ও বিস্ময়সূচক বাক্যের ক্ষেত্রে রিপোর্টিং ভার্ব ও যোজকের বিশেষ রূপান্তর ঘটে।',
    definitionBn: 'বাক্যভেদে উক্তি পরিবর্তন:\n১. প্রশ্নবোধক বাক্য (Interrogative): রিপোর্টিং ভার্ব "বললেন"-এর স্থলে "জিজ্ঞাসা করলেন", "জানতে চাইলেন" বা "সুধালেন" বসে। বাক্যশেষে প্রশ্নচিহ্ন উঠে গিয়ে দাঁড়ি বসে এবং "কিনা/কি না" যোগ করা হয়। যেমন: বাবা আমাকে বললেন, "তুমি কি সেখানে যাবে?" → বাবা আমি সেখানে যাব কি না তা জিজ্ঞাসা করলেন।\n২. অনুজ্ঞাসূচক বাক্য (Imperative): রিপোর্টিং ভার্ব ভাবের ওপর ভিত্তি করে "আদেশ করলেন", "উপদেশ দিলেন" বা "অনুরোধ করলেন"-এ রূপান্তরিত হয়। যেমন: শিক্ষক বললেন, "সদা সত্য কথা বলবে" → শিক্ষক সদা সত্য কথা বলার উপদেশ দিলেন।\n৩. প্রার্থনাসূচক বাক্য (Optative): রিপোর্টিং ভার্ব "প্রার্থনা করলেন" বা "ইচ্ছা প্রকাশ করলেন"-এ রূপান্তরিত হয়। যেমন: মা বললেন, "ঈশ্বর তোমার মঙ্গল করুন" → মা প্রার্থনা করলেন যে ঈশ্বর আমার মঙ্গল করুন।\n৪. বিস্ময়সূচক বাক্য (Exclamatory): রিপোর্টিং ভার্ব "আনন্দের সহিত বললেন" বা "দুঃখের সহিত বললেন"-এ পরিবর্তিত হয়। যেমন: সে বলল, "হায়! আমি সর্বস্বান্ত হলাম" → সে দুঃখের সাথে বলল যে সে সর্বস্বান্ত হয়েছে।',
    definitionEn: 'Speech reporting adapts reporting verbs conditionally to convey speech acts: asking (Jiggasha kora), commanding (Adesh dewa), entreating (Onurodh kora), or blessing (Prarthona kora).',
    explanationBn: 'বোর্ড পরীক্ষায় ১০০% কমন আসা ৩টি উক্তি রূপান্তর ট্রিক:\n১. প্রশ্নবোধক থাকলে: বললেন → জিজ্ঞাসা করলেন (প্রশ্নবোধক চিহ্ন তুলে দিয়ে সাধারণ বিবৃতি করতে হবে)।\n২. আদেশ/উপদেশ থাকলে: বললেন → উপদেশ দিলেন (অসমাপিকা ক্রিয়া যোগে বাক্যকে ছোট ও মার্জিত করা যায়; যেমন: "বই পড়ো" → বই পড়ার আদেশ দিলেন)।\n৩. "হ্যাঁ" বা "না"-সূচক উত্তরের ক্ষেত্রে: তিনি বললেন, "হ্যাঁ" → তিনি হ্যাঁ-সূচক উত্তর দিলেন / সম্মতি জানালেন। তিনি বললেন, "না" → তিনি না-সূচক উত্তর দিলেন / অসম্মতি জানালেন।',
    teacherGoldenTips: 'মাস্টার চার্ট:\n• প্রশ্ন থাকলে → জিজ্ঞাসা করলেন + কি না!\n• আদেশ/উপদেশ থাকলে → আদেশ/উপদেশ দিলেন!\n• অনুরোধ থাকলে → অনুরোধ করলেন!\n• "হ্যাঁ" থাকলে → সম্মতি জানালেন / ইতিবাচক উত্তর দিলেন!',
    rules: [
      {
        ruleNo: 1,
        nameBn: 'প্রশ্নচিহ্নের অবলুপ্তি বিধান',
        explanationBn: 'পরোক্ষ উক্তিতে রূপান্তরিত বাক্যটি সর্বদা বিবৃতিমূলক বাক্যে পরিণত হয়, তাই কোনো অবস্থাতেই প্রশ্নচিহ্ন থাকবে না।',
        examples: [
          {
            bn: 'তিনি বললেন, "তোমার নাম কী?" → তিনি আমার নাম কী তা জানতে চাইলেন।',
            context: 'প্রশ্নচিহ্ন বর্জন'
          }
        ]
      }
    ],
    formulas: [
      {
        label: 'ভাবভিত্তিক রূপান্তর ছক',
        structure: 'প্রশ্ন (জিজ্ঞাসা করলেন) | আদেশ (আদেশ দিলেন) | অনুরোধ (অনুরোধ করলেন) | বিস্ময় (বিস্ময় প্রকাশ করলেন)'
      }
    ],
    examples: [
      {
        bn: 'ডাক্তার রোগীকে বললেন, "তেলযুক্ত খাবার খাবেন না" (প্রত্যক্ষ)',
        context: 'উপদেশমূলক'
      },
      {
        bn: 'ডাক্তার রোগীকে তেলযুক্ত খাবার না খাওয়ার উপদেশ দিলেন (পরোক্ষ)',
        context: 'পরোক্ষ রূপ'
      }
    ],
    exceptions: [
      {
        titleBn: 'নাটকীয় সংলাপে নাম উল্লেখ',
        descriptionBn: 'নাটক বা দীর্ঘ সংলাপে বক্তা ও শ্রোতার পরিচয় স্পষ্ট করতে ব্র্যাকেটে নাম বা নির্দেশক পদ ব্যবহার করা যেতে পারে।'
      }
    ],
    commonMistakes: [
      {
        incorrectBn: 'তিনি আমাকে জিজ্ঞাসা করলেন যে আমি খাব কি না?',
        correctBn: 'তিনি আমাকে জিজ্ঞাসা করলেন যে আমি খাব কি না। (দাঁড়ি হবে, প্রশ্নচিহ্ন নয়)।',
        explanationBn: 'পরোক্ষ উক্তি সাধারণ বিবৃতিতে পরিণত হয়।'
      }
    ],
    writtenPractice: [
      {
        id: 1,
        type: 'TRANSFORMATION',
        prompt: 'পরোক্ষ উক্তিতে রূপান্তর করো: (ক) বাবা ছেলেকে বললেন, "মন দিয়ে পড়ো।" (খ) পথিক বলল, "স্টেশনটি কোন দিকে?"',
        correctAnswer: '(ক) বাবা ছেলেকে মন দিয়ে পড়ার উপদেশ দিলেন। (খ) পথিক স্টেশনটি কোন দিকে তা জানতে চাইল।',
        explanationBn: 'বোর্ড পরীক্ষার অত্যন্ত আকর্ষণীয় ৩ নম্বরের উক্তি রূপান্তর।'
      }
    ],
    tags: ['INTERROGATIVE_SPEECH', 'IMPERATIVE_SPEECH', 'EXCLAMATORY_SPEECH', 'SSC', 'HSC'],
    status: 'PUBLISHED',
    orderIndex: 2,
    viewCount: 440
  }
];

const CHAPTER_31_MCQS = [
  {
    id: 131001,
    chapterId: 131,
    topicId: 13101,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: 'বক্তার বক্তব্য অবিকল উদ্ধৃত চিহ্নের মধ্যে রেখে প্রকাশ করাকে কী বলে?',
    questionEn: 'What is quoting a speaker’s exact words in quotation marks called?',
    options: ['প্রত্যক্ষ উক্তি (Direct Speech)', 'পরোক্ষ উক্তি (Indirect Speech)', 'বাচ্য', 'কর্মবাচ্য'],
    correctOptionIndex: 0,
    correctAnswerText: 'প্রত্যক্ষ উক্তি (Direct Speech)',
    explanationBn: 'বক্তার বক্তব্যকে কোনো পরিবর্তন না করে হুবহু কোটেশনের মধ্যে প্রকাশ করাকে প্রত্যক্ষ উক্তি বলে।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'ঢাকা বোর্ড',
    year: 2024,
    examType: 'SSC',
    tags: ['DIRECT_SPEECH', 'DHAKA_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 131002,
    chapterId: 131,
    topicId: 13101,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: 'প্রত্যক্ষ উক্তির "আজ" শব্দটি পরোক্ষ উক্তিতে কোন শব্দে পরিবর্তিত হয়?',
    questionEn: 'Into which word does "Aj" change in indirect speech?',
    options: ['সেদিন', 'পরদিন', 'পূর্বদিন', 'তখন'],
    correctOptionIndex: 0,
    correctAnswerText: 'সেদিন',
    explanationBn: 'উক্তি পরিবর্তনের নৈকট্যবাচক শব্দের দূরত্ববাচক রূপান্তর নিয়মে "আজ" পরিবর্তিত হয়ে "সেদিন" হয়।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'রাজশাহী বোর্ড',
    year: 2023,
    examType: 'SSC',
    tags: ['AJ_SHEDIN', 'RAJSHAHI_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 131003,
    chapterId: 131,
    topicId: 13101,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: 'শিক্ষক বললেন, "সূর্য পূর্ব দিকে উদিত হয়"—এর সঠিক পরোক্ষ উক্তি কোনটি?',
    questionEn: 'What is the correct indirect speech of "Shurjo purbo dike udito hoy"?',
    options: ['শিক্ষক বললেন যে সূর্য পূর্ব দিকে উদিত হয়', 'শিক্ষক বললেন যে সূর্য পূর্ব দিকে উদিত হয়েছিল', 'শিক্ষক বললেন সূর্য সেদিন উদিত হয়েছিল', 'শিক্ষক বললেন যে সূর্য উদিত হবে'],
    correctOptionIndex: 0,
    correctAnswerText: 'শিক্ষক বললেন যে সূর্য পূর্ব দিকে উদিত হয়',
    explanationBn: 'চিরন্তন সত্য বা ঐতিহাসিক ঘটনার ক্ষেত্রে পরোক্ষ উক্তিতে কালের কোনো পরিবর্তন হয় না, হুবহু বর্তমান থাকে।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'যশোর বোর্ড',
    year: 2024,
    examType: 'SSC',
    tags: ['UNIVERSAL_TRUTH_SPEECH', 'JASHORE_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 131004,
    chapterId: 131,
    topicId: 13102,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: 'বাবা বললেন, "সদা সত্য কথা বলবে"—এর সঠিক পরোক্ষ উক্তি রূপ কোনটি?',
    questionEn: 'What is the correct indirect speech form of the imperative statement?',
    options: ['বাবা সদা সত্য কথা বলার উপদেশ দিলেন', 'বাবা বললেন যে আমি সত্য কথা বলব', 'বাবা আমাকে সত্য কথা বলতে বাধ্য করলেন', 'বাবা বললেন যে সত্য কথা বলা উচিত ছিল'],
    correctOptionIndex: 0,
    correctAnswerText: 'বাবা সদা সত্য কথা বলার উপদেশ দিলেন',
    explanationBn: 'উপদেশমূলক অনুজ্ঞার ক্ষেত্রে রিপোর্টিং ভার্ব "উপদেশ দিলেন" রূপ পরিগ্রহ করে এবং অসমাপিকা ক্রিয়া যোগে বাক্য সংকুচিত হয়।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'কুমিল্লা বোর্ড',
    year: 2023,
    examType: 'SSC',
    tags: ['IMPERATIVE_CONVERSION', 'CUMILLA_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 131005,
    chapterId: 131,
    topicId: 13102,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: 'প্রশ্নবোধক বাক্যকে পরোক্ষ উক্তিতে রূপান্তরের পর বাক্যশেষে কোন বিরামচিহ্ন বসে?',
    questionEn: 'Which punctuation mark terminates an indirect speech converted from a question?',
    options: ['দাঁড়ি (।)', 'প্রশ্নবোধক চিহ্ন (?)', 'বিস্ময়চিহ্ন (!)', 'কোলন (:)'],
    correctOptionIndex: 0,
    correctAnswerText: 'দাঁড়ি (।)',
    explanationBn: 'যেহেতু পরোক্ষ উক্তিতে বাক্যটি সাধারণ বিবৃতিমূলক বাক্যে রূপান্তরিত হয়, তাই বাক্যশেষে প্রশ্নচিহ্নের স্থলে অবশ্যই দাঁড়ি (।) বসবে।',
    difficulty: 'MEDIUM',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'চট্টগ্রাম বোর্ড',
    year: 2024,
    examType: 'SSC',
    tags: ['PUNCTUATION_RULE', 'CHITTAGONG_BOARD'],
    status: 'ACTIVE'
  }
];

const CHAPTER_31_MODEL_TEST = {
  id: 13101,
  subject: 'BANGLA',
  chapterId: 131,
  testTitleBn: 'অধ্যায় ৩১ মডেল টেস্ট: উক্তি পরিবর্তন',
  testTitleEn: 'Chapter 31 Model Test: Direct & Indirect Speech Transformation',
  descriptionBn: 'প্রত্যক্ষ উক্তি, পরোক্ষ উক্তি, সর্বনাম ও কাল পরিবর্তন এবং অর্থগত বাক্যের উক্তি রূপান্তরের ওপর পূর্ণাঙ্গ মডেল টেস্ট।',
  durationMinutes: 10,
  totalMarks: 5,
  passPercentage: 60,
  difficulty: 'MEDIUM',
  questionCount: 5,
  questionIds: [131001, 131002, 131003, 131004, 131005],
  status: 'PUBLISHED'
};

// ============================================================================
// CHAPTER 32: বাক্য সংকোচন / বাক্য সংক্ষেপণ (Sentence Contraction)
// ============================================================================
const CHAPTER_32_TOPICS = [
  {
    id: 13201,
    chapterId: 132,
    parentTopicId: null,
    subject: 'BANGLA',
    topicNo: '৩২.১',
    titleBn: 'বাক্য সংকোচনের সংজ্ঞা, প্রয়োজনীয়তা ও বাক্য সংক্ষেপণের মূলনীতি',
    titleEn: 'Definition, Significance & Principles of Sentence Contraction',
    slug: 'b32-bakyo-shongkochon-moulik-dharona',
    difficulty: 'BOARD_STANDARD',
    classLevel: 'Class 8 - 12 (SSC & HSC)',
    summaryBn: 'একাধিক পদ বা একটি দীর্ঘ বাক্যাংশকে অর্থ অপরিবর্তিত রেখে একটিমাত্র পদে প্রকাশ করার ব্যাকরণিক প্রক্রিয়াকে বাক্য সংকোচন বলে।',
    definitionBn: 'বাক্য সংকোচন (Sentence Contraction / Condensation): বক্তব্যকে সংক্ষিপ্ত, সংহত, আকর্ষণীয় ও শ্রুতিমধুর করার উদ্দেশ্যে কোনো দীর্ঘ বাক্যাংশ বা বাক্যকে অর্থ অবিকৃত রেখে একটিমাত্র পদে রূপান্তর করার পদ্ধতিকে বাক্য সংকোচন বা বাক্য সংক্ষেপণ বলে। যেমন: "যার উপস্থিত বুদ্ধি আছে" = প্রত্যুৎপন্নমতি; "অক্ষির অগোচরে" = পরোক্ষ। বাক্য সংকোচনের প্রধান উদ্দেশ্য ৩টি: ১. সংক্ষেপণ ও প্রাঞ্জলতা বৃদ্ধি ২. ধ্বনিমাধুর্য সৃষ্টি ৩. বক্তব্যকে সুদৃঢ় ও প্রকাশক্ষম করে তোলা।',
    definitionEn: 'Sentence Contraction (Bakyo Shongkochon) is the morphological and syntactic condensation of an entire dependent clause or phrase into a single synthetic word without semantic loss.',
    explanationBn: 'বাক্য সংকোচনের মূল ব্যাকরণিক কৌশল:\nবাংলা ভাষায় বাক্য সংকোচন প্রধানত ৪টি ব্যাকরণিক প্রক্রিয়ায় সাধিত হয়:\n১. প্রত্যয় যোগের মাধ্যমে: যিনি ইতিহাস রচনা করেন = ঐতিহাসিক; সেবা করার ইচ্ছা = শুশ্রূষা।\n২. সমাস সাধনের মাধ্যমে: নদী মাতা যার = নদীমাতৃক; পঙ্কে জন্মে যা = পঙ্কজ।\n৩. উপসর্গ ও সন্ধির মাধ্যমে: যা সহজে অতিক্রম করা যায় না = দুরতিক্রম্য; যার উপায় নেই = নিরুপায়।\n৪. ভাববাচক বিশেষ্যের মাধ্যমে: আপনাকে যে বড় মনে করে = গরিমাচ্ছন্ন; যা পূর্বে ঘটেনি = অভূতপূর্ব।\nবাক্য সংকোচন বনাম এক কথায় প্রকাশ:\nব্যবহারিক ক্ষেত্রে দুটিকে সমার্থক ধরা হলেও সূক্ষ্ম বিচারে বাক্য সংকোচন মূলত দীর্ঘ বাক্যাংশের কাঠামোগত সংক্ষেপণ, আর এক কথায় প্রকাশ কোনো বিশিষ্ট সত্ত্বা বা ধারণার নামবাচক একক নির্ধারণ।',
    teacherGoldenTips: 'বোর্ড পরীক্ষায় নিশ্চিত কমন আসা শীর্ষ ১০টি বাক্য সংকোচন:\n১. যার উপস্থিত বুদ্ধি আছে = প্রত্যুৎপন্নমতি!\n২. আপনাকে যে পণ্ডিত মনে করে = পণ্ডিতম্মন্য!\n৩. অক্ষির সম্মুখে বর্তমান = প্রত্যক্ষ!\n৪. অক্ষির অগোচরে = পরোক্ষ!\n৫. যা পূর্বে দেখা যায়নি = অদৃষ্টপূর্ব!\n৬. যা পূর্বে ঘটেনি = অভূতপূর্ব!\n৭. যা বলা হয়নি = অনুক্ত!\n৮. যা চিরস্থায়ী নয় = নশ্বর!\n৯. যা সহজে নিবারণ করা যায় না = দুর্নিবার!\n১০. যে বিষয়ে কোনো বিতর্ক নেই = অবিসংবাদী!',
    rules: [
      {
        ruleNo: 1,
        nameBn: 'অর্থগত অবিকৃতির বিধান',
        explanationBn: 'বাক্য সংকোচনে দীর্ঘ বাক্যাংশের মূল ভাব ও ব্যাকরণিক বিশেষ্য/বিশেষণ মর্যাদা ১০০% অক্ষুণ্ণ থাকতে হবে।',
        examples: [
          {
            bn: 'যার উপস্থিত বুদ্ধি আছে (গুণবাচক বিশেষণ) = প্রত্যুৎপন্নমতি (বিশেষণ)।',
            context: 'পদমর্যাদা রক্ষা'
          }
        ]
      }
    ],
    formulas: [
      {
        label: 'বাক্য সংকোচন সমীকরণ',
        structure: 'দীর্ঘ বাক্যাংশ (বর্ণনামূলক) ↔ একক সুসংহত পদ (প্রত্যয়/সমাসজাত)'
      }
    ],
    examples: [
      {
        bn: 'যার কোনো উপায় নেই = নিরুপায়',
        context: 'উপসর্গজাত'
      },
      {
        bn: 'যা বলা হয়নি = অনুক্ত',
        context: 'প্রত্যয়জাত'
      }
    ],
    exceptions: [
      {
        titleBn: 'প্রসঙ্গভেদে রূপান্তর ভিন্নতা',
        descriptionBn: '"মৃতের মতো অবস্থা যার" = মুমূর্ষু (ব্যক্তি); "মরণাপন্ন অবস্থা" = মুমূর্ষু দশা।'
      }
    ],
    commonMistakes: [
      {
        incorrectBn: 'প্রত্যুৎপন্নমতি বানান ভুল করা (প্রত্যুতপন্নমতি ❌)।',
        correctBn: 'প্রত্যুৎপন্নমতি (প্র + ত্যুৎ + পন্ন + মতি)।',
        explanationBn: 'বোর্ড পরীক্ষায় অত্যন্ত সংবেদনশীল বানান।'
      }
    ],
    writtenPractice: [
      {
        id: 1,
        type: 'CONTRACTION',
        prompt: 'বাক্য সংকোচন করো: (ক) যার উপস্থিত বুদ্ধি আছে (খ) আপনাকে যে পণ্ডিত মনে করে (গ) যা পূর্বে দেখা যায়নি (ঘ) অক্ষির সম্মুখে বর্তমান।',
        correctAnswer: '(ক) প্রত্যুৎপন্নমতি (খ) পণ্ডিতম্মন্য (গ) অদৃষ্টপূর্ব (ঘ) প্রত্যক্ষ।',
        explanationBn: 'বোর্ড পরীক্ষার সবচেয়ে প্রিয় ৪ নম্বরের প্রশ্ন।'
      }
    ],
    tags: ['BAKYO_SHONGKOCHON', 'CONTRACTION', 'PROTYUTPONNOMOTI', 'PONDITOMMONYO', 'SSC', 'HSC'],
    status: 'PUBLISHED',
    orderIndex: 1,
    viewCount: 460
  },
  {
    id: 13202,
    chapterId: 132,
    parentTopicId: null,
    subject: 'BANGLA',
    topicNo: '৩২.২',
    titleBn: 'বোর্ড পরীক্ষায় সর্বাধিক কমন বাক্য সংকোচন ভাণ্ডার ও প্রয়োগ',
    titleEn: 'High-Frequency Board Exam Sentence Contractions & Applications',
    slug: 'b32-board-standard-bakyo-shongkochon-corpus',
    difficulty: 'BOARD_STANDARD',
    classLevel: 'Class 8 - 12 (SSC & HSC)',
    summaryBn: 'বিসিএস, এইচএসসি ও এসএসসি পরীক্ষায় সর্বাধিক আসা বিশিষ্ট বাক্য সংকোচনসমূহের তালিকা ও ব্যাকরণিক বিশ্লেষণ।',
    definitionBn: 'গুরুত্বপূর্ণ বাক্য সংকোচন শ্রেণিবিভাগ:\n• স্বভাব ও গুণ: যা সহজে নষ্ট হয় = নশ্বর; যা দমন করা যায় না = অদম্য; যা সহজে জয় করা যায় না = দুর্জয়; যে অগ্রে জন্মগ্রহণ করেছে = অগ্রজ; যে পশ্চাতে জন্মগ্রহণ করেছে = অনুজ।\n• ইন্দ্রিয় ও দর্শন: যা চাক্ষুষ দেখা গেছে = প্রত্যক্ষ; যা পূর্বে শোনা যায়নি = অশ্রুতপূর্ব; ইতিহাস বিষয়ে অভিজ্ঞ যিনি = ইতিহাসবেত্তা; ব্যাকরণ জানেন যিনি = বৈয়াকরণ।\n• ইচ্ছা ও আকাঙ্ক্ষা: জানার ইচ্ছা = জিজ্ঞাসা; জয় করার ইচ্ছা = জিগীষা; বেঁচে থাকার ইচ্ছা = জিজীবিষা; লাভ করার ইচ্ছা = লিপ্সা; মোক্ষলাভের ইচ্ছা = মুমুক্ষা; হনন করার ইচ্ছা = জিঘাংসা।',
    definitionEn: 'A master taxonomy of contractions categorized by human volition (desires), sensory experiences, ethical faculties, and ontological states.',
    explanationBn: 'ইচ্ছাবাচক বাক্য সংকোচনের গোল্ডেন টেবিল (পরীক্ষায় সবচেয়ে বেশি ভুল হওয়া অংশ):\n১. জানার ইচ্ছা = জিজ্ঞাসা (জানতে ইচ্ছুক = জিজ্ঞাসু)\n২. বেঁচে থাকার ইচ্ছা = জিজীবিষা (বেঁচে থাকতে ইচ্ছুক = জিজীবিষু)\n৩. জয় করার ইচ্ছা = জিগীষা (জয় করতে ইচ্ছুক = জিগীষু)\n৪. হনন বা হত্যা করার ইচ্ছা = জিঘাংসা (হত্যা করতে ইচ্ছুক = জিঘাংসু)\n৫. মুক্তি পাওয়ার ইচ্ছা = মুমুক্ষা (মুক্তি পেতে ইচ্ছুক = মুমুক্ষু)\n৬. অপকার করার ইচ্ছা = অপচিকীর্ষা\n৭. সেবা করার ইচ্ছা = শুশ্রূষা।\nমনে রাখবেন: শেষে "আ" কার থাকলে "ইচ্ছা" (বিশেষ্য পদ); আর শেষে "উ" কার থাকলে "ইচ্ছুক ব্যক্তি" (বিশেষণ পদ)! যেমন: জানার ইচ্ছা = জিজ্ঞাসা; জানতে ইচ্ছুক যে = জিজ্ঞাসু।',
    teacherGoldenTips: 'ম্যাজিক ফর্মুলা (আ বনাম উ):\n• ইচ্ছা = শেষে "আ" কার (জিজ্ঞাসা, জিজীবিষা, জিগীষা)!\n• ইচ্ছুক ব্যক্তি = শেষে "উ" কার (জিজ্ঞাসু, জিজীবিষু, জিগীষু)! এই সহজ নিয়মে ১ নম্বর নিশ্চিত!',
    rules: [
      {
        ruleNo: 1,
        nameBn: 'ইচ্ছা বনাম ইচ্ছুক রূপভেদ বিধান',
        explanationBn: 'ইচ্ছা প্রকাশ করলে ভাববাচক বিশেষ্য (-আ প্রত্যয়ান্ত) এবং ইচ্ছুক ব্যক্তি নির্দেশ করলে গুণবাচক বিশেষণ (-উ প্রত্যয়ান্ত) পদ হবে।',
        examples: [
          {
            bn: 'বেঁচে থাকার ইচ্ছা = জিজীবিষা; বেঁচে থাকার ইচ্ছুক যে = জিজীবিষু।',
            context: 'ইচ্ছা বনাম ইচ্ছুক'
          }
        ]
      }
    ],
    formulas: [
      {
        label: 'ইচ্ছাবাচক সূত্র',
        structure: 'ইচ্ছা = জিজ্ঞাসা / জিজীবিষা / জিগীষা | ইচ্ছুক ব্যক্তি = জিজ্ঞাসু / জিজীবিষু / জিগীষু'
      }
    ],
    examples: [
      {
        bn: 'বেঁচে থাকার ইচ্ছা মানুষের স্বভাবজাত (জিজীবিষা)',
        context: 'জিজীবিষা'
      },
      {
        bn: 'তিনি সত্য জানার বিষয়ে জিজ্ঞাসু (জিজ্ঞাসু)',
        context: 'জিজ্ঞাসু'
      }
    ],
    exceptions: [
      {
        titleBn: 'শুশ্রূষা শব্দের ব্যুৎপত্তি',
        descriptionBn: 'শুনতে ইচ্ছা থেকে মূলত শুশ্রূষা শব্দের উৎপত্তি, কিন্তু প্রচলিত অর্থে এর রূপ হলো "রোগীর সেবা করা"।'
      }
    ],
    commonMistakes: [
      {
        incorrectBn: 'বেঁচে থাকার ইচ্ছা = জিজীবিষু (উ-কার দিয়ে লেখা)।',
        correctBn: 'বেঁচে থাকার ইচ্ছা = জিজীবিষা (আ-কার হবে)।',
        explanationBn: 'ইচ্ছা হলো বিশেষ্য, তাই আ-কার যুক্ত হবে।'
      }
    ],
    writtenPractice: [
      {
        id: 1,
        type: 'CONTRACTION',
        prompt: 'এক শব্দে প্রকাশ করো: (ক) বেঁচে থাকার ইচ্ছা (খ) জয় করার ইচ্ছা (গ) হত্যা করার ইচ্ছা (ঘ) জানার ইচ্ছা।',
        correctAnswer: '(ক) জিজীবিষা (খ) জিগীষা (গ) জিঘাংসা (ঘ) জিজ্ঞাসা।',
        explanationBn: 'বোর্ড পরীক্ষার নিশ্চিত ৪ নম্বরের ইচ্ছাবাচক সংক্ষেপণ।'
      }
    ],
    tags: ['JIJIBISHA', 'JIGISHA', 'JIGHANGSHA', 'JIGGASHA', 'DESIRE_TERMS', 'SSC', 'HSC'],
    status: 'PUBLISHED',
    orderIndex: 2,
    viewCount: 480
  }
];

const CHAPTER_32_MCQS = [
  {
    id: 132001,
    chapterId: 132,
    topicId: 13201,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: '"যার উপস্থিত বুদ্ধি আছে"—এক কথায় কী হবে?',
    questionEn: 'What is the one-word contraction for "one who has ready wit"?',
    options: ['প্রত্যুৎপন্নমতি', 'বুদ্ধিমান', 'পণ্ডিতম্মন্য', 'মেধাবী'],
    correctOptionIndex: 0,
    correctAnswerText: 'প্রত্যুৎপন্নমতি',
    explanationBn: 'যার তাৎক্ষণিক বা উপস্থিত বুদ্ধি প্রখর, তাকে ব্যাকরণে "প্রত্যুৎপন্নমতি" বলে।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'ঢাকা বোর্ড',
    year: 2024,
    examType: 'SSC',
    tags: ['PROTYUTPONNOMOTI', 'DHAKA_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 132002,
    chapterId: 132,
    topicId: 13201,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: '"আপনাকে যে পণ্ডিত মনে করে"—এর বাক্য সংকোচন কোনটি?',
    questionEn: 'What is the contraction for "one who considers himself a scholar"?',
    options: ['পণ্ডিতম্মন্য', 'পণ্ডিত', 'বিজ্ঞানী', 'বিদ্বান'],
    correctOptionIndex: 0,
    correctAnswerText: 'পণ্ডিতম্মন্য',
    explanationBn: 'যে ব্যক্তি আত্মঅহমিকায় নিজেকে নিজে পণ্ডিত মনে করে তাকে "পণ্ডিতম্মন্য" বলে।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'রাজশাহী বোর্ড',
    year: 2023,
    examType: 'SSC',
    tags: ['PONDITOMMONYO', 'RAJSHAHI_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 132003,
    chapterId: 132,
    topicId: 13202,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: '"বেঁচে থাকার ইচ্ছা"—এক কথায় কী হবে?',
    questionEn: 'What is the one-word contraction for "desire to live"?',
    options: ['জিজীবিষা', 'জিজীবিষু', 'জিগীষা', 'জিজ্ঞাসা'],
    correctOptionIndex: 0,
    correctAnswerText: 'জিজীবিষা',
    explanationBn: 'বেঁচে থাকার ইচ্ছাকে "জিজীবিষা" বলে (আর বেঁচে থাকতে ইচ্ছুক ব্যক্তিকে "জিজীবিষু" বলে)।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'যশোর বোর্ড',
    year: 2024,
    examType: 'SSC',
    tags: ['JIJIBISHA', 'JASHORE_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 132004,
    chapterId: 132,
    topicId: 13201,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: '"যা পূর্বে দেখা যায়নি"—এর বাক্য সংকোচন কোনটি?',
    questionEn: 'What is the contraction for "that which has not been seen before"?',
    options: ['অদৃষ্টপূর্ব', 'অভূতপূর্ব', 'অশ্রুতপূর্ব', 'অপূর্ব'],
    correctOptionIndex: 0,
    correctAnswerText: 'অদৃষ্টপূর্ব',
    explanationBn: 'যা পূর্বে দেখা যায়নি = অদৃষ্টপূর্ব (আর যা পূর্বে ঘটেনি = অভূতপূর্ব; যা পূর্বে শোনা যায়নি = অশ্রুতপূর্ব)।',
    difficulty: 'MEDIUM',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'কুমিল্লা বোর্ড',
    year: 2023,
    examType: 'SSC',
    tags: ['ODRISHTOPURBO', 'CUMILLA_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 132005,
    chapterId: 132,
    topicId: 13202,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: '"হনন বা হত্যা করার ইচ্ছা"—এক কথায় কী হবে?',
    questionEn: 'What is the one-word contraction for "desire to kill"?',
    options: ['জিঘাংসা', 'জিগীষা', 'লিপ্সা', 'জিজ্ঞাসা'],
    correctOptionIndex: 0,
    correctAnswerText: 'জিঘাংসা',
    explanationBn: 'কাউকে হত্যা বা বিনাশ করার ইচ্ছাকে ব্যাকরণে "জিঘাংসা" বলে।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'চট্টগ্রাম বোর্ড',
    year: 2024,
    examType: 'SSC',
    tags: ['JIGHANGSHA', 'CHITTAGONG_BOARD'],
    status: 'ACTIVE'
  }
];

const CHAPTER_32_MODEL_TEST = {
  id: 13201,
  subject: 'BANGLA',
  chapterId: 132,
  testTitleBn: 'অধ্যায় ৩২ মডেল টেস্ট: বাক্য সংকোচন',
  testTitleEn: 'Chapter 32 Model Test: Sentence Contraction (Bakyo Shongkochon)',
  descriptionBn: 'উপস্থিত বুদ্ধি, ইচ্ছাবাচক শব্দাবলী, দর্শন ও ইন্দ্রিয়গ্রাহ্য শীর্ষ ৫০টি বাক্য সংকোচনের ওপর পূর্ণাঙ্গ মডেল টেস্ট।',
  durationMinutes: 10,
  totalMarks: 5,
  passPercentage: 60,
  difficulty: 'MEDIUM',
  questionCount: 5,
  questionIds: [132001, 132002, 132003, 132004, 132005],
  status: 'PUBLISHED'
};

// ============================================================================
// CHAPTER 33: বাগধারা ও প্রবাদ-প্রবচন (Idioms & Proverbs)
// ============================================================================
const CHAPTER_33_TOPICS = [
  {
    id: 13301,
    chapterId: 133,
    parentTopicId: null,
    subject: 'BANGLA',
    topicNo: '৩৩.১',
    titleBn: 'বাগধারার সংজ্ঞা, বৈশিষ্ট্য এবং আক্ষরিক বনাম রূপক অর্থ',
    titleEn: 'Definition, Characteristics & Literal vs Figurative Meanings of Idioms',
    slug: 'b33-bagdhara-shongpga-o-boishishto',
    difficulty: 'BOARD_STANDARD',
    classLevel: 'Class 8 - 12 (SSC & HSC)',
    summaryBn: 'কোনো শব্দ বা শব্দগুচ্ছ তার আক্ষরিক অর্থ প্রকাশ না করে যখন বিশেষ কোনো রূপক অর্থ প্রকাশ করে, তখন তাকে বাগধারা (Idiom) বলে।',
    definitionBn: 'বাগধারা (Idiom / Bagdhara): যে সকল শব্দগুচ্ছ আভিধানিক বা আক্ষরিক অর্থ পরিত্যাগ করে বিশেষ কোনো বিশিষ্ট বা অন্তর্নিহিত রূপক অর্থ প্রকাশ করে, তাদের বাগধারা বা বাক্যরীতি বলে। যেমন: "অকাল কুষ্মাণ্ড"—এর আক্ষরিক অর্থ অকালে জন্মানো কুমড়ো, কিন্তু এর বাগধারাগত অর্থ "অপদার্থ বা অকেজো ব্যক্তি"। বাগধারার প্রধান বৈশিষ্ট্য: ১. আক্ষরিক অর্থের পরিবর্তন ২. অপরিবর্তনীয় রূপ (শব্দ পরিবর্তন নিষিদ্ধ; যেমন: "অরণ্যে রোদন"-এর স্থলে "বনে কান্না" লেখা যাবে না) ৩. ভাষার ঐতিহ্য ও সাংস্কৃতিক মূল্যবোধের প্রতীক।',
    definitionEn: 'An Idiom (Bagdhara) is a frozen phrasal expression whose composite figurative meaning cannot be deduced from the literal denotations of its individual lexical components.',
    explanationBn: 'আক্ষরিক অর্থ বনাম বাগধারাগত ভাবার্থের চমৎকার পার্থক্য:\n১. "অগাধ জলের মাছ": আক্ষরিক অর্থ অনেক গভীর জলের মাছ; ভাবার্থ = "অত্যন্ত চালাক বা গভীর প্রকৃতির লোক"।\n২. "অমাবস্যার চাঁদ": আক্ষরিক অর্থ অমাবস্যার রাতের চাঁদ; ভাবার্থ = "অত্যন্ত দুর্লভ বস্তু"।\n৩. "একাদশে বৃহস্পতি": জ্যোতিষশাস্ত্রে একাদশ স্থানে বৃহস্পতির অবস্থান; ভাবার্থ = "তুঙ্গ সৌভাগ্যের বিষয় বা সুসময়"।\n৪. "বিড়াল তপস্বী": বিড়ালের মতো চোখ বুজে বসে থাকা; ভাবার্থ = "ভণ্ড সাধু বা কপট ধার্মিক"।\n৫. "সাক্ষী গোপাল": গোপালের মূর্তি সাক্ষী থাকা; ভাবার্থ = "নিষ্ক্রিয় দর্শক যার কোনো ভূমিকা নেই"।\nবাগধারার অপরিবর্তনীয়তা:\nবাগধারায় ব্যবহৃত শব্দগুলোর কোনো সমার্থক শব্দ বসানো যায় না। যেমন: "আকাশ কুসুম"-কে "গগন কুসুম" বললে বাগধারার ব্যাকরণিক মর্যাদা নষ্ট হয়ে যায়।',
    teacherGoldenTips: 'গোল্ডেন রুল: বাগধারা হলো পাকা সিমেন্ট বাঁধানো বাক্যাংশ! এর একটা শব্দও বদলানো যায় না! "অরণ্যে রোদন"-কে "জঙ্গলে ক্রন্দন" লিখলে শূন্য পাবেন! আক্ষরিক অর্থ বাদ দিয়ে রূপক অন্তর্নিহিত ভাবার্থ ধরতে হবে!',
    rules: [
      {
        ruleNo: 1,
        nameBn: 'শব্দ প্রতিস্থাপন নিষিদ্ধতার নিয়ম',
        explanationBn: 'বাগধারায় ব্যবহৃত কোনো একক শব্দের স্থলে তার সমার্থক শব্দ বসানো সম্পূর্ণ অবৈধ।',
        examples: [
          {
            bn: 'অরণ্যে রোদন (শুদ্ধ); বনে ক্রন্দন (ভুল ❌)।',
            context: 'অপরিবর্তনীয় কাঠামো'
          }
        ]
      }
    ],
    formulas: [
      {
        label: 'বাগধারা রূপান্তর সমীকরণ',
        structure: 'আক্ষরিক অর্থ (Literal) → রূপক সাংস্কৃতিক ভাবার্থ (Idiomatic Meaning)'
      }
    ],
    examples: [
      {
        bn: 'অমাবস্যার চাঁদ = দুর্লভ বস্তু (আকাশের চাঁদ নয়)',
        context: 'রূপক অর্থ'
      },
      {
        bn: 'ডুমুরের ফুল = অদৃশ্য বস্তু',
        context: 'রূপক অর্থ'
      }
    ],
    exceptions: [
      {
        titleBn: 'সমার্থক বাগধারা জোড়',
        descriptionBn: 'আলাদা আলাদা বাগধারা হওয়া সত্ত্বেও একাধিক বাগধারা হুবহু একই অর্থ প্রকাশ করতে পারে (যেমন: অমাবস্যার চাঁদ = ডুমুরের ফুল = দুর্লভ বস্তু; অকাল কুষ্মাণ্ড = গোবর গণেশ = অপদার্থ)।'
      }
    ],
    commonMistakes: [
      {
        incorrectBn: '"বিড়াল তপস্বী" অর্থ যে বিড়াল তপস্যা করে।',
        correctBn: 'বিড়াল তপস্বী অর্থ ভণ্ড সাধু বা কপট ধার্মিক।',
        explanationBn: 'বাগধারায় রূপক অর্থ গ্রহণ করতে হয়।'
      }
    ],
    writtenPractice: [
      {
        id: 1,
        type: 'DEFINITION',
        prompt: 'বাগধারা কাকে বলে? "অগাধ জলের মাছ" ও "সাক্ষী গোপাল" বাগধারা দুটির অর্থ লিখে বাক্যে প্রয়োগ করো।',
        correctAnswer: 'যে শব্দগুচ্ছ আক্ষরিক অর্থ প্রকাশ না করে বিশেষ রূপক অর্থ প্রকাশ করে, তাকে বাগধারা বলে। ১. অগাধ জলের মাছ (খুব চালাক লোক): শান্তশিষ্ট দেখালে কী হবে, লোকটা আসলে অগাধ জলের মাছ। ২. সাক্ষী গোপাল (নিষ্ক্রিয় দর্শক): সভায় সাক্ষী গোপাল হয়ে বসে না থেকে অন্যায়ের প্রতিবাদ করো।',
        explanationBn: 'বোর্ড পরীক্ষার অত্যন্ত আকর্ষণীয় ৪ নম্বরের প্রশ্ন।'
      }
    ],
    tags: ['BAGDHARA', 'IDIOMS', 'FIGURATIVE_MEANING', 'LITERAL_VS_IDIOM', 'SSC', 'HSC'],
    status: 'PUBLISHED',
    orderIndex: 1,
    viewCount: 470
  },
  {
    id: 13302,
    chapterId: 133,
    parentTopicId: null,
    subject: 'BANGLA',
    topicNo: '৩৩.২',
    titleBn: 'বোর্ড পরীক্ষায় সর্বাধিক কমন ৫০টি বাগধারা: অর্থ ও বাক্যে প্রয়োগ',
    titleEn: 'Top 50 High-Yield Board Exam Idioms with Meanings & Sentences',
    slug: 'b33-top-50-board-idioms-corpus',
    difficulty: 'BOARD_STANDARD',
    classLevel: 'Class 8 - 12 (SSC & HSC)',
    summaryBn: 'এসএসসি, এইচএসসি ও বিসিএস পরীক্ষার জন্য নির্বাচিত ৫০টি সর্বাধিক গুরুত্বপূর্ণ বাগধারা, প্রমিত অর্থ ও বাক্যরচনা।',
    definitionBn: 'নির্বাচিত বাগধারা ভাণ্ডার:\n• ভাগ্য ও সুযোগ: একাদশে বৃহস্পতি (সৌভাগ্যের বিষয়); আট কপালে (হতভাগ্য); ইঁদুর কপালে (নিতান্ত দুর্ভাগ্য); কপাল ফেরা (সৌভাগ্য লাভ)।\n• ব্যক্তিত্ব ও চরিত্র: অকাল কুষ্মাণ্ড (অপদার্থ); কূপমণ্ডূক (সীমাবদ্ধ জ্ঞানসম্পন্ন); চিনে জোঁক (নাছোড়বান্দা); গোঁফ খেজুরে (নিতান্ত অলস); ঢাকের কাঠি (তোষামুদে); রুই-কাতলা (প্রভাবশালী ব্যক্তি); ভিজে বেড়াল (কপট ব্যক্তি)।\n• আচরণ ও অবস্থা: আকাশ কুসুম (অসম্ভব কল্পনা); উত্তম মধ্যম (প্রহার বা মারধর); উলো বনে মুক্তা ছড়ানো (অপাত্রে দান); কাঠের পুতুল (নির্জীব); তীর্থের কাক (প্রতীক্ষারত ব্যক্তি); তাসের ঘর (ক্ষণস্থায়ী বস্তু)।',
    definitionEn: 'An essential corpus of high-yield Bengali idioms classified by thematic clusters: Fortune, Character Traits, and Behavioral States.',
    explanationBn: 'বোর্ড পরীক্ষায় বারবার আসা জোড়া সমার্থক বাগধারা:\n১. "দুর্লভ বস্তু" অর্থে:\n• অমাবস্যার চাঁদ\n• ডুমুরের ফুল\n২. "অপদার্থ বা অকেজো" অর্থে:\n• অকাল কুষ্মাণ্ড\n• গোবর গণেশ\n• কাঁচা পয়সা\n৩. "হতভাগ্য" অর্থে:\n• আট কপালে\n• ইঁদুর কপালে\n৪. "ক্ষণস্থায়ী বস্তু" অর্থে:\n• তাসের ঘর\n• বালির বাঁধ\n• পদ্মপাতার জল\n৫. "শত্রুতা" অর্থে:\n• দা-কুমড়া সম্বন্ধ\n• অহিনকুল সম্বন্ধ\n• সাপে-নেউলে সম্পর্ক।\nবাক্য রচনার সময় বাগধারার রূপক অর্থ যাতে প্রাসঙ্গিকভাবে চমৎকার ফুটে ওঠে তা নিশ্চিত করতে হবে।',
    teacherGoldenTips: 'গোল্ডেন টেবিল:\n• তাসের ঘর / পদ্মপাতার জল = ক্ষণস্থায়ী!\n• দা-কুমড়া / সাপে-নেউলে = ভীষণ শত্রুতা!\n• অমাবস্যার চাঁদ / ডুমুরের ফুল = দুর্লভ বস্তু!\n• গোঁফ খেজুরে = চূড়ান্ত অলস ব্যক্তি!',
    rules: [
      {
        ruleNo: 1,
        nameBn: 'বাক্য প্রয়োগে অর্থের সংগতি রক্ষা',
        explanationBn: 'বাক্যে বাগধারা প্রয়োগ করার সময় শুধু বাগধারাটি লিখলেই হবে না, বাক্যের সার্বিক প্রেক্ষাপটে তার অর্থটি যেন স্বতঃস্ফূর্তভাবে প্রতিভাত হয়।',
        examples: [
          {
            bn: 'পরীক্ষার আর মাত্র দুদিন বাকি, এখন পড়াশোনা না করে আকাশ কুসুম কল্পনা করে লাভ নেই।',
            context: 'সার্থক বাক্য প্রয়োগ'
          }
        ]
      }
    ],
    formulas: [
      {
        label: 'সমার্থক বাগধারা সমীকরণ',
        structure: 'অমাবস্যার চাঁদ = ডুমুরের ফুল | তাসের ঘর = পদ্মপাতার জল | দা-কুমড়া = সাপে-নেউলে'
      }
    ],
    examples: [
      {
        bn: 'তার অহংকার তাসের ঘরের মতো ভেঙে পড়ল (ক্ষণস্থায়ী)',
        context: 'তাসের ঘর'
      },
      {
        bn: 'অফিসে এমন ঢাকের কাঠির অভাব নেই (তোষামুদে)',
        context: 'ঢাকের কাঠি'
      }
    ],
    exceptions: [
      {
        titleBn: 'প্রবাদ বনাম বাগধারা',
        descriptionBn: 'বাগধারা বাক্যের একটি অংশ মাত্র (Phrase), কিন্তু প্রবাদ-প্রবচন একটি সম্পূর্ণ স্বয়ংসম্পূর্ণ উপদেশমূলক বাক্য (Proverb; যেমন: "চোরের দশ দিন তো গৃহস্থের এক দিন")।'
      }
    ],
    commonMistakes: [
      {
        incorrectBn: 'গোঁফ খেজুরে অর্থ যার গোঁফে খেজুর লেগে থাকে।',
        correctBn: 'গোঁফ খেজুরে অর্থ নিতান্ত অলস ব্যক্তি।',
        explanationBn: 'বাগধারা রূপক অর্থ বহন করে।'
      }
    ],
    writtenPractice: [
      {
        id: 1,
        type: 'IDIOM_APPLICATION',
        prompt: 'অর্থসহ বাক্য রচনা করো: (ক) ডুমুরের ফুল (খ) তাসের ঘর (গ) গোঁফ খেজুরে (ঘ) দা-কুমড়া।',
        correctAnswer: '(ক) ডুমুরের ফুল (দুর্লভ বস্তু): তুমি তো চাকুরি পেয়ে ডুমুরের ফুল হয়ে গেছ, দেখাই মেলে না। (খ) তাসের ঘর (ক্ষণস্থায়ী): অসৎ উপায়ে অর্জিত সম্পদ তাসের ঘরের মতো ধ্বংস হয়। (গ) গোঁফ খেজুরে (নিতান্ত অলস): এমন গোঁফ খেজুরে ছেলেকে দিয়ে কোনো কাজ হবে না। (ঘ) দা-কুমড়া (ভীষণ শত্রুতা): দুই ভাইয়ের মধ্যে এখন দা-কুমড়া সম্বন্ধ।',
        explanationBn: 'বোর্ড পরীক্ষার অত্যন্ত ক্লাসিক ৪ নম্বরের প্রশ্ন।'
      }
    ],
    tags: ['DUMURER_FUL', 'TASHER_GHOR', 'GONF_KHEJURE', 'DA_KUMRA', 'TOP_IDIOMS', 'SSC', 'HSC'],
    status: 'PUBLISHED',
    orderIndex: 2,
    viewCount: 490
  }
];

const CHAPTER_33_MCQS = [
  {
    id: 133001,
    chapterId: 133,
    topicId: 13301,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: '"অমাবস্যার চাঁদ" বাগধারাটির সঠিক অর্থ কোনটি?',
    questionEn: 'What is the correct meaning of the idiom "Amabashyar Chand"?',
    options: ['দুর্লভ বস্তু', 'অদৃষ্টপূর্ব', 'অমূল্য সম্পদ', 'অন্ধকার রাত'],
    correctOptionIndex: 0,
    correctAnswerText: 'দুর্লভ বস্তু',
    explanationBn: '"অমাবস্যার চাঁদ" ও "ডুমুরের ফুল" উভয়েরই বাগধারাগত অর্থ হলো "দুর্লভ বস্তু" বা যা সহজে দেখা যায় না।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'ঢাকা বোর্ড',
    year: 2024,
    examType: 'SSC',
    tags: ['AMABASHYAR_CHAND', 'DHAKA_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 133002,
    chapterId: 133,
    topicId: 13302,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: '"বিড়াল তপস্বী" বাগধারাটির প্রকৃত অর্থ কী?',
    questionEn: 'What is the actual meaning of the idiom "Biral Tapaswi"?',
    options: ['ভণ্ড সাধু বা কপট ধার্মিক', 'বিড়ালের স্বভাব', 'ধার্মিক ব্যক্তি', 'শান্তশিষ্ট জীব'],
    correctOptionIndex: 0,
    correctAnswerText: 'ভণ্ড সাধু বা কপট ধার্মিক',
    explanationBn: 'বাহিরে সাধুর বেশ ধারণ করে অন্তরে অসৎ মনোভাব পোষণকারী ব্যক্তিকে "বিড়াল তপস্বী" বলা হয়।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'রাজশাহী বোর্ড',
    year: 2023,
    examType: 'SSC',
    tags: ['BIRAL_TAPASWI', 'RAJSHAHI_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 133003,
    chapterId: 133,
    topicId: 13302,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: '"গোঁফ খেজুরে" বাগধারাটি কোন অর্থে প্রযুক্ত হয়?',
    questionEn: 'In what sense is the idiom "Gonf Khejure" used?',
    options: ['নিতান্ত অলস ব্যক্তি', 'খেজুরপ্রিয় মানুষ', 'চালাক ব্যক্তি', 'শৌখিন পুরুষ'],
    correctOptionIndex: 0,
    correctAnswerText: 'নিতান্ত অলস ব্যক্তি',
    explanationBn: 'যিনি অতিশয় অলস এবং মুখের কাছে খাবার থাকলেও নিজে হাত বাড়িয়ে খান না, তাকে "গোঁফ খেজুরে" বলে।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'যশোর বোর্ড',
    year: 2024,
    examType: 'SSC',
    tags: ['GONF_KHEJURE', 'JASHORE_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 133004,
    chapterId: 133,
    topicId: 13302,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: 'নিচের কোন বাগধারা জোড়াটি সমার্থক অর্থ প্রকাশ করে?',
    questionEn: 'Which pair of idioms conveys identical meaning?',
    options: ['দা-কুমড়া ও সাপে-নেউলে', 'একাদশে বৃহস্পতি ও আট কপালে', 'অকাল কুষ্মাণ্ড ও রুই-কাতলা', 'বিড়াল তপস্বী ও সাক্ষী গোপাল'],
    correctOptionIndex: 0,
    correctAnswerText: 'দা-কুমড়া ও সাপে-নেউলে',
    explanationBn: '"দা-কুমড়া" এবং "সাপে-নেউলে" উভয় বাগধারারই অর্থ হলো "ভীষণ শত্রুতা"।',
    difficulty: 'MEDIUM',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'কুমিল্লা বোর্ড',
    year: 2023,
    examType: 'SSC',
    tags: ['SYNONYMOUS_IDIOMS', 'CUMILLA_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 133005,
    chapterId: 133,
    topicId: 13302,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: '"তাসের ঘর" বাগধারাটির সঠিক অন্তর্নিহিত অর্থ কোনটি?',
    questionEn: 'What is the figurative meaning of "Tasher Ghor"?',
    options: ['ক্ষণস্থায়ী বস্তু', 'খেলার ঘর', 'পাকা বাড়ি', 'সৌভাগ্যের স্থান'],
    correctOptionIndex: 0,
    correctAnswerText: 'ক্ষণস্থায়ী বস্তু',
    explanationBn: 'তাসের তৈরি ঘর যেমন সামান্য বাতাসে ভেঙে পড়ে, তেমনি যা অতি দ্রুত বিনষ্ট হয় তাকে "তাসের ঘর" (ক্ষণস্থায়ী বস্তু) বলে।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'চট্টগ্রাম বোর্ড',
    year: 2024,
    examType: 'SSC',
    tags: ['TASHER_GHOR', 'CHITTAGONG_BOARD'],
    status: 'ACTIVE'
  }
];

const CHAPTER_33_MODEL_TEST = {
  id: 13301,
  subject: 'BANGLA',
  chapterId: 133,
  testTitleBn: 'অধ্যায় ৩৩ মডেল টেস্ট: বাগধারা ও প্রবাদ-প্রবচন',
  testTitleEn: 'Chapter 33 Model Test: Bengali Idioms & Proverbs (Bagdhara)',
  descriptionBn: 'অমাবস্যার চাঁদ, বিড়াল তপস্বী, গোঁফ খেজুরে, তাসের ঘর এবং শীর্ষ ৫০টি বাগধারার অর্থ ও প্রয়োগের ওপর পূর্ণাঙ্গ মডেল টেস্ট।',
  durationMinutes: 10,
  totalMarks: 5,
  passPercentage: 60,
  difficulty: 'MEDIUM',
  questionCount: 5,
  questionIds: [133001, 133002, 133003, 133004, 133005],
  status: 'PUBLISHED'
};

// ============================================================================
// CHAPTER 34: এক কথায় প্রকাশ (One Word Substitution)
// ============================================================================
const CHAPTER_34_TOPICS = [
  {
    id: 13401,
    chapterId: 134,
    parentTopicId: null,
    subject: 'BANGLA',
    topicNo: '৩৪.১',
    titleBn: 'এক কথায় প্রকাশের ধারণা, উদ্দেশ্য ও বিষয়ভিত্তিক শ্রেণিবিভাগ',
    titleEn: 'Concept, Objectives & Categorical Taxonomy of One Word Substitutions',
    slug: 'b34-ek-kothay-prokash-dharona',
    difficulty: 'BOARD_STANDARD',
    classLevel: 'Class 8 - 12 (SSC & HSC)',
    summaryBn: 'বক্তব্যকে সংহত, আকর্ষণীয় ও প্রাঞ্জল করতে কোনো বিশিষ্ট ধারণা, সম্পর্ক বা স্বভাবকে একক শব্দে প্রকাশ করাকে এক কথায় প্রকাশ বলে।',
    definitionBn: 'এক কথায় প্রকাশ (One Word Substitution): বাক্য বা বাক্যাংশের ভাবকে একক ও প্রমিত শব্দে প্রকাশ করার ব্যাকরণিক রীতিকে এক কথায় প্রকাশ বলে। যেমন: যিনি ব্যাকরণ শাস্ত্র অধ্যয়ন করেছেন = বৈয়াকরণ; যিনি ইতিহাস রচনা করেন = ঐতিহাসিক। বিষয়ভিত্তিক প্রধান শ্রেণিবিভাগসমূহ:\n১. জ্ঞান ও পেশাভিত্তিক: চিকিৎসা করেন যিনি = চিকিৎসক; জ্যোতিষ জানেন যিনি = জ্যোতিষী; বিচার করেন যিনি = বিচারক।\n২. সম্পর্ক ও পারিবারিক: যে নারীর সন্তান বাঁচে না = মৃতবৎসা; যে নারীর কোনো সন্তান হয়নি = বন্ধ্যা; যে নারীর পতি ও পুত্র জীবিত = বীরা (বা পুরন্ধ্রী); যে নারীর পতি ও পুত্র নেই = অবীরা।\n৩. শব্দ ও আহার্য: চিবিয়ে খাওয়ার যোগ্য = চর্ব্য; চুষে খাওয়ার যোগ্য = চোষ্য; লেহন করার যোগ্য = লেহ্য; পান করার যোগ্য = পেয়।',
    definitionEn: 'One Word Substitution encodes detailed propositional descriptors into standardized nominal, adjectival, or occupational designations.',
    explanationBn: 'আহার্য ৪ প্রকারের ক্লাসিক এক কথায় প্রকাশ যা পরীক্ষায় নিশ্চিত আসে:\n১. চর্ব্য: যা চিবিয়ে খেতে হয় (যেমন: মাংস, রুটি)\n২. চোষ্য: যা চুষে খেতে হয় (যেমন: আম, রস)\n৩. লেহ্য: যা জিহ্বা দিয়ে চেটে খেতে হয় (যেমন: পায়েস, চাটনি, মধু)\n৪. পেয়: যা পান করতে হয় (যেমন: জল, দুধ, শরবত)।\nপারিবারিক নারীবাচক সম্পর্কের সূক্ষ্ম পার্থক্য:\n• যে নারীর স্বামী বিদেশে অবস্থান করছে = প্রোষিতভর্তৃকা\n• যে নারীর সম্প্রতি বিবাহ হয়েছে = নবোঢ়া\n• যে নারী অন্যের দ্বারা পালিত = পরভৃত\n• যে পুরুষ স্ত্রীর বশীভূত = স্ত্রৈণ\n• যে পুরুষ এখনো বিয়ে করেনি = অকৃতদার\n• যে পুরুষ বিয়ে করেছে = কৃতদার।',
    teacherGoldenTips: 'মাস্টার কোড:\n• চিবিয়ে খাওয়া = চর্ব্য!\n• চুষে খাওয়া = চোষ্য!\n• চেটে খাওয়া = লেহ্য!\n• পান করা = পেয়!\n• স্বামী বিদেশে = প্রোষিতভর্তৃকা!\n• নতুন বিয়ে হওয়া নারী = নবোঢ়া!',
    rules: [
      {
        ruleNo: 1,
        nameBn: 'সংস্কৃত তদ্ধিত ও কৃৎ রূপের যথার্থতা',
        explanationBn: 'এক কথায় প্রকাশের শব্দগুলো মূলত সংস্কৃত কৃৎ ও তদ্ধিত প্রত্যয়ের মাধ্যমে প্রমিত আকারে গঠিত হয়, তাই এর বানান ও রূপ পরিবর্তন করা যায় না।',
        examples: [
          {
            bn: 'যিনি ব্যাকরণ জানেন = বৈয়াকরণ (ব্যাকরণবিদ প্রমিত রূপ নয়); যিনি ইতিহাস রচনা করেন = ঐতিহাসিক।',
            context: 'প্রমিত রূপ'
          }
        ]
      }
    ],
    formulas: [
      {
        label: 'আহার্য চতুষ্টয় সমীকরণ',
        structure: 'চিবানো = চর্ব্য | চোষা = চোষ্য | লেহন = লেহ্য | পান = পেয়'
      }
    ],
    examples: [
      {
        bn: 'যিনি ব্যাকরণ পণ্ডিত = বৈয়াকরণ',
        context: 'পেশাগত'
      },
      {
        bn: 'যার শত্রু জন্মায়নি = অজাতশত্রু',
        context: 'চরিত্রগত'
      }
    ],
    exceptions: [
      {
        titleBn: 'পরভৃত বনাম পরভৃৎ',
        descriptionBn: '"পরভৃত" (ত) অর্থ কোকিল (কারণ সে অন্যের দ্বারা পালিত হয়); আর "পরভৃৎ" (ৎ) অর্থ কাক (কারণ সে কোকিলের ছানা পালন করে)।'
      }
    ],
    commonMistakes: [
      {
        incorrectBn: 'যিনি ব্যাকরণ জানেন = ব্যাকরণবিদ।',
        correctBn: 'যিনি ব্যাকরণ জানেন = বৈয়াকরণ।',
        explanationBn: 'বোর্ড পরীক্ষায় বৈয়াকরণ হলো একমাত্র স্বীকৃত প্রমিত ব্যাকরণিক রূপ।'
      }
    ],
    writtenPractice: [
      {
        id: 1,
        type: 'ONE_WORD',
        prompt: 'এক কথায় প্রকাশ করো: (ক) চিবিয়ে খাওয়ার যোগ্য (খ) চেটে খাওয়ার যোগ্য (গ) যিনি ব্যাকরণ জানেন (ঘ) যার শত্রু জন্মায়নি।',
        correctAnswer: '(ক) চর্ব্য (খ) লেহ্য (গ) বৈয়াকরণ (ঘ) অজাতশত্রু।',
        explanationBn: 'বোর্ড পরীক্ষার অত্যন্ত ক্লাসিক ৪ নম্বরের প্রশ্ন।'
      }
    ],
    tags: ['EK_KOTHAY_PROKASH', 'ONE_WORD_SUBSTITUTION', 'CHORBYO', 'LEHYO', 'BOIYAKORON', 'SSC', 'HSC'],
    status: 'PUBLISHED',
    orderIndex: 1,
    viewCount: 450
  },
  {
    id: 13402,
    chapterId: 134,
    parentTopicId: null,
    subject: 'BANGLA',
    topicNo: '৩৪.২',
    titleBn: 'সাহিত্য ও ব্যাকরণের শীর্ষ ৫০টি এক কথায় প্রকাশ ভাণ্ডার',
    titleEn: 'Top 50 Literary & Grammatical One Word Substitutions',
    slug: 'b34-top-50-literary-substitutions',
    difficulty: 'BOARD_STANDARD',
    classLevel: 'Class 8 - 12 (SSC & HSC)',
    summaryBn: 'সাহিত্যিক বর্ণনা ও বোর্ড পরীক্ষার জন্য অপরিহার্য ৫০টি এক কথায় প্রকাশের সমৃদ্ধ সংকলন।',
    definitionBn: 'উচ্চফলনশীল সংকলন:\n• কাল ও ঋতু: দিনের শেষ ভাগ = অপরাহ্ন; দিনের মধ্য ভাগ = মধ্যাহ্ন; দিনের প্রথম ভাগ = পূর্বাহ্ন; রাতের প্রথম প্রহর = প্রদোষ (বা পূর্বরাত্র); রজনীর শেষ ভাগ = কালনিশা।\n• স্বভাব ও আচরণ: যে ক্রমাগত রোদন করছে = রোরুদ্যমান; যা দীপ্তি পাচ্ছে = দেদীপ্যমান; যা ক্রমাগত জ্বলছে = প্রজ্জ্বলিত; যা উড়ছে = উড্ডীয়মান; যার কোনো কিছুতেই ভয় নেই = অকুতোভয়।\n• প্রাণী ও ধ্বনি: হাতির ডাক = বৃংহিত; ঘোড়ার ডাক = হ্রেষা; সিংহের ডাক = গর্জন/নাদ; ময়ূরের ডাক = কেকা; কোকিলের ডাক = কুহু; নূপুরের ধ্বনি = নিক্বণ; ধনুকের ছিলার শব্দ = টঙ্কার।',
    definitionEn: 'Curated substitutions representing Temporal Phases, Dynamic Physical States, and Zoomorphic Audio-Acoustic designators.',
    explanationBn: 'পশু-পাখির ডাক ও বাদ্যযন্ত্রের শব্দের মাস্টার চার্ট:\n১. হাতির ডাক = বৃংহিত (হাতির গায়ের চামড়া = গজচর্ম)\n২. ঘোড়ার ডাক = হ্রেষা (ঘোড়াশাল = মন্দুরা)\n৩. ময়ূরের ডাক = কেকা (ময়ূরের পুচ্ছ = কলাপ)\n৪. নূপুরের শব্দ = নিক্বণ (বা শিঞ্জন)\n৫. ধনুকের ছিলার আওয়াজ = টঙ্কার\n৬. শুকনো পাতার খসখস শব্দ = মরমর\n৭. বাতাসে ওড়ার ধ্বনি = পতপত।\nদিনের অংশসমূহের শুদ্ধ বানান ও রূপ:\n• পূর্ব + অহ্ন = পূর্বাহ্ণ (মূর্ধন্য-ণ নিচে যুক্ত)\n• অপর + অহ্ন = অপরাহ্ণ (মূর্ধন্য-ণ নিচে যুক্ত)\n• মধ্য + অহ্ন = মধ্যাহ্ন (দন্ত্য-ন পাশে যুক্ত)\n• সায় + অহ্ন = সায়াহ্ন (দন্ত্য-ন পাশে যুক্ত)।',
    teacherGoldenTips: 'ডাক ও ধ্বনির সুপার ফর্মুলা:\n• হাতির ডাক = বৃংহিত!\n• ঘোড়ার ডাক = হ্রেষা!\n• ময়ূরের ডাক = কেকা!\n• নূপুরের ধ্বনি = নিক্বণ!\n• ধনুকের শব্দ = টঙ্কার!',
    rules: [
      {
        ruleNo: 1,
        nameBn: 'অহ্ন শব্দান্ত বানানে ণ ও ন ব্যবহারের নিয়ম',
        explanationBn: 'পূর্বাহ্ণ ও অপরাহ্ণ শব্দে র থাকায় মূর্ধন্য-ণ (হ-এর নিচে); কিন্তু মধ্যাহ্ন ও সায়াহ্ন শব্দে দন্ত্য-ন (হ-এর পাশে)।',
        examples: [
          {
            bn: 'অপরাহ্ণ (মূর্ধন্য-ণ); মধ্যাহ্ন (দন্ত্য-ন)।',
            context: 'ণ-ত্ব বিধান প্রয়োগ'
          }
        ]
      }
    ],
    formulas: [
      {
        label: 'ডাক ও ধ্বনি সূত্র',
        structure: 'হাতি = বৃংহিত | ঘোড়া = হ্রেষা | ময়ূর = কেকা | নূপুর = নিক্বণ | ধনুক = টঙ্কার'
      }
    ],
    examples: [
      {
        bn: 'হাতির বৃংহিত শুনে সবাই ভয় পেয়ে গেল (বৃংহিত)',
        context: 'বৃংহিত'
      },
      {
        bn: 'অদূরে অশ্বের হ্রেষা ধ্বনি শোনা গেল (হ্রেষা)',
        context: 'হ্রেষা'
      }
    ],
    exceptions: [
      {
        titleBn: 'কেকা বনাম কুহু',
        descriptionBn: 'ময়ূরের মিষ্টি ডাককে কেকা বলে; কিন্তু কোকিলের ডাককে কুহু বলা হয়।'
      }
    ],
    commonMistakes: [
      {
        incorrectBn: 'হাতির ডাক = গর্জন।',
        correctBn: 'হাতির ডাক = বৃংহিত।',
        explanationBn: 'সিংহ গর্জন করে; হাতির প্রমিত ডাক হলো বৃংহিত।'
      }
    ],
    writtenPractice: [
      {
        id: 1,
        type: 'ONE_WORD',
        prompt: 'এক কথায় প্রকাশ করো: (ক) হাতির ডাক (খ) ঘোড়ার ডাক (গ) ময়ূরের ডাক (ঘ) নূপুরের ধ্বনি।',
        correctAnswer: '(ক) বৃংহিত (খ) হ্রেষা (গ) কেকা (ঘ) নিক্বণ।',
        explanationBn: 'বোর্ড পরীক্ষার অত্যন্ত আকর্ষণীয় ৪ নম্বরের প্রশ্ন।'
      }
    ],
    tags: ['BRINGHITO', 'HRESHA', 'KEKA', 'NIKBON', 'ANIMAL_SOUNDS', 'SSC', 'HSC'],
    status: 'PUBLISHED',
    orderIndex: 2,
    viewCount: 470
  }
];

const CHAPTER_34_MCQS = [
  {
    id: 134001,
    chapterId: 134,
    topicId: 13401,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: 'যিনি ব্যাকরণ শাস্ত্রে সুপণ্ডিত, তাকে এক কথায় কী বলা হয়?',
    questionEn: 'What is a master grammarian called in one word?',
    options: ['বৈয়াকরণ', 'ব্যাকরণবিদ', 'ভাষাবিদ', 'পণ্ডিত'],
    correctOptionIndex: 0,
    correctAnswerText: 'বৈয়াকরণ',
    explanationBn: 'যিনি ব্যাকরণ ভালো জানেন বা ব্যাকরণ রচনা করেন, তাকে এক কথায় "বৈয়াকরণ" বলে।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'ঢাকা বোর্ড',
    year: 2024,
    examType: 'SSC',
    tags: ['BOIYAKORON', 'DHAKA_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 134002,
    chapterId: 134,
    topicId: 13401,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: '"জিহ্বা দিয়ে চেটে খাওয়ার যোগ্য"—এর এক কথায় প্রকাশ কোনটি?',
    questionEn: 'What is the one word for "that which is consumed by licking"?',
    options: ['লেহ্য', 'চর্ব্য', 'চোষ্য', 'পেয়'],
    correctOptionIndex: 0,
    correctAnswerText: 'লেহ্য',
    explanationBn: 'যা চেটে খাওয়া হয় তা হলো লেহ্য (চিবিয়ে খাওয়া = চর্ব্য, চুষে খাওয়া = চোষ্য, পান করা = পেয়)।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'রাজশাহী বোর্ড',
    year: 2023,
    examType: 'SSC',
    tags: ['LEHYO', 'RAJSHAHI_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 134003,
    chapterId: 134,
    topicId: 13402,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: '"হাতির ডাক"—এক কথায় কী হবে?',
    questionEn: 'What is the call of an elephant called in one word?',
    options: ['বৃংহিত', 'হ্রেষা', 'কেকা', 'নাদ'],
    correctOptionIndex: 0,
    correctAnswerText: 'বৃংহিত',
    explanationBn: 'হাতির ডাককে "বৃংহিত" বলে (ঘোড়ার ডাক = হ্রেষা, ময়ূরের ডাক = কেকা)।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'যশোর বোর্ড',
    year: 2024,
    examType: 'SSC',
    tags: ['BRINGHITO', 'JASHORE_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 134004,
    chapterId: 134,
    topicId: 13401,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: '"যে নারীর স্বামী বিদেশে অবস্থান করছে"—এক কথায় কী হবে?',
    questionEn: 'What is a woman whose husband lives abroad called?',
    options: ['প্রোষিতভর্তৃকা', 'অনূঢ়া', 'নবোঢ়া', 'অবীরা'],
    correctOptionIndex: 0,
    correctAnswerText: 'প্রোষিতভর্তৃকা',
    explanationBn: 'যে নারীর স্বামী প্রবাসে বা বিদেশে থাকে তাকে "প্রোষিতভর্তৃকা" বলা হয়।',
    difficulty: 'MEDIUM',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'কুমিল্লা বোর্ড',
    year: 2023,
    examType: 'SSC',
    tags: ['PROSHITOBHORTRIKA', 'CUMILLA_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 134005,
    chapterId: 134,
    topicId: 13402,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: '"নূপুরের ধ্বনি বা রিনিঝিনি শব্দ"—এক কথায় কী হবে?',
    questionEn: 'What is the tinkling sound of an anklet called?',
    options: ['নিক্বণ', 'টঙ্কার', 'মরমর', 'ঝংকার'],
    correctOptionIndex: 0,
    correctAnswerText: 'নিক্বণ',
    explanationBn: 'পায়ে পরার অলংকার নূপুরের সুমধুর ধ্বনিকে "নিক্বণ" বা "শিঞ্জন" বলা হয় (ধনুকের ছিলার শব্দ = টঙ্কার)।',
    difficulty: 'MEDIUM',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'চট্টগ্রাম বোর্ড',
    year: 2024,
    examType: 'SSC',
    tags: ['NIKBON', 'CHITTAGONG_BOARD'],
    status: 'ACTIVE'
  }
];

const CHAPTER_34_MODEL_TEST = {
  id: 13401,
  subject: 'BANGLA',
  chapterId: 134,
  testTitleBn: 'অধ্যায় ৩৪ মডেল টেস্ট: এক কথায় প্রকাশ',
  testTitleEn: 'Chapter 34 Model Test: One Word Substitution',
  descriptionBn: 'পেশা ও জ্ঞান, আহার্য চতুষ্টয়, পশু-পাখির ডাক ও শব্দের শীর্ষ ৫০টি এক কথায় প্রকাশের ওপর পূর্ণাঙ্গ মডেল টেস্ট।',
  durationMinutes: 10,
  totalMarks: 5,
  passPercentage: 60,
  difficulty: 'MEDIUM',
  questionCount: 5,
  questionIds: [134001, 134002, 134003, 134004, 134005],
  status: 'PUBLISHED'
};

// ============================================================================
// CHAPTER 35: সমার্থক শব্দ / প্রতিশব্দ (Synonyms)
// ============================================================================
const CHAPTER_35_TOPICS = [
  {
    id: 13501,
    chapterId: 135,
    parentTopicId: null,
    subject: 'BANGLA',
    topicNo: '৩৫.১',
    titleBn: 'সমার্থক শব্দের সংজ্ঞা, বৈশিষ্ট্য এবং পূর্ণ সমার্থক বনাম প্রসঙ্গভেদে নিকটার্থকের পার্থক্য',
    titleEn: 'Definition, Characteristics of Synonyms & Absolute vs Contextual Near-Synonyms',
    slug: 'b35-shomarthok-shobdo-dharona',
    difficulty: 'BOARD_STANDARD',
    classLevel: 'Class 8 - 12 (SSC & HSC)',
    summaryBn: 'যেসব শব্দ একই বা প্রায় অভিন্ন অর্থ প্রকাশ করে, তাদের সমার্থক শব্দ বা প্রতিশব্দ বলে। প্রতিটি শব্দের সূক্ষ্ম অর্থভেদ ও প্রসঙ্গের পার্থক্য রয়েছে।',
    definitionBn: 'সমার্থক শব্দ (Synonyms / Shomarthok Shobdo): ভাষায় যেসব ভিন্ন ভিন্ন শব্দ একই বস্তু, ধারণা বা ভাব প্রকাশে ব্যবহৃত হয়, তাদের সমার্থক শব্দ বা প্রতিশব্দ বলে। যেমন: সূর্যের প্রতিশব্দ রবি, ভানু, দিনকর, মার্তণ্ড; জলের প্রতিশব্দ পানি, বারি, সলিল, নীর, অম্বু। পূর্ণ সমার্থক বনাম নিকটার্থকের পার্থক্য:\n১. পূর্ণ সমার্থক (Absolute Synonyms): যেকোনো বাক্যে একটির স্থলে অন্যটি বসালে অর্থের কোনো বিচ্যুতি ঘটে না (যেমন: রবি ও সূর্য)।\n২. প্রসঙ্গভেদে নিকটার্থক (Contextual/Near Synonyms): আপাতদৃষ্টিতে এক মনে হলেও ব্যবহারের স্থান ও মাত্রার সূক্ষ্ম পার্থক্য থাকে। যেমন: "জল" ও "পানি"—উভয়টি এক হলেও হিন্দু সংস্কৃতিতে "গঙ্গাজল" বা পূজায় "জল" বলা হয়, কিন্তু রান্না বা নিত্যপানে "পানি" ব্যাপকভাবে ব্যবহৃত হয়। তেমনি "অশ্রু" ও "চোখের পানি"—সাহিত্যিক গাম্ভীর্যে অশ্রু মানানসই হলেও দৈনন্দিন ভাষায় চোখের পানি বলা হয়।',
    definitionEn: 'Synonyms (Shomarthok Shobdo) share denotative equivalence. Linguistically, absolute synonymy is rare; most pairs exhibit pragmatic, cultural, or stylistic variance (Contextual Near-Synonyms).',
    explanationBn: 'সমার্থক শব্দের প্রয়োজনীয়তা:\n১. শব্দভাণ্ডার সমৃদ্ধ করা ও ভাষার প্রকাশক্ষমতা বৃদ্ধি।\n২. একই শব্দের বারবার প্রয়োগজনিত একঘেয়েমি দূর করে রচনায় বৈচিত্র্য আনা।\n৩. কাব্যে ছন্দ ও মিল রক্ষা করা (যেমন: কোথাও সূর্য, কোথাও রবি, কোথাও ভানু প্রয়োজন হয়)।\nবোর্ড পরীক্ষায় প্রতিশব্দ লেখার সময় সবসময় খাঁটি ও প্রমিত সমার্থক শব্দ লিখতে হয়; কোনোভাবেই ভুল বা অপ্রচলিত শব্দ ব্যবহার করা অনুচিত।',
    teacherGoldenTips: 'গোল্ডেন নোট: পরীক্ষায় যদি বলে "সূর্যের তিনটি প্রতিশব্দ লিখ", তবে এমন তিনটি লিখবেন যা বানানে নির্ভুল ও প্রমিত—যেমন: রবি, ভানু, দিনকর! কঠিন ও অপ্রচলিত শব্দ লিখে বানান ভুলের ঝুঁকি নেবেন না!',
    rules: [
      {
        ruleNo: 1,
        nameBn: 'শৈলী ও নিবন্ধের সংগতি রক্ষা',
        explanationBn: 'সাধু রীতির গম্ভীর বাক্যে তৎসম প্রতিশব্দ (যেমন: সলিল, বহ্নি, মার্তণ্ড) এবং চলিত ভাষার সাধারণ বাক্যে প্রচলিত প্রতিশব্দ (যেমন: পানি, আগুন, রোদ) ব্যবহার করতে হয়।',
        examples: [
          {
            bn: 'অগ্নিশিখা দাউদাউ করে জ্বলছে (তৎসম শৈলী); চুলার আগুন নিভে গেছে (চলিত শৈলী)।',
            context: 'শৈলীভেদ'
          }
        ]
      }
    ],
    formulas: [
      {
        label: 'সমার্থক শব্দ সমীকরণ',
        structure: 'মূল শব্দ (সূর্য) = রবি = ভানু = দিনকর = ভাস্কর = মার্তণ্ড'
      }
    ],
    examples: [
      {
        bn: 'আকাশ = গগন = অম্বর = ব্যোম = নভোমণ্ডল',
        context: 'আকাশের প্রতিশব্দ'
      },
      {
        bn: 'জল = পানি = বারি = সলিল = নীর',
        context: 'জলের প্রতিশব্দ'
      }
    ],
    exceptions: [
      {
        titleBn: 'সমার্থক হলেও অপরিবর্তনীয় বাগধারা',
        descriptionBn: 'বাগধারায় সমার্থক শব্দ দিয়ে প্রতিস্থাপন করা যায় না (যেমন: "অন্ধের যষ্টি"-কে "অন্ধের লাঠি" বলা যায় না)।'
      }
    ],
    commonMistakes: [
      {
        incorrectBn: 'অনিল ও অনলকে সমার্থক মনে করা।',
        correctBn: 'অনিল অর্থ বাতাস; আর অনল অর্থ আগুন।',
        explanationBn: 'উভয় শব্দ সম্পূর্ণ বিপরীত সত্ত্বা প্রকাশ করে।'
      }
    ],
    writtenPractice: [
      {
        id: 1,
        type: 'DIFFERENCE',
        prompt: 'পূর্ণ সমার্থক ও নিকটার্থকের পার্থক্য বুঝিয়ে লিখ এবং "অনিল" ও "অনল" শব্দের অর্থগত তফাত দেখাও।',
        correctAnswer: 'পূর্ণ সমার্থক শব্দ একে অপরের পরিপূরক হিসেবে যেকোনো বাক্যে অবিকল বসতে পারে; কিন্তু নিকটার্থকের মধ্যে সামাজিক, সাংস্কৃতিক বা শৈলীগত সূক্ষ্ম ভেদ থাকে। "অনিল" অর্থ বাতাস বা বায়ু; অন্যদিকে "অনল" অর্থ আগুন বা বহ্নি।',
        explanationBn: 'বোর্ড পরীক্ষার অত্যন্ত আকর্ষণীয় ৩ নম্বরের প্রশ্ন।'
      }
    ],
    tags: ['SHOMARTHOK_SHOBDO', 'SYNONYMS', 'ONIL_ONOL', 'CONTEXTUAL_SYNONYMS', 'SSC', 'HSC'],
    status: 'PUBLISHED',
    orderIndex: 1,
    viewCount: 460
  },
  {
    id: 13502,
    chapterId: 135,
    parentTopicId: null,
    subject: 'BANGLA',
    topicNo: '৩৫.২',
    titleBn: 'বোর্ড পরীক্ষায় সর্বাধিক আসা ২০টি প্রধান শব্দের সম্পূর্ণ প্রতিশব্দ ভাণ্ডার',
    titleEn: 'Exhaustive Synonym Corpus for 20 Essential Board Exam Words',
    slug: 'b35-top-20-essential-synonym-corpus',
    difficulty: 'BOARD_STANDARD',
    classLevel: 'Class 8 - 12 (SSC & HSC)',
    summaryBn: 'অগ্নি, আকাশ, জল, নদী, সূর্য, চন্দ্র, পৃথিবী, পর্বত, বায়ু, চক্ষু, গৃহ ও পুষ্প—এই ১২টি শীর্ষ শব্দের পূর্ণাঙ্গ প্রতিশব্দ তালিকা।',
    definitionBn: 'শীর্ষ শব্দসমূহের প্রমিত প্রতিশব্দ ভাণ্ডার:\n১. অগ্নি: আগুন, অনল, বহ্নি, পাবক, হুতাশন, শিখা, বৈশ্বানর।\n২. আকাশ: গগন, অম্বর, ব্যোম, অন্তরীক্ষ, নভোমণ্ডল, আসমান, খ খ।\n৩. জল: পানি, বারি, সলিল, নীর, অম্বু, উদক, তোয়, অপ্।\n৪. নদী: তটিনী, স্রোতস্বিনী, প্রবাহিণী, শৈবালিনী, তরঙ্গিনী, গাঙ, নির্ঝরিণী।\n৫. সূর্য: রবি, ভানু, দিনকর, দিবাকর, প্রভাকর, ভাস্কর, তপন, মার্তণ্ড, সবিতা, অর্ক।\n৬. চন্দ্র: চাঁদ, শশী, শশাঙ্ক, ইন্দু, বিধু, সুধাংশু, সোম, হিমাংশু, নিশাকর।\n৭. পৃথিবী: ধরা, ধরিত্রী, অবনী, মেদিনী, বসুন্ধরা, বসুমতী, ভূ, নিখিল, জাহান।\n৮. পর্বত: পাহাড়, গিরি, অচল, শৈল, ভূধর, মহীধর, নগ, অদ্রি।\n৯. বায়ু: বাতাস, সমীর, সমীরণ, পবন, মারুত, হাওয়া, অনিল, গন্ধবহ।\n১০. চক্ষু: চোখ, নয়ন, নেত্র, আঁখি, লোচন, অক্ষি, দৃষ্টি।\n১১. গৃহ: বাড়ি, ঘর, আলয়, নিকেতন, নিবাস, ভবন, সদন, ধাম, আস্তানা।\n১২. পুষ্প: ফুল, কুসুম, প্রসূন, রঙ্গন, মঞ্জরী।',
    definitionEn: 'An exhaustive lexical reference codifying all standardized classical and vernacular synonyms for core elemental entities frequently queried in national examinations.',
    explanationBn: 'বোর্ড পরীক্ষায় সহজে মনে রাখার ছন্দ ও কৌশল:\n১. সূর্যের নাম মনে রাখার কোড: "রবি ও ভানু দুই ভাই, দিনকর ও ভাস্করের কাছে যাই, তপন আর মার্তণ্ড সবিতা অর্ক নিয়ে রয়।"\n২. চন্দ্রের নাম মনে রাখার কোড: "চাঁদের নাম শশী, শশাঙ্ক ইন্দু বিধু সুধাংশুর রূপ রাশি রাশি।"\n৩. পৃথিবীর নাম মনে রাখার কোড: "ধরা ধরিত্রী অবনী, মেদিনী বসুন্ধরা বসুমতীর জননী।"\n৪. নদীর নাম মনে রাখার কোড: "তটিনী স্রোতস্বিনী আর শৈবালিনী, তরঙ্গিনী প্রবাহিণী বয়ে চলে অমনি।"\nজল থেকে উৎপন্ন শব্দের সমাসযুক্ত ট্রিক:\n• জল + দ (যে দেয়) = জলদ, নীরদ, বারিদ (মেঘের প্রতিশব্দ)!\n• জল + জ (যা জন্মে) = জলজ, নীরজ, সরোজ, পঙ্কজ (পদ্মের প্রতিশব্দ)!\n• জল + ধি (যা ধারণ করে) = জলধি, বারিধি, রত্নাকর (সমুদ্রের প্রতিশব্দ)!',
    teacherGoldenTips: 'ম্যাজিক ট্রিক:\n• দ যোগ করলে মেঘ (জলদ, নীরদ)!\n• জ যোগ করলে পদ্ম (জলজ, সরোজ, নীরজ)!\n• ধি যোগ করলে সমুদ্র (জলধি, বারিধি, অম্বুধি)! এই একটি সূত্রে ৩টি সম্পূর্ণ শব্দের প্রতিশব্দ আয়ত্ত হবে!',
    rules: [
      {
        ruleNo: 1,
        nameBn: 'জলভিত্তিক প্রত্যয়ান্ত শব্দ রূপান্তর',
        explanationBn: 'জলের প্রতিশব্দের শেষে "দ" যুক্ত হলে মেঘ, "জ" যুক্ত হলে পদ্ম এবং "ধি" যুক্ত হলে সমুদ্র বোঝায়।',
        examples: [
          {
            bn: 'বারি + দ = বারিদ (মেঘ); বারি + জ = বারিজ (পদ্ম); বারি + ধি = বারিধি (সমুদ্র)।',
            context: 'জলভিত্তিক প্রতিশব্দ'
          }
        ]
      }
    ],
    formulas: [
      {
        label: 'জলদ / জলজ / জলধি ম্যাজিক ফর্মুলা',
        structure: 'জল + দ = মেঘ | জল + জ = পদ্মফুল | জল + ধি = সমুদ্র'
      }
    ],
    examples: [
      {
        bn: 'বারিধি অপার সিন্ধু (বারিধি = সমুদ্র)',
        context: 'সমুদ্র'
      },
      {
        bn: 'আকাশে বারিদ সঞ্চারিত হলো (বারিদ = মেঘ)',
        context: 'মেঘ'
      }
    ],
    exceptions: [
      {
        titleBn: 'মার্তণ্ড বনাম মার্কণ্ড',
        descriptionBn: 'মার্তণ্ড অর্থ সূর্য; আর মার্কণ্ডেয় হলেন পৌরাণিক ঋষি বিশেষ।'
      }
    ],
    commonMistakes: [
      {
        incorrectBn: 'বারিদ মানে সমুদ্র।',
        correctBn: 'বারিদ মানে মেঘ (দ = দান করে); বারিধি মানে সমুদ্র (ধি = ধারণ করে)।',
        explanationBn: 'দ এবং ধি-এর পার্থক্য স্পষ্ট রাখা জরুরি।'
      }
    ],
    writtenPractice: [
      {
        id: 1,
        type: 'SYNONYM_LIST',
        prompt: 'নিচের শব্দগুলোর ৩টি করে প্রমিত প্রতিশব্দ লিখ: (ক) সূর্য (খ) নদী (গ) পৃথিবী (ঘ) আগুন।',
        correctAnswer: '(ক) সূর্য: রবি, ভানু, দিনকর। (খ) নদী: তটিনী, স্রোতস্বিনী, তরঙ্গিনী। (গ) পৃথিবী: ধরা, ধরিত্রী, অবনী। (ঘ) আগুন: অনল, বহ্নি, পাবক।',
        explanationBn: 'বোর্ড পরীক্ষার অত্যন্ত নিয়মিত ৪ নম্বরের প্রশ্ন।'
      }
    ],
    tags: ['SHURJO', 'NODI', 'PRITHIBI', 'AGUN', 'JOLOD_JOLOJ_JOLODHI', 'SSC', 'HSC'],
    status: 'PUBLISHED',
    orderIndex: 2,
    viewCount: 510
  }
];

const CHAPTER_35_MCQS = [
  {
    id: 135001,
    chapterId: 135,
    topicId: 13501,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: '"অনিল" শব্দের সঠিক অর্থ কোনটি?',
    questionEn: 'What is the correct meaning of the word "Onil"?',
    options: ['বাতাস বা বায়ু', 'আগুন বা অনল', 'জল বা পানি', 'আকাশ বা গগন'],
    correctOptionIndex: 0,
    correctAnswerText: 'বাতাস বা বায়ু',
    explanationBn: '"অনিল" শব্দের অর্থ হলো বাতাস বা সমীরণ; অন্যদিকে "অনল" শব্দের অর্থ আগুন বা বহ্নি।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'ঢাকা বোর্ড',
    year: 2024,
    examType: 'SSC',
    tags: ['ONIL_MEANING', 'DHAKA_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 135002,
    chapterId: 135,
    topicId: 13502,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: 'নিচের কোনটি "সূর্য" শব্দের প্রতিশব্দ নয়?',
    questionEn: 'Which of the following is NOT a synonym for the sun?',
    options: ['সুধাংশু', 'মার্তণ্ড', 'দিনকর', 'ভাস্কর'],
    correctOptionIndex: 0,
    correctAnswerText: 'সুধাংশু',
    explanationBn: '"সুধাংশু" হলো চাঁদের প্রতিশব্দ (সুধা অংশু যার); বাকি তিনটি (মার্তণ্ড, দিনকর, ভাস্কর) সূর্যের প্রতিশব্দ।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'রাজশাহী বোর্ড',
    year: 2023,
    examType: 'SSC',
    tags: ['SHURJO_SYNONYMS', 'RAJSHAHI_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 135003,
    chapterId: 135,
    topicId: 13502,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: '"শৈবালিনী" এবং "স্রোতস্বিনী" নিচের কোন শব্দের সমার্থক?',
    questionEn: 'What entity do "Shoibalini" and "Srotoswini" denote as synonyms?',
    options: ['নদী', 'সমুদ্র', 'পর্বত', 'আকাশ'],
    correctOptionIndex: 0,
    correctAnswerText: 'নদী',
    explanationBn: 'নদীর বিখ্যাত প্রতিশব্দগুলো হলো: তটিনী, স্রোতস্বিনী, প্রবাহিণী, শৈবালিনী, তরঙ্গিনী।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'যশোর বোর্ড',
    year: 2024,
    examType: 'SSC',
    tags: ['NODI_SYNONYMS', 'JASHORE_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 135004,
    chapterId: 135,
    topicId: 13502,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: 'জলের প্রতিশব্দের শেষে "ধি" যুক্ত হলে কোন শব্দের সমার্থক শব্দ গঠিত হয়?',
    questionEn: 'Adding suffix -dhi to water synonyms derives words for what entity?',
    options: ['সমুদ্র (যেমন: জলধি, বারিধি)', 'মেঘ (যেমন: জলদ)', 'পদ্ম (যেমন: জলজ)', 'বৃষ্টি'],
    correctOptionIndex: 0,
    correctAnswerText: 'সমুদ্র (যেমন: জলধি, বারিধি)',
    explanationBn: 'জলের প্রতিশব্দে "ধি" (ধারক) যুক্ত হলে সমুদ্র (জলধি, বারিধি), "দ" যুক্ত হলে মেঘ (জলদ) এবং "জ" যুক্ত হলে পদ্ম (জলজ) হয়।',
    difficulty: 'MEDIUM',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'কুমিল্লা বোর্ড',
    year: 2023,
    examType: 'SSC',
    tags: ['JOLODHI_SEA', 'CUMILLA_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 135005,
    chapterId: 135,
    topicId: 13502,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: 'নিচের কোন শব্দটি "পৃথিবী" শব্দের প্রতিশব্দ?',
    questionEn: 'Which of the following is a synonym for the Earth?',
    options: ['মেদিনী', 'অদ্রি', 'অম্বু', 'ব্যোম'],
    correctOptionIndex: 0,
    correctAnswerText: 'মেদিনী',
    explanationBn: '"মেদিনী", "ধরিত্রী", "অবনী", "বসুন্ধরা" হলো পৃথিবীর প্রতিশব্দ (অদ্রি = পর্বত, অম্বু = জল, ব্যোম = আকাশ)।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'চট্টগ্রাম বোর্ড',
    year: 2024,
    examType: 'SSC',
    tags: ['MEDINI_EARTH', 'CHITTAGONG_BOARD'],
    status: 'ACTIVE'
  }
];

const CHAPTER_35_MODEL_TEST = {
  id: 13501,
  subject: 'BANGLA',
  chapterId: 135,
  testTitleBn: 'অধ্যায় ৩৫ মডেল টেস্ট: সমার্থক শব্দ / প্রতিশব্দ',
  testTitleEn: 'Chapter 35 Model Test: Synonyms & Lexical Substitutions',
  descriptionBn: 'অগ্নি, আকাশ, নদী, সূর্য, চন্দ্র, পৃথিবী, সমুদ্র ও শীর্ষ ২০টি শব্দের প্রতিশব্দ ভাণ্ডারের ওপর পূর্ণাঙ্গ মডেল টেস্ট।',
  durationMinutes: 10,
  totalMarks: 5,
  passPercentage: 60,
  difficulty: 'MEDIUM',
  questionCount: 5,
  questionIds: [135001, 135002, 135003, 135004, 135005],
  status: 'PUBLISHED'
};

module.exports = {
  CHAPTER_31_TOPICS, CHAPTER_31_MCQS, CHAPTER_31_MODEL_TEST,
  CHAPTER_32_TOPICS, CHAPTER_32_MCQS, CHAPTER_32_MODEL_TEST,
  CHAPTER_33_TOPICS, CHAPTER_33_MCQS, CHAPTER_33_MODEL_TEST,
  CHAPTER_34_TOPICS, CHAPTER_34_MCQS, CHAPTER_34_MODEL_TEST,
  CHAPTER_35_TOPICS, CHAPTER_35_MCQS, CHAPTER_35_MODEL_TEST
};
