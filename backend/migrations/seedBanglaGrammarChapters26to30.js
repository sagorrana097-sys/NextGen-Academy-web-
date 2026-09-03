/**
 * Seed Migration: Bangla Grammar Chapters 26–30 Complete Content
 * Chapter 26: প্রকৃতি ও প্রত্যয় বিশদ (Root & Suffix In-depth)
 * Chapter 27: ধাতু ও ধাতুর প্রকারভেদ (Verbal Roots)
 * Chapter 28: বাক্য ও সার্থক বাক্যের গুণাবলী (Sentence Syntax & Qualities)
 * Chapter 29: বাক্যের গঠন ও শ্রেণিবিভাগ (Sentence Structure & Types)
 * Chapter 30: বাচ্য ও বাচ্য পরিবর্তন (Voice & Voice Transformation)
 */

const fs = require('fs');
const path = require('path');
const ch26to30 = require('../data/grammar/bangla_ch26_to_30_data');

async function seedBanglaGrammarChapters26to30() {
  console.log('========================================================================');
  console.log('🇧🇩 SEED: BANGLA GRAMMAR CHAPTERS 26–30 CONTENT');
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
    ...ch26to30.CHAPTER_26_TOPICS,
    ...ch26to30.CHAPTER_27_TOPICS,
    ...ch26to30.CHAPTER_28_TOPICS,
    ...ch26to30.CHAPTER_29_TOPICS,
    ...ch26to30.CHAPTER_30_TOPICS
  ];

  const allMcqs = [
    ...ch26to30.CHAPTER_26_MCQS,
    ...ch26to30.CHAPTER_27_MCQS,
    ...ch26to30.CHAPTER_28_MCQS,
    ...ch26to30.CHAPTER_29_MCQS,
    ...ch26to30.CHAPTER_30_MCQS
  ];

  const allModelTests = [
    ch26to30.CHAPTER_26_MODEL_TEST,
    ch26to30.CHAPTER_27_MODEL_TEST,
    ch26to30.CHAPTER_28_MODEL_TEST,
    ch26to30.CHAPTER_29_MODEL_TEST,
    ch26to30.CHAPTER_30_MODEL_TEST
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

  console.log(`✅ Bangla Grammar Chapters 26–30 Seed Complete:`);
  console.log(`   - Topics:      ${topicsAdded} added, ${topicsUpdated} updated (Total in batch: ${allTopics.length})`);
  console.log(`   - MCQs:        ${mcqsAdded} added, ${mcqsUpdated} updated (Total in batch: ${allMcqs.length})`);
  console.log(`   - Model Tests: ${testsAdded} added, ${testsUpdated} updated (Total in batch: ${allModelTests.length})`);
  console.log('------------------------------------------------------------------------\n');
}

if (require.main === module) {
  seedBanglaGrammarChapters26to30().catch(err => {
    console.error('Migration failed:', err);
    process.exit(1);
  });
}

module.exports = seedBanglaGrammarChapters26to30;
