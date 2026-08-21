const express = require('express');
const { Teacher, TeacherAttendance, User } = require('../models');
const { authenticate, requireRole } = require('../middleware/auth');
const AuditService = require('../services/auditService');

const router = express.Router();

function formatTime(dateObj = new Date()) {
  return dateObj.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
}

function calculateDuration(checkIn, checkOut) {
  if (!checkIn || !checkOut) return null;
  try {
    const parseTimeToMinutes = (tStr) => {
      if (!tStr) return 0;
      const str = String(tStr).trim().toUpperCase();
      const isPM = str.includes('PM');
      const isAM = str.includes('AM');
      const clean = str.replace(/AM|PM/g, '').trim();
      const parts = clean.split(':').map(Number);
      let hours = parts[0] || 0;
      const mins = parts[1] || 0;
      if (isPM && hours < 12) hours += 12;
      if (isAM && hours === 12) hours = 0;
      return hours * 60 + mins;
    };

    const inMins = parseTimeToMinutes(checkIn);
    const outMins = parseTimeToMinutes(checkOut);
    if (outMins <= inMins) return '0h 0m';
    const diff = outMins - inMins;
    const h = Math.floor(diff / 60);
    const m = diff % 60;
    return `${h}h ${m}m`;
  } catch (e) {
    return null;
  }
}

/**
 * GET /api/teacher-attendance/sheet
 * Get daily attendance sheet of all teachers for a specific date
 */
router.get('/sheet', authenticate, requireRole(['ADMIN', 'TEACHER']), async (req, res, next) => {
  try {
    const date = req.query.date || new Date().toISOString().split('T')[0];

    const teachers = await Teacher.findAll({
      include: [{ model: User, as: 'user' }]
    });

    const existingRecords = await TeacherAttendance.findAll({
      where: { date }
    });

    const sheet = teachers.map(teacher => {
      const rec = existingRecords.find(r => r.teacherId === teacher.id);
      return {
        teacherId: teacher.id,
        name: teacher.user?.name || 'শিক্ষক',
        designation: teacher.designation || 'সহকারী শিক্ষক',
        phone: teacher.user?.phone || '',
        avatar: teacher.user?.avatar || null,
        status: rec?.status || 'PRESENT',
        checkInTime: rec?.checkInTime || (rec ? '' : '08:45 AM'),
        checkOutTime: rec?.checkOutTime || (rec ? '' : '04:30 PM'),
        workHours: rec?.workHours || (rec ? '' : '7h 45m'),
        remarks: rec?.remarks || '',
        isSaved: !!rec
      };
    });

    res.json({
      success: true,
      data: {
        date,
        totalTeachers: teachers.length,
        presentCount: sheet.filter(s => s.status === 'PRESENT').length,
        lateCount: sheet.filter(s => s.status === 'LATE').length,
        absentCount: sheet.filter(s => s.status === 'ABSENT').length,
        leaveCount: sheet.filter(s => s.status === 'ON_LEAVE').length,
        sheet
      }
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/teacher-attendance/bulk-save
 * Admin manual bulk save/update teacher attendance for a specific date
 */
router.post('/bulk-save', authenticate, requireRole(['ADMIN']), async (req, res, next) => {
  try {
    const { date, records } = req.body;

    if (!date || !Array.isArray(records)) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_DATA', message: 'তারিখ এবং শিক্ষক উপস্থিতির তালিকা আবশ্যক' }
      });
    }

    const savedRecords = [];
    for (const item of records) {
      const workHours = item.workHours || calculateDuration(item.checkInTime, item.checkOutTime) || (item.status === 'PRESENT' ? '7h 45m' : '0h 0m');

      const existing = await TeacherAttendance.findOne({
        where: { teacherId: Number(item.teacherId), date }
      });

      if (existing) {
        await TeacherAttendance.update({
          status: item.status || 'PRESENT',
          checkInTime: item.checkInTime || null,
          checkOutTime: item.checkOutTime || null,
          workHours,
          remarks: item.remarks || '',
          source: 'ADMIN'
        }, { where: { id: existing.id } });
        savedRecords.push({ id: existing.id, ...item, workHours });
      } else {
        const created = await TeacherAttendance.create({
          teacherId: Number(item.teacherId),
          date,
          status: item.status || 'PRESENT',
          checkInTime: item.checkInTime || null,
          checkOutTime: item.checkOutTime || null,
          workHours,
          remarks: item.remarks || '',
          source: 'ADMIN'
        });
        savedRecords.push(created);
      }
    }

    await AuditService.log({
      req,
      userId: req.user.id,
      action: 'ADMIN_UPDATE_TEACHER_ATTENDANCE',
      entityType: 'teacher_attendance',
      entityId: date,
      details: `অ্যাডমিন ${date} তারিখের শিক্ষক উপস্থিতি সংরক্ষণ করেছেন (${records.length} জন)`
    });

    res.json({
      success: true,
      message: 'শিক্ষক উপস্থিতি সফলভাবে সংরক্ষণ করা হয়েছে!',
      data: savedRecords
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/teacher-attendance/monthly-report
 * Admin Monthly Attendance & Working Hours Report
 */
router.get('/monthly-report', authenticate, requireRole(['ADMIN']), async (req, res, next) => {
  try {
    const month = req.query.month || new Date().toISOString().slice(5, 7); // '08'
    const year = req.query.year || new Date().getFullYear(); // 2026

    const teachers = await Teacher.findAll({
      include: [{ model: User, as: 'user' }]
    });

    const allAttendances = await TeacherAttendance.findAll();
    const monthPrefix = `${year}-${String(month).padStart(2, '0')}`;
    const monthlyLogs = allAttendances.filter(a => (a.date || '').startsWith(monthPrefix));

    const report = teachers.map(t => {
      const logs = monthlyLogs.filter(l => l.teacherId === t.id);
      const totalPresent = logs.filter(l => l.status === 'PRESENT' || l.status === 'LATE').length;
      const lateDays = logs.filter(l => l.status === 'LATE').length;
      const absentDays = logs.filter(l => l.status === 'ABSENT').length;
      const leaveDays = logs.filter(l => l.status === 'ON_LEAVE').length;
      const totalLoggedDays = logs.length || 1;
      const attendanceRate = Math.round((totalPresent / (totalLoggedDays || 1)) * 100);

      return {
        teacherId: t.id,
        name: t.user?.name || 'শিক্ষক',
        designation: t.designation || 'সহকারী শিক্ষক',
        phone: t.user?.phone || '',
        avatar: t.user?.avatar || null,
        totalPresent,
        lateDays,
        absentDays,
        leaveDays,
        attendanceRate: isNaN(attendanceRate) ? 100 : attendanceRate,
        logsCount: logs.length
      };
    });

    res.json({
      success: true,
      data: {
        month,
        year,
        report
      }
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/teacher-attendance/my-attendance
 * Logged-in Teacher's personal attendance overview and logs
 */
router.get('/my-attendance', authenticate, requireRole(['TEACHER']), async (req, res, next) => {
  try {
    const teacher = await Teacher.findOne({ where: { userId: req.user.id } });
    if (!teacher) {
      return res.status(404).json({
        success: false,
        error: { code: 'TEACHER_NOT_FOUND', message: 'শিক্ষক প্রোফাইল পাওয়া যায়নি' }
      });
    }

    const today = new Date().toISOString().split('T')[0];
    const todayLog = await TeacherAttendance.findOne({
      where: { teacherId: teacher.id, date: today }
    });

    const allLogs = await TeacherAttendance.findAll({
      where: { teacherId: teacher.id },
      order: [['date', 'DESC']]
    });

    const totalPresent = allLogs.filter(l => l.status === 'PRESENT' || l.status === 'LATE').length;
    const lateDays = allLogs.filter(l => l.status === 'LATE').length;
    const leaveDays = allLogs.filter(l => l.status === 'ON_LEAVE').length;
    const absentDays = allLogs.filter(l => l.status === 'ABSENT').length;

    res.json({
      success: true,
      data: {
        teacherId: teacher.id,
        today: {
          date: today,
          status: todayLog?.status || 'NOT_MARKED',
          checkInTime: todayLog?.checkInTime || null,
          checkOutTime: todayLog?.checkOutTime || null,
          workHours: todayLog?.workHours || null,
          remarks: todayLog?.remarks || ''
        },
        stats: {
          totalPresent,
          lateDays,
          leaveDays,
          absentDays,
          totalLogged: allLogs.length
        },
        logs: allLogs.slice(0, 30)
      }
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/teacher-attendance/punch-in
 * Teacher Self Punch-in (Check-in)
 */
router.post('/punch-in', authenticate, requireRole(['TEACHER']), async (req, res, next) => {
  try {
    const teacher = await Teacher.findOne({ where: { userId: req.user.id } });
    if (!teacher) {
      return res.status(404).json({
        success: false,
        error: { code: 'TEACHER_NOT_FOUND', message: 'শিক্ষক প্রোফাইল পাওয়া যায়নি' }
      });
    }

    const today = new Date().toISOString().split('T')[0];
    const currentTime = formatTime();

    // Check if after 9:15 AM
    const now = new Date();
    const isLate = now.getHours() > 9 || (now.getHours() === 9 && now.getMinutes() > 15);
    const initialStatus = isLate ? 'LATE' : 'PRESENT';

    let log = await TeacherAttendance.findOne({
      where: { teacherId: teacher.id, date: today }
    });

    if (log && log.checkInTime) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'ALREADY_CHECKED_IN',
          message: `আপনি ইতিমধ্যে আজ ${log.checkInTime}-এ চেক-ইন সম্পন্ন করেছেন!`
        }
      });
    }

    if (log) {
      await TeacherAttendance.update({
        checkInTime: currentTime,
        status: initialStatus,
        source: 'SELF'
      }, { where: { id: log.id } });
    } else {
      log = await TeacherAttendance.create({
        teacherId: teacher.id,
        date: today,
        status: initialStatus,
        checkInTime: currentTime,
        checkOutTime: null,
        workHours: null,
        remarks: isLate ? 'দেরিতে আগমন (Late Arrival)' : 'সময়মতো উপস্থিতি',
        source: 'SELF'
      });
    }

    await AuditService.log({
      req,
      userId: req.user.id,
      action: 'TEACHER_PUNCH_IN',
      entityType: 'teacher_attendance',
      entityId: today,
      details: `${req.user.name} চেক-ইন সম্পন্ন করেছেন: ${currentTime} (${initialStatus})`
    });

    res.json({
      success: true,
      message: `চেক-ইন সফল হয়েছে! সময়: ${currentTime}`,
      data: {
        date: today,
        checkInTime: currentTime,
        status: initialStatus
      }
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/teacher-attendance/punch-out
 * Teacher Self Punch-out (Check-out)
 */
router.post('/punch-out', authenticate, requireRole(['TEACHER']), async (req, res, next) => {
  try {
    const teacher = await Teacher.findOne({ where: { userId: req.user.id } });
    if (!teacher) {
      return res.status(404).json({
        success: false,
        error: { code: 'TEACHER_NOT_FOUND', message: 'শিক্ষক প্রোফাইল পাওয়া যায়নি' }
      });
    }

    const today = new Date().toISOString().split('T')[0];
    const currentTime = formatTime();

    let log = await TeacherAttendance.findOne({
      where: { teacherId: teacher.id, date: today }
    });

    if (!log || !log.checkInTime) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'CHECK_IN_REQUIRED',
          message: 'চেক-আউট করার পূর্বে অনুগ্রহ করে প্রথমে চেক-ইন করুন!'
        }
      });
    }

    const duration = calculateDuration(log.checkInTime, currentTime) || '7h 30m';

    await TeacherAttendance.update({
      checkOutTime: currentTime,
      workHours: duration,
      source: 'SELF'
    }, { where: { id: log.id } });

    await AuditService.log({
      req,
      userId: req.user.id,
      action: 'TEACHER_PUNCH_OUT',
      entityType: 'teacher_attendance',
      entityId: today,
      details: `${req.user.name} চেক-আউট সম্পন্ন করেছেন: ${currentTime} (কর্মঘণ্টা: ${duration})`
    });

    res.json({
      success: true,
      message: `চেক-আউট সফল হয়েছে! কর্মঘণ্টা: ${duration}`,
      data: {
        date: today,
        checkInTime: log.checkInTime,
        checkOutTime: currentTime,
        workHours: duration
      }
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
