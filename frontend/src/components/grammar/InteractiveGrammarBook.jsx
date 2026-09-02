import React, { useState, useEffect, useCallback } from 'react';
import {
  BookOpen, Sparkles, Layers, ListChecks, Award, Bookmark,
  TrendingUp, Search, RefreshCw, Menu, ChevronRight, X,
  CheckCircle2, Compass, Shuffle, BarChart3, Database
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { grammarAPI } from '../../services/api';
import { GRAMMAR_CHAPTERS, GRAMMAR_TOPICS_DATABASE } from '../../data/grammar/grammarChaptersData';
import GrammarSidebar from './GrammarSidebar';
import GrammarTopicPage from './GrammarTopicPage';
import GrammarBoardQuestionVault from './GrammarBoardQuestionVault';
import GrammarModelTestCenter from './GrammarModelTestCenter';
import GrammarProgressTracker from './GrammarProgressTracker';
import GrammarRightPanel from './GrammarRightPanel';
import GrammarExamInterface from './GrammarExamInterface';
import GrammarExamResult from './GrammarExamResult';
import GrammarPracticeArena from './GrammarPracticeArena';
import GrammarRandomQuizView from './GrammarRandomQuizView';
import GrammarPerformanceAnalytics from './GrammarPerformanceAnalytics';
import GrammarQuestionBankAdmin from './GrammarQuestionBankAdmin';

export default function InteractiveGrammarBook() {
  const { user } = useAuth();
  const isTeacherOrAdmin = ['ADMIN', 'SUPER_ADMIN', 'TEACHER'].includes(String(user?.role || '').toUpperCase());

  const [chapters, setChapters] = useState(GRAMMAR_CHAPTERS);
  const [activeChapter, setActiveChapter] = useState(GRAMMAR_CHAPTERS[6] || GRAMMAR_CHAPTERS[0]); // Tense by default
  const [currentTopic, setCurrentTopic] = useState(GRAMMAR_TOPICS_DATABASE['present-tense-simple-continuous'] || Object.values(GRAMMAR_TOPICS_DATABASE)[0]);
  
  // 'TOPIC' | 'PRACTICE' | 'RANDOM_QUIZ' | 'MODEL_TEST' | 'EXAM' | 'RESULT' | 'BOARD_VAULT' | 'PROGRESS' | 'QUESTION_BANK'
  const [activeView, setActiveView] = useState('TOPIC');
  const [isSidebarOpenMobile, setIsSidebarOpenMobile] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  // Active Exam Session State
  const [examSession, setExamSession] = useState(null);
  const [examResult, setExamResult] = useState(null);
  const [isSubmittingExam, setIsSubmittingExam] = useState(false);


  // User state
  const [completedTopicIds, setCompletedTopicIds] = useState([]);
  const [bookmarkedTopicIds, setBookmarkedTopicIds] = useState([]);
  const [overallMetrics, setOverallMetrics] = useState({
    percentage: 15,
    completedCount: 2,
    totalCount: 23
  });

  // Fetch real data on mount
  useEffect(() => {
    let isMounted = true;

    // 1. Fetch chapters from API
    grammarAPI.getChapters().then(res => {
      if (isMounted && res?.success && Array.isArray(res.data) && res.data.length > 0) {
        // Merge topics from static data into API chapters if not yet populated
        const merged = res.data.map(c => {
          const staticMatch = GRAMMAR_CHAPTERS.find(sc => sc.id === c.id || sc.slug === c.slug);
          return {
            ...c,
            topics: c.topics?.length ? c.topics : (staticMatch?.topics || [])
          };
        });
        setChapters(merged);
        if (merged.length > 0 && !activeChapter) {
          setActiveChapter(merged[6] || merged[0]);
        }
      }
    }).catch(() => {
      // Fallback to static data
      setChapters(GRAMMAR_CHAPTERS);
    });

    // 2. Fetch student progress
    grammarAPI.getMyProgress().then(res => {
      if (isMounted && res?.success && res.data) {
        const summary = res.data.summary;
        if (summary) {
          setOverallMetrics({
            percentage: summary.completionPercentage || 0,
            completedCount: summary.completedTopicsCount || 0,
            totalCount: summary.totalTopicsCount || 23
          });
        }
        if (Array.isArray(res.data.topicProgress)) {
          setCompletedTopicIds(res.data.topicProgress.filter(p => p.isCompleted).map(p => p.topicId));
        }
      }
    }).catch(() => {});

    // 3. Fetch bookmarks
    grammarAPI.getBookmarks().then(res => {
      if (isMounted && res?.success && Array.isArray(res.data)) {
        setBookmarkedTopicIds(res.data.map(b => b.itemId));
      }
    }).catch(() => {});

    return () => { isMounted = false; };
  }, []);

  // Fetch single topic details when slug changes
  const loadTopicDetails = useCallback(async (slugOrId) => {
    try {
      const res = await grammarAPI.getTopicDetails(slugOrId);
      if (res?.success && res.data) {
        // Blend API rich data with local fallback
        const local = GRAMMAR_TOPICS_DATABASE[slugOrId] || {};
        setCurrentTopic({
          ...local,
          ...res.data,
          formulas: res.data.rules?.length ? res.data.rules.map(r => ({ label: r.nameBn, structure: r.formula, example: r.examples?.[0]?.en })) : (local.formulas || []),
          rules: res.data.rules || local.rules || [],
          exceptions: res.data.exceptions || local.exceptions || [],
          commonMistakes: res.data.commonMistakes || local.commonMistakes || [],
          mcqs: res.data.questions?.length ? res.data.questions : (local.mcqs || []),
          boardQuestions: res.data.boardQuestions?.length ? res.data.boardQuestions : (local.boardQuestions || []),
          writtenPractice: res.data.writtenPractice || local.writtenPractice || []
        });
        return;
      }
    } catch (e) {}

    // Fallback to local
    if (GRAMMAR_TOPICS_DATABASE[slugOrId]) {
      setCurrentTopic(GRAMMAR_TOPICS_DATABASE[slugOrId]);
    }
  }, []);

  // Select Chapter
  const handleSelectChapter = (chap) => {
    setActiveChapter(chap);
    setActiveView('TOPIC');
    const firstTopic = chap.topics?.[0];
    if (firstTopic) {
      loadTopicDetails(firstTopic.slug || firstTopic.id);
    }
  };

  // Select Topic
  const handleSelectTopic = (top, chap) => {
    if (chap) setActiveChapter(chap);
    setActiveView('TOPIC');
    loadTopicDetails(top.slug || top.id);
  };

  // Toggle Complete
  const handleToggleComplete = async () => {
    if (!currentTopic) return;
    const isComp = completedTopicIds.includes(currentTopic.id);
    const updated = isComp
      ? completedTopicIds.filter(id => id !== currentTopic.id)
      : [...completedTopicIds, currentTopic.id];
    setCompletedTopicIds(updated);

    // Update overall metrics visually
    setOverallMetrics(prev => ({
      ...prev,
      completedCount: updated.length,
      percentage: Math.min(100, Math.round((updated.length / (prev.totalCount || 23)) * 100))
    }));

    try {
      await grammarAPI.updateProgress({
        topicId: currentTopic.id,
        isCompleted: !isComp
      });
    } catch (e) {}
  };

  // Toggle Bookmark
  const handleToggleBookmark = async () => {
    if (!currentTopic) return;
    const isBook = bookmarkedTopicIds.includes(currentTopic.id);
    const updated = isBook
      ? bookmarkedTopicIds.filter(id => id !== currentTopic.id)
      : [...bookmarkedTopicIds, currentTopic.id];
    setBookmarkedTopicIds(updated);

    try {
      if (isBook) {
        // Delete bookmark
        const existing = await grammarAPI.getBookmarks();
        const found = existing?.data?.find(b => b.itemId === currentTopic.id);
        if (found?.id) await grammarAPI.deleteBookmark(found.id);
      } else {
        await grammarAPI.addBookmark({
          itemType: 'TOPIC',
          itemId: currentTopic.id,
          customNote: currentTopic.titleBn
        });
      }
    } catch (e) {}
  };

  // Previous & Next navigation
  const allTopicKeys = Object.keys(GRAMMAR_TOPICS_DATABASE);
  const currentKeyIndex = allTopicKeys.findIndex(k => GRAMMAR_TOPICS_DATABASE[k].id === currentTopic?.id);
  const hasPrevious = currentKeyIndex > 0;
  const hasNext = currentKeyIndex !== -1 && currentKeyIndex < allTopicKeys.length - 1;

  const handlePreviousTopic = () => {
    if (hasPrevious) {
      const prevKey = allTopicKeys[currentKeyIndex - 1];
      setCurrentTopic(GRAMMAR_TOPICS_DATABASE[prevKey]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNextTopic = () => {
    if (hasNext) {
      const nextKey = allTopicKeys[currentKeyIndex + 1];
      setCurrentTopic(GRAMMAR_TOPICS_DATABASE[nextKey]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // 1. Launch Random Quiz
  const handleLaunchRandomQuiz = async (config) => {
    try {
      const res = await grammarAPI.getRandomQuiz(config);
      if (res?.success && Array.isArray(res.questions)) {
        setExamSession({
          type: 'RANDOM_QUIZ',
          examTitleBn: 'র‍্যান্ডম কুইজ সেশন',
          examTitleEn: 'Random Quiz Session',
          totalAllowedSeconds: (config.count || 10) * 60,
          initialRemainingSeconds: (config.count || 10) * 60,
          questions: res.questions,
          initialAnswers: {},
          initialMarked: [],
          initialIndex: 0
        });
        setActiveView('EXAM');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (e) {
      alert(e.message || 'কুইজ লোড করতে ব্যর্থ হয়েছে');
    }
  };

  // 2. Launch Model Test
  const handleLaunchModelTest = async (testId) => {
    try {
      const res = await grammarAPI.startModelTest(testId);
      if (res?.success && Array.isArray(res.questions)) {
        setExamSession({
          type: 'MODEL_TEST',
          attemptId: res.attemptId,
          examTitleBn: res.testTitleBn,
          examTitleEn: res.testTitleEn,
          totalAllowedSeconds: res.totalAllowedSeconds || 1200,
          initialRemainingSeconds: res.remainingSeconds !== undefined ? res.remainingSeconds : 1200,
          questions: res.questions,
          initialAnswers: res.savedAnswers || {},
          initialMarked: res.savedMarked || [],
          initialIndex: res.savedCurrentIndex || 0
        });
        setActiveView('EXAM');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (e) {
      alert(e.message || 'মডেল টেস্ট শুরু করতে ব্যর্থ হয়েছে');
    }
  };

  // 3. Save In-Progress State
  const handleSaveExamProgress = async (state) => {
    if (examSession?.type === 'MODEL_TEST' && examSession?.attemptId) {
      try {
        await grammarAPI.saveModelTestAttempt(examSession.attemptId, state);
      } catch (e) {}
    }
  };

  // 4. Submit Exam
  const handleSubmitExam = async (submissionData) => {
    try {
      setIsSubmittingExam(true);
      if (examSession?.type === 'RANDOM_QUIZ') {
        const res = await grammarAPI.submitQuiz({
          answers: submissionData.answers,
          timeTakenSeconds: submissionData.timeTakenSeconds,
          questionIds: examSession.questions.map(q => q.id)
        });
        if (res?.success) {
          setExamResult(res.data);
          setActiveView('RESULT');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      } else if (examSession?.type === 'MODEL_TEST') {
        const res = await grammarAPI.submitModelTestAttempt(examSession.attemptId, {
          answers: submissionData.answers,
          timeTakenSeconds: submissionData.timeTakenSeconds
        });
        if (res?.success) {
          setExamResult(res.data);
          setActiveView('RESULT');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
    } catch (e) {
      alert(e.message || 'সাবমিশন ব্যর্থ হয়েছে');
    } finally {
      setIsSubmittingExam(false);
    }
  };

  // 5. Review Past Submission
  const handleReviewPastSubmission = async (submissionId) => {
    try {
      const res = await grammarAPI.getModelTestResult(submissionId);
      if (res?.success) {
        setExamResult(res.data);
        setActiveView('RESULT');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (e) {
      alert(e.message || 'ফলাফল লোড করতে ব্যর্থ হয়েছে');
    }
  };

  // Debounced search handler
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults(null);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await grammarAPI.searchGrammar({ q: searchQuery.trim() });
        if (res?.success) {
          setSearchResults(res.data);
        }
      } catch (e) {} finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);


  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <div className="max-w-[1600px] mx-auto p-3 sm:p-5 md:p-6 space-y-5">
        {/* ================================================================ */}
        {/* 1. TOP HEADER & HERO BANNER */}
        {/* ================================================================ */}
        <header className="rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 p-5 sm:p-7 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            {/* Mobile Hamburger to trigger Chapter Drawer */}
            <button
              type="button"
              onClick={() => setIsSidebarOpenMobile(true)}
              className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white lg:hidden cursor-pointer flex-shrink-0 transition-colors"
              aria-label="Open chapters sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="p-3 rounded-2xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex-shrink-0">
              <BookOpen className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight">
                  English Grammar Book
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] sm:text-xs font-mono font-bold">
                  Complete Course
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                Complete English Grammar Course • ২৩টি অধ্যায়, ১০০+ টপিক, রুলস, MCQ ও বোর্ড প্রশ্নব্যাংক
              </p>
            </div>
          </div>

          {/* Quick Header Navigation Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setActiveView('TOPIC')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeView === 'TOPIC' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
              }`}
            >
              📖 অধ্যায় পাঠ
            </button>
            <button
              type="button"
              onClick={() => setActiveView('PRACTICE')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeView === 'PRACTICE' ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
              }`}
            >
              ⚡ প্র্যাকটিস এরিনা
            </button>
            <button
              type="button"
              onClick={() => setActiveView('RANDOM_QUIZ')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeView === 'RANDOM_QUIZ' ? 'bg-violet-600 text-white shadow-xs' : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
              }`}
            >
              🎲 র‍্যান্ডম কুইজ
            </button>
            <button
              type="button"
              onClick={() => setActiveView('MODEL_TEST')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeView === 'MODEL_TEST' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
              }`}
            >
              ⏱️ মডেল টেস্ট
            </button>
            <button
              type="button"
              onClick={() => setActiveView('BOARD_VAULT')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeView === 'BOARD_VAULT' ? 'bg-amber-600 text-white shadow-xs' : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
              }`}
            >
              🏛️ বোর্ড প্রশ্ন
            </button>
            <button
              type="button"
              onClick={() => setActiveView('PROGRESS')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeView === 'PROGRESS' ? 'bg-purple-600 text-white shadow-xs' : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
              }`}
            >
              📊 অগ্রগতি
            </button>
            {isTeacherOrAdmin && (
              <button
                type="button"
                onClick={() => setActiveView('QUESTION_BANK')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeView === 'QUESTION_BANK' ? 'bg-rose-600 text-white shadow-xs' : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
                }`}
              >
                📝 প্রশ্নব্যাংক CMS
              </button>
            )}
          </div>
        </header>

        {/* ================================================================ */}
        {/* EXAM VIEW (FULLSCREEN DISTRACTION-FREE) */}
        {/* ================================================================ */}
        {activeView === 'EXAM' && examSession && (
          <GrammarExamInterface
            examTitleBn={examSession.examTitleBn}
            examTitleEn={examSession.examTitleEn}
            totalAllowedSeconds={examSession.totalAllowedSeconds}
            initialRemainingSeconds={examSession.initialRemainingSeconds}
            questions={examSession.questions}
            initialAnswers={examSession.initialAnswers}
            initialMarked={examSession.initialMarked}
            initialIndex={examSession.initialIndex}
            onSaveProgress={handleSaveExamProgress}
            onSubmitExam={handleSubmitExam}
            onCancelExam={() => setActiveView('TOPIC')}
            isSubmitting={isSubmittingExam}
          />
        )}

        {/* ================================================================ */}
        {/* RESULT VIEW */}
        {/* ================================================================ */}
        {activeView === 'RESULT' && examResult && (
          <GrammarExamResult
            resultData={examResult}
            onRetakeTest={() => {
              if (examSession?.type === 'MODEL_TEST') {
                handleLaunchModelTest(examSession.testId);
              } else if (examSession?.type === 'RANDOM_QUIZ') {
                setActiveView('RANDOM_QUIZ');
              }
            }}
            onBackToBook={() => setActiveView('TOPIC')}
            onGoToAnalytics={() => setActiveView('PROGRESS')}
          />
        )}

        {/* ================================================================ */}
        {/* STANDARD VIEWS: THREE-COLUMN DESKTOP / RESPONSIVE LAYOUT */}
        {/* ================================================================ */}
        {activeView !== 'EXAM' && activeView !== 'RESULT' && (
          <div className="flex items-start gap-5 relative">
            {/* LEFT: CHAPTERS & TOPICS SIDEBAR */}
            <GrammarSidebar
              chapters={chapters}
              activeChapterId={activeChapter?.id}
              activeTopicSlug={currentTopic?.slug || String(currentTopic?.id)}
              onSelectChapter={handleSelectChapter}
              onSelectTopic={handleSelectTopic}
              completedTopicIds={completedTopicIds}
              bookmarkedTopicIds={bookmarkedTopicIds}
              isOpenMobile={isSidebarOpenMobile}
              onCloseMobile={() => setIsSidebarOpenMobile(false)}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />

            {/* CENTER: MAIN CONTENT AREA */}
            <main className="flex-1 min-w-0 space-y-5">
              {/* Search Results Dropdown Overlay (If searching) */}
              {searchQuery && searchResults && (
                <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800/60 shadow-xl space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-xs font-bold text-slate-500">
                      সার্চ ফলাফল: "{searchQuery}"
                    </span>
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="text-xs text-indigo-600 font-bold hover:underline cursor-pointer"
                    >
                      বন্ধ করুন ✕
                    </button>
                  </div>

                  <div className="space-y-1.5 max-h-60 overflow-y-auto">
                    {searchResults.topics?.map(t => (
                      <div
                        key={t.id}
                        onClick={() => {
                          handleSelectTopic(t);
                          setSearchQuery('');
                        }}
                        className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 cursor-pointer flex items-center justify-between text-xs"
                      >
                        <span className="font-bold text-slate-900 dark:text-white">
                          {t.titleBn} ({t.titleEn})
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-mono">
                          Topic
                        </span>
                      </div>
                    ))}
                    {!searchResults.topics?.length && (
                      <p className="text-xs text-slate-400 p-2">কোনো ম্যাচিং ফলাফল পাওয়া যায়নি।</p>
                    )}
                  </div>
                </div>
              )}

              {/* View Switcher */}
              {activeView === 'TOPIC' && (
                <GrammarTopicPage
                  topic={currentTopic}
                  chapter={activeChapter}
                  isCompleted={completedTopicIds.includes(currentTopic?.id)}
                  onToggleComplete={handleToggleComplete}
                  isBookmarked={bookmarkedTopicIds.includes(currentTopic?.id)}
                  onToggleBookmark={handleToggleBookmark}
                  hasPrevious={hasPrevious}
                  hasNext={hasNext}
                  onPrevious={handlePreviousTopic}
                  onNext={handleNextTopic}
                  onOpenSidebar={() => setIsSidebarOpenMobile(true)}
                />
              )}

              {activeView === 'PRACTICE' && (
                <GrammarPracticeArena
                  defaultChapterId={activeChapter?.id || 7}
                  onTakeModelTest={() => setActiveView('MODEL_TEST')}
                />
              )}

              {activeView === 'RANDOM_QUIZ' && (
                <GrammarRandomQuizView
                  onStartQuiz={handleLaunchRandomQuiz}
                />
              )}

              {activeView === 'MODEL_TEST' && (
                <GrammarModelTestCenter
                  onStartTest={handleLaunchModelTest}
                />
              )}

              {activeView === 'BOARD_VAULT' && (
                <GrammarBoardQuestionVault
                  activeTopic={currentTopic}
                  boardQuestions={currentTopic?.boardQuestions || []}
                />
              )}

              {activeView === 'PROGRESS' && (
                <GrammarPerformanceAnalytics
                  onReviewSubmission={handleReviewPastSubmission}
                  onStartQuiz={() => setActiveView('RANDOM_QUIZ')}
                />
              )}

              {activeView === 'QUESTION_BANK' && (
                <GrammarQuestionBankAdmin />
              )}
            </main>

            {/* RIGHT: PROGRESS, BOOKMARKS & QUICK JUMPS (DESKTOP) */}
            <GrammarRightPanel
              topic={currentTopic}
              isCompleted={completedTopicIds.includes(currentTopic?.id)}
              onToggleComplete={handleToggleComplete}
              isBookmarked={bookmarkedTopicIds.includes(currentTopic?.id)}
              onToggleBookmark={handleToggleBookmark}
              overallProgress={overallMetrics}
            />
          </div>
        )}

      </div>
    </div>
  );
}
