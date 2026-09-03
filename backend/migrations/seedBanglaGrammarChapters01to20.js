/**
 * Master Seed Migration: Bangla Grammar Chapters 01–20 Complete Content
 * Integrates:
 * - Chapters 01–05 (Foundation, Phonetics, Words, Pod, Noun)
 * - Chapters 06–10 (Pronoun, Adjective, Verb, Adverb, Postposition)
 * - Chapters 11–15 (Conjunction, Interjection, Case, Inflection, Number)
 * - Chapters 16–20 (Gender, Person, Tense, Sound Changes, Spelling Rules)
 */

const fs = require('fs');
const path = require('path');

const ch01 = require('../data/grammar/bangla_ch01_data');
const ch02 = require('../data/grammar/bangla_ch02_data');
const ch03 = require('../data/grammar/bangla_ch03_data');
const ch04 = require('../data/grammar/bangla_ch04_data');
const ch05 = require('../data/grammar/bangla_ch05_data');
const ch06to10 = require('../data/grammar/bangla_ch06_to_10_data');
const ch11to15 = require('../data/grammar/bangla_ch11_to_15_data');
const ch16to20 = require('../data/grammar/bangla_ch16_to_20_data');

async function seedBanglaGrammarChapters01to20() {
  console.log('========================================================================');
  console.log('🇧🇩 MASTER SEED: BANGLA GRAMMAR CHAPTERS 01–20 CONTENT');
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
    // 01 - 05
    ...ch01.CHAPTER_01_TOPICS,
    ...ch02.CHAPTER_02_TOPICS,
    ...ch03.CHAPTER_03_TOPICS,
    ...ch04.CHAPTER_04_TOPICS,
    ...ch05.CHAPTER_05_TOPICS,
    // 06 - 10
    ...ch06to10.CHAPTER_06_TOPICS,
    ...ch06to10.CHAPTER_07_TOPICS,
    ...ch06to10.CHAPTER_08_TOPICS,
    ...ch06to10.CHAPTER_09_TOPICS,
    ...ch06to10.CHAPTER_10_TOPICS,
    // 11 - 15
    ...ch11to15.CHAPTER_11_TOPICS,
    ...ch11to15.CHAPTER_12_TOPICS,
    ...ch11to15.CHAPTER_13_TOPICS,
    ...ch11to15.CHAPTER_14_TOPICS,
    ...ch11to15.CHAPTER_15_TOPICS,
    // 16 - 20
    ...ch16to20.CHAPTER_16_TOPICS,
    ...ch16to20.CHAPTER_17_TOPICS,
    ...ch16to20.CHAPTER_18_TOPICS,
    ...ch16to20.CHAPTER_19_TOPICS,
    ...ch16to20.CHAPTER_20_TOPICS
  ];

  const allMcqs = [
    // 01 - 05
    ...ch01.CHAPTER_01_MCQS,
    ...ch02.CHAPTER_02_MCQS,
    ...ch03.CHAPTER_03_MCQS,
    ...ch04.CHAPTER_04_MCQS,
    ...ch05.CHAPTER_05_MCQS,
    // 06 - 10
    ...ch06to10.CHAPTER_06_MCQS,
    ...ch06to10.CHAPTER_07_MCQS,
    ...ch06to10.CHAPTER_08_MCQS,
    ...ch06to10.CHAPTER_09_MCQS,
    ...ch06to10.CHAPTER_10_MCQS,
    // 11 - 15
    ...ch11to15.CHAPTER_11_MCQS,
    ...ch11to15.CHAPTER_12_MCQS,
    ...ch11to15.CHAPTER_13_MCQS,
    ...ch11to15.CHAPTER_14_MCQS,
    ...ch11to15.CHAPTER_15_MCQS,
    // 16 - 20
    ...ch16to20.CHAPTER_16_MCQS,
    ...ch16to20.CHAPTER_17_MCQS,
    ...ch16to20.CHAPTER_18_MCQS,
    ...ch16to20.CHAPTER_19_MCQS,
    ...ch16to20.CHAPTER_20_MCQS
  ];

  const allModelTests = [
    // 01 - 05
    ch01.CHAPTER_01_MODEL_TEST,
    ch02.CHAPTER_02_MODEL_TEST,
    ch03.CHAPTER_03_MODEL_TEST,
    ch04.CHAPTER_04_MODEL_TEST,
    ch05.CHAPTER_05_MODEL_TEST,
    // 06 - 10
    ch06to10.CHAPTER_06_MODEL_TEST,
    ch06to10.CHAPTER_07_MODEL_TEST,
    ch06to10.CHAPTER_08_MODEL_TEST,
    ch06to10.CHAPTER_09_MODEL_TEST,
    ch06to10.CHAPTER_10_MODEL_TEST,
    // 11 - 15
    ch11to15.CHAPTER_11_MODEL_TEST,
    ch11to15.CHAPTER_12_MODEL_TEST,
    ch11to15.CHAPTER_13_MODEL_TEST,
    ch11to15.CHAPTER_14_MODEL_TEST,
    ch11to15.CHAPTER_15_MODEL_TEST,
    // 16 - 20
    ch16to20.CHAPTER_16_MODEL_TEST,
    ch16to20.CHAPTER_17_MODEL_TEST,
    ch16to20.CHAPTER_18_MODEL_TEST,
    ch16to20.CHAPTER_19_MODEL_TEST,
    ch16to20.CHAPTER_20_MODEL_TEST
  ];

  // 1. Seed Topics (Upsert)
  let topicsAdded = 0;
  let topicsUpdated = 0;

  allTopics.forEach(topic => {
    const existingIdx = db.grammar_topics.findIndex(t => t.id === topic.id || t.slug === topic.slug);
    const now = new Date().toISOString();
    const topicRecord = {
      ...topic,
      subject: 'BANGLA',
      status: 'PUBLISHED',
      createdAt: existingIdx >= 0 ? db.grammar_topics[existingIdx].createdAt : now,
      updatedAt: now
    };

    if (existingIdx >= 0) {
      db.grammar_topics[existingIdx] = topicRecord;
      topicsUpdated++;
    } else {
      db.grammar_topics.push(topicRecord);
      topicsAdded++;
    }
  });

  // 2. Seed MCQs (Upsert)
  let mcqsAdded = 0;
  let mcqsUpdated = 0;

  allMcqs.forEach(mcq => {
    const existingIdx = db.grammar_questions.findIndex(q => q.id === mcq.id);
    const now = new Date().toISOString();
    const mcqRecord = {
      ...mcq,
      subject: 'BANGLA',
      status: 'ACTIVE',
      createdAt: existingIdx >= 0 ? db.grammar_questions[existingIdx].createdAt : now,
      updatedAt: now
    };

    if (existingIdx >= 0) {
      db.grammar_questions[existingIdx] = mcqRecord;
      mcqsUpdated++;
    } else {
      db.grammar_questions.push(mcqRecord);
      mcqsAdded++;
    }
  });

  // 3. Seed Model Tests (Upsert)
  let testsAdded = 0;
  let testsUpdated = 0;

  allModelTests.forEach(test => {
    const existingIdx = db.grammar_model_tests.findIndex(m => m.id === test.id);
    const now = new Date().toISOString();
    const testRecord = {
      ...test,
      subject: 'BANGLA',
      status: 'PUBLISHED',
      createdAt: existingIdx >= 0 ? db.grammar_model_tests[existingIdx].createdAt : now,
      updatedAt: now
    };

    if (existingIdx >= 0) {
      db.grammar_model_tests[existingIdx] = testRecord;
      testsUpdated++;
    } else {
      db.grammar_model_tests.push(testRecord);
      testsAdded++;
    }
  });

  // Atomic write to database
  const tempPath = `${dbPath}.tmp`;
  fs.writeFileSync(tempPath, JSON.stringify(db, null, 2), 'utf8');
  fs.renameSync(tempPath, dbPath);

  console.log('✅ Bangla Grammar Chapters 01–20 Master Seed Complete:');
  console.log(`   - Topics:      ${topicsAdded} added, ${topicsUpdated} updated (Total: ${allTopics.length})`);
  console.log(`   - MCQs:        ${mcqsAdded} added, ${mcqsUpdated} updated (Total: ${allMcqs.length})`);
  console.log(`   - Model Tests: ${testsAdded} added, ${testsUpdated} updated (Total: ${allModelTests.length})`);
  console.log('------------------------------------------------------------------------\n');
}

if (require.main === module) {
  seedBanglaGrammarChapters01to20().catch(err => {
    console.error('Fatal error in Chapters 01–20 master seed:', err);
    process.exit(1);
  });
}

module.exports = { seedBanglaGrammarChapters01to20 };
