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
  Flame,
  Calculator,
  Target,
  Zap,
  Building2,
  QrCode
} from 'lucide-react';
import ScientificCalculatorWidget from './ScientificCalculatorWidget';
import { useProctoring } from '../../hooks/useProctoring';

export default function MCQQuizModelTestModal({ exam, isOpen, onClose, onExamFinished }) {
  const { lang } = useLanguage();
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [studentAnswers, setStudentAnswers] = useState({}); // { [qId]: optionIndex }
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [antiCheatWarnings, setAntiCheatWarnings] = useState(0);
  const [showAntiCheatAlert, setShowAntiCheatAlert] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);

  // Automated Proctoring Hook with Real-time Page Visibility & Anti-Spam Cooldown
  const { tabSwitchCount, lastWarning, clearWarning } = useProctoring({
    type: 'EXAM',
    name: exam?.titleBn || exam?.titleEn || 'অনলাইন মডেল টেস্ট',
    className: exam?.class?.nameBn || '',
    enabled: Boolean(isOpen && !exam?.hasSubmitted),
    isSubmitted: Boolean(isSubmitting)
  });


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

  // Anti-cheat tab & window blur detection with strict 3-attempt auto-submit
  useEffect(() => {
    if (!isOpen || evaluationResult || !exam || exam.hasSubmitted) return;

    let lastWarningTimestamp = 0;

    const handleViolation = (eventType) => {
      const now = Date.now();
      // Debounce rapid double-triggers within 1.2s
      if (now - lastWarningTimestamp < 1200) return;
      lastWarningTimestamp = now;

      setAntiCheatWarnings((prev) => {
        const nextCount = prev + 1;
        setShowAntiCheatAlert(true);

        if (nextCount >= 3) {
          // 3rd attempt: auto-submit exam immediately
          setTimeout(() => {
            submitMCQAnswers(true, 'ANTI_CHEAT_EXCEEDED');
          }, 600);
        }
        return nextCount;
      });
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        handleViolation('visibilitychange');
      }
    };

    const handleWindowBlur = () => {
      handleViolation('blur');
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, [isOpen, evaluationResult, exam, studentAnswers]);

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
    await submitMCQAnswers(true, 'TIME_EXPIRED');
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

  const submitMCQAnswers = async (isAuto = false, submitReason = 'NORMAL') => {
    setIsSubmitting(true);
    try {
      const payloadAnswers = questions.map((q) => ({
        questionId: q.id,
        chosenOptionIndex: studentAnswers[q.id] !== undefined ? studentAnswers[q.id] : null
      }));

      const res = await examAPI.submitExam(exam.id, {
        answers: payloadAnswers,
        isAutoSubmitted: isAuto,
        antiCheatWarnings,
        submitReason
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

  const handlePracticeWeakTopics = (topics) => {
    const topicNames = Array.isArray(topics) ? topics.join(', ') : (topics || 'দুর্বল বিষয়');
    alert(`🎯 "${topicNames}" এর ওপর বিশেষ রিভিশন ও প্র্যাকটিস সেশন প্রস্তুত করা হচ্ছে...`);
    // Filter wrong questions for targeted practice session
    const wrongQs = questions.filter((q, idx) => {
      const ev = evaluationResult?.detailedEvaluations?.[idx];
      return ev && !ev.isCorrect;
    });

    if (wrongQs.length > 0) {
      setStudentAnswers({});
      setEvaluationResult(null);
      setCurrentQuestionIdx(0);
      setTimeLeft(wrongQs.length * 90);
    }
  };

  const handlePrintScorecard = () => {
    window.print();
  };

  const totalAnswered = Object.keys(studentAnswers).length;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Print-specific style with Watermark and Clean A4 Layout */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-mcq-scorecard, #printable-mcq-scorecard * {
            visibility: visible;
          }
          #printable-mcq-scorecard {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 20px 28px;
            background: white !important;
            color: #0f172a !important;
            z-index: 99999;
          }
          .no-print {
            display: none !important;
          }
          .print-watermark {
            display: block !important;
            position: fixed;
            top: 40%;
            left: 15%;
            transform: rotate(-30deg);
            font-size: 52px;
            font-weight: 900;
            color: rgba(15, 23, 42, 0.04);
            letter-spacing: 0.2em;
            text-transform: uppercase;
            pointer-events: none;
            z-index: 0;
          }
          .print-border {
            border: 1px solid #cbd5e1 !important;
          }
          .print-bg-light {
            background-color: #f8fafc !important;
          }
        }
      `}</style>

      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-4xl w-full shadow-2xl flex flex-col overflow-hidden text-white my-auto max-h-[94vh]">
        {/* Anti-cheat Strict Integrity Warning Banner */}
        {showAntiCheatAlert && !evaluationResult && (
          <div className="bg-rose-600 text-white p-3 px-4 flex items-center justify-between text-xs font-black animate-pulse no-print shadow-lg">
            <div className="flex items-center space-x-2">
              <ShieldAlert className="w-5 h-5 text-amber-300 animate-bounce" />
              <span>
                {antiCheatWarnings >= 3
                  ? 'সতর্কতা: ৩ বার উইন্ডো পরিবর্তনের কারণে পরীক্ষা স্বয়ংক্রিয়ভাবে সমাপ্ত ও সাবমিট করা হচ্ছে!'
                  : `সতর্কতা: পরীক্ষার উইন্ডো ত্যাগ করা নিষিদ্ধ! (Warning ${antiCheatWarnings}/3)`}
              </span>
            </div>
            {antiCheatWarnings < 3 && (
              <button
                onClick={() => setShowAntiCheatAlert(false)}
                className="p-1 hover:bg-rose-700 rounded-lg text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* VIEW 1: RESULTS & EVALUATION WITH LEADERBOARD */}
        {/* ---------------------------------------------------- */}
        {evaluationResult ? (
          <div id="printable-mcq-scorecard" className="flex flex-col flex-1 overflow-hidden relative">
            {/* Watermark for Print */}
            <div className="print-watermark hidden">
              NEXTGEN ACADEMY • OFFICIAL EXAM
            </div>

            {/* Official Institutional Header for Print */}
            <div className="hidden print:flex items-center justify-between border-b-2 border-slate-900 pb-3 mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-xl bg-slate-950 flex items-center justify-center text-amber-400 border border-slate-800">
                  <Building2 className="w-7 h-7" />
                </div>
                <div>
                  <h1 className="text-xl font-black text-slate-950 tracking-wide">নেক্সটজেন একাডেমি (NextGen Academy)</h1>
                  <p className="text-[11px] text-slate-700 font-semibold">
                    পশ্চিম জয়দেবপুর, বাস-স্ট্যান্ড, গাজীপুর • হেল্পলাইন: ০১৭৯২৮১৮০০৫ • info@nextgen.edu.bd
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[11px] font-black uppercase px-2.5 py-1 rounded bg-slate-100 border border-slate-300 text-slate-900">
                  অফিসিয়াল সলিউশন ও মার্কশিট
                </span>
                <p className="text-[10px] text-slate-500 font-mono mt-1">
                  তারিখ: {new Date().toLocaleDateString('bn-BD')}
                </p>
              </div>
            </div>

            {/* UI Header */}
            <div className="p-5 bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 border-b border-slate-700 flex items-center justify-between no-print">
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
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl shadow-md flex items-center space-x-1.5 transition-all active:scale-95"
                  title="A4 সাইজ ফরম্যাটে প্রশ্ন ও পূর্ণাঙ্গ সমাধান প্রিন্ট করুন"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>প্রশ্ন ও সমাধান প্রিন্ট</span>
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
            <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-slate-950/60 print:bg-white print:p-0 print:space-y-4">
              <div className="p-5 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl border border-slate-700 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left print:border-slate-300 print:bg-slate-50 print:text-slate-950">
                <div className="space-y-1">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                      evaluationResult.passed
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 print:text-emerald-800 print:bg-emerald-100'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/30 print:text-rose-800 print:bg-rose-100'
                    }`}
                  >
                    {evaluationResult.passed ? '🎉 উত্তীর্ণ (PASSED)' : '❌ অনুত্তীর্ণ (FAILED)'}
                  </span>
                  <h4 className="text-xl sm:text-2xl font-black text-white print:text-slate-950">
                    প্রাপ্ত নেট স্কোর: {evaluationResult.obtainedScore} / {evaluationResult.totalScore}
                  </h4>
                  <p className="text-xs text-slate-300 print:text-slate-600">
                    শতকরা হার: <span className="font-bold text-amber-300 print:text-amber-700">{evaluationResult.percentage}%</span>
                  </p>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="p-3.5 rounded-2xl bg-slate-800 border border-slate-700 text-center min-w-[90px] print:bg-white print:border-slate-300">
                    <span className="text-[10px] text-slate-400 print:text-slate-500 font-bold block uppercase">গ্রেড</span>
                    <span className="text-xl font-black text-emerald-400 print:text-emerald-700">
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

              {/* AI Cut-off & Negative Mark Analyzer (Module 2) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 print:grid-cols-3">
                {/* Card 1: Expected Cut-off Marks */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 space-y-2 print:bg-slate-50 print:border-slate-300">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-indigo-300 print:text-indigo-950 flex items-center space-x-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>AI প্রত্যাশিত কাট-অফ</span>
                    </span>
                    <span className="font-mono font-black text-xs text-amber-300 bg-indigo-950 px-2 py-0.5 rounded border border-indigo-700 print:text-indigo-900 print:bg-indigo-100">
                      {evaluationResult.expectedCutOff || Math.round((evaluationResult.totalScore || 20) * 0.65)} / {evaluationResult.totalScore}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs text-slate-300 print:text-slate-700">স্ট্যাটাস:</span>
                    {(evaluationResult.obtainedScore >= (evaluationResult.expectedCutOff || Math.round((evaluationResult.totalScore || 20) * 0.65))) ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold print:bg-emerald-100 print:text-emerald-800">
                        🎉 Safe Zone
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[11px] font-bold print:bg-rose-100 print:text-rose-800">
                        ⚠️ Review Needed
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 print:text-slate-500">পরীক্ষার কাঠিন্যের মাত্রা ও মেধার ভিত্তিতে এআই প্রেডিকশন</p>
                </div>

                {/* Card 2: Negative Mark Loss Breakdown */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 via-rose-950/30 to-slate-900 border border-rose-500/30 space-y-2 print:bg-slate-50 print:border-slate-300">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-rose-300 print:text-rose-900 flex items-center space-x-1.5">
                      <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                      <span>নেগেটিভ মার্কিং বিশ্লেষণ</span>
                    </span>
                    <span className="font-mono font-black text-xs text-rose-400 bg-rose-950 px-2 py-0.5 rounded border border-rose-700 print:bg-rose-100 print:text-rose-800">
                      -{evaluationResult.negativeLoss !== undefined ? evaluationResult.negativeLoss : (evaluationResult.detailedEvaluations?.filter(e => !e.isCorrect && e.chosenIndex !== -1)?.length * 0.25 || 0).toFixed(2)} নম্বর
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-300 print:text-slate-700 flex items-center justify-between pt-1">
                    <span>গ্রস: <strong>{evaluationResult.grossScore || evaluationResult.detailedEvaluations?.filter(e => e.isCorrect)?.length || evaluationResult.obtainedScore}</strong></span>
                    <span>ভুল উত্তর: <strong>{evaluationResult.wrongCount !== undefined ? evaluationResult.wrongCount : evaluationResult.detailedEvaluations?.filter(e => !e.isCorrect && e.chosenIndex !== -1)?.length || 0}টি</strong></span>
                  </div>
                  <p className="text-[10px] text-slate-400 print:text-slate-500">প্রতিটি ভুল উত্তরের জন্য ০.২৫ নম্বর কর্তন করা হয়েছে</p>
                </div>

                {/* Card 3: Weakest Subject Areas & 1-Click Practice Button */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 via-amber-950/30 to-slate-900 border border-amber-500/30 space-y-2 print:bg-slate-50 print:border-slate-300">
                  <span className="text-[11px] font-bold text-amber-300 print:text-amber-900 flex items-center space-x-1.5">
                    <Target className="w-3.5 h-3.5 text-amber-400" />
                    <span>শীর্ষ দুর্বল বিষয় (Weak Topics)</span>
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {(evaluationResult.weakTopics && evaluationResult.weakTopics.length > 0
                      ? evaluationResult.weakTopics
                      : ['গতির সমীকরণ ও ত্বরণ', 'তাপ ও তাপমাত্রা']
                    ).map((topic, tIdx) => (
                      <span key={tIdx} className="px-2 py-0.5 rounded-lg bg-amber-500/20 text-amber-200 text-[10px] font-semibold border border-amber-500/30 truncate max-w-full print:bg-amber-100 print:text-amber-900">
                        ⚠️ {topic}
                      </span>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => handlePracticeWeakTopics(evaluationResult.weakTopics)}
                    className="w-full mt-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black text-xs rounded-xl shadow-md flex items-center justify-center space-x-1.5 transition-all active:scale-95 no-print"
                  >
                    <Zap className="w-3.5 h-3.5 fill-slate-950" />
                    <span>দুর্বল টপিক অনুশীলন করুন</span>
                  </button>
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
                        className={`p-4 rounded-2xl border text-xs space-y-2.5 transition-all print:border-slate-300 print:bg-white print:p-3 print:text-slate-900 ${
                          ev.isCorrect
                            ? 'bg-emerald-950/20 border-emerald-500/30 print:bg-emerald-50/40'
                            : 'bg-rose-950/20 border-rose-500/30 print:bg-rose-50/40'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-bold text-slate-200 text-sm print:text-slate-950">
                            {idx + 1}. {ev.questionBn}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-black flex items-center space-x-1 flex-shrink-0 ${
                              ev.isCorrect
                                ? 'bg-emerald-500/20 text-emerald-300 print:text-emerald-800 print:bg-emerald-100'
                                : 'bg-rose-500/20 text-rose-300 print:text-rose-800 print:bg-rose-100'
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

                            let badgeColor = 'bg-slate-800/80 text-slate-300 border-slate-700 print:bg-white print:border-slate-300 print:text-slate-700';
                            if (isActualCorrect) {
                              badgeColor = 'bg-emerald-600/30 text-emerald-200 border-emerald-500/50 font-bold print:bg-emerald-100 print:text-emerald-900 print:border-emerald-500';
                            } else if (isChosen && !ev.isCorrect) {
                              badgeColor = 'bg-rose-600/30 text-rose-200 border-rose-500/50 line-through print:bg-rose-100 print:text-rose-900 print:border-rose-400';
                            }

                            return (
                              <div
                                key={optIdx}
                                className={`p-2.5 rounded-xl border text-[11px] flex items-center space-x-2 ${badgeColor}`}
                              >
                                <span className="w-5 h-5 rounded-full bg-slate-700 print:bg-slate-200 print:text-slate-900 flex items-center justify-center font-bold text-[10px] flex-shrink-0">
                                  {['ক', 'খ', 'গ', 'ঘ'][optIdx] || optIdx + 1}
                                </span>
                                <span className="truncate">{opt}</span>
                                {isActualCorrect && <Check className="w-3.5 h-3.5 text-emerald-400 print:text-emerald-700 ml-auto flex-shrink-0" />}
                                {isChosen && !ev.isCorrect && <X className="w-3.5 h-3.5 text-rose-400 print:text-rose-700 ml-auto flex-shrink-0" />}
                              </div>
                            );
                          })}
                        </div>

                        {/* Explanation */}
                        {ev.explanation && (
                          <div className="mt-2 p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-300 flex items-start space-x-2 print:bg-slate-50 print:border-slate-300 print:text-slate-800">
                            <HelpCircle className="w-3.5 h-3.5 text-amber-400 print:text-amber-700 shrink-0 mt-0.5" />
                            <span><strong>ব্যাখ্যা:</strong> {ev.explanation}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Print Footer Verification Seal */}
                  <div className="hidden print:flex items-center justify-between pt-6 mt-6 border-t-2 border-slate-300 text-[11px] text-slate-600">
                    <div>
                      <p className="font-bold text-slate-900">নেক্সটজেন একাডেমি পরীক্ষা ও মূল্যায়ন সেল</p>
                      <p>কম্পিউটার জেনারেটেড সত্যায়িত রেজাল্ট শিট</p>
                    </div>
                    <div className="w-28 h-12 border-2 border-dashed border-emerald-600 rounded-xl flex items-center justify-center text-emerald-800 font-bold text-[10px] uppercase">
                      ✓ VERIFIED SEAL
                    </div>
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

              <div className="flex items-center space-x-2 sm:space-x-3">
                {/* Scientific Calculator Trigger in Header */}
                <button
                  type="button"
                  onClick={() => setShowCalculator(!showCalculator)}
                  className={`px-3 py-1.5 rounded-2xl border flex items-center space-x-1.5 text-xs font-bold transition-all shadow-md active:scale-95 ${
                    showCalculator
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 ring-2 ring-amber-400/20'
                      : 'bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border-indigo-500/30'
                  }`}
                  title="সায়েন্টিফিক ক্যালকুলেটর (Scientific Calculator)"
                >
                  <Calculator className="w-4 h-4 text-amber-400" />
                  <span className="hidden sm:inline">সায়েন্টিফিক ক্যালকুলেটর</span>
                </button>

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

      {/* Floating Action Button (FAB) for Instant Quick Access */}
      {!evaluationResult && (
        <button
          type="button"
          onClick={() => setShowCalculator(!showCalculator)}
          className={`fixed bottom-6 right-6 z-40 px-4 py-2.5 rounded-full font-black text-xs shadow-2xl flex items-center space-x-2 border-2 transition-all transform active:scale-95 hover:scale-105 no-print ${
            showCalculator
              ? 'bg-slate-900 text-amber-300 border-amber-500/80 shadow-amber-500/20 ring-4 ring-amber-500/10'
              : 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-slate-950 border-amber-300 shadow-amber-500/30'
          }`}
          title="Scientific Calculator / সায়েন্টিফিক ক্যালকুলেটর"
        >
          <Calculator className="w-4 h-4" />
          <span>{showCalculator ? 'ক্যালকুলেটর বন্ধ করুন' : 'সায়েন্টিফিক ক্যালকুলেটর'}</span>
        </button>
      )}

      {/* Persistent Client-Side Scientific Calculator Widget */}
      <ScientificCalculatorWidget
        isOpen={showCalculator}
        onClose={() => setShowCalculator(false)}
      />
    </div>
  );
}
