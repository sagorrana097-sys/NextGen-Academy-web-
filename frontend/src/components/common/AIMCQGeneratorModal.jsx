import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { examAPI } from '../../services/api';
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
  GraduationCap
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

  // Generator State
  const [topic, setTopic] = useState('');
  const [subject, setSubject] = useState('পদার্থবিজ্ঞান (Physics)');
  const [classGrade, setClassGrade] = useState('১০ম শ্রেণি (Class 10)');
  const [difficulty, setDifficulty] = useState('MEDIUM'); // 'EASY' | 'MEDIUM' | 'HARD'
  const [questionCount, setQuestionCount] = useState(10);
  const [chapterNotes, setChapterNotes] = useState('');

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

  const handleGenerate = async (e) => {
    if (e) e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!topic.trim() && !chapterNotes.trim()) {
      setErrorMsg('অনুগ্রহ করে অধ্যায়/টপিকের নাম অথবা হ্যান্ডনোট পেস্ট করুন।');
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
        chapterNotes: chapterNotes.trim()
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
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
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
                  🤖 এআই স্বয়ংক্রিয় MCQ জেনারেটর (AI Auto MCQ Generator)
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-black uppercase">
                  Google Gemini 1.5
                </span>
              </div>
              <p className="text-xs text-slate-300">
                বিষয় ও টপিকের নাম লিখুন অথবা নোট পেস্ট করে এক ক্লিকে সম্পূর্ণ বহুনির্বাচনী প্রশ্নমালা প্রস্তুত করুন
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

          {/* Generator Parameters Card */}
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
              {/* Question Count Pills */}
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

              {/* Optional Notes */}
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
                    <RefreshCw className="w-4 h-4 animate-spin text-indigo-300" />
                    <span>{generationStep || 'এআই দিয়ে প্রশ্ন তৈরি হচ্ছে...'}</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 text-amber-300" />
                    <span>⚡ এআই দিয়ে জেনারেট করুন (Generate {questionCount} MCQs)</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Generated Questions Interactive Review Section */}
          {generatedQuestions.length > 0 && (
            <div className="space-y-4 pt-2 border-t border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
                <div>
                  <h4 className="font-extrabold text-sm text-slate-100 flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>জেনারেটকৃত প্রশ্নমালা ({generatedQuestions.length}টি প্রশ্ন)</span>
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    প্রতিটি প্রশ্ন ও অপশন পর্যালোচনা করুন। রেডিও বাটনে ক্লিক করে সঠিক উত্তর পরিবর্তন করতে পারেন।
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={handleAddNewQuestion}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl flex items-center space-x-1 transition-all border border-slate-700"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ ম্যানুয়াল প্রশ্ন যোগ</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleApplyToExam}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black rounded-xl shadow-lg shadow-emerald-600/30 flex items-center space-x-1.5 transition-all active:scale-95"
                  >
                    <Save className="w-4 h-4" />
                    <span>সংরক্ষণ ও পরীক্ষায় প্রয়োগ করুন</span>
                  </button>
                </div>
              </div>

              {/* Questions List */}
              <div className="space-y-4">
                {generatedQuestions.map((q, qIdx) => (
                  <div
                    key={qIdx}
                    className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3.5 shadow-sm"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center space-x-2">
                        <span className="w-6 h-6 rounded-lg bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 text-xs font-black flex items-center justify-center">
                          {qIdx + 1}
                        </span>
                        <span className="text-xs font-bold text-slate-300">
                          প্রশ্ন নং {qIdx + 1}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className="text-[11px] text-slate-400">নম্বর:</span>
                        <input
                          type="number"
                          min="1"
                          value={q.marks || 1}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setGeneratedQuestions(prev => {
                              const copy = [...prev];
                              copy[qIdx].marks = val;
                              return copy;
                            });
                          }}
                          className="w-12 px-1.5 py-0.5 rounded-lg bg-slate-800 border border-slate-700 text-center font-bold text-xs text-indigo-400"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveQuestion(qIdx)}
                          className="p-1 text-rose-400 hover:bg-rose-500/20 rounded-lg transition-all"
                          title="প্রশ্ন মুছুন"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Question Input */}
                    <input
                      type="text"
                      value={q.questionBn}
                      onChange={(e) => handleQuestionTextChange(qIdx, e.target.value)}
                      placeholder="প্রশ্নের বিবরণ লিখুন..."
                      className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs sm:text-sm font-bold text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />

                    {/* 4 Options */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {q.options.map((opt, optIdx) => {
                        const isCorrect = q.correctOptionIndex === optIdx;

                        return (
                          <div
                            key={optIdx}
                            className={`flex items-center space-x-2.5 p-2.5 rounded-xl border transition-all ${
                              isCorrect
                                ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-100 ring-1 ring-emerald-500/30'
                                : 'bg-slate-800/80 border-slate-700 text-slate-300'
                            }`}
                          >
                            <input
                              type="radio"
                              name={`correct-answer-ai-${qIdx}`}
                              checked={isCorrect}
                              onChange={() => handleCorrectAnswerChange(qIdx, optIdx)}
                              className="accent-emerald-500 w-4 h-4 cursor-pointer flex-shrink-0"
                              title="সঠিক উত্তর হিসেবে সেট করুন"
                            />
                            <span className="text-[11px] font-bold text-slate-400">
                              {['ক', 'খ', 'গ', 'ঘ'][optIdx] || optIdx + 1})
                            </span>
                            <input
                              type="text"
                              value={opt}
                              onChange={(e) => handleOptionTextChange(qIdx, optIdx, e.target.value)}
                              placeholder={`অপশন ${optIdx + 1}`}
                              className="flex-1 bg-transparent text-xs font-medium focus:outline-none"
                            />
                            {isCorrect && (
                              <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 ml-auto" />
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Explanation */}
                    <div className="flex items-center space-x-2 bg-slate-950/60 p-2 rounded-xl border border-slate-800">
                      <HelpCircle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                      <input
                        type="text"
                        value={q.explanation || ''}
                        onChange={(e) => handleExplanationChange(qIdx, e.target.value)}
                        placeholder="সঠিক উত্তরের ব্যাখ্যা (ঐচ্ছিক)..."
                        className="w-full bg-transparent text-[11px] text-slate-300 italic focus:outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            {generatedQuestions.length > 0 ? (
              <span>মোট প্রস্তুতকৃত প্রশ্ন: <strong className="text-white">{generatedQuestions.length}টি</strong></span>
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

            {generatedQuestions.length > 0 && (
              <button
                type="button"
                onClick={handleApplyToExam}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-lg shadow-emerald-600/30 flex items-center space-x-2 transition-all active:scale-95"
              >
                <Save className="w-4 h-4" />
                <span>পরীক্ষায় প্রশ্নমালা যুক্ত করুন</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
