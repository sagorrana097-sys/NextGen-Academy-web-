import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { authAPI } from '../../services/api';
import {
  Lock,
  Unlock,
  ShieldCheck,
  AlertCircle,
  LogOut,
  Eye,
  EyeOff,
  Clock,
  KeyRound
} from 'lucide-react';

const INACTIVITY_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes

export default function InactivityAutoLock({ children }) {
  const { user, logout, isAuthenticated } = useAuth();
  const { lang } = useLanguage();

  const [isLocked, setIsLocked] = useState(false);
  const [unlockPassword, setUnlockPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [unlockError, setUnlockError] = useState(null);
  const [unlocking, setUnlocking] = useState(false);
  const [lockedAt, setLockedAt] = useState(null);

  const timerRef = useRef(null);

  const resetTimer = () => {
    if (isLocked || !isAuthenticated) return;
    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      handleLockScreen();
    }, INACTIVITY_TIMEOUT_MS);
  };

  const handleLockScreen = () => {
    setIsLocked(true);
    setLockedAt(new Date().toLocaleTimeString('bn-BD'));
    setUnlockPassword('');
    setUnlockError(null);
  };

  // Listen to user activity
  useEffect(() => {
    if (!isAuthenticated) {
      setIsLocked(false);
      return;
    }

    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'];
    const handleActivity = () => resetTimer();

    events.forEach((event) => window.addEventListener(event, handleActivity));
    resetTimer();

    // Listen for custom manual lock event
    const handleManualLock = () => handleLockScreen();
    window.addEventListener('nextgen-lock-session', handleManualLock);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      events.forEach((event) => window.removeEventListener(event, handleActivity));
      window.removeEventListener('nextgen-lock-session', handleManualLock);
    };
  }, [isAuthenticated, isLocked]);

  const handleUnlock = async (e) => {
    e.preventDefault();
    if (!unlockPassword) {
      setUnlockError('পাসওয়ার্ড প্রদান করুন');
      return;
    }

    setUnlocking(true);
    setUnlockError(null);
    try {
      const res = await authAPI.login(user?.email, unlockPassword);
      if (res.success || res.requires2FA) {
        setIsLocked(false);
        setUnlockPassword('');
        resetTimer();
      } else {
        setUnlockError('পাসওয়ার্ড সঠিক নয়। পুনরায় চেষ্টা করুন।');
      }
    } catch (err) {
      setUnlockError(err.message || 'পাসওয়ার্ড সঠিক নয়।');
    } finally {
      setUnlocking(false);
    }
  };

  return (
    <>
      {children}

      {/* Full-Screen Security Auto-Lock Overlay */}
      {isLocked && isAuthenticated && (
        <div className="fixed inset-0 z-[99999] bg-slate-950/85 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-slate-900 border border-slate-700/80 max-w-md w-full p-8 rounded-3xl shadow-2xl text-center space-y-6 text-white relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute -right-20 -top-20 w-60 h-60 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -left-20 -bottom-20 w-60 h-60 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Top Status */}
            <div className="relative z-10 space-y-3">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-rose-600 to-pink-600 text-white flex items-center justify-center mx-auto shadow-xl shadow-rose-600/30 border border-rose-400/40">
                <Lock className="w-8 h-8" />
              </div>

              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold border border-rose-500/30">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>নিষ্ক্রিয়তার কারণে সেশন লক করা হয়েছে</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-white">
                ড্যাশবোর্ড লক রয়েছে
              </h2>
              <p className="text-xs text-slate-400">
                ১৫ মিনিট কোনো কার্যক্রম না থাকায় নিরাপত্তা সুরক্ষার্থে অ্যাকাউন্ট লক করা হয়েছে ({lockedAt})।
              </p>
            </div>

            {/* User Profile Pill */}
            <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center space-x-3 text-left">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-sm border border-rose-500/30">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div className="truncate flex-1">
                <h4 className="font-bold text-sm text-white truncate">{user?.name}</h4>
                <p className="text-xs text-slate-400 font-mono truncate">{user?.email}</p>
              </div>
              {user?.role && user.role !== 'PARENT' && (
                <span className="px-2 py-0.5 rounded-md bg-rose-950 text-rose-300 text-[10px] font-bold border border-rose-800">
                  {user.role}
                </span>
              )}
            </div>

            {/* Unlock Form */}
            <form onSubmit={handleUnlock} className="space-y-4">
              {unlockError && (
                <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs flex items-center space-x-2 text-left">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{unlockError}</span>
                </div>
              )}

              <div className="space-y-1 text-left">
                <label className="block text-xs font-bold text-slate-300">
                  লগইন পাসওয়ার্ড লিখুন *
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={unlockPassword}
                    onChange={(e) => setUnlockPassword(e.target.value)}
                    required
                    autoFocus
                    placeholder="পাসওয়ার্ড লিখুন..."
                    className="w-full pl-10 pr-10 py-3 bg-slate-800 border border-slate-700 rounded-xl text-sm font-medium text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-2 text-slate-400 hover:text-slate-200 absolute right-1.5 top-1/2 -translate-y-1/2"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={unlocking}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
              >
                <Unlock className="w-4 h-4" />
                <span>{unlocking ? 'যাচাই করা হচ্ছে...' : 'আনলক করে প্রবেশ করুন'}</span>
              </button>

              <button
                type="button"
                onClick={logout}
                className="w-full py-2 text-xs font-bold text-slate-400 hover:text-rose-400 flex items-center justify-center space-x-1.5 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>অন্য অ্যাকাউন্ট দিয়ে লগইন করুন</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
