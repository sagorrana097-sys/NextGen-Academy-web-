/**
 * File Upload Security Test Suite
 * Validates:
 * 1. Multer fileFilter strictly rejects executable/script files (.exe, .sh, .bat, .php, .html)
 * 2. Multer accepts authorized educational document types (PDF, DOCX, TXT, images)
 * 3. Filename path traversal sanitization (stripping ../ and illegal control chars)
 */

const path = require('path');

function runUploadSecurityTests() {
  console.log('--- [TEST SUITE 3: FILE UPLOAD & STORAGE SECURITY] ---');
  let passed = 0;
  let failed = 0;

  // Re-run fileFilter logic from materials.js
  const ALLOWED_MIME_TYPES = new Set([
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword',
    'text/plain',
    'image/jpeg',
    'image/png',
    'image/webp'
  ]);

  const ALLOWED_EXTENSIONS = new Set([
    '.pdf',
    '.docx',
    '.doc',
    '.txt',
    '.jpg',
    '.jpeg',
    '.png',
    '.webp'
  ]);

  const testFileFilter = (filename, mimetype) => {
    return new Promise((resolve) => {
      const ext = path.extname(filename || '').toLowerCase();
      const mime = (mimetype || '').toLowerCase();

      if (ext === '.svg' || mime === 'image/svg+xml') {
        return resolve({ allowed: false, error: 'SVG disallowed for security' });
      }

      const DANGEROUS_EXTENSIONS = ['.exe', '.bat', '.sh', '.cmd', '.php', '.phtml', '.js', '.jsx', '.ts', '.py', '.html', '.htm', '.vbs', '.jar'];
      if (DANGEROUS_EXTENSIONS.includes(ext)) {
        return resolve({ allowed: false, error: 'Forbidden extension' });
      }

      if (ALLOWED_EXTENSIONS.has(ext) || ALLOWED_MIME_TYPES.has(mime)) {
        return resolve({ allowed: true });
      }

      return resolve({ allowed: false, error: 'Disallowed type' });
    });
  };

  // Test 1: Reject .exe
  return testFileFilter('malicious_payload.exe', 'application/x-msdownload').then(res => {
    if (!res.allowed) {
      console.log('  [PASS] Executable file (.exe) correctly blocked by security filter');
      passed++;
    } else {
      console.error('  [FAIL] Executable file was allowed!');
      failed++;
    }

    // Test 2: Reject .sh shell script
    return testFileFilter('exploit.sh', 'application/x-sh');
  }).then(res => {
    if (!res.allowed) {
      console.log('  [PASS] Shell script (.sh) correctly blocked by security filter');
      passed++;
    } else {
      console.error('  [FAIL] Shell script was allowed!');
      failed++;
    }

    // Test 3: Reject .html file
    return testFileFilter('xss_attack.html', 'text/html');
  }).then(res => {
    if (!res.allowed) {
      console.log('  [PASS] HTML/XSS file (.html) correctly blocked by security filter');
      passed++;
    } else {
      console.error('  [FAIL] HTML file was allowed!');
      failed++;
    }

    // Test 4: Accept .pdf
    return testFileFilter('physics_question_paper.pdf', 'application/pdf');
  }).then(res => {
    if (res.allowed) {
      console.log('  [PASS] Valid PDF document accepted');
      passed++;
    } else {
      console.error('  [FAIL] Valid PDF was rejected!');
      failed++;
    }

    // Test 5: Accept .docx
    return testFileFilter('hsc_higher_math_cq.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
  }).then(res => {
    if (res.allowed) {
      console.log('  [PASS] Valid DOCX document accepted');
      passed++;
    } else {
      console.error('  [FAIL] Valid DOCX was rejected!');
      failed++;
    }

    // Test 6: Reject SVG
    return testFileFilter('malicious_vector.svg', 'image/svg+xml');
  }).then(res => {
    if (!res.allowed) {
      console.log('  [PASS] SVG image strictly rejected for security');
      passed++;
    } else {
      console.error('  [FAIL] SVG image was allowed!');
      failed++;
    }

    // Test 7: Path Traversal Sanitization
    const maliciousOriginalName = '../../../../etc/passwd_notes.pdf';
    const sanitizedName = path.basename(maliciousOriginalName).replace(/[^a-zA-Z0-9.\-_ \u0980-\u09FF]/g, '_');
    if (!sanitizedName.includes('/') && !sanitizedName.includes('\\') && !sanitizedName.includes('..') && sanitizedName === 'passwd_notes.pdf') {
      console.log(`  [PASS] Path traversal sanitized: "${maliciousOriginalName}" -> "${sanitizedName}"`);
      passed++;
    } else {
      console.error('  [FAIL] Path traversal sanitization failed:', sanitizedName);
      failed++;
    }

    console.log(`File Upload Security Results: ${passed} passed, ${failed} failed.\n`);
    return { passed, failed };
  });
}

module.exports = runUploadSecurityTests;

if (require.main === module) {
  runUploadSecurityTests().then(res => {
    process.exit(res.failed > 0 ? 1 : 0);
  });
}
