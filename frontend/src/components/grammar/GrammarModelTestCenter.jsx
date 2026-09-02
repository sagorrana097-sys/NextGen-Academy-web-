import React, { useState, useEffect } from 'react';
import {
  Clock, Award, CheckCircle2, AlertCircle, RefreshCw, HelpCircle,
  Timer, ChevronRight, Check, X, ShieldCheck
} from 'lucide-react';

export default function GrammarModelTestCenter({ onFinishTest }) {
  const [activeTest, setActiveTest] = useState(null);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  // Demo Standard Model Test
  const MODEL_TEST = {
    id: 1,
    titleBn: 'এসএসসি স্পেশাল পূর্ণাঙ্গ গ্রামার মডেল টেস্ট ০১',
    titleEn: 'SSC Special Grammar Master Model Test 01',
    durationMinutes: 20,
    totalMarks: 20,
    targetClass: 'Class 9 - 10 (SSC Exam 2026)',
    questions: [
      {
        id: 1,
        question: 'Identify the sentence in Present Indefinite Tense representing a universal truth:',
        options: ['He was walking in the park.', 'The moon reflects the light of the sun.', 'I will have finished the task.', 'She has made tea.'],
        correctOptionIndex: 1,
        explanation: '"The moon reflects the light of the sun" চিরন্তন সত্য বিধায় Present Indefinite Tense।'
      },
      {
        id: 2,
        question: 'He ran fast lest he _____ miss the train.',
        options: ['will', 'can', 'should', 'would'],
        correctOptionIndex: 2,
        explanation: 'Lest যুক্ত বাক্যে Subject-এর পর should বা might বসে।'
      },
      {
        id: 3,
        question: 'Passive of "I know him":',
        options: ['He is known by me.', 'He is known to me.', 'He was known by me.', 'He is being known to me.'],
        correctOptionIndex: 1,
        explanation: 'Known-এর পর "to" প্রিপজিশন বসে।'
      },
      {
        id: 4,
        question: 'I look forward to _____ you soon.',
        options: ['meet', 'met', 'meeting', 'meets'],
        correctOptionIndex: 2,
        explanation: '"Look forward to"-এর পর Verb + ing হয়।'
      }
    ]
  };

  useEffect(() => {
    if (activeTest && timeLeft > 0 && !isFinished) {
      const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
      return () => clearInterval(timer);
    } else if (activeTest && timeLeft === 0 && !isFinished) {
      setIsFinished(true);
    }
  }, [activeTest, timeLeft, isFinished]);

  const startTest = () => {
    setActiveTest(MODEL_TEST);
    setAnswers({});
    setTimeLeft(MODEL_TEST.durationMinutes * 60);
    setIsFinished(false);
  };

  const handleSelect = (qId, oIdx) => {
    if (isFinished) return;
    setAnswers(prev => ({ ...prev, [qId]: oIdx }));
  };

  const calculateScore = () => {
    if (!activeTest) return 0;
    return activeTest.questions.filter(q => answers[q.id] === q.correctOptionIndex).length;
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="space-y-6">
      {!activeTest ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm text-center max-w-2xl mx-auto space-y-5">
          <div className="w-16 h-16 rounded-3xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 flex items-center justify-center mx-auto shadow-lg shadow-indigo-500/10">
            <Timer className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              {MODEL_TEST.titleBn}
            </h2>
            <p className="text-xs font-semibold text-slate-400 mt-1">
              {MODEL_TEST.targetClass} • সময়: {MODEL_TEST.durationMinutes} মিনিট • পূর্ণমান: {MODEL_TEST.totalMarks}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 space-y-1 text-left">
            <p className="font-bold text-slate-900 dark:text-white">পরীক্ষার নিয়মাবলী:</p>
            <ul className="list-disc list-inside space-y-0.5 text-slate-500">
              <li>নির্ধারিত {MODEL_TEST.durationMinutes} মিনিটের মধ্যে সকল প্রশ্নের উত্তর দিন।</li>
              <li>টাইম শেষ হওয়ার সাথে সাথে পরীক্ষা স্বয়ংক্রিয়ভাবে জমা হয়ে যাবে।</li>
              <li>সাবমিশনের পর তাৎক্ষণিক মার্কশিট ও প্রতিটি প্রশ্নের নির্ভুল ব্যাখ্যা দেখতে পাবেন।</li>
            </ul>
          </div>

          <button
            type="button"
            onClick={startTest}
            className="px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-black text-sm rounded-2xl shadow-lg shadow-indigo-600/30 transition-all cursor-pointer hover:scale-105 active:scale-95"
          >
            মডেল টেস্ট শুরু করুন (Start Test)
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Test Header & Sticky Timer */}
          <div className="sticky top-20 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-4 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-md flex items-center justify-between gap-4">
            <div>
              <h3 className="font-black text-sm text-slate-900 dark:text-white truncate">
                {activeTest.titleBn}
              </h3>
              <p className="text-[11px] text-slate-400 font-bold">
                উত্তর প্রদান: {Object.keys(answers).length} / {activeTest.questions.length}
              </p>
            </div>

            <div className={`px-4 py-2 rounded-2xl font-mono font-black text-sm flex items-center gap-1.5 shadow-xs ${
              timeLeft < 180 ? 'bg-rose-500 text-white animate-pulse' : 'bg-indigo-600 text-white'
            }`}>
              <Clock className="w-4 h-4" />
              <span>{formatTime(timeLeft)}</span>
            </div>
          </div>

          {/* Questions */}
          <div className="space-y-4">
            {activeTest.questions.map((q, idx) => {
              const selectedOpt = answers[q.id];
              const isCorrect = selectedOpt === q.correctOptionIndex;

              return (
                <div
                  key={q.id}
                  className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3"
                >
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white font-english">
                    {idx + 1}. {q.question}
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {q.options.map((opt, oIdx) => {
                      const isChecked = selectedOpt === oIdx;
                      let btnCls = 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300';

                      if (isFinished) {
                        if (oIdx === q.correctOptionIndex) {
                          btnCls = 'bg-emerald-100 dark:bg-emerald-950/60 border-emerald-500 text-emerald-900 dark:text-emerald-300 font-bold';
                        } else if (isChecked && !isCorrect) {
                          btnCls = 'bg-rose-100 dark:bg-rose-950/60 border-rose-500 text-rose-900 dark:text-rose-300 line-through';
                        }
                      } else if (isChecked) {
                        btnCls = 'bg-indigo-50 dark:bg-indigo-950/80 border-indigo-600 text-indigo-700 dark:text-indigo-300 font-bold';
                      }

                      return (
                        <button
                          key={oIdx}
                          type="button"
                          onClick={() => handleSelect(q.id, oIdx)}
                          className={`p-3 rounded-xl border text-xs text-left transition-all flex items-center gap-2.5 ${btnCls}`}
                        >
                          <span className="w-5 h-5 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center font-mono text-[10px] font-bold flex-shrink-0">
                            {['A', 'B', 'C', 'D'][oIdx]}
                          </span>
                          <span className="font-english font-medium">{opt}</span>
                        </button>
                      );
                    })}
                  </div>

                  {isFinished && (
                    <div className="p-3 bg-slate-50 dark:bg-slate-950/80 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      <strong className="text-indigo-600 dark:text-indigo-400 font-bold">ব্যাখ্যা:</strong> {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Footer Submissions */}
          <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
            {isFinished ? (
              <div className="w-full flex items-center justify-between gap-4">
                <span className="font-black text-sm text-slate-900 dark:text-white">
                  আপনার অর্জিত স্কোর: <strong className="text-emerald-600 font-mono text-base">{calculateScore()} / {activeTest.questions.length}</strong>
                </span>
                <button
                  type="button"
                  onClick={() => setActiveTest(null)}
                  className="px-6 py-2.5 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white font-black text-xs rounded-xl"
                >
                  পরীক্ষা শেষ করুন
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsFinished(true)}
                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-sm rounded-2xl shadow-lg shadow-emerald-600/25 transition-all cursor-pointer"
              >
                উত্তরপত্র জমা দিন (Submit Test)
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
