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
  X
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

export default function SmartUploadReaderHub({ onNavigateToMaker, onNavigateToOMR }) {
  const { lang } = useLanguage();

  // Category Metadata State
  const [selectedClass, setSelectedClass] = useState(CLASSES_LIST[4]); // Class 10
  const [selectedSubject, setSelectedSubject] = useState(SUBJECTS_LIST[2]); // Physics
  const [selectedInstitution, setSelectedInstitution] = useState(INSTITUTIONS_LIST[0]); // Dhaka Board
  const [selectedYear, setSelectedYear] = useState('2026');
  const [selectedChapter, setSelectedChapter] = useState('');
  const [questionType, setQuestionType] = useState('MCQ'); // 'MCQ' | 'CQ' | 'SQ'

  // Input Data State
  const [questionText, setQuestionText] = useState('');
  const [optionA, setOptionA] = useState('');
  const [optionB, setOptionB] = useState('');
  const [optionC, setOptionC] = useState('');
  const [optionD, setOptionD] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('ক');
  const [explanation, setExplanation] = useState('');
  const [marks, setMarks] = useState(1);
  const [diagramUrl, setDiagramUrl] = useState('');

  // Status & Feedback State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState(null);

  // Stored Repository State
  const [repoQuestions, setRepoQuestions] = useState([]);
  const [loadingRepo, setLoadingRepo] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('ALL');

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

  // Quick Template Setters
  const handleLoadTemplate = (type) => {
    setQuestionType(type);
    if (type === 'MCQ') {
      setQuestionText('বল ও সরণের গুণফলকে কী বলে?');
      setOptionA('ক্ষমতা');
      setOptionB('শক্তি');
      setOptionC('কাজ');
      setOptionD('বেগ');
      setCorrectAnswer('গ');
      setExplanation('কাজ = বল × বলের অভিমুখে সরণ।');
      setMarks(1);
    } else if (type === 'CQ') {
      setQuestionText('উদ্দীপক: ৫০ কেজি ভরের একজন ব্যক্তি ৫ মিনিটে ৫০ মিটার উঁচু পাহাড়ে উঠলেন।\n\n(ক) কাজ কাকে বলে? [১]\n(খ) ধনাত্মক কাজ বলতে কী বোঝায়? [২]\n(গ) ব্যক্তির দ্বারা কৃতকাজের পরিমাণ নির্ণয় করো। [৩]\n(ঘ) ব্যক্তির ক্ষমতা নির্ণয় করো। [৪]');
      setMarks(10);
    } else {
      setQuestionText('কাজ কাকে বলে? এর এসআই (SI) একক কী?');
      setExplanation('উত্তর: কোনো বস্তুর ওপর বল প্রয়োগের ফলে যদি বস্তুর সরণ ঘটে, তবে বল ও সরণের গুণফলকে কাজ বলে। কাজের এসআই একক জুল (J)।');
      setMarks(2);
    }
  };

  // Direct Save / Store Function
  const handleSaveQuestion = async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    const cleanText = (questionText || '').trim();
    if (!cleanText) {
      const msg = 'অনুগ্রহ করে প্রশ্নের বিবরণ বা টেক্সট লিখুন।';
      setFeedbackMsg({ type: 'error', text: msg });
      alert(msg);
      return;
    }

    setIsSubmitting(true);
    setFeedbackMsg(null);

    try {
      let constructedQuestions = [];

      // Check if user entered multiple questions separated by double newlines
      const rawBlocks = cleanText.split(/\r?\n\s*\r?\n+/).map(b => b.trim()).filter(Boolean);

      if (rawBlocks.length > 1) {
        // Multi-block batch parsing
        constructedQuestions = rawBlocks.map((block, idx) => {
          const isCQ = block.includes('উদ্দীপক') || block.includes('ক)') || block.includes('খ)');
          const isSq = block.includes('সংক্ষিপ্ত') || (!block.includes('ক.') && !block.includes('খ.') && !isCQ);
          const blockType = isCQ ? 'CQ' : isSq ? 'SQ' : 'MCQ';

          return {
            id: `manual-${Date.now()}-${idx}`,
            type: blockType,
            question: block.split(/\r?\n/)[0] || `প্রশ্ন ${idx + 1}`,
            stem: block,
            options: blockType === 'MCQ' ? (optionA ? [optionA, optionB, optionC, optionD].filter(Boolean) : ['বিকল্প ১', 'বিকল্প ২', 'বিকল্প ৩', 'বিকল্প ৪']) : [],
            correctAnswer: correctAnswer || 'ক',
            explanation: explanation || '',
            marks: blockType === 'CQ' ? 10 : blockType === 'SQ' ? 2 : 1,
            diagramUrl: diagramUrl || null,
            difficulty: 'MEDIUM',
            boardOrInstitute: selectedInstitution,
            year: selectedYear,
            subject: selectedSubject,
            class: selectedClass,
            chapter: selectedChapter || null
          };
        });
      } else {
        // Single structured question
        const optionsList = questionType === 'MCQ' 
          ? [optionA || 'বিকল্প ১', optionB || 'বিকল্প ২', optionC || 'বিকল্প ৩', optionD || 'বিকল্প ৪']
          : [];

        constructedQuestions = [{
          id: `manual-${Date.now()}-0`,
          type: questionType,
          question: cleanText,
          stem: cleanText,
          options: optionsList,
          correctAnswer: correctAnswer || 'ক',
          explanation: explanation || '',
          marks: Number(marks) || (questionType === 'CQ' ? 10 : questionType === 'SQ' ? 2 : 1),
          diagramUrl: diagramUrl || null,
          difficulty: 'MEDIUM',
          boardOrInstitute: selectedInstitution,
          year: selectedYear,
          subject: selectedSubject,
          class: selectedClass,
          chapter: selectedChapter || null
        }];
      }

      const payload = {
        questions: constructedQuestions,
        rawText: cleanText,
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

      console.log('[ManualQuestionSystem] 🚀 Saving to Repository:', payload);
      const res = await questionRepositoryAPI.uploadAndTrain(payload);
      console.log('[ManualQuestionSystem] 📥 Response:', res);

      if (res?.success) {
        const savedCount = res.data?.savedCount || res.data?.count || constructedQuestions.length;
        const successMessage = `🎉 অভিনন্দন! ${savedCount}টি প্রশ্ন কেন্দ্রীয় প্রশ্ন ভাণ্ডারে সফলভাবে সংরক্ষিত হয়েছে!`;
        setFeedbackMsg({ type: 'success', text: successMessage });
        alert(successMessage);

        // Reset inputs
        setQuestionText('');
        setOptionA('');
        setOptionB('');
        setOptionC('');
        setOptionD('');
        setExplanation('');
        setDiagramUrl('');
        fetchRepoQuestions();
      } else {
        const errMsg = res?.error?.message || res?.message || 'সংরক্ষণ করতে সমস্যা হয়েছে।';
        console.error('[ManualQuestionSystem] Save Error:', errMsg);
        setFeedbackMsg({ type: 'error', text: errMsg });
        alert(`সংরক্ষণ ব্যর্থ: ${errMsg}`);
      }
    } catch (err) {
      console.error('[ManualQuestionSystem] Network Exception:', err);
      const fatalMsg = err?.message || 'নেটওয়ার্ক সংযোগ বা সার্ভারে সমস্যা হয়েছে।';
      setFeedbackMsg({ type: 'error', text: fatalMsg });
      alert(`সার্ভার ত্রুটি: ${fatalMsg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete question item
  const handleDeleteItem = async (id) => {
    if (!window.confirm('আপনি কি নিশ্চিত যে এই প্রশ্নটি ভাণ্ডার থেকে মুছে ফেলতে চান?')) return;
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

  // Safe Filtered Questions
  const filteredQuestions = useMemo(() => {
    const safeList = Array.isArray(repoQuestions) ? repoQuestions : [];
    return safeList.filter(q => {
      const qText = String(q?.question || q?.stem || '').toLowerCase();
      const qInst = String(q?.institutionOrBoard || q?.boardOrInstitute || q?.category || '').toLowerCase();
      const qBook = String(q?.book || q?.subject || '').toLowerCase();
      const search = (searchTerm || '').toLowerCase();

      const matchesSearch = !search || qText.includes(search) || qInst.includes(search) || qBook.includes(search);
      const matchesType = filterType === 'ALL' || q?.type === filterType;

      return matchesSearch && matchesType;
    });
  }, [repoQuestions, searchTerm, filterType]);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden border border-indigo-500/30">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md mb-2">
              <Database className="w-3.5 h-3.5 text-indigo-400" />
              <span>১০০% সুরক্ষিত ম্যানুয়াল প্রশ্ন রিপোজিটরি ও ডাটাবেজ</span>
            </div>
            <h2 className="text-xl md:text-2xl font-black tracking-tight">
              কেন্দ্রীয় প্রশ্ন ভাণ্ডার সংগ্রহশালা (Manual Question System)
            </h2>
            <p className="text-xs md:text-sm text-slate-300 mt-1">
              সরাসরি প্রশ্ন টাইপ বা পেস্ট করে শ্রেণি, বিষয় ও বোর্ড সিলেক্ট করে ১-ক্লিকে সংরক্ষণ করুন।
            </p>
          </div>

          <div className="flex items-center gap-2">
            {onNavigateToMaker && (
              <button
                type="button"
                onClick={onNavigateToMaker}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center space-x-1.5"
              >
                <Sparkles className="w-4 h-4" />
                <span>এআই জেনারেটর</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Form & Repository Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Category & Direct Question Form */}
        <div className="lg:col-span-6 space-y-5">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5">
            <h3 className="font-black text-sm text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100 uppercase tracking-wider">
              <FileText className="w-4 h-4 text-indigo-600" />
              <span>১. ক্যাটাগরি ও প্রশ্ন এন্ট্রি ফরম</span>
            </h3>

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

            {/* Question Type Selector & Demo Templates */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700">প্রশ্নের ধরন ও টেমপ্লেট:</label>
                <div className="flex items-center space-x-1.5">
                  <button
                    type="button"
                    onClick={() => handleLoadTemplate('MCQ')}
                    className="px-2 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[11px] font-bold rounded-lg transition-colors cursor-pointer"
                  >
                    + ডেমো MCQ
                  </button>
                  <button
                    type="button"
                    onClick={() => handleLoadTemplate('CQ')}
                    className="px-2 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 text-[11px] font-bold rounded-lg transition-colors cursor-pointer"
                  >
                    + ডেমো CQ
                  </button>
                  <button
                    type="button"
                    onClick={() => handleLoadTemplate('SQ')}
                    className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[11px] font-bold rounded-lg transition-colors cursor-pointer"
                  >
                    + ডেমো SQ
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setQuestionType('MCQ')}
                  className={'p-2.5 rounded-xl text-xs font-bold transition-all border ' + (
                    questionType === 'MCQ'
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  )}
                >
                  বহুনির্বাচনী (MCQ)
                </button>
                <button
                  type="button"
                  onClick={() => setQuestionType('CQ')}
                  className={'p-2.5 rounded-xl text-xs font-bold transition-all border ' + (
                    questionType === 'CQ'
                      ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  )}
                >
                  সৃজনশীল (CQ)
                </button>
                <button
                  type="button"
                  onClick={() => setQuestionType('SQ')}
                  className={'p-2.5 rounded-xl text-xs font-bold transition-all border ' + (
                    questionType === 'SQ'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  )}
                >
                  সংক্ষিপ্ত (SQ)
                </button>
              </div>
            </div>

            {/* Direct Textarea */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">
                {questionType === 'CQ' ? 'সৃজনশীল উদ্দীপক ও প্রশ্নাবলি:' : 'প্রশ্নের বিবরণ:'}
              </label>
              <textarea
                rows={5}
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                placeholder="এখানে প্রশ্ন টাইপ করুন বা পেস্ট করুন... (একাধিক প্রশ্ন থাকলে মাঝে ফাঁকা লাইন রাখুন)"
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono leading-relaxed"
              />
            </div>

            {/* MCQ Options (If MCQ selected) */}
            {questionType === 'MCQ' && (
              <div className="space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
                <h4 className="text-xs font-bold text-slate-800">MCQ অপশন ও সঠিক উত্তর:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">ক) অপশন ১:</label>
                    <input
                      type="text"
                      value={optionA}
                      onChange={(e) => setOptionA(e.target.value)}
                      placeholder="অপশন ক"
                      className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">খ) অপশন ২:</label>
                    <input
                      type="text"
                      value={optionB}
                      onChange={(e) => setOptionB(e.target.value)}
                      placeholder="অপশন খ"
                      className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">গ) অপশন ৩:</label>
                    <input
                      type="text"
                      value={optionC}
                      onChange={(e) => setOptionC(e.target.value)}
                      placeholder="অপশন গ"
                      className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">ঘ) অপশন ৪:</label>
                    <input
                      type="text"
                      value={optionD}
                      onChange={(e) => setOptionD(e.target.value)}
                      placeholder="অপশন ঘ"
                      className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5 pt-1">
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">সঠিক উত্তর:</label>
                    <select
                      value={correctAnswer}
                      onChange={(e) => setCorrectAnswer(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                    >
                      <option value="ক">ক</option>
                      <option value="খ">খ</option>
                      <option value="গ">গ</option>
                      <option value="ঘ">ঘ</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">নম্বর (Marks):</label>
                    <input
                      type="number"
                      value={marks}
                      onChange={(e) => setMarks(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs font-bold"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Explanation / Notes */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">ব্যাখ্যা / উত্তর সংকেত (ঐচ্ছিক):</label>
              <input
                type="text"
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
                placeholder="সঠিক উত্তরের ব্যাখ্যা বা নোট"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>

            {/* Feedback Alert */}
            {feedbackMsg && (
              <div className={'p-3.5 rounded-2xl flex items-center space-x-2 text-xs font-bold ' + (
                feedbackMsg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
              )}>
                {feedbackMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />}
                <span>{feedbackMsg.text}</span>
              </div>
            )}

            {/* Submit Action */}
            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setQuestionText('');
                  setOptionA('');
                  setOptionB('');
                  setOptionC('');
                  setOptionD('');
                  setExplanation('');
                }}
                className="px-4 py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                ক্লিয়ার
              </button>
              <button
                type="button"
                onClick={handleSaveQuestion}
                disabled={isSubmitting || !questionText.trim()}
                className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/20 flex items-center space-x-2 transition-all cursor-pointer disabled:opacity-50"
              >
                <Database className="w-4 h-4" />
                <span>{isSubmitting ? 'সংরক্ষণ হচ্ছে...' : 'কেন্দ্রীয় ভাণ্ডারে সংরক্ষণ করুন'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Stored Questions Repository Manager */}
        <div className="lg:col-span-6 space-y-5">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 flex-wrap gap-2">
              <div className="flex items-center space-x-2">
                <Database className="w-4 h-4 text-emerald-600" />
                <h3 className="font-black text-sm text-slate-900 uppercase tracking-wider">
                  সংরক্ষিত প্রশ্ন ভাণ্ডার ({filteredQuestions.length} টি)
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

            {/* Search & Type Filter Bar */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex-1 min-w-[180px] relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="প্রশ্ন, বিষয় বা বোর্ড দিয়ে খুঁজুন..."
                  className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setFilterType('ALL')}
                  className={'px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ' + (
                    filterType === 'ALL' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  )}
                >
                  সকল
                </button>
                <button
                  type="button"
                  onClick={() => setFilterType('MCQ')}
                  className={'px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ' + (
                    filterType === 'MCQ' ? 'bg-indigo-600 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                  )}
                >
                  MCQ
                </button>
                <button
                  type="button"
                  onClick={() => setFilterType('CQ')}
                  className={'px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ' + (
                    filterType === 'CQ' ? 'bg-purple-600 text-white' : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
                  )}
                >
                  CQ
                </button>
                <button
                  type="button"
                  onClick={() => setFilterType('SQ')}
                  className={'px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ' + (
                    filterType === 'SQ' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                  )}
                >
                  SQ
                </button>
              </div>
            </div>

            {/* Questions List */}
            <div className="max-h-[580px] overflow-y-auto space-y-3 pr-1 custom-scrollbar">
              {loadingRepo ? (
                <div className="p-8 text-center text-slate-400 space-y-2">
                  <RefreshCw className="w-6 h-6 animate-spin mx-auto text-indigo-600" />
                  <p className="text-xs font-bold">প্রশ্ন ভাণ্ডার লোড হচ্ছে...</p>
                </div>
              ) : filteredQuestions.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-100 text-slate-400 space-y-2">
                  <FolderOpen className="w-8 h-8 mx-auto text-slate-300" />
                  <p className="text-xs font-bold text-slate-700">কোনো প্রশ্ন সংরক্ষিত পাওয়া যায়নি</p>
                  <p className="text-[11px] text-slate-400">বাম পাশের ফরম ব্যবহার করে নতুন প্রশ্ন যুক্ত করুন।</p>
                </div>
              ) : (
                filteredQuestions.map((q, idx) => {
                  const qId = q?.id || q?.M_ID || idx;
                  const isCQ = q?.type === 'CQ';
                  const isSQ = q?.type === 'SQ' || q?.type === 'SHORT';

                  return (
                    <div key={qId} className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs space-y-2 relative group hover:bg-white hover:shadow-sm transition-all">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1.5">
                          <span className={'px-2 py-0.5 rounded-md font-bold text-[10px] ' + (
                            isCQ ? 'bg-purple-100 text-purple-800' : isSQ ? 'bg-emerald-100 text-emerald-800' : 'bg-indigo-100 text-indigo-800'
                          )}>
                            {q?.type || 'MCQ'}
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
                      {Array.isArray(q?.options) && q.options.length > 0 && (
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
                      {isCQ && q?.subQuestions && (
                        <div className="space-y-1 pt-1 text-[11px] text-slate-600">
                          {Object.entries(q.subQuestions).map(([key, val]) => (
                            <div key={key} className="flex items-start space-x-1">
                              <span className="font-bold text-purple-700">({key === 'a' ? 'ক' : key === 'b' ? 'খ' : key === 'c' ? 'গ' : 'ঘ'})</span>
                              <span>{typeof val === 'object' ? val?.q : val}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Metadata footer */}
                      <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-200/60">
                        <span>{q?.book || q?.subject || 'সাধারণ বিষয়'} • {q?.className || 'দশম শ্রেণি'}</span>
                        {q?.correctAnswer !== undefined && (
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
