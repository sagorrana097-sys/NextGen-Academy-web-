const express = require('express');
const { Exam, ExamSubmission, Class, Subject, Teacher, Student, User } = require('../models');
const { authenticate, requireRole } = require('../middleware/auth');
const AuditService = require('../services/auditService');

const router = express.Router();

/**
 * GET /api/exams
 * List all exams with filters
 */
router.get('/', authenticate, async (req, res, next) => {
  try {
    const { classId, subjectId, type, status, search } = req.query;

    const where = {};
    if (classId) where.classId = Number(classId);
    if (subjectId) where.subjectId = Number(subjectId);
    if (type) where.type = type;
    if (status) where.status = status;

    let exams = await Exam.findAll({
      where,
      include: [
        { model: Class, as: 'class' },
        { model: Subject, as: 'subject' },
        {
          model: Teacher,
          as: 'teacher',
          include: [{ model: User, as: 'user' }]
        }
      ],
      order: [['examDate', 'DESC'], ['id', 'DESC']]
    });

    if (search) {
      const q = search.trim().toLowerCase();
      exams = exams.filter(e =>
        (e.titleBn && e.titleBn.toLowerCase().includes(q)) ||
        (e.titleEn && e.titleEn.toLowerCase().includes(q)) ||
        (e.subject?.nameBn && e.subject.nameBn.toLowerCase().includes(q)) ||
        (e.class?.nameBn && e.class.nameBn.toLowerCase().includes(q))
      );
    }

    // If student, check if they have submitted and mask MCQ answers for pending exams
    let studentId = null;
    if (req.user.role === 'STUDENT') {
      const student = await Student.findOne({ where: { userId: req.user.id } });
      studentId = student?.id;
    }

    const allSubmissions = await ExamSubmission.findAll();

    const result = exams.map(exam => {
      const examObj = { ...exam };
      const submissions = allSubmissions.filter(s => s.examId === exam.id);
      examObj.submissionCount = submissions.length;

      if (studentId) {
        const mySub = submissions.find(s => s.studentId === studentId);
        examObj.mySubmission = mySub || null;
        examObj.hasSubmitted = !!mySub;

        // If not submitted and is student, mask correct answers
        if (!mySub && Array.isArray(examObj.questions)) {
          examObj.questions = examObj.questions.map(q => {
            const { correctOptionIndex, correctAnswer, explanation, ...rest } = q;
            return rest;
          });
        }
      }
      return examObj;
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
 * GET /api/exams/student/:studentId
 * Get exams and results for a specific student (For Student & Parent portal)
 */
router.get('/student/:studentId', authenticate, async (req, res, next) => {
  try {
    const studentId = Number(req.params.studentId);
    const student = await Student.findOne({
      where: { id: studentId },
      include: [{ model: Class, as: 'class' }]
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        error: { code: 'STUDENT_NOT_FOUND', message: 'শিক্ষার্থী পাওয়া যায়নি' }
      });
    }

    const exams = await Exam.findAll({
      where: { classId: student.classId },
      include: [
        { model: Class, as: 'class' },
        { model: Subject, as: 'subject' },
        {
          model: Teacher,
          as: 'teacher',
          include: [{ model: User, as: 'user' }]
        }
      ],
      order: [['examDate', 'DESC']]
    });

    const mySubmissions = await ExamSubmission.findAll({
      where: { studentId }
    });

    const enrichedExams = exams.map(exam => {
      const sub = mySubmissions.find(s => s.examId === exam.id);
      const examObj = { ...exam, mySubmission: sub || null, hasSubmitted: !!sub };

      if (!sub && Array.isArray(examObj.questions)) {
        examObj.questions = examObj.questions.map(q => {
          const { correctOptionIndex, correctAnswer, explanation, ...rest } = q;
          return rest;
        });
      }
      return examObj;
    });

    const totalExams = enrichedExams.length;
    const completedExams = mySubmissions.length;
    const passedExams = mySubmissions.filter(s => s.passed).length;
    const avgScore = mySubmissions.length > 0
      ? Math.round(mySubmissions.reduce((acc, s) => acc + (s.percentage || 0), 0) / mySubmissions.length)
      : 0;

    res.json({
      success: true,
      data: {
        student,
        summary: {
          totalExams,
          completedExams,
          passedExams,
          avgScore
        },
        exams: enrichedExams
      }
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/exams/:id
 * Get single exam details
 */
router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const exam = await Exam.findOne({
      where: { id: Number(req.params.id) },
      include: [
        { model: Class, as: 'class' },
        { model: Subject, as: 'subject' },
        {
          model: Teacher,
          as: 'teacher',
          include: [{ model: User, as: 'user' }]
        }
      ]
    });

    if (!exam) {
      return res.status(404).json({
        success: false,
        error: { code: 'EXAM_NOT_FOUND', message: 'পরীক্ষা পাওয়া যায়নি' }
      });
    }

    const examObj = { ...exam };

    if (req.user.role === 'STUDENT') {
      const student = await Student.findOne({ where: { userId: req.user.id } });
      const sub = student ? await ExamSubmission.findOne({
        where: { examId: exam.id, studentId: student.id }
      }) : null;

      examObj.mySubmission = sub || null;
      examObj.hasSubmitted = !!sub;

      if (!sub && Array.isArray(examObj.questions)) {
        examObj.questions = examObj.questions.map(q => {
          const { correctOptionIndex, correctAnswer, explanation, ...rest } = q;
          return rest;
        });
      }
    }

    res.json({
      success: true,
      data: examObj
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/exams
 * Create new online exam (MCQ / Written)
 */
router.post('/', authenticate, requireRole(['ADMIN', 'TEACHER']), async (req, res, next) => {
  try {
    const {
      titleBn,
      titleEn,
      classId,
      subjectId,
      type,
      examDate,
      startTime,
      durationMinutes,
      totalMarks,
      passMarks,
      instructions,
      questions,
      questionFileUrl
    } = req.body;

    if (!titleBn || !classId || !subjectId || !examDate) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'পরীক্ষার নাম, শ্রেণি, বিষয় ও তারিখ আবশ্যক' }
      });
    }

    let teacherId = null;
    if (req.user.role === 'TEACHER') {
      const teacher = await Teacher.findOne({ where: { userId: req.user.id } });
      teacherId = teacher?.id || null;
    }

    const createdExam = await Exam.create({
      titleBn,
      titleEn: titleEn || titleBn,
      classId: Number(classId),
      subjectId: Number(subjectId),
      teacherId,
      type: type || 'MCQ',
      examDate,
      startTime: startTime || '10:00 AM',
      durationMinutes: Number(durationMinutes) || 30,
      totalMarks: Number(totalMarks) || (Array.isArray(questions) ? questions.reduce((acc, q) => acc + (q.marks || 1), 0) : 20),
      passMarks: Number(passMarks) || Math.round((Number(totalMarks) || 20) * 0.4),
      instructions: instructions || 'সকল প্রশ্নের উত্তর দেওয়ার চেষ্টা করো। সময় শেষ হওয়ার পূর্বেই সাবমিট করো।',
      questions: Array.isArray(questions) ? questions : [],
      questionFileUrl: questionFileUrl || null,
      status: 'ACTIVE',
      createdByUserId: req.user.id,
      createdAt: new Date().toISOString()
    });

    const fullExam = await Exam.findOne({
      where: { id: createdExam.id },
      include: [
        { model: Class, as: 'class' },
        { model: Subject, as: 'subject' }
      ]
    });

    await AuditService.log({
      req,
      userId: req.user.id,
      action: 'CREATE_ONLINE_EXAM',
      entityType: 'exam',
      entityId: String(createdExam.id),
      details: `${req.user.name} নতুন পরীক্ষা তৈরি করেছেন: "${titleBn}" (${type})`
    });

    res.status(201).json({
      success: true,
      message: 'অনলাইন পরীক্ষা সফলভাবে তৈরি করা হয়েছে!',
      data: fullExam
    });
  } catch (err) {
    next(err);
  }
});

/**
 * PUT /api/exams/:id
 * Update exam details / questions
 */
router.put('/:id', authenticate, requireRole(['ADMIN', 'TEACHER']), async (req, res, next) => {
  try {
    const examId = Number(req.params.id);
    const existing = await Exam.findOne({ where: { id: examId } });
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: { code: 'EXAM_NOT_FOUND', message: 'পরীক্ষা পাওয়া যায়নি' }
      });
    }

    const {
      titleBn,
      titleEn,
      classId,
      subjectId,
      type,
      examDate,
      startTime,
      durationMinutes,
      totalMarks,
      passMarks,
      instructions,
      questions,
      questionFileUrl,
      status
    } = req.body;

    await Exam.update({
      titleBn: titleBn || existing.titleBn,
      titleEn: titleEn || existing.titleEn,
      classId: classId ? Number(classId) : existing.classId,
      subjectId: subjectId ? Number(subjectId) : existing.subjectId,
      type: type || existing.type,
      examDate: examDate || existing.examDate,
      startTime: startTime || existing.startTime,
      durationMinutes: durationMinutes ? Number(durationMinutes) : existing.durationMinutes,
      totalMarks: totalMarks ? Number(totalMarks) : existing.totalMarks,
      passMarks: passMarks ? Number(passMarks) : existing.passMarks,
      instructions: instructions !== undefined ? instructions : existing.instructions,
      questions: Array.isArray(questions) ? questions : existing.questions,
      questionFileUrl: questionFileUrl !== undefined ? questionFileUrl : existing.questionFileUrl,
      status: status || existing.status
    }, { where: { id: examId } });

    const updated = await Exam.findOne({
      where: { id: examId },
      include: [
        { model: Class, as: 'class' },
        { model: Subject, as: 'subject' }
      ]
    });

    await AuditService.log({
      req,
      userId: req.user.id,
      action: 'UPDATE_ONLINE_EXAM',
      entityType: 'exam',
      entityId: String(examId),
      details: `${req.user.name} পরীক্ষা আপডেট করেছেন: "${updated.titleBn}"`
    });

    res.json({
      success: true,
      message: 'পরীক্ষার তথ্য আপডেট করা হয়েছে!',
      data: updated
    });
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /api/exams/:id
 * Delete an exam and its submissions
 */
router.delete('/:id', authenticate, requireRole(['ADMIN', 'TEACHER']), async (req, res, next) => {
  try {
    const examId = Number(req.params.id);
    const existing = await Exam.findOne({ where: { id: examId } });
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: { code: 'EXAM_NOT_FOUND', message: 'পরীক্ষা পাওয়া যায়নি' }
      });
    }

    await Exam.destroy({ where: { id: examId } });
    await ExamSubmission.destroy({ where: { examId } });

    await AuditService.log({
      req,
      userId: req.user.id,
      action: 'DELETE_ONLINE_EXAM',
      entityType: 'exam',
      entityId: String(examId),
      details: `${req.user.name} পরীক্ষা মুছে ফেলেছেন: "${existing.titleBn}"`
    });

    res.json({
      success: true,
      message: 'পরীক্ষা সফলভাবে মুছে ফেলা হয়েছে!'
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/exams/:id/submit
 * Student Exam Submission (Instant Auto-Grading for MCQ)
 */
router.post('/:id/submit', authenticate, requireRole(['STUDENT', 'ADMIN', 'TEACHER']), async (req, res, next) => {
  try {
    const examId = Number(req.params.id);
    const exam = await Exam.findOne({ where: { id: examId } });
    if (!exam) {
      return res.status(404).json({
        success: false,
        error: { code: 'EXAM_NOT_FOUND', message: 'পরীক্ষা পাওয়া যায়নি' }
      });
    }

    let student = await Student.findOne({ where: { userId: req.user.id } });
    if (!student) {
      student = await Student.findOne();
    }
    const studentId = student?.id || 1;

    const existingSub = await ExamSubmission.findOne({
      where: { examId, studentId: studentId }
    });

    if (existingSub) {
      return res.status(400).json({
        success: false,
        error: { code: 'ALREADY_SUBMITTED', message: 'আপনি ইতিমধ্যে এই পরীক্ষা সম্পন্ন করেছেন!' }
      });
    }

    const { studentAnswers, submissionUrl, submissionText } = req.body;

    let obtainedScore = 0;
    let totalScore = exam.totalMarks || 20;
    let detailedEvaluations = [];
    let isGraded = false;
    let passed = false;

    if (exam.type === 'MCQ') {
      isGraded = true;
      const questions = Array.isArray(exam.questions) ? exam.questions : [];

      questions.forEach((q, idx) => {
        const studentAns = Array.isArray(studentAnswers)
          ? studentAnswers.find(a => Number(a.questionId) === Number(q.id || idx + 1))
          : null;

        const chosenIndex = studentAns ? Number(studentAns.selectedOption) : -1;
        const correctIndex = Number(q.correctOptionIndex !== undefined ? q.correctOptionIndex : q.correctAnswer);
        const marks = Number(q.marks) || 1;
        const isCorrect = chosenIndex === correctIndex;

        if (isCorrect) {
          obtainedScore += marks;
        }

        detailedEvaluations.push({
          questionId: q.id || idx + 1,
          questionBn: q.questionBn || q.question || `প্রশ্ন ${idx + 1}`,
          topic: q.topic || q.chapterTopic || exam.titleBn,
          options: q.options,
          chosenIndex,
          correctIndex,
          isCorrect,
          marks: isCorrect ? marks : 0,
          maxMarks: marks,
          explanation: q.explanation || ''
        });
      });

      // Negative Marking & Cut-off Analysis
      const wrongCount = detailedEvaluations.filter(e => !e.isCorrect && e.chosenIndex !== -1).length;
      const unattemptedCount = detailedEvaluations.filter(e => e.chosenIndex === -1).length;
      const correctCount = detailedEvaluations.filter(e => e.isCorrect).length;
      const negativePenalty = 0.25;
      const negativeLoss = Number((wrongCount * negativePenalty).toFixed(2));
      const netScore = Math.max(0, Number((obtainedScore - negativeLoss).toFixed(2)));

      // Expected Cut-off calculation (65% for standard board exam, or passMarks * 1.5)
      const expectedCutOff = Math.round(totalScore * 0.65);
      const isAboveCutOff = netScore >= expectedCutOff;

      // Identify Top Weakest Topics
      const wrongQuestions = detailedEvaluations.filter(e => !e.isCorrect);
      const weakTopicsMap = {};
      wrongQuestions.forEach(q => {
        const topicKey = q.topic || (q.questionBn ? q.questionBn.slice(0, 30) : 'সাধারণ বিষয়');
        weakTopicsMap[topicKey] = (weakTopicsMap[topicKey] || 0) + 1;
      });

      const sortedWeakTopics = Object.entries(weakTopicsMap)
        .sort((a, b) => b[1] - a[1])
        .map(([t]) => t);

      const topWeakTopics = sortedWeakTopics.length > 0
        ? sortedWeakTopics.slice(0, 2)
        : [exam.subject?.nameBn || exam.titleBn || 'পদার্থবিজ্ঞান'];

      const percentage = totalScore > 0 ? Math.round((netScore / totalScore) * 100) : 0;
      passed = netScore >= (exam.passMarks || totalScore * 0.4);

      const submission = await ExamSubmission.create({
        examId,
        studentId: studentId,
        studentAnswers: detailedEvaluations,
        submissionUrl: null,
        submissionText: null,
        totalScore,
        obtainedScore: netScore,
        grossScore: obtainedScore,
        negativeLoss,
        expectedCutOff,
        isAboveCutOff,
        weakTopics: topWeakTopics,
        wrongCount,
        correctCount,
        unattemptedCount,
        percentage,
        passed,
        submittedAt: new Date().toISOString(),
        evaluatedAt: new Date().toISOString(),
        evaluatedByTeacherId: null,
        teacherFeedback: passed ? 'চমৎকার ফলাফল! অভিনন্দন।' : 'আরও মনোযোগ ও অনুশীলনের প্রয়োজন।',
        status: 'GRADED'
      });

      await AuditService.log({
        req,
        userId: req.user.id,
        action: 'SUBMIT_MCQ_EXAM',
        entityType: 'exam_submission',
        entityId: String(submission.id),
        details: `${req.user.name} "${exam.titleBn}" MCQ পরীক্ষা সম্পন্ন করেছেন (নেট স্কোর: ${netScore}/${totalScore})`
      });

      return res.status(201).json({
        success: true,
        message: 'MCQ পরীক্ষা সম্পন্ন হয়েছে! তাৎক্ষণিক মূল্যায়ন ও কাট-অফ অ্যানালাইসিস নিচে প্রদর্শিত হলো:',
        data: {
          submissionId: submission.id,
          examTitle: exam.titleBn,
          totalScore,
          obtainedScore: netScore,
          grossScore: obtainedScore,
          negativeLoss,
          expectedCutOff,
          isAboveCutOff,
          weakTopics: topWeakTopics,
          wrongCount,
          correctCount,
          unattemptedCount,
          percentage,
          passed,
          detailedEvaluations,
          submittedAt: submission.submittedAt
        }
      });
    } else {
      // Written Exam Submission
      const submission = await ExamSubmission.create({
        examId,
        studentId: student.id,
        studentAnswers: [],
        submissionUrl: submissionUrl || null,
        submissionText: submissionText || null,
        totalScore,
        obtainedScore: 0,
        percentage: 0,
        passed: false,
        submittedAt: new Date().toISOString(),
        evaluatedAt: null,
        evaluatedByTeacherId: null,
        teacherFeedback: null,
        status: 'SUBMITTED'
      });

      await AuditService.log({
        req,
        userId: req.user.id,
        action: 'SUBMIT_WRITTEN_EXAM',
        entityType: 'exam_submission',
        entityId: String(submission.id),
        details: `${req.user.name} "${exam.titleBn}" লিখিত উত্তরপত্র জমা দিয়েছেন`
      });

      return res.status(201).json({
        success: true,
        message: 'লিখিত উত্তরপত্র সফলভাবে জমা হয়েছে! শিক্ষক মূল্যায়ন সম্পন্ন করার পর ফলাফল দেখতে পাবেন।',
        data: submission
      });
    }
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/exams/:id/submissions
 * Get all student submissions for an exam (For Teachers/Admin)
 */
router.get('/:id/submissions', authenticate, requireRole(['ADMIN', 'TEACHER']), async (req, res, next) => {
  try {
    const examId = Number(req.params.id);
    const submissions = await ExamSubmission.findAll({
      where: { examId },
      include: [
        {
          model: Student,
          as: 'student',
          include: [{ model: User, as: 'user' }, { model: Class, as: 'class' }]
        }
      ],
      order: [['submittedAt', 'DESC']]
    });

    res.json({
      success: true,
      data: submissions
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/exams/:id/leaderboard
 * Get Top-scoring Leaderboard for an MCQ or Model Test Exam
 */
router.get('/:id/leaderboard', authenticate, async (req, res, next) => {
  try {
    const examId = Number(req.params.id);
    const exam = await Exam.findOne({ where: { id: examId } });
    if (!exam) {
      return res.status(404).json({
        success: false,
        error: { code: 'EXAM_NOT_FOUND', message: 'পরীক্ষা পাওয়া যায়নি' }
      });
    }

    const submissions = await ExamSubmission.findAll({ where: { examId } });
    const allStudents = await Student.findAll({
      include: [
        { model: User, as: 'user' },
        { model: Class, as: 'class' }
      ]
    });

    // Sort by highest score first, then earliest submission time
    const sorted = [...submissions].sort((a, b) => {
      if (b.obtainedScore !== a.obtainedScore) {
        return (b.obtainedScore || 0) - (a.obtainedScore || 0);
      }
      return new Date(a.submittedAt || 0) - new Date(b.submittedAt || 0);
    });

    const leaderboard = sorted.map((s, idx) => {
      const st = allStudents.find(st => st.id === s.studentId);
      return {
        rank: idx + 1,
        studentId: s.studentId,
        studentName: st?.user?.name || s.student?.user?.name || `শিক্ষার্থী #${s.studentId}`,
        rollNo: st?.rollNo || s.student?.rollNo || '-',
        className: st?.class?.nameBn || st?.class?.nameEn || '',
        sectionName: st?.section?.nameBn || '',
        obtainedScore: s.obtainedScore || 0,
        totalScore: s.totalScore || exam.totalMarks || 10,
        percentage: s.percentage || 0,
        passed: !!s.passed,
        submittedAt: s.submittedAt || new Date().toISOString(),
        timeTaken: s.timeTaken || null,
        avatar: st?.user?.avatar || null
      };
    });

    res.json({
      success: true,
      data: {
        examId: exam.id,
        examTitle: exam.titleBn || exam.titleEn,
        totalMarks: exam.totalMarks,
        totalParticipants: leaderboard.length,
        leaderboard
      }
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/exams/:id/grade/:submissionId
 * Grade a student's written submission
 */
router.post('/:id/grade/:submissionId', authenticate, requireRole(['ADMIN', 'TEACHER']), async (req, res, next) => {
  try {
    const examId = Number(req.params.id);
    const submissionId = Number(req.params.submissionId);

    const exam = await Exam.findOne({ where: { id: examId } });
    const submission = await ExamSubmission.findOne({ where: { id: submissionId, examId } });

    if (!exam || !submission) {
      return res.status(404).json({
        success: false,
        error: { code: 'SUBMISSION_NOT_FOUND', message: 'সাবমিশন রেকর্ড পাওয়া যায়নি' }
      });
    }

    const { obtainedScore, teacherFeedback } = req.body;
    const score = Number(obtainedScore);
    const total = exam.totalMarks || 20;
    const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
    const passed = score >= (exam.passMarks || total * 0.4);

    let teacherId = null;
    if (req.user.role === 'TEACHER') {
      const teacher = await Teacher.findOne({ where: { userId: req.user.id } });
      teacherId = teacher?.id || null;
    }

    await ExamSubmission.update({
      obtainedScore: score,
      percentage,
      passed,
      status: 'GRADED',
      evaluatedAt: new Date().toISOString(),
      evaluatedByTeacherId: teacherId,
      teacherFeedback: teacherFeedback || 'খাতা মূল্যায়ন সম্পন্ন।'
    }, { where: { id: submissionId } });

    await AuditService.log({
      req,
      userId: req.user.id,
      action: 'GRADE_WRITTEN_EXAM',
      entityType: 'exam_submission',
      entityId: String(submissionId),
      details: `${req.user.name} লিখিত পরীক্ষার খাতা মূল্যায়ন করেছেন: প্রাপ্ত নম্বর ${score}/${total}`
    });

    res.json({
      success: true,
      message: 'খাতা মূল্যায়ন সফলভাবে সংরক্ষণ করা হয়েছে!',
      data: {
        submissionId,
        obtainedScore: score,
        percentage,
        passed,
        teacherFeedback
      }
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/exams/generate-mcq
 * AI-Powered Automated MCQ Question Generator for Teachers & Admins
 */
const { generateMCQs } = require('../services/mcqAiGeneratorService');

router.post('/generate-mcq', authenticate, requireRole(['ADMIN', 'TEACHER']), async (req, res, next) => {
  try {
    const { topic, subject, classGrade, difficulty, questionCount, chapterNotes } = req.body;

    if (!topic && !chapterNotes && !subject) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'অধ্যায়/টপিকের নাম অথবা বিষয় উল্লেখ করা আবশ্যক' }
      });
    }

    const result = await generateMCQs({
      topic,
      subject,
      classGrade,
      difficulty: difficulty || 'MEDIUM',
      questionCount: Number(questionCount) || 10,
      chapterNotes
    });

    await AuditService.log({
      req,
      userId: req.user.id,
      action: 'AI_GENERATE_MCQ',
      entityType: 'exam_mcq_ai',
      details: `${req.user.name} এআই দিয়ে ${result.questions.length}টি বহুনির্বাচনী প্রশ্ন জেনারেট করেছেন (টপিক: "${topic || subject}")`
    });

    res.json({
      success: true,
      message: `সফলভাবে ${result.questions.length}টি বহুনির্বাচনী প্রশ্ন প্রস্তুত হয়েছে!`,
      source: result.source,
      data: result.questions
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/exams/generate-cq
 * AI-Powered Creative Question (CQ / সৃজনশীল প্রশ্ন) Generator for Teachers & Admins
 */
const { generateCreativeQuestions } = require('../services/cqAiGeneratorService');

router.post('/generate-cq', authenticate, requireRole(['ADMIN', 'TEACHER']), async (req, res, next) => {
  try {
    const { subject, classGrade, chapterTopic, difficulty, questionCount, chapterNotes } = req.body;

    if (!chapterTopic && !chapterNotes && !subject) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'অধ্যায়/টপিকের নাম অথবা বিষয় উল্লেখ করা আবশ্যক' }
      });
    }

    const result = await generateCreativeQuestions({
      subject,
      classGrade,
      chapterTopic,
      difficulty: difficulty || 'MEDIUM',
      questionCount: Number(questionCount) || 2,
      chapterNotes
    });

    await AuditService.log({
      req,
      userId: req.user.id,
      action: 'AI_GENERATE_CQ',
      entityType: 'exam_cq_ai',
      details: `${req.user.name} এআই দিয়ে ${result.questions.length}টি সৃজনশীল প্রশ্ন জেনারেট করেছেন (টপিক: "${chapterTopic || subject}")`
    });

    res.json({
      success: true,
      message: `সফলভাবে ${result.questions.length}টি সৃজনশীল প্রশ্ন প্রস্তুত হয়েছে!`,
      source: result.source,
      data: result.questions
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
