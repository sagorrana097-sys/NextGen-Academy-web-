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
  MessageSquare
} from 'lucide-react';

export default function FloatingDoubtSolver({ studentClass = 'Class 9', currentSubject = 'General Math' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(currentSubject || 'General Math');
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

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

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

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

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, isMinimized, messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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
      }
    } catch (err) {
      console.error('Doubt solver error:', err);
      const errMsg = {
        id: `ai-err-${Date.now()}`,
        role: 'ai',
        content: '⚠️ দুঃখিত, সার্ভারের সাথে সংযোগে সাময়িক ত্রুটি হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।',
        timestamp: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleClearChat = () => {
    if (!window.confirm('আপনি কি পূর্বের কথোপকথন মুছে নতুন চ্যাট শুরু করতে চান?')) return;
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'ai',
        content: '✨ নতুন চ্যাট শুরু হয়েছে! তোমার যেকোনো অ্যাকাডেমিক প্রশ্ন এখানে লিখে পাঠাও।',
        timestamp: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <div className="fixed bottom-24 right-6 z-40 font-sans select-none">
      {/* Floating Action Trigger Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => {
            setIsOpen(true);
            setIsMinimized(false);
          }}
          className="group relative flex items-center space-x-2.5 px-4 py-3.5 rounded-full bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white shadow-2xl shadow-emerald-600/40 border border-emerald-400/40 transition-all duration-300 transform hover:scale-105 active:scale-95"
          title="24/7 AI Doubt Solver"
        >
          <div className="relative">
            <Bot className="w-6 h-6 text-white group-hover:rotate-12 transition-transform duration-300" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full animate-ping"></span>
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full border-2 border-emerald-700"></span>
          </div>
          <div className="text-left hidden sm:block">
            <span className="text-[11px] font-black uppercase tracking-wider block text-emerald-200">
              24/7 এআই শিক্ষক
            </span>
            <span className="text-xs font-black text-white flex items-center space-x-1">
              <span>AI Doubt Solver</span>
              <Sparkles className="w-3 h-3 text-amber-300" />
            </span>
          </div>
        </button>
      )}

      {/* Floating Chat Modal Window */}
      {isOpen && (
        <div
          className={`bg-slate-900 border border-emerald-500/40 rounded-3xl shadow-2xl shadow-emerald-950/50 flex flex-col overflow-hidden text-white transition-all duration-300 backdrop-blur-xl ${
            isMinimized
              ? 'w-72 sm:w-80 h-16'
              : 'w-[360px] sm:w-[440px] max-w-[95vw] h-[580px] max-h-[85vh]'
          }`}
        >
          {/* Header */}
          <div className="p-3.5 sm:p-4 bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 border-b border-emerald-500/20 flex items-center justify-between shrink-0">
            <div className="flex items-center space-x-3 min-w-0">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/30 shrink-0">
                <Bot className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center space-x-1.5">
                  <h3 className="text-xs sm:text-sm font-black text-white truncate">
                    NextGen AI Assistant
                  </h3>
                  <span className="px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[9px] font-bold shrink-0">
                    24/7 লাইভ
                  </span>
                </div>
                <p className="text-[10px] text-emerald-300/80 truncate font-medium">
                  {studentClass} • {selectedSubject.split(' ')[0]}
                </p>
              </div>
            </div>

            {/* Window Controls */}
            <div className="flex items-center space-x-1 shrink-0">
              <button
                type="button"
                onClick={handleClearChat}
                className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                title="চ্যাট হিস্ট্রি ক্লিয়ার করুন"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                title={isMinimized ? 'ম্যাক্সিমাইজ' : 'মিনিমাইজ'}
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
              </button>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-xl hover:bg-rose-900/40 text-slate-400 hover:text-rose-400 transition-colors"
                title="বন্ধ করুন"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Subject Selection Strip */}
              <div className="px-3 py-2 bg-slate-950/60 border-b border-slate-800 flex items-center space-x-1.5 overflow-x-auto shrink-0">
                <span className="text-[10px] text-slate-400 font-bold whitespace-nowrap mr-1">
                  বিষয়:
                </span>
                {subjects.map((s) => {
                  const isSelected = selectedSubject === s;
                  const shortName = s.split(' ')[0];
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSelectedSubject(s)}
                      className={`px-2.5 py-1 rounded-xl text-[10px] font-bold whitespace-nowrap transition-all ${
                        isSelected
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                      }`}
                    >
                      {shortName}
                    </button>
                  );
                })}
              </div>

              {/* Scrollable Messages Area */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-950/40">
                {messages.map((msg) => {
                  const isAi = msg.role === 'ai';
                  return (
                    <div
                      key={msg.id}
                      className={`flex items-start space-x-2.5 animate-in fade-in ${
                        isAi ? 'justify-start' : 'justify-end flex-row-reverse space-x-reverse'
                      }`}
                    >
                      {/* Avatar */}
                      <div
                        className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 shadow-md ${
                          isAi
                            ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white'
                            : 'bg-indigo-600 text-white'
                        }`}
                      >
                        {isAi ? <Bot className="w-4 h-4" /> : <span className="text-xs font-bold">You</span>}
                      </div>

                      {/* Bubble */}
                      <div
                        className={`max-w-[85%] rounded-2xl p-3.5 text-xs shadow-md ${
                          isAi
                            ? 'bg-slate-900 border border-slate-800 text-slate-100'
                            : 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-medium'
                        }`}
                      >
                        <div className="prose prose-invert prose-xs max-w-none leading-relaxed space-y-2">
                          <ReactMarkdown
                            remarkPlugins={[remarkMath, remarkGfm]}
                            rehypePlugins={[rehypeKatex]}
                            className="prose prose-sm text-slate-100 max-w-none"
                            components={{
                              p: ({ node, ...props }) => <p className="mb-1.5 last:mb-0" {...props} />,
                              h3: ({ node, ...props }) => <h3 className="text-emerald-400 font-black text-xs my-1" {...props} />,
                              h4: ({ node, ...props }) => <h4 className="text-teal-300 font-bold text-[11px] my-1" {...props} />,
                              ul: ({ node, ...props }) => <ul className="list-disc pl-4 space-y-0.5" {...props} />,
                              ol: ({ node, ...props }) => <ol className="list-decimal pl-4 space-y-0.5" {...props} />,
                              blockquote: ({ node, ...props }) => (
                                <blockquote className="border-l-2 border-emerald-500 pl-2 py-1 bg-emerald-950/20 text-emerald-200 my-1 rounded" {...props} />
                              ),
                              code: ({ node, inline, ...props }) =>
                                inline ? (
                                   <code className="px-1 py-0.5 rounded bg-slate-800 text-emerald-300 font-mono text-[10px]" {...props} />
                                ) : (
                                  <pre className="p-2 rounded-xl bg-black/60 text-emerald-300 font-mono text-[10px] overflow-x-auto my-1 border border-slate-800" {...props} />
                                )
                            }}
                          >
                            {msg.content || msg.text}
                          </ReactMarkdown>
                        </div>
                        <span className="block text-[9px] text-slate-400 mt-1.5 text-right font-mono">
                          {msg.timestamp}
                        </span>
                      </div>
                    </div>
                  );
                })}

                {/* Typing Loader Indicator */}
                {isTyping && (
                  <div className="flex items-start space-x-2.5 animate-in fade-in">
                    <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shrink-0 shadow-md">
                      <Bot className="w-4 h-4 animate-spin" />
                    </div>
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl px-4 py-3 text-xs flex items-center space-x-1.5 text-emerald-400 shadow-md">
                      <span className="text-[11px] font-bold">উত্তর তৈরি হচ্ছে</span>
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce"></span>
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Prompts Suggestions Carousel */}
              <div className="px-3 py-2 bg-slate-950/80 border-t border-slate-800/80 flex items-center space-x-1.5 overflow-x-auto shrink-0">
                <span className="text-[10px] text-amber-400 font-bold whitespace-nowrap flex items-center space-x-1">
                  <Sparkles className="w-3 h-3" />
                  <span>দ্রুত প্রশ্ন:</span>
                </span>
                {quickPrompts.map((qp, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleSend(qp.prompt)}
                    className="px-2.5 py-1 rounded-xl bg-slate-800/90 hover:bg-emerald-900/40 hover:border-emerald-500/40 border border-slate-700 text-[10px] text-slate-300 hover:text-emerald-300 whitespace-nowrap transition-colors"
                  >
                    {qp.label}
                  </button>
                ))}
              </div>

              {/* Footer Input */}
              <div className="p-3 bg-slate-900 border-t border-slate-800 shrink-0">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSend();
                  }}
                  className="flex items-center space-x-2"
                >
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="যেকোনো অংক বা সূত্র সম্পর্কে জানতে লিখুন..."
                    disabled={isTyping}
                    className="flex-1 px-3.5 py-2.5 rounded-2xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-medium"
                  />
                  <button
                    type="submit"
                    disabled={!inputMessage.trim() || isTyping}
                    className="p-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white shadow-md shadow-emerald-600/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95"
                    title="পাঠান (Send)"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
                <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1 px-1">
                  <span>Enter চাপুন পাঠাতে</span>
                  <span>NextGen AI Academic Tutor</span>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
