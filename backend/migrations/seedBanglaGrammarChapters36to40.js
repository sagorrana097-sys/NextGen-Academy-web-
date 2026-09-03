/**
 * Seed Migration: Bangla Grammar Chapters 36–40 Complete Content
 * Chapter 36: বিপরীতার্থক শব্দ (Antonyms)
 * Chapter 37: পারিভাষিক শব্দ (Technical Terminology)
 * Chapter 38: শুদ্ধ-অশুদ্ধ প্রয়োগ (Common Errors & Corrections)
 * Chapter 39: বিরামচিহ্ন বা যতিচিহ্নের ব্যবহার (Punctuation Marks)
 * Chapter 40: বাংলা ব্যাকরণ — SSC/HSC পরীক্ষাভিত্তিক Revision (Comprehensive Board Revision)
 */

const fs = require('fs');
const path = require('path');
const ch36to40 = require('../data/grammar/bangla_ch36_to_40_data');

async function seedBanglaGrammarChapters36to40() {
  console.log('========================================================================');
  console.log('🇧🇩 SEED: BANGLA GRAMMAR CHAPTERS 36–40 CONTENT');
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
    ...ch36to40.CHAPTER_36_TOPICS,
    ...ch36to40.CHAPTER_37_TOPICS,
    ...ch36to40.CHAPTER_38_TOPICS,
    ...ch36to40.CHAPTER_39_TOPICS,
    ...ch36to40.CHAPTER_40_TOPICS
  ];

  const allMcqs = [
    ...ch36to40.CHAPTER_36_MCQS,
    ...ch36to40.CHAPTER_37_MCQS,
    ...ch36to40.CHAPTER_38_MCQS,
    ...ch36to40.CHAPTER_39_MCQS,
    ...ch36to40.CHAPTER_40_MCQS
  ];

  const allModelTests = [
    ch36to40.CHAPTER_36_MODEL_TEST,
    ch36to40.CHAPTER_37_MODEL_TEST,
    ch36to40.CHAPTER_38_MODEL_TEST,
    ch36to40.CHAPTER_39_MODEL_TEST,
    ch36to40.CHAPTER_40_MODEL_TEST
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

  console.log(`✅ Bangla Grammar Chapters 36–40 Seed Complete:`);
  console.log(`   - Topics:      ${topicsAdded} added, ${topicsUpdated} updated (Total in batch: ${allTopics.length})`);
  console.log(`   - MCQs:        ${mcqsAdded} added, ${mcqsUpdated} updated (Total in batch: ${allMcqs.length})`);
  console.log(`   - Model Tests: ${testsAdded} added, ${testsUpdated} updated (Total in batch: ${allModelTests.length})`);
  console.log('------------------------------------------------------------------------\n');
}

if (require.main === module) {
  seedBanglaGrammarChapters36to40().catch(err => {
    console.error('Migration failed:', err);
    process.exit(1);
  });
}

module.exports = seedBanglaGrammarChapters36to40;
