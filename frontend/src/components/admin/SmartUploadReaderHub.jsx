import React, { useState, useEffect, useMemo } from 'react';
import {
  Database,
  Plus,
  Trash2,
  Search,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  FolderOpen,
  Filter,
  Layers,
  Sparkles,
  HelpCircle,
  FileText,
  Calendar,
  GraduationCap,
  RefreshCw,
  Eye,
  Check,
  X,
  ListOrdered,
  BookMarked,
  Sliders,
  Send,
  Zap,
  Copy,
  ArrowUp,
  ArrowDown,
  CheckSquare,
  Edit3,
  Save,
  UploadCloud,
  Info,
  Type
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { questionRepositoryAPI } from '../../services/api';
import MathRenderer from '../common/MathRenderer';

const CLASSES_LIST = [
  'ষষ্ঠ শ্রেণি (Class 6)',
  'সপ্তম শ্রেণি (Class 7)',
  'অষ্টম শ্রেণি (Class 8)',
  'নবম শ্রেণি (Class 9)',
  'দশম শ্রেণি (Class 10)',
  'একাদশ শ্রেণি (Class 11)',
  'দ্বাদশ শ্রেণি (Class 12)',
  'Class 9-10 (SSC)',
  'Class 11-12 (HSC)'
];

const SUBJECTS_LIST = [
  'সাধারণ গণিত (General Math)',
  'উচ্চতর গণিত (Higher Math)',
  'পদার্থবিজ্ঞান (Physics)',
  'রসায়ন (Chemistry)',
  'জীববিজ্ঞান (Biology)',
  'তথ্য ও যোগাযোগ প্রযুক্তি / আইসিটি (ICT)',
  'বাংলাদেশ ও বিশ্বপরিচয় (BGS)',
  'সাধারণ বিজ্ঞান (General Science)',
  'ইসলাম ও নৈতিক শিক্ষা',
  'হিন্দুধর্ম ও নৈতিক শিক্ষা',
  'বাংলা ১ম পত্র (সাহিত্য)',
  'বাংলা ২য় পত্র (বাংলা ব্যাকরণ ও নির্মিতি)',
  'ইংরেজি ১ম পত্র (English 1st Paper)',
  'ইংরেজি ২য় পত্র (English 2nd Paper)',
  'হিসাববিজ্ঞান (Accounting)',
  'ফিন্যান্স ও ব্যাংকিং (Finance & Banking)',
  'ব্যবসায় উদ্যোগ (Business Studies)'
];

const INSTITUTIONS_LIST = [
  'ঢাকা বোর্ড (Dhaka Board)',
  'রাজশাহী বোর্ড (Rajshahi Board)',
  'চট্টগ্রাম বোর্ড (Chattogram Board)',
  'কুমিল্লা বোর্ড (Cumilla Board)',
  'যশোর বোর্ড (Jashore Board)',
  'বরিশাল বোর্ড (Barishal Board)',
  'সিলেট বোর্ড (Sylhet Board)',
  'দিনাজপুর বোর্ড (Dinajpur Board)',
  'ময়মনসিংহ বোর্ড (Mymensingh Board)',
  'মাদ্রাসা বোর্ড (Madrasah Board)',
  'নটর ডেম কলেজ (NDC)',
  'রাজউক উত্তরা মডেল কলেজ (RUMC)',
  'আইডিয়াল স্কুল অ্যান্ড কলেজ (Motijheel)',
  'ভিকারুননিসা নূন স্কুল অ্যান্ড কলেজ (VNSC)',
  'ঢাকা রেসিডেনসিয়াল মডেল কলেজ (DRMC)',
  'হলি ক্রস কলেজ (HCC)',
  'ক্যান্টনমেন্ট পাবলিক স্কুল ও কলেজ',
  'সাধারণ প্রশ্ন ব্যাংক'
];

const YEARS_LIST = ['2026', '2025', '2024', '2023', '2022', '2021', '2020'];

const INITIAL_SEEDED_QUESTIONS = [
  {
    id: 'repo-seed-mcq-1',
    type: 'MCQ',
    className: 'দশম শ্রেণি (Class 10)',
    book: 'পদার্থবিজ্ঞান (Physics)',
    subject: 'পদার্থবিজ্ঞান (Physics)',
    institutionOrBoard: 'ঢাকা বোর্ড (Dhaka Board)',
    year: '2025',
    chapter: 'অধ্যায় ২: গতি (Motion)',
    question: 'পরন্ত বস্তুর তৃতীয় সূত্রানুসারে মুক্তভাবে পরন্ত বস্তুর নির্দিষ্ট সময়ে প্রাপ্ত বেগ সময়ের সাথে কীভাবে পরিবর্তিত হয়?',
    options: [
      'প্রাপ্ত বেগ সময়ের সমানুপাতিক (v ∝ t)',
      'প্রাপ্ত বেগ দূরত্বের বর্গের সমানুপাতিক',
      'প্রাপ্ত বেগ সময়ের বর্গের ব্যস্তানুপাতিক',
      'প্রাপ্ত বেগ সময়ের বর্গের সমানুপাতিক (v ∝ t²)'
    ],
    correctAnswer: 'ক',
    explanation: 'গ্যালিলিওর পরন্ত বস্তুর ৩য় সূত্র মতে: নির্দিষ্ট সময়ে প্রাপ্ত বেগ অতিক্রান্ত সময়ের সমানুপাতিক (v ∝ t)।',
    difficulty: 'MEDIUM',
    badge: "ঢাকা বোর্ড - '২৫",
    marks: 1
  },
  {
    id: 'repo-seed-mcq-2',
    type: 'MCQ',
    className: 'দশম শ্রেণি (Class 10)',
    book: 'রসায়ন (Chemistry)',
    subject: 'রসায়ন (Chemistry)',
    institutionOrBoard: 'রাজশাহী বোর্ড (Rajshahi Board)',
    year: '2026',
    chapter: 'অধ্যায় ৫: রাসায়নিক বন্ধন',
    question: 'নিচের কোন অণুতে মুক্তজোড় ইলেকট্রন (Lone Pair Electron) বিদ্যমান?',
    options: ['মিথেন (CH₄)', 'অ্যামোনিয়া (NH₃)', 'কার্বন ডাই অক্সাইড (CO₂)', 'বোরন ট্রাইফ্লোরাইড (BF₃)'],
    correctAnswer: 'খ',
    explanation: 'NH₃ অণুতে নাইট্রোজেনের শেষ শক্তিস্তরে ১ জোড়া মুক্তজোড় ইলেকট্রন থাকে।',
    difficulty: 'MEDIUM',
    badge: "রাজশাহী বোর্ড - '২৬",
    marks: 1
  },
  {
    id: 'repo-seed-mcq-3',
    type: 'MCQ',
    className: 'দশম শ্রেণি (Class 10)',
    book: 'উচ্চতর গণিত (Higher Math)',
    subject: 'উচ্চতর গণিত (Higher Math)',
    institutionOrBoard: 'চট্টগ্রাম বোর্ড (Chattogram Board)',
    year: '2025',
    chapter: 'অধ্যায় ৮: ত্রিকোণমিতি',
    question: 'যদি tan θ = 3/4 এবং cos θ < 0 হয়, তবে sin θ এর মান কত?',
    options: ['-3/5', '3/5', '-4/5', '4/5'],
    correctAnswer: 'ক',
    explanation: '৩য় চতুর্ভাগে tan θ ধনাত্মক কিন্তু sin θ ঋণাত্মক, তাই sin θ = -3/5।',
    difficulty: 'HARD',
    badge: "চট্টগ্রাম বোর্ড - '২৫",
    marks: 1
  },
  {
    id: 'repo-seed-cq-1',
    type: 'CQ',
    className: 'দশম শ্রেণি (Class 10)',
    book: 'পদার্থবিজ্ঞান (Physics)',
    subject: 'পদার্থবিজ্ঞান (Physics)',
    institutionOrBoard: 'ঢাকা বোর্ড (Dhaka Board)',
    year: '2026',
    chapter: 'অধ্যায় ৪: কাজ, ক্ষমতা ও শক্তি',
    question: 'উদ্দীপক: ৫০ কেজি ভরের একজন বালক ৫০ সেন্টিমিটার উঁচু ২০টি সিঁড়ি ১০ সেকেন্ডে অতিক্রম করে ছাদে উঠল।',
    subQuestions: {
      a: { q: 'কাজ কাকে বলে?', marks: 1 },
      b: { q: '১ জুল কাজ বলতে কী বোঝায়?', marks: 2 },
      c: { q: 'বালকের দ্বারা সম্পাদিত কাজের পরিমাণ নির্ণয় করো।', marks: 3 },
      d: { q: 'বালকের ক্ষমতা কত ওয়াট ছিল গাণিতিকভাবে বিশ্লেষণ করো।', marks: 4 }
    },
    difficulty: 'MEDIUM',
    badge: "ঢাকা বোর্ড - '২৬",
    marks: 10
  },
  {
    id: 'repo-seed-sq-1',
    type: 'SQ',
    className: 'দশম শ্রেণি (Class 10)',
    book: 'তথ্য ও যোগাযোগ প্রযুক্তি / আইসিটি (ICT)',
    subject: 'তথ্য ও যোগাযোগ প্রযুক্তি / আইসিটি (ICT)',
    institutionOrBoard: 'কুমিল্লা বোর্ড (Cumilla Board)',
    year: '2026',
    chapter: 'অধ্যায় ৩: তথ্য ও যোগাযোগ প্রযুক্তির নিরাপদ ব্যবহার',
    question: 'টু-ফ্যাক্টর অথেনটিকেশন (2FA) বলতে কী বোঝায়?',
    shortAnswer: 'ব্যবহারকারীর পরিচয় নিশ্চিত করার জন্য পাসওয়ার্ড ছাড়াও অতিরিক্ত দ্বিতীয় ধাপের নিরাপত্তা যাচাইকরণ প্রক্রিয়াকে 2FA বলে।',
    difficulty: 'EASY',
    badge: "কুমিল্লা বোর্ড - '২৬",
    marks: 2
  }
];

/**
 * Universal UTF-8 Unicode Normalizer & Glitch Cleaner
 * Cleans BOM, invisible spaces, fixes NFC composite characters, and repairs broken Bengali vowels/conjuncts
 */
function cleanAndNormalizeUTF8(input) {
  if (!input) return '';
  if (typeof input !== 'string') return String(input);

  // 1. Unicode NFC Normalization (composes base characters and vowel signs/kar properly)
  let clean = input.normalize('NFC');

  // 2. Remove UTF-8 BOM and corrupt invisible control characters
  clean = clean.replace(/\uFEFF/g, ''); // UTF-8 Byte Order Mark
  clean = clean.replace(/[\u200B\u200E\u200F]/g, ''); // Zero-width spaces & directional marks
  clean = clean.replace(/\u00A0/g, ' '); // Non-breaking space to regular space

  // 3. Normalize all line breaks to standard Unix format
  clean = clean.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  return clean;
}

/**
 * 100% Accurate Math-Aware Universal SutonnyMJ / Bijoy 52 to Unicode Bengali Converter
 * Seamlessly handles legacy Bengali conjuncts, vowel repositioning, and preserves mathematical sets, variables, and units
 */
function convertBijoyToUnicode(input) {
  if (!input) return '';
  let str = input;

  const preservedMathTokens = [];

  // 1. Protect sets: {...} e.g. {x : 0 <= x < 6}, {(4, 1), (4, 3)}
  str = str.replace(/\{[^\}]+\}/g, (match) => {
    const idx = preservedMathTokens.length;
    preservedMathTokens.push(match);
    return `\uE000${idx}\uE000`;
  });

  // 2. Protect function calls / power sets / math tuples e.g. P(Q), f(y), g(x), (y), (4, 1)
  str = str.replace(/([A-Za-z])\s*\(([A-Za-z0-9\s\,\+\-\*\/\^\_\:\;\<\>\=]+)\)/g, (match) => {
    const idx = preservedMathTokens.length;
    preservedMathTokens.push(match);
    return `\uE000${idx}\uE000`;
  });

  // 3. Protect algebraic expressions with variables e.g. "2y + 14y", "3x^2 + 5x - 2", "14y", "2y"
  str = str.replace(/(?:(?<=\s|^|\=|\+|\-|\*|\/|\(|\,)\d+[a-zA-Z]+(?=\s|$|\=|\+|\-|\*|\/|\)|\,))/g, (match) => {
    const idx = preservedMathTokens.length;
    preservedMathTokens.push(match);
    return `\uE000${idx}\uE000`;
  });

  // Protect standalone algebraic variables / English in parentheses e.g. (y), (x), (t), (Pitch)
  str = str.replace(/\(([A-Za-z0-9\s\,\+\-\*\/\^\_\:\;\<\>\=]+)\)/g, (match, inner) => {
    if (!/^[KLMN]$/i.test(inner.trim())) {
      const idx = preservedMathTokens.length;
      preservedMathTokens.push('(' + inner + ')');
      return `\uE000${idx}\uE000`;
    }
    return match;
  });

  // Protect equations with =, <, >, +, - e.g. "Q = ...", "S = ...", "(y) = 2y + 14y - 1"
  str = str.replace(/\b([A-Z])\s*=\s*/g, (match, letter) => {
    const idx = preservedMathTokens.length;
    preservedMathTokens.push(`${letter} = `);
    return `\uE000${idx}\uE000`;
  });

  // Protect standalone uppercase math variables followed by punctuation or math
  // e.g. "P(Q)", "†Wvg S" -> "ডোম S", "S এর"
  str = str.replace(/(?<=[\s\(\[\{])([A-Z])(?=[\s\,\.\)\]\}]|$)/g, (match, letter) => {
    if (!['K', 'L', 'M', 'N'].includes(letter)) {
      const idx = preservedMathTokens.length;
      preservedMathTokens.push(letter);
      return `\uE000${idx}\uE000`;
    }
    return match;
  });

  // 4. Normalize tab/space-separated option lines in math questions:
  // e.g. "\tK\t5\tL\t16\tM\t32\tN\t64"
  // e.g. "K 1 L 14 M 14 N 1"
  // e.g. "K 2 L 3" and "M 4 N 8"
  str = str.replace(/(?:^|\n|[\t\s]{2,})K[\t\s]+([^\t\n\r]+?)[\t\s]+L[\t\s]+([^\t\n\r]+?)[\t\s]+M[\t\s]+([^\t\n\r]+?)[\t\s]+N[\t\s]+([^\t\n\r]+)/g,
    '\n(ক) $1\n(খ) $2\n(গ) $3\n(ঘ) $4');

  str = str.replace(/(?:^|\n|[\t\s]{2,})K[\t\s]+([^\t\n\r]+?)[\t\s]+L[\t\s]+([^\t\n\r]+)/g,
    '\n(ক) $1\n(খ) $2');
  str = str.replace(/(?:^|\n|[\t\s]{2,})M[\t\s]+([^\t\n\r]+?)[\t\s]+N[\t\s]+([^\t\n\r]+)/g,
    '\n(গ) $1\n(ঘ) $2');

  // Convert standard Sutonny Smart Quotes
  str = str.replace(/Ò/g, '“').replace(/Ó/g, '”').replace(/Õ/g, '’').replace(/Ô/g, '‘');

  // Question / Sub-question numbering markers (K. L. M. N. / K) L) M) N))
  str = str.replace(/(?:^|\n)\s*K[\.\)]\s*/g, '\nক. ');
  str = str.replace(/(?:^|\n)\s*L[\.\)]\s*/g, '\nখ. ');
  str = str.replace(/(?:^|\n)\s*M[\.\)]\s*/g, '\nগ. ');
  str = str.replace(/(?:^|\n)\s*N[\.\)]\s*/g, '\nঘ. ');

  // 5. Pre-process SutonnyMJ Multi-character Ligatures & Conjuncts (Order: longest first)
  const LIGATURES = [
    ['Aš^', 'অন্ব'], ['š^', 'ন্ব'], ['š^q', 'ন্বয়'], ['š^qwU‡Z', 'অন্বয়টিতে'],
    ['Dcv`vb', 'উপাদান'], ['Dcv`v‡bi', 'উপাদানের'], ['msL¨v', 'সংখ্যা'],
    ['†Wvg', 'ডোম'], ['‡iÄ', 'রেঞ্জ'], ['n‡j', 'হলে'], ['Gi', 'এর'], ['gvb', 'মান'],
    ['†kø', 'শ্লে'], ['kø', 'শ্ল'],
    ['e¨v', 'ব্যা'], ['L¨v', 'খ্যা'], ['K¨v', 'ক্যা'], ['M¨v', 'গ্যা'],
    ['e¨', 'ব্য'], ['L¨', 'খ্য'], ['K¨', 'ক্য'], ['M¨', 'গ্য'], ['N¨', 'ঘ্য'],
    ['Z¡', 'ত্ব'], ['¯’', 'স্থ'], ['cÖ', 'প্র'], ['e„Ë', 'বৃত্ত'], ['e„', 'বৃ'], ['„Ë', 'ৃত্ত'],
    ['iæ', 'রু'], ['ï', 'শু'], ['µ', 'ক্র'], ['Î', 'ত্র'], ['cø', 'প্ল'],
    ['MÖæ', 'গ্রু'], ['MÖ', 'গ্র'], ['K¬', 'ক্ল'], ['Mø', 'গ্ল'], ['eª', 'ব্র'], ['fª', 'ভ্র'],
    ['gª', 'ম্র'], ['kª', 'শ্র'], ['mª', 'স্র'], ['nª', 'হ্র'], ['Uª', 'ট্র'], ['Wª', 'ড্র'],
    ['Xª', 'থ্র'], ['Yª', 'ণ্র'], ['Zª', 'ত্র'], ['dª', 'দ্র'], ['aª', 'ধ্র'], ['bª', 'ন্র'],
    ['cª', 'প্র'], ['cÖæ', 'প্রু'],
    ['¼', 'ঙ্ক'], ['½', 'ঙ্গ'], ['¾', 'জ্ঞ'], ['¿', 'ঞ্চ'], ['À', 'ঞ্ছ'], ['Á', 'ঞ্জ'],
    ['Â', 'ট্ফ'], ['Ã', 'ট্ট'], ['Ä', 'ড্ড'], ['Å', 'ণ্ট'], ['Æ', 'ণ্ঠ'], ['Ç', 'ণ্ড'],
    ['È', 'ত্ত'], ['É', 'ত্থ'], ['Ê', 'ত্ন'], ['Ë', 'ত্ম'], ['Ì', 'ত্র'], ['Í', 'থ্ব'],
    ['Î', 'ত্র'], ['Ï', 'দ্ধ'], ['Ð', 'দ্দ'], ['Ñ', 'দ্ব'], ['Ò', 'ধ্ম'], ['Ó', 'ন্ট'],
    ['Ô', 'ন্ঠ'], ['Õ', 'ন্ড'], ['Ö', 'ন্ন'], ['×', 'ন্ম'], ['Ø', 'প্ট'], ['Ù', 'প্ত'],
    ['Ú', 'প্ন'], ['Û', 'প্প'], ['Ü', 'ফ্স'], ['Ý', 'ব্দ'], ['Þ', 'ব্ধ'], ['ß', 'ব্ব'],
    ['à', 'ভ্ল'], ['á', 'ম্প'], ['â', 'ম্ফ'], ['ã', 'ম্ব'], ['ä', 'ম্ভ'], ['å', 'ম্ম'],
    ['æ', 'ম্ল'], ['ç', 'ল্ক'], ['è', 'ল্গ'], ['é', 'ল্ট'], ['ê', 'ল্ড'], ['ë', 'ল্প'],
    ['ì', 'ল্ব'], ['í', 'ল্ম'], ['î', 'ল্ল'], ['ð', 'ষ্ট'], ['ñ', 'ষ্ঠ'],
    ['ò', 'ষ্ণ'], ['ó', 'ষ্প'], ['ô', 'ষ্ফ'], ['õ', 'ষ্ম'], ['ö', 'স্ক'], ['÷', 'স্খ'],
    ['ø', 'স্ত'], ['ù', 'স্থ'], ['ú', 'স্ন'], ['û', 'স্প'], ['ü', 'স্ফ'], ['ý', 'স্ব'],
    ['þ', 'স্ম'], ['ÿ', 'স্ল'], ['Ā', 'হ্ন'], ['ā', 'হ্ম'], ['Ă', 'হ্ল'], ['ă', 'হৃ'],
    ['¶', 'ক্ষ'], ['²	', 'ক্ষ্ম'], ['³', 'ক্ত'], ['Kz', 'কু'], ['»', 'গ্ধ'],
    ['«', '্র'], ['ª', '্র'], ['™', '্ত'], ['›', '্থ'], ['œ', '্ন'], ['§', '্ম'],
    ['¨', '্য'], ['¡', '্ব'], ['„', 'ৃ'],
    ['Av', 'আ'], ['GB', 'এই'], ['IB', 'ওই'], ['OB', 'ওই']
  ];

  for (const [from, to] of LIGATURES) {
    str = str.split(from).join(to);
  }

  // Regex pattern for a single Consonant or Conjunct
  const CONS_PATTERN = '(?:\u09B0\u09CD)?(?:[\u0995-\u09B9\u09CE\u09DC-\u09DF](?:\u09CD[\u0995-\u09B9\u09CE\u09DC-\u09DF])*|[a-zA-Z`_~])';

  // 6. Handle O-kar (ো): [† or ‡] + Consonant + v (া) -> Consonant + ো
  const oKarRegex = new RegExp('([†‡])(' + CONS_PATTERN + ')v', 'g');
  str = str.replace(oKarRegex, '$2ো');

  // 7. Handle OU-kar (ৌ): [† or ‡] + Consonant + Š (ৗ) -> Consonant + ৌ
  const ouKarRegex = new RegExp('([†‡])(' + CONS_PATTERN + ')Š', 'g');
  str = str.replace(ouKarRegex, '$2ৌ');

  // 8. Handle E-kar (ে): [† or ‡] + Consonant -> Consonant + ে
  const eKarRegex = new RegExp('([†‡])(' + CONS_PATTERN + ')', 'g');
  str = str.replace(eKarRegex, '$2ে');

  // 9. Handle OI-kar (ৈ): ‰ + Consonant -> Consonant + ৈ
  const oiKarRegex = new RegExp('‰(' + CONS_PATTERN + ')', 'g');
  str = str.replace(oiKarRegex, '$1ৈ');

  // 10. Handle I-kar (ি): w + Consonant -> Consonant + ি
  const iKarRegex = new RegExp('w(' + CONS_PATTERN + ')', 'g');
  str = str.replace(iKarRegex, '$1ি');

  // 11. Handle Reph (©): Consonant + © -> র্ + Consonant
  const rephRegex = new RegExp('(' + CONS_PATTERN + ')©', 'g');
  str = str.replace(rephRegex, 'র্$1');

  // 12. Single Character Map
  const CHAR_MAP = {
    'A': 'অ', 'B': 'ই', 'C': 'ঈ', 'D': 'উ', 'E': 'ঊ', 'F': 'ঋ', 'G': 'এ', 'H': 'ঐ', 'I': 'ও', 'J': 'ঔ',
    'K': 'ক', 'L': 'খ', 'M': 'গ', 'N': 'ঘ', 'O': 'ঙ',
    'P': 'চ', 'Q': 'ছ', 'R': 'জ', 'S': 'ঝ', 'T': 'ঞ',
    'U': 'ট', 'V': 'ঠ', 'W': 'ড', 'X': 'ঢ', 'Y': 'ণ',
    'Z': 'ত', '_': 'থ', '`': 'দ', 'a': 'ধ', 'b': 'ন',
    'c': 'প', 'd': 'ফ', 'e': 'ব', 'f': 'ভ', 'g': 'ম',
    'h': 'য', 'i': 'র', 'j': 'ল', 'k': 'শ', 'l': 'ষ',
    'm': 'স', 'n': 'হ', 'o': 'ড়', 'p': 'ঢ়', 'q': 'য়',
    'r': 'ৎ', 's': 'ং', 't': 'ঃ', 'u': 'ঁ',
    'v': 'া', 'x': 'ী', 'y': 'ু', 'z': 'ূ',
    '~': '্', '|': '।'
  };

  // Convert tokens, protecting math variables, numbers, and scientific units
  let out = '';
  const tokens = str.split(/(\uE000\d+\uE000|\b[0-9]+(?:\.[0-9]+)?\b|\b(?:km|h1|h-1|s2|s-2|m|s|kg|cm|mm|Pa|Hz|N|J|W|eV|V|A|mol)\b)/);
  for (const tok of tokens) {
    if (!tok) continue;
    if (tok.startsWith('\uE000') || /^\b[0-9]+(?:\.[0-9]+)?\b$/.test(tok) || /^(?:km|h1|h-1|s2|s-2|m|s|kg|cm|mm|Pa|Hz|N|J|W|eV|V|A|mol)$/.test(tok)) {
      out += tok;
    } else {
      for (let i = 0; i < tok.length; i++) {
        const ch = tok[i];
        out += CHAR_MAP[ch] !== undefined ? CHAR_MAP[ch] : ch;
      }
    }
  }

  // Restore preserved math tokens
  preservedMathTokens.forEach((saved, idx) => {
    out = out.replace(`\uE000${idx}\uE000`, saved);
  });

  return cleanAndNormalizeUTF8(out);
}

// Helper to normalize Bengali/English answer keys to 'ক' | 'খ' | 'গ' | 'ঘ'
function normalizeOptionKey(val) {
  if (!val) return 'ক';
  const clean = String(val).trim().toLowerCase();
  if (clean === 'b' || clean === 'খ' || clean === '2' || clean === '২' || clean.includes('খ') || clean.includes('b')) return 'খ';
  if (clean === 'c' || clean === 'গ' || clean === '3' || clean === '৩' || clean.includes('গ') || clean.includes('c')) return 'গ';
  if (clean === 'd' || clean === 'ঘ' || clean === '4' || clean === '৪' || clean.includes('ঘ') || clean.includes('d')) return 'ঘ';
  return 'ক';
}

// Extract MCQ details from raw lines
function parseMCQChunk(lines, idx) {
  let options = [];
  let ans = 'ক';
  let explanation = '';
  const qLines = [];

  for (let i = 0; i < lines.length; i++) {
    const line = cleanAndNormalizeUTF8(lines[i].trim());
    if (!line) continue;

    // Check for Answer line (Bengali or English)
    const ansMatch = line.match(/^(?:সঠিক\s*)?(?:উত্তর|উত্তরঃ|উঃ|উ|Ans|Answer|Correct\s*Ans(?:wer)?)\s*[:.\-=\s]+\s*[\(\[]?([ক-ঘa-dA-D1-4১২৩৪])[\)\]\.\s\-]*/i);
    if (ansMatch) {
      ans = normalizeOptionKey(ansMatch[1]);
      continue;
    }

    // Check for Explanation / Solution line
    const expMatch = line.match(/^(?:ব্যাখ্যা|Explanation|Explain|সমাধান|Note|ব্যাখ্যা\s*সহ)\s*[:.\-=\s]+(.*)/i);
    if (expMatch) {
      explanation = cleanAndNormalizeUTF8(expMatch[1].trim());
      continue;
    }

    // Check for inline options on a single line (e.g. "(ক) 5 (খ) 16 (গ) 32 (ঘ) 64" or "ক. ১  খ. ২  গ. ৩  ঘ. ৪")
    const inlineMatches = [...line.matchAll(/[\(\[]?([ক-ঘa-dA-D])[\)\]\.\:\-\|\।\s]+(.*?)(?=(?:[\(\[]?[ক-ঘa-dA-D][\)\]\.\:\-\|\।\s]+)|$)/gi)];
    if (inlineMatches.length >= 2) {
      inlineMatches.forEach(m => {
        const optVal = cleanAndNormalizeUTF8(m[2].trim());
        if (optVal) options.push(optVal);
      });
      continue;
    }

    // Check for single line option (e.g. "ক) অপশন টেক্সট" or "A. Option text")
    const singleOptMatch = line.match(/^[\(\[]?([ক-ঘa-dA-D])[\)\]\.\:\-\|\।\s]+(.*)/i);
    if (singleOptMatch && options.length < 4 && (i > 0 || options.length > 0)) {
      const optVal = cleanAndNormalizeUTF8(singleOptMatch[2].trim());
      if (optVal) options.push(optVal);
      continue;
    }

    // Otherwise it's part of the question title
    qLines.push(line);
  }

  // Pad options to 4 if fewer
  const defaultLabels = ['বিকল্প ক', 'বিকল্প খ', 'বিকল্প গ', 'বিকল্প ঘ'];
  while (options.length < 4) {
    options.push(defaultLabels[options.length] || `বিকল্প ${options.length + 1}`);
  }

  const rawTitle = qLines.join(' ')
    .replace(/^(?:(?:প্রশ্ন\s*|Question\s*|Q\s*)?[0-9১-৯]+[\.\)\:\-\|\।\]\s]+|Q[0-9]+[:.]\s*|\[[0-9১-৯]+\]\s*)/i, '')
    .trim();

  return {
    id: `mcq-staged-${Date.now()}-${idx}-${Math.random().toString(36).substr(2, 4)}`,
    type: 'MCQ',
    question: cleanAndNormalizeUTF8(rawTitle || lines[0] || `প্রশ্ন ${idx + 1}`),
    options: options.slice(0, 4),
    correctAnswer: ans,
    explanation: cleanAndNormalizeUTF8(explanation),
    difficulty: 'MEDIUM',
    marks: 1
  };
}

// Extract CQ details from raw lines
function parseCQChunk(lines, idx) {
  const stemLines = [];
  const subQs = {
    a: { q: 'জ্ঞানমূলক প্রশ্ন লিখুন', marks: 1 },
    b: { q: 'অনুধাবনমূলক প্রশ্ন লিখুন', marks: 2 },
    c: { q: 'প্রয়োগমূলক প্রশ্ন লিখুন', marks: 3 },
    d: { q: 'উচ্চতর দক্ষতামূলক প্রশ্ন লিখুন', marks: 4 }
  };

  lines.forEach(line => {
    const l = cleanAndNormalizeUTF8(line.trim());
    if (!l) return;

    if (/^[\(\[]?(?:ক|a|১|1|k)[\)\]\.\:\-\|\।\s]/i.test(l)) {
      subQs.a.q = cleanAndNormalizeUTF8(l.replace(/^[\(\[]?(?:ক|a|১|1|k)[\)\]\.\:\-\|\।\s]+/i, '').replace(/[\t\s]+[1-4১-৪]$/, '').replace(/\[[0-9১-৯]+\]$/, '').trim());
    } else if (/^[\(\[]?(?:খ|b|২|2|l)[\)\]\.\:\-\|\।\s]/i.test(l)) {
      subQs.b.q = cleanAndNormalizeUTF8(l.replace(/^[\(\[]?(?:খ|b|২|2|l)[\)\]\.\:\-\|\।\s]+/i, '').replace(/[\t\s]+[1-4১-৪]$/, '').replace(/\[[0-9১-৯]+\]$/, '').trim());
    } else if (/^[\(\[]?(?:গ|c|৩|3|m)[\)\]\.\:\-\|\।\s]/i.test(l)) {
      subQs.c.q = cleanAndNormalizeUTF8(l.replace(/^[\(\[]?(?:গ|c|৩|3|m)[\)\]\.\:\-\|\।\s]+/i, '').replace(/[\t\s]+[1-4১-৪]$/, '').replace(/\[[0-9১-৯]+\]$/, '').trim());
    } else if (/^[\(\[]?(?:ঘ|d|৪|4|n)[\)\]\.\:\-\|\।\s]/i.test(l)) {
      subQs.d.q = cleanAndNormalizeUTF8(l.replace(/^[\(\[]?(?:ঘ|d|৪|4|n)[\)\]\.\:\-\|\।\s]+/i, '').replace(/[\t\s]+[1-4১-৪]$/, '').replace(/\[[0-9১-৯]+\]$/, '').trim());
    } else {
      stemLines.push(l);
    }
  });

  const rawStem = stemLines.join(' ')
    .replace(/^(?:(?:প্রশ্ন\s*|Question\s*|Q\s*)?[0-9১-৯]+[\.\)\:\-\|\।\]\s]+|Q[0-9]+[:.]\s*|\[[0-9১-৯]+\]\s*)/i, '')
    .trim();

  return {
    id: `cq-staged-${Date.now()}-${idx}-${Math.random().toString(36).substr(2, 4)}`,
    type: 'CQ',
    question: cleanAndNormalizeUTF8(rawStem || 'উদ্দীপকটি পড়ে নিচের প্রশ্নগুলোর উত্তর দাও:'),
    subQuestions: subQs,
    diagramUrl: '',
    difficulty: 'MEDIUM',
    marks: 10
  };
}

// Extract SQ details from raw lines
function parseSQChunk(lines, idx) {
  let sqAns = '';
  const qLines = [];

  lines.forEach(line => {
    const l = cleanAndNormalizeUTF8(line.trim());
    if (!l) return;

    if (/^(?:সঠিক\s*)?(?:উত্তর|উত্তরঃ|উঃ|উ|Ans|Answer|সমাধান)\s*[:.\-=\s]+/i.test(l)) {
      sqAns = cleanAndNormalizeUTF8(l.replace(/^(?:সঠিক\s*)?(?:উত্তর|উত্তরঃ|উঃ|উ|Ans|Answer|সমাধান)\s*[:.\-=\s]+/i, '').trim());
    } else {
      qLines.push(l);
    }
  });

  const rawTitle = qLines.join(' ')
    .replace(/^(?:(?:প্রশ্ন\s*|Question\s*|Q\s*)?[0-9১-৯]+[\.\)\:\-\|\।\]\s]+|Q[0-9]+[:.]\s*|\[[0-9১-৯]+\]\s*)/i, '')
    .trim();

  return {
    id: `sq-staged-${Date.now()}-${idx}-${Math.random().toString(36).substr(2, 4)}`,
    type: 'SQ',
    question: cleanAndNormalizeUTF8(rawTitle || lines[0] || `সংক্ষিপ্ত প্রশ্ন ${idx + 1}`),
    shortAnswer: cleanAndNormalizeUTF8(sqAns),
    difficulty: 'MEDIUM',
    marks: 2
  };
}

// Auto-Split Bulk Text into Question Objects dynamically
function splitBulkPastedText(text, vaultType) {
  if (!text || !text.trim()) return [];

  // Normalize UTF-8 clean text
  const clean = cleanAndNormalizeUTF8(text);

  // Split by Question Numbering (e.g. "১.", "1.", "প্রশ্ন ১:", "Q1:", "[1]", "১।")
  const regexSplitter = /(?:^|\n+)(?=(?:(?:প্রশ্ন\s*|Question\s*|Q\s*)?[0-9১-৯]+[\.\)\:\-\|\।\]\s]|Q[0-9]+[:.]|\[[0-9১-৯]+\]))/i;
  let rawChunks = clean.split(regexSplitter).map(c => c.trim()).filter(Boolean);

  // If regex found only 1 chunk or failed, fallback to double line breaks
  if (rawChunks.length <= 1) {
    const doubleNewlineChunks = clean.split(/\n\s*\n+/).map(c => c.trim()).filter(Boolean);
    if (doubleNewlineChunks.length > 1) {
      rawChunks = doubleNewlineChunks;
    }
  }

  return rawChunks.map((chunk, idx) => {
    const lines = chunk.split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length === 0) return null;

    if (vaultType === 'MCQ') {
      return parseMCQChunk(lines, idx);
    } else if (vaultType === 'CQ') {
      return parseCQChunk(lines, idx);
    } else {
      return parseSQChunk(lines, idx);
    }
  }).filter(Boolean);
}

export default function SmartUploadReaderHub({ initialVaultTab = 'MCQ', onNavigateToMaker, onNavigateToOMR }) {
  const { lang } = useLanguage();

  // Active Vault: 'MCQ' | 'CQ' | 'SQ'
  const [activeVault, setActiveVault] = useState(initialVaultTab || 'MCQ');

  // Common Metadata State
  const [selectedClass, setSelectedClass] = useState(CLASSES_LIST[4]); // Class 10
  const [selectedSubject, setSelectedSubject] = useState(SUBJECTS_LIST[2]); // Physics
  const [selectedInstitution, setSelectedInstitution] = useState(INSTITUTIONS_LIST[0]); // Dhaka Board
  const [selectedYear, setSelectedYear] = useState('2026');
  const [selectedChapter, setSelectedChapter] = useState('');

  // Bulk Raw Text Input & Dynamic Staged Cards
  const [bulkInputText, setBulkInputText] = useState('');
  const [stagedQuestions, setStagedQuestions] = useState([]);

  // Status & Feedback State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState(null);

  // Stored Repository State - Initialized directly with localStorage or seeded questions so it is NEVER empty!
  const [repoQuestions, setRepoQuestions] = useState(() => {
    try {
      const saved = localStorage.getItem('nextgen_custom_repo_questions');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const existingIds = new Set(parsed.map(q => String(q.id || q.M_ID)));
          const missingSeeds = INITIAL_SEEDED_QUESTIONS.filter(s => !existingIds.has(String(s.id)));
          return [...parsed, ...missingSeeds];
        }
      }
    } catch (e) {}
    return INITIAL_SEEDED_QUESTIONS;
  });
  const [loadingRepo, setLoadingRepo] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchRepoQuestions();
  }, []);

  const fetchRepoQuestions = async () => {
    setLoadingRepo(true);
    try {
      console.log('[QuestionVault] 📡 Fetching questions from repository API...');
      const res = await questionRepositoryAPI.getQuestions();
      console.log('[QuestionVault] 📥 Raw API response:', res);

      let list = [];
      if (res?.data?.questions && Array.isArray(res.data.questions)) {
        list = res.data.questions;
      } else if (Array.isArray(res?.data)) {
        list = res.data;
      } else if (Array.isArray(res?.questions)) {
        list = res.questions;
      } else if (Array.isArray(res)) {
        list = res;
      }

      console.log(`[QuestionVault] ✅ Extracted ${list.length} questions from API payload.`);

      // Sync with localStorage cache & seeded repository questions so no questions are ever lost
      try {
        const localCache = JSON.parse(localStorage.getItem('nextgen_custom_repo_questions') || '[]');
        const existingIds = new Set(list.map(q => String(q.id || q.M_ID)));
        
        // Merge any locally saved questions not yet in API
        const localOnly = localCache.filter(q => !existingIds.has(String(q.id || q.M_ID)));
        if (localOnly.length > 0) {
          console.log(`[QuestionVault] 💾 Merging ${localOnly.length} local questions into state.`);
          list = [...localOnly, ...list];
        }

        // Always include seeded questions if repo is small
        const allCurrentIds = new Set(list.map(q => String(q.id || q.M_ID)));
        const missingSeeds = INITIAL_SEEDED_QUESTIONS.filter(s => !allCurrentIds.has(String(s.id)));
        if (missingSeeds.length > 0) {
          list = [...list, ...missingSeeds];
        }

        localStorage.setItem('nextgen_custom_repo_questions', JSON.stringify(list.slice(0, 500)));
      } catch (e) {
        console.warn('[QuestionVault] LocalStorage sync notice:', e);
      }

      console.log(`[QuestionVault] 📦 Total repository items set in state: ${list.length}`);
      setRepoQuestions(list);
    } catch (err) {
      console.warn('[QuestionVault] ⚠️ Could not load from API, reading from local cache / seed pool:', err);
      try {
        const localCache = JSON.parse(localStorage.getItem('nextgen_custom_repo_questions') || '[]');
        if (Array.isArray(localCache) && localCache.length > 0) {
          setRepoQuestions(localCache);
        } else {
          setRepoQuestions(INITIAL_SEEDED_QUESTIONS);
        }
      } catch (e) {
        setRepoQuestions(INITIAL_SEEDED_QUESTIONS);
      }
    } finally {
      setLoadingRepo(false);
    }
  };

  // Auto-split bulk pasted text with automatic Bijoy/Sutonny detection & instant conversion
  const handleProcessBulkText = (text = bulkInputText, vault = activeVault) => {
    let rawText = text;
    if (!rawText || !rawText.trim()) {
      setStagedQuestions([]);
      return;
    }

    // Auto-detect SutonnyMJ / Bijoy characters and automatically convert
    const isBijoyPattern = /([†‡‰¼½¾¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþÿĀāĂă«ª©™›œ§„¨¡]|GKwU|hvÎv|ïiæ|Kvi|mg‡q|cÖ_g|w¯’|wcQb|wbY©q|AwZµg|we‡kølY|K\.|L\.|M\.|N\.)/.test(rawText);

    if (isBijoyPattern) {
      rawText = convertBijoyToUnicode(rawText);
      setBulkInputText(rawText);
    }

    const cleaned = cleanAndNormalizeUTF8(rawText);
    const splitItems = splitBulkPastedText(cleaned, vault);
    setStagedQuestions(splitItems);
  };

  // Convert Bijoy/ANSI to Unicode Bengali in-place
  const handleConvertBijoy = () => {
    if (!bulkInputText.trim()) return;
    const converted = convertBijoyToUnicode(bulkInputText);
    setBulkInputText(converted);
    const splitItems = splitBulkPastedText(converted, activeVault);
    setStagedQuestions(splitItems);
    alert('✅ টেক্সট সফলভাবে ইউনিকোড বাংলা (UTF-8) ফন্টে রূপান্তরিত হয়েছে!');
  };

  // Switch vault tab
  const handleTabChange = (vault) => {
    setActiveVault(vault);
    setBulkInputText('');
    setStagedQuestions([]);
    setFeedbackMsg(null);
  };

  // Add 1 Empty Question Card
  const handleAddNewEmptyCard = () => {
    const newId = `${activeVault.toLowerCase()}-staged-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    if (activeVault === 'MCQ') {
      setStagedQuestions(prev => [
        ...prev,
        {
          id: newId,
          type: 'MCQ',
          question: '',
          options: ['বিকল্প ক', 'বিকল্প খ', 'বিকল্প গ', 'বিকল্প ঘ'],
          correctAnswer: 'ক',
          explanation: '',
          difficulty: 'MEDIUM',
          marks: 1
        }
      ]);
    } else if (activeVault === 'CQ') {
      setStagedQuestions(prev => [
        ...prev,
        {
          id: newId,
          type: 'CQ',
          question: '',
          subQuestions: {
            a: { q: '', marks: 1 },
            b: { q: '', marks: 2 },
            c: { q: '', marks: 3 },
            d: { q: '', marks: 4 }
          },
          diagramUrl: '',
          difficulty: 'MEDIUM',
          marks: 10
        }
      ]);
    } else {
      setStagedQuestions(prev => [
        ...prev,
        {
          id: newId,
          type: 'SQ',
          question: '',
          shortAnswer: '',
          difficulty: 'MEDIUM',
          marks: 2
        }
      ]);
    }
  };

  // Quick Demo Templates
  const handleLoadDemo = () => {
    if (activeVault === 'MCQ') {
      const demoMCQ = `১. বল ও সরণের গুণফলকে কী বলে?
(ক) ক্ষমতা  (খ) শক্তি  (গ) কাজ  (ঘ) বেগ
উত্তর: গ
ব্যাখ্যা: কাজ = বল × বলের অভিমুখে সরণ (W = F × s)।

২. কাজের আন্তর্জাতিক (SI) একক কোনটি?
ক) জুল (J)
খ) ওয়াট (W)
গ) নিউটন (N)
ঘ) প্যাসকেল (Pa)
উত্তর: ক

৩. ১ অশ্বক্ষমতা (1 Horsepower) সমান কত ওয়াট?
(ক) ৭৪৬ ওয়াট
(খ) ৫০০ ওয়াট
(গ) ১০০০ ওয়াট
(ঘ) ২৫০ ওয়াট
উত্তর: ক

৪. শক্তির সবচেয়ে সাধারণ রূপ কোনটি?
ক. গতিশক্তি
খ. যান্ত্রিক শক্তি
গ. তাপ শক্তি
ঘ. রাসায়নিক শক্তি
উত্তরঃ খ`;
      setBulkInputText(demoMCQ);
      handleProcessBulkText(demoMCQ, 'MCQ');
    } else if (activeVault === 'CQ') {
      const demoCQ = `১. উদ্দীপক: ৫০ কেজি ভরের একজন ব্যক্তি ৫ মিনিটে ৫০ মিটার উঁচু পাহাড়ে উঠলেন।
(ক) কাজ কাকে বলে? [১]
(খ) ধনাত্মক কাজ বলতে কী বোঝায়? [২]
(গ) ব্যক্তির দ্বারা কৃতকাজের পরিমাণ নির্ণয় করো। [৩]
(ঘ) ব্যক্তির ক্ষমতা নির্ণয় করে দক্ষতা বিশ্লেষণ করো। [৪]

২. উদ্দীপক: ২০ মিটার উচ্চতা থেকে একটি ২ কেজি ভরের বস্তুকে মুক্তভাবে নিচে ছেড়ে দেওয়া হলো।
(ক) বিভব শক্তি কী? [১]
(খ) শক্তির সংরক্ষণশীলতা নীতিটি ব্যাখ্যা করো। [২]
(গ) ভূমি স্পর্শ করার পূর্ব মুহূর্তে গতিশক্তি নির্ণয় করো। [৩]
(ঘ) উক্ত ঘটনায় শক্তির নিত্যতা নীতি রক্ষিত হয়েছে কি না গাণিতিকভাবে বিশ্লেষণ করো। [৪]`;
      setBulkInputText(demoCQ);
      handleProcessBulkText(demoCQ, 'CQ');
    } else {
      const demoSQ = `১. কাজ কাকে বলে? এর এসআই একক কী?
উত্তর: কোনো বস্তুর ওপর বল প্রয়োগে বলের দিকে সরণ ঘটলে বল ও সরণের গুণফলকে কাজ বলে। কাজের একক জুল (J)।

২. ১ ওয়াট ক্ষমতা বলতে কী বোঝায়?
উত্তর: প্রতি সেকেন্ডে ১ জুল পরিমাণ কাজ করার ক্ষমতাকে ১ ওয়াট (1 W) বলে।

৩. গতিশক্তি কাকে বলে?
উত্তর: কোনো গতিশীল বস্তু তার গতির জন্য কাজ করার যে সামর্থ্য অর্জন করে, তাকে গতিশক্তি বলে।`;
      setBulkInputText(demoSQ);
      handleProcessBulkText(demoSQ, 'SQ');
    }
  };

  // Update Individual Staged Card
  const updateStagedCard = (id, updates) => {
    setStagedQuestions(prev => prev.map(q => {
      if (q.id !== id) return q;
      const cleanUpdates = {};
      Object.keys(updates).forEach(k => {
        if (typeof updates[k] === 'string') {
          cleanUpdates[k] = cleanAndNormalizeUTF8(updates[k]);
        } else {
          cleanUpdates[k] = updates[k];
        }
      });
      return { ...q, ...cleanUpdates };
    }));
  };

  // Remove Individual Staged Card
  const removeStagedCard = (id) => {
    setStagedQuestions(prev => prev.filter(q => q.id !== id));
  };

  // Duplicate Individual Staged Card
  const duplicateStagedCard = (q) => {
    const newId = `${activeVault.toLowerCase()}-staged-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    const cloned = { ...JSON.parse(JSON.stringify(q)), id: newId };
    setStagedQuestions(prev => {
      const idx = prev.findIndex(item => item.id === q.id);
      if (idx === -1) return [...prev, cloned];
      const next = [...prev];
      next.splice(idx + 1, 0, cloned);
      return next;
    });
  };

  // Move Card Up
  const moveCardUp = (index) => {
    if (index === 0) return;
    setStagedQuestions(prev => {
      const next = [...prev];
      const temp = next[index - 1];
      next[index - 1] = next[index];
      next[index] = temp;
      return next;
    });
  };

  // Move Card Down
  const moveCardDown = (index) => {
    setStagedQuestions(prev => {
      if (index >= prev.length - 1) return prev;
      const next = [...prev];
      const temp = next[index + 1];
      next[index + 1] = next[index];
      next[index] = temp;
      return next;
    });
  };

  // Save ALL Staged Questions to Repository Database cleanly at once
  const handleSaveAllToRepository = async () => {
    if (stagedQuestions.length === 0) {
      alert('ভাণ্ডারে জমা করার জন্য কোনো প্রশ্ন পাওয়া যায়নি। অনুগ্রহ করে প্রশ্ন পেস্ট বা টাইপ করুন।');
      return;
    }

    // Validate that questions are not empty
    const emptyCount = stagedQuestions.filter(q => !q.question || !q.question.trim()).length;
    if (emptyCount > 0) {
      if (!window.confirm(`${emptyCount}টি প্রশ্নের বিবরণ ফাঁকা রয়েছে। আপনি কি তবুও জমা করতে চান?`)) {
        return;
      }
    }

    setIsSubmitting(true);
    setFeedbackMsg(null);

    try {
      const payloadQuestions = stagedQuestions.map((q, idx) => ({
        id: `${activeVault.toLowerCase()}-${Date.now()}-${idx}-${Math.random().toString(36).substr(2, 4)}`,
        type: q.type || activeVault,
        question: cleanAndNormalizeUTF8(q.question || `প্রশ্ন ${idx + 1}`),
        stem: cleanAndNormalizeUTF8(q.question || ''),
        options: Array.isArray(q.options) ? q.options.map(opt => cleanAndNormalizeUTF8(opt)) : [],
        correctAnswer: q.correctAnswer || 'ক',
        explanation: cleanAndNormalizeUTF8(q.explanation || ''),
        subQuestions: q.subQuestions || null,
        shortAnswer: cleanAndNormalizeUTF8(q.shortAnswer || ''),
        marks: q.marks || (activeVault === 'CQ' ? 10 : activeVault === 'SQ' ? 2 : 1),
        difficulty: q.difficulty || 'MEDIUM',
        diagramUrl: q.diagramUrl || null,
        boardOrInstitute: selectedInstitution,
        institutionOrBoard: selectedInstitution,
        year: selectedYear,
        subject: selectedSubject,
        book: selectedSubject,
        class: selectedClass,
        className: selectedClass,
        chapter: selectedChapter ? cleanAndNormalizeUTF8(selectedChapter) : null
      }));

      const payload = {
        questions: payloadQuestions,
        category: selectedInstitution,
        subject: selectedSubject,
        term: selectedYear,
        className: selectedClass,
        book: selectedSubject,
        institutionOrBoard: selectedInstitution,
        year: selectedYear,
        chapter: selectedChapter ? cleanAndNormalizeUTF8(selectedChapter) : null,
        hasChapter: !!selectedChapter,
        metadata: {
          className: selectedClass,
          book: selectedSubject,
          category: selectedInstitution,
          subject: selectedSubject,
          term: selectedYear,
          institutionOrBoard: selectedInstitution,
          year: selectedYear,
          chapter: selectedChapter ? cleanAndNormalizeUTF8(selectedChapter) : null,
          badge: '[' + selectedInstitution + ' - \'' + selectedYear.slice(-2) + ']'
        }
      };

      console.log('[BulkManualVault] 🚀 Saving All to Repository:', payload);
      const res = await questionRepositoryAPI.uploadAndTrain(payload);
      console.log('[BulkManualVault] 📥 Save Response:', res);

      if (res?.success) {
        const savedCount = res.data?.savedCount || res.data?.count || payloadQuestions.length;
        const msg = `🎉 সফলভাবে মোট ${savedCount}টি ${activeVault} প্রশ্ন কেন্দ্রীয় রিপোজিটরিতে জমা ও সংরক্ষিত হয়েছে!`;
        setFeedbackMsg({ type: 'success', text: msg });
        alert(msg);

        // Optimistic State & Local Storage Sync - Immediate Render!
        try {
          const currentLocal = JSON.parse(localStorage.getItem('nextgen_custom_repo_questions') || '[]');
          const updatedLocal = [...payloadQuestions, ...currentLocal];
          localStorage.setItem('nextgen_custom_repo_questions', JSON.stringify(updatedLocal.slice(0, 500)));
        } catch (e) {}

        // Instantly update UI state with newly saved questions so table never shows empty!
        setRepoQuestions(prev => {
          const existingIds = new Set(prev.map(q => String(q.id || q.M_ID)));
          const newItems = payloadQuestions.filter(q => !existingIds.has(String(q.id)));
          const combined = [...newItems, ...prev];
          console.log('[BulkManualVault] ⚡ Optimistic UI update complete. New total items:', combined.length);
          return combined;
        });

        // Reset staged list & bulk input for smooth next batch
        setBulkInputText('');
        setStagedQuestions([]);

        // Re-fetch from server to sync backend state
        await fetchRepoQuestions();
      } else {
        const err = res?.error?.message || res?.message || 'সংরক্ষণ ব্যর্থ হয়েছে।';
        setFeedbackMsg({ type: 'error', text: err });
        alert(`সংরক্ষণ ব্যর্থ: ${err}`);
      }
    } catch (err) {
      console.error('[BulkManualVault] Save Exception:', err);
      const fatal = err.message || 'সার্ভারে সমস্যা হয়েছে।';
      setFeedbackMsg({ type: 'error', text: fatal });
      alert(`সার্ভার ত্রুটি: ${fatal}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete from Stored Repository
  const handleDeleteItem = async (id) => {
    if (!window.confirm('আপনি কি নিশ্চিত যে এই প্রশ্নটি ভাণ্ডার থেকে মুছে ফেলতে চান?')) return;
    try {
      const res = await questionRepositoryAPI.deleteQuestion(id);
      if (res?.success) {
        setRepoQuestions(prev => {
          const updated = prev.filter(q => String(q?.id || q?.M_ID) !== String(id));
          try {
            localStorage.setItem('nextgen_custom_repo_questions', JSON.stringify(updated.slice(0, 500)));
          } catch (e) {}
          return updated;
        });
      } else {
        alert('মুছে ফেলতে সমস্যা হয়েছে: ' + (res?.error?.message || 'ত্রুটি'));
      }
    } catch (err) {
      alert('মুছে ফেলতে সমস্যা হয়েছে: ' + err.message);
    }
  };

  // Filtered Questions strictly for active vault with case-insensitive and key-mismatched normalization
  const vaultQuestions = useMemo(() => {
    const safeList = Array.isArray(repoQuestions) ? repoQuestions : [];
    console.log('[QuestionVaultViewer] 🔍 Evaluating vault questions filter. Total in state:', safeList.length, 'Active Tab:', activeVault);

    const filtered = safeList.filter(q => {
      if (!q) return false;

      // Normalize type (case-insensitive, fallback to options/subQuestions/shortAnswer)
      const rawType = String(q?.type || '').toUpperCase().trim();
      const hasOptions = Array.isArray(q?.options) && q.options.length > 0;
      const hasSubQs = q?.subQuestions && Object.keys(q.subQuestions).length > 0;
      const hasShortAns = Boolean(q?.shortAnswer || q?.answer);

      let isTargetType = false;
      if (activeVault === 'MCQ') {
        isTargetType = rawType === 'MCQ' || rawType === 'MULTIPLE_CHOICE' || (!rawType && hasOptions) || (rawType !== 'CQ' && rawType !== 'SQ' && rawType !== 'SHORT' && hasOptions);
      } else if (activeVault === 'CQ') {
        isTargetType = rawType === 'CQ' || rawType === 'CREATIVE' || hasSubQs;
      } else if (activeVault === 'SQ') {
        isTargetType = rawType === 'SQ' || rawType === 'SHORT' || rawType === 'SHORT_QUESTION' || (!hasOptions && !hasSubQs && (hasShortAns || (rawType !== 'MCQ' && rawType !== 'CQ')));
      }

      const qText = String(q?.question || q?.stem || '').toLowerCase();
      const qInst = String(q?.institutionOrBoard || q?.boardOrInstitute || q?.category || '').toLowerCase();
      const qBook = String(q?.book || q?.subject || '').toLowerCase();
      const qClass = String(q?.className || q?.class || '').toLowerCase();
      const qBadge = String(q?.badge || '').toLowerCase();
      const search = (searchTerm || '').toLowerCase().trim();

      const matchesSearch = !search || qText.includes(search) || qInst.includes(search) || qBook.includes(search) || qClass.includes(search) || qBadge.includes(search);
      return isTargetType && matchesSearch;
    });

    console.log(`[QuestionVaultViewer] 🎯 Filtered questions count for ${activeVault}:`, filtered.length, filtered);
    return filtered;
  }, [repoQuestions, activeVault, searchTerm]);

  return (
    <div className="utf8-bangla-root space-y-6 max-w-7xl mx-auto px-2 sm:px-4 py-2">
      {/* Universal UTF-8 Bengali Font Enforce Style */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@300;400;500;600;700&family=Noto+Sans+Bengali:wght@400;500;600;700;800&family=Noto+Serif+Bengali:wght@400;600;700&family=Tiro+Bangla:ital@0;1&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Outfit:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap');

        .utf8-bangla-root,
        .utf8-bangla-root input,
        .utf8-bangla-root textarea,
        .utf8-bangla-root select,
        .utf8-bangla-root button,
        .utf8-bangla-root table,
        .utf8-bangla-root p,
        .utf8-bangla-root span,
        .utf8-bangla-root div,
        .utf8-bangla-root h1,
        .utf8-bangla-root h2,
        .utf8-bangla-root h3,
        .utf8-bangla-root h4,
        .utf8-bangla-root label,
        .utf8-bangla-root strong,
        .utf8-bangla-root b {
          font-family: 'Hind Siliguri', 'Noto Sans Bengali', 'SolaimanLipi', 'Kalpurush', 'Nikosh', 'NikoshBAN', 'Siyam Rupali', 'Vrinda', 'SutonnyMJ', 'AponaLohit', 'Tiro Bangla', 'Noto Serif Bengali', 'Bangla', 'Shonar Bangla', 'Plus Jakarta Sans', 'Outfit', 'Inter', 'Segoe UI', Roboto, -apple-system, BlinkMacSystemFont, system-ui, sans-serif !important;
          font-feature-settings: 'kern' 1, 'liga' 1, 'calt' 1, 'clig' 1, 'ccmp' 1;
          text-rendering: optimizeLegibility;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        /* Math & Equation Font Isolation */
        .utf8-bangla-root .katex,
        .utf8-bangla-root .katex *,
        .katex,
        .katex * {
          font-family: KaTeX_Main, KaTeX_Math, 'Times New Roman', 'Cambria Math', 'STIX Two Math', serif !important;
          text-rendering: auto !important;
        }

        .utf8-bangla-input {
          font-family: 'Hind Siliguri', 'Noto Sans Bengali', 'SolaimanLipi', 'Kalpurush', 'Nikosh', 'NikoshBAN', 'Siyam Rupali', 'Vrinda', 'SutonnyMJ', 'AponaLohit', 'Tiro Bangla', 'Noto Serif Bengali', 'Segoe UI', sans-serif !important;
          line-height: 1.75 !important;
          letter-spacing: 0.01em;
          text-rendering: optimizeLegibility;
          font-feature-settings: 'kern' 1, 'liga' 1, 'calt' 1, 'clig' 1, 'ccmp' 1;
        }
      `}</style>

      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-7 text-white shadow-xl relative overflow-hidden border border-indigo-500/30">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-8 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="inline-flex items-center space-x-2 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md">
              <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>বাল্ক স্মার্ট পেস্ট • ইউনিভার্সাল বাংলা UTF-8 এনফোর্সড</span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-white flex items-center gap-2.5">
              <span>ম্যানুয়াল প্রশ্ন ভাণ্ডার সংগ্রহশালা</span>
              <span className="text-xs sm:text-sm font-bold bg-indigo-600/80 text-indigo-100 px-2.5 py-0.5 rounded-lg border border-indigo-400/30">
                UTF-8 Safe Vault
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              একসাথে বহু প্রশ্ন পেস্ট করুন। সোলাইমানলিপি, কালপুরুষ, ইউনিকোড কিংবা বিজয় ফন্ট সব ধরনের বাংলা যুক্তবর্ণ নির্বিঘ্নে রেন্ডার হবে।
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {onNavigateToMaker && (
              <button
                type="button"
                onClick={onNavigateToMaker}
                className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-2xl shadow-lg shadow-emerald-600/30 transition-all cursor-pointer flex items-center space-x-2 border border-emerald-400/30 hover:scale-[1.02]"
              >
                <FileText className="w-4 h-4" />
                <span>প্রশ্নপত্র বিল্ডারে যান ➔</span>
              </button>
            )}
            {onNavigateToOMR && (
              <button
                type="button"
                onClick={onNavigateToOMR}
                className="px-4 py-2.5 bg-indigo-600/80 hover:bg-indigo-600 text-white font-bold text-xs rounded-2xl border border-indigo-400/30 transition-all cursor-pointer flex items-center space-x-1.5"
              >
                <CheckSquare className="w-4 h-4" />
                <span>OMR স্ক্যানার</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 3 Dedicated Vault Selector Tabs */}
      <div className="flex items-center gap-2 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/80 shadow-xs flex-wrap">
        <button
          type="button"
          onClick={() => handleTabChange('MCQ')}
          className={'px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center space-x-2 cursor-pointer ' + (
            activeVault === 'MCQ'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 ring-2 ring-indigo-400/40'
              : 'text-slate-700 hover:bg-white hover:text-indigo-600'
          )}
        >
          <BookMarked className="w-4 h-4" />
          <span>🔘 ১. বহুনির্বাচনী ভাণ্ডার (MCQ Vault)</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('CQ')}
          className={'px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center space-x-2 cursor-pointer ' + (
            activeVault === 'CQ'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30 ring-2 ring-purple-400/40'
              : 'text-slate-700 hover:bg-white hover:text-purple-600'
          )}
        >
          <Layers className="w-4 h-4" />
          <span>📑 ২. সৃজনশীল ভাণ্ডার (CQ Vault)</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('SQ')}
          className={'px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center space-x-2 cursor-pointer ' + (
            activeVault === 'SQ'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 ring-2 ring-emerald-400/40'
              : 'text-slate-700 hover:bg-white hover:text-emerald-600'
          )}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>📝 ৩. সংক্ষিপ্ত প্রশ্ন ভাণ্ডার (SQ Vault)</span>
        </button>
      </div>

      {/* Main Grid: Left Side Bulk Paste & Interactive Editor (7 Cols), Right Side Stored Repo (5 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Metadata, Bulk Paste Textarea & Interactive Staged Cards */}
        <div className="lg:col-span-7 space-y-5">
          {/* Metadata Card */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-xs text-slate-800 flex items-center gap-2 uppercase tracking-wider">
                <Sliders className="w-4 h-4 text-indigo-600" />
                <span>শ্রেণি, বিষয় ও প্রতিষ্ঠান সিলেক্ট করুন</span>
              </h3>
              <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md border border-indigo-200">
                UTF-8 এনকোডেড
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">শ্রেণি (Class):</label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="utf8-bangla-input w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  {CLASSES_LIST.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">বিষয় (Subject):</label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="utf8-bangla-input w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  {SUBJECTS_LIST.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">বোর্ড / প্রতিষ্ঠান (Source):</label>
                <select
                  value={selectedInstitution}
                  onChange={(e) => setSelectedInstitution(e.target.value)}
                  className="utf8-bangla-input w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  {INSTITUTIONS_LIST.map(inst => <option key={inst} value={inst}>{inst}</option>)}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">সাল / টার্ম (Year):</label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="utf8-bangla-input w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  {YEARS_LIST.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="text-[11px] font-bold text-slate-600 block mb-1">অধ্যায় / টপিক (ঐচ্ছিক):</label>
                <input
                  type="text"
                  dir="ltr"
                  lang="bn"
                  value={selectedChapter}
                  onChange={(e) => setSelectedChapter(cleanAndNormalizeUTF8(e.target.value))}
                  placeholder="যেমন: অধ্যায় ৪: কাজ, ক্ষমতা ও শক্তি"
                  className="utf8-bangla-input w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Bulk Paste Textarea Card */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-sm space-y-3 relative">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <label className="text-xs sm:text-sm font-bold text-slate-800 flex items-center space-x-1.5">
                <FileText className="w-4 h-4 text-indigo-600" />
                <span>এখানে একসাথে একাধিক {activeVault} প্রশ্ন পেস্ট করুন (UTF-8 বাংলা):</span>
              </label>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={handleConvertBijoy}
                  title="বিজয় বা পুরানো ফন্টের টেক্সট ইউনিকোডে রূপান্তর করুন"
                  className="text-[11px] font-bold text-teal-700 hover:text-teal-800 bg-teal-50 hover:bg-teal-100 px-2.5 py-1 rounded-xl transition-all cursor-pointer flex items-center space-x-1 border border-teal-200"
                >
                  <Type className="w-3.5 h-3.5" />
                  <span>বিজয় ➔ ইউনিকোড ফিক্স</span>
                </button>

                <button
                  type="button"
                  onClick={handleLoadDemo}
                  className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1 rounded-xl transition-all cursor-pointer flex items-center space-x-1 border border-indigo-200"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span>+ ডেমো {activeVault}</span>
                </button>
              </div>
            </div>

            <textarea
              rows={6}
              dir="ltr"
              lang="bn"
              spellCheck="false"
              autoCapitalize="none"
              autoCorrect="off"
              value={bulkInputText}
              onChange={(e) => {
                const val = cleanAndNormalizeUTF8(e.target.value);
                setBulkInputText(val);
                handleProcessBulkText(val, activeVault);
              }}
              placeholder={
                activeVault === 'MCQ'
                  ? `এখানে ১ বা একাধিক MCQ প্রশ্ন পেস্ট করুন...\n\n১. বলের এসআই একক কী?\n(ক) জুল (খ) নিউটন (গ) ওয়াট (ঘ) প্যাসকেল\nউত্তর: খ\nব্যাখ্যা: বলের একক নিউটন।`
                  : activeVault === 'CQ'
                  ? `এখানে সৃজনশীল প্রশ্ন পেস্ট করুন...\n\n১. উদ্দীপক: একটি গাড়ি স্থির অবস্থান থেকে যাত্রা শুরু করে...\n(ক) ত্বরণ কাকে বলে? [১]\n(খ) সুষম বেগ বলতে কী বোঝায়? [২]\n(গ) গাড়িটির ত্বরণ নির্ণয় করো। [৩]\n(ঘ) মোট অতিক্রান্ত দূরত্ব বিশ্লেষণ করো। [৪]`
                  : `এখানে সংক্ষিপ্ত প্রশ্ন পেস্ট করুন...\n\n১. কাজ কাকে বলে? এর একক কী?\nউত্তর: বল ও সরণের গুণফলকে কাজ বলে। একক জুল (J)।`
              }
              className="utf8-bangla-input w-full p-4 bg-slate-50 border border-slate-200/90 rounded-2xl text-xs sm:text-sm font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none leading-relaxed tracking-wide"
            />

            <div className="flex items-center justify-between pt-1 flex-wrap gap-2">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-slate-600">
                  সনাক্তকৃত প্রশ্ন: <strong className="text-indigo-600 font-black text-sm">{stagedQuestions.length}</strong> টি
                </span>
                {stagedQuestions.length > 0 && (
                  <span className="inline-flex items-center space-x-1 text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>ইউনিকোড প্রস্তুত</span>
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => { setBulkInputText(''); setStagedQuestions([]); }}
                  className="px-3 py-1.5 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl cursor-pointer transition-colors"
                >
                  ক্লিয়ার
                </button>
                <button
                  type="button"
                  onClick={() => handleProcessBulkText(bulkInputText, activeVault)}
                  className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-xl cursor-pointer flex items-center space-x-1 border border-indigo-200 transition-all"
                  title="পুনরায় পার্স করুন"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>স্মার্ট পার্স</span>
                </button>
                <button
                  type="button"
                  onClick={handleAddNewEmptyCard}
                  className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl cursor-pointer flex items-center space-x-1 shadow-sm transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ ১টি ফাঁকা প্রশ্ন</span>
                </button>
              </div>
            </div>
          </div>

          {/* Interactive Parsed Staged Cards List */}
          {stagedQuestions.length > 0 && (
            <div className="space-y-4">
              {/* Sticky Action Bar */}
              <div className="sticky top-2 z-20 flex items-center justify-between bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-indigo-200 shadow-lg shadow-indigo-500/10 flex-wrap gap-3">
                <div className="flex items-center space-x-2.5">
                  <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-sm shadow-md">
                    {stagedQuestions.length}
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-slate-900">
                      ইন্টারেক্টিভ প্রশ্ন কার্ড তালিকা ({stagedQuestions.length} টি)
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      {activeVault === 'MCQ'
                        ? 'নিচে যেকোনো অপশনে ক্লিক করে তাৎক্ষণিক সঠিক উত্তর সিলেক্ট করুন'
                        : 'নিচে প্রশ্ন ও উপ-প্রশ্নগুলো চেক বা এডিট করুন'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSaveAllToRepository}
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs sm:text-sm rounded-xl shadow-lg shadow-emerald-600/30 flex items-center space-x-2 transition-all cursor-pointer disabled:opacity-50 hover:scale-[1.02]"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>জমা হচ্ছে...</span>
                    </>
                  ) : (
                    <>
                      <Database className="w-4 h-4" />
                      <span>সব প্রশ্ন ভাণ্ডারে জমা করুন ({stagedQuestions.length})</span>
                    </>
                  )}
                </button>
              </div>

              {/* Cards Loop */}
              <div className="space-y-4">
                {stagedQuestions.map((q, qIdx) => (
                  <div
                    key={q.id}
                    className="p-5 bg-white border border-slate-200/90 rounded-3xl shadow-xs space-y-4 relative group hover:border-indigo-400 hover:shadow-md transition-all"
                  >
                    {/* Card Top Row: Number, Type Badge, Difficulty, Controls */}
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3 flex-wrap gap-2">
                      <div className="flex items-center space-x-2">
                        <span className="w-7 h-7 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-xs shadow-xs">
                          {qIdx + 1}
                        </span>
                        <span className={'px-2.5 py-0.5 rounded-lg font-bold text-xs ' + (
                          activeVault === 'MCQ' ? 'bg-indigo-100 text-indigo-800' : activeVault === 'CQ' ? 'bg-purple-100 text-purple-800' : 'bg-emerald-100 text-emerald-800'
                        )}>
                          {activeVault === 'MCQ' ? '🔘 বহুনির্বাচনী (MCQ)' : activeVault === 'CQ' ? '📑 সৃজনশীল (CQ)' : '📝 সংক্ষিপ্ত (SQ)'}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400">
                          ID: {q.id.slice(-6)}
                        </span>
                      </div>

                      <div className="flex items-center space-x-1.5">
                        {/* Difficulty Selector */}
                        <select
                          value={q.difficulty || 'MEDIUM'}
                          onChange={(e) => updateStagedCard(q.id, { difficulty: e.target.value })}
                          className="utf8-bangla-input text-[11px] font-bold bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-slate-700"
                        >
                          <option value="EASY">সহজ (Easy)</option>
                          <option value="MEDIUM">মাঝারি (Medium)</option>
                          <option value="HARD">কঠিন (Hard)</option>
                        </select>

                        {/* Reorder Buttons */}
                        <button
                          type="button"
                          onClick={() => moveCardUp(qIdx)}
                          disabled={qIdx === 0}
                          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg disabled:opacity-30 cursor-pointer"
                          title="উপরে নিন"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveCardDown(qIdx)}
                          disabled={qIdx === stagedQuestions.length - 1}
                          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg disabled:opacity-30 cursor-pointer"
                          title="নিচে নিন"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>

                        {/* Duplicate Button */}
                        <button
                          type="button"
                          onClick={() => duplicateStagedCard(q)}
                          className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg cursor-pointer"
                          title="ডুপ্লিকেট করুন"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={() => removeStagedCard(q.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors"
                          title="এই প্রশ্নটি বাদ দিন"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Question Title / Stem Input */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[11px] font-bold text-slate-700">
                          {activeVault === 'CQ' ? 'উদ্দীপক / মূল অনুচ্ছেদ (Stem):' : 'প্রশ্নের বিবরণ:'}
                        </label>
                      </div>
                      <textarea
                        rows={2}
                        dir="ltr"
                        lang="bn"
                        value={q.question}
                        onChange={(e) => updateStagedCard(q.id, { question: cleanAndNormalizeUTF8(e.target.value) })}
                        placeholder="এখানে প্রশ্নের বিবরণ বা উদ্দীপক লিখুন..."
                        className="utf8-bangla-input w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none leading-relaxed"
                      />
                    </div>

                    {/* INTERACTIVE MCQ OPTIONS & 1-CLICK ANSWER SELECTOR */}
                    {activeVault === 'MCQ' && (
                      <div className="space-y-3 pt-1">
                        {/* Quick Answer Selector Bar */}
                        <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-2xl border border-slate-200/80 flex-wrap gap-2">
                          <div className="flex items-center space-x-1.5">
                            <span className="text-[11px] font-bold text-slate-700">১-ক্লিক সঠিক উত্তর:</span>
                            <span className="text-[10px] text-slate-500">(সরাসরি প্রেস করুন)</span>
                          </div>

                          <div className="flex items-center space-x-1.5">
                            {['ক', 'খ', 'গ', 'ঘ'].map((key) => {
                              const isSelected = (q.correctAnswer || 'ক') === key;
                              return (
                                <button
                                  key={key}
                                  type="button"
                                  onClick={() => updateStagedCard(q.id, { correctAnswer: key })}
                                  className={'px-3 py-1 rounded-xl font-black text-xs transition-all cursor-pointer flex items-center space-x-1 ' + (
                                    isSelected
                                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 ring-2 ring-emerald-400 scale-105'
                                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-emerald-50 hover:text-emerald-700'
                                  )}
                                >
                                  {isSelected && <Check className="w-3.5 h-3.5" />}
                                  <span>({key})</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* 4 Interactive Option Cards Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {['ক', 'খ', 'গ', 'ঘ'].map((optKey, oIdx) => {
                            const isSelected = (q.correctAnswer || 'ক') === optKey;
                            const optVal = Array.isArray(q.options) ? (q.options[oIdx] || '') : '';

                            return (
                              <div
                                key={optKey}
                                className={'p-2.5 rounded-2xl border transition-all flex items-center space-x-2.5 ' + (
                                  isSelected
                                    ? 'bg-emerald-50/90 border-emerald-400 ring-2 ring-emerald-500/20 shadow-xs'
                                    : 'bg-slate-50/80 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                                )}
                              >
                                {/* 1-Click Select Button */}
                                <button
                                  type="button"
                                  onClick={() => updateStagedCard(q.id, { correctAnswer: optKey })}
                                  className={'w-7 h-7 rounded-xl font-black text-xs flex items-center justify-center shrink-0 transition-all cursor-pointer ' + (
                                    isSelected
                                      ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-300'
                                      : 'bg-white text-slate-600 border border-slate-300 hover:bg-emerald-100 hover:text-emerald-800'
                                  )}
                                  title={`(${optKey}) কে সঠিক উত্তর হিসেবে নির্ধারণ করুন`}
                                >
                                  {isSelected ? <Check className="w-4 h-4" /> : optKey}
                                </button>

                                {/* Option Text Input */}
                                <div className="flex-1">
                                  <input
                                    type="text"
                                    dir="ltr"
                                    lang="bn"
                                    value={optVal}
                                    onChange={(e) => {
                                      const nextOpts = [...(q.options || ['বিকল্প ক', 'বিকল্প খ', 'বিকল্প গ', 'বিকল্প ঘ'])];
                                      nextOpts[oIdx] = cleanAndNormalizeUTF8(e.target.value);
                                      updateStagedCard(q.id, { options: nextOpts });
                                    }}
                                    placeholder={`অপশন (${optKey}) লিখুন`}
                                    className="utf8-bangla-input w-full bg-transparent border-none text-xs sm:text-sm text-slate-800 font-semibold focus:outline-none"
                                  />
                                </div>

                                {isSelected && (
                                  <span className="text-[10px] font-black text-emerald-700 bg-emerald-100/90 px-2 py-0.5 rounded-md shrink-0">
                                    সঠিক ✓
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>

                        {/* Explanation Input */}
                        <div className="pt-1">
                          <label className="text-[10px] font-bold text-slate-500 block mb-0.5">ব্যাখ্যা বা সমাধান (ঐচ্ছিক):</label>
                          <input
                            type="text"
                            dir="ltr"
                            lang="bn"
                            value={q.explanation || ''}
                            onChange={(e) => updateStagedCard(q.id, { explanation: cleanAndNormalizeUTF8(e.target.value) })}
                            placeholder="ব্যাখ্যা বা প্রাসঙ্গিক নোট লিখুন (ঐচ্ছিক)"
                            className="utf8-bangla-input w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                          />
                        </div>
                      </div>
                    )}

                    {/* CQ SUB-QUESTIONS INPUTS */}
                    {activeVault === 'CQ' && q.subQuestions && (
                      <div className="space-y-3 p-4 bg-purple-50/40 rounded-2xl border border-purple-200/70">
                        <div className="grid grid-cols-1 gap-2.5 text-xs">
                          <div>
                            <label className="text-[11px] font-bold text-purple-950 flex items-center justify-between mb-1">
                              <span>(ক) জ্ঞানমূলক প্রশ্ন:</span>
                              <span className="text-[10px] bg-purple-200 text-purple-900 px-2 py-0.5 rounded-md font-black">১ নম্বর</span>
                            </label>
                            <input
                              type="text"
                              dir="ltr"
                              lang="bn"
                              value={q.subQuestions.a?.q || q.subQuestions.a || ''}
                              onChange={(e) => updateStagedCard(q.id, {
                                subQuestions: { ...q.subQuestions, a: { q: cleanAndNormalizeUTF8(e.target.value), marks: 1 } }
                              })}
                              placeholder="(ক) জ্ঞানমূলক প্রশ্ন লিখুন..."
                              className="utf8-bangla-input w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 font-medium focus:ring-2 focus:ring-purple-500 focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="text-[11px] font-bold text-purple-950 flex items-center justify-between mb-1">
                              <span>(খ) অনুধাবনমূলক প্রশ্ন:</span>
                              <span className="text-[10px] bg-purple-200 text-purple-900 px-2 py-0.5 rounded-md font-black">২ নম্বর</span>
                            </label>
                            <input
                              type="text"
                              dir="ltr"
                              lang="bn"
                              value={q.subQuestions.b?.q || q.subQuestions.b || ''}
                              onChange={(e) => updateStagedCard(q.id, {
                                subQuestions: { ...q.subQuestions, b: { q: cleanAndNormalizeUTF8(e.target.value), marks: 2 } }
                              })}
                              placeholder="(খ) অনুধাবনমূলক প্রশ্ন লিখুন..."
                              className="utf8-bangla-input w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 font-medium focus:ring-2 focus:ring-purple-500 focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="text-[11px] font-bold text-purple-950 flex items-center justify-between mb-1">
                              <span>(গ) প্রয়োগমূলক প্রশ্ন:</span>
                              <span className="text-[10px] bg-purple-200 text-purple-900 px-2 py-0.5 rounded-md font-black">৩ নম্বর</span>
                            </label>
                            <input
                              type="text"
                              dir="ltr"
                              lang="bn"
                              value={q.subQuestions.c?.q || q.subQuestions.c || ''}
                              onChange={(e) => updateStagedCard(q.id, {
                                subQuestions: { ...q.subQuestions, c: { q: cleanAndNormalizeUTF8(e.target.value), marks: 3 } }
                              })}
                              placeholder="(গ) প্রয়োগমূলক প্রশ্ন লিখুন..."
                              className="utf8-bangla-input w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 font-medium focus:ring-2 focus:ring-purple-500 focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="text-[11px] font-bold text-purple-950 flex items-center justify-between mb-1">
                              <span>(ঘ) উচ্চতর দক্ষতামূলক প্রশ্ন:</span>
                              <span className="text-[10px] bg-purple-200 text-purple-900 px-2 py-0.5 rounded-md font-black">৪ নম্বর</span>
                            </label>
                            <input
                              type="text"
                              dir="ltr"
                              lang="bn"
                              value={q.subQuestions.d?.q || q.subQuestions.d || ''}
                              onChange={(e) => updateStagedCard(q.id, {
                                subQuestions: { ...q.subQuestions, d: { q: cleanAndNormalizeUTF8(e.target.value), marks: 4 } }
                              })}
                              placeholder="(ঘ) উচ্চতর দক্ষতামূলক প্রশ্ন লিখুন..."
                              className="utf8-bangla-input w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 font-medium focus:ring-2 focus:ring-purple-500 focus:outline-none"
                            />
                          </div>
                        </div>

                        {/* Diagram URL */}
                        <div className="pt-1">
                          <label className="text-[10px] font-bold text-slate-500 block mb-0.5">চিত্র / ডায়াগ্রামের লিঙ্ক (ঐচ্ছিক):</label>
                          <input
                            type="text"
                            value={q.diagramUrl || ''}
                            onChange={(e) => updateStagedCard(q.id, { diagramUrl: e.target.value })}
                            placeholder="https://example.com/diagram.png"
                            className="utf8-bangla-input w-full p-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                          />
                        </div>
                      </div>
                    )}

                    {/* SQ SHORT ANSWER INPUT */}
                    {activeVault === 'SQ' && (
                      <div className="space-y-1.5 pt-1">
                        <label className="text-[11px] font-bold text-emerald-900 flex items-center justify-between">
                          <span>উত্তর / সমাধান (Short Answer):</span>
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md font-black">
                            {q.marks || 2} নম্বর
                          </span>
                        </label>
                        <textarea
                          rows={2}
                          dir="ltr"
                          lang="bn"
                          value={q.shortAnswer || ''}
                          onChange={(e) => updateStagedCard(q.id, { shortAnswer: cleanAndNormalizeUTF8(e.target.value) })}
                          placeholder="এখানে সংক্ষিপ্ত উত্তর বা সমাধান লিখুন..."
                          className="utf8-bangla-input w-full p-3 bg-emerald-50/50 border border-emerald-200 rounded-xl text-xs sm:text-sm text-slate-800 font-medium focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none leading-relaxed"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Bottom Large Save Button */}
              <div className="flex items-center justify-between bg-white p-4 rounded-3xl border border-slate-200 shadow-sm flex-wrap gap-3">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-slate-600">
                    মোট প্রস্তুত প্রশ্ন: <strong className="text-indigo-600 font-black">{stagedQuestions.length}</strong> টি
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleSaveAllToRepository}
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs sm:text-sm rounded-2xl shadow-xl shadow-emerald-600/30 flex items-center space-x-2 transition-all cursor-pointer disabled:opacity-50 hover:scale-[1.02]"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>ভাণ্ডারে সংরক্ষিত হচ্ছে...</span>
                    </>
                  ) : (
                    <>
                      <Database className="w-4 h-4" />
                      <span>সব প্রশ্ন ভাণ্ডারে জমা করুন ({stagedQuestions.length} টি)</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Stored Questions Repository for Active Vault (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 flex-wrap gap-2">
              <div className="flex items-center space-x-2">
                <Database className="w-4 h-4 text-indigo-600" />
                <h3 className="font-black text-xs sm:text-sm text-slate-900 uppercase tracking-wider">
                  {activeVault === 'MCQ' && `সংরক্ষিত MCQ ভাণ্ডার (${vaultQuestions.length} টি)`}
                  {activeVault === 'CQ' && `সংরক্ষিত CQ ভাণ্ডার (${vaultQuestions.length} টি)`}
                  {activeVault === 'SQ' && `সংরক্ষিত SQ ভাণ্ডার (${vaultQuestions.length} টি)`}
                </h3>
              </div>
              <button
                type="button"
                onClick={fetchRepoQuestions}
                disabled={loadingRepo}
                className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors flex items-center space-x-1 cursor-pointer"
              >
                <RefreshCw className={'w-3.5 h-3.5 ' + (loadingRepo ? 'animate-spin' : '')} />
                <span>রিফ্রেশ</span>
              </button>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                dir="ltr"
                lang="bn"
                value={searchTerm}
                onChange={(e) => setSearchTerm(cleanAndNormalizeUTF8(e.target.value))}
                placeholder="প্রশ্ন, বিষয় বা বোর্ড দিয়ে খুঁজুন..."
                className="utf8-bangla-input w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            {/* Questions List */}
            <div className="max-h-[680px] overflow-y-auto space-y-3 pr-1 custom-scrollbar">
              {loadingRepo ? (
                <div className="p-10 text-center text-slate-400 space-y-2">
                  <RefreshCw className="w-6 h-6 animate-spin mx-auto text-indigo-600" />
                  <p className="text-xs font-bold">ভাণ্ডার লোড হচ্ছে...</p>
                </div>
              ) : vaultQuestions.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-100 text-slate-400 space-y-2">
                  <FolderOpen className="w-8 h-8 mx-auto text-slate-300" />
                  <p className="text-xs font-bold text-slate-700">এই ভাণ্ডারে কোনো প্রশ্ন নেই</p>
                  <p className="text-[11px] text-slate-400">বামে বাল্ক পেস্ট করে প্রশ্ন জমা দিন।</p>
                </div>
              ) : (
                vaultQuestions.map((q, idx) => {
                  const qId = q?.id || q?.M_ID || idx;

                  return (
                    <div
                      key={qId}
                      className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs space-y-2.5 relative group hover:bg-white hover:border-indigo-300 hover:shadow-sm transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1.5 flex-wrap gap-1">
                          <span className={'px-2 py-0.5 rounded-md font-bold text-[10px] ' + (
                            activeVault === 'CQ' ? 'bg-purple-100 text-purple-800' : activeVault === 'SQ' ? 'bg-emerald-100 text-emerald-800' : 'bg-indigo-100 text-indigo-800'
                          )}>
                            {q?.type || activeVault}
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-slate-200 text-slate-700 font-bold text-[10px]">
                            {q?.badge || `[${q?.institutionOrBoard || q?.boardOrInstitute || 'বোর্ড'} - '${(q?.year || '26').slice(-2)}]`}
                          </span>
                          {q?.chapter && (
                            <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 font-bold text-[10px]">
                              {q.chapter}
                            </span>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => handleDeleteItem(qId)}
                          className="text-slate-400 hover:text-rose-600 transition-colors p-1 rounded-lg hover:bg-rose-50 cursor-pointer"
                          title="মুছে ফেলুন"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Question Text / Stem */}
                      <div className="font-bold text-slate-800 leading-relaxed text-xs sm:text-sm">
                        <MathRenderer text={q?.question || q?.stem || 'প্রশ্নের শিরোনাম নেই'} />
                      </div>

                      {/* Options for MCQ */}
                      {activeVault === 'MCQ' && Array.isArray(q?.options) && q.options.length > 0 && (
                        <div className="grid grid-cols-2 gap-1.5 pt-1 text-[11px] sm:text-xs text-slate-700">
                          {q.options.map((opt, oIdx) => {
                            const optLetter = ['ক', 'খ', 'গ', 'ঘ'][oIdx];
                            const isCorrect = q.correctAnswer === optLetter || q.correctAnswer === oIdx || normalizeOptionKey(q.correctAnswer) === optLetter;
                            return (
                              <div
                                key={oIdx}
                                className={'px-2.5 py-1.5 rounded-lg border ' + (
                                  isCorrect ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold' : 'bg-white border-slate-200/80'
                                )}
                              >
                                <span className="mr-1 font-bold">({optLetter})</span>
                                <MathRenderer text={opt} />
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Sub-questions for CQ */}
                      {activeVault === 'CQ' && q?.subQuestions && (
                        <div className="space-y-1.5 pt-1 text-[11px] sm:text-xs text-slate-700">
                          {Object.entries(q.subQuestions).map(([key, val]) => (
                            <div key={key} className="flex items-start space-x-1">
                              <span className="font-bold text-purple-700">({key === 'a' ? 'ক' : key === 'b' ? 'খ' : key === 'c' ? 'গ' : 'ঘ'})</span>
                              <div className="leading-relaxed inline-block">
                                <MathRenderer text={typeof val === 'object' ? val?.q : val} />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Answer for SQ */}
                      {activeVault === 'SQ' && q?.shortAnswer && (
                        <div className="p-2.5 bg-emerald-50/50 rounded-xl border border-emerald-200 text-[11px] sm:text-xs text-emerald-900">
                          <span className="font-bold">উত্তর: </span>
                          <MathRenderer text={q.shortAnswer} />
                        </div>
                      )}

                      {/* Metadata footer */}
                      <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-200/60">
                        <span>{q?.book || q?.subject || 'সাধারণ বিষয়'} • {q?.className || 'দশম শ্রেণি'}</span>
                        {q?.correctAnswer !== undefined && activeVault === 'MCQ' && (
                          <span className="font-bold text-emerald-700">সঠিক উত্তর: ({q.correctAnswer})</span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
