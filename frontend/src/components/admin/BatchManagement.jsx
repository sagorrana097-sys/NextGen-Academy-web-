import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { batchAPI, adminAPI } from '../../services/api';
import {
  Layers,
  Users,
  Plus,
  Search,
  Filter,
  ArrowRightLeft,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Clock,
  MapPin,
  GraduationCap,
  CreditCard,
  UserCheck,
  X,
  Sparkles,
  ChevronRight,
  TrendingUp,
  History,
  Eye,
  Info,
  Calendar,
  ToggleLeft,
  ToggleRight,
  Check,
  Sun,
  Sunset,
  Moon
} from 'lucide-react';

export default function BatchManagement() {
  const { t, lang } = useLanguage();
  const { user } = useAuth();

  const [batches, setBatches] = useState([]);
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState(null);

  // Filter & Search
  const [selectedClassId, setSelectedClassId] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL' | 'ACTIVE' | 'INACTIVE'

  // Modals
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [editingBatch, setEditingBatch] = useState(null);
  const [savingBatch, setSavingBatch] = useState(false);

  // Form State with Time Slot and Active flag
  const [batchForm, setBatchForm] = useState({
    nameBn: '',
    nameEn: '',
    code: '',
    timeSlot: 'সকাল ৮:০০ - ১০:০০',
    customTimeSlot: '',
    className: 'Class 9',
    classId: 12,
    sectionId: '',
    shift: 'MORNING',
    maxCapacity: 35,
    monthlyFee: 2500,
    startDate: new Date().toISOString().split('T')[0],
    endDate: '2026-12-31',
    status: 'ACTIVE',
    isActive: true,
    room: 'Room 201',
    mentorTeacherId: 1,
    descriptionBn: ''
  });

  // Transfer Student Modal
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferringStudent, setTransferringStudent] = useState(false);
  const [transferForm, setTransferForm] = useState({
    studentId: '',
    toBatchId: '',
    reason: ''
  });

  // Batch Students Drawer/Modal
  const [viewingBatchStudents, setViewingBatchStudents] = useState(null);
  const [transferHistory, setTransferHistory] = useState([]);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  const predefinedTimeSlots = [
    'সকাল ৮:০০ - ১০:০০',
    'সকাল ১০:০০ - ১২:০০',
    'দুপুর ২:০০ - ৪:০০',
    'বিকাল ৪:০০ - ৬:০০',
    'সন্ধ্যা ৬:০০ - ৮:০০',
    'স্পেশাল কেয়ার ব্যাচ (সকাল ৯:০০ - ১২:০০)',
    'কাস্টম সময় (Custom Time)'
  ];

  const classOptions = [
    { id: 1, name: 'Play', nameBn: 'প্লে গ্রুপ (Play)', category: 'PRE_PRIMARY' },
    { id: 2, name: 'Nursery', nameBn: 'নার্সারি (Nursery)', category: 'PRE_PRIMARY' },
    { id: 3, name: 'KG', nameBn: 'কেজি (KG)', category: 'PRE_PRIMARY' },
    { id: 4, name: 'Class 1', nameBn: '১ম শ্রেণি (Class 1)', category: 'PRIMARY' },
    { id: 5, name: 'Class 2', nameBn: '২য় শ্রেণি (Class 2)', category: 'PRIMARY' },
    { id: 6, name: 'Class 3', nameBn: '৩য় শ্রেণি (Class 3)', category: 'PRIMARY' },
    { id: 7, name: 'Class 4', nameBn: '৪র্থ শ্রেণি (Class 4)', category: 'PRIMARY' },
    { id: 8, name: 'Class 5', nameBn: '৫ম শ্রেণি (Class 5)', category: 'PRIMARY' },
    { id: 9, name: 'Class 6', nameBn: '৬ষ্ঠ শ্রেণি (Class 6)', category: 'JUNIOR_SECONDARY' },
    { id: 10, name: 'Class 7', nameBn: '৭ম শ্রেণি (Class 7)', category: 'JUNIOR_SECONDARY' },
    { id: 11, name: 'Class 8', nameBn: '৮ম শ্রেণি (Class 8)', category: 'JUNIOR_SECONDARY' },
    { id: 12, name: 'Class 9', nameBn: '৯ম শ্রেণি (Class 9)', category: 'SECONDARY' },
    { id: 13, name: 'Class 10', nameBn: '১০ম শ্রেণি (Class 10)', category: 'SECONDARY' },
    { id: 14, name: 'Class 11', nameBn: 'একাদশ শ্রেণি (11th - HSC)', category: 'HIGHER_SECONDARY' },
    { id: 15, name: 'Class 12', nameBn: 'দ্বাদশ শ্রেণি (12th - HSC)', category: 'HIGHER_SECONDARY' }
  ];

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [batchesRes, studentsRes, teachersRes] = await Promise.all([
        batchAPI.getAll(),
        adminAPI.getStudents(),
        adminAPI.getTeachers()
      ]);

      if (batchesRes.success) setBatches(batchesRes.data || []);
      if (studentsRes.success) setAllStudents(studentsRes.data || []);
      if (teachersRes.success) setTeachers(teachersRes.data || []);
      setClasses(classOptions);
    } catch (err) {
      console.error('Failed to load batch management data:', err);
      setError(err.message || 'ব্যাচ তথ্য লোড করতে ব্যর্থ হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddBatch = () => {
    setEditingBatch(null);
    setBatchForm({
      nameBn: '',
      nameEn: '',
      code: '',
      timeSlot: 'সকাল ৮:০০ - ১০:০০',
      customTimeSlot: '',
      className: selectedClassId !== 'ALL' ? (classOptions.find(c => String(c.id) === String(selectedClassId))?.name || 'Class 9') : 'Class 9',
      classId: selectedClassId !== 'ALL' ? Number(selectedClassId) : 12,
      sectionId: '',
      shift: 'MORNING',
      maxCapacity: 35,
      monthlyFee: 2500,
      startDate: new Date().toISOString().split('T')[0],
      endDate: '2026-12-31',
      status: 'ACTIVE',
      isActive: true,
      room: 'Room 201',
      mentorTeacherId: teachers[0]?.id || 1,
      descriptionBn: ''
    });
    setShowBatchModal(true);
  };

  const handleOpenEditBatch = (batch) => {
    setEditingBatch(batch);
    const isCustom = !predefinedTimeSlots.includes(batch.timeSlot);
    setBatchForm({
      nameBn: batch.nameBn || batch.name || '',
      nameEn: batch.nameEn || '',
      code: batch.code || '',
      timeSlot: isCustom ? 'কাস্টম সময় (Custom Time)' : (batch.timeSlot || 'সকাল ৮:০০ - ১০:০০'),
      customTimeSlot: isCustom ? batch.timeSlot : '',
      className: batch.className || `Class ${batch.classId}`,
      classId: batch.classId || 10,
      sectionId: batch.sectionId || '',
      shift: batch.shift || 'MORNING',
      maxCapacity: batch.maxCapacity || batch.capacity || 35,
      monthlyFee: batch.monthlyFee || 2500,
      startDate: batch.startDate || '',
      endDate: batch.endDate || '',
      status: batch.status || 'ACTIVE',
      isActive: batch.status === 'ACTIVE' || batch.isActive !== false,
      room: batch.room || '',
      mentorTeacherId: batch.mentorTeacherId || 1,
      descriptionBn: batch.descriptionBn || ''
    });
    setShowBatchModal(true);
  };

  const handleToggleStatus = async (batch) => {
    const newStatus = batch.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      await batchAPI.update(batch.id, {
        status: newStatus,
        isActive: newStatus === 'ACTIVE'
      });
      setFeedback({
        type: 'success',
        msg: `ব্যাচ "${batch.nameBn || batch.name}" এখন ${newStatus === 'ACTIVE' ? 'সচল (Active)' : 'নিষ্ক্রিয় (Inactive)'}`
      });
      loadAllData();
      setTimeout(() => setFeedback(null), 3000);
    } catch (err) {
      alert('স্ট্যাটাস পরিবর্তনে সমস্যা হয়েছে: ' + (err.message || 'Error'));
    }
  };

  const handleSaveBatch = async (e) => {
    e.preventDefault();
    setSavingBatch(true);
    setFeedback(null);

    const finalTimeSlot = batchForm.timeSlot === 'কাস্টম সময় (Custom Time)'
      ? (batchForm.customTimeSlot || 'সকাল ৮:০০ - ১০:০০')
      : batchForm.timeSlot;

    const payload = {
      ...batchForm,
      timeSlot: finalTimeSlot,
      status: batchForm.isActive ? 'ACTIVE' : 'INACTIVE'
    };

    try {
      if (editingBatch) {
        await batchAPI.update(editingBatch.id, payload);
        setFeedback({ type: 'success', msg: 'ব্যাচ তথ্য সফলভাবে আপডেট করা হয়েছে!' });
      } else {
        await batchAPI.create(payload);
        setFeedback({ type: 'success', msg: 'নতুন ব্যাচ সফলভাবে তৈরি ও সক্রিয় করা হয়েছে!' });
      }
      setShowBatchModal(false);
      loadAllData();
      setTimeout(() => setFeedback(null), 4000);
    } catch (err) {
      alert(err.message || 'ব্যাচ সংরক্ষণে ত্রুটি হয়েছে');
    } finally {
      setSavingBatch(false);
    }
  };

  const handleDeleteBatch = async (batch) => {
    if (batch.enrolledCount > 0) {
      alert(`এই ব্যাচে ${batch.enrolledCount} জন শিক্ষার্থী ভর্তি রয়েছে। মুছে ফেলার আগে তাদের অন্য ব্যাচে স্থানান্তর করুন। অথবা ব্যাচটি নিষ্ক্রিয় (Inactive) করে রাখুন।`);
      return;
    }
    if (!window.confirm(`আপনি কি নিশ্চিতভাবে "${batch.nameBn || batch.name}" ব্যাচটি মুছে ফেলতে চান?`)) return;

    try {
      await batchAPI.delete(batch.id);
      setFeedback({ type: 'success', msg: 'ব্যাচটি সফলভাবে মুছে ফেলা হয়েছে' });
      loadAllData();
      setTimeout(() => setFeedback(null), 3000);
    } catch (err) {
      alert(err.message || 'ব্যাচ মুছতে ব্যর্থ হয়েছে');
    }
  };

  const handleOpenTransferModal = (studentId = '', fromBatchId = '') => {
    setTransferForm({
      studentId: studentId ? String(studentId) : '',
      toBatchId: '',
      reason: ''
    });
    setShowTransferModal(true);
  };

  const handleExecuteTransfer = async (e) => {
    e.preventDefault();
    if (!transferForm.studentId || !transferForm.toBatchId) {
      alert('শিক্ষার্থী ও গন্তব্য ব্যাচ নির্বাচন আবশ্যক');
      return;
    }
    setTransferringStudent(true);
    try {
      const res = await batchAPI.transferStudent(transferForm);
      setFeedback({ type: 'success', msg: res.message || 'শিক্ষার্থী সফলভাবে স্থানান্তর করা হয়েছে!' });
      setShowTransferModal(false);
      setViewingBatchStudents(null);
      loadAllData();
      setTimeout(() => setFeedback(null), 4000);
    } catch (err) {
      alert(err.message || 'শিক্ষার্থী স্থানান্তর ব্যর্থ হয়েছে');
    } finally {
      setTransferringStudent(false);
    }
  };

  const handleOpenTransferHistory = async () => {
    try {
      const res = await batchAPI.getTransferHistory();
      if (res.success) setTransferHistory(res.data || []);
      setShowHistoryModal(true);
    } catch (err) {
      console.error(err);
    }
  };

  // Metrics Calculation
  const totalBatches = batches.length;
  const activeBatches = batches.filter(b => b.status === 'ACTIVE' || b.isActive !== false).length;
  const inactiveBatches = totalBatches - activeBatches;
  const totalCapacity = batches.reduce((sum, b) => sum + (Number(b.maxCapacity || b.capacity) || 0), 0);
  const totalEnrolled = batches.reduce((sum, b) => sum + (Number(b.enrolledCount) || 0), 0);
  const avgOccupancy = totalCapacity > 0 ? Math.round((totalEnrolled / totalCapacity) * 100) : 0;

  // Filtered Batches
  const filteredBatches = batches.filter((b) => {
    const matchesClass = selectedClassId === 'ALL' || Number(b.classId) === Number(selectedClassId);
    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'ACTIVE' && (b.status === 'ACTIVE' || b.isActive !== false)) ||
      (statusFilter === 'INACTIVE' && (b.status === 'INACTIVE' || b.isActive === false));

    const q = searchQuery.toLowerCase().trim();
    const nameBn = (b.nameBn || b.name || '').toLowerCase();
    const nameEn = (b.nameEn || '').toLowerCase();
    const timeSlot = (b.timeSlot || '').toLowerCase();
    const matchesSearch =
      !q ||
      nameBn.includes(q) ||
      nameEn.includes(q) ||
      timeSlot.includes(q) ||
      (b.code && b.code.toLowerCase().includes(q)) ||
      (b.room && b.room.toLowerCase().includes(q));

    return matchesClass && matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-slate-700/60">
        <div className="absolute -right-10 -top-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 -bottom-10 w-60 h-60 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold">
              <Layers className="w-3.5 h-3.5" />
              <span>ডাইনামিক ব্যাচ কন্ট্রোল ও রুটিন শিডিউল</span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white">
              ব্যাচ ম্যানেজমেন্ট (Batch Control & Admission Sync)
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl font-medium">
              অ্যাকাডেমির সকল ব্যাচ, সময়সূচী ও আসন পরিচালনা করুন। এখানে তৈরি বা সম্পাদিত ব্যাচসমূহ অনলাইন ভর্তি ফর্মে তাৎক্ষণিকভাবে যুক্ত হবে।
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleOpenTransferHistory}
              className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold transition-all flex items-center space-x-1.5"
            >
              <History className="w-4 h-4 text-amber-400" />
              <span>{t('transferHistory')}</span>
            </button>
            <button
              onClick={() => handleOpenTransferModal()}
              className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all flex items-center space-x-1.5"
            >
              <ArrowRightLeft className="w-4 h-4" />
              <span>{t('transferStudent')}</span>
            </button>
            <button
              onClick={handleOpenAddBatch}
              className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-lg shadow-emerald-600/30 transition-all flex items-center space-x-1.5 ring-2 ring-emerald-400/30"
            >
              <Plus className="w-4 h-4" />
              <span>নতুন ব্যাচ তৈরি করুন</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">মোট ব্যাচ সংখ্যা</p>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">{totalBatches}</h3>
            <span className="text-[10px] text-emerald-600 font-bold">সচল: {activeBatches}টি</span>
          </div>
          <div className="p-3 bg-indigo-50 dark:bg-indigo-950/60 rounded-2xl text-indigo-600 dark:text-indigo-400">
            <Layers className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">মোট শিক্ষার্থী ভর্তি</p>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">{totalEnrolled}</h3>
            <span className="text-[10px] text-indigo-600 font-bold">আসন: {totalCapacity}টি</span>
          </div>
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 rounded-2xl text-emerald-600 dark:text-emerald-400">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">গড় আসন দখল হার</p>
            <h3 className="text-2xl font-black text-amber-500 mt-1">{avgOccupancy}%</h3>
            <span className="text-[10px] text-slate-400 font-medium">অকুপেন্সি রেট</span>
          </div>
          <div className="p-3 bg-amber-50 dark:bg-amber-950/60 rounded-2xl text-amber-600 dark:text-amber-400">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">ভর্তি ফর্ম কানেকশন</p>
            <h3 className="text-sm font-black text-emerald-600 mt-1">✓ লাইভ সিঙ্ক</h3>
            <span className="text-[10px] text-slate-400 font-medium">GET /api/batches</span>
          </div>
          <div className="p-3 bg-teal-50 dark:bg-teal-950/60 rounded-2xl text-teal-600 dark:text-teal-400">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Toast Feedback */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl border flex items-center space-x-2 text-xs font-bold animate-in slide-in-from-top-2 ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border-emerald-300 text-emerald-800 dark:bg-emerald-950/60 dark:border-emerald-700 dark:text-emerald-300'
              : 'bg-rose-50 border-rose-300 text-rose-800'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedback.msg}</span>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="ব্যাচের নাম, সময়সূচী বা রুম নম্বর দিয়ে খুঁজুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200"
            >
              <option value="ALL">সকল স্ট্যাটাস ({totalBatches})</option>
              <option value="ACTIVE">সচল ব্যাচসমূহ ({activeBatches})</option>
              <option value="INACTIVE">নিষ্ক্রিয় ব্যাচসমূহ ({inactiveBatches})</option>
            </select>
          </div>
        </div>

        {/* Class Filter Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setSelectedClassId('ALL')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap ${
              selectedClassId === 'ALL'
                ? 'bg-slate-900 dark:bg-slate-700 text-white shadow-md'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            সকল শ্রেণি ({batches.length})
          </button>
          {classes.map((cls) => {
            const count = batches.filter((b) => Number(b.classId) === cls.id || b.className === cls.name).length;
            const isSelected = selectedClassId === String(cls.id);
            return (
              <button
                key={cls.id}
                onClick={() => setSelectedClassId(String(cls.id))}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {cls.nameBn} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Batches Cards Grid */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[300px] bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filteredBatches.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-12 text-center text-slate-500 space-y-3">
          <Layers className="w-12 h-12 mx-auto text-slate-300" />
          <p className="font-bold text-base text-slate-700 dark:text-slate-300">কোনো ব্যাচ পাওয়া যায়নি</p>
          <button
            onClick={handleOpenAddBatch}
            className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl shadow hover:bg-indigo-700"
          >
            নতুন ব্যাচ যোগ করুন
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredBatches.map((batch) => {
            const isFull = (batch.enrolledCount || 0) >= (batch.maxCapacity || batch.capacity || 30);
            const isActive = batch.status === 'ACTIVE' || batch.isActive !== false;

            return (
              <div
                key={batch.id}
                className={`bg-white dark:bg-slate-900 rounded-3xl border ${
                  isActive
                    ? 'border-slate-200 dark:border-slate-800 hover:border-indigo-500/50'
                    : 'border-rose-200 dark:border-rose-950/60 opacity-80'
                } shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group`}
              >
                {/* Card Header */}
                <div className="p-5 space-y-3.5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 uppercase">
                          {batch.code || `B-${batch.id}`}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isActive
                            ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                            : 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300'
                        }`}>
                          {isActive ? '● সচল (Active)' : '○ নিষ্ক্রিয় (Inactive)'}
                        </span>
                      </div>

                      <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-1.5 group-hover:text-indigo-600 transition-colors">
                        {batch.nameBn || batch.name}
                      </h3>
                      {batch.nameEn && <p className="text-xs text-slate-500">{batch.nameEn}</p>}
                    </div>

                    <button
                      onClick={() => handleToggleStatus(batch)}
                      title={isActive ? 'নিষ্ক্রিয় করুন (Deactivate)' : 'সচল করুন (Activate)'}
                      className="p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-indigo-600 transition-all"
                    >
                      {isActive ? (
                        <ToggleRight className="w-6 h-6 text-emerald-500" />
                      ) : (
                        <ToggleLeft className="w-6 h-6 text-slate-400" />
                      )}
                    </button>
                  </div>

                  {/* Time Schedule Badge */}
                  <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60 text-xs font-bold">
                    <Clock className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                    <span>সময়সূচী: {batch.timeSlot || 'সকাল ৮:০০ - ১০:০০'}</span>
                  </div>

                  {/* Capacity Progress Bar */}
                  <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 dark:text-slate-400 font-bold flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-indigo-600" />
                        <span>আসন বরাদ্দ</span>
                      </span>
                      <span className="font-extrabold text-slate-800 dark:text-slate-200">
                        {batch.enrolledCount || 0} / {batch.maxCapacity || batch.capacity || 30} জন
                      </span>
                    </div>

                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${
                          isFull
                            ? 'bg-rose-500'
                            : (batch.occupancyRate || 0) >= 75
                            ? 'bg-amber-500'
                            : 'bg-emerald-500'
                        }`}
                        style={{ width: `${batch.occupancyRate || 0}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                      <span>{batch.occupancyRate || 0}% পূর্ণ</span>
                      <span className={isFull ? 'text-rose-600 font-bold' : 'text-emerald-600 dark:text-emerald-400'}>
                        {isFull ? '🔴 আসন পূর্ণ' : `🟢 খালি: ${batch.availableSeats !== undefined ? batch.availableSeats : 30}টি`}
                      </span>
                    </div>
                  </div>

                  {/* Metadata Info */}
                  <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                    <div className="flex items-center space-x-2">
                      <CreditCard className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                      <span className="font-bold text-slate-900 dark:text-white">
                        মাসিক ফি: ৳ {Number(batch.monthlyFee || 2500).toLocaleString('en-BD')}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />
                      <span className="truncate">{batch.room || 'একাডেমিক ভবন'}</span>
                    </div>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-800 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setViewingBatchStudents(batch)}
                      className="py-2 px-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-indigo-500 text-slate-700 dark:text-slate-200 hover:text-indigo-600 text-xs font-bold flex items-center justify-center space-x-1 transition-all shadow-xs"
                    >
                      <Users className="w-3.5 h-3.5" />
                      <span>শিক্ষার্থী ({batch.enrolledCount || 0})</span>
                    </button>

                    <button
                      onClick={() => handleOpenTransferModal('', batch.id)}
                      className="py-2 px-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-bold flex items-center justify-center space-x-1 transition-all"
                    >
                      <ArrowRightLeft className="w-3.5 h-3.5" />
                      <span>স্থানান্তর</span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-slate-400 font-mono font-medium">
                      {batch.className || `Class ${batch.classId}`}
                    </span>

                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleOpenEditBatch(batch)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-white dark:hover:bg-slate-700 transition-colors"
                        title="ব্যাচ সম্পাদনা করুন"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteBatch(batch)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                        title="ব্যাচ মুছুন"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================================= */}
      {/* CREATE / EDIT BATCH MODAL */}
      {/* ========================================================================= */}
      {showBatchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-lg w-full overflow-hidden max-h-[90vh] flex flex-col">
            <div className="bg-slate-900 p-5 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-xl bg-indigo-600 text-white">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-white">
                    {editingBatch ? 'ব্যাচ সম্পাদনা ও সময়সূচী পরিবর্তন' : 'নতুন ব্যাচ সংযোজন (Add New Batch)'}
                  </h3>
                  <p className="text-[11px] text-slate-400">অনলাইন ভর্তি ফর্মে এই ব্যাচটি প্রদর্শিত হবে</p>
                </div>
              </div>
              <button
                onClick={() => setShowBatchModal(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBatch} className="p-6 overflow-y-auto space-y-4 text-xs text-slate-700 dark:text-slate-300">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Batch Name Bn */}
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    ব্যাচের নাম (বাংলা) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={batchForm.nameBn}
                    onChange={(e) => setBatchForm({ ...batchForm, nameBn: e.target.value })}
                    required
                    placeholder="যেমন: সকাল ব্যাচ (সকাল ৮:০০ - ১০:০০) অথবা ৯ম শ্রেণি - গণিত স্পেশাল"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 font-bold"
                  />
                </div>

                {/* Time Slot Selector */}
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    সময়সূচী (Time Schedule / Time Slot) <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={batchForm.timeSlot}
                    onChange={(e) => setBatchForm({ ...batchForm, timeSlot: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 font-bold"
                  >
                    {predefinedTimeSlots.map((ts, idx) => (
                      <option key={idx} value={ts}>{ts}</option>
                    ))}
                  </select>
                </div>

                {/* Custom Time Slot if selected */}
                {batchForm.timeSlot === 'কাস্টম সময় (Custom Time)' && (
                  <div className="sm:col-span-2">
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      কাস্টম সময়সূচী লিখুন <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={batchForm.customTimeSlot}
                      onChange={(e) => setBatchForm({ ...batchForm, customTimeSlot: e.target.value })}
                      required
                      placeholder="যেমন: শুক্রবার ও শনিবার সকাল ১০:০০ - ১:০০"
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                    />
                  </div>
                )}

                {/* Class Selection */}
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    শ্রেণি (Class / Grade) <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={batchForm.classId}
                    onChange={(e) => {
                      const selected = classOptions.find(c => c.id === Number(e.target.value));
                      setBatchForm({
                        ...batchForm,
                        classId: Number(e.target.value),
                        className: selected ? selected.name : 'Class 9'
                      });
                    }}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 font-medium"
                  >
                    {classOptions.map((c) => (
                      <option key={c.id} value={c.id}>{c.nameBn} ({c.name})</option>
                    ))}
                  </select>
                </div>

                {/* Capacity */}
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    আসন ক্ষমতা (Seat Capacity) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="100"
                    value={batchForm.maxCapacity}
                    onChange={(e) => setBatchForm({ ...batchForm, maxCapacity: Number(e.target.value) })}
                    required
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 font-medium"
                  />
                </div>

                {/* Monthly Fee */}
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    মাসিক ফি (টাকা) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="100"
                    value={batchForm.monthlyFee}
                    onChange={(e) => setBatchForm({ ...batchForm, monthlyFee: Number(e.target.value) })}
                    required
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 font-medium"
                  />
                </div>

                {/* Room */}
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    কক্ষ / ল্যাব নম্বর
                  </label>
                  <input
                    type="text"
                    value={batchForm.room}
                    onChange={(e) => setBatchForm({ ...batchForm, room: e.target.value })}
                    placeholder="Room 201 / Science Lab A"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                  />
                </div>

                {/* Active Status Toggle */}
                <div className="sm:col-span-2 p-3.5 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">সক্রিয় স্ট্যাটাস (Active / Inactive)</span>
                    <span className="text-[11px] text-slate-400">সক্রিয় রাখলে শিক্ষার্থীরা ভর্তি ফর্মে এই ব্যাচটি নির্বাচন করতে পারবে</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setBatchForm({ ...batchForm, isActive: !batchForm.isActive })}
                    className="flex items-center space-x-1.5 focus:outline-none"
                  >
                    {batchForm.isActive ? (
                      <ToggleRight className="w-8 h-8 text-emerald-500" />
                    ) : (
                      <ToggleLeft className="w-8 h-8 text-slate-400" />
                    )}
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowBatchModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-200"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  disabled={savingBatch}
                  className="px-6 py-2 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 shadow-md shadow-indigo-600/20 disabled:opacity-50"
                >
                  {savingBatch ? t('processing') : 'সংরক্ষণ করুন'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STUDENT TRANSFER MODAL */}
      {/* ========================================================================= */}
      {showTransferModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                  <ArrowRightLeft className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-slate-900 dark:text-white">{t('transferStudentTitle')}</h3>
                  <p className="text-[11px] text-slate-500">{t('transferStudentSubtitle')}</p>
                </div>
              </div>
              <button
                onClick={() => setShowTransferModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleExecuteTransfer} className="space-y-3.5 text-xs text-slate-700 dark:text-slate-300">
              <div>
                <label className="block font-bold mb-1">
                  শিক্ষার্থী নির্বাচন করুন <span className="text-rose-500">*</span>
                </label>
                <select
                  value={transferForm.studentId}
                  onChange={(e) => setTransferForm({ ...transferForm, studentId: e.target.value })}
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                >
                  <option value="">-- শিক্ষার্থী নির্বাচন করুন --</option>
                  {allStudents.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.user?.name} (আইডি: {st.studentIdNumber || st.id}, রোল: {st.rollNo})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold mb-1">
                  গন্তব্য ব্যাচ নির্বাচন করুন <span className="text-rose-500">*</span>
                </label>
                <select
                  value={transferForm.toBatchId}
                  onChange={(e) => setTransferForm({ ...transferForm, toBatchId: e.target.value })}
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                >
                  <option value="">-- গন্তব্য ব্যাচ নির্বাচন করুন --</option>
                  {batches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.nameBn || b.name} ({b.timeSlot || 'সকাল ৮:০০ - ১০:০০'}) - আসন: {b.enrolledCount || 0}/{b.maxCapacity || b.capacity}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold mb-1">স্থানান্তরের কারণ (ঐচ্ছিক)</label>
                <textarea
                  rows="2"
                  value={transferForm.reason}
                  onChange={(e) => setTransferForm({ ...transferForm, reason: e.target.value })}
                  placeholder="যেমন: অভিভাবকের অনুরোধে সকালের শিফটে স্থানান্তর..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowTransferModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  disabled={transferringStudent}
                  className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 disabled:opacity-50"
                >
                  {transferringStudent ? t('processing') : 'স্থানান্তর সম্পন্ন করুন'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW BATCH ENROLLED STUDENTS MODAL */}
      {/* ========================================================================= */}
      {viewingBatchStudents && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-lg w-full p-6 space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="font-black text-sm text-slate-900 dark:text-white">
                  {viewingBatchStudents.nameBn || viewingBatchStudents.name}
                </h3>
                <p className="text-[11px] text-slate-500">
                  নিবন্ধিত শিক্ষার্থী তালিকা (মোট {viewingBatchStudents.enrolledCount || 0} জন)
                </p>
              </div>
              <button
                onClick={() => setViewingBatchStudents(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 space-y-2">
              {viewingBatchStudents.enrolledStudentsSummary && viewingBatchStudents.enrolledStudentsSummary.length > 0 ? (
                viewingBatchStudents.enrolledStudentsSummary.map((st, idx) => (
                  <div
                    key={st.id || idx}
                    className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white">{st.name}</span>
                      <span className="text-[11px] text-slate-400 block">
                        আইডি: {st.studentIdNumber || st.id} • রোল: {st.rollNo || '-'}
                      </span>
                    </div>
                    <button
                      onClick={() => handleOpenTransferModal(st.id, viewingBatchStudents.id)}
                      className="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-[11px] font-bold hover:bg-indigo-100"
                    >
                      স্থানান্তর
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-slate-400 text-xs">
                  এই ব্যাচে কোনো শিক্ষার্থী নিবন্ধিত নেই
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setViewingBatchStudents(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TRANSFER HISTORY MODAL */}
      {/* ========================================================================= */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-2xl w-full p-6 space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center space-x-2">
                <History className="w-5 h-5 text-amber-500" />
                <h3 className="font-black text-sm text-slate-900 dark:text-white">ব্যাচ স্থানান্তর হিস্ট্রি ও অডিট লগ</h3>
              </div>
              <button
                onClick={() => setShowHistoryModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 space-y-2 text-xs">
              {transferHistory.length > 0 ? (
                transferHistory.map((item, idx) => (
                  <div
                    key={item.id || idx}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-white">{item.student?.user?.name || 'শিক্ষার্থী'}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{item.transferDate || '২০২৬'}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-300">
                      <span className="text-rose-600">{item.fromBatch?.nameBn || 'পূর্ববর্তী ব্যাচ'}</span>
                      <ArrowRightLeft className="w-3 h-3 text-slate-400" />
                      <span className="text-emerald-600 font-bold">{item.toBatch?.nameBn || 'নতুন ব্যাচ'}</span>
                    </div>
                    {item.reason && <p className="text-[11px] text-slate-500 italic">কারণ: {item.reason}</p>}
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-slate-400">কোনো স্থানান্তর রেকর্ড পাওয়া যায়নি</div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setShowHistoryModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
