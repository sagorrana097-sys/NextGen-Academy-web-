import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useSettings } from '../../context/SettingsContext';
import { settingsAPI, batchAPI, noticeAPI, achieverAPI } from '../../services/api';
import UniversalFileUploader from '../common/UniversalFileUploader';
import DeleteConfirmationModal from '../common/DeleteConfirmationModal';
import {
  Sparkles,
  Save,
  Globe,
  Layout,
  Image as ImageIcon,
  Megaphone,
  Layers,
  Trophy,
  Phone,
  Mail,
  MapPin,
  Share2,
  CheckCircle2,
  AlertCircle,
  Eye,
  Plus,
  Edit2,
  Trash2,
  RefreshCw,
  ExternalLink,
  CreditCard,
  Building,
  GraduationCap
} from 'lucide-react';

export default function GlobalSiteContentCMS() {
  const { lang } = useLanguage();
  const { settings: globalSettings, updateSettings: updateGlobalSettings, refreshSettings } = useSettings();

  // Active Sub-tab: 'hero' | 'notices' | 'batches' | 'achievers' | 'footer'
  const [activeTab, setActiveTab] = useState('hero');

  // Loading States
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // Form State for Site Content
  const [formData, setFormData] = useState({
    academyName: globalSettings?.academyName || 'NextGen ACADEMY',
    academyNameBn: globalSettings?.academyNameBn || 'নেক্সটজেন একাডেমি',
    tagline: globalSettings?.tagline || 'LEARN · GROW · SUCCEED',
    taglineBn: globalSettings?.taglineBn || 'শিক্ষা · সমৃদ্ধি · সাফল্য',
    heroHeadlineBn: globalSettings?.heroHeadlineBn || 'ভর্তি চলছে! শিক্ষাবর্ষ ২০২৬-এ ৬ষ্ঠ থেকে ১২শ শ্রেণিতে ডিজিটাল ভর্তি কার্যক্রম',
    heroSubtitleBn: globalSettings?.heroSubtitleBn || 'অনলাইন লাইভ ক্লাস, স্মার্ট মার্কশিট, স্বয়ংক্রিয় ফি পেমেন্ট ও অভিজ্ঞ শিক্ষক প্যানেলের সমন্বয়ে আধুনিক শিক্ষা ব্যবস্থা।',
    bannerImageUrl: globalSettings?.bannerImageUrl || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&auto=format&fit=crop&q=80',
    logoUrl: globalSettings?.logoUrl || '/logo.png',
    noticeTextBn: globalSettings?.noticeTextBn || 'ভর্তি চলছে! শিক্ষাবর্ষ ২০২৬-এ ৬ষ্ঠ থেকে ১২শ শ্রেণিতে সীমিত আসনে ডিজিটাল ভর্তি কার্যক্রম চালু রয়েছে। যোগাযোগ: 01792818005',
    showNotice: globalSettings?.showNotice !== false,
    admissionActive: globalSettings?.admissionActive !== false,
    admissionSessionYear: globalSettings?.admissionSessionYear || '২০২৬',
    contactPhone: globalSettings?.contactPhone || '+880 1792818005',
    whatsappPhone: globalSettings?.whatsappPhone || '01792818005',
    contactEmail: globalSettings?.contactEmail || 'info@nextgen.edu.bd',
    supportEmail: globalSettings?.supportEmail || 'support@nextgen.edu.bd',
    address: globalSettings?.address || 'রোড #৪, ধানমন্ডি, ঢাকা-১২০৯',
    website: globalSettings?.website || 'https://nextgen.edu.bd',
    facebookUrl: globalSettings?.facebookUrl || 'https://facebook.com/nextgenacademy',
    youtubeUrl: globalSettings?.youtubeUrl || 'https://youtube.com/@nextgenacademy',
    telegramUrl: globalSettings?.telegramUrl || 'https://t.me/nextgenacademy',
    footerCopyrightBn: globalSettings?.footerCopyrightBn || '© ২০২৬ NextGen Academy. সর্বস্বত্ব সংরক্ষিত।'
  });

  // Dynamic Lists for Quick CMS
  const [batchesList, setBatchesList] = useState([]);
  const [noticesList, setNoticesList] = useState([]);
  const [achieversList, setAchieversList] = useState([]);
  const [loadingLists, setLoadingLists] = useState(false);

  // Deletion Modal
  const [deleteModalState, setDeleteModalState] = useState({ isOpen: false, item: null, type: '' });

  useEffect(() => {
    loadCmsLists();
  }, [activeTab]);

  const loadCmsLists = async () => {
    setLoadingLists(true);
    try {
      if (activeTab === 'batches') {
        const res = await batchAPI.getAll();
        if (res.success && res.data) setBatchesList(res.data);
      } else if (activeTab === 'notices') {
        const res = await noticeAPI.getNotices();
        if (res.success && res.data) setNoticesList(res.data);
      } else if (activeTab === 'achievers') {
        const res = await achieverAPI.getAll();
        if (res.success && res.data) setAchieversList(res.data);
      }
    } catch (err) {
      console.error('Failed to load CMS lists:', err);
    } finally {
      setLoadingLists(false);
    }
  };

  const showToast = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleSaveSettings = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    setFeedback(null);
    try {
      const res = await settingsAPI.updateSettings(formData);
      if (res.success) {
        updateGlobalSettings(formData);
        showToast('success', 'ওয়েবসাইটের কনটেন্ট ও পেজ সেটিংস সফলভাবে আপডেট ও সংরক্ষিত হয়েছে!');
        if (refreshSettings) refreshSettings();
      } else {
        showToast('error', res.error?.message || 'সংরক্ষণে সমস্যা হয়েছে');
      }
    } catch (err) {
      showToast('error', err.message || 'নেটওয়ার্ক এরর');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-slate-700/60">
        <div className="absolute right-0 top-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/4 -bottom-10 w-60 h-60 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold shadow-inner">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>সুপার অ্যাডমিন • সাইট কনটেন্ট ও পেজ কন্ট্রোল CMS</span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight">
              গ্লোবাল পেজ কনটেন্ট এডিটর (Global Page CMS)
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl font-medium">
              হোমপেজ ব্যানার, শ্লোগান, নোটিশ টিকার, কোর্স ফি, কৃতি শিক্ষার্থী ও যোগাযোগের সকল তথ্য সরাসরি লাইভ পরিবর্তন করুন
            </p>
          </div>

          <button
            onClick={handleSaveSettings}
            disabled={saving}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-xs shadow-lg shadow-emerald-500/25 transition-all flex items-center space-x-2 self-start md:self-auto transform active:scale-95 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'সংরক্ষণ হচ্ছে...' : 'সকল পরিবর্তন সেভ করুন'}</span>
          </button>
        </div>
      </div>

      {/* Feedback Toast */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl border text-xs font-bold flex items-center space-x-2.5 animate-in fade-in ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* CMS Sub-tabs Navigation */}
      <div className="flex flex-wrap items-center gap-2 bg-slate-200/80 p-1.5 rounded-2xl border border-slate-300/60 shadow-inner w-fit">
        <button
          onClick={() => setActiveTab('hero')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
            activeTab === 'hero'
              ? 'bg-slate-900 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <Layout className="w-4 h-4 text-indigo-400" />
          <span>🌟 হিরো সেকশন ও ব্যানার</span>
        </button>

        <button
          onClick={() => setActiveTab('notices')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
            activeTab === 'notices'
              ? 'bg-slate-900 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <Megaphone className="w-4 h-4 text-rose-400" />
          <span>📢 নোটিশ ও সার্কুলার</span>
        </button>

        <button
          onClick={() => setActiveTab('batches')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
            activeTab === 'batches'
              ? 'bg-slate-900 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <Layers className="w-4 h-4 text-emerald-400" />
          <span>📦 কোর্স ও ব্যাচ ফি কন্ট্রোল</span>
        </button>

        <button
          onClick={() => setActiveTab('achievers')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
            activeTab === 'achievers'
              ? 'bg-slate-900 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <Trophy className="w-4 h-4 text-amber-400" />
          <span>🏆 হল অফ ফেম ও রিভিউ</span>
        </button>

        <button
          onClick={() => setActiveTab('footer')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
            activeTab === 'footer'
              ? 'bg-slate-900 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <Phone className="w-4 h-4 text-cyan-400" />
          <span>📞 হেল্পলাইন, সোশ্যাল ও ফুটার</span>
        </button>
      </div>

      {/* SUB-TAB 1: HERO SECTION & LANDING BANNER CMS */}
      {activeTab === 'hero' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Edit Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-5">
            <h3 className="text-base font-black text-slate-900 flex items-center space-x-2 pb-3 border-b border-slate-100">
              <Layout className="w-5 h-5 text-indigo-600" />
              <span>হোমপেজ ব্যানার ও ব্র্যান্ডিং কন্ট্রোল</span>
            </h3>

            <form onSubmit={handleSaveSettings} className="space-y-4 text-xs font-medium">
              {/* Academy Name & Tagline */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block font-bold text-slate-700">প্রতিষ্ঠানের নাম (বাংলা)</label>
                  <input
                    type="text"
                    value={formData.academyNameBn}
                    onChange={(e) => setFormData({ ...formData, academyNameBn: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-300 focus:bg-white font-black text-slate-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-bold text-slate-700">শ্লোগান (Tagline / Slogan)</label>
                  <input
                    type="text"
                    value={formData.taglineBn}
                    onChange={(e) => setFormData({ ...formData, taglineBn: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-300 focus:bg-white text-slate-800 font-bold"
                  />
                </div>
              </div>

              {/* Hero Headline */}
              <div className="space-y-1">
                <label className="block font-bold text-slate-700">হিরো সেকশন প্রধান শিরোনাম (Headline)</label>
                <input
                  type="text"
                  value={formData.heroHeadlineBn}
                  onChange={(e) => setFormData({ ...formData, heroHeadlineBn: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-300 focus:bg-white font-black text-slate-900 text-sm"
                />
              </div>

              {/* Hero Subtitle */}
              <div className="space-y-1">
                <label className="block font-bold text-slate-700">বিবরণী ও পরিচিতি টেক্সট (Subtitle)</label>
                <textarea
                  rows="3"
                  value={formData.heroSubtitleBn}
                  onChange={(e) => setFormData({ ...formData, heroSubtitleBn: e.target.value })}
                  className="w-full p-3 bg-slate-50 rounded-xl border border-slate-300 focus:bg-white text-slate-800 leading-relaxed"
                ></textarea>
              </div>

              {/* Banner Image Uploader */}
              <div className="space-y-1.5">
                <label className="block font-bold text-slate-700">হোমপেজ ব্যানার ব্যাকগ্রাউন্ড ছবি</label>
                <UniversalFileUploader
                  label="ব্যানার ছবি আপলোড অথবা লিঙ্ক দিন"
                  accept="image/*,.jpg,.jpeg,.png,.webp"
                  value={formData.bannerImageUrl}
                  onChange={(output) => {
                    const url = typeof output === 'string' ? output : output?.url || '';
                    setFormData((prev) => ({ ...prev, bannerImageUrl: url }));
                  }}
                />
              </div>

              {/* Announcement Marquee Ticker */}
              <div className="space-y-1 pt-1">
                <label className="block font-bold text-slate-700">লাইভ নোটিশ ও এনাউন্সমেন্ট টিকার টেক্সট</label>
                <input
                  type="text"
                  value={formData.noticeTextBn}
                  onChange={(e) => setFormData({ ...formData, noticeTextBn: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-300 focus:bg-white text-slate-800 font-medium"
                />
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <label className="flex items-center space-x-2 cursor-pointer p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <input
                    type="checkbox"
                    checked={formData.admissionActive}
                    onChange={(e) => setFormData({ ...formData, admissionActive: e.target.checked })}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="font-bold text-slate-700">অনলাইন ভর্তি বাটন চালু রাখুন</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <input
                    type="checkbox"
                    checked={formData.showNotice}
                    onChange={(e) => setFormData({ ...formData, showNotice: e.target.checked })}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="font-bold text-slate-700">শীর্ষ নোটিশ টিকার দৃশ্যমান রাখুন</span>
                </label>
              </div>

              <div className="pt-3 border-t flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center space-x-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'সংরক্ষণ হচ্ছে...' : 'ব্যানার সেটিংস সেভ করুন'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Live Preview Card */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl border border-slate-700 space-y-4 sticky top-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold">
                  <Eye className="w-4 h-4" />
                  <span>লাইভ ভিজিটর প্রিভিউ (Live Preview)</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">Mobile & Desktop</span>
              </div>

              {/* Ticker Preview */}
              {formData.showNotice && (
                <div className="p-2.5 bg-amber-500/20 border border-amber-500/40 rounded-xl text-amber-300 text-[11px] font-bold flex items-center space-x-2">
                  <Megaphone className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 animate-bounce" />
                  <span className="truncate">{formData.noticeTextBn}</span>
                </div>
              )}

              {/* Hero Card Preview */}
              <div className="relative rounded-2xl overflow-hidden p-6 bg-gradient-to-br from-indigo-900/90 to-slate-950 border border-slate-700 space-y-3">
                <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-white/10 text-amber-300 text-[10px] font-bold">
                  <Sparkles className="w-3 h-3" />
                  <span>{formData.taglineBn}</span>
                </div>

                <h2 className="text-lg font-black text-white leading-tight">
                  {formData.heroHeadlineBn}
                </h2>

                <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                  {formData.heroSubtitleBn}
                </p>

                {formData.admissionActive && (
                  <div className="pt-2 flex items-center space-x-2">
                    <span className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-black text-xs shadow-md">
                      ভর্তি আবেদন {formData.admissionSessionYear}
                    </span>
                    <span className="px-3 py-2 rounded-xl bg-white/10 text-white text-xs font-bold">
                      লগইন পোর্টাল
                    </span>
                  </div>
                )}
              </div>

              <div className="text-[10px] text-slate-400 text-center font-mono">
                পরিবর্তন সেভ করলে তা তাৎক্ষণিকভাবে মূল হোমপেজে কার্যকর হবে।
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: NOTICES & CIRCULARS CMS */}
      {activeTab === 'notices' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-black text-slate-900 flex items-center space-x-2">
                <Megaphone className="w-5 h-5 text-rose-600" />
                <span>লাইভ নোটিশ বোর্ড কনটেন্ট কন্ট্রোল</span>
              </h3>
              <p className="text-xs text-slate-500">হোমপেজ ও শিক্ষার্থী পোর্টালের নোটিশ সরাসরি সম্পাদনা করুন</p>
            </div>
          </div>

          <div className="space-y-3">
            {noticesList.map((n) => (
              <div key={n.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                      n.priority === 'URGENT' ? 'bg-rose-100 text-rose-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {n.priority}
                    </span>
                    <span className="text-xs font-black text-slate-900">{n.titleBn}</span>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-1">{n.contentBn}</p>
                </div>

                <div className="flex items-center space-x-2 flex-shrink-0">
                  <span className="text-[10px] text-slate-400 font-mono">
                    {new Date(n.publishedAt).toLocaleDateString('bn-BD')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: BATCHES & COURSES FEE CMS */}
      {activeTab === 'batches' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-black text-slate-900 flex items-center space-x-2">
                <Layers className="w-5 h-5 text-emerald-600" />
                <span>কোর্স ও ব্যাচ ফি কনফিগারেশন</span>
              </h3>
              <p className="text-xs text-slate-500">মাসিক টিউশন ফি ও সেশন চার্জ পরিচালনা করুন</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {batchesList.map((b) => (
              <div key={b.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-lg bg-emerald-100 text-emerald-800 font-black text-xs">
                      {b.nameBn}
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-500">শিফট: {b.shift}</span>
                  </div>
                  <div className="mt-3 text-2xl font-black text-slate-900 font-mono">
                    ৳ {Number(b.monthlyFee || 2000).toLocaleString('en-BD')}
                    <span className="text-xs font-normal text-slate-500 ml-1">/মাসিক</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">আসন সংখ্যা: {b.capacity || 40} জন</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 4: HALL OF FAME CMS */}
      {activeTab === 'achievers' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-black text-slate-900 flex items-center space-x-2">
                <Trophy className="w-5 h-5 text-amber-500" />
                <span>টপ স্কোরার ও হল অফ ফেম সরাসরি নিয়ন্ত্রণ</span>
              </h3>
              <p className="text-xs text-slate-500">ওয়েবসাইটের কৃতি শিক্ষার্থীদের রিভিউ ও রেজাল্ট কার্ড</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {achieversList.map((a) => (
              <div key={a.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-center">
                <img
                  src={a.studentPhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'}
                  alt={a.nameBn}
                  className="w-16 h-16 rounded-2xl mx-auto object-cover ring-2 ring-amber-400 shadow"
                />
                <h4 className="font-black text-xs text-slate-900">{a.nameBn}</h4>
                <div className="text-[11px] font-black text-emerald-700">{a.gpa}</div>
                <span className="text-[10px] text-slate-500 font-semibold">{a.institute}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 5: FOOTER, CONTACT & HELPLINE CMS */}
      {activeTab === 'footer' && (
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-5">
          <h3 className="text-base font-black text-slate-900 flex items-center space-x-2 pb-3 border-b border-slate-100">
            <Phone className="w-5 h-5 text-cyan-600" />
            <span>যোগাযোগ, সোশ্যাল লিংক ও ফুটার ইনফরমেশন</span>
          </h3>

          <form onSubmit={handleSaveSettings} className="space-y-4 text-xs font-medium">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block font-bold text-slate-700">প্রধান হেল্পলাইন নম্বর</label>
                <input
                  type="text"
                  value={formData.contactPhone}
                  onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-300 font-mono font-bold text-slate-900"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-slate-700">WhatsApp সাপোর্ট নম্বর</label>
                <input
                  type="text"
                  value={formData.whatsappPhone}
                  onChange={(e) => setFormData({ ...formData, whatsappPhone: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-300 font-mono font-bold text-emerald-700"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-slate-700">অফিসিয়াল ইমেইল</label>
                <input
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-300"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-slate-700">ক্যাম্পাস ঠিকানা</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-300"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-slate-700">Facebook Page URL</label>
                <input
                  type="url"
                  value={formData.facebookUrl}
                  onChange={(e) => setFormData({ ...formData, facebookUrl: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-300 font-mono text-slate-700"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-slate-700">YouTube Channel URL</label>
                <input
                  type="url"
                  value={formData.youtubeUrl}
                  onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-300 font-mono text-slate-700"
                />
              </div>
            </div>

            <div className="space-y-1 pt-1">
              <label className="block font-bold text-slate-700">ফুটার কপিরাইট টেক্সট</label>
              <input
                type="text"
                value={formData.footerCopyrightBn}
                onChange={(e) => setFormData({ ...formData, footerCopyrightBn: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-300 font-bold"
              />
            </div>

            <div className="pt-3 border-t flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center space-x-1.5"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'সংরক্ষণ হচ্ছে...' : 'যোগাযোগ ও ফুটার তথ্য সেভ করুন'}</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
