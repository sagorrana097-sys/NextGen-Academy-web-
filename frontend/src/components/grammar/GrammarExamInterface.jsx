import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Clock, AlertCircle, Bookmark, CheckCircle2, ChevronLeft, ChevronRight,
  Send, RotateCcw, Flag, Layers, Award, Sparkles, Check, HelpCircle,
  Menu, X
} from 'lucide-react';

export default function GrammarExamInterface({
  examTitleEn = 'Grammar Examination',
  examTitleBn = 'গ্রামার পরীক্ষা',
  totalAllowedSeconds = 1200,
  initialRemainingSeconds = 1200,
  questions = [],
  initialAnswers = {},
  initialMarked = [],
  initialIndex = 0,
  onSaveProgress,
  onSubmitExam,
  onCancelExam,
  isSubmitting = false
}) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [answers, setAnswers] = useState(initialAnswers);
  const [markedQuestions, setMarkedQuestions] = useState(new Set(initialMarked));
  const [timeLeft, setTimeLeft] = useState(initialRemainingSeconds);
  const [isPaletteOpenMobile, setIsPaletteOpenMobile] = useState(false);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);

  const timerRef = useRef(null);
  const answersRef = useRef(answers);
  answersRef.current = answers;

  // Countdown Timer
  useEffect(() => {
    if (timeLeft <= 0) {
      handleFinalSubmit();
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleFinalSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, []);

  // Auto-save progress every 10 seconds or when answers change
  useEffect(() => {
    if (onSaveProgress) {
      const timer = setTimeout(() => {
        onSaveProgress({
          answers,
          markedQuestions: Array.from(markedQuestions),
          currentQuestionIndex: currentIndex
        });
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [answers, markedQuestions, currentIndex, onSaveProgress]);

  const handleSelectOption = (qId, optionIdx) => {
    setAnswers(prev => ({
      ...prev,
      [qId]: optionIdx
    }));
  };

  const handleClearAnswer = (qId) => {
    setAnswers(prev => {
      const next = { ...prev };
      delete next[qId];
      return next;
    });
  };

  const handleToggleMark = (qId) => {
    setMarkedQuestions(prev => {
      const next = new Set(prev);
      if (next.has(qId)) next.delete(qId);
      else next.add(qId);
      return next;
    });
  };

  const handleFinalSubmit = useCallback(() => {
    if (onSubmitExam) {
      const timeTaken = Math.max(1, totalAllowedSeconds - timeLeft);
      onSubmitExam({
        answers: answersRef.current,
        timeTakenSeconds: timeTaken
      });
    }
  }, [onSubmitExam, totalAllowedSeconds, timeLeft]);

  const currentQ = questions[currentIndex] || {};
  const isAnswered = currentQ.id !== undefined && answers[currentQ.id] !== undefined;
  const isMarked = currentQ.id !== undefined && markedQuestions.has(currentQ.id);

  const answeredCount = Object.keys(answers).length;
  const markedCount = markedQuestions.size;
  const unansweredCount = Math.max(0, questions.length - answeredCount);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const isTimeCritical = timeLeft < 180; // under 3 minutes
  const isTimeWarning = timeLeft < 300 && timeLeft >= 180; // under 5 minutes

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col">
      {/* ================================================================ */}
      {/* 1. STICKY TOP EXAM HEADER & TIMER */}
      {/* ================================================================ */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm px-4 sm:px-6 py-3.5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={() => setIsPaletteOpenMobile(true)}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 lg:hidden cursor-pointer text-slate-600 dark:text-slate-300 hover:text-indigo-600"
            title="Question Palette"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="min-w-0">
            <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white truncate">
              {examTitleBn}
            </h2>
            <p className="text-xs text-slate-400 font-medium truncate hidden sm:block">
              {examTitleEn} • সর্বমোট প্রশ্ন: {questions.length}
            </p>
          </div>
        </div>

        {/* Timer & Submit */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-2xl font-mono font-black text-sm sm:text-base border shadow-xs transition-colors ${
            isTimeCritical
              ? 'bg-rose-500 text-white border-rose-600 animate-pulse'
              : isTimeWarning
              ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30'
              : 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20'
          }`}>
            <Clock className="w-4 h-4" />
            <span>{formatTime(timeLeft)}</span>
          </div>

          <button
            type="button"
            onClick={() => setShowConfirmSubmit(true)}
            disabled={isSubmitting}
            className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-md shadow-emerald-600/20 flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span>জমা দিন</span>
          </button>
        </div>
      </header>

      {/* ================================================================ */}
      {/* 2. MAIN EXAM BODY (2-COLUMN LAYOUT) */}
      {/* ================================================================ */}
      <div className="flex-1 max-w-[1500px] w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT / CENTER: QUESTION CARD (COLS 8) */}
        <main className="lg:col-span-8 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
            {/* Question Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-2">
              <div className="flex items-center gap-2.5">
                <span className="w-9 h-9 rounded-2xl bg-indigo-600 text-white font-black text-sm flex items-center justify-center shadow-xs">
                  {currentIndex + 1}
                </span>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  প্রশ্ন {currentIndex + 1} / {questions.length}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {currentQ.difficulty && (
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {currentQ.difficulty}
                  </span>
                )}
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                  মান: {currentQ.marks || 1}
                </span>
              </div>
            </div>

            {/* Question Text */}
            <div className="space-y-2">
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-slate-900 dark:text-white leading-relaxed font-english">
                {currentQ.questionEn || currentQ.question}
              </h3>
              {currentQ.questionBn && (
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
                  {currentQ.questionBn}
                </p>
              )}
            </div>

            {/* Options List */}
            <div className="space-y-3 pt-2">
              {currentQ.options?.map((opt, optIdx) => {
                const selected = answers[currentQ.id] === optIdx;
                const letter = String.fromCharCode(65 + optIdx); // A, B, C, D

                return (
                  <button
                    key={optIdx}
                    type="button"
                    onClick={() => handleSelectOption(currentQ.id, optIdx)}
                    className={`w-full p-4 rounded-2xl border text-left flex items-start gap-3.5 transition-all cursor-pointer ${
                      selected
                        ? 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-500 dark:border-indigo-500 shadow-md ring-2 ring-indigo-500/20 text-indigo-900 dark:text-indigo-200'
                        : 'bg-slate-50/50 dark:bg-slate-950/40 border-slate-200/80 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    <span className={`w-7 h-7 rounded-xl font-mono font-bold text-xs flex items-center justify-center flex-shrink-0 transition-colors ${
                      selected
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700'
                    }`}>
                      {letter}
                    </span>
                    <span className="text-sm font-medium pt-0.5 leading-relaxed font-english flex-1">
                      {opt}
                    </span>
                    {selected && (
                      <Check className="w-5 h-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Bottom Actions for Question */}
            <div className="flex items-center justify-between pt-5 border-t border-slate-100 dark:border-slate-800 flex-wrap gap-2.5">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleToggleMark(currentQ.id)}
                  className={`px-3.5 py-2 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border ${
                    isMarked
                      ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 hover:bg-amber-500/10 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <Flag className="w-3.5 h-3.5" />
                  <span>{isMarked ? 'চিহ্নিত (Marked ★)' : 'রিভিউ রাখুন (Mark)'}</span>
                </button>

                {isAnswered && (
                  <button
                    type="button"
                    onClick={() => handleClearAnswer(currentQ.id)}
                    className="px-3 py-2 rounded-2xl text-xs font-bold text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 cursor-pointer transition-colors"
                  >
                    উত্তর মুছুন (Clear)
                  </button>
                )}
              </div>

              {/* Prev / Next */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentIndex(i => Math.max(0, i - 1))}
                  disabled={currentIndex === 0}
                  className="px-4 py-2 rounded-2xl text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed flex items-center gap-1 text-slate-700 dark:text-slate-200 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>পূর্ববর্তী</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentIndex(i => Math.min(questions.length - 1, i + 1))}
                  disabled={currentIndex === questions.length - 1}
                  className="px-4 py-2 rounded-2xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed flex items-center gap-1 shadow-xs transition-colors"
                >
                  <span>পরবর্তী</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </main>

        {/* RIGHT: QUESTION NAVIGATION PALETTE (COLS 4) */}
        <aside className="lg:col-span-4 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 shadow-sm space-y-5">
            <h4 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-500" />
              <span>প্রশ্ন নেভিগেশন প্যালেট</span>
            </h4>

            {/* Summary Counters */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                <span className="block font-black text-emerald-600 dark:text-emerald-400 text-base">
                  {answeredCount}
                </span>
                <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
                  উত্তরকৃত ✓
                </span>
              </div>

              <div className="p-2.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800">
                <span className="block font-black text-amber-600 dark:text-amber-400 text-base">
                  {markedCount}
                </span>
                <span className="text-[11px] font-bold text-amber-700 dark:text-amber-300">
                  চিহ্নিত ★
                </span>
              </div>

              <div className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="block font-black text-slate-500 dark:text-slate-300 text-base">
                  {unansweredCount}
                </span>
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                  অনাক্রান্ত
                </span>
              </div>
            </div>

            {/* Grid of question buttons */}
            <div className="max-h-[360px] overflow-y-auto pr-1">
              <div className="grid grid-cols-5 sm:grid-cols-6 lg:grid-cols-5 gap-2">
                {questions.map((q, idx) => {
                  const isCurrent = idx === currentIndex;
                  const hasAns = answers[q.id] !== undefined;
                  const isMark = markedQuestions.has(q.id);

                  let btnColor = 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700';
                  if (hasAns) {
                    btnColor = 'bg-emerald-600 text-white border-emerald-700 shadow-xs';
                  } else if (isMark) {
                    btnColor = 'bg-amber-500 text-white border-amber-600 shadow-xs';
                  }

                  if (isCurrent) {
                    btnColor += ' ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-slate-900 scale-105 font-black';
                  }

                  return (
                    <button
                      key={q.id || idx}
                      type="button"
                      onClick={() => setCurrentIndex(idx)}
                      className={`h-10 rounded-xl font-mono text-xs font-bold flex items-center justify-center relative transition-all cursor-pointer border ${btnColor}`}
                    >
                      <span>{idx + 1}</span>
                      {isMark && hasAns && (
                        <span className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-amber-300 ring-1 ring-white" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Legend */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm bg-emerald-600" />
                <span>উত্তর দেওয়া সম্পন্ন (Answered)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm bg-amber-500" />
                <span>রিভিউয়ের জন্য চিহ্নিত (Marked for Review)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm bg-slate-200 dark:bg-slate-700" />
                <span>উত্তর প্রদান করা হয়নি (Unanswered)</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowConfirmSubmit(true)}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-2xl shadow-md shadow-emerald-600/20 cursor-pointer transition-all active:scale-95"
            >
              পরীক্ষা সমাপ্ত ও জমা দিন (Submit)
            </button>
          </div>
        </aside>
      </div>

      {/* ================================================================ */}
      {/* 3. CONFIRM SUBMISSION MODAL */}
      {/* ================================================================ */}
      {showConfirmSubmit && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5 animate-in fade-in zoom-in duration-150">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto">
              <Send className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1.5">
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                পরীক্ষা জমা দিতে আপনি কি নিশ্চিত?
              </h3>
              <p className="text-xs text-slate-400">
                জমা দেওয়ার পর আর কোনো উত্তর পরিবর্তন করা যাবে না।
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 grid grid-cols-3 gap-2 text-center text-xs">
              <div>
                <span className="block font-black text-emerald-600 text-sm">{answeredCount}</span>
                <span className="text-[10px] text-slate-400">উত্তর দেওয়া</span>
              </div>
              <div>
                <span className="block font-black text-rose-500 text-sm">{unansweredCount}</span>
                <span className="text-[10px] text-slate-400">অনাক্রান্ত</span>
              </div>
              <div>
                <span className="block font-black text-amber-500 text-sm">{markedCount}</span>
                <span className="text-[10px] text-slate-400">চিহ্নিত</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowConfirmSubmit(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                ফিরে যান
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowConfirmSubmit(false);
                  handleFinalSubmit();
                }}
                disabled={isSubmitting}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? 'জমা হচ্ছে...' : 'হ্যাঁ, জমা দিন'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================ */}
      {/* 4. MOBILE QUESTION PALETTE DRAWER */}
      {/* ================================================================ */}
      {isPaletteOpenMobile && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex justify-end lg:hidden">
          <div className="bg-white dark:bg-slate-900 w-full max-w-xs h-full p-5 space-y-4 overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">প্রশ্ন তালিকা</h4>
              <button
                type="button"
                onClick={() => setIsPaletteOpenMobile(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {questions.map((q, idx) => {
                const isCurrent = idx === currentIndex;
                const hasAns = answers[q.id] !== undefined;
                const isMark = markedQuestions.has(q.id);

                let btnColor = 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300';
                if (hasAns) btnColor = 'bg-emerald-600 text-white';
                else if (isMark) btnColor = 'bg-amber-500 text-white';

                if (isCurrent) btnColor += ' ring-2 ring-indigo-500';

                return (
                  <button
                    key={q.id || idx}
                    type="button"
                    onClick={() => {
                      setCurrentIndex(idx);
                      setIsPaletteOpenMobile(false);
                    }}
                    className={`h-10 rounded-xl font-mono text-xs font-bold flex items-center justify-center cursor-pointer ${btnColor}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
