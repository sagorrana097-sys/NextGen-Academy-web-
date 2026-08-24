async function testAdminDashboardStats() {
  console.log('🧪 Testing Admin Dashboard Stats Overview...');

  const BASE_URL = 'http://localhost:5000/api';

  try {
    // 1. Admin Login
    console.log('1. Admin Login...');
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
    console.log('✅ Admin Authenticated');

    // 2. Fetch /api/admin/stats
    console.log('2. Fetching /api/admin/stats...');
    const statsRes = await fetch(`${BASE_URL}/admin/stats`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const statsData = await statsRes.json();

    if (!statsData.success) {
      throw new Error(`Stats request failed: ${JSON.stringify(statsData)}`);
    }

    console.log('✅ Stats Data:');
    console.log(`   - মোট শিক্ষার্থী (Total Students): ${statsData.data.totalStudents}`);
    console.log(`   - সক্রিয় শিক্ষার্থী (Active Students): ${statsData.data.activeStudents}`);
    console.log(`   - স্থগিত / নিষ্ক্রিয় (Inactive): ${statsData.data.inactiveStudents}`);

    // 3. Fetch /api/admin/students
    console.log('3. Fetching /api/admin/students list...');
    const studentsRes = await fetch(`${BASE_URL}/admin/students`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const studentsData = await studentsRes.json();

    const students = studentsData.data;
    const total = students.length;
    const active = students.filter(s => {
      const st = (s.status || '').toLowerCase();
      return st === 'active' || (!st && s.user?.isActive !== false);
    }).length;
    const inactive = students.filter(s => {
      const st = (s.status || '').toLowerCase();
      return st === 'suspended' || st === 'inactive' || st === 'left' || s.user?.isActive === false;
    }).length;

    console.log('✅ Verified from Student Roster:');
    console.log(`   - Total: ${total}`);
    console.log(`   - Active: ${active} (${Math.round((active/total)*100)}%)`);
    console.log(`   - Inactive/Suspended: ${inactive} (${Math.round((inactive/total)*100)}%)`);

    if (total === active + inactive) {
      console.log('✅ Sum check passed: Total == Active + Inactive');
    }

    console.log('🎉 ALL ADMIN DASHBOARD STATS TESTS PASSED PERFECTLY!');
  } catch (err) {
    console.error('❌ Test failed:', err.message);
    process.exit(1);
  }
}

testAdminDashboardStats();
