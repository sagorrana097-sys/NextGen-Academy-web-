import React, { useState, useEffect } from 'react';
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
  Headphones
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
  const [loading, setLoading] = useState(true);
  const [speakingId, setSpeakingId] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [dismissedIds, setDismissedIds] = useState(new Set());

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

      if (res.success && Array.isArray(res.data)) {
        setAnnouncements(res.data);

        // Check for first auto-speak announcement
        const autoSpeakItem = res.data.find(
          item => item.enableAudio && item.autoSpeak && !hasSpokenInSession(item.id)
        );

        if (autoSpeakItem && !isVoiceMuted()) {
          // Trigger after 600ms page entry delay for smooth transition
          const timer = setTimeout(() => {
            handleSpeak(autoSpeakItem, true);
          }, 600);
          return () => clearTimeout(timer);
        }
      }
    } catch (err) {
      console.warn('Failed to load page announcements:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSpeak = (item, isAuto = false) => {
    // Explicitly unlock audio synchronously on user gesture / call
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

  const handleDismiss = (id) => {
    if (speakingId === id) {
      stopSpeech();
      setSpeakingId(null);
    }
    setDismissedIds(prev => new Set([...prev, id]));
  };

  const visibleAnnouncements = announcements.filter(item => !dismissedIds.has(item.id));

  if (loading || visibleAnnouncements.length === 0) {
    return null;
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {visibleAnnouncements.map((item) => {
        const isSpeaking = speakingId === item.id;
        const isUrgent = item.priority === 'URGENT';
        const isHigh = item.priority === 'HIGH';

        // Border & theme colors
        const theme = isUrgent
          ? {
              bg: 'bg-gradient-to-r from-rose-900/90 via-slate-900 to-rose-950/90 border-rose-500/50 text-white',
              badge: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
              btn: 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30',
              wave: 'bg-rose-400',
              icon: ShieldAlert,
              iconColor: 'text-rose-400'
            }
          : isHigh
          ? {
              bg: 'bg-gradient-to-r from-amber-900/80 via-slate-900 to-slate-900 border-amber-500/40 text-white',
              badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
              btn: 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/30',
              wave: 'bg-amber-400',
              icon: AlertCircle,
              iconColor: 'text-amber-400'
            }
          : {
              bg: 'bg-gradient-to-r from-indigo-950/90 via-slate-900 to-slate-900 border-indigo-500/30 text-white',
              badge: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
              btn: 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30',
              wave: 'bg-teal-400',
              icon: BellRing,
              iconColor: 'text-teal-400'
            };

        const IconComponent = theme.icon;

        return (
          <div
            key={item.id}
            className={`relative rounded-2xl sm:rounded-3xl p-4 sm:p-5 border shadow-xl backdrop-blur-md transition-all duration-300 ${theme.bg} ${
              isSpeaking ? 'ring-2 ring-teal-400/50 shadow-teal-500/10' : ''
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Left Content Area */}
              <div className="flex items-start space-x-3.5 flex-1 min-w-0">
                <div className={`p-2.5 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 shrink-0 mt-0.5 ${theme.iconColor}`}>
                  <IconComponent className="w-5 h-5" />
                </div>

                <div className="space-y-1.5 min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border ${theme.badge}`}>
                      {isUrgent ? '🔴 জরুরি ঘোষণা' : isHigh ? '🟡 গুরুত্বপূর্ণ বার্তা' : '📢 নোটিশ'}
                    </span>

                    {item.targetPage && item.targetPage !== 'ALL' && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/10 text-slate-300 border border-white/10">
                        📍 {item.targetPage === 'LIVE_CLASS' ? 'লাইভ ক্লাস' : item.targetPage === 'EXAM_HALL' ? 'পরীক্ষা হল' : item.targetPage}
                      </span>
                    )}

                    {item.enableAudio && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-pink-500/20 text-pink-300 border border-pink-500/30 flex items-center gap-1">
                        <Headphones className="w-3 h-3 text-pink-400" />
                        <span>🎙️ প্রফেশনাল ফিমেল ভয়েস</span>
                      </span>
                    )}

                    {/* Animated Audio Equalizer Wave when Speaking */}
                    {isSpeaking && (
                      <div className="flex items-center space-x-0.5 px-2 py-0.5 rounded-full bg-teal-500/20 border border-teal-500/40 text-teal-300 text-[10px] font-bold animate-pulse">
                        <span className="mr-1">স্পিচ চালু রয়েছে</span>
                        <div className="flex items-end h-3 space-x-0.5">
                          <div className="w-1 bg-teal-400 rounded-full animate-pulse h-2" />
                          <div className="w-1 bg-teal-400 rounded-full animate-bounce h-3" />
                          <div className="w-1 bg-teal-400 rounded-full animate-pulse h-1.5" />
                          <div className="w-1 bg-teal-400 rounded-full animate-bounce h-2.5" />
                        </div>
                      </div>
                    )}
                  </div>

                  <h4 className="text-sm sm:text-base font-extrabold text-white tracking-tight">
                    {item.title}
                  </h4>

                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed break-words font-medium">
                    {item.message}
                  </p>
                </div>
              </div>

              {/* Right Action Controls */}
              <div className="flex items-center justify-end space-x-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-white/10">
                {/* Audio Listen / Stop Button */}
                {item.enableAudio && (
                  <button
                    type="button"
                    onClick={() => handleSpeak(item)}
                    className={`px-4 py-2.5 rounded-2xl text-xs font-black shadow-md flex items-center space-x-1.5 transition-all active:scale-95 cursor-pointer ${
                      isSpeaking
                        ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/40'
                        : theme.btn
                    }`}
                    title={isSpeaking ? 'অডিও বন্ধ করুন' : 'মহিলা কণ্ঠে শুনুন'}
                  >
                    {isSpeaking ? (
                      <>
                        <Square className="w-3.5 h-3.5 fill-current text-white" />
                        <span>থামান (Stop)</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>🔊 শুনুন (Listen)</span>
                      </>
                    )}
                  </button>
                )}

                {/* Global Mute Toggle */}
                {item.enableAudio && (
                  <button
                    type="button"
                    onClick={handleToggleMute}
                    className={`p-2.5 rounded-2xl text-xs border transition-colors cursor-pointer ${
                      isMuted
                        ? 'bg-rose-500/20 border-rose-500/30 text-rose-300'
                        : 'bg-white/10 hover:bg-white/20 border-white/10 text-slate-300 hover:text-white'
                    }`}
                    title={isMuted ? 'ভয়েস আনমিউট করুন' : 'ভয়েস মিউট করুন'}
                  >
                    {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                )}

                {/* Dismiss Button */}
                <button
                  type="button"
                  onClick={() => handleDismiss(item.id)}
                  className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  title="বন্ধ করুন (Dismiss)"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
