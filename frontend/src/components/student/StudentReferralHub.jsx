import React, { useState, useEffect } from 'react';
import {
  Gift,
  Share2,
  Copy,
  Check,
  Award,
  Wallet,
  Users,
  Coins,
  TrendingUp,
  ArrowRight,
  ExternalLink,
  MessageCircle,
  Facebook,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  X,
  Loader2,
  HelpCircle
} from 'lucide-react';
import { referralAPI } from '../../services/api';

export default function StudentReferralHub() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [showRedeemModal, setShowRedeemModal] = useState(false);
  const [redeemPointsInput, setRedeemPointsInput] = useState('');
  const [redeeming, setRedeeming] = useState(false);
  const [redeemedResult, setRedeemedResult] = useState(null);

  const fetchReferralData = async () => {
    setLoading(true);
    try {
      const res = await referralAPI.getMyReferral();
      if (res?.success && res.data) {
        setData(res.data);
      }
    } catch (err) {
      setError(err.message || 'রেফারেল ডেটা লোড করতে ব্যর্থ হয়েছে।');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReferralData();
  }, []);

  const promoCode = data?.profile?.referralCode || 'NGA-REF-2026';
  const shareMessage = `NextGen Academy-তে ভর্তি ও মাসিক ফি পেমেন্টে আমার প্রমো কোড "${promoCode}" ব্যবহার করে ${data?.settings?.discountPercent || 10}% স্পেশাল ডিসকাউন্ট উপভোগ করো! ভিজিট: https://nextgen.edu.bd`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(promoCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShareWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareMessage)}`;
    window.open(url, '_blank');
  };

  const handleShareFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent('https://nextgen.edu.bd')}&quote=${encodeURIComponent(shareMessage)}`;
    window.open(url, '_blank');
  };

  const handleRedeem = async () => {
    const points = Number(redeemPointsInput);
    if (!points || points <= 0 || points > (data?.profile?.rewardPoints || 0)) {
      setError('সঠিক পয়েন্ট পরিমাণ লিখুন যা আপনার বর্তমান ব্যালেন্সের মধ্যে।');
      return;
    }
    setRedeeming(true);
    setError(null);
    try {
      const res = await referralAPI.redeemPoints({ pointsToRedeem: points });
      if (res?.success && res.data) {
        setRedeemedResult(res.data);
        fetchReferralData();
      } else {
        setError(res?.error?.message || 'পয়েন্ট রিডিম ব্যর্থ হয়েছে।');
      }
    } catch (err) {
      setError(err.message || 'পয়েন্ট রিডিম করতে ত্রুটি হয়েছে।');
    } finally {
      setRedeeming(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-400">
        <Loader2 className="w-8 h-8 mx-auto animate-spin text-emerald-500 mb-2" />
        <p className="font-bold">রেফারেল ও রিওয়ার্ড তথ্য লোড হচ্ছে...</p>
      </div>
    );
  }

  const profile = data?.profile || {};
  const tier = data?.tier || { name: 'ব্রোঞ্জ লার্নার', badge: '🥉', level: 1 };
  const balanceBDT = data?.balanceBDT || 0;
  const history = Array.isArray(profile.referralHistory) ? profile.referralHistory : [];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-3xl shadow-xl text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="p-3.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Gift className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black text-white">স্টুডেন্ট রেফারেল ও রিওয়ার্ড হাব</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold font-mono">
                {tier.badge} {tier.name}
              </span>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              বন্ধুদের নেক্সটজেন একাডেমিতে রেফার করুন, তারা পাবে {data?.settings?.discountPercent || 10}% ছাড় আর আপনি পাবেন আকর্ষণীয় রিওয়ার্ড পয়েন্ট!
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setRedeemPointsInput(String(profile.rewardPoints || 0));
            setRedeemedResult(null);
            setShowRedeemModal(true);
          }}
          disabled={(profile.rewardPoints || 0) < 100}
          className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-40 text-white font-black text-xs shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition-all self-start md:self-auto hover:scale-105 active:scale-95"
        >
          <Coins className="w-4 h-4 text-amber-300" />
          <span>পয়েন্ট রিডিম করুন (Redeem)</span>
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-between text-xs font-bold">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
          <button onClick={() => setError(null)}>✕</button>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Unique Promo Card & Share Engine */}
        <div className="lg:col-span-7 space-y-6">
          {/* Unique Promo Card with Neon Gradient Aura */}
          <div className="bg-gradient-to-br from-slate-900 via-indigo-950/80 to-slate-950 border-2 border-amber-500/40 rounded-3xl p-6 text-white space-y-5 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                  আপনার ব্যক্তিগত রেফারেল কোড
                </span>
              </div>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 font-mono">
                Active Code
              </span>
            </div>

            {/* Glowing Code Box */}
            <div className="p-4 rounded-2xl bg-slate-950/90 border border-amber-400/50 flex items-center justify-between gap-3 shadow-inner">
              <div className="font-mono text-2xl font-black text-amber-300 tracking-wider">
                {promoCode}
              </div>

              <button
                type="button"
                onClick={handleCopyCode}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                  copied
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>কপি হয়েছে!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>কপি কোড</span>
                  </>
                )}
              </button>
            </div>

            {/* Instant Social Share Buttons */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-300 block">বন্ধুদের সাথে শেয়ার করুন:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleShareWhatsApp}
                  className="w-full py-3 px-4 rounded-2xl bg-[#25D366]/20 hover:bg-[#25D366]/30 border border-[#25D366]/50 text-[#25D366] font-bold text-xs flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>হোয়াটসঅ্যাপে পাঠান (WhatsApp)</span>
                </button>

                <button
                  type="button"
                  onClick={handleShareFacebook}
                  className="w-full py-3 px-4 rounded-2xl bg-[#1877F2]/20 hover:bg-[#1877F2]/30 border border-[#1877F2]/50 text-[#1877F2] font-bold text-xs flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                >
                  <Facebook className="w-4 h-4" />
                  <span>ফেসবুকে শেয়ার করুন</span>
                </button>
              </div>
            </div>

            {/* How It Works Steps */}
            <div className="pt-4 border-t border-slate-800/80 space-y-2.5 text-xs text-slate-300">
              <span className="font-bold text-slate-200 block">💡 যেভাবে কাজ করে:</span>
              <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                  <span className="font-black text-amber-400">১. কোড দিন</span>
                  <p className="text-[10px] text-slate-400">বন্ধুদের আপনার কোড শেয়ার করুন</p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                  <span className="font-black text-emerald-400">২. সে পাবে {data?.settings?.discountPercent || 10}%</span>
                  <p className="text-[10px] text-slate-400">ভর্তি ও ফি পেমেন্টে ইনস্ট্যান্ট ছাড়</p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                  <span className="font-black text-purple-400">৩. আপনি পাবেন ২০০ pts</span>
                  <p className="text-[10px] text-slate-400">মাসিক ফি-তে রিডিম করার সুযোগ</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Rewards Wallet & Tier Progress */}
        <div className="lg:col-span-5 space-y-6">
          {/* Wallet Overview Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-base text-white flex items-center gap-2">
                <Wallet className="w-5 h-5 text-emerald-400" />
                <span>রিওয়ার্ডস ওয়ালেট (Rewards Wallet)</span>
              </h3>
              <span className="text-xs text-slate-400 font-mono">
                1 pt = ৳{data?.settings?.pointToBdtRatio || 0.5}
              </span>
            </div>

            {/* Balance Highlight */}
            <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase">মোট রিওয়ার্ড পয়েন্ট</span>
                <p className="text-2xl font-black text-amber-300 font-mono mt-0.5">
                  {profile.rewardPoints || 0} <span className="text-xs text-amber-400 font-normal">pts</span>
                </p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase">নগদ সমতুল্য মান</span>
                <p className="text-2xl font-black text-emerald-400 font-mono mt-0.5">
                  ৳ {balanceBDT}
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-0.5">
                <span className="text-slate-400 text-[10px]">সফল রেফারেল</span>
                <p className="font-bold text-white text-base">{profile.totalReferrals || 0} জন</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-0.5">
                <span className="text-slate-400 text-[10px]">মোট রিডিম করা পয়েন্ট</span>
                <p className="font-bold text-purple-300 text-base">{profile.redeemedPoints || 0} pts</p>
              </div>
            </div>

            {/* Tier Level Meter */}
            <div className="pt-2 border-t border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-300 flex items-center gap-1">
                  <span>লেভেল {tier.level}:</span>
                  <span className="text-amber-400">{tier.name}</span>
                </span>
                <span className="text-[11px] text-slate-400">
                  {profile.totalReferrals || 0} / {tier.level >= 4 ? 'Max' : tier.level * 5} রেফারেল
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 via-emerald-500 to-teal-400 transition-all duration-500"
                  style={{ width: `${Math.min(100, ((profile.totalReferrals || 0) / (tier.level * 5 || 5)) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Referral History Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="font-black text-base text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-400" />
            <span>রেফারেল ও রিওয়ার্ড লেনদেন বিবরণী ({history.length})</span>
          </h3>
        </div>

        {history.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs">
            এখনও কোনো রেফারেল ট্রানজ্যাকশন সম্পন্ন হয়নি।
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3">তারিখ ও সময়</th>
                  <th className="px-4 py-3">কার্যক্রম / বিবরণ</th>
                  <th className="px-4 py-3 text-right">পয়েন্ট</th>
                  <th className="px-4 py-3 text-center">স্ট্যাটাস</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {history.map((h, idx) => (
                  <tr key={h.id || idx} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3 text-slate-400 font-mono">
                      {h.date ? new Date(h.date).toLocaleDateString('bn-BD', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'আজ'}
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-200">
                      {h.description}
                      {h.voucherCode && (
                        <span className="block font-mono text-[10px] text-amber-400 font-bold">
                          ভাউচার কোড: {h.voucherCode}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-bold">
                      <span className={h.points >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                        {h.points >= 0 ? `+${h.points}` : h.points} pts
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
                        সফল ✓
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* REDEEM POINTS MODAL */}
      {/* ========================================================================= */}
      {showRedeemModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl max-w-md w-full p-6 text-white shadow-2xl space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <Coins className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-white">পয়েন্ট রিডিম করুন</h3>
                  <p className="text-xs text-slate-400">পয়েন্ট দিয়ে মাসিক ফি ডিসকাউন্ট ভাউচার তৈরি করুন</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowRedeemModal(false)}
                className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {redeemedResult ? (
              <div className="p-5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <h4 className="font-black text-base text-emerald-300">ভাউচার সফলভাবে তৈরি হয়েছে!</h4>
                <div className="p-3 bg-slate-950 rounded-xl border border-emerald-500/50 font-mono text-xl font-black text-amber-300 tracking-wider">
                  {redeemedResult.voucherCode}
                </div>
                <p className="text-xs text-slate-300">
                  ডিসকাউন্ট মান: <strong className="text-emerald-400">৳{redeemedResult.discountBDT}</strong> (মাসিক ফি পেমেন্টের সময় এই ভাউচার কোডটি ব্যবহার করুন)
                </p>
                <button
                  type="button"
                  onClick={() => setShowRedeemModal(false)}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs"
                >
                  ঠিক আছে
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5">
                    কত পয়েন্ট রিডিম করতে চান? (বর্তমান ব্যালেন্স: {profile.rewardPoints || 0} pts)
                  </label>
                  <input
                    type="number"
                    value={redeemPointsInput}
                    onChange={(e) => setRedeemPointsInput(e.target.value)}
                    max={profile.rewardPoints || 0}
                    placeholder="পয়েন্ট পরিমাণ লিখুন"
                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm font-mono text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <span className="text-[11px] text-emerald-400 font-semibold mt-1 block">
                    সমতুল্য ডিসকাউন্ট: ৳{Math.floor(Number(redeemPointsInput || 0) * (data?.settings?.pointToBdtRatio || 0.5))}
                  </span>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowRedeemModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
                  >
                    বাতিল
                  </button>

                  <button
                    type="button"
                    onClick={handleRedeem}
                    disabled={redeeming || !Number(redeemPointsInput)}
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs shadow-lg flex items-center gap-2"
                  >
                    {redeeming ? <Loader2 className="w-4 h-4 animate-spin" /> : <Coins className="w-4 h-4" />}
                    <span>ভাউচার তৈরি করুন</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
