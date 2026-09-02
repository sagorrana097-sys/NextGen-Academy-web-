import React from 'react';
import { ShieldAlert, XCircle, CheckCircle2 } from 'lucide-react';

export default function GrammarMistakes({ mistakes = [] }) {
  if (!mistakes || !mistakes.length) return null;

  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900 p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <h3 className="font-black text-sm sm:text-base text-amber-600 dark:text-amber-400 flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-amber-500" />
          <span>০৮ — সাধারণ ভুল বনাম সঠিক রূপ (Common Mistakes)</span>
        </h3>
        <span className="text-xs font-bold text-slate-400">
          ভুল এড়িয়ে চলুন
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {mistakes.map((m, idx) => (
          <div
            key={idx}
            className="p-4 sm:p-5 rounded-2xl bg-amber-50/40 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 space-y-2 text-xs"
          >
            <div className="space-y-1">
              <p className="flex items-start gap-1.5 font-bold text-rose-600 dark:text-rose-400 font-english line-through">
                <XCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{m.mistake}</span>
              </p>
              <p className="flex items-start gap-1.5 font-bold text-emerald-700 dark:text-emerald-400 font-english">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{m.correct}</span>
              </p>
            </div>

            {m.reasonBn && (
              <p className="text-slate-600 dark:text-slate-300 text-[11px] pt-1.5 border-t border-amber-200/50 dark:border-amber-900/30">
                <strong className="font-bold text-amber-800 dark:text-amber-300">কারণ:</strong> {m.reasonBn}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
