import React, { useState, useEffect } from 'react';
import {
  MessageSquarePlus,
  Send,
  Shield,
  EyeOff,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  BookOpen,
  Building,
  Laptop,
  CreditCard,
  Sparkles,
  Search,
  Filter,
  Check,
  ChevronRight,
  Info,
  Layers,
  Phone,
  User,
  X
} from 'lucide-react';
import { helpdeskAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

const CATEGORIES = [
  { id: 'ACADEMIC', nameBn: 'একাডেমিক ও পাঠদান', icon: BookOpen, desc: 'ক্লাস, শিক্ষক, হ্যান্ডনোট, সিলেবাস ও পরীক্ষা সংক্রান্ত' },
  { id: 'MANAGEMENT', nameBn: 'ম্যানেজমেন্ট ও প্রশাসন', icon: Building, desc: 'ক্লাসরুম পরিবেশ, শৃঙ্খলা ও প্রশাসনিক নিয়মাবলী' },
  { id: 'TECHNICAL', nameBn: 'টেকনিক্যাল সমস্যা', icon: Laptop, desc: 'অ্যাপ লগইন, লাইভ ক্লাস বা ভিডিও রেকর্ডিং সমস্যা' },
  { id: 'FEES', nameBn: 'ফি ও পেমেন্ট', icon: CreditCard, desc: 'মাসিক ফি, বকেয়া, রশিদ ও অনলাইন পেমেন্ট' },
  { id: 'OTHER', nameBn: 'অন্যান্য পরামর্শ', icon: Sparkles, desc: 'একাডেমির সার্বিক উন্নতির জন্য যেকোনো মতামত' },
];

export default function FeedbackHelpdeskModule() {
  const { user } = useAuth();
  const { lang } = useLanguage();

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('NEW'); // 'NEW' or 'MY_TICKETS'
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  // Form State
  const [category, setCategory] = useState('ACADEMIC');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [priority, setPriority] = useState('NORMAL');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [contactPhone, setContactPhone] = useState(user?.phone || '');

  const fetchMyTickets = async () => {
    try {
      setLoading(true);
      const res = await helpdeskAPI.getMyTickets();
      if (res?.success) {
        setTickets(res.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch tickets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyTickets();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) {
      setErrorMessage('অনুগ্রহ করে বিষয় ও বিস্তারিত বার্তা লিখুন।');
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await helpdeskAPI.createTicket({
        category,
        subject: subject.trim(),
        message: message.trim(),
        priority,
        isAnonymous,
        contactPhone: contactPhone.trim() || null
      });

      if (res?.success) {
        setSuccessMessage('আপনার মতামত/অভিযোগটি সফলভাবে জমা হয়েছে। দ্রুত ব্যবস্থা নেওয়া হবে।');
        setSubject('');
        setMessage('');
        setIsAnonymous(false);
        fetchMyTickets();
        setActiveTab('MY_TICKETS');
      } else {
        setErrorMessage(res?.error?.message || 'জমা দিতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
      }
    } catch (err) {
      setErrorMessage('নেটওয়ার্ক সমস্যা: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'RESOLVED':
        return (
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> সমাধান হয়েছে
          </span>
        );
      case 'IN_PROGRESS':
        return (
          <span className="px-2.5 py-1 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/30 text-xs font-bold flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 animate-pulse" /> কাজ চলছে
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-bold flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" /> অপেক্ষমাণ
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950/70 border border-slate-800 p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-600 flex items-center justify-center text-white shadow-lg shadow-rose-500/20">
              <MessageSquarePlus className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white">
                  মতামত ও অভিযোগ বক্স (Helpdesk)
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 text-[11px] font-extrabold">
                  সরাসরি প্রশাসন
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                আপনার যেকোনো প্রশ্ন, সমস্যা, পরামর্শ বা মতামত সরাসরি একাডেমি কর্তৃপক্ষকে জানান
              </p>
            </div>
          </div>

          {/* Navigation Pills */}
          <div className="flex items-center gap-2 bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800">
            <button
              onClick={() => setActiveTab('NEW')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'NEW'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              নতুন বার্তা পাঠান
            </button>
            <button
              onClick={() => setActiveTab('MY_TICKETS')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'MY_TICKETS'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              আমার অভিযোগসমূহ
              <span className="px-1.5 py-0.2 rounded-full bg-slate-800 text-[10px] text-slate-300">
                {tickets.length}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Success Notification */}
      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-800 flex items-center justify-between text-emerald-300 text-xs sm:text-sm font-bold shadow-lg">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
          <button onClick={() => setSuccessMessage(null)} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Error Notification */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-800 flex items-center justify-between text-rose-300 text-xs sm:text-sm font-bold shadow-lg">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button onClick={() => setErrorMessage(null)} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ========================================================= */}
      {/* 1. SUBMIT TICKET FORM */}
      {/* ========================================================= */}
      {activeTab === 'NEW' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleSubmit} className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-6 shadow-xl">
              <h2 className="text-base font-black text-white flex items-center gap-2 border-b border-slate-800 pb-4">
                <MessageSquarePlus className="w-5 h-5 text-amber-400" /> অভিযোগ বা মতামত ফর্ম
              </h2>

              {/* Category Selector */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-300">
                  বিভাগ নির্বাচন করুন <span className="text-rose-400">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {CATEGORIES.map((cat) => {
                    const IconComp = cat.icon;
                    const isSelected = category === cat.id;
                    return (
                      <div
                        key={cat.id}
                        onClick={() => setCategory(cat.id)}
                        className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                          isSelected
                            ? 'bg-amber-500/10 border-amber-500 text-white shadow-md'
                            : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                        }`}
                      >
                        <div className={`p-2 rounded-xl ${isSelected ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300'}`}>
                          <IconComp className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-extrabold text-white">{cat.nameBn}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">{cat.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Subject */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300">
                  সংক্ষিপ্ত বিষয় / শিরোনাম <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="যেমন: পদার্থবিজ্ঞান ৩য় অধ্যায়ের লেকচার শিট সংক্রান্ত..."
                  className="w-full bg-slate-950 text-white placeholder:text-slate-600 rounded-2xl px-4 py-3 text-xs sm:text-sm border border-slate-800 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all"
                />
              </div>

              {/* Priority */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300">
                  জরুরিতার মাত্রা (Priority)
                </label>
                <div className="flex items-center gap-3">
                  {[
                    { id: 'NORMAL', label: 'সাধারণ (Normal)', color: 'border-slate-700' },
                    { id: 'URGENT', label: 'জরুরি (Urgent)', color: 'border-amber-500/50' },
                    { id: 'HIGH', label: 'অতি জরুরি (High)', color: 'border-rose-500/50' }
                  ].map((p) => (
                    <label
                      key={p.id}
                      className={`px-3 py-2 rounded-xl text-xs font-bold border cursor-pointer transition-all flex items-center gap-1.5 ${
                        priority === p.id
                          ? 'bg-slate-800 text-white border-amber-400 font-extrabold'
                          : 'bg-slate-950 text-slate-400 border-slate-800'
                      }`}
                    >
                      <input
                        type="radio"
                        name="priority"
                        value={p.id}
                        checked={priority === p.id}
                        onChange={() => setPriority(p.id)}
                        className="hidden"
                      />
                      <span>{p.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Detailed Message */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300">
                  বিস্তারিত বার্তা / অভিযোগ <span className="text-rose-400">*</span>
                </label>
                <textarea
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="আপনার সমস্যা, পর্যবেক্ষণ বা পরামর্শ বিস্তারিত লিখুন যাতে কর্তৃপক্ষ সহজে অনুধাবন করতে পারেন..."
                  className="w-full bg-slate-950 text-white placeholder:text-slate-600 rounded-2xl p-4 text-xs sm:text-sm border border-slate-800 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all resize-none leading-relaxed"
                />
              </div>

              {/* ANONYMOUS TOGGLE */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/30 to-purple-950/30 border border-indigo-900/50 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isAnonymous ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
                    <EyeOff className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-white flex items-center gap-1.5">
                      নাম গোপন রাখুন (Submit Anonymously)
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      টিকিটটি জমা দিলে কর্তৃপক্ষ আপনার নাম বা রোল নম্বর দেখতে পারবেন না
                    </p>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                {submitting ? 'জমা হচ্ছে...' : 'বার্তাটি নিরাপদে জমা দিন'}
              </button>
            </form>
          </div>

          {/* Side Info Cards */}
          <div className="space-y-5">
            {/* Safety & Privacy Promise */}
            <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 space-y-4 shadow-xl">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-black text-white">গোপনীয়তার নিশ্চয়তা</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  NextGen Academy শিক্ষার্থীদের সুপরামর্শ ও অভিযোগকে সর্বোচ্চ গুরুত্ব দেয়। নাম গোপন রাখার বিকল্পটি সম্পূর্ণ এনক্রিপ্টেড।
                </p>
              </div>
              <div className="space-y-2 pt-2 border-t border-slate-800 text-[11px] text-slate-300">
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span>২৪ ঘণ্টার মধ্যে কর্তৃপক্ষের পর্যালোচনা</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span>সমাধান হলে সরাসরি অ্যাপে রিপ্লাই নোট</span>
                </div>
              </div>
            </div>

            {/* Direct Helpline */}
            <div className="rounded-3xl bg-gradient-to-br from-indigo-950/60 to-slate-900 border border-indigo-800/40 p-6 space-y-3 shadow-xl">
              <span className="text-xs font-bold text-amber-400">জরুরি হেল্পলাইন</span>
              <h3 className="text-base font-black text-white">সরাসরি যোগাযোগের ঠিকানা</h3>
              <p className="text-xs text-slate-400 font-mono">
                📞 ০১৭৯২৮১৮০০৫ (মো: আলমগীর হোসেন সাগর)
              </p>
              <p className="text-[11px] text-slate-400">
                📍 পশ্চিম জয়দেবপুর, বাস-স্ট্যান্ড, গাজীপুর
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. MY SUBMITTED TICKETS HISTORY */}
      {/* ========================================================= */}
      {activeTab === 'MY_TICKETS' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-black text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" /> আমার প্রেরিত বার্তা ও অভিযোগসমূহ ({tickets.length})
            </h2>
            <button
              onClick={fetchMyTickets}
              className="text-xs text-amber-400 hover:underline font-bold"
            >
              রিফ্রেশ করুন
            </button>
          </div>

          {loading ? (
            <div className="p-12 text-center rounded-3xl bg-slate-900/60 border border-slate-800">
              <p className="text-xs text-slate-400 animate-pulse">টিকিট তালিকা লোড হচ্ছে...</p>
            </div>
          ) : tickets.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3">
              <MessageSquarePlus className="w-10 h-10 text-slate-600 mx-auto" />
              <h3 className="text-sm font-bold text-slate-300">কোনো পূর্ববর্তী অভিযোগ বা মতামত নেই</h3>
              <p className="text-xs text-slate-500">আপনার কোনো সমস্যা বা পরামর্শ থাকলে নতুন বার্তা পাঠাতে পারেন।</p>
              <button
                onClick={() => setActiveTab('NEW')}
                className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 text-xs font-black"
              >
                নতুন বার্তা লিখুন
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {tickets.map((t) => {
                const catMeta = CATEGORIES.find((c) => c.id === t.category);
                return (
                  <div
                    key={t.id}
                    className="rounded-3xl bg-slate-900 border border-slate-800 p-6 space-y-4 shadow-xl hover:border-slate-700 transition-all"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-800/80 pb-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-mono text-[10px] font-bold">
                            {t.ticketNumber}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 text-[10px] font-black">
                            {catMeta?.nameBn || t.category}
                          </span>
                          {t.isAnonymous && (
                            <span className="px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/30 text-[10px] font-bold flex items-center gap-1">
                              <EyeOff className="w-3 h-3" /> নাম গোপন
                            </span>
                          )}
                        </div>
                        <h3 className="text-base font-extrabold text-white mt-1">{t.subject}</h3>
                      </div>

                      <div className="flex items-center gap-3">
                        {getStatusBadge(t.status)}
                        <span className="text-[11px] text-slate-500">
                          {new Date(t.createdAt).toLocaleDateString('bn-BD', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>

                    <div className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-2xl border border-slate-800/60 whitespace-pre-wrap">
                      {t.message}
                    </div>

                    {/* Admin Response Note */}
                    {t.adminResponse && (
                      <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-800/60 space-y-1.5 text-xs text-emerald-300">
                        <div className="flex items-center gap-1.5 font-bold text-emerald-400">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>কর্তৃপক্ষের উত্তর ও সমাধান নোট:</span>
                        </div>
                        <p className="leading-relaxed pl-5 whitespace-pre-wrap text-emerald-200">
                          {t.adminResponse}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
