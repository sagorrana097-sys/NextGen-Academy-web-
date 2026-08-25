const express = require('express');
const { Class, Section, Subject } = require('../models');

const router = express.Router();

/**
 * GET /api/classes and /api/curriculum/classes
 * Returns all institutional classes from Pre-Primary to HSC with sections and subjects
 */
router.get(['/classes', '/curriculum/classes'], async (req, res, next) => {
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
 * Subject Handler for /subjects, /subjects?classId=11, /subjectsClassId=11, /curriculum/subjects, etc.
 */
const handleGetSubjects = async (req, res, next) => {
  try {
    let rawClassId = req.query.classId || req.params.classId;
    if (!rawClassId && req.path.includes('ClassId=')) {
      rawClassId = req.path.split('ClassId=')[1];
    } else if (!rawClassId && req.path.includes('classId=')) {
      rawClassId = req.path.split('classId=')[1];
    }

    const where = {};
    if (rawClassId && !isNaN(Number(rawClassId))) {
      where.classId = Number(rawClassId);
    }

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
};

router.get('/subjects', handleGetSubjects);
router.get('/curriculum/subjects', handleGetSubjects);
router.get('/subjectsClassId=:classId', handleGetSubjects);
router.get('/curriculum/subjectsClassId=:classId', handleGetSubjects);
router.get('/subjects/class/:classId', handleGetSubjects);
router.get('/subjects/:classId', (req, res, next) => {
  if (!isNaN(Number(req.params.classId))) {
    return handleGetSubjects(req, res, next);
  }
  next();
});

module.exports = router;
