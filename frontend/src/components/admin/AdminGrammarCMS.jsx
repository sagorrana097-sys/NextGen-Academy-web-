import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Sparkles,
  Plus,
  Edit3,
  Trash2,
  CheckCircle2,
  AlertCircle,
  X,
  Eye,
  Save,
  Loader2,
  Layers,
  HelpCircle,
  Check,
  Globe,
  Lock,
  ArrowRight,
  BookA,
  ListChecks,
  PlusCircle,
  FileText
} from 'lucide-react';
import { grammarAPI } from '../../services/api';

export default function AdminGrammarCMS() {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Editor Modal State
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState(null); // null if creating new
  const [saving, setSaving] = useState(false);

  // AI Generator Modal State
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [aiTopicInput, setAiTopicInput] = useState('');
  const [aiLevelInput, setAiLevelInput] = useState('Class 8 - 12 (SSC & HSC)');
  const [aiGenerating, setAiGenerating] = useState(false);

  // Form Fields for Editor
  const [formData, setFormData] = useState({
    title: '',
    category: 'TENSE',
    level: 'Class 8 - 12 (SSC & HSC)',
    summary: '',
    teacherNotes: '',
    contentHtml: '',
    rules: [],
    quiz: [],
    isPublished: true
  });

  const fetchTopics = async () => {
    setLoading(true);
    try {
      const res = await grammarAPI.getTopics();
      if (res?.success && res.data) {
        setTopics(res.data);
      }
    } catch (err) {
      setError(err.message || 'গ্রামার টপিক লোড করতে ব্যর্থ হয়েছে।');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopics();
  }, []);

  const openCreateNew = () => {
    setEditingTopic(null);
    setFormData({
      title: '',
      category: 'GENERAL',
      level: 'Class 8 - 12 (SSC & HSC)',
      summary: '',
      teacherNotes: 'মো: আলমগীর স্যারের স্পেশাল টেকনিক:',
      contentHtml: '',
      rules: [
        { name: 'Rule 1', nameBn: 'নিয়ম ১', formula: '', exampleEn: '', exampleBn: '', tips: '' }
      ],
      quiz: [
        { id: 1, question: '', options: ['', '', '', ''], correctAnswerIndex: 0, explanation: '' }
      ],
      isPublished: true
    });
    setIsEditorOpen(true);
  };

  const openEdit = (topic) => {
    setEditingTopic(topic);
    setFormData({
      title: topic.title || '',
      category: topic.category || 'GENERAL',
      level: topic.level || '',
      summary: topic.summary || '',
      teacherNotes: topic.teacherNotes || '',
      contentHtml: topic.contentHtml || '',
      rules: Array.isArray(topic.rules) ? [...topic.rules] : [],
      quiz: Array.isArray(topic.quiz) ? [...topic.quiz] : [],
      isPublished: topic.isPublished !== undefined ? Boolean(topic.isPublished) : true
    });
    setIsEditorOpen(true);
  };

  // AI Auto-Generator Handler
  const handleAIGenerate = async () => {
    if (!aiTopicInput.trim()) {
      setError('গ্রামার টপিকের নাম লিখুন (যেমন: Narration, Tag Questions, Conditionals)');
      return;
    }
    setAiGenerating(true);
    setError(null);
    try {
      const res = await grammarAPI.aiGenerate({
        topic: aiTopicInput.trim(),
        level: aiLevelInput
      });
      if (res?.success && res.data) {
        const draft = res.data;
        setFormData({
          title: draft.title || '',
          category: draft.category || 'GENERAL',
          level: draft.level || aiLevelInput,
          summary: draft.summary || '',
          teacherNotes: draft.teacherNotes || '',
          contentHtml: draft.contentHtml || '',
          rules: draft.rules || [],
          quiz: draft.quiz || [],
          isPublished: true
        });
        setEditingTopic(null);
        setIsAIOpen(false);
        setIsEditorOpen(true);
        setSuccessMsg(res.message || 'AI সফলভাবে গ্রামার পাঠ ড্রাফট করেছে!');
      } else {
        setError(res?.error?.message || 'AI জেনারেশন ব্যর্থ হয়েছে।');
      }
    } catch (err) {
      setError(err.message || 'AI জেনারেট করতে ত্রুটি হয়েছে।');
    } finally {
      setAiGenerating(false);
    }
  };

  // Save Topic (Create or Update)
  const handleSaveTopic = async () => {
    if (!formData.title.trim()) {
      setError('টপিকের শিরোনাম আবশ্যক।');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      let res;
      if (editingTopic) {
        res = await grammarAPI.updateTopic(editingTopic.id, formData);
      } else {
        res = await grammarAPI.createTopic(formData);
      }
      if (res?.success) {
        setSuccessMsg(editingTopic ? 'টপিক সফলভাবে আপডেট করা হয়েছে!' : 'নতুন গ্রামার পাঠ প্রকাশিত হয়েছে!');
        setIsEditorOpen(false);
        fetchTopics();
      } else {
        setError(res?.error?.message || 'সংরক্ষণ ব্যর্থ হয়েছে।');
      }
    } catch (err) {
      setError(err.message || 'সংরক্ষণ ব্যর্থ হয়েছে।');
    } finally {
      setSaving(false);
    }
  };

  // Delete Topic Handler
  const handleDelete = async (id, title) => {
    if (!window.confirm(`আপনি কি নিশ্চিত যে "${title}" পাঠটি মুছে ফেলতে চান?`)) return;
    try {
      const res = await grammarAPI.deleteTopic(id);
      if (res?.success) {
        setSuccessMsg('টপিক সফলভাবে মুছে ফেলা হয়েছে।');
        fetchTopics();
      }
    } catch (err) {
      setError(err.message || 'মুছে ফেলতে ব্যর্থ হয়েছে।');
    }
  };

  // Rule management helpers
  const addRuleRow = () => {
    setFormData(prev => ({
      ...prev,
      rules: [
        ...prev.rules,
        { name: `Rule ${prev.rules.length + 1}`, nameBn: `নিয়ম ${prev.rules.length + 1}`, formula: '', exampleEn: '', exampleBn: '', tips: '' }
      ]
    }));
  };

  const removeRuleRow = (index) => {
    setFormData(prev => ({
      ...prev,
      rules: prev.rules.filter((_, i) => i !== index)
    }));
  };

  const updateRuleField = (index, field, val) => {
    setFormData(prev => {
      const updated = [...prev.rules];
      updated[index] = { ...updated[index], [field]: val };
      return { ...prev, rules: updated };
    });
  };

  // Quiz management helpers
  const addQuizRow = () => {
    setFormData(prev => ({
      ...prev,
      quiz: [
        ...prev.quiz,
        {
          id: Date.now(),
          question: '',
          options: ['', '', '', ''],
          correctAnswerIndex: 0,
          explanation: ''
        }
      ]
    }));
  };

  const removeQuizRow = (index) => {
    setFormData(prev => ({
      ...prev,
      quiz: prev.quiz.filter((_, i) => i !== index)
    }));
  };

  const updateQuizField = (index, field, val) => {
    setFormData(prev => {
      const updated = [...prev.quiz];
      updated[index] = { ...updated[index], [field]: val };
      return { ...prev, quiz: updated };
    });
  };

  const updateQuizOption = (qIndex, optIndex, val) => {
    setFormData(prev => {
      const updated = [...prev.quiz];
      const opts = [...(updated[qIndex].options || ['', '', '', ''])];
      opts[optIndex] = val;
      updated[qIndex] = { ...updated[qIndex], options: opts };
      return { ...prev, quiz: updated };
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-3xl shadow-xl text-white">
        <div className="flex items-center space-x-4">
          <div className="p-3.5 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <BookA className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white flex items-center gap-2">
              <span>হাইব্রিড ইংলিশ গ্রামার CMS</span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-black text-xs">
                AI + Manual
              </span>
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              AI দিয়ে তাৎক্ষণিক গ্রামার ড্রাফট তৈরি করুন অথবা নিজের ফর্মুলা ও শর্টকাট টেকনিক লিখে প্রকাশ করুন
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              setAiTopicInput('');
              setIsAIOpen(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 flex items-center gap-2 transition-all hover:scale-105"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>✨ AI অটো-জেনারেট</span>
          </button>

          <button
            type="button"
            onClick={openCreateNew}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition-all hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            <span>নতুন টপিক যোগ করুন</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <p className="font-bold text-sm">{successMsg}</p>
          </div>
          <button onClick={() => setSuccessMsg(null)} className="text-emerald-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="font-bold text-sm">{error}</p>
          </div>
          <button onClick={() => setError(null)} className="text-rose-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Topics Grid */}
      {loading ? (
        <div className="p-12 text-center text-slate-400">
          <Loader2 className="w-8 h-8 mx-auto animate-spin text-emerald-500 mb-2" />
          <p className="font-bold">গ্রামার পাঠসমূহ লোড হচ্ছে...</p>
        </div>
      ) : topics.length === 0 ? (
        <div className="p-12 text-center bg-slate-900/60 rounded-3xl border border-slate-800 text-slate-400 space-y-3">
          <BookOpen className="w-12 h-12 mx-auto text-slate-600" />
          <p className="font-bold text-base text-slate-300">কোনো গ্রামার টপিক পাওয়া যায়নি</p>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            উপরে "AI অটো-জেনারেট" বা "নতুন টপিক যোগ করুন" বাটনে ক্লিক করে প্রথম গ্রামার পাঠ তৈরি করুন।
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topics.map((t) => (
            <div
              key={t.id}
              className="bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-3xl p-5 text-white flex flex-col justify-between transition-all duration-200 shadow-xl group"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-bold uppercase tracking-wider">
                    {t.category || 'GRAMMAR'}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 ${
                    t.isPublished ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {t.isPublished ? <Globe className="w-2.5 h-2.5" /> : <Lock className="w-2.5 h-2.5" />}
                    {t.isPublished ? 'প্রকাশিত' : 'ড্রাফট'}
                  </span>
                </div>

                <div>
                  <h3 className="font-black text-base text-white group-hover:text-emerald-400 transition-colors">
                    {t.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {t.summary || 'কোনো সারসংক্ষেপ যুক্ত করা হয়নি।'}
                  </p>
                </div>

                {t.teacherNotes && (
                  <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-amber-300/90 font-medium">
                    💡 {t.teacherNotes}
                  </div>
                )}

                <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                  <span>📐 {t.rules?.length || 0}টি সূত্র</span>
                  <span>📝 {t.quiz?.length || 0}টি কুইজ</span>
                  <span>🎓 {t.level || 'সকল শ্রেণি'}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => openEdit(t)}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-emerald-600/30 hover:text-emerald-400 text-slate-300 font-bold text-xs transition-colors flex items-center gap-1.5"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>সম্পাদনা ও প্রকাশ</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(t.id, t.title)}
                  className="p-1.5 rounded-xl bg-slate-800/60 hover:bg-rose-600/30 hover:text-rose-400 text-slate-400 transition-colors"
                  title="মুছে ফেলুন"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. AI AUTO-GENERATE MODAL */}
      {/* ========================================================================= */}
      {isAIOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-purple-500/40 rounded-3xl max-w-lg w-full p-6 text-white shadow-2xl space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-white">AI গ্রামার অটো-জেনারেটর</h3>
                  <p className="text-xs text-slate-400">টপিকের নাম লিখুন, AI সম্পূর্ণ পাঠ ড্রাফট করে দিবে</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAIOpen(false)}
                className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">
                  গ্রামার টপিকের নাম (Topic Name) *
                </label>
                <input
                  type="text"
                  value={aiTopicInput}
                  onChange={(e) => setAiTopicInput(e.target.value)}
                  placeholder="যেমন: Direct & Indirect Speech, Conditionals, Tag Questions..."
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">
                  লক্ষ্য শ্রেণি / লেভেল
                </label>
                <select
                  value={aiLevelInput}
                  onChange={(e) => setAiLevelInput(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="Class 6 - 8 (JSC / Junior)">Class 6 - 8 (JSC / Junior)</option>
                  <option value="Class 9 - 10 (SSC)">Class 9 - 10 (SSC)</option>
                  <option value="Class 11 - 12 (HSC)">Class 11 - 12 (HSC)</option>
                  <option value="University & Medical Admission">University & Medical Admission</option>
                </select>
              </div>

              {/* Quick Suggestion Pills */}
              <div>
                <label className="text-[11px] font-bold text-slate-400 block mb-2">
                  দ্রুত সাজেশন (ক্লিক করে নির্বাচন করুন):
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {['Narration (Speech)', 'Conditionals', 'Tag Questions', 'Transformation of Sentences', 'Appropriate Prepositions', 'Completing Sentences'].map((sug) => (
                    <button
                      key={sug}
                      type="button"
                      onClick={() => setAiTopicInput(sug)}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-purple-600/30 text-purple-300 border border-slate-700 text-xs font-medium transition-colors"
                    >
                      {sug}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAIOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
              >
                বাতিল
              </button>

              <button
                type="button"
                onClick={handleAIGenerate}
                disabled={aiGenerating || !aiTopicInput.trim()}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold text-xs shadow-lg flex items-center gap-2"
              >
                {aiGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>AI ড্রাফট তৈরি করছে...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>ড্রাফট তৈরি করুন</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. RICH GRAMMAR LESSON EDITOR MODAL */}
      {/* ========================================================================= */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-4xl w-full p-6 text-white shadow-2xl flex flex-col max-h-[90vh] my-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 flex-shrink-0">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-lg text-white">
                    {editingTopic ? 'গ্রামার পাঠ সম্পাদনা ও পাবলিশ' : 'নতুন গ্রামার পাঠ যুক্ত করুন'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    শিক্ষক নিজের টেকনিক ও সূত্র সাজিয়ে সরাসরি স্টুডেন্ট পোর্টালে প্রকাশ করতে পারবেন
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsEditorOpen(false)}
                className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <div className="overflow-y-auto py-5 space-y-6 flex-1 pr-1">
              {/* Basic Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-slate-300 block mb-1">টপিকের শিরোনাম *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="যেমন: Right Form of Verbs Masterclass"
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">ক্যাটাগরি</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                  >
                    <option value="TENSE">Tense & Time</option>
                    <option value="VOICE">Voice Change</option>
                    <option value="VERBS">Right Form of Verbs</option>
                    <option value="NARRATION">Narration & Speech</option>
                    <option value="CONDITIONALS">Conditionals</option>
                    <option value="PREPOSITIONS">Prepositions</option>
                    <option value="TAG_QUESTIONS">Tag Questions</option>
                    <option value="GENERAL">General Grammar</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">লক্ষ্য শ্রেণি / লেভেল</label>
                  <input
                    type="text"
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                    placeholder="যেমন: SSC & HSC 2026"
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">প্রকাশের স্ট্যাটাস</label>
                  <div className="flex items-center gap-3 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer text-sm">
                      <input
                        type="checkbox"
                        checked={formData.isPublished}
                        onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                        className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="font-semibold text-emerald-400">স্টুডেন্ট ড্যাশবোর্ডে লাইভ রাখুন</span>
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">সংক্ষিপ্ত বিবরণ (Summary)</label>
                <textarea
                  rows={2}
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  placeholder="পাঠের মূল বিষয়বস্তু..."
                  className="w-full px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-amber-300 block mb-1">
                  💡 শিক্ষক / পরিচালকের বিশেষ নোট ও শর্টকাট টেকনিক
                </label>
                <input
                  type="text"
                  value={formData.teacherNotes}
                  onChange={(e) => setFormData({ ...formData, teacherNotes: e.target.value })}
                  placeholder="যেমন: আলমগীর স্যারের স্পেশাল টেকনিক..."
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-amber-500/40 rounded-xl text-sm text-amber-200 focus:ring-2 focus:ring-amber-500 outline-none font-medium"
                />
              </div>

              {/* Master Rules Form */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-black text-sm text-emerald-400 flex items-center gap-2">
                    <Layers className="w-4 h-4" />
                    <span>মাস্টার গ্রামার রুলস ও সূত্র তালিকা ({formData.rules.length})</span>
                  </h4>
                  <button
                    type="button"
                    onClick={addRuleRow}
                    className="px-3 py-1 bg-slate-800 hover:bg-emerald-600/30 text-emerald-400 rounded-xl text-xs font-bold flex items-center gap-1 border border-slate-700"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>নতুন নিয়ম যোগ করুন</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {formData.rules.map((rule, rIdx) => (
                    <div key={rIdx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 relative">
                      <button
                        type="button"
                        onClick={() => removeRuleRow(rIdx)}
                        className="absolute right-3 top-3 text-slate-500 hover:text-rose-400"
                        title="নিয়মটি মুছুন"
                      >
                        <X className="w-4 h-4" />
                      </button>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pr-6">
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase">নিয়মের নাম (English)</label>
                          <input
                            type="text"
                            value={rule.name || ''}
                            onChange={(e) => updateRuleField(rIdx, 'name', e.target.value)}
                            placeholder="e.g. Present Continuous Formula"
                            className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase">বাংলা শিরোনাম</label>
                          <input
                            type="text"
                            value={rule.nameBn || ''}
                            onChange={(e) => updateRuleField(rIdx, 'nameBn', e.target.value)}
                            placeholder="যেমন: ঘটমান বর্তমান কাল"
                            className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-emerald-400 uppercase">মূল সূত্র / স্ট্রাকচার (Formula)</label>
                        <input
                          type="text"
                          value={rule.formula || ''}
                          onChange={(e) => updateRuleField(rIdx, 'formula', e.target.value)}
                          placeholder="Subject + am/is/are + V1+ing + Extension"
                          className="w-full px-3 py-1.5 bg-slate-900 border border-emerald-500/40 rounded-lg text-xs font-mono text-emerald-300"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase">উদাহরণ (English)</label>
                          <input
                            type="text"
                            value={rule.exampleEn || ''}
                            onChange={(e) => updateRuleField(rIdx, 'exampleEn', e.target.value)}
                            placeholder="She is writing a letter."
                            className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase">বাংলা অনুবাদ</label>
                          <input
                            type="text"
                            value={rule.exampleBn || ''}
                            onChange={(e) => updateRuleField(rIdx, 'exampleBn', e.target.value)}
                            placeholder="সে একটি চিঠি লিখছে।"
                            className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Interactive Quizzes Form */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-black text-sm text-indigo-400 flex items-center gap-2">
                    <ListChecks className="w-4 h-4" />
                    <span>ইন্টারেক্টিভ কুইজ ও প্রশ্নমালা ({formData.quiz.length})</span>
                  </h4>
                  <button
                    type="button"
                    onClick={addQuizRow}
                    className="px-3 py-1 bg-slate-800 hover:bg-indigo-600/30 text-indigo-400 rounded-xl text-xs font-bold flex items-center gap-1 border border-slate-700"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>নতুন কুইজ প্রশ্ন যোগ করুন</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {formData.quiz.map((q, qIdx) => (
                    <div key={qIdx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 relative">
                      <button
                        type="button"
                        onClick={() => removeQuizRow(qIdx)}
                        className="absolute right-3 top-3 text-slate-500 hover:text-rose-400"
                        title="প্রশ্নটি মুছুন"
                      >
                        <X className="w-4 h-4" />
                      </button>

                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase">প্রশ্ন {qIdx + 1} *</label>
                        <input
                          type="text"
                          value={q.question || ''}
                          onChange={(e) => updateQuizField(qIdx, 'question', e.target.value)}
                          placeholder="e.g. Choose the correct passive sentence:"
                          className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white pr-8"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {(q.options || ['', '', '', '']).map((opt, oIdx) => (
                          <div key={oIdx} className="flex items-center gap-2">
                            <input
                              type="radio"
                              name={`correct-opt-${qIdx}`}
                              checked={q.correctAnswerIndex === oIdx}
                              onChange={() => updateQuizField(qIdx, 'correctAnswerIndex', oIdx)}
                              className="text-emerald-500 focus:ring-emerald-500"
                              title="সঠিক উত্তর হিসেবে চিহ্নিত করুন"
                            />
                            <input
                              type="text"
                              value={opt}
                              onChange={(e) => updateQuizOption(qIdx, oIdx, e.target.value)}
                              placeholder={`অপশন ${oIdx + 1}`}
                              className={`w-full px-2.5 py-1 bg-slate-900 border rounded-lg text-xs ${
                                q.correctAnswerIndex === oIdx
                                  ? 'border-emerald-500 text-emerald-300 font-bold'
                                  : 'border-slate-700 text-slate-300'
                              }`}
                            />
                          </div>
                        ))}
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase">বাংলা ব্যাখ্যা (Explanation)</label>
                        <input
                          type="text"
                          value={q.explanation || ''}
                          onChange={(e) => updateQuizField(qIdx, 'explanation', e.target.value)}
                          placeholder="কেন এই উত্তরটি সঠিক..."
                          className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-300"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between flex-shrink-0">
              <span className="text-xs text-slate-400">
                * প্রকাশিত হলে শিক্ষার্থীরা তাৎক্ষণিকভাবে দেখতে ও কুইজ দিতে পারবে
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
                >
                  বাতিল
                </button>
                <button
                  type="button"
                  onClick={handleSaveTopic}
                  disabled={saving || !formData.title.trim()}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-lg shadow-emerald-600/30 flex items-center gap-2"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>সংরক্ষণ হচ্ছে...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>{editingTopic ? 'আপডেট ও পাবলিশ' : 'সংরক্ষণ ও পাবলিশ'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
