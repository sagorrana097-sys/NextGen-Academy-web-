/**
 * Bangla Grammar Chapters 36–40 Content:
 * Chapter 36: বিপরীতার্থক শব্দ (Antonyms & Semantic Opposites)
 * Chapter 37: পারিভাষিক শব্দ (Technical Terminology)
 * Chapter 38: শুদ্ধ-অশুদ্ধ প্রয়োগ (Common Errors & Syntactic/Morphological Corrections)
 * Chapter 39: বিরামচিহ্ন বা যতিচিহ্নের ব্যবহার (Punctuation Marks & Pauses)
 * Chapter 40: বাংলা ব্যাকরণ — SSC/HSC পরীক্ষাভিত্তিক Revision (Comprehensive Board Revision)
 * 
 * Fully structured according to NCTB/SSC/HSC standards with 13-section format.
 */

// ============================================================================
// CHAPTER 36: বিপরীতার্থক শব্দ (Antonyms)
// ============================================================================
const CHAPTER_36_TOPICS = [
  {
    id: 13601,
    chapterId: 136,
    parentTopicId: null,
    subject: 'BANGLA',
    topicNo: '৩৬.১',
    titleBn: 'বিপরীতার্থক শব্দের সংজ্ঞা, গঠনপ্রণালী ও ব্যাকরণিক মূলনীতি',
    titleEn: 'Definition, Formation Rules & Grammatical Principles of Antonyms',
    slug: 'b36-biporitarthok-moulik-niyom',
    difficulty: 'BOARD_STANDARD',
    classLevel: 'Class 8 - 12 (SSC & HSC)',
    summaryBn: 'একটি শব্দের বিপরীত অর্থবোধক অন্য শব্দকে তার বিপরীতার্থক শব্দ বলে। তৎসম শব্দের বিপরীতে তৎসম এবং বাংলা শব্দের বিপরীতে বাংলা শব্দ ব্যবহার করা ব্যাকরণের প্রমিত নিয়ম।',
    definitionBn: 'বিপরীতার্থক শব্দ (Antonyms / Biporitarthok Shobdo): ভাষায় কোনো একটি শব্দের অর্থের সম্পূর্ণ উল্টো বা বিপরীত ভাব প্রকাশক শব্দকে বিপরীতার্থক শব্দ বলে। যেমন: অন্ধকারের বিপরীত আলো; অমৃতের বিপরীত গরল বা বিষ; জঙ্গমের বিপরীত স্থাবর। বিপরীত শব্দ গঠনের প্রধান ৩টি পদ্ধতি:\n১. স্বতন্ত্র মূল শব্দের দ্বারা: স্বাধীন ↔ পরাধীন; ভূত ↔ ভবিষ্যৎ; প্রাচ্য ↔ প্রতীচ্য।\n২. উপসর্গ যোগের মাধ্যমে: অনুগ্রহ ↔ নিগ্রহ; অনুরাগ ↔ বিরাগ; সুকৃতি ↔ দুষ্কৃতি; মান ↔ অপমান; আস্থা ↔ অনাস্থা।\n৩. না-বোধক উপসর্গ বা প্রত্যয়ের দ্বারা: চেনা ↔ অচেনা; ধার্মিক ↔ অধার্মিক; রাজি ↔ অরাজি।',
    definitionEn: 'Antonyms denote lexical pairs with contrary or complementary meanings. Morphologically, they are formed through distinct lexical roots, negating affixes (a-, ni-, be-), or antonymous prefixes (su-/dur-).',
    explanationBn: 'বিপরীত শব্দ লেখার ৩টি গোল্ডেন নিয়ম:\n১. শব্দশ্রেণির সমতা রক্ষা (Word Class Agreement): বিশেষ্যের বিপরীতে বিশেষ্য এবং বিশেষণের বিপরীতে বিশেষণ পদ বসাতে হবে। যেমন: "উন্নতি" (বিশেষ্য)-এর বিপরীত "অবনতি" (বিশেষ্য); কিন্তু "উন্নত" (বিশেষণ)-এর বিপরীত "অবনত" (বিশেষণ)।\n২. শব্দের উৎসের সমতা (Origin Matching):\n• তৎসম শব্দের বিপরীতে তৎসম শব্দ বসবে: তিমির ↔ আলোক (তিমির ↔ আলো নয়); রাত্রি ↔ দিবস (রাত্রি ↔ দিন নয়)।\n• খাঁটি বাংলা শব্দের বিপরীতে খাঁটি বাংলা শব্দ বসবে: রাত ↔ দিন; আলো ↔ আঁধার।\n৩. প্রসঙ্গভেদে অর্থের তারতম্য:\n"কাঁচা" শব্দের বিপরীত অর্থ প্রেক্ষাপট অনুযায়ী বদলে যায়:\n• কাঁচা আম ↔ পাকা আম\n• কাঁচা রাস্তা ↔ পাকা রাস্তা\n• কাঁচা কথা ↔ পাকা কথা\n• কাঁচা বয়স ↔ পাকা বয়স।',
    teacherGoldenTips: 'মাস্টার ফর্মুলা:\n• বিশেষ্য থাকলে লিখবেন বিশেষ্য (সুখ ↔ দুঃখ)!\n• বিশেষণ থাকলে লিখবেন বিশেষণ (সুখী ↔ দুঃখী)!\n• তৎসম থাকলে তৎসম (তিমির ↔ আলোক)!\n• তদ্ভব থাকলে তদ্ভব (আঁধার ↔ আলো)!',
    rules: [
      {
        ruleNo: 1,
        nameBn: 'পদ ও স্তরের সমতা বিধান',
        explanationBn: 'বিপরীত শব্দ নির্বাচনের ক্ষেত্রে উৎসগত স্তর (তৎসম/তদ্ভব) এবং ব্যাকরণিক পদমর্যাদা শতভাগ বজায় রাখা আবশ্যক।',
        examples: [
          {
            bn: 'অজ্ঞ ↔ বিজ্ঞ (উভয়ই তৎসম বিশেষণ); চতুর ↔ বোকা (উভয়ই তদ্ভব বিশেষণ)।',
            context: 'উৎস ও পদরক্ষা'
          }
        ]
      }
    ],
    formulas: [
      {
        label: 'বিপরীত শব্দ সমীকরণ',
        structure: 'মূল শব্দ (তৎসম বিশেষ্য) ↔ বিপরীত শব্দ (তৎসম বিশেষ্য)'
      }
    ],
    examples: [
      {
        bn: 'জঙ্গম ↔ স্থাবর (জঙ্গম = গতিশীল; স্থাবর = স্থির)',
        context: 'তৎসম বিপরীত'
      },
      {
        bn: 'অমৃত ↔ গরল (গরল = বিষ)',
        context: 'তৎসম বিপরীত'
      }
    ],
    exceptions: [
      {
        titleBn: 'উভমুখী বা একাধিক বিপরীত শব্দ',
        descriptionBn: 'কোনো কোনো শব্দের বহুল প্রচলিত একাধিক বিপরীত রূপ গ্রহণযোগ্য (যেমন: অমৃত ↔ গরল / বিষ; সৃষ্টি ↔ প্রলয় / ধ্বংস)।'
      }
    ],
    commonMistakes: [
      {
        incorrectBn: '"তিমির" শব্দের বিপরীত "আলো"।',
        correctBn: '"তিমির"-এর প্রমিত বিপরীত "আলোক" (তৎসমের সাথে তৎসম)।',
        explanationBn: '"আঁধার"-এর বিপরীত "আলো" (তদ্ভবের সাথে তদ্ভব)।'
      }
    ],
    writtenPractice: [
      {
        id: 1,
        type: 'ANTONYM_MATCH',
        prompt: 'বিপরীত শব্দ লিখ: (ক) জঙ্গম (খ) তিমির (গ) প্রাচ্য (ঘ) সৌম্য।',
        correctAnswer: '(ক) জঙ্গম ↔ স্থাবর (খ) তিমির ↔ আলোক (গ) প্রাচ্য ↔ প্রতীচ্য (ঘ) সৌম্য ↔ উগ্র।',
        explanationBn: 'বোর্ড পরীক্ষার অত্যন্ত আকর্ষণীয় ৪ নম্বরের ক্লাসিক প্রশ্ন।'
      }
    ],
    tags: ['BIPORITARTHOK_SHOBDO', 'ANTONYMS', 'JONGGOM_STHABOR', 'TIMIR_ALOK', 'SSC', 'HSC'],
    status: 'PUBLISHED',
    orderIndex: 1,
    viewCount: 470
  },
  {
    id: 13602,
    chapterId: 136,
    parentTopicId: null,
    subject: 'BANGLA',
    topicNo: '৩৬.২',
    titleBn: 'বোর্ড পরীক্ষায় সর্বাধিক কমন ৬০টি বিপরীতার্থক শব্দের তালিকা ও প্রয়োগ',
    titleEn: 'Top 60 High-Frequency Board Exam Antonyms Corpus & Sentences',
    slug: 'b36-top-60-board-antonyms-corpus',
    difficulty: 'BOARD_STANDARD',
    classLevel: 'Class 8 - 12 (SSC & HSC)',
    summaryBn: 'এসএসসি ও এইচএসসি বোর্ড পরীক্ষার বিগত ১০ বছরের প্রশ্ন বিশ্লেষণে প্রাপ্ত সর্বাধিক গুরুত্বপূর্ণ ৬০টি বিপরীতার্থক শব্দের সংকলন।',
    definitionBn: 'নির্বাচিত উচ্চফলনশীল বিপরীত শব্দ তালিকা:\n• অগ্রজ ↔ অনুজ\n• অনুরক্ত ↔ বিরক্ত\n• অনন্ত ↔ শান্ত (বা সসীম)\n• অমৃত ↔ গরল\n• অনুরাগ ↔ বিরাগ\n• আকর্ষণ ↔ বিকর্ষণ\n• উৎকর্ষ ↔ অপকর্ষ\n• উগ্র ↔ সৌম্য\n• কৃত্রিম ↔ প্রাকৃতিক\n• ক্ষীয়মাণ ↔ বর্ধমান\n• জঙ্গম ↔ স্থাবর\n• তিমির ↔ আলোক\n• প্রাচ্য ↔ প্রতীচ্য\n• বাদী ↔ বিবাদী\n• ভূত ↔ ভবিষ্যৎ\n• সন্ধি ↔ বিগ্রহ\n• হ্রস্ব ↔ দীর্ঘ\n• সংশয় ↔ প্রত্যয়\n• সৃষ্টি ↔ প্রলয়\n• অনুরাগ ↔ বিরাগ\n• আবির্ভাব ↔ তিরোভাব\n• চঞ্চল ↔ স্থির\n• কৃতজ্ঞ ↔ কৃতঘ্ন।',
    definitionEn: 'An exhaustive corpus of classical and high-frequency antonym pairs repeatedly examined across secondary and higher secondary education boards.',
    explanationBn: 'বোর্ড পরীক্ষায় বারবার আসা কনফিউজিং জোড়াগুলোর অর্থ বিশ্লেষণ:\n১. "কৃতজ্ঞ" ↔ "কৃতঘ্ন": যে উপকারীর উপকার স্বীকার করে সে কৃতজ্ঞ; আর যে উপকারীর অপকার করে বা উপকার ভুলে যায় সে কৃতঘ্ন (আর যে উপকারীর উপকার স্বীকার করে না সে "অকৃতজ্ঞ")।\n২. "আবির্ভাব" ↔ "তিরোভাব": আবির্ভাব মানে প্রকাশ পাওয়া বা উপস্থিত হওয়া; তিরোভাব মানে অদৃশ্য হওয়া বা প্রস্থান।\n৩. "প্রাচ্য" ↔ "প্রতীচ্য": প্রাচ্য হলো পূর্বদেশীয় সভ্যতা বা সংস্কৃতি; প্রতীচ্য হলো পাশ্চাত্য বা পশ্চিমাদেশীয় সংস্কৃতি।\n৪. "সংশয়" ↔ "প্রত্যয়": সংশয় মানে সন্দেহ বা দ্বিধা; প্রত্যয় মানে দৃঢ় বিশ্বাস বা প্রত্যয়।\n৫. "ক্ষীয়মাণ" ↔ "বর্ধমান": যা ক্রমে হ্রাস পাচ্ছে তা ক্ষীয়মাণ; যা ক্রমে বৃদ্ধি পাচ্ছে তা বর্ধমান।',
    teacherGoldenTips: 'গোল্ডেন নোট:\n• আবির্ভাব ↔ তিরোভাব!\n• ক্ষীয়মাণ ↔ বর্ধমান!\n• প্রাচ্য ↔ প্রতীচ্য!\n• জঙ্গম ↔ স্থাবর!\n• সংশয় ↔ প্রত্যয়!\nএই ৫টি জোড়া মুখস্থ রাখলে পরীক্ষায় অন্তত ১টি প্রশ্ন সরাসরি কমন পাবেন!',
    rules: [
      {
        ruleNo: 1,
        nameBn: 'বাক্যে বৈপরীত্য প্রকাশের রীতি',
        explanationBn: 'বাক্যে বিপরীত শব্দের সমন্বিত প্রয়োগ বক্তব্যকে অধিক অর্থপূর্ণ ও ব্যঞ্জনাধর্মী করে তোলে।',
        examples: [
          {
            bn: 'সংসারে সুখ ও দুঃখ মুদ্রার এপিঠ-ওপিঠ।',
            context: 'যৌথ বৈপরীত্য'
          }
        ]
      }
    ],
    formulas: [
      {
        label: 'বিপরীত জোড় সমীকরণ',
        structure: 'আবির্ভাব ↔ তিরোভাব | প্রাচ্য ↔ প্রতীচ্য | ক্ষীয়মাণ ↔ বর্ধমান | সংশয় ↔ প্রত্যয়'
      }
    ],
    examples: [
      {
        bn: 'মহাপুরুষের তিরোভাবে জাতি শোকাহত (তিরোভাব)',
        context: 'তিরোভাব'
      },
      {
        bn: 'তার মনে কোনো সংশয় নেই (প্রত্যয়)',
        context: 'সংশয়'
      }
    ],
    exceptions: [
      {
        titleBn: 'শান্ত বনাম অশান্ত',
        descriptionBn: '"অনন্ত"-এর বিপরীত "শান্ত" (স + অন্ত = শান্ত, যার অন্ত বা শেষ আছে); এটি কোলাহলহীন অর্থে শান্ত নয়।'
      }
    ],
    commonMistakes: [
      {
        incorrectBn: 'কৃতজ্ঞ শব্দের বিপরীত অকৃতজ্ঞ (পরীক্ষায়)।',
        correctBn: 'বোর্ড ব্যাকরণে "কৃতজ্ঞ"-এর আদর্শ বিপরীত "কৃতঘ্ন"।',
        explanationBn: 'কৃতঘ্ন শব্দটি অধিক প্রমিত ও পরিশীলিত রূপ।'
      }
    ],
    writtenPractice: [
      {
        id: 1,
        type: 'ANTONYM_SENTENCE',
        prompt: 'বিপরীত শব্দ লিখে বাক্যে প্রয়োগ করো: (ক) আবির্ভাব (খ) ক্ষীয়মাণ (গ) সংশয় (ঘ) কৃতজ্ঞ।',
        correctAnswer: '(ক) আবির্ভাব ↔ তিরোভাব: রবীন্দ্রনাথের তিরোভাবে বাংলা সাহিত্যের অপূরণীয় ক্ষতি হয়। (খ) ক্ষীয়মাণ ↔ বর্ধমান: অমাবস্যার পর চাঁদ বর্ধমান রূপ ধারণ করে। (গ) সংশয় ↔ প্রত্যয়: পরিশ্রম করলে সাফল্যে সংশয় থাকে না। (ঘ) কৃতজ্ঞ ↔ কৃতঘ্ন: কৃতঘ্ন ব্যক্তিকে কেউ শ্রদ্ধা করে না।',
        explanationBn: 'বোর্ড পরীক্ষার অত্যন্ত আকর্ষণীয় ৪ নম্বরের প্রশ্ন।'
      }
    ],
    tags: ['ABIRBHAB_TIROBHAB', 'KRIYOMAN_BORDHOMAN', 'KRITOGGHO_KRITOGHNO', 'TOP_ANTONYMS', 'SSC', 'HSC'],
    status: 'PUBLISHED',
    orderIndex: 2,
    viewCount: 490
  }
];

const CHAPTER_36_MCQS = [
  {
    id: 136001,
    chapterId: 136,
    topicId: 13601,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: '"জঙ্গম" শব্দের সঠিক বিপরীতার্থক শব্দ কোনটি?',
    questionEn: 'What is the correct antonym of "Jonggom"?',
    options: ['স্থাবর', 'অস্থাবর', 'স্থির', 'গতিহীন'],
    correctOptionIndex: 0,
    correctAnswerText: 'স্থাবর',
    explanationBn: '"জঙ্গম" অর্থ যা গতিশীল বা চলে; এর প্রমিত ব্যাকরণিক বিপরীত শব্দ হলো "স্থাবর" (যা স্থির থাকে)।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'ঢাকা বোর্ড',
    year: 2024,
    examType: 'SSC',
    tags: ['JONGGOM_STHABOR', 'DHAKA_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 136002,
    chapterId: 136,
    topicId: 13602,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: '"আবির্ভাব" শব্দের সঠিক বিপরীতার্থক শব্দ কোনটি?',
    questionEn: 'What is the correct antonym of "Abirbhab"?',
    options: ['তিরোভাব', 'পরাভাব', 'অভাব', 'বিভাব'],
    correctOptionIndex: 0,
    correctAnswerText: 'তিরোভাব',
    explanationBn: '"আবির্ভাব" (প্রকাশ পাওয়া)-এর প্রমিত বিপরীত শব্দ হলো "তিরোভাব" (অদৃশ্য বা অন্তর্হিত হওয়া)।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'রাজশাহী বোর্ড',
    year: 2023,
    examType: 'SSC',
    tags: ['ABIRBHAB_TIROBHAB', 'RAJSHAHI_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 136003,
    chapterId: 136,
    topicId: 13602,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: '"সংশয়" শব্দের সঠিক বিপরীতার্থক শব্দ কোনটি?',
    questionEn: 'What is the correct antonym of "Songshoy"?',
    options: ['প্রত্যয়', 'নিশ্চয়', 'বিশ্বাস', 'অসংশয়'],
    correctOptionIndex: 0,
    correctAnswerText: 'প্রত্যয়',
    explanationBn: '"সংশয়" (দ্বিধা বা সন্দেহ)-এর ব্যাকরণিক বিপরীত শব্দ হলো "প্রত্যয়" (দৃঢ় বিশ্বাস বা প্রত্যয়)।',
    difficulty: 'MEDIUM',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'যশোর বোর্ড',
    year: 2024,
    examType: 'SSC',
    tags: ['SONGSHOY_PROTTOY', 'JASHORE_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 136004,
    chapterId: 136,
    topicId: 13602,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: '"প্রাচ্য" শব্দের সঠিক বিপরীতার্থক শব্দ কোনটি?',
    questionEn: 'What is the correct antonym of "Prachyo"?',
    options: ['প্রতীচ্য', 'পাশ্চাত্য', 'উদীচ্য', 'অর্বাচীন'],
    correctOptionIndex: 0,
    correctAnswerText: 'প্রতীচ্য',
    explanationBn: 'প্রাচ্য (পূর্বদেশীয়)-এর সঠিক বিপরীত তৎসম রূপ হলো "প্রতীচ্য" (পশ্চিমদেশীয়)।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'কুমিল্লা বোর্ড',
    year: 2023,
    examType: 'SSC',
    tags: ['PRACHYO_PROTICHYO', 'CUMILLA_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 136005,
    chapterId: 136,
    topicId: 13601,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: '"ক্ষীয়মাণ" শব্দের সঠিক বিপরীতার্থক শব্দ কোনটি?',
    questionEn: 'What is the correct antonym of "Kshiyoman"?',
    options: ['বর্ধমান', 'বর্ধিষ্ণু', 'বৃহৎ', 'দীর্ঘ'],
    correctOptionIndex: 0,
    correctAnswerText: 'বর্ধমান',
    explanationBn: '"ক্ষীয়মাণ" (যা হ্রাস পাচ্ছে)-এর বিপরীত রূপ হলো "বর্ধমান" (যা বৃদ্ধি পাচ্ছে)।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'চট্টগ্রাম বোর্ড',
    year: 2024,
    examType: 'SSC',
    tags: ['KSHIYOMAN_BORDHOMAN', 'CHITTAGONG_BOARD'],
    status: 'ACTIVE'
  }
];

const CHAPTER_36_MODEL_TEST = {
  id: 13601,
  subject: 'BANGLA',
  chapterId: 136,
  testTitleBn: 'অধ্যায় ৩৬ মডেল টেস্ট: বিপরীতার্থক শব্দ',
  testTitleEn: 'Chapter 36 Model Test: Antonyms & Semantic Opposites',
  descriptionBn: 'জঙ্গম, আবির্ভাব, সংশয়, প্রাচ্য, ক্ষীয়মাণ এবং শীর্ষ ৬০টি বিপরীত শব্দের ওপর পূর্ণাঙ্গ মডেল টেস্ট।',
  durationMinutes: 10,
  totalMarks: 5,
  passPercentage: 60,
  difficulty: 'MEDIUM',
  questionCount: 5,
  questionIds: [136001, 136002, 136003, 136004, 136005],
  status: 'PUBLISHED'
};

// ============================================================================
// CHAPTER 37: পারিভাষিক শব্দ (Technical Terminology)
// ============================================================================
const CHAPTER_37_TOPICS = [
  {
    id: 13701,
    chapterId: 137,
    parentTopicId: null,
    subject: 'BANGLA',
    topicNo: '৩৭.১',
    titleBn: 'পারিভাষিক শব্দের সংজ্ঞা, প্রয়োজনীয়তা ও বাংলা পরিভাষার মূলনীতি',
    titleEn: 'Definition, Significance & Principles of Bengali Technical Terminology',
    slug: 'b37-paribhashik-shobdo-moulik-dharona',
    difficulty: 'BOARD_STANDARD',
    classLevel: 'Class 8 - 12 (SSC & HSC)',
    summaryBn: 'জ্ঞান-বিজ্ঞান, প্রশাসন ও পেশাগত ক্ষেত্রে বিশেষ কোনো অর্থ নির্দেশ করার জন্য নির্ধারিত বাংলা প্রতিশব্দকে পারিভাষিক শব্দ বলে।',
    definitionBn: 'পারিভাষিক শব্দ (Technical Terms / Terminology / Paribhashik Shobdo): বিশেষ কোনো জ্ঞানক্ষেত্র, বিজ্ঞান, প্রযুক্তি, প্রশাসন, আইন বা বাণিজ্যে সুনির্দিষ্ট কোনো ধারণা বা সংজ্ঞাকে অপরিবর্তনীয়ভাবে প্রকাশ করার জন্য যেসব শব্দ তৈরি বা গ্রহণ করা হয়, তাদের পারিভাষিক শব্দ বলে। যেমন: Affidavit = হলফনামা; Census = আদমশুমারি; File = নথি; Manuscript = পাণ্ডুলিপি। পরিভাষার প্রধান ৩টি বৈশিষ্ট্য: ১. সুনির্দিষ্ট ও অপরিবর্তনীয় অর্থ (No ambiguity) ২. আন্তর্জাতিক ধারণার সাথে সংগতিপূর্ণ বাংলা রূপ ৩. প্রমিত রূপ যা সংশ্লিষ্ট দপ্তরে আনুষ্ঠানিকভাবে স্বীকৃত।',
    definitionEn: 'Technical Terminology (Paribhasha) standardizes specialized domain nomenclature across administration, law, sciences, and commerce into standardized Bengali lexical items.',
    explanationBn: 'সাধারণ শব্দ বনাম পারিভাষিক শব্দের পার্থক্য:\n১. সাধারণ শব্দ: এক বা একাধিক সাধারণ অর্থ প্রকাশ করতে পারে এবং রচনায় পরিবর্তনশীল হতে পারে (যেমন: "নথি" সাধারণ কথায় কাগজপত্র হলেও প্রশাসনে "File" অর্থে চূড়ান্ত)।\n২. পারিভাষিক শব্দ: কোনো বিশেষ সংজ্ঞায়িত ধারণা প্রকাশ করে যার কোনো বিকল্প বসানো যায় না (যেমন: "Quota" সাধারণ অর্থে ভাগ হতে পারে, কিন্তু পারিভাষিক অর্থে "সংরক্ষণ" বা "কোটা")।\nবাংলা পরিভাষা প্রণয়নে রবীন্দ্রনাথ ঠাকুর ও ড. মুহম্মদ শহীদুল্লাহ্র অবদান অনস্বীকার্য। পারিভাষিক শব্দ ব্যবহারে বাংলা ভাষা আধুনিক বিজ্ঞান ও প্রাতিষ্ঠানিক কাজের পূর্ণাঙ্গ বাহন হিসেবে প্রতিষ্ঠিত হয়েছে।',
    teacherGoldenTips: 'গোল্ডেন ট্রিক: পরীক্ষায় পারিভাষিক শব্দ আসলে নিজের মতো মনগড়া অনুবাদ করবেন না! যেমন: "White paper" মানে "সাদা কাগজ" নয়, এটি একটি পারিভাষিক শব্দ যার অর্থ "শ্বেতপত্র" (সরকারি বিবরণী)!',
    rules: [
      {
        ruleNo: 1,
        nameBn: 'প্রমিত সরকারি ও প্রাতিষ্ঠানিক পরিভাষা নীতি',
        explanationBn: 'যেসব পারিভাষিক শব্দ বাংলা একাডেমি ও সরকারি গেজেটে চূড়ান্ত অনুমোদিত, পরীক্ষায় কেবল সেই রূপটিই লিখতে হবে।',
        examples: [
          {
            bn: 'Affidavit = হলফনামা (শুদ্ধ); প্রতিজ্ঞাপত্র (প্রচলিত নয় ❌)।',
            context: 'আইনি পরিভাষা'
          }
        ]
      }
    ],
    formulas: [
      {
        label: 'পরিভাষা সমীকরণ',
        structure: 'আন্তর্জাতিক প্রাতিষ্ঠানিক শব্দ (English) ↔ প্রমিত বাংলা পারিভাষিক শব্দ'
      }
    ],
    examples: [
      {
        bn: 'Autocracy = স্বৈরতন্ত্র',
        context: 'রাজনৈতিক'
      },
      {
        bn: 'Copyright = গ্রন্থস্বত্ব',
        context: 'আইনি'
      }
    ],
    exceptions: [
      {
        titleBn: 'আন্তর্জাতিক শব্দের হুবহু গ্রহণ',
        descriptionBn: 'অক্সিজেন, হাইড্রোজেন, কম্পিউটার, রেডিও ইত্যাদি বৈজ্ঞানিক পারিভাষিক শব্দ বাংলায় হুবহু গৃহীত হয়েছে।'
      }
    ],
    commonMistakes: [
      {
        incorrectBn: 'White Paper = সাদা কাগজ।',
        correctBn: 'White Paper = শ্বেতপত্র (সরকারি তথ্যপত্র)।',
        explanationBn: 'আক্ষরিক অনুবাদ পরিভাষায় সম্পূর্ণ অচল।'
      }
    ],
    writtenPractice: [
      {
        id: 1,
        type: 'TERMINOLOGY_MATCH',
        prompt: 'বাংলা পরিভাষা লিখ: (ক) Affidavit (খ) Census (গ) Manuscript (ঘ) White paper।',
        correctAnswer: '(ক) Affidavit = হলফনামা (খ) Census = আদমশুমারি (গ) Manuscript = পাণ্ডুলিপি (ঘ) White paper = শ্বেতপত্র।',
        explanationBn: 'বোর্ড পরীক্ষার নিশ্চিত ৪ নম্বরের পারিভাষিক প্রশ্ন।'
      }
    ],
    tags: ['PARIBHASHIK_SHOBDO', 'TECHNICAL_TERMS', 'AFFIDAVIT', 'CENSUS', 'MANUSCRIPT', 'SSC', 'HSC'],
    status: 'PUBLISHED',
    orderIndex: 1,
    viewCount: 480
  },
  {
    id: 13702,
    chapterId: 137,
    parentTopicId: null,
    subject: 'BANGLA',
    topicNo: '৩৭.২',
    titleBn: 'বোর্ড পরীক্ষায় সর্বাধিক কমন ৫০টি বিষয়ভিত্তিক পারিভাষিক শব্দ',
    titleEn: 'Top 50 Board Exam Domain-Specific Terminology Corpus',
    slug: 'b37-top-50-board-terminology-corpus',
    difficulty: 'BOARD_STANDARD',
    classLevel: 'Class 8 - 12 (SSC & HSC)',
    summaryBn: 'প্রশাসন, শিক্ষা, আইন, বিজ্ঞান ও বাণিজ্য বিষয়ের সর্বাধিক গুরুত্বপূর্ণ ৫০টি পারিভাষিক শব্দ ও বঙ্গানুবাদ।',
    definitionBn: 'উচ্চফলনশীল বিষয়ভিত্তিক পরিভাষা ভাণ্ডার:\n• প্রশাসন ও রাজনীতি:\n- Agenda = কার্যসূচি\n- Autocracy = স্বৈরতন্ত্র\n- Cabinet = মন্ত্রিসভা\n- Census = আদমশুমারি\n- Embargo = নিষেধাজ্ঞা\n- Memorandum = স্মারকলিপি\n- Quorum = ন্যূনতম উপস্থিতি / কোরাম\n- Sabotage = অন্তর্ঘাত\n- White paper = শ্বেতপত্র\n• আইন ও বিচার:\n- Affidavit = হলফনামা\n- Bail = জামিন\n- Deed = দলিল\n- Lien = স্বত্বনিয়োগ\n- Plaintiff = বাদী\n• বাণিজ্য ও অর্থনীতি:\n- Consumer goods = ভোগ্যপণ্য\n- Copyright = গ্রন্থস্বত্ব\n- Invoice = চালান\n- Tariff = শুল্ক\n• শিক্ষা ও সাহিত্য:\n- Dialect = উপভাষা\n- Index = নির্ঘণ্ট / সূচক\n- Manuscript = পাণ্ডুলিপি\n- Post-graduate = স্নাতকোত্তর\n- Transcript = প্রতিলিপি।',
    definitionEn: 'Curated bilingual glossary codifying verified official translations for key secondary and higher secondary examination terms.',
    explanationBn: 'বোর্ড পরীক্ষায় প্রায়ই আসা শীর্ষ ১০টি বিভ্রান্তিকর পরিভাষা:\n১. Sabotage = অন্তর্ঘাত (ধ্বংসাত্মক অন্তর্ঘাতী কাজ)\n২. Embargo = নিষেধাজ্ঞা (বাণিজ্যিক বা রাষ্ট্রীয় নিষেধাজ্ঞা)\n৩. Affidavit = হলফনামা (আদালতে শপথপত্র)\n৪. Census = আদমশুমারি (জনগণনা)\n৫. Manuscript = পাণ্ডুলিপি (হাতে লেখা মূল প্রতিলিপি)\n৬. Memorandum = স্মারকলিপি\n৭. Agenda = কার্যসূচি (সভার আলোচ্য বিষয়াবলি)\n৮. Quorum = কোরাম (সভার কাজ চালানোর ন্যূনতম উপস্থিতি)\n৯. Tariff = শুল্ক (আমদানি-রপ্তানি কর)\n১০. Copyright = গ্রন্থস্বত্ব (মেধা সম্পদের অধিকার)।',
    teacherGoldenTips: 'মনে রাখার সুপার চার্ট:\n• Agenda = কার্যসূচি!\n• Census = আদমশুমারি!\n• Affidavit = হলফনামা!\n• Sabotage = অন্তর্ঘাত!\n• Quorum = কোরাম / কোরাম উপস্থিতি!\n• Tariff = শুল্ক!',
    rules: [
      {
        ruleNo: 1,
        nameBn: 'বাংলা একাডেমির প্রমিত বানান অনুসরণ',
        explanationBn: 'পারিভাষিক শব্দের বাংলা প্রতিশব্দ লেখার সময় আধুনিক প্রমিত বানানবিধি কঠোরভাবে মেনে চলতে হয়।',
        examples: [
          {
            bn: 'আদমশুমারি (শুমারী ❌ নয়); কার্যসূচি (কার্যসূচী ❌ নয়)।',
            context: 'বানান সতর্কতা'
          }
        ]
      }
    ],
    formulas: [
      {
        label: 'পরিভাষা তালিকা সূত্র',
        structure: 'ইংরেজি পরিভাষা = বাংলা প্রমিত রূপ (প্রশাসনিক অর্থ)'
      }
    ],
    examples: [
      {
        bn: 'Census = আদমশুমারি (জনগণনা)',
        context: 'আদমশুমারি'
      },
      {
        bn: 'Sabotage = অন্তর্ঘাত',
        context: 'অন্তর্ঘাত'
      }
    ],
    exceptions: [
      {
        titleBn: 'দ্বৈত পরিভাষা',
        descriptionBn: 'Index-এর ক্ষেত্রে নির্ঘণ্ট ও সূচক উভয়টিই গ্রাহ্য; Quorum-এর ক্ষেত্রে কোরাম ও ন্যূনতম উপস্থিতি উভয়টিই শুদ্ধ।'
      }
    ],
    commonMistakes: [
      {
        incorrectBn: 'Agenda = আলোচনা।',
        correctBn: 'Agenda = কার্যসূচি।',
        explanationBn: 'কার্যসূচি হলো সভার লিখিত আলোচ্য বিষয়ের তালিকা।'
      }
    ],
    writtenPractice: [
      {
        id: 1,
        type: 'TERMINOLOGY_MATCH',
        prompt: 'বাংলা পরিভাষা লিখ: (ক) Agenda (খ) Sabotage (গ) Tariff (ঘ) Quorum।',
        correctAnswer: '(ক) Agenda = কার্যসূচি (খ) Sabotage = অন্তর্ঘাত (গ) Tariff = শুল্ক (ঘ) Quorum = কোরাম / ন্যূনতম উপস্থিতি।',
        explanationBn: 'বোর্ড পরীক্ষার অত্যন্ত আকর্ষণীয় ৪ নম্বরের পরিভাষা।'
      }
    ],
    tags: ['AGENDA', 'SABOTAGE', 'TARIFF', 'QUORUM', 'TOP_TERMINOLOGY', 'SSC', 'HSC'],
    status: 'PUBLISHED',
    orderIndex: 2,
    viewCount: 500
  }
];

const CHAPTER_37_MCQS = [
  {
    id: 137001,
    chapterId: 137,
    topicId: 13701,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: '"Affidavit" শব্দটির সঠিক বাংলা পরিভাষা কোনটি?',
    questionEn: 'What is the correct Bengali technical equivalent for "Affidavit"?',
    options: ['হলফনামা', 'স্মারকলিপি', 'পাণ্ডুলিপি', 'দলিল'],
    correctOptionIndex: 0,
    correctAnswerText: 'হলফনামা',
    explanationBn: 'আইনি পরিভাষায় Affidavit শব্দের স্বীকৃত প্রমিত বাংলা পরিভাষা হলো "হলফনামা"।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'ঢাকা বোর্ড',
    year: 2024,
    examType: 'SSC',
    tags: ['AFFIDAVIT_HOLOFNAMA', 'DHAKA_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 137002,
    chapterId: 137,
    topicId: 13702,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: '"Census" শব্দটির সঠিক বাংলা পারিভাষিক রূপ কোনটি?',
    questionEn: 'What is the correct Bengali technical equivalent for "Census"?',
    options: ['আদমশুমারি', 'ভোটাধিকার', 'জরিপ', 'নিবন্ধীকরণ'],
    correctOptionIndex: 0,
    correctAnswerText: 'আদমশুমারি',
    explanationBn: 'দেশের জনসংখ্যা গণনার প্রাতিষ্ঠানিক প্রক্রিয়ায় Census শব্দের পরিভাষা হলো "আদমশুমারি"।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'রাজশাহী বোর্ড',
    year: 2023,
    examType: 'SSC',
    tags: ['CENSUS_ADOMSHUMARI', 'RAJSHAHI_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 137003,
    chapterId: 137,
    topicId: 13702,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: '"Sabotage" শব্দটির সঠিক বাংলা পরিভাষা কোনটি?',
    questionEn: 'What is the correct Bengali technical equivalent for "Sabotage"?',
    options: ['অন্তর্ঘাত', 'আক্রমণ', 'বিদ্রোহ', 'বিক্ষোভ'],
    correctOptionIndex: 0,
    correctAnswerText: 'অন্তর্ঘাত',
    explanationBn: 'রাষ্ট্রীয় বা প্রশাসনিকভাবে কোনো প্রতিষ্ঠানকে গোপনে ধ্বংস বা ক্ষতিগ্রস্ত করার কাজে Sabotage-এর পরিভাষা "অন্তর্ঘাত"।',
    difficulty: 'MEDIUM',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'যশোর বোর্ড',
    year: 2024,
    examType: 'SSC',
    tags: ['SABOTAGE_ONTORGHAT', 'JASHORE_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 137004,
    chapterId: 137,
    topicId: 13702,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: '"Manuscript" শব্দটির সঠিক বাংলা পরিভাষা কোনটি?',
    questionEn: 'What is the correct Bengali technical equivalent for "Manuscript"?',
    options: ['পাণ্ডুলিপি', 'প্রতিলিপি', 'স্মারকলিপি', 'দলিল'],
    correctOptionIndex: 0,
    correctAnswerText: 'পাণ্ডুলিপি',
    explanationBn: 'হাতে লেখা আদি রচনা বা পুস্তকের মূল পাঠকে Manuscript বা "পাণ্ডুলিপি" বলে।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'কুমিল্লা বোর্ড',
    year: 2023,
    examType: 'SSC',
    tags: ['MANUSCRIPT_PANDULIPI', 'CUMILLA_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 137005,
    chapterId: 137,
    topicId: 13702,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: '"White Paper" শব্দটির প্রকৃত বাংলা পরিভাষা কোনটি?',
    questionEn: 'What is the correct Bengali technical equivalent for "White Paper"?',
    options: ['শ্বেতপত্র (সরকারি বিবরণী)', 'সাদা কাগজ', 'নথি', 'খসড়া আইন'],
    correctOptionIndex: 0,
    correctAnswerText: 'শ্বেতপত্র (সরকারি বিবরণী)',
    explanationBn: 'কোনো গুরুত্বপূর্ণ জাতীয় বিষয়ে সরকারের আনুষ্ঠানিক নীতিবিবরণী সম্বলিত পুস্তিকাকে White Paper বা "শ্বেতপত্র" বলে।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'চট্টগ্রাম বোর্ড',
    year: 2024,
    examType: 'SSC',
    tags: ['WHITE_PAPER_SHWETPOTRO', 'CHITTAGONG_BOARD'],
    status: 'ACTIVE'
  }
];

const CHAPTER_37_MODEL_TEST = {
  id: 13701,
  subject: 'BANGLA',
  chapterId: 137,
  testTitleBn: 'অধ্যায় ৩৭ মডেল টেস্ট: পারিভাষিক শব্দ',
  testTitleEn: 'Chapter 37 Model Test: Technical Terminology (Paribhashik Shobdo)',
  descriptionBn: 'Affidavit, Census, Sabotage, Manuscript, White Paper এবং শীর্ষ ৫০টি পারিভাষিক শব্দের ওপর পূর্ণাঙ্গ মডেল টেস্ট।',
  durationMinutes: 10,
  totalMarks: 5,
  passPercentage: 60,
  difficulty: 'MEDIUM',
  questionCount: 5,
  questionIds: [137001, 137002, 137003, 137004, 137005],
  status: 'PUBLISHED'
};

// ============================================================================
// CHAPTER 38: শুদ্ধ-অশুদ্ধ প্রয়োগ (Common Errors & Corrections)
// ============================================================================
const CHAPTER_38_TOPICS = [
  {
    id: 13801,
    chapterId: 138,
    parentTopicId: null,
    subject: 'BANGLA',
    topicNo: '৩৮.১',
    titleBn: 'শব্দ ও বাক্যে ব্যাকরণিক অশুদ্ধির কারণসমূহ ও প্রতিকার',
    titleEn: 'Causes of Morphological & Syntactic Errors in Bengali & Remedies',
    slug: 'b38-oshuddhir-karon-o-protikar',
    difficulty: 'BOARD_STANDARD',
    classLevel: 'Class 8 - 12 (SSC & HSC)',
    summaryBn: 'বাংলা ভাষায় ব্যাকরণগত ভুলের প্রধান উৎস হলো: বাহুল্য দোষ, প্রত্যয়জনিত ভুল, বচন ও লিঙ্গঘটিত ভুল, সন্ধি ও সমাসঘটিত ভুল এবং পদক্রমের বিভ্রান্তি।',
    definitionBn: 'শুদ্ধ-অশুদ্ধ প্রয়োগ (Grammatical Correctness & Errors): ভাষায় শব্দ ও বাক্যের ব্যাকরণসম্মত ও প্রমিত রূপ রক্ষা করার প্রক্রিয়া। ভুল মূলত ৩ স্তরে ঘটে:\n১. শব্দগত ও বানানগত ভুল: অদ্ভুত (অদ্ভূত ❌); সান্ত্বনা (শান্তনা ❌); স্বায়ত্তশাসন (স্বায়ত্বশাসন ❌)।\n২. প্রত্যয়জনিত আতিশয্য: দৈন্যতা (ভুল ❌; শুদ্ধ: দীনতা বা দৈন্য); সৌজন্যতা (ভুল ❌; শুদ্ধ: সৌজন্য); উৎকর্ষতা (ভুল ❌; শুদ্ধ: উৎকর্ষ বা উৎকৃষ্টতা)।\n৩. বাক্যগত গঠন ও বাহুল্য দোষ: সকল ছাত্রগণ (ভুল ❌; শুদ্ধ: সকল ছাত্র অথবা ছাত্রগণ); খাঁটি গরুর দুধ (ভুল ❌; শুদ্ধ: গরুর খাঁটি দুধ)।',
    definitionEn: 'Syntactic and morphological errors in Bengali stem predominantly from pleonastic plurality, redundant nominal suffixes (-ta affixed to already abstract roots), misaligned adjectival placement, and Tatsama sandhi errors.',
    explanationBn: 'বোর্ড পরীক্ষায় বারবার আসা ৪টি মারাত্মক ভুল বিশ্লেষণ:\n১. "দৈন্যতা / সৌজন্যতা / উৎকর্ষতা" ভুল কেন?\n"দীন", "সুজন" ও "উৎকৃষ্ট" বিশেষণ শব্দের সাথে "য" প্রত্যয় যুক্ত হয়ে ইতিমধ্যে "দৈন্য", "সৌজন্য" ও "উৎকর্ষ" ভাববাচক বিশেষ্য গঠিত হয়েছে। এর সাথে পুনরায় "তা" প্রত্যয় যোগ করা ব্যাকরণিক অতিরিক্ত দোষ (Redundancy)। তাই শুদ্ধ হলো: "দীনতা" অথবা "দৈন্য"!\n২. "সকল ছাত্রগণ উপস্থিত" ভুল কেন?\n"সকল" নিজেই বহুবচন, আবার "গণ"-ও বহুবচনবাচক প্রত্যয়। একই বাক্যে দুটি বহুবচনবোধক শব্দ বসানোকে "বাহুল্য দোষ" বা দ্বিবচন দোষ বলে। শুদ্ধ: "সকল ছাত্র উপস্থিত" অথবা "ছাত্রগণ উপস্থিত"।\n৩. "খাঁটি গরুর দুধ" ভুল কেন?\nএখানে বিশেষণ "খাঁটি" বসেছে "গরু"-র পূর্বে, যেন গরু নিজেই খাঁটি! আসলে খাঁটি হলো "দুধ"। তাই আসত্তির নিয়ম রক্ষার্থে শুদ্ধ রূপ: "গরুর খাঁটি দুধ"।\n৪. "সপরিবারে আমন্ত্রিত" বনাম "সপরিবার":\n"স" (সহিত অর্থে) উপসর্গযোগে সপরিবার নিজেই বহুব্রীহি সমাসবদ্ধ পদ (পরিবারের সহিত বর্তমান)। এর সাথে অতিরিক্ত "এ" বিভক্তি বা ব-ফলা দিলে অর্থ বিকৃত হয়। শুদ্ধ: "আপনি সপরিবার আমন্ত্রিত"।',
    teacherGoldenTips: 'গোল্ডেন টেবিল:\n• দৈন্যতা ❌ → দীনতা / দৈন্য ✅\n• সৌজন্যতা ❌ → সৌজন্য ✅\n• সকল ছাত্রগণ ❌ → সকল ছাত্র / ছাত্রগণ ✅\n• খাঁটি গরুর দুধ ❌ → গরুর খাঁটি দুধ ✅\n• উপরোক্ত ❌ → উপরিউক্ত ✅',
    rules: [
      {
        ruleNo: 1,
        nameBn: 'দ্বৈত প্রত্যয় বর্জন বিধান',
        explanationBn: 'য-প্রত্যয়ান্ত শব্দের শেষে পুনরায় তা-প্রত্যয় যুক্ত করে বিশেষ্য গঠন করা সম্পূর্ণ ব্যাকরণবিরুদ্ধ।',
        examples: [
          {
            bn: 'দীনতা বা দৈন্য (শুদ্ধ) বনাম দৈন্যতা (অশুদ্ধ ❌)।',
            context: 'প্রত্যয় দোষ'
          }
        ]
      }
    ],
    formulas: [
      {
        label: 'শুদ্ধিকরণ সমীকরণ',
        structure: 'অশুদ্ধ (দৈন্যতা / সকল ছাত্রগণ) ↔ শুদ্ধ (দীনতা বা দৈন্য / সকল ছাত্র)'
      }
    ],
    examples: [
      {
        bn: 'তার দীনতা দেখে কষ্ট হলো (শুদ্ধ)',
        context: 'দীনতা'
      },
      {
        bn: 'ছাত্রগণ শ্রেণিকক্ষে উপস্থিত (শুদ্ধ)',
        context: 'ছাত্রগণ'
      }
    ],
    exceptions: [
      {
        titleBn: 'প্রচলিত একবচনে সমষ্টিবাচক শব্দ',
        descriptionBn: 'শ্রেণি, দল ইত্যাদি শব্দ একবচন হলেও সমষ্টির পরিচয় বহন করে।'
      }
    ],
    commonMistakes: [
      {
        incorrectBn: 'উপরোক্ত কথাটি সত্য।',
        correctBn: 'উপরিউক্ত কথাটি সত্য (বা উপর্যুক্ত)।',
        explanationBn: 'উপরি + উক্ত = উপরিউক্ত বা উপর্যুক্ত; "উপরোক্ত" ব্যাকরণগতভাবে অশুদ্ধ সন্ধি।'
      }
    ],
    writtenPractice: [
      {
        id: 1,
        type: 'ERROR_CORRECTION',
        prompt: 'অশুদ্ধ বাক্যগুলো শুদ্ধ করো: (ক) সকল ছাত্রগণ উপস্থিত আছে। (খ) তার দৈন্যতা দেখে মায়া হলো। (গ) এখানে খাঁটি গরুর দুধ পাওয়া যায়।',
        correctAnswer: '(ক) সকল ছাত্র উপস্থিত আছে (বা ছাত্রগণ উপস্থিত আছে)। (খ) তার দীনতা (বা দৈন্য) দেখে মায়া হলো। (গ) এখানে গরুর খাঁটি দুধ পাওয়া যায়।',
        explanationBn: 'বোর্ড পরীক্ষার নিশ্চিত ৩ নম্বরের বাক্য শুদ্ধিকরণ।'
      }
    ],
    tags: ['SHUDDHO_OSHUDDHO', 'ERROR_CORRECTION', 'DOYNYOTA', 'SHOKOL_CHATRO', 'SSC', 'HSC'],
    status: 'PUBLISHED',
    orderIndex: 1,
    viewCount: 520
  },
  {
    id: 13802,
    chapterId: 138,
    parentTopicId: null,
    subject: 'BANGLA',
    topicNo: '৩৮.২',
    titleBn: 'বোর্ড পরীক্ষায় সর্বাধিক আসা ৪০টি অশুদ্ধ বাক্যের প্রমিত সংশোধন',
    titleEn: 'Top 40 Board Exam Sentence Error Corrections & Rules',
    slug: 'b38-top-40-board-sentence-corrections',
    difficulty: 'BOARD_STANDARD',
    classLevel: 'Class 8 - 12 (SSC & HSC)',
    summaryBn: 'বিগত ১৫ বছরের এইচএসসি ও এসএসসি পরীক্ষায় সবচেয়ে বেশি আসা ৪০টি অশুদ্ধ বাক্যের শুদ্ধ রূপ ও ব্যাকরণিক কারণ।',
    definitionBn: 'ক্লাসিক বোর্ড অশুদ্ধ বাক্য ও সংশোধিত রূপ:\n১. অশুদ্ধ: আপনি সপরিবারে আমন্ত্রিত। → শুদ্ধ: আপনি সপরিবার আমন্ত্রিত। (কারণ: সপরিবার নিজেই বহুব্রীহি সমাসবদ্ধ পদ)\n২. অশুদ্ধ: উপরোক্ত বাক্যটি সঠিক নয়। → শুদ্ধ: উপরিউক্ত বাক্যটি সঠিক নয়। (কারণ: সন্ধিজাত শুদ্ধ রূপ উপরিউক্ত)\n৩. অশুদ্ধ: বিদ্যান মূর্খ অপেক্ষা শ্রেষ্ঠ। → শুদ্ধ: বিদ্বান মূর্খ অপেক্ষা শ্রেষ্ঠ। (কারণ: বানান বিদ্বান)\n৪. অশুদ্ধ: আমি অপমান হয়েছি। → শুদ্ধ: আমি অপমানিত হয়েছি। (কারণ: অপমান বিশেষ্য, বাক্যে বিশেষণ অপমানিত হবে)\n৫. অশুদ্ধ: আবশ্যকীয় ব্যয়ে কার্পণ্য অনুচিত। → শুদ্ধ: আবশ্যক ব্যয়ে কার্পণ্য অনুচিত। (কারণ: আবশ্যক নিজেই বিশেষণ)\n৬. অশুদ্ধ: মেয়েটি বিদুষী ও সুন্দরী। → শুদ্ধ: মেয়েটি বিদুষী ও রূপবতী (বা সুন্দর)।\n৭. অশুদ্ধ: তাহার বৈমাত্রেয় সহোদর ভাই আসিয়াছে। → শুদ্ধ: তাহার বৈমাত্রেয় ভাই আসিয়াছে। (কারণ: বৈমাত্রেয় ও সহোদর পরস্পরবিরোধী)\n৮. অশুদ্ধ: আকণ্ঠ পর্যন্ত ভোজন করা অনুচিত। → শুদ্ধ: আকণ্ঠ ভোজন করা অনুচিত। (কারণ: আকণ্ঠ মানেই কণ্ঠ পর্যন্ত; "পর্যন্ত" বাহুল্য দোষ)।',
    definitionEn: 'An empirical corpus of 40 recurring board examination sentences corrected across case endings, prefix redundancy, and semantic self-contradictions.',
    explanationBn: 'বাক্য সংশোধনের দ্রুত সমাধান পদ্ধতি:\n১. বাক্যে "আকণ্ঠ", "আমরণ", "আজানু"-র সাথে "পর্যন্ত" দেখলে সঙ্গে সঙ্গে "পর্যন্ত" কেটে দিন! (কারণ "আ" উপসর্গ নিজেই "পর্যন্ত" অর্থ দেয়; যেমন: আকণ্ঠ পর্যন্ত ❌ → আকণ্ঠ ✅)।\n২. "সকল", "সব", "সমুদয়"-এর পর "গণ", "বৃন্দ", "সমূহ" দেখলে যেকোনো একটি বহুবচন রাখুন! (যেমন: সকল সদস্যগণ ❌ → সকল সদস্য ✅)।\n৩. "উপরোক্ত" দেখলেই "উপরিউক্ত" বা "উপর্যুক্ত" লিখুন!\n৪. "সপরিবারে" দেখলেই "সপরিবার" লিখুন!',
    teacherGoldenTips: 'পরীক্ষার ম্যাজিক শর্টকাট:\n• আকণ্ঠ পর্যন্ত ❌ → আকণ্ঠ ✅\n• আমৃত্যু পর্যন্ত ❌ → আমৃত্যু ✅\n• সকল সদস্যগণ ❌ → সকল সদস্য ✅\n• উপরোক্ত ❌ → উপরিউক্ত ✅',
    rules: [
      {
        ruleNo: 1,
        nameBn: 'উপসর্গঘটিত বাহুল্য বর্জন',
        explanationBn: 'আ-উপসর্গযুক্ত শব্দের পর "পর্যন্ত" অনুসর্গের পুনরাবৃত্তি বর্জনীয়।',
        examples: [
          {
            bn: 'আকণ্ঠ ভোজন (শুদ্ধ) বনাম আকণ্ঠ পর্যন্ত ভোজন (অশুদ্ধ ❌)।',
            context: 'উপসর্গ বাহুল্য'
          }
        ]
      }
    ],
    formulas: [
      {
        label: 'বাহুল্য বর্জন ছক',
        structure: 'আকণ্ঠ + পর্যন্ত = ভুল | আকণ্ঠ = শুদ্ধ'
      }
    ],
    examples: [
      {
        bn: 'তিনি আকণ্ঠ ভোজন করলেন (শুদ্ধ)',
        context: 'আকণ্ঠ'
      },
      {
        bn: 'উপরিউক্ত মন্তব্যটি প্রণিধানযোগ্য (শুদ্ধ)',
        context: 'উপরিউক্ত'
      }
    ],
    exceptions: [
      {
        titleBn: 'চলিত বাক্যে সাধু ক্রিয়া মিশ্রণ বর্জন',
        descriptionBn: '"তিনি ভাত খাইতেছেন এবং স্কুলে যাবেন"—এটি গুরুচণ্ডালী ও ক্রিয়ারীতি মিশ্রণ দোষ। শুদ্ধ: তিনি ভাত খাচ্ছেন এবং স্কুলে যাবেন।'
      }
    ],
    commonMistakes: [
      {
        incorrectBn: 'তিনি স্বপরিবারে থাকেন (দন্ত্য-স-এ ব-ফলা দিয়ে)।',
        correctBn: 'তিনি সপরিবারে থাকেন (ব-ফলা ছাড়া "স", অর্থ পরিবারসহ)।',
        explanationBn: '"স্ব" (ব-ফলা) মানে নিজের; আর "স" মানে সহিত।'
      }
    ],
    writtenPractice: [
      {
        id: 1,
        type: 'ERROR_CORRECTION',
        prompt: 'শুদ্ধ করে লিখ: (ক) তিনি আকণ্ঠ পর্যন্ত খেলেন। (খ) আপনি সপরিবারে আমন্ত্রিত। (গ) উপরোক্ত ঘটনা সত্য।',
        correctAnswer: '(ক) তিনি আকণ্ঠ খেলেন। (খ) আপনি সপরিবার আমন্ত্রিত। (গ) উপরিউক্ত ঘটনা সত্য।',
        explanationBn: 'বোর্ড পরীক্ষার নিশ্চিত ৩ নম্বরের শুদ্ধিকরণ।'
      }
    ],
    tags: ['AKONTHO', 'UPORIUKTO', 'SHOBARIBAR', 'CORRECTIONS', 'SSC', 'HSC'],
    status: 'PUBLISHED',
    orderIndex: 2,
    viewCount: 540
  }
];

const CHAPTER_38_MCQS = [
  {
    id: 138001,
    chapterId: 138,
    topicId: 13801,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: '"সকল ছাত্রগণ উপস্থিত আছে"—বাক্যটিতে কোন দোষ ঘটেছে?',
    questionEn: 'What error occurred in the sentence "Shokol chhatrogon uposthit achhe"?',
    options: ['বাহুল্য বা দ্বিবচন দোষ', 'গুরুচণ্ডালী দোষ', 'উপমার ভুল প্রয়োগ', 'আসত্তির অভাব'],
    correctOptionIndex: 0,
    correctAnswerText: 'বাহুল্য বা দ্বিবচন দোষ',
    explanationBn: '"সকল" এবং "গণ" দুটি বহুবচনবোধক পদের অপ্রয়োজনীয় ব্যবহারে বাক্যটিতে বাহুল্য দোষ ঘটেছে।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'ঢাকা বোর্ড',
    year: 2024,
    examType: 'SSC',
    tags: ['BAHULLYO_DOSH', 'DHAKA_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 138002,
    chapterId: 138,
    topicId: 13801,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: '"দৈন্যতা প্রশংসনীয় নয়"—বাক্যটির ব্যাকরণসম্মত শুদ্ধ রূপ কোনটি?',
    questionEn: 'What is the grammatically correct form of "Doynyota proshongshonio noy"?',
    options: ['দীনতা প্রশংসনীয় নয় (বা দৈন্য প্রশংসনীয় নয়)', 'দৈন্যতাহীনতা প্রশংসনীয় নয়', 'দীন প্রশংসনীয় নয়', 'দৈন্যতা ভালো নয়'],
    correctOptionIndex: 0,
    correctAnswerText: 'দীনতা প্রশংসনীয় নয় (বা দৈন্য প্রশংসনীয় নয়)',
    explanationBn: '"দৈন্য" নিজেই ভাববাচক বিশেষ্য, এর সাথে অতিরিক্ত "তা" যোগ করা ব্যাকরণিক ভুল; শুদ্ধ হলো "দীনতা" অথবা "দৈন্য"।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'রাজশাহী বোর্ড',
    year: 2023,
    examType: 'SSC',
    tags: ['DINOTA_DOYNYO', 'RAJSHAHI_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 138003,
    chapterId: 138,
    topicId: 13802,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: '"উপরোক্ত বাক্যটি শুদ্ধ নয়"—এখানে "উপরোক্ত"-এর ব্যাকরণসম্মত শুদ্ধ রূপ কোনটি?',
    questionEn: 'What is the correct grammatical form of "Uporokto"?',
    options: ['উপরিউক্ত (বা উপর্যুক্ত)', 'উপরস্থ', 'উপরে লিখিত', 'উপরি'],
    correctOptionIndex: 0,
    correctAnswerText: 'উপরিউক্ত (বা উপর্যুক্ত)',
    explanationBn: 'সন্ধির ব্যাকরণিক নিয়মে উপরি + উক্ত = উপরিউক্ত (বা উপর্যুক্ত); "উপরোক্ত" একটি অশুদ্ধ সন্ধি।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'যশোর বোর্ড',
    year: 2024,
    examType: 'SSC',
    tags: ['UPORIUKTO', 'JASHORE_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 138004,
    chapterId: 138,
    topicId: 13802,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: '"তিনি আকণ্ঠ পর্যন্ত ভোজন করিলেন"—বাক্যটির শুদ্ধ রূপ কোনটি?',
    questionEn: 'What is the correct form of "Tini akontho porjonto bhojon korilen"?',
    options: ['তিনি আকণ্ঠ ভোজন করিলেন', 'তিনি কণ্ঠ পর্যন্ত ভোজন না করিলেন', 'তিনি আকণ্ঠ পর্যন্ত খাইলেন', 'তিনি গলা পর্যন্ত খাইলেন'],
    correctOptionIndex: 0,
    correctAnswerText: 'তিনি আকণ্ঠ ভোজন করিলেন',
    explanationBn: '"আকণ্ঠ" শব্দের "আ" উপসর্গ নিজেই "পর্যন্ত" অর্থ প্রকাশ করে, তাই পুনরায় "পর্যন্ত" অনুসর্গ ব্যবহার বাহুল্য দোষ।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'কুমিল্লা বোর্ড',
    year: 2023,
    examType: 'SSC',
    tags: ['AKONTHO_CORRECTION', 'CUMILLA_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 138005,
    chapterId: 138,
    topicId: 13802,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: '"আপনি সপরিবারে আমন্ত্রিত"—বাক্যটির শুদ্ধ রূপ কোনটি?',
    questionEn: 'What is the correct grammatical form for the invitation sentence?',
    options: ['আপনি সপরিবার আমন্ত্রিত', 'আপনি স্বপরিবারে আমন্ত্রিত', 'আপনি পরিবার সহিত আমন্ত্রিত হলেন', 'আপনি সপরিবারসহ আমন্ত্রিত'],
    correctOptionIndex: 0,
    correctAnswerText: 'আপনি সপরিবার আমন্ত্রিত',
    explanationBn: '"সপরিবার" নিজেই বহুব্রীহি সমাসবদ্ধ পদ (পরিবারের সহিত বর্তমান যিনি); এর সাথে "এ" বিভক্তি যোগ না করে "সপরিবার" লেখাই প্রমিত।',
    difficulty: 'MEDIUM',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'চট্টগ্রাম বোর্ড',
    year: 2024,
    examType: 'SSC',
    tags: ['SOPORIBAR_CORRECTION', 'CHITTAGONG_BOARD'],
    status: 'ACTIVE'
  }
];

const CHAPTER_38_MODEL_TEST = {
  id: 13801,
  subject: 'BANGLA',
  chapterId: 138,
  testTitleBn: 'অধ্যায় ৩৮ মডেল টেস্ট: শুদ্ধ-অশুদ্ধ প্রয়োগ',
  testTitleEn: 'Chapter 38 Model Test: Common Errors & Syntactic/Morphological Corrections',
  descriptionBn: 'বাহুল্য দোষ, দীনতা বনাম দৈন্যতা, উপরিউক্ত, আকণ্ঠ, সপরিবার এবং শীর্ষ ৪০টি বাক্য শুদ্ধিকরণের ওপর পূর্ণাঙ্গ মডেল টেস্ট।',
  durationMinutes: 10,
  totalMarks: 5,
  passPercentage: 60,
  difficulty: 'MEDIUM',
  questionCount: 5,
  questionIds: [138001, 138002, 138003, 138004, 138005],
  status: 'PUBLISHED'
};

// ============================================================================
// CHAPTER 39: বিরামচিহ্ন বা যতিচিহ্নের ব্যবহার (Punctuation Marks)
// ============================================================================
const CHAPTER_39_TOPICS = [
  {
    id: 13901,
    chapterId: 139,
    parentTopicId: null,
    subject: 'BANGLA',
    topicNo: '৩৯.১',
    titleBn: 'বিরামচিহ্নের সংজ্ঞা, বাংলা ভাষায় প্রবর্তন ও সকল যতিচিহ্নের বিরতিকাল',
    titleEn: 'Definition of Punctuation, Historical Introduction & Pause Durations',
    slug: 'b39-biramchinho-shongpga-o-birotikal',
    difficulty: 'BOARD_STANDARD',
    classLevel: 'Class 8 - 12 (SSC & HSC)',
    summaryBn: 'লেখার বক্তব্যকে স্পষ্ট, বোধগম্য ও অর্থপূর্ণ করার জন্য বাক্যের মাঝে বা শেষে যেসব সংকেতচিহ্ন ব্যবহার করা হয়, তাদের বিরামচিহ্ন বা যতিচিহ্ন বলে। ঈশ্বরচন্দ্র বিদ্যাসাগর প্রথম বাংলা গদ্যে এর সুশৃঙ্খল প্রবর্তন করেন।',
    definitionBn: 'বিরামচিহ্ন বা যতিচিহ্ন (Punctuation Marks / Biramchinho): বাক্য পাঠকালে অর্থের সংগতি রক্ষা, ভাব সুস্পষ্টকরণ এবং সঠিক উচ্চারণের সুবিধার্থে যে সাংকেতিক চিহ্নগুলো দ্বারা কোথায় কতটুকু থামতে হবে তা নির্দেশ করা হয়, তাদের বিরামচিহ্ন বা যতিচিহ্ন বলে। ১৮৪৭ সালে ঈশ্বরচন্দ্র বিদ্যাসাগর তাঁর রচিত "বেতাল পঞ্চবিংশতি" গ্রন্থে বাংলা ভাষায় সর্বপ্রথম সুশৃঙ্খল যতিচিহ্নের প্রবর্তন করেন।\nবিরতিকালের সুনির্দিষ্ট তালিকা:\n১. ১ (এক) বলার সময় থামতে হয়:\n• কমা ( , ) বা পাদচ্ছেদ\n• উদ্ধৃতি চিহ্ন ( “ ” )\n২. ১ (এক) বলার দ্বিগুণ সময় থামতে হয়:\n• সেমিকোলন ( ; )\n৩. ১ (এক) সেকেন্ড থামতে হয়:\n• দাঁড়ি ( । ) বা পূর্ণচ্ছেদ\n• প্রশ্নবোধক চিহ্ন ( ? )\n• বিস্ময়সূচক চিহ্ন ( ! )\n• কোলন ( : )\n• ড্যাশ ( — )\n• কোলন ড্যাশ ( :- )\n৪. থামার প্রয়োজন নেই:\n• হাইফেন ( - )\n• বন্ধনী চিহ্ন [ ( ), { }, [ ] ]\n• ইলেক বা লোপচিহ্ন ( \' )।',
    definitionEn: 'Punctuation marks (Biramchinho/Yotichinho) regulate syntactic boundaries, prosody, and semantic clarity. Systematized into Bengali literature by Ishwar Chandra Vidyasagar in 1847.',
    explanationBn: 'পরীক্ষায় সবচেয়ে বেশি আসা বিরতিকাল ছক:\n১. কমা (Padecchhed): ১ গণনা করার সময় থামতে হয়। সম্বোধনের পর, একাধিক সমজাতীয় পদের মাঝে কমা বসে।\n২. সেমিকোলন (Semicolon): কমার দ্বিগুণ সময় থামতে হয়। পরস্পর সম্পর্কযুক্ত একাধিক খণ্ডবাক্যের মাঝে সেমিকোলন বসে।\n৩. দাঁড়ি (Purnocchhed): ১ সেকেন্ড থামতে হয়। বাক্যের পূর্ণ সমাপ্তিতে বসে।\n৪. হাইফেন বনাম ড্যাশ:\n• হাইফেন (-) দুটি সমাসবদ্ধ পদকে জোড়া লাগাতে বসে, এখানে থামার কোনো প্রয়োজন নেই।\n• ড্যাশ (—) কোনো ভাব বা ব্যাখ্যার বিস্তারিত সংযোগে বসে, এখানে ১ সেকেন্ড থামতে হয়।\n৫. কোলন বনাম কোলন ড্যাশ:\nউদাহরণ বা দৃষ্টান্ত দেওয়ার সময় কোলন (:) বা কোলন ড্যাশ (:-) বসে।',
    teacherGoldenTips: 'মাস্টার চার্ট মুখস্থ রাখুন:\n• ১ বলার সময় = কমা ও উদ্ধৃতি চিহ্ন!\n• কমার দ্বিগুণ সময় = সেমিকোলন!\n• ১ সেকেন্ড = দাঁড়ি, প্রশ্নবোধক, বিস্ময়, কোলন, ড্যাশ!\n• থামার প্রয়োজন নেই = হাইফেন, বন্ধনী, লোপচিহ্ন!\n• প্রবর্তক = ঈশ্বরচন্দ্র বিদ্যাসাগর (১৮৪৭ সালে)!',
    rules: [
      {
        ruleNo: 1,
        nameBn: 'সম্বোধন পদের পর কমা বিধান',
        explanationBn: 'বাক্যের শুরুতে বা মাঝে কাউকে সম্বোধন করা হলে তার ঠিক পরপরই কমা (,) বসানো বাধ্যতামূলক।',
        examples: [
          {
            bn: 'সুমন, এদিকে এসো। রফিক, তুমি কি বাড়ি যাবে?',
            context: 'সম্বোধনে কমা'
          }
        ]
      }
    ],
    formulas: [
      {
        label: 'বিরতিকাল সূত্র',
        structure: 'কমা = ১ গণনা | সেমিকোলন = কমার দ্বিগুণ | দাঁড়ি/প্রশ্ন/বিস্ময়/কোলন/ড্যাশ = ১ সেকেন্ড'
      }
    ],
    examples: [
      {
        bn: 'তিনি এলেন, বসলেন এবং কথা বললেন (কমার ব্যবহার)',
        context: 'কমা'
      },
      {
        bn: 'সূর্য অস্ত গেল; চারিদিক অন্ধকারে ঢেকে গেল (সেমিকোলন)',
        context: 'সেমিকোলন'
      }
    ],
    exceptions: [
      {
        titleBn: 'ইলেক বা লোপচিহ্নের আধুনিক বর্জন',
        descriptionBn: 'আধুনিক বাংলা বানানে শব্দের বর্ণ লোপ বোঝাতে লোপচিহ্ন (\') ব্যবহারের প্রবণতা কমে গেছে (যেমন: \'হইল\'-এর স্থলে সরাসরি \'হলো\' লেখা হয়)।'
      }
    ],
    commonMistakes: [
      {
        incorrectBn: 'হাইফেন ও ড্যাশকে একই মনে করা।',
        correctBn: 'হাইফেন আকারে ছোট এবং থামার প্রয়োজন নেই; ড্যাশ আকারে বড় এবং ১ সেকেন্ড থামতে হয়।',
        explanationBn: 'উভয়ের ব্যাকরণিক ভূমিকা সম্পূর্ণ ভিন্ন।'
      }
    ],
    writtenPractice: [
      {
        id: 1,
        type: 'PUNCTUATION_PAUSE',
        prompt: 'নিচের বিরামচিহ্নগুলোর বিরতিকাল লিখ: (ক) কমা (খ) সেমিকোলন (গ) দাঁড়ি (ঘ) হাইফেন।',
        correctAnswer: '(ক) কমা: ১ বলার সময়। (খ) সেমিকোলন: ১ বলার দ্বিগুণ সময়। (গ) দাঁড়ি: ১ সেকেন্ড। (ঘ) হাইফেন: থামার প্রয়োজন নেই।',
        explanationBn: 'বোর্ড পরীক্ষার নিশ্চিত ৪ নম্বরের বিরামচিহ্ন প্রশ্ন।'
      }
    ],
    tags: ['BIRAMCHINHO', 'PUNCTUATION', 'COMMA', 'SEMICOLON', 'DARI', 'VIDYASAGAR', 'SSC', 'HSC'],
    status: 'PUBLISHED',
    orderIndex: 1,
    viewCount: 510
  },
  {
    id: 13902,
    chapterId: 139,
    parentTopicId: null,
    subject: 'BANGLA',
    topicNo: '৩৯.২',
    titleBn: 'কমা, সেমিকোলন, কোলন ও উদ্ধৃতি চিহ্নের প্রমিত প্রয়োগরীতি',
    titleEn: 'Standard Rules of Comma, Semicolon, Colon & Quotation Marks Application',
    slug: 'b39-promito-proyog-riti',
    difficulty: 'BOARD_STANDARD',
    classLevel: 'Class 8 - 12 (SSC & HSC)',
    summaryBn: 'বাংলা অনুচ্ছেদ ও সংলাপে বিরামচিহ্নের যথার্থ স্থাপন এবং যতিচিহ্নের অপপ্রয়োগে সৃষ্ট অর্থ বিভ্রাট দূরীকরণ।',
    definitionBn: 'প্রধান যতিচিহ্নের বাস্তব প্রয়োগরীতি:\n১. কমা ( , ):\n• সমজাতীয় একাধিক পদ পাশাপাশি বসলে শেষ পদটি ছাড়া প্রতিটির পর কমা বসে (যেমন: আম, জাম, কাঁঠাল ও লিচু গ্রীষ্মকালীন ফল)।\n• জটিল বাক্যের আশ্রিত খণ্ডবাক্যের পর (যেমন: যদি পরিশ্রম করো, তবেই সফল হবে)।\n• প্রত্যক্ষ উক্তির পূর্বে (যেমন: শিক্ষক বললেন, "সদা সত্য কথা বলবে")।\n২. সেমিকোলন ( ; ):\n• যোজকবিহীন একাধিক স্বাধীন খণ্ডবাক্যকে সংযুক্ত করতে (যেমন: মেঘ ডাকছে; এখনই বৃষ্টি নামবে)।\n৩. কোলন ( : ) ও কোলন ড্যাশ ( :- ):\n• উদাহরণ বা উদাহরণমালা প্রদর্শনে (যেমন: বাংলা পদ পাঁচ প্রকার: বিশেষ্য, সর্বনাম, বিশেষণ, ক্রিয়া ও অব্যয়)।\n৪. উদ্ধৃতি চিহ্ন ( “ ” ):\n• বক্তার মূল বক্তব্য হুবহু অবিকল উদ্ধৃত করতে (যেমন: বঙ্গবন্ধু বললেন, "এবারের সংগ্রাম আমাদের মুক্তির সংগ্রাম")।',
    definitionEn: 'Applied syntactic punctuation: resolving clause boundary ambiguities, embedding direct citations, and orchestrating list delimiters.',
    explanationBn: 'বিরামচিহ্নের অপপ্রয়োগে কীভাবে অর্থের মারাত্মক বিকৃতি ঘটে তার বিখ্যাত উদাহরণ:\n"এখানে প্রস্রাব করিবেন না, করিলে পঞ্চাশ টাকা জরিমানা হইবে।"\nএখন যদি কমাটি "না"-এর পূর্বে বসানো হয়:\n"এখানে প্রস্রাব করিবেন, না করিলে পঞ্চাশ টাকা জরিমানা হইবে!"\nলক্ষ্য করুন—একটিমাত্র কমার স্থান পরিবর্তনে সম্পূর্ণ অর্থ উল্টো ও আইনবিরোধী হয়ে যায়! তাই বিরামচিহ্ন স্থাপন অত্যন্ত দায়িত্বশীল ব্যাকরণিক কাজ।',
    teacherGoldenTips: 'গোল্ডেন নোট:\n• সংলাপ লিখতে উদ্ধৃতি চিহ্ন (“ ”) লাগবে!\n• উদ্ধৃতি চিহ্নের ঠিক আগে কমা (,) বসবে!\n• উদাহরণ বা সূত্রের আগে কোলন (:) বসবে!\n• কমার অপপ্রয়োগে অর্থ সম্পূর্ণ উল্টে যেতে পারে!',
    rules: [
      {
        ruleNo: 1,
        nameBn: 'প্রত্যক্ষ উক্তিতে উদ্ধৃতি চিহ্নের পূর্বে কমা',
        explanationBn: 'বক্তার উদ্ধৃত বক্তব্যের পূর্বে কোলন নয়, বরং কমা বসানোই আধুনিক প্রমিত রীতি।',
        examples: [
          {
            bn: 'মা বললেন, "ভাত খেয়ে নাও।" (কমা ও উদ্ধৃতি চিহ্ন)।',
            context: 'উদ্ধৃতিতে কমা'
          }
        ]
      }
    ],
    formulas: [
      {
        label: 'উদ্ধৃতি যতি সূত্র',
        structure: 'বক্তা + বললেন + কমা ( , ) + উদ্ধৃতি চিহ্ন ( “...।” )'
      }
    ],
    examples: [
      {
        bn: 'তিনি বললেন, "আমি কাল আসব।"',
        context: 'সংলাপ'
      },
      {
        bn: 'বাংলা স্বরবর্ণ মোট ১১টি: অ, আ, ই, ঈ...',
        context: 'কোলন'
      }
    ],
    exceptions: [
      {
        titleBn: 'শিরোনামে বিরামচিহ্নহীনতা',
        descriptionBn: 'পুস্তক বা প্রবন্ধের মূল শিরোনামে কোনো দাঁড়ি বা বিরামচিহ্ন বসে না।'
      }
    ],
    commonMistakes: [
      {
        incorrectBn: 'বিরামচিহ্ন ছাড়া টানা লিখে যাওয়া।',
        correctBn: 'অর্থের ভাব অনুযায়ী সঠিক স্থানে কমা, দাঁড়ি ও সেমিকোলন বসাতে হবে।',
        explanationBn: 'বিরামচিহ্নহীন রচনা অর্থের জটিলতা ও বিভ্রান্তি সৃষ্টি করে।'
      }
    ],
    writtenPractice: [
      {
        id: 1,
        type: 'PUNCTUATION_INSERTION',
        prompt: 'নিচের অনুচ্ছেদটিতে যথাস্থানে বিরামচিহ্ন বসাও: মা বললেন খোকা মন দিয়ে পড়াশোনা কর নতুবা পরীক্ষায় ভালো করতে পারবে না',
        correctAnswer: 'মা বললেন, "খোকা, মন দিয়ে পড়াশোনা কর; নতুবা পরীক্ষায় ভালো করতে পারবে না।"',
        explanationBn: 'বোর্ড পরীক্ষার অত্যন্ত ক্লাসিক ৪ নম্বরের বিরামচিহ্ন স্থাপন অনুশীলন।'
      }
    ],
    tags: ['PUNCTUATION_PLACEMENT', 'COMMA_SEMICOLON', 'QUOTATION', 'COLON', 'SSC', 'HSC'],
    status: 'PUBLISHED',
    orderIndex: 2,
    viewCount: 530
  }
];

const CHAPTER_39_MCQS = [
  {
    id: 139001,
    chapterId: 139,
    topicId: 13901,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: 'বাংলা গদ্যে সর্বপ্রথম সুশৃঙ্খল বিরামচিহ্নের সার্থক প্রবর্তন করেন কে?',
    questionEn: 'Who first systematically introduced punctuation marks into Bengali prose?',
    options: ['ঈশ্বরচন্দ্র বিদ্যাসাগর', 'বঙ্কিমচন্দ্র চট্টোপাধ্যায়', 'রবীন্দ্রনাথ ঠাকুর', 'উইলিয়াম কেরি'],
    correctOptionIndex: 0,
    correctAnswerText: 'ঈশ্বরচন্দ্র বিদ্যাসাগর',
    explanationBn: '১৮৪৭ সালে "বেতাল পঞ্চবিংশতি" গ্রন্থে পন্ডিত ঈশ্বরচন্দ্র বিদ্যাসাগর প্রথম বাংলা ভাষায় সার্থক যতিচিহ্ন প্রবর্তন করেন।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'ঢাকা বোর্ড',
    year: 2024,
    examType: 'SSC',
    tags: ['VIDYASAGAR_PUNCTUATION', 'DHAKA_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 139002,
    chapterId: 139,
    topicId: 13901,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: 'কমা ( , ) অপেক্ষা বেশি এবং দাঁড়ি ( । ) অপেক্ষা কম বিরতির প্রয়োজন হলে কোন চিহ্ন বসে?',
    questionEn: 'Which punctuation mark requires a pause longer than a comma but shorter than a period?',
    options: ['সেমিকোলন ( ; )', 'কোলন ( : )', 'ড্যাশ ( — )', 'হাইফেন ( - )'],
    correctOptionIndex: 0,
    correctAnswerText: 'সেমিকোলন ( ; )',
    explanationBn: 'সেমিকোলনে কমার দ্বিগুণ সময় থামতে হয়, যা দাঁড়ি অপেক্ষা কম কিন্তু কমা অপেক্ষা বেশি।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'রাজশাহী বোর্ড',
    year: 2023,
    examType: 'SSC',
    tags: ['SEMICOLON_PAUSE', 'RAJSHAHI_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 139003,
    chapterId: 139,
    topicId: 13901,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: 'নিচের কোন বিরামচিহ্নটিতে থামার কোনো প্রয়োজন নেই?',
    questionEn: 'Which of the following punctuation marks requires zero pause duration?',
    options: ['হাইফেন ( - )', 'কমা ( , )', 'সেমিকোলন ( ; )', 'কোলন ( : )'],
    correctOptionIndex: 0,
    correctAnswerText: 'হাইফেন ( - )',
    explanationBn: 'হাইফেন, বন্ধনী এবং লোপচিহ্নে পাঠকালে থামার কোনো প্রয়োজন হয় না।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'যশোর বোর্ড',
    year: 2024,
    examType: 'SSC',
    tags: ['HYPHEN_ZERO_PAUSE', 'JASHORE_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 139004,
    chapterId: 139,
    topicId: 13901,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: 'দাঁড়ি বা পূর্ণচ্ছেদ ( । )-এর বিরতিকাল কতক্ষণ?',
    questionEn: 'What is the pause duration for a Bengali full stop (Dari)?',
    options: ['১ (এক) সেকেন্ড', '১ বলার সময়', '১ বলার দ্বিগুণ সময়', 'থামার প্রয়োজন নেই'],
    correctOptionIndex: 0,
    correctAnswerText: '১ (এক) সেকেন্ড',
    explanationBn: 'দাঁড়ি, প্রশ্নবোধক, বিস্ময়সূচক ও কোলনে ১ (এক) সেকেন্ড বিরতি নিতে হয়।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'কুমিল্লা বোর্ড',
    year: 2023,
    examType: 'SSC',
    tags: ['DARI_ONE_SECOND', 'CUMILLA_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 139005,
    chapterId: 139,
    topicId: 13902,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: 'বক্তার মূল বক্তব্য হুবহু অবিকল উদ্ধৃত করতে কোন বিরামচিহ্ন ব্যবহার করা হয়?',
    questionEn: 'Which punctuation mark encloses verbatim speech of a speaker?',
    options: ['উদ্ধৃতি চিহ্ন ( “ ” )', 'কোলন ( : )', 'ড্যাশ ( — )', 'সেমিকোলন ( ; )'],
    correctOptionIndex: 0,
    correctAnswerText: 'উদ্ধৃতি চিহ্ন ( “ ” )',
    explanationBn: 'বক্তার হুবহু মুখের কথা বা সাহিত্যিক উদ্ধৃতি প্রকাশ করতে উদ্ধৃতি চিহ্ন (Quotation Marks) ব্যবহৃত হয়।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'চট্টগ্রাম বোর্ড',
    year: 2024,
    examType: 'SSC',
    tags: ['QUOTATION_MARKS', 'CHITTAGONG_BOARD'],
    status: 'ACTIVE'
  }
];

const CHAPTER_39_MODEL_TEST = {
  id: 13901,
  subject: 'BANGLA',
  chapterId: 139,
  testTitleBn: 'অধ্যায় ৩৯ মডেল টেস্ট: বিরামচিহ্ন বা যতিচিহ্ন',
  testTitleEn: 'Chapter 39 Model Test: Punctuation Marks & Pauses (Biramchinho)',
  descriptionBn: 'ঈশ্বরচন্দ্র বিদ্যাসাগর, বিরতিকাল, কমা, সেমিকোলন, দাঁড়ি, কোলন ও উদ্ধৃতি চিহ্নের নিয়মের ওপর পূর্ণাঙ্গ মডেল টেস্ট।',
  durationMinutes: 10,
  totalMarks: 5,
  passPercentage: 60,
  difficulty: 'MEDIUM',
  questionCount: 5,
  questionIds: [139001, 139002, 139003, 139004, 139005],
  status: 'PUBLISHED'
};

// ============================================================================
// CHAPTER 40: বাংলা ব্যাকরণ — SSC/HSC পরীক্ষাভিত্তিক Revision (Comprehensive Revision)
// ============================================================================
const CHAPTER_40_TOPICS = [
  {
    id: 14001,
    chapterId: 140,
    parentTopicId: null,
    subject: 'BANGLA',
    topicNo: '৪০.১',
    titleBn: 'সমগ্র বাংলা ব্যাকরণের ৭টি প্রধান বিষয়ের সংক্ষেপিত মাস্টার চার্ট ও উচ্চমূল্য তুলনা',
    titleEn: 'Comprehensive Master Summary of 7 Core Grammar Domains & High-Value Comparisons',
    slug: 'b40-shomogro-bangla-grammar-master-chart',
    difficulty: 'BOARD_STANDARD',
    classLevel: 'Class 8 - 12 (SSC & HSC)',
    summaryBn: 'ভাষা ও ধ্বনি, শব্দ ও পদ, কারক ও বিভক্তি, শব্দগঠন, বাক্য ও বাচ্য, শব্দভাণ্ডার এবং প্রয়োগরীতির সম্পূর্ণ সিলেবাসের সমন্বিত রিভিশন ও তুলনামূলক বিশ্লেষণ।',
    definitionBn: 'বাংলা ব্যাকরণ সিলেবাসের ৭টি মহাপর্বের মাস্টার সংক্ষিপ্তসার:\n• পর্ব ১ (ভাষা ও ধ্বনি): বাংলা ভাষার মূল উৎস ইন্দো-ইউরোপীয়; বাংলা বর্ণমালায় ৫০টি বর্ণ (১১ স্বরবর্ণ ও ৩৯ ব্যঞ্জনবর্ণ); মাত্রাহীন বর্ণ ১০টি, অর্ধমাত্রার বর্ণ ৮টি, পূর্ণমাত্রার বর্ণ ৩২টি।\n• পর্ব ২ (শব্দ ও পদ): গঠন অনুসারে শব্দ ২ প্রকার (মৌলিক ও সাধিত); অর্থ অনুসারে ৩ প্রকার (যৌগিক, রূঢ়ি, যোগরূঢ়); পদ প্রধানত ৫ প্রকার (বিশেষ্য, সর্বনাম, বিশেষণ, ক্রিয়া, অব্যয়)।\n• পর্ব ৩ (কারক ও ব্যাকরণিক বৈশিষ্ট্য): কারক ৬ প্রকার (কর্তা, কর্ম, করণ, সম্প্রদান, অপাদান, অধিকরণ); বিভক্তি ৭ প্রকার; বচন ২ প্রকার; লিঙ্গ ৪ প্রকার; পুরুষ ৩ প্রকার; কাল ৩ প্রকার।\n• পর্ব ৪ (শব্দগঠন): সন্ধি (ধ্বনি ও বর্ণের মিলন); সমাস (অর্থের মিলনে একাধিক পদের একপদীকরণ); উপসর্গ (শব্দের পূর্বে বসে অর্থের পরিবর্তন করে); প্রত্যয় (প্রকৃতির পরে বসে নতুন শব্দ তৈরি করে)।\n• পর্ব ৫ (বাক্য ও বাচ্য): সার্থক বাক্যের ৩ গুণ (আকাঙ্ক্ষা, আসত্তি, যোগ্যতা); গঠন অনুসারে বাক্য ৩ প্রকার (সরল, জটিল, যৌগিক); বাচ্য ৩ প্রকার (কর্তৃবাচ্য, কর্মবাচ্য, ভাববাচ্য)।\n• পর্ব ৬ (শব্দভাণ্ডার): বাগধারা, বাক্য সংকোচন, এক কথায় প্রকাশ, সমার্থক ও বিপরীত শব্দ।\n• পর্ব ৭ (প্রয়োগ ও শুদ্ধি): বিরামচিহ্ন ও বাক্য শুদ্ধিকরণ।',
    definitionEn: 'The capstone synoptic synthesis organizing all 39 preceding modules into 7 modular theoretical pillars, featuring comparative structural contrasts.',
    explanationBn: 'পরীক্ষায় ১০০% কনফিউশন দূর করার ক্লাসিক তুলনামূলক চার্ট:\n১. সন্ধি বনাম সমাস:\n• সন্ধি হলো ধ্বনির মিলন (ধ্বন্যাত্মক ব্যাকরণ); সমাস হলো পদের মিলন (অর্থবাচক ব্যাকরণ)।\n• সন্ধিতে বর্ণ পরিবর্তিত বা লোপ পায়; সমাসে বিভক্তি লোপ পায় ও সমস্তপদ গঠিত হয়।\n২. উপসর্গ বনাম প্রত্যয়:\n• উপসর্গ বসে ধাতুর বা শব্দের পূর্বে; প্রত্যয় বসে ধাতুর বা প্রাতিপদিকের পরে।\n• উপসর্গ নিজস্ব অর্থহীন কিন্তু দ্যোতক; প্রত্যয় নতুন ব্যাকরণিক পদ তৈরি করে।\n৩. কারক বনাম বিভক্তি:\n• কারক হলো বাক্যের ক্রিয়াপদের সাথে নামপদের সম্পর্ক; আর বিভক্তি হলো সেই সম্পর্ক নির্দেশক চিহ্ন (প্রথমা থেকে সপ্তমী)।\n৪. সরল বাক্য বনাম জটিল বাক্য বনাম যৌগিক বাক্য:\n• সরল বাক্য: ১টি উদ্দেশ্য + ১টি সমাপিকা ক্রিয়া।\n• জটিল বাক্য: সাপেক্ষ যোজকযুক্ত খণ্ডবাক্য (যখন...তখন, যিনি...তিনি)।\n• যৌগিক বাক্য: যোজক অব্যয় (এবং, কিন্তু, অথচ) দ্বারা যুক্ত স্বাধীন বাক্য।',
    teacherGoldenTips: 'গোল্ডেন রিভিশন ফর্মুলা:\n• ধ্বনির মিলন = সন্ধি!\n• পদের মিলন = সমাস!\n• পূর্বে বসে = উপসর্গ!\n• পরে বসে = প্রত্যয়!\n• ১টি সমাপিকা = সরল বাক্য!\n• যিনি...তিনি = জটিল বাক্য!\n• এবং / কিন্তু = যৌগিক বাক্য!\n• এই ৬টি কথা মনে রাখলে ব্যাকরণের অর্ধেকের বেশি প্রশ্নের গোড়া শক্ত হয়ে যাবে!',
    rules: [
      {
        ruleNo: 1,
        nameBn: 'পূর্ণ সিলেবাস সমন্বয়ের মূলনীতি',
        explanationBn: 'বোর্ড পরীক্ষায় প্রতিটি ব্যাকরণিক নিয়মকে এককভাবে না দেখে সমগ্র ভাষার সামগ্রিক কাঠামোর সাথে যুক্ত করে অনুধাবন করতে হবে।',
        examples: [
          {
            bn: 'বাক্যের পদগুলোর সঠিক অন্বয় ছাড়া কারক, বিভক্তি ও বাচ্যের যথার্থ প্রকাশ অসম্ভব।',
            context: 'সমন্বিত ব্যাকরণ'
          }
        ]
      }
    ],
    formulas: [
      {
        label: 'মাস্টার তুলনা সূত্র',
        structure: 'সন্ধি (ধ্বনি) ↔ সমাস (পদ) | উপসর্গ (পূর্বে) ↔ প্রত্যয় (পরে) | সরল (১টি সমাপিকা) ↔ জটিল (সাপেক্ষ)'
      }
    ],
    examples: [
      {
        bn: 'বিদ্যা + আলয় = বিদ্যালয় (সন্ধি); বিদ্যার আলয় = বিদ্যালয় (সমাস)',
        context: 'সন্ধি বনাম সমাস'
      },
      {
        bn: 'প্র + হার = প্রহার (উপসর্গ); পড়্ + অন্ত = পড়ন্ত (প্রত্যয়)',
        context: 'উপসর্গ বনাম প্রত্যয়'
      }
    ],
    exceptions: [
      {
        titleBn: 'নিপাতনে সিদ্ধ ব্যাকরণিক নিয়ম',
        descriptionBn: 'সন্ধি ও প্রত্যয়ের কিছু রূপ স্বাভাবিক সাধারণ নিয়ম না মেনে নিপাতনে সিদ্ধ হয় (যেমন: গো + অক্ষ = গবাক্ষ; কুল + অটা = কুলটা)।'
      }
    ],
    commonMistakes: [
      {
        incorrectBn: 'সন্ধি ও সমাসকে একই প্রক্রিয়া মনে করা।',
        correctBn: 'সন্ধি ধ্বনিগত ও বর্ণগত মিলন; সমাস অর্থগত পদসংক্ষেপণ।',
        explanationBn: 'উভয়ের ব্যাকরণিক প্রক্রিয়া সম্পূর্ণ স্বতন্ত্র।'
      }
    ],
    writtenPractice: [
      {
        id: 1,
        type: 'COMPARATIVE_ESSAY',
        prompt: 'সংক্ষেপে পার্থক্য দেখাও: (ক) সন্ধি বনাম সমাস (খ) উপসর্গ বনাম প্রত্যয়।',
        correctAnswer: '(ক) সন্ধি হলো পাশাপাশি দুটি ধ্বনি বা বর্ণের মিলন; সমাস হলো অর্থসংগতিপূর্ণ একাধিক পদের একপদীকরণ। (খ) উপসর্গ ধাতু বা শব্দের পূর্বে বসে অর্থের পরিবর্তন সাধন করে; প্রত্যয় ধাতু বা প্রাতিপদিকের পরে বসে নতুন শব্দ গঠন করে।',
        explanationBn: 'বোর্ড পরীক্ষার অত্যন্ত আকর্ষণীয় ও গুরুত্বপূর্ণ ৪ নম্বরের প্রশ্ন।'
      }
    ],
    tags: ['REVISION', 'MASTER_CHART', 'SHONDHI_VS_SHOMASH', 'UPOSORGO_VS_PROTTOY', 'SSC', 'HSC'],
    status: 'PUBLISHED',
    orderIndex: 1,
    viewCount: 650
  },
  {
    id: 14002,
    chapterId: 140,
    parentTopicId: null,
    subject: 'BANGLA',
    topicNo: '৪০.২',
    titleBn: 'SSC ও HSC বোর্ড পরীক্ষার চূড়ান্ত প্রস্তুতি কৌশল, কমন ট্র্যাপ ও লাস্ট-মিনিট চেকলিস্ট',
    titleEn: 'SSC & HSC Board Exam Preparation Strategy, Common Traps & Last-Minute Checklist',
    slug: 'b40-board-exam-strategy-and-checklist',
    difficulty: 'BOARD_STANDARD',
    classLevel: 'Class 8 - 12 (SSC & HSC)',
    summaryBn: 'বোর্ড পরীক্ষায় পূর্ণ নম্বর অর্জনের কার্যকরী কৌশল, সময় বণ্টন এবং পরীক্ষার আগের রাতের চূড়ান্ত রিভিশন চেকলিস্ট।',
    definitionBn: 'বোর্ড পরীক্ষা সাফল্যের ৫টি স্তম্ভ:\n১. ব্যাকরণ অংশের নিশ্চিত পূর্ণ নম্বর: রচনামূলক অংশে নম্বর কাটার সুযোগ থাকলেও ব্যাকরণ অংশে ৩০-এ ৩০ নম্বর পাওয়া পুরোপুরি সম্ভব।\n২. কমন প্রশ্ন ট্র্যাপসমূহ:\n• বিভক্তিহীন শব্দ দেখলেই প্রথমা বা শূন্য বিভক্তি দাগানো।\n• কর্ম ও সম্প্রদানের পার্থক্য স্পষ্ট রাখা (স্বত্ব ত্যাগ করলে সম্প্রদান, না করলে কর্ম)।\n• অপাদান ও অধিকরণের সূক্ষ্ম ভেদ (হতে/থেকে/ভীতি থাকলে অপাদান; স্থান/কাল/বিষয় থাকলে অধিকরণ)।\n• সমাস নির্ণয়ে ব্যাসবাক্য ঠিক রাখা।\n• প্রকৃতি-প্রত্যয়ে ধাতু চিহ্ন (√) দিতে না ভুলে যাওয়া।\n৩. পরীক্ষার হলে সময় ব্যবস্থাপনা:\nব্যাকরণ অংশের প্রশ্নগুলোর উত্তর দিতে প্রতি নম্বরের জন্য সর্বোচ্চ দেড় মিনিট সময় বরাদ্দ রাখা বুদ্ধিমানের কাজ।',
    definitionEn: 'Strategic pedagogical guidelines for secondary exam candidates focusing on cognitive pacing, error-elimination heuristics, and high-yield question resolution.',
    explanationBn: 'লাস্ট-মিনিট ফাইনাল চেকলিস্ট (পরীক্ষার আগের রাতে যা একবার চোখ বুলাতেই হবে):\n১. ন-ত্ব ও ষ-ত্ব বিধানের স্বভাবতই মূর্ধন্য-ণ এবং মূর্ধন্য-ষ হওয়ার তালিকা (চাণক্য মাণিক্য...)।\n২. সন্ধির নিপাতনে সিদ্ধ শব্দগুলো (পরস্পর, গবাক্ষ, তস্কর, একাদশ, বৃহস্পতি)।\n৩. সমাসের প্রধান ৬টি শ্রেণি ও অলুক সমাসের উদাহরণ (ঘিয়ে ভাজা, গায়ে হলুদ, মুখে ভাত)।\n৪. উপসর্গের সংখ্যা: খাঁটি বাংলা ২১টি, সংস্কৃত ২০টি; উভয়ের মধ্যে কমন ৪টি (আ, সু, বি, নি)।\n৫. সার্থক বাক্যের ৩ গুণ: আকাঙ্ক্ষা, আসত্তি ও যোগ্যতা।\n৬. বাক্য রূপান্তরের কৌশল: সরল ↔ জটিল ↔ যৌগিক।\n৭. উক্তি পরিবর্তনের নৈকট্যবাচক শব্দের দূরত্ববাচক রূপান্তর (আজ → সেদিন)।\n৮. বিরামচিহ্নের বিরতিকাল তালিকা।',
    teacherGoldenTips: 'গোল্ডেন এক্সাম টিপস:\n১. প্রকৃতি-প্রত্যয়ে অবশ্যই ধাতু চিহ্ন (√) দেবেন!\n২. সমাসে ব্যাসবাক্য নির্ভুল লিখবেন!\n৩. বাক্য শুদ্ধিকরণে কোনো অতিরিক্ত ভুল পরিবর্তন করবেন না!\n৪. ওএমআর বা উত্তরপত্রে প্রশ্ন নম্বর অত্যন্ত স্পষ্টভাবে উল্লেখ করবেন!',
    rules: [
      {
        ruleNo: 1,
        nameBn: 'ধাতু চিহ্ন বাধ্যতামূলক বিধান',
        explanationBn: 'পরীক্ষায় যেকোনো কৃৎ প্রত্যয় বা ক্রিয়ামূল বিশ্লেষণের সময় মূল ধাতুর পূর্বে বর্গমূলের মতো ধাতু চিহ্ন (√) দেওয়া বাধ্যতামূলক।',
        examples: [
          {
            bn: 'চলন্ত = √চল্ + অন্ত (ধাতু চিহ্ন ছাড়া লিখলে নম্বর কাটা যাবে)।',
            context: 'ধাতু চিহ্ন'
          }
        ]
      }
    ],
    formulas: [
      {
        label: 'ফাইনাল পরীক্ষার সাফল্য সূত্র',
        structure: 'সঠিক ব্যাকরণ জ্ঞান + নিখুঁত বানান + সঠিক চিহ্ন (√) = ১০০% নিশ্চিত নম্বর'
      }
    ],
    examples: [
      {
        bn: 'কর্তব্য = √কৃ + তব্য (কৃৎ প্রত্যয়)',
        context: 'ধাতু চিহ্ন'
      },
      {
        bn: 'গায়ে হলুদ = গায়ে হলুদ দেওয়া হয় যে অনুষ্ঠানে (মধ্যপদলোপী বহুব্রীহি)',
        context: 'ব্যাসবাক্য'
      }
    ],
    exceptions: [
      {
        titleBn: 'বোর্ড প্রশ্নপত্রে বিকল্পের সঠিক বাছাই',
        descriptionBn: 'যে প্রশ্নে ব্যাসবাক্য বা নিয়ম সবচেয়ে নিখুঁত জানা আছে, কেবলমাত্র সেই বিকল্পটি নির্বাচন করাই শ্রেয়।'
      }
    ],
    commonMistakes: [
      {
        incorrectBn: 'ধাতু চিহ্ন (√) দিতে ভুলে যাওয়া।',
        correctBn: 'ক্রিয়ামূলের পূর্বে সর্বদা √ দেওয়া।',
        explanationBn: 'ধাতু চিহ্ন না দিলে তা নামশব্দে পরিণত হয়ে যায়।'
      }
    ],
    writtenPractice: [
      {
        id: 1,
        type: 'MIXED_BOARD_PRACTICE',
        prompt: 'সংক্ষিপ্ত উত্তর দাও: (ক) খাঁটি বাংলা ও সংস্কৃত উপসর্গের মধ্যে কমন ৪টি উপসর্গ কী কী? (খ) বাক্যের ৩টি আবশ্যিক গুণ কী কী?',
        correctAnswer: '(ক) খাঁটি বাংলা ও সংস্কৃত উভয়ের মধ্যে কমন ৪টি উপসর্গ হলো: আ, সু, বি, নি। (খ) সার্থক বাক্যের ৩টি আবশ্যিক গুণ হলো: আকাঙ্ক্ষা, আসত্তি ও যোগ্যতা।',
        explanationBn: 'বোর্ড পরীক্ষার অত্যন্ত জনপ্রিয় ৪ নম্বরের চূড়ান্ত রিভিশন প্রশ্ন।'
      }
    ],
    tags: ['EXAM_STRATEGY', 'CHECKLIST', 'COMMON_TRAPS', 'LAST_MINUTE_REVISION', 'SSC', 'HSC'],
    status: 'PUBLISHED',
    orderIndex: 2,
    viewCount: 720
  }
];

const CHAPTER_40_MCQS = [
  {
    id: 140001,
    chapterId: 140,
    topicId: 14001,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: 'খাঁটি বাংলা এবং সংস্কৃত—উভয় ভাষার উপসর্গেই বিদ্যমান রয়েছে এমন কমন ৪টি উপসর্গ কোনটি?',
    questionEn: 'Which 4 prefixes are common to both native Bengali and Sanskrit prefix systems?',
    options: ['আ, সু, বি, নি', 'প্র, পরা, অপ, সম', 'অ, অনা, কু, নি', 'রাম, পাতি, হাঁস, বে'],
    correctOptionIndex: 0,
    correctAnswerText: 'আ, সু, বি, নি',
    explanationBn: '"আ, সু, বি, নি"—এই চারটি উপসর্গ খাঁটি বাংলা (২১টি) এবং তৎসম বা সংস্কৃত (২০টি) উভয় উপসর্গ তালিকাতেই বিদ্যমান।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'ঢাকা বোর্ড',
    year: 2024,
    examType: 'SSC',
    tags: ['A_SU_BI_NI', 'DHAKA_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 140002,
    chapterId: 140,
    topicId: 14001,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: 'সন্ধি মূলত ব্যাকরণের কোন বিষয়ের মিলন ঘটায়?',
    questionEn: 'What structural element does Sandhi primarily combine in grammar?',
    options: ['পাশাপাশি দুটি ধ্বনি বা বর্ণ', 'একাধিক পদ', 'একাধিক বাক্য', 'উপসর্গ ও প্রত্যয়'],
    correctOptionIndex: 0,
    correctAnswerText: 'পাশাপাশি দুটি ধ্বনি বা বর্ণ',
    explanationBn: 'সন্ধি হলো ধ্বনি ও বর্ণের মিলন; অন্যদিকে সমাস হলো অর্থসংগতিপূর্ণ একাধিক পদের মিলন।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'রাজশাহী বোর্ড',
    year: 2023,
    examType: 'SSC',
    tags: ['SHONDHI_DHWONI', 'RAJSHAHI_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 140003,
    chapterId: 140,
    topicId: 14001,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: 'একটি সার্থক বাক্যের ৩টি অপরিহার্য গুণাবলী কোনগুলো?',
    questionEn: 'What are the 3 essential attributes of a well-formed Bengali sentence?',
    options: ['আকাঙ্ক্ষা, আসত্তি ও যোগ্যতা', 'উদ্দেশ্য, বিধেয় ও ক্রিয়া', 'কর্তা, কর্ম ও করণ', 'সরল, জটিল ও যৌগিক'],
    correctOptionIndex: 0,
    correctAnswerText: 'আকাঙ্ক্ষা, আসত্তি ও যোগ্যতা',
    explanationBn: 'অর্থের পূর্ণতা (আকাঙ্ক্ষা), সঠিক পদক্রম (আসত্তি) এবং ভাবগত যৌক্তিকতা (যোগ্যতা)—এই তিনটি হলো সার্থক বাক্যের আবশ্যিক গুণ।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'যশোর বোর্ড',
    year: 2024,
    examType: 'SSC',
    tags: ['SHARTHOK_BAKYO_GUNS', 'JASHORE_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 140004,
    chapterId: 140,
    topicId: 14002,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: 'বাংলা বর্ণমালায় মোট মাত্রাহীন বর্ণের সংখ্যা কয়টি?',
    questionEn: 'How many matra-less (unbarred) letters exist in the Bengali alphabet?',
    options: ['১০টি', '৮টি', '৩২টি', '১১টি'],
    correctOptionIndex: 0,
    correctAnswerText: '১০টি',
    explanationBn: 'বাংলা ৫০টি বর্ণের মধ্যে পূর্ণমাত্রার ৩২টি, অর্ধমাত্রার ৮টি এবং মাত্রাহীন বর্ণ মোট ১০টি (এ, ঐ, ও, ঔ, ঙ, ঞ, ৎ, ং, ঃ, ঁ)।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'কুমিল্লা বোর্ড',
    year: 2023,
    examType: 'SSC',
    tags: ['MATRAHIN_BORNO', 'CUMILLA_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 140005,
    chapterId: 140,
    topicId: 14002,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: 'পরবর্তী পদের অর্থ প্রাধান্য পায় নিচের কোন সমাসে?',
    questionEn: 'In which compound does the semantic weight fall primarily on the subsequent constituent?',
    options: ['তৎপুরুষ, কর্মধারয় ও দ্বিগু সমাস', 'দ্বন্দ্ব সমাস', 'বহুব্রীহি সমাস', 'অব্যয়ীভাব সমাস'],
    correctOptionIndex: 0,
    correctAnswerText: 'তৎপুরুষ, কর্মধারয় ও দ্বিগু সমাস',
    explanationBn: 'তৎপুরুষ, কর্মধারয় ও দ্বিগু সমাসে পরপদের অর্থ প্রধান রূপে প্রতীয়মান হয় (দ্বন্দ্বে উভপদ, বহুব্রীহিতে অন্যপদ এবং অব্যয়ীভাবে পূর্বপদ প্রধান)।',
    difficulty: 'MEDIUM',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'চট্টগ্রাম বোর্ড',
    year: 2024,
    examType: 'SSC',
    tags: ['POROPOD_SHOMASH', 'CHITTAGONG_BOARD'],
    status: 'ACTIVE'
  }
];

const CHAPTER_40_MODEL_TEST = {
  id: 14001,
  subject: 'BANGLA',
  chapterId: 140,
  testTitleBn: 'অধ্যায় ৪০ মডেল টেস্ট: বাংলা ব্যাকরণ — SSC/HSC চূড়ান্ত সমন্বিত পরীক্ষা',
  testTitleEn: 'Chapter 40 Model Test: Comprehensive SSC/HSC Final Board Revision',
  descriptionBn: 'সমগ্র বাংলা ব্যাকরণ সিলেবাসের (অধ্যায় ০১ থেকে ৩৯) ওপর চূড়ান্ত পরীক্ষাভিত্তিক সমন্বিত মডেল টেস্ট।',
  durationMinutes: 15,
  totalMarks: 5,
  passPercentage: 60,
  difficulty: 'HARD',
  questionCount: 5,
  questionIds: [140001, 140002, 140003, 140004, 140005],
  status: 'PUBLISHED'
};

module.exports = {
  CHAPTER_36_TOPICS, CHAPTER_36_MCQS, CHAPTER_36_MODEL_TEST,
  CHAPTER_37_TOPICS, CHAPTER_37_MCQS, CHAPTER_37_MODEL_TEST,
  CHAPTER_38_TOPICS, CHAPTER_38_MCQS, CHAPTER_38_MODEL_TEST,
  CHAPTER_39_TOPICS, CHAPTER_39_MCQS, CHAPTER_39_MODEL_TEST,
  CHAPTER_40_TOPICS, CHAPTER_40_MCQS, CHAPTER_40_MODEL_TEST
};
