const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
const { User, Student, Teacher, GuardianStudentMapping } = require('../models');
const { authenticate, JWT_SECRET } = require('../middleware/auth');
const { authLimiter } = require('../middleware/security');
const AuditService = require('../services/auditService');

const router = express.Router();

const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';

/**
 * Generate Access and Refresh Tokens
 */
function generateTokens(user, studentId = null, teacherId = null) {
  const payload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    studentId,
    teacherId
  };

  const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
  const refreshToken = jwt.sign({ userId: user.id, tokenType: 'REFRESH' }, JWT_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });

  return { accessToken, refreshToken };
}

/**
 * Set Refresh Token Cookie
 */
function setRefreshTokenCookie(res, refreshToken) {
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });
}

/**
 * POST /api/auth/login
 * Authenticate user with rate limiting and 2FA check
 */
router.post('/login', authLimiter, async (req, res, next) => {
  try {
    const rawIdentifier = String(req.body.identifier || req.body.email || '').trim();
    const { password } = req.body;

    if (!rawIdentifier || !password) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'MISSING_CREDENTIALS',
          message: 'ইমেইল, স্টুডেন্ট আইডি অথবা মোবাইল নম্বর এবং পাসওয়ার্ড আবশ্যক'
        }
      });
    }

    let user = null;
    const normalizedInput = rawIdentifier.toLowerCase();

    // 1. Try Direct Email match
    user = await User.findOne({ where: { email: normalizedInput } });

    // 2. Try User ID / Username / Identifier match (e.g. Alomgir005)
    if (!user) {
      const allUsers = await User.findAll();
      user = allUsers.find(
        (u) =>
          (u.username && u.username.toLowerCase() === normalizedInput) ||
          (u.userId && String(u.userId).toLowerCase() === normalizedInput) ||
          (u.identifier && String(u.identifier).toLowerCase() === normalizedInput) ||
          (u.email && u.email.toLowerCase() === normalizedInput)
      );
    }

    // 3. Try Student ID match in Student records
    if (!user) {
      const allStudents = await Student.findAll();
      const matchedStudent = allStudents.find(
        (s) =>
          (s.studentIdNumber && s.studentIdNumber.toLowerCase() === normalizedInput) ||
          (s.rollNo && (String(s.rollNo) === rawIdentifier || String(s.rollNo).padStart(2, '0') === rawIdentifier))
      );

      if (matchedStudent) {
        user = await User.findByPk(matchedStudent.userId);
      }
    }

    // 4. Try Phone Number match in Users or Student guardians
    if (!user) {
      user = await User.findOne({ where: { phone: rawIdentifier } });
    }

    if (!user) {
      const allStudents = await Student.findAll();
      const matchedByGuardianPhone = allStudents.find(
        (s) => s.guardianPhone && s.guardianPhone.trim() === rawIdentifier
      );
      if (matchedByGuardianPhone) {
        const mapping = await GuardianStudentMapping.findOne({ where: { studentId: matchedByGuardianPhone.id } });
        if (mapping) {
          user = await User.findByPk(mapping.parentUserId);
        }
        if (!user) {
          user = await User.findByPk(matchedByGuardianPhone.userId);
        }
      }
    }

    if (!user || user.isActive === false) {
      await AuditService.log({
        req,
        action: 'FAILED_LOGIN_ATTEMPT',
        targetResource: 'AUTH',
        status: 'FAILED',
        details: `Failed login attempt for identifier: ${rawIdentifier}`
      });

      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'ইমেইল, স্টুডেন্ট আইডি অথবা পাসওয়ার্ড সঠিক নয়'
        }
      });
    }

    const storedHash = user.passwordHash || user.password;
    const isMatch = storedHash ? bcrypt.compareSync(password, storedHash) : false;

    if (!isMatch) {
      await AuditService.log({
        req,
        userId: user.id,
        adminEmail: user.email,
        adminName: user.name,
        action: 'FAILED_PASSWORD_ATTEMPT',
        targetResource: 'AUTH',
        status: 'FAILED',
        details: `Invalid password attempt for ${user.email}`
      });

      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'পাসওয়ার্ড সঠিক নয়'
        }
      });
    }

    // Check if 2FA is enabled for this user
    if (user.twoFactorEnabled && user.twoFactorSecret) {
      const tempToken = jwt.sign(
        { tempUserId: user.id, purpose: '2FA_VERIFY' },
        JWT_SECRET,
        { expiresIn: '5m' }
      );

      return res.json({
        success: true,
        requires2FA: true,
        message: 'দ্বি-স্তরীয় প্রমাণীকরণ (2FA) কোড আবশ্যক',
        tempToken,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    }

    // Determine role metadata
    let studentId = null;
    let teacherId = null;
    let linkedChildren = [];

    if (user.role === 'STUDENT') {
      const student = await Student.findOne({ where: { userId: user.id } });
      if (student) studentId = student.id;
    } else if (user.role === 'TEACHER') {
      const teacher = await Teacher.findOne({ where: { userId: user.id } });
      if (teacher) teacherId = teacher.id;
    } else if (user.role === 'PARENT') {
      const mappings = await GuardianStudentMapping.findAll({
        where: { parentUserId: user.id },
        include: [{ model: Student, as: 'student', include: [{ model: User, as: 'user' }] }]
      });
      linkedChildren = mappings.map((m) => m.student).filter(Boolean);
    }

    const { accessToken, refreshToken } = generateTokens(user, studentId, teacherId);
    setRefreshTokenCookie(res, refreshToken);

    // Audit log login
    await AuditService.log({
      req,
      userId: user.id,
      adminEmail: user.email,
      adminName: user.name,
      action: 'USER_LOGIN',
      actionType: 'LOGIN',
      targetResource: 'AUTH',
      entityType: 'auth',
      entityId: user.id,
      details: `User ${user.email} (${user.role}) logged in successfully`
    });

    res.json({
      success: true,
      data: {
        token: accessToken,
        refreshToken,
        expiresIn: ACCESS_TOKEN_EXPIRY,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          twoFactorEnabled: !!user.twoFactorEnabled,
          studentId,
          teacherId,
          linkedChildren
        }
      }
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/auth/login-2fa
 * Complete login by verifying 6-digit TOTP code
 */
router.post('/login-2fa', authLimiter, async (req, res, next) => {
  try {
    const { tempToken, code } = req.body;

    if (!tempToken || !code) {
      return res.status(400).json({
        success: false,
        error: { code: 'MISSING_2FA_DATA', message: 'Temp token and 6-digit OTP code are required' }
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(tempToken, JWT_SECRET);
      if (decoded.purpose !== '2FA_VERIFY' || !decoded.tempUserId) {
        throw new Error('Invalid purpose');
      }
    } catch (e) {
      return res.status(401).json({
        success: false,
        error: { code: 'EXPIRED_2FA_SESSION', message: '2FA সেশন শেষ হয়েছে। অনুগ্রহ করে আবার লগইন করুন।' }
      });
    }

    const user = await User.findByPk(decoded.tempUserId);
    if (!user || !user.twoFactorSecret) {
      return res.status(404).json({
        success: false,
        error: { code: 'USER_NOT_FOUND', message: 'User not found or 2FA not configured' }
      });
    }

    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token: String(code).trim(),
      window: 2
    });

    if (!verified) {
      await AuditService.log({
        req,
        userId: user.id,
        adminEmail: user.email,
        adminName: user.name,
        action: 'FAILED_2FA_ATTEMPT',
        targetResource: 'AUTH_2FA',
        status: 'FAILED',
        details: `Invalid 2FA code attempt for user ${user.email}`
      });

      return res.status(401).json({
        success: false,
        error: { code: 'INVALID_2FA_CODE', message: '৬-সংখ্যার ২এফএ কোডটি সঠিক নয় বা মেয়াদোত্তীর্ণ হয়েছে।' }
      });
    }

    // Role metadata
    let studentId = null;
    let teacherId = null;
    let linkedChildren = [];

    if (user.role === 'STUDENT') {
      const student = await Student.findOne({ where: { userId: user.id } });
      if (student) studentId = student.id;
    } else if (user.role === 'TEACHER') {
      const teacher = await Teacher.findOne({ where: { userId: user.id } });
      if (teacher) teacherId = teacher.id;
    } else if (user.role === 'PARENT') {
      const mappings = await GuardianStudentMapping.findAll({
        where: { parentUserId: user.id },
        include: [{ model: Student, as: 'student', include: [{ model: User, as: 'user' }] }]
      });
      linkedChildren = mappings.map((m) => m.student).filter(Boolean);
    }

    const { accessToken, refreshToken } = generateTokens(user, studentId, teacherId);
    setRefreshTokenCookie(res, refreshToken);

    await AuditService.log({
      req,
      userId: user.id,
      adminEmail: user.email,
      adminName: user.name,
      action: 'LOGIN_2FA_SUCCESS',
      actionType: 'LOGIN',
      targetResource: 'AUTH_2FA',
      details: `User ${user.email} passed 2FA authentication`
    });

    res.json({
      success: true,
      data: {
        token: accessToken,
        refreshToken,
        expiresIn: ACCESS_TOKEN_EXPIRY,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          twoFactorEnabled: true,
          studentId,
          teacherId,
          linkedChildren
        }
      }
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/auth/refresh
 * Refresh short-lived access token using refresh token
 */
router.post('/refresh', async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken || req.body.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        error: { code: 'NO_REFRESH_TOKEN', message: 'No refresh token provided' }
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, JWT_SECRET);
      if (decoded.tokenType !== 'REFRESH' || !decoded.userId) {
        throw new Error('Invalid token type');
      }
    } catch (err) {
      return res.status(401).json({
        success: false,
        error: { code: 'INVALID_REFRESH_TOKEN', message: 'Invalid or expired refresh token' }
      });
    }

    const user = await User.findByPk(decoded.userId);
    if (!user || user.isActive === false) {
      return res.status(401).json({
        success: false,
        error: { code: 'USER_INACTIVE', message: 'User account not active' }
      });
    }

    let studentId = null;
    let teacherId = null;
    if (user.role === 'STUDENT') {
      const s = await Student.findOne({ where: { userId: user.id } });
      if (s) studentId = s.id;
    } else if (user.role === 'TEACHER') {
      const t = await Teacher.findOne({ where: { userId: user.id } });
      if (t) teacherId = t.id;
    }

    const tokens = generateTokens(user, studentId, teacherId);
    setRefreshTokenCookie(res, tokens.refreshToken);

    res.json({
      success: true,
      data: {
        token: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresIn: ACCESS_TOKEN_EXPIRY
      }
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/auth/logout
 * Invalidate session and clear refresh cookie
 */
router.post('/logout', authenticate, async (req, res) => {
  try {
    res.clearCookie('refreshToken');

    await AuditService.log({
      req,
      userId: req.user?.id,
      adminEmail: req.user?.email,
      adminName: req.user?.name,
      action: 'USER_LOGOUT',
      actionType: 'LOGOUT',
      targetResource: 'AUTH',
      details: `User ${req.user?.email} logged out`
    });

    res.json({
      success: true,
      message: 'লগআউট সফল হয়েছে / Logged out successfully'
    });
  } catch (err) {
    res.json({ success: true });
  }
});

/**
 * GET /api/auth/2fa/generate
 * Generate TOTP secret and QR code for Google Authenticator
 */
router.get('/2fa/generate', authenticate, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, error: { message: 'User not found' } });
    }

    const secret = speakeasy.generateSecret({
      name: `NextGen Academy (${user.email})`,
      issuer: 'NextGen Academy',
      length: 20
    });

    const qrCodeDataUrl = await qrcode.toDataURL(secret.otpauth_url);

    res.json({
      success: true,
      data: {
        secret: secret.base32,
        qrCode: qrCodeDataUrl,
        otpauth_url: secret.otpauth_url
      }
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/auth/2fa/verify
 * Confirm TOTP secret and enable 2FA on account
 */
router.post('/2fa/verify', authenticate, async (req, res, next) => {
  try {
    const { secret, token } = req.body;

    if (!secret || !token) {
      return res.status(400).json({
        success: false,
        error: { message: 'Secret key and 6-digit verification code are required' }
      });
    }

    const verified = speakeasy.totp.verify({
      secret: secret,
      encoding: 'base32',
      token: String(token).trim(),
      window: 2
    });

    if (!verified) {
      return res.status(400).json({
        success: false,
        error: { message: 'ভুল ভেরিফিকেশন কোড। অনুগ্রহ করে সঠিক কোড দিন।' }
      });
    }

    await User.update(
      {
        twoFactorEnabled: true,
        twoFactorSecret: secret
      },
      { where: { id: req.user.id } }
    );

    await AuditService.log({
      req,
      userId: req.user.id,
      adminEmail: req.user.email,
      adminName: req.user.name,
      action: 'ENABLE_2FA',
      actionType: 'SECURITY',
      targetResource: '2FA',
      details: `User ${req.user.email} successfully enabled Two-Factor Authentication`
    });

    res.json({
      success: true,
      message: 'দ্বি-স্তরীয় প্রমাণীকরণ (2FA) সফলভাবে সক্রিয় করা হয়েছে!'
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/auth/2fa/disable
 * Disable 2FA with password verification
 */
router.post('/2fa/disable', authenticate, async (req, res, next) => {
  try {
    const { password } = req.body;
    if (!password) {
      return res.status(400).json({
        success: false,
        error: { message: 'পাসওয়ার্ড আবশ্যক' }
      });
    }

    const user = await User.findByPk(req.user.id);
    const storedHash = user.passwordHash || user.password;
    const isMatch = storedHash ? bcrypt.compareSync(password, storedHash) : false;

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: { message: 'বর্তমান পাসওয়ার্ড সঠিক নয়' }
      });
    }

    await User.update(
      {
        twoFactorEnabled: false,
        twoFactorSecret: null
      },
      { where: { id: req.user.id } }
    );

    await AuditService.log({
      req,
      userId: req.user.id,
      adminEmail: req.user.email,
      adminName: req.user.name,
      action: 'DISABLE_2FA',
      actionType: 'SECURITY',
      targetResource: '2FA',
      details: `User ${req.user.email} disabled Two-Factor Authentication`
    });

    res.json({
      success: true,
      message: 'দ্বি-স্তরীয় প্রমাণীকরণ (2FA) নিষ্ক্রিয় করা হয়েছে।'
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/auth/me
 * Return currently authenticated user profile
 */
router.get('/me', authenticate, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: { code: 'USER_NOT_FOUND', message: 'User not found' }
      });
    }

    let extra = {};
    if (user.role === 'STUDENT') {
      const student = await Student.findOne({
        where: { userId: user.id },
        include: ['class', 'section']
      });
      extra.student = student;
    } else if (user.role === 'PARENT') {
      const mappings = await GuardianStudentMapping.findAll({
        where: { parentUserId: user.id },
        include: [{ model: Student, as: 'student', include: ['class', 'section', 'user'] }]
      });
      extra.linkedChildren = mappings.map((m) => m.student).filter(Boolean);
    } else if (user.role === 'TEACHER') {
      const teacher = await Teacher.findOne({
        where: { userId: user.id },
        include: ['assignments']
      });
      extra.teacher = teacher;
    }

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          twoFactorEnabled: !!user.twoFactorEnabled,
          ...extra
        }
      }
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/auth/demo-accounts
 */
router.get('/demo-accounts', (req, res) => {
  res.json({
    success: true,
    data: [
      {
        role: 'ADMIN',
        roleBn: 'অ্যাডমিনিস্ট্রেটর (Admin)',
        name: 'ড. আব্দুল্লাহ আল মাহমুদ',
        email: 'admin@nextgen.edu.bd',
        password: 'admin123',
        description: 'প্রধান শিক্ষক ও একাডেমি পরিচালক'
      },
      {
        role: 'TEACHER',
        roleBn: 'শিক্ষক (Teacher)',
        name: 'সেলিনা পারভীন',
        email: 'teacher@nextgen.edu.bd',
        password: 'teacher123',
        description: 'সিনিয়র গণিত শিক্ষক (Class 8 Padma)'
      },
      {
        role: 'PARENT',
        roleBn: 'অভিভাবক (Parent)',
        name: 'মোহাম্মদ রফিকুল ইসলাম',
        email: 'parent@nextgen.edu.bd',
        password: 'parent123',
        description: 'সামির ও আয়েশার অভিভাবক'
      },
      {
        role: 'STUDENT',
        roleBn: 'শিক্ষার্থী (Student)',
        name: 'সামির আহমেদ',
        email: 'student@nextgen.edu.bd',
        password: 'student123',
        description: 'অষ্টম শ্রেণি, রোল ১০১ (পদ্মা শাখা)'
      }
    ]
  });
});

module.exports = router;
