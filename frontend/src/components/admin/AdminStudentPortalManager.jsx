import React, { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useSettings } from '../../context/SettingsContext';
import { studentPortalControlAPI } from '../../services/api';
import {
  Sliders,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  RefreshCw,
  Save,
  RotateCcw,
  Sparkles,
  Search,
  Power,
  ShieldAlert,
  Megaphone,
  Bot,
  Trophy,
  CreditCard,
  Printer,
  CalendarDays,
  HelpCircle,
  ClipboardList,
  BookCheck,
  BookOpen,
  Video,
  PlaySquare,
  FlaskConical,
  Dna,
  Atom,
  Calculator,
  Terminal,
  PenTool,
  Languages,
  Sigma,
  BookMarked,
  FolderGit2,
  Brain,
  Map,
  Swords,
  Award,
  TrendingUp,
  Wallet,
  Gift,
  Users,
  MessageSquarePlus,
  BellRing,
  Layers,
  ChevronDown,
  ChevronUp,
  Lock,
  Unlock,
  Check,
  X
} from 'lucide-react';

const ICON_MAP = {
  CalendarDays,
  HelpCircle,
  ClipboardList,
  BookCheck,
  BookOpen,
  Video,
  PlaySquare,
  FlaskConical,
  Dna,
  Atom,
  Calculator,
  Terminal,
  PenTool,
  Languages,
  Sigma,
  BookMarked,
  FolderGit2,
  Brain,
  Map,
  Swords,
  Award,
  TrendingUp,
  CreditCard,
  Wallet,
  Gift,
  Trophy,
  Users,
  MessageSquarePlus,
  BellRing
};

export default function AdminStudentPortalManager() {
  const { lang } = useLanguage();
  const { settings, updateStudentPortalSettings, refreshSettings } = useSettings();

  const [portalConfig, setPortalConfig] = useState(() => settings.studentPortal || {});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState({
    academicCore: true,
    smartLabs: true,
    studyMaterials: true,
    gamification: true,
    profileRecords: true
  });

  useEffect(() => {
    if (settings.studentPortal) {
      setPortalConfig(settings.studentPortal);
    }
  }, [settings.studentPortal]);

  const showToast = (message, type = 'success') => {
    setFeedback({ message, type });
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleGlobalToggle = (field) => {
    setPortalConfig(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleModuleToggle = (categoryKey, moduleId) => {
    setPortalConfig(prev => {
      const categories = { ...prev.categories };
      const category = { ...categories[categoryKey] };
      const modules = { ...category.modules };
      const module = { ...modules[moduleId] };

      module.enabled = !module.enabled;
      modules[moduleId] = module;
      category.modules = modules;
      categories[categoryKey] = category;

      return {
        ...prev,
        categories
      };
    });
  };

  const handleCategoryToggleAll = (categoryKey, targetState) => {
    setPortalConfig(prev => {
      const categories = { ...prev.categories };
      const category = { ...categories[categoryKey] };
      const modules = { ...category.modules };

      Object.keys(modules).forEach(modId => {
        modules[modId] = {
          ...modules[modId],
          enabled: targetState
        };
      });

      category.enabled = targetState;
      category.modules = modules;
      categories[categoryKey] = category;

      return {
        ...prev,
        categories
      };
    });
  };

  const toggleCategoryExpand = (categoryKey) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryKey]: !prev[categoryKey]
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await updateStudentPortalSettings(portalConfig);
      if (res.success) {
        showToast('স্টুডেন্ট পোর্টাল কন্ট্রোল হাব সেটিংস সফলভাবে সংরক্ষিত ও লাইভ হয়েছে!', 'success');
        refreshSettings();
      } else {
        showToast(res.error || 'সেটিংস সেভ করতে ব্যর্থ হয়েছে।', 'error');
      }
    } catch (err) {
      showToast('নেটওয়ার্ক ত্রুটি: ' + err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (!window.confirm('আপনি কি নিশ্চিত স্টুডেন্ট পোর্টালের সমস্ত ফিচার ফ্যাক্টরি ডিফল্ট সেটিংসে রিস্টোর করতে চান?')) return;
    setLoading(true);
    try {
      const res = await studentPortalControlAPI.resetConfig();
      if (res.success && res.data) {
        setPortalConfig(res.data);
        await updateStudentPortalSettings(res.data);
        showToast('সকল সেটিংস ডিফল্ট অবস্থায় রিস্টোর করা হয়েছে!', 'success');
        refreshSettings();
      }
    } catch (err) {
      showToast('রিসেট ব্যর্থ হয়েছে: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Calculated Stats
  const stats = useMemo(() => {
    let totalModules = 0;
    let enabledModules = 0;
    let disabledModules = 0;

    if (portalConfig.categories) {
      Object.values(portalConfig.categories).forEach(cat => {
        if (cat.modules) {
          Object.values(cat.modules).forEach(m => {
            totalModules++;
            if (m.enabled) enabledModules++;
            else disabledModules++;
          });
        }
      });
    }

    return { totalModules, enabledModules, disabledModules };
  }, [portalConfig]);

  // Filter Categories by Search
  const filteredCategories = useMemo(() => {
    if (!portalConfig.categories) return [];
    const query = searchQuery.trim().toLowerCase();

    return Object.entries(portalConfig.categories).map(([catKey, cat]) => {
      const allModules = Object.entries(cat.modules || {});
      const matchedModules = query
        ? allModules.filter(([_, mod]) =>
            mod.nameBn?.toLowerCase().includes(query) ||
            mod.nameEn?.toLowerCase().includes(query) ||
            mod.description?.toLowerCase().includes(query) ||
            mod.id?.toLowerCase().includes(query)
          )
        : allModules;

      return {
        key: catKey,
        titleBn: cat.titleBn,
        titleEn: cat.titleEn,
        enabled: cat.enabled,
        modules: matchedModules,
        totalCount: allModules.length,
        enabledCount: allModules.filter(([_, m]) => m.enabled).length
      };
    }).filter(cat => cat.modules.length > 0);
  }, [portalConfig, searchQuery]);

  return (
    <div className="space-y-6 pb-24">
      {/* ========================================================================= */}
      {/* 1. TOP HERO HEADER & QUICK SUMMARY */}
      {/* ========================================================================= */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-slate-800 shadow-2xl relative overflow-hidden">
        {/* Glow background accents */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-black">
              <Sliders className="w-3.5 h-3.5 text-amber-400" />
              <span>সেন্ট্রালাইজড ম্যানেজমেন্ট হাব</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-3">
              <span>স্টুডেন্ট পোর্টাল কন্ট্রোল হাব</span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold font-mono">
                {stats.enabledModules}/{stats.totalModules} সক্রিয়
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              শিক্ষার্থী পোর্টালের সকল ফিচার, মেনু, ভার্চুয়াল ল্যাব, সাইডবার অপশন ও গ্লোবাল সিকিউরিটি টগলসমূহ একক ড্যাশবোর্ড থেকে রিয়েল-টাইম পরিচালনা করুন।
            </p>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              onClick={handleReset}
              disabled={loading || saving}
              className="px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-black flex items-center space-x-2 border border-slate-700 transition-all active:scale-95"
            >
              <RotateCcw className="w-4 h-4 text-slate-400" />
              <span>ডিফল্ট রিস্টোর</span>
            </button>

            <button
              onClick={handleSave}
              disabled={saving}
              className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black flex items-center space-x-2 shadow-lg shadow-emerald-600/30 transition-all active:scale-95 disabled:opacity-50"
            >
              {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>সেভ ও লাইভ আপডেট</span>
            </button>
          </div>
        </div>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mt-6 pt-6 border-t border-slate-800/80">
          <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 backdrop-blur-md space-y-1">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">মোট পোর্টাল মডিউল</span>
            <div className="text-2xl font-black text-white font-mono">{stats.totalModules}টি</div>
            <p className="text-[10px] text-indigo-300">৫টি প্রধান ক্যাটাগরি</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-800/60 backdrop-blur-md space-y-1">
            <span className="text-[10px] uppercase tracking-wider text-emerald-400 font-bold">সক্রিয় ফিচার</span>
            <div className="text-2xl font-black text-emerald-400 font-mono">{stats.enabledModules}টি</div>
            <p className="text-[10px] text-emerald-300">শিক্ষার্থীরা দেখতে পাচ্ছে</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-rose-950/30 border border-rose-800/60 backdrop-blur-md space-y-1">
            <span className="text-[10px] uppercase tracking-wider text-rose-400 font-bold">লক / বন্ধ ফিচার</span>
            <div className="text-2xl font-black text-rose-400 font-mono">{stats.disabledModules}টি</div>
            <p className="text-[10px] text-rose-300">সাইডবারে লুকায়িত</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 backdrop-blur-md space-y-1">
            <span className="text-[10px] uppercase tracking-wider text-amber-300 font-bold">মেইনটেন্যান্স স্ট্যাটাস</span>
            <div className="text-2xl font-black text-amber-300 font-mono">
              {portalConfig.maintenanceMode ? '🚨 মেইনটেন্যান্স' : '🟢 লাইভ সক্রিয়'}
            </div>
            <p className="text-[10px] text-slate-400">সিস্টেম স্ট্যাটাস</p>
          </div>
        </div>
      </div>

      {/* Toast Feedback */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl border flex items-center space-x-3 transition-all animate-fadeIn ${
            feedback.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
              : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200'
          }`}
        >
          {feedback.type === 'success' ? <CheckCircle2 className="w-5 h-5 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 flex-shrink-0" />}
          <span className="text-xs sm:text-sm font-bold">{feedback.message}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. GLOBAL PORTAL SWITCHES & ANNOUNCEMENT BANNER */}
      {/* ========================================================================= */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
        <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-500" />
          <span>গ্লোবাল পোর্টাল সেটিংস ও সিকিউরিটি সুইচ</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Maintenance Mode Toggle */}
          <div
            onClick={() => handleGlobalToggle('maintenanceMode')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
              portalConfig.maintenanceMode
                ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800 shadow-md'
                : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <AlertTriangle className={`w-4 h-4 ${portalConfig.maintenanceMode ? 'text-rose-600' : 'text-slate-400'}`} />
                <span>মেইনটেন্যান্স মোড</span>
              </span>
              <span
                className={`w-10 h-5 flex items-center rounded-full p-1 transition-all ${
                  portalConfig.maintenanceMode ? 'bg-rose-600 justify-end' : 'bg-slate-300 dark:bg-slate-700 justify-start'
                }`}
              >
                <span className="bg-white w-3.5 h-3.5 rounded-full shadow-md" />
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              চালু করলে শিক্ষার্থীদের কাছে রক্ষণাবেক্ষণ বার্তা প্রদর্শিত হবে।
            </p>
          </div>

          {/* AI Doubt Solver Widget Toggle */}
          <div
            onClick={() => handleGlobalToggle('enableDoubtSolver')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
              portalConfig.enableDoubtSolver
                ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800'
                : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Bot className={`w-4 h-4 ${portalConfig.enableDoubtSolver ? 'text-emerald-600' : 'text-slate-400'}`} />
                <span>AI ফ্লোটিং ডাউট সলভার</span>
              </span>
              <span
                className={`w-10 h-5 flex items-center rounded-full p-1 transition-all ${
                  portalConfig.enableDoubtSolver ? 'bg-emerald-600 justify-end' : 'bg-slate-300 dark:bg-slate-700 justify-start'
                }`}
              >
                <span className="bg-white w-3.5 h-3.5 rounded-full shadow-md" />
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              ড্যাশবোর্ডের ফ্লোটিং এআই প্রশ্ন সমাধান হেল্পার সক্রিয় রাখুন।
            </p>
          </div>

          {/* Public Merit Leaderboard Toggle */}
          <div
            onClick={() => handleGlobalToggle('enableLeaderboard')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
              portalConfig.enableLeaderboard
                ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800'
                : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Trophy className={`w-4 h-4 ${portalConfig.enableLeaderboard ? 'text-emerald-600' : 'text-slate-400'}`} />
                <span>পাবলিক মেরিট লিডারবোর্ড</span>
              </span>
              <span
                className={`w-10 h-5 flex items-center rounded-full p-1 transition-all ${
                  portalConfig.enableLeaderboard ? 'bg-emerald-600 justify-end' : 'bg-slate-300 dark:bg-slate-700 justify-start'
                }`}
              >
                <span className="bg-white w-3.5 h-3.5 rounded-full shadow-md" />
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              শিক্ষার্থীদের মেধা তালিকা ও ব্যাচ র‍্যাঙ্ক প্রদর্শন করুন।
            </p>
          </div>

          {/* Online Fees Payment Checkout */}
          <div
            onClick={() => handleGlobalToggle('enableOnlinePayment')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
              portalConfig.enableOnlinePayment
                ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800'
                : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <CreditCard className={`w-4 h-4 ${portalConfig.enableOnlinePayment ? 'text-emerald-600' : 'text-slate-400'}`} />
                <span>অনলাইন ফি পেমেন্ট</span>
              </span>
              <span
                className={`w-10 h-5 flex items-center rounded-full p-1 transition-all ${
                  portalConfig.enableOnlinePayment ? 'bg-emerald-600 justify-end' : 'bg-slate-300 dark:bg-slate-700 justify-start'
                }`}
              >
                <span className="bg-white w-3.5 h-3.5 rounded-full shadow-md" />
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              বিকাশ/নগদ গেটওয়ের মাধ্যমে শিক্ষার্থীদের সরাসরি ফি পরিশোধ সুবিধা।
            </p>
          </div>
        </div>

        {/* Portal Custom Banner Message */}
        <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-800/60 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Megaphone className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                স্টুডেন্ট পোর্টাল টপ এনাউন্সমেন্ট ব্যানার (Student Portal Banner)
              </span>
            </div>
            <label className="flex items-center space-x-2 text-xs font-bold cursor-pointer">
              <input
                type="checkbox"
                checked={portalConfig.showPortalBanner || false}
                onChange={(e) => setPortalConfig(prev => ({ ...prev, showPortalBanner: e.target.checked }))}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-slate-600 dark:text-slate-300">ব্যানার চালু রাখুন</span>
            </label>
          </div>

          <input
            type="text"
            value={portalConfig.portalBannerText || ''}
            onChange={(e) => setPortalConfig(prev => ({ ...prev, portalBannerText: e.target.value }))}
            placeholder="যেমন: 📢 আগামী শুক্রবার সকাল ১০টায় সকল ব্যাচের পদার্থবিজ্ঞান বিশেষ মডেল টেস্ট অনুষ্ঠিত হবে।"
            className="w-full px-4 py-2.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. SEARCH & QUICK FILTER BAR */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="যে কোনো ফিচার বা মডিউলের নাম লিখে খুঁজুন..."
            className="w-full pl-10 pr-4 py-2.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center space-x-2 text-xs font-bold text-slate-500 dark:text-slate-400">
          <span>দ্রুত অ্যাকশন:</span>
          <button
            onClick={() => {
              Object.keys(portalConfig.categories || {}).forEach(k => handleCategoryToggleAll(k, true));
            }}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 text-slate-700 dark:text-slate-300 hover:text-emerald-600 transition-all"
          >
            সব চালু করুন
          </button>
          <button
            onClick={() => {
              Object.keys(portalConfig.categories || {}).forEach(k => handleCategoryToggleAll(k, false));
            }}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 text-slate-700 dark:text-slate-300 hover:text-rose-600 transition-all"
          >
            সব বন্ধ করুন
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. CATEGORIZED MODULE CONTROLS */}
      {/* ========================================================================= */}
      <div className="space-y-5">
        {filteredCategories.map((cat) => {
          const isExpanded = expandedCategories[cat.key] !== false;

          return (
            <div
              key={cat.key}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-all"
            >
              {/* Category Header Bar */}
              <div className="p-4 sm:p-5 bg-slate-50/80 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
                <div
                  onClick={() => toggleCategoryExpand(cat.key)}
                  className="flex items-center space-x-3 cursor-pointer flex-1 select-none"
                >
                  <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold text-xs flex items-center justify-center border border-indigo-100 dark:border-indigo-800">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                      <span>{cat.titleBn}</span>
                      <span className="text-xs text-slate-400 font-normal">({cat.titleEn})</span>
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {cat.enabledCount}/{cat.totalCount}টি ফিচার সক্রিয়
                    </p>
                  </div>
                </div>

                {/* Category Master Switches */}
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => handleCategoryToggleAll(cat.key, true)}
                    className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold hover:bg-emerald-100 transition-all"
                  >
                    সব অন
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCategoryToggleAll(cat.key, false)}
                    className="px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 text-[10px] font-bold hover:bg-rose-100 transition-all"
                  >
                    সব অফ
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleCategoryExpand(cat.key)}
                    className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Module Cards Grid */}
              {isExpanded && (
                <div className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {cat.modules.map(([modId, mod]) => {
                    const IconComponent = ICON_MAP[mod.icon] || Sliders;
                    const isEnabled = mod.enabled;

                    return (
                      <div
                        key={modId}
                        onClick={() => handleModuleToggle(cat.key, modId)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer select-none space-y-3 ${
                          isEnabled
                            ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700/80 hover:border-emerald-400 hover:shadow-md'
                            : 'bg-slate-50/60 dark:bg-slate-800/30 border-slate-200 dark:border-slate-800 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center space-x-2.5">
                            <div
                              className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold transition-all ${
                                isEnabled
                                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-800'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                              }`}
                            >
                              <IconComponent className="w-4 h-4" />
                            </div>
                            <div>
                              <h5 className="text-xs font-black text-slate-900 dark:text-white leading-tight">
                                {mod.nameBn}
                              </h5>
                              <span className="text-[10px] text-slate-400 block">{mod.nameEn}</span>
                            </div>
                          </div>

                          {/* Toggle Switch */}
                          <div className="flex items-center space-x-1.5 flex-shrink-0">
                            <span
                              className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-all ${
                                isEnabled ? 'bg-emerald-600 justify-end' : 'bg-slate-300 dark:bg-slate-700 justify-start'
                              }`}
                            >
                              <span className="bg-white w-3.5 h-3.5 rounded-full shadow-sm" />
                            </span>
                          </div>
                        </div>

                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                          {mod.description}
                        </p>

                        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[10px]">
                          <span className="font-mono text-slate-400">ID: {mod.id}</span>
                          <span
                            className={`px-2 py-0.5 rounded-md font-bold ${
                              isEnabled
                                ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300'
                                : 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300'
                            }`}
                          >
                            {isEnabled ? 'সক্রিয় / ON' : 'লক / OFF'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* 5. STICKY SAVE BAR AT BOTTOM */}
      {/* ========================================================================= */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 bg-slate-900/95 text-white border border-slate-700 shadow-2xl backdrop-blur-xl px-6 py-3.5 rounded-full flex items-center gap-4 max-w-xl w-full justify-between">
        <div className="flex items-center space-x-2 text-xs">
          <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
          <span className="font-bold hidden sm:inline">পরিবর্তনসমূহ সংরক্ষণ করতে ভুলবেন না</span>
          <span className="font-bold sm:hidden">সংরক্ষণ করুন</span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleReset}
            disabled={saving}
            className="px-3.5 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 transition-all"
          >
            রিসেট
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black flex items-center space-x-1.5 shadow-lg shadow-emerald-600/30 transition-all active:scale-95"
          >
            {saving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>সেভ করুন</span>
          </button>
        </div>
      </div>
    </div>
  );
}
