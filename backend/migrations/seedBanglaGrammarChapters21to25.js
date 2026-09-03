/**
 * Seed Migration: Bangla Grammar Chapters 21–25 Complete Content
 * Chapter 21: সন্ধি (Shondhi)
 * Chapter 22: সমাস (Shomash)
 * Chapter 23: উপসর্গ (Uposhurgo)
 * Chapter 24: প্রত্যয় (Prottoy)
 * Chapter 25: শব্দগঠন পদ্ধতি (Word Formation)
 */

const fs = require('fs');
const path = require('path');
const ch21to25 = require('../data/grammar/bangla_ch21_to_25_data');

async function seedBanglaGrammarChapters21to25() {
  console.log('========================================================================');
  console.log('🇧🇩 SEED: BANGLA GRAMMAR CHAPTERS 21–25 CONTENT');
  console.log('========================================================================\n');

  const dbPath = path.resolve(__dirname, '../data/nextgen_academy_db.json');
  if (!fs.existsSync(dbPath)) {
    throw new Error(`Database file not found at: ${dbPath}`);
  }

  const raw = fs.readFileSync(dbPath, 'utf8');
  const db = JSON.parse(raw);

  if (!Array.isArray(db.grammar_topics)) db.grammar_topics = [];
  if (!Array.isArray(db.grammar_questions)) db.grammar_questions = [];
  if (!Array.isArray(db.grammar_model_tests)) db.grammar_model_tests = [];

  const allTopics = [
    ...ch21to25.CHAPTER_21_TOPICS,
    ...ch21to25.CHAPTER_22_TOPICS,
    ...ch21to25.CHAPTER_23_TOPICS,
    ...ch21to25.CHAPTER_24_TOPICS,
    ...ch21to25.CHAPTER_25_TOPICS
  ];

  const allMcqs = [
    ...ch21to25.CHAPTER_21_MCQS,
    ...ch21to25.CHAPTER_22_MCQS,
    ...ch21to25.CHAPTER_23_MCQS,
    ...ch21to25.CHAPTER_24_MCQS,
    ...ch21to25.CHAPTER_25_MCQS
  ];

  const allModelTests = [
    ch21to25.CHAPTER_21_MODEL_TEST,
    ch21to25.CHAPTER_22_MODEL_TEST,
    ch21to25.CHAPTER_23_MODEL_TEST,
    ch21to25.CHAPTER_24_MODEL_TEST,
    ch21to25.CHAPTER_25_MODEL_TEST
  ];

  // 1. Seed Topics
  let topicsAdded = 0;
  let topicsUpdated = 0;
  for (const topic of allTopics) {
    const idx = db.grammar_topics.findIndex(t => t.id === topic.id);
    if (idx >= 0) {
      db.grammar_topics[idx] = { ...db.grammar_topics[idx], ...topic };
      topicsUpdated++;
    } else {
      db.grammar_topics.push(topic);
      topicsAdded++;
    }
  }

  // 2. Seed MCQs
  let mcqsAdded = 0;
  let mcqsUpdated = 0;
  for (const q of allMcqs) {
    const idx = db.grammar_questions.findIndex(existing => existing.id === q.id);
    if (idx >= 0) {
      db.grammar_questions[idx] = { ...db.grammar_questions[idx], ...q };
      mcqsUpdated++;
    } else {
      db.grammar_questions.push(q);
      mcqsAdded++;
    }
  }

  // 3. Seed Model Tests
  let testsAdded = 0;
  let testsUpdated = 0;
  for (const test of allModelTests) {
    const idx = db.grammar_model_tests.findIndex(t => t.id === test.id);
    if (idx >= 0) {
      db.grammar_model_tests[idx] = { ...db.grammar_model_tests[idx], ...test };
      testsUpdated++;
    } else {
      db.grammar_model_tests.push(test);
      testsAdded++;
    }
  }

  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');

  console.log(`✅ Bangla Grammar Chapters 21–25 Seed Complete:`);
  console.log(`   - Topics:      ${topicsAdded} added, ${topicsUpdated} updated (Total in batch: ${allTopics.length})`);
  console.log(`   - MCQs:        ${mcqsAdded} added, ${mcqsUpdated} updated (Total in batch: ${allMcqs.length})`);
  console.log(`   - Model Tests: ${testsAdded} added, ${testsUpdated} updated (Total in batch: ${allModelTests.length})`);
  console.log('------------------------------------------------------------------------\n');
}

if (require.main === module) {
  seedBanglaGrammarChapters21to25().catch(err => {
    console.error('Migration failed:', err);
    process.exit(1);
  });
}

module.exports = seedBanglaGrammarChapters21to25;
