import React, { useState } from 'react';
import {
  ListChecks, CheckCircle2, RefreshCw, Award, HelpCircle,
  Sparkles, Eye, ArrowRight, BookOpen, AlertCircle
} from 'lucide-react';

export default function GrammarPracticeArena({ topic, onBackToTopic }) {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [revealedWrittenAnswers, setRevealedWrittenAnswers] = useState({});

  if (!topic) return null;

  const mcqs = topic.mcqs || [];
  const writtenDrills = topic.writtenDrills || [];

  const handleSelectOption = (qId, optionIdx) => {
    if (isSubmitted) return;
    setSelectedAnswers(prev => ({ ...prev, [qId]: optionIdx }));
  };

  const calculateScore = () => {
    return mcqs.filter(q => selectedAnswers[q.id] === q.correctOptionIndex).length;
  };

  const resetQuiz = () => {
    setSelectedAnswers({});
    setIsSubmitted(false);
    setRevealedWrittenAnswers({});
  };

  const toggleRevealWritten = (id) => {
    setRevealedWrittenAnswers(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <ListChecks className="w-5 h-5 text-indigo-600" />
            <span>{topic.titleBn} — প্র্যাকটিস এরিনা</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            MCQ অনুশীলন ও লিখিত ড্রিল সম্পন্ন করে নিজের দখল যাচাই করুন
          </p>
        </div>

        {isSubmitted && (
          <div className="px-4 py-2 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-700 dark:text-indigo-300 font-mono font-black text-sm flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            <span>স্কোর: {calculateScore()} / {mcqs.length}</span>
          </div>
        )}
      </div>

      {/* Part 1: MCQ Practice Section */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5">
        <h3 className="font-black text-base text-slate-900 dark:text-white flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
          <span>🎯 বহুনির্বাচনী প্রশ্ন (MCQ Drills)</span>
          <span className="text-xs font-normal text-slate-400">({mcqs.length}টি প্রশ্ন)</span>
        </h3>

        {mcqs.length === 0 ? (
          <p className="text-xs text-slate-400 p-6 text-center">এই টপিকে কোনো MCQ কুইজ পাওয়া যায়নি।</p>
        ) : (
          <div className="space-y-4">
            {mcqs.map((q, idx) => {
              const selectedOpt = selectedAnswers[q.id];
              const isCorrect = selectedOpt === q.correctOptionIndex;

              return (
                <div
                  key={q.id || idx}
                  className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200/80 dark:border-slate-800 space-y-3"
                >
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white font-english">
                    {idx + 1}. {q.question}
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {q.options?.map((opt, oIdx) => {
                      const isChecked = selectedOpt === oIdx;
                      let btnStyle = 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-indigo-400';

                      if (isSubmitted) {
                        if (oIdx === q.correctOptionIndex) {
                          btnStyle = 'bg-emerald-100 dark:bg-emerald-950/60 border-emerald-500 text-emerald-900 dark:text-emerald-300 font-bold';
                        } else if (isChecked && !isCorrect) {
                          btnStyle = 'bg-rose-100 dark:bg-rose-950/60 border-rose-500 text-rose-900 dark:text-rose-300 line-through';
                        }
                      } else if (isChecked) {
                        btnStyle = 'bg-indigo-50 dark:bg-indigo-950/80 border-indigo-600 text-indigo-700 dark:text-indigo-300 font-bold shadow-xs';
                      }

                      return (
                        <button
                          key={oIdx}
                          type="button"
                          onClick={() => handleSelectOption(q.id, oIdx)}
                          className={`p-3 rounded-xl border text-xs text-left transition-all flex items-center gap-2.5 ${btnStyle}`}
                        >
                          <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-mono text-[10px] font-bold flex-shrink-0">
                            {['A', 'B', 'C', 'D'][oIdx] || oIdx + 1}
                          </span>
                          <span className="leading-snug font-english">{opt}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Instant Explanation */}
                  {isSubmitted && q.explanation && (
                    <div className={`p-3.5 rounded-xl text-xs leading-relaxed border ${
                      isCorrect
                        ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                        : 'bg-rose-50/60 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200'
                    }`}>
                      <strong className="font-bold">ব্যাখ্যা:</strong> {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}

            <div className="pt-3 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
              {isSubmitted ? (
                <button
                  type="button"
                  onClick={resetQuiz}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-black text-xs flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>পুনরায় প্র্যাকটিস করুন</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsSubmitted(true)}
                  disabled={Object.keys(selectedAnswers).length === 0}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-black text-xs shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
                >
                  উত্তর জমা দিন ও রেজাল্ট দেখুন
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Part 2: Written Practice Drills */}
      {writtenDrills.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="font-black text-base text-slate-900 dark:text-white flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <span>✍️ লিখিত ও ফিল-ইন-দ্য-ব্ল্যাঙ্কস ড্রিল (Written Practice)</span>
            <span className="text-xs font-normal text-slate-400">({writtenDrills.length}টি ড্রিল)</span>
          </h3>

          <div className="space-y-3">
            {writtenDrills.map((drill, idx) => {
              const isRevealed = revealedWrittenAnswers[drill.id];
              return (
                <div key={drill.id || idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 space-y-2.5">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white font-english">
                      {idx + 1}. {drill.prompt}
                    </p>
                    <button
                      type="button"
                      onClick={() => toggleRevealWritten(drill.id)}
                      className="px-3 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-black flex items-center gap-1 hover:bg-indigo-100 transition-colors flex-shrink-0"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{isRevealed ? 'লুকান' : 'উত্তর দেখুন'}</span>
                    </button>
                  </div>

                  {isRevealed && (
                    <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-300 dark:border-emerald-800/60 text-xs text-emerald-900 dark:text-emerald-200 space-y-1">
                      <p><strong className="font-black">সঠিক উত্তর:</strong> <span className="font-english font-bold text-emerald-700 dark:text-emerald-300">{drill.correctAnswer}</span></p>
                      {drill.explanationBn && <p className="text-[11px] text-slate-600 dark:text-slate-300">💡 {drill.explanationBn}</p>}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
