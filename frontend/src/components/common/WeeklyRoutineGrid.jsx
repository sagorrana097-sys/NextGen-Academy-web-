import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { routineAPI, batchAPI, adminAPI } from '../../services/api';
import PrintableRoutineSlipModal from './PrintableRoutineSlipModal';
import {
  CalendarDays,
  Clock,
  MapPin,
  UserCheck,
  BookOpen,
  Printer,
  Download,
  Plus,
  Edit2,
  Trash2,
  Filter,
  Layers,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  X,
  GraduationCap
} from 'lucide-react';

export default function WeeklyRoutineGrid({ viewMode = 'ADMIN', studentId = null }) {
  const { t, lang } = useLanguage();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [gridData, setGridData] = useState(null);
  const [batches, setBatches] = useState([]);
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);

  // Selected filters
  const [selectedBatchId, setSelectedBatchId] = useState('');
  const [selectedClassId, setSelectedClassId] = useState('11'); // default Class 8
  const [selectedTeacherId, setSelectedTeacherId] = useState('');

  // Admin Slot Modal
  const [showSlotModal, setShowSlotModal] = useState(false);
  const [showRoutineSlipModal, setShowRoutineSlipModal] = useState(false);
  const [savingSlot, setSavingSlot] = useState(false);
  const [slotConflictError, setSlotConflictError] = useState('');
  const [slotFeedback, setSlotFeedback] = useState(null);

  const [slotForm, setSlotForm] = useState({
    id: null,
    classId: 11,
    batchId: '',
    day: 'Saturday',
    dayNameBn: 'শনিবার',
    dayNameEn: 'Saturday',
    period: 1,
    startTime: '08:30 AM',
    endTime: '09:15 AM',
    subjectId: '',
    subjectNameBn: '',
    teacherId: '',
    room: 'Room 301',
    notes: ''
  });

  useEffect(() => {
    loadMetaAndInitialGrid();
  }, [viewMode, studentId]);

  const loadMetaAndInitialGrid = async () => {
    setLoading(true);
    setError(null);
    try {
      if (viewMode === 'ADMIN') {
        const [batchesRes, teachersRes] = await Promise.all([
          batchAPI.getAll(),
          adminAPI.getTeachers()
        ]);
        if (batchesRes.success) setBatches(batchesRes.data || []);
        if (teachersRes.success) setTeachers(teachersRes.data || []);

        const initialBatch = batchesRes.data?.[2] || batchesRes.data?.[0];
        if (initialBatch) {
          setSelectedBatchId(String(initialBatch.id));
          setSelectedClassId(String(initialBatch.classId));
          await fetchGrid({ batchId: initialBatch.id });
        } else {
          await fetchGrid({ classId: 11 });
        }
      } else {
        // Teacher, Student, Parent contextual schedule
        const res = await routineAPI.getMySchedule(studentId ? { studentId } : {});
        if (res.success) {
          setGridData(res.data);
        }
      }
    } catch (err) {
      console.error('Failed to load routine grid:', err);
      setError(err.message || 'ক্লাস রুটিন লোড করতে ব্যর্থ হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  const fetchGrid = async (params = {}) => {
    setLoading(true);
    try {
      const res = await routineAPI.getWeeklyGrid(params);
      if (res.success) {
        setGridData(res.data);
      }
    } catch (err) {
      setError(err.message || 'রুটিন লোড ব্যর্থ হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  const handleBatchChange = (batchId) => {
    setSelectedBatchId(batchId);
    setSelectedTeacherId('');
    if (batchId) {
      const found = batches.find((b) => String(b.id) === String(batchId));
      if (found) setSelectedClassId(String(found.classId));
      fetchGrid({ batchId });
    } else {
      fetchGrid({ classId: selectedClassId });
    }
  };

  const handleClassChange = (classId) => {
    setSelectedClassId(classId);
    setSelectedBatchId('');
    setSelectedTeacherId('');
    fetchGrid({ classId });
  };

  const handleTeacherChange = (teacherId) => {
    setSelectedTeacherId(teacherId);
    setSelectedBatchId('');
    if (teacherId) {
      fetchGrid({ teacherId });
    } else {
      fetchGrid({ classId: selectedClassId });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Admin Slot Management
  const handleOpenAddSlot = (dayObj, periodInfo, existingSlot = null) => {
    setSlotConflictError('');
    if (existingSlot) {
      setSlotForm({
        id: existingSlot.id,
        classId: existingSlot.classId || Number(selectedClassId),
        batchId: existingSlot.batchId || selectedBatchId || '',
        day: existingSlot.dayNameEn || dayObj.dayEn,
        dayNameBn: existingSlot.dayNameBn || dayObj.dayBn,
        dayNameEn: existingSlot.dayNameEn || dayObj.dayEn,
        period: existingSlot.period || periodInfo.period,
        startTime: existingSlot.startTime || periodInfo.startTime,
        endTime: existingSlot.endTime || periodInfo.endTime,
        subjectId: existingSlot.subjectId || '',
        subjectNameBn: existingSlot.subjectNameBn || '',
        teacherId: existingSlot.teacherId || '',
        room: existingSlot.room || 'Room 301',
        notes: existingSlot.notes || ''
      });
    } else {
      setSlotForm({
        id: null,
        classId: Number(selectedClassId) || 11,
        batchId: selectedBatchId ? Number(selectedBatchId) : '',
        day: dayObj?.dayEn || 'Saturday',
        dayNameBn: dayObj?.dayBn || 'শনিবার',
        dayNameEn: dayObj?.dayEn || 'Saturday',
        period: periodInfo?.period || 1,
        startTime: periodInfo?.startTime || '08:30 AM',
        endTime: periodInfo?.endTime || '09:15 AM',
        subjectId: 62,
        subjectNameBn: 'গণিত',
        teacherId: teachers[0]?.id || 1,
        room: 'Room 301',
        notes: ''
      });
    }
    setShowSlotModal(true);
  };

  const handleSaveSlot = async (e) => {
    e.preventDefault();
    setSavingSlot(true);
    setSlotConflictError('');
    try {
      const selectedTeacher = teachers.find((t) => Number(t.id) === Number(slotForm.teacherId));
      const payload = {
        ...slotForm,
        classId: Number(slotForm.classId),
        batchId: slotForm.batchId ? Number(slotForm.batchId) : null,
        period: Number(slotForm.period),
        subjectId: Number(slotForm.subjectId) || 62,
        teacherId: Number(slotForm.teacherId)
      };

      const res = await routineAPI.saveSlot(payload);
      if (res.success) {
        setSlotFeedback({ type: 'success', msg: 'রুটিন পিরিয়ড সফলভাবে সংরক্ষণ করা হয়েছে!' });
        setShowSlotModal(false);
        if (selectedBatchId) fetchGrid({ batchId: selectedBatchId });
        else fetchGrid({ classId: selectedClassId });
        setTimeout(() => setSlotFeedback(null), 3000);
      }
    } catch (err) {
      setSlotConflictError(err.message || 'রুটিন সংরক্ষণে সমস্যা হয়েছে');
    } finally {
      setSavingSlot(false);
    }
  };

  const handleDeleteSlot = async (slotId) => {
    if (!window.confirm('আপনি কি নিশ্চিতভাবে এই রুটিন পিরিয়ড স্লটটি মুছে ফেলতে চান?')) return;
    try {
      await routineAPI.deleteSlot(slotId);
      setSlotFeedback({ type: 'success', msg: 'স্লটটি সফলভাবে মুছে ফেলা হয়েছে' });
      if (selectedBatchId) fetchGrid({ batchId: selectedBatchId });
      else fetchGrid({ classId: selectedClassId });
      setTimeout(() => setSlotFeedback(null), 3000);
    } catch (err) {
      alert(err.message || 'মুছতে ব্যর্থ হয়েছে');
    }
  };

  // Color mapper for subject badge
  const getSubjectColor = (subjectName = '') => {
    const s = subjectName.toLowerCase();
    if (s.includes('গণিত') || s.includes('math')) return 'from-blue-600 to-indigo-700 text-white';
    if (s.includes('পদার্থ') || s.includes('physics')) return 'from-purple-600 to-indigo-800 text-white';
    if (s.includes('রসায়ন') || s.includes('chemistry')) return 'from-teal-600 to-emerald-700 text-white';
    if (s.includes('ইংরেজি') || s.includes('english')) return 'from-amber-600 to-orange-700 text-white';
    if (s.includes('বাংলা') || s.includes('bangla')) return 'from-rose-600 to-pink-700 text-white';
    if (s.includes('আইসিটি') || s.includes('ict')) return 'from-cyan-600 to-blue-700 text-white';
    if (s.includes('জীববিজ্ঞান') || s.includes('biology')) return 'from-emerald-600 to-teal-800 text-white';
    return 'from-slate-700 to-slate-900 text-white';
  };

  const grid = gridData?.grid || [];
  const meta = gridData?.meta || {};

  return (
    <div className="space-y-6">
      {/* Printable Letterhead Banner (Visible during Print only) */}
      <div className="hidden print:flex flex-col items-center justify-center pb-4 mb-4 border-b-2 border-slate-900 text-center">
        <div className="flex items-center space-x-3 mb-1">
          <img src="/logo.png" alt="NextGen Academy" className="w-16 h-16 object-contain" />
          <div className="text-left">
            <h1 className="text-xl font-black text-slate-900">নেক্সটজেন একাডেমি (NextGen Academy)</h1>
            <p className="text-xs font-semibold text-slate-600">স্মার্ট অ্যাকাডেমিক পোর্টাল ও সাপ্তাহিক ক্লাস রুটিন ২০২৬</p>
          </div>
        </div>
        <div className="w-full mt-2 pt-2 border-t border-slate-300 flex items-center justify-between text-xs font-bold text-slate-700">
          <span>শ্রেণি / ব্যাচ: {meta.batch?.nameBn || meta.class?.nameBn || '৮ম শ্রেণি'}</span>
          <span>শিফট: {meta.batch?.shift || 'মর্নিং/ডে'}</span>
          <span>প্রিন্ট তারিখ: {new Date().toLocaleDateString('bn-BD')}</span>
        </div>
      </div>

      {/* Screen Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-slate-700/60 print:hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold">
              <CalendarDays className="w-3.5 h-3.5" />
              <span>{lang === 'bn' ? 'সাপ্তাহিক অ্যাকাডেমিক টাইমটেবিল' : 'Weekly Timetable Matrix'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white">
              {t('classRoutineTitle')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl font-medium">
              {t('classRoutineSubtitle')}
            </p>
          </div>

          <div className="flex items-center space-x-3 self-start md:self-auto">
            <button
              onClick={() => setShowRoutineSlipModal(true)}
              className="px-5 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs shadow-lg transition-all flex items-center space-x-2 backdrop-blur-md"
            >
              <Printer className="w-4 h-4 text-emerald-400" />
              <span>{t('printRoutine') || 'রুটিন প্রিন্ট / PDF'}</span>
            </button>

            {viewMode === 'ADMIN' && (
              <button
                onClick={() => handleOpenAddSlot({ dayEn: 'Saturday', dayBn: 'শনিবার' }, { period: 1, startTime: '08:30 AM', endTime: '09:15 AM' })}
                className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-lg shadow-emerald-600/30 transition-all flex items-center space-x-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>{t('addRoutineSlot')}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Feedback Alert */}
      {slotFeedback && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center space-x-2 animate-in fade-in print:hidden">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{slotFeedback.msg}</span>
        </div>
      )}

      {/* Admin Filters (Class / Batch / Teacher) */}
      {viewMode === 'ADMIN' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm space-y-3 print:hidden">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Batch Selector */}
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <Layers className="w-4 h-4 text-indigo-600 flex-shrink-0" />
              <span className="text-xs font-bold text-slate-700 whitespace-nowrap">ব্যাচ নির্বাচন:</span>
              <select
                value={selectedBatchId}
                onChange={(e) => handleBatchChange(e.target.value)}
                className="w-full sm:w-auto px-3 py-2 text-xs font-bold rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500 font-medium"
              >
                <option value="">-- ব্যাচ অনুযায়ী ফিল্টার --</option>
                {batches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.nameBn} ({b.shift})
                  </option>
                ))}
              </select>
            </div>

            {/* Class Selector */}
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <GraduationCap className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <span className="text-xs font-bold text-slate-700 whitespace-nowrap">শ্রেণি:</span>
              <select
                value={selectedClassId}
                onChange={(e) => handleClassChange(e.target.value)}
                className="w-full sm:w-auto px-3 py-2 text-xs font-bold rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500 font-medium"
              >
                <option value="10">৭ম শ্রেণি (Class 7)</option>
                <option value="11">৮ম শ্রেণি (Class 8)</option>
                <option value="12">৯ম শ্রেণি (Class 9)</option>
                <option value="13">১০ম শ্রেণি (Class 10)</option>
              </select>
            </div>

            {/* Teacher Selector */}
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <UserCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span className="text-xs font-bold text-slate-700 whitespace-nowrap">শিক্ষক:</span>
              <select
                value={selectedTeacherId}
                onChange={(e) => handleTeacherChange(e.target.value)}
                className="w-full sm:w-auto px-3 py-2 text-xs font-bold rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500 font-medium"
              >
                <option value="">-- শিক্ষক অনুযায়ী রুটিন --</option>
                {teachers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name || t.user?.name} ({t.specialization})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Routine Grid Table */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[350px] bg-white rounded-3xl border border-slate-200">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-center text-rose-700">
          <AlertCircle className="w-8 h-8 mx-auto mb-2 text-rose-500" />
          <p className="font-bold text-sm">{error}</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden print:border-none print:shadow-none">
          {/* Table Active Context Bar */}
          <div className="bg-slate-900 text-white p-4 flex items-center justify-between print:hidden">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-black">
                {meta.batch?.nameBn || meta.class?.nameBn || (meta.teacher ? `${meta.teacher.name || meta.teacher.user?.name}-এর শিক্ষক রুটিন` : 'সাপ্তাহিক রুটিন শিডিউল')}
              </span>
              {meta.batch?.shift && (
                <span className="px-2 py-0.5 rounded-full bg-white/10 text-amber-300 text-[10px] font-bold">
                  {meta.batch.shift}
                </span>
              )}
            </div>

            <span className="text-[11px] text-slate-300">
              ৬ দিনের সাপ্তাহিক পাঠদান কার্যক্রম
            </span>
          </div>

          {/* Matrix Grid */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100/90 text-slate-700 font-bold border-b border-slate-200">
                  <th className="py-3 px-4 w-28 bg-slate-200/80 sticky left-0 z-10 uppercase tracking-wider text-[11px]">
                    {t('day')}
                  </th>
                  <th className="py-3 px-3 min-w-[160px] text-center border-l border-slate-200">
                    <div className="font-black text-slate-900">১ম পিরিয়ড</div>
                    <span className="text-[10px] font-mono text-slate-500">08:30 AM - 09:15 AM</span>
                  </th>
                  <th className="py-3 px-3 min-w-[160px] text-center border-l border-slate-200">
                    <div className="font-black text-slate-900">২য় পিরিয়ড</div>
                    <span className="text-[10px] font-mono text-slate-500">09:20 AM - 10:05 AM</span>
                  </th>
                  <th className="py-3 px-3 min-w-[160px] text-center border-l border-slate-200">
                    <div className="font-black text-slate-900">৩য় পিরিয়ড</div>
                    <span className="text-[10px] font-mono text-slate-500">10:10 AM - 10:55 AM</span>
                  </th>
                  <th className="py-3 px-2 w-14 bg-amber-50/80 text-amber-900 text-center border-l border-amber-200 text-[10px] font-black uppercase">
                    টিফিন
                  </th>
                  <th className="py-3 px-3 min-w-[160px] text-center border-l border-slate-200">
                    <div className="font-black text-slate-900">৪র্থ পিরিয়ড</div>
                    <span className="text-[10px] font-mono text-slate-500">11:30 AM - 12:15 PM</span>
                  </th>
                  <th className="py-3 px-3 min-w-[160px] text-center border-l border-slate-200">
                    <div className="font-black text-slate-900">৫ম পিরিয়ড</div>
                    <span className="text-[10px] font-mono text-slate-500">12:20 PM - 01:05 PM</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {grid.map((dayRow, dIdx) => (
                  <tr key={dayRow.dayId} className="hover:bg-slate-50/50 transition-colors">
                    {/* Day Column */}
                    <td className="py-4 px-4 font-black text-slate-900 bg-slate-50/80 sticky left-0 z-10 border-r border-slate-200">
                      <div>
                        <span className="text-sm font-black text-slate-900 block">{dayRow.dayBn}</span>
                        <span className="text-[10px] text-slate-400 font-medium">{dayRow.dayEn}</span>
                      </div>
                    </td>

                    {/* Periods 1, 2, 3 */}
                    {dayRow.periods.slice(0, 3).map((periodInfo) => {
                      const slot = periodInfo.slot;
                      return (
                        <td key={periodInfo.period} className="p-2.5 align-top border-l border-slate-200">
                          {slot ? (
                            <div className={`p-3 rounded-2xl bg-gradient-to-br ${getSubjectColor(slot.subjectNameBn || slot.subject?.nameBn)} shadow-sm relative group overflow-hidden`}>
                              <div className="flex items-start justify-between gap-1">
                                <span className="text-[10px] font-black uppercase tracking-wider opacity-80">
                                  পিরিয়ড {slot.period}
                                </span>
                                {viewMode === 'ADMIN' && (
                                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-1">
                                    <button
                                      onClick={() => handleOpenAddSlot(dayRow, periodInfo, slot)}
                                      className="p-1 rounded-md bg-white/20 hover:bg-white/40 text-white"
                                      title="সম্পাদনা"
                                    >
                                      <Edit2 className="w-3 h-3" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteSlot(slot.id)}
                                      className="p-1 rounded-md bg-rose-500/80 hover:bg-rose-600 text-white"
                                      title="মুছুন"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  </div>
                                )}
                              </div>

                              <h4 className="font-black text-sm text-white mt-1">
                                {slot.subjectNameBn || slot.subject?.nameBn || 'সাধারণ বিষয়'}
                              </h4>

                              <div className="mt-2 space-y-1 text-[11px] text-white/90">
                                <div className="flex items-center space-x-1.5 truncate">
                                  <UserCheck className="w-3 h-3 flex-shrink-0" />
                                  <span className="truncate font-semibold">
                                    {slot.teacher?.name || slot.teacher?.user?.name || 'শিক্ষক'}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-1.5 truncate text-[10px] opacity-80">
                                  <MapPin className="w-3 h-3 flex-shrink-0" />
                                  <span className="truncate">{slot.room || 'রুম ২০১'}</span>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div
                              onClick={() => viewMode === 'ADMIN' && handleOpenAddSlot(dayRow, periodInfo)}
                              className={`h-28 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-2 text-center text-slate-400 ${
                                viewMode === 'ADMIN' ? 'hover:border-indigo-400 hover:bg-indigo-50/50 cursor-pointer transition-all' : ''
                              }`}
                            >
                              <span className="text-[11px] font-semibold">-- পাঠদান নেই --</span>
                              {viewMode === 'ADMIN' && (
                                <span className="text-[10px] text-indigo-600 font-bold mt-1 flex items-center gap-0.5">
                                  <Plus className="w-3 h-3" /> পিরিয়ড যুক্ত
                                </span>
                              )}
                            </div>
                          )}
                        </td>
                      );
                    })}

                    {/* Tiffin Break Column */}
                    <td className="p-2 bg-amber-50/50 text-amber-800 text-center align-middle font-bold text-[10px] border-l border-amber-200">
                      <span className="writing-vertical rotate-180 block tracking-widest uppercase">টিফিন বিরতি</span>
                    </td>

                    {/* Periods 4, 5 */}
                    {dayRow.periods.slice(3, 5).map((periodInfo) => {
                      const slot = periodInfo.slot;
                      return (
                        <td key={periodInfo.period} className="p-2.5 align-top border-l border-slate-200">
                          {slot ? (
                            <div className={`p-3 rounded-2xl bg-gradient-to-br ${getSubjectColor(slot.subjectNameBn || slot.subject?.nameBn)} shadow-sm relative group overflow-hidden`}>
                              <div className="flex items-start justify-between gap-1">
                                <span className="text-[10px] font-black uppercase tracking-wider opacity-80">
                                  পিরিয়ড {slot.period}
                                </span>
                                {viewMode === 'ADMIN' && (
                                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-1">
                                    <button
                                      onClick={() => handleOpenAddSlot(dayRow, periodInfo, slot)}
                                      className="p-1 rounded-md bg-white/20 hover:bg-white/40 text-white"
                                      title="সম্পাদনা"
                                    >
                                      <Edit2 className="w-3 h-3" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteSlot(slot.id)}
                                      className="p-1 rounded-md bg-rose-500/80 hover:bg-rose-600 text-white"
                                      title="মুছুন"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  </div>
                                )}
                              </div>

                              <h4 className="font-black text-sm text-white mt-1">
                                {slot.subjectNameBn || slot.subject?.nameBn || 'সাধারণ বিষয়'}
                              </h4>

                              <div className="mt-2 space-y-1 text-[11px] text-white/90">
                                <div className="flex items-center space-x-1.5 truncate">
                                  <UserCheck className="w-3 h-3 flex-shrink-0" />
                                  <span className="truncate font-semibold">
                                    {slot.teacher?.name || slot.teacher?.user?.name || 'শিক্ষক'}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-1.5 truncate text-[10px] opacity-80">
                                  <MapPin className="w-3 h-3 flex-shrink-0" />
                                  <span className="truncate">{slot.room || 'রুম ২০১'}</span>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div
                              onClick={() => viewMode === 'ADMIN' && handleOpenAddSlot(dayRow, periodInfo)}
                              className={`h-28 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-2 text-center text-slate-400 ${
                                viewMode === 'ADMIN' ? 'hover:border-indigo-400 hover:bg-indigo-50/50 cursor-pointer transition-all' : ''
                              }`}
                            >
                              <span className="text-[11px] font-semibold">-- পাঠদান নেই --</span>
                              {viewMode === 'ADMIN' && (
                                <span className="text-[10px] text-indigo-600 font-bold mt-1 flex items-center gap-0.5">
                                  <Plus className="w-3 h-3" /> পিরিয়ড যুক্ত
                                </span>
                              )}
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Printable Signature Footers (Visible during Print only) */}
          <div className="hidden print:grid grid-cols-3 gap-8 pt-16 text-center text-xs font-bold text-slate-800">
            <div className="border-t border-slate-400 pt-2">শ্রেণি শিক্ষক / ক্লাস টিচার</div>
            <div className="border-t border-slate-400 pt-2">অ্যাকাডেমিক কো-অর্ডিনেটর</div>
            <div className="border-t border-slate-400 pt-2">অধ্যক্ষ / প্রিন্সিপাল</div>
          </div>
        </div>
      )}

      {/* ADD / EDIT ROUTINE SLOT MODAL (FOR ADMIN) */}
      {showSlotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <CalendarDays className="w-5 h-5 text-indigo-600" />
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900">
                    {slotForm.id ? t('editRoutineSlot') : t('addRoutineSlot')}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {slotForm.dayNameBn} • পিরিয়ড {slotForm.period} ({slotForm.startTime} - {slotForm.endTime})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowSlotModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {slotConflictError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                <span className="font-bold leading-relaxed">{slotConflictError}</span>
              </div>
            )}

            <form onSubmit={handleSaveSlot} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {t('day')} <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={slotForm.dayNameEn}
                    onChange={(e) => {
                      const daysMap = {
                        Saturday: 'শনিবার',
                        Sunday: 'রবিবার',
                        Monday: 'সোমবার',
                        Tuesday: 'মঙ্গলবার',
                        Wednesday: 'বুধবার',
                        Thursday: 'বৃহস্পতিবার'
                      };
                      setSlotForm({
                        ...slotForm,
                        day: e.target.value,
                        dayNameEn: e.target.value,
                        dayNameBn: daysMap[e.target.value] || e.target.value
                      });
                    }}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-medium bg-white"
                  >
                    <option value="Saturday">শনিবার (Saturday)</option>
                    <option value="Sunday">রবিবার (Sunday)</option>
                    <option value="Monday">সোমবার (Monday)</option>
                    <option value="Tuesday">মঙ্গলবার (Tuesday)</option>
                    <option value="Wednesday">বুধবার (Wednesday)</option>
                    <option value="Thursday">বৃহস্পতিবার (Thursday)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {t('period')} <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={slotForm.period}
                    onChange={(e) => {
                      const p = Number(e.target.value);
                      const timeSlots = {
                        1: { start: '08:30 AM', end: '09:15 AM' },
                        2: { start: '09:20 AM', end: '10:05 AM' },
                        3: { start: '10:10 AM', end: '10:55 AM' },
                        4: { start: '11:30 AM', end: '12:15 PM' },
                        5: { start: '12:20 PM', end: '01:05 PM' }
                      };
                      setSlotForm({
                        ...slotForm,
                        period: p,
                        startTime: timeSlots[p]?.start || '08:30 AM',
                        endTime: timeSlots[p]?.end || '09:15 AM'
                      });
                    }}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-medium bg-white"
                  >
                    <option value={1}>১ম পিরিয়ড (08:30 - 09:15)</option>
                    <option value={2}>২য় পিরিয়ড (09:20 - 10:05)</option>
                    <option value={3}>৩য় পিরিয়ড (10:10 - 10:55)</option>
                    <option value={4}>৪র্থ পিরিয়ড (11:30 - 12:15)</option>
                    <option value={5}>৫ম পিরিয়ড (12:20 - 01:05)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  বিষয়ের নাম <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={slotForm.subjectNameBn}
                  onChange={(e) => setSlotForm({ ...slotForm, subjectNameBn: e.target.value })}
                  required
                  placeholder="যেমন: গণিত / পদার্থবিজ্ঞান / ইংরেজি"
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  শিক্ষক নির্বাচন <span className="text-rose-500">*</span>
                </label>
                <select
                  value={slotForm.teacherId}
                  onChange={(e) => setSlotForm({ ...slotForm, teacherId: Number(e.target.value) })}
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 font-medium bg-white"
                >
                  <option value="">-- বিষয় শিক্ষক নির্বাচন করুন --</option>
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name || t.user?.name} ({t.specialization || 'অনুষদ'})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  কক্ষ / ল্যাব নম্বর
                </label>
                <input
                  type="text"
                  value={slotForm.room}
                  onChange={(e) => setSlotForm({ ...slotForm, room: e.target.value })}
                  placeholder="Room 301 / Science Lab"
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowSlotModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  disabled={savingSlot}
                  className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 shadow-md shadow-indigo-600/20 disabled:opacity-50"
                >
                  {savingSlot ? t('processing') : t('save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Class Routine PDF Slip Modal */}
      {showRoutineSlipModal && (
        <PrintableRoutineSlipModal
          isOpen={showRoutineSlipModal}
          onClose={() => setShowRoutineSlipModal(false)}
          routineData={grid}
          classInfo={classes.find((c) => String(c.id) === String(selectedClassId)) || { id: selectedClassId, nameBn: 'শ্রেণি' }}
          batchInfo={batches.find((b) => String(b.id) === String(selectedBatchId)) || { id: selectedBatchId, nameBn: 'সাধারণ ব্যাচ' }}
        />
      )}
    </div>
  );
}
