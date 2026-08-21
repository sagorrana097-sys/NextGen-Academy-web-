import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { teacherAPI } from '../../services/api';
import {
  Users,
  Search,
  Phone,
  MessageSquare,
  Mail,
  Clock,
  MapPin,
  GraduationCap,
  BookOpen,
  Award,
  Check,
  Copy,
  ExternalLink,
  ShieldAlert,
  Send,
  X,
  Sparkles,
  Info,
  ChevronRight,
  Filter
} from 'lucide-react';

export default function TeacherDirectory({ role = 'PARENT' }) {
  const { t, lang } = useLanguage();
  const { user } = useAuth();

  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('ALL');
  const [selectedTeacherModal, setSelectedTeacherModal] = useState(null);
  const [copiedPhoneId, setCopiedPhoneId] = useState(null);
  const [contactRequestModal, setContactRequestModal] = useState(null);
  const [requestMessage, setRequestMessage] = useState('');
  const [requestSent, setRequestSent] = useState(false);

  useEffect(() => {
    loadTeachers();
  }, []);

  const loadTeachers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await teacherAPI.getDirectory();
      if (res.success && Array.isArray(res.data)) {
        setTeachers(res.data);
      } else {
        setTeachers([]);
      }
    } catch (err) {
      console.error('Failed to load teacher directory:', err);
      setError(err.message || 'শিক্ষক তালিকা লোড করতে ব্যর্থ হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyPhone = (id, phone) => {
    if (!phone) return;
    navigator.clipboard.writeText(phone);
    setCopiedPhoneId(id);
    setTimeout(() => {
      setCopiedPhoneId(null);
    }, 2000);
  };

  const handleSendContactRequest = (e) => {
    e.preventDefault();
    setRequestSent(true);
    setTimeout(() => {
      setRequestSent(false);
      setContactRequestModal(null);
      setRequestMessage('');
    }, 2200);
  };

  // Derive department list from teachers
  const departments = [
    { id: 'ALL', labelBn: 'সকল বিষয় / বিভাগ', labelEn: 'All Subjects' },
    { id: 'Math', labelBn: 'গণিত (Mathematics)', labelEn: 'Mathematics' },
    { id: 'Physics', labelBn: 'পদার্থবিজ্ঞান ও বিজ্ঞান', labelEn: 'Physics & Science' },
    { id: 'ICT', labelBn: 'আইসিটি ও কম্পিউটার', labelEn: 'ICT & Computer' },
    { id: 'English', labelBn: 'ইংরেজি (English)', labelEn: 'English' },
    { id: 'Biology', labelBn: 'জীববিজ্ঞান ও রসায়ন', labelEn: 'Biology & Chemistry' },
    { id: 'Bangla', labelBn: 'বাংলা সাহিত্য', labelEn: 'Bangla Literature' },
    { id: 'Islamic', labelBn: 'ইসলাম ও নৈতিক শিক্ষা', labelEn: 'Islamic Studies' },
    { id: 'Business', labelBn: 'ব্যবসায় শিক্ষা ও হিসাববিজ্ঞান', labelEn: 'Business & Accounting' }
  ];

  // Filtering Logic
  const filteredTeachers = teachers.filter((teacher) => {
    // Search query filter
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      teacher.name.toLowerCase().includes(q) ||
      teacher.designation.toLowerCase().includes(q) ||
      teacher.specialization.toLowerCase().includes(q) ||
      teacher.qualifications.toLowerCase().includes(q) ||
      (teacher.phone && teacher.phone.toLowerCase().includes(q)) ||
      (teacher.email && teacher.email.toLowerCase().includes(q)) ||
      (teacher.roomNo && teacher.roomNo.toLowerCase().includes(q)) ||
      (Array.isArray(teacher.assignments) &&
        teacher.assignments.some(
          (a) =>
            a.subjectNameBn.toLowerCase().includes(q) ||
            a.subjectNameEn.toLowerCase().includes(q) ||
            a.classNameBn.toLowerCase().includes(q)
        ));

    // Department filter
    if (selectedDepartment === 'ALL') return matchesSearch;

    const depKey = selectedDepartment.toLowerCase();
    const matchesDep =
      teacher.specialization.toLowerCase().includes(depKey) ||
      teacher.designation.toLowerCase().includes(depKey) ||
      (Array.isArray(teacher.assignments) &&
        teacher.assignments.some((a) =>
          a.subjectNameEn.toLowerCase().includes(depKey) ||
          a.subjectNameBn.toLowerCase().includes(depKey)
        ));

    return matchesSearch && matchesDep;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-slate-700/50">
        <div className="absolute right-0 top-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-10 -bottom-10 w-60 h-60 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold">
              <Users className="w-3.5 h-3.5" />
              <span>{lang === 'bn' ? 'অফিসিয়াল শিক্ষক তালিকা' : 'Official Faculty Directory'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight">
              {t('teacherDirectoryTitle')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl font-medium leading-relaxed">
              {t('teacherDirectorySubtitle')}
            </p>
          </div>

          <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/10 self-start md:self-auto">
            <GraduationCap className="w-8 h-8 text-emerald-400" />
            <div>
              <p className="text-xs text-slate-300">{lang === 'bn' ? 'মোট অনুষদ শিক্ষক' : 'Total Faculty'}</p>
              <p className="text-lg font-black text-white">{teachers.length} {lang === 'bn' ? 'জন' : 'Teachers'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('searchTeachersPlaceholder')}
              className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm font-medium rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 p-0.5 rounded-full hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Teacher count pill */}
          <div className="flex items-center px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 whitespace-nowrap">
            <span>
              {lang === 'bn' ? `প্রদর্শিত: ${filteredTeachers.length} জন` : `Showing: ${filteredTeachers.length} Teachers`}
            </span>
          </div>
        </div>

        {/* Department Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
          <div className="flex items-center text-slate-400 font-semibold space-x-1 pr-1 flex-shrink-0">
            <Filter className="w-3.5 h-3.5" />
            <span>{lang === 'bn' ? 'বিভাগ:' : 'Dept:'}</span>
          </div>
          {departments.map((dept) => {
            const isSelected = selectedDepartment === dept.id;
            return (
              <button
                key={dept.id}
                onClick={() => setSelectedDepartment(dept.id)}
                className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all flex-shrink-0 ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
                }`}
              >
                {lang === 'bn' ? dept.labelBn : dept.labelEn}
              </button>
            );
          })}
        </div>
      </div>

      {/* Teacher Cards Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[300px] bg-white rounded-3xl border border-slate-200 p-8">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-xs font-bold text-slate-500">{lang === 'bn' ? 'শিক্ষক তালিকা লোড হচ্ছে...' : 'Loading teacher directory...'}</p>
        </div>
      ) : error ? (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-center text-rose-700">
          <ShieldAlert className="w-8 h-8 mx-auto text-rose-500 mb-2" />
          <p className="font-bold text-sm">{error}</p>
          <button
            onClick={loadTeachers}
            className="mt-3 px-4 py-2 bg-rose-600 text-white text-xs font-bold rounded-xl shadow hover:bg-rose-700 transition-all"
          >
            {lang === 'bn' ? 'পুনরায় চেষ্টা করুন' : 'Retry'}
          </button>
        </div>
      ) : filteredTeachers.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-500 space-y-3">
          <Users className="w-12 h-12 mx-auto text-slate-300" />
          <p className="font-bold text-base text-slate-700">
            {lang === 'bn' ? 'কোনো শিক্ষক পাওয়া যায়নি' : 'No teachers found'}
          </p>
          <p className="text-xs text-slate-400">
            {lang === 'bn' ? 'অনুগ্রহ করে ভিন্ন কোনো নাম বা বিষয় দিয়ে পুনরায় খুঁজুন।' : 'Try searching with a different name or subject.'}
          </p>
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedDepartment('ALL');
              }}
              className="px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold hover:bg-emerald-100 transition-all"
            >
              {lang === 'bn' ? 'ফিল্টার রিসেট করুন' : 'Reset Filters'}
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTeachers.map((teacher) => {
            const isCopied = copiedPhoneId === teacher.id;
            return (
              <div
                key={teacher.id}
                className="bg-white rounded-3xl border border-slate-200 hover:border-emerald-500/40 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group"
              >
                {/* Card Top / Header */}
                <div className="p-5 space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    {/* Avatar with gradient border */}
                    <div className="relative flex-shrink-0">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-emerald-600 via-teal-700 to-slate-900 text-white font-black text-xl flex items-center justify-center shadow-md shadow-emerald-700/20 ring-2 ring-emerald-400/30">
                        {teacher.name.charAt(0)}
                      </div>
                      <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" title="Active Faculty"></span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 truncate group-hover:text-emerald-700 transition-colors">
                        {teacher.name}
                      </h3>
                      <p className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200/70 px-2 py-0.5 rounded-md inline-block mt-1">
                        {teacher.specialization}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                        {teacher.designation}
                      </p>
                    </div>
                  </div>

                  {/* Qualifications & Room */}
                  <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <div className="flex items-center space-x-2">
                      <GraduationCap className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
                      <span className="text-[11px] font-medium truncate text-slate-700" title={teacher.qualifications}>
                        {teacher.qualifications}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />
                      <span className="text-[11px] font-medium text-slate-600 truncate">
                        {teacher.roomNo}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                      <span className="text-[11px] font-medium text-slate-600 truncate">
                        {teacher.officeHours}
                      </span>
                    </div>
                  </div>

                  {/* Assigned Classes badges */}
                  {Array.isArray(teacher.assignments) && teacher.assignments.length > 0 && (
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block mb-1.5">
                        {t('assignedClasses')}
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {teacher.assignments.slice(0, 3).map((a, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 text-[10px] font-semibold border border-slate-200"
                          >
                            <BookOpen className="w-2.5 h-2.5 text-emerald-600" />
                            <span>{a.classNameBn} ({a.subjectNameBn})</span>
                          </span>
                        ))}
                        {teacher.assignments.length > 3 && (
                          <span className="px-1.5 py-0.5 rounded-md bg-slate-200 text-slate-600 text-[10px] font-bold">
                            +{teacher.assignments.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Bottom / Action Buttons */}
                <div className="p-4 bg-slate-50/80 border-t border-slate-100 space-y-2.5">
                  {/* Phone & Email Display */}
                  {teacher.phone ? (
                    <div className="flex items-center justify-between bg-white px-3 py-2 rounded-xl border border-slate-200 text-xs">
                      <div className="flex items-center space-x-2 overflow-hidden">
                        <Phone className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                        <span className="font-mono font-bold text-slate-800 tracking-wider truncate">
                          {teacher.phone}
                        </span>
                      </div>
                      <button
                        onClick={() => handleCopyPhone(teacher.id, teacher.phone)}
                        className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors flex-shrink-0"
                        title={lang === 'bn' ? 'নম্বর কপি করুন' : 'Copy number'}
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  ) : (
                    <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-medium flex items-center space-x-2">
                      <Info className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                      <span>{t('phoneHiddenPrivate')}</span>
                    </div>
                  )}

                  {/* Action Buttons Grid */}
                  <div className="grid grid-cols-3 gap-1.5">
                    {/* Call Button */}
                    {teacher.phone ? (
                      <a
                        href={teacher.callUrl || `tel:${teacher.phone}`}
                        className="flex items-center justify-center space-x-1 py-2 px-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all text-center"
                        title={t('callNow')}
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>{t('callNow')}</span>
                      </a>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setContactRequestModal(teacher)}
                        className="flex items-center justify-center space-x-1 py-2 px-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold transition-all text-center"
                        title={t('requestContact')}
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span className="truncate">{lang === 'bn' ? 'অনুরোধ' : 'Request'}</span>
                      </button>
                    )}

                    {/* WhatsApp Button */}
                    {teacher.phone ? (
                      <a
                        href={teacher.whatsappUrl || `https://wa.me/${teacher.phone}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-center space-x-1 py-2 px-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-md shadow-teal-600/20 transition-all text-center"
                        title={t('sendWhatsApp')}
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>{lang === 'bn' ? 'হোয়াটসঅ্যাপ' : 'WhatsApp'}</span>
                      </a>
                    ) : (
                      <a
                        href={`mailto:${teacher.email}`}
                        className="flex items-center justify-center space-x-1 py-2 px-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 transition-all text-center"
                        title={t('sendEmail')}
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>{lang === 'bn' ? 'ইমেইল' : 'Email'}</span>
                      </a>
                    )}

                    {/* SMS / Details Button */}
                    {teacher.phone ? (
                      <a
                        href={teacher.smsUrl || `sms:${teacher.phone}`}
                        className="flex items-center justify-center space-x-1 py-2 px-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold shadow-md shadow-slate-800/20 transition-all text-center"
                        title={t('sendSMS')}
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{lang === 'bn' ? 'এসএমএস' : 'SMS'}</span>
                      </a>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setSelectedTeacherModal(teacher)}
                        className="flex items-center justify-center space-x-1 py-2 px-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold shadow-md shadow-slate-800/20 transition-all text-center"
                      >
                        <Info className="w-3.5 h-3.5" />
                        <span>{lang === 'bn' ? 'বিস্তারিত' : 'Profile'}</span>
                      </button>
                    )}
                  </div>

                  {/* View Details Profile link */}
                  <button
                    onClick={() => setSelectedTeacherModal(teacher)}
                    className="w-full py-1.5 text-center text-[11px] font-bold text-slate-500 hover:text-emerald-700 hover:bg-white rounded-lg transition-all flex items-center justify-center space-x-1 border border-transparent hover:border-slate-200"
                  >
                    <span>{lang === 'bn' ? 'সম্পূর্ণ প্রোফাইল ও সময়সূচি দেখুন' : 'View Full Profile & Schedule'}</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* FULL TEACHER PROFILE MODAL */}
      {selectedTeacherModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 p-6 text-white flex items-start justify-between relative">
              <div className="flex items-center space-x-3.5">
                <div className="w-14 h-14 rounded-2xl bg-slate-900 border-2 border-emerald-400 p-0.5 text-white flex items-center justify-center font-black text-xl shadow-lg">
                  {selectedTeacherModal.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-white leading-tight">
                    {selectedTeacherModal.name}
                  </h3>
                  <p className="text-xs text-emerald-300 font-semibold mt-0.5">
                    {selectedTeacherModal.designation}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {selectedTeacherModal.specialization}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedTeacherModal(null)}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              {/* Bio & Intro */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <p className="text-slate-700 leading-relaxed font-medium">
                  {selectedTeacherModal.bio}
                </p>
              </div>

              {/* Information Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-xl border border-slate-100 bg-slate-50/50">
                  <span className="text-slate-400 font-semibold block text-[10px] uppercase tracking-wider">{t('qualifications')}</span>
                  <p className="font-bold text-slate-800 mt-0.5">{selectedTeacherModal.qualifications}</p>
                </div>
                <div className="p-3 rounded-xl border border-slate-100 bg-slate-50/50">
                  <span className="text-slate-400 font-semibold block text-[10px] uppercase tracking-wider">{t('officeRoom')}</span>
                  <p className="font-bold text-slate-800 mt-0.5">{selectedTeacherModal.roomNo}</p>
                </div>
                <div className="p-3 rounded-xl border border-slate-100 bg-slate-50/50">
                  <span className="text-slate-400 font-semibold block text-[10px] uppercase tracking-wider">{t('officeHours')}</span>
                  <p className="font-bold text-slate-800 mt-0.5">{selectedTeacherModal.officeHours}</p>
                </div>
                <div className="p-3 rounded-xl border border-slate-100 bg-slate-50/50">
                  <span className="text-slate-400 font-semibold block text-[10px] uppercase tracking-wider">{lang === 'bn' ? 'অফিসিয়াল ইমেইল' : 'Official Email'}</span>
                  <p className="font-bold text-slate-800 mt-0.5 truncate">{selectedTeacherModal.email}</p>
                </div>
              </div>

              {/* Assigned Classes */}
              {Array.isArray(selectedTeacherModal.assignments) && selectedTeacherModal.assignments.length > 0 && (
                <div>
                  <h4 className="font-bold text-slate-800 mb-2">{t('assignedClasses')}</h4>
                  <div className="space-y-1.5">
                    {selectedTeacherModal.assignments.map((a, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-xl border border-slate-100 bg-white shadow-xs flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center space-x-2">
                          <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="font-bold text-slate-800">{a.classNameBn}</span>
                          {a.sectionNameBn && (
                            <span className="text-slate-500">({a.sectionNameBn})</span>
                          )}
                        </div>
                        <div className="flex items-center space-x-1.5">
                          <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 font-semibold text-[11px]">
                            {a.subjectNameBn}
                          </span>
                          {a.isClassTeacher && (
                            <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 font-bold text-[10px]">
                              {t('classTeacherBadge')}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Direct Actions in Modal */}
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <h4 className="font-bold text-slate-800">{lang === 'bn' ? 'সরাসরি যোগাযোগ মাধ্যম' : 'Direct Contact Channels'}</h4>
                {selectedTeacherModal.phone ? (
                  <div className="grid grid-cols-3 gap-2">
                    <a
                      href={selectedTeacherModal.callUrl || `tel:${selectedTeacherModal.phone}`}
                      className="py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center space-x-1.5 shadow-md shadow-emerald-600/20"
                    >
                      <Phone className="w-4 h-4" />
                      <span>{t('callNow')}</span>
                    </a>
                    <a
                      href={selectedTeacherModal.whatsappUrl || `https://wa.me/${selectedTeacherModal.phone}`}
                      target="_blank"
                      rel="noreferrer"
                      className="py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center justify-center space-x-1.5 shadow-md shadow-teal-600/20"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>{lang === 'bn' ? 'হোয়াটসঅ্যাপ' : 'WhatsApp'}</span>
                    </a>
                    <a
                      href={selectedTeacherModal.smsUrl || `sms:${selectedTeacherModal.phone}`}
                      className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs flex items-center justify-center space-x-1.5 shadow-md"
                    >
                      <Send className="w-4 h-4" />
                      <span>{lang === 'bn' ? 'এসএমএস' : 'SMS'}</span>
                    </a>
                  </div>
                ) : (
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-800 text-xs space-y-2">
                    <p className="font-semibold">{t('phoneHiddenPrivate')}</p>
                    <a
                      href={`mailto:${selectedTeacherModal.email}`}
                      className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white font-bold text-xs hover:bg-blue-700"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>{t('sendEmail')} ({selectedTeacherModal.email})</span>
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedTeacherModal(null)}
                className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs transition-colors"
              >
                {t('cancel')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONTACT REQUEST MODAL (FOR HIDDEN NUMBERS) */}
      {contactRequestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-xl bg-amber-100 text-amber-700">
                  <Send className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">{t('requestContact')}</h3>
                  <p className="text-[11px] text-slate-500">{contactRequestModal.name}</p>
                </div>
              </div>
              <button
                onClick={() => setContactRequestModal(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {requestSent ? (
              <div className="py-6 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-sm text-slate-900">
                  {lang === 'bn' ? 'অনুরোধ সফলভাবে পাঠানো হয়েছে!' : 'Request Sent Successfully!'}
                </h4>
                <p className="text-xs text-slate-500">
                  {lang === 'bn' ? 'শিক্ষক আপনার বার্তাটি পোর্টালে পাবেন এবং আপনার সাথে যোগাযোগ করবেন।' : 'The teacher will receive your message and contact you.'}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendContactRequest} className="space-y-3">
                <p className="text-xs text-slate-600">
                  {lang === 'bn'
                    ? 'শিক্ষকের ব্যক্তিগত নম্বরের গোপনীয়তার কারণে পোর্টাল নোটিফিকেশনের মাধ্যমে সরাসরি বার্তা বা কল অনুরোধ পাঠানো যাবে।'
                    : 'Send a direct contact request or message to the faculty member.'}
                </p>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {lang === 'bn' ? 'আপনার বার্তা / যোগাযোগের কারণ:' : 'Your Message / Purpose:'}
                  </label>
                  <textarea
                    rows="3"
                    value={requestMessage}
                    onChange={(e) => setRequestMessage(e.target.value)}
                    required
                    placeholder={lang === 'bn' ? 'যেমন: শিক্ষার্থীর বাড়ির কাজ বা পরীক্ষার বিষয়ে আলোচনা করতে চাই...' : 'Write your reason here...'}
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="flex items-center justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setContactRequestModal(null)}
                    className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200"
                  >
                    {t('cancel')}
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center space-x-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{lang === 'bn' ? 'অনুরোধ পাঠান' : 'Send Request'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
