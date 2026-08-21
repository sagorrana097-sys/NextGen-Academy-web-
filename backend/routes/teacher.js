const express = require('express');
const {
  User,
  Student,
  Teacher,
  TeacherClassAssignment,
  Class,
  Section,
  Subject,
  Attendance,
  ExamTerm,
  Mark
} = require('../models');
const { authenticate, requireRole } = require('../middleware/auth');
const AuditService = require('../services/auditService');
const SMSService = require('../services/smsService');

const router = express.Router();

// Guard to TEACHER or ADMIN
router.use(authenticate, requireRole(['TEACHER', 'ADMIN']));

/**
 * GET /api/teacher/classes
 * Get classes and subjects assigned to this teacher
 */
router.get('/classes', async (req, res, next) => {
  try {
    let where = {};
    if (req.user.role === 'TEACHER') {
      where = { teacherId: req.user.teacherId };
    }

    const assignments = await TeacherClassAssignment.findAll({
      where,
      include: [
        { model: Class, as: 'class' },
        { model: Section, as: 'section' },
        { model: Subject, as: 'subject' }
      ]
    });

    res.json({
      success: true,
      data: assignments
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/teacher/students
 * Get students in a specific class and section
 */
router.get('/students', async (req, res, next) => {
  try {
    const { classId, sectionId } = req.query;
    const where = {};
    if (classId) where.classId = Number(classId);
    if (sectionId) where.sectionId = Number(sectionId);

    const students = await Student.findAll({
      where,
      include: [
        { model: User, as: 'user' },
        { model: Class, as: 'class' },
        { model: Section, as: 'section' }
      ],
      order: [['rollNo', 'ASC']]
    });

    res.json({
      success: true,
      data: students
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/teacher/attendance
 * Get attendance records for a specific date and class
 */
router.get('/attendance', async (req, res, next) => {
  try {
    const { date, classId, sectionId } = req.query;
    const targetDate = date || new Date().toISOString().split('T')[0];

    // Find students
    const studentWhere = {};
    if (classId) studentWhere.classId = Number(classId);
    if (sectionId) studentWhere.sectionId = Number(sectionId);

    const students = await Student.findAll({
      where: studentWhere,
      include: [{ model: User, as: 'user' }],
      order: [['rollNo', 'ASC']]
    });

    const studentIds = students.map(s => s.id);
    const existingRecords = await Attendance.findAll({
      where: {
        date: targetDate,
        studentId: { $in: studentIds }
      }
    });

    // Merge students with their attendance record
    const attendanceSheet = students.map(st => {
      const rec = existingRecords.find(r => r.studentId === st.id);
      return {
        studentId: st.id,
        rollNo: st.rollNo,
        name: st.user?.name || `Student ${st.rollNo}`,
        studentIdNumber: st.studentIdNumber,
        status: rec ? rec.status : 'PRESENT', // default to PRESENT
        remarks: rec ? rec.remarks : '',
        recordId: rec ? rec.id : null
      };
    });

    res.json({
      success: true,
      data: {
        date: targetDate,
        total: attendanceSheet.length,
        sheet: attendanceSheet
      }
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/teacher/attendance
 * Batch save/update attendance with audit logging
 */
router.post('/attendance', async (req, res, next) => {
  try {
    const { date, records } = req.body;

    if (!date || !Array.isArray(records) || records.length === 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_ATTENDANCE_PAYLOAD',
          message: 'তারিখ এবং শিক্ষার্থীদের উপস্থিতির তালিকা আবশ্যক / Date and attendance records array are required'
        }
      });
    }

    const savedRecords = [];
    for (const item of records) {
      const existing = await Attendance.findOne({
        where: {
          studentId: Number(item.studentId),
          date
        }
      });

      if (existing) {
        const oldValue = { status: existing.status, remarks: existing.remarks };
        await Attendance.update(
          {
            status: item.status,
            remarks: item.remarks || '',
            recordedByUserId: req.user.id
          },
          { where: { id: existing.id } }
        );

        // Audit log only if changed
        if (existing.status !== item.status) {
          await AuditService.log({
            req,
            userId: req.user.id,
            action: 'ATTENDANCE_UPDATE',
            entityType: 'attendance',
            entityId: existing.id,
            oldValue,
            newValue: { status: item.status, remarks: item.remarks },
            details: `Updated attendance for student #${item.studentId} on ${date}: ${oldValue.status} -> ${item.status}`
          });
        }
        savedRecords.push({ ...existing, status: item.status, remarks: item.remarks });
      } else {
        const created = await Attendance.create({
          studentId: Number(item.studentId),
          date,
          status: item.status || 'PRESENT',
          remarks: item.remarks || '',
          recordedByUserId: req.user.id
        });

        await AuditService.log({
          req,
          userId: req.user.id,
          action: 'ATTENDANCE_MARK',
          entityType: 'attendance',
          entityId: created.id,
          newValue: created,
          details: `Marked attendance for student #${item.studentId} on ${date}: ${item.status}`
        });

        savedRecords.push(created);
      }
    }

    // Check if auto-send absent SMS is enabled
    let smsDispatchResult = null;
    if (req.body.autoSendAbsentSms) {
      const absentStudentIds = records.filter(r => r.status === 'ABSENT').map(r => Number(r.studentId));
      if (absentStudentIds.length > 0) {
        smsDispatchResult = await SMSService.sendBulkAbsentSMS({
          studentIds: absentStudentIds,
          date,
          req,
          senderUserId: req.user.id
        });
      }
    }

    res.json({
      success: true,
      message: 'উপস্থিতি সফলভাবে সংরক্ষণ করা হয়েছে / Attendance saved successfully',
      data: savedRecords,
      smsDispatch: smsDispatchResult
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/teacher/attendance/send-absent-sms
 * 1-Click Send Absent SMS to parents of all absent students on a specific date
 */
router.post('/attendance/send-absent-sms', async (req, res, next) => {
  try {
    const { date, classId, sectionId, studentIds } = req.body;
    const targetDate = date || new Date().toISOString().split('T')[0];

    let targetStudentIds = [];
    if (Array.isArray(studentIds) && studentIds.length > 0) {
      targetStudentIds = studentIds.map(Number);
    } else {
      // Find all students marked ABSENT on this date
      const absentRecords = await Attendance.findAll({
        where: {
          date: targetDate,
          status: 'ABSENT'
        }
      });

      let candidateIds = absentRecords.map(r => r.studentId);
      if (classId) {
        const classStudents = await Student.findAll({
          where: {
            classId: Number(classId),
            ...(sectionId && { sectionId: Number(sectionId) })
          }
        });
        const classStudentIdSet = new Set(classStudents.map(s => s.id));
        candidateIds = candidateIds.filter(id => classStudentIdSet.has(id));
      }
      targetStudentIds = candidateIds;
    }

    if (targetStudentIds.length === 0) {
      return res.json({
        success: true,
        message: 'নির্বাচিত তারিখ ও শ্রেণিতে কোনো অনুপস্থিত শিক্ষার্থী পাওয়া যায়নি / No absent students found for selected date',
        sentCount: 0,
        results: []
      });
    }

    const dispatchResult = await SMSService.sendBulkAbsentSMS({
      studentIds: targetStudentIds,
      date: targetDate,
      req,
      senderUserId: req.user.id
    });

    res.json({
      success: true,
      message: `অভিভাবকের নম্বরে SMS সফলভাবে পাঠানো হয়েছে (${dispatchResult.sentCount} জন অভিভাবক)`,
      data: dispatchResult
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/teacher/marks
 * Get marks entered for a subject and exam term
 */
router.get('/marks', async (req, res, next) => {
  try {
    const { classId, subjectId, examTermId } = req.query;

    const students = await Student.findAll({
      where: classId ? { classId: Number(classId) } : {},
      include: [{ model: User, as: 'user' }],
      order: [['rollNo', 'ASC']]
    });

    const studentIds = students.map(s => s.id);
    const existingMarks = await Mark.findAll({
      where: {
        examTermId: Number(examTermId || 1),
        subjectId: Number(subjectId || 1),
        studentId: { $in: studentIds }
      }
    });

    const marksSheet = students.map(st => {
      const m = existingMarks.find(em => em.studentId === st.id);
      return {
        studentId: st.id,
        rollNo: st.rollNo,
        name: st.user?.name || `Student ${st.rollNo}`,
        studentIdNumber: st.studentIdNumber,
        obtainedMarks: m ? m.obtainedMarks : 0,
        gradePoint: m ? m.gradePoint : 0,
        letterGrade: m ? m.letterGrade : 'F',
        teacherRemarks: m ? m.teacherRemarks : '',
        markId: m ? m.id : null
      };
    });

    res.json({
      success: true,
      data: marksSheet
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/teacher/marks
 * Enter or update exam marks with GPA calculation and audit logging
 */
router.post('/marks', async (req, res, next) => {
  try {
    const { studentId, examTermId, subjectId, obtainedMarks, teacherRemarks } = req.body;

    const numMarks = Number(obtainedMarks);
    if (isNaN(numMarks) || numMarks < 0 || numMarks > 100) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_MARKS',
          message: 'নম্বর অবশ্যই ০ থেকে ১০০ এর মধ্যে হতে হবে / Marks must be between 0 and 100'
        }
      });
    }

    // Bangladeshi GPA Scale helper
    let gradePoint = 0.0;
    let letterGrade = 'F';
    if (numMarks >= 80) { gradePoint = 5.0; letterGrade = 'A+'; }
    else if (numMarks >= 70) { gradePoint = 4.0; letterGrade = 'A'; }
    else if (numMarks >= 60) { gradePoint = 3.5; letterGrade = 'A-'; }
    else if (numMarks >= 50) { gradePoint = 3.0; letterGrade = 'B'; }
    else if (numMarks >= 40) { gradePoint = 2.0; letterGrade = 'C'; }
    else if (numMarks >= 33) { gradePoint = 1.0; letterGrade = 'D'; }

    const existing = await Mark.findOne({
      where: {
        studentId: Number(studentId),
        examTermId: Number(examTermId),
        subjectId: Number(subjectId)
      }
    });

    let resultRecord;
    if (existing) {
      const oldValue = { ...existing };
      await Mark.update(
        {
          obtainedMarks: numMarks,
          gradePoint,
          letterGrade,
          teacherRemarks: teacherRemarks || existing.teacherRemarks,
          submittedByUserId: req.user.id
        },
        { where: { id: existing.id } }
      );
      resultRecord = { ...existing, obtainedMarks: numMarks, gradePoint, letterGrade, teacherRemarks };

      await AuditService.log({
        req,
        userId: req.user.id,
        action: 'MARKS_UPDATE',
        entityType: 'marks',
        entityId: existing.id,
        oldValue,
        newValue: resultRecord,
        details: `Updated marks for student #${studentId}, Subject #${subjectId}: ${oldValue.obtainedMarks} (${oldValue.letterGrade}) -> ${numMarks} (${letterGrade})`
      });
    } else {
      resultRecord = await Mark.create({
        studentId: Number(studentId),
        examTermId: Number(examTermId),
        subjectId: Number(subjectId),
        obtainedMarks: numMarks,
        gradePoint,
        letterGrade,
        teacherRemarks: teacherRemarks || '',
        submittedByUserId: req.user.id
      });

      await AuditService.log({
        req,
        userId: req.user.id,
        action: 'MARKS_ENTRY',
        entityType: 'marks',
        entityId: resultRecord.id,
        newValue: resultRecord,
        details: `Entered marks for student #${studentId}, Subject #${subjectId}: ${numMarks} (${letterGrade})`
      });
    }

    res.json({
      success: true,
      message: 'নম্বর সফলভাবে এন্ট্রি করা হয়েছে / Marks recorded successfully',
      data: resultRecord
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
