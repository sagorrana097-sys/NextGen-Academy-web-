/**
 * NextGen Academy — Question Duplicate Detection & Suggestion Family Service
 * Provides non-destructive similarity analysis and multi-board/year question family grouping.
 */

const { QuestionBank, QuestionSuggestionFamily } = require('../models');

/**
 * Text Normalization for Semantic Comparison
 */
function stemBengaliToken(token) {
  if (!token) return '';
  let stemmed = token
    .replace(/(?:১ম|প্রথম)$/g, '1')
    .replace(/(?:২য়|২য়|দ্বিতীয়|দ্বিতীয়)$/g, '2')
    .replace(/(?:৩য়|৩য়|তৃতীয়|তৃতীয়)$/g, '3')
    .replace(/(?:৪র্থ|চতুর্থ)$/g, '4');
  
  if (stemmed.length > 3) {
    stemmed = stemmed.replace(/(?:গুলোর|গুলির|গুলো|গুলি|সমূহ|দের|ের|টি|টা|তে|কে|র|ে|য়|য়)$/g, '');
  }
  return stemmed;
}

/**
 * Text Normalization for Semantic Comparison
 */
function normalizeTextForComparison(text) {
  if (!text) return '';
  const base = text
    .toLowerCase()
    .normalize('NFC')
    // Remove leading question numbering like "1.", "১।", "Q1:", "প্রশ্ন ১:"
    .replace(/^(?:(?:q(?:uestion|\.)?\s*|প্রশ্ন\s*)?[(\[]?\s*[0-9০-৯]{1,4}\s*[)\]]?\s*[\.\:\।\-\–\—\)]\s*)/i, '')
    // Normalize Bengali ordinals & variations
    .replace(/(?:১ম|প্রথম)/g, '1')
    .replace(/(?:২য়|২য়|দ্বিতীয়|দ্বিতীয়)/g, '2')
    .replace(/(?:৩য়|৩য়|তৃতীয়|তৃতীয়)/g, '3')
    .replace(/(?:৪র্থ|চতুর্থ)/g, '4')
    // Remove common question prefixes and filler particles
    .replace(/(?:নিচের|কোনটি|কোন|হল|হলো|কি|কী|বলতে|বোঝায়|হলে)/g, '')
    // Remove punctuation, bullets, brackets, and quotes
    .replace(/[।\.\,\;\:\?\!\"\'\`\(\)\[\]\{\}\-\_\–\—\/\\\<\>\*\+\=\#\$\%\^\@]/g, ' ')
    // Normalize Bengali digits to ASCII
    .replace(/[০-৯]/g, d => ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'].indexOf(d))
    // Collapse whitespace
    .replace(/\s+/g, ' ')
    .trim();

  return base.split(' ').map(stemBengaliToken).filter(Boolean).join(' ');
}

/**
 * Create Character Bigrams for Dice Coefficient
 */
function getBigrams(str) {
  const bigrams = new Set();
  for (let i = 0; i < str.length - 1; i++) {
    bigrams.add(str.slice(i, i + 2));
  }
  return bigrams;
}

/**
 * Calculate Dice Coefficient Similarity between two strings (0.0 to 1.0)
 */
function calculateDiceSimilarity(str1, str2) {
  const norm1 = normalizeTextForComparison(str1);
  const norm2 = normalizeTextForComparison(str2);

  if (!norm1 || !norm2) return 0;
  if (norm1 === norm2) return 1.0;

  // Stemmed Token Jaccard Check
  const rawTokens1 = norm1.split(' ').filter(Boolean);
  const rawTokens2 = norm2.split(' ').filter(Boolean);

  const tokens1 = new Set(rawTokens1.map(stemBengaliToken).filter(Boolean));
  const tokens2 = new Set(rawTokens2.map(stemBengaliToken).filter(Boolean));

  let tokenIntersection = 0;
  for (const t of tokens1) {
    if (tokens2.has(t)) tokenIntersection++;
  }
  const tokenUnion = new Set([...tokens1, ...tokens2]).size;
  const jaccardScore = tokenUnion > 0 ? (tokenIntersection / tokenUnion) : 0;

  // Character Bigram Check
  const bigrams1 = getBigrams(norm1);
  const bigrams2 = getBigrams(norm2);

  let bigramIntersection = 0;
  for (const b of bigrams1) {
    if (bigrams2.has(b)) bigramIntersection++;
  }
  const diceScore = (2 * bigramIntersection) / (bigrams1.size + bigrams2.size || 1);

  // Weighted combination prioritizing stemmed semantic tokens
  const combined = (jaccardScore * 0.65) + (diceScore * 0.35);
  return Number(Math.max(combined, jaccardScore * 0.92).toFixed(3));
}

/**
 * Check a candidate question against existing QuestionBank items
 */
async function checkDuplicateForQuestion(candidate, existingList = null) {
  const pool = existingList || await QuestionBank.findAll({
    where: candidate.subjectId ? { subjectId: candidate.subjectId } : {}
  });

  let bestMatch = null;
  let highestScore = 0;

  for (const existing of pool) {
    if (candidate.id && String(existing.id) === String(candidate.id)) continue;

    const score = calculateDiceSimilarity(candidate.questionText, existing.questionText);
    if (score > highestScore) {
      highestScore = score;
      bestMatch = existing;
    }
  }

  let duplicateStatus = 'UNIQUE';
  if (highestScore >= 0.96) {
    duplicateStatus = 'EXACT_DUPLICATE';
  } else if (highestScore >= 0.85) {
    duplicateStatus = 'LIKELY_DUPLICATE';
  }

  return {
    isDuplicate: highestScore >= 0.85,
    duplicateStatus,
    similarityScore: Math.round(highestScore * 100),
    matchedQuestion: bestMatch ? {
      id: bestMatch.id,
      questionText: bestMatch.questionText,
      board: bestMatch.board,
      year: bestMatch.year,
      chapter: bestMatch.chapter,
      familyId: bestMatch.familyId,
      sourceFileName: bestMatch.sourceFileName
    } : null
  };
}

/**
 * Check multiple candidate questions against the database
 */
async function checkBatchDuplicates(candidates, subjectId = null) {
  const existingQuestions = await QuestionBank.findAll({
    where: subjectId ? { subjectId } : {}
  });

  const previousInBatch = [];
  const results = [];

  for (let i = 0; i < candidates.length; i++) {
    const candidate = candidates[i];
    // Check against DB and against other questions in the same uploaded batch
    const fullPool = [...existingQuestions, ...previousInBatch];
    const dupResult = await checkDuplicateForQuestion(candidate, fullPool);

    results.push({
      ...candidate,
      duplicateStatus: dupResult.duplicateStatus,
      similarityScore: dupResult.similarityScore,
      matchedQuestion: dupResult.matchedQuestion
    });

    previousInBatch.push(candidate);
  }

  return results;
}

/**
 * Group & Link Questions into Multi-Board "Final Suggestion" Families
 * Non-destructive: links questions together while retaining all original sources
 */
async function processSuggestionFamilies(questionList) {
  const allFamilies = await QuestionSuggestionFamily.findAll();

  for (const q of questionList) {
    const norm = normalizeTextForComparison(q.questionText);
    if (!norm) continue;

    // 1. Check if matching family exists
    let matchedFamily = null;
    for (const fam of allFamilies) {
      const famNorm = normalizeTextForComparison(fam.baseQuestionText);
      const sim = calculateDiceSimilarity(norm, famNorm);
      if (sim >= 0.75) {
        matchedFamily = fam;
        break;
      }
    }

    const currentSource = {
      board: q.board || 'সাধারণ',
      year: q.year || '2026',
      questionId: q.id,
      sourceMaterialId: q.sourceMaterialId,
      sourceFileName: q.sourceFileName || 'document.docx'
    };

    if (matchedFamily) {
      // Add source if not already registered
      const sources = Array.isArray(matchedFamily.boardYearSources) ? [...matchedFamily.boardYearSources] : [];
      const alreadyHasSource = sources.some(s => s.board === currentSource.board && s.year === currentSource.year && String(s.questionId) === String(currentSource.questionId));

      if (!alreadyHasSource) {
        sources.push(currentSource);
        if (typeof matchedFamily.update === 'function') {
          await matchedFamily.update({
            boardYearSources: sources,
            repeatedCount: sources.length,
            updatedAt: new Date().toISOString()
          });
        } else {
          matchedFamily.boardYearSources = sources;
          matchedFamily.repeatedCount = sources.length;
        }
      }

      if (typeof q.update === 'function') {
        await q.update({
          familyId: matchedFamily.id,
          duplicateGroupId: matchedFamily.familyCode
        });
      }
    } else {
      // Create new Question Family
      const familyCode = `#NG-${String(allFamilies.length + 1).padStart(6, '0')}`;
      const newFamily = await QuestionSuggestionFamily.create({
        familyCode,
        baseQuestionText: q.questionText,
        subjectId: q.subjectId,
        classId: q.classId,
        chapter: q.chapter,
        topic: q.topic,
        repeatedCount: 1,
        boardYearSources: [currentSource],
        primaryQuestionId: q.id,
        tags: [q.board, q.year, q.chapter].filter(Boolean),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      allFamilies.push(newFamily);

      if (typeof q.update === 'function') {
        await q.update({
          familyId: newFamily.id,
          duplicateGroupId: newFamily.familyCode
        });
      }
    }
  }

  return allFamilies;
}

function classifyDuplicate(score) {
  if (score >= 0.90) {
    return { status: 'EXACT_DUPLICATE', isDuplicate: true };
  } else if (score >= 0.75) {
    return { status: 'LIKELY_DUPLICATE', isDuplicate: true };
  }
  return { status: 'UNIQUE', isDuplicate: false };
}

module.exports = {
  normalizeTextForComparison,
  calculateDiceSimilarity,
  calculateSimilarity: calculateDiceSimilarity,
  classifyDuplicate,
  checkDuplicateForQuestion,
  checkBatchDuplicates,
  processSuggestionFamilies
};
