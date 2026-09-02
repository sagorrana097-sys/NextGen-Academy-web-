import React, { useState } from 'react';
import { Layers, ChevronDown, ChevronUp, Sparkles, Volume2 } from 'lucide-react';

export default function GrammarRules({ rules = [], onSpeak }) {
  const [openIdx, setOpenIdx] = useState(0);

  if (!rules || !rules.length) return null;

  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900 p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <h3 className="font-black text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2">
          <Layers className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <span>০৩ — সম্পূর্ণ ব্যাকরণিক নিয়মাবলী (All Rules)</span>
        </h3>
        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 font-mono">
          মোট {rules.length}টি নিয়ম
        </span>
      </div>

      <div className="space-y-3">
        {rules.map((rule, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className="rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden bg-slate-50/50 dark:bg-slate-950/40 transition-all"
            >
              {/* Accordion Header */}
              <button
                type="button"
                onClick={() => setOpenIdx(isOpen ? -1 : idx)}
                className="w-full p-4 text-left flex items-center justify-between gap-3 hover:bg-slate-100/60 dark:hover:bg-slate-900/60 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-xl bg-indigo-600 text-white font-mono text-xs font-bold flex items-center justify-center flex-shrink-0 shadow-xs">
                    {idx + 1}
                  </span>
                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                      {rule.nameBn || rule.name}
                    </h4>
                    {rule.nameEn && (
                      <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 font-english block">
                        {rule.nameEn}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-slate-400">
                  {rule.formula && (
                    <span className="hidden sm:inline-block text-[11px] font-mono px-2.5 py-0.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/40">
                      {rule.formula.length > 35 ? rule.formula.slice(0, 35) + '...' : rule.formula}
                    </span>
                  )}
                  {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              {/* Accordion Body */}
              {isOpen && (
                <div className="p-4 pt-1 sm:p-5 sm:pt-2 space-y-4 border-t border-slate-200/60 dark:border-slate-800/60">
                  {rule.formula && (
                    <div className="p-3.5 rounded-2xl bg-indigo-950 text-indigo-200 font-mono text-xs font-black border border-indigo-500/30 flex items-center justify-between gap-2 overflow-x-auto">
                      <span>{rule.formula}</span>
                      {rule.shortcutTrick && (
                        <span className="px-2 py-0.5 rounded-md bg-indigo-800 text-[10px] text-amber-300 font-sans font-bold whitespace-nowrap">
                          💡 {rule.shortcutTrick}
                        </span>
                      )}
                    </div>
                  )}

                  {rule.descriptionBn && (
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                      {rule.descriptionBn}
                    </p>
                  )}

                  {rule.timeMarkers && (
                    <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-300">
                      <strong className="font-bold">টাইম মার্কার্স (Time Markers):</strong> {rule.timeMarkers}
                    </div>
                  )}

                  {/* Examples inside rule */}
                  {rule.examples?.length > 0 && (
                    <div className="space-y-2 pt-1">
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        উদাহরণসমূহ (Examples):
                      </span>
                      <div className="grid grid-cols-1 gap-2">
                        {rule.examples.map((ex, eIdx) => (
                          <div
                            key={eIdx}
                            className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 flex items-start justify-between gap-3"
                          >
                            <div className="space-y-0.5">
                              <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white font-english">
                                {ex.en}
                              </p>
                              <p className="text-xs text-slate-600 dark:text-slate-400">
                                {ex.bn}
                              </p>
                              {ex.note && (
                                <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium italic pt-0.5">
                                  📌 {ex.note}
                                </p>
                              )}
                            </div>
                            {onSpeak && (
                              <button
                                type="button"
                                onClick={() => onSpeak(ex.en)}
                                className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-indigo-600 transition-colors flex-shrink-0"
                                title="Listen pronunciation"
                              >
                                <Volume2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
