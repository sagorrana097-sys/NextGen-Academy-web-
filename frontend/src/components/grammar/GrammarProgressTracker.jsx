import React from 'react';
import {
  Award, CheckCircle2, Bookmark, Flame, TrendingUp, BookOpen, Clock
} from 'lucide-react';

export default function GrammarProgressTracker({
  chapters = [],
  completedTopicIds = [],
  bookmarkedTopicIds = [],
  onSelectTopic
}) {
  const totalEstimatedTopics = chapters.reduce((sum, c) => sum + (c.estimatedTopicsCount || 4), 0);
  const completedCount = completedTopicIds.length;
  const progressPercent = Math.min(100, Math.round((completedCount / (totalEstimatedTopics || 100)) * 100));

  return (
    <div className="space-y-6">
      {/* Top Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs text-center">
          <span className="text-3xl font-black text-slate-900 dark:text-white font-mono block">
            {chapters.length}
          </span>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1 block">
            মোট চ্যাপ্টার
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs text-center">
          <span className="text-3xl font-black text-emerald-600 font-mono block">
            {completedCount}
          </span>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1 block">
            সম্পন্ন করা টপিক
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs text-center">
          <span className="text-3xl font-black text-amber-500 font-mono block">
            {bookmarkedTopicIds.length}
          </span>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1 block">
            সংরক্ষিত বুকমার্ক
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs text-center">
          <span className="text-3xl font-black text-indigo-600 font-mono block">
            {progressPercent}%
          </span>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1 block">
            সিলেবাস অগ্রগতি
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex items-center justify-between text-xs font-black">
          <span className="text-slate-900 dark:text-white">সার্বিক গ্রামার কমপ্লিশন ট্র্যাক</span>
          <span className="text-emerald-600 font-mono">{progressPercent}% সম্পন্ন</span>
        </div>
        <div className="w-full h-3.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
}
