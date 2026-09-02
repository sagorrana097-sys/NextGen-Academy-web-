import React from 'react';
import {
  Bookmark, CheckCircle2, TrendingUp, Compass, Award,
  Layers, Flame, Sparkles
} from 'lucide-react';

const SECTIONS = [
  { id: 'section-def', label: '০১. সংজ্ঞা ও পরিচিতি' },
  { id: 'section-explain', label: '০২. সহজ ব্যাখ্যা' },
  { id: 'section-rules', label: '০৩. সম্পূর্ণ নিয়মাবলী' },
  { id: 'section-formula', label: '০৪. গঠনপ্রণালী ও সূত্র' },
  { id: 'section-examples', label: '০৫. বাস্তব উদাহরণ' },
  { id: 'section-exceptions', label: '০৭. ব্যতিক্রমী ক্ষেত্র' },
  { id: 'section-mistakes', label: '০৮. সাধারণ ভুলত্রুটি' },
  { id: 'section-mcq', label: '০৯. MCQ পরীক্ষা' },
  { id: 'section-practice', label: '১০. লিখিত অনুশীলন' },
  { id: 'section-board', label: '১১. বোর্ড প্রশ্নব্যাংক' }
];

export default function GrammarRightPanel({
  topic,
  isCompleted,
  onToggleComplete,
  isBookmarked,
  onToggleBookmark,
  overallProgress = { percentage: 0, completedCount: 0, totalCount: 23 },
  activeSection = 'section-def'
}) {
  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <aside className="hidden xl:flex flex-col w-72 2xl:w-80 space-y-4 sticky top-20 h-[calc(100vh-6rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
      {/* 1. Current Topic Progress Card */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
            টপিক অগ্রগতি (Status)
          </span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
            isCompleted
              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
              : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
          }`}>
            {isCompleted ? 'সম্পন্ন ✓' : 'চলমান...'}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <button
            type="button"
            onClick={onToggleComplete}
            className={`w-full py-2.5 px-3 rounded-2xl text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
              isCompleted
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isCompleted ? 'সম্পন্ন হিসেবে চিহ্নিত' : 'পড়া শেষ হিসেবে মার্ক করুন'}</span>
          </button>

          <button
            type="button"
            onClick={onToggleBookmark}
            className={`w-full py-2 px-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              isBookmarked
                ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
                : 'bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
            <span>{isBookmarked ? 'বুকমার্কে সংরক্ষিত' : 'বুকমার্কে যোগ করুন'}</span>
          </button>
        </div>
      </div>

      {/* 2. Overall Grammar Syllabus Progress */}
      <div className="p-5 rounded-3xl bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 text-white border border-indigo-500/30 shadow-md space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-300">
            <TrendingUp className="w-4 h-4" />
            <span>সিলেবাস অগ্রগতি</span>
          </div>
          <span className="text-sm font-mono font-black text-amber-300">
            {overallProgress.percentage}%
          </span>
        </div>

        {/* Visual Progress Bar */}
        <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(overallProgress.percentage, 100)}%` }}
          />
        </div>

        <p className="text-[11px] text-slate-400 flex items-center justify-between">
          <span>সম্পন্ন টপিক:</span>
          <strong className="text-white font-mono">{overallProgress.completedCount} / {overallProgress.totalCount}</strong>
        </p>
      </div>

      {/* 3. Quick Section Navigation (Jumps) */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800 text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
          <Compass className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span>দ্রুত নেভিগেশন (Sections)</span>
        </div>

        <div className="space-y-1">
          {SECTIONS.map((sec) => (
            <button
              key={sec.id}
              type="button"
              onClick={() => scrollToSection(sec.id)}
              className="w-full text-left p-2 rounded-xl text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors cursor-pointer truncate"
            >
              {sec.label}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
