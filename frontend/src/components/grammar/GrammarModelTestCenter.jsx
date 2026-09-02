import React, { useState, useEffect } from 'react';
import {
  Clock, Award, CheckCircle2, AlertCircle, RefreshCw, HelpCircle,
  Timer, ChevronRight, Check, X, ShieldCheck, Flame, BookOpen,
  ArrowRight, Filter, Play
} from 'lucide-react';
import { grammarAPI } from '../../services/api';

export default function GrammarModelTestCenter({ onStartTest }) {
  const [modelTests, setModelTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterDifficulty, setFilterDifficulty] = useState('ALL');

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    grammarAPI.getModelTests().then(res => {
      if (isMounted && res?.success && Array.isArray(res.data)) {
        setModelTests(res.data);
      }
    }).catch(() => {}).finally(() => {
      if (isMounted) setLoading(false);
    });

    return () => { isMounted = false; };
  }, []);

  const filteredTests = modelTests.filter(t => {
    if (filterDifficulty !== 'ALL' && t.difficulty !== filterDifficulty) return false;
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Hero Header */}
      <div className="rounded-3xl bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 p-6 sm:p-8 text-white border border-indigo-800/60 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-white/10 text-amber-300 border border-white/10">
            <Award className="w-3.5 h-3.5" />
            <span>Official SSC & Board Model Tests</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            ইংলিশ গ্রামার পূর্ণাঙ্গ মডেল টেস্ট কেন্দ্র
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            সময়সীমা ও নেগেটিভ মার্কিং সহ রিয়েল বোর্ড পরীক্ষার পরিবেশে প্র্যাকটিস করুন এবং তাৎক্ষণিক রেজাল্ট ও ব্যাখ্যা পান।
          </p>
        </div>

        <div className="flex items-center gap-4 text-center">
          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
            <span className="block text-2xl sm:text-3xl font-black font-mono text-cyan-300">
              {modelTests.length}টি
            </span>
            <span className="text-[11px] font-bold text-slate-300">প্রকাশিত টেস্ট</span>
          </div>
          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
            <span className="block text-2xl sm:text-3xl font-black font-mono text-amber-300">
              ১০০%
            </span>
            <span className="text-[11px] font-bold text-slate-300">বোর্ড সিলেবাস</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between gap-4 flex-wrap pb-2 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500">ফিল্টার:</span>
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold">
            {['ALL', 'MEDIUM', 'BOARD_STANDARD', 'HARD'].map(lvl => (
              <button
                key={lvl}
                type="button"
                onClick={() => setFilterDifficulty(lvl)}
                className={`px-3 py-1 rounded-lg cursor-pointer transition-colors ${
                  filterDifficulty === lvl
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {lvl === 'ALL' ? 'সকল টেস্ট' : (lvl === 'BOARD_STANDARD' ? 'বোর্ড স্ট্যান্ডার্ড' : lvl)}
              </button>
            ))}
          </div>
        </div>

        <span className="text-xs font-semibold text-slate-400">
          মোট {filteredTests.length}টি টেস্ট উপলব্ধ
        </span>
      </div>

      {/* Tests Grid */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 text-xs">মডেল টেস্ট লোড হচ্ছে...</div>
      ) : filteredTests.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-slate-400 text-sm font-medium">
          কোনো মডেল টেস্ট পাওয়া যায়নি।
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTests.map((test) => (
            <div
              key={test.id}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 shadow-sm transition-all hover:shadow-md flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                    {test.targetClass || 'SSC Exam'}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {test.negativeMarkingEnabled && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900">
                        নেগেটিভ: -{test.negativeMarkPerQuestion || 0.25}
                      </span>
                    )}
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {test.difficulty}
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="font-black text-base sm:text-lg text-slate-900 dark:text-white leading-snug">
                    {test.titleBn}
                  </h3>
                  <p className="text-xs text-slate-400 font-medium font-english">
                    {test.titleEn}
                  </p>
                </div>

                {test.descriptionBn && (
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-bangla">
                    {test.descriptionBn}
                  </p>
                )}
              </div>

              {/* Bottom stats & Launch */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-indigo-500" />
                    <span>{test.durationMinutes} মিনিট</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-amber-500" />
                    <span>পূর্ণমান: {test.totalMarks}</span>
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => onStartTest && onStartTest(test.id)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-600/20 flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>শুরু করুন</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
