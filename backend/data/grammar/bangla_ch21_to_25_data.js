/**
 * Bangla Grammar Chapters 21–25 Content:
 * Chapter 21: সন্ধি (Shondhi / Euphonic Junction)
 * Chapter 22: সমাস (Shomash / Compound Words)
 * Chapter 23: উপসর্গ (Uposhurgo / Prefixes)
 * Chapter 24: প্রত্যয় (Prottoy / Suffixes)
 * Chapter 25: শব্দগঠন পদ্ধতি (Word Formation: Moulik, Shadhito, Yowgik, Rudho, Yogrudho)
 * 
 * Fully structured according to NCTB/SSC/HSC standards with 13-section format.
 */

// ============================================================================
// CHAPTER 21: সন্ধি (Shondhi)
// ============================================================================
const CHAPTER_21_TOPICS = [
  {
    id: 12101,
    chapterId: 121,
    parentTopicId: null,
    subject: 'BANGLA',
    topicNo: '২১.১',
    titleBn: 'সন্ধির সংজ্ঞা, উদ্দেশ্য, প্রয়োজনীয়তা ও প্রকারভেদ',
    titleEn: 'Definition of Shondhi, Objectives, Necessity & Types',
    slug: 'b21-shondhi-shongpga-o-prokarbhed',
    difficulty: 'BOARD_STANDARD',
    classLevel: 'Class 8 - 12 (SSC & HSC)',
    summaryBn: 'পাশাপাশি অবস্থিত দুটি ধ্বনির মিলনকে সন্ধি বলে। সন্ধির প্রধান উদ্দেশ্য উচ্চারণের সহজসাধ্যতা ও ধ্বনিমাধুর্য সৃষ্টি।',
    definitionBn: 'সন্ধি (Euphonic Junction / Shondhi): পাশাপাশি অবস্থিত দুটি ধ্বনির মিলন, রূপান্তর বা লোপ পাওয়াকে ব্যাকরণে সন্ধি বলে (সন্ধি শব্দের আভিধানিক অর্থ মিলন)। যেমন: বিদ্যা + আলয় = বিদ্যালয়; পরি + ঈক্ষা = পরীক্ষা; দিক্ + অন্ত = দিগন্ত। সন্ধির উদ্দেশ্য দুটি: ১. উচ্চারণে সহজপ্রবৃত্তি বা ধ্বনিগত স্বাচ্ছন্দ্য আনা, এবং ২. ধ্বনিমাধুর্য সৃষ্টি করা। সন্ধি প্রধানত দুই প্রকার: বাংলা সন্ধি (স্বর ও ব্যঞ্জন) এবং তৎসম সন্ধি (স্বরসন্ধি, ব্যঞ্জনসন্ধি ও বিসর্গসন্ধি)।',
    definitionEn: 'Shondhi is the euphonic coalescence or combination of two contiguous sounds (vowels or consonants) to achieve phonetic ease and auditory cadence.',
    explanationBn: 'সন্ধির ক্ষেত্রে প্রথম শব্দের শেষ ধ্বনি এবং দ্বিতীয় শব্দের প্রথম ধ্বনির মিলন ঘটে। সন্ধি ও সমাসের পার্থক্য অত্যন্ত গুরুত্বপূর্ণ: সন্ধি হলো "ধ্বনির সঙ্গে ধ্বনির মিলন" (Phonetic), আর সমাস হলো "অর্থের দিক থেকে একাধিক পদের একপদীভবন" (Semantic/Syntactic)। যেমন: "বিদ্যা + আলয় = বিদ্যালয়" হলো সন্ধি; আর "বিদ্যার নিমিত্ত আলয় = বিদ্যালয়" হলো সমাস। খাঁটি বাংলায় সন্ধি তুলনামূলক কম হয়, কিন্তু সংস্কৃত বা তৎসম শব্দে সন্ধির নিয়ম অত্যন্ত শৃঙ্খলাবদ্ধ। সন্ধি না হলে ভাষা অপ্রাকৃতিক ও শ্রুতিকটু শোনায় (যেমন: "বিদ্যা আলয়ে যাইব" না বলে "বিদ্যালয়ে যাব" বলা সহজ ও সুন্দর)।',
    teacherGoldenTips: 'গোল্ডেন পার্থক্য সূত্র: ধ্বনির মিলন = সন্ধি (Sound Union)! পদের মিলন = সমাস (Word Union)! পরীক্ষার খাতায় যদি মিলন শব্দটি ধ্বনি নিয়ে বলে চোখ বন্ধ করে সন্ধি টিক দেবেন!',
    rules: [
      {
        ruleNo: 1,
        nameBn: 'ধ্বনির মিলন ও রূপান্তর রীতি',
        explanationBn: 'সন্ধিতে কখনো দুই ধ্বনি মিলে এক হয়, কখনো একটি ধ্বনি বদলে যায়, আবার কখনো একটি ধ্বনি পুরোপুরি লোপ পায়।',
        examples: [
          {
            bn: 'বিদ্যা + আলয় = বিদ্যালয় (দুই ধ্বনি মিলে এক); সৎ + জন = সজ্জন (ত্ ধ্বনি জ্-এ রূপান্তরিত); ঘোড়া + এর = ঘোড়ার (ধ্বনি লোপ)।',
            context: 'সন্ধির ত্রিবিধ রূপ'
          }
        ]
      },
      {
        ruleNo: 2,
        nameBn: 'সন্ধির অপরিহার্যতা ও ঐচ্ছিকতা',
        explanationBn: 'তৎসম শব্দে এবং একপদ ও ধাতুর ক্ষেত্রে সন্ধি বাধ্যতামূলক (যেমন: গায়ক = গৈ + অক), তবে বাক্যে সাধারণ ব্যবহারে অনেক সময় সন্ধি ঐচ্ছিক।',
        examples: [
          {
            bn: 'পৌর + অঙ্গনা = পৌরাঙ্গনা (বাধ্যতামূলক); তিনি ভাত খাইবেন (ঐচ্ছিক)।',
            context: 'বাধ্যতামূলক বনাম ঐচ্ছিক'
          }
        ]
      }
    ],
    formulas: [
      {
        label: 'সন্ধি সমীকরণ',
        structure: 'প্রথম শব্দের শেষ ধ্বনি + দ্বিতীয় শব্দের প্রথম ধ্বনি = সন্ধিবদ্ধ নতুন ধ্বনি'
      }
    ],
    examples: [
      {
        bn: 'হিম + আলয় = হিমালয় (অ + আ = আ)',
        context: 'স্বরসন্ধি'
      },
      {
        bn: 'উৎ + চারণ = উচ্চারণ (ত্ + চ = চ্ছ)',
        context: 'ব্যঞ্জনসন্ধি'
      }
    ],
    exceptions: [
      {
        titleBn: 'নিপাতনে সিদ্ধ সন্ধি',
        descriptionBn: 'যেসব সন্ধি কোনো প্রচলিত ব্যাকরণিক সূত্র মানে না অথচ প্রমিত ভাষায় শুদ্ধ হিসেবে স্বীকৃত, তাদের নিপাতনে সিদ্ধ সন্ধি বলে (যেমন: একাদশ, বৃহস্পতি, পরস্পর, পতঞ্জলি)।'
      }
    ],
    commonMistakes: [
      {
        incorrectBn: 'সন্ধি হলো দুই পদের মিলন।',
        correctBn: 'সন্ধি হলো দুই ধ্বনির মিলন; সমাস হলো দুই বা ততোধিক পদের মিলন।',
        explanationBn: 'পদ ও ধ্বনির পার্থক্য স্পষ্ট রাখা আবশ্যক।'
      },
      {
        incorrectBn: 'পরীক্ষা = পরি + ইক্ষা (হ্রস্ব-ই)।',
        correctBn: 'পরীক্ষা = পরি + ঈক্ষা (দীর্ঘ-ঈ)।',
        explanationBn: 'ঈক্ষা শব্দে দীর্ঘ-ঈ কার আবশ্যক।'
      }
    ],
    writtenPractice: [
      {
        id: 1,
        type: 'DIFFERENCE',
        prompt: 'সন্ধি ও সমাসের মধ্যে দুটি মৌলিক পার্থক্য উদাহরণসহ লিখ।',
        correctAnswer: '১. সন্ধি হলো পাশাপাশি দুটি ধ্বনির মিলন (যেমন: বিদ্যা + আলয় = বিদ্যালয়)। সমাস হলো অর্থগতভাবে সম্পর্কিত একাধিক পদের মিলন (যেমন: বিদ্যার আলয় = বিদ্যালয়)। ২. সন্ধিতে ধ্বনির পরিবর্তন ঘটে, সমাসে বিভক্তি লোপ পায় ও পদের একপদীভবন ঘটে।',
        explanationBn: 'বোর্ড পরীক্ষার অত্যন্ত জনপ্রিয় ৩ নম্বরের প্রশ্ন।'
      }
    ],
    tags: ['SHONDHI', 'EUPHONIC_JUNCTION', 'SWARASHONDHI', 'DEFINITION', 'SSC', 'HSC'],
    status: 'PUBLISHED',
    orderIndex: 1,
    viewCount: 310
  },
  {
    id: 12102,
    chapterId: 121,
    parentTopicId: null,
    subject: 'BANGLA',
    topicNo: '২১.২',
    titleBn: 'স্বরসন্ধি ও ব্যঞ্জনসন্ধির প্রধান সূত্রাবলি ও বিশ্লেষণ',
    titleEn: 'Rules of Vowel (Swara) & Consonant (Byanjon) Shondhi',
    slug: 'b21-swarashondhi-o-byanjonshondhi-rules',
    difficulty: 'BOARD_STANDARD',
    classLevel: 'Class 8 - 12 (SSC & HSC)',
    summaryBn: 'স্বরে স্বরে মিলন হলো স্বরসন্ধি; স্বর ও ব্যঞ্জন অথবা ব্যঞ্জনে ব্যঞ্জনে মিলন হলো ব্যঞ্জনসন্ধি।',
    definitionBn: 'স্বরসন্ধি ও ব্যঞ্জনসন্ধি: ১. স্বরসন্ধি: স্বরধ্বনির সাথে স্বরধ্বনির মিলনকে স্বরসন্ধি বলে (অ/আ, ই/ঈ, উ/ঊ, ঋ, এ/ঐ, ও/ঔ-এর পারস্পরিক সংযোগ)। ২. ব্যঞ্জনসন্ধি: স্বরধ্বনির সাথে ব্যঞ্জনধ্বনি, ব্যঞ্জনধ্বনির সাথে স্বরধ্বনি অথবা ব্যঞ্জনধ্বনির সাথে ব্যঞ্জনধ্বনির মিলনকে ব্যঞ্জনসন্ধি বলে।',
    definitionEn: 'Vowel Sandhi occurs strictly between vowels (e.g., a+a=aa). Consonant Sandhi involves consonants interacting with vowels or other consonants with assimilation.',
    explanationBn: 'পরীক্ষায় ১০০% কমন আসা প্রধান সূত্রাবলি:\n১. অ/আ + ই/ঈ = এ (শুভ + ইচ্ছা = শুভেচ্ছা, নর + ঈশ = নরেশ)\n২. অ/আ + উ/ঊ = ও (সূর্য + উদয় = সূর্যোদয়, চল + ঊর্মি = চলোর্মি)\n৩. অ/আ + ঋ = অর্ (দেব + ঋষি = দেবর্ষি, সপ্ত + ঋষি = সপ্তর্ষি)\n৪. অ/আ + এ/ঐ = ঐ (জন + এক = জনৈক, মত + ঐক্য = মতৈক্য)\n৫. ই/ঈ + ভিন্ন স্বর = য-ফলা (যদি + অপি = যদ্যপি, ইতি + আদি = ইত্যাদি, অতি + অন্ত = অত্যন্ত)\n৬. উ/ঊ + ভিন্ন স্বর = ব-ফলা (অনু + অয় = অন্বয়, সু + আগত = স্বাগত)\n৭. এ/ঐ/ও/ঔ + ভিন্ন স্বর = অয়/আয়/অব/আব (নে + অন = নয়ন, গৈ + অক = গায়ক, পো + অন = পবন, পৌ + অক = পাবক)\n৮. ব্যঞ্জনসন্ধি সূত্র: ত্/দ্ + চ/ছ = চ্ছ (উৎ + চারণ = উচ্চারণ, উৎ + ছেদ = উচ্ছেদ); ত্/দ্ + জ/ঝ = জ্জ (উৎ + জ্বল = উজ্জ্বল, বিপদ + জনক = বিপজ্জনক); ত্/দ্ + ল = ল্ল (উৎ + লেখ = উল্লেখ); সম্ + কৃত = সংস্কৃত; সম্ + বাদ = সংবাদ।',
    teacherGoldenTips: 'ম্যাজিক ফর্মুলা ডিকোড: (১) শব্দে "য-ফলা" দেখলে ভাঙবেন "ই" দিয়ে: ইত্যাদি = ইতি + আদি; অত্যন্ত = অতি + অন্ত। (২) শব্দে "ব-ফলা" দেখলে ভাঙবেন "উ" দিয়ে: স্বাগত = সু + আগত; অন্বয় = অনু + অয়। (৩) "ঐ-কার" থাকলে ভাঙবেন "এ" দিয়ে: জনৈক = জন + এক। (৪) "ঔ-কার" থাকলে ভাঙবেন "ও" দিয়ে: বনৌষধি = বন + ওষধি।',
    rules: [
      {
        ruleNo: 1,
        nameBn: 'য-ফলা ও ব-ফলা গঠন সূত্র',
        explanationBn: 'ই/ঈ-র পর অন্য স্বর থাকলে ই/ঈ স্থানে য-ফলা হয়; উ/ঊ-র পর অন্য স্বর থাকলে উ/ঊ স্থানে ব-ফলা হয়।',
        examples: [
          {
            bn: 'প্রতি + এক = প্রত্যেক; অনু + এষণ = অন্বেষণ; সু + অল্প = স্বল্প।',
            context: 'য-ফলা ও ব-ফলা'
          }
        ]
      },
      {
        ruleNo: 2,
        nameBn: 'উজ্জ্বল ও উচ্ছ্বাস বানান সূত্র',
        explanationBn: 'উৎ + জ্বল = উজ্জ্বল (ব-ফলাসহ জ্জ); উৎ + শ্বাস = উচ্ছ্বাস (ব-ফলাসহ চ্ছ)।',
        examples: [
          {
            bn: 'উজ্জ্বল (উ + জ্জ্ব + ল); উচ্ছ্বাস (উ + চ্ছ্ব + াস)।',
            context: 'সন্ধিজাত শুদ্ধ বানান'
          }
        ]
      }
    ],
    formulas: [
      {
        label: 'সুপার হিট সন্ধি সূত্র',
        structure: 'ই + অন্য স্বর = য-ফলা | উ + অন্য স্বর = ব-ফলা | এ + স্বর = অয় | ও + স্বর = অব'
      }
    ],
    examples: [
      {
        bn: 'গৈ + অক = গায়ক (ঐ + অ = আয়)',
        context: 'স্বরসন্ধি'
      },
      {
        bn: 'উৎ + লাস = উল্লাস (ত্ + ল = ল্ল)',
        context: 'ব্যঞ্জনসন্ধি'
      }
    ],
    exceptions: [
      {
        titleBn: 'কুলাটা ও গবাক্ষ নিপাতন',
        descriptionBn: 'কুল + অটা = কুলটা (কুলাটা ❌); গো + অক্ষ = গবাক্ষ (গোয়ক্ষ ❌)। এগুলো নিপাতনে সিদ্ধ।'
      }
    ],
    commonMistakes: [
      {
        incorrectBn: 'উজ্জল (এক জ দিয়ে লেখা)।',
        correctBn: 'উজ্জ্বল (উৎ + জ্বল = উজ্জ্বল, দুটি জ এবং ব-ফলা)।',
        explanationBn: 'সন্ধির নিয়মে খণ্ড-ত জ-এ পরিণত হয়ে দ্বিত্ব জ্জ্ব গঠন করে।'
      }
    ],
    writtenPractice: [
      {
        id: 1,
        type: 'TRANSFORMATION',
        prompt: 'সন্ধিবিচ্ছেদ করো: (ক) ইত্যাদি (খ) স্বাগত (গ) পাবক (ঘ) উল্লাস।',
        correctAnswer: '(ক) ইত্যাদি = ইতি + আদি (খ) স্বাগত = সু + আগত (গ) পাবক = পৌ + অক (ঘ) উল্লাস = উৎ + লাস।',
        explanationBn: 'বোর্ড পরীক্ষার ক্লাসিক সন্ধিবিচ্ছেদ।'
      }
    ],
    tags: ['SWARASHONDHI', 'BYANJONSHONDHI', 'SHUTRO', 'EXAMPLES', 'SSC', 'HSC'],
    status: 'PUBLISHED',
    orderIndex: 2,
    viewCount: 340
  },
  {
    id: 12103,
    chapterId: 121,
    parentTopicId: null,
    subject: 'BANGLA',
    topicNo: '২১.৩',
    titleBn: 'বিসর্গসন্ধি ও নিপাতনে সিদ্ধ সন্ধি',
    titleEn: 'Visarga Shondhi & Irregular (Nipatone Shiddho) Sandhi',
    slug: 'b21-bisorgoshondhi-o-nipatone-shiddho',
    difficulty: 'BOARD_STANDARD',
    classLevel: 'Class 8 - 12 (SSC & HSC)',
    summaryBn: 'বিসর্গের সাথে স্বর বা ব্যঞ্জনধ্বনির মিলনকে বিসর্গসন্ধি বলে। বিসর্গ মূলত "র্" ও "স্"-এর সংক্ষিপ্ত রূপ। নিয়মবহির্ভূত সন্ধি হলো নিপাতনে সিদ্ধ সন্ধি।',
    definitionBn: 'বিসর্গসন্ধি: বিসর্গের (ঃ) সাথে স্বরধ্বনি বা ব্যঞ্জনধ্বনির যে সন্ধি হয়, তাকে বিসর্গসন্ধি বলে। বিসর্গ দুই প্রকার ধ্বনি থেকে উৎপন্ন হয়: র-জাত বিসর্গ (অন্তর > অন্তঃ) এবং স-জাত বিসর্গ (নমস > নমঃ)। নিপাতনে সিদ্ধ সন্ধি: যেসব সন্ধি কোনো সাধারণ নিয়মের অধীন নয়, কিন্তু বহুকাল ধরে ভাষায় প্রমিত হিসেবে চলে আসছে, তাদের নিপাতনে সিদ্ধ সন্ধি বলে।',
    definitionEn: 'Visarga Sandhi involves coalescence with Visarga (representing historical -r or -s). Irregular (Nipatone Shiddho) Sandhi defies regular euphonic formulas.',
    explanationBn: 'বিসর্গসন্ধির ৩টি প্রধান নিয়ম যা পরীক্ষায় নিশ্চিত আসে:\n১. বিসর্গ + চ/ছ = শ্চ (নিঃ + চয় = নিশ্চয়, শিরঃ + ছেদ = শিরশ্ছেদ)\n২. বিসর্গ + ত/থ = স্ত (ইতঃ + ততঃ = ইতস্তত, দুঃ + তর = দুস্তর)\n৩. অ-কারযুক্ত বিসর্গের পর ঘোষ ব্যঞ্জন থাকলে বিসর্গ ও-কারে পরিণত হয় (মনঃ + গত = মনোগত, মনঃ + হর = মনোহর, বয়ঃ + জ্যেষ্ঠ = বয়োজ্যেষ্ঠ, যশঃ + দা = যশোদা)।\n৪. ই/উ কারের পর বিসর্গ থাকলে এবং পরে ক, খ, প, ফ থাকলে বিসর্গ মূর্ধন্য-ষ হয় (নিঃ + পাপ = নিষ্পাপ, নিঃ + ফল = নিষ্ফল, আবিঃ + কার = আবিষ্কার)।\nনিপাতনে সিদ্ধ সন্ধির সুপারস্টার তালিকা:\n- গো + অক্ষ = গবাক্ষ\n- পতৎ + অঞ্জলি = পতঞ্জলি\n- এক + দশ = একাদশ\n- বৃহৎ + পতি = বৃহস্পতি\n- বন + পতি = বনস্পতি\n- পর + পর = পরস্পর\n- তৎ + কর = তস্কর\n- ষট্ + দশ = ষোড়শ\n- অন্য + অন্য = অন্যান্য।',
    teacherGoldenTips: 'ম্যাজিক কোড: শব্দে যদি "ও-কার" (মনোগত, বয়োজ্যেষ্ঠ), "শ্চ" (নিশ্চয়), "স্ত" (নমস্কার), "ষ্ক/ষ্ফ" (নিষ্ফল, পরিষ্কার) থাকে, তবে সন্ধিবিচ্ছেদে মাঝখানে নিশ্চিত বিসর্গ (ঃ) বসবে! যেমন: মনোগত = মনঃ + গত; নিষ্ফল = নিঃ + ফল!',
    rules: [
      {
        ruleNo: 1,
        nameBn: 'ও-কার বিসর্গ রূপান্তর',
        explanationBn: 'অ-কারের পর বিসর্গ থাকলে ঘোষ ধ্বনির সংযোগে বিসর্গটি ও-কার ধারণ করে।',
        examples: [
          {
            bn: 'তিরঃ + ধান = তিরোধান; মনঃ + যোগ = মনোযোগ; তপঃ + বন = তপোবন।',
            context: 'বিসর্গ থেকে ও-কার'
          }
        ]
      }
    ],
    formulas: [
      {
        label: 'বিসর্গসন্ধি রূপান্তর ছক',
        structure: 'বিসর্গ + চ/ছ = শ্চ | বিসর্গ + ত/থ = স্ত | বিসর্গ + ক/প = ষ্ক/ষ্প | বিসর্গ + ঘোষ = ও-কার'
      }
    ],
    examples: [
      {
        bn: 'নমঃ + কার = নমস্কার (স-জাত বিসর্গ)',
        context: 'বিসর্গসন্ধি'
      },
      {
        bn: 'বৃহৎ + পতি = বৃহস্পতি (নিপাতনে সিদ্ধ)',
        context: 'নিপাতনে সিদ্ধ'
      }
    ],
    exceptions: [
      {
        titleBn: 'অহর্নিশ বনাম অহোরহ',
        descriptionBn: 'অহঃ + নিশা = অহর্নিশ (অহোনিশি ❌); কিন্তু অহঃ + অহ = অহোরহ (বিসর্গ ও-কার হয়েছে)।'
      }
    ],
    commonMistakes: [
      {
        incorrectBn: 'মনযোগ, তিরধান।',
        correctBn: 'মনোযোগ, তিরোধান।',
        explanationBn: 'বিসর্গসন্ধিজাত ও-কার রক্ষা করা আবশ্যক।'
      },
      {
        incorrectBn: 'পরস্পর = পর + পর (নিয়মমাফিক রূপ)।',
        correctBn: 'পরস্পর হলো নিপাতনে সিদ্ধ সন্ধি।',
        explanationBn: 'এটি কোনো সুনির্দিষ্ট সূত্রের অধীন নয়।'
      }
    ],
    writtenPractice: [
      {
        id: 1,
        type: 'IDENTIFICATION',
        prompt: 'নিচের সন্ধিবিচ্ছেদগুলো সম্পন্ন করো এবং কোনটি নিপাতনে সিদ্ধ চিহ্নিত করো: (ক) নিশ্চয় (খ) মনোহর (গ) পরস্পর (ঘ) গবাক্ষ।',
        correctAnswer: '(ক) নিশ্চয় = নিঃ + চয় (বিসর্গসন্ধি)। (খ) মনোহর = মনঃ + হর (বিসর্গসন্ধি)। (গ) পরস্পর = পর + পর (নিপাতনে সিদ্ধ সন্ধি)। (ঘ) গবাক্ষ = গো + অক্ষ (নিপাতনে সিদ্ধ সন্ধি)।',
        explanationBn: 'বোর্ড পরীক্ষার স্ট্যান্ডার্ড ৪ নম্বরের প্রশ্ন।'
      }
    ],
    tags: ['BISORGO_SHONDHI', 'NIPATONE_SHIDDHO', 'BRIHOSHPOTI', 'POROSHPOR', 'SSC', 'HSC'],
    status: 'PUBLISHED',
    orderIndex: 3,
    viewCount: 360
  }
];

const CHAPTER_21_MCQS = [
  {
    id: 121001,
    chapterId: 121,
    topicId: 12101,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: 'সন্ধির প্রধান উদ্দেশ্য কোনটি?',
    questionEn: 'What is the primary purpose of Shondhi?',
    options: ['উচ্চারণে সহজসাধ্যতা ও ধ্বনিমাধুর্য সৃষ্টি', 'শব্দের অর্থ পরিবর্তন করা', 'নতুন পদ সৃষ্টি করা', 'বাক্যের দৈর্ঘ্য বৃদ্ধি করা'],
    correctOptionIndex: 0,
    correctAnswerText: 'উচ্চারণে সহজসাধ্যতা ও ধ্বনিমাধুর্য সৃষ্টি',
    explanationBn: 'সন্ধির প্রধান উদ্দেশ্য হলো স্বাভাবিক উচ্চারণে সহজপ্রবৃত্তি আনা এবং শ্রুতিমধুর ধ্বনিমাধুর্য সৃষ্টি করা।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'ঢাকা বোর্ড',
    year: 2024,
    examType: 'SSC',
    tags: ['SHONDHI', 'PURPOSE', 'DHAKA_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 121002,
    chapterId: 121,
    topicId: 12102,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: '"ইত্যাদি" শব্দের সঠিক সন্ধিবিচ্ছেদ কোনটি?',
    questionEn: 'What is the correct sandhi splitting for "Ityadi"?',
    options: ['ইতি + আদি', 'ইত + আদি', 'ইত্যা + দি', 'ইতি + আধি'],
    correctOptionIndex: 0,
    correctAnswerText: 'ইতি + আদি',
    explanationBn: 'ই-কারের পর অন্য স্বরধ্বনি (আ) থাকায় ই-কার য-ফলা হয়েছে: ইতি + আদি = ইত্যাদি।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'রাজশাহী বোর্ড',
    year: 2023,
    examType: 'SSC',
    tags: ['ITYADI', 'VOWEL_SANDHI', 'RAJSHAHI_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 121003,
    chapterId: 121,
    topicId: 12102,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: '"পাবক" শব্দের সঠিক সন্ধিবিচ্ছেদ কোনটি?',
    questionEn: 'What is the correct sandhi splitting for "Pabok"?',
    options: ['পৌ + অক', 'পো + অক', 'পা + বক', 'পব + অক'],
    correctOptionIndex: 0,
    correctAnswerText: 'পৌ + অক',
    explanationBn: 'ঔ-কারের পর অ থাকলে "আব" হয়, তাই পৌ + অক = পাবক (পো + অন = পবন)।',
    difficulty: 'MEDIUM',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'যশোর বোর্ড',
    year: 2024,
    examType: 'SSC',
    tags: ['PABOK', 'JASHORE_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 121004,
    chapterId: 121,
    topicId: 12103,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: 'নিচের কোনটি নিপাতনে সিদ্ধ সন্ধির উদাহরণ?',
    questionEn: 'Which of the following is an example of irregular (Nipatone Shiddho) Sandhi?',
    options: ['পরস্পর', 'বিদ্যালয়', 'শুভেচ্ছা', 'উচ্চারণ'],
    correctOptionIndex: 0,
    correctAnswerText: 'পরস্পর',
    explanationBn: 'পর + পর = পরস্পর; এটি কোনো সাধারণ নিয়মের অধীন না হয়ে নিপাতনে সিদ্ধ হয়েছে।',
    difficulty: 'MEDIUM',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'কুমিল্লা বোর্ড',
    year: 2023,
    examType: 'SSC',
    tags: ['NIPATONE_SHIDDHO', 'POROSHPOR', 'CUMILLA_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 121005,
    chapterId: 121,
    topicId: 12103,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: '"মনোগত" শব্দের সঠিক সন্ধিবিচ্ছেদ কোনটি?',
    questionEn: 'What is the correct sandhi splitting for "Monogoto"?',
    options: ['মনঃ + গত', 'মন + গত', 'মনো + গত', 'মনস + গত'],
    correctOptionIndex: 0,
    correctAnswerText: 'মনঃ + গত',
    explanationBn: 'বিসর্গের পর ঘোষ ব্যঞ্জন "গ" থাকায় বিসর্গটি ও-কার ধারণ করেছে: মনঃ + গত = মনোগত।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'চট্টগ্রাম বোর্ড',
    year: 2024,
    examType: 'SSC',
    tags: ['BISORGO_SHONDHI', 'MONOGOTO', 'CHITTAGONG_BOARD'],
    status: 'ACTIVE'
  }
];

const CHAPTER_21_MODEL_TEST = {
  id: 12101,
  subject: 'BANGLA',
  chapterId: 121,
  testTitleBn: 'অধ্যায় ২১ মডেল টেস্ট: সন্ধি',
  testTitleEn: 'Chapter 21 Model Test: Euphonic Junction (Shondhi)',
  descriptionBn: 'স্বরসন্ধি, ব্যঞ্জনসন্ধি, বিসর্গসন্ধি, নিপাতনে সিদ্ধ সন্ধি ও সন্ধিবিচ্ছেদের ওপর পূর্ণাঙ্গ মডেল টেস্ট।',
  durationMinutes: 10,
  totalMarks: 5,
  passPercentage: 60,
  difficulty: 'MEDIUM',
  questionCount: 5,
  questionIds: [121001, 121002, 121003, 121004, 121005],
  status: 'PUBLISHED'
};

// ============================================================================
// CHAPTER 22: সমাস (Shomash)
// ============================================================================
const CHAPTER_22_TOPICS = [
  {
    id: 12201,
    chapterId: 122,
    parentTopicId: null,
    subject: 'BANGLA',
    topicNo: '২২.১',
    titleBn: 'সমাসের সংজ্ঞা, পারিভাষিক শব্দ ও প্রধান শ্রেণিবিভাগ',
    titleEn: 'Definition of Shomash, Terminology & 6 Major Classifications',
    slug: 'b22-shomash-shongpga-o-prokarbhed',
    difficulty: 'BOARD_STANDARD',
    classLevel: 'Class 8 - 12 (SSC & HSC)',
    summaryBn: 'অর্থের দিক থেকে পারস্পরিক সম্পর্কযুক্ত একাধিক পদের একপদে পরিণত হওয়াকে সমাস বলে। সমাস প্রধানত ৬ প্রকার।',
    definitionBn: 'সমাস (Compound Words / Shomash): অর্থগতভাবে সংগতিপূর্ণ একাধিক পদের একপদীভবন বা সংক্ষিপ্ত রূপকে সমাস বলে (সমাস শব্দের অর্থ সংক্ষেপণ, মিলন, একাধিক পদের একপদীভবন)। যেমন: সিংহাসন (সিংহ চিহ্নিত আসন)। সমাসের ৫টি মৌলিক পারিভাষিক শব্দ:\n১. সমস্তপদ: সমাস নিষ্পন্ন চূড়ান্ত পদটিকে সমস্তপদ বলে (যেমন: "সিংহাসন")।\n২. ব্যাসবাক্য বা বিগ্রহবাক্য: সমস্তপদকে ভেঙে যে বাক্য তৈরি করা হয় (যেমন: "সিংহ চিহ্নিত আসন")।\n৩. সমস্যমান পদ: ব্যাসবাক্যের যে যে পদ দিয়ে সমাস তৈরি হয় (যেমন: সিংহ, আসন)।\n৪. পূর্বপদ: সমাসের প্রথম পদ (যেমন: "সিংহ")।\n৫. পরপদ বা উত্তরপদ: সমাসের শেষ পদ (যেমন: "আসন")।\nপ্রধান ৬ সমাস: দ্বন্দ্ব, কর্মধারয়, তৎপুরুষ, বহুব্রীহি, দ্বিগু ও অব্যয়ীভাব সমাস।',
    definitionEn: 'Shomash is the syntactic and semantic compounding of multiple semantically related words into a single morphological unit. There are 6 traditional classes.',
    explanationBn: 'সমাস চেনার সবচেয়ে জাদুকরী ব্যাকরণিক মূলনীতি হলো "কোন পদের অর্থ প্রধান":\n১. উভপদ প্রধান = দ্বন্দ্ব সমাস (মা ও বাবা = মা-বাবা; মা এবং বাবা উভয়ের অর্থই সমান)।\n২. পরপদ প্রধান = কর্মধারয়, তৎপুরুষ ও দ্বিগু সমাস (যেমন: নীলপদ্ম বললে "পদ্ম"-কে বোঝায়; রাজপুত্র বললে "পুত্র"-কে বোঝায়)।\n৩. পূর্বপদ প্রধান = অব্যয়ীভাব সমাস (উপকূল বললে "কূল" নয়, কূলের "নিকটবর্তী স্থান" বোঝায়)।\n৪. অন্যপদ প্রধান (তৃতীয় ব্যক্তি/বস্তু) = বহুব্রীহি সমাস (যেমন: পীতাম্বর বললে পীত বা অম্বর নয়, শ্রীকৃষ্ণকে বোঝায়; দশানন বললে দশ বা আনন নয়, রাবণকে বোঝায়)।',
    teacherGoldenTips: 'সমাসের মাস্টার চার্ট (কোন পদের অর্থ প্রধান):\n• উভপদ প্রধান = দ্বন্দ্ব সমাস!\n• পরপদ প্রধান = কর্মধারয়, তৎপুরুষ, দ্বিগু!\n• পূর্বপদ প্রধান = অব্যয়ীভাব সমাস!\n• অন্যপদ প্রধান = বহুব্রীহি সমাস!',
    rules: [
      {
        ruleNo: 1,
        nameBn: 'পদের অর্থ প্রাধান্য নীতি',
        explanationBn: 'সমাস নির্ণয়ে সবসময় সমস্তপদটি কোন ব্যক্তি বা বস্তুর মূল অর্থ বহন করছে তা দেখতে হবে।',
        examples: [
          {
            bn: 'কাজলকালো = কাজলের মতো কালো (কালো গুণটি প্রধান = কর্মধারয়); দশানন = দশ আনন যার (রাবণ প্রধান = বহুব্রীহি)।',
            context: 'অর্থের প্রাধান্য বিচার'
          }
        ]
      }
    ],
    formulas: [
      {
        label: 'সমাস নির্ণয় ফর্মুলা',
        structure: 'উভপদ প্রধান = দ্বন্দ্ব | পরপদ প্রধান = কর্মধারয়/তৎপুরুষ/দ্বিগু | পূর্বপদ প্রধান = অব্যয়ীভাব | অন্যপদ = বহুব্রীহি'
      }
    ],
    examples: [
      {
        bn: 'মা-বাবা = মা ও বাবা (দ্বন্দ্ব সমাস)',
        context: 'দ্বন্দ্ব'
      },
      {
        bn: 'নীলপদ্ম = নীল যে পদ্ম (কর্মধারয় সমাস)',
        context: 'কর্মধারয়'
      }
    ],
    exceptions: [
      {
        titleBn: 'অলুক সমাস',
        descriptionBn: 'যে সমাসে পূর্বপদের বিভক্তি লোপ পায় না, তাকে অলুক সমাস বলে (অলুক দ্বন্দ্ব: দেশে-বিদেশে; অলুক তৎপুরুষ: গায়ে-হলুদ; অলুক বহুব্রীহি: মাথায় ছাতা)।'
      }
    ],
    commonMistakes: [
      {
        incorrectBn: 'পীতাম্বর হলো কর্মধারয় সমাস (পীত যে অম্বর)।',
        correctBn: 'পীতাম্বর বহুব্রীহি সমাস (পীত অম্বর যার = শ্রীকৃষ্ণ)।',
        explanationBn: 'কারণ এটি অন্যপদ শ্রীকৃষ্ণকে নির্দেশ করে।'
      }
    ],
    writtenPractice: [
      {
        id: 1,
        type: 'CLASSIFICATION',
        prompt: 'নিচের পদগুলোর ব্যাসবাক্যসহ সমাসের নাম লিখ: (ক) সিংহাসন (খ) হাত-পা (গ) রাজপুত্র (ঘ) দশানন।',
        correctAnswer: '(ক) সিংহাসন = সিংহ চিহ্নিত আসন (মধ্যপদলোপী কর্মধারয়)। (খ) হাত-পা = হাত ও পা (দ্বন্দ্ব সমাস)। (গ) রাজপুত্র = রাজার পুত্র (ষষ্ঠী তৎপুরুষ)। (ঘ) দশানন = দশ আনন যার (বহুব্রীহি সমাস)।',
        explanationBn: 'বোর্ড পরীক্ষার অত্যন্ত গুরুত্বপূর্ণ ৪ নম্বরের প্রশ্ন।'
      }
    ],
    tags: ['SHOMASH', 'COMPOUND_WORDS', 'DWANDWA', 'KORMODHAROY', 'TOTPURUSH', 'BOHUBRIHI', 'SSC', 'HSC'],
    status: 'PUBLISHED',
    orderIndex: 1,
    viewCount: 380
  },
  {
    id: 12202,
    chapterId: 122,
    parentTopicId: null,
    subject: 'BANGLA',
    topicNo: '২২.২',
    titleBn: 'দ্বন্দ্ব, কর্মধারয় ও তৎপুরুষ সমাসের পূর্ণাঙ্গ নিয়ম ও প্রকারভেদ',
    titleEn: 'Detailed Subtypes of Dwandwa, Karmadharaya & Tatpurusha Compounds',
    slug: 'b22-dwandwa-kormodharoy-totpurush-details',
    difficulty: 'BOARD_STANDARD',
    classLevel: 'Class 8 - 12 (SSC & HSC)',
    summaryBn: 'দ্বন্দ্ব সমাসে উভয় পদ প্রধান; কর্মধারয়ে বিশেষণ ও বিশেষ্যের সংযোগে পরপদ প্রধান; তৎপুরুষে পূর্বপদের বিভক্তি লোপ পায়।',
    definitionBn: 'তিনটি প্রধান সমাস:\n১. দ্বন্দ্ব সমাস: মিলনার্থক (মা-বাবা), বিরোধার্থক (দা-কুমড়া), বিপরীতার্থক (আয়-ব্যয়), অঙ্গবাচক (হাত-পা), অলুক দ্বন্দ্ব (দেশে-বিদেশে)।\n২. কর্মধারয় সমাস: সাধারণ (নীল যে পদ্ম = নীলপদ্ম), মধ্যপদলোপী (সাহিত্য বিষয়ক সভা = সাহিত্যসভা), উপমান (তুষারের ন্যায় শুভ্র = তুষারশুভ্র), উপমিত (মুখ চন্দ্রের ন্যায় = চন্দ্রমুখ), রূপক (মন রূপ মাঝি = মনমাঝি, বিষাদ রূপ সিন্ধু = বিষাদসিন্ধু)।\n৩. তৎপুরুষ সমাস: পূর্বপদের বিভক্তি লোপে গঠিত সমাস (২য়া থেকে ৭মী তৎপুরুষ, নঞ তৎপুরুষ, উপপদ তৎপুরুষ)।',
    definitionEn: 'Dwandwa coordinates equal constituents; Karmadharaya pairs descriptor with referent (Appositive/Metaphoric); Tatpurusha is a determinative compound dropping case endings.',
    explanationBn: 'বোর্ড পরীক্ষায় কর্মধারয়ের উপমান, উপমিত ও রূপক চেনার ১০০% নির্ভুল ট্রিক:\n১. উপমান কর্মধারয়: বাস্তব সত্য তুলনা হবে (উপমান + সাধারণ গুণ)। যেমন: "তুষারশুভ্র" (তুষার সত্যিই শুভ্র বা সাদা), "কাজলকালো" (কাজল সত্যিই কালো)।\n২. উপমিত কর্মধারয়: কাল্পনিক বা অতিশয়োক্তি তুলনা, কোনো সাধারণ গুণ থাকবে না (উপমেয় + উপমান)। যেমন: "পুরুষসিংহ" (পুরুষ কখনো বাস্তব সিংহ হতে পারে না), "করপল্লব" (হাত কখনো গাছের পাতা হতে পারে না)।\n৩. রূপক কর্মধারয়: দুটি ভিন্ন বস্তুর মধ্যে অভেদ কল্পনা করা হবে, যা চোখে দেখা যায় না কেবল মন দিয়ে অনুভব করতে হয় ("রূপ" দিয়ে ব্যাসবাক্য হয়)। যেমন: "ক্রোধানল" (ক্রোধ রূপ অনল), "মনমাঝি" (মন রূপ মাঝি), "বিষাদসিন্ধু" (বিষাদ রূপ সিন্ধু)।\nউপপদ তৎপুরুষ সমাস: কৃদন্ত পদের পূর্বে উপপদ যুক্ত হয়ে সমাস হয় (যেমন: পকেট মারে যে = পকেটমার, জলে চরে যা = জলচর, পঙ্কজ = পঙ্কে জন্মে যা)।',
    teacherGoldenTips: 'উপমান বনাম উপমিত বনাম রূপক চেনার সিক্রেট:\n• সত্য তুলনা = উপমান (তুষারশুভ্র, ভ্রমরকৃষ্ণ)!\n• অবাস্তব/রূপকহীন তুলনা = উপমিত (চন্দ্রমুখ, পুরুষসিংহ)!\n• চোখে দেখা যায় না, মন দিয়ে অনুভব করতে হয় = রূপক (মনমাঝি, বিষাদসিন্ধু, দিলদরিয়া)!',
    rules: [
      {
        ruleNo: 1,
        nameBn: 'তৎপুরুষ সমাসের বিভক্তি নির্ধারণ',
        explanationBn: 'পূর্বপদে যে বিভক্তি লোপ পায়, সেই বিভক্তির নামানুসারে তৎপুরুষ সমাসের নামকরণ করা হয়।',
        examples: [
          {
            bn: 'বিপদকে আপন্ন = বিপদাপন্ন (২য়া তৎপুরুষ); মন দিয়ে গড়া = মনগড়া (৩য়া তৎপুরুষ); গুরুকে ভক্তি = গুরুভক্তি (৪র্থী তৎপুরুষ); খাঁচা থেকে ছাড়া = খাঁচছাড়া (৫মী তৎপুরুষ); রাজার পুত্র = রাজপুত্র (৬ষ্ঠী তৎপুরুষ); গাছে পাকা = গাছপাকা (৭মী তৎপুরুষ)।',
            context: 'বিভক্তিভিত্তিক তৎপুরুষ'
          }
        ]
      }
    ],
    formulas: [
      {
        label: 'কর্মধারয় ট্রিক সূত্র',
        structure: 'বাস্তব সত্য = উপমান (তুষারশুভ্র) | অবাস্তব = উপমিত (পুরুষসিংহ) | অদৃশ্য/অভেদ = রূপক (মনমাঝি)'
      }
    ],
    examples: [
      {
        bn: 'সিংহ চিহ্নিত আসন = সিংহাসন (মধ্যপদলোপী কর্মধারয়)',
        context: 'মধ্যপদলোপী'
      },
      {
        bn: 'গায়ে হলুদ দেওয়া হয় যে অনুষ্ঠানে = গায়ে-হলুদ (অলুক সমাস)',
        context: 'অলুক'
      }
    ],
    exceptions: [
      {
        titleBn: 'নঞ তৎপুরুষ বনাম নঞ বহুব্রীহি',
        descriptionBn: 'ন আচার = অনাচার (নঞ তৎপুরুষ); কিন্তু ন জ্ঞান যার = অজ্ঞান (নঞ বহুব্রীহি, কারণ এখানে ব্যক্তি নির্দেশ করছে)।'
      }
    ],
    commonMistakes: [
      {
        incorrectBn: 'চন্দ্রমুখ হলো উপমান কর্মধারয় সমাস।',
        correctBn: 'চন্দ্রমুখ হলো উপমিত কর্মধারয় সমাস।',
        explanationBn: 'কারণ মুখ কখনো বাস্তবিক অর্থে চাঁদ হতে পারে না, এটি কাল্পনিক তুলনা।'
      }
    ],
    writtenPractice: [
      {
        id: 1,
        type: 'IDENTIFICATION',
        prompt: 'কোনটি কোন কর্মধারয় সমাস নির্ণয় করো: (ক) কাজলকালো (খ) পুরুষসিংহ (গ) বিষাদসিন্ধু (ঘ) স্মৃতিসৌধ।',
        correctAnswer: '(ক) কাজলকালো = কাজলের ন্যায় কালো (উপমান কর্মধারয়)। (খ) পুরুষসিংহ = পুরুষ সিংহের ন্যায় (উপমিত কর্মধারয়)। (গ) বিষাদসিন্ধু = বিষাদ রূপ সিন্ধু (রূপক কর্মধারয়)। (ঘ) স্মৃতিসৌধ = স্মৃতি রক্ষার্থে সৌধ (মধ্যপদলোপী কর্মধারয়)।',
        explanationBn: 'বোর্ড পরীক্ষার ক্লাসিক ৪ নম্বরের প্রশ্ন।'
      }
    ],
    tags: ['UPOMAN', 'UPOMITO', 'RUPOK', 'TOTPURUSH', 'KORMODHAROY', 'SSC', 'HSC'],
    status: 'PUBLISHED',
    orderIndex: 2,
    viewCount: 390
  },
  {
    id: 12203,
    chapterId: 122,
    parentTopicId: null,
    subject: 'BANGLA',
    topicNo: '২২.৩',
    titleBn: 'বহুব্রীহি, দ্বিগু ও অব্যয়ীভাব সমাসের বিশদ রূপ',
    titleEn: 'Bahuvrihi, Dvigu & Avyayibhava Compounds with Subtypes',
    slug: 'b22-bohubrihi-dwigu-o-oboyoyibhav',
    difficulty: 'BOARD_STANDARD',
    classLevel: 'Class 8 - 12 (SSC & HSC)',
    summaryBn: 'বহুব্রীহিতে অন্যপদ প্রধান; দ্বিগুতে সংখ্যাবাচক পূর্বপদসহ সমাহার বোঝায়; অব্যয়ীভাবে পূর্বপদে অব্যয় বসে তার অর্থ প্রধান থাকে।',
    definitionBn: '১. বহুব্রীহি সমাস: যে সমাসে পূর্বপদ বা পরপদ কোনোটির অর্থ না বুঝিয়ে অন্য কোনো তৃতীয় ব্যক্তি বা বস্তুকে বোঝায় (বহুব্রীহি শব্দের অর্থ বহু ধান আছে যার = ধনী ব্যক্তি)। প্রকারভেদ: সমানাধিকরণ (নীলকণ্ঠ), ব্যাধিকরণ (বীণাপাণি), ব্যতিহার (কানাকানি, হাতাহাতি), মধ্যপদলোপী (বিড়ালচোখী), অলুক বহুব্রীহি (মাথায় ছাতা)।\n২. দ্বিগু সমাস: পূর্বপদে সংখ্যাবাচক শব্দ এবং পরপদে বিশেষ্যের সাথে "সমাহার" বা মিলন বোঝায় (যেমন: ত্রিফলা, চৌরাস্তা, শতাব্দী, পঞ্চবটী)।\n৩. অব্যয়ীভাব সমাস: পূর্বপদে অব্যয় যুক্ত হয়ে যে সমাস হয় এবং যেখানে অব্যয়ের অর্থই প্রধান থাকে (যেমন: কূলের সমীপে = উপকূল, কণ্ঠের সমীপে = উপকণ্ঠ, দিন দিন = প্রতিদিন, মরণ পর্যন্ত = আমরণ, অক্ষির অগোচরে = পরোক্ষ)।',
    definitionEn: 'Bahuvrihi is an exocentric compound denoting an unexpressed third entity. Dvigu involves numeral collectives. Avyayibhava is an adverbial compound governed by prefixes/indeclinables.',
    explanationBn: 'বোর্ড পরীক্ষায় দ্বিগু বনাম সংখ্যাবাচক বহুব্রীহির বিভ্রান্তি দূরীকরণ:\n১. যদি সংখ্যাবাচক শব্দের পর বিশেষ্যের সমাহার বোঝায় এবং পরপদ প্রধান থাকে, তবে তা দ্বিগু সমাস (যেমন: চার রাস্তার সমাহার = চৌরাস্তা; শত অব্দের সমাহার = শতাব্দী)।\n২. কিন্তু যদি সংখ্যাবাচক শব্দ পূর্বপদে থেকেও অন্য কোনো বিশিষ্ট ব্যক্তি বা বস্তুকে বোঝায়, তবে তা সংখ্যাবাচক বহুব্রীহি সমাস! যেমন: "দশানন" (দশটি আনন যার = রাবণ); "সেতার" (তিনটি তার যে বাদ্যযন্ত্রের); "চৌচালা" (চারটি চাল যে ঘরের)।\nব্যতিহার বহুব্রীহি: পরস্পরের ক্রিয়া বোঝাতে আ-ই প্রত্যয় যুক্ত হয় (যেমন: হাতে হাতে যে যুদ্ধ = হাতাহাতি; চোখে চোখে যে মিলন = চোখাচোখি; কানে কানে যে কথা = কানাকানি)।',
    teacherGoldenTips: 'গোল্ডেন ট্রিক: (১) "হাতাহাতি, কানাকানি, মারামারি" দেখলেই ব্যতিহার বহুব্রীহি! (২) সংখ্যা আছে + অন্য বস্তু বোঝায় (দশানন, সেতার, পঞ্চানন) = সংখ্যাবাচক বহুব্রীহি! (৩) সংখ্যা আছে + সমাহার বোঝায় (তেমাথা, চৌরাস্তা, শতাব্দী) = দ্বিগু সমাস!',
    rules: [
      {
        ruleNo: 1,
        nameBn: 'অব্যয়ীভাব সমাসের বিশিষ্ট অর্থ',
        explanationBn: 'অব্যয়ীভাব সমাসে উপ = সামীপ্য (উপকূল), প্রতি = পৌনঃপুনিকতা (প্রতিদিন), আ = পর্যন্ত (আমরণ, আকণ্ঠ), অনু = পশ্চাৎ (অনুগমন)।',
        examples: [
          {
            bn: 'কূলের সমীপে = উপকূল; মরণ পর্যন্ত = আমরণ; মনের মতো = যথামন।',
            context: 'অব্যয়ীভাব সমাসের অর্থ'
          }
        ]
      }
    ],
    formulas: [
      {
        label: 'বহুব্রীহি বনাম দ্বিগু সূত্র',
        structure: 'সংখ্যা + অন্য ব্যক্তি/বস্তু = সংখ্যাবাচক বহুব্রীহি | সংখ্যা + সমাহার = দ্বিগু সমাস'
      }
    ],
    examples: [
      {
        bn: 'বীণাপাণি = বীণা পাণিতে যার (দেবী সরস্বতী, বহুব্রীহি)',
        context: 'বহুব্রীহি'
      },
      {
        bn: 'চৌরাস্তা = চার রাস্তার সমাহার (দ্বিগু সমাস)',
        context: 'দ্বিগু'
      }
    ],
    exceptions: [
      {
        titleBn: 'নিত্য সমাস',
        descriptionBn: 'যে সমাসের ব্যাসবাক্য হয় না বা ব্যাসবাক্য করতে গেলে অন্য পদের সাহায্য নিতে হয় (যেমন: অন্য গ্রাম = গ্রামান্তর; কেবল দর্শন = দর্শনমাত্র; কাল সাপ = কালসাপ; বিরানব্বই)।'
      }
    ],
    commonMistakes: [
      {
        incorrectBn: 'চৌরাস্তা হলো বহুব্রীহি সমাস।',
        correctBn: 'চৌরাস্তা হলো দ্বিগু সমাস (চার রাস্তার সমাহার)।',
        explanationBn: 'কারণ এটি রাস্তাগুলোর সমষ্টি বোঝাচ্ছে, কোনো ব্যক্তিকে নয়।'
      }
    ],
    writtenPractice: [
      {
        id: 1,
        type: 'IDENTIFICATION',
        prompt: 'নিচের পদগুলোর সমাস নির্ণয় করো: (ক) কানাকানি (খ) শতাব্দী (গ) আমরণ (ঘ) গ্রামান্তর।',
        correctAnswer: '(ক) কানাকানি = কানে কানে যে কথা (ব্যতিহার বহুব্রীহি)। (খ) শতাব্দী = শত অব্দের সমাহার (দ্বিগু সমাস)। (গ) আমরণ = মরণ পর্যন্ত (অব্যয়ীভাব সমাস)। (ঘ) গ্রামান্তর = অন্য গ্রাম (নিত্য সমাস)।',
        explanationBn: 'বোর্ড পরীক্ষার অত্যন্ত আকর্ষণীয় ৪ নম্বরের প্রশ্ন।'
      }
    ],
    tags: ['BOHUBRIHI', 'DWIGU', 'AVOYOYIBHAV', 'NITYO_SHOMASH', 'SSC', 'HSC'],
    status: 'PUBLISHED',
    orderIndex: 3,
    viewCount: 410
  }
];

const CHAPTER_22_MCQS = [
  {
    id: 122001,
    chapterId: 122,
    topicId: 12201,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: 'যে সমাসে উভয় পদের অর্থই প্রধান থাকে, তাকে কোন সমাস বলে?',
    questionEn: 'Which compound has both constituent elements retaining semantic prominence?',
    options: ['দ্বন্দ্ব সমাস', 'তৎপুরুষ সমাস', 'কর্মধারয় সমাস', 'বহুব্রীহি সমাস'],
    correctOptionIndex: 0,
    correctAnswerText: 'দ্বন্দ্ব সমাস',
    explanationBn: 'দ্বন্দ্ব সমাসে পূর্বপদ ও পরপদ উভয় পদের অর্থই সমভাবে প্রাধান্য পায় (যেমন: মা ও বাবা = মা-বাবা)।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'ঢাকা বোর্ড',
    year: 2024,
    examType: 'SSC',
    tags: ['DWANDWA', 'DEFINITION', 'DHAKA_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 122002,
    chapterId: 122,
    topicId: 12202,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: '"তুষারশুভ্র" কোন প্রকার সমাসের উদাহরণ?',
    questionEn: 'What type of compound is "Tusharshubhro"?',
    options: ['উপমান কর্মধারয়', 'উপমিত কর্মধারয়', 'রূপক কর্মধারয়', 'মধ্যপদলোপী কর্মধারয়'],
    correctOptionIndex: 0,
    correctAnswerText: 'উপমান কর্মধারয়',
    explanationBn: 'তুষারের ন্যায় শুভ্র = তুষারশুভ্র। এটি প্রত্যক্ষ ও বাস্তব সত্য গুণবাচক তুলনা হওয়ায় উপমান কর্মধারয় সমাস।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'রাজশাহী বোর্ড',
    year: 2023,
    examType: 'SSC',
    tags: ['UPOMAN', 'TUSHARSHUBHRO', 'RAJSHAHI_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 122003,
    chapterId: 122,
    topicId: 12202,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: '"বিষাদসিন্ধু" (বিষাদ রূপ সিন্ধু)—এটি কোন সমাস?',
    questionEn: 'What compound is "Bishadshindhu"?',
    options: ['রূপক কর্মধারয়', 'উপমান কর্মধারয়', 'উপমিত কর্মধারয়', 'তৎপুরুষ সমাস'],
    correctOptionIndex: 0,
    correctAnswerText: 'রূপক কর্মধারয়',
    explanationBn: 'উপমেয় ও উপমানের মধ্যে অভেদ কল্পনা করা হলে রূপক কর্মধারয় হয় (যেমন: বিষাদ রূপ সিন্ধু = বিষাদসিন্ধু)।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'যশোর বোর্ড',
    year: 2024,
    examType: 'SSC',
    tags: ['RUPOK_KORMODHAROY', 'JASHORE_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 122004,
    chapterId: 122,
    topicId: 12203,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: '"কানাকানি" (কানে কানে যে কথা)—এটি কোন সমাসের উদাহরণ?',
    questionEn: 'What compound is "Kanakani"?',
    options: ['ব্যতিহার বহুব্রীহি', 'সমানাধিকরণ বহুব্রীহি', 'দ্বিগু সমাস', 'দ্বন্দ্ব সমাস'],
    correctOptionIndex: 0,
    correctAnswerText: 'ব্যতিহার বহুব্রীহি',
    explanationBn: 'ক্রিয়ার পারস্পরিক একজাতীয় কার্য বা সংযোগ নির্দেশ করায় এটি ব্যতিহার বহুব্রীহি সমাস (যেমন: কানাকানি, হাতাহাতি)।',
    difficulty: 'MEDIUM',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'কুমিল্লা বোর্ড',
    year: 2023,
    examType: 'SSC',
    tags: ['BYATIHAR_BOHUBRIHI', 'CUMILLA_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 122005,
    chapterId: 122,
    topicId: 12203,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: '"উপকূল" (কূলের সমীপে)—এটি কোন প্রকার সমাস?',
    questionEn: 'What compound is "Upokul"?',
    options: ['অব্যয়ীভাব সমাস', 'তৎপুরুষ সমাস', 'কর্মধারয় সমাস', 'দ্বিগু সমাস'],
    correctOptionIndex: 0,
    correctAnswerText: 'অব্যয়ীভাব সমাস',
    explanationBn: 'পূর্বপদে "উপ" অব্যয় বসে সামীপ্য অর্থ প্রকাশ করায় এবং অব্যয়ের অর্থ প্রধান থাকায় এটি অব্যয়ীভাব সমাস।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'চট্টগ্রাম বোর্ড',
    year: 2024,
    examType: 'SSC',
    tags: ['AVOYOYIBHAV', 'UPOKUL', 'CHITTAGONG_BOARD'],
    status: 'ACTIVE'
  }
];

const CHAPTER_22_MODEL_TEST = {
  id: 12201,
  subject: 'BANGLA',
  chapterId: 122,
  testTitleBn: 'অধ্যায় ২২ মডেল টেস্ট: সমাস',
  testTitleEn: 'Chapter 22 Model Test: Compound Words (Shomash)',
  descriptionBn: 'দ্বন্দ্ব, কর্মধারয় (উপমান, উপমিত, রূপক), তৎপুরুষ, বহুব্রীহি, দ্বিগু ও অব্যয়ীভাব সমাসের ওপর পূর্ণাঙ্গ মডেল টেস্ট।',
  durationMinutes: 10,
  totalMarks: 5,
  passPercentage: 60,
  difficulty: 'MEDIUM',
  questionCount: 5,
  questionIds: [122001, 122002, 122003, 122004, 122005],
  status: 'PUBLISHED'
};

// ============================================================================
// CHAPTER 23: উপসর্গ (Uposhurgo)
// ============================================================================
const CHAPTER_23_TOPICS = [
  {
    id: 12301,
    chapterId: 123,
    parentTopicId: null,
    subject: 'BANGLA',
    topicNo: '২৩.১',
    titleBn: 'উপসর্গের সংজ্ঞা, বৈশিষ্ট্য ও অর্থদ্যোতকতা',
    titleEn: 'Definition, Characteristics & Semantic Functions of Prefixes',
    slug: 'b23-uposhurgo-shongpga-o-boishishto',
    difficulty: 'BOARD_STANDARD',
    classLevel: 'Class 8 - 12 (SSC & HSC)',
    summaryBn: 'যেসব অর্থহীন অব্যয়সূচক শব্দাংশ ধাতুর বা শব্দের পূর্বে বসে নতুন অর্থ তৈরি করে, তাদের উপসর্গ বলে। উপসর্গের অর্থবাচকতা নেই, কিন্তু অর্থদ্যোতকতা আছে।',
    definitionBn: 'উপসর্গ (Prefix / Uposhurgo): যেসব অব্যয়সূচক শব্দাংশ ধাতু বা শব্দের পূর্বে যুক্ত হয়ে নতুন অর্থবোধক শব্দ গঠন করে, শব্দের অর্থের পূর্ণতা সাধন করে, অর্থের পরিবর্তন, সম্প্রসারণ বা সংকোচন ঘটায়, সেগুলোকে উপসর্গ বলে। যেমন: প্র, পরা, অপ, সম, আ, অ, কু, বে, গর। উপসর্গের ৫টি প্রধান কাজ: ১. নতুন অর্থবোধক শব্দ সৃষ্টি ২. অর্থের পূর্ণতা সাধন ৩. অর্থের সম্প্রসারণ ৪. অর্থের সংকোচন ৫. অর্থের পরিবর্তন।',
    definitionEn: 'A Prefix (Uposhurgo) is a bound morpheme prefixed to roots/words to modify, reverse, augment, or constrain semantic value. Prefixes lack intrinsic meaning but possess potent evocative capacity.',
    explanationBn: 'বোর্ড পরীক্ষার সবচেয়ে বিখ্যাত ব্যাকরণিক প্রতিপাদ্য হলো:\n"উপসর্গের অর্থবাচকতা নেই, কিন্তু অর্থদ্যোতকতা আছে।"—এর সহজ অর্থ হলো: উপসর্গের নিজস্ব কোনো স্বাধীন অর্থ বা অভিধানিক অস্তিত্ব নেই (যেমন: "প্র", "অপ", "সু" একা কোনো অর্থ দেয় না)। কিন্তু যখনই কোনো শব্দের আগে বসে, তখনই এটি আশ্চর্যভাবে নতুন নতুন অর্থ সৃষ্টি করতে পারে! যেমন—"হার" শব্দের পূর্বে:\n• প্র + হার = প্রহার (মারধর করা)\n• আ + হার = আহার (খাওয়া)\n• উপ + হার = উপহার (পুরস্কার)\n• পরি + হার = পরিহার (বর্জন করা)\n• বি + হার = বিহার (ভ্রমণ করা)\n• সং + হার = সংহার (ধ্বংস করা)।\nউপসর্গ সর্বদা শব্দের শুরুতে গায়ে লেগে বসে (অনুসর্গ যেমন আলাদা বসে, উপসর্গ কখনো আলাদা বসে না)।',
    teacherGoldenTips: 'গোল্ডেন কোটেশন: "উপসর্গের অর্থবাচকতা নেই, কিন্তু অর্থদ্যোতকতা আছে"—ক-অংশে এই প্রশ্ন আসলে "হার" শব্দের রূপান্তর উদাহরণটি (প্রহার, আহার, উপহার) সুন্দরভাবে লিখে দিলে পূর্ণ নম্বর নিশ্চিত!',
    rules: [
      {
        ruleNo: 1,
        nameBn: 'উপসর্গের স্থানিক অবস্থান',
        explanationBn: 'উপসর্গ সর্বদা শব্দের আদিতে বা পূর্বে যুক্ত হয়ে বসে, কখনোই শব্দের মাঝে বা শেষে বসতে পারে না।',
        examples: [
          {
            bn: 'প্র + ভাব = প্রভাব; অ + কাজ = অকাজ; বদ + নাম = বদনাম।',
            context: 'পূর্ব-সংযোজন'
          }
        ]
      }
    ],
    formulas: [
      {
        label: 'উপসর্গ সমীকরণ',
        structure: 'উপসর্গ (অর্থহীন শব্দাংশ) + মূল শব্দ/ধাতু = নতুন অর্থবোধক শব্দ'
      }
    ],
    examples: [
      {
        bn: 'উপ + কুল = উপকূল (কূলের সমীপে)',
        context: 'উপসর্গযোগ'
      },
      {
        bn: 'বে + তার = বেতার (তারবিহীন)',
        context: 'বিদেশি উপসর্গযোগ'
      }
    ],
    exceptions: [
      {
        titleBn: 'উপসর্গ বনাম অনুসর্গ অবস্থান',
        descriptionBn: 'উপসর্গ শব্দের পূর্বে জোড়া লেগে বসে (যেমন: উপহার); অনুসর্গ শব্দের পরে পৃথকভাবে স্পেস দিয়ে বসে (যেমন: তোমার জন্য)।'
      }
    ],
    commonMistakes: [
      {
        incorrectBn: 'উপসর্গ স্বাধীন পদ হিসেবে বাক্যে ব্যবহৃত হতে পারে।',
        correctBn: 'উপসর্গের কোনো স্বাধীন ব্যবহার নেই, এটি সবসময় শব্দের পূর্বে যুক্ত থাকে।',
        explanationBn: 'উপসর্গ পদ নয়, অব্যয়সূচক শব্দাংশ।'
      }
    ],
    writtenPractice: [
      {
        id: 1,
        type: 'DEFINITION',
        prompt: '"উপসর্গের অর্থবাচকতা নেই কিন্তু অর্থদ্যোতকতা আছে"—উদাহরণসহ উক্তিটি ব্যাখ্যা করো।',
        correctAnswer: 'উপসর্গের নিজস্ব কোনো অর্থ নেই (অর্থবাচকতাহীন), কিন্তু অন্য শব্দের পূর্বে যুক্ত হয়ে এটি নানাবিধ নতুন অর্থ সৃষ্টি বা অর্থের রূপান্তর করতে পারে (অর্থদ্যোতকতাসম্পন্ন)। যেমন: "হার" শব্দের পূর্বে "আ" যোগ করলে আহার (খাওয়া), "প্র" যোগ করলে প্রহার (মারা) এবং "উপ" যোগ করলে উপহার (উপঢৌকন) নতুন অর্থ তৈরি হয়।',
        explanationBn: 'বোর্ড পরীক্ষার ৩ নম্বরের নিয়মিত প্রশ্ন।'
      }
    ],
    tags: ['UPOSHURGO', 'PREFIX', 'ORTHODYOTOKOTA', 'HAR_EXAMPLE', 'SSC', 'HSC'],
    status: 'PUBLISHED',
    orderIndex: 1,
    viewCount: 370
  },
  {
    id: 12302,
    chapterId: 123,
    parentTopicId: null,
    subject: 'BANGLA',
    topicNo: '২৩.২',
    titleBn: 'খাঁটি বাংলা, সংস্কৃত ও বিদেশি উপসর্গের সম্পূর্ণ তালিকা',
    titleEn: 'Bangla (21), Sanskrit (20) & Foreign Prefixes Classification',
    slug: 'b23-bangla-shongskrito-bideshi-uposhurgo',
    difficulty: 'BOARD_STANDARD',
    classLevel: 'Class 8 - 12 (SSC & HSC)',
    summaryBn: 'বাংলা ভাষায় উপসর্গ ৩ প্রকার: খাঁটি বাংলা ২১টি, সংস্কৃত ২০টি এবং বিদেশি উপসর্গ (ফারসি, আরবি, ইংরেজি ইত্যাদি)।',
    definitionBn: 'উপসর্গের ৩ শ্রেণিবিভাগ:\n১. খাঁটি বাংলা উপসর্গ (২১টি): অ, অঘা, অজ, অনা, আ, আড়, আন, আব, ইতি, উন, কদ, কু, নি, পাতি, বি, ভর, রাম, স, সা, সু, হা।\n২. সংস্কৃত বা তৎসম উপসর্গ (২০টি): প্র, পরা, অপ, সম, নি, অনু, অব, নির্, দুর্, বি, অধি, সু, উৎ, পরি, প্রতি, অতি, অপি, অভি, উপ, আ।\n৩. বিদেশি উপসর্গ: ফারসি (কার, দর, না, নিম, ফি, বদ, বে, বর, ব, কম); আরবি (আম, খাস, লা, গর); ইংরেজি (ফুল, হাফ, হেড, সাব); উর্দু-হিন্দি (হর)।',
    definitionEn: 'Bengali prefixes span Native Bengali (21), Classical Sanskrit (20), and Naturalized Foreign categories (Persian, Arabic, English, Hindi).',
    explanationBn: 'বোর্ড পরীক্ষার সুপারস্টার টেকনিক:\n৪টি উপসর্গ খাঁটি বাংলা ও তৎসম উভয় শাখাতেই বিদ্যমান: "আ", "সু", "বি", "নি" (শর্টকাট ফর্মুলা: "আ সু বি নি")।\nকীভাবে চিনবেন কোনটি বাংলা আর কোনটি তৎসম?\n• তৎসম শব্দের পূর্বে বসলে তা তৎসম উপসর্গ (যেমন: সুকণ্ঠ, সুনীল, নিখুঁত, বিশুদ্ধ, আমরণ)।\n• খাঁটি বাংলা শব্দের পূর্বে বসলে তা খাঁটি বাংলা উপসর্গ (যেমন: সুনজর, সুদিন, নিলাজ, নিখোঁজ, আকাট, আধোয়া)।\nবিদেশি উপসর্গের জনপ্রিয় উদাহরণ:\n- ফি বছর, হররোজ (প্রত্যেক)\n- হেডমাস্টার, সাব-জজ (ইংরেজি)\n- বদমেজাজ, বেহায়া, নিখরচায় (ফারসি)\n- গরহাজির, লাপাত্তা, খাসমহল (আরবি)।',
    teacherGoldenTips: 'ম্যাজিক ফর্মুলা:\n• খাঁটি বাংলা উপসর্গ = ২১টি!\n• সংস্কৃত উপসর্গ = ২০টি!\n• উভয় ভাষায় কমন ৪টি উপসর্গ = "আ সু বি নি" (আ, সু, বি, নি)! মনে রাখার টেকনিক: "আসু বিনির বাড়ি ঢাকা"!',
    rules: [
      {
        ruleNo: 1,
        nameBn: '"আ সু বি নি" নির্ধারণের কৌশল',
        explanationBn: 'পরবর্তী মূল শব্দটি তৎসম হলে উপসর্গটি তৎসম; মূল শব্দটি খাঁটি বাংলা হলে উপসর্গটি খাঁটি বাংলা।',
        examples: [
          {
            bn: 'সুনীল (নীল তৎসম শব্দ → সু তৎসম উপসর্গ); সুদিন (দিন বাংলা শব্দ → সু খাঁটি বাংলা উপসর্গ)।',
            context: 'কমন উপসর্গের শ্রেণি নির্ণয়'
          }
        ]
      }
    ],
    formulas: [
      {
        label: 'উপসর্গের সংখ্যা ছক',
        structure: 'খাঁটি বাংলা = ২১টি | সংস্কৃত/তৎসম = ২০টি | উভয় ভাষায় কমন = ৪টি (আ, সু, বি, নি)'
      }
    ],
    examples: [
      {
        bn: 'রামছাগল (রাম = খাঁটি বাংলা উপসর্গ, উৎকৃষ্ট/বড় অর্থে)',
        context: 'খাঁটি বাংলা উপসর্গ'
      },
      {
        bn: 'পরাকাষ্ঠা (পরা = সংস্কৃত উপসর্গ, আতিশয্য অর্থে)',
        context: 'সংস্কৃত উপসর্গ'
      }
    ],
    exceptions: [
      {
        titleBn: 'বিদেশি উপসর্গের সঙ্গে দেশি শব্দের সংকর মিলন',
        descriptionBn: 'হেড-পণ্ডিত (ইংরেজি উপসর্গ + সংস্কৃত শব্দ); বে-টাইম (ফারসি উপসর্গ + ইংরেজি শব্দ)। এগুলো মিশ্র শব্দ গঠন করে।'
      }
    ],
    commonMistakes: [
      {
        incorrectBn: 'খাঁটি বাংলা উপসর্গ ২০টি এবং সংস্কৃত ২১টি।',
        correctBn: 'খাঁটি বাংলা উপসর্গ ২১টি এবং সংস্কৃত উপসর্গ ২০টি।',
        explanationBn: 'বাংলায় ২১ ফেব্রুয়ারি আছে, তাই বাংলা উপসর্গ ২১টি—এইভাবে মনে রাখবেন।'
      }
    ],
    writtenPractice: [
      {
        id: 1,
        type: 'CLASSIFICATION',
        prompt: 'নিচের শব্দগুলোর উপসর্গ চিহ্নিত করে তার ভাষা ও শ্রেণি লিখ: (ক) পরাভব (খ) অঘারাম (গ) লাপাত্তা (ঘ) হেডপণ্ডিত।',
        correctAnswer: '(ক) পরাভব: "পরা" (সংস্কৃত উপসর্গ)। (খ) অঘারাম: "অঘা" (খাঁটি বাংলা উপসর্গ)। (গ) লাপাত্তা: "লা" (আরবি বিদেশি উপসর্গ)। (ঘ) হেডপণ্ডিত: "হেড" (ইংরেজি বিদেশি উপসর্গ)।',
        explanationBn: 'বোর্ড পরীক্ষার অত্যন্ত আকর্ষণীয় ৪ নম্বরের প্রশ্ন।'
      }
    ],
    tags: ['BANGLA_UPOSHURGO', 'SHONGSKRITO_UPOSHURGO', 'BIDESHI_UPOSHURGO', 'A_SU_BI_NI', 'SSC', 'HSC'],
    status: 'PUBLISHED',
    orderIndex: 2,
    viewCount: 410
  }
];

const CHAPTER_23_MCQS = [
  {
    id: 123001,
    chapterId: 123,
    topicId: 12301,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: 'উপসর্গের প্রধান ব্যাকরণিক বৈশিষ্ট্য কোনটি?',
    questionEn: 'What is the primary grammatical characteristic of prefixes?',
    options: ['উপসর্গের অর্থবাচকতা নেই, কিন্তু অর্থদ্যোতকতা আছে', 'উপসর্গের নিজস্ব অর্থ আছে', 'উপসর্গ শব্দের শেষে বসে', 'উপসর্গ একটি স্বাধীন পদ'],
    correctOptionIndex: 0,
    correctAnswerText: 'উপসর্গের অর্থবাচকতা নেই, কিন্তু অর্থদ্যোতকতা আছে',
    explanationBn: 'উপসর্গের নিজস্ব কোনো অর্থ না থাকলেও অন্য শব্দের পূর্বে যুক্ত হয়ে নতুন নতুন অর্থদ্যোতনা সৃষ্টির অসাধারণ ক্ষমতা রয়েছে।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'ঢাকা বোর্ড',
    year: 2024,
    examType: 'SSC',
    tags: ['UPOSHURGO_FEATURE', 'DHAKA_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 123002,
    chapterId: 123,
    topicId: 12302,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: 'বাংলা ভাষায় খাঁটি বাংলা উপসর্গ মোট কতটি?',
    questionEn: 'How many native Bengali prefixes exist in total?',
    options: ['২১টি', '২০টি', '১৯টি', '২৫টি'],
    correctOptionIndex: 0,
    correctAnswerText: '২১টি',
    explanationBn: 'বাংলা ব্যাকরণে খাঁটি বাংলা উপসর্গ ২১টি এবং সংস্কৃত উপসর্গ ২০টি।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'রাজশাহী বোর্ড',
    year: 2023,
    examType: 'SSC',
    tags: ['BANGLA_UPOSHURGO_COUNT', 'RAJSHAHI_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 123003,
    chapterId: 123,
    topicId: 12302,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: 'কোন চারটি উপসর্গ খাঁটি বাংলা ও তৎসম উভয় ভাষাতেই ব্যবহৃত হয়?',
    questionEn: 'Which 4 prefixes are common to both native Bengali and Sanskrit?',
    options: ['আ, সু, বি, নি', 'প্র, পরা, অপ, সম', 'অ, অঘা, অজ, অনা', 'কার, দর, না, নিম'],
    correctOptionIndex: 0,
    correctAnswerText: 'আ, সু, বি, নি',
    explanationBn: '"আ, সু, বি, নি"—এই চারটি উপসর্গ বাংলা ও সংস্কৃত উভয় শাখাতেই বিদ্যমান।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'যশোর বোর্ড',
    year: 2024,
    examType: 'SSC',
    tags: ['A_SU_BI_NI', 'COMMON_PREFIXES', 'JASHORE_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 123004,
    chapterId: 123,
    topicId: 12302,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: '"লাপাত্তা" এবং "গরহাজির"—শব্দ দুটিতে ব্যবহৃত উপসর্গ দুটি কোন ভাষার?',
    questionEn: 'From which language are the prefixes in "Lapatta" and "Gorhajir" borrowed?',
    options: ['আরবি উপসর্গ', 'ফারসি উপসর্গ', 'ইংরেজি উপসর্গ', 'তুর্কি উপসর্গ'],
    correctOptionIndex: 0,
    correctAnswerText: 'আরবি উপসর্গ',
    explanationBn: '"লা" (লাপাত্তা, লাওয়ারিশ) এবং "গর" (গরহাজির, গরমিল) হলো আরবি ভাষার বিদেশি উপসর্গ।',
    difficulty: 'MEDIUM',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'কুমিল্লা বোর্ড',
    year: 2023,
    examType: 'SSC',
    tags: ['ARABIC_PREFIX', 'CUMILLA_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 123005,
    chapterId: 123,
    topicId: 12301,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: '"প্রভাব" শব্দে "প্র" উপসর্গটি কী অর্থ প্রকাশ করেছে?',
    questionEn: 'What meaning does the prefix "pro" convey in "Probhab"?',
    options: ['আতিশয্য বা বিশিষ্টতা', 'বিপরীত অর্থ', 'অভাব অর্থ', 'অনুকরণ অর্থ'],
    correctOptionIndex: 0,
    correctAnswerText: 'আতিশয্য বা বিশিষ্টতা',
    explanationBn: '"প্রভাব" শব্দে "প্র" উপসর্গটি প্রকৃষ্ট বা বিশিষ্ট আধিপত্যের দ্যোতনা প্রকাশ করেছে।',
    difficulty: 'MEDIUM',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'চট্টগ্রাম বোর্ড',
    year: 2024,
    examType: 'SSC',
    tags: ['PRO_MEANING', 'CHITTAGONG_BOARD'],
    status: 'ACTIVE'
  }
];

const CHAPTER_23_MODEL_TEST = {
  id: 12301,
  subject: 'BANGLA',
  chapterId: 123,
  testTitleBn: 'অধ্যায় ২৩ মডেল টেস্ট: উপসর্গ',
  testTitleEn: 'Chapter 23 Model Test: Prefixes (Uposhurgo)',
  descriptionBn: 'উপসর্গের বৈশিষ্ট্য, খাঁটি বাংলা ২১টি, সংস্কৃত ২০টি, আ-সু-বি-নি ও বিদেশি উপসর্গের ওপর পূর্ণাঙ্গ মডেল টেস্ট।',
  durationMinutes: 10,
  totalMarks: 5,
  passPercentage: 60,
  difficulty: 'MEDIUM',
  questionCount: 5,
  questionIds: [123001, 123002, 123003, 123004, 123005],
  status: 'PUBLISHED'
};

// ============================================================================
// CHAPTER 24: প্রত্যয় (Prottoy)
// ============================================================================
const CHAPTER_24_TOPICS = [
  {
    id: 12401,
    chapterId: 124,
    parentTopicId: null,
    subject: 'BANGLA',
    topicNo: '২৪.১',
    titleBn: 'প্রত্যয়ের সংজ্ঞা, বৈশিষ্ট্য ও প্রকৃতি-প্রত্যয়ের সম্পর্ক',
    titleEn: 'Definition, Features of Suffixes (Prottoy) & Root-Suffix Nexus',
    slug: 'b24-prottoy-shongpga-o-prokriti',
    difficulty: 'BOARD_STANDARD',
    classLevel: 'Class 8 - 12 (SSC & HSC)',
    summaryBn: 'শব্দ বা ধাতুর পরে যেসব বর্ণ বা বর্ণসমষ্টি যুক্ত হয়ে নতুন শব্দ তৈরি করে, তাদের প্রত্যয় বলে। প্রত্যয় ২ প্রকার: কৃৎ প্রত্যয় ও তদ্ধিত প্রত্যয়।',
    definitionBn: 'প্রত্যয় (Suffix / Prottoy): নতুন অর্থবোধক শব্দ গঠনের উদ্দেশ্যে শব্দ বা ধাতুর শেষে যে বর্ণ বা বর্ণসমষ্টি যুক্ত হয়, তাকে প্রত্যয় বলে। যেমন: ঢাকা + আই = ঢাকাই; চল্ + অন্ত = চলন্ত। প্রকৃতি (Root): যে শব্দ বা শব্দাংশকে আর কোনো ক্ষুদ্রাংশে বিশ্লেষণ করা যায় না, তাকে প্রকৃতি বলে। প্রকৃতি ২ প্রকার: ১. নামপ্রকৃতি বা প্রাতিপদিক (হাত, ঢাকা, মানব) ২. ক্রিয়াপ্রকৃতি বা ধাতু (পড়্, চল্, কর্)। প্রত্যয় ২ প্রকার: ১. কৃৎ প্রত্যয় (ধাতুর পর বসে) ২. তদ্ধিত প্রত্যয় (নামশব্দের পর বসে)।',
    definitionEn: 'A Suffix (Prottoy) is a formative morpheme suffixed to nominal stems (Taddhita) or verbal roots (Krit) to derive new lexical entries.',
    explanationBn: 'প্রকৃতি ও প্রত্যয়ের সম্পর্ক রসায়নের বিক্রিয়ার মতো:\n• ধাতু/ক্রিয়াপ্রকৃতি + কৃৎ প্রত্যয় = কৃদন্ত পদ (যেমন: পড়্ + আ = পড়া; চল্ + অন্ত = চলন্ত)।\n• নামপ্রকৃতি + তদ্ধিত প্রত্যয় = তদ্ধিতাান্ত পদ (যেমন: হাত + ল = হাতল; সোনা + আলি = সোনালি)।\nপ্রত্যয় বনাম বিভক্তির অত্যন্ত গুরুত্বপূর্ণ পার্থক্য:\n১. প্রত্যয় নতুন শব্দ গঠন করে এবং মূল শব্দের অভিধানগত অর্থ বদলে দেয় (যেমন: হাত থেকে হাতল = হ্যান্ডেল)।\n২. বিভক্তি কখনো নতুন শব্দ গঠন করে না, কেবল বাক্যে অন্যান্য পদের সাথে অন্বয় তৈরি করে (যেমন: হাতে = হাত + এ বিভক্তি)।\nউপসর্গ ও প্রত্যয়ের পার্থক্য:\nউপসর্গ বসে শব্দের আগে (প্র + হার = প্রহার); প্রত্যয় বসে শব্দের পরে (চল্ + অন্ত = চলন্ত)।',
    teacherGoldenTips: 'গোল্ডেন টেবিল:\n• ধাতুর পরে বসে = কৃৎ প্রত্যয় → গঠিত পদ কৃদন্ত পদ!\n• নামশব্দের পরে বসে = তদ্ধিত প্রত্যয় → গঠিত পদ তদ্ধিতাান্ত পদ!\n• পূর্বে বসে = উপসর্গ! পরে বসে = প্রত্যয়!',
    rules: [
      {
        ruleNo: 1,
        nameBn: 'ধাতু চিহ্ন (√) প্রয়োগের নিয়ম',
        explanationBn: 'ক্রিয়াপ্রকৃতি বা ধাতুর পূর্বে ব্যাকরণে বর্গমূল চিহ্ন বা ধাতু চিহ্ন (√) দিতে হয়।',
        examples: [
          {
            bn: '√পড়্ + কুয়া = পড়ুয়া; √দৃশ + অনীয় = দর্শনীয়; √কৃ + তব্য = কর্তব্য।',
            context: 'ধাতু চিহ্ন'
          }
        ]
      }
    ],
    formulas: [
      {
        label: 'প্রত্যয় সূত্র ছক',
        structure: 'ধাতু + কৃৎ প্রত্যয় = কৃদন্ত পদ | নামশব্দ + তদ্ধিত প্রত্যয় = তদ্ধিতাান্ত পদ'
      }
    ],
    examples: [
      {
        bn: '√চল্ + অন্ত = চলন্ত (কৃৎ প্রত্যয়)',
        context: 'কৃৎ প্রত্যয়'
      },
      {
        bn: 'ঢাকা + আই = ঢাকাই (তদ্ধিত প্রত্যয়)',
        context: 'তদ্ধিত প্রত্যয়'
      }
    ],
    exceptions: [
      {
        titleBn: 'অপ্রচলিত সংস্কৃত তদ্ধিত প্রত্যয়',
        descriptionBn: 'মনু + ষ্ণ = মানব; রঘু + ষ্ণ = রাঘব; সুন্দর + ষ্যঞ্ = সৌন্দর্য। এখানে বৃদ্ধি নিয়মানুযায়ী আদি স্বর বদলে যায়।'
      }
    ],
    commonMistakes: [
      {
        incorrectBn: 'পড়্ + আ = পড়া এটি তদ্ধিত প্রত্যয়।',
        correctBn: 'পড়্ হলো একটি ধাতু, তাই এটি কৃৎ প্রত্যয়।',
        explanationBn: 'ধাতু থেকে উৎপন্ন হলে তা কৃৎ প্রত্যয় হয়।'
      }
    ],
    writtenPractice: [
      {
        id: 1,
        type: 'DIFFERENCE',
        prompt: 'কৃৎ প্রত্যয় ও তদ্ধিত প্রত্যয়ের মধ্যে দুটি মৌলিক পার্থক্য উদাহরণসহ লিখ।',
        correctAnswer: '১. কৃৎ প্রত্যয় ধাতুর বা ক্রিয়ামূলের শেষে যুক্ত হয় (যেমন: √চল্ + অন্ত = চলন্ত)। তদ্ধিত প্রত্যয় নামশব্দ বা প্রাতিপদিকের শেষে যুক্ত হয় (যেমন: হাত + ল = হাতল)। ২. কৃৎ প্রত্যয় নিষ্পন্ন পদকে কৃদন্ত পদ বলে, আর তদ্ধিত প্রত্যয় নিষ্পন্ন পদকে তদ্ধিতাান্ত পদ বলে।',
        explanationBn: 'বোর্ড পরীক্ষার অত্যন্ত কমন ৩ নম্বরের প্রশ্ন।'
      }
    ],
    tags: ['PROTTOY', 'SUFFIX', 'KRIT_PROTTOY', 'TODDHIT_PROTTOY', 'PROKRITI', 'SSC', 'HSC'],
    status: 'PUBLISHED',
    orderIndex: 1,
    viewCount: 380
  },
  {
    id: 12402,
    chapterId: 124,
    parentTopicId: null,
    subject: 'BANGLA',
    topicNo: '২৪.২',
    titleBn: 'কৃৎ ও তদ্ধিত প্রত্যয়ের প্রধান নিয়ম: গুণ ও বৃদ্ধি',
    titleEn: 'Krit & Taddhita Rules: Guna, Vriddhi & Derivations',
    slug: 'b24-guna-o-briddhi-prottoy-analysis',
    difficulty: 'BOARD_STANDARD',
    classLevel: 'Class 8 - 12 (SSC & HSC)',
    summaryBn: 'প্রত্যয় যুক্ত হওয়ার সময় প্রকৃতির আদি স্বরের যে পরিবর্তন ঘটে, তাকে গুণ ও বৃদ্ধি বলে।',
    definitionBn: 'গুণ ও বৃদ্ধি:\n১. গুণ: প্রকৃতির আদি স্বরের পরিবর্তন—\n• ই/ঈ স্থানে "এ" হয় (√চিন্ + আ = চেনা, √নী + অন = নয়ন)\n• উ/ঊ স্থানে "ও" হয় (√ধো + আ = ধোয়া)\n• ঋ স্থানে "অর্" হয় (√কৃ + তা = কর্তা)।\n২. বৃদ্ধি: প্রকৃতির আদি স্বরের উচ্চতর রূপান্তর—\n• অ স্থানে "আ" হয় (মনু + ষ্ণ = মানব, শিব + ষ্ণ = শৈব)\n• ই/ঈ স্থানে "ঐ" হয় (বিজ্ঞান + ষ্ণিক = বৈজ্ঞানিক, দীন + য = দৈন্য)\n• উ/ঊ স্থানে "ঔ" হয় (ভূত + ষ্ণিক = ভৌতিক, যুব + অন = যৌবন)\n• ঋ স্থানে "আর্" হয় (কৃপ + ষ্ণ = কার্পণ্য)।',
    definitionEn: 'Guna and Vriddhi are systematic ablaut/vowel gradation processes occurring at the root vowel upon suffixation in Tatsama derivatives.',
    explanationBn: 'বোর্ড পরীক্ষায় নিশ্চিত কমন আসা ১০টি প্রকৃতি-প্রত্যয় নির্ণয়:\n১. মানব = মনু + ষ্ণ\n২. বৈজ্ঞানিক = বিজ্ঞান + ষ্ণিক (বা ইক)\n৩. শৈশব = শিশু + ষ্ণ\n৪. সৌন্দর্য = সুন্দর + ষ্যঞ্ (বা য)\n৫. দৈনিক = দিন + ষ্ণিক\n৬. চলন্ত = √চল্ + অন্ত\n৭. মেধাবী = মেধা + বিন্\n৮. দর্শনীয় = √দৃশ + অনীয়\n৯. কর্তব্য = √কৃ + তব্য\n১০. সাহিত্যিক = সাহিত্য + ষ্ণিক।\nএই দশটি শব্দের যেকোনো ৩-৪টি প্রতি বছর বোর্ড পরীক্ষায় ঘুরেফিরে আসে।',
    teacherGoldenTips: 'ম্যাজিক ফর্মুলা:\n• বিজ্ঞান → বৈজ্ঞানিক (ই স্থানে ঐ = বৃদ্ধি)!\n• সুন্দর → সৌন্দর্য (উ স্থানে ঔ = বৃদ্ধি)!\n• মনু → মানব (উ স্থানে অব = বৃদ্ধি)!\n• দিন → দৈনিক (ই স্থানে ঐ = বৃদ্ধি)!',
    rules: [
      {
        ruleNo: 1,
        nameBn: 'ষ্ণিক (ইক) প্রত্যয়ে বৃদ্ধির নিয়ম',
        explanationBn: 'শব্দের শেষে "ইক" প্রত্যয় যুক্ত হলে প্রথম স্বরবর্ণের বৃদ্ধি ঘটে (অ > আ, ই > ঐ, উ > ঔ)।',
        examples: [
          {
            bn: 'সমাজ + ইক = সামাজিক; ইতিহাস + ইক = ঐতিহাসিক; ভূগোল + ইক = ভৌগোলিক।',
            context: 'ইক প্রত্যয়ে বৃদ্ধি'
          }
        ]
      }
    ],
    formulas: [
      {
        label: 'বৃদ্ধি রূপান্তর ছক',
        structure: 'অ → আ | ই/ঈ → ঐ | উ/ঊ → ঔ | ঋ → আর্'
      }
    ],
    examples: [
      {
        bn: 'ইতিহাস + ইক = ঐতিহাসিক (ই স্থানে ঐ)',
        context: 'বৃদ্ধি'
      },
      {
        bn: 'ভূগোল + ইক = ভৌগোলিক (উ স্থানে ঔ)',
        context: 'বৃদ্ধি'
      }
    ],
    exceptions: [
      {
        titleBn: 'নিপাতনে সিদ্ধ কৃদন্ত পদ',
        descriptionBn: '√গম্ + তি = গতি; √মুচ্ + তি = মুক্তি; √মন্ + তি = মতি। এগুলো বিশেষ সূত্রে নিষ্পন্ন।'
      }
    ],
    commonMistakes: [
      {
        incorrectBn: 'সমাজ + ইক = সমাজিক।',
        correctBn: 'সমাজ + ইক = সামাজিক (অ স্থানে আ বৃদ্ধি)।',
        explanationBn: 'ইক প্রত্যয়ে আদি স্বরের বৃদ্ধি বাধ্যতামূলক।'
      }
    ],
    writtenPractice: [
      {
        id: 1,
        type: 'TRANSFORMATION',
        prompt: 'প্রকৃতি ও প্রত্যয় নির্ণয় করো: (ক) মানব (খ) সামাজিক (গ) কর্তব্য (ঘ) শৈশব।',
        correctAnswer: '(ক) মানব = মনু + ষ্ণ (তদ্ধিত প্রত্যয়)। (খ) সামাজিক = সমাজ + ষ্ণিক/ইক (তদ্ধিত প্রত্যয়)। (গ) কর্তব্য = √কৃ + তব্য (কৃৎ প্রত্যয়)। (ঘ) শৈশব = শিশু + ষ্ণ (তদ্ধিত প্রত্যয়)।',
        explanationBn: 'বোর্ড পরীক্ষার অত্যন্ত ক্লাসিক ৪ নম্বরের প্রশ্ন।'
      }
    ],
    tags: ['GUNA', 'VRIDDHI', 'MANOB', 'SHAMAJIK', 'KORTOBYO', 'SSC', 'HSC'],
    status: 'PUBLISHED',
    orderIndex: 2,
    viewCount: 420
  }
];

const CHAPTER_24_MCQS = [
  {
    id: 124001,
    chapterId: 124,
    topicId: 12401,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: 'ধাতু বা ক্রিয়ামূলের শেষে যে প্রত্যয় যুক্ত হয়, তাকে কী বলে?',
    questionEn: 'What is a suffix added to a verbal root called?',
    options: ['কৃৎ প্রত্যয়', 'তদ্ধিত প্রত্যয়', 'বিভক্তি', 'উপসর্গ'],
    correctOptionIndex: 0,
    correctAnswerText: 'কৃৎ প্রত্যয়',
    explanationBn: 'ধাতুর শেষে যুক্ত হয়ে নতুন শব্দ গঠনকারী প্রত্যয়কে কৃৎ প্রত্যয় এবং গঠিত পদকে কৃদন্ত পদ বলে।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'ঢাকা বোর্ড',
    year: 2024,
    examType: 'SSC',
    tags: ['KRIT_PROTTOY', 'DEFINITION', 'DHAKA_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 124002,
    chapterId: 124,
    topicId: 12402,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: '"মানব" শব্দের সঠিক প্রকৃতি ও প্রত্যয় কোনটি?',
    questionEn: 'What is the correct root-suffix analysis of "Manob"?',
    options: ['মনু + ষ্ণ', 'মান + অব', 'মানব + ০', 'মনু + ব'],
    correctOptionIndex: 0,
    correctAnswerText: 'মনু + ষ্ণ',
    explanationBn: 'মনু শব্দের সাথে সংস্কৃত তদ্ধিত প্রত্যয় "ষ্ণ" (বা অ) যুক্ত হয়ে বৃদ্ধির নিয়মে "মানব" শব্দটি গঠিত হয়।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'রাজশাহী বোর্ড',
    year: 2023,
    examType: 'SSC',
    tags: ['MANOB', 'MONU_SHNO', 'RAJSHAHI_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 124003,
    chapterId: 124,
    topicId: 12402,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: '"ঐতিহাসিক" শব্দে কোন প্রত্যয় যুক্ত হয়েছে এবং আদি স্বরের কী রূপান্তর ঘটেছে?',
    questionEn: 'Which suffix is added to "Oitihashik" and what vowel shift occurred?',
    options: ['ইক প্রত্যয় এবং আদি স্বরের বৃদ্ধি', 'ইক প্রত্যয় এবং গুণ', 'ক প্রত্যয়', 'আক প্রত্যয়'],
    correctOptionIndex: 0,
    correctAnswerText: 'ইক প্রত্যয় এবং আদি স্বরের বৃদ্ধি',
    explanationBn: 'ইতিহাস + ইক = ঐতিহাসিক; এখানে ইক প্রত্যয় যুক্ত হওয়ায় আদি স্বর "ই" বৃদ্ধি পেয়ে "ঐ"-তে পরিণত হয়েছে।',
    difficulty: 'MEDIUM',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'যশোর বোর্ড',
    year: 2024,
    examType: 'SSC',
    tags: ['VRIDDHI', 'OITIHASHIK', 'JASHORE_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 124004,
    chapterId: 124,
    topicId: 12401,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: 'নামশব্দের শেষে যে প্রত্যয় যুক্ত হয়, তাকে কী বলে?',
    questionEn: 'What is a suffix added to a nominal stem called?',
    options: ['তদ্ধিত প্রত্যয়', 'কৃৎ প্রত্যয়', 'ধাতুবিভক্তি', 'উপসর্গ'],
    correctOptionIndex: 0,
    correctAnswerText: 'তদ্ধিত প্রত্যয়',
    explanationBn: 'নামপদ বা প্রাতিপদিকের শেষে যুক্ত হওয়া প্রত্যয়কে তদ্ধিত প্রত্যয় এবং গঠিত পদকে তদ্ধিতাান্ত পদ বলে।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'কুমিল্লা বোর্ড',
    year: 2023,
    examType: 'SSC',
    tags: ['TODDHIT_PROTTOY', 'CUMILLA_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 124005,
    chapterId: 124,
    topicId: 12402,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: '"কর্তব্য" শব্দের সঠিক প্রকৃতি ও প্রত্যয় কোনটি?',
    questionEn: 'What is the correct root and suffix of "Kortobyo"?',
    options: ['√কৃ + তব্য', 'কর + তব্য', 'কর্তা + ব্য', 'করণ + তব্য'],
    correctOptionIndex: 0,
    correctAnswerText: '√কৃ + তব্য',
    explanationBn: 'কৃ ধাতুর সাথে সংস্কৃত কৃৎ প্রত্যয় "তব্য" যুক্ত হয়ে "কর্তব্য" পদটি গঠিত হয় (গুণ নিয়মে ঋ > অর্)।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'চট্টগ্রাম বোর্ড',
    year: 2024,
    examType: 'SSC',
    tags: ['KORTOBYO', 'KRIT_PROTTOY', 'CHITTAGONG_BOARD'],
    status: 'ACTIVE'
  }
];

const CHAPTER_24_MODEL_TEST = {
  id: 12401,
  subject: 'BANGLA',
  chapterId: 124,
  testTitleBn: 'অধ্যায় ২৪ মডেল টেস্ট: প্রত্যয়',
  testTitleEn: 'Chapter 24 Model Test: Suffixes (Prottoy)',
  descriptionBn: 'কৃৎ প্রত্যয়, তদ্ধিত প্রত্যয়, গুণ ও বৃদ্ধি এবং বহুল আলোচিত প্রকৃতি-প্রত্যয় বিশ্লেষণের ওপর পূর্ণাঙ্গ মডেল টেস্ট।',
  durationMinutes: 10,
  totalMarks: 5,
  passPercentage: 60,
  difficulty: 'MEDIUM',
  questionCount: 5,
  questionIds: [124001, 124002, 124003, 124004, 124005],
  status: 'PUBLISHED'
};

// ============================================================================
// CHAPTER 25: শব্দগঠন পদ্ধতি (Word Formation)
// ============================================================================
const CHAPTER_25_TOPICS = [
  {
    id: 12501,
    chapterId: 125,
    parentTopicId: null,
    subject: 'BANGLA',
    topicNo: '২৫.১',
    titleBn: 'শব্দগঠনের প্রধান মাধ্যমসমূহ: মৌলিক বনাম সাধিত শব্দ',
    titleEn: 'Mechanisms of Word Formation: Primary vs Derived Words',
    slug: 'b25-shobdogothon-moulik-o-shadhito',
    difficulty: 'BOARD_STANDARD',
    classLevel: 'Class 8 - 12 (SSC & HSC)',
    summaryBn: 'গঠন অনুসারে শব্দ ২ প্রকার: মৌলিক শব্দ ও সাধিত শব্দ। সাধিত শব্দ মূলত উপসর্গ, প্রত্যয়, সমাস ও সন্ধির মাধ্যমে গঠিত হয়।',
    definitionBn: 'শব্দগঠন (Word Formation): ভাষায় নতুন নতুন শব্দ সৃষ্টির ব্যাকরণিক প্রক্রিয়াকে শব্দগঠন বলে। গঠনগতভাবে শব্দ ২ প্রকার:\n১. মৌলিক শব্দ (Primary Words): যেসব শব্দকে আর বিশ্লেষণ বা কোনো ক্ষুদ্রাংশে ভাঙা যায় না এবং ভাঙলে কোনো অর্থসংগতি থাকে না, তাদের মৌলিক শব্দ বলে। যেমন: গোলাপ, নাক, লাল, হাত, বই, তিন।\n২. সাধিত শব্দ (Derived/Formed Words): মৌলিক শব্দ বা ধাতুর সাথে বিভিন্ন ব্যাকরণিক উপাদান যুক্ত হয়ে যে নতুন শব্দ গঠিত হয়, তাদের সাধিত শব্দ বলে। যেমন: ডুবুরি, চলন্ত, প্রতিদিন, সিংহাসন, বিদ্যালয়।',
    definitionEn: 'Word formation mechanisms transform root morphemes into complex derived words (Shadhito) via Affixation (Prefix/Suffix), Compounding (Shomash), and Sandhi.',
    explanationBn: 'বাংলা ভাষায় শব্দগঠনের প্রধান ৫টি কারখানা:\n১. উপসর্গ যোগে শব্দগঠন: শব্দের পূর্বে উপসর্গ যুক্ত হয়ে (প্র + ভাব = প্রভাব, অতি + মানব = অতিমানব)।\n২. প্রত্যয় যোগে শব্দগঠন: শব্দের বা ধাতুর শেষে প্রত্যয় যুক্ত হয়ে (পড়্ + অন্ত = পড়ন্ত, ঢাকা + আই = ঢাকাই)।\n৩. সমাসের সাহায্যে শব্দগঠন: একাধিক পদ এক পদে পরিণত হয়ে (সিংহ চিহ্নিত আসন = সিংহাসন, নদী মাতা যার = নদীমাতৃক)।\n৪. সন্ধির মাধ্যমে শব্দগঠন: দুটি ধ্বনির মিলনে নতুন শব্দ (বিদ্যা + আলয় = বিদ্যালয়, রবীন্দ্র = রবি + ইন্দ্র)।\n৫. দ্বিরুক্ত শব্দের মাধ্যমে শব্দগঠন: একই শব্দ দুইবার ব্যবহৃত হয়ে নতুন ভাব প্রকাশ (ঝমঝম, লাল লাল, বাড়ি বাড়ি)।',
    teacherGoldenTips: 'মাস্টার চার্ট: মৌলিক শব্দ চেনার উপায় হলো একে আর কোনোভাবে ভাঙা যায় না (গোলাপ, লাল, নাক)। আর সাধিত শব্দ মানেই এর মধ্যে উপসর্গ, প্রত্যয়, সমাস বা সন্ধি লুকিয়ে আছে!',
    rules: [
      {
        ruleNo: 1,
        nameBn: 'মৌলিক শব্দের অবিভাজ্যতা',
        explanationBn: 'মৌলিক শব্দকে খণ্ড খণ্ড করলে কোনো স্বাধীন অর্থ পাওয়া যায় না (যেমন: "নাক"-কে ভাঙলে "না" বা "ক"-এর কোনো নাক-সংক্রান্ত অর্থ থাকে না)।',
        examples: [
          {
            bn: 'গোলাপ, তিন, কান, মা (মৌলিক শব্দ)।',
            context: 'অবিভাজ্য শব্দ'
          }
        ]
      }
    ],
    formulas: [
      {
        label: 'সাধিত শব্দ গঠনের ৫টি পথ',
        structure: 'সাধিত শব্দ = উপসর্গ + শব্দ | ধাতু/শব্দ + প্রত্যয় | সমাসবদ্ধ পদ | সন্ধিজাত পদ | দ্বিরুক্ত শব্দ'
      }
    ],
    examples: [
      {
        bn: 'গোলাপ (মৌলিক শব্দ)',
        context: 'মৌলিক'
      },
      {
        bn: 'নীলপদ্ম (সমাসসাধিত শব্দ)',
        context: 'সাধিত'
      }
    ],
    exceptions: [
      {
        titleBn: 'শব্দদ্বৈত ও ধ্বন্যাত্মক গঠন',
        descriptionBn: 'সন সন, খাঁ খাঁ, টনটন—এরা স্বতন্ত্র ধ্বনি অনুকার রূপে অর্থপূর্ণ সাধিত শব্দের ভূমিকা পালন করে।'
      }
    ],
    commonMistakes: [
      {
        incorrectBn: '"নীলপদ্ম" একটি মৌলিক শব্দ।',
        correctBn: '"নীলপদ্ম" সমাসসাধিত শব্দ (নীল যে পদ্ম)।',
        explanationBn: 'কারণ একে বিশ্লেষণ করা যায়।'
      }
    ],
    writtenPractice: [
      {
        id: 1,
        type: 'CLASSIFICATION',
        prompt: 'মৌলিক ও সাধিত শব্দ পৃথক করো: গোলাপ, হাতল, নাক, বিদ্যালয়, প্রহার, তিন।',
        correctAnswer: 'মৌলিক শব্দ: গোলাপ, নাক, তিন। সাধিত শব্দ: হাতল (প্রত্যয়সাধিত), বিদ্যালয় (সন্ধিসাধিত), প্রহার (উপসর্গসাধিত)।',
        explanationBn: 'বোর্ড পরীক্ষার অত্যন্ত আকর্ষণীয় ৩ নম্বরের প্রশ্ন।'
      }
    ],
    tags: ['SHOBDOGOTHON', 'MOULIK_SHOBDO', 'SHADHITO_SHOBDO', 'WORD_FORMATION', 'SSC', 'HSC'],
    status: 'PUBLISHED',
    orderIndex: 1,
    viewCount: 350
  },
  {
    id: 12502,
    chapterId: 125,
    parentTopicId: null,
    subject: 'BANGLA',
    topicNo: '২৫.২',
    titleBn: 'অর্থের বিচারে শব্দের শ্রেণিবিভাগ: যৌগিক, রূঢ় ও যোগরূঢ় শব্দ',
    titleEn: 'Semantic Classification: Yowgik, Rudho & Yogrudho Words',
    slug: 'b25-yowgik-rudho-o-yogrudho-shobdo',
    difficulty: 'BOARD_STANDARD',
    classLevel: 'Class 8 - 12 (SSC & HSC)',
    summaryBn: 'অর্থ অনুসারে শব্দ ৩ প্রকার: যৌগিক শব্দ (বুৎপত্তি ও ব্যবহারিক অর্থ এক), রূঢ় শব্দ (প্রত্যয়যোগে বিশেষ অর্থ) ও যোগরূঢ় শব্দ (সমাসযোগে বিশেষ অর্থ)।',
    definitionBn: 'অর্থগত ৩ শ্রেণিবিভাগ:\n১. যৌগিক শব্দ (Yowgik): যেসব শব্দের বুৎপত্তিগত অর্থ এবং ব্যবহারিক অর্থ একই রকম থাকে। যেমন: গায়ক (গৈ + অক = যে গান করে), কর্তব্য (কৃ + তব্য = যা করা উচিত), বাবুয়ানা (বাবুর ভাব), দৌহিত্র (দুহিতার পুত্র), মধুর (মধুর মতো মিষ্টি)।\n২. রূঢ় বা রূঢ়ি শব্দ (Rudho): যেসব শব্দ প্রত্যয় বা উপসর্গযোগে গঠিত হয়ে বুৎপত্তিগত অর্থ না বুঝিয়ে অন্য কোনো প্রচলিত বিশিষ্ট অর্থ প্রকাশ করে। যেমন: হস্তী (হস্ত আছে যার না বুঝিয়ে পশু বিশেষ), বাঁশি (বাঁশ দিয়ে তৈরি না বুঝিয়ে বাদ্যযন্ত্র), সন্দেশ (সংবাদ না বুঝিয়ে মিষ্টান্ন), তৈল (তিলজাত স্নেহ না বুঝিয়ে যেকোনো ভোজ্য/খনিজ তেল), গবেষণা (গরু খোঁজা না বুঝিয়ে ব্যাপক অধ্যয়ন ও তত্ত্বানুসন্ধান)।\n৩. যোগরূঢ় শব্দ (Yogrudho): সমাস নিষ্পন্ন যেসব শব্দ ব্যাসবাক্যের সমস্যমান পদগুলোর অনুগামী না হয়ে একটি বিশেষ অর্থ প্রকাশ করে। যেমন: পঙ্কজ (পঙ্কে জন্মে যা = কেবল পদ্মফুল), রাজপুত (রাজার পুত্র না বুঝিয়ে বিশেষ জাতি), জলধি (জল ধারণকারী পাত্র না বুঝিয়ে সমুদ্র), মহাযাত্রা (মৃত্যু)।',
    definitionEn: 'Semantically words are classified into Yowgik (Literal), Rudho (Etymological semantic shift via affixation), and Yogrudho (Exocentric specialization via compounding).',
    explanationBn: 'বোর্ড পরীক্ষার সবচেয়ে প্রিয় মাস্টার ট্রিক:\n১. বুৎপত্তি ও ব্যবহারিক অর্থ হুবহু একই হলে = যৌগিক শব্দ! (যেমন: গায়ক গানই করে, বাবুয়ানা বাবুর মতোই ভাব)।\n২. উপসর্গ বা প্রত্যয়যোগে বিশেষ অর্থ নিলে = রূঢ় শব্দ! (যেমন: গবেষণা মানে গরু খোঁজা নয়, গবেষণা মানে রিসার্চ; সন্দেশ মানে খবর নয়, সন্দেশ মানে মিষ্টি মিষ্টি খাবার; হস্তী মানে শুঁড়যুক্ত পশু)।\n৩. সমাসযোগে গঠিত হয়ে বিশেষ অর্থ নিলে = যোগরূঢ় শব্দ! (যেমন: পঙ্কজ = পঙ্কে জন্মে যা, কিন্তু শৈবাল বা শামুককে না বুঝিয়ে শুধু পদ্মফুলকে বোঝায়; রাজপুত = রাজার ছেলে না বুঝিয়ে ভারতের ক্ষত্রিয় জাতি বিশেষকে বোঝায়)।',
    teacherGoldenTips: 'বোর্ড পরীক্ষার গোল্ডেন চার্ট:\n• যৌগিক শব্দ: গায়ক, কর্তব্য, বাবুয়ানা, মধুর, চিখামারা।\n• রূঢ় শব্দ: গবেষণা, বাঁশি, তৈল, সন্দেশ, হস্তী, প্রবীণ।\n• যোগরূঢ় শব্দ: পঙ্কজ, রাজপুত, মহাযাত্রা, জলধি!',
    rules: [
      {
        ruleNo: 1,
        nameBn: 'রূঢ় বনাম যোগরূঢ় পার্থক্যের ভিত্তি',
        explanationBn: 'রূঢ় শব্দ প্রত্যয় বা উপসর্গ যোগে গঠিত হয়; যোগরূঢ় শব্দ অবশ্যই সমাস নিষ্পন্ন হয়ে গঠিত হয়।',
        examples: [
          {
            bn: 'হস্তী (হস্তিন্ + ইন = রূঢ় শব্দ); পঙ্কজ (পঙ্কে জন্মে যা = উপপদ তৎপুরুষ সমাস = যোগরূঢ় শব্দ)।',
            context: 'গঠনগত পার্থক্যের ভিত্তি'
          }
        ]
      }
    ],
    formulas: [
      {
        label: 'অর্থগত শব্দ শ্রেণিবিভাগ ছক',
        structure: 'বুৎপত্তি = ব্যবহারিক (যৌগিক) | প্রত্যয়যোগে বিশেষ অর্থ (রূঢ়) | সমাসযোগে বিশেষ অর্থ (যোগরূঢ়)'
      }
    ],
    examples: [
      {
        bn: 'গায়ক গান গাইছেন (গায়ক = যৌগিক শব্দ)',
        context: 'যৌগিক'
      },
      {
        bn: 'গবেষণা একটি সৃষ্টিশীল কাজ (গবেষণা = রূঢ় শব্দ)',
        context: 'রূঢ়'
      },
      {
        bn: 'পুকুরে পঙ্কজ ফুটেছে (পঙ্কজ = যোগরূঢ় শব্দ)',
        context: 'যোগরূঢ়'
      }
    ],
    exceptions: [
      {
        titleBn: 'প্রবীণ শব্দের অর্থান্তর',
        descriptionBn: 'প্রকৃষ্টরূপে বীণা বাজাতে পারেন যিনি তাকে প্রবীণ না বলে বর্তমানে অভিজ্ঞ বৃদ্ধ ব্যক্তিকে প্রবীণ বলা হয় (রূঢ় শব্দ)।'
      }
    ],
    commonMistakes: [
      {
        incorrectBn: 'পঙ্কজ হলো রূঢ় শব্দ।',
        correctBn: 'পঙ্কজ হলো যোগরূঢ় শব্দ।',
        explanationBn: 'কারণ এটি সমাস নিষ্পন্ন হয়ে বিশেষ অর্থ প্রকাশ করেছে।'
      },
      {
        incorrectBn: 'গবেষণা শব্দের বুৎপত্তিগত অর্থ গবেষণা বা তত্ত্বানুসন্ধান।',
        correctBn: 'গবেষণা শব্দের বুৎপত্তিগত অর্থ "গরু খোঁজা" (গো + এষণা)।',
        explanationBn: 'রূঢ় শব্দে মূল বুৎপত্তি হারিয়ে বিশেষ অর্থ প্রধান হয়।'
      }
    ],
    writtenPractice: [
      {
        id: 1,
        type: 'CLASSIFICATION',
        prompt: 'নিচের শব্দগুলোকে যৌগিক, রূঢ় ও যোগরূঢ় শ্রেণিতে বিভক্ত করো: গায়ক, পঙ্কজ, বাঁশি, সন্দেশ, রাজপুত, কর্তব্য, জলধি।',
        correctAnswer: 'যৌগিক শব্দ: গায়ক, কর্তব্য। রূঢ় শব্দ: বাঁশি, সন্দেশ। যোগরূঢ় শব্দ: পঙ্কজ, রাজপুত, জলধি।',
        explanationBn: 'বোর্ড পরীক্ষার অত্যন্ত প্রিয় ৪ নম্বরের প্রশ্ন।'
      }
    ],
    tags: ['YOWGIK', 'RUDHO', 'YOGRUDHO', 'PANKAJ', 'GOBESHONA', 'SSC', 'HSC', 'BCS'],
    status: 'PUBLISHED',
    orderIndex: 2,
    viewCount: 440
  }
];

const CHAPTER_25_MCQS = [
  {
    id: 125001,
    chapterId: 125,
    topicId: 12501,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: 'যেসব শব্দকে আর কোনো ক্ষুদ্রাংশে বিশ্লেষণ করা যায় না, তাদের কী বলে?',
    questionEn: 'What are words called that cannot be broken down into smaller components?',
    options: ['মৌলিক শব্দ', 'সাধিত শব্দ', 'যৌগিক শব্দ', 'যোগরূঢ় শব্দ'],
    correctOptionIndex: 0,
    correctAnswerText: 'মৌলিক শব্দ',
    explanationBn: 'যেসব শব্দকে আর কোনোভাবে বিশ্লেষণ বা খণ্ড করা যায় না, তাদের মৌলিক শব্দ বলে (যেমন: গোলাপ, নাক, লাল, তিন)।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'ঢাকা বোর্ড',
    year: 2024,
    examType: 'SSC',
    tags: ['MOULIK_SHOBDO', 'DHAKA_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 125002,
    chapterId: 125,
    topicId: 12502,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: '"পঙ্কজ" (পঙ্কে জন্মে যা = পদ্মফুল)—এটি কোন শ্রেণির শব্দ?',
    questionEn: 'What type of word is "Pankaj"?',
    options: ['যোগরূঢ় শব্দ', 'রূঢ় শব্দ', 'যৌগিক শব্দ', 'মৌলিক শব্দ'],
    correctOptionIndex: 0,
    correctAnswerText: 'যোগরূঢ় শব্দ',
    explanationBn: 'সমাস নিষ্পন্ন যে শব্দ সমস্যমান পদগুলোর স্বাভাবিক অর্থ না বুঝিয়ে বিশেষ একটি বিশিষ্ট অর্থ প্রকাশ করে, তাকে যোগরূঢ় শব্দ বলে।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'রাজশাহী বোর্ড',
    year: 2023,
    examType: 'SSC',
    tags: ['YOGRUDHO', 'PANKAJ', 'RAJSHAHI_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 125003,
    chapterId: 125,
    topicId: 12502,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: '"গবেষণা" শব্দের বুৎপত্তিগত অর্থ কোনটি?',
    questionEn: 'What is the etymological root meaning of "Gobeshona"?',
    options: ['গরু খোঁজা', 'তত্ত্বানুসন্ধান', 'পশু পালন', 'বিজ্ঞানের আবিষ্কার'],
    correctOptionIndex: 0,
    correctAnswerText: 'গরু খোঁজা',
    explanationBn: 'গো + এষণা = গবেষণা শব্দের বুৎপত্তিগত আদি অর্থ হলো "গরু খোঁজা", কিন্তু রূঢ় অর্থে এর ব্যবহারিক রূপ হলো "ব্যাপক অধ্যয়ন ও তত্ত্বানুসন্ধান"।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'যশোর বোর্ড',
    year: 2024,
    examType: 'SSC',
    tags: ['GOBESHONA', 'RUDHO', 'JASHORE_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 125004,
    chapterId: 125,
    topicId: 12502,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: 'যেসব শব্দের বুৎপত্তিগত অর্থ এবং ব্যবহারিক অর্থ হুবহু একই রকম থাকে, তাদের কী বলে?',
    questionEn: 'What are words whose etymological and literal meanings are identical called?',
    options: ['যৌগিক শব্দ', 'রূঢ় শব্দ', 'যোগরূঢ় শব্দ', 'মৌলিক শব্দ'],
    correctOptionIndex: 0,
    correctAnswerText: 'যৌগিক শব্দ',
    explanationBn: 'বুৎপত্তিগত অর্থ এবং লোকব্যবহারের অর্থ অভিন্ন হলে তাকে যৌগিক শব্দ বলে (যেমন: গায়ক = গৈ + অক = যে গান করে)।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'কুমিল্লা বোর্ড',
    year: 2023,
    examType: 'SSC',
    tags: ['YOWGIK_SHOBDO', 'CUMILLA_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 125005,
    chapterId: 125,
    topicId: 12502,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: 'নিচের কোনটি রূঢ় বা রূঢ়ি শব্দের প্রকৃষ্ট উদাহরণ?',
    questionEn: 'Which of the following is a classic example of a Rudho word?',
    options: ['বাঁশি ও সন্দেশ', 'গায়ক ও কর্তব্য', 'পঙ্কজ ও জলধি', 'গোলাপ ও বই'],
    correctOptionIndex: 0,
    correctAnswerText: 'বাঁশি ও সন্দেশ',
    explanationBn: '"বাঁশি" (বাঁশনির্মিত যেকোনো বস্তু না বুঝিয়ে বিশেষ বাদ্যযন্ত্র) এবং "সন্দেশ" (সংবাদ না বুঝিয়ে মিষ্টান্ন) হলো বিখ্যাত রূঢ় শব্দ।',
    difficulty: 'MEDIUM',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'চট্টগ্রাম বোর্ড',
    year: 2024,
    examType: 'SSC',
    tags: ['BANSHI_SHONDESH', 'RUDHO_EXAMPLES', 'CHITTAGONG_BOARD'],
    status: 'ACTIVE'
  }
];

const CHAPTER_25_MODEL_TEST = {
  id: 12501,
  subject: 'BANGLA',
  chapterId: 125,
  testTitleBn: 'অধ্যায় ২৫ মডেল টেস্ট: শব্দগঠন পদ্ধতি',
  testTitleEn: 'Chapter 25 Model Test: Word Formation (Shobdogothon)',
  descriptionBn: 'মৌলিক শব্দ, সাধিত শব্দ, যৌগিক শব্দ, রূঢ় শব্দ ও যোগরূঢ় শব্দের সংজ্ঞা, পার্থক্য ও উদাহরণের ওপর পূর্ণাঙ্গ মডেল টেস্ট।',
  durationMinutes: 10,
  totalMarks: 5,
  passPercentage: 60,
  difficulty: 'MEDIUM',
  questionCount: 5,
  questionIds: [125001, 125002, 125003, 125004, 125005],
  status: 'PUBLISHED'
};

module.exports = {
  CHAPTER_21_TOPICS, CHAPTER_21_MCQS, CHAPTER_21_MODEL_TEST,
  CHAPTER_22_TOPICS, CHAPTER_22_MCQS, CHAPTER_22_MODEL_TEST,
  CHAPTER_23_TOPICS, CHAPTER_23_MCQS, CHAPTER_23_MODEL_TEST,
  CHAPTER_24_TOPICS, CHAPTER_24_MCQS, CHAPTER_24_MODEL_TEST,
  CHAPTER_25_TOPICS, CHAPTER_25_MCQS, CHAPTER_25_MODEL_TEST
};
