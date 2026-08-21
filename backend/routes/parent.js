const express = require('express');
const {
  User,
  Student,
  GuardianStudentMapping,
  Class,
  Section,
  Subject,
  Attendance,
  ExamTerm,
  Mark,
  Invoice,
  Payment,
  Routine,
  Teacher
} = require('../models');
const { authenticate, requireRole } = require('../middleware/auth');
const { verifyStudentAccess } = require('../middleware/ownership');

const router = express.Router();

// Require PARENT (or ADMIN)
router.use(authenticate, requireRole(['PARENT', 'ADMIN']));

/**
 * GET /api/parent/children
 * List all linked children for this parent
 */
router.get('/children', async (req, res, next) => {
  try {
    let where = {};
    if (req.user.role === 'PARENT') {
      where = { parentUserId: req.user.id };
    }

    const mappings = await GuardianStudentMapping.findAll({
      where,
      include: [
        {
          model: Student,
          as: 'student',
          include: [
            { model: User, as: 'user' },
            { model: Class, as: 'class' },
            { model: Section, as: 'section' }
          ]
        }
      ]
    });

    const children = mappings.map(m => ({
      mappingId: m.id,
      relationship: m.relationship,
      isPrimary: m.isPrimary,
      student: m.student
    }));

    res.json({
      success: true,
      data: children
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/parent/children/:studentId/summary
 * Dashboard overview for a selected child
 */
router.get('/children/:studentId/summary', verifyStudentAccess, async (req, res, next) => {
  try {
    const studentId = req.targetStudentId;

    const student = await Student.findByPk(studentId, {
      include: [
        { model: User, as: 'user' },
        { model: Class, as: 'class' },
        { model: Section, as: 'section' }
      ]
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        error: { code: 'STUDENT_NOT_FOUND', message: 'শিক্ষার্থী পাওয়া যায়নি / Student not found' }
      });
    }

    // Attendance rate
    const attendanceRecords = await Attendance.findAll({ where: { studentId } });
    const totalDays = attendanceRecords.length;
    const presentDays = attendanceRecords.filter(a => a.status === 'PRESENT' || a.status === 'LATE').length;
    const attendanceRate = totalDays > 0 ? Number(((presentDays / totalDays) * 100).toFixed(1)) : 96.0;

    // Results GPA
    const marks = await Mark.findAll({ where: { studentId } });
    let gpa = 0.0;
    let totalGradePoints = 0;
    if (marks.length > 0) {
      totalGradePoints = marks.reduce((sum, m) => sum + Number(m.gradePoint || 0), 0);
      gpa = Number((totalGradePoints / marks.length).toFixed(2));
    }

    // Pending Dues
    const unpaidInvoices = await Invoice.findAll({
      where: { studentId, status: 'UNPAID' }
    });
    const totalDue = unpaidInvoices.reduce((sum, inv) => sum + Number(inv.amount || 0), 0);

    res.json({
      success: true,
      data: {
        student,
        metrics: {
          attendanceRate,
          totalAttendanceDays: totalDays,
          presentDays,
          gpa: gpa > 0 ? gpa : 5.0,
          totalDue,
          unpaidInvoicesCount: unpaidInvoices.length
        }
      }
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/parent/children/:studentId/attendance
 * Detailed attendance log for child
 */
router.get('/children/:studentId/attendance', verifyStudentAccess, async (req, res, next) => {
  try {
    const studentId = req.targetStudentId;

    const records = await Attendance.findAll({
      where: { studentId },
      order: [['date', 'DESC']]
    });

    const totalDays = records.length;
    const present = records.filter(r => r.status === 'PRESENT').length;
    const late = records.filter(r => r.status === 'LATE').length;
    const absent = records.filter(r => r.status === 'ABSENT').length;
    const leave = records.filter(r => r.status === 'LEAVE').length;

    res.json({
      success: true,
      data: {
        stats: {
          totalDays,
          present,
          late,
          absent,
          leave,
          percentage: totalDays > 0 ? Number((((present + late) / totalDays) * 100).toFixed(1)) : 100
        },
        records
      }
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/parent/children/:studentId/results
 * Report card and term marks for child
 */
router.get('/children/:studentId/results', verifyStudentAccess, async (req, res, next) => {
  try {
    const studentId = req.targetStudentId;
    const { termId } = req.query;

    const where = { studentId };
    if (termId) where.examTermId = Number(termId);

    const marks = await Mark.findAll({
      where,
      include: [
        { model: Subject, as: 'subject' },
        { model: ExamTerm, as: 'examTerm' }
      ]
    });

    const terms = await ExamTerm.findAll();

    let totalMarks = 0;
    let totalMaxMarks = 0;
    let totalGradePoints = 0;

    marks.forEach(m => {
      totalMarks += Number(m.obtainedMarks || 0);
      totalMaxMarks += Number(m.subject?.totalMarks || 100);
      totalGradePoints += Number(m.gradePoint || 0);
    });

    const gpa = marks.length > 0 ? Number((totalGradePoints / marks.length).toFixed(2)) : 0;
    let overallGrade = 'F';
    if (gpa >= 5.0) overallGrade = 'A+';
    else if (gpa >= 4.0) overallGrade = 'A';
    else if (gpa >= 3.5) overallGrade = 'A-';
    else if (gpa >= 3.0) overallGrade = 'B';
    else if (gpa >= 2.0) overallGrade = 'C';
    else if (gpa >= 1.0) overallGrade = 'D';

    res.json({
      success: true,
      data: {
        terms,
        summary: {
          gpa,
          overallGrade,
          totalMarks,
          totalMaxMarks,
          percentage: totalMaxMarks > 0 ? Number(((totalMarks / totalMaxMarks) * 100).toFixed(1)) : 0
        },
        marks
      }
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/parent/children/:studentId/routine
 * Class routine / timetable for child
 */
router.get('/children/:studentId/routine', verifyStudentAccess, async (req, res, next) => {
  try {
    const student = await Student.findByPk(req.targetStudentId);
    if (!student) {
      return res.status(404).json({ success: false, error: { message: 'Student not found' } });
    }

    const routines = await Routine.findAll({
      where: {
        classId: student.classId,
        sectionId: student.sectionId
      },
      include: [
        { model: Subject, as: 'subject' },
        { model: Teacher, as: 'teacher', include: ['user'] }
      ]
    });

    res.json({
      success: true,
      data: routines
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/parent/children/:studentId/invoices
 * Invoices and payments for child
 */
router.get('/children/:studentId/invoices', verifyStudentAccess, async (req, res, next) => {
  try {
    const studentId = req.targetStudentId;

    const invoices = await Invoice.findAll({
      where: { studentId },
      include: [{ model: Payment, as: 'payments' }],
      order: [['dueDate', 'DESC']]
    });

    res.json({
      success: true,
      data: invoices
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
