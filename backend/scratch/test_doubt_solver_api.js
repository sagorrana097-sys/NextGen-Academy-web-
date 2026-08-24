async function testDoubtSolverApi() {
  console.log('🧪 Testing 24/7 AI Doubt Solver Backend API (/api/solve-doubt)...');

  const BASE_URL = 'http://localhost:5000/api';

  try {
    // 1. Test Math Prompt
    console.log('1. Testing Math Doubt: "পিথাগোরাসের উপপাদ্য বুঝিয়ে দাও"...');
    const mathRes = await fetch(`${BASE_URL}/solve-doubt`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'পিথাগোরাসের উপপাদ্য বুঝিয়ে দাও',
        studentClass: 'Class 9',
        subject: 'General Math'
      })
    });
    const mathData = await mathRes.json();
    console.log('✅ Math Response Received:');
    console.log(mathData.reply.slice(0, 200) + '...\n');

    // 2. Test Physics Prompt
    console.log('2. Testing Physics Doubt: "ওহমের সূত্র ও গাণিতিক উদাহরণ"...');
    const phyRes = await fetch(`${BASE_URL}/solve-doubt`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'ওহমের সূত্র ও গাণিতিক উদাহরণ দাও',
        studentClass: 'Class 10',
        subject: 'Physics'
      })
    });
    const phyData = await phyRes.json();
    console.log('✅ Physics Response Received:');
    console.log(phyData.reply.slice(0, 200) + '...\n');

    // 3. Test ICT Prompt
    console.log('3. Testing ICT Doubt: "বাইনারি থেকে ডেসিমাল রূপান্তর"...');
    const ictRes = await fetch(`${BASE_URL}/solve-doubt`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'বাইনারি থেকে ডেসিমাল রূপান্তর কিভাবে করতে হয়?',
        studentClass: 'Class 9',
        subject: 'ICT'
      })
    });
    const ictData = await ictRes.json();
    console.log('✅ ICT Response Received:');
    console.log(ictData.reply.slice(0, 200) + '...\n');

    console.log('🎉 ALL 24/7 AI DOUBT SOLVER TESTS PASSED PERFECTLY!');
  } catch (err) {
    console.error('❌ Test failed:', err.message);
    process.exit(1);
  }
}

testDoubtSolverApi();
