import React, { useState } from 'react';
import { Edit3, Eye } from 'lucide-react';

export default function GrammarPractice({ writtenDrills = [] }) {
  const [userInputs, setUserInputs] = useState({});
  const [revealed, setRevealed] = useState({});

  if (!writtenDrills || !writtenDrills.length) return null;

  const toggleReveal = (id) => {
    setRevealed(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleInputChange = (id, val) => {
    setUserInputs(prev => ({ ...prev, [id]: val }));
  };

  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900 p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <h3 className="font-black text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2">
          <Edit3 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <span>১০ — লিখিত ও রূপান্তর অনুশীলন (Written Practice)</span>
        </h3>
        <span className="text-xs font-bold text-slate-400">
          {writtenDrills.length}টি প্রশ্ন
        </span>
      </div>

      <div className="space-y-3.5">
        {writtenDrills.map((drill, idx) => {
          const isRev = revealed[drill.id || idx];
          const inputVal = userInputs[drill.id || idx] || '';

          return (
            <div
              key={drill.id || idx}
              className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white font-english">
                  {idx + 1}. {drill.prompt}
                </p>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold flex-shrink-0">
                  {drill.type || 'Practice'}
                </span>
              </div>

              {/* Student Input Box */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={inputVal}
                  onChange={(e) => handleInputChange(drill.id || idx, e.target.value)}
                  placeholder="আপনার উত্তর এখানে লিখুন..."
                  className="flex-1 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white font-english focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => toggleReveal(drill.id || idx)}
                  className="px-3.5 py-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold hover:bg-indigo-100 flex items-center gap-1.5 transition-colors flex-shrink-0 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{isRev ? 'লুকান' : 'উত্তর দেখুন'}</span>
                </button>
              </div>

              {/* Revealed Answer */}
              {isRev && (
                <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-300 dark:border-emerald-800/60 text-xs text-emerald-900 dark:text-emerald-200 space-y-1">
                  <p>
                    <strong className="font-black">সঠিক উত্তর:</strong>{' '}
                    <span className="font-english font-bold text-emerald-700 dark:text-emerald-300">
                      {drill.correctAnswer}
                    </span>
                  </p>
                  {drill.explanationBn && (
                    <p className="text-[11px] text-slate-600 dark:text-slate-300">
                      💡 {drill.explanationBn}
                    </p>
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
