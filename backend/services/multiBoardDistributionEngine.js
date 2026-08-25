/**
 * Multi-Board & Multi-Year Quantity Distribution Engine for NextGen Academy AI Question System
 * 
 * Supports Bengali & English natural language composite prompts like:
 * - "ঢাকা ২৫ থেকে ২০টি, কুমিল্লা ২২ থেকে ১২টি, যশোর ১৩ থেকে ১৮টি মোট ৫০টি এমসিকিউ দাও"
 * - "ঢাকা ২০২৫ থেকে ১৫টি এবং রাজশাহী ২০২৪ থেকে ১০টি CQ দিন"
 * - "চট্টগ্রাম 24 - 10, বরিশাল 23 - 8, সিলেট 25 - 12"
 */

const BENGALI_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

function normalizeBengaliDigits(str) {
  if (!str) return '';
  return String(str).replace(/[০-৯]/g, d => BENGALI_DIGITS.indexOf(d));
}

function toBengaliDigits(num) {
  if (num === undefined || num === null) return '';
  return String(num).replace(/[0-9]/g, d => BENGALI_DIGITS[Number(d)]);
}

const BOARDS_MAP = {
  'ঢাকা': 'ঢাকা', 'dhaka': 'ঢাকা', 'dha': 'ঢাকা',
  'চট্টগ্রাম': 'চট্টগ্রাম', 'চট্রগ্রাম': 'চট্টগ্রাম', 'chattogram': 'চট্টগ্রাম', 'chittagong': 'চট্টগ্রাম', 'ctg': 'চট্টগ্রাম',
  'রাজশাহী': 'রাজশাহী', 'rajshahi': 'রাজশাহী', 'raj': 'রাজশাহী',
  'কুমিল্লা': 'কুমিল্লা', 'cumilla': 'কুমিল্লা', 'comilla': 'কুমিল্লা', 'com': 'কুমিল্লা',
  'যশোর': 'যশোর', 'jashore': 'যশোর', 'jessore': 'যশোর', 'jas': 'যশোর',
  'বরিশাল': 'বরিশাল', 'barishal': 'বরিশাল', 'barisal': 'বরিশাল', 'bar': 'বরিশাল',
  'সিলেট': 'সিলেট', 'sylhet': 'সিলেট', 'syl': 'সিলেট',
  'দিনাজপুর': 'দিনাজপুর', 'dinajpur': 'দিনাজপুর', 'din': 'দিনাজপুর',
  'ময়মনসিংহ': 'ময়মনসিংহ', 'ময়মনসিংহ': 'ময়মনসিংহ', 'mymensingh': 'ময়মনসিংহ', 'mym': 'ময়মনসিংহ',
  'মাদ্রাসা': 'মাদ্রাসা', 'madrasah': 'মাদ্রাসা', 'madrasa': 'মাদ্রাসা',
  'কারিগরি': 'কারিগরি', 'technical': 'কারিগরি', 'vocational': 'কারিগরি',
  'সকল বোর্ড': 'সকল বোর্ড', 'সকল': 'সকল বোর্ড', 'all boards': 'সকল বোর্ড', 'all board': 'সকল বোর্ড'
};

function formatAcademicBadge(board, year, qType = 'MCQ') {
  const cleanBoard = (board || 'সকল বোর্ড').trim();
  const cleanYear = year ? String(year).trim() : '';
  const shortYear = cleanYear ? cleanYear.replace(/^20/, '').replace(/^২০/, '') : '';
  const cleanType = (qType || 'MCQ').trim();

  if (cleanBoard && shortYear && cleanType) return `${cleanBoard} - ${shortYear} (${cleanType})`;
  if (cleanBoard && shortYear) return `${cleanBoard} - ${shortYear}`;
  if (cleanBoard && cleanType) return `${cleanBoard} (${cleanType})`;
  return `${cleanBoard}`;
}

/**
 * Parses natural language prompt with multi-board & multi-year distribution
 * @param {string} rawPrompt - e.g. "ঢাকা ২৫ থেকে ২০টি, কুমিল্লা ২২ থেকে ১২টি, যশোর ১৩ থেকে ১৮টি মোট ৫০টি এমসিকিউ দাও"
 * @param {string} defaultType - 'MCQ' | 'CQ' | 'SQ'
 * @returns {object|null} parsed distribution metadata
 */
function parseMultiBoardPrompt(rawPrompt, defaultType = 'MCQ') {
  if (!rawPrompt || typeof rawPrompt !== 'string') return null;

  const text = rawPrompt.trim();
  const normalized = normalizeBengaliDigits(text);

  // Detect Question Type
  let qType = defaultType;
  if (/cq|সৃজনশীল|রচনামূলক/i.test(normalized)) {
    qType = 'CQ';
  } else if (/mcq|বহুনির্বাচনি|নৈর্ব্যক্তিক|এমসিকিউ/i.test(normalized)) {
    qType = 'MCQ';
  } else if (/sq|সংক্ষিপ্ত/i.test(normalized)) {
    qType = 'SQ';
  }

  // Board names regex pattern
  const boardNames = Object.keys(BOARDS_MAP).sort((a, b) => b.length - a.length);
  const boardPattern = boardNames.map(b => b.replace(/[.*+?^$${}()|[\]\\]/g, '\\$&')).join('|');

  // Regex to find segments like: "ঢাকা ২৫ থেকে ২০টি", "কুমিল্লা ২২ থেকে ১২টি", "যশোর ১৩ থেকে ১৮টি", "ঢাকা 2025 - 15"
  const segmentRegex = new RegExp(
    `(${boardPattern})\\s*(?:বোর্ড)?\\s*([০-৯0-9]{2,4})?\\s*(?:সাল|সালের|থেকে|হতে|এর|-|:)?\\s*([০-৯0-9]{1,3})\\s*(?:টি|টা|টি প্রশ্ন|questions|mcq|cq)?`,
    'gi'
  );

  const distributions = [];
  let match;
  let totalParsedCount = 0;

  while ((match = segmentRegex.exec(normalized)) !== null) {
    const rawBoard = match[1].toLowerCase().trim();
    const standardBoard = BOARDS_MAP[rawBoard] || rawBoard;
    
    let rawYear = match[2] ? match[2].trim() : '';
    let rawCount = match[3] ? parseInt(match[3].trim(), 10) : 0;

    // Convert 2 digit year to full 4 digit year
    let fullYear = rawYear;
    if (rawYear) {
      if (rawYear.length === 2) {
        const yNum = parseInt(rawYear, 10);
        fullYear = yNum > 50 ? `19${rawYear}` : `20${rawYear}`;
      }
    } else {
      fullYear = '2025'; // default current year
    }

    if (rawCount > 0) {
      const badge = formatAcademicBadge(standardBoard, fullYear, qType);
      distributions.push({
        board: standardBoard,
        examYear: fullYear,
        yearShort: fullYear.slice(-2),
        count: rawCount,
        questionType: qType,
        badge
      });
      totalParsedCount += rawCount;
    }
  }

  if (distributions.length === 0) return null;

  // Extract clean topic by stripping out board commands
  let cleanTopic = normalized
    .replace(segmentRegex, '')
    .replace(/মোট\s*[0-9০-৯]+\s*টি/gi, '')
    .replace(/এমসিকিউ|বহুনির্বাচনি|নৈর্ব্যক্তিক|সৃজনশীল|রচনামূলক|cq|mcq|দাও|দিন|তৈরি করো|করুন/gi, '')
    .replace(/[,;+&]/g, ' ')
    .trim();

  return {
    isMultiBoard: distributions.length > 1 || distributions[0].count > 0,
    distributions,
    totalCount: totalParsedCount,
    questionType: qType,
    cleanTopic: cleanTopic || 'বোর্ড প্রশ্নপত্র সংকলন',
    summaryBn: distributions.map(d => `${d.board} '${d.yearShort} (${toBengaliDigits(d.count)}টি)`).join(' + ') + ` = মোট ${toBengaliDigits(totalParsedCount)}টি`
  };
}

module.exports = {
  parseMultiBoardPrompt,
  formatAcademicBadge,
  normalizeBengaliDigits,
  toBengaliDigits,
  BOARDS_MAP
};
