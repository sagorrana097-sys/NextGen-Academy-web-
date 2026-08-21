const { Student, TeacherClassAssignment, GuardianStudentMapping } = require('../models');

/**
 * Data Ownership & Authorization Guard
 * Ensures users can only access student records they are explicitly authorized to view or manage.
 */
const verifyStudentAccess = async (req, res, next) => {
  try {
    const rawStudentId = req.params.studentId || req.query.studentId || req.body.studentId;

    if (!rawStudentId) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'STUDENT_ID_REQUIRED',
          message: 'শিক্ষার্থীর আইডি প্রদান করা আবশ্যক / Student ID is required'
        }
      });
    }

    const studentId = Number(rawStudentId);
    const user = req.user;

    // 1. ADMIN has global access
    if (user.role === 'ADMIN') {
      req.targetStudentId = studentId;
      return next();
    }

    // 2. STUDENT can only access their own profile
    if (user.role === 'STUDENT') {
      if (user.studentId !== studentId) {
        return res.status(403).json({
          success: false,
          error: {
            code: 'FORBIDDEN_STUDENT_OWNERSHIP',
            message: 'আপনি শুধুমাত্র আপনার নিজস্ব তথ্য দেখতে পারবেন / You can only access your own student profile'
          }
        });
      }
      req.targetStudentId = studentId;
      return next();
    }

    // 3. PARENT can only access linked children
    if (user.role === 'PARENT') {
      const isLinked = user.linkedStudentIds && user.linkedStudentIds.includes(studentId);
      if (!isLinked) {
        // Fallback check against database
        const mapping = await GuardianStudentMapping.findOne({
          where: {
            parentUserId: user.id,
            studentId: studentId
          }
        });

        if (!mapping) {
          return res.status(403).json({
            success: false,
            error: {
              code: 'FORBIDDEN_PARENT_LINKAGE',
              message: 'এই শিক্ষার্থী আপনার অভিভাবক প্রোফাইলের সাথে যুক্ত নয় / This student is not linked to your parent account'
            }
          });
        }
      }
      req.targetStudentId = studentId;
      return next();
    }

    // 4. TEACHER can access students enrolled in their assigned classes/sections
    if (user.role === 'TEACHER') {
      const student = await Student.findByPk(studentId);
      if (!student) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'STUDENT_NOT_FOUND',
            message: 'শিক্ষার্থী খুঁজে পাওয়া যায়নি / Student not found'
          }
        });
      }

      const assignments = await TeacherClassAssignment.findAll({
        where: {
          teacherId: user.teacherId,
          classId: student.classId
        }
      });

      const isAssigned = assignments.some(
        a => a.sectionId === null || a.sectionId === student.sectionId
      );

      if (!isAssigned) {
        return res.status(403).json({
          success: false,
          error: {
            code: 'FORBIDDEN_TEACHER_ASSIGNMENT',
            message: 'এই শিক্ষার্থীর শ্রেণি আপনার শিক্ষক তালিকার অন্তর্ভুক্ত নয় / This student is not in your assigned classes'
          }
        });
      }

      req.targetStudentId = studentId;
      return next();
    }

    return res.status(403).json({
      success: false,
      error: {
        code: 'FORBIDDEN_UNKNOWN_ROLE',
        message: 'অনুমতি অস্বীকৃত / Access denied'
      }
    });
  } catch (err) {
    console.error('[Ownership Guard Error]:', err);
    return res.status(500).json({
      success: false,
      error: {
        code: 'OWNERSHIP_CHECK_FAILED',
        message: 'অনুমতি যাচাই করতে ত্রুটি হয়েছে / Error validating access permissions'
      }
    });
  }
};

module.exports = {
  verifyStudentAccess
};
