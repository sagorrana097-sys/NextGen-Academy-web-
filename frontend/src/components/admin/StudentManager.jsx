import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { studentAPI, curriculumAPI, batchAPI } from '../../services/api';
import Student360Modal from '../common/Student360Modal';
import PrintableStudentIdCardModal from '../common/PrintableStudentIdCardModal';
import BatchStudentIdCardModal from '../common/BatchStudentIdCardModal';
import UniversalFileUploader from '../common/UniversalFileUploader';
import { exportStudentsToCSV } from '../../utils/exportUtils';
import {
  GraduationCap,
  Users,
  Search,
  Filter,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Printer,
  CheckCircle2,
  AlertCircle,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Layers,
  Award,
  ToggleLeft,
  ToggleRight,
  Sparkles,
  X,
  Save,
  Check,
  UserCheck,
  UserX,
  UserPlus,
  RefreshCw,
  Upload,
  Camera,
  Image as ImageIcon,
  FileSpreadsheet
} from 'lucide-react';

const defaultClassesList = [
  { id: 1, nameBn: 'প্লে গ্রুপ (Play)', nameEn: 'Play Group', numericGrade: -2, stage: 'PRE_PRIMARY' },
  { id: 2, nameBn: 'নার্সারি (Nursery)', nameEn: 'Nursery', numericGrade: -1, stage: 'PRE_PRIMARY' },
  { id: 3, nameBn: 'কেজি (KG)', nameEn: 'Kindergarten (KG)', numericGrade: 0, stage: 'PRE_PRIMARY' },
  { id: 4, nameBn: '১ম শ্রেণি (Class 1)', nameEn: 'Class 1', numericGrade: 1, stage: 'PRIMARY' },
  { id: 5, nameBn: '২য় শ্রেণি (Class 2)', nameEn: 'Class 2', numericGrade: 2, stage: 'PRIMARY' },
  { id: 6, nameBn: '৩য় শ্রেণি (Class 3)', nameEn: 'Class 3', numericGrade: 3, stage: 'PRIMARY' },
  { id: 7, nameBn: '৪র্থ শ্রেণি (Class 4)', nameEn: 'Class 4', numericGrade: 4, stage: 'PRIMARY' },
  { id: 8, nameBn: '৫ম শ্রেণি (Class 5)', nameEn: 'Class 5', numericGrade: 5, stage: 'PRIMARY' },
  { id: 9, nameBn: '৬ষ্ঠ শ্রেণি (Class 6)', nameEn: 'Class 6', numericGrade: 6, stage: 'JUNIOR_SECONDARY' },
  { id: 10, nameBn: '৭ম শ্রেণি (Class 7)', nameEn: 'Class 7', numericGrade: 7, stage: 'JUNIOR_SECONDARY' },
  { id: 11, nameBn: '৮ম শ্রেণি (Class 8)', nameEn: 'Class 8', numericGrade: 8, stage: 'JUNIOR_SECONDARY' },
  { id: 12, nameBn: '৯ম শ্রেণি (Class 9 - SSC)', nameEn: 'Class 9', numericGrade: 9, stage: 'SECONDARY' },
  { id: 13, nameBn: '১০ম শ্রেণি (Class 10 - SSC)', nameEn: 'Class 10', numericGrade: 10, stage: 'SECONDARY' },
  { id: 14, nameBn: 'একাদশ শ্রেণি (Class 11 - HSC)', nameEn: 'Class 11', numericGrade: 11, stage: 'HIGHER_SECONDARY' },
  { id: 15, nameBn: 'দ্বাদশ শ্রেণি (Class 12 - HSC)', nameEn: 'Class 12', numericGrade: 12, stage: 'HIGHER_SECONDARY' }
];

export default function StudentManager() {
  const { t, lang } = useLanguage();

  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState(defaultClassesList);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [search, setSearch] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL' | 'ACTIVE' | 'INACTIVE'
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'cards'

  // Modals
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingStudent, setDeletingStudent] = useState(null);
  const [selectedStudentFor360, setSelectedStudentFor360] = useState(null);
  const [selectedStudentForIdCard, setSelectedStudentForIdCard] = useState(null);
  const [showBatchIdCardModal, setShowBatchIdCardModal] = useState(false);

  // Toast feedback
  const [toast, setToast] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const initialFormState = {
    name: '',
    nameBn: '',
    rollNo: '',
    classId: '1',
    sectionId: '1',
    batchId: '',
    guardianName: '',
    guardianPhone: '',
    bloodGroup: 'B+',
    dob: '2014-01-01',
    gender: 'MALE',
    photo: '',
    address: 'ঢাকা, বাংলাদেশ',
    admissionDate: new Date().toISOString().split('T')[0],
    isActive: true
  };
  const [formData, setFormData] = useState(initialFormState);

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

  useEffect(() => {
    fetchData();
  }, []);

  const showFeedback = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [stRes, clsRes, bRes] = await Promise.all([
        studentAPI.getAll(),
        curriculumAPI.getClasses(),
        batchAPI.getBatches()
      ]);

      if (stRes.success && stRes.data) setStudents(stRes.data);
      if (clsRes.success && clsRes.data && clsRes.data.length > 0) {
        setClasses(clsRes.data);
      }
      if (bRes.success && bRes.data) setBatches(bRes.data);
    } catch (err) {
      console.error('Error fetching student manager data:', err);
      showFeedback('শিক্ষার্থী ডাটাবেজ লোড করতে সমস্যা হয়েছে', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Student Photo Upload to Base64/DataURL
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showFeedback('দয়া করে একটি ছবি ফাইল নির্বাচন করুন (JPG, PNG, WebP)', 'error');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      showFeedback('ছবির আকার সর্বোচ্চ 8MB হতে পারবে', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      setFormData((prev) => ({
        ...prev,
        photo: uploadEvent.target.result
      }));
      showFeedback('ছবি সফলভাবে যুক্ত করা হয়েছে!', 'success');
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setFormData((prev) => ({
      ...prev,
      photo: ''
    }));
  };

  // Filtered Students
  const filteredStudents = students.filter((st) => {
    const userObj = st.user || {};
    const guardian = st.guardians?.[0]?.parent || {};

    const matchSearch =
      !search ||
      userObj.name?.toLowerCase().includes(search.toLowerCase()) ||
      st.studentIdNumber?.toLowerCase().includes(search.toLowerCase()) ||
      String(st.rollNo).includes(search) ||
      userObj.phone?.includes(search) ||
      guardian.name?.toLowerCase().includes(search.toLowerCase()) ||
      guardian.phone?.includes(search);

    const matchClass = !selectedClass || String(st.classId) === String(selectedClass);
    const matchBatch = !selectedBatch || String(st.batchId) === String(selectedBatch);
    const matchStatus =
      statusFilter === 'ALL'
        ? true
        : statusFilter === 'ACTIVE'
        ? userObj.isActive !== false
        : userObj.isActive === false;

    return matchSearch && matchClass && matchBatch && matchStatus;
  });

  // KPI calculations
  const totalStudents = students.length;
  const activeCount = students.filter((s) => s.user?.isActive !== false).length;
  const inactiveCount = totalStudents - activeCount;
  const maleCount = students.filter((s) => s.gender === 'MALE').length;
  const femaleCount = students.filter((s) => s.gender === 'FEMALE').length;

  const currentAvailableClasses = classes.length > 0 ? classes : defaultClassesList;

  const handleOpenAdd = () => {
    setEditingStudent(null);
    const firstClass = currentAvailableClasses[0];
    setFormData({
      ...initialFormState,
      classId: firstClass?.id ? String(firstClass.id) : '1',
      sectionId: firstClass?.sections?.[0]?.id ? String(firstClass.sections[0].id) : '1',
      rollNo: String(students.length + 1)
    });
    setShowAddEditModal(true);
  };

  const handleOpenEdit = (student) => {
    setEditingStudent(student);
    const primaryParent = student.guardians?.find((g) => g.isPrimary)?.parent || student.guardians?.[0]?.parent;
    setFormData({
      name: student.user?.name || '',
      nameBn: student.user?.name || '',
      rollNo: student.rollNo || '',
      classId: String(student.classId || '1'),
      sectionId: String(student.sectionId || '1'),
      batchId: student.batchId ? String(student.batchId) : '',
      guardianName: primaryParent?.name || '',
      guardianPhone: primaryParent?.phone || student.user?.phone || '',
      bloodGroup: student.bloodGroup || 'B+',
      dob: student.dob || '2014-01-01',
      gender: student.gender || 'MALE',
      photo: student.photo || student.user?.avatar || '',
      address: student.address || 'ঢাকা, বাংলাদেশ',
      admissionDate: student.admissionDate || new Date().toISOString().split('T')[0],
      isActive: student.user?.isActive !== false
    });
    setShowAddEditModal(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingStudent) {
        const res = await studentAPI.update(editingStudent.id, formData);
        if (res.success) {
          showFeedback('শিক্ষার্থীর তথ্য সফলভাবে আপডেট করা হয়েছে!');
          setShowAddEditModal(false);
          fetchData();
        }
      } else {
        const res = await studentAPI.create(formData);
        if (res.success) {
          showFeedback('নতুন শিক্ষার্থী সফলভাবে ভর্তি করা হয়েছে!');
          setShowAddEditModal(false);
          fetchData();
        }
      }
    } catch (err) {
      console.error('Submit student error:', err);
      showFeedback(err.message || 'শিক্ষার্থী সংরক্ষণ ব্যর্থ হয়েছে', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (student) => {
    const currentStatus = student.user?.isActive !== false;
    const newStatus = !currentStatus;
    try {
      const res = await studentAPI.toggleStatus(student.id, newStatus);
      if (res.success) {
        showFeedback(
          newStatus
            ? `'${student.user?.name}' এর অ্যাকাউন্ট সক্রিয় করা হয়েছে`
            : `'${student.user?.name}' এর অ্যাকাউন্ট নিষ্ক্রিয় করা হয়েছে`
        );
        fetchData();
      }
    } catch (err) {
      console.error('Toggle status error:', err);
      showFeedback(err.message || 'স্ট্যাটাস পরিবর্তন ব্যর্থ হয়েছে', 'error');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingStudent) return;
    setSubmitting(true);
    try {
      const res = await studentAPI.delete(deletingStudent.id);
      if (res.success) {
        showFeedback('শিক্ষার্থী প্রোফাইল সফলভাবে মুছে ফেলা হয়েছে!');
        setShowDeleteModal(false);
        setDeletingStudent(null);
        fetchData();
      }
    } catch (err) {
      console.error('Delete student error:', err);
      showFeedback(err.message || 'শিক্ষার্থী ডিলিট ব্যর্থ হয়েছে', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Get matching sections for selected class
  const selectedClassObj = currentAvailableClasses.find(
    (c) => String(c.id) === String(formData.classId)
  );

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

      {/* Top Banner & Hub Title */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-slate-700/60">
        <div className="absolute right-0 top-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>{lang === 'bn' ? 'শিক্ষার্থী ব্যবস্থাপনা হাব' : 'Student Management Hub'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white">
              {lang === 'bn' ? 'শিক্ষার্থী ডাটাবেজ ও ভর্তি পরিচালনা' : 'Student Database & Admissions'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl font-medium">
              প্লে গ্রুপ থেকে দ্বাদশ শ্রেণি (Play to Class 12) পর্যন্ত সকল শিক্ষার্থীর প্রোফাইল, কম্পিউটার থেকে সরাসরি ছবি আপলোড, রোল নম্বর, শ্রেণি ব্যাচ ও অ্যাক্টিভ স্ট্যাটাস সম্পূর্ণ নিয়ন্ত্রণ করুন
            </p>
          </div>

          <div className="flex items-center space-x-2.5">
            <button
              type="button"
              onClick={() => setShowBatchIdCardModal(true)}
              disabled={students.length === 0}
              className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 flex items-center space-x-2 transition-all active:scale-95 disabled:opacity-40"
              title="এক ক্লিকে সকল শিক্ষার্থীর ডিজিটাল আইডি কার্ড প্রিন্ট করুন"
            >
              <Printer className="w-4 h-4 text-amber-300" />
              <span>🪪 সব আইডি কার্ড প্রিন্ট</span>
            </button>

            <button
              onClick={handleOpenAdd}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-black text-xs shadow-lg shadow-indigo-600/30 flex items-center space-x-2 transition-all transform active:scale-95"
            >
              <UserPlus className="w-4 h-4" />
              <span>+ নতুন শিক্ষার্থী ভর্তি</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center space-x-3.5">
          <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-500">মোট শিক্ষার্থী</div>
            <div className="text-xl font-black text-slate-900">{totalStudents} জন</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center space-x-3.5">
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-500">নিয়মিত / সক্রিয়</div>
            <div className="text-xl font-black text-emerald-600">{activeCount} জন</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center space-x-3.5">
          <div className="p-3 rounded-xl bg-rose-50 text-rose-600">
            <UserX className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-500">স্থগিত / নিষ্ক্রিয়</div>
            <div className="text-xl font-black text-rose-600">{inactiveCount} জন</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center space-x-3.5">
          <div className="p-3 rounded-xl bg-purple-50 text-purple-600">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-500">ছাত্র / ছাত্রী অনুপাত</div>
            <div className="text-sm font-black text-purple-700">
              {maleCount} ছাত্র • {femaleCount} ছাত্রী
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3.5 items-center">
          {/* Search Input */}
          <div className="lg:col-span-4 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="শিক্ষার্থীর নাম, রোল, আইডি বা ফোন দিয়ে খুঁজুন..."
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

          {/* Class Filter with Stage Optgroups */}
          <div className="lg:col-span-3">
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full py-2.5 px-3 text-xs font-bold rounded-2xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">সকল শ্রেণি (All Classes: Play - 12)</option>
              <optgroup label="👶 প্রাক-প্রাথমিক (Pre-Primary)">
                {currentAvailableClasses
                  .filter((c) => c.stage === 'PRE_PRIMARY' || c.numericGrade <= 0 || c.id <= 3)
                  .map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.nameBn || cls.name}
                    </option>
                  ))}
              </optgroup>
              <optgroup label="🎒 প্রাথমিক স্তর (Primary: Class 1 - 5)">
                {currentAvailableClasses
                  .filter(
                    (c) =>
                      c.stage === 'PRIMARY' ||
                      (c.numericGrade >= 1 && c.numericGrade <= 5) ||
                      (c.id >= 4 && c.id <= 8)
                  )
                  .map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.nameBn || cls.name}
                    </option>
                  ))}
              </optgroup>
              <optgroup label="📚 জুনিয়র মাধ্যমিক (Class 6 - 8)">
                {currentAvailableClasses
                  .filter(
                    (c) =>
                      c.stage === 'JUNIOR_SECONDARY' ||
                      (c.numericGrade >= 6 && c.numericGrade <= 8) ||
                      (c.id >= 9 && c.id <= 11)
                  )
                  .map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.nameBn || cls.name}
                    </option>
                  ))}
              </optgroup>
              <optgroup label="📖 মাধ্যমিক ও এসএসসি (Class 9 - 10)">
                {currentAvailableClasses
                  .filter(
                    (c) =>
                      c.stage === 'SECONDARY' ||
                      (c.numericGrade >= 9 && c.numericGrade <= 10) ||
                      (c.id >= 12 && c.id <= 13)
                  )
                  .map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.nameBn || cls.name}
                    </option>
                  ))}
              </optgroup>
              <optgroup label="🎓 উচ্চ মাধ্যমিক ও এইচএসসি (Class 11 - 12)">
                {currentAvailableClasses
                  .filter(
                    (c) =>
                      c.stage === 'HIGHER_SECONDARY' ||
                      (c.numericGrade >= 11 && c.numericGrade <= 12) ||
                      (c.id >= 14 && c.id <= 15)
                  )
                  .map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.nameBn || cls.name}
                    </option>
                  ))}
              </optgroup>
            </select>
          </div>

          {/* Batch Filter */}
          <div className="lg:col-span-3">
            <select
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
              className="w-full py-2.5 px-3 text-xs font-bold rounded-2xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">সকল ব্যাচ (All Batches)</option>
              {batches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.nameBn || b.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="lg:col-span-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full py-2.5 px-3 text-xs font-bold rounded-2xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500"
            >
              <option value="ALL">সব স্ট্যাটাস</option>
              <option value="ACTIVE">সক্রিয় (Active)</option>
              <option value="INACTIVE">নিষ্ক্রিয় (Inactive)</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-medium text-slate-500 pt-2 border-t border-slate-100">
          <div>
            মোট প্রদর্শিত: <span className="font-bold text-slate-900">{filteredStudents.length}</span> জন শিক্ষার্থী
          </div>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setShowBatchIdCardModal(true)}
              disabled={filteredStudents.length === 0}
              className="px-3.5 py-1.5 rounded-xl font-bold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 transition-all flex items-center space-x-1.5 shadow-sm disabled:opacity-50 active:scale-95"
              title="নির্বাচিত শিক্ষার্থীদের আইডি কার্ড ব্যাচে প্রিন্ট করুন"
            >
              <Printer className="w-3.5 h-3.5 text-indigo-600" />
              <span>আইডি কার্ড প্রিন্ট</span>
            </button>

            <button
              type="button"
              onClick={() => exportStudentsToCSV(filteredStudents)}
              disabled={filteredStudents.length === 0}
              className="px-3.5 py-1.5 rounded-xl font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-all flex items-center space-x-1.5 shadow-sm disabled:opacity-50 disabled:pointer-events-none active:scale-95"
              title="শিক্ষার্থীদের তালিকা এক্সেল ফাইলে এক্সপোর্ট করুন"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span>Excel/CSV এক্সপোর্ট</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                viewMode === 'table' ? 'bg-indigo-600 text-white shadow' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              টেবিল ভিউ
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                viewMode === 'cards' ? 'bg-indigo-600 text-white shadow' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              কার্ড ভিউ
            </button>
          </div>
        </div>
      </div>

      {/* Main Student Directory Content */}
      {loading ? (
        <div className="p-12 text-center text-slate-500 space-y-3 bg-white rounded-3xl border border-slate-200">
          <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
          <p className="text-xs font-bold">শিক্ষার্থী ডাটাবেজ লোড হচ্ছে...</p>
        </div>
      ) : filteredStudents.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto border border-indigo-100">
            <GraduationCap className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-black text-slate-800">কোনো শিক্ষার্থী পাওয়া যায়নি</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              ডাটাবেজে বর্তমানে কোনো শিক্ষার্থী নেই। নতুন শিক্ষার্থী ভর্তি করতে নিচের বাটনে ক্লিক করুন।
            </p>
          </div>
          <button
            type="button"
            onClick={handleOpenAdd}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all inline-flex items-center space-x-1.5"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ নতুন শিক্ষার্থী যুক্ত করুন</span>
          </button>
        </div>
      ) : viewMode === 'table' ? (
        /* TABLE VIEW */
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">শিক্ষার্থী ও আইডি</th>
                  <th className="py-3.5 px-4">শ্রেণি ও রোল</th>
                  <th className="py-3.5 px-4">ব্যাচ</th>
                  <th className="py-3.5 px-4">অভিভাবক ও যোগাযোগ</th>
                  <th className="py-3.5 px-4 text-center">স্ট্যাটাস</th>
                  <th className="py-3.5 px-4 text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map((st) => {
                  const isActive = st.user ? st.user.isActive !== false : true;
                  const primaryParent =
                    st.guardians?.find((g) => g.isPrimary)?.parent || st.guardians?.[0]?.parent;

                  return (
                    <tr key={st.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-700 font-black flex items-center justify-center border border-indigo-100 overflow-hidden flex-shrink-0">
                            {st.photo || st.user?.avatar ? (
                              <img
                                src={st.photo || st.user?.avatar}
                                alt={st.user?.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span>{st.user?.name?.slice(0, 1) || 'শ'}</span>
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 text-xs flex items-center space-x-1.5">
                              <span>{st.user?.name || 'শিক্ষার্থী'}</span>
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-slate-100 text-slate-600">
                                {st.bloodGroup || 'B+'}
                              </span>
                            </div>
                            <div className="text-[10px] font-mono text-indigo-600 font-bold">
                              {st.studentIdNumber}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-lg bg-indigo-50 text-indigo-700 font-bold text-[11px] border border-indigo-100">
                          {st.class?.nameBn || `শ্রেণি ${st.classId}`}
                        </span>
                        <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                          রোল: <span className="font-bold text-slate-800">#{st.rollNo}</span>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 font-medium text-[11px] border border-emerald-100">
                          {batches.find((b) => Number(b.id) === Number(st.batchId))?.nameBn || 'সাধারণ ব্যাচ'}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <div className="text-slate-800 font-bold">{primaryParent?.name || 'অভিভাবক'}</div>
                        <div className="text-[10px] font-mono text-slate-500 flex items-center space-x-1 mt-0.5">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span>{primaryParent?.phone || st.user?.phone || '০১৭০০০০০০০০'}</span>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => handleToggleStatus(st)}
                          title="স্ট্যাটাস পরিবর্তন করতে ক্লিক করুন"
                          className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-black border transition-all ${
                            isActive
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                              : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                          <span>{isActive ? 'সক্রিয়' : 'নিষ্ক্রিয়'}</span>
                        </button>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center space-x-1.5">
                          <button
                            onClick={() => setSelectedStudentForIdCard(st)}
                            className="p-1.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                            title="ডিজিটাল স্টুডেন্ট আইডি কার্ড প্রিন্ট করুন"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setSelectedStudentFor360(st.id)}
                            className="p-1.5 rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors"
                            title="৩৬০° সম্পূর্ণ প্রোফাইল ও রেজাল্ট"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleOpenEdit(st)}
                            className="p-1.5 rounded-xl bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors"
                            title="এডিট করুন"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              setDeletingStudent(st);
                              setShowDeleteModal(true);
                            }}
                            className="p-1.5 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 transition-colors"
                            title="মুছে ফেলুন"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* CARDS GRID VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredStudents.map((st) => {
            const isActive = st.user ? st.user.isActive !== false : true;
            const primaryParent =
              st.guardians?.find((g) => g.isPrimary)?.parent || st.guardians?.[0]?.parent;

            return (
              <div
                key={st.id}
                className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-700 font-black flex items-center justify-center border border-indigo-100 overflow-hidden flex-shrink-0">
                      {st.photo || st.user?.avatar ? (
                        <img
                          src={st.photo || st.user?.avatar}
                          alt={st.user?.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-base">{st.user?.name?.slice(0, 1) || 'শ'}</span>
                      )}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-sm">{st.user?.name}</h4>
                      <p className="text-xs font-mono font-bold text-indigo-600">{st.studentIdNumber}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleToggleStatus(st)}
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-rose-50 text-rose-700 border-rose-200'
                    }`}
                  >
                    {isActive ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-50 p-3 rounded-2xl">
                  <div>
                    <span className="text-slate-400 block">শ্রেণি ও রোল:</span>
                    <span className="font-bold text-slate-800">
                      {st.class?.nameBn || `শ্রেণি ${st.classId}`} • #{st.rollNo}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">রক্তের গ্রুপ:</span>
                    <span className="font-bold text-slate-800">{st.bloodGroup || 'B+'}</span>
                  </div>
                  <div className="col-span-2 pt-1 border-t border-slate-200/60">
                    <span className="text-slate-400 block">অভিভাবক ও ফোন:</span>
                    <span className="font-bold text-slate-800">
                      {primaryParent?.name || 'অভিভাবক'} ({primaryParent?.phone || st.user?.phone || 'N/A'})
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <button
                    onClick={() => setSelectedStudentFor360(st.id)}
                    className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center space-x-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>৩৬০° প্রোফাইল</span>
                  </button>

                  <div className="flex items-center space-x-1.5">
                    <button
                      onClick={() => setSelectedStudentForIdCard(st)}
                      className="p-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                      title="আইডি কার্ড প্রিন্ট"
                    >
                      <Printer className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleOpenEdit(st)}
                      className="p-2 rounded-xl bg-amber-50 text-amber-700 hover:bg-amber-100"
                      title="এডিট"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        setDeletingStudent(st);
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
            );
          })}
        </div>
      )}

      {/* Modal: Add or Edit Student */}
      {showAddEditModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
                <GraduationCap className="w-5 h-5 text-indigo-600" />
                <span>{editingStudent ? 'শিক্ষার্থীর তথ্য সম্পাদন (Edit Student)' : 'নতুন শিক্ষার্থী ভর্তি (New Student Enrollment)'}</span>
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
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">শিক্ষার্থীর পুরো নাম (বাংলা/English) *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value, nameBn: e.target.value })}
                    placeholder="যেমন: তানভীর আহমেদ"
                    required
                    className="w-full text-xs font-medium rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Class Selection with all 15 classes from Play to 12 */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    শ্রেণি (Class: Play - Class 12) *
                  </label>
                  <select
                    value={formData.classId}
                    onChange={(e) => {
                      const newCid = e.target.value;
                      const targetClass = currentAvailableClasses.find(
                        (c) => String(c.id) === String(newCid)
                      );
                      setFormData({
                        ...formData,
                        classId: newCid,
                        sectionId: targetClass?.sections?.[0]?.id
                          ? String(targetClass.sections[0].id)
                          : '1'
                      });
                    }}
                    required
                    className="w-full text-xs font-bold rounded-xl border border-slate-300 p-2.5 bg-slate-50 focus:ring-2 focus:ring-indigo-500 text-indigo-950"
                  >
                    <optgroup label="👶 প্রাক-প্রাথমিক (Pre-Primary)">
                      {currentAvailableClasses
                        .filter((c) => c.stage === 'PRE_PRIMARY' || c.numericGrade <= 0 || c.id <= 3)
                        .map((cls) => (
                          <option key={cls.id} value={cls.id}>
                            {cls.nameBn || cls.name}
                          </option>
                        ))}
                    </optgroup>
                    <optgroup label="🎒 প্রাথমিক স্তর (Primary: Class 1 - 5)">
                      {currentAvailableClasses
                        .filter(
                          (c) =>
                            c.stage === 'PRIMARY' ||
                            (c.numericGrade >= 1 && c.numericGrade <= 5) ||
                            (c.id >= 4 && c.id <= 8)
                        )
                        .map((cls) => (
                          <option key={cls.id} value={cls.id}>
                            {cls.nameBn || cls.name}
                          </option>
                        ))}
                    </optgroup>
                    <optgroup label="📚 জুনিয়র মাধ্যমিক (Class 6 - 8)">
                      {currentAvailableClasses
                        .filter(
                          (c) =>
                            c.stage === 'JUNIOR_SECONDARY' ||
                            (c.numericGrade >= 6 && c.numericGrade <= 8) ||
                            (c.id >= 9 && c.id <= 11)
                        )
                        .map((cls) => (
                          <option key={cls.id} value={cls.id}>
                            {cls.nameBn || cls.name}
                          </option>
                        ))}
                    </optgroup>
                    <optgroup label="📖 মাধ্যমিক ও এসএসসি (Class 9 - 10)">
                      {currentAvailableClasses
                        .filter(
                          (c) =>
                            c.stage === 'SECONDARY' ||
                            (c.numericGrade >= 9 && c.numericGrade <= 10) ||
                            (c.id >= 12 && c.id <= 13)
                        )
                        .map((cls) => (
                          <option key={cls.id} value={cls.id}>
                            {cls.nameBn || cls.name}
                          </option>
                        ))}
                    </optgroup>
                    <optgroup label="🎓 উচ্চ মাধ্যমিক ও এইচএসসি (Class 11 - 12)">
                      {currentAvailableClasses
                        .filter(
                          (c) =>
                            c.stage === 'HIGHER_SECONDARY' ||
                            (c.numericGrade >= 11 && c.numericGrade <= 12) ||
                            (c.id >= 14 && c.id <= 15)
                        )
                        .map((cls) => (
                          <option key={cls.id} value={cls.id}>
                            {cls.nameBn || cls.name}
                          </option>
                        ))}
                    </optgroup>
                  </select>
                </div>

                {/* Section selection */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">শাখা / সেকশন (Section)</label>
                  <select
                    value={formData.sectionId}
                    onChange={(e) => setFormData({ ...formData, sectionId: e.target.value })}
                    className="w-full text-xs font-bold rounded-xl border border-slate-300 p-2.5 bg-slate-50"
                  >
                    {selectedClassObj?.sections && selectedClassObj.sections.length > 0 ? (
                      selectedClassObj.sections.map((sec) => (
                        <option key={sec.id} value={sec.id}>
                          {sec.nameBn || sec.name}
                        </option>
                      ))
                    ) : (
                      <>
                        <option value="1">পদ্মা (Padma - A)</option>
                        <option value="2">মেঘনা (Meghna - B)</option>
                        <option value="3">যমুনা (Jamuna - C)</option>
                      </>
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">রোল নম্বর (Roll No) *</label>
                  <input
                    type="number"
                    value={formData.rollNo}
                    onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
                    placeholder="১"
                    required
                    className="w-full text-xs font-medium rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">ব্যাচ (Batch)</label>
                  <select
                    value={formData.batchId}
                    onChange={(e) => setFormData({ ...formData, batchId: e.target.value })}
                    className="w-full text-xs font-bold rounded-xl border border-slate-300 p-2.5 bg-slate-50"
                  >
                    <option value="">সাধারণ ব্যাচ / বরাদ্দহীন</option>
                    {batches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.nameBn || b.name} ({b.shift || 'MORNING'})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">রক্তের গ্রুপ (Blood Group)</label>
                  <select
                    value={formData.bloodGroup}
                    onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                    className="w-full text-xs font-bold rounded-xl border border-slate-300 p-2.5 bg-slate-50"
                  >
                    {bloodGroups.map((bg) => (
                      <option key={bg} value={bg}>
                        {bg}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">লিঙ্গ (Gender)</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full text-xs font-bold rounded-xl border border-slate-300 p-2.5 bg-slate-50"
                  >
                    <option value="MALE">ছাত্র (Male)</option>
                    <option value="FEMALE">ছাত্রী (Female)</option>
                    <option value="OTHER">অন্যান্য (Other)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">জন্ম তারিখ (DOB)</label>
                  <input
                    type="date"
                    value={formData.dob}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                    className="w-full text-xs font-medium rounded-xl border border-slate-300 p-2.5"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">অভিভাবকের নাম (Guardian Name)</label>
                  <input
                    type="text"
                    value={formData.guardianName}
                    onChange={(e) => setFormData({ ...formData, guardianName: e.target.value })}
                    placeholder="যেমন: মোঃ রফিকুল ইসলাম"
                    className="w-full text-xs font-medium rounded-xl border border-slate-300 p-2.5"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">অভিভাবকের ফোন নম্বর *</label>
                  <input
                    type="text"
                    value={formData.guardianPhone}
                    onChange={(e) => setFormData({ ...formData, guardianPhone: e.target.value })}
                    placeholder="01712345678"
                    required
                    className="w-full text-xs font-medium rounded-xl border border-slate-300 p-2.5"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">ভর্তির তারিখ (Admission Date)</label>
                  <input
                    type="date"
                    value={formData.admissionDate}
                    onChange={(e) => setFormData({ ...formData, admissionDate: e.target.value })}
                    className="w-full text-xs font-medium rounded-xl border border-slate-300 p-2.5"
                  />
                </div>

                {/* Student Photo & Identity Document Upload */}
                <div className="sm:col-span-2 p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <UniversalFileUploader
                    label="শিক্ষার্থীর ছবি / পাসপোর্ট সাইজ ফটো (Student Photo)"
                    value={formData.photo}
                    previewType="image"
                    accept="image/*"
                    maxMb={10}
                    helperText="JPG, PNG, JPEG, WebP অথবা গুগল ড্রাইভ লিংক (সর্বোচ্চ 10MB)"
                    onChange={({ fileUrl, url }) => {
                      setFormData(prev => ({ ...prev, photo: fileUrl || url || '' }));
                    }}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">স্থায়ী ঠিকানা (Address)</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="বাড়ি নং ১২, ধানমন্ডি, ঢাকা"
                    className="w-full text-xs font-medium rounded-xl border border-slate-300 p-2.5"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                  />
                  <span className="text-xs font-bold text-slate-700">অ্যাকাউন্ট সক্রিয় রাখুন (Active)</span>
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
                    {submitting ? 'সংরক্ষণ হচ্ছে...' : editingStudent ? 'আপডেট করুন' : 'ভর্তি নিশ্চিত করুন'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Delete Student Confirmation */}
      {showDeleteModal && deletingStudent && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center space-x-3 text-rose-600">
              <div className="p-2.5 rounded-2xl bg-rose-50 border border-rose-200">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-slate-900">শিক্ষার্থী ডিলিট নিশ্চিতকরণ</h3>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              আপনি কি নিশ্চিতভাবে <span className="font-bold text-slate-900">'{deletingStudent.user?.name}'</span>{' '}
              (আইডি: {deletingStudent.studentIdNumber}, রোল: {deletingStudent.rollNo}) এর সম্পূর্ণ ডাটা মুছে ফেলতে চান?
            </p>

            <div className="p-3 bg-rose-50 rounded-2xl border border-rose-200 text-[11px] text-rose-700 font-medium">
              ⚠️ সতর্কবার্তা: এই প্রক্রিয়াটি অপরিবর্তনযোগ্য। শিক্ষার্থীর রেজাল্ট ও ফি হিস্ট্রি মুছে যেতে পারে।
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

      {/* Student 360 View Modal */}
      {selectedStudentFor360 && (
        <Student360Modal
          studentId={selectedStudentFor360}
          onClose={() => setSelectedStudentFor360(null)}
        />
      )}

      {/* Printable Digital Student ID Card Modal */}
      {selectedStudentForIdCard && (
        <PrintableStudentIdCardModal
          student={selectedStudentForIdCard}
          isOpen={!!selectedStudentForIdCard}
          onClose={() => setSelectedStudentForIdCard(null)}
        />
      )}

      {/* Bulk Batch Student ID Card Generator Modal */}
      <BatchStudentIdCardModal
        students={filteredStudents}
        classes={currentAvailableClasses}
        batches={batches}
        isOpen={showBatchIdCardModal}
        onClose={() => setShowBatchIdCardModal(false)}
      />
    </div>
  );
}
