const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../data/nextgen_academy_db.json');

function getDB() {
  return JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
}

function saveDB(db) {
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf-8');
}

// Master Permissions Matrix Dictionary
const PERMISSIONS_MATRIX = [
  {
    moduleKey: 'accounts',
    moduleNameBn: 'হিসাব ও পেরোল (Accounts & Payroll)',
    moduleNameEn: 'Accounts & Payroll',
    permissions: [
      { key: 'accounts_view', labelBn: 'আর্থিক ড্যাশবোর্ড ও P&L দেখার অনুমতি', labelEn: 'View Financial Summary' },
      { key: 'accounts_expense', labelBn: 'খরচ ভাউচার এন্ট্রি ও এডিট', labelEn: 'Manage Expense Vouchers' },
      { key: 'accounts_payroll', labelBn: 'শিক্ষক বেতন প্রস্তুত ও অনুমোদন', labelEn: 'Manage Teacher Payroll' },
      { key: 'accounts_cashbook', labelBn: 'ক্যাশবুক লেজার স্টেটমেন্ট দেখার অনুমতি', labelEn: 'View Cashbook Ledger' }
    ]
  },
  {
    moduleKey: 'fees',
    moduleNameBn: 'ফি ও রসিদ ব্যবস্থাপনা (Fees & Invoices)',
    moduleNameEn: 'Fees & Invoicing',
    permissions: [
      { key: 'fees_collect', labelBn: 'শিক্ষার্থী টিউশন ফি কালেকশন', labelEn: 'Collect Student Fees' },
      { key: 'fees_create_invoice', labelBn: 'নতুন ফি ইনভয়েস তৈরি ও ডিসকাউন্ট', labelEn: 'Create Fee Invoices' },
      { key: 'fees_print_receipt', labelBn: 'মানি রিসিট প্রিন্ট ও ডাউনলোড', labelEn: 'Print Money Receipts' }
    ]
  },
  {
    moduleKey: 'students',
    moduleNameBn: 'শিক্ষার্থী ব্যবস্থাপনা (Student Directory)',
    moduleNameEn: 'Student Directory',
    permissions: [
      { key: 'students_view', labelBn: 'শিক্ষার্থীদের তালিকা ও প্রোফাইল দেখা', labelEn: 'View Student Directory' },
      { key: 'students_add', labelBn: 'নতুন শিক্ষার্থী ভর্তি / রেজিস্ট্রেশন', labelEn: 'Add / Enroll Student' },
      { key: 'students_edit', labelBn: 'শিক্ষার্থী তথ্য পরিবর্তন ও এডিট', labelEn: 'Edit Student Details' },
      { key: 'students_delete', labelBn: 'শিক্ষার্থী প্রোফাইল ডিলিট / আর্কাইভ', labelEn: 'Delete / Archive Student' },
      { key: 'students_send_sms', labelBn: 'অভিভাবকদের এসএমএস পাঠানো', labelEn: 'Send SMS to Guardians' }
    ]
  },
  {
    moduleKey: 'teachers',
    moduleNameBn: 'শিক্ষক ও স্টাফ ডিরেক্টরি (Faculty & Staff)',
    moduleNameEn: 'Teachers & Faculty',
    permissions: [
      { key: 'teachers_view', labelBn: 'শিক্ষকদের তালিকা ও পরিচিতি দেখা', labelEn: 'View Teachers Directory' },
      { key: 'teachers_manage', labelBn: 'নতুন শিক্ষক নিয়োগ ও প্রোফাইল এডিট', labelEn: 'Manage Faculty Profiles' },
      { key: 'teachers_attendance', labelBn: 'শিক্ষকদের দৈনিক হাজিরা ট্র্যাকিং', labelEn: 'Teacher Daily Attendance' }
    ]
  },
  {
    moduleKey: 'batches_routine',
    moduleNameBn: 'ব্যাচ ও ক্লাস রুটিন (Batches & Timetable)',
    moduleNameEn: 'Batches & Timetable',
    permissions: [
      { key: 'batches_manage', labelBn: 'নতুন ব্যাচ তৈরি, আসন ও ফি নির্ধারণ', labelEn: 'Manage Batches' },
      { key: 'routine_manage', labelBn: 'সাপ্তাহিক ক্লাস রুটিন তৈরি ও এডিট', labelEn: 'Manage Timetable' },
      { key: 'routine_view', labelBn: 'রুটিন দেখার অনুমতি', labelEn: 'View Routine' }
    ]
  },
  {
    moduleKey: 'exams_results',
    moduleNameBn: 'পরীক্ষা ও ফলাফল (Exams & Report Cards)',
    moduleNameEn: 'Exams & Results',
    permissions: [
      { key: 'exams_manage', labelBn: 'পরীক্ষা শিডিউল ও সিট প্ল্যান তৈরি', labelEn: 'Manage Exams' },
      { key: 'results_marks_entry', labelBn: 'বিষয়ভিত্তিক নম্বর এন্ট্রি (CQ/MCQ/Practical)', labelEn: 'Marks Entry' },
      { key: 'results_merit_list', labelBn: 'জাতীয় জিপিএ ও মেধা তালিকা প্রস্তুত', labelEn: 'Merit List Engine' },
      { key: 'results_report_card', labelBn: '৩৬০° একাডেমিক মার্কশিট প্রিন্ট', labelEn: 'Print Report Cards' }
    ]
  },
  {
    moduleKey: 'live_classes_notices',
    moduleNameBn: 'অনলাইন ক্লাস ও নোটিশ (Live Class & Notices)',
    moduleNameEn: 'Live Classes & Notices',
    permissions: [
      { key: 'live_classes_manage', labelBn: 'লাইভ ক্লাস তৈরি ও ব্রডকাস্ট', labelEn: 'Schedule Live Classes' },
      { key: 'notices_manage', labelBn: 'জরুরি ডিজিটাল নোটিশ প্রকাশ', labelEn: 'Publish Notices' },
      { key: 'homework_manage', labelBn: 'অনলাইন হোমওয়ার্ক এসাইনমেন্ট', labelEn: 'Manage Homework' },
      { key: 'materials_upload', labelBn: 'লেকচার শিট ও স্টাডি ম্যাটেরিয়াল আপলোড', labelEn: 'Upload Study Materials' }
    ]
  },
  {
    moduleKey: 'admin_settings',
    moduleNameBn: 'অ্যাডমিন সেটিংস ও সিকিউরিটি (Settings & Security)',
    moduleNameEn: 'Settings & Security',
    permissions: [
      { key: 'settings_manage_profile', labelBn: 'ইনস্টিটিউট প্রোফাইল ও ব্র্যান্ডিং পরিবর্তন', labelEn: 'Institute Profile & Branding' },
      { key: 'settings_manage_roles', labelBn: 'রোল তৈরি ও পারমিশন ম্যাট্রিক্স নিয়ন্ত্রণ', labelEn: 'Manage Roles & RBAC' },
      { key: 'settings_manage_staff', labelBn: 'স্টাফ অ্যাকাউন্ট তৈরি ও পাসওয়ার্ড রিসেট', labelEn: 'Manage Staff Users' },
      { key: 'audit_logs_view', labelBn: 'সিস্টেম অডিট লগ ও অ্যাক্টিভিটি হিস্ট্রি', labelEn: 'View System Audit Logs' }
    ]
  }
];

// ----------------------------------------------------
// 1. DYNAMIC SITE SETTINGS & PUBLIC CONFIG
// ----------------------------------------------------

// Public route to fetch current settings (No authentication required)
router.get(['/', '/public', '/profile'], (req, res) => {
  try {
    const db = getDB();
    const settings = db.settings || db.instituteSettings || {
      academyName: 'NextGen Academy',
      academyNameBn: 'নেক্সটজেন একাডেমি',
      academyNameEn: 'NextGen Academy',
      tagline: 'LEARN · GROW · SUCCEED',
      taglineBn: 'শিক্ষা · সমৃদ্ধি · সাফল্য',
      taglineEn: 'LEARN · GROW · SUCCEED',
      logoUrl: '/logo.png',
      sealUrl: '/logo.png',
      contactPhone: '01792818005',
      altPhone: '+880 1792818005',
      hotline: '01792818005',
      contactEmail: 'info@nextgen.edu.bd',
      supportEmail: 'info@nextgen.edu.bd',
      address: 'পশ্চিম জয়দেবপুর, বাস-স্ট্যান্ড, গাজীপুর',
      addressBn: 'পশ্চিম জয়দেবপুর, বাস-স্ট্যান্ড, গাজীপুর',
      addressEn: 'West Joydebpur, Bus Stand, Gazipur',
      eiin: 'NGA-GAZIPUR-2026',
      website: 'https://nextgen.edu.bd',
      currencySymbol: '৳',
      noticeText: 'ভর্তি চলছে! শিক্ষাবর্ষ ২০২৬-এ প্লে থেকে ১২শ শ্রেণি (Play to Class 12) পর্যন্ত সীমিত আসনে ডিজিটাল ভর্তি কার্যক্রম চালু রয়েছে। হেল্পলাইন: ০১৭৯২৮১৮০০৫',
      noticeTextBn: 'ভর্তি চলছে! শিক্ষাবর্ষ ২০২৬-এ প্লে থেকে ১২শ শ্রেণি (Play to Class 12) পর্যন্ত সীমিত আসনে ডিজিটাল ভর্তি কার্যক্রম চালু রয়েছে। হেল্পলাইন: ০১৭৯২৮১৮০০৫',
      noticeTextEn: 'Admission Open for Academic Session 2026 from Play to Class 12. Hotline: +880 1792818005',
      showNotice: true,
      admissionActive: true,
      admissionSessionYear: '২০২৬',
      admissionHelpline: '01792818005',
      maxApplicationsPerBatch: 60,
      socialLinks: {
        facebook: 'https://facebook.com/NextGenAcademyBD',
        youtube: 'https://youtube.com/@NextGenAcademyBD',
        linkedin: 'https://linkedin.com/company/nextgen-academy-bd',
        twitter: 'https://twitter.com/NextGenAcademy'
      },
      printSettings: {
        headerStyle: 'PREMIUM_GOLD',
        receiptFooterNote: 'বিশেষ দ্রষ্টব্য: পরিশোধিত ফি কোনো অবস্থাতেই অফেরতযোগ্য। এই মানি রিসিটটি পরবর্তী রেফারেন্সের জন্য সংরক্ষণ করুন।',
        admitCardInstructions: '১. পরীক্ষা শুরুর ১৫ মিনিট পূর্বে পরীক্ষার হলে উপস্থিত হতে হবে।\n২. ডিজিটাল ওয়াচ বা মোবাইল ফোন হলে সম্পূর্ণ নিষিদ্ধ।\n৩. এই অ্যাডমিট কার্ড সাথে রাখা বাধ্যতামূলক।',
        signatures: {
          accountant: 'হিসাবরক্ষক কর্মকর্তা',
          examController: 'পরীক্ষা নিয়ন্ত্রক',
          principal: 'অধ্যক্ষ / প্রিন্সিপাল'
        }
      }
    };

    res.json({
      success: true,
      data: settings
    });
  } catch (err) {
    console.error('Get site settings error:', err);
    res.status(500).json({ success: false, error: { message: err.message } });
  }
});

// Protected Admin route to update settings
router.put(['/', '/profile'], authenticate, (req, res) => {
  try {
    const db = getDB();
    const current = db.settings || db.instituteSettings || {};

    const academyName = req.body.academyName || req.body.nameEn || current.academyName || current.nameEn || 'NextGen ACADEMY';
    const academyNameBn = req.body.academyNameBn || req.body.nameBn || current.academyNameBn || current.nameBn || 'নেক্সটজেন একাডেমি';
    const academyNameEn = req.body.academyNameEn || req.body.nameEn || current.academyNameEn || current.nameEn || 'NextGen ACADEMY';
    const tagline = req.body.tagline || current.tagline || 'LEARN · GROW · SUCCEED';
    const taglineBn = req.body.taglineBn || current.taglineBn || 'শিক্ষা · সমৃদ্ধি · সাফল্য';
    const taglineEn = req.body.taglineEn || current.taglineEn || 'LEARN · GROW · SUCCEED';
    const logoUrl = req.body.logoUrl || current.logoUrl || '/logo.png';
    const sealUrl = req.body.sealUrl || current.sealUrl || '/logo.png';
    const contactPhone = req.body.contactPhone || req.body.phone || current.contactPhone || current.phone || '+880 1800-NEXTGEN';
    const altPhone = req.body.altPhone !== undefined ? req.body.altPhone : (current.altPhone || '');
    const contactEmail = req.body.contactEmail || req.body.email || current.contactEmail || current.email || 'info@nextgen.edu.bd';
    const supportEmail = req.body.supportEmail !== undefined ? req.body.supportEmail : (current.supportEmail || '');
    const address = req.body.address || current.address || 'ধানমন্ডি, ঢাকা';
    const eiin = req.body.eiin || req.body.code || current.eiin || current.code || 'NGA-DHAKA-2026';
    const website = req.body.website || current.website || 'https://nextgen.edu.bd';
    const currencySymbol = req.body.currencySymbol || current.currencySymbol || '৳';

    // Notice & Announcement
    const noticeText = req.body.noticeText !== undefined ? req.body.noticeText : (current.noticeText || '');
    const noticeTextBn = req.body.noticeTextBn !== undefined ? req.body.noticeTextBn : (current.noticeTextBn || noticeText);
    const noticeTextEn = req.body.noticeTextEn !== undefined ? req.body.noticeTextEn : (current.noticeTextEn || '');
    const showNotice = req.body.showNotice !== undefined ? Boolean(req.body.showNotice) : (current.showNotice !== undefined ? current.showNotice : true);

    // Admission Control
    const admissionActive = req.body.admissionActive !== undefined ? Boolean(req.body.admissionActive) : (current.admissionActive !== undefined ? current.admissionActive : true);
    const admissionSessionYear = req.body.admissionSessionYear || current.admissionSessionYear || '২০২৬';
    const admissionHelpline = req.body.admissionHelpline || current.admissionHelpline || contactPhone;
    const maxApplicationsPerBatch = req.body.maxApplicationsPerBatch || current.maxApplicationsPerBatch || 60;

    // Social Links
    const socialLinks = {
      facebook: req.body.socialLinks?.facebook !== undefined ? req.body.socialLinks.facebook : (req.body.facebook || current.socialLinks?.facebook || ''),
      youtube: req.body.socialLinks?.youtube !== undefined ? req.body.socialLinks.youtube : (current.socialLinks?.youtube || ''),
      linkedin: req.body.socialLinks?.linkedin !== undefined ? req.body.socialLinks.linkedin : (current.socialLinks?.linkedin || ''),
      twitter: req.body.socialLinks?.twitter !== undefined ? req.body.socialLinks.twitter : (current.socialLinks?.twitter || '')
    };

    // Print Settings
    const printSettings = {
      headerStyle: req.body.printSettings?.headerStyle || current.printSettings?.headerStyle || 'PREMIUM_GOLD',
      receiptFooterNote: req.body.printSettings?.receiptFooterNote !== undefined
        ? req.body.printSettings.receiptFooterNote
        : (current.printSettings?.receiptFooterNote || ''),
      admitCardInstructions: req.body.printSettings?.admitCardInstructions !== undefined
        ? req.body.printSettings.admitCardInstructions
        : (current.printSettings?.admitCardInstructions || ''),
      signatures: {
        accountant: req.body.printSettings?.signatures?.accountant || current.printSettings?.signatures?.accountant || 'হিসাবরক্ষক কর্মকর্তা',
        examController: req.body.printSettings?.signatures?.examController || current.printSettings?.signatures?.examController || 'পরীক্ষা নিয়ন্ত্রক',
        principal: req.body.printSettings?.signatures?.principal || current.printSettings?.signatures?.principal || 'অধ্যক্ষ / প্রিন্সিপাল'
      }
    };

    const updated = {
      ...current,
      ...req.body,
      academyName,
      academyNameBn,
      academyNameEn,
      nameBn: academyNameBn,
      nameEn: academyNameEn,
      tagline,
      taglineBn,
      taglineEn,
      logoUrl,
      sealUrl,
      contactPhone,
      whatsappPhone: req.body.whatsappPhone || req.body.whatsapp || current.whatsappPhone || '01792818005',
      phone: contactPhone,
      altPhone,
      contactEmail,
      email: contactEmail,
      supportEmail,
      address,
      eiin,
      code: eiin,
      website,
      currencySymbol,
      noticeText,
      noticeTextBn,
      noticeTextEn,
      showNotice,
      admissionActive,
      admissionSessionYear,
      admissionHelpline,
      maxApplicationsPerBatch,
      heroHeadlineBn: req.body.heroHeadlineBn || current.heroHeadlineBn || 'ভর্তি চলছে! শিক্ষাবর্ষ ২০২৬-এ ৬ষ্ঠ থেকে ১২শ শ্রেণিতে ডিজিটাল ভর্তি কার্যক্রম',
      heroSubtitleBn: req.body.heroSubtitleBn || current.heroSubtitleBn || 'অনলাইন লাইভ ক্লাস, স্মার্ট মার্কশিট, স্বয়ংক্রিয় ফি পেমেন্ট ও অভিজ্ঞ শিক্ষক প্যানেলের সমন্বয়ে আধুনিক শিক্ষা ব্যবস্থা।',
      bannerImageUrl: req.body.bannerImageUrl || current.bannerImageUrl || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&auto=format&fit=crop&q=80',
      socialLinks,
      printSettings,
      updatedAt: new Date().toISOString()
    };

    db.settings = updated;
    db.instituteSettings = updated;
    saveDB(db);

    res.json({
      success: true,
      message: 'সাইট সেটিংস ও ইনস্টিটিউট প্রোফাইল সফলভাবে আপডেট করা হয়েছে!',
      data: updated
    });
  } catch (err) {
    console.error('Update site settings error:', err);
    res.status(500).json({ success: false, error: { message: err.message } });
  }
});

// ----------------------------------------------------
// 2. MASTER PERMISSIONS MATRIX
// ----------------------------------------------------
router.get('/permissions-matrix', authenticate, (req, res) => {
  res.json({
    success: true,
    data: PERMISSIONS_MATRIX
  });
});

// ----------------------------------------------------
// 3. ROLES MANAGEMENT
// ----------------------------------------------------
router.get('/roles', authenticate, (req, res) => {
  try {
    const db = getDB();
    const roles = db.roles || [];
    const users = db.users || [];

    // Enrich roles with member count
    const enriched = roles.map((r) => {
      const memberCount = users.filter((u) => u.role === r.id).length;
      return {
        ...r,
        memberCount
      };
    });

    res.json({
      success: true,
      data: enriched
    });
  } catch (err) {
    console.error('Get roles error:', err);
    res.status(500).json({ success: false, error: { message: err.message } });
  }
});

router.post('/roles', authenticate, (req, res) => {
  try {
    const db = getDB();
    const { name, nameBn, description, permissions, color } = req.body;

    if (!name || !nameBn || !permissions || !Array.isArray(permissions)) {
      return res.status(400).json({ success: false, error: { message: 'রোলের নাম ও পারমিশন নির্বাচন আবশ্যক।' } });
    }

    const id = name.trim().toUpperCase().replace(/[^A-Z0-9]/g, '_');
    const roles = db.roles || [];

    if (roles.some((r) => r.id === id)) {
      return res.status(400).json({ success: false, error: { message: 'এই নামের একটি রোল ইতিমধ্যে বিদ্যমান।' } });
    }

    const newRole = {
      id,
      name,
      nameBn,
      description: description || '',
      color: color || 'indigo',
      isSystem: false,
      permissions,
      createdAt: new Date().toISOString()
    };

    roles.push(newRole);
    db.roles = roles;
    saveDB(db);

    res.json({
      success: true,
      message: `নতুন রোল '${nameBn}' সফলভাবে তৈরি হয়েছে!`,
      data: newRole
    });
  } catch (err) {
    console.error('Create role error:', err);
    res.status(500).json({ success: false, error: { message: err.message } });
  }
});

router.put('/roles/:id', authenticate, (req, res) => {
  try {
    const db = getDB();
    const id = req.params.id;
    const roles = db.roles || [];
    const index = roles.findIndex((r) => r.id === id);

    if (index === -1) {
      return res.status(404).json({ success: false, error: { message: 'রোল পাওয়া যায়নি।' } });
    }

    const { nameBn, description, permissions, color } = req.body;

    roles[index] = {
      ...roles[index],
      nameBn: nameBn || roles[index].nameBn,
      description: description !== undefined ? description : roles[index].description,
      permissions: permissions || roles[index].permissions,
      color: color || roles[index].color,
      updatedAt: new Date().toISOString()
    };

    db.roles = roles;
    saveDB(db);

    res.json({
      success: true,
      message: `রোল '${roles[index].nameBn}' এর পারমিশন সফলভাবে আপডেট হয়েছে!`,
      data: roles[index]
    });
  } catch (err) {
    console.error('Update role error:', err);
    res.status(500).json({ success: false, error: { message: err.message } });
  }
});

router.delete('/roles/:id', authenticate, (req, res) => {
  try {
    const db = getDB();
    const id = req.params.id;
    const roles = db.roles || [];
    const target = roles.find((r) => r.id === id);

    if (!target) {
      return res.status(404).json({ success: false, error: { message: 'রোল পাওয়া যায়নি।' } });
    }

    if (target.isSystem) {
      return res.status(400).json({ success: false, error: { message: 'সিস্টেম ডিফল্ট রোল মুছে ফেলা যাবে না।' } });
    }

    // Check if any users have this role
    const users = db.users || [];
    const assignedUsers = users.filter((u) => u.role === id);
    if (assignedUsers.length > 0) {
      return res.status(400).json({
        success: false,
        error: { message: `এই রোলে ${assignedUsers.length} জন ইউজার যুক্ত রয়েছে। প্রথমে তাদের রোল পরিবর্তন করুন।` }
      });
    }

    db.roles = roles.filter((r) => r.id !== id);
    saveDB(db);

    res.json({
      success: true,
      message: `রোল '${target.nameBn}' সফলভাবে মুছে ফেলা হয়েছে!`
    });
  } catch (err) {
    console.error('Delete role error:', err);
    res.status(500).json({ success: false, error: { message: err.message } });
  }
});

// ----------------------------------------------------
// 4. ADMIN & STAFF USERS MANAGEMENT
// ----------------------------------------------------
router.get('/staff', authenticate, (req, res) => {
  try {
    const db = getDB();
    const users = db.users || [];
    const roles = db.roles || [];

    // Filter staff / administrative users (exclude STUDENT and PARENT)
    const staffList = users
      .filter((u) => u.role !== 'STUDENT' && u.role !== 'PARENT')
      .map((u) => {
        const roleObj = roles.find((r) => r.id === u.role) || {
          nameBn: u.role,
          name: u.role,
          color: 'slate',
          permissions: []
        };

        return {
          id: u.id,
          name: u.name,
          email: u.email,
          phone: u.phone || 'N/A',
          role: u.role,
          roleNameBn: roleObj.nameBn,
          roleColor: roleObj.color,
          department: u.department || 'সাধারণ প্রশাসন',
          designation: u.designation || 'অফিসার',
          isActive: u.isActive !== undefined ? u.isActive : true,
          avatar: u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
          createdAt: u.createdAt || '2026-01-01'
        };
      });

    res.json({
      success: true,
      data: {
        staff: staffList,
        totalCount: staffList.length
      }
    });
  } catch (err) {
    console.error('Get staff list error:', err);
    res.status(500).json({ success: false, error: { message: err.message } });
  }
});

router.post('/staff', authenticate, (req, res) => {
  try {
    const db = getDB();
    const { name, email, phone, password, role, department, designation } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ success: false, error: { message: 'নাম, ইমেইল, পাসওয়ার্ড ও রোল আবশ্যক।' } });
    }

    const users = db.users || [];
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return res.status(400).json({ success: false, error: { message: 'এই ইমেইলটি ইতিমধ্যে নিবন্ধিত রয়েছে।' } });
    }

    const newId = users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1;
    const hashedPassword = bcrypt.hashSync(password, 10);

    const newStaff = {
      id: newId,
      name,
      email: email.toLowerCase().trim(),
      phone: phone || '',
      password: hashedPassword,
      passwordHash: hashedPassword,
      role: role.toUpperCase(),
      department: department || 'প্রশাসন',
      designation: designation || 'স্টাফ',
      isActive: true,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    users.push(newStaff);
    db.users = users;
    saveDB(db);

    res.json({
      success: true,
      message: `নতুন স্টাফ '${name}' সফলভাবে যুক্ত হয়েছে!`,
      data: {
        id: newStaff.id,
        name: newStaff.name,
        email: newStaff.email,
        phone: newStaff.phone,
        role: newStaff.role,
        department: newStaff.department,
        designation: newStaff.designation,
        isActive: newStaff.isActive
      }
    });
  } catch (err) {
    console.error('Add staff error:', err);
    res.status(500).json({ success: false, error: { message: err.message } });
  }
});

router.put('/staff/:id', authenticate, (req, res) => {
  try {
    const db = getDB();
    const id = Number(req.params.id);
    const users = db.users || [];
    const index = users.findIndex((u) => u.id === id);

    if (index === -1) {
      return res.status(404).json({ success: false, error: { message: 'ইউজার পাওয়া যায়নি।' } });
    }

    const { name, email, phone, role, department, designation, isActive } = req.body;

    users[index] = {
      ...users[index],
      name: name || users[index].name,
      email: email ? email.toLowerCase().trim() : users[index].email,
      phone: phone !== undefined ? phone : users[index].phone,
      role: role ? role.toUpperCase() : users[index].role,
      department: department || users[index].department,
      designation: designation || users[index].designation,
      isActive: isActive !== undefined ? isActive : users[index].isActive,
      updatedAt: new Date().toISOString()
    };

    db.users = users;
    saveDB(db);

    res.json({
      success: true,
      message: `'${users[index].name}'-এর প্রোফাইল ও রোল সফলভাবে আপডেট হয়েছে!`,
      data: users[index]
    });
  } catch (err) {
    console.error('Update staff error:', err);
    res.status(500).json({ success: false, error: { message: err.message } });
  }
});

router.post('/staff/reset-password/:id', authenticate, (req, res) => {
  try {
    const db = getDB();
    const id = Number(req.params.id);
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ success: false, error: { message: 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।' } });
    }

    const users = db.users || [];
    const index = users.findIndex((u) => u.id === id);

    if (index === -1) {
      return res.status(404).json({ success: false, error: { message: 'ইউজার পাওয়া যায়নি।' } });
    }

    const hashed = bcrypt.hashSync(newPassword, 10);
    users[index].password = hashed;
    users[index].passwordHash = hashed;
    users[index].updatedAt = new Date().toISOString();

    db.users = users;
    saveDB(db);

    res.json({
      success: true,
      message: `'${users[index].name}'-এর পাসওয়ার্ড সফলভাবে রিসেট করা হয়েছে!`
    });
  } catch (err) {
    console.error('Reset staff password error:', err);
    res.status(500).json({ success: false, error: { message: err.message } });
  }
});

router.delete('/staff/:id', authenticate, (req, res) => {
  try {
    const db = getDB();
    const id = Number(req.params.id);

    if (id === 1) {
      return res.status(400).json({ success: false, error: { message: 'প্রধান সুপার অ্যাডমিন অ্যাকাউন্ট মোছা যাবে না।' } });
    }

    const users = db.users || [];
    const target = users.find((u) => u.id === id);

    if (!target) {
      return res.status(404).json({ success: false, error: { message: 'ইউজার পাওয়া যায়নি।' } });
    }

    db.users = users.filter((u) => u.id !== id);
    saveDB(db);

    res.json({
      success: true,
      message: `স্টাফ অ্যাকাউন্ট '${target.name}' সফলভাবে মুছে ফেলা হয়েছে!`
    });
  } catch (err) {
    console.error('Delete staff error:', err);
    res.status(500).json({ success: false, error: { message: err.message } });
  }
});

module.exports = router;
