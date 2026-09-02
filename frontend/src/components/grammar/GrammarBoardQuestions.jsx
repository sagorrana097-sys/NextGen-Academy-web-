import React, { useState } from 'react';
import { Award, ShieldCheck } from 'lucide-react';

const BOARDS = ['সকল বোর্ড', 'ঢাকা বোর্ড', 'রাজশাহী বোর্ড', 'কুমিল্লা বোর্ড', 'যশোর বোর্ড', 'চট্টগ্রাম বোর্ড', 'দিনাজপুর বোর্ড', 'সিলেট বোর্ড', 'ময়মনসিংহ বোর্ড'];
const YEARS = ['সকল বছর', '2025', '2024', '2023', '2022'];

export default function GrammarBoardQuestions({ boardQuestions = [] }) {
  const [selectedBoard, setSelectedBoard] = useState('সকল বোর্ড');
  const [selectedYear, setSelectedYear] = useState('সকল বছর');

  if (!boardQuestions || !boardQuestions.length) return null;

  const filtered = boardQuestions.filter(bq => {
    const matchesBoard = selectedBoard === 'সকল বোর্ড' || bq.board === selectedBoard;
    const matchesYear = selectedYear === 'সকল বছর' || String(bq.year) === selectedYear;
    return matchesBoard && matchesYear;
  });

  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900 p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <h3 className="font-black text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-500" />
          <span>১১ ও ১২ — বোর্ড প্রশ্ন ও স্ট্যান্ডার্ড সমাধান (Board Questions & Solutions)</span>
        </h3>

        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={selectedBoard}
            onChange={(e) => setSelectedBoard(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {BOARDS.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {filtered.map((bq, idx) => (
          <div
            key={bq.id || idx}
            className="p-5 sm:p-6 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 space-y-3.5"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/30 text-xs font-black">
                  {bq.board} {bq.year}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-300">
                  {bq.examType || 'SSC'}
                </span>
              </div>
              {bq.isVerified && (
                <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4" />
                  <span>যাচাইকৃত বোর্ড প্রশ্ন</span>
                </span>
              )}
            </div>

            {bq.questionContext && (
              <p className="text-xs sm:text-sm font-english font-medium text-slate-800 dark:text-slate-200 leading-relaxed p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/60 dark:border-slate-800">
                {bq.questionContext}
              </p>
            )}

            {/* Sub-questions & answers */}
            <div className="space-y-2">
              {bq.subQuestions?.map((sub, sIdx) => (
                <div
                  key={sIdx}
                  className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 space-y-1.5"
                >
                  <p className="text-xs font-bold text-slate-900 dark:text-white font-english">
                    {sub.questionText}
                  </p>
                  <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-lg text-xs text-emerald-900 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800/40">
                    <strong className="font-black">উত্তর:</strong>{' '}
                    <span className="font-english font-bold text-emerald-700 dark:text-emerald-300">
                      {sub.answer}
                    </span>
                    {sub.explanationBn && (
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">
                        💡 {sub.explanationBn}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {bq.fullExplanationBn && (
              <div className="p-3.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-300 dark:border-amber-900/40 text-xs text-amber-900 dark:text-amber-200">
                <strong className="font-black">বোর্ড স্ট্যান্ডার্ড বিশ্লেষণ:</strong> {bq.fullExplanationBn}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
