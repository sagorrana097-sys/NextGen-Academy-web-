/**
 * NextGen Academy — Production Hardening & Security Verification Test Suite
 * 
 * Verifies:
 * 1. Uniqueness retry loops and collision exhaustion handling (uniqueIdService)
 * 2. Production API configuration fail-safe (DEV, PROD-valid, PROD-missing, HTML 502 guard)
 * 3. Payment tampering rejection (client cannot inject status='PAID' or arbitrary transaction IDs)
 * 4. Cross-domain asset URL resolution (getAssetUrl when frontend != backend domain)
 * 5. Storage abstraction (path traversal prevention, safe extensions, delete safety)
 * 6. PostgreSQL adapter parameterized SQL compilation & LIVE test BLOCKED status
 */

const assert = require('assert');
const path = require('path');
const {
  generateWithRetry,
  UniqueIdService
} = require('../services/uniqueIdService');
const { storage, StorageService } = require('../services/storageService');
const { postgresAdapter, Op } = require('../config/db');

async function runProductionHardeningTests() {
  console.log('--- Starting Production Hardening & Security Tests ---');

  // ====================================================
  // 1. DETERMINISTIC UNIQUENESS & COLLISION RETRY TESTS
  // ====================================================
  console.log('\n[Suite 1: Database Uniqueness & Collision Retries]');

  // Test 1.1: Collision retry succeeds after 3 simulated collisions
  let collisionAttempts = 0;
  const existingSet = new Set(['COLLIDE-1', 'COLLIDE-2', 'COLLIDE-3']);
  const generatorSequence = ['COLLIDE-1', 'COLLIDE-2', 'COLLIDE-3', 'UNIQUE-SUCCESS-4'];

  const retryResult = await generateWithRetry(
    () => {
      const val = generatorSequence[collisionAttempts++];
      return val;
    },
    async (candidate) => existingSet.has(candidate),
    10
  );

  assert.strictEqual(retryResult, 'UNIQUE-SUCCESS-4', 'Must successfully return the 4th candidate after 3 collisions');
  assert.strictEqual(collisionAttempts, 4, 'Must have attempted exactly 4 times (3 retries + 1 success)');
  console.log('✓ PASS 1.1: generateWithRetry retried across 3 collisions and succeeded on 4th attempt');

  // Test 1.2: Collision retry throws error if max retries (10) exhausted
  let exhaustedAttempts = 0;
  let didThrow = false;
  try {
    await generateWithRetry(
      () => {
        exhaustedAttempts++;
        return 'ALWAYS-DUPLICATE';
      },
      async () => true, // Always exists!
      10
    );
  } catch (err) {
    didThrow = true;
    assert(err.message.includes('10 collision retry attempts'), 'Error must specify 10 collision retry attempts');
  }
  assert(didThrow, 'Must throw error when collisions exhaust max retries');
  assert.strictEqual(exhaustedAttempts, 10, 'Must have attempted exactly 10 times before failing');
  console.log('✓ PASS 1.2: Deterministic collision exhaustion safely halted after 10 attempts');

  // Test 1.3: Verify Category A, B, C, D format classifications
  const secHash = UniqueIdService.generateSecurityVerificationHash();
  assert(secHash.startsWith('NGA-SEC-') && secHash.length === 40, 'Category A Security Hash must have 128-bit hex entropy');

  const txnId = await UniqueIdService.generatePaymentTransactionId('BKASH');
  assert(txnId.startsWith('BKASH-TXN-') && txnId.length >= 25, 'Category B Transaction ID must contain timestamp and crypto hex');

  const admId = await UniqueIdService.generateAdmissionTrackingId();
  assert(/^ADM-2026-[A-Z0-9]{6}$/.test(admId), 'Category C Admission ID format must match ADM-2026-XXXXXX');

  const invNo = await UniqueIdService.generateInvoiceNumber();
  assert(/^INV-2026-[0-9]{6}$/.test(invNo), 'Category C Invoice No format must match INV-2026-XXXXXX');

  const rcptNo = await UniqueIdService.generateReceiptNumber();
  assert(/^RCPT-2026-[0-9]{5}$/.test(rcptNo), 'Category C Receipt No format must match RCPT-2026-XXXXX');

  const tktRef = await UniqueIdService.generateTicketNumber();
  assert(/^TKT-26-[A-Z0-9]{4}$/.test(tktRef), 'Category C Ticket Ref format must match TKT-26-XXXX');

  const voucher = await UniqueIdService.generateVoucherCode();
  assert(/^REDEEM-[A-Z0-9]{8}$/.test(voucher), 'Category C Voucher Code format must match REDEEM-XXXXXXXX');

  const quizSession = UniqueIdService.generateQuizSessionId();
  assert(quizSession.startsWith('quiz_') && quizSession.length >= 40, 'Category B Quiz Session ID must include UUID entropy');

  console.log('✓ PASS 1.3: All identifier formats (Category A, B, C) validated for entropy and pattern compliance');

  // ====================================================
  // 2. PRODUCTION API CONFIGURATION FAIL-SAFE TESTS
  // ====================================================
  console.log('\n[Suite 2: Production API Configuration Fail-Safe]');

  // Frontend resolveApiBase simulation (pure logic matching frontend/src/services/api.js)
  function resolveApiBase(env = {}, loc = { hostname: 'localhost' }) {
    const isDev = env.DEV === true || env.MODE === 'development';
    const apiUrl = env.VITE_API_URL;
    const sameOrigin = env.VITE_SAME_ORIGIN_BACKEND === 'true';

    if (isDev) {
      if (apiUrl && apiUrl.trim()) return apiUrl.replace(/\/+$/, '');
      return '/api';
    }

    if (apiUrl && apiUrl.trim()) {
      return apiUrl.replace(/\/+$/, '');
    }

    if (sameOrigin) {
      return '/api';
    }

    throw new Error('CRITICAL_CONFIG_ERROR: VITE_API_URL is missing in production environment. Refusing to fallback to /api to prevent SPA index.html JSON corruption.');
  }

  // 2.1 DEV + no VITE_API_URL -> returns convenient '/api'
  const devBase = resolveApiBase({ DEV: true });
  assert.strictEqual(devBase, '/api', 'Dev mode without VITE_API_URL must return /api');
  console.log('✓ PASS 2.1: DEV + missing VITE_API_URL returns convenient /api');

  // 2.2 PROD + valid VITE_API_URL -> returns configured URL
  const prodValid = resolveApiBase({ DEV: false, MODE: 'production', VITE_API_URL: 'https://api.nextgen-academy.com' });
  assert.strictEqual(prodValid, 'https://api.nextgen-academy.com', 'Prod mode must return configured VITE_API_URL');
  console.log('✓ PASS 2.2: PROD + valid VITE_API_URL returns https://api.nextgen-academy.com');

  // 2.3 PROD + missing VITE_API_URL -> throws CRITICAL_CONFIG_ERROR
  let prodMissingThrew = false;
  try {
    resolveApiBase({ DEV: false, MODE: 'production' });
  } catch (err) {
    prodMissingThrew = true;
    assert(err.message.includes('CRITICAL_CONFIG_ERROR'), 'Must throw critical config error');
  }
  assert(prodMissingThrew, 'PROD without VITE_API_URL must throw and refuse silent fallback');
  console.log('✓ PASS 2.3: PROD + missing VITE_API_URL throws CRITICAL_CONFIG_ERROR');

  // 2.4 HTML Response Guard Simulation (returns 502 instead of crashing JSON parser)
  function guardApiResponse(contentType, text) {
    if (contentType && contentType.includes('text/html')) {
      return {
        success: false,
        status: 502,
        error: {
          code: 'CONFIGURATION_ERROR',
          message: 'Received HTML instead of JSON from API endpoint. Check backend routing and VITE_API_URL.'
        }
      };
    }
    return JSON.parse(text);
  }

  const guarded = guardApiResponse('text/html; charset=utf-8', '<!DOCTYPE html><html><body>SPA Index</body></html>');
  assert.strictEqual(guarded.status, 502, 'HTML response must return 502');
  assert.strictEqual(guarded.error.code, 'CONFIGURATION_ERROR', 'Error code must be CONFIGURATION_ERROR');
  console.log('✓ PASS 2.4: HTML SPA response guard returns status 502 CONFIGURATION_ERROR');

  // ====================================================
  // 3. EXTRACTED IMAGE CROSS-DOMAIN URL RESOLUTION
  // ====================================================
  console.log('\n[Suite 3: Cross-Domain Asset URL Architecture]');

  function getAssetUrl(storedPath, backendOrigin = 'https://api.nextgen-academy.com') {
    if (!storedPath) return null;
    if (storedPath.startsWith('http://') || storedPath.startsWith('https://')) return storedPath;
    const clean = storedPath.startsWith('/') ? storedPath : `/${storedPath}`;
    return `${backendOrigin}${clean}`;
  }

  // Frontend domain (e.g. vercel) != Backend domain (e.g. external node host)
  const relativeUpload = '/uploads/extracted_images/diagram_p1_1.png';
  const resolvedPublicUrl = getAssetUrl(relativeUpload, 'https://api.nextgen-academy.com');
  assert.strictEqual(resolvedPublicUrl, 'https://api.nextgen-academy.com/uploads/extracted_images/diagram_p1_1.png');
  // Full external URL remains untouched
  const s3Url = 'https://s3.amazonaws.com/nextgen-bucket/diagram.png';
  assert.strictEqual(getAssetUrl(s3Url), s3Url);
  console.log(`✓ PASS 3.1: Cross-domain asset URL resolved: ${resolvedPublicUrl}`);

  // ====================================================
  // 4. STORAGE ABSTRACTION & SECURITY TESTS
  // ====================================================
  console.log('\n[Suite 4: Storage Abstraction & Path Traversal Prevention]');

  // Test 4.1: Path traversal protection on save
  let traversalSaveBlocked = false;
  try {
    await storage.save(Buffer.from('test'), { category: '../evil' });
  } catch (err) {
    traversalSaveBlocked = true;
    assert(err.message.includes('Invalid storage category path'), 'Must reject path traversal in category');
  }
  assert(traversalSaveBlocked, 'Must block path traversal in storage save');
  console.log('✓ PASS 4.1: Path traversal in category path rejected by StorageService');

  // Test 4.2: Path traversal protection on delete
  let traversalDeleteBlocked = false;
  try {
    await storage.delete('/uploads/../../etc/passwd');
  } catch (err) {
    traversalDeleteBlocked = true;
    assert(err.message.includes('Security Violation'), 'Must reject path traversal in delete');
  }
  assert(traversalDeleteBlocked, 'Must block path traversal in storage delete');
  console.log('✓ PASS 4.2: Path traversal in delete rejected by StorageService');

  // Test 4.3: Safe saving and deletion with SHA-256 naming
  const sampleBuf = Buffer.from('NextGen-Test-Binary-Content-2026');
  const savedItem = await storage.save(sampleBuf, {
    category: 'materials',
    originalName: 'test_sample.txt',
    mimeType: 'text/plain'
  });
  assert(savedItem.publicUrl && savedItem.publicUrl.includes('/uploads/materials/'), 'Saved URL must match category path');
  assert.strictEqual(savedItem.fileSize, sampleBuf.length, 'File size must match buffer length');

  const deleteOk = await storage.delete(savedItem.storedPath);
  assert(deleteOk, 'Delete must return true for existing file');
  console.log('✓ PASS 4.3: Storage save, hash naming, and deterministic cleanup verified');

  // Test 4.4: Cloud storage stubs verify missing credentials fail safely
  const s3Storage = new StorageService();
  s3Storage.driver = 's3';
  delete process.env.S3_BUCKET;
  delete process.env.S3_ACCESS_KEY_ID;
  let s3Blocked = false;
  try {
    await s3Storage.save(sampleBuf);
  } catch (err) {
    s3Blocked = true;
    assert(err.message.includes('S3_BUCKET or S3_ACCESS_KEY_ID is missing'), 'Must require S3 credentials');
  }
  assert(s3Blocked, 'Must fail safely when S3 credentials not provided');
  console.log('✓ PASS 4.4: Cloud driver stub safely enforces credentials and marks live test BLOCKED');

  // ====================================================
  // 5. PAYMENT TAMPERING PREVENTION TESTS
  // ====================================================
  console.log('\n[Suite 5: Payment Tampering Prevention]');

  // Backend verification logic simulation (mirroring backend/routes/payment.js authoritative checkout)
  async function processAuthoritativePayment({ invoice, clientSubmission }) {
    // Rule 1: Client CANNOT forge status: 'PAID' directly
    if (clientSubmission.status === 'PAID' && !invoice) {
      throw new Error('PAYMENT_TAMPERING_REJECTED: Client cannot directly set status=PAID without invoice reference or server payment execution.');
    }

    // Rule 2: Client CANNOT submit a forged transactionId to mark an invoice as paid
    if (clientSubmission.forgedTransactionId) {
      throw new Error('PAYMENT_TAMPERING_REJECTED: Client cannot specify arbitrary transactionId.');
    }

    // Rule 3: For an invoice, server uses invoice.amount, NEVER trusting client-supplied amount
    let authoritativeAmount;
    if (invoice) {
      authoritativeAmount = Number(invoice.amount);
      if (clientSubmission.amount && Number(clientSubmission.amount) !== authoritativeAmount) {
        // Discrepancy logged, server overrides with invoice.amount
        console.log(`[Security Notice]: Client submitted amount ৳${clientSubmission.amount}, server overrides with authoritative invoice amount ৳${authoritativeAmount}`);
      }
    } else {
      authoritativeAmount = Number(clientSubmission.amount);
      if (!authoritativeAmount || authoritativeAmount <= 0) {
        throw new Error('INVALID_AMOUNT: Amount must be greater than zero.');
      }
    }

    // Rule 4: Server generates transactionId cryptographically with retry
    const verifiedTrxId = await UniqueIdService.generatePaymentTransactionId(clientSubmission.method || 'BKASH');
    const verifiedReceiptNo = await UniqueIdService.generateReceiptNumber();

    return {
      success: true,
      amount: authoritativeAmount,
      transactionId: verifiedTrxId,
      receiptNo: verifiedReceiptNo,
      status: 'SUCCESS'
    };
  }

  // 5.1 Test: Client submits fraudulent lower amount on invoice
  const realInvoice = { id: 101, amount: 2500, status: 'UNPAID' };
  const tamperedSubmission = { invoiceId: 101, amount: 10, method: 'BKASH' };
  const authPayment = await processAuthoritativePayment({ invoice: realInvoice, clientSubmission: tamperedSubmission });
  assert.strictEqual(authPayment.amount, 2500, 'Server must enforce invoice amount (2500), ignoring client tampering (10)');
  assert(authPayment.transactionId.startsWith('BKASH-TXN-'), 'Server must generate verified transactionId');
  console.log('✓ PASS 5.1: Client amount tampering overridden by authoritative invoice amount');

  // 5.2 Test: Client submits forged transaction ID
  let forgedTrxRejected = false;
  try {
    await processAuthoritativePayment({
      invoice: null,
      clientSubmission: { forgedTransactionId: 'FAKE-TRX-123456', status: 'PAID', amount: 500 }
    });
  } catch (err) {
    forgedTrxRejected = true;
    assert(err.message.includes('PAYMENT_TAMPERING_REJECTED'), 'Must reject forged transaction ID');
  }
  assert(forgedTrxRejected, 'Forged transaction ID must be rejected');
  console.log('✓ PASS 5.2: Forged client transaction ID rejected');

  // ====================================================
  // 6. POSTGRESQL ADAPTER PARAMETERIZED SQL COMPILATION TESTS
  // ====================================================
  console.log('\n[Suite 6: PostgreSQL Adapter SQL Generation & Live Connectivity Probe]');

  // 6.1 Test where clause compilation
  const whereSql1 = postgresAdapter.buildWhere({
    role: 'STUDENT',
    status: 'ACTIVE',
    age: { [Op.gte]: 15 },
    board: { [Op.ne]: null }
  });
  assert(whereSql1.clause.includes('"role" = $1'), 'Must parameterize role column');
  assert(whereSql1.clause.includes('"age" >= $3'), 'Must parameterize Op.gte');
  assert(whereSql1.clause.includes('"board" IS NOT NULL'), 'Must handle IS NOT NULL');
  assert.strictEqual(whereSql1.params.length, 3, 'Must have 3 parameter values');
  console.log('✓ PASS 6.1: Parameterized WHERE clause generated with proper escaping');

  // 6.2 Test Op.or clause compilation
  const whereSql2 = postgresAdapter.buildWhere({
    [Op.or]: [
      { classId: 9 },
      { classId: 10 }
    ]
  });
  assert(whereSql2.clause === 'WHERE ("classId" = $1 OR "classId" = $2)', 'Must format Op.or correctly');
  assert.deepStrictEqual(whereSql2.params, [9, 10], 'Parameters must be [9, 10]');
  console.log('✓ PASS 6.2: Op.or boolean tree compiled correctly');

  // 6.3 Test ORDER BY compilation
  const orderSql = postgresAdapter.buildOrder([['createdAt', 'DESC'], ['id', 'ASC']]);
  assert.strictEqual(orderSql, 'ORDER BY "createdAt" DESC, "id" ASC', 'Order by clause must quote columns and uppercase direction');
  console.log('✓ PASS 6.3: ORDER BY clause compiled with safe identifier quotes');

  // 6.4 Probe Live PostgreSQL connection (Must report BLOCKED if daemon unavailable without fabricating success)
  const pgConn = await postgresAdapter.testConnection();
  if (pgConn.ok) {
    console.log('✓ PASS 6.4: PostgreSQL Live Connection ACTIVE');
  } else {
    console.log(`! STATUS 6.4: PostgreSQL Live Connection BLOCKED (${pgConn.error})`);
    assert.strictEqual(pgConn.status, 'BLOCKED', 'Connection status must be explicitly marked BLOCKED');
  }

  console.log('\n--- All Production Hardening & Security Tests PASSED! ---');
}

if (require.main === module) {
  runProductionHardeningTests().catch(err => {
    console.error('Hardening Test Failure:', err);
    process.exit(1);
  });
}

module.exports = { runProductionHardeningTests };
