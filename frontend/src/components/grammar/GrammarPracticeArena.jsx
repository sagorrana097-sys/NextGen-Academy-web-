import React, { useState, useEffect } from 'react';
import {
  ListChecks, BookOpen, Layers, Sliders, CheckCircle2,
  XCircle, HelpCircle, ArrowRight, RotateCcw, Award, Check, X
} from 'lucide-react';
import { grammarAPI } from '../../services/api';
import { GRAMMAR_CHAPTERS } from '../../data/grammar/grammarChaptersData';

export default function GrammarPracticeArena({ defaultChapterId, onTakeModelTest, chapters = [], subject = 'ENGLISH' }) {
  const chapterList = chapters.length > 0 ? chapters : GRAMMAR_CHAPTERS;
  const initialChapterId = defaultChapterId || chapterList[0]?.id || 1;
  const [selectedChapterId, setSelectedChapterId] = useState(initialChapterId);
  const [selectedTopicId, setSelectedTopicId] = useState('ALL');
  const [selectedDifficulty, setSelectedDifficulty] = useState('ALL');
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userAnswers, setUserAnswers] = useState({});
  const [revealedExplanations, setRevealedExplanations] = useState(new Set());

  const selectedChapter = chapterList.find(c => String(c.id) === String(selectedChapterId)) || chapterList[0];
  const availableTopics = selectedChapter?.topics || [];

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setUserAnswers({});
    setRevealedExplanations(new Set());

    const params = { subject };
    if (selectedChapterId && selectedChapterId !== 'ALL') params.chapterId = selectedChapterId;
    if (selectedTopicId && selectedTopicId !== 'ALL') params.topicId = selectedTopicId;
    if (selectedDifficulty && selectedDifficulty !== 'ALL') params.difficulty = selectedDifficulty;

    grammarAPI.getMCQs(params).then(res => {
      if (isMounted && res?.success && Array.isArray(res.data)) {
        setQuestions(res.data);
      }
    }).catch(() => {}).finally(() => {
      if (isMounted) setLoading(false);
    });

    return () => { isMounted = false; };
  }, [selectedChapterId, selectedTopicId, selectedDifficulty, subject]);


  const handleSelectAnswer = (qId, optIdx) => {
    setUserAnswers(prev => ({
      ...prev,
      [qId]: optIdx
    }));
    // Auto reveal explanation
    setRevealedExplanations(prev => new Set(prev).add(qId));
  };

  const letter = (idx) => String.fromCharCode(65 + idx);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Filter Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
              <ListChecks className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-lg text-slate-900 dark:text-white">
                চ্যাপ্টার ও টপিকভিত্তিক প্র্যাকটিস এরিনা (Practice Arena)
              </h3>
              <p className="text-xs text-slate-400">
                স্বশিক্ষিত অনুশীলন: উত্তর নির্বাচন করার সাথে সাথে নির্ভুল ব্যাখ্যা ও বিশ্লেষণ দেখুন।
              </p>
            </div>
          </div>

          {onTakeModelTest && (
            <button
              type="button"
              onClick={onTakeModelTest}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm cursor-pointer transition-colors"
            >
              টাইমড মডেল টেস্ট দিন →
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {/* Chapter */}
          <div>
            <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1.5">
              অধ্যায় (Chapter):
            </label>
            <select
              value={selectedChapterId}
              onChange={(e) => {
                setSelectedChapterId(e.target.value);
                setSelectedTopicId('ALL');
              }}
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-900 dark:text-slate-100"
            >
              {chapterList.map(c => (
                <option key={c.id} value={c.id}>
                  Ch {c.chapterNo || c.id} — {c.titleBn}
                </option>
              ))}
            </select>
          </div>


          {/* Topic */}
          <div>
            <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1.5">
              টপিক (Topic):
            </label>
            <select
              value={selectedTopicId}
              onChange={(e) => setSelectedTopicId(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-900 dark:text-slate-100"
            >
              <option value="ALL">সকল টপিক মিলিয়ে ({availableTopics.length}টি টপিক)</option>
              {availableTopics.map(t => (
                <option key={t.id || t.slug} value={t.id}>
                  {t.titleBn}
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty */}
          <div>
            <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1.5">
              কাঠিন্যের স্তর (Difficulty):
            </label>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-900 dark:text-slate-100"
            >
              <option value="ALL">সকল স্তর (All)</option>
              <option value="EASY">সহজ (Easy)</option>
              <option value="MEDIUM">মাঝারি (Medium)</option>
              <option value="HARD">কঠিন (Hard)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Questions Feed */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 text-xs">প্রশ্ন লোড হচ্ছে...</div>
      ) : questions.length === 0 ? (
        <div className="p-12 bg-white dark:bg-slate-900 rounded-3xl text-center border border-slate-200 dark:border-slate-800 space-y-2">
          <HelpCircle className="w-8 h-8 text-slate-400 mx-auto" />
          <p className="text-sm font-bold text-slate-600 dark:text-slate-300">
            এই ফিল্টারে কোনো প্রশ্ন পাওয়া যায়নি।
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span>পাওয়া গেছে: <strong>{questions.length}টি প্রশ্ন</strong></span>
            <span>অনুশীলন সম্পন্ন: <strong>{Object.keys(userAnswers).length} / {questions.length}</strong></span>
          </div>

          {questions.map((q, idx) => {
            const userAns = userAnswers[q.id];
            const isAnswered = userAns !== undefined;
            const isCorrect = isAnswered && userAns === q.correctOptionIndex;

            return (
              <div
                key={q.id}
                className={`p-6 rounded-3xl border bg-white dark:bg-slate-900 space-y-4 transition-all ${
                  isAnswered
                    ? isCorrect
                      ? 'border-emerald-300 dark:border-emerald-800/80 ring-1 ring-emerald-500/10'
                      : 'border-rose-300 dark:border-rose-800/80 ring-1 ring-rose-500/10'
                    : 'border-slate-200/80 dark:border-slate-800'
                }`}
              >
                {/* Header */}
                <div className="flex items-center justify-between gap-2">
                  <span className="w-7 h-7 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono font-bold text-xs flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {q.difficulty && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500">
                        {q.difficulty}
                      </span>
                    )}
                    {q.board && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                        {q.board} '{q.year}
                      </span>
                    )}
                  </div>
                </div>

                {/* Question */}
                <div className="space-y-1">
                  <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white font-english">
                    {q.questionEn || q.question}
                  </h4>
                  {q.questionBn && (
                    <p className="text-xs text-slate-500">{q.questionBn}</p>
                  )}
                </div>

                {/* Options */}
                <div className="space-y-2 pt-1">
                  {q.options?.map((opt, optIdx) => {
                    const isSelected = userAns === optIdx;
                    const isRightAnswer = isAnswered && optIdx === q.correctOptionIndex;

                    let optStyle = 'border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 hover:border-indigo-300';
                    if (isAnswered) {
                      if (isRightAnswer) {
                        optStyle = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-bold';
                      } else if (isSelected) {
                        optStyle = 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200';
                      }
                    }

                    return (
                      <button
                        key={optIdx}
                        type="button"
                        onClick={() => handleSelectAnswer(q.id, optIdx)}
                        className={`w-full p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all cursor-pointer text-xs sm:text-sm ${optStyle}`}
                      >
                        <span className={`w-6 h-6 rounded-lg font-mono font-bold text-xs flex items-center justify-center flex-shrink-0 ${
                          isRightAnswer
                            ? 'bg-emerald-600 text-white'
                            : isSelected
                            ? 'bg-rose-600 text-white'
                            : 'bg-white dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700'
                        }`}>
                          {letter(optIdx)}
                        </span>
                        <span className="font-english flex-1 leading-relaxed pt-0.5">
                          {opt}
                        </span>
                        {isRightAnswer && <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />}
                        {isSelected && !isRightAnswer && <X className="w-4 h-4 text-rose-500 flex-shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation Card */}
                {isAnswered && (q.explanationBn || q.explanationEn) && (
                  <div className="mt-3 p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 text-xs space-y-1 animate-in fade-in duration-150">
                    <span className="font-bold text-indigo-700 dark:text-indigo-300 flex items-center gap-1.5">
                      <HelpCircle className="w-4 h-4" />
                      <span>বিশ্লেষণ ও নিয়ম (Explanation):</span>
                    </span>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-bangla">
                      {q.explanationBn || q.explanationEn}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
