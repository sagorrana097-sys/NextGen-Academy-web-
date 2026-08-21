import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { resultsAPI, curriculumAPI, batchAPI } from '../../services/api';
import HallOfFameManager from './HallOfFameManager';
import {
  Award,
  BookOpen,
  Users,
  CheckCircle2,
  AlertCircle,
  Search,
  Printer,
  Download,
  Filter,
  Layers,
  Sparkles,
  Save,
  Trophy,
  FileText,
  TrendingUp,
  Percent,
  Calendar,
  GraduationCap,
  ChevronRight,
  Eye,
  Check,
  X,
  UserCheck
} from 'lucide-react';

export default function ResultsManager({ userRole = 'ADMIN' }) {
  const { t, lang } = useLanguage();
  const { user } = useAuth();

  // Active Sub-tab: 'marks' | 'merit' | 'report-card' | 'tabulation'
  const [activeSubTab, setActiveSubTab] = useState('marks');

  // Meta selection states
  const [terms, setTerms] = useState([]);
  const [classes, setClasses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [selectedTermId, setSelectedTermId] = useState(1);
  const [selectedClassId, setSelectedClassId] = useState(11); // default Class 8
  const [selectedBatchId, setSelectedBatchId] = useState('');
  const [selectedSubjectId, setSelectedSubjectId] = useState('');

  // Marks Entry State
  const [marksSheetData, setMarksSheetData] = useState(null);
  const [studentMarksList, setStudentMarksList] = useState([]);
  const [loadingSheet, setLoadingSheet] = useState(false);
  const [savingMarks, setSavingMarks] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // Merit List State
  const [meritData, setMeritData] = useState(null);
  const [loadingMerit, setLoadingMerit] = useState(false);

  // Report Card State
  const [selectedReportStudentId, setSelectedReportStudentId] = useState(null);
  const [reportCardData, setReportCardData] = useState(null);
  const [loadingReportCard, setLoadingReportCard] = useState(false);

  // Tabulation State
  const [tabulationData, setTabulationData] = useState(null);
  const [loadingTabulation, setLoadingTabulation] = useState(false);

  useEffect(() => {
    loadInitialMeta();
  }, []);

  useEffect(() => {
    if (selectedClassId) {
      loadSubjectsForClass(selectedClassId);
    }
  }, [selectedClassId]);

  useEffect(() => {
    if (activeSubTab === 'marks' && selectedClassId && selectedSubjectId) {
      fetchMarksSheet();
    } else if (activeSubTab === 'merit' && selectedClassId) {
      fetchMeritList();
    } else if (activeSubTab === 'reportCard' && selectedReportStudentId) {
      fetchReportCard(selectedReportStudentId);
    } else if (activeSubTab === 'tabulation' && selectedClassId) {
      fetchTabulationSheet();
    }
  }, [activeSubTab, selectedClassId, selectedBatchId, selectedSubjectId, selectedTermId]);

  const loadInitialMeta = async () => {
    try {
      const [termsRes, classesRes, batchesRes] = await Promise.all([
        resultsAPI.getTerms(),
        curriculumAPI.getClasses(),
        batchAPI.getAll()
      ]);

      if (termsRes.success) {
        setTerms(termsRes.data || []);
        if (termsRes.data?.length > 0) setSelectedTermId(termsRes.data[0].id);
      }

      const availableClasses = [
        { id: 10, nameBn: '৭ম শ্রেণি (Class 7)' },
        { id: 11, nameBn: '৮ম শ্রেণি (Class 8)' },
        { id: 12, nameBn: '৯ম শ্রেণি (Class 9)' },
        { id: 13, nameBn: '১০ম শ্রেণি (Class 10)' }
      ];
      setClasses(availableClasses);

      if (batchesRes.success) {
        setBatches(batchesRes.data || []);
      }

      await loadSubjectsForClass(11);
    } catch (err) {
      console.error('Failed to load results meta:', err);
    }
  };

  const loadSubjectsForClass = async (classId) => {
    try {
      const res = await curriculumAPI.getSubjects(classId);
      if (res.success && res.data) {
        setSubjects(res.data);
        if (res.data.length > 0) {
          setSelectedSubjectId(res.data[0].id);
        }
      }
    } catch (err) {
      console.error('Failed to load subjects:', err);
    }
  };

  // 1. Fetch Marks Sheet
  const fetchMarksSheet = async () => {
    setLoadingSheet(true);
    try {
      const res = await resultsAPI.getMarksSheet({
        classId: selectedClassId,
        batchId: selectedBatchId || '',
        subjectId: selectedSubjectId,
        examTermId: selectedTermId
      });
      if (res.success && res.data) {
        setMarksSheetData(res.data);
        setStudentMarksList(res.data.students || []);
      }
    } catch (err) {
      console.error('Failed to fetch marks sheet:', err);
    } finally {
      setLoadingSheet(false);
    }
  };

  // 2. Fetch Merit List
  const fetchMeritList = async () => {
    setLoadingMerit(true);
    try {
      const res = await resultsAPI.getMeritList({
        classId: selectedClassId,
        batchId: selectedBatchId || '',
        examTermId: selectedTermId
      });
      if (res.success && res.data) {
        setMeritData(res.data);
        if (!selectedReportStudentId && res.data.meritList?.length > 0) {
          setSelectedReportStudentId(res.data.meritList[0].studentId);
        }
      }
    } catch (err) {
      console.error('Failed to fetch merit list:', err);
    } finally {
      setLoadingMerit(false);
    }
  };

  // 3. Fetch Report Card
  const fetchReportCard = async (studentId) => {
    setLoadingReportCard(true);
    try {
      const res = await resultsAPI.getReportCard(studentId, {
        examTermId: selectedTermId
      });
      if (res.success && res.data) {
        setReportCardData(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch report card:', err);
    } finally {
      setLoadingReportCard(false);
    }
  };

  // 4. Fetch Tabulation Sheet
  const fetchTabulationSheet = async () => {
    setLoadingTabulation(true);
    try {
      const res = await resultsAPI.getTabulationSheet({
        classId: selectedClassId,
        batchId: selectedBatchId || '',
        examTermId: selectedTermId
      });
      if (res.success && res.data) {
        setTabulationData(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch tabulation sheet:', err);
    } finally {
      setLoadingTabulation(false);
    }
  };

  // Handle Mark Input Change in Spreadsheet
  const handleMarkChange = (studentId, field, val) => {
    const numVal = val === '' ? 0 : Number(val);
    setStudentMarksList((prev) =>
      prev.map((st) => {
        if (st.studentId === studentId) {
          const updated = { ...st, [field]: numVal };
          const cq = field === 'cqMarks' ? numVal : Number(st.cqMarks || 0);
          const mcq = field === 'mcqMarks' ? numVal : Number(st.mcqMarks || 0);
          const practical = field === 'practicalMarks' ? numVal : Number(st.practicalMarks || 0);
          const total = Math.min(100, cq + mcq + practical);

          let gp = 0.0;
          let grade = 'F';
          if (total >= 80) { gp = 5.0; grade = 'A+'; }
          else if (total >= 70) { gp = 4.0; grade = 'A'; }
          else if (total >= 60) { gp = 3.5; grade = 'A-'; }
          else if (total >= 50) { gp = 3.0; grade = 'B'; }
          else if (total >= 40) { gp = 2.0; grade = 'C'; }
          else if (total >= 33) { gp = 1.0; grade = 'D'; }

          updated.obtainedMarks = total;
          updated.gradePoint = gp;
          updated.letterGrade = grade;
          return updated;
        }
        return st;
      })
    );
  };

  const handleRemarkChange = (studentId, remarks) => {
    setStudentMarksList((prev) =>
      prev.map((st) => (st.studentId === studentId ? { ...st, teacherRemarks: remarks } : st))
    );
  };

  // Bulk Save Marks
  const handleBulkSave = async () => {
    setSavingMarks(true);
    setFeedback(null);
    try {
      const payload = {
        examTermId: selectedTermId,
        classId: selectedClassId,
        subjectId: selectedSubjectId,
        batchId: selectedBatchId || null,
        marksList: studentMarksList.map((s) => ({
          studentId: s.studentId,
          cqMarks: s.cqMarks,
          mcqMarks: s.mcqMarks,
          practicalMarks: s.practicalMarks,
          teacherRemarks: s.teacherRemarks
        }))
      };

      const res = await resultsAPI.saveBulkMarks(payload);
      setFeedback({ type: 'success', msg: res.message || 'সকল নম্বর সফলভাবে সংরক্ষণ ও GPA হিসাব সম্পন্ন হয়েছে!' });
      fetchMarksSheet();
      setTimeout(() => setFeedback(null), 4000);
    } catch (err) {
      alert(err.message || 'নম্বর সংরক্ষণে সমস্যা হয়েছে');
    } finally {
      setSavingMarks(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const getGradeBadgeColor = (grade) => {
    switch (grade) {
      case 'A+': return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'A': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'A-': return 'bg-cyan-100 text-cyan-800 border-cyan-300';
      case 'B': return 'bg-indigo-100 text-indigo-800 border-indigo-300';
      case 'C': return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'D': return 'bg-orange-100 text-orange-800 border-orange-300';
      default: return 'bg-rose-100 text-rose-800 border-rose-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-slate-700/60 print:hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/4 -bottom-10 w-60 h-60 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold">
              <Award className="w-3.5 h-3.5" />
              <span>{lang === 'bn' ? 'জাতীয় শিক্ষাক্রম গ্রেডিং ও ফলাফল জেনারেটর' : 'National Grading & Result Engine'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white">
              {t('resultsManagerTitle')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl font-medium">
              {t('resultsManagerSubtitle')}
            </p>
          </div>

          <div className="flex items-center space-x-3 self-start md:self-auto">
            <button
              onClick={handlePrint}
              className="px-5 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs shadow-lg transition-all flex items-center space-x-2 backdrop-blur-md"
            >
              <Printer className="w-4 h-4 text-emerald-400" />
              <span>{t('printReportCard')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sub-tab Navigation Bar */}
      <div className="flex flex-wrap items-center gap-2 bg-slate-200/80 p-1.5 rounded-2xl border border-slate-300/60 shadow-inner w-fit print:hidden">
        <button
          onClick={() => setActiveSubTab('marks')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
            activeSubTab === 'marks'
              ? 'bg-slate-900 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <FileText className="w-4 h-4 text-indigo-400" />
          <span>{t('marksEntryTab')}</span>
        </button>

        <button
          onClick={() => {
            setActiveSubTab('merit');
            fetchMeritList();
          }}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
            activeSubTab === 'merit'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <Trophy className="w-4 h-4 text-amber-300" />
          <span>{t('meritListTab')}</span>
        </button>

        <button
          onClick={() => {
            setActiveSubTab('reportCard');
            if (selectedReportStudentId) fetchReportCard(selectedReportStudentId);
          }}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
            activeSubTab === 'reportCard'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <Award className="w-4 h-4 text-emerald-200" />
          <span>{t('reportCardTab')}</span>
        </button>

        <button
          onClick={() => {
            setActiveSubTab('tabulation');
            fetchTabulationSheet();
          }}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
            activeSubTab === 'tabulation'
              ? 'bg-slate-900 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <BookOpen className="w-4 h-4 text-cyan-400" />
          <span>{t('tabulationSheetTab')}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('hall-of-fame')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
            activeSubTab === 'hall-of-fame'
              ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black shadow-md shadow-amber-500/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <Trophy className="w-4 h-4 text-amber-500" />
          <span>{lang === 'bn' ? '🏆 টপ স্কোরার ও হল অফ ফেম' : '🏆 Hall of Fame'}</span>
        </button>
      </div>

      {/* Global Filter Bar */}
      {activeSubTab !== 'hall-of-fame' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm space-y-3 print:hidden">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {/* Exam Term */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1">
              {t('examTerm')}
            </label>
            <select
              value={selectedTermId}
              onChange={(e) => setSelectedTermId(Number(e.target.value))}
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500"
            >
              {terms.map((term) => (
                <option key={term.id} value={term.id}>
                  {term.titleBn} ({term.academicYear})
                </option>
              ))}
            </select>
          </div>

          {/* Class */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1">
              {t('class')}
            </label>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(Number(e.target.value))}
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500"
            >
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.nameBn}
                </option>
              ))}
            </select>
          </div>

          {/* Batch */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1">
              ব্যাচ ফিল্টার
            </label>
            <select
              value={selectedBatchId}
              onChange={(e) => setSelectedBatchId(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">-- সকল ব্যাচ --</option>
              {batches
                .filter((b) => Number(b.classId) === Number(selectedClassId))
                .map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.nameBn} ({b.shift})
                  </option>
                ))}
            </select>
          </div>

          {/* Subject (Visible during Marks entry) */}
          {activeSubTab === 'marks' && (
            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1">
                বিষয় নির্বাচন
              </label>
              <select
                value={selectedSubjectId}
                onChange={(e) => setSelectedSubjectId(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500"
              >
                {subjects.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.nameBn} ({sub.code})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Student Picker (Visible during Report Card view) */}
          {activeSubTab === 'reportCard' && (
            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1">
                শিক্ষার্থী নির্বাচন
              </label>
              <select
                value={selectedReportStudentId || ''}
                onChange={(e) => {
                  const sId = Number(e.target.value);
                  setSelectedReportStudentId(sId);
                  fetchReportCard(sId);
                }}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500"
              >
                {meritData?.meritList?.map((st) => (
                  <option key={st.studentId} value={st.studentId}>
                    রোল {st.rollNo}: {st.name} (GPA {st.gpa})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>
      )}

      {/* Feedback Alert */}
      {feedback && (
        <div className={`p-4 rounded-2xl border text-xs font-bold flex items-center space-x-2.5 animate-in fade-in print:hidden ${
          feedback.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'
        }`}>
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{feedback.msg}</span>
        </div>
      )}

      {/* SUB-TAB 1: BULK MARKS ENTRY SPREADSHEET */}
      {activeSubTab === 'marks' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden space-y-4">
          <div className="p-5 bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <h3 className="font-extrabold text-base flex items-center space-x-2">
                <FileText className="w-4 h-4 text-indigo-400" />
                <span>
                  {marksSheetData?.subject?.nameBn || 'বিষয়'} — নম্বর এন্ট্রি শিট
                </span>
              </h3>
              <p className="text-xs text-slate-300">
                CQ (রচনামূলক), MCQ (বহুনির্বাচনী) ও ব্যবহারিক নম্বর প্রদান করুন। স্বয়ংক্রিয়ভাবে জিপিএ হিসাব হবে।
              </p>
            </div>

            <button
              onClick={handleBulkSave}
              disabled={savingMarks || studentMarksList.length === 0}
              className="px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-lg shadow-emerald-600/30 flex items-center space-x-2 transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{savingMarks ? t('processing') : t('bulkSaveMarks')}</span>
            </button>
          </div>

          {loadingSheet ? (
            <div className="p-12 text-center text-slate-500">
              <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-xs font-bold">নম্বর শিট লোড হচ্ছে...</p>
            </div>
          ) : studentMarksList.length === 0 ? (
            <div className="p-12 text-center text-slate-400 space-y-2">
              <Users className="w-10 h-10 mx-auto text-slate-300" />
              <p className="text-xs font-bold text-slate-600">নির্বাচিত শ্রেণি বা ব্যাচে কোনো শিক্ষার্থী নেই</p>
            </div>
          ) : (
            <div className="overflow-x-auto p-4">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <th className="py-3 px-3 w-16 text-center">রোল</th>
                    <th className="py-3 px-3 min-w-[180px]">শিক্ষার্থীর নাম ও আইডি</th>
                    <th className="py-3 px-3 w-28 text-center bg-blue-50/70 border-l border-blue-200">
                      {t('cqMarks')}
                    </th>
                    <th className="py-3 px-3 w-28 text-center bg-indigo-50/70 border-l border-indigo-200">
                      {t('mcqMarks')}
                    </th>
                    <th className="py-3 px-3 w-28 text-center bg-teal-50/70 border-l border-teal-200">
                      {t('practicalMarks')}
                    </th>
                    <th className="py-3 px-3 w-24 text-center border-l border-slate-200">
                      {t('obtainedMarks')}
                    </th>
                    <th className="py-3 px-3 w-24 text-center border-l border-slate-200">
                      {t('letterGrade')}
                    </th>
                    <th className="py-3 px-3 min-w-[200px] border-l border-slate-200">
                      শিক্ষকের মন্তব্য (Remarks)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {studentMarksList.map((st) => (
                    <tr key={st.studentId} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3 text-center font-black text-slate-800">
                        {st.rollNo}
                      </td>
                      <td className="p-3">
                        <div className="font-bold text-slate-900">{st.name}</div>
                        <div className="text-[10px] text-slate-500">{st.studentIdNumber} • {st.batchName}</div>
                      </td>

                      {/* CQ Input */}
                      <td className="p-2 text-center bg-blue-50/30 border-l border-blue-100">
                        <input
                          type="number"
                          min="0"
                          max="70"
                          value={st.cqMarks}
                          onChange={(e) => handleMarkChange(st.studentId, 'cqMarks', e.target.value)}
                          className="w-20 p-1.5 text-center font-bold text-slate-900 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 bg-white"
                        />
                      </td>

                      {/* MCQ Input */}
                      <td className="p-2 text-center bg-indigo-50/30 border-l border-indigo-100">
                        <input
                          type="number"
                          min="0"
                          max="30"
                          value={st.mcqMarks}
                          onChange={(e) => handleMarkChange(st.studentId, 'mcqMarks', e.target.value)}
                          className="w-20 p-1.5 text-center font-bold text-slate-900 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 bg-white"
                        />
                      </td>

                      {/* Practical Input */}
                      <td className="p-2 text-center bg-teal-50/30 border-l border-teal-100">
                        <input
                          type="number"
                          min="0"
                          max="25"
                          value={st.practicalMarks}
                          onChange={(e) => handleMarkChange(st.studentId, 'practicalMarks', e.target.value)}
                          className="w-20 p-1.5 text-center font-bold text-slate-900 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-500 bg-white"
                        />
                      </td>

                      {/* Calculated Total */}
                      <td className="p-3 text-center font-black text-sm text-slate-900 border-l border-slate-100">
                        {st.obtainedMarks}
                      </td>

                      {/* Calculated Grade & GP */}
                      <td className="p-3 text-center border-l border-slate-100">
                        <span className={`px-2.5 py-1 rounded-xl text-xs font-black border ${getGradeBadgeColor(st.letterGrade)}`}>
                          {st.letterGrade} ({st.gradePoint?.toFixed(1)})
                        </span>
                      </td>

                      {/* Teacher Remarks */}
                      <td className="p-2 border-l border-slate-100">
                        <input
                          type="text"
                          value={st.teacherRemarks || ''}
                          onChange={(e) => handleRemarkChange(st.studentId, e.target.value)}
                          placeholder="মন্তব্য লিখুন..."
                          className="w-full p-1.5 text-xs rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 2: CLASS MERIT LIST & TABULATION */}
      {activeSubTab === 'merit' && (
        <div className="space-y-6">
          {/* KPI Stat Cards */}
          {meritData && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-xs font-bold uppercase">মোট পরীক্ষার্থী</span>
                  <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                    <Users className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl font-black text-slate-900 mt-2">{meritData.stats.totalStudents} জন</p>
                <span className="text-[11px] text-indigo-600 font-semibold mt-1 inline-block">১০০% উপস্থিত</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-xs font-bold uppercase">{t('passRate')}</span>
                  <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                    <Percent className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl font-black text-emerald-600 mt-2">{meritData.stats.passRate}%</p>
                <span className="text-[11px] text-emerald-700 font-semibold mt-1 inline-block">
                  পাস: {meritData.stats.passedCount} জন
                </span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-xs font-bold uppercase">{t('gpa5Count')}</span>
                  <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                    <Sparkles className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl font-black text-amber-600 mt-2">{meritData.stats.aPlusCount} জন</p>
                <span className="text-[11px] text-amber-700 font-semibold mt-1 inline-block">গোল্ডেন এ+ সহ</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-xs font-bold uppercase">{t('classTopper')}</span>
                  <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
                    <Trophy className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-sm font-black text-purple-900 mt-2 truncate">
                  {meritData.stats.topper?.name || 'তানভীর হাসান'}
                </p>
                <span className="text-[11px] text-purple-700 font-bold mt-1 inline-block">
                  GPA: {meritData.stats.topper?.gpa} (মোট: {meritData.stats.topper?.totalObtained})
                </span>
              </div>
            </div>
          )}

          {/* Merit List Table */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-base flex items-center space-x-2">
                  <Trophy className="w-4 h-4 text-amber-400" />
                  <span>
                    {meritData?.class?.nameBn || '৮ম শ্রেণি'} — আনুষ্ঠানিক মেধাতালিকা (Merit Ranking)
                  </span>
                </h3>
                <p className="text-xs text-slate-300">
                  মোট প্রাপ্ত নম্বর ও জিপিএ অনুযায়ী সাজানো চূড়ান্ত মেধাতালিকা
                </p>
              </div>
            </div>

            {loadingMerit ? (
              <div className="p-12 text-center text-slate-500">
                <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                <p className="text-xs font-bold">মেধাতালিকা তৈরি হচ্ছে...</p>
              </div>
            ) : (
              <div className="overflow-x-auto p-4">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                      <th className="py-3 px-3 w-20 text-center">মেধা স্থান</th>
                      <th className="py-3 px-3 w-16 text-center">রোল</th>
                      <th className="py-3 px-4 min-w-[200px]">শিক্ষার্থীর নাম ও আইডি</th>
                      <th className="py-3 px-3 text-center">ব্যাচ</th>
                      <th className="py-3 px-3 text-center">মোট নম্বর</th>
                      <th className="py-3 px-3 text-center">শতাংশ (%)</th>
                      <th className="py-3 px-3 text-center">GPA</th>
                      <th className="py-3 px-3 text-center">গ্রেড</th>
                      <th className="py-3 px-3 text-center">ফলাফল</th>
                      <th className="py-3 px-3 text-center">পদক্ষেপ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {meritData?.meritList?.map((st) => {
                      const isRank1 = st.meritRank === 1;
                      const isRank2 = st.meritRank === 2;
                      const isRank3 = st.meritRank === 3;
                      return (
                        <tr
                          key={st.studentId}
                          className={`hover:bg-slate-50/80 transition-colors ${
                            isRank1 ? 'bg-amber-50/40' : ''
                          }`}
                        >
                          <td className="p-3 text-center font-black">
                            {isRank1 ? (
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-amber-400 text-slate-950 font-black text-xs shadow-md shadow-amber-400/30">
                                🥇 ১ম
                              </span>
                            ) : isRank2 ? (
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-slate-300 text-slate-900 font-black text-xs">
                                🥈 ২য়
                              </span>
                            ) : isRank3 ? (
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-amber-200 text-amber-900 font-black text-xs">
                                🥉 ৩য়
                              </span>
                            ) : (
                              <span className="text-slate-600 font-bold">{st.meritRank}তম</span>
                            )}
                          </td>

                          <td className="p-3 text-center font-bold text-slate-800">{st.rollNo}</td>

                          <td className="p-4">
                            <div className="font-bold text-slate-900">{st.name}</div>
                            <div className="text-[10px] text-slate-500">{st.studentIdNumber}</div>
                          </td>

                          <td className="p-3 text-center text-slate-600">{st.batchName}</td>

                          <td className="p-3 text-center font-black text-slate-900">
                            {st.totalObtained} / {st.totalPossibleMarks}
                          </td>

                          <td className="p-3 text-center font-bold text-slate-700">{st.percentage}%</td>

                          <td className="p-3 text-center font-black text-indigo-700 text-sm">
                            {st.gpa.toFixed(2)}
                          </td>

                          <td className="p-3 text-center">
                            <span className={`px-2.5 py-1 rounded-xl text-xs font-black border ${getGradeBadgeColor(st.letterGrade)}`}>
                              {st.letterGrade}
                            </span>
                          </td>

                          <td className="p-3 text-center font-bold">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                              st.status === 'PASSED' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                            }`}>
                              {st.status === 'PASSED' ? 'পাস' : 'ফেল'}
                            </span>
                          </td>

                          <td className="p-3 text-center">
                            <button
                              onClick={() => {
                                setSelectedReportStudentId(st.studentId);
                                setActiveSubTab('reportCard');
                                fetchReportCard(st.studentId);
                              }}
                              className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center space-x-1 mx-auto"
                            >
                              <Award className="w-3.5 h-3.5" />
                              <span>মার্কশিট</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: 360° ACADEMIC REPORT CARD & PDF PRINT */}
      {activeSubTab === 'reportCard' && (
        <div className="space-y-6">
          {loadingReportCard ? (
            <div className="p-12 text-center text-slate-500 bg-white rounded-3xl border border-slate-200">
              <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-xs font-bold">রিপোর্ট কার্ড তৈরি হচ্ছে...</p>
            </div>
          ) : reportCardData ? (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-10 max-w-4xl mx-auto print:border-none print:shadow-none print:p-0 space-y-6 text-slate-800">
              {/* Institution Header with Golden Logo */}
              <div className="flex flex-col sm:flex-row items-center justify-between pb-6 border-b-2 border-slate-900 gap-4 text-center sm:text-left">
                <div className="flex items-center space-x-4">
                  <img
                    src="/logo.png"
                    alt="NextGen Academy Logo"
                    className="w-20 h-20 object-contain drop-shadow-md"
                  />
                  <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-wide">
                      {reportCardData.institute.nameBn}
                    </h1>
                    <h2 className="text-sm font-black text-indigo-900 tracking-widest uppercase">
                      {reportCardData.institute.nameEn}
                    </h2>
                    <p className="text-[11px] font-bold text-amber-700 tracking-widest mt-0.5">
                      {reportCardData.institute.tagline}
                    </p>
                    <p className="text-[10px] text-slate-500 mt-1">
                      {reportCardData.institute.address} • ফোন: {reportCardData.institute.phone}
                    </p>
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-center sm:text-right">
                  <span className="text-[11px] font-black uppercase text-indigo-700 px-3 py-1 bg-indigo-50 rounded-full border border-indigo-200">
                    অ্যাকাডেমিক রিপোর্ট কার্ড ২০২৬
                  </span>
                  <p className="text-xs font-extrabold text-slate-900 mt-2">
                    {reportCardData.examTerm.titleBn}
                  </p>
                  <p className="text-[10px] text-slate-500 font-semibold">শিক্ষাবর্ষ: ২০২৬</p>
                </div>
              </div>

              {/* Student Metadata Card */}
              <div className="bg-slate-50/80 p-4 sm:p-5 rounded-2xl border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-semibold">
                <div>
                  <span className="text-[10px] text-slate-500 font-bold block uppercase">শিক্ষার্থীর নাম</span>
                  <span className="text-sm font-black text-slate-900 block mt-0.5">{reportCardData.student.name}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-bold block uppercase">আইডি নম্বর ও রোল</span>
                  <span className="text-xs font-black text-slate-900 block mt-0.5">
                    আইডি: {reportCardData.student.studentIdNumber} • রোল: {reportCardData.student.rollNo}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-bold block uppercase">শ্রেণি ও শাখা</span>
                  <span className="text-xs font-black text-slate-900 block mt-0.5">
                    {reportCardData.student.class} ({reportCardData.student.section})
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-bold block uppercase">ব্যাচ ও শিফট</span>
                  <span className="text-xs font-black text-slate-900 block mt-0.5">
                    {reportCardData.student.batch} ({reportCardData.student.shift})
                  </span>
                </div>
              </div>

              {/* Subject-wise Marks Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-900 text-white font-bold">
                      <th className="py-2.5 px-3">বিষয় কোড ও নাম</th>
                      <th className="py-2.5 px-2 text-center">পূর্ণমান</th>
                      <th className="py-2.5 px-2 text-center">CQ</th>
                      <th className="py-2.5 px-2 text-center">MCQ</th>
                      <th className="py-2.5 px-2 text-center">ব্যবহারিক</th>
                      <th className="py-2.5 px-2 text-center font-black">মোট প্রাপ্ত</th>
                      <th className="py-2.5 px-2 text-center">সর্বোচ্চ</th>
                      <th className="py-2.5 px-2 text-center">GP</th>
                      <th className="py-2.5 px-2 text-center">গ্রেড</th>
                      <th className="py-2.5 px-3">শিক্ষকের মন্তব্য</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-medium">
                    {reportCardData.subjects.map((sub) => (
                      <tr key={sub.subjectId} className="hover:bg-slate-50/50">
                        <td className="py-2.5 px-3">
                          <span className="font-black text-slate-900">{sub.subjectNameBn}</span>
                          <span className="text-[10px] text-slate-400 font-mono block">{sub.subjectCode}</span>
                        </td>
                        <td className="py-2.5 px-2 text-center text-slate-600">{sub.fullMarks}</td>
                        <td className="py-2.5 px-2 text-center text-slate-700">{sub.cqMarks}</td>
                        <td className="py-2.5 px-2 text-center text-slate-700">{sub.mcqMarks}</td>
                        <td className="py-2.5 px-2 text-center text-slate-700">{sub.practicalMarks}</td>
                        <td className="py-2.5 px-2 text-center font-black text-slate-900 text-sm">{sub.obtainedMarks}</td>
                        <td className="py-2.5 px-2 text-center text-indigo-700 font-bold">{sub.highestInClass}</td>
                        <td className="py-2.5 px-2 text-center font-bold text-slate-800">{sub.gradePoint.toFixed(1)}</td>
                        <td className="py-2.5 px-2 text-center">
                          <span className={`px-2 py-0.5 rounded-md font-black text-xs ${getGradeBadgeColor(sub.letterGrade)}`}>
                            {sub.letterGrade}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-[11px] text-slate-600 italic truncate max-w-[150px]">
                          {sub.teacherRemarks}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Overall Summary & Analytics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                {/* GPA Hero Box */}
                <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white p-5 rounded-2xl text-center flex flex-col justify-center items-center shadow-md">
                  <span className="text-xs font-bold uppercase tracking-widest text-indigo-300">চূড়ান্ত ফলাফল</span>
                  <div className="text-4xl font-black text-amber-400 mt-2 font-mono">
                    {reportCardData.summary.gpa.toFixed(2)}
                  </div>
                  <span className="text-base font-black px-3 py-0.5 rounded-full bg-white/20 text-white mt-1">
                    লেটার গ্রেড: {reportCardData.summary.overallGrade}
                  </span>
                  <span className="text-[11px] text-emerald-300 font-bold mt-2">
                    {reportCardData.summary.resultStatus === 'PASSED' ? '✓ উত্তীর্ণ (PASSED)' : '✕ অকৃতকার্য (FAILED)'}
                  </span>
                </div>

                {/* Score & Attendance Metrics */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-500 font-bold">মোট প্রাপ্ত নম্বর:</span>
                    <span className="font-black text-slate-900">
                      {reportCardData.summary.totalObtained} / {reportCardData.summary.totalPossibleMarks}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-500 font-bold">প্রাপ্ত নম্বর শতকরা:</span>
                    <span className="font-black text-slate-900">{reportCardData.summary.percentage}%</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-500 font-bold">উপস্থিতির হার:</span>
                    <span className="font-black text-emerald-700">{reportCardData.summary.attendanceRate}%</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500 font-bold">আচরণগত মূল্যায়ন:</span>
                    <span className="font-black text-indigo-700">{reportCardData.summary.conductGrade}</span>
                  </div>
                </div>

                {/* Teacher Remarks Box */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
                  <div>
                    <span className="text-[10px] font-black uppercase text-indigo-700 block">
                      {t('classTeacherRemarks')}:
                    </span>
                    <p className="text-[11px] text-slate-700 italic mt-0.5">
                      "{reportCardData.summary.classTeacherRemarks}"
                    </p>
                  </div>
                  <div className="pt-2 border-t border-slate-200">
                    <span className="text-[10px] font-black uppercase text-amber-700 block">
                      {t('principalRemarks')}:
                    </span>
                    <p className="text-[11px] text-slate-700 italic mt-0.5">
                      "{reportCardData.summary.principalRemarks}"
                    </p>
                  </div>
                </div>
              </div>

              {/* Signature Blocks */}
              <div className="grid grid-cols-3 gap-6 pt-12 text-center text-xs font-bold text-slate-800">
                <div className="border-t-2 border-slate-400 pt-2">শ্রেণি শিক্ষক / ক্লাস টিচার</div>
                <div className="border-t-2 border-slate-400 pt-2">অ্যাকাডেমিক কো-অর্ডিনেটর</div>
                <div className="border-t-2 border-slate-400 pt-2">অধ্যক্ষ / প্রিন্সিপাল</div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-500">শিক্ষার্থী নির্বাচন করুন</div>
          )}
        </div>
      )}

      {/* SUB-TAB 4: TABULATION SHEET */}
      {activeSubTab === 'tabulation' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden space-y-4">
          <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-base flex items-center space-x-2">
                <BookOpen className="w-4 h-4 text-cyan-400" />
                <span>
                  {tabulationData?.class?.nameBn || '৮ম শ্রেণি'} — পরীক্ষা ট্যাবুল্যাশন শিট (Tabulation Sheet)
                </span>
              </h3>
              <p className="text-xs text-slate-300">
                শ্রেণির সকল শিক্ষার্থীর বিষয়ভিত্তিক নম্বর ও গ্রেড একনজরে প্রদর্শন
              </p>
            </div>
          </div>

          {loadingTabulation ? (
            <div className="p-12 text-center text-slate-500">
              <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-xs font-bold">ট্যাবুল্যাশন শিট লোড হচ্ছে...</p>
            </div>
          ) : (
            <div className="overflow-x-auto p-4">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <th className="py-2.5 px-3 w-16 text-center">রোল</th>
                    <th className="py-2.5 px-3 min-w-[160px]">শিক্ষার্থীর নাম</th>
                    {tabulationData?.subjects?.map((sub) => (
                      <th key={sub.id} className="py-2.5 px-2 text-center border-l border-slate-200 min-w-[80px]">
                        <div className="font-black text-slate-900">{sub.nameBn}</div>
                        <span className="text-[10px] text-slate-400 font-mono">{sub.code}</span>
                      </th>
                    ))}
                    <th className="py-2.5 px-2 text-center font-black border-l border-slate-200">মোট</th>
                    <th className="py-2.5 px-2 text-center font-black border-l border-slate-200">GPA</th>
                    <th className="py-2.5 px-2 text-center font-black border-l border-slate-200">গ্রেড</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {tabulationData?.rows?.map((row) => (
                    <tr key={row.studentId} className="hover:bg-slate-50/80">
                      <td className="p-2.5 text-center font-black text-slate-800">{row.rollNo}</td>
                      <td className="p-2.5">
                        <span className="font-bold text-slate-900">{row.name}</span>
                        <span className="text-[10px] text-slate-400 block">{row.batchName}</span>
                      </td>
                      {row.subjectMarks?.map((sm) => (
                        <td key={sm.subjectId} className="p-2 text-center border-l border-slate-100">
                          <span className="font-black text-slate-900">{sm.total}</span>
                          <span className={`block text-[10px] font-bold ${getGradeBadgeColor(sm.grade)} rounded px-1 mt-0.5`}>
                            {sm.grade}
                          </span>
                        </td>
                      ))}
                      <td className="p-2.5 text-center font-black text-slate-900 border-l border-slate-100">
                        {row.totalObtained}
                      </td>
                      <td className="p-2.5 text-center font-black text-indigo-700 border-l border-slate-100">
                        {row.gpa.toFixed(2)}
                      </td>
                      <td className="p-2.5 text-center border-l border-slate-100">
                        <span className={`px-2 py-0.5 rounded font-black text-[11px] ${getGradeBadgeColor(row.grade)}`}>
                          {row.grade}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 5: TOP ACHIEVERS & HALL OF FAME MANAGEMENT */}
      {activeSubTab === 'hall-of-fame' && <HallOfFameManager />}
    </div>
  );
}
