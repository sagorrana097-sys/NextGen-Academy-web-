const express = require('express');
const {
  Routine,
  Batch,
  Class,
  Section,
  Subject,
  Teacher,
  Student,
  User,
  GuardianStudentMapping
} = require('../models');
const { authenticate, requireRole } = require('../middleware/auth');
const AuditService = require('../services/auditService');

const router = express.Router();

const STANDARD_DAYS = [
  { id: 'Saturday', bn: 'শনিবার', en: 'Saturday' },
  { id: 'Sunday', bn: 'রবিবার', en: 'Sunday' },
  { id: 'Monday', bn: 'সোমবার', en: 'Monday' },
  { id: 'Tuesday', bn: 'মঙ্গলবার', en: 'Tuesday' },
  { id: 'Wednesday', bn: 'বুধবার', en: 'Wednesday' },
  { id: 'Thursday', bn: 'বৃহস্পতিবার', en: 'Thursday' }
];

const STANDARD_PERIODS = [
  { period: 1, startTime: '08:30 AM', endTime: '09:15 AM', labelBn: '১ম পিরিয়ড' },
  { period: 2, startTime: '09:20 AM', endTime: '10:05 AM', labelBn: '২য় পিরিয়ড' },
  { period: 3, startTime: '10:10 AM', endTime: '10:55 AM', labelBn: '৩য় পিরিয়ড' },
  { period: 4, startTime: '11:30 AM', endTime: '12:15 PM', labelBn: '৪র্থ পিরিয়ড' },
  { period: 5, startTime: '12:20 PM', endTime: '01:05 PM', labelBn: '৫ম পিরিয়ড' }
];

/**
 * GET /api/routines
 * Filter routines by classId, batchId, teacherId, day
 */
router.get('/', authenticate, async (req, res, next) => {
  try {
    const { classId, batchId, teacherId, day } = req.query;
    const where = {};
    if (classId) where.classId = Number(classId);
    if (batchId) where.batchId = Number(batchId);
    if (teacherId) where.teacherId = Number(teacherId);
    if (day) where.dayNameEn = day;

    const routines = await Routine.findAll({
      where,
      include: [
        { model: Class, as: 'class' },
        { model: Batch, as: 'batch' },
        { model: Subject, as: 'subject' },
        { model: Teacher, as: 'teacher', include: ['user'] }
      ],
      order: [['period', 'ASC'], ['id', 'ASC']]
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
 * GET /api/routines/weekly-grid
 * Aggregated 6-day timetable matrix
 */
router.get('/weekly-grid', authenticate, async (req, res, next) => {
  try {
    const { classId, batchId, teacherId } = req.query;
    const where = {};
    if (batchId) where.batchId = Number(batchId);
    else if (classId) where.classId = Number(classId);
    if (teacherId) where.teacherId = Number(teacherId);

    const allRoutines = await Routine.findAll({
      where,
      include: [
        { model: Class, as: 'class' },
        { model: Batch, as: 'batch' },
        { model: Subject, as: 'subject' },
        { model: Teacher, as: 'teacher', include: ['user'] }
      ]
    });

    let selectedBatch = null;
    if (batchId) {
      selectedBatch = await Batch.findByPk(Number(batchId), {
        include: [{ model: Class, as: 'class' }, { model: Teacher, as: 'mentorTeacher', include: ['user'] }]
      });
    }

    let selectedClass = null;
    if (classId) {
      selectedClass = await Class.findByPk(Number(classId));
    }

    let selectedTeacher = null;
    if (teacherId) {
      selectedTeacher = await Teacher.findByPk(Number(teacherId), {
        include: ['user']
      });
    }

    // Build day-wise schedule rows
    const grid = STANDARD_DAYS.map(day => {
      const daySlots = STANDARD_PERIODS.map(periodInfo => {
        const slot = allRoutines.find(r => {
          const matchDay = (r.dayNameEn && r.dayNameEn.toLowerCase() === day.en.toLowerCase()) ||
            (r.day && r.day.toLowerCase().includes(day.en.toLowerCase())) ||
            (r.day && r.day.includes(day.bn));
          const matchPeriod = Number(r.period) === Number(periodInfo.period);
          return matchDay && matchPeriod;
        });

        return {
          period: periodInfo.period,
          startTime: periodInfo.startTime,
          endTime: periodInfo.endTime,
          labelBn: periodInfo.labelBn,
          slot: slot || null
        };
      });

      return {
        dayId: day.id,
        dayBn: day.bn,
        dayEn: day.en,
        periods: daySlots
      };
    });

    res.json({
      success: true,
      data: {
        meta: {
          class: selectedClass,
          batch: selectedBatch,
          teacher: selectedTeacher,
          periodDefinitions: STANDARD_PERIODS,
          totalSlots: allRoutines.length
        },
        grid
      }
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/routines/my-schedule
 * Context-aware routine based on logged in user's role
 */
router.get('/my-schedule', authenticate, async (req, res, next) => {
  try {
    const userRole = req.user.role;
    let targetClassId = null;
    let targetBatchId = null;
    let targetTeacherId = null;

    if (userRole === 'TEACHER') {
      const teacher = await Teacher.findOne({ where: { userId: req.user.id } });
      if (!teacher) {
        return res.status(404).json({ success: false, error: { message: 'Teacher profile not found' } });
      }
      targetTeacherId = teacher.id;
    } else if (userRole === 'STUDENT') {
      const student = await Student.findOne({ where: { userId: req.user.id } });
      if (student) {
        targetClassId = student.classId;
        targetBatchId = student.batchId;
      }
    } else if (userRole === 'PARENT') {
      const { studentId } = req.query;
      let student = null;
      if (studentId) {
        student = await Student.findByPk(Number(studentId));
      } else {
        const mapping = await GuardianStudentMapping.findOne({ where: { guardianUserId: req.user.id } });
        if (mapping) student = await Student.findByPk(mapping.studentId);
      }
      if (student) {
        targetClassId = student.classId;
        targetBatchId = student.batchId;
      }
    }

    const where = {};
    if (targetTeacherId) where.teacherId = targetTeacherId;
    else if (targetBatchId) where.batchId = targetBatchId;
    else if (targetClassId) where.classId = targetClassId;

    const routines = await Routine.findAll({
      where,
      include: [
        { model: Class, as: 'class' },
        { model: Batch, as: 'batch' },
        { model: Subject, as: 'subject' },
        { model: Teacher, as: 'teacher', include: ['user'] }
      ]
    });

    const grid = STANDARD_DAYS.map(day => {
      const daySlots = STANDARD_PERIODS.map(periodInfo => {
        const slot = routines.find(r => {
          const matchDay = (r.dayNameEn && r.dayNameEn.toLowerCase() === day.en.toLowerCase()) ||
            (r.day && r.day.toLowerCase().includes(day.en.toLowerCase())) ||
            (r.day && r.day.includes(day.bn));
          const matchPeriod = Number(r.period) === Number(periodInfo.period);
          return matchDay && matchPeriod;
        });

        return {
          period: periodInfo.period,
          startTime: periodInfo.startTime,
          endTime: periodInfo.endTime,
          labelBn: periodInfo.labelBn,
          slot: slot || null
        };
      });

      return {
        dayId: day.id,
        dayBn: day.bn,
        dayEn: day.en,
        periods: daySlots
      };
    });

    res.json({
      success: true,
      data: {
        role: userRole,
        grid,
        routines
      }
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/routines
 * Add or overwrite a timetable slot with conflict check
 */
router.post('/', authenticate, requireRole('ADMIN'), async (req, res, next) => {
  try {
    const {
      classId,
      batchId,
      day,
      dayNameBn,
      dayNameEn,
      period,
      startTime,
      endTime,
      subjectId,
      subjectNameBn,
      teacherId,
      room,
      notes
    } = req.body;

    if (!classId || !day || !period || !subjectId || !teacherId) {
      return res.status(400).json({
        success: false,
        error: { message: 'শ্রেণি, বার, পিরিয়ড, বিষয় এবং শিক্ষক নির্বাচন আবশ্যক!' }
      });
    }

    const dayKey = dayNameEn || day;

    // 1. Conflict Check: Is Teacher already assigned to another class during this Day & Period?
    const teacherConflict = await Routine.findOne({
      where: {
        dayNameEn: dayKey,
        period: Number(period),
        teacherId: Number(teacherId)
      },
      include: [{ model: Class, as: 'class' }, { model: Batch, as: 'batch' }]
    });

    if (
      teacherConflict &&
      (!req.body.id || Number(teacherConflict.id) !== Number(req.body.id)) &&
      (Number(teacherConflict.classId) !== Number(classId) || (batchId && Number(teacherConflict.batchId) !== Number(batchId)))
    ) {
      const conflictClass = teacherConflict.class?.nameBn || `Class ${teacherConflict.classId}`;
      return res.status(400).json({
        success: false,
        error: {
          message: `সময়সূচি সংঘাত (Conflict)! নির্বাচিত শিক্ষক উক্ত দিন ও পিরিয়ডে "${conflictClass}" শ্রেণিতে পাঠদানে নিযুক্ত আছেন।`
        }
      });
    }

    // 2. Check if a slot already exists for this batch/class at this Day & Period -> Replace or Update
    const existingSlot = await Routine.findOne({
      where: {
        classId: Number(classId),
        ...(batchId ? { batchId: Number(batchId) } : {}),
        dayNameEn: dayKey,
        period: Number(period)
      }
    });

    let savedRoutine;
    if (existingSlot) {
      await Routine.update(
        {
          startTime: startTime || existingSlot.startTime,
          endTime: endTime || existingSlot.endTime,
          subjectId: Number(subjectId),
          subjectNameBn: subjectNameBn || existingSlot.subjectNameBn,
          teacherId: Number(teacherId),
          room: room || existingSlot.room,
          notes: notes || existingSlot.notes
        },
        { where: { id: existingSlot.id } }
      );
      savedRoutine = await Routine.findByPk(existingSlot.id);
    } else {
      savedRoutine = await Routine.create({
        classId: Number(classId),
        batchId: batchId ? Number(batchId) : null,
        day: `${dayNameBn || day} (${dayNameEn || day})`,
        dayNameBn: dayNameBn || day,
        dayNameEn: dayNameEn || day,
        period: Number(period),
        startTime: startTime || '08:30 AM',
        endTime: endTime || '09:15 AM',
        subjectId: Number(subjectId),
        subjectNameBn: subjectNameBn || 'বিষয়',
        teacherId: Number(teacherId),
        room: room || 'Room 101',
        notes: notes || `পিরিয়ড ${period}`
      });
    }

    await AuditService.log({
      userId: req.user.id,
      action: 'UPDATE_ROUTINE_SLOT',
      resourceType: 'Routine',
      resourceId: savedRoutine.id,
      ipAddress: req.ip,
      metadata: { classId, batchId, day: dayKey, period, subjectId, teacherId }
    });

    res.json({
      success: true,
      message: 'ক্লাস রুটিন স্লট সফলভাবে সংরক্ষণ করা হয়েছে!',
      data: savedRoutine
    });
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /api/routines/:id
 * Delete routine slot
 */
router.delete('/:id', authenticate, requireRole('ADMIN'), async (req, res, next) => {
  try {
    const routineId = Number(req.params.id);
    const routine = await Routine.findByPk(routineId);
    if (!routine) {
      return res.status(404).json({ success: false, error: { message: 'রুটিন স্লট পাওয়া যায়নি' } });
    }

    await Routine.destroy({ where: { id: routineId } });

    await AuditService.log({
      userId: req.user.id,
      action: 'DELETE_ROUTINE_SLOT',
      resourceType: 'Routine',
      resourceId: routineId,
      ipAddress: req.ip
    });

    res.json({
      success: true,
      message: 'রুটিন পিরিয়ড স্লট সফলভাবে মুছে ফেলা হয়েছে'
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
