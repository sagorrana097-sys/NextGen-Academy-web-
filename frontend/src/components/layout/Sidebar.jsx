import React, { useState, useEffect } from 'react';
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
  FlaskConical
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, isOpen, onClose }) {
  const { user } = useAuth();
  const { t, lang } = useLanguage();
  const { settings } = useSettings();

  // Collapsible Accordion State for Categories (Student Dashboard)
  const [collapsedCategories, setCollapsedCategories] = useState({
    academic: false,
    subjectLabs: false,
    studyMaterials: false,
    aiPerformance: false,
    profileRecords: false
  });

  const toggleCategory = (catKey) => {
    setCollapsedCategories((prev) => ({
      ...prev,
      [catKey]: !prev[catKey]
    }));
  };

  // Student Collapsible Category Groupings
  const studentCategories = [
    {
      key: 'academic',
      title: lang === 'bn' ? '🎓 একাডেমিক কার্যক্রম' : '🎓 Academic Core',
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
      badge: 'NEW',
      items: [
        { id: 'geometry-board', label: lang === 'bn' ? 'গণিত: ভার্চুয়াল জ্যামিতি বক্স' : 'Math: Geometry Board', icon: Compass },
        { id: 'math-lab', label: lang === 'bn' ? 'গণিত: মাস্টার ম্যাথ ও আইসিটি ইঞ্জিন' : 'Math: Master Math & ICT', icon: Calculator },
        { id: 'physics-lab', label: lang === 'bn' ? 'পদার্থ: মেগা ফিজিক্স ল্যাব' : 'Physics: Mega Physics Lab', icon: Zap },
        { id: 'chemistry-lab', label: lang === 'bn' ? 'রসায়ন: মাস্টার কেমিস্ট্রি ল্যাব' : 'Chemistry: Master Chemistry Lab', icon: FlaskConical },
        { id: 'bonding-solver', label: lang === 'bn' ? 'রসায়ন: ৫ম অধ্যায় বন্ধন ও ডট-ক্রস' : 'Chemistry: Ch-5 Bonding Solver', icon: Atom },
        { id: 'chemistry-math-solver', label: lang === 'bn' ? 'রসায়ন: ৬ষ্ঠ অধ্যায় AI ম্যাথ সলভার' : 'Chemistry: Ch-6 AI Math Solver', icon: Calculator },
        { id: 'biology-lab', label: lang === 'bn' ? 'জীববিজ্ঞান: মাস্টার বায়োলজি ল্যাব' : 'Biology: Master Biology Lab', icon: Heart },
        { id: 'science-3d', label: lang === 'bn' ? 'বিজ্ঞান: ৩ডি সায়েন্স ল্যাব ও পর্যায় সারণি' : 'Science: 3D Lab & Periodic', icon: Atom },
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
      items: [
        { id: 'idcard', label: lang === 'bn' ? 'ডিজিটাল আইডি কার্ড' : 'Digital ID Card', icon: UserCheck },
        { id: 'attendance', label: lang === 'bn' ? 'উপস্থিতি হিস্ট্রি' : 'Attendance History', icon: CalendarCheck },
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

  // Auto-expand category containing current activeTab
  useEffect(() => {
    if (user?.role === 'STUDENT') {
      const parentCat = studentCategories.find((cat) =>
        cat.items.some((item) => item.id === activeTab)
      );
      if (parentCat && collapsedCategories[parentCat.key]) {
        setCollapsedCategories((prev) => ({
          ...prev,
          [parentCat.key]: false
        }));
      }
    }
  }, [activeTab, user?.role]);

  // Non-Student Menu Items
  const getNonStudentMenuItems = () => {
    switch (user?.role) {
      case 'SUPER_ADMIN':
      case 'ADMIN':
        return [
          { id: 'dashboard', label: t('navDashboard'), icon: LayoutDashboard },
          { id: 'approvals', label: lang === 'bn' ? 'অনুমোদন ও যাচাই কেন্দ্র' : 'Approvals Engine', icon: CheckSquare },
          { id: 'site-cms', label: lang === 'bn' ? 'সাইট কনটেন্ট CMS' : 'Site Content CMS', icon: Sparkles },
          { id: 'dashboard-controls', label: lang === 'bn' ? 'স্টুডেন্ট মেনু কন্ট্রোল' : 'Student Menu Controls', icon: Sliders },
          { id: 'admin-profile', label: lang === 'bn' ? 'প্রোফাইল ও সিকিউরিটি' : 'Profile & Security', icon: UserCheck },
          { id: 'sms-notifications', label: t('navSMS'), icon: MessageSquare },
          { id: 'admissions', label: t('navAdmissions'), icon: UserPlus },
          { id: 'data-backup', label: t('navDataBackup'), icon: Database },
          { id: 'admin-settings', label: t('navAdminSettings'), icon: Sliders },
          { id: 'payment-settings', label: t('navPaymentSettings'), icon: CreditCard },
          { id: 'accounts-payroll', label: t('navAccountsPayroll'), icon: Wallet },
          { id: 'batches-routine', label: t('navBatchesRoutine'), icon: Layers },
          { id: 'syllabus-tracker', label: lang === 'bn' ? 'সিলেবাস প্রগ্রেস ট্র্যাকার' : 'Syllabus Tracker', icon: BookOpen },
          { id: 'omr-evaluation', label: lang === 'bn' ? 'OMR ফলাফল আমদানি' : 'OMR Evaluation', icon: Award },
          { id: 'results-report', label: t('navResultsReport'), icon: Award },
          { id: 'live-classes', label: t('navLiveClasses'), icon: Video },
          { id: 'media-center', label: lang === 'bn' ? 'মিডিয়া সেন্টার ও ভিডিও' : 'Media Center', icon: Film },
          { id: 'gamification-cms', label: lang === 'bn' ? 'গ্যামিফিকেশন কন্ট্রোল' : 'Gamification CMS', icon: Zap },
          { id: 'grammar-cms', label: lang === 'bn' ? 'ইংলিশ গ্রামার CMS' : 'English Grammar CMS', icon: BookA },
          { id: 'promo-controls', label: lang === 'bn' ? 'প্রমো ও রেফারেল কন্ট্রোল' : 'Promo & Referral Controls', icon: Tag },
          { id: 'helpdesk', label: lang === 'bn' ? 'হেল্পডেস্ক ও অভিযোগ' : 'Helpdesk & Complaints', icon: LifeBuoy },
          { id: 'students', label: t('navStudents'), icon: GraduationCap },
          { id: 'teachers', label: t('navTeachers'), icon: Users },
          { id: 'teacher-attendance', label: t('navTeacherAttendance'), icon: Clock },
          { id: 'exams', label: t('navExams'), icon: HelpCircle },
          { id: 'textbooks', label: t('navTextbooks'), icon: BookOpen },
          { id: 'fees', label: t('navFees'), icon: CreditCard },
          { id: 'notices', label: t('navNotices'), icon: BellRing },
          { id: 'audit-logs', label: t('navAuditLogs'), icon: ShieldCheck }
        ];
      case 'TEACHER':
        return [
          { id: 'dashboard', label: t('navDashboard'), icon: LayoutDashboard },
          { id: 'profile-settings', label: t('myProfileSettings'), icon: UserCheck },
          { id: 'results-report', label: t('navResultsReport'), icon: Award },
          { id: 'routine', label: t('navRoutine'), icon: CalendarDays },
          { id: 'live-classes', label: t('navLiveClasses'), icon: Video },
          { id: 'media-center', label: lang === 'bn' ? 'মিডিয়া সেন্টার ও ভিডিও' : 'Media Center', icon: Film },
          { id: 'my-attendance', label: t('myAttendanceTime'), icon: Clock },
          { id: 'exams', label: t('navExams'), icon: HelpCircle },
          { id: 'materials', label: t('navMaterials'), icon: BookMarked },
          { id: 'textbooks', label: t('navTextbooks'), icon: BookOpen },
          { id: 'homework', label: t('navHomework'), icon: ClipboardList },
          { id: 'attendance', label: t('takeAttendance'), icon: CalendarCheck },
          { id: 'students', label: t('navStudents'), icon: GraduationCap },
          { id: 'notices', label: t('navNotices'), icon: BellRing }
        ];
      case 'PARENT':
        return [
          { id: 'dashboard', label: t('navDashboard'), icon: LayoutDashboard },
          { id: 'helpdesk', label: lang === 'bn' ? 'মতামত ও হেল্পডেস্ক' : 'Feedback & Helpdesk', icon: MessageSquarePlus },
          { id: 'teachers', label: t('navTeachers'), icon: Users },
          { id: 'live-classes', label: t('navLiveClasses'), icon: Video },
          { id: 'media-center', label: lang === 'bn' ? 'মিডিয়া সেন্টার ও ভিডিও' : 'Media Center', icon: Film },
          { id: 'exams', label: t('navExams'), icon: HelpCircle },
          { id: 'materials', label: t('navMaterials'), icon: BookMarked },
          { id: 'textbooks', label: t('navTextbooks'), icon: BookOpen },
          { id: 'homework', label: t('navHomework'), icon: ClipboardList },
          { id: 'attendance', label: t('navAttendance'), icon: CalendarCheck },
          { id: 'results', label: t('navResults'), icon: Award },
          { id: 'routine', label: t('navRoutine'), icon: CalendarDays },
          { id: 'fees', label: t('navFees'), icon: CreditCard },
          { id: 'checkout', label: lang === 'bn' ? 'পেমেন্ট ও মানি রিসিট' : 'Payment & Receipt', icon: CreditCard },
          { id: 'notices', label: t('navNotices'), icon: BellRing }
        ];
      default:
        return [{ id: 'dashboard', label: t('navDashboard'), icon: LayoutDashboard }];
    }
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-16 bottom-0 left-0 z-40 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full justify-between p-3.5 overflow-y-auto scrollbar-thin">
          <div>
            {/* User quick pill */}
            <div className="p-3 mb-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/60 flex items-center space-x-3 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-emerald-600/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold text-sm">
                {user?.role === 'ADMIN' && <ShieldCheck className="w-5 h-5" />}
                {user?.role === 'TEACHER' && <BookOpen className="w-5 h-5" />}
                {user?.role === 'PARENT' && <Users className="w-5 h-5" />}
                {user?.role === 'STUDENT' && <GraduationCap className="w-5 h-5" />}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">{user?.name}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 capitalize">{user?.role?.toLowerCase()} Portal</p>
              </div>
            </div>

            {/* Dashboard Overview Primary Button */}
            <button
              type="button"
              onClick={() => {
                setActiveTab('dashboard');
                if (onClose) onClose();
              }}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all mb-3 ${
                activeTab === 'dashboard'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'text-slate-700 dark:text-slate-200 bg-slate-100/80 dark:bg-slate-800/50 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              <LayoutDashboard className={`w-4 h-4 ${activeTab === 'dashboard' ? 'text-white' : 'text-emerald-500'}`} />
              <span>{t('navDashboard')}</span>
            </button>

            {/* ========================================================================= */}
            {/* STUDENT ACCORDION COLLAPSIBLE CATEGORIES */}
            {/* ========================================================================= */}
            {user?.role === 'STUDENT' ? (
              <div className="space-y-2.5">
                {studentCategories.map((cat) => {
                  const isCollapsed = collapsedCategories[cat.key];
                  const hasActiveItem = cat.items.some((item) => item.id === activeTab);

                  return (
                    <div
                      key={cat.key}
                      className="rounded-2xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40 overflow-hidden"
                    >
                      {/* Accordion Category Header Button */}
                      <button
                        type="button"
                        onClick={() => toggleCategory(cat.key)}
                        className={`w-full flex items-center justify-between px-3 py-2 text-xs font-black transition-colors ${
                          hasActiveItem
                            ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-500/10'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 truncate">
                          <span>{cat.title}</span>
                          {cat.badge && (
                            <span className="px-1.5 py-0.2 rounded-full bg-emerald-500 text-[9px] text-white font-mono font-bold">
                              {cat.badge}
                            </span>
                          )}
                        </div>
                        {isCollapsed ? (
                          <ChevronRight className="w-3.5 h-3.5 opacity-60 flex-shrink-0" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5 opacity-60 flex-shrink-0" />
                        )}
                      </button>

                      {/* Accordion Category Items */}
                      {!isCollapsed && (
                        <div className="p-1.5 space-y-0.5 border-t border-slate-100 dark:border-slate-800/60">
                          {cat.items.map((item) => {
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
                                className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                                  isActive
                                    ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/20 font-bold'
                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
                                }`}
                              >
                                <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                                <span className="truncate">{item.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Non-student flat menus */
              <div className="space-y-1">
                {getNonStudentMenuItems()
                  .filter((item) => item.id !== 'dashboard')
                  .map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setActiveTab(item.id);
                          if (onClose) onClose();
                        }}
                        className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                          isActive
                            ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20 font-bold'
                            : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
              </div>
            )}
          </div>

          {/* Academy Info Footer */}
          <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 text-center">
            <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
              {settings?.academyName || 'NextGen Academy'}
            </p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500">
              {lang === 'bn' ? 'স্মার্ট এডুকেশন পোর্টাল' : 'Smart Education Portal'}
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
