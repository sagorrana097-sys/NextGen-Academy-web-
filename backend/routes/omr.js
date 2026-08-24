const express = require('express');
const {
  Mark, ExamTerm, Subject, Student, Class, Section, Batch, User
} = require('../models');
const { authenticate, requireRole } = require('../middleware/auth');
const AuditService = require('../services/auditService');
const router = express.Router();

function calculateGrade(marks) {
  const m = Number(marks) || 0;
  if (m >= 80) return { gradePoint: 5.0, letterGrade: 'A+' };
  if (m >= 70) return { gradePoint: 4.0, letterGrade: 'A' };
  if (m >= 60) return { gradePoint: 3.5, letterGrade: 'A-' };
  if (m >= 50) return { gradePoint: 3.0, letterGrade: 'B' };
  if (m >= 40) return { gradePoint: 2.0, letterGrade: 'C' };
  if (m >= 33) return { gradePoint: 1.0, letterGrade: 'D' };
  return { gradePoint: 0.0, letterGrade: 'F' };
}

// POST /api/omr/import
router.post('/import', authenticate, requireRole('ADMIN', 'SUPER_ADMIN'), async (req, res, next) => {
  try {
    const { examTermId, subjectId, classId, rows, examLabel } = req.body;
    if (!examTermId || !subjectId || !classId || !Array.isArray(rows) || rows.length === 0) {
      return res.status(400).json({ success: false, error: { message: 'পরীক্ষা, বিষয়, শ্রেণি ও OMR ডেটা আবশ্যক' } });
    }
    const termId = Number(examTermId), subId = Number(subjectId), clsId = Number(classId);
    const students = await Student.findAll({ where: { classId: clsId }, include: [{ model: User, as: 'user' }] });
    const rollMap = new Map();
    students.forEach(st => { if (st.rollNo) rollMap.set(String(st.rollNo).trim(), st); });
    let savedCount = 0;
    const notFoundRolls = [];
    for (const row of rows) {
      const rollNo = String(row.rollNo || row.roll || '').trim();
      const correctAnswers = Number(row.correctAnswers || row.correct || 0);
      const wrongAnswers = Number(row.wrongAnswers || row.wrong || 0);
      const totalMarks = row.totalMarks !== undefined ? Number(row.totalMarks) : Math.max(0, correctAnswers - Math.floor(wrongAnswers * 0.25));
      const student = rollMap.get(rollNo);
      if (!student) { notFoundRolls.push(rollNo); continue; }
      const { gradePoint, letterGrade } = calculateGrade(totalMarks);
      const markData = { mcqMarks: totalMarks, cqMarks: 0, practicalMarks: 0, obtainedMarks: totalMarks, gradePoint, letterGrade, teacherRemarks: `OMR: correct=${correctAnswers}, wrong=${wrongAnswers}`, submittedByUserId: req.user.id };
      const existing = await Mark.findOne({ where: { studentId: student.id, examTermId: termId, subjectId: subId } });
      if (existing) { await existing.update(markData); } else { await Mark.create({ studentId: student.id, examTermId: termId, subjectId: subId, ...markData }); }
      savedCount++;
    }
    await AuditService.log({ userId: req.user.id, action: 'OMR_IMPORT', resourceType: 'Mark', resourceId: subId, ipAddress: req.ip, metadata: { examTermId: termId, subjectId: subId, classId: clsId, savedCount, notFoundRolls, examLabel } });
    res.json({ success: true, data: { savedCount, totalRows: rows.length, notFoundRolls, message: `${savedCount}টি শিক্ষার্থীর OMR ফলাফল সফলভাবে আমদানি হয়েছে!` } });
  } catch (err) { next(err); }
});

// GET /api/omr/leaderboard
router.get('/leaderboard', authenticate, async (req, res, next) => {
  try {
    const { examTermId, classId, subjectId, studentId } = req.query;
    if (!examTermId || !classId) return res.status(400).json({ success: false, error: { message: 'পরীক্ষা ও শ্রেণি নির্বাচন আবশ্যক' } });
    const termId = Number(examTermId), clsId = Number(classId);
    const students = await Student.findAll({ where: { classId: clsId }, include: [{ model: User, as: 'user' }, { model: Section, as: 'section' }, { model: Batch, as: 'batch' }] });
    const markWhere = { examTermId: termId };
    if (subjectId) markWhere.subjectId = Number(subjectId);
    const marks = await Mark.findAll({ where: markWhere });
    const studentScores = students.map(st => {
      const sm = marks.filter(m => Number(m.studentId) === Number(st.id));
      const totalObtained = sm.reduce((s, m) => s + (Number(m.obtainedMarks) || 0), 0);
      const avg = sm.length > 0 ? Math.round(totalObtained / sm.length) : 0;
      const { gradePoint, letterGrade } = calculateGrade(avg);
      return { studentId: st.id, rollNo: st.rollNo, studentIdNumber: st.studentIdNumber || `STD-${st.id}`, name: st.user ? st.user.name : 'শিক্ষার্থী', photo: st.user ? st.user.profilePhoto : null, sectionName: st.section ? st.section.nameBn : '', batchName: st.batch ? st.batch.nameBn : '', totalObtained, subjectCount: sm.length, gradePoint, letterGrade };
    });
    studentScores.sort((a, b) => b.totalObtained !== a.totalObtained ? b.totalObtained - a.totalObtained : Number(a.rollNo) - Number(b.rollNo));
    studentScores.forEach((st, i) => { st.rank = i + 1; });
    let myRank = null, myScore = null;
    if (studentId) { const me = studentScores.find(s => Number(s.studentId) === Number(studentId)); if (me) { myRank = me.rank; myScore = me; } }
    const examTerm = await ExamTerm.findByPk(termId);
    const selectedClass = await Class.findByPk(clsId);
    res.json({ success: true, data: { examTerm, class: selectedClass, leaderboard: studentScores.slice(0, 10), totalParticipants: studentScores.length, myRank, myScore } });
  } catch (err) { next(err); }
});

module.exports = router;
