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
    const defaultSettings = {
      academyName: 'NextGen Academy',
      academyNameBn: 'নেক্সটজেন একাডেমি',
      academyNameEn: 'NextGen Academy',
      founderName: 'মো: আলমগীর হোসেন (সাগর)',
      contactNumber: '০১৭৯২৮১৮০০৫',
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
      academic: {
        classes: ['৬ষ্ঠ শ্রেণি', '৭ম শ্রেণি', '৮ম শ্রেণি', '৯ম শ্রেণি', '১০ম শ্রেণি', '১১শ শ্রেণি', '১২শ শ্রেণি'],
        sections: ['পদ্মা', 'মেঘনা', 'যমুনা'],
        groups: ['বিজ্ঞান', 'মানবিক', 'ব্যবসায় শিক্ষা'],
        subjects: ['সাধারণ গণিত', 'উচ্চতর গণিত', 'পদার্থবিজ্ঞান', 'রসায়ন', 'জীববিজ্ঞান', 'তথ্য ও যোগাযোগ প্রযুক্তি', 'বাংলা', 'ইংরেজি']
      },
      payment: {
        bkashCharge: 1.5,
        nagadCharge: 1.25,
        monthlyTuitionDefault: 1500,
        admissionFeeDefault: 3000,
        examFeeDefault: 500
      },
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

    const current = db.settings || db.instituteSettings || {};
    const settings = {
      ...defaultSettings,
      ...current,
      academic: {
        ...defaultSettings.academic,
        ...(current.academic || {})
      },
      payment: {
        ...defaultSettings.payment,
        ...(current.payment || {})
      },
      socialLinks: {
        ...defaultSettings.socialLinks,
        ...(current.socialLinks || {})
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

    const academyName = req.body.academyName || req.body.nameEn || current.academyName || 'NextGen Academy';
    const academyNameBn = req.body.academyNameBn || req.body.nameBn || current.academyNameBn || 'নেক্সটজেন একাডেমি';
    const academyNameEn = req.body.academyNameEn || req.body.nameEn || current.academyNameEn || 'NextGen Academy';
    const founderName = req.body.founderName || current.founderName || 'মো: আলমগীর হোসেন (সাগর)';
    const contactNumber = req.body.contactNumber || current.contactNumber || '০১৭৯২৮১৮০০৫';
    const tagline = req.body.tagline || current.tagline || 'LEARN · GROW · SUCCEED';
    const taglineBn = req.body.taglineBn || current.taglineBn || 'শিক্ষা · সমৃদ্ধি · সাফল্য';
    const taglineEn = req.body.taglineEn || current.taglineEn || 'LEARN · GROW · SUCCEED';
    const logoUrl = req.body.logoUrl || current.logoUrl || '/logo.png';
    const sealUrl = req.body.sealUrl || current.sealUrl || '/logo.png';
    const contactPhone = req.body.contactPhone || req.body.phone || current.contactPhone || '01792818005';
    const altPhone = req.body.altPhone !== undefined ? req.body.altPhone : (current.altPhone || '');
    const contactEmail = req.body.contactEmail || req.body.email || current.contactEmail || 'info@nextgen.edu.bd';
    const supportEmail = req.body.supportEmail !== undefined ? req.body.supportEmail : (current.supportEmail || '');
    const address = req.body.address || current.address || 'পশ্চিম জয়দেবপুর, বাস-স্ট্যান্ড, গাজীপুর';
    const addressBn = req.body.addressBn || current.addressBn || address;
    const addressEn = req.body.addressEn || current.addressEn || 'West Joydebpur, Bus Stand, Gazipur';
    const eiin = req.body.eiin || req.body.code || current.eiin || 'NGA-GAZIPUR-2026';
    const website = req.body.website || current.website || 'https://nextgen.edu.bd';
    const currencySymbol = req.body.currencySymbol || current.currencySymbol || '৳';

    // Academic setup lists
    const academic = {
      classes: req.body.academic?.classes || current.academic?.classes || ['৬ষ্ঠ শ্রেণি', '৭ম শ্রেণি', '৮ম শ্রেণি', '৯ম শ্রেণি', '১০ম শ্রেণি', '১১শ শ্রেণি', '১২শ শ্রেণি'],
      sections: req.body.academic?.sections || current.academic?.sections || ['পদ্মা', 'মেঘনা', 'যমুনা'],
      groups: req.body.academic?.groups || current.academic?.groups || ['বিজ্ঞান', 'মানবিক', 'ব্যবসায় শিক্ষা'],
      subjects: req.body.academic?.subjects || current.academic?.subjects || ['সাধারণ গণিত', 'উচ্চতর গণিত', 'পদার্থবিজ্ঞান', 'রসায়ন', 'জীববিজ্ঞান', 'তথ্য ও যোগাযোগ প্রযুক্তি', 'বাংলা', 'ইংরেজি']
    };

    // Payment settings
    const payment = {
      bkashCharge: req.body.payment?.bkashCharge !== undefined ? Number(req.body.payment.bkashCharge) : (current.payment?.bkashCharge || 1.5),
      nagadCharge: req.body.payment?.nagadCharge !== undefined ? Number(req.body.payment.nagadCharge) : (current.payment?.nagadCharge || 1.25),
      monthlyTuitionDefault: req.body.payment?.monthlyTuitionDefault !== undefined ? Number(req.body.payment.monthlyTuitionDefault) : (current.payment?.monthlyTuitionDefault || 1500),
      admissionFeeDefault: req.body.payment?.admissionFeeDefault !== undefined ? Number(req.body.payment.admissionFeeDefault) : (current.payment?.admissionFeeDefault || 3000),
      examFeeDefault: req.body.payment?.examFeeDefault !== undefined ? Number(req.body.payment.examFeeDefault) : (current.payment?.examFeeDefault || 500)
    };

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
      founderName,
      contactNumber,
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
      addressBn,
      addressEn,
      eiin,
      code: eiin,
      website,
      currencySymbol,
      academic,
      payment,
      noticeText,
      noticeTextBn,
      noticeTextEn,
      showNotice,
      admissionActive,
      admissionSessionYear,
      admissionHelpline,
      maxApplicationsPerBatch,
      socialLinks,
      printSettings,
      updatedAt: new Date().toISOString()
    };

    db.settings = updated;
    db.instituteSettings = updated;
    saveDB(db);

    res.json({
      success: true,
      message: 'সাইট সেটিংস ও একাডেমিক কনফিগারেশন সফলভাবে সংরক্ষিত হয়েছে!',
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

// ==========================================
// STUDENT DASHBOARD MENU CONTROLLER (FEATURE FLAGS)
// ==========================================

const DEFAULT_STUDENT_MENUS = [
  { id: 'dashboard', moduleKey: 'dashboard', nameBn: 'ড্যাশবোর্ড ওভারভিউ', nameEn: 'Dashboard Overview', category: 'CORE', icon: 'LayoutDashboard', is_active: true, sort_order: 1, isLocked: true, description: 'প্রধান ওভারভিউ ড্যাশবোর্ড ও ক্লাসরুম নোটিফিকেশন' },
  { id: 'helpdesk', moduleKey: 'helpdesk', nameBn: 'মতামত ও হেল্পডেস্ক', nameEn: 'Feedback & Helpdesk', category: 'COMMUNICATION', icon: 'MessageSquarePlus', is_active: true, sort_order: 2, isLocked: false, description: 'নাম গোপন রেখে বা সরাসরি কর্তৃপক্ষের কাছে অভিযোগ ও মতামত প্রদান' },
  { id: 'ai-routine', moduleKey: 'ai-routine', nameBn: 'AI স্টাডি রুটিন ও দুর্বলতা ট্র্যাকার', nameEn: 'AI Routine & Weakness Tracker', category: 'AI_STUDY', icon: 'Brain', is_active: true, sort_order: 3, isLocked: false, description: 'পরীক্ষার স্কোরের ভিত্তিতে স্বয়ংক্রিয় ৭ দিনের স্মার্ট স্টাডি প্ল্যান' },
  { id: 'syllabus-map', moduleKey: 'syllabus-map', nameBn: 'RPG সিলেবাস ম্যাপ', nameEn: 'RPG Syllabus Map', category: 'GAMIFICATION', icon: 'Map', is_active: true, sort_order: 4, isLocked: false, description: 'গেমের মতো চ্যাপ্টার আনলক ও অগ্রগতি ট্র্যাকিং পথ' },
  { id: '3d-lab', moduleKey: '3d-lab', nameBn: 'ভার্চুয়াল ৩ডি সায়েন্স ল্যাব', nameEn: 'Virtual 3D Science Lab', category: 'LAB', icon: 'Rotate3d', is_active: true, sort_order: 5, isLocked: false, description: 'পদার্থ, রসায়ন ও জীববিজ্ঞানের ইন্টারেক্টিভ ৩ডি মডেল ল্যাব' },
  { id: 'live-battle', moduleKey: 'live-battle', nameBn: '১v১ লাইভ MCQ ব্যাটেল', nameEn: '1v1 Live MCQ Battle', category: 'GAMIFICATION', icon: 'Swords', is_active: true, sort_order: 6, isLocked: false, description: 'সহপাঠীদের সাথে রিয়েল-টাইম কুইজ প্রতিযোগিতা' },
  { id: 'rewards', moduleKey: 'rewards', nameBn: 'রিওয়ার্ড স্টোর ও কয়েন', nameEn: 'Reward Store & Coins', category: 'GAMIFICATION', icon: 'Gift', is_active: true, sort_order: 7, isLocked: false, description: 'ডেইলি লগইন ও কুইজে অর্জিত কয়েন দিয়ে উপহার ও নোটস রিডিম' },
  { id: 'book-store', moduleKey: 'book-store', nameBn: 'ডিজিটাল বুক স্টোর', nameEn: 'Digital Book Store', category: 'RESOURCES', icon: 'BookMarked', is_active: true, sort_order: 8, isLocked: false, description: 'প্যারালাল টেক্সটবুক ও স্পেশাল লেকচার শিট সংগ্রহ' },
  { id: 'all-formulas', moduleKey: 'all-formulas', nameBn: 'সকল সূত্র ভাণ্ডার', nameEn: 'All Formulas Library', category: 'RESOURCES', icon: 'Sigma', is_active: true, sort_order: 9, isLocked: false, description: 'গণিত ও বিজ্ঞান বিষয়ের অধ্যায়ভিত্তিক সমীকরণ ও ইমেজ এক্সপোর্ট' },
  { id: 'smart-notes', moduleKey: 'smart-notes', nameBn: 'স্মার্ট বোর্ড লেকচার নোটস', nameEn: 'Smart Board Lecture Notes', category: 'RESOURCES', icon: 'PenTool', is_active: true, sort_order: 10, isLocked: false, description: 'ক্লাসরুমের ডিজিটাল স্মার্টবোর্ডের রঙিন লেকচার স্লাইডস' },
  { id: 'media-center', moduleKey: 'media-center', nameBn: 'মিডিয়া সেন্টার ও ভিডিও', nameEn: 'Media Center & Lectures', category: 'RESOURCES', icon: 'Film', is_active: true, sort_order: 11, isLocked: false, description: 'রেকর্ডেড ক্লাস ভিডিও ও মাল্টিমিডিয়া আর্কাইভ' },
  { id: 'teachers', moduleKey: 'teachers', nameBn: 'শিক্ষক নির্দেশিকা', nameEn: 'Teachers Directory', category: 'ACADEMIC', icon: 'Users', is_active: true, sort_order: 12, isLocked: false, description: 'বিষয়ভিত্তিক সম্মানিত শিক্ষকবৃন্দের তালিকা ও প্রোফাইল' },
  { id: 'live-classes', moduleKey: 'live-classes', nameBn: 'লাইভ ক্লাসরুম', nameEn: 'Live Classroom', category: 'ACADEMIC', icon: 'Video', is_active: true, sort_order: 13, isLocked: false, description: 'রিয়েল-টাইম অনলাইন ক্লাস ও ভিডিও কনফারেন্সিং' },
  { id: 'exams', moduleKey: 'exams', nameBn: 'অনলাইন পরীক্ষা ও MCQ', nameEn: 'Online Exams', category: 'ACADEMIC', icon: 'HelpCircle', is_active: true, sort_order: 14, isLocked: false, description: 'অনলাইন মডেল টেস্ট ও তাৎক্ষণিক রেজাল্ট মূল্যায়ন' },
  { id: 'materials', moduleKey: 'materials', nameBn: 'স্টাডি মেটেরিয়ালস', nameEn: 'Study Materials', category: 'ACADEMIC', icon: 'BookMarked', is_active: true, sort_order: 15, isLocked: false, description: 'অধ্যায়ভিত্তিক শিট, অ্যাসাইনমেন্ট ফাইল ও সাজেশন' },
  { id: 'textbooks', moduleKey: 'textbooks', nameBn: 'ডিজিটাল পাঠ্যবই', nameEn: 'Digital Textbooks', category: 'ACADEMIC', icon: 'BookOpen', is_active: true, sort_order: 16, isLocked: false, description: 'এনসিটিবি প্রামাণ্য ই-বুক ও বোর্ড বই রিডার' },
  { id: 'homework', moduleKey: 'homework', nameBn: 'বাড়ির কাজ (Homework)', nameEn: 'Homework & Tasks', category: 'ACADEMIC', icon: 'ClipboardList', is_active: true, sort_order: 17, isLocked: false, description: 'দৈনিক বাড়ির কাজ জমাদান ও শিক্ষকের মূল্যায়ন' },
  { id: 'idcard', moduleKey: 'idcard', nameBn: 'ডিজিটাল আইডি কার্ড', nameEn: 'Digital Student ID', category: 'PROFILE', icon: 'UserCheck', is_active: true, sort_order: 18, isLocked: false, description: 'কিউআর কোড ভেরিফায়েড ডিজিটাল স্টুডেন্ট আইডি' },
  { id: 'attendance', moduleKey: 'attendance', nameBn: 'উপস্থিতি হিস্ট্রি', nameEn: 'Attendance Matrix', category: 'ACADEMIC', icon: 'CalendarCheck', is_active: true, sort_order: 19, isLocked: false, description: 'দৈনিক হাজিরা ক্যালেন্ডার ও উপস্থিতির শতকরা হার' },
  { id: 'results', moduleKey: 'results', nameBn: 'ফলাফল ও গ্রেডশিট', nameEn: 'Exam Results', category: 'ACADEMIC', icon: 'Award', is_active: true, sort_order: 20, isLocked: false, description: 'টার্ম ও মডেল টেস্টের বিস্তারিত মার্কশিট ও জিপিএ' },
  { id: 'routine', moduleKey: 'routine', nameBn: 'ক্লাস রুটিন', nameEn: 'Class Routine', category: 'ACADEMIC', icon: 'CalendarDays', is_active: true, sort_order: 21, isLocked: false, description: 'সাপ্তাহিক পিরিয়ড ও ক্লাসরুম শিডিউল গ্রিড' },
  { id: 'fees', moduleKey: 'fees', nameBn: 'ফি ও পেমেন্ট হিস্ট্রি', nameEn: 'Fee Invoices & Payments', category: 'ACCOUNTS', icon: 'CreditCard', is_active: true, sort_order: 22, isLocked: false, description: 'টিউশন ফি বকেয়া, ইনভয়েস ও মানি রিসিট ডাউনলোড' },
  { id: 'notices', moduleKey: 'notices', nameBn: 'নোটিশ বোর্ড', nameEn: 'Notice Board', category: 'COMMUNICATION', icon: 'BellRing', is_active: true, sort_order: 23, isLocked: false, description: 'একাডেমির জরুরি প্রাতিষ্ঠানিক নোটিশ ও ঘোষণা' }
];

function getOrInitStudentMenus(db) {
  if (!db.menu_settings || !Array.isArray(db.menu_settings) || db.menu_settings.length === 0) {
    db.menu_settings = JSON.parse(JSON.stringify(DEFAULT_STUDENT_MENUS));
    saveDB(db);
  }
  // Sort by sort_order
  db.menu_settings.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
  return db.menu_settings;
}

/**
 * GET /api/settings/student-menus
 * Public / Student endpoint to get active and ordered student menus
 */
router.get('/student-menus', (req, res) => {
  try {
    const db = getDB();
    const menus = getOrInitStudentMenus(db);
    res.json({
      success: true,
      data: menus
    });
  } catch (err) {
    res.status(500).json({ success: false, error: { message: err.message } });
  }
});

/**
 * GET /api/admin/settings/student-menus
 * Admin endpoint to get full menu controller configuration
 */
router.get('/admin/settings/student-menus', authenticate, (req, res) => {
  try {
    const db = getDB();
    const menus = getOrInitStudentMenus(db);
    res.json({
      success: true,
      data: menus
    });
  } catch (err) {
    res.status(500).json({ success: false, error: { message: err.message } });
  }
});

/**
 * PUT /api/admin/settings/student-menus
 * Admin bulk update student menus (toggle states and drag & drop order)
 */
router.put('/admin/settings/student-menus', authenticate, (req, res) => {
  try {
    const { menus } = req.body;
    if (!Array.isArray(menus)) {
      return res.status(400).json({ success: false, error: { message: 'মেনু তালিকা অবৈধ' } });
    }

    const db = getDB();
    // Normalize and assign sort_order based on array sequence
    const updated = menus.map((m, index) => ({
      ...m,
      sort_order: index + 1,
      is_active: m.isLocked ? true : (m.is_active === true || m.is_active === 'true')
    }));

    db.menu_settings = updated;
    saveDB(db);

    res.json({
      success: true,
      message: 'স্টুডেন্ট মেনু কন্ট্রোল ও সিরিয়াল সফলভাবে সংরক্ষিত হয়েছে!',
      data: updated
    });
  } catch (err) {
    res.status(500).json({ success: false, error: { message: err.message } });
  }
});

/**
 * PATCH /api/admin/settings/student-menus/:id/toggle
 * Admin quick toggle a single module On/Off
 */
router.patch('/admin/settings/student-menus/:id/toggle', authenticate, (req, res) => {
  try {
    const { id } = req.params;
    const db = getDB();
    const menus = getOrInitStudentMenus(db);

    const target = menus.find(m => m.id === id || m.moduleKey === id);
    if (!target) {
      return res.status(404).json({ success: false, error: { message: 'মডিউল পাওয়া যায়নি' } });
    }

    if (target.isLocked) {
      return res.status(400).json({ success: false, error: { message: 'প্রধান ড্যাশবোর্ড মডিউল বন্ধ করা যাবে না।' } });
    }

    target.is_active = !target.is_active;
    saveDB(db);

    res.json({
      success: true,
      message: `'${target.nameBn}' মডিউলটি ${target.is_active ? 'চালু' : 'বন্ধ'} করা হয়েছে।`,
      data: target
    });
  } catch (err) {
    res.status(500).json({ success: false, error: { message: err.message } });
  }
});

/**
 * POST /api/admin/settings/student-menus/reset
 * Reset student menus to factory defaults
 */
router.post('/admin/settings/student-menus/reset', authenticate, (req, res) => {
  try {
    const db = getDB();
    db.menu_settings = JSON.parse(JSON.stringify(DEFAULT_STUDENT_MENUS));
    saveDB(db);

    res.json({
      success: true,
      message: 'স্টুডেন্ট মেনু সেটিংস ডিফল্ট অবস্থায় রিসেট করা হয়েছে।',
      data: db.menu_settings
    });
  } catch (err) {
    res.status(500).json({ success: false, error: { message: err.message } });
  }
});


// ==========================================
// CENTRALIZED STUDENT PORTAL CONTROL & MANAGEMENT HUB
// ==========================================

const DEFAULT_STUDENT_PORTAL_CONFIG = {
  maintenanceMode: false,
  maintenanceMessage: 'স্টুডেন্ট পোর্টাল বর্তমানে সিস্টেম আপগ্রেডেশনের জন্য সাময়িক স্থগিত রয়েছে। অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন।',
  portalBannerText: '',
  showPortalBanner: false,
  enableDoubtSolver: true,
  enableLeaderboard: true,
  enableOnlinePayment: true,
  enableInstantPrint: true,
  categories: {
    academicCore: {
      key: 'academicCore',
      titleBn: '📚 একাডেমিক কোর',
      titleEn: 'Academic Core',
      enabled: true,
      modules: {
        'routine': { id: 'routine', nameBn: 'ক্লাস রুটিন', nameEn: 'Class Routine', enabled: true, icon: 'CalendarDays', description: 'সাপ্তাহিক ক্লাস শিডিউল ও পিরিয়ড' },
        'exams': { id: 'exams', nameBn: 'অনলাইন পরীক্ষা ও মূল্যায়ন', nameEn: 'Online Exams', enabled: true, icon: 'HelpCircle', description: 'অনলাইন এমসিকিউ ও মডেল টেস্ট' },
        'homework': { id: 'homework', nameBn: 'ডিজিটাল বাড়ির কাজ', nameEn: 'Homework & Tasks', enabled: true, icon: 'ClipboardList', description: 'হোমওয়ার্ক সাবমিশন ও শিক্ষকের গ্রেডিং' },
        'syllabus': { id: 'syllabus', nameBn: 'সিলেবাস অগ্রগতি ও ট্র্যাকার', nameEn: 'Syllabus Tracker', enabled: true, icon: 'BookCheck', description: 'অধ্যায়ভিত্তিক সমাপ্তি ও প্রগ্রেস' },
        'textbooks': { id: 'textbooks', nameBn: 'ডিজিটাল পাঠ্যবই (NCTB)', nameEn: 'Digital Textbooks', enabled: true, icon: 'BookOpen', description: 'জাতীয় পাঠ্যবই ও ই-বুক রিডার' },
        'live-classes': { id: 'live-classes', nameBn: 'লাইভ ক্লাসরুম', nameEn: 'Live Classroom', enabled: true, icon: 'Video', description: 'রিয়েল-টাইম অনলাইন ক্লাস ও ভিডিও' },
        'recorded': { id: 'recorded', nameBn: 'রেকর্ডেড ক্লাস লাইব্রেরি', nameEn: 'Recorded Classes', enabled: true, icon: 'PlaySquare', description: 'আর্কাইভকৃত পূর্ববর্তী সকল ক্লাস ভিডিও' }
      }
    },
    smartLabs: {
      key: 'smartLabs',
      titleBn: '🧪 স্মার্ট সায়েন্স ও এআই ল্যাব',
      titleEn: 'Smart Science & AI Labs',
      enabled: true,
      modules: {
        'chemistry-hub': { id: 'chemistry-hub', nameBn: 'রসায়ন ল্যাব ও মাস্টার হাব', nameEn: 'Chemistry Hub', enabled: true, icon: 'FlaskConical', description: 'মাস্টার কেমিস্ট্রি, বন্ডিং ও ম্যাথ সলভার' },
        'biology-lab': { id: 'biology-lab', nameBn: 'মাস্টার জীববিজ্ঞান ভার্চুয়াল ল্যাব', nameEn: 'Biology Lab', enabled: true, icon: 'Dna', description: 'প্রাণিবিজ্ঞান ও উদ্ভিদবিজ্ঞান ৩ডি ল্যাব' },
        'physics-lab': { id: 'physics-lab', nameBn: 'মেগা পদার্থবিজ্ঞান সিমুলেশন ল্যাব', nameEn: 'Physics Lab', enabled: true, icon: 'Atom', description: 'আলো, গতি ও বিদ্যুতের ইন্টারঅ্যাক্টিভ সিমুলেশন' },
        'math-lab': { id: 'math-lab', nameBn: 'গণিত ও ICT ভিজ্যুয়ালাইজার', nameEn: 'Math & ICT Lab', enabled: true, icon: 'Calculator', description: 'জ্যামিতি বোর্ড, সংখ্যা পদ্ধতি ও অ্যালগরিদম' },
        'ict-quiz': { id: 'ict-quiz', nameBn: 'ICT স্মার্ট কুইজ ও কোডিং চ্যালেঞ্জ', nameEn: 'ICT Quiz Zone', enabled: true, icon: 'Terminal', description: 'সি প্রোগ্রামিং, এইচটিএমএল ও এমসিকিউ কুইজ' }
      }
    },
    studyMaterials: {
      key: 'studyMaterials',
      titleBn: '📖 স্টাডি মেটেরিয়ালস ও বুকস',
      titleEn: 'Study Materials & Books',
      enabled: true,
      modules: {
        'smart-notes': { id: 'smart-notes', nameBn: 'অ্যানিমেটেড স্মার্টবোর্ড নোটস', nameEn: 'Smart Board Notes', enabled: true, icon: 'PenTool', description: 'ডিজিটাল স্মার্টবোর্ড লেকচার স্লাইডস' },
        'grammar-hub': { id: 'grammar-hub', nameBn: 'ইংরেজি গ্রামার ও রুলস হাব', nameEn: 'English Grammar Hub', enabled: true, icon: 'Languages', description: 'গ্রামার রুলস, টেস্ট ও বাংলা ব্যাখ্যা' },
        'formula-vault': { id: 'formula-vault', nameBn: 'ইন্টারেক্টিভ ফর্মুলা ভল্ট', nameEn: 'Formula Vault', enabled: true, icon: 'Sigma', description: 'সকল সূত্র ভাণ্ডার ও ইমেজ জেনারেটর' },
        'book-store': { id: 'book-store', nameBn: 'স্টুডেন্ট ডিজিটাল বুকস্টোর', nameEn: 'Digital Book Store', enabled: true, icon: 'BookMarked', description: 'প্রামাণ্য গাইড ও স্পেশাল শিট সংগ্রহ' },
        'resources': { id: 'resources', nameBn: 'লেকচার শিট ও রিসোর্স ব্যাংক', nameEn: 'Resource Library', enabled: true, icon: 'FolderGit2', description: 'পিডিএফ শিট ও সাজেশন ডাউনলোড' }
      }
    },
    gamification: {
      key: 'gamification',
      titleBn: '🎮 পারফরম্যান্স ও গ্যামিফিকেশন',
      titleEn: 'Performance & Gamification',
      enabled: true,
      modules: {
        'ai-routine': { id: 'ai-routine', nameBn: 'AI স্টাডি রুটিন ও দুর্বলতা ট্র্যাকার', nameEn: 'AI Routine', enabled: true, icon: 'Brain', description: 'দুর্বল বিষয়ের উপর ৭ দিনের স্মার্ট রুটিন' },
        'syllabus-map': { id: 'syllabus-map', nameBn: 'RPG সিলেবাস ম্যাপ', nameEn: 'RPG Syllabus Map', enabled: true, icon: 'Map', description: 'লেভেল ও এক্সপি অর্জনের সিলেবাস জার্নি' },
        'live-battle': { id: 'live-battle', nameBn: '১v১ লাইভ MCQ ব্যাটেল', nameEn: '1v1 Live Battle', enabled: true, icon: 'Swords', description: 'সহপাঠীদের সাথে সরাসরি অনলাইন কুইজ লড়াই' },
        'results': { id: 'results', nameBn: 'ফলাফল ও গ্রেডশিট', nameEn: 'Results & Grades', enabled: true, icon: 'Award', description: 'টার্মভিত্তিক ফলাফল ও ট্রান্সক্রিপ্ট' }
      }
    },
    profileRecords: {
      key: 'profileRecords',
      titleBn: '⚙️ প্রোফাইল ও রেকর্ড',
      titleEn: 'Profile & Records',
      enabled: true,
      modules: {
        'attendance': { id: 'attendance', nameBn: 'একাডেমিক প্রগ্রেস ও রিপোর্ট হাব', nameEn: 'Progress & Attendance', enabled: true, icon: 'TrendingUp', description: 'নম্বর বিশ্লেষণ, প্রগ্রেস চার্ট ও উপস্থিতি' },
        'fees': { id: 'fees', nameBn: 'ফি ও পেমেন্ট হিস্ট্রি', nameEn: 'Fee Invoices', enabled: true, icon: 'CreditCard', description: 'টিউশন ফি বিবরণ ও মানি রিসিট' },
        'checkout': { id: 'checkout', nameBn: 'পেমেন্ট গেটওয়ে ও রিডিম', nameEn: 'Payment Gateway', enabled: true, icon: 'Wallet', description: 'বিকাশ/নগদ ডিজিটাল ফি পরিশোধ' },
        'referral-hub': { id: 'referral-hub', nameBn: 'রেফারেল ও রিওয়ার্ডস হাব', nameEn: 'Referral Rewards', enabled: true, icon: 'Gift', description: 'বন্ধু রেফার করে ক্যাশব্যাক ও পয়েন্ট' },
        'rewards': { id: 'rewards', nameBn: 'রিওয়ার্ড স্টোর ও কয়েন', nameEn: 'Reward Store', enabled: true, icon: 'Trophy', description: 'অর্জিত কয়েন দিয়ে স্টোর গিফট রিডিম' },
        'teachers': { id: 'teachers', nameBn: 'শিক্ষক নির্দেশিকা', nameEn: 'Teacher Directory', enabled: true, icon: 'Users', description: 'সম্মানিত শিক্ষকদের তালিকা ও যোগাযোগ' },
        'helpdesk': { id: 'helpdesk', nameBn: 'মতামত ও হেল্পডেস্ক', nameEn: 'Feedback & Helpdesk', enabled: true, icon: 'MessageSquarePlus', description: 'অভিযোগ, সমস্যা ও পরামর্শ বক্স' },
        'notices': { id: 'notices', nameBn: 'নোটিশ বোর্ড', nameEn: 'Notice Board', enabled: true, icon: 'BellRing', description: 'একাডেমির জরুরি নোটিশ ও ছুটির তালিকা' }
      }
    }
  }
};

function getOrInitStudentPortal(db) {
  if (!db.student_portal_config) {
    db.student_portal_config = JSON.parse(JSON.stringify(DEFAULT_STUDENT_PORTAL_CONFIG));
    saveDB(db);
  }
  return db.student_portal_config;
}

/**
 * GET /api/settings/student-portal
 * Fetch centralized student portal configuration and active module toggles
 */
router.get('/student-portal', (req, res) => {
  try {
    const db = getDB();
    const config = getOrInitStudentPortal(db);
    res.json({
      success: true,
      data: config
    });
  } catch (err) {
    res.status(500).json({ success: false, error: { message: err.message } });
  }
});

/**
 * PUT /api/settings/student-portal
 * Admin update centralized student portal configuration
 */
router.put('/student-portal', authenticate, (req, res) => {
  try {
    const db = getDB();
    const current = getOrInitStudentPortal(db);
    const updated = {
      ...current,
      ...req.body,
      categories: {
        ...current.categories,
        ...(req.body.categories || {})
      }
    };

    db.student_portal_config = updated;
    saveDB(db);

    res.json({
      success: true,
      message: 'স্টুডেন্ট পোর্টাল কন্ট্রোল হাব সেটিংস সফলভাবে আপডেট ও সেভ হয়েছে!',
      data: updated
    });
  } catch (err) {
    res.status(500).json({ success: false, error: { message: err.message } });
  }
});

/**
 * POST /api/settings/student-portal/reset
 * Reset student portal configuration to factory defaults
 */
router.post('/student-portal/reset', authenticate, (req, res) => {
  try {
    const db = getDB();
    db.student_portal_config = JSON.parse(JSON.stringify(DEFAULT_STUDENT_PORTAL_CONFIG));
    saveDB(db);

    res.json({
      success: true,
      message: 'স্টুডেন্ট পোর্টাল সেটিংস ফ্যাক্টরি ডিফল্টে সফলভাবে রিস্টোর হয়েছে!',
      data: db.student_portal_config
    });
  } catch (err) {
    res.status(500).json({ success: false, error: { message: err.message } });
  }
});

module.exports = router;

