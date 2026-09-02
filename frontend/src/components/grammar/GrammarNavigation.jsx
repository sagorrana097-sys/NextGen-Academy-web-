import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export default function GrammarNavigation({
  hasPrevious,
  hasNext,
  onPrevious,
  onNext
}) {
  return (
    <div className="flex items-center justify-between p-4 sm:p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
      <button
        type="button"
        onClick={onPrevious}
        disabled={!hasPrevious}
        className="px-4 sm:px-5 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition-all cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>পূর্ববর্তী টপিক (Previous)</span>
      </button>

      <button
        type="button"
        onClick={onNext}
        disabled={!hasNext}
        className="px-5 sm:px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-30 disabled:cursor-not-allowed text-white text-xs font-black flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
      >
        <span>পরবর্তী টপিক (Next)</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}
