import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { liveClassAPI, curriculumAPI } from '../../services/api';
import LiveClassChatPanel from '../liveclass/LiveClassChatPanel';
import OnlineAdmissionForm from '../public/OnlineAdmissionForm';
import {
  Film,
  Play,
  Search,
  Filter,
  Plus,
  Edit2,
  Trash2,
  BookOpen,
  Calendar,
  Clock,
  ExternalLink,
  Download,
  FileText,
  User,
  CheckCircle2,
  AlertCircle,
  X,
  Sparkles,
  Video,
  Layers,
  HelpCircle,
  Eye,
  MessageSquare,
  Radio,
  Share2,
  FolderOpen,
  Lock,
  Unlock,
  GraduationCap,
  ArrowRight,
  ShieldCheck,
  Check,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';

/**
 * Universal Video Embed Link Parser
 * Converts YouTube (standard, unlisted, youtu.be, shorts), Vimeo, Google Drive, and MP4 links
 */
export function getUniversalVideoEmbedUrl(url) {
  if (!url) return '';
  const trimmed = url.trim();

  try {
    // 1. YouTube standard watch
    if (trimmed.includes('youtube.com/watch')) {
      const urlObj = new URL(trimmed);
      const v = urlObj.searchParams.get('v');
      return v ? `https://www.youtube.com/embed/${v}?autoplay=1&rel=0` : trimmed;
    }
    // 2. YouTube short link (youtu.be)
    if (trimmed.includes('youtu.be/')) {
      const id = trimmed.split('youtu.be/')[1]?.split('?')[0]?.split('&')[0];
      return id ? `https://www.youtube.com/embed/${id}?autoplay=1&rel=0` : trimmed;
    }
    // 3. YouTube Shorts
    if (trimmed.includes('youtube.com/shorts/')) {
      const id = trimmed.split('youtube.com/shorts/')[1]?.split('?')[0]?.split('&')[0];
      return id ? `https://www.youtube.com/embed/${id}?autoplay=1&rel=0` : trimmed;
    }
    // 4. YouTube Embed already
    if (trimmed.includes('youtube.com/embed/')) {
      return trimmed;
    }
    // 5. Vimeo link
    if (trimmed.includes('vimeo.com/')) {
      const parts = trimmed.split('vimeo.com/')[1]?.split('?')[0]?.split('/');
      const id = parts?.[0] || '';
      return id ? `https://player.vimeo.com/video/${id}?autoplay=1` : trimmed;
    }
    // 6. Google Drive Link
    if (trimmed.includes('drive.google.com/file/d/')) {
      const parts = trimmed.split('drive.google.com/file/d/')[1]?.split('/');
      const fileId = parts?.[0];
      return fileId ? `https://drive.google.com/file/d/${fileId}/preview` : trimmed;
    }

    return trimmed;
  } catch (e) {
    return trimmed;
  }
}

/**
 * Provider detector helper for badge display
 */
function getVideoProviderInfo(url) {
  if (!url) return { name: 'ভিডিও লেকচার', color: 'bg-slate-800 text-slate-200' };
  if (url.includes('youtube') || url.includes('youtu.be')) {
    return { name: 'YouTube Unlisted', color: 'bg-red-600/20 text-red-400 border border-red-500/30' };
  }
  if (url.includes('vimeo')) {
    return { name: 'Vimeo Video', color: 'bg-sky-600/20 text-sky-400 border border-sky-500/30' };
  }
  if (url.includes('drive.google')) {
    return { name: 'Google Drive Stream', color: 'bg-amber-600/20 text-amber-400 border border-amber-500/30' };
  }
  return { name: 'Direct MP4 Stream', color: 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30' };
}

export default function RecordedClassLibrary({ studentId = null, role = 'STUDENT', classIdFilter = null }) {
  const { lang, t } = useLanguage();
  const { user } = useAuth();
  const isPrivileged = role === 'ADMIN' || role === 'TEACHER' || user?.role === 'ADMIN' || user?.role === 'TEACHER';

  // Check if current user is an enrolled/paid student or staff
  const isPaidOrEnrolled = isPrivileged || (user && user.role === 'STUDENT' && user.paymentStatus !== 'UNPAID' && user.isEnrolled !== false);

  const [recordedClasses, setRecordedClasses] = useState([]);
  const [classesList, setClassesList] = useState([]);
  const [subjectsList, setSubjectsList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Tab Filtering: 'ALL' | 'DEMO' | 'PREMIUM'
  const [accessFilter, setAccessFilter] = useState('ALL');

  // Filters
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedChapter, setSelectedChapter] = useState('');
  const [selectedClass, setSelectedClass] = useState(classIdFilter ? String(classIdFilter) : '');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [watchingClass, setWatchingClass] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [showLockCtaModal, setShowLockCtaModal] = useState(null); // class object that triggered locked click
  const [showAdmissionModal, setShowAdmissionModal] = useState(false); // opens online admission directly

  // Form State for Add / Edit Modal
  const [formData, setFormData] = useState({
    title: '',
    topic: '',
    chapter: '',
    classId: classIdFilter ? String(classIdFilter) : '1',
    subjectId: '1',
    date: new Date().toISOString().split('T')[0],
    videoUrl: '',
    durationMinutes: '45',
    recordingDuration: '৪৫ মিনিট',
    notesUrl: '',
    notesDescription: '',
    description: '',
    teacherName: '',
    isDemo: false
  });

  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    fetchInitialData();
  }, [selectedClass]);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedClass) params.classId = selectedClass;

      const [recordedRes, classesRes, subjectsRes] = await Promise.all([
        liveClassAPI.getRecordedClasses(params),
        curriculumAPI.getClasses(),
        curriculumAPI.getSubjects(selectedClass || '1')
      ]);

      if (recordedRes.success) {
        setRecordedClasses(recordedRes.data || []);
      }
      if (classesRes.success) {
        setClassesList(classesRes.data || []);
      }
      if (subjectsRes.success) {
        setSubjectsList(subjectsRes.data || []);
      }
    } catch (err) {
      console.error('Failed to load recorded classes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClassChangeInForm = async (e) => {
    const clsId = e.target.value;
    setFormData((prev) => ({ ...prev, classId: clsId }));
    try {
      const res = await curriculumAPI.getSubjects(clsId);
      if (res.success && res.data) {
        setSubjectsList(res.data);
        if (res.data.length > 0) {
          setFormData((prev) => ({ ...prev, subjectId: String(res.data[0].id) }));
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleDemo = async (item) => {
    try {
      const res = await liveClassAPI.toggleDemo(item.id);
      if (res.success) {
        fetchInitialData();
      }
    } catch (err) {
      alert('ডেমো স্ট্যাটাস পরিবর্তনে সমস্যা হয়েছে: ' + (err.message || 'Error'));
    }
  };

  // Extract unique subjects
  const availableSubjects = Array.from(
    new Set(
      recordedClasses
        .map((c) => c.subject?.nameBn || c.subject?.nameEn || c.subjectName)
        .filter(Boolean)
    )
  );

  // Filtered List based on search, subject, class, and accessFilter (Demo vs Premium)
  const filteredList = recordedClasses.filter((c) => {
    const subName = c.subject?.nameBn || c.subject?.nameEn || c.subjectName || '';
    const matchSub = !selectedSubject || subName === selectedSubject;
    const matchClass = !selectedClass || String(c.classId) === String(selectedClass);

    const isDemo = Boolean(c.isDemo);
    const matchAccess =
      accessFilter === 'ALL' ||
      (accessFilter === 'DEMO' && isDemo) ||
      (accessFilter === 'PREMIUM' && !isDemo);

    const q = searchQuery.toLowerCase().trim();
    const matchSearch =
      !q ||
      c.title?.toLowerCase().includes(q) ||
      c.recordingTitle?.toLowerCase().includes(q) ||
      c.description?.toLowerCase().includes(q) ||
      subName.toLowerCase().includes(q) ||
      c.teacher?.user?.name?.toLowerCase().includes(q);

    return matchSub && matchClass && matchAccess && matchSearch;
  });

  // Handle Play Click (Direct Play if Demo or Enrolled; Open CTA if Locked)
  const handlePlayClick = (item) => {
    const isDemo = Boolean(item.isDemo);
    if (isDemo || isPaidOrEnrolled) {
      setWatchingClass(item);
    } else {
      setShowLockCtaModal(item);
    }
  };

  // Handle Submit (Create or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.classId || !formData.subjectId || !formData.videoUrl) {
      setFormError('শিরোনাম, শ্রেণি, বিষয় এবং ভিডিও ইউআরএল আবশ্যক।');
      return;
    }

    setSubmitting(true);
    setFormError(null);

    try {
      const payload = {
        title: formData.title,
        topic: formData.topic || formData.chapter || '',
        chapter: formData.chapter || formData.topic || '',
        classId: Number(formData.classId),
        subjectId: Number(formData.subjectId),
        videoUrl: formData.videoUrl.trim(),
        recordingUrl: formData.videoUrl.trim(),
        isDemo: Boolean(formData.isDemo),
        date: formData.date,
        scheduledStartTime: `${formData.date}T10:00:00.000Z`,
        durationMinutes: Number(formData.durationMinutes) || 45,
        recordingDuration: `${formData.durationMinutes || 45} মিনিট`,
        notesUrl: formData.notesUrl.trim(),
        description: formData.description.trim()
      };

      if (editingClass) {
        await liveClassAPI.updateLiveClass(editingClass.id, payload);
      } else {
        await liveClassAPI.addRecordedClass(payload);
      }

      setShowAddModal(false);
      setEditingClass(null);
      setFormData({
        title: '',
        topic: '',
        chapter: '',
        classId: selectedClass || '1',
        subjectId: '1',
        date: new Date().toISOString().split('T')[0],
        videoUrl: '',
        durationMinutes: '45',
        recordingDuration: '৪৫ মিনিট',
        notesUrl: '',
        notesDescription: '',
        description: '',
        teacherName: user?.name || '',
        isDemo: false
      });

      fetchInitialData();
    } catch (err) {
      setFormError(err.message || 'ভিডিও লেকচার সংরক্ষণ ব্যর্থ হয়েছে');
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Action
  const handleDelete = async (id, title) => {
    if (!window.confirm(`আপনি কি নিশ্চিতভাবে "${title}" ভিডিও লেকচারটি মুছে ফেলতে চান?`)) return;
    try {
      await liveClassAPI.deleteLiveClass(id);
      fetchInitialData();
    } catch (err) {
      alert(err.message || 'মুছে ফেলতে ব্যর্থ হয়েছে');
    }
  };

  // Open Edit Modal
  const handleOpenEdit = (item) => {
    setEditingClass(item);
    setFormData({
      title: item.recordingTitle || item.title || '',
      topic: item.chapter || item.topic || item.description?.replace('অধ্যায়/বিষয়বস্তু: ', '') || '',
      chapter: item.chapter || item.topic || '',
      classId: String(item.classId || '1'),
      subjectId: String(item.subjectId || '1'),
      date: item.scheduledStartTime?.split('T')[0] || new Date().toISOString().split('T')[0],
      videoUrl: item.recordingUrl || item.meetingLink || '',
      durationMinutes: String(item.durationMinutes || '45'),
      recordingDuration: item.recordingDuration || '৪৫ মিনিট',
      notesUrl: item.notesUrl || '',
      notesDescription: item.notesDescription || '',
      description: item.description || '',
      teacherName: item.teacher?.user?.name || user?.name || '',
      isDemo: Boolean(item.isDemo)
    });
    setShowAddModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-3.5 py-1 rounded-full text-xs font-semibold backdrop-blur-md mb-3">
              <Film className="w-3.5 h-3.5 text-amber-400" />
              <span>ডিজিটাল ভিডিও লাইব্রেরি ও ফ্রিমিয়াম ক্লাস পোর্টাল</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              অনলাইন ক্লাস, ডেমো ও ভিডিও লেকচার আর্কাইভ
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1.5 max-w-2xl leading-relaxed">
              বিনামূল্যে ডেমো ক্লাস দেখে মান যাচাই করুন এবং সম্পূর্ণ সিলেবাস আনলক করতে অনলাইন ভর্তি সম্পন্ন করুন।
            </p>
          </div>

          <div className="flex items-center space-x-2 self-start md:self-auto shrink-0">
            {!isPaidOrEnrolled && (
              <button
                onClick={() => setShowAdmissionModal(true)}
                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-amber-500/30 flex items-center space-x-2 transition-all transform active:scale-95"
              >
                <GraduationCap className="w-4 h-4" />
                <span>ভর্তি হয়ে সব ক্লাস আনলক করুন</span>
              </button>
            )}

            {isPrivileged && (
              <button
                onClick={() => {
                  setEditingClass(null);
                  setFormData({
                    title: '',
                    topic: '',
                    chapter: '',
                    classId: selectedClass || '1',
                    subjectId: '1',
                    date: new Date().toISOString().split('T')[0],
                    videoUrl: '',
                    durationMinutes: '45',
                    recordingDuration: '৪৫ মিনিট',
                    notesUrl: '',
                    notesDescription: '',
                    description: '',
                    teacherName: user?.name || '',
                    isDemo: false
                  });
                  setShowAddModal(true);
                }}
                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs sm:text-sm shadow-xl shadow-emerald-600/30 flex items-center space-x-2 transition-all transform active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>+ নতুন ভিডিও যোগ করুন</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Access Category Switcher (Free Demo vs Premium vs All) */}
      <div className="flex items-center justify-center">
        <div className="bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700 flex space-x-2 shadow-inner">
          <button
            onClick={() => setAccessFilter('ALL')}
            className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center space-x-2 ${
              accessFilter === 'ALL'
                ? 'bg-slate-900 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>সকল ক্লাস ({recordedClasses.length})</span>
          </button>

          <button
            onClick={() => setAccessFilter('DEMO')}
            className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center space-x-2 ${
              accessFilter === 'DEMO'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-600/30'
                : 'text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            <span>🟢 ফ্রি ডেমো ক্লাস (Free Preview)</span>
          </button>

          <button
            onClick={() => setAccessFilter('PREMIUM')}
            className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center space-x-2 ${
              accessFilter === 'PREMIUM'
                ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-indigo-700 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40'
            }`}
          >
            <Lock className="w-4 h-4 text-amber-300" />
            <span>🔒 সম্পূর্ণ কোর্স ও প্রিমিয়াম ক্লাস</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Class Filter */}
          {classesList.length > 0 && (
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">সকল শ্রেণি (All Classes)</option>
              {classesList.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.nameBn || cls.name}
                </option>
              ))}
            </select>
          )}

          {/* Subject Filter Dropdown */}
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">সকল বিষয়</option>
            {availableSubjects.map((sub) => (
              <option key={sub} value={sub}>
                {sub}
              </option>
            ))}
          </select>
        </div>

        {/* Live Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="অধ্যায়, বিষয় বা শিক্ষকের নাম দিয়ে খুঁজুন..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-medium text-slate-800 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Video Lecture Grid */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm font-medium">ক্লাস লোড হচ্ছে...</p>
        </div>
      ) : filteredList.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-slate-500 space-y-3">
          <FolderOpen className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-700 dark:text-slate-300 text-base">কোনো ক্লাস বা ভিডিও লেকচার পাওয়া যায়নি</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            নির্বাচিত ফিল্টারে বর্তমানে কোনো ক্লাস নেই।
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredList.map((item) => {
            const isDemo = Boolean(item.isDemo);
            const isLocked = !isDemo && !isPaidOrEnrolled;
            const provider = getVideoProviderInfo(item.recordingUrl || item.meetingLink);

            return (
              <div
                key={item.id}
                className={`bg-white dark:bg-slate-900 rounded-3xl border ${
                  isDemo
                    ? 'border-emerald-500/30 shadow-emerald-500/5 hover:border-emerald-500'
                    : isLocked
                    ? 'border-amber-500/30'
                    : 'border-slate-200 dark:border-slate-800 hover:border-indigo-500/50'
                } shadow-sm hover:shadow-xl transition-all duration-200 flex flex-col justify-between overflow-hidden group`}
              >
                {/* Video Thumbnail Header with Lock / Play Trigger */}
                <div className="relative aspect-video bg-slate-950 flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent z-10" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 z-20 flex items-center space-x-1.5">
                    {isDemo ? (
                      <span className="px-2.5 py-1 rounded-xl text-[10px] font-black uppercase backdrop-blur-md bg-emerald-600/90 text-white shadow-lg flex items-center space-x-1">
                        <Sparkles className="w-3 h-3 text-emerald-200" />
                        <span>বিনামূল্যে ডেমো ক্লাস (Free Preview)</span>
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-xl text-[10px] font-black uppercase backdrop-blur-md bg-amber-600/90 text-white shadow-lg flex items-center space-x-1">
                        <Lock className="w-3 h-3 text-amber-200" />
                        <span>প্রিমিয়াম ক্লাস - ভর্তি আবশ্যক</span>
                      </span>
                    )}
                  </div>

                  {/* Duration Badge */}
                  <div className="absolute bottom-3 right-3 z-20 flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-900/90 backdrop-blur-md text-[11px] font-mono text-white border border-white/10">
                    <Clock className="w-3 h-3 text-amber-400" />
                    <span>{item.recordingDuration || `${item.durationMinutes || 45} মিনিট`}</span>
                  </div>

                  {/* Locked Overlay for Non-Enrolled Users */}
                  {isLocked ? (
                    <div
                      onClick={() => handlePlayClick(item)}
                      className="absolute inset-0 z-20 bg-slate-950/70 backdrop-blur-sm flex flex-col items-center justify-center space-y-2 cursor-pointer p-4 text-center group-hover:bg-slate-950/60 transition-all"
                    >
                      <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-300 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                        <Lock className="w-7 h-7" />
                      </div>
                      <span className="text-xs font-black text-amber-300">লকড প্রিমিয়াম ক্লাস</span>
                      <span className="text-[10px] text-slate-300">আনলক করতে ক্লিক করুন</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handlePlayClick(item)}
                      className="relative z-20 w-14 h-14 rounded-2xl bg-emerald-600/90 hover:bg-emerald-500 text-white flex items-center justify-center shadow-2xl transition-transform group-hover:scale-110 active:scale-95"
                    >
                      <Play className="w-6 h-6 fill-white ml-0.5" />
                    </button>
                  )}
                </div>

                {/* Card Info Body */}
                <div className="p-5 space-y-3.5 flex-1 text-slate-800 dark:text-slate-200">
                  <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                    <span className="px-2.5 py-0.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold text-xs">
                      {item.subject?.nameBn || item.subject?.nameEn || item.subjectName || 'বিষয়'}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-[11px]">
                      {item.class?.nameBn || item.class?.nameEn || item.classGrade}
                    </span>
                    {item.chapter && (
                      <span className="px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 font-semibold text-[11px]">
                        অধ্যায়: {item.chapter}
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base leading-snug group-hover:text-indigo-600 transition-colors line-clamp-2">
                      {item.recordingTitle || item.title}
                    </h3>
                    {item.description && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    )}
                  </div>

                  {/* Metadata: Date & Teacher */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <div className="flex items-center space-x-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>
                        {new Date(item.scheduledStartTime).toLocaleDateString(lang === 'bn' ? 'bn-BD' : 'en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>

                    <div className="flex items-center space-x-1 font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[150px]">
                      <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{item.teacher?.user?.name || 'শিক্ষক'}</span>
                    </div>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  {isLocked ? (
                    <button
                      onClick={() => handlePlayClick(item)}
                      className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-xs flex items-center justify-center space-x-1.5 shadow-md shadow-amber-600/20 transition-all active:scale-95"
                    >
                      <Lock className="w-4 h-4" />
                      <span>ক্লাসটি আনলক করুন (ভর্তি হন)</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handlePlayClick(item)}
                      className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center space-x-1.5 shadow-md shadow-emerald-600/20 transition-all active:scale-95"
                    >
                      <Play className="w-4 h-4 fill-white" />
                      <span>{isDemo ? 'ফ্রি ডেমো দেখুন' : 'ভিডিও লেকচার দেখুন'}</span>
                    </button>
                  )}

                  {(item.noteFileUrl || item.notesUrl) && !isLocked && (
                    <button
                      onClick={() => {
                        const url = item.noteFileUrl || item.notesUrl;
                        if (url.startsWith('data:')) {
                          const link = document.createElement('a');
                          link.href = url;
                          link.download = item.noteFileName || `${item.recordingTitle || item.title || 'Class_Note'}.pdf`;
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                        } else {
                          window.open(url, '_blank');
                        }
                      }}
                      className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-700 transition-colors"
                      title="লেকচার হ্যান্ডনোট (PDF) ডাউনলোড / দেখুন"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  )}

                  {isPrivileged && (
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleToggleDemo(item)}
                        title={isDemo ? 'লকড করুন (Make Locked)' : 'ফ্রি ডেমো করুন (Make Demo)'}
                        className="p-2 rounded-xl text-slate-400 hover:text-emerald-600 transition-colors"
                      >
                        {isDemo ? <ToggleRight className="w-5 h-5 text-emerald-500" /> : <ToggleLeft className="w-5 h-5" />}
                      </button>
                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="p-2 rounded-xl text-slate-400 hover:text-indigo-600 transition-colors"
                        title="এডিট করুন"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id, item.title)}
                        className="p-2 rounded-xl text-slate-400 hover:text-rose-600 transition-colors"
                        title="মুছে ফেলুন"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. CLEAN EMBEDDED VIDEO PLAYER MODAL WITH DISCUSSION & NOTES */}
      {/* ========================================================================= */}
      {watchingClass && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200">
          <div className="bg-slate-900 text-white rounded-3xl max-w-6xl w-full h-[92vh] overflow-hidden shadow-2xl border border-slate-800 flex flex-col">
            {/* Player Top Bar */}
            <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90 backdrop-blur-md shrink-0">
              <div className="flex items-center space-x-3 overflow-hidden">
                <div className="p-2.5 rounded-2xl bg-indigo-600/20 text-indigo-400 shrink-0">
                  <Film className="w-5 h-5" />
                </div>
                <div className="overflow-hidden">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-bold text-base sm:text-lg text-white truncate">
                      {watchingClass.recordingTitle || watchingClass.title}
                    </h3>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                      watchingClass.isDemo
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                    }`}>
                      {watchingClass.isDemo ? 'ফ্রি ডেমো' : 'প্রিমিয়াম ক্লাস'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 truncate mt-0.5">
                    শ্রেণি: {watchingClass.class?.nameBn || watchingClass.classGrade} • শিক্ষক: {watchingClass.teacher?.user?.name || 'শিক্ষক'} •{' '}
                    {new Date(watchingClass.scheduledStartTime).toLocaleDateString('bn-BD')}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                {watchingClass.notesUrl && (
                  <a
                    href={watchingClass.notesUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center space-x-1.5 shadow-sm transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">লেকচার নোট (PDF)</span>
                  </a>
                )}

                <button
                  onClick={() => setWatchingClass(null)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Video Frame & Interactive Chat Sidebar */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 overflow-hidden">
              {/* Left 2 Cols: Video Player & Description */}
              <div className="lg:col-span-2 flex flex-col overflow-y-auto bg-black p-3 sm:p-5 space-y-4">
                <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl">
                  {watchingClass.recordingUrl || watchingClass.meetingLink ? (
                    <iframe
                      src={getUniversalVideoEmbedUrl(watchingClass.recordingUrl || watchingClass.meetingLink)}
                      title={watchingClass.title}
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

                {/* Video Info Section */}
                <div className="bg-slate-850 p-4 sm:p-5 rounded-2xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-extrabold text-sm sm:text-base text-white">
                      পাঠ্যক্রম ও অধ্যায় বিবরণী
                    </h4>
                    <span className="text-xs text-amber-400 font-mono">
                      সময়কাল: {watchingClass.recordingDuration || `${watchingClass.durationMinutes || 45} মিনিট`}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                    {watchingClass.description || 'এই ক্লাসের জন্য কোনো বিশেষ বিবরণ যোগ করা হয়নি।'}
                  </p>
                </div>
              </div>

              {/* Right 1 Col: Live Discussion & Notes Panel */}
              <div className="bg-slate-900 border-t lg:border-t-0 lg:border-l border-slate-800 flex flex-col h-full overflow-hidden">
                <LiveClassChatPanel liveClassId={watchingClass.id} isLive={false} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. FREEMIUM LOCKED CLASS CTA MODAL */}
      {/* ========================================================================= */}
      {showLockCtaModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-slate-900 text-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-amber-500/40 space-y-6 relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

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

            <div className="space-y-3 text-center sm:text-left">
              <span className="px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 font-bold text-xs inline-block">
                {showLockCtaModal.subject?.nameBn || showLockCtaModal.subjectName || 'বিষয়'} • {showLockCtaModal.classGrade || 'Class 9'}
              </span>
              <h4 className="font-black text-lg text-white leading-snug">
                "{showLockCtaModal.recordingTitle || showLockCtaModal.title}"
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
                <span>মডেল টেস্ট, রেজাল্ট রিপোর্ট ও ডিজিটাল হ্যান্ডনোটস</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
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

      {/* ========================================================================= */}
      {/* 3. ONLINE ADMISSION MODAL (DIRECT FROM CTA) */}
      {/* ========================================================================= */}
      {showAdmissionModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md overflow-y-auto">
          <OnlineAdmissionForm onClose={() => setShowAdmissionModal(false)} />
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. ADD / EDIT RECORDED VIDEO MODAL */}
      {/* ========================================================================= */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 animate-in fade-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-5">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-2xl bg-indigo-600/10 text-indigo-600">
                  <Film className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white">
                    {editingClass ? 'ভিডিও লেকচার সম্পাদনা করুন' : 'নতুন রেকর্ডেড ক্লাস ভিডিও যোগ করুন'}
                  </h3>
                  <p className="text-xs text-slate-500">YouTube, Vimeo বা Google Drive লিঙ্ক দিন</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingClass(null);
                }}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 mb-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center space-x-2">
                <AlertCircle className="w-4 h-4" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold mb-1">লেকচার শিরোনাম *</label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: পদার্থবিজ্ঞান - গতি ও বলের সমীকরণ"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">শ্রেণি *</label>
                  <select
                    value={formData.classId}
                    onChange={handleClassChangeInForm}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                  >
                    {classesList.map((cls) => (
                      <option key={cls.id} value={cls.id}>
                        {cls.nameBn || cls.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold mb-1">বিষয় *</label>
                  <select
                    value={formData.subjectId}
                    onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                  >
                    {subjectsList.map((sub) => (
                      <option key={sub.id} value={sub.id}>
                        {sub.nameBn || sub.nameEn}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">ভিডিও লিংক (YouTube / Vimeo / Google Drive) *</label>
                <input
                  type="url"
                  required
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={formData.videoUrl}
                  onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                />
              </div>

              {/* Freemium Demo Toggle Switch */}
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">ফ্রি ডেমো হিসেবে দেখান (Make Demo Class)</span>
                  <span className="text-[11px] text-slate-400">সক্রিয় করলে যেকোনো অতিথি বা সাধারণ শিক্ষার্থী ভিডিওটি দেখতে পারবে</span>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, isDemo: !formData.isDemo })}
                  className="flex items-center space-x-1.5 focus:outline-none"
                >
                  {formData.isDemo ? (
                    <ToggleRight className="w-8 h-8 text-emerald-500" />
                  ) : (
                    <ToggleLeft className="w-8 h-8 text-slate-400" />
                  )}
                </button>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md shadow-emerald-600/20"
                >
                  {submitting ? 'সংরক্ষণ হচ্ছে...' : 'সংরক্ষণ করুন'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
