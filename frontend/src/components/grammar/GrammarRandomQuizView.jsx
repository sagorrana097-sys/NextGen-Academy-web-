import React, { useState, useEffect } from 'react';
import {
  Sparkles, Play, Sliders, CheckCircle2, Award, Clock,
  ChevronRight, BookOpen, Layers, HelpCircle, Shuffle, ShieldCheck
} from 'lucide-react';
import { GRAMMAR_CHAPTERS } from '../../data/grammar/grammarChaptersData';
import { grammarAPI } from '../../services/api';

export default function GrammarRandomQuizView({ onStartQuiz, chapters = [], subject = 'ENGLISH' }) {
  const isBangla = subject === 'BANGLA';
  const chapterList = chapters.length > 0 ? chapters : GRAMMAR_CHAPTERS;
  const [selectedChapterId, setSelectedChapterId] = useState('ALL');
  const [selectedTopicId, setSelectedTopicId] = useState('ALL');
  const [selectedDifficulty, setSelectedDifficulty] = useState('ALL');
  const [selectedMode, setSelectedMode] = useState('STANDARD'); // 'STANDARD' | 'REVISION' | 'BOARD'
  const [questionCount, setQuestionCount] = useState(10);
  const [availableCount, setAvailableCount] = useState(null);
  const [loadingCount, setLoadingCount] = useState(false);

  const selectedChapter = chapterList.find(c => String(c.id) === String(selectedChapterId));
  const availableTopics = selectedChapter?.topics || [];

  // Fetch live count of matching questions
  useEffect(() => {
    let isMounted = true;
    setLoadingCount(true);

    const params = {
      subject,
      limit: 1
    };
    if (selectedChapterId !== 'ALL') params.chapterId = selectedChapterId;
    if (selectedTopicId !== 'ALL') params.topicId = selectedTopicId;
    if (selectedDifficulty !== 'ALL') params.difficulty = selectedDifficulty;
    if (selectedMode === 'REVISION') params.mode = 'REVISION';
    if (selectedMode === 'BOARD') params.isBoardQuestion = 'true';

    grammarAPI.getMCQs(params).then(res => {
      if (isMounted && res?.success) {
        setAvailableCount(res.total || 0);
      }
    }).catch(() => {
      if (isMounted) setAvailableCount(null);
    }).finally(() => {
      if (isMounted) setLoadingCount(false);
    });

    return () => { isMounted = false; };
  }, [subject, selectedChapterId, selectedTopicId, selectedDifficulty, selectedMode]);

  const handleStart = () => {
    if (onStartQuiz) {
      onStartQuiz({
        subject,
        chapterId: selectedChapterId,
        topicId: selectedTopicId,
        difficulty: selectedDifficulty,
        count: questionCount,
        mode: selectedMode === 'REVISION' ? 'REVISION' : undefined,
        isBoardQuestion: selectedMode === 'BOARD' ? true : undefined
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3.5 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 flex items-center justify-center flex-shrink-0">
            <Shuffle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {isBangla ? 'বাংলা ব্যাকরণ কুইজ ও অ্যাসেসমেন্ট ইঞ্জিন' : 'Random Quiz & Assessment Engine'}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {isBangla 
                ? 'অধ্যায়, টপিক, কাঠিন্য ও রিভিশন মোড নির্ধারণ করে তাৎক্ষণিক সেন্ট্রাল প্রশ্নব্যাংক থেকে পরীক্ষা দিন।'
                : 'Select chapters, topics, difficulty, and question count to launch a dynamic test.'}
            </p>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>পরীক্ষার মোড (Assessment Mode):</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {[
              { id: 'STANDARD', label: 'সাধারণ অনুশীলন', sub: 'অধ্যায় বা টপিকভিত্তিক' },
              { id: 'REVISION', label: 'SSC/HSC রিভিশন', sub: 'চূড়ান্ত পরীক্ষা প্রস্তুতি' },
              { id: 'BOARD', label: 'বোর্ড প্রশ্ন স্পেশাল', sub: '১০০% যাচাইকৃত বোর্ড প্রশ্ন' }
            ].map(item => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setSelectedMode(item.id);
                  if (item.id === 'REVISION') {
                    setSelectedChapterId('ALL');
                    setSelectedTopicId('ALL');
                  }
                }}
                className={`py-3 px-3 rounded-2xl border text-left transition-all cursor-pointer ${
                  selectedMode === item.id
                    ? 'bg-indigo-600 text-white border-indigo-700 shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-indigo-400'
                }`}
              >
                <span className="block font-black text-xs">{item.label}</span>
                <span className={`text-[10px] font-medium block mt-0.5 ${selectedMode === item.id ? 'text-indigo-100' : 'text-slate-400'}`}>
                  {item.sub}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Form Controls */}
        <div className="space-y-5">
          {/* 1. Chapter Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
              <span>অধ্যায় নির্বাচন করুন (Chapter):</span>
            </label>
            <select
              value={selectedChapterId}
              disabled={selectedMode === 'REVISION'}
              onChange={(e) => {
                setSelectedChapterId(e.target.value);
                setSelectedTopicId('ALL');
              }}
              className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-sm font-medium text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden disabled:opacity-60"
            >
              <option value="ALL">সকল অধ্যায় মিলিয়ে (All {chapterList.length} Chapters Mix)</option>
              {chapterList.map(c => (
                <option key={c.id} value={c.id}>
                  Chapter {c.chapterNo || c.id} — {c.titleBn} ({c.titleEn || c.titleBn})
                </option>
              ))}
            </select>
          </div>

          {/* 2. Topic Selection (If single chapter selected) */}
          {selectedChapterId !== 'ALL' && availableTopics.length > 0 && (
            <div className="space-y-2 animate-in fade-in duration-150">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-indigo-500" />
                <span>সুনির্দিষ্ট টপিক (Topic):</span>
              </label>
              <select
                value={selectedTopicId}
                onChange={(e) => setSelectedTopicId(e.target.value)}
                className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-sm font-medium text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              >
                <option value="ALL">অধ্যায়ের সকল টপিক (All Topics in Chapter)</option>
                {availableTopics.map(t => (
                  <option key={t.id || t.slug} value={t.id}>
                    {t.topicNo ? `${t.topicNo} ` : ''}{t.titleBn}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* 3. Difficulty Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <Sliders className="w-3.5 h-3.5 text-indigo-500" />
              <span>প্রশ্নের কাঠিন্য (Difficulty Level):</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { id: 'ALL', label: 'সকল স্তর (Mixed)' },
                { id: 'EASY', label: 'সহজ (Easy)' },
                { id: 'MEDIUM', label: 'মাঝারি (Medium)' },
                { id: 'HARD', label: 'কঠিন (Hard)' }
              ].map(item => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedDifficulty(item.id)}
                  className={`py-3 px-2 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                    selectedDifficulty === item.id
                      ? 'bg-indigo-600 text-white border-indigo-700 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-indigo-400'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Number of Questions & Live Count Indicator */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-indigo-500" />
                <span>প্রশ্নের সংখ্যা ও নির্ধারিত সময়:</span>
              </label>
              <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
                {loadingCount ? 'গণনা হচ্ছে...' : availableCount !== null ? `উপলব্ধ প্রশ্ন: ${availableCount}টি` : ''}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { count: 5, time: '৫ মিনিট' },
                { count: 10, time: '১০ মিনিট' },
                { count: 15, time: '১৫ মিনিট' },
                { count: 20, time: '২০ মিনিট' }
              ].map(item => (
                <button
                  key={item.count}
                  type="button"
                  onClick={() => setQuestionCount(item.count)}
                  className={`py-3 px-2 rounded-2xl border text-center transition-all cursor-pointer ${
                    questionCount === item.count
                      ? 'bg-indigo-600 text-white border-indigo-700 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-indigo-400'
                  }`}
                >
                  <span className="block font-black text-sm">{item.count} টি প্রশ্ন</span>
                  <span className={`text-[11px] font-medium ${questionCount === item.count ? 'text-indigo-100' : 'text-slate-400'}`}>
                    {item.time}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Start Button */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            disabled={availableCount === 0}
            onClick={handleStart}
            className="w-full py-4 bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-600 hover:from-indigo-700 hover:to-blue-700 disabled:opacity-50 text-white font-black text-sm sm:text-base rounded-2xl shadow-xl shadow-indigo-600/25 flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.99]"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>
              {availableCount === 0 
                ? 'এই ফিল্টারে কোনো প্রশ্ন নেই' 
                : `${isBangla ? 'পরীক্ষা শুরু করুন' : 'Launch Assessment'} (${questionCount} Questions)`}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
