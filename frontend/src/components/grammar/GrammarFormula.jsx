import React from 'react';
import { Terminal } from 'lucide-react';

export default function GrammarFormula({ formulas = [], mainFormula = '' }) {
  if (!formulas.length && !mainFormula) return null;

  return (
    <div className="rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 p-5 sm:p-7 text-white border border-indigo-500/30 shadow-xl space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-indigo-500/20">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
            <Terminal className="w-4 h-4" />
          </div>
          <h4 className="text-xs sm:text-sm font-black uppercase tracking-wider text-indigo-300">
            ০৪ — গঠনপ্রণালী ও সূত্র (Formula / Structure)
          </h4>
        </div>
        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold">
          Master Formula
        </span>
      </div>

      {mainFormula && (
        <div className="p-3.5 rounded-2xl bg-indigo-900/60 border border-indigo-500/40 text-xs sm:text-sm font-mono font-bold text-amber-300 flex items-center gap-2 overflow-x-auto">
          <span className="text-slate-400 select-none">▶</span>
          <span>{mainFormula}</span>
        </div>
      )}

      {formulas.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          {formulas.map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1.5 hover:border-indigo-500/40 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400">
                  {item.label || item.type}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold">
                  {item.tag || 'Structure'}
                </span>
              </div>
              <p className="text-xs font-mono font-semibold text-emerald-400 break-words">
                {item.structure}
              </p>
              {item.example && (
                <p className="text-[11px] text-slate-400 italic pt-1 font-english">
                  e.g. {item.example}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
