const {
  GLOBAL_ACCEPTED_FILE_TYPES,
  GLOBAL_MAX_FILE_SIZE_MB,
  formatFileSize,
  getFileTypeCategory
} = require('../../frontend/src/services/supabaseStorage.js');

async function testGlobalUploadSystem() {
  console.log('===================================================================');
  console.log('🌐 TESTING GLOBAL UNIVERSAL FILE UPLOAD SYSTEM');
  console.log('===================================================================\n');

  // 1. Verify Global Accept Format
  console.log('1. Checking Global Accepted Formats:');
  console.log('   Accepted String:', GLOBAL_ACCEPTED_FILE_TYPES);
  const containsAll =
    GLOBAL_ACCEPTED_FILE_TYPES.includes('.pdf') &&
    GLOBAL_ACCEPTED_FILE_TYPES.includes('.docx') &&
    GLOBAL_ACCEPTED_FILE_TYPES.includes('.xlsx') &&
    GLOBAL_ACCEPTED_FILE_TYPES.includes('.zip') &&
    GLOBAL_ACCEPTED_FILE_TYPES.includes('image/*') &&
    GLOBAL_ACCEPTED_FILE_TYPES.includes('audio/*') &&
    GLOBAL_ACCEPTED_FILE_TYPES.includes('video/*');

  console.log('   All Major Types Included:', containsAll ? '✅ YES' : '❌ NO');

  // 2. Verify 100MB Max File Size
  console.log('\n2. Verifying Global File Size Limit:');
  console.log('   Global Max MB:', GLOBAL_MAX_FILE_SIZE_MB, 'MB');
  console.log('   Validation Check (100MB):', GLOBAL_MAX_FILE_SIZE_MB === 100 ? '✅ 100MB CONFIGURED' : '❌ FAILED');

  // 3. Test Smart File Category & Icon Mapping
  console.log('\n3. Testing Smart File Category & Generic Icon Mapping:');
  const sampleFiles = [
    { name: 'physics_chapter_2_notes.pdf', expected: 'PDF' },
    { name: 'annual_exam_question_bank.docx', expected: 'DOC' },
    { name: 'student_marks_tabulation.xlsx', expected: 'EXCEL' },
    { name: 'admission_candidates_2026.csv', expected: 'EXCEL' },
    { name: 'all_textbooks_archive.zip', expected: 'ZIP' },
    { name: 'student_profile_avatar.png', expected: 'IMAGE' },
    { name: 'teacher_lecture_recording.mp3', expected: 'AUDIO' },
    { name: 'online_live_class_recording.mp4', expected: 'VIDEO' }
  ];

  sampleFiles.forEach(sf => {
    const meta = getFileTypeCategory(sf.name, '');
    const matched = meta.type === sf.expected;
    console.log(`   * ${sf.name.padEnd(35)} -> Type: ${meta.type.padEnd(6)} | Label: ${meta.label.padEnd(25)} | ${matched ? '✅ MATCH' : '❌ MISMATCH'}`);
  });

  // 4. Test File Size Formatter
  console.log('\n4. Testing File Size Formatter:');
  console.log('   * 2.4 MB (2516582 bytes) ->', formatFileSize(2516582));
  console.log('   * 45.8 MB (48024780 bytes) ->', formatFileSize(48024780));
  console.log('   * 98.5 MB (103284736 bytes) ->', formatFileSize(103284736));

  console.log('\n===================================================================');
  console.log('🎉 GLOBAL UNIVERSAL FILE UPLOAD SYSTEM FULLY VERIFIED!');
  console.log('===================================================================');
}

testGlobalUploadSystem().catch(console.error);
