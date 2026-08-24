import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { noticeAPI } from '../../services/api';
import UniversalFileUploader from '../common/UniversalFileUploader';
import PrintableNoticeSlipModal from '../common/PrintableNoticeSlipModal';
import {
  BellRing,
  Megaphone,
  Pin,
  Printer,
  Search,
  Filter,
  Plus,
  Edit2,
  Trash2,
  Calendar,
  Users,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  X,
  Save,
  Tag,
  Eye,
  RefreshCw,
  AlertTriangle,
  FileText
} from 'lucide-react';

export default function NoticeManager() {
  const { t, lang } = useLanguage();

  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter & Search
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedRole, setSelectedRole] = useState('');

  // Modals
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [editingNotice, setEditingNotice] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingNotice, setDeletingNotice] = useState(null);
  const [selectedNoticeForPrint, setSelectedNoticeForPrint] = useState(null);

  // Toast
  const [toast, setToast] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const initialFormState = {
    titleBn: '',
    titleEn: '',
    contentBn: '',
    contentEn: '',
    category: 'ACADEMIC',
    priority: 'NORMAL',
    targetRole: 'ALL',
    isPinned: false,
    attachmentUrl: '',
    attachmentName: '',
    attachmentSize: ''
  };
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchNotices();
  }, []);

  const showFeedback = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchNotices = async () => {
    setLoading(true);
    try {
      const res = await noticeAPI.getNotices();
      if (res.success && res.data) {
        setNotices(res.data);
      }
    } catch (err) {
      console.error('Fetch notices error:', err);
      showFeedback('নোটিশ লোড করতে সমস্যা হয়েছে', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filteredNotices = notices.filter((n) => {
    const matchSearch =
      !search ||
      n.titleBn?.toLowerCase().includes(search.toLowerCase()) ||
      n.titleEn?.toLowerCase().includes(search.toLowerCase()) ||
      n.contentBn?.toLowerCase().includes(search.toLowerCase());

    const matchCategory = !selectedCategory || n.category === selectedCategory;
    const matchRole = !selectedRole || n.targetRole === selectedRole;

    return matchSearch && matchCategory && matchRole;
  });

  const pinnedCount = notices.filter((n) => n.isPinned).length;
  const urgentCount = notices.filter((n) => n.priority === 'URGENT').length;
  const academicCount = notices.filter((n) => n.category === 'ACADEMIC').length;

  const handleOpenAdd = () => {
    setEditingNotice(null);
    setFormData(initialFormState);
    setShowAddEditModal(true);
  };

  const handleOpenEdit = (notice) => {
    setEditingNotice(notice);
    setFormData({
      titleBn: notice.titleBn || '',
      titleEn: notice.titleEn || '',
      contentBn: notice.contentBn || '',
      contentEn: notice.contentEn || '',
      category: notice.category || 'ACADEMIC',
      priority: notice.priority || 'NORMAL',
      targetRole: notice.targetRole || 'ALL',
      isPinned: !!notice.isPinned,
      attachmentUrl: notice.attachmentUrl || '',
      attachmentName: notice.attachmentName || '',
      attachmentSize: notice.attachmentSize || ''
    });
    setShowAddEditModal(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingNotice) {
        const res = await noticeAPI.updateNotice(editingNotice.id, formData);
        if (res.success) {
          showFeedback('নোটিশ সফলভাবে আপডেট করা হয়েছে!');
          setShowAddEditModal(false);
          fetchNotices();
        }
      } else {
        const res = await noticeAPI.createNotice(formData);
        if (res.success) {
          showFeedback('নতুন নোটিশ সফলভাবে প্রকাশ করা হয়েছে!');
          setShowAddEditModal(false);
          fetchNotices();
        }
      }
    } catch (err) {
      console.error('Submit notice error:', err);
      showFeedback(err.message || 'নোটিশ সংরক্ষণ ব্যর্থ হয়েছে', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleTogglePin = async (notice) => {
    try {
      const res = await noticeAPI.togglePin(notice.id, !notice.isPinned);
      if (res.success) {
        showFeedback(
          !notice.isPinned
            ? 'নোটিশটি সফলভাবে হোমপেজে পিন করা হয়েছে!'
            : 'নোটিশটি আনপিন করা হয়েছে!'
        );
        fetchNotices();
      }
    } catch (err) {
      console.error('Toggle pin error:', err);
      showFeedback(err.message || 'পিন স্ট্যাটাস পরিবর্তন ব্যর্থ হয়েছে', 'error');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingNotice) return;
    setSubmitting(true);
    try {
      const res = await noticeAPI.deleteNotice(deletingNotice.id);
      if (res.success) {
        showFeedback('নোটিশটি সফলভাবে মুছে ফেলা হয়েছে!');
        setShowDeleteModal(false);
        setDeletingNotice(null);
        fetchNotices();
      }
    } catch (err) {
      console.error('Delete notice error:', err);
      showFeedback(err.message || 'নোটিশ ডিলিট ব্যর্থ হয়েছে', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const getCategoryBadge = (cat) => {
    switch (cat) {
      case 'ACADEMIC':
        return { label: 'একাডেমিক', color: 'bg-blue-50 text-blue-700 border-blue-200' };
      case 'EXAM':
        return { label: 'পরীক্ষার নোটিশ', color: 'bg-purple-50 text-purple-700 border-purple-200' };
      case 'ROUTINE':
        return { label: 'পরীক্ষার রুটিন', color: 'bg-amber-50 text-amber-700 border-amber-200' };
      case 'ADMISSION':
        return { label: 'ভর্তি বিজ্ঞপ্তি', color: 'bg-teal-50 text-teal-700 border-teal-200' };
      case 'HOLIDAY':
        return { label: 'ছুটি ও উৎসব', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'EMERGENCY':
        return { label: 'জরুরি নোটিশ', color: 'bg-rose-50 text-rose-700 border-rose-200' };
      default:
        return { label: 'সাধারণ', color: 'bg-slate-100 text-slate-700 border-slate-200' };
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Toast */}
      {toast && (
        <div
          className={`p-4 rounded-2xl border text-xs font-bold flex items-center space-x-2.5 shadow-lg ${
            toast.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
          )}
          <span>{toast.msg}</span>
        </div>
      )}

      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-slate-700/60">
        <div className="absolute right-0 top-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold">
              <Megaphone className="w-3.5 h-3.5" />
              <span>{lang === 'bn' ? 'ডিজিটাল নোটিশ ও ব্রডকাস্ট হাব' : 'Notice Broadcast Hub'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white">
              {lang === 'bn' ? 'নোটিশ ও জরুরি ঘোষণা পরিচালনা' : 'Notice & Routine Management'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl font-medium">
              একাডেমিক সূচি, পরীক্ষার তারিখ, ছুটি ও জরুরি নোটিশ প্রকাশ করুন এবং হোমপেজে পিন করে রাখুন
            </p>
          </div>

          <button
            onClick={handleOpenAdd}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-black text-xs shadow-lg shadow-indigo-600/30 flex items-center space-x-2 transition-all transform active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>+ নতুন নোটিশ প্রকাশ</span>
          </button>
        </div>
      </div>

      {/* KPI Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center space-x-3.5">
          <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600">
            <BellRing className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-500">মোট নোটিশ</div>
            <div className="text-xl font-black text-slate-900">{notices.length} টি</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center space-x-3.5">
          <div className="p-3 rounded-xl bg-amber-50 text-amber-600">
            <Pin className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-500">হোমপেজে পিনকৃত</div>
            <div className="text-xl font-black text-amber-600">{pinnedCount} টি</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center space-x-3.5">
          <div className="p-3 rounded-xl bg-rose-50 text-rose-600">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-500">জরুরি নোটিশ</div>
            <div className="text-xl font-black text-rose-600">{urgentCount} টি</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center space-x-3.5">
          <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-500">একাডেমিক নোটিশ</div>
            <div className="text-xl font-black text-blue-600">{academicCount} টি</div>
          </div>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3.5 items-center">
          <div className="lg:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="নোটিশের শিরোনাম বা বিবরণ দিয়ে খুঁজুন..."
              className="w-full pl-9 pr-4 py-2.5 text-xs font-medium rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>

          <div className="lg:col-span-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full py-2.5 px-3 text-xs font-bold rounded-2xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">সকল ক্যাটাগরি (All Categories)</option>
              <option value="ACADEMIC">একাডেমিক (Academic)</option>
              <option value="EXAM">পরীক্ষা (Exam)</option>
              <option value="HOLIDAY">ছুটি (Holiday)</option>
              <option value="EMERGENCY">জরুরি (Emergency)</option>
              <option value="GENERAL">সাধারণ (General)</option>
            </select>
          </div>

          <div className="lg:col-span-3">
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full py-2.5 px-3 text-xs font-bold rounded-2xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">সকল প্রাপক (All Audience)</option>
              <option value="ALL">সকলের জন্য (Public / All)</option>
              <option value="STUDENT">শিক্ষার্থী (Students)</option>
              <option value="PARENT">অভিভাবক (Parents)</option>
              <option value="TEACHER">শিক্ষক (Teachers)</option>
            </select>
          </div>
        </div>

        <div className="text-xs font-medium text-slate-500 pt-2 border-t border-slate-100 flex items-center justify-between">
          <div>
            মোট প্রকাশিত নোটিশ: <span className="font-bold text-slate-900">{filteredNotices.length}</span> টি
          </div>
        </div>
      </div>

      {/* Notices List */}
      {loading ? (
        <div className="p-12 text-center text-slate-500 space-y-3 bg-white rounded-3xl border border-slate-200">
          <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
          <p className="text-xs font-bold">নোটিশ তালিকা লোড হচ্ছে...</p>
        </div>
      ) : filteredNotices.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
          <BellRing className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-700">কোনো নোটিশ পাওয়া যায়নি</h3>
          <p className="text-xs text-slate-400">নতুন নোটিশ প্রকাশ করতে উপরের বাটনে ক্লিক করুন</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredNotices.map((n) => {
            const catBadge = getCategoryBadge(n.category);
            const isUrgent = n.priority === 'URGENT';
            const isHigh = n.priority === 'HIGH';

            return (
              <div
                key={n.id}
                className={`bg-white rounded-3xl border p-5 sm:p-6 shadow-sm transition-all relative overflow-hidden ${
                  n.isPinned
                    ? 'border-amber-400/80 bg-gradient-to-r from-amber-50/30 via-white to-white ring-1 ring-amber-400/30'
                    : 'border-slate-200 hover:shadow-md'
                }`}
              >
                {/* Pinned Ribbon */}
                {n.isPinned && (
                  <div className="absolute top-0 right-0">
                    <div className="bg-gradient-to-l from-amber-500 to-amber-600 text-white text-[10px] font-black px-4 py-1 rounded-bl-2xl shadow-sm flex items-center space-x-1">
                      <Pin className="w-3 h-3 fill-current" />
                      <span>হোমপেজে পিনকৃত</span>
                    </div>
                  </div>
                )}

                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="space-y-2.5 flex-1 pr-6">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border ${catBadge.color}`}>
                        {catBadge.label}
                      </span>

                      {isUrgent && (
                        <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-300 text-[10px] font-black animate-pulse">
                          জরুরি (Urgent)
                        </span>
                      )}
                      {isHigh && (
                        <span className="px-2.5 py-0.5 rounded-full bg-orange-50 text-orange-700 border border-orange-200 text-[10px] font-black">
                          উচ্চ অগ্রাধিকার (High)
                        </span>
                      )}

                      <span className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-600 text-[10px] font-bold">
                        প্রাপক: {n.targetRole === 'ALL' ? 'সকল' : n.targetRole}
                      </span>

                      <span className="text-[11px] text-slate-400 flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>
                          {n.publishedAt ? new Date(n.publishedAt).toLocaleDateString('bn-BD') : 'আজ'}
                        </span>
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
                      {n.titleBn || n.titleEn}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium whitespace-pre-line">
                      {n.contentBn || n.contentEn}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex sm:flex-col items-center justify-end gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 flex-shrink-0">
                    <button
                      onClick={() => handleTogglePin(n)}
                      className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center space-x-1.5 transition-all ${
                        n.isPinned
                          ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                      title={n.isPinned ? 'আনপিন করুন' : 'হোমপেজে পিন করুন'}
                    >
                      <Pin className={`w-3.5 h-3.5 ${n.isPinned ? 'fill-current' : ''}`} />
                      <span>{n.isPinned ? 'আনপিন' : 'পিন করুন'}</span>
                    </button>

                    <div className="flex items-center space-x-1.5">
                      <button
                        onClick={() => setSelectedNoticeForPrint(n)}
                        className="p-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 flex items-center space-x-1 font-bold text-xs"
                        title="পিডিএফ ডাউনলোড / প্রিন্ট"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">স্লিপ</span>
                      </button>
                      <button
                        onClick={() => handleOpenEdit(n)}
                        className="p-2 rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                        title="এডিট"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          setDeletingNotice(n);
                          setShowDeleteModal(true);
                        }}
                        className="p-2 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100"
                        title="ডিলিট"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal: Add/Edit Notice */}
      {showAddEditModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
                <Megaphone className="w-5 h-5 text-indigo-600" />
                <span>{editingNotice ? 'নোটিশ তথ্য সম্পাদন (Edit Notice)' : 'নতুন নোটিশ প্রকাশ (Publish Notice)'}</span>
              </h3>
              <button
                onClick={() => setShowAddEditModal(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1">নোটিশের শিরোনাম (বাংলা) *</label>
                <input
                  type="text"
                  value={formData.titleBn}
                  onChange={(e) => setFormData({ ...formData, titleBn: e.target.value })}
                  placeholder="যেমন: ২০২৬ সালের ১ম সাময়িক পরীক্ষার রুটিন প্রকাশ"
                  required
                  className="w-full bg-white border border-slate-300 text-slate-900 font-semibold placeholder:text-slate-400 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1">Notice Title (English)</label>
                <input
                  type="text"
                  value={formData.titleEn}
                  onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                  placeholder="e.g. 1st Term Examination Routine Published"
                  className="w-full bg-white border border-slate-300 text-slate-900 font-semibold placeholder:text-slate-400 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm text-xs"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-1">ক্যাটাগরি *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-white border border-slate-300 text-slate-900 font-semibold placeholder:text-slate-400 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm text-xs"
                  >
                    <option value="ACADEMIC">একাডেমিক</option>
                    <option value="EXAM">পরীক্ষার নোটিশ</option>
                    <option value="ROUTINE">পরীক্ষার রুটিন (PDF)</option>
                    <option value="ADMISSION">ভর্তি সংক্রান্ত</option>
                    <option value="HOLIDAY">ছুটি ও উৎসব</option>
                    <option value="EMERGENCY">জরুরি নোটিশ</option>
                    <option value="GENERAL">সাধারণ</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-1">অগ্রাধিকার (Priority)</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full bg-white border border-slate-300 text-slate-900 font-semibold placeholder:text-slate-400 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm text-xs"
                  >
                    <option value="NORMAL">সাধারণ (Normal)</option>
                    <option value="HIGH">উচ্চ (High)</option>
                    <option value="URGENT">জরুরি (Urgent)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-1">প্রাপক (Audience)</label>
                  <select
                    value={formData.targetRole}
                    onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
                    className="w-full bg-white border border-slate-300 text-slate-900 font-semibold placeholder:text-slate-400 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm text-xs"
                  >
                    <option value="ALL">সকলের জন্য</option>
                    <option value="STUDENT">শিক্ষার্থী</option>
                    <option value="PARENT">অভিভাবক</option>
                    <option value="TEACHER">শিক্ষক</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1">নোটিশের বিস্তারিত বিবরণ (বাংলা) *</label>
                <textarea
                  rows={4}
                  value={formData.contentBn}
                  onChange={(e) => setFormData({ ...formData, contentBn: e.target.value })}
                  placeholder="নোটিশের সম্পূর্ণ বিবরণ এখানে লিখুন..."
                  required
                  className="w-full text-xs font-medium rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-indigo-500 leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1">Notice Content (English)</label>
                <textarea
                  rows={2}
                  value={formData.contentEn}
                  onChange={(e) => setFormData({ ...formData, contentEn: e.target.value })}
                  placeholder="Notice description in English..."
                  className="w-full text-xs font-medium rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-indigo-500 leading-relaxed"
                />
              </div>

              {/* Notice PDF / Circular Attachment */}
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
                <UniversalFileUploader
                  label="সংযুক্ত নোটিশ / সার্কুলার ফাইল (Notice PDF / Circular File)"
                  value={formData.attachmentUrl}
                  fileName={formData.attachmentName}
                  fileSize={formData.attachmentSize}
                  accept="*/*"
                  maxMb={100}
                  helperText="অফিসিয়াল নোটিশ বা সার্কুলারের স্ক্যান কপি / পিডিএফ বা গুগল ড্রাইভ লিংক"
                  onChange={({ fileUrl, url, fileName, fileSize }) => {
                    setFormData(prev => ({
                      ...prev,
                      attachmentUrl: fileUrl || url || '',
                      attachmentName: fileName || '',
                      attachmentSize: fileSize || ''
                    }));
                  }}
                />
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isPinned}
                    onChange={(e) => setFormData({ ...formData, isPinned: e.target.checked })}
                    className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
                  />
                  <span className="text-xs font-bold text-slate-700">হোমপেজের শীর্ষে পিন করে রাখুন 📌</span>
                </label>

                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowAddEditModal(false)}
                    className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold text-xs"
                  >
                    বাতিল
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md disabled:opacity-50"
                  >
                    {submitting ? 'প্রকাশ হচ্ছে...' : editingNotice ? 'আপডেট করুন' : 'প্রকাশ করুন'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Delete Notice Confirmation */}
      {showDeleteModal && deletingNotice && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center space-x-3 text-rose-600">
              <div className="p-2.5 rounded-2xl bg-rose-50 border border-rose-200">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-slate-900">নোটিশ ডিলিট নিশ্চিতকরণ</h3>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              আপনি কি নিশ্চিতভাবে <span className="font-bold text-slate-900">'{deletingNotice.titleBn}'</span> নোটিশটি মুছে ফেলতে চান?
            </p>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold text-xs"
              >
                বাতিল
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={submitting}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md disabled:opacity-50"
              >
                {submitting ? 'মুছে ফেলা হচ্ছে...' : 'হ্যাঁ, মুছে ফেলুন'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Printable Official Notice Slip Modal */}
      {selectedNoticeForPrint && (
        <PrintableNoticeSlipModal
          notice={selectedNoticeForPrint}
          isOpen={!!selectedNoticeForPrint}
          onClose={() => setSelectedNoticeForPrint(null)}
        />
      )}
    </div>
  );
}
