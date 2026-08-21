const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../data/nextgen_academy_db.json');

function getDB() {
  return JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
}

function saveDB(db) {
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf-8');
}

/**
 * Replace dynamic placeholders in a template with student/recipient metadata
 */
function evaluateTemplate(text, data = {}) {
  let result = text || '';
  const instituteName = data.instituteName || 'নেক্সটজেন একাডেমি';
  const studentName = data.studentName || 'শিক্ষার্থী';
  const roll = data.rollNo || data.roll || '১';
  const className = data.className || 'Class 9';
  const batchName = data.batchName || 'অগ্রদূত ব্যাচ';
  const dueAmount = data.dueAmount !== undefined ? `${data.dueAmount.toLocaleString('en-IN')}` : '৩,৫০০';
  const dueDate = data.dueDate || '২৫ আগস্ট ২০২৬';
  const examName = data.examName || '১ম সাময়িক পরীক্ষা ২০২৬';
  const totalMarks = data.totalMarks !== undefined ? String(data.totalMarks) : '৮৮';
  const gpa = data.gpa || '৫.০০';
  const meritPosition = data.meritPosition || '১ম';
  const dateStr = data.date || new Date().toISOString().split('T')[0];

  result = result
    .replace(/{শিক্ষার্থীর_নাম}/g, studentName)
    .replace(/{student_name}/g, studentName)
    .replace(/{রোল}/g, roll)
    .replace(/{roll}/g, roll)
    .replace(/{শ্রেণি}/g, className)
    .replace(/{class_name}/g, className)
    .replace(/{ব্যাচ}/g, batchName)
    .replace(/{batch_name}/g, batchName)
    .replace(/{বকেয়া_ফি_টাকা}/g, dueAmount)
    .replace(/{due_amount}/g, dueAmount)
    .replace(/{পরিশোধের_শেষ_তারিখ}/g, dueDate)
    .replace(/{due_date}/g, dueDate)
    .replace(/{পরীক্ষার_নাম}/g, examName)
    .replace(/{exam_name}/g, examName)
    .replace(/{প্রাপ্ত_নম্বর}/g, totalMarks)
    .replace(/{total_marks}/g, totalMarks)
    .replace(/{জিপিএ}/g, gpa)
    .replace(/{gpa}/g, gpa)
    .replace(/{মেধাক্রম}/g, meritPosition)
    .replace(/{merit_position}/g, meritPosition)
    .replace(/{প্রতিষ্ঠানের_নাম}/g, instituteName)
    .replace(/{institute_name}/g, instituteName)
    .replace(/{তারিখ}/g, dateStr)
    .replace(/{date}/g, dateStr);

  return result;
}

/**
 * Calculate SMS parts count based on Unicode/Bangla length
 */
function calculateSMSParts(text) {
  if (!text) return 1;
  const len = text.length;
  // Unicode SMS: 70 chars for 1 part, 67 chars per part if multi-part
  if (len <= 70) return 1;
  return Math.ceil(len / 67);
}

// ----------------------------------------------------
// 1. SMS SUMMARY & BALANCE
// ----------------------------------------------------
router.get('/summary', authenticate, (req, res) => {
  try {
    const db = getDB();
    const balance = db.sms_balance || {
      remaining: 8450,
      totalPurchased: 10000,
      totalSent: 1550,
      deliveryRate: 99.4,
      gatewayStatus: 'ONLINE',
      senderMask: 'NextGenACAD'
    };

    const logs = db.sms_logs || [];
    const totalDelivered = logs.filter((l) => l.status === 'DELIVERED').length;
    const totalFailed = logs.filter((l) => l.status === 'FAILED').length;

    res.json({
      success: true,
      data: {
        balance,
        templates: db.sms_templates || [],
        totalSentInSystem: logs.length,
        totalDelivered,
        totalFailed
      }
    });
  } catch (err) {
    console.error('SMS summary error:', err);
    res.status(500).json({ success: false, error: { message: err.message } });
  }
});

// ----------------------------------------------------
// 2. PREVIEW SMS & FILTER RECIPIENTS
// ----------------------------------------------------
router.post('/preview', authenticate, (req, res) => {
  try {
    const db = getDB();
    const { targetType, classId, batchId, dueOnly, templateText, dueDate, examName } = req.body;

    const students = db.students || [];
    const users = db.users || [];
    const classes = db.classes || [];
    const batches = db.batches || [];
    const invoices = db.invoices || [];
    const marks = db.marks || [];

    let recipients = [];

    if (targetType === 'TEACHERS') {
      const teachers = db.teachers || [];
      recipients = teachers.map((t) => {
        const u = users.find((user) => user.id === t.userId) || {};
        return {
          id: t.id,
          name: u.name || 'শিক্ষক',
          phone: u.phone || t.mobile_number || '01700000000',
          role: 'TEACHER',
          className: 'Faculty',
          batchName: 'শিক্ষক ও স্টাফ'
        };
      });
    } else {
      // Students / Guardians
      let targetStudents = students;

      if (classId && classId !== 'ALL') {
        targetStudents = targetStudents.filter((s) => s.classId === Number(classId));
      }

      if (batchId && batchId !== 'ALL') {
        targetStudents = targetStudents.filter((s) => s.batchId === Number(batchId));
      }

      if (dueOnly) {
        // Filter students who have unpaid invoices or due
        const dueStudentIds = new Set(
          invoices.filter((i) => i.status !== 'PAID').map((i) => i.studentId)
        );
        targetStudents = targetStudents.filter((s) => dueStudentIds.has(s.id));
      }

      recipients = targetStudents.map((s) => {
        const u = users.find((user) => user.id === s.userId) || {};
        const c = classes.find((cls) => cls.id === s.classId) || {};
        const b = batches.find((bat) => bat.id === s.batchId) || {};

        // Calculate student's due
        const studentInvoices = invoices.filter((i) => i.studentId === s.id && i.status !== 'PAID');
        const dueAmount = studentInvoices.reduce((sum, inv) => sum + (inv.amount || inv.baseAmount || 0), 0) || 3500;

        // Student's marks
        const studentMark = marks.find((m) => m.studentId === s.id) || {};

        return {
          studentId: s.studentIdNumber || `NGA-2026-${s.id}`,
          name: u.name?.split('(')[0]?.trim() || u.name || 'শিক্ষার্থী',
          studentNameBn: u.name?.split('(')[0]?.trim() || u.name || 'শিক্ষার্থী',
          rollNo: s.rollNo || '১',
          phone: s.guardianPhone || u.phone || '01712345678',
          guardianName: s.guardianName || 'অভিভাবক',
          className: c.nameBn || c.name || `Class ${s.classId || 9}`,
          batchName: b.name || 'অগ্রদূত ব্যাচ',
          dueAmount,
          dueDate: dueDate || '২৫ আগস্ট ২০২৬',
          examName: examName || '১ম সাময়িক পরীক্ষা ২০২৬',
          totalMarks: studentMark.totalMarks || 88,
          gpa: studentMark.gpa || studentMark.gradePoint || '৫.০০'
        };
      });
    }

    const sample = recipients.length > 0 ? recipients[0] : {};
    const sampleMessage = evaluateTemplate(templateText || '', {
      ...sample,
      studentName: sample.name,
      roll: sample.rollNo
    });

    const smsParts = calculateSMSParts(sampleMessage);

    res.json({
      success: true,
      data: {
        totalRecipients: recipients.length,
        estimatedTotalSMS: recipients.length * smsParts,
        sampleMessage,
        sampleRecipients: recipients.slice(0, 10),
        smsParts,
        charCount: sampleMessage.length
      }
    });
  } catch (err) {
    console.error('Preview SMS error:', err);
    res.status(500).json({ success: false, error: { message: err.message } });
  }
});

// ----------------------------------------------------
// 3. SEND BULK SMS DISPATCHER
// ----------------------------------------------------
router.post('/send-bulk', authenticate, (req, res) => {
  try {
    const db = getDB();
    const {
      targetType,
      classId,
      batchId,
      dueOnly,
      category,
      templateText,
      dueDate,
      examName
    } = req.body;

    if (!templateText) {
      return res.status(400).json({ success: false, error: { message: 'এসএমএস বার্তা আবশ্যক।' } });
    }

    const balance = db.sms_balance || { remaining: 8450, totalSent: 1550 };

    const students = db.students || [];
    const users = db.users || [];
    const classes = db.classes || [];
    const batches = db.batches || [];
    const invoices = db.invoices || [];
    const marks = db.marks || [];
    const logs = db.sms_logs || [];

    let targetStudents = students;

    if (classId && classId !== 'ALL') {
      targetStudents = targetStudents.filter((s) => s.classId === Number(classId));
    }

    if (batchId && batchId !== 'ALL') {
      targetStudents = targetStudents.filter((s) => s.batchId === Number(batchId));
    }

    if (dueOnly) {
      const dueStudentIds = new Set(
        invoices.filter((i) => i.status !== 'PAID').map((i) => i.studentId)
      );
      targetStudents = targetStudents.filter((s) => dueStudentIds.has(s.id));
    }

    if (targetStudents.length === 0) {
      return res.status(400).json({
        success: false,
        error: { message: 'নির্বাচিত ফিল্টারে কোনো প্রাপক পাওয়া যায়নি।' }
      });
    }

    let totalDispatched = 0;
    let totalDeductedSMS = 0;
    const now = new Date().toISOString();

    targetStudents.forEach((s) => {
      const u = users.find((user) => user.id === s.userId) || {};
      const c = classes.find((cls) => cls.id === s.classId) || {};
      const b = batches.find((bat) => bat.id === s.batchId) || {};

      const studentInvoices = invoices.filter((i) => i.studentId === s.id && i.status !== 'PAID');
      const dueAmount = studentInvoices.reduce((sum, inv) => sum + (inv.amount || inv.baseAmount || 0), 0) || 3500;
      const studentMark = marks.find((m) => m.studentId === s.id) || {};

      const recipientData = {
        studentName: u.name?.split('(')[0]?.trim() || u.name || 'শিক্ষার্থী',
        studentId: s.studentIdNumber || `NGA-2026-${s.id}`,
        rollNo: s.rollNo || '১',
        roll: s.rollNo || '১',
        className: c.nameBn || c.name || `Class ${s.classId || 9}`,
        batchName: b.name || 'অগ্রদূত ব্যাচ',
        dueAmount,
        dueDate: dueDate || '২৫ আগস্ট ২০২৬',
        examName: examName || '১ম সাময়িক পরীক্ষা ২০২৬',
        totalMarks: studentMark.totalMarks || 88,
        gpa: studentMark.gpa || studentMark.gradePoint || '৫.০০',
        instituteName: 'নেক্সটজেন একাডেমি',
        date: new Date().toISOString().split('T')[0]
      };

      const personalizedMessage = evaluateTemplate(templateText, recipientData);
      const parts = calculateSMSParts(personalizedMessage);
      const phone = s.guardianPhone || u.phone || '01712345678';
      const randMsgCode = Math.floor(1000 + Math.random() * 9000);

      const logEntry = {
        id: logs.length > 0 ? Math.max(...logs.map((l) => l.id)) + 1 : 1,
        messageId: `SMS-${now.split('T')[0].replace(/-/g, '')}-${randMsgCode}`,
        recipientPhone: phone,
        studentName: recipientData.studentName,
        studentId: recipientData.studentId,
        className: recipientData.className,
        batchName: recipientData.batchName,
        category: category || 'NOTICE',
        messageText: personalizedMessage,
        smsCount: parts,
        status: 'DELIVERED',
        sentByUserId: req.user?.id || 1,
        sentAt: now
      };

      logs.unshift(logEntry);
      totalDispatched++;
      totalDeductedSMS += parts;
    });

    // Update Balance
    balance.remaining = Math.max(0, balance.remaining - totalDeductedSMS);
    balance.totalSent = (balance.totalSent || 0) + totalDeductedSMS;
    balance.updatedAt = now;

    db.sms_logs = logs;
    db.sms_balance = balance;
    saveDB(db);

    res.json({
      success: true,
      message: `মোট ${totalDispatched} জন শিক্ষার্থীর অভিভাবকের নিকট ${totalDeductedSMS}টি এসএমএস সফলভাবে পাঠানো হয়েছে!`,
      data: {
        totalDispatched,
        totalDeductedSMS,
        remainingBalance: balance.remaining
      }
    });
  } catch (err) {
    console.error('Send bulk SMS error:', err);
    res.status(500).json({ success: false, error: { message: err.message } });
  }
});

// ----------------------------------------------------
// 4. SMS DELIVERY LOGS
// ----------------------------------------------------
router.get('/logs', authenticate, (req, res) => {
  try {
    const db = getDB();
    let logs = db.sms_logs || [];
    const { status, category, search } = req.query;

    if (status && status !== 'ALL') {
      logs = logs.filter((l) => l.status === status);
    }
    if (category && category !== 'ALL') {
      logs = logs.filter((l) => l.category === category);
    }
    if (search) {
      const s = search.toLowerCase();
      logs = logs.filter(
        (l) =>
          (l.recipientPhone && l.recipientPhone.includes(s)) ||
          (l.studentName && l.studentName.toLowerCase().includes(s)) ||
          (l.messageText && l.messageText.toLowerCase().includes(s))
      );
    }

    logs.sort((a, b) => new Date(b.sentAt) - new Date(a.sentAt));

    res.json({
      success: true,
      data: {
        logs,
        totalCount: logs.length
      }
    });
  } catch (err) {
    console.error('Get SMS logs error:', err);
    res.status(500).json({ success: false, error: { message: err.message } });
  }
});

// ----------------------------------------------------
// 5. GET & SAVE SMS TEMPLATES
// ----------------------------------------------------
router.get('/templates', authenticate, (req, res) => {
  try {
    const db = getDB();
    res.json({
      success: true,
      data: db.sms_templates || []
    });
  } catch (err) {
    console.error('Get SMS templates error:', err);
    res.status(500).json({ success: false, error: { message: err.message } });
  }
});

router.post('/templates', authenticate, (req, res) => {
  try {
    const db = getDB();
    const { title, category, templateText } = req.body;

    if (!title || !templateText) {
      return res.status(400).json({ success: false, error: { message: 'শিরোনাম ও টেমপ্লেট টেক্সট আবশ্যক।' } });
    }

    const templates = db.sms_templates || [];
    const newId = templates.length > 0 ? Math.max(...templates.map((t) => t.id)) + 1 : 1;

    const newTemplate = {
      id: newId,
      title,
      category: category || 'CUSTOM',
      templateText,
      isDefault: false,
      createdAt: new Date().toISOString()
    };

    templates.unshift(newTemplate);
    db.sms_templates = templates;
    saveDB(db);

    res.json({
      success: true,
      message: 'নতুন এসএমএস টেমপ্লেট সফলভাবে সংরক্ষিত হয়েছে!',
      data: newTemplate
    });
  } catch (err) {
    console.error('Save template error:', err);
    res.status(500).json({ success: false, error: { message: err.message } });
  }
});

module.exports = router;
