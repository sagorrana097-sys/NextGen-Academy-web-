import React, { useState } from 'react';
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  HelpCircle,
  Copy,
  Layers,
  ArrowRight,
  RefreshCw,
  Check,
  X,
  FileCheck,
  ChevronDown,
  ChevronUp,
  Edit,
  Trash2,
  ExternalLink,
  Info
} from 'lucide-react';
import api from '../../../services/api';

export default function ManualQuestionUploadView({ onImportSuccess, onNavigateToBank }) {
  // Form State
  const [formData, setFormData] = useState({
    classId: '',
    subjectId: '',
    board: 'ঢাকা',
    year: '2026',
    chapter: '',
    topic: '',
    questionType: 'MCQ'
  });

  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStep, setUploadStep] = useState('IDLE'); // 'IDLE' | 'UPLOADING' | 'PARSING' | 'REVIEW' | 'IMPORTING' | 'SUCCESS'
  const [errorMessage, setErrorMessage] = useState(null);

  // Parsed Candidates for Review
  const [candidateQuestions, setCandidateQuestions] = useState([]);
  const [selectedIndices, setSelectedIndices] = useState(new Set());
  const [parseStats, setParseStats] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  const [importResult, setImportResult] = useState(null);

  // Available metadata options
  const classesList = [
    { id: '6', name: 'ষষ্ঠ শ্রেণি (Class 6)' },
    { id: '7', name: 'সপ্তম শ্রেণি (Class 7)' },
    { id: '8', name: 'অষ্টম শ্রেণি (Class 8)' },
    { id: '9', name: '৯ম শ্রেণি (Class 9)' },
    { id: '10', name: '১০ম শ্রেণি (Class 10)' },
    { id: '11', name: 'এসএসসি (SSC Exam)' },
    { id: '12', name: 'এইচএসসি (HSC Exam)' }
  ];

  const subjectsList = [
    { id: '1', name: 'পদার্থবিজ্ঞান (Physics)' },
    { id: '2', name: 'রসায়ন (Chemistry)' },
    { id: '3', name: 'উচ্চতর গণিত (Higher Math)' },
    { id: '4', name: 'জীববিজ্ঞান (Biology)' },
    { id: '5', name: 'সাধারণ গণিত (General Math)' },
    { id: '6', name: 'তথ্য ও যোগাযোগ প্রযুক্তি (ICT)' },
    { id: '7', name: 'ইংরেজি (English)' },
    { id: '8', name: 'বাংলা (Bangla)' }
  ];

  const boardsList = [
    'ঢাকা', 'রাজশাহী', 'কুমিল্লা', 'যশোর', 'চট্টগ্রাম', 'বরিশাল', 'সিলেট', 'দিনাজপুর', 'ময়মনসিংহ', 'মাদ্রাসা', 'কারিগরি', 'ক্যাডেট কলেজ', 'শীর্ষস্থানীয় কলেজ', 'সাধারণ/সকল বোর্ড'
  ];

  const yearsList = ['2026', '2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018'];

  const questionTypes = [
    { id: 'MCQ', name: 'বহুনির্বাচনী প্রশ্ন (MCQ)', desc: 'স্বয়ংক্রিয়ভাবে প্রতি প্রশ্ন ও অপশন আলাদা রেকর্ড হিসেবে যুক্ত হবে' },
    { id: 'CQ', name: 'সৃজনশীল প্রশ্ন (CQ)', desc: 'উদ্দীপক ও ক, খ, গ, ঘ উপপ্রশ্নসমূহ অক্ষত সংরক্ষিত থাকবে' },
    { id: 'SQ', name: 'সংক্ষিপ্ত প্রশ্ন (Short Question)', desc: 'জ্ঞানমূলক ও অনুধাবনমূলক সংক্ষিপ্ত প্রশ্ন' },
    { id: 'SHEET', name: 'লেকচার শিট (Lecture Sheet)', desc: 'অধ্যায়ভিত্তিক পূর্ণাঙ্গ নোট ও শিট' },
    { id: 'SUGGESTION', name: 'স্পেশাল সাজেশন (Suggestion)', desc: 'বোর্ড ও পরীক্ষার স্পেশাল সাজেশন' },
    { id: 'STUDY_MATERIAL', name: 'সাধারণ স্টাডি ম্যাটেরিয়াল', desc: 'সহায়ক পাঠ্য বিষয়বস্তু' }
  ];

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(Array.from(e.target.files));
      setErrorMessage(null);
    }
  };

  // Upload & Trigger Safe Parser Pipeline
  const handleUploadAndParse = async (e) => {
    e.preventDefault();
    if (files.length === 0) {
      setErrorMessage('অনুগ্রহ করে অন্তত একটি ফাইল নির্বাচন করুন।');
      return;
    }

    setIsUploading(true);
    setUploadStep('UPLOADING');
    setUploadProgress(20);
    setErrorMessage(null);

    try {
      const allExtractedCandidates = [];
      let totalParsed = 0;

      for (let fIdx = 0; fIdx < files.length; fIdx++) {
        const file = files[fIdx];
        const uploadForm = new FormData();
        uploadForm.append('file', file);
        uploadForm.append('title', file.name.replace(/\.[^/.]+$/, ''));
        uploadForm.append('titleBn', file.name.replace(/\.[^/.]+$/, ''));
        uploadForm.append('classId', formData.classId || '9');
        uploadForm.append('subjectId', formData.subjectId || '1');
        uploadForm.append('board', formData.board);
        uploadForm.append('examYear', formData.year);
        uploadForm.append('chapter', formData.chapter || 'সাধারণ');
        uploadForm.append('topic', formData.topic || 'সাধারণ');
        uploadForm.append('questionType', formData.questionType);

        // 1. Upload to persistent Google Drive pipeline
        setUploadProgress(40 + Math.round((fIdx / files.length) * 30));
        const uploadRes = await api.post('/materials/upload', uploadForm, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        const materialData = uploadRes.data?.data;
        const materialId = materialData?.id;
        const extractedText = materialData?.extractedContent?.text || '';

        // 2. Parse MCQs from extracted text representation
        setUploadStep('PARSING');
        setUploadProgress(80);

        const parseRes = await api.post('/questions/parse-document', {
          rawText: extractedText,
          materialId,
          metadata: {
            classId: formData.classId || '9',
            subjectId: formData.subjectId || '1',
            board: formData.board,
            year: formData.year,
            chapter: formData.chapter,
            topic: formData.topic,
            questionType: formData.questionType,
            sourceMaterialId: materialId,
            sourceFileName: file.name,
            googleDriveFileId: materialData?.googleDriveFileId,
            fileUrl: materialData?.fileUrl
          }
        });

        if (parseRes.data?.data?.questions) {
          allExtractedCandidates.push(...parseRes.data.data.questions);
          totalParsed += parseRes.data.data.questions.length;
        }
      }

      setCandidateQuestions(allExtractedCandidates);
      // Select all by default for convenience
      setSelectedIndices(new Set(allExtractedCandidates.map((_, idx) => idx)));

      const stats = {
        total: allExtractedCandidates.length,
        approved: allExtractedCandidates.filter(q => q.status === 'APPROVED').length,
        pending: allExtractedCandidates.filter(q => q.status === 'PENDING_REVIEW' || q.status === 'PARSER_REVIEW_REQUIRED').length,
        duplicates: allExtractedCandidates.filter(q => q.duplicateStatus !== 'UNIQUE').length
      };
      setParseStats(stats);
      setUploadStep('REVIEW');
      setUploadProgress(100);
    } catch (err) {
      console.error('Upload & parsing failed:', err);
      setErrorMessage(err.response?.data?.error?.message || err.message || 'ফাইল প্রসেসিং ব্যর্থ হয়েছে।');
      setUploadStep('IDLE');
    } finally {
      setIsUploading(false);
    }
  };

  // Toggle Single Selection
  const toggleSelect = (index) => {
    const next = new Set(selectedIndices);
    if (next.has(index)) next.delete(index);
    else next.add(index);
    setSelectedIndices(next);
  };

  // Select All / Deselect All
  const toggleSelectAll = () => {
    if (selectedIndices.size === candidateQuestions.length) {
      setSelectedIndices(new Set());
    } else {
      setSelectedIndices(new Set(candidateQuestions.map((_, idx) => idx)));
    }
  };

  // Edit Candidate Question inline
  const updateCandidate = (index, field, value) => {
    setCandidateQuestions(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      if (field === 'answer' && value) {
        updated[index].status = 'APPROVED';
      }
      return updated;
    });
  };

  // Update specific option
  const updateOptionText = (qIndex, optKey, text) => {
    setCandidateQuestions(prev => {
      const updated = [...prev];
      const q = { ...updated[qIndex] };
      q.options = q.options.map(o => o.key === optKey ? { ...o, text } : o);
      updated[qIndex] = q;
      return updated;
    });
  };

  // Bulk Import Execution
  const handleBulkImport = async () => {
    const selectedQuestions = candidateQuestions.filter((_, idx) => selectedIndices.has(idx));
    if (selectedQuestions.length === 0) {
      setErrorMessage('অন্তত একটি প্রশ্ন নির্বাচন করুন।');
      return;
    }

    setIsUploading(true);
    setUploadStep('IMPORTING');

    try {
      const res = await api.post('/questions/bulk-import', {
        questions: selectedQuestions,
        autoGroupFamilies: true
      });

      setImportResult(res.data?.data);
      setUploadStep('SUCCESS');
      if (onImportSuccess) onImportSuccess();
    } catch (err) {
      console.error('Bulk import error:', err);
      setErrorMessage(err.response?.data?.error?.message || err.message || 'প্রশ্ন ইমপোর্ট ব্যর্থ হয়েছে।');
      setUploadStep('REVIEW');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center space-x-2 text-indigo-400 font-bold text-xs uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>NextGen Smart Question Bank</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white">
            Manual Question & Study Material Upload
          </h2>
          <p className="text-slate-400 text-xs md:text-sm mt-1">
            বোর্ড ও পরীক্ষার প্রশ্ন সংবলিত Word/PDF ফাইল আপলোড করুন। সিস্টেম স্বয়ংক্রিয়ভাবে ১০০+ MCQ আলাদা করে প্রশ্ন ব্যাংকে সাজিয়ে দেবে।
          </p>
        </div>

        {uploadStep === 'REVIEW' && (
          <div className="flex items-center space-x-3">
            <button
              onClick={() => { setUploadStep('IDLE'); setFiles([]); }}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition"
            >
              নতুন ফাইল আপলোড
            </button>
            <button
              onClick={handleBulkImport}
              disabled={selectedIndices.size === 0 || isUploading}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs shadow-lg shadow-emerald-600/30 flex items-center space-x-2 transition active:scale-95 disabled:opacity-50"
            >
              <FileCheck className="w-4 h-4" />
              <span>নির্বাচিত {selectedIndices.size}টি প্রশ্ন ইমপোর্ট করুন</span>
            </button>
          </div>
        )}
      </div>

      {/* ERROR BANNER */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
          <button onClick={() => setErrorMessage(null)} className="text-rose-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 2. UPLOAD FORM VIEW (IDLE / UPLOADING / PARSING) */}
      {(uploadStep === 'IDLE' || uploadStep === 'UPLOADING' || uploadStep === 'PARSING') && (
        <form onSubmit={handleUploadAndParse} className="space-y-6">
          {/* METADATA GRID */}
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-6 shadow-xl">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              <span>একাডেমিক তথ্য ও প্রশ্নের ধরন নির্ধারণ করুন</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              {/* Class */}
              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold">শ্রেণি (Class) *</label>
                <select
                  value={formData.classId}
                  onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
                  required
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:border-indigo-500 focus:outline-none"
                >
                  <option value="">শ্রেণি নির্বাচন করুন</option>
                  {classesList.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              {/* Subject */}
              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold">বিষয় (Subject) *</label>
                <select
                  value={formData.subjectId}
                  onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
                  required
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:border-indigo-500 focus:outline-none"
                >
                  <option value="">বিষয় নির্বাচন করুন</option>
                  {subjectsList.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>

              {/* Board */}
              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold">বোর্ড / উৎস (Board/Source) *</label>
                <select
                  value={formData.board}
                  onChange={(e) => setFormData({ ...formData, board: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:border-indigo-500 focus:outline-none"
                >
                  {boardsList.map(b => <option key={b} value={b}>{b} বোর্ড</option>)}
                </select>
              </div>

              {/* Year */}
              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold">পরীক্ষার সাল (Year) *</label>
                <select
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:border-indigo-500 focus:outline-none"
                >
                  {yearsList.map(y => <option key={y} value={y}>{y} সাল</option>)}
                </select>
              </div>

              {/* Chapter */}
              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold">অধ্যায় (Chapter - ঐচ্ছিক)</label>
                <input
                  type="text"
                  placeholder="যেমন: অধ্যায় ২ - গতি"
                  value={formData.chapter}
                  onChange={(e) => setFormData({ ...formData, chapter: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-600 focus:border-indigo-500 focus:outline-none"
                >
                </input>
              </div>

              {/* Topic */}
              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold">টপিক (Topic - ঐচ্ছিক)</label>
                <input
                  type="text"
                  placeholder="যেমন: ত্বরণ ও সমীকরণ"
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-600 focus:border-indigo-500 focus:outline-none"
                >
                </input>
              </div>

              {/* Question Type Selection */}
              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-slate-300 font-semibold">ম্যাটেরিয়াল / প্রশ্নের ধরন (Question Type) *</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {questionTypes.map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, questionType: type.id })}
                      className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between ${
                        formData.questionType === type.id
                          ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <span className="font-bold text-xs text-white">{type.id}</span>
                      <span className="text-[10px] text-slate-400 mt-1 line-clamp-1">{type.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 3. MULTI-FILE DROPZONE */}
          <div className="p-8 rounded-3xl bg-slate-900 border-2 border-dashed border-slate-800 hover:border-indigo-500/50 transition text-center space-y-4 shadow-xl">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shadow-inner">
              <Upload className="w-8 h-8" />
            </div>

            <div>
              <h4 className="text-base font-bold text-white">
                Word (DOCX), PDF, Text বা ইমেজ ফাইল এখানে ড্রপ করুন
              </h4>
              <p className="text-slate-400 text-xs mt-1">
                এক সাথে একাধিক ফাইল নির্বাচন করা যাবে। মূল ফাইল গুগল ড্রাইভে অক্ষত থাকবে এবং প্রশ্নসমূহ স্বয়ংক্রিয়ভাবে এক্সট্রাক্ট হবে।
              </p>
            </div>

            <div className="flex justify-center">
              <label className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 cursor-pointer transition active:scale-95 flex items-center space-x-2">
                <FileText className="w-4 h-4" />
                <span>ফাইল সিলেক্ট করুন (Choose Files)</span>
                <input
                  type="file"
                  multiple
                  accept=".docx,.doc,.pdf,.txt,.png,.jpg,.jpeg,.webp"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>

            {files.length > 0 && (
              <div className="pt-4 border-t border-slate-800 space-y-2 max-w-xl mx-auto text-left">
                <div className="text-xs font-bold text-slate-300">নির্বাচিত ফাইলসমূহ ({files.length}টি):</div>
                <div className="space-y-1.5 max-h-40 overflow-y-auto">
                  {files.map((f, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs text-slate-300">
                      <span className="font-mono truncate">{f.name}</span>
                      <span className="text-[11px] text-slate-500 shrink-0">{(f.size / (1024 * 1024)).toFixed(2)} MB</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* SUBMIT BUTTON */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={files.length === 0 || isUploading}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-sm shadow-xl shadow-indigo-600/30 flex items-center space-x-2 transition active:scale-95 disabled:opacity-50"
            >
              {isUploading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>
                    {uploadStep === 'UPLOADING' ? 'গুগল ড্রাইভে সংরক্ষণ হচ্ছে...' : 'প্রশ্ন শনাক্ত ও এক্সট্রাক্ট করা হচ্ছে...'}
                  </span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>আপলোড ও অটোমেটিক প্রশ্ন ডিটেকশন শুরু করুন</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* 3. BULK REVIEW & IMPORT SCREEN */}
      {uploadStep === 'REVIEW' && (
        <div className="space-y-6">
          {/* STATS BAR */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="text-slate-400 text-xs">মোট শনাক্তকৃত প্রশ্ন</div>
              <div className="text-2xl font-black text-white mt-1">{parseStats?.total || candidateQuestions.length}টি</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="text-emerald-400 text-xs">সঠিক উত্তরসহ প্রস্তুত</div>
              <div className="text-2xl font-black text-emerald-400 mt-1">{parseStats?.approved || 0}টি</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="text-amber-400 text-xs">উত্তর রিভিউ প্রয়োজন</div>
              <div className="text-2xl font-black text-amber-400 mt-1">{parseStats?.pending || 0}টি</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="text-indigo-400 text-xs">সম্ভাব্য ডুপ্লিকেট প্রশ্ন</div>
              <div className="text-2xl font-black text-indigo-400 mt-1">{parseStats?.duplicates || 0}টি</div>
            </div>
          </div>

          {/* ACTION BAR */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={toggleSelectAll}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition flex items-center space-x-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>{selectedIndices.size === candidateQuestions.length ? 'সব বাদ দিন (Deselect All)' : 'সব নির্বাচন করুন (Select All)'}</span>
              </button>
              <span className="text-slate-400">
                {selectedIndices.size} / {candidateQuestions.length}টি প্রশ্ন নির্বাচিত
              </span>
            </div>

            <div className="flex items-center space-x-3">
              <span className="text-slate-400 hidden sm:inline">কোনো উত্তর পরিবর্তন করতে অপশনে ক্লিক করুন</span>
            </div>
          </div>

          {/* QUESTION CARDS LIST */}
          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
            {candidateQuestions.map((q, qIdx) => {
              const isSelected = selectedIndices.has(qIdx);
              const isEditing = editingIndex === qIdx;

              return (
                <div
                  key={q.tempId || qIdx}
                  className={`p-5 rounded-3xl border transition space-y-4 ${
                    isSelected
                      ? 'bg-slate-900/90 border-slate-700 shadow-md'
                      : 'bg-slate-950/60 border-slate-800/60 opacity-60'
                  }`}
                >
                  {/* CARD HEADER */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelect(qIdx)}
                        className="w-4 h-4 rounded text-indigo-600 focus:ring-0 cursor-pointer"
                      />
                      <span className="px-2.5 py-1 rounded-lg bg-indigo-600/20 text-indigo-300 font-mono font-bold text-xs">
                        MCQ {String(qIdx + 1).padStart(3, '0')}
                      </span>

                      {/* Duplicate Status Badge */}
                      {q.duplicateStatus === 'EXACT_DUPLICATE' && (
                        <span className="px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 text-[10px] font-bold">
                          হুবহু ডুপ্লিকেট ({q.similarityScore}%)
                        </span>
                      )}
                      {q.duplicateStatus === 'LIKELY_DUPLICATE' && (
                        <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-[10px] font-bold">
                          সম্ভাব্য ডুপ্লিকেট ({q.similarityScore}%)
                        </span>
                      )}
                      {q.duplicateStatus === 'UNIQUE' && (
                        <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                          অনন্য প্রশ্ন (Unique)
                        </span>
                      )}

                      {/* Review Required Badge */}
                      {(!q.answer || q.status === 'PARSER_REVIEW_REQUIRED') && (
                        <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-[10px] font-bold flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>উত্তর দিন</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => setEditingIndex(isEditing ? null : qIdx)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                        title="সম্পাদনা করুন"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* QUESTION STEM */}
                  {isEditing ? (
                    <textarea
                      value={q.questionText}
                      onChange={(e) => updateCandidate(qIdx, 'questionText', e.target.value)}
                      rows={2}
                      className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white font-sans focus:outline-none"
                    />
                  ) : (
                    <div className="text-sm font-semibold text-white leading-relaxed whitespace-pre-wrap font-sans">
                      {q.questionText}
                    </div>
                  )}

                  {/* OPTIONS GRID */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {(q.options || []).map((opt) => {
                      const isCorrect = q.answer === opt.key;
                      return (
                        <div
                          key={opt.key}
                          onClick={() => updateCandidate(qIdx, 'answer', opt.key)}
                          className={`p-3 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
                            isCorrect
                              ? 'bg-emerald-600/20 border-emerald-500/80 text-emerald-200 font-bold shadow-md'
                              : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center space-x-2 truncate">
                            <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                              isCorrect ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                            }`}>
                              {opt.key}
                            </span>
                            {isEditing ? (
                              <input
                                type="text"
                                value={opt.text}
                                onClick={(e) => e.stopPropagation()}
                                onChange={(e) => updateOptionText(qIdx, opt.key, e.target.value)}
                                className="px-2 py-1 rounded bg-slate-900 border border-slate-700 text-xs text-white w-full"
                              />
                            ) : (
                              <span className="truncate">{opt.text}</span>
                            )}
                          </div>
                          {isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                        </div>
                      );
                    })}
                  </div>

                  {/* FOOTER METADATA */}
                  <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
                    <div className="flex items-center space-x-2">
                      <span className="text-indigo-300 font-bold">{q.board} '{String(q.year).slice(-2)}</span>
                      <span>•</span>
                      <span>{q.chapter || 'অধ্যায় সাধারণ'}</span>
                      <span>•</span>
                      <span className="font-mono text-slate-500 truncate max-w-xs">{q.sourceFileName}</span>
                    </div>

                    <div>
                      {q.answer ? (
                        <span className="text-emerald-400 font-bold">সঠিক উত্তর: {q.answer}</span>
                      ) : (
                        <span className="text-amber-400 font-bold">উত্তর নির্ধারিত নেই</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* BOTTOM SUBMIT */}
          <div className="flex justify-between items-center p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <button
              onClick={() => { setUploadStep('IDLE'); }}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
            >
              ← ফিরে যান
            </button>

            <button
              onClick={handleBulkImport}
              disabled={selectedIndices.size === 0 || isUploading}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs shadow-lg shadow-emerald-600/30 flex items-center space-x-2 transition active:scale-95 disabled:opacity-50"
            >
              <FileCheck className="w-4 h-4" />
              <span>নির্বাচিত {selectedIndices.size}টি প্রশ্ন প্রশ্ন ব্যাংকে যুক্ত করুন</span>
            </button>
          </div>
        </div>
      )}

      {/* 4. SUCCESS SCREEN */}
      {uploadStep === 'SUCCESS' && (
        <div className="p-10 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-6 shadow-2xl">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <h3 className="text-2xl font-black text-white">সফলভাবে প্রশ্ন ইমপোর্ট সম্পন্ন হয়েছে!</h3>
            <p className="text-slate-400 text-xs md:text-sm mt-1 max-w-md mx-auto">
              প্রশ্ন ব্যাংকে মোট <span className="text-emerald-400 font-bold">{importResult?.importedCount || 0}টি প্রশ্ন</span> যুক্ত করা হয়েছে এবং বোর্ড/সালের মিল অনুযায়ী ফাইনাল সাজেশন ফ্যামিলিতে যুক্ত হয়েছে।
            </p>
          </div>

          <div className="flex justify-center space-x-4">
            <button
              onClick={() => { setUploadStep('IDLE'); setFiles([]); }}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
            >
              আরও প্রশ্ন আপলোড করুন
            </button>
            <button
              onClick={onNavigateToBank}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs shadow-lg shadow-indigo-600/30 flex items-center space-x-1.5"
            >
              <span>প্রশ্ন ব্যাংক ব্রাউজ করুন</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
