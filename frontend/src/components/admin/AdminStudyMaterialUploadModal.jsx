import React, { useState, useEffect } from 'react';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  X,
  FileCode,
  Sparkles,
  Loader2,
  Trash2,
  Eye,
  RefreshCw,
  BookOpen,
  Image as ImageIcon,
  FileSpreadsheet,
  FileArchive,
  Music,
  Film,
  File,
  HardDrive,
  FolderOpen,
  Check,
  Tag,
  GraduationCap,
  Calendar,
  Layers,
  Search,
  Filter,
  Sliders,
  Bookmark
} from 'lucide-react';
import { materialAPI, googleDriveAPI, curriculumAPI } from '../../services/api';
import {
  uploadToSupabaseStorage,
  formatFileSize,
  GLOBAL_MAX_FILE_SIZE_MB
} from '../../services/supabaseStorage';

const BOARDS_LIST = [
  { id: 'ঢাকা', nameBn: 'ঢাকা বোর্ড (Dhaka)' },
  { id: 'চট্টগ্রাম', nameBn: 'চট্টগ্রাম বোর্ড (Chattogram)' },
  { id: 'রাজশাহী', nameBn: 'রাজশাহী বোর্ড (Rajshahi)' },
  { id: 'কুমিল্লা', nameBn: 'কুমিল্লা বোর্ড (Cumilla)' },
  { id: 'যশোর', nameBn: 'যশোর বোর্ড (Jashore)' },
  { id: 'বরিশাল', nameBn: 'বরিশাল বোর্ড (Barishal)' },
  { id: 'সিলেট', nameBn: 'সিলেট বোর্ড (Sylhet)' },
  { id: 'দিনাজপুর', nameBn: 'দিনাজপুর বোর্ড (Dinajpur)' },
  { id: 'ময়মনসিংহ', nameBn: 'ময়মনসিংহ বোর্ড (Mymensingh)' },
  { id: 'মাদ্রাসা', nameBn: 'মাদ্রাসা বোর্ড (Madrasah)' },
  { id: 'কারিগরি', nameBn: 'কারিগরি বোর্ড (Technical)' },
  { id: 'সকল বোর্ড', nameBn: 'সকল বোর্ড (All Boards)' }
];

const YEARS_LIST = ['2026', '2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018'];

const QUESTION_TYPES = [
  { id: 'MCQ', label: 'MCQ (বহুনির্বাচনি প্রশ্ন)' },
  { id: 'CQ', label: 'CQ (সৃজনশীল প্রশ্ন)' },
  { id: 'SQ', label: 'SQ (সংক্ষিপ্ত প্রশ্ন / জ্ঞান ও অনুধাবন)' },
  { id: 'MODEL_TEST', label: 'Model Test (মডেল টেস্ট প্রশ্নব্যাংক)' },
  { id: 'NOTE', label: 'Lecture Note (লেকচার নোট ও গাইড)' }
];

/**
 * Real-time Academic Badge Generator
 */
export function formatAcademicBadge(board, year, qType) {
  const cleanBoard = (board || '').trim();
  const cleanYear = year ? String(year).trim() : '';
  const shortYear = cleanYear ? cleanYear.replace(/^20/, '').replace(/^২০/, '') : '';
  const cleanType = (qType || 'MCQ').trim();

  if (cleanBoard && shortYear && cleanType) {
    return `${cleanBoard} - ${shortYear} (${cleanType})`;
  } else if (cleanBoard && shortYear) {
    return `${cleanBoard} - ${shortYear}`;
  } else if (cleanBoard && cleanType) {
    return `${cleanBoard} (${cleanType})`;
  } else if (shortYear && cleanType) {
    return `${shortYear} (${cleanType})`;
  } else if (cleanType) {
    return `(${cleanType})`;
  }
  return '';
}

export default function AdminStudyMaterialUploadModal({ isOpen, onClose, onUploadSuccess }) {
  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('EXAM');
  const [selectedClassId, setSelectedClassId] = useState('11');
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [chapter, setChapter] = useState('');
  const [topic, setTopic] = useState('');
  const [board, setBoard] = useState('ঢাকা');
  const [examYear, setExamYear] = useState('2025');
  const [questionType, setQuestionType] = useState('MCQ');

  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loadingSubjects, setLoadingSubjects] = useState(false);

  const [selectedFile, setSelectedFile] = useState(null);
  const [pastedText, setPastedText] = useState('');
  const [uploadMode, setUploadMode] = useState('file'); // 'file' | 'text' | 'drive'
  const [isProcessing, setIsProcessing] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // Google Drive State
  const [driveFolderUrl, setDriveFolderUrl] = useState('');
  const [isScanningDrive, setIsScanningDrive] = useState(false);
  const [driveScanResult, setDriveScanResult] = useState(null);
  const [selectedDriveFiles, setSelectedDriveFiles] = useState([]);
  const [isSyncingDrive, setIsSyncingDrive] = useState(false);

  // List of existing source materials & filters
  const [sourceMaterials, setSourceMaterials] = useState([]);
  const [loadingList, setLoadingList] = useState(false);
  const [previewMaterial, setPreviewMaterial] = useState(null);
  const [filterBoard, setFilterBoard] = useState('ALL');
  const [filterYear, setFilterYear] = useState('ALL');
  const [filterType, setFilterType] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Live Auto Badge Preview
  const liveBadge = formatAcademicBadge(board, examYear, questionType);

  // 1. Initial Load of Classes
  useEffect(() => {
    if (isOpen) {
      curriculumAPI.getClasses().then(res => {
        if (res?.success && Array.isArray(res.data)) {
          setClasses(res.data);
          if (!selectedClassId && res.data.length > 0) {
            setSelectedClassId(String(res.data[0].id));
          }
        }
      }).catch(err => console.error('Failed to load classes:', err));

      fetchSourceMaterials();
      setFeedback(null);
    }
  }, [isOpen]);

  // 2. Fetch Subjects when selectedClassId changes
  useEffect(() => {
    if (!isOpen || !selectedClassId) return;

    setLoadingSubjects(true);
    curriculumAPI.getSubjects(selectedClassId).then(res => {
      if (res?.success && Array.isArray(res.data)) {
        setSubjects(res.data);
        if (res.data.length > 0) {
          const exists = res.data.some(s => String(s.id) === String(selectedSubjectId));
          if (!exists) {
            setSelectedSubjectId(String(res.data[0].id));
          }
        } else {
          setSelectedSubjectId('');
        }
      }
    }).catch(err => console.error('Failed to load subjects:', err))
      .finally(() => setLoadingSubjects(false));
  }, [isOpen, selectedClassId]);

  const fetchSourceMaterials = async () => {
    try {
      setLoadingList(true);
      const res = await materialAPI.getSourceMaterials();
      if (res && res.data) {
        setSourceMaterials(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch source materials:', err);
    } finally {
      setLoadingList(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > GLOBAL_MAX_FILE_SIZE_MB * 1024 * 1024) {
        setFeedback({
          type: 'error',
          message: `ফাইলের সাইজ ${GLOBAL_MAX_FILE_SIZE_MB}MB-এর চেয়ে বড় হওয়া যাবে না।`
        });
        return;
      }
      setSelectedFile(file);
      if (!title.trim()) {
        const nameWithoutExt = (file?.name || '').replace(/\.[^/.]+$/, '');
        setTitle(nameWithoutExt);
      }
      setFeedback(null);
    }
  };

  // Google Drive Handlers
  const handleScanDriveFolder = async () => {
    if (!driveFolderUrl.trim()) {
      setFeedback({
        type: 'error',
        message: 'অনুগ্রহ করে গুগল ড্রাইভ ফোল্ডার লিংক দিন।'
      });
      return;
    }

    setIsScanningDrive(true);
    setFeedback(null);

    try {
      const res = await googleDriveAPI.scanFolder({ folderUrlOrId: driveFolderUrl.trim() });
      if (res.success && Array.isArray(res.files)) {
        setDriveScanResult(res);
        const supported = res.files.filter(f => f.isSupported);
        setSelectedDriveFiles(supported);
        setFeedback({
          type: 'success',
          message: `গুগল ড্রাইভ ফোল্ডার স্ক্যান সফল! ${res.files.length}টি ফাইল শনাক্ত হয়েছে (${supported.length}টি সাপোর্টেড)।`
        });
      } else {
        setFeedback({
          type: 'error',
          message: res.error?.message || 'গুগল ড্রাইভ স্ক্যান করা যায়নি।'
        });
      }
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err.message || 'গুগল ড্রাইভ স্ক্যান করার সময় সমস্যা হয়েছে।'
      });
    } finally {
      setIsScanningDrive(false);
    }
  };

  const toggleDriveFile = (file) => {
    setSelectedDriveFiles(prev => {
      const exists = prev.some(f => f.id === file.id);
      if (exists) {
        return prev.filter(f => f.id !== file.id);
      } else {
        return [...prev, file];
      }
    });
  };

  const handleSyncDriveMaterials = async () => {
    if (selectedDriveFiles.length === 0) {
      setFeedback({
        type: 'error',
        message: 'সিঙ্ক করার জন্য অন্তত একটি ফাইল সিলেক্ট করুন।'
      });
      return;
    }

    setIsSyncingDrive(true);
    setFeedback(null);

    try {
      const res = await googleDriveAPI.syncMaterials({
        files: selectedDriveFiles,
        category,
        classId: selectedClassId,
        subjectId: selectedSubjectId,
        chapter,
        topic,
        board,
        examYear,
        questionType,
        badge: liveBadge
      });

      if (res.success) {
        setFeedback({
          type: 'success',
          message: res.message || `${selectedDriveFiles.length}টি ফাইল একাডেমিক মেটাডাটা সহ সফলভাবে সিঙ্ক হয়েছে!`,
          details: `অটো-জেনারেটেড ব্যাজ: [ ${liveBadge} ] যুক্ত করে এআই প্রশ্ন তৈরিতে সংযুক্ত করা হয়েছে।`
        });
        fetchSourceMaterials();
        if (onUploadSuccess) onUploadSuccess(res.data);
      } else {
        throw new Error(res.error?.message || 'সিঙ্ক ব্যর্থ হয়েছে');
      }
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err.message || 'গুগল ড্রাইভ সিঙ্ক করার সময় সমস্যা দেখা দিয়েছে।'
      });
    } finally {
      setIsSyncingDrive(false);
    }
  };

  const handleUploadAndProcess = async (e) => {
    if (e) e.preventDefault();
    setFeedback(null);

    if (uploadMode === 'file' && !selectedFile) {
      setFeedback({ type: 'error', message: 'অনুগ্রহ করে একটি ফাইল নির্বাচন করুন।' });
      return;
    }

    if (uploadMode === 'text' && !pastedText.trim()) {
      setFeedback({ type: 'error', message: 'অনুগ্রহ করে কিছু টেক্সট বা প্রশ্নব্যাংক কন্টেন্ট লিখুন।' });
      return;
    }

    if (!title.trim()) {
      setFeedback({ type: 'error', message: 'স্টাডি ম্যাটেরিয়ালের একটি শিরোনাম (Title) দিন।' });
      return;
    }

    setIsProcessing(true);

    try {
      let publicUploadedUrl = '';
      let extractedContent = '';

      if (uploadMode === 'text') {
        extractedContent = pastedText.trim();
      } else if (selectedFile) {
        const uploadResult = await uploadToSupabaseStorage({
          file: selectedFile,
          folder: 'study_materials',
          userId: 'admin',
          category
        });

        if (uploadResult.success) {
          publicUploadedUrl = uploadResult.publicUrl;
        }

        const lowerName = selectedFile.name.toLowerCase();
        const isPdf = lowerName.endsWith('.pdf') || selectedFile.type === 'application/pdf';
        const isDocx = lowerName.endsWith('.docx') || lowerName.endsWith('.doc') || selectedFile.type.includes('wordprocessingml');
        const isTxt = lowerName.endsWith('.txt') || selectedFile.type === 'text/plain';

        if (isTxt) {
          try {
            extractedContent = await selectedFile.text();
          } catch (e) {}
        } else if (isDocx) {
          let docxSuccess = false;
          try {
            let mammoth = window.mammoth;
            if (!mammoth) {
              try {
                const mod = await import('mammoth');
                mammoth = mod?.default || mod;
              } catch (e) {}
            }
            if (!mammoth) {
              await new Promise((res, rej) => {
                const s = document.createElement('script');
                s.src = 'https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js';
                s.onload = res;
                s.onerror = rej;
                document.head.appendChild(s);
              });
              mammoth = window.mammoth;
            }
            if (mammoth && typeof mammoth.extractRawText === 'function') {
              const arrayBuffer = await selectedFile.arrayBuffer();
              const docxResult = await mammoth.extractRawText({ arrayBuffer });
              const val = (docxResult?.value || '').trim();
              if (val && !val.startsWith('PK')) {
                extractedContent = val;
                docxSuccess = true;
              }
            }
          } catch (e) {
            console.warn('Frontend DOCX parse fallback to server API:', e);
          }

          if (!docxSuccess) {
            try {
              const formData = new FormData();
              formData.append('file', selectedFile);
              formData.append('title', selectedFile.name);
              const token = localStorage.getItem('token') || '';
              const sRes = await fetch('/api/materials/upload', {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: formData
              });
              const sData = await sRes.json();
              if (sData?.success && sData?.data?.content_text) {
                extractedContent = sData.data.content_text;
              }
            } catch (err) {
              console.warn('Server docx upload fallback failed:', err);
              extractedContent = `[${selectedFile.name}] (${formatFileSize(selectedFile.size)}) - Word সোর্স ডকুমেন্ট।`;
            }
          }
        } else if (isPdf) {
          try {
            if (!window.pdfjsLib) {
              await new Promise((res, rej) => {
                const s = document.createElement('script');
                s.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
                s.onload = () => {
                  window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
                  res();
                };
                s.onerror = rej;
                document.head.appendChild(s);
              });
            }
            const arrayBuffer = await selectedFile.arrayBuffer();
            const loadingTask = window.pdfjsLib.getDocument({ data: arrayBuffer });
            const pdf = await loadingTask.promise;
            let fullText = '';
            for (let pageNum = 1; pageNum <= Math.min(pdf.numPages, 10); pageNum++) {
              const page = await pdf.getPage(pageNum);
              const textContent = await page.getTextContent();
              const pageStrings = textContent.items.map(item => item.str);
              fullText += pageStrings.join(' ') + '\n\n';
            }
            extractedContent = fullText.trim();
          } catch (e) {
            extractedContent = `[${selectedFile.name}] (${formatFileSize(selectedFile.size)}) - PDF সোর্স ডকুমেন্ট।`;
          }
        }

        if (!extractedContent) {
          extractedContent = `[${selectedFile.name}] (${formatFileSize(selectedFile.size)}) - ${chapter || title} (${liveBadge}) সোর্স ডকুমেন্ট।`;
        }
      }

      const res = await materialAPI.createStudyMaterial({
        title: title.trim(),
        titleBn: title.trim(),
        category,
        classId: selectedClassId ? Number(selectedClassId) : null,
        subjectId: selectedSubjectId ? Number(selectedSubjectId) : null,
        chapter: chapter.trim() || title.trim(),
        chapterBn: chapter.trim() || title.trim(),
        topic: topic.trim(),
        topicBn: topic.trim(),
        board,
        examYear,
        questionType,
        badge: liveBadge,
        academicBadge: liveBadge,
        content_text: extractedContent,
        contentText: extractedContent,
        fileUrl: publicUploadedUrl,
        fileName: selectedFile ? selectedFile.name : `${title.trim()}.txt`,
        fileSize: selectedFile ? formatFileSize(selectedFile.size) : '1.2 MB',
        fileType: selectedFile ? selectedFile.name.split('.').pop().toUpperCase() : 'TXT'
      });

      if (res && res.success) {
        setFeedback({
          type: 'success',
          message: 'স্টাডি ম্যাটেরিয়াল ও একাডেমিক মেটাডাটা সফলভাবে আপলোড হয়েছে!',
          details: `ব্যাজ [ ${liveBadge} ] তৈরি হয়েছে এবং বিষয় ও অধ্যায় সফলভাবে ট্যাগ করা হয়েছে।`
        });

        setTitle('');
        setChapter('');
        setTopic('');
        setPastedText('');
        setSelectedFile(null);
        fetchSourceMaterials();

        if (onUploadSuccess) onUploadSuccess(res.data);
      } else {
        throw new Error(res.error?.message || 'সংরক্ষণ ব্যর্থ হয়েছে');
      }
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err.message || 'আপলোড এবং প্রসেস করার সময় ত্রুটি ঘটেছে।'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteMaterial = async (id) => {
    if (!window.confirm('আপনি কি নিশ্চিত এই সোর্স ম্যাটেরিয়ালটি মুছে ফেলতে চান?')) return;
    try {
      const res = await materialAPI.deleteStudyMaterial(id);
      if (res && res.success) {
        setSourceMaterials(prev => prev.filter(m => m.id !== id));
        if (previewMaterial?.id === id) setPreviewMaterial(null);
      }
    } catch (err) {
      alert('মুছে ফেলা সম্ভব হয়নি: ' + err.message);
    }
  };

  // Filtered Source Materials
  const filteredMaterials = sourceMaterials.filter(m => {
    if (filterBoard !== 'ALL' && m.board && m.board.toLowerCase() !== filterBoard.toLowerCase()) return false;
    if (filterYear !== 'ALL' && m.examYear && !String(m.examYear).includes(filterYear.replace(/^20/, ''))) return false;
    if (filterType !== 'ALL' && m.questionType && m.questionType.toLowerCase() !== filterType.toLowerCase()) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      const match =
        (m.title && m.title.toLowerCase().includes(q)) ||
        (m.chapter && m.chapter.toLowerCase().includes(q)) ||
        (m.topic && m.topic.toLowerCase().includes(q)) ||
        (m.badge && m.badge.toLowerCase().includes(q)) ||
        (m.board && m.board.toLowerCase().includes(q)) ||
        (m.subjectName && m.subjectName.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto font-sans">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-5xl w-full shadow-2xl flex flex-col overflow-hidden text-white my-auto max-h-[94vh]">
        
        {/* Modal Header */}
        <div className="p-5 bg-gradient-to-r from-emerald-950 via-slate-900 to-indigo-950 border-b border-slate-700/80 flex items-center justify-between">
          <div className="flex items-center space-x-3.5">
            <div className="p-2.5 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/20">
              <UploadCloud className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-black text-white">স্টাডি ম্যাটেরিয়াল ও বোর্ড প্রশ্ন আপলোড হাব</h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-black border border-emerald-500/30">
                  ADVANCED METADATA
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                বোর্ড, সাল, অধ্যায় ও টপিক ট্যাগিং সহ স্বয়ংক্রিয় ব্যাজ জেনারেটর এবং এআই সোর্স কানেক্টর
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-slate-950/40">
          
          {/* Feedback Alerts */}
          {feedback && (
            <div className={`p-4 rounded-2xl border flex items-start space-x-3 animate-in fade-in ${
              feedback.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-200'
            }`}>
              {feedback.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
              )}
              <div className="text-xs space-y-1">
                <p className="font-bold">{feedback.message}</p>
                {feedback.details && <p className="text-slate-300 opacity-90">{feedback.details}</p>}
              </div>
              <button
                onClick={() => setFeedback(null)}
                className="ml-auto text-slate-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* UPLOAD FORM SECTION */}
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-md space-y-5">
            
            {/* Mode Switcher */}
            <div className="flex items-center space-x-2 border-b border-slate-800 pb-4">
              <button
                type="button"
                onClick={() => setUploadMode('file')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
                  uploadMode === 'file'
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>ফাইল আপলোড (PDF / Word)</span>
              </button>

              <button
                type="button"
                onClick={() => setUploadMode('text')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
                  uploadMode === 'text'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <FileCode className="w-4 h-4" />
                <span>সরাসরি টেক্সট / নোট পেস্ট</span>
              </button>

              <button
                type="button"
                onClick={() => setUploadMode('drive')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
                  uploadMode === 'drive'
                    ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <HardDrive className="w-4 h-4" />
                <span>গুগল ড্রাইভ ফোল্ডার</span>
              </button>
            </div>

            {/* ACADEMIC METADATA SELECTION GRID */}
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black text-emerald-400 uppercase tracking-wider flex items-center space-x-2">
                  <GraduationCap className="w-4 h-4" />
                  <span>একাডেমিক মেটাডাটা ও শ্রেণিবিন্যাস (Academic Metadata)</span>
                </h4>

                {/* Live Badge Preview Pill */}
                {liveBadge && (
                  <div className="flex items-center space-x-2">
                    <span className="text-[11px] text-slate-400 font-medium">লাইভ ব্যাজ:</span>
                    <span className="px-3 py-1 rounded-full text-xs font-black bg-gradient-to-r from-indigo-500/30 to-purple-500/30 text-indigo-300 border border-indigo-400/50 shadow-sm animate-pulse flex items-center space-x-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>{liveBadge}</span>
                    </span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 text-xs">
                {/* 1. Class Selection */}
                <div>
                  <label className="block font-bold text-slate-300 mb-1">
                    শ্রেণি (Class) <span className="text-rose-400">*</span>
                  </label>
                  <select
                    value={selectedClassId}
                    onChange={(e) => setSelectedClassId(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-800 text-slate-100 font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nameBn || c.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 2. Subject Selection */}
                <div>
                  <label className="block font-bold text-slate-300 mb-1 flex items-center justify-between">
                    <span>পাঠ্য বিষয় (Subject) <span className="text-rose-400">*</span></span>
                    {loadingSubjects && <Loader2 className="w-3 h-3 animate-spin text-emerald-400" />}
                  </label>
                  <select
                    value={selectedSubjectId}
                    disabled={loadingSubjects}
                    onChange={(e) => setSelectedSubjectId(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-800 text-slate-100 font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none disabled:opacity-50"
                  >
                    {loadingSubjects ? (
                      <option value="">বিষয় লোড হচ্ছে...</option>
                    ) : subjects.length > 0 ? (
                      subjects.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.nameBn || s.name} {s.code ? `(${s.code})` : ''}
                        </option>
                      ))
                    ) : (
                      <option value="">কোনো বিষয় নির্ধারিত নেই</option>
                    )}
                  </select>
                </div>

                {/* 3. Education Board Selection */}
                <div>
                  <label className="block font-bold text-slate-300 mb-1">
                    শিক্ষা বোর্ড (Education Board) <span className="text-rose-400">*</span>
                  </label>
                  <select
                    value={board}
                    onChange={(e) => setBoard(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-800 text-slate-100 font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    {BOARDS_LIST.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.nameBn}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 4. Exam Year Selection */}
                <div>
                  <label className="block font-bold text-slate-300 mb-1">
                    পরীক্ষার সাল (Exam Year) <span className="text-rose-400">*</span>
                  </label>
                  <select
                    value={examYear}
                    onChange={(e) => setExamYear(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-800 text-slate-100 font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    {YEARS_LIST.map((y) => (
                      <option key={y} value={y}>
                        {y} (২০{y.slice(2)})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs pt-1">
                {/* 5. Question Type */}
                <div>
                  <label className="block font-bold text-slate-300 mb-1">
                    প্রশ্নের ধরন (Question Type) <span className="text-rose-400">*</span>
                  </label>
                  <select
                    value={questionType}
                    onChange={(e) => setQuestionType(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-800 text-slate-100 font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    {QUESTION_TYPES.map((qt) => (
                      <option key={qt.id} value={qt.id}>
                        {qt.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 6. Chapter (অধ্যায়) */}
                <div>
                  <label className="block font-bold text-slate-300 mb-1">
                    অধ্যায় (Chapter) <span className="text-slate-400 font-normal">(ঐচ্ছিক)</span>
                  </label>
                  <input
                    type="text"
                    value={chapter}
                    onChange={(e) => setChapter(e.target.value)}
                    placeholder="যেমন: অধ্যায় ৩ - বল ও গতির সূত্র"
                    className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-800 text-slate-100 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                {/* 7. Topic (টপিক) */}
                <div>
                  <label className="block font-bold text-slate-300 mb-1">
                    টপিক / বিষয়বস্তু (Topic) <span className="text-slate-400 font-normal">(ঐচ্ছিক)</span>
                  </label>
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="যেমন: নিউটনের গতিসূত্র ও ভরবেগ"
                    className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-800 text-slate-100 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* TITLE INPUT */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                ম্যাটেরিয়াল বা প্রশ্নব্যাংকের শিরোনাম (Title) <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="যেমন: ঢাকা বোর্ড ২০২৫ পদার্থবিজ্ঞান বহুনির্বাচনি প্রশ্ন ও উত্তরপত্র"
                className="w-full p-3 rounded-2xl border border-slate-700 bg-slate-800 text-slate-100 text-xs font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none shadow-inner"
              />
            </div>

            {/* MODE 1: FILE DROPZONE */}
            {uploadMode === 'file' && (
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-300">
                  ফাইল আপলোড (PDF, Word, Text ফাইল) <span className="text-rose-400">*</span>
                </label>
                <label className="border-2 border-dashed border-slate-700 hover:border-emerald-500 bg-slate-800/50 hover:bg-slate-800/80 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all group">
                  <UploadCloud className="w-10 h-10 text-emerald-400 group-hover:scale-110 transition-transform mb-2" />
                  <span className="text-xs font-bold text-slate-200">
                    {selectedFile ? selectedFile.name : 'ক্লিক করে ফাইল সিলেক্ট করুন অথবা ড্র্যাগ & ড্রপ করুন'}
                  </span>
                  <span className="text-[11px] text-slate-400 mt-1">
                    PDF, DOCX, TXT (সর্বোচ্চ {GLOBAL_MAX_FILE_SIZE_MB}MB)
                  </span>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept=".pdf,.docx,.txt"
                    className="hidden"
                  />
                </label>
              </div>
            )}

            {/* MODE 2: RAW TEXT INPUT */}
            {uploadMode === 'text' && (
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-300">
                  সরাসরি লেকচার নোট বা প্রশ্ন টেক্সট পেস্ট করুন <span className="text-rose-400">*</span>
                </label>
                <textarea
                  rows={6}
                  value={pastedText}
                  onChange={(e) => setPastedText(e.target.value)}
                  placeholder="এখানে প্রশ্নের উদ্দীপক, MCQ প্রশ্ন, CQ সৃজনশীল বা অধ্যায়ের মূল নোট পেস্ট করুন..."
                  className="w-full p-3.5 rounded-2xl border border-slate-700 bg-slate-800 text-slate-100 text-xs font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none leading-relaxed"
                />
              </div>
            )}

            {/* MODE 3: GOOGLE DRIVE */}
            {uploadMode === 'drive' && (
              <div className="space-y-3 p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/30">
                <label className="block text-xs font-bold text-cyan-300">
                  গুগল ড্রাইভ ফোল্ডার URL বা ID
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={driveFolderUrl}
                    onChange={(e) => setDriveFolderUrl(e.target.value)}
                    placeholder="https://drive.google.com/drive/folders/..."
                    className="flex-1 p-2.5 rounded-xl border border-slate-700 bg-slate-800 text-slate-100 text-xs font-medium focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    disabled={isScanningDrive || !driveFolderUrl.trim()}
                    onClick={handleScanDriveFolder}
                    className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-md flex items-center space-x-1.5 disabled:opacity-50"
                  >
                    {isScanningDrive ? <Loader2 className="w-4 h-4 animate-spin" /> : <FolderOpen className="w-4 h-4" />}
                    <span>স্ক্যান</span>
                  </button>
                </div>

                {driveScanResult && driveScanResult.files && (
                  <div className="space-y-2 pt-2">
                    <p className="text-xs text-slate-300 font-bold">সিলেক্টেড ড্রাইভ ফাইল ({selectedDriveFiles.length}টি):</p>
                    <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1">
                      {driveScanResult.files.filter(f => f.isSupported).map((f) => (
                        <div
                          key={f.id}
                          onClick={() => toggleDriveFile(f)}
                          className={`p-2 rounded-xl border text-xs flex items-center justify-between cursor-pointer ${
                            selectedDriveFiles.some(df => df.id === f.id)
                              ? 'bg-cyan-950/60 border-cyan-500/60 text-white'
                              : 'bg-slate-800/60 border-slate-700 text-slate-400'
                          }`}
                        >
                          <span className="truncate">{f.name}</span>
                          <span className="text-[10px] font-mono text-cyan-300">{f.size}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* SUBMIT BUTTON */}
            <div className="flex justify-end pt-2">
              {uploadMode === 'drive' ? (
                <button
                  type="button"
                  disabled={isSyncingDrive || selectedDriveFiles.length === 0}
                  onClick={handleSyncDriveMaterials}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white text-xs font-black shadow-lg shadow-cyan-600/30 flex items-center space-x-2 transition-all active:scale-95 disabled:opacity-50"
                >
                  {isSyncingDrive ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>সিঙ্ক হচ্ছে...</span>
                    </>
                  ) : (
                    <>
                      <HardDrive className="w-4 h-4" />
                      <span>ড্রাইভ ফাইলসমূহ সিঙ্ক ও সেভ করুন ({selectedDriveFiles.length})</span>
                    </>
                  )}
                </button>
              ) : (
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handleUploadAndProcess}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black shadow-lg shadow-emerald-600/30 flex items-center space-x-2 transition-all active:scale-95 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>প্রসেস ও সংরক্ষণ হচ্ছে...</span>
                    </>
                  ) : (
                    <>
                      <UploadCloud className="w-4 h-4" />
                      <span>সংরক্ষণ ও ব্যাজ যুক্ত করুন (Save Material)</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* EXISTING SOURCE MATERIALS LIST WITH FILTERING */}
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-md space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-indigo-400" />
                <h4 className="text-sm font-black text-white">সংরক্ষিত স্টাডি সোর্স ও প্রশ্নব্যাংক তালিকা</h4>
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-950 text-indigo-300 text-xs font-bold border border-indigo-800">
                  {filteredMaterials.length}টি ফাইল
                </span>
              </div>

              <button
                type="button"
                onClick={fetchSourceMaterials}
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors flex items-center space-x-1 text-xs"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingList ? 'animate-spin' : ''}`} />
                <span>রিফ্রেশ</span>
              </button>
            </div>

            {/* FILTER TOOLBAR */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs">
              {/* Search */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="শিরোনাম, অধ্যায় বা টপিক খুঁজুন..."
                  className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-700 bg-slate-800 text-slate-100 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              {/* Board Filter */}
              <div>
                <select
                  value={filterBoard}
                  onChange={(e) => setFilterBoard(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-700 bg-slate-800 text-slate-100 font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="ALL">সকল শিক্ষা বোর্ড (All Boards)</option>
                  {BOARDS_LIST.map(b => (
                    <option key={b.id} value={b.id}>{b.id} বোর্ড</option>
                  ))}
                </select>
              </div>

              {/* Year Filter */}
              <div>
                <select
                  value={filterYear}
                  onChange={(e) => setFilterYear(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-700 bg-slate-800 text-slate-100 font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="ALL">সকল পরীক্ষার সাল (All Years)</option>
                  {YEARS_LIST.map(y => (
                    <option key={y} value={y}>{y} সাল</option>
                  ))}
                </select>
              </div>

              {/* Type Filter */}
              <div>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-700 bg-slate-800 text-slate-100 font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="ALL">সকল প্রশ্নের ধরন (All Types)</option>
                  {QUESTION_TYPES.map(qt => (
                    <option key={qt.id} value={qt.id}>{qt.id}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* MATERIAL CARDS GRID */}
            {loadingList ? (
              <div className="p-8 text-center text-slate-400 flex flex-col items-center space-y-2">
                <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
                <span className="text-xs">ম্যাটেরিয়াল লোড হচ্ছে...</span>
              </div>
            ) : filteredMaterials.length === 0 ? (
              <div className="p-8 text-center bg-slate-950/40 rounded-2xl border border-dashed border-slate-800">
                <Bookmark className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-400">কোনো স্টাডি ম্যাটেরিয়াল পাওয়া যায়নি</p>
                <p className="text-[11px] text-slate-500 mt-0.5">নতুন ফাইল আপলোড করুন অথবা ফিল্টার পরিবর্তন করুন</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 max-h-96 overflow-y-auto pr-1">
                {filteredMaterials.map((m) => (
                  <div
                    key={m.id}
                    className="p-4 rounded-2xl border border-slate-800 bg-slate-950/70 hover:border-indigo-500/50 transition-all space-y-2.5 flex flex-col justify-between"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        {/* Academic Badge */}
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-indigo-950 text-indigo-300 border border-indigo-500/40 shadow-sm flex items-center space-x-1">
                          <Tag className="w-3 h-3 text-indigo-400" />
                          <span>{m.badge || m.academicBadge || 'বোর্ড প্রশ্ন'}</span>
                        </span>

                        <span className="text-[10px] font-mono text-slate-400">
                          {m.fileSize || '1.5 MB'} • {m.fileType || 'PDF'}
                        </span>
                      </div>

                      <h5 className="font-bold text-xs text-white line-clamp-1">{m.title}</h5>

                      <div className="text-[11px] text-slate-300 space-y-0.5">
                        {m.chapter && (
                          <p className="text-emerald-400 font-medium line-clamp-1">📖 {m.chapter}</p>
                        )}
                        {m.topic && (
                          <p className="text-slate-400 line-clamp-1">🎯 টপিক: {m.topic}</p>
                        )}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                      <span className="text-[10px] text-slate-400 font-medium">
                        {m.className || 'শ্রেণি'} • {m.subjectName || m.category}
                      </span>

                      <div className="flex items-center space-x-1">
                        <button
                          type="button"
                          onClick={() => setPreviewMaterial(m)}
                          className="p-1.5 text-slate-400 hover:text-indigo-300 hover:bg-slate-800 rounded-lg transition-colors"
                          title="কন্টেন্ট প্রিভিউ"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteMaterial(m.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
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

          {/* PREVIEW MODAL / DRAWER */}
          {previewMaterial && (
            <div className="p-5 rounded-3xl bg-slate-900 border border-indigo-500/40 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                    {previewMaterial.badge || 'সোর্স প্রিভিউ'}
                  </span>
                  <h4 className="font-bold text-xs text-white">{previewMaterial.title}</h4>
                </div>
                <button
                  type="button"
                  onClick={() => setPreviewMaterial(null)}
                  className="p-1 text-slate-400 hover:text-white rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 max-h-60 overflow-y-auto text-xs font-mono text-slate-300 whitespace-pre-wrap leading-relaxed">
                {previewMaterial.content_text || 'কোনো এক্সট্রাক্ট করা টেক্সট পাওয়া যায়নি।'}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>NextGen Academy • AI Question Bank & Academic Metadata Engine</span>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition-all"
          >
            বন্ধ করুন
          </button>
        </div>

      </div>
    </div>
  );
}
