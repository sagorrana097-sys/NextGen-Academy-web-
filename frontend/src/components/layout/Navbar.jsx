import React, { useState, useEffect } from 'react';
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
  Bot
} from 'lucide-react';
import DigitalClock from '../common/DigitalClock';
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

  useEffect(() => {
    if (user) {
      studentAPI.getGamification()
        .then(res => {
          if (res && res.data) setStreakData(res.data);
        })
        .catch(err => {});

      if (user.role === 'STUDENT') {
        studentAPI.getCoins()
          .then(res => {
            if (res && res.data) setStudentCoins(res.data.coins);
          })
          .catch(err => {});
      }
    }
  }, [user]);

  const getRoleBadge = (role) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return {
          label: lang === 'bn' ? 'সুপার অ্যাডমিন' : 'Super Admin',
          icon: Shield,
          color: 'bg-rose-100 text-rose-800 border-rose-300 font-extrabold shadow-sm'
        };
      case 'ADMIN':
        return {
          label: lang === 'bn' ? 'অ্যাডমিন' : 'Admin',
          icon: Shield,
          color: 'bg-rose-50 text-rose-700 border-rose-200'
        };
      case 'TEACHER':
        return {
          label: lang === 'bn' ? 'শিক্ষক' : 'Teacher',
          icon: BookOpen,
          color: 'bg-blue-50 text-blue-700 border-blue-200'
        };
      case 'PARENT':
        return {
          label: lang === 'bn' ? 'অভিভাবক' : 'Parent',
          icon: Users,
          color: 'bg-purple-50 text-purple-700 border-purple-200'
        };
      case 'STUDENT':
        return {
          label: lang === 'bn' ? 'শিক্ষার্থী' : 'Student',
          icon: GraduationCap,
          color: 'bg-emerald-50 text-emerald-700 border-emerald-200'
        };
      default:
        return {
          label: role,
          icon: UserIcon,
          color: 'bg-slate-100 text-slate-700 border-slate-200'
        };
    }
  };

  const badge = user ? getRoleBadge(user.role) : null;
  const BadgeIcon = badge ? badge.icon : UserIcon;

  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-3 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Mobile Toggle & Brand */}
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-shrink">
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-1.5 sm:p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none flex-shrink-0"
              aria-label="Toggle Sidebar"
            >
              {isSidebarOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>

            <div className="flex items-center space-x-2 sm:space-x-3 py-1 px-2 sm:py-1.5 sm:px-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-amber-500/40 shadow-xl shadow-amber-500/10 ring-1 ring-amber-400/30 group hover:border-amber-400/60 transition-all duration-300 min-w-0">
              <div className="w-7 h-7 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-lg sm:rounded-xl bg-slate-950 flex items-center justify-center p-0.5 ring-2 ring-amber-400/50 shadow-md overflow-hidden flex-shrink-0 transition-transform group-hover:scale-105">
                <img
                  src={settings?.logoUrl || '/logo.png'}
                  alt={settings?.academyName || 'NextGen Academy'}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <div className="flex flex-col select-none border-l border-slate-800/90 pl-2 sm:pl-3 min-w-0">
                <div className="flex items-baseline space-x-1.5 sm:space-x-2 font-english leading-none">
                  <span className="text-[13px] sm:text-[15px] lg:text-[17px] font-black tracking-[0.12em] sm:tracking-[0.16em] bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 bg-clip-text text-transparent drop-shadow-[0_2px_8px_rgba(245,158,11,0.5)] truncate">
                    {settings?.academyName?.split(' ')[0] || 'NextGen'}
                  </span>
                  <span className="text-[10px] sm:text-[12px] lg:text-[13.5px] font-black uppercase tracking-[0.18em] sm:tracking-[0.24em] bg-gradient-to-r from-white via-slate-100 to-amber-100 bg-clip-text text-transparent drop-shadow-[0_1px_4px_rgba(255,255,255,0.4)] hidden xs:inline">
                    {settings?.academyName?.split(' ').slice(1).join(' ') || 'ACADEMY'}
                  </span>
                </div>
                <p className="text-[8px] sm:text-[9.5px] text-amber-200/80 tracking-[0.22em] uppercase hidden sm:block font-bold mt-0.5 font-english">
                  {settings?.tagline || 'LEARN · GROW · SUCCEED'}
                </p>
              </div>
            </div>
          </div>

          {/* Right: Actions (Language, Notif, Role Badge, Profile) */}
          <div className="flex items-center gap-1.5 sm:gap-3 md:gap-4 flex-shrink-0">
            {/* Student Glowing NextGen Coin Balance */}
            {user?.role === 'STUDENT' && (
              <div className="relative flex-shrink-0">
                <div
                  className="flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-2xl bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-amber-500/20 border border-amber-500/50 text-amber-400 font-black text-xs shadow-md shadow-amber-500/20 select-none animate-pulse"
                  title={`আপনার বর্তমান কয়েন ব্যালেন্স: ${studentCoins} কয়েন`}
                >
                  <span className="text-sm">🪙</span>
                  <span className="font-mono font-black">{studentCoins}</span>
                  <span className="text-[10px] text-amber-200 hidden sm:inline">কয়েন</span>
                </div>
              </div>
            )}

            {/* Daily Study Streak & Gamification Counter */}
            <div className="relative flex-shrink-0">
              <button
                onClick={() => setShowStreakMenu(!showStreakMenu)}
                className="flex items-center space-x-1 sm:space-x-1.5 p-1.5 sm:px-3 sm:py-1.5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/15 to-amber-500/10 border border-amber-500/30 hover:border-amber-400 text-amber-600 dark:text-amber-300 font-extrabold text-xs shadow-sm hover:shadow-amber-500/20 transition-all group active:scale-95 select-none flex-shrink-0"
                title="দৈনিক পড়ার স্ট্রিক ও অর্জনসমূহ (Daily Study Streak & Badges)"
              >
                <div className="relative flex items-center justify-center flex-shrink-0">
                  <Flame className="w-4 h-4 text-orange-500 fill-orange-500 animate-pulse group-hover:scale-110 transition-transform" />
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-amber-400 rounded-full animate-ping"></span>
                </div>
                <span className="tracking-tight hidden xs:inline">
                  {lang === 'bn' ? `${streakData.current_streak} দিন` : `${streakData.current_streak}d`}
                </span>
              </button>

              {/* Streak & Gamification Badges Popover */}
              {showStreakMenu && (
                <div className="absolute right-0 mt-2 w-84 sm:w-96 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-amber-500/30 p-4 z-50 animate-in fade-in slide-in-from-top-2 text-slate-800 dark:text-slate-100">
                  {/* Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center space-x-2">
                      <div className="p-2 rounded-xl bg-orange-500/20 text-orange-500">
                        <Flame className="w-5 h-5 fill-orange-500" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center space-x-1.5">
                          <span>দৈনিক স্ট্রিক ও পয়েন্ট</span>
                          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">নিয়মিত কুইজ দিয়ে স্ট্রিক ধরে রাখুন</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-300 font-mono font-black text-xs">
                      🔥 {streakData.current_streak} দিন সক্রিয়
                    </span>
                  </div>

                  {/* Quick Stats Grid */}
                  <div className="grid grid-cols-3 gap-2 py-3">
                    <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center">
                      <span className="text-[10px] text-slate-500 block font-bold">সর্বোচ্চ স্ট্রিক</span>
                      <span className="font-black text-xs text-orange-500">⚡ {streakData.longest_streak || 12} দিন</span>
                    </div>
                    <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center">
                      <span className="text-[10px] text-slate-500 block font-bold">সঠিক উত্তর</span>
                      <span className="font-black text-xs text-emerald-500">🎯 {streakData.total_correct_answers || 142}টি</span>
                    </div>
                    <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center">
                      <span className="text-[10px] text-slate-500 block font-bold">কুইজ সম্পন্ন</span>
                      <span className="font-black text-xs text-indigo-500">🏆 {streakData.total_quizzes_completed || 18}টি</span>
                    </div>
                  </div>

                  {/* Achievement Badges Showcase */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                      <span className="flex items-center space-x-1">
                        <Trophy className="w-3.5 h-3.5 text-amber-500" />
                        <span>অর্জন ও ব্যাজ (Achievements)</span>
                      </span>
                      <span className="text-[11px] text-amber-500">
                        {streakData.badges?.filter(b => b.unlocked)?.length || 5}/{streakData.badges?.length || 6} আনলকড
                      </span>
                    </div>

                    <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                      {(streakData.badges && streakData.badges.length > 0 ? streakData.badges : [
                        { id: '1', titleBn: 'প্রথম পরীক্ষা সম্পন্ন', icon: '🎯', unlocked: true, description: 'প্রথম মডেল টেস্ট সফলভাবে সম্পন্ন' },
                        { id: '2', titleBn: '৩ দিনের স্ট্রিক মাস্টার', icon: '🔥', unlocked: true, description: 'টানা ৩ দিন কুইজ সম্পন্ন' },
                        { id: '3', titleBn: '৭ দিনের স্ট্রিক লেজেন্ড', icon: '⚡', unlocked: true, description: 'টানা ৭ দিন সক্রিয় অংশগ্রহণ' },
                        { id: '4', titleBn: '১০০+ সঠিক উত্তর চ্যাম্পিয়ন', icon: '🏆', unlocked: true, description: 'মোট ১০০টির বেশি সঠিক উত্তর' },
                        { id: '5', titleBn: 'নিখুঁত স্কোর (১০০% Accuracy)', icon: '⭐', unlocked: true, description: 'যেকোনো পরীক্ষায় পূর্ণ নম্বর' },
                        { id: '6', titleBn: 'মডেল টেস্ট টপার', icon: '👑', unlocked: false, description: 'শীর্ষ ৩ স্থানে অবস্থান' }
                      ]).map((badge, bIdx) => (
                        <div
                          key={bIdx}
                          className={`p-2 rounded-2xl flex items-center justify-between transition-all border ${
                            badge.unlocked
                              ? 'bg-amber-500/10 border-amber-500/30 text-slate-900 dark:text-slate-100'
                              : 'bg-slate-100 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-400 opacity-60'
                          }`}
                        >
                          <div className="flex items-center space-x-2.5 min-w-0">
                            <span className="text-lg">{badge.icon}</span>
                            <div className="truncate">
                              <p className="text-xs font-black truncate">{badge.titleBn}</p>
                              <p className="text-[10px] text-slate-500 truncate">{badge.description}</p>
                            </div>
                          </div>
                          {badge.unlocked ? (
                            <span className="text-[10px] bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full font-extrabold flex items-center space-x-1 shrink-0">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>আনলকড</span>
                            </span>
                          ) : (
                            <span className="text-[10px] bg-slate-200 dark:bg-slate-700 text-slate-500 px-2 py-0.5 rounded-full font-bold shrink-0">
                              লকড
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Dark Mode / Light Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-1.5 sm:p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-amber-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all shadow-sm flex items-center justify-center flex-shrink-0"
              title={isDark ? 'লাইট মোড অন করুন (Switch to Light Mode)' : 'ডার্ক মোড অন করুন (Switch to Dark Mode)'}
              aria-label="Toggle Theme"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400 animate-in spin-in-180" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            {/* Quick Session Lock */}
            <button
              onClick={() => window.dispatchEvent(new Event('nextgen-lock-session'))}
              className="p-1.5 sm:p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-600 transition-all shadow-sm hidden sm:flex items-center justify-center flex-shrink-0"
              title="সেশন লক করুন (Lock Dashboard)"
              aria-label="Lock Session"
            >
              <Lock className="w-4 h-4" />
            </button>

            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="flex items-center space-x-1.5 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-emerald-500/40 text-xs sm:text-sm font-medium transition-all flex-shrink-0"
              title={t('switchLanguage')}
              aria-label="Switch Language"
            >
              <Globe className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
              <span className="hidden sm:inline-block font-semibold">{lang === 'bn' ? 'বাংলা' : 'EN'}</span>
            </button>

            {/* Live Real-Time Digital Clock Widget */}
            <DigitalClock className="hidden md:flex" />

            {/* Notifications */}
            <div className="relative flex-shrink-0">
              <button
                onClick={() => setShowNotifMenu(!showNotifMenu)}
                className="p-1.5 sm:p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 relative transition-colors flex-shrink-0"
                title={t('notifications')}
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 sm:w-2.5 h-2 sm:h-2.5 bg-rose-500 rounded-full ring-2 ring-white dark:ring-slate-900"></span>
              </button>

              {showNotifMenu && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 p-3 z-50 animate-in fade-in slide-in-from-top-2 text-slate-800 dark:text-slate-100">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-sm font-bold text-slate-800 dark:text-white">{t('notifications')}</span>
                    <span className="text-xs bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 px-2 py-0.5 rounded-full font-medium">৩টি নতুন</span>
                  </div>
                  <div className="py-2 space-y-2 text-xs">
                    <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 transition-colors">
                      <p className="font-semibold text-slate-800 dark:text-slate-100">১ম সাময়িক পরীক্ষার সময়সূচি প্রকাশিত হয়েছে</p>
                      <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">২ ঘণ্টা আগে • একাডেমি নোটিশ</p>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 transition-colors">
                      <p className="font-semibold text-slate-800 dark:text-slate-100">আগস্ট মাসের বেতন পরিশোধের শেষ তারিখ ৩০ আগস্ট</p>
                      <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">গতকাল • অ্যাকাউন্টস বিভাগ</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Secret Admin AI System Health Trigger (Visible ONLY to Admins & Super Admins) */}
            {(user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN') && (
              <>
                <button
                  type="button"
                  onClick={() => setShowAiHealthModal(true)}
                  className="flex items-center space-x-1 sm:space-x-1.5 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-gradient-to-r from-emerald-500/15 via-teal-500/15 to-indigo-500/15 border border-emerald-500/30 hover:border-emerald-400 text-emerald-700 dark:text-emerald-300 text-xs font-black shadow-sm transition-all active:scale-95 group flex-shrink-0"
                  title="AI System Health & Auto-Recovery (Secret Admin Dashboard)"
                >
                  <Bot className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 group-hover:rotate-12 transition-transform flex-shrink-0" />
                  <span className="hidden sm:inline font-mono">AI Health 🤖</span>
                </button>

                <AdminAISystemHealthModal
                  isOpen={showAiHealthModal}
                  onClose={() => setShowAiHealthModal(false)}
                />
              </>
            )}

            {/* Role Badge */}
            {badge && (
              <div className={`hidden md:flex items-center space-x-1.5 px-3 py-1 rounded-full border text-xs font-semibold flex-shrink-0 ${badge.color}`}>
                <BadgeIcon className="w-3.5 h-3.5" />
                <span>{badge.label}</span>
              </div>
            )}

            {/* Profile Dropdown */}
            {user && (
              <div className="relative flex-shrink-0">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center space-x-1.5 sm:space-x-2 p-1 sm:p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex-shrink-0"
                  aria-label="User Profile Menu"
                >
                  <div className="w-8 h-8 rounded-full flex-shrink-0 bg-emerald-700 text-white flex items-center justify-center text-xs font-bold ring-2 ring-emerald-200 dark:ring-emerald-800">
                    {user.name ? user.name.charAt(0) : 'U'}
                  </div>
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-200 hidden sm:inline-block max-w-[100px] md:max-w-[140px] truncate">
                    {user.name}
                  </span>
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 text-slate-800 dark:text-slate-100">
                    <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{user.name}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                      <span className="inline-block mt-1 text-[10px] font-semibold uppercase px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-md">
                        {user.role}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        logout();
                      }}
                      className="w-full flex items-center space-x-2 px-4 py-2.5 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 font-semibold transition-colors"
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
