import React, { useState, useEffect } from 'react';
import {
  Sliders,
  MoveUp,
  MoveDown,
  GripVertical,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Save,
  Search,
  Sparkles,
  Shield,
  Layers,
  Eye,
  EyeOff,
  Check,
  X,
  LayoutDashboard,
  Brain,
  Map,
  Rotate3d,
  Swords,
  Gift,
  BookMarked,
  Sigma,
  PenTool,
  Film,
  Users,
  Video,
  HelpCircle,
  BookOpen,
  ClipboardList,
  UserCheck,
  CalendarCheck,
  Award,
  CalendarDays,
  CreditCard,
  BellRing,
  MessageSquarePlus,
  Lock
} from 'lucide-react';
import { menuControlsAPI } from '../../services/api';

const ICON_MAP = {
  LayoutDashboard,
  Brain,
  Map,
  Rotate3d,
  Swords,
  Gift,
  BookMarked,
  Sigma,
  PenTool,
  Film,
  Users,
  Video,
  HelpCircle,
  BookOpen,
  ClipboardList,
  UserCheck,
  CalendarCheck,
  Award,
  CalendarDays,
  CreditCard,
  BellRing,
  MessageSquarePlus
};

const CATEGORIES = [
  { id: 'ALL', label: 'সকল মডিউল' },
  { id: 'CORE', label: 'কোর' },
  { id: 'ACADEMIC', label: 'একাডেমিক' },
  { id: 'AI_STUDY', label: 'AI ও ল্যাব' },
  { id: 'GAMIFICATION', label: 'গ্যামিফিকেশন' },
  { id: 'RESOURCES', label: 'রিসোর্স ও বুকস' },
  { id: 'COMMUNICATION', label: 'কমিউনিকেশন' }
];

export default function AdminMenuManager() {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState(null);
  const [draggedIndex, setDraggedIndex] = useState(null);

  const fetchMenus = async () => {
    try {
      setLoading(true);
      const res = await menuControlsAPI.getAdminStudentMenus();
      if (res?.success && res.data) {
        setMenus(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch student menus:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  const handleToggle = async (module) => {
    if (module.isLocked) return;

    // Optimistic UI update
    const updated = menus.map((m) =>
      m.id === module.id ? { ...m, is_active: !m.is_active } : m
    );
    setMenus(updated);

    try {
      const res = await menuControlsAPI.toggleModule(module.id);
      if (res?.success) {
        setNotification({
          type: 'success',
          text: `'${module.nameBn}' মডিউলটি ${!module.is_active ? 'চালু' : 'বন্ধ'} করা হয়েছে।`
        });
        setTimeout(() => setNotification(null), 3000);
      }
    } catch (err) {
      // Revert on error
      setMenus(menus);
      setNotification({ type: 'error', text: 'টগল ব্যর্থ হয়েছে: ' + err.message });
    }
  };

  const handleMove = async (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= menus.length) return;

    const reordered = [...menus];
    const [movedItem] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, movedItem);

    // Re-assign sort_order
    const withSortOrder = reordered.map((m, idx) => ({
      ...m,
      sort_order: idx + 1
    }));

    setMenus(withSortOrder);

    // Persist to server
    try {
      await menuControlsAPI.updateStudentMenus(withSortOrder);
    } catch (err) {
      console.error('Failed to auto-save menu order:', err);
    }
  };

  // Drag and Drop handlers
  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const reordered = [...menus];
    const [draggedItem] = reordered.splice(draggedIndex, 1);
    reordered.splice(index, 0, draggedItem);

    const withSortOrder = reordered.map((m, idx) => ({
      ...m,
      sort_order: idx + 1
    }));

    setDraggedIndex(index);
    setMenus(withSortOrder);
  };

  const handleDragEnd = async () => {
    setDraggedIndex(null);
    try {
      await menuControlsAPI.updateStudentMenus(menus);
      setNotification({
        type: 'success',
        text: 'মেনুর নতুন ক্রম সফলভাবে ডেটাবেজে সংরক্ষিত হয়েছে।'
      });
      setTimeout(() => setNotification(null), 3000);
    } catch (err) {
      setNotification({ type: 'error', text: 'সংরক্ষণ ব্যর্থ: ' + err.message });
    }
  };

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      const res = await menuControlsAPI.updateStudentMenus(menus);
      if (res?.success) {
        setNotification({
          type: 'success',
          text: 'সকল মেনু কনফিগারেশন ও ক্রম সফলভাবে সংরক্ষিত হয়েছে!'
        });
        setTimeout(() => setNotification(null), 4000);
      }
    } catch (err) {
      setNotification({ type: 'error', text: 'সংরক্ষণ ত্রুটি: ' + err.message });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (!window.confirm('আপনি কি নিশ্চিত যে সকল স্টুডেন্ট মেনু সেটিংস ডিফল্ট অবস্থায় ফিরিয়ে নিতে চান?')) return;
    setLoading(true);
    try {
      const res = await menuControlsAPI.resetStudentMenus();
      if (res?.success) {
        setMenus(res.data);
        setNotification({
          type: 'success',
          text: 'স্টুডেন্ট মেনু সফলভাবে ফ্যাক্টরি ডিফল্টে রিসেট করা হয়েছে।'
        });
        setTimeout(() => setNotification(null), 4000);
      }
    } catch (err) {
      setNotification({ type: 'error', text: 'রিসেট ব্যর্থ: ' + err.message });
    } finally {
      setLoading(false);
    }
  };

  const filteredMenus = menus.filter((m) => {
    const matchesCategory = selectedCategory === 'ALL' || m.category === selectedCategory;
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      m.nameBn.toLowerCase().includes(q) ||
      m.nameEn.toLowerCase().includes(q) ||
      m.description?.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  const activeCount = menus.filter((m) => m.is_active).length;
  const disabledCount = menus.length - activeCount;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-950 to-indigo-950/70 border border-slate-800 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
            <Sliders className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white">
                স্টুডেন্ট মেনু কন্ট্রোল ও ফিচার ফ্ল্যাগিং
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[11px] font-extrabold">
                লাইভ ডাইনামিক
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              শিক্ষার্থী ড্যাশবোর্ডের মডিউলসমূহ অন/অফ করুন এবং ড্র্যাগ করে মেনু সিরিয়াল সাজান
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleReset}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold transition-all flex items-center gap-1.5 border border-slate-700 shadow-sm"
          >
            <RotateCcw className="w-4 h-4" /> ডিফল্ট রিসেট
          </button>
          <button
            onClick={handleSaveAll}
            disabled={saving}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-black shadow-lg shadow-amber-500/20 transition-all flex items-center gap-1.5 active:scale-95 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'সংরক্ষণ হচ্ছে...' : 'সকল পরিবর্তন সংরক্ষণ করুন'}
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div
          className={`p-4 rounded-2xl border flex items-center justify-between text-xs sm:text-sm font-bold shadow-lg ${
            notification.type === 'success'
              ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
              : 'bg-rose-950/40 border-rose-800 text-rose-300'
          }`}
        >
          <div className="flex items-center gap-2">
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
            )}
            <span>{notification.text}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Stats Counter Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
          <p className="text-xs font-bold text-slate-400">মোট মডিউল সংখ্যা</p>
          <p className="text-2xl font-black text-white mt-1 font-mono">{menus.length}</p>
        </div>
        <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-900/40 shadow-md">
          <p className="text-xs font-bold text-emerald-400">সক্রিয় মডিউল (Active)</p>
          <p className="text-2xl font-black text-emerald-300 mt-1 font-mono">{activeCount}</p>
        </div>
        <div className="p-5 rounded-2xl bg-rose-950/20 border border-rose-900/40 shadow-md">
          <p className="text-xs font-bold text-rose-400">বন্ধ রাখা হয়েছে (Disabled)</p>
          <p className="text-2xl font-black text-rose-300 mt-1 font-mono">{disabledCount}</p>
        </div>
        <div className="p-5 rounded-2xl bg-indigo-950/20 border border-indigo-900/40 shadow-md">
          <p className="text-xs font-bold text-indigo-400">অ্যাক্সেস গার্ড</p>
          <p className="text-xs font-black text-indigo-300 mt-2">🔒 বন্ধ ফিচারে অটো ব্লক সক্রিয়</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ========================================================= */}
        {/* 1. MODULES MANAGER (DRAG & DROP + TOGGLE) */}
        {/* ========================================================= */}
        <div className="lg:col-span-2 space-y-4">
          {/* Filter and Search Bar */}
          <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-3 shadow-lg">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 overflow-x-auto scrollbar-none">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex-shrink-0 ${
                      selectedCategory === cat.id
                        ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              <div className="relative flex-1 min-w-[200px] max-w-xs">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="মডিউল খুঁজুন..."
                  className="w-full bg-slate-950 text-white placeholder:text-slate-500 rounded-xl pl-9 pr-3 py-1.5 text-xs border border-slate-800 focus:border-amber-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* List of Modules */}
          {loading ? (
            <div className="p-12 text-center rounded-3xl bg-slate-900/60 border border-slate-800">
              <p className="text-xs text-slate-400 animate-pulse">মেনু তালিকা লোড হচ্ছে...</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredMenus.map((mod, idx) => {
                const IconComp = ICON_MAP[mod.icon] || LayoutDashboard;
                const actualIndex = menus.findIndex((m) => m.id === mod.id);

                return (
                  <div
                    key={mod.id}
                    draggable={!mod.isLocked}
                    onDragStart={(e) => handleDragStart(e, actualIndex)}
                    onDragOver={(e) => handleDragOver(e, actualIndex)}
                    onDragEnd={handleDragEnd}
                    className={`rounded-2xl border p-4 transition-all duration-200 flex items-center justify-between gap-4 select-none ${
                      draggedIndex === actualIndex
                        ? 'opacity-40 bg-slate-950 border-amber-500 border-dashed'
                        : mod.is_active
                        ? 'bg-slate-900 border-slate-800 shadow-md hover:border-slate-700'
                        : 'bg-slate-950/70 border-slate-900/80 opacity-60'
                    }`}
                  >
                    {/* Left: Reorder Controls + Serial + Icon + Info */}
                    <div className="flex items-center gap-3">
                      {/* Drag Grip / Reorder Buttons */}
                      <div className="flex items-center gap-1">
                        <div
                          className="cursor-grab active:cursor-grabbing text-slate-600 hover:text-slate-300 p-1"
                          title="ড্র্যাগ করে সিরিয়াল পরিবর্তন করুন"
                        >
                          <GripVertical className="w-4 h-4" />
                        </div>
                        <div className="flex flex-col">
                          <button
                            type="button"
                            onClick={() => handleMove(actualIndex, -1)}
                            disabled={actualIndex === 0}
                            className="text-slate-500 hover:text-white disabled:opacity-20 p-0.5"
                            title="উপরে নিন"
                          >
                            <MoveUp className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMove(actualIndex, 1)}
                            disabled={actualIndex === menus.length - 1}
                            className="text-slate-500 hover:text-white disabled:opacity-20 p-0.5"
                            title="নিচে নিন"
                          >
                            <MoveDown className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {/* Serial Tag */}
                      <span className="w-6 text-center text-xs font-mono font-bold text-slate-500">
                        #{actualIndex + 1}
                      </span>

                      {/* Icon */}
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          mod.is_active
                            ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                            : 'bg-slate-800 text-slate-500'
                        }`}
                      >
                        <IconComp className="w-5 h-5" />
                      </div>

                      {/* Text details */}
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className={`text-xs sm:text-sm font-black ${mod.is_active ? 'text-white' : 'text-slate-400'}`}>
                            {mod.nameBn}
                          </h3>
                          {mod.isLocked && (
                            <span className="px-1.5 py-0.2 rounded bg-slate-800 text-[10px] text-slate-400 flex items-center gap-1 font-bold">
                              <Lock className="w-3 h-3" /> কোর
                            </span>
                          )}
                          <span className="px-2 py-0.2 rounded-full bg-slate-800/80 text-[10px] text-slate-400 font-semibold">
                            {mod.category}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                          {mod.description}
                        </p>
                      </div>
                    </div>

                    {/* Right: Toggle Switch */}
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className={`text-xs font-bold ${mod.is_active ? 'text-emerald-400' : 'text-slate-500'}`}>
                        {mod.is_active ? 'সক্রিয় (ON)' : 'বন্ধ (OFF)'}
                      </span>

                      <label className={`relative inline-flex items-center ${mod.isLocked ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>
                        <input
                          type="checkbox"
                          disabled={mod.isLocked}
                          checked={mod.is_active}
                          onChange={() => handleToggle(mod)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                      </label>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ========================================================= */}
        {/* 2. LIVE SIMULATOR PREVIEW (STUDENT SIDEBAR) */}
        {/* ========================================================= */}
        <div className="space-y-4">
          <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-black text-white">লাইভ স্টুডেন্ট সাইডবার প্রিভিউ</h3>
              </div>
              <span className="text-[10px] font-bold text-slate-400">
                {activeCount}টি দৃশ্যমান
              </span>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              শিক্ষার্থী লগইন করার পর সাইডবারে মেনু আইটেমগুলো হুবহু নিচের ক্রমে এবং সক্রিয় অবস্থায় প্রদর্শিত হবে:
            </p>

            <div className="space-y-1.5 max-h-[500px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-800">
              {menus
                .filter((m) => m.is_active)
                .map((m, idx) => {
                  const IconComp = ICON_MAP[m.icon] || LayoutDashboard;
                  return (
                    <div
                      key={m.id}
                      className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs text-slate-200 hover:border-slate-700 transition-all"
                    >
                      <div className="flex items-center gap-2.5">
                        <IconComp className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                        <span className="font-bold">{m.nameBn}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">#{idx + 1}</span>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Access Guard Policy Note */}
          <div className="rounded-3xl bg-gradient-to-br from-indigo-950/40 to-slate-900 border border-indigo-800/40 p-6 space-y-3 shadow-xl">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-black text-white">স্বয়ংক্রিয় অ্যাক্সেস গার্ড প্রটেকশন</h4>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              কোনো শিক্ষার্থী সরাসরি ব্রাউজার URL দিয়ে বন্ধ রাখা ফিচার অ্যাক্সেস করার চেষ্টা করলে সিস্টেম তাকে স্বয়ংক্রিয়ভাবে হোম ড্যাশবোর্ডে ফিরিয়ে দেবে এবং একটি নোটিফিকেশন প্রদর্শন করবে।
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
