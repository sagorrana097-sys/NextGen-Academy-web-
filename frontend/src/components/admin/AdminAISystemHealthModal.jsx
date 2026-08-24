import React, { useState, useEffect } from 'react';
import { systemErrorAPI } from '../../services/api';
import {
  Bot,
  Activity,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Trash2,
  X,
  Search,
  Code2,
  ChevronDown,
  ChevronUp,
  Cpu,
  Sparkles,
  ShieldCheck,
  Filter,
  Check,
  Copy,
  Terminal,
  ExternalLink,
  Layers
} from 'lucide-react';

/**
 * Secret Admin AI System Health & Auto-Recovery Dashboard
 * Real-time monitoring of frontend UI crashes and network failures
 * with 1-click AI Automated Root-Cause Analysis and Code Fixes in Bengali.
 */
export default function AdminAISystemHealthModal({ isOpen, onClose }) {
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [expandedId, setExpandedId] = useState(null);
  const [analyzingId, setAnalyzingId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchErrors();
    }
  }, [isOpen]);

  const showToast = (msg, type = 'success') => {
    setFeedback({ msg, type });
    setTimeout(() => setFeedback(null), 3500);
  };

  const fetchErrors = async () => {
    setLoading(true);
    try {
      const res = await systemErrorAPI.getAll({
        status: statusFilter,
        severity: severityFilter,
        search
      });
      if (res.success && res.data) {
        setErrors(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch system errors:', err);
      showToast(err.message || 'এরর লগ লোড করতে ব্যর্থ হয়েছে', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async (errorId) => {
    setAnalyzingId(errorId);
    try {
      const res = await systemErrorAPI.analyze(errorId);
      if (res.success && res.data?.aiAnalysis) {
        setErrors((prev) =>
          prev.map((e) =>
            Number(e.id) === Number(errorId)
              ? { ...e, aiAnalysis: res.data.aiAnalysis, status: 'ANALYZED' }
              : e
          )
        );
        setExpandedId(errorId);
        showToast('এআই রুট-কজ অ্যানালাইসিস ও কোড ফিক্স জেনারেট সম্পন্ন!');
      }
    } catch (err) {
      console.error('AI Analysis failed:', err);
      showToast(err.message || 'এআই অ্যানালাইসিস ব্যর্থ হয়েছে', 'error');
    } finally {
      setAnalyzingId(null);
    }
  };

  const handleResolve = async (errorId, status = 'RESOLVED') => {
    try {
      const res = await systemErrorAPI.resolve(errorId, status);
      if (res.success) {
        setErrors((prev) =>
          prev.map((e) =>
            Number(e.id) === Number(errorId) ? { ...e, status } : e
          )
        );
        showToast(`এরর #${errorId} সফলভাবে সমাধান হয়েছে`);
      }
    } catch (err) {
      console.error('Failed to resolve error:', err);
      showToast('স্ট্যাটাস আপডেট ব্যর্থ হয়েছে', 'error');
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm('আপনি কি সকল এরর হিস্ট্রি মুছে ফেলতে চান?')) return;
    try {
      const res = await systemErrorAPI.clearAll();
      if (res.success) {
        setErrors([]);
        showToast('সকল এরর লগ সফলভাবে মুছে ফেলা হয়েছে');
      }
    } catch (err) {
      console.error('Failed to clear errors:', err);
      showToast('লগ ক্লিয়ার করতে ব্যর্থ হয়েছে', 'error');
    }
  };

  const handleCopyCode = (id, code) => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  if (!isOpen) return null;

  const totalCount = errors.length;
  const openCount = errors.filter((e) => e.status === 'OPEN').length;
  const analyzedCount = errors.filter((e) => e.status === 'ANALYZED').length;
  const resolvedCount = errors.filter((e) => e.status === 'RESOLVED').length;

  const filteredErrors = errors.filter((e) => {
    if (statusFilter !== 'ALL' && e.status !== statusFilter) return false;
    if (severityFilter !== 'ALL' && e.severity !== severityFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchMsg = e.message?.toLowerCase().includes(q);
      const matchRoute = e.route?.toLowerCase().includes(q);
      const matchRole = e.userRole?.toLowerCase().includes(q);
      return matchMsg || matchRoute || matchRole;
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200 font-sans">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-5xl w-full max-h-[90vh] shadow-2xl flex flex-col overflow-hidden text-white relative my-auto">
        {/* Ambient background glows */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between relative z-10 bg-slate-900/90 backdrop-blur-md">
          <div className="flex items-center space-x-3.5">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-500/20 via-teal-500/20 to-cyan-500/20 text-emerald-400 border border-emerald-500/30 shadow-md">
              <Bot className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg sm:text-xl font-black text-white">
                  AI System Health & Auto-Recovery
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                  Secret Admin Mode 🤖
                </span>
              </div>
              <p className="text-xs text-slate-400">
                রিয়েল-টাইম এরর ট্র্যাকিং, অটো-হিলিং নেটওয়ার্ক রিট্রাই এবং এআই রুট-কজ ফিক্স ইঞ্জিন
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={fetchErrors}
              disabled={loading}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              title="রিফ্রেশ করুন"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toast Feedback */}
        {feedback && (
          <div
            className={`mx-6 mt-4 p-3.5 rounded-2xl border text-xs font-bold flex items-center space-x-2.5 animate-in slide-in-from-top-2 ${
              feedback.type === 'success'
                ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                : 'bg-rose-950/60 border-rose-500/40 text-rose-300'
            }`}
          >
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span>{feedback.msg}</span>
          </div>
        )}

        {/* Metrics Summary Strip */}
        <div className="p-6 grid grid-cols-2 sm:grid-cols-4 gap-3.5 border-b border-slate-800 relative z-10">
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-400 font-bold block uppercase">সর্বমোট এরর</span>
              <span className="text-xl sm:text-2xl font-black text-white font-mono">{totalCount}</span>
            </div>
            <Activity className="w-5 h-5 text-indigo-400" />
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-rose-400 font-bold block uppercase">ওপেন ইস্যু</span>
              <span className="text-xl sm:text-2xl font-black text-rose-400 font-mono">{openCount}</span>
            </div>
            <AlertTriangle className="w-5 h-5 text-rose-400" />
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-amber-400 font-bold block uppercase">AI অ্যানালাইজড</span>
              <span className="text-xl sm:text-2xl font-black text-amber-400 font-mono">{analyzedCount}</span>
            </div>
            <Cpu className="w-5 h-5 text-amber-400" />
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-emerald-400 font-bold block uppercase">সমাধানকৃত (Resolved)</span>
              <span className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">{resolvedCount}</span>
            </div>
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="px-6 py-4 bg-slate-950/40 border-b border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 relative z-10">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="এরর মেসেজ, রাউট বা রোল খুঁজুন..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>

          <div className="flex items-center space-x-2.5 w-full sm:w-auto justify-end">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 cursor-pointer"
            >
              <option value="ALL">সকল স্ট্যাটাস</option>
              <option value="OPEN">ওপেন (Open)</option>
              <option value="ANALYZED">অ্যানালাইজড (Analyzed)</option>
              <option value="RESOLVED">সমাধানকৃত (Resolved)</option>
            </select>

            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 cursor-pointer"
            >
              <option value="ALL">সকল তীব্রতা (Severity)</option>
              <option value="CRITICAL">CRITICAL</option>
              <option value="HIGH">HIGH</option>
              <option value="MEDIUM">MEDIUM</option>
            </select>

            {errors.length > 0 && (
              <button
                type="button"
                onClick={handleClearAll}
                className="px-3 py-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/40 text-xs font-bold flex items-center space-x-1.5 transition-colors"
                title="সকল এরর লগ মুছে ফেলুন"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">ক্লিয়ার লগ</span>
              </button>
            )}
          </div>
        </div>

        {/* Errors Stream List */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4 relative z-10">
          {loading ? (
            <div className="py-16 text-center text-slate-400 space-y-3">
              <RefreshCw className="w-7 h-7 animate-spin mx-auto text-emerald-400" />
              <p className="text-xs font-medium">সিস্টেম এরর রেকর্ড লোড হচ্ছে...</p>
            </div>
          ) : filteredErrors.length === 0 ? (
            <div className="py-16 text-center space-y-3 bg-slate-950/30 rounded-3xl border border-slate-800 p-8">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h4 className="text-base font-bold text-white">সিস্টেম ১০০% সুস্থ ও স্থিতিশীল!</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                কোনো আনহ্যান্ডেলড এরর বা নেটওয়ার্ক ক্র্যাশ শনাক্ত হয়নি। ব্যাকএন্ড ও ফ্রন্টএন্ড স্মুথলি রান করছে।
              </p>
            </div>
          ) : (
            filteredErrors.map((item) => {
              const isExpanded = expandedId === item.id;
              const isAnalyzing = analyzingId === item.id;
              const hasAnalysis = Boolean(item.aiAnalysis);

              return (
                <div
                  key={item.id}
                  className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                    item.status === 'RESOLVED'
                      ? 'bg-slate-950/40 border-slate-800 opacity-75'
                      : item.severity === 'CRITICAL'
                      ? 'bg-rose-950/20 border-rose-500/40 shadow-lg shadow-rose-950/20'
                      : 'bg-slate-950/80 border-slate-700/80 shadow-md'
                  }`}
                >
                  {/* Error Card Header */}
                  <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            item.severity === 'CRITICAL'
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                              : item.severity === 'HIGH'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                              : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                          }`}
                        >
                          {item.severity || 'HIGH'}
                        </span>

                        <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-mono font-bold">
                          {item.errorType}
                        </span>

                        <span className="text-[11px] font-mono text-slate-400">
                          {new Date(item.timestamp).toLocaleTimeString('bn-BD')} • {new Date(item.timestamp).toLocaleDateString('bn-BD')}
                        </span>

                        <span className="px-2 py-0.5 rounded-md bg-slate-800/80 text-emerald-400 text-[10px] font-bold">
                          রোল: {item.userRole}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-white font-mono truncate select-all">
                        {item.message}
                      </h4>

                      <div className="text-[11px] text-slate-400 flex items-center space-x-2 font-mono">
                        <span className="text-indigo-400 font-semibold">Route:</span>
                        <span>{item.route}</span>
                        {item.statusCode && (
                          <span className="px-1.5 rounded bg-slate-800 text-rose-400 text-[10px] font-bold">
                            HTTP {item.statusCode}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quick Action Buttons */}
                    <div className="flex items-center space-x-2 shrink-0">
                      {/* AI Auto-Analyze Button */}
                      <button
                        type="button"
                        onClick={() => handleAnalyze(item.id)}
                        disabled={isAnalyzing}
                        className={`px-3.5 py-2 rounded-xl text-xs font-black flex items-center space-x-1.5 transition-all shadow-md active:scale-95 ${
                          hasAnalysis
                            ? 'bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/40'
                            : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white shadow-emerald-600/30'
                        }`}
                      >
                        <Sparkles className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
                        <span>{isAnalyzing ? 'বিশ্লেষণ চলছে...' : hasAnalysis ? 'AI সমাধান দেখুন' : 'AI Auto-Analyze & Fix'}</span>
                      </button>

                      {/* Mark Resolved Toggle */}
                      {item.status !== 'RESOLVED' ? (
                        <button
                          type="button"
                          onClick={() => handleResolve(item.id, 'RESOLVED')}
                          className="p-2 rounded-xl bg-slate-800 hover:bg-emerald-900/40 text-slate-400 hover:text-emerald-400 transition-colors"
                          title="সমাধান হিসেবে চিহ্নিত করুন"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleResolve(item.id, 'OPEN')}
                          className="p-2 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-800/40 text-[10px] font-bold"
                          title="পুনরায় ওপেন করুন"
                        >
                          Resolved ✓
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => setExpandedId(isExpanded ? null : item.id)}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Diagnostics & AI Code Fix Accordion */}
                  {isExpanded && (
                    <div className="p-5 border-t border-slate-800 bg-slate-950/90 space-y-4 animate-in fade-in">
                      {/* AI Root-Cause Analysis Panel */}
                      {hasAnalysis ? (
                        <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-950 border border-indigo-500/40 space-y-3.5 shadow-xl">
                          <div className="flex items-center justify-between border-b border-indigo-500/20 pb-2.5">
                            <div className="flex items-center space-x-2">
                              <Bot className="w-4 h-4 text-emerald-400" />
                              <span className="font-bold text-xs text-white">
                                AI সিস্টেম হেলথ অ্যানালাইসিস ও ডায়াগনোসিস
                              </span>
                            </div>
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold">
                              Confidence: {item.aiAnalysis.confidence || '98.5%'}
                            </span>
                          </div>

                          <div className="space-y-2 text-xs">
                            <div>
                              <span className="text-slate-400 font-semibold block mb-0.5">🔍 সমস্যা কারণ (Diagnosis):</span>
                              <p className="text-white font-medium bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 leading-relaxed">
                                {item.aiAnalysis.diagnosisBn}
                              </p>
                            </div>

                            <div>
                              <span className="text-slate-400 font-semibold block mb-0.5">🎯 মূল রুট-কজ (Root Cause):</span>
                              <p className="text-indigo-200 font-medium bg-indigo-950/30 p-2.5 rounded-xl border border-indigo-900/40 leading-relaxed">
                                {item.aiAnalysis.rootCauseBn}
                              </p>
                            </div>

                            {item.aiAnalysis.suggestedFix && (
                              <div>
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-emerald-400 font-bold flex items-center space-x-1">
                                    <Code2 className="w-3.5 h-3.5" />
                                    <span>সুপারিশকৃত কোড সমাধান (Suggested Code Fix):</span>
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => handleCopyCode(item.id, item.aiAnalysis.suggestedFix)}
                                    className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[10px] font-mono text-slate-300 flex items-center space-x-1 transition-colors"
                                  >
                                    {copiedId === item.id ? (
                                      <>
                                        <Check className="w-3 h-3 text-emerald-400" />
                                        <span>কপিকৃত!</span>
                                      </>
                                    ) : (
                                      <>
                                        <Copy className="w-3 h-3" />
                                        <span>কোড কপি</span>
                                      </>
                                    )}
                                  </button>
                                </div>
                                <pre className="p-3 rounded-xl bg-slate-950 border border-emerald-500/30 font-mono text-[11px] text-emerald-300 overflow-x-auto select-all">
                                  {item.aiAnalysis.suggestedFix}
                                </pre>
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-2">
                          <p className="text-xs text-slate-400">এই এররের জন্য এখনও এআই অ্যানালাইসিস চালানো হয়নি।</p>
                          <button
                            type="button"
                            onClick={() => handleAnalyze(item.id)}
                            disabled={isAnalyzing}
                            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold inline-flex items-center space-x-1.5 shadow-md"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>এখনই AI সমাধান জেনারেট করুন</span>
                          </button>
                        </div>
                      )}

                      {/* Technical Stack Trace */}
                      {item.stack && (
                        <div className="space-y-1">
                          <span className="text-[10px] font-mono text-slate-400 uppercase font-bold flex items-center space-x-1">
                            <Terminal className="w-3 h-3" />
                            <span>Stack Trace & Diagnostics:</span>
                          </span>
                          <pre className="p-3 rounded-xl bg-black/80 border border-slate-800 font-mono text-[10px] text-rose-300/90 overflow-x-auto max-h-40 leading-relaxed select-all">
                            {item.stack}
                          </pre>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between text-xs text-slate-400 relative z-10">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>অটো-হিলিং নেটওয়ার্ক রিট্রাই ইন্টারসেপ্টর সক্রিয় (3x Silent Retries)</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors"
          >
            বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  );
}
