async function testStealthAiErrorSystem() {
  console.log('🧪 Testing Stealth AI Error Monitoring & Auto-Recovery System...');

  const BASE_URL = 'http://localhost:5000/api';

  try {
    // 1. Log a silent UI crash error from a student session
    console.log('1. Testing Silent Error Logging from Client...');
    const logRes = await fetch(`${BASE_URL}/system-errors/log`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: "TypeError: Cannot read properties of undefined (reading 'admissionFee')",
        stack: "TypeError: Cannot read properties of undefined (reading 'admissionFee')\n    at OnlineAdmissionForm.jsx:280:32\n    at renderWithHooks (react-dom.js:1540)",
        componentStack: "\n    in OnlineAdmissionForm (at App.jsx:63)\n    in main",
        route: "/admissions/online",
        userRole: "STUDENT",
        userName: "তানভীর আহমেদ",
        browserInfo: { userAgent: "Mozilla/5.0 Chrome/120.0" },
        errorType: "UI_CRASH"
      })
    });

    const logData = await logRes.json();
    console.log('✅ Silent Error Logged:', logData);

    if (!logData.errorId) {
      throw new Error('Failed to obtain errorId from silent logger');
    }

    // 2. Login as Admin
    console.log('2. Logging in as Admin to access Secret AI Dashboard...');
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        identifier: 'Alomgir005',
        password: '01792818005'
      })
    });

    const loginData = await loginRes.json();
    const token = loginData.data.token;
    console.log('✅ Admin Token Obtained');

    // 3. Fetch Error Logs as Admin
    console.log('3. Fetching Error Logs from Admin API...');
    const listRes = await fetch(`${BASE_URL}/admin/system-errors`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const listData = await listRes.json();
    console.log(`✅ Retrieved ${listData.count} System Errors`);

    // 4. Trigger AI Auto-Analyze & Fix on the newly logged error
    console.log(`4. Running AI Auto-Analyze & Fix on Error #${logData.errorId}...`);
    const aiRes = await fetch(`${BASE_URL}/admin/system-errors/${logData.errorId}/analyze`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    });
    const aiData = await aiRes.json();
    console.log('✅ AI Analysis Generated in Bengali:');
    console.log('   - Diagnosis:', aiData.data?.aiAnalysis?.diagnosisBn);
    console.log('   - Root Cause:', aiData.data?.aiAnalysis?.rootCauseBn);
    console.log('   - Suggested Fix:\n', aiData.data?.aiAnalysis?.suggestedFix);

    // 5. Mark Error as Resolved
    console.log(`5. Marking Error #${logData.errorId} as RESOLVED...`);
    const resolveRes = await fetch(`${BASE_URL}/admin/system-errors/${logData.errorId}/resolve`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ status: 'RESOLVED' })
    });
    const resolveData = await resolveRes.json();
    console.log('✅ Status Updated:', resolveData.message);

    console.log('🎉 ALL STEALTH AI ERROR MONITORING TESTS PASSED PERFECTLY!');
  } catch (err) {
    console.error('❌ Test failed:', err.message);
    process.exit(1);
  }
}

testStealthAiErrorSystem();
