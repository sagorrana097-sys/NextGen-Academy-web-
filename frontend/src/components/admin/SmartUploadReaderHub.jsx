import React, { useState, useEffect, useMemo } from 'react';
import {
  Database,
  Plus,
  Trash2,
  Search,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  FolderOpen,
  Filter,
  Layers,
  Sparkles,
  HelpCircle,
  FileText,
  Calendar,
  GraduationCap,
  RefreshCw,
  Eye,
  Check,
  X,
  ListOrdered,
  BookMarked
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { questionRepositoryAPI } from '../../services/api';

const CLASSES_LIST = [
  'ষষ্ঠ শ্রেণি (Class 6)',
  'সপ্তম শ্রেণি (Class 7)',
  'অষ্টম শ্রেণি (Class 8)',
  'নবম শ্রেণি (Class 9)',
  'দশম শ্রেণি (Class 10)',
  'একাদশ শ্রেণি (Class 11)',
  'দ্বাদশ শ্রেণি (Class 12)',
  'Class 9-10 (SSC)',
  'Class 11-12 (HSC)'
];

const SUBJECTS_LIST = [
  'সাধারণ গণিত (General Math)',
  'উচ্চতর গণিত (Higher Math)',
  'পদার্থবিজ্ঞান (Physics)',
  'রসায়ন (Chemistry)',
  'জীববিজ্ঞান (Biology)',
  'তথ্য ও যোগাযোগ প্রযুক্তি / আইসিটি (ICT)',
  'বাংলাদেশ ও বিশ্বপরিচয় (BGS)',
  'সাধারণ বিজ্ঞান (General Science)',
  'ইসলাম ও নৈতিক শিক্ষা',
  'হিন্দুধর্ম ও নৈতিক শিক্ষা',
  'বাংলা ১ম পত্র (সাহিত্য)',
  'বাংলা ২য় পত্র (বাংলা ব্যাকরণ ও নির্মিতি)',
  'ইংরেজি ১ম পত্র (English 1st Paper)',
  'ইংরেজি ২য় পত্র (English 2nd Paper)',
  'হিসাববিজ্ঞান (Accounting)',
  'ফিন্যান্স ও ব্যাংকিং (Finance & Banking)',
  'ব্যবসায় উদ্যোগ (Business Studies)'
];

const INSTITUTIONS_LIST = [
  'ঢাকা বোর্ড (Dhaka Board)',
  'রাজশাহী বোর্ড (Rajshahi Board)',
  'চট্টগ্রাম বোর্ড (Chattogram Board)',
  'কুমিল্লা বোর্ড (Cumilla Board)',
  'যশোর বোর্ড (Jashore Board)',
  'বরিশাল বোর্ড (Barishal Board)',
  'সিলেট বোর্ড (Sylhet Board)',
  'দিনাজপুর বোর্ড (Dinajpur Board)',
  'ময়মনসিংহ বোর্ড (Mymensingh Board)',
  'মাদ্রাসা বোর্ড (Madrasah Board)',
  'নটর ডেম কলেজ (NDC)',
  'রাজউক উত্তরা মডেল কলেজ (RUMC)',
  'আইডিয়াল স্কুল অ্যান্ড কলেজ (Motijheel)',
  'ভিকারুননিসা নূন স্কুল অ্যান্ড কলেজ (VNSC)',
  'ঢাকা রেসিডেনসিয়াল মডেল কলেজ (DRMC)',
  'হলি ক্রস কলেজ (HCC)',
  'ক্যান্টনমেন্ট পাবলিক স্কুল ও কলেজ',
  'সাধারণ প্রশ্ন ব্যাংক'
];

const YEARS_LIST = ['2026', '2025', '2024', '2023', '2022', '2021', '2020'];

export default function SmartUploadReaderHub({ initialVaultTab = 'MCQ', onNavigateToMaker, onNavigateToOMR }) {
  const { lang } = useLanguage();

  // Active Vault: 'MCQ' | 'CQ' | 'SQ'
  const [activeVault, setActiveVault] = useState(initialVaultTab || 'MCQ');

  // Common Metadata State
  const [selectedClass, setSelectedClass] = useState(CLASSES_LIST[4]); // Class 10
  const [selectedSubject, setSelectedSubject] = useState(SUBJECTS_LIST[2]); // Physics
  const [selectedInstitution, setSelectedInstitution] = useState(INSTITUTIONS_LIST[0]); // Dhaka Board
  const [selectedYear, setSelectedYear] = useState('2026');
  const [selectedChapter, setSelectedChapter] = useState('');

  // 1. MCQ Form State
  const [mcqQuestion, setMcqQuestion] = useState('');
  const [optionA, setOptionA] = useState('');
  const [optionB, setOptionB] = useState('');
  const [optionC, setOptionC] = useState('');
  const [optionD, setOptionD] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('ক');
  const [mcqExplanation, setMcqExplanation] = useState('');

  // 2. CQ Form State
  const [cqStem, setCqStem] = useState('');
  const [subQA, setSubQA] = useState('');
  const [subQB, setSubQB] = useState('');
  const [subQC, setSubQC] = useState('');
  const [subQD, setSubQD] = useState('');
  const [cqDiagramUrl, setCqDiagramUrl] = useState('');

  // 3. SQ Form State
  const [sqQuestion, setSqQuestion] = useState('');
  const [sqAnswer, setSqAnswer] = useState('');
  const [sqMarks, setSqMarks] = useState(2);

  // Status & Feedback State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState(null);

  // Stored Repository State
  const [repoQuestions, setRepoQuestions] = useState([]);
  const [loadingRepo, setLoadingRepo] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchRepoQuestions();
  }, []);

  const fetchRepoQuestions = async () => {
    setLoadingRepo(true);
    try {
      const res = await questionRepositoryAPI.getQuestions();
      if (res?.success && Array.isArray(res?.data)) {
        setRepoQuestions(res.data);
      } else if (Array.isArray(res)) {
        setRepoQuestions(res);
      } else {
        setRepoQuestions([]);
      }
    } catch (err) {
      console.warn('Could not load repository questions:', err);
      setRepoQuestions([]);
    } finally {
      setLoadingRepo(false);
    }
  };

  // 1. Save MCQ Question
  const handleSaveMCQ = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!mcqQuestion.trim()) {
      alert('অনুগ্রহ করে MCQ প্রশ্নের বিবরণ বা উদ্দীপক লিখুন।');
      return;
    }

    setIsSubmitting(true);
    setFeedbackMsg(null);

    try {
      const questionObj = {
        id: `mcq-${Date.now()}`,
        type: 'MCQ',
        question: mcqQuestion.trim(),
        stem: mcqQuestion.trim(),
        options: [optionA || 'বিকল্প ১', optionB || 'বিকল্প ২', optionC || 'বিকল্প ৩', optionD || 'বিকল্প ৪'],
        correctAnswer: correctAnswer || 'ক',
        explanation: mcqExplanation.trim() || '',
        marks: 1,
        difficulty: 'MEDIUM',
        boardOrInstitute: selectedInstitution,
        year: selectedYear,
        subject: selectedSubject,
        class: selectedClass,
        chapter: selectedChapter || null
      };

      const payload = {
        questions: [questionObj],
        category: selectedInstitution,
        subject: selectedSubject,
        term: selectedYear,
        className: selectedClass,
        book: selectedSubject,
        institutionOrBoard: selectedInstitution,
        year: selectedYear,
        chapter: selectedChapter || null,
        hasChapter: !!selectedChapter,
        metadata: {
          className: selectedClass,
          book: selectedSubject,
          category: selectedInstitution,
          subject: selectedSubject,
          term: selectedYear,
          institutionOrBoard: selectedInstitution,
          year: selectedYear,
          chapter: selectedChapter || null,
          badge: '[' + selectedInstitution + ' - \'' + selectedYear.slice(-2) + ']'
        }
      };

      const res = await questionRepositoryAPI.uploadAndTrain(payload);
      if (res?.success) {
        alert('🎉 অভিনন্দন! MCQ প্রশ্নটি সফলভাবে ডাটাবেজে সংরক্ষিত হয়েছে!');
        setFeedbackMsg({ type: 'success', text: 'MCQ প্রশ্ন সফলভাবে সংরক্ষিত হয়েছে!' });
        setMcqQuestion('');
        setOptionA('');
        setOptionB('');
        setOptionC('');
        setOptionD('');
        setMcqExplanation('');
        fetchRepoQuestions();
      } else {
        alert('সংরক্ষণ ব্যর্থ: ' + (res?.error?.message || res?.message || 'সমস্যা হয়েছে'));
      }
    } catch (err) {
      alert('সার্ভার ত্রুটি: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 2. Save CQ Question
  const handleSaveCQ = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!cqStem.trim()) {
      alert('অনুগ্রহ করে সৃজনশীল উদ্দীপক বা অনুচ্ছেদ লিখুন।');
      return;
    }

    setIsSubmitting(true);
    setFeedbackMsg(null);

    try {
      const questionObj = {
        id: `cq-${Date.now()}`,
        type: 'CQ',
        question: cqStem.trim(),
        stem: cqStem.trim(),
        subQuestions: {
          a: { q: subQA.trim() || 'জ্ঞানমূলক প্রশ্ন', marks: 1 },
          b: { q: subQB.trim() || 'অনুধাবনমূলক প্রশ্ন', marks: 2 },
          c: { q: subQC.trim() || 'প্রয়োগমূলক প্রশ্ন', marks: 3 },
          d: { q: subQD.trim() || 'উচ্চতর দক্ষতামূলক প্রশ্ন', marks: 4 }
        },
        diagramUrl: cqDiagramUrl.trim() || null,
        marks: 10,
        difficulty: 'MEDIUM',
        boardOrInstitute: selectedInstitution,
        year: selectedYear,
        subject: selectedSubject,
        class: selectedClass,
        chapter: selectedChapter || null
      };

      const payload = {
        questions: [questionObj],
        category: selectedInstitution,
        subject: selectedSubject,
        term: selectedYear,
        className: selectedClass,
        book: selectedSubject,
        institutionOrBoard: selectedInstitution,
        year: selectedYear,
        chapter: selectedChapter || null,
        hasChapter: !!selectedChapter,
        metadata: {
          className: selectedClass,
          book: selectedSubject,
          category: selectedInstitution,
          subject: selectedSubject,
          term: selectedYear,
          institutionOrBoard: selectedInstitution,
          year: selectedYear,
          chapter: selectedChapter || null,
          badge: '[' + selectedInstitution + ' - \'' + selectedYear.slice(-2) + ']'
        }
      };

      const res = await questionRepositoryAPI.uploadAndTrain(payload);
      if (res?.success) {
        alert('🎉 অভিনন্দন! সৃজনশীল (CQ) প্রশ্নটি সফলভাবে ডাটাবেজে সংরক্ষিত হয়েছে!');
        setFeedbackMsg({ type: 'success', text: 'CQ প্রশ্ন সফলভাবে সংরক্ষিত হয়েছে!' });
        setCqStem('');
        setSubQA('');
        setSubQB('');
        setSubQC('');
        setSubQD('');
        setCqDiagramUrl('');
        fetchRepoQuestions();
      } else {
        alert('সংরক্ষণ ব্যর্থ: ' + (res?.error?.message || res?.message || 'সমস্যা হয়েছে'));
      }
    } catch (err) {
      alert('সার্ভার ত্রুটি: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 3. Save SQ Question
  const handleSaveSQ = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!sqQuestion.trim()) {
      alert('অনুগ্রহ করে সংক্ষিপ্ত প্রশ্নটি লিখুন।');
      return;
    }

    setIsSubmitting(true);
    setFeedbackMsg(null);

    try {
      const questionObj = {
        id: `sq-${Date.now()}`,
        type: 'SQ',
        question: sqQuestion.trim(),
        stem: sqQuestion.trim(),
        shortAnswer: sqAnswer.trim() || '',
        marks: Number(sqMarks) || 2,
        difficulty: 'MEDIUM',
        boardOrInstitute: selectedInstitution,
        year: selectedYear,
        subject: selectedSubject,
        class: selectedClass,
        chapter: selectedChapter || null
      };

      const payload = {
        questions: [questionObj],
        category: selectedInstitution,
        subject: selectedSubject,
        term: selectedYear,
        className: selectedClass,
        book: selectedSubject,
        institutionOrBoard: selectedInstitution,
        year: selectedYear,
        chapter: selectedChapter || null,
        hasChapter: !!selectedChapter,
        metadata: {
          className: selectedClass,
          book: selectedSubject,
          category: selectedInstitution,
          subject: selectedSubject,
          term: selectedYear,
          institutionOrBoard: selectedInstitution,
          year: selectedYear,
          chapter: selectedChapter || null,
          badge: '[' + selectedInstitution + ' - \'' + selectedYear.slice(-2) + ']'
        }
      };

      const res = await questionRepositoryAPI.uploadAndTrain(payload);
      if (res?.success) {
        alert('🎉 অভিনন্দন! সংক্ষিপ্ত (SQ) প্রশ্নটি সফলভাবে ডাটাবেজে সংরক্ষিত হয়েছে!');
        setFeedbackMsg({ type: 'success', text: 'SQ প্রশ্ন সফলভাবে সংরক্ষিত হয়েছে!' });
        setSqQuestion('');
        setSqAnswer('');
        fetchRepoQuestions();
      } else {
        alert('সংরক্ষণ ব্যর্থ: ' + (res?.error?.message || res?.message || 'সমস্যা হয়েছে'));
      }
    } catch (err) {
      alert('সার্ভার ত্রুটি: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete question item
  const handleDeleteItem = async (id) => {
    if (!window.confirm('আপনি কি নিশ্চিত যে এই প্রশ্নটি মুছে ফেলতে চান?')) return;
    try {
      const res = await questionRepositoryAPI.deleteQuestion(id);
      if (res?.success) {
        setRepoQuestions(prev => prev.filter(q => (q?.id || q?.M_ID) !== id));
      } else {
        alert('মুছে ফেলতে সমস্যা হয়েছে: ' + (res?.error?.message || 'ত্রুটি'));
      }
    } catch (err) {
      alert('মুছে ফেলতে সমস্যা হয়েছে: ' + err.message);
    }
  };

  // Filtered Questions strictly for the active vault
  const vaultQuestions = useMemo(() => {
    const safeList = Array.isArray(repoQuestions) ? repoQuestions : [];
    return safeList.filter(q => {
      const isTargetType = activeVault === 'MCQ' 
        ? (q?.type === 'MCQ')
        : activeVault === 'CQ'
        ? (q?.type === 'CQ')
        : (q?.type === 'SQ' || q?.type === 'SHORT');

      const qText = String(q?.question || q?.stem || '').toLowerCase();
      const qInst = String(q?.institutionOrBoard || q?.boardOrInstitute || q?.category || '').toLowerCase();
      const qBook = String(q?.book || q?.subject || '').toLowerCase();
      const search = (searchTerm || '').toLowerCase();

      const matchesSearch = !search || qText.includes(search) || qInst.includes(search) || qBook.includes(search);
      return isTargetType && matchesSearch;
    });
  }, [repoQuestions, activeVault, searchTerm]);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden border border-indigo-500/30">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md mb-2">
              <Database className="w-3.5 h-3.5 text-indigo-400" />
              <span>১০০% সুরক্ষিত পৃথক ম্যানুয়াল প্রশ্ন ভাণ্ডার</span>
            </div>
            <h2 className="text-xl md:text-2xl font-black tracking-tight">
              ম্যানুয়াল প্রশ্ন ভাণ্ডার সংগ্রহশালা (Question Vaults)
            </h2>
            <p className="text-xs md:text-sm text-slate-300 mt-1">
              MCQ, সৃজনশীল (CQ) ও সংক্ষিপ্ত (SQ) প্রশ্ন আলাদা ক্যাটাগরিতে নির্ভুলভাবে সংরক্ষণ করুন।
            </p>
          </div>

          <div className="flex items-center gap-2">
            {onNavigateToMaker && (
              <button
                type="button"
                onClick={onNavigateToMaker}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center space-x-1.5"
              >
                <FileText className="w-4 h-4" />
                <span>প্রশ্নপত্র বিল্ডার ও প্রিন্টারে যান ➔</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 3 Dedicated Vault Selector Tabs */}
      <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-xs flex-wrap">
        <button
          type="button"
          onClick={() => { setActiveVault('MCQ'); setFeedbackMsg(null); }}
          className={'px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center space-x-2 cursor-pointer ' + (
            activeVault === 'MCQ'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'text-slate-600 hover:bg-slate-100'
          )}
        >
          <BookMarked className="w-4 h-4" />
          <span>🔘 ১. বহুনির্বাচনী ভাণ্ডার (MCQ Vault)</span>
        </button>

        <button
          type="button"
          onClick={() => { setActiveVault('CQ'); setFeedbackMsg(null); }}
          className={'px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center space-x-2 cursor-pointer ' + (
            activeVault === 'CQ'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
              : 'text-slate-600 hover:bg-slate-100'
          )}
        >
          <Layers className="w-4 h-4" />
          <span>📑 ২. সৃজনশীল ভাণ্ডার (CQ Vault)</span>
        </button>

        <button
          type="button"
          onClick={() => { setActiveVault('SQ'); setFeedbackMsg(null); }}
          className={'px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center space-x-2 cursor-pointer ' + (
            activeVault === 'SQ'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
              : 'text-slate-600 hover:bg-slate-100'
          )}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>📝 ৩. সংক্ষিপ্ত প্রশ্ন ভাণ্ডার (SQ Vault)</span>
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Dedicated Form for the Active Vault */}
        <div className="lg:col-span-6 space-y-5">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-black text-sm text-slate-900 flex items-center gap-2 uppercase tracking-wider">
                <Plus className="w-4 h-4 text-indigo-600" />
                <span>
                  {activeVault === 'MCQ' && 'নতুন বহুনির্বাচনী (MCQ) প্রশ্ন যুক্ত করুন'}
                  {activeVault === 'CQ' && 'নতুন সৃজনশীল (CQ) প্রশ্ন যুক্ত করুন'}
                  {activeVault === 'SQ' && 'নতুন সংক্ষিপ্ত (SQ) প্রশ্ন যুক্ত করুন'}
                </span>
              </h3>
            </div>

            {/* Category Selectors */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">শ্রেণি (Class):</label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  {CLASSES_LIST.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">বিষয় (Subject):</label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  {SUBJECTS_LIST.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">বোর্ড / প্রতিষ্ঠান (Category):</label>
                <select
                  value={selectedInstitution}
                  onChange={(e) => setSelectedInstitution(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  {INSTITUTIONS_LIST.map(inst => <option key={inst} value={inst}>{inst}</option>)}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">সাল / টার্ম (Year):</label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  {YEARS_LIST.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="text-xs font-bold text-slate-700 block mb-1">অধ্যায় (ঐচ্ছিক):</label>
                <input
                  type="text"
                  value={selectedChapter}
                  onChange={(e) => setSelectedChapter(e.target.value)}
                  placeholder="যেমন: অধ্যায় ৪: কাজ, ক্ষমতা ও শক্তি"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            {/* 1. Dedicated MCQ Form */}
            {activeVault === 'MCQ' && (
              <form onSubmit={handleSaveMCQ} className="space-y-4 pt-3 border-t border-slate-100">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-800">MCQ মূল প্রশ্ন / উদ্দীপক:</label>
                    <button
                      type="button"
                      onClick={() => {
                        setMcqQuestion('বল ও সরণের গুণফলকে কী বলে?');
                        setOptionA('ক্ষমতা');
                        setOptionB('শক্তি');
                        setOptionC('কাজ');
                        setOptionD('বেগ');
                        setCorrectAnswer('গ');
                        setMcqExplanation('কাজ = বল × বলের অভিমুখে সরণ।');
                      }}
                      className="text-[11px] font-bold text-indigo-600 hover:underline cursor-pointer"
                    >
                      + ডেমো MCQ লোড করুন
                    </button>
                  </div>
                  <textarea
                    rows={3}
                    value={mcqQuestion}
                    onChange={(e) => setMcqQuestion(e.target.value)}
                    placeholder="এখানে বহুনির্বাচনী প্রশ্নটি লিখুন বা পেস্ট করুন..."
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">ক) অপশন ১:</label>
                    <input
                      type="text"
                      value={optionA}
                      onChange={(e) => setOptionA(e.target.value)}
                      placeholder="অপশন ক"
                      className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">খ) অপশন ২:</label>
                    <input
                      type="text"
                      value={optionB}
                      onChange={(e) => setOptionB(e.target.value)}
                      placeholder="অপশন খ"
                      className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">গ) অপশন ৩:</label>
                    <input
                      type="text"
                      value={optionC}
                      onChange={(e) => setOptionC(e.target.value)}
                      placeholder="অপশন গ"
                      className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">ঘ) অপশন ৪:</label>
                    <input
                      type="text"
                      value={optionD}
                      onChange={(e) => setOptionD(e.target.value)}
                      placeholder="অপশন ঘ"
                      className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs"
                    />
                  </div>

                  <div className="md:col-span-2 flex items-center justify-between pt-1">
                    <div className="flex items-center space-x-2">
                      <label className="text-[11px] font-bold text-slate-700">সঠিক উত্তর:</label>
                      <select
                        value={correctAnswer}
                        onChange={(e) => setCorrectAnswer(e.target.value)}
                        className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-indigo-700"
                      >
                        <option value="ক">ক</option>
                        <option value="খ">খ</option>
                        <option value="গ">গ</option>
                        <option value="ঘ">ঘ</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">ব্যাখ্যা / সমাধান (ঐচ্ছিক):</label>
                  <input
                    type="text"
                    value={mcqExplanation}
                    onChange={(e) => setMcqExplanation(e.target.value)}
                    placeholder="সঠিক উত্তরের ব্যাখ্যা"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting || !mcqQuestion.trim()}
                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-600/30 flex items-center space-x-2 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Database className="w-4 h-4" />
                    <span>{isSubmitting ? 'সংরক্ষণ হচ্ছে...' : 'MCQ ভাণ্ডারে সংরক্ষণ করুন'}</span>
                  </button>
                </div>
              </form>
            )}

            {/* 2. Dedicated CQ Form */}
            {activeVault === 'CQ' && (
              <form onSubmit={handleSaveCQ} className="space-y-4 pt-3 border-t border-slate-100">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-800">সৃজনশীল দৃশ্যকল্প / উদ্দীপক:</label>
                    <button
                      type="button"
                      onClick={() => {
                        setCqStem('উদ্দীপক: ৫০ কেজি ভরের একজন ব্যক্তি ৫ মিনিটে ৫০ মিটার উঁচু পাহাড়ে উঠলেন।');
                        setSubQA('কাজ কাকে বলে?');
                        setSubQB('ধনাত্মক কাজ বলতে কী বোঝায়?');
                        setSubQC('ব্যক্তির দ্বারা কৃতকাজের পরিমাণ নির্ণয় করো।');
                        setSubQD('ব্যক্তির ক্ষমতা নির্ণয় করো।');
                      }}
                      className="text-[11px] font-bold text-purple-600 hover:underline cursor-pointer"
                    >
                      + ডেমো CQ লোড করুন
                    </button>
                  </div>
                  <textarea
                    rows={4}
                    value={cqStem}
                    onChange={(e) => setCqStem(e.target.value)}
                    placeholder="এখানে সৃজনশীল উদ্দীপকটি লিখুন..."
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none leading-relaxed"
                  />
                </div>

                <div className="space-y-2 p-3.5 bg-purple-50/40 rounded-2xl border border-purple-200/70">
                  <h4 className="text-xs font-bold text-purple-900">উপ-প্রশ্নসমূহ (ক, খ, গ, ঘ):</h4>
                  <div>
                    <label className="text-[11px] font-bold text-purple-800 block mb-0.5">(ক) জ্ঞানমূলক প্রশ্ন [১ নম্বর]:</label>
                    <input
                      type="text"
                      value={subQA}
                      onChange={(e) => setSubQA(e.target.value)}
                      placeholder="ক নম্বর প্রশ্ন লিখুন"
                      className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-purple-800 block mb-0.5">(খ) অনুধাবনমূলক প্রশ্ন [২ নম্বর]:</label>
                    <input
                      type="text"
                      value={subQB}
                      onChange={(e) => setSubQB(e.target.value)}
                      placeholder="খ নম্বর প্রশ্ন লিখুন"
                      className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-purple-800 block mb-0.5">(গ) প্রয়োগমূলক প্রশ্ন [৩ নম্বর]:</label>
                    <input
                      type="text"
                      value={subQC}
                      onChange={(e) => setSubQC(e.target.value)}
                      placeholder="গ নম্বর প্রশ্ন লিখুন"
                      className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-purple-800 block mb-0.5">(ঘ) উচ্চতর দক্ষতামূলক প্রশ্ন [৪ নম্বর]:</label>
                    <input
                      type="text"
                      value={subQD}
                      onChange={(e) => setSubQD(e.target.value)}
                      placeholder="ঘ নম্বর প্রশ্ন লিখুন"
                      className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">চিত্রের লিংক (ঐচ্ছিক):</label>
                  <input
                    type="text"
                    value={cqDiagramUrl}
                    onChange={(e) => setCqDiagramUrl(e.target.value)}
                    placeholder="https://... (চিত্রের URL)"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting || !cqStem.trim()}
                    className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-md shadow-purple-600/30 flex items-center space-x-2 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Database className="w-4 h-4" />
                    <span>{isSubmitting ? 'সংরক্ষণ হচ্ছে...' : 'CQ ভাণ্ডারে সংরক্ষণ করুন'}</span>
                  </button>
                </div>
              </form>
            )}

            {/* 3. Dedicated SQ Form */}
            {activeVault === 'SQ' && (
              <form onSubmit={handleSaveSQ} className="space-y-4 pt-3 border-t border-slate-100">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-800">সংক্ষিপ্ত প্রশ্ন:</label>
                    <button
                      type="button"
                      onClick={() => {
                        setSqQuestion('কাজ কাকে বলে? এর এসআই (SI) একক কী?');
                        setSqAnswer('কোনো বস্তুর ওপর বল প্রয়োগে সরণ ঘটলে বল ও সরণের গুণফলকে কাজ বলে। একক জুল (J)।');
                        setSqMarks(2);
                      }}
                      className="text-[11px] font-bold text-emerald-600 hover:underline cursor-pointer"
                    >
                      + ডেমো SQ লোড করুন
                    </button>
                  </div>
                  <textarea
                    rows={3}
                    value={sqQuestion}
                    onChange={(e) => setSqQuestion(e.target.value)}
                    placeholder="সংক্ষিপ্ত প্রশ্নটি লিখুন..."
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800">উত্তর / সমাধান (ঐচ্ছিক):</label>
                  <textarea
                    rows={3}
                    value={sqAnswer}
                    onChange={(e) => setSqAnswer(e.target.value)}
                    placeholder="সংক্ষিপ্ত প্রশ্নের উত্তর বা সমাধান..."
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <label className="text-xs font-bold text-slate-700">নম্বর (Marks):</label>
                  <input
                    type="number"
                    value={sqMarks}
                    onChange={(e) => setSqMarks(e.target.value)}
                    className="w-20 p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting || !sqQuestion.trim()}
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/30 flex items-center space-x-2 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Database className="w-4 h-4" />
                    <span>{isSubmitting ? 'সংরক্ষণ হচ্ছে...' : 'SQ ভাণ্ডারে সংরক্ষণ করুন'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Right Column: Stored Questions List for Active Vault */}
        <div className="lg:col-span-6 space-y-5">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 flex-wrap gap-2">
              <div className="flex items-center space-x-2">
                <Database className="w-4 h-4 text-indigo-600" />
                <h3 className="font-black text-sm text-slate-900 uppercase tracking-wider">
                  {activeVault === 'MCQ' && `সংরক্ষিত বহুনির্বাচনী প্রশ্ন (${vaultQuestions.length} টি)`}
                  {activeVault === 'CQ' && `সংরক্ষিত সৃজনশীল প্রশ্ন (${vaultQuestions.length} টি)`}
                  {activeVault === 'SQ' && `সংরক্ষিত সংক্ষিপ্ত প্রশ্ন (${vaultQuestions.length} টি)`}
                </h3>
              </div>
              <button
                type="button"
                onClick={fetchRepoQuestions}
                disabled={loadingRepo}
                className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors flex items-center space-x-1 cursor-pointer"
              >
                <RefreshCw className={'w-3.5 h-3.5 ' + (loadingRepo ? 'animate-spin' : '')} />
                <span>রিফ্রেশ</span>
              </button>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="প্রশ্ন, বিষয় বা বোর্ড দিয়ে খুঁজুন..."
                className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            {/* Questions List */}
            <div className="max-h-[580px] overflow-y-auto space-y-3 pr-1 custom-scrollbar">
              {loadingRepo ? (
                <div className="p-8 text-center text-slate-400 space-y-2">
                  <RefreshCw className="w-6 h-6 animate-spin mx-auto text-indigo-600" />
                  <p className="text-xs font-bold">ভাণ্ডার লোড হচ্ছে...</p>
                </div>
              ) : vaultQuestions.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-100 text-slate-400 space-y-2">
                  <FolderOpen className="w-8 h-8 mx-auto text-slate-300" />
                  <p className="text-xs font-bold text-slate-700">এই ভাণ্ডারে কোনো প্রশ্ন নেই</p>
                  <p className="text-[11px] text-slate-400">বাম পাশের ফরম ব্যবহার করে প্রশ্ন সংরক্ষণ করুন।</p>
                </div>
              ) : (
                vaultQuestions.map((q, idx) => {
                  const qId = q?.id || q?.M_ID || idx;

                  return (
                    <div key={qId} className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs space-y-2 relative group hover:bg-white hover:shadow-sm transition-all">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1.5">
                          <span className={'px-2 py-0.5 rounded-md font-bold text-[10px] ' + (
                            activeVault === 'CQ' ? 'bg-purple-100 text-purple-800' : activeVault === 'SQ' ? 'bg-emerald-100 text-emerald-800' : 'bg-indigo-100 text-indigo-800'
                          )}>
                            {q?.type || activeVault}
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-slate-200 text-slate-700 font-bold text-[10px]">
                            {q?.badge || `[${q?.institutionOrBoard || q?.boardOrInstitute || 'বোর্ড'} - '${(q?.year || '26').slice(-2)}]`}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleDeleteItem(qId)}
                          className="text-slate-400 hover:text-rose-600 transition-colors p-1 rounded-lg hover:bg-rose-50 cursor-pointer"
                          title="মুছে ফেলুন"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Question Text / Stem */}
                      <p className="font-bold text-slate-800 leading-relaxed">
                        {q?.question || q?.stem || 'প্রশ্নের শিরোনাম নেই'}
                      </p>

                      {/* Options for MCQ */}
                      {activeVault === 'MCQ' && Array.isArray(q?.options) && q.options.length > 0 && (
                        <div className="grid grid-cols-2 gap-1.5 pt-1 text-[11px] text-slate-600">
                          {q.options.map((opt, oIdx) => (
                            <div key={oIdx} className="px-2 py-1 bg-white border border-slate-200/80 rounded-lg">
                              <span className="font-bold text-indigo-600 mr-1">{String.fromCharCode(97 + oIdx)})</span>
                              <span>{opt}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Sub-questions for CQ */}
                      {activeVault === 'CQ' && q?.subQuestions && (
                        <div className="space-y-1 pt-1 text-[11px] text-slate-600">
                          {Object.entries(q.subQuestions).map(([key, val]) => (
                            <div key={key} className="flex items-start space-x-1">
                              <span className="font-bold text-purple-700">({key === 'a' ? 'ক' : key === 'b' ? 'খ' : key === 'c' ? 'গ' : 'ঘ'})</span>
                              <span>{typeof val === 'object' ? val?.q : val}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Answer for SQ */}
                      {activeVault === 'SQ' && q?.shortAnswer && (
                        <div className="p-2 bg-white rounded-lg border border-slate-200 text-[11px] text-emerald-800">
                          <span className="font-bold">উত্তর: </span>{q.shortAnswer}
                        </div>
                      )}

                      {/* Metadata footer */}
                      <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-200/60">
                        <span>{q?.book || q?.subject || 'সাধারণ বিষয়'} • {q?.className || 'দশম শ্রেণি'}</span>
                        {q?.correctAnswer !== undefined && activeVault === 'MCQ' && (
                          <span className="font-bold text-emerald-700">উত্তর: {q.correctAnswer}</span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
