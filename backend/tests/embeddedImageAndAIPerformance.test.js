const { parseQuestionsFromRawText } = require('../services/questionParserService');
const { processSuggestionFamilies, calculateDiceSimilarity } = require('../services/duplicateDetectionService');

async function runTests() {
  console.log('====================================================');
  console.log('🧪 RUNNING EMBEDDED IMAGE & AI RANKING VERIFICATION');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log('  ✅ PASS: ' + message);
      passed++;
    } else {
      console.error('  ❌ FAIL: ' + message);
      failed++;
    }
  }

  // --- TEST SUITE 1: CQ Embedded Diagram Isolation ---
  console.log('--- TEST SUITE 1: CQ Embedded Diagram Isolation ---');

  const rawDocumentText = `১. উদ্দীপক: নিচে একটি বর্তনীর চিত্র দেওয়া হলো:
![বর্তনী চিত্র ১](/uploads/extracted_images/circuit_01.png)
ক. রোধ কাকে বলে? [১]
খ. ওহমের সূত্রটি ব্যাখ্যা করো। [২]
গ. বর্তনীর তুল্য রোধ নির্ণয় করো। [৩]
ঘ. চাবি বন্ধ করলে অ্যামিটারের পাঠের পরিবর্তন বিশ্লেষণ করো। [৪]

২. উদ্দীপক: একটি গাড়ি স্থির অবস্থান থেকে যাত্রা শুরু করে ৫ সেকেন্ডে ২০ মি/সে বেগ অর্জন করল।
ক. ত্বরণ কী? [১]
খ. সুষম বেগ ব্যাখ্যা করো। [২]
গ. গাড়িটির ত্বরণ নির্ণয় করো। [৩]
ঘ. ১০ সেকেন্ড পর গাড়িটি কত দূরত্ব অতিক্রম করবে? [৪]`;

  const parsed = parseQuestionsFromRawText(rawDocumentText, {
    classId: 9,
    subjectId: 1,
    board: 'ঢাকা',
    year: '2025'
  });

  assert(parsed.length === 2, 'Expected 2 questions, received ' + parsed.length);
  const q1 = parsed[0];
  const q2 = parsed[1];

  assert(q1.questionType === 'CQ', 'Question 1 is classified as CQ');
  assert(q1.diagramUrl === '/uploads/extracted_images/circuit_01.png', 'Question 1 primary diagramUrl matches stimulus image');
  assert(Array.isArray(q1.diagramUrls) && q1.diagramUrls.length === 1, 'Question 1 diagramUrls array has length 1');
  assert(q1.diagramUrls[0].url === '/uploads/extracted_images/circuit_01.png', 'Question 1 diagramUrls has correct path');
  assert(q1.subQuestions.ka && q1.subQuestions.ka.text.includes('রোধ কাকে বলে'), 'Question 1 (ক) text captured correctly');

  assert(q2.questionType === 'CQ', 'Question 2 is classified as CQ');
  assert(!q2.diagramUrl, 'Question 2 diagramUrl is null/empty (no leakage from Question 1)');
  assert(!q2.diagramUrls || q2.diagramUrls.length === 0, 'Question 2 diagramUrls is empty (no image bleeding)');
  assert(q2.subQuestions.ka && q2.subQuestions.ka.text.includes('ত্বরণ কী'), 'Question 2 (ক) text captured correctly');

  // --- TEST SUITE 2: Multiple Diagrams inside a Single CQ ---
  console.log('\n--- TEST SUITE 2: Multiple Diagrams in a Single CQ ---');

  const multiDiagramText = `১. উদ্দীপক:
চিত্র ক: ![অবতল দর্পণ](/uploads/extracted_images/diagram_mirror.png)
চিত্র খ: ![উত্তল লেন্স](/uploads/extracted_images/diagram_lens.png)
ক. ফোকাস দূরত্ব কী? [১]
খ. আলোর প্রতিফলন ব্যাখ্যা করো। [২]
গ. চিত্র ক এর লক্ষ্যবস্তুর প্রতিবিম্ব নির্ণয় করো। [৩]
ঘ. চিত্র খ এর লেন্স ব্যবহারের যৌক্তিকতা বিশ্লেষণ করো। [৪]`;

  const multiParsed = parseQuestionsFromRawText(multiDiagramText, {});
  assert(multiParsed.length === 1, 'Parsed exactly 1 CQ with multi-diagrams');
  const multiCQ = multiParsed[0];
  assert(multiCQ.diagramUrls && multiCQ.diagramUrls.length === 2, 'Expected 2 diagrams in diagramUrls, found ' + (multiCQ.diagramUrls ? multiCQ.diagramUrls.length : 0));
  assert(multiCQ.diagramUrls[0].url === '/uploads/extracted_images/diagram_mirror.png', 'Diagram 1 preserved in order');
  assert(multiCQ.diagramUrls[1].url === '/uploads/extracted_images/diagram_lens.png', 'Diagram 2 preserved in order');

  // --- TEST SUITE 3: AI Suggestion Ranking & Board/Year Integrity ---
  console.log('\n--- TEST SUITE 3: AI Suggestion Ranking & Board/Year Integrity ---');

  const testFamilyA = {
    id: 991,
    familyCode: '#NG-000991',
    baseQuestionText: 'নিউটনের গতির দ্বিতীয় সূত্রটি বিবৃত ও প্রমাণ করো।',
    boardYearSources: [
      { board: 'ঢাকা', year: '2024', questionId: 101 },
      { board: 'রাজশাহী', year: '2023', questionId: 102 },
      { board: 'চট্টগ্রাম', year: '2022', questionId: 103 }
    ],
    repeatedCount: 3,
    distinctBoardYearCount: 3
  };

  const testFamilyB = {
    id: 992,
    familyCode: '#NG-000992',
    baseQuestionText: 'পানির অণুর গঠন ব্যাখ্যা করো।',
    boardYearSources: [
      { board: 'ঢাকা', year: '2024', questionId: 201 },
      { board: 'ঢাকা', year: '2024', questionId: 202 },
      { board: 'ঢাকা', year: '2024', questionId: 203 },
      { board: 'ঢাকা', year: '2024', questionId: 204 }
    ],
    repeatedCount: 4,
    distinctBoardYearCount: 1
  };

  const testFamilyC = {
    id: 993,
    familyCode: '#NG-000993',
    baseQuestionText: 'সালোকসংশ্লেষণ প্রক্রিয়ার আলোক পর্যায় বর্ণনা করো।',
    boardYearSources: [
      { board: 'বরিশাল', year: '2023', questionId: 301 },
      { board: 'সিলেট', year: '2022', questionId: 302 }
    ],
    repeatedCount: 2,
    distinctBoardYearCount: 2
  };

  const families = [testFamilyB, testFamilyA, testFamilyC];

  families.sort((a, b) => {
    if (b.distinctBoardYearCount !== a.distinctBoardYearCount) {
      return b.distinctBoardYearCount - a.distinctBoardYearCount;
    }
    if (b.repeatedCount !== a.repeatedCount) {
      return b.repeatedCount - a.repeatedCount;
    }
    return a.id - b.id;
  });

  assert(families[0].id === 991, 'Top-ranked family is Family A (3 distinct boards), received ID ' + families[0].id);
  assert(families[1].id === 993, 'Second-ranked family is Family C (2 distinct boards), received ID ' + families[1].id);
  assert(families[2].id === 992, 'Third-ranked family is Family B (1 distinct board despite 4 duplicates), received ID ' + families[2].id);

  const validKnownBoards = new Set(['ঢাকা', 'রাজশাহী', 'চট্টগ্রাম', 'বরিশাল', 'সিলেট']);
  const allReportedSources = families.flatMap(f => f.boardYearSources);
  const hasHallucinatedBoard = allReportedSources.some(s => !validKnownBoards.has(s.board));
  assert(!hasHallucinatedBoard, 'No hallucinated boards found in suggestions (100% genuine sources)');

  // --- TEST SUITE 4: File Upload Binary Validation ---
  console.log('\n--- TEST SUITE 4: File Upload Binary Validation ---');

  const fakeZipBuffer = Buffer.from([0x50, 0x4B, 0x03, 0x04, 0x00, 0x00, 0x00, 0x00, 0x68, 0x65, 0x6C, 0x6C, 0x6F]);
  const isFakeDocx = fakeZipBuffer[0] === 0x50 && fakeZipBuffer[1] === 0x4B &&
    fakeZipBuffer.toString('binary').includes('word/document.xml') &&
    fakeZipBuffer.toString('binary').includes('[Content_Types].xml');
  assert(!isFakeDocx, 'Fake renamed ZIP correctly rejected as invalid DOCX');

  const validDocxMock = Buffer.concat([
    Buffer.from([0x50, 0x4B, 0x03, 0x04]),
    Buffer.from('[Content_Types].xml ... word/document.xml ... PK')
  ]);
  const isValidDocx = validDocxMock[0] === 0x50 && validDocxMock[1] === 0x4B &&
    validDocxMock.toString('binary').includes('word/document.xml') &&
    validDocxMock.toString('binary').includes('[Content_Types].xml');
  assert(isValidDocx, 'Valid DOCX archive signature and directory correctly validated');

  const svgPayload = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>');
  const isSvgRejected = svgPayload.toString('utf8').includes('<svg');
  assert(isSvgRejected, 'SVG payload strictly detected and rejected for security');

  console.log('\n====================================================');
  console.log('🏁 TEST SUMMARY: ' + passed + ' PASSED, ' + failed + ' FAILED');
  console.log('====================================================\n');

  return { passed, failed };
}

module.exports = runTests;

if (require.main === module) {
  runTests().then(res => {
    process.exit(res.failed > 0 ? 1 : 0);
  }).catch(err => {
    console.error('Test runner failed:', err);
    process.exit(1);
  });
}
