import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { teacherAPI, homeworkAPI, curriculumAPI, materialAPI, textbookAPI, teacherAttendanceAPI, examAPI } from '../services/api';
import LiveClassManager from '../components/liveclass/LiveClassManager';
import LiveClassNotificationBanner from '../components/liveclass/LiveClassNotificationBanner';
import Student360Modal from '../components/common/Student360Modal';
import TeacherProfileSettings from '../components/teacher/TeacherProfileSettings';
import WeeklyRoutineGrid from '../components/common/WeeklyRoutineGrid';
import ResultsManager from '../components/admin/ResultsManager';
import UniversalFileUploader from '../components/common/UniversalFileUploader';
import AIMCQGeneratorModal from '../components/common/AIMCQGeneratorModal';
import AICQGeneratorModal from '../components/common/AICQGeneratorModal';
import AdminStudyMaterialUploadModal, { formatAcademicBadge } from '../components/admin/AdminStudyMaterialUploadModal';
import MediaCenter from '../components/media/MediaCenter';
import {
  BookOpen,
  CalendarCheck,
  Award,
  Users,
  CheckCircle2,
  AlertCircle,
  Save,
  Clock,
  Sparkles,
  ClipboardList,
  PlusCircle,
  Send,
  FileText,
  Calendar,
  Layers,
  GraduationCap,
  BookMarked,
  Download,
  Trash2,
  Edit,
  ExternalLink,
  Search,
  Camera,
  Image as ImageIcon,
  X,
  Maximize2,
  MessageSquare,
  Smartphone,
  SendHorizontal,
  Timer,
  LogIn,
  LogOut,
  TrendingUp,
  HelpCircle,
  CheckSquare,
  Zap,
  PenTool
} from 'lucide-react';

export default function TeacherDashboard({ activeTab = 'attendance' }) {
  const { t, lang } = useLanguage();
  const { user } = useAuth();

  // Faculty Attendance (Punch In / Out)
  const [myAttendanceData, setMyAttendanceData] = useState(null);
  const [punchingIn, setPunchingIn] = useState(false);
  const [punchingOut, setPunchingOut] = useState(false);
  const [currentTimeTicker, setCurrentTimeTicker] = useState(
    new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })
  );

  // Curriculum State
  const [allClasses, setAllClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState('11'); // Class 8 default
  const [selectedSectionId, setSelectedSectionId] = useState('31'); // Padma default
  const [classSubjects, setClassSubjects] = useState([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState('');

  // Student Directory & 360 Profile State
  const [studentList, setStudentList] = useState([]);
  const [studentSearch, setStudentSearch] = useState('');
  const [selectedStudentFor360, setSelectedStudentFor360] = useState(null);

  // Attendance & Marks & SMS
  const [attendanceDate, setAttendanceDate] = useState('2026-08-20');
  const [attendanceSheet, setAttendanceSheet] = useState([]);
  const [marksSheet, setMarksSheet] = useState([]);
  const [selectedTermId, setSelectedTermId] = useState('1'); // 1st Term
  const [autoSendAbsentSms, setAutoSendAbsentSms] = useState(true);
  const [sendingSMS, setSendingSMS] = useState(false);
  const [showSMSModal, setShowSMSModal] = useState(false);

  // Homework State
  const [homeworkList, setHomeworkList] = useState([]);
  const [showHomeworkModal, setShowHomeworkModal] = useState(false);
  const [modalSubjects, setModalSubjects] = useState([]);
  const [previewImageModal, setPreviewImageModal] = useState(null);
  const [homeworkForm, setHomeworkForm] = useState({
    classId: '11',
    sectionId: '31',
    subjectId: '',
    topicBn: '',
    topicEn: '',
    descriptionBn: '',
    descriptionEn: '',
    assignedDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    attachmentNote: '',
    attachmentImage: null
  });

  // Study Materials State
  const [materialsList, setMaterialsList] = useState([]);
  const [showMaterialModal, setShowMaterialModal] = useState(false);
  const [editingMaterialId, setEditingMaterialId] = useState(null);
  const [materialForm, setMaterialForm] = useState({
    classId: '11',
    subjectId: '',
    titleBn: '',
    titleEn: '',
    chapterBn: '',
    chapterEn: '',
    descriptionBn: '',
    descriptionEn: '',
    fileType: 'PDF',
    fileUrl: 'https://nextgen.edu.bd/downloads/materials/sample-lecture-note.pdf',
    fileSize: '2.5 MB'
  });

  // Textbooks State
  const [textbooksList, setTextbooksList] = useState([]);
  const [showTextbookModal, setShowTextbookModal] = useState(false);
  const [editingTextbookId, setEditingTextbookId] = useState(null);
  const [readingTextbook, setReadingTextbook] = useState(null);
  const [textbookSearch, setTextbookSearch] = useState('');
  const [textbookForm, setTextbookForm] = useState({
    classId: '11',
    subjectId: '',
    titleBn: '',
    titleEn: '',
    edition: 'NCTB ২০২৬ শিক্ষাবর্ষের নতুন সংস্করণ',
    author: 'জাতীয় শিক্ষাক্রম ও পাঠ্যপুস্তক বোর্ড (NCTB)',
    fileUrl: 'https://nctb.gov.bd/textbooks/sample-nctb-2026.pdf',
    fileSize: '15.4 MB',
    totalPages: 160,
    description: '',
    coverImage: null
  });

  // Online Exams State (Teacher Management)
  const [examsList, setExamsList] = useState([]);
  const [showExamModal, setShowExamModal] = useState(false);
  const [editingExamId, setEditingExamId] = useState(null);
  const [examSearch, setExamSearch] = useState('');
  const [selectedExamType, setSelectedExamType] = useState('ALL');
  const [showSubmissionsModal, setShowSubmissionsModal] = useState(false);
  const [showAIGeneratorModal, setShowAIGeneratorModal] = useState(false);
  const [showCQGeneratorModal, setShowCQGeneratorModal] = useState(false);
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
    startTime: '11:00 AM',
    durationMinutes: 15,
    totalMarks: 5,
    passMarks: 2,
    instructions: 'সকল প্রশ্নের উত্তর দেওয়ার চেষ্টা করো। সময়সীমা ১৫ মিনিট।',
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

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // 1. Fetch initial classes & curriculum
  useEffect(() => {
    fetchCurriculumData();
  }, []);

  const fetchCurriculumData = async () => {
    try {
      const res = await curriculumAPI.getClasses();
      if (res.success && res.data) {
        setAllClasses(res.data);
      }
    } catch (err) {
      console.error('Failed to load curriculum classes:', err);
    }
  };

  // 2. When selectedClassId changes, fetch subjects for this class
  useEffect(() => {
    if (selectedClassId) {
      loadSubjectsForClass(selectedClassId);
    }
  }, [selectedClassId]);

  const loadSubjectsForClass = async (classId) => {
    try {
      const res = await curriculumAPI.getSubjects(classId);
      if (res.success && res.data) {
        setClassSubjects(res.data);
        if (res.data.length > 0 && (!selectedSubjectId || !res.data.some(s => s.id === Number(selectedSubjectId)))) {
          setSelectedSubjectId(String(res.data[0].id));
        }
      }
    } catch (err) {
      console.error('Failed to load subjects:', err);
    }
  };

  // 3. Modal Subjects synchronization - lazy fetch only when modal is active
  useEffect(() => {
    if (showHomeworkModal && homeworkForm.classId) {
      curriculumAPI.getSubjects(homeworkForm.classId).then(res => {
        if (res.success && res.data) {
          setModalSubjects(res.data);
          if (res.data.length > 0 && !homeworkForm.subjectId) {
            setHomeworkForm(prev => ({ ...prev, subjectId: String(res.data[0].id) }));
          }
        }
      });
    }
  }, [showHomeworkModal, homeworkForm.classId]);

  useEffect(() => {
    if (showMaterialModal && materialForm.classId) {
      curriculumAPI.getSubjects(materialForm.classId).then(res => {
        if (res.success && res.data) {
          setModalSubjects(res.data);
          if (res.data.length > 0 && !materialForm.subjectId) {
            setMaterialForm(prev => ({ ...prev, subjectId: String(res.data[0].id) }));
          }
        }
      });
    }
  }, [showMaterialModal, materialForm.classId]);

  useEffect(() => {
    if (showTextbookModal && textbookForm.classId) {
      curriculumAPI.getSubjects(textbookForm.classId).then(res => {
        if (res.success && res.data) {
          setModalSubjects(res.data);
          if (res.data.length > 0 && !textbookForm.subjectId) {
            setTextbookForm(prev => ({ ...prev, subjectId: String(res.data[0].id) }));
          }
        }
      });
    }
  }, [showTextbookModal, textbookForm.classId]);

  // Live ticking clock for punch in/out
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTimeTicker(
        new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const loadMyAttendance = async () => {
    try {
      const res = await teacherAttendanceAPI.getMyAttendance();
      if (res.success && res.data) {
        setMyAttendanceData(res.data);
      }
    } catch (err) {
      console.error('Failed to load my attendance:', err);
    }
  };

  const handlePunchIn = async () => {
    setPunchingIn(true);
    try {
      const res = await teacherAttendanceAPI.punchIn();
      if (res.success) {
        setFeedback({ type: 'success', msg: res.message || 'চেক-ইন সফল হয়েছে!' });
        loadMyAttendance();
      }
    } catch (err) {
      alert(err.message || 'চেক-ইনে ত্রুটি হয়েছে');
    } finally {
      setPunchingIn(false);
    }
  };

  const handlePunchOut = async () => {
    setPunchingOut(true);
    try {
      const res = await teacherAttendanceAPI.punchOut();
      if (res.success) {
        setFeedback({ type: 'success', msg: res.message || 'চেক-আউট সফল হয়েছে!' });
        loadMyAttendance();
      }
    } catch (err) {
      alert(err.message || 'চেক-আউটে ত্রুটি হয়েছে');
    } finally {
      setPunchingOut(false);
    }
  };

  // 4. Load data based on activeTab
  useEffect(() => {
    if (activeTab === 'my-attendance' || activeTab === 'dashboard') {
      loadMyAttendance();
    }
    if (activeTab === 'attendance') {
      loadAttendance();
    } else if (activeTab === 'marks' && selectedSubjectId) {
      loadMarks();
    } else if (activeTab === 'students') {
      loadStudents();
    } else if (activeTab === 'homework') {
      loadHomework();
    } else if (activeTab === 'materials') {
      loadMaterials();
    } else if (activeTab === 'textbooks') {
      loadTextbooks();
    } else if (activeTab === 'exams') {
      loadExams();
    }
  }, [activeTab, selectedClassId, selectedSectionId, attendanceDate, selectedSubjectId, selectedTermId]);

  const loadStudents = async () => {
    setLoading(true);
    try {
      const res = await teacherAPI.getStudents(selectedClassId, selectedSectionId);
      if (res.success && res.data) {
        setStudentList(res.data);
      }
    } catch (err) {
      console.error('Failed to load students list:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadAttendance = async () => {
    setLoading(true);
    try {
      const res = await teacherAPI.getAttendance(attendanceDate, selectedClassId, selectedSectionId);
      if (res.success && res.data?.sheet) {
        setAttendanceSheet(res.data.sheet);
      }
    } catch (err) {
      console.error('Failed to load attendance sheet:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadMarks = async () => {
    if (!selectedSubjectId) return;
    setLoading(true);
    try {
      const res = await teacherAPI.getMarks(selectedClassId, selectedSubjectId, selectedTermId);
      if (res.success && res.data) {
        setMarksSheet(res.data);
      }
    } catch (err) {
      console.error('Failed to load marks sheet:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadHomework = async () => {
    setLoading(true);
    try {
      const res = await homeworkAPI.getHomework({ classId: selectedClassId, sectionId: selectedSectionId });
      if (res.success && res.data) {
        setHomeworkList(res.data);
      }
    } catch (err) {
      console.error('Failed to load homework list:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadMaterials = async () => {
    setLoading(true);
    try {
      const res = await materialAPI.getMaterials({ classId: selectedClassId });
      if (res.success && res.data) {
        setMaterialsList(res.data);
      }
    } catch (err) {
      console.error('Failed to load materials:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadTextbooks = async () => {
    setLoading(true);
    try {
      const res = await textbookAPI.getTextbooks({ classId: selectedClassId });
      if (res.success && res.data) {
        setTextbooksList(res.data);
      }
    } catch (err) {
      console.error('Failed to load textbooks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (studentId, newStatus) => {
    setAttendanceSheet(prev =>
      prev.map(item =>
        item.studentId === studentId ? { ...item, status: newStatus } : item
      )
    );
  };

  const handleMarkAllPresent = () => {
    setAttendanceSheet(prev => prev.map(item => ({ ...item, status: 'PRESENT' })));
  };

  const handleSaveAttendance = async () => {
    setSaving(true);
    setFeedback(null);
    try {
      const records = attendanceSheet.map(item => ({
        studentId: item.studentId,
        status: item.status,
        remarks: item.remarks
      }));

      const res = await teacherAPI.saveAttendance(attendanceDate, records, autoSendAbsentSms);
      if (res.success) {
        const absentCount = attendanceSheet.filter(s => s.status === 'ABSENT').length;
        let successMsg = 'উপস্থিতি সফলভাবে ডাটাবেজে সংরক্ষিত ও অডিট লগে রেকর্ড হয়েছে!';
        if (autoSendAbsentSms && absentCount > 0) {
          successMsg += ` এবং ${absentCount} জন অনুপস্থিত শিক্ষার্থীর অভিভাবকের নম্বরে SMS সফলভাবে পাঠানো হয়েছে।`;
        }
        setFeedback({
          type: 'success',
          msg: successMsg
        });
      }
    } catch (err) {
      setFeedback({ type: 'error', msg: err.message || 'Failed to save attendance' });
    } finally {
      setSaving(false);
    }
  };

  const handleSendAbsentSMSManual = async () => {
    const absentStudents = attendanceSheet.filter(s => s.status === 'ABSENT');
    if (absentStudents.length === 0) {
      alert('বর্তমানে কোনো শিক্ষার্থী অনুপস্থিত (Absent) মার্ক করা নেই!');
      return;
    }
    setSendingSMS(true);
    try {
      const res = await teacherAPI.sendAbsentSMS({
        date: attendanceDate,
        classId: selectedClassId,
        sectionId: selectedSectionId,
        studentIds: absentStudents.map(s => s.studentId)
      });
      if (res.success) {
        setShowSMSModal(false);
        setFeedback({
          type: 'success',
          msg: `অভিভাবকের নম্বরে SMS সফলভাবে পাঠানো হয়েছে (${res.data?.sentCount || absentStudents.length} জন অভিভাবক)!`
        });
      }
    } catch (err) {
      alert(err.message || 'SMS sending failed');
    } finally {
      setSendingSMS(false);
    }
  };

  const handleMarksChange = (studentId, value) => {
    const num = Math.min(100, Math.max(0, Number(value) || 0));
    let letter = 'F';
    let gpa = 0.0;
    if (num >= 80) { letter = 'A+'; gpa = 5.0; }
    else if (num >= 70) { letter = 'A'; gpa = 4.0; }
    else if (num >= 60) { letter = 'A-'; gpa = 3.5; }
    else if (num >= 50) { letter = 'B'; gpa = 3.0; }
    else if (num >= 40) { letter = 'C'; gpa = 2.0; }
    else if (num >= 33) { letter = 'D'; gpa = 1.0; }

    setMarksSheet(prev =>
      prev.map(item =>
        item.studentId === studentId
          ? { ...item, obtainedMarks: num, letterGrade: letter, gradePoint: gpa }
          : item
      )
    );
  };

  const handleSaveSingleMark = async (student) => {
    try {
      const res = await teacherAPI.saveMarks({
        studentId: student.studentId,
        examTermId: selectedTermId,
        subjectId: selectedSubjectId,
        obtainedMarks: student.obtainedMarks,
        teacherRemarks: student.teacherRemarks
      });
      if (res.success) {
        alert(`রোল ${student.rollNo} এর নম্বর সংরক্ষিত হয়েছে! / Marks saved for Roll ${student.rollNo}!`);
      }
    } catch (err) {
      alert(err.message || 'Marks save failed');
    }
  };

  // Image Upload Handler
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('দয়া করে একটি ছবি ফাইল নির্বাচন করুন (JPG, PNG, WebP)');
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      alert('ফাইলের আকার সর্বোচ্চ 8MB হতে পারবে');
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      setHomeworkForm(prev => ({
        ...prev,
        attachmentImage: uploadEvent.target.result
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setHomeworkForm(prev => ({
      ...prev,
      attachmentImage: null
    }));
  };

  const handlePostHomework = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await homeworkAPI.postHomework(homeworkForm);
      if (res.success) {
        setShowHomeworkModal(false);
        setFeedback({
          type: 'success',
          msg: 'বাড়ির কাজ সফলভাবে শিক্ষার্থীদের জন্য পোস্ট করা হয়েছে! / Homework posted successfully!'
        });
        setHomeworkForm({
          classId: selectedClassId,
          sectionId: selectedSectionId,
          subjectId: classSubjects[0]?.id ? String(classSubjects[0].id) : '',
          topicBn: '',
          topicEn: '',
          descriptionBn: '',
          descriptionEn: '',
          assignedDate: new Date().toISOString().split('T')[0],
          dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          attachmentNote: '',
          attachmentImage: null
        });
        loadHomework();
      }
    } catch (err) {
      alert(err.message || 'Homework post failed');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveMaterial = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingMaterialId) {
        await materialAPI.updateMaterial(editingMaterialId, materialForm);
        setFeedback({ type: 'success', msg: 'লেকচার নোট সফলভাবে হালনাগাদ করা হয়েছে! / Note updated successfully!' });
      } else {
        await materialAPI.postMaterial(materialForm);
        setFeedback({ type: 'success', msg: 'নতুন স্টাডি মেটেরিয়াল ও লেকচার নোট প্রকাশিত হয়েছে! / Note uploaded successfully!' });
      }
      setShowMaterialModal(false);
      setEditingMaterialId(null);
      loadMaterials();
    } catch (err) {
      alert(err.message || 'Failed to save material');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteMaterial = async (id) => {
    if (!window.confirm('আপনি কি নিশ্চিতভাবে এই লেকচার নোটটি মুছে ফেলতে চান? / Delete this material?')) return;
    try {
      await materialAPI.deleteMaterial(id);
      setFeedback({ type: 'success', msg: 'নোটটি সফলভাবে মুছে ফেলা হয়েছে! / Note deleted!' });
      loadMaterials();
    } catch (err) {
      alert(err.message || 'Failed to delete material');
    }
  };

  // Textbook Handlers
  const handleOpenAddTextbook = () => {
    setEditingTextbookId(null);
    setTextbookForm({
      classId: selectedClassId,
      subjectId: classSubjects[0] ? String(classSubjects[0].id) : '',
      titleBn: '',
      titleEn: '',
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

  const handleOpenEditTextbook = (tb) => {
    setEditingTextbookId(tb.id);
    setTextbookForm({
      classId: String(tb.classId),
      subjectId: String(tb.subjectId),
      titleBn: tb.titleBn || '',
      titleEn: tb.titleEn || '',
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

  const handleCoverImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('দয়া করে একটি ছবি ফাইল নির্বাচন করুন');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      setTextbookForm(prev => ({ ...prev, coverImage: ev.target.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveCoverImage = () => {
    setTextbookForm(prev => ({ ...prev, coverImage: null }));
  };

  const handleSaveTextbook = async (e) => {
    e.preventDefault();
    if (!textbookForm.titleBn || !textbookForm.classId || !textbookForm.subjectId) {
      alert('বইয়ের নাম, শ্রেণি ও বিষয় আবশ্যক');
      return;
    }
    setSaving(true);
    try {
      if (editingTextbookId) {
        await textbookAPI.updateTextbook(editingTextbookId, textbookForm);
        setFeedback({ type: 'success', msg: `পাঠ্যবই "${textbookForm.titleBn}" আপডেট করা হয়েছে!` });
      } else {
        await textbookAPI.createTextbook(textbookForm);
        setFeedback({ type: 'success', msg: `নতুন পাঠ্যবই "${textbookForm.titleBn}" লাইব্রেরিতে যুক্ত করা হয়েছে!` });
      }
      setShowTextbookModal(false);
      setEditingTextbookId(null);
      loadTextbooks();
    } catch (err) {
      alert(err.message || 'বই সংরক্ষণে সমস্যা হয়েছে');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTextbook = async (id, title) => {
    if (!window.confirm(`আপনি কি নিশ্চিত যে পাঠ্যবই "${title}" মুছে ফেলতে চান?`)) return;
    try {
      await textbookAPI.deleteTextbook(id);
      setFeedback({ type: 'success', msg: `পাঠ্যবই "${title}" মুছে ফেলা হয়েছে!` });
      loadTextbooks();
    } catch (err) {
      alert(err.message || 'বই মুছতে সমস্যা হয়েছে');
    }
  };

  // --- ONLINE EXAMS METHODS ---
  const loadExams = async () => {
    try {
      const res = await examAPI.getExams({ classId: selectedClassId });
      if (res.success) {
        setExamsList(res.data || []);
      }
    } catch (err) {
      console.error('Failed to load exams:', err);
    }
  };

  const handleOpenCreateExam = () => {
    setEditingExamId(null);
    setExamForm({
      titleBn: '',
      titleEn: '',
      classId: selectedClassId || '11',
      subjectId: classSubjects[0] ? String(classSubjects[0].id) : '',
      type: 'MCQ',
      examDate: new Date().toISOString().split('T')[0],
      startTime: '11:00 AM',
      durationMinutes: 15,
      totalMarks: 5,
      passMarks: 2,
      instructions: 'সকল প্রশ্নের উত্তর দেওয়ার চেষ্টা করো। সময়সীমা ১৫ মিনিট।',
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

    setSaving(true);
    try {
      if (editingExamId) {
        await examAPI.updateExam(editingExamId, examForm);
        setFeedback({ type: 'success', msg: `পরীক্ষা "${examForm.titleBn}" সফলভাবে আপডেট করা হয়েছে!` });
      } else {
        await examAPI.createExam(examForm);
        setFeedback({ type: 'success', msg: `নতুন অনলাইন পরীক্ষা "${examForm.titleBn}" সফলভাবে প্রকাশিত হয়েছে!` });
      }
      setShowExamModal(false);
      setEditingExamId(null);
      loadExams();
    } catch (err) {
      alert(err.message || 'পরীক্ষা সংরক্ষণে সমস্যা হয়েছে');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteExam = async (id, title) => {
    if (!window.confirm(`আপনি কি নিশ্চিত যে "${title}" পরীক্ষাটি মুছে ফেলতে চান?`)) return;
    try {
      await examAPI.deleteExam(id);
      setFeedback({ type: 'success', msg: `পরীক্ষা "${title}" সফলভাবে মুছে ফেলা হয়েছে` });
      loadExams();
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
        setFeedback({ type: 'success', msg: 'লিখিত উত্তরপত্রের মূল্যায়ন সফলভাবে সংরক্ষিত হয়েছে!' });
        const freshSubs = await examAPI.getSubmissions(selectedExamForSubmissions.id);
        if (freshSubs.success) setCurrentExamSubmissions(freshSubs.data);
        setGradingSubmission(null);
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
      (ex.subject?.nameBn && ex.subject.nameBn.toLowerCase().includes(q));
    const matchesType = selectedExamType === 'ALL' || ex.type === selectedExamType;
    return matchesSearch && matchesType;
  });

  const filteredTextbooks = textbooksList.filter(tb => {
    const q = textbookSearch.toLowerCase();
    return (
      (tb.titleBn || '').toLowerCase().includes(q) ||
      (tb.titleEn || '').toLowerCase().includes(q) ||
      (tb.edition || '').toLowerCase().includes(q) ||
      (tb.subject?.nameBn || '').toLowerCase().includes(q)
    );
  });

  // Grouping classes by stage for clean dropdown display
  const prePrimaryClasses = allClasses.filter(c => c.stage === 'PRE_PRIMARY');
  const primaryClasses = allClasses.filter(c => c.stage === 'PRIMARY');
  const secondaryClasses = allClasses.filter(c => c.stage === 'JUNIOR_SECONDARY' || c.stage === 'SECONDARY');
  const collegeClasses = allClasses.filter(c => c.stage === 'HIGHER_SECONDARY');

  const currentClassObj = allClasses.find(c => c.id === Number(selectedClassId));
  const currentSections = currentClassObj?.sections || [];

  return (
    <div className="space-y-6">
      {/* Top Teacher Overview strictly for root dashboard */}
      {activeTab === 'dashboard' && (
        <>
      {/* Teacher Profile Header */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-2 border border-blue-500/30">
            <BookOpen className="w-3.5 h-3.5" />
            <span>{t('teacherTitle')}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold">{user?.name}</h2>
          <p className="text-xs text-slate-300 mt-1">
            জাতীয় শিক্ষাক্রম (প্রি-প্রাইমারি থেকে দ্বাদশ শ্রেণি / HSC) বিষয়ভিত্তিক ম্যানেজমেন্ট
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Universal Class Selector */}
          <div className="bg-white/10 p-2 rounded-2xl backdrop-blur-md border border-white/15">
            <span className="text-[10px] text-blue-200 block uppercase font-bold mb-1">শ্রেণি নির্বাচন</span>
            <select
              value={selectedClassId}
              onChange={(e) => {
                const newCid = e.target.value;
                setSelectedClassId(newCid);
                const targetCls = allClasses.find(c => c.id === Number(newCid));
                if (targetCls?.sections?.length > 0) {
                  setSelectedSectionId(String(targetCls.sections[0].id));
                }
              }}
              className="bg-slate-900 text-white font-bold text-xs py-1.5 px-3 rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            >
              <optgroup label="👶 প্রি-প্রাইমারি (Pre-Primary)">
                {prePrimaryClasses.map(c => <option key={c.id} value={c.id}>{c.nameBn}</option>)}
              </optgroup>
              <optgroup label="🎒 প্রাথমিক (Primary 1-5)">
                {primaryClasses.map(c => <option key={c.id} value={c.id}>{c.nameBn}</option>)}
              </optgroup>
              <optgroup label="📚 মাধ্যমিক (Secondary 6-10)">
                {secondaryClasses.map(c => <option key={c.id} value={c.id}>{c.nameBn}</option>)}
              </optgroup>
              <optgroup label="🎓 উচ্চ মাধ্যমিক (HSC 11-12)">
                {collegeClasses.map(c => <option key={c.id} value={c.id}>{c.nameBn}</option>)}
              </optgroup>
            </select>
          </div>

          {activeTab === 'materials' ? (
            <button
              onClick={() => {
                setEditingMaterialId(null);
                setMaterialForm({
                  classId: selectedClassId,
                  subjectId: classSubjects[0]?.id ? String(classSubjects[0].id) : '',
                  titleBn: '',
                  titleEn: '',
                  chapterBn: '',
                  chapterEn: '',
                  descriptionBn: '',
                  descriptionEn: '',
                  fileType: 'PDF',
                  fileUrl: 'https://nextgen.edu.bd/downloads/materials/lecture-note.pdf',
                  fileSize: '2.5 MB'
                });
                setShowMaterialModal(true);
              }}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/30 flex items-center space-x-2 transition-all h-full"
            >
              <BookMarked className="w-4 h-4" />
              <span>{t('postMaterial')}</span>
            </button>
          ) : (
            <button
              onClick={() => setShowHomeworkModal(true)}
              className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/30 flex items-center space-x-2 transition-all h-full"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{t('postHomework')}</span>
            </button>
          )}
        </div>
      </div>

      {feedback && (
        <div className={`p-4 rounded-2xl border text-xs flex items-center justify-between ${
          feedback.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'
        }`}>
          <div className="flex items-center space-x-2">
            {feedback.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
            <span>{feedback.msg}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="font-bold">✕</button>
        </div>
      )}

      {/* Live Class 15-Minute Alert Banner */}
      <LiveClassNotificationBanner classId={selectedClassId} sectionId={selectedSectionId} />

        </>
      )}

      {/* Main Tabs */}
      {activeTab === 'profile-settings' ? (
        <TeacherProfileSettings />
      ) : activeTab === 'results-report' ? (
        <ResultsManager userRole="TEACHER" />
      ) : activeTab === 'routine' ? (
        <WeeklyRoutineGrid viewMode="TEACHER" />
      ) : activeTab === 'live-classes' ? (
        <LiveClassManager role="TEACHER" />
      ) : activeTab === 'media-center' || activeTab === 'media' ? (
        <MediaCenter />
      ) : activeTab === 'students' ? (
        /* Teacher Student Directory Tab */
        <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <GraduationCap className="w-5 h-5 text-emerald-600" />
                <span>{t('studentDirectory')} - {currentClassObj?.nameBn} ({studentList.length} জন শিক্ষার্থী)</span>
              </h3>
              <p className="text-xs text-slate-500">আপনার শ্রেণির শিক্ষার্থীদের সম্পূর্ণ প্রোফাইল, ফলাফল, উপস্থিতি ও ফি বিবরণী</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  placeholder="নাম বা রোল দিয়ে খুঁজুন..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2" />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3">রোল ও আইডি</th>
                  <th className="p-3">শিক্ষার্থীর নাম</th>
                  <th className="p-3">শ্রেণি ও শাখা</th>
                  <th className="p-3">অভিভাবক ও যোগাযোগ</th>
                  <th className="p-3 text-center">রক্তের গ্রুপ</th>
                  <th className="p-3 text-right">পদক্ষেপ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {studentList.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-400">
                      এই শ্রেণি ও শাখায় কোনো শিক্ষার্থী পাওয়া যায়নি
                    </td>
                  </tr>
                ) : (
                  studentList
                    .filter(st => !studentSearch || st.user?.name?.toLowerCase().includes(studentSearch.toLowerCase()) || String(st.rollNo).includes(studentSearch))
                    .map((st) => (
                      <tr key={st.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3">
                          <span className="font-bold text-slate-900">রোল {st.rollNo}</span>
                          <p className="text-[11px] text-slate-500 font-mono">{st.studentIdNumber}</p>
                        </td>
                        <td className="p-3 font-bold text-slate-800">
                          <div className="flex items-center space-x-2">
                            <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                              {st.user?.name?.charAt(0) || 'S'}
                            </div>
                            <div>
                              <p>{st.user?.name}</p>
                              <span className="text-[10px] text-slate-400 font-normal">{st.user?.email}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 font-semibold text-[11px]">
                            {st.class?.nameBn} ({st.section?.nameBn})
                          </span>
                        </td>
                        <td className="p-3 text-slate-600">
                          <p className="font-semibold text-slate-800">{st.guardians?.[0]?.parent?.name || 'অভিভাবক'}</p>
                          <p className="text-[11px] text-slate-500">{st.guardians?.[0]?.parent?.phone || st.user?.phone || '০১৭০০০০০০০০'}</p>
                        </td>
                        <td className="p-3 text-center font-bold text-rose-600">{st.bloodGroup || 'B+'}</td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => setSelectedStudentFor360(st.id)}
                            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-[11px] shadow-sm shadow-emerald-600/20 transition-all inline-flex items-center space-x-1.5"
                            title="শিক্ষার্থীর সম্পূর্ণ প্রোফাইল ও ৩৬০° ডেটা ভিউ"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
                            <span>সম্পূর্ণ প্রোফাইল / ৩৬০° ডেটা</span>
                          </button>
                        </td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : activeTab === 'my-attendance' ? (
        /* Teacher Personal Attendance & Punch-In / Punch-Out Log */
        <div className="space-y-6">
          {/* Punch-In / Punch-Out Hero Card */}
          <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-indigo-500/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-3">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30">
                  <Clock className="w-3.5 h-3.5 animate-pulse text-indigo-400" />
                  <span>স্মার্ট বায়োমেট্রিক ও টাইম লগিং সিস্টেম</span>
                </div>

                <div>
                  <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    {t('myAttendanceTime')}
                  </h3>
                  <p className="text-xs sm:text-sm text-indigo-200 mt-1">
                    আজকের তারিখ: {new Date().toLocaleDateString('bn-BD', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>

                {/* Digital Clock Box */}
                <div className="inline-flex items-center space-x-3 bg-black/40 px-4 py-2 rounded-2xl border border-white/10">
                  <Timer className="w-5 h-5 text-indigo-400" />
                  <span className="font-mono text-xl sm:text-2xl font-black tracking-wider text-emerald-400">
                    {currentTimeTicker}
                  </span>
                </div>
              </div>

              {/* Punch Action Controls */}
              <div className="bg-white/5 p-5 rounded-2xl border border-white/10 backdrop-blur-md flex flex-col sm:flex-row items-center gap-4 min-w-[320px]">
                {!myAttendanceData?.today?.checkInTime ? (
                  <div className="w-full text-center space-y-3">
                    <p className="text-xs text-slate-300 font-medium">আজকের উপস্থিতি এখনো নথিভুক্ত হয়নি</p>
                    <button
                      type="button"
                      onClick={handlePunchIn}
                      disabled={punchingIn}
                      className="w-full py-3.5 px-6 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-sm rounded-2xl shadow-lg shadow-emerald-500/25 disabled:opacity-50 flex items-center justify-center space-x-2 transition-all transform active:scale-95"
                    >
                      <LogIn className="w-5 h-5" />
                      <span>{punchingIn ? 'চেক-ইন হচ্ছে...' : '🟢 চেক-ইন করুন (Punch In)'}</span>
                    </button>
                  </div>
                ) : !myAttendanceData?.today?.checkOutTime ? (
                  <div className="w-full space-y-3">
                    <div className="flex items-center justify-between text-xs pb-2 border-b border-white/10">
                      <span className="text-emerald-400 font-bold flex items-center space-x-1.5">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>ডিউটি সক্রিয় (On Duty)</span>
                      </span>
                      <span className="text-slate-300 font-mono">প্রবেশ: {myAttendanceData.today.checkInTime}</span>
                    </div>

                    <button
                      type="button"
                      onClick={handlePunchOut}
                      disabled={punchingOut}
                      className="w-full py-3.5 px-6 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-black text-sm rounded-2xl shadow-lg shadow-indigo-600/25 disabled:opacity-50 flex items-center justify-center space-x-2 transition-all transform active:scale-95"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>{punchingOut ? 'চেক-আউট হচ্ছে...' : '🔴 চেক-আউট করুন (Punch Out)'}</span>
                    </button>
                  </div>
                ) : (
                  <div className="w-full space-y-2.5 text-center">
                    <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-xs font-bold border border-emerald-500/30">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>আজকের ডিউটি সম্পন্ন</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs pt-1 text-left">
                      <div className="p-2 bg-black/30 rounded-xl border border-white/5">
                        <span className="text-[10px] text-slate-400 block">প্রবেশের সময়</span>
                        <span className="font-mono font-bold text-white">{myAttendanceData.today.checkInTime}</span>
                      </div>
                      <div className="p-2 bg-black/30 rounded-xl border border-white/5">
                        <span className="text-[10px] text-slate-400 block">প্রস্থানের সময়</span>
                        <span className="font-mono font-bold text-white">{myAttendanceData.today.checkOutTime}</span>
                      </div>
                    </div>

                    <div className="p-2 bg-indigo-500/10 rounded-xl border border-indigo-500/20 text-xs text-indigo-300 font-bold">
                      মোট কর্মঘণ্টা: {myAttendanceData.today.workHours || '7h 45m'}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Metrics Overview */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-500">মোট উপস্থিত</span>
                <p className="text-2xl font-black text-emerald-600 mt-1">
                  {myAttendanceData?.stats?.totalPresent || 0} দিন
                </p>
              </div>
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-500">দেরিতে আগমন (Late)</span>
                <p className="text-2xl font-black text-amber-600 mt-1">
                  {myAttendanceData?.stats?.lateDays || 0} দিন
                </p>
              </div>
              <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
                <Clock className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-500">গৃহীত ছুটি (Leave)</span>
                <p className="text-2xl font-black text-blue-600 mt-1">
                  {myAttendanceData?.stats?.leaveDays || 0} দিন
                </p>
              </div>
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                <Calendar className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-500">উপস্থিতির গড় হার</span>
                <p className="text-2xl font-black text-indigo-600 mt-1">
                  {myAttendanceData?.stats?.totalLogged > 0
                    ? Math.round((myAttendanceData.stats.totalPresent / myAttendanceData.stats.totalLogged) * 100)
                    : 100}%
                </p>
              </div>
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Personal History Log Table */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h4 className="font-bold text-sm text-slate-900 flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-indigo-600" />
                  <span>ব্যক্তিগত উপস্থিতি ও কর্মঘণ্টা হিস্ট্রি (Recent Logs)</span>
                </h4>
                <p className="text-xs text-slate-500">সাম্প্রতিক ৩০ দিনের আগমন, প্রস্থান ও কর্মঘণ্টা বিবরণী</p>
              </div>

              <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-xl">
                মোট রেকর্ড: {myAttendanceData?.logs?.length || 0}টি
              </span>
            </div>

            <div className="overflow-x-auto border border-slate-100 rounded-2xl">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3.5">তারিখ (Date)</th>
                    <th className="p-3.5">প্রবেশের সময় (Check-in)</th>
                    <th className="p-3.5">প্রস্থানের সময় (Check-out)</th>
                    <th className="p-3.5 text-center">মোট কর্মঘণ্টা</th>
                    <th className="p-3.5 text-center">স্ট্যাটাস</th>
                    <th className="p-3.5">মন্তব্য</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {!myAttendanceData?.logs || myAttendanceData.logs.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="p-8 text-center text-slate-400">
                        কোনো উপস্থিতি রেকর্ড পাওয়া যায়নি
                      </td>
                    </tr>
                  ) : (
                    myAttendanceData.logs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3.5 font-bold text-slate-900">
                          {log.date}
                        </td>
                        <td className="p-3.5 font-mono text-slate-700 font-semibold">
                          {log.checkInTime || '-'}
                        </td>
                        <td className="p-3.5 font-mono text-slate-700 font-semibold">
                          {log.checkOutTime || '-'}
                        </td>
                        <td className="p-3.5 text-center">
                          <span className="inline-block px-2.5 py-0.5 rounded-full bg-slate-100 font-mono text-[11px] font-bold text-slate-700">
                            {log.workHours || '-'}
                          </span>
                        </td>
                        <td className="p-3.5 text-center">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            log.status === 'PRESENT'
                              ? 'bg-emerald-100 text-emerald-800'
                              : log.status === 'LATE'
                              ? 'bg-amber-100 text-amber-800'
                              : log.status === 'ON_LEAVE'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}>
                            {log.status === 'PRESENT'
                              ? 'উপস্থিত'
                              : log.status === 'LATE'
                              ? 'দেরিতে'
                              : log.status === 'ON_LEAVE'
                              ? 'ছুটি'
                              : 'অনুপস্থিত'}
                          </span>
                        </td>
                        <td className="p-3.5 text-slate-600 text-[11px]">
                          {log.remarks || '-'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : activeTab === 'exams' ? (
        /* Teacher Online Examination & Assessment Management */
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <HelpCircle className="w-5 h-5 text-indigo-600" />
                <span>{t('onlineExamsTitle')} - {currentClassObj?.nameBn} ({filteredExams.length}টি পরীক্ষা)</span>
              </h3>
              <p className="text-xs text-slate-500">অনলাইন কুইজ প্রণয়ন, সৃজনশীল প্রশ্ন আপলোড ও খাতা মূল্যায়ন</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setShowCQGeneratorModal(true)}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center space-x-1.5 transition-all active:scale-95"
                title="এআই দিয়ে সৃজনশীল প্রশ্ন (ক, খ, গ, ঘ) ও প্রিন্ট ফরম্যাট তৈরি করুন"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>📝 এআই সৃজনশীল প্রশ্ন (AI CQ)</span>
              </button>

              <button
                type="button"
                onClick={() => setShowAIGeneratorModal(true)}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-purple-600/20 flex items-center space-x-1.5 transition-all active:scale-95"
                title="এআই দিয়ে বহুনির্বাচনী প্রশ্ন (MCQ) তৈরি করুন"
              >
                <Zap className="w-3.5 h-3.5 text-amber-300" />
                <span>🤖 এআই MCQ জেনারেটর</span>
              </button>

              <button
                onClick={handleOpenCreateExam}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 flex items-center space-x-1.5 transition-all"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{t('createExam')}</span>
              </button>
            </div>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="পরীক্ষার নাম বা বিষয় খুঁজুন..."
                  value={examSearch}
                  onChange={(e) => setExamSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

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

            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-xl">
              মোট পরীক্ষা: {filteredExams.length}টি
            </span>
          </div>

          {/* Exams List Grid */}
          {filteredExams.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <HelpCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-500">এই শ্রেণির জন্য কোনো অনলাইন পরীক্ষা পাওয়া যায়নি</p>
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
                        {exam.type === 'MCQ' ? '🎯 MCQ কুইজ' : '✍️ লিখিত পরীক্ষা'}
                      </span>
                      <span className="text-[11px] font-bold text-slate-600 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                        {exam.subject?.nameBn || 'বিষয়'}
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-slate-900 line-clamp-2">{exam.titleBn}</h4>

                    <div className="grid grid-cols-2 gap-2 pt-1 text-[11px] text-slate-600 bg-white p-2.5 rounded-xl border border-slate-100">
                      <div>
                        <span className="text-slate-400 block">তারিখ ও সময়</span>
                        <span className="font-semibold">{exam.examDate} • {exam.startTime}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">সময় ও পূর্ণমান</span>
                        <span className="font-semibold">{exam.durationMinutes} মিনিট • {exam.totalMarks} নম্বর</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200 flex flex-col gap-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-medium">
                        অংশগ্রহণকারী: <strong className="text-indigo-600">{exam.submissionCount || 0} জন</strong>
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
      ) : activeTab === 'materials' ? (
        /* Study Materials Manager */
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <BookMarked className="w-5 h-5 text-blue-600" />
                <span>{t('materialsTitle')} - {currentClassObj?.nameBn}</span>
              </h3>
              <p className="text-xs text-slate-500">অধ্যায়ভিত্তিক পিডিএফ নোট, লেকচার শিট ও পরীক্ষার হ্যান্ডনোট</p>
            </div>

            <button
              onClick={() => {
                setEditingMaterialId(null);
                setMaterialForm({
                  classId: selectedClassId,
                  subjectId: classSubjects[0]?.id ? String(classSubjects[0].id) : '',
                  titleBn: '',
                  titleEn: '',
                  chapterBn: '',
                  chapterEn: '',
                  descriptionBn: '',
                  descriptionEn: '',
                  fileType: 'PDF',
                  fileUrl: 'https://nextgen.edu.bd/downloads/materials/lecture-note.pdf',
                  fileSize: '2.5 MB'
                });
                setShowMaterialModal(true);
              }}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 flex items-center space-x-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{t('postMaterial')}</span>
            </button>
          </div>

          {materialsList.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <BookMarked className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-500">এই শ্রেণির জন্য কোনো লেকচার নোট পাওয়া যায়নি</p>
              <button
                onClick={() => setShowMaterialModal(true)}
                className="mt-2 text-xs font-bold text-blue-600 hover:underline"
              >
                + নতুন নোট আপলোড করুন
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {materialsList.map((m) => (
                <div key={m.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-all space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-lg bg-blue-100 text-blue-800 text-xs font-bold">
                      {m.subject?.nameBn || 'বিষয়'}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500">
                      সাইজ: {m.fileSize || '2.0 MB'} • {m.fileType}
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold text-blue-600 block">{m.chapterBn}</span>
                    <h4 className="font-bold text-sm text-slate-900 mt-0.5">{m.titleBn}</h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{m.descriptionBn}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                    <a
                      href={m.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold flex items-center space-x-1 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>পিডিএফ ডাউনলোড</span>
                    </a>

                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => {
                          setEditingMaterialId(m.id);
                          setMaterialForm({
                            classId: String(m.classId),
                            subjectId: String(m.subjectId),
                            titleBn: m.titleBn,
                            titleEn: m.titleEn || '',
                            chapterBn: m.chapterBn,
                            chapterEn: m.chapterEn || '',
                            descriptionBn: m.descriptionBn,
                            descriptionEn: m.descriptionEn || '',
                            fileType: m.fileType || 'PDF',
                            fileUrl: m.fileUrl,
                            fileSize: m.fileSize || '2.5 MB'
                          });
                          setShowMaterialModal(true);
                        }}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-slate-200 transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteMaterial(m.id)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-slate-200 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : activeTab === 'textbooks' ? (
        /* Digital Textbooks & E-Library */
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-indigo-600" />
                <span>{t('textbooksTitle')} - {currentClassObj?.nameBn} ({filteredTextbooks.length}টি বই)</span>
              </h3>
              <p className="text-xs text-slate-500">NCTB কারিকুলাম অনুযায়ী নির্ধারিত বিষয়ভিত্তিক ডিজিটাল পাঠ্যপুস্তক ও ই-বুক</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleOpenAddTextbook}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 flex items-center space-x-1.5"
              >
                <PlusCircle className="w-4 h-4" />
                <span>+ নতুন পাঠ্যপুস্তক যুক্ত করুন</span>
              </button>

              <div className="relative w-full sm:w-48">
                <input
                  type="text"
                  value={textbookSearch}
                  onChange={(e) => setTextbookSearch(e.target.value)}
                  placeholder="বই বা বিষয় খুঁজুন..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              </div>
            </div>
          </div>

          {filteredTextbooks.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <BookOpen className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-500">এই শ্রেণির জন্য কোনো পাঠ্যবই পাওয়া যায়নি</p>
              <button
                onClick={handleOpenAddTextbook}
                className="mt-2 text-xs font-bold text-indigo-600 hover:underline"
              >
                + নতুন পাঠ্যবই যুক্ত করুন
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTextbooks.map((tb) => (
                <div key={tb.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-indigo-200 transition-all shadow-sm flex flex-col justify-between space-y-3">
                  <div className="space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <span className="px-2.5 py-0.5 rounded-lg bg-indigo-100 text-indigo-800 text-xs font-bold">
                        {tb.subject?.nameBn || 'বিষয়'}
                      </span>
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => handleOpenEditTextbook(tb)}
                          className="p-1 rounded-lg hover:bg-slate-200 text-slate-500"
                          title="সম্পাদনা করুন"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteTextbook(tb.id, tb.titleBn)}
                          className="p-1 rounded-lg hover:bg-rose-100 text-rose-500"
                          title="মুছে ফেলুন"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-bold text-sm text-slate-900 leading-snug">{tb.titleBn}</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">{tb.edition}</p>
                    </div>

                    {tb.description && (
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {tb.description}
                      </p>
                    )}

                    <div className="flex items-center space-x-3 text-[11px] text-slate-400 font-medium pt-1">
                      <span>📄 {tb.totalPages || 150} পৃষ্ঠা</span>
                      <span>💾 {tb.fileSize || '15 MB'}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                    <button
                      onClick={() => setReadingTextbook(tb)}
                      className="flex-1 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center space-x-1.5 shadow-sm transition-all"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>অনলাইনে পড়ুন</span>
                    </button>

                    <a
                      href={tb.fileUrl || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center space-x-1 transition-all"
                      title="ডাউনলোড করুন"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>PDF</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : activeTab === 'homework' ? (
        /* Homework Manager Tab */
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <ClipboardList className="w-5 h-5 text-emerald-600" />
                <span>{t('homeworkTitle')} - {currentClassObj?.nameBn}</span>
              </h3>
              <p className="text-xs text-slate-500">শ্রেণিভিত্তিক প্রতিদিনের বাড়ির কাজের তালিকা ও অ্যাসাইনমেন্ট</p>
            </div>

            <button
              onClick={() => setShowHomeworkModal(true)}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center space-x-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{t('postHomework')}</span>
            </button>
          </div>

          {homeworkList.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <ClipboardList className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-500">এই শ্রেণির জন্য কোনো বাড়ির কাজ পাওয়া যায়নি</p>
              <button
                onClick={() => setShowHomeworkModal(true)}
                className="mt-2 text-xs font-bold text-emerald-600 hover:underline"
              >
                + নতুন বাড়ির কাজ যোগ করুন
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {homeworkList.map((hw) => (
                <div key={hw.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-all space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold">
                      {hw.subject?.nameBn || 'বিষয়'}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500 flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>জমা: {hw.dueDate}</span>
                    </span>
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
                    <div className="p-2 rounded-xl bg-white border border-slate-200 text-[11px] text-slate-600 flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span><strong>নোট / অ্যাটাচমেন্ট:</strong> {hw.attachmentNote}</span>
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-400">
                    <span>শ্রেণি: {hw.class?.nameBn} ({hw.section?.nameBn})</span>
                    <span>পোস্টের তারিখ: {hw.assignedDate}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : activeTab === 'marks' ? (
        /* Marks Gradebook */
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <Award className="w-5 h-5 text-blue-600" />
                <span>{t('inputMarks')} - {currentClassObj?.nameBn}</span>
              </h3>
              <p className="text-xs text-slate-500">জাতীয় শিক্ষাক্রম অনুযায়ী পরীক্ষার বিষয়ভিত্তিক নম্বর এন্ট্রি</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={selectedTermId}
                onChange={(e) => setSelectedTermId(e.target.value)}
                className="py-1.5 px-3 text-xs rounded-xl border border-slate-300 font-semibold"
              >
                <option value="1">১ম সাময়িক পরীক্ষা ২০২৬</option>
                <option value="2">অর্ধ-বার্ষিক পরীক্ষা ২০২৬</option>
                <option value="3">বার্ষিক পরীক্ষা ২০২৬</option>
              </select>

              <select
                value={selectedSubjectId}
                onChange={(e) => setSelectedSubjectId(e.target.value)}
                className="py-1.5 px-3 text-xs rounded-xl border border-slate-300 font-bold text-slate-800 bg-slate-50"
              >
                {classSubjects.map(s => (
                  <option key={s.id} value={s.id}>{s.nameBn} ({s.code})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3">রোল ও আইডি</th>
                  <th className="p-3">শিক্ষার্থীর নাম</th>
                  <th className="p-3 w-32">প্রাপ্ত নম্বর (১০০)</th>
                  <th className="p-3 text-center">জিপিএ (GPA)</th>
                  <th className="p-3 text-center">গ্রেড</th>
                  <th className="p-3">শিক্ষকের মন্তব্য</th>
                  <th className="p-3 text-center">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {marksSheet.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-6 text-center text-slate-400">
                      এই শ্রেণি ও বিষয়ের শিক্ষার্থী ডাটা লোড হচ্ছে...
                    </td>
                  </tr>
                ) : (
                  marksSheet.map((st) => (
                    <tr key={st.studentId} className="hover:bg-slate-50/80">
                      <td className="p-3">
                        <span className="font-bold text-slate-900">রোল: {st.rollNo}</span>
                        <p className="text-[11px] text-slate-400">{st.studentIdNumber}</p>
                      </td>
                      <td className="p-3 font-bold text-slate-800">{st.name}</td>
                      <td className="p-3">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={st.obtainedMarks}
                          onChange={(e) => handleMarksChange(st.studentId, e.target.value)}
                          className="w-20 px-2 py-1 text-xs font-bold rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 text-center"
                        />
                      </td>
                      <td className="p-3 text-center font-bold text-blue-700">{st.gradePoint}</td>
                      <td className="p-3 text-center">
                        <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 font-bold text-[11px]">
                          {st.letterGrade}
                        </span>
                      </td>
                      <td className="p-3">
                        <input
                          type="text"
                          value={st.teacherRemarks || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            setMarksSheet(prev =>
                              prev.map(i => i.studentId === st.studentId ? { ...i, teacherRemarks: val } : i)
                            );
                          }}
                          placeholder="মন্তব্য লিখুন..."
                          className="w-full px-2 py-1 text-xs rounded-lg border border-slate-200"
                        />
                      </td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => handleSaveSingleMark(st)}
                          className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-600 transition-colors"
                          title="Save Mark"
                        >
                          <Save className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Daily Attendance Taker */
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <CalendarCheck className="w-5 h-5 text-emerald-600" />
                <span>{t('takeAttendance')} - {currentClassObj?.nameBn}</span>
              </h3>
              <p className="text-xs text-slate-500">দৈনিক উপস্থিতি গ্রহণের শিট</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={selectedSectionId}
                onChange={(e) => setSelectedSectionId(e.target.value)}
                className="py-1.5 px-3 text-xs rounded-xl border border-slate-300 font-semibold"
              >
                {currentSections.map(sec => (
                  <option key={sec.id} value={sec.id}>{sec.nameBn}</option>
                ))}
              </select>

              <input
                type="date"
                value={attendanceDate}
                onChange={(e) => setAttendanceDate(e.target.value)}
                className="py-1.5 px-3 text-xs rounded-xl border border-slate-300 font-medium"
              />

              <button
                onClick={handleMarkAllPresent}
                className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold rounded-xl transition-colors flex items-center space-x-1"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t('markAllPresent')}</span>
              </button>

              {attendanceSheet.filter(s => s.status === 'ABSENT').length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowSMSModal(true)}
                  className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center space-x-1.5 animate-pulse"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>অনুপস্থিতদের SMS পাঠান ({attendanceSheet.filter(s => s.status === 'ABSENT').length})</span>
                </button>
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3">রোল</th>
                  <th className="p-3">শিক্ষার্থীর নাম</th>
                  <th className="p-3">আইডি নম্বর</th>
                  <th className="p-3 text-center">উপস্থিতি স্থিতি</th>
                  <th className="p-3">মন্তব্য</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {attendanceSheet.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-slate-400">
                      এই শ্রেণি ও শাখার শিক্ষার্থী লোড হচ্ছে...
                    </td>
                  </tr>
                ) : (
                  attendanceSheet.map((st) => (
                    <tr key={st.studentId} className="hover:bg-slate-50/80">
                      <td className="p-3 font-bold text-slate-900">রোল {st.rollNo}</td>
                      <td className="p-3 font-bold text-slate-800">{st.name}</td>
                      <td className="p-3 text-slate-500">{st.studentIdNumber}</td>
                      <td className="p-3">
                        <div className="flex items-center justify-center space-x-1">
                          <button
                            type="button"
                            onClick={() => handleStatusChange(st.studentId, 'PRESENT')}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                              st.status === 'PRESENT'
                                ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-300'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            উপস্থিত (P)
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStatusChange(st.studentId, 'LATE')}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                              st.status === 'LATE'
                                ? 'bg-amber-500 text-white shadow-sm ring-2 ring-amber-300'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            বিলম্ব (L)
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStatusChange(st.studentId, 'ABSENT')}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                              st.status === 'ABSENT'
                                ? 'bg-rose-600 text-white shadow-sm ring-2 ring-rose-300'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            অনুপস্থিত (A)
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStatusChange(st.studentId, 'LEAVE')}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                              st.status === 'LEAVE'
                                ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-300'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            ছুটি (LV)
                          </button>
                        </div>
                      </td>
                      <td className="p-3">
                        <input
                          type="text"
                          value={st.remarks || ''}
                          onChange={(e) => {
                            const r = e.target.value;
                            setAttendanceSheet(prev =>
                              prev.map(i => i.studentId === st.studentId ? { ...i, remarks: r } : i)
                            );
                          }}
                          placeholder="মন্তব্য (যেমন: কারণ)"
                          className="w-full px-2 py-1 text-xs rounded-lg border border-slate-200"
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center space-x-2">
              <label className="flex items-center space-x-2 cursor-pointer font-semibold text-xs text-slate-700 select-none bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                <input
                  type="checkbox"
                  checked={autoSendAbsentSms}
                  onChange={(e) => setAutoSendAbsentSms(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                />
                <span>অনুপস্থিতদের স্বয়ংক্রিয় SMS পাঠান (Auto SMS on Absent)</span>
              </label>
            </div>

            <div className="flex items-center space-x-2">
              {attendanceSheet.filter(s => s.status === 'ABSENT').length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowSMSModal(true)}
                  className="px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-all flex items-center space-x-1.5"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>SMS প্রিভিউ ও পাঠান ({attendanceSheet.filter(s => s.status === 'ABSENT').length})</span>
                </button>
              )}

              <button
                onClick={handleSaveAttendance}
                disabled={saving}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 disabled:opacity-50 transition-all flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? t('processing') : t('submitAttendance')}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload/Edit Study Material Modal */}
      {showMaterialModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <BookMarked className="w-5 h-5 text-blue-600" />
                <span>{editingMaterialId ? 'লেকচার নোট সম্পাদনা' : t('postMaterial')}</span>
              </h3>
              <button
                onClick={() => setShowMaterialModal(false)}
                className="text-slate-400 hover:text-slate-700 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveMaterial} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-1">শ্রেণি নির্বাচন</label>
                  <select
                    value={materialForm.classId}
                    onChange={(e) => setMaterialForm({ ...materialForm, classId: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-semibold"
                  >
                    {allClasses.map(c => <option key={c.id} value={c.id}>{c.nameBn}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-1">পাঠ্য বিষয়</label>
                  <select
                    value={materialForm.subjectId}
                    onChange={(e) => setMaterialForm({ ...materialForm, subjectId: e.target.value })}
                    required
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-semibold text-blue-800 bg-blue-50/50"
                  >
                    {modalSubjects.map(s => (
                      <option key={s.id} value={s.id}>{s.nameBn} ({s.code})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1">অধ্যায় / টপিকের নাম</label>
                <input
                  type="text"
                  value={materialForm.chapterBn}
                  onChange={(e) => setMaterialForm({ ...materialForm, chapterBn: e.target.value })}
                  required
                  placeholder="যেমন: অধ্যায় ৩: বীজগণিতীয় রাশি ও সূত্রাবলি"
                  className="w-full bg-white border border-slate-300 text-slate-900 font-semibold placeholder:text-slate-400 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1">নোট / শিটের শিরোনাম</label>
                <input
                  type="text"
                  value={materialForm.titleBn}
                  onChange={(e) => setMaterialForm({ ...materialForm, titleBn: e.target.value })}
                  required
                  placeholder="যেমন: বীজগণিতের সকল সূত্র ও বোর্ড প্রশ্ন সমাধান হ্যান্ডনোট"
                  className="w-full bg-white border border-slate-300 text-slate-900 font-semibold placeholder:text-slate-400 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1">বিস্তারিত বিবরণ ও নির্দেশনাবলী</label>
                <textarea
                  rows={2}
                  value={materialForm.descriptionBn}
                  onChange={(e) => setMaterialForm({ ...materialForm, descriptionBn: e.target.value })}
                  placeholder="লেকচার নোটের বিষয়বস্তু সংক্ষেপে বর্ণনা করুন..."
                  className="w-full bg-white border border-slate-300 text-slate-900 font-semibold placeholder:text-slate-400 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm text-xs"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-1">ফাইলের ধরন</label>
                  <select
                    value={materialForm.fileType}
                    onChange={(e) => setMaterialForm({ ...materialForm, fileType: e.target.value })}
                    className="w-full px-2.5 py-2 text-xs rounded-xl border border-slate-300 font-semibold"
                  >
                    <option value="PDF">PDF ডকুমেন্ট</option>
                    <option value="DOC">Word / Doc</option>
                    <option value="IMAGE">Image / ছবি</option>
                    <option value="LINK">Drive / Web Link</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-900 mb-1">ফাইল / ড্রাইভ ডাউনলোড লিঙ্ক</label>
                  <input
                    type="url"
                    value={materialForm.fileUrl}
                    onChange={(e) => setMaterialForm({ ...materialForm, fileUrl: e.target.value })}
                    placeholder="https://drive.google.com/..."
                    className="w-full bg-white border border-slate-300 text-slate-900 font-semibold placeholder:text-slate-400 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm text-xs"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end space-x-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowMaterialModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-600/20 disabled:opacity-50 flex items-center space-x-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{saving ? t('processing') : 'সংরক্ষণ করুন'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Post Homework Modal with Camera/Image Capture */}
      {showHomeworkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <ClipboardList className="w-5 h-5 text-emerald-600" />
                <span>{t('postHomework')}</span>
              </h3>
              <button
                onClick={() => setShowHomeworkModal(false)}
                className="text-slate-400 hover:text-slate-700 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handlePostHomework} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-1">শ্রেণি</label>
                  <select
                    value={homeworkForm.classId}
                    onChange={(e) => {
                      const newCid = e.target.value;
                      const cls = allClasses.find(c => c.id === Number(newCid));
                      setHomeworkForm({
                        ...homeworkForm,
                        classId: newCid,
                        sectionId: cls?.sections?.[0]?.id ? String(cls.sections[0].id) : '1'
                      });
                    }}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-semibold"
                  >
                    {allClasses.map(c => <option key={c.id} value={c.id}>{c.nameBn}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-1">শাখা / বিভাগ</label>
                  <select
                    value={homeworkForm.sectionId}
                    onChange={(e) => setHomeworkForm({ ...homeworkForm, sectionId: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-semibold"
                  >
                    {allClasses.find(c => c.id === Number(homeworkForm.classId))?.sections?.map(sec => (
                      <option key={sec.id} value={sec.id}>{sec.nameBn}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-1">কারিকুলাম বিষয়</label>
                  <select
                    value={homeworkForm.subjectId}
                    onChange={(e) => setHomeworkForm({ ...homeworkForm, subjectId: e.target.value })}
                    required
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-semibold text-emerald-800 bg-emerald-50/50"
                  >
                    {modalSubjects.map(s => (
                      <option key={s.id} value={s.id}>{s.nameBn} ({s.code})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-1">জমা দেওয়ার শেষ তারিখ</label>
                  <input
                    type="date"
                    value={homeworkForm.dueDate}
                    onChange={(e) => setHomeworkForm({ ...homeworkForm, dueDate: e.target.value })}
                    required
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1">টপিক / শিরোনাম (বাংলা)</label>
                <input
                  type="text"
                  value={homeworkForm.topicBn}
                  onChange={(e) => setHomeworkForm({ ...homeworkForm, topicBn: e.target.value })}
                  required
                  placeholder="যেমন: অনুশীলনী ৩.২ এর ১-১০ নং অংক সমাধান"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1">বিস্তারিত বিবরণ ও নির্দেশনা</label>
                <textarea
                  rows={3}
                  value={homeworkForm.descriptionBn}
                  onChange={(e) => setHomeworkForm({ ...homeworkForm, descriptionBn: e.target.value })}
                  required
                  placeholder="বইয়ের কোন পৃষ্ঠা থেকে পড়তে বা লিখতে হবে বিস্তারিত উল্লেখ করুন..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1">সংযুক্তি / হ্যান্ডনোট / রেফারেন্স (ঐচ্ছিক)</label>
                <input
                  type="text"
                  value={homeworkForm.attachmentNote}
                  onChange={(e) => setHomeworkForm({ ...homeworkForm, attachmentNote: e.target.value })}
                  placeholder="যেমন: পাঠ্যবই পৃষ্ঠা ৪২-৪৪ এবং ক্লাস নোট পিডিএফ"
                  className="w-full bg-white border border-slate-300 text-slate-900 font-semibold placeholder:text-slate-400 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm text-xs"
                />
              </div>

              {/* Universal Homework Assignment File / Image / Drive Link */}
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
                <UniversalFileUploader
                  label="হোমওয়ার্ক প্রশ্নপত্র / সংযুক্তি ফাইল (Homework Attachment - Image / PDF / Link)"
                  value={homeworkForm.attachmentImage}
                  previewType="image"
                  accept="*/*"
                  maxMb={100}
                  helperText="হোমওয়ার্কের প্রশ্নপত্র, খাতার ছবি, সমাধান নির্দেশিকা বা ড্রাইভ লিংক"
                  onChange={({ fileUrl, url }) => {
                    setHomeworkForm(prev => ({
                      ...prev,
                      attachmentImage: fileUrl || url || null
                    }));
                  }}
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowHomeworkModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-600/20 disabled:opacity-50 flex items-center space-x-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{saving ? t('processing') : 'পোস্ট করুন'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
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

      {/* Absent SMS Preview & Send Modal */}
      {showSMSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <Smartphone className="w-5 h-5 text-rose-600" />
                <span>অনুপস্থিতি SMS নোটিফিকেশন প্রেরণ</span>
              </h3>
              <button
                onClick={() => setShowSMSModal(false)}
                className="text-slate-400 hover:text-slate-700 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1">
                  বাংলা SMS টেমপ্লেট প্রিভিউ (Template Preview):
                </label>
                <div className="p-3.5 bg-slate-900 text-emerald-300 rounded-xl text-xs leading-relaxed border border-slate-700 font-medium">
                  &ldquo;প্রিয় অভিভাবক, আপনার সন্তান <span className="text-amber-300 font-bold">[শিক্ষার্থীর নাম]</span> (শ্রেণি: <span className="text-amber-300 font-bold">{currentClassObj?.nameBn}</span>, রোল: <span className="text-amber-300 font-bold">[রোল]</span>) আজ <span className="text-amber-300 font-bold">{attendanceDate}</span>-এ নেক্সটজেন একাডেমিতে অনুপস্থিত রয়েছে। কোনো বিশেষ কারণ থাকলে অনুগ্রহ করে কোচিং কর্তৃপক্ষকে জানান। ধন্যবাদ, নেক্সটজেন একাডেমি।&rdquo;
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  প্রাপক অভিভাবক ও শিক্ষার্থীদের তালিকা ({attendanceSheet.filter(s => s.status === 'ABSENT').length} জন):
                </label>
                <div className="divide-y divide-slate-100 max-h-44 overflow-y-auto border border-slate-200 rounded-xl">
                  {attendanceSheet.filter(s => s.status === 'ABSENT').map(st => (
                    <div key={st.studentId} className="p-2.5 flex items-center justify-between text-xs bg-slate-50/50">
                      <div>
                        <span className="font-bold text-slate-800">{st.name}</span>
                        <span className="text-[11px] text-slate-400 ml-1.5">(রোল: {st.rollNo})</span>
                      </div>
                      <span className="font-mono text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        SMS Sent via BD Gateway
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-800 flex items-start space-x-2">
                <span className="font-bold">ℹ️ দ্রষ্টব্য:</span>
                <span>
                  SMS পাঠানোর সাথে সাথে সংশ্লিষ্ট অভিভাবকের মোবাইল নম্বরে খুদে বার্তা যাবে এবং অভিভাবক পোর্টালেও নোটিফিকেশন হিসেবে সংরক্ষিত হবে।
                </span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end space-x-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowSMSModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                {t('cancel')}
              </button>
              <button
                type="button"
                onClick={handleSendAbsentSMSManual}
                disabled={sendingSMS}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-md shadow-rose-600/20 disabled:opacity-50 flex items-center space-x-1.5 transition-all"
              >
                <SendHorizontal className="w-4 h-4" />
                <span>{sendingSMS ? 'SMS পাঠানো হচ্ছে...' : 'এখনই SMS পাঠান (Send SMS)'}</span>
              </button>
            </div>
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
                        {prePrimaryClasses.map(c => <option key={c.id} value={c.id}>{c.nameBn}</option>)}
                      </optgroup>
                      <optgroup label="🎒 প্রাথমিক (Primary 1-5)">
                        {primaryClasses.map(c => <option key={c.id} value={c.id}>{c.nameBn}</option>)}
                      </optgroup>
                      <optgroup label="📚 মাধ্যমিক (Secondary 6-10)">
                        {secondaryClasses.map(c => <option key={c.id} value={c.id}>{c.nameBn}</option>)}
                      </optgroup>
                      <optgroup label="🎓 উচ্চ মাধ্যমিক (HSC 11-12)">
                        {collegeClasses.map(c => <option key={c.id} value={c.id}>{c.nameBn}</option>)}
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
                      {modalSubjects.map(sub => (
                        <option key={sub.id} value={sub.id}>
                          {sub.nameBn} ({sub.code})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

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

              <div>
                <label className="block font-bold text-slate-900 mb-1">
                  বইয়ের সম্পূর্ণ PDF ফাইল বা অনলাইন রিডিং লিঙ্ক (PDF / Web Link)
                </label>
                <input
                  type="url"
                  value={textbookForm.fileUrl}
                  onChange={(e) => setTextbookForm({ ...textbookForm, fileUrl: e.target.value })}
                  placeholder="https://nctb.gov.bd/textbooks/sample-2026.pdf বা লিঙ্ক"
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

              <div>
                <label className="block font-bold text-slate-900 mb-1">
                  সংক্ষিপ্ত পরিচিতি ও নির্দেশনা (Description)
                </label>
                <textarea
                  rows="2"
                  value={textbookForm.description}
                  onChange={(e) => setTextbookForm({ ...textbookForm, description: e.target.value })}
                  placeholder="বইটির অধ্যায় বা শিক্ষাক্রমের সংক্ষিপ্ত বিবরণ..."
                  className="w-full bg-white border border-slate-300 text-slate-900 font-semibold placeholder:text-slate-400 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm"
                />
              </div>

              {/* Universal Book Cover / Document Uploader */}
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
                  disabled={saving}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md shadow-indigo-600/20 disabled:opacity-50 flex items-center space-x-1.5 transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'সংরক্ষণ হচ্ছে...' : (editingTextbookId ? 'আপডেট করুন (Update)' : 'সংরক্ষণ করুন (Save Book)')}</span>
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
                      <span>সম্পূর্ণ বই খুলুন (Full View)</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Online Exam Modal (Teacher) */}
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
                    {editingExamId ? 'পরীক্ষা সম্পাদনা করুন' : '+ নতুন অনলাইন পরীক্ষা তৈরি করুন'}
                  </h3>
                  <p className="text-[11px] text-slate-500">{currentClassObj?.nameBn} • শিক্ষক মূল্যায়ন প্যানেল</p>
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
              {/* Title Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-900 mb-1">
                    পরীক্ষার নাম / শিরোনাম <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={examForm.titleBn}
                    onChange={(e) => setExamForm({ ...examForm, titleBn: e.target.value })}
                    placeholder="যেমন: বিজ্ঞান ১ম সাময়িক কুইজ"
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
                    placeholder="e.g. Science 1st Term Quiz"
                    className="w-full bg-white border border-slate-300 text-slate-900 font-semibold placeholder:text-slate-400 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm"
                  />
                </div>
              </div>

              {/* Subject & Type Selection */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-900 mb-1">
                    বিষয় (Subject) <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={examForm.subjectId}
                    onChange={(e) => setExamForm({ ...examForm, subjectId: e.target.value })}
                    className="w-full bg-white border border-slate-300 text-slate-900 font-semibold placeholder:text-slate-400 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm"
                  >
                    {classSubjects.map(s => (
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
                    className="w-full bg-white border border-slate-300 text-slate-900 font-bold placeholder:text-slate-400 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm"
                  >
                    <option value="MCQ">🎯 বহুনির্বাচনী (MCQ)</option>
                    <option value="WRITTEN">✍️ সৃজনশীল লিখিত (Written)</option>
                  </select>
                </div>
              </div>

              {/* Date, Time, Duration, Marks */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                <div>
                  <label className="block font-bold text-slate-900 mb-1">তারিখ (Date)</label>
                  <input
                    type="date"
                    required
                    value={examForm.examDate}
                    onChange={(e) => setExamForm({ ...examForm, examDate: e.target.value })}
                    className="w-full bg-white border border-slate-300 text-slate-900 font-semibold placeholder:text-slate-400 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-900 mb-1">শুরুর সময়</label>
                  <input
                    type="text"
                    value={examForm.startTime}
                    onChange={(e) => setExamForm({ ...examForm, startTime: e.target.value })}
                    placeholder="11:00 AM"
                    className="w-full bg-white border border-slate-300 text-slate-900 font-mono font-semibold placeholder:text-slate-400 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm"
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
                    className="w-full bg-white border border-slate-300 text-slate-900 font-bold placeholder:text-slate-400 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-900 mb-1">মোট নম্বর</label>
                  <input
                    type="number"
                    min="1"
                    value={examForm.totalMarks}
                    onChange={(e) => setExamForm({ ...examForm, totalMarks: Number(e.target.value) })}
                    className="w-full bg-white border border-slate-300 text-slate-900 font-bold placeholder:text-slate-400 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-900 mb-1">পাস নম্বর</label>
                  <input
                    type="number"
                    min="1"
                    value={examForm.passMarks}
                    onChange={(e) => setExamForm({ ...examForm, passMarks: Number(e.target.value) })}
                    className="w-full bg-white border border-slate-300 text-emerald-800 font-bold placeholder:text-slate-400 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm"
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
                  className="w-full bg-white border border-slate-300 text-slate-900 font-semibold placeholder:text-slate-400 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm"
                ></textarea>
              </div>

              {/* MCQ Question Builder */}
              {examForm.type === 'MCQ' ? (
                <div className="space-y-3 pt-2 border-t border-slate-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <h4 className="font-bold text-slate-900 flex items-center space-x-1.5 text-xs sm:text-sm">
                      <CheckSquare className="w-4 h-4 text-indigo-600" />
                      <span>বহুনির্বাচনী প্রশ্নমালা ({examForm.questions.length}টি প্রশ্ন)</span>
                    </h4>

                    <div className="flex items-center space-x-2">
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
                            <span className="text-[11px] font-bold text-slate-900">নম্বর:</span>
                            <input
                              type="number"
                              min="1"
                              value={q.marks || 1}
                              onChange={(e) => handleMCQQuestionChange(qIdx, 'marks', Number(e.target.value))}
                              className="w-16 bg-white border border-slate-300 text-slate-900 font-bold placeholder:text-slate-400 rounded-lg px-2 py-1 text-center text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
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
                          className="w-full bg-white border border-slate-300 text-slate-900 font-semibold placeholder:text-slate-400 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm"
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
                                name={`teacher-correct-${qIdx}`}
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
                                className="flex-1 bg-white border border-slate-300 text-slate-900 font-semibold placeholder:text-slate-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm text-xs"
                              />
                            </div>
                          ))}
                        </div>

                        <input
                          type="text"
                          value={q.explanation || ''}
                          onChange={(e) => handleMCQQuestionChange(qIdx, 'explanation', e.target.value)}
                          placeholder="সঠিক উত্তরের ব্যাখ্যা (ঐচ্ছিক)..."
                          className="w-full bg-white border border-slate-300 text-slate-900 font-semibold placeholder:text-slate-400 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm"
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

                    <button
                      type="button"
                      onClick={() => setShowCQGeneratorModal(true)}
                      className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-xs font-black rounded-xl shadow-lg shadow-emerald-500/30 flex items-center space-x-1.5 transition-all flex-shrink-0 active:scale-95"
                    >
                      <Zap className="w-3.5 h-3.5 text-amber-300" />
                      <span>সৃজনশীল প্রশ্ন জেনারেট করুন</span>
                    </button>
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
                      className="w-full bg-white border border-slate-300 text-slate-900 font-mono font-semibold placeholder:text-slate-400 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm text-xs"
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
                  disabled={saving}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md shadow-indigo-600/20 disabled:opacity-50 flex items-center space-x-1.5 transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'সংরক্ষণ হচ্ছে...' : (editingExamId ? 'আপডেট করুন' : 'পরীক্ষা প্রকাশ করুন')}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Teacher Submissions & Written Exam Grading Modal */}
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
                    শিক্ষার্থীদের উত্তরপত্র ও খাতা মূল্যায়ন
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {selectedExamForSubmissions.titleBn} • মোট সাবমিশন: {currentExamSubmissions.length}টি
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

      {/* Admin / Teacher Study Material & Source-Context AI Document Uploader Modal */}
      {showStudyMaterialUploadModal && (
        <AdminStudyMaterialUploadModal
          isOpen={showStudyMaterialUploadModal}
          onClose={() => {
            setShowStudyMaterialUploadModal(false);
            loadMaterials();
          }}
          onUploadSuccess={() => loadMaterials()}
        />
      )}

      {/* Student 360 Comprehensive Profile Modal */}
      {selectedStudentFor360 && (
        <Student360Modal
          studentId={selectedStudentFor360}
          onClose={() => setSelectedStudentFor360(null)}
        />
      )}

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
    </div>
  );
}
