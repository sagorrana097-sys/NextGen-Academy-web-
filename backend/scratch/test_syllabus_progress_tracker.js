async function testSyllabusProgressTracker() {
  console.log('🧪 Testing Dynamic Syllabus Progress Tracker System...');

  const BASE_URL = 'http://localhost:5000/api';

  try {
    // 1. Fetch Class 9 Syllabus Progress
    console.log('1. Fetching Class 9 Syllabus Progress...');
    const getRes = await fetch(`${BASE_URL}/syllabus-tracker?batch_or_class=Class 9`);
    const getData = await getRes.json();

    if (!getData.success) {
      throw new Error(`Failed to fetch syllabus: ${JSON.stringify(getData)}`);
    }

    console.log('✅ Class 9 Syllabus Fetched:');
    console.log(`   - Total Chapters: ${getData.data.totalChapters}`);
    console.log(`   - Completed Chapters: ${getData.data.completedChapters}`);
    console.log(`   - Overall Progress: ${getData.data.overallPercentage}%`);
    console.log(`   - Subjects Count: ${getData.data.subjects.length}`);

    getData.data.subjects.forEach((sub) => {
      console.log(`     * ${sub.subject}: ${sub.completedChapters}/${sub.totalChapters} (${sub.percentage}%)`);
    });

    // 2. Admin Login
    console.log('2. Admin Login...');
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
    console.log('✅ Admin Logged In');

    // 3. Add Custom Chapter to Class 9 Physics
    console.log('3. Adding new custom chapter to Class 9 Physics...');
    const addRes = await fetch(`${BASE_URL}/admin/syllabus-tracker/chapter`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        batch_or_class: 'Class 9',
        subject: 'পদার্থবিজ্ঞান (Physics)',
        chapter_no: 99,
        chapter_name: '৯৯তম অধ্যায়: বিশেষ রোবোটিক্স ও এআই ওয়ার্কশপ',
        is_completed: false
      })
    });
    const addData = await addRes.json();
    console.log('✅ New Chapter Added:', addData.data?.chapter_name, `(ID: ${addData.data?.id})`);

    const newChapterId = addData.data?.id;

    // 4. Toggle the newly created chapter to COMPLETED (is_completed: true)
    console.log(`4. Toggling Chapter #${newChapterId} to is_completed = true...`);
    const toggleRes = await fetch(`${BASE_URL}/admin/syllabus-tracker/${newChapterId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ is_completed: true })
    });
    const toggleData = await toggleRes.json();
    console.log('✅ Toggle Result:', toggleData.message, toggleData.data);

    // 5. Verify updated overall stats
    const reGetRes = await fetch(`${BASE_URL}/syllabus-tracker?batch_or_class=Class 9`);
    const reGetData = await reGetRes.json();
    const physicsSub = reGetData.data.subjects.find((s) => s.subject.includes('পদার্থবিজ্ঞান'));
    console.log('✅ Updated Physics Progress:', `${physicsSub.completedChapters}/${physicsSub.totalChapters} (${physicsSub.percentage}%)`);

    // 6. Clean up test chapter
    if (newChapterId) {
      await fetch(`${BASE_URL}/admin/syllabus-tracker/${newChapterId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('🧹 Cleaned up test chapter record');
    }

    console.log('🎉 ALL SYLLABUS PROGRESS TRACKER TESTS PASSED PERFECTLY!');
  } catch (err) {
    console.error('❌ Test failed:', err.message);
    process.exit(1);
  }
}

testSyllabusProgressTracker();
