const bcrypt = require('bcryptjs');
const {
  User,
  Student,
  Teacher,
  GuardianStudentMapping,
  Class,
  Section,
  Subject,
  TeacherClassAssignment,
  Attendance,
  ExamTerm,
  Mark,
  Invoice,
  Payment,
  Notice,
  Routine,
  AuditLog,
  Homework,
  HomeworkStatus,
  StudyMaterial,
  Textbook,
  TeacherAttendance,
  Exam,
  ExamSubmission,
  LiveClass,
  LiveClassComment,
  Achiever
} = require('../models');
const { globalDB } = require('../config/db');

async function seedDatabase() {
  console.log('🌱 Initializing Clean Production Database for NextGen Academy...');

  // Reset existing tables
  globalDB.tables = {};
  globalDB.save();

  const saltRounds = 12;
  const adminPassword = bcrypt.hashSync('01792818005', saltRounds);

  // 1. Create Primary Super Admin User ONLY
  const adminUser = await User.create({
    id: 1,
    name: 'মো: আলমগীর হোসেন (Md. Alomgir Hossain)',
    username: 'Alomgir005',
    userId: 'Alomgir005',
    identifier: 'Alomgir005',
    email: 'admin@nextgen.edu.bd',
    password: adminPassword,
    passwordHash: adminPassword,
    role: 'SUPER_ADMIN',
    phone: '01792818005',
    isActive: true
  });

  // 2. Complete Classes (Pre-Primary, Primary, Secondary, Higher Secondary)
  const classesData = [
    // Pre-Primary
    { id: 1, nameBn: 'প্লে গ্রুপ (Play)', nameEn: 'Play Group', numericGrade: -2, stage: 'PRE_PRIMARY' },
    { id: 2, nameBn: 'নার্সারি (Nursery)', nameEn: 'Nursery', numericGrade: -1, stage: 'PRE_PRIMARY' },
    { id: 3, nameBn: 'কেজি (KG)', nameEn: 'Kindergarten (KG)', numericGrade: 0, stage: 'PRE_PRIMARY' },
    // Primary (Class 1-5)
    { id: 4, nameBn: '১ম শ্রেণি (Class 1)', nameEn: 'Class 1', numericGrade: 1, stage: 'PRIMARY' },
    { id: 5, nameBn: '২য় শ্রেণি (Class 2)', nameEn: 'Class 2', numericGrade: 2, stage: 'PRIMARY' },
    { id: 6, nameBn: '৩য় শ্রেণি (Class 3)', nameEn: 'Class 3', numericGrade: 3, stage: 'PRIMARY' },
    { id: 7, nameBn: '৪র্থ শ্রেণি (Class 4)', nameEn: 'Class 4', numericGrade: 4, stage: 'PRIMARY' },
    { id: 8, nameBn: '৫ম শ্রেণি (Class 5)', nameEn: 'Class 5', numericGrade: 5, stage: 'PRIMARY' },
    // Junior Secondary & Secondary (Class 6-10)
    { id: 9, nameBn: '৬ষ্ঠ শ্রেণি (Class 6)', nameEn: 'Class 6', numericGrade: 6, stage: 'JUNIOR_SECONDARY' },
    { id: 10, nameBn: '৭ম শ্রেণি (Class 7)', nameEn: 'Class 7', numericGrade: 7, stage: 'JUNIOR_SECONDARY' },
    { id: 11, nameBn: '৮ম শ্রেণি (Class 8)', nameEn: 'Class 8', numericGrade: 8, stage: 'JUNIOR_SECONDARY' },
    { id: 12, nameBn: '৯ম শ্রেণি (Class 9 - SSC)', nameEn: 'Class 9', numericGrade: 9, stage: 'SECONDARY' },
    { id: 13, nameBn: '১০ম শ্রেণি (Class 10 - SSC)', nameEn: 'Class 10', numericGrade: 10, stage: 'SECONDARY' },
    // Higher Secondary (Class 11-12 / HSC)
    { id: 14, nameBn: 'একাদশ শ্রেণি (Class 11 - HSC)', nameEn: 'Class 11', numericGrade: 11, stage: 'HIGHER_SECONDARY' },
    { id: 15, nameBn: 'দ্বাদশ শ্রেণি (Class 12 - HSC)', nameEn: 'Class 12', numericGrade: 12, stage: 'HIGHER_SECONDARY' }
  ];
  await Class.bulkCreate(classesData);

  // 3. Sections for Classes
  const sectionsData = [];
  let secId = 1;
  for (const c of classesData) {
    if (c.numericGrade >= 11) {
      // College Groups
      sectionsData.push({ id: secId++, classId: c.id, nameBn: 'বিজ্ঞান (Science-A)', nameEn: 'Science-A' });
      sectionsData.push({ id: secId++, classId: c.id, nameBn: 'ব্যবসায় শিক্ষা (Commerce-A)', nameEn: 'Commerce-A' });
      sectionsData.push({ id: secId++, classId: c.id, nameBn: 'মানবিক (Humanities-A)', nameEn: 'Humanities-A' });
    } else {
      sectionsData.push({ id: secId++, classId: c.id, nameBn: 'পদ্মা (Padma)', nameEn: 'Padma' });
      sectionsData.push({ id: secId++, classId: c.id, nameBn: 'মেঘনা (Meghna)', nameEn: 'Meghna' });
      sectionsData.push({ id: secId++, classId: c.id, nameBn: 'যমুনা (Jamuna)', nameEn: 'Jamuna' });
    }
  }
  await Section.bulkCreate(sectionsData);

  // 4. Complete National Curriculum Subjects
  const subjectsData = [];
  let subId = 1;

  // Pre-Primary Subjects (Play, Nursery, KG - IDs 1, 2, 3)
  for (const cid of [1, 2, 3]) {
    subjectsData.push(
      { id: subId++, classId: cid, nameBn: 'বাংলা বর্ণমালা ও ছড়া', nameEn: 'Bangla Alphabet & Rhymes', code: 'PRE-BAN', totalMarks: 50 },
      { id: subId++, classId: cid, nameBn: 'English Phonics & Rhymes', nameEn: 'English Phonics & Rhymes', code: 'PRE-ENG', totalMarks: 50 },
      { id: subId++, classId: cid, nameBn: 'প্রাথমিক সংখ্যা ও গণিত', nameEn: 'Early Math & Numbers', code: 'PRE-MAT', totalMarks: 50 },
      { id: subId++, classId: cid, nameBn: 'ড্রয়িং ও কালারিং আর্ট', nameEn: 'Drawing & Coloring Art', code: 'PRE-ART', totalMarks: 50 },
      { id: subId++, classId: cid, nameBn: 'সাধারণ জ্ঞান ও নীতিশিক্ষা', nameEn: 'General Knowledge & Moral Habits', code: 'PRE-GK', totalMarks: 50 }
    );
  }

  // Primary Subjects (Class 1 - 5 - IDs 4, 5, 6, 7, 8)
  for (const cid of [4, 5, 6, 7, 8]) {
    subjectsData.push(
      { id: subId++, classId: cid, nameBn: 'আমার বাংলা বই', nameEn: 'Bangla', code: `PRI-BAN-${cid}`, totalMarks: 100 },
      { id: subId++, classId: cid, nameBn: 'English for Today', nameEn: 'English for Today', code: `PRI-ENG-${cid}`, totalMarks: 100 },
      { id: subId++, classId: cid, nameBn: 'প্রাথমিক গণিত', nameEn: 'Elementary Mathematics', code: `PRI-MAT-${cid}`, totalMarks: 100 },
      { id: subId++, classId: cid, nameBn: 'প্রাথমিক বিজ্ঞান', nameEn: 'Elementary Science', code: `PRI-SCI-${cid}`, totalMarks: 100 },
      { id: subId++, classId: cid, nameBn: 'বাংলাদেশ ও বিশ্বপরিচয়', nameEn: 'Bangladesh & Global Studies', code: `PRI-BGS-${cid}`, totalMarks: 100 },
      { id: subId++, classId: cid, nameBn: 'ইসলাম ও নৈতিক শিক্ষা / ধর্ম', nameEn: 'Religious & Moral Studies', code: `PRI-REL-${cid}`, totalMarks: 100 }
    );
  }

  // Junior Secondary Subjects (Class 6 - 8 - IDs 9, 10, 11)
  for (const cid of [9, 10, 11]) {
    subjectsData.push(
      { id: subId++, classId: cid, nameBn: 'বাংলা ১ম ও ২য় পত্র', nameEn: 'Bangla 1st & 2nd Paper', code: `JSC-BAN-${cid}`, totalMarks: 100 },
      { id: subId++, classId: cid, nameBn: 'English Grammar & Composition', nameEn: 'English Grammar & Comp', code: `JSC-ENG-${cid}`, totalMarks: 100 },
      { id: subId++, classId: cid, nameBn: 'সাধারণ গণিত', nameEn: 'General Mathematics', code: `JSC-MAT-${cid}`, totalMarks: 100 },
      { id: subId++, classId: cid, nameBn: 'সাধারণ বিজ্ঞান', nameEn: 'General Science', code: `JSC-SCI-${cid}`, totalMarks: 100 },
      { id: subId++, classId: cid, nameBn: 'তথ্য ও যোগাযোগ প্রযুক্তি (ICT)', nameEn: 'Information & Comm. Technology (ICT)', code: `JSC-ICT-${cid}`, totalMarks: 50 },
      { id: subId++, classId: cid, nameBn: 'বাংলাদেশ ও বিশ্বপরিচয়', nameEn: 'Bangladesh & Global Studies', code: `JSC-BGS-${cid}`, totalMarks: 100 },
      { id: subId++, classId: cid, nameBn: 'ইসলাম ও নৈতিক শিক্ষা', nameEn: 'Islamic Studies & Ethics', code: `JSC-ISL-${cid}`, totalMarks: 100 }
    );
  }

  // Secondary Subjects (Class 9 - 10 - IDs 12, 13 - SSC)
  for (const cid of [12, 13]) {
    subjectsData.push(
      { id: subId++, classId: cid, nameBn: 'বাংলা ১ম ও ২য় পত্র', nameEn: 'Bangla 1st & 2nd Paper', code: `SSC-BAN-${cid}`, totalMarks: 100 },
      { id: subId++, classId: cid, nameBn: 'English 1st & 2nd Paper', nameEn: 'English 1st & 2nd Paper', code: `SSC-ENG-${cid}`, totalMarks: 100 },
      { id: subId++, classId: cid, nameBn: 'সাধারণ গণিত', nameEn: 'General Mathematics', code: `SSC-MAT-${cid}`, totalMarks: 100 },
      { id: subId++, classId: cid, nameBn: 'উচ্চতর গণিত', nameEn: 'Higher Mathematics', code: `SSC-HMAT-${cid}`, totalMarks: 100 },
      { id: subId++, classId: cid, nameBn: 'পদার্থবিজ্ঞান', nameEn: 'Physics', code: `SSC-PHY-${cid}`, totalMarks: 100 },
      { id: subId++, classId: cid, nameBn: 'রসায়ন', nameEn: 'Chemistry', code: `SSC-CHEM-${cid}`, totalMarks: 100 },
      { id: subId++, classId: cid, nameBn: 'জীববিজ্ঞান', nameEn: 'Biology', code: `SSC-BIO-${cid}`, totalMarks: 100 },
      { id: subId++, classId: cid, nameBn: 'তথ্য ও যোগাযোগ প্রযুক্তি (ICT)', nameEn: 'ICT', code: `SSC-ICT-${cid}`, totalMarks: 50 },
      { id: subId++, classId: cid, nameBn: 'বাংলাদেশ ও বিশ্বপরিচয়', nameEn: 'Bangladesh & Global Studies', code: `SSC-BGS-${cid}`, totalMarks: 100 },
      { id: subId++, classId: cid, nameBn: 'ধর্ম ও নৈতিক শিক্ষা', nameEn: 'Religious Education', code: `SSC-REL-${cid}`, totalMarks: 100 }
    );
  }

  // Higher Secondary Subjects (Class 11 - 12 - IDs 14, 15 - HSC)
  for (const cid of [14, 15]) {
    // Compulsory
    subjectsData.push(
      { id: subId++, classId: cid, nameBn: 'বাংলা ১ম ও ২য় পত্র (আবশ্যিক)', nameEn: 'Bangla 1st & 2nd Paper', code: `HSC-BAN-${cid}`, totalMarks: 100 },
      { id: subId++, classId: cid, nameBn: 'English 1st & 2nd Paper (Compulsory)', nameEn: 'English 1st & 2nd Paper', code: `HSC-ENG-${cid}`, totalMarks: 100 },
      { id: subId++, classId: cid, nameBn: 'তথ্য ও যোগাযোগ প্রযুক্তি (ICT)', nameEn: 'ICT (Compulsory)', code: `HSC-ICT-${cid}`, totalMarks: 100 }
    );
    // Science Group
    subjectsData.push(
      { id: subId++, classId: cid, nameBn: 'পদার্থবিজ্ঞান ১ম ও ২য় পত্র (বিজ্ঞান)', nameEn: 'Physics 1st & 2nd Paper', code: `HSC-PHY-${cid}`, totalMarks: 100 },
      { id: subId++, classId: cid, nameBn: 'রসায়ন ১ম ও ২য় পত্র (বিজ্ঞান)', nameEn: 'Chemistry 1st & 2nd Paper', code: `HSC-CHEM-${cid}`, totalMarks: 100 },
      { id: subId++, classId: cid, nameBn: 'উচ্চতর গণিত ১ম ও ২য় পত্র (বিজ্ঞান)', nameEn: 'Higher Mathematics 1st & 2nd', code: `HSC-HMAT-${cid}`, totalMarks: 100 },
      { id: subId++, classId: cid, nameBn: 'জীববিজ্ঞান ১ম ও ২য় পত্র (বিজ্ঞান)', nameEn: 'Biology 1st & 2nd Paper', code: `HSC-BIO-${cid}`, totalMarks: 100 }
    );
    // Business Studies Group
    subjectsData.push(
      { id: subId++, classId: cid, nameBn: 'হিসাববিজ্ঞান ১ম ও ২য় পত্র (ব্যবসায় শিক্ষা)', nameEn: 'Accounting 1st & 2nd Paper', code: `HSC-ACC-${cid}`, totalMarks: 100 },
      { id: subId++, classId: cid, nameBn: 'ব্যবসায় সংগঠন ও ব্যবস্থাপনা (ব্যবসায় শিক্ষা)', nameEn: 'Business Organization & Mgmt', code: `HSC-BOM-${cid}`, totalMarks: 100 },
      { id: subId++, classId: cid, nameBn: 'ফিন্যান্স, ব্যাংকিং ও বিমা (ব্যবসায় শিক্ষা)', nameEn: 'Finance, Banking & Insurance', code: `HSC-FIN-${cid}`, totalMarks: 100 }
    );
    // Humanities Group
    subjectsData.push(
      { id: subId++, classId: cid, nameBn: 'অর্থনীতি ১ম ও ২য় পত্র (মানবিক)', nameEn: 'Economics 1st & 2nd Paper', code: `HSC-ECO-${cid}`, totalMarks: 100 },
      { id: subId++, classId: cid, nameBn: 'পৌরনীতি ও সুশাসন (মানবিক)', nameEn: 'Civics & Good Governance', code: `HSC-CIV-${cid}`, totalMarks: 100 },
      { id: subId++, classId: cid, nameBn: 'সমাজবিজ্ঞান / ইসলামের ইতিহাস (মানবিক)', nameEn: 'Sociology & Islamic History', code: `HSC-SOC-${cid}`, totalMarks: 100 }
    );
  }
  await Subject.bulkCreate(subjectsData);

  // 5. Exam Terms
  await ExamTerm.bulkCreate([
    { id: 1, titleBn: '১ম সাময়িক পরীক্ষা ২০২৬', titleEn: '1st Term Examination 2026', academicYear: 2026 },
    { id: 2, titleBn: '২য় সাময়িক পরীক্ষা ২০২৬', titleEn: '2nd Term Examination 2026', academicYear: 2026 },
    { id: 3, titleBn: 'বার্ষিক পরীক্ষা ও প্রি-টেস্ট ২০২৬', titleEn: 'Annual & Pre-Test Exam 2026', academicYear: 2026 }
  ]);

  // 6. Batches
  const db = globalDB.tables;
  db['batches'] = [
    { id: 1, classId: 13, nameBn: '১০ম শ্রেণি - বিজ্ঞান মর্নিং ব্যাচ', name: 'Class 10 Science Morning', shift: 'সকাল (Morning)', monthlyFee: 2500, capacity: 40, isActive: true },
    { id: 2, classId: 13, nameBn: '১০ম শ্রেণি - ডে স্পেশাল ব্যাচ', name: 'Class 10 Day Special', shift: 'দিবা (Day)', monthlyFee: 2500, capacity: 40, isActive: true },
    { id: 3, classId: 14, nameBn: 'একাদশ শ্রেণি - HSC বিজ্ঞান ব্যাচ', name: 'Class 11 HSC Science Batch', shift: 'সকাল (Morning)', monthlyFee: 3000, capacity: 50, isActive: true },
    { id: 4, classId: 11, nameBn: '৮ম শ্রেণি - জুনিয়র মেধা বিকাশ ব্যাচ', name: 'Class 8 Junior Talent Batch', shift: 'বিকাল (Afternoon)', monthlyFee: 2000, capacity: 35, isActive: true }
  ];

  // 7. Textbooks & Study Materials
  db['textbooks'] = [
    {
      id: 1,
      classId: 13,
      subjectId: 5,
      titleBn: 'পদার্থবিজ্ঞান (১০ম শ্রেণি - NCTB)',
      edition: '২০২৬ শিক্ষাবর্ষ',
      author: 'জাতীয় শিক্ষাক্রম ও পাঠ্যপুস্তক বোর্ড (NCTB)',
      fileUrl: 'https://nctb.portal.gov.bd/sites/default/files/files/nctb.portal.gov.bd/page/physics_class10.pdf',
      coverImage: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&auto=format&fit=crop&q=80',
      fileSize: '12.4 MB',
      totalPages: 248,
      isFree: true
    },
    {
      id: 2,
      classId: 13,
      subjectId: 3,
      titleBn: 'উচ্চতর গণিত (১০ম শ্রেণি - NCTB)',
      edition: '২০২৬ শিক্ষাবর্ষ',
      author: 'জাতীয় শিক্ষাক্রম ও পাঠ্যপুস্তক বোর্ড (NCTB)',
      fileUrl: 'https://nctb.portal.gov.bd/sites/default/files/files/nctb.portal.gov.bd/page/higher_math_class10.pdf',
      coverImage: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400&auto=format&fit=crop&q=80',
      fileSize: '15.1 MB',
      totalPages: 312,
      isFree: true
    }
  ];

  db['study_materials'] = [
    {
      id: 1,
      classId: 13,
      title: '১০ম শ্রেণি পদার্থবিজ্ঞান - গতি ও বলের গাণিতিক সূত্র শিট',
      titleBn: '১০ম শ্রেণি পদার্থবিজ্ঞান - গতি ও বলের গাণিতিক সূত্র শিট',
      category: 'PHYSICS',
      chapterBn: 'অধ্যায় ২ ও ৩',
      descriptionBn: 'গতির সমীকরণ ও বলের গাণিতিক সমস্যা সমাধানের শর্টকাট টেকনিক ও বিগত বছরের বোর্ড প্রশ্নব্যাংক।',
      content_text: `গতি ও বলের মৌলিক বিষয়াবলি:
১. স্মরণের হারকে বেগ বলে (v = s/t)। বেগের পরিবর্তনের হারকে ত্বরণ বলে (a = (v - u) / t)।
২. গতির ৪টি মৌলিক সমীকরণ: v = u + at, s = ((u + v) / 2) * t, s = ut + 0.5 * a * t^2, v^2 = u^2 + 2 * a * s।
৩. নিউটনের গতির ১ম সূত্র: বাহ্যিক কোনো বল প্রয়োগ না করলে স্থির বস্তু চিরকাল স্থির থাকবে এবং গতিশীল বস্তু সুষম দ্রুতিতে সরলপথে চলতে থাকবে। এটি জড়তার সূত্র নামেও পরিচিত।
৪. নিউটনের গতির ২য় সূত্র: বস্তুর ভরবেগের পরিবর্তনের হার তার উপর প্রযুক্ত বলের সমানুপাতিক এবং বল যেদিকে ক্রিয়া করে বস্তুর ভরবেগের পরিবর্তনও সেদিকে ঘটে (F = ma)।
৫. নিউটনের গতির ৩য় সূত্র: প্রত্যেক ক্রিয়ারই একটি সমান ও বিপরীত প্রতিক্রিয়া রয়েছে (F1 = -F2)।
৬. মহাকর্ষ বল: F = G * (m1 * m2) / d^2, যেখানে মহাকর্ষীয় ধ্রুবক G = 6.673 x 10^-11 N m^2 kg^-2।`,
      contentText: `গতি ও বলের মৌলিক বিষয়াবলি:
১. স্মরণের হারকে বেগ বলে (v = s/t)। বেগের পরিবর্তনের হারকে ত্বরণ বলে (a = (v - u) / t)।
২. গতির ৪টি মৌলিক সমীকরণ: v = u + at, s = ((u + v) / 2) * t, s = ut + 0.5 * a * t^2, v^2 = u^2 + 2 * a * s।
৩. নিউটনের গতির ১ম সূত্র: বাহ্যিক কোনো বল প্রয়োগ না করলে স্থির বস্তু চিরকাল স্থির থাকবে এবং গতিশীল বস্তু সুষম দ্রুতিতে সরলপথে চলতে থাকবে। এটি জড়তার সূত্র নামেও পরিচিত।
৪. নিউটনের গতির ২য় সূত্র: বস্তুর ভরবেগের পরিবর্তনের হার তার উপর প্রযুক্ত বলের সমানুপাতিক এবং বল যেদিকে ক্রিয়া করে বস্তুর ভরবেগের পরিবর্তনও সেদিকে ঘটে (F = ma)।
৫. নিউটনের গতির ৩য় সূত্র: প্রত্যেক ক্রিয়ারই একটি সমান ও বিপরীত প্রতিক্রিয়া রয়েছে (F1 = -F2)।
৬. মহাকর্ষ বল: F = G * (m1 * m2) / d^2, যেখানে মহাকর্ষীয় ধ্রুবক G = 6.673 x 10^-11 N m^2 kg^-2।`,
      fileType: 'PDF',
      fileUrl: 'https://nextgen.edu.bd/downloads/materials/physics-formulas.pdf',
      fileSize: '2.5 MB',
      totalPages: 18,
      author: 'নেক্সটজেন শিক্ষক প্যানেল',
      isFree: true,
      downloadCount: 154,
      created_at: new Date().toISOString()
    },
    {
      id: 2,
      classId: 14,
      title: 'HSC উচ্চতর গণিত - ক্যালকুলাস ও ডিফারেন্সিয়েশন হ্যান্ডনোট',
      titleBn: 'HSC উচ্চতর গণিত - ক্যালকুলাস ও ডিফারেন্সিয়েশন হ্যান্ডনোট',
      category: 'HIGHER_MATH',
      chapterBn: 'অধ্যায় ৯: অন্তরীকরণ',
      descriptionBn: 'লিমিট ও মূল নিয়মে অন্তরজের সমাধান, স্পর্শক ও অভিলম্বের সমীকরণ সূত্রাবলি।',
      content_text: `ক্যালকুলাস ও অন্তরীকরণের মূল নিয়ম:
১. লিমিটের মৌলিক সূত্র: lim(x->0) [sin(x)/x] = 1, lim(x->0) [(e^x - 1)/x] = 1।
২. অন্তরীকরণের সূত্রাবলি: d/dx(x^n) = n * x^(n-1), d/dx(sin x) = cos x, d/dx(cos x) = -sin x, d/dx(ln x) = 1/x, d/dx(e^x) = e^x।
৩. গুণ ও ভাগ বিধি: d/dx(uv) = u * (dv/dx) + v * (du/dx), d/dx(u/v) = [v * (du/dx) - u * (dv/dx)] / v^2।
৪. চেইন রুল: dy/dx = (dy/du) * (du/dx)।`,
      contentText: `ক্যালকুলাস ও অন্তরীকরণের মূল নিয়ম:
১. লিমিটের মৌলিক সূত্র: lim(x->0) [sin(x)/x] = 1, lim(x->0) [(e^x - 1)/x] = 1।
২. অন্তরীকরণের সূত্রাবলি: d/dx(x^n) = n * x^(n-1), d/dx(sin x) = cos x, d/dx(cos x) = -sin x, d/dx(ln x) = 1/x, d/dx(e^x) = e^x।
৩. গুণ ও ভাগ বিধি: d/dx(uv) = u * (dv/dx) + v * (du/dx), d/dx(u/v) = [v * (du/dx) - u * (dv/dx)] / v^2।
৪. চেইন রুল: dy/dx = (dy/du) * (du/dx)।`,
      fileType: 'PDF',
      fileUrl: 'https://nextgen.edu.bd/downloads/materials/hsc-math-calculus.pdf',
      fileSize: '3.1 MB',
      totalPages: 26,
      author: 'নেক্সটজেন শিক্ষক প্যানেল',
      isFree: false,
      downloadCount: 88,
      created_at: new Date().toISOString()
    }
  ];

  // 8. Official Notices
  await Notice.bulkCreate([
    {
      id: 1,
      titleBn: 'শিক্ষাবর্ষ ২০২৬-এ ৬ষ্ঠ থেকে ১২শ শ্রেণিতে ডিজিটাল ভর্তি কার্যক্রম চালু',
      titleEn: 'Digital Admission Open for Session 2026 (Class 6-12)',
      contentBn: 'নেক্সটজেন একাডেমির অনলাইন পোর্টালে ২০২৬ শিক্ষাবর্ষে ৬ষ্ঠ থেকে ১২শ শ্রেণিতে সীমিত আসনে ভর্তি আবেদন চলছে। হেল্পলাইন: 01792818005',
      contentEn: 'Admissions are open for academic year 2026. Helpline: 01792818005',
      category: 'ADMISSION',
      priority: 'URGENT',
      targetRole: 'ALL',
      authorUserId: adminUser.id,
      publishedAt: new Date().toISOString()
    },
    {
      id: 2,
      titleBn: '১ম সাময়িক ও মডেল টেস্ট পরীক্ষা ২০২৬ সময়সূচি',
      titleEn: '1st Term Examination & Model Test Schedule 2026',
      contentBn: 'সকল শ্রেণির ১ম সাময়িক পরীক্ষা ও মডেল টেস্টের সময়সূচি ও সিলেবাস পোর্টালে প্রকাশ করা হয়েছে। শিক্ষার্থীরা রুটিন সেকশন থেকে পিডিএফ ডাউনলোড করতে পারবে।',
      contentEn: '1st Term exam timetable is now published. Download PDF slips from the portal.',
      category: 'EXAM',
      priority: 'HIGH',
      targetRole: 'ALL',
      authorUserId: adminUser.id,
      publishedAt: new Date().toISOString()
    }
  ]);

  // 9. Hall of Fame (Top Achievers)
  if (Achiever) {
    await Achiever.bulkCreate([
      {
        id: 1,
        nameBn: 'মাহমুদুল হাসান সিয়াম',
        nameEn: 'Mahmudul Hasan Siam',
        studentPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
        examType: 'HSC',
        examYear: '২০২৫',
        gpa: 'GPA 5.00 (Golden A+)',
        institute: 'নটর ডেম কলেজ, ঢাকা',
        badge: '🏆 বিজ্ঞান বিভাগ ১ম স্থান',
        quoteBn: 'নেক্সটজেন একাডেমির নিয়মিত পরীক্ষা ও মানসম্মত লেকচার আমার সাফল্যের মূল চাবিকাঠি।',
        order: 1,
        isActive: true
      },
      {
        id: 2,
        nameBn: 'নুসরাত জাহান মিম',
        nameEn: 'Nusrat Jahan Mim',
        studentPhoto: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
        examType: 'SSC',
        examYear: '২০২৫',
        gpa: 'GPA 5.00 (Golden A+)',
        institute: 'ভিকারুননিসা নূন স্কুল ও কলেজ',
        badge: '🥇 বোর্ড মেধা তালিকায় ৫ম',
        quoteBn: 'অনলাইন লাইভ ক্লাস এবং নিয়মিত হোমওয়ার্ক ট্র্যাকিং আমাকে পড়ালেখায় ধারাবাহিক রাখতে সাহায্য করেছে।',
        order: 2,
        isActive: true
      }
    ]);
  }

  // 10. Institute Settings
  db['settings'] = {
    academyName: 'NextGen ACADEMY',
    academyNameBn: 'নেক্সটজেন একাডেমি',
    tagline: 'LEARN · GROW · SUCCEED',
    taglineBn: 'শিক্ষা · সমৃদ্ধি · সাফল্য',
    logoUrl: '/logo.png',
    sealUrl: '/logo.png',
    contactPhone: '+880 1792818005',
    whatsappPhone: '01792818005',
    phone: '+880 1792818005',
    contactEmail: 'info@nextgen.edu.bd',
    supportEmail: 'support@nextgen.edu.bd',
    address: 'রোড #৪, ধানমন্ডি, ঢাকা-১২০৯',
    eiin: 'NGA-DHAKA-2026',
    website: 'https://nextgen.edu.bd',
    currencySymbol: '৳',
    noticeTextBn: 'ভর্তি চলছে! শিক্ষাবর্ষ ২০২৬-এ ৬ষ্ঠ থেকে ১২শ শ্রেণিতে সীমিত আসনে ডিজিটাল ভর্তি কার্যক্রম চালু রয়েছে। যোগাযোগ: 01792818005',
    heroHeadlineBn: 'ভর্তি চলছে! শিক্ষাবর্ষ ২০২৬-এ ৬ষ্ঠ থেকে ১২শ শ্রেণিতে ডিজিটাল ভর্তি কার্যক্রম',
    heroSubtitleBn: 'অনলাইন লাইভ ক্লাস, স্মার্ট মার্কশিট, স্বয়ংক্রিয় ফি পেমেন্ট ও অভিজ্ঞ শিক্ষক প্যানেলের সমন্বয়ে আধুনিক শিক্ষা ব্যবস্থা।',
    bannerImageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&auto=format&fit=crop&q=80',
    showNotice: true,
    admissionActive: true,
    admissionSessionYear: '২০২৬',
    admissionHelpline: '+880 1792818005',
    facebookUrl: 'https://facebook.com/nextgenacademy',
    youtubeUrl: 'https://youtube.com/@nextgenacademy',
    telegramUrl: 'https://t.me/nextgenacademy',
    footerCopyrightBn: '© ২০২৬ NextGen Academy. সর্বস্বত্ব সংরক্ষিত।'
  };
  db['instituteSettings'] = db['settings'];

  // 11. Empty Arrays for dynamic production entities
  db['students'] = [];
  db['teachers'] = [];
  db['guardian_student_mappings'] = [];
  db['teacher_class_assignments'] = [];
  db['attendances'] = [];
  db['teacher_attendances'] = [];
  db['marks'] = [];
  db['invoices'] = [];
  db['payments'] = [];
  db['homeworks'] = [];
  db['homework_statuses'] = [];
  db['exam_submissions'] = [];
  db['live_classes'] = [];
  db['live_class_comments'] = [];
  db['admission_applications'] = [];

  // 12. Initial Audit Log
  await AuditLog.create({
    id: 1,
    userId: adminUser.id,
    action: 'PRODUCTION_INITIALIZATION',
    entityType: 'system',
    entityId: '1',
    oldValue: null,
    newValue: { status: 'CLEAN_READY', year: 2026, totalClasses: 15, totalSubjects: subjectsData.length },
    details: 'NextGen Academy production database initialized. Primary Super Admin (Alomgir005) configured with zero dummy students/teachers.',
    ipAddress: '127.0.0.1',
    userAgent: 'SeederScript/Production',
    createdAt: new Date().toISOString()
  });

  globalDB.save();

  console.log('================================================================');
  console.log('✅ PRODUCTION SEED COMPLETE - ALL DUMMY DATA PURGED!');
  console.log('================================================================');
  console.log('👑 Super Admin User ID: Alomgir005');
  console.log('🔑 Password:            01792818005');
  console.log('📞 WhatsApp & Hotline:  01792818005');
  console.log('👥 Students in DB:      0 (Clean State)');
  console.log('👨‍🏫 Teachers in DB:      0 (Clean State)');
  console.log('================================================================');
}

if (require.main === module) {
  seedDatabase().catch(err => {
    console.error('❌ Seeder failed:', err);
    process.exit(1);
  });
}

module.exports = seedDatabase;
