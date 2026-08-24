import React, { useState, useEffect } from 'react';
import { syllabusTrackingAPI } from '../../services/api';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Plus,
  Trash2,
  Search,
  Filter,
  RefreshCw,
  Sparkles,
  Layers,
  GraduationCap,
  TrendingUp,
  Check,
  X,
  AlertCircle
} from 'lucide-react';

export default function SyllabusTrackerManager() {
  const [classesList] = useState([
    'Class 9',
    'Class 10',
    'SSC 2026',
    'Class 8',
    'Class 7',
    'Class 6',
    'Class 11',
    'Class 12',
    'HSC 2026'
  ]);

  const [selectedClass, setSelectedClass] = useState('Class 9');
  const [selectedSubject, setSelectedSubject] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [data, setData] = useState({
    overallPercentage: 0,
    totalChapters: 0,
    completedChapters: 0,
    subjects: [],
    rawRecords: []
  });
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState(null);
  const [feedback, setFeedback] = useState(null);

  // Add Chapter Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newChapterForm, setNewChapterForm] = useState({
    subject: '',
    chapter_no: '',
    chapter_name: '',
    is_completed: false
  });
  const [savingChapter, setSavingChapter] = useState(false);

  useEffect(() => {
    fetchSyllabus();
  }, [selectedClass]);

  const showToast = (msg, type = 'success') => {
    setFeedback({ msg, type });
    setTimeout(() => setFeedback(null), 3500);
  };

  const fetchSyllabus = async () => {
    setLoading(true);
    try {
      const res = await syllabusTrackingAPI.getSyllabus({ batch_or_class: selectedClass });
      if (res.success && res.data) {
        setData(res.data);
        if (res.data.subjects.length > 0 && selectedSubject === 'ALL') {
          // Keep ALL as default or default to first subject
        }
      }
    } catch (err) {
      console.error('Failed to fetch syllabus data:', err);
      showToast(err.message || 'সিলেবাস ডাটা লোড করতে সমস্যা হয়েছে', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (chapterId, currentStatus) => {
    const nextStatus = !currentStatus;
    setTogglingId(chapterId);

    // Optimistic UI update
    setData((prev) => {
      const updatedRaw = prev.rawRecords.map((item) =>
        item.id === chapterId ? { ...item, is_completed: nextStatus } : item
      );

      const updatedSubjects = prev.subjects.map((sub) => {
        const subChapters = sub.chapters.map((ch) =>
          ch.id === chapterId ? { ...ch, is_completed: nextStatus } : ch
        );
        const comp = subChapters.filter((c) => c.is_completed).length;
        const tot = subChapters.length;
        return {
          ...sub,
          chapters: subChapters,
          completedChapters: comp,
          percentage: tot > 0 ? Math.round((comp / tot) * 100) : 0
        };
      });

      const totalComp = updatedRaw.filter((r) => r.is_completed).length;
      return {
        ...prev,
        rawRecords: updatedRaw,
        subjects: updatedSubjects,
        completedChapters: totalComp,
        overallPercentage: prev.totalChapters > 0 ? Math.round((totalComp / prev.totalChapters) * 100) : 0
      };
    });

    try {
      const res = await syllabusTrackingAPI.toggleChapter(chapterId, nextStatus);
      if (res.success) {
        showToast(
          nextStatus ? 'অধ্যায়টি সফলভাবে সম্পন্ন হিসেবে মার্ক হয়েছে' : 'অধ্যায়টি চলমান তালিকায় রাখা হয়েছে'
        );
      }
    } catch (err) {
      console.error('Failed to toggle chapter status:', err);
      showToast('স্ট্যাটাস আপডেট ব্যর্থ হয়েছে, পূর্বের অবস্থায় ফিরে যাওয়া হচ্ছে', 'error');
      fetchSyllabus(); // Revert on failure
    } finally {
      setTogglingId(null);
    }
  };

  const handleAddChapterSubmit = async (e) => {
    e.preventDefault();
    if (!newChapterForm.subject || !newChapterForm.chapter_name) {
      showToast('বিষয় ও অধ্যায়ের নাম সঠিকভাবে পূরণ করুন', 'error');
      return;
    }

    setSavingChapter(true);
    try {
      const res = await syllabusTrackingAPI.addChapter({
        batch_or_class: selectedClass,
        subject: newChapterForm.subject,
        chapter_no: Number(newChapterForm.chapter_no) || 1,
        chapter_name: newChapterForm.chapter_name,
        is_completed: newChapterForm.is_completed
      });

      if (res.success) {
        showToast('নতুন অধ্যায় সফলভাবে সিলেবাসে যুক্ত হয়েছে!');
        setShowAddModal(false);
        setNewChapterForm({ subject: '', chapter_no: '', chapter_name: '', is_completed: false });
        fetchSyllabus();
      }
    } catch (err) {
      console.error('Add chapter failed:', err);
      showToast(err.message || 'অধ্যায় যুক্ত করতে ব্যর্থ হয়েছে', 'error');
    } finally {
      setSavingChapter(false);
    }
  };

  const handleDeleteChapter = async (chapterId) => {
    if (!window.confirm('আপনি কি এই অধ্যায়টি সিলেবাস থেকে মুছে ফেলতে চান?')) return;

    try {
      const res = await syllabusTrackingAPI.deleteChapter(chapterId);
      if (res.success) {
        showToast('অধ্যায়টি সফলভাবে মুছে ফেলা হয়েছে');
        fetchSyllabus();
      }
    } catch (err) {
      console.error('Delete chapter failed:', err);
      showToast(err.message || 'অধ্যায় মুছতে সমস্যা হয়েছে', 'error');
    }
  };

  // Filtered Subject List & Chapters
  const activeSubjectData =
    selectedSubject === 'ALL'
      ? null
      : data.subjects.find((s) => s.subject === selectedSubject);

  const displayedChapters = (
    selectedSubject === 'ALL'
      ? data.rawRecords
      : activeSubjectData?.chapters || []
  ).filter((ch) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      ch.chapter_name?.toLowerCase().includes(q) ||
      ch.subject?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 font-sans">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-teal-950 p-6 rounded-3xl border border-emerald-500/30 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center space-x-4 relative z-10">
          <div className="p-3.5 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-inner">
            <BookOpen className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl sm:text-2xl font-black text-white">
                ডায়নামিক সিলেবাস প্রগ্রেস ট্র্যাকার
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold">
                NCTB & Custom
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              শ্রেণি ও বিষয়ভিত্তিক সিলেবাস অধ্যায় ট্র্যাকিং এবং রিয়েল-টাইম প্রগ্রেস ম্যানেজমেন্ট
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 relative z-10">
          <button
            type="button"
            onClick={fetchSyllabus}
            disabled={loading}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            title="রিফ্রেশ করুন"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            type="button"
            onClick={() => {
              setNewChapterForm({
                subject: selectedSubject !== 'ALL' ? selectedSubject : data.subjects[0]?.subject || 'সাধারণ গণিত',
                chapter_no: '',
                chapter_name: '',
                is_completed: false
              });
              setShowAddModal(true);
            }}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 flex items-center space-x-2 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>নতুন অধ্যায় যোগ করুন</span>
          </button>
        </div>
      </div>

      {/* Toast Feedback */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl border text-xs font-bold flex items-center space-x-2.5 animate-in slide-in-from-top-2 ${
            feedback.type === 'success'
              ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
              : 'bg-rose-950/60 border-rose-500/40 text-rose-300'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          )}
          <span>{feedback.msg}</span>
        </div>
      )}

      {/* KPI Stats Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-500 font-bold block uppercase">সর্বমোট অধ্যায়</span>
            <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">
              {data.totalChapters}টি
            </span>
          </div>
          <Layers className="w-7 h-7 text-indigo-500" />
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] text-emerald-600 font-bold block uppercase">সম্পন্ন অধ্যায়</span>
            <span className="text-2xl font-black text-emerald-600 font-mono">
              {data.completedChapters}টি
            </span>
          </div>
          <CheckCircle2 className="w-7 h-7 text-emerald-500" />
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] text-amber-500 font-bold block uppercase">চলমান / বাকি</span>
            <span className="text-2xl font-black text-amber-600 font-mono">
              {data.totalChapters - data.completedChapters}টি
            </span>
          </div>
          <Clock className="w-7 h-7 text-amber-500" />
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] text-teal-600 font-bold block uppercase">মোট অগ্রগতি (Overall)</span>
            <span className="text-2xl font-black text-teal-600 font-mono">
              {data.overallPercentage}%
            </span>
          </div>
          <TrendingUp className="w-7 h-7 text-teal-500" />
        </div>
      </div>

      {/* Class / Batch Selector & Filter Strip */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          {/* Class / Batch Buttons */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 max-w-full">
            <span className="text-xs font-bold text-slate-500 whitespace-nowrap mr-1">
              শ্রেণি / ব্যাচ:
            </span>
            {classesList.map((cls) => (
              <button
                key={cls}
                type="button"
                onClick={() => setSelectedClass(cls)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedClass === cls
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {cls}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-64 shrink-0">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="অধ্যায় বা বিষয় খুঁজুন..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Subject Pill Filters */}
        <div className="flex items-center space-x-2 overflow-x-auto pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={() => setSelectedSubject('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedSubject === 'ALL'
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                : 'bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
            }`}
          >
            সকল বিষয় ({data.rawRecords.length})
          </button>

          {data.subjects.map((sub) => {
            const isSelected = selectedSubject === sub.subject;
            return (
              <button
                key={sub.subject}
                type="button"
                onClick={() => setSelectedSubject(sub.subject)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap flex items-center space-x-1.5 transition-all ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                }`}
              >
                <span>{sub.subject}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {sub.percentage}%
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Subject Progress Highlight (If a specific subject is picked) */}
      {activeSubjectData && (
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                {activeSubjectData.subject}
              </h3>
              <p className="text-xs text-slate-500">
                মোট অধ্যায়: {activeSubjectData.totalChapters}টি • সম্পন্ন: {activeSubjectData.completedChapters}টি
              </p>
            </div>
            <span className="text-xl font-black text-emerald-600 font-mono">
              {activeSubjectData.percentage}% সম্পন্ন
            </span>
          </div>

          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-400 to-teal-500 h-3 rounded-full transition-all duration-1000"
              style={{ width: `${activeSubjectData.percentage}%` }}
            />
          </div>
        </div>
      )}

      {/* Chapters Checklist Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="font-bold text-slate-800 dark:text-white text-sm flex items-center space-x-2">
            <span>📑 অধ্যায়সমূহ ও সম্পন্নতা স্ট্যাটাস (Chapters Checklist)</span>
            <span className="text-xs text-slate-400 font-normal">
              ({displayedChapters.length}টি অধ্যায় প্রদর্শিত)
            </span>
          </h3>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
            টগল সুইচে ক্লিক করে রিয়েল-টাইমে স্ট্যাটাস পরিবর্তন করুন
          </span>
        </div>

        {loading ? (
          <div className="py-16 text-center text-slate-400 space-y-3">
            <RefreshCw className="w-7 h-7 animate-spin mx-auto text-emerald-500" />
            <p className="text-xs font-medium">সিলেবাস তথ্য লোড হচ্ছে...</p>
          </div>
        ) : displayedChapters.length === 0 ? (
          <div className="py-16 text-center space-y-2">
            <p className="text-xs text-slate-400">কোনো অধ্যায় পাওয়া যায়নি।</p>
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold inline-flex items-center space-x-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>প্রথম অধ্যায় যুক্ত করুন</span>
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {displayedChapters.map((ch, idx) => {
              const isToggling = togglingId === ch.id;

              return (
                <div
                  key={ch.id}
                  className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                    ch.is_completed
                      ? 'bg-emerald-50/40 dark:bg-emerald-950/20'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-start space-x-3.5">
                    <span
                      className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black shrink-0 font-mono ${
                        ch.is_completed
                          ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {ch.chapter_no || idx + 1}
                    </span>

                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {ch.subject}
                        </span>
                        {ch.is_completed ? (
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 flex items-center space-x-1">
                            <Check className="w-3 h-3" />
                            <span>সম্পন্ন (Completed)</span>
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300">
                            চলমান (Pending)
                          </span>
                        )}
                      </div>

                      <h4
                        className={`text-sm font-bold transition-all ${
                          ch.is_completed
                            ? 'text-slate-900 dark:text-slate-100 line-through decoration-emerald-500/60'
                            : 'text-slate-800 dark:text-slate-200'
                        }`}
                      >
                        {ch.chapter_name}
                      </h4>
                    </div>
                  </div>

                  {/* Real-time Toggle Switch & Actions */}
                  <div className="flex items-center space-x-4 self-end sm:self-center shrink-0">
                    <label className="relative inline-flex items-center cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={ch.is_completed}
                        onChange={() => handleToggle(ch.id, ch.is_completed)}
                        disabled={isToggling}
                        className="sr-only peer"
                      />
                      <div className="w-12 h-6 bg-slate-300 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[3px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500 shadow-inner"></div>
                      <span className="ml-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                        {isToggling ? 'আপডেট হচ্ছে...' : ch.is_completed ? 'সম্পন্ন ✓' : 'বাকি'}
                      </span>
                    </label>

                    <button
                      type="button"
                      onClick={() => handleDeleteChapter(ch.id)}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                      title="অধ্যায় মুছে ফেলুন"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Chapter Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 text-slate-900 dark:text-white">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-black text-base flex items-center space-x-2">
                <Plus className="w-5 h-5 text-emerald-500" />
                <span>নতুন অধ্যায় যুক্ত করুন ({selectedClass})</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddChapterSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  বিষয় (Subject) *
                </label>
                <input
                  type="text"
                  required
                  value={newChapterForm.subject}
                  onChange={(e) => setNewChapterForm({ ...newChapterForm, subject: e.target.value })}
                  placeholder="যেমন: পদার্থবিজ্ঞান (Physics)"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  অধ্যায় নম্বর (Chapter No.)
                </label>
                <input
                  type="number"
                  value={newChapterForm.chapter_no}
                  onChange={(e) => setNewChapterForm({ ...newChapterForm, chapter_no: e.target.value })}
                  placeholder="যেমন: 5"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  অধ্যায়ের পুরো শিরোনাম (Chapter Title) *
                </label>
                <input
                  type="text"
                  required
                  value={newChapterForm.chapter_name}
                  onChange={(e) => setNewChapterForm({ ...newChapterForm, chapter_name: e.target.value })}
                  placeholder="যেমন: ৫ম অধ্যায়: পদার্থের অবস্থা ও চাপ"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="modalIsComp"
                  checked={newChapterForm.is_completed}
                  onChange={(e) => setNewChapterForm({ ...newChapterForm, is_completed: e.target.checked })}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                />
                <label htmlFor="modalIsComp" className="text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                  ইতোমধ্যেই সম্পন্ন করা হয়েছে (Mark as Completed)
                </label>
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={savingChapter}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/30 flex items-center space-x-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>{savingChapter ? 'সংরক্ষণ হচ্ছে...' : 'সংরক্ষণ করুন'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
