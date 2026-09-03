/**
 * Seed Migration: Bangla Grammar Chapters 01–05 Content
 * Populates Topics, MCQs, and Chapter Model Tests for Chapters 01 to 05
 */

const fs = require('fs');
const path = require('path');

const { CHAPTER_01_TOPICS, CHAPTER_01_MCQS, CHAPTER_01_MODEL_TEST } = require('../data/grammar/bangla_ch01_data');
const { CHAPTER_02_TOPICS, CHAPTER_02_MCQS, CHAPTER_02_MODEL_TEST } = require('../data/grammar/bangla_ch02_data');
const { CHAPTER_03_TOPICS, CHAPTER_03_MCQS, CHAPTER_03_MODEL_TEST } = require('../data/grammar/bangla_ch03_data');
const { CHAPTER_04_TOPICS, CHAPTER_04_MCQS, CHAPTER_04_MODEL_TEST } = require('../data/grammar/bangla_ch04_data');
const { CHAPTER_05_TOPICS, CHAPTER_05_MCQS, CHAPTER_05_MODEL_TEST } = require('../data/grammar/bangla_ch05_data');

async function seedBanglaGrammarChapters01to05() {
  console.log('========================================================================');
  console.log('🇧🇩 SEEDING BANGLA GRAMMAR CHAPTERS 01–05 CONTENT');
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
    ...CHAPTER_01_TOPICS,
    ...CHAPTER_02_TOPICS,
    ...CHAPTER_03_TOPICS,
    ...CHAPTER_04_TOPICS,
    ...CHAPTER_05_TOPICS
  ];

  const allMcqs = [
    ...CHAPTER_01_MCQS,
    ...CHAPTER_02_MCQS,
    ...CHAPTER_03_MCQS,
    ...CHAPTER_04_MCQS,
    ...CHAPTER_05_MCQS
  ];

  const allModelTests = [
    CHAPTER_01_MODEL_TEST,
    CHAPTER_02_MODEL_TEST,
    CHAPTER_03_MODEL_TEST,
    CHAPTER_04_MODEL_TEST,
    CHAPTER_05_MODEL_TEST
  ];

  // 1. Seed Topics (Upsert by id/slug)
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

  // 2. Seed MCQs (Upsert by id)
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

  // 3. Seed Model Tests (Upsert by id)
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

  console.log('✅ Bangla Grammar Chapters 01–05 Seed Complete:');
  console.log(`   - Topics:      ${topicsAdded} added, ${topicsUpdated} updated (Total: ${allTopics.length})`);
  console.log(`   - MCQs:        ${mcqsAdded} added, ${mcqsUpdated} updated (Total: ${allMcqs.length})`);
  console.log(`   - Model Tests: ${testsAdded} added, ${testsUpdated} updated (Total: ${allModelTests.length})`);
  console.log('------------------------------------------------------------------------\n');
}

if (require.main === module) {
  seedBanglaGrammarChapters01to05().catch(err => {
    console.error('Fatal error in Chapters 01–05 seed:', err);
    process.exit(1);
  });
}

module.exports = { seedBanglaGrammarChapters01to05 };
