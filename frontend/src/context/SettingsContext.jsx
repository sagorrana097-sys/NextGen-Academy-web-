import React, { createContext, useContext, useState, useEffect } from 'react';
import { settingsAPI, studentPortalControlAPI } from '../services/api';

export const defaultStudentPortalConfig = {
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

export const defaultSiteSettings = {
  academyName: 'NextGen Academy',
  academyNameBn: 'নেক্সটজেন একাডেমি',
  academyNameEn: 'NextGen Academy',
  founderName: 'মো: আলমগীর হোসেন (সাগর)',
  contactNumber: '০১৭৯২৮১৮০০৫',
  contactPhone: '01792818005',
  altPhone: '+880 1792818005',
  hotline: '01792818005',
  contactEmail: 'info@nextgen.edu.bd',
  supportEmail: 'info@nextgen.edu.bd',
  address: 'পশ্চিম জয়দেবপুর, বাস-স্ট্যান্ড, গাজীপুর',
  addressBn: 'পশ্চিম জয়দেবপুর, বাস-স্ট্যান্ড, গাজীপুর',
  addressEn: 'West Joydebpur, Bus Stand, Gazipur',
  tagline: 'LEARN · GROW · SUCCEED',
  taglineBn: 'শিক্ষা · সমৃদ্ধি · সাফল্য',
  taglineEn: 'LEARN · GROW · SUCCEED',
  logoUrl: '/logo.png',
  sealUrl: '/logo.png',
  eiin: 'NGA-GAZIPUR-2026',
  website: 'https://nextgen.edu.bd',
  currencySymbol: '৳',
  studentPortal: defaultStudentPortalConfig,
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
  noticeText: 'ভর্তি চলছে! শিক্ষাবর্ষ ২০২৬-এ প্লে থেকে ১২শ শ্রেণি পর্যন্ত সীমিত আসনে ডিজিটাল ভর্তি কার্যক্রম চালু রয়েছে। হেল্পলাইন: ০১৭৯২৮১৮০০৫',
  noticeTextBn: 'ভর্তি চলছে! শিক্ষাবর্ষ ২০২৬-এ প্লে থেকে ১২শ শ্রেণি পর্যন্ত সীমিত আসনে ডিজিটাল ভর্তি কার্যক্রম চালু রয়েছে। হেল্পলাইন: ০১৭৯২৮১৮০০৫',
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
  }
};

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(defaultSiteSettings);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const [res, portalRes] = await Promise.allSettled([
        settingsAPI.getSettings(),
        studentPortalControlAPI.getConfig()
      ]);

      let siteData = {};
      if (res.status === 'fulfilled' && res.value?.success && res.value.data) {
        siteData = res.value.data;
      }

      let portalData = defaultStudentPortalConfig;
      if (portalRes.status === 'fulfilled' && portalRes.value?.success && portalRes.value.data) {
        portalData = {
          ...defaultStudentPortalConfig,
          ...portalRes.value.data,
          categories: {
            ...defaultStudentPortalConfig.categories,
            ...(portalRes.value.data.categories || {})
          }
        };
      }

      setSettings({
        ...defaultSiteSettings,
        ...siteData,
        studentPortal: portalData,
        academic: {
          ...defaultSiteSettings.academic,
          ...(siteData.academic || {})
        },
        payment: {
          ...defaultSiteSettings.payment,
          ...(siteData.payment || {})
        },
        socialLinks: {
          ...defaultSiteSettings.socialLinks,
          ...(siteData.socialLinks || {})
        }
      });
    } catch (err) {
      console.warn('Failed to load site settings from server, using defaults:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const updateSettings = async (newSettings) => {
    try {
      const res = await settingsAPI.updateSettings(newSettings);
      if (res.success && res.data) {
        const merged = {
          ...settings,
          ...res.data,
          academic: {
            ...settings.academic,
            ...(res.data.academic || {})
          },
          payment: {
            ...settings.payment,
            ...(res.data.payment || {})
          },
          socialLinks: {
            ...settings.socialLinks,
            ...(res.data.socialLinks || {})
          }
        };
        setSettings(merged);
        return { success: true, message: res.message || 'সেটিংস সফলভাবে সংরক্ষিত হয়েছে!', data: merged };
      }
      throw new Error(res.error?.message || 'সেটিংস আপডেট ব্যর্থ হয়েছে');
    } catch (err) {
      console.error('Update settings context error:', err);
      return { success: false, error: err.message };
    }
  };

  const updateStudentPortalSettings = async (portalConfig) => {
    try {
      const res = await studentPortalControlAPI.updateConfig(portalConfig);
      if (res.success && res.data) {
        setSettings(prev => ({
          ...prev,
          studentPortal: res.data
        }));
        return { success: true, message: res.message || 'স্টুডেন্ট পোর্টাল সেটিংস সংরক্ষিত হয়েছে!', data: res.data };
      }
      throw new Error(res.error?.message || 'পোর্টাল সেটিংস আপডেট ব্যর্থ হয়েছে');
    } catch (err) {
      console.error('Update portal settings error:', err);
      return { success: false, error: err.message };
    }
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        loading,
        updateSettings,
        updateStudentPortalSettings,
        refreshSettings: fetchSettings
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    return {
      settings: defaultSiteSettings,
      loading: false,
      updateSettings: async () => ({ success: false }),
      updateStudentPortalSettings: async () => ({ success: false }),
      refreshSettings: () => {}
    };
  }
  return context;
};
