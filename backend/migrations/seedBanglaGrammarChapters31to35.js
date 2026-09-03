/**
 * Seed Migration: Bangla Grammar Chapters 31–35 Complete Content
 * Chapter 31: উক্তি পরিবর্তন (Speech Transformation)
 * Chapter 32: বাক্য সংকোচন / বাক্য সংক্ষেপণ (Sentence Contraction)
 * Chapter 33: বাগধারা ও প্রবাদ-প্রবচন (Idioms & Proverbs)
 * Chapter 34: এক কথায় প্রকাশ (One Word Substitution)
 * Chapter 35: সমার্থক শব্দ / প্রতিশব্দ (Synonyms)
 */

const fs = require('fs');
const path = require('path');
const ch31to35 = require('../data/grammar/bangla_ch31_to_35_data');

async function seedBanglaGrammarChapters31to35() {
  console.log('========================================================================');
  console.log('🇧🇩 SEED: BANGLA GRAMMAR CHAPTERS 31–35 CONTENT');
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
    ...ch31to35.CHAPTER_31_TOPICS,
    ...ch31to35.CHAPTER_32_TOPICS,
    ...ch31to35.CHAPTER_33_TOPICS,
    ...ch31to35.CHAPTER_34_TOPICS,
    ...ch31to35.CHAPTER_35_TOPICS
  ];

  const allMcqs = [
    ...ch31to35.CHAPTER_31_MCQS,
    ...ch31to35.CHAPTER_32_MCQS,
    ...ch31to35.CHAPTER_33_MCQS,
    ...ch31to35.CHAPTER_34_MCQS,
    ...ch31to35.CHAPTER_35_MCQS
  ];

  const allModelTests = [
    ch31to35.CHAPTER_31_MODEL_TEST,
    ch31to35.CHAPTER_32_MODEL_TEST,
    ch31to35.CHAPTER_33_MODEL_TEST,
    ch31to35.CHAPTER_34_MODEL_TEST,
    ch31to35.CHAPTER_35_MODEL_TEST
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

  console.log(`✅ Bangla Grammar Chapters 31–35 Seed Complete:`);
  console.log(`   - Topics:      ${topicsAdded} added, ${topicsUpdated} updated (Total in batch: ${allTopics.length})`);
  console.log(`   - MCQs:        ${mcqsAdded} added, ${mcqsUpdated} updated (Total in batch: ${allMcqs.length})`);
  console.log(`   - Model Tests: ${testsAdded} added, ${testsUpdated} updated (Total in batch: ${allModelTests.length})`);
  console.log('------------------------------------------------------------------------\n');
}

if (require.main === module) {
  seedBanglaGrammarChapters31to35().catch(err => {
    console.error('Migration failed:', err);
    process.exit(1);
  });
}

module.exports = seedBanglaGrammarChapters31to35;
