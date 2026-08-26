import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2,
  VolumeX,
  Play,
  Square,
  Sparkles,
  BellRing,
  AlertCircle,
  ShieldAlert,
  Info,
  X,
  Radio,
  Headphones,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Flame,
  Megaphone
} from 'lucide-react';
import { announcementAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  speakText,
  stopSpeech,
  playChime,
  unlockAudio,
  isVoiceMuted,
  setVoiceMuted,
  hasSpokenInSession,
  markSpokenInSession
} from '../../utils/audioAnnouncer';

export default function PageAnnouncementBanner({
  targetPage = 'DASHBOARD',
  className = '',
  customRole = null,
  classId = null
}) {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [speakingId, setSpeakingId] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [selectedModalItem, setSelectedModalItem] = useState(null);

  useEffect(() => {
    setIsMuted(isVoiceMuted());
    fetchAnnouncements();

    return () => {
      stopSpeech();
    };
  }, [targetPage]);

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const userRole = customRole || user?.role || 'STUDENT';
      const res = await announcementAPI.getActive({
        page: targetPage,
        role: userRole,
        classId: classId || (user?.student?.classId ? String(user.student.classId) : 'ALL')
      });

      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        setAnnouncements(res.data);
        setCurrentIndex(0);

        // Check for first auto-speak announcement
        const autoSpeakItem = res.data.find(
          item => item.enableAudio && item.autoSpeak && !hasSpokenInSession(item.id)
        );

        if (autoSpeakItem && !isVoiceMuted()) {
          const timer = setTimeout(() => {
            handleSpeak(autoSpeakItem, true);
          }, 800);
          return () => clearTimeout(timer);
        }
      } else {
        setAnnouncements([]);
      }
    } catch (err) {
      console.warn('Failed to load page announcements:', err);
    } finally {
      setLoading(false);
    }
  };

  // Auto-cycle through news ticker headlines every 7 seconds
  useEffect(() => {
    if (announcements.length <= 1 || isPaused || speakingId) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length);
    }, 7000);

    return () => clearInterval(interval);
  }, [announcements.length, isPaused, speakingId]);

  const currentItem = announcements[currentIndex];

  const handleSpeak = (item, isAuto = false) => {
    if (!item) return;
    unlockAudio();

    if (speakingId === item.id) {
      stopSpeech();
      setSpeakingId(null);
      return;
    }

    setSpeakingId(item.id);
    if (isAuto) {
      markSpokenInSession(item.id);
    }

    const fullSpeechText = `${item.title}। ${item.message}`;

    speakText(fullSpeechText, {
      lang: item.voiceLanguage || 'bn-BD',
      pitch: Number(item.speechPitch) || 1.08,
      rate: Number(item.speechRate) || 0.94,
      chimeType: item.chimeSound || 'pleasant_bell',
      playChimeBefore: true,
      onStart: () => setSpeakingId(item.id),
      onEnd: () => setSpeakingId(null),
      onError: () => setSpeakingId(null)
    });
  };

  const handleToggleMute = () => {
    const nextVal = !isMuted;
    setIsMuted(nextVal);
    setVoiceMuted(nextVal);
    if (nextVal) {
      stopSpeech();
      setSpeakingId(null);
    }
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? announcements.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % announcements.length);
  };

  if (loading || isDismissed || announcements.length === 0 || !currentItem) {
    return null;
  }

  const isSpeaking = speakingId === currentItem.id;
  const isUrgent = currentItem.priority === 'URGENT';
  const isHigh = currentItem.priority === 'HIGH';

  return (
    <>
      {/* Compact News Ticker / Headline Bar Style Banner */}
      <div
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className={`w-full rounded-2xl border shadow-md transition-all duration-300 overflow-hidden ${
          isUrgent
            ? 'bg-gradient-to-r from-rose-950 via-slate-900 to-rose-950 border-rose-500/50 text-white'
            : isHigh
            ? 'bg-gradient-to-r from-amber-950 via-slate-900 to-amber-950 border-amber-500/50 text-white'
            : 'bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-indigo-500/40 text-white'
        } ${isSpeaking ? 'ring-2 ring-teal-400 shadow-teal-500/20' : ''} ${className}`}
      >
        <div className="px-3 sm:px-4 py-2 sm:py-2.5 flex items-center justify-between gap-2.5">
          {/* Left Headline Tag / Badge */}
          <div className="flex items-center space-x-2 shrink-0">
            <div
              className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-xl text-[11px] font-black uppercase tracking-wider shadow-inner shrink-0 ${
                isUrgent
                  ? 'bg-rose-600 text-white animate-pulse'
                  : isHigh
                  ? 'bg-amber-500 text-slate-950'
                  : 'bg-indigo-600 text-white'
              }`}
            >
              <Radio className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '4s' }} />
              <span className="hidden sm:inline">
                {isUrgent ? 'জরুরি শিরোনাম' : isHigh ? 'সংবাদ শিরোনাম' : 'ঘোষণা'}
              </span>
              <span className="sm:hidden">শিরোনাম</span>
            </div>

            {/* Target Page tag chip if specific */}
            {currentItem.targetPage && currentItem.targetPage !== 'ALL' && (
              <span className="hidden md:inline-flex text-[10px] font-bold px-2 py-0.5 rounded-lg bg-white/10 text-slate-300 border border-white/10">
                {currentItem.targetPage === 'LIVE_CLASS'
                  ? 'লাইভ ক্লাস'
                  : currentItem.targetPage === 'EXAM_HALL'
                  ? 'পরীক্ষা হল'
                  : currentItem.targetPage}
              </span>
            )}
          </div>

          {/* Center Scrolling / Ticker Headline Text (Clickable for full view) */}
          <div
            onClick={() => setSelectedModalItem(currentItem)}
            className="flex-1 min-w-0 cursor-pointer group flex items-center space-x-2"
            title="সম্পূর্ণ নোটিশ দেখতে ক্লিক করুন"
          >
            <div className="truncate text-xs sm:text-sm font-bold text-slate-100 group-hover:text-amber-300 transition-colors flex items-center space-x-2">
              <span className="text-white font-extrabold">{currentItem.title}</span>
              <span className="hidden sm:inline opacity-75 font-normal text-slate-300 truncate">
                — {currentItem.message}
              </span>
            </div>

            {/* Speaking Equalizer waves */}
            {isSpeaking && (
              <div className="flex items-end h-3.5 space-x-0.5 shrink-0 px-2 py-0.5 rounded-full bg-teal-500/20 border border-teal-500/40 text-teal-300 text-[10px] font-bold">
                <span className="mr-1 hidden sm:inline">ভয়েস চালু</span>
                <div className="w-1 bg-teal-400 rounded-full animate-pulse h-2" />
                <div className="w-1 bg-teal-400 rounded-full animate-bounce h-3.5" />
                <div className="w-1 bg-teal-400 rounded-full animate-pulse h-1.5" />
                <div className="w-1 bg-teal-400 rounded-full animate-bounce h-2.5" />
              </div>
            )}
          </div>

          {/* Right Controls: Audio Player, Prev/Next, Fullscreen Modal & Dismiss */}
          <div className="flex items-center space-x-1.5 shrink-0">
            {/* Audio Listen Button */}
            {currentItem.enableAudio && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSpeak(currentItem);
                }}
                className={`px-2.5 sm:px-3 py-1 rounded-xl text-[11px] font-black flex items-center space-x-1 shadow-sm transition-all active:scale-95 cursor-pointer ${
                  isSpeaking
                    ? 'bg-rose-600 hover:bg-rose-700 text-white'
                    : 'bg-teal-500 hover:bg-teal-400 text-slate-950'
                }`}
                title={isSpeaking ? 'অডিও বন্ধ করুন' : 'মহিলা কণ্ঠে শুনুন'}
              >
                {isSpeaking ? (
                  <>
                    <Square className="w-3 h-3 fill-current" />
                    <span className="hidden sm:inline">থামান</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3 h-3" />
                    <span className="hidden sm:inline">শুনুন</span>
                  </>
                )}
              </button>
            )}

            {/* Prev / Next Pagination if multiple items */}
            {announcements.length > 1 && (
              <div className="flex items-center space-x-0.5 bg-white/10 rounded-xl p-0.5 border border-white/10">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="p-1 text-slate-300 hover:text-white rounded-lg transition-colors cursor-pointer"
                  title="পূর্ববর্তী সংবাদ"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <span className="text-[10px] font-bold text-slate-300 px-1 font-mono">
                  {currentIndex + 1}/{announcements.length}
                </span>
                <button
                  type="button"
                  onClick={handleNext}
                  className="p-1 text-slate-300 hover:text-white rounded-lg transition-colors cursor-pointer"
                  title="পরবর্তী সংবাদ"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Dismiss Bar Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                stopSpeech();
                setSpeakingId(null);
                setIsDismissed(true);
              }}
              className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
              title="শিরোনাম বন্ধ করুন"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Detailed Notice Modal on Click */}
      {selectedModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className={`text-[11px] font-black px-2.5 py-0.5 rounded-full ${
                    selectedModalItem.priority === 'URGENT'
                      ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                      : selectedModalItem.priority === 'HIGH'
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
                  }`}>
                    {selectedModalItem.priority === 'URGENT' ? '🔴 জরুরি নোটিশ' : '📢 অফিশিয়াল ঘোষণা'}
                  </span>
                  {selectedModalItem.enableAudio && (
                    <span className="text-[10px] font-bold text-pink-600 dark:text-pink-400 flex items-center gap-1">
                      <Headphones className="w-3 h-3" />
                      <span>মহিলা ভয়েস সংযুক্ত</span>
                    </span>
                  )}
                </div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  {selectedModalItem.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedModalItem(null)}
                className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium whitespace-pre-wrap max-h-60 overflow-y-auto">
              {selectedModalItem.message}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
              {selectedModalItem.enableAudio ? (
                <button
                  type="button"
                  onClick={() => handleSpeak(selectedModalItem)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all cursor-pointer ${
                    speakingId === selectedModalItem.id
                      ? 'bg-rose-600 text-white'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20'
                  }`}
                >
                  {speakingId === selectedModalItem.id ? (
                    <>
                      <Square className="w-3.5 h-3.5 fill-current" />
                      <span>ভয়েস থামান</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>মহিলা কণ্ঠে শুনুন</span>
                    </>
                  )}
                </button>
              ) : <div />}

              <button
                type="button"
                onClick={() => setSelectedModalItem(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold text-xs"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
