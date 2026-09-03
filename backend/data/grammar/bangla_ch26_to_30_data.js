/**
 * Bangla Grammar Chapters 26–30 Content:
 * Chapter 26: প্রকৃতি ও প্রত্যয় বিশদ (Root & Suffix In-depth Analysis)
 * Chapter 27: ধাতু ও ধাতুর প্রকারভেদ (Verbal Roots & Classifications)
 * Chapter 28: বাক্য ও সার্থক বাক্যের গুণাবলী (Sentence Syntax & Qualities)
 * Chapter 29: বাক্যের গঠন ও শ্রেণিবিভাগ (Sentence Structure & Transformations)
 * Chapter 30: বাচ্য ও বাচ্য পরিবর্তন (Voice & Voice Transformation)
 * 
 * Fully structured according to NCTB/SSC/HSC standards with 13-section format.
 */

// ============================================================================
// CHAPTER 26: প্রকৃতি ও প্রত্যয় বিশদ (Root & Suffix In-depth)
// ============================================================================
const CHAPTER_26_TOPICS = [
  {
    id: 12601,
    chapterId: 126,
    parentTopicId: null,
    subject: 'BANGLA',
    topicNo: '২৬.১',
    titleBn: 'প্রকৃতি, প্রত্যয় ও প্রাতিপদিকের বিশদ ব্যাকরণিক ধারণা',
    titleEn: 'Comprehensive Concept of Root (Prakriti), Suffix (Prottoy) & Nominal Stem',
    slug: 'b26-prokriti-prottoy-pratipodik',
    difficulty: 'BOARD_STANDARD',
    classLevel: 'Class 8 - 12 (SSC & HSC)',
    summaryBn: 'শব্দ বা পদের যে মূল অংশকে আর কোনো ক্ষুদ্রাংশে বিশ্লেষণ করা যায় না, তাকে প্রকৃতি বলে। প্রকৃতি ২ প্রকার: নামপ্রকৃতি ও ক্রিয়াপ্রকৃতি। বিভক্তিহীন নামশব্দকে প্রাতিপদিক বলে।',
    definitionBn: 'প্রকৃতি ও প্রাতিপদিক: ১. প্রকৃতি (Root / Prakriti): শব্দ বা ধাতুর ক্ষুদ্রতম অবিভাজ্য অর্থপূর্ণ মূল অংশকে প্রকৃতি বলে। প্রকৃতি দুই প্রকার: (ক) নামপ্রকৃতি বা প্রাতিপদিক (যেমন: হাত, ঢাকা, ফুল, মাটি) এবং (খ) ক্রিয়াপ্রকৃতি বা ধাতু (যেমন: √পড়্, √চল্, √খা, √দেখ্)। ২. প্রাতিপদিক (Nominal Stem): বিভক্তিহীন নামশব্দকে ব্যাকরণে প্রাতিপদিক বলে (যেমন: "বই", "কলম")। ৩. প্রত্যয় (Suffix): নতুন শব্দ গঠনের লক্ষ্যে প্রকৃতি বা ধাতুর শেষে যে বর্ণ বা বর্ণসমষ্টি যুক্ত হয়, তাকে প্রত্যয় বলে।',
    definitionEn: 'Prakriti represents the irreducible morphological root—either nominal (Naamprakriti/Pratipadika) or verbal (Dhatu/Kriyaprakriti). Prottoy is the derivational or inflectional suffix affixed to roots.',
    explanationBn: 'শব্দ বিশ্লেষণের মূল সূত্র:\n• নামপ্রকৃতি + তদ্ধিত প্রত্যয় = তদ্ধিতাান্ত শব্দ (যেমন: হাত + ল = হাতল; ঢাকা + আই = ঢাকাই)।\n• ক্রিয়াপ্রকৃতি (ধাতু) + কৃৎ প্রত্যয় = কৃদন্ত পদ (যেমন: √পড়্ + অন্ত = পড়ন্ত; √চল্ + তি = চলতি)।\nপ্রকৃতি ও প্রত্যয়ের চমৎকার তুলনামূলক পার্থক্য:\n১. প্রকৃতি হলো মূল বা ভিত্তি (Root), যা এককভাবে অর্থ বহন করতে পারে (নামপ্রকৃতি) অথবা ক্রিয়ামূল নির্দেশ করে (ধাতু)।\n২. প্রত্যয় হলো আশ্রিত শব্দাংশ (Bound Morpheme), যার একক কোনো অর্থ নেই, কিন্তু প্রকৃতির শেষে যুক্ত হয়ে সম্পূর্ণ নতুন অর্থ বা পদ সৃষ্টি করে।\nবিভক্তি বনাম প্রত্যয়:\nপ্রত্যয় নতুন শব্দ তৈরি করে শব্দভাণ্ডার বৃদ্ধি করে (যেমন: দিন থেকে দৈনিক); আর বিভক্তি শব্দকে বাক্যে ব্যবহারের উপযোগী করে পদে রূপান্তর করে (যেমন: দিনে = দিন + এ বিভক্তি)।',
    teacherGoldenTips: 'মাস্টার চার্ট:\n• বিভক্তিহীন নামশব্দ = প্রাতিপদিক (হাত, বই)!\n• ক্রিয়ার মূল অংশ = ধাতু / ক্রিয়াপ্রকৃতি (√পড়্, √চল্)!\n• নামশব্দের সাথে প্রত্যয় = তদ্ধিত প্রত্যয়!\n• ধাতুর সাথে প্রত্যয় = কৃৎ প্রত্যয়!',
    rules: [
      {
        ruleNo: 1,
        nameBn: 'ধাতু চিহ্ন (√) প্রয়োগের নিয়ম',
        explanationBn: 'ক্রিয়াপ্রকৃতি বা ধাতু লেখার সময় তার পূর্বে সর্বদা ধাতু চিহ্ন (√) ব্যবহার করতে হয়, তবে নামপ্রকৃতির পূর্বে কোনো চিহ্ন বসে না।',
        examples: [
          {
            bn: '√চল্ + অন্ত = চলন্ত (কৃৎ প্রত্যয়); হাত + আ = হাতা (তদ্ধিত প্রত্যয়)।',
            context: 'ধাতু চিহ্ন'
          }
        ]
      }
    ],
    formulas: [
      {
        label: 'প্রকৃতি ও প্রত্যয় সমীকরণ',
        structure: 'নামপ্রকৃতি + তদ্ধিত প্রত্যয় = তদ্ধিতাান্ত পদ | ক্রিয়াপ্রকৃতি (√ধাতু) + কৃৎ প্রত্যয় = কৃদন্ত পদ'
      }
    ],
    examples: [
      {
        bn: '√পড়্ + কুয়া = পড়ুয়া (কৃৎ প্রত্যয়)',
        context: 'কৃদন্ত'
      },
      {
        bn: 'মেধা + বিন্ = মেধাবী (তদ্ধিত প্রত্যয়)',
        context: 'তদ্ধিতাান্ত'
      }
    ],
    exceptions: [
      {
        titleBn: 'শূণ্য প্রত্যয় (Zero Suffix)',
        descriptionBn: 'কখনো কখনো প্রকৃতির সাথে কোনো দৃশ্যমান প্রত্যয় যুক্ত না হয়েও শব্দ গঠিত হয়, তাকে শূণ্য প্রত্যয় বা অদৃশ্য প্রত্যয় বলে (যেমন: √জিত্ + ০ = জিত)।'
      }
    ],
    commonMistakes: [
      {
        incorrectBn: '"হাতল" শব্দে হাত হলো ধাতুপ্রকৃতি।',
        correctBn: '"হাত" হলো নামপ্রকৃতি বা প্রাতিপদিক, কারণ এটি বিশেষ্য শব্দ।',
        explanationBn: 'ধাতু কেবল ক্রিয়ার মূলকেই নির্দেশ করে।'
      }
    ],
    writtenPractice: [
      {
        id: 1,
        type: 'DIFFERENCE',
        prompt: 'প্রাতিপদিক ও ধাতুর মধ্যে দুটি মূল পার্থক্য উদাহরণসহ লিখ।',
        correctAnswer: '১. বিভক্তিহীন নামশব্দকে প্রাতিপদিক বলে (যেমন: হাত, ফুল); অন্যদিকে ক্রিয়াপদের মূল অবিভাজ্য অংশকে ধাতু বলে (যেমন: √পড়্, √চল্)। ২. প্রাতিপদিকের পরে তদ্ধিত প্রত্যয় যুক্ত হয়ে নামশব্দ গঠিত হয়; ধাতুর পরে কৃৎ প্রত্যয় যুক্ত হয়ে কৃদন্ত পদ গঠিত হয়।',
        explanationBn: 'বোর্ড পরীক্ষার অত্যন্ত আকর্ষণীয় ৩ নম্বরের প্রশ্ন।'
      }
    ],
    tags: ['PROKRITI', 'PROTTOY', 'PRATIPODIK', 'DHATU', 'SSC', 'HSC'],
    status: 'PUBLISHED',
    orderIndex: 1,
    viewCount: 310
  },
  {
    id: 12602,
    chapterId: 126,
    parentTopicId: null,
    subject: 'BANGLA',
    topicNo: '২৬.২',
    titleBn: 'শব্দ বিশ্লেষণ ও প্রকৃতি-প্রত্যয়ের মাধ্যমে নতুন শব্দ গঠন',
    titleEn: 'Word Analysis & Derivation via Roots and Suffixes',
    slug: 'b26-shobdo-bishleshon-o-gothon',
    difficulty: 'BOARD_STANDARD',
    classLevel: 'Class 8 - 12 (SSC & HSC)',
    summaryBn: 'প্রকৃতির সাথে প্রত্যয় যুক্ত হয়ে অর্থের সম্প্রসারণ, সংকোচন বা রূপান্তরের মাধ্যমে বাংলা ভাষার শব্দভাণ্ডার সমৃদ্ধ হয়।',
    definitionBn: 'প্রকৃতি-প্রত্যয়ের মাধ্যমে শব্দ গঠন: কোনো মূল প্রকৃতির শেষে বিশেষ অর্থবোধক প্রত্যয় যুক্ত হয়ে নতুন পদ গঠনের ব্যাকরণিক প্রক্রিয়া। যেমন: ভাব অর্থে সুন্দর + ষ্যঞ্ = সৌন্দর্য; উপজীবিকা অর্থে মাছ + উয়া = মেছো; অপত্য অর্থে মনু + ষ্ণ = মানব; সম্বন্ধ অর্থে গ্রাম + ইন = গ্রামীণ।',
    definitionEn: 'Morphological derivation pairs root morphemes with bound suffixes to yield abstract, occupational, patronymic, or qualitative lexical units.',
    explanationBn: 'বোর্ড পরীক্ষায় নিশ্চিত আসার মতো ১০টি উচ্চফলনশীল প্রকৃতি-প্রত্যয় বিশ্লেষণ:\n১. মধুর = মধু + র (মধু সদৃশ মিষ্টি)\n২. লাঘব = লঘু + ষ্ণ (লঘুর ভাব)\n৩. পাচক = √পচ্ + ণক/অক (যিনি রান্না করেন)\n৪. কারক = √কৃ + ণক/অক (যে সম্পাদন করে)\n৫. পাঠক = √পঠ্ + অক (যে পাঠ করে)\n৬. কর্তব্য = √কৃ + তব্য (যা করা উচিত)\n৭. দর্শন = √দৃশ + অনট/অন (দেখার কাজ)\n৮. শৈশব = শিশু + ষ্ণ (শিশুর ভাব)\n৯. পার্থিব = পৃথিবী + ষ্ণ (পৃথিবী সম্পর্কিত)\n১০. সাহিত্যিক = সাহিত্য + ষ্ণিক/ইক।\nপ্রকৃতি-প্রত্যয় ভাঙার সময় বানানের হ্রস্ব-দীর্ঘ ও ষ্ণ, ষ্ণিক প্রত্যয়ের বৃদ্ধি নিয়ম লক্ষ্য রাখা অত্যন্ত জরুরি।',
    teacherGoldenTips: 'ম্যাজিক ফর্মুলা:\n• মূল শব্দে "অক" থাকলে কৃৎ প্রত্যয়ে ভাঙবেন "ণক" বা "অক" দিয়ে (যেমন: নায়ক = √নী + অক, কারক = √কৃ + অক)!\n• মূল শব্দে "অন" থাকলে ভাঙবেন "অনট" দিয়ে (যেমন: গমন = √গম্ + অন)!\n• যুক্তাক্ষরে "য" ও আদি স্বর বৃদ্ধি থাকলে ভাঙবেন "ষ্যঞ্" দিয়ে (যেমন: দৈর্ঘ্য = দীর্ঘ + ষ্যঞ্)!',
    rules: [
      {
        ruleNo: 1,
        nameBn: 'ভাববাচক বিশেষ্য গঠনের নিয়ম',
        explanationBn: 'বিশেষণ শব্দের শেষে ষ্ণ, ষ্যঞ্ বা তা প্রত্যয় যুক্ত হয়ে ভাববাচক বিশেষ্য গঠিত হয়।',
        examples: [
          {
            bn: 'গুরু + ষ্ণ = গৌরব; লঘু + ষ্ণ = লাঘব; সুন্দর + তা = সুন্দরতা।',
            context: 'ভাববাচক বিশেষ্য'
          }
        ]
      }
    ],
    formulas: [
      {
        label: 'শব্দ গঠন সূত্র ছক',
        structure: 'মূল/প্রকৃতি + প্রত্যয় = গঠিত শব্দ (অর্থ/ব্যাখ্যা)'
      }
    ],
    examples: [
      {
        bn: '√কৃ + অক = কারক (যে ক্রিয়া সম্পাদন করে)',
        context: 'কৃৎ প্রত্যয়'
      },
      {
        bn: 'লঘু + ষ্ণ = লাঘব (লঘু হওয়ার ভাব)',
        context: 'তদ্ধিত প্রত্যয়'
      }
    ],
    exceptions: [
      {
        titleBn: 'নিপাতনে সিদ্ধ শব্দ বিশ্লেষণ',
        descriptionBn: '√দা + ত্ৰ = দাত্র; √পচ্ + তি = পক্তি। এগুলো কোনো স্বাভাবিক গুণ-বৃদ্ধি না মেনে নিপাতনে সিদ্ধ হয়।'
      }
    ],
    commonMistakes: [
      {
        incorrectBn: 'কারক = কার + অক।',
        correctBn: 'কারক = √কৃ + অক (ধাতু কৃ থেকে উদ্ভূত)।',
        explanationBn: 'মূল সংস্কৃত ধাতু "কৃ" থেকে কারক শব্দের উৎপত্তি।'
      }
    ],
    writtenPractice: [
      {
        id: 1,
        type: 'TRANSFORMATION',
        prompt: 'প্রকৃতি ও প্রত্যয় নির্ণয় করো: (ক) কারক (খ) গৌরব (গ) পাচক (ঘ) গ্রামীণ।',
        correctAnswer: '(ক) কারক = √কৃ + অক/ণক (কৃৎ প্রত্যয়)। (খ) গৌরব = গুরু + ষ্ণ (তদ্ধিত প্রত্যয়)। (গ) পাচক = √পচ্ + অক (কৃৎ প্রত্যয়)। (ঘ) গ্রামীণ = গ্রাম + ঈন (তদ্ধিত প্রত্যয়)।',
        explanationBn: 'বোর্ড পরীক্ষার অত্যন্ত ক্লাসিক ৪ নম্বরের প্রশ্ন।'
      }
    ],
    tags: ['WORD_ANALYSIS', 'KOROK', 'GOUROB', 'PACHOK', 'SSC', 'HSC'],
    status: 'PUBLISHED',
    orderIndex: 2,
    viewCount: 340
  }
];

const CHAPTER_26_MCQS = [
  {
    id: 126001,
    chapterId: 126,
    topicId: 12601,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: 'বাংলা ব্যাকরণে বিভক্তিহীন নামশব্দকে কী বলা হয়?',
    questionEn: 'What is an uninflected nominal base called in Bengali grammar?',
    options: ['প্রাতিপদিক', 'ধাতু', 'উপসর্গ', 'অনুসর্গ'],
    correctOptionIndex: 0,
    correctAnswerText: 'প্রাতিপদিক',
    explanationBn: 'বিভক্তিহীন যেকোনো মৌলিক নামশব্দকে ব্যাকরণিক পরিভাষায় প্রাতিপদিক বলে (যেমন: হাত, বই, ফুল)।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'ঢাকা বোর্ড',
    year: 2024,
    examType: 'SSC',
    tags: ['PRATIPODIK', 'DHAKA_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 126002,
    chapterId: 126,
    topicId: 12602,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: '"কারক" শব্দের সঠিক প্রকৃতি ও প্রত্যয় কোনটি?',
    questionEn: 'What is the correct root and suffix for "Karok"?',
    options: ['√কৃ + অক (বা ণক)', 'কার + অক', '√কর + ক', 'করণ + অক'],
    correctOptionIndex: 0,
    correctAnswerText: '√কৃ + অক (বা ণক)',
    explanationBn: 'সংস্কৃত ধাতু "কৃ"-এর সাথে কৃৎ প্রত্যয় "অক" (বা ণক) যুক্ত হয়ে বৃদ্ধির নিয়মে "কারক" পদ গঠিত হয়।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'রাজশাহী বোর্ড',
    year: 2023,
    examType: 'SSC',
    tags: ['KAROK_ROOT', 'RAJSHAHI_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 126003,
    chapterId: 126,
    topicId: 12602,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: '"গৌরব" শব্দের সঠিক প্রকৃতি ও প্রত্যয় কোনটি?',
    questionEn: 'What is the correct root and suffix for "Gourob"?',
    options: ['গুরু + ষ্ণ', 'গৌর + ব', 'গুরু + অব', 'গরু + ষ্ণ'],
    correctOptionIndex: 0,
    correctAnswerText: 'গুরু + ষ্ণ',
    explanationBn: 'গুরু শব্দের সাথে তদ্ধিত প্রত্যয় "ষ্ণ" যুক্ত হয়ে আদি স্বরের বৃদ্ধি নিয়মে (উ > ও/ঔ) "গৌরব" গঠিত হয়।',
    difficulty: 'MEDIUM',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'যশোর বোর্ড',
    year: 2024,
    examType: 'SSC',
    tags: ['GOUROB', 'JASHORE_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 126004,
    chapterId: 126,
    topicId: 12601,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: 'ক্রিয়াপদের মূল অবিভাজ্য অংশকে কী বলা হয়?',
    questionEn: 'What is the irreducible root of a verb called?',
    options: ['ধাতু বা ক্রিয়াপ্রকৃতি', 'প্রাতিপদিক', 'উপপদ', 'যোজক'],
    correctOptionIndex: 0,
    correctAnswerText: 'ধাতু বা ক্রিয়াপ্রকৃতি',
    explanationBn: 'যেকোনো ক্রিয়াপদকে বিশ্লেষণ করলে যে অবিভাজ্য মৌলিক অংশ পাওয়া যায়, তাকে ধাতু বা ক্রিয়াপ্রকৃতি বলে।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'কুমিল্লা বোর্ড',
    year: 2023,
    examType: 'SSC',
    tags: ['DHATU_DEFINITION', 'CUMILLA_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 126005,
    chapterId: 126,
    topicId: 12602,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: '"পাচক" (যিনি রান্না করেন)—শব্দটির সঠিক ব্যাকরণিক বিশ্লেষণ কোনটি?',
    questionEn: 'What is the correct grammatical breakdown of "Pachok"?',
    options: ['√পচ্ + অক', 'পাচ + ক', 'পাক + অক', 'পচন + ক'],
    correctOptionIndex: 0,
    correctAnswerText: '√পচ্ + অক',
    explanationBn: 'পাক করা বা রান্না করা অর্থে সংস্কৃত ধাতু "পচ্"-এর সাথে কৃৎ প্রত্যয় "অক" যুক্ত হয়ে পাচক গঠিত হয়।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'চট্টগ্রাম বোর্ড',
    year: 2024,
    examType: 'SSC',
    tags: ['PACHOK', 'CHITTAGONG_BOARD'],
    status: 'ACTIVE'
  }
];

const CHAPTER_26_MODEL_TEST = {
  id: 12601,
  subject: 'BANGLA',
  chapterId: 126,
  testTitleBn: 'অধ্যায় ২৬ মডেল টেস্ট: প্রকৃতি ও প্রত্যয় বিশদ',
  testTitleEn: 'Chapter 26 Model Test: Root & Suffix In-depth Analysis',
  descriptionBn: 'প্রাতিপদিক, ধাতু, কৃৎ প্রত্যয়, তদ্ধিত প্রত্যয় এবং বহুল আলোচিত শব্দ বিশ্লেষণের ওপর পূর্ণাঙ্গ মডেল টেস্ট।',
  durationMinutes: 10,
  totalMarks: 5,
  passPercentage: 60,
  difficulty: 'MEDIUM',
  questionCount: 5,
  questionIds: [126001, 126002, 126003, 126004, 126005],
  status: 'PUBLISHED'
};

// ============================================================================
// CHAPTER 27: ধাতু ও ধাতুর প্রকারভেদ (Verbal Roots)
// ============================================================================
const CHAPTER_27_TOPICS = [
  {
    id: 12701,
    chapterId: 127,
    parentTopicId: null,
    subject: 'BANGLA',
    topicNo: '২৭.১',
    titleBn: 'ধাতুর সংজ্ঞা, বৈশিষ্ট্য ও প্রধান ৩টি শ্রেণিবিভাগ',
    titleEn: 'Definition of Verbal Roots (Dhatu) & 3 Primary Classifications',
    slug: 'b27-dhatu-shongpga-o-prokarbhed',
    difficulty: 'BOARD_STANDARD',
    classLevel: 'Class 8 - 12 (SSC & HSC)',
    summaryBn: 'ক্রিয়াপদের মূল অবিভাজ্য অংশকে ধাতু বলে। ধাতু প্রধানত ৩ প্রকার: মৌলিক ধাতু, সাধিত ধাতু ও যৌগিক বা সংযোগমূলক ধাতু।',
    definitionBn: 'ধাতু (Verbal Root / Dhatu): ক্রিয়াপদের যে মূল অংশকে আর কোনো ক্ষুদ্রাংশে বিশ্লেষণ বা খণ্ড করা যায় না, তাকে ধাতু বলে। যেমন: "পড়িতেছে" ক্রিয়াপদের মূল অংশ হলো "পড়্"। ধাতু প্রধানত ৩ প্রকার:\n১. মৌলিক বা সিদ্ধ ধাতু: যেসব ধাতুকে আর ভাঙা যায় না (যেমন: কর্, চল্, পড়্, খা, যা, দেখ্, বল্)।\n২. সাধিত ধাতু: মৌলিক ধাতু বা নামশব্দের পর "আ" প্রত্যয় যোগে গঠিত ধাতু (যেমন: পড়্ + আ = পড়া; হাত + আ = হাতা)।\n৩. যৌগিক বা সংযোগমূলক ধাতু: বিশেষ্য, বিশেষণ বা ধ্বন্যাত্মক অব্যয়ের সাথে কর্, হ, দে, পা, খা ইত্যাদি যুক্ত হয়ে গঠিত ধাতু (যেমন: ভয় কর, ভালো হ, দুঃখ পা, সনসন কর্)।',
    definitionEn: 'A Verbal Root (Dhatu) is the irreducible semantic core of any conjugated verb. Dhatu divides into Primary (Moulik), Derived (Shadhito), and Compound/Conjunctive (Yowgik).',
    explanationBn: 'ধাতু চেনার সবচেয়ে সহজ ও ব্যবহারিক পদ্ধতি:\nতুচ্ছার্থক বা ঘনিষ্ঠ মধ্যম পুরুষকে ("তুই"-কে) বর্তমান কালে কোনো কাজের যে সাধারণ আদেশ দেওয়া হয়, সেই রূপটিই হলো খাঁটি ধাতু!\nযেমন:\n• তুই কাজটি কর্ → ধাতু = √কর\n• তুই বাড়ি যা → ধাতু = √যা\n• তুই ভাত খা → ধাতু = √খা\n• তুই বই পড়্ → ধাতু = √পড়্\n• তুই দ্রুত চল্ → ধাতু = √চল্।\nধাতুর সাথে পুরুষ ও কালবাচক "ক্রিয়াবিভক্তি" যুক্ত হয়ে তবেই সার্থক ক্রিয়াপদ তৈরি হয় (যেমন: √পড়্ + ই = পড়ি; √পড়্ + ছে = পড়ছে; √পড়্ + ল = পড়ল)।',
    teacherGoldenTips: 'ধাতু চেনার জাদুকরী টেকনিক: "তুই"-কে যে আদেশ করা হয়, সেটাই ধাতু! তুই পড়্ = পড়্ ধাতু! তুই কর্ = কর্ ধাতু! তুই যা = যা ধাতু! পরীক্ষার হলে দ্বিধাদ্বন্দ্বে পড়লে মনে মনে তুই সম্বোধন করবেন!',
    rules: [
      {
        ruleNo: 1,
        nameBn: 'ক্রিয়াপদ থেকে ধাতু পৃথকীকরণ',
        explanationBn: 'ক্রিয়াপদ থেকে পুরুষ ও কালবাচক বিভক্তি বাদ দিলে অবশিষ্ট অবিভাজ্য রূপটিই ধাতু হিসেবে চিহ্নিত হয়।',
        examples: [
          {
            bn: 'লিখিতেছেন → মূল ধাতু = √লিখ্ (বিভক্তি: ইতেছেন)।',
            context: 'ধাতু নিষ্কাশন'
          }
        ]
      }
    ],
    formulas: [
      {
        label: 'ক্রিয়াপদ গঠন সূত্র',
        structure: 'ধাতু (ক্রিয়ামূল) + ক্রিয়াবিভক্তি = সমাপিকা বা অসমাপিকা ক্রিয়াপদ'
      }
    ],
    examples: [
      {
        bn: '√চল্ + ইতেছে = চলিতেছে (মৌলিক ধাতু)',
        context: 'মৌলিক ধাতু'
      },
      {
        bn: 'ভয় + কর্ = ভয় কর (যৌগিক ধাতু)',
        context: 'যৌগিক ধাতু'
      }
    ],
    exceptions: [
      {
        titleBn: 'অজ্ঞাতমূল ধাতু',
        descriptionBn: 'যেসব ধাতুর মূল ভাষা বা উৎস নিশ্চিতভাবে জানা যায়নি, তাদের অজ্ঞাতমূল ধাতু বলে (যেমন: √হের্ যেমন: "হের ওই দুয়ারে দাঁড়াইয়া কে")।'
      }
    ],
    commonMistakes: [
      {
        incorrectBn: '"পড়া" একটি মৌলিক ধাতু।',
        correctBn: '"পড়া" সাধিত ধাতু (পড়্ + আ = পড়া)।',
        explanationBn: 'কারণ এর সাথে "আ" প্রত্যয় যুক্ত রয়েছে।'
      }
    ],
    writtenPractice: [
      {
        id: 1,
        type: 'IDENTIFICATION',
        prompt: 'নিচের ক্রিয়াপদগুলোর মূল ধাতু ও তার শ্রেণি লিখ: (ক) দেখিতেছি (খ) ভয় করিও না (গ) পড়াইতেছেন।',
        correctAnswer: '(ক) দেখিতেছি: মূল ধাতু √দেখ্ (মৌলিক ধাতু)। (খ) ভয় কর: মূল ধাতু "ভয় কর্" (যৌগিক বা সংযোগমূলক ধাতু)। (গ) পড়াইতেছেন: মূল ধাতু "পড়া" (সাধিত/প্রযোজক ধাতু)।',
        explanationBn: 'বোর্ড পরীক্ষার অত্যন্ত কমন ৩ নম্বরের প্রশ্ন।'
      }
    ],
    tags: ['DHATU', 'VERBAL_ROOT', 'MOULIK_DHATU', 'SHADHITO_DHATU', 'YOWGIK_DHATU', 'SSC', 'HSC'],
    status: 'PUBLISHED',
    orderIndex: 1,
    viewCount: 360
  },
  {
    id: 12702,
    chapterId: 127,
    parentTopicId: null,
    subject: 'BANGLA',
    topicNo: '২৭.২',
    titleBn: 'সাধিত ধাতুর ৩ প্রকার রূপ: নামধাতু, প্রযোজক ধাতু ও কর্মবাচ্যের ধাতু',
    titleEn: '3 Types of Derived Roots: Denominative, Causative & Passive Roots',
    slug: 'b27-shadhito-dhatur-prokarbhed',
    difficulty: 'BOARD_STANDARD',
    classLevel: 'Class 8 - 12 (SSC & HSC)',
    summaryBn: 'মৌলিক ধাতু বা নামশব্দের পর "আ" প্রত্যয় যোগে সাধিত ধাতু গঠিত হয়। সাধিত ধাতু ৩ প্রকার: নামধাতু, প্রযোজক ধাতু ও কর্মবাচ্যের ধাতু।',
    definitionBn: 'সাধিত ধাতুর ৩ শ্রেণিবিভাগ:\n১. নামধাতু (Denominative Roots): বিশেষ্য, বিশেষণ বা অনুকার অব্যয়ের পর "আ" প্রত্যয় যোগে যে ধাতু গঠিত হয়। যেমন: হাত + আ = হাতা (লাঠিয়ে হাতাচ্ছ); বাঁকা + আ = বাঁকা; চমক + আ = চমকা।\n২. প্রযোজক ধাতু বা ণিজন্ত ধাতু (Causative Roots): মূল কর্তা নিজে কাজ না করে অন্যকে দিয়ে কাজটি করায় এমন অর্থে মূল ধাতুর পর "আ" প্রত্যয় যোগে গঠিত ধাতু। যেমন: মা শিশুকে চাঁদ দেখাচ্ছেন (√দেখ্ + আ = দেখা); শিক্ষক ছাত্রকে পড়াচ্ছেন (√পড়্ + আ = পড়া)।\n৩. কর্মবাচ্যের ধাতু (Passive Roots): মৌলিক ধাতুর সঙ্গে "আ" প্রত্যয় যুক্ত হয়ে যখন কর্মপদের প্রাধান্যসূচক ক্রিয়া গঠন করে। যেমন: যা কিছু হারায় গিন্নি বলেন কেষ্টা বেটাই চোর (√হার্ + আ = হারা); কাজটি করা হয়েছে (√কর্ + আ = করা)।',
    definitionEn: 'Derived roots add the formant -a to form Denominative (Noun/Adjective + a), Causative/Nijanto (causing another to act), and Passive roots.',
    explanationBn: 'প্রযোজক ধাতু বনাম নামধাতু চেনার ১০০% নিশ্চিত উপায়:\n• যদি অন্যকে দিয়ে করানো বোঝায় (মা শিশুকে খাওয়াচ্ছেন, সাপুড়ে সাপ খেলাচ্ছে) → প্রযোজক ধাতু (Causative)!\n• যদি কোনো নামশব্দ (হাত, বেত, ঘুম) থেকে তৈরি হয় → নামধাতু!\nযেমন:\n- "শিক্ষক পড়াচ্ছেন" = প্রযোজক ধাতু (ছাত্র পড়ছে)।\n- "ছেলেটি ঘুমাচ্ছে" = নামধাতু ("ঘুম" বিশেষ্য পদ থেকে ঘুমা ধাতু)।\n- "শিক্ষক ছাত্রটিকে বেতালেন" = নামধাতু ("বেত" নামশব্দ থেকে বেতা ধাতু)।',
    teacherGoldenTips: 'গোল্ডেন ট্রিক:\n• বিশেষ্য/বিশেষণ + আ (হাতানো, ঘুমানো, বেতানো) = নামধাতু!\n• অন্যকে দিয়ে করানো (পড়ানো, দেখানো, খাওয়ানো) = প্রযোজক ধাতু!\n• কর্মের অধীনে ক্রিয়া (হারানো, দেখা যাওয়া) = কর্মবাচ্যের ধাতু!',
    rules: [
      {
        ruleNo: 1,
        nameBn: 'প্রযোজক ক্রিয়ার গঠন নিয়ম',
        explanationBn: 'প্রযোজক ধাতুর সাথে পুরুষ ও কাল অনুযায়ী সাধারণ ক্রিয়াবিভক্তি যুক্ত হয়ে প্রযোজক ক্রিয়া গঠিত হয়।',
        examples: [
          {
            bn: 'মা শিশুকে ভাত খাওয়ান (√খা + আ = খাওয়া ধাতু + এন বিভক্তি = খাওয়ান)।',
            context: 'প্রযোজক ক্রিয়া'
          }
        ]
      }
    ],
    formulas: [
      {
        label: 'সাধিত ধাতু সমীকরণ',
        structure: 'নামশব্দ + আ = নামধাতু | প্রযোজনা + আ = প্রযোজক ধাতু | কর্মের ভাব + আ = কর্মবাচ্যের ধাতু'
      }
    ],
    examples: [
      {
        bn: 'তিনি আমাকে একটি গল্প শোনালেন (শোনা = প্রযোজক ধাতু)',
        context: 'প্রযোজক'
      },
      {
        bn: 'বেতালে পিঠের চামড়া থাকবে না (বেতা = নামধাতু)',
        context: 'নামধাতু'
      }
    ],
    exceptions: [
      {
        titleBn: 'রূপগত অভিন্নতা কিন্তু অর্থগত ভেদ',
        descriptionBn: '"বইটি হারিয়ে গেছে" (কর্মবাচ্যের ধাতু); "টাকাটি হারিয়ে ফেলো না" (প্রযোজক ভাব)। এখানে বাক্যের ভাবানুসারে শ্রেণি নির্ণয় করতে হয়।'
      }
    ],
    commonMistakes: [
      {
        incorrectBn: '"মা শিশুকে চাঁদ দেখাচ্ছেন"—এখানে দেখাচ্ছেন নামধাতু।',
        correctBn: 'এটি প্রযোজক ধাতু কারণ মা শিশুকে দেখাচ্ছেন (অন্যের দ্বারা কার্য সম্পন্ন)।',
        explanationBn: 'প্রযোজক কর্তা ও প্রযোজ্য কর্তার সংযোগে প্রযোজক ধাতু হয়।'
      }
    ],
    writtenPractice: [
      {
        id: 1,
        type: 'CLASSIFICATION',
        prompt: 'নিচের বাক্যগুলোর সাধিত ধাতুর প্রকারভেদ নির্দেশ করো: (ক) মা শিশুকে ভাত খাওয়াচ্ছেন। (খ) চোরকে বেতানো হলো। (গ) কাজটি শেষ করা হয়েছে।',
        correctAnswer: '(ক) খাওয়াচ্ছেন: প্রযোজক ধাতু (√খা + আ = খাওয়া)। (খ) বেতানো: নামধাতু ("বেত" বিশেষ্য + আ = বেতা)। (গ) করা: কর্মবাচ্যের ধাতু (√কর্ + আ = করা)।',
        explanationBn: 'বোর্ড পরীক্ষার অত্যন্ত আকর্ষণীয় ৩ নম্বরের প্রশ্ন।'
      }
    ],
    tags: ['NAMDHATU', 'PROYOJOK_DHATU', 'KORMOBACHYOR_DHATU', 'SHADHITO', 'SSC', 'HSC'],
    status: 'PUBLISHED',
    orderIndex: 2,
    viewCount: 370
  }
];

const CHAPTER_27_MCQS = [
  {
    id: 127001,
    chapterId: 127,
    topicId: 12701,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: 'যেসব ধাতুকে আর বিশ্লেষণ বা কোনো ক্ষুদ্রাংশে ভাঙা যায় না, তাদের কী বলে?',
    questionEn: 'What are roots called that cannot be broken down any further?',
    options: ['মৌলিক ধাতু', 'সাধিত ধাতু', 'যৌগিক ধাতু', 'নামধাতু'],
    correctOptionIndex: 0,
    correctAnswerText: 'মৌলিক ধাতু',
    explanationBn: 'যেসব ধাতুকে আর কোনোভাবে বিশ্লেষণ করা যায় না, তাদের মৌলিক বা সিদ্ধ ধাতু বলে (যেমন: কর্, চল্, পড়্, খা)।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'ঢাকা বোর্ড',
    year: 2024,
    examType: 'SSC',
    tags: ['MOULIK_DHATU', 'DHAKA_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 127002,
    chapterId: 127,
    topicId: 12702,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: '"মা শিশুকে চাঁদ দেখাচ্ছেন"—এখানে "দেখাচ্ছেন" কোন ধাতুর উদাহরণ?',
    questionEn: 'In "Ma shishuke chand dekhachhen", what type of root is "dekhachhen"?',
    options: ['প্রযোজক ধাতু', 'নামধাতু', 'কর্মবাচ্যের ধাতু', 'যৌগিক ধাতু'],
    correctOptionIndex: 0,
    correctAnswerText: 'প্রযোজক ধাতু',
    explanationBn: 'মূল কর্তা নিজে না দেখে অন্যকে দিয়ে দেখাচ্ছে বোঝানোয় এটি প্রযোজক ধাতু (Causative Root)।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'রাজশাহী বোর্ড',
    year: 2023,
    examType: 'SSC',
    tags: ['PROYOJOK_DHATU', 'RAJSHAHI_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 127003,
    chapterId: 127,
    topicId: 12702,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: 'বিশেষ্য, বিশেষণ বা অনুকার অব্যয়ের পর "আ" প্রত্যয় যোগে কোন ধাতু গঠিত হয়?',
    questionEn: 'Which root is formed by adding suffix -a to a noun or adjective?',
    options: ['নামধাতু', 'মৌলিক ধাতু', 'সংযোগমূলক ধাতু', 'অজ্ঞাতমূল ধাতু'],
    correctOptionIndex: 0,
    correctAnswerText: 'নামধাতু',
    explanationBn: 'নামশব্দ বা প্রাতিপদিকের পর "আ" প্রত্যয় যুক্ত হয়ে যে ধাতু গঠিত হয় তাকে নামধাতু বলে (যেমন: হাত + আ = হাতা; ঘুম + আ = ঘুমা)।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'যশোর বোর্ড',
    year: 2024,
    examType: 'SSC',
    tags: ['NAMDHATU', 'JASHORE_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 127004,
    chapterId: 127,
    topicId: 12701,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: '"ভয় করিও না"—এখানে "ভয় কর" কোন জাতীয় ধাতুর উদাহরণ?',
    questionEn: 'What type of root is "bhoy kor"?',
    options: ['যৌগিক বা সংযোগমূলক ধাতু', 'মৌলিক ধাতু', 'নামধাতু', 'প্রযোজক ধাতু'],
    correctOptionIndex: 0,
    correctAnswerText: 'যৌগিক বা সংযোগমূলক ধাতু',
    explanationBn: 'বিশেষ্য পদের সঙ্গে "কর" ধাতু যুক্ত হয়ে তৈরি হওয়ায় এটি একটি সংযোগমূলক বা যৌগিক ধাতু।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'কুমিল্লা বোর্ড',
    year: 2023,
    examType: 'SSC',
    tags: ['YOWGIK_DHATU', 'CUMILLA_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 127005,
    chapterId: 127,
    topicId: 12701,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: '"হের ওই দুয়ারে দাঁড়াইয়া কে"—এখানে "হের" কোন জাতীয় ধাতু?',
    questionEn: 'What category of root is "her"?',
    options: ['অজ্ঞাতমূল ধাতু', 'সংস্কৃত ধাতু', 'বিদেশি ধাতু', 'সাধিত ধাতু'],
    correctOptionIndex: 0,
    correctAnswerText: 'অজ্ঞাতমূল ধাতু',
    explanationBn: 'যেসব ধাতুর মূল উৎস বা ভাষা সুনির্দিষ্টভাবে নির্ণয় করা যায় না, তাদের অজ্ঞাতমূল ধাতু বলে (যেমন: √হের্)।',
    difficulty: 'MEDIUM',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'চট্টগ্রাম বোর্ড',
    year: 2024,
    examType: 'SSC',
    tags: ['OGGYATOMUL_DHATU', 'CHITTAGONG_BOARD'],
    status: 'ACTIVE'
  }
];

const CHAPTER_27_MODEL_TEST = {
  id: 12701,
  subject: 'BANGLA',
  chapterId: 127,
  testTitleBn: 'অধ্যায় ২৭ মডেল টেস্ট: ধাতু ও ধাতুর প্রকারভেদ',
  testTitleEn: 'Chapter 27 Model Test: Verbal Roots (Dhatu)',
  descriptionBn: 'মৌলিক ধাতু, সাধিত ধাতু (নামধাতু, প্রযোজক ধাতু), যৌগিক ধাতু ও অজ্ঞাতমূল ধাতুর ওপর পূর্ণাঙ্গ মডেল টেস্ট।',
  durationMinutes: 10,
  totalMarks: 5,
  passPercentage: 60,
  difficulty: 'MEDIUM',
  questionCount: 5,
  questionIds: [127001, 127002, 127003, 127004, 127005],
  status: 'PUBLISHED'
};

// ============================================================================
// CHAPTER 28: বাক্য ও সার্থক বাক্যের গুণাবলী (Sentence Syntax & Qualities)
// ============================================================================
const CHAPTER_28_TOPICS = [
  {
    id: 12801,
    chapterId: 128,
    parentTopicId: null,
    subject: 'BANGLA',
    topicNo: '২৮.১',
    titleBn: 'বাক্যের সংজ্ঞা ও সার্থক বাক্যের ৩টি অপরিহার্য গুণাবলী',
    titleEn: 'Definition of Sentence & 3 Essential Qualities: Akanksha, Asatti & Yogyata',
    slug: 'b28-sharthok-bakyer-3-gun',
    difficulty: 'BOARD_STANDARD',
    classLevel: 'Class 8 - 12 (SSC & HSC)',
    summaryBn: 'এক বা একাধিক পদের দ্বারা বক্তার সম্পূর্ণ মনোভাব প্রকাশ পেলে তাকে বাক্য বলে। একটি সার্থক বাক্যের ৩টি অপরিহার্য গুণ থাকে: আকাঙ্ক্ষা, আসত্তি ও যোগ্যতা।',
    definitionBn: 'বাক্য ও সার্থক বাক্যের ৩ গুণ:\n১. বাক্য (Sentence): যে সুবিন্যস্ত পদসমষ্টি দ্বারা কোনো বিষয়ে বক্তার মনোভাব সম্পূর্ণরূপে প্রকাশিত হয়, তাকে বাক্য বলে।\n২. সার্থক বাক্যের ৩টি অপরিহার্য গুণ:\n• আকাঙ্ক্ষা (Completeness): বাক্যের অর্থ পরিষ্কারভাবে বোঝার জন্য এক পদ শোনার পর অন্য পদ শোনার যে স্বাভাবিক ইচ্ছা থাকে, তাকে আকাঙ্ক্ষা বলে। যেমন: "সূর্য উঠলে..." বললে আকাঙ্ক্ষা থাকে; "সূর্য উঠলে কুয়াশা দূর হয়" বললে আকাঙ্ক্ষা নিবৃত্ত হয়।\n• আসত্তি বা নৈকট্য (Proximity / Word Order): বাক্যের অর্থসংগতি রক্ষার জন্য পদগুলোকে পরস্পর যথাস্থানে সুশৃঙ্খলভাবে সাজানোকে আসত্তি বলে। যেমন: "মাঠে কাল খেলতে আমরা ফুটবল যাব" আসত্তিহীন; "আমরা কাল মাঠে ফুটবল খেলতে যাব" আসত্তিসম্পন্ন বাক্য।\n• যোগ্যতা (Semantic Harmony / Logical Compatibility): বাক্যে ব্যবহৃত পদসমূহের পারস্পরিক ভাবগত ও অর্থগত সংগতিকে যোগ্যতা বলে। যেমন: "হাতি আকাশে ওড়ে" বা "বর্ষায় রৌদ্রে প্লাবন হয়" বললে বাক্যের যোগ্যতা নষ্ট হয়; "বর্ষার অতিরিক্ত বৃষ্টিতে প্লাবন হয়" যোগ্যতাসম্পন্ন বাক্য।',
    definitionEn: 'A syntactically and semantically well-formed Bengali sentence requires 3 indispensable attributes: Akanksha (Expectancy), Asatti (Syntactic Adjacency/Word Order), and Yogyata (Semantic Plausibility/Truth-value).',
    explanationBn: 'বোর্ড পরীক্ষায় যোগ্যতাহানির কারণে যে যে দোষ সৃষ্টি হয়:\n১. গুরুচণ্ডালী দোষ: তৎসম শব্দের সাথে দেশি/তদ্ভব শব্দের অযৌক্তিক মিশ্রণ ঘটলে গুরুচণ্ডালী দোষ হয়। যেমন: "শবপোড়া" বা "মড়াদাহ" ভুল; শুদ্ধ হলো "শবদাহ" (উভয়টি তৎসম) অথবা "মড়াপোড়া" (উভয়টি খাঁটি বাংলা)।\n২. উপমার ভুল প্রয়োগ: ভাবগত সংগতিহীন উপমা ব্যবহার। যেমন: "আমার হৃদয়-মন্দিরে আশার বীজ উপ্ত হইল"—মন্দির ইটের তৈরি চত্বর, সেখানে বীজ বপন করা অসম্ভব; তাই এটি যোগ্যতাহীন বাক্য। শুদ্ধ: "হৃদয়-ক্ষেত্রে আশার বীজ উপ্ত হইল"।\n৩. বাহুল্য দোষ: একই অর্থের একাধিক শব্দের অনাবশ্যক প্রয়োগ (যেমন: "সব ছাত্রগণ উপস্থিত আছে" ❌; শুদ্ধ: "সব ছাত্র উপস্থিত আছে" বা "ছাত্রগণ উপস্থিত আছে")।\n৪. বাগধারার শব্দ পরিবর্তন: "অরণ্যে ক্রন্দন"-এর স্থলে "বনে ক্রন্দন" লিখলে যোগ্যতা নষ্ট হয়।',
    teacherGoldenTips: 'গোল্ডেন টেবিল:\n• শোনার ইচ্ছা অপূর্ণ = আকাঙ্ক্ষার অভাব!\n• শব্দের উল্টাপাল্টা বিন্যাস = আসত্তির অভাব!\n• অবাস্তব/অসম্ভব ঘটনা বা গুরুচণ্ডালী = যোগ্যতার অভাব!\nপরীক্ষায় "শবপোড়া" দেখলেই গুরুচণ্ডালী দোষ এবং এটি "যোগ্যতা" গুণের হানি!',
    rules: [
      {
        ruleNo: 1,
        nameBn: 'গুরুচণ্ডালী দোষ বর্জন বিধান',
        explanationBn: 'তৎসম শব্দের সাথে খাঁটি বাংলা শব্দের সংকর মিশ্রণ ঘটানো সম্পূর্ণ বর্জনীয়।',
        examples: [
          {
            bn: 'শবদাহ (শুদ্ধ) বনাম শবপোড়া (গুরুচণ্ডালী দোষ ❌); মড়াপোড়া (শুদ্ধ) বনাম মড়াদাহ (গুরুচণ্ডালী দোষ ❌)।',
            context: 'গুরুচণ্ডালী দোষ'
          }
        ]
      }
    ],
    formulas: [
      {
        label: 'সার্থক বাক্যের ত্রিমাত্রিক সূত্র',
        structure: 'সার্থক বাক্য = আকাঙ্ক্ষা (অর্থের পূর্ণতা) + আসত্তি (সঠিক পদক্রম) + যোগ্যতা (যৌক্তিক সত্যতা)'
      }
    ],
    examples: [
      {
        bn: 'আমরা প্রত্যহ সকালে নিয়মিত ব্যায়াম করি (সার্থক বাক্য)',
        context: 'সার্থক বাক্য'
      },
      {
        bn: 'বড়শি দিয়ে নারিকেল পাড়ি (যোগ্যতাহীন বাক্য)',
        context: 'যোগ্যতাহীন'
      }
    ],
    exceptions: [
      {
        titleBn: 'রূপক বা আলংকারিক বাক্যে যোগ্যতার শিথিলতা',
        descriptionBn: 'কাব্যে বা রূপক সাহিত্যে উপমাগত স্বাধীনতায় আক্ষরিক সত্যের ব্যতিক্রম ঘটলেও তা কাব্যিক বাক্য হিসেবে গৃহীত হয়।'
      }
    ],
    commonMistakes: [
      {
        incorrectBn: 'আসক্তি (ক-ত দিয়ে লেখা)।',
        correctBn: 'আসত্তি (ত-ত দিয়ে লেখা, যার অর্থ নৈকট্য বা সুশৃঙ্খল বিন্যাস)।',
        explanationBn: '"আসক্তি" অর্থ নেশা বা অনুরক্তি; বাক্যের গুণ হলো "আসত্তি" (সঠিক পদক্রম)।'
      }
    ],
    writtenPractice: [
      {
        id: 1,
        type: 'ERROR_CORRECTION',
        prompt: 'নিচের বাক্যগুলো কোন গুণের অভাবে সার্থক বাক্য নয় ব্যাখ্যা করো: (ক) কাল আমরা ফুটবল মাঠে খেলতে গিয়েছিলাম। (খ) বড়শি দিয়ে আমরা নারিকেল পাড়ি। (গ) তিনি বাড়ি ফিরে...',
        correctAnswer: '(ক) আসত্তির অভাব (পদগুলো সুশৃঙ্খলভাবে সাজানো নেই)। (খ) যোগ্যতার অভাব (বড়শি দিয়ে নারিকেল পাড়া অসম্ভব ও অবাস্তব)। (গ) আকাঙ্ক্ষার অভাব (বক্তব্য অসম্পূর্ণ থাকায় পরবর্তী পদ শোনার ইচ্ছা রয়ে গেছে)।',
        explanationBn: 'বোর্ড পরীক্ষার অত্যন্ত ক্লাসিক ৩ নম্বরের প্রশ্ন।'
      }
    ],
    tags: ['SHARTHOK_BAKYO', 'AKANKSHA', 'ASATTI', 'YOGYATA', 'GURUCHONDALI', 'SSC', 'HSC'],
    status: 'PUBLISHED',
    orderIndex: 1,
    viewCount: 420
  },
  {
    id: 12802,
    chapterId: 128,
    parentTopicId: null,
    subject: 'BANGLA',
    topicNo: '২৮.২',
    titleBn: 'বাক্যের অংশ: উদ্দেশ্য ও বিধেয় এবং পদের অন্বয় বিশ্লেষণ',
    titleEn: 'Components of a Sentence: Subject (Uddeshsho) & Predicate (Bidheyo)',
    slug: 'b28-uddeshsho-o-bidheyo-bishleshon',
    difficulty: 'BOARD_STANDARD',
    classLevel: 'Class 8 - 12 (SSC & HSC)',
    summaryBn: 'প্রতিটি পূর্ণ বাক্যের দুটি প্রধান অংশ থাকে: উদ্দেশ্য (যার সম্বন্ধে বলা হয়) এবং বিধেয় (উদ্দেশ্য সম্বন্ধে যা বলা হয়)।',
    definitionBn: 'উদ্দেশ্য ও বিধেয়:\n১. উদ্দেশ্য (Subject / Uddeshsho): বাক্যে যার সম্পর্কে কোনো বক্তব্য প্রকাশ করা হয়, তাকে উদ্দেশ্য বলে। উদ্দেশ্যের মূল অংশ হলো কর্তা (যেমন: "সাকিব ভালো খেলেন"—এখানে "সাকিব" উদ্দেশ্য)।\n২. বিধেয় (Predicate / Bidheyo): উদ্দেশ্য সম্পর্কে বাক্যে যা কিছু বলা হয়, তাকে বিধেয় বলে। বিধেয়ের মূল অংশ হলো সমাপিকা ক্রিয়া (যেমন: "ভালো খেলেন" বিধেয়)।\nউদ্দেশ্যের সম্প্রসারণ ও বিধেয়ের সম্প্রসারণ:\n• মূল উদ্দেশ্যের পূর্বে বিশেষণ পদ বা সম্বন্ধ পদ যুক্ত হওয়াকে উদ্দেশ্যের সম্প্রসারণ বলে (যেমন: "আমাদের দলের বিশ্বসেরা অলরাউন্ডার সাকিব" ভালো খেলেন)।\n• মূল সমাপিকা ক্রিয়ার পূর্বে কর্ম বা ক্রিয়া-বিশেষণ যুক্ত হওয়াকে বিধেয়ের সম্প্রসারণ বলে (যেমন: সাকিব "গতকাল মাঠে অসাধারণ সাবলীলভাবে" ভালো খেলেন)।',
    definitionEn: 'Every declarative sentence divides into Uddeshsho (the Subject entity) and Bidheyo (the Predicate proposition), both subject to syntactic extensions/modifiers.',
    explanationBn: 'বাক্যে উদ্দেশ্য ও বিধেয় বিশ্লেষণের সহজ চার্ট:\n১. মূল উদ্দেশ্য চেনার উপায়: ক্রিয়াপদকে "কে" বা "কারা" দিয়ে প্রশ্ন করলে যে উত্তর পাওয়া যায়, তার সংলগ্ন মূল পদটিই উদ্দেশ্য।\n২. মূল বিধেয় চেনার উপায়: উদ্দেশ্য বাদ দিলে ক্রিয়াপদসহ বাকি অংশটি বিধেয়।\nউদাহরণ:\n"সাহসী মুক্তিযোদ্ধা রফিক দেশের জন্য প্রাণ দিলেন।"\n• মূল উদ্দেশ্য = রফিক\n• উদ্দেশ্যের সম্প্রসারক = সাহসী মুক্তিযোদ্ধা\n• মূল বিধেয় = প্রাণ দিলেন\n• বিধেয়ের সম্প্রসারক = দেশের জন্য।',
    teacherGoldenTips: 'মাস্টার ট্রিক:\n• কে বা কারা = উদ্দেশ্য!\n• কী করে বা কী হলো = বিধেয়!\n• কর্তার আগের বিশেষণ = উদ্দেশ্যের সম্প্রসারণ!\n• ক্রিয়ার আগের কর্ম/ক্রিয়া-বিশেষণ = বিধেয়ের সম্প্রসারণ!',
    rules: [
      {
        ruleNo: 1,
        nameBn: 'উদ্দেশ্য ও বিধেয়ের স্থানিক অবস্থান',
        explanationBn: 'বাংলা বাক্যের স্বাভাবিক পদক্রম অনুযায়ী উদ্দেশ্য প্রথমে বসে এবং বিধেয় শেষে বসে (Subject + Object + Verb রীতি)।',
        examples: [
          {
            bn: 'রহিম (উদ্দেশ্য) বই পড়ছে (বিধেয়)।',
            context: 'স্বাভাবিক পদক্রম'
          }
        ]
      }
    ],
    formulas: [
      {
        label: 'বাক্য বিশ্লেষণ সূত্র',
        structure: 'পূর্ণাঙ্গ বাক্য = [উদ্দেশ্যের সম্প্রসারক + মূল উদ্দেশ্য] + [বিধেয়ের সম্প্রসারক + মূল বিধেয়]'
      }
    ],
    examples: [
      {
        bn: 'আমাদের প্রধান শিক্ষক মহাশয় (উদ্দেশ্য) সভায় বক্তব্য রাখলেন (বিধেয়)',
        context: 'উদ্দেশ্য-বিধেয়'
      }
    ],
    exceptions: [
      {
        titleBn: 'কাব্যে বিধেয়ের পূর্বে আগমন',
        descriptionBn: 'কবিতা বা বিশেষ নাটকীয় সংলাপে জোর দেওয়ার জন্য বিধেয় উদ্দেশ্যের পূর্বে আসতে পারে (যেমন: "মরিতে চাহি না আমি সুন্দর ভুবনে"—এখানে "মরিতে চাহি না" বিধেয় আগে এসেছে)।'
      }
    ],
    commonMistakes: [
      {
        incorrectBn: '"ঘোড়া দ্রুত দৌড়ায়"—এখানে দ্রুত হলো উদ্দেশ্য।',
        correctBn: '"দ্রুত দৌড়ায়" বিধেয় অংশের অন্তর্গত (ক্রিয়া-বিশেষণ বিধেয়ের সম্প্রসারক)।',
        explanationBn: 'ঘোড়া হলো উদ্দেশ্য।'
      }
    ],
    writtenPractice: [
      {
        id: 1,
        type: 'IDENTIFICATION',
        prompt: 'নিচের বাক্যটি থেকে উদ্দেশ্য ও বিধেয় সম্প্রসারকসহ পৃথক করো: "মেধাবী ছাত্র সাকিব অত্যন্ত মনোযোগ দিয়ে পড়ছে।"',
        correctAnswer: 'উদ্দেশ্য অংশ: মেধাবী (সম্প্রসারক) ছাত্র সাকিব (মূল উদ্দেশ্য)। বিধেয় অংশ: অত্যন্ত মনোযোগ দিয়ে (সম্প্রসারক) পড়ছে (মূল বিধেয়)।',
        explanationBn: 'বোর্ড পরীক্ষার অত্যন্ত আকর্ষণীয় ৩ নম্বরের বাক্য বিশ্লেষণ।'
      }
    ],
    tags: ['UDDESHSHO', 'BIDHEYO', 'SENTENCE_COMPONENTS', 'PREDICATE', 'SSC', 'HSC'],
    status: 'PUBLISHED',
    orderIndex: 2,
    viewCount: 390
  }
];

const CHAPTER_28_MCQS = [
  {
    id: 128001,
    chapterId: 128,
    topicId: 12801,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: 'একটি সার্থক বাক্যের কয়টি অপরিহার্য গুণ থাকা আবশ্যক?',
    questionEn: 'How many essential attributes must a well-formed sentence possess?',
    options: ['৩টি (আকাঙ্ক্ষা, আসত্তি ও যোগ্যতা)', '২টি', '৪টি', '৫টি'],
    correctOptionIndex: 0,
    correctAnswerText: '৩টি (আকাঙ্ক্ষা, আসত্তি ও যোগ্যতা)',
    explanationBn: 'বাংলা ব্যাকরণে একটি সার্থক ও সুন্দর বাক্যের ৩টি মূল গুণ থাকা অপরিহার্য: আকাঙ্ক্ষা, আসত্তি এবং যোগ্যতা।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'ঢাকা বোর্ড',
    year: 2024,
    examType: 'SSC',
    tags: ['SHARTHOK_BAKYO_GUN', 'DHAKA_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 128002,
    chapterId: 128,
    topicId: 12801,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: '"হাতি আকাশে ওড়ে" বা "বড়শি দিয়ে নারিকেল পাড়ি"—বাক্য দুটিতে কোন গুণের অভাব ঘটেছে?',
    questionEn: 'Which quality is lacking in "Hathi akashe ore"?',
    options: ['যোগ্যতা', 'আকাঙ্ক্ষা', 'আসত্তি', 'আসক্তি'],
    correctOptionIndex: 0,
    correctAnswerText: 'যোগ্যতা',
    explanationBn: 'বাস্তব ঘটনা ও অর্থগত সংগতি না থাকায় বাক্যটির যোগ্যতা বিনষ্ট হয়েছে।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'রাজশাহী বোর্ড',
    year: 2023,
    examType: 'SSC',
    tags: ['YOGYATA_LACK', 'RAJSHAHI_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 128003,
    chapterId: 128,
    topicId: 12801,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: 'তৎসম শব্দের সাথে দেশি শব্দের অযৌক্তিক মিশ্রণ ঘটলে কোন দোষের সৃষ্টি হয়?',
    questionEn: 'What error occurs when Tatsama words are inappropriately mixed with native words?',
    options: ['গুরুচণ্ডালী দোষ', 'উপমার ভুল প্রয়োগ', 'আকাঙ্ক্ষার ত্রুটি', 'আসত্তির ত্রুটি'],
    correctOptionIndex: 0,
    correctAnswerText: 'গুরুচণ্ডালী দোষ',
    explanationBn: 'তৎসম ও দেশি শব্দের সংকর মিলনকে ব্যাকরণে গুরুচণ্ডালী দোষ বলে (যেমন: "শবপোড়া" বা "মড়াদাহ")। এটি যোগ্যতা গুণের হানি ঘটায়।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'যশোর বোর্ড',
    year: 2024,
    examType: 'SSC',
    tags: ['GURUCHONDALI_DOSH', 'JASHORE_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 128004,
    chapterId: 128,
    topicId: 12801,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: 'বাক্যের অর্থসংগতি রক্ষার জন্য পদগুলোকে সুশৃঙ্খলভাবে সাজানোকে কী বলে?',
    questionEn: 'What is the harmonious syntactic ordering of words in a sentence called?',
    options: ['আসত্তি', 'আকাঙ্ক্ষা', 'যোগ্যতা', 'আসক্তি'],
    correctOptionIndex: 0,
    correctAnswerText: 'আসত্তি',
    explanationBn: 'বাক্যে পদসমূহের সুশৃঙ্খল বিন্যাস বা নৈকট্যকে "আসত্তি" বলে।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'কুমিল্লা বোর্ড',
    year: 2023,
    examType: 'SSC',
    tags: ['ASATTI_DEFINITION', 'CUMILLA_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 128005,
    chapterId: 128,
    topicId: 12802,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: 'বাক্যে যার সম্পর্কে কোনো কিছু বলা হয়, তাকে ব্যাকরণে কী বলে?',
    questionEn: 'What is the entity about which something is stated in a sentence called?',
    options: ['উদ্দেশ্য (Subject)', 'বিধেয় (Predicate)', 'সমাপিকা ক্রিয়া', 'কর্মপদ'],
    correctOptionIndex: 0,
    correctAnswerText: 'উদ্দেশ্য (Subject)',
    explanationBn: 'বাক্যে যার সম্বন্ধে কিছু বলা হয় তাকে উদ্দেশ্য (Subject) এবং উদ্দেশ্য সম্বন্ধে যা বলা হয় তাকে বিধেয় (Predicate) বলে।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'চট্টগ্রাম বোর্ড',
    year: 2024,
    examType: 'SSC',
    tags: ['UDDESHSHO_DEFINITION', 'CHITTAGONG_BOARD'],
    status: 'ACTIVE'
  }
];

const CHAPTER_28_MODEL_TEST = {
  id: 12801,
  subject: 'BANGLA',
  chapterId: 128,
  testTitleBn: 'অধ্যায় ২৮ মডেল টেস্ট: বাক্য ও সার্থক বাক্যের গুণাবলী',
  testTitleEn: 'Chapter 28 Model Test: Sentence Syntax & Qualities',
  descriptionBn: 'আকাঙ্ক্ষা, আসত্তি, যোগ্যতা, গুরুচণ্ডালী দোষ এবং উদ্দেশ্য ও বিধেয় বিশ্লেষণের ওপর পূর্ণাঙ্গ মডেল টেস্ট।',
  durationMinutes: 10,
  totalMarks: 5,
  passPercentage: 60,
  difficulty: 'MEDIUM',
  questionCount: 5,
  questionIds: [128001, 128002, 128003, 128004, 128005],
  status: 'PUBLISHED'
};

// ============================================================================
// CHAPTER 29: বাক্যের গঠন ও শ্রেণিবিভাগ (Sentence Structure & Types)
// ============================================================================
const CHAPTER_29_TOPICS = [
  {
    id: 12901,
    chapterId: 129,
    parentTopicId: null,
    subject: 'BANGLA',
    topicNo: '২৯.১',
    titleBn: 'গঠন অনুসারে বাক্যের ৩ প্রকার শ্রেণিবিভাগ ও বাক্য রূপান্তর',
    titleEn: 'Structural Classification of Sentences (Simple, Complex, Compound) & Transformation',
    slug: 'b29-shorol-jotil-yowgik-bakyo',
    difficulty: 'BOARD_STANDARD',
    classLevel: 'Class 8 - 12 (SSC & HSC)',
    summaryBn: 'গঠন অনুসারে বাক্য ৩ প্রকার: সরল বাক্য (একটি কর্তা ও একটি সমাপিকা ক্রিয়া), জটিল/মিশ্র বাক্য (প্রধান ও আশ্রিত খণ্ডবাক্য) এবং যৌগিক বাক্য (যোজক দ্বারা যুক্ত একাধিক স্বাধীন বাক্য)।',
    definitionBn: 'গঠনগত ৩ প্রকার বাক্য:\n১. সরল বাক্য (Simple Sentence): যে বাক্যে একটিমাত্র কর্তা (উদ্দেশ্য) এবং একটিমাত্র সমাপিকা ক্রিয়া (বিধেয়) থাকে। যেমন: মেঘ ডাকলে বৃষ্টি হয়; তিনি ধনী হয়েও অত্যন্ত বিনয়ী।\n২. জটিল বা মিশ্র বাক্য (Complex Sentence): যে বাক্যে একটি প্রধান খণ্ডবাক্য এবং তার ওপর নির্ভরশীল এক বা একাধিক আশ্রিত খণ্ডবাক্য সাপেক্ষ যোজক দিয়ে যুক্ত থাকে। যেমন: যখন মেঘ ডাকে, তখন বৃষ্টি হয়; যিনি বিদ্বান, তিনি সর্বত্র সমাদৃত হন।\n৩. যৌগিক বাক্য (Compound Sentence): পরস্পর নিরপেক্ষ বা স্বাধীন একাধিক সরল বা জটিল বাক্য যখন সংযোজক, বিয়োজক বা বিরোধমূলক যোজক (এবং, ও, কিন্তু, অথবা, অথচ, বরং, নতুবা) দিয়ে যুক্ত হয়। যেমন: তিনি ধনী, কিন্তু কৃপণ; পরিশ্রম করো, নতুবা পরীক্ষায় অকৃতকার্য হবে।',
    definitionEn: 'Structurally, sentences classify into Simple (single finite clause), Complex (independent matrix clause with dependent clauses), and Compound (coordinate independent clauses linked via conjunctions).',
    explanationBn: 'বোর্ড পরীক্ষায় বাক্য রূপান্তরের মাস্টার শর্টকাট:\n১. সরল → জটিল করার কৌশল:\nসরল বাক্যের কারণ বা শর্তাংশকে "যখন...তখন", "যদি...তবে", "যে...সে", "যিনি...তিনি" সাপেক্ষ যোজক দিয়ে দুটি খণ্ডবাক্যে রূপান্তর করতে হবে।\n• সরল: পরিশ্রমীরা উন্নতি করে।\n• জটিল: যারা পরিশ্রম করে, তারাই উন্নতি করে।\n২. জটিল → যৌগিক করার কৌশল:\nসাপেক্ষ যোজক তুলে দিয়ে মাঝখানে "এবং", "কিন্তু" বা "সুতরাং" বসাতে হবে।\n• জটিল: যদিও তিনি দরিদ্র, তবুও তিনি সৎ।\n• যৌগিক: তিনি দরিদ্র, কিন্তু সৎ।\n৩. যৌগিক → সরল করার কৌশল:\nমাঝের যোজক তুলে দিয়ে প্রথম ক্রিয়াটিকে অসমাপিকা ক্রিয়ায় (করে, গিয়ে, হয়ে) পরিণত করে একটি সমাপিকা ক্রিয়ায় একীভূত করতে হবে।\n• যৌগিক: মেঘ ডাকল এবং বৃষ্টি নামল।\n• সরল: মেঘ ডেকে বৃষ্টি নামল।',
    teacherGoldenTips: 'মাস্টার কোড:\n• একটিমাত্র সমাপিকা ক্রিয়া = সরল বাক্য!\n• যিনি...তিনি, যে...সে, যখন...তখন = জটিল বাক্য!\n• কিন্তু, এবং, অথচ, নতুবা = যৌগিক বাক্য!',
    rules: [
      {
        ruleNo: 1,
        nameBn: 'সরল বাক্যে সমাপিকা ক্রিয়ার এককত্ব',
        explanationBn: 'সরল বাক্যে একাধিক অসমাপিকা ক্রিয়া (খেয়ে, গিয়ে, দেখে) থাকতে পারে, কিন্তু মূল সমাপিকা ক্রিয়া অবশ্যই একটিমাত্র হবে।',
        examples: [
          {
            bn: 'তিনি ভাত খেয়ে হাত ধুয়ে স্কুলে গেলেন (খেয়ে, ধুয়ে = অসমাপিকা ক্রিয়া; গেলেন = একটিমাত্র সমাপিকা ক্রিয়া = সরল বাক্য)।',
            context: 'সরল বাক্যের ক্রিয়া'
          }
        ]
      }
    ],
    formulas: [
      {
        label: 'বাক্য রূপান্তর সূত্র',
        structure: 'সরল (১টি সমাপিকা) ↔ জটিল (সাপেক্ষ যোজক: যদি...তবে) ↔ যৌগিক (স্বাধীন বাক্য + এবং/কিন্তু)'
      }
    ],
    examples: [
      {
        bn: 'মেঘ ডাকলে ময়ূর নাচে (সরল বাক্য)',
        context: 'সরল'
      },
      {
        bn: 'যখন মেঘ ডাকে, তখন ময়ূর নাচে (জটিল বাক্য)',
        context: 'জটিল'
      },
      {
        bn: 'মেঘ ডাকল এবং ময়ূর নাচল (যৌগিক বাক্য)',
        context: 'যৌগিক'
      }
    ],
    exceptions: [
      {
        titleBn: 'যোজকহীন যৌগিক বাক্য',
        descriptionBn: 'কখনো কখনো যোজক অব্যয় উহ্য রেখে কমা বা সেমিকোলন দিয়েও যৌগিক বাক্য গঠিত হয় (যেমন: বৃষ্টি এল, সবাই বাড়ি ফিরে গেল)।'
      }
    ],
    commonMistakes: [
      {
        incorrectBn: '"যিনি পরিশ্রম করেন তিনি সফল হন"—এটি যৌগিক বাক্য।',
        correctBn: 'এটি জটিল বাক্য কারণ এখানে "যিনি...তিনি" সাপেক্ষ যোজক রয়েছে।',
        explanationBn: 'যৌগিক বাক্যে স্বাধীন খণ্ডবাক্য "এবং/কিন্তু" দ্বারা যুক্ত হয়।'
      }
    ],
    writtenPractice: [
      {
        id: 1,
        type: 'TRANSFORMATION',
        prompt: 'নির্দেশানুসারে বাক্য রূপান্তর করো: (ক) তিনি ধনী কিন্তু কৃপণ (সরল বাক্যে)। (খ) সত্য কথা না বললে বিপদে পড়বে (যৌগিক বাক্যে)। (গ) যারা দেশপ্রেমিক তারা দেশকে ভালোবাসে (সরল বাক্যে)।',
        correctAnswer: '(ক) সরল: তিনি ধনী হয়েও কৃপণ। (খ) যৌগিক: সত্য কথা বলো, নতুবা বিপদে পড়বে। (গ) সরল: দেশপ্রেমিকেরা দেশকে ভালোবাসে।',
        explanationBn: 'বোর্ড পরীক্ষার অত্যন্ত গুরুত্বপূর্ণ ৩ নম্বরের বাক্য রূপান্তর।'
      }
    ],
    tags: ['SHOROL_BAKYO', 'JOTIL_BAKYO', 'YOWGIK_BAKYO', 'TRANSFORMATION', 'SSC', 'HSC'],
    status: 'PUBLISHED',
    orderIndex: 1,
    viewCount: 450
  },
  {
    id: 12902,
    chapterId: 129,
    parentTopicId: null,
    subject: 'BANGLA',
    topicNo: '২৯.২',
    titleBn: 'অর্থ অনুসারে বাক্যের শ্রেণিবিভাগ: বিবৃতিমূলক, প্রশ্নবোধক, অনুজ্ঞা ও বিস্ময়সূচক',
    titleEn: 'Semantic Classification of Sentences: Declarative, Interrogative, Imperative, Exclamatory',
    slug: 'b29-orthonushare-bakyer-shrenibibhag',
    difficulty: 'BOARD_STANDARD',
    classLevel: 'Class 8 - 12 (SSC & HSC)',
    summaryBn: 'অর্থের প্রকাশভঙ্গি অনুযায়ী বাক্যকে প্রধানত বিবৃতিমূলক (হ্যাঁ-সূচক ও না-সূচক), প্রশ্নবোধক, অনুজ্ঞাসূচক, প্রার্থনাসূচক ও বিস্ময়সূচক বাক্যে ভাগ করা হয়।',
    definitionBn: 'অর্থগত শ্রেণিবিভাগ:\n১. বিবৃতিমূলক বা বর্ণনাত্মক বাক্য (Declarative): কোনো তথ্য বা ঘটনার সাধারণ বিবৃতি প্রকাশ করে। এটি ২ প্রকার: (ক) অস্তিবাচক বা হ্যাঁ-সূচক (যেমন: তিনি একজন ভালো মানুষ) এবং (খ) নেতিবাচক বা না-সূচক (যেমন: তিনি অসৎ মানুষ নন)।\n২. প্রশ্নবোধক বাক্য (Interrogative): কোনো কিছু জানতে চেয়ে প্রশ্ন করা হয় (যেমন: আপনার নাম কী? তুমি কি যাবে?)।\n৩. অনুজ্ঞাসূচক বাক্য (Imperative): আদেশ, নিষেধ, উপদেশ, অনুরোধ বা প্রস্তাব প্রকাশ পায় (যেমন: সদা সত্য কথা বলিবে; আমাকে এক গ্লাস পানি দাও)।\n৪. প্রার্থনাসূচক বা ইচ্ছাসূচক বাক্য (Optative): বক্তার মনের ইচ্ছা বা শুভকামনা প্রকাশ পায় (যেমন: তোমার মঙ্গল হোক; ঈশ্বর তোমার সহায় হোন)।\n৫. বিস্ময়সূচক বা আবেগসূচক বাক্য (Exclamatory): আনন্দ, দুঃখ, শোক, বিস্ময় প্রকাশ পায় (যেমন: বাহ্! কী সুন্দর দৃশ্য!; হায়! আমার কী সর্বনাশ হলো!)।',
    definitionEn: 'Semantically sentences delineate mood and pragmatic force into Declarative (Affirmative/Negative), Interrogative, Imperative, Optative, and Exclamatory.',
    explanationBn: 'গঠন বনাম অর্থ শ্রেণিবিভাগের পার্থক্য:\nশিক্ষার্থীদের মনে রাখতে হবে—একটি বাক্য একই সাথে গঠনগতভাবে "সরল" এবং অর্থগতভাবে "প্রশ্নবোধক" হতে পারে! যেমন: "তুমি কি আজ স্কুলে যাবে?"—এটি গঠন অনুসারে "সরল বাক্য", কিন্তু অর্থ অনুসারে "প্রশ্নবোধক বাক্য"।\nহ্যাঁ-সূচক থেকে না-সূচক রূপান্তরের ক্লাসিক নিয়ম:\nঅর্থ অপরিবর্তিত রেখে বিপরীত শব্দ ব্যবহার করে "না" যোগ করতে হয়!\n• হ্যাঁ-সূচক: তিনি একজন বিদ্বান ব্যক্তি।\n• না-সূচক: তিনি মূর্খ ব্যক্তি নন (অর্থ অপরিবর্তিত)।\n• হ্যাঁ-সূচক: মানুষ মরণশীল।\n• না-সূচক: মানুষ অমর নয়।',
    teacherGoldenTips: 'অস্তিবাচক থেকে নেতিবাচক রূপান্তরের সিক্রেট:\nকখনোই মূল অর্থ বদলানো যাবে না! "তিনি ভালো" এর না-বোধক "তিনি খারাপ" নয়, বরং "তিনি খারাপ নন" লিখতে হবে!',
    rules: [
      {
        ruleNo: 1,
        nameBn: 'অর্থের অবিকৃত রূপান্তর নীতি',
        explanationBn: 'হ্যাঁ-সূচক থেকে না-সূচকে রূপান্তরের সময় বাক্যের মূল বক্তব্য ১০০% অক্ষুণ্ণ থাকতে হবে।',
        examples: [
          {
            bn: 'সদা সত্য কথা বলবে (হ্যাঁ-সূচক) → কখনো মিথ্যা কথা বলবে না (না-সূচক)।',
            context: 'অর্থ রক্ষা রূপান্তর'
          }
        ]
      }
    ],
    formulas: [
      {
        label: 'হ্যাঁ-সূচক ↔ না-সূচক সূত্র',
        structure: 'মূল গুণবাচক শব্দ (বিদ্বান) ↔ বিপরীত শব্দ (মূর্খ) + না/নয়'
      }
    ],
    examples: [
      {
        bn: 'তোমার দীর্ঘায়ু কামনা করি (প্রার্থনাসূচক)',
        context: 'প্রার্থনাসূচক'
      },
      {
        bn: 'অন্যায় কাজ কোরো না (অনুজ্ঞাসূচক)',
        context: 'অনুজ্ঞা'
      }
    ],
    exceptions: [
      {
        titleBn: 'প্রশ্ন-উত্তরমূলক অলংকারিক বাক্য',
        descriptionBn: '"কে না দেশকে ভালোবাসে?"—এটি দেখতে প্রশ্নবোধক হলেও অর্থগতভাবে দৃঢ় হ্যাঁ-বোধক বিবৃতি ("সবাই দেশকে ভালোবাসে") প্রকাশ করে।'
      }
    ],
    commonMistakes: [
      {
        incorrectBn: '"মানুষ মরণশীল"—এর না-সূচক রূপ "মানুষ বাঁচে না"।',
        correctBn: '"মানুষ অমর নয়"।',
        explanationBn: 'বিপরীত শব্দের সাহায্যে নেতিবাচক রূপ গঠন করতে হয়।'
      }
    ],
    writtenPractice: [
      {
        id: 1,
        type: 'TRANSFORMATION',
        prompt: 'অর্থের পরিবর্তন না করে রূপান্তর করো: (ক) তিনি ধনী ব্যক্তি (না-সূচক বাক্যে)। (খ) কেউ এ কথা অস্বীকার করতে পারে না (হ্যাঁ-সূচক বাক্যে)।',
        correctAnswer: '(ক) তিনি নির্ধন ব্যক্তি নন। (খ) সবাই এ কথা স্বীকার করে।',
        explanationBn: 'বোর্ড পরীক্ষার অত্যন্ত নিয়মিত ৩ নম্বরের প্রশ্ন।'
      }
    ],
    tags: ['DECLARATIVE', 'INTERROGATIVE', 'IMPERATIVE', 'EXCLAMATORY', 'SSC', 'HSC'],
    status: 'PUBLISHED',
    orderIndex: 2,
    viewCount: 410
  }
];

const CHAPTER_29_MCQS = [
  {
    id: 129001,
    chapterId: 129,
    topicId: 12901,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: 'যে বাক্যে একটিমাত্র কর্তা এবং একটিমাত্র সমাপিকা ক্রিয়া থাকে, তাকে কী বাক্য বলে?',
    questionEn: 'What is a sentence with a single subject and a single finite verb called?',
    options: ['সরল বাক্য', 'জটিল বাক্য', 'যৌগিক বাক্য', 'মিশ্র বাক্য'],
    correctOptionIndex: 0,
    correctAnswerText: 'সরল বাক্য',
    explanationBn: 'যে বাক্যে একটিমাত্র উদ্দেশ্য ও একটিমাত্র সমাপিকা ক্রিয়া থাকে, তাকে সরল বাক্য (Simple Sentence) বলে।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'ঢাকা বোর্ড',
    year: 2024,
    examType: 'SSC',
    tags: ['SHOROL_BAKYO', 'DHAKA_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 129002,
    chapterId: 129,
    topicId: 12901,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: '"যদিও তিনি দরিদ্র, তবুও তিনি সৎ"—এটি গঠন অনুসারে কোন প্রকারের বাক্য?',
    questionEn: 'What structural type of sentence is "Jodio tini doridro, tobuo tini shot"?',
    options: ['জটিল বা মিশ্র বাক্য', 'সরল বাক্য', 'যৌগিক বাক্য', 'বিবৃতিমূলক বাক্য'],
    correctOptionIndex: 0,
    correctAnswerText: 'জটিল বা মিশ্র বাক্য',
    explanationBn: 'যেহেতু বাক্যটিতে "যদিও...তবুও" সাপেক্ষ যোজক দ্বারা একটি প্রধান ও একটি আশ্রিত খণ্ডবাক্য যুক্ত রয়েছে, তাই এটি জটিল বাক্য।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'রাজশাহী বোর্ড',
    year: 2023,
    examType: 'SSC',
    tags: ['JOTIL_BAKYO', 'RAJSHAHI_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 129003,
    chapterId: 129,
    topicId: 12901,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: '"পরিশ্রম করো, নতুবা ফেল করবে"—এটি কোন জাতীয় বাক্য?',
    questionEn: 'What type of sentence is "Porishrom koro, notuba fail korbe"?',
    options: ['যৌগিক বাক্য', 'জটিল বাক্য', 'সরল বাক্য', 'প্রশ্নবোধক বাক্য'],
    correctOptionIndex: 0,
    correctAnswerText: 'যৌগিক বাক্য',
    explanationBn: 'একাধিক স্বাধীন খণ্ডবাক্য বিয়োজক অব্যয় "নতুবা" দ্বারা যুক্ত হওয়ায় এটি একটি যৌগিক বাক্য।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'যশোর বোর্ড',
    year: 2024,
    examType: 'SSC',
    tags: ['YOWGIK_BAKYO', 'JASHORE_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 129004,
    chapterId: 129,
    topicId: 12902,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: '"মানুষ মরণশীল"—অর্থের পরিবর্তন না করে এর সঠিক না-সূচক রূপ কোনটি?',
    questionEn: 'What is the correct negative transformation of "Manush moronshil" preserving meaning?',
    options: ['মানুষ অমর নয়', 'মানুষ মরে না', 'মানুষ বাঁচে না', 'মানুষ মরণশীল নয়'],
    correctOptionIndex: 0,
    correctAnswerText: 'মানুষ অমর নয়',
    explanationBn: 'অর্থ অবিকৃত রেখে মরণশীল শব্দের বিপরীত "অমর" ব্যবহার করে "নয়" যোগ করায় "মানুষ অমর নয়" সঠিক রূপ।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'কুমিল্লা বোর্ড',
    year: 2023,
    examType: 'SSC',
    tags: ['AFFIRMATIVE_TO_NEGATIVE', 'CUMILLA_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 129005,
    chapterId: 129,
    topicId: 12902,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: '"ঈশ্বর তোমার মঙ্গল করুন"—অর্থ অনুসারে এটি কোন প্রকার বাক্য?',
    questionEn: 'What semantic type of sentence is "Ishwar tomar mongol korun"?',
    options: ['প্রার্থনাসূচক বাক্য', 'বিবৃতিমূলক বাক্য', 'অনুজ্ঞাসূচক বাক্য', 'বিস্ময়সূচক বাক্য'],
    correctOptionIndex: 0,
    correctAnswerText: 'প্রার্থনাসূচক বাক্য',
    explanationBn: 'বক্তার আন্তরিক শুভকামনা বা প্রার্থনা প্রকাশ পাওয়ায় এটি প্রার্থনাসূচক বা ইচ্ছাসূচক বাক্য (Optative Sentence)।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'চট্টগ্রাম বোর্ড',
    year: 2024,
    examType: 'SSC',
    tags: ['OPTATIVE_SENTENCE', 'CHITTAGONG_BOARD'],
    status: 'ACTIVE'
  }
];

const CHAPTER_29_MODEL_TEST = {
  id: 12901,
  subject: 'BANGLA',
  chapterId: 129,
  testTitleBn: 'অধ্যায় ২৯ মডেল টেস্ট: বাক্যের গঠন ও শ্রেণিবিভাগ',
  testTitleEn: 'Chapter 29 Model Test: Sentence Structure & Classification',
  descriptionBn: 'সরল বাক্য, জটিল বাক্য, যৌগিক বাক্য, অর্থগত শ্রেণিবিভাগ এবং বাক্য রূপান্তরের ওপর পূর্ণাঙ্গ মডেল টেস্ট।',
  durationMinutes: 10,
  totalMarks: 5,
  passPercentage: 60,
  difficulty: 'MEDIUM',
  questionCount: 5,
  questionIds: [129001, 129002, 129003, 129004, 129005],
  status: 'PUBLISHED'
};

// ============================================================================
// CHAPTER 30: বাচ্য ও বাচ্য পরিবর্তন (Voice & Voice Transformation)
// ============================================================================
const CHAPTER_30_TOPICS = [
  {
    id: 13001,
    chapterId: 130,
    parentTopicId: null,
    subject: 'BANGLA',
    topicNo: '৩০.১',
    titleBn: 'বাচ্যের সংজ্ঞা ও প্রধান শ্রেণিবিভাগ: কর্তৃবাচ্য, কর্মবাচ্য ও ভাববাচ্য',
    titleEn: 'Definition of Voice (Bachyo) & 3 Primary Voices: Active, Passive, Impersonal',
    slug: 'b30-bachyo-shongpga-o-prokarbhed',
    difficulty: 'BOARD_STANDARD',
    classLevel: 'Class 8 - 12 (SSC & HSC)',
    summaryBn: 'বাক্যের বিভিন্ন ধরনের প্রকাশভঙ্গিকে বাচ্য (Voice) বলে। বাচ্য প্রধানত ৩ প্রকার: কর্তৃবাচ্য, কর্মবাচ্য ও ভাববাচ্য। এছাড়া কর্মকর্তৃবাচ্যও রয়েছে।',
    definitionBn: 'বাচ্য ও তার শ্রেণিবিভাগ:\n১. বাচ্য (Voice / Bachyo): বাক্যে ক্রিয়ার প্রকাশভঙ্গি বা বাক্যের কর্তা, কর্ম না ক্রিয়ার ভাব কার প্রাধান্য সূচিত হচ্ছে, তাকে বাচ্য বলে।\n২. প্রধান ৩টি বাচ্য:\n• কর্তৃবাচ্য (Active Voice): যে বাক্যে কর্তার প্রাধান্য থাকে এবং ক্রিয়াপদ কর্তার পুরুষানুযায়ী নির্ধারিত হয়। যেমন: ছাত্ররা ফুটবল খেলছে; শিক্ষক পড়াচ্ছেন।\n• কর্মবাচ্য (Passive Voice): যে বাক্যে কর্মপদের প্রাধান্য থাকে এবং ক্রিয়াপদ কর্মের অনুসারী হয়। কর্মবাচ্যে কর্তায় ৩য়া বিভক্তি (দ্বারা, দিয়া, কর্তৃক) এবং কর্মে প্রথমা/শূন্য বিভক্তি হয়। যেমন: শিকারি কর্তৃক বাঘটি নিহত হয়েছে; রবীন্দ্রনাথ কর্তৃক গীতাঞ্জলি রচিত হয়েছে।\n• ভাববাচ্য (Impersonal Voice): যে বাক্যে কর্তা বা কর্ম কোনোটির প্রাধান্য থাকে না, বরং ক্রিয়ার ভাবই প্রধান রূপে প্রতীয়মান হয়। ভাববাচ্যে কর্তায় ষষ্ঠী (র/এর) বা দ্বিতীয়া (কে/রে) বিভক্তি হয় এবং ক্রিয়াপদ সর্বদাই নাম পুরুষের একবচন হয়। যেমন: আমার যাওয়া হলো না; তোমাকে দেখতে হবে।\n৩. কর্মকর্তৃবাচ্য (Quasi-Passive): যে বাক্যে কর্মপদই কর্তার স্থানে বসে কর্তার মতো আচরণ করে (যেমন: বাঁশি বাজে, ঘণ্টা বাজে, গাড়ি চলে)।',
    definitionEn: 'Voice (Bachyo) reflects syntactic alignment highlighting either the Agent (Active/Kortribachyo), the Patient (Passive/Kormobachyo), or the Verbal Action itself (Impersonal/Bhabobachyo).',
    explanationBn: 'বাচ্য চেনার সুপার শর্টকাট ট্রিক:\n১. কর্তৃবাচ্য: কর্তা সরাসরি কাজ করছে, কর্তায় কোনো দ্বারা/দিয়া/কর্তৃক নেই (যেমন: রহিম বই পড়ে)।\n২. কর্মবাচ্য: বাক্যে "কর্তৃক" বা "দ্বারা" থাকবে এবং কর্মপদটি সরাসরি দৃশ্যমান থাকবে (যেমন: রহিম কর্তৃক বই পঠিত হচ্ছে)।\n৩. ভাববাচ্য: কর্তার শেষে "-র" বা "-এর" থাকবে (আমার, তোমার, তার) এবং ক্রিয়াপদে "হওয়া/যাওয়া" ভাব থাকবে (যেমন: আমার খাওয়া হলো না, তোমার যাওয়া হবে না)।\n৪. কর্মকর্তৃবাচ্য: কাজটি যে করছে সে উহ্য, মনে হবে যেন জিনিসটা নিজেই নিজের কাজ করছে! (যেমন: বাঁশি নিজে নিজে বাজে; কাপড় বোনা হচ্ছে)।',
    teacherGoldenTips: 'মাস্টার কোড:\n• কর্তা নিজে করছে = কর্তৃবাচ্য!\n• কর্তৃক / দ্বারা + কর্ম = কর্মবাচ্য!\n• আমার / তোমার + যাওয়া/খাওয়া হলো না = ভাববাচ্য!\n• বাঁশি বাজে / ঘণ্টা বাজে = কর্মকর্তৃবাচ্য!',
    rules: [
      {
        ruleNo: 1,
        nameBn: 'ভাববাচ্যের ক্রিয়ার রূপ',
        explanationBn: 'ভাববাচ্যের ক্রিয়াপদ সবসময় নাম পুরুষের একবচনে প্রযুক্ত হয় (যেমন: খাওয়া হবে, যাওয়া হলো না)।',
        examples: [
          {
            bn: 'আমার সেখানে যাওয়া হবে না (নাম পুরুষের ক্রিয়া)।',
            context: 'ভাববাচ্য'
          }
        ]
      }
    ],
    formulas: [
      {
        label: 'বাচ্য নির্ণয় সমীকরণ',
        structure: 'কর্তৃবাচ্য (কর্তা প্রধান) | কর্মবাচ্য (কর্তৃক + কর্ম) | ভাববাচ্য (ষষ্ঠী বিভক্তি + ভাব প্রধান)'
      }
    ],
    examples: [
      {
        bn: 'রফিক চিঠি লিখেছে (কর্তৃবাচ্য)',
        context: 'কর্তৃবাচ্য'
      },
      {
        bn: 'রফিক কর্তৃক চিঠিটি লিখিত হয়েছে (কর্মবাচ্য)',
        context: 'কর্মবাচ্য'
      },
      {
        bn: 'রফিকের চিঠি লেখা হলো (ভাববাচ্য)',
        context: 'ভাববাচ্য'
      }
    ],
    exceptions: [
      {
        titleBn: 'অকর্মক ক্রিয়ার কর্মবাচ্য না হওয়া',
        descriptionBn: 'যে বাক্যে কর্মপদ নেই (অকর্মক ক্রিয়া), তার কখনো কর্মবাচ্য হয় না; কেবল ভাববাচ্য হতে পারে (যেমন: "সে ঘুমায়" থেকে ভাববাচ্যে "তার ঘুমানো হয়")।'
      }
    ],
    commonMistakes: [
      {
        incorrectBn: '"বাঁশি বাজে"—এটি কর্তৃবাচ্য।',
        correctBn: '"বাঁশি বাজে" কর্মকর্তৃবাচ্য কারণ বাঁশি নিজে কর্তা নয়, কর্মপদ কর্তারূপে প্রতিভাত।'
      }
    ],
    writtenPractice: [
      {
        id: 1,
        type: 'IDENTIFICATION',
        prompt: 'নিচের বাক্যগুলো কোন বাচ্যের উদাহরণ লিখ: (ক) নজরুল কর্তৃক অগ্নিবীণা রচিত হয়েছে। (খ) আমার আজ যাওয়া হবে না। (গ) সুতি কাপড় বেশি দিন টেকে। (ঘ) ছেলেরা ফুটবল খেলছে।',
        correctAnswer: '(ক) কর্মবাচ্য। (খ) ভাববাচ্য। (গ) কর্মকর্তৃবাচ্য। (ঘ) কর্তৃবাচ্য।',
        explanationBn: 'বোর্ড পরীক্ষার অত্যন্ত আকর্ষণীয় ৪ নম্বরের বাচ্য নির্ণয়।'
      }
    ],
    tags: ['BACHYO', 'VOICE', 'KORTRIBACHYO', 'KORMOBACHYO', 'BHABOBACHYO', 'SSC', 'HSC'],
    status: 'PUBLISHED',
    orderIndex: 1,
    viewCount: 440
  },
  {
    id: 13002,
    chapterId: 130,
    parentTopicId: null,
    subject: 'BANGLA',
    topicNo: '৩০.২',
    titleBn: 'বাচ্য পরিবর্তনের সম্পূর্ণ নিয়ম ও প্রাকৃতিক রূপান্তর কৌশল',
    titleEn: 'Rules of Voice Transformation: Active to Passive & Impersonal',
    slug: 'b30-bachyo-poribortoner-niyom',
    difficulty: 'BOARD_STANDARD',
    classLevel: 'Class 8 - 12 (SSC & HSC)',
    summaryBn: 'কর্তৃবাচ্য থেকে কর্মবাচ্যে রূপান্তরের সময় কর্তায় ৩য়া বিভক্তি (দ্বারা/কর্তৃক) এবং ক্রিয়ায় "হওয়া/যাওয়া" ধাতু যুক্ত হয়। অকর্মক ক্রিয়ার ভাববাচ্য হয়।',
    definitionBn: 'বাচ্য পরিবর্তনের নিয়মাবলি:\n১. কর্তৃবাচ্য থেকে কর্মবাচ্য:\n• কর্তায় তৃতীয়া বিভক্তি (দ্বারা, দিয়া, কর্তৃক) যোগ করতে হবে।\n• কর্মে প্রথমা বা শূন্য বিভক্তি হবে।\n• মূল সমাপিকা ক্রিয়াটিকে কর্মের অনুসারী করে সাধারণত "হওয়া" বা "যাওয়া" ধাতুরূপ যুক্ত করতে হবে।\nউদাহরণ: পুলিশ চোর ধরেছে (কর্তৃবাচ্য) → পুলিশ কর্তৃক চোর ধৃত হয়েছে (কর্মবাচ্য)।\n২. কর্তৃবাচ্য থেকে ভাববাচ্য:\n• কর্তায় ষষ্ঠী বিভক্তি (-র/এর) বা দ্বিতীয়া বিভক্তি (-কে) যুক্ত হয়।\n• ক্রিয়াটিকে ভাববাচক রূপ দিয়ে "হওয়া/যাওয়া" যোগ করতে হয়।\nউদাহরণ: আমি যাব না (কর্তৃবাচ্য) → আমার যাওয়া হবে না (ভাববাচ্য)।\n৩. কর্মবাচ্য থেকে কর্তৃবাচ্য:\n• কর্তার "দ্বারা/কর্তৃক" তুলে দিয়ে কর্তায় প্রথমা বিভক্তি দিতে হবে এবং ক্রিয়াটিকে সরাসরি কর্তার অনুসারী করতে হবে।\nউদাহরণ: শিকারি কর্তৃক বাঘটি নিহত হয়েছে → শিকারি বাঘটিকে হত্যা করেছে।',
    definitionEn: 'Voice transformation alters constituent case alignments (Nom-Acc to Ins-Nom in Passive, or Gen/Dat in Impersonal) while adapting the main verb via auxiliary verbs.',
    explanationBn: 'বোর্ড পরীক্ষায় নিশ্চিত কমন আসা ১০টি ক্লাসিক বাচ্য পরিবর্তন:\n১. কর্তৃ → কর্ম: তিনি বই পড়ছেন → তাঁর দ্বারা বই পঠিত হচ্ছে।\n২. কর্তৃ → কর্ম: দস্যুরা গৃহস্থকে লুণ্ঠন করেছে → দস্যু কর্তৃক গৃহস্থ লুণ্ঠিত হয়েছে।\n৩. কর্তৃ → কর্ম: আমি চিঠিটি লিখেছি → আমার দ্বারা চিঠিটি লিখিত হয়েছে।\n৪. কর্তৃ → ভাব: তুমি কখন এলে? → তোমার কখন আসা হলো?\n৫. কর্তৃ → ভাব: আমি যাব না → আমার যাওয়া হবে না।\n৬. কর্তৃ → ভাব: আমরা আজ রাতে খাব না → আমাদের আজ রাতে খাওয়া হবে না।\n৭. কর্ম → কর্তৃ: রবীন্দ্রনাথ কর্তৃক গীতাঞ্জলি রচিত হয়েছে → রবীন্দ্রনাথ গীতাঞ্জলি রচনা করেছেন।\n৮. কর্ম → কর্তৃ: বিদ্যাসাগর কর্তৃক শকুন্তলা অনূদিত হয়েছিল → বিদ্যাসাগর শকুন্তলা অনুবাদ করেছিলেন।\n৯. ভাব → কর্তৃ: আপনার থাকা হবে কোথায়? → আপনি থাকবেন কোথায়?\n১০. ভাব → কর্তৃ: তাঁর যেন আসা হয় → তিনি যেন আসেন।',
    teacherGoldenTips: 'ম্যাজিক ফর্মুলা:\n• কর্তৃ → কর্ম: কর্তায় বসান "কর্তৃক" বা "দ্বারা"!\n• কর্তৃ → ভাব: কর্তায় বসান "র/এর" এবং ক্রিয়ায় লাগান "হওয়া/যাওয়া"!\n• ভাব → কর্তৃ: কর্তার "র/এর" উঠিয়ে দিন এবং স্বাভাবিক ক্রিয়া লিখুন!',
    rules: [
      {
        ruleNo: 1,
        nameBn: 'প্রাকৃতিক বাচ্য রূপান্তরের সীমাবদ্ধতা',
        explanationBn: 'সকল বাক্যের যান্ত্রিকভাবে সব বাচ্যে রূপান্তর সম্ভব নয়; কেবল ব্যাকরণিকভাবে স্বাভাবিক ও প্রমিত রূপই গ্রহণযোগ্য।',
        examples: [
          {
            bn: 'সে হাসে (অকর্মক) → কর্মবাচ্য অসম্ভব ❌; ভাববাচ্য: তার হাসা হলো ✅।',
            context: 'অকর্মকের সীমাবদ্ধতা'
          }
        ]
      }
    ],
    formulas: [
      {
        label: 'বাচ্য পরিবর্তন ছক',
        structure: 'কর্তা (আমি) ↔ কর্মবাচ্যে (আমার দ্বারা) ↔ ভাববাচ্যে (আমার যাওয়া হবে না)'
      }
    ],
    examples: [
      {
        bn: 'আমি ভাত খাই (কর্তৃবাচ্য) → আমার ভাত খাওয়া হলো (ভাববাচ্য)',
        context: 'ভাববাচ্যে রূপান্তর'
      }
    ],
    exceptions: [
      {
        titleBn: 'কর্মকর্তৃবাচ্যের রূপান্তরহীনতা',
        descriptionBn: 'কর্মকর্তৃবাচ্যের বাক্যের ক্ষেত্রে কর্তা সুনির্দিষ্ট না থাকায় একে সরাসরি অন্য বাচ্যে রূপান্তর করা যায় না।'
      }
    ],
    commonMistakes: [
      {
        incorrectBn: '"আমি চললাম"—এর কর্মবাচ্য "আমার দ্বারা চলা হলো"।',
        correctBn: 'এটি ভাববাচ্য হবে: "আমার চলা হলো"।',
        explanationBn: 'কারণ চলা অকর্মক ক্রিয়া, এর কোনো কর্মপদ নেই।'
      }
    ],
    writtenPractice: [
      {
        id: 1,
        type: 'TRANSFORMATION',
        prompt: 'বাচ্য পরিবর্তন করো: (ক) আমি এ কাজ করব না (ভাববাচ্যে)। (খ) শিক্ষক ছাত্রকে পড়াচ্ছেন (কর্মবাচ্যে)। (গ) আপনার কোথায় থাকা হয়? (কর্তৃবাচ্যে)।',
        correctAnswer: '(ক) ভাববাচ্য: আমার এ কাজ করা হবে না। (খ) কর্মবাচ্য: শিক্ষক কর্তৃক ছাত্র পঠিত হচ্ছে (বা ছাত্রকে পড়ানো হচ্ছে)। (গ) কর্তৃবাচ্য: আপনি কোথায় থাকেন?',
        explanationBn: 'বোর্ড পরীক্ষার ক্লাসিক ৩ নম্বরের বাচ্য রূপান্তর।'
      }
    ],
    tags: ['VOICE_TRANSFORMATION', 'KORTRI_TO_KORMO', 'KORTRI_TO_BHABO', 'SSC', 'HSC'],
    status: 'PUBLISHED',
    orderIndex: 2,
    viewCount: 460
  }
];

const CHAPTER_30_MCQS = [
  {
    id: 130001,
    chapterId: 130,
    topicId: 13001,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: 'যে বাচ্যে কর্মপদের প্রাধান্য থাকে এবং ক্রিয়াপদ কর্মের অনুসারী হয়, তাকে কী বলে?',
    questionEn: 'Which voice emphasizes the patient/object and aligns the verb with it?',
    options: ['কর্মবাচ্য (Passive Voice)', 'কর্তৃবাচ্য (Active Voice)', 'ভাববাচ্য (Impersonal Voice)', 'কর্মকর্তৃবাচ্য'],
    correctOptionIndex: 0,
    correctAnswerText: 'কর্মবাচ্য (Passive Voice)',
    explanationBn: 'যে বাচ্যে কর্মের প্রাধান্য সূচিত হয় এবং কর্তায় ৩য়া বিভক্তি (দ্বারা/কর্তৃক) থাকে, তাকে কর্মবাচ্য বলে।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'ঢাকা বোর্ড',
    year: 2024,
    examType: 'SSC',
    tags: ['KORMOBACHYO', 'DHAKA_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 130002,
    chapterId: 130,
    topicId: 13001,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: '"আমার আজ খাওয়া হবে না"—এটি কোন বাচ্যের উদাহরণ?',
    questionEn: 'What voice is "Amar aj khaowa hobe na"?',
    options: ['ভাববাচ্য', 'কর্মবাচ্য', 'কর্তৃবাচ্য', 'কর্মকর্তৃবাচ্য'],
    correctOptionIndex: 0,
    correctAnswerText: 'ভাববাচ্য',
    explanationBn: 'যে বাক্যে কর্তা বা কর্মের প্রাধান্য না থেকে ক্রিয়ার ভাবই প্রধান রূপে প্রতিভাত হয়, তাকে ভাববাচ্য বলে।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'রাজশাহী বোর্ড',
    year: 2023,
    examType: 'SSC',
    tags: ['BHABOBACHYO', 'RAJSHAHI_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 130003,
    chapterId: 130,
    topicId: 13001,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: '"বাঁশি বাজে ওই মধুর সুরে"—এখানে "বাঁশি বাজে" কোন বাচ্যের উদাহরণ?',
    questionEn: 'What voice is "Banshi baje"?',
    options: ['কর্মকর্তৃবাচ্য', 'কর্মবাচ্য', 'ভাববাচ্য', 'কর্তৃবাচ্য'],
    correctOptionIndex: 0,
    correctAnswerText: 'কর্মকর্তৃবাচ্য',
    explanationBn: 'কর্মপদই কর্তার মতো আচরণ করে নিজে নিজে কাজ করছে বলে মনে হলে তাকে কর্মকর্তৃবাচ্য (Quasi-Passive) বলে।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'যশোর বোর্ড',
    year: 2024,
    examType: 'SSC',
    tags: ['QUASI_PASSIVE', 'BANSHI_BAJE', 'JASHORE_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 130004,
    chapterId: 130,
    topicId: 13002,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: '"রবীন্দ্রনাথ গীতাঞ্জলি রচনা করেছেন"—এর সঠিক কর্মবাচ্য রূপ কোনটি?',
    questionEn: 'What is the correct passive voice transformation of "Rabindranath Gitanjali rochona korechhen"?',
    options: ['রবীন্দ্রনাথ কর্তৃক গীতাঞ্জলি রচিত হয়েছে', 'রবীন্দ্রনাথের গীতাঞ্জলি লেখা হলো', 'রবীন্দ্রনাথ গীতাঞ্জলি লিখেছিলেন', 'গীতাঞ্জলি রবীন্দ্রনাথ পড়েছিলেন'],
    correctOptionIndex: 0,
    correctAnswerText: 'রবীন্দ্রনাথ কর্তৃক গীতাঞ্জলি রচিত হয়েছে',
    explanationBn: 'কর্মবাচ্যে কর্তার পরে "কর্তৃক" এবং ক্রিয়া কর্মের অনুসারী হয়ে "রবীন্দ্রনাথ কর্তৃক গীতাঞ্জলি রচিত হয়েছে" হবে।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'কুমিল্লা বোর্ড',
    year: 2023,
    examType: 'SSC',
    tags: ['VOICE_TRANSFORMATION', 'GITANJALI', 'CUMILLA_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 130005,
    chapterId: 130,
    topicId: 13002,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: '"আমি যাব না"—কর্তৃবাচ্যের এই বাক্যটিকে ভাববাচ্যে রূপান্তর করলে কোনটি শুদ্ধ?',
    questionEn: 'What is the correct impersonal transformation of "Ami jabo na"?',
    options: ['আমার যাওয়া হবে না', 'আমি যাওয়া করব না', 'আমার দ্বারা যাওয়া হলো না', 'আমাকে যেতে হবে না'],
    correctOptionIndex: 0,
    correctAnswerText: 'আমার যাওয়া হবে না',
    explanationBn: 'কর্তৃবাচ্যের "আমি" ভাববাচ্যে ষষ্ঠী বিভক্তিযুক্ত হয়ে "আমার" এবং সমাপিকা ক্রিয়া "যাওয়া হবে না" রূপ ধারণ করে।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'চট্টগ্রাম বোর্ড',
    year: 2024,
    examType: 'SSC',
    tags: ['AMI_JABO_NA', 'BHABOBACHYO', 'CHITTAGONG_BOARD'],
    status: 'ACTIVE'
  }
];

const CHAPTER_30_MODEL_TEST = {
  id: 13001,
  subject: 'BANGLA',
  chapterId: 130,
  testTitleBn: 'অধ্যায় ৩০ মডেল টেস্ট: বাচ্য ও বাচ্য পরিবর্তন',
  testTitleEn: 'Chapter 30 Model Test: Voice & Voice Transformation',
  descriptionBn: 'কর্তৃবাচ্য, কর্মবাচ্য, ভাববাচ্য, কর্মকর্তৃবাচ্য এবং বাচ্য পরিবর্তনের কলাকৌশলের ওপর পূর্ণাঙ্গ মডেল টেস্ট।',
  durationMinutes: 10,
  totalMarks: 5,
  passPercentage: 60,
  difficulty: 'MEDIUM',
  questionCount: 5,
  questionIds: [130001, 130002, 130003, 130004, 130005],
  status: 'PUBLISHED'
};

module.exports = {
  CHAPTER_26_TOPICS, CHAPTER_26_MCQS, CHAPTER_26_MODEL_TEST,
  CHAPTER_27_TOPICS, CHAPTER_27_MCQS, CHAPTER_27_MODEL_TEST,
  CHAPTER_28_TOPICS, CHAPTER_28_MCQS, CHAPTER_28_MODEL_TEST,
  CHAPTER_29_TOPICS, CHAPTER_29_MCQS, CHAPTER_29_MODEL_TEST,
  CHAPTER_30_TOPICS, CHAPTER_30_MCQS, CHAPTER_30_MODEL_TEST
};
