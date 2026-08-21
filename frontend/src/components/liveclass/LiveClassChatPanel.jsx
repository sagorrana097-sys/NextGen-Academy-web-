import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { liveClassAPI } from '../../services/api';
import {
  MessageSquare,
  Send,
  Pin,
  Trash2,
  Sparkles,
  Smile,
  Shield,
  GraduationCap,
  Users,
  Clock,
  Radio,
  X,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function LiveClassChatPanel({
  liveClassId,
  liveClassTitle = '',
  role = 'STUDENT',
  compact = false,
  onClose = null
}) {
  const { t, lang } = useLanguage();
  const { user } = useAuth();

  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [inputText, setInputText] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);

  const messagesEndRef = useRef(null);
  const isFirstLoad = useRef(true);

  // Fetch comments
  const fetchComments = async (silent = false) => {
    if (!liveClassId) return;
    try {
      if (!silent) setLoading(true);
      const res = await liveClassAPI.getComments(liveClassId);
      if (res.success) {
        setComments(res.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch live comments:', err);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments(false);
    isFirstLoad.current = true;

    // Real-time synchronization polling every 3.5 seconds
    const interval = setInterval(() => {
      fetchComments(true);
    }, 3500);

    return () => clearInterval(interval);
  }, [liveClassId]);

  // Auto-scroll on new message
  useEffect(() => {
    if (messagesEndRef.current && (isFirstLoad.current || comments.length > 0)) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      isFirstLoad.current = false;
    }
  }, [comments]);

  // Handle Send Comment
  const handleSend = async (e) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || sending) return;

    const content = inputText.trim();
    setInputText('');
    setSending(true);
    setErrorMsg(null);

    // Optimistic UI preview
    const tempId = 'temp-' + Date.now();
    const optimisticComment = {
      id: tempId,
      liveClassId,
      userId: user?.id,
      senderName: user?.name || 'ব্যবহারকারী',
      senderRole: user?.role || 'STUDENT',
      senderAvatar: user?.avatar || null,
      studentClassInfo: user?.role === 'TEACHER' ? 'বিষয় শিক্ষক' : (user?.role === 'STUDENT' ? 'শিক্ষার্থী' : 'অভিভাবক'),
      content,
      isPinned: false,
      createdAt: new Date().toISOString()
    };
    setComments(prev => [...prev, optimisticComment]);

    try {
      const res = await liveClassAPI.postComment(liveClassId, { content });
      if (res.success && res.data) {
        setComments(prev => prev.map(c => c.id === tempId ? res.data : c));
      } else {
        fetchComments(true);
      }
    } catch (err) {
      console.error('Failed to send comment:', err);
      setErrorMsg('মন্তব্য পাঠাতে সমস্যা হয়েছে। পুনরায় চেষ্টা করুন।');
      setComments(prev => prev.filter(c => c.id !== tempId));
    } finally {
      setSending(false);
    }
  };

  // Handle Toggle Pin
  const handleTogglePin = async (commentId) => {
    try {
      const res = await liveClassAPI.pinComment(liveClassId, commentId);
      if (res.success) {
        setComments(prev =>
          prev.map(c => c.id === commentId ? { ...c, isPinned: !c.isPinned } : c)
        );
      }
    } catch (err) {
      alert('পিন পরিবর্তনে ব্যর্থ হয়েছে');
    }
  };

  // Handle Delete
  const handleDelete = async (commentId) => {
    if (!window.confirm('আপনি কি নিশ্চিত এই মন্তব্যটি মুছে ফেলতে চান?')) return;
    try {
      const res = await liveClassAPI.deleteComment(liveClassId, commentId);
      if (res.success) {
        setComments(prev => prev.filter(c => c.id !== commentId));
      }
    } catch (err) {
      alert('কমেন্ট মুছতে সমস্যা হয়েছে');
    }
  };

  // Quick reaction chips
  const quickChips = [
    '👍 বুঝতে পেরেছি',
    '❓ এই পয়েন্টটি আরেকবার বুঝিয়ে দিন',
    '📝 নোট করেছি',
    '👏 চমৎকার ক্লাস'
  ];

  const pinnedComment = comments.find(c => c.isPinned);

  const formatTime = (isoString) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit', hour12: true });
    } catch (e) {
      return '';
    }
  };

  return (
    <div className={`flex flex-col h-full bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-xl overflow-hidden ${compact ? 'text-xs' : 'text-sm'}`}>
      {/* Header */}
      <div className="p-3.5 bg-slate-800/90 border-b border-slate-700/80 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-2.5 overflow-hidden">
          <div className="relative">
            <div className="p-2 rounded-xl bg-indigo-600/30 text-indigo-400 border border-indigo-500/30">
              <MessageSquare className="w-4 h-4" />
            </div>
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-slate-900 animate-pulse"></span>
          </div>

          <div className="overflow-hidden">
            <h4 className="font-bold text-xs sm:text-sm text-white flex items-center gap-1.5 truncate">
              <span>লাইভ চ্যাট ও প্রশ্নোত্তর</span>
              <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                {comments.length}টি
              </span>
            </h4>
            <p className="text-[10px] text-slate-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-ping"></span>
              <span>রিয়েল-টাইম প্রশ্নোত্তর সক্রিয়</span>
            </p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Pinned Announcement Box */}
      {pinnedComment && (
        <div className="p-2.5 bg-amber-500/10 border-b border-amber-500/20 text-amber-200 text-xs shrink-0 flex items-start justify-between gap-2 animate-in fade-in">
          <div className="flex items-start space-x-2 overflow-hidden">
            <Pin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5 fill-amber-400" />
            <div className="overflow-hidden">
              <div className="flex items-center space-x-1.5 text-[10px] text-amber-300 font-bold">
                <span>শীর্ষে পিন করা বার্তা</span>
                <span>•</span>
                <span>{pinnedComment.senderName}</span>
              </div>
              <p className="text-xs text-amber-100 mt-0.5 line-clamp-2 leading-relaxed">
                {pinnedComment.content}
              </p>
            </div>
          </div>

          {(role === 'TEACHER' || role === 'ADMIN') && (
            <button
              onClick={() => handleTogglePin(pinnedComment.id)}
              className="text-[10px] text-amber-300 hover:text-white font-bold underline shrink-0 px-1"
              title="আনপিন করুন"
            >
              আনপিন
            </button>
          )}
        </div>
      )}

      {/* Messages Scroll Area */}
      <div className="flex-1 p-3 overflow-y-auto space-y-3 scrollbar-thin scrollbar-thumb-slate-700">
        {loading && comments.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500 space-y-2">
            <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs">লাইভ কমেন্ট লোড হচ্ছে...</p>
          </div>
        ) : comments.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500 space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-400">
              <MessageSquare className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-slate-300">এখনো কোনো প্রশ্ন বা মন্তব্য নেই</p>
            <p className="text-[11px] text-slate-500">ক্লাস চলাকালীন শিক্ষককে যেকোনো প্রশ্ন করতে নিচে টাইপ করুন।</p>
          </div>
        ) : (
          comments.map((c) => {
            const isMe = c.userId === (user?.id || user?.userId);
            const isTeacher = c.senderRole === 'TEACHER';
            const isAdmin = c.senderRole === 'ADMIN';

            return (
              <div
                key={c.id}
                className={`flex flex-col group animate-in fade-in duration-150 ${
                  c.isPinned ? 'p-2.5 bg-amber-500/10 rounded-2xl border border-amber-500/30' : ''
                }`}
              >
                {/* Author Info Header */}
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <div className="flex items-center space-x-1.5">
                    {/* Avatar / Initial */}
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                      isTeacher
                        ? 'bg-emerald-600 text-white'
                        : isAdmin
                        ? 'bg-purple-600 text-white'
                        : 'bg-indigo-600/60 text-indigo-200'
                    }`}>
                      {c.senderName ? c.senderName.charAt(0) : 'U'}
                    </div>

                    <span className="font-bold text-slate-200 truncate max-w-[130px]">
                      {c.senderName}
                    </span>

                    {/* Role Badge */}
                    <span className={`px-1.5 py-0.2 rounded-md text-[9px] font-extrabold ${
                      isTeacher
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : isAdmin
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                        : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                    }`}>
                      {isTeacher ? 'শিক্ষক' : isAdmin ? 'অ্যাডমিন' : 'শিক্ষার্থী'}
                    </span>
                  </div>

                  <div className="flex items-center space-x-1 text-[10px] text-slate-400">
                    <span>{formatTime(c.createdAt)}</span>

                    {/* Action buttons (Pin / Delete) on hover */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-1 ml-1">
                      {(role === 'TEACHER' || role === 'ADMIN') && (
                        <button
                          onClick={() => handleTogglePin(c.id)}
                          className={`p-1 rounded hover:bg-slate-700 ${c.isPinned ? 'text-amber-400' : 'text-slate-400 hover:text-amber-300'}`}
                          title={c.isPinned ? 'আনপিন করুন' : 'পিন করুন'}
                        >
                          <Pin className="w-3 h-3" />
                        </button>
                      )}

                      {(isMe || role === 'TEACHER' || role === 'ADMIN') && (
                        <button
                          onClick={() => handleDelete(c.id)}
                          className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-slate-700"
                          title="মুছে ফেলুন"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Student Class / Sub info badge if available */}
                {c.studentClassInfo && !isTeacher && !isAdmin && (
                  <span className="text-[10px] text-slate-400 mb-1 ml-6.5 block font-mono">
                    {c.studentClassInfo}
                  </span>
                )}

                {/* Message Bubble */}
                <div className={`p-2.5 rounded-2xl text-xs leading-relaxed break-words ${
                  isTeacher
                    ? 'bg-emerald-950/70 text-emerald-100 border border-emerald-800/60 font-medium'
                    : isMe
                    ? 'bg-indigo-600/80 text-white rounded-tr-none'
                    : 'bg-slate-800 text-slate-200 border border-slate-700/60'
                }`}>
                  {c.content}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Reaction Chips */}
      <div className="px-3 py-1.5 bg-slate-950/60 border-t border-slate-800/80 flex items-center space-x-1.5 overflow-x-auto scrollbar-none shrink-0">
        {quickChips.map((chip, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setInputText(chip)}
            className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[10px] font-semibold transition-colors whitespace-nowrap border border-slate-700/50"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Input Form Bar */}
      <form onSubmit={handleSend} className="p-3 bg-slate-900 border-t border-slate-800 shrink-0">
        {errorMsg && (
          <p className="text-[10px] text-rose-400 mb-1.5">{errorMsg}</p>
        )}

        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="আপনার প্রশ্ন বা মতামত লিখুন..."
            disabled={sending}
            maxLength={300}
            className="flex-1 bg-slate-800/90 text-white placeholder-slate-400 px-3.5 py-2.5 rounded-xl text-xs border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium transition-all"
          />

          <button
            type="submit"
            disabled={!inputText.trim() || sending}
            className="p-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-xl font-bold shadow-md shadow-indigo-600/30 transition-all shrink-0 flex items-center justify-center"
            title="পাঠান"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
