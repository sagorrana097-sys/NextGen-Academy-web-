const express = require('express');
const { Class, Section, Subject } = require('../models');

const router = express.Router();

/**
 * GET /api/classes
 * Returns all institutional classes from Pre-Primary to HSC with sections and subjects
 */
router.get('/classes', async (req, res, next) => {
  try {
    const classes = await Class.findAll({
      include: [
        { model: Section, as: 'sections' },
        { model: Subject, as: 'subjects' }
      ],
      order: [['numericGrade', 'ASC']]
    });

    res.json({
      success: true,
      data: classes
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/subjects
 * Returns subjects for a specific class or all subjects
 */
router.get('/subjects', async (req, res, next) => {
  try {
    const { classId } = req.query;
    const where = {};
    if (classId) where.classId = Number(classId);

    const subjects = await Subject.findAll({
      where,
      include: [{ model: Class, as: 'class' }],
      order: [['id', 'ASC']]
    });

    res.json({
      success: true,
      data: subjects
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
