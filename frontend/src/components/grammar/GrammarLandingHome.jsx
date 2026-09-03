import React from 'react';
import {
  BookOpen, Sparkles, Layers, ListChecks, Award, Bookmark,
  TrendingUp, ArrowRight, Shuffle, Timer, BarChart3, Database,
  CheckCircle2, Globe, Flame
} from 'lucide-react';

function toBengaliNum(n) {
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(n).replace(/[0-9]/g, d => bnDigits[Number(d)]);
}

export default function GrammarLandingHome({
  activeSubject = 'BANGLA',
  onSelectSubject,
  stats = {},
  onStartBrowseChapters,
  onStartPractice,
  onStartRandomQuiz,
  onStartModelTest,
  onOpenBoardQuestions,
  onViewProgress,
  chapters = [],
  onSelectChapter
}) {
  const isBangla = activeSubject === 'BANGLA';

  const {
    totalChapters = isBangla ? 40 : 23,
    totalTopics = 0,
    totalQuestions = 0,
    totalModelTests = 0,
    progressPercentage = 0,
    completedTopicsCount = 0,
    totalBookmarks = 0
  } = stats;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* ================================================================ */}
      {/* 1. TOP DUAL SUBJECT SELECTOR (Landing Header) */}
      {/* ================================================================ */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <span className="text-[11px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
              নেক্সটজেন একাডেমি ব্যাকরণ ও ল্যাঙ্গুয়েজ হাব
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              ব্যাকরণ পাঠশালা (Grammar Academy)
            </h2>
          </div>
          <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-500/20">
            SSC • HSC • Admission 2026
          </span>
        </div>

        {/* Dual Subject Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card A: English Grammar */}
          <div
            onClick={() => onSelectSubject('ENGLISH')}
            className={`p-5 sm:p-6 rounded-3xl border-2 transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
              !isBangla
                ? 'border-indigo-600 bg-gradient-to-br from-indigo-50/80 via-white to-indigo-50/40 dark:from-indigo-950/40 dark:via-slate-900 dark:to-indigo-950/20 shadow-lg shadow-indigo-600/10'
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-300 dark:hover:border-indigo-700/60 opacity-80 hover:opacity-100'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-sm shadow-md">
                  EN
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 text-[11px] font-mono font-bold">
                  ২৩টি অধ্যায় • 100+ Topics
                </span>
              </div>

              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                  English Grammar
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                  Complete English Grammar
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                  Sentence, Tense, Narration, Voice, Preposition, Modifiers, Right Form of Verbs এবং বোর্ড প্রশ্নব্যাংক।
                </p>
              </div>
            </div>

            <div className="pt-4 mt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-bold text-indigo-600 dark:text-indigo-400">
              <span>{!isBangla ? '● বর্তমানে সক্রিয় (Active)' : 'ইংলিশ ব্যাকরণে যান →'}</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* Card B: Bangla Grammar */}
          <div
            onClick={() => onSelectSubject('BANGLA')}
            className={`p-5 sm:p-6 rounded-3xl border-2 transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
              isBangla
                ? 'border-emerald-600 bg-gradient-to-br from-emerald-50/80 via-white to-teal-50/40 dark:from-emerald-950/40 dark:via-slate-900 dark:to-emerald-950/20 shadow-lg shadow-emerald-600/10'
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-emerald-300 dark:hover:border-emerald-700/60 opacity-80 hover:opacity-100'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black text-sm shadow-md font-serif">
                  বাং
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-[11px] font-mono font-bold">
                  ৪০টি অধ্যায় • পূর্ণাঙ্গ সিলেবাস
                </span>
              </div>

              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                  বাংলা ব্যাকরণ
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                  সম্পূর্ণ বাংলা ব্যাকরণ
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                  ধ্বনি, বর্ণ, শব্দ, পদ, কারক, বিভক্তি, সন্ধি, সমাস, বাক্য সংকোচন, বাগধারা ও বোর্ড স্পেশাল রিভিশন।
                </p>
              </div>
            </div>

            <div className="pt-4 mt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <span>{isBangla ? '● বর্তমানে সক্রিয় (Active)' : 'বাংলা ব্যাকরণে যান →'}</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* ================================================================ */}
      {/* 2. SUBJECT BANNER (Bangla / English) */}
      {/* ================================================================ */}
      <div className={`rounded-3xl p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden ${
        isBangla
          ? 'bg-gradient-to-r from-teal-950 via-slate-900 to-emerald-950 border border-emerald-500/30'
          : 'bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30'
      }`}>
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-300 border border-white/10 text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isBangla ? 'সম্পূর্ণ বাংলা ব্যাকরণ কোর্স' : 'Complete English Grammar Course'}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
              {isBangla ? 'বাংলা ব্যাকরণ' : 'English Grammar'}
            </h1>
            <p className="text-sm sm:text-base text-slate-300 font-medium max-w-xl">
              {isBangla ? 'সহজ ভাষায় সম্পূর্ণ বাংলা ব্যাকরণ' : 'Master English Grammar easily with structured rules, examples, and tests'}
            </p>
          </div>

          {/* Action Hub */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onStartBrowseChapters}
              className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>📖 অধ্যায় পাঠ শুরু করুন</span>
            </button>
            <button
              type="button"
              onClick={onStartPractice}
              className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm flex items-center gap-2 border border-white/15 transition-all cursor-pointer"
            >
              <ListChecks className="w-4 h-4" />
              <span>⚡ প্র্যাকটিস এরিনা</span>
            </button>
            <button
              type="button"
              onClick={onStartModelTest}
              className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm flex items-center gap-2 border border-white/15 transition-all cursor-pointer"
            >
              <Timer className="w-4 h-4" />
              <span>⏱️ মডেল টেস্ট</span>
            </button>
          </div>
        </div>
      </div>

      {/* ================================================================ */}
      {/* 3. REAL API STATISTICS GRID */}
      {/* ================================================================ */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Stat 1: Chapters */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs text-center space-y-1">
          <span className="text-2xl sm:text-3xl font-black font-mono text-slate-900 dark:text-white block">
            {isBangla ? toBengaliNum(totalChapters) : totalChapters}
          </span>
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            মোট অধ্যায়
          </span>
        </div>

        {/* Stat 2: Topics */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs text-center space-y-1">
          <span className="text-2xl sm:text-3xl font-black font-mono text-indigo-600 dark:text-indigo-400 block">
            {isBangla ? toBengaliNum(totalTopics) : totalTopics}
          </span>
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            মোট টপিক
          </span>
        </div>

        {/* Stat 3: MCQ Practice */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs text-center space-y-1">
          <span className="text-2xl sm:text-3xl font-black font-mono text-blue-600 dark:text-blue-400 block">
            {isBangla ? toBengaliNum(totalQuestions) : totalQuestions}
          </span>
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            MCQ প্র্যাকটিস
          </span>
        </div>

        {/* Stat 4: Model Tests */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs text-center space-y-1">
          <span className="text-2xl sm:text-3xl font-black font-mono text-emerald-600 dark:text-emerald-400 block">
            {isBangla ? toBengaliNum(totalModelTests) : totalModelTests}
          </span>
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            মডেল টেস্ট
          </span>
        </div>

        {/* Stat 5: Progress */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs text-center space-y-1">
          <span className="text-2xl sm:text-3xl font-black font-mono text-teal-600 dark:text-teal-400 block">
            {isBangla ? toBengaliNum(progressPercentage) : progressPercentage}%
          </span>
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            সম্পন্ন অগ্রগতি
          </span>
        </div>

        {/* Stat 6: Bookmarks */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs text-center space-y-1">
          <span className="text-2xl sm:text-3xl font-black font-mono text-amber-500 block">
            {isBangla ? toBengaliNum(totalBookmarks) : totalBookmarks}
          </span>
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            বুকমার্ক
          </span>
        </div>
      </div>

      {/* ================================================================ */}
      {/* 4. CHAPTERS QUICK BROWSE GRID */}
      {/* ================================================================ */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              {isBangla ? 'বাংলা ব্যাকরণের ৪০টি অধ্যায়' : 'English Grammar Chapters (23 Chapters)'}
            </h2>
            <p className="text-xs text-slate-500">
              যেকোনো অধ্যায়ে ক্লিক করে বিস্তারিত নিয়মাবলী ও টপিকসমূহ পড়ুন
            </p>
          </div>

          <button
            type="button"
            onClick={onStartRandomQuiz}
            className="px-4 py-2 rounded-xl bg-violet-50 dark:bg-violet-950/60 hover:bg-violet-100 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-800 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>র‍্যান্ডম কুইজ দিন</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {chapters.map((chap) => {
            const chapNo = isBangla
              ? toBengaliNum(String(chap.chapterNo || chap.id).padStart(2, '0'))
              : String(chap.chapterNo || chap.id).padStart(2, '0');

            return (
              <div
                key={chap.id}
                onClick={() => onSelectChapter(chap)}
                className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-emerald-500/60 dark:hover:border-emerald-500/60 transition-all shadow-xs hover:shadow-md cursor-pointer group flex flex-col justify-between space-y-2"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="w-7 h-7 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono font-bold text-xs flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                      {chapNo}
                    </span>
                    {chap.category && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
                        {chap.category}
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-1">
                    {chap.titleBn}
                  </h3>

                  {chap.titleEn && (
                    <p className="text-[11px] font-english text-slate-400 truncate">
                      {chap.titleEn}
                    </p>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 font-medium">
                  <span>অধ্যায় খুলুন</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
