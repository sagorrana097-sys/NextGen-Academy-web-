const express = require('express');
const {
  Batch,
  Class,
  Section,
  Teacher,
  Student,
  User,
  BatchTransferLog,
  AuditLog
} = require('../models');
const { authenticate, requireRole } = require('../middleware/auth');
const AuditService = require('../services/auditService');

const router = express.Router();

/**
 * GET /api/batches & GET /api/admin/batches
 * Public endpoint for active batches (used by Online Admission Form)
 * Or admin filtered list
 */
router.get('/', async (req, res, next) => {
  try {
    const { classId, className, shift, status } = req.query;
    const where = {};
    if (classId) where.classId = Number(classId);
    if (shift) where.shift = shift;
    if (status) where.status = status;

    const batches = await Batch.findAll({
      where,
      include: [
        { model: Class, as: 'class' },
        { model: Section, as: 'section' },
        { model: Teacher, as: 'mentorTeacher', include: ['user'] }
      ],
      order: [['classId', 'ASC'], ['id', 'ASC']]
    });

    const allStudents = await Student.findAll({
      include: [{ model: User, as: 'user' }]
    });

    // Calculate real-time enrollment statistics and standardized fields
    const formatted = batches.map(batch => {
      const bObj = batch.toJSON ? batch.toJSON() : { ...batch };
      const enrolledStudents = allStudents.filter(s => Number(s.batchId) === Number(batch.id));
      const enrolledCount = enrolledStudents.length;
      const maxCapacity = Number(batch.maxCapacity) || 30;
      const availableSeats = Math.max(0, maxCapacity - enrolledCount);
      const occupancyRate = Math.min(100, Math.round((enrolledCount / maxCapacity) * 100));

      let capacityStatus = 'AVAILABLE';
      if (enrolledCount >= maxCapacity) capacityStatus = 'FULL';
      else if (occupancyRate >= 85) capacityStatus = 'ALMOST_FULL';

      const timeSlot = bObj.timeSlot || (
        bObj.shift === 'MORNING' ? 'সকাল ৮:০০ - ১০:০০' :
        bObj.shift === 'DAY' ? 'দুপুর ২:০০ - ৪:০০' :
        bObj.shift === 'EVENING' ? 'বিকাল ৪:০০ - ৬:০০' :
        'সন্ধ্যা ৬:০০ - ৮:০০'
      );

      const name = bObj.nameBn || bObj.nameEn || `ব্যাচ #${bObj.id}`;
      const resolvedClassName = bObj.className || bObj.class?.name || (bObj.classId ? `Class ${bObj.classId}` : 'Class 9');
      const isActive = bObj.status === 'ACTIVE' || bObj.isActive !== false;

      return {
        ...bObj,
        name,
        nameBn: bObj.nameBn || name,
        timeSlot,
        timeSchedule: timeSlot,
        className: resolvedClassName,
        capacity: maxCapacity,
        isActive,
        enrolledCount,
        availableSeats,
        occupancyRate,
        capacityStatus,
        enrolledStudentsSummary: enrolledStudents.map(s => ({
          id: s.id,
          studentIdNumber: s.studentIdNumber,
          rollNo: s.rollNo,
          name: s.user?.name || 'শিক্ষার্থী'
        }))
      };
    });

    // If query by className
    let results = formatted;
    if (className) {
      results = results.filter(b => b.className === className || b.name.includes(className));
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
 * GET /api/batches/transfer-history
 * Returns student batch transfer audit logs
 */
router.get('/transfer-history', authenticate, requireRole('ADMIN'), async (req, res, next) => {
  try {
    const logs = await BatchTransferLog.findAll({
      include: [
        { model: Student, as: 'student', include: ['user', 'class'] },
        { model: Batch, as: 'fromBatch' },
        { model: Batch, as: 'toBatch' }
      ],
      order: [['id', 'DESC']]
    });

    res.json({
      success: true,
      data: logs
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/batches/:id
 */
router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const batchId = Number(req.params.id);
    const batch = await Batch.findByPk(batchId, {
      include: [
        { model: Class, as: 'class' },
        { model: Section, as: 'section' },
        { model: Teacher, as: 'mentorTeacher', include: ['user'] }
      ]
    });

    if (!batch) {
      return res.status(404).json({ success: false, error: { message: 'ব্যাচটি পাওয়া যায়নি / Batch not found' } });
    }

    const students = await Student.findAll({
      where: { batchId },
      include: [{ model: User, as: 'user' }, { model: Class, as: 'class' }]
    });

    const bObj = batch.toJSON ? batch.toJSON() : { ...batch };
    const enrolledCount = students.length;
    const maxCapacity = Number(batch.maxCapacity) || 30;

    res.json({
      success: true,
      data: {
        ...bObj,
        enrolledCount,
        availableSeats: Math.max(0, maxCapacity - enrolledCount),
        occupancyRate: Math.min(100, Math.round((enrolledCount / maxCapacity) * 100)),
        students
      }
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/batches & POST /api/admin/batches
 * Create new batch (Admin only)
 */
router.post('/', authenticate, requireRole('ADMIN'), async (req, res, next) => {
  try {
    const {
      name,
      nameBn,
      nameEn,
      timeSlot,
      timeSchedule,
      className,
      classId,
      sectionId,
      shift,
      capacity,
      maxCapacity,
      monthlyFee,
      startDate,
      endDate,
      room,
      mentorTeacherId,
      descriptionBn,
      isActive,
      status
    } = req.body;

    const resolvedName = nameBn || name || nameEn;
    if (!resolvedName) {
      return res.status(400).json({
        success: false,
        error: { message: 'ব্যাচের নাম প্রদান করা আবশ্যক (Batch Name is required)' }
      });
    }

    const resolvedClassId = classId ? Number(classId) : (className?.includes('7') ? 10 : className?.includes('8') ? 11 : className?.includes('9') ? 12 : 1);
    const resolvedCapacity = Number(capacity) || Number(maxCapacity) || 30;
    const resolvedStatus = status || (isActive === false ? 'INACTIVE' : 'ACTIVE');
    const resolvedTimeSlot = timeSlot || timeSchedule || (shift === 'MORNING' ? 'সকাল ৮:০০ - ১০:০০' : shift === 'DAY' ? 'দুপুর ২:০০ - ৪:০০' : shift === 'EVENING' ? 'বিকাল ৪:০০ - ৬:০০' : 'সন্ধ্যা ৬:০০ - ৮:০০');

    const newBatch = await Batch.create({
      nameBn: resolvedName,
      nameEn: nameEn || resolvedName,
      code: `B-${Date.now().toString().slice(-4)}`,
      timeSlot: resolvedTimeSlot,
      className: className || `Class ${resolvedClassId}`,
      classId: resolvedClassId,
      sectionId: sectionId ? Number(sectionId) : null,
      shift: shift || 'MORNING',
      maxCapacity: resolvedCapacity,
      monthlyFee: Number(monthlyFee) || 2500,
      startDate: startDate || new Date().toISOString().split('T')[0],
      endDate: endDate || '2026-12-31',
      status: resolvedStatus,
      isActive: resolvedStatus === 'ACTIVE',
      room: room || 'Academic Hall',
      mentorTeacherId: mentorTeacherId ? Number(mentorTeacherId) : 1,
      descriptionBn: descriptionBn || 'নেক্সটজেন একাডেমি নিয়মিত ব্যাচ'
    });

    await AuditService.log({
      userId: req.user.id,
      action: 'CREATE_BATCH',
      resourceType: 'Batch',
      resourceId: newBatch.id,
      ipAddress: req.ip,
      metadata: { name: resolvedName, timeSlot: resolvedTimeSlot }
    });

    res.status(201).json({
      success: true,
      message: 'নতুন ব্যাচ সফলভাবে তৈরি করা হয়েছে! (Batch created successfully)',
      data: newBatch
    });
  } catch (err) {
    next(err);
  }
});

/**
 * PUT /api/batches/:id & PUT /api/admin/batches/:id
 * Edit batch (Admin only)
 */
router.put('/:id', authenticate, requireRole('ADMIN'), async (req, res, next) => {
  try {
    const batchId = Number(req.params.id);
    const batch = await Batch.findByPk(batchId);
    if (!batch) {
      return res.status(404).json({ success: false, error: { message: 'ব্যাচটি পাওয়া যায়নি' } });
    }

    const {
      name,
      nameBn,
      nameEn,
      timeSlot,
      timeSchedule,
      className,
      classId,
      sectionId,
      shift,
      capacity,
      maxCapacity,
      monthlyFee,
      startDate,
      endDate,
      status,
      isActive,
      room,
      mentorTeacherId,
      descriptionBn
    } = req.body;

    const resolvedStatus = status !== undefined ? status : (isActive !== undefined ? (isActive ? 'ACTIVE' : 'INACTIVE') : batch.status);
    const resolvedName = nameBn || name || nameEn || batch.nameBn;
    const resolvedTimeSlot = timeSlot || timeSchedule || batch.timeSlot;
    const resolvedCapacity = capacity !== undefined ? Number(capacity) : (maxCapacity !== undefined ? Number(maxCapacity) : batch.maxCapacity);

    await Batch.update(
      {
        nameBn: resolvedName,
        nameEn: nameEn || resolvedName,
        timeSlot: resolvedTimeSlot,
        className: className || batch.className,
        classId: classId !== undefined ? Number(classId) : batch.classId,
        sectionId: sectionId !== undefined ? (sectionId ? Number(sectionId) : null) : batch.sectionId,
        shift: shift !== undefined ? shift : batch.shift,
        maxCapacity: resolvedCapacity,
        monthlyFee: monthlyFee !== undefined ? Number(monthlyFee) : batch.monthlyFee,
        startDate: startDate !== undefined ? startDate : batch.startDate,
        endDate: endDate !== undefined ? endDate : batch.endDate,
        status: resolvedStatus,
        isActive: resolvedStatus === 'ACTIVE',
        room: room !== undefined ? room : batch.room,
        mentorTeacherId: mentorTeacherId !== undefined ? Number(mentorTeacherId) : batch.mentorTeacherId,
        descriptionBn: descriptionBn !== undefined ? descriptionBn : batch.descriptionBn
      },
      { where: { id: batchId } }
    );

    const updatedBatch = await Batch.findByPk(batchId);

    await AuditService.log({
      userId: req.user.id,
      action: 'UPDATE_BATCH',
      resourceType: 'Batch',
      resourceId: batch.id,
      ipAddress: req.ip,
      metadata: { name: resolvedName }
    });

    res.json({
      success: true,
      message: 'ব্যাচ তথ্য সফলভাবে আপডেট হয়েছে! (Batch updated successfully)',
      data: updatedBatch
    });
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /api/batches/:id
 * Delete batch (Admin only)
 */
router.delete('/:id', authenticate, requireRole('ADMIN'), async (req, res, next) => {
  try {
    const batchId = Number(req.params.id);
    const batch = await Batch.findByPk(batchId);
    if (!batch) {
      return res.status(404).json({ success: false, error: { message: 'ব্যাচটি পাওয়া যায়নি' } });
    }

    // Check if students are enrolled
    const enrolledCount = await Student.count({ where: { batchId } });
    if (enrolledCount > 0) {
      return res.status(400).json({
        success: false,
        error: {
          message: `এই ব্যাচে ${enrolledCount} জন শিক্ষার্থী ভর্তি রয়েছে। মুছে ফেলার আগে শিক্ষার্থীদের অন্য ব্যাচে শিফট করুন।`
        }
      });
    }

    await Batch.destroy({ where: { id: batchId } });

    await AuditService.log({
      userId: req.user.id,
      action: 'DELETE_BATCH',
      resourceType: 'Batch',
      resourceId: batchId,
      ipAddress: req.ip,
      metadata: { nameBn: batch.nameBn }
    });

    res.json({
      success: true,
      message: 'ব্যাচটি সফলভাবে মুছে ফেলা হয়েছে (Batch deleted successfully)'
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/batches/transfer-student
 * Shift / Transfer student from one batch to another
 */
router.post('/transfer-student', authenticate, requireRole('ADMIN'), async (req, res, next) => {
  try {
    const { studentId, toBatchId, reason } = req.body;

    if (!studentId || !toBatchId) {
      return res.status(400).json({
        success: false,
        error: { message: 'শিক্ষার্থী ও গন্তব্য ব্যাচ নির্বাচন করা আবশ্যক (Student & Target Batch are required)' }
      });
    }

    const student = await Student.findByPk(Number(studentId), {
      include: [{ model: User, as: 'user' }]
    });

    if (!student) {
      return res.status(404).json({ success: false, error: { message: 'শিক্ষার্থী পাওয়া যায়নি / Student not found' } });
    }

    const targetBatch = await Batch.findByPk(Number(toBatchId));
    if (!targetBatch) {
      return res.status(404).json({ success: false, error: { message: 'গন্তব্য ব্যাচটি পাওয়া যায়নি / Target batch not found' } });
    }

    // Check target batch capacity
    const currentEnrolled = await Student.count({ where: { batchId: targetBatch.id } });
    if (currentEnrolled >= targetBatch.maxCapacity) {
      return res.status(400).json({
        success: false,
        error: { message: `গন্তব্য ব্যাচের আসন সংখ্যা পূর্ণ (${currentEnrolled}/${targetBatch.maxCapacity})!` }
      });
    }

    const fromBatchId = student.batchId || null;

    // Update student's batch
    await Student.update(
      {
        batchId: targetBatch.id,
        classId: targetBatch.classId || student.classId
      },
      { where: { id: student.id } }
    );

    // Record Transfer Log
    const transferLog = await BatchTransferLog.create({
      studentId: student.id,
      fromBatchId: fromBatchId,
      toBatchId: targetBatch.id,
      reason: reason || 'অ্যাডমিন কর্তৃক ব্যাচ পুনর্বিন্যাস (Batch Reallocation)',
      transferredBy: req.user.name || 'Admin',
      transferDate: new Date().toISOString().split('T')[0]
    });

    await AuditService.log({
      userId: req.user.id,
      action: 'TRANSFER_STUDENT_BATCH',
      resourceType: 'Student',
      resourceId: student.id,
      ipAddress: req.ip,
      metadata: {
        studentName: student.user?.name,
        fromBatchId,
        toBatchId: targetBatch.id,
        reason
      }
    });

    res.json({
      success: true,
      message: `${student.user?.name || 'শিক্ষার্থী'}-কে সফলভাবে "${targetBatch.nameBn}" ব্যাচে স্থানান্তর করা হয়েছে!`,
      data: {
        student,
        transferLog
      }
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
