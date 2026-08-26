import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Award,
  Image as ImageIcon,
  Camera,
  Bot,
  Sparkles,
  PlayCircle,
  Sliders,
  Send,
  Printer,
  Copy,
  Download,
  Share2,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  HelpCircle,
  Zap,
  ListOrdered,
  Calendar,
  Layers,
  GraduationCap,
  RefreshCw,
  Eye,
  Plus,
  Trash2,
  Check,
  X,
  Upload
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { questionRepositoryAPI, examAPI } from '../../services/api';

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
  'ইংরেজি ২য় পত্র (English 2nd Paper - Grammar)',
  'হিসাববিজ্ঞান (Accounting)',
  'ফিন্যান্স ও ব্যাংকিং (Finance & Banking)',
  'ব্যবসায় উদ্যোগ (Business Studies)',
  'অর্থনীতি (Economics)',
  'পৌরনীতি ও সুশাসন (Civics)',
  'ইতিহাস (History)',
  'ভূগোল ও পরিবেশ (Geography)'
];

const PROMPT_SUGGESTIONS = [
  'নটর ডেম কলেজ ২৫ ৫টি, ঢাকা বোর্ড ২৫ ১০টি, কুমিল্লা বোর্ড ২৪ ৫টি',
  'এসএসসি ২০২৬ পদার্থবিজ্ঞান অধ্যায় ৪ সৃজনশীল ৩টি ও বহুনির্বাচনী ২০টি',
  'রাজউক উত্তরা মডেল কলেজ ২৫ ৪টি, ঢাকা বোর্ড ২৪ ৬টি',
  'এইচএসসি ২০২৫ উচ্চতর গণিত ভেক্টর অধ্যায় থেকে বহুনির্বাচনী ২৫টি'
];

export default function AIQuestionMakerHub({ onNavigateToUpload, onNavigateToOMR }) {
  const { lang, t } = useLanguage();

  // Generator Controls
  const [naturalPrompt, setNaturalPrompt] = useState('নটর ডেম কলেজ ২৫ ৫টি, ঢাকা বোর্ড ২৫ ১০টি, কুমিল্লা বোর্ড ২৪ ৫টি');
  const [selectedClass, setSelectedClass] = useState('Class 9-10 (SSC)');
  const [selectedSubject, setSelectedSubject] = useState('পদার্থবিজ্ঞান');
  const [genFormat, setGenFormat] = useState('COMBINED');
  const [genMode, setGenMode] = useState('HYBRID');
  const [targetCount, setTargetCount] = useState(25);
  const [examDuration, setExamDuration] = useState(30);

  // Generation Results
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedExam, setGeneratedExam] = useState(null);
  const [feedbackMsg, setFeedbackMsg] = useState(null);

  // 1-Click Online Exam Publish Modal
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [publishTitle, setPublishTitle] = useState('');
  const [publishDate, setPublishDate] = useState(new Date().toISOString().split('T')[0]);
  const [isPublishing, setIsPublishing] = useState(false);

  const printAreaRef = useRef(null);

  // Generate Exam
  const handleGenerateExam = async () => {
    if (!naturalPrompt.trim()) {
      setFeedbackMsg({ type: 'error', text: 'অনুগ্রহ করে প্রম্পট বা প্রশ্নের শর্তাবলী লিখুন।' });
      return;
    }

    setIsGenerating(true);
    setFeedbackMsg(null);

    try {
      const payload = {
        prompt: naturalPrompt,
        className: selectedClass,
        subject: selectedSubject,
        format: genFormat,
        mode: genMode,
        targetCount: Number(targetCount) || 20
      };

      const res = await questionRepositoryAPI.generateAIExam(payload);
      if (res.success && res.data) {
        setGeneratedExam(res.data);
        setPublishTitle(res.data.title || (selectedSubject + ' - বিশেষ মডেল টেস্ট'));
        setFeedbackMsg({
          type: 'success',
          text: '🎉 সফলভাবে প্রশ্নপত্র প্রস্তুত হয়েছে! মোট ' + (res.data.questions?.length || 0) + 'টি প্রশ্ন সংযুক্ত করা হয়েছে।'
        });
      } else {
        setFeedbackMsg({ type: 'error', text: res.error?.message || 'প্রশ্নপত্র তৈরি করতে ব্যর্থ হয়েছে।' });
      }
    } catch (err) {
      setFeedbackMsg({ type: 'error', text: err.message || 'প্রশ্ন তৈরিতে ত্রুটি।' });
    } finally {
      setIsGenerating(false);
    }
  };

  // Copy Exam to Clipboard
  const handleCopyExam = () => {
    if (!generatedExam || !generatedExam.questions) return;
    let text = 'NextGen Academy\n' + generatedExam.title + '\nবিষয়: ' + generatedExam.subject + ' | শ্রেণি: ' + generatedExam.className + '\nসময়: ' + (generatedExam.durationMinutes || 30) + ' মিনিট | পূর্ণমান: ' + (generatedExam.totalMarks || 100) + '\n\n';

    generatedExam.questions.forEach((q, idx) => {
      text += 'প্রশ্ন ' + (idx + 1) + '. [' + (q.sourceBadge || q.badge || 'NextGen AI') + ']\n';
      if (q.type === 'MCQ') {
        text += q.question + '\n';
        q.options?.forEach((opt, oIdx) => {
          text += '  (' + String.fromCharCode(97 + oIdx) + ') ' + opt + '\n';
        });
        text += 'সঠিক উত্তর: (' + String.fromCharCode(97 + (q.correctAnswer || 0)) + ')\n\n';
      } else if (q.type === 'CQ') {
        text += 'উদ্দীপক: ' + (q.stem || q.question) + '\n';
        if (q.subQuestions) {
          text += '  (ক) ' + (q.subQuestions.a?.q || '') + ' [১]\n';
          text += '  (খ) ' + (q.subQuestions.b?.q || '') + ' [২]\n';
          text += '  (গ) ' + (q.subQuestions.c?.q || '') + ' [৩]\n';
          text += '  (ঘ) ' + (q.subQuestions.d?.q || '') + ' [৪]\n';
        }
        text += '\n';
      } else {
        text += q.question + '\n\n';
      }
    });

    navigator.clipboard.writeText(text);
    alert('✅ প্রশ্নপত্র ক্লিপবোর্ডে কপি করা হয়েছে!');
  };

  // Print Exam
  const handlePrintExam = () => {
    window.print();
  };

  // 1-Click Publish to Live Online Exam
  const handlePublishToOnlineExam = async () => {
    if (!generatedExam || !generatedExam.questions || generatedExam.questions.length === 0) return;
    setIsPublishing(true);

    try {
      const examPayload = {
        title: publishTitle || generatedExam.title,
        titleBn: publishTitle || generatedExam.title,
        subject: generatedExam.subject || selectedSubject,
        examType: 'ONLINE_MCQ',
        durationMinutes: Number(examDuration) || 30,
        totalMarks: generatedExam.totalMarks || (generatedExam.questions.length * (genFormat === 'CQ' ? 10 : 1)),
        passMarks: Math.ceil((generatedExam.totalMarks || 25) * 0.4),
        negativeMarking: 0.25,
        shuffleQuestions: true,
        examDate: publishDate,
        startTime: '10:00',
        endTime: '23:59',
        questions: generatedExam.questions.map((q, idx) => ({
          questionNumber: idx + 1,
          questionText: q.question || q.stem,
          type: q.type || 'MCQ',
          options: q.options || ['বিকল্প ১', 'বিকল্প ২', 'বিকল্প ৩', 'বিকল্প ৪'],
          correctOptionIndex: q.correctAnswer || 0,
          marks: q.marks || 1,
          explanation: q.explanation || '',
          badge: q.sourceBadge || q.badge
        }))
      };

      const res = await examAPI.create(examPayload);
      if (res.success) {
        alert('🚀 অভিনন্দন! অনলাইন পরীক্ষাটি সফলভাবে শিক্ষার্থীদের জন্য লাইভ প্রকাশ করা হয়েছে!');
        setShowPublishModal(false);
      } else {
        alert('পরীক্ষা প্রকাশ করতে সমস্যা হয়েছে: ' + (res.error?.message || 'Unknown error'));
      }
    } catch (err) {
      alert('পরীক্ষা প্রকাশ করতে সমস্যা হয়েছে: ' + err.message);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden border border-emerald-500/30">
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md mb-2">
              <Bot className="w-3.5 h-3.5 text-emerald-400" />
              <span>পার্ট ২: এআই প্রশ্ন জেনারেটর ও মেকার</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              এআই প্রশ্ন জেনারেটর ও মেকার হাব (AI Question Generator & Maker)
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1.5 max-w-2xl leading-relaxed">
              প্রম্পট দিন এবং আপলোডকৃত রিপোজিটরি ও বিগত সালের প্রশ্ন থেকে বোর্ড/কলেজ ভিত্তিক কমপ্লিট প্রশ্নপত্র ও মডেল টেস্ট তৈরি করুন।
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex flex-wrap items-center gap-2">
              {onNavigateToUpload && (
                <button
                  type="button"
                  onClick={onNavigateToUpload}
                  className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs flex items-center space-x-1.5 transition-all active:scale-95 cursor-pointer"
                >
                  <Upload className="w-4 h-4 text-indigo-300" />
                  <span>← পার্ট ১: আপলোড ও রিডার</span>
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

      {/* Feedback Alert */}
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

      {/* Generator Prompt Box & Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Form: Prompt & Criteria Selection */}
        <div className="lg:col-span-6 space-y-5">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="font-black text-sm text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100 uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>১. প্রম্পট ও প্রশ্ন বিন্যাস কনফিগারেশন</span>
            </h3>

            {/* Prompt Input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                ✍️ প্রাকৃতিক ভাষার প্রম্পট (Natural Language Prompt) *
              </label>
              <textarea
                rows={3}
                value={naturalPrompt}
                onChange={(e) => setNaturalPrompt(e.target.value)}
                placeholder="যেমন: নটর ডেম কলেজ ২৫ ৫টি, ঢাকা বোর্ড ২৫ ১০টি, কুমিল্লা বোর্ড ২৪ ৫টি"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none leading-relaxed"
              />
              <div className="space-y-1 pt-1">
                <span className="text-[10px] font-bold text-slate-400 block">কুইক প্রম্পট সাজেশনস:</span>
                <div className="flex flex-wrap gap-1.5">
                  {PROMPT_SUGGESTIONS.map((sug, sIdx) => (
                    <button
                      key={sIdx}
                      type="button"
                      onClick={() => setNaturalPrompt(sug)}
                      className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[10px] font-bold transition-colors text-left"
                    >
                      {sug}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Class & Subject */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">🎓 শ্রেণি (Class)</label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  {CLASSES_LIST.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">📖 বিষয় (Subject)</label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  {SUBJECTS_LIST.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Format & Mode */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">📑 ফরম্যাট (Format)</label>
                <select
                  value={genFormat}
                  onChange={(e) => setGenFormat(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="COMBINED">মডেল টেস্ট (MCQ + CQ)</option>
                  <option value="MCQ">শুধুমাত্র বহুনির্বাচনী (MCQ)</option>
                  <option value="CQ">শুধুমাত্র সৃজনশীল (CQ)</option>
                  <option value="SHORT">সংক্ষিপ্ত ও জ্ঞানমূলক</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">⚡ জেনারেশন সোর্স মোড</label>
                <select
                  value={genMode}
                  onChange={(e) => setGenMode(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="HYBRID">স্মার্ট হাইব্রিড (বোর্ড রিপোজিটরি + এআই)</option>
                  <option value="REPO_ONLY">সরাসরি আপলোডকৃত রিপোজিটরি থেকে</option>
                  <option value="AI_CREATIVE">সম্পূর্ণ নতুন এআই জেনারেশন</option>
                </select>
              </div>
            </div>

            {/* Question Count & Duration */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">🎯 মোট প্রশ্ন সংখ্যা</label>
                <input
                  type="number"
                  min="5"
                  max="100"
                  value={targetCount}
                  onChange={(e) => setTargetCount(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">⏱️ পরীক্ষার সময় (মিনিট)</label>
                <input
                  type="number"
                  min="10"
                  max="180"
                  value={examDuration}
                  onChange={(e) => setExamDuration(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleGenerateExam}
              disabled={isGenerating || !naturalPrompt.trim()}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm shadow-lg shadow-emerald-600/30 flex items-center justify-center space-x-2 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <Sparkles className={'w-4 h-4 ' + (isGenerating ? 'animate-spin' : '')} />
              <span>{isGenerating ? 'এআই প্রশ্নপত্র তৈরি করছে...' : '🚀 সম্পূর্ণ প্রশ্নপত্র তৈরি করুন'}</span>
            </button>
          </div>
        </div>

        {/* Right Preview: Live Generated Exam Paper */}
        <div className="lg:col-span-6 space-y-5">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <h3 className="font-black text-sm text-slate-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-600" />
                <span>২. প্রশ্নপত্র প্রিভিউ ও অ্যাকশন প্যানেল</span>
              </h3>

              {generatedExam && (
                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handleCopyExam}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                    title="ক্লিপবোর্ডে কপি করুন"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handlePrintExam}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                    title="প্রিন্ট / PDF ডাউনলোড"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowPublishModal(true)}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center space-x-1.5 transition-all cursor-pointer"
                  >
                    <PlayCircle className="w-3.5 h-3.5" />
                    <span>১-ক্লিকে প্রকাশ</span>
                  </button>
                </div>
              )}
            </div>

            {/* Generated Paper View */}
            {!generatedExam ? (
              <div className="p-12 text-center bg-slate-50 rounded-2xl border border-slate-100 text-slate-400 space-y-2">
                <Bot className="w-10 h-10 mx-auto text-slate-300" />
                <p className="text-xs font-bold text-slate-700">কোনো প্রশ্নপত্র এখনও জেনারেট করা হয়নি</p>
                <p className="text-[11px] text-slate-400">বামে আপনার প্রম্পট লিখুন এবং 'সম্পূর্ণ প্রশ্নপত্র তৈরি করুন' বাটনে ক্লিক করুন।</p>
              </div>
            ) : (
              <div ref={printAreaRef} className="space-y-4 max-h-[520px] overflow-y-auto pr-1">
                {/* Exam Paper Header */}
                <div className="text-center p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                  <h4 className="font-black text-sm text-slate-900">{generatedExam.title || 'NextGen Academy - বিশেষ মডেল টেস্ট'}</h4>
                  <p className="text-[11px] text-slate-600 font-bold">
                    বিষয়: {generatedExam.subject || selectedSubject} • শ্রেণি: {generatedExam.className || selectedClass}
                  </p>
                  <div className="flex items-center justify-center gap-4 text-[10px] text-slate-500 font-mono pt-1">
                    <span>সময়: {generatedExam.durationMinutes || examDuration} মিনিট</span>
                    <span>•</span>
                    <span>মোট প্রশ্ন: {generatedExam.questions?.length || 0}টি</span>
                    <span>•</span>
                    <span>পূর্ণমান: {generatedExam.totalMarks || (generatedExam.questions?.length * (genFormat === 'CQ' ? 10 : 1))}</span>
                  </div>
                </div>

                {/* Question Items */}
                <div className="space-y-3">
                  {generatedExam.questions?.map((q, idx) => (
                    <div key={idx} className="p-3.5 rounded-2xl bg-white border border-slate-200 text-xs space-y-2 shadow-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-emerald-700">প্রশ্ন #{idx + 1} ({q.type})</span>
                        <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 font-bold text-[10px]">
                          {q.sourceBadge || q.badge || "NextGen AI - '২৬"}
                        </span>
                      </div>

                      {q.type === 'MCQ' ? (
                        <>
                          <p className="font-bold text-slate-800">{q.question}</p>
                          {(q.diagramUrl || q.diagramCaption) && (
                            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/90 my-1.5 flex items-center space-x-3">
                              {q.diagramUrl ? (
                                <img src={q.diagramUrl} alt="Diagram" className="max-h-32 object-contain rounded-lg border bg-white mx-auto shadow-xs" />
                              ) : (
                                <div className="flex items-center space-x-2 text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 text-[11px] font-bold">
                                  <ImageIcon className="w-4 h-4 text-emerald-600" />
                                  <span>📊 {q.diagramCaption || 'চিত্র / লেখচিত্র: উদ্দীপক দ্রষ্টব্য'}</span>
                                </div>
                              )}
                            </div>
                          )}
                          <div className="grid grid-cols-2 gap-1.5 text-[11px] pt-1">
                            {q.options?.map((opt, optIdx) => (
                              <div
                                key={optIdx}
                                className={'p-1.5 rounded-lg border ' + (
                                  optIdx === q.correctAnswer
                                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold'
                                    : 'bg-slate-50 border-slate-200 text-slate-700 font-medium'
                                )}
                              >
                                <span className="font-bold mr-1">({String.fromCharCode(97 + optIdx)})</span>
                                {opt}
                              </div>
                            ))}
                          </div>
                          {q.explanation && (
                            <p className="text-[10px] text-slate-500 italic pt-1 bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                              💡 ব্যাখ্যা: {q.explanation}
                            </p>
                          )}
                        </>
                      ) : q.type === 'CQ' ? (
                        <>
                          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 space-y-2">
                            <p className="font-medium text-slate-800 leading-relaxed">
                              {q.stem || q.question}
                            </p>
                            {(q.diagramUrl || q.diagramCaption) && (
                              <div className="p-2 rounded-lg bg-white border border-slate-200 flex items-center space-x-3 shadow-xs">
                                {q.diagramUrl ? (
                                  <img src={q.diagramUrl} alt="Diagram" className="max-h-36 object-contain rounded border bg-slate-50" />
                                ) : (
                                  <div className="flex items-center space-x-2 text-indigo-900 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-200 text-[10px] font-bold">
                                    <ImageIcon className="w-3.5 h-3.5 text-indigo-600" />
                                    <span>📊 {q.diagramCaption || 'উদ্দীপকের সংশ্লিষ্ট চিত্র / সার্কিট ডায়াগ্রাম'}</span>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                          {q.subQuestions && (
                            <div className="space-y-1 text-[11px] pt-1 font-medium">
                              <p className="flex justify-between"><span><strong className="text-emerald-700">ক.</strong> {q.subQuestions.a?.q}</span> <span className="text-slate-400">[১]</span></p>
                              <p className="flex justify-between"><span><strong className="text-emerald-700">খ.</strong> {q.subQuestions.b?.q}</span> <span className="text-slate-400">[২]</span></p>
                              <p className="flex justify-between"><span><strong className="text-emerald-700">গ.</strong> {q.subQuestions.c?.q}</span> <span className="text-slate-400">[৩]</span></p>
                              <p className="flex justify-between"><span><strong className="text-emerald-700">ঘ.</strong> {q.subQuestions.d?.q}</span> <span className="text-slate-400">[৪]</span></p>
                            </div>
                          )}
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
      </div>

      {/* 1-Click Publish Modal */}
      {showPublishModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                  <PlayCircle className="w-5 h-5" />
                </div>
                <h4 className="font-black text-sm text-slate-900">অনলাইন পরীক্ষা প্রকাশনা</h4>
              </div>
              <button
                type="button"
                onClick={() => setShowPublishModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="block font-bold text-slate-700">পরীক্ষার শিরোনাম (Exam Title)</label>
                <input
                  type="text"
                  value={publishTitle}
                  onChange={(e) => setPublishTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block font-bold text-slate-700">তারিখ</label>
                  <input
                    type="date"
                    value={publishDate}
                    onChange={(e) => setPublishDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block font-bold text-slate-700">সময়সীমা (মিনিট)</label>
                  <input
                    type="number"
                    value={examDuration}
                    onChange={(e) => setExamDuration(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 space-y-1">
                <p className="font-bold">✓ {generatedExam?.questions?.length || 0}টি প্রশ্ন সংযুক্ত হবে</p>
                <p className="text-[11px]">শিক্ষার্থীরা শিক্ষার্থী পোর্টাল ও অনলাইন এক্সাম হাব থেকে সরাসরি অংশগ্রহণ করতে পারবে।</p>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setShowPublishModal(false)}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold text-xs"
              >
                বাতিল
              </button>
              <button
                type="button"
                onClick={handlePublishToOnlineExam}
                disabled={isPublishing}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-md shadow-emerald-600/30 flex items-center space-x-1.5 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>{isPublishing ? 'প্রকাশ হচ্ছে...' : '১-ক্লিকে নিশ্চিত প্রকাশ করুন'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
