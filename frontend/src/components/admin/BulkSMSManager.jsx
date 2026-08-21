import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { smsAPI, adminAPI, batchAPI } from '../../services/api';
import {
  MessageSquare,
  Send,
  Sparkles,
  Users,
  CreditCard,
  Award,
  AlertTriangle,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  Search,
  Filter,
  Smartphone,
  Copy,
  Plus,
  RefreshCw,
  Info,
  ShieldCheck,
  Layers,
  ChevronRight,
  Hash,
  Phone,
  BookmarkPlus
} from 'lucide-react';

export default function BulkSMSManager() {
  const { t, lang } = useLanguage();
  const { user } = useAuth();

  const [activeSubTab, setActiveSubTab] = useState('compose'); // 'compose' | 'logs' | 'templates'
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState(null);
  const [classes, setClasses] = useState([]);
  const [batches, setBatches] = useState([]);

  // Compose State
  const [targetType, setTargetType] = useState('STUDENTS');
  const [selectedClass, setSelectedClass] = useState('ALL');
  const [selectedBatch, setSelectedBatch] = useState('ALL');
  const [dueOnly, setDueOnly] = useState(false);
  const [category, setCategory] = useState('NOTICE');
  const [templateText, setTemplateText] = useState(
    'বিজ্ঞপ্তি: {প্রতিষ্ঠানের_নাম}-এর সকল কার্যক্রম আগামী {তারিখ} তারিখে বন্ধ থাকবে। পরবর্তী কার্যদিবস হতে রুটিন মাফিক ক্লাস চলবে। - কর্তৃপক্ষ'
  );
  const [dueDate, setDueDate] = useState('২৫ আগস্ট ২০২৬');
  const [examName, setExamName] = useState('১ম সাময়িক পরীক্ষা ২০২৬');

  // Preview & Recipient Data
  const [previewData, setPreviewData] = useState({
    totalRecipients: 0,
    estimatedTotalSMS: 0,
    sampleMessage: '',
    sampleRecipients: [],
    smsParts: 1,
    charCount: 0
  });

  // Logs State
  const [logs, setLogs] = useState([]);
  const [logsLoading, setLogsLoading] = useState(false);
  const [logSearch, setLogSearch] = useState('');
  const [logCategoryFilter, setLogCategoryFilter] = useState('ALL');
  const [logStatusFilter, setLogStatusFilter] = useState('ALL');

  // Templates State
  const [templates, setTemplates] = useState([]);
  const [showNewTemplateModal, setShowNewTemplateModal] = useState(false);
  const [newTemplateTitle, setNewTemplateTitle] = useState('');
  const [newTemplateCategory, setNewTemplateCategory] = useState('CUSTOM');
  const [newTemplateText, setNewTemplateText] = useState('');

  // UI Feedback
  const [feedback, setFeedback] = useState(null);
  const [sending, setSending] = useState(false);

  const textareaRef = useRef(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    fetchPreview();
  }, [targetType, selectedClass, selectedBatch, dueOnly, category, templateText, dueDate, examName]);

  useEffect(() => {
    if (activeSubTab === 'logs') {
      fetchLogs();
    }
  }, [activeSubTab, logSearch, logCategoryFilter, logStatusFilter]);

  const showToast = (msg, type = 'success') => {
    setFeedback({ msg, type });
    setTimeout(() => setFeedback(null), 4000);
  };

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [sumRes, batchRes] = await Promise.all([
        smsAPI.getSummary(),
        batchAPI.getAll()
      ]);

      if (sumRes.success && sumRes.data) {
        setSummary(sumRes.data);
        setTemplates(sumRes.data.templates || []);
      }

      if (batchRes.success && batchRes.data) {
        setBatches(batchRes.data.batches || []);
        setClasses(batchRes.data.classes || []);
      }
    } catch (err) {
      console.error('Initial SMS data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPreview = async () => {
    try {
      const res = await smsAPI.previewSMS({
        targetType,
        classId: selectedClass,
        batchId: selectedBatch,
        dueOnly,
        category,
        templateText,
        dueDate,
        examName
      });

      if (res.success && res.data) {
        setPreviewData(res.data);
      }
    } catch (err) {
      console.error('Fetch preview error:', err);
    }
  };

  const fetchLogs = async () => {
    setLogsLoading(true);
    try {
      const res = await smsAPI.getLogs({
        search: logSearch,
        category: logCategoryFilter,
        status: logStatusFilter
      });
      if (res.success && res.data) {
        setLogs(res.data.logs || []);
      }
    } catch (err) {
      console.error('Fetch logs error:', err);
    } finally {
      setLogsLoading(false);
    }
  };

  const handleInsertTag = (tag) => {
    if (!textareaRef.current) return;
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const current = templateText;
    const updated = current.substring(0, start) + tag + current.substring(end);
    setTemplateText(updated);
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(start + tag.length, start + tag.length);
      }
    }, 50);
  };

  const handleSelectPresetTemplate = (tmpl) => {
    setTemplateText(tmpl.templateText);
    setCategory(tmpl.category);
    showToast(`'${tmpl.title}' টেমপ্লেট লোড করা হয়েছে!`);
  };

  const handleSendBulkSMS = async () => {
    if (!templateText.trim()) {
      alert('অনুগ্রহ করে এসএমএস টেক্সট লিখুন।');
      return;
    }

    if (previewData.totalRecipients === 0) {
      alert('নির্বাচিত ফিল্টারে কোনো প্রাপক পাওয়া যায়নি।');
      return;
    }

    const confirmMsg = `আপনি কি নিশ্চিতভাবে ${previewData.totalRecipients} জন প্রাপকের নিকট আনুমানিক ${previewData.estimatedTotalSMS}টি এসএমএস পাঠাতে চান?`;
    if (!window.confirm(confirmMsg)) return;

    setSending(true);
    try {
      const res = await smsAPI.sendBulkSMS({
        targetType,
        classId: selectedClass,
        batchId: selectedBatch,
        dueOnly,
        category,
        templateText,
        dueDate,
        examName
      });

      if (res.success) {
        showToast(res.message);
        fetchInitialData();
        fetchLogs();
      } else {
        alert(res.error?.message || 'এসএমএস পাঠাতে সমস্যা হয়েছে।');
      }
    } catch (err) {
      console.error('Send bulk SMS error:', err);
      alert(err.message || 'এসএমএস প্রেরণ ব্যর্থ হয়েছে।');
    } finally {
      setSending(false);
    }
  };

  const handleSaveNewTemplate = async (e) => {
    e.preventDefault();
    if (!newTemplateTitle || !newTemplateText) {
      alert('শিরোনাম ও টেমপ্লেট টেক্সট আবশ্যক।');
      return;
    }

    try {
      const res = await smsAPI.saveTemplate({
        title: newTemplateTitle,
        category: newTemplateCategory,
        templateText: newTemplateText
      });

      if (res.success) {
        showToast(res.message);
        setShowNewTemplateModal(false);
        setNewTemplateTitle('');
        setNewTemplateText('');
        fetchInitialData();
      }
    } catch (err) {
      console.error('Save template error:', err);
      alert(err.message || 'টেমপ্লেট সংরক্ষণ ব্যর্থ হয়েছে');
    }
  };

  const dynamicTags = [
    { tag: '{শিক্ষার্থীর_নাম}', label: 'শিক্ষার্থীর নাম', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    { tag: '{রোল}', label: 'রোল নম্বর', color: 'bg-blue-50 text-blue-700 border-blue-200' },
    { tag: '{শ্রেণি}', label: 'শ্রেণি', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
    { tag: '{ব্যাচ}', label: 'ব্যাচ', color: 'bg-purple-50 text-purple-700 border-purple-200' },
    { tag: '{বকেয়া_ফি_টাকা}', label: 'বকেয়া ফি (টাকা)', color: 'bg-rose-50 text-rose-700 border-rose-200' },
    { tag: '{পরিশোধের_শেষ_তারিখ}', label: 'শেষ তারিখ', color: 'bg-amber-50 text-amber-700 border-amber-200' },
    { tag: '{পরীক্ষার_নাম}', label: 'পরীক্ষার নাম', color: 'bg-teal-50 text-teal-700 border-teal-200' },
    { tag: '{প্রাপ্ত_নম্বর}', label: 'প্রাপ্ত নম্বর', color: 'bg-cyan-50 text-cyan-700 border-cyan-200' },
    { tag: '{জিপিএ}', label: 'জিপিএ (GPA)', color: 'bg-violet-50 text-violet-700 border-violet-200' },
    { tag: '{মেধাক্রম}', label: 'মেধাক্রম', color: 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200' },
    { tag: '{প্রতিষ্ঠানের_নাম}', label: 'প্রতিষ্ঠানের নাম', color: 'bg-slate-100 text-slate-700 border-slate-300' },
    { tag: '{তারিখ}', label: 'আজকের তারিখ', color: 'bg-orange-50 text-orange-700 border-orange-200' }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-slate-700/60">
        <div className="absolute right-0 top-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 -bottom-10 w-60 h-60 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>{lang === 'bn' ? 'টেলকো এন্টারপ্রাইজ গেটওয়ে • ডায়নামিক মাস্কিং' : 'Telco Enterprise SMS Gateway'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white">
              {t('smsTitle')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl font-medium">
              {t('smsSubtitle')}
            </p>
          </div>

          {/* Quick Balance Pill */}
          {summary && summary.balance && (
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 flex items-center space-x-4">
              <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-300">
                <Send className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] text-slate-300 font-bold uppercase">{t('smsBalance')}</span>
                <p className="text-2xl font-black text-white font-mono tracking-tight">
                  {summary.balance.remaining.toLocaleString()} <span className="text-xs text-emerald-300 font-normal">SMS</span>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Toast Feedback */}
      {feedback && (
        <div className={`p-4 rounded-2xl border text-xs font-bold flex items-center space-x-2.5 animate-in fade-in ${
          feedback.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'
        }`}>
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{feedback.msg}</span>
        </div>
      )}

      {/* KPI Cards */}
      {summary && summary.balance && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase">{t('smsBalance')}</span>
              <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-600">
                <Smartphone className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-black text-emerald-700 mt-2 font-mono">{summary.balance.remaining.toLocaleString()}</p>
            <span className="text-[11px] text-emerald-700 font-bold mt-1 inline-block">অটো রিলোড সক্রিয়</span>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase">{t('smsSentTotal')}</span>
              <div className="p-2.5 rounded-2xl bg-indigo-50 text-indigo-600">
                <Send className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-black text-slate-900 mt-2 font-mono">{summary.balance.totalSent.toLocaleString()}</p>
            <span className="text-[11px] text-indigo-700 font-bold mt-1 inline-block">মোট সফল বার্তা প্রেরণ</span>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase">{t('smsDeliveryRate')}</span>
              <div className="p-2.5 rounded-2xl bg-teal-50 text-teal-600">
                <ShieldCheck className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-black text-teal-700 mt-2 font-mono">{summary.balance.deliveryRate}%</p>
            <span className="text-[11px] text-teal-700 font-bold mt-1 inline-block">সাকসেসফুল ট্র্যাকিং</span>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase">গেটওয়ে ও প্রেরক মাস্ক</span>
              <div className="p-2.5 rounded-2xl bg-purple-50 text-purple-600">
                <ShieldCheck className="w-5 h-5" />
              </div>
            </div>
            <p className="text-lg font-black text-purple-900 mt-2">{summary.balance.senderMask}</p>
            <span className="text-[11px] text-emerald-700 font-bold mt-1 inline-block">🟢 {summary.balance.gatewayStatus}</span>
          </div>
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-1">
        <button
          onClick={() => setActiveSubTab('compose')}
          className={`px-5 py-2.5 rounded-2xl font-bold text-xs transition-all flex items-center space-x-2 ${
            activeSubTab === 'compose'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
          }`}
        >
          <Send className="w-4 h-4" />
          <span>{t('smsComposeTab')}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('logs')}
          className={`px-5 py-2.5 rounded-2xl font-bold text-xs transition-all flex items-center space-x-2 ${
            activeSubTab === 'logs'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>{t('smsLogsTab')}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('templates')}
          className={`px-5 py-2.5 rounded-2xl font-bold text-xs transition-all flex items-center space-x-2 ${
            activeSubTab === 'templates'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>{t('smsTemplatesTab')}</span>
        </button>
      </div>

      {/* TAB 1: COMPOSE & DISPATCH */}
      {activeSubTab === 'compose' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Form & Variable Designer (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            {/* Filter Card */}
            <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-4">
              <h3 className="text-sm font-black text-slate-900 flex items-center space-x-2">
                <Users className="w-4 h-4 text-indigo-600" />
                <span>{t('targetRecipients')} (Recipient Filtering)</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">টার্গেট গ্রুপ</label>
                  <select
                    value={targetType}
                    onChange={(e) => setTargetType(e.target.value)}
                    className="w-full text-xs font-semibold rounded-xl border border-slate-300 p-2.5 bg-slate-50 focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="STUDENTS">সকল শিক্ষার্থী ও অভিভাবক</option>
                    <option value="TEACHERS">শিক্ষক ও স্টাফ</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">শ্রেণি নির্বাচন</label>
                  <select
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    disabled={targetType === 'TEACHERS'}
                    className="w-full text-xs font-semibold rounded-xl border border-slate-300 p-2.5 bg-slate-50 focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                  >
                    <option value="ALL">সকল শ্রেণি (Class 6-12)</option>
                    {classes.map((cls) => (
                      <option key={cls.id} value={cls.id}>
                        {cls.nameBn || cls.name || `Class ${cls.id}`}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">ব্যাচ নির্বাচন</label>
                  <select
                    value={selectedBatch}
                    onChange={(e) => setSelectedBatch(e.target.value)}
                    disabled={targetType === 'TEACHERS'}
                    className="w-full text-xs font-semibold rounded-xl border border-slate-300 p-2.5 bg-slate-50 focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                  >
                    <option value="ALL">সকল ব্যাচ</option>
                    {batches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Due Filter Checkbox & Category Selector */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
                <label className="flex items-center space-x-2 text-xs font-bold text-slate-800 cursor-pointer bg-rose-50/70 hover:bg-rose-100/70 p-2 rounded-xl border border-rose-200 transition-colors">
                  <input
                    type="checkbox"
                    checked={dueOnly}
                    onChange={(e) => setDueOnly(e.target.checked)}
                    disabled={targetType === 'TEACHERS'}
                    className="rounded text-rose-600 focus:ring-rose-500 w-4 h-4"
                  />
                  <span className="text-rose-700 font-black">{t('dueOnlyStudents')}</span>
                </label>

                <div className="flex items-center space-x-2">
                  <span className="text-[11px] font-bold text-slate-600">বার্তার ক্যাটাগরি:</span>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="text-xs font-bold rounded-xl border border-slate-300 px-3 py-1.5 bg-slate-50 focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="NOTICE">সাধারণ নোটিশ (Notice)</option>
                    <option value="DUE_ALERT">বকেয়া ফি তাগাদা (Due Alert)</option>
                    <option value="RESULT_ALERT">ফলাফল প্রকাশ (Result)</option>
                    <option value="EMERGENCY">জরুরি বার্তা (Emergency)</option>
                    <option value="ATTENDANCE_ALERT">অনুপস্থিতি (Absence)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Template & Message Composer */}
            <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-slate-900 flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-indigo-600" />
                  <span>এসএমএস বার্তা ও টেমপ্লেট ডিজাইনার</span>
                </h3>

                {/* Preset Dropdown */}
                <select
                  onChange={(e) => {
                    const tmpl = templates.find((t) => t.id === Number(e.target.value));
                    if (tmpl) handleSelectPresetTemplate(tmpl);
                  }}
                  className="text-xs font-bold rounded-xl border border-indigo-200 bg-indigo-50/70 text-indigo-900 px-3 py-1.5"
                  defaultValue=""
                >
                  <option value="" disabled>⚡ {t('templateSelector')}</option>
                  {templates.map((tmpl) => (
                    <option key={tmpl.id} value={tmpl.id}>
                      {tmpl.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* 4 Instant One-Click Presets */}
              <div className="space-y-1.5 p-3 rounded-2xl bg-indigo-50/50 border border-indigo-100">
                <span className="text-[11px] font-black text-indigo-900 flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  <span>দ্রুত রেডিমেড টেমপ্লেট নির্বাচন করুন (Quick 1-Click Presets):</span>
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setTemplateText('সম্মানিত অভিভাবক, আপনার সন্তান {শিক্ষার্থীর_নাম} (রোল: {রোল}) আজ {তারিখ} তারিখে একাডেমিতে উপস্থিত হয়েছে। - {প্রতিষ্ঠানের_নাম}');
                      setCategory('ATTENDANCE_ALERT');
                      showToast('উপস্থিতি অ্যালার্ট টেমপ্লেট লোড হয়েছে!');
                    }}
                    className="p-2 rounded-xl bg-emerald-100/80 hover:bg-emerald-200/80 text-emerald-900 border border-emerald-300/80 text-[11px] font-black transition-all flex items-center justify-center space-x-1 shadow-sm active:scale-95 text-center"
                  >
                    <span>📢 দৈনিক উপস্থিতি</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setTemplateText('সম্মানিত অভিভাবক, আপনার সন্তান {শিক্ষার্থীর_নাম} (রোল: {রোল})-এর মাসিক বকেয়া ফি {বকেয়া_ফি_টাকা} টাকা। আগামী {পরিশোধের_শেষ_তারিখ} তারিখের মধ্যে পরিশোধের অনুরোধ করা হলো। - {প্রতিষ্ঠানের_নাম}');
                      setCategory('DUE_ALERT');
                      setDueOnly(true);
                      showToast('বকেয়া ফি রিমাইন্ডার টেমপ্লেট লোড হয়েছে!');
                    }}
                    className="p-2 rounded-xl bg-rose-100/80 hover:bg-rose-200/80 text-rose-900 border border-rose-300/80 text-[11px] font-black transition-all flex items-center justify-center space-x-1 shadow-sm active:scale-95 text-center"
                  >
                    <span>💳 বকেয়া ফি তাগাদা</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setTemplateText('শুভ সংবাদ! {শিক্ষার্থীর_নাম} (রোল: {রোল})-এর {পরীক্ষার_নাম}-এর ফলাফল প্রকাশিত হয়েছে। প্রাপ্ত নম্বর: {প্রাপ্ত_নম্বর}, জিপিএ: {জিপিএ} ({মেধাক্রম})। - {প্রতিষ্ঠানের_নাম}');
                      setCategory('RESULT_ALERT');
                      showToast('পরীক্ষার ফলাফল টেমপ্লেট লোড হয়েছে!');
                    }}
                    className="p-2 rounded-xl bg-purple-100/80 hover:bg-purple-200/80 text-purple-900 border border-purple-300/80 text-[11px] font-black transition-all flex items-center justify-center space-x-1 shadow-sm active:scale-95 text-center"
                  >
                    <span>🏆 রেজাল্ট ও মার্কশিট</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setTemplateText('জরুরি বিজ্ঞপ্তি: {প্রতিষ্ঠানের_নাম}-এর সকল কার্যক্রম আগামী {তারিখ} তারিখে বন্ধ থাকবে। পরবর্তী কার্যদিবসে যথারীতি ক্লাস চলবে। - কর্তৃপক্ষ');
                      setCategory('NOTICE');
                      showToast('সাধারণ নোটিশ টেমপ্লেট লোড হয়েছে!');
                    }}
                    className="p-2 rounded-xl bg-amber-100/80 hover:bg-amber-200/80 text-amber-900 border border-amber-300/80 text-[11px] font-black transition-all flex items-center justify-center space-x-1 shadow-sm active:scale-95 text-center"
                  >
                    <span>🚨 নোটিশ ও ছুটি</span>
                  </button>
                </div>
              </div>

              {/* Dynamic Variables Chips */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-600 block">
                  {t('dynamicVariables')}:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {dynamicTags.map((dt) => (
                    <button
                      key={dt.tag}
                      type="button"
                      onClick={() => handleInsertTag(dt.tag)}
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-xl border transition-all hover:scale-105 active:scale-95 ${dt.color}`}
                      title="ক্লিক করে মেসেজে ইনসার্ট করুন"
                    >
                      + {dt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Textarea */}
              <div className="space-y-2">
                <textarea
                  ref={textareaRef}
                  value={templateText}
                  onChange={(e) => setTemplateText(e.target.value)}
                  rows={5}
                  placeholder="এখানে বাংলা বা ইংরেজিতে এসএমএস বার্তা লিখুন..."
                  className="w-full p-3.5 text-xs sm:text-sm font-medium rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed font-sans"
                />

                {/* Character & Part Counter Bar */}
                <div className="flex flex-wrap items-center justify-between text-xs font-bold text-slate-500 px-1">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 font-mono">
                      {templateText.length} অক্ষর (Chars)
                    </span>
                    <span className="px-2 py-0.5 rounded-lg bg-indigo-50 text-indigo-700 font-mono">
                      {previewData.smsParts} টি পার্ট / প্রাপক
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    * বাংলা ইউনিকোড: ৭০ অক্ষরে ১ম এসএমএস, পরবর্তী প্রতি পার্ট ৬৭ অক্ষর
                  </span>
                </div>
              </div>

              {/* Optional parameters for preview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">পরিশোধের শেষ তারিখ (বকেয়া ফি টেমপ্লেটের জন্য)</label>
                  <input
                    type="text"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full text-xs font-medium rounded-xl border border-slate-300 px-3 py-1.5"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">পরীক্ষার নাম (ফলাফল টেমপ্লেটের জন্য)</label>
                  <input
                    type="text"
                    value={examName}
                    onChange={(e) => setExamName(e.target.value)}
                    className="w-full text-xs font-medium rounded-xl border border-slate-300 px-3 py-1.5"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Live Mobile Preview & Dispatch CTA (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            {/* Live Mobile Screen Simulator */}
            <div className="bg-slate-900 rounded-3xl p-5 shadow-2xl border border-slate-800 text-white space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <Smartphone className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold text-slate-200">লাইভ মোবাইল প্রিভিউ (Live Phone Screen)</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">
                  NextGenACAD
                </span>
              </div>

              {/* Simulated Phone Bubble */}
              <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800/80 min-h-[160px] flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span>আজকে {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    <span>SMS #{previewData.smsParts}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-100 font-medium leading-relaxed whitespace-pre-wrap bg-slate-900/90 p-3 rounded-xl border border-slate-800 text-left">
                    {previewData.sampleMessage || 'এসএমএস বার্তা টাইপ করুন...'}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-400">
                  <span>প্রেরক: NextGen Academy</span>
                  <span className="text-emerald-400 font-bold">✓ ডেলিভারি নিশ্চিত</span>
                </div>
              </div>

              {/* Dispatch Stats Summary */}
              <div className="bg-white/5 rounded-2xl p-3.5 space-y-2 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>মোট নির্বাচিত প্রাপক:</span>
                  <span className="font-bold text-white font-mono">{previewData.totalRecipients} জন</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>আনুমানিক মোট এসএমএস খরচ:</span>
                  <span className="font-bold text-emerald-400 font-mono">{previewData.estimatedTotalSMS} টি</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>প্রেরণের পর অবশিষ্ট ব্যালেন্স:</span>
                  <span className="font-bold text-indigo-300 font-mono">
                    {summary?.balance ? (summary.balance.remaining - previewData.estimatedTotalSMS).toLocaleString() : 0} SMS
                  </span>
                </div>
              </div>

              {/* Send CTA Button */}
              <button
                onClick={handleSendBulkSMS}
                disabled={sending || previewData.totalRecipients === 0}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm shadow-lg shadow-emerald-600/30 flex items-center justify-center space-x-2 transition-all transform active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
              >
                <Send className={`w-4 h-4 ${sending ? 'animate-spin' : ''}`} />
                <span>{sending ? 'এসএমএস পাঠানো হচ্ছে...' : `${t('sendBulkSMSBtn')} (${previewData.totalRecipients} জন)`}</span>
              </button>
            </div>

            {/* Recipient Sample Preview List */}
            {previewData.sampleRecipients && previewData.sampleRecipients.length > 0 && (
              <div className="bg-white rounded-3xl border border-slate-200 p-4 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">নির্বাচিত প্রাপক নমুনা ({previewData.sampleRecipients.length} জন)</span>
                  <span className="text-[10px] text-slate-400 font-mono">লাইভ রেজোলিউশন</span>
                </div>
                <div className="divide-y divide-slate-100 max-h-48 overflow-y-auto pr-1">
                  {previewData.sampleRecipients.map((rec, idx) => (
                    <div key={idx} className="py-2 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-slate-800">{rec.name}</span>
                        <span className="text-slate-400 text-[10px] block font-mono">{rec.className} • রোল: {rec.rollNo}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-bold text-indigo-700">{rec.phone}</span>
                        {dueOnly && (
                          <span className="text-[10px] text-rose-600 block font-bold">বকেয়া: {rec.dueAmount}/-</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: DELIVERY LOGS */}
      {activeSubTab === 'logs' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
                <Clock className="w-5 h-5 text-indigo-600" />
                <span>{t('smsLogsTab')} ({logs.length} টি প্রেরিত বার্তা)</span>
              </h3>
              <p className="text-xs text-slate-500">প্রেরিত প্রতিটি এসএমএসের রিয়েল-টাইম ডেলিভারি স্ট্যাটাস ও হিস্ট্রি</p>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="relative">
                <input
                  type="text"
                  value={logSearch}
                  onChange={(e) => setLogSearch(e.target.value)}
                  placeholder="মোবাইল বা নাম দিয়ে খুঁজুন..."
                  className="pl-8 pr-3 py-1.5 text-xs font-medium rounded-xl border border-slate-300 w-48 focus:ring-2 focus:ring-indigo-500"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              </div>

              <select
                value={logCategoryFilter}
                onChange={(e) => setLogCategoryFilter(e.target.value)}
                className="text-xs font-bold rounded-xl border border-slate-300 px-2.5 py-1.5 bg-slate-50"
              >
                <option value="ALL">সকল ক্যাটাগরি</option>
                <option value="NOTICE">নোটিশ</option>
                <option value="DUE_ALERT">বকেয়া ফি</option>
                <option value="RESULT_ALERT">ফলাফল</option>
                <option value="EMERGENCY">জরুরি</option>
              </select>

              <button
                onClick={fetchLogs}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                title="রিফ্রেশ করুন"
              >
                <RefreshCw className={`w-4 h-4 ${logsLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Logs Table */}
          <div className="overflow-x-auto border border-slate-100 rounded-2xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">মেসেজ আইডি</th>
                  <th className="py-3 px-4">প্রাপকের মোবাইল</th>
                  <th className="py-3 px-4">শিক্ষার্থীর নাম ও শ্রেণি</th>
                  <th className="py-3 px-4">বার্তার সারসংক্ষেপ</th>
                  <th className="py-3 px-4 text-center">SMS পার্ট</th>
                  <th className="py-3 px-4">প্রেরণের সময়</th>
                  <th className="py-3 px-4 text-center">স্ট্যাটাস</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400 font-medium">
                      কোনো এসএমএস লগ পাওয়া যায়নি।
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-slate-700">{log.messageId}</td>
                      <td className="py-3 px-4 font-mono font-bold text-indigo-700">{log.recipientPhone}</td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{log.studentName}</div>
                        <div className="text-[10px] text-slate-400">{log.className} • {log.batchName}</div>
                      </td>
                      <td className="py-3 px-4 max-w-xs truncate text-slate-700" title={log.messageText}>
                        {log.messageText}
                      </td>
                      <td className="py-3 px-4 text-center font-mono font-bold text-slate-700">
                        {log.smsCount || 1}
                      </td>
                      <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                        {log.sentAt?.split('T')[0]} {log.sentAt?.split('T')[1]?.slice(0, 5)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black inline-flex items-center space-x-1 ${
                          log.status === 'DELIVERED'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}>
                          {log.status === 'DELIVERED' ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                          <span>{log.status}</span>
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: SAVED TEMPLATES */}
      {activeSubTab === 'templates' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                <span>{t('smsTemplatesTab')} ({templates.length} টি টেমপ্লেট)</span>
              </h3>
              <p className="text-xs text-slate-500">প্রয়োজনীয় বার্তা দ্রুত পাঠাতে টেমপ্লেট নির্বাচন বা কাস্টমাইজ করুন</p>
            </div>

            <button
              onClick={() => setShowNewTemplateModal(true)}
              className="px-4 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center space-x-1.5 shadow-md shadow-indigo-600/20"
            >
              <Plus className="w-4 h-4" />
              <span>নতুন টেমপ্লেট তৈরি করুন</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((tmpl) => (
              <div
                key={tmpl.id}
                className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {tmpl.category}
                    </span>
                    {tmpl.isDefault && (
                      <span className="text-[10px] font-bold text-slate-400">ডিফল্ট</span>
                    )}
                  </div>
                  <h4 className="text-sm font-black text-slate-900">{tmpl.title}</h4>
                  <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-2xl border border-slate-100 font-medium leading-relaxed whitespace-pre-wrap">
                    {tmpl.templateText}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-400">{tmpl.templateText.length} অক্ষর</span>
                  <button
                    onClick={() => {
                      handleSelectPresetTemplate(tmpl);
                      setActiveSubTab('compose');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center space-x-1"
                  >
                    <span>লোড করুন</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Create New Template */}
      {showNewTemplateModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
                <BookmarkPlus className="w-5 h-5 text-indigo-600" />
                <span>নতুন এসএমএস টেমপ্লেট তৈরি</span>
              </h3>
              <button
                onClick={() => setShowNewTemplateModal(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveNewTemplate} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">টেমপ্লেট শিরোনাম</label>
                <input
                  type="text"
                  value={newTemplateTitle}
                  onChange={(e) => setNewTemplateTitle(e.target.value)}
                  placeholder="যেমন: বিশেষ ওয়ার্কশপ নোটিশ"
                  required
                  className="w-full text-xs font-medium rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">ক্যাটাগরি</label>
                <select
                  value={newTemplateCategory}
                  onChange={(e) => setNewTemplateCategory(e.target.value)}
                  className="w-full text-xs font-bold rounded-xl border border-slate-300 p-2.5 bg-slate-50 focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="NOTICE">সাধারণ নোটিশ (Notice)</option>
                  <option value="DUE_ALERT">বকেয়া ফি (Due Alert)</option>
                  <option value="RESULT_ALERT">পরীক্ষার ফলাফল (Result)</option>
                  <option value="EMERGENCY">জরুরি বার্তা (Emergency)</option>
                  <option value="CUSTOM">কাস্টম বার্তা (Custom)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">টেমপ্লেট টেক্সট (ভ্যারিয়েবল সহ)</label>
                <textarea
                  value={newTemplateText}
                  onChange={(e) => setNewTemplateText(e.target.value)}
                  rows={4}
                  placeholder="যেমন: শ্রদ্ধেয় অভিভাবক, {প্রতিষ্ঠানের_নাম}-এ {শ্রেণি}-এর শিক্ষার্থী {শিক্ষার্থীর_নাম}..."
                  required
                  className="w-full text-xs font-medium rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-indigo-500 leading-relaxed"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowNewTemplateModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold text-xs"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20"
                >
                  সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
