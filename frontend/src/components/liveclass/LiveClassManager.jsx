import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { liveClassAPI, curriculumAPI } from '../../services/api';
import LiveClassChatPanel from './LiveClassChatPanel';
import WebRTCLiveClassroom from './WebRTCLiveClassroom';
import RecordedClassLibrary from '../common/RecordedClassLibrary';
import UniversalFileUploader from '../common/UniversalFileUploader';
import {
  Video,
  Radio,
  Clock,
  Calendar,
  PlusCircle,
  Play,
  CheckCircle,
  FileText,
  ExternalLink,
  Edit,
  Trash2,
  Search,
  Layers,
  Sparkles,
  X,
  AlertCircle,
  Save,
  Link as LinkIcon,
  Film,
  Key,
  Download,
  Eye,
  CheckCircle2,
  Users,
  MessageSquare,
  Lock,
  Unlock,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';

export default function LiveClassManager({ role = 'TEACHER' }) {
  const { t, lang } = useLanguage();
  const { user } = useAuth();

  const [managerSubTab, setManagerSubTab] = useState('live'); // 'live' | 'recorded'
  const [classesList, setClassesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL' | 'LIVE' | 'UPCOMING' | 'COMPLETED'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClassFilter, setSelectedClassFilter] = useState('');

  // WebRTC Live Classroom Modal State
  const [activeWebRTCClass, setActiveWebRTCClass] = useState(null);

  // Curriculum Data
  const [allClasses, setAllClasses] = useState([]);
  const [classSubjects, setClassSubjects] = useState([]);

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [showRecordingModal, setShowRecordingModal] = useState(null); // class object to add recording to
  const [activeChatClass, setActiveChatClass] = useState(null); // class object to monitor live chat & Q&A
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Form State for Create/Edit
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    classId: '',
    sectionId: '',
    subjectId: '',
    scheduledStartTime: '',
    durationMinutes: '45',
    platform: 'GOOGLE_MEET', // GOOGLE_MEET | ZOOM | YOUTUBE_LIVE | IN_BUILT | OTHER
    meetingLink: '',
    meetingPassword: '',
    notesUrl: '',
    notesDescription: '',
    isDemo: false,
    status: 'UPCOMING'
  });

  // Recording Form State
  const [recordingForm, setRecordingForm] = useState({
    recordingUrl: '',
    recordingTitle: '',
    recordingDuration: '',
    notesUrl: ''
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    fetchLiveClasses();
  }, [statusFilter, selectedClassFilter]);

  const fetchInitialData = async () => {
    try {
      const clsRes = await curriculumAPI.getClasses();
      if (clsRes.success) {
        setAllClasses(clsRes.data || []);
        if (clsRes.data?.length > 0) {
          const firstId = clsRes.data[0].id;
          loadSubjects(firstId);
        }
      }
    } catch (err) {
      console.error('Failed to load curriculum:', err);
    }
  };

  const loadSubjects = async (classId) => {
    if (!classId) return;
    try {
      const subRes = await curriculumAPI.getSubjects(classId);
      if (subRes.success) {
        setClassSubjects(subRes.data || []);
      }
    } catch (err) {
      console.error('Failed to load subjects:', err);
    }
  };

  const fetchLiveClasses = async () => {
    try {
      setLoading(true);
      const params = {};
      if (statusFilter !== 'ALL') params.status = statusFilter;
      if (selectedClassFilter) params.classId = selectedClassFilter;
      if (searchQuery) params.search = searchQuery;

      const res = await liveClassAPI.getLiveClasses(params);
      if (res.success) {
        setClassesList(res.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch live classes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    setEditingClass(null);
    setErrorMessage('');
    const now = new Date();
    now.setMinutes(now.getMinutes() + 10);
    const defaultTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);

    const defaultClassId = allClasses[0]?.id ? String(allClasses[0].id) : '11';
    loadSubjects(defaultClassId);

    setFormData({
      title: '',
      description: '',
      classId: defaultClassId,
      sectionId: '',
      subjectId: classSubjects[0]?.id ? String(classSubjects[0].id) : '',
      scheduledStartTime: defaultTime,
      durationMinutes: '45',
      platform: 'GOOGLE_MEET',
      meetingLink: 'https://meet.google.com/nga-',
      meetingPassword: '',
      notesUrl: '',
      noteFileUrl: '',
      noteFileName: '',
      noteFileSize: '',
      notesDescription: '',
      isDemo: false,
      status: 'UPCOMING'
    });
    setShowCreateModal(true);
  };

  const handleOpenEditModal = (item) => {
    setEditingClass(item);
    setErrorMessage('');
    loadSubjects(item.classId);

    const dt = item.scheduledStartTime ? new Date(item.scheduledStartTime) : new Date();
    const localIso = new Date(dt.getTime() - dt.getTimezoneOffset() * 60000).toISOString().slice(0, 16);

    setFormData({
      title: item.title || '',
      description: item.description || '',
      classId: String(item.classId || ''),
      sectionId: item.sectionId ? String(item.sectionId) : '',
      subjectId: String(item.subjectId || ''),
      scheduledStartTime: localIso,
      durationMinutes: String(item.durationMinutes || 45),
      platform: item.platform || 'GOOGLE_MEET',
      meetingLink: item.meetingLink || '',
      meetingPassword: item.meetingPassword || '',
      notesUrl: item.notesUrl || item.noteFileUrl || '',
      noteFileUrl: item.noteFileUrl || item.notesUrl || '',
      noteFileName: item.noteFileName || '',
      noteFileSize: item.noteFileSize || '',
      notesDescription: item.notesDescription || '',
      isDemo: Boolean(item.isDemo),
      status: item.status || 'UPCOMING'
    });
    setShowCreateModal(true);
  };

  const handleToggleDemo = async (item) => {
    try {
      await liveClassAPI.toggleDemo(item.id);
      fetchLiveClasses();
    } catch (err) {
      alert(err.message || 'Failed to toggle demo status');
    }
  };

  const handleClassChangeInForm = (e) => {
    const cid = e.target.value;
    setFormData(prev => ({ ...prev, classId: cid, subjectId: '' }));
    loadSubjects(cid);
  };

  const handleSaveClass = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.classId || !formData.subjectId || !formData.meetingLink.trim()) {
      setErrorMessage(lang === 'bn' ? 'অনুগ্রহ করে সকল আবশ্যক তথ্য পূরণ করুন।' : 'Please fill all required fields.');
      return;
    }

    try {
      setSubmitting(true);
      setErrorMessage('');

      const payload = {
        title: formData.title,
        description: formData.description,
        classId: Number(formData.classId),
        sectionId: formData.sectionId ? Number(formData.sectionId) : null,
        subjectId: Number(formData.subjectId),
        scheduledStartTime: new Date(formData.scheduledStartTime).toISOString(),
        durationMinutes: Number(formData.durationMinutes) || 45,
        platform: formData.platform,
        meetingLink: formData.meetingLink,
        meetingPassword: formData.meetingPassword,
        notesUrl: formData.noteFileUrl || formData.notesUrl || '',
        noteFileUrl: formData.noteFileUrl || formData.notesUrl || '',
        noteFileName: formData.noteFileName || '',
        noteFileSize: formData.noteFileSize || '',
        notesDescription: formData.notesDescription,
        isDemo: Boolean(formData.isDemo),
        status: formData.status
      };

      if (editingClass) {
        await liveClassAPI.updateLiveClass(editingClass.id, payload);
      } else {
        await liveClassAPI.createLiveClass(payload);
      }

      setShowCreateModal(false);
      fetchLiveClasses();
    } catch (err) {
      setErrorMessage(err.message || 'Failed to save class');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await liveClassAPI.updateStatus(id, newStatus);
      fetchLiveClasses();
    } catch (err) {
      alert(err.message || 'Status update failed');
    }
  };

  const handleDeleteClass = async (id) => {
    if (!window.confirm(lang === 'bn' ? 'আপনি কি নিশ্চিতভাবে এই লাইভ ক্লাসটি মুছে ফেলতে চান?' : 'Are you sure you want to delete this live class?')) {
      return;
    }
    try {
      await liveClassAPI.deleteLiveClass(id);
      fetchLiveClasses();
    } catch (err) {
      alert(err.message || 'Failed to delete class');
    }
  };

  const handleOpenRecordingModal = (item) => {
    setShowRecordingModal(item);
    setRecordingForm({
      recordingUrl: item.recordingUrl || '',
      recordingTitle: item.recordingTitle || `${item.title} (রেকর্ডেড ভিডিও)`,
      recordingDuration: item.recordingDuration || `${item.durationMinutes} মিনিট`,
      notesUrl: item.notesUrl || ''
    });
  };

  const handleSaveRecording = async (e) => {
    e.preventDefault();
    if (!recordingForm.recordingUrl.trim()) {
      alert(lang === 'bn' ? 'ভিডিও লিঙ্ক প্রদান করুন' : 'Recording URL is required');
      return;
    }
    try {
      setSubmitting(true);
      await liveClassAPI.updateRecording(showRecordingModal.id, recordingForm);
      setShowRecordingModal(null);
      fetchLiveClasses();
    } catch (err) {
      alert(err.message || 'Failed to attach recording');
    } finally {
      setSubmitting(false);
    }
  };

  // Helper stats
  const liveCount = classesList.filter(c => c.status === 'LIVE').length;
  const upcomingCount = classesList.filter(c => c.status === 'UPCOMING').length;
  const completedCount = classesList.filter(c => c.status === 'COMPLETED').length;

  const filteredList = classesList.filter(item => {
    if (statusFilter !== 'ALL' && item.status !== statusFilter) return false;
    if (selectedClassFilter && String(item.classId) !== String(selectedClassFilter)) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title?.toLowerCase().includes(q);
      const matchDesc = item.description?.toLowerCase().includes(q);
      const matchSub = item.subject?.nameBn?.toLowerCase().includes(q) || item.subject?.nameEn?.toLowerCase().includes(q);
      const matchTeacher = item.teacher?.user?.name?.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchSub && !matchTeacher) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3.5 py-1 rounded-full text-xs font-semibold backdrop-blur-md mb-3">
              <Radio className="w-3.5 h-3.5 animate-pulse text-red-400" />
              <span>{lang === 'bn' ? 'অনলাইন লাইভ অ্যাকাডেমিক প্ল্যাটফর্ম' : 'Online Live Academic Platform'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {lang === 'bn' ? 'লাইভ অনলাইন ক্লাস ও ভিডিও ক্লাসরুম ব্যবস্থাপনা' : 'Live Online Classes & Video Classroom Manager'}
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1.5 max-w-2xl">
              {lang === 'bn'
                ? 'রিয়েল-টাইম ইন্টারেক্টিভ ক্লাস শিডিউল করুন, লাইভ মিটিং শুরু করুন এবং ক্লাস শেষে ভিডিও লেকচার ও হ্যান্ডনোট যুক্ত করুন।'
                : 'Schedule interactive sessions, host live classes with Google Meet / Zoom, and publish video recordings with lecture notes.'}
            </p>
          </div>

          <button
            onClick={handleOpenCreateModal}
            className="inline-flex items-center justify-center space-x-2 px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold rounded-2xl shadow-lg shadow-emerald-500/30 transition-all transform active:scale-95 text-sm shrink-0"
          >
            <PlusCircle className="w-5 h-5" />
            <span>{t('createLiveClass')}</span>
          </button>
        </div>

        {/* Quick KPI Stat Counter */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mt-6 pt-6 border-t border-white/10">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/10">
            <p className="text-xs text-emerald-200 font-medium">{lang === 'bn' ? 'মোট ক্লাস' : 'Total Classes'}</p>
            <p className="text-2xl font-black text-white mt-1">{classesList.length}</p>
          </div>
          <div className="bg-red-500/20 backdrop-blur-md rounded-2xl p-3.5 border border-red-500/30">
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-red-400 animate-ping" />
              <p className="text-xs text-red-200 font-medium">{t('liveNow')}</p>
            </div>
            <p className="text-2xl font-black text-red-300 mt-1">{liveCount}</p>
          </div>
          <div className="bg-amber-500/20 backdrop-blur-md rounded-2xl p-3.5 border border-amber-500/30">
            <p className="text-xs text-amber-200 font-medium">{t('upcomingClasses')}</p>
            <p className="text-2xl font-black text-amber-300 mt-1">{upcomingCount}</p>
          </div>
          <div className="bg-blue-500/20 backdrop-blur-md rounded-2xl p-3.5 border border-blue-500/30">
            <p className="text-xs text-blue-200 font-medium">{t('recordedClasses')}</p>
            <p className="text-2xl font-black text-blue-300 mt-1">{completedCount}</p>
          </div>
        </div>
      </div>

      {/* Sub-Tab Navigation: Live Schedule vs Recorded Class Library */}
      <div className="flex items-center space-x-2 bg-slate-200/80 p-1.5 rounded-2xl w-fit border border-slate-300/60 shadow-inner">
        <button
          onClick={() => setManagerSubTab('live')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
            managerSubTab === 'live'
              ? 'bg-slate-900 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <Radio className="w-4 h-4 text-red-400" />
          <span>শিডিউল ও লাইভ ক্লাস ম্যানেজার</span>
        </button>
        <button
          onClick={() => setManagerSubTab('recorded')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
            managerSubTab === 'recorded'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <Film className="w-4 h-4 text-emerald-300" />
          <span>রেকর্ডেড ক্লাস ও ভিডিও লাইব্রেরি (Recorded Archive)</span>
        </button>
      </div>

      {managerSubTab === 'recorded' ? (
        <RecordedClassLibrary role={role} />
      ) : (
        <div className="space-y-6">
          {/* Control Bar: Filters & Search */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Status Tabs */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl w-full md:w-auto overflow-x-auto">
          {[
            { id: 'ALL', label: lang === 'bn' ? 'সকল ক্লাস' : 'All Classes' },
            { id: 'LIVE', label: t('liveNow'), badge: liveCount, badgeColor: 'bg-red-500 text-white' },
            { id: 'UPCOMING', label: t('upcomingClasses'), badge: upcomingCount, badgeColor: 'bg-amber-500 text-white' },
            { id: 'COMPLETED', label: t('recordedClasses'), badge: completedCount, badgeColor: 'bg-blue-500 text-white' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                statusFilter === tab.id
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <span>{tab.label}</span>
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-black ${tab.badgeColor}`}>
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Class Filter & Search */}
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <select
            value={selectedClassFilter}
            onChange={(e) => setSelectedClassFilter(e.target.value)}
            className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          >
            <option value="">{lang === 'bn' ? 'সকল শ্রেণি' : 'All Classes'}</option>
            {allClasses.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.nameBn || cls.nameEn}
              </option>
            ))}
          </select>

          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={t('searchLiveClasses')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Class Cards Grid */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm font-medium">{t('processing')}</p>
        </div>
      ) : filteredList.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 space-y-3">
          <Video className="w-12 h-12 text-slate-300 mx-auto" />
          <p className="font-bold text-slate-700 text-base">{t('noLiveClassesFound')}</p>
          <p className="text-xs text-slate-400">
            {lang === 'bn'
              ? 'নতুন লাইভ ক্লাস শিডিউল করতে উপরের "+ নতুন লাইভ ক্লাস তৈরি করুন" বাটনে ক্লিক করুন।'
              : 'Click "+ Schedule Live Class" to create your first online lecture.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredList.map((item) => {
            const isLive = item.status === 'LIVE';
            const isUpcoming = item.status === 'UPCOMING';
            const isCompleted = item.status === 'COMPLETED';

            return (
              <div
                key={item.id}
                className={`bg-white rounded-2xl border transition-all duration-200 shadow-sm hover:shadow-md flex flex-col justify-between overflow-hidden ${
                  isLive
                    ? 'border-red-400 ring-2 ring-red-500/20'
                    : isUpcoming
                    ? 'border-amber-200 hover:border-amber-400'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Card Header Status Bar */}
                <div
                  className={`px-5 py-3 flex items-center justify-between text-xs font-bold ${
                    isLive
                      ? 'bg-red-50 text-red-700 border-b border-red-100'
                      : isUpcoming
                      ? 'bg-amber-50 text-amber-800 border-b border-amber-100'
                      : 'bg-slate-50 text-slate-700 border-b border-slate-100'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    {isLive && <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />}
                    <span>
                      {isLive
                        ? t('liveNow')
                        : isUpcoming
                        ? t('upcomingClasses')
                        : t('recordedClasses')}
                    </span>
                  </div>

                  <span className="text-[11px] px-2.5 py-0.5 rounded-md bg-white border font-bold">
                    {item.platform === 'GOOGLE_MEET' && 'Google Meet'}
                    {item.platform === 'ZOOM' && 'Zoom Meeting'}
                    {item.platform === 'YOUTUBE_LIVE' && 'YouTube Live'}
                    {item.platform === 'IN_BUILT' && 'In-Built'}
                    {item.platform === 'OTHER' && 'Direct Link'}
                  </span>
                </div>

                {/* Card Body */}
                <div className="p-5 space-y-3.5 flex-1">
                  {/* Category Pill */}
                  <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-bold text-xs">
                      {item.subject?.nameBn || item.subject?.nameEn || 'বিষয়'}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold text-[11px]">
                      {item.class?.nameBn || item.class?.nameEn}
                    </span>
                    {item.section && (
                      <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-semibold text-[11px]">
                        {item.section.nameBn || item.section.nameEn}
                      </span>
                    )}
                    {item.isDemo ? (
                      <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-black text-[11px] flex items-center space-x-1">
                        <Sparkles className="w-3 h-3 text-emerald-600" />
                        <span>ফ্রি ডেমো</span>
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 font-black text-[11px] flex items-center space-x-1">
                        <Lock className="w-3 h-3 text-amber-600" />
                        <span>প্রিমিয়াম</span>
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-slate-800 text-base leading-snug line-clamp-2">
                    {item.title}
                  </h3>

                  {item.description && (
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  )}

                  {/* Date & Schedule */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs text-slate-600">
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
                        <span className="text-slate-400">• {item.teacher.user.name}</span>
                      )}
                    </div>

                    {item.meetingPassword && (
                      <div className="flex items-center space-x-2 text-[11px] text-slate-500">
                        <Key className="w-3 h-3 text-amber-500 shrink-0" />
                        <span>Passcode: <code className="font-mono font-bold">{item.meetingPassword}</code></span>
                      </div>
                    )}
                  </div>

                  {/* Notes & Recording badges */}
                  <div className="flex items-center gap-2 flex-wrap pt-1">
                    {item.notesUrl && (
                      <a
                        href={item.notesUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1.5 px-2.5 py-1 bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 rounded-lg text-[11px] font-semibold transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>{lang === 'bn' ? 'নোট / শিট' : 'Notes / PDF'}</span>
                      </a>
                    )}

                    {item.recordingUrl && (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-[11px] font-semibold">
                        <Film className="w-3.5 h-3.5 text-blue-600" />
                        <span>{lang === 'bn' ? 'ভিডিও রেকর্ডিং সংযুক্ত' : 'Video Attached'}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="p-4 bg-slate-50/80 border-t border-slate-100 space-y-2.5">
                  {/* Primary Action Button */}
                  <div className="flex items-center space-x-2">
                    {isLive ? (
                      <>
                        <button
                          onClick={() => setActiveWebRTCClass(item)}
                          className="flex-1 inline-flex items-center justify-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black rounded-xl shadow-md shadow-red-600/30 text-xs transition-transform active:scale-95 animate-pulse-slow"
                        >
                          <Video className="w-4 h-4" />
                          <span>{lang === 'bn' ? 'লাইভে প্রবেশ করুন (WebRTC)' : 'Launch Live Studio'}</span>
                        </button>
                        <button
                          onClick={() => handleStatusChange(item.id, 'COMPLETED')}
                          className="px-3 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl text-xs transition-colors"
                          title={lang === 'bn' ? 'ক্লাস সমাপ্ত করুন' : 'End Class'}
                        >
                          {lang === 'bn' ? 'সমাপ্ত' : 'End'}
                        </button>
                      </>
                    ) : isUpcoming ? (
                      <>
                        <button
                          onClick={async () => {
                            await handleStatusChange(item.id, 'LIVE');
                            setActiveWebRTCClass({ ...item, status: 'LIVE' });
                          }}
                          className="flex-1 inline-flex items-center justify-center space-x-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md shadow-emerald-600/20 text-xs transition-transform active:scale-95"
                        >
                          <Play className="w-4 h-4 fill-white" />
                          <span>{lang === 'bn' ? '🔴 লাইভ শুরু করুন (Go Live)' : '🔴 Go Live Now'}</span>
                        </button>
                        {item.meetingLink && (
                          <a
                            href={item.meetingLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl transition-colors"
                            title="Open External Link"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </>
                    ) : (
                      <button
                        onClick={() => handleOpenRecordingModal(item)}
                        className="flex-1 inline-flex items-center justify-center space-x-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md shadow-blue-600/20 text-xs transition-transform active:scale-95"
                      >
                        <Film className="w-4 h-4" />
                        <span>
                          {item.recordingUrl
                            ? (lang === 'bn' ? 'ভিডিও লিঙ্ক পরিবর্তন করুন' : 'Edit Recording Link')
                            : (lang === 'bn' ? '+ রেকর্ডেড ভিডিও যোগ করুন' : '+ Add Recording Link')}
                        </span>
                      </button>
                    )}
                  </div>

                  {/* Live Chat & Q&A Trigger Button */}
                  <button
                    onClick={() => setActiveChatClass(item)}
                    className="w-full inline-flex items-center justify-center space-x-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{lang === 'bn' ? 'লাইভ চ্যাট ও প্রশ্নোত্তর মনিটর' : 'Live Chat & Q&A Monitor'}</span>
                  </button>

                  {/* Secondary Management Row */}
                  <div className="flex items-center justify-between pt-1 text-slate-500 text-xs">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleToggleDemo(item)}
                        className="p-1.5 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors flex items-center"
                        title={item.isDemo ? "লকড প্রিমিয়াম করুন" : "ফ্রি ডেমো করুন"}
                      >
                        {item.isDemo ? <ToggleRight className="w-4 h-4 text-emerald-600" /> : <ToggleLeft className="w-4 h-4 text-slate-400" />}
                      </button>
                      <button
                        onClick={() => handleOpenEditModal(item)}
                        className="p-1.5 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                        title="Edit Class"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteClass(item.id)}
                        className="p-1.5 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Class"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {!isCompleted && (
                      <button
                        onClick={() => handleOpenRecordingModal(item)}
                        className="text-[11px] text-blue-600 hover:underline font-semibold"
                      >
                        {lang === 'bn' ? 'রেকর্ডিং যোগ করুন' : 'Attach Video'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  )}

      {/* CREATE / EDIT CLASS MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-10">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-emerald-600/10 text-emerald-700">
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-800 text-lg">
                    {editingClass
                      ? (lang === 'bn' ? 'লাইভ ক্লাসের তথ্য সম্পাদনা' : 'Edit Live Class')
                      : (lang === 'bn' ? 'নতুন লাইভ অনলাইন ক্লাস শিডিউল করুন' : 'Schedule New Live Class')}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {lang === 'bn' ? 'শ্রেণি, সময়সূচি ও মিটিং প্ল্যাটফর্ম নির্ধারণ করুন' : 'Set class, timing and meeting platform'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveClass} className="p-6 space-y-4">
              {errorMessage && (
                <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  {lang === 'bn' ? 'ক্লাসের শিরোনাম ও অধ্যায় / টপিক *' : 'Class Title & Topic *'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={lang === 'bn' ? 'উদা: ৮ম শ্রেণি: সাধারণ গণিত - জ্যামিতিক উপপাদ্য' : 'e.g. Class 8: General Math - Geometry Theorems'}
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              {/* Class & Section */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    {t('class')} *
                  </label>
                  <select
                    required
                    value={formData.classId}
                    onChange={handleClassChangeInForm}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="">-- {t('class')} --</option>
                    {allClasses.map((cls) => (
                      <option key={cls.id} value={cls.id}>
                        {cls.nameBn || cls.nameEn}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    {t('subject')} *
                  </label>
                  <select
                    required
                    value={formData.subjectId}
                    onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="">-- {t('subject')} --</option>
                    {classSubjects.map((sub) => (
                      <option key={sub.id} value={sub.id}>
                        {sub.nameBn || sub.nameEn}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Date/Time & Duration */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    {t('scheduleTime')} *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.scheduledStartTime}
                    onChange={(e) => setFormData({ ...formData, scheduledStartTime: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    {t('duration')} *
                  </label>
                  <select
                    value={formData.durationMinutes}
                    onChange={(e) => setFormData({ ...formData, durationMinutes: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="30">30 মিনিট / Minutes</option>
                    <option value="40">40 মিনিট / Minutes</option>
                    <option value="45">45 মিনিট / Minutes</option>
                    <option value="50">50 মিনিট / Minutes</option>
                    <option value="60">60 মিনিট (1 Hour)</option>
                    <option value="90">90 মিনিট (1.5 Hours)</option>
                  </select>
                </div>
              </div>

              {/* Platform & Meeting Link */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    {t('platform')}
                  </label>
                  <select
                    value={formData.platform}
                    onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="GOOGLE_MEET">Google Meet</option>
                    <option value="ZOOM">Zoom Meeting</option>
                    <option value="YOUTUBE_LIVE">YouTube Live</option>
                    <option value="IN_BUILT">ইন-বিল্ট লাইভ ফ্রেম</option>
                    <option value="OTHER">কাস্টম লিঙ্ক / Other</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    {t('meetingLink')} *
                  </label>
                  <div className="relative">
                    <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="url"
                      required
                      placeholder="https://meet.google.com/xyz-abcd-efg"
                      value={formData.meetingLink}
                      onChange={(e) => setFormData({ ...formData, meetingLink: e.target.value })}
                      className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Passcode */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  {t('meetingPassword')}
                </label>
                <input
                  type="text"
                  placeholder={lang === 'bn' ? 'যেমন: nextgen-class8 (ঐচ্ছিক)' : 'e.g. nextgen-pass (Optional)'}
                  value={formData.meetingPassword}
                  onChange={(e) => setFormData({ ...formData, meetingPassword: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              {/* Dual Option: Drive URL vs Device File Upload */}
              <div className="p-4 bg-slate-50/80 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700">
                <UniversalFileUploader
                  label={lang === 'bn' ? 'ক্লাস নোট / পিডিএফ ও লেকচার শিট (Notes / PDF)' : 'Lecture Notes / PDF Attachment'}
                  value={formData.noteFileUrl || formData.notesUrl}
                  fileName={formData.noteFileName}
                  fileSize={formData.noteFileSize}
                  maxMb={25}
                  onChange={({ url, fileUrl, fileName, fileSize }) => {
                    const finalUrl = fileUrl || url || '';
                    setFormData(prev => ({
                      ...prev,
                      notesUrl: finalUrl,
                      noteFileUrl: finalUrl,
                      noteFileName: fileName || '',
                      noteFileSize: fileSize || ''
                    }));
                  }}
                  placeholder="https://drive.google.com/file/d/... বা ড্রাইভ লিংক"
                />
              </div>

              {/* Description / Instructions */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  {lang === 'bn' ? 'ক্লাসের বিবরণ ও নির্দেশনাবলী' : 'Class Description & Instructions'}
                </label>
                <textarea
                  rows="2"
                  placeholder={lang === 'bn' ? 'ক্লাসে যোগদানের আগে যা যা প্রস্তুতি নিতে হবে...' : 'Instructions or prep material before joining...'}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              {/* Freemium Demo Toggle */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 block text-xs">
                    {lang === 'bn' ? 'ফ্রি ডেমো হিসেবে দেখান (Make Demo Class: Yes/No)' : 'Make Free Demo Class: Yes/No'}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    {lang === 'bn' ? 'সক্রিয় করলে যেকোনো সাধারণ শিক্ষার্থী বা অভিভাবক বিনা খরচে ক্লাস দেখতে পারবেন' : 'Allow free preview for all visitors'}
                  </span>
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

              {/* Modal Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs sm:text-sm transition-colors"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/20 transition-all flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{submitting ? t('processing') : t('save')}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD / EDIT RECORDED VIDEO LINK MODAL */}
      {showRecordingModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-blue-600/10 text-blue-700">
                  <Film className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-800 text-base">
                    {lang === 'bn' ? 'রেকর্ডেড ক্লাসের ভিডিও লিঙ্ক যুক্ত করুন' : 'Attach Recorded Lecture Video'}
                  </h3>
                  <p className="text-xs text-slate-500 truncate max-w-xs">{showRecordingModal.title}</p>
                </div>
              </div>
              <button
                onClick={() => setShowRecordingModal(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveRecording} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  {t('recordingVideoUrl')} *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://www.youtube.com/watch?v=... or Google Drive link"
                  value={recordingForm.recordingUrl}
                  onChange={(e) => setRecordingForm({ ...recordingForm, recordingUrl: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  {t('recordingDuration')}
                </label>
                <input
                  type="text"
                  placeholder="যেমন: ৪৫ মিনিট"
                  value={recordingForm.recordingDuration}
                  onChange={(e) => setRecordingForm({ ...recordingForm, recordingDuration: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="p-3.5 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                <UniversalFileUploader
                  label={lang === 'bn' ? 'ক্লাস নোট / পিডিএফ ও শিট' : 'Lecture Notes / PDF Attachment'}
                  value={recordingForm.noteFileUrl || recordingForm.notesUrl}
                  fileName={recordingForm.noteFileName}
                  fileSize={recordingForm.noteFileSize}
                  maxMb={25}
                  onChange={({ url, fileUrl, fileName, fileSize }) => {
                    const finalUrl = fileUrl || url || '';
                    setRecordingForm(prev => ({
                      ...prev,
                      notesUrl: finalUrl,
                      noteFileUrl: finalUrl,
                      noteFileName: fileName || '',
                      noteFileSize: fileSize || ''
                    }));
                  }}
                  placeholder="https://drive.google.com/... বা ড্রাইভ লিঙ্ক"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowRecordingModal(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-md transition-all"
                >
                  {submitting ? t('processing') : (lang === 'bn' ? 'ভিডিও সংরক্ষণ করুন' : 'Save Video Link')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TEACHER LIVE CHAT & Q&A MONITOR MODAL */}
      {activeChatClass && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full h-[85vh] shadow-2xl flex flex-col overflow-hidden text-white animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-4 bg-slate-800 border-b border-slate-700 flex items-center justify-between">
              <div className="flex items-center space-x-3 overflow-hidden">
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div className="overflow-hidden">
                  <h3 className="font-bold text-sm sm:text-base text-white truncate">
                    {activeChatClass.title}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {activeChatClass.class?.nameBn} ({activeChatClass.section?.nameBn || 'সকল শাখা'}) • {activeChatClass.subject?.nameBn}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {activeChatClass.meetingLink && (
                  <a
                    href={activeChatClass.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1 transition-all"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>মিটিং লিঙ্ক</span>
                  </a>
                )}
                <button
                  onClick={() => setActiveChatClass(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Chat Panel Content */}
            <div className="flex-1 overflow-hidden p-2 bg-slate-950">
              <LiveClassChatPanel
                liveClassId={activeChatClass.id}
                liveClassTitle={activeChatClass.title}
                role={role}
              />
            </div>
          </div>
        </div>
      )}

      {/* WebRTC Interactive Live Studio Modal */}
      <WebRTCLiveClassroom
        liveClass={activeWebRTCClass}
        isOpen={!!activeWebRTCClass}
        onClose={() => {
          setActiveWebRTCClass(null);
          fetchLiveClasses();
        }}
        role={role}
      />
    </div>
  );
}
