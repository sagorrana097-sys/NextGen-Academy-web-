import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useSettings } from '../../context/SettingsContext';
import { useTheme } from '../../context/ThemeContext';
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
  Lock
} from 'lucide-react';

export default function Navbar({ onToggleSidebar, isSidebarOpen }) {
  const { user, logout } = useAuth();
  const { lang, toggleLanguage, t } = useLanguage();
  const { settings } = useSettings();
  const { theme, toggleTheme, isDark } = useTheme();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Mobile Toggle & Brand */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle Sidebar"
            >
              {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <div className="flex items-center space-x-2.5 sm:space-x-3.5 py-1.5 px-3 sm:px-4 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-amber-500/40 shadow-xl shadow-amber-500/10 ring-1 ring-amber-400/30 group hover:border-amber-400/60 transition-all duration-300">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-950 flex items-center justify-center p-0.5 ring-2 ring-amber-400/50 shadow-md overflow-hidden flex-shrink-0 transition-transform group-hover:scale-105">
                <img
                  src={settings?.logoUrl || '/logo.png'}
                  alt={settings?.academyName || 'NextGen Academy'}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <div className="flex flex-col select-none border-l border-slate-800/90 pl-2.5 sm:pl-3">
                <div className="flex items-baseline space-x-1.5 sm:space-x-2 font-english leading-none">
                  <span className="text-[14px] sm:text-[16px] lg:text-[17px] font-black tracking-[0.16em] bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 bg-clip-text text-transparent drop-shadow-[0_2px_8px_rgba(245,158,11,0.5)]">
                    {settings?.academyName?.split(' ')[0] || 'NextGen'}
                  </span>
                  <span className="text-[11px] sm:text-[13px] lg:text-[13.5px] font-black uppercase tracking-[0.24em] bg-gradient-to-r from-white via-slate-100 to-amber-100 bg-clip-text text-transparent drop-shadow-[0_1px_4px_rgba(255,255,255,0.4)]">
                    {settings?.academyName?.split(' ').slice(1).join(' ') || 'ACADEMY'}
                  </span>
                </div>
                <p className="text-[8.5px] sm:text-[9.5px] text-amber-200/80 tracking-[0.22em] uppercase hidden sm:block font-bold mt-1 font-english">
                  {settings?.tagline || 'LEARN · GROW · SUCCEED'}
                </p>
              </div>
            </div>
          </div>

          {/* Right: Actions (Language, Notif, Role Badge, Profile) */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Dark Mode / Light Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-amber-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all shadow-sm flex items-center justify-center"
              title={isDark ? 'লাইট মোড অন করুন (Switch to Light Mode)' : 'ডার্ক মোড অন করুন (Switch to Dark Mode)'}
              aria-label="Toggle Theme"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400 animate-in spin-in-180" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            {/* Quick Session Lock */}
            <button
              onClick={() => window.dispatchEvent(new Event('nextgen-lock-session'))}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-600 transition-all shadow-sm hidden sm:flex items-center justify-center"
              title="সেশন লক করুন (Lock Dashboard)"
              aria-label="Lock Session"
            >
              <Lock className="w-4 h-4" />
            </button>

            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-emerald-500/40 text-xs sm:text-sm font-medium transition-all"
              title={t('switchLanguage')}
            >
              <Globe className="w-4 h-4 text-emerald-600" />
              <span className="font-semibold">{lang === 'bn' ? 'বাংলা' : 'EN'}</span>
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifMenu(!showNotifMenu)}
                className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 relative transition-colors"
                title={t('notifications')}
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white"></span>
              </button>

              {showNotifMenu && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 p-3 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="text-sm font-bold text-slate-800">{t('notifications')}</span>
                    <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-medium">৩টি নতুন</span>
                  </div>
                  <div className="py-2 space-y-2 text-xs">
                    <div className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                      <p className="font-semibold text-slate-800">১ম সাময়িক পরীক্ষার সময়সূচি প্রকাশিত হয়েছে</p>
                      <p className="text-slate-500 text-[11px] mt-0.5">২ ঘণ্টা আগে • একাডেমি নোটিশ</p>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                      <p className="font-semibold text-slate-800">আগস্ট মাসের বেতন পরিশোধের শেষ তারিখ ৩০ আগস্ট</p>
                      <p className="text-slate-500 text-[11px] mt-0.5">গতকাল • অ্যাকাউন্টস বিভাগ</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Role Badge */}
            {badge && (
              <div className={`hidden md:flex items-center space-x-1.5 px-3 py-1 rounded-full border text-xs font-semibold ${badge.color}`}>
                <BadgeIcon className="w-3.5 h-3.5" />
                <span>{badge.label}</span>
              </div>
            )}

            {/* Profile Dropdown */}
            {user && (
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center space-x-2 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center text-xs font-bold ring-2 ring-emerald-200">
                    {user.name ? user.name.charAt(0) : 'U'}
                  </div>
                  <span className="text-xs font-medium text-slate-700 hidden sm:inline-block max-w-[120px] truncate">
                    {user.name}
                  </span>
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                      <span className="inline-block mt-1 text-[10px] font-semibold uppercase px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md">
                        {user.role}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        logout();
                      }}
                      className="w-full flex items-center space-x-2 px-4 py-2.5 text-xs text-rose-600 hover:bg-rose-50 font-semibold transition-colors"
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
