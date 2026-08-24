import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { liveClassAPI } from '../../services/api';
import LiveClassChatPanel from './LiveClassChatPanel';
import WebRTCLiveClassroom from './WebRTCLiveClassroom';
import RecordedClassLibrary from '../common/RecordedClassLibrary';
import OnlineAdmissionForm from '../public/OnlineAdmissionForm';
import {
  Video,
  Radio,
  Clock,
  Calendar,
  Play,
  Film,
  FileText,
  Download,
  ExternalLink,
  Search,
  BookOpen,
  Sparkles,
  CheckCircle,
  X,
  Maximize2,
  AlertCircle,
  Key,
  ChevronRight,
  Info,
  MessageSquare,
  Lock,
  GraduationCap,
  Check,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { useProctoring } from '../../hooks/useProctoring';

export default function LiveClassroomView({ studentId = null, role = 'STUDENT' }) {
  const { t, lang } = useLanguage();
  const { user } = useAuth();

  const isPrivileged = role === 'ADMIN' || role === 'TEACHER' || user?.role === 'ADMIN' || user?.role === 'TEACHER';
  const isPaidOrEnrolled = isPrivileged || (user && user.role === 'STUDENT' && user.paymentStatus !== 'UNPAID' && user.isEnrolled !== false);

  const [classesList, setClassesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('LIVE'); // 'LIVE' | 'UPCOMING' | 'RECORDED'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState('');

  // WebRTC Live Classroom Modal State
  const [activeWebRTCClass, setActiveWebRTCClass] = useState(null);

  // Video Player Modal State
  const [watchingVideo, setWatchingVideo] = useState(null);

  // Freemium Lock CTA Modal State
  const [showLockCtaModal, setShowLockCtaModal] = useState(null);
  const [showAdmissionModal, setShowAdmissionModal] = useState(false);

  // Automated Live Class Proctoring & Attendance SMS Alerts
  const isClassActive = Boolean(activeWebRTCClass || watchingVideo);
  const activeClassName = activeWebRTCClass?.title || watchingVideo?.title || 'লাইভ ক্লাস';

  const { tabSwitchCount, lastWarning, clearWarning } = useProctoring({
    type: 'CLASS',
    name: activeClassName,
    className: user?.class?.nameBn || '',
    studentId: studentId || user?.studentId || user?.id,
    enabled: isClassActive && (role === 'STUDENT' || user?.role === 'STUDENT')
  });

  useEffect(() => {
    fetchStudentClasses();
  }, [studentId]);

  const fetchStudentClasses = async () => {
    try {
      setLoading(true);
      let res;
      if (studentId) {
        res = await liveClassAPI.getStudentLiveClasses(studentId);
      } else {
        res = await liveClassAPI.getLiveClasses();
      }
      if (res.success) {
        setClassesList(res.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch student live classes:', err);
    } finally {
      setLoading(false);
    }
  };

  // Convert YouTube/Video URLs to embed URL
  const getEmbedUrl = (url) => {
    if (!url) return '';
    try {
      if (url.includes('youtube.com/watch')) {
        const urlObj = new URL(url);
        const v = urlObj.searchParams.get('v');
        return `https://www.youtube.com/embed/${v}?autoplay=1&rel=0`;
      }
      if (url.includes('youtu.be/')) {
        const id = url.split('youtu.be/')[1]?.split('?')[0];
        return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
      }
      if (url.includes('youtube.com/embed/')) {
        return url;
      }
      return url;
    } catch (e) {
      return url;
    }
  };

  // Group classes
  const liveClasses = classesList.filter(c => c.status === 'LIVE');
  const upcomingClasses = classesList.filter(c => c.status === 'UPCOMING');
  const recordedClasses = classesList.filter(c => c.status === 'COMPLETED' || (c.recordingUrl && c.recordingUrl.trim() !== ''));

  // Filter based on active tab & filters
  let displayedList = [];
  if (activeTab === 'LIVE') {
    displayedList = liveClasses;
  } else if (activeTab === 'UPCOMING') {
    displayedList = upcomingClasses;
  } else if (activeTab === 'RECORDED') {
    displayedList = recordedClasses;
  }

  // Extract unique subjects
  const subjectsMap = {};
  classesList.forEach(c => {
    if (c.subject) {
      subjectsMap[c.subject.id] = c.subject.nameBn || c.subject.nameEn;
    }
  });

  if (selectedSubjectFilter) {
    displayedList = displayedList.filter(c => String(c.subjectId) === String(selectedSubjectFilter));
  }

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    displayedList = displayedList.filter(c =>
      (c.title && c.title.toLowerCase().includes(q)) ||
      (c.description && c.description.toLowerCase().includes(q)) ||
      (c.subject?.nameBn && c.subject.nameBn.toLowerCase().includes(q)) ||
      (c.teacher?.user?.name && c.teacher.user.name.toLowerCase().includes(q))
    );
  }

  const handleAccessClass = (item, action) => {
    const isDemo = Boolean(item.isDemo);
    if (isDemo || isPaidOrEnrolled) {
      if (action === 'webrtc') {
        setActiveWebRTCClass(item);
      } else {
        setWatchingVideo(item);
      }
    } else {
      setShowLockCtaModal(item);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-3.5 py-1 rounded-full text-xs font-semibold backdrop-blur-md mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>ইন্টারঅ্যাক্টিভ ডিজিটাল ক্লাসরুম ও ডেমো পোর্টাল</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              অনলাইন লাইভ ক্লাস ও ভিডিও লেকচার
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1.5 max-w-2xl leading-relaxed">
              সরাসরি শিক্ষকদের সাথে লাইভ ক্লাসে অংশ নিন, ফ্রি ডেমো প্রিভিউ দেখুন এবং রেকর্ডেড ক্লাস আর্কাইভ থেকে যেকোনো সময় রিভিশন দিন।
            </p>
          </div>

          {!isPaidOrEnrolled && (
            <button
              onClick={() => setShowAdmissionModal(true)}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-amber-500/30 flex items-center space-x-2 transition-all transform active:scale-95 self-start md:self-auto shrink-0"
            >
              <GraduationCap className="w-4 h-4" />
              <span>ভর্তি হয়ে সম্পূর্ণ সিলেবাস আনলক করুন</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div className="flex items-center justify-center">
        <div className="bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700 flex space-x-2 shadow-inner">
          <button
            onClick={() => setActiveTab('LIVE')}
            className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center space-x-2 ${
              activeTab === 'LIVE'
                ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-600/30'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Radio className="w-4 h-4" />
            <span>লাইভ ক্লাস চলছে ({liveClasses.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('UPCOMING')}
            className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center space-x-2 ${
              activeTab === 'UPCOMING'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-lg shadow-amber-500/30 font-black'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>আসন্ন শিডিউল ({upcomingClasses.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('RECORDED')}
            className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center space-x-2 ${
              activeTab === 'RECORDED'
                ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Film className="w-4 h-4" />
            <span>ভিডিও লাইব্রেরি ও ডেমো আর্কাইভ ({recordedClasses.length})</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar (Only shown for LIVE/UPCOMING) */}
      {activeTab !== 'RECORDED' && (
        <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <select
              value={selectedSubjectFilter}
              onChange={(e) => setSelectedSubjectFilter(e.target.value)}
              className="px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">সকল বিষয়</option>
              {Object.entries(subjectsMap).map(([id, name]) => (
                <option key={id} value={id}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="খুঁজুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-medium text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
        </div>
      )}

      {/* When RECORDED tab is active, show the Dedicated Recorded Class & Video Library */}
      {activeTab === 'RECORDED' ? (
        <RecordedClassLibrary
          studentId={studentId}
          role={role}
        />
      ) : loading ? (
        <div className="p-12 text-center text-slate-400 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm font-medium">{t('processing')}</p>
        </div>
      ) : displayedList.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-500 space-y-3">
          <Video className="w-12 h-12 text-slate-300 mx-auto" />
          <p className="font-bold text-slate-700 dark:text-slate-300 text-base">
            {activeTab === 'LIVE'
              ? (lang === 'bn' ? 'এই মুহূর্তে কোনো লাইভ ক্লাস চলমান নেই।' : 'No classes currently live.')
              : (lang === 'bn' ? 'আসন্ন কোনো ক্লাসের শিডিউল পাওয়া যায়নি।' : 'No upcoming classes scheduled.')}
          </p>
          <p className="text-xs text-slate-400">
            {lang === 'bn'
              ? 'পরবর্তী ক্লাসের জন্য রুটিন চেক করুন বা নোটিফিকেশনে নজর রাখুন।'
              : 'Please check your schedule or wait for instructor notification.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayedList.map((item) => {
            const isLive = item.status === 'LIVE';
            const isUpcoming = item.status === 'UPCOMING';
            const isDemo = Boolean(item.isDemo);
            const isLocked = !isDemo && !isPaidOrEnrolled;
            const startTime = new Date(item.scheduledStartTime);
            const now = new Date();
            const diffMinutes = Math.max(0, Math.round((startTime.getTime() - now.getTime()) / 60000));

            return (
              <div
                key={item.id}
                className={`bg-white dark:bg-slate-900 rounded-2xl border transition-all duration-200 shadow-sm hover:shadow-lg flex flex-col justify-between overflow-hidden ${
                  isLive
                    ? 'border-red-400 ring-2 ring-red-500/20'
                    : isUpcoming
                    ? 'border-amber-200 dark:border-amber-900/40'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                {/* Status Bar */}
                <div
                  className={`px-5 py-3 flex items-center justify-between text-xs font-bold ${
                    isLive
                      ? 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border-b border-red-100 dark:border-red-900/40'
                      : 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-b border-amber-100 dark:border-amber-900/40'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    {isLive && <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />}
                    <span>
                      {isLive
                        ? t('liveNow')
                        : (lang === 'bn' ? `আর ${diffMinutes} মিনিট পর শুরু` : `Starts in ${diffMinutes}m`)}
                    </span>
                  </div>

                  <span className="text-[11px] px-2.5 py-0.5 rounded-md bg-white dark:bg-slate-800 border dark:border-slate-700 font-bold">
                    {item.platform === 'GOOGLE_MEET' && 'Google Meet'}
                    {item.platform === 'ZOOM' && 'Zoom Meeting'}
                    {item.platform === 'YOUTUBE_LIVE' && 'YouTube Live'}
                    {item.platform === 'IN_BUILT' && 'In-Built'}
                    {item.platform === 'OTHER' && 'Live Video'}
                  </span>
                </div>

                {/* Card Body */}
                <div className="p-5 space-y-3.5 flex-1">
                  {/* Category Pill */}
                  <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                    <span className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold text-xs">
                      {item.subject?.nameBn || item.subject?.nameEn || 'বিষয়'}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-[11px]">
                      {item.class?.nameBn || item.class?.nameEn}
                    </span>
                    {isDemo ? (
                      <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold text-[11px] flex items-center space-x-1">
                        <Sparkles className="w-3 h-3 text-emerald-600" />
                        <span>ফ্রি ডেমো</span>
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-bold text-[11px] flex items-center space-x-1">
                        <Lock className="w-3 h-3 text-amber-600" />
                        <span>প্রিমিয়াম</span>
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-slate-800 dark:text-white text-base leading-snug">
                    {item.title}
                  </h3>

                  {item.description && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  )}

                  {/* Schedule Details */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="font-medium">
                        {new Date(item.scheduledStartTime).toLocaleString(lang === 'bn' ? 'bn-BD' : 'en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{item.durationMinutes} {lang === 'bn' ? 'মিনিট' : 'Minutes'}</span>
                      {item.teacher?.user?.name && (
                        <span className="text-slate-400">• শিক্ষক: {item.teacher.user.name}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-800 space-y-2">
                  {isLocked ? (
                    <button
                      onClick={() => handleAccessClass(item, 'cta')}
                      className="w-full py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-1.5 shadow-md transition-all active:scale-95"
                    >
                      <Lock className="w-4 h-4" />
                      <span>ক্লাসটি আনলক করুন (ভর্তি আবশ্যক)</span>
                    </button>
                  ) : isLive ? (
                    <div className="space-y-2">
                      <button
                        onClick={() => handleAccessClass(item, 'webrtc')}
                        className="w-full inline-flex items-center justify-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-extrabold rounded-xl shadow-lg shadow-red-600/30 text-xs transition-transform active:scale-95 animate-pulse-slow"
                      >
                        <Video className="w-4 h-4" />
                        <span>লাইভ ক্লাসে প্রবেশ করুন (WebRTC)</span>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <button
                        onClick={() => handleAccessClass(item, 'video')}
                        className="w-full inline-flex items-center justify-center space-x-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-md text-xs transition-transform active:scale-95"
                      >
                        <Play className="w-4 h-4 fill-white" />
                        <span>{isDemo ? 'ফ্রি ডেমো ক্লাসরুম' : 'ক্লাসরুম প্রিভিউ'}</span>
                      </button>
                    </div>
                  )}

                  {/* Notes Attachment */}
                  {(item.noteFileUrl || item.notesUrl) && !isLocked && (
                    <button
                      onClick={() => {
                        const url = item.noteFileUrl || item.notesUrl;
                        if (url.startsWith('data:')) {
                          const link = document.createElement('a');
                          link.href = url;
                          link.download = item.noteFileName || `${item.title || 'Live_Class_Note'}.pdf`;
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                        } else {
                          window.open(url, '_blank');
                        }
                      }}
                      className="w-full inline-flex items-center justify-center space-x-2 px-3 py-2 bg-white dark:bg-slate-800 hover:bg-slate-100 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold transition-colors"
                    >
                      <Download className="w-3.5 h-3.5 text-amber-600" />
                      <span>{lang === 'bn' ? 'হ্যান্ডনোট / শিট ডাউনলোড' : 'Download Lecture Notes (PDF)'}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* BUILT-IN INTERACTIVE VIDEO PLAYER & LIVE CHAT MODAL */}
      {watchingVideo && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-2 sm:p-4 md:p-6">
          <div className="bg-slate-900 text-white rounded-3xl max-w-6xl w-full h-[92vh] overflow-hidden shadow-2xl border border-slate-800 animate-in fade-in zoom-in-95 duration-200 flex flex-col">
            <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90 backdrop-blur-md shrink-0">
              <div className="flex items-center space-x-3 overflow-hidden">
                <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 shrink-0">
                  <Film className="w-5 h-5" />
                </div>
                <div className="overflow-hidden">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-bold text-base sm:text-lg text-white truncate">
                      {watchingVideo.title}
                    </h3>
                    <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 text-[10px] font-bold border border-indigo-500/30">
                      {watchingVideo.subject?.nameBn || 'বিষয়'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 truncate mt-0.5">
                    {watchingVideo.teacher?.user?.name ? `শিক্ষক: ${watchingVideo.teacher.user.name}` : ''}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setWatchingVideo(null)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 overflow-hidden">
              <div className="lg:col-span-2 flex flex-col overflow-y-auto bg-black p-3 sm:p-5 space-y-4">
                {lastWarning && (
                  <div className="p-3.5 rounded-2xl bg-rose-950/60 border border-rose-600 text-rose-200 text-xs font-bold flex items-center justify-between animate-pulse">
                    <div className="flex items-center space-x-2">
                      <ShieldAlert className="w-4 h-4 text-rose-400 flex-shrink-0" />
                      <span>{lastWarning}</span>
                    </div>
                    <button onClick={clearWarning} className="text-rose-400 hover:text-rose-200 p-1">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
                <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl">
                  {watchingVideo.recordingUrl || watchingVideo.meetingLink ? (
                    <iframe
                      src={getEmbedUrl(watchingVideo.recordingUrl || watchingVideo.meetingLink)}
                      title={watchingVideo.title}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-2 p-6 text-center">
                      <Film className="w-12 h-12 text-slate-700" />
                      <p className="text-sm font-semibold">ভিডিও লিঙ্ক উপলব্ধ নেই</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-slate-900 border-t lg:border-t-0 lg:border-l border-slate-800 flex flex-col h-full overflow-hidden">
                <LiveClassChatPanel liveClassId={watchingVideo.id} isLive={false} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* WEBRTC LIVE CLASSROOM MODAL */}
      {activeWebRTCClass && (
        <WebRTCLiveClassroom
          liveClass={activeWebRTCClass}
          role={role}
          userName={user?.name || 'শিক্ষার্থী'}
          onClose={() => setActiveWebRTCClass(null)}
        />
      )}

      {/* FREEMIUM LOCKED CTA MODAL */}
      {showLockCtaModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-slate-900 text-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-amber-500/40 space-y-6 relative overflow-hidden">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300">
                  <Lock className="w-5 h-5" />
                </div>
                <h3 className="font-black text-base text-white">প্রিমিয়াম ক্লাস আনলক করুন</h3>
              </div>
              <button onClick={() => setShowLockCtaModal(null)} className="p-1 rounded-lg text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <span className="px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 font-bold text-xs inline-block">
                {showLockCtaModal.subject?.nameBn || showLockCtaModal.subjectName || 'বিষয়'}
              </span>
              <h4 className="font-black text-lg text-white leading-snug">
                "{showLockCtaModal.title}"
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                এই ক্লাসটি নেক্সটজেন একাডেমির নিয়মিত ভর্তি হওয়া শিক্ষার্থীদের জন্য সংরক্ষিত। সম্পূর্ণ সিলেবাস, লাইভ ইন্টারঅ্যাকশন ও লেকচার শিট পেতে অনলাইনে ভর্তি সম্পন্ন করুন।
              </p>
            </div>

            <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/80 space-y-2 text-xs">
              <div className="flex items-center space-x-2 text-emerald-400 font-semibold">
                <Check className="w-4 h-4 shrink-0" />
                <span>সকল বিষয়ের পূর্ণাঙ্গ লাইভ ও রেকর্ডেড ক্লাস অ্যাক্সেস</span>
              </div>
              <div className="flex items-center space-x-2 text-emerald-400 font-semibold">
                <Check className="w-4 h-4 shrink-0" />
                <span>শিক্ষকদের সরাসরি প্রশ্নোত্তর ও ডাউট সলভিং</span>
              </div>
              <div className="flex items-center space-x-2 text-emerald-400 font-semibold">
                <Check className="w-4 h-4 shrink-0" />
                <span>মডেল টেস্ট ও ডিজিটাল হ্যান্ডনোটস</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowLockCtaModal(null);
                  setShowAdmissionModal(true);
                }}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs sm:text-sm shadow-xl shadow-emerald-600/30 flex items-center justify-center space-x-2 transition-all transform active:scale-95"
              >
                <GraduationCap className="w-4 h-4" />
                <span>অনলাইনে ভর্তি ও ফি পরিশোধ করুন</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ONLINE ADMISSION MODAL */}
      {showAdmissionModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md overflow-y-auto">
          <OnlineAdmissionForm onClose={() => setShowAdmissionModal(false)} />
        </div>
      )}
    </div>
  );
}
