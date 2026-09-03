import React, { useState, useEffect, useCallback } from 'react';
import {
  BookOpen, Sparkles, Layers, ListChecks, Award, Bookmark,
  TrendingUp, Search, RefreshCw, Menu, ChevronRight, X,
  CheckCircle2, Compass, Shuffle, BarChart3, Database, Home
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { grammarAPI } from '../../services/api';
import { GRAMMAR_CHAPTERS, GRAMMAR_TOPICS_DATABASE } from '../../data/grammar/grammarChaptersData';
import GrammarSidebar from './GrammarSidebar';
import GrammarTopicPage from './GrammarTopicPage';
import GrammarChapterView from './GrammarChapterView';
import GrammarLandingHome from './GrammarLandingHome';
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

export default function InteractiveGrammarBook({ initialSubject = 'ENGLISH' }) {
  const { user } = useAuth();
  const isTeacherOrAdmin = ['ADMIN', 'SUPER_ADMIN', 'TEACHER'].includes(String(user?.role || '').toUpperCase());

  const [subject, setSubject] = useState(initialSubject || 'ENGLISH');
  const isBangla = subject === 'BANGLA';

  const [chapters, setChapters] = useState([]);
  const [activeChapter, setActiveChapter] = useState(null);
  const [currentTopic, setCurrentTopic] = useState(null);
  const [chapterTopics, setChapterTopics] = useState([]);
  const [loadingTopics, setLoadingTopics] = useState(false);

  // 'LANDING' | 'CHAPTER' | 'TOPIC' | 'PRACTICE' | 'RANDOM_QUIZ' | 'MODEL_TEST' | 'EXAM' | 'RESULT' | 'BOARD_VAULT' | 'PROGRESS' | 'QUESTION_BANK'
  const [activeView, setActiveView] = useState('LANDING');
  const [isSidebarOpenMobile, setIsSidebarOpenMobile] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  // Active Exam Session State
  const [examSession, setExamSession] = useState(null);
  const [examResult, setExamResult] = useState(null);
  const [isSubmittingExam, setIsSubmittingExam] = useState(false);

  // User progress & metrics state
  const [completedTopicIds, setCompletedTopicIds] = useState([]);
  const [bookmarkedTopicIds, setBookmarkedTopicIds] = useState([]);
  const [overallMetrics, setOverallMetrics] = useState({
    percentage: 0,
    completedCount: 0,
    totalCount: isBangla ? 40 : 23
  });

  // Overview stats for Landing Page
  const [landingStats, setLandingStats] = useState({
    totalChapters: isBangla ? 40 : 23,
    totalTopics: 0,
    totalQuestions: 0,
    totalModelTests: 0,
    progressPercentage: 0,
    completedTopicsCount: 0,
    totalBookmarks: 0
  });

  // Fetch chapters and initial data whenever subject changes
  useEffect(() => {
    let isMounted = true;

    // 1. Fetch chapters from API for active subject
    grammarAPI.getChapters({ subject, includeTopics: true }).then(res => {
      if (isMounted && res?.success && Array.isArray(res.data)) {
        let loadedChapters = res.data;
        if (subject === 'ENGLISH') {
          // Merge static topics fallback for English
          loadedChapters = res.data.map(c => {
            const staticMatch = GRAMMAR_CHAPTERS.find(sc => sc.id === c.id || sc.slug === c.slug);
            return {
              ...c,
              topics: c.topics?.length ? c.topics : (staticMatch?.topics || [])
            };
          });
        }
        setChapters(loadedChapters);
        if (loadedChapters.length > 0) {
          const defaultChap = subject === 'BANGLA' ? loadedChapters[0] : (loadedChapters[6] || loadedChapters[0]);
          setActiveChapter(defaultChap);
        }
      }
    }).catch(() => {
      if (subject === 'ENGLISH') {
        setChapters(GRAMMAR_CHAPTERS);
        setActiveChapter(GRAMMAR_CHAPTERS[6] || GRAMMAR_CHAPTERS[0]);
      }
    });

    // 2. Fetch student progress for active subject
    grammarAPI.getMyProgress({ subject }).then(res => {
      if (isMounted && res?.success && res.data) {
        const summary = res.data.summary;
        if (summary) {
          setOverallMetrics({
            percentage: summary.completionPercentage || 0,
            completedCount: summary.completedTopicsCount || 0,
            totalCount: summary.totalTopicsCount || (subject === 'BANGLA' ? 40 : 23)
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

    // 4. Fetch questions and tests count for landing statistics
    Promise.allSettled([
      grammarAPI.getMCQs({ subject, limit: 1 }),
      grammarAPI.getModelTests({ subject }),
      grammarAPI.getTopics({ subject })
    ]).then(([mcqRes, testRes, topicRes]) => {
      if (isMounted) {
        setLandingStats(prev => ({
          ...prev,
          totalChapters: subject === 'BANGLA' ? 40 : 23,
          totalTopics: topicRes.status === 'fulfilled' && topicRes.value?.success ? (topicRes.value.data?.length || 0) : 0,
          totalQuestions: mcqRes.status === 'fulfilled' && mcqRes.value?.success ? (mcqRes.value.total || 0) : 0,
          totalModelTests: testRes.status === 'fulfilled' && testRes.value?.success ? (testRes.value.data?.length || 0) : 0
        }));
      }
    }).catch(() => {});

    return () => { isMounted = false; };
  }, [subject]);

  // Synchronize landing stats with metrics
  useEffect(() => {
    setLandingStats(prev => ({
      ...prev,
      progressPercentage: overallMetrics.percentage,
      completedTopicsCount: overallMetrics.completedCount,
      totalBookmarks: bookmarkedTopicIds.length
    }));
  }, [overallMetrics, bookmarkedTopicIds]);

  // Load topics under active chapter
  useEffect(() => {
    if (!activeChapter?.id) return;
    let isMounted = true;
    setLoadingTopics(true);

    grammarAPI.getTopics({ chapterId: activeChapter.id, subject }).then(res => {
      if (isMounted && res?.success && Array.isArray(res.data)) {
        if (res.data.length > 0) {
          setChapterTopics(res.data);
        } else {
          // If English, fallback to static topics
          const staticMatch = GRAMMAR_CHAPTERS.find(c => c.id === activeChapter.id || c.slug === activeChapter.slug);
          setChapterTopics(staticMatch?.topics || []);
        }
      }
    }).catch(() => {
      if (isMounted) {
        const staticMatch = GRAMMAR_CHAPTERS.find(c => c.id === activeChapter.id || c.slug === activeChapter.slug);
        setChapterTopics(staticMatch?.topics || []);
      }
    }).finally(() => {
      if (isMounted) setLoadingTopics(false);
    });

    return () => { isMounted = false; };
  }, [activeChapter?.id, subject]);

  // Fetch single topic details when slug or ID changes
  const loadTopicDetails = useCallback(async (slugOrId) => {
    try {
      const res = await grammarAPI.getTopicDetails(slugOrId);
      if (res?.success && res.data) {
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
    setActiveView('CHAPTER');
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

    setOverallMetrics(prev => ({
      ...prev,
      completedCount: updated.length,
      percentage: Math.min(100, Math.round((updated.length / (prev.totalCount || (isBangla ? 40 : 23))) * 100))
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

  // Previous & Next navigation strictly within active chapter topics
  const currentTopicIndex = chapterTopics.findIndex(t => String(t.id) === String(currentTopic?.id) || t.slug === currentTopic?.slug);
  const hasPrevious = currentTopicIndex > 0;
  const hasNext = currentTopicIndex !== -1 && currentTopicIndex < chapterTopics.length - 1;

  const handlePreviousTopic = () => {
    if (hasPrevious) {
      const prevTopic = chapterTopics[currentTopicIndex - 1];
      handleSelectTopic(prevTopic, activeChapter);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNextTopic = () => {
    if (hasNext) {
      const nextTopic = chapterTopics[currentTopicIndex + 1];
      handleSelectTopic(nextTopic, activeChapter);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Launch Random Quiz
  const handleLaunchRandomQuiz = async (config) => {
    try {
      const res = await grammarAPI.getRandomQuiz({ ...config, subject });
      if (res?.success && Array.isArray(res.questions)) {
        setExamSession({
          type: 'RANDOM_QUIZ',
          examTitleBn: isBangla ? 'বাংলা ব্যাকরণ র‍্যান্ডম কুইজ' : 'English Grammar Random Quiz',
          examTitleEn: isBangla ? 'Bangla Grammar Random Quiz' : 'English Grammar Random Quiz',
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

  // Launch Model Test
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

  // Save In-Progress State
  const handleSaveExamProgress = async (state) => {
    if (examSession?.type === 'MODEL_TEST' && examSession?.attemptId) {
      try {
        await grammarAPI.saveModelTestAttempt(examSession.attemptId, state);
      } catch (e) {}
    }
  };

  // Submit Exam
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

  // Review Past Submission
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

  // Debounced search handler supporting Bangla and English
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) {
      setSearchResults(null);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await grammarAPI.searchGrammar({ q: searchQuery.trim(), subject });
        if (res?.success) {
          setSearchResults(res.data);
        }
      } catch (e) {} finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, subject]);

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <div className="max-w-[1600px] mx-auto p-3 sm:p-5 md:p-6 space-y-5">
        {/* ================================================================ */}
        {/* 1. TOP HEADER & HERO BANNER */}
        {/* ================================================================ */}
        <header className={`rounded-3xl p-5 sm:p-7 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 border ${
          isBangla
            ? 'bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 border-emerald-500/30'
            : 'bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-indigo-500/30'
        }`}>
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

            <div className={`p-3 rounded-2xl border flex-shrink-0 ${
              isBangla
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30 font-serif'
                : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
            }`}>
              <BookOpen className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight">
                  {isBangla ? 'বাংলা ব্যাকরণ' : 'English Grammar Book'}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] sm:text-xs font-mono font-bold">
                  {isBangla ? '৪০টি অধ্যায়' : '২৩টি অধ্যায়'}
                </span>

                {/* Subject Switch Pill */}
                <div className="inline-flex rounded-xl bg-black/40 p-0.5 border border-white/15 ml-2 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => { setSubject('ENGLISH'); setActiveView('LANDING'); }}
                    className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                      !isBangla ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    English
                  </button>
                  <button
                    type="button"
                    onClick={() => { setSubject('BANGLA'); setActiveView('LANDING'); }}
                    className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                      isBangla ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    বাংলা
                  </button>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                {isBangla
                  ? 'সহজ ভাষায় সম্পূর্ণ বাংলা ব্যাকরণ • ধ্বনি, শব্দ, পদ, কারক, সন্ধি, সমাস, বাক্য ও রিভিশন'
                  : 'Complete English Grammar Course • ২৩টি অধ্যায়, ১০০+ টপিক, রুলস, MCQ ও বোর্ড প্রশ্নব্যাংক'}
              </p>
            </div>
          </div>

          {/* Quick Header Navigation Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setActiveView('LANDING')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                activeView === 'LANDING' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>হোম</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveView('CHAPTER')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeView === 'CHAPTER' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
              }`}
            >
              📑 অধ্যায়
            </button>
            <button
              type="button"
              onClick={() => setActiveView('TOPIC')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeView === 'TOPIC' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
              }`}
            >
              📖 টপিক
            </button>
            <button
              type="button"
              onClick={() => setActiveView('PRACTICE')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeView === 'PRACTICE' ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
              }`}
            >
              ⚡ প্র্যাকটিস
            </button>
            <button
              type="button"
              onClick={() => setActiveView('RANDOM_QUIZ')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeView === 'RANDOM_QUIZ' ? 'bg-violet-600 text-white shadow-xs' : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
              }`}
            >
              🎲 কুইজ
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
                📝 CMS
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
            onCancelExam={() => setActiveView('LANDING')}
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
            onBackToBook={() => setActiveView('LANDING')}
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
              subject={subject}
              onSelectSubject={setSubject}
              totalTopicsCount={landingStats.totalTopics}
            />

            {/* CENTER: MAIN CONTENT AREA */}
            <main className="flex-1 min-w-0 space-y-5">
              {/* Search Results Dropdown Overlay (If searching) */}
              {searchQuery && (
                <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800/60 shadow-xl space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                      <Search className="w-3.5 h-3.5 text-indigo-500" />
                      <span>সার্চ ফলাফল: "{searchQuery}"</span>
                      {isSearching && <RefreshCw className="w-3.5 h-3.5 text-indigo-500 animate-spin ml-2" />}
                    </span>
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="text-xs text-indigo-600 dark:text-indigo-400 font-bold hover:underline cursor-pointer"
                    >
                      বন্ধ করুন ✕
                    </button>
                  </div>

                  {searchResults ? (
                    <div className="space-y-3 max-h-80 overflow-y-auto">
                      {/* Matched Chapters */}
                      {searchResults.chapters?.length > 0 && (
                        <div className="space-y-1">
                          <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                            অধ্যায়সমূহ ({searchResults.chapters.length})
                          </span>
                          {searchResults.chapters.map(c => (
                            <div
                              key={`c-${c.id}`}
                              onClick={() => {
                                handleSelectChapter(c);
                                setSearchQuery('');
                              }}
                              className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 cursor-pointer flex items-center justify-between text-xs"
                            >
                              <span className="font-bold text-slate-900 dark:text-white">
                                {c.titleBn} ({c.titleEn || ''})
                              </span>
                              <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-mono">
                                Chapter
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Matched Topics */}
                      {searchResults.topics?.length > 0 && (
                        <div className="space-y-1">
                          <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                            টপিকসমূহ ({searchResults.topics.length})
                          </span>
                          {searchResults.topics.map(t => (
                            <div
                              key={`t-${t.id}`}
                              onClick={() => {
                                handleSelectTopic(t);
                                setSearchQuery('');
                              }}
                              className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 cursor-pointer flex items-center justify-between text-xs"
                            >
                              <span className="font-bold text-slate-900 dark:text-white">
                                {t.titleBn} ({t.titleEn || ''})
                              </span>
                              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 font-mono">
                                Topic
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* No Results */}
                      {!searchResults.chapters?.length && !searchResults.topics?.length && (
                        <p className="text-xs text-slate-400 p-3 text-center">কোনো ম্যাচিং ফলাফল পাওয়া যায়নি।</p>
                      )}
                    </div>
                  ) : isSearching ? (
                    <p className="text-xs text-slate-400 p-3 text-center">অনুসন্ধান করা হচ্ছে...</p>
                  ) : null}
                </div>
              )}

              {/* View Switcher */}
              {activeView === 'LANDING' && (
                <GrammarLandingHome
                  activeSubject={subject}
                  onSelectSubject={(s) => setSubject(s)}
                  stats={landingStats}
                  onStartBrowseChapters={() => setActiveView('CHAPTER')}
                  onStartPractice={() => setActiveView('PRACTICE')}
                  onStartRandomQuiz={() => setActiveView('RANDOM_QUIZ')}
                  onStartModelTest={() => setActiveView('MODEL_TEST')}
                  onOpenBoardQuestions={() => setActiveView('BOARD_VAULT')}
                  onViewProgress={() => setActiveView('PROGRESS')}
                  chapters={chapters}
                  onSelectChapter={handleSelectChapter}
                />
              )}

              {activeView === 'CHAPTER' && (
                <GrammarChapterView
                  chapter={activeChapter}
                  topics={chapterTopics}
                  completedTopicIds={completedTopicIds}
                  bookmarkedTopicIds={bookmarkedTopicIds}
                  onSelectTopic={handleSelectTopic}
                  onStartChapterQuiz={() => handleLaunchRandomQuiz({ chapterId: activeChapter?.id, count: 10 })}
                  onStartChapterPractice={() => setActiveView('PRACTICE')}
                  subject={subject}
                />
              )}

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
                  defaultChapterId={activeChapter?.id}
                  onTakeModelTest={() => setActiveView('MODEL_TEST')}
                  chapters={chapters}
                  subject={subject}
                />
              )}

              {activeView === 'RANDOM_QUIZ' && (
                <GrammarRandomQuizView
                  onStartQuiz={handleLaunchRandomQuiz}
                  chapters={chapters}
                  subject={subject}
                />
              )}

              {activeView === 'MODEL_TEST' && (
                <GrammarModelTestCenter
                  onStartTest={handleLaunchModelTest}
                  subject={subject}
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
                  subject={subject}
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
