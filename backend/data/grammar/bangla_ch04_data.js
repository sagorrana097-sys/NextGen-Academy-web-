/**
 * Bangla Grammar Chapter 04: পদ ও পদ প্রকরণ (Parts of Speech)
 * Comprehensive, Exam-Oriented Educational Content for SSC, HSC & Admission
 */

const CHAPTER_04_TOPICS = [
  {
    id: 10401,
    chapterId: 104,
    parentTopicId: null,
    subject: 'BANGLA',
    topicNo: '৪.১',
    titleBn: 'পদের সংজ্ঞা, স্বরূপ ও শব্দ বনাম পদের পার্থক্য',
    titleEn: 'Definition, Nature of Pod & Difference between Word and Pod',
    slug: 'b04-poder-shongpga-shobdo-bonam-pod',
    difficulty: 'BEGINNER',
    classLevel: 'Class 6 - 12 (SSC & HSC)',
    summaryBn: 'বাক্যে ব্যবহৃত বিভক্তিযুক্ত প্রত্যেকটি শব্দ বা ধাতুকে পদ বলে। বাক্যের বাইরে থাকলে তা শব্দ, আর বাক্যে স্থান পেলেই তা পদ।',
    definitionBn: 'পদ (Parts of Speech / Inflected Word): বাক্যে ব্যবহৃত বিভক্তিযুক্ত শব্দ ও ধাতুকে পদ বলে। ড. সুনীতিকুমার চট্টোপাধ্যায়ের মতে: "বাক্যে প্রযুক্ত শব্দকে পদ বলে।" যে শব্দে কোনো দৃশ্যমান বিভক্তি থাকে না, সেখানে একটি শূন্য বিভক্তি (বা প্রথমা বিভক্তি) যুক্ত আছে বলে ধরে নেওয়া হয়।',
    definitionEn: 'A word or verb root used within a sentence with grammatical inflection (vibhakti) is called a Pod. Outside a sentence it is merely a Word, but inside a sentence it functions as a Pod.',
    explanationBn: 'শব্দ ও পদের মধ্যে মৌলিক পার্থক্য হলো বাক্যে প্রয়োগ ও বিভক্তি। অভিধানে যে শব্দগুলো থাকে (যেমন: মানুষ, বই, পড়া) সেগুলো বিচ্ছিন্ন শব্দ। কিন্তু যখন বলা হয় "মানুষ বই পড়ে", তখন "মানুষ" (মানুষ+০ বিভক্তি), "বই" (বই+০ বিভক্তি), "পড়ে" (পড়্ ধাতু + এ বিভক্তি)—সবগুলোই পদে পরিণত হয়েছে। পদ ছাড়া কখনো কোনো বাক্য গঠিত হতে পারে না। পদ মূলত বাক্যের পারস্পরিক অর্থসঙ্গতি রক্ষা করে।',
    teacherGoldenTips: 'পরীক্ষার টেকনিক: (১) বাক্যের ক্ষুদ্রতম একক কোনটি? → শব্দ বা পদ। (২) শব্দ কখন পদে পরিণত হয়? → বাক্যে ব্যবহৃত হলে এবং বিভক্তি যুক্ত হলে। (৩) যে পদে দৃশ্যমান কোনো বিভক্তি নেই, তাতে কোন বিভক্তি থাকে? → শূন্য বিভক্তি (বা প্রথমা বিভক্তি)।',
    rules: [
      {
        ruleNo: 1,
        nameBn: 'বিভক্তিযুক্ত শব্দই পদ',
        explanationBn: 'বাক্যের প্রতিটি শব্দের সাথে অন্বয় সাধনের জন্য কোনো না কোনো বিভক্তি যুক্ত থাকতেই হবে।',
        examples: [
          {
            bn: 'পুকুর মাছ আছে (অর্থহীন শব্দগুচ্ছ) → পুকুরে মাছ আছে (পুকুর+এ বিভক্তি যুক্ত হয়ে পদে রূপ নিল)।',
            context: 'শব্দ থেকে পদে রূপান্তর',
            highlight: 'পুকুর → পুকুরে'
          }
        ]
      },
      {
        ruleNo: 2,
        nameBn: 'শূন্য বিভক্তির নীতি',
        explanationBn: 'শব্দের শেষে কোনো প্রত্যয় বা বিভক্তি চিহ্ন না থাকলে তাকে ব্যাকরণে শূন্য (০) বিভক্তি গণ্য করা হয়।',
        examples: [
          {
            bn: 'রহিম বল খেলে। এখানে "রহিম" ও "বল" উভয়ই শূন্য বিভক্তিযুক্ত পদ।',
            context: 'শূন্য বিভক্তি'
          }
        ]
      }
    ],
    formulas: [
      {
        label: 'পদ গঠনের সূত্র',
        structure: 'শব্দ / ধাতু + বিভক্তি = পদ (Sentence Unit)'
      }
    ],
    examples: [
      {
        bn: 'ছাত্ররা বিদ্যালয়ে যাচ্ছে (ছাত্র+রা, বিদ্যালয়+এ, যা+চ্ছে—সবগুলোই পদ)',
        context: 'বাক্যে পদের দৃষ্টান্ত'
      }
    ],
    exceptions: [
      {
        titleBn: 'অব্যয় পদে বিভক্তি অপ্রয়োগ',
        descriptionBn: 'অব্যয় পদের সাথে সাধারণত কোনো বিভক্তি যুক্ত হয় না (বা সর্বদাই শূন্য বিভক্তি থাকে), তবুও তা পদ।'
      }
    ],
    commonMistakes: [
      {
        incorrectBn: 'অভিধানের সকল শব্দই এক একটি পদ।',
        correctBn: 'অভিধানের শব্দগুলো কেবল শব্দ বা প্রাতিপদিক; বাক্যে ব্যবহৃত না হওয়া পর্যন্ত তারা পদ নয়।',
        explanationBn: 'বাক্যে প্রয়োগই পদের একমাত্র স্বীকৃতি।'
      }
    ],
    writtenPractice: [
      {
        id: 1,
        type: 'DIFFERENCE',
        prompt: 'শব্দ ও পদের মধ্যে দুটি প্রধান পার্থক্য লিখ।',
        correctAnswer: '১. শব্দ ভাষায় ভাব প্রকাশের জন্য ধ্বনিসমষ্টি মাত্র, কিন্তু পদ হলো বাক্যে ব্যবহৃত বিভক্তিযুক্ত শব্দ। ২. শব্দ একা বসে সম্পূর্ণ বাক্যের অর্থ তৈরি করতে পারে না, পদ বাক্যের অংশ হিসেবে নির্দিষ্ট ব্যাকরণিক ভূমিকা পালন করে।',
        explanationBn: 'বোর্ডের ক-অংশের আদর্শ উত্তর।'
      }
    ],
    tags: ['POD', 'SHOBDO_POD', 'BIBHOKTI', 'SSC', 'HSC'],
    status: 'PUBLISHED',
    orderIndex: 1,
    viewCount: 160
  },
  {
    id: 10402,
    chapterId: 104,
    parentTopicId: null,
    subject: 'BANGLA',
    topicNo: '৪.২',
    titleBn: 'পদের প্রধান শ্রেণিবিভাগ: সব্যয় ও অব্যয় পদ',
    titleEn: 'Primary Classification of Pod: Subyog & Abyoy',
    slug: 'b04-poder-shrenibibhag-shobyoy-obyoy',
    difficulty: 'BEGINNER',
    classLevel: 'Class 6 - 12 (SSC & HSC)',
    summaryBn: 'রূপ পরিবর্তনের বিচারে পদ প্রধানত দুই প্রকার: সব্যয় পদ (যার রূপ বদলায়) এবং অব্যয় পদ (যার রূপ কখনোই বদলায় না)। মোট পদ ৫ প্রকার।',
    definitionBn: 'পদের শ্রেণিবিভাগ: ঐতিহ্যবাহী ব্যাকরণ অনুযায়ী পদ প্রধানত দুই প্রকার: ১. সব্যয় পদ: যেসব পদের সাথে বিভক্তি, বচন বা লিঙ্গভেদে রূপের পরিবর্তন ঘটে। ২. অব্যয় পদ: যার কোনো অবস্থাতেই কোনো রূপান্তর বা পরিবর্তন ঘটে না (ন ব্যয় = অব্যয়)। সামগ্রিকভাবে বাংলা ভাষায় পদ প্রধানত পাঁচ প্রকার: বিশেষ্য (Noun), বিশেষণ (Adjective), সর্বনাম (Pronoun), ক্রিয়া (Verb) এবং অব্যয় (Indeclinable)।',
    definitionEn: 'Words with declension/inflection are Subyog (inflected: Noun, Adjective, Pronoun, Verb), while Indeclinables are Abyoy. Broadly, Bengali has 5 parts of speech.',
    explanationBn: 'সব্যয় পদ চার প্রকার: বিশেষ্য, বিশেষণ, সর্বনাম ও ক্রিয়া। এদের রূপ বচন বা বিভক্তিভেদে বদলাতে পারে (যেমন: ছেলে → ছেলেরা → ছেলেদের; ভালো → ভালোরা; যাই → গেল → যাবে)। কিন্তু অব্যয় পদের কোনো বচন নেই, লিঙ্গ নেই, বিভক্তি নেই (যেমন: এবং, ও, কিন্তু, অথচ, যদি, হঠাৎ, বা)। আধুনিক ব্যাকরণে (যেমন নতুন এনসিটিবি পাঠ্যপুস্তকে) পদকে ৮টি শ্রেণিতে ভাগ করা হলেও ঐতিহ্যবাহী পাঁচ প্রকার পদই বিগত কয়েক দশক ধরে সকল বোর্ড ও প্রতিযোগিতামূলক পরীক্ষার প্রধান ভিত্তি।',
    teacherGoldenTips: 'মনে রাখবেন: (১) পদ প্রধানত কয় প্রকার? → ২ প্রকার (সব্যয় ও অব্যয়)। (২) সামগ্রিকভাবে পদ কয় প্রকার? → ৫ প্রকার (বিশেষ্য, বিশেষণ, সর্বনাম, ক্রিয়া, অব্যয়)। (৩) আধুনিক শ্রেণিবিভাগ কয়টি? → ৮টি (বিশেষ্য, সর্বনাম, বিশেষণ, ক্রিয়া, ক্রিয়াবিশেষণ, অনুসর্গ, যোজক, আবেগ)।',
    rules: [
      {
        ruleNo: 1,
        nameBn: 'সব্যয় বনাম অব্যয় চেনার কৌশল',
        explanationBn: 'শব্দটির সাথে "রা", "দের", "এ", "তে" যোগ করে রূপান্তর করা গেলে তা সব্যয়; কোনোভাবেই রূপান্তর না হলে তা অব্যয়।',
        examples: [
          {
            bn: 'কলম → কলমগুলো (রূপ বদলায় = সব্যয়)। কিন্তু → কিন্তুগুলো বা কিন্তুরা হয় না (রূপ বদলায় না = অব্যয়)।',
            context: 'অব্যয়ের অপরিবর্তনশীলতা',
            highlight: 'অব্যয় অপরিবর্তনীয়'
          }
        ]
      }
    ],
    formulas: [
      {
        label: 'পদের প্রধান বিভাজন ছক',
        structure: 'পদ → সব্যয় (বিশেষ্য, বিশেষণ, সর্বনাম, ক্রিয়া) + অব্যয়'
      }
    ],
    examples: [
      {
        bn: 'রহিম (বিশেষ্য), ভালো (বিশেষণ), সে (সর্বনাম), পড়ে (ক্রিয়া), এবং (অব্যয়)',
        context: 'পাঁচ প্রকার পদের একত্র বাক্য'
      }
    ],
    exceptions: [
      {
        titleBn: 'অব্যয়ের আলঙ্কারিক ব্যবহার',
        descriptionBn: 'মাঝে মাঝে ব্যঙ্গ বা অলঙ্কার প্রকাশের জন্য অব্যয়ের সাথে বিভক্তি যুক্ত মনে হতে পারে (যেমন: "তার কিন্তু কিন্তু ভাব গেল না")।'
      }
    ],
    commonMistakes: [
      {
        incorrectBn: 'অব্যয় পদেরও বচন ও লিঙ্গভেদ হয়।',
        correctBn: 'অব্যয় পদের কোনো লিঙ্গ, বচন বা কারক-বিভক্তি হয় না।',
        explanationBn: 'ন ব্যয় = যার কোনো ব্যয় বা পরিবর্তন নেই।'
      }
    ],
    writtenPractice: [
      {
        id: 1,
        type: 'LISTING',
        prompt: 'বাংলা ভাষায় পদ প্রধানত কয় প্রকার ও কী কী?',
        correctAnswer: 'বাংলা ভাষায় পদ প্রধানত পাঁচ প্রকার: ১. বিশেষ্য (Noun), ২. বিশেষণ (Adjective), ৩. সর্বনাম (Pronoun), ৪. ক্রিয়া (Verb), ৫. অব্যয় (Indeclinable)।',
        explanationBn: 'সংজ্ঞাসহ তালিকা উপস্থাপন।'
      }
    ],
    tags: ['POD', 'CLASSIFICATION', 'SHOBYOY', 'OBYOY', 'SSC'],
    status: 'PUBLISHED',
    orderIndex: 2,
    viewCount: 170
  },
  {
    id: 10403,
    chapterId: 104,
    parentTopicId: null,
    subject: 'BANGLA',
    topicNo: '৪.৩',
    titleBn: 'একই শব্দের ভিন্ন ভিন্ন পদরূপে ব্যবহার',
    titleEn: 'Functional Shift: Same Word as Different Parts of Speech',
    slug: 'b04-ekoi-shobder-bhinno-podrupe-byabohar',
    difficulty: 'BOARD_STANDARD',
    classLevel: 'Class 8 - 12 (SSC & HSC)',
    summaryBn: 'কোনো শব্দ একা থাকলে তার পদ নির্দিষ্ট করা যায় না; বাক্যে তার প্রয়োগ ও ভূমিকার ওপর ভিত্তি করে একই শব্দ কখনো বিশেষ্য, কখনো বিশেষণ বা ক্রিয়া হতে পারে।',
    definitionBn: 'একই শব্দের পদান্তর বা রূপান্তর: একটি নির্দিষ্ট শব্দ বাক্যের অবস্থান ও অন্যান্য পদের সাথে সম্পর্কের ভিত্তিতে ভিন্ন ভিন্ন পদ হিসেবে গণ্য হতে পারে। যেমন: "ভালো" শব্দটি বাক্যের প্রয়োগভেদে বিশেষ্য, বিশেষণ বা ক্রিয়াবিশেষণ হতে পারে।',
    definitionEn: 'Functional conversion refers to a lexical word functioning as different grammatical categories based on syntactic context and sentence semantics.',
    explanationBn: 'বোর্ড পরীক্ষা ও প্রতিযোগিতামূলক পরীক্ষার সবচেয়ে জনপ্রিয় ট্রিকি অংশ হলো এটি: ১. "ভালো": (ক) বিশেষ্য রূপে: "আপন ভালো সবাই চায়।" (এখানে "ভালো" নাম বা কল্যাণ অর্থে বিশেষ্য)। (খ) বিশেষণ রূপে: "সে একজন ভালো মানুষ।" (মানুষের গুণ প্রকাশ করায় বিশেষণ)। (গ) ক্রিয়াবিশেষণ রূপে: "খবরটা ভালো করে পড়ো।" (পড়ার ধরন বোঝানোয় ক্রিয়াবিশেষণ)। ২. "পাগল": (ক) বিশেষ্য: "পাগলে কিনা বলে।" (খ) বিশেষণ: "পাগল ছেলেটা রাস্তায় ঘুরছে।" ৩. "কাল": (ক) বিশেষ্য: "কাল কারো জন্য বসে থাকে না।" (সময় অর্থে বিশেষ্য)। (খ) বিশেষণ: "কাল সাপটা ছোবল দিল।" (কালো বা বিষাক্ত অর্থে বিশেষণ)। (গ) ক্রিয়াবিশেষণ: "সে কাল আসবে।" (আসার সময় বোঝানোয় ক্রিয়াবিশেষণ)।',
    teacherGoldenTips: 'আলমগীর স্যারের গোল্ডেন প্রশ্ন যাচাই টেকনিক: (১) শব্দটি যদি বাক্যের কর্তা বা কর্ম হয় এবং নাম বোঝায় → বিশেষ্য। (২) শব্দটি যদি অন্য পদের দোষ-গুণ-অবস্থা বোঝায় → বিশেষণ। (৩) শব্দটি যদি ক্রিয়া সংঘটনের ধরন বোঝায় → ক্রিয়াবিশেষণ। সরাসরি শব্দের মুখ দেখে পদ বলা যাবে না, বাক্যে তার কাজ দেখতে হবে!',
    rules: [
      {
        ruleNo: 1,
        nameBn: 'বাক্যে পদের ভূমিকা নির্ণয় সূত্র',
        explanationBn: 'শব্দটি কার দোষ/গুণ বলছে বা কীসের নাম বলছে তা নির্ণয় করে পদ চিহ্নিত করতে হবে।',
        examples: [
          {
            bn: '"ধনীরা সবসময় সুখী হয় না।" এখানে "ধনীরা" বিশেষ্য পদ (ব্যক্তি শ্রেণি বোঝায়)। কিন্তু "ধনী লোক" বললে ধনী হতো বিশেষণ।',
            context: 'শ্রেণিবাচক বিশেষ্য রূপান্তর'
          }
        ]
      }
    ],
    formulas: [
      {
        label: 'পদান্তর যাচাই সূত্র',
        structure: 'নাম বোঝায় → বিশেষ্য | অবস্থা/গুণ বোঝায় → বিশেষণ | ক্রিয়ার ধরন বোঝায় → ক্রিয়াবিশেষণ'
      }
    ],
    examples: [
      {
        bn: '"যাবার বেলা পিছু ডেকো না।" (বেলা = সময় অর্থে বিশেষ্য)',
        context: 'বেলা শব্দের প্রয়োগ'
      },
      {
        bn: '"বেলা বয়ে গেল।" (বেলা = সময় অর্থে বিশেষ্য)',
        context: 'বেলা শব্দের প্রয়োগ'
      }
    ],
    exceptions: [
      {
        titleBn: 'যুগ্ম বা দ্বিরুক্ত শব্দের রূপান্তর',
        descriptionBn: 'শনশন, পড়পড়, থমথম—এগুলো একা শব্দ হিসেবে ধ্বন্যাত্মক হলেও বাক্যে প্রায়শই ক্রিয়াবিশেষণ হিসেবে কাজ করে (যেমন: "শনশন করে বাতাস বইছে")।'
      }
    ],
    commonMistakes: [
      {
        incorrectBn: '"ভালো" শব্দ দেখলেই চোখ বন্ধ করে বিশেষণ লেখা।',
        correctBn: 'বাক্যের অর্থ দেখে নির্ণয় করা; "আপন ভালো সবাই চায়"-এ ভালো হলো বিশেষ্য পদ।',
        explanationBn: 'কারণ এখানে ভালো মানে নিজের কল্যাণ বা স্বার্থ।'
      }
    ],
    writtenPractice: [
      {
        id: 1,
        type: 'IDENTIFICATION',
        prompt: 'নিচের বাক্য দুটিতে "ভালো" শব্দটির পদ নির্ণয় করো: (ক) আপন ভালো সবাই চায়। (খ) রহিম খুব ভালো ছাত্র।',
        correctAnswer: '(ক) "আপন ভালো সবাই চায়"—এখানে "ভালো" বিশেষ্য পদ। (খ) "রহিম খুব ভালো ছাত্র"—এখানে "ভালো" বিশেষণ পদ।',
        explanationBn: 'বাক্যের ভূমিকাভিত্তিক নিখুঁত ব্যাখ্যা।'
      }
    ],
    tags: ['PODANTOR', 'SYNTAX', 'SSC_SPECIAL', 'HSC', 'ADMISSION'],
    status: 'PUBLISHED',
    orderIndex: 3,
    viewCount: 190
  },
  {
    id: 10404,
    chapterId: 104,
    parentTopicId: null,
    subject: 'BANGLA',
    topicNo: '৪.৪',
    titleBn: 'বাক্যে পদ সংস্থাপন রীতি ও অন্বয়',
    titleEn: 'Word Order (Anwaya) & Sentence Syntax',
    slug: 'b04-bakye-pod-shongsthabon-o-onwoy',
    difficulty: 'BOARD_STANDARD',
    classLevel: 'Class 8 - 12 (SSC & HSC)',
    summaryBn: 'বাংলা বাক্যে পদ সাজানোর একটি স্বাভাবিক ক্রম রয়েছে: প্রথমে কর্তা, মাঝে কর্ম এবং শেষে সমাপিকা ক্রিয়া (SOV)। পদের পারস্পরিক সম্পর্ককে অন্বয় বলে।',
    definitionBn: 'পদ সংস্থাপন রীতি (Word Order): বাক্যে বিভিন্ন পদকে সুশৃঙ্খল ও অর্থবোধকভাবে সাজানোর নিয়মকে পদ সংস্থাপন রীতি বলে। অন্বয় (Concord / Agreement): বাক্যের অন্তর্গত পদগুলোর একটির সাথে আরেকটির অর্থগত ও ব্যাকরণিক মিল বা সম্পর্ককে অন্বয় বলে।',
    definitionEn: 'Word order in Bengali typically follows Subject-Object-Verb (SOV). Anwaya refers to the syntactic agreement and logical cohesion among sentence elements.',
    explanationBn: 'বাংলা ভাষার স্বাভাবিক বাক্যের গঠনরীতি হলো: কর্তা (Subject) + কর্ম (Object) + ক্রিয়া (Verb)। যেমন: "আমি (কর্তা) ভাত (কর্ম) খাই (ক্রিয়া)।" ইংরেজিতে যেখানে SVO (I eat rice), বাংলায় সেখানে SOV। তবে কবিতায় বা নাটকীয় প্রয়োজনে পদের ক্রম পরিবর্তিত হতে পারে। বাক্যে বিশেষণের স্থান সাধারণত বিশেষ্যের পূর্বে হয় (যেমন: "জ্ঞানী মানুষ সমাজে সম্মানিত")। সম্বন্ধ পদ সবসময় তার সংশ্লিষ্ট বিশেষ্যের পূর্বে বসে (যেমন: "নদীর জল")। ক্রিয়াবিশেষণ সাধারণত ক্রিয়াপদের আগে বসে (যেমন: "সে দ্রুত হাঁটে")।',
    teacherGoldenTips: 'গঠন মনে রাখার সূত্র: বাংলা = কর্তা + কর্ম + ক্রিয়া (SOV)। ইংরেজি = Subject + Verb + Object (SVO)। বাক্যে "না" বা নিষেধসূচক অব্যয় সাধারণত সমাপিকা ক্রিয়ার পরে বসে (যেমন: "আমি যাব না")। কিন্তু যদি বা শর্ত থাকলে ক্রিয়ার পূর্বে বসে (যেমন: "তুমি যদি না যাও")।',
    rules: [
      {
        ruleNo: 1,
        nameBn: 'বাংলা বাক্যের মৌলিক পদক্রম (SOV)',
        explanationBn: 'কর্তা প্রথমে বসে, মাঝে কর্ম বসে এবং বাক্য সমাপ্ত হয় সমাপিকা ক্রিয়া দিয়ে।',
        examples: [
          {
            bn: 'শিক্ষক (কর্তা) ছাত্রদের (গৌণ কর্ম) ব্যাকরণ (মুখ্য কর্ম) পড়াচ্ছেন (ক্রিয়া)।',
            context: 'দ্বিকর্মক বাক্যের পদক্রম'
          }
        ]
      },
      {
        ruleNo: 2,
        nameBn: 'না-বোধক অব্যয়ের অবস্থান',
        explanationBn: 'সাধারণ বাক্যে "না" সমাপিকা ক্রিয়ার পরে বসে, কিন্তু শর্তমূলক জটিল বাক্যে ক্রিয়ার পূর্বে বসে।',
        examples: [
          {
            bn: 'সে ভাত খায় না (ক্রিয়ার পরে)। তুমি যদি না খাও তবে আমি খাব না (শর্তে ক্রিয়ার আগে)।',
            context: 'না অব্যয়ের স্থান'
          }
        ]
      }
    ],
    formulas: [
      {
        label: 'বাংলা বাক্যের পদক্রম সূত্র',
        structure: 'কর্তা (S) + কর্ম (O) + সমাপিকা ক্রিয়া (V)'
      }
    ],
    examples: [
      {
        bn: 'রবীন্দ্রনাথ গীতাঞ্জলি রচনা করেছেন (কর্তা + কর্ম + ক্রিয়া)',
        context: 'মান বাক্যের গঠন'
      }
    ],
    exceptions: [
      {
        titleBn: 'কাব্যিক বাক্যের ব্যত্যয়',
        descriptionBn: '"মহাভারতের কথা অমৃত সমান, কাশীরাম দাস কহে শুনে পুণ্যবান।" এখানে ছন্দের খাতিরে ক্রিয়া মাঝে বা শুরুতে আসতে পারে।'
      }
    ],
    commonMistakes: [
      {
        incorrectBn: 'আমি খাই ভাত (বাংলা সাধারণ গদ্যে)।',
        correctBn: 'আমি ভাত খাই (কর্তা + কর্ম + ক্রিয়া)।',
        explanationBn: 'ইংরেজি ব্যাকরণের অন্ধ অনুকরণে ক্রিয়া মাঝে দিলে বাংলা পদক্রম নষ্ট হয়।'
      }
    ],
    writtenPractice: [
      {
        id: 1,
        type: 'SHORT_ANSWER',
        prompt: 'বাংলা বাক্যের সাধারণ পদ সংস্থাপন রীতি কী? উদাহরণসহ লিখ।',
        correctAnswer: 'বাংলা বাক্যের সাধারণ পদ সংস্থাপন রীতি হলো: কর্তা + কর্ম + সমাপিকা ক্রিয়া (SOV)। উদাহরণ: "কৃষক জমি চাষ করেন"—এখানে কৃষক (কর্তা), জমি (কর্ম), চাষ করেন (ক্রিয়া)।',
        explanationBn: 'এসএসসি পরীক্ষার বাক্য গঠন অংশের আদর্শ উত্তর।'
      }
    ],
    tags: ['WORD_ORDER', 'SOV', 'SYNTAX', 'ONWOY', 'SSC'],
    status: 'PUBLISHED',
    orderIndex: 4,
    viewCount: 160
  }
];

const CHAPTER_04_MCQS = [
  {
    id: 104001,
    chapterId: 104,
    topicId: 10401,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: 'বাক্যে ব্যবহৃত বিভক্তিযুক্ত শব্দ ও ধাতুকে কী বলে?',
    questionEn: 'What is an inflected word or root used in a sentence called?',
    options: ['পদ', 'উপসর্গ', 'অনুসর্গ', 'প্রাতিপদিক'],
    correctOptionIndex: 0,
    correctAnswerText: 'পদ',
    explanationBn: 'বাক্যে ব্যবহৃত বিভক্তিযুক্ত শব্দ বা ধাতুকে পদ বলে। বিভক্তিহীন শব্দকে প্রাতিপদিক বলে।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'ঢাকা বোর্ড',
    year: 2024,
    examType: 'SSC',
    tags: ['POD', 'DEFINITION', 'DHAKA_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 104002,
    chapterId: 104,
    topicId: 10401,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: 'যে পদে কোনো দৃশ্যমান বিভক্তি থাকে না, সেখানে কোন বিভক্তি থাকে?',
    questionEn: 'Which inflection is present when there is no visible case-ending?',
    options: ['দ্বিতীয়া বিভক্তি', 'শূন্য বিভক্তি', 'তৃতীয়া বিভক্তি', 'সপ্তমী বিভক্তি'],
    correctOptionIndex: 1,
    correctAnswerText: 'শূন্য বিভক্তি',
    explanationBn: 'দৃশ্যমান কোনো বিভক্তি না থাকলে সেখানে প্রথমা বা শূন্য (০) বিভক্তি গণ্য করা হয়।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'রাজশাহী বোর্ড',
    year: 2023,
    examType: 'SSC',
    tags: ['SHUNNO_BIBHOKTI', 'RAJSHAHI_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 104003,
    chapterId: 104,
    topicId: 10402,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: 'রূপ পরিবর্তনের ভিত্তিতে পদ প্রধানত কয় প্রকার?',
    questionEn: 'Based on inflection/declension, how many types of Pod are there?',
    options: ['২ প্রকার', '৩ প্রকার', '৪ প্রকার', '৫ প্রকার'],
    correctOptionIndex: 0,
    correctAnswerText: '২ প্রকার',
    explanationBn: 'রূপ পরিবর্তনের বিচারে পদ প্রধানত ২ প্রকার: সব্যয় পদ (যার রূপ বদলায়) এবং অব্যয় পদ (যার রূপ বদলায় না)।',
    difficulty: 'MEDIUM',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'যশোর বোর্ড',
    year: 2023,
    examType: 'SSC',
    tags: ['SHOBYOY_OBYOY', 'JASHORE_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 104004,
    chapterId: 104,
    topicId: 10402,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: 'সামগ্রিকভাবে বাংলা ভাষায় পদ মোট কয় প্রকার?',
    questionEn: 'Broadly, how many parts of speech are there in Bengali grammar?',
    options: ['৩ প্রকার', '৪ প্রকার', '৫ প্রকার', '৮ প্রকার'],
    correctOptionIndex: 2,
    correctAnswerText: '৫ প্রকার',
    explanationBn: 'বাংলা ভাষায় পদ মোট ৫ প্রকার: বিশেষ্য, বিশেষণ, সর্বনাম, ক্রিয়া এবং অব্যয়।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'কুমিল্লা বোর্ড',
    year: 2024,
    examType: 'SSC',
    tags: ['FIVE_PODS', 'CUMILLA_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 104005,
    chapterId: 104,
    topicId: 10403,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: '"আপন ভালো সবাই চায়"—এখানে "ভালো" কোন পদ?',
    questionEn: 'In "Apon bhalo shobai chay", what part of speech is "bhalo"?',
    options: ['বিশেষণ', 'বিশেষ্য', 'ক্রিয়া', 'অব্যয়'],
    correctOptionIndex: 1,
    correctAnswerText: 'বিশেষ্য',
    explanationBn: 'এখানে "ভালো" শব্দটি দোষ-গুণ না বুঝিয়ে নিজের স্বার্থ বা কল্যাণ নামক অবস্থাকে বোঝাচ্ছে, তাই এটি বিশেষ্য পদ।',
    difficulty: 'HARD',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'চট্টগ্রাম বোর্ড',
    year: 2023,
    examType: 'SSC',
    tags: ['TRICKY', 'FUNCTIONAL_SHIFT', 'CHITTAGONG_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 104006,
    chapterId: 104,
    topicId: 10403,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: '"পাগলে কিনা বলে, ছাগলে কিনা খায়"—এখানে "পাগলে" কোন পদ?',
    questionEn: 'In "Pagole kina bole", what part of speech is "Pagole"?',
    options: ['বিশেষণ পদ', 'বিশেষ্য পদ', 'অব্যয় পদ', 'সর্বনাম পদ'],
    correctOptionIndex: 1,
    correctAnswerText: 'বিশেষ্য পদ',
    explanationBn: 'এখানে "পাগলে" বাক্যের কর্তা বা নাম হিসেবে ব্যক্তি বিশেষকে বোঝাচ্ছে, তাই এটি বিশেষ্য পদ।',
    difficulty: 'MEDIUM',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'দিনাজপুর বোর্ড',
    year: 2024,
    examType: 'SSC',
    tags: ['NOUN_USAGE', 'DINISHPUR_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 104007,
    chapterId: 104,
    topicId: 10404,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: 'বাংলা বাক্যের স্বাভাবিক পদ সংস্থাপন ক্রম কোনটি?',
    questionEn: 'What is the natural word order in a Bengali sentence?',
    options: ['কর্তা + ক্রিয়া + কর্ম (SVO)', 'কর্তা + কর্ম + ক্রিয়া (SOV)', 'কর্ম + কর্তা + ক্রিয়া (OSV)', 'ক্রিয়া + কর্তা + কর্ম (VSO)'],
    correctOptionIndex: 1,
    correctAnswerText: 'কর্তা + কর্ম + ক্রিয়া (SOV)',
    explanationBn: 'বাংলা বাক্যে স্বাভাবিকভাবে প্রথমে কর্তা (Subject), মাঝে কর্ম (Object) এবং শেষে সমাপিকা ক্রিয়া (Verb) বসে (SOV)।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'সিলেট বোর্ড',
    year: 2023,
    examType: 'SSC',
    tags: ['WORD_ORDER', 'SOV', 'SYLHET_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 104008,
    chapterId: 104,
    topicId: 10404,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: 'সাধারণ বাংলা বাক্যে না-বোধক অব্যয় "না" কোথায় বসে?',
    questionEn: 'Where does the negative particle "na" usually sit in an ordinary Bengali sentence?',
    options: ['কর্তার পূর্বে', 'কর্মের পূর্বে', 'সমাপিকা ক্রিয়ার পরে', 'বাক্যের প্রথমে'],
    correctOptionIndex: 2,
    correctAnswerText: 'সমাপিকা ক্রিয়ার পরে',
    explanationBn: 'সাধারণ বাংলা বাক্যে "না" সমাপিকা ক্রিয়ার পরে বসে (যেমন: "আমি যাব না")। শর্তযুক্ত হলে ক্রিয়ার পূর্বে বসে।',
    difficulty: 'MEDIUM',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'ময়মনসিংহ বোর্ড',
    year: 2024,
    examType: 'SSC',
    tags: ['SYNTAX', 'NEGATION', 'MYMENSINGH_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 104009,
    chapterId: 104,
    topicId: 10402,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: 'নিচের কোনটি সব্যয় পদ নয়?',
    questionEn: 'Which of the following is NOT a Subyog (inflected) Pod?',
    options: ['বিশেষ্য', 'সর্বনাম', 'ক্রিয়া', 'অব্যয়'],
    correctOptionIndex: 3,
    correctAnswerText: 'অব্যয়',
    explanationBn: 'অব্যয় পদের কোনো রূপান্তর ঘটে না, তাই এটি সব্যয় পদ নয়। অন্য চারটি সব্যয় পদ।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'PRACTICE',
    isBoardQuestion: false,
    board: null,
    year: null,
    tags: ['OBYOY', 'CLASSIFICATION'],
    status: 'ACTIVE'
  },
  {
    id: 104010,
    chapterId: 104,
    topicId: 10403,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: '"ধনীরা অহংকারী হয়"—এখানে "ধনীরা" কোন পদ?',
    questionEn: 'In "Dhonira ohongkari hoy", what part of speech is "Dhonira"?',
    options: ['বিশেষণ পদ', 'বিশেষ্য পদ', 'সর্বনাম পদ', 'ক্রিয়া পদ'],
    correctOptionIndex: 1,
    correctAnswerText: 'বিশেষ্য পদ',
    explanationBn: '"ধনী" মূলত বিশেষণ হলেও বহুবচনবোধক "রা" বিভক্তি যুক্ত হয়ে সমগ্র ধনী শ্রেণিকে কর্তা হিসেবে বোঝাচ্ছে, তাই এটি বিশেষ্য পদ।',
    difficulty: 'HARD',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'PRACTICE',
    isBoardQuestion: false,
    board: null,
    year: null,
    tags: ['FUNCTIONAL_SHIFT', 'NOUN_FROM_ADJ'],
    status: 'ACTIVE'
  }
];

const CHAPTER_04_MODEL_TEST = {
  id: 10401,
  subject: 'BANGLA',
  chapterId: 104,
  testTitleBn: 'অধ্যায় ০৪ মডেল টেস্ট: পদ ও পদ প্রকরণ',
  testTitleEn: 'Chapter 04 Model Test: Parts of Speech (Pod Prokoron)',
  descriptionBn: 'শব্দ ও পদের পার্থক্য, সব্যয় ও অব্যয় পদ, একই শব্দের পদান্তর এবং বাক্য সংস্থাপন রীতির ওপর পূর্ণাঙ্গ বোর্ড স্ট্যান্ডার্ড মডেল টেস্ট।',
  durationMinutes: 15,
  totalMarks: 10,
  passPercentage: 60,
  difficulty: 'MEDIUM',
  questionCount: 10,
  questionIds: [104001, 104002, 104003, 104004, 104005, 104006, 104007, 104008, 104009, 104010],
  status: 'PUBLISHED'
};

module.exports = {
  CHAPTER_04_TOPICS,
  CHAPTER_04_MCQS,
  CHAPTER_04_MODEL_TEST
};
