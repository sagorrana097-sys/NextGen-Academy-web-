const express = require('express');
const {
  User,
  Student,
  Class,
  Section,
  Subject,
  Attendance,
  ExamTerm,
  Mark,
  Invoice,
  Payment,
  Routine,
  Teacher,
  GuardianStudentMapping,
  Homework,
  HomeworkStatus,
  Exam,
  ExamSubmission
} = require('../models');
const { authenticate, requireRole } = require('../middleware/auth');

const router = express.Router();

// Guarded to STUDENT, ADMIN, TEACHER, PARENT
router.use(authenticate, requireRole(['STUDENT', 'ADMIN', 'TEACHER', 'PARENT']));

/**
 * Helper to get student record from request
 */
async function getStudentFromUser(req) {
  let studentId = req.params?.id || req.query?.studentId || req.user?.studentId;
  if (!studentId && req.user.role === 'STUDENT') {
    studentId = req.user.studentId;
  }
  if (!studentId) return null;

  return await Student.findByPk(Number(studentId), {
    include: [
      { model: User, as: 'user' },
      { model: Class, as: 'class' },
      { model: Section, as: 'section' },
      {
        model: GuardianStudentMapping,
        as: 'guardians',
        include: [{ model: User, as: 'parent' }]
      }
    ]
  });
}

/**
 * GET /api/student/:id/full-summary OR /api/student/full-summary
 * Comprehensive 360° Profile & All-in-One Data View
 */
router.get('/:id/full-summary', async (req, res, next) => {
  try {
    const studentId = Number(req.params.id);
    const student = await Student.findByPk(studentId, {
      include: [
        { model: User, as: 'user' },
        { model: Class, as: 'class' },
        { model: Section, as: 'section' },
        {
          model: GuardianStudentMapping,
          as: 'guardians',
          include: [{ model: User, as: 'parent' }]
        }
      ]
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        error: { code: 'STUDENT_NOT_FOUND', message: 'শিক্ষার্থী প্রোফাইল পাওয়া যায়নি / Student record not found' }
      });
    }

    // 1. Attendance Summary & Detailed Log
    const attendanceRecords = await Attendance.findAll({
      where: { studentId: student.id },
      order: [['date', 'DESC']]
    });
    const totalAttDays = attendanceRecords.length;
    const presentDays = attendanceRecords.filter(a => a.status === 'PRESENT').length;
    const lateDays = attendanceRecords.filter(a => a.status === 'LATE').length;
    const absentDays = attendanceRecords.filter(a => a.status === 'ABSENT').length;
    const leaveDays = attendanceRecords.filter(a => a.status === 'LEAVE').length;
    const attendanceRate = totalAttDays > 0
      ? Number((((presentDays + lateDays) / totalAttDays) * 100).toFixed(1))
      : 95.0;

    // 2. Offline / Term Exam Marks & Merit Calculation
    const marks = await Mark.findAll({
      where: { studentId: student.id },
      include: [
        { model: Subject, as: 'subject' },
        { model: ExamTerm, as: 'examTerm' }
      ]
    });

    let totalMarksObtained = 0;
    let totalMaxMarks = 0;
    let totalGradePoints = 0;

    marks.forEach(m => {
      totalMarksObtained += Number(m.obtainedMarks || 0);
      totalMaxMarks += Number(m.subject?.totalMarks || 100);
      totalGradePoints += Number(m.gradePoint || 0);
    });

    const gpa = marks.length > 0 ? Number((totalGradePoints / marks.length).toFixed(2)) : 5.0;
    const resultPercentage = totalMaxMarks > 0 ? Number(((totalMarksObtained / totalMaxMarks) * 100).toFixed(1)) : 88.0;

    // Determine Merit Position in Class
    const classStudents = await Student.findAll({ where: { classId: student.classId } });
    const allMarks = await Mark.findAll();
    
    // Calculate total marks for each classmate
    const classmateScores = classStudents.map(st => {
      const stMarks = allMarks.filter(m => m.studentId === st.id);
      const score = stMarks.reduce((sum, m) => sum + Number(m.obtainedMarks || 0), 0);
      return { studentId: st.id, score };
    });
    classmateScores.sort((a, b) => b.score - a.score);
    const meritRankIndex = classmateScores.findIndex(cs => cs.studentId === student.id);
    const meritPosition = meritRankIndex !== -1 ? meritRankIndex + 1 : 1;

    // 3. Online Exam Submissions & Evaluations
    const examSubmissions = await ExamSubmission.findAll({
      where: { studentId: student.id },
      include: [
        {
          model: Exam,
          as: 'exam',
          include: [{ model: Subject, as: 'subject' }]
        }
      ],
      order: [['submittedAt', 'DESC']]
    });

    // 4. Invoices, Discounts & Financials
    const invoices = await Invoice.findAll({
      where: { studentId: student.id },
      include: [{ model: Payment, as: 'payments' }],
      order: [['dueDate', 'DESC']]
    });

    const totalBaseBilled = invoices.reduce((sum, inv) => sum + (Number(inv.baseAmount) || Number(inv.amount) || 0), 0);
    const totalDiscountAmount = invoices.reduce((sum, inv) => sum + (Number(inv.discountAmount) || 0), 0);
    const totalNetBilled = invoices.reduce((sum, inv) => sum + (Number(inv.amount) || 0), 0);
    const totalPaid = invoices.filter(inv => inv.status === 'PAID').reduce((sum, inv) => sum + (Number(inv.amount) || 0), 0);
    const totalDue = invoices.filter(inv => inv.status === 'UNPAID').reduce((sum, inv) => sum + (Number(inv.amount) || 0), 0);

    // 5. Homework & Assignment Status
    const classHomeworks = await Homework.findAll({
      where: { classId: student.classId },
      include: [
        { model: Subject, as: 'subject' },
        { model: Teacher, as: 'teacher', include: ['user'] }
      ],
      order: [['assignedDate', 'DESC']]
    });

    const homeworkStatuses = await HomeworkStatus.findAll({
      where: { studentId: student.id }
    });

    const homeworkList = classHomeworks.map(hw => {
      const stRecord = homeworkStatuses.find(hs => hs.homeworkId === hw.id);
      const isCompleted = stRecord ? stRecord.status === 'COMPLETED' : false;
      return {
        ...hw,
        status: isCompleted ? 'COMPLETED' : 'PENDING',
        completedAt: stRecord?.completedAt || null
      };
    });

    const completedHwCount = homeworkList.filter(h => h.status === 'COMPLETED').length;
    const pendingHwCount = homeworkList.filter(h => h.status === 'PENDING').length;
    const hwCompletionRate = homeworkList.length > 0
      ? Number(((completedHwCount / homeworkList.length) * 100).toFixed(1))
      : 100;

    res.json({
      success: true,
      data: {
        student,
        metrics: {
          gpa,
          letterGrade: gpa >= 5.0 ? 'A+' : (gpa >= 4.0 ? 'A' : (gpa >= 3.5 ? 'A-' : 'B')),
          meritPosition,
          totalStudentsInClass: classStudents.length,
          resultPercentage,
          totalMarksObtained,
          totalMaxMarks,
          attendanceRate,
          totalAttDays,
          presentDays,
          lateDays,
          absentDays,
          leaveDays,
          totalBaseBilled,
          totalDiscountAmount,
          totalNetBilled,
          totalPaid,
          totalDue,
          totalHomeworks: homeworkList.length,
          completedHomeworks: completedHwCount,
          pendingHomeworks: pendingHwCount,
          homeworkCompletionRate: hwCompletionRate,
          totalOnlineExamsTaken: examSubmissions.length
        },
        attendance: {
          records: attendanceRecords
        },
        academicResults: {
          termMarks: marks,
          onlineSubmissions: examSubmissions
        },
        financials: {
          invoices
        },
        homework: {
          list: homeworkList
        },
        generatedAt: new Date().toISOString()
      }
    });
  } catch (err) {
    next(err);
  }
});

// Self-summary for current logged in student
router.get('/full-summary', async (req, res, next) => {
  try {
    const student = await getStudentFromUser(req);
    if (!student) {
      return res.status(404).json({ success: false, error: { message: 'Student profile not found' } });
    }
    req.params.id = String(student.id);
    return router.handle(req, res, next);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/student/profile
 * Student ID Card, class and academic enrollment profile
 */
router.get('/profile', async (req, res, next) => {
  try {
    const student = await getStudentFromUser(req);
    if (!student) {
      return res.status(404).json({
        success: false,
        error: { code: 'STUDENT_NOT_FOUND', message: 'শিক্ষার্থী প্রোফাইল পাওয়া যায়নি / Student profile not found' }
      });
    }

    res.json({
      success: true,
      data: student
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/student/dashboard
 * Student self-service dashboard stats
 */
router.get('/dashboard', async (req, res, next) => {
  try {
    const student = await getStudentFromUser(req);
    if (!student) {
      return res.status(404).json({ success: false, error: { message: 'Student not found' } });
    }

    const attendanceRecords = await Attendance.findAll({ where: { studentId: student.id } });
    const totalDays = attendanceRecords.length;
    const presentDays = attendanceRecords.filter(a => a.status === 'PRESENT' || a.status === 'LATE').length;
    const attendanceRate = totalDays > 0 ? Number(((presentDays / totalDays) * 100).toFixed(1)) : 95.0;

    const marks = await Mark.findAll({ where: { studentId: student.id } });
    let gpa = 0.0;
    if (marks.length > 0) {
      const totalPoints = marks.reduce((sum, m) => sum + Number(m.gradePoint || 0), 0);
      gpa = Number((totalPoints / marks.length).toFixed(2));
    }

    const unpaidInvoices = await Invoice.findAll({ where: { studentId: student.id, status: 'UNPAID' } });
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
          unpaidCount: unpaidInvoices.length
        }
      }
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/student/attendance
 */
router.get('/attendance', async (req, res, next) => {
  try {
    const student = await getStudentFromUser(req);
    if (!student) return res.status(404).json({ success: false, error: { message: 'Student not found' } });

    const records = await Attendance.findAll({
      where: { studentId: student.id },
      order: [['date', 'DESC']]
    });

    const total = records.length;
    const present = records.filter(r => r.status === 'PRESENT').length;
    const late = records.filter(r => r.status === 'LATE').length;
    const absent = records.filter(r => r.status === 'ABSENT').length;
    const leave = records.filter(r => r.status === 'LEAVE').length;

    res.json({
      success: true,
      data: {
        stats: {
          total,
          present,
          late,
          absent,
          leave,
          percentage: total > 0 ? Number((((present + late) / total) * 100).toFixed(1)) : 100
        },
        records
      }
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/student/results
 */
router.get('/results', async (req, res, next) => {
  try {
    const student = await getStudentFromUser(req);
    if (!student) return res.status(404).json({ success: false, error: { message: 'Student not found' } });

    const marks = await Mark.findAll({
      where: { studentId: student.id },
      include: [
        { model: Subject, as: 'subject' },
        { model: ExamTerm, as: 'examTerm' }
      ]
    });

    let totalMarks = 0;
    let totalMaxMarks = 0;
    let totalGradePoints = 0;

    marks.forEach(m => {
      totalMarks += Number(m.obtainedMarks || 0);
      totalMaxMarks += Number(m.subject?.totalMarks || 100);
      totalGradePoints += Number(m.gradePoint || 0);
    });

    const gpa = marks.length > 0 ? Number((totalGradePoints / marks.length).toFixed(2)) : 0;

    res.json({
      success: true,
      data: {
        summary: {
          gpa,
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
 * GET /api/student/routine
 */
router.get('/routine', async (req, res, next) => {
  try {
    const student = await getStudentFromUser(req);
    if (!student) return res.status(404).json({ success: false, error: { message: 'Student not found' } });

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
 * GET /api/student/invoices
 */
router.get('/invoices', async (req, res, next) => {
  try {
    const student = await getStudentFromUser(req);
    if (!student) return res.status(404).json({ success: false, error: { message: 'Student not found' } });

    const invoices = await Invoice.findAll({
      where: { studentId: student.id },
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

/**
 * GET /api/students / GET /api/student
 * List all students with query filters (search, classId, batchId, status)
 */
router.get('/', async (req, res, next) => {
  try {
    const { classId, batchId, search, status } = req.query;
    const where = {};
    if (classId) where.classId = Number(classId);
    if (batchId) where.batchId = Number(batchId);

    const students = await Student.findAll({
      where,
      include: [
        { model: User, as: 'user' },
        { model: Class, as: 'class' },
        { model: Section, as: 'section' },
        { model: GuardianStudentMapping, as: 'guardians', include: [{ model: User, as: 'parent' }] }
      ],
      order: [['classId', 'ASC'], ['rollNo', 'ASC']]
    });

    let results = students;

    if (status) {
      const isActiveFilter = status.toUpperCase() === 'ACTIVE';
      results = results.filter(s => (s.user ? s.user.isActive : true) === isActiveFilter);
    }

    if (search) {
      const q = search.toLowerCase();
      results = results.filter(s =>
        (s.user && s.user.name && s.user.name.toLowerCase().includes(q)) ||
        (s.studentIdNumber && s.studentIdNumber.toLowerCase().includes(q)) ||
        String(s.rollNo).includes(q) ||
        (s.user && s.user.phone && s.user.phone.includes(q)) ||
        (s.guardians && s.guardians.some(g => g.parent && (g.parent.name?.toLowerCase().includes(q) || g.parent.phone?.includes(q))))
      );
    }

    res.json({
      success: true,
      data: results
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/students/:id
 */
router.get('/:id', async (req, res, next) => {
  try {
    const studentId = Number(req.params.id);
    if (isNaN(studentId)) {
      return next(); // pass to next route if not numeric
    }
    const student = await Student.findByPk(studentId, {
      include: [
        { model: User, as: 'user' },
        { model: Class, as: 'class' },
        { model: Section, as: 'section' },
        { model: GuardianStudentMapping, as: 'guardians', include: [{ model: User, as: 'parent' }] }
      ]
    });

    if (!student) {
      return res.status(404).json({ success: false, error: { message: 'শিক্ষার্থী পাওয়া যায়নি / Student not found' } });
    }

    res.json({
      success: true,
      data: student
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/students
 * Admin-only: Create student
 */
router.post('/', requireRole('ADMIN'), async (req, res, next) => {
  try {
    const {
      name,
      nameBn,
      rollNo,
      classId,
      sectionId = 1,
      batchId = null,
      guardianName,
      guardianPhone,
      bloodGroup = 'B+',
      dob = '2014-01-01',
      gender = 'MALE',
      photo = null,
      address = 'ঢাকা, বাংলাদেশ',
      admissionDate = new Date().toISOString().split('T')[0]
    } = req.body;

    if (!name || !rollNo || !classId) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'শিক্ষার্থীর নাম, রোল নম্বর এবং শ্রেণি আবশ্যক / Name, Roll No, and Class are required'
        }
      });
    }

    const bcrypt = require('bcryptjs');
    const studentCount = await Student.count();
    const studentIdNumber = `NGA-2026-${classId}${String(rollNo).padStart(2, '0')}`;

    // 1. Create Student User Account
    const studentEmail = `student${studentCount + 101}@nextgen.edu.bd`;
    const hashedStudentPwd = await bcrypt.hash('student123', 10);
    const studentUser = await User.create({
      name: nameBn || name,
      email: studentEmail,
      passwordHash: hashedStudentPwd,
      role: 'STUDENT',
      phone: guardianPhone || '01700000000',
      avatar: photo || null,
      isActive: true
    });

    // 2. Create Student Record
    const newStudent = await Student.create({
      userId: studentUser.id,
      studentIdNumber,
      rollNo: Number(rollNo),
      classId: Number(classId),
      sectionId: Number(sectionId) || 1,
      batchId: batchId ? Number(batchId) : null,
      dob,
      bloodGroup,
      gender,
      address,
      admissionDate,
      photo: photo || null
    });

    // 3. Link Parent / Guardian
    if (guardianPhone) {
      let parentUser = await User.findOne({ where: { phone: guardianPhone, role: 'PARENT' } });
      if (!parentUser) {
        const hashedParentPwd = await bcrypt.hash('parent123', 10);
        parentUser = await User.create({
          name: guardianName || `${name}-এর অভিভাবক`,
          email: `parent${studentCount + 101}@nextgen.edu.bd`,
          passwordHash: hashedParentPwd,
          role: 'PARENT',
          phone: guardianPhone,
          isActive: true
        });
      }

      await GuardianStudentMapping.create({
        parentUserId: parentUser.id,
        studentId: newStudent.id,
        relationship: 'GUARDIAN',
        isPrimary: true
      });
    }

    const populated = await Student.findByPk(newStudent.id, {
      include: [
        { model: User, as: 'user' },
        { model: Class, as: 'class' },
        { model: Section, as: 'section' },
        { model: GuardianStudentMapping, as: 'guardians', include: [{ model: User, as: 'parent' }] }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'শিক্ষার্থী সফলভাবে ভর্তি করা হয়েছে! / Student enrolled successfully',
      data: populated
    });
  } catch (err) {
    next(err);
  }
});

/**
 * PUT /api/students/:id
 * Admin-only: Update student details
 */
router.put('/:id', requireRole('ADMIN'), async (req, res, next) => {
  try {
    const studentId = Number(req.params.id);
    const student = await Student.findByPk(studentId, {
      include: [
        { model: User, as: 'user' },
        { model: GuardianStudentMapping, as: 'guardians', include: [{ model: User, as: 'parent' }] }
      ]
    });

    if (!student) {
      return res.status(404).json({ success: false, error: { message: 'শিক্ষার্থী পাওয়া যায়নি' } });
    }

    const {
      name,
      rollNo,
      classId,
      sectionId,
      batchId,
      guardianName,
      guardianPhone,
      bloodGroup,
      dob,
      gender,
      photo,
      address,
      isActive
    } = req.body;

    // 1. Update Student User
    if (student.userId && (name || photo || isActive !== undefined)) {
      await User.update(
        {
          ...(name && { name }),
          ...(photo !== undefined && { avatar: photo }),
          ...(isActive !== undefined && { isActive: Boolean(isActive) })
        },
        { where: { id: student.userId } }
      );
    }

    // 2. Update Student Profile
    const studentUpdate = {};
    if (rollNo !== undefined) studentUpdate.rollNo = Number(rollNo);
    if (classId !== undefined) studentUpdate.classId = Number(classId);
    if (sectionId !== undefined) studentUpdate.sectionId = Number(sectionId);
    if (batchId !== undefined) studentUpdate.batchId = batchId ? Number(batchId) : null;
    if (bloodGroup !== undefined) studentUpdate.bloodGroup = bloodGroup;
    if (dob !== undefined) studentUpdate.dob = dob;
    if (gender !== undefined) studentUpdate.gender = gender;
    if (photo !== undefined) studentUpdate.photo = photo;
    if (address !== undefined) studentUpdate.address = address;

    await Student.update(studentUpdate, { where: { id: studentId } });

    // 3. Update or Link Guardian
    if (guardianPhone || guardianName) {
      const primaryMapping = student.guardians?.find(g => g.isPrimary) || student.guardians?.[0];
      if (primaryMapping && primaryMapping.parent) {
        await User.update(
          {
            ...(guardianName && { name: guardianName }),
            ...(guardianPhone && { phone: guardianPhone })
          },
          { where: { id: primaryMapping.parent.id } }
        );
      }
    }

    const updated = await Student.findByPk(studentId, {
      include: [
        { model: User, as: 'user' },
        { model: Class, as: 'class' },
        { model: Section, as: 'section' },
        { model: GuardianStudentMapping, as: 'guardians', include: [{ model: User, as: 'parent' }] }
      ]
    });

    res.json({
      success: true,
      message: 'শিক্ষার্থীর তথ্য সফলভাবে আপডেট করা হয়েছে! / Student updated successfully',
      data: updated
    });
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /api/students/:id
 * Admin-only: Hard delete student profile & account
 */
router.delete('/:id', requireRole('ADMIN'), async (req, res, next) => {
  try {
    const studentId = Number(req.params.id);
    const student = await Student.findByPk(studentId);

    if (!student) {
      return res.status(404).json({ success: false, error: { message: 'শিক্ষার্থী পাওয়া যায়নি' } });
    }

    // Delete mappings
    await GuardianStudentMapping.destroy({ where: { studentId } });
    if (student.userId) {
      await User.destroy({ where: { id: student.userId } });
    }
    await Student.destroy({ where: { id: studentId } });

    res.json({
      success: true,
      message: 'শিক্ষার্থী সফলভাবে মুছে ফেলা হয়েছে / Student deleted successfully'
    });
  } catch (err) {
    next(err);
  }
});

/**
 * PATCH /api/students/:id/status
 * Admin-only: Fast toggle active/inactive status
 */
router.patch('/:id/status', requireRole('ADMIN'), async (req, res, next) => {
  try {
    const studentId = Number(req.params.id);
    const student = await Student.findByPk(studentId, {
      include: [{ model: User, as: 'user' }]
    });

    if (!student || !student.user) {
      return res.status(404).json({ success: false, error: { message: 'শিক্ষার্থী পাওয়া যায়নি' } });
    }

    const newStatus = req.body.isActive !== undefined ? Boolean(req.body.isActive) : !student.user.isActive;
    await User.update({ isActive: newStatus }, { where: { id: student.user.id } });

    res.json({
      success: true,
      message: newStatus ? 'শিক্ষার্থী অ্যাকাউন্ট সক্রিয় করা হয়েছে' : 'শিক্ষার্থী অ্যাকাউন্ট নিষ্ক্রিয় করা হয়েছে',
      isActive: newStatus
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

