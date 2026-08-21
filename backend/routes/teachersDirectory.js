const express = require('express');
const {
  User,
  Teacher,
  TeacherClassAssignment,
  Class,
  Section,
  Subject
} = require('../models');
const { authenticate, requireRole } = require('../middleware/auth');
const AuditService = require('../services/auditService');

const router = express.Router();

// Guarded to all authenticated users (PARENT, STUDENT, TEACHER, ADMIN)
router.use(authenticate);

/**
 * Format Teacher Record with Privacy Controls
 */
function formatTeacherRecord(teacher, user, assignments = [], requester) {
  const isSelf = requester && requester.id === user?.id;
  const isAdmin = requester && requester.role === 'ADMIN';
  const isPhoneVisible = teacher.is_phone_visible !== false && teacher.isPhoneVisible !== false;

  // Determine if phone should be masked/hidden
  const canSeePhone = isSelf || isAdmin || isPhoneVisible;
  const phoneNumber = user?.phone || teacher.mobile_number || teacher.phone || '';
  const emailAddress = user?.email || teacher.contact_email || teacher.email || '';

  // Formatted assignments
  const formattedAssignments = assignments.map(a => ({
    id: a.id,
    classId: a.classId,
    classNameBn: a.class?.nameBn || `শ্রেণি ${a.classId}`,
    classNameEn: a.class?.nameEn || `Class ${a.classId}`,
    sectionId: a.sectionId,
    sectionNameBn: a.section?.nameBn || '',
    sectionNameEn: a.section?.nameEn || '',
    subjectId: a.subjectId,
    subjectNameBn: a.subject?.nameBn || '',
    subjectNameEn: a.subject?.nameEn || '',
    isClassTeacher: !!a.isClassTeacher
  }));

  // Clean phone number for tel and wa links
  const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');
  const internationalPhone = cleanPhone.startsWith('880')
    ? `+${cleanPhone}`
    : cleanPhone.startsWith('0')
    ? `+88${cleanPhone}`
    : `+880${cleanPhone}`;

  return {
    id: teacher.id,
    userId: user?.id,
    name: user?.name || 'শিক্ষক',
    email: emailAddress,
    contact_email: emailAddress,
    phone: canSeePhone ? phoneNumber : null,
    mobile_number: canSeePhone ? phoneNumber : null,
    internationalPhone: canSeePhone ? internationalPhone : null,
    whatsappUrl: canSeePhone && cleanPhone ? `https://wa.me/${cleanPhone.startsWith('880') ? cleanPhone : '88' + cleanPhone.replace(/^0+/, '')}?text=${encodeURIComponent('আসসালামু আলাইকুম, আমি NextGen Academy এর শিক্ষার্থী/অভিভাবক।')}` : null,
    callUrl: canSeePhone && internationalPhone ? `tel:${internationalPhone}` : null,
    smsUrl: canSeePhone && phoneNumber ? `sms:${phoneNumber}` : null,
    is_phone_visible: isPhoneVisible,
    is_phone_hidden: !canSeePhone,
    phone_privacy_message: canSeePhone ? null : 'শিক্ষকের অনুরোধে মোবাইল নম্বরটি গোপন রাখা হয়েছে',
    designation: teacher.designation || 'শিক্ষক / Faculty Member',
    specialization: teacher.specialization || 'সাধারণ শিক্ষা / General Education',
    qualifications: teacher.qualifications || 'বি.এসসি (অনার্স), এম.এসসি ও বি.এড',
    officeHours: teacher.officeHours || 'রবি - বৃহঃ সকাল ৯:৩০ - বিকাল ৩:৩০',
    roomNo: teacher.roomNo || 'শিক্ষক মিলনায়তন (কক্ষ ২০৪)',
    bio: teacher.bio || 'নেক্সটজেন একাডেমির অভিজ্ঞ ও নিবেদিতপ্রাণ শিক্ষক।',
    avatar: user?.avatar || teacher.avatar || null,
    joiningDate: teacher.joiningDate || '2022-01-01',
    isActive: user ? user.isActive !== false : true,
    assignments: formattedAssignments
  };
}

/**
 * GET /api/teachers
 * GET /api/teachers/directory
 * Public Directory for Authenticated Parents, Students, Teachers & Admins
 */
router.get('/', async (req, res, next) => {
  try {
    const { search, subjectId, department } = req.query;

    const teachers = await Teacher.findAll({
      include: [
        { model: User, as: 'user' },
        {
          model: TeacherClassAssignment,
          as: 'assignments',
          include: [
            { model: Class, as: 'class' },
            { model: Section, as: 'section' },
            { model: Subject, as: 'subject' }
          ]
        }
      ]
    });

    let formattedList = teachers.map(t =>
      formatTeacherRecord(t, t.user, t.assignments || [], req.user)
    );

    // Apply Search Filter
    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      formattedList = formattedList.filter(t =>
        t.name.toLowerCase().includes(q) ||
        t.designation.toLowerCase().includes(q) ||
        t.specialization.toLowerCase().includes(q) ||
        t.qualifications.toLowerCase().includes(q) ||
        (t.phone && t.phone.toLowerCase().includes(q)) ||
        t.email.toLowerCase().includes(q) ||
        t.roomNo.toLowerCase().includes(q) ||
        t.assignments.some(a =>
          a.subjectNameBn.toLowerCase().includes(q) ||
          a.subjectNameEn.toLowerCase().includes(q) ||
          a.classNameBn.toLowerCase().includes(q)
        )
      );
    }

    // Apply Subject / Department Filter
    if (subjectId) {
      formattedList = formattedList.filter(t =>
        t.assignments.some(a => a.subjectId === Number(subjectId))
      );
    }

    if (department && department !== 'ALL') {
      const depQuery = department.toLowerCase();
      formattedList = formattedList.filter(t =>
        t.specialization.toLowerCase().includes(depQuery) ||
        t.designation.toLowerCase().includes(depQuery)
      );
    }

    res.json({
      success: true,
      count: formattedList.length,
      data: formattedList
    });
  } catch (err) {
    next(err);
  }
});

router.get('/directory', async (req, res, next) => {
  req.url = '/';
  return router.handle(req, res, next);
});

/**
 * GET /api/teachers/me/profile
 * Teacher's personal profile view with privacy settings
 */
router.get('/me/profile', requireRole(['TEACHER']), async (req, res, next) => {
  try {
    const teacher = await Teacher.findOne({
      where: { userId: req.user.id },
      include: [
        { model: User, as: 'user' },
        {
          model: TeacherClassAssignment,
          as: 'assignments',
          include: [
            { model: Class, as: 'class' },
            { model: Section, as: 'section' },
            { model: Subject, as: 'subject' }
          ]
        }
      ]
    });

    if (!teacher) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Teacher profile not found' }
      });
    }

    const formatted = formatTeacherRecord(teacher, teacher.user, teacher.assignments || [], req.user);

    res.json({
      success: true,
      data: formatted
    });
  } catch (err) {
    next(err);
  }
});

/**
 * PUT /api/teachers/me/profile
 * Update teacher personal contact info & privacy toggle
 */
router.put('/me/profile', requireRole(['TEACHER']), async (req, res, next) => {
  try {
    const {
      phone,
      mobile_number,
      contact_email,
      email,
      is_phone_visible,
      qualifications,
      specialization,
      officeHours,
      roomNo,
      bio,
      avatar
    } = req.body;

    const teacher = await Teacher.findOne({ where: { userId: req.user.id } });
    if (!teacher) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Teacher record not found' }
      });
    }

    const newPhone = phone !== undefined ? phone : mobile_number;
    const newEmail = email !== undefined ? email : contact_email;

    // Update User model
    const userUpdate = {};
    if (newPhone !== undefined) userUpdate.phone = newPhone;
    if (newEmail !== undefined) userUpdate.email = newEmail;
    if (avatar !== undefined) userUpdate.avatar = avatar;

    if (Object.keys(userUpdate).length > 0) {
      await User.update(userUpdate, { where: { id: req.user.id } });
    }

    // Update Teacher model
    const teacherUpdate = {};
    if (is_phone_visible !== undefined) teacherUpdate.is_phone_visible = !!is_phone_visible;
    if (newPhone !== undefined) {
      teacherUpdate.mobile_number = newPhone;
      teacherUpdate.phone = newPhone;
    }
    if (newEmail !== undefined) {
      teacherUpdate.contact_email = newEmail;
      teacherUpdate.email = newEmail;
    }
    if (qualifications !== undefined) teacherUpdate.qualifications = qualifications;
    if (specialization !== undefined) teacherUpdate.specialization = specialization;
    if (officeHours !== undefined) teacherUpdate.officeHours = officeHours;
    if (roomNo !== undefined) teacherUpdate.roomNo = roomNo;
    if (bio !== undefined) teacherUpdate.bio = bio;
    if (avatar !== undefined) teacherUpdate.avatar = avatar;

    await Teacher.update(teacherUpdate, { where: { id: teacher.id } });

    // Log Audit Event
    await AuditService.log({
      req,
      userId: req.user.id,
      action: 'TEACHER_PROFILE_UPDATE',
      entityType: 'teacher',
      entityId: teacher.id,
      details: `শিক্ষক তার প্রোফাইল ও যোগাযোগ সেটিংস আপডেট করেছেন (ফোন দৃশ্যমান: ${teacherUpdate.is_phone_visible ? 'হ্যাঁ' : 'না'})`
    });

    // Return refreshed record
    const updatedTeacher = await Teacher.findByPk(teacher.id, {
      include: [
        { model: User, as: 'user' },
        {
          model: TeacherClassAssignment,
          as: 'assignments',
          include: [
            { model: Class, as: 'class' },
            { model: Section, as: 'section' },
            { model: Subject, as: 'subject' }
          ]
        }
      ]
    });

    res.json({
      success: true,
      message: 'প্রোফাইল ও যোগাযোগ তথ্য সফলভাবে আপডেট হয়েছে',
      data: formatTeacherRecord(updatedTeacher, updatedTeacher.user, updatedTeacher.assignments || [], req.user)
    });
  } catch (err) {
    next(err);
  }
});

/**
 * PATCH /api/teachers/me/privacy
 * Fast toggle for contact privacy
 */
router.patch('/me/privacy', requireRole(['TEACHER']), async (req, res, next) => {
  try {
    const { is_phone_visible } = req.body;
    if (is_phone_visible === undefined) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'is_phone_visible boolean is required' }
      });
    }

    const teacher = await Teacher.findOne({ where: { userId: req.user.id } });
    if (!teacher) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Teacher record not found' }
      });
    }

    await Teacher.update(
      { is_phone_visible: !!is_phone_visible },
      { where: { id: teacher.id } }
    );

    await AuditService.log({
      req,
      userId: req.user.id,
      action: 'TEACHER_PRIVACY_TOGGLE',
      entityType: 'teacher',
      entityId: teacher.id,
      details: `শিক্ষক ফোন নম্বর দৃশ্যমানতা পরিবর্তন করেছেন: ${is_phone_visible ? 'দৃশ্যমান (Visible)' : 'গোপন (Hidden)'}`
    });

    res.json({
      success: true,
      message: `ফোন নম্বর সফলভাবে ${is_phone_visible ? 'প্রকাশ করা হয়েছে' : 'গোপন রাখা হয়েছে'}`,
      is_phone_visible: !!is_phone_visible
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/teachers
 * Admin-only: Create new Teacher profile & User account
 */
router.post('/', requireRole('ADMIN'), async (req, res, next) => {
  try {
    const {
      name,
      designation,
      specialization,
      phone,
      email,
      password = 'teacher123',
      qualifications,
      officeHours,
      roomNo,
      bio,
      photo = null,
      joiningDate = new Date().toISOString().split('T')[0]
    } = req.body;

    if (!name || !phone) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'শিক্ষকের নাম এবং ফোন নম্বর পূরণ করা বাধ্যতামূলক'
        }
      });
    }

    const bcrypt = require('bcryptjs');
    const teacherCount = await Teacher.count();
    const teacherEmail = email && email.trim() ? email.trim() : `teacher${teacherCount + 101}@nextgen.edu.bd`;

    // 1. Create User account
    const hashedPassword = await bcrypt.hash(password || 'teacher123', 10);
    const teacherUser = await User.create({
      name,
      email: teacherEmail,
      passwordHash: hashedPassword,
      role: 'TEACHER',
      phone,
      avatar: photo || null,
      isActive: true
    });

    // 2. Create Teacher profile
    const teacher = await Teacher.create({
      userId: teacherUser.id,
      designation: designation || 'সহকারী শিক্ষক',
      specialization: specialization || 'সাধারণ শিক্ষা',
      qualifications: qualifications || 'বি.এসসি (অনার্স), এম.এসসি',
      officeHours: officeHours || 'সকাল ৯:৩০ - বিকাল ৩:৩০',
      roomNo: roomNo || 'শিক্ষক মিলনায়তন (কক্ষ ২০৪)',
      bio: bio || 'নেক্সটজেন একাডেমির অভিজ্ঞ ও নিবেদিতপ্রাণ শিক্ষক।',
      joiningDate,
      avatar: photo || null,
      is_phone_visible: true
    });

    await AuditService.log({
      req,
      userId: req.user.id,
      action: 'CREATE_TEACHER',
      entityType: 'teacher',
      entityId: teacher.id,
      newValue: { ...teacher, name, email: teacherEmail, designation },
      details: `অ্যাডমিন নতুন শিক্ষক যুক্ত করেছেন: "${name}" (${designation}, ফোন: ${phone})`
    });

    const populated = await Teacher.findByPk(teacher.id, {
      include: [
        { model: User, as: 'user' },
        { model: TeacherClassAssignment, as: 'assignments', include: ['class', 'section', 'subject'] }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'শিক্ষক সফলভাবে যুক্ত করা হয়েছে! / Teacher added successfully',
      data: formatTeacherRecord(populated, populated.user, populated.assignments || [], req.user)
    });
  } catch (err) {
    next(err);
  }
});

/**
 * PUT /api/teachers/:id
 * Admin-only: Update Teacher profile
 */
router.put('/:id', requireRole('ADMIN'), async (req, res, next) => {
  try {
    const teacherId = Number(req.params.id);
    const teacher = await Teacher.findByPk(teacherId, {
      include: [{ model: User, as: 'user' }]
    });

    if (!teacher) {
      return res.status(404).json({
        success: false,
        error: { code: 'TEACHER_NOT_FOUND', message: 'শিক্ষক রেকর্ড পাওয়া যায়নি' }
      });
    }

    const {
      name,
      designation,
      specialization,
      phone,
      email,
      qualifications,
      officeHours,
      roomNo,
      bio,
      photo,
      joiningDate,
      isActive,
      is_phone_visible
    } = req.body;

    // 1. Update User account
    if (teacher.userId) {
      await User.update(
        {
          ...(name && { name }),
          ...(phone && { phone }),
          ...(email && { email }),
          ...(photo !== undefined && { avatar: photo }),
          ...(isActive !== undefined && { isActive: Boolean(isActive) })
        },
        { where: { id: teacher.userId } }
      );
    }

    // 2. Update Teacher model
    const teacherUpdate = {};
    if (designation !== undefined) teacherUpdate.designation = designation;
    if (specialization !== undefined) teacherUpdate.specialization = specialization;
    if (qualifications !== undefined) teacherUpdate.qualifications = qualifications;
    if (officeHours !== undefined) teacherUpdate.officeHours = officeHours;
    if (roomNo !== undefined) teacherUpdate.roomNo = roomNo;
    if (bio !== undefined) teacherUpdate.bio = bio;
    if (joiningDate !== undefined) teacherUpdate.joiningDate = joiningDate;
    if (photo !== undefined) teacherUpdate.avatar = photo;
    if (is_phone_visible !== undefined) teacherUpdate.is_phone_visible = Boolean(is_phone_visible);

    await Teacher.update(teacherUpdate, { where: { id: teacherId } });

    await AuditService.log({
      req,
      userId: req.user.id,
      action: 'UPDATE_TEACHER',
      entityType: 'teacher',
      entityId: teacher.id,
      details: `অ্যাডমিন শিক্ষক প্রোফাইল আপডেট করেছেন: ID ${teacher.id}`
    });

    const updated = await Teacher.findByPk(teacherId, {
      include: [
        { model: User, as: 'user' },
        { model: TeacherClassAssignment, as: 'assignments', include: ['class', 'section', 'subject'] }
      ]
    });

    res.json({
      success: true,
      message: 'শিক্ষক তথ্য সফলভাবে আপডেট করা হয়েছে! / Teacher updated successfully',
      data: formatTeacherRecord(updated, updated.user, updated.assignments || [], req.user)
    });
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /api/teachers/:id
 * Admin-only: Delete Teacher
 */
router.delete('/:id', requireRole('ADMIN'), async (req, res, next) => {
  try {
    const teacherId = Number(req.params.id);
    const teacher = await Teacher.findByPk(teacherId);

    if (!teacher) {
      return res.status(404).json({
        success: false,
        error: { code: 'TEACHER_NOT_FOUND', message: 'শিক্ষক পাওয়া যায়নি' }
      });
    }

    await TeacherClassAssignment.destroy({ where: { teacherId } });
    if (teacher.userId) {
      await User.destroy({ where: { id: teacher.userId } });
    }
    await Teacher.destroy({ where: { id: teacherId } });

    await AuditService.log({
      req,
      userId: req.user.id,
      action: 'DELETE_TEACHER',
      entityType: 'teacher',
      entityId: teacherId,
      details: `অ্যাডমিন শিক্ষক প্রোফাইল মুছে ফেলেছেন: ID ${teacherId}`
    });

    res.json({
      success: true,
      message: 'শিক্ষক প্রোফাইল সফলভাবে মুছে ফেলা হয়েছে / Teacher deleted successfully'
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

