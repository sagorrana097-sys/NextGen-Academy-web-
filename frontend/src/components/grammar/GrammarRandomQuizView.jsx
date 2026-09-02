import React, { useState } from 'react';
import {
  Sparkles, Play, Sliders, CheckCircle2, Award, Clock,
  ChevronRight, BookOpen, Layers, HelpCircle, Shuffle
} from 'lucide-react';
import { GRAMMAR_CHAPTERS } from '../../data/grammar/grammarChaptersData';

export default function GrammarRandomQuizView({ onStartQuiz }) {
  const [selectedChapterId, setSelectedChapterId] = useState('ALL');
  const [selectedTopicId, setSelectedTopicId] = useState('ALL');
  const [selectedDifficulty, setSelectedDifficulty] = useState('ALL');
  const [questionCount, setQuestionCount] = useState(10);

  const selectedChapter = GRAMMAR_CHAPTERS.find(c => String(c.id) === String(selectedChapterId));
  const availableTopics = selectedChapter?.topics || [];

  const handleStart = () => {
    if (onStartQuiz) {
      onStartQuiz({
        chapterId: selectedChapterId,
        topicId: selectedTopicId,
        difficulty: selectedDifficulty,
        count: questionCount
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
              র‍্যান্ডম কুইজ ইঞ্জিন (Random Quiz Engine)
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              অধ্যায়, টপিক ও প্রশ্নের সংখ্যা নির্ধারণ করে তাৎক্ষণিক যেকোনো গ্রামার বিষয়ের ওপর পরীক্ষা দিন।
            </p>
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
              onChange={(e) => {
                setSelectedChapterId(e.target.value);
                setSelectedTopicId('ALL');
              }}
              className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-sm font-medium text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            >
              <option value="ALL">সকল অধ্যায় মিলিয়ে (All 23 Chapters Mix)</option>
              {GRAMMAR_CHAPTERS.map(c => (
                <option key={c.id} value={c.id}>
                  Chapter {c.chapterNo || c.id} — {c.titleBn} ({c.titleEn})
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
                    {t.titleBn} ({t.titleEn})
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

          {/* 4. Number of Questions */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-indigo-500" />
              <span>প্রশ্নের সংখ্যা ও নির্ধারিত সময়:</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { count: 10, time: '১০ মিনিট' },
                { count: 15, time: '১৫ মিনিট' },
                { count: 20, time: '২০ মিনিট' },
                { count: 30, time: '৩০ মিনিট' }
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
            onClick={handleStart}
            className="w-full py-4 bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-600 hover:from-indigo-700 hover:to-blue-700 text-white font-black text-sm sm:text-base rounded-2xl shadow-xl shadow-indigo-600/25 flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.99]"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>র‍্যান্ডম কুইজ শুরু করুন (Launch Quiz)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
