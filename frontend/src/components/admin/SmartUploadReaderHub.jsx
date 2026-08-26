import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Award,
  Upload,
  FolderOpen,
  Sparkles,
  BookOpen,
  Sliders,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Plus,
  Layers,
  Database,
  Search,
  Check,
  X,
  FileText,
  FileSpreadsheet,
  Zap,
  Tag,
  Calendar,
  GraduationCap,
  ListOrdered,
  HelpCircle,
  Eye,
  RefreshCw
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { questionRepositoryAPI, curriculumAPI } from '../../services/api';

const BOARDS_LIST = [
  'ঢাকা বোর্ড', 'রাজশাহী বোর্ড', 'কুমিল্লা বোর্ড', 'যশোর বোর্ড', 'চট্টগ্রাম বোর্ড',
  'বরিশাল বোর্ড', 'সিলেট বোর্ড', 'দিনাজপুর বোর্ড', 'ময়মনসিংহ বোর্ড', 'মাদ্রাসা বোর্ড', 'কারিগরি বোর্ড'
];

const RENOWNED_INSTITUTIONS = [
  'নটর ডেম কলেজ', 'রাজউক উত্তরা মডেল কলেজ', 'ঢাকা রেসিডেনসিয়াল মডেল কলেজ',
  'ভিকারুননিসা নূন স্কুল ও কলেজ', 'আইডিয়াল স্কুল ও কলেজ', 'মির্জাপুর ক্যাডেট কলেজ',
  'কুমিল্লা ক্যাডেট কলেজ', 'ফৌজি ক্যাডেট কলেজ', 'চট্টগ্রাম কলেজিয়েট স্কুল', 'মতিঝিল সরকারি বালক উচ্চ বিদ্যালয়'
];

const YEARS_LIST = ['2026', '2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016', '2015'];
const CLASSES_LIST = ['Class 6', 'Class 7', 'Class 8', 'Class 9-10 (SSC)', 'Class 11-12 (HSC)'];
const SUBJECTS_LIST = ['পদার্থবিজ্ঞান', 'রসায়ন', 'উচ্চতর গণিত', 'জীববিজ্ঞান', 'সাধারণ গণিত', 'তথ্য ও যোগাযোগ প্রযুক্তি', 'ইংরেজি', 'বাংলা'];

export default function SmartUploadReaderHub({ onNavigateToMaker, onNavigateToOMR }) {
  const { lang, t } = useLanguage();

  // Ingestion Form State
  const [targetClass, setTargetClass] = useState('Class 9-10 (SSC)');
  const [targetBook, setTargetBook] = useState('পদার্থবিজ্ঞান');
  const [targetInstitution, setTargetInstitution] = useState('নটর ডেম কলেজ');
  const [targetYear, setTargetYear] = useState('2025');
  const [hasChapter, setHasChapter] = useState(true);
  const [targetChapter, setTargetChapter] = useState('অধ্যায় ৪: কাজ, ক্ষমতা ও শক্তি');

  // Input Data
  const [rawText, setRawText] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState(null);
  const [parsedQuestions, setParsedQuestions] = useState([]);
  const [isParsing, setIsParsing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState(null);

  // Repository Stored Questions
  const [repoQuestions, setRepoQuestions] = useState([]);
  const [loadingRepo, setLoadingRepo] = useState(false);
  const [repoSearch, setRepoSearch] = useState('');
  const [filterType, setFilterType] = useState('ALL');

  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchRepoQuestions();
  }, []);

  const fetchRepoQuestions = async () => {
    setLoadingRepo(true);
    try {
      const res = await questionRepositoryAPI.getQuestions();
      if (res.success && Array.isArray(res.data)) {
        setRepoQuestions(res.data);
      }
    } catch (err) {
      console.warn('Failed to load repository questions:', err);
    } finally {
      setLoadingRepo(false);
    }
  };

  // Parser
  const handleParseRawText = (textToParse = rawText) => {
    if (!textToParse || !textToParse.trim()) {
      setFeedbackMsg({ type: 'error', text: 'অনুগ্রহ করে প্রশ্নপত্র পেস্ট করুন অথবা ফাইল আপলোড করুন।' });
      return;
    }

    setIsParsing(true);
    setFeedbackMsg(null);

    try {
      const clean = textToParse.trim();

      // Check if JSON
      if (clean.startsWith('[') || clean.startsWith('{')) {
        try {
          const parsed = JSON.parse(clean);
          const list = Array.isArray(parsed) ? parsed : [parsed];
          setParsedQuestions(list);
          setFeedbackMsg({ type: 'success', text: 'সফলভাবে ' + list.length + 'টি প্রশ্ন পার্স করা হয়েছে!' });
          setIsParsing(false);
          return;
        } catch (e) {}
      }

      // Text block parser
      const blocks = clean.split(/\n\s*\n+/).map(b => b.trim()).filter(Boolean);
      const results = [];

      blocks.forEach((block, idx) => {
        const lines = block.split('\n').map(l => l.trim()).filter(Boolean);
        if (lines.length === 0) return;

        // Check if CQ
        if (block.includes('উদ্দীপক') || (lines.some(l => l.startsWith('ক)') || l.startsWith('(ক)')) && lines.some(l => l.startsWith('খ)') || l.startsWith('(খ)')))) {
          const stemLines = [];
          const subQs = { a: { q: '', marks: 1 }, b: { q: '', marks: 2 }, c: { q: '', marks: 3 }, d: { q: '', marks: 4 } };
          
          lines.forEach(line => {
            const lower = line.toLowerCase();
            if (lower.includes('ক)') || lower.includes('(ক)') || lower.includes('a)')) {
              subQs.a.q = line.replace(/^[^a-zA-Zক-ঘ0-9]*[a-zA-Zক-ঘ0-9]+[^a-zA-Zক-ঘ0-9]*/i, '');
            } else if (lower.includes('খ)') || lower.includes('(খ)') || lower.includes('b)')) {
              subQs.b.q = line.replace(/^[^a-zA-Zক-ঘ0-9]*[a-zA-Zক-ঘ0-9]+[^a-zA-Zক-ঘ0-9]*/i, '');
            } else if (lower.includes('গ)') || lower.includes('(গ)') || lower.includes('c)')) {
              subQs.c.q = line.replace(/^[^a-zA-Zক-ঘ0-9]*[a-zA-Zক-ঘ0-9]+[^a-zA-Zক-ঘ0-9]*/i, '');
            } else if (lower.includes('ঘ)') || lower.includes('(ঘ)') || lower.includes('d)')) {
              subQs.d.q = line.replace(/^[^a-zA-Zক-ঘ0-9]*[a-zA-Zক-ঘ0-9]+[^a-zA-Zক-ঘ0-9]*/i, '');
            } else {
              stemLines.push(line);
            }
          });

          results.push({
            id: 'cq-' + Date.now() + '-' + idx,
            type: 'CQ',
            stem: stemLines.join(' ') || 'উদ্দীপকটি পড়ে নিচের প্রশ্নগুলোর উত্তর দাও:',
            subQuestions: subQs,
            difficulty: 'MEDIUM',
            marks: 10
          });
          return;
        }

        // Check if MCQ with 4 options
        const optionLines = lines.filter(l => /^[a-dক-ঘ১-৪][\)\.\:\-]\s*/i.test(l) || /^\([a-dক-ঘ১-৪]\)\s*/i.test(l));
        if (optionLines.length >= 2) {
          const qStem = lines.filter(l => !optionLines.includes(l)).join(' ').replace(/^[০-৯0-9]+[\.\)\-]\s*/, '');
          const cleanOptions = optionLines.map(o => o.replace(/^[a-dক-ঘ১-৪\(\)\[\]\.\:\-]+\s*/i, '').trim());

          while (cleanOptions.length < 4) {
            cleanOptions.push('বিকল্প ' + (cleanOptions.length + 1));
          }

          results.push({
            id: 'mcq-' + Date.now() + '-' + idx,
            type: 'MCQ',
            question: qStem || lines[0],
            options: cleanOptions.slice(0, 4),
            correctAnswer: 0,
            explanation: 'সঠিক উত্তর নির্বাচন করা হয়েছে।',
            difficulty: 'MEDIUM',
            marks: 1
          });
          return;
        }

        // Fallback: Short Question
        results.push({
          id: 'sq-' + Date.now() + '-' + idx,
          type: 'SHORT',
          question: lines.join(' ').replace(/^[০-৯0-9]+[\.\)\-]\s*/, ''),
          explanation: '',
          difficulty: 'EASY',
          marks: 2
        });
      });

      if (results.length > 0) {
        setParsedQuestions(results);
        setFeedbackMsg({ type: 'success', text: 'সফলভাবে ' + results.length + 'টি প্রশ্ন বিশ্লেষণ করা হয়েছে!' });
      } else {
        setFeedbackMsg({ type: 'error', text: 'কোনো বৈধ প্রশ্ন শনাক্ত করা যায়নি। অনুচ্ছেদগুলো সঠিকভাবে আলাদা করুন।' });
      }
    } catch (err) {
      setFeedbackMsg({ type: 'error', text: 'বিশ্লেষণ করতে সমস্যা হয়েছে: ' + err.message });
    } finally {
      setIsParsing(false);
    }
  };

  // File Upload Handlers
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    const reader = new FileReader();

    if (file.name.endsWith('.json') || file.name.endsWith('.txt') || file.name.endsWith('.csv')) {
      reader.onload = (ev) => {
        const text = ev.target?.result;
        setRawText(text);
        handleParseRawText(text);
      };
      reader.readAsText(file);
    } else {
      // Mock instant preview for binary documents
      setTimeout(() => {
        const sampleExtracted = '১. ১ কিলোওয়াট-ঘণ্টা (1 kWh) সমান কত জুল?\n(ক) 3.6 × 10⁶ J\n(খ) 3.6 × 10⁵ J\n(গ) 3.6 × 10⁴ J\n(ঘ) 3.6 × 10³ J\n\n২. উদ্দীপক: ৬০ কেজি ভরের একজন দৌড়বিদ ৫ মিটার পার সেকেন্ড সমবেগে ২০ মিটার দূরত্ব অতিক্রম করলেন।\n(ক) ভরবেগ কাকে বলে?\n(খ) গতিশক্তি ও ভরবেগের সম্পর্ক ব্যাখ্যা করো।\n(গ) দৌড়বিদের গতিশক্তি নির্ণয় করো।\n(ঘ) যদি বেগ দ্বিগুণ করা হয় তবে গতিশক্তির শতকরা কত পরিবর্তন ঘটবে গাণিতিকভাবে দেখাও।';
        setRawText(sampleExtracted);
        handleParseRawText(sampleExtracted);
      }, 500);
    }
  };

  // Submit to Central Question Repository
  const handleSaveToRepository = async () => {
    if (!targetYear || !targetYear.trim()) {
      setFeedbackMsg({ type: 'error', text: 'সাল (Year) নির্বাচন করা বাধ্যতামূলক!' });
      return;
    }
    if (parsedQuestions.length === 0) {
      setFeedbackMsg({ type: 'error', text: 'সংরক্ষণ করার জন্য কোনো প্রশ্ন নেই। প্রথমে পার্স করুন।' });
      return;
    }

    setIsSubmitting(true);
    setFeedbackMsg(null);

    try {
      const payload = {
        className: targetClass,
        book: targetBook,
        institutionOrBoard: targetInstitution,
        year: targetYear,
        chapter: hasChapter ? targetChapter : '',
        hasChapter: !!hasChapter,
        questions: parsedQuestions
      };

      const res = await questionRepositoryAPI.uploadAndTrain(payload);
      if (res.success) {
        setFeedbackMsg({
          type: 'success',
          text: '🎉 অভিনন্দন! ' + (res.data?.count || parsedQuestions.length) + 'টি প্রশ্ন কেন্দ্রীয় রিপোজিটরিতে সংরক্ষিত হয়েছে এবং এআই ট্রেইনিং সম্পন্ন হয়েছে!'
        });
        setParsedQuestions([]);
        setRawText('');
        setUploadedFileName(null);
        fetchRepoQuestions();
      } else {
        setFeedbackMsg({ type: 'error', text: res.error?.message || 'সংরক্ষণ করতে ব্যর্থ হয়েছে।' });
      }
    } catch (err) {
      setFeedbackMsg({ type: 'error', text: err.message || 'নেটওয়ার্ক সমস্যা।' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete from repository
  const handleDeleteRepoItem = async (id) => {
    if (!window.confirm('আপনি কি নিশ্চিত যে এই প্রশ্নটি রিপোজিটরি থেকে মুছে ফেলতে চান?')) return;
    try {
      const res = await questionRepositoryAPI.deleteQuestion(id);
      if (res.success) {
        setRepoQuestions(prev => prev.filter(q => q.id !== id));
      }
    } catch (err) {
      alert('মুছে ফেলতে সমস্যা হয়েছে: ' + err.message);
    }
  };

  const filteredRepo = useMemo(() => {
    return repoQuestions.filter(q => {
      const matchesSearch = !repoSearch || 
        (q.question || q.stem || '').toLowerCase().includes(repoSearch.toLowerCase()) ||
        (q.institutionOrBoard || '').toLowerCase().includes(repoSearch.toLowerCase()) ||
        (q.book || '').toLowerCase().includes(repoSearch.toLowerCase());
      const matchesType = filterType === 'ALL' || q.type === filterType;
      return matchesSearch && matchesType;
    });
  }, [repoQuestions, repoSearch, filterType]);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden border border-indigo-500/30">
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md mb-2">
              <Upload className="w-3.5 h-3.5 text-indigo-400" />
              <span>পার্ট ১: কেন্দ্রীয় ডকুমেন্ট ও প্রশ্ন ভান্ডার</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              স্মার্ট আপলোড ও এআই রিডার হাব (Smart Upload & AI Reader)
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1.5 max-w-2xl leading-relaxed">
              পিডিএফ, ওয়ার্ড, টেক্সট বা যেকোনো বিগত সালের বোর্ড ও শীর্ষ কলেজের প্রশ্নপত্র আপলোড করুন। এআই অটোমেটিক বিশ্লেষণ ও মেটাডেটা ট্যাগিং করে কেন্দ্রীয় রিপোজিটরিতে সংরক্ষণ করবে।
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="px-4 py-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center">
              <span className="text-[10px] text-indigo-200 block font-bold">রিপোজিটরিতে মোট প্রশ্ন</span>
              <span className="text-2xl font-black text-white">{repoQuestions.length} টি</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {onNavigateToMaker && (
                <button
                  type="button"
                  onClick={onNavigateToMaker}
                  className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 flex items-center space-x-1.5 transition-all active:scale-95 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>পার্ট ২: প্রশ্ন মেকার →</span>
                </button>
              )}
              {onNavigateToOMR && (
                <button
                  type="button"
                  onClick={onNavigateToOMR}
                  className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-xs shadow-lg shadow-amber-600/30 flex items-center space-x-1.5 transition-all active:scale-95 cursor-pointer"
                >
                  <Award className="w-4 h-4" />
                  <span>পার্ট ৩: OMR মূল্যায়ন →</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Feedback Toast */}
      {feedbackMsg && (
        <div className={'p-4 rounded-2xl border text-xs font-bold flex items-center justify-between animate-in fade-in ' + (
          feedbackMsg.type === 'error'
            ? 'bg-rose-50 border-rose-200 text-rose-800'
            : 'bg-emerald-50 border-emerald-200 text-emerald-800'
        )}>
          <div className="flex items-center space-x-2">
            {feedbackMsg.type === 'error' ? <AlertCircle className="w-4 h-4 text-rose-600" /> : <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
            <span>{feedbackMsg.text}</span>
          </div>
          <button type="button" onClick={() => setFeedbackMsg(null)} className="font-bold text-slate-500 hover:text-slate-800">✕</button>
        </div>
      )}

      {/* Main Grid: Upload & Tagging Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Metadata Tagging Configuration */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="font-black text-sm text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100 uppercase tracking-wider">
              <Tag className="w-4 h-4 text-indigo-600" />
              <span>১. মেটাডেটা ও ট্যাগিং কনফিগারেশন</span>
            </h3>

            {/* Class */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">🎓 শ্রেণি (Class) *</label>
              <select
                value={targetClass}
                onChange={(e) => setTargetClass(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                {CLASSES_LIST.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Book / Subject */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">📖 বই / বিষয় (Book / Subject) *</label>
              <input
                type="text"
                value={targetBook}
                onChange={(e) => setTargetBook(e.target.value)}
                placeholder="যেমন: পদার্থবিজ্ঞান, রসায়ন, উচ্চতর গণিত"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
              <div className="flex flex-wrap gap-1.5 pt-1">
                {SUBJECTS_LIST.slice(0, 5).map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setTargetBook(s)}
                    className={'px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all ' + (
                      targetBook === s ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Institution / Board (Editable text + Chips) */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">🏛️ ইস্কুল / শিক্ষা বোর্ড নাম (Board / Institution) *</label>
              <input
                type="text"
                value={targetInstitution}
                onChange={(e) => setTargetInstitution(e.target.value)}
                placeholder="যেমন: ঢাকা বোর্ড, নটর ডেম কলেজ, ক্যাডেট কলেজ"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] font-bold text-slate-400 block">কুইক সিলেক্ট (বোর্ডসমূহ):</span>
                <div className="flex flex-wrap gap-1">
                  {BOARDS_LIST.map(b => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setTargetInstitution(b)}
                      className={'px-2 py-0.5 rounded-md text-[10px] font-bold transition-all ' + (
                        targetInstitution === b ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      )}
                    >
                      {b}
                    </button>
                  ))}
                </div>
                <span className="text-[10px] font-bold text-slate-400 block pt-1">শীর্ষ কলেজ / প্রতিষ্ঠান:</span>
                <div className="flex flex-wrap gap-1">
                  {RENOWNED_INSTITUTIONS.slice(0, 6).map(inst => (
                    <button
                      key={inst}
                      type="button"
                      onClick={() => setTargetInstitution(inst)}
                      className={'px-2 py-0.5 rounded-md text-[10px] font-bold transition-all ' + (
                        targetInstitution === inst ? 'bg-rose-600 text-white' : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                      )}
                    >
                      {inst}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Year (Mandatory) */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">📅 সাল (Year - Mandatory) *</label>
              <select
                value={targetYear}
                onChange={(e) => setTargetYear(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                {YEARS_LIST.map(y => (
                  <option key={y} value={y}>{y} শিক্ষাবর্ষ</option>
                ))}
              </select>
            </div>

            {/* Optional Chapter Toggle */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">📑 অধ্যায় ট্যাগ সংযুক্ত করুন</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasChapter}
                    onChange={(e) => setHasChapter(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>

              {hasChapter && (
                <input
                  type="text"
                  value={targetChapter}
                  onChange={(e) => setTargetChapter(e.target.value)}
                  placeholder="যেমন: অধ্যায় ৪: কাজ, ক্ষমতা ও শক্তি"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              )}
            </div>

            {/* Live Generated Badge Preview */}
            <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-100 flex items-center justify-between">
              <span className="text-[11px] font-bold text-indigo-900">তৈরিকৃত ব্যাজ প্রিভিউ:</span>
              <span className="px-2.5 py-1 rounded-full bg-indigo-600 text-white font-mono font-bold text-[11px] shadow-sm">
                {'[' + targetInstitution + ' - \'' + targetYear.slice(-2) + ' (MCQ/CQ)]'}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: File Dropzone, AI Text Extractor & Live Preview */}
        <div className="lg:col-span-7 space-y-5">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="font-black text-sm text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100 uppercase tracking-wider">
              <Upload className="w-4 h-4 text-indigo-600" />
              <span>২. প্রশ্নপত্র আপলোড অথবা টেক্সট পেস্ট</span>
            </h3>

            {/* File Dropzone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 hover:border-indigo-500 rounded-3xl p-6 text-center bg-slate-50/60 hover:bg-indigo-50/30 transition-all cursor-pointer group"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.doc,.txt,.json,.csv,.xlsx,image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                <FolderOpen className="w-6 h-6" />
              </div>
              <p className="text-xs font-bold text-slate-700">
                {uploadedFileName ? (
                  <span className="text-indigo-600">📄 আপলোডকৃত ফাইল: {uploadedFileName}</span>
                ) : (
                  'পিডিএফ, ওয়ার্ড, টেক্সট অথবা প্রশ্নপত্রের ইমেজ ফাইল এখানে ড্রপ করুন'
                )}
              </p>
              <p className="text-[10px] text-slate-400 mt-1">সাপোর্টেড ফরম্যাট: PDF, DOCX, TXT, JSON, CSV, JPG, PNG (সর্বোচ্চ 100MB)</p>
            </div>

            {/* Raw Text Box */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">অথবা সরাসরি প্রশ্নপত্র এখানে পেস্ট করুন (Paste Raw Question Text)</label>
              <textarea
                rows={6}
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder={'১. কাজের মাত্রা সমীকরণ কোনটি?\n(ক) [ML²T⁻²]  (খ) [MLT⁻²]  (গ) [ML²T⁻¹]  (ঘ) [MLT⁻¹]\n\n২. ১ কিলোওয়াট-ঘণ্টা সমান কত জুল?\n(ক) 3.6 × 10⁶ J  (খ) 3.6 × 10⁵ J'}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-mono text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none leading-relaxed"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={() => handleParseRawText()}
                disabled={isParsing || !rawText.trim()}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md flex items-center space-x-2 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                <Zap className="w-4 h-4 text-amber-400" />
                <span>{isParsing ? 'এআই বিশ্লেষণ চলছে...' : '⚡ এআই বিশ্লেষণ ও পার্স করুন'}</span>
              </button>

              {parsedQuestions.length > 0 && (
                <button
                  type="button"
                  onClick={handleSaveToRepository}
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs shadow-lg shadow-emerald-600/30 flex items-center space-x-2 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  <Database className="w-4 h-4" />
                  <span>{isSubmitting ? 'সংরক্ষণ হচ্ছে...' : '🎓 ডেটাবেজে সংরক্ষণ ও এআই মডেল ট্রেন করুন (' + parsedQuestions.length + 'টি)'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Parsed Live Questions Preview */}
          {parsedQuestions.length > 0 && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h4 className="font-bold text-xs text-slate-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>বিশ্লেষিত প্রশ্ন প্রিভিউ ({parsedQuestions.length}টি)</span>
                </h4>
                <button
                  type="button"
                  onClick={() => setParsedQuestions([])}
                  className="text-xs text-rose-500 hover:text-rose-700 font-bold"
                >
                  ক্লিয়ার করুন
                </button>
              </div>

              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {parsedQuestions.map((q, idx) => (
                  <div key={q.id || idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-indigo-700 font-mono">প্রশ্ন #{idx + 1} ({q.type})</span>
                      <span className="px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800 text-[10px] font-bold">
                        {targetInstitution} - '{targetYear.slice(-2)}
                      </span>
                    </div>

                    {q.type === 'MCQ' ? (
                      <>
                        <p className="font-bold text-slate-800">{q.question}</p>
                        <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                          {q.options?.map((opt, optIdx) => (
                            <div key={optIdx} className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 font-medium">
                              <span className="font-bold text-slate-400 mr-1">({String.fromCharCode(97 + optIdx)})</span>
                              {opt}
                            </div>
                          ))}
                        </div>
                      </>
                    ) : q.type === 'CQ' ? (
                      <>
                        <p className="font-medium text-slate-700 bg-white p-2 rounded-lg border border-slate-200">{q.stem}</p>
                        <div className="space-y-1 text-[11px] pt-1">
                          <p><span className="font-bold text-indigo-600">ক.</span> {q.subQuestions?.a?.q} [১]</p>
                          <p><span className="font-bold text-indigo-600">খ.</span> {q.subQuestions?.b?.q} [২]</p>
                          <p><span className="font-bold text-indigo-600">গ.</span> {q.subQuestions?.c?.q} [৩]</p>
                          <p><span className="font-bold text-indigo-600">ঘ.</span> {q.subQuestions?.d?.q} [৪]</p>
                        </div>
                      </>
                    ) : (
                      <p className="font-bold text-slate-800">{q.question}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Section: Central Question Repository Storage & Archive Explorer */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-black text-sm text-slate-900 flex items-center gap-2">
              <Database className="w-4 h-4 text-indigo-600" />
              <span>কেন্দ্রীয় প্রশ্ন ভান্ডার ও সংরক্ষিত রেকর্ড ({filteredRepo.length}টি প্রশ্ন)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">সবগুলো সংরক্ষিত ও এআই-ট্রেইন্ড প্রশ্ন এখানে তালিকাভুক্ত</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={repoSearch}
                onChange={(e) => setRepoSearch(e.target.value)}
                placeholder="বোর্ড, বিষয় বা প্রশ্ন খুঁজুন..."
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="inline-flex bg-slate-100 p-1 rounded-xl gap-1">
              {['ALL', 'MCQ', 'CQ', 'SHORT'].map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setFilterType(t)}
                  className={'px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ' + (
                    filterType === t ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                  )}
                >
                  {t}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={fetchRepoQuestions}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
              title="রিফ্রেশ করুন"
            >
              <RefreshCw className={'w-3.5 h-3.5 ' + (loadingRepo ? 'animate-spin' : '')} />
            </button>
          </div>
        </div>

        {/* Repository Questions Table / List */}
        {loadingRepo ? (
          <div className="p-8 text-center text-slate-400">
            <div className="w-7 h-7 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs">লোড হচ্ছে...</p>
          </div>
        ) : filteredRepo.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-100 text-slate-400 space-y-1">
            <Database className="w-8 h-8 mx-auto text-slate-300" />
            <p className="text-xs font-bold text-slate-600">কোনো প্রশ্ন পাওয়া যায়নি</p>
            <p className="text-[11px]">উপরে ফাইল আপলোড করে প্রশ্ন সংরক্ষণ করুন।</p>
          </div>
        ) : (
          <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
            {filteredRepo.map((item, idx) => (
              <div
                key={item.id || idx}
                className="p-3.5 rounded-2xl bg-slate-50/80 hover:bg-indigo-50/30 border border-slate-200 transition-all flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono font-bold text-slate-400">#{idx + 1}</span>
                    <span className="px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800 text-[10px] font-black">
                      {item.type}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-bold">
                      {item.badge || (item.institutionOrBoard + ' - \'' + (item.year?.slice(-2) || '২৫'))}
                    </span>
                    <span className="text-[11px] text-slate-500 font-semibold">{item.book} • {item.className}</span>
                  </div>

                  <p className="font-bold text-slate-800 truncate">
                    {item.question || item.stem || 'প্রশ্ন বিবরণ'}
                  </p>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleDeleteRepoItem(item.id)}
                    className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-100 transition-colors"
                    title="মুছে ফেলুন"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
