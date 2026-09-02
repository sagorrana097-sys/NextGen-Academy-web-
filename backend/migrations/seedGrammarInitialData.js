/**
 * Seed Migration: English Grammar Master 23 Chapters, Topics, Questions, Board Questions & Model Tests
 * Production-Safe: Only seeds if tables are empty, preserves existing data.
 */

const {
  GrammarChapter,
  GrammarTopic,
  GrammarQuestion,
  GrammarBoardQuestion,
  GrammarModelTest
} = require('../models');

const INITIAL_CHAPTERS = [
  {
    id: 1,
    chapterNo: 1,
    titleEn: 'Basic English & Fundamentals',
    titleBn: 'মৌলিক ইংরেজি ও বর্ণমালা',
    slug: 'basic-english',
    icon: 'Sparkles',
    colorGradient: 'from-blue-600 to-indigo-600',
    descriptionBn: 'অ্যালফাবেট, ভাওয়েল-কনসোনেন্ট, সিলেবল, সাউন্ড এবং প্রাথমিক ইংরেজি বাক্য গঠনের ভিত্তি।',
    category: 'FOUNDATION',
    orderIndex: 1,
    status: 'PUBLISHED'
  },
  {
    id: 2,
    chapterNo: 2,
    titleEn: 'Parts of Speech Masterclass',
    titleBn: 'পার্টস অব স্পিচ পরিচিতি',
    slug: 'parts-of-speech',
    icon: 'Layers',
    colorGradient: 'from-purple-600 to-indigo-600',
    descriptionBn: 'ইংরেজি ব্যাকরণের ৮ প্রকার পদের সাধারণ পরিচয় ও বাক্যে তাদের সঠিক প্রয়োগ।',
    category: 'FOUNDATION',
    orderIndex: 2,
    status: 'PUBLISHED'
  },
  {
    id: 3,
    chapterNo: 3,
    titleEn: 'Noun & Its Classifications',
    titleBn: 'বিশেষ্য পদ (Noun)',
    slug: 'noun',
    icon: 'BookOpen',
    colorGradient: 'from-emerald-600 to-teal-600',
    descriptionBn: 'Proper, Common, Collective, Material, Abstract এবং Countable & Uncountable Noun-এর বিশদ নিয়ম।',
    category: 'PARTS_OF_SPEECH',
    orderIndex: 3,
    status: 'PUBLISHED'
  },
  {
    id: 4,
    chapterNo: 4,
    titleEn: 'Pronoun & Reference Rules',
    titleBn: 'সর্বনাম পদ (Pronoun)',
    slug: 'pronoun',
    icon: 'Users',
    colorGradient: 'from-amber-500 to-orange-600',
    descriptionBn: 'Personal, Relative, Demonstrative, Reflexive ইত্যাদি প্রোনাউন এবং প্রোনাউন রেফারেন্সিং।',
    category: 'PARTS_OF_SPEECH',
    orderIndex: 4,
    status: 'PUBLISHED'
  },
  {
    id: 5,
    chapterNo: 5,
    titleEn: 'Adjective & Degree Comparison',
    titleBn: 'নামবিশেষণ ও ডিগ্রির রূপান্তর',
    slug: 'adjective',
    icon: 'Award',
    colorGradient: 'from-rose-500 to-pink-600',
    descriptionBn: 'Adjective-এর প্রকারভেদ, Positive, Comparative ও Superlative ডিগ্রির ম্যাজিক রুলস।',
    category: 'PARTS_OF_SPEECH',
    orderIndex: 5,
    status: 'PUBLISHED'
  },
  {
    id: 6,
    chapterNo: 6,
    titleEn: 'Verb & Modal Auxiliaries',
    titleBn: 'ক্রিয়া ও সাহায্যকারী ক্রিয়া (Verb)',
    slug: 'verb',
    icon: 'Zap',
    colorGradient: 'from-cyan-600 to-blue-600',
    descriptionBn: 'Finite, Non-finite, Transitive, Intransitive, Linking এবং Modal Auxiliaries (Can, Could, Must, Should)।',
    category: 'VERBS',
    orderIndex: 6,
    status: 'PUBLISHED'
  },
  {
    id: 7,
    chapterNo: 7,
    titleEn: 'Tense & Time Masterclass',
    titleBn: 'টেন্স ও সময় নির্দেশক কাল',
    slug: 'tense',
    icon: 'Clock',
    colorGradient: 'from-indigo-600 to-purple-700',
    descriptionBn: '১২ প্রকার Tense-এর গঠনপ্রণালী, Time Markers, শর্টকাট গোল্ডেন রুলস ও বাস্তব উদাহরণ।',
    category: 'VERBS',
    orderIndex: 7,
    status: 'PUBLISHED'
  },
  {
    id: 8,
    chapterNo: 8,
    titleEn: 'Right Form of Verbs',
    titleBn: 'ভার্বের সঠিক রূপ ও নিয়মাবলী',
    slug: 'right-form-of-verbs',
    icon: 'CheckSquare',
    colorGradient: 'from-emerald-600 to-teal-700',
    descriptionBn: 'বোর্ড পরীক্ষার জন্য ৩০টি অত্যাবশ্যকীয় গোল্ডেন রুলস, শর্টকাট ট্রিকস ও প্র্যাকটিস।',
    category: 'CORE_GRAMMAR',
    orderIndex: 8,
    status: 'PUBLISHED'
  },
  {
    id: 9,
    chapterNo: 9,
    titleEn: 'Article (A, An, The & Zero Article)',
    titleBn: 'পদান্বয়ী নির্দেশক (Article)',
    slug: 'article',
    icon: 'BookMarked',
    colorGradient: 'from-blue-500 to-cyan-600',
    descriptionBn: 'A, An, The-এর ব্যবহার, ভৌগোলিক নামের ক্ষেত্রে The, এবং যেখানে কোনো Article বসে না (Zero Article)।',
    category: 'CORE_GRAMMAR',
    orderIndex: 9,
    status: 'PUBLISHED'
  },
  {
    id: 10,
    chapterNo: 10,
    titleEn: 'Preposition & Appropriate Prepositions',
    titleBn: 'পদান্বয়ী অব্যয় ও এপ্রোপ্রিয়েট প্রিপজিশন',
    slug: 'preposition',
    icon: 'Compass',
    colorGradient: 'from-violet-600 to-indigo-600',
    descriptionBn: 'In, On, At, By, For, With-এর বাস্তব ব্যবহার এবং বোর্ড পরীক্ষার শীর্ষ ১০০টি Appropriate Preposition।',
    category: 'CORE_GRAMMAR',
    orderIndex: 10,
    status: 'PUBLISHED'
  },
  {
    id: 11,
    chapterNo: 11,
    titleEn: 'Sentence According to Meaning',
    titleBn: 'অর্থানুসারে বাক্যের শ্রেণিবিভাগ',
    slug: 'sentence',
    icon: 'FileText',
    colorGradient: 'from-amber-600 to-yellow-600',
    descriptionBn: 'Assertive, Interrogative, Imperative, Optative ও Exclamatory বাক্যের পূর্ণাঙ্গ গঠন ও প্রয়োগ।',
    category: 'SENTENCE',
    orderIndex: 11,
    status: 'PUBLISHED'
  },
  {
    id: 12,
    chapterNo: 12,
    titleEn: 'Transformation of Sentences',
    titleBn: 'বাক্যের রূপান্তর (Transformation)',
    slug: 'transformation-of-sentence',
    icon: 'RefreshCw',
    colorGradient: 'from-rose-600 to-red-700',
    descriptionBn: 'Affirmative-Negative, Assertive-Exclamatory এবং Simple-Complex-Compound-এর ১০০% কার্যকরী নিয়ম।',
    category: 'SENTENCE',
    orderIndex: 12,
    status: 'PUBLISHED'
  },
  {
    id: 13,
    chapterNo: 13,
    titleEn: 'Voice (Active & Passive)',
    titleBn: 'বাচ্য পরিবর্তন (Voice Change)',
    slug: 'voice',
    icon: 'Volume2',
    colorGradient: 'from-teal-600 to-emerald-700',
    descriptionBn: 'Tense অনুযায়ী Voice, Interrogative, Imperative, Quasi-Passive ও Without By-এর নিয়ম।',
    category: 'ADVANCED_GRAMMAR',
    orderIndex: 13,
    status: 'PUBLISHED'
  },
  {
    id: 14,
    chapterNo: 14,
    titleEn: 'Narration (Direct & Indirect Speech)',
    titleBn: 'উক্তি পরিবর্তন (Narration / Speech)',
    slug: 'narration',
    icon: 'MessageSquare',
    colorGradient: 'from-purple-600 to-violet-700',
    descriptionBn: 'Person ও Tense পরিবর্তন, ৫ প্রকার বাক্যের ন্যারেশন এবং প্যাসেজ ন্যারেশনের বোর্ড ট্রিকস।',
    category: 'ADVANCED_GRAMMAR',
    orderIndex: 14,
    status: 'PUBLISHED'
  },
  {
    id: 15,
    chapterNo: 15,
    titleEn: 'Non-finite Verbs (Infinitive, Gerund & Participle)',
    titleBn: 'অসমাপিকা ক্রিয়া (Non-finite Verbs)',
    slug: 'non-finite-verb',
    icon: 'Flame',
    colorGradient: 'from-amber-500 to-rose-600',
    descriptionBn: 'To+V1 (Infinitive), V1+ing (Gerund ও Present Participle)-এর পার্থক্য ও ব্যবহার।',
    category: 'VERBS',
    orderIndex: 15,
    status: 'PUBLISHED'
  },
  {
    id: 16,
    chapterNo: 16,
    titleEn: 'Subject-Verb Agreement Master Rules',
    titleBn: 'সাবজেক্ট ও ভার্বের সঙ্গতি',
    slug: 'subject-verb-agreement',
    icon: 'ShieldCheck',
    colorGradient: 'from-emerald-600 to-cyan-700',
    descriptionBn: 'Singular/Plural সাবজেক্ট, Either..or, Neither..nor, With, Along with, Fractions ইত্যাদির নিয়ম।',
    category: 'CORE_GRAMMAR',
    orderIndex: 16,
    status: 'PUBLISHED'
  },
  {
    id: 17,
    chapterNo: 17,
    titleEn: 'Conditional Sentences',
    titleBn: 'শর্তমূলক বাক্য (Conditionals)',
    slug: 'conditional-sentence',
    icon: 'HelpCircle',
    colorGradient: 'from-blue-600 to-indigo-700',
    descriptionBn: 'Zero, First, Second, Third Conditionals ও Had + V3 ইনভার্টেড কন্ডিশনাল।',
    category: 'ADVANCED_GRAMMAR',
    orderIndex: 17,
    status: 'PUBLISHED'
  },
  {
    id: 18,
    chapterNo: 18,
    titleEn: 'Tag Questions Shortcut Techniques',
    titleBn: 'ট্যাগ প্রশ্ন (Tag Questions)',
    slug: 'tag-question',
    icon: 'Tag',
    colorGradient: 'from-pink-600 to-rose-600',
    descriptionBn: "ইতিবাচক-নেতিবাচক ট্যাগ, Let's / Let us, Imperative ট্যাগ এবং বোর্ড স্ট্যান্ডার্ড শর্টকাট।",
    category: 'SSC_SPECIAL',
    orderIndex: 18,
    status: 'PUBLISHED'
  },
  {
    id: 19,
    chapterNo: 19,
    titleEn: 'Phrases & Clauses',
    titleBn: 'শব্দগুচ্ছ ও খণ্ডবাক্য (Phrases & Clauses)',
    slug: 'phrase-and-clause',
    icon: 'Brain',
    colorGradient: 'from-violet-600 to-purple-800',
    descriptionBn: 'Noun/Adjective/Adverbial Phrase এবং Principal, Subordinate ও Coordinate Clause চেনার উপায়।',
    category: 'ADVANCED_GRAMMAR',
    orderIndex: 19,
    status: 'PUBLISHED'
  },
  {
    id: 20,
    chapterNo: 20,
    titleEn: 'Sentence Connectors & Linkers',
    titleBn: 'সংযোজক শব্দ (Sentence Connectors)',
    slug: 'connectors',
    icon: 'Share2',
    colorGradient: 'from-cyan-600 to-teal-700',
    descriptionBn: 'Moreover, However, Therefore, In spite of, On the contrary ইত্যাদির বোর্ডভিত্তিক প্রয়োগ।',
    category: 'SSC_SPECIAL',
    orderIndex: 20,
    status: 'PUBLISHED'
  },
  {
    id: 21,
    chapterNo: 21,
    titleEn: 'Punctuation & Capitalization',
    titleBn: 'বিরামচিহ্ন ও ক্যাপিটালাইজেশন',
    slug: 'punctuation',
    icon: 'Type',
    colorGradient: 'from-slate-700 to-slate-900',
    descriptionBn: 'Comma, Semicolon, Colon, Apostrophe, Quotation marks ও Capital letters ব্যবহারের নিয়ম।',
    category: 'FOUNDATION',
    orderIndex: 21,
    status: 'PUBLISHED'
  },
  {
    id: 22,
    chapterNo: 22,
    titleEn: 'Vocabulary, Prefix & Suffix',
    titleBn: 'শব্দভাণ্ডার, উপসর্গ ও প্রত্যয়',
    slug: 'vocabulary',
    icon: 'Globe',
    colorGradient: 'from-amber-600 to-orange-700',
    descriptionBn: 'Synonym, Antonym, Prefix-Suffix সংযোজন নিয়ম এবং বোর্ড কমন শব্দতালিকা।',
    category: 'VOCABULARY',
    orderIndex: 22,
    status: 'PUBLISHED'
  },
  {
    id: 23,
    chapterNo: 23,
    titleEn: 'SSC & HSC Grammar Master Review',
    titleBn: 'এসএসসি ও এইচএসসি ফাইনাল স্পেশাল',
    slug: 'ssc-grammar',
    icon: 'Trophy',
    colorGradient: 'from-yellow-500 to-amber-600',
    descriptionBn: 'বোর্ড পরীক্ষার বিগত বছরের প্রশ্ন বিশ্লেষণ, ১০০% কমন স্পেশাল সাজেশন ও এক্সক্লুসিভ টেকনিক।',
    category: 'SSC_SPECIAL',
    orderIndex: 23,
    status: 'PUBLISHED'
  }
];

const INITIAL_TOPICS = [
  {
    id: 701,
    chapterId: 7,
    parentTopicId: null,
    topicNo: '৭.১',
    titleEn: 'Present Indefinite Tense (Simple Present)',
    titleBn: 'সাধারণ বর্তমান কাল (Simple Present)',
    slug: 'present-indefinite-tense',
    difficulty: 'BEGINNER',
    classLevel: 'Class 6 - 12 (SSC & HSC)',
    summaryBn: 'বর্তমান সময়ে সাধারণভাবে ঘটে এমন কাজ, চিরন্তন সত্য (Universal Truth), অভ্যাসগত কর্ম (Habitual Fact) এবং নিকট ভবিষ্যৎ বুঝাতে Present Indefinite Tense ব্যবহৃত হয়।',
    definitionEn: 'Present Indefinite Tense represents an action that happens regularly, universally, habitually, or is generally true in the present moment.',
    definitionBn: 'যে কাজ বর্তমানে স্বাভাবিকভাবে সংঘটিত হয়, যার দ্বারা চিরন্তন সত্য বা প্রাত্যহিক অভ্যাস বুঝায়, তাকে Present Indefinite Tense বা Simple Present Tense বলে।',
    explanationBn: 'Present Indefinite Tense ইংরেজির সবচেয়ে বহুল ব্যবহৃত Tense। এটি শেখার সময় সবচেয়ে গুরুত্বপূর্ণ বিষয় হলো Subject ৩য় পুরুষ একবচন (Third Person Singular Number) হলে মূল Verb-এর শেষে s বা es যুক্ত হয়। যেমন: He, She, It বা যেকোনো একজন ব্যক্তির নাম হলে Verb-এর শেষে s/es বসে। কিন্তু I, We, You, They হলে মূল Verb-এর বেস ফর্ম (V1) বসে।',
    teacherGoldenTips: 'মো: আলমগীর স্যারের স্পেশাল টেকনিক: বাক্যে always, regularly, daily, everyday, generally, usually, normally, often, sometimes, naturally, seldom থাকলে চোখ বন্ধ করে Present Indefinite Tense (Subject + V1) বসবে!',
    rules: [
      {
        ruleNo: 1,
        nameEn: 'Affirmative Sentence Structure',
        nameBn: 'হ্যাঁ-বোধক বাক্যের গঠন',
        formula: 'Subject + V1 (s/es if 3rd person singular) + Object / Extension',
        timeMarkers: 'always, regularly, daily, everyday, generally, usually, normally, often, sometimes',
        descriptionBn: 'Subject যদি He, She, It বা কোনো একবচন নাম হয়, তবে মূল Verb-এর শেষে s/es বসে।',
        examples: [
          {
            en: 'He reads the holy Quran every morning.',
            bn: 'সে প্রতিদিন সকালে পবিত্র কুরআন পাঠ করে।',
            note: 'Subject "He" ৩য় পুরুষ একবচন হওয়ায় read-এর সাথে "s" যুক্ত হয়েছে।'
          },
          {
            en: 'They play football regularly.',
            bn: 'তারা নিয়মিত ফুটবল খেলে।',
            note: 'Subject "They" বহুবচন হওয়ায় মূল Verb "play" অপরিবর্তিত রয়েছে।'
          }
        ],
        shortcutTrick: 'Subject (He/She/It/Name) -> Verb + s/es'
      },
      {
        ruleNo: 2,
        nameEn: 'Negative & Interrogative Sentence Structure',
        nameBn: 'না-বোধক ও প্রশ্নবোধক বাক্যের গঠন',
        formula: 'Negative: Subject + do not / does not + V1 + Extension | Interrogative: Do / Does + Subject + V1 + Extension?',
        timeMarkers: 'never, seldom, rarely, scarcely',
        descriptionBn: 'Negative বা Interrogative করার সময় auxiliary verb হিসেবে Do বা Does আসে এবং মূল Verb সবসময় Base Form (V1)-এ ফিরে যায়।',
        examples: [
          {
            en: 'He does not tell a lie.',
            bn: 'সে মিথ্যা বলে না।',
            note: 'Does আসার কারণে tell-এর সাথে "s" যুক্ত হয়নি।'
          },
          {
            en: 'Do you study hard for the SSC exam?',
            bn: 'তুমি কি এসএসসি পরীক্ষার জন্য কঠোর পড়াশোনা করো?',
            note: 'You-এর সাথে Do ব্যবহৃত হয়েছে।'
          }
        ],
        shortcutTrick: 'Do/Does বাক্যে আসলে মূল Verb-এর s/es উঠে যায় (Does + V1).'
      },
      {
        ruleNo: 3,
        nameEn: 'Universal Truth & Habitual Fact',
        nameBn: 'চিরন্তন সত্য ও অভ্যাসগত কর্ম',
        formula: 'Universal Subject + V1 (s/es) + Object',
        timeMarkers: 'universal facts, scientific laws, geographic truths',
        descriptionBn: 'যেকোনো চিরন্তন সত্য, বৈজ্ঞানিক সত্য বা ভৌগোলিক সত্য সবসময় Present Indefinite Tense-এ প্রকাশ করতে হয়।',
        examples: [
          {
            en: 'The earth moves around the sun.',
            bn: 'পৃথিবী সূর্যের চারদিকে ঘোরে।',
            note: 'চিরন্তন বৈজ্ঞানিক সত্য।'
          },
          {
            en: 'Water freezes at 0° Celsius.',
            bn: 'পানি ০° সেলসিয়াসে জমে বরফ হয়।',
            note: 'পদার্থবিজ্ঞানের নিয়ম।'
          },
          {
            en: 'Honesty is the best policy.',
            bn: 'সততাই সর্বোৎকৃষ্ট পন্থা।',
            note: 'চিরন্তন প্রবাদ বাক্য।'
          }
        ]
      }
    ],
    exceptions: [
      {
        ruleName: 's বনাম es যুক্ত করার নিয়ম',
        exceptionText: 'Verb-এর শেষে o, s, ss, sh, ch, x, z থাকলে "es" যুক্ত হয় (go -> goes, watch -> watches, fix -> fixes)। Verb-এর শেষে Consonant + y থাকলে y উঠে "ies" হয় (fly -> flies, study -> studies)। কিন্তু Vowel + y থাকলে শুধু "s" বসে (play -> plays, buy -> buys)।',
        exampleEn: 'The baby cries for its mother.',
        exampleBn: 'শিশুটির মা এর জন্য কাঁদে (cry -> cries)।'
      }
    ],
    commonMistakes: [
      {
        mistake: 'He do not know the answer.',
        correct: 'He does not know the answer.',
        reasonBn: 'Subject "He" ৩য় পুরুষ একবচন হওয়ায় "do not" নয়, "does not" বসবে।'
      },
      {
        mistake: 'The sun rose in the east.',
        correct: 'The sun rises in the east.',
        reasonBn: 'সূর্য পূর্বে উদিত হওয়া চিরন্তন সত্য, তাই Past Tense হবে না, Present Indefinite হবে।'
      }
    ],
    writtenPractice: [
      {
        id: 1,
        type: 'FILL_BLANK',
        prompt: 'The teacher _____ (teach) us English everyday.',
        correctAnswer: 'teaches',
        explanationBn: 'everyday থাকায় এবং teacher ৩য় পুরুষ একবচন হওয়ায় teach + es = teaches হবে।'
      },
      {
        id: 2,
        type: 'TRANSFORM_NEGATIVE',
        prompt: 'Transform into negative: "He plays cricket regularly."',
        correctAnswer: 'He does not play cricket regularly.',
        explanationBn: 'Does not বসার পর plays থেকে "s" উঠে গিয়ে মূল Verb "play" হয়েছে।'
      }
    ],
    tags: ['TENSE', 'BASIC', 'SSC', 'HSC', 'PRESENT_INDEFINITE'],
    status: 'PUBLISHED',
    orderIndex: 1,
    viewCount: 250
  },
  {
    id: 801,
    chapterId: 8,
    parentTopicId: null,
    topicNo: '৮.১',
    titleEn: 'Right Form of Verbs: 30 Master Golden Rules',
    titleBn: 'রাইট ফর্ম অব ভার্বস: ৩০টি মাস্টার গোল্ডেন রুলস',
    slug: 'right-form-of-verbs-master',
    difficulty: 'BOARD_STANDARD',
    classLevel: 'Class 8 - 12 (SSC & HSC)',
    summaryBn: 'বোর্ড পরীক্ষা ও সকল প্রতিযোগিতামূলক পরীক্ষার জন্য ভার্বের সঠিক রূপ নির্ণয়ের সর্বাধিক গুরুত্বপূর্ণ গোল্ডেন নিয়মসমূহ।',
    definitionEn: 'Right Form of Verbs refers to using the correct grammatical form of a verb according to the subject, tense, voice, mood, preposition, and contextual connectors.',
    definitionBn: 'বাক্যের সাবজেক্ট, কাল (Tense), বাচ্য (Voice) এবং সন্নিহিত সংযোজক শব্দের নিয়ম অনুযায়ী মূল Verb-এর সঠিক রূপ নির্ধারণ করাকে Right Form of Verbs বলে।',
    explanationBn: 'এসএসসি ও এইচএসসি পরীক্ষায় Right Form of Verbs-এ ফুল মার্কস পাওয়ার চাবিকাঠি হলো ৩টি বিষয় নিখুঁতভাবে লক্ষ্য করা: (১) Preposition-এর পর Verb: To ছাড়া সকল Preposition (in, on, of, for, with, without, by)-এর পর Verb + ing বসে। (২) Lest-এর নিয়ম: বাক্যে Lest থাকলে Subject-এর পর should/might + V1 বসে। (৩) While-এর নিয়ম: While-এর পর সরাসরি Verb আসলে V1+ing হয়; কিন্তু While-এর পর Subject আসলে Past Continuous (was/were + V1+ing) হয়।',
    teacherGoldenTips: 'আলমগীর স্যারের গোল্ডেন শর্টকাট: (১) No sooner had ... than -> ১ম অংশ V3, ২য় অংশ V2। (২) As if / As though -> ১ম অংশ Present হলে ২য় অংশ Past Indefinite (were/V2); ১ম অংশ Past হলে ২য় অংশ Past Perfect (had+V3)।',
    rules: [
      {
        ruleNo: 1,
        nameEn: 'Preposition + V1+ing Rule',
        nameBn: 'প্রিপজিশনের পর ভার্বের সাথে ing',
        formula: 'Preposition (of, for, in, by, without, with, after, before) + V1+ing',
        timeMarkers: 'prepositional clauses',
        descriptionBn: 'To ছাড়া সকল সাধারণ Preposition-এর পর ব্র্যাকেটের Verb-এর সাথে ing যুক্ত হয়।',
        examples: [
          {
            en: 'He succeeded by working hard.',
            bn: 'সে কঠোর পরিশ্রম করার দ্বারা সফল হয়েছিল।',
            note: '"by" Preposition হওয়ায় work -> working হয়েছে।'
          }
        ],
        shortcutTrick: 'Preposition (except to) + [Verb + ing]'
      },
      {
        ruleNo: 2,
        nameEn: 'Special "To" Phrases requiring V1+ing',
        nameBn: 'ব্যতিক্রমী To সম্বলিত ফ্রেজ যাদের পর V1+ing বসে',
        formula: 'With a view to / Look forward to / Get used to / Be used to / Mind / Cannot help + V1+ing',
        timeMarkers: 'special purpose phrases',
        descriptionBn: 'সাধারণত To-এর পর V1 বসলেও with a view to, look forward to, accustomed to ইত্যাদির পর Verb+ing বসে।',
        examples: [
          {
            en: 'I went to the library with a view to reading books.',
            bn: 'আমি বই পড়ার উদ্দেশ্যে লাইব্রেরিতে গিয়েছিলাম।',
            note: 'with a view to থাকায় read -> reading হয়েছে।'
          }
        ],
        shortcutTrick: 'With a view to / Look forward to -> সবসময় Verb + ing'
      },
      {
        ruleNo: 3,
        nameEn: 'Lest Clause Structure',
        nameBn: 'Lest যুক্ত বাক্যের নিয়ম',
        formula: 'Clause 1 + lest + Subject + should / might + V1 + Extension',
        timeMarkers: 'lest warning clauses',
        descriptionBn: 'Lest অর্থ "পাছে ভয় হয় যে" বা "নচেৎ"। Lest যুক্ত অংশে Subject-এর পর বাধ্যতামূলকভাবে should বা might বসে।',
        examples: [
          {
            en: 'Walk fast lest you should miss the train.',
            bn: 'দ্রুত হাঁটো পাছে তুমি ট্রেনটি মিস করে ফেলো।',
            note: 'lest থাকায় you should miss হয়েছে।'
          }
        ],
        shortcutTrick: 'Lest + Subject + should + V1'
      }
    ],
    exceptions: [
      {
        ruleName: 'Had better / Would rather এর পর V1',
        exceptionText: 'Had better, had rather, would better, would rather, let, make, help ইত্যাদি মডেল সদৃশ শব্দের পর মূল Verb-এর Base Form (V1) বসে এবং কোনো "to" বা "ing" বসে না।',
        exampleEn: 'You had better go home now.',
        exampleBn: 'তোমার বরং এখন বাড়ি যাওয়াই ভালো (go, not to go)।'
      }
    ],
    commonMistakes: [
      {
        mistake: 'I went there with a view to meet him.',
        correct: 'I went there with a view to meeting him.',
        reasonBn: 'with a view to-এর পর Verb-এর সাথে "ing" যুক্ত হওয়া বাধ্যতামূলক।'
      }
    ],
    writtenPractice: [
      {
        id: 1,
        type: 'FILL_BLANK',
        prompt: 'I look forward to _____ (hear) from you soon.',
        correctAnswer: 'hearing',
        explanationBn: '"look forward to"-এর পর Verb + ing হয়।'
      }
    ],
    tags: ['VERBS', 'RIGHT_FORM_OF_VERBS', 'SSC', 'HSC', 'BOARD_STANDARD'],
    status: 'PUBLISHED',
    orderIndex: 1,
    viewCount: 310
  }
];

const INITIAL_QUESTIONS = [
  {
    id: 1,
    chapterId: 7,
    topicId: 701,
    questionType: 'MCQ',
    questionEn: 'Which of the following is an example of a Universal Truth?',
    questionBn: 'নিচের কোনটি চিরন্তন সত্যের উদাহরণ?',
    options: [
      'He went to Dhaka yesterday.',
      'The earth moves round the sun.',
      'They are playing in the field.',
      'I have done the homework.'
    ],
    correctOptionIndex: 1,
    correctAnswerText: 'The earth moves round the sun.',
    explanationEn: 'The earth moves round the sun represents an established astronomical truth, which must always be in Present Indefinite Tense.',
    explanationBn: '"The earth moves round the sun" একটি চিরন্তন বৈজ্ঞানিক সত্য, যা সর্বদা Present Indefinite Tense-এ লিখতে হয়।',
    difficulty: 'EASY',
    marks: 1,
    isBoardQuestion: true,
    board: 'ঢাকা বোর্ড',
    year: 2024,
    examType: 'SSC',
    tags: ['TENSE', 'UNIVERSAL_TRUTH', 'SSC'],
    status: 'ACTIVE'
  },
  {
    id: 2,
    chapterId: 7,
    topicId: 701,
    questionType: 'MCQ',
    questionEn: 'Complete the negative sentence: "Sagor _____ tell a lie."',
    questionBn: 'বাক্যটি সম্পন্ন করুন: "Sagor _____ tell a lie."',
    options: [
      'do not',
      'does not',
      'is not',
      'did not'
    ],
    correctOptionIndex: 1,
    correctAnswerText: 'does not',
    explanationEn: 'For third person singular nouns like Sagor, negative in present indefinite takes does not + base verb.',
    explanationBn: 'Sagor একবচন নাম হওয়ায় negative করার জন্য "does not" বসে।',
    difficulty: 'EASY',
    marks: 1,
    isBoardQuestion: false,
    tags: ['TENSE', 'NEGATIVE'],
    status: 'ACTIVE'
  },
  {
    id: 3,
    chapterId: 8,
    topicId: 801,
    questionType: 'MCQ',
    questionEn: 'He came to my house with a view to _____ some money.',
    questionBn: 'শূন্যস্থান পূরণ করুন: "He came to my house with a view to _____ some money."',
    options: ['borrow', 'borrowed', 'borrowing', 'borrows'],
    correctOptionIndex: 2,
    correctAnswerText: 'borrowing',
    explanationEn: 'The phrase "with a view to" is always followed by V1+ing (gerund).',
    explanationBn: '"With a view to" একটি বিশেষ ফ্রেজ যার পর Verb + ing (borrowing) বসে।',
    difficulty: 'MEDIUM',
    marks: 1,
    isBoardQuestion: true,
    board: 'কুমিল্লা বোর্ড',
    year: 2023,
    examType: 'SSC',
    tags: ['RIGHT_FORM_OF_VERBS', 'PREPOSITION'],
    status: 'ACTIVE'
  },
  {
    id: 4,
    chapterId: 8,
    topicId: 801,
    questionType: 'MCQ',
    questionEn: 'Run fast lest you _____ the prize.',
    questionBn: 'সঠিক রূপ চিহ্নিত করুন: "Run fast lest you _____ the prize."',
    options: ['miss', 'will miss', 'should miss', 'missed'],
    correctOptionIndex: 2,
    correctAnswerText: 'should miss',
    explanationEn: 'The connector "lest" takes subject + should/might + base form of verb.',
    explanationBn: 'Lest-এর নিয়ম অনুযায়ী Subject-এর পর "should + V1" (should miss) বসবে।',
    difficulty: 'MEDIUM',
    marks: 1,
    isBoardQuestion: true,
    board: 'রাজশাহী বোর্ড',
    year: 2024,
    examType: 'SSC',
    tags: ['RIGHT_FORM_OF_VERBS', 'LEST'],
    status: 'ACTIVE'
  }
];

const INITIAL_BOARD_QUESTIONS = [
  {
    id: 1,
    chapterId: 7,
    topicId: 701,
    board: 'ঢাকা বোর্ড',
    year: 2024,
    examType: 'SSC',
    classLevel: 'Class 9-10 (SSC)',
    subject: 'English 2nd Paper',
    questionType: 'RIGHT_FORM_OF_VERBS',
    marks: 5,
    questionContext: 'Fill in the blanks with the correct form of verbs: "Truthfulness _____ (be) a noble virtue. A truthful person _____ (respect) by all. Everyone _____ (love) a truthful person."',
    subQuestions: [
      {
        questionText: '(a) Truthfulness _____ (be) a noble virtue.',
        answer: 'is',
        explanationBn: 'চিরন্তন সত্য ও সাধারণ বিবৃতির ক্ষেত্রে Be verb হিসেবে "is" বসে।'
      },
      {
        questionText: '(b) A truthful person _____ (respect) by all.',
        answer: 'is respected',
        explanationBn: 'Passive Voice এবং Present Indefinite Tense হওয়ায় is + V3 (respected) বসেছে।'
      },
      {
        questionText: '(c) Everyone _____ (love) a truthful person.',
        answer: 'loves',
        explanationBn: 'Everyone ৩য় পুরুষ একবচন হিসেবে গণ্য হওয়ায় love-এর সাথে "s" যুক্ত হয়েছে।'
      }
    ],
    fullExplanationBn: 'ঢাকা বোর্ড ২০২৪-এর প্রশ্নটিতে সত্যবাদিতার সার্বজনীন গুণাবলি Present Indefinite Tense-এর মাধ্যমে প্রকাশ করা হয়েছে।',
    difficulty: 'MEDIUM',
    isVerified: true,
    sourceInfo: 'ঢাকা শিক্ষাবোর্ড এসএসসি পরীক্ষা ২০২৪ - ইংরেজি ২য় পত্র',
    status: 'ACTIVE'
  },
  {
    id: 2,
    chapterId: 8,
    topicId: 801,
    board: 'কুমিল্লা বোর্ড',
    year: 2024,
    examType: 'SSC',
    classLevel: 'Class 9-10 (SSC)',
    subject: 'English 2nd Paper',
    questionType: 'RIGHT_FORM_OF_VERBS',
    marks: 5,
    questionContext: 'Right Form of Verbs: "It is high time we _____ (change) our eating habits. Otherwise, we _____ (suffer) in the long run. We should avoid _____ (eat) junk food."',
    subQuestions: [
      {
        questionText: '(a) It is high time we _____ (change) our eating habits.',
        answer: 'changed',
        explanationBn: '"It is high time"-এর পর Subject আসলে Verb-এর Past form (V2 = changed) বসে।'
      },
      {
        questionText: '(b) Otherwise, we _____ (suffer) in the long run.',
        answer: 'will suffer',
        explanationBn: 'ভবিষ্যতের ফলাফল নির্দেশ করায় Future Indefinite (will suffer) হয়েছে।'
      },
      {
        questionText: '(c) We should avoid _____ (eat) junk food.',
        answer: 'eating',
        explanationBn: 'Avoid-এর পর সরাসরি Gerund (V1+ing = eating) বসে।'
      }
    ],
    fullExplanationBn: 'কুমিল্লা বোর্ড ২০২৪-এর প্রশ্নটিতে "It is high time" এবং "avoid + V1+ing"-এর বহুল ব্যবহৃত বোর্ড রুলটি এসেছে।',
    difficulty: 'HARD',
    isVerified: true,
    sourceInfo: 'কুমিল্লা শিক্ষাবোর্ড এসএসসি পরীক্ষা ২০২৪ - ইংরেজি ২য় পত্র',
    status: 'ACTIVE'
  }
];

const INITIAL_MODEL_TESTS = [
  {
    id: 1,
    titleEn: 'SSC Special Grammar Master Model Test 01',
    titleBn: 'এসএসসি স্পেশাল পূর্ণাঙ্গ গ্রামার মডেল টেস্ট ০১',
    descriptionBn: 'এসএসসি ২০২৬ ব্যাচের জন্য টেন্স, রাইট ফর্ম অব ভার্বস ও ভয়েসের সমন্বয়ে প্রণীত ২০ নম্বরের আদর্শ মডেল টেস্ট।',
    durationMinutes: 20,
    totalMarks: 20,
    passingMarks: 12,
    difficulty: 'BOARD_STANDARD',
    chapterId: null, // Full Syllabus Test
    topicId: null,
    questionIds: [1, 2, 3, 4],
    targetClass: 'Class 9 - 10 (SSC Exam 2026)',
    orderIndex: 1,
    status: 'PUBLISHED'
  }
];

async function seedGrammar() {
  try {
    console.log('--- Starting Grammar Database Seeding ---');

    // 1. Chapters
    const chapterCount = await GrammarChapter.count();
    if (chapterCount === 0) {
      console.log('Seeding 23 Grammar Chapters...');
      await GrammarChapter.bulkCreate(INITIAL_CHAPTERS);
      console.log('✓ 23 Chapters seeded successfully.');
    } else {
      console.log(`Grammar Chapters table already has ${chapterCount} records. Skipping.`);
    }

    // Ensure Bangla Grammar 40 chapters are present
    try {
      const { seedBanglaGrammarChapters } = require('./seedBanglaGrammarChapters');
      await seedBanglaGrammarChapters();
    } catch (bgErr) {
      console.warn('Bangla grammar chapter seeder notice:', bgErr.message);
    }


    // 2. Topics
    const topicCount = await GrammarTopic.count();
    if (topicCount === 0) {
      console.log('Seeding Core Grammar Topics...');
      await GrammarTopic.bulkCreate(INITIAL_TOPICS);
      console.log('✓ Grammar Topics seeded successfully.');
    } else {
      console.log(`Grammar Topics table already has ${topicCount} records. Skipping.`);
    }

    // 3. Questions / MCQs
    const questionCount = await GrammarQuestion.count();
    if (questionCount === 0) {
      console.log('Seeding Grammar MCQs / Questions...');
      await GrammarQuestion.bulkCreate(INITIAL_QUESTIONS);
      console.log('✓ Grammar MCQs seeded successfully.');
    } else {
      console.log(`Grammar Questions table already has ${questionCount} records. Skipping.`);
    }

    // 4. Board Questions
    const bqCount = await GrammarBoardQuestion.count();
    if (bqCount === 0) {
      console.log('Seeding Verified Board Questions...');
      await GrammarBoardQuestion.bulkCreate(INITIAL_BOARD_QUESTIONS);
      console.log('✓ Board Questions seeded successfully.');
    } else {
      console.log(`Grammar Board Questions table already has ${bqCount} records. Skipping.`);
    }

    // 5. Model Tests
    const testCount = await GrammarModelTest.count();
    if (testCount === 0) {
      console.log('Seeding Grammar Model Tests...');
      await GrammarModelTest.bulkCreate(INITIAL_MODEL_TESTS);
      console.log('✓ Grammar Model Tests seeded successfully.');
    } else {
      console.log(`Grammar Model Tests table already has ${testCount} records. Skipping.`);
    }

    console.log('--- Grammar Database Seeding Completed Successfully ---');
  } catch (err) {
    console.error('Error during Grammar seeding:', err);
    throw err;
  }
}

module.exports = seedGrammar;

if (require.main === module) {
  seedGrammar().then(() => process.exit(0)).catch(() => process.exit(1));
}
