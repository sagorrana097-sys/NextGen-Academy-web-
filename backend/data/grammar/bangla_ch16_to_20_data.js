/**
 * Bangla Grammar Chapters 16–20 Content:
 * Chapter 16: লিঙ্গ ও লিঙ্গান্তর (Gender)
 * Chapter 17: পুরুষ (Person)
 * Chapter 18: কাল (Tense)
 * Chapter 19: বর্ণের উচ্চারণ ও ধ্বনি পরিবর্তন (Sound Changes)
 * Chapter 20: শুদ্ধ বানান, ণ-ত্ব ও ষ-ত্ব বিধান (Spelling, Notto & Shotto Bidhan)
 * 
 * Fully structured according to NCTB/SSC/HSC standard.
 */

// ============================================================================
// CHAPTER 16: লিঙ্গ ও লিঙ্গান্তর (Gender)
// ============================================================================
const CHAPTER_16_TOPICS = [
  {
    id: 11601,
    chapterId: 116,
    parentTopicId: null,
    subject: 'BANGLA',
    topicNo: '১৬.১',
    titleBn: 'লিঙ্গের সংজ্ঞা, শ্রেণিবিভাগ ও লিঙ্গান্তরের নিয়ম',
    titleEn: 'Definition of Gender (Lingo), 4 Types & Gender Transformation Rules',
    slug: 'b16-lingo-shongpga-o-shrenibibhag',
    difficulty: 'BOARD_STANDARD',
    classLevel: 'Class 8 - 12 (SSC & HSC)',
    summaryBn: 'যে চিহ্ন বা লক্ষণ দ্বারা কোনো শব্দ পুরুষ, স্ত্রী, উভয় নাকি জড়বস্তু তা চেনা যায়, তাকে লিঙ্গ বলে। লিঙ্গ ৪ প্রকার।',
    definitionBn: 'লিঙ্গ (Gender / Lingo): যেসব চিহ্ন বা লক্ষণ দেখে কোনো শব্দ পুরুষবাচক, স্ত্রীবাচক, উভয়বাচক নাকি জড় বা অচেতন বস্তুবাচক তা নিশ্চিতভাবে চেনা যায়, ব্যাকরণে তাকে লিঙ্গ বলে (লিঙ্গ শব্দের অর্থ চিহ্ন বা লক্ষণ)। লিঙ্গ চার প্রকার: ১. পুংলিঙ্গ (পুরুষবাচক): বাবা, ভাই, শিক্ষক, সিংহ। ২. স্ত্রীলিঙ্গ (স্ত্রীবাচক): মা, বোন, শিক্ষিকা, সিংহী। ৩. উভয়লিঙ্গ (উভয়কে বোঝায়): সন্তান, শিশু, মানুষ, পাখি, কবি, বন্ধু। ৪. ক্লীবলিঙ্গ (অচেতন জড়বস্তু): বই, খাতা, টেবিল, কলম, আকাশ।',
    definitionEn: 'Gender (Lingo) denotes the sex of an animate entity or inanimate nature. Bengali recognizes Masculine, Feminine, Common, and Neuter genders.',
    explanationBn: 'বাংলা ভাষায় লিঙ্গান্তরের চমৎকার কিছু নিয়ম রয়েছে: ১. পুরুষবাচক শব্দের শেষে "ঈ" যোগে: বালক → বালিকা, কিশোর → কিশোরী, তরুণ → তরুণী। ২. "নী" যোগে: কামার → কামারনী, ধোপা → ধোপানী, মেথর → মেথরানী। ৩. "ইনী" যোগে: কাঙাল → কাঙালিনী, বাঘ → বাঘিনী। ৪. "আনী" যোগে: ঠাকুর → ঠাকুরানী, ইন্দ্র → ইন্দ্রাণী, মাতুল → মাতুলানী। ৫. নিত্য স্ত্রীলিঙ্গ শব্দ (যার কোনো পুরুষবাচক রূপ নেই): সতী, সতীন, এয়ো, দাই, বিধবা, কুলটা, অঙ্গনা। ৬. নিত্য পুংলিঙ্গ শব্দ (যার কোনো স্ত্রীবাচক রূপ নেই): কবিরাজ, ঢাকি, কৃতদার, অকৃতদার, রাষ্ট্রপতি।',
    teacherGoldenTips: 'বোর্ড পরীক্ষার গোল্ডেন চার্ট: (১) নিত্য স্ত্রীলিঙ্গ: সতী, সতীন, এয়ো, বিধবা, কুলটা, রূপসী। (২) নিত্য পুংলিঙ্গ: কবিরাজ, ঢাকি, কৃতদার, অকৃতদার। (৩) উভয়লিঙ্গ: মানুষ, সন্তান, শিশু, পাখি, সচিব, ডাক্তার।',
    rules: [
      {
        ruleNo: 1,
        nameBn: 'সংস্কৃত স্ত্রী-প্রত্যয়ের বিশেষ রূপ',
        explanationBn: 'পুংলিঙ্গ শব্দের শেষে "তা" থাকলে স্ত্রীলিঙ্গে "ত্রী" হয় (যেমন: নেতা → নেত্রী, দাতা → দাত্রী, ধাতা → ধাত্রী)।',
        examples: [
          {
            bn: 'নেতা → নেত্রী, অভিনেতা → অভিনেত্রী, শ্রোতা → শ্রোত্রী।',
            context: 'তা থেকে ত্রী রূপান্তর'
          }
        ]
      },
      {
        ruleNo: 2,
        nameBn: '"বান" ও "মান"-এর স্ত্রীলিঙ্গ রূপ',
        explanationBn: '"বান" থাকলে "বতী" এবং "মান" থাকলে "মতী" হয়।',
        examples: [
          {
            bn: 'গুণবান → গুণবতী, রূপবান → রূপবতী; শ্রীমান → শ্রীমতী, বুদ্ধিমান → বুদ্ধিমতী।',
            context: 'বান/মান প্রত্যয়'
          }
        ]
      }
    ],
    formulas: [
      {
        label: 'লিঙ্গান্তর সূত্র ছক',
        structure: 'তা → ত্রী | বান → বতী | মান → মতী | নিত্য স্ত্রী (বিধবা/সতী) | নিত্য পুং (কবিরাজ/ঢাকি)'
      }
    ],
    examples: [
      {
        bn: 'তিনি একজন গুণবতী নারী (গুণবান → গুণবতী)',
        context: 'স্ত্রীলিঙ্গ রূপ'
      },
      {
        bn: 'সন্তান মা-বাবার নয়নমণি (সন্তান = উভয়লিঙ্গ)',
        context: 'উভয়লিঙ্গ'
      }
    ],
    exceptions: [
      {
        titleBn: 'বিদেশি শব্দের লিঙ্গহীনতা',
        descriptionBn: 'বাংলা ভাষায় ব্যবহৃত বিদেশি শব্দের ক্ষেত্রে সাধারণত লিঙ্গভেদ নিয়ম খাটে না (যেমন: টেবিল, চেয়ার, মাস্টার)।'
      }
    ],
    commonMistakes: [
      {
        incorrectBn: 'তিনি একজন বিদ্যান মহিলা।',
        correctBn: 'তিনি একজন বিদুষী মহিলা।',
        explanationBn: 'বিদ্বান শব্দের স্ত্রীবাচক রূপ হলো "বিদুষী"।'
      },
      {
        incorrectBn: 'তিনি সভাপতি হিসেবে উপস্থিত ছিলেন (মহিলা হলে সভানেত্রী না লেখা)।',
        correctBn: 'মহিলা হলে "সভানেত্রী" বা প্রমিত পদের ক্ষেত্রে "সভাপতি" লেখা যেতে পারে।',
        explanationBn: 'নেতা এর স্ত্রীলিঙ্গ নেত্রী।'
      }
    ],
    writtenPractice: [
      {
        id: 1,
        type: 'TRANSFORMATION',
        prompt: 'লিঙ্গ পরিবর্তন করো: (ক) বিদ্বান (খ) নেতা (গ) বুদ্ধিমান (ঘ) ইন্দ্র।',
        correctAnswer: '(ক) বিদ্বান → বিদুষী (খ) নেতা → নেত্রী (গ) বুদ্ধিমান → বুদ্ধিমতী (ঘ) ইন্দ্র → ইন্দ্রাণী।',
        explanationBn: 'বোর্ড পরীক্ষার ক্লাসিক লিঙ্গ পরিবর্তন।'
      }
    ],
    tags: ['LINGO', 'GENDER', 'MASCULINE', 'FEMININE', 'NITTYO_STRI', 'SSC'],
    status: 'PUBLISHED',
    orderIndex: 1,
    viewCount: 230
  }
];

const CHAPTER_16_MCQS = [
  {
    id: 116001,
    chapterId: 116,
    topicId: 11601,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: 'নিচের কোনটি নিত্য স্ত্রীলিঙ্গ শব্দের উদাহরণ?',
    questionEn: 'Which of the following is an intrinsically feminine (Nittyo Strilingo) word?',
    options: ['বিধবা', 'শিক্ষিকা', 'গায়িকা', 'ছাত্রী'],
    correctOptionIndex: 0,
    correctAnswerText: 'বিধবা',
    explanationBn: '"বিধবা", "সতী", "সতীন", "এয়ো", "কুলটা"—এদের কোনো পুরুষবাচক রূপ নেই, তাই এরা নিত্য স্ত্রীলিঙ্গ শব্দ।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'ঢাকা বোর্ড',
    year: 2024,
    examType: 'SSC',
    tags: ['NITTYO_STRI', 'BIDHOBA', 'DHAKA_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 116002,
    chapterId: 116,
    topicId: 11601,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: '"বিদ্বান" শব্দের সঠিক স্ত্রীবাচক রূপ কোনটি?',
    questionEn: 'What is the correct feminine form of "Bidwan"?',
    options: ['বিদুষী', 'বিদ্বানী', 'বিদ্বানিনী', 'বিদ্যাবতী'],
    correctOptionIndex: 0,
    correctAnswerText: 'বিদুষী',
    explanationBn: '"বিদ্বান" (পুরুষ) এর সঠিক ব্যাকরণিক স্ত্রীবাচক রূপ হলো "বিদুষী"।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'রাজশাহী বোর্ড',
    year: 2023,
    examType: 'SSC',
    tags: ['BIDWAN_BIDUSHI', 'RAJSHAHI_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 116003,
    chapterId: 116,
    topicId: 11601,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: 'নিচের কোন শব্দটি উভয়লিঙ্গ বাচক?',
    questionEn: 'Which of the following is a Common Gender (Ubhoylingo) word?',
    options: ['সন্তান', 'বালক', 'বালিকা', 'কলম'],
    correctOptionIndex: 0,
    correctAnswerText: 'সন্তান',
    explanationBn: '"সন্তান", "শিশু", "মানুষ", "পাখি"—ছেলে ও মেয়ে উভয়কেই সমভাবে বোঝায় বলে এরা উভয়লিঙ্গ পদ।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'যশোর বোর্ড',
    year: 2024,
    examType: 'SSC',
    tags: ['UBHOYLINGO', 'SHONTAN', 'JASHORE_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 116004,
    chapterId: 116,
    topicId: 11601,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: '"নেতা" শব্দের সঠিক স্ত্রীবাচক রূপ কোনটি?',
    questionEn: 'What is the correct feminine form of "Neta"?',
    options: ['নেত্রী', 'নেতানী', 'নেতাইন', 'নেতী'],
    correctOptionIndex: 0,
    correctAnswerText: 'নেত্রী',
    explanationBn: 'সংস্কৃত নিয়মে পুংলিঙ্গ শব্দে "তা" থাকলে স্ত্রীলিঙ্গে "ত্রী" হয় (নেতা → নেত্রী, অভিনেতা → অভিনেত্রী)।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'কুমিল্লা বোর্ড',
    year: 2023,
    examType: 'SSC',
    tags: ['NETA_NETRI', 'CUMILLA_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 116005,
    chapterId: 116,
    topicId: 11601,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: 'নিচের কোনটি নিত্য পুংলিঙ্গ শব্দের উদাহরণ?',
    questionEn: 'Which of the following is an intrinsically masculine word?',
    options: ['কবিরাজ', 'পণ্ডিত', 'শিক্ষক', 'লেখক'],
    correctOptionIndex: 0,
    correctAnswerText: 'কবিরাজ',
    explanationBn: '"কবিরাজ", "ঢাকি", "কৃতদার", "অকৃতদার"—এদের কোনো স্ত্রীবাচক রূপ নেই, তাই এরা নিত্য পুংলিঙ্গ শব্দ।',
    difficulty: 'MEDIUM',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'চট্টগ্রাম বোর্ড',
    year: 2024,
    examType: 'SSC',
    tags: ['NITTYO_PUNG', 'KOBIRAJ', 'CHITTAGONG_BOARD'],
    status: 'ACTIVE'
  }
];

const CHAPTER_16_MODEL_TEST = {
  id: 11601,
  subject: 'BANGLA',
  chapterId: 116,
  testTitleBn: 'অধ্যায় ১৬ মডেল টেস্ট: লিঙ্গ ও লিঙ্গান্তর',
  testTitleEn: 'Chapter 16 Model Test: Gender (Lingo)',
  descriptionBn: 'পুংলিঙ্গ, স্ত্রীলিঙ্গ, উভয়লিঙ্গ, ক্লীবলিঙ্গ, লিঙ্গান্তরের নিয়ম এবং নিত্য স্ত্রীলিঙ্গ ও পুংলিঙ্গ শব্দের ওপর পূর্ণাঙ্গ মডেল টেস্ট।',
  durationMinutes: 10,
  totalMarks: 5,
  passPercentage: 60,
  difficulty: 'MEDIUM',
  questionCount: 5,
  questionIds: [116001, 116002, 116003, 116004, 116005],
  status: 'PUBLISHED'
};

// ============================================================================
// CHAPTER 17: পুরুষ (Person)
// ============================================================================
const CHAPTER_17_TOPICS = [
  {
    id: 11701,
    chapterId: 117,
    parentTopicId: null,
    subject: 'BANGLA',
    topicNo: '১৭.১',
    titleBn: 'পুরুষের সংজ্ঞা, ৩ প্রকার শ্রেণিবিভাগ ও ক্রিয়ার রূপভেদ',
    titleEn: 'Definition of Person (Purush), 3 Types & Verb Concord Rules',
    slug: 'b17-purush-shongpga-o-shrenibibhag',
    difficulty: 'BOARD_STANDARD',
    classLevel: 'Class 8 - 12 (SSC & HSC)',
    summaryBn: 'বাক্যে ক্রিয়ার কর্তা বা বিষয়ভেদে সর্বনাম ও বিশেষ্য পদের যে রূপভেদ দেখা যায়, তাকে পুরুষ (Person) বলে। পুরুষ ৩ প্রকার।',
    definitionBn: 'পুরুষ (Grammatical Person / Purush): বাক্যে উপস্থিত বা অনুপস্থিত ব্যক্তি বা বস্তুর পরিচয় নির্দেশক ব্যাকরণিক রূপকে পুরুষ বলে। পুরুষ ৩ প্রকার: ১. উত্তম পুরুষ (First Person): বক্তা নিজে বা নিজের দল (আমি, আমরা, আমাকে, আমাদের)। ২. মধ্যম পুরুষ (Second Person): যার সাথে কথা বলা হচ্ছে বা শ্রোতা (সাধারণ: তুমি/তোমরা; সম্ভ্রান্ত/সম্মানসূচক: আপনি/আপনারা; তুচ্ছ/ঘনিষ্ঠ: তুই/তোরা)। ৩. নাম পুরুষ বা প্রথম পুরুষ (Third Person): অনুপস্থিত ব্যক্তি বা বস্তু (সাধারণ: সে/তারা; সম্ভ্রান্ত: তিনি/তাঁরা; নামপদ: রহিম, করিম, গাছ)।',
    definitionEn: 'Person (Purush) categorizes participants in discourse: First Person (Uttom), Second Person (Modhyom), and Third Person (Naam). Verbs conjugate strictly based on Person.',
    explanationBn: 'বাংলায় পুরুষের সাথে ক্রিয়াপদের সম্পর্ক অত্যন্ত সংবেদনশীল: ১. উত্তম পুরুষ: আমি যাই, আমরা খাই, আমি করেছি। ২. মধ্যম পুরুষ: তুমি যাও / তুই যাস / আপনি যান (সম্মানভেদে ক্রিয়া বদলে যায়!)। ৩. নাম পুরুষ: সে যায় / তিনি যান / তারা যায়। মনে রাখতে হবে: বিশ্বের সকল বিশেষ্য পদ (Noun) সর্বদাই নাম পুরুষের অন্তর্গত (যেমন: "সূর্য ওঠে", "রবীন্দ্রনাথ লিখেছিলেন")। কেবল সর্বনাম পদ উত্তম ও মধ্যম পুরুষ হতে পারে।',
    teacherGoldenTips: 'মাস্টার টেবিল: উত্তম পুরুষ = আমি/আমরা (ক্রিয়া: খাই, যাই)। মধ্যম পুরুষ = তুমি/তুই/আপনি (ক্রিয়া: খাও, খাস, খান)। নাম পুরুষ = সে/তিনি/রহিম (ক্রিয়া: খায়, খান)। সকল বিশেষ্য শব্দই নাম পুরুষ!',
    rules: [
      {
        ruleNo: 1,
        nameBn: 'সম্মানসূচক ক্রিয়া সংগতি',
        explanationBn: 'কর্তা যদি সম্ভ্রান্ত বা সম্মানসূচক হয় (আপনি/তিনি/শিক্ষক), তবে ক্রিয়ার শেষে "ন" বা "এন" যুক্ত হয়।',
        examples: [
          {
            bn: 'তিনি বললেন (তিনি বলল ❌); আপনি আসুন (আপনি আসো ❌)।',
            context: 'সম্মানসূচক অন্বয়'
          }
        ]
      }
    ],
    formulas: [
      {
        label: 'পুরুষ ও ক্রিয়ার অন্বয় ছক',
        structure: 'উত্তম (আমি যাই) | মধ্যম সাধারণ (তুমি যাও) | মধ্যম সম্ভ্রান্ত (আপনি যান) | মধ্যম তুচ্ছ (তুই যাস) | নাম (সে যায়/তিনি যান)'
      }
    ],
    examples: [
      {
        bn: 'আমরা দেশকে ভালোবাসি (আমরা = উত্তম পুরুষ)',
        context: 'উত্তম পুরুষ'
      },
      {
        bn: 'আপনারা চা গ্রহণ করুন (আপনারা = মধ্যম পুরুষ সম্ভ্রান্ত)',
        context: 'মধ্যম পুরুষ'
      }
    ],
    exceptions: [
      {
        titleBn: 'বচনের চেয়ে পুরুষের প্রাধান্য',
        descriptionBn: 'বাংলায় বচনভেদে ক্রিয়ার রূপ বদলায় না (আমি যাই, আমরা যাই; সে যায়, তারা যায়), কিন্তু পুরুষভেদে ক্রিয়া অবশ্যই বদলায়!'
      }
    ],
    commonMistakes: [
      {
        incorrectBn: '"রহিম একজন ভালো ছাত্র"—এখানে রহিম উত্তম পুরুষ।',
        correctBn: 'রহিম নাম পুরুষ; সকল বিশেষ্য পদই নাম পুরুষ।',
        explanationBn: 'আমি/আমরা ছাড়া কোনো নামপদ উত্তম পুরুষ হতে পারে না।'
      }
    ],
    writtenPractice: [
      {
        id: 1,
        type: 'CONJUGATION',
        prompt: '"পড়্" ধাতুর সাধারণ বর্তমান কালের রূপ উত্তম, মধ্যম (সাধারণ ও সম্ভ্রান্ত) এবং নাম পুরুষে দেখাও।',
        correctAnswer: 'উত্তম পুরুষ: আমি পড়ি। মধ্যম পুরুষ (সাধারণ): তুমি পড়ো। মধ্যম পুরুষ (সম্ভ্রান্ত): আপনি পড়েন। নাম পুরুষ: সে পড়ে / তিনি পড়েন।',
        explanationBn: 'পুরুষভিত্তিক ক্রিয়ার অন্বয় পরীক্ষা।'
      }
    ],
    tags: ['PURUSH', 'PERSON', 'UTTOM', 'MODHYOM', 'NAAM', 'SSC'],
    status: 'PUBLISHED',
    orderIndex: 1,
    viewCount: 180
  }
];

const CHAPTER_17_MCQS = [
  {
    id: 117001,
    chapterId: 117,
    topicId: 11701,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: 'বাংলা ব্যাকরণে সকল বিশেষ্য পদ (Noun) কোন পুরুষের অন্তর্ভুক্ত?',
    questionEn: 'In Bengali grammar, all nouns belong to which grammatical person?',
    options: ['নাম পুরুষ', 'উত্তম পুরুষ', 'মধ্যম পুরুষ', 'উভয় পুরুষ'],
    correctOptionIndex: 0,
    correctAnswerText: 'নাম পুরুষ',
    explanationBn: 'বিশ্বের সকল বিশেষ্য পদ বা নামবাচক পদ নাম পুরুষের (Third Person) অন্তর্ভুক্ত।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'ঢাকা বোর্ড',
    year: 2024,
    examType: 'SSC',
    tags: ['PURUSH', 'THIRD_PERSON', 'DHAKA_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 117002,
    chapterId: 117,
    topicId: 11701,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: 'নিচের কোনটি মধ্যম পুরুষ সম্ভ্রান্ত বা সম্মানসূচকের সর্বনাম?',
    questionEn: 'Which of the following is an honorific second-person pronoun?',
    options: ['আপনি', 'তুমি', 'তুই', 'সে'],
    correctOptionIndex: 0,
    correctAnswerText: 'আপনি',
    explanationBn: '"আপনি" হলো মধ্যম পুরুষের সম্ভ্রান্ত বা সম্মানসূচক রূপ (তুমি=সাধারণ, তুই=তুচ্ছ/ঘনিষ্ঠ)।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'কুমিল্লা বোর্ড',
    year: 2023,
    examType: 'SSC',
    tags: ['APNI', 'HONORIFIC', 'CUMILLA_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 117003,
    chapterId: 117,
    topicId: 11701,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: 'নিচের কোনটি উত্তম পুরুষের উদাহরণ?',
    questionEn: 'Which of the following is an example of First Person (Uttom Purush)?',
    options: ['আমরা', 'তোমরা', 'তারা', 'আপনারা'],
    correctOptionIndex: 0,
    correctAnswerText: 'আমরা',
    explanationBn: 'বক্তা নিজে বা নিজেদের বোঝাতে ব্যবহৃত "আমি/আমরা" হলো উত্তম পুরুষ (First Person)।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'রাজশাহী বোর্ড',
    year: 2024,
    examType: 'SSC',
    tags: ['UTTOM_PURUSH', 'AMRA', 'RAJSHAHI_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 117004,
    chapterId: 117,
    topicId: 11701,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: 'কর্তা "তিনি" হলে বর্তমান কালে "যা" ধাতুর সঠিক রূপ কোনটি?',
    questionEn: 'If the subject is "Tini", what is the correct present tense form of root "ja"?',
    options: ['যান', 'যায়', 'যাও', 'যাস'],
    correctOptionIndex: 0,
    correctAnswerText: 'যান',
    explanationBn: '"তিনি" হলেন সম্ভ্রান্ত নাম পুরুষ, তাই সম্মানসূচক ক্রিয়ারূপ "যান" প্রযুক্ত হবে।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'যশোর বোর্ড',
    year: 2024,
    examType: 'SSC',
    tags: ['VERB_CONCORD', 'TINI_JAN', 'JASHORE_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 117005,
    chapterId: 117,
    topicId: 11701,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: 'বাংলা ভাষায় নিচের কোন ব্যাকরণিক উপাদানের পরিবর্তনে ক্রিয়াপদের রূপ পরিবর্তিত হয় না?',
    questionEn: 'In Bengali, change of which element does NOT alter the verb form?',
    options: ['বচন', 'পুরুষ', 'কাল', 'সম্মানভেদ'],
    correctOptionIndex: 0,
    correctAnswerText: 'বচন',
    explanationBn: 'বাংলায় বচনভেদে ক্রিয়ার রূপ পরিবর্তিত হয় না (যেমন: সে যায়, তারা যায়; আমি খাই, আমরা খাই)।',
    difficulty: 'HARD',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'সিলেট বোর্ড',
    year: 2023,
    examType: 'SSC',
    tags: ['BOCHON_VERB_INVARIANCE', 'SYLHET_BOARD'],
    status: 'ACTIVE'
  }
];

const CHAPTER_17_MODEL_TEST = {
  id: 11701,
  subject: 'BANGLA',
  chapterId: 117,
  testTitleBn: 'অধ্যায় ১৭ মডেল টেস্ট: পুরুষ',
  testTitleEn: 'Chapter 17 Model Test: Person (Purush)',
  descriptionBn: 'উত্তম, মধ্যম ও নাম পুরুষের রূপভেদ, সম্মানসূচক ক্রিয়ার সংগতি এবং বচন বনাম পুরুষের প্রভাবের ওপর পূর্ণাঙ্গ মডেল টেস্ট।',
  durationMinutes: 10,
  totalMarks: 5,
  passPercentage: 60,
  difficulty: 'MEDIUM',
  questionCount: 5,
  questionIds: [117001, 117002, 117003, 117004, 117005],
  status: 'PUBLISHED'
};

// ============================================================================
// CHAPTER 18: কাল (Tense)
// ============================================================================
const CHAPTER_18_TOPICS = [
  {
    id: 11801,
    chapterId: 118,
    parentTopicId: null,
    subject: 'BANGLA',
    topicNo: '১৮.১',
    titleBn: 'কালের সংজ্ঞা, প্রধান ৩ কাল ও উপবিভাগসমূহের বিশদ রূপ',
    titleEn: 'Definition of Tense (Kaal), 3 Primary Tenses & Their Subtypes',
    slug: 'b18-kal-shongpga-o-prokarbhed',
    difficulty: 'BOARD_STANDARD',
    classLevel: 'Class 8 - 12 (SSC & HSC)',
    summaryBn: 'ক্রিয়া সম্পাদনের সময়কে কাল (Tense) বলে। প্রধান ৩টি কাল হলো: বর্তমান, অতীত ও ভবিষ্যৎ কাল। এদের মোট উপবিভাগ ১২টি।',
    definitionBn: 'কাল (Tense / Kaal): ক্রিয়া নিষ্পন্ন হওয়ার সময়কে ব্যাকরণে কাল বলে। কাল প্রধানত ৩ প্রকার: ১. বর্তমান কাল: কার্য এখন সংঘটিত হয় (সাধারণ বর্তমান, ঘটমান বর্তমান, পুরাঘটিত বর্তমান, নিত্যবৃত্ত বর্তমান)। ২. অতীত কাল: কার্য পূর্বে সম্পন্ন হয়ে গেছে (সাধারণ অতীত, ঘটমান অতীত, পুরাঘটিত অতীত, নিত্যবৃত্ত অতীত)। ৩. ভবিষ্যৎ কাল: কার্য আগামীতে সংঘটিত হবে (সাধারণ ভবিষ্যৎ, ঘটমান ভবিষ্যৎ, পুরাঘটিত ভবিষ্যৎ)।',
    definitionEn: 'Tense (Kaal) indicates the time of a verbal action: Present (Bortoman), Past (Otit), and Future (Bhobishshot), subdivided into Simple, Continuous, Perfect, and Habitual aspects.',
    explanationBn: 'বোর্ড পরীক্ষায় অত্যন্ত জনপ্রিয় ৪টি কালের কৌশল: ১. সাধারণ বর্তমান: প্রতিদিনের স্বাভাবিক সত্য বা চিরন্তন ঘটনা (যেমন: সূর্য পূর্ব দিকে ওঠে)। ২. ঘটমান বর্তমান: বর্তমানে কাজটি চলছে বা ঘটছে (যেমন: বৃষ্টি পড়ছে, সে লিখছে)। ৩. পুরাঘটিত বর্তমান: কাজটি এইমাত্র শেষ হয়েছে কিন্তু তার ফল এখনও বর্তমান রয়েছে (যেমন: আমি ভাত খেয়েছি, সে চিঠি লিখেছে)। ৪. নিত্যবৃত্ত অতীত: অতীতে প্রায়ই নিয়মিত বা অভ্যাসবশত ঘটত (যেমন: আমরা প্রতিদিন সকালে হাঁটতাম, বাবা আমাকে গল্প শোনাতেন)। ৫. পুরাঘটিত অতীত: বহু পূর্বে শেষ হয়ে গেছে এবং পরে আরও ঘটনা ঘটে গেছে (যেমন: বাবা আসার আগেই আমি বাড়ি ফিরেছিলাম)।',
    teacherGoldenTips: 'কালের সুপার ট্রিক: (১) অতীতে নিয়মিত অভ্যাস ("তাম", "তেন") → নিত্যবৃত্ত অতীত (যেমন: পড়তাম, যেতেন)। (২) চিরন্তন সত্য → সাধারণ বর্তমান (সূর্য ওঠে)। (৩) কাজ চলছে ("ছে", "ছেন") → ঘটমান বর্তমান (লিখছে)। (৪) এইমাত্র শেষ ("ছি", "ছেন") → পুরাঘটিত বর্তমান (এসেছি)।',
    rules: [
      {
        ruleNo: 1,
        nameBn: 'নিত্যবৃত্ত অতীতের চেনার উপায়',
        explanationBn: 'অতীতে নিয়মিত অভ্যাস বোঝাতে ক্রিয়াপদের শেষে "-তাম", "-তেন", "-তে" যুক্ত হয়।',
        examples: [
          {
            bn: 'আমরা ছোটবেলায় নদীতে সাঁতার কাটতাম (কাটতাম = নিত্যবৃত্ত অতীত)।',
            context: 'অতীতের অভ্যাস'
          }
        ]
      },
      {
        ruleNo: 2,
        nameBn: 'ঐতিহাসিক বর্তমানের প্রয়োগ',
        explanationBn: 'অতীতের কোনো স্মরণীয় ঐতিহাসিক ঘটনাকে জীবন্ত রূপ দিতে বর্তমান কালের ক্রিয়া ব্যবহার করা হয়।',
        examples: [
          {
            bn: '১৯৭১ সালে বাংলার দামাল ছেলেরা স্বাধীনতার জন্য লড়াই করে (করে = ঐতিহাসিক বর্তমান)।',
            context: 'ঐতিহাসিক বর্তমান'
          }
        ]
      }
    ],
    formulas: [
      {
        label: 'কাল নির্ণয় সমীকরণ',
        structure: 'চিরন্তন সত্য=সাধারণ বর্তমান | অভ্যাস="-তাম"=নিত্যবৃত্ত অতীত | কাজটি চলছে=ঘটমান | ফল বিদ্যমান=পুরাঘটিত'
      }
    ],
    examples: [
      {
        bn: 'সূর্য পূর্ব দিকে উদিত হয় (সাধারণ বর্তমান / চিরন্তন সত্য)',
        context: 'সাধারণ বর্তমান'
      },
      {
        bn: 'তিনি প্রতিদিন বিকেলে হাঁটতেন (নিত্যবৃত্ত অতীত)',
        context: 'নিত্যবৃত্ত অতীত'
      }
    ],
    exceptions: [
      {
        titleBn: 'ভবিষ্যতের অর্থে বর্তমানের প্রয়োগ',
        descriptionBn: 'আসন্ন বা নিশ্চিত ভবিষ্যৎ বোঝাতে কখনো বর্তমান কালের রূপ বসে (যেমন: "তুমি যাও, আমি এখনই আসছি")।'
      }
    ],
    commonMistakes: [
      {
        incorrectBn: '"আমরা ছোটবেলায় গান গাইতাম"—এটি সাধারণ অতীত।',
        correctBn: 'এটি নিত্যবৃত্ত অতীত কারণ অতীতে নিয়মিত অভ্যাস বোঝাচ্ছে।',
        explanationBn: 'অভ্যাস বোঝাতে নিত্যবৃত্ত অতীত প্রযুক্ত হয়।'
      }
    ],
    writtenPractice: [
      {
        id: 1,
        type: 'IDENTIFICATION',
        prompt: 'নিচের বাক্যগুলোর কাল নির্ণয় করো: (ক) সূর্য পশ্চিমে অস্ত যায়। (খ) বৃষ্টি হচ্ছিল। (গ) আমরা রোজ বিকেলে খেলা করতাম।',
        correctAnswer: '(ক) সাধারণ বর্তমান (চিরন্তন সত্য)। (খ) ঘটমান অতীত। (গ) নিত্যবৃত্ত অতীত (অতীতের নিয়মিত অভ্যাস)।',
        explanationBn: 'বোর্ড পরীক্ষার অত্যন্ত কমন ৩ নম্বরের প্রশ্ন।'
      }
    ],
    tags: ['KAL', 'TENSE', 'BORTOMAN', 'OTIT', 'BHOBISHSHOT', 'NITYOBRITTO', 'SSC'],
    status: 'PUBLISHED',
    orderIndex: 1,
    viewCount: 310
  }
];

const CHAPTER_18_MCQS = [
  {
    id: 118001,
    chapterId: 118,
    topicId: 11801,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: '"সূর্য পূর্ব দিকে উদিত হয়"—এটি কোন কালের উদাহরণ?',
    questionEn: 'In "Shurjo purbo dike udito hoy", which tense is it?',
    options: ['সাধারণ বর্তমান', 'নিত্যবৃত্ত বর্তমান', 'ঘটমান বর্তমান', 'পুরাঘটিত বর্তমান'],
    correctOptionIndex: 0,
    correctAnswerText: 'সাধারণ বর্তমান',
    explanationBn: 'চিরন্তন সত্য বা স্বাভাবিক বৈজ্ঞানিক নিয়ম প্রকাশে সাধারণ বর্তমান (বা নিত্যবৃত্ত বর্তমান) কাল ব্যবহৃত হয়।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'ঢাকা বোর্ড',
    year: 2024,
    examType: 'SSC',
    tags: ['SHADHARON_BORTOMAN', 'UNIVERSAL_TRUTH', 'DHAKA_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 118002,
    chapterId: 118,
    topicId: 11801,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: '"আমরা ছোটবেলায় প্রতিদিন মাঠে ফুটবল খেলতাম"—এখানে "খেলতাম" কোন কাল?',
    questionEn: 'What tense is "kheltam"?',
    options: ['নিত্যবৃত্ত অতীত', 'সাধারণ অতীত', 'ঘটমান অতীত', 'পুরাঘটিত অতীত'],
    correctOptionIndex: 0,
    correctAnswerText: 'নিত্যবৃত্ত অতীত',
    explanationBn: 'অতীতে নিয়মিত বা অভ্যাসবশত কোনো কাজ হতো বোঝালে তাকে নিত্যবৃত্ত অতীত কাল বলে।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'রাজশাহী বোর্ড',
    year: 2023,
    examType: 'SSC',
    tags: ['NITYOBRITTO_OTIT', 'HABITUAL_PAST', 'RAJSHAHI_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 118003,
    chapterId: 118,
    topicId: 11801,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: '"আকাশে মেঘ ডাকছে এবং বৃষ্টি পড়ছে"—এটি কোন প্রকার কাল?',
    questionEn: 'What tense is "Brishti porchhe"?',
    options: ['ঘটমান বর্তমান', 'সাধারণ বর্তমান', 'পুরাঘটিত বর্তমান', 'সাধারণ অতীত'],
    correctOptionIndex: 0,
    correctAnswerText: 'ঘটমান বর্তমান',
    explanationBn: 'বর্তমানে কাজটি অবিরাম চলছে বা সংঘটিত হচ্ছে বোঝালে ঘটমান বর্তমান কাল (Present Continuous) হয়।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'যশোর বোর্ড',
    year: 2024,
    examType: 'SSC',
    tags: ['GHOTOMAN_BORTOMAN', 'JASHORE_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 118004,
    chapterId: 118,
    topicId: 11801,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: '"আমি এইমাত্র চিঠিটি পেয়েছি"—এখানে "পেয়েছি" কোন কাল?',
    questionEn: 'In "Ami eimatro chithiti peyechhi", what tense is "peyechhi"?',
    options: ['পুরাঘটিত বর্তমান', 'সাধারণ বর্তমান', 'সাধারণ অতীত', 'নিত্যবৃত্ত অতীত'],
    correctOptionIndex: 0,
    correctAnswerText: 'পুরাঘটিত বর্তমান',
    explanationBn: 'যে ক্রিয়া কিছু পূর্বে সমাপ্ত হয়েছে কিন্তু তার ফল এখনও বিদ্যমান রয়েছে, তাকে পুরাঘটিত বর্তমান কাল (Present Perfect) বলে।',
    difficulty: 'MEDIUM',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'কুমিল্লা বোর্ড',
    year: 2024,
    examType: 'SSC',
    tags: ['PURAGHOTITO_BORTOMAN', 'CUMILLA_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 118005,
    chapterId: 118,
    topicId: 11801,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: '"আগামীকাল আমাদের বার্ষিক পরীক্ষা শুরু হবে"—এখানে "শুরু হবে" কোন কাল?',
    questionEn: 'What tense is "shuru hobe"?',
    options: ['সাধারণ ভবিষ্যৎ', 'ঘটমান ভবিষ্যৎ', 'পুরাঘটিত ভবিষ্যৎ', 'সাধারণ বর্তমান'],
    correctOptionIndex: 0,
    correctAnswerText: 'সাধারণ ভবিষ্যৎ',
    explanationBn: 'আগামী সময়ে কোনো সাধারণ কার্য সংঘটিত হবে নির্দেশ করায় এটি সাধারণ ভবিষ্যৎ কাল (Simple Future)।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'চট্টগ্রাম বোর্ড',
    year: 2024,
    examType: 'SSC',
    tags: ['SHADHARON_BHOBISHSHOT', 'CHITTAGONG_BOARD'],
    status: 'ACTIVE'
  }
];

const CHAPTER_18_MODEL_TEST = {
  id: 11801,
  subject: 'BANGLA',
  chapterId: 118,
  testTitleBn: 'অধ্যায় ১৮ মডেল টেস্ট: কাল (Tense)',
  testTitleEn: 'Chapter 18 Model Test: Tense (Kaal)',
  descriptionBn: 'সাধারণ বর্তমান, ঘটমান বর্তমান, পুরাঘটিত বর্তমান, নিত্যবৃত্ত অতীত ও সাধারণ ভবিষ্যতের ওপর পূর্ণাঙ্গ মডেল টেস্ট।',
  durationMinutes: 10,
  totalMarks: 5,
  passPercentage: 60,
  difficulty: 'MEDIUM',
  questionCount: 5,
  questionIds: [118001, 118002, 118003, 118004, 118005],
  status: 'PUBLISHED'
};

// ============================================================================
// CHAPTER 19: বর্ণের উচ্চারণ ও ধ্বনি পরিবর্তন (Sound Changes)
// ============================================================================
const CHAPTER_19_TOPICS = [
  {
    id: 11901,
    chapterId: 119,
    parentTopicId: null,
    subject: 'BANGLA',
    topicNo: '১৯.১',
    titleBn: 'বর্ণের উচ্চারণ স্থান ও ধ্বনি পরিবর্তনের প্রধান নিয়মসমূহ',
    titleEn: 'Phonetic Places of Articulation & Primary Sound Change Rules',
    slug: 'b19-dhwani-poriborton-o-uchcharon',
    difficulty: 'BOARD_STANDARD',
    classLevel: 'Class 8 - 12 (SSC & HSC)',
    summaryBn: 'ভাষার প্রবাহে উচ্চারণের সুবিধার জন্য ধ্বনির যে রূপান্তর ঘটে, তাকে ধ্বনি পরিবর্তন বলে। এর মধ্যে স্বরাগম, স্বরলোপ, অপিনিহিতি ও সমীভবন অন্যতম।',
    definitionBn: 'ধ্বনি পরিবর্তন: সময়, ভৌগোলিক পরিবেশ ও মানুষের বাগ্যন্ত্রের সহজপ্রবৃত্তির কারণে শব্দের মূল ধ্বনির যে পরিবর্তন ঘটে, তাকে ধ্বনি পরিবর্তন বলে। প্রধান পরিবর্তনসমূহ: ১. স্বরাগম: শব্দের আগে, মাঝে বা শেষে নতুন স্বরধ্বনির আগমন (আদি স্বরাগম: স্কুল > ইস্কুল; মধ্য স্বরাগম/বিপ্রকর্ষ: রত্ন > রতন; অন্ত স্বরাগম: দিশ > দিশা)। ২. স্বরলোপ: আদি স্বরলোপ (অলাবু > লাউ); মধ্য স্বরলোপ/সম্প্রকর্ষ (বসতি > বস্তি); অন্ত স্বরলোপ (আজি > আজ)। ৩. অপিনিহিতি: পরের ই-কার বা উ-কার আগে উচ্চারিত হওয়া (আজি > আইজ, সাধু > সাউধ)। ৪. সমীভবন: দুটি ভিন্ন ব্যঞ্জন একে অপরের প্রভাবে একরকম হওয়া (পদ্মো > পদ্দ, জন্ম > জম্ম)। ৫. বিষমীভবন: দুটি সমবর্ণের একটি পরিবর্তিত হওয়া (শরীর > শরীল, লাল > নাল)। ৬. বর্ণ বিপর্যয়: পাশাপাশি দুটি বর্ণের স্থান বদল (পিশাচ > পিচাশ, বাক্স > বাস্ক)।',
    definitionEn: 'Sound Change (Dhwani Poriborton) encompasses systematic phonetic transformations including Anaptyxis (Swaragom), Syncope (Swarolop), Epenthesis (Opinihiti), Assimilation (Shomibhobon), and Metathesis (Borno Biporjoy).',
    explanationBn: 'বোর্ড পরীক্ষায় নিশ্চিত কমন আসা ৪টি উদাহরণ: ১. স্কুল > ইস্কুল, স্টেশন > ইস্টিশন → আদি স্বরাগম। ২. রত্ন > রতন, ধর্ম > ধরম, স্বপ্ন > স্বপন → মধ্য স্বরাগম বা বিপ্রকর্ষ। ৩. আজি > আইজ, চার > চাইর, রাখিয়া > রাইখা → অপিনিহিতি। ৪. শরীর > শরীল, লাল > নাল → বিষমীভবন। ৫. বাক্স > বাস্ক, রিক্সা > রিস্কা → বর্ণ বিপর্যয়। উচ্চারণের স্থান অনুযায়ী বাংলা বর্ণমালাকে কণ্ঠ্য (ক-বর্গ), তালব্য (চ-বর্গ), মূর্ধন্য (ট-বর্গ), দন্ত্য (ত-বর্গ) ও ওষ্ঠ্য (প-বর্গ) ধ্বনিতে ভাগ করা হয়।',
    teacherGoldenTips: 'ম্যাজিক ফর্মুলা: (১) "ইস্কুল" (শুরুতে ই এলো) = আদি স্বরাগম। (২) "রতন" (মাঝে অ এলো) = মধ্য স্বরাগম/বিপ্রকর্ষ। (৩) "আইজ" (ই আগে এলো) = অপিনিহিতি। (৪) "বাস্ক" (বর্ণের স্থান বদল) = বর্ণ বিপর্যয়। (৫) "শরীল" (র হলো ল) = বিষমীভবন।',
    rules: [
      {
        ruleNo: 1,
        nameBn: 'অপিনিহিতির সনাক্তকরণ নিয়ম',
        explanationBn: 'শব্দে যুক্তবর্ণের পূর্বে বা শব্দের শেষের ই/উ যদি শব্দের মধ্যে আগেই উচ্চারিত হয়, তবে তা অপিনিহিতি।',
        examples: [
          {
            bn: 'আজি > আইজ, সাধু > সাউধ, চার > চাইর।',
            context: 'অপিনিহিতি'
          }
        ]
      },
      {
        ruleNo: 2,
        nameBn: 'বিষমীভবন চেনার উপায়',
        explanationBn: 'একই শব্দের দুটি সমবর্ণের যেকোনো একটি যদি অন্য বর্ণে রূপান্তরিত হয়, তবে তা বিষমীভবন।',
        examples: [
          {
            bn: 'শরীর > শরীল (দ্বিতীয় র টি ল হয়েছে); লাল > নাল (প্রথম ল টি ন হয়েছে)।',
            context: 'বিষমীভবন'
          }
        ]
      }
    ],
    formulas: [
      {
        label: 'ধ্বনি পরিবর্তন ছক',
        structure: 'আদি স্বরাগম (ইস্কুল) | বিপ্রকর্ষ (রতন) | অপিনিহিতি (আইজ) | বিষমীভবন (শরীল) | বর্ণ বিপর্যয় (বাস্ক)'
      }
    ],
    examples: [
      {
        bn: 'পিশাচ > পিচাশ (বর্ণ বিপর্যয়)',
        context: 'স্থান বিনিময়'
      },
      {
        bn: 'বাক্স > বাস্ক (বর্ণ বিপর্যয়)',
        context: 'স্থান বিনিময়'
      }
    ],
    exceptions: [
      {
        titleBn: 'অভিশ্রুতি (Umlaut)',
        descriptionBn: 'অপিনিহিতির পরের স্তরে ই/উ পূর্ববর্তী স্বরের সাথে মিলিত হয়ে সাধু থেকে চলিতে রূপান্তরিত হলে তা অভিশ্রুতি হয় (রাখিয়া > রাইখা > রেখে)।'
      }
    ],
    commonMistakes: [
      {
        incorrectBn: '"শরীর > শরীল"—এটি সমীভবন।',
        correctBn: 'এটি বিষমীভবন।',
        explanationBn: 'কারণ সমবর্ণ পৃথক হয়েছে; ভিন্ন বর্ণ এক হয়নি।'
      }
    ],
    writtenPractice: [
      {
        id: 1,
        type: 'IDENTIFICATION',
        prompt: 'নিচের পরিবর্তনগুলোর ব্যাকরণিক নাম লিখ: (ক) স্কুল > ইস্কুল (খ) আজি > আইজ (গ) শরীর > শরীল (ঘ) বাক্স > বাস্ক।',
        correctAnswer: '(ক) আদি স্বরাগম (খ) অপিনিহিতি (গ) বিষমীভবন (ঘ) বর্ণ বিপর্যয়।',
        explanationBn: 'বোর্ড পরীক্ষার অত্যন্ত কমন ৪ নম্বরের প্রশ্ন।'
      }
    ],
    tags: ['DHWANI_PORIBORTON', 'SWARAGOM', 'OPINIHITI', 'SHOMIBHOBON', 'BISHOMIBHOBON', 'SSC'],
    status: 'PUBLISHED',
    orderIndex: 1,
    viewCount: 290
  }
];

const CHAPTER_19_MCQS = [
  {
    id: 119001,
    chapterId: 119,
    topicId: 11901,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: '"স্কুল > ইস্কুল" এবং "স্টেশন > ইস্টিশন"—এটি কোন ধরনের ধ্বনি পরিবর্তন?',
    questionEn: 'What type of sound change is "School > Ischool"?',
    options: ['আদি স্বরাগম', 'মধ্য স্বরাগম', 'অন্ত স্বরাগম', 'অপিনিহিতি'],
    correctOptionIndex: 0,
    correctAnswerText: 'আদি স্বরাগম',
    explanationBn: 'উচ্চারণের সুবিধার্থে শব্দের শুরুতে অতিরিক্ত স্বরধ্বনি (ই) আগমন করায় একে আদি স্বরাগম বলে।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'ঢাকা বোর্ড',
    year: 2024,
    examType: 'SSC',
    tags: ['SWARAGOM', 'ISCHOOL', 'DHAKA_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 119002,
    chapterId: 119,
    topicId: 11901,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: '"লাল > নাল" এবং "শরীর > শরীল"—এটি কোন প্রকার ধ্বনি পরিবর্তন?',
    questionEn: 'What type of sound change is "Lal > Nal" and "Shorir > Shoril"?',
    options: ['বিষমীভবন', 'সমীভবন', 'বর্ণ বিপর্যয়', 'অপিনিহিতি'],
    correctOptionIndex: 0,
    correctAnswerText: 'বিষমীভবন',
    explanationBn: 'পাশাপাশি অবস্থিত দুটি সমধ্বনির একটির পরিবর্তন ঘটলে তাকে বিষমীভবন (Dissimilation) বলে।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'যশোর বোর্ড',
    year: 2023,
    examType: 'SSC',
    tags: ['BISHOMIBHOBON', 'JASHORE_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 119003,
    chapterId: 119,
    topicId: 11901,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: '"আজি > আইজ" এবং "সাধু > সাউধ"—কোন ধ্বনি পরিবর্তনের উদাহরণ?',
    questionEn: 'What sound change is "Aji > Aij"?',
    options: ['অপিনিহিতি', 'অভিশ্রুতি', 'সমীভবন', 'বর্ণ বিপর্যয়'],
    correctOptionIndex: 0,
    correctAnswerText: 'অপিনিহিতি',
    explanationBn: 'পরের ই-কার বা উ-কার আগে উচ্চারিত হওয়ার ব্যাকরণিক প্রক্রিয়াকে অপিনিহিতি (Epenthesis) বলে।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'রাজশাহী বোর্ড',
    year: 2024,
    examType: 'SSC',
    tags: ['OPINIHITI', 'AJI_AIJ', 'RAJSHAHI_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 119004,
    chapterId: 119,
    topicId: 11901,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: '"বাক্স > বাস্ক" এবং "পিশাচ > পিচাশ"—এটি কোন প্রকারের পরিবর্তন?',
    questionEn: 'What type of phonetic change is "Baksho > Basko"?',
    options: ['বর্ণ বিপর্যয়', 'বিষমীভবন', 'সমীভবন', 'স্বরভক্তি'],
    correctOptionIndex: 0,
    correctAnswerText: 'বর্ণ বিপর্যয়',
    explanationBn: 'শব্দের মধ্যে দুটি ব্যঞ্জনের পরস্পরের স্থান অদলবদল হওয়াকে বর্ণ বিপর্যয় (Metathesis) বলে।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'দিনাজপুর বোর্ড',
    year: 2024,
    examType: 'SSC',
    tags: ['BORNO_BIPORJOY', 'METATHESIS', 'DINAJPUR_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 119005,
    chapterId: 119,
    topicId: 11901,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: 'বাংলা বর্ণমালায় পূর্ণমাত্রা, অর্ধমাত্রা ও মাত্রাহীন বর্ণের মোট সংখ্যা যথাক্রমে কত?',
    questionEn: 'What are the total numbers of full-matra, half-matra, and matra-less letters in Bengali?',
    options: ['৩২, ৮, ১০', '৩০, ১০, ১০', '৩২, ১০, ৮', '২৮, ১০, ১২'],
    correctOptionIndex: 0,
    correctAnswerText: '৩২, ৮, ১০',
    explanationBn: '৫০টি বাংলা বর্ণের মধ্যে পূর্ণমাত্রা ৩২টি, অর্ধমাত্রা ৮টি এবং মাত্রাহীন বর্ণ ১০টি।',
    difficulty: 'MEDIUM',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'চট্টগ্রাম বোর্ড',
    year: 2023,
    examType: 'SSC',
    tags: ['MATRA', 'ALPHABET_STATS', 'CHITTAGONG_BOARD'],
    status: 'ACTIVE'
  }
];

const CHAPTER_19_MODEL_TEST = {
  id: 11901,
  subject: 'BANGLA',
  chapterId: 119,
  testTitleBn: 'অধ্যায় ১৯ মডেল টেস্ট: বর্ণের উচ্চারণ ও ধ্বনি পরিবর্তন',
  testTitleEn: 'Chapter 19 Model Test: Sound Changes (Dhwani Poriborton)',
  descriptionBn: 'স্বরাগম, স্বরলোপ, অপিনিহিতি, অভিশ্রুতি, সমীভবন, বিষমীভবন, বর্ণ বিপর্যয় ও মাত্রার ওপর পূর্ণাঙ্গ মডেল টেস্ট।',
  durationMinutes: 10,
  totalMarks: 5,
  passPercentage: 60,
  difficulty: 'MEDIUM',
  questionCount: 5,
  questionIds: [119001, 119002, 119003, 119004, 119005],
  status: 'PUBLISHED'
};

// ============================================================================
// CHAPTER 20: শুদ্ধ বানান, ণ-ত্ব ও ষ-ত্ব বিধান (Spelling Rules, Notto & Shotto)
// ============================================================================
const CHAPTER_20_TOPICS = [
  {
    id: 12001,
    chapterId: 120,
    parentTopicId: null,
    subject: 'BANGLA',
    topicNo: '২০.১',
    titleBn: 'ণ-ত্ব বিধান ও ষ-ত্ব বিধান: নিয়ম ও ব্যতিক্রম',
    titleEn: 'Notto Bidhan & Shotto Bidhan: Rules & Exceptions',
    slug: 'b20-notto-o-shotto-bidhan',
    difficulty: 'BOARD_STANDARD',
    classLevel: 'Class 8 - 12 (SSC & HSC)',
    summaryBn: 'তৎসম শব্দের বানানে মূর্ধন্য-ণ এবং মূর্ধন্য-ষ ব্যবহারের যে নির্দিষ্ট বিধান রয়েছে, তাকে ণ-ত্ব ও ষ-ত্ব বিধান বলে।',
    definitionBn: 'ণ-ত্ব ও ষ-ত্ব বিধান: ১. ণ-ত্ব বিধান: তৎসম বা সংস্কৃত শব্দের বানানে দন্ত্য-ন (ন)-এর স্থলে মূর্ধন্য-ণ (ণ) ব্যবহারের সুনির্দিষ্ট ব্যাকরণিক নিয়মকে ণ-ত্ব বিধান বলে। ২. ষ-ত্ব বিধান: তৎসম শব্দের বানানে দন্ত্য-স (স)-এর স্থলে মূর্ধন্য-ষ (ষ) ব্যবহারের নিয়মকে ষ-ত্ব বিধান বলে। গুরুত্বপূর্ণ শর্ত: ণ-ত্ব ও ষ-ত্ব বিধান কেবল তৎসম শব্দের ক্ষেত্রেই প্রযোজ্য, খাঁটি বাংলা বা বিদেশি শব্দে কখনো "ণ" বা "ষ" বসে না।',
    definitionEn: 'Notto and Shotto Bidhan are rules governing the orthographic use of retroflex N (ণ) and retroflex Sh (ষ) exclusively in Tatsama (Sanskrit) vocabulary.',
    explanationBn: 'ণ-ত্ব বিধানের মূল ৪টি নিয়ম: ১. ঋ, র, ষ-এর পর মূর্ধন্য-ণ হয় (ঋণ, বর্ণ, কারণ, কৃষ্ণ, ভীষণ)। ২. ঋ, র, ষ-এর পর যদি স্বরবর্ণ, ক-বর্গ, প-বর্গ, য, ৱ, হ, ং থাকে, তবে তার পরবর্তী ন মূর্ধন্য-ণ হয় (কৃপণ, লক্ষণ, হরিণ, গ্রহণ)। ৩. ট-বর্গীয় বর্ণের (ট, ঠ, ড, ঢ) পূর্বে যুক্তবর্ণে সবসময় মূর্ধন্য-ণ হয় (ঘণ্টা, লণ্ঠন, কাণ্ড)। ষ-ত্ব বিধানের নিয়ম: ১. ঋ-কারের পর মূর্ধন্য-ষ হয় (ঋষি, কৃষক, দৃষ্টি)। ২. অ, আ ভিন্ন অন্য স্বরবর্ণের পর ষ হয় (ভবিষ্যৎ, পরিষ্কার, আবিষ্কার, মুমূর্ষু)। ৩. ট-বর্গে যুক্ত হলে ষ হয় (কষ্ট, স্পষ্ট, নষ্ট, কাষ্ঠ)। ব্যতিক্রম ও স্বভাবতই ণ/ষ: চাণক্য মাণিক্য বাণিজ্য লবণ মণ..., আষাঢ়, ষোড়শ, পাষাণ ইত্যাদি শব্দে স্বভাবতই ণ ও ষ বসে। ত-বর্গে কখনো ণ বা ষ হয় না (অনন্ত, গ্রন্থ)। বিদেশি শব্দে ণ ও ষ নিষেধ (মাস্টার, পোস্ট, কর্নার)।',
    teacherGoldenTips: 'আলমগীর স্যারের মেগা রুল: (১) ট-বর্গে যুক্ত হলে সবসময় ণ এবং ষ! (ঘণ্টা, কষ্ট)। (২) ত-বর্গে যুক্ত হলে কখনো ণ/ষ হবে না, সবসময় ন এবং স! (শান্ত, গ্রন্থ, বিস্তার)। (৩) খাঁটি বাংলা ও বিদেশি শব্দে ণ ও ষ নিষিদ্ধ! যেমন: কর্নার, মাস্টার, পোস্ট, ফটোস্ট্যাট, কুরআন, গভর্নর সব দন্ত্য-স ও দন্ত্য-ন দিয়ে লিখতে হবে!',
    rules: [
      {
        ruleNo: 1,
        nameBn: 'ট-বর্গীয় নিয়মে মূর্ধন্য বর্ণ',
        explanationBn: 'ট, ঠ, ড, ঢ-এর সাথে যুক্ত বর্ণে সর্বদা মূর্ধন্য-ণ এবং মূর্ধন্য-ষ বসে।',
        examples: [
          {
            bn: 'ঘণ্টা, কাণ্ড, লণ্ঠন (ট-বর্গে ণ); কষ্ট, কাষ্ঠ, নষ্ট (ট-বর্গে ষ)।',
            context: 'ট-বর্গের সংযোগ',
            highlight: 'ঘণ্টা, কষ্ট'
          }
        ]
      },
      {
        ruleNo: 2,
        nameBn: 'বিদেশি শব্দে ণ ও ষ বর্জনের বিধান',
        explanationBn: 'আরবি, ফারসি, ইংরেজি ইত্যাদি কোনো বিদেশি শব্দে ণ বা ষ লেখা বাংলা একাডেমি নিয়মে সম্পূর্ণ নিষিদ্ধ।',
        examples: [
          {
            bn: 'মাস্টার (মাষ্টার ❌), পোস্ট (পোষ্ট ❌), কর্নার (কর্ণার ❌), স্টেশন (ষ্টেশন ❌)।',
            context: 'বিদেশি শব্দের শুদ্ধ রূপ'
          }
        ]
      }
    ],
    formulas: [
      {
        label: 'ণ-ত্ব ও ষ-ত্ব ম্যাজিক সূত্র',
        structure: 'ঋ/র/ষ + ন = ণ | ট-বর্গ + ন/স = ণ/ষ | বিদেশি শব্দ = কেবল ন ও স'
      }
    ],
    examples: [
      {
        bn: 'পরিষ্কার (পর্ + ই + ষ = পরিষ্কার)',
        context: 'ষ-ত্ব বিধান'
      },
      {
        bn: 'পুরস্কার (পুর্ + অ + স = পুরস্কার; অ থাকায় দন্ত্য-স)',
        context: 'পুরস্কার বনাম পরিষ্কার'
      }
    ],
    exceptions: [
      {
        titleBn: 'পরিষ্কার বনাম পুরস্কার',
        descriptionBn: 'পরিষ্কার শব্দে "ই" স্বরধ্বনি থাকায় মূর্ধন্য-ষ (পরিষ্কার); কিন্তু পুরস্কার শব্দে "অ" স্বরধ্বনি থাকায় দন্ত্য-স (পুরস্কার)।'
      }
    ],
    commonMistakes: [
      {
        incorrectBn: 'পোষ্ট অফিস, ষ্টেশন, মাস্টার।',
        correctBn: 'পোস্ট অফিস, স্টেশন, মাস্টার।',
        explanationBn: 'ইংরেজি শব্দে কখনোই মূর্ধন্য-ষ হবে না, সর্বদা দন্ত্য-স বসবে।'
      },
      {
        incorrectBn: 'ঘন্টা (দন্ত্য-ন দিয়ে লেখা)।',
        correctBn: 'ঘণ্টা (ট-বর্গে যুক্ত হওয়ায় মূর্ধন্য-ণ)।',
        explanationBn: 'ট-বর্গে যুক্তবর্ণে মূর্ধন্য-ণ আবশ্যক।'
      }
    ],
    writtenPractice: [
      {
        id: 1,
        type: 'SPELLING_CORRECTION',
        prompt: 'নিচের বানানগুলো শুদ্ধ করে লিখ: (ক) পোষ্টমাষ্টার (খ) পরিস্কার (গ) পুস্প (ঘ) ঘন্টা।',
        correctAnswer: '(ক) পোস্টমাস্টার (খ) পরিষ্কার (গ) পুষ্প (ঘ) ঘণ্টা।',
        explanationBn: 'বোর্ড পরীক্ষার অত্যন্ত ক্লাসিক বানান শুদ্ধিকরণ।'
      }
    ],
    tags: ['NOTTO_BIDHAN', 'SHOTTO_BIDHAN', 'SPELLING', 'BANGLA_ACADEMY', 'SSC', 'HSC'],
    status: 'PUBLISHED',
    orderIndex: 1,
    viewCount: 380
  },
  {
    id: 12002,
    chapterId: 120,
    parentTopicId: null,
    subject: 'BANGLA',
    topicNo: '২০.২',
    titleBn: 'বাংলা একাডেমি প্রমিত বাংলা বানানের নিয়ম ও সর্বাধিক প্রচলিত ভুল বানান',
    titleEn: 'Bangla Academy Standard Spelling Rules & High-Frequency Errors',
    slug: 'b20-promito-banan-o-procholito-bhul',
    difficulty: 'BOARD_STANDARD',
    classLevel: 'Class 8 - 12 (SSC & HSC)',
    summaryBn: 'বাংলা একাডেমি প্রণীত প্রমিত বানানরীতি এবং বোর্ড পরীক্ষায় সর্বাধিক আসা ৫০টি ভুল বানানের শুদ্ধ রূপ।',
    definitionBn: 'প্রমিত বাংলা বানানের সাধারণ নিয়ম: ১. সকল অতৎসম (তদ্ভব, দেশি, বিদেশি, মিশ্র) শব্দে কেবল হ্রস্ব "ই" বা ই-কার (ি) এবং হ্রস্ব "উ" বা উ-কার (ু) ব্যবহৃত হবে (যেমন: পাখি, বাড়ি, শাড়ি, গাড়ি, দাবি, হাতি, চুন, পুজো)। ২. স্ত্রীবাচক অতৎসম শব্দেও দীর্ঘ-ঈ হবে না (যেমন: নানি, দাদি, মাসি, পিসি, চাচি)। ৩. ভাষা ও জাতিবাচক শব্দে হ্রস্ব-ই হবে (যেমন: বাঙালি, জাপানি, ইংরেজি, ইরানি, আরবি, ফারসি)। ৪. "অলি" প্রত্যয়যুক্ত শব্দে হ্রস্ব-ই হবে (যেমন: অঞ্জলি, গীতাঞ্জলি, পুষ্পাঞ্জলি, জলাঞ্জলি)। ৫. "জীবি" প্রত্যয়ে দীর্ঘ-ঈ হবে (যেমন: বুদ্ধিজীবী, শ্রমজীবী, আইনজীবী)।',
    definitionEn: 'Bangla Academy standard orthography mandates short vowels (-i, -u) for non-Tatsama words, nationalities, languages, and specific suffixes like -anjali.',
    explanationBn: 'বোর্ড পরীক্ষায় প্রতি বছর আসা সর্বাধিক গুরুত্বপূর্ণ ১০টি বানানের শুদ্ধ রূপ: ১. মুমূর্ষু (হ্রস্ব-উ, দীর্ঘ-ঊ, হ্রস্ব-উ) ২. দুরবস্থা (দুরাবস্থা ভুল) ৩. সান্ত্বনা (সা + ন্ত্ব + না) ৪. উচ্ছ্বাস (উ + চ্ছ্ব + াস) ৫. পিপীলিকা (প + ই + প + ঈ + ল + ই + ক + আ) ৬. শারীরিক (শা + র + ঈ + র + ই + ক) ৭. সমীচীন (স + ম + ঈ + চ + ঈ + ন; উভয়টিতে দীর্ঘ-ঈ) ৮. বিভীষিকা (ব + ই + ভ + ঈ + ষ + ই + ক + আ) ৯. প্রতিদ্বন্দ্বী / প্রতিদ্বন্দ্বিতা (প্রতিদ্বন্দ্বী কিন্তু প্রতিদ্বন্দ্বিতা) ১০. স্বায়ত্তশাসন (স্ব + আ + য় + ত্ত + শা + স + ন)।',
    teacherGoldenTips: 'ম্যাজিক বানান সূত্র: (১) "মুমূর্ষু" মনে রাখার কোড: উ-ঊ-উ (মাঝেরটা দীর্ঘ-ঊ, বাকি দুটো হ্রস্ব-উ)! (২) "সমীচীন" মনে রাখার কোড: ঈ-ঈ (দুটোই দীর্ঘ-ঈ)! (৩) "গীতাঞ্জলি" মনে রাখার কোড: অলি থাকলেই হ্রস্ব-ই (গীতাঞ্জলি, পুষ্পাঞ্জলি)! (৪) "বুদ্ধিজীবী" মনে রাখার কোড: জীবী মানেই দুটোই দীর্ঘ-ঈ!',
    rules: [
      {
        ruleNo: 1,
        nameBn: 'ভাষা ও জাতিবাচক শব্দে হ্রস্ব-ই বিধান',
        explanationBn: 'পৃথিবীর যেকোনো ভাষা বা জাতির নামের বানানে সর্বদাই হ্রস্ব-ই (ি) বসবে।',
        examples: [
          {
            bn: 'বাঙালি (বাঙালী ❌), ইংরেজি (ইংরেজী ❌), জাপানি (জাপানী ❌)।',
            context: 'ভাষা ও জাতির বানান'
          }
        ]
      },
      {
        ruleNo: 2,
        nameBn: '"অঞ্জলি" প্রত্যয়ে হ্রস্ব-ই বিধান',
        explanationBn: 'অঞ্জলি প্রত্যয়যুক্ত শব্দে কখনই দীর্ঘ-ঈ হবে না, সর্বদা হ্রস্ব-ই বসবে।',
        examples: [
          {
            bn: 'গীতাঞ্জলি (গীতাঞ্জলী ❌), জলাঞ্জলি (জলাঞ্জলী ❌), পুষ্পাঞ্জলি।',
            context: 'অঞ্জলি প্রত্যয়'
          }
        ]
      }
    ],
    formulas: [
      {
        label: 'সুপার হিট বানান কোড',
        structure: 'মুমূর্ষু (উ-ঊ-উ) | সমীচীন (ঈ-ঈ) | অঞ্জলি (ই) | জীবী (ঈ-ঈ) | জাতি/ভাষা (ই)'
      }
    ],
    examples: [
      {
        bn: 'বুদ্ধিজীবী (দুটোই দীর্ঘ-ঈ)',
        context: 'জীবী প্রত্যয়'
      },
      {
        bn: 'গীতাঞ্জলি (হ্রস্ব-ই)',
        context: 'অঞ্জলি প্রত্যয়'
      }
    ],
    exceptions: [
      {
        titleBn: 'তৎসম শব্দের অপরিবর্তনীয় রূপ',
        descriptionBn: 'তৎসম শব্দের প্রচলিত বানানের ক্ষেত্রে সংস্কৃত ব্যাকরণের আদি রূপ অক্ষুণ্ণ থাকে (যেমন: নদী, নারী, জননী)।'
      }
    ],
    commonMistakes: [
      {
        incorrectBn: 'গীতাঞ্জলী, বাঙ্গালী, ইংরেজী।',
        correctBn: 'গীতাঞ্জলি, বাঙালি, ইংরেজি।',
        explanationBn: 'প্রমিত বাংলা বানানের নিয়মে অঞ্জলি ও জাতি/ভাষায় হ্রস্ব-ই কার বসে।'
      },
      {
        incorrectBn: 'মুর্মূষু বা মুমূর্ষ।',
        correctBn: 'মুমূর্ষু (ম-হ্রস্ব উ, ম-দীর্ঘ ঊ, ষ-রেফ হ্রস্ব উ)।',
        explanationBn: 'বাংলা বর্ণমালার অন্যতম বিভ্রান্তিকর বানান।'
      }
    ],
    writtenPractice: [
      {
        id: 1,
        type: 'ERROR_CORRECTION',
        prompt: 'শুদ্ধ বানান লিখ: (ক) সমিচীন (খ) বুদ্ধিজীবি (গ) গীতাঞ্জলী (ঘ) মুমুর্ষু।',
        correctAnswer: '(ক) সমীচীন (খ) বুদ্ধিজীবী (গ) গীতাঞ্জলি (ঘ) মুমূর্ষু।',
        explanationBn: 'বোর্ড পরীক্ষার সবচেয়ে বেশি আসা ৪টি বানান।'
      }
    ],
    tags: ['SPELLING', 'BANGLA_ACADEMY', 'MUMURSHU', 'GITANJALI', 'SSC', 'HSC', 'BCS'],
    status: 'PUBLISHED',
    orderIndex: 2,
    viewCount: 420
  }
];

const CHAPTER_20_MCQS = [
  {
    id: 120001,
    chapterId: 120,
    topicId: 12001,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: 'ণ-ত্ব ও ষ-ত্ব বিধান কোন জাতীয় শব্দের বানানে কার্যকর হয়?',
    questionEn: 'In which category of vocabulary do Notto and Shotto Bidhan apply?',
    options: ['তৎসম শব্দে', 'তদ্ভব শব্দে', 'দেশি শব্দে', 'বিদেশি শব্দে'],
    correctOptionIndex: 0,
    correctAnswerText: 'তৎসম শব্দে',
    explanationBn: 'ণ-ত্ব ও ষ-ত্ব বিধান কেবলমাত্র সংস্কৃত বা তৎসম শব্দের বানানেই প্রযোজ্য। খাঁটি বাংলা বা বিদেশি শব্দে কখনো ণ বা ষ হয় না।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'ঢাকা বোর্ড',
    year: 2024,
    examType: 'SSC',
    tags: ['TATSAMA', 'NOTTO_SHOTTO', 'DHAKA_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 120002,
    chapterId: 120,
    topicId: 12002,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: 'নিচের কোন বানানটি সম্পূর্ণ শুদ্ধ?',
    questionEn: 'Which of the following spellings is completely correct?',
    options: ['মুমূর্ষু', 'মুমুর্ষু', 'মুর্মূষু', 'মুমূর্ষ'],
    correctOptionIndex: 0,
    correctAnswerText: 'মুমূর্ষু',
    explanationBn: 'সঠিক বানান "মুমূর্ষু" (ম-হ্রস্ব উ + ম-দীর্ঘ ঊ + ষ-রেফ হ্রস্ব উ)।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'রাজশাহী বোর্ড',
    year: 2023,
    examType: 'SSC',
    tags: ['MUMURSHU', 'RAJSHAHI_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 120003,
    chapterId: 120,
    topicId: 12002,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: 'বাংলা একাডেমি প্রমিত বানানের নিয়ম অনুযায়ী নিচের কোন বানানটি শুদ্ধ?',
    questionEn: 'According to Bangla Academy rules, which spelling is correct?',
    options: ['বাঙালি', 'বাঙালী', 'বাঙ্গালী', 'বাংগালি'],
    correctOptionIndex: 0,
    correctAnswerText: 'বাঙালি',
    explanationBn: 'ভাষা ও জাতিবাচক শব্দে দীর্ঘ-ঈ বর্জন করে সর্বদা হ্রস্ব-ই কার ব্যবহার বাধ্যতামূলক, তাই "বাঙালি" শুদ্ধ।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'যশোর বোর্ড',
    year: 2024,
    examType: 'SSC',
    tags: ['BANGALI', 'BANGLA_ACADEMY', 'JASHORE_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 120004,
    chapterId: 120,
    topicId: 12002,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: 'নিচের কোন বানানটিতে উভয় ই-কারই দীর্ঘ-ঈ কার যুক্ত?',
    questionEn: 'In which spelling are both vowels long -ee (Dirgho-ee)?',
    options: ['সমীচীন', 'সমিচীন', 'সমীচিন', 'সমিচিন'],
    correctOptionIndex: 0,
    correctAnswerText: 'সমীচীন',
    explanationBn: '"সমীচীন" বানানে উভয় স্বরধ্বনিই দীর্ঘ-ঈ কার যুক্ত (স + ম-দীর্ঘ ঈ + চ-দীর্ঘ ঈ + ন)।',
    difficulty: 'MEDIUM',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'কুমিল্লা বোর্ড',
    year: 2024,
    examType: 'SSC',
    tags: ['SHOMICHIN', 'CUMILLA_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 120005,
    chapterId: 120,
    topicId: 12001,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: 'বাংলা একাডেমি নিয়মানুযায়ী ইংরেজি শব্দে কোন বর্ণের ব্যবহার নিষিদ্ধ?',
    questionEn: 'According to Bangla Academy, which letter is forbidden in English loanwords?',
    options: ['মূর্ধন্য-ষ ও মূর্ধন্য-ণ', 'দন্ত্য-স', 'দন্ত্য-ন', 'ব-ফলা'],
    correctOptionIndex: 0,
    correctAnswerText: 'মূর্ধন্য-ষ ও মূর্ধন্য-ণ',
    explanationBn: 'ইংরেজি ও অন্যান্য বিদেশি শব্দে মূর্ধন্য-ণ ও মূর্ধন্য-ষ সম্পূর্ণ নিষিদ্ধ, সর্বদা দন্ত্য-ন ও দন্ত্য-স ব্যবহার করতে হয়।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'চট্টগ্রাম বোর্ড',
    year: 2024,
    examType: 'SSC',
    tags: ['NOTTO_FOREIGN', 'CHITTAGONG_BOARD'],
    status: 'ACTIVE'
  }
];

const CHAPTER_20_MODEL_TEST = {
  id: 12001,
  subject: 'BANGLA',
  chapterId: 120,
  testTitleBn: 'অধ্যায় ২০ মডেল টেস্ট: শুদ্ধ বানান, ণ-ত্ব ও ষ-ত্ব বিধান',
  testTitleEn: 'Chapter 20 Model Test: Spelling Rules, Notto & Shotto Bidhan',
  descriptionBn: 'ণ-ত্ব বিধান, ষ-ত্ব বিধান, বাংলা একাডেমি প্রমিত বানানরীতি এবং বহুল প্রচলিত ভুল বানানের ওপর পূর্ণাঙ্গ মডেল টেস্ট।',
  durationMinutes: 10,
  totalMarks: 5,
  passPercentage: 60,
  difficulty: 'MEDIUM',
  questionCount: 5,
  questionIds: [120001, 120002, 120003, 120004, 120005],
  status: 'PUBLISHED'
};

module.exports = {
  CHAPTER_16_TOPICS, CHAPTER_16_MCQS, CHAPTER_16_MODEL_TEST,
  CHAPTER_17_TOPICS, CHAPTER_17_MCQS, CHAPTER_17_MODEL_TEST,
  CHAPTER_18_TOPICS, CHAPTER_18_MCQS, CHAPTER_18_MODEL_TEST,
  CHAPTER_19_TOPICS, CHAPTER_19_MCQS, CHAPTER_19_MODEL_TEST,
  CHAPTER_20_TOPICS, CHAPTER_20_MCQS, CHAPTER_20_MODEL_TEST
};
