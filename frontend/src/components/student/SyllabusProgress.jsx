import React, { useState, useEffect } from 'react';
import { syllabusTrackingAPI } from '../../services/api';
import {
  BookOpen,
  CheckCircle2,
  TrendingUp,
  ChevronRight,
  Sparkles,
  Layers,
  X,
  Check
} from 'lucide-react';

export default function SyllabusProgress({ studentClass = 'Class 9', className = '' }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSubjectModal, setSelectedSubjectModal] = useState(null);

  useEffect(() => {
    fetchSyllabus();
  }, [studentClass]);

  const fetchSyllabus = async () => {
    setLoading(true);
    try {
      // Clean / standardize class name (e.g., '৯ম শ্রেণি (Class 9)' -> 'Class 9')
      let targetClass = 'Class 9';
      if (studentClass) {
        if (studentClass.includes('10') || studentClass.includes('১০ম')) targetClass = 'Class 10';
        else if (studentClass.includes('8') || studentClass.includes('৮ম')) targetClass = 'Class 8';
        else if (studentClass.includes('7') || studentClass.includes('৭ম')) targetClass = 'Class 7';
        else if (studentClass.includes('6') || studentClass.includes('৬ষ্ঠ')) targetClass = 'Class 6';
        else if (studentClass.includes('11') || studentClass.includes('একাদশ')) targetClass = 'Class 11';
        else if (studentClass.includes('12') || studentClass.includes('দ্বাদশ')) targetClass = 'Class 12';
        else if (studentClass.includes('SSC')) targetClass = 'SSC 2026';
        else if (studentClass.includes('HSC')) targetClass = 'HSC 2026';
      }

      const res = await syllabusTrackingAPI.getSyllabus({ batch_or_class: targetClass });
      if (res.success && res.data) {
        setData(res.data);
      }
    } catch (err) {
      console.error('Failed to load student syllabus progress:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 animate-pulse space-y-3 ${className}`}>
        <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-1/3"></div>
        <div className="space-y-2">
          <div className="h-4 bg-slate-100 dark:bg-slate-800/60 rounded w-full"></div>
          <div className="h-2.5 bg-slate-100 dark:bg-slate-800/60 rounded-full"></div>
        </div>
      </div>
    );
  }

  if (!data || data.subjects?.length === 0) {
    return null;
  }

  return (
    <>
      <div className={`bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl sm:rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 transition-all font-sans ${className}`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-4 border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="font-black text-slate-800 dark:text-white text-base flex items-center gap-2">
            <span>📊</span>
            <span>সিলেবাস প্রগ্রেস</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-mono">
              {data.batch_or_class}
            </span>
          </h3>

          <div className="flex items-center space-x-1 text-xs font-black text-emerald-600 dark:text-emerald-400 font-mono">
            <span>মোট {data.overallPercentage}% সম্পন্ন</span>
          </div>
        </div>

        {/* Subjects Progress List */}
        <div className="space-y-4">
          {data.subjects.map((sub, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedSubjectModal(sub)}
              className="group cursor-pointer p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all"
              title="অধ্যায় তালিকা দেখতে ক্লিক করুন"
            >
              <div className="flex justify-between items-center text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                <span className="group-hover:text-emerald-600 transition-colors flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span className="truncate">{sub.subject}</span>
                </span>
                <div className="flex items-center space-x-2 font-mono shrink-0">
                  <span className="text-[11px] text-slate-400 font-normal">
                    {sub.completedChapters}/{sub.totalChapters}
                  </span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-black">
                    {sub.percentage}%
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>

              {/* Animated Gradient Progress Bar */}
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-emerald-400 via-teal-500 to-emerald-500 h-2.5 rounded-full transition-all duration-1000 shadow-sm"
                  style={{ width: `${sub.percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Note */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
          <span>🏛️ নেক্সটজেন একাডেমি অ্যাকাডেমিক কারিকুলাম</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-semibold cursor-pointer hover:underline">
            ক্লিক করে বিস্তারিত দেখুন 🔍
          </span>
        </div>
      </div>

      {/* Chapters Detail Modal */}
      {selectedSubjectModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 text-slate-900 dark:text-white max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="font-black text-base text-slate-900 dark:text-white">
                  {selectedSubjectModal.subject}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  অগ্রগতি: {selectedSubjectModal.completedChapters}/{selectedSubjectModal.totalChapters} অধ্যায় ({selectedSubjectModal.percentage}%)
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSubjectModal(null)}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 space-y-2 pr-1">
              {selectedSubjectModal.chapters.map((ch, cIdx) => (
                <div
                  key={ch.id || cIdx}
                  className={`p-3 rounded-2xl border flex items-center justify-between transition-colors ${
                    ch.is_completed
                      ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-500/30'
                      : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <span
                      className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-mono font-bold shrink-0 ${
                        ch.is_completed
                          ? 'bg-emerald-500 text-white shadow-sm'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {ch.chapter_no || cIdx + 1}
                    </span>
                    <p
                      className={`text-xs font-bold truncate ${
                        ch.is_completed
                          ? 'text-slate-900 dark:text-slate-100 font-extrabold'
                          : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {ch.chapter_name}
                    </p>
                  </div>

                  {ch.is_completed ? (
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500 text-white text-[10px] font-black flex items-center space-x-1 shrink-0">
                      <Check className="w-3 h-3" />
                      <span>সম্পন্ন</span>
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 text-[10px] font-bold shrink-0">
                      চলমান
                    </span>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedSubjectModal(null)}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
