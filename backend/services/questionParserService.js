/**
 * NextGen Academy — High-Precision Question Parser Service
 * Robust, deterministic document parser for Bengali, English, and Mathematical MCQs/CQs/SQs.
 * 
 * Safety Rules:
 * 1. NEVER invent or guess missing answers.
 * 2. NEVER destructively mutate mathematical formulas or English variables.
 * 3. Flag uncertain questions with PARSER_REVIEW_REQUIRED for teacher review.
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

/**
 * Standardize Option Key to standard ('A', 'B', 'C', 'D' or 'ক', 'খ', 'গ', 'ঘ')
 */
function standardizeOptionKey(rawKey) {
  if (!rawKey) return 'A';
  const clean = rawKey.toString().trim().toLowerCase().replace(/[()\[\]\.\:\-]/g, '');
  
  if (clean === 'a' || clean === 'ক' || clean === '1' || clean === '১') return 'A';
  if (clean === 'b' || clean === 'খ' || clean === '2' || clean === '২') return 'B';
  if (clean === 'c' || clean === 'গ' || clean === '3' || clean === '৩') return 'C';
  if (clean === 'd' || clean === 'ঘ' || clean === '4' || clean === '৪') return 'D';
  
  return clean.toUpperCase();
}

/**
 * Map Answer String to standard option key ('A', 'B', 'C', 'D')
 */
function parseExplicitAnswer(rawAnsText) {
  if (!rawAnsText) return null;
  const clean = rawAnsText.trim();

  // e.g. "উত্তর: (গ)", "Answer: C", "Ans: খ", "উ: (A)", "সঠিক উত্তর: 4"
  const match = clean.match(/(?:উত্তর|Ans|Answer|উ|সঠিক\s*উত্তর)\s*[:.\-]?\s*[(\[]?\s*([a-dA-Dক-ঘ1-4১-৪])\s*[)\]]?/i);
  if (match) {
    return standardizeOptionKey(match[1]);
  }

  // Check direct single letter or token
  const directMatch = clean.match(/^[(\[]?\s*([a-dA-Dক-ঘ1-4১-৪])\s*[)\]]?$/i);
  if (directMatch) {
    return standardizeOptionKey(directMatch[1]);
  }

  return null;
}

/**
 * Regex for Explicit Answer lines
 */
const EXPLICIT_ANSWER_REGEX = /^(?:উত্তর|Ans|Answer|উ|সঠিক\s*উত্তর)\s*[:.\-]?/i;

/**
 * Regex for Question Number Headers
 * Matches: 1. / 01. / ১। / ১. / (১) / [1] / Q1: / Question 1. / প্রশ্ন ১: / ১ -
 */
const QUESTION_HEADER_REGEX = /^(?:(?:Q(?:uestion|\.)?\s*|প্রশ্ন\s*|বহুনির্বাচনী\s*)?[(\[]?\s*(?:[0-9]{1,4}|[০-৯]{1,4})\s*[)\]]?\s*[\.\:\।\-\–\—\)]\s*|(?:Q(?:uestion|\.)?\s*|প্রশ্ন\s*)([0-9০-৯]{1,4})\s*[:.\-]?\s*)/i;

/**
 * Regex for Option Markers
 * Matches: (ক) / ক. / ক) / [ক] / (A) / A. / A) / [A] / (a) / a. / a) / [a] / (1) / 1.
 */
const OPTION_START_REGEX = /^[(\[]?\s*([কখগঘabcdABCD1234১-৪])\s*[)\]]?\s*[\.\:\।\-\–\—\)]\s*/;

/**
 * Inline Option Splitter Regex
 * Matches patterns like: "(ক) text (খ) text (গ) text (ঘ) text" or "A. text B. text C. text D. text"
 */
const INLINE_OPTION_SPLITTER = /(?=(?:^|\s+)(?:[(\[]\s*[কখগঘabcdABCD1234১-৪]\s*[)\]]|(?:[কখগঘabcdABCD][\.\:\।\-\)]))(?:\s+|$))/g;

/**
 * Extract inline options from a single line or paragraph
 */
function extractInlineOptions(text) {
  if (!text) return [];
  const parts = text.split(INLINE_OPTION_SPLITTER).map(p => p.trim()).filter(Boolean);
  const options = [];

  for (const part of parts) {
    const match = part.match(OPTION_START_REGEX);
    if (match) {
      const key = standardizeOptionKey(match[1]);
      const optText = part.replace(OPTION_START_REGEX, '').trim();
      options.push({ key, text: optText });
    }
  }

  return options;
}

/**
 * Check if a line is a question header vs option or body line
 */
function isQuestionHeaderLine(line, currentBlock = []) {
  if (!line || !line.trim()) return false;
  const trimmed = line.trim();

  // 1. Never treat explicit answers or explanations as question headers
  if (EXPLICIT_ANSWER_REGEX.test(trimmed)) return false;
  if (/^(?:ব্যাখ্যা|explanation|note|নোট)\s*[\:\.\-]/i.test(trimmed)) return false;

  // 2. If it starts with letter option markers (ক, খ, গ, ঘ, a, b, c, d, A, B, C, D), it is an option!
  if (/^[(\[]?\s*([ক-ঘa-dA-D])\s*[)\]]?\s*[\.\:\।\-\–\—\)]/i.test(trimmed)) return false;

  // 3. If it contains multiple inline options on the same line, it is an option line
  if (/(?:[(\[]\s*[ক-ঘa-dA-D1-4১-৪]\s*[)\]]|(?:[ক-ঘa-dA-D][\.\:\।\-\)]))\s+.*\s+(?:[(\[]\s*[ক-ঘa-dA-D1-4১-৪]\s*[)\]]|(?:[ক-ঘa-dA-D][\.\:\।\-\)]))/i.test(trimmed)) {
    return false;
  }

  // 4. Check if it matches question number pattern
  // Matches: 1. / 01. / ১। / ১. / Q1: / Question 1. / প্রশ্ন ১: / ১ -
  const qMatch = trimmed.match(QUESTION_HEADER_REGEX);
  if (qMatch) {
    // If it is just (1) or (১) without any explicit punctuation like . or । or :, check if it's an option
    if (/^[(\[]\s*[1১]\s*[)\]]/.test(trimmed) && !/^[(\[]\s*[1১]\s*[)\]]\s*[\.\:\।\-\–\—]/.test(trimmed)) {
      if (currentBlock.length > 0) return false;
    }
    return true;
  }

  return false;
}

/**
 * Primary Parse Function
 * @param {string} rawText Extracted text content from DOCX/PDF/Text
 * @param {object} defaultMeta Metadata context (classId, subjectId, board, year, chapter, topic, sourceMaterialId, sourceFileName)
 * @returns {Array<object>} List of structured question candidate objects
 */
function parseQuestionsFromDocument(rawText, defaultMeta = {}) {
  if (!rawText || !rawText.trim()) return [];

  const text = rawText.trim();
  const rawLines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  if (rawLines.length === 0) return [];

  const questions = [];
  let currentBlock = [];
  const questionBlocks = [];
  let firstHeaderFound = false;

  // 1. Group text into question candidate blocks
  for (let i = 0; i < rawLines.length; i++) {
    const line = rawLines[i];
    const isQHeader = isQuestionHeaderLine(line, currentBlock);

    if (isQHeader) {
      if (currentBlock.length > 0 && firstHeaderFound) {
        questionBlocks.push(currentBlock);
      }
      firstHeaderFound = true;
      currentBlock = [line];
    } else {
      if (firstHeaderFound) {
        currentBlock.push(line);
      } else {
        currentBlock.push(line);
      }
    }
  }
  if (currentBlock.length > 0 && firstHeaderFound) {
    questionBlocks.push(currentBlock);
  } else if (currentBlock.length > 0 && !firstHeaderFound) {
    // Fallback if no explicit headers found in the entire document
    questionBlocks.push(currentBlock);
  }

  // 2. Process each question block
  questionBlocks.forEach((blockLines, blockIdx) => {
    if (blockLines.length === 0) return;

    let questionStemLines = [];
    let options = [];
    let explicitAnswer = null;
    let explanation = '';
    let isParsingOptions = false;
    let confidence = 'HIGH';
    let parserNotes = '';

    // First line is usually the question header
    const firstLine = blockLines[0];
    const cleanFirstLine = firstLine.replace(QUESTION_HEADER_REGEX, '').trim();
    questionStemLines.push(cleanFirstLine || firstLine);

    for (let j = 1; j < blockLines.length; j++) {
      const line = blockLines[j];

      // Check for Explicit Answer line: "Answer: C", "উত্তর: (খ)", "Ans: B"
      if (/^(?:উত্তর|Ans|Answer|উ|উত্তরঃ|সঠিক\s*উত্তর)\s*[:.\-]/i.test(line)) {
        explicitAnswer = parseExplicitAnswer(line);
        continue;
      }

      // Check for Explanation line: "Explanation: ...", "ব্যাখ্যা: ..."
      if (/^(?:ব্যাখ্যা|Explanation|কারণ|সংকেত)\s*[:.\-]/i.test(line)) {
        explanation = line.replace(/^(?:ব্যাখ্যা|Explanation|কারণ|সংকেত)\s*[:.\-]\s*/i, '').trim();
        continue;
      }

      // Check if line contains inline multiple options (e.g. "(ক) অপশন ১ (খ) অপশন ২")
      const inlineOpts = extractInlineOptions(line);
      if (inlineOpts.length >= 2) {
        isParsingOptions = true;
        options.push(...inlineOpts);
        continue;
      }

      // Check if line starts with single option marker (e.g. "A. Option Text", "ক. বিকল্প টেক্সট")
      const optMatch = line.match(OPTION_START_REGEX);
      if (optMatch) {
        isParsingOptions = true;
        const key = standardizeOptionKey(optMatch[1]);
        const optText = line.replace(OPTION_START_REGEX, '').trim();
        options.push({ key, text: optText });
        continue;
      }

      // If we are already parsing options and line does not have marker, it might be continuation of previous option
      if (isParsingOptions && options.length > 0) {
        options[options.length - 1].text += ' ' + line;
      } else {
        // Still part of the question stem (e.g. multi-line stem, stimulus, context)
        questionStemLines.push(line);
      }
    }

    // Deduplicate & ensure proper keys for options (A, B, C, D)
    const expectedKeys = ['A', 'B', 'C', 'D'];
    const standardizedOptions = [];

    for (let k = 0; k < options.length; k++) {
      const opt = options[k];
      const assignedKey = expectedKeys[k] || opt.key || String.fromCharCode(65 + k);
      standardizedOptions.push({
        key: assignedKey,
        text: opt.text || `অপশন ${k + 1}`
      });
    }

    const fullQuestionStem = questionStemLines.join('\n').trim();

    // Determine Status & Verification
    let status = 'APPROVED';
    if (standardizedOptions.length < 2) {
      status = 'PARSER_REVIEW_REQUIRED';
      parserNotes = 'পর্যাপ্ত অপশন শনাক্ত করা যায়নি (কমপক্ষে ২টি অপশন প্রয়োজন)।';
    } else if (standardizedOptions.length < 4) {
      status = 'PENDING_REVIEW';
      parserNotes = `মোট ${standardizedOptions.length}টি অপশন পাওয়া গেছে।`;
    } else if (!explicitAnswer) {
      status = 'PENDING_REVIEW';
      parserNotes = 'কোনো সরাসরি উত্তর উল্লেখ নেই, শিক্ষক কর্তৃক রিভিউ প্রয়োজন।';
    }

    questions.push({
      tempId: `candidate-${Date.now()}-${blockIdx + 1}`,
      questionType: defaultMeta.questionType || 'MCQ',
      questionNumber: blockIdx + 1,
      questionText: fullQuestionStem || `প্রশ্ন ${blockIdx + 1}`,
      options: standardizedOptions,
      answer: explicitAnswer, // Stored as 'A', 'B', 'C', 'D' or null
      answerText: explicitAnswer ? (standardizedOptions.find(o => o.key === explicitAnswer)?.text || '') : null,
      explanation: explanation || null,
      classId: defaultMeta.classId || null,
      subjectId: defaultMeta.subjectId || null,
      board: defaultMeta.board || 'সাধারণ',
      year: defaultMeta.year || defaultMeta.examYear || '2026',
      chapter: defaultMeta.chapter || defaultMeta.chapterBn || null,
      topic: defaultMeta.topic || defaultMeta.topicBn || null,
      difficulty: defaultMeta.difficulty || 'MEDIUM',
      marks: Number(defaultMeta.marks || 1),
      sourceMaterialId: defaultMeta.sourceMaterialId || null,
      sourceFileName: defaultMeta.sourceFileName || defaultMeta.fileName || 'document.docx',
      googleDriveFileId: defaultMeta.googleDriveFileId || null,
      fileUrl: defaultMeta.fileUrl || null,
      status: status,
      duplicateStatus: 'UNIQUE',
      similarityScore: 0,
      parserNotes: parserNotes || null,
      tags: [defaultMeta.board, defaultMeta.year, defaultMeta.chapter].filter(Boolean)
    });
  });

  return questions;
}

function normalizeMathText(text) {
  if (!text) return '';
  return text
    .replace(/\r\n/g, '\n')
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .trim();
}

module.exports = {
  parseQuestionsFromDocument,
  parseExplicitAnswer,
  standardizeOptionKey,
  toBengaliDigits,
  normalizeBengaliDigits,
  normalizeMathText
};
