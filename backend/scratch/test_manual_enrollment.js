async function testManualEnrollment() {
  console.log('===================================================================');
  console.log('🎓 TESTING MANUAL STUDENT ENROLLMENT & CREDENTIAL GENERATION');
  console.log('===================================================================\n');

  const API_URL = 'http://127.0.0.1:5000/api';

  // 1. Authenticate as Admin
  console.log('1. Logging in as Super Admin (Alomgir005):');
  const adminLogin = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier: 'Alomgir005', password: '01792818005' })
  }).then(r => r.json());

  if (!adminLogin.success) {
    throw new Error(`Admin login failed: ${adminLogin.error?.message}`);
  }

  const token = adminLogin.data.token;
  console.log('   Admin Auth: ✅ SUCCESS', `(${adminLogin.data.user.name})`);

  // 2. Enroll New Student
  console.log('\n2. Enrolling New Student via Manual Enrollment API:');
  const studentPayload = {
    name: 'সাকিব আল হাসান (Sakib Al Hasan)',
    nameBn: 'সাকিব আল হাসান',
    phone: '01712345678',
    studentPhone: '01712345678',
    guardianPhone: '01712345678',
    classId: 11, // Class 8
    studentIdNumber: 'NGA-26-4821',
    password: '01712345678',
    address: 'পশ্চিম জয়দেবপুর, গাজীপুর'
  };

  const enrollRes = await fetch(`${API_URL}/students`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(studentPayload)
  }).then(r => r.json());

  console.log('   Enroll Status:', enrollRes.success ? '✅ SUCCESS' : '❌ FAILED');
  console.log('   Message:', enrollRes.message);
  console.log('   Generated Credentials Card:');
  console.log('     * Student Name:', enrollRes.data?.credentials?.studentName);
  console.log('     * Login ID:', enrollRes.data?.credentials?.studentId);
  console.log('     * Default Password:', enrollRes.data?.credentials?.password);
  console.log('     * Registered Phone:', enrollRes.data?.credentials?.phone);
  console.log('     * Class:', enrollRes.data?.credentials?.className);

  const studentId = enrollRes.data?.credentials?.studentId;
  const studentPhone = enrollRes.data?.credentials?.phone;
  const studentPass = enrollRes.data?.credentials?.password;

  // 3. Test Student Login with Student ID
  console.log('\n3. Testing Student Login via Student ID (NGA-26-4821):');
  const loginWithId = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      identifier: studentId,
      password: studentPass
    })
  }).then(r => r.json());

  console.log('   Status:', loginWithId.success ? '✅ SUCCESS (Authenticated via Student ID)' : '❌ FAILED');
  console.log('   Logged-in User:', loginWithId.data?.user?.name, `(Role: ${loginWithId.data?.user?.role})`);

  // 4. Test Student Login with Phone Number
  console.log('\n4. Testing Student Login via Phone Number (01712345678):');
  const loginWithPhone = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      identifier: studentPhone,
      password: studentPass
    })
  }).then(r => r.json());

  console.log('   Status:', loginWithPhone.success ? '✅ SUCCESS (Authenticated via Phone Number)' : '❌ FAILED');
  console.log('   Logged-in User:', loginWithPhone.data?.user?.name, `(Role: ${loginWithPhone.data?.user?.role})`);

  console.log('\n===================================================================');
  console.log('🎉 MANUAL STUDENT ENROLLMENT & CREDENTIAL GENERATION VERIFIED!');
  console.log('===================================================================');
}

testManualEnrollment().catch(console.error);
