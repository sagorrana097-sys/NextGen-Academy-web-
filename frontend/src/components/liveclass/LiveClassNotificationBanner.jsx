import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { liveClassAPI } from '../../services/api';
import { Video, Clock, ExternalLink, X, AlertCircle, Radio, Sparkles } from 'lucide-react';

export default function LiveClassNotificationBanner({ classId = null, sectionId = null, onNavigateToLiveTab }) {
  const { t, lang } = useLanguage();
  const [alerts, setAlerts] = useState([]);
  const [dismissedIds, setDismissedIds] = useState([]);

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, [classId, sectionId]);

  const fetchAlerts = async () => {
    try {
      const params = {};
      if (classId) params.classId = classId;
      if (sectionId) params.sectionId = sectionId;
      const res = await liveClassAPI.getAlerts(params);
      if (res.success && Array.isArray(res.data)) {
        setAlerts(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch live alerts:', err);
    }
  };

  const activeAlerts = alerts.filter(a => !dismissedIds.includes(a.id));

  if (activeAlerts.length === 0) return null;

  return (
    <div className="mb-6 space-y-3">
      {activeAlerts.map((item) => {
        const isLive = item.status === 'LIVE';
        const startTime = new Date(item.scheduledStartTime);
        const now = new Date();
        const diffMinutes = Math.max(0, Math.round((startTime.getTime() - now.getTime()) / 60000));

        return (
          <div
            key={item.id}
            className={`relative overflow-hidden rounded-2xl border p-4 sm:p-5 shadow-lg transition-all ${
              isLive
                ? 'bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white border-red-400 shadow-red-500/20 animate-pulse-slow'
                : 'bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white border-amber-300 shadow-amber-500/20'
            }`}
          >
            {/* Background Glow */}
            <div className="absolute -right-10 -bottom-10 w-36 h-36 bg-white/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
              <div className="flex items-start space-x-3.5">
                <div
                  className={`p-3 rounded-xl flex items-center justify-center shrink-0 shadow-md ${
                    isLive ? 'bg-white text-red-600' : 'bg-white/20 backdrop-blur-md text-white'
                  }`}
                >
                  {isLive ? (
                    <Radio className="w-6 h-6 animate-pulse" />
                  ) : (
                    <Clock className="w-6 h-6" />
                  )}
                </div>

                <div>
                  <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                    <span
                      className={`text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                        isLive ? 'bg-white text-red-700' : 'bg-black/20 text-white border border-white/30'
                      }`}
                    >
                      {isLive ? (lang === 'bn' ? '🔴 এখনই লাইভ চলছে' : '🔴 LIVE NOW') : (lang === 'bn' ? '⚠️ আসন্ন লাইভ ক্লাস' : '⚠️ UPCOMING CLASS')}
                    </span>
                    <span className="text-xs text-white/90 font-medium">
                      {item.subject?.nameBn || item.subject?.nameEn || 'বিষয়'}
                    </span>
                    {item.class && (
                      <span className="text-[11px] bg-white/20 px-2 py-0.5 rounded-md font-semibold">
                        {item.class.nameBn || item.class.nameEn}
                      </span>
                    )}
                  </div>

                  <h4 className="text-base sm:text-lg font-bold text-white mt-1 leading-snug">
                    {item.title}
                  </h4>

                  <p className="text-xs text-white/90 mt-0.5 flex items-center gap-2 flex-wrap">
                    <span>
                      {lang === 'bn'
                        ? (isLive ? 'ক্লাস শুরু হয়েছে, দ্রুত যুক্ত হন।' : `ক্লাস শুরু হতে আর মাত্র ${diffMinutes} মিনিট বাকি!`)
                        : (isLive ? 'Class is live now, please join immediately.' : `Class starts in about ${diffMinutes} minutes!`)}
                    </span>
                    {item.teacher?.user?.name && (
                      <span className="text-white/80">• শিক্ষক: {item.teacher.user.name}</span>
                    )}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2.5 w-full sm:w-auto shrink-0 justify-end">
                {item.meetingLink && (
                  <a
                    href={item.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center space-x-2 px-5 py-2.5 bg-white text-slate-900 hover:bg-slate-100 font-bold rounded-xl shadow-md transition-transform transform active:scale-95 text-xs sm:text-sm"
                  >
                    <Video className="w-4 h-4 text-red-600" />
                    <span>{lang === 'bn' ? 'এখনই ক্লাসে যুক্ত হন' : 'Join Live Class'}</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                  </a>
                )}

                {onNavigateToLiveTab && (
                  <button
                    onClick={onNavigateToLiveTab}
                    className="px-3 py-2.5 bg-black/20 hover:bg-black/30 text-white rounded-xl text-xs font-semibold backdrop-blur-md transition-colors"
                  >
                    {lang === 'bn' ? 'ক্লাসরুম দেখুন' : 'Classroom'}
                  </button>
                )}

                <button
                  onClick={() => setDismissedIds([...dismissedIds, item.id])}
                  className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                  title="Dismiss"
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
