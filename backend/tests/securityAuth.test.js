/**
 * Security & Auth Automated Test Suite
 * Validates:
 * 1. Unauthenticated requests to /api/student/* are rejected with 401 (verifying removal of safeAuth backdoor)
 * 2. IDOR Prevention: /api/exams/student/:studentId enforces student ownership
 * 3. IDOR Prevention: /api/results/report-card/:studentId enforces student ownership
 * 4. IDOR Prevention: /api/analytics/student/:studentId enforces student ownership
 */

const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../middleware/auth');
const express = require('express');

async function runSecurityTests() {
  console.log('--- [TEST SUITE 1: AUTHENTICATION & IDOR SECURITY] ---');
  let passed = 0;
  let failed = 0;

  // Setup Express server with protected routes
  const app = express();
  app.use(express.json());

  const studentRoutes = require('../routes/student');
  const examsRoutes = require('../routes/exams');
  const resultsRoutes = require('../routes/results');
  const analyticsRoutes = require('../routes/analytics');

  app.use('/api/student', studentRoutes);
  app.use('/api/exams', examsRoutes);
  app.use('/api/results', resultsRoutes);
  app.use('/api/analytics', analyticsRoutes);

  const server = app.listen(5991);
  const BASE_URL = 'http://localhost:5991';

  try {
    // 1. Unauthenticated request to /api/student/profile must return 401
    const res1 = await fetch(`${BASE_URL}/api/student/profile`);
    const data1 = await res1.json();
    if (res1.status === 401 && data1.success === false) {
      console.log('  [PASS] Unauthenticated access to /api/student/profile correctly rejected with 401');
      passed++;
    } else {
      console.error('  [FAIL] Unauthenticated access was NOT rejected! Status:', res1.status, data1);
      failed++;
    }

    // 2. Unauthenticated request to /api/student/dashboard-aggregate must return 401
    const res2 = await fetch(`${BASE_URL}/api/student/dashboard-aggregate`);
    const data2 = await res2.json();
    if (res2.status === 401 && data2.success === false) {
      console.log('  [PASS] Unauthenticated access to /api/student/dashboard-aggregate rejected with 401');
      passed++;
    } else {
      console.error('  [FAIL] Unauthenticated /api/student/dashboard-aggregate was NOT rejected! Status:', res2.status);
      failed++;
    }

    // Generate tokens for existing Student User ID 3
    const studentToken = jwt.sign(
      { userId: 3, id: 3, role: 'STUDENT', email: 'student_test@nextgen.edu.bd' },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    // 3. IDOR: Student 3 trying to access Student 999 exams (/api/exams/student/999) must be rejected with 403 Forbidden
    const res3 = await fetch(`${BASE_URL}/api/exams/student/999`, {
      headers: { Authorization: `Bearer ${studentToken}` }
    });
    const data3 = await res3.json();
    if (res3.status === 403 && data3.success === false) {
      console.log('  [PASS] IDOR guard /api/exams/student/999 correctly returns 403 Forbidden for Student');
      passed++;
    } else {
      console.error('  [FAIL] IDOR guard failed for /api/exams/student/999! Status:', res3.status, data3);
      failed++;
    }

    // 4. IDOR: Student 3 trying to access Student 999 report-card (/api/results/report-card/999) must be rejected with 403 Forbidden
    const res4 = await fetch(`${BASE_URL}/api/results/report-card/999`, {
      headers: { Authorization: `Bearer ${studentToken}` }
    });
    const data4 = await res4.json();
    if (res4.status === 403 && data4.success === false) {
      console.log('  [PASS] IDOR guard /api/results/report-card/999 correctly returns 403 Forbidden for Student');
      passed++;
    } else {
      console.error('  [FAIL] IDOR guard failed for /api/results/report-card/999! Status:', res4.status, data4);
      failed++;
    }

    // 5. IDOR: Student 3 trying to access Student 999 analytics (/api/analytics/student/999) must be rejected with 403 Forbidden
    const res5 = await fetch(`${BASE_URL}/api/analytics/student/999`, {
      headers: { Authorization: `Bearer ${studentToken}` }
    });
    const data5 = await res5.json();
    if (res5.status === 403 && data5.success === false) {
      console.log('  [PASS] IDOR guard /api/analytics/student/999 correctly returns 403 Forbidden for Student');
      passed++;
    } else {
      console.error('  [FAIL] IDOR guard failed for /api/analytics/student/999! Status:', res5.status, data5);
      failed++;
    }

  } finally {
    await new Promise((resolve) => server.close(resolve));
  }

  console.log(`Security Test Results: ${passed} passed, ${failed} failed.\n`);
  return { passed, failed };
}

module.exports = runSecurityTests;

if (require.main === module) {
  runSecurityTests().then(res => {
    process.exit(res.failed > 0 ? 1 : 0);
  });
}
