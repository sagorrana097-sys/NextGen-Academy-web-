import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useSettings } from '../context/SettingsContext';
import OnlineAdmissionForm from '../components/public/OnlineAdmissionForm';
import FloatingWhatsAppSupport from '../components/common/FloatingWhatsAppSupport';
import HallOfFameShowcase from '../components/common/HallOfFameShowcase';
import GazipurCampusLocationCard from '../components/common/GazipurCampusLocationCard';
import NewsTicker from '../components/layout/NewsTicker';
import ForgotPasswordModal from '../components/auth/ForgotPasswordModal';
import {
  GraduationCap,
  Shield,
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  Sparkles,
  CheckCircle2,
  UserPlus,
  User as UserIcon,
  Eye,
  EyeOff,
  KeyRound,
  ArrowLeft,
  ShieldCheck,
  Zap
} from 'lucide-react';

export default function Login() {
  const { login, loginWith2FA, loading, error: authError, clearError } = useAuth();
  const { t, lang, toggleLanguage } = useLanguage();
  const { settings } = useSettings();

  const [showAdmissionForm, setShowAdmissionForm] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState(null);

  // 2FA Verification Step
  const [is2FAStep, setIs2FAStep] = useState(false);
  const [tempToken2FA, setTempToken2FA] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [twoFactorUser, setTwoFactorUser] = useState(null);

  // Auto-clear errors as soon as the user starts typing in any input field
  useEffect(() => {
    if (localError) setLocalError(null);
    if (authError && clearError) clearError();
  }, [identifier, password, twoFactorCode]);

  const getFriendlyErrorMessage = (resOrErr) => {
    const status = resOrErr?.status || resOrErr?.response?.status;
    const rawMsg = (resOrErr?.error || resOrErr?.message || resOrErr?.error?.message || '').toLowerCase();

    // If server returned a meaningful Bengali message, display it directly
    if (resOrErr?.error && typeof resOrErr.error === 'string' && /[\u0980-\u09FF]/.test(resOrErr.error)) {
      return resOrErr.error;
    }
    if (resOrErr?.error?.message && typeof resOrErr.error.message === 'string' && /[\u0980-\u09FF]/.test(resOrErr.error.message)) {
      return resOrErr.error.message;
    }

    if (
      status === 401 ||
      status === 404 ||
      rawMsg.includes('401') ||
      rawMsg.includes('404') ||
      rawMsg.includes('invalid') ||
      rawMsg.includes('credential') ||
      rawMsg.includes('not found') ||
      rawMsg.includes('unauthorized') ||
      rawMsg.includes('password') ||
      rawMsg.includes('user') ||
      rawMsg.includes('সঠিক নয়') ||
      rawMsg.includes('ভুল') ||
      rawMsg.includes('পাওয়া যায়নি')
    ) {
      return lang === 'bn'
        ? 'আপনার দেওয়া ইউজার আইডি বা পাসওয়ার্ডটি ভুল। অনুগ্রহ করে আবার চেষ্টা করুন।'
        : 'Invalid User ID or Password. Please check and try again.';
    }

    if (
      status === 429 ||
      rawMsg.includes('429') ||
      rawMsg.includes('too many') ||
      rawMsg.includes('rate limit') ||
      rawMsg.includes('বেশি')
    ) {
      return lang === 'bn'
        ? 'খুব বেশি সংখ্যক ভুল চেষ্টার কারণে অ্যাকাউন্টটি সাময়িকভাবে লক হয়েছে। কিছুক্ষণ পর চেষ্টা করুন।'
        : 'Too many failed login attempts. Please wait a few moments and try again.';
    }

    return lang === 'bn'
      ? (resOrErr?.error || 'আপনার দেওয়া ইউজার আইডি বা পাসওয়ার্ডটি সঠিক নয়। অনুগ্রহ করে আবার চেষ্টা করুন।')
      : (resOrErr?.error || 'Invalid credentials. Please verify your User ID and password.');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);
    if (clearError) clearError();

    if (!identifier.trim() || !password) {
      setLocalError(
        lang === 'bn'
          ? 'ইউজার আইডি বা ইমেইল এবং পাসওয়ার্ড আবশ্যক'
          : 'User ID / Email and password are required'
      );
      return;
    }

    const res = await login(identifier.trim(), password);

    if (res.requires2FA) {
      setIs2FAStep(true);
      setTempToken2FA(res.tempToken);
      setTwoFactorUser(res.user);
      return;
    }

    if (!res.success) {
      setLocalError(getFriendlyErrorMessage(res));
    }
  };

  const handle2FASubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);
    if (clearError) clearError();

    if (!twoFactorCode || twoFactorCode.length < 6) {
      setLocalError(
        lang === 'bn'
          ? 'অনুগ্রহ করে সঠিক ৬-সংখ্যার ২এফএ কোড দিন'
          : 'Please provide valid 6-digit 2FA code'
      );
      return;
    }

    const res = await loginWith2FA(tempToken2FA, twoFactorCode);
    if (!res.success) {
      setLocalError(
        res.status === 401 || (res.error && res.error.toLowerCase().includes('invalid'))
          ? (lang === 'bn' ? 'প্রদত্ত ২এফএ ওটিপি কোডটি সঠিক নয় বা মেয়াদোত্তীর্ণ হয়েছে।' : 'Invalid or expired 2FA code.')
          : getFriendlyErrorMessage(res)
      );
    }
  };

  if (showAdmissionForm) {
    return <OnlineAdmissionForm onClose={() => setShowAdmissionForm(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Top Global Live News Ticker */}
      <div className="fixed top-0 left-0 right-0 z-30">
        <NewsTicker />
      </div>

      {/* Background glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Language Switcher Pill */}
      <div className="absolute top-12 right-6 z-20">
        <button
          onClick={toggleLanguage}
          className="px-4 py-2 rounded-full bg-slate-900/80 hover:bg-slate-800/90 backdrop-blur-xl text-white text-xs font-black border border-slate-700/80 transition-all flex items-center space-x-2 shadow-xl hover:scale-105 active:scale-95 cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>{lang === 'bn' ? 'English' : 'বাংলা'}</span>
        </button>
      </div>

      {/* Main Container */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        {/* Floating Modern Login Card */}
        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl py-9 px-7 sm:px-10 shadow-[0_25px_70px_-15px_rgba(0,0,0,0.35)] rounded-[32px] border border-slate-200/80 dark:border-slate-800 space-y-6">
          
          {/* Card Brand Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-500 flex items-center justify-center shadow-lg shadow-rose-500/30 text-white">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                NextGen Academy
              </h2>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400">
              {lang === 'bn' ? 'আপনার অ্যাকাউন্টে লগইন করুন' : 'Sign in to your account'}
            </p>
          </div>

          {/* Quick Role Selection Tabs */}
          {!is2FAStep && (
            <div className="p-1 rounded-2xl bg-slate-100 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 grid grid-cols-4 gap-1">
              {[
                { label: 'অ্যাডমিন', role: 'ADMIN', demo: 'admin@academy.com', pass: 'admin123' },
                { label: 'শিক্ষক', role: 'TEACHER', demo: 'teacher@academy.com', pass: 'teacher123' },
                { label: 'শিক্ষার্থী', role: 'STUDENT', demo: 'student@academy.com', pass: 'student123' },
                { label: 'অভিভাবক', role: 'PARENT', demo: 'parent@academy.com', pass: 'parent123' }
              ].map((r) => (
                <button
                  key={r.role}
                  type="button"
                  onClick={() => {
                    setIdentifier(r.demo);
                    setPassword(r.pass);
                    setLocalError(null);
                  }}
                  className={`py-1.5 px-1 rounded-xl text-[11px] font-extrabold transition-all text-center cursor-pointer ${
                    identifier === r.demo
                      ? 'bg-white dark:bg-slate-800 text-rose-600 dark:text-rose-400 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                  title={`ডেমো হিসেবে পূরণ করুন: ${r.demo}`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          )}

          {localError && (
            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/80 text-rose-800 dark:text-rose-300 text-xs flex items-center space-x-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span className="font-semibold">{localError}</span>
            </div>
          )}

          {/* ========================================================== */}
          {/* STEP 2: 2FA TOTP CODE VERIFICATION */}
          {/* ========================================================== */}
          {is2FAStep ? (
            <form onSubmit={handle2FASubmit} className="space-y-5 animate-in fade-in">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-100 shadow-inner">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  দ্বি-স্তরীয় প্রমাণীকরণ (2FA)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                  আপনার Google Authenticator অ্যাপে প্রদর্শিত ৬-সংখ্যার কোডটি লিখুন।
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 text-center">
                  ৬-সংখ্যার ওটিপি কোড (OTP Code) *
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    maxLength={6}
                    autoFocus
                    value={twoFactorCode}
                    onChange={(e) => setTwoFactorCode((e.target?.value || '').replace(/\D/g, ''))}
                    required
                    placeholder="123456"
                    className="w-full text-center text-xl font-mono tracking-widest pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-300 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-rose-500 focus:outline-none font-black text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  type="submit"
                  disabled={loading || twoFactorCode.length < 6}
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-rose-600 via-pink-600 to-rose-600 hover:from-rose-500 hover:to-pink-500 text-white font-extrabold text-sm shadow-xl shadow-rose-600/30 flex items-center justify-center space-x-2 transition-all disabled:opacity-50 transform active:scale-95 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{loading ? 'যাচাই করা হচ্ছে...' : 'নিরাপদ লগইন সম্পন্ন করুন'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIs2FAStep(false);
                    setTwoFactorCode('');
                    setLocalError(null);
                  }}
                  className="w-full py-2 text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white flex items-center justify-center space-x-1 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>আগের ধাপে ফিরে যান</span>
                </button>
              </div>
            </form>
          ) : (
            /* ========================================================== */
            /* STEP 1: REGULAR CREDENTIALS LOGIN */
            /* ========================================================== */
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                  {lang === 'bn' ? 'ইমেইল / ইউজার আইডি' : 'Email / User ID'}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    required
                    placeholder="admin@academy.com"
                    className="w-full bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder:text-slate-400 border border-slate-200 dark:border-slate-800 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 rounded-2xl pl-10 pr-4 py-3 outline-none font-medium text-xs sm:text-sm shadow-xs transition-all"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                    {lang === 'bn' ? 'পাসওয়ার্ড' : 'Password'}
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgotPasswordModal(true)}
                    className="text-[11px] font-bold text-rose-600 dark:text-rose-400 hover:underline transition-colors focus:outline-none cursor-pointer"
                  >
                    {lang === 'bn' ? 'পাসওয়ার্ড ভুলে গেছেন?' : 'Forgot Password?'}
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder:text-slate-400 border border-slate-200 dark:border-slate-800 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 rounded-2xl pl-10 pr-10 py-3 outline-none font-medium text-xs sm:text-sm shadow-xs transition-all"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white focus:outline-none transition-colors cursor-pointer"
                    title={showPassword ? 'Hide password' : 'Show password'}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Skeleton Visual Loading Feedback State */}
              {loading && (
                <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 animate-pulse space-y-2.5">
                  <div className="flex items-center space-x-2 text-xs font-black text-rose-800 dark:text-rose-300">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
                    <span>{lang === 'bn' ? '🔒 নিরাপদ যাচাইকরণ ও ড্যাশবোর্ড লোড হচ্ছে...' : '🔒 Authenticating & loading profile...'}</span>
                  </div>
                  <div className="h-2 w-full bg-rose-200/60 dark:bg-rose-900/60 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-rose-500 to-pink-500 rounded-full animate-pulse w-4/5"></div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-rose-600 via-pink-600 to-rose-600 hover:from-rose-500 hover:to-pink-500 text-white text-xs sm:text-sm font-black shadow-xl shadow-rose-600/30 transition-all flex items-center justify-center space-x-2 disabled:opacity-75 transform active:scale-95 cursor-pointer mt-2"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                    <span>{lang === 'bn' ? 'প্রবেশ করা হচ্ছে...' : 'Signing in...'}</span>
                  </span>
                ) : (
                  <>
                    <span>➔] {lang === 'bn' ? 'লগইন' : 'Sign In'}</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* Online Admission CTA Card */}
          {!is2FAStep && settings?.admissionActive && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-indigo-500/10 border border-indigo-500/30 flex items-center justify-between gap-3">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/30 flex-shrink-0">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900 dark:text-white">
                    {lang === 'bn'
                      ? `অনলাইন ভর্তি ${settings?.admissionSessionYear || '২০২৬'}`
                      : `Online Admission ${settings?.admissionSessionYear || '2026'}`}
                  </h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                    {lang === 'bn' ? 'নতুন সেশনে আবেদন করুন ও স্লিপ নিন' : 'Apply online & track application'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowAdmissionForm(true)}
                className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center space-x-1 flex-shrink-0 cursor-pointer"
              >
                <span>{lang === 'bn' ? 'আবেদন' : 'Apply'}</span>
                <UserPlus className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Hall of Fame / Results Wall Section */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 relative z-10 space-y-12">
        <div className="border-t border-white/10 pt-8">
          <HallOfFameShowcase />
        </div>

        {/* Location Map & Campus Directions */}
        <div className="border-t border-white/10 pt-8 pb-28">
          <GazipurCampusLocationCard />
        </div>
      </div>

      {/* Floating WhatsApp Support Widget */}
      <FloatingWhatsAppSupport />

      {/* Forgot Password Reset Modal */}
      <ForgotPasswordModal
        isOpen={showForgotPasswordModal}
        onClose={() => setShowForgotPasswordModal(false)}
        onResetSuccess={(userIdent, newPass) => {
          if (userIdent) setIdentifier(userIdent);
          if (newPass) setPassword(newPass);
          setLocalError(null);
        }}
      />
    </div>
  );
}
