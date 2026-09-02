import React, { useState } from 'react';
import {
  ListChecks, CheckCircle2, XCircle, ArrowLeft, ArrowRight,
  RefreshCw, Award, Send
} from 'lucide-react';
import { grammarAPI } from '../../services/api';

export default function GrammarMCQ({ mcqs = [], topicId, onQuizFinished }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [answersMap, setAnswersMap] = useState({});
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  if (!mcqs || !mcqs.length) return null;

  const currentQ = mcqs[currentIdx];
  const total = mcqs.length;

  const handleSelectOption = (idx) => {
    if (isSubmitted) return;
    setSelectedOption(idx);
  };

  const handleSubmitAnswer = async () => {
    if (selectedOption === null || isSubmitted) return;

    const isCorrect = selectedOption === currentQ.correctOptionIndex;
    setIsSubmitted(true);
    const updatedAnswers = { ...answersMap, [currentQ.id]: { selected: selectedOption, isCorrect } };
    setAnswersMap(updatedAnswers);

    if (isCorrect) setScore(s => s + 1);

    // Persist to backend
    try {
      await grammarAPI.submitMCQ({
        questionId: currentQ.id,
        selectedOptionIndex: selectedOption
      });
    } catch (e) {}
  };

  const handleNext = () => {
    if (currentIdx < total - 1) {
      setCurrentIdx(i => i + 1);
      const nextAns = answersMap[mcqs[currentIdx + 1]?.id];
      if (nextAns) {
        setSelectedOption(nextAns.selected);
        setIsSubmitted(true);
      } else {
        setSelectedOption(null);
        setIsSubmitted(false);
      }
    } else {
      setIsFinished(true);
      if (onQuizFinished) onQuizFinished(score);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(i => i - 1);
      const prevAns = answersMap[mcqs[currentIdx - 1]?.id];
      if (prevAns) {
        setSelectedOption(prevAns.selected);
        setIsSubmitted(true);
      } else {
        setSelectedOption(null);
        setIsSubmitted(false);
      }
    }
  };

  const resetQuiz = () => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setAnswersMap({});
    setScore(0);
    setIsFinished(false);
  };

  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900 p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-5">
      {/* Header & Step Indicator */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <h3 className="font-black text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2">
          <ListChecks className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <span>০৯ — বহুনির্বাচনী প্রশ্ন অনুশীলন (Interactive MCQ Drills)</span>
        </h3>
        <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
          প্রশ্ন {currentIdx + 1} / {total}
        </span>
      </div>

      {!isFinished ? (
        <div className="space-y-5">
          {/* Question Text */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 space-y-1">
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white font-english">
              {currentIdx + 1}. {currentQ.question || currentQ.questionEn}
            </h4>
            {currentQ.questionBn && (
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {currentQ.questionBn}
              </p>
            )}
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {currentQ.options?.map((opt, oIdx) => {
              const isChecked = selectedOption === oIdx;
              let btnCls = 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-indigo-400';

              if (isSubmitted) {
                if (oIdx === currentQ.correctOptionIndex) {
                  btnCls = 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-900 dark:text-emerald-300 font-bold';
                } else if (isChecked && oIdx !== currentQ.correctOptionIndex) {
                  btnCls = 'bg-rose-50 dark:bg-rose-950/60 border-rose-500 text-rose-900 dark:text-rose-300 line-through';
                }
              } else if (isChecked) {
                btnCls = 'bg-indigo-50 dark:bg-indigo-950/80 border-indigo-600 text-indigo-700 dark:text-indigo-300 font-bold shadow-xs';
              }

              return (
                <button
                  key={oIdx}
                  type="button"
                  onClick={() => handleSelectOption(oIdx)}
                  className={`p-3.5 rounded-2xl border text-xs text-left transition-all flex items-center gap-2.5 cursor-pointer ${btnCls}`}
                >
                  <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-mono text-[10px] font-bold flex-shrink-0">
                    {['A', 'B', 'C', 'D'][oIdx]}
                  </span>
                  <span className="font-english leading-snug">{opt}</span>
                </button>
              );
            })}
          </div>

          {/* Explanation Box (Hidden before submit) */}
          {isSubmitted && (
            <div className={`p-4 sm:p-5 rounded-2xl border text-xs leading-relaxed space-y-1.5 ${
              selectedOption === currentQ.correctOptionIndex
                ? 'bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-200'
                : 'bg-rose-50/80 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800/60 text-rose-900 dark:text-rose-200'
            }`}>
              <div className="flex items-center gap-2 font-black text-xs sm:text-sm">
                {selectedOption === currentQ.correctOptionIndex ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>সঠিক উত্তর! (Correct Answer)</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-rose-600" />
                    <span>ভুল উত্তর! সঠিক উত্তর: Option {['A', 'B', 'C', 'D'][currentQ.correctOptionIndex]}</span>
                  </>
                )}
              </div>
              <p><strong className="font-bold">ব্যাখ্যা:</strong> {currentQ.explanation || currentQ.explanationBn}</p>
            </div>
          )}

          {/* Controls */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentIdx === 0}
              className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 disabled:opacity-30 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>পূর্ববর্তী</span>
            </button>

            {!isSubmitted ? (
              <button
                type="button"
                onClick={handleSubmitAnswer}
                disabled={selectedOption === null}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white text-xs font-black shadow-md shadow-indigo-600/20 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>উত্তর জমা দিন (Submit)</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNext}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-md shadow-emerald-600/20 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <span>{currentIdx < total - 1 ? 'পরবর্তী প্রশ্ন' : 'ফলাফল দেখুন'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Quiz Finished View */
        <div className="p-6 sm:p-8 text-center space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
            <Award className="w-8 h-8" />
          </div>
          <div>
            <h4 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
              অভিনন্দন! কুইজ সম্পন্ন হয়েছে
            </h4>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              আপনার স্কোর: <strong className="text-emerald-600 font-mono text-base">{score} / {total}</strong> ({Math.round((score / total) * 100)}%)
            </p>
          </div>
          <button
            type="button"
            onClick={resetQuiz}
            className="px-6 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white text-xs font-bold inline-flex items-center gap-2 cursor-pointer shadow-md"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>আবার পরীক্ষা দিন</span>
          </button>
        </div>
      )}
    </div>
  );
}
