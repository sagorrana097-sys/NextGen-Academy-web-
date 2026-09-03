/**
 * Bangla Grammar Chapter 02: ধ্বনি ও বর্ণ (Phonetics & Bengali Alphabet)
 * Comprehensive, Exam-Oriented Educational Content for SSC, HSC & Admission
 */

const CHAPTER_02_TOPICS = [
  {
    id: 10201,
    chapterId: 102,
    parentTopicId: null,
    subject: 'BANGLA',
    topicNo: '২.১',
    titleBn: 'ধ্বনি, বর্ণ ও অক্ষরের মৌলিক ধারণা',
    titleEn: 'Concepts of Sound (Phone), Letter & Syllable',
    slug: 'b02-dhwani-borno-o-okkhor',
    difficulty: 'BEGINNER',
    classLevel: 'Class 6 - 12 (SSC & HSC)',
    summaryBn: 'মানুষের বাগ্‌যন্ত্রের সাহায্যে উচ্চারিত আওয়াজকে ধ্বনি বলে। ধ্বনির লিখিত রূপ বা প্রতীককে বর্ণ বলে। আর এক নিঃশ্বাসে উচ্চারিত অংশকে অক্ষর বলে।',
    definitionBn: 'ধ্বনি (Sound/Phone): মানুষের ফুসফুসতাড়িত বাতাস বাগ্‌যন্ত্রের বিভিন্ন অংশে আঘাতপ্রাপ্ত হয়ে যে অর্থবোধক আওয়াজ তৈরি করে, তাকে ধ্বনি বলে। বর্ণ (Letter): কোনো ভাষার ধ্বনি নির্দেশক লিখিত রূপ বা প্রতীককে বর্ণ বলে। অক্ষর (Syllable): ফুসফুস থেকে আগত এক প্রয়াসে বা এক নিঃশ্বাসে শব্দের যে অংশ একবারে উচ্চারিত হয়, তাকে অক্ষর বা সিলেবল বলে।',
    definitionEn: 'A speech sound produced by vocal organs is a Phone/Phoneme. The visual written representation of a sound is a Letter. A unit of pronunciation uttered with a single puff of air is a Syllable.',
    explanationBn: 'ধ্বনি হলো শ্রাব্য (যা কানে শোনা যায়), আর বর্ণ হলো দৃশ্যমান (যা চোখে দেখা যায়)। ধ্বনি মানুষের উচ্চারণের সাথে সম্পর্কিত, আর বর্ণ লেখার সাথে সম্পর্কিত। যেমন—আমরা যখন বলি "ক", তখন তা ধ্বনি; আর যখন খাতায় লিখি "ক", তখন তা বর্ণ। অন্যদিকে "অক্ষর" এবং "বর্ণ" এক নয়। "মা" শব্দে বর্ণ ২টি (ম + আ), কিন্তু অক্ষর ১টি (মা)। অক্ষর দুই প্রকার: ১. মুক্তাক্ষর (Open Syllable)—যা স্বরধ্বনিতে শেষ হয় (যেমন: মা, নদী = ন+দী), ২. বদ্ধাক্ষর (Closed Syllable)—যা ব্যঞ্জনধ্বনিতে শেষ হয় (যেমন: দিন, হাত, চল্)। বাংলা বর্ণমালায় মোট ৫০টি বর্ণ রয়েছে (স্বরবর্ণ ১১টি, ব্যঞ্জনবর্ণ ৩৯টি)।',
    teacherGoldenTips: 'পরীক্ষার গোল্ডেন প্যাঁচ: (১) ধ্বনি কিসের সাহায্যে তৈরি হয়? → বাগ্‌যন্ত্রের সাহায্যে। (২) ভাষার ক্ষুদ্রতম একক কোনটি? → ধ্বনি। (৩) ধ্বনির শ্রুতিগ্রাহ্য রূপ কোনটি? → ধ্বনি নিজেই। আর দৃষ্টিগ্রাহ্য বা লিখিত রূপ? → বর্ণ। (৪) অক্ষর নির্ণয়: "বন্ধন" শব্দে বর্ণ ৫টি কিন্তু অক্ষর ২টি (বন্ + ধন্)।',
    rules: [
      {
        ruleNo: 1,
        nameBn: 'ধ্বনি বনাম বর্ণের পার্থক্য',
        explanationBn: 'ধ্বনি মূলত উচ্চারিত বায়ুপ্রবাহ যা শ্রুতিগ্রাহ্য। বর্ণ হলো সেই ধ্বনিকে স্থায়ী রূপ দিতে ব্যবহৃত সংকেত বা লিপি।',
        examples: [
          {
            bn: 'ধ্বনি কানে শোনার বিষয়, বর্ণ চোখে দেখার ও লেখার বিষয়।',
            context: 'সংবেদী অনুভূতির পার্থক্য',
            highlight: 'শ্রাব্য বনাম দৃশ্য'
          }
        ]
      },
      {
        ruleNo: 2,
        nameBn: 'অক্ষর (Syllable) নির্ণয়ের নিয়ম',
        explanationBn: 'একটি শব্দের ভেতরে কতটি স্বরধ্বনি উচ্চারিত হয়, ঠিক ততটিই অক্ষর থাকে। ব্যঞ্জনধ্বনি স্বরধ্বনি ছাড়া স্বতন্ত্র অক্ষর হতে পারে না।',
        examples: [
          {
            bn: '"কলম" শব্দে ৩টি অক্ষর (ক + ল + ম্); "বাংলাদেশ" শব্দে ৩টি অক্ষর (বাং + লা + দেশ্)।',
            context: 'অক্ষর গণনা কৌশল',
            highlight: 'এক নিঃশ্বাসের প্রয়াস'
          }
        ]
      }
    ],
    formulas: [
      {
        label: 'অক্ষর গঠনের সমীকরণ',
        structure: 'এক নিঃশ্বাসের উচ্চারণ = ১টি অক্ষর (Syllable)'
      },
      {
        label: 'বর্ণমালার মোট বিন্যাস',
        structure: '১১ স্বরবর্ণ + ৩৯ ব্যঞ্জনবর্ণ = মোট ৫০টি বাংলা বর্ণ'
      }
    ],
    examples: [
      {
        bn: 'হাত (১টি অক্ষর: হাত্; কিন্তু ২টি বর্ণ: হ + াত)',
        context: 'অক্ষর বনাম বর্ণের সংখ্যার পার্থক্য'
      },
      {
        bn: 'বিদ্যালয় (৪টি অক্ষর: বিদ্ + দা + ল + য়্)',
        context: 'শব্দ বিশ্লিষ্ট অক্ষর'
      }
    ],
    exceptions: [
      {
        titleBn: 'কারহীন বর্ণ বা নীল বর্ণ (Inherent Vowel)',
        descriptionBn: 'বাংলা ব্যঞ্জনবর্ণের সাথে কোনো স্বরচিহ্ন না থাকলে তাতে স্বাভাবিকভাবে একটি অন্তর্নিহিত "অ" ধ্বনি থাকে (যেমন: ক = ক্ + অ)। তাই "অ"-কে নীল বর্ণ বা বিলীন বর্ণ বলা হয়।'
      }
    ],
    commonMistakes: [
      {
        incorrectBn: 'অক্ষর এবং বর্ণ একই জিনিস।',
        correctBn: 'অক্ষর হলো Syllable (এক নিঃশ্বাসে উচ্চারিত ধ্বনিগুচ্ছ), আর বর্ণ হলো Letter (একক লিখিত প্রতীক)।',
        explanationBn: '"মাটি" শব্দে বর্ণ ৪টি (ম+আ+ট+ই), কিন্তু অক্ষর ২টি (মা+টি)।'
      }
    ],
    writtenPractice: [
      {
        id: 1,
        type: 'DIFFERENCE',
        prompt: 'ধ্বনি ও বর্ণের মধ্যে তিনটি পার্থক্য লিখ।',
        correctAnswer: '১. ধ্বনি বাগ্‌যন্ত্রে উচ্চারিত ও শ্রুতিগ্রাহ্য, বর্ণ হলো তার দৃষ্টিগ্রাহ্য লিখিত প্রতীক। ২. ধ্বনির কোনো স্থায়ী রূপ নেই, বর্ণ ধ্বনির স্থায়ী রূপ দান করে। ৩. সব ভাষারই ধ্বনি আছে কিন্তু সব ভাষার নিজস্ব লিখিত বর্ণ নাও থাকতে পারে।',
        explanationBn: 'পরীক্ষার জন্য আদর্শ ৩ নম্বরের উত্তর।'
      },
      {
        id: 2,
        type: 'ANALYSIS',
        prompt: '"বিশ্ববিদ্যালয়" শব্দটিতে কতটি বর্ণ এবং কতটি অক্ষর আছে গণনা করো।',
        correctAnswer: 'অক্ষর ৬টি: বিশ্ + শো + বিদ্ + দা + ল + য়্। বর্ণ মোট ৯টি (ব্, ই, শ্, ব্, ই, দ্, য্, ল, য়)।',
        explanationBn: 'অক্ষর হলো এক ঝোঁকে উচ্চারণ, বর্ণ হলো প্রতিটি স্বর ও ব্যঞ্জন প্রতীক।'
      }
    ],
    tags: ['DHWANI', 'BORNO', 'OKKHOR', 'SYLLABLE', 'SSC', 'HSC'],
    status: 'PUBLISHED',
    orderIndex: 1,
    viewCount: 160
  },
  {
    id: 10202,
    chapterId: 102,
    parentTopicId: null,
    subject: 'BANGLA',
    topicNo: '২.২',
    titleBn: 'স্বরধ্বনি, স্বরবর্ণ ও কারচিহ্ন',
    titleEn: 'Vowels (Shorodhoni), Vowel Letters & Diacritics (Kar)',
    slug: 'b02-shorodhwani-shoroborno-o-kar',
    difficulty: 'BOARD_STANDARD',
    classLevel: 'Class 6 - 12 (SSC & HSC)',
    summaryBn: 'যেসব ধ্বনি অন্য ধ্বনির সাহায্য ছাড়া নিজে নিজেই পূর্ণভাবে উচ্চারিত হতে পারে তাদের স্বরধ্বনি বলে। স্বরবর্ণ ১১টি, মৌলিক স্বরধ্বনি ৭টি এবং কারচিহ্ন ১০টি।',
    definitionBn: 'স্বরধ্বনি: যেসব ধ্বনি উচ্চারণের সময় ফুসফুসতাড়িত বাতাস মুখের কোথাও কোনো বাধা পায় না এবং যা অন্য ধ্বনির সাহায্য ছাড়া সম্পূর্ণ স্বাধীনভাবে উচ্চারিত হতে পারে, তাদের স্বরধ্বনি বলে। মৌলিক স্বরধ্বনি ৭টি: অ, আ, ই, উ, এ, ও, অ্যা। যৌগিক স্বরধ্বনি ২৫টি, যার মধ্যে বর্ণ হিসেবে লিখিত রূপ আছে ২টি (ঐ, ঔ)। কারচিহ্ন: স্বরবর্ণের সংক্ষিপ্ত রূপ যা ব্যঞ্জনবর্ণের সাথে যুক্ত হয়, তাকে "কার" বলে। বাংলা ভাষায় কারচিহ্ন ১০টি।',
    definitionEn: 'Vowels are speech sounds articulated without any obstruction in the vocal tract. Bengali has 11 vowel letters, 7 primary vowel phonemes, 2 diphthong letters, and 10 vowel diacritics (Kar).',
    explanationBn: 'বাংলা ভাষায় স্বরবর্ণ মোট ১১টি: অ, আ, ই, ঈ, উ, ঊ, ঋ, এ, ঐ, ও, ঔ। উচ্চারণের সময়ের ভিত্তিতে এদের দুই ভাগে ভাগ করা হয়: ১. হ্রস্বস্বর (৪টি: অ, ই, উ, ঋ)—এদের উচ্চারণে কম সময় লাগে। ২. দীর্ঘস্বর (৭টি: আ, ঈ, ঊ, এ, ঐ, ও, ঔ)—এদের উচ্চারণে বেশি সময় লাগে। স্বরবর্ণের কোনো সংক্ষিপ্ত রূপ "অ"-এর নেই। তাই কারচিহ্ন ১০টি: া (আ-কার), ি (ই-কার), ী (ঈ-কার), ু (উ-কার), ূ (ঊ-কার), ৃ (ঋ-কার), ে (এ-কার), ৈ (ঐ-কার), ো (ও-কার), ৌ (ঔ-কার)। যৌগিক স্বরধ্বনি "ঐ" তৈরি হয়: ও/অ + ই মিলে; "ঔ" তৈরি হয়: ও/অ + উ মিলে।',
    teacherGoldenTips: 'ভীষণ গুরুত্বপূর্ণ টেকনিক: (১) বাংলা ভাষায় স্বরবর্ণ কয়টি? → ১১টি। (২) মৌলিক স্বরধ্বনি কয়টি? → ৭টি। (৩) কারচিহ্ন কয়টি? → ১০টি। (৪) কোন স্বরবর্ণের কারচিহ্ন নেই? → "অ"। (৫) বাংলা ভাষায় যৌগিক স্বরধ্বনি কয়টি? → ২৫টি, কিন্তু যৌগিক স্বরজ্ঞাপক বর্ণ কয়টি? → মাত্র ২টি (ঐ ও ঔ)।',
    rules: [
      {
        ruleNo: 1,
        nameBn: '৭টি মৌলিক স্বরধ্বনির তালিকা',
        explanationBn: 'বাংলা ভাষার মূল সাতটি স্বরধ্বনি হলো: /অ/, /আ/, /ই/, /উ/, /এ/, /ও/, /অ্যা/। এর মধ্যে "অ্যা" ধ্বনির কোনো নিজস্ব একক বর্ণ নেই (য-ফলা আকার দিয়ে লেখা হয়, যেমন: ব্যাট, ব্যাংক, দেখা → দ্যাক্থা)।',
        examples: [
          {
            bn: 'ব্যাট (bæt) = ব্ + অ্যা + ট্। জ্ঞান (gæn) = গ্ + অ্যা + ন্।',
            context: '"অ্যা" মৌলিক স্বরধ্বনির বাস্তব উদাহরণ',
            highlight: 'অ্যা কোনো পৃথক বর্ণ নয় কিন্তু মৌলিক ধ্বনি'
          }
        ]
      },
      {
        ruleNo: 2,
        nameBn: 'যৌগিক স্বরবর্ণের বিশ্লেষণ',
        explanationBn: 'ঐ এবং ঔ হলো সন্ধিস্বর বা দ্বি-স্বরবর্ণ।',
        examples: [
          {
            bn: 'ঐ = ও/অ + ই (যেমন: কই = ক্ + ও + ই)। ঔ = ও/অ + উ (যেমন: বউ = ব্ + ও + উ)।',
            context: 'যৌগিক স্বরের ভাঙন',
            highlight: 'ঐ (ও+ই), ঔ (ও+উ)'
          }
        ]
      }
    ],
    formulas: [
      {
        label: 'যৌগিক স্বরবর্ণের ভাঙন সূত্র',
        structure: 'ঐ = অ/ও + ই | ঔ = অ/ও + উ'
      },
      {
        label: 'কারচিহ্নের সমীকরণ',
        structure: '১১টি স্বরবর্ণ - ১টি কারহীন (অ) = ১০টি কারচিহ্ন'
      }
    ],
    examples: [
      {
        bn: 'মা (ম + আ-কার), দিন (দ + ই-কার), নদী (ন + দ + ঈ-কার)',
        context: 'ব্যঞ্জনের সাথে কারচিহ্নের সংযোগ'
      }
    ],
    exceptions: [
      {
        titleBn: '"ঋ" বর্ণের প্রকৃতি',
        descriptionBn: '"ঋ" স্বরবর্ণের তালিকায় থাকলেও আধুনিক বাংলায় এর উচ্চারণ স্বরধ্বনির মতো নয়, বরং ব্যঞ্জনধ্বনি "র" + স্বরধ্বনি "ই" (রি)-এর মতো হয়। যেমন: ঋষি → রিশি।'
      }
    ],
    commonMistakes: [
      {
        incorrectBn: 'বাংলা ভাষায় মৌলিক স্বরধ্বনি ১১টি।',
        correctBn: 'বাংলা ভাষায় স্বরবর্ণ ১১টি, কিন্তু মৌলিক স্বরধ্বনি মাত্র ৭টি।',
        explanationBn: 'ঈ, ঊ, ঋ, ঐ, ঔ মৌলিক স্বরধ্বনি নয়।'
      },
      {
        incorrectBn: 'যৌগিক স্বরধ্বনি মাত্র ২টি (ঐ এবং ঔ)।',
        correctBn: 'যৌগিক স্বরবর্ণ ২টি, কিন্তু যৌগিক স্বরধ্বনি ২৫টি।',
        explanationBn: 'যেমন: যাউ, খাউ, নেই, শুই—এসব ধ্বনিও যৌগিক স্বরধ্বনি।'
      }
    ],
    writtenPractice: [
      {
        id: 1,
        type: 'LISTING',
        prompt: 'বাংলা ভাষার মৌলিক স্বরধ্বনি সাতটির নাম লিখ।',
        correctAnswer: 'মৌলিক স্বরধ্বনি ৭টি: অ, আ, ই, উ, এ, ও, অ্যা।',
        explanationBn: 'এনসিটিবি প্রমিত বাংলা ব্যাকরণসম্মত তালিকা।'
      },
      {
        id: 2,
        type: 'SHORT_ANSWER',
        prompt: '"অ" বর্ণকে কারহীন বর্ণ বা বিলীন বর্ণ বলা হয় কেন?',
        correctAnswer: 'কারণ স্বরবর্ণের মধ্যে একমাত্র "অ" বর্ণের কোনো সংক্ষিপ্ত কারচিহ্ন নেই। এটি ব্যঞ্জনবর্ণের সাথে প্রচ্ছন্ন বা অন্তর্নিহিত অবস্থায় বিলীন থাকে (যেমন: ক = ক্ + অ)।',
        explanationBn: 'কারহীনতার যৌক্তিক ব্যাকরণিক ব্যাখ্যা।'
      }
    ],
    tags: ['SHORODHWANI', 'SHOROBORNO', 'KAR', 'SSC', 'HSC', 'ADMISSION'],
    status: 'PUBLISHED',
    orderIndex: 2,
    viewCount: 220
  },
  {
    id: 10203,
    chapterId: 102,
    parentTopicId: null,
    subject: 'BANGLA',
    topicNo: '২.৩',
    titleBn: 'ব্যঞ্জনধ্বনি ও ব্যঞ্জনবর্ণের বিশদ শ্রেণিবিভাগ',
    titleEn: 'Consonants (Byanjondhwani) & Comprehensive Classification',
    slug: 'b02-byanjondhwani-o-shrenibibhag',
    difficulty: 'BOARD_STANDARD',
    classLevel: 'Class 8 - 12 (SSC & HSC)',
    summaryBn: 'যেসব ধ্বনি স্বরধ্বনির সাহায্য ছাড়া নিজে নিজে স্পষ্টভাবে উচ্চারিত হতে পারে না তাদের ব্যঞ্জনধ্বনি বলে। ব্যঞ্জনবর্ণ ৩৯টি।',
    definitionBn: 'ব্যঞ্জনধ্বনি: যেসব ধ্বনি উচ্চারণের সময় ফুসফুসতাড়িত বাতাস মুখবিবরের কোথাও না কোথাও স্পষ্ট বাধা পায় বা ঘর্ষণ খায় এবং যা স্বরধ্বনির সাহায্য ছাড়া স্পষ্টরূপে উচ্চারিত হতে পারে না, তাদের ব্যঞ্জনধ্বনি বলে। ব্যঞ্জনবর্ণ: ব্যঞ্জনধ্বনির লিখিত রূপকে ব্যঞ্জনবর্ণ বলে। বাংলা বর্ণমালায় ব্যঞ্জনবর্ণ মোট ৩৯টি।',
    definitionEn: 'Consonants are speech sounds articulated with a complete or partial closure of the vocal tract. The Bengali script contains 39 consonant letters grouped into plosives, nasals, sibilants, and semi-vowels.',
    explanationBn: 'ব্যঞ্জনধ্বনিকে প্রধানত কয়েকটি শ্রেণিতে ভাগ করা হয়: ১. স্পর্শ বর্ণ বা বর্গীয় বর্ণ (২৫টি: ক থেকে ম পর্যন্ত)। এদের ৫টি বর্গে ভাগ করা হয় (ক-বর্গ, চ-বর্গ, ট-বর্গ, ত-বর্গ, প-বর্গ)। ২. নাসিক্য বর্ণ বা অনুনাসিক বর্ণ (৫টি: ঙ, ঞ, ণ, ন, ম)—উচ্চারণের সময় বাতাস নাক দিয়ে বের হয়। ৩. অন্তঃস্থ বর্ণ (৪টি: য, র, ল, ব)—স্পর্শ ও উষ্ম বর্ণের মাঝে এদের অবস্থান। ৪. উষ্ম বর্ণ বা শিস বর্ণ (৪টি: শ, ষ, স, হ)—উচ্চারণের সময় শিস দেওয়ার মতো বাতাস বের হয় এবং ঘর্ষণজনিত উষ্ণতা সৃষ্টি হয়। ৫. তাড়নজাত বর্ণ (২টি: ড়, ঢ়)—জিহ্বার ডগা দিয়ে ওপরের মাড়িতে দ্রুত টোকা দেওয়া হয়। ৬. কম্পনজাত বর্ণ (১টি: র)—জিহ্বার অগ্রভাগ দ্রুত কেঁপে ওঠে। ৭. পার্শ্বিক বর্ণ (১টি: ল)—বাতাস জিহ্বার দুই পাশ দিয়ে বের হয়ে যায়। ৮. পরাশ্রয়ী বর্ণ (৩টি: ং, ঃ, ঁ)—অন্য কোনো বর্ণকে আশ্রয় না করে একা বসতে পারে না।',
    teacherGoldenTips: 'আলমগীর স্যারের গোল্ডেন চার্ট: (১) স্পর্শ বর্ণ কয়টি? → ২৫টি (ক থেকে ম)। (২) নাসিক্য বর্ণ কয়টি? → ৫টি। (৩) উষ্ম/শিস বর্ণ কয়টি? → ৪টি (শ, ষ, স, হ)। (৪) কম্পনজাত? → র। (৫) পার্শ্বিক? → ল। (৬) তাড়নজাত? → ড়, ঢ়। (৭) পরাশ্রয়ী? → ং, ঃ, ঁ। এই চার্ট থেকেই বোর্ডে প্রতি বছর প্রশ্ন আসে!',
    rules: [
      {
        ruleNo: 1,
        nameBn: 'বর্গীয় বর্ণ ও ৫টি বর্গের নাম',
        explanationBn: 'ক থেকে ম পর্যন্ত ২৫টি বর্ণকে প্রথম বর্ণের নামানুসারে পাঁচটি বর্গে ভাগ করা হয়েছে।',
        examples: [
          {
            bn: 'ক-বর্গ (ক, খ, গ, ঘ, ঙ), চ-বর্গ (চ, ছ, জ, ঝ, ঞ), ট-বর্গ (ট, ঠ, ড, ঢ, ণ), ত-বর্গ (ত, থ, দ, ধ, ন), প-বর্গ (প, ফ, ব, ভ, ম)।',
            context: 'বর্গীয় বিভাজন'
          }
        ]
      },
      {
        ruleNo: 2,
        nameBn: 'বিশেষ ব্যঞ্জনধ্বনির নাম ও চরিত্র',
        explanationBn: 'ল হলো পার্শ্বিক বর্ণ, র হলো কম্পনজাত বর্ণ, ড় এবং ঢ় হলো তাড়নজাত ধ্বনি।',
        examples: [
          {
            bn: 'র উচ্চারণে জিহ্বা কাঁপে (কম্পনজাত); ল উচ্চারণে বাতাস দুই পাশ দিয়ে গলে যায় (পার্শ্বিক); ড় ও ঢ় উচ্চারণে জিহ্বার ডগা উল্টে তালুতে টোকা দেয় (তাড়িত)।',
            context: 'উচ্চারণগত চারিত্রিক বৈশিষ্ট্য'
          }
        ]
      }
    ],
    formulas: [
      {
        label: 'ব্যঞ্জনবর্ণের মোট গণনা',
        structure: '২৫ স্পর্শ + ৪ অন্তঃস্থ + ৪ উষ্ম + ২ তাড়নজাত + ১ কম্পনজাত + ৩ পরাশ্রয়ী = ৩৯টি'
      }
    ],
    examples: [
      {
        bn: 'রং, দুঃখ, চাঁদ (ং, ঃ, ঁ একা অর্থ প্রকাশ করতে পারে না, তাই পরাশ্রয়ী বর্ণ)',
        context: 'পরাশ্রয়ী বর্ণের দৃষ্টান্ত'
      }
    ],
    exceptions: [
      {
        titleBn: 'ব-ফলা এবং য-ফলা',
        descriptionBn: 'ব্যঞ্জনবর্ণের সংক্ষিপ্ত রূপকে "ফলা" বলে। বাংলায় ফলা মোট ৬টি: ন-ফলা, ব-ফলা, ম-ফলা, য-ফলা, র-ফলা, ল-ফলা। মনে রাখার সহজ টেকনিক: "ন-ব-ম-য-র-ল" (নবম জরেল)।'
      }
    ],
    commonMistakes: [
      {
        incorrectBn: 'বাংলা বর্ণমালায় ফলা চিহ্ন ৭টি বা ৮টি।',
        correctBn: 'বাংলায় ফলা চিহ্ন সুনির্দিষ্টভাবে ৬টি (ন, ব, ম, য, র, ল)।',
        explanationBn: 'কার ১০টি এবং ফলা ৬টি।'
      }
    ],
    writtenPractice: [
      {
        id: 1,
        type: 'CLASSIFICATION',
        prompt: 'বাংলা ভাষার পরাশ্রয়ী বর্ণ কয়টি ও কী কী? এদের পরাশ্রয়ী বলা হয় কেন?',
        correctAnswer: 'পরাশ্রয়ী বর্ণ ৩টি: অনুস্বার (ং), বিসর্গ (ঃ) এবং চন্দ্রবিন্দু (ঁ)। এদের পরাশ্রয়ী বলা হয় কারণ এরা অন্য কোনো স্বাধীন স্বর বা ব্যঞ্জনবর্ণের আশ্রয় ছাড়া স্বতন্ত্রভাবে বাক্যে বা শব্দে বসতে বা উচ্চারিত হতে পারে না।',
        explanationBn: 'বোর্ড স্ট্যান্ডার্ড ৩ নম্বরের প্রশ্ন।'
      },
      {
        id: 2,
        type: 'MATCHING',
        prompt: 'কম্পনজাত, পার্শ্বিক ও তাড়নজাত বর্ণের একটি করে উদাহরণ দাও।',
        correctAnswer: 'কম্পনজাত বর্ণ: "র", পার্শ্বিক বর্ণ: "ল", তাড়নজাত বর্ণ: "ড়" ও "ঢ়"।',
        explanationBn: 'মুখস্থ রাখার অত্যন্ত জরুরি সংক্ষিপ্ত প্রশ্ন।'
      }
    ],
    tags: ['BYANJONBORNO', 'SPORSHO', 'PARSHWIK', 'KOMPONJATO', 'TARONJATO', 'SSC'],
    status: 'PUBLISHED',
    orderIndex: 3,
    viewCount: 230
  },
  {
    id: 10204,
    chapterId: 102,
    parentTopicId: null,
    subject: 'BANGLA',
    topicNo: '২.৪',
    titleBn: 'উচ্চারণস্থান ও উচ্চারণরীতি (ঘোষ, অঘোষ, অল্পপ্রাণ, মহাপ্রাণ)',
    titleEn: 'Place & Manner of Articulation (Voiced, Voiceless, Aspirated)',
    slug: 'b02-uccharon-sthan-o-uccharon-riti',
    difficulty: 'BOARD_STANDARD',
    classLevel: 'Class 8 - 12 (SSC & HSC)',
    summaryBn: 'বাগ্‌যন্ত্রের যে স্থান স্পর্শ করে ধ্বনি উচ্চারিত হয় তা উচ্চারণস্থান। বাতাসের তীব্রতায় অল্পপ্রাণ/মহাপ্রাণ এবং স্বরতন্ত্রীর কম্পনে অঘোষ/ঘোষ নির্ধারিত হয়।',
    definitionBn: 'উচ্চারণস্থান অনুসারে বর্ণ ৫ ভাগে বিভক্ত: ১. কণ্ঠ্য বা জিহ্বামূলীয় (ক-বর্গ), ২. তালব্য (চ-বর্গ), ৩. মূর্ধন্য বা পশ্চাৎ দন্তমূলীয় (ট-বর্গ), ৪. দন্ত্য (ত-বর্গ), ৫. ওষ্ঠ্য (প-বর্গ)। উচ্চারণরীতি অনুসারে: অঘোষ ধ্বনি: স্বরতন্ত্রী কাঁপে না (বর্গের ১ম ও ২য় বর্ণ)। ঘোষ ধ্বনি: স্বরতন্ত্রী অনুরণিত হয় বা কাঁপে (বর্গের ৩য়, ৪র্থ ও ৫ম বর্ণ)। অল্পপ্রাণ ধ্বনি: বাতাসের চাপের স্বল্পতা থাকে (বর্গের ১ম ও ৩য় বর্ণ)। মহাপ্রাণ ধ্বনি: বাতাসের চাপের আধিক্য বা "হ"-এর মতো টান থাকে (বর্গের ২য় ও ৪র্থ বর্ণ)।',
    definitionEn: 'Place of articulation categorizes sounds into Velar, Palatal, Retroflex, Dental, and Labial. Manner of articulation categorizes sounds into Voiceless/Voiced and Unaspirated/Aspirated based on vocal chord vibration and air pressure.',
    explanationBn: 'বোর্ড পরীক্ষায় প্রতি বছর এই ছক থেকে ১ থেকে ২টি প্রশ্ন বাধ্যতামূলক আসে। ক-বর্গীয় ধ্বনি (ক, খ, গ, ঘ, ঙ) জিহ্বামূল বা কণ্ঠনালি থেকে উচ্চারিত হয় বলে কণ্ঠ্য বর্ণ। চ-বর্গীয় ধ্বনি (চ, ছ, জ, ঝ, ঞ) শক্ত তালুর স্পর্শে উচ্চারিত হয় বলে তালব্য বর্ণ। ট-বর্গীয় ধ্বনি (ট, ঠ, ড, ঢ, ণ) মূর্ধা বা দন্তমূলের পেছনের অংশে উচ্চারিত হয় বলে মূর্ধন্য বর্ণ। ত-বর্গীয় ধ্বনি (ত, থ, দ, ধ, ন) দাঁত স্পর্শ করে উচ্চারিত হয় বলে দন্ত্য বর্ণ। প-বর্গীয় ধ্বনি (প, ফ, ব, ভ, ম) উভয় ঠোঁটের মিলনে উচ্চারিত হয় বলে ওষ্ঠ্য বর্ণ।',
    teacherGoldenTips: 'ম্যাজিক ফর্মুলা (বর্গের ৫টি কলাম): ১ম কলাম (ক, চ, ট, ত, প) → অঘোষ অল্পপ্রাণ। ২য় কলাম (খ, ছ, ঠ, থ, ফ) → অঘোষ মহাপ্রাণ। ৩য় কলাম (গ, জ, ড, দ, ব) → ঘোষ অল্পপ্রাণ। ৪র্থ কলাম (ঘ, ঝ, ঢ, ধ, ভ) → ঘোষ মহাপ্রাণ। ৫ম কলাম (ঙ, ঞ, ণ, ন, ম) → ঘোষ নাসিক্য।',
    rules: [
      {
        ruleNo: 1,
        nameBn: 'অঘোষ বনাম ঘোষ চেনার সূত্র',
        explanationBn: 'বর্গের ১ম ও ২য় বর্ণ অঘোষ; ৩য়, ৪র্থ ও ৫ম বর্ণ ঘোষ।',
        examples: [
          {
            bn: 'ক, খ হলো অঘোষ; গ, ঘ, ঙ হলো ঘোষ।',
            context: 'স্বরতন্ত্রী কম্পন নীতি',
            highlight: '১-২ অঘোষ | ৩-৪-৫ ঘোষ'
          }
        ]
      },
      {
        ruleNo: 2,
        nameBn: 'অল্পপ্রাণ বনাম মহাপ্রাণ চেনার সূত্র',
        explanationBn: 'বর্গের ১ম ও ৩য় বর্ণ অল্পপ্রাণ (বাতাস কম); ২য় ও ৪র্থ বর্ণ মহাপ্রাণ (বাতাস বেশি)।',
        examples: [
          {
            bn: 'ক, গ হলো অল্পপ্রাণ; খ, ঘ হলো মহাপ্রাণ।',
            context: 'শ্বাসবায়ু নির্গমন নীতি',
            highlight: '১-৩ অল্পপ্রাণ | ২-৪ মহাপ্রাণ'
          }
        ]
      }
    ],
    formulas: [
      {
        label: 'উচ্চারণরীতির মাস্টার টেবিল',
        structure: 'কলাম ১: অঘোষ অল্পপ্রাণ | কলাম ২: অঘোষ মহাপ্রাণ | কলাম ৩: ঘোষ অল্পপ্রাণ | কলাম ৪: ঘোষ মহাপ্রাণ | কলাম ৫: ঘোষ নাসিক্য'
      }
    ],
    examples: [
      {
        bn: '"ঘ" হলো কণ্ঠ্য, ঘোষ, মহাপ্রাণ ধ্বনি।',
        context: 'একক বর্ণের পূর্ণাঙ্গ পরিচয়'
      },
      {
        bn: '"প" হলো ওষ্ঠ্য, অঘোষ, অল্পপ্রাণ ধ্বনি।',
        context: 'একক বর্ণের পূর্ণাঙ্গ পরিচয়'
      }
    ],
    exceptions: [
      {
        titleBn: '"হ" বর্ণের ব্যতিক্রমী স্থান',
        descriptionBn: '"হ" কোনো বর্গীয় বর্ণ নয়, এটি কণ্ঠনালিজাত ঘোষ উষ্ম মহাপ্রাণ ধ্বনি হিসেবে গণ্য হয়।'
      }
    ],
    commonMistakes: [
      {
        incorrectBn: '"খ" হলো ঘোষ ধ্বনি।',
        correctBn: '"খ" হলো অঘোষ মহাপ্রাণ ধ্বনি।',
        explanationBn: 'কারণ বর্গের ২য় বর্ণ সবসময় অঘোষ মহাপ্রাণ হয়।'
      }
    ],
    writtenPractice: [
      {
        id: 1,
        type: 'IDENTIFICATION',
        prompt: '"ভ" এবং "চ" বর্ণের উচ্চারণস্থান ও উচ্চারণরীতি নির্ণয় করো।',
        correctAnswer: '"ভ": ওষ্ঠ্য ধ্বনি, ঘোষ ও মহাপ্রাণ। "চ": তালব্য ধ্বনি, অঘোষ ও অল্পপ্রাণ।',
        explanationBn: 'বোর্ড পরীক্ষায় অত্যন্ত কমন প্রশ্ন।'
      }
    ],
    tags: ['ARTICULATION', 'GHOSH', 'OGHOSH', 'OLPOPRAN', 'MOHAPRAN', 'SSC'],
    status: 'PUBLISHED',
    orderIndex: 4,
    viewCount: 240
  },
  {
    id: 10205,
    chapterId: 102,
    parentTopicId: null,
    subject: 'BANGLA',
    topicNo: '২.৫',
    titleBn: 'যুক্তবর্ণের বিশ্লিষ্ট রূপ ও প্রমিত উচ্চারণরীতি',
    titleEn: 'Conjunct Consonants (Yukto Borno) & Standard Pronunciation',
    slug: 'b02-yuktoborno-o-promito-uccharon',
    difficulty: 'BOARD_STANDARD',
    classLevel: 'Class 8 - 12 (SSC & HSC)',
    summaryBn: 'একাধিক ব্যঞ্জনবর্ণ কোনো স্বরবর্ণের ব্যবধান ছাড়া যুক্ত হলে যুক্তবর্ণ গঠিত হয়। যুক্তবর্ণের সঠিক বিশ্লেষণ এবং প্রমিত উচ্চারণ জানা আবশ্যক।',
    definitionBn: 'যুক্তবর্ণ: দুই বা ততোধিক ব্যঞ্জনবর্ণের মাঝে কোনো স্বরধ্বনি না থাকলে তারা একসাথে যুক্ত হয়ে যে একক রূপ ধারণ করে, তাকে যুক্তবর্ণ বলে। যুক্তবর্ণ দুই প্রকার: ১. স্বচ্ছ যুক্তবর্ণ—যেখানে যুক্ত হওয়া বর্ণগুলো সহজে চেনা যায় (যেমন: ক্ত = ক্ + ত, প্ত = প্ + ত)। ২. অস্বচ্ছ যুক্তবর্ণ—যেখানে মূল বর্ণগুলোর রূপ পরিবর্তিত হয়ে নতুন চেহারা নেয় (যেমন: ক্ষ = ক্ + ষ, জ্ঞ = জ্ + ঞ, ষ্ণ = ষ্ + ণ)।',
    definitionEn: 'Conjunct consonants (Yukto Borno) are ligatures formed by combining two or more consonants without an intervening vowel. Standard pronunciation rules dictate the phonetic realization of conjuncts.',
    explanationBn: 'বাংলা যুক্তবর্ণের উচ্চারণরীতিতে কিছু সুনির্দিষ্ট চমকপ্রদ নিয়ম রয়েছে: ১. "ক্ষ"-এর উচ্চারণ: শব্দের শুরুতে বসলে "খ"-এর মতো (যেমন: ক্ষমা = খমা); শব্দের মাঝে বা শেষে বসলে "ক্+খ"-এর মতো (যেমন: পরীক্ষা = পোরিক্খা, রক্ষা = রোক্খা)। ২. "জ্ঞ"-এর উচ্চারণ: শব্দের শুরুতে বসলে "গ্যাঁ"-এর মতো (যেমন: জ্ঞান = গ্যাঁন্); শব্দের মাঝে বা শেষে বসলে "গ্গোঁ/গ্গঁ"-এর মতো (যেমন: বিজ্ঞান = বিগ্গাঁন্, অজ্ঞ = অগ্গোঁ)। ৩. "হ্ম"-এর রূপ ও উচ্চারণ: হ্ম = হ্ + ম (উচ্চারণ: ম্ভ, যেমন: ব্রাহ্মণ = ব্রাম্ভোন্)। ৪. "হ্ন" বনাম "হ্ণ": হ্ন = হ্ + ন (দন্ত্য-ন, যেমন: চিহ্ন = চিন্হো), হ্ণ = হ্ + ণ (মূর্ধন্য-ণ, যেমন: অপরাহ্ণ = অপরাহ্ন)। ৫. ব-ফলা শব্দের শুরুতে বসলে উচ্চারণ হয় না, শুধু বর্ণটি সামান্য ঝোঁক পায় (যেমন: শ্বাস = শাশ্, স্বজন = শজোন্)।',
    teacherGoldenTips: 'পরীক্ষার সর্বাধিক জিজ্ঞাসিত ৫টি অস্বচ্ছ যুক্তবর্ণ: (১) ক্ষ = ক্ + ষ (২) জ্ঞ = জ্ + ঞ (৩) ষ্ণ = ষ্ + ণ (৪) ঙ্ক = ঙ্ + ক (৫) ঙ্গ = ঙ্ + গ। এই ৫টি নির্ভুল জানলে বোর্ডে ফুল মার্কস নিশ্চিত!',
    rules: [
      {
        ruleNo: 1,
        nameBn: 'ব-ফলার উচ্চারণ নিয়ম',
        explanationBn: 'শব্দের প্রথমে ব-ফলা থাকলে উচ্চারিত হয় না (যেমন: স্বদেশ = শদেশ্); শব্দের মাঝে বা শেষে থাকলে সেই বর্ণটি দ্বিত্ব উচ্চারিত হয় (যেমন: বিশ্বাস = বিশ্শাশ্, অশ্ব = অশ্শো)।',
        examples: [
          {
            bn: 'স্বজন (শজোন্) বনাম বিদ্বান (বিদ্দান্)।',
            context: 'ব-ফলার দ্বিত্ব উচ্চারণ'
          }
        ]
      },
      {
        ruleNo: 2,
        nameBn: 'য-ফলার উচ্চারণ নিয়ম',
        explanationBn: 'শব্দের আদিতে য-ফলা থাকলে "অ্যা"-কারন্ত উচ্চারণ হয় (যেমন: ব্যথা = ব্যাথা, ব্যর্থ = ব্যার্থ)। শব্দের মাঝে বা শেষে থাকলে বর্ণটি দ্বিত্ব হয় (যেমন: বিদ্যা = বিদ্দা, সত্য = শোত্তো)।',
        examples: [
          {
            bn: 'ব্যক্তি (ব্যাকতি), কন্যা (কোন্না)।',
            context: 'য-ফলার দ্বিবিধ রূপ'
          }
        ]
      }
    ],
    formulas: [
      {
        label: 'কঠিন যুক্তবর্ণ ভাঙার সূত্র',
        structure: 'ক্ষ = ক্ + ষ | জ্ঞ = জ্ + ঞ | ষ্ণ = ষ্ + ণ | হ্ম = হ্ + ম | ঞ্ছ = ঞ্ + ছ'
      }
    ],
    examples: [
      {
        bn: 'ব্রাহ্মণ (হ্ম = হ্ + ম, উচ্চারণ: ব্রাম্ভোন্)',
        context: 'যুক্তবর্ণ বিশ্লেষণ'
      },
      {
        bn: 'অজ্ঞাত (জ্ঞ = জ্ + ঞ, উচ্চারণ: অগ্গ্যাঁতো)',
        context: 'যুক্তবর্ণ বিশ্লেষণ ও উচ্চারণ'
      }
    ],
    exceptions: [
      {
        titleBn: 'সন্ধিজাত বা ত-বর্গে ব-ফলার অক্ষত উচ্চারণ',
        descriptionBn: 'উদ্‌বাস্তু, দিগ্বিজয় ইত্যাদি শব্দে "ব"-এর উচ্চারণ বজায় থাকে (উদবাস্তু, দিগ্বিজয়)।'
      }
    ],
    commonMistakes: [
      {
        incorrectBn: 'জ্ঞ = গ্ + ঞ অথবা গ্ + য়।',
        correctBn: 'জ্ঞ = জ্ + ঞ (বর্গীয়-জ + ঞ)।',
        explanationBn: 'উচ্চারণ "গ্যাঁ"-এর মতো হলেও গঠন জ্+ঞ।'
      },
      {
        incorrectBn: 'ক্ষ = খ্ + ছ।',
        correctBn: 'ক্ষ = ক্ + ষ (ক + মূর্ধন্য-ষ)।',
        explanationBn: 'উচ্চারণ খ-এর মতো হলেও বর্ণ ক্+ষ।'
      }
    ],
    writtenPractice: [
      {
        id: 1,
        type: 'DECONSTRUCTION',
        prompt: 'নিচের যুক্তবর্ণগুলো ভেঙে দেখাও: (ক) ক্ষ (খ) জ্ঞ (গ) ষ্ণ (ঘ) হ্ম।',
        correctAnswer: '(ক) ক্ষ = ক্ + ষ (খ) জ্ঞ = জ্ + ঞ (গ) ষ্ণ = ষ্ + ণ (ঘ) হ্ম = হ্ + ম।',
        explanationBn: 'এসএসসি পরীক্ষার অত্যন্ত গুরুত্বপূর্ণ বহুনির্বাচনী ও রচনামূলক প্রশ্ন।'
      },
      {
        id: 2,
        type: 'PRONUNCIATION',
        prompt: 'প্রমিত উচ্চারণ লিখ: (ক) জ্ঞান (খ) পরীক্ষা।',
        correctAnswer: '(ক) জ্ঞান = [ গ্যাঁন্ ] (খ) পরীক্ষা = [ পোরিক্খা ]।',
        explanationBn: 'এইচএসসি বাংলা ১ম ও ২য় পত্রের উচ্চারণরীতি অংশ।'
      }
    ],
    tags: ['YUKTOBORNO', 'LIGATURE', 'PRONUNCIATION', 'SSC', 'HSC', 'ADMISSION'],
    status: 'PUBLISHED',
    orderIndex: 5,
    viewCount: 250
  }
];

const CHAPTER_02_MCQS = [
  {
    id: 102001,
    chapterId: 102,
    topicId: 10201,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: 'বাংলা বর্ণমালায় মোট বর্ণের সংখ্যা কতটি?',
    questionEn: 'How many total letters are there in the Bengali alphabet?',
    options: ['৩৯টি', '৪৫টি', '৫০টি', '৫২টি'],
    correctOptionIndex: 2,
    correctAnswerText: '৫০টি',
    explanationBn: 'বাংলা বর্ণমালায় মোট ৫০টি বর্ণ রয়েছে (স্বরবর্ণ ১১টি + ব্যঞ্জনবর্ণ ৩৯টি = ৫০টি)।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'ঢাকা বোর্ড',
    year: 2024,
    examType: 'SSC',
    tags: ['ALPHABET', 'TOTAL_LETTERS', 'DHAKA_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 102002,
    chapterId: 102,
    topicId: 10202,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: 'বাংলা ভাষায় মৌলিক স্বরধ্বনি কয়টি?',
    questionEn: 'How many primary vowel sounds (phonemes) are there in Bengali?',
    options: ['৭টি', '১১টি', '৯টি', '২৫টি'],
    correctOptionIndex: 0,
    correctAnswerText: '৭টি',
    explanationBn: 'বাংলা ভাষায় মৌলিক স্বরধ্বনি ৭টি (অ, আ, ই, উ, এ, ও, অ্যা)। স্বরবর্ণ ১১টি হলেও মৌলিক স্বরধ্বনি ৭টি।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'রাজশাহী বোর্ড',
    year: 2023,
    examType: 'SSC',
    tags: ['VOWELS', 'PHONEMES', 'RAJSHAHI_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 102003,
    chapterId: 102,
    topicId: 10202,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: 'কোন স্বরবর্ণের কোনো সংক্ষিপ্ত কারচিহ্ন নেই?',
    questionEn: 'Which vowel letter has no diacritical mark (Kar)?',
    options: ['আ', 'অ', 'ই', 'ঋ'],
    correctOptionIndex: 1,
    correctAnswerText: 'অ',
    explanationBn: '"অ" স্বরবর্ণের কোনো সংক্ষিপ্ত কারচিহ্ন নেই। এটি ব্যঞ্জনবর্ণের সাথে অন্তর্নিহিত হিসেবে থাকে, একে নীল বর্ণ বা বিলীন বর্ণ বলা হয়।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'যশোর বোর্ড',
    year: 2022,
    examType: 'SSC',
    tags: ['KAR', 'INHERENT_VOWEL', 'JASHORE_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 102004,
    chapterId: 102,
    topicId: 10203,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: 'বাংলা বর্ণমালায় স্পর্শ বর্ণ বা বর্গীয় বর্ণের সংখ্যা কতটি?',
    questionEn: 'How many plosive/stop consonants are there in Bengali?',
    options: ['২০টি', '২৫টি', '৩৯টি', '১১টি'],
    correctOptionIndex: 1,
    correctAnswerText: '২৫টি',
    explanationBn: '"ক" থেকে "ম" পর্যন্ত ২৫টি বর্ণকে স্পর্শ বর্ণ বা বর্গীয় বর্ণ বলা হয়। এরা ৫টি বর্গে বিভক্ত।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'কুমিল্লা বোর্ড',
    year: 2023,
    examType: 'SSC',
    tags: ['PLOSIVES', 'SPORSHO', 'CUMILLA_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 102005,
    chapterId: 102,
    topicId: 10203,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: 'নিচের কোনটি পার্শ্বিক ব্যঞ্জনধ্বনি?',
    questionEn: 'Which of the following is a lateral consonant?',
    options: ['র', 'ল', 'শ', 'ড়'],
    correctOptionIndex: 1,
    correctAnswerText: 'ল',
    explanationBn: '"ল" উচ্চারণের সময় বাতাস জিহ্বার দুই পাশ দিয়ে বের হয়ে যায়, তাই "ল"-কে পার্শ্বিক ধ্বনি বলা হয়। আর "র" হলো কম্পনজাত।',
    difficulty: 'MEDIUM',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'চট্টগ্রাম বোর্ড',
    year: 2023,
    examType: 'SSC',
    tags: ['LATERAL', 'PARSHWIK', 'CHITTAGONG_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 102006,
    chapterId: 102,
    topicId: 10203,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: 'নিচের কোন দুটি ধ্বনি তাড়নজাত ধ্বনি?',
    questionEn: 'Which two sounds are flap/retroflex flap consonants?',
    options: ['ড, ঢ', 'ড়, ঢ়', 'র, ল', 'ণ, ন'],
    correctOptionIndex: 1,
    correctAnswerText: 'ড়, ঢ়',
    explanationBn: '"ড়" এবং "ঢ়" উচ্চারণের সময় জিহ্বার অগ্রভাগ উল্টে ওপরের পাটিতে এক ধরনের তাড়না বা টোকা দেয়, তাই এদের তাড়নজাত ধ্বনি বলে।',
    difficulty: 'MEDIUM',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'দিনাজপুর বোর্ড',
    year: 2024,
    examType: 'SSC',
    tags: ['TARONJATO', 'DINISHPUR_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 102007,
    chapterId: 102,
    topicId: 10204,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: 'বর্গের কোন কোন বর্ণ ঘোষ ধ্বনি?',
    questionEn: 'Which letters in a consonant class are voiced (Ghosh)?',
    options: ['১ম ও ২য়', '১ম ও ৩য়', '৩য়, ৪র্থ ও ৫ম', '২য় ও ৪র্থ'],
    correctOptionIndex: 2,
    correctAnswerText: '৩য়, ৪র্থ ও ৫ম',
    explanationBn: 'বর্গের ৩য়, ৪র্থ ও ৫ম বর্ণ উচ্চারণের সময় স্বরতন্ত্রী অনুরণিত হয় বলে এরা ঘোষ ধ্বনি। ১ম ও ২য় বর্ণ অঘোষ।',
    difficulty: 'MEDIUM',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'সিলেট বোর্ড',
    year: 2023,
    examType: 'SSC',
    tags: ['GHOSH', 'VOICED', 'SYLHET_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 102008,
    chapterId: 102,
    topicId: 10204,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: 'বর্গের কোন কোন বর্ণ মহাপ্রাণ ধ্বনি?',
    questionEn: 'Which letters in a consonant class are aspirated (Mahapran)?',
    options: ['১ম ও ৩য়', '২য় ও ৪র্থ', '৩য় ও ৫ম', '১ম ও ৪র্থ'],
    correctOptionIndex: 1,
    correctAnswerText: '২য় ও ৪র্থ',
    explanationBn: 'বর্গের ২য় ও ৪র্থ বর্ণ উচ্চারণে বাতাসের আধিক্য থাকে বলে এরা মহাপ্রাণ ধ্বনি (যেমন: খ, ঘ, ছ, ঝ)। ১ম ও ৩য় বর্ণ অল্পপ্রাণ।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'ময়মনসিংহ বোর্ড',
    year: 2024,
    examType: 'SSC',
    tags: ['MAHAPRAN', 'MYMENSINGH_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 102009,
    chapterId: 102,
    topicId: 10205,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: '"জ্ঞ" যুক্তবর্ণটির সঠিক বিশ্লিষ্ট রূপ কোনটি?',
    questionEn: 'What is the correct breakdown of the ligature "জ্ঞ"?',
    options: ['গ্ + ঞ', 'জ্ + ঞ', 'জ্ + ণ', 'গ্ + য'],
    correctOptionIndex: 1,
    correctAnswerText: 'জ্ + ঞ',
    explanationBn: '"জ্ঞ" যুক্তবর্ণটি তৈরি হয় বর্গীয় "জ" এবং "ঞ" এর সংযোগে (জ্ + ঞ)। যদিও এর উচ্চারণ "গ্যাঁ"-এর মতো হয়।',
    difficulty: 'MEDIUM',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'বরিশাল বোর্ড',
    year: 2023,
    examType: 'SSC',
    tags: ['YUKTOBORNO', 'BREAKDOWN', 'BARISAL_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 102010,
    chapterId: 102,
    topicId: 10205,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: '"ক্ষ" যুক্তবর্ণটিতে কোন কোন বর্ণ যুক্ত রয়েছে?',
    questionEn: 'Which letters form the ligature "ক্ষ"?',
    options: ['ক্ + ছ', 'ক্ + ষ', 'খ্ + ষ', 'হ্ + ষ'],
    correctOptionIndex: 1,
    correctAnswerText: 'ক্ + ষ',
    explanationBn: '"ক্ষ" হলো ক্ + ষ (ক এবং মূর্ধন্য-ষ)। শব্দের শুরুতে বসলে উচ্চারণ "খ"-এর মতো এবং মাঝে বা শেষে বসলে "ক্+খ"-এর মতো হয়।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'ঢাকা বোর্ড',
    year: 2022,
    examType: 'SSC',
    tags: ['YUKTOBORNO', 'KHIYO', 'DHAKA_BOARD'],
    status: 'ACTIVE'
  }
];

const CHAPTER_02_MODEL_TEST = {
  id: 10201,
  subject: 'BANGLA',
  chapterId: 102,
  testTitleBn: 'অধ্যায় ০২ মডেল টেস্ট: ধ্বনি ও বর্ণ',
  testTitleEn: 'Chapter 02 Model Test: Phonetics & Bengali Alphabet',
  descriptionBn: 'স্বরধ্বনি, ব্যঞ্জনধ্বনি, উচ্চারণ স্থান, অল্পপ্রাণ-মহাপ্রাণ, অঘোষ-ঘোষ এবং যুক্তবর্ণের ওপর এসএসসি ও বোর্ড স্ট্যান্ডার্ড পূর্ণাঙ্গ মডেল টেস্ট।',
  durationMinutes: 15,
  totalMarks: 10,
  passPercentage: 60,
  difficulty: 'MEDIUM',
  questionCount: 10,
  questionIds: [102001, 102002, 102003, 102004, 102005, 102006, 102007, 102008, 102009, 102010],
  status: 'PUBLISHED'
};

module.exports = {
  CHAPTER_02_TOPICS,
  CHAPTER_02_MCQS,
  CHAPTER_02_MODEL_TEST
};
