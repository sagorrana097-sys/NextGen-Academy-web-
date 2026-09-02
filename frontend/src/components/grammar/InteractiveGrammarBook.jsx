import React, { useState, useEffect } from 'react';
import {
  BookA, Sparkles, Layers, ListChecks, Award, Clock, Bookmark,
  TrendingUp, Search, RefreshCw, ChevronRight, HelpCircle
} from 'lucide-react';
import { grammarAPI } from '../../services/api';
import { GRAMMAR_CHAPTERS, GRAMMAR_TOPICS_DATABASE } from '../../data/grammar/grammarChaptersData';
import GrammarChapterNavigator from './GrammarChapterNavigator';
import GrammarTopicDetailView from './GrammarTopicDetailView';
import GrammarPracticeArena from './GrammarPracticeArena';
import GrammarBoardQuestionVault from './GrammarBoardQuestionVault';
import GrammarModelTestCenter from './GrammarModelTestCenter';
import GrammarProgressTracker from './GrammarProgressTracker';

export default function InteractiveGrammarBook() {
  const [activeTab, setActiveTab] = useState('CHAPTERS'); // 'CHAPTERS' | 'READER' | 'PRACTICE' | 'BOARD' | 'MODEL_TEST' | 'PROGRESS'
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [currentChapter, setCurrentChapter] = useState(null);
  const [currentTopic, setCurrentTopic] = useState(GRAMMAR_TOPICS_DATABASE['present-indefinite-tense']);
  
  const [completedTopicIds, setCompletedTopicIds] = useState([]);
  const [bookmarkedTopicIds, setBookmarkedTopicIds] = useState([]);

  useEffect(() => {
    // Hydrate progress & bookmarks from server
    grammarAPI.getMyProgress().then(res => {
      if (res?.success && Array.isArray(res.data)) {
        setCompletedTopicIds(res.data.filter(p => p.isCompleted).map(p => p.topicId));
      }
    }).catch(() => {});

    grammarAPI.getMyBookmarks().then(res => {
      if (res?.success && Array.isArray(res.data)) {
        setBookmarkedTopicIds(res.data.map(b => b.topicId));
      }
    }).catch(() => {});
  }, []);

  const handleSelectChapter = (chapter) => {
    setCurrentChapter(chapter);
    // Find default topic for this chapter
    const topicKey = Object.keys(GRAMMAR_TOPICS_DATABASE).find(
      k => GRAMMAR_TOPICS_DATABASE[k].chapterId === chapter.id || GRAMMAR_TOPICS_DATABASE[k].chapterSlug === chapter.slug
    );
    if (topicKey) {
      setCurrentTopic(GRAMMAR_TOPICS_DATABASE[topicKey]);
    } else {
      // Default fallback
      setCurrentTopic(GRAMMAR_TOPICS_DATABASE['present-indefinite-tense']);
    }
    setActiveTab('READER');
  };

  const handleToggleComplete = async () => {
    if (!currentTopic) return;
    const isComp = completedTopicIds.includes(currentTopic.id);
    const updated = isComp ? completedTopicIds.filter(id => id !== currentTopic.id) : [...completedTopicIds, currentTopic.id];
    setCompletedTopicIds(updated);
    try {
      await grammarAPI.toggleComplete({ topicId: currentTopic.id, isCompleted: !isComp });
    } catch (e) {}
  };

  const handleToggleBookmark = async () => {
    if (!currentTopic) return;
    const isBook = bookmarkedTopicIds.includes(currentTopic.id);
    const updated = isBook ? bookmarkedTopicIds.filter(id => id !== currentTopic.id) : [...bookmarkedTopicIds, currentTopic.id];
    setBookmarkedTopicIds(updated);
    try {
      await grammarAPI.toggleBookmark({ topicId: currentTopic.id });
    } catch (e) {}
  };

  const handleNextTopic = () => {
    const topicKeys = Object.keys(GRAMMAR_TOPICS_DATABASE);
    const currentIdx = topicKeys.findIndex(k => GRAMMAR_TOPICS_DATABASE[k].id === currentTopic?.id);
    if (currentIdx !== -1 && currentIdx < topicKeys.length - 1) {
      setCurrentTopic(GRAMMAR_TOPICS_DATABASE[topicKeys[currentIdx + 1]]);
    }
  };

  const handlePreviousTopic = () => {
    const topicKeys = Object.keys(GRAMMAR_TOPICS_DATABASE);
    const currentIdx = topicKeys.findIndex(k => GRAMMAR_TOPICS_DATABASE[k].id === currentTopic?.id);
    if (currentIdx > 0) {
      setCurrentTopic(GRAMMAR_TOPICS_DATABASE[topicKeys[currentIdx - 1]]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Hero Banner */}
      <div className="p-6 sm:p-7 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-3xl shadow-xl text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="p-3.5 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-inner">
            <BookA className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2 flex-wrap">
              <span>Interactive English Grammar Book</span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white font-mono font-bold text-[10px] uppercase tracking-wider">
                SSC & HSC Master Book
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              ২৩টি পূর্ণাঙ্গ অধ্যায়, ১০০+ টপিক, রুলস ফর্মুলা, বোর্ড প্রশ্ন ও মডেল টেস্ট
            </p>
          </div>
        </div>
      </div>

      {/* 6 Modular Navigation Tabs */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl p-2 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-wrap items-center gap-1.5 sm:gap-2">
        <button
          type="button"
          onClick={() => setActiveTab('CHAPTERS')}
          className={`px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'CHAPTERS'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25'
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <BookA className="w-4 h-4" />
          <span>📚 অধ্যায়সমূহ (Chapters)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('READER')}
          className={`px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'READER'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>📖 রুলস ও পাঠ্যবই (Rules Reader)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('PRACTICE')}
          className={`px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'PRACTICE'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/25'
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <ListChecks className="w-4 h-4" />
          <span>✍️ প্র্যাকটিস এরিনা (MCQ & Written)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('BOARD')}
          className={`px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'BOARD'
              ? 'bg-amber-600 text-white shadow-md shadow-amber-600/25'
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>🏛️ বোর্ড প্রশ্ন ব্যাংক (Board Vault)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('MODEL_TEST')}
          className={`px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'MODEL_TEST'
              ? 'bg-rose-600 text-white shadow-md shadow-rose-600/25'
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>⏱️ মডেল টেস্ট (Model Tests)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('PROGRESS')}
          className={`px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'PROGRESS'
              ? 'bg-teal-600 text-white shadow-md shadow-teal-600/25'
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>📊 আমার প্রগ্রেস (My Progress)</span>
        </button>
      </div>

      {/* Main Tab Render */}
      {activeTab === 'CHAPTERS' && (
        <GrammarChapterNavigator
          chapters={GRAMMAR_CHAPTERS}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSelectChapter={handleSelectChapter}
          completedTopicIds={completedTopicIds}
          bookmarkedTopicIds={bookmarkedTopicIds}
        />
      )}

      {activeTab === 'READER' && (
        <GrammarTopicDetailView
          topic={currentTopic}
          onBackToChapters={() => setActiveTab('CHAPTERS')}
          isCompleted={completedTopicIds.includes(currentTopic?.id)}
          onToggleComplete={handleToggleComplete}
          isBookmarked={bookmarkedTopicIds.includes(currentTopic?.id)}
          onToggleBookmark={handleToggleBookmark}
          onOpenPractice={() => setActiveTab('PRACTICE')}
          onOpenBoardQuestions={() => setActiveTab('BOARD')}
          onPreviousTopic={handlePreviousTopic}
          onNextTopic={handleNextTopic}
        />
      )}

      {activeTab === 'PRACTICE' && (
        <GrammarPracticeArena
          topic={currentTopic}
          onBackToTopic={() => setActiveTab('READER')}
        />
      )}

      {activeTab === 'BOARD' && (
        <GrammarBoardQuestionVault
          topic={currentTopic}
        />
      )}

      {activeTab === 'MODEL_TEST' && (
        <GrammarModelTestCenter />
      )}

      {activeTab === 'PROGRESS' && (
        <GrammarProgressTracker
          chapters={GRAMMAR_CHAPTERS}
          completedTopicIds={completedTopicIds}
          bookmarkedTopicIds={bookmarkedTopicIds}
          onSelectTopic={(t) => {
            setCurrentTopic(t);
            setActiveTab('READER');
          }}
        />
      )}
    </div>
  );
}
