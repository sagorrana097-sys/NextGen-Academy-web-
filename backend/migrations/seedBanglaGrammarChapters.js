/**
 * Seed Migration: Bangla Grammar 40 Chapters
 * Non-destructive: Preserves all existing English Grammar records and assigns subject: 'BANGLA'
 */

const fs = require('fs');
const path = require('path');

const BANGLA_CHAPTERS = [
  {
    id: 101,
    chapterNo: 1,
    subject: 'BANGLA',
    titleBn: 'ভাষা ও বাংলা ভাষা',
    titleEn: 'Language & Bengali Language',
    slug: 'b01-bhasha-o-bangla-bhasha',
    icon: 'Globe',
    colorGradient: 'from-emerald-600 to-teal-700',
    descriptionBn: 'ভাষার সংজ্ঞা, বৈশিষ্ট্য, বাংলা ভাষার উৎপত্তি, ক্রমবিকাশ এবং সাধু ও চলিত রীতির পার্থক্য।',
    category: 'FOUNDATION',
    orderIndex: 1,
    status: 'PUBLISHED'
  },
  {
    id: 102,
    chapterNo: 2,
    subject: 'BANGLA',
    titleBn: 'ধ্বনি ও বর্ণ',
    titleEn: 'Phonetics & Bengali Alphabet',
    slug: 'b02-dhwani-o-borno',
    icon: 'Volume2',
    colorGradient: 'from-blue-600 to-cyan-700',
    descriptionBn: 'স্বরধ্বনি, ব্যঞ্জনধ্বনি, বর্ণের উচ্চারণ স্থান, স্পর্শ বর্ণ, নাসিক্য বর্ণ ও অন্তঃস্থ বর্ণ।',
    category: 'PHONETICS',
    orderIndex: 2,
    status: 'PUBLISHED'
  },
  {
    id: 103,
    chapterNo: 3,
    subject: 'BANGLA',
    titleBn: 'শব্দ ও শব্দের শ্রেণিবিভাগ',
    titleEn: 'Words & Classification of Words',
    slug: 'b03-shobdo-o-shrenibibhag',
    icon: 'Layers',
    colorGradient: 'from-indigo-600 to-purple-700',
    descriptionBn: 'উৎস অনুসারে (তৎসম, তদ্ভব, দেশি, বিদেশি), গঠন ও অর্থ অনুসারে বাংলা শব্দের বৈচিত্র্যময় শ্রেণিবিভাগ।',
    category: 'WORD_FORMATION',
    orderIndex: 3,
    status: 'PUBLISHED'
  },
  {
    id: 104,
    chapterNo: 4,
    subject: 'BANGLA',
    titleBn: 'পদ ও পদ প্রকরণ',
    titleEn: 'Parts of Speech (Pod Prokoron)',
    slug: 'b04-pod-o-pod-prokoron',
    icon: 'FileText',
    colorGradient: 'from-amber-600 to-orange-700',
    descriptionBn: 'শব্দ ও পদের পার্থক্য, বাক্যে পদের প্রয়োজনীয়তা এবং পদের সাধারণ শ্রেণিবিভাগ।',
    category: 'PARTS_OF_SPEECH',
    orderIndex: 4,
    status: 'PUBLISHED'
  },
  {
    id: 105,
    chapterNo: 5,
    subject: 'BANGLA',
    titleBn: 'বিশেষ্য পদ',
    titleEn: 'Noun (Bisheshya)',
    slug: 'b05-bisheshya-pod',
    icon: 'BookOpen',
    colorGradient: 'from-rose-600 to-red-700',
    descriptionBn: 'নামবাচক, জাতিবাচক, বস্তুবাচক, সমষ্টিবাচক, ভাববাচক ও গুণবাচক বিশেষ্যের বিশদ নিয়ম।',
    category: 'PARTS_OF_SPEECH',
    orderIndex: 5,
    status: 'PUBLISHED'
  },
  {
    id: 106,
    chapterNo: 6,
    subject: 'BANGLA',
    titleBn: 'সর্বনাম পদ',
    titleEn: 'Pronoun (Shorbonam)',
    slug: 'b06-shorbonam-pod',
    icon: 'Users',
    colorGradient: 'from-teal-600 to-emerald-700',
    descriptionBn: 'ব্যক্তিবাচক, আত্মবাচক, সামীপ্যবাচক, দূরত্ববাচক, সাকুল্যবাচক ও অনির্দিষ্ট সর্বনাম।',
    category: 'PARTS_OF_SPEECH',
    orderIndex: 6,
    status: 'PUBLISHED'
  },
  {
    id: 107,
    chapterNo: 7,
    subject: 'BANGLA',
    titleBn: 'বিশেষণ পদ',
    titleEn: 'Adjective (Bisheshon)',
    slug: 'b07-bisheshon-pod',
    icon: 'Sparkles',
    colorGradient: 'from-violet-600 to-purple-700',
    descriptionBn: 'নাম বিশেষণ, ভাব বিশেষণ, বিশেষণের বিশেষণ এবং বিশেষণের অতিশায়ন (Degree)।',
    category: 'PARTS_OF_SPEECH',
    orderIndex: 7,
    status: 'PUBLISHED'
  },
  {
    id: 108,
    chapterNo: 8,
    subject: 'BANGLA',
    titleBn: 'ক্রিয়া পদ',
    titleEn: 'Verb (Kriya)',
    slug: 'b08-kriya-pod',
    icon: 'Activity',
    colorGradient: 'from-green-600 to-teal-700',
    descriptionBn: 'সমাপিকা, অসমাপিকা, সকর্মক, অকর্মক, দ্বিকর্মক, প্রযোজক এবং যৌগিক ও মিশ্র ক্রিয়া।',
    category: 'PARTS_OF_SPEECH',
    orderIndex: 8,
    status: 'PUBLISHED'
  },
  {
    id: 109,
    chapterNo: 9,
    subject: 'BANGLA',
    titleBn: 'ক্রিয়াবিশেষণ',
    titleEn: 'Adverb (Kriyabisheshon)',
    slug: 'b09-kriyabisheshon',
    icon: 'FastForward',
    colorGradient: 'from-cyan-600 to-blue-700',
    descriptionBn: 'ক্রিয়ার স্থান, কাল, রূপ ও ভাব নির্দেশক ক্রিয়াবিশেষণের বিশদ আলোচনা ও প্রয়োগ।',
    category: 'PARTS_OF_SPEECH',
    orderIndex: 9,
    status: 'PUBLISHED'
  },
  {
    id: 110,
    chapterNo: 10,
    subject: 'BANGLA',
    titleBn: 'অনুসর্গ (কর্মপ্রবচনীয়)',
    titleEn: 'Postposition (Onushurgo)',
    slug: 'b10-onushurgo',
    icon: 'Anchor',
    colorGradient: 'from-fuchsia-600 to-pink-700',
    descriptionBn: 'বাংলা অনুসর্গের পরিচয়, বিভিন্ন বিভক্তি সহযোগে অনুসর্গের ব্যবহার ও পরীক্ষাভিত্তিক প্রয়োগ।',
    category: 'PARTS_OF_SPEECH',
    orderIndex: 10,
    status: 'PUBLISHED'
  },
  {
    id: 111,
    chapterNo: 11,
    subject: 'BANGLA',
    titleBn: 'যোজক',
    titleEn: 'Conjunction (Jojok)',
    slug: 'b11-jojok',
    icon: 'GitCommit',
    colorGradient: 'from-sky-600 to-indigo-700',
    descriptionBn: 'সংযোজক, বিয়োজক, বিরোধমূলক, কারণবাচক ও সাপেক্ষ যোজকের গঠন ও বাক্যে ব্যবহার।',
    category: 'PARTS_OF_SPEECH',
    orderIndex: 11,
    status: 'PUBLISHED'
  },
  {
    id: 112,
    chapterNo: 12,
    subject: 'BANGLA',
    titleBn: 'আবেগ ও অনুজ্ঞাসূচক পদ',
    titleEn: 'Interjection & Imperative (Abeg o Onugya)',
    slug: 'b12-abeg-o-onugya',
    icon: 'Heart',
    colorGradient: 'from-rose-500 to-red-600',
    descriptionBn: 'বিস্ময়, প্রশংসা, বিরক্তি, ভয়, শোক ও আদেশ-অনুরোধ-উপদেশজ্ঞাপক অনুজ্ঞা পদ।',
    category: 'PARTS_OF_SPEECH',
    orderIndex: 12,
    status: 'PUBLISHED'
  },
  {
    id: 113,
    chapterNo: 13,
    subject: 'BANGLA',
    titleBn: 'কারক',
    titleEn: 'Case (Karok)',
    slug: 'b13-karok',
    icon: 'Target',
    colorGradient: 'from-blue-600 to-indigo-800',
    descriptionBn: 'কর্তৃকারক, কর্মকারক, করণকারক, সম্প্রদানকারক, অপাদানকারক ও অধিকরণকারকের নিখুঁত নির্ণয় সূত্র।',
    category: 'INFLECTION_AND_CASE',
    orderIndex: 13,
    status: 'PUBLISHED'
  },
  {
    id: 114,
    chapterNo: 14,
    subject: 'BANGLA',
    titleBn: 'বিভক্তি',
    titleEn: 'Case-Endings / Inflections (Bibhokti)',
    slug: 'b14-bibhokti',
    icon: 'Divide',
    colorGradient: 'from-emerald-600 to-teal-800',
    descriptionBn: 'শব্দবিভক্তি (প্রথমা থেকে সপ্তমী), শূন্য বিভক্তি এবং ক্রিয়াবিভক্তির প্রয়োগবিধি।',
    category: 'INFLECTION_AND_CASE',
    orderIndex: 14,
    status: 'PUBLISHED'
  },
  {
    id: 115,
    chapterNo: 15,
    subject: 'BANGLA',
    titleBn: 'বচন',
    titleEn: 'Number (Bochon)',
    slug: 'b15-bochon',
    icon: 'Hash',
    colorGradient: 'from-amber-600 to-yellow-700',
    descriptionBn: 'একবচন ও বহুবচন, বহুবচনের প্রত্যয় ও বিভক্তি (রা, এরা, গণ, বৃন্দ, মণ্ডলী) এবং প্রয়োগরীতি।',
    category: 'GRAMMAR_RULES',
    orderIndex: 15,
    status: 'PUBLISHED'
  },
  {
    id: 116,
    chapterNo: 16,
    subject: 'BANGLA',
    titleBn: 'লিঙ্গ ও লিঙ্গান্তর',
    titleEn: 'Gender (Lingo)',
    slug: 'b16-lingo',
    icon: 'Compass',
    colorGradient: 'from-pink-600 to-rose-700',
    descriptionBn: 'পুংলিঙ্গ, স্ত্রীলিঙ্গ, উভয়লিঙ্গ, ক্লীবলিঙ্গ ও নিত্য স্ত্রীলিঙ্গ/পুংলিঙ্গ শব্দের তালিকা ও নিয়ম।',
    category: 'GRAMMAR_RULES',
    orderIndex: 16,
    status: 'PUBLISHED'
  },
  {
    id: 117,
    chapterNo: 17,
    subject: 'BANGLA',
    titleBn: 'পুরুষ',
    titleEn: 'Person (Purush)',
    slug: 'b17-purush',
    icon: 'UserCheck',
    colorGradient: 'from-purple-600 to-violet-800',
    descriptionBn: 'উত্তম পুরুষ, মধ্যম পুরুষ ও নাম পুরুষ এবং সম্মানসূচক ও সাধারণ সর্বনামের রূপ।',
    category: 'GRAMMAR_RULES',
    orderIndex: 17,
    status: 'PUBLISHED'
  },
  {
    id: 118,
    chapterNo: 18,
    subject: 'BANGLA',
    titleBn: 'কাল (Tense in Bangla)',
    titleEn: 'Tense (Kaal)',
    slug: 'b18-kaal',
    icon: 'Clock',
    colorGradient: 'from-blue-600 to-sky-700',
    descriptionBn: 'বর্তমান কাল, অতীত কাল, ভবিষ্যৎ কাল ও এদের উপবিভাগ (সাধারণ, ঘটমান, পুরাঘটিত, নিত্যবৃত্ত)।',
    category: 'GRAMMAR_RULES',
    orderIndex: 18,
    status: 'PUBLISHED'
  },
  {
    id: 119,
    chapterNo: 19,
    subject: 'BANGLA',
    titleBn: 'বর্ণের উচ্চারণ ও ধ্বনি পরিবর্তন',
    titleEn: 'Pronunciation & Sound Changes',
    slug: 'b19-borner-uccharon-dhwani-poriborton',
    icon: 'Mic',
    colorGradient: 'from-orange-600 to-red-700',
    descriptionBn: 'স্বরাগম, স্বরলোপ, অপিনিহিতি, অসমীকরণ, স্বরসঙ্গতি, সমীভবন ও বিষমীভবনের নিয়ম।',
    category: 'ORTHOGRAPHY',
    orderIndex: 19,
    status: 'PUBLISHED'
  },
  {
    id: 120,
    chapterNo: 20,
    subject: 'BANGLA',
    titleBn: 'শুদ্ধ বানান, ণ-ত্ব ও ষ-ত্ব বিধান',
    titleEn: 'Spelling Rules, Notto & Shotto Bidhan',
    slug: 'b20-shuddho-banan-notto-shotto',
    icon: 'CheckSquare',
    colorGradient: 'from-green-600 to-emerald-800',
    descriptionBn: 'বাংলা একাডেমি প্রমিত বাংলা বানানের নিয়ম, ণ-ত্ব বিধান ও ষ-ত্ব বিধানের স্বতঃসিদ্ধ সূত্র ও ব্যতিক্রম।',
    category: 'ORTHOGRAPHY',
    orderIndex: 20,
    status: 'PUBLISHED'
  },
  {
    id: 121,
    chapterNo: 21,
    subject: 'BANGLA',
    titleBn: 'সন্ধি',
    titleEn: 'Euphoric Combination (Shondhi)',
    slug: 'b21-shondhi',
    icon: 'Maximize2',
    colorGradient: 'from-cyan-600 to-teal-800',
    descriptionBn: 'স্বরসন্ধি, ব্যঞ্জনসন্ধি, বিসর্গসন্ধি ও নিপাতনে সিদ্ধ সন্ধির স্বয়ংসম্পূর্ণ সূত্র ও উদাহরণ।',
    category: 'MORPHOLOGY',
    orderIndex: 21,
    status: 'PUBLISHED'
  },
  {
    id: 122,
    chapterNo: 22,
    subject: 'BANGLA',
    titleBn: 'সমাস',
    titleEn: 'Compound Words (Shomash)',
    slug: 'b22-shomash',
    icon: 'Minimize2',
    colorGradient: 'from-indigo-600 to-blue-800',
    descriptionBn: 'দ্বন্দ্ব, কর্মধারয়, তৎপুরুষ, বহুব্রীহি, দ্বিগু ও অব্যয়ীভাব সমাস নির্ণয়ের অব্যর্থ কৌশল।',
    category: 'MORPHOLOGY',
    orderIndex: 22,
    status: 'PUBLISHED'
  },
  {
    id: 123,
    chapterNo: 23,
    subject: 'BANGLA',
    titleBn: 'উপসর্গ',
    titleEn: 'Prefix (Uposhurgo)',
    slug: 'b23-uposhurgo',
    icon: 'ArrowRightCircle',
    colorGradient: 'from-purple-600 to-pink-700',
    descriptionBn: 'খাঁটি বাংলা উপসর্গ (২১টি), তৎসম উপসর্গ (২০টি) ও বিদেশি উপসর্গের অর্থদ্যোতকতা ও প্রয়োগ।',
    category: 'MORPHOLOGY',
    orderIndex: 23,
    status: 'PUBLISHED'
  },
  {
    id: 124,
    chapterNo: 24,
    subject: 'BANGLA',
    titleBn: 'প্রত্যয়',
    titleEn: 'Suffix (Prottoy)',
    slug: 'b24-prottoy',
    icon: 'PlusCircle',
    colorGradient: 'from-amber-600 to-orange-700',
    descriptionBn: 'প্রত্যয়ের প্রাথমিক ধারণা, কৃৎ প্রত্যয় ও তদ্ধিত প্রত্যয়ের রূপ এবং শব্দ গঠনের ভূমিকা।',
    category: 'MORPHOLOGY',
    orderIndex: 24,
    status: 'PUBLISHED'
  },
  {
    id: 125,
    chapterNo: 25,
    subject: 'BANGLA',
    titleBn: 'শব্দগঠন পদ্ধতি',
    titleEn: 'Word Formation Techniques',
    slug: 'b25-shobdogothon',
    icon: 'Tool',
    colorGradient: 'from-teal-600 to-cyan-700',
    descriptionBn: 'উপসর্গ, প্রত্যয়, সমাস, সন্ধি, পদ পরিবর্তন ও দ্বিরুক্ত শব্দের মাধ্যমে বাংলা শব্দগঠন রীতি।',
    category: 'MORPHOLOGY',
    orderIndex: 25,
    status: 'PUBLISHED'
  },
  {
    id: 126,
    chapterNo: 26,
    subject: 'BANGLA',
    titleBn: 'প্রকৃতি ও প্রত্যয় বিশদ',
    titleEn: 'Root & Suffix Analysis',
    slug: 'b26-prokriti-o-prottoy',
    icon: 'Share2',
    colorGradient: 'from-rose-600 to-pink-700',
    descriptionBn: 'ক্রিয়া প্রকৃতি (ধাতু) ও নাম প্রকৃতির সাথে কৃৎ ও তদ্ধিত প্রত্যয় যুক্ত হয়ে নতুন শব্দ গঠনের পুঙ্খানুপুঙ্খ সূত্র।',
    category: 'MORPHOLOGY',
    orderIndex: 26,
    status: 'PUBLISHED'
  },
  {
    id: 127,
    chapterNo: 27,
    subject: 'BANGLA',
    titleBn: 'ধাতু ও ধাতুর প্রকারভেদ',
    titleEn: 'Verbal Roots (Dhatu)',
    slug: 'b27-dhatu',
    icon: 'Zap',
    colorGradient: 'from-yellow-600 to-amber-700',
    descriptionBn: 'মৌলিক ধাতু, সাধিত ধাতু (প্রযোজক, নামধাতু, কর্মবাচ্যের ধাতু) এবং যৌগিক বা সংযোগমূলক ধাতু।',
    category: 'MORPHOLOGY',
    orderIndex: 27,
    status: 'PUBLISHED'
  },
  {
    id: 128,
    chapterNo: 28,
    subject: 'BANGLA',
    titleBn: 'বাক্য ও সার্থক বাক্যের গুণাবলী',
    titleEn: 'Sentence & Qualities of Good Sentence',
    slug: 'b28-bakyo-gunaboli',
    icon: 'FileCheck',
    colorGradient: 'from-emerald-600 to-green-700',
    descriptionBn: 'উদ্দেশ্য ও বিধেয় এবং সার্থক বাক্যের তিনটি অপরিহার্য গুণ—আকাঙ্ক্ষা, আসত্তি ও যোগ্যতা।',
    category: 'SYNTAX',
    orderIndex: 28,
    status: 'PUBLISHED'
  },
  {
    id: 129,
    chapterNo: 29,
    subject: 'BANGLA',
    titleBn: 'বাক্যের গঠন ও শ্রেণিবিভাগ',
    titleEn: 'Sentence Structure & Transformation',
    slug: 'b29-bakyer-gothon-o-rupantor',
    icon: 'GitBranch',
    colorGradient: 'from-blue-600 to-indigo-700',
    descriptionBn: 'গঠনগত দিক থেকে সরল, জটিল ও যৌগিক বাক্য এবং অর্থগত দিক থেকে বাক্যের শ্রেণিবিভাগ ও রূপান্তর।',
    category: 'SYNTAX',
    orderIndex: 29,
    status: 'PUBLISHED'
  },
  {
    id: 130,
    chapterNo: 30,
    subject: 'BANGLA',
    titleBn: 'বাচ্য ও বাচ্য পরিবর্তন',
    titleEn: 'Voice (Bachyo)',
    slug: 'b30-bachyo',
    icon: 'Repeat',
    colorGradient: 'from-violet-600 to-purple-800',
    descriptionBn: 'কর্তৃবাচ্য, কর্মবাচ্য, ভাববাচ্য ও কর্মকর্তৃবাচ্যের বৈশিষ্ট্য ও এক বাচ্য থেকে অন্য বাচ্যে রূপান্তর।',
    category: 'SYNTAX',
    orderIndex: 30,
    status: 'PUBLISHED'
  },
  {
    id: 131,
    chapterNo: 31,
    subject: 'BANGLA',
    titleBn: 'উক্তি পরিবর্তন',
    titleEn: 'Narration / Speech (Ukti Poriborton)',
    slug: 'b31-ukti-poriborton',
    icon: 'MessageSquare',
    colorGradient: 'from-pink-600 to-rose-700',
    descriptionBn: 'প্রত্যক্ষ উক্তি ও পরোক্ষ উক্তির পরিচয় এবং কাল, সর্বনাম ও কালবাচক শব্দের রূপান্তর সূত্র।',
    category: 'SYNTAX',
    orderIndex: 31,
    status: 'PUBLISHED'
  },
  {
    id: 132,
    chapterNo: 32,
    subject: 'BANGLA',
    titleBn: 'বাক্য সংকোচন / বাক্য সংক্ষেপণ',
    titleEn: 'Sentence Contraction (Bakyo Shongkochon)',
    slug: 'b32-bakyo-shongkochon',
    icon: 'Shrink',
    colorGradient: 'from-cyan-600 to-blue-700',
    descriptionBn: 'একাধিক পদ বা উপবাক্যকে এক শব্দে রূপান্তর করার গুরুত্বপূর্ণ সংকলন ও পরীক্ষাভিত্তিক ব্যবহার।',
    category: 'VOCABULARY',
    orderIndex: 32,
    status: 'PUBLISHED'
  },
  {
    id: 133,
    chapterNo: 33,
    subject: 'BANGLA',
    titleBn: 'বাগধারা ও প্রবাদ-প্রবচন',
    titleEn: 'Idioms & Proverbs (Bagdhara)',
    slug: 'b33-bagdhara',
    icon: 'Bookmark',
    colorGradient: 'from-amber-600 to-orange-800',
    descriptionBn: 'বাংলা ভাষার বিশিষ্ট প্রয়োগরীতির রূপক অর্থবাহী বাগধারা এবং বাক্যে নির্ভুল প্রয়োগের অনুশীলন।',
    category: 'VOCABULARY',
    orderIndex: 33,
    status: 'PUBLISHED'
  },
  {
    id: 134,
    chapterNo: 34,
    subject: 'BANGLA',
    titleBn: 'এক কথায় প্রকাশ',
    titleEn: 'One Word Substitution',
    slug: 'b34-ek-kothay-prokash',
    icon: 'Edit3',
    colorGradient: 'from-teal-600 to-emerald-700',
    descriptionBn: 'বোর্ড পরীক্ষা ও প্রতিযোগিতামূলক পরীক্ষায় সর্বাধিক কমন উপযোগী ৩ শতাধিক এক কথায় প্রকাশ।',
    category: 'VOCABULARY',
    orderIndex: 34,
    status: 'PUBLISHED'
  },
  {
    id: 135,
    chapterNo: 35,
    subject: 'BANGLA',
    titleBn: 'সমার্থক শব্দ / প্রতিশব্দ',
    titleEn: 'Synonyms (Shomarthok Shobdo)',
    slug: 'b35-shomarthok-shobdo',
    icon: 'Copy',
    colorGradient: 'from-purple-600 to-indigo-700',
    descriptionBn: 'প্রকৃতি, মানবদেহ ও ব্যাকরণিক বিষয়ের গুরুত্বপূর্ণ শব্দের সমার্থক শব্দের ভাণ্ডার।',
    category: 'VOCABULARY',
    orderIndex: 35,
    status: 'PUBLISHED'
  },
  {
    id: 136,
    chapterNo: 36,
    subject: 'BANGLA',
    titleBn: 'বিপরীতার্থক শব্দ',
    titleEn: 'Antonyms (Biporitarthok Shobdo)',
    slug: 'b36-biporitarthok-shobdo',
    icon: 'Shuffle',
    colorGradient: 'from-red-600 to-rose-700',
    descriptionBn: 'ন-ঞ তৎপুরুষ, উপসর্গ ও স্বতঃসিদ্ধ বিপরীত শব্দের তালিকা ও নির্ভুল প্রয়োগবিধি।',
    category: 'VOCABULARY',
    orderIndex: 36,
    status: 'PUBLISHED'
  },
  {
    id: 137,
    chapterNo: 37,
    subject: 'BANGLA',
    titleBn: 'পারিভাষিক শব্দ',
    titleEn: 'Technical & Official Terminology',
    slug: 'b37-paribhashik-shobdo',
    icon: 'Briefcase',
    colorGradient: 'from-sky-600 to-blue-800',
    descriptionBn: 'প্রশাসনিক, বাণিজ্যিক, শিক্ষাগত ও আইন সংক্রান্ত প্রমিত বাংলা পরিভাষা সংকলন।',
    category: 'VOCABULARY',
    orderIndex: 37,
    status: 'PUBLISHED'
  },
  {
    id: 138,
    chapterNo: 38,
    subject: 'BANGLA',
    titleBn: 'শুদ্ধ-অশুদ্ধ প্রয়োগ (শব্দ ও বাক্য)',
    titleEn: 'Error Correction in Words & Sentences',
    slug: 'b38-shuddho-oshuddho-proyog',
    icon: 'AlertTriangle',
    colorGradient: 'from-orange-600 to-amber-700',
    descriptionBn: 'বহুল প্রচলিত ভুল শব্দ ও বাক্যের অশুদ্ধি নির্ণয় এবং প্রমিত বাংলা প্রয়োগের মাস্টারগাইড।',
    category: 'ADVANCED_APPLICATION',
    orderIndex: 38,
    status: 'PUBLISHED'
  },
  {
    id: 139,
    chapterNo: 39,
    subject: 'BANGLA',
    titleBn: 'বিরামচিহ্ন বা যতিচিহ্নের ব্যবহার',
    titleEn: 'Punctuation Marks (Biramchinho)',
    slug: 'b39-biramchinho',
    icon: 'PauseCircle',
    colorGradient: 'from-emerald-600 to-teal-800',
    descriptionBn: 'দাঁড়ি, কমা, সেমিকোলন, কোলন, ড্যাশ, হাইফেন ও উদ্ধৃতি চিহ্নের যথাযথ ব্যবহার ও বিরতিকাল।',
    category: 'PUNCTUATION',
    orderIndex: 39,
    status: 'PUBLISHED'
  },
  {
    id: 140,
    chapterNo: 40,
    subject: 'BANGLA',
    titleBn: 'বাংলা ব্যাকরণ — SSC/HSC পরীক্ষাভিত্তিক Revision',
    titleEn: 'Bangla Grammar — SSC & HSC Master Revision',
    slug: 'b40-bangla-grammar-ssc-hsc-revision',
    icon: 'Award',
    colorGradient: 'from-indigo-600 to-purple-900',
    descriptionBn: 'বোর্ড পরীক্ষার ১০০% প্রস্তুতি, সাজেস্টিভ ব্যাকরণ ড্রিলস, বোর্ড কোয়েশ্চেন ব্যাংক এবং ফাইনাল মডেল টেস্ট সেট।',
    category: 'EXAM_REVISION',
    orderIndex: 40,
    status: 'PUBLISHED'
  }
];

async function seedBanglaGrammarChapters() {
  const dbPath = path.join(__dirname, '../data/nextgen_academy_db.json');
  console.log('Reading database from:', dbPath);
  const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

  if (!Array.isArray(db.grammar_chapters)) {
    db.grammar_chapters = [];
  }

  // 1. Ensure existing chapters have subject: 'ENGLISH'
  let englishCount = 0;
  db.grammar_chapters.forEach(c => {
    if (!c.subject) {
      c.subject = 'ENGLISH';
      englishCount++;
    }
  });

  // Ensure topics, questions, and model tests have subject
  if (Array.isArray(db.grammar_topics)) {
    db.grammar_topics.forEach(t => { if (!t.subject) t.subject = 'ENGLISH'; });
  }
  if (Array.isArray(db.grammar_questions)) {
    db.grammar_questions.forEach(q => { if (!q.subject) q.subject = 'ENGLISH'; });
  }
  if (Array.isArray(db.grammar_model_tests)) {
    db.grammar_model_tests.forEach(m => { if (!m.subject) m.subject = 'ENGLISH'; });
  }

  // 2. Check how many Bangla chapters already exist
  const existingBangla = db.grammar_chapters.filter(c => c.subject === 'BANGLA');
  console.log(`Existing Bangla chapters found: ${existingBangla.length}`);

  let addedCount = 0;
  const now = new Date().toISOString();

  BANGLA_CHAPTERS.forEach(bc => {
    const foundIdx = db.grammar_chapters.findIndex(c => c.id === bc.id || (c.subject === 'BANGLA' && c.chapterNo === bc.chapterNo));
    if (foundIdx === -1) {
      db.grammar_chapters.push({
        ...bc,
        estimatedTopicsCount: 0,
        createdAt: now,
        updatedAt: now
      });
      addedCount++;
    } else {
      // Update metadata non-destructively
      db.grammar_chapters[foundIdx] = {
        ...db.grammar_chapters[foundIdx],
        titleBn: bc.titleBn,
        titleEn: bc.titleEn,
        slug: bc.slug,
        icon: bc.icon,
        colorGradient: bc.colorGradient,
        descriptionBn: bc.descriptionBn,
        category: bc.category,
        orderIndex: bc.orderIndex,
        subject: 'BANGLA',
        status: 'PUBLISHED'
      };
    }
  });

  // Save to database safely
  const tempPath = `${dbPath}.tmp`;
  fs.writeFileSync(tempPath, JSON.stringify(db, null, 2), 'utf8');
  fs.renameSync(tempPath, dbPath);

  const totalChapters = db.grammar_chapters.length;
  const banglaTotal = db.grammar_chapters.filter(c => c.subject === 'BANGLA').length;
  const englishTotal = db.grammar_chapters.filter(c => c.subject === 'ENGLISH').length;

  console.log('------------------------------------------------------------------------');
  console.log(`✅ Bangla Grammar Chapter Migration Complete!`);
  console.log(`   - English Chapters: ${englishTotal}`);
  console.log(`   - Bangla Chapters:  ${banglaTotal} / 40`);
  console.log(`   - Total Chapters:   ${totalChapters}`);
  console.log('------------------------------------------------------------------------');
}

if (require.main === module) {
  seedBanglaGrammarChapters().catch(err => {
    console.error('Error during Bangla Grammar seeding:', err);
    process.exit(1);
  });
}

module.exports = { seedBanglaGrammarChapters, BANGLA_CHAPTERS };
