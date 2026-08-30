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
  console.log('🌱 Verifying Database Structure & Ensuring Super Admin Account...');

  const saltRounds = 12;
  const adminPassword = bcrypt.hashSync('01792818005', saltRounds);

  // 1. Ensure Super Admin Account ONLY
  const existingAdmin = await User.findOne({ where: { role: 'SUPER_ADMIN' } });
  if (!existingAdmin) {
    await User.create({
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
  }

  // 2. Complete Classes & Curriculum Structure (NCTB Blueprint)
  const classCount = await Class.count();
  if (classCount === 0) {
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

    const sectionsData = [];
    let secId = 1;
    for (const c of classesData) {
      if (c.numericGrade >= 11) {
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

    const subjectsData = [];
    let subId = 1;

    for (const cid of [1, 2, 3]) {
      subjectsData.push(
        { id: subId++, classId: cid, nameBn: 'বাংলা বর্ণমালা ও ছড়া', nameEn: 'Bangla Alphabet & Rhymes', code: 'PRE-BAN', totalMarks: 50 },
        { id: subId++, classId: cid, nameBn: 'English Phonics & Rhymes', nameEn: 'English Phonics & Rhymes', code: 'PRE-ENG', totalMarks: 50 },
        { id: subId++, classId: cid, nameBn: 'প্রাথমিক সংখ্যা ও গণিত', nameEn: 'Early Math & Numbers', code: 'PRE-MAT', totalMarks: 50 },
        { id: subId++, classId: cid, nameBn: 'ড্রয়িং ও কালারিং আর্ট', nameEn: 'Drawing & Coloring Art', code: 'PRE-ART', totalMarks: 50 },
        { id: subId++, classId: cid, nameBn: 'সাধারণ জ্ঞান ও নীতিশিক্ষা', nameEn: 'General Knowledge & Moral Habits', code: 'PRE-GK', totalMarks: 50 }
      );
    }

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

    for (const cid of [14, 15]) {
      subjectsData.push(
        { id: subId++, classId: cid, nameBn: 'বাংলা ১ম ও ২য় পত্র (আবশ্যিক)', nameEn: 'Bangla 1st & 2nd Paper', code: `HSC-BAN-${cid}`, totalMarks: 100 },
        { id: subId++, classId: cid, nameBn: 'English 1st & 2nd Paper (Compulsory)', nameEn: 'English 1st & 2nd Paper', code: `HSC-ENG-${cid}`, totalMarks: 100 },
        { id: subId++, classId: cid, nameBn: 'তথ্য ও যোগাযোগ প্রযুক্তি (ICT)', nameEn: 'ICT (Compulsory)', code: `HSC-ICT-${cid}`, totalMarks: 100 },
        { id: subId++, classId: cid, nameBn: 'পদার্থবিজ্ঞান ১ম ও ২য় পত্র (বিজ্ঞান)', nameEn: 'Physics 1st & 2nd Paper', code: `HSC-PHY-${cid}`, totalMarks: 100 },
        { id: subId++, classId: cid, nameBn: 'রসায়ন ১ম ও ২য় পত্র (বিজ্ঞান)', nameEn: 'Chemistry 1st & 2nd Paper', code: `HSC-CHEM-${cid}`, totalMarks: 100 },
        { id: subId++, classId: cid, nameBn: 'উচ্চতর গণিত ১ম ও ২য় পত্র (বিজ্ঞান)', nameEn: 'Higher Mathematics 1st & 2nd', code: `HSC-HMAT-${cid}`, totalMarks: 100 },
        { id: subId++, classId: cid, nameBn: 'জীববিজ্ঞান ১ম ও ২য় পত্র (বিজ্ঞান)', nameEn: 'Biology 1st & 2nd Paper', code: `HSC-BIO-${cid}`, totalMarks: 100 },
        { id: subId++, classId: cid, nameBn: 'হিসাববিজ্ঞান ১ম ও ২য় পত্র (ব্যবসায় শিক্ষা)', nameEn: 'Accounting 1st & 2nd Paper', code: `HSC-ACC-${cid}`, totalMarks: 100 },
        { id: subId++, classId: cid, nameBn: 'ব্যবসায় সংগঠন ও ব্যবস্থাপনা (ব্যবসায় শিক্ষা)', nameEn: 'Business Organization & Mgmt', code: `HSC-BOM-${cid}`, totalMarks: 100 },
        { id: subId++, classId: cid, nameBn: 'ফিন্যান্স, ব্যাংকিং ও বিমা (ব্যবসায় শিক্ষা)', nameEn: 'Finance, Banking & Insurance', code: `HSC-FIN-${cid}`, totalMarks: 100 },
        { id: subId++, classId: cid, nameBn: 'অর্থনীতি ১ম ও ২য় পত্র (মানবিক)', nameEn: 'Economics 1st & 2nd Paper', code: `HSC-ECO-${cid}`, totalMarks: 100 },
        { id: subId++, classId: cid, nameBn: 'পৌরনীতি ও সুশাসন (মানবিক)', nameEn: 'Civics & Good Governance', code: `HSC-CIV-${cid}`, totalMarks: 100 },
        { id: subId++, classId: cid, nameBn: 'সমাজবিজ্ঞান / ইসলামের ইতিহাস (মানবিক)', nameEn: 'Sociology & Islamic History', code: `HSC-SOC-${cid}`, totalMarks: 100 }
      );
    }
    await Subject.bulkCreate(subjectsData);

    await ExamTerm.bulkCreate([
      { id: 1, titleBn: '১ম সাময়িক পরীক্ষা ২০২৬', titleEn: '1st Term Examination 2026', academicYear: 2026 },
      { id: 2, titleBn: '২য় সাময়িক পরীক্ষা ২০২৬', titleEn: '2nd Term Examination 2026', academicYear: 2026 },
      { id: 3, titleBn: 'বার্ষিক পরীক্ষা ও প্রি-টেস্ট ২০২৬', titleEn: 'Annual & Pre-Test Exam 2026', academicYear: 2026 }
    ]);
  }

  console.log('✅ Clean Database Ready. Zero Demo Records.');
}

module.exports = seedDatabase;
