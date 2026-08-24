import React, { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { examAPI, materialAPI, googleDriveAPI } from '../../services/api';
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

  // Generator State
  const [topic, setTopic] = useState('');
  const [subject, setSubject] = useState('পদার্থবিজ্ঞান (Physics)');
  const [classGrade, setClassGrade] = useState('১০ম শ্রেণি (Class 10)');
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

  useEffect(() => {
    if (isOpen) {
      materialAPI.getSourceMaterials()
        .then(res => {
          if (res && res.data) setSourceMaterials(res.data);
        })
        .catch(err => console.error('Failed to load source materials in MCQ generator:', err));
    }
  }, [isOpen]);

  // Filter source materials strictly by the selected subject
  const filteredSourceMaterials = useMemo(() => {
    if (!subject) return sourceMaterials;

    const cleanSub = subject.toLowerCase().trim();

    return sourceMaterials.filter(mat => {
      const title = (mat.title || mat.titleBn || '').toLowerCase();
      const cat = (mat.category || '').toLowerCase();
      const subName = (mat.subjectName || '').toLowerCase();
      const fileName = (mat.fileName || '').toLowerCase();

      // Helper: check if keywords exist in metadata
      const matchesAny = (terms) => {
        return terms.some(t =>
          title.includes(t) || cat.includes(t) || subName.includes(t) || fileName.includes(t)
        );
      };

      // 1. Higher Math vs General Math distinction
      if (cleanSub.includes('উচ্চতর') || cleanSub.includes('higher')) {
        return matchesAny(['উচ্চতর', 'higher', 'higher_math', 'highermath', 'ম্যাট্রিক্স', 'ভেক্টর', 'স্থানাঙ্ক', 'ত্রিকোণমিতিক']);
      }

      if (cleanSub.includes('গণিত') || cleanSub.includes('math')) {
        // General Math: must NOT be higher math
        const isHigher = matchesAny(['উচ্চতর', 'higher', 'higher_math', 'highermath']);
        if (isHigher) return false;
        return matchesAny(['সাধারণ গণিত', 'গণিত', 'math', 'general_math', 'generalmath', 'পাটিগণিত', 'বীজগণিত', 'জ্যামিতি', 'পরিসংখ্যান', 'সেট']);
      }

      // 2. Physics
      if (cleanSub.includes('পদার্থ') || cleanSub.includes('physics')) {
        return matchesAny(['পদার্থ', 'পদার্থবিজ্ঞান', 'physics', 'গতিবিদ্যা', 'বলবিদ্যা', 'কাজ ও শক্তি', 'আলো', 'তরঙ্গ', 'তড়িৎ', 'তাপ']);
      }

      // 3. Chemistry
      if (cleanSub.includes('রসায়ন') || cleanSub.includes('রসায়ন') || cleanSub.includes('chemistry')) {
        return matchesAny(['রসায়ন', 'রসায়ন', 'chemistry', 'পর্যায় সারণি', 'মোল', 'বন্ধন', 'যোজ্যতা', 'অম্ল', 'ক্ষারক']);
      }

      // 4. Biology
      if (cleanSub.includes('জীব') || cleanSub.includes('biology')) {
        return matchesAny(['জীব', 'জীববিজ্ঞান', 'biology', 'উদ্ভিদ', 'প্রাণী', 'কোষ', 'টিস্যু', 'বংশগতি']);
      }

      // 5. ICT
      if (cleanSub.includes('আইসিটি') || cleanSub.includes('ict') || cleanSub.includes('তথ্য')) {
        return matchesAny(['তথ্য', 'ict', 'তথ্য ও যোগাযোগ', 'কম্পিউটার', 'প্রোগ্রামিং', 'এইচটিএমএল', 'ডাটাবেস']);
      }

      // 6. Bangla
      if (cleanSub.includes('বাংলা') || cleanSub.includes('bangla') || cleanSub.includes('সাহিত্য') || cleanSub.includes('ব্যাকরণ')) {
        return matchesAny(['বাংলা', 'bangla', 'সাহিত্য', 'ব্যাকরণ', 'নির্মিতি', 'গদ্য', 'পদ্য']);
      }

      // 7. English
      if (cleanSub.includes('english') || cleanSub.includes('ইংরেজি')) {
        return matchesAny(['english', 'ইংরেজি', 'grammar', 'paragraph', 'composition', 'vocabulary']);
      }

      // 8. General Science / Primary Science
      if (cleanSub.includes('বিজ্ঞান') || cleanSub.includes('science')) {
        return matchesAny(['বিজ্ঞান', 'science', 'প্রাথমিক বিজ্ঞান', 'সাধারণ বিজ্ঞান']);
      }

      // 9. BGS / Social
      if (cleanSub.includes('বিশ্বপরিচয়') || cleanSub.includes('bgs') || cleanSub.includes('সমাজ')) {
        return matchesAny(['বিশ্বপরিচয়', 'bgs', 'বাংলাদেশ ও বিশ্বপরিচয়', 'সমাজ']);
      }

      // Generic fallback: check main subject word without parentheses
      const mainWord = cleanSub.split('(')[0].replace(/[^\u0980-\u09FFa-zA-Z]/g, ' ').trim();
      if (mainWord.length > 2) {
        return matchesAny([mainWord]);
      }

      return true;
    });
  }, [sourceMaterials, subject]);

  // Reset selected source material if it no longer matches the selected subject
  useEffect(() => {
    if (selectedSourceMaterialId) {
      const isStillValid = filteredSourceMaterials.some(m => String(m.id) === String(selectedSourceMaterialId));
      if (!isStillValid) {
        setSelectedSourceMaterialId('');
      }
    }
  }, [subject, filteredSourceMaterials]);

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
        subject,
        classGrade,
        topic: topic.trim() || (selectedDriveFiles[0]?.name ? selectedDriveFiles[0].name.replace(/\.[^/.]+$/, '') : 'গুগল ড্রাইভ স্টাডি মেটেরিয়াল'),
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

      const res = await examAPI.generateMCQs({
        topic: topic.trim(),
        subject,
        classGrade,
        difficulty,
        questionCount: Number(questionCount),
        chapterNotes: chapterNotes.trim(),
        sourceMaterialId: selectedSourceMaterialId ? Number(selectedSourceMaterialId) : null
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
          explanation: q.explanation || 'সঠিক উত্তর।'
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
                {/* Subject */}
                <div>
                  <label className="block font-bold text-slate-300 mb-1">পাঠ্য বিষয় (Subject)</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-800 text-slate-100 font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    {subjectPresets.map((sp) => (
                      <option key={sp} value={sp}>
                        {sp}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Class / Grade */}
                <div>
                  <label className="block font-bold text-slate-300 mb-1">শ্রেণি / গ্রেড (Class)</label>
                  <select
                    value={classGrade}
                    onChange={(e) => setClassGrade(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-800 text-slate-100 font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <optgroup label="👶 প্রাক-প্রাথমিক (Pre-Primary)">
                      <option value="প্লে গ্রুপ (Play)">প্লে গ্রুপ (Play)</option>
                      <option value="নার্সারি (Nursery)">নার্সারি (Nursery)</option>
                      <option value="কেজি (KG)">কেজি (KG)</option>
                    </optgroup>
                    <optgroup label="🎒 প্রাথমিক (Primary ১-৫ম)">
                      <option value="১ম শ্রেণি (Class 1)">১ম শ্রেণি (Class 1)</option>
                      <option value="২য় শ্রেণি (Class 2)">২য় শ্রেণি (Class 2)</option>
                      <option value="৩য় শ্রেণি (Class 3)">৩য় শ্রেণি (Class 3)</option>
                      <option value="৪র্থ শ্রেণি (Class 4)">৪র্থ শ্রেণি (Class 4)</option>
                      <option value="৫ম শ্রেণি (Class 5)">৫ম শ্রেণি (Class 5)</option>
                    </optgroup>
                    <optgroup label="📚 নিম্ন মাধ্যমিক (Junior Secondary ৬-৮ম)">
                      <option value="৬ষ্ঠ শ্রেণি (Class 6)">৬ষ্ঠ শ্রেণি (Class 6)</option>
                      <option value="৭ম শ্রেণি (Class 7)">৭ম শ্রেণি (Class 7)</option>
                      <option value="৮ম শ্রেণি (Class 8 / JSC)">৮ম শ্রেণি (Class 8 / JSC)</option>
                    </optgroup>
                    <optgroup label="🎯 মাধ্যমিক (Secondary ৯-১০ম / SSC)">
                      <option value="৯ম শ্রেণি (Class 9)">৯ম শ্রেণি (Class 9)</option>
                      <option value="১০ম শ্রেণি (Class 10 / SSC)">১০ম শ্রেণি (Class 10 / SSC)</option>
                      <option value="এসএসসি পরীক্ষার্থী (SSC Candidate)">এসএসসি পরীক্ষার্থী (SSC Candidate)</option>
                    </optgroup>
                    <optgroup label="🎓 উচ্চ মাধ্যমিক (HSC একাদশ-দ্বাদশ)">
                      <option value="একাদশ শ্রেণি (11th - HSC 1st Year)">একাদশ শ্রেণি (11th - HSC 1st Year)</option>
                      <option value="দ্বাদশ শ্রেণি (12th - HSC 2nd Year)">দ্বাদশ শ্রেণি (12th - HSC 2nd Year)</option>
                      <option value="এইচএসসি পরীক্ষার্থী (HSC Candidate)">এইচএসসি পরীক্ষার্থী (HSC Candidate)</option>
                    </optgroup>
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
                  {filteredSourceMaterials.map((mat) => (
                    <option key={mat.id} value={mat.id}>
                      📄 {mat.title} ({mat.subjectName || mat.category || 'নোট'} • {mat.content_text?.length || 0} অক্ষর)
                    </option>
                  ))}
                </select>
                {filteredSourceMaterials.length === 0 && (
                  <p className="text-[10px] text-amber-400/90 mt-1 italic">
                    ⚠️ {subject.split('(')[0].trim()} বিষয়ের কোনো নির্দিষ্ট ফাইল পাওয়া যায়নি। সাধারণ কারিকুলাম সিলেবাস থেকে প্রশ্ন তৈরি হবে।
                  </p>
                )}
              </div>

              {/* Topic Input */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  অধ্যায় বা টপিকের নাম (Chapter / Topic) <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="যেমন: গতির সমীকরণ ও বল, কাজ শক্তি ও ক্ষমতা, পর্যায় সারণি, কোষ বিভাজন..."
                  className="w-full p-3 rounded-2xl border border-slate-700 bg-slate-800/90 text-slate-100 text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
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
                    <div className="flex items-start justify-between gap-2">
                      <span className="px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 text-xs font-black shrink-0">
                        Q{qIdx + 1}
                      </span>
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
