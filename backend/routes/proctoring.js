const express = require('express');
const { authenticate } = require('../middleware/auth');
const SMSService = require('../services/smsService');
const { Student } = require('../models');

const router = express.Router();

/**
 * POST /api/proctoring/event
 * Dispatches automated proctoring SMS notifications with anti-spam cooldown
 * Body: { eventType: 'EXAM_START' | 'EXAM_ABANDON' | 'CLASS_JOIN' | 'TAB_SWITCH', examName, className, studentId }
 */
router.post('/event', authenticate, async (req, res, next) => {
  try {
    const { eventType, examName, className } = req.body;
    let studentId = req.body.studentId;

    if (!studentId && req.user) {
      const st = await Student.findOne({ where: { userId: req.user.id } });
      studentId = st ? st.id : req.user.id;
    }

    if (!eventType || !studentId) {
      return res.status(400).json({
        success: false,
        error: { message: 'ইভেন্ট টাইপ এবং শিক্ষার্থী আইডি আবশ্যক।' }
      });
    }

    const result = await SMSService.sendProctoringSMS({
      studentId,
      eventType,
      examName: examName || 'মডেল টেস্ট',
      className: className || '',
      req
    });

    res.json({
      success: true,
      data: result
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
