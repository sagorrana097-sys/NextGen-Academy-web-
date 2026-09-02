/**
 * NextGen Academy - Interactive English Grammar Master Dataset
 * 23 Comprehensive Chapters & Scalable Architecture
 */

export const GRAMMAR_CHAPTERS = [
  {
    id: 1,
    chapterNo: 1,
    titleEn: 'Basic English & Fundamentals',
    titleBn: 'মৌলিক ইংরেজি ও বর্ণমালা',
    slug: 'basic-english',
    icon: 'Sparkles',
    colorGradient: 'from-blue-600 to-indigo-600',
    descriptionBn: 'অ্যালফাবেট, ভাওয়েল-কনসোনেন্ট, সিলেবল, সাউন্ড এবং প্রাথমিক ইংরেজি বাক্য গঠনের ভিত্তি।',
    estimatedTopicsCount: 4,
    orderIndex: 1,
    category: 'FOUNDATION'
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
    estimatedTopicsCount: 5,
    orderIndex: 2,
    category: 'FOUNDATION'
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
    estimatedTopicsCount: 6,
    orderIndex: 3,
    category: 'PARTS_OF_SPEECH'
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
    estimatedTopicsCount: 6,
    orderIndex: 4,
    category: 'PARTS_OF_SPEECH'
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
    estimatedTopicsCount: 5,
    orderIndex: 5,
    category: 'PARTS_OF_SPEECH'
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
    estimatedTopicsCount: 7,
    orderIndex: 6,
    category: 'VERBS'
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
    estimatedTopicsCount: 8,
    orderIndex: 7,
    category: 'VERBS'
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
    estimatedTopicsCount: 8,
    orderIndex: 8,
    category: 'CORE_GRAMMAR'
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
    estimatedTopicsCount: 5,
    orderIndex: 9,
    category: 'CORE_GRAMMAR'
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
    estimatedTopicsCount: 7,
    orderIndex: 10,
    category: 'CORE_GRAMMAR'
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
    estimatedTopicsCount: 5,
    orderIndex: 11,
    category: 'SENTENCE'
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
    estimatedTopicsCount: 8,
    orderIndex: 12,
    category: 'SENTENCE'
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
    estimatedTopicsCount: 6,
    orderIndex: 13,
    category: 'ADVANCED_GRAMMAR'
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
    estimatedTopicsCount: 6,
    orderIndex: 14,
    category: 'ADVANCED_GRAMMAR'
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
    estimatedTopicsCount: 4,
    orderIndex: 15,
    category: 'VERBS'
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
    estimatedTopicsCount: 6,
    orderIndex: 16,
    category: 'CORE_GRAMMAR'
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
    estimatedTopicsCount: 5,
    orderIndex: 17,
    category: 'ADVANCED_GRAMMAR'
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
    estimatedTopicsCount: 5,
    orderIndex: 18,
    category: 'SSC_SPECIAL'
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
    estimatedTopicsCount: 5,
    orderIndex: 19,
    category: 'ADVANCED_GRAMMAR'
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
    estimatedTopicsCount: 5,
    orderIndex: 20,
    category: 'SSC_SPECIAL'
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
    estimatedTopicsCount: 4,
    orderIndex: 21,
    category: 'FOUNDATION'
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
    estimatedTopicsCount: 6,
    orderIndex: 22,
    category: 'VOCABULARY'
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
    estimatedTopicsCount: 8,
    orderIndex: 23,
    category: 'SSC_SPECIAL'
  }
];

export const GRAMMAR_TOPICS_DATABASE = {
  // -------------------------------------------------------------------------
  // CHAPTER 7: TENSE & TIME
  // -------------------------------------------------------------------------
  'present-indefinite-tense': {
    id: 701,
    chapterId: 7,
    chapterSlug: 'tense',
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
      },
      {
        mistake: 'He goes to school yesterday.',
        correct: 'He went to school yesterday.',
        reasonBn: '"Yesterday" অতীতের সময় নির্দেশক, তাই Past Indefinite (went) হবে।'
      }
    ],

    mcqs: [
      {
        id: 70101,
        question: 'Which of the following is an example of a Universal Truth?',
        options: [
          'He went to Dhaka yesterday.',
          'The earth moves round the sun.',
          'They are playing in the field.',
          'I have done the homework.'
        ],
        correctOptionIndex: 1,
        explanation: '"The earth moves round the sun" একটি চিরন্তন বৈজ্ঞানিক সত্য, যা সর্বদা Present Indefinite Tense-এ লিখতে হয়।'
      },
      {
        id: 70102,
        question: 'Identify the correct sentence using the third person singular subject:',
        options: [
          'She study every night.',
          'She studies every night.',
          'She is study every night.',
          'She studying every night.'
        ],
        correctOptionIndex: 1,
        explanation: 'Subject "She" একবচন হওয়ায় Consonant+y যুক্ত Verb "study" পরিবর্তিত হয়ে "studies" হয়েছে।'
      },
      {
        id: 70103,
        question: 'Complete the negative sentence: "Sagor _____ tell a lie."',
        options: [
          'do not',
          'does not',
          'is not',
          'did not'
        ],
        correctOptionIndex: 1,
        explanation: 'Sagor একবচন নাম হওয়ায় negative করার জন্য "does not" বসে।'
      }
    ],

    writtenDrills: [
      {
        id: 70104,
        type: 'FILL_BLANK',
        prompt: 'The teacher _____ (teach) us English everyday.',
        correctAnswer: 'teaches',
        explanationBn: 'everyday থাকায় এবং teacher ৩য় পুরুষ একবচন হওয়ায় teach + es = teaches হবে।'
      },
      {
        id: 70105,
        type: 'TRANSFORM_NEGATIVE',
        prompt: 'Transform into negative: "He plays cricket regularly."',
        correctAnswer: 'He does not play cricket regularly.',
        explanationBn: 'Does not বসার পর plays থেকে "s" উঠে গিয়ে মূল Verb "play" হয়েছে।'
      }
    ],

    boardQuestions: [
      {
        id: 70106,
        board: 'ঢাকা বোর্ড',
        year: 2024,
        examType: 'SSC',
        questionContext: 'Fill in the blanks with the correct form of verbs: "Truthfulness _____ (be) a noble virtue. A truthful person _____ (respect) by all."',
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
          }
        ],
        fullExplanationBn: 'ঢাকা বোর্ড ২০২৪-এর প্রশ্নটিতে সত্যবাদিতার সার্বজনীন গুণাবলি Present Indefinite Tense-এর মাধ্যমে প্রকাশ করা হয়েছে।'
      },
      {
        id: 70107,
        board: 'রাজশাহী বোর্ড',
        year: 2025,
        examType: 'SSC',
        questionContext: 'Right Form of Verbs: "Light _____ (travel) faster than sound."',
        subQuestions: [
          {
            questionText: 'Light _____ (travel) faster than sound.',
            answer: 'travels',
            explanationBn: 'আলো শব্দের চেয়ে দ্রুত চলে এটি একটি বৈজ্ঞানিক সত্য, তাই Light-এর সাথে travels বসবে।'
          }
        ],
        fullExplanationBn: 'বিজ্ঞানের প্রতিষ্ঠিত সূত্রাবলি চিরন্তন সত্য বিধায় Present Indefinite Tense হয়।'
      }
    ]
  },

  // -------------------------------------------------------------------------
  // CHAPTER 8: RIGHT FORM OF VERBS
  // -------------------------------------------------------------------------
  'right-form-of-verbs-master': {
    id: 801,
    chapterId: 8,
    chapterSlug: 'right-form-of-verbs',
    topicNo: '৮.১',
    titleEn: 'Right Form of Verbs: 30 Master Golden Rules',
    titleBn: 'রাইট ফর্ম অব ভার্বস: ৩০টি মাস্টার গোল্ডেন রুলস',
    slug: 'right-form-of-verbs-master',
    difficulty: 'BOARD_STANDARD',
    classLevel: 'Class 8 - 12 (SSC & HSC)',
    summaryBn: 'বোর্ড পরীক্ষা ও সকল প্রতিযোগিতামূলক পরীক্ষার জন্য ভার্বের সঠিক রূপ নির্ণয়ের সর্বাধিক গুরুত্বপূর্ণ গোল্ডেন নিয়মসমূহ।',

    definitionEn: 'Right Form of Verbs refers to using the correct grammatical form of a verb according to the subject, tense, voice, mood, preposition, and contextual connectors.',
    definitionBn: 'বাক্যের সাবজেক্ট, কাল (Tense), বাচ্য (Voice) এবং সন্নিহিত সংযোজক শব্দের নিয়ম অনুযায়ী মূল Verb-এর সঠিক রূপ নির্ধারণ করাকে Right Form of Verbs বলে।',

    explanationBn: 'এসএসসি ও এইচএসসি পরীক্ষায় Right Form of Verbs-এ ফুল মার্কস পাওয়ার চাবিকাঠি হলো ৩টি বিষয় নিখুঁতভাবে লক্ষ্য করা: (১) Preposition-এর পর Verb: To ছাড়া সকল Preposition (in, on, of, for, with, without, by)-এর পর Verb + ing বসে। কিন্তু To-এর পর সাধারণত V1 বসে। (২) Lest-এর নিয়ম: বাক্যে Lest থাকলে Subject-এর পর should/might + V1 বসে। (৩) While-এর নিয়ম: While-এর পর সরাসরি Verb আসলে V1+ing হয়; কিন্তু While-এর পর Subject আসলে Past Continuous (was/were + V1+ing) হয়।',

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
          },
          {
            en: 'She is fond of reading novels.',
            bn: 'সে উপন্যাস পড়তে ভালোবাসে।',
            note: '"of" Preposition হওয়ায় read -> reading হয়েছে।'
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
          },
          {
            en: 'I am looking forward to meeting you.',
            bn: 'আমি আপনার সাথে সাক্ষাতের জন্য অধীর আগ্রহে অপেক্ষা করছি।',
            note: 'look forward to থাকায় meet -> meeting হয়েছে।'
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
          },
          {
            en: 'Read attentively lest you should fail in the exam.',
            bn: 'মনোযোগ দিয়ে পড়ো পাছে তুমি পরীক্ষায় ফেল করো।'
          }
        ],
        shortcutTrick: 'Lest + Subject + should + V1'
      },
      {
        ruleNo: 4,
        nameEn: 'As if / As though Structure',
        nameBn: 'As if / As though (যেন) এর নিয়ম',
        formula: 'Present Tense + as if / as though + Past Indefinite (were / V2) | Past Tense + as if / as though + Past Perfect (had + V3)',
        timeMarkers: 'as if, as though hypothetical clauses',
        descriptionBn: 'বাস্তবে সত্য নয় এমন আচরণ বুঝাতে Be verb হিসেবে সর্বদা "were" বসে।',
        examples: [
          {
            en: 'He speaks as if he knew everything.',
            bn: 'সে এমনভাবে কথা বলে যেন সে সবকিছু জানে।',
            note: '১ম অংশ speaks (Present) হওয়ায় ২য় অংশ knew (Past) হয়েছে।'
          },
          {
            en: 'He behaves as if he were mad.',
            bn: 'সে এমন আচরণ করে যেন সে পাগল ছিল।',
            note: 'অবাস্তব কল্পনা বুঝাতে he-এর সাথে were বসেছে।'
          }
        ]
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
      },
      {
        mistake: 'Walk carefully lest you will fall down.',
        correct: 'Walk carefully lest you should fall down.',
        reasonBn: 'Lest যুক্ত ক্লজে will/can বসে না, should বা might বসে।'
      }
    ],

    mcqs: [
      {
        id: 80101,
        question: 'He came to my house with a view to _____ some money.',
        options: ['borrow', 'borrowed', 'borrowing', 'borrows'],
        correctOptionIndex: 2,
        explanation: '"With a view to" একটি বিশেষ ফ্রেজ যার পর Verb + ing (borrowing) বসে।'
      },
      {
        id: 80102,
        question: 'Run fast lest you _____ the prize.',
        options: ['miss', 'will miss', 'should miss', 'missed'],
        correctOptionIndex: 2,
        explanation: 'Lest-এর নিয়ম অনুযায়ী Subject-এর পর "should + V1" (should miss) বসবে।'
      },
      {
        id: 80103,
        question: 'The boy talks as if he _____ the leader.',
        options: ['is', 'was', 'were', 'had been'],
        correctOptionIndex: 2,
        explanation: 'As if-এর প্রথম অংশ Present Indefinite (talks) হলে দ্বিতীয় অংশে অবাস্তব কল্পনা প্রকাশে "were" বসে।'
      }
    ],

    writtenDrills: [
      {
        id: 80104,
        type: 'FILL_BLANK',
        prompt: 'I look forward to _____ (hear) from you soon.',
        correctAnswer: 'hearing',
        explanationBn: '"look forward to"-এর পর Verb + ing হয়।'
      },
      {
        id: 80105,
        type: 'CORRECT_SENTENCE',
        prompt: 'Correct the error: "You had better to leave the place."',
        correctAnswer: 'You had better leave the place.',
        explanationBn: 'Had better-এর পর Bare Infinitive (to ছাড়া V1) বসে।'
      }
    ],

    boardQuestions: [
      {
        id: 80106,
        board: 'কুমিল্লা বোর্ড',
        year: 2024,
        examType: 'SSC',
        questionContext: 'Right Form of Verbs: "It is high time we _____ (change) our eating habits. Otherwise, we _____ (suffer) in the long run."',
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
          }
        ],
        fullExplanationBn: 'কুমিল্লা বোর্ড ২০২৪-এর প্রশ্নটিতে "It is high time"-এর বহুল ব্যবহৃত বোর্ড রুলটি এসেছে।'
      }
    ]
  },

  // -------------------------------------------------------------------------
  // CHAPTER 13: VOICE TRANSFORMATION
  // -------------------------------------------------------------------------
  'voice-change-master': {
    id: 1301,
    chapterId: 13,
    chapterSlug: 'voice',
    topicNo: '১৩.১',
    titleEn: 'Voice Change: Active to Passive Transformation',
    titleBn: 'বাচ্য পরিবর্তন: অ্যাক্টিভ থেকে প্যাসিভ করার ৫টি সর্বজনীন ধাপ',
    slug: 'voice-change-master',
    difficulty: 'BOARD_STANDARD',
    classLevel: 'Class 8 - 12 (SSC & HSC)',
    summaryBn: 'Active থেকে Passive করার ৫টি জাদুকরী ধাপ, সকল Tense-এর বি-ভার্ব রূপান্তর, Interrogative ও Imperative বাক্যের নিখুঁত সমাধান।',

    definitionEn: 'Voice is the form of the verb which indicates whether the subject does the action (Active Voice) or receives the action (Passive Voice).',
    definitionBn: 'Voice হলো Verb-এর সেই রূপ যার দ্বারা বুঝা যায় Subject নিজে কাজটি সম্পন্ন করছে (Active) নাকি কাজটি Subject-এর উপর বর্তাচ্ছে (Passive)।',

    explanationBn: 'Active থেকে Passive করার ৫টি সর্বজনীন ধাপ: (১) Active বাক্যের Object-টি Passive বাক্যের Subject হবে। (২) Tense ও নতুন Subject অনুযায়ী Auxiliary / Be Verb বসবে। (৩) মূল Verb-এর সর্বদা Past Participle (V3) রূপ বসবে। (৪) সাধারণত By (বা ক্ষেত্রবিশেষে with, at, to, in) বসবে। (৫) Active বাক্যের Subject-টি Passive বাক্যের Object হয়ে বসবে।',

    teacherGoldenTips: 'মো: আলমগীর স্যারের ভয়েস চার্ট: (১) Continuous Tense থাকলে সবসময় Being বসবে। (২) Perfect Tense থাকলে সবসময় Been বসবে। (৩) Modal Auxiliary (can, may, must) থাকলে Be + V3 বসবে। (৪) Imperative Sentence হলে Let + Object + be + V3 বসবে।',

    rules: [
      {
        ruleNo: 1,
        nameEn: 'Tense-wise Be Verb Chart',
        nameBn: 'Tense অনুযায়ী বি-ভার্বের রূপান্তর তালিকা',
        formula: 'Active Tense -> Passive Be-Verb + V3',
        timeMarkers: 'universal voice transformation',
        descriptionBn: 'Present Indefinite হলে am/is/are; Past Indefinite হলে was/were; Continuous হলে being; Perfect হলে been বসে।',
        examples: [
          {
            en: 'Active: He writes a letter. -> Passive: A letter is written by him.',
            bn: 'সে একটি চিঠি লেখে। -> তার দ্বারা একটি চিঠি লেখা হয়।',
            note: 'Present Indefinite হওয়ায় "is written" হয়েছে।'
          },
          {
            en: 'Active: They were playing cricket. -> Passive: Cricket was being played by them.',
            bn: 'তারা ক্রিকেট খেলছিল। -> তাদের দ্বারা ক্রিকেট খেলা হচ্ছিল।',
            note: 'Past Continuous হওয়ায় "was being played" হয়েছে।'
          }
        ],
        shortcutTrick: 'Continuous = being | Perfect = been | Modal = be'
      },
      {
        ruleNo: 2,
        nameEn: 'Imperative Sentence Voice Change',
        nameBn: 'আদেশ/অনুরোধমূলক (Imperative) বাক্যের প্যাসিভ',
        formula: 'Let + Object + be + V3 (Do not থাকলে: Let not + Object + be + V3)',
        timeMarkers: 'imperative commands',
        descriptionBn: 'Verb দিয়ে বাক্য শুরু হলে শুরুতে Let এনে Object-এর পর be + V3 বসাতে হয়।',
        examples: [
          {
            en: 'Active: Do the work. -> Passive: Let the work be done.',
            bn: 'কাজটি করো। -> কাজটি করা হোক।',
            note: 'Let + the work + be + done.'
          },
          {
            en: 'Active: Do not tell a lie. -> Passive: Let not a lie be told.',
            bn: 'মিথ্যা বোলো না। -> মিথ্যা বলা না হোক।'
          }
        ],
        shortcutTrick: 'Imperative: Let + Object + be + V3'
      },
      {
        ruleNo: 3,
        nameEn: 'Verbs with Prepositions other than "By"',
        nameBn: 'By ছাড়া অন্যান্য প্রিপজিশন গ্রহণকারী বিশেষ ভার্ব',
        formula: 'Know -> Known to | Surprise -> Surprised at | Please -> Pleased with | Annoy -> Annoyed with/at | Fill -> Filled with | Contain -> Contained in',
        timeMarkers: 'fixed prepositional passive',
        descriptionBn: 'কিছু কিছু Verb-এর পর By না বসে নির্দিষ্ট Preposition বসে যা বোর্ড পরীক্ষার শীর্ষ প্রশ্ন।',
        examples: [
          {
            en: 'Active: I know him. -> Passive: He is known to me (not by me).',
            bn: 'আমি তাকে চিনি। -> সে আমার কাছে পরিচিত।',
            note: 'Known-এর পর সর্বদা "to" বসে।'
          },
          {
            en: 'Active: His conduct surprised me. -> Passive: I was surprised at his conduct.',
            bn: 'তার আচরণ আমাকে বিস্মিত করেছিল।',
            note: 'Surprised-এর পর আচরণ বুঝাতে "at" বসে।'
          },
          {
            en: 'Active: This jar contains honey. -> Passive: Honey is contained in this jar.',
            bn: 'এই বয়ামটিতে মধু রয়েছে।'
          }
        ]
      }
    ],

    exceptions: [
      {
        ruleName: 'Quasi-Passive Voice (অর্ধ-কর্মবাচ্য)',
        exceptionText: 'যেসব বাক্য দেখতে Active কিন্তু অর্থ Passive প্রকাশ করে (যেমন: Honey tastes sweet, Rice sells cheap), তাদের প্যাসিভ করার নিয়ম: Subject + Be verb + Adjective + when it is + V3।',
        exampleEn: 'Active: Honey tastes sweet. -> Passive: Honey is sweet when it is tasted.',
        exampleBn: 'মধু মিষ্টি লাগে যখন এর স্বাদ গ্রহণ করা হয়।'
      }
    ],

    commonMistakes: [
      {
        mistake: 'He is known by me.',
        correct: 'He is known to me.',
        reasonBn: 'Known-এর পর "by" বসে না, "to" বসে।'
      },
      {
        mistake: 'Let the work done.',
        correct: 'Let the work be done.',
        reasonBn: 'Let-এর পর "be" ছাড়া সরাসরি V3 বসানো যায় না।'
      }
    ],

    mcqs: [
      {
        id: 130101,
        question: 'Transform into passive: "I know the secret."',
        options: [
          'The secret is known by me.',
          'The secret is known to me.',
          'The secret was known to me.',
          'The secret has been known by me.'
        ],
        correctOptionIndex: 1,
        explanation: 'Known-এর পর "to" প্রিপজিশন বসে এবং বাক্যটি Present Indefinite হওয়ায় "is known to me" সঠিক।'
      },
      {
        id: 130102,
        question: 'Passive form of "Shut the door":',
        options: [
          'The door should be shut.',
          'Let the door be shut.',
          'Let the door be shutted.',
          'You are told to shut the door.'
        ],
        correctOptionIndex: 1,
        explanation: 'Imperative sentence-এর সূত্র Let + Object + be + V3 (Shut-এর V3 হলো shut)।'
      }
    ],

    writtenDrills: [
      {
        id: 130103,
        type: 'VOICE_CHANGE',
        prompt: 'Change the voice: "The boy broke the glass."',
        correctAnswer: 'The glass was broken by the boy.',
        explanationBn: 'Past Indefinite Tense হওয়ায় was + broken বসেছে।'
      }
    ],

    boardQuestions: [
      {
        id: 130104,
        board: 'দিনাজপুর বোর্ড',
        year: 2024,
        examType: 'SSC',
        questionContext: 'Voice Transformation: "We should respect our parents."',
        subQuestions: [
          {
            questionText: 'Change into passive: "We should respect our parents."',
            answer: 'Our parents should be respected by us.',
            explanationBn: 'Modal auxiliary (should) থাকলে passive-এ "should be + V3" (should be respected) বসে।'
          }
        ],
        fullExplanationBn: 'দিনাজপুর বোর্ড ২০২৪-এর এই প্রশ্নে মোডাল অক্সিলিয়ারির প্যাসিভ রুল যাচাই করা হয়েছে।'
      }
    ]
  }
};
