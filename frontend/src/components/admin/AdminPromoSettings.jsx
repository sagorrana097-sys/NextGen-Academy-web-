import React, { useState, useEffect } from 'react';
import {
  Tag,
  Gift,
  Settings,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  X,
  Save,
  Loader2,
  Users,
  Award,
  Coins,
  TrendingUp,
  Percent,
  Calendar,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { referralAPI } from '../../services/api';

export default function AdminPromoSettings() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Form State
  const [settingsForm, setSettingsForm] = useState({
    discountPercent: 10,
    rewardPointsPerReferral: 200,
    pointToBdtRatio: 0.5,
    minSpendBDT: 500,
    isActive: true,
    customPromoCodes: []
  });

  // New Custom Code Modal
  const [showAddCodeModal, setShowAddCodeModal] = useState(false);
  const [newCodeData, setNewCodeData] = useState({
    code: '',
    discountPercent: 10,
    description: '',
    maxUses: 100,
    expiryDate: '2026-12-31',
    isActive: true
  });

  const fetchAdminSettings = async () => {
    setLoading(true);
    try {
      const res = await referralAPI.getAdminSettings();
      if (res?.success && res.data) {
        setData(res.data);
        if (res.data.settings) {
          setSettingsForm({
            discountPercent: res.data.settings.discountPercent ?? 10,
            rewardPointsPerReferral: res.data.settings.rewardPointsPerReferral ?? 200,
            pointToBdtRatio: res.data.settings.pointToBdtRatio ?? 0.5,
            minSpendBDT: res.data.settings.minSpendBDT ?? 500,
            isActive: res.data.settings.isActive !== undefined ? Boolean(res.data.settings.isActive) : true,
            customPromoCodes: Array.isArray(res.data.settings.customPromoCodes) ? res.data.settings.customPromoCodes : []
          });
        }
      }
    } catch (err) {
      setError(err.message || 'প্রমো সেটিংস লোড করতে ব্যর্থ হয়েছে।');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminSettings();
  }, []);

  const handleSaveSettings = async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await referralAPI.updateAdminSettings(settingsForm);
      if (res?.success) {
        setSuccessMsg('প্রমো ও রেফারেল পলিসি সফলভাবে সংরক্ষিত হয়েছে!');
        fetchAdminSettings();
      } else {
        setError(res?.error?.message || 'সংরক্ষণ ব্যর্থ হয়েছে।');
      }
    } catch (err) {
      setError(err.message || 'সংরক্ষণ ব্যর্থ হয়েছে।');
    } finally {
      setSaving(false);
    }
  };

  const handleAddCustomCode = () => {
    if (!newCodeData.code.trim()) {
      setError('প্রমো কোডের নাম আবশ্যক।');
      return;
    }
    const cleanCode = newCodeData.code.trim().toUpperCase();
    const exists = settingsForm.customPromoCodes.some(c => c.code.toUpperCase() === cleanCode);
    if (exists) {
      setError('এই প্রমো কোডটি ইতিমধ্যে বিদ্যমান।');
      return;
    }

    const updated = [
      ...settingsForm.customPromoCodes,
      {
        ...newCodeData,
        code: cleanCode,
        usedCount: 0
      }
    ];

    setSettingsForm(prev => ({
      ...prev,
      customPromoCodes: updated
    }));

    setShowAddCodeModal(false);
    setNewCodeData({
      code: '',
      discountPercent: 10,
      description: '',
      maxUses: 100,
      expiryDate: '2026-12-31',
      isActive: true
    });
    setSuccessMsg('নতুন প্রমো কোড যুক্ত হয়েছে। মূল পলিসি সংরক্ষণ করতে "সংরক্ষণ করুন" বাটনে ক্লিক করুন।');
  };

  const handleDeleteCustomCode = (codeToDelete) => {
    setSettingsForm(prev => ({
      ...prev,
      customPromoCodes: prev.customPromoCodes.filter(c => c.code !== codeToDelete)
    }));
  };

  const handleToggleCustomCode = (codeToToggle) => {
    setSettingsForm(prev => ({
      ...prev,
      customPromoCodes: prev.customPromoCodes.map(c => 
        c.code === codeToToggle ? { ...c, isActive: !c.isActive } : c
      )
    }));
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-400">
        <Loader2 className="w-8 h-8 mx-auto animate-spin text-emerald-500 mb-2" />
        <p className="font-bold">প্রমো ও রেফারেল কন্ট্রোল লোড হচ্ছে...</p>
      </div>
    );
  }

  const stats = data?.stats || {};
  const leaderboard = Array.isArray(data?.leaderboard) ? data.leaderboard : [];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-3xl shadow-xl text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="p-3.5 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <Tag className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white flex items-center gap-2">
              <span>প্রমো কোড ও রেফারেল রিওয়ার্ড কন্ট্রোল</span>
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              শিক্ষার্থী রেফারেল ডিসকাউন্ট, রিওয়ার্ড পয়েন্ট ও কুপন পলিসি ম্যানেজমেন্ট
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSaveSettings}
          disabled={saving}
          className="px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-black text-xs shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition-all self-start md:self-auto hover:scale-105 active:scale-95"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>সংরক্ষণ হচ্ছে...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>পলিসি সংরক্ষণ করুন</span>
            </>
          )}
        </button>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-between text-xs font-bold">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg(null)}>✕</button>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-between text-xs font-bold">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
          <button onClick={() => setError(null)}>✕</button>
        </div>
      )}

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-white space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase">মোট সফল রেফারেল</span>
          <p className="text-2xl font-black text-indigo-400 font-mono">
            {stats.totalReferralCount || 0} <span className="text-xs text-slate-400 font-normal">জন</span>
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-white space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase">মোট অর্জিত পয়েন্ট</span>
          <p className="text-2xl font-black text-amber-300 font-mono">
            {stats.totalPointsDistributed || 0} <span className="text-xs text-amber-400 font-normal">pts</span>
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-white space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase">মোট রিডিমকৃত ডিসকাউন্ট</span>
          <p className="text-2xl font-black text-emerald-400 font-mono">
            ৳ {stats.totalDiscountsRedeemedBDT || 0}
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-white space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase">সক্রিয় অ্যাম্বাসেডর</span>
          <p className="text-2xl font-black text-purple-400 font-mono">
            {stats.activeAmbassadors || 0} <span className="text-xs text-slate-400 font-normal">শিক্ষার্থী</span>
          </p>
        </div>
      </div>

      {/* Main Grid: Policy Form & Custom Promo Codes */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Global Referral Settings */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white space-y-5 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-black text-base text-white flex items-center gap-2">
              <Settings className="w-5 h-5 text-indigo-400" />
              <span>সার্বজনীন রেফারেল পলিসি রুলস</span>
            </h3>
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold">
              <input
                type="checkbox"
                checked={settingsForm.isActive}
                onChange={(e) => setSettingsForm({ ...settingsForm, isActive: e.target.checked })}
                className="w-4 h-4 rounded text-emerald-600"
              />
              <span className={settingsForm.isActive ? 'text-emerald-400' : 'text-slate-500'}>
                {settingsForm.isActive ? 'সক্রিয় (Active)' : 'নিষ্ক্রিয়'}
              </span>
            </label>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-slate-300 block mb-1">
                নতুন শিক্ষার্থীর ডিসকাউন্ট শতাংশ (Buyer Discount %)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={settingsForm.discountPercent}
                  onChange={(e) => setSettingsForm({ ...settingsForm, discountPercent: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm font-mono text-white focus:ring-2 focus:ring-emerald-500 outline-none pr-8"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">%</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">রেফারেল কোড ব্যবহারের সাথে সাথে ক্রেতা কত % ছাড় পাবে।</p>
            </div>

            <div>
              <label className="font-bold text-slate-300 block mb-1">
                রেফারার শিক্ষার্থীর রিওয়ার্ড পয়েন্ট (Points per Referral)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={settingsForm.rewardPointsPerReferral}
                  onChange={(e) => setSettingsForm({ ...settingsForm, rewardPointsPerReferral: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm font-mono text-amber-300 focus:ring-2 focus:ring-amber-500 outline-none pr-12"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">pts</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">প্রতিটি সফল ভর্তির পর রেফারারকে প্রদেয় রিওয়ার্ড পয়েন্ট।</p>
            </div>

            <div>
              <label className="font-bold text-slate-300 block mb-1">
                পয়েন্ট কনভার্সন রেট (১ পয়েন্ট = কত টাকা)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  value={settingsForm.pointToBdtRatio}
                  onChange={(e) => setSettingsForm({ ...settingsForm, pointToBdtRatio: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm font-mono text-emerald-400 focus:ring-2 focus:ring-emerald-500 outline-none pr-8"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">৳</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">যেমন: ০.৫ দিলে ২০০ পয়েন্টে ১০০ টাকার ফি ছাড় পাওয়া যাবে।</p>
            </div>
          </div>
        </div>

        {/* Right Column: Custom Institutional Promo Codes */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white space-y-5 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-black text-base text-white flex items-center gap-2">
              <Tag className="w-5 h-5 text-purple-400" />
              <span>বিশেষ প্রাতিষ্ঠানিক প্রমো কোড ({settingsForm.customPromoCodes.length})</span>
            </h3>
            <button
              type="button"
              onClick={() => setShowAddCodeModal(true)}
              className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1 shadow-md shadow-purple-600/30"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>নতুন কোড যোগ করুন</span>
            </button>
          </div>

          <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
            {settingsForm.customPromoCodes.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs">
                কোনো প্রাতিষ্ঠানিক প্রমো কোড তৈরি করা হয়নি।
              </div>
            ) : (
              settingsForm.customPromoCodes.map((promo, pIdx) => (
                <div
                  key={pIdx}
                  className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="min-w-0 space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-sm text-amber-300">
                        {promo.code}
                      </span>
                      <span className="px-2 py-0.2 rounded-full bg-emerald-500/20 text-emerald-400 font-mono font-bold text-[10px]">
                        {promo.discountPercent}% OFF
                      </span>
                      {!promo.isActive && (
                        <span className="px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-400 text-[9px] font-bold">
                          Inactive
                        </span>
                      )}
                    </div>
                    {promo.description && (
                      <p className="text-[11px] text-slate-400 truncate">
                        {promo.description}
                      </p>
                    )}
                    <span className="text-[10px] text-slate-500 font-mono block">
                      ব্যবহার: {promo.usedCount || 0} / {promo.maxUses || '∞'} • মেয়াদ: {promo.expiryDate}
                    </span>
                  </div>

                  <div className="flex items-center space-x-1 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => handleToggleCustomCode(promo.code)}
                      className={`p-1.5 rounded-lg border text-xs ${
                        promo.isActive
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                          : 'bg-slate-800 text-slate-500 border-slate-700'
                      }`}
                      title={promo.isActive ? 'নিষ্ক্রিয় করুন' : 'সক্রিয় করুন'}
                    >
                      {promo.isActive ? 'On' : 'Off'}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteCustomCode(promo.code)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-600/30 hover:text-rose-400 text-slate-400"
                      title="মুছুন"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ADD CUSTOM PROMO CODE MODAL */}
      {/* ========================================================================= */}
      {showAddCodeModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-purple-500/40 rounded-3xl max-w-md w-full p-6 text-white shadow-2xl space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
                  <Tag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-white">নতুন প্রমো কোড তৈরি</h3>
                  <p className="text-xs text-slate-400">ক্যাম্পেইন বা বিশেষ স্কলারশিপের জন্য কোড</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddCodeModal(false)}
                className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-300 block mb-1">প্রমো কোড নাম (Promo Code) *</label>
                <input
                  type="text"
                  value={newCodeData.code}
                  onChange={(e) => setNewCodeData({ ...newCodeData, code: e.target.value })}
                  placeholder="যেমন: ALOMGIR50 বা SSC2026"
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm font-mono text-amber-300 uppercase focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">ছাড়ের শতাংশ (Discount %) *</label>
                <input
                  type="number"
                  value={newCodeData.discountPercent}
                  onChange={(e) => setNewCodeData({ ...newCodeData, discountPercent: e.target.value })}
                  placeholder="15"
                  className="w-full px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm font-mono text-white focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">বিবরণ / ক্যাম্পেইন নাম</label>
                <input
                  type="text"
                  value={newCodeData.description}
                  onChange={(e) => setNewCodeData({ ...newCodeData, description: e.target.value })}
                  placeholder="যেমন: রমজান স্পেশাল স্কলারশিপ ছাড়"
                  className="w-full px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">সর্বোচ্চ ব্যবহার সীমা</label>
                  <input
                    type="number"
                    value={newCodeData.maxUses}
                    onChange={(e) => setNewCodeData({ ...newCodeData, maxUses: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs font-mono text-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-300 block mb-1">মেয়াদ শেষ তারিখ</label>
                  <input
                    type="date"
                    value={newCodeData.expiryDate}
                    onChange={(e) => setNewCodeData({ ...newCodeData, expiryDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs font-mono text-white"
                  />
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddCodeModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
              >
                বাতিল
              </button>

              <button
                type="button"
                onClick={handleAddCustomCode}
                className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg"
              >
                কোড যোগ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
