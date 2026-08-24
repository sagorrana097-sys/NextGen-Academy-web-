import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useSettings } from '../../context/SettingsContext';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  CalendarCheck,
  Award,
  CalendarDays,
  CreditCard,
  BellRing,
  ShieldCheck,
  BookOpen,
  UserCheck,
  ClipboardList,
  BookMarked,
  Clock,
  HelpCircle,
  Video,
  Layers,
  Wallet,
  Sliders,
  UserPlus,
  Database,
  MessageSquare,
  CheckSquare,
  Sparkles,
  Film,
  Swords,
  Gift,
  Calculator,
  Rotate3d,
  PenTool,
  Trophy,
  Zap,
  Brain,
  Map,
  Sigma,
  LifeBuoy,
  MessageSquarePlus,
  BookA,
  Tag,
  Compass,
  Atom,
  Heart,
  ChevronDown,
  ChevronRight,
  Languages,
  Laptop,
  Flame,
  FlaskConical,
  Search,
  X,
  Settings,
  FolderOpen,
  TestTube2
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, isOpen, onClose }) {
  const { user } = useAuth();
  const { t, lang } = useLanguage();
  const { settings } = useSettings();

  const [searchQuery, setSearchQuery] = useState('');

  // Dropdown expansion state for nested groups (e.g. chemistry-hub)
  const [expandedDropdowns, setExpandedDropdowns] = useState({
    'chemistry-hub': true
  });

  const toggleDropdown = (dropdownId) => {
    setExpandedDropdowns((prev) => ({
      ...prev,
      [dropdownId]: !prev[dropdownId]
    }));
  };

  // Collapsible Accordion State for Categories
  const [collapsedCategories, setCollapsedCategories] = useState({
    // Student & Parent categories
    academic: false,
    subjectLabs: false,
    studyMaterials: false,
    aiPerformance: false,
    profileRecords: false,
    // Admin categories
    adminCore: false,
    adminAcademics: false,
    adminFinance: false,
    adminCms: false,
    adminSystem: false,
    // Teacher categories
    teacherCore: false,
    teacherAcademics: false,
    teacherProfile: false
  });

  const toggleCategory = (catKey) => {
    setCollapsedCategories((prev) => ({
      ...prev,
      [catKey]: !prev[catKey]
    }));
  };

  // =========================================================================
  // 1. STUDENT & PARENT CATEGORIZED NAVIGATION (WITH CHEMISTRY UNIFIED HUB)
  // =========================================================================
  const studentCategories = [
    {
      key: 'academic',
      title: lang === 'bn' ? '🎓 একাডেমিক কার্যক্রম' : '🎓 Academic Core',
      icon: GraduationCap,
      items: [
        { id: 'live-classes', label: lang === 'bn' ? 'লাইভ ক্লাসরুম' : 'Live Classroom', icon: Video },
        { id: 'routine', label: lang === 'bn' ? 'ক্লাস রুটিন' : 'Class Routine', icon: CalendarDays },
        { id: 'homework', label: lang === 'bn' ? 'বাড়ির কাজ (Homework)' : 'Homework', icon: ClipboardList },
        { id: 'exams', label: lang === 'bn' ? 'অনলাইন পরীক্ষা ও MCQ' : 'Online Exams & MCQ', icon: HelpCircle }
      ]
    },
    {
      key: 'subjectLabs',
      title: lang === 'bn' ? '🔬 স্মার্ট সাবজেক্ট ল্যাব' : '🔬 Smart Subject Labs',
      badge: 'PRO LABS',
      icon: FlaskConical,
      items: [
        // ==========================================================
        // UNIFIED CHEMISTRY COMPLETE LAB & HUB DROPDOWN
        // ==========================================================
        {
          id: 'chemistry-hub',
          label: lang === 'bn' ? 'রসায়ন ল্যাব ও মাস্টার হাব' : 'Chemistry: Complete Lab & Hub',
          icon: FlaskConical,
          badge: 'SSC & HSC',
          isDropdown: true,
          subItems: [
            {
              id: 'chemistry-lab',
              label: lang === 'bn' ? 'মাস্টার কেমিস্ট্রি ল্যাব (মূল হাব)' : 'Master Chemistry Lab (Core Hub)',
              icon: FlaskConical
            },
            {
              id: 'bonding-solver',
              label: lang === 'bn' ? '৫ম অধ্যায়: রাসায়নিক বন্ধন ও ডট-ক্রস' : 'Ch-5: Chemical Bonding Solver',
              icon: Atom
            },
            {
              id: 'chemistry-math-solver',
              label: lang === 'bn' ? '৬ষ্ঠ অধ্যায়: AI গাণিতিক রসায়ন ও মিশ্রণ' : 'Ch-6: AI Math & Beaker Solver',
              icon: Calculator
            },
            {
              id: 'science-3d',
              label: lang === 'bn' ? '৩ডি পর্যায় সারণি ও আণবিক গঠন' : '3D Periodic Table & Molecules',
              icon: Rotate3d
            }
          ]
        },
        // Other Subject Labs
        { id: 'geometry-board', label: lang === 'bn' ? 'গণিত: ভার্চুয়াল জ্যামিতি বক্স' : 'Math: Geometry Board', icon: Compass },
        { id: 'math-lab', label: lang === 'bn' ? 'গণিত: মাস্টার ম্যাথ ও আইসিটি' : 'Math: Master Math & ICT', icon: Calculator },
        { id: 'physics-lab', label: lang === 'bn' ? 'পদার্থ: মেগা ফিজিক্স ল্যাব' : 'Physics: Mega Physics Lab', icon: Zap },
        { id: 'biology-lab', label: lang === 'bn' ? 'জীববিজ্ঞান: মাস্টার বায়োলজি ল্যাব' : 'Biology: Master Biology Lab', icon: Heart },
        { id: 'grammar-hub', label: lang === 'bn' ? 'ইংরেজি: স্মার্ট ইংলিশ গ্রামার হাব' : 'English: Grammar Hub', icon: BookA },
        { id: 'ict-quiz', label: lang === 'bn' ? 'আইসিটি: আইসিটি ও স্মার্ট কুইজ জোন' : 'ICT: Smart Quiz Zone', icon: Laptop },
        {
          id: 'toggle-dictionary',
          label: lang === 'bn' ? 'টুলস: ভাসমান ডিকশনারি' : 'Tools: Bilingual Dictionary',
          icon: Languages,
          isAction: true,
          action: () => {
            window.dispatchEvent(new CustomEvent('toggle-nextgen-dictionary'));
          }
        }
      ]
    },
    {
      key: 'studyMaterials',
      title: lang === 'bn' ? '📚 স্টাডি ম্যাটেরিয়ালস' : '📚 Study Materials',
      icon: BookOpen,
      items: [
        { id: 'textbooks', label: lang === 'bn' ? 'ডিজিটাল পাঠ্যবই' : 'Digital Textbooks', icon: BookOpen },
        { id: 'smart-notes', label: lang === 'bn' ? 'স্মার্ট বোর্ড লেকচার নোটস' : 'Smart Board Notes', icon: PenTool },
        { id: 'all-formulas', label: lang === 'bn' ? 'সকল সূত্র ভান্ডার' : 'All Formulas Library', icon: Sigma },
        { id: 'media-center', label: lang === 'bn' ? 'মিডিয়া সেন্টার ও ভিডিও' : 'Media Center', icon: Film },
        { id: 'book-store', label: lang === 'bn' ? 'ডিজিটাল বুক স্টোর' : 'Digital Book Store', icon: BookMarked }
      ]
    },
    {
      key: 'aiPerformance',
      title: lang === 'bn' ? '🚀 AI ও পারফরম্যান্স' : '🚀 AI & Performance',
      badge: 'AI ACTIVE',
      icon: Brain,
      items: [
        { id: 'ai-routine', label: lang === 'bn' ? 'AI স্টাডি রুটিন ও ট্র্যাকার' : 'AI Study Routine', icon: Brain },
        { id: 'syllabus-map', label: lang === 'bn' ? 'RPG সিলেবাস ম্যাপ' : 'RPG Syllabus Map', icon: Map },
        { id: 'live-battle', label: lang === 'bn' ? '১v১ লাইভ MCQ ব্যাটেল' : '1v1 Live Battle', icon: Swords },
        { id: 'results', label: lang === 'bn' ? 'ফলাফল ও গ্রেডশিট' : 'Results & Report Card', icon: Award }
      ]
    },
    {
      key: 'profileRecords',
      title: lang === 'bn' ? '⚙️ প্রোফাইল ও রেকর্ড' : '⚙️ Profile & Records',
      icon: UserCheck,
      items: [
        { id: 'attendance', label: lang === 'bn' ? 'একাডেমিক প্রগ্রেস ও রিপোর্ট হাব' : 'Academic Progress & Reports', icon: TrendingUp },
        { id: 'fees', label: lang === 'bn' ? 'ফি ও পেমেন্ট হিস্ট্রি' : 'Fees & Payment History', icon: CreditCard },
        { id: 'checkout', label: lang === 'bn' ? 'পেমেন্ট গেটওয়ে ও রিডিম' : 'Payment Gateway', icon: Wallet },
        { id: 'referral-hub', label: lang === 'bn' ? 'রেফারেল ও রিওয়ার্ডস' : 'Referral & Rewards', icon: Gift },
        { id: 'rewards', label: lang === 'bn' ? 'রিওয়ার্ড স্টোর ও কয়েন' : 'Reward Store', icon: Trophy },
        { id: 'teachers', label: lang === 'bn' ? 'শিক্ষক নির্দেশিকা' : 'Teacher Directory', icon: Users },
        { id: 'helpdesk', label: lang === 'bn' ? 'মতামত ও হেল্পডেস্ক' : 'Feedback & Helpdesk', icon: MessageSquarePlus },
        { id: 'notices', label: lang === 'bn' ? 'নোটিশ বোর্ড' : 'Notice Board', icon: BellRing }
      ]
    }
  ];

  // =========================================================================
  // 2. ADMIN CATEGORIZED NAVIGATION
  // =========================================================================
  const adminCategories = [
    {
      key: 'adminCore',
      title: lang === 'bn' ? '🏛️ একাডেমি প্রশাসন' : '🏛️ Core Administration',
      icon: ShieldCheck,
      items: [
        { id: 'approvals', label: lang === 'bn' ? 'অনুমোদন ও যাচাই কেন্দ্র' : 'Approvals Engine', icon: CheckSquare },
        { id: 'admissions', label: lang === 'bn' ? 'নতুন ভর্তি আবেদন' : 'Student Admissions', icon: UserPlus },
        { id: 'students', label: lang === 'bn' ? 'শিক্ষার্থী ব্যবস্থাপনা' : 'Student Directory', icon: GraduationCap },
        { id: 'teachers', label: lang === 'bn' ? 'শিক্ষক ব্যবস্থাপনা' : 'Teacher Directory', icon: Users },
        { id: 'teacher-attendance', label: lang === 'bn' ? 'শিক্ষক হাজিরা ও কর্মঘণ্টা' : 'Teacher Attendance', icon: Clock }
      ]
    },
    {
      key: 'adminAcademics',
      title: lang === 'bn' ? '📖 পাঠ্যক্রম ও মূল্যায়ন' : '📖 Academics & Exams',
      icon: BookOpen,
      items: [
        { id: 'batches-routine', label: lang === 'bn' ? 'ব্যাচ ও সাপ্তাহিক রুটিন' : 'Batches & Routine', icon: Layers },
        { id: 'live-classes', label: lang === 'bn' ? 'লাইভ ক্লাসরুম' : 'Live Classroom', icon: Video },
        { id: 'exams', label: lang === 'bn' ? 'অনলাইন পরীক্ষা ও কুইজ' : 'Online Exams', icon: HelpCircle },
        { id: 'omr-evaluation', label: lang === 'bn' ? 'OMR ফলাফল আমদানি' : 'OMR Evaluation', icon: Award },
        { id: 'results-report', label: lang === 'bn' ? 'ফলাফল ও গ্রেডশিট' : 'Results & Reports', icon: Award },
        { id: 'syllabus-tracker', label: lang === 'bn' ? 'সিলেবাস প্রগ্রেস ট্র্যাকার' : 'Syllabus Tracker', icon: BookOpen },
        { id: 'textbooks', label: lang === 'bn' ? 'ডিজিটাল পাঠ্যবই' : 'Digital Textbooks', icon: BookOpen }
      ]
    },
    {
      key: 'adminFinance',
      title: lang === 'bn' ? '💳 হিসাব ও ফাইন্যান্স' : '💳 Finance & Accounts',
      icon: Wallet,
      items: [
        { id: 'fees', label: lang === 'bn' ? 'ফি ও ইনভয়েস কালেকশন' : 'Fees & Invoices', icon: CreditCard },
        { id: 'accounts-payroll', label: lang === 'bn' ? 'আয়-ব্যয় ও শিক্ষক বেতন' : 'Accounts & Payroll', icon: Wallet },
        { id: 'payment-settings', label: lang === 'bn' ? 'পেমেন্ট মেথড কনফিগ' : 'Payment Settings', icon: Sliders }
      ]
    },
    {
      key: 'adminCms',
      title: lang === 'bn' ? '🎨 কনটেন্ট ও লার্নিং CMS' : '🎨 Content & Learning CMS',
      icon: Sparkles,
      items: [
        { id: 'site-cms', label: lang === 'bn' ? 'গ্লোবাল সাইট কনটেন্ট CMS' : 'Global Site CMS', icon: Sparkles },
        { id: 'dashboard-controls', label: lang === 'bn' ? 'স্টুডেন্ট মেনু কন্ট্রোল' : 'Student Menu Controls', icon: Sliders },
        { id: 'media-center', label: lang === 'bn' ? 'মিডিয়া সেন্টার ও ভিডিও' : 'Media Center', icon: Film },
        { id: 'gamification-cms', label: lang === 'bn' ? 'গ্যামিফিকেশন কন্ট্রোল' : 'Gamification CMS', icon: Zap },
        { id: 'grammar-cms', label: lang === 'bn' ? 'ইংলিশ গ্রামার CMS' : 'English Grammar CMS', icon: BookA },
        { id: 'promo-controls', label: lang === 'bn' ? 'প্রমো ও রেফারেল কন্ট্রোল' : 'Promo & Referral Controls', icon: Tag }
      ]
    },
    {
      key: 'adminSystem',
      title: lang === 'bn' ? '⚙️ সিস্টেম ও সিকিউরিটি' : '⚙️ System & Security',
      icon: Settings,
      items: [
        { id: 'notices', label: lang === 'bn' ? 'নোটিশ বোর্ড' : 'Notice Board', icon: BellRing },
        { id: 'sms-notifications', label: lang === 'bn' ? 'বাল্ক SMS বিজ্ঞপ্তি' : 'Bulk SMS Gateway', icon: MessageSquare },
        { id: 'helpdesk', label: lang === 'bn' ? 'হেল্পডেস্ক ও অভিযোগ' : 'Helpdesk & Feedback', icon: LifeBuoy },
        { id: 'admin-settings', label: lang === 'bn' ? 'একাডেমি সেটিংস' : 'Academy Settings', icon: Sliders },
        { id: 'data-backup', label: lang === 'bn' ? 'ডেটা ব্যাকআপ ও রিস্টোর' : 'Data Backup & Restore', icon: Database },
        { id: 'audit-logs', label: lang === 'bn' ? 'সিকিউরিটি অডিট লগ' : 'Security Audit Logs', icon: ShieldCheck },
        { id: 'admin-profile', label: lang === 'bn' ? 'প্রোফাইল ও সিকিউরিটি' : 'Admin Profile', icon: UserCheck }
      ]
    }
  ];

  // =========================================================================
  // 3. TEACHER CATEGORIZED NAVIGATION
  // =========================================================================
  const teacherCategories = [
    {
      key: 'teacherCore',
      title: lang === 'bn' ? '📋 ক্লাসরুম ও অ্যাক্টিভিটি' : '📋 Classroom & Teaching',
      icon: BookOpen,
      items: [
        { id: 'attendance', label: lang === 'bn' ? 'দৈনিক ক্লাস হাজিরা' : 'Take Attendance', icon: CalendarCheck },
        { id: 'homework', label: lang === 'bn' ? 'হোমওয়ার্ক প্রদান ও চেক' : 'Homework Manager', icon: ClipboardList },
        { id: 'materials', label: lang === 'bn' ? 'স্টাডি ম্যাটেরিয়াল আপলোড' : 'Study Materials', icon: BookMarked },
        { id: 'exams', label: lang === 'bn' ? 'অনলাইন পরীক্ষা প্রণয়ন' : 'Online Exams', icon: HelpCircle },
        { id: 'live-classes', label: lang === 'bn' ? 'লাইভ ক্লাসরুম' : 'Live Classes', icon: Video }
      ]
    },
    {
      key: 'teacherAcademics',
      title: lang === 'bn' ? '📊 ডিরেক্টরি ও রুটিন' : '📊 Records & Routine',
      icon: Layers,
      items: [
        { id: 'students', label: lang === 'bn' ? 'শিক্ষার্থী ডিরেক্টরি (৩৬০°)' : 'Student Directory', icon: GraduationCap },
        { id: 'routine', label: lang === 'bn' ? 'সাপ্তাহিক ক্লাস রুটিন' : 'Weekly Routine', icon: CalendarDays },
        { id: 'results-report', label: lang === 'bn' ? 'ফলাফল ও মার্কশিট' : 'Results Manager', icon: Award },
        { id: 'textbooks', label: lang === 'bn' ? 'ডিজিটাল পাঠ্যবই' : 'Digital Textbooks', icon: BookOpen },
        { id: 'media-center', label: lang === 'bn' ? 'মিডিয়া সেন্টার' : 'Media Center', icon: Film }
      ]
    },
    {
      key: 'teacherProfile',
      title: lang === 'bn' ? '⚙️ হাজিরা ও প্রোফাইল' : '⚙️ Faculty & Settings',
      icon: Clock,
      items: [
        { id: 'my-attendance', label: lang === 'bn' ? 'ব্যক্তিগত পঞ্চ-ইন/আউট' : 'My Attendance (Punch)', icon: Clock },
        { id: 'notices', label: lang === 'bn' ? 'নোটিশ বোর্ড' : 'Notice Board', icon: BellRing },
        { id: 'profile-settings', label: lang === 'bn' ? 'শিক্ষক প্রোফাইল ও সেটিংস' : 'Profile Settings', icon: UserCheck }
      ]
    }
  ];

  // Active Categories based on user role
  const activeCategories = useMemo(() => {
    if (user?.role === 'STUDENT' || user?.role === 'PARENT') {
      return studentCategories;
    } else if (user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN') {
      return adminCategories;
    } else if (user?.role === 'TEACHER') {
      return teacherCategories;
    }
    return [];
  }, [user?.role, lang]);

  // Auto-expand category or dropdown containing current activeTab
  useEffect(() => {
    if (activeCategories.length > 0) {
      activeCategories.forEach((cat) => {
        cat.items.forEach((item) => {
          if (item.id === activeTab) {
            if (collapsedCategories[cat.key]) {
              setCollapsedCategories((prev) => ({ ...prev, [cat.key]: false }));
            }
          }
          if (item.isDropdown && item.subItems) {
            const hasActiveSub = item.subItems.some((sub) => sub.id === activeTab);
            if (hasActiveSub) {
              if (collapsedCategories[cat.key]) {
                setCollapsedCategories((prev) => ({ ...prev, [cat.key]: false }));
              }
              setExpandedDropdowns((prev) => ({ ...prev, [item.id]: true }));
            }
          }
        });
      });
    }
  }, [activeTab, activeCategories]);

  // Filtered categories when search query is entered
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return activeCategories;
    const q = searchQuery.toLowerCase().trim();

    return activeCategories
      .map((cat) => {
        const matchingItems = [];
        cat.items.forEach((item) => {
          if (item.isDropdown && item.subItems) {
            const matchingSub = item.subItems.filter(
              (sub) =>
                sub.label.toLowerCase().includes(q) ||
                sub.id.toLowerCase().includes(q)
            );
            if (
              matchingSub.length > 0 ||
              item.label.toLowerCase().includes(q)
            ) {
              matchingItems.push({
                ...item,
                subItems: matchingSub.length > 0 ? matchingSub : item.subItems
              });
            }
          } else if (
            item.label.toLowerCase().includes(q) ||
            item.id.toLowerCase().includes(q)
          ) {
            matchingItems.push(item);
          }
        });
        return { ...cat, items: matchingItems };
      })
      .filter((cat) => cat.items.length > 0);
  }, [activeCategories, searchQuery]);

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-16 bottom-0 left-0 z-40 w-64 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-r border-slate-200/80 dark:border-slate-800/80 transition-all duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full justify-between p-3.5 overflow-hidden">
          <div className="flex flex-col h-full overflow-hidden">
            {/* User quick pill */}
            <div className="p-3 mb-2.5 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100/60 dark:from-slate-800/90 dark:to-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 flex items-center space-x-3 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-emerald-600/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold text-sm shadow-inner flex-shrink-0">
                {user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN' ? (
                  <ShieldCheck className="w-5 h-5" />
                ) : user?.role === 'TEACHER' ? (
                  <BookOpen className="w-5 h-5" />
                ) : (
                  <GraduationCap className="w-5 h-5" />
                )}
              </div>
              <div className="overflow-hidden min-w-0">
                <p className="text-xs font-black text-slate-800 dark:text-slate-100 truncate">{user?.name}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold truncate">
                    {user?.role === 'PARENT' || user?.role === 'STUDENT'
                      ? (lang === 'bn' ? '🎓 শিক্ষার্থী ও অভিভাবক পোর্টাল' : 'Student & Guardian Portal')
                      : user?.role === 'TEACHER'
                      ? (lang === 'bn' ? '👨‍🏫 শিক্ষক ও ফ্যাকাল্টি পোর্টাল' : 'Faculty & Teacher Portal')
                      : (lang === 'bn' ? '🛡️ একাডেমি কন্ট্রোল সেন্টার' : 'Academy Control Center')}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Menu Search Filter */}
            <div className="relative mb-2">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={lang === 'bn' ? 'মেনু খুঁজুন...' : 'Search menu...'}
                className="w-full pl-8 pr-7 py-1.5 text-[11px] rounded-xl bg-slate-100/90 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Primary Root Dashboard Button */}
            {!searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setActiveTab('dashboard');
                  if (onClose) onClose();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all mb-2.5 shadow-sm group ${
                  activeTab === 'dashboard'
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-emerald-600/30 scale-[1.01]'
                    : 'text-slate-700 dark:text-slate-200 bg-slate-100/80 dark:bg-slate-800/60 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 hover:text-emerald-700 dark:hover:text-emerald-400'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <LayoutDashboard className={`w-4 h-4 transition-transform group-hover:scale-110 ${activeTab === 'dashboard' ? 'text-white' : 'text-emerald-500'}`} />
                  <span>{t('navDashboard')}</span>
                </div>
                {activeTab === 'dashboard' && (
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                )}
              </button>
            )}

            {/* Scrollable Categories List */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-2 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
              {filteredCategories.map((cat) => {
                const isCollapsed = collapsedCategories[cat.key] && !searchQuery;
                const hasActiveItem = cat.items.some((item) => {
                  if (item.id === activeTab) return true;
                  if (item.isDropdown && item.subItems) {
                    return item.subItems.some((sub) => sub.id === activeTab);
                  }
                  return false;
                });
                const CatIcon = cat.icon || FolderOpen;

                return (
                  <div
                    key={cat.key}
                    className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                      hasActiveItem
                        ? 'border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/20 dark:bg-emerald-950/20 shadow-sm'
                        : 'border-slate-100 dark:border-slate-800/80 bg-slate-50/40 dark:bg-slate-900/40 hover:border-slate-200 dark:hover:border-slate-700'
                    }`}
                  >
                    {/* Accordion Category Header */}
                    <button
                      type="button"
                      onClick={() => toggleCategory(cat.key)}
                      className={`w-full flex items-center justify-between px-3 py-2 text-xs font-black transition-colors ${
                        hasActiveItem
                          ? 'text-emerald-700 dark:text-emerald-300'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100/60 dark:hover:bg-slate-800/50'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <CatIcon className={`w-3.5 h-3.5 flex-shrink-0 ${hasActiveItem ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`} />
                        <span className="truncate">{cat.title}</span>
                        {cat.badge && (
                          <span className="px-1.5 py-0.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-[8px] text-white font-mono font-bold tracking-tight shadow-xs flex-shrink-0">
                            {cat.badge}
                          </span>
                        )}
                      </div>
                      {!searchQuery && (
                        isCollapsed ? (
                          <ChevronRight className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        )
                      )}
                    </button>

                    {/* Accordion Sub-items */}
                    {!isCollapsed && (
                      <div className="p-1.5 space-y-1 border-t border-slate-100 dark:border-slate-800/50">
                        {cat.items.map((item) => {
                          // ====================================================
                          // NESTED DROPDOWN (e.g. Chemistry Hub)
                          // ====================================================
                          if (item.isDropdown && item.subItems) {
                            const isDropdownExpanded = (expandedDropdowns[item.id] !== false) || !!searchQuery;
                            const isChildActive = item.subItems.some((sub) => sub.id === activeTab);
                            const DropdownIcon = item.icon || FlaskConical;

                            return (
                              <div
                                key={item.id}
                                className={`rounded-xl border transition-all ${
                                  isChildActive
                                    ? 'border-emerald-300/80 dark:border-emerald-700/80 bg-emerald-500/10 dark:bg-emerald-950/40'
                                    : 'border-emerald-100/60 dark:border-slate-800/80 bg-white/60 dark:bg-slate-800/40'
                                }`}
                              >
                                <button
                                  type="button"
                                  onClick={() => toggleDropdown(item.id)}
                                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs transition-all duration-150 font-black ${
                                    isChildActive
                                      ? 'text-emerald-800 dark:text-emerald-300'
                                      : 'text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400'
                                  }`}
                                >
                                  <div className="flex items-center space-x-2 truncate">
                                    <div className={`p-1 rounded-lg ${isChildActive ? 'bg-emerald-600 text-white' : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400'}`}>
                                      <DropdownIcon className="w-3.5 h-3.5 flex-shrink-0" />
                                    </div>
                                    <span className="truncate">{item.label}</span>
                                    {item.badge && (
                                      <span className="px-1.5 py-0.2 rounded-full bg-emerald-500 text-[8px] text-white font-mono font-bold">
                                        {item.badge}
                                      </span>
                                    )}
                                  </div>
                                  <ChevronDown
                                    className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${
                                      isDropdownExpanded ? 'transform rotate-180' : ''
                                    }`}
                                  />
                                </button>

                                {isDropdownExpanded && (
                                  <div className="pl-3 pr-1.5 pb-1.5 pt-0.5 space-y-0.5 border-l-2 border-emerald-500/30 ml-4 mb-1">
                                    {item.subItems.map((sub) => {
                                      const SubIcon = sub.icon || Atom;
                                      const isSubActive = activeTab === sub.id;

                                      return (
                                        <button
                                          key={sub.id}
                                          type="button"
                                          onClick={() => {
                                            setActiveTab(sub.id);
                                            if (onClose) onClose();
                                          }}
                                          className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-[11px] transition-all group ${
                                            isSubActive
                                              ? 'bg-emerald-600 text-white font-bold shadow-sm shadow-emerald-600/20 translate-x-0.5'
                                              : 'text-slate-600 dark:text-slate-400 font-medium hover:bg-emerald-100/60 dark:hover:bg-slate-800/80 hover:text-emerald-800 dark:hover:text-white hover:translate-x-0.5'
                                          }`}
                                        >
                                          <div className="flex items-center space-x-2 truncate">
                                            <SubIcon className={`w-3 h-3 flex-shrink-0 ${isSubActive ? 'text-white' : 'text-slate-400 group-hover:text-emerald-500'}`} />
                                            <span className="truncate">{sub.label}</span>
                                          </div>
                                          {isSubActive && (
                                            <span className="w-1.5 h-1.5 rounded-full bg-white flex-shrink-0"></span>
                                          )}
                                        </button>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            );
                          }

                          // Standard Single Item
                          const Icon = item.icon;
                          const isActive = activeTab === item.id;

                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => {
                                if (item.isAction && item.action) {
                                  item.action();
                                } else {
                                  setActiveTab(item.id);
                                }
                                if (onClose) onClose();
                              }}
                              className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs transition-all duration-150 group ${
                                isActive
                                  ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-600/20 translate-x-0.5'
                                  : 'text-slate-600 dark:text-slate-400 font-medium hover:bg-slate-100/80 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white hover:translate-x-0.5'
                              }`}
                            >
                              <div className="flex items-center space-x-2.5 truncate">
                                <Icon className={`w-3.5 h-3.5 flex-shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-emerald-500'}`} />
                                <span className="truncate">{item.label}</span>
                              </div>
                              {isActive && (
                                <span className="w-1.5 h-1.5 rounded-full bg-white flex-shrink-0"></span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}

              {filteredCategories.length === 0 && (
                <div className="p-4 text-center text-xs text-slate-400 dark:text-slate-500">
                  <Search className="w-5 h-5 mx-auto mb-1.5 text-slate-300 dark:text-slate-600" />
                  <span>কোনো মেনু পাওয়া যায়নি</span>
                </div>
              )}
            </div>
          </div>

          {/* Academy Info Footer */}
          <div className="pt-2.5 mt-2 border-t border-slate-100 dark:border-slate-800/80 text-center flex-shrink-0">
            <p className="text-[11px] font-black text-slate-800 dark:text-slate-200 tracking-tight">
              {settings?.academyName || 'NextGen Academy'}
            </p>
            <p className="text-[9px] text-slate-400 dark:text-slate-500 font-medium">
              {lang === 'bn' ? 'স্মার্ট একাডেমি প্ল্যাটফর্ম • ২০২৬' : 'Smart Academy Platform • 2026'}
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
