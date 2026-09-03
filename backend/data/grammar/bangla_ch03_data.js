/**
 * Bangla Grammar Chapter 03: শব্দ ও শব্দের শ্রেণিবিভাগ (Words & Classification of Words)
 * Comprehensive, Exam-Oriented Educational Content for SSC, HSC & Admission
 */

const CHAPTER_03_TOPICS = [
  {
    id: 10301,
    chapterId: 103,
    parentTopicId: null,
    subject: 'BANGLA',
    topicNo: '৩.১',
    titleBn: 'শব্দের সংজ্ঞা, স্বরূপ ও প্রাতিপদিক',
    titleEn: 'Definition, Nature of Words & Pratipadik',
    slug: 'b03-shobdo-shongpga-o-pratipadik',
    difficulty: 'BEGINNER',
    classLevel: 'Class 6 - 12 (SSC & HSC)',
    summaryBn: 'এক বা একাধিক অর্থপূর্ণ ধ্বনির মিলনে যখন কোনো নির্দিষ্ট ভাব বা ধারণা প্রকাশ পায়, তাকে শব্দ বলে। বিভক্তিহীন নাম শব্দকে প্রাতিপদিক বলে।',
    definitionBn: 'শব্দ (Word): এক বা একাধিক ধ্বনি মিলিত হয়ে যদি কোনো নির্দিষ্ট অর্থ প্রকাশ করে, তবে তাকে শব্দ বলে। ভাষার মূল উপাদান ধ্বনি হলেও অর্থপূর্ণ একক হলো শব্দ। প্রাতিপদিক (Pratipadik): বিভক্তিহীন নাম শব্দকে প্রাতিপদিক বলে (যেমন: হাত, বই, কলম)।',
    definitionEn: 'A word is a speech sound or combination of sounds that possesses an independent meaning. A nominal base without any case-ending/inflection is called Pratipadik.',
    explanationBn: 'অর্থই শব্দের প্রাণ। অর্থহীন এলোমেলো ধ্বনিগুচ্ছ কখনো শব্দ হতে পারে না। যেমন: "ল + ম + ক = লমক" কোনো শব্দ নয়, কিন্তু "ক + ল + ম = কলম" একটি অর্থপূর্ণ শব্দ। শব্দকে যখন বাক্যে ব্যবহারের উপযোগী করতে বিভক্তি যোগ করা হয়, তখন তা পদে পরিণত হয়। শব্দের বিভক্তিহীন প্রাথমিক রূপটিই হলো প্রাতিপদিক। প্রাতিপদিকের সাথে বিভক্তি, উপসর্গ বা প্রত্যয় যোগ হয়ে নতুন নতুন পদ ও শব্দ গঠিত হয়।',
    teacherGoldenTips: 'পরীক্ষার প্রশ্ন: (১) ভাষার অর্থপূর্ণ ক্ষুদ্রতম একক কোনটি? → শব্দ। (২) বিভক্তিহীন নাম শব্দকে কী বলে? → প্রাতিপদিক। (৩) ধাতু কাকে বলে? → ক্রিয়ার মূল অবিভাজ্য অংশকে ধাতু বা ক্রিয়ামূল বলে।',
    rules: [
      {
        ruleNo: 1,
        nameBn: 'অর্থপূর্ণতাই শব্দের মূল শর্ত',
        explanationBn: 'ধ্বনিসমষ্টির সাথে অবশ্যই সুনির্দিষ্ট অভিধানসম্মত অর্থ বা ভাবদ্যোতকতা থাকতে হবে।',
        examples: [
          {
            bn: 'জল, বাতাস, মাটি, আগুন (সবকটি অর্থপূর্ণ শব্দ)।',
            context: 'অর্থপূর্ণ ধ্বনিসমষ্টি'
          }
        ]
      },
      {
        ruleNo: 2,
        nameBn: 'প্রাতিপদিক চেনার নিয়ম',
        explanationBn: 'শব্দটিতে কোনো প্রকার কারক-বিভক্তি (যেমন: এ, য়, তে, কে, রে, র, এর) যুক্ত থাকবে না।',
        examples: [
          {
            bn: '"গাছ" হলো প্রাতিপদিক; কিন্তু "গাছে" (গাছ + এ) হলো পদ।',
            context: 'প্রাতিপদিক বনাম পদের রূপান্তর',
            highlight: 'গাছ (প্রাতিপদিক) → গাছে (পদ)'
          }
        ]
      }
    ],
    formulas: [
      {
        label: 'শব্দ বনাম পদের সমীকরণ',
        structure: 'ধ্বনি + অর্থ = শব্দ | শব্দ + বিভক্তি = পদ | বিভক্তিহীন শব্দ = প্রাতিপদিক'
      }
    ],
    examples: [
      {
        bn: 'বই, খাতা, আকাশ, নদী (প্রাতিপদিকের আদর্শ উদাহরণ)',
        context: 'বিভক্তিহীন নাম শব্দ'
      }
    ],
    exceptions: [
      {
        titleBn: 'ধ্বন্যাত্মক শব্দ ও অনুকার শব্দ',
        descriptionBn: 'কটকট, ঝমঝম, শনশন—এসব ধ্বনির নিজস্ব বস্তুগত অর্থ না থাকলেও অনুভূতির ব্যঞ্জনা থাকায় ব্যাকরণে বিশেষ শব্দ হিসেবে গ্রাহ্য হয়।'
      }
    ],
    commonMistakes: [
      {
        incorrectBn: 'বাক্যে ব্যবহৃত সব শব্দকেই প্রাতিপদিক বলে।',
        correctBn: 'বাক্যে ব্যবহৃত হলে তা পদ হয়ে যায়। বিভক্তিহীন নাম শব্দকে কেবল প্রাতিপদিক বলে।',
        explanationBn: 'বাক্যে স্থান পেলে বিভক্তিযুক্ত শব্দ পদ হয়।'
      }
    ],
    writtenPractice: [
      {
        id: 1,
        type: 'DEFINITION',
        prompt: 'প্রাতিপদিক কাকে বলে? দুটি উদাহরণ দাও।',
        correctAnswer: 'বিভক্তিহীন নাম শব্দকে প্রাতিপদিক বলে। উদাহরণ: "কলম", "বই"।',
        explanationBn: 'বোর্ডের ক-অংশের অত্যন্ত জনপ্রিয় ২ নম্বরের প্রশ্ন।'
      }
    ],
    tags: ['SHOBDO', 'PRATIPADIK', 'FOUNDATION', 'SSC', 'HSC'],
    status: 'PUBLISHED',
    orderIndex: 1,
    viewCount: 150
  },
  {
    id: 10302,
    chapterId: 103,
    parentTopicId: null,
    subject: 'BANGLA',
    topicNo: '৩.২',
    titleBn: 'উৎস বা উৎপত্তি অনুসারে শব্দের শ্রেণিবিভাগ',
    titleEn: 'Classification of Words by Etymological Origin (Tatsama, Tadbhava, etc.)',
    slug: 'b03-utsho-onushare-shobdo-shrenibibhag',
    difficulty: 'BOARD_STANDARD',
    classLevel: 'Class 8 - 12 (SSC & HSC)',
    summaryBn: 'উৎস বা উৎপত্তি অনুসারে বাংলা শব্দভাণ্ডারকে ৫ ভাগে ভাগ করা হয়: তৎসম, অর্ধ-তৎসম, তদ্ভব (খাঁটি বাংলা), দেশি ও বিদেশি শব্দ।',
    definitionBn: 'উৎস অনুসারে বাংলা শব্দ পাঁচ প্রকার: ১. তৎসম শব্দ: সংস্কৃত ভাষা থেকে যেসব শব্দ অপরিবর্তিত রূপে সরাসরি বাংলায় এসেছে (তৎ=তার, সম=সমান)। ২. অর্ধ-তৎসম শব্দ: সংস্কৃত থেকে কিছুটা বিকৃত বা পরিবর্তিত হয়ে বাংলায় এসেছে। ৩. তদ্ভব শব্দ: সংস্কৃত থেকে প্রাকৃতের মধ্য দিয়ে রূপান্তরিত হয়ে সম্পূর্ণ খাঁটি বাংলায় পরিণত হয়েছে (তৎ=তার, ভব=উৎপন্ন)। ৪. দেশি শব্দ: বাংলার প্রাচীন আদিবাসীদের (কোল, মুণ্ডা, দ্রাবিড়) ভাষা থেকে আগত শব্দ। ৫. বিদেশি শব্দ: রাজনৈতিক, ধর্মীয় ও বাণিজ্যিক কারণে ভিনদেশি ভাষা থেকে গৃহীত শব্দ।',
    definitionEn: 'Based on etymological origin, Bengali vocabulary is classified into 5 categories: Tatsama (direct Sanskrit), Ardha-Tatsama (semi-Sanskrit), Tadbhava (derived/pure Bengali), Deshi (indigenous), and Bideshi (foreign loanwords).',
    explanationBn: 'বোর্ড পরীক্ষা ও সকল চাকরির পরীক্ষায় এই টপিক থেকে সর্বাধিক প্রশ্ন আসে: ১. তৎসম শব্দ: চন্দ্র, সূর্য, নক্ষত্র, ভবন, ধর্ম, পাত্র, মনুষ্য। ২. অর্ধ-তৎসম শব্দ: জোছনা (জ্যোৎস্না থেকে), ছেরাদ্দ (শ্রাদ্ধ থেকে), গিন্নি (গৃহিণী থেকে), বোষ্টম (বৈষ্ণব থেকে), কুচ্ছিত (কুৎসিত থেকে)। ৩. তদ্ভব (খাঁটি বাংলা): হস্ত → হত্থ → হাত; চর্মকার → চম্মআর → চামার; পদ → পঅ → পা। ৪. দেশি শব্দ: কুলা, গঞ্জ, চোঙ্গা, টোপর, ডাব, ডাগর, ঢেঁকি, পেট (উদর), কুঁড়ে। ৫. বিদেশি শব্দ: (ক) আরবি: আল্লাহ, কুরআন, আদালত, উকিল, এজলাস, ইনসান, কলম, কিতাব। (খ) ফারসি: খোদা, নামাজ, রোজা, চশমা, দোকান, কারখানা, তারিখ। (গ) পর্তুগিজ: আনারস, আলপিন, আলমারি, গির্জা, চাবি, পাউরুটি, পাদ্রি, বালতি। (ঘ) ফরাসি: কার্তুজ, কুপন, ডিপো, রেস্তোরাঁ। (ঙ) ওলন্দাজ: ইস্কাপন, তেক্কা, তুরুপ, রুইতন (তাসের নাম)। (চ) ইংরেজি: চেয়ার, টেবিল, স্কুল, কলেজ। (ছ) তুর্কি: দারোগা, বন্দুক, বারুদ, বেগম, চাকর, কাঁচি।',
    teacherGoldenTips: 'আলমগীর স্যারের মেগা শর্টকাট টেকনিক: (১) পর্তুগিজ শব্দ মনে রাখার ছন্দ: "পাদ্রি ও কেরানি গির্জায় গিয়ে চাবি দিয়ে আলমারি খুলে আনারস, পাউরুটি ও বালতি ভর্তি আলপিন রাখল!" (২) ওলন্দাজ শব্দ: তাসের চার রঙ (ইস্কাপন, তেক্কা, তুরুপ, রুইতন)। (৩) তুর্কি শব্দ: "বেগম চাকরকে নিয়ে কাঁচি ও বন্দুকের বারুদ দিয়ে দারোগাকে মারল!" (৪) দেশি শব্দ: "ঢেঁকি, কুলা, ডাব, টোপর, পেট"।',
    rules: [
      {
        ruleNo: 1,
        nameBn: 'তদ্ভব শব্দের বিবর্তন সূত্র',
        explanationBn: 'তদ্ভব শব্দ তিনটি স্তর অতিক্রম করে বাংলায় প্রবেশ করে: মূল সংস্কৃত → প্রাকৃত রূপ → আধুনিক বাংলা রূপ।',
        examples: [
          {
            bn: 'সংস্কৃত: মৎস্য → প্রাকৃত: মচ্ছ → তদ্ভব: মাছ।',
            context: 'তদ্ভব বিবর্তন',
            highlight: 'মৎস্য → মচ্ছ → মাছ'
          },
          {
            bn: 'সংস্কৃত: কর্মকার → প্রাকৃত: কন্মআর → তদ্ভব: কামার।',
            context: 'তদ্ভব বিবর্তন'
          }
        ]
      },
      {
        ruleNo: 2,
        nameBn: 'অর্ধ-তৎসম শব্দের চেনার উপায়',
        explanationBn: 'মূল সংস্কৃত শব্দের কিঞ্চিৎ বিকৃত কথ্য রূপই হলো অর্ধ-তৎসম।',
        examples: [
          {
            bn: 'জ্যোৎস্না → জোছনা, গৃহিণী → গিন্নি, নিমন্ত্রণ → নেমন্তন্ন।',
            context: 'অর্ধ-তৎসম রূপান্তর'
          }
        ]
      }
    ],
    formulas: [
      {
        label: 'উৎসভিত্তিক শব্দ সূত্র',
        structure: 'তৎসম (অপরিবর্তিত) | অর্ধ-তৎসম (কিঞ্চিৎ বিকৃত) | তদ্ভব (প্রাকৃত হয়ে রূপান্তরিত) | দেশি (আদিবাসী) | বিদেশি (বিদেশাগত)'
      }
    ],
    examples: [
      {
        bn: 'হাত, পা, কান, নাক, ভাত, মাছ (খাঁটি বাংলা বা তদ্ভব শব্দ)',
        context: 'তদ্ভব শব্দ'
      },
      {
        bn: 'আনারস, আলমারি, চাবি, পাউরুটি (পর্তুগিজ শব্দ)',
        context: 'বিদেশি শব্দ'
      }
    ],
    exceptions: [
      {
        titleBn: 'মিশ্র শব্দ বা সংকর শব্দ (Hybrid Words)',
        descriptionBn: 'ভিন্ন ভিন্ন ভাষার শব্দ বা প্রত্যয় মিলে গঠিত শব্দকে মিশ্র শব্দ বলে। যেমন: রাজা-বাদশা (তৎসম+ফারসি), হেড-মৌলভী (ইংরেজি+ফারসি), হাট-বাজার (বাংলা+ফারসি), পকেটমার (ইংরেজি+বাংলা)।'
      }
    ],
    commonMistakes: [
      {
        incorrectBn: 'আনারস ও আলমারি খাঁটি বাংলা দেশি শব্দ।',
        correctBn: 'আনারস ও আলমারি পর্তুগিজ ভাষা থেকে বাংলায় এসেছে।',
        explanationBn: 'পর্তুগিজ নাবিক ও বণিকদের মাধ্যমে এই শব্দগুলো বাংলায় প্রবেশ করেছে।'
      },
      {
        incorrectBn: 'তদ্ভব এবং তৎসম একই অর্থ বহন করে।',
        correctBn: 'তৎসম হলো অপরিবর্তিত সংস্কৃত, তদ্ভব হলো প্রাকৃত হয়ে পরিবর্তিত রূপ।',
        explanationBn: 'তৎসম=চন্দ্র, তদ্ভব=চাঁদ।'
      }
    ],
    writtenPractice: [
      {
        id: 1,
        type: 'CLASSIFICATION',
        prompt: 'নিচের শব্দগুলোর উৎস নির্ণয় করো: গিন্নি, আনারস, ঢেঁকি, নক্ষত্র, হাত।',
        correctAnswer: 'গিন্নি (অর্ধ-তৎসম), আনারস (পর্তুগিজ/বিদেশি), ঢেঁকি (দেশি), নক্ষত্র (তৎসম), হাত (তদ্ভব/খাঁটি বাংলা)।',
        explanationBn: 'বোর্ড পরীক্ষায় অত্যন্ত কমন শ্রেণিবিভাগ প্রশ্ন।'
      },
      {
        id: 2,
        type: 'DEFINITION',
        prompt: 'তদ্ভব শব্দ কাকে বলে? উদাহরণসহ বুঝিয়ে দাও।',
        correctAnswer: 'যেসব শব্দের মূল সংস্কৃত ভাষায় পাওয়া যায়, কিন্তু প্রাকৃত ভাষার মাধ্যমে স্বাভাবিক বিবর্তনের ধারায় পরিবর্তিত হয়ে আধুনিক বাংলা ভাষায় স্থান করে নিয়েছে, তাদের তদ্ভব বা খাঁটি বাংলা শব্দ বলে। যেমন: সংস্কৃত "হস্ত" → প্রাকৃত "হত্থ" → তদ্ভব "হাত"।',
        explanationBn: 'তদ্ভব শব্দের তিনটি স্তর উল্লেখ করা বাধ্যতামূলক।'
      }
    ],
    tags: ['UTSHO', 'TATSAMA', 'TADBHAVA', 'DESHI', 'BIDESHI', 'SSC', 'HSC', 'ADMISSION'],
    status: 'PUBLISHED',
    orderIndex: 2,
    viewCount: 310
  },
  {
    id: 10303,
    chapterId: 103,
    parentTopicId: null,
    subject: 'BANGLA',
    topicNo: '৩.৩',
    titleBn: 'গঠন অনুসারে শব্দের শ্রেণিবিভাগ',
    titleEn: 'Classification of Words by Structural Formation (Mowlik & Sadhito)',
    slug: 'b03-gothon-onushare-shobdo-shrenibibhag',
    difficulty: 'BOARD_STANDARD',
    classLevel: 'Class 8 - 12 (SSC & HSC)',
    summaryBn: 'গঠন অনুসারে বাংলা শব্দকে প্রধানত দুই ভাগে ভাগ করা হয়: ১. মৌলিক শব্দ এবং ২. সাধিত শব্দ।',
    definitionBn: 'মৌলিক শব্দ (Primary/Root Words): যেসব শব্দকে আর কোনোভাবে ভেঙে বা বিশ্লেষণ করে আলাদা অর্থবোধক অংশ পাওয়া যায় না, তাদের মৌলিক শব্দ বলে। সাধিত শব্দ (Derivative/Complex Words): যেসব শব্দকে বিশ্লেষণ করলে আলাদা অর্থবোধক শব্দ বা শব্দাংশ পাওয়া যায়, তাদের সাধিত শব্দ বলে। সাধিত শব্দ সাধারণত উপসর্গ, প্রত্যয় বা সমাসের সাহায্যে গঠিত হয়।',
    definitionEn: 'Based on structural formation, words are categorized into Root/Primary words (Mowlik) which cannot be further decomposed, and Derived words (Sadhito) formed via prefixes, suffixes, and compounding.',
    explanationBn: 'মৌলিক শব্দ হলো ভাষার মূল ভিত্তি। যেমন: গোলাপ, লাল, নাক, কান, তিন, বই। এই শব্দগুলোকে ভাঙলে কেবল অর্থহীন বিচ্ছিন্ন ধ্বনি পাওয়া যায়, কোনো পৃথক অর্থ দাঁড়ায় না। অন্যদিকে সাধিত শব্দ অন্য শব্দ বা ধাতুর সমন্বয়ে তৈরি হয়। সাধিত শব্দ প্রধানত তিন প্রক্রিয়ায় গঠিত হয়: ১. উপসর্গ যোগে সাধিত শব্দ: প্র + হার = প্রহার, পরি + পূর্ণ = পরিপূর্ণ। ২. প্রত্যয় যোগে সাধিত শব্দ: চল্ + অন্ত = চলন্ত, ঢাকা + আই = ঢাকাই, মিতালী (মিতা + আলী)। ৩. সমাস নিষ্পন্ন সাধিত শব্দ: নদী মাতা যার = নদীমাতৃক, সিংহ চিহ্নিত আসন = সিংহাসন। এছাড়া সন্ধি এবং দ্বিরুক্তির মাধ্যমেও সাধিত শব্দ তৈরি হয়।',
    teacherGoldenTips: 'পরীক্ষার টেকনিক: (১) মৌলিক শব্দ চেনার উপায়: শব্দটিকে ভেঙে যদি কোনো অর্থযুক্ত মূল না পাওয়া যায়, তবে তা মৌলিক (যেমন: হাত, গোলাপ, লাল)। (২) সাধিত শব্দ চেনার উপায়: ভাঙলে প্রত্যয় (চলন্ত), উপসর্গ (প্রবাস), সমাস (চাঁদমুখ) বা সন্ধি পাওয়া যাবে।',
    rules: [
      {
        ruleNo: 1,
        nameBn: 'মৌলিক শব্দের অবিভাজ্য রূপ',
        explanationBn: 'মৌলিক শব্দের কোনো প্রত্যয় বা উপসর্গ থাকে না, এটি স্বয়ংসম্পূর্ণ।',
        examples: [
          {
            bn: '"গোলাপ" একটি মৌলিক শব্দ। "গো" বা "লাপ" আলাদা অর্থ বহন করে না।',
            context: 'অবিভাজ্যতার প্রমাণ'
          }
        ]
      },
      {
        ruleNo: 2,
        nameBn: 'সাধিত শব্দ গঠনের ৩টি প্রধান উপায়',
        explanationBn: 'উপসর্গ যোগে (শব্দের পূর্বে বসে), প্রত্যয় যোগে (শব্দের বা ধাতুর পরে বসে) এবং সমাসের সাহায্যে (একাধিক পদ একপদীকরণে)।',
        examples: [
          {
            bn: 'উপসর্গ: অনু + গামন = অনুগমন। প্রত্যয়: ডুব্ + আরি = ডুবুরি। সমাস: নীল যে পদ্ম = নীলপদ্ম।',
            context: 'গঠন প্রক্রিয়ার বৈচিত্র্য'
          }
        ]
      }
    ],
    formulas: [
      {
        label: 'সাধিত শব্দ সমীকরণ',
        structure: 'উপসর্গ + মূল শব্দ = সাধিত | মূল ধাতু/শব্দ + প্রত্যয় = সাধিত | সমাসবদ্ধ পদ = সাধিত'
      }
    ],
    examples: [
      {
        bn: 'হাত, পা, লাল, তিন (মৌলিক শব্দ)',
        context: 'মৌলিক শব্দের তালিকা'
      },
      {
        bn: 'হাতল (হাত+ল), চলন্ত (চল্+অন্ত), নীলকণ্ঠ (নীল কণ্ঠ যার) (সাধিত শব্দ)',
        context: 'সাধিত শব্দের তালিকা'
      }
    ],
    exceptions: [
      {
        titleBn: 'সংখ্যাবাচক মৌলিক শব্দ',
        descriptionBn: 'এক, দুই, তিন, চার, পাঁচ—এগুলো মৌলিক শব্দ; কিন্তু "বাইশ" (দুই + বিশ) বা "চৌদ্দ" সাধিত রূপ হিসেবে গণ্য হতে পারে।'
      }
    ],
    commonMistakes: [
      {
        incorrectBn: '"নীলপদ্ম" একটি মৌলিক শব্দ কারণ পদ্মটি নীল।',
        correctBn: '"নীলপদ্ম" সমাসবদ্ধ সাধিত শব্দ (নীল যে পদ্ম)।',
        explanationBn: 'একাধিক পদ একপদী হয়ে গঠিত শব্দ সবসময় সাধিত শব্দ।'
      }
    ],
    writtenPractice: [
      {
        id: 1,
        type: 'CLASSIFICATION',
        prompt: 'নিচের শব্দগুলোকে মৌলিক ও সাধিত শব্দে বিভক্ত করো: বই, মেঘলা, লাল, প্রশাসন, ডুবুরি।',
        correctAnswer: 'মৌলিক শব্দ: বই, লাল। সাধিত শব্দ: মেঘলা (মেঘ+লা), প্রশাসন (প্র+শাসন), ডুবুরি (ডুব্+উরি)।',
        explanationBn: 'ভেঙে অর্থ পরীক্ষা করে নির্ণয়।'
      }
    ],
    tags: ['GOTHON', 'MOWLIK', 'SADHITO', 'PREFIX', 'SUFFIX', 'SSC'],
    status: 'PUBLISHED',
    orderIndex: 3,
    viewCount: 200
  },
  {
    id: 10304,
    chapterId: 103,
    parentTopicId: null,
    subject: 'BANGLA',
    topicNo: '৩.৪',
    titleBn: 'অর্থ অনুসারে শব্দের শ্রেণিবিভাগ (যৌগিক, রূঢ় ও যোগরূঢ়)',
    titleEn: 'Classification of Words by Meaning (Yowgik, Rurho, Yogorurho)',
    slug: 'b03-ortho-onushare-shobdo-shrenibibhag',
    difficulty: 'BOARD_STANDARD',
    classLevel: 'Class 8 - 12 (SSC & HSC)',
    summaryBn: 'অর্থ অনুসারে বাংলা শব্দ তিন প্রকার: ১. যৌগিক শব্দ (ব্যুৎপত্তিগত ও ব্যবহারিক অর্থ অভিন্ন), ২. রূঢ় শব্দ (ব্যুৎপত্তি ছেড়ে বিশিষ্ট অর্থে ব্যবহৃত), ৩. যোগরূঢ় শব্দ (সমাসনিষ্পন্ন হয়ে বিশিষ্ট অর্থে সীমাবদ্ধ)।',
    definitionBn: 'যৌগিক শব্দ: যেসব শব্দের ব্যুৎপত্তিগত অর্থ (প্রকৃতি-প্রত্যয়জাত অর্থ) এবং ব্যবহারিক অর্থ একই রকম হয়, তাদের যৌগিক শব্দ বলে। রূঢ় বা রূঢ়ি শব্দ: যেসব শব্দ প্রত্যয় বা উপসর্গযোগে গঠিত হলেও ব্যুৎপত্তিগত অর্থ না বুঝিয়ে অন্য কোনো বিশেষ অর্থ প্রকাশ করে, তাদের রূঢ় শব্দ বলে। যোগরূঢ় শব্দ: সমাস নিষ্পন্ন যে সকল শব্দ সম্পূর্ণ ব্যাসবাক্যের অনুগামী না হয়ে কোনো নির্দিষ্ট বা বিশিষ্ট অর্থ প্রকাশ করে, তাদের যোগরূঢ় শব্দ বলে।',
    definitionEn: 'By semantic meaning, words are categorized into Yowgik (etymological meaning equals conventional meaning), Rurho (conventional meaning diverges from etymological roots via affixes), and Yogorurho (compound words whose meaning narrows down to a specialized entity).',
    explanationBn: 'বোর্ড পরীক্ষায় এটি অন্যতম সেরা ট্র্যাপ টপিক: ১. যৌগিক শব্দ: গায়ক (গৈ + অক = যে গান করে), কর্তব্য (কৃ + তব্য = যা করা উচিত), বাবুয়ানা (বাবু + আনা = বাবুর ভাব), দৌহিত্র (দুহিতা + ষ্ণ্য = কন্যার পুত্র), মধুর (মধু + র = মধুর মতো মিষ্টি)। এখানে ব্যুৎপত্তি ও ব্যবহারিক অর্থ হুবহু মিলে যায়। ২. রূঢ় বা রূঢ়ি শব্দ: হস্তী (হস্ত + ইন = যার হাত আছে; কিন্তু অর্থ হাতওয়ালা যে কেউ নয়, বিশেষ একটি পশু হাতি), বাঁশি (বাশঁ + ই = বাঁশ দিয়ে তৈরি যেকোনো বস্তু নয়, সুরের বিশেষ বাদ্যযন্ত্র), সন্দেশ (সম্ + দেশ = সংবাদ; কিন্তু প্রচলিত অর্থ মিষ্টান্ন বিশেষ), প্রবীণ (প্র + বীণ = যে ভালো বীণা বাজাতে পারে; কিন্তু অর্থ বয়োবৃদ্ধ ব্যক্তি), তৈল (তিল + অ = তিলের নির্যাস; কিন্তু অর্থ যেকোনো উদ্ভিজ্জ বা খনিজ তেল)। ৩. যোগরূঢ় শব্দ: পঙ্কজ (পঙ্কে জন্মে যা = পদ্মফুল, যদিও শ্যাওলা বা শামুকও পাকে জন্মে), রাজপুত (রাজার পুত্র নয়, বিশেষ একটি জাতি), জলধি (জল ধারণ করে যা = সমুদ্র), মহাযাত্রা (বিশাল যাত্রা নয়, মৃত্যু)।',
    teacherGoldenTips: 'ম্যাজিক ফর্মুলা: (১) যৌগিক: গায়ক, কর্তব্য, দৌহিত্র, বাবুয়ানা, মধুর (অর্থ বদলায় না)। (২) রূঢ়: হস্তী, বাঁশি, সন্দেশ, প্রবীণ, তৈল, গবেষণা (প্রত্যয়যোগে অর্থ পুরোপুরি বদলে যায়)। (৩) যোগরূঢ়: পঙ্কজ, রাজপুত, জলধি, মহাযাত্রা (সমাসযোগে নির্দিষ্ট বস্তুকে বোঝায়)। এই তালিকা থেকে সরাসরি প্রশ্ন আসবে!',
    rules: [
      {
        ruleNo: 1,
        nameBn: 'রূঢ় বনাম যোগরূঢ় চেনার মূল পার্থক্য',
        explanationBn: 'রূঢ় শব্দ গঠিত হয় প্রত্যয় বা উপসর্গ দিয়ে। যোগরূঢ় শব্দ গঠিত হয় সমাস দিয়ে।',
        examples: [
          {
            bn: 'সন্দেশ (সম্ + দেশ) হলো রূঢ় শব্দ (উপসর্গযোগে গঠিত)। পঙ্কজ (পঙ্কে জন্মে যা) হলো যোগরূঢ় শব্দ (উপপদ তৎপুরুষ সমাসযোগে গঠিত)।',
            context: 'গঠনগত উৎস থেকে প্রকার নির্ণয়',
            highlight: 'রূঢ় = প্রত্যয়/উপসর্গ | যোগরূঢ় = সমাস'
          }
        ]
      }
    ],
    formulas: [
      {
        label: 'অর্থগত শব্দ নির্ণয় সূত্র',
        structure: 'ব্যুৎপত্তি = ব্যবহারিক → যৌগিক | প্রত্যয়যোগে বিশেষ অর্থ → রূঢ় | সমাসযোগে নির্দিষ্ট অর্থ → যোগরূঢ়'
      }
    ],
    examples: [
      {
        bn: 'গায়ক, কর্তব্য, বাবুয়ানা (যৌগিক শব্দ)',
        context: 'ব্যুৎপত্তি ও ব্যবহার এক'
      },
      {
        bn: 'হস্তী, বাঁশি, সন্দেশ, প্রবীণ (রূঢ় শব্দ)',
        context: 'প্রত্যয় সাধিত বিশিষ্ট অর্থ'
      },
      {
        bn: 'পঙ্কজ, জলধি, মহাযাত্রা, রাজপুত (যোগরূঢ় শব্দ)',
        context: 'সমাস সাধিত বিশিষ্ট অর্থ'
      }
    ],
    exceptions: [
      {
        titleBn: '"গবেষণা" শব্দের ব্যুৎপত্তি',
        descriptionBn: 'গো + এষণা = গরু খোঁজা; কিন্তু ব্যবহারিক অর্থ ব্যাপক পড়াশোনা ও বৈজ্ঞানিক অনুসন্ধান। এটি একটি খাঁটি রূঢ় শব্দ।'
      }
    ],
    commonMistakes: [
      {
        incorrectBn: '"পঙ্কজ" একটি রূঢ় শব্দ।',
        correctBn: '"পঙ্কজ" একটি যোগরূঢ় শব্দ।',
        explanationBn: 'কারণ এটি উপপদ তৎপুরুষ সমাস নিষ্পন্ন শব্দ (পঙ্কে জন্মে যা)।'
      },
      {
        incorrectBn: '"সন্দেশ" শব্দের ব্যুৎপত্তিগত অর্থ মিষ্টি।',
        correctBn: '"সন্দেশ" শব্দের ব্যুৎপত্তিগত অর্থ সংবাদ, ব্যবহারিক অর্থ মিষ্টি।',
        explanationBn: 'ব্যুৎপত্তি হলো সংবাদ (সংবাদ নিয়ে যাওয়ার উপহার)।'
      }
    ],
    writtenPractice: [
      {
        id: 1,
        type: 'DIFFERENCE',
        prompt: 'রূঢ় ও যোগরূঢ় শব্দের মধ্যে উদাহরণসহ পার্থক্য বুঝিয়ে দাও।',
        correctAnswer: 'রূঢ় শব্দ প্রত্যয় বা উপসর্গযোগে গঠিত হয়ে ব্যুৎপত্তিগত অর্থ ত্যাগ করে বিশিষ্ট অর্থ প্রকাশ করে (যেমন: হস্তী = হাতি, সন্দেশ = মিষ্টান্ন)। পক্ষান্তরে যোগরূঢ় শব্দ সমাসযোগে গঠিত হয়ে ব্যাসবাক্যের অর্থ ত্যাগ করে একটি নির্দিষ্ট বস্তুকে বোঝায় (যেমন: পঙ্কজ = পদ্মফুল, রাজপুত = একটি বিশেষ জাতি)।',
        explanationBn: 'গঠনপদ্ধতি ও অর্থ উভয়ের সুস্পষ্ট পার্থক্য উপস্থাপন।'
      }
    ],
    tags: ['YOWGIK', 'RURHO', 'YOGORURHO', 'SEMANTICS', 'SSC', 'HSC', 'ADMISSION'],
    status: 'PUBLISHED',
    orderIndex: 4,
    viewCount: 280
  },
  {
    id: 10305,
    chapterId: 103,
    parentTopicId: null,
    subject: 'BANGLA',
    topicNo: '৩.৫',
    titleBn: 'শব্দের অর্থভেদ ও প্রয়োগিক শুদ্ধতা',
    titleEn: 'Homonyms, Semantic Nuances & Usage Accuracy',
    slug: 'b03-shobder-orthobhed-o-shuddhota',
    difficulty: 'BOARD_STANDARD',
    classLevel: 'Class 8 - 12 (SSC & HSC)',
    summaryBn: 'উচ্চারণ এক কিন্তু বানানে ও অর্থে ভিন্ন এমন শব্দকে সমোচ্চারিত ভিন্নার্থক শব্দ বলে। ভাষায় এদের সঠিক প্রয়োগ না করলে অর্থ বিপর্যয় ঘটে।',
    definitionBn: 'সমোচ্চারিত ভিন্নার্থক শব্দ: যে সকল শব্দ উচ্চারণের দিক থেকে প্রায় একই রকম বা অভিন্ন কিন্তু বানান ও অর্থের দিক থেকে সম্পূর্ণ ভিন্ন, তাদের সমোচ্চারিত ভিন্নার্থক শব্দ বলে। যেমন: কূল (তীর/কিনারা) বনাম কুল (বংশ/ফলবিশেষ)।',
    definitionEn: 'Homonyms and homophones are words that sound identical or nearly identical in pronunciation but have distinct spellings and meanings.',
    explanationBn: 'বাংলা ভাষায় হ্রস্ব-ই/দীর্ঘ-ঈ, হ্রস্ব-উ/দীর্ঘ-ঊ, দন্ত্য-ন/মূর্ধন্য-ণ, এবং দন্ত্য-স/মূর্ধন্য-ষ-এর ভিন্নতার কারণে বহু সমোচ্চারিত ভিন্নার্থক শব্দ রয়েছে: ১. অনীহা (উদাসীনতা) বনাম অনিহা (যা ঘটে না)। ২. কটি (কোমর) বনাম কোটি (সংখ্যাবিশেষ)। ৩. চির (সর্বদা) বনাম চীর (ছেঁড়া বস্ত্র)। ৪. দিন (দিবস) বনাম দীন (দরিদ্র)। ৫. নীর (পানি) বনাম নীড় (পাখির বাসা)। ৬. বাণী (বচন/উক্তি) বনাম বানি (স্বর্ণকারের মজুরি)। ৭. শয্যা (বিছানা) বনাম সজ্জা (পোশাক/সাজসজ্জা)। বাক্যে এদের ভুল ব্যবহারে পুরো অর্থ বদলে যেতে পারে।',
    teacherGoldenTips: 'বোর্ড পরীক্ষার হট-লিস্ট: (১) দিন (দিবস) / দীন (গরিব) (২) নীর (পানি) / নীড় (বাসা) (৩) কুল (বংশ) / কূল (নদীর তীর) (৪) কপাল (ললাট) / কপোল (গাল) (৫) সুতি (সুতা) / সূতি (প্রসব)। বানান দেখেই অর্থ চিনে নিতে হবে!',
    rules: [
      {
        ruleNo: 1,
        nameBn: 'অর্থের সঙ্গতি রক্ষা নিয়ম',
        explanationBn: 'বাক্যের প্রেক্ষাপট অনুযায়ী বানানের দীর্ঘতা ও অর্থ নির্বাচন করতে হবে।',
        examples: [
          {
            bn: 'পাখিটি নীড়ে (বাসায়) ফিরে গেল। (নীর লিখলে অর্থ হবে পানি)।',
            context: 'সঠিক বানানের গুরুত্ব'
          }
        ]
      }
    ],
    formulas: [
      {
        label: 'সমোচ্চারিত জোড় সূত্র',
        structure: 'উচ্চারণ এক + বানান ভিন্ন = সম্পূর্ণ ভিন্ন অর্থ'
      }
    ],
    examples: [
      {
        bn: '"দীন দুঃখীদের সেবা করো।" (দীন = দরিদ্র)',
        context: 'দীন বনাম দিন'
      },
      {
        bn: '"নদীর কূলে বাতাস বইছে।" (কূল = তীর)',
        context: 'কূল বনাম কুল'
      }
    ],
    exceptions: [
      {
        titleBn: 'প্রমিত বানানের সরলীকরণ',
        descriptionBn: 'বাংলা একাডেমি প্রমিত বানানের নিয়মে অতৎসম শব্দে দীর্ঘ-ঈ ও দীর্ঘ-ঊ বর্জন করে সর্বত্র হ্রস্ব-ই ও হ্রস্ব-উ কার ব্যবহার করা হয়েছে (যেমন: ধমনি, পল্লি, গাড়ি)।'
      }
    ],
    commonMistakes: [
      {
        incorrectBn: 'পাখিটি তার নীড়ে জল খাচ্ছে। (নীর অর্থ জল, নীড় অর্থ বাসা)',
        correctBn: 'পাখিটি নীর পান করছে / নীড়ে ফিরেছে।',
        explanationBn: 'নীর = পানি, নীড় = পাখির বাসা।'
      }
    ],
    writtenPractice: [
      {
        id: 1,
        type: 'SENTENCE_MAKING',
        prompt: '"নীর" এবং "নীড়" শব্দ দুটির অর্থ লিখে দুটি পৃথক বাক্য রচনা করো।',
        correctAnswer: 'নীর (পানি): মেঘ থেকে শীতল নীর ঝরে পড়ে। নীড় (পাখির বাসা): সন্ধ্যার আকাশে পাখিরা নীড়ে ফেরে।',
        explanationBn: 'অর্থ ও বাক্য প্রয়োগ উভয়ই নির্ভুল হতে হবে।'
      }
    ],
    tags: ['ORTHOBHED', 'HOMONYMS', 'ACCURACY', 'SSC', 'HSC'],
    status: 'PUBLISHED',
    orderIndex: 5,
    viewCount: 180
  }
];

const CHAPTER_03_MCQS = [
  {
    id: 103001,
    chapterId: 103,
    topicId: 10301,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: 'বিভক্তিহীন নাম শব্দকে কী বলে?',
    questionEn: 'What is a nominal root/stem without case-inflection called?',
    options: ['ধাতু', 'প্রাতিপদিক', 'উপসর্গ', 'অনন্বয়ী'],
    correctOptionIndex: 1,
    correctAnswerText: 'প্রাতিপদিক',
    explanationBn: 'বিভক্তিহীন নাম শব্দকে প্রাতিপদিক বলে। আর ক্রিয়ার অবিভাজ্য মূল অংশকে ধাতু বলে।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'ঢাকা বোর্ড',
    year: 2024,
    examType: 'SSC',
    tags: ['PRATIPADIK', 'STEM', 'DHAKA_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 103002,
    chapterId: 103,
    topicId: 10302,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: 'উৎস বা উৎপত্তি অনুসারে বাংলা শব্দভাণ্ডারকে কয় ভাগে ভাগ করা হয়েছে?',
    questionEn: 'Into how many classes are Bengali words divided based on origin?',
    options: ['৩ ভাগে', '৪ ভাগে', '৫ ভাগে', '৬ ভাগে'],
    correctOptionIndex: 2,
    correctAnswerText: '৫ ভাগে',
    explanationBn: 'উৎস অনুসারে বাংলা শব্দভাণ্ডার ৫ প্রকার: তৎসম, অর্ধ-তৎসম, তদ্ভব, দেশি ও বিদেশি।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'রাজশাহী বোর্ড',
    year: 2023,
    examType: 'SSC',
    tags: ['ORIGIN', 'FIVE_TYPES', 'RAJSHAHI_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 103003,
    chapterId: 103,
    topicId: 10302,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: '"আনারস" ও "চাবি" কোন ভাষা থেকে আগত শব্দ?',
    questionEn: 'From which language are the words "Anarosh" and "Chabi" borrowed?',
    options: ['ফারসি', 'তুর্কি', 'পর্তুগিজ', 'ফরাসি'],
    correctOptionIndex: 2,
    correctAnswerText: 'পর্তুগিজ',
    explanationBn: 'আনারস, চাবি, আলমারি, পাউরুটি, গির্জা, বালতি ইত্যাদি পর্তুগিজ ভাষার শব্দ।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'যশোর বোর্ড',
    year: 2024,
    examType: 'SSC',
    tags: ['PORTUGUESE', 'LOANWORD', 'JASHORE_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 103004,
    chapterId: 103,
    topicId: 10302,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: 'নিচের কোনটি দেশি শব্দের উদাহরণ?',
    questionEn: 'Which of the following is an example of an indigenous (Deshi) word?',
    options: ['হস্ত', 'কুলা', 'দারোগা', 'টেবিল'],
    correctOptionIndex: 1,
    correctAnswerText: 'কুলা',
    explanationBn: 'কুলা, ঢেঁকি, গঞ্জ, টোপর, ডাব ইত্যাদি বাংলার আদিম জনগোষ্ঠীর নিজস্ব দেশি শব্দ।',
    difficulty: 'MEDIUM',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'কুমিল্লা বোর্ড',
    year: 2023,
    examType: 'SSC',
    tags: ['DESHI', 'INDIGENOUS', 'CUMILLA_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 103005,
    chapterId: 103,
    topicId: 10302,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: '"হস্ত → হত্থ → হাত"—এখানে "হাত" কোন শ্রেণির শব্দ?',
    questionEn: 'In "Hasto -> Hottho -> Haat", what category of word is "Haat"?',
    options: ['তৎসম', 'অর্ধ-তৎসম', 'তদ্ভব', 'দেশি'],
    correctOptionIndex: 2,
    correctAnswerText: 'তদ্ভব',
    explanationBn: 'সংস্কৃত থেকে প্রাকৃতের মধ্য দিয়ে রূপান্তরিত হয়ে খাঁটি বাংলায় আসা শব্দকে তদ্ভব বলে।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'দিনাজপুর বোর্ড',
    year: 2022,
    examType: 'SSC',
    tags: ['TADBHAVA', 'EVOLUTION', 'DINISHPUR_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 103006,
    chapterId: 103,
    topicId: 10303,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: 'নিচের কোনটি মৌলিক শব্দ?',
    questionEn: 'Which of the following is a primary/root (Mowlik) word?',
    options: ['গোলাপ', 'ডুবুরি', 'চাঁদমুখ', 'মিতালী'],
    correctOptionIndex: 0,
    correctAnswerText: 'গোলাপ',
    explanationBn: '"গোলাপ" শব্দকে ভাঙলে কোনো অর্থযুক্ত খণ্ডাংশ পাওয়া যায় না, তাই এটি মৌলিক শব্দ। অন্যগুলো সাধিত শব্দ।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'চট্টগ্রাম বোর্ড',
    year: 2024,
    examType: 'SSC',
    tags: ['MOWLIK', 'ROOT_WORD', 'CHITTAGONG_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 103007,
    chapterId: 103,
    topicId: 10304,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: '"সন্দেশ" কোন শ্রেণির শব্দ?',
    questionEn: 'What category of word by semantic meaning is "Sandesh"?',
    options: ['যৌগিক', 'রূঢ়', 'যোগরূঢ়', 'মৌলিক'],
    correctOptionIndex: 1,
    correctAnswerText: 'রূঢ়',
    explanationBn: '"সন্দেশ"-এর ব্যুৎপত্তিগত অর্থ "সংবাদ", কিন্তু প্রচলিত বিশিষ্ট অর্থ "মিষ্টান্ন বিশেষ"। তাই এটি রূঢ় শব্দ।',
    difficulty: 'MEDIUM',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'সিলেট বোর্ড',
    year: 2024,
    examType: 'SSC',
    tags: ['RURHO', 'SANDESH', 'SYLHET_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 103008,
    chapterId: 103,
    topicId: 10304,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: '"পঙ্কজ" শব্দটির শ্রেণিবিভাগ কোনটি?',
    questionEn: 'What semantic classification does the word "Pankaja" belong to?',
    options: ['যৌগিক', 'রূঢ়', 'যোগরূঢ়', 'দেশি'],
    correctOptionIndex: 2,
    correctAnswerText: 'যোগরূঢ়',
    explanationBn: '"পঙ্কজ" সমাসনিষ্পন্ন শব্দ (পঙ্কে জন্মে যা), কিন্তু পাঁকে জন্মানো সবকিছুকে না বুঝিয়ে কেবল "পদ্মফুল"-কে বোঝায়, তাই এটি যোগরূঢ় শব্দ।',
    difficulty: 'MEDIUM',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'বরিশাল বোর্ড',
    year: 2023,
    examType: 'SSC',
    tags: ['YOGORURHO', 'PANKAJA', 'BARISAL_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 103009,
    chapterId: 103,
    topicId: 10304,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: 'যেসব শব্দের ব্যুৎপত্তিগত অর্থ ও ব্যবহারিক অর্থ অভিন্ন, তাদের কী বলে?',
    questionEn: 'What are words called whose etymological and conventional meanings are identical?',
    options: ['যৌগিক শব্দ', 'রূঢ় শব্দ', 'যোগরূঢ় শব্দ', 'সাধিত শব্দ'],
    correctOptionIndex: 0,
    correctAnswerText: 'যৌগিক শব্দ',
    explanationBn: 'ব্যুৎপত্তিগত অর্থ ও ব্যবহারিক অর্থ এক হলে তাকে যৌগিক শব্দ বলে (যেমন: গায়ক = গৈ+অক, কর্তব্য = কৃ+তব্য)।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'ময়মনসিংহ বোর্ড',
    year: 2023,
    examType: 'SSC',
    tags: ['YOWGIK', 'DEFINITION', 'MYMENSINGH_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 103010,
    chapterId: 103,
    topicId: 10305,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: '"কূল" এবং "কুল" শব্দের অর্থ যথাক্রমে কী?',
    questionEn: 'What are the respective meanings of "Kool" and "Kul"?',
    options: ['তীর ও বংশ', 'বংশ ও তীর', 'ফল ও পানি', 'নদী ও সাগর'],
    correctOptionIndex: 0,
    correctAnswerText: 'তীর ও বংশ',
    explanationBn: 'কূল (দীর্ঘ-ঊ কার) অর্থ নদী বা সাগরের তীর/কিনারা; আর কুল (হ্রস্ব-উ কার) অর্থ বংশ বা বরই ফল।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'ঢাকা বোর্ড',
    year: 2023,
    examType: 'SSC',
    tags: ['HOMONYMS', 'KOOL_KUL', 'DHAKA_BOARD'],
    status: 'ACTIVE'
  }
];

const CHAPTER_03_MODEL_TEST = {
  id: 10301,
  subject: 'BANGLA',
  chapterId: 103,
  testTitleBn: 'অধ্যায় ০৩ মডেল টেস্ট: শব্দ ও শব্দের শ্রেণিবিভাগ',
  testTitleEn: 'Chapter 03 Model Test: Words & Classification of Words',
  descriptionBn: 'তৎসম, তদ্ভব, দেশি, বিদেশি, মৌলিক, সাধিত, যৌগিক, রূঢ় ও যোগরূঢ় শব্দের ওপর পূর্ণাঙ্গ এসএসসি ও বোর্ড স্ট্যান্ডার্ড মডেল টেস্ট।',
  durationMinutes: 15,
  totalMarks: 10,
  passPercentage: 60,
  difficulty: 'MEDIUM',
  questionCount: 10,
  questionIds: [103001, 103002, 103003, 103004, 103005, 103006, 103007, 103008, 103009, 103010],
  status: 'PUBLISHED'
};

module.exports = {
  CHAPTER_03_TOPICS,
  CHAPTER_03_MCQS,
  CHAPTER_03_MODEL_TEST
};
