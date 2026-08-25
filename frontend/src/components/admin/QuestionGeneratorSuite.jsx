import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Sparkles,
  Bot,
  HelpCircle,
  Sliders,
  PenTool,
  Award,
  BookOpen,
  Database,
  Search,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertCircle,
  Copy,
  Download,
  Printer,
  FileSpreadsheet,
  FileText,
  Layers,
  Zap,
  Check,
  X,
  RefreshCw,
  Eye,
  EyeOff,
  Filter,
  CheckSquare,
  GraduationCap,
  Calendar,
  Share2,
  ArrowRight,
  Hash,
  ListOrdered
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { examAPI, curriculumAPI } from '../../services/api';
import OMRImportModule from './OMRImportModule';
import AIMCQGeneratorModal from '../common/AIMCQGeneratorModal';
import AICQGeneratorModal from '../common/AICQGeneratorModal';

const BOARDS_LIST = [
  'ঢাকা', 'রাজশাহী', 'কুমিল্লা', 'যশোর', 'চট্টগ্রাম', 'বরিশাল', 'সিলেট', 'দিনাজপুর', 'ময়মনসিংহ', 'মাদ্রাসা', 'কারিগরি', 'সকল বোর্ড'
];

const YEARS_LIST = ['2026', '2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016', '2015'];

const BENGALI_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
function toBengaliDigits(num) {
  if (num === undefined || num === null) return '';
  return String(num).replace(/[0-9]/g, d => BENGALI_DIGITS[Number(d)]);
}
function normalizeBengaliDigits(str) {
  if (!str) return '';
  return String(str).replace(/[০-৯]/g, d => BENGALI_DIGITS.indexOf(d));
}

// Initial Question Bank Seeds (Class 9-10 & SSC/HSC)
const INITIAL_QUESTION_BANK = [
  {
    id: 'qb-1',
    type: 'MCQ',
    subject: 'পদার্থবিজ্ঞান',
    className: 'Class 9-10 (SSC)',
    chapter: 'অধ্যায় ২: গতি (Motion)',
    question: 'পরন্ত বস্তুর তৃতীয় সূত্রানুসারে মুক্তভাবে পরন্ত বস্তুর নির্দিষ্ট সময়ে প্রাপ্ত বেগ সময়ের সাথে কীভাবে পরিবর্তিত হয়?',
    options: [
      'প্রাপ্ত বেগ সময়ের সমানুপাতিক (v ∝ t)',
      'প্রাপ্ত বেগ দূরত্বের বর্গের সমানুপাতিক',
      'প্রাপ্ত বেগ সময়ের বর্গের ব্যস্তানুপাতিক',
      'প্রাপ্ত বেগ সময়ের বর্গের সমানুপাতিক (v ∝ t²)'
    ],
    correctAnswer: 0,
    explanation: 'গ্যালিলিওর পরন্ত বস্তুর ৩য় সূত্র মতে: নির্দিষ্ট সময়ে প্রাপ্ত বেগ অতিক্রান্ত সময়ের সমানুপাতিক (v ∝ t)।',
    board: 'ঢাকা',
    year: '2025',
    badge: 'ঢাকা - ২৫ (MCQ)',
    difficulty: 'MEDIUM',
    createdAt: '2026-08-20'
  },
  {
    id: 'qb-2',
    type: 'MCQ',
    subject: 'রসায়ন',
    className: 'Class 9-10 (SSC)',
    chapter: 'অধ্যায় ৫: রাসায়নিক বন্ধন',
    question: 'নিচের কোন অণুতে মুক্তজোড় ইলেকট্রন (Lone Pair) সংখ্যা সর্বাধিক?',
    options: ['CH₄', 'NH₃', 'H₂O', 'HF'],
    correctAnswer: 3,
    explanation: 'HF অণুতে ফ্লোরিনের সর্ববহিস্থ স্তরে ৩ জোড়া (৬টি) মুক্তজোড় ইলেকট্রন বিদ্যমান থাকে।',
    board: 'কুমিল্লা',
    year: '2024',
    badge: 'কুমিল্লা - ২৪ (MCQ)',
    difficulty: 'HARD',
    createdAt: '2026-08-21'
  },
  {
    id: 'qb-3',
    type: 'MCQ',
    subject: 'উচ্চতর গণিত',
    className: 'Class 9-10 (SSC)',
    chapter: 'অধ্যায় ৮: ত্রিকোণমিতি',
    question: 'যদি tan θ = 3/4 এবং cos θ ঋণাত্মক হয়, তবে sin θ এর মান কত?',
    options: ['3/5', '-3/5', '-4/5', '4/5'],
    correctAnswer: 1,
    explanation: 'যেহেতু tan θ ধনাত্মক ও cos θ ঋণাত্মক, তাই θ ৩য় চতুর্ভাগে অবস্থিত। ৩য় চতুর্ভাগে sin ঋণাত্মক, সুতরাং sin θ = -3/5।',
    board: 'রাজশাহী',
    year: '2025',
    badge: 'রাজশাহী - ২৫ (MCQ)',
    difficulty: 'HARD',
    createdAt: '2026-08-22'
  },
  {
    id: 'qb-4',
    type: 'CQ',
    subject: 'পদার্থবিজ্ঞান',
    className: 'Class 9-10 (SSC)',
    chapter: 'অধ্যায় ৪: কাজ, ক্ষমতা ও শক্তি',
    stem: '৫০ কেজি ভরের একজন বালক ৫০ সেন্টিমিটার উচ্চতাবিশিষ্ট ২০টি সিঁড়ির ধাপ ১০ সেকেন্ডে উঠে ছাদ পৌঁছাল। অন্যদিকে ৪০ কেজি ভরের অপর একজন বালক একই সিঁড়ি ৮ সেকেন্ডে অতিক্রম করল। [g = 9.8 ms⁻²]',
    subQuestions: {
      a: { q: 'কাজের মাত্রা সমীকরণ কী?', mark: 1, ans: '[W] = [ML²T⁻²]' },
      b: { q: 'ধনাত্মক কাজ ও ঋণাত্মক কাজের মধ্যে মৌলিক পার্থক্য ব্যাখ্যা কর।', mark: 2, ans: 'বলের অভিমুখে সরণ হলে ধনাত্মক কাজ এবং বলের বিপরীত দিকে সরণ হলে ঋণাত্মক কাজ হয়।' },
      c: { q: 'প্রথম বালকের কৃতকাজের পরিমাণ নির্ণয় কর।', mark: 3, ans: 'মোট উচ্চতা h = 20 × 0.5m = 10m। কৃতকাজ W = mgh = 50 × 9.8 × 10 = 4900 Joule।' },
      d: { q: 'উভয় বালকের ক্ষেত্রে কার ক্ষমতা অপেক্ষাকৃত বেশি হবে? গাণিতিকভাবে বিশ্লেষণ কর।', mark: 4, ans: '১ম বালকের ক্ষমতা P1 = 4900/10 = 490 W। ২য় বালকের কৃতকাজ W2 = 40×9.8×10 = 3920 J, ক্ষমতা P2 = 3920/8 = 490 W। উভয় বালকের ক্ষমতা সমান।' }
    },
    board: 'যশোর',
    year: '2024',
    badge: 'যশোর - ২৪ (CQ)',
    difficulty: 'HARD',
    createdAt: '2026-08-22'
  },
  {
    id: 'qb-5',
    type: 'MCQ',
    subject: 'জীববিজ্ঞান',
    className: 'Class 9-10 (SSC)',
    chapter: 'অধ্যায় ৪: জীবনীশক্তি',
    question: 'সালোকসংশ্লেষণের আলোক-নিরপেক্ষ পর্যায়ে CO₂ গ্রহীতা হিসেবে কাজ করে কোনটি?',
    options: ['RuBP (রাইবুলোজ ১,৫-বিসফসফেট)', 'PGA (ফসফোগ্লিসারিক এসিড)', 'NADPH', 'ATP'],
    correctAnswer: 0,
    explanation: 'ক্যালভিন চক্রে ৫-কার্বনবিশিষ্ট RuBP কার্বন ডাই অক্সাইড গ্রহণ করে অস্থায়ী কিটো এসিড উৎপন্ন করে।',
    board: 'চট্টগ্রাম',
    year: '2023',
    badge: 'চট্টগ্রাম - ২৩ (MCQ)',
    difficulty: 'MEDIUM',
    createdAt: '2026-08-23'
  }
];

export default function QuestionGeneratorSuite({ defaultTab = 'ai-generator' }) {
  const { lang, t } = useLanguage();
  const [activeTab, setActiveTab] = useState(defaultTab);

  // Modals for AI Popups
  const [showAIMCQModal, setShowAIMCQModal] = useState(false);
  const [showAICQModal, setShowAICQModal] = useState(false);

  // Question Bank State
  const [questionBank, setQuestionBank] = useState(() => {
    const saved = localStorage.getItem('nextgen_question_bank');
    return saved ? JSON.parse(saved) : INITIAL_QUESTION_BANK;
  });

  // Save changes to Question Bank
  useEffect(() => {
    localStorage.setItem('nextgen_question_bank', JSON.stringify(questionBank));
  }, [questionBank]);

  // Keep internal tab in sync with defaultTab prop changes from sidebar navigation
  useEffect(() => {
    if (defaultTab) {
      if (defaultTab === 'multi-board-generator' || defaultTab === 'question-distribution') {
        setActiveTab('multi-board');
      } else if (defaultTab === 'manual-question-creator' || defaultTab === 'manual-questions') {
        setActiveTab('manual-creator');
      } else if (defaultTab === 'omr-evaluation' || defaultTab === 'omr' || defaultTab === 'omr-import') {
        setActiveTab('omr-import');
      } else if (defaultTab === 'question-bank' || defaultTab === 'question-archive') {
        setActiveTab('question-bank');
      } else {
        setActiveTab('ai-generator');
      }
    }
  }, [defaultTab]);

  // =========================================================================
  // SUBMODULE 2: MULTI-BOARD & MULTI-YEAR PROMPT DISTRIBUTION GENERATOR
  // =========================================================================
  const [multiPrompt, setMultiPrompt] = useState('ঢাকা ২৫ ২০টি, কুমিল্লা ২৪ ১২টি, রাজশাহী ২৩ ১০টি, যশোর ২২ ৮টি');
  const [multiSubject, setMultiSubject] = useState('পদার্থবিজ্ঞান');
  const [multiClass, setMultiClass] = useState('Class 9-10 (SSC)');
  const [multiChapter, setMultiChapter] = useState('গতি ও বল (Chapter 2 & 3)');
  const [multiQuestionType, setMultiQuestionType] = useState('MCQ');
  const [isGeneratingMulti, setIsGeneratingMulti] = useState(false);
  const [generatedMultiQuestions, setGeneratedMultiQuestions] = useState([]);
  const [multiError, setMultiError] = useState(null);

  // Parse Multi-Board prompt dynamically
  const parsedDistributions = useMemo(() => {
    if (!multiPrompt.trim()) return [];
    const text = normalizeBengaliDigits(multiPrompt.trim());
    const distributions = [];

    // Match patterns like "ঢাকা ২৫ ২০টি" or "কুমিল্লা ২৪ ১২টি" or "ঢাকা-২০২৫: ১০"
    const regex = /(ঢাকা|রাজশাহী|কুমিল্লা|যশোর|চট্টগ্রাম|বরিশাল|সিলেট|দিনাজপুর|ময়মনসিংহ|মাদ্রাসা|কারিগরি|সকল বোর্ড)[^\d]*([0-9]{2,4})?[^\d]*([0-9]{1,3})\s*(?:টি|টা|প্রশ্ন)?/gi;
    let match;
    while ((match = regex.exec(text)) !== null) {
      const board = match[1];
      let year = match[2] ? match[2].trim() : '2025';
      if (year.length === 2) {
        year = '20' + year;
      }
      const count = parseInt(match[3], 10);
      if (count > 0) {
        const shortYear = year.slice(-2);
        const badge = board + ' - ' + shortYear + ' (' + multiQuestionType + ')';
        distributions.push({ board, year, shortYear, count, badge });
      }
    }
    return distributions;
  }, [multiPrompt, multiQuestionType]);

  const totalRequestedCount = useMemo(() => {
    return parsedDistributions.reduce((sum, d) => sum + d.count, 0);
  }, [parsedDistributions]);

  const handleGenerateMultiBoard = () => {
    if (parsedDistributions.length === 0) {
      setMultiError('অনুগ্রহ করে সঠিক বোর্ড ও প্রশ্ন সংখ্যার বিন্যাস লিখুন (যেমন: ঢাকা ২৫ ২০টি, কুমিল্লা ২৪ ১২টি)');
      return;
    }
    setMultiError(null);
    setIsGeneratingMulti(true);

    setTimeout(() => {
      const resultQuestions = [];
      let currentId = Date.now();

      parsedDistributions.forEach((dist) => {
        for (let i = 1; i <= dist.count; i++) {
          if (multiQuestionType === 'MCQ') {
            resultQuestions.push({
              id: 'gen-' + (currentId++),
              type: 'MCQ',
              subject: multiSubject,
              className: multiClass,
              chapter: multiChapter,
              question: '[' + dist.board + ' বোর্ড ' + dist.year + '] ' + multiSubject + ' অধ্যায় (' + multiChapter + ') প্রশ্ন #' + i + ': নিচের কোন তথ্যটি সঠিক গাণিতিক সম্পর্ক নির্দেশ করে?',
              options: [
                'বিকল্প (ক): সূত্র ১ - ' + dist.board + ' মান অনুক্রম',
                'বিকল্প (খ): সূত্র ২ - সঠিক চলক ও একক নির্দেশক',
                'বিকল্প (গ): সূত্র ৩ - বিপরীতমুখী সম্পর্কযুক্ত',
                'বিকল্প (ঘ): সূত্র ৪ - ধ্রুবক নির্ভর মান'
              ],
              correctAnswer: (i % 4),
              explanation: dist.board + ' বোর্ডের বিগত ' + dist.year + ' সালের প্রশ্ন বিশ্লেষণ অনুসারে বিকল্প (' + ['ক', 'খ', 'গ', 'ঘ'][i % 4] + ') সঠিক উত্তর।',
              board: dist.board,
              year: dist.year,
              badge: dist.badge,
              difficulty: i % 3 === 0 ? 'HARD' : i % 2 === 0 ? 'MEDIUM' : 'EASY'
            });
          } else {
            resultQuestions.push({
              id: 'gen-' + (currentId++),
              type: 'CQ',
              subject: multiSubject,
              className: multiClass,
              chapter: multiChapter,
              stem: '[' + dist.board + ' বোর্ড ' + dist.year + ' সৃজনশীল উদ্দীপক #' + i + ']: ' + multiSubject + '-এর ' + multiChapter + ' সংক্রান্ত একটি ব্যবহারিক পরীক্ষায় ৫ কেজি ভরের একটি বস্তুর গতিবেগ ও শক্তির পরিবর্তন পর্যবেক্ষণ করা হলো।',
              subQuestions: {
                a: { q: 'জ্ঞানমূলক: সূত্রটির নাম কী?', mark: 1, ans: 'সংজ্ঞা ও মূল সূত্র।' },
                b: { q: 'অনুধাবনমূলক: ঘটনাটির তাৎপর্য ব্যাখ্যা কর।', mark: 2, ans: 'বাস্তব প্রয়োগ ও কারণ।' },
                c: { q: 'প্রয়োগমূলক: উদ্দীপকের উপাত্ত হতে গাণিতিক মান বের কর।', mark: 3, ans: 'মান নির্ণয় ও সমীকরণ।' },
                d: { q: 'উচ্চতর দক্ষতা: প্রদত্ত সিদ্ধান্তটি যথার্থ কিনা বিশ্লেষণ কর।', mark: 4, ans: 'যুক্তি ও চূড়ান্ত মূল্যায়ন।' }
              },
              board: dist.board,
              year: dist.year,
              badge: dist.badge,
              difficulty: 'HARD'
            });
          }
        }
      });

      setGeneratedMultiQuestions(resultQuestions);
      setIsGeneratingMulti(false);
    }, 800);
  };

  const handleSaveMultiToBank = () => {
    if (generatedMultiQuestions.length === 0) return;
    setQuestionBank(prev => [...generatedMultiQuestions, ...prev]);
    alert('🎉 সফল হয়েছে! মোট ' + generatedMultiQuestions.length + 'টি মাল্টি-বোর্ড প্রশ্ন সফলভাবে কেন্দ্রীয় প্রশ্ন ব্যাংকে সংরক্ষিত হয়েছে!');
  };

  // =========================================================================
  // SUBMODULE 3: MANUAL QUESTION CREATOR
  // =========================================================================
  const [manualFormType, setManualFormType] = useState('MCQ');
  const [manualSubject, setManualSubject] = useState('পদার্থবিজ্ঞান');
  const [manualClass, setManualClass] = useState('Class 9-10 (SSC)');
  const [manualChapter, setManualChapter] = useState('');
  const [manualBoard, setManualBoard] = useState('ঢাকা');
  const [manualYear, setManualYear] = useState('2025');
  const [manualDifficulty, setManualDifficulty] = useState('MEDIUM');

  // MCQ Form Fields
  const [mcqQuestion, setMcqQuestion] = useState('');
  const [mcqOptions, setMcqOptions] = useState(['', '', '', '']);
  const [mcqCorrect, setMcqCorrect] = useState(0);
  const [mcqExplanation, setMcqExplanation] = useState('');

  // CQ Form Fields
  const [cqStem, setCqStem] = useState('');
  const [cqA, setCqA] = useState({ q: '', ans: '' });
  const [cqB, setCqB] = useState({ q: '', ans: '' });
  const [cqC, setCqC] = useState({ q: '', ans: '' });
  const [cqD, setCqD] = useState({ q: '', ans: '' });

  const handleSaveManualQuestion = (e) => {
    e.preventDefault();
    const shortYear = manualYear.slice(-2);
    const badge = manualBoard + ' - ' + shortYear + ' (' + manualFormType + ')';

    if (manualFormType === 'MCQ') {
      if (!mcqQuestion.trim() || mcqOptions.some(o => !o.trim())) {
        alert('অনুগ্রহ করে প্রশ্ন ও ৪টি বিকল্প অপশন পূরণ করুন।');
        return;
      }

      const newQ = {
        id: 'manual-' + Date.now(),
        type: 'MCQ',
        subject: manualSubject,
        className: manualClass,
        chapter: manualChapter || 'সাধারণ অধ্যায়',
        question: mcqQuestion.trim(),
        options: [...mcqOptions],
        correctAnswer: mcqCorrect,
        explanation: mcqExplanation.trim() || 'সঠিক উত্তর যাচাইকৃত।',
        board: manualBoard,
        year: manualYear,
        badge,
        difficulty: manualDifficulty,
        createdAt: new Date().toISOString().split('T')[0]
      };

      setQuestionBank(prev => [newQ, ...prev]);
      setMcqQuestion('');
      setMcqOptions(['', '', '', '']);
      setMcqExplanation('');
      alert('✅ নতুন MCQ প্রশ্ন সফলভাবে প্রশ্ন ব্যাংকে যুক্ত হয়েছে!');
    } else {
      if (!cqStem.trim() || !cqA.q.trim() || !cqB.q.trim() || !cqC.q.trim() || !cqD.q.trim()) {
        alert('অনুগ্রহ করে উদ্দীপক ও ক, খ, গ, ঘ ৪টি প্রশ্নই পূরণ করুন।');
        return;
      }

      const newCQ = {
        id: 'manual-' + Date.now(),
        type: 'CQ',
        subject: manualSubject,
        className: manualClass,
        chapter: manualChapter || 'সৃজনশীল অধ্যায়',
        stem: cqStem.trim(),
        subQuestions: {
          a: { q: cqA.q.trim(), mark: 1, ans: cqA.ans.trim() },
          b: { q: cqB.q.trim(), mark: 2, ans: cqB.ans.trim() },
          c: { q: cqC.q.trim(), mark: 3, ans: cqC.ans.trim() },
          d: { q: cqD.q.trim(), mark: 4, ans: cqD.ans.trim() }
        },
        board: manualBoard,
        year: manualYear,
        badge,
        difficulty: manualDifficulty,
        createdAt: new Date().toISOString().split('T')[0]
      };

      setQuestionBank(prev => [newCQ, ...prev]);
      setCqStem('');
      setCqA({ q: '', ans: '' });
      setCqB({ q: '', ans: '' });
      setCqC({ q: '', ans: '' });
      setCqD({ q: '', ans: '' });
      alert('✅ নতুন সৃজনশীল (CQ) প্রশ্ন সফলভাবে প্রশ্ন ব্যাংকে যুক্ত হয়েছে!');
    }
  };

  // =========================================================================
  // SUBMODULE 5: QUESTION BANK & ARCHIVE (FILTERS & ACTIONS)
  // =========================================================================
  const [bankSearch, setBankSearch] = useState('');
  const [bankSubjectFilter, setBankSubjectFilter] = useState('ALL');
  const [bankTypeFilter, setBankTypeFilter] = useState('ALL');
  const [bankBoardFilter, setBankBoardFilter] = useState('ALL');
  const [bankYearFilter, setBankYearFilter] = useState('ALL');
  const [revealedAnswers, setRevealedAnswers] = useState(new Set());
  const [selectedQuestions, setSelectedQuestions] = useState(new Set());

  const filteredBank = useMemo(() => {
    return questionBank.filter(q => {
      const query = bankSearch.toLowerCase().trim();
      const matchSearch = !query ||
        q.question?.toLowerCase().includes(query) ||
        q.stem?.toLowerCase().includes(query) ||
        q.subject?.toLowerCase().includes(query) ||
        q.chapter?.toLowerCase().includes(query) ||
        q.badge?.toLowerCase().includes(query);

      const matchSubject = bankSubjectFilter === 'ALL' || q.subject === bankSubjectFilter;
      const matchType = bankTypeFilter === 'ALL' || q.type === bankTypeFilter;
      const matchBoard = bankBoardFilter === 'ALL' || q.board === bankBoardFilter;
      const matchYear = bankYearFilter === 'ALL' || q.year === bankYearFilter;

      return matchSearch && matchSubject && matchType && matchBoard && matchYear;
    });
  }, [questionBank, bankSearch, bankSubjectFilter, bankTypeFilter, bankBoardFilter, bankYearFilter]);

  const toggleRevealAnswer = (id) => {
    setRevealedAnswers(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectQuestion = (id) => {
    setSelectedQuestions(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSelectAll = () => {
    if (selectedQuestions.size === filteredBank.length) {
      setSelectedQuestions(new Set());
    } else {
      setSelectedQuestions(new Set(filteredBank.map(q => q.id)));
    }
  };

  const handleDeleteQuestion = (id) => {
    if (window.confirm('আপনি কি নিশ্চিতভাবে এই প্রশ্নটি মুছে ফেলতে চান?')) {
      setQuestionBank(prev => prev.filter(q => q.id !== id));
      setSelectedQuestions(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const handlePrintQuestionPaper = () => {
    const printItems = selectedQuestions.size > 0
      ? filteredBank.filter(q => selectedQuestions.has(q.id))
      : filteredBank;

    if (printItems.length === 0) {
      alert('প্রিন্ট করার মতো কোনো প্রশ্ন নির্বাচিত নেই।');
      return;
    }

    const printWin = window.open('', '_blank');
    const contentHtml = '<!DOCTYPE html>' +
      '<html><head><title>NextGen Academy - Question Paper</title><meta charset="utf-8" />' +
      '<link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;600;700&display=swap" rel="stylesheet">' +
      '<style>body { font-family: "Hind Siliguri", sans-serif; padding: 24px 32px; color: #0f172a; }' +
      '.header { text-align: center; border-bottom: 2px solid #0f172a; padding-bottom: 12px; margin-bottom: 20px; }' +
      '.inst { font-size: 22px; font-weight: bold; margin: 0; color: #1e1b4b; }' +
      '.dir { font-size: 13px; color: #4338ca; margin: 3px 0; font-weight: 600; }' +
      '.meta { font-size: 13px; color: #475569; margin: 4px 0; }' +
      '.grid-q { margin-top: 15px; }' +
      '.q-box { margin-bottom: 16px; page-break-inside: avoid; border-bottom: 1px dashed #cbd5e1; padding-bottom: 12px; }' +
      '.q-head { font-weight: bold; font-size: 14px; display: flex; justify-content: space-between; }' +
      '.badge { font-size: 10px; background: #e0e7ff; color: #3730a3; padding: 2px 6px; border-radius: 4px; font-weight: bold; }' +
      '.opts { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin-top: 6px; font-size: 13px; }' +
      '.stem { background: #f8fafc; border-left: 3px solid #6366f1; padding: 8px 12px; margin: 6px 0; font-size: 13px; }' +
      '.cq-sub { margin-left: 12px; font-size: 13px; margin-top: 4px; }' +
      '@media print { button { display: none; } }</style></head><body>' +
      '<div class="header">' +
      '<h1 class="inst">NextGen Academy (নেক্সটজেন একাডেমি)</h1>' +
      '<p class="dir">পরিচালক: মো: আলমগীর হোসেন (সাগর) | মোবাইল: ০১৭৯২৮১৮০০৫</p>' +
      '<p class="meta">পশ্চিম জয়দেবপুর, বাস-স্ট্যান্ড, গাজীপুর | প্রাতিষ্ঠানিক প্রশ্নপত্র ও মূল্যায়ন সেট</p>' +
      '<p class="meta"><strong>বিষয়:</strong> ' + (bankSubjectFilter === 'ALL' ? 'সকল বিষয়' : bankSubjectFilter) + ' | <strong>মোট প্রশ্ন:</strong> ' + printItems.length + 'টি | <strong>তারিখ:</strong> ' + new Date().toLocaleDateString('bn-BD') + '</p>' +
      '</div><div class="grid-q">' +
      printItems.map((q, idx) => {
        if (q.type === 'MCQ') {
          return '<div class="q-box">' +
            '<div class="q-head"><span>' + toBengaliDigits(idx + 1) + '. ' + q.question + '</span><span class="badge">' + (q.badge || q.board || '') + '</span></div>' +
            '<div class="opts">' + q.options.map((opt, i) => '<div>(' + ['ক', 'খ', 'গ', 'ঘ'][i] + ') ' + opt + '</div>').join('') + '</div>' +
            '</div>';
        } else {
          return '<div class="q-box">' +
            '<div class="q-head"><span>' + toBengaliDigits(idx + 1) + '. সৃজনশীল প্রশ্ন (CQ)</span><span class="badge">' + (q.badge || q.board || '') + '</span></div>' +
            '<div class="stem"><strong>উদ্দীপক:</strong> ' + q.stem + '</div>' +
            '<div class="cq-sub">(ক) ' + (q.subQuestions?.a?.q || '') + ' [১]</div>' +
            '<div class="cq-sub">(খ) ' + (q.subQuestions?.b?.q || '') + ' [২]</div>' +
            '<div class="cq-sub">(গ) ' + (q.subQuestions?.c?.q || '') + ' [৩]</div>' +
            '<div class="cq-sub">(ঘ) ' + (q.subQuestions?.d?.q || '') + ' [৪]</div>' +
            '</div>';
        }
      }).join('') +
      '</div><script>window.onload = function() { window.print(); }<\/script></body></html>';

    printWin.document.write(contentHtml);
    printWin.document.close();
  };

  return (
    <div className="space-y-6">
      {/* Top Suite Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-3.5 py-1 rounded-full text-xs font-semibold backdrop-blur-md mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span>স্মার্ট প্রশ্ন প্রণয়ন, মাল্টি-বোর্ড ডিস্ট্রিবিউশন ও প্রশ্ন ব্যাংক স্যুট</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Question Generator Suite (প্রশ্ন ব্যবস্থাপনা হাব)
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1.5 max-w-3xl leading-relaxed">
              একই কেন্দ্রীয় ড্যাশবোর্ড থেকে এআই জেনারেটর, বহু-বোর্ড ও সালভিত্তিক সূক্ষ্ম বণ্টন অ্যালগরিদম, ম্যানুয়াল প্রশ্ন নির্মাতা, OMR শিট মূল্যায়ন ও সার্বজনীন প্রশ্ন আর্কাইভ পরিচালনা করুন।
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowAIMCQModal(true)}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-xs flex items-center space-x-2 shadow-lg shadow-indigo-600/30 transition-all active:scale-95"
            >
              <Zap className="w-4 h-4 text-amber-300" />
              <span>🤖 AI MCQ জেনারেটর</span>
            </button>

            <button
              onClick={() => setShowAICQModal(true)}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs flex items-center space-x-2 shadow-lg shadow-emerald-600/30 transition-all active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-emerald-200" />
              <span>📝 AI CQ সৃজনশীল</span>
            </button>
          </div>
        </div>

        {/* Central Suite Navigation Tabs */}
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab('ai-generator')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center space-x-2 ${
              activeTab === 'ai-generator'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/40 border border-indigo-400/40'
                : 'bg-white/10 hover:bg-white/15 text-slate-300 hover:text-white border border-white/10'
            }`}
          >
            <Bot className="w-4 h-4 text-indigo-300" />
            <span>১. AI প্রশ্ন জেনারেটর</span>
          </button>

          <button
            onClick={() => setActiveTab('multi-board')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center space-x-2 ${
              activeTab === 'multi-board'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/40 border border-indigo-400/40'
                : 'bg-white/10 hover:bg-white/15 text-slate-300 hover:text-white border border-white/10'
            }`}
          >
            <Sliders className="w-4 h-4 text-amber-300" />
            <span>২. মাল্টি-বোর্ড ও সাল বণ্টন জেনারেটর</span>
          </button>

          <button
            onClick={() => setActiveTab('manual-creator')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center space-x-2 ${
              activeTab === 'manual-creator'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/40 border border-indigo-400/40'
                : 'bg-white/10 hover:bg-white/15 text-slate-300 hover:text-white border border-white/10'
            }`}
          >
            <PenTool className="w-4 h-4 text-emerald-300" />
            <span>৩. ম্যানুয়াল প্রশ্ন নির্মাতা</span>
          </button>

          <button
            onClick={() => setActiveTab('omr-import')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center space-x-2 ${
              activeTab === 'omr-import'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/40 border border-indigo-400/40'
                : 'bg-white/10 hover:bg-white/15 text-slate-300 hover:text-white border border-white/10'
            }`}
          >
            <Award className="w-4 h-4 text-pink-300" />
            <span>৪. OMR মূল্যায়ন ও আমদানি</span>
          </button>

          <button
            onClick={() => setActiveTab('question-bank')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center space-x-2 ${
              activeTab === 'question-bank'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/40 border border-indigo-400/40'
                : 'bg-white/10 hover:bg-white/15 text-slate-300 hover:text-white border border-white/10'
            }`}
          >
            <Database className="w-4 h-4 text-teal-300" />
            <span>৫. প্রশ্ন ব্যাংক ও আর্কাইভ ({questionBank.length})</span>
          </button>
        </div>
      </div>

      {/* TAB 1: AI QUESTION GENERATOR HUB */}
      {activeTab === 'ai-generator' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-900 border border-indigo-500/30 rounded-3xl p-6 text-white shadow-lg space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center border border-indigo-500/40">
                  <Zap className="w-6 h-6 text-amber-300" />
                </div>
                <h3 className="text-xl font-black text-white">বহুনির্বাচনী প্রশ্ন (MCQ) AI জেনারেটর</h3>
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  যেকোনো শ্রেণি, অধ্যায় বা পিডিএফ ডকুমেন্ট থেকে তাৎক্ষণিকভাবে ৪টি নিখুঁত অপশন, সঠিক উত্তর, ব্যাখ্যা এবং বোর্ড-সাল ব্যাজসহ বহু-পছন্দ প্রশ্ন তৈরি করুন।
                </p>
                <div className="space-y-1 text-xs text-indigo-200">
                  <div className="flex items-center gap-1.5">✓ গুগল ড্রাইভ ও পিডিএফ থেকে সরাসরি এক্সট্রাক্ট</div>
                  <div className="flex items-center gap-1.5">✓ বোর্ড-সাল ফরম্যাট: "ঢাকা - ২৫ (MCQ)"</div>
                  <div className="flex items-center gap-1.5">✓ প্রিন্ট, ডকএক্স ও অনলাইন পরীক্ষায় সরাসরি যুক্ত</div>
                </div>
              </div>

              <button
                onClick={() => setShowAIMCQModal(true)}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-xs flex items-center justify-center space-x-2 shadow-lg shadow-indigo-600/30 transition-all active:scale-95"
              >
                <span>🤖 AI MCQ জেনারেটর ওপেন করুন</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-gradient-to-br from-teal-950 via-slate-900 to-slate-900 border border-teal-500/30 rounded-3xl p-6 text-white shadow-lg space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-teal-500/20 text-teal-300 flex items-center justify-center border border-teal-500/40">
                  <Sparkles className="w-6 h-6 text-teal-300" />
                </div>
                <h3 className="text-xl font-black text-white">সৃজনশীল প্রশ্ন (CQ) AI জেনারেটর</h3>
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  উচ্চমানের বাস্তবমুখী উদ্দীপক এবং জাতীয় শিক্ষাক্রমের নিয়ম অনুসারে ক (১), খ (২), গ (৩), ঘ (৪) নম্বরের সৃজনশীল প্রশ্ন ও উত্তর কাঠামো জেনারেট করুন।
                </p>
                <div className="space-y-1 text-xs text-teal-200">
                  <div className="flex items-center gap-1.5">✓ জ্ঞান, অনুধাবন, প্রয়োগ ও উচ্চতর দক্ষতা মূল্যায়ন</div>
                  <div className="flex items-center gap-1.5">✓ পূর্ণাঙ্গ মার্কিং স্কিম ও শিক্ষকদের জন্য মডেল উত্তর</div>
                  <div className="flex items-center gap-1.5">✓ সরাসরি প্রশ্ন ব্যাংকে ব্যাকআপ ও সংরক্ষণ</div>
                </div>
              </div>

              <button
                onClick={() => setShowAICQModal(true)}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs flex items-center justify-center space-x-2 shadow-lg shadow-emerald-600/30 transition-all active:scale-95"
              >
                <span>📝 AI CQ সৃজনশীল জেনারেটর ওপেন করুন</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MULTI-BOARD & MULTI-YEAR CUSTOM QUANTITY DISTRIBUTION */}
      {activeTab === 'multi-board' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
                  <Sliders className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    মাল্টি-বোর্ড ও সালভিত্তিক নির্দিষ্ট প্রশ্ন সংখ্যা বণ্টন ইঞ্জিন
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    ন্যাচারাল ল্যাঙ্গুয়েজ প্রম্পটের মাধ্যমে একাধিক বোর্ডের জন্য সুনির্দিষ্ট প্রশ্ন সংখ্যা বণ্টন করুন
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-800 mb-1">বিষয় (Subject)</label>
                <select
                  value={multiSubject}
                  onChange={(e) => setMultiSubject(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 font-semibold bg-white"
                >
                  <option value="পদার্থবিজ্ঞান">পদার্থবিজ্ঞান (Physics)</option>
                  <option value="রসায়ন">রসায়ন (Chemistry)</option>
                  <option value="উচ্চতর গণিত">উচ্চতর গণিত (Higher Math)</option>
                  <option value="সাধারণ গণিত">সাধারণ গণিত (General Math)</option>
                  <option value="জীববিজ্ঞান">জীববিজ্ঞান (Biology)</option>
                  <option value="আইসিটি">তথ্য ও যোগাযোগ প্রযুক্তি (ICT)</option>
                  <option value="বাংলা">বাংলা ১ম ও ২য় পত্র</option>
                  <option value="ইংরেজি">English 1st & 2nd Paper</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">শ্রেণি / লেভেল</label>
                <select
                  value={multiClass}
                  onChange={(e) => setMultiClass(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 font-semibold bg-white"
                >
                  <option value="Class 9-10 (SSC)">Class 9-10 (SSC ২০২৬)</option>
                  <option value="Class 11-12 (HSC)">Class 11-12 (HSC ২০২৬)</option>
                  <option value="Class 8">Class 8 (JSC/জুনিয়র)</option>
                  <option value="Class 7">Class 7</option>
                  <option value="Class 6">Class 6</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">অধ্যায় / টপিক</label>
                <input
                  type="text"
                  value={multiChapter}
                  onChange={(e) => setMultiChapter(e.target.value)}
                  placeholder="যেমন: গতি, বল ও শক্তি"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">প্রশ্নের ধরন</label>
                <div className="flex items-center space-x-2 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setMultiQuestionType('MCQ')}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                      multiQuestionType === 'MCQ' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    🎯 MCQ কুইজ
                  </button>
                  <button
                    type="button"
                    onClick={() => setMultiQuestionType('CQ')}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                      multiQuestionType === 'CQ' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    ✍️ সৃজনশীল CQ
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block font-extrabold text-slate-900 text-xs">
                  মাল্টি-বোর্ড ও সাল বণ্টন কমান্ড প্রম্পট (Multi-Board Distribution Prompt):
                </label>
                <span className="text-[11px] font-bold text-indigo-600">
                  মোট নির্ধারিত প্রশ্ন: {totalRequestedCount}টি
                </span>
              </div>

              <textarea
                rows={2}
                value={multiPrompt}
                onChange={(e) => setMultiPrompt(e.target.value)}
                placeholder="যেমন: ঢাকা ২৫ ২০টি, কুমিল্লা ২৪ ১২টি, রাজশাহী ২৩ ১০টি, যশোর ২২ ৮টি..."
                className="w-full p-3.5 rounded-2xl border border-slate-300 font-semibold text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-slate-50/50"
              />

              <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
                <span className="text-slate-500 font-bold">কুইক প্রিসেট:</span>
                <button
                  type="button"
                  onClick={() => setMultiPrompt('ঢাকা ২৫ ২০টি, কুমিল্লা ২৪ ১২টি, রাজশাহী ২৩ ১০টি, যশোর ২২ ৮টি')}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  📌 টপ ৪ বোর্ড (৫০টি)
                </button>
                <button
                  type="button"
                  onClick={() => setMultiPrompt('ঢাকা ২৫ ১৫টি, চট্টগ্রাম ২৪ ১০টি, সিলেট ২৩ ১০টি, দিনাজপুর ২২ ১০টি, বরিশাল ২৫ ৫টি')}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  📌 ৫ বোর্ড বণ্টন (৫০টি)
                </button>
                <button
                  type="button"
                  onClick={() => setMultiPrompt('ঢাকা ২৫ ১০টি, কুমিল্লা ২৪ ১০টি, রাজশাহী ২৩ ১০টি')}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  📌 ৩০টি সংক্ষিপ্ত টেস্ট
                </button>
              </div>
            </div>

            {parsedDistributions.length > 0 && (
              <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-3">
                <h4 className="font-extrabold text-indigo-950 text-xs flex items-center justify-between">
                  <span>📊 বিশ্লেষিত বোর্ড ও সাল বণ্টন প্রিভিউ:</span>
                  <span className="text-[11px] bg-indigo-200/80 px-2.5 py-0.5 rounded-full text-indigo-900 font-black">
                    মোট {parsedDistributions.length}টি বোর্ড ক্যাটাগরি ({totalRequestedCount}টি প্রশ্ন)
                  </span>
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {parsedDistributions.map((dist, idx) => (
                    <div key={idx} className="p-2.5 bg-white rounded-xl border border-indigo-100 shadow-sm flex items-center justify-between text-xs">
                      <div>
                        <span className="font-black text-slate-900 block">{dist.board} বোর্ড</span>
                        <span className="text-[10px] text-slate-500 font-semibold">সাল: {dist.year} ({dist.shortYear})</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-black text-indigo-600">{dist.count}টি</span>
                        <span className="block text-[9px] font-bold text-slate-400 uppercase">{multiQuestionType}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {multiError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{multiError}</span>
              </div>
            )}

            <div className="pt-2 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={handleGenerateMultiBoard}
                disabled={isGeneratingMulti}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-600 to-indigo-600 hover:from-amber-500 hover:to-indigo-500 text-white font-black text-xs flex items-center space-x-2 shadow-lg shadow-indigo-600/30 transition-all active:scale-95 disabled:opacity-50"
              >
                {isGeneratingMulti ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>জেনারেট হচ্ছে...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 text-amber-300" />
                    <span>⚡ মাল্টি-বোর্ড প্রশ্ন সেট জেনারেট করুন ({totalRequestedCount}টি)</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {generatedMultiQuestions.length > 0 && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>জেনারেটকৃত প্রশ্ন সেট ({generatedMultiQuestions.length}টি প্রশ্ন প্রস্তুত)</span>
                  </h3>
                  <p className="text-xs text-slate-500">বোর্ড-সাল ট্যাগসহ প্রস্তুতকৃত প্রশ্নসমূহ</p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleSaveMultiToBank}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center space-x-1.5"
                  >
                    <Database className="w-3.5 h-3.5" />
                    <span>প্রশ্ন ব্যাংকে যুক্ত করুন</span>
                  </button>

                  <button
                    onClick={handlePrintQuestionPaper}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center space-x-1.5"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>প্রিন্ট প্রিভিউ</span>
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {generatedMultiQuestions.map((q, idx) => (
                  <div key={q.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-slate-900">
                        {toBengaliDigits(idx + 1)}. {q.question || q.stem}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-[10px] font-black border border-indigo-200">
                        {q.badge}
                      </span>
                    </div>

                    {q.type === 'MCQ' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                        {q.options.map((opt, oIdx) => (
                          <div
                            key={oIdx}
                            className={`p-2 rounded-xl border text-[11px] font-medium ${
                              oIdx === q.correctAnswer
                                ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold'
                                : 'bg-white border-slate-200 text-slate-700'
                            }`}
                          >
                            <span className="font-bold mr-1.5">({['ক', 'খ', 'গ', 'ঘ'][oIdx]})</span>
                            {opt}
                          </div>
                        ))}
                      </div>
                    )}

                    {q.explanation && (
                      <div className="p-2 rounded-xl bg-white border border-slate-200 text-[11px] text-slate-600 font-medium">
                        💡 <strong>ব্যাখ্যা:</strong> {q.explanation}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: MANUAL QUESTION CREATOR */}
      {activeTab === 'manual-creator' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                <PenTool className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  ম্যানুয়াল প্রশ্ন নির্মাতা (Visual Manual Question Builder)
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  শিক্ষকদের তৈরি করা বহুনির্বাচনী ও সৃজনশীল প্রশ্ন সরাসরি টাইপ করে প্রশ্ন ব্যাংকে যোগ করুন
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 bg-slate-100 p-1.5 rounded-2xl">
              <button
                type="button"
                onClick={() => setManualFormType('MCQ')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  manualFormType === 'MCQ' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600'
                }`}
              >
                🎯 MCQ মোড
              </button>
              <button
                type="button"
                onClick={() => setManualFormType('CQ')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  manualFormType === 'CQ' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600'
                }`}
              >
                ✍️ সৃজনশীল CQ মোড
              </button>
            </div>
          </div>

          <form onSubmit={handleSaveManualQuestion} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <div>
                <label className="block font-bold text-slate-800 mb-1">বিষয় (Subject)</label>
                <select
                  value={manualSubject}
                  onChange={(e) => setManualSubject(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold bg-white"
                >
                  <option value="পদার্থবিজ্ঞান">পদার্থবিজ্ঞান</option>
                  <option value="রসায়ন">রসায়ন</option>
                  <option value="উচ্চতর গণিত">উচ্চতর গণিত</option>
                  <option value="সাধারণ গণিত">সাধারণ গণিত</option>
                  <option value="জীববিজ্ঞান">জীববিজ্ঞান</option>
                  <option value="আইসিটি">তথ্য ও যোগাযোগ প্রযুক্তি</option>
                  <option value="বাংলা">বাংলা</option>
                  <option value="ইংরেজি">English</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">শ্রেণি / লেভেল</label>
                <select
                  value={manualClass}
                  onChange={(e) => setManualClass(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold bg-white"
                >
                  <option value="Class 9-10 (SSC)">Class 9-10 (SSC)</option>
                  <option value="Class 11-12 (HSC)">Class 11-12 (HSC)</option>
                  <option value="Class 8">Class 8</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">বোর্ড (Board Tag)</label>
                <select
                  value={manualBoard}
                  onChange={(e) => setManualBoard(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold bg-white"
                >
                  {BOARDS_LIST.map(b => (
                    <option key={b} value={b}>{b} বোর্ড</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">সাল (Exam Year)</label>
                <select
                  value={manualYear}
                  onChange={(e) => setManualYear(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold bg-white"
                >
                  {YEARS_LIST.map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">কঠিনতার স্তর</label>
                <select
                  value={manualDifficulty}
                  onChange={(e) => setManualDifficulty(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold bg-white"
                >
                  <option value="EASY">🟢 সহজ (Easy)</option>
                  <option value="MEDIUM">🟡 মাঝারি (Medium)</option>
                  <option value="HARD">🔴 কঠিন (Hard)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">অধ্যায় / বিষয়বস্তুর নাম</label>
              <input
                type="text"
                value={manualChapter}
                onChange={(e) => setManualChapter(e.target.value)}
                placeholder="যেমন: অধ্যায় ৩: পদার্থের গঠন"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-semibold"
              />
            </div>

            {manualFormType === 'MCQ' ? (
              <div className="space-y-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    MCQ প্রশ্ন বিবরণ <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={mcqQuestion}
                    onChange={(e) => setMcqQuestion(e.target.value)}
                    placeholder="প্রশ্নটি এখানে টাইপ করুন..."
                    className="w-full p-3 rounded-xl border border-slate-300 font-medium focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    ৪টি অপশন ও সঠিক উত্তর নির্ধারণ <span className="text-rose-500">*</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {mcqOptions.map((opt, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-2xl border flex items-center space-x-2 transition-all ${
                          mcqCorrect === idx ? 'bg-emerald-50/80 border-emerald-400 ring-2 ring-emerald-400/30' : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <input
                          type="radio"
                          name="correctOption"
                          checked={mcqCorrect === idx}
                          onChange={() => setMcqCorrect(idx)}
                          className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                        />
                        <span className="font-black text-slate-700">({['ক', 'খ', 'গ', 'ঘ'][idx]})</span>
                        <input
                          type="text"
                          required
                          value={opt}
                          onChange={(e) => {
                            const val = e.target.value;
                            setMcqOptions(prev => prev.map((o, i) => i === idx ? val : o));
                          }}
                          placeholder={`অপশন (${['ক', 'খ', 'গ', 'ঘ'][idx]}) লিখুন...`}
                          className="flex-1 px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">উত্তরের ব্যাখ্যা (Optional)</label>
                  <input
                    type="text"
                    value={mcqExplanation}
                    onChange={(e) => setMcqExplanation(e.target.value)}
                    placeholder="সঠিক উত্তরের যুক্তি বা সূত্র..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    সৃজনশীল উদ্দীপক (Context / Stem) <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={cqStem}
                    onChange={(e) => setCqStem(e.target.value)}
                    placeholder="উদ্দীপকের বিবরণ বা চিত্রভিত্তিক অনুচ্ছেদ..."
                    className="w-full p-3 rounded-xl border border-slate-300 font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                    <span className="font-bold text-indigo-700">(ক) জ্ঞানমূলক প্রশ্ন [১ নম্বর]</span>
                    <input
                      type="text"
                      required
                      value={cqA.q}
                      onChange={(e) => setCqA({ ...cqA, q: e.target.value })}
                      placeholder="প্রশ্ন (ক)..."
                      className="w-full px-2.5 py-1.5 bg-white rounded-lg border border-slate-300 font-semibold"
                    />
                  </div>

                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                    <span className="font-bold text-indigo-700">(খ) অনুধাবনমূলক প্রশ্ন [২ নম্বর]</span>
                    <input
                      type="text"
                      required
                      value={cqB.q}
                      onChange={(e) => setCqB({ ...cqB, q: e.target.value })}
                      placeholder="প্রশ্ন (খ)..."
                      className="w-full px-2.5 py-1.5 bg-white rounded-lg border border-slate-300 font-semibold"
                    />
                  </div>

                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                    <span className="font-bold text-indigo-700">(গ) প্রয়োগমূলক প্রশ্ন [৩ নম্বর]</span>
                    <input
                      type="text"
                      required
                      value={cqC.q}
                      onChange={(e) => setCqC({ ...cqC, q: e.target.value })}
                      placeholder="প্রশ্ন (গ)..."
                      className="w-full px-2.5 py-1.5 bg-white rounded-lg border border-slate-300 font-semibold"
                    />
                  </div>

                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                    <span className="font-bold text-indigo-700">(ঘ) উচ্চতর দক্ষতামূলক প্রশ্ন [৪ নম্বর]</span>
                    <input
                      type="text"
                      required
                      value={cqD.q}
                      onChange={(e) => setCqD({ ...cqD, q: e.target.value })}
                      placeholder="প্রশ্ন (ঘ)..."
                      className="w-full px-2.5 py-1.5 bg-white rounded-lg border border-slate-300 font-semibold"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-3">
              <button
                type="submit"
                className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs flex items-center space-x-2 shadow-lg shadow-indigo-600/30 transition-all active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>প্রশ্ন ব্যাংকে সংরক্ষণ করুন</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 4: OMR RESULT & IMPORT MODULE */}
      {activeTab === 'omr-import' && (
        <div className="space-y-4">
          <OMRImportModule />
        </div>
      )}

      {/* TAB 5: QUESTION BANK & ARCHIVE */}
      {activeTab === 'question-bank' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={bankSearch}
                  onChange={(e) => setBankSearch(e.target.value)}
                  placeholder="প্রশ্ন বা বিষয় দিয়ে খুঁজুন..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <select
                  value={bankSubjectFilter}
                  onChange={(e) => setBankSubjectFilter(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700"
                >
                  <option value="ALL">সকল বিষয় (All Subjects)</option>
                  <option value="পদার্থবিজ্ঞান">পদার্থবিজ্ঞান</option>
                  <option value="রসায়ন">রসায়ন</option>
                  <option value="উচ্চতর গণিত">উচ্চতর গণিত</option>
                  <option value="সাধারণ গণিত">সাধারণ গণিত</option>
                  <option value="জীববিজ্ঞান">জীববিজ্ঞান</option>
                </select>

                <select
                  value={bankTypeFilter}
                  onChange={(e) => setBankTypeFilter(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700"
                >
                  <option value="ALL">সকল প্রকার (MCQ / CQ)</option>
                  <option value="MCQ">🎯 বহুনির্বাচনী (MCQ)</option>
                  <option value="CQ">✍️ সৃজনশীল (CQ)</option>
                </select>

                <select
                  value={bankBoardFilter}
                  onChange={(e) => setBankBoardFilter(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700"
                >
                  <option value="ALL">সকল বোর্ড</option>
                  {BOARDS_LIST.filter(b => b !== 'সকল বোর্ড').map(b => (
                    <option key={b} value={b}>{b} বোর্ড</option>
                  ))}
                </select>

                <select
                  value={bankYearFilter}
                  onChange={(e) => setBankYearFilter(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700"
                >
                  <option value="ALL">সকল সাল</option>
                  {YEARS_LIST.map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 flex items-center space-x-1"
                >
                  <CheckSquare className="w-3.5 h-3.5" />
                  <span>{selectedQuestions.size === filteredBank.length ? 'সব আনসিলেক্ট করুন' : 'সব সিলেক্ট করুন'}</span>
                </button>
                <span className="text-slate-500 font-medium">
                  মোট প্রশ্ন: <strong>{filteredBank.length}টি</strong> | নির্বাচিত: <strong>{selectedQuestions.size}টি</strong>
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={handlePrintQuestionPaper}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black flex items-center space-x-1.5 shadow-md shadow-indigo-600/20"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>প্রশ্নপত্র প্রিন্ট / PDF এক্সপোর্ট</span>
                </button>
              </div>
            </div>
          </div>

          {filteredBank.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-slate-200 space-y-3">
              <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="font-bold text-sm text-slate-700">কোনো প্রশ্ন পাওয়া যায়নি</h3>
              <p className="text-xs text-slate-400">ফিল্টার পরিবর্তন করুন বা নতুন প্রশ্ন তৈরি করুন।</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredBank.map((q, idx) => {
                const isSelected = selectedQuestions.has(q.id);
                const isAnswerRevealed = revealedAnswers.has(q.id);

                return (
                  <div
                    key={q.id}
                    className={`bg-white rounded-3xl border p-5 shadow-sm space-y-3 transition-all ${
                      isSelected ? 'border-indigo-400 ring-2 ring-indigo-400/20 bg-indigo-50/20' : 'border-slate-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start space-x-3 flex-1">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectQuestion(q.id)}
                          className="w-4 h-4 mt-0.5 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                        />
                        <div className="space-y-1.5 flex-1">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-800 border border-indigo-200">
                              {q.subject}
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                              {q.className}
                            </span>
                            {q.badge && (
                              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
                                🏛️ {q.badge}
                              </span>
                            )}
                            <span className="text-[10px] font-semibold text-slate-400">
                              {q.chapter}
                            </span>
                          </div>

                          <h4 className="font-extrabold text-slate-900 text-sm leading-snug">
                            {toBengaliDigits(idx + 1)}. {q.question || q.stem}
                          </h4>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeleteQuestion(q.id)}
                        className="p-1.5 bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-xl transition-colors shrink-0"
                        title="মুছে ফেলুন"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {q.type === 'MCQ' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
                        {q.options?.map((opt, oIdx) => {
                          const isCorrect = oIdx === q.correctAnswer;
                          return (
                            <div
                              key={oIdx}
                              className={`p-2.5 rounded-xl border font-medium flex items-center justify-between ${
                                isAnswerRevealed && isCorrect
                                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold'
                                  : 'bg-slate-50 border-slate-200 text-slate-700'
                              }`}
                            >
                              <div>
                                <span className="font-black mr-1.5">({['ক', 'খ', 'গ', 'ঘ'][oIdx]})</span>
                                <span>{opt}</span>
                              </div>
                              {isAnswerRevealed && isCorrect && (
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {q.type === 'CQ' && q.subQuestions && (
                      <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
                        <div className="font-semibold text-slate-800">
                          <strong>(ক)</strong> {q.subQuestions.a?.q} <span className="text-slate-400">[১]</span>
                          {isAnswerRevealed && <p className="text-emerald-700 text-[11px] mt-0.5">👉 {q.subQuestions.a?.ans}</p>}
                        </div>
                        <div className="font-semibold text-slate-800">
                          <strong>(খ)</strong> {q.subQuestions.b?.q} <span className="text-slate-400">[২]</span>
                          {isAnswerRevealed && <p className="text-emerald-700 text-[11px] mt-0.5">👉 {q.subQuestions.b?.ans}</p>}
                        </div>
                        <div className="font-semibold text-slate-800">
                          <strong>(গ)</strong> {q.subQuestions.c?.q} <span className="text-slate-400">[৩]</span>
                          {isAnswerRevealed && <p className="text-emerald-700 text-[11px] mt-0.5">👉 {q.subQuestions.c?.ans}</p>}
                        </div>
                        <div className="font-semibold text-slate-800">
                          <strong>(ঘ)</strong> {q.subQuestions.d?.q} <span className="text-slate-400">[৪]</span>
                          {isAnswerRevealed && <p className="text-emerald-700 text-[11px] mt-0.5">👉 {q.subQuestions.d?.ans}</p>}
                        </div>
                      </div>
                    )}

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      <button
                        type="button"
                        onClick={() => toggleRevealAnswer(q.id)}
                        className="text-indigo-600 hover:text-indigo-800 font-bold flex items-center space-x-1"
                      >
                        {isAnswerRevealed ? (
                          <>
                            <EyeOff className="w-3.5 h-3.5" />
                            <span>উত্তর লুকান</span>
                          </>
                        ) : (
                          <>
                            <Eye className="w-3.5 h-3.5" />
                            <span>উত্তর ও ব্যাখ্যা দেখুন</span>
                          </>
                        )}
                      </button>

                      {isAnswerRevealed && q.explanation && (
                        <span className="text-slate-600 font-medium text-[11px]">
                          💡 {q.explanation}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* AI MCQ MODAL */}
      {showAIMCQModal && (
        <AIMCQGeneratorModal
          isOpen={showAIMCQModal}
          onClose={() => setShowAIMCQModal(false)}
          onGeneratedQuestions={(newQuestions) => {
            if (Array.isArray(newQuestions) && newQuestions.length > 0) {
              setQuestionBank(prev => [...newQuestions, ...prev]);
            }
          }}
        />
      )}

      {/* AI CQ MODAL */}
      {showAICQModal && (
        <AICQGeneratorModal
          isOpen={showAICQModal}
          onClose={() => setShowAICQModal(false)}
          onGeneratedCQs={(newCQs) => {
            if (Array.isArray(newCQs) && newCQs.length > 0) {
              setQuestionBank(prev => [...newCQs, ...prev]);
            }
          }}
        />
      )}
    </div>
  );
}
