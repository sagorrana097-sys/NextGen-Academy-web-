import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { examAPI } from '../../services/api';
import {
  Sparkles,
  FileText,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Save,
  X,
  Printer,
  BookOpen,
  Layers,
  HelpCircle,
  RefreshCw,
  Zap,
  Sliders,
  Award,
  GraduationCap,
  Download,
  Copy,
  PenTool,
  Image as ImageIcon,
  Columns,
  Table,
  CheckSquare,
  Calendar
} from 'lucide-react';

export default function AICQGeneratorModal({
  isOpen,
  onClose,
  allClasses = [],
  onQuestionsImported,
  prefilledClassId = '',
  prefilledSubjectId = ''
}) {
  const { lang } = useLanguage();

  // CQ Form State
  const [subject, setSubject] = useState('পদার্থবিজ্ঞান (Physics)');
  const [classGrade, setClassGrade] = useState('১০ম শ্রেণি (SSC)');
  const [chapterTopic, setChapterTopic] = useState('');
  const [difficulty, setDifficulty] = useState('MEDIUM'); // 'EASY' | 'MEDIUM' | 'HARD'
  const [questionCount, setQuestionCount] = useState(2);
  const [chapterNotes, setChapterNotes] = useState('');
  const [examTerm, setExamTerm] = useState('মডেল টেস্ট ও মূল্যায়ন পরীক্ষা ২০২৬');

  // Generation & Status
  const [generating, setGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState('');
  const [generatedCQs, setGeneratedCQs] = useState([]);
  const [engineSource, setEngineSource] = useState('');
  const [detectedStage, setDetectedStage] = useState('SECONDARY');
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Subject Presets
  const subjectPresets = [
    'পদার্থবিজ্ঞান (Physics)',
    'রসায়ন (Chemistry)',
    'উচ্চতর গণিত (Higher Math)',
    'সাধারণ গণিত (General Math)',
    'জীববিজ্ঞান (Biology)',
    'তথ্য ও যোগাযোগ প্রযুক্তি (ICT)',
    'বাংলা ১ম পত্র (সাহিত্য)',
    'বাংলা ২য় পত্র (ব্যাকরণ ও নির্মিতি)',
    'English 1st & 2nd Paper',
    'বাংলাদেশ ও বিশ্বপরিচয় (BGS)',
    'প্রাথমিক বিজ্ঞান (Primary Science)',
    'আমার বাংলা বই (প্রাথমিক)',
    'English for Today',
    'প্রাথমিক গণিত'
  ];

  // Instant Exam Terms List
  const examTermsList = [
    '১ম সাময়িক পরীক্ষা (1st Term Exam)',
    '২য় সাময়িক / অর্ধবার্ষিক পরীক্ষা (2nd Term / Half-Yearly)',
    'বার্ষিক মূল্যায়ন পরীক্ষা (Annual Exam)',
    'প্রাক-নির্বাচনী পরীক্ষা (Pre-Test Exam)',
    'নির্বাচনী ও মডেল টেস্ট (Model Test Exam)',
    'এইচএসসি স্পেশাল টেস্ট (HSC Special Test)',
    'সাপ্তাহিক মূল্যায়ন কুইজ (Weekly Assessment)'
  ];

  // Determine stage
  const isPrimaryStage = (cg) => {
    const val = (cg || classGrade).toLowerCase();
    return val.includes('প্লে') || val.includes('play') || val.includes('নার্সারি') || val.includes('nursery') ||
           val.includes('কেজি') || val.includes('kg') || val.includes('১ম') || val.includes('২য়') ||
           val.includes('৩য়') || val.includes('৪র্থ') || val.includes('৫ম') || val.includes('class 1') ||
           val.includes('class 2') || val.includes('class 3') || val.includes('class 4') || val.includes('class 5');
  };

  const handleGenerate = async (e) => {
    if (e) e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!chapterTopic.trim() && !chapterNotes.trim()) {
      setErrorMsg('অনুগ্রহ করে অধ্যায়/টপিকের নাম অথবা হ্যান্ডনোট পেস্ট করুন।');
      return;
    }

    setGenerating(true);
    const primary = isPrimaryStage(classGrade);
    setGenerationStep(primary ? 'প্রাথমিক স্তরের ভিজ্যুয়াল ও মিলকরণ প্রশ্ন ফ্রেমওয়ার্ক প্রস্তুত হচ্ছে...' : 'জেমিনাই এআই ও এনসিটিবি সৃজনশীল ফ্রেমওয়ার্ক বিশ্লেষণ হচ্ছে...');

    try {
      setTimeout(() => {
        setGenerationStep(primary ? 'ছবি দেখে লেখা, শূন্যস্থান ও কলাম মিলকরণ তৈরি হচ্ছে...' : 'বাস্তবধর্মী উদ্দীপক ও ৪টি স্তরের প্রশ্ন (ক, খ, গ, ঘ) তৈরি হচ্ছে...');
      }, 1400);

      const res = await examAPI.generateCQs({
        subject,
        classGrade,
        chapterTopic: chapterTopic.trim(),
        difficulty,
        questionCount: Number(questionCount),
        chapterNotes: chapterNotes.trim(),
        examTerm
      });

      if (res.success && Array.isArray(res.data)) {
        setGeneratedCQs(res.data);
        setEngineSource(res.source || 'GEMINI_AI');
        setDetectedStage(res.stage || (primary ? 'PRIMARY' : 'SECONDARY'));
        setSuccessMsg(res.message || `${res.data.length}টি প্রশ্ন সফলভাবে প্রস্তুত হয়েছে!`);
      } else {
        setErrorMsg(res.error?.message || 'প্রশ্ন জেনারেট করতে সমস্যা হয়েছে');
      }
    } catch (err) {
      console.error('Generate CQ error:', err);
      setErrorMsg(err.message || 'সার্ভারে সংযোগ করতে সমস্যা হয়েছে');
    } finally {
      setGenerating(false);
      setGenerationStep('');
    }
  };

  const handleStemChange = (idx, text) => {
    setGeneratedCQs(prev => {
      const copy = [...prev];
      copy[idx].stem = text;
      return copy;
    });
  };

  const handleSubQuestionChange = (cqIdx, key, field, value) => {
    setGeneratedCQs(prev => {
      const copy = [...prev];
      if (copy[cqIdx].questions && copy[cqIdx].questions[key]) {
        copy[cqIdx].questions[key][field] = value;
      }
      return copy;
    });
  };

  const handleRemoveCQ = (idx) => {
    setGeneratedCQs(prev => prev.filter((_, i) => i !== idx));
  };

  const handleAddNewCQ = () => {
    const primary = isPrimaryStage(classGrade);
    if (primary) {
      setGeneratedCQs(prev => [
        ...prev,
        {
          id: prev.length + 1,
          type: 'PRIMARY_ADAPTIVE',
          format: 'FILL_BLANKS',
          title: 'নিচের খালি জায়গায় সঠিক শব্দ বসিয়ে শূন্যস্থান পূরণ করো:',
          items: [
            { sentence: 'আমাদের মাতৃভাষার নাম ___।', word: 'বাংলা', marks: 1 },
            { sentence: 'সূর্য ___ দিকে ওঠে।', word: 'পূর্ব', marks: 1 }
          ],
          marks: 2
        }
      ]);
    } else {
      setGeneratedCQs(prev => [
        ...prev,
        {
          id: prev.length + 1,
          type: 'STANDARD_CQ',
          section: 'ক-বিভাগ',
          stem: 'নতুন উদ্দীপক বা দৃশ্যকল্প লিখুন...',
          questions: {
            ka: { text: 'জ্ঞানমূলক প্রশ্ন লিখুন...', marks: 1, answerHint: '' },
            kha: { text: 'অনুধাবনমূলক প্রশ্ন লিখুন...', marks: 2, answerHint: '' },
            ga: { text: 'প্রয়োগমূলক প্রশ্ন লিখুন...', marks: 3, answerHint: '' },
            gha: { text: 'উচ্চতর দক্ষতামূলক প্রশ্ন লিখুন...', marks: 4, answerHint: '' }
          }
        }
      ]);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const calculateTotalMarks = () => {
    if (isPrimaryStage(classGrade)) {
      return generatedCQs.reduce((acc, q) => acc + (Number(q.marks) || 4), 0);
    }
    return generatedCQs.length * 10;
  };

  const handleApply = () => {
    if (generatedCQs.length === 0) {
      alert('প্রথমে প্রশ্ন জেনারেট করুন');
      return;
    }

    if (onQuestionsImported) {
      onQuestionsImported({
        cqs: generatedCQs,
        subject,
        classGrade,
        chapterTopic,
        examTerm,
        totalMarks: calculateTotalMarks()
      });
    }

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Print CSS Style */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-cq-paper, #printable-cq-paper * {
            visibility: visible;
          }
          #printable-cq-paper {
            position: fixed;
            left: 0;
            top: 0;
            width: 100vw;
            height: 100vh;
            margin: 0;
            padding: 32px;
            background: white !important;
            color: black !important;
            z-index: 99999;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-5xl w-full shadow-2xl flex flex-col overflow-hidden text-white my-auto max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-5 bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 border-b border-slate-700/80 flex items-center justify-between no-print">
          <div className="flex items-center space-x-3.5">
            <div className="p-2.5 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/20">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base sm:text-lg font-black text-white">
                  📝 এআই প্রশ্নপত্র ও সৃজনশীল জেনারেটর (Play to Class 12)
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-black uppercase">
                  Adaptive NCTB Engine
                </span>
              </div>
              <p className="text-xs text-slate-300">
                প্লে-কেজি-প্রাথমিক ভিজ্যুয়াল ফরম্যাট থেকে শুরু করে এসএসসি ও এইচএসসি পূর্ণাঙ্গ সৃজনশীল প্রশ্ন প্রস্তুত করুন
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

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-slate-950/40">
          {/* Toast / Feedback */}
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs font-bold flex items-center space-x-2 animate-in fade-in no-print">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs font-bold flex items-center space-x-2 animate-in fade-in no-print">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{successMsg}</span>
              {engineSource && (
                <span className="ml-auto text-[10px] px-2 py-0.5 rounded-md bg-emerald-900/60 font-mono">
                  Engine: {engineSource}
                </span>
              )}
            </div>
          )}

          {/* Generator Parameters Card */}
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-sm space-y-4 no-print">
            <h4 className="font-bold text-xs text-emerald-400 uppercase tracking-wider flex items-center space-x-2">
              <Sliders className="w-4 h-4" />
              <span>শ্রেণি, বিষয় ও পরীক্ষার টার্ম নির্বাচন (Configuration)</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs">
              {/* Class / Grade with Grouped Hierarchy */}
              <div>
                <label className="block font-bold text-slate-300 mb-1">শ্রেণি / গ্রেড (Class / Level) *</label>
                <select
                  value={classGrade}
                  onChange={(e) => setClassGrade(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-800 text-slate-100 font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
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
                    <option value="১০ম শ্রেণি (SSC)">১০ম শ্রেণি (SSC)</option>
                    <option value="এসএসসি পরীক্ষার্থী (SSC Candidate)">এসএসসি পরীক্ষার্থী (SSC Candidate)</option>
                  </optgroup>
                  <optgroup label="🎓 উচ্চ মাধ্যমিক (HSC একাদশ-দ্বাদশ)">
                    <option value="একাদশ শ্রেণি (11th - HSC 1st Year)">একাদশ শ্রেণি (11th - HSC 1st Year)</option>
                    <option value="দ্বাদশ শ্রেণি (12th - HSC 2nd Year)">দ্বাদশ শ্রেণি (12th - HSC 2nd Year)</option>
                    <option value="এইচএসসি পরীক্ষার্থী (HSC Candidate)">এইচএসসি পরীক্ষার্থী (HSC Candidate)</option>
                  </optgroup>
                </select>
              </div>

              {/* Subject */}
              <div>
                <label className="block font-bold text-slate-300 mb-1">পাঠ্য বিষয় (Subject) *</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-800 text-slate-100 font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  {subjectPresets.map((sp) => (
                    <option key={sp} value={sp}>
                      {sp}
                    </option>
                  ))}
                </select>
              </div>

              {/* Exam Term */}
              <div>
                <label className="block font-bold text-slate-300 mb-1">পরীক্ষার নাম / টার্ম (Exam Term) *</label>
                <select
                  value={examTerm}
                  onChange={(e) => setExamTerm(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-800 text-amber-300 font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  {examTermsList.map((et) => (
                    <option key={et} value={et}>
                      {et}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Chapter / Topic */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs">
              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-300 mb-1">
                  অধ্যায় বা টপিকের নাম (Chapter / Topic) <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={chapterTopic}
                  onChange={(e) => setChapterTopic(e.target.value)}
                  placeholder="যেমন: কাজ, ক্ষমতা ও শক্তি, পর্যায় সারণি, ঋতুর পরিবর্তন ও পাখি, যুক্তবর্ণ..."
                  className="w-full p-3 rounded-2xl border border-slate-700 bg-slate-800/90 text-slate-100 font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">কাঠিন্যের মাত্রা (Difficulty)</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full p-3 rounded-2xl border border-slate-700 bg-slate-800 text-slate-100 font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="EASY">সহজ (Easy - Basic Standard)</option>
                  <option value="MEDIUM">মাঝারি (Medium - Board Standard)</option>
                  <option value="HARD">কঠিন (Hard - Critical Analytical)</option>
                </select>
              </div>
            </div>

            {/* Question Count Selector & Notes */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-start">
              {/* Question Count Pills */}
              <div className="sm:col-span-4 space-y-1.5">
                <label className="block text-xs font-bold text-slate-300">
                  {isPrimaryStage(classGrade) ? 'প্রশ্ন সেটের সংখ্যা' : `সৃজনশীল প্রশ্নের সংখ্যা (${questionCount * 10} নম্বর)`}
                </label>
                <div className="grid grid-cols-5 gap-1.5">
                  {[1, 2, 3, 4, 5].map((cnt) => (
                    <button
                      key={cnt}
                      type="button"
                      onClick={() => setQuestionCount(cnt)}
                      className={`p-2 rounded-xl text-xs font-black transition-all ${
                        questionCount === cnt
                          ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {cnt}টি
                    </button>
                  ))}
                </div>
              </div>

              {/* Optional Notes */}
              <div className="sm:col-span-8 space-y-1">
                <label className="block text-xs font-bold text-slate-300">
                  পাঠ্যবইয়ের অনুচ্ছেদ বা হ্যান্ডনোট পেস্ট করুন (ঐচ্ছিক)
                </label>
                <textarea
                  rows={2}
                  value={chapterNotes}
                  onChange={(e) => setChapterNotes(e.target.value)}
                  placeholder="নির্দিষ্ট কোনো উদ্দীপক, ছড়া, অনুচ্ছেদ বা গাণিতিক ডাটা পেস্ট করলে এআই হুবহু ওই প্রসঙ্গে প্রশ্ন সাজাবে..."
                  className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-800/90 text-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Generate Trigger Button */}
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                disabled={generating}
                onClick={handleGenerate}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs sm:text-sm font-black shadow-lg shadow-emerald-600/30 flex items-center space-x-2 transition-all transform active:scale-95 disabled:opacity-50"
              >
                {generating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-emerald-300" />
                    <span>{generationStep || 'প্রশ্ন প্রস্তুত হচ্ছে...'}</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 text-amber-300" />
                    <span>⚡ এআই দিয়ে প্রশ্নপত্র তৈরি করুন ({classGrade})</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* ------------------------------------------------------------------ */}
          {/* Printable Question Paper & Adaptive Layout */}
          {/* ------------------------------------------------------------------ */}
          {generatedCQs.length > 0 && (
            <div id="printable-cq-paper" className="space-y-6 pt-2">
              {/* Action Bar (Screen Only) */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/90 p-4 rounded-2xl border border-slate-800 no-print">
                <div>
                  <h4 className="font-black text-sm text-slate-100 flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>
                      প্রস্তুতকৃত প্রশ্নপত্র ({generatedCQs.length}টি আইটেম • পূর্ণমান: {calculateTotalMarks()})
                    </span>
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    {isPrimaryStage(classGrade)
                      ? 'প্রাথমিক স্তরের ভিজ্যুয়াল ও ইন্টারঅ্যাক্টিভ লেআউট। প্রিন্ট বাটনে ক্লিক করে অফিশিয়াল প্রশ্নপত্র প্রিন্ট করুন।'
                      : 'এনসিটিবি সৃজনশীল মানদণ্ডে উদ্দীপক ও ৪টি উপ-প্রশ্ন। সরাসরি সম্পাদনা ও প্রিন্ট করা যাবে।'}
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={handleAddNewCQ}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl flex items-center space-x-1 transition-all border border-slate-700"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ ম্যানুয়াল যোগ</span>
                  </button>

                  <button
                    type="button"
                    onClick={handlePrint}
                    className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-md flex items-center space-x-1.5 transition-all"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>প্রশ্নপত্র প্রিন্ট / PDF</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleApply}
                    className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black rounded-xl shadow-lg shadow-emerald-600/30 flex items-center space-x-1.5 transition-all active:scale-95"
                  >
                    <Save className="w-4 h-4" />
                    <span>প্রশ্নব্যাংকে সংরক্ষণ</span>
                  </button>
                </div>
              </div>

              {/* Official Academy Exam Header */}
              <div className="p-6 bg-slate-900 dark:bg-slate-900 print:bg-white print:text-black rounded-3xl border border-slate-800 print:border-black/40 text-center space-y-1.5 shadow-sm">
                <div className="inline-flex items-center space-x-2 px-3 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 print:text-black text-xs font-black uppercase">
                  <GraduationCap className="w-4 h-4" />
                  <span>নেক্সটজেন একাডেমি (NextGen Academy)</span>
                </div>
                <h2 className="text-xl font-black text-white print:text-black tracking-tight">
                  {examTerm}
                </h2>
                <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-slate-300 print:text-slate-700 pt-1">
                  <span>শ্রেণি: {classGrade}</span>
                  <span>•</span>
                  <span>বিষয়: {subject}</span>
                  <span>•</span>
                  <span>অধ্যায়/বিষয়বস্তু: {chapterTopic || 'সকল অধ্যায়'}</span>
                  <span>•</span>
                  <span>পূর্ণমান: {calculateTotalMarks()}</span>
                  <span>•</span>
                  <span>সময়: {isPrimaryStage(classGrade) ? '১ ঘণ্টা ৩০ মিনিট' : `${generatedCQs.length * 25} মিনিট`}</span>
                </div>
                <p className="text-[11px] text-slate-400 print:text-slate-600 italic pt-1 border-t border-slate-800 print:border-black/20 mt-2">
                  [দ্রষ্টব্য: সকল প্রশ্নের উত্তর দেওয়া আবশ্যক। ডান পাশের সংখ্যা প্রশ্নের পূর্ণমান নির্দেশ করে।]
                </p>
              </div>

              {/* ============================================================= */}
              {/* 1. Primary & Early Childhood Adaptive Layout (Play - Class 5) */}
              {/* ============================================================= */}
              {isPrimaryStage(classGrade) ? (
                <div className="space-y-6">
                  {generatedCQs.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded-3xl bg-slate-900 print:bg-white print:text-black border border-slate-800 print:border-black/30 space-y-3 shadow-sm"
                    >
                      <div className="flex items-center justify-between border-b border-slate-800 print:border-black/20 pb-2">
                        <div className="flex items-center space-x-2">
                          <span className="w-7 h-7 rounded-xl bg-amber-500/20 text-amber-300 print:text-black print:bg-slate-200 border border-amber-500/30 print:border-black text-xs font-black flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <span className="font-bold text-xs sm:text-sm text-slate-100 print:text-black">
                            {item.title || `প্রশ্ন নং ${idx + 1}`}
                          </span>
                        </div>
                        <span className="font-mono text-xs font-bold text-slate-400 print:text-black">
                          [{item.marks || 4}]
                        </span>
                      </div>

                      {/* Matching Format Table (কলাম মিলকরণ) */}
                      {item.format === 'MATCHING' && item.pairs && (
                        <div className="p-4 rounded-2xl bg-slate-950/60 print:bg-white border border-slate-800 print:border-slate-300">
                          <table className="w-full text-xs text-left border-collapse">
                            <thead>
                              <tr className="border-b border-slate-700 print:border-slate-300 text-slate-400 print:text-slate-600 font-bold">
                                <th className="p-2 w-1/2">কলাম 'ক' (Column A)</th>
                                <th className="p-2 w-1/2">কলাম 'খ' (Column B)</th>
                              </tr>
                            </thead>
                            <tbody>
                              {item.pairs.map((p, pIdx) => (
                                <tr key={pIdx} className="border-b border-slate-800/60 print:border-slate-200">
                                  <td className="p-2 font-bold text-slate-200 print:text-black">
                                    ({String.fromCharCode(65 + pIdx)}) {p.left}
                                  </td>
                                  <td className="p-2 font-medium text-slate-300 print:text-black">
                                    ({pIdx + 1}) {p.right}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}

                      {/* Fill in the Blanks (শূন্যস্থান পূরণ) */}
                      {item.format === 'FILL_BLANKS' && item.items && (
                        <div className="space-y-2 p-4 rounded-2xl bg-slate-950/60 print:bg-white border border-slate-800 print:border-slate-300">
                          {item.items.map((it, itIdx) => (
                            <div key={itIdx} className="flex items-center justify-between text-xs font-medium text-slate-200 print:text-black py-1 border-b border-slate-800/40 print:border-slate-100 last:border-0">
                              <span>({['ক', 'খ', 'গ', 'ঘ', 'ঙ'][itIdx] || itIdx + 1}) {it.sentence}</span>
                              <span className="font-mono text-slate-400 print:text-black">[{it.marks || 1}]</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Conjoined Letters (যুক্তবর্ণ) */}
                      {item.format === 'CONJOINED_LETTERS' && item.items && (
                        <div className="space-y-2 p-4 rounded-2xl bg-slate-950/60 print:bg-white border border-slate-800 print:border-slate-300">
                          {item.items.map((it, itIdx) => (
                            <div key={itIdx} className="p-2.5 rounded-xl bg-slate-900 print:bg-slate-50 border border-slate-800 print:border-slate-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <div className="flex items-center space-x-3">
                                <span className="px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 print:text-black font-black text-sm">
                                  {it.letter}
                                </span>
                                <span className="text-slate-300 print:text-black">
                                  ভাঙলে: <strong className="text-emerald-400 print:text-black">{it.breakdown}</strong> • শব্দ: <strong className="text-amber-300 print:text-black">{it.word}</strong>
                                </span>
                              </div>
                              <span className="text-slate-400 print:text-slate-600 italic">"{it.sentence}"</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Picture Writing (ছবি দেখে বর্ণনা) */}
                      {item.format === 'PICTURE_WRITING' && (
                        <div className="p-4 rounded-2xl bg-slate-950/60 print:bg-white border border-slate-800 print:border-slate-300 space-y-3">
                          <div className="p-4 rounded-xl bg-slate-900 print:bg-slate-50 border border-dashed border-slate-700 print:border-slate-300 text-center text-xs text-amber-300 print:text-black">
                            {item.visualPrompt || '🎨 [প্রদত্ত চিত্রটি লক্ষ্য করে নিচের বাক্যগুলো রচনা করো]'}
                          </div>
                          {item.hints && item.hints.length > 0 && (
                            <div className="text-[11px] text-slate-400 print:text-slate-600">
                              💡 সংকেত: {item.hints.join(' • ')}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                /* ============================================================= */
                /* 2. Secondary & Higher Secondary (Class 6-12) CQ Layout        */
                /* ============================================================= */
                <div className="space-y-6">
                  {generatedCQs.map((cq, cqIdx) => (
                    <div
                      key={cqIdx}
                      className="p-5 rounded-3xl bg-slate-900 print:bg-white print:text-black border border-slate-800 print:border-black/30 shadow-sm space-y-4"
                    >
                      {/* CQ Header */}
                      <div className="flex items-center justify-between border-b border-slate-800 print:border-black/20 pb-2.5">
                        <div className="flex items-center space-x-2">
                          <span className="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-300 print:text-black print:bg-slate-200 border border-emerald-500/30 print:border-black text-xs font-black flex items-center justify-center">
                            {cqIdx + 1}
                          </span>
                          <span className="font-black text-sm text-slate-100 print:text-black">
                            {cq.section ? `${cq.section} • ` : ''}সৃজনশীল প্রশ্ন নং {cqIdx + 1}
                          </span>
                        </div>

                        <div className="flex items-center space-x-2 no-print">
                          <button
                            type="button"
                            onClick={() => handleRemoveCQ(cqIdx)}
                            className="p-1 text-rose-400 hover:bg-rose-500/20 rounded-lg transition-all"
                            title="প্রশ্ন মুছুন"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Stem (উদ্দীপক) */}
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-emerald-400 print:text-slate-700 block uppercase">
                          উদ্দীপক / দৃশ্যকল্প:
                        </label>
                        <textarea
                          rows={3}
                          value={cq.stem}
                          onChange={(e) => handleStemChange(cqIdx, e.target.value)}
                          placeholder="উদ্দীপক লিখুন..."
                          className="w-full p-3 rounded-2xl bg-slate-800/90 print:bg-slate-50 border border-slate-700 print:border-slate-300 text-xs sm:text-sm font-medium text-slate-100 print:text-black focus:ring-2 focus:ring-emerald-500 focus:outline-none leading-relaxed"
                        />
                      </div>

                      {/* 4 Sub-questions (ক, খ, গ, ঘ) */}
                      {cq.questions && (
                        <div className="space-y-3 pt-1">
                          {/* (ক) জ্ঞানমূলক */}
                          <div className="p-3 rounded-2xl bg-slate-950/60 print:bg-white border border-slate-800 print:border-slate-300 space-y-1.5">
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center space-x-2 flex-1">
                                <span className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-300 print:text-black font-black text-xs flex items-center justify-center flex-shrink-0">
                                  (ক)
                                </span>
                                <input
                                  type="text"
                                  value={cq.questions.ka?.text || ''}
                                  onChange={(e) => handleSubQuestionChange(cqIdx, 'ka', 'text', e.target.value)}
                                  placeholder="জ্ঞানমূলক প্রশ্ন..."
                                  className="w-full bg-transparent text-xs font-bold text-slate-100 print:text-black focus:outline-none"
                                />
                              </div>
                              <span className="font-mono text-xs font-bold text-slate-400 print:text-black flex-shrink-0">
                                [{cq.questions.ka?.marks || 1}]
                              </span>
                            </div>
                            {cq.questions.ka?.answerHint && (
                              <div className="text-[11px] text-slate-400 print:text-slate-600 italic pl-8">
                                💡 সমাধান সংকেত: {cq.questions.ka.answerHint}
                              </div>
                            )}
                          </div>

                          {/* (খ) অনুধাবনমূলক */}
                          <div className="p-3 rounded-2xl bg-slate-950/60 print:bg-white border border-slate-800 print:border-slate-300 space-y-1.5">
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center space-x-2 flex-1">
                                <span className="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-300 print:text-black font-black text-xs flex items-center justify-center flex-shrink-0">
                                  (খ)
                                </span>
                                <input
                                  type="text"
                                  value={cq.questions.kha?.text || ''}
                                  onChange={(e) => handleSubQuestionChange(cqIdx, 'kha', 'text', e.target.value)}
                                  placeholder="অনুধাবনমূলক প্রশ্ন..."
                                  className="w-full bg-transparent text-xs font-bold text-slate-100 print:text-black focus:outline-none"
                                />
                              </div>
                              <span className="font-mono text-xs font-bold text-slate-400 print:text-black flex-shrink-0">
                                [{cq.questions.kha?.marks || 2}]
                              </span>
                            </div>
                            {cq.questions.kha?.answerHint && (
                              <div className="text-[11px] text-slate-400 print:text-slate-600 italic pl-8">
                                💡 সমাধান সংকেত: {cq.questions.kha.answerHint}
                              </div>
                            )}
                          </div>

                          {/* (গ) প্রয়োগমূলক */}
                          <div className="p-3 rounded-2xl bg-slate-950/60 print:bg-white border border-slate-800 print:border-slate-300 space-y-1.5">
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center space-x-2 flex-1">
                                <span className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-300 print:text-black font-black text-xs flex items-center justify-center flex-shrink-0">
                                  (গ)
                                </span>
                                <input
                                  type="text"
                                  value={cq.questions.ga?.text || ''}
                                  onChange={(e) => handleSubQuestionChange(cqIdx, 'ga', 'text', e.target.value)}
                                  placeholder="প্রয়োগমূলক প্রশ্ন..."
                                  className="w-full bg-transparent text-xs font-bold text-slate-100 print:text-black focus:outline-none"
                                />
                              </div>
                              <span className="font-mono text-xs font-bold text-slate-400 print:text-black flex-shrink-0">
                                [{cq.questions.ga?.marks || 3}]
                              </span>
                            </div>
                            {cq.questions.ga?.answerHint && (
                              <div className="text-[11px] text-slate-400 print:text-slate-600 italic pl-8">
                                💡 সমাধান সংকেত: {cq.questions.ga.answerHint}
                              </div>
                            )}
                          </div>

                          {/* (ঘ) উচ্চতর দক্ষতামূলক */}
                          <div className="p-3 rounded-2xl bg-slate-950/60 print:bg-white border border-slate-800 print:border-slate-300 space-y-1.5">
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center space-x-2 flex-1">
                                <span className="w-6 h-6 rounded-lg bg-purple-500/20 text-purple-300 print:text-black font-black text-xs flex items-center justify-center flex-shrink-0">
                                  (ঘ)
                                </span>
                                <input
                                  type="text"
                                  value={cq.questions.gha?.text || ''}
                                  onChange={(e) => handleSubQuestionChange(cqIdx, 'gha', 'text', e.target.value)}
                                  placeholder="উচ্চতর দক্ষতামূলক প্রশ্ন..."
                                  className="w-full bg-transparent text-xs font-bold text-slate-100 print:text-black focus:outline-none"
                                />
                              </div>
                              <span className="font-mono text-xs font-bold text-slate-400 print:text-black flex-shrink-0">
                                [{cq.questions.gha?.marks || 4}]
                              </span>
                            </div>
                            {cq.questions.gha?.answerHint && (
                              <div className="text-[11px] text-slate-400 print:text-slate-600 italic pl-8">
                                💡 সমাধান সংকেত: {cq.questions.gha.answerHint}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between no-print">
          <div className="text-xs text-slate-400">
            {generatedCQs.length > 0 ? (
              <span>মোট প্রস্তুতকৃত আইটেম: <strong className="text-white">{generatedCQs.length}টি ({calculateTotalMarks()} নম্বর)</strong></span>
            ) : (
              <span>প্রথমে এআই জেনারেট বাটনে ক্লিক করুন</span>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all"
            >
              বন্ধ করুন
            </button>

            {generatedCQs.length > 0 && (
              <>
                <button
                  type="button"
                  onClick={handlePrint}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center space-x-1.5 transition-all shadow-md"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>প্রিন্ট / PDF</span>
                </button>

                <button
                  type="button"
                  onClick={handleApply}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-lg shadow-emerald-600/30 flex items-center space-x-2 transition-all active:scale-95"
                >
                  <Save className="w-4 h-4" />
                  <span>প্রশ্নব্যাংকে সংরক্ষণ করুন</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
