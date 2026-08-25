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
      <div className="absolute top-14 right-6 z-20">
        <button
          onClick={toggleLanguage}
          className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white text-xs font-bold border border-white/20 transition-all flex items-center space-x-1.5 shadow-lg"
        >
          <span>{lang === 'bn' ? 'English' : 'বাংলা'}</span>
        </button>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center space-y-3">
        {/* Brand Logo & Name */}
        <div className="inline-flex items-center justify-center space-x-3 p-2 rounded-2xl bg-slate-950/80 border border-amber-500/40 shadow-2xl shadow-amber-500/10 backdrop-blur-xl">
          <div className="w-12 h-12 rounded-xl bg-slate-950 flex items-center justify-center p-1 ring-2 ring-amber-400/50 shadow-inner">
            <img
              src={settings?.logoUrl || '/logo.png'}
              alt={settings?.academyName || 'NextGen Academy'}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
          <div className="text-left pr-3 border-l border-slate-800 pl-3">
            <h2 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 leading-tight">
              {settings?.academyName || 'NextGen ACADEMY'}
            </h2>
            <p className="text-[10px] font-bold text-amber-200/80 tracking-widest uppercase">
              {settings?.tagline || 'LEARN · GROW · SUCCEED'}
            </p>
          </div>
        </div>

        <h3 className="text-lg font-bold text-white tracking-tight">
          {lang === 'bn' ? 'সমন্বিত শিক্ষা ও অভিভাবক পোর্টাল' : 'Integrated Smart Portal'}
        </h3>
      </div>

      {/* Main Login Card */}
      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        <div className="bg-white/95 backdrop-blur-xl py-8 px-6 sm:px-10 shadow-2xl rounded-3xl border border-white/20 space-y-6">
          {localError && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center space-x-2.5 animate-in fade-in">
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
                <h3 className="text-base font-black text-slate-900">
                  দ্বি-স্তরীয় প্রমাণীকরণ (2FA)
                </h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  আপনার Google Authenticator অ্যাপে প্রদর্শিত ৬-সংখ্যার কোডটি লিখুন।
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 text-center">
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
                    className="w-full text-center text-xl font-mono tracking-widest pl-10 pr-4 py-3 bg-slate-50 rounded-2xl border border-slate-300 focus:bg-white focus:ring-2 focus:ring-rose-500 focus:outline-none font-black text-slate-900"
                  />
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  type="submit"
                  disabled={loading || twoFactorCode.length < 6}
                  className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
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
                  className="w-full py-2 text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center justify-center space-x-1 transition-colors"
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
                <label className="block text-xs font-bold text-slate-900 mb-1">
                  {lang === 'bn' ? 'ইউজার আইডি / ইমেইল / মোবাইল নম্বর' : 'User ID / Email / Phone Number'}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    required
                    placeholder={lang === 'bn' ? 'e.g. Alomgir005 অথবা admin@nextgen.edu.bd' : 'e.g. Alomgir005 or admin@nextgen.edu.bd'}
                    className="w-full bg-white text-slate-900 placeholder:text-slate-400 border border-emerald-500/30 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-lg pl-10 pr-4 py-2.5 outline-none font-medium text-xs sm:text-sm shadow-sm"
                  />
                  <UserIcon className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-900">
                    {lang === 'bn' ? 'পাসওয়ার্ড (Password)' : 'Password'}
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgotPasswordModal(true)}
                    className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 hover:underline transition-colors focus:outline-none"
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
                    className="w-full bg-white text-slate-900 placeholder:text-slate-400 border border-emerald-500/30 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-lg pl-10 pr-10 py-2.5 outline-none font-medium text-xs sm:text-sm shadow-sm"
                  />
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-slate-800 focus:outline-none transition-colors"
                    title={showPassword ? 'Hide password' : 'Show password'}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4 text-slate-500" /> : <Eye className="w-4 h-4 text-slate-500" />}
                  </button>
                </div>
              </div>

              {/* Skeleton Visual Loading Feedback State */}
              {loading && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200/80 animate-pulse space-y-2.5">
                  <div className="flex items-center space-x-2 text-xs font-black text-emerald-800">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                    <span>{lang === 'bn' ? '🔒 নিরাপদ যাচাইকরণ ও প্রোফাইল লোড হচ্ছে...' : '🔒 Authenticating & loading profile...'}</span>
                  </div>
                  <div className="h-2 w-full bg-emerald-200/60 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full animate-pulse w-4/5"></div>
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-emerald-700 font-semibold">
                    <span>{lang === 'bn' ? 'সেশন ক্যাশ ও ড্যাশবোর্ড প্রস্তুত হচ্ছে' : 'Preparing session cache & dashboard'}</span>
                    <span>১০০% সুরক্ষিত</span>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center space-x-2 disabled:opacity-75 active:scale-95"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                    <span>{lang === 'bn' ? 'প্রবেশ করা হচ্ছে...' : 'Signing in...'}</span>
                  </span>
                ) : (
                  <>
                    <span>{lang === 'bn' ? 'লগইন করুন' : 'Sign In'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Online Admission CTA Card */}
          {!is2FAStep && settings?.admissionActive && (
            <div className="mt-5 p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-emerald-500/10 border border-emerald-500/30 flex items-center justify-between gap-3">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-600/30 flex-shrink-0">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900">
                    {lang === 'bn'
                      ? `অনলাইন ভর্তি ${settings?.admissionSessionYear || '২০২৬'}`
                      : `Online Admission ${settings?.admissionSessionYear || '2026'}`}
                  </h4>
                  <p className="text-[10px] text-slate-600 font-medium">
                    {lang === 'bn' ? 'নতুন সেশনে আবেদন করুন ও স্লিপ নিন' : 'Apply online & track application'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowAdmissionForm(true)}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center space-x-1 flex-shrink-0"
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
