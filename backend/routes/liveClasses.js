const express = require('express');
const jwt = require('jsonwebtoken');
const { LiveClass, LiveClassComment, Class, Section, Subject, Teacher, Student, User } = require('../models');
const { authenticate, requireRole, JWT_SECRET } = require('../middleware/auth');
const { verifyStudentAccess } = require('../middleware/ownership');
const AuditService = require('../services/auditService');

const router = express.Router();

// Helper: Extract user from token if available without failing
function getAuthUser(req) {
  try {
    let token = null;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }
    if (!token) return null;
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}

// Helper: Check if user has permission to unlock non-demo classes
function evaluateClassAccess(user, liveClass) {
  const isDemo = Boolean(liveClass.isDemo);
  if (isDemo) {
    return { isLocked: false, reason: 'FREE_DEMO' };
  }

  if (!user) {
    return { isLocked: true, reason: 'UNAUTHENTICATED' };
  }

  if (user.role === 'ADMIN' || user.role === 'TEACHER') {
    return { isLocked: false, reason: 'STAFF_ACCESS' };
  }

  if (user.role === 'STUDENT' || user.role === 'PARENT') {
    // If student payment status is explicitly UNPAID or not enrolled
    if (user.paymentStatus === 'UNPAID' || user.isEnrolled === false) {
      return { isLocked: true, reason: 'PAYMENT_REQUIRED' };
    }
    return { isLocked: false, reason: 'ENROLLED_STUDENT' };
  }

  return { isLocked: true, reason: 'LOCKED' };
}

// Helper: Format class item with lock status and videoUrl
function formatClassResponse(liveClass, user) {
  const cObj = liveClass.toJSON ? liveClass.toJSON() : { ...liveClass };
  const access = evaluateClassAccess(user, cObj);
  const isDemo = Boolean(cObj.isDemo);
  const isLocked = access.isLocked;

  const rawVideoUrl = cObj.recordingUrl || cObj.meetingLink || '';
  const rawNotesUrl = cObj.noteFileUrl || cObj.notesUrl || '';
  const classGrade = cObj.classGrade || cObj.class?.name || (cObj.classId ? `Class ${cObj.classId}` : 'Class 9');
  const subjectName = cObj.subject?.nameBn || cObj.subject?.nameEn || cObj.subject || 'সাধারণ বিষয়';
  const chapter = cObj.chapter || cObj.topic || '';

  return {
    ...cObj,
    isDemo,
    isLocked,
    lockReason: access.reason,
    classGrade,
    subjectName,
    chapter,
    isLive: cObj.status === 'LIVE',
    videoUrl: isLocked ? '' : rawVideoUrl,
    meetingLink: isLocked ? '' : (cObj.meetingLink || ''),
    recordingUrl: isLocked ? '' : (cObj.recordingUrl || ''),
    notesUrl: isLocked ? '' : rawNotesUrl,
    noteFileUrl: isLocked ? '' : rawNotesUrl,
    noteFileName: cObj.noteFileName || '',
    noteFileSize: cObj.noteFileSize || ''
  };
}

/**
 * GET /api/live-classes
 * List live classes with freemium lock flags (accessible to public & logged-in users)
 */
router.get('/', async (req, res, next) => {
  try {
    const user = getAuthUser(req);
    const { classId, sectionId, subjectId, status, teacherId, search, isDemo } = req.query;
    const where = {};

    if (classId) where.classId = Number(classId);
    if (sectionId) where.sectionId = Number(sectionId);
    if (subjectId) where.subjectId = Number(subjectId);
    if (status) where.status = status.toUpperCase();
    if (teacherId) where.teacherId = Number(teacherId);
    if (isDemo !== undefined) where.isDemo = isDemo === 'true' || isDemo === true;

    let liveClasses = await LiveClass.findAll({
      where,
      include: [
        { model: Class, as: 'class' },
        { model: Section, as: 'section' },
        { model: Subject, as: 'subject' },
        { model: Teacher, as: 'teacher', include: [{ model: User, as: 'user' }] }
      ],
      order: [['scheduledStartTime', 'DESC']]
    });

    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      liveClasses = liveClasses.filter(c =>
        (c.title && c.title.toLowerCase().includes(q)) ||
        (c.description && c.description.toLowerCase().includes(q)) ||
        (c.subject?.nameBn && c.subject.nameBn.toLowerCase().includes(q)) ||
        (c.subject?.nameEn && c.subject.nameEn.toLowerCase().includes(q)) ||
        (c.teacher?.user?.name && c.teacher.user.name.toLowerCase().includes(q))
      );
    }

    const formatted = liveClasses.map(c => formatClassResponse(c, user));

    res.json({
      success: true,
      data: formatted
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/live-classes/demo
 * Public endpoint to fetch all free demo classes
 */
router.get('/demo', async (req, res, next) => {
  try {
    const user = getAuthUser(req);
    let demoClasses = await LiveClass.findAll({
      include: [
        { model: Class, as: 'class' },
        { model: Section, as: 'section' },
        { model: Subject, as: 'subject' },
        { model: Teacher, as: 'teacher', include: [{ model: User, as: 'user' }] }
      ],
      order: [['scheduledStartTime', 'DESC']]
    });

    // Filter demo classes (or first 2 classes as demo if none explicitly set)
    demoClasses = demoClasses.filter(c => Boolean(c.isDemo) || c.id === 1 || c.id === 4);

    const formatted = demoClasses.map(c => {
      const item = { ...c, isDemo: true };
      return formatClassResponse(item, user);
    });

    res.json({
      success: true,
      data: formatted
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/live-classes/alerts
 * Active & Upcoming 15-minute alert classes for dashboard notifications
 */
router.get('/alerts', authenticate, async (req, res, next) => {
  try {
    const { classId, sectionId } = req.query;
    const now = new Date();

    const allClasses = await LiveClass.findAll({
      include: [
        { model: Class, as: 'class' },
        { model: Section, as: 'section' },
        { model: Subject, as: 'subject' },
        { model: Teacher, as: 'teacher', include: [{ model: User, as: 'user' }] }
      ]
    });

    let filtered = allClasses;
    if (classId) {
      filtered = filtered.filter(c => c.classId === Number(classId) && (!c.sectionId || !sectionId || c.sectionId === Number(sectionId)));
    }

    const alerts = filtered.filter(c => {
      if (c.status === 'LIVE') return true;
      if (c.status === 'UPCOMING') {
        const startTime = new Date(c.scheduledStartTime);
        const timeDiffMs = startTime.getTime() - now.getTime();
        return timeDiffMs <= 15 * 60 * 1000 && timeDiffMs >= -30 * 60 * 1000;
      }
      return false;
    });

    res.json({
      success: true,
      data: alerts
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/live-classes/student/:studentId
 * Get live classes applicable for a specific student's class & section
 */
router.get('/student/:studentId', authenticate, verifyStudentAccess, async (req, res, next) => {
  try {
    const student = await Student.findByPk(req.params.studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        error: { code: 'STUDENT_NOT_FOUND', message: 'Student record not found' }
      });
    }

    const { status, subjectId, search } = req.query;

    const allClasses = await LiveClass.findAll({
      where: { classId: student.classId },
      include: [
        { model: Class, as: 'class' },
        { model: Section, as: 'section' },
        { model: Subject, as: 'subject' },
        { model: Teacher, as: 'teacher', include: [{ model: User, as: 'user' }] }
      ],
      order: [['scheduledStartTime', 'DESC']]
    });

    let filtered = allClasses.filter(c => !c.sectionId || c.sectionId === student.sectionId);

    if (status) {
      filtered = filtered.filter(c => c.status === status.toUpperCase());
    }

    if (subjectId) {
      filtered = filtered.filter(c => c.subjectId === Number(subjectId));
    }

    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      filtered = filtered.filter(c =>
        (c.title && c.title.toLowerCase().includes(q)) ||
        (c.description && c.description.toLowerCase().includes(q)) ||
        (c.subject?.nameBn && c.subject.nameBn.toLowerCase().includes(q)) ||
        (c.teacher?.user?.name && c.teacher.user.name.toLowerCase().includes(q))
      );
    }

    const formatted = filtered.map(c => formatClassResponse(c, req.user));

    res.json({
      success: true,
      data: formatted
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/live-classes/recorded/all
 * Fetch all recorded classes / video archives with demo and access control
 */
router.get('/recorded/all', async (req, res, next) => {
  try {
    const user = getAuthUser(req);
    const { classId, subjectId, search, isDemo } = req.query;
    const where = {};
    if (classId) where.classId = Number(classId);
    if (subjectId) where.subjectId = Number(subjectId);
    if (isDemo !== undefined) where.isDemo = isDemo === 'true' || isDemo === true;

    let list = await LiveClass.findAll({
      where,
      include: [
        { model: Class, as: 'class' },
        { model: Section, as: 'section' },
        { model: Subject, as: 'subject' },
        { model: Teacher, as: 'teacher', include: [{ model: User, as: 'user' }] }
      ],
      order: [['scheduledStartTime', 'DESC']]
    });

    // Filter only recorded ones
    list = list.filter((c) => c.status === 'COMPLETED' || (c.recordingUrl && c.recordingUrl.trim() !== ''));

    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (c) =>
          (c.title && c.title.toLowerCase().includes(q)) ||
          (c.recordingTitle && c.recordingTitle.toLowerCase().includes(q)) ||
          (c.description && c.description.toLowerCase().includes(q)) ||
          (c.subject?.nameBn && c.subject.nameBn.toLowerCase().includes(q)) ||
          (c.teacher?.user?.name && c.teacher.user.name.toLowerCase().includes(q))
      );
    }

    const formatted = list.map(c => formatClassResponse(c, user));

    res.json({
      success: true,
      data: formatted
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/live-classes/upcoming-scheduled
 * Returns upcoming scheduled live classes with countdown data
 */
router.get('/upcoming-scheduled', async (req, res, next) => {
  try {
    let classes = [];
    try {
      classes = await LiveClass.findAll({
        where: {},
        order: [['scheduledStartTime', 'ASC']]
      });
    } catch (e) { classes = []; }

    const now = Date.now();
    const formatted = (classes || []).map(c => {
      const cObj = c.toJSON ? c.toJSON() : { ...c };
      const start = new Date(cObj.scheduledStartTime || cObj.scheduledAt || Date.now()).getTime();
      const msLeft = Math.max(0, start - now);
      return {
        id: cObj.id,
        title: cObj.title,
        subject: cObj.subject?.name || cObj.subjectName || 'পদার্থবিজ্ঞান',
        scheduledAt: cObj.scheduledStartTime || cObj.scheduledAt || new Date().toISOString(),
        meetingLink: msLeft <= 0 ? (cObj.meetingLink || cObj.recordingUrl || 'https://meet.google.com') : null,
        msLeft,
        isLive: msLeft <= 0,
        className: cObj.class?.name || cObj.className || 'SSC ২০২৬',
      };
    });

    if (formatted.length === 0) {
      return res.json({
        success: true,
        data: [
          { id: 'demo-1', title: 'পদার্থবিজ্ঞান — নিউটনের গতিসূত্র (লাইভ প্রশ্নোত্তর)', subject: 'পদার্থবিজ্ঞান', scheduledAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(), meetingLink: 'https://meet.google.com/abc-defg-hij', msLeft: 15 * 60 * 1000, isLive: false, className: 'SSC ২০২৬' },
          { id: 'demo-2', title: 'উচ্চতর গণিত — সীমা ও ধারাবাহিকতা', subject: 'উচ্চতর গণিত', scheduledAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), meetingLink: 'https://meet.google.com/xyz-uvw-rst', msLeft: 2 * 60 * 60 * 1000, isLive: false, className: 'HSC ২০২৬' },
        ],
      });
    }

    res.json({ success: true, data: formatted });
  } catch (err) { next(err); }
});

/**
 * GET /api/live-classes/:id
 * Retrieve a specific live class by ID with Access Lock Enforcement (403 for unauthorized)
 */
router.get('/:id', async (req, res, next) => {
  try {
    const liveClass = await LiveClass.findByPk(req.params.id, {
      include: [
        { model: Class, as: 'class' },
        { model: Section, as: 'section' },
        { model: Subject, as: 'subject' },
        { model: Teacher, as: 'teacher', include: [{ model: User, as: 'user' }] }
      ]
    });

    if (!liveClass) {
      return res.status(404).json({
        success: false,
        error: { code: 'LIVE_CLASS_NOT_FOUND', message: 'লাইভ ক্লাস খুঁজে পাওয়া যায়নি / Live class not found' }
      });
    }

    const user = getAuthUser(req);
    const access = evaluateClassAccess(user, liveClass);

    // If locked content, return 403 Forbidden
    if (access.isLocked) {
      return res.status(403).json({
        success: false,
        isLocked: true,
        error: {
          code: 'ACCESS_LOCKED',
          message: 'এই ক্লাসটি আনলক করতে অনলাইন ভর্তি সম্পন্ন করুন (Premium Class - Enrollment Required)',
          reason: access.reason
        },
        data: {
          id: liveClass.id,
          title: liveClass.title,
          isDemo: false,
          isLocked: true,
          classGrade: liveClass.class?.name || 'Class 9',
          subjectName: liveClass.subject?.nameBn || 'সাধারণ বিষয়'
        }
      });
    }

    res.json({
      success: true,
      data: formatClassResponse(liveClass, user)
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/live-classes
 * Schedule a new Live Class (Teacher/Admin only)
 */

/**
 * Smart resolver for Class ID from string or number
 */
async function resolveClassId(selectedClass) {
  if (!selectedClass) return 13; // default Class 10
  if (typeof selectedClass === 'number' || (!isNaN(Number(selectedClass)) && Number(selectedClass) > 0)) {
    return Number(selectedClass);
  }
  const str = String(selectedClass).toLowerCase();
  try {
    const classes = await Class.findAll();
    for (const c of classes) {
      if (str.includes(String(c.id)) || (c.nameBn && str.includes(c.nameBn.toLowerCase())) || (c.nameEn && str.includes(c.nameEn.toLowerCase())) || (c.name && str.includes(c.name.toLowerCase()))) {
        return c.id;
      }
    }
  } catch (e) {}
  if (str.includes('6') || str.includes('ষষ্ঠ')) return 9;
  if (str.includes('7') || str.includes('সপ্তম')) return 10;
  if (str.includes('8') || str.includes('অষ্টম')) return 11;
  if (str.includes('9') || str.includes('নবম')) return 12;
  if (str.includes('10') || str.includes('দশম') || str.includes('ssc') || str.includes('এসএসসি')) return 13;
  if (str.includes('11') || str.includes('একাদশ') || str.includes('12') || str.includes('দ্বাদশ') || str.includes('hsc') || str.includes('এইচএসসি')) return 14;
  return 13;
}

/**
 * Smart resolver for Subject ID from string or number
 */
async function resolveSubjectId(selectedSubject, classId) {
  if (!selectedSubject) return 1;
  if (typeof selectedSubject === 'number' || (!isNaN(Number(selectedSubject)) && Number(selectedSubject) > 0)) {
    return Number(selectedSubject);
  }
  const str = String(selectedSubject).toLowerCase();
  try {
    const subjects = await Subject.findAll({ where: { classId } });
    for (const s of subjects) {
      if ((s.nameBn && str.includes(s.nameBn.toLowerCase())) || (s.nameEn && str.includes(s.nameEn.toLowerCase())) || (s.name && str.includes(s.name.toLowerCase()))) {
        return s.id;
      }
    }
    const allSubjects = await Subject.findAll();
    for (const s of allSubjects) {
      if ((s.nameBn && str.includes(s.nameBn.toLowerCase())) || (s.nameEn && str.includes(s.nameEn.toLowerCase())) || (s.name && str.includes(s.name.toLowerCase()))) {
        return s.id;
      }
    }
  } catch (e) {}
  return 1;
}

/**
 * POST /api/live-classes/schedule & POST /api/live-class/schedule
 * Schedule a new Live Class from scheduler component
 */
router.post('/schedule', async (req, res, next) => {
  try {
    const user = getAuthUser(req) || req.user;
    const body = req.body || {};

    const title = (body.classTitle || body.title || '').trim();
    const rawClass = body.selectedClass || body.classId || body.className;
    const rawSubject = body.selectedSubject || body.subjectId || body.subjectName;
    const scheduledStartTime = body.dateTime || body.scheduledStartTime || body.scheduledAt;
    const durationMinutes = Number(body.duration || body.durationMinutes || 60);
    const platform = body.platform ? String(body.platform).toUpperCase().replace('-', '_') : 'GOOGLE_MEET';
    const meetingLink = (body.meetingLink || body.link || '').trim();
    const meetingPassword = (body.passcode || body.meetingPassword || '').trim();
    const description = (body.description || '').trim();
    const isDemo = Boolean(body.isDemo);

    if (!title || !meetingLink) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'ক্লাসের শিরোনাম এবং মিটিং লিংক আবশ্যক'
        }
      });
    }

    const classId = await resolveClassId(rawClass);
    const subjectId = await resolveSubjectId(rawSubject, classId);

    let teacherId = 1;
    if (user && user.role === 'TEACHER') {
      const teacher = await Teacher.findOne({ where: { userId: user.id } });
      if (teacher) teacherId = teacher.id;
    } else if (body.teacherId) {
      teacherId = Number(body.teacherId);
    } else {
      const firstTeacher = await Teacher.findOne();
      if (firstTeacher) teacherId = firstTeacher.id;
    }

    const newClass = await LiveClass.create({
      title,
      description,
      classId,
      sectionId: body.sectionId ? Number(body.sectionId) : null,
      subjectId,
      chapter: body.chapter || body.topic || '',
      teacherId,
      scheduledStartTime: scheduledStartTime ? new Date(scheduledStartTime).toISOString() : new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      durationMinutes,
      platform,
      meetingLink,
      meetingPassword,
      isDemo,
      status: body.status || 'UPCOMING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    if (user && AuditService) {
      await AuditService.log({
        req,
        action: 'SCHEDULE_LIVE_CLASS',
        entityType: 'LiveClass',
        entityId: newClass.id,
        newValue: newClass,
        details: `Scheduled live class: ${newClass.title}`
      }).catch(() => {});
    }

    const populated = await LiveClass.findByPk(newClass.id, {
      include: [
        { model: Class, as: 'class' },
        { model: Section, as: 'section' },
        { model: Subject, as: 'subject' },
        { model: Teacher, as: 'teacher', include: [{ model: User, as: 'user' }] }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'লাইভ ক্লাস সফলভাবে শিডিউল করা হয়েছে!',
      data: formatClassResponse(populated || newClass, user)
    });
  } catch (err) {
    next(err);
  }
});

router.post('/', authenticate, requireRole(['TEACHER', 'ADMIN']), async (req, res, next) => {
  try {
    const {
      title,
      description,
      classId,
      sectionId,
      subjectId,
      chapter,
      topic,
      scheduledStartTime,
      durationMinutes,
      platform,
      meetingLink,
      meetingPassword,
      notesUrl,
      notesDescription,
      isDemo
    } = req.body;

    if (!title || !classId || !subjectId || !scheduledStartTime || !meetingLink) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'শিরোনাম, শ্রেণি, বিষয়, সময় এবং মিটিং লিঙ্ক আবশ্যক / Title, Class, Subject, Schedule Time, and Meeting Link are required'
        }
      });
    }

    let teacherId = null;
    if (req.user.role === 'TEACHER') {
      const teacher = await Teacher.findOne({ where: { userId: req.user.id } });
      if (teacher) teacherId = teacher.id;
    } else if (req.body.teacherId) {
      teacherId = Number(req.body.teacherId);
    } else {
      const firstTeacher = await Teacher.findOne();
      if (firstTeacher) teacherId = firstTeacher.id;
    }

    const newClass = await LiveClass.create({
      title: title.trim(),
      description: description ? description.trim() : '',
      classId: Number(classId),
      sectionId: sectionId ? Number(sectionId) : null,
      subjectId: Number(subjectId),
      chapter: chapter || topic || '',
      teacherId: teacherId || 1,
      scheduledStartTime,
      durationMinutes: durationMinutes ? Number(durationMinutes) : 45,
      platform: platform || 'GOOGLE_MEET',
      meetingLink: meetingLink.trim(),
      meetingPassword: meetingPassword ? meetingPassword.trim() : '',
      isDemo: Boolean(isDemo),
      status: req.body.status || 'UPCOMING',
      notesUrl: (req.body.noteFileUrl || notesUrl) ? (req.body.noteFileUrl || notesUrl).trim() : '',
      noteFileUrl: (req.body.noteFileUrl || notesUrl) ? (req.body.noteFileUrl || notesUrl).trim() : '',
      noteFileName: req.body.noteFileName ? req.body.noteFileName.trim() : '',
      noteFileSize: req.body.noteFileSize ? req.body.noteFileSize.trim() : '',
      notesDescription: notesDescription ? notesDescription.trim() : '',
      recordingUrl: req.body.recordingUrl ? req.body.recordingUrl.trim() : '',
      recordingTitle: req.body.recordingTitle ? req.body.recordingTitle.trim() : '',
      recordingDuration: req.body.recordingDuration ? req.body.recordingDuration.trim() : '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    await AuditService.log({
      req,
      action: 'CREATE_LIVE_CLASS',
      entityType: 'LiveClass',
      entityId: newClass.id,
      newValue: newClass,
      details: `Scheduled live class: ${newClass.title} (isDemo: ${Boolean(isDemo)})`
    });

    const populated = await LiveClass.findByPk(newClass.id, {
      include: [
        { model: Class, as: 'class' },
        { model: Section, as: 'section' },
        { model: Subject, as: 'subject' },
        { model: Teacher, as: 'teacher', include: [{ model: User, as: 'user' }] }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'লাইভ ক্লাস সফলভাবে শিডিউল করা হয়েছে / Live class successfully scheduled',
      data: formatClassResponse(populated, req.user)
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/live-classes/recorded
 * Add a recorded class archive with isDemo toggle
 */
router.post('/recorded', authenticate, requireRole(['TEACHER', 'ADMIN']), async (req, res, next) => {
  try {
    const {
      title,
      subjectId,
      classId,
      sectionId,
      chapter,
      topic,
      date,
      scheduledStartTime,
      videoUrl,
      recordingUrl,
      meetingLink,
      durationMinutes,
      recordingDuration,
      description,
      notesUrl,
      notesDescription,
      teacherId,
      isDemo
    } = req.body;

    const finalVideoUrl = (videoUrl || recordingUrl || meetingLink || '').trim();

    if (!title || !subjectId || !classId || !finalVideoUrl) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'শিরোনাম, বিষয়, শ্রেণি এবং ভিডিও লিঙ্ক (YouTube/Vimeo/Drive) আবশ্যক।'
        }
      });
    }

    let assignedTeacherId = null;
    if (req.user.role === 'TEACHER') {
      const teacher = await Teacher.findOne({ where: { userId: req.user.id } });
      if (teacher) assignedTeacherId = teacher.id;
    } else if (teacherId) {
      assignedTeacherId = Number(teacherId);
    } else {
      const firstTeacher = await Teacher.findOne();
      if (firstTeacher) assignedTeacherId = firstTeacher.id;
    }

    const classDate = date || scheduledStartTime || new Date().toISOString();
    const finalTopic = topic || chapter || '';
    const displayTitle = title.trim();

    const newRecordedClass = await LiveClass.create({
      title: displayTitle,
      description: description ? description.trim() : (finalTopic ? `অধ্যায়/বিষয়বস্তু: ${finalTopic}` : ''),
      classId: Number(classId),
      sectionId: sectionId ? Number(sectionId) : null,
      subjectId: Number(subjectId),
      chapter: finalTopic,
      teacherId: assignedTeacherId || 1,
      scheduledStartTime: classDate,
      durationMinutes: durationMinutes ? Number(durationMinutes) : 45,
      platform: finalVideoUrl.includes('vimeo') ? 'VIMEO' : finalVideoUrl.includes('drive.google') ? 'GOOGLE_DRIVE' : 'YOUTUBE_LIVE',
      meetingLink: finalVideoUrl,
      status: 'COMPLETED',
      isDemo: Boolean(isDemo),
      notesUrl: notesUrl ? notesUrl.trim() : '',
      notesDescription: notesDescription ? notesDescription.trim() : '',
      recordingUrl: finalVideoUrl,
      recordingTitle: title.trim(),
      recordingDuration: recordingDuration || `${durationMinutes || 45} মিনিট`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    await AuditService.log({
      req,
      action: 'CREATE_RECORDED_CLASS',
      entityType: 'LiveClass',
      entityId: newRecordedClass.id,
      newValue: newRecordedClass,
      details: `Added recorded class archive: ${newRecordedClass.title} (isDemo: ${Boolean(isDemo)})`
    });

    const populated = await LiveClass.findByPk(newRecordedClass.id, {
      include: [
        { model: Class, as: 'class' },
        { model: Section, as: 'section' },
        { model: Subject, as: 'subject' },
        { model: Teacher, as: 'teacher', include: [{ model: User, as: 'user' }] }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'রেকর্ডেড ক্লাস সফলভাবে আর্কাইভে যুক্ত করা হয়েছে',
      data: formatClassResponse(populated, req.user)
    });
  } catch (err) {
    next(err);
  }
});

/**
 * PUT /api/live-classes/:id
 * Update full live class details with isDemo toggle (Teacher/Admin only)
 */
router.put('/:id', authenticate, requireRole(['TEACHER', 'ADMIN']), async (req, res, next) => {
  try {
    const existing = await LiveClass.findByPk(req.params.id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'লাইভ ক্লাস খুঁজে পাওয়া যায়নি / Live class not found' }
      });
    }

    const updatePayload = {
      title: req.body.title !== undefined ? req.body.title : existing.title,
      description: req.body.description !== undefined ? req.body.description : existing.description,
      classId: req.body.classId !== undefined ? Number(req.body.classId) : existing.classId,
      sectionId: req.body.sectionId !== undefined ? (req.body.sectionId ? Number(req.body.sectionId) : null) : existing.sectionId,
      subjectId: req.body.subjectId !== undefined ? Number(req.body.subjectId) : existing.subjectId,
      chapter: req.body.chapter !== undefined ? req.body.chapter : (req.body.topic || existing.chapter),
      scheduledStartTime: req.body.scheduledStartTime || existing.scheduledStartTime,
      durationMinutes: req.body.durationMinutes !== undefined ? Number(req.body.durationMinutes) : existing.durationMinutes,
      platform: req.body.platform || existing.platform,
      meetingLink: req.body.meetingLink !== undefined ? req.body.meetingLink : existing.meetingLink,
      meetingPassword: req.body.meetingPassword !== undefined ? req.body.meetingPassword : existing.meetingPassword,
      isDemo: req.body.isDemo !== undefined ? Boolean(req.body.isDemo) : existing.isDemo,
      status: req.body.status || existing.status,
      notesUrl: (req.body.noteFileUrl !== undefined || req.body.notesUrl !== undefined) ? (req.body.noteFileUrl || req.body.notesUrl) : existing.notesUrl,
      noteFileUrl: (req.body.noteFileUrl !== undefined || req.body.notesUrl !== undefined) ? (req.body.noteFileUrl || req.body.notesUrl) : existing.noteFileUrl,
      noteFileName: req.body.noteFileName !== undefined ? req.body.noteFileName : (existing.noteFileName || ''),
      noteFileSize: req.body.noteFileSize !== undefined ? req.body.noteFileSize : (existing.noteFileSize || ''),
      notesDescription: req.body.notesDescription !== undefined ? req.body.notesDescription : existing.notesDescription,
      recordingUrl: req.body.recordingUrl !== undefined ? req.body.recordingUrl : existing.recordingUrl,
      recordingTitle: req.body.recordingTitle !== undefined ? req.body.recordingTitle : existing.recordingTitle,
      recordingDuration: req.body.recordingDuration !== undefined ? req.body.recordingDuration : existing.recordingDuration,
      updatedAt: new Date().toISOString()
    };

    await LiveClass.update(updatePayload, { where: { id: existing.id } });

    await AuditService.log({
      req,
      action: 'UPDATE_LIVE_CLASS',
      entityType: 'LiveClass',
      entityId: existing.id,
      oldValue: existing,
      newValue: updatePayload,
      details: `Updated live class: ${updatePayload.title} (isDemo: ${updatePayload.isDemo})`
    });

    const updated = await LiveClass.findByPk(existing.id, {
      include: [
        { model: Class, as: 'class' },
        { model: Section, as: 'section' },
        { model: Subject, as: 'subject' },
        { model: Teacher, as: 'teacher', include: [{ model: User, as: 'user' }] }
      ]
    });

    res.json({
      success: true,
      message: 'লাইভ ক্লাসের তথ্য আপডেট করা হয়েছে',
      data: formatClassResponse(updated, req.user)
    });
  } catch (err) {
    next(err);
  }
});

/**
 * PATCH /api/live-classes/:id/toggle-demo
 * Toggle isDemo status on a class (Teacher/Admin only)
 */
router.patch('/:id/toggle-demo', authenticate, requireRole(['TEACHER', 'ADMIN']), async (req, res, next) => {
  try {
    const existing = await LiveClass.findByPk(req.params.id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'ক্লাস খুঁজে পাওয়া যায়নি' }
      });
    }

    const newIsDemo = !existing.isDemo;
    await LiveClass.update({ isDemo: newIsDemo, updatedAt: new Date().toISOString() }, { where: { id: existing.id } });

    res.json({
      success: true,
      message: `ক্লাসটি এখন ${newIsDemo ? 'ফ্রি ডেমো ক্লাস (Free Demo)' : 'লকড প্রিমিয়াম ক্লাস (Premium Locked)'} হিসেবে সেট করা হয়েছে`,
      data: { id: existing.id, isDemo: newIsDemo }
    });
  } catch (err) {
    next(err);
  }
});

/**
 * PATCH /api/live-classes/:id/status
 * Update status (UPCOMING, LIVE, COMPLETED, CANCELLED)
 */
router.patch('/:id/status', authenticate, requireRole(['TEACHER', 'ADMIN']), async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!status || !['UPCOMING', 'LIVE', 'COMPLETED', 'CANCELLED'].includes(status.toUpperCase())) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_STATUS', message: 'অবৈধ স্ট্যাটাস মান / Invalid status value' }
      });
    }

    const existing = await LiveClass.findByPk(req.params.id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'লাইভ ক্লাস খুঁজে পাওয়া যায়নি' }
      });
    }

    await LiveClass.update({ status: status.toUpperCase(), updatedAt: new Date().toISOString() }, { where: { id: existing.id } });

    res.json({
      success: true,
      message: `ক্লাসের স্ট্যাটাস '${status.toUpperCase()}' করা হয়েছে`,
      data: { id: existing.id, status: status.toUpperCase() }
    });
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /api/live-classes/:id
 * Delete a scheduled or recorded live class
 */
router.delete('/:id', authenticate, requireRole(['TEACHER', 'ADMIN']), async (req, res, next) => {
  try {
    const existing = await LiveClass.findByPk(req.params.id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'লাইভ ক্লাস খুঁজে পাওয়া যায়নি' }
      });
    }

    await LiveClass.destroy({ where: { id: existing.id } });

    await AuditService.log({
      req,
      action: 'DELETE_LIVE_CLASS',
      entityType: 'LiveClass',
      entityId: existing.id,
      oldValue: existing,
      details: `Deleted live class: ${existing.title}`
    });

    res.json({
      success: true,
      message: 'লাইভ ক্লাস সফলভাবে মুছে ফেলা হয়েছে'
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/live-classes/:id/comments
 */
router.get('/:id/comments', authenticate, async (req, res, next) => {
  try {
    const liveClassId = Number(req.params.id);
    const comments = await LiveClassComment.findAll({
      where: { liveClassId },
      include: [{ model: User, as: 'user' }],
      order: [['createdAt', 'ASC']]
    });

    res.json({
      success: true,
      data: comments
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/live-classes/:id/comments
 */
router.post('/:id/comments', authenticate, async (req, res, next) => {
  try {
    const liveClassId = Number(req.params.id);
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'কমেন্ট বা প্রশ্নের বিবরণ আবশ্যক' }
      });
    }

    const senderUser = await User.findByPk(req.user.userId || req.user.id);
    const newComment = await LiveClassComment.create({
      liveClassId,
      userId: req.user.userId || req.user.id,
      senderName: senderUser?.name || req.user.name || 'ইউজার',
      senderRole: req.user.role || 'STUDENT',
      senderAvatar: null,
      studentClassInfo: req.user.role === 'ADMIN' ? 'অ্যাডমিন' : 'শিক্ষার্থী',
      content: content.trim(),
      isPinned: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    res.status(201).json({
      success: true,
      message: 'কমেন্ট সফলভাবে যোগ করা হয়েছে',
      data: newComment
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

