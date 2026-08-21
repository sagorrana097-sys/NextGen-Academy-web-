const express = require('express');
const {
  Homework,
  HomeworkStatus,
  Student,
  Subject,
  Class,
  Section,
  Teacher,
  User
} = require('../models');
const { authenticate, requireRole } = require('../middleware/auth');
const { verifyStudentAccess } = require('../middleware/ownership');
const AuditService = require('../services/auditService');

const router = express.Router();

router.use(authenticate);

/**
 * GET /api/homework
 * List homeworks by class and section
 */
router.get('/', async (req, res, next) => {
  try {
    const { classId, sectionId, date } = req.query;
    const where = {};
    if (classId) where.classId = Number(classId);
    if (sectionId) where.sectionId = Number(sectionId);
    if (date) where.assignedDate = date;

    const list = await Homework.findAll({
      where,
      include: [
        { model: Subject, as: 'subject' },
        { model: Class, as: 'class' },
        { model: Section, as: 'section' },
        { model: Teacher, as: 'teacher', include: ['user'] }
      ],
      order: [['dueDate', 'DESC']]
    });

    res.json({
      success: true,
      data: list
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/homework
 * Create new daily homework (Teacher / Admin only)
 */
router.post('/', requireRole(['TEACHER', 'ADMIN']), async (req, res, next) => {
  try {
    const {
      classId,
      sectionId,
      subjectId,
      topicBn,
      topicEn,
      descriptionBn,
      descriptionEn,
      assignedDate,
      dueDate,
      attachmentNote,
      attachmentImage,
      imageUrl
    } = req.body;

    if (!classId || !subjectId || !topicBn || !dueDate) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'MISSING_FIELDS',
          message: 'শ্রেণি, বিষয়, টপিক এবং জমা দেওয়ার শেষ তারিখ আবশ্যক / Class, Subject, Topic and Due Date are required'
        }
      });
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const newHomework = await Homework.create({
      classId: Number(classId),
      sectionId: sectionId ? Number(sectionId) : 1,
      subjectId: Number(subjectId),
      teacherId: req.user.teacherId || 1,
      assignedDate: assignedDate || todayStr,
      dueDate,
      topicBn,
      topicEn: topicEn || topicBn,
      descriptionBn: descriptionBn || topicBn,
      descriptionEn: descriptionEn || descriptionBn || topicBn,
      attachmentNote: attachmentNote || '',
      attachmentImage: attachmentImage || imageUrl || null
    });

    // Record audit log
    await AuditService.log({
      req,
      userId: req.user.id,
      action: 'HOMEWORK_POST',
      entityType: 'homework',
      entityId: newHomework.id,
      newValue: newHomework,
      details: `Teacher posted daily homework "${newHomework.topicBn}" for Class #${newHomework.classId} (Due: ${newHomework.dueDate})`
    });

    const populated = await Homework.findByPk(newHomework.id, {
      include: [
        { model: Subject, as: 'subject' },
        { model: Class, as: 'class' },
        { model: Section, as: 'section' }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'বাড়ির কাজ সফলভাবে পোস্ট করা হয়েছে! / Homework posted successfully!',
      data: populated
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/homework/student/:studentId
 * Get homework list for a student with their completion status
 */
router.get('/student/:studentId', verifyStudentAccess, async (req, res, next) => {
  try {
    const studentId = req.targetStudentId;
    const student = await Student.findByPk(studentId);

    if (!student) {
      return res.status(404).json({
        success: false,
        error: { code: 'STUDENT_NOT_FOUND', message: 'Student not found' }
      });
    }

    // Get all homework assigned to student's class and section
    const homeworks = await Homework.findAll({
      where: {
        classId: student.classId
      },
      include: [
        { model: Subject, as: 'subject' },
        { model: Class, as: 'class' },
        { model: Section, as: 'section' },
        { model: Teacher, as: 'teacher', include: ['user'] }
      ],
      order: [['dueDate', 'DESC']]
    });

    // Filter section if set
    const filtered = homeworks.filter(
      h => !h.sectionId || h.sectionId === student.sectionId
    );

    // Get student's status for these homeworks
    const hwIds = filtered.map(h => h.id);
    const statuses = await HomeworkStatus.findAll({
      where: {
        studentId,
        homeworkId: { $in: hwIds }
      }
    });

    const result = filtered.map(hw => {
      const st = statuses.find(s => s.homeworkId === hw.id);
      return {
        ...hw,
        status: st ? st.status : 'PENDING',
        completedAt: st ? st.completedAt : null,
        statusId: st ? st.id : null
      };
    });

    res.json({
      success: true,
      data: result
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/homework/:id/toggle-status
 * Mark homework as COMPLETED or PENDING for a student
 */
router.post('/:id/toggle-status', async (req, res, next) => {
  try {
    const homeworkId = Number(req.params.id);
    let studentId = req.body.studentId;

    if (req.user.role === 'STUDENT') {
      studentId = req.user.studentId;
    } else if (req.user.role === 'PARENT') {
      if (!studentId || !req.user.linkedStudentIds.includes(Number(studentId))) {
        return res.status(403).json({
          success: false,
          error: { code: 'FORBIDDEN_STUDENT', message: 'Unauthorized for this student' }
        });
      }
    }

    if (!studentId) {
      return res.status(400).json({
        success: false,
        error: { code: 'STUDENT_REQUIRED', message: 'Student ID required' }
      });
    }

    const numStudentId = Number(studentId);
    let record = await HomeworkStatus.findOne({
      where: {
        homeworkId,
        studentId: numStudentId
      }
    });

    const targetStatus = req.body.status || (record && record.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED');
    const now = new Date().toISOString();

    if (record) {
      await HomeworkStatus.update(
        {
          status: targetStatus,
          completedAt: targetStatus === 'COMPLETED' ? now : null
        },
        { where: { id: record.id } }
      );
      record.status = targetStatus;
      record.completedAt = targetStatus === 'COMPLETED' ? now : null;
    } else {
      record = await HomeworkStatus.create({
        homeworkId,
        studentId: numStudentId,
        status: targetStatus,
        completedAt: targetStatus === 'COMPLETED' ? now : null
      });
    }

    res.json({
      success: true,
      data: record
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
