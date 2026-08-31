import React, { useState, useEffect, useCallback } from 'react';
import {
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Copy,
  ExternalLink,
  Download,
  CheckCircle2,
  Clock,
  AlertCircle,
  Sparkles,
  BookOpen,
  RefreshCw,
  Layers,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  CheckSquare
} from 'lucide-react';
import api from '../../../services/api';
import QuestionDetailModal from './QuestionDetailModal';
import { DEFAULT_QUESTION_BANK } from '../../../data/questionBankDefaultData';

export default function QuestionBankBrowserView() {
  const [questions, setQuestions] = useState([]);
  const [stats, setStats] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Filters State
  const [filters, setFilters] = useState({
    classId: '',
    subjectId: '',
    board: '',
    year: '',
    chapter: '',
    questionType: '',
    difficulty: '',
    status: '',
    duplicateStatus: '',
    search: '',
    limit: 20,
    offset: 0
  });

  // Modal State
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    setErrorMessage(null);

    try {
      const params = {};
      Object.entries(filters).forEach(([k, v]) => {
        if (v !== '' && v !== null && v !== undefined) params[k] = v;
      });

      const res = await api.get('/questions', { params });
      if (res.data?.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
        setQuestions(res.data.data);
        setTotalCount(res.data.total || res.data.data.length);
        setStats(res.data.stats || null);
        setLoading(false);
        return;
      }
    } catch (err) {
      console.warn('API fetch notice, using built-in vault:', err?.message);
    }

    // Client-side fallback filter engine for instant offline/static Vercel experience
    let list = Array.isArray(DEFAULT_QUESTION_BANK) ? [...DEFAULT_QUESTION_BANK] : [];
    if (filters.subjectId) {
      list = list.filter(q => String(q.subjectId) === String(filters.subjectId));
    }
    if (filters.board) {
      list = list.filter(q => q.board && q.board.includes(filters.board));
    }
    if (filters.year) {
      list = list.filter(q => String(q.year).includes(String(filters.year)));
    }
    if (filters.chapter) {
      list = list.filter(q => q.chapter && q.chapter.toLowerCase().includes(filters.chapter.toLowerCase()));
    }
    if (filters.difficulty) {
      list = list.filter(q => q.difficulty === filters.difficulty);
    }
    if (filters.status) {
      list = list.filter(q => q.status === filters.status);
    }
    if (filters.search) {
      const s = filters.search.toLowerCase();
      list = list.filter(q => 
        (q.questionText && q.questionText.toLowerCase().includes(s)) ||
        (q.chapter && q.chapter.toLowerCase().includes(s)) ||
        (q.board && q.board.toLowerCase().includes(s)) ||
        (q.explanation && q.explanation.toLowerCase().includes(s))
      );
    }

    const total = list.length;
    const offset = Number(filters.offset) || 0;
    const limit = Number(filters.limit) || 20;
    const paginated = list.slice(offset, offset + limit);

    setQuestions(paginated);
    setTotalCount(total);
    setStats({
      totalCount: DEFAULT_QUESTION_BANK.length,
      approvedCount: DEFAULT_QUESTION_BANK.filter(q => q.status === 'APPROVED').length,
      familiesCount: 105,
      sourceDocsCount: 12
    });
    setLoading(false);
  }, [filters]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const handleDelete = async (id) => {
    if (!window.confirm('আপনি কি নিশ্চিত যে এই প্রশ্নটি মুছে ফেলতে চান?')) return;
    try {
      await api.delete(`/questions/${id}`);
      fetchQuestions();
    } catch (err) {
      alert('প্রশ্ন মোছা ব্যর্থ হয়েছে: ' + (err.response?.data?.error?.message || err.message));
    }
  };

  const handlePageChange = (newOffset) => {
    setFilters(prev => ({ ...prev, offset: newOffset }));
  };

  const boardsList = ['ঢাকা', 'রাজশাহী', 'কুমিল্লা', 'যশোর', 'চট্টগ্রাম', 'বরিশাল', 'সিলেট', 'দিনাজপুর', 'ময়মনসিংহ', 'মাদ্রাসা'];
  const yearsList = ['2026', '2025', '2024', '2023', '2022', '2021', '2020'];

  return (
    <div className="space-y-6">
      {/* 1. STATS OVERVIEW */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="text-slate-400 text-xs font-medium">মোট প্রশ্ন ব্যাংক ভল্ট</div>
          <div className="text-2xl font-black text-white mt-1">{stats?.total || totalCount}টি</div>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="text-indigo-400 text-xs font-medium">MCQ প্রশ্নসমূহ</div>
          <div className="text-2xl font-black text-indigo-400 mt-1">{stats?.mcqCount || 0}টি</div>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="text-emerald-400 text-xs font-medium">অনুমোদিত ও ভেরিফাইড</div>
          <div className="text-2xl font-black text-emerald-400 mt-1">{stats?.approvedCount || 0}টি</div>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="text-amber-400 text-xs font-medium">রিভিউ প্রয়োজন</div>
          <div className="text-2xl font-black text-amber-400 mt-1">{(stats?.pendingCount || 0) + (stats?.reviewRequiredCount || 0)}টি</div>
        </div>
      </div>

      {/* 2. SEARCH & FILTER BAR */}
      <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl text-xs">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="প্রশ্নের বক্তব্য, অধ্যায়, টপিক বা বোর্ড দিয়ে সার্চ করুন..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value, offset: 0 }))}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <button
            type="button"
            onClick={fetchQuestions}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition flex items-center space-x-1.5 shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>রিফ্রেশ</span>
          </button>
        </div>

        {/* Filters Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {/* Board */}
          <select
            value={filters.board}
            onChange={(e) => setFilters(prev => ({ ...prev, board: e.target.value, offset: 0 }))}
            className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 focus:outline-none"
          >
            <option value="">সকল বোর্ড</option>
            {boardsList.map(b => <option key={b} value={b}>{b} বোর্ড</option>)}
          </select>

          {/* Year */}
          <select
            value={filters.year}
            onChange={(e) => setFilters(prev => ({ ...prev, year: e.target.value, offset: 0 }))}
            className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 focus:outline-none"
          >
            <option value="">সকল সাল</option>
            {yearsList.map(y => <option key={y} value={y}>{y} সাল</option>)}
          </select>

          {/* Question Type */}
          <select
            value={filters.questionType}
            onChange={(e) => setFilters(prev => ({ ...prev, questionType: e.target.value, offset: 0 }))}
            className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 focus:outline-none"
          >
            <option value="">সকল ধরন</option>
            <option value="MCQ">MCQ (বহুনির্বাচনী)</option>
            <option value="CQ">CQ (সৃজনশীল)</option>
            <option value="SQ">SQ (সংক্ষিপ্ত)</option>
          </select>

          {/* Status */}
          <select
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value, offset: 0 }))}
            className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 focus:outline-none"
          >
            <option value="">সকল স্ট্যাটাস</option>
            <option value="APPROVED">ভেরিফাইড (Approved)</option>
            <option value="PENDING_REVIEW">রিভিউ প্রয়োজন (Pending)</option>
            <option value="PARSER_REVIEW_REQUIRED">পার্সার সতর্কতা</option>
          </select>

          {/* Duplicate Status */}
          <select
            value={filters.duplicateStatus}
            onChange={(e) => setFilters(prev => ({ ...prev, duplicateStatus: e.target.value, offset: 0 }))}
            className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 focus:outline-none"
          >
            <option value="">ডুপ্লিকেট ফিল্টার</option>
            <option value="UNIQUE">অনন্য প্রশ্ন (Unique)</option>
            <option value="LIKELY_DUPLICATE">সম্ভাব্য ডুপ্লিকেট</option>
            <option value="EXACT_DUPLICATE">হুবহু ডুপ্লিকেট</option>
          </select>

          {/* Reset Filters */}
          <button
            type="button"
            onClick={() => setFilters({
              classId: '', subjectId: '', board: '', year: '', chapter: '', questionType: '', difficulty: '', status: '', duplicateStatus: '', search: '', limit: 20, offset: 0
            })}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white font-bold transition text-center"
          >
            ফিল্টার রিসেট
          </button>
        </div>
      </div>

      {/* 3. QUESTIONS TABLE & LIST */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div>
            মোট <span className="text-white font-bold">{totalCount}টি</span> প্রশ্ন পাওয়া গেছে
          </div>
          <div>
            পৃষ্ঠা {Math.floor(filters.offset / filters.limit) + 1} / {Math.ceil(totalCount / filters.limit) || 1}
          </div>
        </div>

        {loading ? (
          <div className="p-16 text-center text-slate-400 space-y-3">
            <RefreshCw className="w-8 h-8 mx-auto animate-spin text-indigo-400" />
            <p className="text-xs">প্রশ্ন লোড হচ্ছে...</p>
          </div>
        ) : questions.length === 0 ? (
          <div className="p-16 text-center text-slate-500 space-y-3">
            <HelpCircle className="w-10 h-10 mx-auto text-slate-600" />
            <p className="text-sm font-semibold text-slate-400">কোনো প্রশ্ন পাওয়া যায়নি</p>
            <p className="text-xs text-slate-600">ফিল্টার পরিবর্তন করুন অথবা নতুন প্রশ্ন আপলোড করুন।</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-800/60">
            {questions.map((q, idx) => (
              <div
                key={q.id}
                className="p-5 hover:bg-slate-800/30 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* QUESTION INFO */}
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2 py-0.5 rounded-lg bg-indigo-600/20 text-indigo-300 font-mono font-bold text-[10px]">
                      #{q.id}
                    </span>
                    <span className="px-2 py-0.5 rounded-lg bg-slate-800 text-slate-300 font-bold text-[10px]">
                      {q.questionType || 'MCQ'}
                    </span>
                    <span className="px-2 py-0.5 rounded-lg bg-cyan-600/20 text-cyan-300 font-bold text-[10px]">
                      {q.board} '{String(q.year).slice(-2)}
                    </span>
                    {q.chapter && (
                      <span className="text-[11px] text-slate-400 font-medium">
                        • {q.chapter}
                      </span>
                    )}

                    {/* Duplicate Badge */}
                    {q.duplicateStatus === 'EXACT_DUPLICATE' && (
                      <span className="px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 text-[10px] font-bold">
                        হুবহু ডুপ্লিকেট
                      </span>
                    )}
                    {q.duplicateStatus === 'LIKELY_DUPLICATE' && (
                      <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-[10px] font-bold">
                        সম্ভাব্য ডুপ্লিকেট
                      </span>
                    )}
                  </div>

                  {/* Question Stem */}
                  <h4 className="text-sm font-semibold text-white leading-relaxed line-clamp-2">
                    {q.questionText}
                  </h4>

                  {/* Options Snippet */}
                  {Array.isArray(q.options) && q.options.length > 0 && (
                    <div className="flex flex-wrap gap-2 text-xs pt-1">
                      {q.options.slice(0, 4).map((opt) => (
                        <span
                          key={opt.key}
                          className={`px-2.5 py-1 rounded-xl border text-[11px] flex items-center space-x-1 ${
                            q.answer === opt.key
                              ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300 font-bold'
                              : 'bg-slate-950 border-slate-800 text-slate-400'
                          }`}
                        >
                          <span className="font-bold">{opt.key}.</span>
                          <span className="truncate max-w-[140px]">{opt.text}</span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* ACTIONS */}
                <div className="flex items-center space-x-2 shrink-0 self-end md:self-center">
                  <button
                    type="button"
                    onClick={() => setSelectedQuestion(q)}
                    className="px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white font-bold text-xs transition flex items-center space-x-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>বিস্তারিত দেখুন</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(q.id)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition"
                    title="মুছে ফেলুন"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* PAGINATION CONTROLS */}
        <div className="p-4 border-t border-slate-800 flex items-center justify-between text-xs bg-slate-900/80">
          <button
            type="button"
            disabled={filters.offset === 0 || loading}
            onClick={() => handlePageChange(Math.max(0, filters.offset - filters.limit))}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 transition flex items-center space-x-1"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>পূর্ববর্তী</span>
          </button>

          <span className="text-slate-400">
            {filters.offset + 1} - {Math.min(filters.offset + filters.limit, totalCount)} (মোট {totalCount})
          </span>

          <button
            type="button"
            disabled={filters.offset + filters.limit >= totalCount || loading}
            onClick={() => handlePageChange(filters.offset + filters.limit)}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 transition flex items-center space-x-1"
          >
            <span>পরবর্তী</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* DETAIL & SOURCE MODAL */}
      {selectedQuestion && (
        <QuestionDetailModal
          question={selectedQuestion}
          onClose={() => setSelectedQuestion(null)}
          onQuestionUpdated={() => {
            fetchQuestions();
            setSelectedQuestion(null);
          }}
        />
      )}
    </div>
  );
}
