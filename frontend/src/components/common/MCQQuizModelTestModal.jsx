import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useLanguage } from '../../context/LanguageContext';
import { examAPI } from '../../services/api';
import {
  Timer,
  Award,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Send,
  X,
  Printer,
  Sparkles,
  HelpCircle,
  BookOpen,
  RotateCcw,
  ShieldAlert,
  Check,
  FileText,
  Trophy,
  Users,
  Medal,
  Clock,
  Flame
} from 'lucide-react';

export default function MCQQuizModelTestModal({ exam, isOpen, onClose, onExamFinished }) {
  const { lang } = useLanguage();
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [studentAnswers, setStudentAnswers] = useState({}); // { [qId]: optionIndex }
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [antiCheatWarnings, setAntiCheatWarnings] = useState(0);
  const [showAntiCheatAlert, setShowAntiCheatAlert] = useState(false);

  // Result & Leaderboard state after submission
  const [evaluationResult, setEvaluationResult] = useState(null);
  const [activeResultTab, setActiveResultTab] = useState('review'); // 'review' | 'leaderboard'
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(false);

  useEffect(() => {
    if (isOpen && exam) {
      if (exam.hasSubmitted && exam.mySubmission) {
        // Already submitted - directly show review
        setEvaluationResult({
          examTitle: exam.titleBn || exam.titleEn,
          totalScore: exam.mySubmission.totalScore || exam.totalMarks,
          obtainedScore: exam.mySubmission.obtainedScore,
          percentage: exam.mySubmission.percentage,
          passed: exam.mySubmission.passed,
          detailedEvaluations: exam.mySubmission.studentAnswers || []
        });
        fetchLeaderboard(exam.id);
      } else {
        // Start fresh exam
        setCurrentQuestionIdx(0);
        setStudentAnswers({});
        setEvaluationResult(null);
        setAntiCheatWarnings(0);
        setShowAntiCheatAlert(false);
        setActiveResultTab('review');
        setTimeLeft((exam.durationMinutes || 15) * 60);
      }
    }
  }, [isOpen, exam]);

  // Live countdown timer
  useEffect(() => {
    if (!isOpen || evaluationResult || !exam || exam.hasSubmitted) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, evaluationResult, exam]);

  // Anti-cheat tab change detection
  useEffect(() => {
    if (!isOpen || evaluationResult || !exam || exam.hasSubmitted) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setAntiCheatWarnings((prev) => prev + 1);
        setShowAntiCheatAlert(true);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isOpen, evaluationResult, exam]);

  const fetchLeaderboard = async (examId) => {
    setLoadingLeaderboard(true);
    try {
      const res = await fetch(`/api/exams/${examId}/leaderboard`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('nextgen_token') || ''}`
        }
      });
      const data = await res.json();
      if (data.success && data.data?.leaderboard) {
        setLeaderboardData(data.data.leaderboard);
      }
    } catch (err) {
      console.error('Failed to load leaderboard:', err);
    } finally {
      setLoadingLeaderboard(false);
    }
  };

  if (!isOpen || !exam) return null;

  const questions = Array.isArray(exam.questions) ? exam.questions : [];
  const currentQ = questions[currentQuestionIdx];

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleSelectOption = (qId, optionIdx) => {
    setStudentAnswers((prev) => ({
      ...prev,
      [qId]: optionIdx
    }));
  };

  const handleAutoSubmit = async () => {
    await submitMCQAnswers(true);
  };

  const handleSubmitExam = async () => {
    const answeredCount = Object.keys(studentAnswers).length;
    const totalQ = questions.length;

    let confirmText = 'আপনি কি নিশ্চিতভাবে এই মডেল টেস্ট সাবমিট করতে চান?';
    if (answeredCount < totalQ) {
      confirmText = `সতর্কতা: আপনি ${totalQ}টি প্রশ্নের মধ্যে ${answeredCount}টি উত্তর দিয়েছেন। বাকি ${totalQ - answeredCount}টি প্রশ্ন অনুত্তরিত রয়েছে। আপনি কি নিশ্চিতভাবে সাবমিট করবেন?`;
    }

    if (!window.confirm(confirmText)) return;
    await submitMCQAnswers(false);
  };

  const submitMCQAnswers = async (isAuto = false) => {
    setIsSubmitting(true);
    try {
      const payloadAnswers = questions.map((q) => ({
        questionId: q.id,
        chosenOptionIndex: studentAnswers[q.id] !== undefined ? studentAnswers[q.id] : null
      }));

      const res = await examAPI.submitExam(exam.id, {
        answers: payloadAnswers,
        isAutoSubmitted: isAuto,
        antiCheatWarnings
      });

      if (res.success && res.data) {
        setEvaluationResult(res.data);
        fetchLeaderboard(exam.id);

        if (res.data.passed) {
          confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.6 }
          });
        }

        if (onExamFinished) onExamFinished();
      } else {
        alert(res.error?.message || 'পরীক্ষা সাবমিট করতে সমস্যা হয়েছে');
      }
    } catch (err) {
      console.error('Submit exam error:', err);
      alert(err.message || 'পরীক্ষা সাবমিট ব্যর্থ হয়েছে');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrintScorecard = () => {
    window.print();
  };

  const totalAnswered = Object.keys(studentAnswers).length;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Print-specific style */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-mcq-scorecard, #printable-mcq-scorecard * {
            visibility: visible;
          }
          #printable-mcq-scorecard {
            position: fixed;
            left: 0;
            top: 0;
            width: 100vw;
            height: 100vh;
            margin: 0;
            padding: 24px;
            background: white !important;
            color: black !important;
            z-index: 99999;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-4xl w-full shadow-2xl flex flex-col overflow-hidden text-white my-auto max-h-[94vh]">
        {/* Anti-cheat Alert Banner */}
        {showAntiCheatAlert && !evaluationResult && (
          <div className="bg-rose-600 text-white p-3 px-4 flex items-center justify-between text-xs font-bold animate-pulse no-print">
            <div className="flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4" />
              <span>
                সতর্কতা: ট্যাব বা উইন্ডো পরিবর্তন শনাক্ত করা হয়েছে! (সতর্কবার্তা #{antiCheatWarnings})
              </span>
            </div>
            <button
              onClick={() => setShowAntiCheatAlert(false)}
              className="p-1 hover:bg-rose-700 rounded-lg text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* VIEW 1: RESULTS & EVALUATION WITH LEADERBOARD */}
        {/* ---------------------------------------------------- */}
        {evaluationResult ? (
          <div id="printable-mcq-scorecard" className="flex flex-col flex-1 overflow-hidden">
            {/* Header */}
            <div className="p-5 bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 border-b border-slate-700 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base sm:text-lg text-white">
                    তাৎক্ষণিক মূল্যায়ন ও লিডারবোর্ড (Model Test Evaluation & Rankings)
                  </h3>
                  <p className="text-xs text-emerald-200/80">
                    {evaluationResult.examTitle || exam.titleBn} • {exam.subject?.nameBn || 'সাধারণ বিষয়'}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2 no-print">
                <button
                  type="button"
                  onClick={handlePrintScorecard}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md flex items-center space-x-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>প্রিন্ট রেজাল্ট</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Scorecard Hero Banner */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-slate-950/60">
              <div className="p-5 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl border border-slate-700 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
                <div className="space-y-1">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                      evaluationResult.passed
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    }`}
                  >
                    {evaluationResult.passed ? '🎉 উত্তীর্ণ (PASSED)' : '❌ অনুত্তীর্ণ (FAILED)'}
                  </span>
                  <h4 className="text-xl sm:text-2xl font-black text-white">
                    প্রাপ্ত নম্বর: {evaluationResult.obtainedScore} / {evaluationResult.totalScore}
                  </h4>
                  <p className="text-xs text-slate-300">
                    শতকরা হার: <span className="font-bold text-amber-300">{evaluationResult.percentage}%</span>
                  </p>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="p-3.5 rounded-2xl bg-slate-800 border border-slate-700 text-center min-w-[90px]">
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">গ্রেড</span>
                    <span className="text-xl font-black text-emerald-400">
                      {evaluationResult.percentage >= 80
                        ? 'A+'
                        : evaluationResult.percentage >= 70
                        ? 'A'
                        : evaluationResult.percentage >= 60
                        ? 'A-'
                        : evaluationResult.percentage >= 50
                        ? 'B'
                        : evaluationResult.percentage >= 40
                        ? 'C'
                        : 'F'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Sub-tab Navigation (Review Solutions vs Leaderboard) */}
              <div className="flex items-center space-x-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800 w-fit no-print">
                <button
                  type="button"
                  onClick={() => setActiveResultTab('review')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
                    activeResultTab === 'review'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>প্রশ্নোত্তর ও সমাধান বিশ্লেষণ</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveResultTab('leaderboard');
                    fetchLeaderboard(exam.id);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
                    activeResultTab === 'leaderboard'
                      ? 'bg-amber-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Trophy className="w-3.5 h-3.5" />
                  <span>টপ স্কোরার লিডারবোর্ড ({leaderboardData.length})</span>
                </button>
              </div>

              {/* SUB-TAB 1: DETAILED QUESTION REVIEW */}
              {activeResultTab === 'review' && (
                <div className="space-y-4">
                  <h4 className="font-extrabold text-sm text-slate-200 flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>প্রশ্নভিত্তিক নির্ভুল সমাধান ও ব্যাখ্যা:</span>
                  </h4>

                  <div className="space-y-3.5">
                    {evaluationResult.detailedEvaluations?.map((ev, idx) => (
                      <div
                        key={idx}
                        className={`p-4 rounded-2xl border text-xs space-y-2.5 transition-all ${
                          ev.isCorrect
                            ? 'bg-emerald-950/20 border-emerald-500/30'
                            : 'bg-rose-950/20 border-rose-500/30'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-bold text-slate-200 text-sm">
                            {idx + 1}. {ev.questionBn}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-black flex items-center space-x-1 flex-shrink-0 ${
                              ev.isCorrect ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                            }`}
                          >
                            {ev.isCorrect ? (
                              <>
                                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                <span>সঠিক (+{ev.marks})</span>
                              </>
                            ) : (
                              <>
                                <XCircle className="w-3 h-3 text-rose-400" />
                                <span>ভুল (০)</span>
                              </>
                            )}
                          </span>
                        </div>

                        {/* Options breakdown */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                          {ev.options?.map((opt, optIdx) => {
                            const isChosen = ev.chosenIndex === optIdx;
                            const isActualCorrect = ev.correctIndex === optIdx;

                            let badgeColor = 'bg-slate-800/80 text-slate-300 border-slate-700';
                            if (isActualCorrect) {
                              badgeColor = 'bg-emerald-600/30 text-emerald-200 border-emerald-500/50 font-bold';
                            } else if (isChosen && !ev.isCorrect) {
                              badgeColor = 'bg-rose-600/30 text-rose-200 border-rose-500/50 line-through';
                            }

                            return (
                              <div
                                key={optIdx}
                                className={`p-2.5 rounded-xl border text-[11px] flex items-center space-x-2 ${badgeColor}`}
                              >
                                <span className="w-5 h-5 rounded-full bg-slate-700 flex items-center justify-center font-bold text-[10px] flex-shrink-0">
                                  {['ক', 'খ', 'গ', 'ঘ'][optIdx] || optIdx + 1}
                                </span>
                                <span className="truncate">{opt}</span>
                                {isActualCorrect && <Check className="w-3.5 h-3.5 text-emerald-400 ml-auto flex-shrink-0" />}
                                {isChosen && !ev.isCorrect && <X className="w-3.5 h-3.5 text-rose-400 ml-auto flex-shrink-0" />}
                              </div>
                            );
                          })}
                        </div>

                        {/* Explanation */}
                        {ev.explanation && (
                          <div className="mt-2 p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-300 flex items-start space-x-2">
                            <HelpCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                            <span><strong>ব্যাখ্যা:</strong> {ev.explanation}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SUB-TAB 2: LEADERBOARD & TOP SCORERS */}
              {activeResultTab === 'leaderboard' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-extrabold text-sm text-slate-200 flex items-center space-x-2">
                      <Trophy className="w-4 h-4 text-amber-400" />
                      <span>মডেল টেস্ট মেধাতালিকা ও টপ পারফর্মার্স:</span>
                    </h4>
                    <span className="text-xs text-slate-400">
                      মোট অংশগ্রহণকারী: {leaderboardData.length} জন
                    </span>
                  </div>

                  {loadingLeaderboard ? (
                    <div className="p-8 text-center text-slate-400 text-xs">
                      লিডারবোর্ড লোড হচ্ছে...
                    </div>
                  ) : leaderboardData.length === 0 ? (
                    <div className="p-8 text-center bg-slate-900/60 rounded-2xl border border-slate-800 text-slate-400 text-xs space-y-2">
                      <Trophy className="w-8 h-8 mx-auto text-slate-600" />
                      <p>এখনো কোনো শিক্ষার্থী এই পরীক্ষায় অংশগ্রহণ করেনি।</p>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {leaderboardData.map((lb) => {
                        const isTop1 = lb.rank === 1;
                        const isTop2 = lb.rank === 2;
                        const isTop3 = lb.rank === 3;

                        let rankBadge = (
                          <span className="w-7 h-7 rounded-xl bg-slate-800 text-slate-300 font-black text-xs flex items-center justify-center border border-slate-700">
                            #{lb.rank}
                          </span>
                        );
                        if (isTop1) {
                          rankBadge = (
                            <span className="w-7 h-7 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 font-black text-xs flex items-center justify-center shadow-lg shadow-amber-500/20">
                              🥇 1
                            </span>
                          );
                        } else if (isTop2) {
                          rankBadge = (
                            <span className="w-7 h-7 rounded-xl bg-gradient-to-tr from-slate-300 to-slate-100 text-slate-950 font-black text-xs flex items-center justify-center shadow-md">
                              🥈 2
                            </span>
                          );
                        } else if (isTop3) {
                          rankBadge = (
                            <span className="w-7 h-7 rounded-xl bg-gradient-to-tr from-amber-700 to-amber-500 text-white font-black text-xs flex items-center justify-center shadow-md">
                              🥉 3
                            </span>
                          );
                        }

                        return (
                          <div
                            key={lb.studentId}
                            className={`p-3.5 rounded-2xl border flex items-center justify-between transition-all ${
                              isTop1
                                ? 'bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border-amber-500/40 shadow-lg'
                                : 'bg-slate-900/80 border-slate-800'
                            }`}
                          >
                            <div className="flex items-center space-x-3.5">
                              {rankBadge}
                              <div>
                                <h5 className="font-black text-sm text-slate-100 flex items-center space-x-2">
                                  <span>{lb.studentName}</span>
                                  {isTop1 && <Flame className="w-3.5 h-3.5 text-amber-400" />}
                                </h5>
                                <p className="text-[11px] text-slate-400">
                                  রোল: <span className="font-mono text-slate-200">{lb.rollNo}</span> • {lb.className}
                                </p>
                              </div>
                            </div>

                            <div className="text-right space-y-0.5">
                              <div className="text-base font-black text-emerald-400 font-mono">
                                {lb.obtainedScore} / {lb.totalScore}
                              </div>
                              <div className="text-[10px] text-slate-400 font-bold">
                                {lb.percentage}% নম্বর
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* ---------------------------------------------------- */
          /* VIEW 2: ACTIVE EXAM IN PROGRESS */
          /* ---------------------------------------------------- */
          <div className="flex flex-col flex-1 overflow-hidden">
            {/* Top Bar with Timer & Anti-cheat */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-800 via-slate-850 to-slate-900 border-b border-slate-700 flex items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                  মডেল টেস্ট / MCQ কুইজ পরীক্ষা
                </span>
                <h3 className="font-black text-base sm:text-lg text-white">
                  {exam.titleBn || exam.titleEn}
                </h3>
              </div>

              <div className="flex items-center space-x-3">
                {/* Live Countdown Timer */}
                <div
                  className={`px-3.5 py-1.5 rounded-2xl border flex items-center space-x-2 font-mono font-bold text-sm shadow-md transition-all ${
                    timeLeft < 180
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  }`}
                >
                  <Timer className="w-4 h-4" />
                  <span>{formatTimer(timeLeft)}</span>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
                  title="বন্ধ করুন"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Questions Tracker Bar */}
            <div className="p-3.5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between text-xs px-6">
              <div className="flex items-center space-x-2">
                <span className="text-slate-400">অগ্রগতি:</span>
                <span className="font-black text-emerald-400">
                  {totalAnswered} / {questions.length} টি উত্তর সম্পন্ন
                </span>
              </div>

              <div className="flex items-center space-x-1.5 overflow-x-auto max-w-[50%] py-0.5">
                {questions.map((q, idx) => {
                  const isAnswered = studentAnswers[q.id] !== undefined;
                  const isCurrent = currentQuestionIdx === idx;

                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentQuestionIdx(idx)}
                      className={`w-6 h-6 rounded-lg text-[11px] font-black transition-all flex items-center justify-center ${
                        isCurrent
                          ? 'bg-indigo-600 text-white ring-2 ring-indigo-400'
                          : isAnswered
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Question Box */}
            <div className="p-6 sm:p-8 flex-1 overflow-y-auto space-y-6">
              {currentQ ? (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="px-2.5 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 font-mono text-xs font-bold">
                        প্রশ্ন {currentQuestionIdx + 1} / {questions.length}
                      </span>
                      <span className="text-xs text-slate-400">
                        (নম্বর: {currentQ.marks || 1})
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-black text-slate-100 leading-relaxed">
                      {currentQ.questionBn || currentQ.questionEn}
                    </h3>
                  </div>

                  {/* Options */}
                  <div className="space-y-3">
                    {currentQ.options?.map((opt, optIdx) => {
                      const isSelected = studentAnswers[currentQ.id] === optIdx;

                      return (
                        <button
                          key={optIdx}
                          type="button"
                          onClick={() => handleSelectOption(currentQ.id, optIdx)}
                          className={`w-full p-4 rounded-2xl border text-left text-sm font-medium transition-all flex items-center space-x-3.5 ${
                            isSelected
                              ? 'bg-indigo-600/30 border-indigo-500 text-white ring-2 ring-indigo-500/40 shadow-lg'
                              : 'bg-slate-800/60 border-slate-700 hover:bg-slate-800 text-slate-200'
                          }`}
                        >
                          <span
                            className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs flex-shrink-0 transition-all ${
                              isSelected
                                ? 'bg-indigo-500 text-white'
                                : 'bg-slate-700 text-slate-300'
                            }`}
                          >
                            {['ক', 'খ', 'গ', 'ঘ'][optIdx] || optIdx + 1}
                          </span>
                          <span className="flex-1">{opt}</span>
                          {isSelected && <CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center text-slate-400">
                  কোনো প্রশ্ন পাওয়া যায়নি।
                </div>
              )}
            </div>

            {/* Bottom Actions Bar */}
            <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
              <button
                type="button"
                disabled={currentQuestionIdx === 0}
                onClick={() => setCurrentQuestionIdx((p) => p - 1)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold disabled:opacity-30 disabled:pointer-events-none transition-all flex items-center space-x-1.5"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>পূর্ববর্তী</span>
              </button>

              <div className="flex items-center space-x-2">
                {currentQuestionIdx < questions.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentQuestionIdx((p) => p + 1)}
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md transition-all flex items-center space-x-1.5"
                  >
                    <span>পরবর্তী প্রশ্ন</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={handleSubmitExam}
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-lg shadow-emerald-600/30 transition-all flex items-center space-x-2 active:scale-95 disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSubmitting ? 'মূল্যায়ন হচ্ছে...' : 'টেস্ট সম্পন্ন ও সাবমিট'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
