import React, { useState, useEffect, Suspense, lazy } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { parentAPI, noticeAPI, homeworkAPI, materialAPI, textbookAPI, examAPI } from '../services/api';
import LoadingFallback from '../components/common/LoadingFallback';
import LiveClassroomView from '../components/liveclass/LiveClassroomView';
import LiveClassNotificationBanner from '../components/liveclass/LiveClassNotificationBanner';
import GuardianAttendanceMatrix from '../components/parent/GuardianAttendanceMatrix';
import GuardianTeacherCards from '../components/parent/GuardianTeacherCards';
import SyllabusProgress from '../components/student/SyllabusProgress';
import PaymentHistory from '../components/common/PaymentHistory';
import BilingualDictionaryWidget from '../components/student/BilingualDictionaryWidget';


// Lazy Loaded Components
const PaymentModal = lazy(() => import('../components/common/PaymentModal'));
const ReceiptModal = lazy(() => import('../components/common/ReceiptModal'));
const TeacherDirectory = lazy(() => import('../components/common/TeacherDirectory'));
const WeeklyRoutineGrid = lazy(() => import('../components/common/WeeklyRoutineGrid'));
const AcademicReportCard = lazy(() => import('../components/common/AcademicReportCard'));
const AcademicPerformanceAnalytics = lazy(() => import('../components/common/AcademicPerformanceAnalytics'));
const ResourceLibrary = lazy(() => import('../components/common/ResourceLibrary'));
const PrintableNoticeSlipModal = lazy(() => import('../components/common/PrintableNoticeSlipModal'));
const MediaCenter = lazy(() => import('../components/media/MediaCenter'));
const FeedbackHelpdeskModule = lazy(() => import('../components/common/FeedbackHelpdeskModule'));
const PaymentGatewayCheckout = lazy(() => import('../components/student/PaymentGatewayCheckout'));

import {
  Users,
  GraduationCap,
  CalendarCheck,
  Award,
  CreditCard,
  CalendarDays,
  BellRing,
  Phone,
  Droplet,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Printer,
  Sparkles,
  ArrowUpRight,
  ClipboardList,
  CheckCircle,
  CircleDot,
  FileText,
  Calendar,
  BookMarked,
  Download,
  Search,
  ExternalLink,
  Maximize2,
  X,
  BookOpen,
  Eye,
  HelpCircle,
  TrendingUp,
  CheckSquare,
  Zap
} from 'lucide-react';

export default function ParentDashboard({ activeTab = 'dashboard' }) {
  const { t, lang } = useLanguage();
  const { user } = useAuth();

  const [children, setChildren] = useState([]);
  const [selectedChildId, setSelectedChildId] = useState(null);
  const [summary, setSummary] = useState(null);
  const [attendance, setAttendance] = useState(null);
  const [results, setResults] = useState(null);
  const [routine, setRoutine] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [homeworkList, setHomeworkList] = useState([]);
  const [materialsList, setMaterialsList] = useState([]);
  const [materialSearch, setMaterialSearch] = useState('');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState('');
  const [textbooksList, setTextbooksList] = useState([]);
  const [textbookSearch, setTextbookSearch] = useState('');
  const [textbookSubjectFilter, setTextbookSubjectFilter] = useState('');
  const [readingTextbook, setReadingTextbook] = useState(null);
  const [previewImageModal, setPreviewImageModal] = useState(null);
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Online Exams State (Parent View)
  const [examsList, setExamsList] = useState([]);
  const [examSummary, setExamSummary] = useState(null);
  const [reviewResultModal, setReviewResultModal] = useState(null);

  // Payment & Receipt Modals
  const [selectedInvoiceForPayment, setSelectedInvoiceForPayment] = useState(null);
  const [receiptData, setReceiptData] = useState(null);
  const [selectedNoticeForSlip, setSelectedNoticeForSlip] = useState(null);

  useEffect(() => {
    fetchChildren();
  }, []);

  useEffect(() => {
    if (selectedChildId) {
      fetchChildDetails(selectedChildId);
    }
  }, [selectedChildId]);

  const fetchChildren = async () => {
    setLoading(true);
    try {
      const res = await parentAPI.getChildren();
      if (res.success && res.data && res.data.length > 0) {
        setChildren(res.data);
        setSelectedChildId(res.data[0].student.id);
      }
      const notifRes = await noticeAPI.getNotices('PARENT');
      if (notifRes.success) setNotices(notifRes.data);
    } catch (err) {
      console.error('Failed to load parent children:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchChildDetails = async (studentId) => {
    try {
      const matched = children.find(c => c.student?.id === studentId)?.student;
      const targetClassId = matched?.classId || 11;

      const [sumRes, attRes, resRes, routRes, invRes, hwRes, matRes, tbRes, examRes] = await Promise.all([
        parentAPI.getChildSummary(studentId),
        parentAPI.getChildAttendance(studentId),
        parentAPI.getChildResults(studentId),
        parentAPI.getChildRoutine(studentId),
        parentAPI.getChildInvoices(studentId),
        homeworkAPI.getStudentHomework(studentId),
        materialAPI.getStudentMaterials(studentId),
        textbookAPI.getTextbooks({ classId: targetClassId }),
        examAPI.getStudentExams(studentId)
      ]);

      if (sumRes.success) setSummary(sumRes.data);
      if (attRes.success) setAttendance(attRes.data);
      if (resRes.success) setResults(resRes.data);
      if (routRes.success) setRoutine(routRes.data);
      if (invRes.success) setInvoices(invRes.data);
      if (hwRes.success) setHomeworkList(hwRes.data);
      if (matRes.success) setMaterialsList(matRes.data);
      if (tbRes.success) setTextbooksList(tbRes.data);
      if (examRes.success && examRes.data) {
        setExamsList(examRes.data.exams || []);
        setExamSummary(examRes.data.summary || null);
      }
    } catch (err) {
      console.error('Failed to load child details:', err);
    }
  };

  const handleToggleHomework = async (homeworkId, currentStatus) => {
    const nextStatus = currentStatus === 'COMPLETED' ? 'PENDING' : 'COMPLETED';
    try {
      const res = await homeworkAPI.toggleStatus(homeworkId, selectedChildId, nextStatus);
      if (res.success) {
        setHomeworkList(prev =>
          prev.map(item =>
            item.id === homeworkId ? { ...item, status: nextStatus, completedAt: nextStatus === 'COMPLETED' ? new Date().toISOString() : null } : item
          )
        );
      }
    } catch (err) {
      alert(err.message || 'Failed to update homework status');
    }
  };

  const handlePaymentSuccess = (receipt) => {
    setSelectedInvoiceForPayment(null);
    setReceiptData(receipt);
    if (selectedChildId) {
      fetchChildDetails(selectedChildId);
    }
  };

  const handleViewExamResult = (exam) => {
    if (!exam.mySubmission) return;
    if (exam.type === 'MCQ' && Array.isArray(exam.mySubmission.studentAnswers)) {
      setReviewResultModal({
        examTitle: exam.titleBn,
        totalScore: exam.mySubmission.totalScore,
        obtainedScore: exam.mySubmission.obtainedScore,
        percentage: exam.mySubmission.percentage,
        passed: exam.mySubmission.passed,
        teacherFeedback: exam.mySubmission.teacherFeedback,
        detailedEvaluations: exam.mySubmission.studentAnswers
      });
    } else {
      alert(`লিখিত পরীক্ষার মূল্যায়ন:\nপ্রাপ্ত নম্বর: ${exam.mySubmission.obtainedScore || 0} / ${exam.totalMarks}\nশিক্ষকের মন্তব্য: ${exam.mySubmission.teacherFeedback || 'খাতা মূল্যায়ন সম্পন্ন।'}`);
    }
  };

  const currentChild = children.find(c => c.student?.id === selectedChildId)?.student;

  // Filter study materials by search and subject
  const filteredMaterials = materialsList.filter(m => {
    const matchesSubject = !selectedSubjectFilter || m.subjectId === Number(selectedSubjectFilter);
    const q = materialSearch.trim().toLowerCase();
    const matchesSearch = !q ||
      (m.titleBn && m.titleBn.toLowerCase().includes(q)) ||
      (m.chapterBn && m.chapterBn.toLowerCase().includes(q)) ||
      (m.descriptionBn && m.descriptionBn.toLowerCase().includes(q)) ||
      (m.subject?.nameBn && m.subject.nameBn.toLowerCase().includes(q));
    return matchesSubject && matchesSearch;
  });

  // Extract unique subjects from materialsList for tab pills
  const availableSubjects = Array.from(
    new Map(materialsList.map(m => [m.subject?.id, m.subject])).values()
  ).filter(Boolean);

  // Filter textbooks by search and subject
  const filteredTextbooks = textbooksList.filter(tb => {
    const matchesSubject = !textbookSubjectFilter || tb.subjectId === Number(textbookSubjectFilter);
    const q = textbookSearch.trim().toLowerCase();
    const matchesSearch = !q ||
      (tb.titleBn && tb.titleBn.toLowerCase().includes(q)) ||
      (tb.titleEn && tb.titleEn.toLowerCase().includes(q)) ||
      (tb.edition && tb.edition.toLowerCase().includes(q)) ||
      (tb.subject?.nameBn && tb.subject.nameBn.toLowerCase().includes(q));
    return matchesSubject && matchesSearch;
  });

  const availableTextbookSubjects = Array.from(
    new Map(textbooksList.map(tb => [tb.subject?.id, tb.subject])).values()
  ).filter(Boolean);

  if (loading && !currentChild) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner with Child Selector */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 rounded-3xl p-6 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold mb-2 border border-purple-500/30">
              <Users className="w-3.5 h-3.5" />
              <span>{t('parentTitle')}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold">
              {user?.name}
            </h2>
            <p className="text-xs text-purple-200/80 mt-1">
              অভিভাবক অ্যাকাউন্ট • {children.length} জন শিক্ষার্থী নিবন্ধিত
            </p>
          </div>

          {/* Child Selector Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-purple-200 mr-1">{t('selectChild')}</span>
            {children.map((item) => {
              const st = item.student;
              const isSelected = st.id === selectedChildId;
              return (
                <button
                  key={st.id}
                  onClick={() => setSelectedChildId(st.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
                    isSelected
                      ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 ring-2 ring-white/50'
                      : 'bg-white/10 hover:bg-white/20 text-white/90'
                  }`}
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>{st.user?.name}</span>
                  <span className="text-[10px] opacity-80">({st.class?.nameBn})</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Child Summary Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Child Profile Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-base flex-shrink-0">
            {currentChild?.user?.name ? currentChild.user.name.charAt(0) : 'S'}
          </div>
          <div className="overflow-hidden">
            <h4 className="font-bold text-sm text-slate-900 truncate">{currentChild?.user?.name}</h4>
            <p className="text-xs text-slate-500">{currentChild?.class?.nameBn} ({currentChild?.section?.nameBn})</p>
            <div className="flex items-center gap-1.5 mt-0.5 text-[11px] font-semibold text-emerald-700 flex-wrap">
              <span>আইডি: {currentChild?.studentIdNumber}</span>
              <span>•</span>
              <span className="text-slate-500 font-medium">
                ভর্তি: {currentChild?.admissionDate || currentChild?.admission_date
                  ? new Date(currentChild.admissionDate || currentChild.admission_date).toLocaleDateString('bn-BD', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })
                  : '০১ জানুয়ারি ২০২৪'}
              </span>
            </div>
          </div>
        </div>

        {/* Overall Attendance */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">{t('overallAttendance')}</span>
            <div className="p-2 rounded-xl bg-teal-50 text-teal-600">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">
            {summary?.metrics?.attendanceRate || 96.0}%
          </p>
          <span className="text-[11px] text-teal-600 font-semibold mt-1 inline-block">
            {summary?.metrics?.presentDays || 24} দিন উপস্থিত
          </span>
        </div>

        {/* Term GPA */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">{t('currentGPA')}</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">
            {results?.summary?.gpa || '5.00'} <span className="text-sm font-bold text-purple-600">({results?.summary?.overallGrade || 'A+'})</span>
          </p>
          <span className="text-[11px] text-purple-600 font-semibold mt-1 inline-block">
            ১ম সাময়িক পরীক্ষা ২০২৬
          </span>
        </div>

        {/* Outstanding Dues */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">{t('dueFees')}</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">
            ৳ {Number(summary?.metrics?.totalDue || 0).toLocaleString('en-BD')}
          </p>
          <span className="text-[11px] text-amber-600 font-semibold mt-1 inline-block">
            {summary?.metrics?.unpaidInvoicesCount || 0}টি অপরিশোধিত ইনভয়েস
          </span>
        </div>
      </div>

      {/* Live Class 15-Minute Alert Banner */}
      <LiveClassNotificationBanner classId={currentChild?.classId} sectionId={currentChild?.sectionId} />

      {/* Tab Specific Content */}
      <Suspense fallback={<LoadingFallback message="তথ্য লোড হচ্ছে..." />}>
        {activeTab === 'checkout' || activeTab === 'payment-gateway' || activeTab === 'pay' ? (
          <PaymentGatewayCheckout onPaymentSuccess={() => fetchParentData()} />
        ) : activeTab === 'helpdesk' || activeTab === 'feedback' ? (
          <FeedbackHelpdeskModule />
        ) : activeTab === 'media-center' || activeTab === 'media' ? (

        <MediaCenter />
      ) : activeTab === 'teachers' ? (
        <TeacherDirectory role="PARENT" />
      ) : activeTab === 'live-classes' ? (
        <LiveClassroomView studentId={currentChild?.id} role="PARENT" />
      ) : activeTab === 'exams' ? (
        /* Child Online Examination & Assessment Performance */
        <div className="space-y-6">
          {/* Top Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-500">মোট পরীক্ষা</span>
                <p className="text-2xl font-black text-slate-900 mt-1">
                  {examSummary?.totalExams || examsList.length}টি
                </p>
              </div>
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                <HelpCircle className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-500">সম্পন্ন করা হয়েছে</span>
                <p className="text-2xl font-black text-emerald-600 mt-1">
                  {examSummary?.completedExams || examsList.filter(e => e.hasSubmitted).length}টি
                </p>
              </div>
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                <CheckCircle className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-500">পাসের হার</span>
                <p className="text-2xl font-black text-blue-600 mt-1">
                  {examSummary?.passingRate || 100}%
                </p>
              </div>
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                <Award className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-500">গড় প্রাপ্ত স্কোর</span>
                <p className="text-2xl font-black text-purple-600 mt-1">
                  {examSummary?.avgScore || 0}%
                </p>
              </div>
              <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Exams List Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                  <HelpCircle className="w-5 h-5 text-indigo-600" />
                  <span>{t('onlineExamsTitle')} - {currentChild?.user?.name}</span>
                </h3>
                <p className="text-xs text-slate-500">অনলাইন কুইজ ও পরীক্ষার বিষয়ভিত্তিক নম্বর ও ফলাফল</p>
              </div>

              <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-xl">
                {currentChild?.class?.nameBn} • রোল: {currentChild?.rollNo}
              </span>
            </div>

            {examsList.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <HelpCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-500">এই শ্রেণির জন্য কোনো অনলাইন পরীক্ষার রেকর্ড পাওয়া যায়নি</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {examsList.map((exam) => {
                  const isDone = exam.hasSubmitted;
                  const sub = exam.mySubmission;

                  return (
                    <div
                      key={exam.id}
                      className={`p-4 rounded-2xl border transition-all space-y-3 flex flex-col justify-between ${
                        isDone ? 'bg-slate-50/60 border-slate-200' : 'bg-amber-50/30 border-amber-200'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold ${
                            exam.type === 'MCQ' ? 'bg-indigo-100 text-indigo-800' : 'bg-purple-100 text-purple-800'
                          }`}>
                            {exam.type === 'MCQ' ? '🎯 বহুনির্বাচনী কুইজ (MCQ)' : '✍️ সৃজনশীল লিখিত পরীক্ষা'}
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 text-[10px] font-bold">
                            {exam.subject?.nameBn}
                          </span>
                        </div>

                        <h4 className="font-bold text-sm text-slate-900">{exam.titleBn}</h4>

                        <div className="grid grid-cols-2 gap-2 text-[11px] bg-white p-2.5 rounded-xl border border-slate-100 text-slate-600">
                          <div>
                            <span className="text-slate-400 block">তারিখ ও সময়</span>
                            <span className="font-semibold">{exam.examDate} • {exam.startTime}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block">সময়সীমা ও পূর্ণমান</span>
                            <span className="font-semibold">{exam.durationMinutes} মিনিট • {exam.totalMarks} নম্বর</span>
                          </div>
                        </div>

                        {sub?.teacherFeedback && (
                          <div className="p-2.5 bg-indigo-50/50 rounded-xl border border-indigo-100 text-xs text-indigo-900">
                            <span className="font-bold block text-[10px] text-indigo-600">শিক্ষকের মন্তব্য ও দিকনির্দেশনা:</span>
                            {sub.teacherFeedback}
                          </div>
                        )}
                      </div>

                      {/* Footer */}
                      <div className="pt-2 border-t border-slate-200">
                        {isDone ? (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-slate-600 font-medium">
                                প্রাপ্ত নম্বর: <strong className="text-indigo-700 font-mono text-sm">{sub?.obtainedScore} / {exam.totalMarks}</strong> ({sub?.percentage}%)
                              </span>
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                sub?.status === 'SUBMITTED'
                                  ? 'bg-amber-100 text-amber-800'
                                  : sub?.passed
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-rose-100 text-rose-800'
                              }`}>
                                {sub?.status === 'SUBMITTED' ? 'মূল্যায়ন প্রক্রিয়াধীন' : sub?.passed ? 'উত্তীর্ণ (Passed)' : 'অনুত্তীর্ণ (Failed)'}
                              </span>
                            </div>

                            {exam.type === 'MCQ' && (
                              <button
                                onClick={() => handleViewExamResult(exam)}
                                className="w-full py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-xl flex items-center justify-center space-x-1.5 transition-all"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>উত্তরপত্র ও নির্ভুল সমাধান দেখুন</span>
                              </button>
                            )}
                          </div>
                        ) : (
                          <div className="p-2 bg-amber-50 rounded-xl border border-amber-200 text-amber-800 text-xs font-semibold flex items-center justify-between">
                            <span>অংশগ্রহণ স্ট্যাটাস:</span>
                            <span className="font-bold text-rose-600">এখনো পরীক্ষায় অংশ নেয়নি</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      ) : activeTab === 'materials' ? (
        /* Study Materials & Lecture Notes Tab */
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <BookMarked className="w-5 h-5 text-blue-600" />
                <span>{t('materialsTitle')}</span>
              </h3>
              <p className="text-xs text-slate-500">{currentChild?.user?.name} এর শ্রেণির বিষয়ভিত্তিক লেকচার নোট ও অধ্যয়ন সামগ্রী</p>
            </div>

            {/* Search Bar */}
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                value={materialSearch}
                onChange={(e) => setMaterialSearch(e.target.value)}
                placeholder={t('searchMaterials')}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2" />
            </div>
          </div>

          {/* Subject Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              onClick={() => setSelectedSubjectFilter('')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                !selectedSubjectFilter
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              সকল বিষয় ({materialsList.length})
            </button>
            {availableSubjects.map((sub) => (
              <button
                key={sub.id}
                onClick={() => setSelectedSubjectFilter(String(sub.id))}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedSubjectFilter === String(sub.id)
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {sub.nameBn}
              </button>
            ))}
          </div>

          {filteredMaterials.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <BookMarked className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-500">{t('noMaterialsFound')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredMaterials.map((m) => (
                <div key={m.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-all space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-lg bg-blue-100 text-blue-800 text-xs font-bold">
                      {m.subject?.nameBn || 'বিষয়'}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500">
                      {m.fileSize || '2.0 MB'} • {m.fileType}
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold text-blue-600 block">{m.chapterBn}</span>
                    <h4 className="font-bold text-sm text-slate-900 mt-0.5">{m.titleBn}</h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{m.descriptionBn}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">
                      শিক্ষক: {m.teacher?.user?.name || 'বিষয় শিক্ষক'}
                    </span>

                    <a
                      href={m.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center space-x-1.5 shadow-sm transition-all"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{t('downloadNote')}</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : activeTab === 'textbooks' ? (
        /* Digital Textbooks, E-Books & Free/Premium Resource Library */
        <ResourceLibrary
          studentId={currentChild?.id}
          role="PARENT"
          classIdFilter={currentChild?.classId}
        />
      ) : activeTab === 'homework' ? (
        /* Daily Homework Tracker Tab */
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <ClipboardList className="w-5 h-5 text-emerald-600" />
                <span>{t('homeworkTitle')}</span>
              </h3>
              <p className="text-xs text-slate-500">{currentChild?.user?.name} এর প্রতিদিনের বাড়ির কাজ ও জমা দেওয়ার স্ট্যাটাস</p>
            </div>

            <div className="flex items-center space-x-2 text-xs font-bold">
              <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-xl">
                সম্পন্ন: {homeworkList.filter(h => h.status === 'COMPLETED').length}টি
              </span>
              <span className="px-3 py-1 bg-amber-50 text-amber-700 rounded-xl">
                বাকি: {homeworkList.filter(h => h.status === 'PENDING').length}টি
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {homeworkList.map((hw) => {
              const isDone = hw.status === 'COMPLETED';
              return (
                <div
                  key={hw.id}
                  className={`p-4 rounded-2xl border transition-all space-y-3 ${
                    isDone ? 'bg-emerald-50/30 border-emerald-200' : 'bg-slate-50/60 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold">
                      {hw.subject?.nameBn || 'গণিত'}
                    </span>

                    <button
                      onClick={() => handleToggleHomework(hw.id, hw.status)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                        isDone
                          ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-300'
                          : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                      }`}
                    >
                      {isDone ? <CheckCircle className="w-3.5 h-3.5" /> : <CircleDot className="w-3.5 h-3.5" />}
                      <span>{isDone ? t('statusCompleted') : t('statusPending')}</span>
                    </button>
                  </div>

                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{hw.topicBn}</h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{hw.descriptionBn}</p>
                  </div>

                  {/* Attachment Image Preview */}
                  {hw.attachmentImage && (
                    <div className="relative group rounded-xl overflow-hidden border border-slate-200 bg-slate-900 max-h-48">
                      <img
                        src={hw.attachmentImage}
                        alt="Homework Attachment"
                        className="w-full h-36 object-cover object-center group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                        onClick={() => setPreviewImageModal(hw.attachmentImage)}
                      />
                      <button
                        type="button"
                        onClick={() => setPreviewImageModal(hw.attachmentImage)}
                        className="absolute bottom-2 right-2 px-2.5 py-1 bg-slate-900/80 hover:bg-slate-900 text-white rounded-lg text-[11px] font-bold flex items-center space-x-1 backdrop-blur-sm shadow-md"
                      >
                        <Maximize2 className="w-3 h-3" />
                        <span>ছবি বড় করুন</span>
                      </button>
                    </div>
                  )}

                  {hw.attachmentNote && (
                    <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-600 flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span><strong>নোট / রেফারেন্স:</strong> {hw.attachmentNote}</span>
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span><strong>জমার তারিখ:</strong> {hw.dueDate}</span>
                    </span>
                    <span>পোস্ট করেছেন: {hw.teacher?.user?.name || 'বিষয় শিক্ষক'}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : activeTab === 'attendance' ? (
        <div className="space-y-6">
          <GuardianAttendanceMatrix
            attendanceData={attendance}
            studentName={currentChild?.user?.name || 'তাহমিদ হাসান'}
          />
        </div>
      ) : activeTab === 'teachers' ? (
        <div className="space-y-6">
          <GuardianTeacherCards studentClass={currentChild?.class?.nameBn || '১০ম শ্রেণি'} />
          <TeacherDirectory />
        </div>
      ) : activeTab === 'results' ? (
        <div className="space-y-6">
          <AcademicPerformanceAnalytics
            student={currentChild ? { nameBn: currentChild.user?.name, rollNo: currentChild.rollNo } : null}
            customTitle={`${currentChild?.user?.name || 'সন্তানের'} একাডেমিক অগ্রগতি ও পারফরম্যান্স চার্ট`}
          />
          <AcademicReportCard studentId={currentChild?.id || 1} />
        </div>
      ) : activeTab === 'routine' ? (
        <WeeklyRoutineGrid viewMode="PARENT" studentId={currentChild?.id} />
      ) : activeTab === 'fees' ? (
        /* Fees & Payment with Full Discount Breakdown & Demo Fallback */
        <PaymentHistory
          invoices={invoices}
          studentName={currentChild?.user?.name || 'তাহমিদ হাসান'}
          studentIdNumber={currentChild?.studentIdNumber || 'NGA-26-4821'}
          studentClass={currentChild?.class?.nameBn || '৯ম শ্রেণি'}
          rollNo={currentChild?.rollNo || '০১'}
          onPaymentSuccess={() => selectedChildId && fetchChildDetails(selectedChildId)}
        />
      ) : (
        /* Overview Tab Default */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Digital Student Card */}
          <div className="bg-gradient-to-br from-emerald-600 to-teal-800 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
            <div className="absolute -right-6 -bottom-6 w-36 h-36 bg-white/10 rounded-full blur-xl pointer-events-none" />
            <div className="flex items-center justify-between pb-4 border-b border-white/20">
              <div className="flex items-center space-x-2">
                <GraduationCap className="w-6 h-6" />
                <span className="font-bold text-sm tracking-wide">ডিজিটাল স্টুডেন্ট আইডি</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20">শিক্ষাবর্ষ ২০২৬</span>
            </div>

            <div className="mt-4 flex items-center space-x-4">
              <div className="w-16 h-16 rounded-2xl bg-white text-emerald-800 flex items-center justify-center font-black text-2xl shadow-lg ring-2 ring-emerald-200">
                {currentChild?.user?.name ? currentChild.user.name.charAt(0) : 'S'}
              </div>
              <div>
                <h3 className="font-extrabold text-lg">{currentChild?.user?.name}</h3>
                <p className="text-xs text-emerald-100">আইডি: {currentChild?.studentIdNumber}</p>
                <p className="text-xs text-emerald-100 font-medium">
                  {currentChild?.class?.nameBn} • রোল {currentChild?.rollNo} • {currentChild?.section?.nameBn} শাখা
                </p>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2 text-xs pt-4 border-t border-white/20">
              <div>
                <span className="text-emerald-200 text-[10px]">রক্তের গ্রুপ:</span>
                <p className="font-bold">{currentChild?.bloodGroup || 'B+'}</p>
              </div>
              <div>
                <span className="text-emerald-200 text-[10px]">জরুরি যোগাযোগ:</span>
                <p className="font-bold">{user?.phone || '01712345678'}</p>
              </div>
            </div>
          </div>

          {/* Quick Notice Board */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
            <h3 className="font-bold text-sm text-slate-900 flex items-center space-x-2 pb-2 border-b border-slate-100">
              <BellRing className="w-4 h-4 text-emerald-600" />
              <span>{t('navNotices')}</span>
            </h3>

            <div className="space-y-3">
              {notices.map((n) => (
                <div key={n.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md ${
                      n.priority === 'URGENT' ? 'bg-rose-100 text-rose-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {n.priority === 'URGENT' ? 'জরুরি' : 'বিজ্ঞপ্তি'}
                    </span>
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] text-slate-400">
                        {new Date(n.publishedAt).toLocaleDateString('bn-BD')}
                      </span>
                      <button
                        onClick={() => setSelectedNoticeForSlip(n)}
                        className="px-2 py-0.5 rounded-md bg-white border border-slate-200 hover:bg-emerald-50 hover:text-emerald-700 text-[10px] font-bold text-slate-600 flex items-center space-x-1 transition-colors"
                        title="পিডিএফ নোটিশ স্লিপ"
                      >
                        <Printer className="w-3 h-3" />
                        <span>স্লিপ</span>
                      </button>
                    </div>
                  </div>
                  <h4 className="font-bold text-xs text-slate-800 mt-1">{n.titleBn}</h4>
                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{n.contentBn}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Dynamic Syllabus Progress Tracker Widget */}
          <div className="lg:col-span-2">
            <SyllabusProgress
              studentClass={currentChild?.class?.nameBn || currentChild?.class?.name || 'Class 9'}
            />
          </div>

          {/* Academic Performance Analytics Chart on Main Parent Dashboard */}
          <div className="lg:col-span-2">
            <AcademicPerformanceAnalytics
              student={currentChild ? { nameBn: currentChild.user?.name, rollNo: currentChild.rollNo } : null}
              customTitle={`${currentChild?.user?.name || 'সন্তানের'} বিষয়ভিত্তিক ফলাফল ও পারফরম্যান্স অ্যানালিটিক্স`}
            />
          </div>
        </div>
          )}
        </Suspense>

      {/* Lazy Modals Wrapped in Suspense */}

      <Suspense fallback={null}>
        {selectedInvoiceForPayment && (
          <PaymentModal
            invoice={selectedInvoiceForPayment}
            isOpen={!!selectedInvoiceForPayment}
            onClose={() => setSelectedInvoiceForPayment(null)}
            onPaymentSuccess={handlePaymentSuccess}
          />
        )}

        {receiptData && (
          <ReceiptModal
            receipt={receiptData}
            isOpen={!!receiptData}
            onClose={() => setReceiptData(null)}
          />
        )}
      </Suspense>

      {/* Lightbox / Zoom Image Modal */}
      {previewImageModal && (

        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in"
          onClick={() => setPreviewImageModal(null)}
        >
          <div className="relative max-w-3xl max-h-[85vh] bg-slate-900 p-2 rounded-2xl border border-slate-700 shadow-2xl">
            <button
              onClick={() => setPreviewImageModal(null)}
              className="absolute -top-3 -right-3 p-1.5 bg-rose-600 text-white rounded-full hover:bg-rose-700 shadow-lg"
            >
              <X className="w-4 h-4" />
            </button>
            <img
              src={previewImageModal}
              alt="Homework Enlarged"
              className="max-h-[80vh] w-auto rounded-xl object-contain"
            />
          </div>
        </div>
      )}

      {/* In-Browser PDF Reader Modal */}
      {readingTextbook && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-4xl w-full h-[90vh] shadow-2xl flex flex-col overflow-hidden text-white">
            {/* Header */}
            <div className="p-4 bg-slate-800/90 border-b border-slate-700 flex items-center justify-between gap-3">
              <div className="flex items-center space-x-3 min-w-0">
                <div className="p-2 rounded-xl bg-indigo-600/30 text-indigo-400 border border-indigo-500/30 flex-shrink-0">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div className="truncate">
                  <h3 className="font-bold text-sm sm:text-base text-white truncate">{readingTextbook.titleBn}</h3>
                  <p className="text-xs text-indigo-300 truncate">
                    {currentChild?.class?.nameBn} • {readingTextbook.subject?.nameBn} • {readingTextbook.edition}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2 flex-shrink-0">
                <a
                  href={readingTextbook.fileUrl || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center space-x-1.5 transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">ডাউনলোড PDF</span>
                </a>
                <button
                  onClick={() => setReadingTextbook(null)}
                  className="p-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Reader Body */}
            <div className="flex-1 bg-slate-950 p-4 sm:p-6 overflow-y-auto flex flex-col items-center justify-center">
              <div className="max-w-2xl w-full bg-white text-slate-900 rounded-2xl shadow-2xl p-6 sm:p-10 space-y-6 min-h-[500px] flex flex-col justify-between border border-slate-200">
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b pb-4">
                    <div className="text-xs text-slate-500 font-semibold">
                      জাতীয় শিক্ষাক্রম ও পাঠ্যপুস্তক বোর্ড, বাংলাদেশ (NCTB ২০২৬)
                    </div>
                    <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full font-bold text-xs">
                      {currentChild?.class?.nameBn}
                    </span>
                  </div>

                  <div className="text-center py-6 space-y-3">
                    <div className="w-20 h-24 mx-auto bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-xl shadow-lg flex items-center justify-center text-white">
                      <BookOpen className="w-10 h-10" />
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">{readingTextbook.titleBn}</h2>
                    <h3 className="text-sm font-semibold text-slate-500">{readingTextbook.titleEn}</h3>
                    <p className="text-xs text-indigo-600 font-bold">{readingTextbook.edition}</p>
                    <p className="text-xs text-slate-600 italic">লেখক/বোর্ড: {readingTextbook.author || 'জাতীয় শিক্ষাক্রম ও পাঠ্যপুস্তক বোর্ড'}</p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 leading-relaxed">
                    <h5 className="font-bold text-slate-900 mb-1">বইয়ের বিবরণ:</h5>
                    <p>{readingTextbook.description || 'এই ডিজিটাল ই-বুকটি জাতীয় শিক্ষাক্রম অনুযায়ী সম্পূর্ণ অধ্যায় ও অনুশীলনীর ডিজিটাল সংস্করণ।'}</p>
                  </div>
                </div>

                <div className="pt-4 border-t flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                  <span className="text-slate-500">মোট পৃষ্ঠা: {readingTextbook.totalPages || 150} | সাইজ: {readingTextbook.fileSize || '15 MB'}</span>
                  <div className="flex items-center space-x-2">
                    <a
                      href={readingTextbook.fileUrl || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl flex items-center space-x-1.5"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>সম্পূর্ণ বই পড়ুন (Full View)</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Instant MCQ Result & Solution Review Modal (Parent View) */}
      {reviewResultModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-5 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-xl bg-indigo-50 text-indigo-700">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    সন্তানের উত্তরপত্র ও পরীক্ষার সমাধান
                  </h3>
                  <p className="text-[11px] text-slate-500">{reviewResultModal.examTitle}</p>
                </div>
              </div>
              <button
                onClick={() => setReviewResultModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Score & Badge Hero */}
            <div className={`p-6 rounded-3xl text-center space-y-2 border ${
              reviewResultModal.passed
                ? 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200 text-emerald-950'
                : 'bg-gradient-to-br from-rose-50 to-amber-50 border-rose-200 text-rose-950'
            }`}>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                reviewResultModal.passed ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
              }`}>
                {reviewResultModal.passed ? '🎉 উত্তীর্ণ (Passed)' : '⚠️ অনুত্তীর্ণ (Needs Improvement)'}
              </span>

              <div className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
                {reviewResultModal.obtainedScore} / {reviewResultModal.totalScore}
              </div>
              <p className="text-xs font-bold text-slate-600 font-mono">
                প্রাপ্ত নম্বর: {reviewResultModal.percentage}%
              </p>
              {reviewResultModal.teacherFeedback && (
                <p className="text-xs text-slate-700 italic pt-1">
                  <strong>শিক্ষকের মন্তব্য:</strong> {reviewResultModal.teacherFeedback}
                </p>
              )}
            </div>

            {/* Detailed Question Review List */}
            {reviewResultModal.detailedEvaluations && (
              <div className="space-y-3 pt-2">
                <h4 className="font-bold text-xs text-slate-800 flex items-center space-x-1.5">
                  <CheckSquare className="w-4 h-4 text-indigo-600" />
                  <span>প্রশ্নভিত্তিক পর্যালোচনা ও সঠিক উত্তর:</span>
                </h4>

                <div className="space-y-3">
                  {reviewResultModal.detailedEvaluations.map((item, idx) => (
                    <div
                      key={idx}
                      className={`p-3.5 rounded-2xl border text-xs space-y-2 ${
                        item.isCorrect ? 'bg-emerald-50/40 border-emerald-200' : 'bg-rose-50/40 border-rose-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">প্রশ্ন {idx + 1}: {item.questionBn}</span>
                        <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                          item.isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {item.isCorrect ? '✓ সঠিক' : '✕ ভুল'}
                        </span>
                      </div>

                      {/* Options */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                        {item.options?.map((opt, oIdx) => {
                          const isChosen = item.chosenIndex === oIdx;
                          const isCorrectOpt = item.correctIndex === oIdx;

                          return (
                            <div
                              key={oIdx}
                              className={`p-2 rounded-xl text-[11px] font-medium flex items-center justify-between border ${
                                isCorrectOpt
                                  ? 'bg-emerald-100 border-emerald-300 text-emerald-900 font-bold'
                                  : isChosen
                                  ? 'bg-rose-100 border-rose-300 text-rose-900 line-through'
                                  : 'bg-white border-slate-200 text-slate-600'
                              }`}
                            >
                              <span>{['ক', 'খ', 'গ', 'ঘ'][oIdx] || oIdx + 1}. {opt}</span>
                              {isCorrectOpt && <span className="text-[10px] text-emerald-700 font-bold">✓ সঠিক</span>}
                              {isChosen && !isCorrectOpt && <span className="text-[10px] text-rose-700 font-bold">সন্তানের উত্তর</span>}
                            </div>
                          );
                        })}
                      </div>

                      {item.explanation && (
                        <div className="p-2 bg-white rounded-xl border border-slate-200 text-[11px] text-slate-600 italic">
                          <strong className="text-indigo-700 not-italic font-bold">ব্যাখ্যা:</strong> {item.explanation}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-3 border-t flex justify-end">
              <button
                onClick={() => setReviewResultModal(null)}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Printable Notice Slip Modal */}
      {selectedNoticeForSlip && (
        <PrintableNoticeSlipModal
          notice={selectedNoticeForSlip}
          isOpen={!!selectedNoticeForSlip}
          onClose={() => setSelectedNoticeForSlip(null)}
        />
      )}

      {/* Floating Bilingual Dictionary & Science Glossary Widget */}
      <BilingualDictionaryWidget />
    </div>
  );
}


