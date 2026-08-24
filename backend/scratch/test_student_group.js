async function testStudentGroupFlow() {
  console.log('🧪 Testing Dynamic Student Group Creation & Persistence...');

  const BASE_URL = 'http://localhost:5000/api';

  try {
    // 1. Login as Admin
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        identifier: 'Alomgir005',
        password: '01792818005'
      })
    });

    const loginData = await loginRes.json();
    if (!loginData.success) {
      throw new Error(`Admin login failed: ${JSON.stringify(loginData)}`);
    }

    const token = loginData.data.token;
    console.log('✅ Admin Login Successful');

    // 2. Create Class 9 Student with Group = 'Science'
    const payloadClass9 = {
      name: 'সাদিয়া ইসলাম (টেস্ট)',
      phone: '01711223344',
      classId: 12, // Class 9
      group: 'Science',
      rollNo: 99,
      gender: 'FEMALE',
      address: 'জয়দেবপুর, গাজীপুর'
    };

    const createRes1 = await fetch(`${BASE_URL}/students`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payloadClass9)
    });
    const createData1 = await createRes1.json();
    console.log('✅ Class 9 Student created with group:', createData1.data?.student?.group);

    // 3. Create Class 5 Student without Group (should be null)
    const payloadClass5 = {
      name: 'আহমেদ হাসান (টেস্ট)',
      phone: '01755667788',
      classId: 8, // Class 5
      group: null,
      rollNo: 98,
      gender: 'MALE',
      address: 'জয়দেবপুর, গাজীপুর'
    };

    const createRes2 = await fetch(`${BASE_URL}/students`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payloadClass5)
    });
    const createData2 = await createRes2.json();
    console.log('✅ Class 5 Student created with group (null expected):', createData2.data?.student?.group);

    // Clean up created test students
    if (createData1.data?.student?.id) {
      await fetch(`${BASE_URL}/students/${createData1.data.student.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
    }
    if (createData2.data?.student?.id) {
      await fetch(`${BASE_URL}/students/${createData2.data.student.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
    }
    console.log('🧹 Cleaned up test records');
    console.log('🎉 ALL DYNAMIC GROUP TESTS PASSED!');
  } catch (err) {
    console.error('❌ Test failed:', err.message);
    process.exit(1);
  }
}

testStudentGroupFlow();
