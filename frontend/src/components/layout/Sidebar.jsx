import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
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
  Sparkles
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, isOpen, onClose }) {
  const { user } = useAuth();
  const { t, lang } = useLanguage();

  const getMenuItems = () => {
    switch (user?.role) {
      case 'SUPER_ADMIN':
      case 'ADMIN':
        return [
          { id: 'dashboard', label: t('navDashboard'), icon: LayoutDashboard },
          { id: 'approvals', label: lang === 'bn' ? 'অনুমোদন ও যাচাই কেন্দ্র' : 'Approvals Engine', icon: CheckSquare },
          { id: 'site-cms', label: lang === 'bn' ? 'সাইট কনটেন্ট CMS' : 'Site Content CMS', icon: Sparkles },
          { id: 'admin-profile', label: lang === 'bn' ? 'প্রোফাইল ও সিকিউরিটি' : 'Profile & Security', icon: UserCheck },
          { id: 'sms-notifications', label: t('navSMS'), icon: MessageSquare },
          { id: 'admissions', label: t('navAdmissions'), icon: UserPlus },
          { id: 'data-backup', label: t('navDataBackup'), icon: Database },
          { id: 'admin-settings', label: t('navAdminSettings'), icon: Sliders },
          { id: 'payment-settings', label: t('navPaymentSettings'), icon: CreditCard },
          { id: 'accounts-payroll', label: t('navAccountsPayroll'), icon: Wallet },
          { id: 'batches-routine', label: t('navBatchesRoutine'), icon: Layers },
          { id: 'results-report', label: t('navResultsReport'), icon: Award },
          { id: 'live-classes', label: t('navLiveClasses'), icon: Video },
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
          { id: 'teachers', label: t('navTeachers'), icon: Users },
          { id: 'live-classes', label: t('navLiveClasses'), icon: Video },
          { id: 'exams', label: t('navExams'), icon: HelpCircle },
          { id: 'materials', label: t('navMaterials'), icon: BookMarked },
          { id: 'textbooks', label: t('navTextbooks'), icon: BookOpen },
          { id: 'homework', label: t('navHomework'), icon: ClipboardList },
          { id: 'attendance', label: t('navAttendance'), icon: CalendarCheck },
          { id: 'results', label: t('navResults'), icon: Award },
          { id: 'routine', label: t('navRoutine'), icon: CalendarDays },
          { id: 'fees', label: t('navFees'), icon: CreditCard },
          { id: 'notices', label: t('navNotices'), icon: BellRing }
        ];
      case 'STUDENT':
        return [
          { id: 'dashboard', label: t('navDashboard'), icon: LayoutDashboard },
          { id: 'teachers', label: t('navTeachers'), icon: Users },
          { id: 'live-classes', label: t('navLiveClasses'), icon: Video },
          { id: 'exams', label: t('navExams'), icon: HelpCircle },
          { id: 'materials', label: t('navMaterials'), icon: BookMarked },
          { id: 'textbooks', label: t('navTextbooks'), icon: BookOpen },
          { id: 'homework', label: t('navHomework'), icon: ClipboardList },
          { id: 'idcard', label: t('digitalIdCard'), icon: UserCheck },
          { id: 'attendance', label: t('navAttendance'), icon: CalendarCheck },
          { id: 'results', label: t('navResults'), icon: Award },
          { id: 'routine', label: t('navRoutine'), icon: CalendarDays },
          { id: 'fees', label: t('navFees'), icon: CreditCard },
          { id: 'notices', label: t('navNotices'), icon: BellRing }
        ];
      default:
        return [{ id: 'dashboard', label: t('navDashboard'), icon: LayoutDashboard }];
    }
  };

  const menuItems = getMenuItems();

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
        <div className="flex flex-col h-full justify-between p-4 overflow-y-auto">
          <div>
            {/* User quick pill */}
            <div className="p-3 mb-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/60 flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-600/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold text-sm">
                {user?.role === 'ADMIN' && <ShieldCheck className="w-5 h-5" />}
                {user?.role === 'TEACHER' && <BookOpen className="w-5 h-5" />}
                {user?.role === 'PARENT' && <Users className="w-5 h-5" />}
                {user?.role === 'STUDENT' && <GraduationCap className="w-5 h-5" />}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">{user?.name}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 capitalize">{user?.role?.toLowerCase()} Mode</p>
              </div>
            </div>

            {/* Menu items */}
            <div className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      if (onClose) onClose();
                    }}
                    className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400 dark:text-slate-400'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Academy Info Footer */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
            <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500">
              NextGen Academy BD v1.0
            </p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500">
              {lang === 'bn' ? 'স্মার্ট বাংলাদেশ এডুকেশন পোর্টাল' : 'Smart BD Education Portal'}
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
