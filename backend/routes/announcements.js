const express = require('express');
const { PageAnnouncement, User } = require('../models');
const { authenticate, requireRole } = require('../middleware/auth');
const AuditService = require('../services/auditService');

const router = express.Router();

// Default seed announcements with professional Bengali female voice settings
const DEFAULT_ANNOUNCEMENTS = [
  {
    id: 1,
    title: 'স্বাগতম নেক্সটজেন একাডেমিতে',
    message: 'নেক্সটজেন একাডেমির স্মার্ট লার্নিং পোর্টালে আপনাকে স্বাগতম। আপনার শিক্ষা ও দক্ষতার সর্বোচ্চ বিকাশে আমরা সবসময় পাশে আছি।',
    targetPage: 'HOME',
    targetRole: 'ALL',
    priority: 'NORMAL',
    displayType: 'BANNER',
    enableAudio: true,
    autoSpeak: false,
    voiceGender: 'FEMALE',
    voiceLanguage: 'bn-BD',
    speechRate: 0.95,
    speechPitch: 1.08,
    chimeSound: 'pleasant_bell',
    isActive: true,
    createdById: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 2,
    title: 'লাইভ ক্লাস নির্দেশিকা ও প্রস্তুতি',
    message: 'লাইভ ক্লাসে যুক্ত হওয়ার আগে অবশ্যই সাথে খাতা, কলম এবং পাঠ্যবই প্রস্তুত রাখুন। ক্লাসে মনোযোগ দিন এবং প্রশ্ন থাকলে লাইভ চ্যাটে লিখুন।',
    targetPage: 'LIVE_CLASS',
    targetRole: 'STUDENT',
    priority: 'HIGH',
    displayType: 'BANNER',
    enableAudio: true,
    autoSpeak: true,
    voiceGender: 'FEMALE',
    voiceLanguage: 'bn-BD',
    speechRate: 0.94,
    speechPitch: 1.08,
    chimeSound: 'pleasant_bell',
    isActive: true,
    createdById: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 3,
    title: 'পরীক্ষা হলের শৃঙ্খলা ও সময় সচেতনতা',
    message: 'অনলাইন পরীক্ষায় সততা বজায় রাখুন। নির্ধারিত সময় শেষ হওয়ার পূর্বেই সকল প্রশ্নের উত্তর দিয়ে সাবমিট বাটনে ক্লিক করুন। শুভকামনা!',
    targetPage: 'EXAM_HALL',
    targetRole: 'STUDENT',
    priority: 'URGENT',
    displayType: 'BANNER',
    enableAudio: true,
    autoSpeak: true,
    voiceGender: 'FEMALE',
    voiceLanguage: 'bn-BD',
    speechRate: 0.95,
    speechPitch: 1.08,
    chimeSound: 'pleasant_bell',
    isActive: true,
    createdById: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 4,
    title: 'দৈনিক একাডেমিক আপডেট ও নোটিফিকেশন',
    message: 'আজকের ক্লাসের রুটিন ও বাড়ির কাজ যাচাই করে নিন। নিয়মিত পড়াশোনা চালিয়ে যান এবং নিজের লক্ষ্যে অবিচল থাকুন।',
    targetPage: 'DASHBOARD',
    targetRole: 'ALL',
    priority: 'NORMAL',
    displayType: 'BANNER',
    enableAudio: true,
    autoSpeak: false,
    voiceGender: 'FEMALE',
    voiceLanguage: 'bn-BD',
    speechRate: 0.95,
    speechPitch: 1.08,
    chimeSound: 'pleasant_bell',
    isActive: true,
    createdById: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Helper to ensure initial data exists
async function ensureSeedData() { /* Clean: auto-seeding disabled */ }
    }
  } catch (err) {
    console.error('Error seeding announcements:', err.message);
  }
}

/**
 * GET /api/announcements/active
 * Public/User: Fetch active announcements matching context (page, role, classId)
 */
router.get('/active', async (req, res, next) => {
  try {
    await ensureSeedData();

    const { page, role, classId } = req.query;
    const now = new Date().toISOString();

    let allAnnouncements = await PageAnnouncement.findAll({
      where: { isActive: true },
      order: [['updatedAt', 'DESC']]
    });

    const normalizedPage = page ? String(page).toUpperCase() : 'ALL';
    const normalizedRole = role ? String(role).toUpperCase() : 'ALL';

    const filtered = allAnnouncements.filter(item => {
      if (!item.isActive) return false;

      // Date range check
      if (item.startDate && item.startDate > now) return false;
      if (item.endDate && item.endDate < now) return false;

      // Page matching: item matches if targetPage === 'ALL' or exact match
      if (item.targetPage && item.targetPage !== 'ALL' && normalizedPage !== 'ALL') {
        if (item.targetPage !== normalizedPage) return false;
      }

      // Role matching
      if (item.targetRole && item.targetRole !== 'ALL' && normalizedRole !== 'ALL') {
        if (item.targetRole !== normalizedRole) return false;
      }

      // Class matching
      if (item.classId && classId && item.classId !== 'ALL') {
        if (String(item.classId) !== String(classId)) return false;
      }

      return true;
    });

    // Priority sorting: URGENT (3) > HIGH (2) > NORMAL (1)
    const priorityWeight = { URGENT: 3, HIGH: 2, NORMAL: 1 };
    filtered.sort((a, b) => {
      const pDiff = (priorityWeight[b.priority] || 1) - (priorityWeight[a.priority] || 1);
      if (pDiff !== 0) return pDiff;
      return new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0);
    });

    res.json({
      success: true,
      data: filtered
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/announcements
 * Authenticated: List all announcements with search and filters
 */
router.get('/', async (req, res, next) => {
  try {
    await ensureSeedData();

    const { page, role, status, search } = req.query;

    let items = await PageAnnouncement.findAll({
      include: [{ model: User, as: 'author' }],
      order: [['updatedAt', 'DESC']]
    });

    if (page && page !== 'ALL') {
      items = items.filter(i => i.targetPage === page || i.targetPage === 'ALL');
    }

    if (role && role !== 'ALL') {
      items = items.filter(i => i.targetRole === role || i.targetRole === 'ALL');
    }

    if (status === 'ACTIVE') {
      items = items.filter(i => i.isActive === true);
    } else if (status === 'INACTIVE') {
      items = items.filter(i => i.isActive === false);
    }

    if (search) {
      const q = search.toLowerCase();
      items = items.filter(i =>
        (i.title && i.title.toLowerCase().includes(q)) ||
        (i.message && i.message.toLowerCase().includes(q)) ||
        (i.targetPage && i.targetPage.toLowerCase().includes(q))
      );
    }

    res.json({
      success: true,
      data: items
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/announcements
 * Admin/Teacher: Create a new dynamic audio/text announcement
 */
router.post('/', authenticate, requireRole('ADMIN', 'SUPER_ADMIN', 'TEACHER'), async (req, res, next) => {
  try {
    const {
      title,
      message,
      targetPage = 'ALL',
      targetRole = 'ALL',
      classId = 'ALL',
      priority = 'NORMAL',
      displayType = 'BANNER',
      enableAudio = true,
      autoSpeak = false,
      voiceGender = 'FEMALE',
      voiceLanguage = 'bn-BD',
      speechRate = 0.95,
      speechPitch = 1.08,
      chimeSound = 'pleasant_bell',
      isActive = true,
      startDate = null,
      endDate = null
    } = req.body;

    if (!title || !title.trim() || !message || !message.trim()) {
      return res.status(400).json({
        success: false,
        error: { message: 'শিরোনাম এবং বার্তা উভয়ই দেওয়া আবশ্যক' }
      });
    }

    const payload = {
      title: title.trim(),
      message: message.trim(),
      targetPage: String(targetPage).toUpperCase(),
      targetRole: String(targetRole).toUpperCase(),
      classId: classId || 'ALL',
      priority: ['URGENT', 'HIGH', 'NORMAL'].includes(priority) ? priority : 'NORMAL',
      displayType: ['BANNER', 'TOAST', 'TICKER', 'MODAL_ALERT'].includes(displayType) ? displayType : 'BANNER',
      enableAudio: Boolean(enableAudio),
      autoSpeak: Boolean(autoSpeak),
      voiceGender: voiceGender || 'FEMALE',
      voiceLanguage: voiceLanguage || 'bn-BD',
      speechRate: Number(speechRate) || 0.95,
      speechPitch: Number(speechPitch) || 1.08,
      chimeSound: chimeSound || 'pleasant_bell',
      isActive: isActive !== false,
      startDate: startDate || null,
      endDate: endDate || null,
      createdById: req.user ? req.user.id : 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const newAnnouncement = await PageAnnouncement.create(payload);

    await AuditService.log({
      req,
      action: 'CREATE_PAGE_ANNOUNCEMENT',
      entityType: 'PageAnnouncement',
      entityId: newAnnouncement.id,
      newValue: payload,
      details: `Created audio announcement: ${newAnnouncement.title} for page ${newAnnouncement.targetPage}`
    });

    res.status(201).json({
      success: true,
      message: 'ঘোষণাটি সফলভাবে তৈরি করা হয়েছে!',
      data: newAnnouncement
    });
  } catch (err) {
    next(err);
  }
});

/**
 * PUT /api/announcements/:id
 * Admin/Teacher: Update an existing announcement
 */
router.put('/:id', authenticate, requireRole('ADMIN', 'SUPER_ADMIN', 'TEACHER'), async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const existing = await PageAnnouncement.findByPk(id);

    if (!existing) {
      return res.status(404).json({
        success: false,
        error: { message: 'ঘোষণাটি পাওয়া যায়নি' }
      });
    }

    const {
      title,
      message,
      targetPage,
      targetRole,
      classId,
      priority,
      displayType,
      enableAudio,
      autoSpeak,
      voiceGender,
      voiceLanguage,
      speechRate,
      speechPitch,
      chimeSound,
      isActive,
      startDate,
      endDate
    } = req.body;

    const updatePayload = {
      ...(title !== undefined ? { title: title.trim() } : {}),
      ...(message !== undefined ? { message: message.trim() } : {}),
      ...(targetPage !== undefined ? { targetPage: String(targetPage).toUpperCase() } : {}),
      ...(targetRole !== undefined ? { targetRole: String(targetRole).toUpperCase() } : {}),
      ...(classId !== undefined ? { classId } : {}),
      ...(priority !== undefined ? { priority } : {}),
      ...(displayType !== undefined ? { displayType } : {}),
      ...(enableAudio !== undefined ? { enableAudio: Boolean(enableAudio) } : {}),
      ...(autoSpeak !== undefined ? { autoSpeak: Boolean(autoSpeak) } : {}),
      ...(voiceGender !== undefined ? { voiceGender } : {}),
      ...(voiceLanguage !== undefined ? { voiceLanguage } : {}),
      ...(speechRate !== undefined ? { speechRate: Number(speechRate) } : {}),
      ...(speechPitch !== undefined ? { speechPitch: Number(speechPitch) } : {}),
      ...(chimeSound !== undefined ? { chimeSound } : {}),
      ...(isActive !== undefined ? { isActive: Boolean(isActive) } : {}),
      ...(startDate !== undefined ? { startDate } : {}),
      ...(endDate !== undefined ? { endDate } : {}),
      updatedAt: new Date().toISOString()
    };

    await PageAnnouncement.update(updatePayload, { where: { id } });
    const updated = await PageAnnouncement.findByPk(id);

    await AuditService.log({
      req,
      action: 'UPDATE_PAGE_ANNOUNCEMENT',
      entityType: 'PageAnnouncement',
      entityId: id,
      oldValue: existing,
      newValue: updated,
      details: `Updated audio announcement: ${updated.title}`
    });

    res.json({
      success: true,
      message: 'ঘোষণাটি সফলভাবে আপডেট করা হয়েছে',
      data: updated
    });
  } catch (err) {
    next(err);
  }
});

/**
 * PATCH /api/announcements/:id/toggle
 * Toggle active/inactive state
 */
router.patch('/:id/toggle', authenticate, requireRole('ADMIN', 'SUPER_ADMIN', 'TEACHER'), async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const existing = await PageAnnouncement.findByPk(id);

    if (!existing) {
      return res.status(404).json({
        success: false,
        error: { message: 'ঘোষণাটি পাওয়া যায়নি' }
      });
    }

    const nextState = !existing.isActive;
    await PageAnnouncement.update({ isActive: nextState, updatedAt: new Date().toISOString() }, { where: { id } });

    res.json({
      success: true,
      message: nextState ? 'ঘোষণাটি সক্রিয় করা হয়েছে' : 'ঘোষণাটি নিষ্ক্রিয় করা হয়েছে',
      data: { id, isActive: nextState }
    });
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /api/announcements/:id
 * Delete announcement
 */
router.delete('/:id', authenticate, requireRole('ADMIN', 'SUPER_ADMIN', 'TEACHER'), async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const existing = await PageAnnouncement.findByPk(id);

    if (!existing) {
      return res.status(404).json({
        success: false,
        error: { message: 'ঘোষণাটি পাওয়া যায়নি' }
      });
    }

    await PageAnnouncement.destroy({ where: { id } });

    await AuditService.log({
      req,
      action: 'DELETE_PAGE_ANNOUNCEMENT',
      entityType: 'PageAnnouncement',
      entityId: id,
      oldValue: existing,
      details: `Deleted audio announcement: ${existing.title}`
    });

    res.json({
      success: true,
      message: 'ঘোষণাটি সফলভাবে মুছে ফেলা হয়েছে'
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
