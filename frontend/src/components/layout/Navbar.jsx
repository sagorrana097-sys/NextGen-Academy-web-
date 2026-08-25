import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useSettings } from '../../context/SettingsContext';
import { useTheme } from '../../context/ThemeContext';
import { studentAPI } from '../../services/api';
import {
  Bell,
  Globe,
  LogOut,
  User as UserIcon,
  Shield,
  GraduationCap,
  Users,
  BookOpen,
  Menu,
  X,
  Sun,
  Moon,
  Lock,
  Flame,
  Trophy,
  Award,
  Zap,
  Sparkles,
  CheckCircle2,
  Bot,
  Activity,
  ChevronDown
} from 'lucide-react';
import DigitalClock from '../common/DigitalClock';
import UserAvatar from '../common/UserAvatar';
import AdminAISystemHealthModal from '../admin/AdminAISystemHealthModal';

export default function Navbar({ onToggleSidebar, isSidebarOpen }) {
  const { user, logout } = useAuth();
  const { lang, toggleLanguage, t } = useLanguage();
  const { settings } = useSettings();
  const { theme, toggleTheme, isDark } = useTheme();
  
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showStreakMenu, setShowStreakMenu] = useState(false);
  const [showAiHealthModal, setShowAiHealthModal] = useState(false);
  const [studentCoins, setStudentCoins] = useState(150);
  const [streakData, setStreakData] = useState({
    current_streak: 5,
    longest_streak: 12,
    total_correct_answers: 142,
    total_quizzes_completed: 18,
    badges: []
  });

  const profileRef = useRef(null);
  const notifRef = useRef(null);
  const streakRef = useRef(null);

  // Close popovers on click outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifMenu(false);
      }
      if (streakRef.current && !streakRef.current.contains(e.target)) {
        setShowStreakMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (user) {
      studentAPI.getGamification()
        .then(res => {
          if (res?.data) setStreakData(res.data);
        })
        .catch(() => {});

      if (user.role === 'STUDENT') {
        studentAPI.getCoins()
          .then(res => {
            if (res?.data) setStudentCoins(res.data.coins);
          })
          .catch(() => {});
      }
    }
  }, [user]);

  const getRoleBadge = (role) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return {
          label: lang === 'bn' ? 'সুপার অ্যাডমিন' : 'Super Admin',
          icon: Shield,
          color: 'bg-rose-500/15 text-rose-300 border-rose-500/40 shadow-rose-500/10'
        };
      case 'ADMIN':
        return {
          label: lang === 'bn' ? 'অ্যাডমিন' : 'Admin',
          icon: Shield,
          color: 'bg-amber-500/15 text-amber-300 border-amber-500/40 shadow-amber-500/10'
        };
      case 'TEACHER':
        return {
          label: lang === 'bn' ? 'শিক্ষক' : 'Teacher',
          icon: BookOpen,
          color: 'bg-blue-500/15 text-blue-300 border-blue-500/40 shadow-blue-500/10'
        };
      case 'PARENT':
        return null;
      case 'STUDENT':
        return {
          label: lang === 'bn' ? 'শিক্ষার্থী' : 'Student',
          icon: GraduationCap,
          color: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40 shadow-emerald-500/10'
        };
      default:
        return null;
    }
  };

  const badge = user ? getRoleBadge(user.role) : null;
  const BadgeIcon = badge ? badge.icon : UserIcon;

  return (
    <header className="sticky top-0 z-30 w-full bg-slate-950/85 dark:bg-slate-950/90 backdrop-blur-xl backdrop-saturate-150 border-b border-slate-800/80 shadow-[0_4px_30px_rgba(0,0,0,0.35)] transition-all duration-300 select-none">
      {/* Top Ambient Glow Line */}
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-emerald-500 via-amber-400 via-cyan-400 to-indigo-500 opacity-80" />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-18">
          
          {/* ============================================================ */}
          {/* LEFT: Mobile Sidebar Toggle + Brand Logo & Title */}
          {/* ============================================================ */}
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-max flex-shrink-0">
            {/* Mobile Menu Hamburger Button */}
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 transition-all focus:outline-none flex-shrink-0 active:scale-95 shadow-sm"
              aria-label="Toggle Sidebar"
            >
              {isSidebarOpen ? (
                <X className="w-5 h-5 text-amber-400" />
              ) : (
                <Menu className="w-5 h-5 text-slate-300" />
              )}
            </button>

            {/* Brand Logo & Name Crest */}
            <div className="flex items-center space-x-2 sm:space-x-3 py-1 px-2.5 sm:py-1.5 sm:px-3.5 rounded-2xl bg-gradient-to-r from-slate-900/95 via-slate-900/80 to-slate-950/95 border border-amber-500/30 hover:border-amber-400/60 shadow-[0_0_20px_rgba(245,158,11,0.08)] ring-1 ring-amber-500/20 group transition-all duration-300 flex-shrink-0">
              <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-xl bg-slate-950 flex items-center justify-center p-0.5 ring-2 ring-amber-400/50 group-hover:ring-amber-400 shadow-md shadow-amber-500/20 overflow-hidden flex-shrink-0 transition-transform duration-300 group-hover:scale-105">
                <img
                  src={settings?.logoUrl || '/logo.png'}
                  alt={settings?.academyName || 'NextGen Academy'}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>

              <div className="flex flex-col border-l border-slate-800/80 pl-2 sm:pl-3 justify-center">
                {/* Brand Title: NextGen + Academy */}
                <div className="flex items-baseline gap-1 sm:gap-1.5 leading-none font-english">
                  <span className="text-sm sm:text-base lg:text-[17px] font-black tracking-[0.06em] sm:tracking-[0.12em] bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 bg-clip-text text-transparent drop-shadow-[0_2px_10px_rgba(245,158,11,0.4)] whitespace-nowrap">
                    {settings?.academyName?.split(' ')[0] || 'NextGen'}
                  </span>
                  <span className="text-[11px] sm:text-[12px] lg:text-[13px] font-black uppercase tracking-[0.14em] sm:tracking-[0.20em] bg-gradient-to-r from-white via-slate-100 to-amber-100 bg-clip-text text-transparent drop-shadow-[0_1px_4px_rgba(255,255,255,0.3)] whitespace-nowrap">
                    {settings?.academyName?.split(' ').slice(1).join(' ') || 'ACADEMY'}
                  </span>
                </div>
                <p className="text-[7.5px] sm:text-[8.5px] text-amber-300/80 tracking-[0.18em] uppercase font-bold mt-0.5 sm:mt-1 font-english whitespace-nowrap">
                  {settings?.tagline || 'LEARN · GROW · SUCCEED'}
                </p>
              </div>
            </div>
          </div>

          {/* ============================================================ */}
          {/* RIGHT: Quick Action Badges, Toggles & Profile Controls */}
          {/* ============================================================ */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 md:gap-3 flex-shrink-0">
            
            {/* Student Coin Balance Badge */}
            {user?.role === 'STUDENT' && (
              <div className="relative flex-shrink-0">
                <div
                  className="flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/40 text-amber-300 font-black text-xs shadow-sm hover:border-amber-400 transition-all select-none"
                  title={`আপনার মোট কয়েন ব্যালেন্স: ${studentCoins} কয়েন`}
                >
                  <span className="text-sm">🪙</span>
                  <span className="font-mono font-bold text-amber-200">{studentCoins}</span>
                  <span className="text-[10px] text-amber-300/80 hidden sm:inline">কয়েন</span>
                </div>
              </div>
            )}

            {/* Daily Streak Trigger */}
            <div className="relative flex-shrink-0" ref={streakRef}>
              <button
                type="button"
                onClick={() => setShowStreakMenu(!showStreakMenu)}
                className="flex items-center space-x-1 sm:space-x-1.5 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-orange-500/10 border border-orange-500/30 hover:border-orange-400 text-orange-300 font-extrabold text-xs shadow-sm hover:shadow-[0_0_12px_rgba(249,115,22,0.2)] transition-all group active:scale-95 select-none"
                title="দৈনিক স্ট্রিক ও অর্জনসমূহ (Streak & Badges)"
              >
                <div className="relative flex items-center justify-center">
                  <Flame className="w-4 h-4 text-orange-400 fill-orange-400/80 group-hover:scale-110 transition-transform" />
                  <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-amber-400 rounded-full animate-ping" />
                </div>
                <span className="font-mono tracking-tight hidden xs:inline text-orange-200">
                  {lang === 'bn' ? `${streakData.current_streak} দিন` : `${streakData.current_streak}d`}
                </span>
              </button>

              {/* Streak Dropdown Card */}
              {showStreakMenu && (
                <div className="absolute right-0 mt-2 w-80 sm:w-92 bg-slate-900/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-amber-500/30 p-4 z-50 text-slate-100 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div className="flex items-center space-x-2">
                      <div className="p-2 rounded-xl bg-orange-500/20 text-orange-400">
                        <Flame className="w-5 h-5 fill-orange-500" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-white flex items-center space-x-1.5">
                          <span>দৈনিক স্ট্রিক ও পয়েন্ট</span>
                          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        </h4>
                        <p className="text-[11px] text-slate-400">নিয়মিত প্র্যাকটিস করে স্ট্রিক ধরে রাখুন</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold text-xs border border-amber-500/30">
                      🔥 {streakData.current_streak} দিন
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 py-3">
                    <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
                      <span className="text-[10px] text-slate-400 block">সর্বোচ্চ</span>
                      <span className="font-bold text-xs text-orange-400 font-mono">⚡ {streakData.longest_streak || 12} দিন</span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
                      <span className="text-[10px] text-slate-400 block">সঠিক</span>
                      <span className="font-bold text-xs text-emerald-400 font-mono">🎯 {streakData.total_correct_answers || 142}টি</span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
                      <span className="text-[10px] text-slate-400 block">কুইজ</span>
                      <span className="font-bold text-xs text-indigo-400 font-mono">🏆 {streakData.total_quizzes_completed || 18}টি</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Secret Admin AI System Health Trigger */}
            {(user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN') && (
              <>
                <button
                  type="button"
                  onClick={() => setShowAiHealthModal(true)}
                  className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500/15 via-teal-500/15 to-emerald-500/15 border border-emerald-500/40 hover:border-emerald-400 text-emerald-300 text-xs font-bold shadow-[0_0_15px_rgba(16,185,129,0.12)] hover:shadow-[0_0_20px_rgba(16,185,129,0.25)] transition-all active:scale-95 group flex-shrink-0"
                  title="AI System Health & Auto-Recovery"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                  </span>
                  <Bot className="w-3.5 h-3.5 text-emerald-400 group-hover:rotate-12 transition-transform" />
                  <span className="hidden sm:inline font-mono tracking-wider text-[11px] uppercase">AI Health</span>
                </button>

                <AdminAISystemHealthModal
                  isOpen={showAiHealthModal}
                  onClose={() => setShowAiHealthModal(false)}
                />
              </>
            )}

            {/* Live Real-Time Digital Clock */}
            <div className="hidden lg:flex items-center">
              <DigitalClock />
            </div>

            {/* Dark / Light Theme Switcher */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-amber-300 hover:text-amber-200 transition-all shadow-sm flex items-center justify-center flex-shrink-0 active:scale-95"
              title={isDark ? 'লাইট মোড অন করুন' : 'ডার্ক মোড অন করুন'}
              aria-label="Toggle Theme"
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400 animate-in spin-in-180 duration-300" />
              ) : (
                <Moon className="w-4 h-4 text-slate-300" />
              )}
            </button>

            {/* Language Switcher */}
            <button
              type="button"
              onClick={toggleLanguage}
              className="flex items-center space-x-1.5 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-all flex-shrink-0 active:scale-95 shadow-sm"
              title={t('switchLanguage')}
              aria-label="Switch Language"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
              <span className="hidden sm:inline font-mono">{lang === 'bn' ? 'বাংলা' : 'EN'}</span>
            </button>

            {/* Quick Session Lock */}
            <button
              type="button"
              onClick={() => window.dispatchEvent(new Event('nextgen-lock-session'))}
              className="p-2 rounded-xl bg-slate-900/80 hover:bg-rose-950/40 border border-slate-800 hover:border-rose-500/40 text-slate-400 hover:text-rose-300 transition-all shadow-sm hidden sm:flex items-center justify-center flex-shrink-0 active:scale-95"
              title="সেশন লক করুন (Lock Session)"
              aria-label="Lock Session"
            >
              <Lock className="w-3.5 h-3.5" />
            </button>

            {/* Notifications Menu Trigger */}
            <div className="relative flex-shrink-0" ref={notifRef}>
              <button
                type="button"
                onClick={() => setShowNotifMenu(!showNotifMenu)}
                className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white relative transition-all flex-shrink-0 active:scale-95 shadow-sm"
                title={t('notifications')}
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-slate-950 animate-pulse" />
              </button>

              {/* Notification Popover */}
              {showNotifMenu && (
                <div className="absolute right-0 mt-2 w-80 sm:w-84 bg-slate-900/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-slate-800 p-3.5 z-50 animate-in fade-in slide-in-from-top-2 text-slate-100">
                  <div className="flex items-center justify-between pb-2.5 border-b border-slate-800">
                    <span className="text-xs font-bold text-white uppercase tracking-wider">{t('notifications')}</span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold border border-emerald-500/30">৩টি নতুন</span>
                  </div>
                  <div className="py-2 space-y-1.5 text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800/80 transition-colors">
                      <p className="font-semibold text-slate-200">১ম সাময়িক পরীক্ষার সময়সূচি প্রকাশিত হয়েছে</p>
                      <p className="text-slate-400 text-[10px] mt-0.5">২ ঘণ্টা আগে • একাডেমি নোটিশ</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800/80 transition-colors">
                      <p className="font-semibold text-slate-200">চলতি মাসের বেতন পরিশোধের শেষ তারিখ ৩০ আগস্ট</p>
                      <p className="text-slate-400 text-[10px] mt-0.5">গতকাল • অ্যাকাউন্টস বিভাগ</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Role Pill Badge (Desktop) */}
            {badge && (
              <div className={`hidden md:flex items-center space-x-1.5 px-3 py-1 rounded-xl border text-xs font-bold flex-shrink-0 shadow-sm ${badge.color}`}>
                <BadgeIcon className="w-3.5 h-3.5" />
                <span>{badge.label}</span>
              </div>
            )}

            {/* Profile Avatar & Menu Dropdown */}
            {user && (
              <div className="relative flex-shrink-0" ref={profileRef}>
                <button
                  type="button"
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center space-x-2 p-1 sm:p-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 transition-all flex-shrink-0 group active:scale-95 shadow-sm"
                  aria-label="User Profile Menu"
                >
                  <UserAvatar
                    src={user.photo || user.avatar || user.profilePhoto}
                    name={user.name}
                    role={user.role}
                    size="sm"
                    shape="rounded-lg"
                    ringColor="ring-emerald-500/30 group-hover:ring-emerald-400"
                  />
                  <div className="hidden sm:flex flex-col text-left max-w-[100px] md:max-w-[130px]">
                    <span className="text-xs font-bold text-slate-200 group-hover:text-white truncate">
                      {user.name}
                    </span>
                    {user.role && user.role !== 'PARENT' && (
                      <span className="text-[9px] text-slate-400 font-mono truncate">
                        {user.role}
                      </span>
                    )}
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-200 hidden sm:block transition-transform duration-200" />
                </button>

                {/* Profile Popover */}
                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-slate-900/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-slate-800 py-2 z-50 animate-in fade-in slide-in-from-top-2 text-slate-100">
                    <div className="px-4 py-3 border-b border-slate-800 flex items-center space-x-3">
                      <UserAvatar
                        src={user.photo || user.avatar || user.profilePhoto}
                        name={user.name}
                        role={user.role}
                        size="md"
                        shape="rounded-xl"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-white truncate">{user.name}</p>
                        <p className="text-[11px] text-slate-400 truncate">{user.email || user.phone}</p>
                        {user.role && user.role !== 'PARENT' && (
                          <div className="mt-1 inline-flex items-center px-2 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-[10px] font-bold text-emerald-300 uppercase">
                            {user.role}
                          </div>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setShowProfileMenu(false);
                        logout();
                      }}
                      className="w-full flex items-center space-x-2 px-4 py-2.5 text-xs text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 font-bold transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>{t('logout')}</span>
                    </button>
                  </div>
                )}
              </div>
            )}

          </div>

        </div>
      </div>
    </header>
  );
}
