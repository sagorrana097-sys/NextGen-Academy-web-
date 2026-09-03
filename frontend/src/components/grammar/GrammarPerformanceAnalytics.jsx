import React, { useState, useEffect } from 'react';
import {
  TrendingUp, Award, CheckCircle2, AlertTriangle, Clock,
  BarChart3, Calendar, ArrowRight, BookOpen, Layers, Flame
} from 'lucide-react';
import { grammarAPI } from '../../services/api';

export default function GrammarPerformanceAnalytics({ onReviewSubmission, onStartQuiz, subject = 'ENGLISH' }) {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    grammarAPI.getMyPerformanceAnalytics({ subject }).then(res => {
      if (isMounted && res?.success && res.data) {
        setAnalytics(res.data);
      }
    }).catch(() => {}).finally(() => {
      if (isMounted) setLoading(false);
    });

    return () => { isMounted = false; };
  }, [subject]);


  if (loading) {
    return <div className="p-12 text-center text-slate-400 text-xs">পারফরম্যান্স ডাটা লোড হচ্ছে...</div>;
  }

  const {
    totalAttempted = 0,
    averageAccuracy = 0,
    highestPercentage = 0,
    chapterStrengths = [],
    chapterWeaknesses = [],
    allChapterPerformance = [],
    recentSubmissions = []
  } = analytics || {};

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2">
          <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-indigo-500" />
            <span>মোট পরীক্ষা দেওয়া হয়েছে</span>
          </span>
          <span className="block text-3xl font-black font-mono text-slate-900 dark:text-white">
            {totalAttempted} টি
          </span>
          <span className="text-[11px] text-slate-400">কুইজ ও মডেল টেস্ট</span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2">
          <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-emerald-500" />
            <span>গড় নির্ভুলতা (Accuracy)</span>
          </span>
          <span className="block text-3xl font-black font-mono text-emerald-600 dark:text-emerald-400">
            {averageAccuracy}%
          </span>
          <span className="text-[11px] text-slate-400">সকল সাবমিশন মিলিয়ে</span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2">
          <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-500" />
            <span>সর্বোচ্চ প্রাপ্ত স্কোর</span>
          </span>
          <span className="block text-3xl font-black font-mono text-amber-500">
            {highestPercentage}%
          </span>
          <span className="text-[11px] text-slate-400">ব্যক্তিগত সেরা রেকর্ড</span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2">
          <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-rose-500" />
            <span>দুর্বল অধ্যায়সমূহ</span>
          </span>
          <span className="block text-3xl font-black font-mono text-rose-500">
            {chapterWeaknesses.length} টি
          </span>
          <span className="text-[11px] text-slate-400">পুনরায় অনুশীলন দরকার</span>
        </div>
      </div>

      {/* Strengths & Weaknesses Split Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>আপনার শক্তিশালী বিষয়সমূহ (Strengths ≥ 70%)</span>
          </h3>

          {chapterStrengths.length === 0 ? (
            <p className="text-xs text-slate-400 p-3">এখনো কোনো স্ট্রং অধ্যায় নির্ধারিত হয়নি। আরও টেস্ট দিন!</p>
          ) : (
            <div className="space-y-3">
              {chapterStrengths.map(c => (
                <div key={c.chapterId} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      Ch {c.chapterId} — {c.titleBn}
                    </span>
                    <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {c.accuracy}%
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${c.accuracy}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Weaknesses Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-500" />
            <span>যেসব অধ্যায়ে উন্নতি প্রয়োজন (Weaknesses &lt; 50%)</span>
          </h3>

          {chapterWeaknesses.length === 0 ? (
            <p className="text-xs text-slate-400 p-3">চমৎকার! আপনার কোনো আশঙ্কাজনক দুর্বল অধ্যায় নেই।</p>
          ) : (
            <div className="space-y-3">
              {chapterWeaknesses.map(c => (
                <div key={c.chapterId} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      Ch {c.chapterId} — {c.titleBn}
                    </span>
                    <span className="font-mono font-bold text-rose-500">
                      {c.accuracy}%
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div className="h-full bg-rose-500 rounded-full" style={{ width: `${c.accuracy}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Test History */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              সাম্প্রতিক পরীক্ষার ইতিহাস (Recent Submissions)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">আপনার বিগত টেস্ট ও কুইজের রেকর্ড এবং ফলাফল পর্যালোচনা</p>
          </div>

          {onStartQuiz && (
            <button
              type="button"
              onClick={onStartQuiz}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer transition-colors"
            >
              নতুন পরীক্ষা দিন →
            </button>
          )}
        </div>

        {recentSubmissions.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            এখনো কোনো পরীক্ষার ইতিহাস সংরক্ষিত নেই।
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {recentSubmissions.map((sub) => (
              <div key={sub.id} className="py-3.5 flex items-center justify-between gap-4 flex-wrap">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      sub.passed
                        ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                        : 'bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
                    }`}>
                      {sub.passed ? 'PASSED' : 'FAILED'}
                    </span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      Submission #{sub.id}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    {new Date(sub.submittedAt).toLocaleDateString('bn-BD', {
                      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right text-xs">
                    <span className="font-mono font-black text-slate-900 dark:text-white block">
                      {sub.score} / {sub.totalQuestions} ({sub.percentage}%)
                    </span>
                    <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                      গ্রেড: {sub.grade}
                    </span>
                  </div>

                  {onReviewSubmission && (
                    <button
                      type="button"
                      onClick={() => onReviewSubmission(sub.id)}
                      className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-indigo-400 text-xs font-bold text-slate-700 dark:text-slate-200 cursor-pointer transition-colors"
                    >
                      রিভিউ দেখুন
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
