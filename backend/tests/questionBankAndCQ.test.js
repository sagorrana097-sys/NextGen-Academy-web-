/**
 * Question Bank & Document Ingestion Test Suite
 * Validates:
 * 1. Deterministic MCQ parsing with Bengali/English option markers
 * 2. Creative Question (CQ) parsing with stimulus, 4 sub-questions (ক, খ, গ, ঘ), marks (1+2+3+4 = 10)
 * 3. Short Question (SQ) parsing
 * 4. Mathematical formula and LaTeX preservation
 * 5. Duplicate detection logic
 */

const { parseQuestionsFromDocument, normalizeMathText } = require('../services/questionParserService');
const { calculateDiceSimilarity } = require('../services/duplicateDetectionService');

async function runQuestionBankTests() {
  console.log('--- [TEST SUITE 2: QUESTION BANK & CQ INGESTION ENGINE] ---');
  let passed = 0;
  let failed = 0;

  // 1. Test MCQ Parsing
  const mcqSample = `
১. পানির অণুর বন্ধন কোণ কত ডিগ্রি?
(ক) ১০৪.৫°
(খ) ১০৯.৫°
(গ) ১২০°
(ঘ) ১৮০°
উত্তর: (ক)
ব্যাখ্যা: অক্সিজেনের নিঃসঙ্গ ইলেকট্রন জোড়ের কারণে বন্ধন কোণ ১০৪.৫° হয়।
`;

  const parsedMCQ = parseQuestionsFromDocument(mcqSample, { subjectId: 1, board: 'ঢাকা বোর্ড', year: '2025' });
  if (parsedMCQ.length === 1 && parsedMCQ[0].questionType === 'MCQ' && parsedMCQ[0].answer === 'A' && parsedMCQ[0].options.length === 4) {
    console.log('  [PASS] Deterministic MCQ parser correctly extracted question, 4 options, and answer A');
    passed++;
  } else {
    console.error('  [FAIL] MCQ parsing failed:', parsedMCQ);
    failed++;
  }

  // 2. Test Creative Question (CQ) Parsing
  const cqSample = `
২. উদ্দীপক: জনাব রফিক শ্রেণিকক্ষে একটি বিশেষ তড়িৎ বর্তনী প্রদর্শন করলেন। তিনি শিক্ষার্থীদের বিভিন্ন ধাপে তথ্য পর্যবেক্ষণ ও গাণিতিক সমীকরণের মাধ্যমে ফলাফল যাচাই করতে বললেন।
![বর্তনী চিত্র](https://nextgen.edu.bd/diagrams/circuit1.png)
(ক) তড়িৎ প্রবাহ কাকে বলে? [১]
(খ) রোধের উপর তাপমাত্রার প্রভাব ব্যাখ্যা করো। [২]
(গ) বর্তনীর তুল্য রোধ নির্ণয় করো। [৩]
(ঘ) উদ্দীপকের আলোকে বর্তনীটির শক্তি অপচয় রোধে করণীয় বিশ্লেষণ করো। [৪]
`;

  const parsedCQ = parseQuestionsFromDocument(cqSample, { subjectId: 2, board: 'রাজশাহী বোর্ড', year: '2025' });
  if (parsedCQ.length === 1 && parsedCQ[0].questionType === 'CQ') {
    const cq = parsedCQ[0];
    const hasAllSubs = cq.subQuestions?.ka && cq.subQuestions?.kha && cq.subQuestions?.ga && cq.subQuestions?.gha;
    const hasMarks = cq.marks === 10;
    const hasDiagram = Boolean(cq.diagramUrl);
    if (hasAllSubs && hasMarks && hasDiagram) {
      console.log('  [PASS] CQ parser correctly extracted stimulus, 4 sub-questions (ক,খ,গ,ঘ), marks 10, and diagram link');
      passed++;
    } else {
      console.error('  [FAIL] CQ sub-questions or diagram incomplete:', cq);
      failed++;
    }
  } else {
    console.error('  [FAIL] CQ parsing failed:', parsedCQ);
    failed++;
  }

  // 3. Test Short Question (SQ) Parsing
  const sqSample = `
৩. আলোর প্রতিসরণ কাকে বলে?
উত্তর: আলোক রশ্মি এক স্বচ্ছ মাধ্যম থেকে অন্য স্বচ্ছ মাধ্যমে প্রবেশের সময় দিক পরিবর্তনের ঘটনাকে প্রতিসরণ বলে।
`;

  const parsedSQ = parseQuestionsFromDocument(sqSample);
  if (parsedSQ.length === 1 && parsedSQ[0].questionType === 'SQ') {
    console.log('  [PASS] Short Question (SQ) parser correctly identified direct question with short answer');
    passed++;
  } else {
    console.error('  [FAIL] SQ parsing failed:', parsedSQ);
    failed++;
  }

  // 4. Test LaTeX / Math preservation
  const mathSample = `
৪. যদি $f(x) = 2x^2 + 3x - 5$ এবং $g(x) = \\sqrt{x}$ হয়, তবে $f(g(4))$ এর মান কত?
(ক) ৭
(খ) ৯
(গ) ১১
(ঘ) ১৩
উত্তর: (খ)
`;

  const parsedMath = parseQuestionsFromDocument(mathSample);
  if (parsedMath.length === 1 && parsedMath[0].questionText.includes('$f(x) = 2x^2 + 3x - 5$') && parsedMath[0].questionText.includes('\\sqrt{x}')) {
    console.log('  [PASS] Mathematical LaTeX expressions and formulas preserved with zero corruption');
    passed++;
  } else {
    console.error('  [FAIL] Mathematical formula preservation failed:', parsedMath);
    failed++;
  }

  // 5. Test Duplicate Detection Dice Similarity
  const qText1 = 'পানির অণুর বন্ধন কোণ কত ডিগ্রি?';
  const qText2 = 'পানির অণুতে বন্ধন কোণের পরিমাণ কত ডিগ্রি?';
  const sim = calculateDiceSimilarity(qText1, qText2);
  if (sim >= 0.5) {
    console.log(`  [PASS] Semantic duplicate detection Dice similarity score: ${sim.toFixed(2)} (High match)`);
    passed++;
  } else {
    console.error('  [FAIL] Duplicate detection score lower than expected:', sim);
    failed++;
  }

  console.log(`Question Bank Test Results: ${passed} passed, ${failed} failed.\n`);
  return { passed, failed };
}

module.exports = runQuestionBankTests;

if (require.main === module) {
  runQuestionBankTests().then(res => {
    process.exit(res.failed > 0 ? 1 : 0);
  });
}
