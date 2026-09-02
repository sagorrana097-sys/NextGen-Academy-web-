import React, { useState } from 'react';
import {
  Award, CheckCircle2, XCircle, Clock, RotateCcw, ArrowRight,
  TrendingUp, BarChart3, HelpCircle, Check, X, BookOpen, Layers
} from 'lucide-react';

export default function GrammarExamResult({
  resultData = {},
  onRetakeTest,
  onBackToBook,
  onGoToAnalytics
}) {
  const [filterMode, setFilterMode] = useState('ALL'); // 'ALL' | 'WRONG' | 'CORRECT' | 'UNANSWERED'

  const {
    testTitleEn = 'Grammar Exam',
    testTitleBn = 'গ্রামার পরীক্ষা ফলাফল',
    score = 0,
    totalMarks = 20,
    totalQuestions = 20,
    attemptedCount = 0,
    correctCount = 0,
    wrongCount = 0,
    unansweredCount = 0,
    percentage = 0,
    accuracy = 0,
    grade = 'B',
    passed = true,
    timeTakenSeconds = 0,
    chapterStats = {},
    breakdown = []
  } = resultData;

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m} মিনিট ${s} সেকেন্ড`;
  };

  const filteredQuestions = breakdown.filter(item => {
    if (filterMode === 'CORRECT') return item.isCorrect;
    if (filterMode === 'WRONG') return item.isAttempted && !item.isCorrect;
    if (filterMode === 'UNANSWERED') return !item.isAttempted;
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* ================================================================ */}
      {/* 1. SCORE CARD BANNER */}
      {/* ================================================================ */}
      <div className={`rounded-3xl p-6 sm:p-8 border shadow-xl text-white relative overflow-hidden ${
        passed
          ? 'bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border-indigo-500/30 shadow-indigo-900/10'
          : 'bg-gradient-to-br from-slate-900 via-rose-950 to-slate-900 border-rose-500/30 shadow-rose-900/10'
      }`}>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-white/10 border border-white/15">
              <Award className="w-3.5 h-3.5 text-amber-300" />
              <span>{passed ? 'পরীক্ষায় উত্তীর্ণ (PASSED)' : 'পুনরায় অনুশীলন প্রয়োজন (FAILED)'}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white">
              {testTitleBn}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-medium">
              {testTitleEn} • সময় ব্যয় হয়েছে: {formatTime(timeTakenSeconds)}
            </p>
          </div>

          {/* Big Score Display */}
          <div className="flex items-center gap-4">
            <div className="text-center p-4 sm:p-5 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 shadow-inner">
              <span className="block text-3xl sm:text-5xl font-black text-amber-300 font-mono">
                {score}
              </span>
              <span className="text-[11px] font-bold text-slate-300">
                মোট নম্বর ({totalMarks})
              </span>
            </div>

            <div className="text-center p-4 sm:p-5 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 shadow-inner">
              <span className={`block text-3xl sm:text-5xl font-black font-mono ${
                percentage >= 80 ? 'text-emerald-400' : (percentage >= 50 ? 'text-cyan-400' : 'text-rose-400')
              }`}>
                {grade}
              </span>
              <span className="text-[11px] font-bold text-slate-300">
                গ্রেড ({percentage}%)
              </span>
            </div>
          </div>
        </div>

        {/* 4 Stat Pills */}
        <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
            <span className="block font-mono font-black text-lg text-emerald-400">{correctCount}</span>
            <span className="text-[11px] text-slate-300 font-medium">সঠিক উত্তর ✓</span>
          </div>
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
            <span className="block font-mono font-black text-lg text-rose-400">{wrongCount}</span>
            <span className="text-[11px] text-slate-300 font-medium">ভুল উত্তর ✗</span>
          </div>
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
            <span className="block font-mono font-black text-lg text-amber-300">{unansweredCount}</span>
            <span className="text-[11px] text-slate-300 font-medium">অনাক্রান্ত</span>
          </div>
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
            <span className="block font-mono font-black text-lg text-cyan-400">{accuracy}%</span>
            <span className="text-[11px] text-slate-300 font-medium">নির্ভুলতার হার (Accuracy)</span>
          </div>
        </div>
      </div>

      {/* ================================================================ */}
      {/* 2. CHAPTER BREAKDOWN BAR (IF MULTI-CHAPTER TEST) */}
      {/* ================================================================ */}
      {Object.keys(chapterStats).length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-indigo-500" />
            <span>অধ্যায়ভিত্তিক দক্ষতা মূল্যায়ন (Chapter Performance)</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {Object.entries(chapterStats).map(([cId, stats]) => {
              const chapAccuracy = stats.attempted > 0 ? Math.round((stats.correct / stats.attempted) * 100) : 0;
              return (
                <div key={cId} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700 dark:text-slate-300">
                      অধ্যায় {cId}
                    </span>
                    <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      {stats.correct}/{stats.total} ({chapAccuracy}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        chapAccuracy >= 70 ? 'bg-emerald-500' : (chapAccuracy >= 50 ? 'bg-indigo-500' : 'bg-rose-500')
                      }`}
                      style={{ width: `${chapAccuracy}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================================================================ */}
      {/* 3. ANSWER REVIEW SECTION */}
      {/* ================================================================ */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              উত্তরমালার পুঙ্খানুপুঙ্খ পর্যালোচনা (Review Answers)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              প্রতিটি প্রশ্নের ছাত্রের প্রদত্ত উত্তর, সঠিক উত্তর ও বাংলা ব্যাখ্যা দেখুন।
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 self-start sm:self-auto text-xs font-bold">
            <button
              type="button"
              onClick={() => setFilterMode('ALL')}
              className={`px-3 py-1.5 rounded-xl cursor-pointer transition-colors ${
                filterMode === 'ALL' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500'
              }`}
            >
              সকল ({breakdown.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('WRONG')}
              className={`px-3 py-1.5 rounded-xl cursor-pointer transition-colors ${
                filterMode === 'WRONG' ? 'bg-rose-500 text-white shadow-xs' : 'text-slate-500 hover:text-rose-500'
              }`}
            >
              ভুল উত্তর ({wrongCount})
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('CORRECT')}
              className={`px-3 py-1.5 rounded-xl cursor-pointer transition-colors ${
                filterMode === 'CORRECT' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-500 hover:text-emerald-600'
              }`}
            >
              সঠিক উত্তর ({correctCount})
            </button>
          </div>
        </div>

        {/* Questions Breakdown List */}
        <div className="space-y-4">
          {filteredQuestions.map((q, idx) => {
            const letter = (idx) => String.fromCharCode(65 + idx);

            return (
              <div
                key={q.questionId || idx}
                className={`p-5 rounded-3xl border transition-all ${
                  q.isCorrect
                    ? 'bg-emerald-50/30 dark:bg-emerald-950/10 border-emerald-200/80 dark:border-emerald-800/60'
                    : q.isAttempted
                    ? 'bg-rose-50/30 dark:bg-rose-950/10 border-rose-200/80 dark:border-rose-800/60'
                    : 'bg-slate-50 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800'
                }`}
              >
                {/* Status Bar */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/60 gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-slate-200 dark:bg-slate-700 font-mono font-black text-xs flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-bold text-slate-500">
                      অধ্যায় {q.chapterId || 1}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {q.isCorrect ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/40 px-2.5 py-0.5 rounded-full">
                        <Check className="w-3.5 h-3.5" />
                        <span>সঠিক (+{q.marksAwarded})</span>
                      </span>
                    ) : q.isAttempted ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-100 dark:bg-rose-900/40 px-2.5 py-0.5 rounded-full">
                        <X className="w-3.5 h-3.5" />
                        <span>ভুল ({q.marksAwarded})</span>
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-full">
                        উত্তর প্রদান করা হয়নি (0)
                      </span>
                    )}
                  </div>
                </div>

                {/* Question */}
                <div className="pt-3 space-y-1">
                  <p className="text-sm sm:text-base font-bold text-slate-900 dark:text-white font-english">
                    {q.question}
                  </p>
                  {q.questionBn && (
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {q.questionBn}
                    </p>
                  )}
                </div>

                {/* Answers Comparison */}
                <div className="mt-3 p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">আপনার উত্তর:</span>
                    <span className={`font-bold font-english ${
                      q.isCorrect ? 'text-emerald-600' : 'text-rose-500'
                    }`}>
                      {q.selectedOptionIndex !== null && q.options?.[q.selectedOptionIndex]
                        ? `(${letter(q.selectedOptionIndex)}) ${q.options[q.selectedOptionIndex]}`
                        : 'উত্তর প্রদান করা হয়নি'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500 font-medium">সঠিক উত্তর:</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 font-english">
                      ({letter(q.correctOptionIndex)}) {q.options?.[q.correctOptionIndex]}
                    </span>
                  </div>
                </div>

                {/* Explanation */}
                {(q.explanationBn || q.explanationEn) && (
                  <div className="mt-3 p-3.5 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/40 text-xs text-indigo-900 dark:text-indigo-200 space-y-1">
                    <span className="font-black flex items-center gap-1 text-indigo-700 dark:text-indigo-300">
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>ব্যাখ্যা (Explanation):</span>
                    </span>
                    <p className="leading-relaxed font-bangla">
                      {q.explanationBn || q.explanationEn}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800 flex-wrap gap-3">
          <button
            type="button"
            onClick={onBackToBook}
            className="px-5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs sm:text-sm hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer flex items-center gap-2 transition-colors"
          >
            <BookOpen className="w-4 h-4" />
            <span>গ্রামার বইয়ে ফিরে যান</span>
          </button>

          <div className="flex items-center gap-2.5">
            {onRetakeTest && (
              <button
                type="button"
                onClick={onRetakeTest}
                className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm cursor-pointer flex items-center gap-2 shadow-md shadow-indigo-600/20 transition-all active:scale-95"
              >
                <RotateCcw className="w-4 h-4" />
                <span>পুনরায় পরীক্ষা দিন</span>
              </button>
            )}

            {onGoToAnalytics && (
              <button
                type="button"
                onClick={onGoToAnalytics}
                className="px-5 py-2.5 rounded-2xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm cursor-pointer flex items-center gap-2 shadow-sm transition-all"
              >
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                <span>পারফরম্যান্স ট্র্যাক করুন</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
