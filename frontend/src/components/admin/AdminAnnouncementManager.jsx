import React, { useState, useEffect } from 'react';
import {
  Volume2,
  VolumeX,
  Play,
  Square,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ShieldAlert,
  BellRing,
  Sparkles,
  Radio,
  Search,
  Check,
  X,
  Clock,
  Layers,
  Users,
  Settings2,
  Save,
  Headphones,
  Sliders,
  Filter
} from 'lucide-react';
import { announcementAPI } from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';
import {
  speakText,
  stopSpeech,
  playChime,
  isSpeechSupported
} from '../../utils/audioAnnouncer';

const TARGET_PAGES = [
  { id: 'ALL', label: '🌐 সকল পেজ (Universal / All Pages)' },
  { id: 'LIVE_CLASS', label: '🔴 লাইভ ক্লাসরুম (Live Classroom)' },
  { id: 'EXAM_HALL', label: '📝 অনলাইন পরীক্ষা হল ও MCQ (Exam Hall)' },
  { id: 'DASHBOARD', label: '📊 মূল ড্যাশবোর্ড (Main Dashboard)' },
  { id: 'HOME', label: '🏠 হোম ও ল্যান্ডিং পেজ (Public Landing Home)' },
  { id: 'STUDY_MATERIALS', label: '📚 স্টাডি ম্যাটেরিয়াল হাব (Materials)' },
  { id: 'HOMEWORK', label: '✍️ বাড়ির কাজ ও অ্যাসাইনমেন্ট (Homework)' },
  { id: 'ROUTINE', label: '📅 সাপ্তাহিক ক্লাস রুটিন (Class Routine)' },
  { id: 'FEES', label: '💳 ফি ও পেমেন্ট পোর্টাল (Fees & Payments)' }
];

const TARGET_ROLES = [
  { id: 'ALL', label: '👥 সকলের জন্য (All Users)' },
  { id: 'STUDENT', label: '🎓 শিক্ষার্থীগণ (Students Only)' },
  { id: 'TEACHER', label: '👨‍🏫 শিক্ষকমণ্ডলী (Teachers Only)' },
  { id: 'PARENT', label: '👨‍👩‍👧 অভিভাবকবৃন্দ (Parents Only)' }
];

const CHIME_OPTIONS = [
  { id: 'pleasant_bell', label: '🔔 সুমধুর হারমোনিক বেল (Pleasant Harmonic Bell)' },
  { id: 'digital_ping', label: '⚡ আধুনিক ডিজিটাল পিং (Modern Digital Ping)' },
  { id: 'gentle_harp', label: '🎶 জেন্টল ট্রায়াড হার্প (Gentle Triad Harp)' },
  { id: 'none', label: '🚫 কোনো অডিও চাইম নয় (No Chime)' }
];

export default function AdminAnnouncementManager() {
  const { lang, t } = useLanguage();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedPageFilter, setSelectedPageFilter] = useState('ALL');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('ALL');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [testingVoice, setTestingVoice] = useState(false);
  const [playingItemId, setPlayingItemId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    targetPage: 'ALL',
    targetRole: 'ALL',
    classId: 'ALL',
    priority: 'NORMAL',
    displayType: 'BANNER',
    enableAudio: true,
    autoSpeak: false,
    voiceGender: 'FEMALE',
    voiceLanguage: 'bn-BD',
    speechRate: 0.94,
    speechPitch: 1.08,
    chimeSound: 'pleasant_bell',
    isActive: true,
    startDate: '',
    endDate: ''
  });

  // Feedback Toast
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    fetchAnnouncements();
    return () => {
      stopSpeech();
    };
  }, []);

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const res = await announcementAPI.getAll();
      if (res.success && Array.isArray(res.data)) {
        setAnnouncements(res.data);
      }
    } catch (err) {
      showToast(err.message || 'ঘোষণা লোড করতে ব্যর্থ হয়েছে', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({
      title: '',
      message: '',
      targetPage: 'LIVE_CLASS',
      targetRole: 'ALL',
      classId: 'ALL',
      priority: 'HIGH',
      displayType: 'BANNER',
      enableAudio: true,
      autoSpeak: true,
      voiceGender: 'FEMALE',
      voiceLanguage: 'bn-BD',
      speechRate: 0.94,
      speechPitch: 1.08,
      chimeSound: 'pleasant_bell',
      isActive: true,
      startDate: '',
      endDate: ''
    });
    setShowModal(true);
  };

  const handleOpenEdit = (item) => {
    setEditingId(item.id);
    setFormData({
      title: item.title || '',
      message: item.message || '',
      targetPage: item.targetPage || 'ALL',
      targetRole: item.targetRole || 'ALL',
      classId: item.classId || 'ALL',
      priority: item.priority || 'NORMAL',
      displayType: item.displayType || 'BANNER',
      enableAudio: item.enableAudio !== false,
      autoSpeak: item.autoSpeak === true,
      voiceGender: item.voiceGender || 'FEMALE',
      voiceLanguage: item.voiceLanguage || 'bn-BD',
      speechRate: Number(item.speechRate) || 0.94,
      speechPitch: Number(item.speechPitch) || 1.08,
      chimeSound: item.chimeSound || 'pleasant_bell',
      isActive: item.isActive !== false,
      startDate: item.startDate ? item.startDate.split('T')[0] : '',
      endDate: item.endDate ? item.endDate.split('T')[0] : ''
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.message.trim()) {
      showToast('শিরোনাম এবং বার্তা উভয়ই দেওয়া আবশ্যক', 'error');
      return;
    }

    setSubmitting(true);
    try {
      if (editingId) {
        const res = await announcementAPI.update(editingId, formData);
        if (res.success) {
          showToast('ঘোষণাটি সফলভাবে আপডেট করা হয়েছে!', 'success');
          setShowModal(false);
          fetchAnnouncements();
        }
      } else {
        const res = await announcementAPI.create(formData);
        if (res.success) {
          showToast('নতুন ডায়নামিক অডিও ঘোষণা সফলভাবে যুক্ত হয়েছে!', 'success');
          setShowModal(false);
          fetchAnnouncements();
        }
      }
    } catch (err) {
      showToast(err.message || 'সংরক্ষণে সমস্যা হয়েছে', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (id) => {
    try {
      const res = await announcementAPI.toggle(id);
      if (res.success) {
        setAnnouncements(prev =>
          prev.map(item => (item.id === id ? { ...item, isActive: res.data.isActive } : item))
        );
        showToast(res.message, 'success');
      }
    } catch (err) {
      showToast(err.message || 'স্ট্যাটাস পরিবর্তনে সমস্যা হয়েছে', 'error');
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`আপনি কি নিশ্চিতভাবে "${title}" ঘোষণাটি মুছে ফেলতে চান?`)) {
      return;
    }

    try {
      const res = await announcementAPI.delete(id);
      if (res.success) {
        showToast('ঘোষণাটি সফলভাবে মুছে ফেলা হয়েছে', 'success');
        setAnnouncements(prev => prev.filter(item => item.id !== id));
      }
    } catch (err) {
      showToast(err.message || 'মুছে ফেলতে ব্যর্থ হয়েছে', 'error');
    }
  };

  const handleTestFormVoice = () => {
    if (testingVoice) {
      stopSpeech();
      setTestingVoice(false);
      return;
    }

    const testText = `${formData.title || 'নেক্সটজেন একাডেমি ঘোষণা'}। ${formData.message || 'প্রফেশনাল ফিমেল ভয়েস টেস্ট সম্পন্ন হয়েছে।'}`;

    setTestingVoice(true);
    speakText(testText, {
      lang: formData.voiceLanguage || 'bn-BD',
      pitch: Number(formData.speechPitch) || 1.08,
      rate: Number(formData.speechRate) || 0.94,
      chimeType: formData.chimeSound || 'pleasant_bell',
      playChimeBefore: true,
      onStart: () => setTestingVoice(true),
      onEnd: () => setTestingVoice(false),
      onError: () => setTestingVoice(false)
    });
  };

  const handlePlayListItem = (item) => {
    if (playingItemId === item.id) {
      stopSpeech();
      setPlayingItemId(null);
      return;
    }

    setPlayingItemId(item.id);
    const speechText = `${item.title}। ${item.message}`;

    speakText(speechText, {
      lang: item.voiceLanguage || 'bn-BD',
      pitch: Number(item.speechPitch) || 1.08,
      rate: Number(item.speechRate) || 0.94,
      chimeType: item.chimeSound || 'pleasant_bell',
      playChimeBefore: true,
      onStart: () => setPlayingItemId(item.id),
      onEnd: () => setPlayingItemId(null),
      onError: () => setPlayingItemId(null)
    });
  };

  // Filtered List
  const filteredAnnouncements = announcements.filter(item => {
    const q = search.toLowerCase().trim();
    const matchesSearch =
      !q ||
      (item.title && item.title.toLowerCase().includes(q)) ||
      (item.message && item.message.toLowerCase().includes(q)) ||
      (item.targetPage && item.targetPage.toLowerCase().includes(q));

    const matchesPage = selectedPageFilter === 'ALL' || item.targetPage === selectedPageFilter;
    const matchesRole = selectedRoleFilter === 'ALL' || item.targetRole === selectedRoleFilter;
    const matchesStatus =
      selectedStatusFilter === 'ALL' ||
      (selectedStatusFilter === 'ACTIVE' && item.isActive) ||
      (selectedStatusFilter === 'INACTIVE' && !item.isActive);

    return matchesSearch && matchesPage && matchesRole && matchesStatus;
  });

  const activeCount = announcements.filter(a => a.isActive).length;
  const liveClassCount = announcements.filter(a => a.targetPage === 'LIVE_CLASS').length;
  const examHallCount = announcements.filter(a => a.targetPage === 'EXAM_HALL').length;

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-2xl shadow-2xl flex items-center space-x-3 text-xs font-bold transition-all transform animate-in slide-in-from-top-3 ${
            toast.type === 'error'
              ? 'bg-rose-600 text-white shadow-rose-600/30'
              : 'bg-emerald-600 text-white shadow-emerald-600/30'
          }`}
        >
          {toast.type === 'error' ? (
            <AlertCircle className="w-4 h-4 text-white shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-3.5 py-1 rounded-full text-xs font-semibold backdrop-blur-md mb-3">
              <Radio className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
              <span>ডায়নামিক ভয়েস ও পেজ-নির্দিষ্ট নোটিফিকেশন সেন্টার</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              পেজ-ভিত্তিক অডিও ও টেক্সট ঘোষণা কন্ট্রোল
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1.5 max-w-2xl leading-relaxed">
              লাইভ ক্লাস, পরীক্ষা হল, মূল ড্যাশবোর্ড ও হোম পেজের জন্য স্পষ্ট বাংলা ফিমেল ভয়েসে স্বয়ংক্রিয় নোটিশ ও হারমোনিক চাইম অ্যালার্ট পরিচালনা করুন।
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleOpenCreate}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs flex items-center space-x-2 shadow-lg shadow-emerald-600/30 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>+ নতুন অডিও ঘোষণা তৈরি করুন</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold text-slate-500 uppercase block">মোট ঘোষণা</span>
          <p className="text-2xl font-black text-slate-900 mt-1">{announcements.length}টি</p>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 shadow-sm">
          <span className="text-[11px] font-bold text-emerald-700 uppercase block">সক্রিয় রয়েছে (Active)</span>
          <p className="text-2xl font-black text-emerald-800 mt-1">{activeCount}টি</p>
        </div>

        <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 shadow-sm">
          <span className="text-[11px] font-bold text-indigo-700 uppercase block">লাইভ ক্লাস ঘোষণা</span>
          <p className="text-2xl font-black text-indigo-900 mt-1">{liveClassCount}টি</p>
        </div>

        <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200 shadow-sm">
          <span className="text-[11px] font-bold text-rose-700 uppercase block">পরীক্ষা হল অ্যালার্ট</span>
          <p className="text-2xl font-black text-rose-900 mt-1">{examHallCount}টি</p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="শিরোনাম বা বার্তা দিয়ে খুঁজুন..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <select
              value={selectedPageFilter}
              onChange={(e) => setSelectedPageFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500"
            >
              <option value="ALL">সকল পেজ (All Pages)</option>
              {TARGET_PAGES.filter(p => p.id !== 'ALL').map(p => (
                <option key={p.id} value={p.id}>{p.label}</option>
              ))}
            </select>

            <select
              value={selectedRoleFilter}
              onChange={(e) => setSelectedRoleFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500"
            >
              <option value="ALL">সকল রোল (All Roles)</option>
              {TARGET_ROLES.filter(r => r.id !== 'ALL').map(r => (
                <option key={r.id} value={r.id}>{r.label}</option>
              ))}
            </select>

            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500"
            >
              <option value="ALL">সকল স্ট্যাটাস</option>
              <option value="ACTIVE">✅ কেবল সক্রিয় (Active)</option>
              <option value="INACTIVE">❌ নিষ্ক্রিয় (Inactive)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Announcements List Grid */}
      {filteredAnnouncements.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-slate-200 space-y-3">
          <BellRing className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="font-bold text-sm text-slate-700">কোনো ঘোষণা পাওয়া যায়নি</h3>
          <p className="text-xs text-slate-400">নতুন অডিও নোটিফিকেশন যুক্ত করতে উপরের বোতামে ক্লিক করুন।</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredAnnouncements.map((item) => {
            const isPlaying = playingItemId === item.id;
            return (
              <div
                key={item.id}
                className={`bg-white rounded-3xl border p-5 shadow-sm space-y-3 flex flex-col justify-between transition-all hover:shadow-md ${
                  item.isActive
                    ? 'border-slate-200'
                    : 'border-slate-200 bg-slate-50/50 opacity-75'
                }`}
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span
                        className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${
                          item.priority === 'URGENT'
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : item.priority === 'HIGH'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                        }`}
                      >
                        {item.priority === 'URGENT' ? '🔴 জরুরি' : item.priority === 'HIGH' ? '🟡 গুরুত্বপূর্ণ' : '🟢 সাধারণ'}
                      </span>

                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                        📍 {TARGET_PAGES.find(p => p.id === item.targetPage)?.label.split('(')[0] || item.targetPage}
                      </span>

                      {item.enableAudio && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-pink-50 text-pink-700 border border-pink-200 flex items-center gap-1">
                          <Headphones className="w-3 h-3 text-pink-600" />
                          <span>ফিমেল ভয়েস</span>
                        </span>
                      )}

                      {item.autoSpeak && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-teal-50 text-teal-700 border border-teal-200">
                          ⚡ অটো-স্পিক
                        </span>
                      )}
                    </div>

                    {/* Active Toggle Switch */}
                    <button
                      type="button"
                      onClick={() => handleToggleActive(item.id)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-black border transition-all ${
                        item.isActive
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                          : 'bg-slate-100 border-slate-200 text-slate-500'
                      }`}
                    >
                      {item.isActive ? '● সক্রিয়' : '○ নিষ্ক্রিয়'}
                    </button>
                  </div>

                  <h3 className="text-sm font-extrabold text-slate-900 line-clamp-1">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed font-medium">
                    {item.message}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center space-x-1.5">
                    {item.enableAudio && (
                      <button
                        type="button"
                        onClick={() => handlePlayListItem(item)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all ${
                          isPlaying
                            ? 'bg-rose-600 text-white animate-pulse'
                            : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-100'
                        }`}
                      >
                        {isPlaying ? (
                          <>
                            <Square className="w-3.5 h-3.5 fill-current" />
                            <span>থামান</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>অডিও শুনুন</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  <div className="flex items-center space-x-1.5">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(item)}
                      className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors"
                      title="এডিট করুন"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id, item.title)}
                      className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl transition-colors"
                      title="মুছে ফেলুন"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CREATE / EDIT ANNOUNCEMENT MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-5 my-8 max-h-[90vh] overflow-y-auto border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <div className="p-2.5 rounded-2xl bg-indigo-50 text-indigo-600">
                  <Radio className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">
                    {editingId ? 'অডিও ঘোষণা সম্পাদনা করুন' : '+ নতুন পেজ-ভিত্তিক অডিও ঘোষণা'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    প্রফেশনাল ফিমেল ভয়েস স্পিচ ও নোটিফিকেশন কনফিগারেশন
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  stopSpeech();
                  setShowModal(false);
                }}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Title & Priority */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-900 mb-1">
                    ঘোষণার শিরোনাম (Title) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="যেমন: লাইভ ক্লাসে অংশ নেওয়ার নিয়মাবলী"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-900 mb-1">গুরুত্ব (Priority)</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 font-bold bg-white"
                  >
                    <option value="NORMAL">🟢 সাধারণ (Normal)</option>
                    <option value="HIGH">🟡 গুরুত্বপূর্ণ (High)</option>
                    <option value="URGENT">🔴 জরুরি (Urgent)</option>
                  </select>
                </div>
              </div>

              {/* Message Content */}
              <div>
                <label className="block font-bold text-slate-900 mb-1">
                  বিস্তারিত বার্তা / ভয়েস স্পিচ টেক্সট <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="যে বার্তাটি ব্যানার আকারে প্রদর্শিত হবে এবং মহিলা কণ্ঠে উচ্চারিত হবে..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              {/* Target Page & Target Role */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                <div>
                  <label className="block font-bold text-slate-900 mb-1">লক্ষ্য পেজ (Target Page)</label>
                  <select
                    value={formData.targetPage}
                    onChange={(e) => setFormData({ ...formData, targetPage: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold bg-white"
                  >
                    {TARGET_PAGES.map(p => (
                      <option key={p.id} value={p.id}>{p.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-900 mb-1">প্রাপক রোল (Target Role)</label>
                  <select
                    value={formData.targetRole}
                    onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold bg-white"
                  >
                    {TARGET_ROLES.map(r => (
                      <option key={r.id} value={r.id}>{r.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Audio & Voice Configuration Panel */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-pink-50 via-indigo-50 to-purple-50 border border-pink-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-slate-900 flex items-center gap-1.5 text-xs">
                    <Headphones className="w-4 h-4 text-pink-600" />
                    <span>🎙️ প্রফেশনাল ফিমেল ভয়েস ও চাইম কনফিগারেশন</span>
                  </h4>

                  <button
                    type="button"
                    onClick={handleTestFormVoice}
                    className={`px-3 py-1 rounded-xl text-[11px] font-extrabold flex items-center space-x-1 transition-all ${
                      testingVoice
                        ? 'bg-rose-600 text-white animate-pulse'
                        : 'bg-pink-600 hover:bg-pink-700 text-white shadow-sm'
                    }`}
                  >
                    {testingVoice ? <Square className="w-3 h-3 fill-current" /> : <Volume2 className="w-3 h-3" />}
                    <span>{testingVoice ? 'থামান' : '🔊 ভয়েস টেস্ট শুনুন'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="flex items-center space-x-2 bg-white p-2.5 rounded-xl border border-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.enableAudio}
                      onChange={(e) => setFormData({ ...formData, enableAudio: e.target.checked })}
                      className="rounded text-pink-600 focus:ring-pink-500 w-4 h-4"
                    />
                    <span className="font-bold text-slate-800">অডিও স্পিচ চালু রাখুন</span>
                  </label>

                  <label className="flex items-center space-x-2 bg-white p-2.5 rounded-xl border border-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.autoSpeak}
                      onChange={(e) => setFormData({ ...formData, autoSpeak: e.target.checked })}
                      className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4"
                    />
                    <span className="font-bold text-slate-800">পেজে প্রবেশের সাথে সাথে স্বয়ংক্রিয় পাঠ (Auto-Speak)</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">অ্যাকোস্টিক চাইম সাউন্ড (Acoustic Chime)</label>
                    <select
                      value={formData.chimeSound}
                      onChange={(e) => setFormData({ ...formData, chimeSound: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold bg-white"
                    >
                      {CHIME_OPTIONS.map(c => (
                        <option key={c.id} value={c.id}>{c.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center space-x-2 pt-4">
                    <button
                      type="button"
                      onClick={() => playChime(formData.chimeSound)}
                      className="px-3 py-2 rounded-xl bg-white hover:bg-slate-100 text-indigo-700 font-bold border border-indigo-200 flex items-center space-x-1.5 shadow-sm"
                    >
                      <span>🔔 চাইম প্লে করুন</span>
                    </button>
                    <span className="text-[10px] text-slate-500 font-medium">ওয়েব অডিও এপিআই সিন্থেসাইজড</span>
                  </div>
                </div>
              </div>

              {/* Status & Actions */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                  />
                  <span className="font-extrabold text-slate-800">ঘোষণাটি এখন সক্রিয় (Active) রাখুন</span>
                </label>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => {
                      stopSpeech();
                      setShowModal(false);
                    }}
                    className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                  >
                    {t('cancel')}
                  </button>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl shadow-md shadow-indigo-600/30 flex items-center space-x-1.5 transition-all disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>{submitting ? 'সংরক্ষণ হচ্ছে...' : editingId ? 'আপডেট করুন' : 'সংরক্ষণ করুন'}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
