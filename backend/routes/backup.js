const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../data/nextgen_academy_db.json');

function getDB() {
  return JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
}

/**
 * Convert headers and rows array into Excel-ready UTF-8 CSV string with BOM
 */
function generateCSV(headers, rows) {
  const BOM = '\uFEFF';
  const headerLine = headers.map((h) => `"${String(h).replace(/"/g, '""')}"`).join(',');
  const rowLines = rows.map((row) =>
    row.map((val) => `"${String(val !== undefined && val !== null ? val : '').replace(/"/g, '""')}"`).join(',')
  );
  return BOM + [headerLine, ...rowLines].join('\r\n');
}

/**
 * Format today date as YYYY-MM-DD
 */
function getTodayDateStr() {
  const d = new Date();
  return d.toISOString().split('T')[0];
}

// ----------------------------------------------------
// 1. BACKUP SUMMARY & TABLE STATS
// ----------------------------------------------------
router.get('/summary', authenticate, (req, res) => {
  try {
    const db = getDB();
    const stats = fs.statSync(dbPath);

    const tables = [
      { id: 'students', nameBn: 'শিক্ষার্থী ডাটাবেজ', nameEn: 'Student Records', count: (db.students || []).length, category: 'Academic' },
      { id: 'users', nameBn: 'ইউজার ও অ্যাকাউন্ট', nameEn: 'System Users', count: (db.users || []).length, category: 'Security' },
      { id: 'teachers', nameBn: 'শিক্ষক ও স্টাফ', nameEn: 'Faculty Members', count: (db.teachers || []).length, category: 'HR' },
      { id: 'classes', nameBn: 'শ্রেণি ও শাখা', nameEn: 'Classes & Sections', count: (db.classes || []).length, category: 'Academic' },
      { id: 'batches', nameBn: 'ব্যাচ ব্যবস্থাপনা', nameEn: 'Batches', count: (db.batches || []).length, category: 'Academic' },
      { id: 'routines', nameBn: 'সাপ্তাহিক রুটিন', nameEn: 'Class Routines', count: (db.routines || []).length, category: 'Academic' },
      { id: 'marks', nameBn: 'পরীক্ষার নম্বর ও গ্রেড', nameEn: 'Exam Marks', count: (db.marks || []).length, category: 'Examination' },
      { id: 'invoices', nameBn: 'ফি ও ইনভয়েস লেজার', nameEn: 'Fee Invoices', count: (db.invoices || []).length, category: 'Accounts' },
      { id: 'expenses', nameBn: 'খরচ ও ভাউচার', nameEn: 'Expenses', count: (db.expenses || []).length, category: 'Accounts' },
      { id: 'teacher_payroll', nameBn: 'শিক্ষক বেতন/পেরোল', nameEn: 'Teacher Payroll', count: (db.teacher_payroll || []).length, category: 'Accounts' },
      { id: 'admissions', nameBn: 'অনলাইন ভর্তি আবেদন', nameEn: 'Online Admissions', count: (db.admissions || []).length, category: 'Admissions' },
      { id: 'roles', nameBn: 'রোল ও পারমিশন', nameEn: 'Roles & RBAC', count: (db.roles || []).length, category: 'Security' }
    ];

    const totalRecords = tables.reduce((acc, t) => acc + t.count, 0);

    res.json({
      success: true,
      data: {
        totalTables: tables.length,
        totalRecords,
        fileSizeKb: (stats.size / 1024).toFixed(2),
        lastModified: stats.mtime.toISOString(),
        tables
      }
    });
  } catch (err) {
    console.error('Backup summary error:', err);
    res.status(500).json({ success: false, error: { message: err.message } });
  }
});

// ----------------------------------------------------
// 2. MODULAR CSV EXPORT BY CATEGORY
// ----------------------------------------------------
router.get('/export/:category', authenticate, (req, res) => {
  try {
    const db = getDB();
    const category = req.params.category.toLowerCase();
    const dateStr = getTodayDateStr();

    let filename = `NextGen_${category}_${dateStr}.csv`;
    let headers = [];
    let rows = [];

    const users = db.users || [];
    const classes = db.classes || [];
    const batches = db.batches || [];
    const subjects = db.subjects || [];

    if (category === 'students') {
      filename = `NextGen_Students_Directory_${dateStr}.csv`;
      headers = [
        'স্টুডেন্ট আইডি (Student ID)',
        'নাম (বাংলা)',
        'নাম (ইংরেজি)',
        'শ্রেণি (Class)',
        'ব্যাচ (Batch)',
        'রোল নম্বর (Roll)',
        'লিঙ্গ (Gender)',
        'রক্তের গ্রুপ (Blood Group)',
        'জন্ম তারিখ (DOB)',
        'অভিভাবকের নাম (Guardian)',
        'অভিভাবকের মোবাইল (Phone)',
        'ঠিকানা (Address)',
        'ভর্তির তারিখ (Admission Date)',
        'স্ট্যাটাস (Status)'
      ];

      const students = db.students || [];
      rows = students.map((s) => {
        const u = users.find((user) => user.id === s.userId) || {};
        const c = classes.find((cls) => cls.id === s.classId) || {};
        const b = batches.find((bat) => bat.id === s.batchId) || {};

        return [
          s.studentIdNumber || `NGA-2026-${s.id}`,
          u.name?.split('(')[0]?.trim() || u.name || 'শিক্ষার্থী',
          u.name?.includes('(') ? u.name.split('(')[1].replace(')', '').trim() : u.email || '',
          c.nameBn || c.name || `Class ${s.classId}`,
          b.name || 'সাধারণ ব্যাচ',
          s.rollNo || '',
          s.gender || 'MALE',
          s.bloodGroup || 'O+',
          s.dob || '',
          s.guardianName || 'অভিভাবক',
          s.guardianPhone || u.phone || '',
          s.address || 'ঢাকা',
          s.admissionDate || '2026-01-01',
          s.status || 'ACTIVE'
        ];
      });
    } else if (category === 'accounts' || category === 'fees') {
      filename = `NextGen_Accounts_Billing_Ledger_${dateStr}.csv`;
      headers = [
        'ইনভয়েস নম্বর (Invoice No)',
        'শিক্ষার্থীর নাম (Student Name)',
        'স্টুডেন্ট আইডি (Student ID)',
        'বিবরণ / মাস (Description)',
        'ধার্যকৃত ফি (Base Amount)',
        'ছাড় / স্কলারশিপ (Discount)',
        'পরিশোধিত ফি (Paid Amount)',
        'পেমেন্ট মেথড (Payment Method)',
        'ট্রানজেকশন আইডি (Transaction ID)',
        'পরিশোধের তারিখ (Paid Date)',
        'অবস্থা (Status)'
      ];

      const invoices = db.invoices || [];
      const students = db.students || [];

      rows = invoices.map((inv) => {
        const s = students.find((std) => std.id === inv.studentId) || {};
        const u = users.find((user) => user.id === s.userId) || {};

        return [
          inv.invoiceNo || `INV-2026-${inv.id}`,
          u.name || 'শিক্ষার্থী',
          s.studentIdNumber || '',
          inv.month || 'মাসিক টিউশন ফি',
          inv.baseAmount || inv.amount,
          inv.discountAmount || 0,
          inv.amount || 0,
          inv.paymentMethod || 'CASH',
          inv.transactionId || 'N/A',
          inv.paidDate || inv.createdAt?.split('T')[0] || '',
          inv.status || 'PAID'
        ];
      });
    } else if (category === 'results' || category === 'marks') {
      filename = `NextGen_Exam_Results_Sheet_${dateStr}.csv`;
      headers = [
        'পরীক্ষার নাম (Exam Term)',
        'শ্রেণি (Class)',
        'বিষয় (Subject)',
        'স্টুডেন্ট আইডি (Student ID)',
        'শিক্ষার্থীর নাম (Student Name)',
        'রোল নম্বর (Roll)',
        'CQ মার্কস',
        'MCQ মার্কস',
        'ব্যবহারিক (Practical)',
        'মোট নম্বর (Total Marks)',
        'গ্রেড পয়েন্ট (GPA)',
        'লেটার গ্রেড (Grade)'
      ];

      const marks = db.marks || [];
      const students = db.students || [];
      const examTerms = db.exam_terms || [];

      rows = marks.map((m) => {
        const s = students.find((std) => std.id === m.studentId) || {};
        const u = users.find((user) => user.id === s.userId) || {};
        const c = classes.find((cls) => cls.id === m.classId || cls.id === s.classId) || {};
        const sub = subjects.find((sb) => sb.id === m.subjectId) || {};
        const term = examTerms.find((t) => t.id === m.examTermId) || {};

        return [
          term.nameBn || term.name || '১ম সাময়িক পরীক্ষা ২০২৬',
          c.nameBn || `Class ${m.classId || 9}`,
          sub.nameBn || sub.name || 'বিষয়',
          s.studentIdNumber || '',
          u.name || 'শিক্ষার্থী',
          s.rollNo || '',
          m.cqMarks !== undefined ? m.cqMarks : 0,
          m.mcqMarks !== undefined ? m.mcqMarks : 0,
          m.practicalMarks !== undefined ? m.practicalMarks : 0,
          m.totalMarks !== undefined ? m.totalMarks : 0,
          m.gpa !== undefined ? m.gpa : (m.gradePoint !== undefined ? m.gradePoint : '5.00'),
          m.grade || 'A+'
        ];
      });
    } else if (category === 'teachers' || category === 'payroll') {
      filename = `NextGen_Teachers_Staff_Payroll_${dateStr}.csv`;
      headers = [
        'স্টাফ/শিক্ষক আইডি (ID)',
        'নাম (Name)',
        'পদবি (Designation)',
        'বিভাগ (Department)',
        'ইমেইল (Email)',
        'মোবাইল নম্বর (Phone)',
        'বেসিক বেতন (Base Salary)',
        'ভাতা (Allowance)',
        'মোট প্রদেয় বেতন (Net Salary)',
        'পেরোল মাস (Payroll Month)',
        'পেমেন্ট স্ট্যাটাস (Status)'
      ];

      const teachers = db.teachers || [];
      const payroll = db.teacher_payroll || [];

      rows = teachers.map((t) => {
        const u = users.find((user) => user.id === t.userId) || {};
        const p = payroll.find((pay) => pay.teacherId === t.id) || {};

        return [
          `TCH-2026-${t.id.toString().padStart(3, '0')}`,
          u.name || 'শিক্ষক',
          t.designation || 'প্রভাষক',
          t.specialization || u.department || 'শিক্ষকতা',
          u.email || t.contact_email || '',
          u.phone || t.mobile_number || '',
          p.baseSalary || 35000,
          p.allowance || 5000,
          p.netSalary || 40000,
          p.month || 'আগস্ট ২০২৬',
          p.status || 'PAID'
        ];
      });
    } else if (category === 'admissions') {
      filename = `NextGen_Online_Admissions_${dateStr}.csv`;
      headers = [
        'ট্র্যাকিং কোড (Tracking ID)',
        'শিক্ষার্থীর নাম (বাংলা)',
        'শিক্ষার্থীর নাম (ইংরেজি)',
        'কাঙ্ক্ষিত শ্রেণি (Class)',
        'ব্যাচ (Batch)',
        'লিঙ্গ (Gender)',
        'রক্তের গ্রুপ (Blood Group)',
        'পূর্ববর্তী স্কুল (Previous School)',
        'পূর্ববর্তী GPA',
        'অভিভাবকের নাম (Guardian)',
        'অভিভাবকের মোবাইল (Phone)',
        'ঠিকানা (Address)',
        'বরাদ্দকৃত আইডি (Student ID)',
        'বরাদ্দকৃত রোল (Roll)',
        'আবেদনের অবস্থা (Status)',
        'আবেদনের তারিখ (Date)'
      ];

      const admissions = db.admissions || [];
      rows = admissions.map((a) => [
        a.trackingId || `ADM-2026-${a.id}`,
        a.studentNameBn || '',
        a.studentNameEn || '',
        a.className || '',
        a.batchName || 'সাধারণ ব্যাচ',
        a.gender || 'MALE',
        a.bloodGroup || 'O+',
        a.previousSchool || '',
        a.previousGpa || '',
        a.guardianName || '',
        a.guardianPhone || '',
        a.address || '',
        a.studentId || 'N/A',
        a.rollNo || 'N/A',
        a.status || 'PENDING',
        a.createdAt?.split('T')[0] || ''
      ]);
    } else {
      // Default: Classes and Batches
      filename = `NextGen_Batches_Routine_${dateStr}.csv`;
      headers = [
        'ব্যাচ আইডি (Batch ID)',
        'ব্যাচের নাম (Batch Name)',
        'শ্রেণি (Class)',
        'শিফট (Shift)',
        'আসন ক্ষমতা (Capacity)',
        'বর্তমান শিক্ষার্থী (Enrolled)',
        'মাসিক ফি (Monthly Fee)',
        'রুম নম্বর (Room No)'
      ];

      const batchesList = db.batches || [];
      rows = batchesList.map((b) => [
        `BTC-2026-${b.id}`,
        b.name || '',
        b.className || `Class ${b.classId}`,
        b.shift || 'মর্নিং শিফট',
        b.capacity || 40,
        b.enrolledCount || 0,
        b.monthlyFee || 2500,
        b.roomNo || 'রুম ২০৪'
      ]);
    }

    const csvContent = generateCSV(headers, rows);

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(csvContent);
  } catch (err) {
    console.error('Export category CSV error:', err);
    res.status(500).json({ success: false, error: { message: err.message } });
  }
});

// ----------------------------------------------------
// 3. FULL JSON DATABASE DUMP
// ----------------------------------------------------
router.get('/dump/json', authenticate, (req, res) => {
  try {
    const dateStr = getTodayDateStr();
    const filename = `NextGen_Academy_Full_Backup_${dateStr}.json`;

    const rawData = fs.readFileSync(dbPath, 'utf-8');

    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(rawData);
  } catch (err) {
    console.error('Dump JSON error:', err);
    res.status(500).json({ success: false, error: { message: err.message } });
  }
});

// ----------------------------------------------------
// 4. FULL SQL DATABASE DUMP
// ----------------------------------------------------
router.get('/dump/sql', authenticate, (req, res) => {
  try {
    const db = getDB();
    const dateStr = getTodayDateStr();
    const filename = `NextGen_Academy_Full_Backup_${dateStr}.sql`;

    let sql = `-- ==========================================================================\n`;
    sql += `-- NextGen Academy Parent Portal Database Backup\n`;
    sql += `-- Export Date: ${new Date().toISOString()}\n`;
    sql += `-- Database Engine: NextGen Relational JSON Engine / SQL Generator v2.0\n`;
    sql += `-- UTF-8 Encoding for Bengali Text\n`;
    sql += `-- ==========================================================================\n\n`;
    sql += `SET NAMES utf8mb4;\n`;
    sql += `SET FOREIGN_KEY_CHECKS = 0;\n\n`;

    // Iterate through all collections
    for (const [tableName, records] of Object.entries(db)) {
      if (!Array.isArray(records) || records.length === 0) continue;

      sql += `-- --------------------------------------------------------------------------\n`;
      sql += `-- Table structure for table \`${tableName}\`\n`;
      sql += `-- --------------------------------------------------------------------------\n`;
      sql += `DROP TABLE IF EXISTS \`${tableName}\`;\n`;

      // Extract columns from first record
      const sample = records[0];
      const columns = Object.keys(sample);

      sql += `CREATE TABLE \`${tableName}\` (\n`;
      const colDefs = columns.map((col) => {
        const val = sample[col];
        if (typeof val === 'number') {
          return `  \`${col}\` INT NULL`;
        } else if (typeof val === 'boolean') {
          return `  \`${col}\` TINYINT(1) DEFAULT 1`;
        } else if (typeof val === 'object' && val !== null) {
          return `  \`${col}\` JSON NULL`;
        }
        return `  \`${col}\` TEXT NULL`;
      });
      sql += colDefs.join(',\n');
      sql += `\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n\n`;

      sql += `-- Dumping data for table \`${tableName}\` (${records.length} records)\n`;

      // Batch inserts
      for (const row of records) {
        const values = columns.map((col) => {
          const val = row[col];
          if (val === null || val === undefined) return 'NULL';
          if (typeof val === 'number') return val;
          if (typeof val === 'boolean') return val ? 1 : 0;
          if (typeof val === 'object') return `'${JSON.stringify(val).replace(/'/g, "\\'")}'`;
          return `'${String(val).replace(/'/g, "\\'").replace(/\\/g, '\\\\')}'`;
        });

        sql += `INSERT INTO \`${tableName}\` (\`${columns.join('`, `')}\`) VALUES (${values.join(', ')});\n`;
      }

      sql += `\n`;
    }

    sql += `SET FOREIGN_KEY_CHECKS = 1;\n`;
    sql += `-- ==========================================================================\n`;
    sql += `-- End of NextGen Academy Database Dump\n`;
    sql += `-- ==========================================================================\n`;

    res.setHeader('Content-Type', 'application/sql; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(sql);
  } catch (err) {
    console.error('Dump SQL error:', err);
    res.status(500).json({ success: false, error: { message: err.message } });
  }
});

module.exports = router;
