import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { studentAPI, noticeAPI, homeworkAPI, materialAPI, textbookAPI, examAPI } from '../services/api';
import ReceiptModal from '../components/common/ReceiptModal';
import PaymentModal from '../components/common/PaymentModal';
import LiveClassroomView from '../components/liveclass/LiveClassroomView';
import LiveClassNotificationBanner from '../components/liveclass/LiveClassNotificationBanner';
import TeacherDirectory from '../components/common/TeacherDirectory';
import WeeklyRoutineGrid from '../components/common/WeeklyRoutineGrid';
import AcademicReportCard from '../components/common/AcademicReportCard';
import AcademicPerformanceAnalytics from '../components/common/AcademicPerformanceAnalytics';
import RecordedClassLibrary from '../components/common/RecordedClassLibrary';
import ResourceLibrary from '../components/common/ResourceLibrary';
import DigitalHomeworkDropzone from '../components/student/DigitalHomeworkDropzone';
import StudentInteractiveTimetable from '../components/student/StudentInteractiveTimetable';
import StudentResultScorecard from '../components/student/StudentResultScorecard';
import PrintableStudentIdCardModal from '../components/common/PrintableStudentIdCardModal';
import MCQQuizModelTestModal from '../components/common/MCQQuizModelTestModal';
import PrintableNoticeSlipModal from '../components/common/PrintableNoticeSlipModal';
import PrintableRoutineSlipModal from '../components/common/PrintableRoutineSlipModal';
import {
  Film,
  GraduationCap,
  CalendarCheck,
  Award,
  CalendarDays,
  CreditCard,
  BellRing,
  Droplet,
  Clock,
  Printer,
  Sparkles,
  BookOpen,
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
  Eye,
  HelpCircle,
  Timer,
  CheckSquare,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  ShieldAlert,
  Send
} from 'lucide-react';

export default function StudentDashboard({ activeTab = 'dashboard' }) {
  const { t, lang } = useLanguage();
  const { user } = useAuth();

  const [profile, setProfile] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [attendance, setAttendance] = useState(null);
  const [results, setResults] = useState(null);
  const [routine, setRoutine] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [homeworkList, setHomeworkList] = useState([]);
  const [materialsList, setMaterialsList] = useState([]);
  const [materialSearch, setMaterialSearch] = useState('');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState('');
  const [textbooksList, setTextbooksList] = useState([]);
  const [textbookSubTab, setTextbookSubTab] = useState('ebooks'); // 'ebooks' | 'recorded'
  const [textbookSearch, setTextbookSearch] = useState('');
  const [textbookSubjectFilter, setTextbookSubjectFilter] = useState('');
  const [readingTextbook, setReadingTextbook] = useState(null);
  const [previewImageModal, setPreviewImageModal] = useState(null);
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [receiptData, setReceiptData] = useState(null);
  const [selectedInvoiceForPayment, setSelectedInvoiceForPayment] = useState(null);

  // Online Exams State
  const [examsList, setExamsList] = useState([]);
  const [examSummary, setExamSummary] = useState(null);
  const [examSubTab, setExamSubTab] = useState('ACTIVE'); // 'ACTIVE' | 'COMPLETED'
  const [takingExam, setTakingExam] = useState(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [studentAnswers, setStudentAnswers] = useState({}); // { [qId]: selectedOptIdx }
  const [writtenAnswerText, setWrittenAnswerText] = useState('');
  const [writtenSubmissionUrl, setWrittenSubmissionUrl] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [antiCheatWarnings, setAntiCheatWarnings] = useState(0);
  const [showAntiCheatAlert, setShowAntiCheatAlert] = useState(false);
  const [isSubmittingExam, setIsSubmittingExam] = useState(false);
  const [reviewResultModal, setReviewResultModal] = useState(null);
  const [showIdCardModal, setShowIdCardModal] = useState(false);
  const [selectedNoticeForSlip, setSelectedNoticeForSlip] = useState(null);
  const [showStudentRoutineSlip, setShowStudentRoutineSlip] = useState(false);

  useEffect(() => {
    fetchStudentData();
  }, [activeTab]);

  const fetchStudentData = async () => {
    setLoading(true);
    try {
      const [profRes, dashRes, attRes, resRes, routRes, invRes, notifRes] = await Promise.all([
        studentAPI.getProfile(),
        studentAPI.getDashboard(),
        studentAPI.getAttendance(),
        studentAPI.getResults(),
        studentAPI.getRoutine(),
        studentAPI.getInvoices(),
        noticeAPI.getNotices('STUDENT')
      ]);

      if (profRes.success) {
        setProfile(profRes.data);
        const [hwRes, matRes, tbRes, examRes] = await Promise.all([
          homeworkAPI.getStudentHomework(profRes.data.id),
          materialAPI.getStudentMaterials(profRes.data.id),
          textbookAPI.getTextbooks({ classId: profRes.data.classId }),
          examAPI.getStudentExams(profRes.data.id)
        ]);
        if (hwRes.success) setHomeworkList(hwRes.data);
        if (matRes.success) setMaterialsList(matRes.data);
        if (tbRes.success) setTextbooksList(tbRes.data);
        if (examRes.success && examRes.data) {
          setExamsList(examRes.data.exams || []);
          setExamSummary(examRes.data.summary || null);
        }
      }
      if (dashRes.success) setDashboard(dashRes.data);
      if (attRes.success) setAttendance(attRes.data);
      if (resRes.success) setResults(resRes.data);
      if (routRes.success) setRoutine(routRes.data);
      if (invRes.success) setInvoices(invRes.data);
      if (notifRes.success) setNotices(notifRes.data);
    } catch (err) {
      console.error('Failed to load student data:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadExamsOnly = async () => {
    if (!profile?.id) return;
    try {
      const res = await examAPI.getStudentExams(profile.id);
      if (res.success && res.data) {
        setExamsList(res.data.exams || []);
        setExamSummary(res.data.summary || null);
      }
    } catch (err) {
      console.error('Failed to load exams:', err);
    }
  };

  // Countdown timer for active exam
  useEffect(() => {
    if (!takingExam || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAutoSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [takingExam, timeLeft]);

  // Anti-cheating visibility detector
  useEffect(() => {
    if (!takingExam) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setAntiCheatWarnings(prev => prev + 1);
        setShowAntiCheatAlert(true);
      }
    };

    const handleBlur = () => {
      setAntiCheatWarnings(prev => prev + 1);
      setShowAntiCheatAlert(true);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
    };
  }, [takingExam]);

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleStartExam = (exam) => {
    setTakingExam(exam);
    setCurrentQuestionIdx(0);
    setStudentAnswers({});
    setWrittenAnswerText('');
    setWrittenSubmissionUrl('');
    setAntiCheatWarnings(0);
    setShowAntiCheatAlert(false);
    setTimeLeft((exam.durationMinutes || 15) * 60);
  };

  const handleSelectMCQOption = (questionId, optIndex) => {
    setStudentAnswers(prev => ({
      ...prev,
      [questionId]: optIndex
    }));
  };

  const handleSubmitExam = async (isAuto = false) => {
    if (!takingExam) return;
    if (!isAuto && takingExam.type === 'MCQ') {
      const answeredCount = Object.keys(studentAnswers).length;
      const totalQ = takingExam.questions?.length || 0;
      if (answeredCount < totalQ) {
        if (!window.confirm(`আপনি ${totalQ}টি প্রশ্নের মধ্যে ${answeredCount}টির উত্তর দিয়েছেন। পরীক্ষা জমা দিতে চান?`)) {
          return;
        }
      }
    }

    setIsSubmittingExam(true);
    try {
      const formattedAnswers = Object.entries(studentAnswers).map(([qId, selectedOption]) => ({
        questionId: Number(qId),
        selectedOption: Number(selectedOption)
      }));

      const payload = {
        studentAnswers: formattedAnswers,
        submissionUrl: writtenSubmissionUrl || null,
        submissionText: writtenAnswerText || null
      };

      const res = await examAPI.submitExam(takingExam.id, payload);
      if (res.success) {
        setTakingExam(null);
        loadExamsOnly();
        if (takingExam.type === 'MCQ' && res.data?.detailedEvaluations) {
          setReviewResultModal(res.data);
        } else {
          alert(res.message || 'পরীক্ষা সফলভাবে জমা হয়েছে!');
        }
      }
    } catch (err) {
      alert(err.message || 'পরীক্ষা জমা দিতে সমস্যা হয়েছে');
    } finally {
      setIsSubmittingExam(false);
    }
  };

  const handleAutoSubmitExam = () => {
    alert('⏰ পরীক্ষার সময়সীমা সমাপ্ত হয়েছে! আপনার উত্তরপত্র স্বয়ংক্রিয়ভাবে জমা দেওয়া হচ্ছে।');
    handleSubmitExam(true);
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
      alert(`লিখিত পরীক্ষার মূল্যায়ন ফলাফল:\nপ্রাপ্ত নম্বর: ${exam.mySubmission.obtainedScore || 0} / ${exam.totalMarks}\nশিক্ষকের মন্তব্য: ${exam.mySubmission.teacherFeedback || 'খাতা মূল্যায়ন সম্পন্ন।'}`);
    }
  };

  const handleToggleHomework = async (homeworkId, currentStatus) => {
    const nextStatus = currentStatus === 'COMPLETED' ? 'PENDING' : 'COMPLETED';
    try {
      const res = await homeworkAPI.toggleStatus(homeworkId, profile?.id || user?.studentId, nextStatus);
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

  if (loading && !profile) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Student Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-950 to-slate-900 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-2 border border-emerald-500/30">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>{t('studentTitle')}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold">{profile?.user?.name || user?.name}</h2>
          <p className="text-xs text-emerald-200/80 mt-1">
            {profile?.class?.nameBn} • রোল {profile?.rollNo} • {profile?.section?.nameBn} শাখা • আইডি: {profile?.studentIdNumber} • ভর্তির তারিখ: {profile?.admissionDate || profile?.admission_date ? new Date(profile?.admissionDate || profile?.admission_date).toLocaleDateString('bn-BD', { day: 'numeric', month: 'short', year: 'numeric' }) : '০১ জানুয়ারি ২০২৪'}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setShowIdCardModal(true)}
            className="px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white text-xs font-bold rounded-2xl shadow-lg shadow-emerald-500/20 flex items-center space-x-2 transition-all active:scale-95 border border-emerald-400/30"
          >
            <Printer className="w-4 h-4" />
            <span>আইডি কার্ড প্রিন্ট</span>
          </button>
          <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/10 text-center">
            <span className="text-[10px] text-emerald-200 block uppercase font-bold">শিক্ষাবর্ষ</span>
            <span className="text-sm font-bold">২০২৬</span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Attendance */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">{t('overallAttendance')}</span>
            <div className="p-2 rounded-xl bg-teal-50 text-teal-600">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">
            {dashboard?.metrics?.attendanceRate || 96.0}%
          </p>
          <span className="text-[11px] text-teal-600 font-semibold mt-1 inline-block">
            {dashboard?.metrics?.presentDays || 24} দিন উপস্থিত
          </span>
        </div>

        {/* GPA */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">{t('currentGPA')}</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">
            {results?.summary?.gpa || '5.00'}
          </p>
          <span className="text-[11px] text-purple-600 font-semibold mt-1 inline-block">
            ১ম সাময়িক পরীক্ষা
          </span>
        </div>

        {/* Study Materials Count */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">{t('materialsTitle')}</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <BookMarked className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">
            {materialsList.length}টি শিট
          </p>
          <span className="text-[11px] text-blue-600 font-semibold mt-1 inline-block">
            অধ্যায়ভিত্তিক লেকচার নোট
          </span>
        </div>

        {/* Homework Tasks */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">{t('homeworkTitle')}</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <ClipboardList className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">
            {homeworkList.filter(h => h.status === 'PENDING').length}টি বাকি
          </p>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 inline-block">
            {homeworkList.filter(h => h.status === 'COMPLETED').length}টি সম্পন্ন
          </span>
        </div>
      </div>

      {/* Live Class 15-Minute Alert Banner */}
      <LiveClassNotificationBanner classId={profile?.classId} sectionId={profile?.sectionId} />

      {/* Main Tabs */}
      {activeTab === 'teachers' ? (
        <TeacherDirectory role="STUDENT" />
      ) : activeTab === 'live-classes' ? (
        <LiveClassroomView studentId={profile?.id || user?.studentId} role="STUDENT" />
      ) : activeTab === 'exams' ? (
        /* Student Online Exams & Assessment Center */
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
                <span className="text-xs font-bold text-slate-500">উত্তীর্ণ (Passed)</span>
                <p className="text-2xl font-black text-blue-600 mt-1">
                  {examSummary?.passedExams || examsList.filter(e => e.mySubmission?.passed).length}টি
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

          {/* Exam Sub-tabs Toggle */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setExamSubTab('ACTIVE')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
                    examSubTab === 'ACTIVE'
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>চলমান ও আসন্ন পরীক্ষা ({examsList.filter(e => !e.hasSubmitted).length})</span>
                </button>

                <button
                  onClick={() => setExamSubTab('COMPLETED')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
                    examSubTab === 'COMPLETED'
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>সম্পন্ন হওয়া পরীক্ষা ও ফলাফল ({examsList.filter(e => e.hasSubmitted).length})</span>
                </button>
              </div>

              <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-xl">
                {profile?.class?.nameBn}
              </span>
            </div>

            {/* Exams List */}
            {examsList.filter(e => (examSubTab === 'ACTIVE' ? !e.hasSubmitted : e.hasSubmitted)).length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <HelpCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-500">
                  {examSubTab === 'ACTIVE' ? 'এই মুহূর্তে কোনো আসন্ন বা বাকি পরীক্ষা নেই' : 'এখনো কোনো সম্পন্ন পরীক্ষার রেকর্ড নেই'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {examsList
                  .filter(e => (examSubTab === 'ACTIVE' ? !e.hasSubmitted : e.hasSubmitted))
                  .map((exam) => {
                    const isDone = exam.hasSubmitted;
                    const sub = exam.mySubmission;

                    return (
                      <div
                        key={exam.id}
                        className={`p-4 rounded-2xl border transition-all space-y-3 flex flex-col justify-between ${
                          isDone ? 'bg-slate-50/70 border-slate-200' : 'bg-indigo-50/20 border-indigo-200'
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
                          <p className="text-xs text-slate-600 leading-relaxed">{exam.instructions}</p>

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
                        </div>

                        {/* Footer Action */}
                        <div className="pt-2 border-t border-slate-200">
                          {isDone ? (
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-slate-500 font-medium">
                                  প্রাপ্ত নম্বর: <strong className="text-indigo-700 font-mono text-sm">{sub?.obtainedScore} / {exam.totalMarks}</strong> ({sub?.percentage}%)
                                </span>
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  sub?.status === 'SUBMITTED'
                                    ? 'bg-amber-100 text-amber-800'
                                    : sub?.passed
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-rose-100 text-rose-800'
                                }`}>
                                  {sub?.status === 'SUBMITTED' ? 'মূল্যায়ন চলছে' : sub?.passed ? 'উত্তীর্ণ (Passed)' : 'অনুত্তীর্ণ (Failed)'}
                                </span>
                              </div>

                              <button
                                onClick={() => handleViewExamResult(exam)}
                                className="w-full py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-xl flex items-center justify-center space-x-1.5 transition-all"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>ফলাফল ও সমাধান দেখুন (View Result)</span>
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleStartExam(exam)}
                              className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-600/25 flex items-center justify-center space-x-2 transition-all transform active:scale-95"
                            >
                              <Timer className="w-4 h-4" />
                              <span>{t('startExam')}</span>
                            </button>
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
        /* Study Materials Tab */
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <BookMarked className="w-5 h-5 text-blue-600" />
                <span>{t('materialsTitle')}</span>
              </h3>
              <p className="text-xs text-slate-500">তোমার ক্লাসের সকল বিষয়ের লেকচার নোট, হ্যান্ডনোট ও পড়ার শিট</p>
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
                      শিক্ষক: {m.teacher?.user?.name || 'শিক্ষক'}
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
        /* Digital Textbooks & Recorded Video Lectures Module */
        <div className="space-y-4">
          {/* Sub-tab Switcher */}
          <div className="flex items-center space-x-2 bg-slate-100 p-1.5 rounded-2xl w-fit border border-slate-200">
            <button
              onClick={() => setTextbookSubTab('ebooks')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
                textbookSubTab === 'ebooks'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>NCTB পাঠ্যপুস্তক ও ই-বুক (E-Books)</span>
            </button>
            <button
              onClick={() => setTextbookSubTab('recorded')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
                textbookSubTab === 'recorded'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Film className="w-4 h-4 text-amber-300" />
              <span>রেকর্ডেড ক্লাস ও ভিডিও লাইব্রেরি (Video Archive)</span>
            </button>
          </div>

          {textbookSubTab === 'recorded' ? (
            <RecordedClassLibrary
              studentId={profile?.id}
              role="STUDENT"
              classIdFilter={profile?.classId}
            />
          ) : (
            <ResourceLibrary
              studentId={profile?.id}
              role="STUDENT"
              classIdFilter={profile?.classId}
            />
          )}
        </div>
      ) : activeTab === 'homework' ? (
        /* Homework To-Do List */
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <ClipboardList className="w-5 h-5 text-emerald-600" />
                <span>{t('homeworkTitle')}</span>
              </h3>
              <p className="text-xs text-slate-500">তোমার প্রতিদিনের বাড়ির কাজ সম্পূর্ণ করো এবং সম্পন্ন বাটনে ক্লিক করো</p>
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
                    isDone ? 'bg-emerald-50/40 border-emerald-200' : 'bg-slate-50/70 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold">
                      {hw.subject?.nameBn || 'বিষয়'}
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
                    <h4 className={`font-bold text-sm ${isDone ? 'text-slate-700 line-through' : 'text-slate-900'}`}>
                      {hw.topicBn}
                    </h4>
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
                      <span><strong>জমা দেওয়ার শেষ তারিখ:</strong> {hw.dueDate}</span>
                    </span>
                    <span>শিক্ষক: {hw.teacher?.user?.name || 'শিক্ষক'}</span>
                  </div>

                  {/* Digital Homework Dropzone */}
                  {!isDone && (
                    <DigitalHomeworkDropzone
                      homework={hw}
                      onSubmitted={() => handleToggleHomework(hw.id, 'PENDING')}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : activeTab === 'results' ? (
        <div className="space-y-6">
          <AcademicPerformanceAnalytics
            student={profile || { nameBn: user?.name, rollNo: profile?.rollNo }}
            customTitle="আমার সার্বিক একাডেমিক ফলাফল ও পারফরম্যান্স গ্রাফ"
          />
          <StudentResultScorecard
            results={results}
            studentName={user?.name || 'তাহমিদ হাসান'}
            studentRoll={profile?.roll || '1001'}
            studentClass={profile?.class?.nameBn || '১০ম শ্রেণি'}
          />
          <AcademicReportCard studentId={profile?.id || 1} />
        </div>
      ) : activeTab === 'routine' ? (
        <div className="space-y-6">
          <StudentInteractiveTimetable
            routine={routine}
            studentClass={profile?.class?.nameBn || '১০ম শ্রেণি'}
          />
          <WeeklyRoutineGrid viewMode="STUDENT" />
        </div>
      ) : activeTab === 'fees' ? (
        /* Fees & Payment with Full Discount Breakdown */
        <div className="space-y-5">
          {/* Financial Summary Cards */}
          {(() => {
            const totalBase = invoices.reduce((sum, inv) => sum + (Number(inv.baseAmount) || Number(inv.amount) || 0), 0);
            const totalDiscount = invoices.reduce((sum, inv) => sum + (Number(inv.discountAmount) || 0), 0);
            const totalPaid = invoices.filter(inv => inv.status === 'PAID').reduce((sum, inv) => sum + (Number(inv.amount) || 0), 0);
            const totalDue = invoices.filter(inv => inv.status === 'UNPAID').reduce((sum, inv) => sum + (Number(inv.amount) || 0), 0);

            return (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">মোট মূল ফি</span>
                  <p className="text-xl font-black text-slate-800 mt-1">৳ {totalBase.toLocaleString('en-BD')}</p>
                  <span className="text-[10px] text-slate-400 font-semibold">ধার্যকৃত মোট ফি</span>
                </div>

                <div className="bg-emerald-50/80 p-4 rounded-2xl border border-emerald-200 shadow-sm">
                  <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">প্রাপ্ত মোট ছাড়/বৃত্তি</span>
                  <p className="text-xl font-black text-emerald-700 mt-1">৳ {totalDiscount.toLocaleString('en-BD')}</p>
                  <span className="text-[10px] text-emerald-600 font-semibold">মওকুফকৃত স্কলারশিপ</span>
                </div>

                <div className="bg-blue-50/80 p-4 rounded-2xl border border-blue-200 shadow-sm">
                  <span className="text-xs font-bold text-blue-800 uppercase tracking-wider">পরিশোধিত ফি</span>
                  <p className="text-xl font-black text-blue-700 mt-1">৳ {totalPaid.toLocaleString('en-BD')}</p>
                  <span className="text-[10px] text-blue-600 font-semibold">{invoices.filter(i => i.status === 'PAID').length}টি পরিশোধিত</span>
                </div>

                <div className="bg-amber-50/80 p-4 rounded-2xl border border-amber-200 shadow-sm">
                  <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">বর্তমান নিট বকেয়া</span>
                  <p className="text-xl font-black text-amber-700 mt-1">৳ {totalDue.toLocaleString('en-BD')}</p>
                  <span className="text-[10px] text-amber-600 font-semibold">{invoices.filter(i => i.status === 'UNPAID').length}টি পরিশোধ বাকি</span>
                </div>
              </div>
            );
          })()}

          {/* Invoices Table Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                  <CreditCard className="w-5 h-5 text-emerald-600" />
                  <span>{t('navFees')} ও পেমেন্ট হিস্ট্রি</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">ফি বিবরণ, স্কলারশিপ ছাড়ের হিসাব ও ডিজিটাল মানি রিসিট সংগ্রহ করুন</p>
              </div>

              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100">
                {profile?.class?.nameBn} • রোল: {profile?.rollNo}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3">ইনভয়েস নম্বর</th>
                    <th className="p-3">ফি বিবরণ ও মাস</th>
                    <th className="p-3 text-right">মূল ফি</th>
                    <th className="p-3 text-center">স্কলারশিপ / ছাড়</th>
                    <th className="p-3 text-right">প্রদেয় মোট ফি</th>
                    <th className="p-3 text-center">জমার শেষ তারিখ</th>
                    <th className="p-3 text-center">স্ট্যাটাস</th>
                    <th className="p-3 text-center">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {invoices.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-slate-400">
                        কোনো ফি বা ইনভয়েসের তথ্য পাওয়া যায়নি।
                      </td>
                    </tr>
                  ) : (
                    invoices.map((inv) => {
                      const base = Number(inv.baseAmount) || Number(inv.amount) || 0;
                      const disc = Number(inv.discountAmount) || 0;
                      const net = Number(inv.amount) || 0;

                      return (
                        <tr key={inv.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="p-3 font-mono font-bold text-slate-800">{inv.invoiceNo}</td>
                          <td className="p-3">
                            <p className="font-bold text-slate-800">{inv.titleBn}</p>
                            <span className="text-[11px] text-slate-400">{inv.month} {inv.year}</span>
                          </td>
                          <td className="p-3 text-right font-semibold text-slate-700">
                            ৳ {base.toLocaleString('en-BD')}
                          </td>
                          <td className="p-3 text-center">
                            {disc > 0 ? (
                              <div className="inline-flex flex-col items-center">
                                <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 font-extrabold text-[10px] border border-emerald-200">
                                  - ৳ {disc.toLocaleString('en-BD')}
                                </span>
                                <span className="text-[9px] text-emerald-700 font-bold mt-0.5">
                                  {inv.discountReason === 'MERIT_SCHOLARSHIP'
                                    ? 'মেধাবৃত্তি'
                                    : inv.discountReason === 'SIBLING_DISCOUNT'
                                    ? 'ভাই-বোন ছাড়'
                                    : inv.discountReason === 'SPECIAL_WAIVER'
                                    ? 'বিশেষ বিবেচনা'
                                    : inv.discountReason === 'POVERTY_AID'
                                    ? 'দরিদ্র তহবিল'
                                    : (inv.discountType === 'PERCENTAGE' ? `${inv.discountValue}% ছাড়` : 'অনুমোদিত ছাড়')}
                                </span>
                              </div>
                            ) : (
                              <span className="text-slate-400 text-[11px] font-mono">-</span>
                            )}
                          </td>
                          <td className="p-3 text-right font-extrabold text-slate-900 text-sm">
                            ৳ {net.toLocaleString('en-BD')}
                          </td>
                          <td className="p-3 text-center text-slate-500 font-medium">{inv.dueDate}</td>
                          <td className="p-3 text-center">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              inv.status === 'PAID'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}>
                              {inv.status === 'PAID' ? t('paidStatus') : t('unpaidStatus')}
                            </span>
                          </td>
                          <td className="p-3 text-center">
                            {inv.status === 'UNPAID' ? (
                              <button
                                onClick={() => setSelectedInvoiceForPayment(inv)}
                                className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center space-x-1.5 mx-auto transition-transform active:scale-95"
                              >
                                <CreditCard className="w-3.5 h-3.5" />
                                <span>{t('payNow')}</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  setReceiptData({
                                    receiptNo: `RCPT-2026-${inv.id.toString().padStart(5, '0')}`,
                                    transactionId: inv.payments?.[0]?.transactionId || 'BKASH-TXN-99824',
                                    invoiceNo: inv.invoiceNo,
                                    invoiceTitleBn: inv.titleBn,
                                    invoiceTitleEn: inv.titleEn,
                                    baseAmount: base,
                                    discountType: inv.discountType || 'NONE',
                                    discountValue: inv.discountValue || 0,
                                    discountReason: inv.discountReason || null,
                                    discountAmount: disc,
                                    amountPaid: net,
                                    currency: 'BDT (৳)',
                                    method: inv.payments?.[0]?.method || 'BKASH',
                                    paidAt: inv.payments?.[0]?.paidAt || new Date().toISOString(),
                                    studentName: profile?.user?.name,
                                    studentIdNumber: profile?.studentIdNumber,
                                    className: profile?.class?.nameBn,
                                    sectionName: profile?.section?.nameBn,
                                    status: 'SUCCESS'
                                  });
                                }}
                                className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] flex items-center space-x-1.5 mx-auto transition-colors"
                              >
                                <Printer className="w-3.5 h-3.5 text-slate-500" />
                                <span>রসিদ দেখুন</span>
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* Overview & Digital ID Card Default */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Digital ID Card */}
          <div className="bg-gradient-to-br from-teal-600 to-emerald-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-white/20">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-slate-950 border border-amber-400/40 p-0.5 flex items-center justify-center overflow-hidden shadow-sm">
                  <img src="/logo.png" alt="NextGen Logo" className="w-full h-full object-cover rounded-md" />
                </div>
                <span className="font-bold text-sm">ডিজিটাল স্টুডেন্ট আইডি</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20">শিক্ষাবর্ষ ২০২৬</span>
            </div>

            <div className="mt-4 flex items-center space-x-4">
              <div className="w-16 h-16 rounded-2xl bg-white text-emerald-900 flex items-center justify-center font-black text-2xl shadow-lg ring-2 ring-emerald-200">
                {profile?.user?.name ? profile.user.name.charAt(0) : 'S'}
              </div>
              <div>
                <h3 className="font-extrabold text-lg">{profile?.user?.name}</h3>
                <p className="text-xs text-emerald-100 font-medium">আইডি: {profile?.studentIdNumber}</p>
                <p className="text-xs text-emerald-100 font-medium">
                  {profile?.class?.nameBn} • রোল {profile?.rollNo} • {profile?.section?.nameBn} শাখা
                </p>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs pt-4 border-t border-white/20">
              <div>
                <span className="text-emerald-200 text-[10px]">রক্তের গ্রুপ:</span>
                <p className="font-bold">{profile?.bloodGroup || 'B+'}</p>
              </div>
              <div>
                <span className="text-emerald-200 text-[10px]">ভর্তির তারিখ:</span>
                <p className="font-bold">
                  {profile?.admissionDate || profile?.admission_date
                    ? new Date(profile.admissionDate || profile.admission_date).toLocaleDateString('bn-BD', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })
                    : '০১ জানুয়ারি ২০২৪'}
                </p>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <span className="text-emerald-200 text-[10px]">ঠিকানা:</span>
                <p className="font-medium truncate">{profile?.address || 'ধানমন্ডি, ঢাকা'}</p>
              </div>
            </div>
          </div>

          {/* Notices */}
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

          {/* Academic Performance Analytics Chart on Main Dashboard */}
          <div className="lg:col-span-2">
            <AcademicPerformanceAnalytics
              student={profile || { nameBn: user?.name, rollNo: profile?.rollNo }}
              customTitle="সার্বিক পরীক্ষার ফলাফল ও একাডেমিক অগ্রগতি অ্যানালিটিক্স"
            />
          </div>
        </div>
      )}

      {receiptData && (
        <ReceiptModal
          receipt={receiptData}
          isOpen={!!receiptData}
          onClose={() => setReceiptData(null)}
        />
      )}

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
                    {profile?.class?.nameBn} • {readingTextbook.subject?.nameBn} • {readingTextbook.edition}
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
                      {profile?.class?.nameBn}
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

      {/* Instant MCQ Result & Solution Review Modal */}
      {reviewResultModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-5 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-xl bg-indigo-50 text-indigo-700">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    পরীক্ষার ফলাফল ও নির্ভুল সমাধান
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
              <p className="text-xs text-slate-700 italic pt-1">{reviewResultModal.teacherFeedback}</p>
            </div>

            {/* Detailed Question Review List */}
            {reviewResultModal.detailedEvaluations && (
              <div className="space-y-3 pt-2">
                <h4 className="font-bold text-xs text-slate-800 flex items-center space-x-1.5">
                  <CheckSquare className="w-4 h-4 text-indigo-600" />
                  <span>প্রশ্নভিত্তিক পর্যালোচনা ও সঠিক উত্তরের ব্যাখ্যা:</span>
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
                          {item.isCorrect ? '✓ সঠিক (+১)' : '✕ ভুল (০)'}
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
                              {isChosen && !isCorrectOpt && <span className="text-[10px] text-rose-700 font-bold">তোমার উত্তর</span>}
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

      {/* Payment Modal */}
      {selectedInvoiceForPayment && (
        <PaymentModal
          invoice={selectedInvoiceForPayment}
          onClose={() => setSelectedInvoiceForPayment(null)}
          onSuccess={(receipt) => {
            setSelectedInvoiceForPayment(null);
            setReceiptData(receipt);
            fetchStudentData();
          }}
        />
      )}

      {/* Printable Receipt Modal */}
      {receiptData && (
        <ReceiptModal
          receipt={receiptData}
          onClose={() => setReceiptData(null)}
        />
      )}

      {/* Printable Digital Student ID Card */}
      {showIdCardModal && profile && (
        <PrintableStudentIdCardModal
          student={profile}
          isOpen={showIdCardModal}
          onClose={() => setShowIdCardModal(false)}
        />
      )}

      {/* Interactive MCQ Quiz & Model Test Modal */}
      {takingExam && (
        <MCQQuizModelTestModal
          exam={takingExam}
          isOpen={!!takingExam}
          onClose={() => setTakingExam(null)}
          onExamFinished={() => {
            loadExamsOnly();
            fetchStudentData();
          }}
        />
      )}

      {/* Printable Notice Slip Modal */}
      {selectedNoticeForSlip && (
        <PrintableNoticeSlipModal
          notice={selectedNoticeForSlip}
          isOpen={!!selectedNoticeForSlip}
          onClose={() => setSelectedNoticeForSlip(null)}
        />
      )}

      {/* Printable Routine Slip Modal */}
      {showStudentRoutineSlip && (
        <PrintableRoutineSlipModal
          routineData={routine}
          classInfo={profile?.class || { id: profile?.classId, nameBn: 'শ্রেণি' }}
          batchInfo={profile?.batch || { id: profile?.batchId, nameBn: 'আমার ব্যাচ' }}
          isOpen={showStudentRoutineSlip}
          onClose={() => setShowStudentRoutineSlip(false)}
        />
      )}
    </div>
  );
}
