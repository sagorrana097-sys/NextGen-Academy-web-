const express = require('express');
const bcrypt = require('bcryptjs');
const {
  User,
  Student,
  Teacher,
  Class,
  Section,
  Subject,
  Attendance,
  Invoice,
  Payment,
  Notice,
  AuditLog,
  GuardianStudentMapping,
  TeacherClassAssignment
} = require('../models');
const { authenticate, requireRole } = require('../middleware/auth');
const AuditService = require('../services/auditService');

const router = express.Router();

// Guard all admin routes to ADMIN role only
router.use(authenticate, requireRole('ADMIN'));

/**
 * GET /api/admin/profile
 * Returns details of the currently authenticated admin user
 */
router.get('/profile', async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: { code: 'USER_NOT_FOUND', message: 'অ্যাডমিন ইউজার পাওয়া যায়নি' }
      });
    }

    const { passwordHash, ...safeUser } = user;
    res.json({
      success: true,
      data: safeUser
    });
  } catch (err) {
    next(err);
  }
});

/**
 * PUT /api/admin/profile
 * Update current admin's name, email, phone, and optionally change password
 */
router.put('/profile', async (req, res, next) => {
  try {
    const { name, email, phone, photo, avatar, profilePhoto, currentPassword, newPassword } = req.body;
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: { code: 'USER_NOT_FOUND', message: 'অ্যাডমিন প্রোফাইল পাওয়া যায়নি' }
      });
    }

    const updatePayload = {};

    if (name && name.trim()) {
      updatePayload.name = name.trim();
    }

    if (phone !== undefined) {
      updatePayload.phone = phone ? phone.trim() : '';
    }

    if (photo !== undefined || avatar !== undefined || profilePhoto !== undefined) {
      const finalPhoto = photo || avatar || profilePhoto || '';
      updatePayload.photo = finalPhoto;
      updatePayload.avatar = finalPhoto;
      updatePayload.profilePhoto = finalPhoto;
    }

    if (email && email.trim()) {
      const normalizedEmail = email.trim().toLowerCase();
      if (normalizedEmail !== user.email?.toLowerCase()) {
        const existingEmailUser = await User.findOne({ where: { email: normalizedEmail } });
        if (existingEmailUser && existingEmailUser.id !== user.id) {
          return res.status(400).json({
            success: false,
            error: { code: 'EMAIL_IN_USE', message: 'এই ইমেইলটি অন্য একটি অ্যাকাউন্টে ইতিমধ্যে ব্যবহৃত হচ্ছে' }
          });
        }
        updatePayload.email = normalizedEmail;
      }
    }

    // Password change verification
    if (newPassword && newPassword.trim()) {
      if (!currentPassword) {
        return res.status(400).json({
          success: false,
          error: { code: 'CURRENT_PASSWORD_REQUIRED', message: 'পাসওয়ার্ড পরিবর্তনের জন্য বর্তমান পাসওয়ার্ড দেওয়া আবশ্যক' }
        });
      }

      if (newPassword.trim().length < 6) {
        return res.status(400).json({
          success: false,
          error: { code: 'WEAK_PASSWORD', message: 'নতুন পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে' }
        });
      }

      const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          error: { code: 'INCORRECT_PASSWORD', message: 'বর্তমান পাসওয়ার্ডটি সঠিক নয়' }
        });
      }

      const salt = await bcrypt.genSalt(10);
      updatePayload.passwordHash = await bcrypt.hash(newPassword.trim(), salt);
    }

    updatePayload.updatedAt = new Date().toISOString();
    await User.update(updatePayload, { where: { id: user.id } });

    await AuditService.log({
      req,
      action: 'UPDATE_ADMIN_PROFILE',
      entityType: 'User',
      entityId: user.id,
      oldValue: { name: user.name, email: user.email, phone: user.phone },
      newValue: { name: updatePayload.name || user.name, email: updatePayload.email || user.email, phone: updatePayload.phone || user.phone },
      details: `Admin profile updated for ${user.name}`
    });

    const updatedUser = await User.findByPk(user.id);
    const { passwordHash, ...safeUser } = updatedUser;

    res.json({
      success: true,
      message: 'অ্যাডমিন প্রোফাইল সফলভাবে আপডেট করা হয়েছে',
      data: safeUser
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/admin/users
 * List all admin users
 */
router.get('/users', async (req, res, next) => {
  try {
    const adminUsers = await User.findAll({
      where: { role: 'ADMIN' },
      order: [['id', 'ASC']]
    });

    const safeUsers = adminUsers.map(({ passwordHash, ...u }) => u);
    res.json({
      success: true,
      data: safeUsers
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/admin/users
 * Create a new Admin account
 */
router.post('/users', async (req, res, next) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'নাম, ইমেইল এবং পাসওয়ার্ড আবশ্যক' }
      });
    }

    if (password.trim().length < 6) {
      return res.status(400).json({
        success: false,
        error: { code: 'WEAK_PASSWORD', message: 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে' }
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existing = await User.findOne({ where: { email: normalizedEmail } });
    if (existing) {
      return res.status(400).json({
        success: false,
        error: { code: 'EMAIL_EXISTS', message: 'এই ইমেইলটি ইতিমধ্যে ব্যবহৃত হচ্ছে' }
      });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password.trim(), salt);

    const newAdmin = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      phone: phone ? phone.trim() : '',
      role: 'ADMIN',
      isActive: true,
      passwordHash,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    await AuditService.log({
      req,
      action: 'CREATE_ADMIN_USER',
      entityType: 'User',
      entityId: newAdmin.id,
      newValue: { id: newAdmin.id, name: newAdmin.name, email: newAdmin.email, role: 'ADMIN' },
      details: `Created new admin user: ${newAdmin.name} (${newAdmin.email})`
    });

    const { passwordHash: _, ...safeAdmin } = newAdmin;
    res.status(201).json({
      success: true,
      message: 'নতুন অ্যাডমিন অ্যাকাউন্ট সফলভাবে তৈরি করা হয়েছে',
      data: safeAdmin
    });
  } catch (err) {
    next(err);
  }
});

/**
 * PUT /api/admin/users/:id
 * Update an existing Admin's details or toggle isActive status
 */
router.put('/users/:id', async (req, res, next) => {
  try {
    const targetId = Number(req.params.id);
    const targetUser = await User.findByPk(targetId);

    if (!targetUser || targetUser.role !== 'ADMIN') {
      return res.status(404).json({
        success: false,
        error: { code: 'ADMIN_NOT_FOUND', message: 'অ্যাডমিন ইউজার পাওয়া যায়নি' }
      });
    }

    const { name, email, phone, isActive, newPassword } = req.body;
    const updatePayload = {};

    if (name && name.trim()) updatePayload.name = name.trim();
    if (phone !== undefined) updatePayload.phone = phone ? phone.trim() : '';

    if (email && email.trim()) {
      const normalizedEmail = email.trim().toLowerCase();
      if (normalizedEmail !== targetUser.email?.toLowerCase()) {
        const existing = await User.findOne({ where: { email: normalizedEmail } });
        if (existing && existing.id !== targetId) {
          return res.status(400).json({
            success: false,
            error: { code: 'EMAIL_EXISTS', message: 'এই ইমেইলটি ইতিমধ্যে ব্যবহৃত হচ্ছে' }
          });
        }
        updatePayload.email = normalizedEmail;
      }
    }

    if (isActive !== undefined) {
      if (req.user.id === targetId && !isActive) {
        return res.status(400).json({
          success: false,
          error: { code: 'CANNOT_DEACTIVATE_SELF', message: 'আপনি নিজের অ্যাডমিন অ্যাকাউন্ট নিষ্ক্রিয় করতে পারবেন না' }
        });
      }
      updatePayload.isActive = Boolean(isActive);
    }

    if (newPassword && newPassword.trim()) {
      if (newPassword.trim().length < 6) {
        return res.status(400).json({
          success: false,
          error: { code: 'WEAK_PASSWORD', message: 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে' }
        });
      }
      const salt = await bcrypt.genSalt(10);
      updatePayload.passwordHash = await bcrypt.hash(newPassword.trim(), salt);
    }

    updatePayload.updatedAt = new Date().toISOString();
    await User.update(updatePayload, { where: { id: targetId } });

    await AuditService.log({
      req,
      action: 'UPDATE_ADMIN_USER',
      entityType: 'User',
      entityId: targetId,
      newValue: updatePayload,
      details: `Updated admin user: ${targetUser.name}`
    });

    const updated = await User.findByPk(targetId);
    const { passwordHash: _, ...safeUser } = updated;

    res.json({
      success: true,
      message: 'অ্যাডমিন তথ্য সফলভাবে আপডেট হয়েছে',
      data: safeUser
    });
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /api/admin/users/:id
 * Delete/Revoke an admin account (prevents deleting self or last remaining admin)
 */
router.delete('/users/:id', async (req, res, next) => {
  try {
    const targetId = Number(req.params.id);

    if (req.user.id === targetId) {
      return res.status(400).json({
        success: false,
        error: { code: 'CANNOT_DELETE_SELF', message: 'আপনি নিজের অ্যাডমিন অ্যাকাউন্ট মুছে ফেলতে পারবেন না' }
      });
    }

    const allAdmins = await User.findAll({ where: { role: 'ADMIN' } });
    if (allAdmins.length <= 1) {
      return res.status(400).json({
        success: false,
        error: { code: 'LAST_ADMIN', message: 'সিস্টেমে কমপক্ষে একজন প্রধান অ্যাডমিন থাকা বাধ্যতামূলক। এটি মুছে ফেলা যাবে না।' }
      });
    }

    const targetUser = await User.findByPk(targetId);
    if (!targetUser || targetUser.role !== 'ADMIN') {
      return res.status(404).json({
        success: false,
        error: { code: 'ADMIN_NOT_FOUND', message: 'অ্যাডমিন অ্যাকাউন্ট পাওয়া যায়নি' }
      });
    }

    await User.destroy({ where: { id: targetId } });

    await AuditService.log({
      req,
      action: 'DELETE_ADMIN_USER',
      entityType: 'User',
      entityId: targetId,
      oldValue: { id: targetUser.id, name: targetUser.name, email: targetUser.email },
      details: `Deleted admin account: ${targetUser.name} (${targetUser.email})`
    });

    res.json({
      success: true,
      message: 'অ্যাডমিন অ্যাকাউন্ট সফলভাবে মুছে ফেলা হয়েছে'
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/admin/stats
 * Global Academy KPI metrics
 */

/**
 * GET /api/admin/dashboard-aggregate
 * Single high-performance unified endpoint grouping stats, students, teachers,
 * invoices, audit logs, classes, and textbooks into 1 request.
 */
router.get('/dashboard-aggregate', async (req, res, next) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    const [allStudents, teachers, allInvoices, todayAtt, auditLogs, classes] = await Promise.all([
      Student.findAll({
        include: [
          { model: User, as: 'user' },
          { model: Class, as: 'class' },
          { model: Section, as: 'section' }
        ],
        order: [['classId', 'ASC'], ['rollNo', 'ASC']]
      }).catch(() => []),
      Teacher.findAll({
        include: [{ model: User, as: 'user' }],
        order: [['id', 'ASC']]
      }).catch(() => []),
      Invoice.findAll({
        include: [{ model: Payment, as: 'payments' }],
        order: [['dueDate', 'DESC']]
      }).catch(() => []),
      Attendance.findAll({ where: { date: today } }).catch(() => []),
      AuditLog.findAll({
        include: [{ model: User, as: 'user' }],
        order: [['createdAt', 'DESC']],
        limit: 30
      }).catch(() => []),
      Class.findAll({ order: [['id', 'ASC']] }).catch(() => [])
    ]);

    const totalStudents = allStudents.length;
    const activeStudents = allStudents.filter(s => (s.status || '').toLowerCase() === 'active' || (!s.status && s.user?.isActive !== false)).length;
    const inactiveStudents = totalStudents - activeStudents;
    const totalTeachers = teachers.length;
    const totalClasses = classes.length;

    let attendanceRate = 94.5;
    if (todayAtt.length > 0) {
      const presentCount = todayAtt.filter(a => a.status === 'PRESENT' || a.status === 'LATE').length;
      attendanceRate = Number(((presentCount / todayAtt.length) * 100).toFixed(1));
    }

    const totalBilled = allInvoices.reduce((sum, inv) => sum + Number(inv.amount || 0), 0);
    const paidInvoices = allInvoices.filter(inv => inv.status === 'PAID');
    const totalCollected = paidInvoices.reduce((sum, inv) => sum + Number(inv.amount || 0), 0);
    const totalPending = totalBilled - totalCollected;

    res.json({
      success: true,
      data: {
        stats: {
          totalStudents,
          activeStudents,
          inactiveStudents,
          totalTeachers,
          totalClasses,
          attendanceRateToday: attendanceRate,
          financials: {
            totalBilled,
            totalCollected,
            totalPending,
            collectionPercentage: totalBilled > 0 ? Number(((totalCollected / totalBilled) * 100).toFixed(1)) : 0
          },
          totalAuditLogs: auditLogs.length
        },
        students: allStudents,
        teachers,
        invoices: allInvoices,
        auditLogs,
        classes
      }
    });
  } catch (err) {
    next(err);
  }
});

router.get('/stats', async (req, res, next) => {
  try {
    const allStudents = await Student.findAll({ include: [{ model: User, as: 'user' }] });
    const totalStudents = allStudents.length;
    const activeStudents = allStudents.filter(s => {
      const st = (s.status || '').toLowerCase();
      return st === 'active' || (!st && s.user?.isActive !== false);
    }).length;
    const inactiveStudents = allStudents.filter(s => {
      const st = (s.status || '').toLowerCase();
      return st === 'suspended' || st === 'inactive' || st === 'left' || s.user?.isActive === false;
    }).length;

    const totalTeachers = await Teacher.count();
    const totalClasses = await Class.count();

    // Today's attendance calculation
    const today = new Date().toISOString().split('T')[0];
    const todayAttendance = await Attendance.findAll({ where: { date: today } });
    let attendanceRate = 94.5; // default fallback if today has no marked records yet
    if (todayAttendance.length > 0) {
      const presentCount = todayAttendance.filter(a => a.status === 'PRESENT' || a.status === 'LATE').length;
      attendanceRate = Number(((presentCount / todayAttendance.length) * 100).toFixed(1));
    }

    // Fee overview
    const allInvoices = await Invoice.findAll();
    const totalBilled = allInvoices.reduce((sum, inv) => sum + Number(inv.amount || 0), 0);
    const paidInvoices = allInvoices.filter(inv => inv.status === 'PAID');
    const totalCollected = paidInvoices.reduce((sum, inv) => sum + Number(inv.amount || 0), 0);
    const totalPending = totalBilled - totalCollected;

    // Recent Audit Logs count
    const totalAuditLogs = await AuditLog.count();

    res.json({
      success: true,
      data: {
        totalStudents,
        activeStudents,
        inactiveStudents,
        totalTeachers,
        totalClasses,
        attendanceRateToday: attendanceRate,
        financials: {
          totalBilled,
          totalCollected,
          totalPending,
          collectionPercentage: totalBilled > 0 ? Number(((totalCollected / totalBilled) * 100).toFixed(1)) : 0
        },
        totalAuditLogs
      }
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/admin/students
 * List all students with populated details
 */
router.get('/students', async (req, res, next) => {
  try {
    const { classId, search } = req.query;
    const where = {};
    if (classId) where.classId = Number(classId);

    const students = await Student.findAll({
      where,
      include: [
        { model: User, as: 'user' },
        { model: Class, as: 'class' },
        { model: Section, as: 'section' },
        { model: GuardianStudentMapping, as: 'guardians', include: [{ model: User, as: 'parent' }] }
      ]
    });

    let results = students;
    if (search) {
      const s = search.toLowerCase();
      results = results.filter(st =>
        (st.user && st.user.name.toLowerCase().includes(s)) ||
        (st.studentIdNumber && st.studentIdNumber.toLowerCase().includes(s)) ||
        String(st.rollNo).includes(s)
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
 * POST /api/admin/students
 * Add a new student profile, user account, guardian mapping & audit log
 */
router.post('/students', async (req, res, next) => {
  try {
    const {
      name,
      rollNo,
      classId,
      sectionId,
      guardianName,
      guardianPhone,
      bloodGroup = 'B+',
      dob = '2014-01-01',
      gender = 'MALE',
      photo = null,
      address = 'ঢাকা, বাংলাদেশ',
      admissionDate,
      admission_date
    } = req.body;

    if (!name || !rollNo || !classId || !sectionId) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'শিক্ষার্থীর নাম, রোল নম্বর, শ্রেণি এবং শাখা আবশ্যক / Name, Roll No, Class, and Section are required'
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
      name,
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
      sectionId: Number(sectionId),
      dob,
      bloodGroup,
      gender,
      address,
      admissionDate: admissionDate || admission_date || new Date().toISOString().split('T')[0],
      photo: photo || null
    });

    // 3. Link Parent / Guardian
    let parentUser = null;
    if (guardianPhone) {
      parentUser = await User.findOne({ where: { phone: guardianPhone, role: 'PARENT' } });
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

    // 4. Record Audit Log
    await AuditService.log({
      req,
      userId: req.user.id,
      action: 'CREATE_STUDENT',
      entityType: 'student',
      entityId: newStudent.id,
      newValue: { ...newStudent, studentName: name, parentName: guardianName },
      details: `অ্যাডমিন নতুন শিক্ষার্থী যোগ করেছেন: "${name}" (আইডি: ${studentIdNumber}, শ্রেণি ID: ${classId}, রোল: ${rollNo})`
    });

    // 5. Fetch fully populated student record
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
      message: 'শিক্ষার্থী সফলভাবে যুক্ত করা হয়েছে / Student added successfully',
      data: populated
    });
  } catch (err) {
    next(err);
  }
});

/**
 * PUT /api/admin/students/:id
 * Update student profile and guardian
 */
router.put('/students/:id', async (req, res, next) => {
  try {
    const student = await Student.findByPk(req.params.id);
    if (!student) {
      return res.status(404).json({
        success: false,
        error: { code: 'STUDENT_NOT_FOUND', message: 'শিক্ষার্থী পাওয়া যায়নি / Student not found' }
      });
    }

    const {
      name,
      rollNo,
      classId,
      sectionId,
      guardianName,
      guardianPhone,
      bloodGroup,
      dob,
      gender,
      address,
      photo,
      isActive
    } = req.body;

    // Update User
    if (student.userId && (name || photo || isActive !== undefined)) {
      await User.update(
        {
          ...(name && { name }),
          ...(photo && { avatar: photo }),
          ...(isActive !== undefined && { isActive: Boolean(isActive) })
        },
        { where: { id: student.userId } }
      );
    }

    // Update Student
    await Student.update(
      {
        ...(rollNo && { rollNo: Number(rollNo) }),
        ...(classId && { classId: Number(classId) }),
        ...(sectionId && { sectionId: Number(sectionId) }),
        ...(bloodGroup && { bloodGroup }),
        ...(dob && { dob }),
        ...(gender && { gender }),
        ...(address && { address }),
        ...(photo !== undefined && { photo })
      },
      { where: { id: student.id } }
    );

    // Update or link Guardian
    if (guardianPhone) {
      let parentUser = await User.findOne({ where: { phone: guardianPhone, role: 'PARENT' } });
      if (parentUser && guardianName) {
        await User.update({ name: guardianName }, { where: { id: parentUser.id } });
      }
    }

    // Audit Log
    await AuditService.log({
      req,
      userId: req.user.id,
      action: 'UPDATE_STUDENT',
      entityType: 'student',
      entityId: student.id,
      details: `শিক্ষার্থীর তথ্য আপডেট করা হয়েছে: ID ${student.id}`
    });

    const updated = await Student.findByPk(student.id, {
      include: [
        { model: User, as: 'user' },
        { model: Class, as: 'class' },
        { model: Section, as: 'section' },
        { model: GuardianStudentMapping, as: 'guardians', include: [{ model: User, as: 'parent' }] }
      ]
    });

    res.json({
      success: true,
      message: 'শিক্ষার্থীর তথ্য সফলভাবে আপডেট হয়েছে',
      data: updated
    });
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /api/admin/students/:id
 * Delete student record
 */
router.delete('/students/:id', async (req, res, next) => {
  try {
    const student = await Student.findByPk(req.params.id);
    if (!student) {
      return res.status(404).json({
        success: false,
        error: { code: 'STUDENT_NOT_FOUND', message: 'শিক্ষার্থী পাওয়া যায়নি / Student not found' }
      });
    }

    const userId = student.userId;

    // Delete mappings & student
    await GuardianStudentMapping.destroy({ where: { studentId: student.id } });
    await Student.destroy({ where: { id: student.id } });
    if (userId) {
      await User.destroy({ where: { id: userId } });
    }

    await AuditService.log({
      req,
      userId: req.user.id,
      action: 'DELETE_STUDENT',
      entityType: 'student',
      entityId: student.id,
      details: `শিক্ষার্থী মুছে ফেলা হয়েছে: ID ${student.id}`
    });

    res.json({
      success: true,
      message: 'শিক্ষার্থী সফলভাবে মুছে ফেলা হয়েছে / Student deleted successfully'
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/admin/teachers
 * List all teachers with assignments
 */
router.get('/teachers', async (req, res, next) => {
  try {
    const teachers = await Teacher.findAll({
      include: [
        { model: User, as: 'user' },
        { model: require('../models').TeacherClassAssignment, as: 'assignments', include: ['class', 'section', 'subject'] }
      ]
    });

    res.json({
      success: true,
      data: teachers
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/admin/teachers
 * Create a new Teacher, User account, Assignments & Audit Log
 */
router.post('/teachers', async (req, res, next) => {
  try {
    const {
      name,
      designation,
      specialization,
      phone,
      email,
      password = 'teacher123',
      joiningDate = new Date().toISOString().split('T')[0],
      photo = null,
      assignedClasses = []
    } = req.body;

    if (!name || !designation || !phone) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'শিক্ষকের নাম, পদবি এবং ফোন নম্বর আবশ্যক / Teacher name, designation, and phone are required'
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
      designation,
      specialization: specialization || 'সাধারণ শিক্ষা / General Education',
      joiningDate
    });

    // 3. Create Class Assignments if provided
    if (Array.isArray(assignedClasses) && assignedClasses.length > 0) {
      for (const item of assignedClasses) {
        if (item.classId && item.subjectId) {
          await TeacherClassAssignment.create({
            teacherId: teacher.id,
            classId: Number(item.classId),
            sectionId: item.sectionId ? Number(item.sectionId) : 1,
            subjectId: Number(item.subjectId),
            isClassTeacher: !!item.isClassTeacher
          });
        }
      }
    }

    // 4. Audit Log
    await AuditService.log({
      req,
      userId: req.user.id,
      action: 'CREATE_TEACHER',
      entityType: 'teacher',
      entityId: teacher.id,
      newValue: { ...teacher, name, email: teacherEmail, designation },
      details: `অ্যাডমিন নতুন শিক্ষক যুক্ত করেছেন: "${name}" (${designation}, ফোন: ${phone})`
    });

    // 5. Fetch fully populated teacher record
    const populated = await Teacher.findByPk(teacher.id, {
      include: [
        { model: User, as: 'user' },
        { model: TeacherClassAssignment, as: 'assignments', include: ['class', 'section', 'subject'] }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'শিক্ষক সফলভাবে যুক্ত করা হয়েছে / Teacher added successfully',
      data: populated
    });
  } catch (err) {
    next(err);
  }
});

/**
 * PUT /api/admin/teachers/:id
 * Update Teacher details & assignments
 */
router.put('/teachers/:id', async (req, res, next) => {
  try {
    const teacher = await Teacher.findByPk(req.params.id, {
      include: [{ model: User, as: 'user' }]
    });

    if (!teacher) {
      return res.status(404).json({
        success: false,
        error: { code: 'TEACHER_NOT_FOUND', message: 'Teacher record not found' }
      });
    }

    const {
      name,
      designation,
      specialization,
      phone,
      photo,
      joiningDate,
      assignedClasses
    } = req.body;

    // Update User
    if (teacher.userId && (name || phone || photo)) {
      await User.update(
        {
          ...(name && { name }),
          ...(phone && { phone }),
          ...(photo && { avatar: photo })
        },
        { where: { id: teacher.userId } }
      );
    }

    // Update Teacher
    await Teacher.update(
      {
        ...(designation && { designation }),
        ...(specialization && { specialization }),
        ...(joiningDate && { joiningDate })
      },
      { where: { id: teacher.id } }
    );

    // Update Assignments if provided
    if (Array.isArray(assignedClasses)) {
      await TeacherClassAssignment.destroy({ where: { teacherId: teacher.id } });
      for (const item of assignedClasses) {
        if (item.classId && item.subjectId) {
          await TeacherClassAssignment.create({
            teacherId: teacher.id,
            classId: Number(item.classId),
            sectionId: item.sectionId ? Number(item.sectionId) : 1,
            subjectId: Number(item.subjectId),
            isClassTeacher: !!item.isClassTeacher
          });
        }
      }
    }

    await AuditService.log({
      req,
      userId: req.user.id,
      action: 'UPDATE_TEACHER',
      entityType: 'teacher',
      entityId: teacher.id,
      details: `অ্যাডমিন শিক্ষক প্রোফাইল আপডেট করেছেন: ID ${teacher.id}`
    });

    const updated = await Teacher.findByPk(teacher.id, {
      include: [
        { model: User, as: 'user' },
        { model: TeacherClassAssignment, as: 'assignments', include: ['class', 'section', 'subject'] }
      ]
    });

    res.json({
      success: true,
      message: 'শিক্ষক তথ্য সফলভাবে আপডেট করা হয়েছে',
      data: updated
    });
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /api/admin/teachers/:id
 * Delete Teacher profile and assignments
 */
router.delete('/teachers/:id', async (req, res, next) => {
  try {
    const teacher = await Teacher.findByPk(req.params.id);
    if (!teacher) {
      return res.status(404).json({
        success: false,
        error: { code: 'TEACHER_NOT_FOUND', message: 'Teacher record not found' }
      });
    }

    await TeacherClassAssignment.destroy({ where: { teacherId: teacher.id } });
    await Teacher.destroy({ where: { id: teacher.id } });

    await AuditService.log({
      req,
      userId: req.user.id,
      action: 'DELETE_TEACHER',
      entityType: 'teacher',
      entityId: teacher.id,
      details: `অ্যাডমিন শিক্ষক প্রোফাইল ডিলিট করেছেন: ID ${teacher.id}`
    });

    res.json({
      success: true,
      message: 'শিক্ষক প্রোফাইল সফলভাবে মুছে ফেলা হয়েছে / Teacher deleted successfully'
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/admin/invoices
 * List all invoices across the academy
 */
router.get('/invoices', async (req, res, next) => {
  try {
    const { status } = req.query;
    const where = {};
    if (status) where.status = status;

    const invoices = await Invoice.findAll({
      where,
      include: [
        { model: Student, as: 'student', include: ['user', 'class', 'section'] },
        { model: Payment, as: 'payments' }
      ],
      order: [['dueDate', 'ASC']]
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
 * POST /api/admin/invoices
 * Create and assign invoices with Discount / Waiver logic to student or entire class
 */
router.post('/invoices', async (req, res, next) => {
  try {
    const {
      studentId,
      classId,
      titleBn,
      titleEn,
      month,
      year = 2026,
      baseAmount,
      discountType = 'NONE',
      discountValue = 0,
      discountReason = null,
      dueDate
    } = req.body;

    if ((!studentId && !classId) || !titleBn || !baseAmount || !dueDate) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'শিক্ষার্থী/শ্রেণি, ইনভয়েস শিরোনাম, মূল ফি এবং জমার শেষ তারিখ আবশ্যক / Student/Class, title, base fee and due date are required'
        }
      });
    }

    const base = Number(baseAmount) || 0;
    const discType = ['FLAT', 'PERCENTAGE', 'NONE'].includes(discountType) ? discountType : 'NONE';
    const discVal = Number(discountValue) || 0;

    // Calculate Discount Amount
    let discountAmount = 0;
    if (discType === 'PERCENTAGE') {
      discountAmount = Math.round((base * discVal) / 100);
    } else if (discType === 'FLAT') {
      discountAmount = Math.min(discVal, base);
    }

    const finalAmount = Math.max(0, base - discountAmount);

    let targetStudentIds = [];
    if (studentId) {
      targetStudentIds = [Number(studentId)];
    } else if (classId) {
      const students = await Student.findAll({ where: { classId: Number(classId) } });
      targetStudentIds = students.map(s => s.id);
    }

    if (targetStudentIds.length === 0) {
      return res.status(404).json({
        success: false,
        error: { code: 'NO_STUDENTS_FOUND', message: 'কোনো শিক্ষার্থী পাওয়া যায়নি / No students found for invoice generation' }
      });
    }

    const createdInvoices = [];
    for (const sid of targetStudentIds) {
      const randomInvSuffix = Math.floor(1000 + Math.random() * 9000);
      const invoiceNo = `INV-${year}-${randomInvSuffix}`;

      const newInv = await Invoice.create({
        invoiceNo,
        studentId: sid,
        titleBn,
        titleEn: titleEn || titleBn,
        month: month || 'Current',
        year: Number(year) || 2026,
        baseAmount: base,
        discountType: discType,
        discountValue: discVal,
        discountReason: discountReason || null,
        discountAmount,
        amount: finalAmount,
        dueDate,
        status: 'UNPAID'
      });

      createdInvoices.push(newInv);
    }

    // Record audit log
    await AuditService.log({
      req,
      userId: req.user.id,
      action: 'CREATE_INVOICE',
      entityType: 'invoices',
      entityId: createdInvoices[0]?.id || 0,
      newValue: {
        totalGenerated: createdInvoices.length,
        titleBn,
        baseAmount: base,
        discountType: discType,
        discountValue: discVal,
        discountReason,
        discountAmount,
        finalAmount,
        dueDate
      },
      details: `অ্যাডমিন নতুন ইনভয়েস তৈরি করেছেন: "${titleBn}" (মূল ফি: ৳${base}, ছাড়: ৳${discountAmount} [${discType}], মোট প্রদেয়: ৳${finalAmount})`
    });

    res.status(201).json({
      success: true,
      message: `${createdInvoices.length}টি ইনভয়েস সফলভাবে তৈরি হয়েছে / Invoices generated successfully`,
      data: createdInvoices
    });
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /api/admin/invoices/:id
 * Delete or cancel an invoice
 */
router.delete('/invoices/:id', async (req, res, next) => {
  try {
    const invoice = await Invoice.findByPk(req.params.id);
    if (!invoice) {
      return res.status(404).json({
        success: false,
        error: { code: 'INVOICE_NOT_FOUND', message: 'ইনভয়েস পাওয়া যায়নি / Invoice not found' }
      });
    }

    await Payment.destroy({ where: { invoiceId: invoice.id } });
    await Invoice.destroy({ where: { id: invoice.id } });

    await AuditService.log({
      req,
      userId: req.user.id,
      action: 'DELETE_INVOICE',
      entityType: 'invoices',
      entityId: invoice.id,
      details: `অ্যাডমিন ইনভয়েস #${invoice.invoiceNo} (${invoice.titleBn}) মুছে ফেলেছেন`
    });

    res.json({
      success: true,
      message: 'ইনভয়েস সফলভাবে মুছে ফেলা হয়েছে / Invoice deleted successfully'
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/admin/audit-logs
 * Inspect immutable audit logs with pagination and filters
 */
router.get('/audit-logs', async (req, res, next) => {
  try {
    const { action, actionType, targetResource, entityType, adminEmail, search, limit = 50, offset = 0 } = req.query;
    const where = {};
    if (action) where.action = action;
    if (actionType) where.actionType = actionType;
    if (targetResource) where.targetResource = targetResource;
    if (entityType) where.entityType = entityType;
    if (adminEmail) where.adminEmail = adminEmail;

    let logs = await AuditLog.findAll({
      where,
      include: [{ model: User, as: 'user' }],
      order: [['createdAt', 'DESC']],
      limit: Number(limit) * 2, // fetch enough to filter if search
      offset: Number(offset)
    });

    if (search && search.trim()) {
      const q = search.toLowerCase().trim();
      logs = logs.filter(l =>
        (l.action && l.action.toLowerCase().includes(q)) ||
        (l.actionType && l.actionType.toLowerCase().includes(q)) ||
        (l.adminEmail && l.adminEmail.toLowerCase().includes(q)) ||
        (l.adminName && l.adminName.toLowerCase().includes(q)) ||
        (l.targetResource && l.targetResource.toLowerCase().includes(q)) ||
        (l.ipAddress && l.ipAddress.includes(q)) ||
        (l.details && l.details.toLowerCase().includes(q))
      );
    }

    const total = await AuditLog.count({ where });

    res.json({
      success: true,
      data: {
        total: search ? logs.length : total,
        logs: logs.slice(0, Number(limit))
      }
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/admin/notices
 * Publish a new academy notice with audit logging
 */
router.post('/notices', async (req, res, next) => {
  try {
    const { titleBn, titleEn, contentBn, contentEn, category, priority, targetRole } = req.body;

    if (!titleBn || !contentBn) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'শিরোনাম এবং বিষয়বস্তু বাংলায় পূরণ করা বাধ্যতামূলক / Title and content in Bangla are required'
        }
      });
    }

    const newNotice = await Notice.create({
      titleBn,
      titleEn: titleEn || titleBn,
      contentBn,
      contentEn: contentEn || contentBn,
      category: category || 'GENERAL',
      priority: priority || 'NORMAL',
      targetRole: targetRole || 'ALL',
      authorUserId: req.user.id,
      publishedAt: new Date().toISOString()
    });

    // Record audit log
    await AuditService.log({
      req,
      userId: req.user.id,
      action: 'NOTICE_PUBLISH',
      entityType: 'notices',
      entityId: newNotice.id,
      newValue: newNotice,
      details: `Published notice "${newNotice.titleBn}" (Priority: ${newNotice.priority})`
    });

    res.status(201).json({
      success: true,
      data: newNotice
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/admin/generate-mcq
 * AI-Powered Automated MCQ Question Generator for Exams with Source Material Support
 */
const { generateMCQs } = require('../services/mcqAiGeneratorService');
const { generateCreativeQuestions } = require('../services/cqAiGeneratorService');
const { StudyMaterial } = require('../models');

router.post('/generate-mcq', async (req, res, next) => {
  try {
    const { topic, subject, classGrade, difficulty, questionCount, chapterNotes, sourceMaterialId } = req.body;

    let materialContext = chapterNotes || '';
    let sourceMaterialTitle = '';

    if (sourceMaterialId) {
      const srcMat = await StudyMaterial.findByPk(sourceMaterialId);
      if (srcMat) {
        sourceMaterialTitle = srcMat.title || srcMat.titleBn;
        const text = srcMat.content_text || srcMat.contentText || srcMat.extracted_text || srcMat.descriptionBn;
        if (text) {
          materialContext = text;
        }
      }
    }

    if (!topic && !materialContext && !subject) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'অধ্যায়/টপিকের নাম, স্টাডি সোর্স বা বিষয় উল্লেখ করা আবশ্যক' }
      });
    }

    const result = await generateMCQs({
      topic,
      subject,
      classGrade,
      difficulty: difficulty || 'MEDIUM',
      questionCount: Number(questionCount) || 10,
      chapterNotes: materialContext,
      sourceMaterialId,
      sourceMaterialTitle
    });

    await AuditService.log({
      req,
      userId: req.user.id,
      action: 'AI_GENERATE_MCQ',
      entityType: 'exam_mcq_ai',
      details: `${req.user.name} এআই দিয়ে ${result.questions.length}টি বহুনির্বাচনী প্রশ্ন জেনারেট করেছেন (টপিক: "${topic || subject || sourceMaterialTitle}")`
    });

    res.json({
      success: true,
      message: `সফলভাবে ${result.questions.length}টি বহুনির্বাচনী প্রশ্ন প্রস্তুত হয়েছে!`,
      source: result.source,
      sourceMaterialTitle: sourceMaterialTitle || null,
      data: result.questions
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/admin/generate-cq
 * AI-Powered Creative Question (CQ / সৃজনশীল প্রশ্ন) Generator with Source Material Support
 */
router.post('/generate-cq', async (req, res, next) => {
  try {
    const { subject, classGrade, chapterTopic, difficulty, questionCount, chapterNotes, sourceMaterialId } = req.body;

    let materialContext = chapterNotes || '';
    let sourceMaterialTitle = '';

    if (sourceMaterialId) {
      const srcMat = await StudyMaterial.findByPk(sourceMaterialId);
      if (srcMat) {
        sourceMaterialTitle = srcMat.title || srcMat.titleBn;
        const text = srcMat.content_text || srcMat.contentText || srcMat.extracted_text || srcMat.descriptionBn;
        if (text) {
          materialContext = text;
        }
      }
    }

    if (!chapterTopic && !materialContext && !subject) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'অধ্যায়/টপিকের নাম, স্টাডি সোর্স বা বিষয় উল্লেখ করা আবশ্যক' }
      });
    }

    const result = await generateCreativeQuestions({
      subject,
      classGrade,
      chapterTopic,
      difficulty: difficulty || 'MEDIUM',
      questionCount: Number(questionCount) || 2,
      chapterNotes: materialContext,
      sourceMaterialId,
      sourceMaterialTitle
    });

    await AuditService.log({
      req,
      userId: req.user.id,
      action: 'AI_GENERATE_CQ',
      entityType: 'exam_cq_ai',
      details: `${req.user.name} এআই দিয়ে ${result.questions.length}টি সৃজনশীল প্রশ্ন জেনারেট করেছেন (টপিক: "${chapterTopic || subject || sourceMaterialTitle}")`
    });

    res.json({
      success: true,
      message: `সফলভাবে ${result.questions.length}টি সৃজনশীল প্রশ্ন প্রস্তুত হয়েছে!`,
      source: result.source,
      sourceMaterialTitle: sourceMaterialTitle || null,
      data: result.questions
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
