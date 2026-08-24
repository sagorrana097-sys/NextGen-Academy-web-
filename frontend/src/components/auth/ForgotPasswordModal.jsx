import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { authAPI } from '../../services/api';
import {
  KeyRound,
  Mail,
  Lock,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  X
} from 'lucide-react';

export default function ForgotPasswordModal({ isOpen, onClose, onResetSuccess }) {
  const { lang, t } = useLanguage();

  const [step, setStep] = useState(1); // 1: Request OTP, 2: Verify OTP & New Password, 3: Success
  const [identifier, setIdentifier] = useState('');
  const [destination, setDestination] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null); // { type: 'success' | 'error', text: '' }
  const [resendCountdown, setResendCountdown] = useState(0);

  useEffect(() => {
    let timer;
    if (resendCountdown > 0) {
      timer = setInterval(() => setResendCountdown((p) => p - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [resendCountdown]);

  if (!isOpen) return null;

  const handleSendOTP = async (e) => {
    if (e) e.preventDefault();
    if (!identifier.trim()) {
      setStatusMessage({
        type: 'error',
        text: lang === 'bn' ? 'অনুগ্রহ করে আপনার রেজিস্টার্ড ইমেইল বা ইউজার আইডি দিন' : 'Please enter your registered email or user ID'
      });
      return;
    }

    setLoading(true);
    setStatusMessage(null);

    try {
      const res = await authAPI.forgotPassword({ identifier: identifier.trim() });
      if (res.success) {
        setDestination(res.data?.destination || identifier);
        // Pre-fill demo OTP if available in dev environment for 1-click test
        if (res.data?.demoOtp) {
          setOtp(res.data.demoOtp);
        }
        setStep(2);
        setResendCountdown(60);
        setStatusMessage({
          type: 'success',
          text: res.message || (lang === 'bn' ? 'পাসওয়ার্ড রিসেট ওটিপি পাঠানো হয়েছে!' : 'Reset OTP sent successfully!')
        });
      } else {
        throw new Error(res.error?.message || 'Failed to send reset code');
      }
    } catch (err) {
      setStatusMessage({
        type: 'error',
        text: err.message || (lang === 'bn' ? 'এই ইমেইল বা আইডি দিয়ে কোনো অ্যাকাউন্ট পাওয়া যায়নি' : 'Account not found with this email/ID')
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setStatusMessage(null);

    if (!otp.trim() || otp.length < 6) {
      setStatusMessage({
        type: 'error',
        text: lang === 'bn' ? 'অনুগ্রহ করে সঠিক ৬-সংখ্যার ওটিপি কোড দিন' : 'Please enter valid 6-digit OTP code'
      });
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      setStatusMessage({
        type: 'error',
        text: lang === 'bn' ? 'পাসওয়ার্ড ন্যূনতম ৬ অক্ষরের হতে হবে' : 'Password must be at least 6 characters'
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setStatusMessage({
        type: 'error',
        text: lang === 'bn' ? 'পাসওয়ার্ড ও কনফার্ম পাসওয়ার্ড মিলছে না' : 'Passwords do not match'
      });
      return;
    }

    setLoading(true);
    try {
      const res = await authAPI.resetPassword({
        identifier: identifier.trim(),
        otp: otp.trim(),
        newPassword
      });

      if (res.success) {
        setStep(3);
        setStatusMessage({
          type: 'success',
          text: res.message || (lang === 'bn' ? 'পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে!' : 'Password reset successfully!')
        });

        setTimeout(() => {
          if (onResetSuccess) {
            onResetSuccess(identifier, newPassword);
          }
          handleClose();
        }, 2000);
      } else {
        throw new Error(res.error?.message || 'Password reset failed');
      }
    } catch (err) {
      setStatusMessage({
        type: 'error',
        text: err.message || (lang === 'bn' ? 'ভুল ওটিপি কোড বা মেয়াদোত্তীর্ণ অনুরোধ' : 'Invalid OTP or expired request')
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep(1);
    setIdentifier('');
    setOtp('');
    setNewPassword('');
    setConfirmPassword('');
    setStatusMessage(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full shadow-2xl p-6 sm:p-8 text-white space-y-6 relative overflow-hidden my-auto">
        {/* Background glowing ambient light */}
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 relative z-10">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 text-amber-400 border border-amber-500/30 shadow-md">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-white">
                {lang === 'bn' ? 'পাসওয়ার্ড রিসেট' : 'Password Reset'}
              </h3>
              <p className="text-[11px] text-slate-400">
                {lang === 'bn' ? 'নেক্সটজেন একাডেমি সিকিউরিটি পোর্টাল' : 'NextGen Academy Security'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toast / Status Alert Banner */}
        {statusMessage && (
          <div
            className={`p-3.5 rounded-2xl border text-xs flex items-center space-x-2.5 animate-in fade-in ${
              statusMessage.type === 'success'
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span className="font-semibold leading-relaxed">{statusMessage.text}</span>
          </div>
        )}

        {/* ================================================================ */}
        {/* STEP 1: ENTER REGISTERED EMAIL / IDENTIFIER */}
        {/* ================================================================ */}
        {step === 1 && (
          <form onSubmit={handleSendOTP} className="space-y-4 relative z-10">
            <div className="space-y-1.5">
              <p className="text-xs text-slate-300 leading-relaxed">
                {lang === 'bn'
                  ? 'আপনার অ্যাকাউন্টের রেজিস্টার্ড ইমেইল, মোবাইল নম্বর অথবা ইউজার আইডি দিন। আমরা একটি ৬-সংখ্যার ওটিপি কোড পাঠাবো।'
                  : 'Enter your registered email address, phone number, or User ID. We will send a 6-digit verification code.'}
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                {lang === 'bn' ? 'রেজিস্টার্ড ইমেইল / ইউজার আইডি / মোবাইল' : 'Registered Email / User ID / Phone'} *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  autoFocus
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={lang === 'bn' ? 'e.g. Alomgir005 অথবা student@nextgen.edu.bd' : 'e.g. Alomgir005 or student@nextgen.edu.bd'}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <button
                type="submit"
                disabled={loading || !identifier.trim()}
                className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center space-x-2 active:scale-95 disabled:opacity-50"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>{lang === 'bn' ? 'রিসেট ওটিপি কোড পাঠান' : 'Send Reset Link / OTP'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleClose}
                className="w-full py-2 text-xs font-bold text-slate-400 hover:text-white flex items-center justify-center space-x-1.5 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{lang === 'bn' ? 'লগইনে ফিরে যান' : 'Back to Login'}</span>
              </button>
            </div>
          </form>
        )}

        {/* ================================================================ */}
        {/* STEP 2: VERIFY OTP & ENTER NEW PASSWORD */}
        {/* ================================================================ */}
        {step === 2 && (
          <form onSubmit={handleResetPassword} className="space-y-4 relative z-10">
            <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">
                {lang === 'bn' ? 'ওটিপি প্রেরিত গন্তব্য:' : 'OTP Sent to:'}
              </span>
              <p className="text-xs font-bold text-amber-300 truncate">{destination}</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                {lang === 'bn' ? '৬-সংখ্যার ওটিপি কোড (OTP Code)' : '6-Digit OTP Code'} *
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  maxLength={6}
                  autoFocus
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="123456"
                  className="w-full text-center tracking-[0.25em] font-mono text-base font-black pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-2xl text-amber-300 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                {lang === 'bn' ? 'নতুন পাসওয়ার্ড (New Password)' : 'New Password'} *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-950 border border-slate-700 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                {lang === 'bn' ? 'পাসওয়ার্ড নিশ্চিত করুন (Confirm Password)' : 'Confirm Password'} *
              </label>
              <div className="relative">
                <ShieldCheck className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-950 border border-slate-700 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
              <span>{lang === 'bn' ? 'ওটিপি কোড পাননি?' : 'Did not receive code?'}</span>
              <button
                type="button"
                disabled={resendCountdown > 0 || loading}
                onClick={handleSendOTP}
                className="text-amber-400 hover:underline disabled:opacity-50 font-bold"
              >
                {resendCountdown > 0
                  ? `${lang === 'bn' ? 'পুনরায় পাঠান' : 'Resend in'} (${resendCountdown}s)`
                  : (lang === 'bn' ? 'পুনরায় পাঠান (Resend)' : 'Resend Code')}
              </button>
            </div>

            <div className="space-y-2 pt-2">
              <button
                type="submit"
                disabled={loading || otp.length < 6 || !newPassword || !confirmPassword}
                className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs sm:text-sm shadow-xl shadow-emerald-600/30 transition-all flex items-center justify-center space-x-2 active:scale-95 disabled:opacity-50"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{lang === 'bn' ? 'পাসওয়ার্ড নিশ্চিত ও পরিবর্তন করুন' : 'Confirm & Reset Password'}</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full py-2 text-xs font-bold text-slate-400 hover:text-white flex items-center justify-center space-x-1.5 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{lang === 'bn' ? 'আগের ধাপে ফিরে যান' : 'Change Email / ID'}</span>
              </button>
            </div>
          </form>
        )}

        {/* ================================================================ */}
        {/* STEP 3: CELEBRATION SUCCESS STATE */}
        {/* ================================================================ */}
        {step === 3 && (
          <div className="py-8 text-center space-y-4 relative z-10 animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-2xl animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h4 className="text-lg font-black text-white">
                {lang === 'bn' ? 'পাসওয়ার্ড সফলভাবে পরিবর্তিত!' : 'Password Reset Successful!'}
              </h4>
              <p className="text-xs text-slate-300 max-w-xs mx-auto">
                {lang === 'bn'
                  ? 'আপনার নতুন পাসওয়ার্ড সক্রিয় হয়েছে। এখন আপনি সরাসরি লগইন করতে পারেন।'
                  : 'Your new password is now active. You can now login with your new credentials.'}
              </p>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleClose}
                className="px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-lg transition-all"
              >
                {lang === 'bn' ? 'এখনই লগইন করুন (Go to Login)' : 'Go to Login'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
