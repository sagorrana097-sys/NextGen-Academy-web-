/**
 * Bangla Grammar Chapters 06–10 Content:
 * Chapter 06: সর্বনাম পদ (Pronoun)
 * Chapter 07: বিশেষণ পদ (Adjective)
 * Chapter 08: ক্রিয়া পদ (Verb)
 * Chapter 09: ক্রিয়াবিশেষণ (Adverb)
 * Chapter 10: অনুসর্গ (Postposition)
 * 
 * Fully structured according to the 13-section NCTB/SSC/HSC standard.
 */

// ============================================================================
// CHAPTER 06: সর্বনাম পদ (Pronoun)
// ============================================================================
const CHAPTER_06_TOPICS = [
  {
    id: 10601,
    chapterId: 106,
    parentTopicId: null,
    subject: 'BANGLA',
    topicNo: '৬.১',
    titleBn: 'সর্বনামের সংজ্ঞা, বৈশিষ্ট্য ও প্রয়োজনীয়তা',
    titleEn: 'Definition, Characteristics & Necessity of Pronoun',
    slug: 'b06-shorbonam-shongpga-o-boishishto',
    difficulty: 'BEGINNER',
    classLevel: 'Class 6 - 12 (SSC & HSC)',
    summaryBn: 'বিশেষ্যের পরিবর্তে বা বারবার বিশেষ্যের পুনরাবৃত্তি রোধ করতে যে পদ ব্যবহৃত হয়, তাকে সর্বনাম পদ বলে।',
    definitionBn: 'সর্বনাম পদ (Pronoun): বাক্যে বিশেষ্য পদের পুনরাবৃত্তি পরিহার করে বাক্যের সৌন্দর্য, প্রাঞ্জলতা ও অর্থসঙ্গতি বৃদ্ধির জন্য বিশেষ্যের পরিবর্তে যে পদ ব্যবহৃত হয়, তাকে সর্বনাম পদ বলে। যেমন: সে, তিনি, তারা, আমরা, কে, যারা, নিজে।',
    definitionEn: 'A Pronoun (Shorbonam) is a part of speech that substitutes for a noun or noun phrase to avoid monotonous repetition and maintain discourse cohesion.',
    explanationBn: 'একই নাম বারবার উচ্চারিত হলে ভাষার মাধুর্য নষ্ট হয় (যেমন: "নজরুল একজন কবি। নজরুল চুরুলিয়ায় জন্মেছিলেন। নজরুল কবিতা লিখতেন।")। এখানে "নজরুল"-এর পরিবর্তে "তিনি" বসালে বাক্যটি সাবলীল হয় ("তিনি চুরুলিয়ায় জন্মেছিলেন, তিনি কবিতা লিখতেন")। বিশেষ্য ও সর্বনামের মূল পার্থক্য হলো: বিশেষ্য নির্দিষ্ট সত্তার নাম নির্দেশ করে, কিন্তু সর্বনাম পূর্বে উল্লিখিত বিশেষ্যের প্রতিনিধি হিসেবে বসে। বাংলায় সর্বনামের কোনো ব্যাকরণিক লিঙ্গভেদ নেই (English-এ He/She থাকলেও বাংলায় ছেলে ও মেয়ে উভয়ের জন্যই "সে/তিনি")। তবে বাংলায় রয়েছে সূক্ষ্ম সম্মানভেদ এবং কারক-বিভক্তিভেদে ব্যাপক রূপান্তর।',
    teacherGoldenTips: 'মনে রাখবেন: বাংলায় সর্বনামের কোনো লিঙ্গভেদ নেই! তবে বাংলায় রয়েছে তিন প্রকার সম্মানভেদ (সাধারণ, সম্ভ্রান্ত ও তুচ্ছ) এবং সম্ভ্রান্ত ব্যক্তির ক্ষেত্রে সর্বনামে চন্দ্রবিন্দু (তাঁর, তাঁরা, যাঁর, যাঁদের) ব্যবহার বাধ্যতামূলক!',
    rules: [
      {
        ruleNo: 1,
        nameBn: 'সম্মানসূচক সর্বনামে চন্দ্রবিন্দুর বিধান',
        explanationBn: 'সম্মানিত বা পূজনীয় ব্যক্তির ক্ষেত্রে সর্বনামের শীর্ষে চন্দ্রবিন্দু ব্যবহৃত হয় (তিনি, তাঁর, তাঁদের, যাঁর, যাঁদের)।',
        examples: [
          {
            bn: 'বঙ্গবন্ধু আমাদের জাতির পিতা। তাঁর (সম্মানসূচক) আত্মত্যাগ চিরস্মরণীয়।',
            context: 'চন্দ্রবিন্দুর সম্মানসূচক ব্যবহার',
            highlight: 'তাঁর, তিনি, তাঁরা'
          }
        ]
      },
      {
        ruleNo: 2,
        nameBn: 'বিশেষ্য ও সর্বনামের অন্বয় নীতি',
        explanationBn: 'সর্বনাম সবসময় তার পূর্ববর্তী নির্দেশিত বিশেষ্যের (Antecedent) বচন ও মর্যাদার সাথে সংগতি রেখে প্রযুক্ত হবে।',
        examples: [
          {
            bn: 'শিক্ষক ক্লাসে এলেন। তিনি (তিনিই বসবে, সে নয়) পাঠদান শুরু করলেন।',
            context: 'মর্যাদাগত সংগতি'
          }
        ]
      }
    ],
    formulas: [
      {
        label: 'সর্বনামের মূল সমীকরণ',
        structure: 'বিশেষ্যের বিকল্প রূপ = সর্বনাম পদ (Pronoun)'
      }
    ],
    examples: [
      {
        bn: 'রহিম ভালো ছাত্র, সে প্রতিদিন বিদ্যালয়ে যায়। (সে = সর্বনাম)',
        context: 'বিশেষ্যের বিকল্প'
      },
      {
        bn: 'যাঁরা দেশকে ভালোবাসেন, তাঁরাই প্রকৃত দেশপ্রেমিক। (যাঁরা...তাঁরা = সর্বনাম)',
        context: 'সাপেক্ষ জোড়'
      }
    ],
    exceptions: [
      {
        titleBn: 'সর্বনামের বিশেষণ রূপ (Pronominal Adjective)',
        descriptionBn: 'সর্বনাম যখন বিশেষ্যের পূর্বে বসে তাকে নির্দিষ্ট করে, তখন তা সর্বনাম থাকে না, সর্বনামীয় বিশেষণ হয়ে যায় (যেমন: "এই বইটি দাও")।'
      }
    ],
    commonMistakes: [
      {
        incorrectBn: 'সম্মানিত ব্যক্তির ক্ষেত্রে চন্দ্রবিন্দু ছাড়া "তার" লেখা।',
        correctBn: 'সম্মানিত ব্যক্তির ক্ষেত্রে "তাঁর" ও "তাঁরা" লেখা আবশ্যক।',
        explanationBn: 'চন্দ্রবিন্দু ছাড়া সাধারণ বা সমবয়সী বোঝায়, যা ব্যাকরণে মর্যাদাহানি ঘটায়।'
      },
      {
        incorrectBn: 'মেয়েদের ক্ষেত্রে "সে"-এর বদলে "তিনি" বা আলাদা স্ত্রীলিঙ্গ রূপ খোজা।',
        correctBn: 'বাংলায় নারী-পুরুষ উভয়ের জন্যই "সে" ও "তিনি" সমভাবে প্রযোজ্য।',
        explanationBn: 'বাংলা সর্বনামে কোনো লিঙ্গভেদ নেই।'
      }
    ],
    writtenPractice: [
      {
        id: 1,
        type: 'DEFINITION',
        prompt: 'সর্বনাম পদ কাকে বলে? বিশেষ্য ও সর্বনামের মধ্যে দুটি পার্থক্য লিখ।',
        correctAnswer: 'বিশেষ্যের পুনরাবৃত্তি রোধে তার পরিবর্তে যে পদ বসে তাকে সর্বনাম বলে। পার্থক্য: ১. বিশেষ্য কোনো কিছুর সরাসরি নাম নির্দেশ করে, সর্বনাম পূর্বে উল্লেখিত নামের প্রতিনিধি হিসেবে বসে। ২. বিশেষ্যের লিঙ্গভেদ থাকলেও বাংলা সর্বনামের কোনো লিঙ্গভেদ নেই।',
        explanationBn: 'বোর্ডের ক-অংশের আদর্শ উত্তর।'
      },
      {
        id: 2,
        type: 'ERROR_CORRECTION',
        prompt: 'বাক্যটি শুদ্ধ করো: "রবীন্দ্রনাথ একজন মহৎ কবি ছিলেন, তার নোবেল পুরস্কার লাভ বাংলা সাহিত্যের গৌরব।"',
        correctAnswer: 'শুদ্ধ রূপ: "রবীন্দ্রনাথ একজন মহৎ কবি ছিলেন, তাঁর নোবেল পুরস্কার লাভ বাংলা সাহিত্যের গৌরব।" (সম্মানসূচক চন্দ্রবিন্দু যুক্ত "তাঁর")।',
        explanationBn: 'মর্যাদাসূচক সর্বনামে চন্দ্রবিন্দুর শুদ্ধ প্রয়োগ।'
      }
    ],
    tags: ['SHORBONAM', 'PRONOUN', 'HONORIFIC', 'SSC', 'HSC'],
    status: 'PUBLISHED',
    orderIndex: 1,
    viewCount: 180
  },
  {
    id: 10602,
    chapterId: 106,
    parentTopicId: null,
    subject: 'BANGLA',
    topicNo: '৬.২',
    titleBn: 'সর্বনামের পূর্ণাঙ্গ শ্রেণিবিভাগ',
    titleEn: 'Comprehensive Classification of Pronouns',
    slug: 'b06-shorbonamer-shrenibibhag',
    difficulty: 'BOARD_STANDARD',
    classLevel: 'Class 8 - 12 (SSC & HSC)',
    summaryBn: 'অর্থ ও প্রয়োগের বিচারে সর্বনাম প্রধানত ৮ ভাগে বিভক্ত: ব্যক্তিবাচক, আত্মবাচক, নির্দেশক, অনির্দেশক, প্রশ্নবাচক, সাপেক্ষ, পারস্পরিক ও সাকুল্যবাচক।',
    definitionBn: 'সর্বনামের শ্রেণিবিভাগ: ১. ব্যক্তিবাচক: আমি, আমরা, তুমি, তোমরা, সে, তারা, তিনি। ২. আত্মবাচক: স্বয়ং, নিজে, আপনি (কর্তা স্বয়ং নিজেকে বোঝালে)। ৩. নির্দেশক: এ, এরা, ইনি, ও, ওরা, উনি, তা, সেটা। ৪. অনির্দেশক: কেউ, কোনো, কিছু, কতিপয়। ৫. প্রশ্নবাচক: কে, কী, কাকে, কার, কোন। ৬. সাপেক্ষ বা সম্বন্ধসূচক: যে...সে, যারা...তারা, যিনি...তিনি, যা...তা। ৭. পারস্পরিক বা ব্যতিহারিক: পরস্পর, আপনা-আপনি, নিজে নিজে। ৮. সাকুল্যবাচক: সব, সকল, সমুদয়, উভয়, তামাম।',
    definitionEn: 'Pronouns are categorized into Personal, Reflexive, Demonstrative, Indefinite, Interrogative, Relative, Reciprocal, and Universal classes.',
    explanationBn: 'বোর্ড পরীক্ষায় প্রায়ই "সাপেক্ষ সর্বনাম" ও "ব্যতিহারিক সর্বনাম" থেকে প্রশ্ন আসে: সাপেক্ষ সর্বনামে দুটি বাক্য পরস্পর নির্ভরশীল হয় (যেমন: "যে পরিশ্রম করে, সেই ফল পায়")। পারস্পরিক সর্বনামে দুই পক্ষের পারষ্পরিক সংযোগ ঘটে (যেমন: "তারা পরস্পর ভাই ভাই")। আত্মবাচক সর্বনামে কর্তা স্বয়ং নিজেকে নির্দেশ করে (যেমন: "তিনি স্বয়ং উপস্থিত ছিলেন")। অনির্দেশক সর্বনামে কোনো অনির্দিষ্ট ব্যক্তি বা বস্তুকে বোঝায় (যেমন: "কেউ একজন এসেছিল")।',
    teacherGoldenTips: 'মাস্টার চার্ট: (১) "স্বয়ং/নিজে" → আত্মবাচক। (২) "পরস্পর" → পারস্পরিক। (৩) "যে...সে / যিনি...তিনি" → সাপেক্ষ সর্বনাম। (৪) "কেউ/কিছু" → অনির্দেশক। (৫) "কে/কী" → প্রশ্নবাচক। (৬) "সব/সকল" → সাকুল্যবাচক।',
    rules: [
      {
        ruleNo: 1,
        nameBn: 'সাপেক্ষ সর্বনামের জোড় রূপ',
        explanationBn: 'সাপেক্ষ সর্বনাম সবসময় জোড়ায় জোড়ায় বসে দুটি খণ্ডবাক্যকে সংযুক্ত করে।',
        examples: [
          {
            bn: 'যাঁরা দেশকে ভালোবাসেন, তাঁরাই প্রকৃত দেশপ্রেমিক। (যাঁরা...তাঁরাই = সাপেক্ষ সর্বনাম)',
            context: 'সাপেক্ষ সর্বনাম'
          }
        ]
      },
      {
        ruleNo: 2,
        nameBn: 'আত্মবাচক বনাম মধ্যম পুরুষ "আপনি"',
        explanationBn: '"আপনি আসুন" বললে শ্রোতা (মধ্যম পুরুষ); কিন্তু "তিনি আপনিই চলে গেলেন" বললে আত্মবাচক সর্বনাম (নিজে নিজে অর্থে)।',
        examples: [
          {
            bn: 'তিনি আপনিই সব স্বীকার করলেন। (এখানে আপনি = আত্মবাচক সর্বনাম)',
            context: 'আপনি শব্দের দ্বিবিধ রূপ'
          }
        ]
      }
    ],
    formulas: [
      {
        label: 'সাপেক্ষ সর্বনাম সূত্র',
        structure: 'যে (শর্ত) + সে (ফলাফল) = সাপেক্ষ সর্বনাম (Relative Pronoun)'
      }
    ],
    examples: [
      {
        bn: 'আমি নিজে কাজটি করেছি (নিজে = আত্মবাচক সর্বনাম)',
        context: 'আত্মবাচক'
      },
      {
        bn: 'আমরা পরস্পরকে সাহায্য করব (পরস্পর = পারস্পরিক সর্বনাম)',
        context: 'পারস্পরিক'
      }
    ],
    exceptions: [
      {
        titleBn: 'যৌগিক সর্বনাম',
        descriptionBn: 'যে কেউ, যে কোনো, যা কিছু—একাধিক সর্বনাম একসাথে বসে যৌগিক বা বিশিষ্ট অনির্দেশক সর্বনাম গঠন করে।'
      }
    ],
    commonMistakes: [
      {
        incorrectBn: '"পরস্পর" একটি অব্যয় পদ।',
        correctBn: '"পরস্পর" একটি পারস্পরিক বা ব্যতিহারিক সর্বনাম পদ।',
        explanationBn: 'কারণ এটি দুই বা ততোধিক ব্যক্তির পারস্পরিক সম্পর্কবাচক প্রতিনিধি।'
      }
    ],
    writtenPractice: [
      {
        id: 1,
        type: 'IDENTIFICATION',
        prompt: 'নিচের বাক্যগুলোতে চিহ্নিত সর্বনামের শ্রেণি নির্ণয় করো: (ক) যে সহে, সে রহে। (খ) তিনি স্বয়ং এ কথা বলেছেন। (গ) কেউ কথা রাখেনি।',
        correctAnswer: '(ক) "যে...সে": সাপেক্ষ সর্বনাম। (খ) "স্বয়ং": আত্মবাচক সর্বনাম। (গ) "কেউ": অনির্দেশক সর্বনাম।',
        explanationBn: 'বোর্ডের গুরুত্বপূর্ণ ৩ নম্বরের প্রশ্ন।'
      }
    ],
    tags: ['PRONOUN_TYPES', 'RELATIVE', 'REFLEXIVE', 'RECIPROCAL', 'INDEFINITE', 'SSC'],
    status: 'PUBLISHED',
    orderIndex: 2,
    viewCount: 220
  },
  {
    id: 10603,
    chapterId: 106,
    parentTopicId: null,
    subject: 'BANGLA',
    topicNo: '৬.৩',
    titleBn: 'সর্বনামের পুরুষভেদ, বিভক্তি প্রয়োগ ও অশুদ্ধি সংশোধন',
    titleEn: 'Person Variation, Case Inflections in Pronouns & Error Correction',
    slug: 'b06-purushbhed-bibhokti-o-shuddhota',
    difficulty: 'BOARD_STANDARD',
    classLevel: 'Class 8 - 12 (SSC & HSC)',
    summaryBn: 'সর্বনামে তিন পুরুষ (উত্তম, মধ্যম ও নাম) এবং তিন মর্যাদা (সাধারণ, সম্ভ্রান্ত, তুচ্ছ) থাকে। বিভক্তিযুক্ত হয়ে সর্বনামের মূল রূপ ব্যাপকভাবে পরিবর্তিত হয়।',
    definitionBn: 'সর্বনামের রূপান্তর: সর্বনাম পদ কারক-বিভক্তি ও বচনের সংযোগে মূল প্রাতিপদিক রূপ পরিবর্তন করে। যেমন: "আমি" + কে = "আমাকে"; "তিনি" + এর = "তাঁহার/তাঁর"; "সে" + রা = "তারা"। পুরুষভেদে রূপ: উত্তম পুরুষ (আমি/আমরা), মধ্যম পুরুষ (তুমি/তুই/আপনি), নাম পুরুষ (সে/তিনি/তারা/তাঁরা)।',
    definitionEn: 'Pronouns inflect extensively across Persons (1st, 2nd, 3rd) and Honorific tiers (Ordinary, Respectful, Intimate), adopting suppletive forms when combined with case suffixes.',
    explanationBn: 'বোর্ড পরীক্ষায় বিভক্তিযুক্ত সর্বনামের অশুদ্ধি সংশোধন অত্যন্ত গুরুত্বপূর্ণ: ১. "তাহাকে" বা "তাকে" (দ্বিতীয়া/চতুর্থী বিভক্তি)। ২. "তাহাদের" বা "তাদের" (ষষ্ঠী বহুবচন)। ৩. "কাহারা" বা "কারা" (প্রথমা বহুবচন)। ৪. প্রচলিত মারাত্মক ভুল: সাধু ও চলিত রূপের মিশ্রণ—যেমন: "তাহাকে আমি বলব" (ভুল, হয় "তাকে আমি বলব" অথবা "তাহাকে আমি বলিব")। একই বাক্যে সম্ভ্রান্ত ও তুচ্ছ সর্বনামের মিশ্রণ করাও গুরুচণ্ডালী দোষের সমান ভুল।',
    teacherGoldenTips: 'গোল্ডেন অন্বয় রুল: কর্তা যদি "আপনি" হয়, ক্রিয়া হবে "যান/বলেন"; কর্তা যদি "তুমি" হয়, ক্রিয়া হবে "যাও/বলো"; কর্তা যদি "তুই" হয়, ক্রিয়া হবে "যাস/বলিস"। এই সংগতি ভঙ্গ করলে পুরো বাক্যের ব্যাকরণ ভুল হয়ে যায়!',
    rules: [
      {
        ruleNo: 1,
        nameBn: 'পুরুষ ও সম্মান অনুযায়ী ক্রিয়ার সমতা',
        explanationBn: 'সর্বনামের মর্যাদা স্তর (সম্ভ্রান্ত, সাধারণ, তুচ্ছ) অনুযায়ী ক্রিয়াপদের রূপ নির্বাচন করতে হবে।',
        examples: [
          {
            bn: 'অশুদ্ধ: আপনি কাল এসো। শুদ্ধ: আপনি কাল আসবেন। অশুদ্ধ: তুই কেমন আছেন? শুদ্ধ: তুই কেমন আছিস?',
            context: 'সর্বনাম ও ক্রিয়ার অন্বয়'
          }
        ]
      }
    ],
    formulas: [
      {
        label: 'সর্বনাম ও বিভক্তির রূপান্তর ছক',
        structure: 'আমি + কে = আমাকে | সে + র = তার | তিনি + র = তাঁর | কে + কে = কাকে'
      }
    ],
    examples: [
      {
        bn: 'তাঁদের অবদান জাতি চিরদিন স্মরণ রাখবে (তাঁদের = সম্ভ্রান্ত ষষ্ঠী বহুবচন)',
        context: 'বিভক্তিযুক্ত সর্বনাম'
      }
    ],
    exceptions: [
      {
        titleBn: 'কাব্যিক রূপান্তর',
        descriptionBn: 'প্রাচীন ও মধ্যযুগীয় কাব্যে "মোর", "তোরে", "মোদের", "সবারে" ইত্যাদি বিশেষ ছন্দোময় সর্বনাম রূপ ব্যবহৃত হয়।'
      }
    ],
    commonMistakes: [
      {
        incorrectBn: 'আপনি যা বলেছেন তা আমি শুনব না তুই কী বলিস।',
        correctBn: 'একই বক্তব্যে "আপনি" ও "তুই" সংমিশ্রণ ব্যাকরণিক অসঙ্গতি তৈরি করে।',
        explanationBn: 'একই ব্যক্তির প্রতি সম্বোধনের ধারাবাহিকতা বজায় রাখতে হবে।'
      }
    ],
    writtenPractice: [
      {
        id: 1,
        type: 'ERROR_CORRECTION',
        prompt: 'বাক্যটি শুদ্ধ করে লিখ: "আপনি যদি আসো তবে আমি তাকে সব কথা বলিয়া দিব।"',
        correctAnswer: 'চলিত প্রমিত রূপ: "আপনি যদি আসেন তবে আমি তাকে সব কথা বলে দেব।" অথবা সাধু রূপ: "আপনি যদি আসেন তবে আমি তাহাকে সকল কথা বলিয়া দিব।"'
      }
    ],
    tags: ['PURUSHBHED', 'HONORIFIC', 'INFLECTION', 'ERROR_CORRECTION', 'SSC', 'HSC'],
    status: 'PUBLISHED',
    orderIndex: 3,
    viewCount: 190
  }
];

const CHAPTER_06_MCQS = [
  {
    id: 106001,
    chapterId: 106,
    topicId: 10601,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: 'বিশেষ্যের পুনরাবৃত্তি রোধ করে ভাষার সৌন্দর্য বৃদ্ধির জন্য কোন পদ ব্যবহৃত হয়?',
    questionEn: 'Which part of speech is used to prevent noun repetition?',
    options: ['বিশেষণ পদ', 'সর্বনাম পদ', 'ক্রিয়া পদ', 'অব্যয় পদ'],
    correctOptionIndex: 1,
    correctAnswerText: 'সর্বনাম পদ',
    explanationBn: 'বিশেষ্যের পুনরাবৃত্তি পরিহার করে তার পরিবর্তে যে পদ ব্যবহৃত হয় তাকে সর্বনাম পদ বলে।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'ঢাকা বোর্ড',
    year: 2024,
    examType: 'SSC',
    tags: ['SHORBONAM', 'DEFINITION', 'DHAKA_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 106002,
    chapterId: 106,
    topicId: 10602,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: '"যে সহে, সে রহে"—এখানে "যে...সে" কোন শ্রেণির সর্বনাম?',
    questionEn: 'In "Je shohe, she rohe", what type of pronoun is "je...she"?',
    options: ['সাপেক্ষ সর্বনাম', 'ব্যক্তিবাচক সর্বনাম', 'অনির্দেশক সর্বনাম', 'আত্মবাচক সর্বনাম'],
    correctOptionIndex: 0,
    correctAnswerText: 'সাপেক্ষ সর্বনাম',
    explanationBn: 'পরস্পর নির্ভরশীল হয়ে দুটি খণ্ডবাক্যকে সংযুক্তকারী সর্বনামকে সাপেক্ষ বা সম্বন্ধসূচক সর্বনাম বলে।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'রাজশাহী বোর্ড',
    year: 2023,
    examType: 'SSC',
    tags: ['RELATIVE_PRONOUN', 'RAJSHAHI_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 106003,
    chapterId: 106,
    topicId: 10602,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: 'নিচের কোনটি আত্মবাচক সর্বনামের উদাহরণ?',
    questionEn: 'Which of the following is an example of a Reflexive Pronoun?',
    options: ['স্বয়ং', 'পরস্পর', 'কেউ', 'কখন'],
    correctOptionIndex: 0,
    correctAnswerText: 'স্বয়ং',
    explanationBn: 'স্বয়ং, নিজ, নিজে, আপনি হলো আত্মবাচক সর্বনাম (Reflexive Pronoun)।',
    difficulty: 'MEDIUM',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'যশোর বোর্ড',
    year: 2024,
    examType: 'SSC',
    tags: ['REFLEXIVE', 'SWOYONG', 'JASHORE_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 106004,
    chapterId: 106,
    topicId: 10602,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: '"দশে মিলে করি কাজ"—এখানে "দশে" কোন ধরনের সর্বনামের ব্যঞ্জনা প্রকাশ করে?',
    questionEn: 'In "Doshe mile kori kaaj", what type of pronoun nuance is conveyed?',
    options: ['সাকুল্যবাচক', 'আত্মবাচক', 'সাপেক্ষ', 'প্রশ্নবাচক'],
    correctOptionIndex: 0,
    correctAnswerText: 'সাকুল্যবাচক',
    explanationBn: '"দশে" বলতে এখানে দশজন বা সকলের ঐক্যবদ্ধ সমষ্টিকে নির্দেশ করায় এটি সাকুল্যবাচক ভাব প্রকাশ করে।',
    difficulty: 'HARD',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'কুমিল্লা বোর্ড',
    year: 2023,
    examType: 'SSC',
    tags: ['SHAKULLO', 'CUMILLA_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 106005,
    chapterId: 106,
    topicId: 10603,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: 'সম্মানিত ব্যক্তির ক্ষেত্রে সর্বনামে কোন চিহ্নের ব্যবহার বাধ্যতামূলক?',
    questionEn: 'Which diacritical mark is mandatory on pronouns for respectful persons?',
    options: ['চন্দ্রবিন্দু (ঁ)', 'বিসর্গ (ঃ)', 'হসন্ত (্)', 'দাঁড়ি (।)'],
    correctOptionIndex: 0,
    correctAnswerText: 'চন্দ্রবিন্দু (ঁ)',
    explanationBn: 'বাংলায় সম্ভ্রান্ত বা সম্মানিত ব্যক্তির সর্বনামে সম্মানসূচক দ্যোতনা দিতে চন্দ্রবিন্দু ব্যবহার করা হয় (যেমন: তিনি, তাঁর, তাঁরা)।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'চট্টগ্রাম বোর্ড',
    year: 2024,
    examType: 'SSC',
    tags: ['HONORIFIC', 'CHANDRABINDU', 'CHITTAGONG_BOARD'],
    status: 'ACTIVE'
  }
];

const CHAPTER_06_MODEL_TEST = {
  id: 10601,
  subject: 'BANGLA',
  chapterId: 106,
  testTitleBn: 'অধ্যায় ০৬ মডেল টেস্ট: সর্বনাম পদ',
  testTitleEn: 'Chapter 06 Model Test: Pronoun (Shorbonam)',
  descriptionBn: 'ব্যক্তিবাচক, আত্মবাচক, সাপেক্ষ, নির্দেশক, অনির্দেশক ও সাকুল্যবাচক সর্বনাম এবং সম্মানসূচক নিয়মের ওপর পূর্ণাঙ্গ বোর্ড স্ট্যান্ডার্ড মডেল টেস্ট।',
  durationMinutes: 10,
  totalMarks: 5,
  passPercentage: 60,
  difficulty: 'MEDIUM',
  questionCount: 5,
  questionIds: [106001, 106002, 106003, 106004, 106005],
  status: 'PUBLISHED'
};

// ============================================================================
// CHAPTER 07: বিশেষণ পদ (Adjective)
// ============================================================================
const CHAPTER_07_TOPICS = [
  {
    id: 10701,
    chapterId: 107,
    parentTopicId: null,
    subject: 'BANGLA',
    topicNo: '৭.১',
    titleBn: 'বিশেষণ পদের সংজ্ঞা, বৈশিষ্ট্য ও প্রকারভেদ',
    titleEn: 'Definition, Characteristics & Types of Adjective',
    slug: 'b07-bisheshon-shongpga-o-prokarbhed',
    difficulty: 'BEGINNER',
    classLevel: 'Class 6 - 12 (SSC & HSC)',
    summaryBn: 'যে পদ অন্য কোনো পদের দোষ, গুণ, অবস্থা, সংখ্যা, পরিমাণ ইত্যাদি প্রকাশ করে, তাকে বিশেষণ পদ বলে।',
    definitionBn: 'বিশেষণ পদ (Adjective): যে পদ বিশেষ্য, সর্বনাম বা অন্য কোনো পদের দোষ, গুণ, অবস্থা, সংখ্যা, পরিমাণ ইত্যাদি নির্দেশ বা বিশেষিত করে, তাকে বিশেষণ পদ বলে। যেমন: নীল আকাশ (গুণ), দশটি টাকা (সংখ্যা), চলন্ত ট্রেন (অবস্থা)।',
    definitionEn: 'An Adjective (Bisheshon) modifies or qualifies a noun, pronoun, or other grammatical elements by expressing quality, quantity, state, or number.',
    explanationBn: 'বিশেষণ প্রধানত দুই শ্রেণিতে বিভক্ত: ১. নাম বিশেষণ: যা কোনো বিশেষ্য বা সর্বনাম পদকে বিশেষিত করে। ২. ভাব বিশেষণ: যা বিশেষ্য ও সর্বনাম ছাড়া অন্য পদকে (যেমন: ক্রিয়া, বিশেষণ, অব্যয় বা সমগ্র বাক্য) বিশেষিত করে। নাম বিশেষণকে আবার রূপবাচক, গুণবাচক, অবস্থাবাচক, সংখ্যাবাচক, ক্রমবাচক, পরিমাণবাচক, উপাদানবাচক ইত্যাদিতে ভাগ করা হয়। বিশেষ্য ও সর্বনামের সাথে বিশেষণের সম্পর্ক অত্যন্ত ঘনিষ্ঠ; বিশেষণের স্বাভাবিক অবস্থান বিশেষ্যের পূর্বে (যেমন: "জ্ঞানী লোক"), তবে বাক্যের বিধেয় অংশে পরেও বসতে পারে (যেমন: "লোকটি জ্ঞানী")।',
    teacherGoldenTips: 'বিশেষণ চেনার শর্টকাট: বিশেষ্যকে প্রশ্ন করুন "কেমন?", "কতটুকু?", "কত নম্বর?"—যে উত্তরটি আসবে সেটাই বিশেষণ! যেমন: কেমন ট্রেন? → চলন্ত ট্রেন (অবস্থাবাচক বিশেষণ)।',
    rules: [
      {
        ruleNo: 1,
        nameBn: 'বিশেষণের অবস্থান রীতি',
        explanationBn: 'নাম বিশেষণ সাধারণত বিশেষ্যের পূর্বে বসে, তবে বিধেয় বিশেষণ রূপে পরে বসে।',
        examples: [
          {
            bn: 'সবুজ মাঠ (পূর্বে) বনাম মাঠটি সবুজ (বিধেয় রূপে পরে)।',
            context: 'বিশেষণের অবস্থান'
          }
        ]
      },
      {
        ruleNo: 2,
        nameBn: 'সর্বনামের বিশেষণ চেনার নিয়ম',
        explanationBn: 'সর্বনাম পদের গুণ বা অবস্থা বোঝালে তা সর্বনামের বিশেষণ হয়।',
        examples: [
          {
            bn: '"করুণাময় তুমি, দীনহীন আমি।" (করুণাময় ও দীনহীন সর্বনামের বিশেষণ)',
            context: 'সর্বনামের বিশেষণ'
          }
        ]
      }
    ],
    formulas: [
      {
        label: 'বিশেষণ নির্ণয় সূত্র',
        structure: 'কেমন / কতটুকু / কত নম্বর + বিশেষ্য = বিশেষণ পদ'
      }
    ],
    examples: [
      {
        bn: 'মেটে কলসি (মেটে = উপাদানবাচক বিশেষণ)',
        context: 'উপাদানবাচক'
      },
      {
        bn: 'চলন্ত গাড়ি (চলন্ত = অবস্থাবাচক বিশেষণ)',
        context: 'অবস্থাবাচক'
      }
    ],
    exceptions: [
      {
        titleBn: 'বিশেষণ থেকে বিশেষ্য হওয়া',
        descriptionBn: '"ধনীরা সবসময় সুখী হয় না।" এখানে "ধনী" মূল বিশেষণ হলেও বহুবচন "রা" যুক্ত হয়ে জাতিবাচক বিশেষ্য হয়ে গেছে।'
      }
    ],
    commonMistakes: [
      {
        incorrectBn: '"বেলে মাটি"—এখানে "বেলে" বিশেষ্য পদ।',
        correctBn: '"বেলে মাটি"—এখানে "বেলে" উপাদানবাচক বিশেষণ পদ।',
        explanationBn: 'কারণ এটি মাটির উপাদান নির্দেশ করছে।'
      }
    ],
    writtenPractice: [
      {
        id: 1,
        type: 'CLASSIFICATION',
        prompt: 'নিচের বিশেষণগুলোর শ্রেণি নির্ণয় করো: (ক) বেলে মাটি (খ) দশম শ্রেণি (গ) রোগা শরীর।',
        correctAnswer: '(ক) বেলে মাটি: উপাদানবাচক বিশেষণ (খ) দশম শ্রেণি: ক্রমবাচক বিশেষণ (গ) রোগা শরীর: অবস্থাবাচক বিশেষণ।',
        explanationBn: 'বোর্ডের গুরুত্বপূর্ণ ৩ নম্বরের প্রশ্ন।'
      }
    ],
    tags: ['BISHESHON', 'ADJECTIVE', 'NAM_BISHESHON', 'SSC', 'HSC'],
    status: 'PUBLISHED',
    orderIndex: 1,
    viewCount: 190
  },
  {
    id: 10702,
    chapterId: 107,
    parentTopicId: null,
    subject: 'BANGLA',
    topicNo: '৭.২',
    titleBn: 'ভাব বিশেষণ, বিশেষণের অতিশায়ন ও পদান্তর',
    titleEn: 'Bhav Bisheshon, Degree of Comparison & Adjectival Derivation',
    slug: 'b07-bhav-bisheshon-otishayon-o-podantor',
    difficulty: 'BOARD_STANDARD',
    classLevel: 'Class 8 - 12 (SSC & HSC)',
    summaryBn: 'যে পদ বিশেষ্য ও সর্বনাম ভিন্ন অন্য পদকে বিশেষিত করে তা ভাব বিশেষণ। দুই বা ততোধিকের তুলনাকে বিশেষণের অতিশায়ন বলে।',
    definitionBn: 'ভাব বিশেষণ: যে পদ বিশেষ্য ও সর্বনাম ছাড়া অন্য পদকে (ক্রিয়া, বিশেষণ, অব্যয় বা বাক্য) বিশেষিত করে। ৪ প্রকার: ১. ক্রিয়াবিশেষণ (ঘোড়া দ্রুত চলে)। ২. বিশেষণের বিশেষণ (খুব ভালো ছেলে)। ৩. অব্যয়ের বিশেষণ (ধিক্ তারে)। ৪. বাক্যের বিশেষণ (বাস্তবিকই আজ আনন্দের দিন)। অতিশায়ন: দুই বা ততোধিক বিশেষ্যের গুণ বা অবস্থার তুলনা করে তারতম্য প্রকাশ করাকে বিশেষণের অতিশায়ন (Degree) বলে (যেমন: শ্রেষ্ঠ, বৃহত্তর, সবচেয়ে ভালো)।',
    definitionEn: 'Bhav Bisheshon qualifies verbs, adjectives, or entire clauses. Degree of Comparison (Otishayon) compares qualities using suffixes like -toro and -tomo.',
    explanationBn: 'বোর্ড পরীক্ষায় "বিশেষণের বিশেষণ" সর্বাধিক আসে: যেমন—"রকেট অতি দ্রুত চলে।" এখানে "চলে" ক্রিয়া, "দ্রুত" ক্রিয়াবিশেষণ, এবং "অতি" হলো ক্রিয়াবিশেষণের বিশেষণ! তৎসম শব্দে অতিশায়নে দুইয়ের মধ্যে তুলনায় "তর" (যেমন: বৃহত্তর) এবং অনেকের মধ্যে তুলনায় "তম" (যেমন: ক্ষুদ্রতম, শ্রেষ্ঠ) যুক্ত হয়। খাঁটি বাংলায় "চেয়ে", "হইতে", "সবচেয়ে", "সবার সেরা" শব্দ ব্যবহৃত হয়। দ্বৈত অতিশায়ন ("সবচেয়ে শ্রেষ্ঠ", "সবচেয়ে উচ্চতম") মারাত্মক ভুল।',
    teacherGoldenTips: 'ম্যাজিক ট্রিক: (১) অতিশায়নে দুইয়ের মাঝে তুলনা → "তর" (যেমন: রাম শ্যামের চেয়ে উচ্চতর)। (২) অনেকের মাঝে তুলনা → "তম" (যেমন: হিমালয় পৃথিবীর উচ্চতম পর্বত)। (৩) "বিশেষণের বিশেষণ" চিহ্নিত করতে "খুব", "অতি", "অত্যন্ত" খুঁজবেন!',
    rules: [
      {
        ruleNo: 1,
        nameBn: 'তৎসম অতিশায়ন সূত্র',
        explanationBn: 'দুইয়ের তুলনায় "-তর" এবং বহুর তুলনায় "-তম" প্রত্যয় যুক্ত হয়।',
        examples: [
          {
            bn: 'পদ্মা মেঘনার চেয়ে দীর্ঘতর (দুইয়ের তুলনা)। মেঘনা বাংলাদেশের দীর্ঘতম নদী (বহুর তুলনা)।',
            context: 'তর বনাম তম'
          }
        ]
      },
      {
        ruleNo: 2,
        nameBn: 'দ্বৈত অতিশায়ন পরিহার',
        explanationBn: '"সবচেয়ে" এবং "তম" বা "শ্রেষ্ঠ" একসাথে বসালে দ্বৈত বাহুল্য ভুল হয়।',
        examples: [
          {
            bn: 'অশুদ্ধ: তিনি সবচেয়ে শ্রেষ্ঠতম ব্যক্তি। শুদ্ধ: তিনি শ্রেষ্ঠ ব্যক্তি / তিনি সবার চেয়ে শ্রেষ্ঠ।',
            context: 'দ্বৈত অতিশায়ন বর্জন'
          }
        ]
      }
    ],
    formulas: [
      {
        label: 'অতিশায়নের সূত্র',
        structure: 'দুইয়ের তুলনা = মূল শব্দ + তর | বহুর তুলনা = মূল শব্দ + তম'
      }
    ],
    examples: [
      {
        bn: 'ঘোড়া খুব দ্রুত দৌড়ায় (খুব = বিশেষণের বিশেষণ, দ্রুত = ক্রিয়াবিশেষণ)',
        context: 'ভাব বিশেষণ'
      },
      {
        bn: 'ধিক্ তারে শত ধিক্ (অব্যয়ের বিশেষণ)',
        context: 'অব্যয়ের বিশেষণ'
      }
    ],
    exceptions: [
      {
        titleBn: 'খাঁটি বাংলায় বিশেষ্যের দ্বিরুক্তিতে অতিশায়ন',
        descriptionBn: '"বড় বড় গাছ", "ছোট ছোট নদী"—এখানে বিশেষণের দ্বিরুক্তি বহুবচন ও তীব্রতা প্রকাশ করে।'
      }
    ],
    commonMistakes: [
      {
        incorrectBn: 'তিনি সবার চেয়ে শ্রেষ্ঠতম ব্যক্তি।',
        correctBn: 'তিনি শ্রেষ্ঠ ব্যক্তি / তিনি সবার চেয়ে শ্রেষ্ঠ।',
        explanationBn: '"সবার চেয়ে" ও "তম" একসাথে বসলে বাহুল্য দোষ ঘটে।'
      }
    ],
    writtenPractice: [
      {
        id: 1,
        type: 'ERROR_CORRECTION',
        prompt: 'বাক্যটি শুদ্ধ করো: "হিমালয় পৃথিবীর সবচেয়ে উচ্চতম পর্বতমালা।"',
        correctAnswer: '"হিমালয় পৃথিবীর উচ্চতম পর্বতমালা" অথবা "হিমালয় পৃথিবীর সবচেয়ে উচ্চ পর্বতমালা"।',
        explanationBn: 'দ্বৈত অতিশায়ন বাহুল্য দোষ সংশোধন।'
      },
      {
        id: 2,
        type: 'IDENTIFICATION',
        prompt: '"গাড়িটি অতি দ্রুত চলছে"—এখানে "অতি" কোন পদ?',
        correctAnswer: '"অতি" হলো বিশেষণের বিশেষণ (বা ক্রিয়াবিশেষণের বিশেষণ)। কারণ এটি "দ্রুত" ক্রিয়াবিশেষণকে বিশেষিত করেছে।',
        explanationBn: 'ভাব বিশেষণের পদ পরিচয়।'
      }
    ],
    tags: ['BHAV_BISHESHON', 'OTISHAYON', 'DEGREE', 'COMPARISON', 'SSC', 'HSC'],
    status: 'PUBLISHED',
    orderIndex: 2,
    viewCount: 210
  }
];

const CHAPTER_07_MCQS = [
  {
    id: 107001,
    chapterId: 107,
    topicId: 10701,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: '"বেলে মাটি" এবং "মেটে কলসি"—এখানে "বেলে" ও "মেটে" কোন ধরনের বিশেষণ?',
    questionEn: 'What type of adjective are "Bele" and "Mete"?',
    options: ['উপাদানবাচক বিশেষণ', 'গুণবাচক বিশেষণ', 'রূপবাচক বিশেষণ', 'ক্রমবাচক বিশেষণ'],
    correctOptionIndex: 0,
    correctAnswerText: 'উপাদানবাচক বিশেষণ',
    explanationBn: 'যা দ্বারা কোনো বস্তুর তৈরি উপাদান বোঝায়, তাকে উপাদানবাচক বিশেষণ বলে (যেমন: বেলে মাটি, মেটে কলসি, পাথুরে মূর্তি)।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'ঢাকা বোর্ড',
    year: 2024,
    examType: 'SSC',
    tags: ['MATERIAL_ADJ', 'DHAKA_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 107002,
    chapterId: 107,
    topicId: 10702,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: '"ঘোড়া খুব দ্রুত চলে"—এখানে "খুব" কোন পদ?',
    questionEn: 'In "Ghora khub druto chole", what part of speech is "khub"?',
    options: ['ক্রিয়াবিশেষণ', 'বিশেষণের বিশেষণ', 'নাম বিশেষণ', 'অব্যয়ের বিশেষণ'],
    correctOptionIndex: 1,
    correctAnswerText: 'বিশেষণের বিশেষণ',
    explanationBn: '"দ্রুত" হলো ক্রিয়াবিশেষণ, আর সেই দ্রুতকে আরও তীব্র করেছে "খুব", তাই এটি বিশেষণের বিশেষণ।',
    difficulty: 'MEDIUM',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'কুমিল্লা বোর্ড',
    year: 2023,
    examType: 'SSC',
    tags: ['ADVERB_MODIFIER', 'CUMILLA_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 107003,
    chapterId: 107,
    topicId: 10701,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: '"চলন্ত ট্রেন থেকে লাফ দিয়ো না"—এখানে "চলন্ত" কোন শ্রেণির বিশেষণ?',
    questionEn: 'In "Cholonto train theke laf diyo na", what type of adjective is "cholonto"?',
    options: ['অবস্থাবাচক বিশেষণ', 'গুণবাচক বিশেষণ', 'উপাদানবাচক বিশেষণ', 'ক্রমবাচক বিশেষণ'],
    correctOptionIndex: 0,
    correctAnswerText: 'অবস্থাবাচক বিশেষণ',
    explanationBn: 'ট্রেনের চলন্ত বা গতিশীল অবস্থা প্রকাশ করায় এটি অবস্থাবাচক বিশেষণ (Adjective of State)।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'যশোর বোর্ড',
    year: 2024,
    examType: 'SSC',
    tags: ['STATE_ADJECTIVE', 'CHOLONTO', 'JASHORE_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 107004,
    chapterId: 107,
    topicId: 10702,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: 'দুইয়ের মধ্যে তুলনায় সংস্কৃত প্রত্যয় কোনটি যুক্ত হয়?',
    questionEn: 'Which Sanskrit suffix is added for comparison between two entities?',
    options: ['-তর', '-তম', '-ইক', '-তা'],
    correctOptionIndex: 0,
    correctAnswerText: '-তর',
    explanationBn: 'সংস্কৃত অতিশায়নে দুইয়ের মাঝে তুলনায় "-তর" (যেমন: বৃহত্তর) এবং অনেকের মাঝে তুলনায় "-তম" (যেমন: বৃহত্তম) যুক্ত হয়।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'সিলেট বোর্ড',
    year: 2023,
    examType: 'SSC',
    tags: ['OTISHAYON', 'TORO_TOMO', 'SYLHET_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 107005,
    chapterId: 107,
    topicId: 10702,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: 'নিচের কোন বাক্যটি দ্বৈত অতিশায়ন দোষমুক্ত ও শুদ্ধ?',
    questionEn: 'Which sentence is free from pleonastic double-degree error and correct?',
    options: [
      'তিনি সমাজের সবচেয়ে শ্রেষ্ঠতম মানুষ।',
      'তিনি সমাজের শ্রেষ্ঠ ব্যক্তি।',
      'হিমালয় পৃথিবীর সবচাইতে উচ্চতম শৃঙ্গ।',
      'তিনি সবার চেয়ে যোগ্যতম প্রার্থী।'
    ],
    correctOptionIndex: 1,
    correctAnswerText: 'তিনি সমাজের শ্রেষ্ঠ ব্যক্তি।',
    explanationBn: '"শ্রেষ্ঠ" নিজেই পরম উৎকৃষ্টতা বোঝায়, এর সাথে "সবচেয়ে" বা "তম" যোগ করলে দ্বৈত অতিশায়ন ভুল হয়। তাই "তিনি সমাজের শ্রেষ্ঠ ব্যক্তি" শুদ্ধ।',
    difficulty: 'HARD',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'রাজশাহী বোর্ড',
    year: 2024,
    examType: 'SSC',
    tags: ['DEGREE_ERROR', 'CORRECTION', 'RAJSHAHI_BOARD'],
    status: 'ACTIVE'
  }
];

const CHAPTER_07_MODEL_TEST = {
  id: 10701,
  subject: 'BANGLA',
  chapterId: 107,
  testTitleBn: 'অধ্যায় ০৭ মডেল টেস্ট: বিশেষণ পদ',
  testTitleEn: 'Chapter 07 Model Test: Adjective (Bisheshon)',
  descriptionBn: 'নাম বিশেষণ, ভাব বিশেষণ, বিশেষণের বিশেষণ, অতিশায়ন এবং দ্বৈত অতিশায়ন অশুদ্ধি সংশোধনের ওপর পূর্ণাঙ্গ মডেল টেস্ট।',
  durationMinutes: 10,
  totalMarks: 5,
  passPercentage: 60,
  difficulty: 'MEDIUM',
  questionCount: 5,
  questionIds: [107001, 107002, 107003, 107004, 107005],
  status: 'PUBLISHED'
};

// ============================================================================
// CHAPTER 08: ক্রিয়া পদ (Verb)
// ============================================================================
const CHAPTER_08_TOPICS = [
  {
    id: 10801,
    chapterId: 108,
    parentTopicId: null,
    subject: 'BANGLA',
    topicNo: '৮.১',
    titleBn: 'ক্রিয়াপদের সংজ্ঞা, ধাতু ও সমাপিকা-অসমাপিকা শ্রেণিবিভাগ',
    titleEn: 'Definition, Verb Root (Dhatu), Finite & Non-finite Verbs',
    slug: 'b08-kriyapod-dhatu-shomapika-oshomapika',
    difficulty: 'BEGINNER',
    classLevel: 'Class 6 - 12 (SSC & HSC)',
    summaryBn: 'যে পদ দ্বারা কোনো কিছু করা, হওয়া, যাওয়া, খাওয়া ইত্যাদি কার্য সম্পাদন বোঝায় তাকে ক্রিয়াপদ বলে। ক্রিয়ার মূল অবিভাজ্য অংশকে ধাতু বলে।',
    definitionBn: 'ক্রিয়াপদ (Verb): যে পদ দ্বারা কোনো কিছু করা, যাওয়া, খাওয়া, হওয়া, দেখা বা কোনো কার্য সম্পাদন করা বোঝায়, তাকে ক্রিয়াপদ বলে। ধাতু (Verb Root): ক্রিয়াপদের মূল অবিভাজ্য অংশকে ধাতু বলে (যেমন: কর্ + এ = করে; এখানে "কর্" ধাতু)। ভাব প্রকাশের সম্পূর্ণতার ভিত্তিতে ক্রিয়া ২ প্রকার: ১. সমাপিকা ক্রিয়া (Finite Verb): যে ক্রিয়া দ্বারা বাক্যের অর্থ সম্পূর্ণরূপে শেষ হয়। ২. অসমাপিকা ক্রিয়া (Non-finite Verb): যে ক্রিয়া দ্বারা বাক্যের অর্থ শেষ হয় না, বক্তার বক্তব্যের আকাঙ্ক্ষা বাকি থাকে।',
    definitionEn: 'A Verb (Kriyapod) expresses an action, state, or occurrence. The root of a verb is Dhatu. Verbs are fundamentally divided into Finite (Shomapika) and Non-finite (Oshomapika).',
    explanationBn: 'ক্রিয়াপদ ছাড়া কখনো কোনো পূর্ণাঙ্গ অর্থবোধক বাক্য হতে পারে না। সমাপিকা ক্রিয়া বাক্যকে শেষ করে দেয় (যেমন: "আমরা ভাত খাই।" এখানে "খাই" সমাপিকা ক্রিয়া)। কিন্তু যদি বলা হয় "আমরা ভাত খেয়ে...", তবে বাক্য শেষ হয় না, মনে প্রশ্ন জাগে "খেয়ে কী করব?"—তাই "খেয়ে" হলো অসমাপিকা ক্রিয়া। অসমাপিকা ক্রিয়ার শেষে সাধারণত "ইলে/লে" (খেলে), "ইয়া/এ" (করে/খেয়ে), "ইতে/তে" (যেতে/করতে) বিভক্তি যুক্ত থাকে।',
    teacherGoldenTips: 'ম্যাজিক ট্রিক: বাক্যের ক্রিয়ার শেষে "তে", "এ", "লে" থাকলে তা অসমাপিকা ক্রিয়া! যেমন: "পড়তে (তে)", "পড়ে (এ)", "পড়লে (লে)"। বাক্য সম্পূর্ণ শেষ হয়ে দাঁড়ি বসলে তা সমাপিকা ক্রিয়া!',
    rules: [
      {
        ruleNo: 1,
        nameBn: 'সমাপিকা ও অসমাপিকার সম্মিলন',
        explanationBn: 'একটি পূর্ণাঙ্গ বাক্যে একাধিক অসমাপিকা ক্রিয়া থাকতে পারে, কিন্তু সমাপ্তির জন্য অন্তত একটি সমাপিকা ক্রিয়া আবশ্যক।',
        examples: [
          {
            bn: 'সকালে উঠে (অসমাপিকা), মুখ ধুয়ে (অসমাপিকা), বই নিয়ে পড়তে (অসমাপিকা) বসলাম (সমাপিকা)।',
            context: 'এক বাক্যে বহু অসমাপিকা ও একক সমাপিকা',
            highlight: 'বসলাম = সমাপিকা'
          }
        ]
      }
    ],
    formulas: [
      {
        label: 'ক্রিয়া বিভক্তি সমীকরণ',
        structure: 'ধাতু + কাল/পুরুষের বিভক্তি = সমাপিকা ক্রিয়া | ধাতু + এ/তে/লে = অসমাপিকা ক্রিয়া'
      }
    ],
    examples: [
      {
        bn: 'সূর্য উঠলে আঁধার দূর হবে (উঠলে = অসমাপিকা, হবে = সমাপিকা)',
        context: 'বাক্যের গঠন'
      }
    ],
    exceptions: [
      {
        titleBn: 'উহ্য বা অনুক্ত ক্রিয়া',
        descriptionBn: 'বাংলা বাক্যে অনেক সময় "হয়" বা "আছি" ক্রিয়াটি উহ্য থাকে। যেমন: "তিনি আমার পিতা" (তিনি আমার পিতা হন)।'
      }
    ],
    commonMistakes: [
      {
        incorrectBn: 'অসমাপিকা ক্রিয়া দিয়ে একক বাক্য শেষ হতে পারে।',
        correctBn: 'অসমাপিকা ক্রিয়া একা কখনো বাক্য সমাপ্ত করতে পারে না।',
        explanationBn: 'বক্তার আকাঙ্ক্ষা অপূর্ণ থেকে যায়।'
      }
    ],
    writtenPractice: [
      {
        id: 1,
        type: 'IDENTIFICATION',
        prompt: 'চিহ্নিত ক্রিয়াগুলোর শ্রেণি নির্ণয় করো: "আমরা গান শুনে বাড়ি ফিরলাম।"',
        correctAnswer: '"শুনে": অসমাপিকা ক্রিয়া। "ফিরলাম": সমাপিকা ক্রিয়া।',
        explanationBn: 'শুনে (অসম্পূর্ণ ভাব), ফিরলাম (বাক্য সমাপ্তকারী)।'
      }
    ],
    tags: ['KRIYA', 'VERB', 'FINITE', 'NON_FINITE', 'DHATU', 'SSC'],
    status: 'PUBLISHED',
    orderIndex: 1,
    viewCount: 220
  },
  {
    id: 10802,
    chapterId: 108,
    parentTopicId: null,
    subject: 'BANGLA',
    topicNo: '৮.২',
    titleBn: 'কর্মের ভিত্তিতে ক্রিয়া (সকর্মক, অকর্মক, দ্বিকর্মক) ও প্রযোজক-যৌগিক ক্রিয়া',
    titleEn: 'Transitive, Intransitive, Ditransitive, Causative & Compound Verbs',
    slug: 'b08-kormer-bhittite-kriya-o-proyojok-yowgik',
    difficulty: 'BOARD_STANDARD',
    classLevel: 'Class 8 - 12 (SSC & HSC)',
    summaryBn: 'কর্ম থাকলে সকর্মক, না থাকলে অকর্মক, দুটি কর্ম থাকলে দ্বিকর্মক। অন্যকে দিয়ে করালে প্রযোজক এবং দুটি ক্রিয়া মিলে বিশেষ অর্থ দিলে যৌগিক ক্রিয়া।',
    definitionBn: 'কর্মভেদে ক্রিয়া: ১. সকর্মক ক্রিয়া (Transitive Verb): যে ক্রিয়ার কর্ম থাকে। ২. অকর্মক ক্রিয়া (Intransitive Verb): যে ক্রিয়ার কোনো কর্ম থাকে না। ৩. দ্বিকর্মক ক্রিয়া (Ditransitive Verb): যে ক্রিয়ার দুটি কর্ম থাকে (মুখ্য কর্ম বস্তুবাচক ও গৌণ কর্ম ব্যক্তিবাচক)। বিশেষ ক্রিয়া: ৪. প্রযোজক ক্রিয়া (Causative Verb): যে ক্রিয়া নিজে না করে অন্যকে দিয়ে পরিচালিত করায় (যেমন: মা শিশুকে চাঁদ দেখাচ্ছেন)। ৫. যৌগিক ক্রিয়া (Compound Verb): একটি অসমাপিকা ও একটি সমাপিকা ক্রিয়া যুক্ত হয়ে বিশেষ অর্থ প্রকাশ করে (যেমন: সাইরেন বেজে উঠল)। ৬. সংযোগমূলক ক্রিয়া: বিশেষ্য, বিশেষণ বা ধ্বন্যাত্মক অব্যয়ের সাথে কর্, হ্, দে, পা ধাতু যুক্ত হয়ে গঠিত ক্রিয়া (যেমন: দর্শন করলাম, মাথা ঝিমঝিম করছে)।',
    definitionEn: 'Transitive verbs take an object; Intransitive take none; Ditransitive take two. Causative involves an instigator; Compound verbs combine non-finite and finite roots for an idiomatic nuance.',
    explanationBn: 'বোর্ড পরীক্ষার সবচেয়ে প্রিয় টেকনিক হলো কর্ম চেনা: ক্রিয়াপদকে "কী" বা "কাকে" দ্বারা প্রশ্ন করলে যদি উত্তর পাওয়া যায়, তবে তা কর্ম (Object) এবং ক্রিয়াটি সকর্মক! যেমন: "বাবা আমাকে একটি কলম দিলেন।" প্রশ্ন করুন: কী দিলেন? → কলম (মুখ্য কর্ম)। কাকে দিলেন? → আমাকে (গৌণ কর্ম)। যেহেতু দুটি কর্ম আছে, তাই "দিলেন" হলো দ্বিকর্মক ক্রিয়া! আর যদি প্রশ্ন করা হয় "ছেলেটি হাসছে"—কী হাসছে? কাকে হাসছে? কোনো উত্তর নেই! তাই "হাসছে" হলো অকর্মক ক্রিয়া। প্রযোজক ক্রিয়ায় যিনি পরিচালনা করেন তিনি প্রযোজক কর্তা (মা), আর যিনি কাজটি করেন তিনি প্রযোজ্য কর্তা (শিশু)।',
    teacherGoldenTips: 'কর্ম নির্ণয়ের ম্যাজিক ফর্মুলা: ক্রিয়া + কী/কাকে = উত্তর পেলে সকর্মক, উত্তর না পেলে অকর্মক! উদাহরণ: "সে ঘুমাচ্ছে"—কী ঘুমাচ্ছে? উত্তর নেই → অকর্মক। "সে বই পড়ছে"—কী পড়ছে? বই → সকর্মক।',
    rules: [
      {
        ruleNo: 1,
        nameBn: 'দ্বিকর্মক ক্রিয়ার কর্ম বিন্যাস',
        explanationBn: 'দ্বিকর্মক ক্রিয়ায় গৌণ কর্মে বিভক্তি থাকে এবং তা ব্যক্তিবাচক হয়; মুখ্য কর্মে সাধারণত বিভক্তি থাকে না এবং তা বস্তুবাচক হয়।',
        examples: [
          {
            bn: 'শিক্ষক (কর্তা) ছাত্রদের (গৌণ কর্ম) ব্যাকরণ (মুখ্য কর্ম) পড়াচ্ছেন (প্রযোজক দ্বিকর্মক ক্রিয়া)।',
            context: 'দ্বিকর্মক ও প্রযোজক ক্রিয়ার যুগল রূপ',
            highlight: 'ছাত্রদের = গৌণ, ব্যাকরণ = মুখ্য'
          }
        ]
      }
    ],
    formulas: [
      {
        label: 'কর্ম ও ক্রিয়া সমীকরণ',
        structure: 'ক্রিয়া + কী/কাকে = উত্তর আছে (সকর্মক) | উত্তর নেই (অকর্মক) | ২টি উত্তর (দ্বিকর্মক)'
      }
    ],
    examples: [
      {
        bn: 'মা শিশুকে চাঁদ দেখাচ্ছেন (দেখাচ্ছেন = প্রযোজক ক্রিয়া)',
        context: 'প্রযোজক ক্রিয়া'
      },
      {
        bn: 'ঘটনাটা শুনে রাখো (শুনে রাখো = যৌগিক ক্রিয়া)',
        context: 'যৌগিক ক্রিয়া'
      }
    ],
    exceptions: [
      {
        titleBn: 'অকর্মক ক্রিয়ার সকর্মক হওয়া (Cognate Object / ধাত্বর্থক কর্ম)',
        descriptionBn: 'ক্রিয়ার ধাতু থেকেই যদি কর্ম সৃষ্টি হয়, তবে অকর্মক ক্রিয়াও সকর্মক হয়ে যায়। যেমন: "বেশ এক ঘুম ঘুমিয়েছি।" (ঘুম ধাতু থেকে ঘুম কর্ম)।'
      }
    ],
    commonMistakes: [
      {
        incorrectBn: '"সে দ্রুত দৌড়াচ্ছে"—এখানে "দ্রুত" হলো কর্ম।',
        correctBn: '"দ্রুত" হলো ক্রিয়াবিশেষণ, কর্ম নয়। তাই "দৌড়াচ্ছে" অকর্মক ক্রিয়া।',
        explanationBn: '"কী দৌড়াচ্ছে" দিয়ে প্রশ্ন করলে দ্রুত উত্তর হয় না; "কেমন করে" দিয়ে প্রশ্ন করলে দ্রুত আসে।'
      }
    ],
    writtenPractice: [
      {
        id: 1,
        type: 'IDENTIFICATION',
        prompt: 'নিচের বাক্য দুটিতে ক্রিয়ার শ্রেণি নির্ণয় করো: (ক) বাবা আমাকে একটি ঘড়ি কিনে দিয়েছেন। (খ) আকাশে চাঁদ উঠেছে।',
        correctAnswer: '(ক) "কিনে দিয়েছেন": দ্বিকর্মক ক্রিয়া (আমাকে = গৌণ কর্ম, ঘড়ি = মুখ্য কর্ম)। (খ) "উঠেছে": অকর্মক ক্রিয়া (কোনো কর্ম নেই)।',
        explanationBn: 'বোর্ড পরীক্ষার অত্যন্ত কমন প্রশ্ন।'
      }
    ],
    tags: ['TRANSITIVE', 'INTRANSITIVE', 'DITRANSITIVE', 'CAUSATIVE', 'COMPOUND_VERB', 'SSC'],
    status: 'PUBLISHED',
    orderIndex: 2,
    viewCount: 250
  }
];

const CHAPTER_08_MCQS = [
  {
    id: 108001,
    chapterId: 108,
    topicId: 10801,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: 'ক্রিয়াপদের মূল অবিভাজ্য অংশকে কী বলে?',
    questionEn: 'What is the root of a verb called?',
    options: ['ধাতু', 'শব্দ', 'উপসর্গ', 'প্রাতিপদিক'],
    correctOptionIndex: 0,
    correctAnswerText: 'ধাতু',
    explanationBn: 'ক্রিয়াপদের মূল অবিভাজ্য অংশকে ধাতু বা ক্রিয়ামূল বলে (যেমন: পড়্, কর্, চল্)।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'ঢাকা বোর্ড',
    year: 2024,
    examType: 'SSC',
    tags: ['DHATU', 'VERB_ROOT', 'DHAKA_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 108002,
    chapterId: 108,
    topicId: 10802,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: '"মা শিশুকে ভাত খাওয়াচ্ছেন"—এখানে "খাওয়াচ্ছেন" কোন প্রকার ক্রিয়া?',
    questionEn: 'In "Ma shishuke bhat khawachhen", what type of verb is "khawachhen"?',
    options: ['প্রযোজক ক্রিয়া', 'যৌগিক ক্রিয়া', 'অকর্মক ক্রিয়া', 'সংযোগমূলক ক্রিয়া'],
    correctOptionIndex: 0,
    correctAnswerText: 'প্রযোজক ক্রিয়া',
    explanationBn: 'যে ক্রিয়া অন্যকে দিয়ে পরিচালিত করানো বোঝায় (মা নিজে খাচ্ছেন না, শিশুকে খাওয়াচ্ছেন), তাকে প্রযোজক ক্রিয়া বলে।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'রাজশাহী বোর্ড',
    year: 2023,
    examType: 'SSC',
    tags: ['CAUSATIVE', 'PROYOJOK', 'RAJSHAHI_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 108003,
    chapterId: 108,
    topicId: 10802,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: 'দ্বিকর্মক ক্রিয়ায় বস্তুবাচক কর্মটিকে কী বলা হয়?',
    questionEn: 'In a ditransitive verb, what is the inanimate object called?',
    options: ['গৌণ কর্ম', 'মুখ্য কর্ম', 'ধাত্বর্থক কর্ম', 'উদ্দেশ্য কর্ম'],
    correctOptionIndex: 1,
    correctAnswerText: 'মুখ্য কর্ম',
    explanationBn: 'দ্বিকর্মক ক্রিয়ায় বস্তুবাচক কর্মটি হলো মুখ্য কর্ম (Direct Object) এবং ব্যক্তিবাচক কর্মটি হলো গৌণ কর্ম।',
    difficulty: 'MEDIUM',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'যশোর বোর্ড',
    year: 2024,
    examType: 'SSC',
    tags: ['MUKKHO_KORMO', 'JASHORE_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 108004,
    chapterId: 108,
    topicId: 10802,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: '"সাইরেন বেজে উঠল"—এটি কোন প্রকার ক্রিয়ার উদাহরণ?',
    questionEn: 'What type of verb is "Beje uthlo"?',
    options: ['যৌগিক ক্রিয়া', 'প্রযোজক ক্রিয়া', 'অকর্মক ক্রিয়া', 'দ্বিকর্মক ক্রিয়া'],
    correctOptionIndex: 0,
    correctAnswerText: 'যৌগিক ক্রিয়া',
    explanationBn: 'একটি অসমাপিকা (বেজে) এবং একটি সমাপিকা (উঠল) ক্রিয়া যুক্ত হয়ে একটি বিশেষ অবিভাজ্য অর্থ প্রকাশ করায় এটি যৌগিক ক্রিয়া।',
    difficulty: 'MEDIUM',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'চট্টগ্রাম বোর্ড',
    year: 2023,
    examType: 'SSC',
    tags: ['YOWGIK_KRIYA', 'COMPOUND_VERB', 'CHITTAGONG_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 108005,
    chapterId: 108,
    topicId: 10801,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: '"আমরা হাত-মুখ ধুয়ে পড়তে বসলাম"—এখানে "ধুয়ে" কোন শ্রেণির ক্রিয়া?',
    questionEn: 'In "Amra hat-mukh dhuye porte boshlam", what type of verb is "dhuye"?',
    options: ['অসমাপিকা ক্রিয়া', 'সমাপিকা ক্রিয়া', 'যৌগিক ক্রিয়া', 'দ্বিকর্মক ক্রিয়া'],
    correctOptionIndex: 0,
    correctAnswerText: 'অসমাপিকা ক্রিয়া',
    explanationBn: '"ধুয়ে" ক্রিয়াপদের পর আকাঙ্ক্ষা বা বক্তব্য শেষ না হওয়ায় এটি অসমাপিকা ক্রিয়া (Non-finite Verb)।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'দিনাজপুর বোর্ড',
    year: 2024,
    examType: 'SSC',
    tags: ['OSHOMAPIKA', 'NON_FINITE', 'DINISHPUR_BOARD'],
    status: 'ACTIVE'
  }
];

const CHAPTER_08_MODEL_TEST = {
  id: 10801,
  subject: 'BANGLA',
  chapterId: 108,
  testTitleBn: 'অধ্যায় ০৮ মডেল টেস্ট: ক্রিয়া পদ',
  testTitleEn: 'Chapter 08 Model Test: Verb (Kriya)',
  descriptionBn: 'ধাতু, সমাপিকা, অসমাপিকা, সকর্মক, অকর্মক, দ্বিকর্মক, প্রযোজক ও যৌগিক ক্রিয়ার ওপর পূর্ণাঙ্গ বোর্ড স্ট্যান্ডার্ড মডেল টেস্ট।',
  durationMinutes: 10,
  totalMarks: 5,
  passPercentage: 60,
  difficulty: 'MEDIUM',
  questionCount: 5,
  questionIds: [108001, 108002, 108003, 108004, 108005],
  status: 'PUBLISHED'
};

// ============================================================================
// CHAPTER 09: ক্রিয়াবিশেষণ (Adverb)
// ============================================================================
const CHAPTER_09_TOPICS = [
  {
    id: 10901,
    chapterId: 109,
    parentTopicId: null,
    subject: 'BANGLA',
    topicNo: '৯.১',
    titleBn: 'ক্রিয়াবিশেষণের সংজ্ঞা, বৈশিষ্ট্য ও পূর্ণাঙ্গ শ্রেণিবিভাগ',
    titleEn: 'Definition, Characteristics & Complete Types of Adverbs',
    slug: 'b09-kriyabisheshon-shongpga-o-shrenibibhag',
    difficulty: 'BOARD_STANDARD',
    classLevel: 'Class 8 - 12 (SSC & HSC)',
    summaryBn: 'যে পদ ক্রিয়া নিষ্পন্ন হওয়ার স্থান, কাল, ভাব, রীতি বা পদ্ধতি প্রকাশ করে, তাকে ক্রিয়াবিশেষণ (Adverb) বলে।',
    definitionBn: 'ক্রিয়াবিশেষণ (Kriyabisheshon / Adverb): যে পদ কোনো ক্রিয়া কখন (কাল), কোথায় (স্থান), কীভাবে (রীতি/পদ্ধতি), কেন (কারণ) বা কতটুকু সম্পন্ন হয় তা নির্দেশ করে, তাকে ক্রিয়াবিশেষণ বলে। যেমন: দ্রুত চলো, সকালে এসো, তিনি এখানে থাকেন।',
    definitionEn: 'An Adverb (Kriyabisheshon) modifies a verb by indicating time, location, manner, degree, or condition under which the action takes place.',
    explanationBn: 'আধুনিক বাংলা ব্যাকরণে ক্রিয়াবিশেষণকে স্বতন্ত্র পদমর্যাদা দেওয়া হয়েছে। ক্রিয়াবিশেষণ প্রধানত কয়েকটি শ্রেণিতে বিভক্ত: ১. কালবাচক ক্রিয়াবিশেষণ (Time): ক্রিয়া সংগঠনের সময় বোঝায় (যেমন: "আজ", "কাল", "প্রতিদিন সকালে হাঁটবে")। ২. স্থানবাচক ক্রিয়াবিশেষণ (Place): ক্রিয়া কোথায় ঘটে (যেমন: "তিনি ঢাকায় থাকেন", "দূরে যেও না")। ৩. রীতিবাচক বা পদ্ধতিবাচক ক্রিয়াবিশেষণ (Manner): ক্রিয়া কীভাবে ঘটে (যেমন: "টিপটিপ বৃষ্টি পড়ছে", "ধীরে হাঁটো", "চুপচাপ বসো")। ৪. পরিমাণবাচক ক্রিয়াবিশেষণ (Degree): ক্রিয়ার মাত্রা (যেমন: "একটু অপেক্ষা করো")। ৫. নিশ্চয়তাবাচক ও নিষেধবাচক ক্রিয়াবিশেষণ: অবশ্যই যাব, তিনি যাননি।',
    teacherGoldenTips: 'ম্যাজিক কোয়েশ্চেন টেকনিক: ক্রিয়াকে প্রশ্ন করুন: (১) কখন? → কালবাচক (২) কোথায়? → স্থানবাচক (৩) কীভাবে? → রীতিবাচক। উদাহরণ: "চুপিসারে চোরটি ঢুকল"—কীভাবে ঢুকল? চুপিসারে (রীতিবাচক ক্রিয়াবিশেষণ)।',
    rules: [
      {
        ruleNo: 1,
        nameBn: 'বিশেষণ বনাম ক্রিয়াবিশেষণ পার্থক্য',
        explanationBn: 'বিশেষণ বিশেষ্য/সর্বনামের গুণ বোঝায়; ক্রিয়াবিশেষণ কাজের ধরন বোঝায়।',
        examples: [
          {
            bn: 'দ্রুত ঘোড়া (দ্রুত = নাম বিশেষণ)। ঘোড়াটি দ্রুত চলে (দ্রুত = ক্রিয়াবিশেষণ)।',
            context: 'একই শব্দের রূপভেদ'
          }
        ]
      },
      {
        ruleNo: 2,
        nameBn: 'ধ্বন্যাত্মক অব্যয় থেকে ক্রিয়াবিশেষণ',
        explanationBn: 'ধ্বন্যাত্মক শব্দগুলো বাক্যে ক্রিয়ার রূপ ও গতি প্রকাশ করলে তারা খাঁটি ক্রিয়াবিশেষণ হয়।',
        examples: [
          {
            bn: 'ঝমঝম করে বৃষ্টি পড়ছে (ঝমঝম করে = রীতিবাচক ক্রিয়াবিশেষণ)।',
            context: 'ধ্বন্যাত্মক ক্রিয়াবিশেষণ'
          }
        ]
      }
    ],
    formulas: [
      {
        label: 'ক্রিয়াবিশেষণ নির্ণয় সূত্র',
        structure: 'কখন / কোথায় / কীভাবে + ক্রিয়া = ক্রিয়াবিশেষণ'
      }
    ],
    examples: [
      {
        bn: 'মেঘনা নদী কলকল রবে বইছে (কলকল রবে = রীতিবাচক ক্রিয়াবিশেষণ)',
        context: 'পদ্ধতিবাচক'
      },
      {
        bn: 'তুমি এখানে বসো (এখানে = স্থানবাচক ক্রিয়াবিশেষণ)',
        context: 'স্থানবাচক'
      }
    ],
    exceptions: [
      {
        titleBn: 'নিষেধসূচক ক্রিয়াবিশেষণ',
        descriptionBn: '"না" এবং "নি" সমাপিকা ক্রিয়ার সাথে যুক্ত হয়ে কার্য অস্বীকার করায় এদের নিষেধসূচক ক্রিয়াবিশেষণ হিসেবে গণ্য করা হয়।'
      }
    ],
    commonMistakes: [
      {
        incorrectBn: '"ধীরে চলো"—এখানে "ধীরে" বিশেষণ পদ।',
        correctBn: '"ধীরে" ক্রিয়াবিশেষণ পদ কারণ এটি চলার পদ্ধতি বোঝাচ্ছে।',
        explanationBn: 'চলার ধরন প্রকাশ করায় এটি ক্রিয়াবিশেষণ।'
      }
    ],
    writtenPractice: [
      {
        id: 1,
        type: 'IDENTIFICATION',
        prompt: 'নিচের বাক্যগুলোতে ক্রিয়াবিশেষণ চিহ্নিত করো: (ক) গাড়িটি দ্রুত চলছে। (খ) আমরা কাল সকালে রওনা দেব। (গ) তিনি নিশ্চয়ই আসবেন।',
        correctAnswer: '(ক) "দ্রুত": রীতিবাচক ক্রিয়াবিশেষণ। (খ) "কাল সকালে": কালবাচক ক্রিয়াবিশেষণ। (গ) "নিশ্চয়ই": নিশ্চয়তাবাচক ক্রিয়াবিশেষণ।',
        explanationBn: 'ধরণ, সময় ও নিশ্চয়তা নির্দেশক নির্ণয়।'
      }
    ],
    tags: ['KRIYABISHESHON', 'ADVERB', 'MANNER', 'TIME', 'PLACE', 'DEGREE', 'SSC'],
    status: 'PUBLISHED',
    orderIndex: 1,
    viewCount: 190
  }
];

const CHAPTER_09_MCQS = [
  {
    id: 109001,
    chapterId: 109,
    topicId: 10901,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: '"টিপটিপ করে বৃষ্টি পড়ছে"—এখানে "টিপটিপ" কোন শ্রেণির ক্রিয়াবিশেষণ?',
    questionEn: 'What type of adverb is "Tip-tip"?',
    options: ['রীতিবাচক ক্রিয়াবিশেষণ', 'কালবাচক ক্রিয়াবিশেষণ', 'স্থানবাচক ক্রিয়াবিশেষণ', 'নিষেধবাচক ক্রিয়াবিশেষণ'],
    correctOptionIndex: 0,
    correctAnswerText: 'রীতিবাচক ক্রিয়াবিশেষণ',
    explanationBn: 'বৃষ্টি কীভাবে পড়ছে তার ধরন বা রীতি বোঝাচ্ছে "টিপটিপ", তাই এটি রীতিবাচক বা পদ্ধতিবাচক ক্রিয়াবিশেষণ।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'ঢাকা বোর্ড',
    year: 2024,
    examType: 'SSC',
    tags: ['MANNER_ADVERB', 'TIPTIP', 'DHAKA_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 109002,
    chapterId: 109,
    topicId: 10901,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: '"আমরা আগামীকাল সকালে রওনা হব"—এখানে "আগামীকাল সকালে" কোন পদ?',
    questionEn: 'In "Amra agamikale shokale rowna hobo", what part of speech is "agamikale shokale"?',
    options: ['কালবাচক ক্রিয়াবিশেষণ', 'স্থানবাচক ক্রিয়াবিশেষণ', 'নাম বিশেষণ', 'অব্যয় পদ'],
    correctOptionIndex: 0,
    correctAnswerText: 'কালবাচক ক্রিয়াবিশেষণ',
    explanationBn: 'ক্রিয়া সংগঠনের সুনির্দিষ্ট সময় নির্দেশ করায় এটি কালবাচক ক্রিয়াবিশেষণ (Time Adverb)।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'চট্টগ্রাম বোর্ড',
    year: 2023,
    examType: 'SSC',
    tags: ['TIME_ADVERB', 'CHITTAGONG_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 109003,
    chapterId: 109,
    topicId: 10901,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: '"তিনি নিশ্চয়ই এই পুরস্কার পাবেন"—এখানে "নিশ্চয়ই" কোন শ্রেণির ক্রিয়াবিশেষণ?',
    questionEn: 'What class of adverb is "Nishchoiyoi"?',
    options: ['নিশ্চয়তাসূচক ক্রিয়াবিশেষণ', 'স্থানবাচক ক্রিয়াবিশেষণ', 'কালবাচক ক্রিয়াবিশেষণ', 'রীতিবাচক ক্রিয়াবিশেষণ'],
    correctOptionIndex: 0,
    correctAnswerText: 'নিশ্চয়তাসূচক ক্রিয়াবিশেষণ',
    explanationBn: 'ক্রিয়া সংগঠনের দৃঢ় নিশ্চয়তা বা প্রত্যয় প্রকাশ করায় "নিশ্চয়ই" হলো নিশ্চয়তাসূচক ক্রিয়াবিশেষণ।',
    difficulty: 'MEDIUM',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'রাজশাহী বোর্ড',
    year: 2024,
    examType: 'SSC',
    tags: ['CERTAINTY_ADVERB', 'RAJSHAHI_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 109004,
    chapterId: 109,
    topicId: 10901,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: '"ধীরে ধীরে বায়ু বয়"—এখানে "ধীরে ধীরে" কোন পদ?',
    questionEn: 'In "Dhire dhire bayu boy", what part of speech is "Dhire dhire"?',
    options: ['ক্রিয়াবিশেষণ', 'নাম বিশেষণ', 'সর্বনাম', 'অনুসর্গ'],
    correctOptionIndex: 0,
    correctAnswerText: 'ক্রিয়াবিশেষণ',
    explanationBn: 'বাতাস কীভাবে বইছে তার গতি বা পদ্ধতি বোঝানোয় এটি রীতিবাচক ক্রিয়াবিশেষণ।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'যশোর বোর্ড',
    year: 2023,
    examType: 'SSC',
    tags: ['MANNER', 'DHIRE_DHIRE', 'JASHORE_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 109005,
    chapterId: 109,
    topicId: 10901,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: '"তুমি সেখানে যেও না"—এখানে "সেখানে" কোন ধরনের ক্রিয়াবিশেষণ?',
    questionEn: 'In "Tumi shekhane jeo na", what type of adverb is "shekhane"?',
    options: ['স্থানবাচক ক্রিয়াবিশেষণ', 'কালবাচক ক্রিয়াবিশেষণ', 'রীতিবাচক ক্রিয়াবিশেষণ', 'পরিমাণবাচক ক্রিয়াবিশেষণ'],
    correctOptionIndex: 0,
    correctAnswerText: 'স্থানবাচক ক্রিয়াবিশেষণ',
    explanationBn: 'যাওয়ার ক্রিয়াটি কোথায় ঘটবে সেই স্থান নির্দিষ্ট করায় এটি স্থানবাচক ক্রিয়াবিশেষণ।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'সিলেট বোর্ড',
    year: 2024,
    examType: 'SSC',
    tags: ['PLACE_ADVERB', 'SYLHET_BOARD'],
    status: 'ACTIVE'
  }
];

const CHAPTER_09_MODEL_TEST = {
  id: 10901,
  subject: 'BANGLA',
  chapterId: 109,
  testTitleBn: 'অধ্যায় ০৯ মডেল টেস্ট: ক্রিয়াবিশেষণ',
  testTitleEn: 'Chapter 09 Model Test: Adverb (Kriyabisheshon)',
  descriptionBn: 'কালবাচক, স্থানবাচক, রীতিবাচক, পরিমাণবাচক ও নিশ্চয়তাসূচক ক্রিয়াবিশেষণের ওপর পূর্ণাঙ্গ মডেল টেস্ট।',
  durationMinutes: 10,
  totalMarks: 5,
  passPercentage: 60,
  difficulty: 'MEDIUM',
  questionCount: 5,
  questionIds: [109001, 109002, 109003, 109004, 109005],
  status: 'PUBLISHED'
};

// ============================================================================
// CHAPTER 10: অনুসর্গ (Postposition)
// ============================================================================
const CHAPTER_10_TOPICS = [
  {
    id: 11001,
    chapterId: 110,
    parentTopicId: null,
    subject: 'BANGLA',
    topicNo: '১০.১',
    titleBn: 'অনুসর্গের সংজ্ঞা, বৈশিষ্ট্য ও বিভক্তি বনাম অনুসর্গ',
    titleEn: 'Definition of Postposition (Onushurgo), Features & Difference with Vibhakti',
    slug: 'b10-onushurgo-shongpga-o-bibhokti-porthokko',
    difficulty: 'BOARD_STANDARD',
    classLevel: 'Class 8 - 12 (SSC & HSC)',
    summaryBn: 'যেসব শব্দ বিশেষ্য বা সর্বনামের পরে পৃথকভাবে বসে বিভক্তির ন্যায় কাজ করে বা কারক সম্পর্ক প্রকাশ করে, তাদের অনুসর্গ বা কর্মপ্রবচনীয় বলে।',
    definitionBn: 'অনুসর্গ (Postposition / Karmaprabachaniya): যে সকল শব্দ কোনো বিশেষ্য বা সর্বনাম পদের পরে পৃথকভাবে বসে বিভক্তির মতো কারক সম্বন্ধ স্থাপন করে, তাদের অনুসর্গ বা কর্মপ্রবচনীয় বলে। যেমন: প্রতি, বিনা, বিহনে, সহ, সহিত, দ্বারা, দিয়া, জন্য, কাছে, মাঝে, হতে, থেকে, চেয়ে।',
    definitionEn: 'Postpositions (Onushurgo) are independent functional words placed after nouns/pronouns to establish syntactic relations, acting similarly to case inflections.',
    explanationBn: 'বিভক্তি ও অনুসর্গের মধ্যে মূল পার্থক্য: ১. বিভক্তির নিজস্ব কোনো স্বাধীন অর্থ নেই এবং বিভক্তি শব্দের সাথে গায়ে লেগে বা একীভূত হয়ে বসে (যেমন: "ঘরে" = ঘর + এ)। ২. অনুসর্গের নিজস্ব স্বাধীন অর্থ ও অভিধানগত অস্তিত্ব রয়েছে এবং এটি শব্দের পরে পৃথকভাবে স্পেস দিয়ে বসে (যেমন: "ঘরের মাঝে", "তোমার জন্য")। তবে কিছু অনুসর্গ যেমন "দ্বারা", "দিয়ে", "হতে", "থেকে", "চেয়ে"—এরা তৃতীয় ও পঞ্চমী বিভক্তি হিসেবেও ব্যাকরণে গণ্য হয়।',
    teacherGoldenTips: 'পার্থক্য মনে রাখার গোল্ডেন রুল: (১) বিভক্তি শব্দের গায়ে লেগে থাকে (যেমন: বনে, হাতে)। (২) অনুসর্গ আলাদা শব্দ হিসেবে পরে বসে (যেমন: বনের মধ্যে, হাতের দ্বারা)। (৩) উপসর্গ বসে শব্দের আগে, আর অনুসর্গ বসে শব্দের পরে!',
    rules: [
      {
        ruleNo: 1,
        nameBn: 'অনুসর্গের পূর্বে বিভক্তি যুক্ত হওয়ার নিয়ম',
        explanationBn: 'অনুসর্গের পূর্বে বিশেষ্য বা সর্বনামে প্রায়শই ষষ্ঠী বিভক্তি (র/এর) অথবা দ্বিতীয়া বিভক্তি (কে/রে) বসে।',
        examples: [
          {
            bn: 'তোমার (র বিভক্তি) জন্য (অনুসর্গ)। দেশের (এর বিভক্তি) তরে (অনুসর্গ)।',
            context: 'ষষ্ঠী বিভক্তির সাথে অনুসর্গ'
          }
        ]
      },
      {
        ruleNo: 2,
        nameBn: 'বিভক্তিহীন শব্দের সাথে অনুসর্গ',
        explanationBn: 'কখনো কখনো কোনো বিভক্তি চিহ্ন ছাড়াই সরাসরি প্রাতিপদিকের পরে অনুসর্গ বসে।',
        examples: [
          {
            bn: 'মন দিয়ে লেখাপড়া করো (মন + দিয়ে)। কাল অবধি অপেক্ষা করো (কাল + অবধি)।',
            context: 'বিভক্তিহীন অনুসর্গ'
          }
        ]
      }
    ],
    formulas: [
      {
        label: 'অনুসর্গ বিন্যাস সূত্র',
        structure: 'বিশেষ্য/সর্বনাম + (ষষ্ঠী/দ্বিতীয়া বিভক্তি) + অনুসর্গ = সম্বন্ধযুক্ত পদ'
      }
    ],
    examples: [
      {
        bn: 'দুখ বিনা সুখ লাভ হয় কি মহীতে? (বিনা = অনুসর্গ)',
        context: 'কাব্যিক অনুসর্গ'
      },
      {
        bn: 'তোমার কাছে আমার ঋণ অনেক (কাছে = অনুসর্গ)',
        context: 'স্থানিক অনুসর্গ'
      }
    ],
    exceptions: [
      {
        titleBn: 'অনুসর্গের পূর্বে বসা (Preposition-like)',
        descriptionBn: 'কদাচিৎ কবিতায় অনুসর্গ শব্দের পূর্বে বসতে পারে (যেমন: "বিনা স্বদেশী ভাষা মিটে কি আশা?")।'
      }
    ],
    commonMistakes: [
      {
        incorrectBn: 'উপসর্গ ও অনুসর্গ একই বিষয়।',
        correctBn: 'উপসর্গ শব্দের পূর্বে জোড়া লেগে বসে, অনুসর্গ শব্দের পরে পৃথকভাবে বসে।',
        explanationBn: 'উপ = আগে, অনু = পরে।'
      }
    ],
    writtenPractice: [
      {
        id: 1,
        type: 'DIFFERENCE',
        prompt: 'বিভক্তি ও অনুসর্গের মধ্যে দুটি মৌলিক পার্থক্য লিখ।',
        correctAnswer: '১. বিভক্তি শব্দের সাথে অবিচ্ছেদ্যভাবে যুক্ত থাকে, কিন্তু অনুসর্গ শব্দের পর পৃথকভাবে বসে। ২. বিভক্তির নিজস্ব কোনো অর্থ নেই, কিন্তু অনুসর্গের নিজস্ব স্বাধীন অর্থ রয়েছে।',
        explanationBn: 'বোর্ডের ক-অংশের ২ নম্বরের প্রশ্ন।'
      },
      {
        id: 2,
        type: 'IDENTIFICATION',
        prompt: '"শরতের পরে আসে বসন্ত"—এখানে অনুসর্গ কোনটি এবং এটি কী অর্থ প্রকাশ করেছে?',
        correctAnswer: 'অনুসর্গ হলো "পরে"। এটি এখানে কালানুক্রম বা সময়ের ধারাবাহিকতা অর্থ প্রকাশ করেছে।',
        explanationBn: 'অনুসর্গের অর্থদ্যোতকতা বিশ্লেষণ।'
      }
    ],
    tags: ['ONUSHURGO', 'POSTPOSITION', 'BIBHOKTI_DIFFERENCE', 'SSC', 'HSC'],
    status: 'PUBLISHED',
    orderIndex: 1,
    viewCount: 200
  }
];

const CHAPTER_10_MCQS = [
  {
    id: 110001,
    chapterId: 110,
    topicId: 11001,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: 'যেসব শব্দ বিশেষ্য বা সর্বনাম পদের পরে বসে বিভক্তির মতো কাজ করে, তাদের কী বলে?',
    questionEn: 'What are words that sit after nouns/pronouns and function like inflections called?',
    options: ['উপসর্গ', 'অনুসর্গ', 'প্রত্যয়', 'যোজক'],
    correctOptionIndex: 1,
    correctAnswerText: 'অনুসর্গ',
    explanationBn: 'শব্দের পরে পৃথকভাবে বসে বিভক্তির ন্যায় সম্পর্ক স্থাপনকারী শব্দকে অনুসর্গ বা কর্মপ্রবচনীয় বলে।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'ঢাকা বোর্ড',
    year: 2024,
    examType: 'SSC',
    tags: ['ONUSHURGO', 'DEFINITION', 'DHAKA_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 110002,
    chapterId: 110,
    topicId: 11001,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: '"দুখ বিনা সুখ লাভ হয় কি মহীতে?"—এখানে "বিনা" কোন পদ?',
    questionEn: 'In "Dukh bina sukh lav hoy ki mohite", what part of speech is "bina"?',
    options: ['অনুসর্গ', 'উপসর্গ', 'ক্রিয়া', 'বিশেষণ'],
    correctOptionIndex: 0,
    correctAnswerText: 'অনুসর্গ',
    explanationBn: '"বিনা" এখানে দুখ ও সুখের মধ্যে ব্যতিরেক সম্বন্ধ স্থাপনকারী অনুসর্গ হিসেবে ব্যবহৃত হয়েছে।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'কুমিল্লা বোর্ড',
    year: 2023,
    examType: 'SSC',
    tags: ['BINA', 'POSTPOSITION', 'CUMILLA_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 110003,
    chapterId: 110,
    topicId: 11001,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: 'নিচের কোন বাক্যে অনুসর্গটি শব্দের পূর্বে ব্যবহৃত হয়েছে?',
    questionEn: 'In which sentence is the postposition exceptionally placed before the word?',
    options: [
      'বিনা স্বদেশী ভাষা মিটে কি আশা?',
      'তোমার কাছে টাকা আছে কি?',
      'তিনি ঘরের মাঝে আছেন।',
      'দেশের তরে জীবন দাও।'
    ],
    correctOptionIndex: 0,
    correctAnswerText: 'বিনা স্বদেশী ভাষা মিটে কি আশা?',
    explanationBn: 'কবিতার ছন্দের খাতিরে "বিনা" অনুসর্গটি এখানে স্বদেশী ভাষার পূর্বে বসেছে।',
    difficulty: 'HARD',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'রাজশাহী বোর্ড',
    year: 2024,
    examType: 'SSC',
    tags: ['EXCEPTION', 'POSTPOSITION_PREFIX', 'RAJSHAHI_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 110004,
    chapterId: 110,
    topicId: 11001,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: 'অনুসর্গের অপর নাম কী?',
    questionEn: 'What is another name for Onushurgo in traditional grammar?',
    options: ['কর্মপ্রবচনীয়', 'অনন্বয়ী অব্যয়', 'প্রাতিপদিক', 'যোজক'],
    correctOptionIndex: 0,
    correctAnswerText: 'কর্মপ্রবচনীয়',
    explanationBn: 'সংস্কৃত ও ঐতিহ্যবাহী বাংলা ব্যাকরণে অনুসর্গকে "কর্মপ্রবচনীয়" বলা হয়।',
    difficulty: 'MEDIUM',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'যশোর বোর্ড',
    year: 2023,
    examType: 'SSC',
    tags: ['KORMAPROBOCHONIYO', 'JASHORE_BOARD'],
    status: 'ACTIVE'
  },
  {
    id: 110005,
    chapterId: 110,
    topicId: 11001,
    subject: 'BANGLA',
    questionType: 'MCQ',
    questionBn: '"মন দিয়ে লেখাপড়া করো"—এখানে "দিয়ে" কোন বিভক্তিরূপে কাজ করছে?',
    questionEn: 'In "Mon diye lekhapora koro", what case-inflection role does "diye" perform?',
    options: ['তৃতীয়া বিভক্তি', 'দ্বিতীয়া বিভক্তি', 'পঞ্চমী বিভক্তি', 'সপ্তমী বিভক্তি'],
    correctOptionIndex: 0,
    correctAnswerText: 'তৃতীয়া বিভক্তি',
    explanationBn: '"দ্বারা", "দিয়া", "কর্তৃক" হলো তৃতীয়া বিভক্তিরূপে কাজ করা করণকারক অনুসর্গ।',
    difficulty: 'EASY',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'BOARD',
    isBoardQuestion: true,
    board: 'চট্টগ্রাম বোর্ড',
    year: 2024,
    examType: 'SSC',
    tags: ['TRITIYA', 'INSTRUMENTAL', 'CHITTAGONG_BOARD'],
    status: 'ACTIVE'
  }
];

const CHAPTER_10_MODEL_TEST = {
  id: 11001,
  subject: 'BANGLA',
  chapterId: 110,
  testTitleBn: 'অধ্যায় ১০ মডেল টেস্ট: অনুসর্গ (কর্মপ্রবচনীয়)',
  testTitleEn: 'Chapter 10 Model Test: Postposition (Onushurgo)',
  descriptionBn: 'অনুসর্গের সংজ্ঞা, বিভক্তি ও অনুসর্গের পার্থক্য, কর্মপ্রবচনীয় পরিচয় এবং বাক্যে অনুসর্গের ব্যবহারের ওপর পূর্ণাঙ্গ মডেল টেস্ট।',
  durationMinutes: 10,
  totalMarks: 5,
  passPercentage: 60,
  difficulty: 'MEDIUM',
  questionCount: 5,
  questionIds: [110001, 110002, 110003, 110004, 110005],
  status: 'PUBLISHED'
};

module.exports = {
  CHAPTER_06_TOPICS, CHAPTER_06_MCQS, CHAPTER_06_MODEL_TEST,
  CHAPTER_07_TOPICS, CHAPTER_07_MCQS, CHAPTER_07_MODEL_TEST,
  CHAPTER_08_TOPICS, CHAPTER_08_MCQS, CHAPTER_08_MODEL_TEST,
  CHAPTER_09_TOPICS, CHAPTER_09_MCQS, CHAPTER_09_MODEL_TEST,
  CHAPTER_10_TOPICS, CHAPTER_10_MCQS, CHAPTER_10_MODEL_TEST
};
