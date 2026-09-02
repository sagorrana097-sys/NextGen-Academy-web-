import React from 'react';
import { BookOpen, Volume2 } from 'lucide-react';

export default function GrammarExamples({ examples = [], onSpeak }) {
  if (!examples || !examples.length) return null;

  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900 p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <h3 className="font-black text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <span>০৫ ও ০৬ — বাস্তব উদাহরণ ও বাংলা অর্থ (Examples & Bangla Meaning)</span>
        </h3>
        <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
          {examples.length}টি বাস্তব উদাহরণ
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {examples.map((ex, idx) => (
          <div
            key={idx}
            className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 flex items-start justify-between gap-3 group hover:border-emerald-500/40 transition-all"
          >
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold flex items-center justify-center font-mono">
                  {idx + 1}
                </span>
                <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white font-english">
                  {ex.en}
                </p>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 pl-7">
                {ex.bn}
              </p>

              {ex.note && (
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium pl-7 italic">
                  💡 {ex.note}
                </p>
              )}
            </div>

            {onSpeak && (
              <button
                type="button"
                onClick={() => onSpeak(ex.en)}
                className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 group-hover:text-emerald-600 hover:scale-110 active:scale-95 transition-all flex-shrink-0 cursor-pointer shadow-xs"
                title="উচ্চারণ শুনুন"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
