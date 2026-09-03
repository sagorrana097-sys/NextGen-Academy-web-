import React from 'react';
import {
  BookOpen, Layers, CheckCircle2, Bookmark, ArrowRight,
  Shuffle, ListChecks, Award, Sparkles, Clock, AlertCircle
} from 'lucide-react';

function toBengaliNum(n) {
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  const padded = String(n).padStart(2, '0');
  return padded.replace(/[0-9]/g, d => bnDigits[Number(d)]);
}

export default function GrammarChapterView({
  chapter,
  topics = [],
  completedTopicIds = [],
  bookmarkedTopicIds = [],
  onSelectTopic,
  onStartChapterQuiz,
  onStartChapterPractice,
  subject = 'BANGLA'
}) {
  if (!chapter) {
    return (
      <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
        <p className="text-sm text-slate-500">কোনো অধ্যায় নির্বাচন করা হয়নি।</p>
      </div>
    );
  }

  const isBangla = subject === 'BANGLA';
  const chapterNumberLabel = isBangla
    ? `অধ্যায় ${toBengaliNum(chapter.chapterNo || chapter.id)}`
    : `Chapter ${String(chapter.chapterNo || chapter.id).padStart(2, '0')}`;

  const completedCount = topics.filter(t => completedTopicIds.includes(t.id)).length;
  const progressPercent = topics.length > 0 ? Math.round((completedCount / topics.length) * 100) : 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* ================================================================ */}
      {/* 1. CHAPTER HERO CARD */}
      {/* ================================================================ */}
      <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-6 sm:p-8 text-white border border-indigo-500/30 shadow-2xl relative overflow-hidden">
        {/* Background Ambient Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-black uppercase tracking-wider">
                {chapterNumberLabel}
              </span>
              {chapter.category && (
                <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold">
                  {chapter.category}
                </span>
              )}
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 flex-wrap">
              {onStartChapterPractice && (
                <button
                  type="button"
                  onClick={onStartChapterPractice}
                  className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                >
                  <ListChecks className="w-3.5 h-3.5" />
                  <span>প্র্যাকটিস করুন</span>
                </button>
              )}
              {onStartChapterQuiz && (
                <button
                  type="button"
                  onClick={onStartChapterQuiz}
                  className="px-3.5 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                >
                  <Shuffle className="w-3.5 h-3.5" />
                  <span>অধ্যায় কুইজ</span>
                </button>
              )}
            </div>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
              {chapter.titleBn}
            </h1>
            {chapter.titleEn && (
              <p className="text-sm sm:text-base font-english text-indigo-300 mt-1 font-medium">
                {chapter.titleEn}
              </p>
            )}
          </div>

          {chapter.descriptionBn && (
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              {chapter.descriptionBn}
            </p>
          )}

          {/* Progress Bar (if topics exist) */}
          {topics.length > 0 && (
            <div className="pt-2">
              <div className="flex items-center justify-between text-xs text-slate-300 mb-1.5">
                <span className="font-bold">টপিক সমাপ্তি অগ্রগতি:</span>
                <span className="font-mono font-bold text-emerald-400">
                  {completedCount} / {topics.length} ({progressPercent}%)
                </span>
              </div>
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ================================================================ */}
      {/* 2. TOPICS LIST SECTION */}
      {/* ================================================================ */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white">
                অধ্যায়ের অন্তর্ভুক্ত টপিকসমূহ (Topics)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {topics.length > 0
                  ? `মোট ${isBangla ? toBengaliNum(topics.length) : topics.length}টি বিস্তারিত টপিক`
                  : 'টপিক তালিকা'}
              </p>
            </div>
          </div>
        </div>

        {/* When topics exist */}
        {topics.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {topics.map((topic, idx) => {
              const isCompleted = completedTopicIds.includes(topic.id);
              const isBookmarked = bookmarkedTopicIds.includes(topic.id);

              return (
                <div
                  key={topic.id || topic.slug || idx}
                  onClick={() => onSelectTopic(topic)}
                  className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 transition-all shadow-xs hover:shadow-md cursor-pointer group flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-mono font-bold text-slate-600 dark:text-slate-400">
                        {topic.topicNo || `টপিক ${idx + 1}`}
                      </span>

                      <div className="flex items-center gap-1.5">
                        {isCompleted && (
                          <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>সম্পন্ন</span>
                          </span>
                        )}
                        {isBookmarked && (
                          <Bookmark className="w-3.5 h-3.5 text-amber-500 fill-current" />
                        )}
                        <span className="px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold uppercase">
                          {topic.difficulty || 'BEGINNER'}
                        </span>
                      </div>
                    </div>

                    <h3 className="text-base font-black text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {topic.titleBn}
                    </h3>

                    {topic.titleEn && (
                      <p className="text-xs font-english text-slate-500 dark:text-slate-400">
                        {topic.titleEn}
                      </p>
                    )}

                    {topic.summaryBn && (
                      <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                        {topic.summaryBn}
                      </p>
                    )}
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-indigo-600 dark:text-indigo-400 font-bold group-hover:translate-x-0.5 transition-transform">
                    <span>টপিক বিস্তারিত পড়ুন</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Proper Empty State when Topics are not yet populated */
          <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs text-center space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 mx-auto flex items-center justify-center">
              <BookOpen className="w-8 h-8" />
            </div>

            <div className="space-y-1 max-w-md mx-auto">
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                এই অধ্যায়ের পাঠ্য কন্টেন্ট প্রস্তুত হচ্ছে
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                আমাদের ব্যাকরণ বিশেষজ্ঞ প্যানেল {chapter.titleBn}-এর সম্পূর্ণ নিয়মাবলী, সূত্র, ব্যতিক্রম ও বোর্ড প্রশ্ন সংকলন করছেন। শীঘ্রই বিস্তারিত উন্মুক্ত করা হবে।
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              {onStartChapterPractice && (
                <button
                  type="button"
                  onClick={onStartChapterPractice}
                  className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
                >
                  ⚡ প্র্যাকটিস এরিনায় প্রশ্ন খুঁজুন
                </button>
              )}
              {onStartChapterQuiz && (
                <button
                  type="button"
                  onClick={onStartChapterQuiz}
                  className="px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer"
                >
                  🎲 র‍্যান্ডম কুইজ দিন
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
