import React, { useState } from 'react';
import {
  BookOpen, Sparkles, Layers, Award, CheckCircle2, Bookmark,
  Download, ArrowLeft, ArrowRight, Volume2, ShieldCheck, AlertCircle,
  HelpCircle, ChevronRight, FileText, Check, Share2, Terminal, AlertTriangle,
  ShieldAlert, ListChecks, Edit3
} from 'lucide-react';
import GrammarRules from './GrammarRules';
import GrammarFormula from './GrammarFormula';
import GrammarExamples from './GrammarExamples';
import GrammarExceptions from './GrammarExceptions';
import GrammarMistakes from './GrammarMistakes';
import GrammarMCQ from './GrammarMCQ';
import GrammarPractice from './GrammarPractice';
import GrammarBoardQuestions from './GrammarBoardQuestions';
import GrammarNavigation from './GrammarNavigation';

export default function GrammarTopicPage({
  topic,
  chapter,
  isCompleted,
  onToggleComplete,
  isBookmarked,
  onToggleBookmark,
  hasPrevious,
  hasNext,
  onPrevious,
  onNext,
  onOpenSidebar
}) {
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

  if (!topic) {
    return (
      <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
        <p className="text-sm text-slate-500">কোনো টপিক নির্বাচন করা হয়নি।</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* -------------------------------------------------------------------- */}
      {/* TOPIC HEADER CARD */}
      {/* -------------------------------------------------------------------- */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950/90 to-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-indigo-500/30 shadow-2xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-black uppercase tracking-wider">
              {chapter?.titleBn || 'অধ্যায়'} • টপিক {topic.topicNo || '০১'}
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 text-[10px] font-bold">
              {topic.difficulty || 'BEGINNER'}
            </span>
          </div>

          {/* Quick Mobile Action Buttons */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              type="button"
              onClick={onToggleComplete}
              className={`p-2 rounded-xl text-xs font-bold transition-all ${
                isCompleted ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300'
              }`}
              title="Mark Complete"
            >
              <CheckCircle2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onToggleBookmark}
              className={`p-2 rounded-xl text-xs font-bold transition-all ${
                isBookmarked ? 'bg-amber-500 text-white' : 'bg-slate-800 text-slate-300'
              }`}
              title="Bookmark"
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <span>{topic.titleBn}</span>
            <span className="text-sm sm:text-lg font-english font-normal text-indigo-300">
              ({topic.titleEn})
            </span>
          </h1>
          {topic.summaryBn && (
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              {topic.summaryBn}
            </p>
          )}
        </div>

        {/* Teacher Golden Tips (If present) */}
        {topic.teacherGoldenTips && (
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold text-amber-300">শিক্ষকের স্পেশাল টিপস:</strong>{' '}
              {topic.teacherGoldenTips}
            </div>
          </div>
        )}
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* 01 & 02 — DEFINITION & EASY EXPLANATION */}
      {/* -------------------------------------------------------------------- */}
      <section id="section-def" className="rounded-3xl bg-white dark:bg-slate-900 p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-black text-sm sm:text-base text-slate-900 dark:text-white">
              ০১ ও ০২ — সংজ্ঞা ও সহজ ভাষায় ব্যাখ্যা (Definition & Explanation)
            </h3>
            <span className="text-[11px] text-slate-400">মৌলিক ব্যাকরণিক ধারণা</span>
          </div>
        </div>

        {/* English Definition with TTS */}
        {topic.definitionEn && (
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 flex items-start justify-between gap-3">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                English Definition:
              </span>
              <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white font-english italic leading-relaxed">
                "{topic.definitionEn}"
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleSpeak(topic.definitionEn)}
              className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-indigo-600 cursor-pointer shadow-xs"
              title="Listen English Definition"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Bengali Definition */}
        {topic.definitionBn && (
          <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed space-y-1">
            <strong className="font-bold text-slate-900 dark:text-white">বাংলা সংজ্ঞা:</strong>{' '}
            <span>{topic.definitionBn}</span>
          </div>
        )}

        {/* Easy Explanation */}
        {topic.explanationBn && (
          <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed space-y-1">
            <strong className="font-black text-indigo-900 dark:text-indigo-300">সহজ ভাষায় ব্যাখ্যা:</strong>{' '}
            <span>{topic.explanationBn}</span>
          </div>
        )}
      </section>

      {/* -------------------------------------------------------------------- */}
      {/* 04 — FORMULA / STRUCTURE */}
      {/* -------------------------------------------------------------------- */}
      <section id="section-formula">
        <GrammarFormula
          formulas={topic.formulas || []}
          mainFormula={topic.mainFormula}
        />
      </section>

      {/* -------------------------------------------------------------------- */}
      {/* 03 — COMPLETE RULES */}
      {/* -------------------------------------------------------------------- */}
      <section id="section-rules">
        <GrammarRules
          rules={topic.rules || []}
          onSpeak={handleSpeak}
        />
      </section>

      {/* -------------------------------------------------------------------- */}
      {/* 05 & 06 — EXAMPLES & BANGLA MEANING */}
      {/* -------------------------------------------------------------------- */}
      <section id="section-examples">
        <GrammarExamples
          examples={topic.examples || []}
          onSpeak={handleSpeak}
        />
      </section>

      {/* -------------------------------------------------------------------- */}
      {/* 07 — EXCEPTIONS & TRAPS */}
      {/* -------------------------------------------------------------------- */}
      {topic.exceptions && topic.exceptions.length > 0 && (
        <section id="section-exceptions">
          <GrammarExceptions exceptions={topic.exceptions} />
        </section>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* 08 — COMMON MISTAKES */}
      {/* -------------------------------------------------------------------- */}
      {topic.commonMistakes && topic.commonMistakes.length > 0 && (
        <section id="section-mistakes">
          <GrammarMistakes mistakes={topic.commonMistakes} />
        </section>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* 09 — INTERACTIVE MCQ DRILLS */}
      {/* -------------------------------------------------------------------- */}
      <section id="section-mcq">
        <GrammarMCQ
          mcqs={topic.mcqs || []}
          topicId={topic.id}
        />
      </section>

      {/* -------------------------------------------------------------------- */}
      {/* 10 — WRITTEN PRACTICE */}
      {/* -------------------------------------------------------------------- */}
      {topic.writtenPractice && topic.writtenPractice.length > 0 && (
        <section id="section-practice">
          <GrammarPractice writtenDrills={topic.writtenPractice} />
        </section>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* 11 & 12 — BOARD QUESTIONS & EXPLANATIONS */}
      {/* -------------------------------------------------------------------- */}
      {topic.boardQuestions && topic.boardQuestions.length > 0 && (
        <section id="section-board">
          <GrammarBoardQuestions boardQuestions={topic.boardQuestions} />
        </section>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* 13 — PREVIOUS / NEXT NAVIGATION */}
      {/* -------------------------------------------------------------------- */}
      <section id="section-navigation">
        <GrammarNavigation
          hasPrevious={hasPrevious}
          hasNext={hasNext}
          onPrevious={onPrevious}
          onNext={onNext}
        />
      </section>
    </div>
  );
}
