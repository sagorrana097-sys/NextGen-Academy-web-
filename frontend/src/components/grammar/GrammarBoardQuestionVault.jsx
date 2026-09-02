import React, { useState } from 'react';
import {
  BookOpen, Award, Filter, Search, CheckCircle2, ChevronRight
} from 'lucide-react';

const BOARDS = ['সকল বোর্ড', 'ঢাকা বোর্ড', 'রাজশাহী বোর্ড', 'কুমিল্লা বোর্ড', 'যশোর বোর্ড', 'চট্টগ্রাম বোর্ড', 'দিনাজপুর বোর্ড', 'সিলেট বোর্ড', 'ময়মনসিংহ বোর্ড'];
const YEARS = ['সকল বছর', '2025', '2024', '2023', '2022'];

export default function GrammarBoardQuestionVault({ topic }) {
  const [selectedBoard, setSelectedBoard] = useState('সকল বোর্ড');
  const [selectedYear, setSelectedYear] = useState('সকল বছর');

  if (!topic) return null;
  const bQuestions = topic.boardQuestions || [];

  const filtered = bQuestions.filter(bq => {
    const matchesBoard = selectedBoard === 'সকল বোর্ড' || bq.board === selectedBoard;
    const matchesYear = selectedYear === 'সকল বছর' || String(bq.year) === selectedYear;
    return matchesBoard && matchesYear;
  });

  return (
    <div className="space-y-6">
      {/* Top Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div>
          <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            <span>{topic.titleBn} — বোর্ড প্রশ্ন ও সমাধান ব্যাংক</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            বিগত বছরের সকল শিক্ষাবোর্ডের প্রশ্নপত্র ও পূর্ণাঙ্গ সমাধান
          </p>
        </div>

        {/* Board & Year Filters */}
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

      {/* Questions List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-xs text-slate-400">
            নির্বাচিত বোর্ড বা বছরের কোনো প্রশ্ন পাওয়া যায়নি।
          </div>
        ) : (
          filtered.map((bq, idx) => (
            <div
              key={bq.id || idx}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/30 text-xs font-black">
                    {bq.board} {bq.year}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-bold text-slate-600 dark:text-slate-300">
                    {bq.examType}
                  </span>
                </div>
              </div>

              {bq.questionContext && (
                <div className="p-3.5 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-200/80 dark:border-slate-800 text-xs font-english font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
                  {bq.questionContext}
                </div>
              )}

              {/* Sub-questions with standard solutions */}
              <div className="space-y-3">
                {bq.subQuestions?.map((sub, sIdx) => (
                  <div key={sIdx} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200/60 dark:border-slate-800 space-y-2">
                    <p className="text-xs font-bold text-slate-900 dark:text-white font-english">
                      {sub.questionText}
                    </p>
                    <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-300 dark:border-emerald-800/60 text-xs text-emerald-900 dark:text-emerald-200">
                      <strong className="font-black">উত্তর:</strong> <span className="font-english font-bold text-emerald-700 dark:text-emerald-300">{sub.answer}</span>
                      {sub.explanationBn && <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1">💡 {sub.explanationBn}</p>}
                    </div>
                  </div>
                ))}
              </div>

              {bq.fullExplanationBn && (
                <div className="p-3.5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-300 dark:border-amber-900/40 text-xs text-amber-900 dark:text-amber-200">
                  <strong className="font-black">বোর্ড স্ট্যান্ডার্ড বিশ্লেষণ:</strong> {bq.fullExplanationBn}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
