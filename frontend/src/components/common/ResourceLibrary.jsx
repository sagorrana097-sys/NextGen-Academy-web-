import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { resourceAPI, curriculumAPI } from '../../services/api';
import OnlineAdmissionForm from '../public/OnlineAdmissionForm';
import UniversalFileUploader from './UniversalFileUploader';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import {
  BookOpen,
  Download,
  Search,
  Filter,
  Plus,
  Edit2,
  Trash2,
  Calendar,
  Clock,
  ExternalLink,
  FileText,
  User,
  CheckCircle2,
  AlertCircle,
  X,
  Sparkles,
  Layers,
  Eye,
  FolderOpen,
  Lock,
  Unlock,
  GraduationCap,
  ArrowRight,
  ShieldCheck,
  Check,
  ToggleLeft,
  ToggleRight,
  BookMarked,
  FileSpreadsheet,
  FileQuestion,
  Award
} from 'lucide-react';

export default function ResourceLibrary({ studentId = null, role = 'STUDENT', classIdFilter = null, showAdminControls = false }) {
  const { lang, t } = useLanguage();
  const { user } = useAuth();

  const isPrivileged = role === 'ADMIN' || role === 'TEACHER' || user?.role === 'ADMIN' || user?.role === 'TEACHER' || showAdminControls;
  const isPaidOrEnrolled = isPrivileged || (user && user.role === 'STUDENT' && user.paymentStatus !== 'UNPAID' && user.isEnrolled !== false);

  const [resources, setResources] = useState([]);
  const [classesList, setClassesList] = useState([]);
  const [subjectsList, setSubjectsList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Tab Filtering: 'ALL' | 'FREE' | 'PREMIUM'
  const [accessFilter, setAccessFilter] = useState('ALL');

  // Type Filter: 'ALL' | 'ই-বুক' | 'হ্যান্ডনোট' | 'সাজেশন' | 'প্রশ্নব্যাংক' | 'মডেল টেস্ট'
  const [typeFilter, setTypeFilter] = useState('ALL');

  // Filters
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedClass, setSelectedClass] = useState(classIdFilter ? String(classIdFilter) : '');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [readingResource, setReadingResource] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [deletingResource, setDeletingResource] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showLockCtaModal, setShowLockCtaModal] = useState(null);
  const [showAdmissionModal, setShowAdmissionModal] = useState(false);

  // Form State for Add / Edit Modal
  const [formData, setFormData] = useState({
    title: '',
    titleBn: '',
    titleEn: '',
    subjectId: '60',
    subjectName: 'বাংলা',
    classId: classIdFilter ? String(classIdFilter) : '11',
    classGrade: 'Class 8 (৮ম শ্রেণি)',
    edition: 'নেক্সটজেন একাডেমি ২০২৬ শিক্ষাবর্ষ',
    author: 'নেক্সটজেন শিক্ষক প্যানেল',
    fileType: 'হ্যান্ডনোট', // 'হ্যান্ডনোট' | 'সাজেশন' | 'ই-বুক' | 'প্রশ্নব্যাংক' | 'মডেল টেস্ট'
    fileUrl: '',
    fileName: '',
    fileSize: '3.5 MB',
    totalPages: 24,
    description: '',
    isFree: false
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

      const [resourcesRes, classesRes, subjectsRes] = await Promise.all([
        resourceAPI.getAll(params),
        curriculumAPI.getClasses(),
        curriculumAPI.getSubjects(selectedClass || '11')
      ]);

      if (resourcesRes.success) {
        setResources(resourcesRes.data || []);
      }
      if (classesRes.success) {
        setClassesList(classesRes.data || []);
      }
      if (subjectsRes.success) {
        setSubjectsList(subjectsRes.data || []);
      }
    } catch (err) {
      console.error('Failed to load resources:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClassChangeInForm = async (e) => {
    const clsId = e.target.value;
    const selectedClsObj = classesList.find((c) => String(c.id) === String(clsId));
    setFormData((prev) => ({
      ...prev,
      classId: clsId,
      classGrade: selectedClsObj?.nameBn || selectedClsObj?.name || `Class ${clsId}`
    }));

    try {
      const res = await curriculumAPI.getSubjects(clsId);
      if (res.success && res.data) {
        setSubjectsList(res.data);
        if (res.data.length > 0) {
          setFormData((prev) => ({
            ...prev,
            subjectId: String(res.data[0].id),
            subjectName: res.data[0].nameBn || res.data[0].nameEn
          }));
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubjectChangeInForm = (e) => {
    const subId = e.target.value;
    const subObj = subjectsList.find((s) => String(s.id) === String(subId));
    setFormData((prev) => ({
      ...prev,
      subjectId: subId,
      subjectName: subObj?.nameBn || subObj?.nameEn || 'সাধারণ বিষয়'
    }));
  };

  const handleToggleFree = async (item) => {
    try {
      const res = await resourceAPI.toggleFree(item.id);
      if (res.success) {
        fetchInitialData();
      }
    } catch (err) {
      alert('স্ট্যাটাস পরিবর্তন ব্যর্থ হয়েছে: ' + (err.message || 'Error'));
    }
  };

  const handleAccessFile = (item) => {
    const isFree = Boolean(item.isFree);
    if (isFree || isPaidOrEnrolled) {
      if (item.fileUrl) {
        if (item.fileUrl.startsWith('data:')) {
          const link = document.createElement('a');
          link.href = item.fileUrl;
          link.download = item.fileName || `${item.titleBn || item.title || 'Resource'}.pdf`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } else {
          window.open(item.fileUrl, '_blank');
        }
      } else {
        setReadingResource(item);
      }
    } else {
      setShowLockCtaModal(item);
    }
  };

  const handleOpenReader = (item) => {
    const isFree = Boolean(item.isFree);
    if (isFree || isPaidOrEnrolled) {
      setReadingResource(item);
    } else {
      setShowLockCtaModal(item);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.fileUrl) {
      setFormError('শিরোনাম এবং ফাইল ডাউনলোড লিঙ্ক (PDF/Drive Link) আবশ্যক।');
      return;
    }

    setSubmitting(true);
    setFormError(null);

    try {
      const directLink = formData.fileUrl ? formData.fileUrl.trim() : (formData.pdf_link || '');
      const payload = {
        title: formData.title.trim(),
        titleBn: formData.title.trim(),
        titleEn: formData.titleEn || formData.title,
        classId: Number(formData.classId),
        classGrade: formData.classGrade,
        subjectId: Number(formData.subjectId),
        subjectName: formData.subjectName,
        fileType: formData.fileType,
        fileUrl: directLink,
        pdf_link: formData.pdf_link || directLink,
        file_url: formData.file_url || directLink,
        downloadUrl: formData.downloadUrl || directLink,
        fileName: formData.fileName || '',
        fileSize: formData.fileSize || '3.5 MB',
        totalPages: Number(formData.totalPages) || 15,
        edition: formData.edition,
        author: formData.author,
        description: formData.description.trim(),
        isFree: Boolean(formData.isFree)
      };

      if (editingResource) {
        await resourceAPI.update(editingResource.id, payload);
      } else {
        await resourceAPI.create(payload);
      }

      setShowAddModal(false);
      setEditingResource(null);
      setFormData({
        title: '',
        titleBn: '',
        titleEn: '',
        subjectId: '60',
        subjectName: 'বাংলা',
        classId: selectedClass || '11',
        classGrade: 'Class 8 (৮ম শ্রেণি)',
        edition: 'নেক্সটজেন একাডেমি ২০২৬ শিক্ষাবর্ষ',
        author: user?.name ? `${user.name} (${user.role})` : 'নেক্সটজেন শিক্ষক প্যানেল',
        fileType: 'হ্যান্ডনোট',
        fileUrl: '',
        fileName: '',
        fileSize: '3.5 MB',
        totalPages: 24,
        description: '',
        isFree: false
      });

      fetchInitialData();
    } catch (err) {
      setFormError(err.message || 'সংরক্ষণ ব্যর্থ হয়েছে');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (item) => {
    setDeletingResource(item);
  };

  const handleConfirmDelete = async () => {
    if (!deletingResource) return;
    setIsDeleting(true);
    try {
      await resourceAPI.delete(deletingResource.id);
      setResources(prev => prev.filter(r => r.id !== deletingResource.id));
      setDeletingResource(null);
    } catch (err) {
      alert(err.message || 'মুছে ফেলতে ব্যর্থ হয়েছে');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleOpenEdit = (item) => {
    setEditingResource(item);
    setFormData({
      title: item.title || item.titleBn || '',
      titleBn: item.titleBn || item.title || '',
      titleEn: item.titleEn || '',
      classId: String(item.classId || '11'),
      classGrade: item.classGrade || 'Class 8',
      subjectId: String(item.subjectId || '60'),
      subjectName: item.subjectName || 'সাধারণ বিষয়',
      fileType: item.fileType || 'হ্যান্ডনোট',
      fileUrl: item.fileUrl || item.downloadUrl || '',
      fileName: item.fileName || '',
      fileSize: item.fileSize || '3.5 MB',
      totalPages: item.totalPages || 20,
      edition: item.edition || 'নেক্সটজেন ২০২৬ সংস্করণ',
      author: item.author || 'নেক্সটজেন একাডেমি',
      description: item.description || '',
      isFree: Boolean(item.isFree)
    });
    setShowAddModal(true);
  };

  // Filtered list
  const filteredList = resources.filter((r) => {
    const isFree = Boolean(r.isFree);
    const matchAccess =
      accessFilter === 'ALL' ||
      (accessFilter === 'FREE' && isFree) ||
      (accessFilter === 'PREMIUM' && !isFree);

    const matchType = typeFilter === 'ALL' || r.fileType === typeFilter;
    const matchSubject = !selectedSubject || r.subjectName === selectedSubject || String(r.subjectId) === String(selectedSubject);
    const matchClass = !selectedClass || String(r.classId) === String(selectedClass);

    const q = searchQuery.toLowerCase().trim();
    const matchSearch =
      !q ||
      r.title?.toLowerCase().includes(q) ||
      r.titleBn?.toLowerCase().includes(q) ||
      r.titleEn?.toLowerCase().includes(q) ||
      r.subjectName?.toLowerCase().includes(q) ||
      r.author?.toLowerCase().includes(q) ||
      r.fileType?.toLowerCase().includes(q) ||
      r.description?.toLowerCase().includes(q);

    return matchAccess && matchType && matchSubject && matchClass && matchSearch;
  });

  const availableSubjects = Array.from(new Set(resources.map((r) => r.subjectName).filter(Boolean)));

  const getTypeBadgeColor = (type) => {
    switch (type) {
      case 'ই-বুক':
        return 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300';
      case 'সাজেশন':
        return 'bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300';
      case 'প্রশ্নব্যাংক':
        return 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300';
      case 'মডেল টেস্ট':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-3.5 py-1 rounded-full text-xs font-semibold backdrop-blur-md mb-3">
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              <span>ডিজিটাল পাঠ্যপুস্তক, ই-বুক ও স্টাডি রিসোর্স লাইব্রেরি</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              পাঠ্যপুস্তক, ই-বুক ও স্পেশাল হ্যান্ডনোটস
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1.5 max-w-2xl leading-relaxed">
              বিনা মূল্যে উন্মুক্ত পাঠ্যবই ডাউনলোড করুন এবং সম্পূর্ণ অধ্যায়ভিত্তিক হ্যান্ডনোট, সাজেশন ও প্রশ্নব্যাংক অ্যাক্সেস করতে ভর্তি সম্পন্ন করুন।
            </p>
          </div>

          <div className="flex items-center space-x-2 self-start md:self-auto shrink-0">
            {!isPaidOrEnrolled && (
              <button
                onClick={() => setShowAdmissionModal(true)}
                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-amber-500/30 flex items-center space-x-2 transition-all transform active:scale-95"
              >
                <GraduationCap className="w-4 h-4" />
                <span>ভর্তি হয়ে সব নোট আনলক করুন</span>
              </button>
            )}

            {isPrivileged && (
              <button
                onClick={() => {
                  setEditingResource(null);
                  setFormData({
                    title: '',
                    titleBn: '',
                    titleEn: '',
                    subjectId: '60',
                    subjectName: 'বাংলা',
                    classId: selectedClass || '11',
                    classGrade: 'Class 8 (৮ম শ্রেণি)',
                    edition: 'নেক্সটজেন একাডেমি ২০২৬ শিক্ষাবর্ষ',
                    author: user?.name ? `${user.name} (${user.role})` : 'নেক্সটজেন শিক্ষক প্যানেল',
                    fileType: 'হ্যান্ডনোট',
                    fileUrl: '',
                    fileSize: '3.5 MB',
                    totalPages: 24,
                    description: '',
                    isFree: false
                  });
                  setShowAddModal(true);
                }}
                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs sm:text-sm shadow-xl shadow-emerald-600/30 flex items-center space-x-2 transition-all transform active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>+ নতুন ফাইল / ই-বুক যুক্ত করুন</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Access Category Switcher (Free vs Premium) */}
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
            <span>সকল রিসোর্স ({resources.length})</span>
          </button>

          <button
            onClick={() => setAccessFilter('FREE')}
            className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center space-x-2 ${
              accessFilter === 'FREE'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-600/30'
                : 'text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            <span>🟢 ফ্রি ডাউনলোড ফাইল (Free PDF)</span>
          </button>

          <button
            onClick={() => setAccessFilter('PREMIUM')}
            className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center space-x-2 ${
              accessFilter === 'PREMIUM'
                ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg shadow-amber-600/30'
                : 'text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40'
            }`}
          >
            <Lock className="w-4 h-4 text-amber-300" />
            <span>🔒 শুধুমাত্র ভর্তিকৃত শিক্ষার্থীদের জন্য</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* File Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500"
          >
            <option value="ALL">সকল ধরন (All Types)</option>
            <option value="ই-বুক">ই-বুক (E-Books)</option>
            <option value="হ্যান্ডনোট">হ্যান্ডনোট (Handnotes)</option>
            <option value="সাজেশন">সাজেশন (Suggestions)</option>
            <option value="প্রশ্নব্যাংক">প্রশ্নব্যাংক (Question Bank)</option>
            <option value="মডেল টেস্ট">মডেল টেস্ট পেপার</option>
          </select>

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

          {/* Subject Filter */}
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
            placeholder="বইয়ের নাম, বিষয় বা নোট খুঁজুন..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-medium text-slate-800 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Grid of Resources */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm font-medium">রিসোর্স লোড হচ্ছে...</p>
        </div>
      ) : filteredList.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-slate-500 space-y-3">
          <FolderOpen className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-700 dark:text-slate-300 text-base">কোনো রিসোর্স বা ই-বুক পাওয়া যায়নি</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            নির্বাচিত ফিল্টারে বর্তমানে কোনো ফাইল নেই।
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredList.map((item) => {
            const isFree = Boolean(item.isFree);
            const isLocked = !isFree && !isPaidOrEnrolled;

            return (
              <div
                key={item.id}
                className={`bg-white dark:bg-slate-900 rounded-3xl border ${
                  isFree
                    ? 'border-emerald-500/30 shadow-emerald-500/5 hover:border-emerald-500'
                    : isLocked
                    ? 'border-amber-500/30'
                    : 'border-slate-200 dark:border-slate-800 hover:border-indigo-500/50'
                } shadow-sm hover:shadow-xl transition-all duration-200 flex flex-col justify-between overflow-hidden group`}
              >
                {/* Card Header with Badges */}
                <div className="p-5 space-y-3.5 flex-1 text-slate-800 dark:text-slate-200">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className={`px-2.5 py-0.5 rounded-lg border text-[11px] font-black ${getTypeBadgeColor(item.fileType)}`}>
                      {item.fileType || 'হ্যান্ডনোট'}
                    </span>

                    {isFree ? (
                      <span className="px-2.5 py-1 rounded-xl text-[10px] font-black uppercase backdrop-blur-md bg-emerald-600 text-white shadow-md flex items-center space-x-1">
                        <Sparkles className="w-3 h-3 text-emerald-200" />
                        <span>ফ্রি ডাউনলোড (Free PDF)</span>
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-xl text-[10px] font-black uppercase backdrop-blur-md bg-amber-600 text-white shadow-md flex items-center space-x-1">
                        <Lock className="w-3 h-3 text-amber-200" />
                        <span>শুধুমাত্র ভর্তিকৃতদের জন্য (Locked)</span>
                      </span>
                    )}
                  </div>

                  <div>
                    <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 block">
                      {item.subjectName} • {item.classGrade}
                    </span>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base leading-snug group-hover:text-indigo-600 transition-colors line-clamp-2 mt-0.5">
                      {item.titleBn || item.title}
                    </h3>
                    {item.description && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    )}
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span>📄 {item.totalPages || 20} পৃষ্ঠা • {item.fileSize || '3.0 MB'}</span>
                    <span className="truncate max-w-[140px]">✍️ {item.author || 'NCTB'}</span>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  {isLocked ? (
                    <button
                      onClick={() => handleAccessFile(item)}
                      className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-xs flex items-center justify-center space-x-1.5 shadow-md shadow-amber-600/20 transition-all active:scale-95"
                    >
                      <Lock className="w-4 h-4" />
                      <span>ফাইলটি আনলক করুন (ভর্তি আবশ্যক)</span>
                    </button>
                  ) : (
                    <div className="flex items-center space-x-2 flex-1">
                      <button
                        onClick={() => handleOpenReader(item)}
                        className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center space-x-1.5 shadow-md shadow-indigo-600/20 transition-all active:scale-95"
                      >
                        <Eye className="w-4 h-4" />
                        <span>অনলাইনে পড়ুন</span>
                      </button>

                      <button
                        onClick={() => handleAccessFile(item)}
                        className="px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center space-x-1.5 shadow-md shadow-emerald-600/20 transition-all active:scale-95"
                        title="সরাসরি ডাউনলোড করুন"
                      >
                        <Download className="w-4 h-4" />
                        <span>ডাউনলোড</span>
                      </button>
                    </div>
                  )}

                  {isPrivileged && (
                    <div className="flex items-center space-x-1 shrink-0">
                      <button
                        onClick={() => handleToggleFree(item)}
                        title={isFree ? 'লকড করুন (Make Locked)' : 'ফ্রি ফাইল করুন (Make Free)'}
                        className="p-2 rounded-xl text-slate-400 hover:text-emerald-600 transition-colors"
                      >
                        {isFree ? <ToggleRight className="w-5 h-5 text-emerald-500" /> : <ToggleLeft className="w-5 h-5" />}
                      </button>
                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="p-2 rounded-xl text-slate-400 hover:text-indigo-600 transition-colors"
                        title="এডিট করুন"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item)}
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
      {/* 1. ONLINE E-BOOK & NOTES READER MODAL */}
      {/* ========================================================================= */}
      {readingResource && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200">
          <div className="bg-slate-900 text-white rounded-3xl max-w-5xl w-full h-[90vh] overflow-hidden shadow-2xl border border-slate-800 flex flex-col">
            <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90 backdrop-blur-md shrink-0">
              <div className="flex items-center space-x-3 overflow-hidden">
                <div className="p-2.5 rounded-2xl bg-indigo-600/20 text-indigo-400 shrink-0">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div className="overflow-hidden">
                  <h3 className="font-bold text-base sm:text-lg text-white truncate">
                    {readingResource.titleBn || readingResource.title}
                  </h3>
                  <p className="text-xs text-slate-400 truncate mt-0.5">
                    {readingResource.subjectName} • {readingResource.classGrade} • {readingResource.fileType}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                {readingResource.fileUrl && (
                  <a
                    href={readingResource.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center space-x-1.5 shadow-sm transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>পিডিএফ ডাউনলোড</span>
                  </a>
                )}
                <button
                  onClick={() => setReadingResource(null)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 bg-slate-950 p-4 sm:p-8 flex flex-col items-center justify-center text-center space-y-4 overflow-y-auto">
              <div className="w-20 h-20 rounded-3xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center shadow-xl">
                <BookOpen className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-black text-white max-w-lg">
                {readingResource.titleBn || readingResource.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 max-w-md leading-relaxed">
                {readingResource.description || 'এই ডিজিটাল রিসোর্সটি সম্পূর্ণ ডাউনলোডযোগ্য ফরম্যাটে প্রস্তুত রয়েছে।'}
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <span className="px-3 py-1 bg-slate-800 rounded-xl text-xs font-mono text-slate-300 border border-slate-700">
                  পৃষ্ঠা: {readingResource.totalPages || 20}
                </span>
                <span className="px-3 py-1 bg-slate-800 rounded-xl text-xs font-mono text-slate-300 border border-slate-700">
                  আকার: {readingResource.fileSize || '3.5 MB'}
                </span>
                <span className="px-3 py-1 bg-slate-800 rounded-xl text-xs font-mono text-slate-300 border border-slate-700">
                  লেখক: {readingResource.author || 'NCTB'}
                </span>
              </div>

              <div className="pt-4 flex items-center space-x-3">
                <a
                  href={readingResource.fileUrl || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-xl shadow-indigo-600/30 flex items-center space-x-2 transition-all transform active:scale-95"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>ব্রাউজারে সরাসরি ওপেন করুন (Open PDF)</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. FREEMIUM LOCKED CTA MODAL */}
      {/* ========================================================================= */}
      {showLockCtaModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-slate-900 text-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-amber-500/40 space-y-6 relative overflow-hidden">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300">
                  <Lock className="w-5 h-5" />
                </div>
                <h3 className="font-black text-base text-white">প্রিমিয়াম স্টাডি ফাইল আনলক করুন</h3>
              </div>
              <button onClick={() => setShowLockCtaModal(null)} className="p-1 rounded-lg text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <span className="px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 font-bold text-xs inline-block">
                {showLockCtaModal.subjectName} • {showLockCtaModal.classGrade}
              </span>
              <h4 className="font-black text-lg text-white leading-snug">
                "{showLockCtaModal.titleBn || showLockCtaModal.title}"
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                এই এক্সক্লুসিভ {showLockCtaModal.fileType} ফাইলটি নেক্সটজেন একাডেমির নিয়মিত শিক্ষার্থীদের জন্য প্রস্তুত করা হয়েছে। সম্পূর্ণ নোট ও ই-বুক পেতে অনলাইন ভর্তি সম্পন্ন করুন।
              </p>
            </div>

            <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/80 space-y-2 text-xs">
              <div className="flex items-center space-x-2 text-emerald-400 font-semibold">
                <Check className="w-4 h-4 shrink-0" />
                <span>সকল বিষয়ের বোর্ড স্ট্যান্ডার্ড হ্যান্ডনোটস ও সাজেশন</span>
              </div>
              <div className="flex items-center space-x-2 text-emerald-400 font-semibold">
                <Check className="w-4 h-4 shrink-0" />
                <span>শীর্ষ শিক্ষকদের সমাধান ও শর্টকাট টেকনিক শিট</span>
              </div>
              <div className="flex items-center space-x-2 text-emerald-400 font-semibold">
                <Check className="w-4 h-4 shrink-0" />
                <span>আনলিমিটেড ডিজিটাল ডাউনলোড ও প্রিন্টেবল পিডিএফ</span>
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

      {/* ========================================================================= */}
      {/* 3. ONLINE ADMISSION MODAL */}
      {/* ========================================================================= */}
      {showAdmissionModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md overflow-y-auto">
          <OnlineAdmissionForm onClose={() => setShowAdmissionModal(false)} />
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. ADD / EDIT RESOURCE MODAL */}
      {/* ========================================================================= */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 animate-in fade-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-5">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-2xl bg-indigo-600/10 text-indigo-600">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white">
                    {editingResource ? 'রিসোর্স সম্পাদনা করুন' : 'নতুন ফাইল / ই-বুক যুক্ত করুন'}
                  </h3>
                  <p className="text-xs text-slate-500">PDF ফাইল লিঙ্ক বা Google Drive লিংক দিন</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingResource(null);
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
                <label className="block font-bold mb-1">ফাইলের শিরোনাম *</label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: গণিত - জ্যামিতিক উপপাদ্য ও সূত্রাবলি শিট"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value, titleBn: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">রিসোর্সের ধরন *</label>
                  <select
                    value={formData.fileType}
                    onChange={(e) => setFormData({ ...formData, fileType: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                  >
                    <option value="হ্যান্ডনোট">হ্যান্ডনোট (Handnote)</option>
                    <option value="সাজেশন">সাজেশন (Suggestion)</option>
                    <option value="ই-বুক">ই-বুক (E-Book)</option>
                    <option value="প্রশ্নব্যাংক">প্রশ্নব্যাংক (Question Bank)</option>
                    <option value="মডেল টেস্ট">মডেল টেস্ট পেপার</option>
                  </select>
                </div>

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
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">বিষয় *</label>
                  <select
                    value={formData.subjectId}
                    onChange={handleSubjectChangeInForm}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                  >
                    {subjectsList.map((sub) => (
                      <option key={sub.id} value={sub.id}>
                        {sub.nameBn || sub.nameEn}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold mb-1">লেখক / সংকলক</label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                  />
                </div>
              </div>

              {/* Dual File Option: Google Drive URL vs Device File Upload */}
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                <UniversalFileUploader
                  label="রিসোর্স ও পাঠ্যপুস্তক ফাইল (PDF / Drive URL / Device Upload) *"
                  value={formData.fileUrl}
                  fileName={formData.fileName}
                  accept="*/*"
                  maxMb={100}
                  onChange={({ url, fileUrl, fileName, fileSize }) => {
                    const finalUrl = fileUrl || url || '';
                    setFormData(prev => ({
                      ...prev,
                      fileUrl: finalUrl,
                      fileName: fileName || '',
                      fileSize: fileSize || prev.fileSize
                    }));
                  }}
                  placeholder="https://drive.google.com/file/d/... বা ড্রাইভ লিংক"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">ফাইলের আকার</label>
                  <input
                    type="text"
                    value={formData.fileSize}
                    onChange={(e) => setFormData({ ...formData, fileSize: e.target.value })}
                    placeholder="যেমন: 4.5 MB"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">মোট পৃষ্ঠা</label>
                  <input
                    type="number"
                    value={formData.totalPages}
                    onChange={(e) => setFormData({ ...formData, totalPages: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">সংক্ষিপ্ত বিবরণ</label>
                <textarea
                  rows="2"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="নোটের সারসংক্ষেপ বা গুরুত্বপূর্ণ দিকসমূহ..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              {/* Freemium isFree Toggle Switch */}
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">
                    ফ্রি ফাইল হিসেবে উন্মুক্ত রাখুন (Make this file Free: On/Off)
                  </span>
                  <span className="text-[11px] text-slate-400">
                    সক্রিয় করলে লগইন ছাড়াই যেকোনো শিক্ষার্থী সরাসরি PDF ফাইলটি ডাউনলোড করতে পারবে
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, isFree: !formData.isFree })}
                  className="flex items-center space-x-1.5 focus:outline-none"
                >
                  {formData.isFree ? (
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

      {/* Delete Confirmation Safeguard Modal */}
      {deletingResource && (
        <DeleteConfirmationModal
          isOpen={!!deletingResource}
          onClose={() => setDeletingResource(null)}
          onConfirm={handleConfirmDelete}
          itemName={deletingResource.titleBn || deletingResource.title}
          itemType="শিক্ষা সামগ্রী / রিসোর্স ফাইল"
          loading={isDeleting}
        />
      )}
    </div>
  );
}
