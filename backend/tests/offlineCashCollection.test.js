/**
 * Offline Cash Fee Collection & Receipt Verification Suite
 * Tests:
 * 1. Frontend API verification: accountsAPI.collectOfflineCash is a function and exported
 * 2. Unauthenticated requests to /api/accounts/offline-cash return 401
 * 3. Unauthorized roles (STUDENT, TEACHER) return 403
 * 4. Validation: Missing required fields or non-positive baseAmount returns 400
 * 5. Validation: Non-existent student ID returns 404
 * 6. Successful offline cash payment by ADMIN/ACCOUNTANT returns 201 with invoice, payment, receipt
 * 7. Duplicate payment detection within 30-second window returns 409
 * 8. Receipt retrieval via GET /api/accounts/receipt/:invoiceId returns 200 with full receipt slip
 */

const express = require('express');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const { JWT_SECRET } = require('../middleware/auth');

const TEST_PORT = 5994;
const BASE_URL = `http://localhost:${TEST_PORT}`;

async function runOfflineCashTests() {
  console.log('================================================================');
  console.log('--- [TEST SUITE: OFFLINE CASH FEE COLLECTION & RECEIPT API] ---');
  console.log('================================================================');

  let passed = 0;
  let failed = 0;

  // 1. Verify frontend service export
  console.log('\n[Phase 1] Verifying Frontend API export in frontend/src/services/api.js...');
  try {
    const apiJsPath = path.join(__dirname, '../../frontend/src/services/api.js');
    const apiJsContent = fs.readFileSync(apiJsPath, 'utf8');
    const hasCollectOfflineCashMethod = apiJsContent.includes("collectOfflineCash: (data) => request('/accounts/offline-cash'");
    const hasCollectOfflineCashExport = apiJsContent.includes('export const collectOfflineCash =');

    if (hasCollectOfflineCashMethod && hasCollectOfflineCashExport) {
      console.log('  [PASS] accountsAPI.collectOfflineCash method and named export are present in api.js');
      passed++;
    } else {
      console.error('  [FAIL] Missing collectOfflineCash in api.js', { hasCollectOfflineCashMethod, hasCollectOfflineCashExport });
      failed++;
    }
  } catch (err) {
    console.error('  [FAIL] Error checking api.js:', err.message);
    failed++;
  }

  // Backup DB file before running tests
  const dbPath = path.join(__dirname, '../data/nextgen_academy_db.json');
  const originalDb = fs.readFileSync(dbPath, 'utf-8');
  const db = JSON.parse(originalDb);

  // Setup test environment data
  // Ensure we have an accountant user and a student record
  const testStudentUserId = 3; // Student Test user
  const testAccountantUserId = 9991;
  
  if (!db.users.find(u => u.id === testAccountantUserId)) {
    db.users.push({
      id: testAccountantUserId,
      name: 'Test Accountant',
      email: 'accountant@nextgen.edu.bd',
      role: 'ACCOUNTANT',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  }

  const testStudentId = 101;
  if (!db.students.find(s => s.id === testStudentId)) {
    db.students.push({
      id: testStudentId,
      userId: testStudentUserId,
      classId: 10,
      sectionId: 1,
      rollNo: '০১',
      studentIdNumber: 'NGA-2026-0101',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  }

  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf-8');

  // Setup express test server
  const app = express();
  app.use(express.json());
  const accountsRoutes = require('../routes/accounts');
  app.use('/api/accounts', accountsRoutes);

  const server = app.listen(TEST_PORT);

  try {
    // Generate JWT tokens for test roles
    // User 1 is SUPER_ADMIN
    const adminToken = jwt.sign(
      { id: 1, role: 'SUPER_ADMIN' },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
    // User 9991 is ACCOUNTANT
    const accountantToken = jwt.sign(
      { id: testAccountantUserId, role: 'ACCOUNTANT' },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
    // User 3 is STUDENT
    const studentToken = jwt.sign(
      { id: 3, role: 'STUDENT' },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
    // User 2 is TEACHER
    const teacherToken = jwt.sign(
      { id: 2, role: 'TEACHER' },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    console.log('\n[Phase 2] Verifying Authentication & Role-Based Access Control...');

    // Test 2: Unauthenticated POST returns 401
    const resUnauth = await fetch(`${BASE_URL}/api/accounts/offline-cash`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId: testStudentId, feeType: 'টিউশন ফি', baseAmount: 2000 })
    });
    if (resUnauth.status === 401) {
      console.log('  [PASS] Unauthenticated request correctly rejected with 401');
      passed++;
    } else {
      console.error('  [FAIL] Expected 401 for unauthenticated request, got:', resUnauth.status);
      failed++;
    }

    // Test 3: Unauthorized role (STUDENT) returns 403
    const resForbiddenStudent = await fetch(`${BASE_URL}/api/accounts/offline-cash`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${studentToken}`
      },
      body: JSON.stringify({ studentId: testStudentId, feeType: 'টিউশন ফি', baseAmount: 2000 })
    });
    if (resForbiddenStudent.status === 403) {
      console.log('  [PASS] Student role rejected with 403 Forbidden');
      passed++;
    } else {
      console.error('  [FAIL] Expected 403 for student role, got:', resForbiddenStudent.status);
      failed++;
    }

    // Test 4: Unauthorized role (TEACHER) returns 403
    const resForbiddenTeacher = await fetch(`${BASE_URL}/api/accounts/offline-cash`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${teacherToken}`
      },
      body: JSON.stringify({ studentId: testStudentId, feeType: 'টিউশন ফি', baseAmount: 2000 })
    });
    if (resForbiddenTeacher.status === 403) {
      console.log('  [PASS] Teacher role rejected with 403 Forbidden');
      passed++;
    } else {
      console.error('  [FAIL] Expected 403 for teacher role, got:', resForbiddenTeacher.status);
      failed++;
    }

    console.log('\n[Phase 3] Verifying Validation Rules...');

    // Test 5: Missing baseAmount returns 400
    const resMissingAmount = await fetch(`${BASE_URL}/api/accounts/offline-cash`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({ studentId: testStudentId, feeType: 'টিউশন ফি' })
    });
    if (resMissingAmount.status === 400) {
      console.log('  [PASS] Missing baseAmount correctly returns 400 Bad Request');
      passed++;
    } else {
      console.error('  [FAIL] Expected 400 for missing baseAmount, got:', resMissingAmount.status);
      failed++;
    }

    // Test 6: Zero or negative baseAmount returns 400
    const resNegativeAmount = await fetch(`${BASE_URL}/api/accounts/offline-cash`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({ studentId: testStudentId, feeType: 'টিউশন ফি', baseAmount: -500 })
    });
    if (resNegativeAmount.status === 400) {
      console.log('  [PASS] Negative baseAmount correctly returns 400 Bad Request');
      passed++;
    } else {
      console.error('  [FAIL] Expected 400 for negative baseAmount, got:', resNegativeAmount.status);
      failed++;
    }

    // Test 7: Non-existent studentId returns 404
    const resInvalidStudent = await fetch(`${BASE_URL}/api/accounts/offline-cash`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({ studentId: 888888, feeType: 'টিউশন ফি', baseAmount: 1500 })
    });
    if (resInvalidStudent.status === 404) {
      console.log('  [PASS] Non-existent student returns 404 Not Found');
      passed++;
    } else {
      console.error('  [FAIL] Expected 404 for non-existent student, got:', resInvalidStudent.status);
      failed++;
    }

    console.log('\n[Phase 4] Verifying Successful Cash Collection & Money Receipt...');

    // Test 8: Valid payment by Admin
    const validPayload = {
      studentId: testStudentId,
      feeType: 'পরীক্ষার ফি (টেস্ট)',
      month: '2026-04',
      year: 2026,
      baseAmount: 2500,
      discountAmount: 200,
      discountReason: 'মেধাবী শিক্ষার্থী ডিসকাউন্ট',
      paidAmount: 2300,
      receivedBy: 'মোঃ রফিকুল ইসলাম (অ্যাডমিন)',
      paymentDate: '2026-04-10',
      remarks: 'অফিসে সরাসরি নগদ জমা প্রদান করা হলো।'
    };

    const resSuccess = await fetch(`${BASE_URL}/api/accounts/offline-cash`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify(validPayload)
    });
    const successData = await resSuccess.json();

    let createdInvoiceId = null;
    if (
      resSuccess.status === 201 &&
      successData.success === true &&
      successData.data?.receipt?.receiptNo &&
      successData.data?.receipt?.paymentDetails?.paidAmount === 2300 &&
      successData.data?.receipt?.paymentDetails?.amountInWords &&
      successData.data?.payment?.method === 'CASH'
    ) {
      createdInvoiceId = successData.data.invoice.id;
      console.log('  [PASS] Offline cash collection succeeded with status 201');
      console.log(`         Receipt No: ${successData.data.receipt.receiptNo}`);
      console.log(`         Amount in Words: ${successData.data.receipt.paymentDetails.amountInWords}`);
      console.log(`         Student: ${successData.data.receipt.student.name} (${successData.data.receipt.student.className})`);
      passed++;
    } else {
      console.error('  [FAIL] Valid payment failed:', resSuccess.status, successData);
      failed++;
    }

    console.log('\n[Phase 5] Verifying Duplicate Payment Protection...');

    // Test 9: Rapid duplicate submission within 30 seconds returns 409
    const resDuplicate = await fetch(`${BASE_URL}/api/accounts/offline-cash`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify(validPayload)
    });
    const dupData = await resDuplicate.json();
    if (resDuplicate.status === 409 && dupData.success === false) {
      console.log('  [PASS] Duplicate payment prevented with status 409 Conflict');
      passed++;
    } else {
      console.error('  [FAIL] Expected 409 for duplicate payment, got:', resDuplicate.status, dupData);
      failed++;
    }

    console.log('\n[Phase 6] Verifying Money Receipt Retrieval via GET /api/accounts/receipt/:id...');

    // Test 10: Receipt retrieval
    if (createdInvoiceId) {
      const resReceipt = await fetch(`${BASE_URL}/api/accounts/receipt/${createdInvoiceId}`, {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      const receiptData = await resReceipt.json();
      if (resReceipt.status === 200 && receiptData.success && receiptData.data?.receiptNo) {
        console.log(`  [PASS] Receipt fetched successfully for Invoice #${createdInvoiceId}`);
        passed++;
      } else {
        console.error('  [FAIL] Failed to fetch receipt for invoice:', resReceipt.status, receiptData);
        failed++;
      }
    }

  } finally {
    server.close();
    // Restore original DB state so test runs don't leave dirty test records
    fs.writeFileSync(dbPath, originalDb, 'utf-8');
  }

  console.log('\n================================================================');
  console.log(`SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('================================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runOfflineCashTests().catch(err => {
  console.error('FATAL TEST ERROR:', err);
  process.exit(1);
});
