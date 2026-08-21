import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { teacherAPI } from '../../services/api';
import UniversalFileUploader from '../common/UniversalFileUploader';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Plus,
  Edit2,
  Trash2,
  Eye,
  CheckCircle2,
  AlertCircle,
  Phone,
  Mail,
  MapPin,
  Clock,
  Award,
  BookOpen,
  X,
  Save,
  MessageSquare,
  Globe,
  Briefcase,
  ToggleLeft,
  ToggleRight,
  Sparkles,
  ShieldCheck,
  RefreshCw,
  ExternalLink
} from 'lucide-react';

export default function TeacherManager() {
  const { t, lang } = useLanguage();

  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter
  const [search, setSearch] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [viewMode, setViewMode] = useState('cards'); // 'cards' | 'table'

  // Modals
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingTeacher, setDeletingTeacher] = useState(null);

  // Toast
  const [toast, setToast] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const initialFormState = {
    name: '',
    designation: 'সহকারী শিক্ষক',
    specialization: 'উচ্চতর গণিত ও পদার্থবিজ্ঞান',
    phone: '',
    email: '',
    password: 'teacher123',
    qualifications: 'বি.এসসি (অনার্স), এম.এসসি - ঢাকা বিশ্ববিদ্যালয়',
    officeHours: 'রবি - বৃহঃ সকাল ৯:৩০ - বিকাল ৩:৩০',
    roomNo: 'শিক্ষক মিলনায়তন (কক্ষ ২০৪)',
    bio: 'নেক্সটজেন একাডেমির অভিজ্ঞ ও নিবেদিতপ্রাণ শিক্ষক।',
    photo: '',
    is_phone_visible: true,
    isActive: true
  };
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const showFeedback = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const res = await teacherAPI.getAll();
      if (res.success && res.data) {
        setTeachers(res.data);
      }
    } catch (err) {
      console.error('Fetch teachers error:', err);
      showFeedback('শিক্ষক ডাটাবেজ লোড করতে সমস্যা হয়েছে', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Specializations list for filter
  const specializations = Array.from(
    new Set(teachers.map((t) => t.specialization).filter(Boolean))
  );

  // Filtered teachers
  const filteredTeachers = teachers.filter((t) => {
    const matchSearch =
      !search ||
      t.name?.toLowerCase().includes(search.toLowerCase()) ||
      t.designation?.toLowerCase().includes(search.toLowerCase()) ||
      t.specialization?.toLowerCase().includes(search.toLowerCase()) ||
      t.phone?.includes(search) ||
      t.email?.toLowerCase().includes(search.toLowerCase());

    const matchSubject = !selectedSubject || t.specialization === selectedSubject;

    return matchSearch && matchSubject;
  });

  const handleOpenAdd = () => {
    setEditingTeacher(null);
    setFormData(initialFormState);
    setShowAddEditModal(true);
  };

  const handleOpenEdit = (teacher) => {
    setEditingTeacher(teacher);
    setFormData({
      name: teacher.name || '',
      designation: teacher.designation || 'সহকারী শিক্ষক',
      specialization: teacher.specialization || 'সাধারণ শিক্ষা',
      phone: teacher.phone || teacher.mobile_number || '',
      email: teacher.email || teacher.contact_email || '',
      password: '',
      qualifications: teacher.qualifications || '',
      officeHours: teacher.officeHours || '',
      roomNo: teacher.roomNo || '',
      bio: teacher.bio || '',
      photo: teacher.avatar || '',
      is_phone_visible: teacher.is_phone_visible !== false,
      isActive: teacher.isActive !== false
    });
    setShowAddEditModal(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingTeacher) {
        const res = await teacherAPI.update(editingTeacher.id, formData);
        if (res.success) {
          showFeedback('শিক্ষকের তথ্য সফলভাবে আপডেট করা হয়েছে!');
          setShowAddEditModal(false);
          fetchTeachers();
        }
      } else {
        const res = await teacherAPI.create(formData);
        if (res.success) {
          showFeedback('নতুন শিক্ষক সফলভাবে যুক্ত করা হয়েছে!');
          setShowAddEditModal(false);
          fetchTeachers();
        }
      }
    } catch (err) {
      console.error('Submit teacher error:', err);
      showFeedback(err.message || 'শিক্ষক সংরক্ষণ ব্যর্থ হয়েছে', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingTeacher) return;
    setSubmitting(true);
    try {
      const res = await teacherAPI.delete(deletingTeacher.id);
      if (res.success) {
        showFeedback('শিক্ষক প্রোফাইল সফলভাবে মুছে ফেলা হয়েছে!');
        setShowDeleteModal(false);
        setDeletingTeacher(null);
        fetchTeachers();
      }
    } catch (err) {
      console.error('Delete teacher error:', err);
      showFeedback(err.message || 'শিক্ষক মুছে ফেলা ব্যর্থ হয়েছে', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Toast Feedback */}
      {toast && (
        <div
          className={`p-4 rounded-2xl border text-xs font-bold flex items-center space-x-2.5 shadow-lg ${
            toast.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
          )}
          <span>{toast.msg}</span>
        </div>
      )}

      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-slate-700/60">
        <div className="absolute right-0 top-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold">
              <Users className="w-3.5 h-3.5" />
              <span>{lang === 'bn' ? 'শিক্ষক পরিষদ ও ফ্যাকাল্টি হাব' : 'Faculty Management Hub'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white">
              {lang === 'bn' ? 'শিক্ষক ও ফ্যাকাল্টি পরিচালনা' : 'Teacher & Faculty Management'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl font-medium">
              সম্মানিত শিক্ষকদের প্রোফাইল, বিষয়ভিত্তিক বিশেষজ্ঞতা, পদবি, যোগাযোগ ও অফিস কনসাল্টেশন সময় পরিচালনা করুন
            </p>
          </div>

          <button
            onClick={handleOpenAdd}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-black text-xs shadow-lg shadow-indigo-600/30 flex items-center space-x-2 transition-all transform active:scale-95"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ নতুন শিক্ষক নিয়োগ</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center space-x-3.5">
          <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-500">মোট শিক্ষক</div>
            <div className="text-xl font-black text-slate-900">{teachers.length} জন</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center space-x-3.5">
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-500">বিশেষায়িত বিষয়</div>
            <div className="text-xl font-black text-emerald-600">{specializations.length} টি</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center space-x-3.5">
          <div className="p-3 rounded-xl bg-purple-50 text-purple-600">
            <Phone className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-500">ফোন দৃশ্যমান</div>
            <div className="text-xl font-black text-purple-600">
              {teachers.filter((t) => t.is_phone_visible !== false).length} জন
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center space-x-3.5">
          <div className="p-3 rounded-xl bg-amber-50 text-amber-600">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-500">সক্রিয় ফ্যাকাল্টি</div>
            <div className="text-xl font-black text-amber-600">
              {teachers.filter((t) => t.isActive !== false).length} জন
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3.5 items-center">
          <div className="lg:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="শিক্ষকের নাম, বিষয়, পদবি বা ফোন নম্বর খুঁজুন..."
              className="w-full pl-9 pr-4 py-2.5 text-xs font-medium rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>

          <div className="lg:col-span-6">
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full py-2.5 px-3 text-xs font-bold rounded-2xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">সকল বিষয় ও বিভাগ (All Departments)</option>
              {specializations.map((subj) => (
                <option key={subj} value={subj}>
                  {subj}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs font-medium text-slate-500 pt-2 border-t border-slate-100">
          <div>
            মোট শিক্ষক: <span className="font-bold text-slate-900">{filteredTeachers.length}</span> জন
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('cards')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                viewMode === 'cards' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              কার্ড ভিউ
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                viewMode === 'table' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              টেবিল ভিউ
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      {loading ? (
        <div className="p-12 text-center text-slate-500 space-y-3 bg-white rounded-3xl border border-slate-200">
          <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
          <p className="text-xs font-bold">শিক্ষক ডাটাবেজ লোড হচ্ছে...</p>
        </div>
      ) : filteredTeachers.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto border border-indigo-100">
            <Users className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-black text-slate-800">কোনো শিক্ষক পাওয়া যায়নি</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              ডাটাবেজে বর্তমানে কোনো শিক্ষকের প্রোফাইল নেই। নতুন শিক্ষক যুক্ত করতে নিচের বাটনে ক্লিক করুন।
            </p>
          </div>
          <button
            type="button"
            onClick={handleOpenAdd}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all inline-flex items-center space-x-1.5"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ নতুন শিক্ষক যুক্ত করুন</span>
          </button>
        </div>
      ) : viewMode === 'cards' ? (
        /* CARDS VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeachers.map((t) => (
            <div
              key={t.id}
              className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-5"
            >
              <div className="space-y-4">
                {/* Avatar & Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3.5">
                    <div className="w-13 h-13 rounded-2xl bg-indigo-50 text-indigo-700 font-black flex items-center justify-center border border-indigo-100 overflow-hidden flex-shrink-0 text-lg">
                      {t.avatar ? (
                        <img src={t.avatar} alt={t.name} className="w-full h-full object-cover" />
                      ) : (
                        <span>{t.name?.slice(0, 1) || 'শ'}</span>
                      )}
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900 text-sm leading-tight">{t.name}</h4>
                      <p className="text-xs text-indigo-600 font-bold mt-0.5">{t.designation}</p>
                    </div>
                  </div>

                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-black">
                    {t.specialization?.split(' ')[0] || 'ফ্যাকাল্টি'}
                  </span>
                </div>

                {/* Details Box */}
                <div className="p-3.5 rounded-2xl bg-slate-50 space-y-2 text-xs">
                  <div className="flex items-center space-x-2 text-slate-700">
                    <BookOpen className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span className="truncate font-medium">{t.specialization}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-slate-700">
                    <Award className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span className="truncate text-[11px] text-slate-600">{t.qualifications}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-slate-700">
                    <Phone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span className="font-mono text-[11px] font-bold text-slate-800">
                      {t.phone || t.mobile_number || 'গোপন রাখা হয়েছে'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-slate-700">
                    <Mail className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span className="truncate font-mono text-[11px] text-slate-600">{t.email || t.contact_email}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-slate-700">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span className="truncate text-[11px] text-slate-600">{t.roomNo}</span>
                  </div>
                </div>

                {/* Bio snippet */}
                {t.bio && (
                  <p className="text-[11px] text-slate-500 italic line-clamp-2 leading-relaxed">
                    "{t.bio}"
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <div className="flex items-center space-x-2">
                  {t.phone && (
                    <a
                      href={`tel:${t.phone}`}
                      className="p-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                      title="কল করুন"
                    >
                      <Phone className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {t.email && (
                    <a
                      href={`mailto:${t.email}`}
                      className="p-2 rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                      title="ইমেইল পাঠান"
                    >
                      <Mail className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>

                <div className="flex items-center space-x-1.5">
                  <button
                    onClick={() => handleOpenEdit(t)}
                    className="p-2 rounded-xl bg-amber-50 text-amber-700 hover:bg-amber-100 font-bold text-xs flex items-center space-x-1"
                    title="এডিট"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>এডিট</span>
                  </button>
                  <button
                    onClick={() => {
                      setDeletingTeacher(t);
                      setShowDeleteModal(true);
                    }}
                    className="p-2 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100"
                    title="ডিলিট"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">শিক্ষক ও পদবি</th>
                  <th className="py-3.5 px-4">বিষয় ও যোগ্যতা</th>
                  <th className="py-3.5 px-4">যোগাযোগ (ফোন ও ইমেইল)</th>
                  <th className="py-3.5 px-4">রুম ও সময়সূচি</th>
                  <th className="py-3.5 px-4 text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTeachers.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-700 font-black flex items-center justify-center overflow-hidden flex-shrink-0">
                          {t.avatar ? (
                            <img src={t.avatar} alt={t.name} className="w-full h-full object-cover" />
                          ) : (
                            <span>{t.name?.slice(0, 1) || 'শ'}</span>
                          )}
                        </div>
                        <div>
                          <div className="font-black text-slate-900">{t.name}</div>
                          <div className="text-[10px] text-indigo-600 font-bold">{t.designation}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-800">{t.specialization}</div>
                      <div className="text-[10px] text-slate-500">{t.qualifications}</div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-mono text-slate-800 font-bold">
                        {t.phone || t.mobile_number || 'গোপন'}
                      </div>
                      <div className="text-[10px] font-mono text-slate-400">{t.email || t.contact_email}</div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="text-slate-700">{t.roomNo}</div>
                      <div className="text-[10px] text-slate-500">{t.officeHours}</div>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center space-x-1.5">
                        <button
                          onClick={() => handleOpenEdit(t)}
                          className="p-1.5 rounded-xl bg-amber-50 text-amber-700 hover:bg-amber-100"
                          title="এডিট"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            setDeletingTeacher(t);
                            setShowDeleteModal(true);
                          }}
                          className="p-1.5 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100"
                          title="ডিলিট"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Add or Edit Teacher */}
      {showAddEditModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
                <Users className="w-5 h-5 text-indigo-600" />
                <span>{editingTeacher ? 'শিক্ষক তথ্য সম্পাদন (Edit Teacher)' : 'নতুন শিক্ষক নিয়োগ (Faculty Appointment)'}</span>
              </h3>
              <button
                onClick={() => setShowAddEditModal(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">শিক্ষকের পুরো নাম *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="যেমন: ড. মোঃ রফিকুল ইসলাম"
                    required
                    className="w-full text-xs font-medium rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">পদবি (Designation) *</label>
                  <input
                    type="text"
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    placeholder="সিনিয়র প্রভাষক / সহকারী শিক্ষক"
                    required
                    className="w-full text-xs font-medium rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">বিশেষায়িত বিষয় / বিভাগ *</label>
                  <input
                    type="text"
                    value={formData.specialization}
                    onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                    placeholder="উচ্চতর গণিত ও পদার্থবিজ্ঞান"
                    required
                    className="w-full text-xs font-medium rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">মোবাইল নম্বর *</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="01712345678"
                    required
                    className="w-full text-xs font-medium rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">ইমেইল অ্যাড্রেস</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="teacher@nextgen.edu.bd"
                    className="w-full text-xs font-medium rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {!editingTeacher && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">লগইন পাসওয়ার্ড (ডিফল্ট: teacher123)</label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="••••••••"
                      className="w-full text-xs font-medium rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                )}

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">শিক্ষাগত যোগ্যতা (Educational Background)</label>
                  <input
                    type="text"
                    value={formData.qualifications}
                    onChange={(e) => setFormData({ ...formData, qualifications: e.target.value })}
                    placeholder="বি.এসসি (অনার্স), এম.এসসি - ঢাকা বিশ্ববিদ্যালয়"
                    className="w-full text-xs font-medium rounded-xl border border-slate-300 p-2.5"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">শিক্ষক মিলনায়তন / রুম নং</label>
                  <input
                    type="text"
                    value={formData.roomNo}
                    onChange={(e) => setFormData({ ...formData, roomNo: e.target.value })}
                    placeholder="শিক্ষক মিলনায়তন (কক্ষ ২০৪)"
                    className="w-full text-xs font-medium rounded-xl border border-slate-300 p-2.5"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">কনসাল্টেশন সময়সূচি</label>
                  <input
                    type="text"
                    value={formData.officeHours}
                    onChange={(e) => setFormData({ ...formData, officeHours: e.target.value })}
                    placeholder="রবি - বৃহঃ সকাল ৯:৩০ - বিকাল ৩:৩০"
                    className="w-full text-xs font-medium rounded-xl border border-slate-300 p-2.5"
                  />
                </div>

                <div className="sm:col-span-2 p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <UniversalFileUploader
                    label="শিক্ষকের ছবি / প্রোফাইল ফটো (Teacher Photo)"
                    value={formData.photo}
                    previewType="image"
                    accept="image/*"
                    maxMb={10}
                    helperText="JPG, PNG, WebP অথবা গুগল ড্রাইভ/ওয়েব লিঙ্ক"
                    onChange={({ fileUrl, url }) => {
                      setFormData(prev => ({ ...prev, photo: fileUrl || url || '' }));
                    }}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">সংক্ষিপ্ত পরিচিতি ও বায়ো (Bio)</label>
                  <textarea
                    rows={2}
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="নেক্সটজেন একাডেমির অভিজ্ঞ ও নিবেদিতপ্রাণ শিক্ষক..."
                    className="w-full text-xs font-medium rounded-xl border border-slate-300 p-2.5"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_phone_visible}
                    onChange={(e) => setFormData({ ...formData, is_phone_visible: e.target.checked })}
                    className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                  />
                  <span className="text-xs font-bold text-slate-700">ফোন নম্বর ডিরেক্টরিতে দৃশ্যমান রাখুন</span>
                </label>

                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowAddEditModal(false)}
                    className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold text-xs"
                  >
                    বাতিল
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md disabled:opacity-50"
                  >
                    {submitting ? 'সংরক্ষণ হচ্ছে...' : editingTeacher ? 'আপডেট করুন' : 'নিয়োগ নিশ্চিত করুন'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Delete Teacher Confirmation */}
      {showDeleteModal && deletingTeacher && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center space-x-3 text-rose-600">
              <div className="p-2.5 rounded-2xl bg-rose-50 border border-rose-200">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-slate-900">শিক্ষক ডিলিট নিশ্চিতকরণ</h3>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              আপনি কি নিশ্চিতভাবে <span className="font-bold text-slate-900">'{deletingTeacher.name}'</span>{' '}
              ({deletingTeacher.designation}, {deletingTeacher.specialization}) এর প্রোফাইল ও অ্যাকাউন্ট মুছে ফেলতে চান?
            </p>

            <div className="p-3 bg-rose-50 rounded-2xl border border-rose-200 text-[11px] text-rose-700 font-medium">
              ⚠️ সতর্কবার্তা: শিক্ষকের অ্যাসাইনকৃত ক্লাস রুটিন ও পরীক্ষার দায়িত্ব বিলুপ্ত হতে পারে।
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold text-xs"
              >
                বাতিল
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={submitting}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md disabled:opacity-50"
              >
                {submitting ? 'মুছে ফেলা হচ্ছে...' : 'হ্যাঁ, মুছে ফেলুন'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
