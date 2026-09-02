import React from 'react';
import { AlertTriangle } from 'lucide-react';

export default function GrammarExceptions({ exceptions = [] }) {
  if (!exceptions || !exceptions.length) return null;

  return (
    <div className="rounded-3xl bg-rose-50/40 dark:bg-rose-950/20 p-6 sm:p-8 border border-rose-200/80 dark:border-rose-900/40 shadow-xs space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-rose-200/60 dark:border-rose-900/40">
        <h3 className="font-black text-sm sm:text-base text-rose-700 dark:text-rose-400 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-rose-600" />
          <span>০৭ — ব্যতিক্রমী ক্ষেত্র ও ফাঁদ (Exceptions & Traps)</span>
        </h3>
        <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-700 dark:text-rose-300">
          পরীক্ষার ট্র্যাপ
        </span>
      </div>

      <div className="space-y-3">
        {exceptions.map((exc, idx) => (
          <div
            key={idx}
            className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-rose-200/60 dark:border-rose-900/30 text-xs space-y-2 shadow-xs"
          >
            <h5 className="font-black text-xs sm:text-sm text-rose-900 dark:text-rose-300">
              {exc.ruleName}
            </h5>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              {exc.exceptionText}
            </p>
            {exc.exampleEn && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200/60 dark:border-rose-900/20 font-english text-xs font-bold text-rose-900 dark:text-rose-200">
                e.g. "{exc.exampleEn}" {exc.exampleBn ? `(${exc.exampleBn})` : ''}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
