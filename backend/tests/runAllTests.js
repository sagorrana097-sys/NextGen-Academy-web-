/**
 * NextGen Academy — Master Automated Test Runner
 * Executes all test suites and generates unified test summary
 */

const runSecurityTests = require('./securityAuth.test');
const runQuestionBankTests = require('./questionBankAndCQ.test');
const runUploadSecurityTests = require('./fileUploadSecurity.test');
const runGrammarRegressionTests = require('./grammarRegression.test');
const runEmbeddedImageAndAITests = require('./embeddedImageAndAIPerformance.test');
const { runPdfTests } = require('./pdfDiagramExtraction.test');
const { runDocxEndToEndTest } = require('./docxEndToEnd.test');
const { runProductionHardeningTests } = require('./productionHardening.test');

async function main() {
  console.log('====================================================');
  console.log('🚀 NEXTGEN ACADEMY FULL MASTER TEST SUITE EXECUTION');
  console.log('====================================================\n');

  let totalPassed = 0;
  let totalFailed = 0;

  try {
    const s1 = await runSecurityTests();
    totalPassed += s1.passed;
    totalFailed += s1.failed;

    const s2 = await runQuestionBankTests();
    totalPassed += s2.passed;
    totalFailed += s2.failed;

    const s3 = await runUploadSecurityTests();
    totalPassed += s3.passed;
    totalFailed += s3.failed;

    const s4 = await runGrammarRegressionTests();
    totalPassed += s4.passed;
    totalFailed += s4.failed;

    const s5 = await runEmbeddedImageAndAITests();
    totalPassed += s5.passed;
    totalFailed += s5.failed;

    // Suite 6: PDF Embedded Diagram Extraction
    try {
      await runPdfTests();
      totalPassed += 4;
    } catch (e) {
      console.error('PDF Diagram Extraction Suite failed:', e.message);
      totalFailed += 1;
    }

    // Suite 7: DOCX End-to-End Image Extraction
    try {
      await runDocxEndToEndTest();
      totalPassed += 6;
    } catch (e) {
      console.error('DOCX End-to-End Suite failed:', e.message);
      totalFailed += 1;
    }

    // Suite 8: Production Hardening, Uniqueness, API Fail-safe, Payment Security & Postgres SQL
    try {
      await runProductionHardeningTests();
      totalPassed += 15;
    } catch (e) {
      console.error('Production Hardening Suite failed:', e.message);
      totalFailed += 1;
    }

    console.log('\n====================================================');
    console.log(`TOTAL SUITES EXECUTED: 8`);
    console.log(`TOTAL TESTS PASSED: ${totalPassed}`);
    console.log(`TOTAL TESTS FAILED: ${totalFailed}`);
    console.log('====================================================');

    if (totalFailed > 0) {
      console.error('❌ TEST RUN COMPLETED WITH FAILURES');
      process.exitCode = 1;
    } else {
      console.log('✅ ALL TEST SUITES PASSED FLAWLESSLY');
      process.exitCode = 0;
    }
  } catch (err) {
    console.error('CRITICAL RUNNER ERROR:', err);
    process.exit(1);
  }
}

main();
