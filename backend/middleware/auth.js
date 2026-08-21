const jwt = require('jsonwebtoken');
const { User, Student, Teacher, GuardianStudentMapping } = require('../models');

const JWT_SECRET = process.env.JWT_SECRET || 'nextgen_academy_super_secret_jwt_key_2026_bd_edu';

/**
 * Authentication Middleware
 * Validates JWT Bearer Token and attaches user object with role-specific IDs to req.user
 */
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'প্রমাণীকরণ টোকেন অনুপস্থিত বা অবৈধ / Authentication token missing or invalid'
        }
      });
    }

    const token = authHeader.split(' ')[1];
    let decoded;

    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'TOKEN_EXPIRED_OR_INVALID',
          message: 'সেশনের মেয়াদ শেষ বা টোকেন সঠিক নয় / Session expired or token invalid'
        }
      });
    }

    const user = await User.findByPk(decoded.userId);
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'USER_INACTIVE',
          message: 'ব্যবহারকারী নিষ্ক্রিয় অথবা খুঁজে পাওয়া যায়নি / User inactive or not found'
        }
      });
    }

    // Attach role-specific metadata
    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      studentId: null,
      teacherId: null,
      linkedStudentIds: []
    };

    if (user.role === 'STUDENT') {
      const student = await Student.findOne({ where: { userId: user.id } });
      if (student) {
        req.user.studentId = student.id;
        req.user.classId = student.classId;
        req.user.sectionId = student.sectionId;
      }
    } else if (user.role === 'TEACHER') {
      const teacher = await Teacher.findOne({ where: { userId: user.id } });
      if (teacher) {
        req.user.teacherId = teacher.id;
      }
    } else if (user.role === 'PARENT') {
      const mappings = await GuardianStudentMapping.findAll({
        where: { parentUserId: user.id }
      });
      req.user.linkedStudentIds = mappings.map(m => m.studentId);
    }

    next();
  } catch (err) {
    console.error('[Auth Middleware Error]:', err);
    return res.status(500).json({
      success: false,
      error: {
        code: 'AUTH_INTERNAL_ERROR',
        message: 'প্রমাণীকরণ যাচাইয়ে ত্রুটি হয়েছে / Authentication verification error'
      }
    });
  }
};

/**
 * Role-Based Access Control (RBAC) Guard
 * @param {string|string[]} allowedRoles
 */
const requireRole = (allowedRoles) => {
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'অনুগ্রহ করে প্রথমে লগইন করুন / Please log in first'
        }
      });
    }

    const hasPermission =
      roles.includes(req.user.role) ||
      (req.user.role === 'SUPER_ADMIN' && roles.includes('ADMIN')) ||
      (req.user.role === 'ADMIN' && roles.includes('SUPER_ADMIN'));

    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN_ROLE',
          message: `আপনার এই কার্য সম্পাদনের অনুমতি নেই (প্রয়োজনীয় রোল: ${roles.join(', ')}) / You do not have permission for this action (Required: ${roles.join(', ')})`
        }
      });
    }

    next();
  };
};

module.exports = {
  authenticate,
  requireRole,
  JWT_SECRET
};
