import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import {
  Sparkles,
  Plus,
  UserPlus,
  BellRing,
  CreditCard,
  MessageSquare,
  Lock,
  Sun,
  Moon,
  X,
  Zap,
  ShieldAlert
} from 'lucide-react';

export default function AdminQuickFloater({
  onOpenStudentModal,
  onOpenNoticeModal,
  onOpenCashModal,
  onNavigate
}) {
  const [isOpen, setIsOpen] = useState(false);
  const { lang } = useLanguage();
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Expanded Menu */}
      {isOpen && (
        <div className="mb-3 p-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl space-y-2 animate-in slide-in-from-bottom-5 duration-200 w-60">
          <div className="flex items-center justify-between px-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center space-x-1.5 text-xs font-black text-slate-800 dark:text-slate-100">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>কুইক কমান্ড সেন্টার</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-1">
            {/* Add Student */}
            <button
              onClick={() => {
                setIsOpen(false);
                if (onOpenStudentModal) onOpenStudentModal();
              }}
              className="w-full flex items-center space-x-2.5 p-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
            >
              <div className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300">
                <UserPlus className="w-3.5 h-3.5" />
              </div>
              <span>নতুন শিক্ষার্থী ভর্তি</span>
            </button>

            {/* Cash Payment */}
            <button
              onClick={() => {
                setIsOpen(false);
                if (onOpenCashModal) onOpenCashModal();
              }}
              className="w-full flex items-center space-x-2.5 p-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-teal-50 dark:hover:bg-teal-950/40 hover:text-teal-700 dark:hover:text-teal-300 transition-colors"
            >
              <div className="p-1.5 rounded-lg bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300">
                <CreditCard className="w-3.5 h-3.5" />
              </div>
              <span>অফলাইন ক্যাশ রিসিট</span>
            </button>

            {/* Publish Notice */}
            <button
              onClick={() => {
                setIsOpen(false);
                if (onOpenNoticeModal) onOpenNoticeModal();
              }}
              className="w-full flex items-center space-x-2.5 p-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
            >
              <div className="p-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300">
                <BellRing className="w-3.5 h-3.5" />
              </div>
              <span>জরুরি নোটিশ প্রকাশ</span>
            </button>

            {/* Send Bulk SMS */}
            <button
              onClick={() => {
                setIsOpen(false);
                if (onNavigate) onNavigate('sms-notifications');
              }}
              className="w-full flex items-center space-x-2.5 p-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-purple-50 dark:hover:bg-purple-950/40 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
            >
              <div className="p-1.5 rounded-lg bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300">
                <MessageSquare className="w-3.5 h-3.5" />
              </div>
              <span>বাল্ক এসএমএস বার্তা</span>
            </button>

            {/* Quick Session Lock */}
            <button
              onClick={() => {
                setIsOpen(false);
                window.dispatchEvent(new Event('nextgen-lock-session'));
              }}
              className="w-full flex items-center space-x-2.5 p-2 rounded-xl text-xs font-bold text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
            >
              <div className="p-1.5 rounded-lg bg-rose-100 dark:bg-rose-900 text-rose-700 dark:text-rose-300">
                <Lock className="w-3.5 h-3.5" />
              </div>
              <span>সেশন লক করুন</span>
            </button>

            {/* Toggle Dark Mode */}
            <button
              onClick={() => {
                toggleTheme();
              }}
              className="w-full flex items-center space-x-2.5 p-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-amber-500">
                {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
              </div>
              <span>{isDark ? 'লাইট থিম অন করুন' : 'ডার্ক থিম অন করুন'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-3xl bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-900 dark:from-emerald-600 dark:to-teal-600 text-white flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 border border-white/20 ring-4 ring-indigo-500/20 dark:ring-emerald-500/20 group"
        title="Quick Actions Command Center"
        aria-label="Quick Actions"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <div className="relative">
            <Zap className="w-6 h-6 text-amber-400 group-hover:rotate-12 transition-transform" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping" />
          </div>
        )}
      </button>
    </div>
  );
}
