import React, { useState, useEffect } from 'react';
import {
  Search, Filter, Plus, Edit3, Trash2, CheckCircle2,
  AlertCircle, Upload, Layers, BookOpen, Sliders, Check,
  X, Eye, HelpCircle, FileText, ChevronLeft, ChevronRight, Copy
} from 'lucide-react';
import { grammarAPI } from '../../services/api';
import { GRAMMAR_CHAPTERS } from '../../data/grammar/grammarChaptersData';

export default function GrammarQuestionBankAdmin() {
  const [questions, setQuestions] = useState([]);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // Filters
  const [search, setSearch] = useState('');
  const [chapterId, setChapterId] = useState('ALL');
  const [difficulty, setDifficulty] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [previewQuestion, setPreviewQuestion] = useState(null);
  const [editingQuestion, setEditingQuestion] = useState(null);

  // Create/Edit Form State
  const [formData, setFormData] = useState({
    chapterId: 1,
    topicId: 1,
    questionEn: '',
    questionBn: '',
    options: ['', '', '', ''],
    correctOptionIndex: 0,
    explanationEn: '',
    explanationBn: '',
    difficulty: 'MEDIUM',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'PRACTICE',
    board: '',
    year: '',
    tags: '',
    status: 'ACTIVE'
  });

  // Bulk Import State
  const [importJsonText, setImportJsonText] = useState('');
  const [importReport, setImportReport] = useState(null);
  const [importing, setImporting] = useState(false);

  // Status message
  const [statusMessage, setStatusMessage] = useState(null);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 15 };
      if (search.trim()) params.search = search.trim();
      if (chapterId !== 'ALL') params.chapterId = chapterId;
      if (difficulty !== 'ALL') params.difficulty = difficulty;
      if (statusFilter !== 'ALL') params.status = statusFilter;

      const res = await grammarAPI.getMCQs(params);
      if (res?.success) {
        setQuestions(res.data || []);
        setTotalQuestions(res.total || 0);
        setTotalPages(res.totalPages || 1);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [page, chapterId, difficulty, statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchQuestions();
  };

  const handleOpenCreate = () => {
    setEditingQuestion(null);
    setFormData({
      chapterId: chapterId !== 'ALL' ? Number(chapterId) : 1,
      topicId: 1,
      questionEn: '',
      questionBn: '',
      options: ['', '', '', ''],
      correctOptionIndex: 0,
      explanationEn: '',
      explanationBn: '',
      difficulty: 'MEDIUM',
      marks: 1,
      negativeMarks: 0.25,
      sourceType: 'PRACTICE',
      board: '',
      year: '',
      tags: '',
      status: 'ACTIVE'
    });
    setIsCreateModalOpen(true);
  };

  const handleOpenEdit = (q) => {
    setEditingQuestion(q);
    setFormData({
      chapterId: q.chapterId || 1,
      topicId: q.topicId || 1,
      questionEn: q.questionEn || '',
      questionBn: q.questionBn || '',
      options: q.options || ['', '', '', ''],
      correctOptionIndex: q.correctOptionIndex !== undefined ? q.correctOptionIndex : 0,
      explanationEn: q.explanationEn || '',
      explanationBn: q.explanationBn || '',
      difficulty: q.difficulty || 'MEDIUM',
      marks: q.marks || 1,
      negativeMarks: q.negativeMarks || 0,
      sourceType: q.sourceType || 'PRACTICE',
      board: q.board || '',
      year: q.year || '',
      tags: Array.isArray(q.tags) ? q.tags.join(', ') : '',
      status: q.status || 'ACTIVE'
    });
    setIsCreateModalOpen(true);
  };

  const handleSaveQuestion = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : []
      };

      if (editingQuestion) {
        await grammarAPI.updateMCQ(editingQuestion.id, payload);
        setStatusMessage('প্রশ্ন সফলভাবে আপডেট করা হয়েছে!');
      } else {
        await grammarAPI.createMCQ(payload);
        setStatusMessage('নতুন প্রশ্ন সফলভাবে যুক্ত হয়েছে!');
      }

      setIsCreateModalOpen(false);
      fetchQuestions();
      setTimeout(() => setStatusMessage(null), 4000);
    } catch (err) {
      alert(err.message || 'প্রশ্ন সংরক্ষণ করতে ব্যর্থ হয়েছে।');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('আপনি কি নিশ্চিত যে এই প্রশ্নটি মুছে ফেলতে চান?')) return;
    try {
      await grammarAPI.deleteMCQ(id);
      fetchQuestions();
      setStatusMessage('প্রশ্ন মুছে ফেলা হয়েছে।');
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (err) {
      alert(err.message || 'ব্যর্থ হয়েছে');
    }
  };

  const handleImportDryRun = async () => {
    try {
      setImporting(true);
      const parsed = JSON.parse(importJsonText);
      const res = await grammarAPI.bulkImportMCQs({
        questions: Array.isArray(parsed) ? parsed : [parsed],
        defaultChapterId: chapterId !== 'ALL' ? Number(chapterId) : 1,
        dryRun: true
      });
      if (res?.success) {
        setImportReport(res);
      }
    } catch (e) {
      alert('অবৈধ JSON ফরম্যাট: ' + e.message);
    } finally {
      setImporting(false);
    }
  };

  const handleConfirmImport = async () => {
    try {
      setImporting(true);
      const parsed = JSON.parse(importJsonText);
      const res = await grammarAPI.bulkImportMCQs({
        questions: Array.isArray(parsed) ? parsed : [parsed],
        defaultChapterId: chapterId !== 'ALL' ? Number(chapterId) : 1,
        dryRun: false
      });
      if (res?.success) {
        alert(res.message);
        setIsImportModalOpen(false);
        setImportJsonText('');
        setImportReport(null);
        fetchQuestions();
      }
    } catch (e) {
      alert('আমদানি করতে ব্যর্থ হয়েছে: ' + e.message);
    } finally {
      setImporting(false);
    }
  };

  const letter = (idx) => String.fromCharCode(65 + idx);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            সেন্ট্রাল গ্রামার প্রশ্নব্যাংক ব্যবস্থাপনা (Question Bank CMS)
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            অধ্যায় ০১–২৩ এর সকল MCQ প্রশ্ন তৈরি, সম্পাদনা, ফিল্টারিং ও বাল্ক ইমপোর্ট করুন।
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={() => setIsImportModalOpen(true)}
            className="px-4 py-2 rounded-2xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>বাল্ক ইমপোর্ট (JSON)</span>
          </button>

          <button
            type="button"
            onClick={handleOpenCreate}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-2xl shadow-md shadow-indigo-600/20 flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>নতুন প্রশ্ন তৈরি</span>
          </button>
        </div>
      </div>

      {statusMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Filter Bar */}
      <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {/* Search */}
          <div>
            <label className="text-[11px] font-bold text-slate-500 block mb-1">অনুসন্ধান:</label>
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="প্রশ্ন বা ট্যাগ খুঁজুন..."
                className="w-full pl-8 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </form>
          </div>

          {/* Chapter */}
          <div>
            <label className="text-[11px] font-bold text-slate-500 block mb-1">অধ্যায়:</label>
            <select
              value={chapterId}
              onChange={(e) => {
                setChapterId(e.target.value);
                setPage(1);
              }}
              className="w-full p-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800"
            >
              <option value="ALL">সকল অধ্যায় (All Chapters)</option>
              {GRAMMAR_CHAPTERS.map(c => (
                <option key={c.id} value={c.id}>
                  Ch {c.chapterNo || c.id} — {c.titleBn}
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty */}
          <div>
            <label className="text-[11px] font-bold text-slate-500 block mb-1">কাঠিন্য:</label>
            <select
              value={difficulty}
              onChange={(e) => {
                setDifficulty(e.target.value);
                setPage(1);
              }}
              className="w-full p-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800"
            >
              <option value="ALL">সকল স্তর</option>
              <option value="EASY">EASY</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HARD">HARD</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="text-[11px] font-bold text-slate-500 block mb-1">স্ট্যাটাস:</label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="w-full p-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800"
            >
              <option value="ALL">সকল প্রশ্ন</option>
              <option value="ACTIVE">ACTIVE / প্রকাশিত</option>
              <option value="DRAFT">DRAFT / ড্রাফট</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
          <span>মোট প্রশ্ন: <strong>{totalQuestions}টি</strong></span>
          <span>পৃষ্ঠা: <strong>{page} / {totalPages}</strong></span>
        </div>
      </div>

      {/* Questions Table / List */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 text-xs">প্রশ্ন লোড হচ্ছে...</div>
      ) : questions.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-slate-400 text-sm">
          কোনো প্রশ্ন খুঁজে পাওয়া যায়নি।
        </div>
      ) : (
        <div className="space-y-3">
          {questions.map((q) => (
            <div
              key={q.id}
              className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap text-xs">
                  <span className="font-mono font-bold text-slate-500">#{q.id}</span>
                  <span className="px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold">
                    অধ্যায় {q.chapterId || 1}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold">
                    {q.difficulty}
                  </span>
                  {q.board && (
                    <span className="px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/60 text-amber-600 font-bold">
                      {q.board} '{q.year}
                    </span>
                  )}
                  <span className={`px-2 py-0.5 rounded font-bold ${
                    q.status === 'ACTIVE'
                      ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60'
                      : 'bg-slate-100 text-slate-500'
                  }`}>
                    {q.status}
                  </span>
                </div>

                <h4 className="font-bold text-sm text-slate-900 dark:text-white font-english">
                  {q.questionEn}
                </h4>
                {q.questionBn && (
                  <p className="text-xs text-slate-400">{q.questionBn}</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1.5 flex-shrink-0 self-end md:self-center">
                <button
                  type="button"
                  onClick={() => setPreviewQuestion(q)}
                  className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 cursor-pointer"
                  title="প্রিভিউ দেখুন"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleOpenEdit(q)}
                  className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-indigo-600 dark:text-indigo-400 cursor-pointer"
                  title="সম্পাদনা করুন"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(q.id)}
                  className="p-2 rounded-xl border border-rose-200 dark:border-rose-900/60 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 cursor-pointer"
                  title="মুছে ফেলুন"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {/* Pagination */}
          <div className="flex items-center justify-center gap-2 pt-4">
            <button
              type="button"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 disabled:opacity-40 text-xs font-bold cursor-pointer"
            >
              পূর্ববর্তী
            </button>
            <span className="text-xs font-bold text-slate-500 px-2">
              {page} / {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 disabled:opacity-40 text-xs font-bold cursor-pointer"
            >
              পরবর্তী
            </button>
          </div>
        </div>
      )}

      {/* ================================================================ */}
      {/* QUESTION PREVIEW MODAL */}
      {/* ================================================================ */}
      {previewQuestion && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                প্রশ্ন প্রিভিউ (#{previewQuestion.id})
              </span>
              <button
                type="button"
                onClick={() => setPreviewQuestion(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-1">
              <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white font-english">
                {previewQuestion.questionEn}
              </h4>
              {previewQuestion.questionBn && (
                <p className="text-xs text-slate-500">{previewQuestion.questionBn}</p>
              )}
            </div>

            <div className="space-y-2 pt-2">
              {previewQuestion.options?.map((opt, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border text-xs font-english flex items-center justify-between ${
                    idx === previewQuestion.correctOptionIndex
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400 text-emerald-900 dark:text-emerald-200 font-bold'
                      : 'bg-slate-50 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span>({letter(idx)}) {opt}</span>
                  {idx === previewQuestion.correctOptionIndex && (
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">সঠিক উত্তর ✓</span>
                  )}
                </div>
              ))}
            </div>

            {(previewQuestion.explanationBn || previewQuestion.explanationEn) && (
              <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-xs text-indigo-900 dark:text-indigo-200 space-y-1">
                <span className="font-bold">ব্যাখ্যা:</span>
                <p>{previewQuestion.explanationBn || previewQuestion.explanationEn}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================================================================ */}
      {/* CREATE / EDIT QUESTION MODAL */}
      {/* ================================================================ */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5 my-8 animate-in fade-in zoom-in duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-black text-base text-slate-900 dark:text-white">
                {editingQuestion ? 'প্রশ্ন সম্পাদনা করুন' : 'নতুন MCQ প্রশ্ন তৈরি করুন'}
              </h3>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveQuestion} className="space-y-4">
              {/* Question Text (En & Bn) */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300">
                  প্রশ্ন টেক্সট (ইংরেজি) *:
                </label>
                <textarea
                  required
                  rows={2}
                  value={formData.questionEn}
                  onChange={(e) => setFormData({ ...formData, questionEn: e.target.value })}
                  placeholder="e.g. Choose the correct form of verb: He went to school..."
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-xs font-english"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300">
                  প্রশ্ন টেক্সট (বাংলা অনুবাদ/নির্দেশনা):
                </label>
                <input
                  type="text"
                  value={formData.questionBn}
                  onChange={(e) => setFormData({ ...formData, questionBn: e.target.value })}
                  placeholder="e.g. শূন্যস্থানে সঠিক ক্রিয়ারূপ বসান..."
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-xs"
                />
              </div>

              {/* Chapter & Difficulty */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">অধ্যায় *:</label>
                  <select
                    value={formData.chapterId}
                    onChange={(e) => setFormData({ ...formData, chapterId: Number(e.target.value) })}
                    className="w-full p-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800"
                  >
                    {GRAMMAR_CHAPTERS.map(c => (
                      <option key={c.id} value={c.id}>
                        Ch {c.chapterNo || c.id} — {c.titleBn}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">কাঠিন্য:</label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                    className="w-full p-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800"
                  >
                    <option value="EASY">EASY</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HARD">HARD</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">স্ট্যাটাস:</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full p-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800"
                  >
                    <option value="ACTIVE">ACTIVE (প্রকাশিত)</option>
                    <option value="DRAFT">DRAFT (ড্রাফট)</option>
                  </select>
                </div>
              </div>

              {/* 4 Options */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300">
                  ৪টি অপশন এবং সঠিক উত্তর চিহ্নিত করুন *:
                </label>
                {formData.options.map((opt, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, correctOptionIndex: idx })}
                      className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center flex-shrink-0 cursor-pointer ${
                        formData.correctOptionIndex === idx
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-emerald-100'
                      }`}
                      title="সঠিক উত্তর হিসেবে চিহ্নিত করতে ক্লিক করুন"
                    >
                      {letter(idx)}
                    </button>
                    <input
                      required
                      type="text"
                      value={opt}
                      onChange={(e) => {
                        const updated = [...formData.options];
                        updated[idx] = e.target.value;
                        setFormData({ ...formData, options: updated });
                      }}
                      placeholder={`অপশন ${letter(idx)}...`}
                      className="flex-1 p-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 font-english"
                    />
                  </div>
                ))}
              </div>

              {/* Explanations */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300">
                  বাংলা ও বিস্তারিত ব্যাখ্যা (Explanation) *:
                </label>
                <textarea
                  rows={2}
                  value={formData.explanationBn}
                  onChange={(e) => setFormData({ ...formData, explanationBn: e.target.value })}
                  placeholder="সঠিক উত্তরের কারণ এবং প্রাসঙ্গিক গ্রামার রুল বর্ণনা করুন..."
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-xs font-bangla"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-500 cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer"
                >
                  {editingQuestion ? 'আপডেট করুন' : 'সংরক্ষণ করুন'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================================================================ */}
      {/* BULK IMPORT MODAL */}
      {/* ================================================================ */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 animate-in fade-in zoom-in duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-black text-base text-slate-900 dark:text-white">
                বাল্ক প্রশ্ন আমদানি ও ডুপ্লিকেট যাচাইকরণ
              </h3>
              <button
                type="button"
                onClick={() => setIsImportModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-400">
              নিচের টেক্সট এরিয়াতে প্রশ্নসমূহের JSON অ্যারে পেস্ট করুন। আমদানি করার পূর্বে ডুপ্লিকেট এবং ফরম্যাট ত্রুটি স্বয়ংক্রিয়ভাবে শনাক্ত হবে।
            </p>

            <textarea
              rows={8}
              value={importJsonText}
              onChange={(e) => setImportJsonText(e.target.value)}
              placeholder={`[
  {
    "questionEn": "He walked fast lest he _____ miss the train.",
    "options": ["will", "can", "should", "would"],
    "correctAnswer": "C",
    "explanationBn": "Lest-এর পর should বসে।",
    "difficulty": "MEDIUM"
  }
]`}
              className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-xs font-mono"
            />

            {importReport && (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between font-bold">
                  <span className="text-emerald-600">বৈধ প্রশ্ন: {importReport.summary?.validCount}টি</span>
                  <span className="text-amber-500">ডুপ্লিকেট বাতিল: {importReport.summary?.duplicateCount}টি</span>
                  <span className="text-rose-500">ত্রুটিযুক্ত: {importReport.summary?.invalidCount}টি</span>
                </div>
              </div>
            )}

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={handleImportDryRun}
                disabled={importing || !importJsonText.trim()}
                className="px-4 py-2 rounded-xl border border-indigo-200 text-indigo-600 font-bold text-xs hover:bg-indigo-50 cursor-pointer disabled:opacity-40"
              >
                ডুপ্লিকেট ও প্রিভিউ যাচাই করুন
              </button>

              <button
                type="button"
                onClick={handleConfirmImport}
                disabled={importing || !importJsonText.trim()}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer disabled:opacity-40"
              >
                {importing ? 'আমদানি হচ্ছে...' : 'চূড়ান্ত আমদানি করুন'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
