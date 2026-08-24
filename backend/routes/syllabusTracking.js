const express = require('express');
const { SyllabusTracking } = require('../models');
const { authenticate, requireRole } = require('../middleware/auth');

const router = express.Router();

/**
 * Standard NCTB Default Curriculum Blueprint for Auto-Seeding
 */
const DEFAULT_CURRICULUM_SEEDS = {
  'Class 9': [
    // General Math
    { subject: 'সাধারণ গণিত (General Math)', chapter_no: 1, chapter_name: '১ম অধ্যায়: বাস্তব সংখ্যা (Real Numbers)', is_completed: true },
    { subject: 'সাধারণ গণিত (General Math)', chapter_no: 2, chapter_name: '২য় অধ্যায়: সেট ও ফাংশন (Set & Function)', is_completed: true },
    { subject: 'সাধারণ গণিত (General Math)', chapter_no: 3, chapter_name: '৩য় অধ্যায়: বীজগাণিতিক রাশি (Algebraic Expressions)', is_completed: true },
    { subject: 'সাধারণ গণিত (General Math)', chapter_no: 4, chapter_name: '৪র্থ অধ্যায়: সূচক ও লগারিদম (Exponents & Logarithms)', is_completed: false },
    { subject: 'সাধারণ গণিত (General Math)', chapter_no: 5, chapter_name: '৫ম অধ্যায়: এক চলকবিশিষ্ট সমীকরণ', is_completed: false },
    { subject: 'সাধারণ গণিত (General Math)', chapter_no: 7, chapter_name: '৭ম অধ্যায়: ব্যবহারিক জ্যামিতি (Practical Geometry)', is_completed: false },
    { subject: 'সাধারণ গণিত (General Math)', chapter_no: 8, chapter_name: '৮ম অধ্যায়: বৃত্ত (Circle)', is_completed: false },
    { subject: 'সাধারণ গণিত (General Math)', chapter_no: 9, chapter_name: '৯ম অধ্যায়: ত্রিকোণমিতিক অনুপাত (Trigonometry)', is_completed: false },
    { subject: 'সাধারণ গণিত (General Math)', chapter_no: 16, chapter_name: '১৬শ অধ্যায়: পরিমিতি (Mensuration)', is_completed: false },
    { subject: 'সাধারণ গণিত (General Math)', chapter_no: 17, chapter_name: '১৭শ অধ্যায়: পরিসংখ্যান (Statistics)', is_completed: false },

    // Higher Math
    { subject: 'উচ্চতর গণিত (Higher Math)', chapter_no: 1, chapter_name: '১ম অধ্যায়: সেট ও ফাংশন', is_completed: true },
    { subject: 'উচ্চতর গণিত (Higher Math)', chapter_no: 2, chapter_name: '২য় অধ্যায়: বীজগাণিতিক রাশি', is_completed: true },
    { subject: 'উচ্চতর গণিত (Higher Math)', chapter_no: 3, chapter_name: '৩য় অধ্যায়: জ্যামিতি (আপোলোনিয়াস উপপাদ্য)', is_completed: false },
    { subject: 'উচ্চতর গণিত (Higher Math)', chapter_no: 7, chapter_name: '৭ম অধ্যায়: অসীম ধারা (Infinite Series)', is_completed: false },
    { subject: 'উচ্চতর গণিত (Higher Math)', chapter_no: 8, chapter_name: '৮ম অধ্যায়: ত্রিকোণমিতি (রেডিয়ান পরিমাপ)', is_completed: false },
    { subject: 'উচ্চতর গণিত (Higher Math)', chapter_no: 9, chapter_name: '৯ম অধ্যায়: সূচকীয় ও লগারিদমীয় ফাংশন', is_completed: false },
    { subject: 'উচ্চতর গণিত (Higher Math)', chapter_no: 10, chapter_name: '১০ম অধ্যায়: দ্বিপদী বিস্তার (Binomial Expansion)', is_completed: false },
    { subject: 'উচ্চতর গণিত (Higher Math)', chapter_no: 11, chapter_name: '১১শ অধ্যায়: স্থানাঙ্ক জ্যামিতি (Coordinate Geometry)', is_completed: false },

    // Physics
    { subject: 'পদার্থবিজ্ঞান (Physics)', chapter_no: 1, chapter_name: '১ম অধ্যায়: ভৌত রাশি ও পরিমাপ (Physical Quantities)', is_completed: true },
    { subject: 'পদার্থবিজ্ঞান (Physics)', chapter_no: 2, chapter_name: '২য় অধ্যায়: গতি (Motion & Equations)', is_completed: true },
    { subject: 'পদার্থবিজ্ঞান (Physics)', chapter_no: 3, chapter_name: '৩য় অধ্যায়: বল (Force & Newton\'s Laws)', is_completed: true },
    { subject: 'পদার্থবিজ্ঞান (Physics)', chapter_no: 4, chapter_name: '৪র্থ অধ্যায়: কাজ, ক্ষমতা ও শক্তি (Work, Power & Energy)', is_completed: false },
    { subject: 'পদার্থবিজ্ঞান (Physics)', chapter_no: 5, chapter_name: '৫ম অধ্যায়: পদার্থের অবস্থা ও চাপ (Pressure & Archimedes)', is_completed: false },
    { subject: 'পদার্থবিজ্ঞান (Physics)', chapter_no: 6, chapter_name: '৬ষ্ঠ অধ্যায়: বস্তুর উপর তাপের প্রভাব (Heat & Expansion)', is_completed: false },
    { subject: 'পদার্থবিজ্ঞান (Physics)', chapter_no: 7, chapter_name: '৭ম অধ্যায়: তরঙ্গ ও শব্দ (Waves & Sound)', is_completed: false },
    { subject: 'পদার্থবিজ্ঞান (Physics)', chapter_no: 8, chapter_name: '৮ম অধ্যায়: আলোর প্রতিফলন (Reflection of Light)', is_completed: false },

    // Chemistry
    { subject: 'রসায়ন (Chemistry)', chapter_no: 1, chapter_name: '১ম অধ্যায়: রসায়নের ধারণা (Concepts of Chemistry)', is_completed: true },
    { subject: 'রসায়ন (Chemistry)', chapter_no: 2, chapter_name: '২য় অধ্যায়: পদার্থের অবস্থা (States of Matter)', is_completed: true },
    { subject: 'রসায়ন (Chemistry)', chapter_no: 3, chapter_name: '৩য় অধ্যায়: পদার্থের গঠন (Atomic Structure)', is_completed: false },
    { subject: 'রসায়ন (Chemistry)', chapter_no: 4, chapter_name: '৪র্থ অধ্যায়: পর্যায় সারণি (Periodic Table)', is_completed: false },
    { subject: 'রসায়ন (Chemistry)', chapter_no: 5, chapter_name: '৫ম অধ্যায়: রাসায়নিক বন্ধন (Chemical Bonding)', is_completed: false },
    { subject: 'রসায়ন (Chemistry)', chapter_no: 6, chapter_name: '৬ষ্ঠ অধ্যায়: মোলের ধারণা ও রাসায়নিক গণনা (Mole Concept)', is_completed: false },
    { subject: 'রসায়ন (Chemistry)', chapter_no: 7, chapter_name: '৭ম অধ্যায়: রাসায়নিক বিক্রিয়া (Chemical Reactions)', is_completed: false },

    // Biology
    { subject: 'জীববিজ্ঞান (Biology)', chapter_no: 1, chapter_name: '১ম অধ্যায়: জীবন পাঠ (Lessons of Life)', is_completed: true },
    { subject: 'জীববিজ্ঞান (Biology)', chapter_no: 2, chapter_name: '২য় অধ্যায়: জীবকোষ ও টিস্যু (Cells & Tissues)', is_completed: true },
    { subject: 'জীববিজ্ঞান (Biology)', chapter_no: 3, chapter_name: '৩য় অধ্যায়: কোষ বিভাজন (Cell Division)', is_completed: false },
    { subject: 'জীববিজ্ঞান (Biology)', chapter_no: 4, chapter_name: '৪র্থ অধ্যায়: জীবনীশক্তি (Bioenergetics & Photosynthesis)', is_completed: false },
    { subject: 'জীববিজ্ঞান (Biology)', chapter_no: 5, chapter_name: '৫ম অধ্যায়: খাদ্য, পুষ্টি ও পরিপাক (Nutrition & Digestion)', is_completed: false },
    { subject: 'জীববিজ্ঞান (Biology)', chapter_no: 6, chapter_name: '৬ষ্ঠ অধ্যায়: জীবে পরিবহন (Transport in Organisms)', is_completed: false },

    // ICT
    { subject: 'তথ্য ও যোগাযোগ প্রযুক্তি (ICT)', chapter_no: 1, chapter_name: '১ম অধ্যায়: তথ্য ও যোগাযোগ প্রযুক্তি এবং আমাদের বাংলাদেশ', is_completed: true },
    { subject: 'তথ্য ও যোগাযোগ প্রযুক্তি (ICT)', chapter_no: 2, chapter_name: '২য় অধ্যায়: কম্পিউটার ও ব্যবহারকারীর নিরাপত্তা', is_completed: true },
    { subject: 'তথ্য ও যোগাযোগ প্রযুক্তি (ICT)', chapter_no: 3, chapter_name: '৩য় অধ্যায়: আমার শিক্ষায় ইন্টারনেট', is_completed: false },
    { subject: 'তথ্য ও যোগাযোগ প্রযুক্তি (ICT)', chapter_no: 4, chapter_name: '৪র্থ অধ্যায়: আমার লেখালেখি ও হিসাব (Word & Excel)', is_completed: false },
    { subject: 'তথ্য ও যোগাযোগ প্রযুক্তি (ICT)', chapter_no: 5, chapter_name: '৫ম অধ্যায়: মাল্টিমিডিয়া ও গ্রাফিক্স (Photoshop/Powerpoint)', is_completed: false },
    { subject: 'তথ্য ও যোগাযোগ প্রযুক্তি (ICT)', chapter_no: 6, chapter_name: '৬ষ্ঠ অধ্যায়: ডেটাবেজ-এর ব্যবহার (Database MS Access)', is_completed: false },

    // English
    { subject: 'ইংরেজি (English First & Second Paper)', chapter_no: 1, chapter_name: 'Unit 1: Good Citizens & Rights', is_completed: true },
    { subject: 'ইংরেজি (English First & Second Paper)', chapter_no: 2, chapter_name: 'Unit 2: Pastimes & Hobbies', is_completed: true },
    { subject: 'ইংরেজি (English First & Second Paper)', chapter_no: 3, chapter_name: 'Grammar: Right Form of Verbs & Tenses', is_completed: true },
    { subject: 'ইংরেজি (English First & Second Paper)', chapter_no: 4, chapter_name: 'Grammar: Transformation of Sentences (Voice & Degree)', is_completed: false },
    { subject: 'ইংরেজি (English First & Second Paper)', chapter_no: 5, chapter_name: 'Writing: Paragraphs, Formal Emails & CV', is_completed: false }
  ],
  'Class 10': [
    { subject: 'পদার্থবিজ্ঞান (Physics)', chapter_no: 1, chapter_name: '৮ম অধ্যায়: আলোর প্রতিফলন', is_completed: true },
    { subject: 'পদার্থবিজ্ঞান (Physics)', chapter_no: 2, chapter_name: '৯ম অধ্যায়: আলোর প্রতিসরণ (Refraction)', is_completed: true },
    { subject: 'পদার্থবিজ্ঞান (Physics)', chapter_no: 3, chapter_name: '১০ম অধ্যায়: স্থির তড়িৎ (Static Electricity)', is_completed: true },
    { subject: 'পদার্থবিজ্ঞান (Physics)', chapter_no: 4, chapter_name: '১১শ অধ্যায়: চল তড়িৎ (Current Electricity)', is_completed: false },
    { subject: 'পদার্থবিজ্ঞান (Physics)', chapter_no: 5, chapter_name: '১২শ অধ্যায়: তড়িতের চৌম্বক ক্রিয়া', is_completed: false },
    { subject: 'সাধারণ গণিত (General Math)', chapter_no: 1, chapter_name: '৯ম ও ১০ম অধ্যায়: ত্রিকোণমিতি ও দূরত্ব-উচ্চতা', is_completed: true },
    { subject: 'সাধারণ গণিত (General Math)', chapter_no: 2, chapter_name: '১১শ অধ্যায়: বীজগণিতীয় অনুপাত ও সমানুপাত', is_completed: true },
    { subject: 'সাধারণ গণিত (General Math)', chapter_no: 3, chapter_name: '১৩শ অধ্যায়: সসীম ধারা (AP & GP)', is_completed: false },
    { subject: 'রসায়ন (Chemistry)', chapter_no: 1, chapter_name: '৮ম অধ্যায়: রসায়ন ও শক্তি (Electrochemistry)', is_completed: true },
    { subject: 'রসায়ন (Chemistry)', chapter_no: 2, chapter_name: '৯ম অধ্যায়: এসিড-ক্ষার সমতা (Acids & Bases)', is_completed: false },
    { subject: 'রসায়ন (Chemistry)', chapter_no: 3, chapter_name: '১১শ অধ্যায়: খনিজ সম্পদ-জীবাশ্ম (Organic Chemistry)', is_completed: false }
  ],
  'SSC 2026': [
    { subject: 'পদার্থবিজ্ঞান (Physics)', chapter_no: 1, chapter_name: 'ফাইনাল রিভিশন: বল ও গতিবিদ্যা স্পেশাল ক্র্যাশ কোর্স', is_completed: true },
    { subject: 'পদার্থবিজ্ঞান (Physics)', chapter_no: 2, chapter_name: 'তড়িৎ ও আলো মেগা সিকিউ প্র্যাকটিস', is_completed: false },
    { subject: 'সাধারণ গণিত (General Math)', chapter_no: 1, chapter_name: 'বোর্ড প্রশ্ন সমাধান: বীজগণিত ও পরিমিতি', is_completed: true },
    { subject: 'সাধারণ গণিত (General Math)', chapter_no: 2, chapter_name: 'জ্যামিতি ও বৃত্ত সংক্রান্ত সকল উপপাদ্য', is_completed: false },
    { subject: 'উচ্চতর গণিত (Higher Math)', chapter_no: 1, chapter_name: 'স্থানাঙ্ক জ্যামিতি ও দ্বিপদী বিস্তার মক টেস্ট', is_completed: false }
  ],
  'Class 8': [
    { subject: 'গণিত (Mathematics)', chapter_no: 1, chapter_name: '১ম অধ্যায়: প্যাটার্ন (Pattern)', is_completed: true },
    { subject: 'গণিত (Mathematics)', chapter_no: 2, chapter_name: '২য় অধ্যায়: মুনাফা ও শতকরা (Profit & Interest)', is_completed: true },
    { subject: 'গণিত (Mathematics)', chapter_no: 3, chapter_name: '৩য় অধ্যায়: পরিমাপ (Measurement)', is_completed: false },
    { subject: 'গণিত (Mathematics)', chapter_no: 4, chapter_name: '৪র্থ অধ্যায়: বীজগণিতীয় সূত্রাবলী ও প্রয়োগ', is_completed: false },
    { subject: 'বিজ্ঞান (Science)', chapter_no: 1, chapter_name: '১ম অধ্যায়: প্রাণীজগতের শ্রেণিবিন্যাস', is_completed: true },
    { subject: 'বিজ্ঞান (Science)', chapter_no: 2, chapter_name: '২য় অধ্যায়: জীবের বৃদ্ধি ও বংশগতি', is_completed: true },
    { subject: 'বিজ্ঞান (Science)', chapter_no: 3, chapter_name: '৩য় অধ্যায়: ব্যাপন, অভিস্রবণ ও প্রস্বেদন', is_completed: false }
  ]
};

/**
 * Auto-Seed helper function
 */
async function ensureCurriculumSeeded(targetClass = 'Class 9') {
  const existing = await SyllabusTracking.findAll();
  const classRecords = existing.filter(r => r.batch_or_class === targetClass);

  if (classRecords.length === 0) {
    const seeds = DEFAULT_CURRICULUM_SEEDS[targetClass] || DEFAULT_CURRICULUM_SEEDS['Class 9'];
    for (const item of seeds) {
      await SyllabusTracking.create({
        batch_or_class: targetClass,
        subject: item.subject,
        chapter_no: item.chapter_no || 1,
        chapter_name: item.chapter_name,
        is_completed: Boolean(item.is_completed),
        completed_at: item.is_completed ? new Date().toISOString() : null,
        created_at: new Date().toISOString()
      });
    }
  }
}

/**
 * 1. GET /api/syllabus-tracker
 * Returns all syllabus tracking entries for a class/batch, grouped by subject with progress stats.
 */
router.get('/', async (req, res, next) => {
  try {
    let { batch_or_class = 'Class 9', subject = '' } = req.query;

    // Normalizing class names (e.g. '9' -> 'Class 9', '১০ম' -> 'Class 10')
    if (batch_or_class === '9' || batch_or_class.includes('৯ম')) batch_or_class = 'Class 9';
    if (batch_or_class === '10' || batch_or_class.includes('১০ম')) batch_or_class = 'Class 10';
    if (batch_or_class === '8' || batch_or_class.includes('৮ম')) batch_or_class = 'Class 8';

    await ensureCurriculumSeeded(batch_or_class);

    let allItems = await SyllabusTracking.findAll({
      order: [['chapter_no', 'ASC'], ['id', 'ASC']]
    });

    let records = allItems.filter(r => (r.batch_or_class || '').toLowerCase() === batch_or_class.toLowerCase());

    // If still empty (e.g. customized class), fallback to Class 9 curriculum structure
    if (records.length === 0) {
      await ensureCurriculumSeeded('Class 9');
      records = (await SyllabusTracking.findAll()).filter(r => r.batch_or_class === 'Class 9');
      batch_or_class = 'Class 9';
    }

    if (subject && subject !== 'ALL') {
      records = records.filter(r => (r.subject || '').toLowerCase().includes(subject.toLowerCase()));
    }

    // Group by subject and calculate progress stats
    const groupedSubjects = {};
    for (const item of records) {
      const subKey = item.subject || 'সাধারণ বিষয়';
      if (!groupedSubjects[subKey]) {
        groupedSubjects[subKey] = {
          subject: subKey,
          totalChapters: 0,
          completedChapters: 0,
          percentage: 0,
          chapters: []
        };
      }

      groupedSubjects[subKey].totalChapters += 1;
      if (item.is_completed) {
        groupedSubjects[subKey].completedChapters += 1;
      }
      groupedSubjects[subKey].chapters.push({
        id: item.id,
        batch_or_class: item.batch_or_class,
        subject: item.subject,
        chapter_no: item.chapter_no,
        chapter_name: item.chapter_name,
        is_completed: Boolean(item.is_completed),
        completed_at: item.completed_at
      });
    }

    // Calculate final percentages
    const subjectList = Object.values(groupedSubjects).map(sub => {
      sub.percentage = sub.totalChapters > 0 ? Math.round((sub.completedChapters / sub.totalChapters) * 100) : 0;
      return sub;
    });

    const totalChaptersOverall = records.length;
    const completedChaptersOverall = records.filter(r => r.is_completed).length;
    const overallPercentage = totalChaptersOverall > 0 ? Math.round((completedChaptersOverall / totalChaptersOverall) * 100) : 0;

    res.json({
      success: true,
      data: {
        batch_or_class,
        overallPercentage,
        totalChapters: totalChaptersOverall,
        completedChapters: completedChaptersOverall,
        subjects: subjectList,
        rawRecords: records
      }
    });
  } catch (err) {
    next(err);
  }
});

/**
 * 2. PATCH /api/admin/syllabus-tracker/:id
 * Toggles or updates is_completed status of a chapter in real time.
 */
router.patch('/:id', authenticate, requireRole('ADMIN'), async (req, res, next) => {
  try {
    const chapterId = Number(req.params.id);
    const { is_completed } = req.body;

    const chapter = await SyllabusTracking.findByPk(chapterId);
    if (!chapter) {
      return res.status(404).json({
        success: false,
        error: { message: 'অধ্যায় রেকর্ডটি পাওয়া যায়নি' }
      });
    }

    const updated = await SyllabusTracking.update(
      {
        is_completed: Boolean(is_completed),
        completed_at: is_completed ? new Date().toISOString() : null,
        updated_by: req.user?.name || req.user?.id || 'Admin'
      },
      { where: { id: chapterId } }
    );

    res.json({
      success: true,
      message: `অধ্যায় স্ট্যাটাস '${is_completed ? 'সম্পন্ন' : 'চলমান'}' হিসেবে আপডেট হয়েছে`,
      data: {
        id: chapterId,
        is_completed: Boolean(is_completed),
        completed_at: is_completed ? new Date().toISOString() : null
      }
    });
  } catch (err) {
    next(err);
  }
});

/**
 * 3. POST /api/admin/syllabus-tracker/chapter
 * Add a new chapter to a class and subject syllabus
 */
router.post('/chapter', authenticate, requireRole('ADMIN'), async (req, res, next) => {
  try {
    const { batch_or_class = 'Class 9', subject, chapter_name, chapter_no, is_completed = false } = req.body;

    if (!subject || !chapter_name) {
      return res.status(400).json({
        success: false,
        error: { message: 'বিষয় ও অধ্যায়ের নাম আবশ্যক' }
      });
    }

    const newChapter = await SyllabusTracking.create({
      batch_or_class,
      subject,
      chapter_no: Number(chapter_no) || 1,
      chapter_name: String(chapter_name).trim(),
      is_completed: Boolean(is_completed),
      completed_at: is_completed ? new Date().toISOString() : null,
      created_at: new Date().toISOString()
    });

    res.status(201).json({
      success: true,
      message: 'নতুন অধ্যায় সফলভাবে সিলেবাসে যুক্ত হয়েছে',
      data: newChapter
    });
  } catch (err) {
    next(err);
  }
});

/**
 * 4. DELETE /api/admin/syllabus-tracker/:id
 * Delete a chapter from syllabus
 */
router.delete('/:id', authenticate, requireRole('ADMIN'), async (req, res, next) => {
  try {
    const chapterId = Number(req.params.id);
    const chapter = await SyllabusTracking.findByPk(chapterId);

    if (!chapter) {
      return res.status(404).json({
        success: false,
        error: { message: 'অধ্যায় রেকর্ডটি পাওয়া যায়নি' }
      });
    }

    await SyllabusTracking.destroy({ where: { id: chapterId } });

    res.json({
      success: true,
      message: 'অধ্যায়টি সফলভাবে মুছে ফেলা হয়েছে'
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
