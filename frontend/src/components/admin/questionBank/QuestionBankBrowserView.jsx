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
  CheckSquare,
  Award,
  GraduationCap
} from 'lucide-react';
import api from '../../../services/api';
import QuestionDetailModal from './QuestionDetailModal';
import QuestionDiagram from '../../common/QuestionDiagram';
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
    limit: 25,
    offset: 0
  });

  // Modal State
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [expandedSolutions, setExpandedSolutions] = useState({});

  const toggleSolution = (id) => {
    setExpandedSolutions(prev => ({ ...prev, [id]: !prev[id] }));
  };

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
        if (res.data.stats) {
          setStats(res.data.stats);
        }
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
    if (filters.questionType) {
      list = list.filter(q => q.questionType === filters.questionType);
    }
    if (filters.board) {
      list = list.filter(q => q.board && q.board.toLowerCase().includes(filters.board.toLowerCase()));
    }
    if (filters.year) {
      const yStr = String(filters.year);
      const bnYear = yStr.replace(/0/g, '০').replace(/1/g, '১').replace(/2/g, '২').replace(/3/g, '৩').replace(/4/g, '৪').replace(/5/g, '৫').replace(/6/g, '৬').replace(/7/g, '৭').replace(/8/g, '৮').replace(/9/g, '৯');
      const enYear = yStr.replace(/০/g, '0').replace(/১/g, '1').replace(/২/g, '2').replace(/৩/g, '3').replace(/৪/g, '4').replace(/৫/g, '5').replace(/৬/g, '6').replace(/৭/g, '7').replace(/৮/g, '8').replace(/৯/g, '9');
      list = list.filter(q => String(q.year).includes(yStr) || String(q.year).includes(bnYear) || String(q.year).includes(enYear));
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
    if (filters.duplicateStatus) {
      list = list.filter(q => q.duplicateStatus === filters.duplicateStatus);
    }
    if (filters.search) {
      const s = filters.search.toLowerCase();
      list = list.filter(q => 
        (q.questionText && q.questionText.toLowerCase().includes(s)) ||
        (q.question && q.question.toLowerCase().includes(s)) ||
        (q.chapter && q.chapter.toLowerCase().includes(s)) ||
        (q.board && q.board.toLowerCase().includes(s)) ||
        (q.explanation && q.explanation.toLowerCase().includes(s))
      );
    }

    const total = list.length;
    const offset = Number(filters.offset) || 0;
    const limit = Number(filters.limit) || 25;
    const paginated = list.slice(offset, offset + limit);

    const mcqs = DEFAULT_QUESTION_BANK.filter(q => q.questionType === 'MCQ').length;
    const cqs = DEFAULT_QUESTION_BANK.filter(q => q.questionType === 'CQ').length;
    const sqs = DEFAULT_QUESTION_BANK.filter(q => q.questionType === 'SQ').length;

    setQuestions(paginated);
    setTotalCount(total);
    setStats({
      total: DEFAULT_QUESTION_BANK.length,
      mcqCount: mcqs,
      cqCount: cqs,
      sqCount: sqs,
      approvedCount: DEFAULT_QUESTION_BANK.filter(q => q.status === 'APPROVED').length,
      pendingCount: 0,
      reviewRequiredCount: 0,
      duplicateCount: 0
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const subjectsList = [
    { id: '', name: 'সকল বিষয় (All Subjects)' },
    { id: '136', name: 'পদার্থবিজ্ঞান (Physics - 136)' },
    { id: '109', name: 'সাধারণ গণিত (General Math - 109)' },
    { id: '126', name: 'উচ্চতর গণিত (Higher Math - 126)' },
    { id: '137', name: 'রসায়ন (Chemistry - 137)' },
    { id: '138', name: 'জীববিজ্ঞান (Biology - 138)' }
  ];

  const boardsList = [
    'ঢাকা', 'রাজশাহী', 'কুমিল্লা', 'যশোর', 'চট্টগ্রাম', 'বরিশাল', 'সিলেট', 'দিনাজপুর', 'ময়মনসিংহ',
    'ক্যাডেট কলেজ', 'মির্জাপুর', 'ফৌজদারহাট', 'ঝিনাইদহ', 'আইডিয়াল', 'আদমজী', 'ধানমন্ডি', 'বগুড়া', 'করোনেশন'
  ];

  const yearsList = ['২০২৬', '২০২৫', '২০২৪', '২০২৩', '২০২২', '২০২১', '২০২০'];

  return (
    <div className="space-y-6">
      {/* 1. STATS OVERVIEW */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm">
          <div className="text-slate-400 text-xs font-medium">মোট প্রশ্ন ব্যাংক ভল্ট</div>
          <div className="text-2xl font-black text-white mt-1">{(stats?.total || DEFAULT_QUESTION_BANK.length).toLocaleString('bn-BD')}টি</div>
          <div className="text-[10px] text-slate-500 mt-0.5">সবগুলো বিষয় ও প্রতিষ্ঠান</div>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900 border border-indigo-900/40 shadow-sm">
          <div className="text-indigo-400 text-xs font-medium">সৃজনশীল প্রশ্ন (CQ)</div>
          <div className="text-2xl font-black text-indigo-300 mt-1">{(stats?.cqCount || 1262).toLocaleString('bn-BD')}টি</div>
          <div className="text-[10px] text-indigo-400/80 mt-0.5">ক, খ, গ, ঘ সাব-কোশ্চেনসহ</div>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900 border border-emerald-900/40 shadow-sm">
          <div className="text-emerald-400 text-xs font-medium">বহুনির্বাচনী (MCQ)</div>
          <div className="text-2xl font-black text-emerald-300 mt-1">{(stats?.mcqCount || 1705).toLocaleString('bn-BD')}টি</div>
          <div className="text-[10px] text-emerald-400/80 mt-0.5">সঠিক উত্তর ও ব্যাখ্যাকৃত</div>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900 border border-amber-900/40 shadow-sm">
          <div className="text-amber-400 text-xs font-medium">সংক্ষিপ্ত প্রশ্ন (SQ)</div>
          <div className="text-2xl font-black text-amber-300 mt-1">{(stats?.sqCount || 180).toLocaleString('bn-BD')}টি</div>
          <div className="text-[10px] text-amber-400/80 mt-0.5">জ্ঞান ও অনুধাবনমূলক</div>
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
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition flex items-center space-x-1.5 shrink-0 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>রিফ্রেশ</span>
          </button>
        </div>

        {/* Filters Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {/* Subject Filter */}
          <select
            value={filters.subjectId}
            onChange={(e) => setFilters(prev => ({ ...prev, subjectId: e.target.value, offset: 0 }))}
            className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 focus:outline-none"
          >
            {subjectsList.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>

          {/* Board / Institution Filter */}
          <select
            value={filters.board}
            onChange={(e) => setFilters(prev => ({ ...prev, board: e.target.value, offset: 0 }))}
            className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 focus:outline-none"
          >
            <option value="">সকল বোর্ড ও কলেজ</option>
            {boardsList.map(b => <option key={b} value={b}>{b}</option>)}
          </select>

          {/* Year Filter */}
          <select
            value={filters.year}
            onChange={(e) => setFilters(prev => ({ ...prev, year: e.target.value, offset: 0 }))}
            className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 focus:outline-none"
          >
            <option value="">সকল সাল</option>
            {yearsList.map(y => <option key={y} value={y}>{y} সাল</option>)}
          </select>

          {/* Question Type Filter */}
          <select
            value={filters.questionType}
            onChange={(e) => setFilters(prev => ({ ...prev, questionType: e.target.value, offset: 0 }))}
            className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 focus:outline-none"
          >
            <option value="">সকল ধরন</option>
            <option value="CQ">CQ (সৃজনশীল প্রশ্ন)</option>
            <option value="MCQ">MCQ (বহুনির্বাচনী প্রশ্ন)</option>
            <option value="SQ">SQ (সংক্ষিপ্ত প্রশ্ন)</option>
          </select>

          {/* Items Per Page */}
          <select
            value={filters.limit}
            onChange={(e) => setFilters(prev => ({ ...prev, limit: Number(e.target.value), offset: 0 }))}
            className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 focus:outline-none"
          >
            <option value={25}>প্রতি পেজে ২৫টি</option>
            <option value={50}>প্রতি পেজে ৫০টি</option>
            <option value={100}>প্রতি পেজে ১০০টি</option>
            <option value={200}>প্রতি পেজে ২০০টি</option>
          </select>

          {/* Reset Filters */}
          <button
            type="button"
            onClick={() => setFilters({
              classId: '', subjectId: '', board: '', year: '', chapter: '', questionType: '', difficulty: '', status: '', duplicateStatus: '', search: '', limit: 25, offset: 0
            })}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white font-bold transition text-center cursor-pointer"
          >
            ফিল্টার রিসেট
          </button>
        </div>
      </div>

      {/* 3. QUESTIONS LIST */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div>
            মোট <span className="text-white font-bold">{totalCount}টি</span> প্রশ্ন প্রদর্শিত হচ্ছে
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
            <p className="text-xs text-slate-600">ফিল্টার রিসেট করুন অথবা সার্চ কীওয়ার্ড পরিবর্তন করুন।</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-800/60">
            {questions.map((q, idx) => {
              const subQ = q.creativeSubQuestions || q.subQuestions;
              const isSolutionOpen = expandedSolutions[q.id];

              return (
                <div
                  key={q.id || idx}
                  className="p-5 hover:bg-slate-800/30 transition flex flex-col gap-3"
                >
                  {/* HEADER BADGES */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2 py-0.5 rounded-lg bg-indigo-600/20 text-indigo-300 font-mono font-bold text-[10px]">
                        #{q.id}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-lg font-bold text-[10px] ${
                        q.questionType === 'CQ' ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30' :
                        q.questionType === 'SQ' ? 'bg-amber-600/20 text-amber-300 border border-amber-500/30' :
                        'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30'
                      }`}>
                        {q.questionType === 'CQ' ? 'সৃজনশীল (CQ)' : q.questionType === 'SQ' ? 'সংক্ষিপ্ত (SQ)' : 'বহুনির্বাচনী (MCQ)'}
                      </span>
                      <span className="px-2 py-0.5 rounded-lg bg-cyan-600/20 text-cyan-300 font-bold text-[10px]">
                        {q.board} '{String(q.year).slice(-2)}
                      </span>
                      {q.subject && (
                        <span className="px-2 py-0.5 rounded-lg bg-slate-800 text-slate-300 font-bold text-[10px]">
                          {q.subject}
                        </span>
                      )}
                      {q.chapter && (
                        <span className="text-[11px] text-slate-400 font-medium">
                          • {q.chapter}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => toggleSolution(q.id)}
                        className="px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-xs transition cursor-pointer"
                      >
                        {isSolutionOpen ? 'উত্তর লুকান' : 'উত্তর ও সমাধান দেখুন'}
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedQuestion(q)}
                        className="px-3 py-1 rounded-xl bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white font-bold text-xs transition flex items-center space-x-1 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>ভিউ</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(q.id)}
                        className="p-1.5 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition cursor-pointer"
                        title="মুছে ফেলুন"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* QUESTION CONTENT */}
                  <div className="space-y-2">
                    {/* STEM / MAIN TEXT */}
                    <div className="text-sm font-semibold text-slate-100 leading-relaxed">
                      {q.badge && <span className="text-indigo-400 font-bold mr-1.5">{q.badge}</span>}
                      <span>{q.stem || q.questionText || q.question}</span>
                    </div>

                    {/* DIAGRAM IF PRESENT */}
                    {q.diagramType && (
                      <div className="my-2 max-w-sm">
                        <QuestionDiagram type={q.diagramType} />
                      </div>
                    )}

                    {/* CQ SUB-QUESTIONS (ক, খ, গ, ঘ) */}
                    {q.questionType === 'CQ' && subQ && (
                      <div className="mt-3 p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-2 text-xs">
                        {['a', 'b', 'c', 'd'].map((key) => {
                          const item = subQ[key];
                          if (!item) return null;
                          const label = key === 'a' ? 'ক.' : key === 'b' ? 'খ.' : key === 'c' ? 'গ.' : 'ঘ.';
                          const marks = item.marks || (key === 'a' ? 1 : key === 'b' ? 2 : key === 'c' ? 3 : 4);
                          const cleanText = (item.text || item.q || '').replace(/^[কখগঘabcdABCD][\)\.\-:]\s*/, '');

                          return (
                            <div key={key} className="space-y-1">
                              <div className="flex items-start justify-between gap-2">
                                <div className="text-slate-200">
                                  <span className="font-bold text-indigo-400 mr-1.5">{label}</span>
                                  <span>{cleanText}</span>
                                </div>
                                <span className="text-[10px] font-bold text-slate-400 shrink-0 font-mono">
                                  [{marks} নম্বর]
                                </span>
                              </div>

                              {isSolutionOpen && (item.solution || item.ans) && (
                                <div className="ml-4 p-2 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-emerald-300">
                                  <strong className="text-slate-400">সমাধান ({label}):</strong> {item.solution || item.ans}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* MCQ OPTIONS */}
                    {q.questionType === 'MCQ' && Array.isArray(q.options) && q.options.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 pt-1">
                        {q.options.map((opt, oIdx) => {
                          const optText = typeof opt === 'string' ? opt : (opt.text || opt.q || '');
                          const optKey = typeof opt === 'object' && opt.key ? opt.key : ['ক', 'খ', 'গ', 'ঘ'][oIdx] || (oIdx + 1);
                          const isCorrect = q.answer === oIdx || q.answer === optKey || q.correctAnswer === oIdx;

                          return (
                            <div
                              key={oIdx}
                              className={`p-2.5 rounded-xl border text-xs flex items-center space-x-2 transition ${
                                isCorrect && isSolutionOpen
                                  ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200 font-bold shadow-sm'
                                  : 'bg-slate-950 border-slate-800 text-slate-300'
                              }`}
                            >
                              <span className="font-bold text-indigo-400">{optKey}.</span>
                              <span className="truncate">{optText}</span>
                              {isCorrect && isSolutionOpen && (
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 ml-auto shrink-0" />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* SQ MODEL ANSWER */}
                    {q.questionType === 'SQ' && isSolutionOpen && (q.answerText || q.explanation) && (
                      <div className="mt-2 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-emerald-300">
                        <strong className="text-slate-400">আদর্শ উত্তর:</strong> {q.answerText || q.explanation}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* PAGINATION CONTROLS */}
        <div className="p-4 border-t border-slate-800 flex items-center justify-between text-xs bg-slate-900/80">
          <button
            type="button"
            disabled={filters.offset === 0 || loading}
            onClick={() => handlePageChange(Math.max(0, filters.offset - filters.limit))}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 transition flex items-center space-x-1 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>পূর্ববর্তী পৃষ্ঠা</span>
          </button>

          <span className="text-slate-400 font-medium">
            {filters.offset + 1} - {Math.min(filters.offset + filters.limit, totalCount)} (মোট {totalCount}টি প্রশ্ন)
          </span>

          <button
            type="button"
            disabled={filters.offset + filters.limit >= totalCount || loading}
            onClick={() => handlePageChange(filters.offset + filters.limit)}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 transition flex items-center space-x-1 cursor-pointer"
          >
            <span>পরবর্তী পৃষ্ঠা</span>
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

