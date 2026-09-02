import React, { useState } from 'react';
import {
  BookOpen, Sparkles, Layers, Award, CheckCircle2, Bookmark,
  Download, ArrowLeft, ArrowRight, Volume2, ShieldCheck, AlertCircle,
  HelpCircle, ChevronRight, FileText, Check, Share2
} from 'lucide-react';
import { exportBrandedGraphic } from '../../utils/exportBrandedGraphic';

export default function GrammarTopicDetailView({
  topic,
  onBackToChapters,
  isCompleted,
  onToggleComplete,
  isBookmarked,
  onToggleBookmark,
  onOpenPractice,
  onOpenBoardQuestions,
  onPreviousTopic,
  onNextTopic
}) {
  const [isExporting, setIsExporting] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [speakingText, setSpeakingText] = useState('');

  const handleSpeak = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      setSpeakingText(text);
      setIsPlayingAudio(true);
      utterance.onend = () => {
        setIsPlayingAudio(false);
        setSpeakingText('');
      };
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleExportChart = async () => {
    const el = document.getElementById('grammar-rule-deck-printable');
    if (!el) return;
    setIsExporting(true);
    try {
      await exportBrandedGraphic(el, {
        fileName: `NextGen-Grammar-${topic.slug || 'Topic'}`,
        cardTitle: topic.titleEn,
        scale: 2
      });
    } catch (err) {
      console.error('Export error:', err);
    } finally {
      setIsExporting(false);
    }
  };

  if (!topic) return null;

  return (
    <div className="space-y-6">
      {/* Top Action & Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <button
          type="button"
          onClick={onBackToChapters}
          className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>সকল অধ্যায়</span>
        </button>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Complete Toggle */}
          <button
            type="button"
            onClick={onToggleComplete}
            className={`px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
              isCompleted
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isCompleted ? 'সম্পন্ন হয়েছে ✓' : 'পড়া শেষ হিসেবে মার্ক করুন'}</span>
          </button>

          {/* Bookmark Toggle */}
          <button
            type="button"
            onClick={onToggleBookmark}
            className={`p-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              isBookmarked
                ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
            title={isBookmarked ? 'বুকমার্ক সরানো হয়েছে' : 'বুকমার্ক করুন'}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
          </button>

          {/* Export Chart Button */}
          <button
            type="button"
            onClick={handleExportChart}
            disabled={isExporting}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-black shadow-md flex items-center gap-1.5 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>রুল চার্ট ডাউনলোড</span>
          </button>
        </div>
      </div>

      {/* Main Topic Header Card */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950/80 to-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-indigo-500/30 shadow-2xl relative overflow-hidden space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-black uppercase tracking-wider">
            টপিক {topic.topicNo}
          </span>
          <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-[11px] font-bold">
            {topic.classLevel}
          </span>
          <span className="px-2.5 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold">
            {topic.difficulty}
          </span>
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {topic.titleBn}
          </h1>
          <h2 className="text-sm sm:text-base font-bold text-slate-400 font-english mt-1">
            {topic.titleEn}
          </h2>
        </div>

        {topic.summaryBn && (
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-4xl">
            {topic.summaryBn}
          </p>
        )}

        {/* Quick Tab Jump Buttons */}
        <div className="pt-2 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onOpenPractice}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black shadow-lg flex items-center gap-1.5 transition-all"
          >
            <span>✍️ MCQ ও লিখিত প্র্যাকটিস ({topic.mcqs?.length || 0})</span>
          </button>
          <button
            type="button"
            onClick={onOpenBoardQuestions}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-black border border-slate-700 flex items-center gap-1.5 transition-all"
          >
            <span>🏛️ বোর্ড প্রশ্ন ও সমাধান ({topic.boardQuestions?.length || 0})</span>
          </button>
        </div>
      </div>

      {/* Definition & Easy Explanation Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Definition Box */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
          <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-emerald-600" />
            <span>সংজ্ঞা (Definition):</span>
          </h3>
          <div className="p-3.5 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 space-y-2">
            <p className="text-xs text-slate-800 dark:text-slate-200 font-semibold font-english italic leading-relaxed">
              "{topic.definitionEn}"
            </p>
            <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed pt-2 border-t border-slate-200/50 dark:border-slate-800">
              বাংলা: {topic.definitionBn}
            </p>
          </div>
        </div>

        {/* Easy Explanation */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
          <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>সহজ ভাষায় ব্যাখ্যা (Easy Explanation):</span>
          </h3>
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
            {topic.explanationBn}
          </p>
        </div>
      </div>

      {/* Teacher's Golden Tips */}
      {topic.teacherGoldenTips && (
        <div className="p-5 rounded-3xl bg-gradient-to-r from-amber-500/10 via-amber-500/15 to-amber-500/10 dark:from-amber-950/40 dark:via-amber-900/30 dark:to-amber-950/40 border border-amber-500/40 text-xs text-amber-900 dark:text-amber-200 space-y-1.5 shadow-sm">
          <div className="flex items-center gap-2 font-black text-amber-800 dark:text-amber-300 text-sm">
            <Award className="w-4 h-4 text-amber-500 animate-pulse" />
            <span>শিক্ষকের বিশেষ দিকনির্দেশনা ও গোল্ডেন শর্টকাট:</span>
          </div>
          <p className="font-semibold leading-relaxed pl-6">
            {topic.teacherGoldenTips}
          </p>
        </div>
      )}

      {/* Rules & Structure Deck (Printable / Exportable) */}
      <div id="grammar-rule-deck-printable" className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-slate-800">
          <h3 className="font-black text-base text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-600" />
            <span>সম্পূর্ণ নিয়ম ও গঠনকাঠামো (Rules & Formulas)</span>
          </h3>
          <span className="text-xs font-bold text-slate-400">
            {topic.rules?.length || 0}টি নিয়ম
          </span>
        </div>

        <div className="space-y-4">
          {topic.rules?.map((rule, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200/80 dark:border-slate-800 space-y-3 hover:border-indigo-400 transition-colors"
            >
              <div className="flex items-center justify-between gap-2">
                <h4 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center font-mono font-bold">
                    {idx + 1}
                  </span>
                  <span>{rule.nameBn}</span>
                </h4>
                <span className="text-xs font-semibold text-slate-400 font-english">
                  {rule.nameEn}
                </span>
              </div>

              {/* Formula Box */}
              {rule.formula && (
                <div className="p-3 rounded-xl bg-indigo-950 text-indigo-200 font-mono text-xs font-black border border-indigo-500/30 flex items-center justify-between gap-2 overflow-x-auto">
                  <span>{rule.formula}</span>
                  {rule.shortcutTrick && (
                    <span className="px-2 py-0.5 rounded bg-indigo-800 text-[10px] text-amber-300 font-sans font-bold whitespace-nowrap">
                      💡 {rule.shortcutTrick}
                    </span>
                  )}
                </div>
              )}

              {rule.descriptionBn && (
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {rule.descriptionBn}
                </p>
              )}

              {/* Multilingual Examples */}
              {rule.examples?.length > 0 && (
                <div className="space-y-2 pt-1">
                  <span className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                    বাস্তব উদাহরণসমূহ (Real Examples):
                  </span>
                  <div className="grid grid-cols-1 gap-2">
                    {rule.examples.map((ex, exIdx) => (
                      <div
                        key={exIdx}
                        className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 flex items-start justify-between gap-3"
                      >
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-slate-900 dark:text-white font-english">
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
                        <button
                          type="button"
                          onClick={() => handleSpeak(ex.en)}
                          className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-indigo-100 text-slate-500 hover:text-indigo-600 transition-colors flex-shrink-0"
                          title="উচ্চারণ শুনুন (Pronounce)"
                        >
                          <Volume2 className={`w-3.5 h-3.5 ${isPlayingAudio && speakingText === ex.en ? 'text-emerald-500 animate-pulse' : ''}`} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Exceptions & Common Mistakes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Exceptions Box */}
        {topic.exceptions?.length > 0 && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
            <h3 className="font-black text-sm text-rose-600 dark:text-rose-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span>ব্যতিক্রমী ক্ষেত্র ও ফাঁদ (Exceptions & Traps):</span>
            </h3>
            <div className="space-y-2">
              {topic.exceptions.map((exc, eIdx) => (
                <div key={eIdx} className="p-3.5 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 text-xs space-y-1">
                  <h5 className="font-bold text-rose-900 dark:text-rose-300">{exc.ruleName}</h5>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{exc.exceptionText}</p>
                  {exc.exampleEn && (
                    <p className="text-xs font-semibold text-rose-800 dark:text-rose-300 font-english pt-1">
                      e.g. "{exc.exampleEn}" ({exc.exampleBn})
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Common Mistakes */}
        {topic.commonMistakes?.length > 0 && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
            <h3 className="font-black text-sm text-amber-600 dark:text-amber-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              <span>সাধারণ ভুল বনাম সঠিক রূপ (Common Mistakes):</span>
            </h3>
            <div className="space-y-2">
              {topic.commonMistakes.map((mis, mIdx) => (
                <div key={mIdx} className="p-3.5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 text-xs space-y-1">
                  <p className="text-rose-600 font-bold line-through">❌ {mis.mistake}</p>
                  <p className="text-emerald-700 dark:text-emerald-400 font-bold">✓ {mis.correct}</p>
                  <p className="text-slate-600 dark:text-slate-400 text-[11px] pt-0.5">💡 {mis.reasonBn}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Previous / Next Navigation */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200/80 dark:border-slate-800">
        <button
          type="button"
          onClick={onPreviousTopic}
          className="px-4 py-2 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>পূর্ববর্তী টপিক</span>
        </button>

        <button
          type="button"
          onClick={onNextTopic}
          className="px-4 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all"
        >
          <span>পরবর্তী টপিক</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
