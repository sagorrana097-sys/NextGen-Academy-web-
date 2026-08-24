import React, { useState, useEffect, Suspense, lazy } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { adminAPI, analyticsAPI, noticeAPI, curriculumAPI, textbookAPI, teacherAttendanceAPI, examAPI } from '../services/api';
import { useSWRCache, getCacheItem, setCacheItem } from '../utils/swrCache';
import LoadingFallback from '../components/common/LoadingFallback';
import DashboardSkeletonLoader from '../components/common/DashboardSkeletonLoader';
import Student360Modal from '../components/common/Student360Modal';
import ExecutiveSummaryModal from '../components/common/ExecutiveSummaryModal';
import AdminQuickFloater from '../components/admin/AdminQuickFloater';
import AnimatedCounter from '../components/common/AnimatedCounter';
import UniversalFileUploader from '../components/common/UniversalFileUploader';
import DeleteConfirmationModal from '../components/common/DeleteConfirmationModal';
import AdminDashboardStats from '../components/admin/AdminDashboardStats';

// Code-split Lazy Loaded Admin Modules
const LiveClassManager = lazy(() => import('../components/liveclass/LiveClassManager'));
const BatchManagement = lazy(() => import('../components/admin/BatchManagement'));
const WeeklyRoutineGrid = lazy(() => import('../components/common/WeeklyRoutineGrid'));
const ResultsManager = lazy(() => import('../components/admin/ResultsManager'));
const AccountsAndPayroll = lazy(() => import('../components/admin/AccountsAndPayroll'));
const AdminSettings = lazy(() => import('../components/admin/AdminSettings'));
const AdminProfileManager = lazy(() => import('../components/admin/AdminProfileManager'));
const SecurityAuditLogs = lazy(() => import('../components/admin/SecurityAuditLogs'));
const AdmissionManager = lazy(() => import('../components/admin/AdmissionManager'));
const DataBackupManager = lazy(() => import('../components/admin/DataBackupManager'));
const BulkSMSManager = lazy(() => import('../components/admin/BulkSMSManager'));
const StudentManager = lazy(() => import('../components/admin/StudentManager'));
const TeacherManager = lazy(() => import('../components/admin/TeacherManager'));
const NoticeManager = lazy(() => import('../components/admin/NoticeManager'));
const PaymentMethodManager = lazy(() => import('../components/admin/PaymentMethodManager'));
const OfflineCashPaymentModal = lazy(() => import('../components/admin/OfflineCashPaymentModal'));
const MoneyReceiptModal = lazy(() => import('../components/common/MoneyReceiptModal'));
const ResourceLibrary = lazy(() => import('../components/common/ResourceLibrary'));
const UnifiedApprovalEngine = lazy(() => import('../components/admin/UnifiedApprovalEngine'));
const GlobalSiteContentCMS = lazy(() => import('../components/admin/GlobalSiteContentCMS'));
const AIMCQGeneratorModal = lazy(() => import('../components/common/AIMCQGeneratorModal'));
const AICQGeneratorModal = lazy(() => import('../components/common/AICQGeneratorModal'));
const AdminStudyMaterialUploadModal = lazy(() => import('../components/admin/AdminStudyMaterialUploadModal'));
const SyllabusTrackerManager = lazy(() => import('../components/admin/SyllabusTrackerManager'));
const OMRImportModule = lazy(() => import('../components/admin/OMRImportModule'));
const InteractiveGamificationCMS = lazy(() => import('../components/admin/InteractiveGamificationCMS'));
const MediaCenter = lazy(() => import('../components/media/MediaCenter'));
const AdminHelpdeskManager = lazy(() => import('../components/admin/AdminHelpdeskManager'));
const AdminMenuManager = lazy(() => import('../components/admin/AdminMenuManager'));
const AdminGrammarCMS = lazy(() => import('../components/admin/AdminGrammarCMS'));
const AdminPromoSettings = lazy(() => import('../components/admin/AdminPromoSettings'));
const AdminStudentPortalManager = lazy(() => import('../components/admin/AdminStudentPortalManager'));




import {
  Banknote,
  Users,
  GraduationCap,
  CalendarCheck,
  CreditCard,
  ShieldCheck,
  BellRing,
  PlusCircle,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Eye,
  FileText,
  Clock,
  Send,
  UserPlus,
  Camera,
  Save,
  X,
  Edit,
  Trash2,
  Mail,
  Phone,
  Briefcase,
  BookOpen,
  UserCheck,
  Download,
  ExternalLink,
  BookMarked,
  FileSpreadsheet,
  Printer,
  Sparkles,
  Calendar,
  HelpCircle,
  CheckSquare,
  Award,
  PenTool,
  Check,
  Layers,
  Zap,
  CalendarDays,
  ChevronDown
} from 'lucide-react';

export default function AdminDashboard({ activeTab = 'dashboard' }) {
  const { t, lang } = useLanguage();
  const [stats, setStats] = useState(null);
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [allClasses, setAllClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & Filters
  const [studentSearch, setStudentSearch] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [invoiceFilter, setInvoiceFilter] = useState('');

  // Dynamic Time Period Analytics State
  const [analyticsPeriod, setAnalyticsPeriod] = useState('today'); // 'today' | 'weekly' | 'monthly' | 'custom'
  const [customStartDate, setCustomStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [customEndDate, setCustomEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);
  const [showExecutiveModal, setShowExecutiveModal] = useState(false);
  const [selectedStudentFor360, setSelectedStudentFor360] = useState(null);
  const [adminBatchRoutineSubTab, setAdminBatchRoutineSubTab] = useState('batches'); // 'batches' | 'routine'
  const [feesSubTab, setFeesSubTab] = useState('invoices'); // 'invoices' | 'payment-methods'
  const [showCashPaymentModal, setShowCashPaymentModal] = useState(false);
  const [currentReceiptData, setCurrentReceiptData] = useState(null);

  // Teacher Attendance State
  const [teacherAttDate, setTeacherAttDate] = useState(new Date().toISOString().split('T')[0]);
  const [teacherAttSheet, setTeacherAttSheet] = useState([]);
  const [teacherAttStats, setTeacherAttStats] = useState({
    totalTeachers: 0,
    presentCount: 0,
    lateCount: 0,
    absentCount: 0,
    leaveCount: 0
  });
  const [loadingTeacherAtt, setLoadingTeacherAtt] = useState(false);
  const [savingTeacherAtt, setSavingTeacherAtt] = useState(false);
  const [teacherAttViewMode, setTeacherAttViewMode] = useState('daily'); // 'daily' | 'monthly'
  const [selectedAttMonth, setSelectedAttMonth] = useState(new Date().toISOString().slice(5, 7));
  const [selectedAttYear, setSelectedAttYear] = useState(new Date().getFullYear());
  const [monthlyAttReport, setMonthlyAttReport] = useState([]);
  const [teacherAttSearch, setTeacherAttSearch] = useState('');

  // Notice modal
  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const [noticeForm, setNoticeForm] = useState({
    titleBn: '',
    titleEn: '',
    contentBn: '',
    contentEn: '',
    category: 'ACADEMIC',
    priority: 'NORMAL',
    targetRole: 'ALL'
  });
  const [noticeSuccess, setNoticeSuccess] = useState(null);

  // Add New Student Modal & Form State
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [savingStudent, setSavingStudent] = useState(false);
  const [studentSuccess, setStudentSuccess] = useState(null);
  const [selectedStudentForDetails, setSelectedStudentForDetails] = useState(null);
  const [studentForm, setStudentForm] = useState({
    name: '',
    rollNo: '',
    classId: '11', // Class 8 default
    sectionId: '31', // Padma default
    guardianName: '',
    guardianPhone: '',
    bloodGroup: 'B+',
    dob: '2014-01-01',
    gender: 'MALE',
    address: 'ঢাকা, বাংলাদেশ',
    admissionDate: new Date().toISOString().split('T')[0],
    photo: null
  });
  const [isAdmissionClassDropdownOpen, setIsAdmissionClassDropdownOpen] = useState(false);

  // Add / Edit Teacher Modal & Form State
  const [showTeacherModal, setShowTeacherModal] = useState(false);
  const [editingTeacherId, setEditingTeacherId] = useState(null);
  const [savingTeacher, setSavingTeacher] = useState(false);
  const [teacherSuccess, setTeacherSuccess] = useState(null);
  const [teacherSearch, setTeacherSearch] = useState('');
  const [teacherSubjects, setTeacherSubjects] = useState([]);
  const [teacherForm, setTeacherForm] = useState({
    name: '',
    designation: 'সহকারী শিক্ষক (Assistant Teacher)',
    specialization: 'গণিত ও বিজ্ঞান (Mathematics & Science)',
    phone: '',
    email: '',
    password: 'teacher123',
    joiningDate: new Date().toISOString().split('T')[0],
    photo: null,
    assignedClassId: '11',
    assignedSubjectId: '53'
  });

  // Load subjects for selected class in teacher form
  useEffect(() => {
    if (teacherForm.assignedClassId) {
      curriculumAPI.getSubjects(teacherForm.assignedClassId).then(res => {
        if (res.success && res.data) {
          setTeacherSubjects(res.data);
          if (res.data.length > 0 && !res.data.some(s => String(s.id) === String(teacherForm.assignedSubjectId))) {
            setTeacherForm(prev => ({ ...prev, assignedSubjectId: String(res.data[0].id) }));
          }
        }
      });
    }
  }, [teacherForm.assignedClassId]);

  // Add / Edit Textbook Modal & Form State
  const [textbooks, setTextbooks] = useState([]);
  const [showTextbookModal, setShowTextbookModal] = useState(false);
  const [editingTextbookId, setEditingTextbookId] = useState(null);
  const [savingTextbook, setSavingTextbook] = useState(false);
  const [textbookSuccess, setTextbookSuccess] = useState(null);
  const [textbookSearch, setTextbookSearch] = useState('');
  const [selectedTextbookClass, setSelectedTextbookClass] = useState('');
  const [readingTextbook, setReadingTextbook] = useState(null);
  const [textbookSubjects, setTextbookSubjects] = useState([]);
  const [textbookForm, setTextbookForm] = useState({
    titleBn: '',
    titleEn: '',
    classId: '11',
    subjectId: '',
    edition: 'NCTB ২০২৬ শিক্ষাবর্ষের নতুন সংস্করণ',
    author: 'জাতীয় শিক্ষাক্রম ও পাঠ্যপুস্তক বোর্ড (NCTB)',
    fileUrl: 'https://nctb.gov.bd/textbooks/sample-nctb-2026.pdf',
    fileSize: '15.4 MB',
    totalPages: 160,
    description: '',
    coverImage: null
  });

  // Load subjects for selected class in textbook form
  useEffect(() => {
    if (textbookForm.classId) {
      curriculumAPI.getSubjects(textbookForm.classId).then(res => {
        if (res.success && res.data) {
          setTextbookSubjects(res.data);
          if (res.data.length > 0 && !res.data.some(s => String(s.id) === String(textbookForm.subjectId))) {
            setTextbookForm(prev => ({ ...prev, subjectId: String(res.data[0].id) }));
          }
        }
      });
    }
  }, [textbookForm.classId]);

  // Online Exams State (Admin & Teacher Management)
  const [examsList, setExamsList] = useState([]);
  const [loadingExams, setLoadingExams] = useState(false);
  const [showExamModal, setShowExamModal] = useState(false);
  const [showAIGeneratorModal, setShowAIGeneratorModal] = useState(false);
  const [showCQGeneratorModal, setShowCQGeneratorModal] = useState(false);
  const [showStudyMaterialUploadModal, setShowStudyMaterialUploadModal] = useState(false);
  const [editingExamId, setEditingExamId] = useState(null);
  const [savingExam, setSavingExam] = useState(false);
  const [examSuccess, setExamSuccess] = useState(null);
  const [examSearch, setExamSearch] = useState('');
  const [selectedExamClass, setSelectedExamClass] = useState('');
  const [selectedExamType, setSelectedExamType] = useState('ALL');
  const [examSubjects, setExamSubjects] = useState([]);
  const [showSubmissionsModal, setShowSubmissionsModal] = useState(false);
  const [currentExamSubmissions, setCurrentExamSubmissions] = useState([]);
  const [selectedExamForSubmissions, setSelectedExamForSubmissions] = useState(null);
  const [gradingSubmission, setGradingSubmission] = useState(null);
  const [savingGrade, setSavingGrade] = useState(false);
  const [gradingForm, setGradingForm] = useState({ obtainedScore: '', teacherFeedback: '' });

  const [examForm, setExamForm] = useState({
    titleBn: '',
    titleEn: '',
    classId: '11',
    subjectId: '',
    type: 'MCQ',
    examDate: new Date().toISOString().split('T')[0],
    startTime: '10:00 AM',
    durationMinutes: 15,
    totalMarks: 5,
    passMarks: 2,
    instructions: 'প্রতিটি প্রশ্নের ৪টি অপশন থেকে সঠিক উত্তরটি নির্বাচন করো। সময়সীমা ১৫ মিনিট।',
    questionFileUrl: '',
    questions: [
      {
        id: 1,
        questionBn: '',
        options: ['', '', '', ''],
        correctOptionIndex: 0,
        marks: 1,
        explanation: ''
      }
    ]
  });

  // Load subjects for exam modal
  useEffect(() => {
    if (examForm.classId) {
      curriculumAPI.getSubjects(examForm.classId).then(res => {
        if (res.success && res.data) {
          setExamSubjects(res.data);
          if (res.data.length > 0 && !res.data.some(s => String(s.id) === String(examForm.subjectId))) {
            setExamForm(prev => ({ ...prev, subjectId: String(res.data[0].id) }));
          }
        }
      });
    }
  }, [examForm.classId]);

  // Inspection modal for audit log payload
  const [inspectedLog, setInspectedLog] = useState(null);

  // Fee & Discount Assignment Modal State
  const [showCreateInvoiceModal, setShowCreateInvoiceModal] = useState(false);
  const [savingInvoice, setSavingInvoice] = useState(false);
  const [invoiceSuccess, setInvoiceSuccess] = useState(null);
  const [invoiceError, setInvoiceError] = useState(null);
  const [invoiceDiscountFilter, setInvoiceDiscountFilter] = useState('ALL'); // 'ALL' | 'WITH_DISCOUNT' | 'NO_DISCOUNT'
  const [invoiceSearch, setInvoiceSearch] = useState('');
  const [invoiceForm, setInvoiceForm] = useState({
    targetMode: 'SINGLE', // 'SINGLE' | 'CLASS'
    studentId: '',
    classId: '11',
    titleBn: 'মাসিক টিউশন ফি (সেপ্টেম্বর ২০২৬)',
    titleEn: 'Monthly Tuition Fee (September 2026)',
    month: 'September',
    year: '2026',
    baseAmount: '3500',
    discountType: 'NONE', // 'NONE' | 'FLAT' | 'PERCENTAGE'
    discountValue: '0',
    discountReason: 'MERIT_SCHOLARSHIP',
    dueDate: '2026-09-15'
  });

  const handleOpenCreateInvoice = () => {
    setInvoiceForm({
      targetMode: 'SINGLE',
      studentId: students[0]?.id ? String(students[0].id) : '',
      classId: allClasses[0]?.id ? String(allClasses[0].id) : '11',
      titleBn: 'মাসিক টিউশন ফি (সেপ্টেম্বর ২০২৬)',
      titleEn: 'Monthly Tuition Fee (September 2026)',
      month: 'September',
      year: '2026',
      baseAmount: '3500',
      discountType: 'NONE',
      discountValue: '0',
      discountReason: 'MERIT_SCHOLARSHIP',
      dueDate: '2026-09-15'
    });
    setInvoiceError(null);
    setShowCreateInvoiceModal(true);
  };

  const handleCreateInvoiceSubmit = async (e) => {
    e.preventDefault();
    setSavingInvoice(true);
    setInvoiceError(null);
    try {
      const payload = {
        studentId: invoiceForm.targetMode === 'SINGLE' ? invoiceForm.studentId : undefined,
        classId: invoiceForm.targetMode === 'CLASS' ? invoiceForm.classId : undefined,
        titleBn: invoiceForm.titleBn,
        titleEn: invoiceForm.titleEn,
        month: invoiceForm.month,
        year: Number(invoiceForm.year) || 2026,
        baseAmount: Number(invoiceForm.baseAmount) || 0,
        discountType: invoiceForm.discountType,
        discountValue: Number(invoiceForm.discountValue) || 0,
        discountReason: invoiceForm.discountType !== 'NONE' ? invoiceForm.discountReason : null,
        dueDate: invoiceForm.dueDate
      };

      const res = await adminAPI.createInvoice(payload);
      if (res.success) {
        setInvoiceSuccess('ফি ও ডিসকাউন্ট সফলভাবে নির্ধারণ করা হয়েছে!');
        setTimeout(() => setInvoiceSuccess(null), 3500);
        setShowCreateInvoiceModal(false);
        const invRes = await adminAPI.getInvoices();
        if (invRes.success) setInvoices(invRes.data || []);
      } else {
        throw new Error(res.error?.message || 'ইনভয়েস তৈরি করতে ব্যর্থ হয়েছে');
      }
    } catch (err) {
      setInvoiceError(err.message || 'ইনভয়েস তৈরি করতে ব্যর্থ হয়েছে');
    } finally {
      setSavingInvoice(false);
    }
  };

  const handleDeleteInvoice = async (id, title) => {
    if (!window.confirm(`আপনি কি নিশ্চিত এই ইনভয়েসটি (${title}) মুছে ফেলতে চান?`)) return;
    try {
      const res = await adminAPI.deleteInvoice(id);
      if (res.success) {
        setInvoices(prev => prev.filter(inv => inv.id !== id));
      }
    } catch (err) {
      alert('ইনভয়েস মুছতে ব্যর্থ হয়েছে');
    }
  };

  // Load teacher attendance
  const loadTeacherAttendance = async (date) => {
    setLoadingTeacherAtt(true);
    try {
      const res = await teacherAttendanceAPI.getDateSheet(date);
      if (res.success && res.data) {
        setTeacherAttSheet(res.data.sheet);
        setTeacherAttStats({
          totalTeachers: res.data.totalTeachers,
          presentCount: res.data.presentCount,
          lateCount: res.data.lateCount,
          absentCount: res.data.absentCount,
          leaveCount: res.data.leaveCount
        });
      }
    } catch (err) {
      console.error('Failed to load teacher attendance:', err);
    } finally {
      setLoadingTeacherAtt(false);
    }
  };

  const loadMonthlyTeacherReport = async (month, year) => {
    setLoadingTeacherAtt(true);
    try {
      const res = await teacherAttendanceAPI.getMonthlyReport(month, year);
      if (res.success && res.data) {
        setMonthlyAttReport(res.data.report || []);
      }
    } catch (err) {
      console.error('Failed to load monthly teacher report:', err);
    } finally {
      setLoadingTeacherAtt(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'teacher-attendance') {
      if (teacherAttViewMode === 'daily') {
        loadTeacherAttendance(teacherAttDate);
      } else {
        loadMonthlyTeacherReport(selectedAttMonth, selectedAttYear);
      }
    }
  }, [activeTab, teacherAttDate, teacherAttViewMode, selectedAttMonth, selectedAttYear]);

  const handleTeacherAttStatusChange = (teacherId, newStatus) => {
    setTeacherAttSheet(prev => prev.map(item => {
      if (item.teacherId === teacherId) {
        const checkIn = newStatus === 'ABSENT' || newStatus === 'ON_LEAVE' ? '' : (item.checkInTime || '08:45 AM');
        const checkOut = newStatus === 'ABSENT' || newStatus === 'ON_LEAVE' ? '' : (item.checkOutTime || '04:30 PM');
        const workHours = newStatus === 'ABSENT' || newStatus === 'ON_LEAVE' ? '0h 0m' : (item.workHours || '7h 45m');
        return {
          ...item,
          status: newStatus,
          checkInTime: checkIn,
          checkOutTime: checkOut,
          workHours
        };
      }
      return item;
    }));
  };

  const handleTeacherAttTimeChange = (teacherId, field, value) => {
    setTeacherAttSheet(prev => prev.map(item => {
      if (item.teacherId === teacherId) {
        const updated = { ...item, [field]: value };
        return updated;
      }
      return item;
    }));
  };

  const handleTeacherAttRemarksChange = (teacherId, remarks) => {
    setTeacherAttSheet(prev => prev.map(item => {
      if (item.teacherId === teacherId) {
        return { ...item, remarks };
      }
      return item;
    }));
  };

  const handleMarkAllTeachersPresent = () => {
    setTeacherAttSheet(prev => prev.map(item => ({
      ...item,
      status: 'PRESENT',
      checkInTime: item.checkInTime || '08:45 AM',
      checkOutTime: item.checkOutTime || '04:30 PM',
      workHours: '7h 45m',
      remarks: item.remarks || 'সকল শিক্ষক নিয়মিত উপস্থিত'
    })));
  };

  const handleSaveTeacherAttendance = async () => {
    setSavingTeacherAtt(true);
    try {
      const res = await teacherAttendanceAPI.saveBulkAttendance({
        date: teacherAttDate,
        records: teacherAttSheet
      });
      if (res.success) {
        alert('শিক্ষক উপস্থিতি ও আগমন-প্রস্থান ডেটা সফলভাবে সংরক্ষণ করা হয়েছে!');
        loadTeacherAttendance(teacherAttDate);
        fetchAdminData();
      }
    } catch (err) {
      alert(err.message || 'সংরক্ষণে ত্রুটি হয়েছে');
    } finally {
      setSavingTeacherAtt(false);
    }
  };

  const handleExportTeacherCSV = () => {
    if (teacherAttViewMode === 'daily') {
      const headers = ['শিক্ষকের নাম', 'পদবি', 'ফোন', 'স্ট্যাটাস', 'প্রবেশের সময়', 'প্রস্থানের সময়', 'কর্মঘণ্টা', 'মন্তব্য'];
      const rows = teacherAttSheet.map(s => [
        `"${s.name}"`,
        `"${s.designation}"`,
        `"${s.phone}"`,
        `"${s.status}"`,
        `"${s.checkInTime || '-'}"`,
        `"${s.checkOutTime || '-'}"`,
        `"${s.workHours || '-'}"`,
        `"${s.remarks || '-'}"`
      ]);
      const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `Teacher_Attendance_${teacherAttDate}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      const headers = ['শিক্ষকের নাম', 'পদবি', 'মোট উপস্থিত', 'দেরিতে আসা', 'অনুপস্থিত', 'ছুটি', 'উপস্থিতির হার (%)'];
      const rows = monthlyAttReport.map(r => [
        `"${r.name}"`,
        `"${r.designation}"`,
        r.totalPresent,
        r.lateDays,
        r.absentDays,
        r.leaveDays,
        `"${r.attendanceRate}%"`
      ]);
      const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `Teacher_Monthly_Attendance_${selectedAttYear}_${selectedAttMonth}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  useEffect(() => {
    fetchAdminData();
    fetchAnalytics();
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [analyticsPeriod, customStartDate, customEndDate]);

  const fetchAnalytics = async (p = analyticsPeriod, s = customStartDate, e = customEndDate) => {
    setLoadingAnalytics(true);
    try {
      const res = await analyticsAPI.getSummary({
        period: p,
        startDate: s,
        endDate: e
      });
      if (res.success && res.data) {
        setAnalyticsData(res.data);
      }
    } catch (err) {
      console.error('Failed to load dynamic analytics:', err);
    } finally {
      setLoadingAnalytics(false);
    }
  };

  const fetchAdminData = async (forceRefresh = false) => {
    // 1. Instant Cache Hydration
    const cachedStats = getCacheItem('admin_stats');
    const cachedStudents = getCacheItem('admin_students');
    const cachedTeachers = getCacheItem('admin_teachers');
    const cachedInvoices = getCacheItem('admin_invoices');
    const cachedClasses = getCacheItem('admin_classes');

    if (cachedStats && !stats) setStats(cachedStats);
    if (cachedStudents && students.length === 0) setStudents(cachedStudents);
    if (cachedTeachers && teachers.length === 0) setTeachers(cachedTeachers);
    if (cachedInvoices && invoices.length === 0) setInvoices(cachedInvoices);
    if (cachedClasses && allClasses.length === 0) setAllClasses(cachedClasses);

    if (!cachedStats) {
      setLoading(true);
    }
    setError(null);

    try {
      const [statsRes, studentsRes, teachersRes, invoicesRes, logsRes, classesRes, textbooksRes, examsRes] = await Promise.allSettled([
        adminAPI.getStats(),
        adminAPI.getStudents(),
        adminAPI.getTeachers(),
        adminAPI.getInvoices(),
        adminAPI.getAuditLogs({ limit: 30 }),
        curriculumAPI.getClasses(),
        textbookAPI.getTextbooks(),
        examAPI.getExams()
      ]);

      if (statsRes.status === 'fulfilled' && statsRes.value?.success) {
        setStats(statsRes.value.data);
        setCacheItem('admin_stats', statsRes.value.data, 10 * 60 * 1000);
      }
      if (studentsRes.status === 'fulfilled' && studentsRes.value?.success) {
        setStudents(studentsRes.value.data);
        setCacheItem('admin_students', studentsRes.value.data, 10 * 60 * 1000);
      }
      if (teachersRes.status === 'fulfilled' && teachersRes.value?.success) {
        setTeachers(teachersRes.value.data);
        setCacheItem('admin_teachers', teachersRes.value.data, 10 * 60 * 1000);
      }
      if (invoicesRes.status === 'fulfilled' && invoicesRes.value?.success) {
        setInvoices(invoicesRes.value.data);
        setCacheItem('admin_invoices', invoicesRes.value.data, 10 * 60 * 1000);
      }
      if (logsRes.status === 'fulfilled' && logsRes.value?.success) {
        setAuditLogs(logsRes.value.data.logs);
      }
      if (classesRes.status === 'fulfilled' && classesRes.value?.success) {
        setAllClasses(classesRes.value.data);
        setCacheItem('admin_classes', classesRes.value.data, 30 * 60 * 1000);
      }
      if (textbooksRes.status === 'fulfilled' && textbooksRes.value?.success) {
        setTextbooks(textbooksRes.value.data);
      }
      if (examsRes.status === 'fulfilled' && examsRes.value?.success) {
        setExamsList(examsRes.value.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const handlePublishNotice = async (e) => {
    e.preventDefault();
    try {
      const res = await adminAPI.publishNotice(noticeForm);
      if (res.success) {
        setNoticeSuccess('নোটিশ সফলভাবে প্রকাশিত হয়েছে! / Notice published successfully!');
        setShowNoticeModal(false);
        setNoticeForm({
          titleBn: '',
          titleEn: '',
          contentBn: '',
          contentEn: '',
          category: 'ACADEMIC',
          priority: 'NORMAL',
          targetRole: 'ALL'
        });
        // Refresh audit logs
        const updatedLogs = await adminAPI.getAuditLogs({ limit: 30 });
        if (updatedLogs.success) setAuditLogs(updatedLogs.data.logs);
      }
    } catch (err) {
      alert(err.message || 'Notice publish failed');
    }
  };

  // Student Photo Upload Handler
  const handleStudentPhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('দয়া করে একটি ছবি ফাইল নির্বাচন করুন (JPG, PNG, WebP)');
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      alert('ছবির আকার সর্বোচ্চ 8MB হতে পারবে');
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      setStudentForm(prev => ({
        ...prev,
        photo: uploadEvent.target.result
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveStudentPhoto = () => {
    setStudentForm(prev => ({
      ...prev,
      photo: null
    }));
  };

  // Create Student Handler
  const handleCreateStudent = async (e) => {
    e.preventDefault();
    setSavingStudent(true);
    try {
      const res = await adminAPI.createStudent(studentForm);
      if (res.success) {
        setStudentSuccess(`নতুন শিক্ষার্থী "${studentForm.name}" সফলভাবে ডেটাবেজে যুক্ত হয়েছে!`);
        setShowStudentModal(false);
        setStudentForm({
          name: '',
          rollNo: '',
          classId: '11',
          sectionId: '31',
          guardianName: '',
          guardianPhone: '',
          bloodGroup: 'B+',
          dob: '2014-01-01',
          gender: 'MALE',
          address: 'ঢাকা, বাংলাদেশ',
          admissionDate: new Date().toISOString().split('T')[0],
          photo: null
        });

        // Immediately refresh student list & stats
        const updatedStudents = await adminAPI.getStudents();
        if (updatedStudents.success) setStudents(updatedStudents.data);
        const updatedStats = await adminAPI.getStats();
        if (updatedStats.success) setStats(updatedStats.data);
        const updatedLogs = await adminAPI.getAuditLogs({ limit: 30 });
        if (updatedLogs.success) setAuditLogs(updatedLogs.data.logs);
      }
    } catch (err) {
      alert(err.message || 'Student creation failed');
    } finally {
      setSavingStudent(false);
    }
  };

  // Teacher Photo Upload Handler
  const handleTeacherPhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('দয়া করে একটি ছবি ফাইল নির্বাচন করুন (JPG, PNG, WebP)');
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      alert('ছবির আকার সর্বোচ্চ 8MB হতে পারবে');
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      setTeacherForm(prev => ({
        ...prev,
        photo: uploadEvent.target.result
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveTeacherPhoto = () => {
    setTeacherForm(prev => ({
      ...prev,
      photo: null
    }));
  };

  // Open Add Teacher Modal
  const handleOpenAddTeacher = () => {
    setEditingTeacherId(null);
    setTeacherForm({
      name: '',
      designation: 'সহকারী শিক্ষক (Assistant Teacher)',
      specialization: 'গণিত ও উচ্চতর গণিত / B.Sc & M.Sc',
      phone: '',
      email: '',
      password: 'teacher123',
      joiningDate: new Date().toISOString().split('T')[0],
      photo: null,
      assignedClassId: '11',
      assignedSubjectId: '53'
    });
    setShowTeacherModal(true);
  };

  // Open Edit Teacher Modal
  const handleOpenEditTeacher = (teacher) => {
    setEditingTeacherId(teacher.id);
    const firstAss = teacher.assignments?.[0];
    setTeacherForm({
      name: teacher.user?.name || '',
      designation: teacher.designation || '',
      specialization: teacher.specialization || '',
      phone: teacher.user?.phone || '',
      email: teacher.user?.email || '',
      password: '',
      joiningDate: teacher.joiningDate || new Date().toISOString().split('T')[0],
      photo: teacher.user?.avatar || null,
      assignedClassId: firstAss ? String(firstAss.classId) : '11',
      assignedSubjectId: firstAss ? String(firstAss.subjectId) : ''
    });
    setShowTeacherModal(true);
  };

  // Save/Update Teacher Handler
  const handleSaveTeacher = async (e) => {
    e.preventDefault();
    if (!teacherForm.name || !teacherForm.phone || !teacherForm.designation) {
      alert('শিক্ষকের নাম, পদবি এবং ফোন নম্বর আবশ্যক');
      return;
    }
    setSavingTeacher(true);
    try {
      const payload = {
        name: teacherForm.name,
        designation: teacherForm.designation,
        specialization: teacherForm.specialization,
        phone: teacherForm.phone,
        email: teacherForm.email,
        password: teacherForm.password || 'teacher123',
        joiningDate: teacherForm.joiningDate,
        photo: teacherForm.photo,
        assignedClasses: teacherForm.assignedClassId && teacherForm.assignedSubjectId ? [
          {
            classId: Number(teacherForm.assignedClassId),
            sectionId: 1,
            subjectId: Number(teacherForm.assignedSubjectId),
            isClassTeacher: true
          }
        ] : []
      };

      if (editingTeacherId) {
        await adminAPI.updateTeacher(editingTeacherId, payload);
        setTeacherSuccess(`শিক্ষক "${teacherForm.name}" এর তথ্য সফলভাবে আপডেট করা হয়েছে!`);
      } else {
        await adminAPI.createTeacher(payload);
        setTeacherSuccess(`নতুন শিক্ষক "${teacherForm.name}" সফলভাবে যুক্ত করা হয়েছে!`);
      }

      setShowTeacherModal(false);
      setEditingTeacherId(null);

      // Refresh teachers list & stats
      const updatedTeachers = await adminAPI.getTeachers();
      if (updatedTeachers.success) setTeachers(updatedTeachers.data);
      const updatedStats = await adminAPI.getStats();
      if (updatedStats.success) setStats(updatedStats.data);
      const updatedLogs = await adminAPI.getAuditLogs({ limit: 30 });
      if (updatedLogs.success) setAuditLogs(updatedLogs.data.logs);
      setTimeout(() => setTeacherSuccess(null), 4000);
    } catch (err) {
      alert(err.message || 'শিক্ষক তথ্য সংরক্ষণে ত্রুটি হয়েছে');
    } finally {
      setSavingTeacher(false);
    }
  };

  // Delete Teacher Handler
  const handleDeleteTeacher = async (id, name) => {
    if (!window.confirm(`আপনি কি নিশ্চিত যে শিক্ষক "${name}" এর প্রোফাইল ও অ্যাসাইনমেন্ট মুছে ফেলতে চান?`)) {
      return;
    }
    try {
      const res = await adminAPI.deleteTeacher(id);
      if (res.success) {
        setTeachers(prev => prev.filter(t => t.id !== id));
        setTeacherSuccess(`শিক্ষক "${name}" এর প্রোফাইল সফলভাবে মুছে ফেলা হয়েছে`);
        const updatedStats = await adminAPI.getStats();
        if (updatedStats.success) setStats(updatedStats.data);
        const updatedLogs = await adminAPI.getAuditLogs({ limit: 30 });
        if (updatedLogs.success) setAuditLogs(updatedLogs.data.logs);
        setTimeout(() => setTeacherSuccess(null), 3000);
      }
    } catch (err) {
      alert(err.message || 'শিক্ষক মুছতে ত্রুটি হয়েছে');
    }
  };

  // Textbook Photo / Cover Upload Handler
  const handleCoverImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('দয়া করে একটি কভার ছবি ফাইল নির্বাচন করুন (JPG, PNG, WebP)');
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      alert('ছবির আকার সর্বোচ্চ 8MB হতে পারবে');
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      setTextbookForm(prev => ({
        ...prev,
        coverImage: uploadEvent.target.result
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveCoverImage = () => {
    setTextbookForm(prev => ({
      ...prev,
      coverImage: null
    }));
  };

  // Open Add Textbook Modal
  const handleOpenAddTextbook = () => {
    setEditingTextbookId(null);
    setTextbookForm({
      titleBn: '',
      titleEn: '',
      classId: '11',
      subjectId: textbookSubjects[0] ? String(textbookSubjects[0].id) : '51',
      edition: 'NCTB ২০২৬ শিক্ষাবর্ষের নতুন সংস্করণ',
      author: 'জাতীয় শিক্ষাক্রম ও পাঠ্যপুস্তক বোর্ড (NCTB)',
      fileUrl: 'https://nctb.gov.bd/textbooks/sample-nctb-2026.pdf',
      fileSize: '15.4 MB',
      totalPages: 160,
      description: '',
      coverImage: null
    });
    setShowTextbookModal(true);
  };

  // Open Edit Textbook Modal
  const handleOpenEditTextbook = (tb) => {
    setEditingTextbookId(tb.id);
    setTextbookForm({
      titleBn: tb.titleBn || '',
      titleEn: tb.titleEn || '',
      classId: String(tb.classId),
      subjectId: String(tb.subjectId),
      edition: tb.edition || 'NCTB ২০২৬ শিক্ষাবর্ষের নতুন সংস্করণ',
      author: tb.author || 'জাতীয় শিক্ষাক্রম ও পাঠ্যপুস্তক বোর্ড (NCTB)',
      fileUrl: tb.fileUrl || '',
      fileSize: tb.fileSize || '15.0 MB',
      totalPages: tb.totalPages || 150,
      description: tb.description || '',
      coverImage: tb.coverImage || null
    });
    setShowTextbookModal(true);
  };

  // Save / Update Textbook
  const handleSaveTextbook = async (e) => {
    e.preventDefault();
    if (!textbookForm.titleBn || !textbookForm.classId || !textbookForm.subjectId) {
      alert('বইয়ের নাম, শ্রেণি এবং বিষয় আবশ্যক');
      return;
    }
    setSavingTextbook(true);
    try {
      if (editingTextbookId) {
        await textbookAPI.updateTextbook(editingTextbookId, textbookForm);
        setTextbookSuccess(`পাঠ্যপুস্তক "${textbookForm.titleBn}" সফলভাবে আপডেট করা হয়েছে!`);
      } else {
        await textbookAPI.createTextbook(textbookForm);
        setTextbookSuccess(`নতুন পাঠ্যপুস্তক "${textbookForm.titleBn}" সফলভাবে লাইব্রেরিতে যুক্ত হয়েছে!`);
      }

      setShowTextbookModal(false);
      setEditingTextbookId(null);

      // Refresh textbooks list
      const freshTextbooks = await textbookAPI.getTextbooks();
      if (freshTextbooks.success) setTextbooks(freshTextbooks.data);
      const freshLogs = await adminAPI.getAuditLogs({ limit: 30 });
      if (freshLogs.success) setAuditLogs(freshLogs.data.logs);
      setTimeout(() => setTextbookSuccess(null), 4000);
    } catch (err) {
      alert(err.message || 'পাঠ্যবই সংরক্ষণে সমস্যা হয়েছে');
    } finally {
      setSavingTextbook(false);
    }
  };

  // Delete Textbook
  const handleDeleteTextbook = async (id, title) => {
    if (!window.confirm(`আপনি কি নিশ্চিত যে পাঠ্যবই "${title}" ই-লাইব্রেরি থেকে মুছে ফেলতে চান?`)) {
      return;
    }
    try {
      const res = await textbookAPI.deleteTextbook(id);
      if (res.success) {
        setTextbooks(prev => prev.filter(b => b.id !== id));
        setTextbookSuccess(`পাঠ্যবই "${title}" সফলভাবে মুছে ফেলা হয়েছে`);
        const freshLogs = await adminAPI.getAuditLogs({ limit: 30 });
        if (freshLogs.success) setAuditLogs(freshLogs.data.logs);
        setTimeout(() => setTextbookSuccess(null), 3000);
      }
    } catch (err) {
      alert(err.message || 'বই মুছতে সমস্যা হয়েছে');
    }
  };

  // --- ONLINE EXAMS HANDLERS ---
  const handleOpenCreateExam = () => {
    setEditingExamId(null);
    setExamForm({
      titleBn: '',
      titleEn: '',
      classId: selectedExamClass || '11',
      subjectId: examSubjects[0] ? String(examSubjects[0].id) : '54',
      type: 'MCQ',
      examDate: new Date().toISOString().split('T')[0],
      startTime: '11:00 AM',
      durationMinutes: 15,
      totalMarks: 5,
      passMarks: 2,
      instructions: 'প্রতিটি প্রশ্নের ৪টি অপশন থেকে সঠিক উত্তরটি নির্বাচন করো। সময়সীমা ১৫ মিনিট। সাবমিট করার সাথে সাথেই ফলাফল দেখা যাবে।',
      questionFileUrl: '',
      questions: [
        {
          id: 1,
          questionBn: '',
          options: ['', '', '', ''],
          correctOptionIndex: 0,
          marks: 1,
          explanation: ''
        }
      ]
    });
    setShowExamModal(true);
  };

  const handleOpenEditExam = (exam) => {
    setEditingExamId(exam.id);
    setExamForm({
      titleBn: exam.titleBn || '',
      titleEn: exam.titleEn || '',
      classId: String(exam.classId),
      subjectId: String(exam.subjectId),
      type: exam.type || 'MCQ',
      examDate: exam.examDate || new Date().toISOString().split('T')[0],
      startTime: exam.startTime || '10:00 AM',
      durationMinutes: exam.durationMinutes || 20,
      totalMarks: exam.totalMarks || 5,
      passMarks: exam.passMarks || 2,
      instructions: exam.instructions || '',
      questionFileUrl: exam.questionFileUrl || '',
      questions: Array.isArray(exam.questions) && exam.questions.length > 0 ? exam.questions : [
        {
          id: 1,
          questionBn: '',
          options: ['', '', '', ''],
          correctOptionIndex: 0,
          marks: 1,
          explanation: ''
        }
      ]
    });
    setShowExamModal(true);
  };

  const handleAddMCQQuestion = () => {
    setExamForm(prev => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          id: prev.questions.length + 1,
          questionBn: '',
          options: ['', '', '', ''],
          correctOptionIndex: 0,
          marks: 1,
          explanation: ''
        }
      ]
    }));
  };

  const handleRemoveMCQQuestion = (idx) => {
    if (examForm.questions.length <= 1) {
      alert('কমপক্ষে একটি প্রশ্ন থাকা আবশ্যক');
      return;
    }
    setExamForm(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== idx)
    }));
  };

  const handleMCQQuestionChange = (idx, field, value) => {
    setExamForm(prev => ({
      ...prev,
      questions: prev.questions.map((q, i) => i === idx ? { ...q, [field]: value } : q)
    }));
  };

  const handleMCQOptionChange = (qIdx, optIdx, value) => {
    setExamForm(prev => ({
      ...prev,
      questions: prev.questions.map((q, i) => {
        if (i === qIdx) {
          const newOpts = [...q.options];
          newOpts[optIdx] = value;
          return { ...q, options: newOpts };
        }
        return q;
      })
    }));
  };

  const handleSaveExam = async (e) => {
    e.preventDefault();
    if (!examForm.titleBn || !examForm.classId || !examForm.subjectId || !examForm.examDate) {
      alert('পরীক্ষার নাম, শ্রেণি, বিষয় ও তারিখ আবশ্যক');
      return;
    }

    setSavingExam(true);
    try {
      if (editingExamId) {
        await examAPI.updateExam(editingExamId, examForm);
        setExamSuccess(`পরীক্ষা "${examForm.titleBn}" সফলভাবে আপডেট করা হয়েছে!`);
      } else {
        await examAPI.createExam(examForm);
        setExamSuccess(`নতুন অনলাইন পরীক্ষা "${examForm.titleBn}" সফলভাবে তৈরি হয়েছে!`);
      }
      setShowExamModal(false);
      setEditingExamId(null);
      const fresh = await examAPI.getExams();
      if (fresh.success) setExamsList(fresh.data);
      const freshLogs = await adminAPI.getAuditLogs({ limit: 30 });
      if (freshLogs.success) setAuditLogs(freshLogs.data.logs);
      setTimeout(() => setExamSuccess(null), 4000);
    } catch (err) {
      alert(err.message || 'পরীক্ষা সংরক্ষণে সমস্যা হয়েছে');
    } finally {
      setSavingExam(false);
    }
  };

  const handleDeleteExam = async (id, title) => {
    if (!window.confirm(`আপনি কি নিশ্চিত যে "${title}" পরীক্ষাটি মুছে ফেলতে চান? সংশ্লিষ্ট শিক্ষার্থীদের ফলাফলও মুছে যাবে।`)) {
      return;
    }
    try {
      const res = await examAPI.deleteExam(id);
      if (res.success) {
        setExamsList(prev => prev.filter(e => e.id !== id));
        setExamSuccess(`পরীক্ষা "${title}" মুছে ফেলা হয়েছে`);
        const freshLogs = await adminAPI.getAuditLogs({ limit: 30 });
        if (freshLogs.success) setAuditLogs(freshLogs.data.logs);
        setTimeout(() => setExamSuccess(null), 3000);
      }
    } catch (err) {
      alert(err.message || 'পরীক্ষা মুছতে সমস্যা হয়েছে');
    }
  };

  const handleOpenSubmissions = async (exam) => {
    setSelectedExamForSubmissions(exam);
    setShowSubmissionsModal(true);
    setGradingSubmission(null);
    try {
      const res = await examAPI.getSubmissions(exam.id);
      if (res.success) {
        setCurrentExamSubmissions(res.data || []);
      }
    } catch (err) {
      console.error('Failed to load submissions:', err);
    }
  };

  const handleSaveGrade = async (e) => {
    e.preventDefault();
    if (!gradingSubmission || !selectedExamForSubmissions) return;
    if (gradingForm.obtainedScore === '' || isNaN(gradingForm.obtainedScore)) {
      alert('প্রাপ্ত নম্বর আবশ্যক');
      return;
    }

    setSavingGrade(true);
    try {
      const res = await examAPI.gradeSubmission(selectedExamForSubmissions.id, gradingSubmission.id, {
        obtainedScore: Number(gradingForm.obtainedScore),
        teacherFeedback: gradingForm.teacherFeedback
      });

      if (res.success) {
        alert('খাতা মূল্যায়ন সফলভাবে সংরক্ষণ করা হয়েছে!');
        // Refresh submissions
        const freshSubs = await examAPI.getSubmissions(selectedExamForSubmissions.id);
        if (freshSubs.success) setCurrentExamSubmissions(freshSubs.data);
        setGradingSubmission(null);
        const freshLogs = await adminAPI.getAuditLogs({ limit: 30 });
        if (freshLogs.success) setAuditLogs(freshLogs.data.logs);
      }
    } catch (err) {
      alert(err.message || 'মূল্যায়নে সমস্যা হয়েছে');
    } finally {
      setSavingGrade(false);
    }
  };

  const filteredExams = examsList.filter(ex => {
    const q = examSearch.toLowerCase();
    const matchesSearch = !q ||
      (ex.titleBn && ex.titleBn.toLowerCase().includes(q)) ||
      (ex.titleEn && ex.titleEn.toLowerCase().includes(q)) ||
      (ex.subject?.nameBn && ex.subject.nameBn.toLowerCase().includes(q));
    const matchesClass = !selectedExamClass || String(ex.classId) === String(selectedExamClass);
    const matchesType = selectedExamType === 'ALL' || ex.type === selectedExamType;
    return matchesSearch && matchesClass && matchesType;
  });

  const filteredStudents = students.filter(st => {
    const matchesSearch =
      st.user?.name?.toLowerCase().includes(studentSearch.toLowerCase()) ||
      st.studentIdNumber?.toLowerCase().includes(studentSearch.toLowerCase()) ||
      String(st.rollNo).includes(studentSearch) ||
      st.guardians?.[0]?.parent?.name?.toLowerCase().includes(studentSearch.toLowerCase()) ||
      st.guardians?.[0]?.parent?.phone?.includes(studentSearch);
    const matchesClass = !selectedClass || st.classId === Number(selectedClass);
    return matchesSearch && matchesClass;
  });

  const filteredTeachers = teachers.filter(t => {
    const q = teacherSearch.toLowerCase();
    const name = (t.user?.name || '').toLowerCase();
    const des = (t.designation || '').toLowerCase();
    const spec = (t.specialization || '').toLowerCase();
    const phone = (t.user?.phone || '').toLowerCase();
    const email = (t.user?.email || '').toLowerCase();
    return name.includes(q) || des.includes(q) || spec.includes(q) || phone.includes(q) || email.includes(q);
  });

  const filteredTextbooks = textbooks.filter(tb => {
    const q = textbookSearch.toLowerCase();
    const matchesSearch =
      (tb.titleBn || '').toLowerCase().includes(q) ||
      (tb.titleEn || '').toLowerCase().includes(q) ||
      (tb.edition || '').toLowerCase().includes(q) ||
      (tb.author || '').toLowerCase().includes(q) ||
      (tb.subject?.nameBn || '').toLowerCase().includes(q);
    const matchesClass = !selectedTextbookClass || tb.classId === Number(selectedTextbookClass);
    return matchesSearch && matchesClass;
  });

  const filteredInvoices = invoices.filter(inv => {
    if (!invoiceFilter) return true;
    return inv.status === invoiceFilter;
  });

  if (loading && !stats) {
    return <DashboardSkeletonLoader cardsCount={4} showHero={true} showSideCards={true} />;
  }

  return (
    <div className="space-y-6">
      {/* Top Overview & Analytics strictly for root dashboard */}
      {activeTab === 'dashboard' && (
        <>
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-2 border border-emerald-500/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{t('adminTitle')}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold">একাডেমি কন্ট্রোল সেন্টার (Academy Control Center)</h2>
          <p className="text-xs text-slate-300 mt-1">জাতীয় শিক্ষাক্রম ও প্রতিষ্ঠানিক ব্যবস্থাপনা প্যানেল</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowStudentModal(true)}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/30 flex items-center space-x-2 transition-all"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ নতুন শিক্ষার্থী যোগ করুন</span>
          </button>

          <button
            onClick={handleOpenAddTeacher}
            className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-500/30 flex items-center space-x-2 transition-all"
          >
            <Users className="w-4 h-4" />
            <span>+ নতুন শিক্ষক যুক্ত করুন</span>
          </button>

          <button
            onClick={handleOpenAddTextbook}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-500/30 flex items-center space-x-2 transition-all"
          >
            <BookOpen className="w-4 h-4" />
            <span>+ নতুন পাঠ্যপুস্তক যুক্ত করুন</span>
          </button>

          <button
            onClick={() => setShowNoticeModal(true)}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl backdrop-blur-sm border border-white/20 flex items-center space-x-2 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{t('publishNotice')}</span>
          </button>
        </div>
      </div>

      {noticeSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{noticeSuccess}</span>
          </div>
          <button onClick={() => setNoticeSuccess(null)} className="font-bold">✕</button>
        </div>
      )}

      {studentSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{studentSuccess}</span>
          </div>
          <button onClick={() => setStudentSuccess(null)} className="font-bold">✕</button>
        </div>
      )}

      {teacherSuccess && (
        <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 text-purple-800 text-xs flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-purple-600" />
            <span>{teacherSuccess}</span>
          </div>
          <button onClick={() => setTeacherSuccess(null)} className="font-bold">✕</button>
        </div>
      )}

      {textbookSuccess && (
        <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-indigo-600" />
            <span>{textbookSuccess}</span>
          </div>
          <button onClick={() => setTextbookSuccess(null)} className="font-bold">✕</button>
        </div>
      )}

      {/* TOP-LEVEL HIGH-PERFORMANCE STUDENT ANALYTICS OVERVIEW */}
      <AdminDashboardStats />

      {/* DYNAMIC TIME PERIOD SELECTION & EXECUTIVE REPORT GENERATOR */}
      <div className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-5 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-black text-slate-800 flex items-center gap-1.5 mr-1">
              <Calendar className="w-4 h-4 text-indigo-600" />
              <span>প্রতিবেদন সময়সীমা:</span>
            </span>

            <div className="inline-flex bg-slate-100 p-1 rounded-2xl gap-1">
              <button
                type="button"
                onClick={() => setAnalyticsPeriod('today')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  analyticsPeriod === 'today'
                    ? 'bg-white text-indigo-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                📅 আজকের সামারি (Today)
              </button>

              <button
                type="button"
                onClick={() => setAnalyticsPeriod('weekly')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  analyticsPeriod === 'weekly'
                    ? 'bg-white text-indigo-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                📊 এই সপ্তাহের সামারি (This Week)
              </button>

              <button
                type="button"
                onClick={() => setAnalyticsPeriod('monthly')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  analyticsPeriod === 'monthly'
                    ? 'bg-white text-indigo-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🗓️ এই মাসের সামারি (This Month)
              </button>

              <button
                type="button"
                onClick={() => setAnalyticsPeriod('custom')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  analyticsPeriod === 'custom'
                    ? 'bg-white text-indigo-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                ⚙️ কাস্টম তারিখ সীমা (Custom)
              </button>
            </div>

            {analyticsPeriod === 'custom' && (
              <div className="flex items-center space-x-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs">
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="bg-white px-2 py-1 rounded-lg border border-slate-200 font-medium text-slate-800"
                />
                <span className="text-slate-400 font-bold">থেকে</span>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="bg-white px-2 py-1 rounded-lg border border-slate-200 font-medium text-slate-800"
                />
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setShowExecutiveModal(true)}
              className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold rounded-2xl shadow-md shadow-indigo-500/20 flex items-center space-x-2 transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>সামারি ডাউনলোড / প্রিন্ট করুন (Export Summary PDF)</span>
            </button>
          </div>
        </div>

        {/* 6 DYNAMIC KEY METRICS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5 pt-2 border-t border-slate-100">
          
          {/* Card 1: Attendance Rate */}
          <div className="bg-slate-50/80 hover:bg-white p-4 rounded-2xl border border-slate-200 transition-all shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase">উপস্থিতি হার</span>
              <div className="p-1.5 rounded-lg bg-teal-50 text-teal-600">
                <CalendarCheck className="w-3.5 h-3.5" />
              </div>
            </div>
            <p className="text-xl font-black text-slate-900 mt-1 font-mono">
              {analyticsData?.attendance?.studentAttendanceRate || stats?.attendanceRateToday || 95}%
            </p>
            <span className="text-[10px] text-teal-700 font-semibold block truncate">
              শিক্ষার্থী: {analyticsData?.attendance?.studentAttendanceRate || 95}% • শিক্ষক: {analyticsData?.attendance?.teacherAttendanceRate || 100}%
            </span>
          </div>

          {/* Card 2: Total Fees Collected */}
          <div className="bg-slate-50/80 hover:bg-white p-4 rounded-2xl border border-slate-200 transition-all shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase">আদায়কৃত ফি</span>
              <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
                <CreditCard className="w-3.5 h-3.5" />
              </div>
            </div>
            <p className="text-xl font-black text-emerald-700 mt-1 font-mono">
              ৳ {(analyticsData?.financials?.periodCollected || stats?.financials?.totalCollected || 0).toLocaleString('en-BD')}
            </p>
            <span className="text-[10px] text-emerald-600 font-semibold block truncate">
              {analyticsPeriod === 'today' ? 'আজকের নগদ/বিকাশ সংগ্রহ' : 'নির্বাচিত সময়ের মোট আদায়'}
            </span>
          </div>

          {/* Card 3: Total Pending/Due Fees */}
          <div className="bg-slate-50/80 hover:bg-white p-4 rounded-2xl border border-slate-200 transition-all shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase">মোট বকেয়া ফি</span>
              <div className="p-1.5 rounded-lg bg-rose-50 text-rose-600">
                <Clock className="w-3.5 h-3.5" />
              </div>
            </div>
            <p className="text-xl font-black text-rose-600 mt-1 font-mono">
              ৳ {(analyticsData?.financials?.totalDue || stats?.financials?.totalPending || 0).toLocaleString('en-BD')}
            </p>
            <span className="text-[10px] text-rose-500 font-semibold block truncate">
              অপরিশোধিত টিউশন ও পরীক্ষার ফি
            </span>
          </div>

          {/* Card 4: Total Discounts / Waivers */}
          <div className="bg-slate-50/80 hover:bg-white p-4 rounded-2xl border border-slate-200 transition-all shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase">প্রদত্ত ছাড়/বৃত্তি</span>
              <div className="p-1.5 rounded-lg bg-purple-50 text-purple-600">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
            </div>
            <p className="text-xl font-black text-purple-700 mt-1 font-mono">
              ৳ {(analyticsData?.financials?.periodDiscounts || 0).toLocaleString('en-BD')}
            </p>
            <span className="text-[10px] text-purple-600 font-semibold block truncate">
              মেধাবৃত্তি ও সহোদর ছাড়
            </span>
          </div>

          {/* Card 5: Live Classes & Homework */}
          <div className="bg-slate-50/80 hover:bg-white p-4 rounded-2xl border border-slate-200 transition-all shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase">লাইভ ক্লাস ও HW</span>
              <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
                <BookOpen className="w-3.5 h-3.5" />
              </div>
            </div>
            <p className="text-xl font-black text-blue-900 mt-1 font-mono">
              {analyticsData?.academics?.liveClassesCount || 4}টি
            </p>
            <span className="text-[10px] text-blue-600 font-semibold block truncate">
              হোমওয়ার্ক: {analyticsData?.academics?.homeworkCount || 3}টি টাস্ক
            </span>
          </div>

          {/* Card 6: Online Exams & Pass Rate */}
          <div className="bg-slate-50/80 hover:bg-white p-4 rounded-2xl border border-slate-200 transition-all shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase">অনলাইন পরীক্ষা</span>
              <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
                <Award className="w-3.5 h-3.5" />
              </div>
            </div>
            <p className="text-xl font-black text-amber-800 mt-1 font-mono">
              {analyticsData?.academics?.examsCount || 2}টি
            </p>
            <span className="text-[10px] text-amber-700 font-semibold block truncate">
              পাশের হার: {analyticsData?.academics?.avgPassRate || 100}%
            </span>
          </div>

        </div>
      </div>
        </>
      )}

      {/* Main Tabs */}
      <Suspense fallback={<LoadingFallback message="অ্যাডমিন মডিউল লোড হচ্ছে..." />}>
        {activeTab === 'batches-routine' ? (
          <div className="space-y-6">

          {/* Sub-tab Switcher: Batch Management vs Class Routine */}
          <div className="flex items-center space-x-2 bg-slate-200/80 p-1.5 rounded-2xl w-fit border border-slate-300/60 shadow-inner">
            <button
              onClick={() => setAdminBatchRoutineSubTab('batches')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
                adminBatchRoutineSubTab === 'batches'
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <Layers className="w-4 h-4 text-indigo-400" />
              <span>{t('batchManagementTitle')}</span>
            </button>
            <button
              onClick={() => setAdminBatchRoutineSubTab('routine')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
                adminBatchRoutineSubTab === 'routine'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <CalendarDays className="w-4 h-4 text-amber-300" />
              <span>{t('classRoutineTitle')}</span>
            </button>
          </div>

          {adminBatchRoutineSubTab === 'batches' ? (
            <BatchManagement />
          ) : (
            <WeeklyRoutineGrid viewMode="ADMIN" />
          )}
        </div>
      ) : activeTab === 'syllabus-tracker' || activeTab === 'syllabus' ? (
        <SyllabusTrackerManager />
      ) : activeTab === 'omr-evaluation' || activeTab === 'omr' ? (
        <OMRImportModule />
      ) : activeTab === 'media-center' || activeTab === 'media' ? (
        <MediaCenter />
      ) : activeTab === 'gamification-cms' || activeTab === 'interactive-cms' ? (
        <InteractiveGamificationCMS />
      ) : activeTab === 'grammar-cms' || activeTab === 'grammar' ? (
        <AdminGrammarCMS />
      ) : activeTab === 'promo-controls' || activeTab === 'promos' || activeTab === 'referrals' ? (
        <AdminPromoSettings />
      ) : activeTab === 'helpdesk' || activeTab === 'complaints' ? (
        <AdminHelpdeskManager />
      ) : activeTab === 'dashboard-controls' || activeTab === 'menu-controls' ? (


        <AdminMenuManager />
      ) : activeTab === 'approvals' ? (
        <UnifiedApprovalEngine />
      ) : activeTab === 'student-portal-control' || activeTab === 'menu-controls' ? (
        <AdminStudentPortalManager />
      ) : activeTab === 'site-cms' ? (
        <GlobalSiteContentCMS />
      ) : activeTab === 'sms-notifications' ? (
        <BulkSMSManager />
      ) : activeTab === 'admissions' ? (
        <UnifiedApprovalEngine />
      ) : activeTab === 'data-backup' ? (
        <DataBackupManager />
      ) : activeTab === 'admin-profile' || activeTab === 'profile' ? (
        <AdminProfileManager defaultTab="profile" />
      ) : activeTab === 'admin-settings' ? (
        <AdminSettings />
      ) : activeTab === 'payment-settings' || activeTab === 'payment-methods' ? (
        <PaymentMethodManager />
      ) : activeTab === 'accounts-payroll' ? (
        <AccountsAndPayroll />
      ) : activeTab === 'results-report' ? (
        <ResultsManager userRole="ADMIN" />
      ) : activeTab === 'live-classes' ? (
        <LiveClassManager role="ADMIN" />
      ) : activeTab === 'students' ? (
        <StudentManager />
      ) : activeTab === 'teachers' ? (
        <TeacherManager />
      ) : activeTab === 'notices' ? (
        <NoticeManager />
      ) : activeTab === 'courses' ? (
        <BatchManagement />
      ) : activeTab === 'teacher-attendance' ? (
        /* Teacher Attendance & In-Out Time Management */
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-5">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold mb-1.5 border border-indigo-100">
                <Clock className="w-3.5 h-3.5" />
                <span>ফ্যাকাল্টি হাজিরা ও কর্মঘণ্টা লগ</span>
              </div>
              <h3 className="text-lg font-black text-slate-900 flex items-center space-x-2">
                <span>{t('teacherAttendanceTitle')}</span>
              </h3>
              <p className="text-xs text-slate-500">
                শিক্ষকদের দৈনিক হাজিরা, আগমন-প্রস্থান সময়সূচি এবং মাসিক উপস্থিতি রিপোর্ট নিয়ন্ত্রণ কেন্দ্র
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
                <button
                  onClick={() => setTeacherAttViewMode('daily')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    teacherAttViewMode === 'daily'
                      ? 'bg-white text-indigo-700 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  📅 দৈনিক হাজিরা (Daily)
                </button>
                <button
                  onClick={() => setTeacherAttViewMode('monthly')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    teacherAttViewMode === 'monthly'
                      ? 'bg-white text-indigo-700 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  📊 মাসিক রিপোর্ট (Monthly)
                </button>
              </div>

              <button
                onClick={handleExportTeacherCSV}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center space-x-1.5 border border-slate-200 transition-all"
                title="CSV / Excel ডাউনলোড"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                <span>এক্সেল/CSV</span>
              </button>

              {teacherAttViewMode === 'daily' && (
                <>
                  <button
                    onClick={handleMarkAllTeachersPresent}
                    className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center space-x-1.5 border border-emerald-200 transition-all"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>সকলকে উপস্থিত করুন</span>
                  </button>

                  <button
                    onClick={handleSaveTeacherAttendance}
                    disabled={savingTeacherAtt}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-600/20 disabled:opacity-50 flex items-center space-x-1.5 transition-all"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{savingTeacherAtt ? 'সংরক্ষণ হচ্ছে...' : 'হাজিরা সংরক্ষণ করুন'}</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            <div className="p-3.5 rounded-2xl bg-indigo-50/60 border border-indigo-100">
              <span className="text-[11px] font-bold text-indigo-600">মোট শিক্ষক</span>
              <p className="text-xl font-black text-indigo-950 mt-0.5">{teacherAttStats.totalTeachers || teachers.length} জন</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100">
              <span className="text-[11px] font-bold text-emerald-600">সময়মতো উপস্থিত</span>
              <p className="text-xl font-black text-emerald-950 mt-0.5">{teacherAttStats.presentCount} জন</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-100">
              <span className="text-[11px] font-bold text-amber-600">দেরিতে আসা (Late)</span>
              <p className="text-xl font-black text-amber-950 mt-0.5">{teacherAttStats.lateCount} জন</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-rose-50/60 border border-rose-100">
              <span className="text-[11px] font-bold text-rose-600">অনুপস্থিত (Absent)</span>
              <p className="text-xl font-black text-rose-950 mt-0.5">{teacherAttStats.absentCount} জন</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-blue-50/60 border border-blue-100">
              <span className="text-[11px] font-bold text-blue-600">ছুটিতে (On Leave)</span>
              <p className="text-xl font-black text-blue-950 mt-0.5">{teacherAttStats.leaveCount} জন</p>
            </div>
          </div>

          {teacherAttViewMode === 'daily' ? (
            /* Daily Attendance Sheet Mode */
            <div className="space-y-4">
              {/* Date & Filter Toolbar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="flex items-center space-x-2 w-full sm:w-auto">
                  <span className="text-xs font-bold text-slate-700 whitespace-nowrap">তারিখ নির্বাচন:</span>
                  <input
                    type="date"
                    value={teacherAttDate}
                    onChange={(e) => setTeacherAttDate(e.target.value)}
                    className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                  <button
                    onClick={() => setTeacherAttDate(new Date().toISOString().split('T')[0])}
                    className="px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold transition-colors whitespace-nowrap"
                  >
                    আজ (Today)
                  </button>
                </div>

                <div className="relative w-full sm:w-72">
                  <input
                    type="text"
                    value={teacherAttSearch}
                    onChange={(e) => setTeacherAttSearch(e.target.value)}
                    placeholder="শিক্ষকের নাম বা পদবি খুঁজুন..."
                    className="w-full pl-9 pr-4 py-1.5 rounded-xl text-xs border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none font-medium bg-white"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                </div>
              </div>

              {/* Attendance Table */}
              <div className="overflow-x-auto border border-slate-200 rounded-2xl shadow-sm">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3.5">শিক্ষক ও পদবি</th>
                      <th className="p-3.5 text-center">উপস্থিতি স্ট্যাটাস</th>
                      <th className="p-3.5">প্রবেশের সময় (In Time)</th>
                      <th className="p-3.5">প্রস্থানের সময় (Out Time)</th>
                      <th className="p-3.5 text-center">মোট কর্মঘণ্টা</th>
                      <th className="p-3.5">মন্তব্য (Remarks)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {loadingTeacherAtt ? (
                      <tr>
                        <td colSpan="6" className="p-8 text-center text-slate-400">
                          <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                          <span>হাজিরা লোড হচ্ছে...</span>
                        </td>
                      </tr>
                    ) : teacherAttSheet.filter(s => !teacherAttSearch || s.name.toLowerCase().includes(teacherAttSearch.toLowerCase()) || s.designation.toLowerCase().includes(teacherAttSearch.toLowerCase())).length === 0 ? (
                      <tr>
                        <td colSpan="6" className="p-8 text-center text-slate-400">
                          কোনো শিক্ষক পাওয়া যায়নি
                        </td>
                      </tr>
                    ) : (
                      teacherAttSheet
                        .filter(s => !teacherAttSearch || s.name.toLowerCase().includes(teacherAttSearch.toLowerCase()) || s.designation.toLowerCase().includes(teacherAttSearch.toLowerCase()))
                        .map((tItem) => {
                          const isPresent = tItem.status === 'PRESENT';
                          const isLate = tItem.status === 'LATE';
                          const isAbsent = tItem.status === 'ABSENT';
                          const isLeave = tItem.status === 'ON_LEAVE';

                          return (
                            <tr key={tItem.teacherId} className="hover:bg-slate-50/80 transition-colors">
                              <td className="p-3.5">
                                <div className="flex items-center space-x-3">
                                  {tItem.avatar ? (
                                    <img
                                      src={tItem.avatar}
                                      alt={tItem.name}
                                      className="w-9 h-9 rounded-full object-cover border border-slate-200"
                                    />
                                  ) : (
                                    <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold text-xs">
                                      {tItem.name.charAt(0)}
                                    </div>
                                  )}
                                  <div>
                                    <p className="font-bold text-slate-900">{tItem.name}</p>
                                    <span className="text-[11px] text-slate-500 font-medium">{tItem.designation}</span>
                                    {tItem.phone && <p className="text-[10px] text-slate-400">{tItem.phone}</p>}
                                  </div>
                                </div>
                              </td>

                              <td className="p-3.5">
                                <div className="flex items-center justify-center space-x-1">
                                  <button
                                    type="button"
                                    onClick={() => handleTeacherAttStatusChange(tItem.teacherId, 'PRESENT')}
                                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                                      isPresent
                                        ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                                        : 'bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
                                    }`}
                                  >
                                    উপস্থিত
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => handleTeacherAttStatusChange(tItem.teacherId, 'LATE')}
                                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                                      isLate
                                        ? 'bg-amber-500 text-white shadow-sm shadow-amber-500/30'
                                        : 'bg-slate-100 text-slate-600 hover:bg-amber-50 hover:text-amber-700'
                                    }`}
                                  >
                                    দেরিতে
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => handleTeacherAttStatusChange(tItem.teacherId, 'ON_LEAVE')}
                                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                                      isLeave
                                        ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                                        : 'bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-700'
                                    }`}
                                  >
                                    ছুটি
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => handleTeacherAttStatusChange(tItem.teacherId, 'ABSENT')}
                                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                                      isAbsent
                                        ? 'bg-rose-600 text-white shadow-sm shadow-rose-600/30'
                                        : 'bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-700'
                                    }`}
                                  >
                                    অনুপস্থিত
                                  </button>
                                </div>
                              </td>

                              <td className="p-3.5">
                                <input
                                  type="text"
                                  disabled={isAbsent || isLeave}
                                  value={tItem.checkInTime || ''}
                                  onChange={(e) => handleTeacherAttTimeChange(tItem.teacherId, 'checkInTime', e.target.value)}
                                  placeholder="08:45 AM"
                                  className="w-28 px-2.5 py-1 rounded-lg border border-slate-300 font-mono text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:bg-slate-100 disabled:text-slate-400"
                                />
                              </td>

                              <td className="p-3.5">
                                <input
                                  type="text"
                                  disabled={isAbsent || isLeave}
                                  value={tItem.checkOutTime || ''}
                                  onChange={(e) => handleTeacherAttTimeChange(tItem.teacherId, 'checkOutTime', e.target.value)}
                                  placeholder="04:30 PM"
                                  className="w-28 px-2.5 py-1 rounded-lg border border-slate-300 font-mono text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:bg-slate-100 disabled:text-slate-400"
                                />
                              </td>

                              <td className="p-3.5 text-center">
                                <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                                  isAbsent || isLeave
                                    ? 'bg-slate-100 text-slate-500'
                                    : 'bg-indigo-50 text-indigo-700 font-mono'
                                }`}>
                                  {isAbsent || isLeave ? '০ ঘণ্টা' : (tItem.workHours || '7h 45m')}
                                </span>
                              </td>

                              <td className="p-3.5">
                                <input
                                  type="text"
                                  value={tItem.remarks || ''}
                                  onChange={(e) => handleTeacherAttRemarksChange(tItem.teacherId, e.target.value)}
                                  placeholder="মন্তব্য লিখুন..."
                                  className="w-full px-2.5 py-1 rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                />
                              </td>
                            </tr>
                          );
                        })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* Monthly Summary Report Mode */
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-slate-700">মাস ও বছর:</span>
                  <select
                    value={selectedAttMonth}
                    onChange={(e) => setSelectedAttMonth(e.target.value)}
                    className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold bg-white"
                  >
                    <option value="01">জানুয়ারি (January)</option>
                    <option value="02">ফেব্রুয়ারি (February)</option>
                    <option value="03">মার্চ (March)</option>
                    <option value="04">এপ্রিল (April)</option>
                    <option value="05">মে (May)</option>
                    <option value="06">জুন (June)</option>
                    <option value="07">জুলাই (July)</option>
                    <option value="08">আগস্ট (August)</option>
                    <option value="09">সেপ্টেম্বর (September)</option>
                    <option value="10">অক্টোবর (October)</option>
                    <option value="11">নভেম্বর (November)</option>
                    <option value="12">ডিসেম্বর (December)</option>
                  </select>

                  <select
                    value={selectedAttYear}
                    onChange={(e) => setSelectedAttYear(e.target.value)}
                    className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold bg-white"
                  >
                    <option value="2025">২০২৫</option>
                    <option value="2026">২০২৬</option>
                    <option value="2027">২০২৭</option>
                  </select>
                </div>

                <div className="text-xs font-bold text-slate-600">
                  মোট শিক্ষক: {monthlyAttReport.length} জন • শিক্ষাবর্ষ: {selectedAttYear}
                </div>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-2xl shadow-sm">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3.5">শিক্ষকের নাম ও পদবি</th>
                      <th className="p-3.5 text-center">উপস্থিত দিন</th>
                      <th className="p-3.5 text-center">দেরিতে আসা (Late)</th>
                      <th className="p-3.5 text-center">অনুপস্থিত (Absent)</th>
                      <th className="p-3.5 text-center">ছুটি (Leaves)</th>
                      <th className="p-3.5 text-center">উপস্থিতির হার (%)</th>
                      <th className="p-3.5 text-center">স্ট্যাটাস রেটিং</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {monthlyAttReport.map((rep) => (
                      <tr key={rep.teacherId} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3.5">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold text-xs">
                              {rep.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900">{rep.name}</p>
                              <span className="text-[11px] text-slate-500">{rep.designation}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-3.5 text-center font-bold text-emerald-700 bg-emerald-50/30">
                          {rep.totalPresent} দিন
                        </td>
                        <td className="p-3.5 text-center font-bold text-amber-700 bg-amber-50/30">
                          {rep.lateDays} দিন
                        </td>
                        <td className="p-3.5 text-center font-bold text-rose-700 bg-rose-50/30">
                          {rep.absentDays} দিন
                        </td>
                        <td className="p-3.5 text-center font-bold text-blue-700 bg-blue-50/30">
                          {rep.leaveDays} দিন
                        </td>
                        <td className="p-3.5 text-center">
                          <div className="flex items-center justify-center space-x-2">
                            <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-indigo-600 rounded-full"
                                style={{ width: `${rep.attendanceRate}%` }}
                              ></div>
                            </div>
                            <span className="font-bold text-slate-900">{rep.attendanceRate}%</span>
                          </div>
                        </td>
                        <td className="p-3.5 text-center">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            rep.attendanceRate >= 90
                              ? 'bg-emerald-100 text-emerald-800'
                              : rep.attendanceRate >= 75
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}>
                            {rep.attendanceRate >= 90 ? '🌟 চমৎকার' : rep.attendanceRate >= 75 ? '👍 সন্তোষজনক' : '⚠️ অনিয়মিত'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      ) : activeTab === 'exams' ? (
        /* Online Examination & Assessment Management */
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <HelpCircle className="w-5 h-5 text-indigo-600" />
                <span>{t('onlineExamsTitle')} ({filteredExams.length}টি পরীক্ষা)</span>
              </h3>
              <p className="text-xs text-slate-500">MCQ কুইজ ও সৃজনশীল লিখিত পরীক্ষার প্রশ্নপত্র প্রণয়ন, শিডিউলিং ও খাতা মূল্যায়ন</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setShowCQGeneratorModal(true)}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center space-x-1.5 transition-all active:scale-95"
                title="এআই দিয়ে সৃজনশীল প্রশ্ন (ক, খ, গ, ঘ) ও প্রিন্ট ফরম্যাট তৈরি করুন"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>📝 এআই সৃজনশীল প্রশ্ন (AI CQ)</span>
              </button>

              <button
                type="button"
                onClick={() => setShowAIGeneratorModal(true)}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-purple-600/20 flex items-center space-x-1.5 transition-all active:scale-95"
                title="এআই দিয়ে বহুনির্বাচনী প্রশ্ন (MCQ) তৈরি করুন"
              >
                <Zap className="w-3.5 h-3.5 text-amber-300" />
                <span>🤖 এআই MCQ জেনারেটর</span>
              </button>

              <button
                onClick={handleOpenCreateExam}
                className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm flex items-center space-x-1.5 transition-all"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{t('createExam')}</span>
              </button>
            </div>
          </div>

          {examSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{examSuccess}</span>
            </div>
          )}

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl">
              <span className="text-[11px] font-bold text-slate-500 block">মোট পরীক্ষা</span>
              <span className="text-xl font-black text-slate-900">{examsList.length}টি</span>
            </div>
            <div className="p-3 bg-indigo-50/60 border border-indigo-100 rounded-2xl">
              <span className="text-[11px] font-bold text-indigo-600 block">বহুনির্বাচনী (MCQ)</span>
              <span className="text-xl font-black text-indigo-900">
                {examsList.filter(e => e.type === 'MCQ').length}টি
              </span>
            </div>
            <div className="p-3 bg-purple-50/60 border border-purple-100 rounded-2xl">
              <span className="text-[11px] font-bold text-purple-600 block">সৃজনশীল (Written)</span>
              <span className="text-xl font-black text-purple-900">
                {examsList.filter(e => e.type === 'WRITTEN').length}টি
              </span>
            </div>
            <div className="p-3 bg-emerald-50/60 border border-emerald-100 rounded-2xl">
              <span className="text-[11px] font-bold text-emerald-600 block">অংশগ্রহণকারী শিক্ষার্থী</span>
              <span className="text-xl font-black text-emerald-900">
                {examsList.reduce((acc, e) => acc + (e.submissionCount || 0), 0)} জন
              </span>
            </div>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="পরীক্ষার নাম বা বিষয় দিয়ে খুঁজুন..."
                  value={examSearch}
                  onChange={(e) => setExamSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <select
                value={selectedExamClass}
                onChange={(e) => setSelectedExamClass(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-semibold bg-white"
              >
                <option value="">সকল শ্রেণি (All Classes)</option>
                <optgroup label="👶 প্রি-প্রাইমারি">
                  {allClasses.filter(c => c.stage === 'PRE_PRIMARY').map(c => <option key={c.id} value={c.id}>{c.nameBn}</option>)}
                </optgroup>
                <optgroup label="🎒 প্রাথমিক (১ম-৫ম)">
                  {allClasses.filter(c => c.stage === 'PRIMARY').map(c => <option key={c.id} value={c.id}>{c.nameBn}</option>)}
                </optgroup>
                <optgroup label="📚 মাধ্যমিক (৬ষ্ঠ-১০ম)">
                  {allClasses.filter(c => c.stage === 'JUNIOR_SECONDARY' || c.stage === 'SECONDARY').map(c => <option key={c.id} value={c.id}>{c.nameBn}</option>)}
                </optgroup>
                <optgroup label="🎓 উচ্চ মাধ্যমিক (১১শ-১২শ)">
                  {allClasses.filter(c => c.stage === 'HIGHER_SECONDARY').map(c => <option key={c.id} value={c.id}>{c.nameBn}</option>)}
                </optgroup>
              </select>

              <select
                value={selectedExamType}
                onChange={(e) => setSelectedExamType(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-semibold bg-white"
              >
                <option value="ALL">সকল ধরণ (MCQ + Written)</option>
                <option value="MCQ">বহুনির্বাচনী (MCQ)</option>
                <option value="WRITTEN">সৃজনশীল / লিখিত (Written)</option>
              </select>
            </div>
          </div>

          {/* Exams List Grid */}
          {filteredExams.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <HelpCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-500">কোনো পরীক্ষা পাওয়া যায়নি</p>
              <button
                onClick={handleOpenCreateExam}
                className="mt-2 text-xs font-bold text-indigo-600 hover:underline"
              >
                + নতুন পরীক্ষা তৈরি করুন
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredExams.map((exam) => (
                <div
                  key={exam.id}
                  className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-all flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`px-2.5 py-0.5 rounded-lg text-[11px] font-bold ${
                        exam.type === 'MCQ'
                          ? 'bg-indigo-100 text-indigo-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {exam.type === 'MCQ' ? '🎯 বহুনির্বাচনী (MCQ)' : '✍️ সৃজনশীল লিখিত (Written)'}
                      </span>
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                        {exam.class?.nameBn || 'শ্রেণি'}
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-slate-900 line-clamp-2">{exam.titleBn}</h4>
                    <p className="text-xs text-slate-500 font-semibold">{exam.subject?.nameBn || 'বিষয়'}</p>

                    <div className="grid grid-cols-2 gap-2 pt-1 text-[11px] text-slate-600 bg-white p-2.5 rounded-xl border border-slate-100">
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

                  <div className="pt-2 border-t border-slate-200 flex flex-col gap-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-medium">
                        সাবমিশন: <strong className="text-indigo-600">{exam.submissionCount || 0} জন</strong>
                      </span>
                      <span className="text-slate-500 font-medium">
                        পাস মার্ক: <strong className="text-slate-800">{exam.passMarks || 2}</strong>
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-1.5 pt-1">
                      <button
                        onClick={() => handleOpenSubmissions(exam)}
                        className="flex-1 py-1.5 px-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-xl flex items-center justify-center space-x-1 transition-all"
                      >
                        <Award className="w-3.5 h-3.5" />
                        <span>সাবমিশন ও মূল্যায়ন</span>
                      </button>

                      <button
                        onClick={() => handleOpenEditExam(exam)}
                        className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl"
                        title="এডিট"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDeleteExam(exam.id, exam.titleBn)}
                        className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl"
                        title="মুছুন"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : activeTab === 'textbooks' ? (
        /* Digital Textbooks, E-Books & Free/Premium Resource Library Management */
        <ResourceLibrary role="ADMIN" showAdminControls={true} />
      ) : activeTab === 'fees' ? (
        <div className="space-y-6">
          {/* Sub-tab Switcher: Invoices vs Payment Accounts Control */}
          <div className="flex items-center space-x-2 bg-slate-200/80 p-1.5 rounded-2xl w-fit border border-slate-300/60 shadow-inner">
            <button
              onClick={() => setFeesSubTab('invoices')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
                feesSubTab === 'invoices'
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <FileText className="w-4 h-4 text-emerald-400" />
              <span>ফি ও ইনভয়েস তালিকা (Invoices & Fees)</span>
            </button>
            <button
              onClick={() => setFeesSubTab('payment-methods')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
                feesSubTab === 'payment-methods'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <CreditCard className="w-4 h-4 text-emerald-300" />
              <span>পেমেন্ট মেথড ও অ্যাকাউন্ট সেটিংস (Payment Accounts Control)</span>
            </button>
          </div>

          {feesSubTab === 'payment-methods' ? (
            <PaymentMethodManager />
          ) : (
            <div className="space-y-6">
              {/* Success Banner */}
              {invoiceSuccess && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center justify-between text-xs font-bold animate-in fade-in">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{invoiceSuccess}</span>
              </div>
              <button onClick={() => setInvoiceSuccess(null)} className="text-emerald-700 hover:text-emerald-900">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Financial KPI Summary Cards */}
          {(() => {
            const totalBase = invoices.reduce((sum, inv) => sum + (Number(inv.baseAmount) || Number(inv.amount) || 0), 0);
            const totalDiscount = invoices.reduce((sum, inv) => sum + (Number(inv.discountAmount) || 0), 0);
            const totalNet = invoices.reduce((sum, inv) => sum + (Number(inv.amount) || 0), 0);
            const totalPaid = invoices.filter(inv => inv.status === 'PAID').reduce((sum, inv) => sum + (Number(inv.amount) || 0), 0);
            const totalDue = invoices.filter(inv => inv.status === 'UNPAID').reduce((sum, inv) => sum + (Number(inv.amount) || 0), 0);

            return (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">মোট মূল ফি</span>
                  <p className="text-xl font-black text-slate-800 mt-1">৳ {totalBase.toLocaleString('en-BD')}</p>
                  <span className="text-[10px] text-slate-400 font-semibold">ভাতা পূর্ববর্তী মোট ফি</span>
                </div>

                <div className="bg-emerald-50/80 p-4 rounded-2xl border border-emerald-200 shadow-sm">
                  <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">প্রদত্ত মোট ছাড়/বৃত্তি</span>
                  <p className="text-xl font-black text-emerald-700 mt-1">৳ {totalDiscount.toLocaleString('en-BD')}</p>
                  <span className="text-[10px] text-emerald-600 font-semibold">মওকুফকৃত স্কলারশিপ</span>
                </div>

                <div className="bg-indigo-50/80 p-4 rounded-2xl border border-indigo-200 shadow-sm">
                  <span className="text-xs font-bold text-indigo-800 uppercase tracking-wider">সর্বমোট প্রদেয় বিল</span>
                  <p className="text-xl font-black text-indigo-700 mt-1">৳ {totalNet.toLocaleString('en-BD')}</p>
                  <span className="text-[10px] text-indigo-600 font-semibold">নিট ইনভয়েস বাজেট</span>
                </div>

                <div className="bg-blue-50/80 p-4 rounded-2xl border border-blue-200 shadow-sm">
                  <span className="text-xs font-bold text-blue-800 uppercase tracking-wider">মোট আদায়কৃত ফি</span>
                  <p className="text-xl font-black text-blue-700 mt-1">৳ {totalPaid.toLocaleString('en-BD')}</p>
                  <span className="text-[10px] text-blue-600 font-semibold">{invoices.filter(i => i.status === 'PAID').length}টি পরিশোধিত</span>
                </div>

                <div className="bg-amber-50/80 p-4 rounded-2xl border border-amber-200 shadow-sm col-span-2 sm:col-span-1">
                  <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">বর্তমান বকেয়া</span>
                  <p className="text-xl font-black text-amber-700 mt-1">৳ {totalDue.toLocaleString('en-BD')}</p>
                  <span className="text-[10px] text-amber-600 font-semibold">{invoices.filter(i => i.status === 'UNPAID').length}টি বকেয়া</span>
                </div>
              </div>
            );
          })()}

          {/* Table Container */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                  <CreditCard className="w-5 h-5 text-emerald-600" />
                  <span>{t('navFees')} ও ছাড় ব্যবস্থাপনা</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">একাডেমির সকল ফি নির্ধারণ, স্কলারশিপ/ছাড় অ্যাসাইন ও আদায় প্রতিবেদন</p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setShowCashPaymentModal(true)}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black shadow-md shadow-emerald-600/30 flex items-center space-x-1.5 transition-all transform active:scale-95"
                >
                  <Banknote className="w-4 h-4" />
                  <span>+ অফলাইন/ক্যাশ ফি আদায়</span>
                </button>

                <button
                  onClick={handleOpenCreateInvoice}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-md flex items-center space-x-1.5 transition-all transform active:scale-95"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>+ নতুন ফি ইনভয়েস ও ছাড় নির্ধারণ</span>
                </button>
              </div>
            </div>

            {/* Filter Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
              {/* Payment Status Filter */}
              <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-xl w-full sm:w-auto">
                <button
                  onClick={() => setInvoiceFilter('')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    !invoiceFilter ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  সব ({invoices.length})
                </button>
                <button
                  onClick={() => setInvoiceFilter('PAID')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    invoiceFilter === 'PAID' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  পরিশোধিত ({invoices.filter(i => i.status === 'PAID').length})
                </button>
                <button
                  onClick={() => setInvoiceFilter('UNPAID')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    invoiceFilter === 'UNPAID' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  বকেয়া ({invoices.filter(i => i.status === 'UNPAID').length})
                </button>
              </div>

              {/* Discount Filter & Search */}
              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <select
                  value={invoiceDiscountFilter}
                  onChange={(e) => setInvoiceDiscountFilter(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="ALL">সকল ফি ক্যাটাগরি</option>
                  <option value="WITH_DISCOUNT">🎁 ছাড় / স্কলারশিপ প্রাপ্ত</option>
                  <option value="NO_DISCOUNT">সাধারণ ফি (ছাড় ব্যতীত)</option>
                </select>

                <div className="relative w-full sm:w-56">
                  <input
                    type="text"
                    value={invoiceSearch}
                    onChange={(e) => setInvoiceSearch(e.target.value)}
                    placeholder="শিক্ষার্থী বা ইনভয়েস নং..."
                    className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>

            {/* Invoices Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3">ইনভয়েস নম্বর</th>
                    <th className="p-3">শিক্ষার্থী ও শ্রেণি</th>
                    <th className="p-3">ফি বিবরণ ও মাস</th>
                    <th className="p-3 text-right">মূল ফি</th>
                    <th className="p-3 text-center">ছাড় / স্কলারশিপ</th>
                    <th className="p-3 text-right">মোট প্রদেয় ফি</th>
                    <th className="p-3 text-center">জমার শেষ তারিখ</th>
                    <th className="p-3 text-center">স্ট্যাটাস</th>
                    <th className="p-3 text-center">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {(() => {
                    const displayed = invoices.filter(inv => {
                      const matchesStatus = !invoiceFilter || inv.status === invoiceFilter;
                      const hasDiscount = (Number(inv.discountAmount) > 0) || (inv.discountType && inv.discountType !== 'NONE');
                      const matchesDisc = invoiceDiscountFilter === 'ALL'
                        ? true
                        : invoiceDiscountFilter === 'WITH_DISCOUNT'
                        ? hasDiscount
                        : !hasDiscount;
                      const q = invoiceSearch.trim().toLowerCase();
                      const matchesSearch = !q ||
                        (inv.invoiceNo && inv.invoiceNo.toLowerCase().includes(q)) ||
                        (inv.titleBn && inv.titleBn.toLowerCase().includes(q)) ||
                        (inv.student?.user?.name && inv.student.user.name.toLowerCase().includes(q));
                      return matchesStatus && matchesDisc && matchesSearch;
                    });

                    if (displayed.length === 0) {
                      return (
                        <tr>
                          <td colSpan={9} className="p-8 text-center text-slate-400">
                            কোনো ইনভয়েসের তথ্য পাওয়া যায়নি। নতুন ফি নির্ধারণ করতে "+ নতুন ফি ও ডিসকাউন্ট নির্ধারণ" বাটনে ক্লিক করুন।
                          </td>
                        </tr>
                      );
                    }

                    return displayed.map((inv) => {
                      const base = Number(inv.baseAmount) || Number(inv.amount) || 0;
                      const disc = Number(inv.discountAmount) || 0;
                      const net = Number(inv.amount) || 0;

                      return (
                        <tr key={inv.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="p-3 font-mono font-bold text-slate-800">
                            {inv.invoiceNo}
                          </td>
                          <td className="p-3">
                            <p className="font-bold text-slate-900">{inv.student?.user?.name || 'শিক্ষার্থী'}</p>
                            <span className="text-[11px] text-slate-500">
                              {inv.student?.class?.nameBn} ({inv.student?.section?.nameBn || 'শাখা'}) • রোল: {inv.student?.rollNo || '১০১'}
                            </span>
                          </td>
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
                          <td className="p-3 text-center text-slate-500 font-medium">
                            {inv.dueDate}
                          </td>
                          <td className="p-3 text-center">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              inv.status === 'PAID' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {inv.status === 'PAID' ? 'পরিশোধিত' : 'বকেয়া'}
                            </span>
                          </td>
                          <td className="p-3 text-center">
                            <div className="flex items-center justify-center space-x-1">
                              <button
                                onClick={async () => {
                                  try {
                                    const res = await accountsAPI.getReceipt(inv.id);
                                    if (res.success && res.data) {
                                      setCurrentReceiptData(res.data);
                                    }
                                  } catch (e) {
                                    console.error(e);
                                  }
                                }}
                                className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                                title="মানি রিসিট দেখুন ও প্রিন্ট করুন"
                              >
                                <Receipt className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteInvoice(inv.id, inv.titleBn)}
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                title="ইনভয়েস মুছুন"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    });
                  })()}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  ) : activeTab === 'audit-logs' ? (
    <SecurityAuditLogs />
  ) : (
        /* General Overview Tab */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quick Notice Board */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900 flex items-center space-x-2">
                <BellRing className="w-4 h-4 text-emerald-600" />
                <span>সাম্প্রতিক নোটিশসমূহ</span>
              </h3>
              <button
                onClick={() => setShowNoticeModal(true)}
                className="text-xs font-bold text-emerald-600 hover:underline"
              >
                + নতুন নোটিশ
              </button>
            </div>
            <p className="text-xs text-slate-500">নোটিশ প্রকাশ করতে উপরের বাটনে ক্লিক করুন।</p>
          </div>

          {/* Recent Audits Snapshot */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
            <h3 className="font-bold text-sm text-slate-900 flex items-center space-x-2 pb-2 border-b border-slate-100">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>নিরাপত্তা ও অ্যাকশন অডিট স্ন্যাপশট</span>
            </h3>
            <div className="space-y-2">
              {auditLogs.slice(0, 4).map((log) => (
                <div key={log.id} className="p-2.5 rounded-xl bg-slate-50 text-xs flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-800">{log.action}</span>
                    <p className="text-[11px] text-slate-500 truncate max-w-xs">{log.details}</p>
                  </div>
                  <span className="text-[10px] text-slate-400">{new Date(log.createdAt).toLocaleTimeString('bn-BD')}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        )}
      </Suspense>


      {/* Add New Student Modal */}
      {showStudentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <UserPlus className="w-5 h-5 text-emerald-600" />
                <span>নতুন শিক্ষার্থী ভর্তি ও তথ্য সংরক্ষণ (Add Student)</span>
              </h3>
              <button
                onClick={() => setShowStudentModal(false)}
                className="text-slate-400 hover:text-slate-700 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateStudent} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Student Name */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-900 mb-1">
                    শিক্ষার্থীর পূর্ণ নাম <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={studentForm.name}
                    onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })}
                    placeholder="যেমন: রাফসান জামান (Rafsan Zaman)"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 font-semibold"
                  />
                </div>

                {/* Roll Number */}
                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-1">
                    শ্রেণির রোল নম্বর <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={studentForm.rollNo}
                    onChange={(e) => setStudentForm({ ...studentForm, rollNo: e.target.value })}
                    placeholder="যেমন: 105"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 font-semibold"
                  />
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-1">লিঙ্গ (Gender)</label>
                  <select
                    value={studentForm.gender}
                    onChange={(e) => setStudentForm({ ...studentForm, gender: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-semibold"
                  >
                    <option value="MALE">ছাত্র (Male)</option>
                    <option value="FEMALE">ছাত্রী (Female)</option>
                    <option value="OTHER">অন্যান্য (Other)</option>
                  </select>
                </div>

                {/* Class - Custom Dropdown with onMouseDown & Selectable Categories */}
                <div className="relative">
                  <label className="block text-xs font-bold text-slate-900 mb-1">
                    ভর্তি শ্রেণি <span className="text-rose-500">*</span>
                  </label>

                  {/* Green Bordered Trigger Box dynamically showing selected class name */}
                  <button
                    type="button"
                    onClick={() => setIsAdmissionClassDropdownOpen(!isAdmissionClassDropdownOpen)}
                    onBlur={() => {
                      setTimeout(() => setIsAdmissionClassDropdownOpen(false), 200);
                    }}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border-2 border-emerald-500 font-bold text-emerald-950 bg-emerald-50/70 hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 flex items-center justify-between shadow-sm transition-all text-left cursor-pointer"
                  >
                    <span className="truncate">
                      {allClasses.find(c => String(c.id) === String(studentForm.classId))?.nameBn ||
                       allClasses.find(c => String(c.id) === String(studentForm.classId))?.name ||
                       'শ্রেণি নির্বাচন করুন'}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-emerald-600 ml-2 shrink-0 transition-transform ${isAdmissionClassDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Custom Dropdown Menu with onMouseDown handlers */}
                  {isAdmissionClassDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border-2 border-emerald-500/80 rounded-2xl shadow-2xl z-50 max-h-64 overflow-y-auto p-2 space-y-2 animate-in fade-in slide-in-from-top-1">
                      {[
                        { stage: 'PRE_PRIMARY', label: '👶 প্রি-প্রাইমারি (Pre-Primary)', bg: 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100' },
                        { stage: 'PRIMARY', label: '🎒 প্রাথমিক (Primary 1-5)', bg: 'bg-emerald-50 text-emerald-900 border-emerald-200 hover:bg-emerald-100' },
                        { stage: 'SECONDARY', label: '📚 মাধ্যমিক (Secondary 6-10)', bg: 'bg-blue-50 text-blue-900 border-blue-200 hover:bg-blue-100', match: (c) => c.stage === 'JUNIOR_SECONDARY' || c.stage === 'SECONDARY' },
                        { stage: 'HIGHER_SECONDARY', label: '🎓 উচ্চ মাধ্যমিক (HSC 11-12)', bg: 'bg-purple-50 text-purple-900 border-purple-200 hover:bg-purple-100' }
                      ].map((cat) => {
                        const catClasses = allClasses.filter(c => cat.match ? cat.match(c) : c.stage === cat.stage);
                        if (catClasses.length === 0) return null;
                        return (
                          <div key={cat.stage} className="space-y-1">
                            {/* Category Header - Selectable onMouseDown to select default category class */}
                            <div
                              onMouseDown={(e) => {
                                e.preventDefault();
                                const firstClass = catClasses[0];
                                if (firstClass) {
                                  setStudentForm({
                                    ...studentForm,
                                    classId: String(firstClass.id),
                                    sectionId: firstClass.sections?.[0]?.id ? String(firstClass.sections[0].id) : '1'
                                  });
                                  setIsAdmissionClassDropdownOpen(false);
                                }
                              }}
                              className={`px-3 py-1.5 rounded-xl border text-[11px] font-black cursor-pointer flex items-center justify-between transition-colors ${cat.bg}`}
                              title="ক্যাটাগরি সিলেক্ট করুন"
                            >
                              <span>{cat.label}</span>
                              <span className="text-[10px] opacity-70">({catClasses.length}টি শ্রেণি)</span>
                            </div>

                            {/* Child Classes */}
                            <div className="grid grid-cols-1 gap-1 pl-2">
                              {catClasses.map((cls) => {
                                const isSelected = String(studentForm.classId) === String(cls.id);
                                return (
                                  <div
                                    key={cls.id}
                                    onMouseDown={(e) => {
                                      e.preventDefault();
                                      setStudentForm({
                                        ...studentForm,
                                        classId: String(cls.id),
                                        sectionId: cls.sections?.[0]?.id ? String(cls.sections[0].id) : '1'
                                      });
                                      setIsAdmissionClassDropdownOpen(false);
                                    }}
                                    className={`px-3 py-2 rounded-xl text-xs font-bold cursor-pointer flex items-center justify-between transition-all ${
                                      isSelected
                                        ? 'bg-emerald-600 text-white shadow-sm font-black'
                                        : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-900'
                                    }`}
                                  >
                                    <span>{cls.nameBn || cls.name}</span>
                                    {isSelected && <Check className="w-3.5 h-3.5 text-white shrink-0" />}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Section */}
                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-1">
                    শাখা / সেকশন <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={studentForm.sectionId}
                    onChange={(e) => setStudentForm({ ...studentForm, sectionId: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-semibold"
                  >
                    {allClasses.find(c => c.id === Number(studentForm.classId))?.sections?.map(sec => (
                      <option key={sec.id} value={sec.id}>{sec.nameBn}</option>
                    ))}
                  </select>
                </div>

                {/* Guardian Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-1">
                    অভিভাবকের নাম <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={studentForm.guardianName}
                    onChange={(e) => setStudentForm({ ...studentForm, guardianName: e.target.value })}
                    placeholder="যেমন: কামরুল জামান"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 font-semibold"
                  />
                </div>

                {/* Guardian Mobile */}
                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-1">
                    অভিভাবকের মোবাইল নম্বর <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={studentForm.guardianPhone}
                    onChange={(e) => setStudentForm({ ...studentForm, guardianPhone: e.target.value })}
                    placeholder="যেমন: 01711223344"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 font-mono font-bold"
                  />
                </div>

                {/* Blood Group */}
                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-1">রক্তের গ্রুপ</label>
                  <select
                    value={studentForm.bloodGroup}
                    onChange={(e) => setStudentForm({ ...studentForm, bloodGroup: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-bold text-rose-700"
                  >
                    <option value="A+">A+ (পজিটিভ)</option>
                    <option value="A-">A- (নেগেটিভ)</option>
                    <option value="B+">B+ (পজিটিভ)</option>
                    <option value="B-">B- (নেগেটিভ)</option>
                    <option value="O+">O+ (পজিটিভ)</option>
                    <option value="O-">O- (নেগেটিভ)</option>
                    <option value="AB+">AB+ (পজিটিভ)</option>
                    <option value="AB-">AB- (নেগেটিভ)</option>
                  </select>
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-1">জন্ম তারিখ (Date of Birth)</label>
                  <input
                    type="date"
                    value={studentForm.dob}
                    onChange={(e) => setStudentForm({ ...studentForm, dob: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-medium"
                  />
                </div>

                {/* Admission Date */}
                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-1">
                    ভর্তির তারিখ (Admission Date) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={studentForm.admissionDate || new Date().toISOString().split('T')[0]}
                    onChange={(e) => setStudentForm({ ...studentForm, admissionDate: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-medium text-emerald-950 font-bold bg-emerald-50/30"
                  />
                </div>

                {/* Address */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-900 mb-1">বর্তমান ঠিকানা</label>
                  <input
                    type="text"
                    value={studentForm.address}
                    onChange={(e) => setStudentForm({ ...studentForm, address: e.target.value })}
                    placeholder="যেমন: বাড়ি #১২, রোড #৪, ধানমন্ডি, ঢাকা"
                    className="w-full bg-white border border-slate-300 text-slate-900 font-semibold placeholder:text-slate-400 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm text-xs"
                  />
                </div>

                {/* Universal Student Photo Uploader */}
                <div className="sm:col-span-2 p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <UniversalFileUploader
                    label="শিক্ষার্থীর ছবি / পাসপোর্ট সাইজ ফটো (Student Photo - Device Upload or URL)"
                    value={studentForm.photo}
                    previewType="image"
                    accept="*/*"
                    maxMb={100}
                    helperText="পাসপোর্ট সাইজ ফটো, ক্যামেরা স্ন্যাপ বা গুগল ড্রাইভ ছবি লিংক"
                    onChange={({ fileUrl, url }) => {
                      setStudentForm(prev => ({ ...prev, photo: fileUrl || url || null }));
                    }}
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end space-x-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowStudentModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  disabled={savingStudent}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-600/20 disabled:opacity-50 flex items-center space-x-1.5 transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>{savingStudent ? t('processing') : 'সংরক্ষণ করুন (Save Student)'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Publish Notice Modal */}
      {showNoticeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <BellRing className="w-5 h-5 text-emerald-600" />
                <span>{t('publishNotice')}</span>
              </h3>
              <button
                onClick={() => setShowNoticeModal(false)}
                className="text-slate-400 hover:text-slate-700 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handlePublishNotice} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1">নোটিশের শিরোনাম (বাংলা)</label>
                <input
                  type="text"
                  required
                  value={noticeForm.titleBn}
                  onChange={(e) => setNoticeForm({ ...noticeForm, titleBn: e.target.value })}
                  placeholder="যেমন: পবিত্র রমজান উপলক্ষ্যে সময়সূচি পরিবর্তন"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1">বিস্তারিত বিবরণ (বাংলা)</label>
                <textarea
                  rows={3}
                  required
                  value={noticeForm.contentBn}
                  onChange={(e) => setNoticeForm({ ...noticeForm, contentBn: e.target.value })}
                  placeholder="নোটিশের বিস্তারিত বার্তা লিখুন..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-1">ক্যাটাগরি</label>
                  <select
                    value={noticeForm.category}
                    onChange={(e) => setNoticeForm({ ...noticeForm, category: e.target.value })}
                    className="w-full px-2.5 py-2 text-xs rounded-xl border border-slate-300 font-semibold"
                  >
                    <option value="ACADEMIC">শিক্ষা সংক্রান্ত</option>
                    <option value="FEE">ফি সংক্রান্ত</option>
                    <option value="HOLIDAY">ছুটি</option>
                    <option value="GENERAL">সাধারণ</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-1">গুরুত্ব</label>
                  <select
                    value={noticeForm.priority}
                    onChange={(e) => setNoticeForm({ ...noticeForm, priority: e.target.value })}
                    className="w-full px-2.5 py-2 text-xs rounded-xl border border-slate-300 font-semibold"
                  >
                    <option value="NORMAL">সাধারণ</option>
                    <option value="URGENT">জরুরি (Urgent)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-1">প্রাপক</label>
                  <select
                    value={noticeForm.targetRole}
                    onChange={(e) => setNoticeForm({ ...noticeForm, targetRole: e.target.value })}
                    className="w-full px-2.5 py-2 text-xs rounded-xl border border-slate-300 font-semibold"
                  >
                    <option value="ALL">সকলের জন্য</option>
                    <option value="PARENT">অভিভাবকগণ</option>
                    <option value="STUDENT">শিক্ষার্থীগণ</option>
                    <option value="TEACHER">শিক্ষকমণ্ডলী</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end space-x-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowNoticeModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-600/20 flex items-center space-x-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>প্রকাশ করুন</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Audit Log Inspect Modal */}
      {inspectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-xl w-full p-6 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-sm text-slate-900 flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>অডিট লগ বিস্তারিত (Audit Payload Diff)</span>
              </h3>
              <button onClick={() => setInspectedLog(null)} className="text-slate-400 hover:text-slate-700 font-bold">✕</button>
            </div>

            <div className="text-xs space-y-2">
              <p><strong>অ্যাকশন:</strong> <span className="font-mono bg-slate-100 px-2 py-0.5 rounded">{inspectedLog.action}</span></p>
              <p><strong>ইউজার আইডি:</strong> {inspectedLog.userId} ({inspectedLog.user?.name || 'System'})</p>
              <p><strong>আইপি অ্যাড্রেস:</strong> {inspectedLog.ipAddress}</p>
              <p><strong>টাইমস্ট্যাম্প:</strong> {new Date(inspectedLog.createdAt).toISOString()}</p>
            </div>

            {inspectedLog.oldValue && (
              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1">পূর্ববর্তী অবস্থা (Previous State):</label>
                <pre className="p-3 bg-slate-900 text-emerald-400 rounded-xl text-[11px] font-mono overflow-x-auto">
                  {JSON.stringify(inspectedLog.oldValue, null, 2)}
                </pre>
              </div>
            )}

            {inspectedLog.newValue && (
              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1">নতুন অবস্থা (Updated State):</label>
                <pre className="p-3 bg-slate-900 text-teal-300 rounded-xl text-[11px] font-mono overflow-x-auto">
                  {JSON.stringify(inspectedLog.newValue, null, 2)}
                </pre>
              </div>
            )}

            <div className="text-right pt-2">
              <button
                onClick={() => setInspectedLog(null)}
                className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Teacher Modal */}
      {showTeacherModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-2xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {editingTeacherId ? 'শিক্ষক প্রোফাইল সম্পাদনা (Edit Teacher)' : '+ নতুন শিক্ষক যুক্ত করুন (Add New Teacher)'}
                  </h3>
                  <p className="text-xs text-slate-500">শিক্ষকের ব্যক্তিগত তথ্য, পদবি, পাঠদানের বিষয় ও লগইন অ্যাকাউন্ট</p>
                </div>
              </div>
              <button
                onClick={() => setShowTeacherModal(false)}
                className="text-slate-400 hover:text-slate-700 font-bold p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveTeacher} className="space-y-4 text-xs">
              {/* Personal Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-900 mb-1">
                    শিক্ষকের পূর্ণ নাম (Full Name) *
                  </label>
                  <input
                    type="text"
                    required
                    value={teacherForm.name}
                    onChange={(e) => setTeacherForm({ ...teacherForm, name: e.target.value })}
                    placeholder="যেমন: ড. মাহফুজুর রহমান (Dr. Mahfuzur Rahman)"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-900 mb-1">
                    পদবি / ডেজিগনেশন (Designation) *
                  </label>
                  <input
                    type="text"
                    required
                    value={teacherForm.designation}
                    onChange={(e) => setTeacherForm({ ...teacherForm, designation: e.target.value })}
                    placeholder="যেমন: সিনিয়র প্রভাষক / সহকারী শিক্ষক"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-900 mb-1">
                    শিক্ষাগত যোগ্যতা ও স্পেশালাইজেশন (Qualification)
                  </label>
                  <input
                    type="text"
                    value={teacherForm.specialization}
                    onChange={(e) => setTeacherForm({ ...teacherForm, specialization: e.target.value })}
                    placeholder="যেমন: বিএসসি (অনার্স) ও এমএসসি (গণিত, ঢাবি)"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-900 mb-1">
                    যোগদানের তারিখ (Joining Date)
                  </label>
                  <input
                    type="date"
                    value={teacherForm.joiningDate}
                    onChange={(e) => setTeacherForm({ ...teacherForm, joiningDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
                  />
                </div>
              </div>

              {/* Class & Subject Assignment */}
              <div className="p-3.5 bg-purple-50/50 rounded-2xl border border-purple-100 space-y-3">
                <h4 className="font-bold text-purple-900 flex items-center space-x-1.5">
                  <BookOpen className="w-4 h-4 text-purple-600" />
                  <span>নির্ধারিত শ্রেণি ও বিষয় নির্বাচন (Class & Subject Assignment)</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-900 mb-1">
                      পাঠদানের শ্রেণি (Assigned Class)
                    </label>
                    <select
                      value={teacherForm.assignedClassId}
                      onChange={(e) => setTeacherForm({ ...teacherForm, assignedClassId: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold bg-white"
                    >
                      <optgroup label="👶 প্রি-প্রাইমারি (Pre-Primary)">
                        {allClasses.filter(c => c.stage === 'PRE_PRIMARY').map(c => (
                          <option key={c.id} value={c.id}>{c.nameBn}</option>
                        ))}
                      </optgroup>
                      <optgroup label="🎒 প্রাথমিক (Primary 1-5)">
                        {allClasses.filter(c => c.stage === 'PRIMARY').map(c => (
                          <option key={c.id} value={c.id}>{c.nameBn}</option>
                        ))}
                      </optgroup>
                      <optgroup label="📚 মাধ্যমিক (Secondary 6-10)">
                        {allClasses.filter(c => c.stage === 'JUNIOR_SECONDARY' || c.stage === 'SECONDARY').map(c => (
                          <option key={c.id} value={c.id}>{c.nameBn}</option>
                        ))}
                      </optgroup>
                      <optgroup label="🎓 উচ্চ মাধ্যমিক (HSC 11-12)">
                        {allClasses.filter(c => c.stage === 'HIGHER_SECONDARY').map(c => (
                          <option key={c.id} value={c.id}>{c.nameBn}</option>
                        ))}
                      </optgroup>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-900 mb-1">
                      পাঠদানের বিষয় (Assigned Subject)
                    </label>
                    <select
                      value={teacherForm.assignedSubjectId}
                      onChange={(e) => setTeacherForm({ ...teacherForm, assignedSubjectId: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold bg-white"
                    >
                      {teacherSubjects.map(s => (
                        <option key={s.id} value={s.id}>{s.nameBn} ({s.code})</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Contact & Login Credentials */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="font-bold text-slate-900 flex items-center space-x-1.5">
                  <UserCheck className="w-4 h-4 text-emerald-600" />
                  <span>যোগাযোগ ও লগইন অ্যাকাউন্ট (Login Credentials)</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-slate-900 mb-1">
                      মোবাইল নম্বর (Phone) *
                    </label>
                    <input
                      type="tel"
                      required
                      value={teacherForm.phone}
                      onChange={(e) => setTeacherForm({ ...teacherForm, phone: e.target.value })}
                      placeholder="০১৭xxxxxxxx"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-900 mb-1">
                      ইমেইল (Email)
                    </label>
                    <input
                      type="email"
                      value={teacherForm.email}
                      onChange={(e) => setTeacherForm({ ...teacherForm, email: e.target.value })}
                      placeholder="teacher@nextgen.edu.bd"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-900 mb-1">
                      পাসওয়ার্ড (Password)
                    </label>
                    <input
                      type="text"
                      value={teacherForm.password}
                      onChange={(e) => setTeacherForm({ ...teacherForm, password: e.target.value })}
                      placeholder="ডিফল্ট: teacher123"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Universal Teacher Photo Uploader */}
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
                <UniversalFileUploader
                  label="শিক্ষকের ছবি (Teacher Photo - Device Upload or URL)"
                  value={teacherForm.photo}
                  previewType="image"
                  accept="*/*"
                  maxMb={100}
                  helperText="পাসপোর্ট সাইজ ফটো, ক্যামেরা স্ন্যাপ বা গুগল ড্রাইভ ছবি লিংক"
                  onChange={({ fileUrl, url }) => {
                    setTeacherForm(prev => ({ ...prev, photo: fileUrl || url || null }));
                  }}
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex items-center justify-end space-x-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowTeacherModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-semibold transition-all"
                >
                  {t('cancel')}
                </button>

                <button
                  type="submit"
                  disabled={savingTeacher}
                  className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-md shadow-purple-600/20 disabled:opacity-50 flex items-center space-x-1.5 transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>{savingTeacher ? 'সংরক্ষণ হচ্ছে...' : (editingTeacherId ? 'আপডেট করুন (Update)' : 'সংরক্ষণ করুন (Save Teacher)')}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add / Edit Textbook Modal */}
      {showTextbookModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-4 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-xl bg-indigo-50 text-indigo-700">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {editingTextbookId ? 'পাঠ্যপুস্তক সম্পাদনা করুন' : '+ নতুন পাঠ্যপুস্তক যুক্ত করুন'}
                  </h3>
                  <p className="text-[11px] text-slate-500">জাতীয় কারিকুলাম ও ই-লাইব্রেরি ম্যানেজমেন্ট</p>
                </div>
              </div>
              <button
                onClick={() => setShowTextbookModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTextbook} className="space-y-3.5 text-xs">
              {/* Title Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-900 mb-1">
                    বইয়ের নাম (Bangla Title) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={textbookForm.titleBn}
                    onChange={(e) => setTextbookForm({ ...textbookForm, titleBn: e.target.value })}
                    placeholder="যেমন: সাহিত্য কণিকা - ৮ম শ্রেণি"
                    className="w-full bg-white border border-slate-300 text-slate-900 font-semibold placeholder:text-slate-400 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-900 mb-1">
                    বইয়ের ইংরেজি নাম (English Title)
                  </label>
                  <input
                    type="text"
                    value={textbookForm.titleEn}
                    onChange={(e) => setTextbookForm({ ...textbookForm, titleEn: e.target.value })}
                    placeholder="e.g. Sahitya Konika - Class 8"
                    className="w-full bg-white border border-slate-300 text-slate-900 font-semibold placeholder:text-slate-400 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm"
                  />
                </div>
              </div>

              {/* Class & Subject Selection */}
              <div className="p-3.5 bg-indigo-50/50 rounded-2xl border border-indigo-100 space-y-3">
                <h4 className="font-bold text-indigo-900 flex items-center space-x-1.5">
                  <BookMarked className="w-4 h-4 text-indigo-600" />
                  <span>শ্রেণি ও বিষয় নির্বাচন (Class & Subject)</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-900 mb-1">
                      শ্রেণি (Class) <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={textbookForm.classId}
                      onChange={(e) => setTextbookForm({ ...textbookForm, classId: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold bg-white"
                    >
                      <optgroup label="👶 প্রি-প্রাইমারি (Pre-Primary)">
                        {allClasses.filter(c => c.stage === 'PRE_PRIMARY').map(c => (
                          <option key={c.id} value={c.id}>{c.nameBn}</option>
                        ))}
                      </optgroup>
                      <optgroup label="🎒 প্রাথমিক (Primary 1-5)">
                        {allClasses.filter(c => c.stage === 'PRIMARY').map(c => (
                          <option key={c.id} value={c.id}>{c.nameBn}</option>
                        ))}
                      </optgroup>
                      <optgroup label="📚 মাধ্যমিক (Secondary 6-10)">
                        {allClasses.filter(c => c.stage === 'JUNIOR_SECONDARY' || c.stage === 'SECONDARY').map(c => (
                          <option key={c.id} value={c.id}>{c.nameBn}</option>
                        ))}
                      </optgroup>
                      <optgroup label="🎓 উচ্চ মাধ্যমিক (HSC 11-12)">
                        {allClasses.filter(c => c.stage === 'HIGHER_SECONDARY').map(c => (
                          <option key={c.id} value={c.id}>{c.nameBn}</option>
                        ))}
                      </optgroup>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-900 mb-1">
                      বিষয় (Subject) <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={textbookForm.subjectId}
                      onChange={(e) => setTextbookForm({ ...textbookForm, subjectId: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold bg-white"
                    >
                      {textbookSubjects.map(sub => (
                        <option key={sub.id} value={sub.id}>
                          {sub.nameBn} ({sub.code})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Edition, Author & File Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-900 mb-1">
                    সংস্করণ / শিক্ষাবর্ষ (Edition)
                  </label>
                  <input
                    type="text"
                    value={textbookForm.edition}
                    onChange={(e) => setTextbookForm({ ...textbookForm, edition: e.target.value })}
                    placeholder="যেমন: NCTB ২০২৬ সংস্করণ"
                    className="w-full bg-white border border-slate-300 text-slate-900 font-semibold placeholder:text-slate-400 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-900 mb-1">
                    বোর্ড / রচয়িতা (Author / Board)
                  </label>
                  <input
                    type="text"
                    value={textbookForm.author}
                    onChange={(e) => setTextbookForm({ ...textbookForm, author: e.target.value })}
                    placeholder="জাতীয় শিক্ষাক্রম ও পাঠ্যপুস্তক বোর্ড (NCTB)"
                    className="w-full bg-white border border-slate-300 text-slate-900 font-semibold placeholder:text-slate-400 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm"
                  />
                </div>
              </div>

              {/* File Link / URL */}
              <div>
                <label className="block font-bold text-slate-900 mb-1">
                  বইয়ের সম্পূর্ণ PDF ফাইল বা অনলাইন রিডিং লিঙ্ক (PDF / Web Link)
                </label>
                <input
                  type="url"
                  value={textbookForm.fileUrl}
                  onChange={(e) => setTextbookForm({ ...textbookForm, fileUrl: e.target.value })}
                  placeholder="https://nctb.gov.bd/textbooks/class8-bangla.pdf বা লিঙ্ক"
                  className="w-full bg-white border border-slate-300 text-slate-900 font-semibold placeholder:text-slate-400 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-900 mb-1">
                    পৃষ্ঠা সংখ্যা (Total Pages)
                  </label>
                  <input
                    type="number"
                    value={textbookForm.totalPages}
                    onChange={(e) => setTextbookForm({ ...textbookForm, totalPages: e.target.value })}
                    className="w-full bg-white border border-slate-300 text-slate-900 font-semibold placeholder:text-slate-400 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-900 mb-1">
                    ফাইলের আকার (File Size)
                  </label>
                  <input
                    type="text"
                    value={textbookForm.fileSize}
                    onChange={(e) => setTextbookForm({ ...textbookForm, fileSize: e.target.value })}
                    placeholder="যেমন: 15.4 MB"
                    className="w-full bg-white border border-slate-300 text-slate-900 font-semibold placeholder:text-slate-400 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block font-bold text-slate-900 mb-1">
                  সংক্ষিপ্ত পরিচিতি ও নির্দেশনা (Description)
                </label>
                <textarea
                  rows="2"
                  value={textbookForm.description}
                  onChange={(e) => setTextbookForm({ ...textbookForm, description: e.target.value })}
                  placeholder="বইটির অধ্যায় বা শিক্ষাক্রমের সংক্ষিপ্ত বিবরণ লিখুন..."
                  className="w-full bg-white border border-slate-300 text-slate-900 font-semibold placeholder:text-slate-400 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm"
                />
              </div>

              {/* Universal Book Cover Uploader */}
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
                <UniversalFileUploader
                  label="বইয়ের প্রচ্ছদ / কভার ইমেজ (Cover Image / Link - Optional)"
                  value={textbookForm.coverImage}
                  previewType="image"
                  accept="*/*"
                  maxMb={100}
                  helperText="প্রচ্ছদ ছবি আপলোড করুন অথবা অনলাইন ইমেজ লিঙ্ক দিন"
                  onChange={({ fileUrl, url }) => {
                    setTextbookForm(prev => ({ ...prev, coverImage: fileUrl || url || null }));
                  }}
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex items-center justify-end space-x-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowTextbookModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-semibold transition-all"
                >
                  {t('cancel')}
                </button>

                <button
                  type="submit"
                  disabled={savingTextbook}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md shadow-indigo-600/20 disabled:opacity-50 flex items-center space-x-1.5 transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>{savingTextbook ? 'সংরক্ষণ হচ্ছে...' : (editingTextbookId ? 'আপডেট করুন (Update)' : 'সংরক্ষণ করুন (Save Book)')}</span>
                </button>
              </div>
            </form>
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
                    {readingTextbook.class?.nameBn} • {readingTextbook.subject?.nameBn} • {readingTextbook.edition}
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

            {/* Reader Simulated Viewer Body */}
            <div className="flex-1 bg-slate-950 p-4 sm:p-6 overflow-y-auto flex flex-col items-center justify-center">
              <div className="max-w-2xl w-full bg-white text-slate-900 rounded-2xl shadow-2xl p-6 sm:p-10 space-y-6 min-h-[500px] flex flex-col justify-between border border-slate-200">
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b pb-4">
                    <div className="text-xs text-slate-500 font-semibold">
                      জাতীয় শিক্ষাক্রম ও পাঠ্যপুস্তক বোর্ড, বাংলাদেশ (NCTB)
                    </div>
                    <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full font-bold text-xs">
                      {readingTextbook.class?.nameBn}
                    </span>
                  </div>

                  <div className="text-center py-6 space-y-3">
                    <div className="w-20 h-24 mx-auto bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-xl shadow-lg flex items-center justify-center text-white">
                      <BookOpen className="w-10 h-10" />
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">{readingTextbook.titleBn}</h2>
                    <h3 className="text-sm font-semibold text-slate-500">{readingTextbook.titleEn}</h3>
                    <p className="text-xs text-indigo-600 font-bold">{readingTextbook.edition}</p>
                    <p className="text-xs text-slate-600 italic">লেখক/সংকলক: {readingTextbook.author}</p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 leading-relaxed">
                    <h5 className="font-bold text-slate-900 mb-1">বইয়ের বিবরণ:</h5>
                    <p>{readingTextbook.description || 'এই ডিজিটাল ই-বুকটি জাতীয় শিক্ষাক্রম অনুযায়ী সম্পূর্ণ অধ্যায় ও অনুশীলনীর ডিজিটাল সংস্করণ।'}</p>
                  </div>
                </div>

                <div className="pt-4 border-t flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                  <span className="text-slate-500">মোট পৃষ্ঠা: {readingTextbook.totalPages || 150} | আকার: {readingTextbook.fileSize || '15 MB'}</span>
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

      {/* Add / Edit Online Exam Modal */}
      {showExamModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 shadow-2xl space-y-4 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-xl bg-indigo-50 text-indigo-700">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {editingExamId ? 'অনলাইন পরীক্ষা সম্পাদনা করুন' : '+ নতুন অনলাইন পরীক্ষা তৈরি করুন'}
                  </h3>
                  <p className="text-[11px] text-slate-500">MCQ কুইজ ও সৃজনশীল লিখিত পরীক্ষার প্রশ্নপত্র প্রণয়ন</p>
                </div>
              </div>
              <button
                onClick={() => setShowExamModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveExam} className="space-y-4 text-xs">
              {/* Title & Basic Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-900 mb-1">
                    পরীক্ষার নাম / শিরোনাম (Bangla Title) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={examForm.titleBn}
                    onChange={(e) => setExamForm({ ...examForm, titleBn: e.target.value })}
                    placeholder="যেমন: ৮ম শ্রেণি বিজ্ঞান ১ম সাময়িক কুইজ"
                    className="w-full bg-white border border-slate-300 text-slate-900 font-semibold placeholder:text-slate-400 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-900 mb-1">
                    ইংরেজি নাম (English Title)
                  </label>
                  <input
                    type="text"
                    value={examForm.titleEn}
                    onChange={(e) => setExamForm({ ...examForm, titleEn: e.target.value })}
                    placeholder="e.g. Class 8 Science 1st Term Quiz"
                    className="w-full bg-white border border-slate-300 text-slate-900 font-semibold placeholder:text-slate-400 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm"
                  />
                </div>
              </div>

              {/* Class, Subject & Exam Type */}
              <div className="p-3.5 bg-indigo-50/50 rounded-2xl border border-indigo-100 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-900 mb-1">
                    শ্রেণি (Class) <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={examForm.classId}
                    onChange={(e) => setExamForm({ ...examForm, classId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold bg-white"
                  >
                    <optgroup label="👶 প্রি-প্রাইমারি">
                      {allClasses.filter(c => c.stage === 'PRE_PRIMARY').map(c => <option key={c.id} value={c.id}>{c.nameBn}</option>)}
                    </optgroup>
                    <optgroup label="🎒 প্রাথমিক (১ম-৫ম)">
                      {allClasses.filter(c => c.stage === 'PRIMARY').map(c => <option key={c.id} value={c.id}>{c.nameBn}</option>)}
                    </optgroup>
                    <optgroup label="📚 মাধ্যমিক (৬ষ্ঠ-১০ম)">
                      {allClasses.filter(c => c.stage === 'JUNIOR_SECONDARY' || c.stage === 'SECONDARY').map(c => <option key={c.id} value={c.id}>{c.nameBn}</option>)}
                    </optgroup>
                    <optgroup label="🎓 উচ্চ মাধ্যমিক (১১শ-১২শ)">
                      {allClasses.filter(c => c.stage === 'HIGHER_SECONDARY').map(c => <option key={c.id} value={c.id}>{c.nameBn}</option>)}
                    </optgroup>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-900 mb-1">
                    বিষয় (Subject) <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={examForm.subjectId}
                    onChange={(e) => setExamForm({ ...examForm, subjectId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold bg-white"
                  >
                    {examSubjects.map(s => (
                      <option key={s.id} value={s.id}>{s.nameBn} ({s.nameEn})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-900 mb-1">
                    পরীক্ষার ধরণ (Exam Type) <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={examForm.type}
                    onChange={(e) => setExamForm({ ...examForm, type: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold bg-white text-indigo-700"
                  >
                    <option value="MCQ">🎯 বহুনির্বাচনী (MCQ)</option>
                    <option value="WRITTEN">✍️ সৃজনশীল লিখিত (Written)</option>
                  </select>
                </div>
              </div>

              {/* Date, Time, Duration & Marks */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                <div>
                  <label className="block font-bold text-slate-900 mb-1">তারিখ (Date)</label>
                  <input
                    type="date"
                    required
                    value={examForm.examDate}
                    onChange={(e) => setExamForm({ ...examForm, examDate: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-xl border border-slate-300 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-900 mb-1">শুরুর সময়</label>
                  <input
                    type="text"
                    value={examForm.startTime}
                    onChange={(e) => setExamForm({ ...examForm, startTime: e.target.value })}
                    placeholder="10:00 AM"
                    className="w-full px-2.5 py-1.5 rounded-xl border border-slate-300 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-900 mb-1">সময়সীমা (মিনিট)</label>
                  <input
                    type="number"
                    min="5"
                    max="180"
                    value={examForm.durationMinutes}
                    onChange={(e) => setExamForm({ ...examForm, durationMinutes: Number(e.target.value) })}
                    className="w-full px-2.5 py-1.5 rounded-xl border border-slate-300 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-900 mb-1">মোট নম্বর</label>
                  <input
                    type="number"
                    min="1"
                    value={examForm.totalMarks}
                    onChange={(e) => setExamForm({ ...examForm, totalMarks: Number(e.target.value) })}
                    className="w-full px-2.5 py-1.5 rounded-xl border border-slate-300 font-bold text-indigo-700"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-900 mb-1">পাস নম্বর</label>
                  <input
                    type="number"
                    min="1"
                    value={examForm.passMarks}
                    onChange={(e) => setExamForm({ ...examForm, passMarks: Number(e.target.value) })}
                    className="w-full px-2.5 py-1.5 rounded-xl border border-slate-300 font-bold text-emerald-700"
                  />
                </div>
              </div>

              {/* Instructions */}
              <div>
                <label className="block font-bold text-slate-900 mb-1">
                  নির্দেশনাবলী (Instructions)
                </label>
                <textarea
                  rows="2"
                  value={examForm.instructions}
                  onChange={(e) => setExamForm({ ...examForm, instructions: e.target.value })}
                  placeholder="পরীক্ষার্থীদের জন্য বিশেষ নির্দেশনা..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                ></textarea>
              </div>

              {/* Questions Section */}
              {examForm.type === 'MCQ' ? (
                <div className="space-y-3 pt-2 border-t border-slate-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <h4 className="font-bold text-slate-900 flex items-center space-x-1.5 text-xs sm:text-sm">
                      <CheckSquare className="w-4 h-4 text-indigo-600" />
                      <span>বহুনির্বাচনী প্রশ্নমালা ({examForm.questions.length}টি প্রশ্ন)</span>
                    </h4>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setShowStudyMaterialUploadModal(true)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center space-x-1.5 border border-slate-300 transition-all active:scale-95"
                        title="স্টাডি সোর্স ডকুমেন্ট (PDF/Text) আপলোড ও প্রসেস করুন"
                      >
                        <FileText className="w-3.5 h-3.5 text-indigo-600" />
                        <span>📄 সোর্স PDF আপলোড</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setShowAIGeneratorModal(true)}
                        className="px-3.5 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-black rounded-xl flex items-center space-x-1.5 shadow-md shadow-purple-600/30 transition-all active:scale-95 animate-pulse"
                        title="গুগল জেমিনাই এআই দিয়ে স্বয়ংক্রিয়ভাবে প্রশ্ন জেনারেট করুন"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                        <span>🤖 এআই দিয়ে এক ক্লিকে প্রশ্ন তৈরি করুন</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleAddMCQQuestion}
                        className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-xl flex items-center space-x-1 transition-all"
                      >
                        <PlusCircle className="w-3.5 h-3.5" />
                        <span>+ প্রশ্ন যোগ</span>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
                    {examForm.questions.map((q, qIdx) => (
                      <div key={qIdx} className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-indigo-900 text-xs">
                            প্রশ্ন নং {qIdx + 1}
                          </span>
                          <div className="flex items-center space-x-2">
                            <span className="text-[11px] text-slate-500">নম্বর:</span>
                            <input
                              type="number"
                              min="1"
                              value={q.marks || 1}
                              onChange={(e) => handleMCQQuestionChange(qIdx, 'marks', Number(e.target.value))}
                              className="w-12 px-1.5 py-0.5 rounded-lg border border-slate-300 text-center font-bold text-xs"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveMCQQuestion(qIdx)}
                              className="p-1 text-rose-500 hover:bg-rose-100 rounded-lg"
                              title="প্রশ্ন মুছুন"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <input
                          type="text"
                          required
                          value={q.questionBn}
                          onChange={(e) => handleMCQQuestionChange(qIdx, 'questionBn', e.target.value)}
                          placeholder="প্রশ্নের বিবরণ লিখুন..."
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold bg-white"
                        />

                        {/* 4 Options */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {q.options.map((opt, optIdx) => (
                            <div
                              key={optIdx}
                              className={`flex items-center space-x-2 p-2 rounded-xl border ${
                                q.correctOptionIndex === optIdx ? 'bg-emerald-50 border-emerald-300' : 'bg-white border-slate-200'
                              }`}
                            >
                              <input
                                type="radio"
                                name={`correct-${qIdx}`}
                                checked={q.correctOptionIndex === optIdx}
                                onChange={() => handleMCQQuestionChange(qIdx, 'correctOptionIndex', optIdx)}
                                className="accent-emerald-600 w-4 h-4 cursor-pointer"
                                title="সঠিক উত্তর হিসেবে নির্বাচন করুন"
                              />
                              <input
                                type="text"
                                required
                                value={opt}
                                onChange={(e) => handleMCQOptionChange(qIdx, optIdx, e.target.value)}
                                placeholder={`অপশন ${optIdx + 1} (${['ক', 'খ', 'গ', 'ঘ'][optIdx] || optIdx + 1})`}
                                className="flex-1 px-2 py-1 rounded-lg border border-slate-200 text-xs focus:outline-none"
                              />
                            </div>
                          ))}
                        </div>

                        <input
                          type="text"
                          value={q.explanation || ''}
                          onChange={(e) => handleMCQQuestionChange(qIdx, 'explanation', e.target.value)}
                          placeholder="সঠিক উত্তরের ব্যাখ্যা (ঐচ্ছিক)..."
                          className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-[11px] bg-white italic"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* Written Exam Fields */
                <div className="space-y-4 pt-2 border-t border-slate-200">
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 border border-emerald-800/60 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
                    <div>
                      <h5 className="font-black text-xs sm:text-sm text-emerald-300 flex items-center space-x-1.5">
                        <Sparkles className="w-4 h-4 text-amber-300" />
                        <span>📝 এআই সৃজনশীল প্রশ্ন জেনারেটর (AI CQ Engine)</span>
                      </h5>
                      <p className="text-[11px] text-slate-300">
                        এনসিটিবি মানদণ্ডে উদ্দীপক ও (ক, খ, গ, ঘ) প্রশ্ন স্বয়ংক্রিয় তৈরি করুন এবং সরাসরি প্রিন্ট / PDF সেভ করুন।
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => setShowStudyMaterialUploadModal(true)}
                        className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl flex items-center space-x-1.5 border border-slate-700 transition-all active:scale-95"
                        title="স্টাডি সোর্স ডকুমেন্ট (PDF/Text) আপলোড ও প্রসেস করুন"
                      >
                        <FileText className="w-3.5 h-3.5 text-emerald-400" />
                        <span>📄 সোর্স PDF আপলোড</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setShowCQGeneratorModal(true)}
                        className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-xs font-black rounded-xl shadow-lg shadow-emerald-500/30 flex items-center space-x-1.5 transition-all flex-shrink-0 active:scale-95"
                      >
                        <Zap className="w-3.5 h-3.5 text-amber-300" />
                        <span>সৃজনশীল প্রশ্ন জেনারেট করুন</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-900 mb-1">
                      প্রশ্নপত্রের পিডিএফ / ফাইল লিঙ্ক (Question Paper URL)
                    </label>
                    <input
                      type="url"
                      value={examForm.questionFileUrl || ''}
                      onChange={(e) => setExamForm({ ...examForm, questionFileUrl: e.target.value })}
                      placeholder="https://nextgen.edu.bd/downloads/exams/sample-question.pdf"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-xs"
                    />
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-3 flex items-center justify-end space-x-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowExamModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-semibold transition-all"
                >
                  {t('cancel')}
                </button>

                <button
                  type="submit"
                  disabled={savingExam}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md shadow-indigo-600/20 disabled:opacity-50 flex items-center space-x-1.5 transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>{savingExam ? 'সংরক্ষণ হচ্ছে...' : (editingExamId ? 'আপডেট করুন (Update)' : 'সংরক্ষণ করুন (Publish Exam)')}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Submissions & Written Exam Grading Modal */}
      {showSubmissionsModal && selectedExamForSubmissions && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-6 shadow-2xl space-y-4 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-xl bg-indigo-50 text-indigo-700">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    পরীক্ষার সাবমিশন ও মূল্যায়ন কেন্দ্র
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {selectedExamForSubmissions.titleBn} • {selectedExamForSubmissions.class?.nameBn} • মোট সাবমিশন: {currentExamSubmissions.length}টি
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowSubmissionsModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Grading Form Panel */}
            {gradingSubmission && (
              <div className="p-4 bg-purple-50 rounded-2xl border border-purple-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-purple-900 text-xs sm:text-sm flex items-center space-x-1.5">
                    <PenTool className="w-4 h-4 text-purple-600" />
                    <span>খাতা মূল্যায়ন: {gradingSubmission.student?.user?.name} (রোল: {gradingSubmission.student?.rollNo})</span>
                  </h4>
                  <button onClick={() => setGradingSubmission(null)} className="font-bold text-slate-400 hover:text-slate-600">✕</button>
                </div>

                {gradingSubmission.submissionUrl && (
                  <div className="text-xs">
                    <span className="font-semibold text-slate-700">সংযুক্ত উত্তরপত্র ফাইল:</span>{' '}
                    <a href={gradingSubmission.submissionUrl} target="_blank" rel="noreferrer" className="text-indigo-600 font-bold underline">
                      উত্তরপত্র দেখুন / ডাউনলোড করুন
                    </a>
                  </div>
                )}

                {gradingSubmission.submissionText && (
                  <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-700">
                    <span className="font-bold text-slate-900 block mb-1">শিক্ষার্থীর লিখিত উত্তর:</span>
                    {gradingSubmission.submissionText}
                  </div>
                )}

                <form onSubmit={handleSaveGrade} className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end pt-2">
                  <div>
                    <label className="block font-bold text-slate-700 text-xs mb-1">
                      প্রাপ্ত নম্বর (পূর্ণমান {selectedExamForSubmissions.totalMarks}) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      max={selectedExamForSubmissions.totalMarks}
                      required
                      value={gradingForm.obtainedScore}
                      onChange={(e) => setGradingForm({ ...gradingForm, obtainedScore: e.target.value })}
                      placeholder="e.g. 16"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold text-purple-700 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 text-xs mb-1">শিক্ষকের মন্তব্য</label>
                    <input
                      type="text"
                      value={gradingForm.teacherFeedback}
                      onChange={(e) => setGradingForm({ ...gradingForm, teacherFeedback: e.target.value })}
                      placeholder="খুব সুন্দর হয়েছে / আরও অনুশীলন দরকার..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={savingGrade}
                    className="py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-1.5"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{savingGrade ? 'সংরক্ষণ হচ্ছে...' : 'মূল্যায়ন সংরক্ষণ করুন'}</span>
                  </button>
                </form>
              </div>
            )}

            {/* Submissions List Table */}
            <div className="overflow-x-auto border border-slate-100 rounded-2xl">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3">শিক্ষার্থীর নাম ও রোল</th>
                    <th className="p-3">জমা দেওয়ার সময়</th>
                    <th className="p-3 text-center">প্রাপ্ত নম্বর</th>
                    <th className="p-3 text-center">শতকরা হার</th>
                    <th className="p-3 text-center">স্ট্যাটাস</th>
                    <th className="p-3 text-right">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {currentExamSubmissions.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="p-8 text-center text-slate-400">
                        এখনো কোনো শিক্ষার্থী এই পরীক্ষায় অংশ নেয়নি
                      </td>
                    </tr>
                  ) : (
                    currentExamSubmissions.map((sub) => (
                      <tr key={sub.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3">
                          <div className="flex items-center space-x-2">
                            <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-[10px]">
                              {sub.student?.user?.name?.charAt(0) || 'S'}
                            </div>
                            <div>
                              <span className="font-bold text-slate-900 block">{sub.student?.user?.name}</span>
                              <span className="text-[10px] text-slate-500 font-mono">রোল: {sub.student?.rollNo}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-3 text-slate-600 font-mono text-[11px]">
                          {sub.submittedAt ? new Date(sub.submittedAt).toLocaleString('bn-BD') : '-'}
                        </td>
                        <td className="p-3 text-center font-bold text-slate-900">
                          {sub.status === 'GRADED' ? `${sub.obtainedScore} / ${sub.totalScore}` : 'মূল্যায়ন বাকি'}
                        </td>
                        <td className="p-3 text-center font-mono font-bold text-indigo-700">
                          {sub.status === 'GRADED' ? `${sub.percentage}%` : '-'}
                        </td>
                        <td className="p-3 text-center">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            sub.status === 'SUBMITTED'
                              ? 'bg-amber-100 text-amber-800'
                              : sub.passed
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}>
                            {sub.status === 'SUBMITTED' ? 'মূল্যায়ন বাকি' : sub.passed ? 'উত্তীর্ণ (Passed)' : 'অনুত্তীর্ণ (Failed)'}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          {selectedExamForSubmissions.type === 'WRITTEN' ? (
                            <button
                              onClick={() => {
                                setGradingSubmission(sub);
                                setGradingForm({
                                  obtainedScore: sub.obtainedScore || '',
                                  teacherFeedback: sub.teacherFeedback || ''
                                });
                              }}
                              className="px-2.5 py-1 bg-purple-100 hover:bg-purple-200 text-purple-800 rounded-lg font-bold text-[11px] transition-all"
                            >
                              খাতা মূল্যায়ন
                            </button>
                          ) : (
                            <span className="text-[10px] text-emerald-600 font-bold">স্বয়ংক্রিয় মূল্যায়িত</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Student Profile Details Modal */}
      {selectedStudentForDetails && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200 border border-slate-100">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-700">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-lg">শিক্ষার্থী প্রোফাইল বিবরণী</h3>
                  <p className="text-xs text-slate-500">আইডি: {selectedStudentForDetails.studentIdNumber}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedStudentForDetails(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile Hero Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-800 to-teal-950 text-white shadow-lg relative overflow-hidden">
              <div className="flex items-center space-x-4 relative z-10">
                {selectedStudentForDetails.user?.avatar || selectedStudentForDetails.photo ? (
                  <img
                    src={selectedStudentForDetails.user?.avatar || selectedStudentForDetails.photo}
                    alt={selectedStudentForDetails.user?.name}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-white/40 shadow-md"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-white text-emerald-900 flex items-center justify-center font-black text-2xl shadow-md">
                    {selectedStudentForDetails.user?.name?.charAt(0) || 'S'}
                  </div>
                )}
                <div>
                  <h4 className="font-extrabold text-lg text-white">{selectedStudentForDetails.user?.name}</h4>
                  <p className="text-xs text-emerald-200 mt-0.5">
                    {selectedStudentForDetails.class?.nameBn} ({selectedStudentForDetails.section?.nameBn} শাখা) • রোল: {selectedStudentForDetails.rollNo}
                  </p>
                  <span className="inline-block mt-1 text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-500/30 text-emerald-100 border border-emerald-400/30 font-bold">
                    সক্রিয় শিক্ষার্থী (Active Student)
                  </span>
                </div>
              </div>
            </div>

            {/* Profile Key Attributes Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-2xl">
                <span className="text-[11px] font-bold text-emerald-800 block mb-0.5">ভর্তির তারিখ (Admission Date):</span>
                <p className="font-black text-slate-900 text-sm flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-emerald-600" />
                  <span>
                    {selectedStudentForDetails.admissionDate || selectedStudentForDetails.admission_date
                      ? new Date(selectedStudentForDetails.admissionDate || selectedStudentForDetails.admission_date).toLocaleDateString('bn-BD', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })
                      : '০১ জানুয়ারি ২০২৪'}
                  </span>
                </p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl">
                <span className="text-[11px] font-bold text-slate-500 block mb-0.5">জন্ম তারিখ (DOB):</span>
                <p className="font-bold text-slate-800">
                  {selectedStudentForDetails.dob
                    ? new Date(selectedStudentForDetails.dob).toLocaleDateString('bn-BD', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })
                    : '২০১৪-০১-০১'}
                </p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl">
                <span className="text-[11px] font-bold text-slate-500 block mb-0.5">রক্তের গ্রুপ:</span>
                <p className="font-black text-rose-600">{selectedStudentForDetails.bloodGroup || 'B+'}</p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl">
                <span className="text-[11px] font-bold text-slate-500 block mb-0.5">অভিভাবকের নাম:</span>
                <p className="font-bold text-slate-800 truncate">
                  {selectedStudentForDetails.guardians?.[0]?.parent?.name || 'অভিভাবক'}
                </p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl col-span-2">
                <span className="text-[11px] font-bold text-slate-500 block mb-0.5">অভিভাবকের মোবাইল:</span>
                <p className="font-bold text-slate-800 font-mono">
                  {selectedStudentForDetails.guardians?.[0]?.parent?.phone || selectedStudentForDetails.user?.phone || '০১৭০০০০০০০০'}
                </p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl col-span-2">
                <span className="text-[11px] font-bold text-slate-500 block mb-0.5">বর্তমান ঠিকানা:</span>
                <p className="font-medium text-slate-700">{selectedStudentForDetails.address || 'ধানমন্ডি, ঢাকা-১২০৯'}</p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedStudentForDetails(null)}
                className="px-5 py-2 bg-slate-900 text-white rounded-xl font-bold text-xs hover:bg-slate-800 transition-colors"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE FEE INVOICE & DISCOUNT MODAL */}
      {showCreateInvoiceModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200 my-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-100">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">নতুন ফি ও ডিসকাউন্ট নির্ধারণ</h3>
                  <p className="text-xs text-slate-500">শিক্ষার্থী বা সম্পূর্ণ শ্রেণির জন্য ফি ও স্কলারশিপ ছাড় অ্যাসাইন করুন</p>
                </div>
              </div>

              <button
                onClick={() => setShowCreateInvoiceModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {invoiceError && (
              <div className="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{invoiceError}</span>
              </div>
            )}

            {/* Modal Form */}
            <form onSubmit={handleCreateInvoiceSubmit} className="mt-4 space-y-4 text-xs">
              {/* Target Assignment Mode */}
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider text-[11px] mb-1.5">
                  ফি অ্যাসাইনমেন্টের ক্ষেত্র <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setInvoiceForm({ ...invoiceForm, targetMode: 'SINGLE' })}
                    className={`py-2 px-3 rounded-xl border text-center font-bold transition-all ${
                      invoiceForm.targetMode === 'SINGLE'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-800 ring-2 ring-emerald-500/20'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    👤 একক শিক্ষার্থী (Single Student)
                  </button>
                  <button
                    type="button"
                    onClick={() => setInvoiceForm({ ...invoiceForm, targetMode: 'CLASS' })}
                    className={`py-2 px-3 rounded-xl border text-center font-bold transition-all ${
                      invoiceForm.targetMode === 'CLASS'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-800 ring-2 ring-emerald-500/20'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    👥 সম্পূর্ণ শ্রেণি ব্যাচ (Entire Class)
                  </button>
                </div>
              </div>

              {/* Student or Class Dropdown */}
              {invoiceForm.targetMode === 'SINGLE' ? (
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider text-[11px] mb-1.5">
                    শিক্ষার্থী নির্বাচন করুন <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={invoiceForm.studentId}
                    onChange={(e) => setInvoiceForm({ ...invoiceForm, studentId: e.target.value })}
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="">-- শিক্ষার্থী নির্বাচন করুন --</option>
                    {students.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.user?.name || s.name} — {s.class?.nameBn} ({s.section?.nameBn || 'শাখা'}) • রোল: {s.rollNo}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider text-[11px] mb-1.5">
                    শ্রেণি নির্বাচন করুন <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={invoiceForm.classId}
                    onChange={(e) => setInvoiceForm({ ...invoiceForm, classId: e.target.value })}
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    {allClasses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nameBn} ({c.nameEn})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Title & Month */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider text-[11px] mb-1.5">
                    ইনভয়েসের শিরোনাম <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={invoiceForm.titleBn}
                    onChange={(e) => setInvoiceForm({ ...invoiceForm, titleBn: e.target.value })}
                    placeholder="যেমন: মাসিক টিউশন ফি (সেপ্টেম্বর)"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider text-[11px] mb-1.5">
                    মাস ও বছর
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={invoiceForm.month}
                      onChange={(e) => setInvoiceForm({ ...invoiceForm, month: e.target.value })}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    >
                      {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                    <input
                      type="number"
                      value={invoiceForm.year}
                      onChange={(e) => setInvoiceForm({ ...invoiceForm, year: e.target.value })}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Base Fee Amount */}
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider text-[11px] mb-1.5">
                  মূল ফি (Base Tuition / Exam Fee - BDT ৳) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-400">৳</span>
                  <input
                    type="number"
                    min="0"
                    required
                    value={invoiceForm.baseAmount}
                    onChange={(e) => setInvoiceForm({ ...invoiceForm, baseAmount: e.target.value })}
                    placeholder="3500"
                    className="w-full pl-8 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Discount / Waiver Options */}
              <div className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>ডিসকাউন্ট / ছাড় ও স্কলারশিপ নির্ধারণ</span>
                  </span>
                  <span className="text-[10px] text-emerald-700 font-semibold">ঐচ্ছিক (Optional)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 text-[11px] mb-1">ছাড়ের ধরণ (Type)</label>
                    <select
                      value={invoiceForm.discountType}
                      onChange={(e) => setInvoiceForm({ ...invoiceForm, discountType: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    >
                      <option value="NONE">কোনো ছাড় নেই (0%)</option>
                      <option value="FLAT">নির্দিষ্ট পরিমাণ টাকা (Flat Amount ৳)</option>
                      <option value="PERCENTAGE">শতাংশের হার (Percentage %)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 text-[11px] mb-1">
                      {invoiceForm.discountType === 'PERCENTAGE' ? 'ছাড়ের হার (%)' : 'ছাড়ের পরিমাণ (৳)'}
                    </label>
                    <input
                      type="number"
                      min="0"
                      max={invoiceForm.discountType === 'PERCENTAGE' ? 100 : undefined}
                      disabled={invoiceForm.discountType === 'NONE'}
                      value={invoiceForm.discountValue}
                      onChange={(e) => setInvoiceForm({ ...invoiceForm, discountValue: e.target.value })}
                      placeholder={invoiceForm.discountType === 'PERCENTAGE' ? '20' : '500'}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-800 disabled:bg-slate-100 disabled:text-slate-400 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                {invoiceForm.discountType !== 'NONE' && (
                  <div>
                    <label className="block font-bold text-slate-700 text-[11px] mb-1">
                      ছাড়ের কারণ বা ক্যাটাগরি (Reason / Category)
                    </label>
                    <select
                      value={invoiceForm.discountReason}
                      onChange={(e) => setInvoiceForm({ ...invoiceForm, discountReason: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    >
                      <option value="MERIT_SCHOLARSHIP">🏆 ১ম স্থান / মেধাবৃত্তি (Merit Scholarship)</option>
                      <option value="SIBLING_DISCOUNT">👨‍👩‍👧‍👦 সহোদর / ভাই-বোন ছাড় (Sibling Discount)</option>
                      <option value="SPECIAL_WAIVER">⭐ বিশেষ বিবেচনা (Special Waiver)</option>
                      <option value="POVERTY_AID">🤝 দরিদ্র ও অসচ্ছল তহবিল (Financial Aid)</option>
                      <option value="STAFF_CHILD">🏫 শিক্ষক / স্টাফ সন্তান (Staff Ward)</option>
                      <option value="OTHER">📝 অন্যান্য বিশেষ কারণ (Other)</option>
                    </select>
                  </div>
                )}
              </div>

              {/* LIVE COMPUTATION BREAKDOWN PREVIEW */}
              {(() => {
                const base = Number(invoiceForm.baseAmount) || 0;
                let discAmt = 0;
                if (invoiceForm.discountType === 'PERCENTAGE') {
                  discAmt = Math.round((base * (Number(invoiceForm.discountValue) || 0)) / 100);
                } else if (invoiceForm.discountType === 'FLAT') {
                  discAmt = Math.min(Number(invoiceForm.discountValue) || 0, base);
                }
                const net = Math.max(0, base - discAmt);

                return (
                  <div className="p-3.5 bg-slate-900 text-white rounded-2xl space-y-1.5 shadow-md">
                    <div className="flex items-center justify-between text-[11px] text-slate-300">
                      <span>মূল ফি (Base Fee):</span>
                      <span className="font-mono">৳ {base.toLocaleString('en-BD')}</span>
                    </div>

                    {discAmt > 0 && (
                      <div className="flex items-center justify-between text-[11px] text-emerald-400 font-bold">
                        <span>কর্তনকৃত ছাড় ({invoiceForm.discountType === 'PERCENTAGE' ? `${invoiceForm.discountValue}%` : 'ফ্ল্যাট'}):</span>
                        <span className="font-mono">- ৳ {discAmt.toLocaleString('en-BD')}</span>
                      </div>
                    )}

                    <div className="pt-1.5 border-t border-slate-700 flex items-center justify-between">
                      <span className="font-extrabold text-xs text-slate-100">মোট প্রদেয় ফি (Payable Amount):</span>
                      <span className="text-base font-black text-emerald-400 font-mono">৳ {net.toLocaleString('en-BD')}</span>
                    </div>
                  </div>
                );
              })()}

              {/* Due Date */}
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider text-[11px] mb-1.5">
                  জমার শেষ তারিখ (Due Date) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={invoiceForm.dueDate}
                  onChange={(e) => setInvoiceForm({ ...invoiceForm, dueDate: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              {/* Modal Footer Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCreateInvoiceModal(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  disabled={savingInvoice}
                  className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl font-bold shadow-md shadow-emerald-600/20 transition-all flex items-center space-x-1.5"
                >
                  {savingInvoice ? (
                    <span>প্রক্রিয়াধীন...</span>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>ফি ও ইনভয়েস তৈরি করুন</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Student 360 Comprehensive Profile Modal */}
      {selectedStudentFor360 && (
        <Student360Modal
          studentId={selectedStudentFor360}
          onClose={() => setSelectedStudentFor360(null)}
        />
      )}

      {/* Dynamic Executive Summary Report Printable Modal */}
      {showExecutiveModal && (
        <ExecutiveSummaryModal
          analyticsData={analyticsData}
          onClose={() => setShowExecutiveModal(false)}
        />
      )}

      {/* Lazy Modals Wrapped in Suspense */}
      <Suspense fallback={null}>
        {/* Offline Cash Payment Modal */}
        <OfflineCashPaymentModal
          isOpen={showCashPaymentModal}
          onClose={() => setShowCashPaymentModal(false)}
          onPaymentSuccess={(receipt) => {
            setShowCashPaymentModal(false);
            setCurrentReceiptData(receipt);
            fetchStats();
          }}
        />

        {/* Money Receipt Printable Slip Modal */}
        <MoneyReceiptModal
          receipt={currentReceiptData}
          isOpen={!!currentReceiptData}
          onClose={() => setCurrentReceiptData(null)}
        />

        {/* AI MCQ Automated Question Generator Modal */}
        {showAIGeneratorModal && (
          <AIMCQGeneratorModal
            isOpen={showAIGeneratorModal}
            onClose={() => setShowAIGeneratorModal(false)}
            allClasses={allClasses}
            onQuestionsImported={({ questions, topic: generatedTopic, totalMarks }) => {
              setExamForm(prev => ({
                ...prev,
                titleBn: prev.titleBn || generatedTopic || 'মডেল টেস্ট পরীক্ষা',
                questions,
                totalMarks: totalMarks || questions.length,
                passMarks: Math.round((totalMarks || questions.length) * 0.4)
              }));
              setShowAIGeneratorModal(false);
            }}
          />
        )}

        {/* AI CQ Automated Creative Question Generator Modal */}
        {showCQGeneratorModal && (
          <AICQGeneratorModal
            isOpen={showCQGeneratorModal}
            onClose={() => setShowCQGeneratorModal(false)}
            allClasses={allClasses}
            onQuestionsImported={({ cqs, subject: cqSub, classGrade: cqCls, chapterTopic: cqTopic, totalMarks }) => {
              setExamForm(prev => ({
                ...prev,
                titleBn: prev.titleBn || `${cqTopic || 'সৃজনশীল'} মডেল টেস্ট`,
                type: 'WRITTEN',
                totalMarks: totalMarks || cqs.length * 10,
                passMarks: Math.round((totalMarks || cqs.length * 10) * 0.4)
              }));
              setShowCQGeneratorModal(false);
            }}
          />
        )}

        {/* Admin Study Material & Source-Context AI Document Uploader Modal */}
        {showStudyMaterialUploadModal && (
          <AdminStudyMaterialUploadModal
            isOpen={showStudyMaterialUploadModal}
            onClose={() => setShowStudyMaterialUploadModal(false)}
          />
        )}
      </Suspense>


      {/* Floating Quick-Actions Command Floater */}
      <AdminQuickFloater
        onOpenStudentModal={() => setShowAddStudentModal(true)}
        onOpenNoticeModal={() => setShowCreateNoticeModal(true)}
        onOpenCashModal={() => setShowCashPaymentModal(true)}
        onNavigate={(tab) => setActiveTab(tab)}
      />
    </div>
  );
}
