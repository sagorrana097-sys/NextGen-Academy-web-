async function testLoginEndpoints() {
  console.log('Testing login endpoint with Super Admin credentials...');

  const tests = [
    { label: 'Login by Username (Alomgir005)', identifier: 'Alomgir005', password: '01792818005' },
    { label: 'Login by Phone (01792818005)', identifier: '01792818005', password: '01792818005' },
    { label: 'Login by Email (admin@nextgen.edu.bd)', identifier: 'admin@nextgen.edu.bd', password: '01792818005' }
  ];

  for (const t of tests) {
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: t.identifier, password: t.password })
      });
      const data = await res.json();
      if (res.ok && data.success && data.data?.token) {
        console.log(`✅ ${t.label} -> SUCCESS! Role: ${data.data.user.role}, Name: ${data.data.user.name}`);
      } else {
        console.error(`❌ ${t.label} -> FAILED:`, data);
      }
    } catch (err) {
      console.error(`❌ ${t.label} -> ERROR:`, err.message);
    }
  }
}

testLoginEndpoints().catch(console.error);
