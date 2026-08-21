const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../data/nextgen_academy_db.json');

function getDB() {
  return JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
}

function saveDB(db) {
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf-8');
}

// ----------------------------------------------------
// 1. PUBLIC: APPLY ONLINE
// ----------------------------------------------------
router.post('/apply', (req, res) => {
  try {
    const db = getDB();
    const {
      studentNameBn,
      studentNameEn,
      className,
      classId,
      batchId,
      batchName,
      bloodGroup,
      religion,
      dob,
      gender,
      previousSchool,
      previousGpa,
      guardianName,
      guardianPhone,
      guardianProfession,
      guardianEmail,
      address,
      photoUrl,
      marksheetUrl,
      applicationFee,
      paymentMethod,
      paymentNumber,
      paymentTrxId,
      remarks
    } = req.body;

    if (!studentNameBn || !studentNameEn || !className || !guardianPhone || !guardianName) {
      return res.status(400).json({
        success: false,
        error: { message: 'শিক্ষার্থীর নাম, শ্রেণি, অভিভাবকের নাম ও মোবাইল নম্বর আবশ্যক।' }
      });
    }

    const admissions = db.admissions || [];
    const newId = admissions.length > 0 ? Math.max(...admissions.map((a) => a.id)) + 1 : 1;
    const randCode = Math.floor(1000 + Math.random() * 9000);
    const trackingId = `ADM-2026-${randCode}`;

    // Resolve classId and batch info
    const classes = db.classes || [];
    const batches = db.batches || [];
    const matchedClass = classes.find((c) => c.name === className || c.id === Number(classId)) || {};
    const matchedBatch = batches.find((b) => b.id === Number(batchId)) || {};

    const newApplication = {
      id: newId,
      trackingId,
      studentNameBn,
      studentNameEn,
      className: matchedClass.name || className,
      classId: matchedClass.id || (classId ? Number(classId) : 1),
      batchId: matchedBatch.id || (batchId ? Number(batchId) : null),
      batchName: matchedBatch.name || batchName || 'সকাল ব্যাচ (সকাল ৮:০০ - ১০:০০)',
      bloodGroup: bloodGroup || 'O+',
      religion: religion || 'ISLAM',
      dob: dob || '2010-01-01',
      gender: gender || 'MALE',
      previousSchool: previousSchool || 'পূর্ববর্তী বিদ্যালয়',
      previousGpa: previousGpa || '5.00',
      guardianName,
      guardianPhone: guardianPhone.trim(),
      guardianProfession: guardianProfession || 'অভিভাবক',
      guardianEmail: guardianEmail || '',
      address: address || 'ঢাকা, বাংলাদেশ',
      photoUrl: photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
      marksheetUrl: marksheetUrl || 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400',
      applicationFee: Number(applicationFee) || 500,
      paymentMethod: paymentMethod || 'bKash',
      paymentNumber: paymentNumber || '',
      paymentTrxId: paymentTrxId || '',
      paymentStatus: paymentTrxId ? 'VERIFIED' : 'PENDING',
      status: 'PENDING',
      remarks: remarks || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    admissions.unshift(newApplication);
    db.admissions = admissions;
    saveDB(db);

    res.json({
      success: true,
      message: 'ভর্তি আবেদন সফলভাবে গ্রহণ করা হয়েছে!',
      data: {
        trackingId: newApplication.trackingId,
        studentNameBn: newApplication.studentNameBn,
        studentNameEn: newApplication.studentNameEn,
        className: newApplication.className,
        batchName: newApplication.batchName,
        guardianPhone: newApplication.guardianPhone,
        status: newApplication.status,
        createdAt: newApplication.createdAt
      }
    });
  } catch (err) {
    console.error('Online admission apply error:', err);
    res.status(500).json({ success: false, error: { message: err.message } });
  }
});

// ----------------------------------------------------
// 2. PUBLIC: TRACK APPLICATION STATUS
// ----------------------------------------------------
router.get('/track/:query', (req, res) => {
  try {
    const db = getDB();
    const q = req.params.query.trim().toUpperCase();
    const admissions = db.admissions || [];

    const found = admissions.find(
      (a) => a.trackingId?.toUpperCase() === q || a.guardianPhone === req.params.query.trim()
    );

    if (!found) {
      return res.status(404).json({
        success: false,
        error: { message: 'প্রদত্ত ট্র্যাকিং আইডি বা মোবাইল নম্বর দিয়ে কোনো আবেদন পাওয়া যায়নি।' }
      });
    }

    res.json({
      success: true,
      data: found
    });
  } catch (err) {
    console.error('Track admission error:', err);
    res.status(500).json({ success: false, error: { message: err.message } });
  }
});

// ----------------------------------------------------
// 3. ADMIN: LIST & FILTER APPLICATIONS
// ----------------------------------------------------
router.get('/applications', authenticate, (req, res) => {
  try {
    const db = getDB();
    let list = db.admissions || [];
    const { status, className, search } = req.query;

    if (status && status !== 'ALL') {
      list = list.filter((a) => a.status === status);
    }
    if (className && className !== 'ALL') {
      list = list.filter((a) => a.className === className);
    }
    if (search) {
      const s = search.toLowerCase();
      list = list.filter(
        (a) =>
          (a.studentNameBn && a.studentNameBn.toLowerCase().includes(s)) ||
          (a.studentNameEn && a.studentNameEn.toLowerCase().includes(s)) ||
          (a.trackingId && a.trackingId.toLowerCase().includes(s)) ||
          (a.guardianPhone && a.guardianPhone.includes(s))
      );
    }

    list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const totalPending = list.filter((a) => a.status === 'PENDING').length;
    const totalApproved = list.filter((a) => a.status === 'APPROVED').length;
    const totalRejected = list.filter((a) => a.status === 'REJECTED').length;

    res.json({
      success: true,
      data: {
        applications: list,
        totalCount: list.length,
        totalPending,
        totalApproved,
        totalRejected
      }
    });
  } catch (err) {
    console.error('List applications error:', err);
    res.status(500).json({ success: false, error: { message: err.message } });
  }
});

// ----------------------------------------------------
// 4. ADMIN: GET SINGLE APPLICATION DETAILS
// ----------------------------------------------------
router.get('/applications/:id', authenticate, (req, res) => {
  try {
    const db = getDB();
    const id = Number(req.params.id);
    const admissions = db.admissions || [];
    const target = admissions.find((a) => a.id === id);

    if (!target) {
      return res.status(404).json({ success: false, error: { message: 'আবেদন পাওয়া যায়নি।' } });
    }

    res.json({
      success: true,
      data: target
    });
  } catch (err) {
    console.error('Get application error:', err);
    res.status(500).json({ success: false, error: { message: err.message } });
  }
});

// ----------------------------------------------------
// 5. ADMIN: APPROVE APPLICATION & AUTO-GENERATE STUDENT
// ----------------------------------------------------
router.post('/applications/:id/approve', authenticate, (req, res) => {
  try {
    const db = getDB();
    const id = Number(req.params.id);
    const admissions = db.admissions || [];
    const index = admissions.findIndex((a) => a.id === id);

    if (index === -1) {
      return res.status(404).json({ success: false, error: { message: 'আবেদন পাওয়া যায়নি।' } });
    }

    const app = admissions[index];
    if (app.status === 'APPROVED') {
      return res.status(400).json({ success: false, error: { message: 'এই আবেদনটি ইতিমধ্যে অনুমোদিত হয়েছে।' } });
    }

    const { admissionFee, paymentMethod, transactionId, targetBatchId } = req.body;

    const users = db.users || [];
    const students = db.students || [];
    const batches = db.batches || [];
    const invoices = db.invoices || [];

    // 1. Generate unique Student ID & User
    const nextUserId = users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1001;
    const nextStudentId = students.length > 0 ? Math.max(...students.map((s) => s.id)) + 1 : 101;
    const studentIdNumber = `NGA-2026-${nextStudentId.toString().padStart(4, '0')}`;

    // 2. Assign Batch & Next Roll Number
    const selectedBatchId = targetBatchId ? Number(targetBatchId) : (app.batchId || 1);
    const batchStudents = students.filter((s) => Number(s.batchId) === selectedBatchId || s.classId === app.classId);
    const nextRollInt = batchStudents.length + 1;
    const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    const rollNo = nextRollInt < 10
      ? `০${nextRollInt}`
      : String(nextRollInt).split('').map((d) => banglaDigits[Number(d)]).join('');

    // Create User Account
    const defaultPassword = 'student123';
    const hashedPassword = bcrypt.hashSync(defaultPassword, 10);
    const emailPrefix = app.studentNameEn.toLowerCase().replace(/[^a-z0-9]/g, '.').slice(0, 15);
    const studentEmail = `${emailPrefix}.${nextStudentId}@nextgen.edu.bd`;

    const newUser = {
      id: nextUserId,
      name: `${app.studentNameBn} (${app.studentNameEn})`,
      email: studentEmail,
      phone: app.guardianPhone,
      password: hashedPassword,
      passwordHash: hashedPassword,
      role: 'STUDENT',
      isActive: true,
      avatar: app.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
      createdAt: new Date().toISOString()
    };
    users.push(newUser);

    // Create Student Record
    const newStudent = {
      id: nextStudentId,
      userId: nextUserId,
      studentIdNumber,
      rollNo,
      classId: app.classId || 1,
      sectionId: 1,
      batchId: selectedBatchId,
      bloodGroup: app.bloodGroup || 'O+',
      guardianName: app.guardianName,
      guardianPhone: app.guardianPhone,
      guardianProfession: app.guardianProfession,
      address: app.address,
      status: 'ACTIVE',
      createdAt: new Date().toISOString()
    };
    students.push(newStudent);

    // Update Batch enrolled count
    const batchIndex = batches.findIndex((b) => b.id === selectedBatchId);
    if (batchIndex >= 0) {
      batches[batchIndex].enrolledCount = (batches[batchIndex].enrolledCount || 0) + 1;
    }

    // 3. Create Admission Fee Paid Invoice
    const feeAmount = admissionFee !== undefined ? Number(admissionFee) : 3500;
    const nextInvoiceId = invoices.length > 0 ? Math.max(...invoices.map((i) => i.id)) + 1 : 1001;
    const invoiceNo = `INV-2026-ADM${nextInvoiceId.toString().padStart(3, '0')}`;

    const newInvoice = {
      id: nextInvoiceId,
      invoiceNo,
      studentId: nextStudentId,
      month: 'ভর্তি ফি (Admission 2026)',
      baseAmount: feeAmount,
      discountAmount: 0,
      amount: feeAmount,
      status: 'PAID',
      paymentMethod: paymentMethod || 'CASH',
      paidDate: new Date().toISOString().split('T')[0],
      transactionId: transactionId || `NGA-ADM-${Math.floor(100000 + Math.random() * 900000)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    invoices.push(newInvoice);

    // 4. Update Application Record
    admissions[index] = {
      ...app,
      status: 'APPROVED',
      studentId: studentIdNumber,
      rollNo,
      batchId: selectedBatchId,
      admissionFee: feeAmount,
      paymentMethod: paymentMethod || 'CASH',
      invoiceNo,
      transactionId: newInvoice.transactionId,
      approvedAt: new Date().toISOString(),
      approvedByUserId: req.user?.id || 1,
      updatedAt: new Date().toISOString()
    };

    db.users = users;
    db.students = students;
    db.batches = batches;
    db.invoices = invoices;
    db.admissions = admissions;
    saveDB(db);

    res.json({
      success: true,
      message: `'${app.studentNameBn}'-এর ভর্তি আবেদন অনুমোদিত হয়েছে এবং আইডি (${studentIdNumber}) ও রোল (${rollNo}) তৈরি হয়েছে!`,
      data: {
        application: admissions[index],
        studentIdNumber,
        rollNo,
        studentEmail,
        invoiceNo,
        feeAmount
      }
    });
  } catch (err) {
    console.error('Approve admission error:', err);
    res.status(500).json({ success: false, error: { message: err.message } });
  }
});

// ----------------------------------------------------
// 6. ADMIN: REJECT APPLICATION
// ----------------------------------------------------
router.post('/applications/:id/reject', authenticate, (req, res) => {
  try {
    const db = getDB();
    const id = Number(req.params.id);
    const admissions = db.admissions || [];
    const index = admissions.findIndex((a) => a.id === id);

    if (index === -1) {
      return res.status(404).json({ success: false, error: { message: 'আবেদন পাওয়া যায়নি।' } });
    }

    const { reason } = req.body;

    admissions[index] = {
      ...admissions[index],
      status: 'REJECTED',
      rejectionReason: reason || 'আসন সংখ্যা পূর্ণ বা শর্তাবলী পূরণ না হওয়ায় বাতিল করা হয়েছে।',
      rejectedAt: new Date().toISOString(),
      rejectedByUserId: req.user?.id || 1,
      updatedAt: new Date().toISOString()
    };

    db.admissions = admissions;
    saveDB(db);

    res.json({
      success: true,
      message: `'${admissions[index].studentNameBn}'-এর আবেদন বাতিল করা হয়েছে!`,
      data: admissions[index]
    });
  } catch (err) {
    console.error('Reject admission error:', err);
    res.status(500).json({ success: false, error: { message: err.message } });
  }
});

// ----------------------------------------------------
// 7. STATS & ANALYTICS
// ----------------------------------------------------
router.get('/stats', (req, res) => {
  try {
    const db = getDB();
    const admissions = db.admissions || [];

    const totalCount = admissions.length;
    const pendingCount = admissions.filter((a) => a.status === 'PENDING').length;
    const approvedCount = admissions.filter((a) => a.status === 'APPROVED').length;
    const rejectedCount = admissions.filter((a) => a.status === 'REJECTED').length;

    // Class-wise breakdown
    const classMap = {};
    admissions.forEach((a) => {
      const cls = a.className || 'Class 9';
      classMap[cls] = (classMap[cls] || 0) + 1;
    });

    res.json({
      success: true,
      data: {
        totalCount,
        pendingCount,
        approvedCount,
        rejectedCount,
        classBreakdown: classMap
      }
    });
  } catch (err) {
    console.error('Admissions stats error:', err);
    res.status(500).json({ success: false, error: { message: err.message } });
  }
});

module.exports = router;
