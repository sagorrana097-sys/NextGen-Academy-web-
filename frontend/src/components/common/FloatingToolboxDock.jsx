import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';
import DraggableFloatingContainer from './DraggableFloatingContainer';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { doubtSolverAPI } from '../../services/api';
import {
  Bot,
  Calculator,
  MessageCircle,
  X,
  Minus,
  Maximize2,
  Minimize2,
  Trash2,
  BookOpen,
  Send,
  Sparkles,
  Move,
  History,
  Copy,
  Check,
  ChevronRight,
  ChevronLeft,
  LayoutGrid,
  RotateCcw,
  Zap
} from 'lucide-react';

/**
 * NextGen Unified Floating Toolbox & Smart Dock
 * Groups AI Doubt Solver, WhatsApp Helpline, and Scientific Calculator in a sleek floating dock.
 * Allows users to pop out / drag widgets anywhere, or snap them back into the dock.
 */
export default function FloatingToolboxDock() {
  const { user, isAdmin, isSuperAdmin } = useAuth();
  const { settings } = useSettings();

  // Dock UI State
  const [isDockCollapsed, setIsDockCollapsed] = useState(() => {
    try {
      return localStorage.getItem('nextgen_dock_collapsed') === 'true';
    } catch (e) {
      return false;
    }
  });

  // Active Window States (popped out of dock)
  const [isDoubtOpen, setIsDoubtOpen] = useState(false);
  const [isDoubtMinimized, setIsDoubtMinimized] = useState(false);
  const [isCalcOpen, setIsCalcOpen] = useState(false);
  const [isCalcMinimized, setIsCalcMinimized] = useState(false);

  // -------------------------------------------------------------
  // AI Doubt Solver State
  // -------------------------------------------------------------
  const [doubtSubject, setDoubtSubject] = useState('সাধারণ গণিত (General Math)');
  const [doubtInput, setDoubtInput] = useState('');
  const [doubtTyping, setDoubtTyping] = useState(false);
  const [doubtMessages, setDoubtMessages] = useState([
    {
      id: 'welcome-1',
      role: 'ai',
      content: `👋 **স্বাগতম! আমি নেক্সটজেন এআই টিচিং অ্যাসিস্ট্যান্ট।**
      
আমি তোমার **গণিত, পদার্থবিজ্ঞান, রসায়ন, জীববিজ্ঞান ও আইসিটি** বিষয়ের যেকোনো সমস্যা ধাপে ধাপে বুঝিয়ে দিতে প্রস্তুত।`,
      timestamp: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const doubtEndRef = useRef(null);
  const doubtInputRef = useRef(null);

  const doubtSubjects = [
    'সাধারণ গণিত (General Math)',
    'উচ্চতর গণিত (Higher Math)',
    'পদার্থবিজ্ঞান (Physics)',
    'রসায়ন (Chemistry)',
    'জীববিজ্ঞান (Biology)',
    'তথ্য ও যোগাযোগ প্রযুক্তি (ICT)'
  ];

  const quickPrompts = [
    { label: '📐 পিথাগোরাসের উপপাদ্য', prompt: 'পিথাগোরাসের উপপাদ্য এবং একটি সমকোণী ত্রিভুজের সমাধান বুঝিয়ে দাও।' },
    { label: '⚡ ওহমের সূত্র ও অংক', prompt: 'ওহমের সূত্র (Ohm\'s Law) ও রোধের একটি গাণিতিক উদাহরণ দাও।' },
    { label: '🚀 গতির সমীকরণ', prompt: 'পদার্থবিজ্ঞানের গতির ৪টি মৌলিক সমীকরণ ব্যাখ্যা করো।' },
    { label: '🧪 ইলেকট্রন বিন্যাস', prompt: 'রসায়ন: সোডিয়াম (Na) এর ইলেকট্রন বিন্যাস ও যোজ্যতা বুঝিয়ে দাও।' }
  ];

  useEffect(() => {
    if (isDoubtOpen && !isDoubtMinimized) {
      doubtEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => doubtInputRef.current?.focus(), 150);
    }
  }, [isDoubtOpen, isDoubtMinimized, doubtMessages]);

  const handleSendDoubt = async (customPrompt) => {
    const text = typeof customPrompt === 'string' ? customPrompt : doubtInput;
    if (!text || !text.trim() || doubtTyping) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text.trim(),
      timestamp: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })
    };

    setDoubtMessages(prev => [...prev, userMsg]);
    if (typeof customPrompt !== 'string') setDoubtInput('');
    setDoubtTyping(true);

    try {
      const res = await doubtSolverAPI.solveDoubt({
        message: text.trim(),
        history: doubtMessages.map(m => ({ role: m.role, content: m.content })),
        studentClass: user?.student?.class?.nameBn || 'Class 9',
        subject: doubtSubject
      });

      if (res.success && res.reply) {
        setDoubtMessages(prev => [
          ...prev,
          {
            id: `ai-${Date.now()}`,
            role: 'ai',
            content: res.reply,
            timestamp: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      } else {
        throw new Error(res.error?.message || 'সমাধান পেতে সমস্যা হয়েছে');
      }
    } catch (err) {
      setDoubtMessages(prev => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'ai',
          content: `⚠️ **ত্রুটি:** ${err.message || 'সার্ভারে সংযোগ করতে সমস্যা হয়েছে।'}`,
          timestamp: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setDoubtTyping(false);
    }
  };

  // -------------------------------------------------------------
  // Calculator State
  // -------------------------------------------------------------
  const [calcExpr, setCalcExpr] = useState('');
  const [calcResult, setCalcResult] = useState('');
  const [calcHistory, setCalcHistory] = useState([]);
  const [calcAngleMode, setCalcAngleMode] = useState('DEG');
  const [calcCopied, setCalcCopied] = useState(false);
  const [showCalcHistory, setShowCalcHistory] = useState(false);

  const evaluateCalc = (expr) => {
    if (!expr || !expr.trim()) return '';
    try {
      let processed = expr
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/π/g, 'Math.PI')
        .replace(/\be\b/g, 'Math.E')
        .replace(/%/g, '/100')
        .replace(/\^/g, '**');

      if (calcAngleMode === 'DEG') {
        processed = processed.replace(/sin\(([^)]+)\)/g, 'Math.sin(($1) * Math.PI / 180)');
        processed = processed.replace(/cos\(([^)]+)\)/g, 'Math.cos(($1) * Math.PI / 180)');
        processed = processed.replace(/tan\(([^)]+)\)/g, 'Math.tan(($1) * Math.PI / 180)');
      } else {
        processed = processed.replace(/sin\(/g, 'Math.sin(');
        processed = processed.replace(/cos\(/g, 'Math.cos(');
        processed = processed.replace(/tan\(/g, 'Math.tan(');
      }

      processed = processed.replace(/sqrt\(/g, 'Math.sqrt(');
      processed = processed.replace(/log\(/g, 'Math.log10(');
      processed = processed.replace(/ln\(/g, 'Math.log(');

      // eslint-disable-next-line no-new-func
      const evalFunc = new Function('Math', `return (${processed});`);
      const evaluated = evalFunc(Math);

      if (typeof evaluated === 'number') {
        if (Number.isNaN(evaluated)) return 'Math Error';
        if (!Number.isFinite(evaluated)) return 'Infinity';
        return Number(evaluated.toFixed(8)).toString();
      }
      return String(evaluated);
    } catch (err) {
      return 'Error';
    }
  };

  const handleCalcEqual = () => {
    if (!calcExpr.trim()) return;
    const res = evaluateCalc(calcExpr);
    setCalcResult(res);
    if (res && res !== 'Error' && res !== 'Math Error') {
      setCalcHistory(prev => [{ expr: calcExpr, res }, ...prev.slice(0, 15)]);
    }
  };

  const handleCopyCalc = () => {
    const text = calcResult || calcExpr;
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCalcCopied(true);
    setTimeout(() => setCalcCopied(false), 2000);
  };

  // WhatsApp Helpline Info
  const isUserAdmin = isAdmin || isSuperAdmin || user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';
  const whatsappUrl = 'https://wa.me/8801792818005?text=' + encodeURIComponent('Hello NextGen Academy, আমি ভর্তি সংক্রান্ত তথ্য জানতে চাই।');

  // Toggle Collapse
  const toggleDockCollapse = (e) => {
    e.stopPropagation();
    const next = !isDockCollapsed;
    setIsDockCollapsed(next);
    try {
      localStorage.setItem('nextgen_dock_collapsed', String(next));
    } catch (err) {}
  };

  // Dock All / Reset
  const handleDockAll = () => {
    setIsDoubtOpen(false);
    setIsCalcOpen(false);
    setIsDoubtMinimized(false);
    setIsCalcMinimized(false);
  };

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
  const dockPos = {
    x: typeof window !== 'undefined' ? (isMobile ? 12 : Math.max(10, window.innerWidth - 320)) : 900,
    y: typeof window !== 'undefined' ? Math.max(10, window.innerHeight - (isMobile ? 70 : 80)) : 650
  };

  return (
    <>
      {/* ============================================================ */}
      {/* 1. FLOATING TOOLBOX DOCK BAR (DRAGGABLE) */}
      {/* ============================================================ */}
      <DraggableFloatingContainer
        id="toolbox_dock"
        initialPosition={dockPos}
        handleSelector="[data-drag-handle]"
        className="z-[90]"
      >
        {({ isDragging }) => (
          <div className="relative group">
            {isDockCollapsed ? (
              /* Minimized Floating Capsule / Orb */
              <div
                data-drag-handle
                className="flex items-center gap-2 px-3 py-2.5 rounded-full bg-slate-950/90 hover:bg-slate-900 border border-amber-500/40 shadow-2xl backdrop-blur-xl text-white cursor-grab active:cursor-grabbing hover:scale-105 transition-all"
                title="নেক্সটজেন স্মার্ট টুলবক্স (ক্লিক করে খুলুন)"
              >
                <div className="relative flex items-center justify-center">
                  <Zap className="w-5 h-5 text-amber-400 animate-pulse" />
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-amber-400 rounded-full animate-ping" />
                </div>
                <span className="text-xs font-black bg-gradient-to-r from-amber-300 to-yellow-200 bg-clip-text text-transparent">
                  টুলবক্স
                </span>
                <button
                  type="button"
                  data-no-drag
                  onClick={toggleDockCollapse}
                  className="p-1 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white text-xs ml-1"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              /* Full Floating Toolbox Bar */
              <div
                data-drag-handle
                className="flex items-center bg-slate-950/90 backdrop-blur-2xl border border-slate-800 hover:border-amber-500/40 rounded-full shadow-[0_10px_35px_rgba(0,0,0,0.6)] px-3 py-2 gap-1.5 cursor-grab active:cursor-grabbing transition-all ring-1 ring-white/10"
              >
                {/* Drag Grip Handle */}
                <div className="p-1 text-slate-500 hover:text-amber-400 transition-colors" title="ড্র্যাগ করে স্ক্রিনের যেকোনো জায়গায় রাখুন">
                  <Move className="w-3.5 h-3.5" />
                </div>

                <div className="h-5 w-[1px] bg-slate-800 mx-0.5" />

                {/* 1. AI Doubt Solver Button */}
                {(user?.role === 'STUDENT' || user?.role === 'PARENT' || !user) && (
                  <button
                    type="button"
                    data-no-drag
                    onClick={() => {
                      setIsDoubtOpen(!isDoubtOpen);
                      setIsDoubtMinimized(false);
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black transition-all ${
                      isDoubtOpen
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30 scale-105'
                        : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800'
                    }`}
                    title="AI ডাউট সলভার"
                  >
                    <Bot className="w-4 h-4 text-amber-300" />
                    <span className="hidden sm:inline">AI ডাউট</span>
                    {isDoubtOpen && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />}
                  </button>
                )}

                {/* 2. Smart Calculator Button */}
                <button
                  type="button"
                  data-no-drag
                  onClick={() => {
                    setIsCalcOpen(!isCalcOpen);
                    setIsCalcMinimized(false);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black transition-all ${
                    isCalcOpen
                      ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg shadow-amber-600/30 scale-105'
                      : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800'
                  }`}
                  title="স্মার্ট সায়েন্টিফিক ক্যালকুলেটর"
                >
                  <Calculator className="w-4 h-4 text-amber-400" />
                  <span className="hidden sm:inline">ক্যালকুলেটর</span>
                  {isCalcOpen && <span className="w-1.5 h-1.5 rounded-full bg-amber-300 animate-ping" />}
                </button>

                {/* 3. WhatsApp Direct Button */}
                {!isUserAdmin && (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-no-drag
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-black shadow-md shadow-emerald-950/30 transition-all hover:scale-105"
                    title="সরাসরি ভর্তি কাউন্সেলিং | WhatsApp"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span className="hidden sm:inline">WhatsApp</span>
                  </a>
                )}

                {/* Dock Controls: Snap Back & Minimize */}
                <div className="flex items-center pl-1 border-l border-slate-800 gap-1">
                  {(isDoubtOpen || isCalcOpen) && (
                    <button
                      type="button"
                      data-no-drag
                      onClick={handleDockAll}
                      className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-amber-300 text-[10px]"
                      title="সকল উইজেট ডকে ফেরত পাঠান (Snap Back)"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    type="button"
                    data-no-drag
                    onClick={toggleDockCollapse}
                    className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                    title="টুলবক্স লুকান"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </DraggableFloatingContainer>

      {/* ============================================================ */}
      {/* 2. POPOUT DRAGGABLE AI DOUBT SOLVER WINDOW */}
      {/* ============================================================ */}
      {isDoubtOpen && (
        <DraggableFloatingContainer
          id="dock_ai_doubt"
          initialPosition={{ x: 24, y: typeof window !== 'undefined' ? Math.max(20, window.innerHeight - 560) : 150 }}
          handleSelector="[data-drag-handle]"
          className="z-[96]"
        >
          {({ isDragging }) => (
            <div className="relative">
              {isDoubtMinimized ? (
                /* Minimized AI Pill */
                <div
                  data-drag-handle
                  className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-slate-900/95 border border-indigo-500/50 text-white shadow-2xl backdrop-blur-xl cursor-grab active:cursor-grabbing"
                >
                  <Bot className="w-4 h-4 text-indigo-400 animate-pulse" />
                  <span className="text-xs font-bold text-slate-200">AI ডাউট (মিনিমাইজড)</span>
                  <button
                    type="button"
                    data-no-drag
                    onClick={() => setIsDoubtMinimized(false)}
                    className="p-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs"
                    title="বড় করুন"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    data-no-drag
                    onClick={() => setIsDoubtOpen(false)}
                    className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white text-xs"
                    title="ডকে ফেরত পাঠান"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                /* Full Interactive AI Chat Window */
                <div className="w-[calc(100vw-32px)] max-w-[390px] h-[480px] sm:h-[520px] bg-slate-900/95 backdrop-blur-2xl border border-indigo-500/40 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-white animate-in zoom-in-95 duration-150">
                  
                  {/* Header & Drag Handle */}
                  <div
                    data-drag-handle
                    className="p-3.5 bg-gradient-to-r from-indigo-950 via-purple-950 to-slate-900 border-b border-indigo-500/30 flex items-center justify-between cursor-grab active:cursor-grabbing"
                  >
                    <div className="flex items-center space-x-2.5">
                      <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/30">
                        <Bot className="w-4 h-4 text-amber-300" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-1.5">
                          <h4 className="text-xs font-black text-white">AI ডাউট সলভার</h4>
                          <span className="px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 text-[9px] font-black uppercase border border-emerald-500/30">
                            Live
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-300">যেকোনো বিষয়ে তাৎক্ষণিক সমাধান</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1">
                      <div className="p-1 text-slate-400 hover:text-white" title="ড্র্যাগ করে সরান">
                        <Move className="w-3.5 h-3.5" />
                      </div>
                      <button
                        type="button"
                        data-no-drag
                        onClick={() => setDoubtMessages([{ id: 'reset', role: 'ai', content: '🧹 নতুন চ্যাট শুরু হয়েছে।', timestamp: 'এখন' }])}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                        title="চ্যাট হিস্ট্রি মুছুন"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        data-no-drag
                        onClick={() => setIsDoubtMinimized(true)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                        title="মিনিমাইজ করুন"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        data-no-drag
                        onClick={() => setIsDoubtOpen(false)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/40"
                        title="ডকে ফেরত পাঠান (Snap Back)"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Subject Selector */}
                  <div className="px-3.5 py-2 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-[11px] font-bold text-indigo-300 flex items-center gap-1">
                      <BookOpen className="w-3 h-3 text-indigo-400" /> বিষয়:
                    </span>
                    <select
                      data-no-drag
                      value={doubtSubject}
                      onChange={(e) => setDoubtSubject(e.target.value)}
                      className="bg-slate-800 text-slate-200 border border-slate-700 rounded-lg px-2 py-1 text-[11px] font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                      {doubtSubjects.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-3.5 space-y-3 text-xs bg-slate-950/40" data-no-drag>
                    {doubtMessages.map((m) => (
                      <div
                        key={m.id}
                        className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
                      >
                        <div
                          className={`max-w-[88%] p-3 rounded-2xl leading-relaxed text-xs ${
                            m.role === 'user'
                              ? 'bg-indigo-600 text-white rounded-br-none shadow-md'
                              : 'bg-slate-800/90 text-slate-100 border border-slate-700/80 rounded-bl-none shadow-sm'
                          }`}
                        >
                          <ReactMarkdown
                            remarkPlugins={[remarkMath, remarkGfm]}
                            rehypePlugins={[rehypeKatex]}
                            components={{
                              p: ({ node, ...props }) => <p className="mb-1.5 last:mb-0" {...props} />,
                              ul: ({ node, ...props }) => <ul className="list-disc pl-4 mb-1.5 space-y-0.5" {...props} />,
                              ol: ({ node, ...props }) => <ol className="list-decimal pl-4 mb-1.5 space-y-0.5" {...props} />,
                              li: ({ node, ...props }) => <li className="leading-normal" {...props} />,
                              strong: ({ node, ...props }) => <strong className="font-extrabold text-amber-300" {...props} />,
                              code: ({ node, inline, ...props }) =>
                                inline ? (
                                  <code className="px-1 py-0.2 rounded bg-slate-950 font-mono text-cyan-300 text-[11px]" {...props} />
                                ) : (
                                  <pre className="p-2 rounded-xl bg-slate-950 font-mono text-cyan-300 text-[11px] overflow-x-auto my-1" {...props} />
                                )
                            }}
                          >
                            {m.content}
                          </ReactMarkdown>
                        </div>
                        <span className="text-[9px] text-slate-500 mt-0.5 px-1 font-mono">{m.timestamp}</span>
                      </div>
                    ))}

                    {doubtTyping && (
                      <div className="flex items-center space-x-2 p-2.5 rounded-2xl bg-slate-800/80 border border-slate-700 max-w-[70%]">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                        <span className="text-[11px] text-slate-300 font-bold animate-pulse">সমাধান তৈরি হচ্ছে...</span>
                      </div>
                    )}
                    <div ref={doubtEndRef} />
                  </div>

                  {/* Quick Prompts */}
                  <div className="px-3 py-1.5 bg-slate-900 border-t border-slate-800 flex items-center space-x-1.5 overflow-x-auto no-scrollbar" data-no-drag>
                    {quickPrompts.map((qp, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSendDoubt(qp.prompt)}
                        disabled={doubtTyping}
                        className="whitespace-nowrap px-2.5 py-1 rounded-lg bg-slate-800/90 hover:bg-indigo-600/30 text-slate-300 hover:text-indigo-200 border border-slate-700/80 text-[10px] font-bold transition-colors shrink-0"
                      >
                        {qp.label}
                      </button>
                    ))}
                  </div>

                  {/* Input Form */}
                  <form
                    data-no-drag
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSendDoubt();
                    }}
                    className="p-3 bg-slate-900 border-t border-slate-800 flex items-center space-x-2"
                  >
                    <input
                      ref={doubtInputRef}
                      type="text"
                      value={doubtInput}
                      onChange={(e) => setDoubtInput(e.target.value)}
                      placeholder="তোমার প্রশ্নটি লিখো..."
                      disabled={doubtTyping}
                      className="flex-1 px-3 py-2 rounded-xl bg-slate-800/90 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                    />
                    <button
                      type="submit"
                      disabled={!doubtInput.trim() || doubtTyping}
                      className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white shadow-md shadow-indigo-600/30 transition-all flex items-center justify-center"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>

                </div>
              )}
            </div>
          )}
        </DraggableFloatingContainer>
      )}

      {/* ============================================================ */}
      {/* 3. POPOUT DRAGGABLE CALCULATOR WINDOW */}
      {/* ============================================================ */}
      {isCalcOpen && (
        <DraggableFloatingContainer
          id="dock_calculator"
          initialPosition={{ x: typeof window !== 'undefined' ? Math.max(20, window.innerWidth - 350) : 850, y: 100 }}
          handleSelector="[data-drag-handle]"
          className="z-[95]"
        >
          {({ isDragging }) => (
            <div className="relative">
              {isCalcMinimized ? (
                /* Minimized Calculator Pill */
                <div
                  data-drag-handle
                  className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-slate-900/95 border border-amber-500/50 text-white shadow-2xl backdrop-blur-xl cursor-grab active:cursor-grabbing"
                >
                  <Calculator className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold text-slate-200">ক্যালকুলেটর (মিনিমাইজড)</span>
                  <button
                    type="button"
                    data-no-drag
                    onClick={() => setIsCalcMinimized(false)}
                    className="p-1 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs"
                    title="বড় করুন"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    data-no-drag
                    onClick={() => setIsCalcOpen(false)}
                    className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white text-xs"
                    title="ডকে ফেরত পাঠান"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                /* Full Expanded Calculator Window */
                <div className="w-[calc(100vw-32px)] max-w-[320px] bg-slate-900/95 backdrop-blur-2xl border border-amber-500/40 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-white animate-in zoom-in-95 duration-150">
                  
                  {/* Header & Drag Handle */}
                  <div
                    data-drag-handle
                    className="p-3 bg-gradient-to-r from-amber-950 via-slate-900 to-slate-900 border-b border-amber-500/30 flex items-center justify-between cursor-grab active:cursor-grabbing"
                  >
                    <div className="flex items-center space-x-2">
                      <div className="p-1.5 rounded-xl bg-amber-500 text-slate-950 font-black">
                        <Calculator className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-white">স্মার্ট ক্যালকুলেটর</h4>
                        <p className="text-[9px] text-amber-300 font-mono">Scientific & Standard</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1">
                      <div className="p-1 text-slate-400 hover:text-white" title="ড্র্যাগ করে সরান">
                        <Move className="w-3.5 h-3.5" />
                      </div>
                      <button
                        type="button"
                        data-no-drag
                        onClick={() => setCalcAngleMode(calcAngleMode === 'DEG' ? 'RAD' : 'DEG')}
                        className="px-1.5 py-0.5 rounded bg-slate-800 text-[9px] font-bold text-amber-300 border border-slate-700"
                        title="ডিগ্রি / রেডিয়ান"
                      >
                        {calcAngleMode}
                      </button>
                      <button
                        type="button"
                        data-no-drag
                        onClick={() => setShowCalcHistory(!showCalcHistory)}
                        className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                        title="হিস্ট্রি"
                      >
                        <History className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        data-no-drag
                        onClick={() => setIsCalcMinimized(true)}
                        className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                        title="মিনিমাইজ"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        data-no-drag
                        onClick={() => setIsCalcOpen(false)}
                        className="p-1 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/40"
                        title="ডকে ফেরত পাঠান (Snap Back)"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Calculator Screen */}
                  <div className="p-3 bg-slate-950/80 border-b border-slate-800 flex flex-col justify-end text-right min-h-[72px]" data-no-drag>
                    <div className="text-slate-400 text-xs font-mono tracking-wider overflow-x-auto whitespace-nowrap">
                      {calcExpr || '0'}
                    </div>
                    <div className="text-xl sm:text-2xl font-black text-amber-300 font-mono tracking-tight flex items-center justify-between mt-1">
                      <button
                        type="button"
                        onClick={handleCopyCalc}
                        className="p-1 rounded text-slate-500 hover:text-amber-300 text-[10px]"
                        title="ফলাফল কপি করুন"
                      >
                        {calcCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                      <span>{calcResult || (calcExpr ? '=' : '0')}</span>
                    </div>
                  </div>

                  {/* History */}
                  {showCalcHistory && (
                    <div className="p-2 bg-slate-950/90 border-b border-slate-800 max-h-32 overflow-y-auto space-y-1 text-xs" data-no-drag>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 pb-1 border-b border-slate-800">
                        <span>হিস্ট্রি</span>
                        <button
                          type="button"
                          onClick={() => setCalcHistory([])}
                          className="text-rose-400 hover:text-rose-300 flex items-center gap-0.5"
                        >
                          <Trash2 className="w-3 h-3" /> ক্লিয়ার
                        </button>
                      </div>
                      {calcHistory.length === 0 ? (
                        <p className="text-[10px] text-slate-500 py-1 text-center">কোনো পূর্ববর্তী হিসাব নেই</p>
                      ) : (
                        calcHistory.map((h, i) => (
                          <div
                            key={i}
                            onClick={() => {
                              setCalcExpr(h.res);
                              setCalcResult('');
                              setShowCalcHistory(false);
                            }}
                            className="p-1.5 rounded-lg bg-slate-900/60 hover:bg-slate-800/80 cursor-pointer flex items-center justify-between text-[11px] font-mono"
                          >
                            <span className="text-slate-400 truncate">{h.expr}</span>
                            <span className="text-amber-300 font-bold ml-2">{h.res}</span>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {/* Keypad */}
                  <div className="p-3 grid grid-cols-4 gap-1.5 text-xs font-bold" data-no-drag>
                    <button type="button" onClick={() => setCalcExpr(prev => prev + 'sin(')} className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-[11px]">sin</button>
                    <button type="button" onClick={() => setCalcExpr(prev => prev + 'cos(')} className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-[11px]">cos</button>
                    <button type="button" onClick={() => setCalcExpr(prev => prev + 'tan(')} className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-[11px]">tan</button>
                    <button type="button" onClick={() => setCalcExpr(prev => prev + '^')} className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-[11px]">xʸ</button>

                    <button type="button" onClick={() => setCalcExpr(prev => prev + 'sqrt(')} className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-[11px]">√</button>
                    <button type="button" onClick={() => setCalcExpr(prev => prev + 'π')} className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-[11px]">π</button>
                    <button type="button" onClick={() => setCalcExpr(prev => prev + '(')} className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-[11px]">(</button>
                    <button type="button" onClick={() => setCalcExpr(prev => prev + ')')} className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-[11px]">)</button>

                    <button type="button" onClick={() => { setCalcExpr(''); setCalcResult(''); }} className="p-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-black">C</button>
                    <button type="button" onClick={() => setCalcExpr(prev => prev.slice(0, -1))} className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold">⌫</button>
                    <button type="button" onClick={() => setCalcExpr(prev => prev + '%')} className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300">%</button>
                    <button type="button" onClick={() => setCalcExpr(prev => prev + '÷')} className="p-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-sm">÷</button>

                    <button type="button" onClick={() => setCalcExpr(prev => prev + '7')} className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white font-mono text-sm">7</button>
                    <button type="button" onClick={() => setCalcExpr(prev => prev + '8')} className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white font-mono text-sm">8</button>
                    <button type="button" onClick={() => setCalcExpr(prev => prev + '9')} className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white font-mono text-sm">9</button>
                    <button type="button" onClick={() => setCalcExpr(prev => prev + '×')} className="p-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-sm">×</button>

                    <button type="button" onClick={() => setCalcExpr(prev => prev + '4')} className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white font-mono text-sm">4</button>
                    <button type="button" onClick={() => setCalcExpr(prev => prev + '5')} className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white font-mono text-sm">5</button>
                    <button type="button" onClick={() => setCalcExpr(prev => prev + '6')} className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white font-mono text-sm">6</button>
                    <button type="button" onClick={() => setCalcExpr(prev => prev + '-')} className="p-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-sm">-</button>

                    <button type="button" onClick={() => setCalcExpr(prev => prev + '1')} className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white font-mono text-sm">1</button>
                    <button type="button" onClick={() => setCalcExpr(prev => prev + '2')} className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white font-mono text-sm">2</button>
                    <button type="button" onClick={() => setCalcExpr(prev => prev + '3')} className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white font-mono text-sm">3</button>
                    <button type="button" onClick={() => setCalcExpr(prev => prev + '+')} className="p-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-sm">+</button>

                    <button type="button" onClick={() => setCalcExpr(prev => prev + '0')} className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white font-mono text-sm col-span-2">0</button>
                    <button type="button" onClick={() => setCalcExpr(prev => prev + '.')} className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white font-mono text-sm">.</button>
                    <button type="button" onClick={handleCalcEqual} className="p-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-sm shadow-md shadow-amber-500/20">=</button>
                  </div>

                </div>
              )}
            </div>
          )}
        </DraggableFloatingContainer>
      )}
    </>
  );
}
