import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { doubtSolverAPI } from '../../services/api';
import {
  Bot,
  Sparkles,
  Send,
  X,
  Minus,
  Maximize2,
  Trash2,
  HelpCircle,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  RefreshCw,
  Zap,
  MessageSquare,
  Move
} from 'lucide-react';

export default function FloatingDoubtSolver({ studentClass = 'Class 9', currentSubject = 'General Math' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(currentSubject || 'General Math');
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Draggable Position
  const [position, setPosition] = useState(() => {
    try {
      const saved = localStorage.getItem('nextgen_doubt_solver_pos');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return { x: 24, y: window.innerHeight - 90 };
  });

  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef({ startX: 0, startY: 0, initialX: 0, initialY: 0, hasMoved: false });
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const [messages, setMessages] = useState([
    {
      id: 'welcome-1',
      role: 'ai',
      content: `👋 **স্বাগতম! আমি নেক্সটজেন এআই টিচিং অ্যাসিস্ট্যান্ট।**
      
আমি তোমার **গণিত (General & Higher Math), পদার্থবিজ্ঞান, রসায়ন, জীববিজ্ঞান ও আইসিটি** বিষয়ের যেকোনো প্রশ্ন, সূত্র বা গাণিতিক সমস্যার সমাধান ধাপে ধাপে বুঝিয়ে দিতে প্রস্তুত।

নিচে তোমার প্রশ্নটি লিখো অথবা কুইক প্রম্পট বেছে নাও! 👇`,
      timestamp: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const quickPrompts = [
    { label: '📐 পিথাগোরাসের উপপাদ্য', prompt: 'পিথাগোরাসের উপপাদ্য এবং একটি সমকোণী ত্রিভুজের উদাহরণ সহ সমাধান বুঝিয়ে দাও।' },
    { label: '⚡ ওহমের সূত্র ও অংক', prompt: 'ওহমের সূত্র (Ohm\'s Law) ব্যাখ্যা করো এবং রোধ ও বিভব পার্থক্যের একটি গাণিতিক উদাহরণ দাও।' },
    { label: '🚀 গতির ৪টি সমীকরণ', prompt: 'পদার্থবিজ্ঞানের গতির ৪টি মৌলিক সমীকরণ এবং এগুলোর প্রতীকসমূহ বুঝিয়ে দাও।' },
    { label: '💻 বাইনারি থেকে ডেসিমাল', prompt: 'আইসিটি: (1101)₂ বাইনারি সংখ্যাকে কীভাবে ডেসিমালে রূপান্তর করতে হয় তা ধাপে ধাপে দেখাও।' },
    { label: '🧪 পরমাণুর ইলেকট্রন বিন্যাস', prompt: 'রসায়ন: বোর পরমাণু মডেল অনুসারে সোডিয়াম (Na) এর ইলেকট্রন বিন্যাস ব্যাখ্যা করো।' }
  ];

  const subjects = [
    'সাধারণ গণিত (General Math)',
    'উচ্চতর গণিত (Higher Math)',
    'পদার্থবিজ্ঞান (Physics)',
    'রসায়ন (Chemistry)',
    'জীববিজ্ঞান (Biology)',
    'তথ্য ও যোগাযোগ প্রযুক্তি (ICT)'
  ];

  // Screen resize bounds check
  useEffect(() => {
    const handleResize = () => {
      setPosition(prev => ({
        x: Math.min(Math.max(10, prev.x), window.innerWidth - (isOpen ? 390 : 70)),
        y: Math.min(Math.max(10, prev.y), window.innerHeight - (isOpen ? 540 : 70))
      }));
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, isMinimized, messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handlePointerDown = (e) => {
    // Only drag when clicking the drag handle or non-interactive areas
    if (e.target.closest('button') || e.target.closest('input') || e.target.closest('textarea') || e.target.closest('select')) {
      return;
    }

    setIsDragging(true);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialX: position.x,
      initialY: position.y,
      hasMoved: false
    };

    const handlePointerMove = (moveEvent) => {
      const deltaX = moveEvent.clientX - dragRef.current.startX;
      const deltaY = moveEvent.clientY - dragRef.current.startY;

      if (Math.abs(deltaX) > 4 || Math.abs(deltaY) > 4) {
        dragRef.current.hasMoved = true;
      }

      const widgetW = isOpen && !isMinimized ? 380 : 200;
      const widgetH = isOpen && !isMinimized ? 520 : 60;

      const newX = Math.min(Math.max(10, dragRef.current.initialX + deltaX), window.innerWidth - widgetW);
      const newY = Math.min(Math.max(10, dragRef.current.initialY + deltaY), window.innerHeight - widgetH);

      setPosition({ x: newX, y: newY });
    };

    const handlePointerUp = () => {
      setIsDragging(false);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);

      try {
        setPosition(cur => {
          localStorage.setItem('nextgen_doubt_solver_pos', JSON.stringify(cur));
          return cur;
        });
      } catch (err) {}
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  const handleSend = async (customPrompt) => {
    const textToSend = typeof customPrompt === 'string' ? customPrompt : inputMessage;
    if (!textToSend || !textToSend.trim() || isTyping) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (typeof customPrompt !== 'string') setInputMessage('');
    setIsTyping(true);

    try {
      const res = await doubtSolverAPI.solveDoubt({
        message: textToSend.trim(),
        history: messages.map((m) => ({ role: m.role, content: m.content })),
        studentClass,
        subject: selectedSubject
      });

      if (res.success && res.reply) {
        const aiMsg = {
          id: `ai-${Date.now()}`,
          role: 'ai',
          content: res.reply,
          timestamp: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })
        };
        setMessages((prev) => [...prev, aiMsg]);
      } else {
        throw new Error(res.error?.message || 'সমস্যাটির সমাধান পেতে সমস্যা হয়েছে');
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'ai',
          content: `⚠️ **ত্রুটি:** ${err.message || 'সার্ভারে সংযোগ করতে সমস্যা হয়েছে। একটু পর আবার চেষ্টা করো।'}`,
          timestamp: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: 'welcome-reset',
        role: 'ai',
        content: '🧹 নতুন চ্যাট শুরু হয়েছে। তোমার বিজ্ঞান বা গণিতের যেকোনো প্রশ্ন লিখো!',
        timestamp: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const toggleLauncherClick = () => {
    if (!dragRef.current.hasMoved) {
      setIsOpen(!isOpen);
      setIsMinimized(false);
    }
  };

  return (
    <div
      onPointerDown={handlePointerDown}
      style={{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: 95
      }}
      className={`select-none no-print transition-shadow duration-200 ${
        isDragging ? 'cursor-grabbing opacity-90 scale-[1.02]' : 'cursor-grab'
      }`}
    >
      {/* 1. COLLAPSED FLOATING LAUNCHER PILL */}
      {!isOpen && (
        <button
          type="button"
          onClick={toggleLauncherClick}
          className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-xs shadow-2xl shadow-indigo-950/60 border border-indigo-400/40 ring-1 ring-purple-400/30 transition-all hover:scale-105 active:scale-95 group"
          title="এআই ডাউট সলভার (ড্র্যাগ করুন বা ক্লিক করে ওপেন করুন)"
        >
          <div className="relative flex items-center justify-center">
            <Bot className="w-5 h-5 group-hover:rotate-12 transition-transform text-amber-300" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full animate-ping" />
          </div>
          <span className="tracking-wide">AI ডাউট সলভার</span>
          <Move className="w-3.5 h-3.5 text-indigo-300 opacity-60 group-hover:opacity-100" />
        </button>
      )}

      {/* 2. MINIMIZED FLOATING BADGE */}
      {isOpen && isMinimized && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-slate-900/95 border border-indigo-500/50 text-white shadow-2xl backdrop-blur-xl">
          <Bot className="w-4 h-4 text-indigo-400 animate-pulse" />
          <span className="text-xs font-bold text-slate-200">AI সলভার (মিনিমাইজড)</span>
          <button
            type="button"
            onClick={() => setIsMinimized(false)}
            className="p-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs"
            title="বড় করুন"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white text-xs"
            title="বন্ধ করুন"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 3. FULL EXPANDED DRAGGABLE CHAT WINDOW */}
      {isOpen && !isMinimized && (
        <div className="w-[360px] sm:w-[390px] h-[520px] bg-slate-900/95 backdrop-blur-2xl border border-indigo-500/40 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-white animate-in zoom-in-95 duration-150">
          
          {/* Header & Drag Handle */}
          <div className="p-3.5 bg-gradient-to-r from-indigo-950 via-purple-950 to-slate-900 border-b border-indigo-500/30 flex items-center justify-between cursor-grab active:cursor-grabbing">
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

            {/* Window Controls */}
            <div className="flex items-center space-x-1">
              <button
                type="button"
                onClick={handleClearHistory}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="চ্যাট হিস্ট্রি ক্লিয়ার করুন"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setIsMinimized(true)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="মিনিমাইজ করুন"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 transition-colors"
                title="বন্ধ করুন"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Subject Filter Bar */}
          <div className="px-3.5 py-2 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between text-xs">
            <span className="text-[11px] font-bold text-indigo-300 flex items-center gap-1">
              <BookOpen className="w-3 h-3 text-indigo-400" /> বিষয়:
            </span>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="bg-slate-800 text-slate-200 border border-slate-700 rounded-lg px-2 py-1 text-[11px] font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              {subjects.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-3 text-xs bg-slate-950/40">
            {messages.map((m) => (
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

            {isTyping && (
              <div className="flex items-center space-x-2 p-2.5 rounded-2xl bg-slate-800/80 border border-slate-700 max-w-[70%]">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                <span className="text-[11px] text-slate-300 font-bold animate-pulse">সমাধান চিন্তা করছে...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Carousel */}
          <div className="px-3 py-1.5 bg-slate-900 border-t border-slate-800 flex items-center space-x-1.5 overflow-x-auto no-scrollbar">
            {quickPrompts.map((qp, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSend(qp.prompt)}
                disabled={isTyping}
                className="whitespace-nowrap px-2.5 py-1 rounded-lg bg-slate-800/90 hover:bg-indigo-600/30 text-slate-300 hover:text-indigo-200 border border-slate-700/80 text-[10px] font-bold transition-colors shrink-0"
              >
                {qp.label}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-slate-900 border-t border-slate-800 flex items-center space-x-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="তোমার প্রশ্ন বা সমস্যাটি লিখো..."
              disabled={isTyping}
              className="flex-1 px-3 py-2 rounded-xl bg-slate-800/90 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isTyping}
              className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white shadow-md shadow-indigo-600/30 transition-all flex items-center justify-center"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}
    </div>
  );
}
