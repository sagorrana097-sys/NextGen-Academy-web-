import React, { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { examAPI, materialAPI, googleDriveAPI, curriculumAPI } from '../../services/api';
import {
  Sparkles,
  Bot,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Save,
  X,
  BookOpen,
  Layers,
  HelpCircle,
  RefreshCw,
  Zap,
  Check,
  Award,
  Sliders,
  FileText,
  Copy,
  GraduationCap,
  FileCode,
  FolderOpen,
  Cloud,
  FileSpreadsheet,
  File,
  Loader2,
  ExternalLink,
  HardDrive
} from 'lucide-react';


const BENGALI_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
function normalizeBengaliDigits(str) {
  if (!str) return '';
  return String(str).replace(/[০-৯]/g, d => BENGALI_DIGITS.indexOf(d));
}
function toBengaliDigits(num) {
  if (num === undefined || num === null) return '';
  return String(num).replace(/[0-9]/g, d => BENGALI_DIGITS[Number(d)]);
}

const BOARDS_MAP = {
  'ঢাকা': 'ঢাকা', 'dhaka': 'ঢাকা',
  'চট্টগ্রাম': 'চট্টগ্রাম', 'চট্রগ্রাম': 'চট্টগ্রাম', 'chattogram': 'চট্টগ্রাম', 'chittagong': 'চট্টগ্রাম',
  'রাজশাহী': 'রাজশাহী', 'rajshahi': 'রাজশাহী',
  'কুমিল্লা': 'কুমিল্লা', 'cumilla': 'কুমিল্লা', 'comilla': 'কুমিল্লা',
  'যশোর': 'যশোর', 'jashore': 'যশোর', 'jessore': 'যশোর',
  'বরিশাল': 'বরিশাল', 'barishal': 'বরিশাল', 'barisal': 'বরিশাল',
  'সিলেট': 'সিলেট', 'sylhet': 'সিলেট',
  'দিনাজপুর': 'দিনাজপুর', 'dinajpur': 'দিনাজপুর',
  'ময়মনসিংহ': 'ময়মনসিংহ', 'mymensingh': 'ময়মনসিংহ',
  'মাদ্রাসা': 'মাদ্রাসা', 'madrasah': 'মাদ্রাসা',
  'কারিগরি': 'কারিগরি', 'technical': 'কারিগরি',
  'সকল বোর্ড': 'সকল বোর্ড', 'সকল': 'সকল বোর্ড', 'all boards': 'সকল বোর্ড'
};

export function formatAcademicBadge(board, year, qType = 'MCQ') {
  const cleanBoard = (board || 'সকল বোর্ড').trim();
  const cleanYear = year ? String(year).trim() : '';
  const shortYear = cleanYear ? cleanYear.replace(/^20/, '').replace(/^২০/, '') : '';
  const cleanType = (qType || 'MCQ').trim();

  if (cleanBoard && shortYear && cleanType) return `${cleanBoard} - ${shortYear} (${cleanType})`;
  if (cleanBoard && shortYear) return `${cleanBoard} - ${shortYear}`;
  if (cleanBoard && cleanType) return `${cleanBoard} (${cleanType})`;
  return `${cleanBoard}`;
}

export function parseMultiBoardPrompt(rawPrompt, defaultType = 'MCQ') {
  if (!rawPrompt || typeof rawPrompt !== 'string') return null;
  const text = rawPrompt.trim();
  const normalized = normalizeBengaliDigits(text);

  let qType = defaultType;
  if (/cq|সৃজনশীল|রচনামূলক/i.test(normalized)) qType = 'CQ';
  else if (/mcq|বহুনির্বাচনি|নৈর্ব্যক্তিক|এমসিকিউ/i.test(normalized)) qType = 'MCQ';
  else if (/sq|সংক্ষিপ্ত/i.test(normalized)) qType = 'SQ';

  const boardNames = Object.keys(BOARDS_MAP).sort((a, b) => b.length - a.length);
  const boardPattern = boardNames.map(b => b.replace(/[.*+?^${}()|[\]\\]/g, '\\export default function AIMCQGeneratorModal({')).join('|');

  const segmentRegex = new RegExp(
    `(${boardPattern})\\s*(?:বোর্ড)?\\s*([০-৯0-9]{2,4})?\\s*(?:সাল|সালের|থেকে|হতে|এর|-|:)?\\s*([০-৯0-9]{1,3})\\s*(?:টি|টা|টি প্রশ্ন|questions|mcq|cq)?`,
    'gi'
  );

  const distributions = [];
  let match;
  let totalParsedCount = 0;

  while ((match = segmentRegex.exec(normalized)) !== null) {
    const rawBoard = match[1].toLowerCase().trim();
    const standardBoard = BOARDS_MAP[rawBoard] || rawBoard;
    let rawYear = match[2] ? match[2].trim() : '';
    let rawCount = match[3] ? parseInt(match[3].trim(), 10) : 0;

    let fullYear = rawYear;
    if (rawYear) {
      if (rawYear.length === 2) {
        const yNum = parseInt(rawYear, 10);
        fullYear = yNum > 50 ? `19${rawYear}` : `20${rawYear}`;
      }
    } else {
      fullYear = '2025';
    }

    if (rawCount > 0) {
      const badge = formatAcademicBadge(standardBoard, fullYear, qType);
      distributions.push({
        board: standardBoard,
        examYear: fullYear,
        yearShort: fullYear.slice(-2),
        count: rawCount,
        questionType: qType,
        badge
      });
      totalParsedCount += rawCount;
    }
  }

  if (distributions.length === 0) return null;

  return {
    isMultiBoard: distributions.length > 1 || distributions[0].count > 0,
    distributions,
    totalCount: totalParsedCount,
    questionType: qType,
    summaryBn: distributions.map(d => `${d.board} '${d.yearShort} (${toBengaliDigits(d.count)}টি)`).join(' + ') + ` = মোট ${toBengaliDigits(totalParsedCount)}টি`
  };
}


export default function AIMCQGeneratorModal({
  isOpen,
  onClose,
  allClasses = [],
  onQuestionsImported,
  prefilledClassId = '',
  prefilledSubjectId = ''
}) {
  const { t, lang } = useLanguage();

  // Mode: 'standard' | 'drive'
  const [activeTab, setActiveTab] = useState('standard');

  // Dynamic Classes & Subjects State
  const [classes, setClasses] = useState(Array.isArray(allClasses) && allClasses.length > 0 ? allClasses : []);
  const [selectedClassId, setSelectedClassId] = useState(prefilledClassId ? String(prefilledClassId) : '');
  const [subjects, setSubjects] = useState([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState(prefilledSubjectId ? String(prefilledSubjectId) : '');
  const [loadingSubjects, setLoadingSubjects] = useState(false);
  const [loadingMaterials, setLoadingMaterials] = useState(false);

  // Generator State
  const [topic, setTopic] = useState('');
  const [showMultiBoardBuilder, setShowMultiBoardBuilder] = useState(false);
  const [manualDistributions, setManualDistributions] = useState([
    { id: 1, board: 'ঢাকা', examYear: '2025', count: 20 },
    { id: 2, board: 'কুমিল্লা', examYear: '2022', count: 12 },
    { id: 3, board: 'যশোর', examYear: '2013', count: 18 }
  ]);

  // Real-Time Multi-Board Prompt Parser
  const parsedPromptDist = useMemo(() => {
    return parseMultiBoardPrompt(topic, 'MCQ');
  }, [topic]);
  const [difficulty, setDifficulty] = useState('MEDIUM'); // 'EASY' | 'MEDIUM' | 'HARD'
  const [questionCount, setQuestionCount] = useState(10);
  const [chapterNotes, setChapterNotes] = useState('');
  const [sourceMaterials, setSourceMaterials] = useState([]);
  const [selectedSourceMaterialId, setSelectedSourceMaterialId] = useState('');

  // Google Drive State
  const [driveFolderUrl, setDriveFolderUrl] = useState('');
  const [isScanningDrive, setIsScanningDrive] = useState(false);
  const [driveScanResult, setDriveScanResult] = useState(null);
  const [selectedDriveFiles, setSelectedDriveFiles] = useState([]);
  const [isSyncingDrive, setIsSyncingDrive] = useState(false);

  // Generation & Status State
  const [generating, setGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState('');
  const [generatedQuestions, setGeneratedQuestions] = useState([]);
  const [engineSource, setEngineSource] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Quick Subject Presets
  const subjectPresets = [
    'পদার্থবিজ্ঞান (Physics)',
    'রসায়ন (Chemistry)',
    'উচ্চতর গণিত (Higher Math)',
    'সাধারণ গণিত (General Math)',
    'জীববিজ্ঞান (Biology)',
    'তথ্য ও যোগাযোগ প্রযুক্তি (ICT)',
    'বাংলা সাহিত্য ও ব্যাকরণ',
    'English Grammar & Literature',
    'সাধারণ বিজ্ঞান (General Science)',
    'বাংলাদেশ ও বিশ্বপরিচয় (BGS)'
  ];

  // 1. Load classes dynamically on mount if not provided
  useEffect(() => {
    if (isOpen) {
      if (Array.isArray(allClasses) && allClasses.length > 0) {
        setClasses(allClasses);
        if (!selectedClassId) setSelectedClassId(String(allClasses[0].id));
      } else {
        curriculumAPI.getClasses().then(res => {
          if (res?.success && Array.isArray(res.data) && res.data.length > 0) {
            setClasses(res.data);
            if (!selectedClassId) setSelectedClassId(String(res.data[0].id));
          }
        }).catch(err => console.error('Failed to load classes in MCQ generator:', err));
      }
    }
  }, [isOpen, allClasses]);

  // 2. Fetch subjects dynamically whenever selectedClassId changes
  useEffect(() => {
    if (!isOpen || !selectedClassId) {
      setSubjects([]);
      setSelectedSubjectId('');
      return;
    }

    setLoadingSubjects(true);
    curriculumAPI.getSubjects(selectedClassId)
      .then(res => {
        if (res?.success && Array.isArray(res.data)) {
          setSubjects(res.data);
          if (res.data.length > 0) {
            const exists = res.data.some(s => String(s.id) === String(selectedSubjectId));
            if (!exists) {
              setSelectedSubjectId(String(res.data[0].id));
            }
          } else {
            setSelectedSubjectId('');
          }
        }
      })
      .catch(err => console.error('Failed to load subjects:', err))
      .finally(() => setLoadingSubjects(false));
  }, [isOpen, selectedClassId]);

  // 3. Immediately re-fetch and filter source materials whenever selectedClassId or selectedSubjectId changes
  useEffect(() => {
    if (!isOpen) return;

    setLoadingMaterials(true);
    const queryParams = {};
    if (selectedClassId) queryParams.classId = selectedClassId;
    if (selectedSubjectId) queryParams.subjectId = selectedSubjectId;

    materialAPI.getSourceMaterials(queryParams)
      .then(res => {
        if (res && Array.isArray(res.data)) {
          setSourceMaterials(res.data);
          setSelectedSourceMaterialId(prev => {
            const exists = res.data.some(m => String(m.id) === String(prev));
            return exists ? prev : '';
          });
        }
      })
      .catch(err => console.error('Failed to load source materials in MCQ generator:', err))
      .finally(() => setLoadingMaterials(false));
  }, [isOpen, selectedClassId, selectedSubjectId]);

  // Resolved Class and Subject Objects
  const currentClassObj = useMemo(() => {
    return classes.find(c => String(c.id) === String(selectedClassId)) || { nameBn: '১০ম শ্রেণি (Class 10)', name: 'Class 10' };
  }, [classes, selectedClassId]);

  const currentSubjectObj = useMemo(() => {
    return subjects.find(s => String(s.id) === String(selectedSubjectId)) || { nameBn: 'পদার্থবিজ্ঞান (Physics)', name: 'Physics' };
  }, [subjects, selectedSubjectId]);

  const subject = currentSubjectObj?.nameBn || currentSubjectObj?.name || 'পদার্থবিজ্ঞান';
  const classGrade = currentClassObj?.nameBn || currentClassObj?.name || '১০ম শ্রেণি';
  const filteredSourceMaterials = sourceMaterials;

  const handleSelectSource = (matId) => {
    setSelectedSourceMaterialId(matId);
    if (matId) {
      const found = filteredSourceMaterials.find(m => String(m.id) === String(matId));
      if (found) {
        if (!topic.trim()) setTopic(found.title);
      }
    }
  };

  // Google Drive Folder Scanner
  const handleScanDriveFolder = async () => {
    if (!driveFolderUrl.trim()) {
      setErrorMsg('অনুগ্রহ করে গুগল ড্রাইভ ফোল্ডারের লিংক বা আইডি প্রবেশ করান।');
      return;
    }

    setIsScanningDrive(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await googleDriveAPI.scanFolder({ folderUrlOrId: driveFolderUrl.trim() });
      if (res.success && Array.isArray(res.files)) {
        setDriveScanResult(res);
        // Default: select all supported files
        const supported = res.files.filter(f => f.isSupported);
        setSelectedDriveFiles(supported);
        setSuccessMsg(`গুগল ড্রাইভ ফোল্ডার স্ক্যান সফল! ${res.files.length}টি ফাইল পাওয়া গেছে (${supported.length}টি সাপোর্টেড)।`);
      } else {
        setErrorMsg(res.error?.message || 'গুগল ড্রাইভ ফোল্ডার স্ক্যান করা যায়নি।');
      }
    } catch (err) {
      setErrorMsg(err.message || 'গুগল ড্রাইভ স্ক্যান করার সময় সমস্যা হয়েছে।');
    } finally {
      setIsScanningDrive(false);
    }
  };

  const toggleDriveFile = (file) => {
    setSelectedDriveFiles(prev => {
      const exists = prev.some(f => f.id === file.id);
      if (exists) {
        return prev.filter(f => f.id !== file.id);
      } else {
        return [...prev, file];
      }
    });
  };

  // Generate Questions from Google Drive
  const handleGenerateFromDrive = async () => {
    if (selectedDriveFiles.length === 0) {
      setErrorMsg('অনুগ্রহ করে প্রশ্ন তৈরির জন্য অন্তত একটি গুগল ড্রাইভ ফাইল নির্বাচন করুন।');
      return;
    }

    setGenerating(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    setGenerationStep('গুগল ড্রাইভ থেকে PDF/Word ফাইল ডাউনলোড ও টেক্সট নিষ্কাশন হচ্ছে...');

    try {
      setTimeout(() => {
        setGenerationStep('জেমিনাই এআই দিয়ে ড্রাইভ ফাইলের কনটেন্ট বিশ্লেষণ হচ্ছে...');
      }, 1500);

      setTimeout(() => {
        setGenerationStep('বোর্ড মানের বহুনির্বাচনী প্রশ্ন, সঠিক উত্তর ও ব্যাখ্যা তৈরি হচ্ছে...');
      }, 3000);

      const res = await googleDriveAPI.generateQuestions({
        files: selectedDriveFiles,
        folderUrlOrId: driveFolderUrl,
        type: 'MCQ',
        subject: currentSubjectObj?.nameBn || currentSubjectObj?.name || subject,
        classGrade: currentClassObj?.nameBn || currentClassObj?.name || classGrade,
        classId: selectedClassId,
        subjectId: selectedSubjectId,
        topic: topic.trim() || (selectedDriveFiles[0]?.name ? (selectedDriveFiles[0].name || '').replace(/\.[^/.]+$/, '') : 'গুগল ড্রাইভ স্টাডি মেটেরিয়াল'),
        difficulty,
        questionCount: Number(questionCount)
      });

      if (res.success && res.data && Array.isArray(res.data.questions || res.data)) {
        const rawList = res.data.questions || res.data;
        setGeneratedQuestions(rawList.map((q, idx) => ({
          id: idx + 1,
          questionBn: q.question || q.questionBn || `প্রশ্ন ${idx + 1}`,
          options: Array.isArray(q.options) && q.options.length === 4
            ? q.options
            : ['অপশন ক', 'অপশন খ', 'অপশন গ', 'অপশন ঘ'],
          correctOptionIndex: typeof q.correctAnswer === 'number' ? q.correctAnswer : 0,
          marks: 1,
          explanation: q.explanation || 'গুগল ড্রাইভ সোর্স ভিত্তিক সঠিক উত্তর।'
        })));
        setEngineSource(res.sourceInfo?.engine || 'Google Drive Direct Reader + Gemini AI');
        setSuccessMsg(`গুগল ড্রাইভের ${selectedDriveFiles.length}টি ফাইল থেকে ${rawList.length}টি প্রশ্ন সফলভাবে তৈরি হয়েছে!`);
      } else {
        throw new Error(res?.error?.message || 'প্রশ্ন তৈরি করতে সমস্যা হয়েছে');
      }
    } catch (err) {
      console.error('Drive Question Gen Error:', err);
      setErrorMsg(err.message || 'গুগল ড্রাইভ ফাইল থেকে প্রশ্ন তৈরি ব্যর্থ হয়েছে');
    } finally {
      setGenerating(false);
      setGenerationStep('');
    }
  };

  // Standard Generate Handler
  const handleGenerate = async (e) => {
    if (e) e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!topic.trim() && !chapterNotes.trim() && !selectedSourceMaterialId) {
      setErrorMsg('অনুগ্রহ করে অধ্যায়/টপিকের নাম, হ্যান্ডনোট অথবা স্টাডি সোর্স ডকুমেন্ট নির্বাচন করুন।');
      return;
    }

    setGenerating(true);
    setGenerationStep('জেমিনাই এআই ও এনসিটিবি কারিকুলাম বিশ্লেষণ হচ্ছে...');

    try {
      setTimeout(() => {
        setGenerationStep('৪টি মানসম্মত অপশন, সঠিক উত্তর ও ব্যাখ্যা তৈরি হচ্ছে...');
      }, 1200);

      const distPayload = parsedPromptDist?.distributions || (showMultiBoardBuilder ? manualDistributions.map(d => ({
        board: d.board,
        examYear: d.examYear,
        count: Number(d.count) || 5,
        badge: formatAcademicBadge(d.board, d.examYear, 'MCQ'),
        questionType: 'MCQ'
      })) : null);

      const res = await examAPI.generateMCQs({
        topic: topic.trim(),
        prompt: topic.trim(),
        subject,
        classGrade,
        classId: selectedClassId ? Number(selectedClassId) : null,
        subjectId: selectedSubjectId ? Number(selectedSubjectId) : null,
        difficulty,
        questionCount: parsedPromptDist?.totalCount || Number(questionCount),
        chapterNotes: chapterNotes.trim(),
        sourceMaterialId: selectedSourceMaterialId ? Number(selectedSourceMaterialId) : null,
        distribution: distPayload
      });

      if (res.success && Array.isArray(res.data)) {
        setGeneratedQuestions(res.data.map((q, idx) => ({
          id: idx + 1,
          questionBn: q.question || q.questionBn || `প্রশ্ন ${idx + 1}`,
          options: Array.isArray(q.options) && q.options.length === 4
            ? q.options
            : ['অপশন ক', 'অপশন খ', 'অপশন গ', 'অপশন ঘ'],
          correctOptionIndex: typeof q.correctAnswer === 'number' ? q.correctAnswer : 0,
          marks: 1,
          explanation: q.explanation || 'সঠিক উত্তর।',
          board: q.board || 'সকল বোর্ড',
          examYear: q.examYear || '2025',
          questionType: 'MCQ',
          badge: q.badge || formatAcademicBadge(q.board, q.examYear, 'MCQ')
        })));
        setEngineSource(res.source || 'GEMINI_AI');
        setSuccessMsg(res.message || `${res.data.length}টি প্রশ্ন সফলভাবে জেনারেট হয়েছে!`);
      } else {
        setErrorMsg(res.error?.message || 'প্রশ্ন জেনারেট করতে সমস্যা হয়েছে');
      }
    } catch (err) {
      console.error('Generate MCQ error:', err);
      setErrorMsg(err.message || 'সার্ভারে সংযোগ করতে সমস্যা হয়েছে');
    } finally {
      setGenerating(false);
      setGenerationStep('');
    }
  };

  const handleQuestionTextChange = (idx, text) => {
    setGeneratedQuestions(prev => {
      const copy = [...prev];
      copy[idx].questionBn = text;
      return copy;
    });
  };

  const handleOptionTextChange = (qIdx, optIdx, text) => {
    setGeneratedQuestions(prev => {
      const copy = [...prev];
      const newOpts = [...copy[qIdx].options];
      newOpts[optIdx] = text;
      copy[qIdx].options = newOpts;
      return copy;
    });
  };

  const handleCorrectAnswerChange = (qIdx, optIdx) => {
    setGeneratedQuestions(prev => {
      const copy = [...prev];
      copy[qIdx].correctOptionIndex = optIdx;
      return copy;
    });
  };

  const handleExplanationChange = (qIdx, text) => {
    setGeneratedQuestions(prev => {
      const copy = [...prev];
      copy[qIdx].explanation = text;
      return copy;
    });
  };

  const handleRemoveQuestion = (idx) => {
    setGeneratedQuestions(prev => prev.filter((_, i) => i !== idx));
  };

  const handleAddNewQuestion = () => {
    setGeneratedQuestions(prev => [
      ...prev,
      {
        id: prev.length + 1,
        questionBn: '',
        options: ['', '', '', ''],
        correctOptionIndex: 0,
        marks: 1,
        explanation: ''
      }
    ]);
  };

  const handleApplyToExam = () => {
    if (generatedQuestions.length === 0) {
      alert('প্রথমে এআই দিয়ে প্রশ্ন জেনারেট করুন');
      return;
    }

    if (onQuestionsImported) {
      onQuestionsImported({
        questions: generatedQuestions,
        topic,
        subject,
        classGrade,
        totalMarks: generatedQuestions.reduce((acc, q) => acc + (q.marks || 1), 0)
      });
    }

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto font-sans">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-5xl w-full shadow-2xl flex flex-col overflow-hidden text-white my-auto max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="p-5 bg-gradient-to-r from-indigo-950 via-purple-950 to-slate-900 border-b border-slate-700/80 flex items-center justify-between">
          <div className="flex items-center space-x-3.5">
            <div className="p-2.5 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/20">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base sm:text-lg font-black text-white">
                  🤖 এআই স্বয়ংক্রিয় প্রশ্ন জেনারেটর (AI Question Bank Generator)
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-black uppercase">
                  Google Drive + Gemini AI
                </span>
              </div>
              <p className="text-xs text-slate-300">
                গুগল ড্রাইভ ফোল্ডার লিংক দিন অথবা টপিক লিখে এক ক্লিকে সম্পূর্ণ মানসম্মত MCQ ও সৃজনশীল প্রশ্ন তৈরি করুন
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs (Standard vs Google Drive) */}
        <div className="px-6 pt-4 pb-2 bg-slate-900/90 border-b border-slate-800 flex items-center space-x-3">
          <button
            type="button"
            onClick={() => setActiveTab('standard')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
              activeTab === 'standard'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-750'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>টপিক ও হ্যান্ডনোট মোড (Topic / Notes)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('drive')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
              activeTab === 'drive'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/30'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-750'
            }`}
          >
            <HardDrive className="w-3.5 h-3.5 text-emerald-400" />
            <span>📁 গুগল ড্রাইভ ফোল্ডার সিঙ্ক (Google Drive Folder Sync)</span>
            <span className="px-1.5 py-0.2 bg-amber-400 text-slate-950 rounded text-[9px] font-black uppercase">NEW</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-slate-950/40">
          {/* Toast / Feedback alerts */}
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs font-bold flex items-center space-x-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs font-bold flex items-center space-x-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{successMsg}</span>
              {engineSource && (
                <span className="ml-auto text-[10px] px-2 py-0.5 rounded-md bg-emerald-900/60 font-mono">
                  Engine: {engineSource}
                </span>
              )}
            </div>
          )}

          {/* TAB 1: GOOGLE DRIVE FOLDER SYNC MODE */}
          {activeTab === 'drive' && (
            <div className="space-y-4 p-5 rounded-3xl bg-slate-900 border border-emerald-500/30 shadow-lg shadow-emerald-500/5">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-xs text-emerald-400 uppercase tracking-wider flex items-center space-x-2">
                  <HardDrive className="w-4 h-4" />
                  <span>গুগল ড্রাইভ ফোল্ডার কানেক্টর (Google Drive Folder API)</span>
                </h4>
                <span className="text-[10px] text-slate-400">PDF, DOCX, Docs, Text সরাসরি পার্সিং</span>
              </div>

              {/* Folder URL Input */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-300">
                  গুগল ড্রাইভ ফোল্ডার লিংক বা ফোল্ডার আইডি (Google Drive Folder URL / ID)
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={driveFolderUrl}
                    onChange={(e) => setDriveFolderUrl(e.target.value)}
                    placeholder="https://drive.google.com/drive/folders/1aBcDeFgHiJkLmNoPqrStUvWxYz..."
                    className="flex-1 p-3 rounded-2xl border border-slate-700 bg-slate-800/90 text-slate-100 text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    disabled={isScanningDrive || !driveFolderUrl.trim()}
                    onClick={handleScanDriveFolder}
                    className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/30 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
                  >
                    {isScanningDrive ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>স্ক্যান হচ্ছে...</span>
                      </>
                    ) : (
                      <>
                        <FolderOpen className="w-4 h-4" />
                        <span>ফোল্ডার স্ক্যান করুন (Scan)</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Scanned Files Grid */}
              {driveScanResult && driveScanResult.files && (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-200 flex items-center space-x-1.5">
                      <span>শনাক্তকৃত ফাইল তালিকা ({driveScanResult.files.length}টি)</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        if (selectedDriveFiles.length === driveScanResult.files.length) {
                          setSelectedDriveFiles([]);
                        } else {
                          setSelectedDriveFiles(driveScanResult.files);
                        }
                      }}
                      className="text-emerald-400 hover:text-emerald-300 font-bold text-[11px]"
                    >
                      {selectedDriveFiles.length === driveScanResult.files.length ? 'সব আনচেক করুন' : 'সব সিলেক্ট করুন'}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
                    {driveScanResult.files.map((file) => {
                      const isSelected = selectedDriveFiles.some(f => f.id === file.id);
                      return (
                        <div
                          key={file.id}
                          onClick={() => toggleDriveFile(file)}
                          className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center space-x-3 ${
                            isSelected
                              ? 'bg-emerald-950/40 border-emerald-500/60 text-white shadow-sm'
                              : 'bg-slate-800/40 border-slate-800 text-slate-400 hover:border-slate-700'
                          }`}
                        >
                          <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${
                            isSelected ? 'bg-emerald-500 border-emerald-500 text-slate-950' : 'border-slate-600'
                          }`}>
                            {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold text-slate-200 truncate">{file.name}</p>
                            <div className="flex items-center space-x-2 text-[10px] text-slate-400 mt-0.5 font-mono">
                              <span className="px-1.5 py-0.2 rounded bg-slate-800 text-emerald-400 font-bold">{file.type}</span>
                              <span>{file.size}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Drive Generation Button */}
                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                    <span className="text-xs text-slate-400">
                      নির্বাচিত: <strong className="text-emerald-400">{selectedDriveFiles.length}টি ফাইল</strong>
                    </span>
                    <button
                      type="button"
                      disabled={generating || selectedDriveFiles.length === 0}
                      onClick={handleGenerateFromDrive}
                      className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black shadow-lg shadow-emerald-600/30 flex items-center space-x-2 transition-all active:scale-95 disabled:opacity-50"
                    >
                      {generating ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>{generationStep || 'এআই প্রসেস হচ্ছে...'}</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 text-amber-300" />
                          <span>ড্রাইভ কনটেন্ট থেকে প্রশ্ন তৈরি করুন (Generate MCQs)</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: STANDARD MANUAL / TOPIC CONFIGURATION */}
          {activeTab === 'standard' && (
            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-sm space-y-4">
              <h4 className="font-bold text-xs text-indigo-400 uppercase tracking-wider flex items-center space-x-2">
                <Sliders className="w-4 h-4" />
                <span>প্রশ্নের মানদণ্ড ও সিলেবাস নির্বাচন (Configuration)</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs">
                {/* Class / Grade (Dynamic from Database) */}
                <div>
                  <label className="block font-bold text-slate-300 mb-1">
                    শ্রেণি / গ্রেড (Class) <span className="text-rose-400">*</span>
                  </label>
                  <select
                    value={selectedClassId}
                    onChange={(e) => {
                      setSelectedClassId(e.target.value);
                      setSelectedSourceMaterialId('');
                    }}
                    className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-800 text-slate-100 font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    {classes.map((cls) => (
                      <option key={cls.id} value={cls.id}>
                        {cls.nameBn || cls.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Subject (Dynamically Filtered for selected Class) */}
                <div>
                  <label className="block font-bold text-slate-300 mb-1 flex items-center justify-between">
                    <span>পাঠ্য বিষয় (Subject) <span className="text-rose-400">*</span></span>
                    {loadingSubjects && <Loader2 className="w-3 h-3 animate-spin text-indigo-400" />}
                  </label>
                  <select
                    value={selectedSubjectId}
                    disabled={loadingSubjects}
                    onChange={(e) => {
                      setSelectedSubjectId(e.target.value);
                      setSelectedSourceMaterialId('');
                    }}
                    className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-800 text-slate-100 font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none disabled:opacity-50"
                  >
                    {loadingSubjects ? (
                      <option value="">বিষয় লোড হচ্ছে...</option>
                    ) : subjects.length > 0 ? (
                      subjects.map((sp) => (
                        <option key={sp.id} value={sp.id}>
                          {sp.nameBn || sp.name} {sp.code ? `(${sp.code})` : ''}
                        </option>
                      ))
                    ) : (
                      <option value="">কোনো বিষয় নির্ধারিত নেই</option>
                    )}
                  </select>
                </div>

                {/* Difficulty */}
                <div>
                  <label className="block font-bold text-slate-300 mb-1">কাঠিন্যের মাত্রা (Difficulty)</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-800 text-slate-100 font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="EASY">সহজ (Easy - Basic Recall)</option>
                    <option value="MEDIUM">মাঝারি (Medium - Standard Board)</option>
                    <option value="HARD">কঠিন (Hard - Critical Thinking)</option>
                  </select>
                </div>
              </div>

              {/* Select Source Material */}
              <div className="space-y-1.5 p-3.5 rounded-2xl bg-indigo-950/30 border border-indigo-500/30">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-indigo-300 flex items-center space-x-1.5">
                    <FileCode className="w-3.5 h-3.5 text-indigo-400" />
                    <span>
                      স্টাডি সোর্স ডকুমেন্ট ({filteredSourceMaterials.length}টি {subject.split('(')[0].trim()} ফাইল)
                    </span>
                  </label>
                  {selectedSourceMaterialId && (
                    <button
                      type="button"
                      onClick={() => setSelectedSourceMaterialId('')}
                      className="text-[10px] text-rose-400 hover:text-rose-300 font-bold"
                    >
                      রিমুভ করুন
                    </button>
                  )}
                </div>

                <select
                  value={selectedSourceMaterialId}
                  onChange={(e) => handleSelectSource(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-indigo-500/40 bg-slate-800 text-slate-100 text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="">-- সাধারণ কারিকুলাম জ্ঞান (General AI Knowledge) --</option>
                  {filteredSourceMaterials.map((mat) => {
                    const badge = mat.badge || mat.academicBadge;
                    return (
                      <option key={mat.id} value={mat.id}>
                        {badge ? `[${badge}] ` : '📄 '}
                        {mat.title} ({mat.subjectName || mat.category || 'নোট'}{mat.board ? ` • ${mat.board}` : ''}{mat.examYear ? ` '${String(mat.examYear).slice(-2)}` : ''})
                      </option>
                    );
                  })}
                </select>
                {filteredSourceMaterials.length === 0 && (
                  <p className="text-[10px] text-amber-400/90 mt-1 italic">
                    ⚠️ {subject.split('(')[0].trim()} বিষয়ের কোনো নির্দিষ্ট ফাইল পাওয়া যায়নি। সাধারণ কারিকুলাম সিলেবাস থেকে প্রশ্ন তৈরি হবে।
                  </p>
                )}
              </div>

              {/* Topic & Composite Multi-Board Prompt Input Box */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-300">
                    অধ্যায়, টপিক অথবা সমন্বিত মাল্টি-বোর্ড প্রম্পট কমান্ড (AI Prompt / Command) <span className="text-rose-400">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowMultiBoardBuilder(!showMultiBoardBuilder)}
                    className="text-[11px] font-bold text-indigo-400 hover:text-indigo-300 flex items-center space-x-1"
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>{showMultiBoardBuilder ? 'ম্যাট্রিক্স লুকান' : '🎯 মাল্টি-বোর্ড ম্যাট্রিক্স বিল্ডার'}</span>
                  </button>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder='যেমন: "ঢাকা ২৫ থেকে ২০টি, কুমিল্লা ২২ থেকে ১২টি, যশোর ১৩ থেকে ১৮টি মোট ৫০টি এমসিকিউ দাও"'
                    className="w-full p-3 rounded-2xl border border-indigo-500/40 bg-slate-800/90 text-slate-100 text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                  {topic && (
                    <button
                      type="button"
                      onClick={() => setTopic('')}
                      className="absolute right-3 top-3 text-slate-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Quick Multi-Board Prompt Chips */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[11px] text-slate-400 font-bold">কুইক প্রম্পট কমান্ড:</span>
                  {[
                    'ঢাকা ২৫ থেকে ২০টি, কুমিল্লা ২২ থেকে ১২টি, যশোর ১৩ থেকে ১৮টি মোট ৫০টি এমসিকিউ দাও',
                    'ঢাকা ২০২৫ থেকে ১৫টি এবং রাজশাহী ২০২৪ থেকে ১০টি MCQ দাও',
                    'চট্টগ্রাম ২৪ থেকে ১০টি, বরিশাল ২৩ থেকে ৮টি, সিলেট ২৫ থেকে ১২টি মোট ৩০টি নৈর্ব্যক্তিক'
                  ].map((preset, pIdx) => (
                    <button
                      key={pIdx}
                      type="button"
                      onClick={() => setTopic(preset)}
                      className="px-2.5 py-1 rounded-lg bg-indigo-950/60 border border-indigo-500/30 hover:bg-indigo-900/80 hover:border-indigo-400 text-indigo-200 text-[10px] font-bold transition-all truncate max-w-xs"
                      title={preset}
                    >
                      ⚡ {preset.slice(0, 32)}...
                    </button>
                  ))}
                </div>

                {/* Live Real-Time Multi-Board Distribution Preview Banner */}
                {parsedPromptDist && parsedPromptDist.distributions && (
                  <div className="p-3.5 rounded-2xl bg-gradient-to-r from-indigo-950/80 via-purple-950/80 to-slate-900 border border-indigo-400/50 shadow-md shadow-indigo-500/10 animate-in fade-in space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-black text-indigo-300 flex items-center space-x-1.5">
                        <Sparkles className="w-4 h-4 text-amber-300" />
                        <span>শনাক্তকৃত মাল্টি-বোর্ড ডিস্ট্রিবিউশন (Auto-Parsed Distribution):</span>
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-black">
                        মোট {parsedPromptDist.totalCount}টি প্রশ্ন
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {parsedPromptDist.distributions.map((d, dIdx) => (
                        <span
                          key={dIdx}
                          className="px-3 py-1 rounded-xl bg-indigo-600/30 border border-indigo-400/40 text-indigo-100 text-xs font-black flex items-center space-x-1.5 shadow-sm"
                        >
                          <Award className="w-3 h-3 text-amber-400" />
                          <span>{d.board} '{d.yearShort}</span>
                          <span className="px-1.5 py-0.2 rounded bg-indigo-500 text-white font-black text-[10px]">
                            {d.count}টি
                          </span>
                          <span className="text-[10px] text-indigo-300 font-mono">[{d.badge}]</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Visual Multi-Board Matrix Builder (Interactive Rows) */}
                {showMultiBoardBuilder && (
                  <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-3 animate-in fade-in">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-200">
                      <span>🎯 ম্যানুয়াল মাল্টি-বোর্ড ও সাল ডিস্ট্রিবিউশন বিল্ডার:</span>
                      <button
                        type="button"
                        onClick={() => {
                          const newId = manualDistributions.length + 1;
                          setManualDistributions([...manualDistributions, { id: newId, board: 'রাজশাহী', examYear: '2024', count: 10 }]);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold flex items-center space-x-1"
                      >
                        <Plus className="w-3 h-3" />
                        <span>+ নতুন বোর্ড যোগ করুন</span>
                      </button>
                    </div>

                    <div className="space-y-2">
                      {manualDistributions.map((row, rIdx) => (
                        <div key={row.id || rIdx} className="grid grid-cols-12 gap-2 items-center text-xs bg-slate-900/70 p-2.5 rounded-xl border border-slate-700/60">
                          {/* Board */}
                          <div className="col-span-4">
                            <select
                              value={row.board}
                              onChange={(e) => {
                                const copy = [...manualDistributions];
                                copy[rIdx].board = e.target.value;
                                setManualDistributions(copy);
                              }}
                              className="w-full p-2 rounded-lg bg-slate-800 border border-slate-600 text-white font-bold text-xs"
                            >
                              {['ঢাকা', 'চট্টগ্রাম', 'রাজশাহী', 'কুমিল্লা', 'যশোর', 'বরিশাল', 'সিলেট', 'দিনাজপুর', 'ময়মনসিংহ', 'মাদ্রাসা', 'কারিগরি', 'সকল বোর্ড'].map(b => (
                                <option key={b} value={b}>{b} বোর্ড</option>
                              ))}
                            </select>
                          </div>

                          {/* Year */}
                          <div className="col-span-3">
                            <select
                              value={row.examYear}
                              onChange={(e) => {
                                const copy = [...manualDistributions];
                                copy[rIdx].examYear = e.target.value;
                                setManualDistributions(copy);
                              }}
                              className="w-full p-2 rounded-lg bg-slate-800 border border-slate-600 text-white font-bold text-xs"
                            >
                              {['2026', '2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018', '2015', '2013'].map(y => (
                                <option key={y} value={y}>{y} সাল</option>
                              ))}
                            </select>
                          </div>

                          {/* Count */}
                          <div className="col-span-3 flex items-center space-x-1">
                            <input
                              type="number"
                              min="1"
                              max="50"
                              value={row.count}
                              onChange={(e) => {
                                const copy = [...manualDistributions];
                                copy[rIdx].count = parseInt(e.target.value, 10) || 1;
                                setManualDistributions(copy);
                              }}
                              className="w-full p-2 rounded-lg bg-slate-800 border border-slate-600 text-white font-bold text-xs text-center"
                            />
                            <span className="text-[11px] text-slate-400">টি</span>
                          </div>

                          {/* Delete */}
                          <div className="col-span-2 flex justify-end">
                            <button
                              type="button"
                              onClick={() => {
                                if (manualDistributions.length > 1) {
                                  setManualDistributions(manualDistributions.filter((_, i) => i !== rIdx));
                                }
                              }}
                              className="p-1.5 text-rose-400 hover:text-rose-300 rounded-lg"
                              title="মুছে ফেলুন"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1">
                      <span className="text-slate-400">
                        মোট নির্ধারিত: <strong className="text-emerald-400">{manualDistributions.reduce((sum, d) => sum + (Number(d.count) || 0), 0)}টি MCQ</strong>
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const summary = manualDistributions.map(d => `${d.board} ${d.examYear.slice(-2)} থেকে ${d.count}টি`).join(', ') + ` মোট ${manualDistributions.reduce((s, d) => s + Number(d.count), 0)}টি এমসিকিউ`;
                          setTopic(summary);
                        }}
                        className="text-[11px] text-indigo-400 hover:text-indigo-300 font-bold underline"
                      >
                        প্রম্পট বক্সে প্রয়োগ করুন
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Question Count Selector & Notes */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-start">
                <div className="sm:col-span-4 space-y-1.5">
                  <label className="block text-xs font-bold text-slate-300">প্রশ্নের সংখ্যা (Count)</label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[5, 10, 15, 20, 25, 30].map((cnt) => (
                      <button
                        key={cnt}
                        type="button"
                        onClick={() => setQuestionCount(cnt)}
                        className={`p-2 rounded-xl text-xs font-black transition-all ${
                          questionCount === cnt
                            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        {cnt}টি
                      </button>
                    ))}
                  </div>
                </div>

                <div className="sm:col-span-8 space-y-1">
                  <label className="block text-xs font-bold text-slate-300">
                    হ্যান্ডনোট / অনুচ্ছেদ টেক্সট পেস্ট করুন (ঐচ্ছিক - Study Notes)
                  </label>
                  <textarea
                    rows={2}
                    value={chapterNotes}
                    onChange={(e) => setChapterNotes(e.target.value)}
                    placeholder="পাঠ্যবইয়ের অনুচ্ছেদ বা বিশেষ তথ্য পেস্ট করলে এআই হুবহু ওই বিষয় থেকে প্রশ্ন তৈরি করবে..."
                    className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-800/90 text-slate-200 text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Trigger Button */}
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  disabled={generating}
                  onClick={handleGenerate}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs sm:text-sm font-black shadow-lg shadow-indigo-600/30 flex items-center space-x-2 transition-all transform active:scale-95 disabled:opacity-50"
                >
                  {generating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{generationStep || 'এআই প্রসেস হচ্ছে...'}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>এআই দিয়ে প্রশ্ন তৈরি করুন (Generate MCQs)</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Generated Questions List (Review & Edit Section) */}
          {generatedQuestions.length > 0 && (
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-black text-white">
                    📝 জেনারেটকৃত প্রশ্নের তালিকা ({generatedQuestions.length}টি প্রশ্ন)
                  </span>
                  <span className="text-xs text-slate-400">
                    (প্রতিটি প্রশ্ন সম্পাদনা ও সঠিক উত্তর পরিবর্তনযোগ্য)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleAddNewQuestion}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-400 font-bold text-xs flex items-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>নতুন প্রশ্ন যোগ করুন</span>
                </button>
              </div>

              <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1.5">
                {generatedQuestions.map((q, qIdx) => (
                  <div
                    key={q.id || qIdx}
                    className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-3 relative group hover:border-slate-700 transition-colors"
                  >
                    {/* Question Header with Academic Board-Year Badge */}
                    <div className="flex items-center justify-between gap-2 pb-1 border-b border-slate-800/60">
                      <div className="flex items-center space-x-2">
                        <span className="px-2.5 py-0.5 rounded-lg bg-indigo-500/20 text-indigo-300 text-xs font-black shrink-0">
                          Q{qIdx + 1}
                        </span>
                        {/* Prominent Academic Badge */}
                        <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-blue-900/60 to-indigo-900/60 border border-blue-400/50 text-blue-200 text-[11px] font-black shadow-xs flex items-center space-x-1">
                          <Award className="w-3 h-3 text-amber-300" />
                          <span>{q.badge || formatAcademicBadge(q.board, q.examYear, 'MCQ')}</span>
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveQuestion(qIdx)}
                        className="p-1.5 rounded-xl text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 transition-colors"
                        title="প্রশ্নটি মুছে ফেলুন"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-start justify-between gap-2 pt-1">
                      <input
                        type="text"
                        value={q.questionBn}
                        onChange={(e) => handleQuestionTextChange(qIdx, e.target.value)}
                        placeholder="প্রশ্নের মূল বাক্য লিখুন..."
                        className="flex-1 p-2 rounded-xl bg-slate-800/80 border border-slate-700 text-xs sm:text-sm font-bold text-white focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveQuestion(qIdx)}
                        className="p-2 rounded-xl text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 transition-colors"
                        title="প্রশ্নটি মুছে ফেলুন"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Options Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {q.options.map((opt, optIdx) => {
                        const isCorrect = q.correctOptionIndex === optIdx;
                        return (
                          <div
                            key={optIdx}
                            className={`flex items-center space-x-2 p-2 rounded-xl border transition-all ${
                              isCorrect
                                ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-200'
                                : 'bg-slate-800/60 border-slate-700/60 text-slate-300'
                            }`}
                          >
                            <button
                              type="button"
                              onClick={() => handleCorrectAnswerChange(qIdx, optIdx)}
                              className={`w-6 h-6 rounded-lg text-[11px] font-black flex items-center justify-center shrink-0 transition-all ${
                                isCorrect
                                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30 ring-2 ring-emerald-400/40'
                                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                              }`}
                              title={isCorrect ? 'এটি সঠিক উত্তর' : 'সঠিক উত্তর হিসেবে চিহ্নিত করুন'}
                            >
                              {String.fromCharCode(65 + optIdx)}
                            </button>
                            <input
                              type="text"
                              value={opt}
                              onChange={(e) => handleOptionTextChange(qIdx, optIdx, e.target.value)}
                              placeholder={`অপশন ${String.fromCharCode(65 + optIdx)}...`}
                              className="flex-1 bg-transparent text-xs font-semibold focus:outline-none"
                            />
                            {isCorrect && (
                              <Check className="w-4 h-4 text-emerald-400 shrink-0 mr-1" />
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Explanation */}
                    <div className="flex items-center space-x-2 text-xs bg-slate-950/40 p-2.5 rounded-xl border border-slate-800">
                      <span className="text-slate-400 font-bold shrink-0">ব্যাখ্যা:</span>
                      <input
                        type="text"
                        value={q.explanation || ''}
                        onChange={(e) => handleExplanationChange(qIdx, e.target.value)}
                        placeholder="সঠিক উত্তরের স্বপক্ষে যুক্তি বা ব্যাখ্যা..."
                        className="flex-1 bg-transparent text-[11px] text-slate-300 focus:outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-5 bg-slate-900 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-400">
            {generatedQuestions.length > 0 ? (
              <span className="text-emerald-400 font-bold">
                ✓ মোট {generatedQuestions.length}টি প্রশ্ন প্রস্তুত
              </span>
            ) : (
              <span>এআই দিয়ে প্রশ্ন তৈরি করে সরাসরি পরীক্ষায় যুক্ত করুন</span>
            )}
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 font-bold text-xs transition-colors"
            >
              বাতিল (Cancel)
            </button>
            <button
              type="button"
              disabled={generatedQuestions.length === 0}
              onClick={handleApplyToExam}
              className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs shadow-lg shadow-emerald-600/20 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>প্রশ্নের তালিকায় যুক্ত করুন (Apply Questions)</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
