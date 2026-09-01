import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  FileText,
  Printer,
  Copy,
  PlayCircle,
  Plus,
  Trash2,
  Search,
  CheckCircle2,
  Database,
  Layers,
  BookOpen,
  Calendar,
  Sparkles,
  RefreshCw,
  Eye,
  Check,
  X,
  Sliders,
  FolderOpen,
  Filter
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { questionRepositoryAPI, examAPI } from '../../services/api';
import MathRenderer from '../common/MathRenderer';
import { DEFAULT_QUESTION_BANK } from '../../data/questionBankDefaultData';

const CLASSES_LIST = [
  'Class 9-10 (SSC)',
  'Class 11-12 (HSC)',
  'নবম শ্রেণি (Class 9)',
  'দশম শ্রেণি (Class 10)',
  'একাদশ শ্রেণি (Class 11)',
  'দ্বাদশ শ্রেণি (Class 12)',
  'অষ্টম শ্রেণি (Class 8)',
  'সপ্তম শ্রেণি (Class 7)',
  'ষষ্ঠ শ্রেণি (Class 6)'
];

const SUBJECTS_LIST = [
  'উচ্চতর গণিত (Higher Math)',
  'সাধারণ গণিত (General Math)',
  'পদার্থবিজ্ঞান (Physics)',
  'রসায়ন (Chemistry)',
  'জীববিজ্ঞান (Biology)',
  'তথ্য ও যোগাযোগ প্রযুক্তি / আইসিটি (ICT)',
  'বাংলাদেশ ও বিশ্বপরিচয় (BGS)',
  'সাধারণ বিজ্ঞান (General Science)',
  'বাংলা ১ম পত্র (সাহিত্য)',
  'বাংলা ২য় পত্র (বাংলা ব্যাকরণ ও নির্মিতি)',
  'ইংরেজি ১ম পত্র (English 1st Paper)',
  'ইংরেজি ২য় পত্র (English 2nd Paper)',
  'হিসাববিজ্ঞান (Accounting)',
  'ফিন্যান্স ও ব্যাংকিং (Finance & Banking)',
  'ব্যবসায় উদ্যোগ (Business Studies)',
  'ইসলাম ও নৈতিক শিক্ষা',
  'হিন্দুধর্ম ও নৈতিক শিক্ষা'
];

const BOARDS_LIST = [
  'সকল বোর্ড',
  'ঢাকা বোর্ড',
  'রাজশাহী বোর্ড',
  'যশোর বোর্ড',
  'কুমিল্লা বোর্ড',
  'চট্টগ্রাম বোর্ড',
  'সিলেট বোর্ড',
  'বরিশাল বোর্ড',
  'দিনাজপুর বোর্ড',
  'ময়মনসিংহ বোর্ড',
  'মাদ্রাসা বোর্ড'
];

export default function AIQuestionMakerHub({ onNavigateToUpload, onNavigateToOMR }) {
  const { lang } = useLanguage();

  // Paper Configuration
  const [examTitle, setExamTitle] = useState('NextGen Academy - বিশেষ মডেল টেস্ট');
  const [instituteName, setInstituteName] = useState('NextGen Academy');
  const [selectedClass, setSelectedClass] = useState(CLASSES_LIST[0]); // Class 9-10 (SSC)
  const [selectedSubject, setSelectedSubject] = useState(SUBJECTS_LIST[0]); // Higher Math
  const [examDuration, setExamDuration] = useState(30);

  // Vault Browsing & Selection State
  const [repoQuestions, setRepoQuestions] = useState([]);
  const [loadingRepo, setLoadingRepo] = useState(false);
  const [vaultFilter, setVaultFilter] = useState('ALL'); // 'ALL' | 'MCQ' | 'CQ' | 'SQ'
  const [selectedVaultBoard, setSelectedVaultBoard] = useState('সকল বোর্ড');
  const [searchTerm, setSearchTerm] = useState('');

  // Selected Paper Questions
  const [selectedPaperQuestions, setSelectedPaperQuestions] = useState([]);

  // Publish Modal State
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [publishDate, setPublishDate] = useState(new Date().toISOString().split('T')[0]);
  const [isPublishing, setIsPublishing] = useState(false);

  useEffect(() => {
    fetchRepoQuestions();
  }, []);

  const fetchRepoQuestions = async () => {
    setLoadingRepo(true);
    try {
      let list = [];
      try {
        const res = await questionRepositoryAPI?.getQuestions?.();
        if (res?.data?.questions && Array.isArray(res.data.questions)) {
          list = res.data.questions;
        } else if (Array.isArray(res?.data)) {
          list = res.data;
        } else if (Array.isArray(res?.questions)) {
          list = res.questions;
        } else if (Array.isArray(res)) {
          list = res;
        }
      } catch (e) {}

      // Format questions from DEFAULT_QUESTION_BANK with accurate Subject tags
      const formattedDefaultBank = (DEFAULT_QUESTION_BANK || []).map((q) => {
        let subjectName = 'উচ্চতর গণিত';
        const qTags = Array.isArray(q.tags) ? q.tags : [];

        if (qTags.some(t => t.includes('উচ্চতর গণিত')) || q.book?.includes('উচ্চতর')) {
          subjectName = 'উচ্চতর গণিত';
        } else if (qTags.some(t => t.includes('সাধারণ গণিত')) || q.chapter?.includes('সেট ও ফাংশন')) {
          subjectName = 'সাধারণ গণিত';
        } else if (qTags.some(t => t.includes('পদার্থবিজ্ঞান')) || q.book?.includes('পদার্থ')) {
          subjectName = 'পদার্থবিজ্ঞান';
        } else if (qTags.some(t => t.includes('রসায়ন')) || q.book?.includes('রসায়ন')) {
          subjectName = 'রসায়ন';
        } else if (qTags.some(t => t.includes('জীববিজ্ঞান')) || q.book?.includes('জীব')) {
          subjectName = 'জীববিজ্ঞান';
        } else if (qTags.some(t => t.includes('আইসিটি') || t.includes('ICT'))) {
          subjectName = 'তথ্য ও যোগাযোগ প্রযুক্তি / আইসিটি';
        }

        return {
          id: `qb-${q.id}`,
          M_ID: `qb-${q.id}`,
          question: q.questionText,
          stem: q.questionText,
          type: q.questionType || 'MCQ',
          options: q.options || [],
          correctAnswer: q.answer === 'A' ? 0 : q.answer === 'B' ? 1 : q.answer === 'C' ? 2 : q.answer === 'D' ? 3 : 0,
          marks: q.marks || (q.questionType === 'CQ' ? 10 : q.questionType === 'SQ' ? 2 : 1),
          book: subjectName,
          subject: subjectName,
          chapter: q.chapter || 'সাধারণ অধ্যায়',
          board: q.board || '',
          year: q.year || '',
          institutionOrBoard: q.board ? `${q.board} ${q.year || ''}`.trim() : 'বোর্ড প্রশ্ন',
          badge: `[${subjectName}] ${q.board || ''} ${q.year || ''}`.trim(),
          explanation: q.explanation || '',
          creativeSubQuestions: q.creativeSubQuestions || q.subQuestions || null,
          subQuestions: q.creativeSubQuestions || q.subQuestions || null,
          shortAnswer: q.shortAnswer || q.answerText || '',
          tags: qTags
        };
      });

      const existingIds = new Set(list.map(q => String(q.id || q.M_ID)));
      const newItems = formattedDefaultBank.filter(q => !existingIds.has(String(q.id || q.M_ID)));
      list = [...list, ...newItems];

      // Sync with localStorage
      try {
        const localCache = JSON.parse(localStorage.getItem('nextgen_custom_repo_questions') || '[]');
        if (localCache.length > 0) {
          const apiIds = new Set(list.map(q => String(q.id || q.M_ID)));
          const localOnly = localCache.filter(q => !apiIds.has(String(q.id || q.M_ID)));
          if (localOnly.length > 0) {
            list = [...localOnly, ...list];
          }
        }
      } catch (e) {}

      setRepoQuestions(list);
    } catch (err) {
      console.warn('Could not load repository questions:', err);
      try {
        const localCache = JSON.parse(localStorage.getItem('nextgen_custom_repo_questions') || '[]');
        setRepoQuestions(localCache);
      } catch (e) {
        setRepoQuestions([]);
      }
    } finally {
      setLoadingRepo(false);
    }
  };

  // 1. Filter Questions Strictly by the Active Selected Subject
  const subjectFilteredQuestions = useMemo(() => {
    const safe = Array.isArray(repoQuestions) ? repoQuestions : [];
    if (!selectedSubject) return safe;

    const selSub = selectedSubject.toLowerCase();
    return safe.filter(q => {
      const qSub = String(q?.subject || q?.book || '').toLowerCase();
      const qTags = Array.isArray(q?.tags) ? q.tags.map(t => String(t).toLowerCase()) : [];

      if (selSub.includes('উচ্চতর গণিত') || selSub.includes('higher math')) {
        return qSub.includes('উচ্চতর') || qTags.some(t => t.includes('উচ্চতর'));
      }
      if (selSub.includes('সাধারণ গণিত') || selSub.includes('general math')) {
        return (qSub.includes('সাধারণ গণিত') || qTags.some(t => t.includes('সাধারণ গণিত'))) && !qSub.includes('উচ্চতর');
      }
      if (selSub.includes('পদার্থবিজ্ঞান') || selSub.includes('physics')) {
        return qSub.includes('পদার্থ') || qTags.some(t => t.includes('পদার্থ'));
      }
      if (selSub.includes('রসায়ন') || selSub.includes('chemistry')) {
        return qSub.includes('রসায়ন') || qTags.some(t => t.includes('রসায়ন'));
      }
      if (selSub.includes('জীববিজ্ঞান') || selSub.includes('biology')) {
        return qSub.includes('জীব') || qTags.some(t => t.includes('জীব'));
      }
      if (selSub.includes('তথ্য ও যোগাযোগ') || selSub.includes('ict') || selSub.includes('আইসিটি')) {
        return qSub.includes('আইসিটি') || qSub.includes('ict') || qTags.some(t => t.includes('ict') || t.includes('আইসিটি'));
      }
      return true;
    });
  }, [repoQuestions, selectedSubject]);

  // 2. Further Filter by Type (ALL | MCQ | CQ | SQ), Board, and Search
  const filteredVaultQuestions = useMemo(() => {
    return subjectFilteredQuestions.filter(q => {
      const rawType = String(q?.type || '').toUpperCase().trim();
      const targetFilter = String(vaultFilter || 'ALL').toUpperCase().trim();
      
      let matchesType = targetFilter === 'ALL';
      if (!matchesType) {
        if (targetFilter === 'MCQ') {
          matchesType = rawType === 'MCQ' || rawType === 'MULTIPLE_CHOICE' || (Array.isArray(q?.options) && q.options.length > 0);
        } else if (targetFilter === 'CQ') {
          matchesType = rawType === 'CQ' || rawType === 'CREATIVE' || Boolean(q?.creativeSubQuestions || (q?.subQuestions && Object.keys(q.subQuestions).length > 0));
        } else if (targetFilter === 'SQ') {
          matchesType = rawType === 'SQ' || rawType === 'SHORT' || rawType === 'SHORT_QUESTION' || Boolean(q?.shortAnswer);
        } else {
          matchesType = rawType === targetFilter;
        }
      }

      // Board Filter
      let matchesBoard = true;
      if (selectedVaultBoard && selectedVaultBoard !== 'সকল বোর্ড') {
        const boardKey = selectedVaultBoard.replace(' বোর্ড', '').trim().toLowerCase();
        const bStr = String(q?.board || q?.institutionOrBoard || q?.badge || q?.question || '').toLowerCase();
        matchesBoard = bStr.includes(boardKey);
      }

      // Search Filter
      const qText = String(q?.question || q?.stem || '').toLowerCase();
      const qInst = String(q?.institutionOrBoard || q?.board || '').toLowerCase();
      const qChapter = String(q?.chapter || '').toLowerCase();
      const search = (searchTerm || '').toLowerCase().trim();

      const matchesSearch = !search || qText.includes(search) || qInst.includes(search) || qChapter.includes(search);

      return matchesType && matchesBoard && matchesSearch;
    });
  }, [subjectFilteredQuestions, vaultFilter, selectedVaultBoard, searchTerm]);

  // Toggle Question Selection for Exam Paper
  const toggleSelectQuestion = (question) => {
    const qId = question?.id || question?.M_ID;
    const exists = selectedPaperQuestions.some(q => (q?.id || q?.M_ID) === qId);

    if (exists) {
      setSelectedPaperQuestions(prev => prev.filter(q => (q?.id || q?.M_ID) !== qId));
    } else {
      setSelectedPaperQuestions(prev => [...prev, question]);
    }
  };

  // Select all visible questions
  const handleSelectAllVisible = () => {
    const newItems = filteredVaultQuestions.filter(vq => {
      const vId = vq?.id || vq?.M_ID;
      return !selectedPaperQuestions.some(sq => (sq?.id || sq?.M_ID) === vId);
    });
    setSelectedPaperQuestions(prev => [...prev, ...newItems]);
  };

  // Calculate Total Marks
  const totalMarks = useMemo(() => {
    return selectedPaperQuestions.reduce((acc, q) => {
      const m = Number(q?.marks) || (q?.type === 'CQ' ? 10 : q?.type === 'SQ' ? 2 : 1);
      return acc + m;
    }, 0);
  }, [selectedPaperQuestions]);

  // Print A4 Exam Sheet with KaTeX Math Auto-Rendering
  const handlePrintExam = () => {
    if (selectedPaperQuestions.length === 0) {
      alert('প্রশ্নপত্র প্রিন্ট করার আগে ভাণ্ডার থেকে অন্তত একটি প্রশ্ন নির্বাচন করুন।');
      return;
    }

    const printWin = window.open('', '_blank', 'width=850,height=1000');
    if (!printWin) {
      window.print();
      return;
    }

    let html = `
<!DOCTYPE html>
<html lang="bn">
<head>
  <meta charset="UTF-8">
  <title>${examTitle} - NextGen Academy</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css">
  <script src="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/contrib/auto-render.min.js"></script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;600;700;800&display=swap');
    @page { size: A4 portrait; margin: 15mm 12mm 15mm 12mm; }
    body {
      font-family: 'Hind Siliguri', 'SolaimanLipi', Arial, sans-serif;
      color: #0f172a;
      line-height: 1.5;
      font-size: 13px;
      margin: 0;
      padding: 0;
      background: #fff;
    }
    .header {
      text-align: center;
      border-bottom: 2px solid #0f172a;
      padding-bottom: 8px;
      margin-bottom: 14px;
    }
    .inst-name {
      font-size: 22px;
      font-weight: 800;
      color: #0f172a;
      margin: 0;
    }
    .exam-title {
      font-size: 16px;
      font-weight: 700;
      color: #1e293b;
      margin: 3px 0;
    }
    .meta-bar {
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      font-weight: 700;
      margin-top: 6px;
      padding-top: 4px;
      border-top: 1px dashed #cbd5e1;
    }
    .q-list {
      display: flex;
      flex-direction: column;
      gap: 14px;
    }
    .q-item {
      page-break-inside: avoid;
    }
    .q-head {
      font-weight: 800;
      font-size: 13px;
      display: flex;
      justify-content: space-between;
      margin-bottom: 2px;
    }
    .q-stem {
      margin: 2px 0 6px 0;
      white-space: pre-wrap;
    }
    .options-vertical {
      display: flex;
      flex-direction: column;
      gap: 4px;
      margin-top: 6px;
      margin-left: 12px;
      font-size: 12.5px;
    }
    .sub-q-box {
      margin-left: 12px;
      margin-top: 6px;
      display: flex;
      flex-direction: column;
      gap: 4px;
      font-size: 12.5px;
    }
    .sub-q-row {
      display: flex;
      justify-content: space-between;
    }
    .footer {
      margin-top: 24px;
      padding-top: 8px;
      border-top: 1px solid #cbd5e1;
      font-size: 10px;
      display: flex;
      justify-content: space-between;
      color: #64748b;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="inst-name">${instituteName}</div>
    <div class="exam-title">${examTitle}</div>
    <div class="meta-bar">
      <span>বিষয়: ${selectedSubject} • শ্রেণি: ${selectedClass}</span>
      <span>সময়: ${examDuration} মিনিট | পূর্ণমান: ${totalMarks}</span>
    </div>
  </div>

  <div class="q-list">
    ${selectedPaperQuestions.map((q, idx) => {
      const isCQ = q?.type === 'CQ' || Boolean(q?.creativeSubQuestions || q?.subQuestions);
      const isSQ = q?.type === 'SQ';
      const cSubs = q?.creativeSubQuestions || q?.subQuestions;

      return `
      <div class="q-item">
        <div class="q-head">
          <span><strong>প্রশ্ন ${idx + 1}.</strong> [${q?.type || 'প্রশ্ন'}]</span>
          <span>[${q?.marks || (isCQ ? 10 : isSQ ? 2 : 1)} নম্বর]</span>
        </div>
        <div class="q-stem">${q?.question?.split('\n\n**ক.**')[0]?.replace(/^\[.*?\]\s*উদ্দীপক:\s*/i, '') || q?.question || q?.stem || ''}</div>
        
        ${q?.type === 'MCQ' && Array.isArray(q?.options) && q.options.length > 0 ? `
          <div class="options-vertical">
            ${q.options.map((opt, oIdx) => {
              const bLabels = ['(ক)', '(খ)', '(গ)', '(ঘ)'];
              const cleanOpt = String(opt).replace(/^[কখগঘabcdABCD][\)\.\-:]\s*/, '');
              return `<div><strong>${bLabels[oIdx] || `(${oIdx + 1})`}</strong> ${cleanOpt}</div>`;
            }).join('')}
          </div>
        ` : ''}

        ${isCQ && cSubs ? `
          <div class="sub-q-box">
            ${cSubs.a ? `<div class="sub-q-row"><span><strong>(ক)</strong> ${cSubs.a.q || cSubs.a}</span><span>[${cSubs.a.marks || 2} নম্বর]</span></div>` : ''}
            ${cSubs.b ? `<div class="sub-q-row"><span><strong>(খ)</strong> ${cSubs.b.q || cSubs.b}</span><span>[${cSubs.b.marks || 4} নম্বর]</span></div>` : ''}
            ${cSubs.c ? `<div class="sub-q-row"><span><strong>(গ)</strong> ${cSubs.c.q || cSubs.c}</span><span>[${cSubs.c.marks || 4} নম্বর]</span></div>` : ''}
            ${cSubs.d ? `<div class="sub-q-row"><span><strong>(ঘ)</strong> ${cSubs.d.q || cSubs.d}</span><span>[${cSubs.d.marks || 4} নম্বর]</span></div>` : ''}
          </div>
        ` : ''}
      </div>
      `;
    }).join('')}
  </div>

  <div class="footer">
    <span>NextGen Academy • অফিশিয়াল প্রশ্নপত্র ইঞ্জিন</span>
    <span>প্রিন্ট তারিখ: ${new Date().toLocaleDateString('bn-BD')}</span>
  </div>

  <script>
    window.onload = function() {
      if (window.renderMathInElement) {
        renderMathInElement(document.body, {
          delimiters: [
            {left: '$$', right: '$$', display: true},
            {left: '$', right: '$', display: false},
            {left: '\\\\(', right: '\\\\)', display: false},
            {left: '\\\\([', right: '\\\\)', display: true}
          ],
          throwOnError: false
        });
      }
      setTimeout(function() { window.print(); }, 400);
    };
  </script>
</body>
</html>`;

    printWin.document.open();
    printWin.document.write(html);
    printWin.document.close();
  };

  // Copy Paper text
  const handleCopyPaper = () => {
    if (selectedPaperQuestions.length === 0) return;
    let text = `${instituteName}\n${examTitle}\nবিষয়: ${selectedSubject} | শ্রেণি: ${selectedClass} | পূর্ণমান: ${totalMarks}\n\n`;

    selectedPaperQuestions.forEach((q, idx) => {
      text += `প্রশ্ন ${idx + 1}. (${q?.type || 'Q'})\n${q?.question || q?.stem || ''}\n`;
      if (q?.type === 'MCQ' && Array.isArray(q?.options)) {
        const bLabels = ['(ক)', '(খ)', '(গ)', '(ঘ)'];
        q.options.forEach((opt, oIdx) => {
          const clean = String(opt).replace(/^[কখগঘabcdABCD][\)\.\-:]\s*/, '');
          text += `  ${bLabels[oIdx] || `(${oIdx + 1})`} ${clean}\n`;
        });
      }
      const cSubs = q?.creativeSubQuestions || q?.subQuestions;
      if (cSubs) {
        if (cSubs.a) text += `  (ক) ${cSubs.a.q || cSubs.a} [${cSubs.a.marks || 2}]\n`;
        if (cSubs.b) text += `  (খ) ${cSubs.b.q || cSubs.b} [${cSubs.b.marks || 4}]\n`;
        if (cSubs.c) text += `  (গ) ${cSubs.c.q || cSubs.c} [${cSubs.c.marks || 4}]\n`;
        if (cSubs.d) text += `  (ঘ) ${cSubs.d.q || cSubs.d} [${cSubs.d.marks || 4}]\n`;
      }
      text += '\n';
    });

    navigator.clipboard.writeText(text);
    alert('✅ প্রশ্নপত্র ক্লিপবোর্ডে কপি করা হয়েছে!');
  };

  // 1-Click Publish to Live Online Exam
  const handlePublishExam = async () => {
    if (selectedPaperQuestions.length === 0) return;
    setIsPublishing(true);

    try {
      const examPayload = {
        title: examTitle,
        titleBn: examTitle,
        subject: selectedSubject,
        examType: 'ONLINE_MCQ',
        durationMinutes: Number(examDuration) || 30,
        totalMarks: totalMarks || 25,
        passMarks: Math.ceil((totalMarks || 25) * 0.4),
        negativeMarking: 0.25,
        shuffleQuestions: true,
        examDate: publishDate,
        startTime: '10:00',
        endTime: '23:59',
        questions: selectedPaperQuestions.map((q, idx) => ({
          questionNumber: idx + 1,
          questionText: q.question || q.stem,
          type: q.type || 'MCQ',
          options: Array.isArray(q.options) && q.options.length > 0 ? q.options : ['বিকল্প ১', 'বিকল্প ২', 'বিকল্প ৩', 'বিকল্প ৪'],
          correctOptionIndex: q.correctAnswer || 0,
          marks: q.marks || 1,
          explanation: q.explanation || '',
          badge: q.badge || 'NextGen Vault'
        }))
      };

      const res = await examAPI.create(examPayload);
      if (res?.success) {
        alert('🚀 অভিনন্দন! অনলাইন পরীক্ষাটি সফলভাবে শিক্ষার্থীদের জন্য লাইভ প্রকাশ করা হয়েছে!');
        setShowPublishModal(false);
      } else {
        alert('পরীক্ষা প্রকাশ ব্যর্থ: ' + (res?.error?.message || 'সমস্যা হয়েছে'));
      }
    } catch (err) {
      alert('পরীক্ষা প্রকাশে ত্রুটি: ' + err.message);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden border border-teal-500/30">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 bg-teal-500/20 text-teal-300 border border-teal-500/30 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md mb-2">
              <FileText className="w-3.5 h-3.5 text-teal-400" />
              <span>প্রশ্নপত্র বিল্ডার ও প্রিন্টার হাব</span>
            </div>
            <h2 className="text-xl md:text-2xl font-black tracking-tight">
              ম্যানুয়াল প্রশ্নপত্র প্রস্তুতকারক (Question Paper Builder)
            </h2>
            <p className="text-xs md:text-sm text-slate-300 mt-1">
              ভাণ্ডার থেকে আপনার নির্বাচিত বিষয়ের MCQ, CQ ও SQ প্রশ্ন বাছাই করে সাজান, A4 প্রিন্ট করুন অথবা লাইভ প্রকাশ করুন।
            </p>
          </div>

          <div className="flex items-center gap-2">
            {onNavigateToUpload && (
              <button
                type="button"
                onClick={onNavigateToUpload}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-black transition-all flex items-center space-x-2 shadow-lg shadow-indigo-600/30 cursor-pointer"
              >
                <Database className="w-4 h-4" />
                <span>ভাণ্ডারে প্রশ্ন যুক্ত করুন</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid: Left Vault Browser, Right Live Paper Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Vault Questions Browser */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-4">
            
            {/* Header with Title & Action */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 flex-wrap gap-2">
              <div className="flex items-center space-x-2">
                <Database className="w-4 h-4 text-teal-600" />
                <div>
                  <h3 className="font-black text-sm text-slate-900 uppercase tracking-wider">
                    ১. ভাণ্ডার থেকে প্রশ্ন নির্বাচন ({filteredVaultQuestions.length} টি)
                  </h3>
                  <p className="text-[11px] font-bold text-teal-700">
                    ফিল্টারকৃত বিষয়: {selectedSubject}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleSelectAllVisible}
                className="text-xs font-bold text-teal-600 hover:text-teal-700 cursor-pointer"
              >
                + দৃশ্যমান সব যোগ করুন
              </button>
            </div>

            {/* Quick Filter Toolbar: Type Tabs & Board Dropdown */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                {/* Type Switcher */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <button
                    type="button"
                    onClick={() => setVaultFilter('ALL')}
                    className={'px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ' + (
                      vaultFilter === 'ALL' ? 'bg-slate-900 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    )}
                  >
                    সকল ({subjectFilteredQuestions.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setVaultFilter('MCQ')}
                    className={'px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ' + (
                      vaultFilter === 'MCQ' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                    )}
                  >
                    MCQ ({subjectFilteredQuestions.filter(q => q?.type === 'MCQ').length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setVaultFilter('CQ')}
                    className={'px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ' + (
                      vaultFilter === 'CQ' ? 'bg-purple-600 text-white shadow-xs' : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
                    )}
                  >
                    CQ ({subjectFilteredQuestions.filter(q => q?.type === 'CQ' || Boolean(q?.creativeSubQuestions)).length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setVaultFilter('SQ')}
                    className={'px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ' + (
                      vaultFilter === 'SQ' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                    )}
                  >
                    SQ ({subjectFilteredQuestions.filter(q => q?.type === 'SQ' || q?.type === 'SHORT').length})
                  </button>
                </div>

                {/* Board Dropdown Filter */}
                <select
                  value={selectedVaultBoard}
                  onChange={(e) => setSelectedVaultBoard(e.target.value)}
                  className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
                >
                  {BOARDS_LIST.map(b => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              {/* Search Input */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="প্রশ্ন, অধ্যায় বা টপিক দিয়ে খুঁজুন..."
                  className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Questions Selection List */}
            <div className="max-h-[540px] overflow-y-auto space-y-3 pr-1 custom-scrollbar">
              {loadingRepo ? (
                <div className="p-8 text-center text-slate-400 space-y-2">
                  <RefreshCw className="w-6 h-6 animate-spin mx-auto text-teal-600" />
                  <p className="text-xs font-bold">ভাণ্ডার থেকে প্রশ্ন লোড হচ্ছে...</p>
                </div>
              ) : filteredVaultQuestions.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-100 text-slate-400 space-y-2">
                  <FolderOpen className="w-8 h-8 mx-auto text-slate-300" />
                  <p className="text-xs font-bold text-slate-700">এই বিষয়ের কোনো প্রশ্ন পাওয়া যায়নি</p>
                  <p className="text-[11px] text-slate-500">ডানপাশের ড্রপডাউন থেকে সঠিক বিষয় নির্বাচন করুন।</p>
                </div>
              ) : (
                filteredVaultQuestions.map((q, idx) => {
                  const qId = q?.id || q?.M_ID || idx;
                  const isSelected = selectedPaperQuestions.some(sq => (sq?.id || sq?.M_ID) === qId);
                  const isCQ = q?.type === 'CQ' || Boolean(q?.creativeSubQuestions);
                  const isSQ = q?.type === 'SQ';
                  const cSubs = q?.creativeSubQuestions || q?.subQuestions;

                  return (
                    <div
                      key={qId}
                      onClick={() => toggleSelectQuestion(q)}
                      className={'p-4 rounded-2xl border text-xs space-y-2.5 transition-all cursor-pointer ' + (
                        isSelected
                          ? 'bg-teal-50/80 border-teal-400 shadow-xs'
                          : 'bg-slate-50/80 border-slate-200 hover:bg-white hover:border-slate-300 hover:shadow-xs'
                      )}
                    >
                      {/* Card Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {}}
                            className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 cursor-pointer"
                          />
                          <span className={'px-2 py-0.5 rounded-md font-bold text-[10px] ' + (
                            isCQ ? 'bg-purple-100 text-purple-800' : isSQ ? 'bg-emerald-100 text-emerald-800' : 'bg-indigo-100 text-indigo-800'
                          )}>
                            {isCQ ? 'CQ সৃজনশীল' : isSQ ? 'SQ সংক্ষিপ্ত' : 'MCQ'}
                          </span>
                          <span className="text-[10px] font-bold text-slate-500">
                            {q?.badge || `[${q?.book || 'বিষয়'}]`}
                          </span>
                        </div>
                        <span className="font-bold text-slate-700 text-[11px]">
                          [{q?.marks || (isCQ ? 10 : isSQ ? 2 : 1)} নম্বর]
                        </span>
                      </div>

                      {/* 1. CQ CREATIVE QUESTION CARD */}
                      {isCQ && cSubs ? (
                        <div className="space-y-2 pt-1 text-slate-800">
                          {/* Stimulus Box */}
                          <div className="p-3 rounded-xl bg-purple-50/80 border border-purple-200/80 leading-relaxed font-semibold">
                            <span className="text-[10px] font-black text-purple-700 uppercase tracking-wide block mb-1">
                              উদ্দীপক:
                            </span>
                            <MathRenderer text={q?.question?.split('\n\n**ক.**')[0]?.replace(/^\[.*?\]\s*উদ্দীপক:\s*/i, '') || q?.question} />
                          </div>

                          {/* Sub-questions: ক এর নিচে খ, তার নিচে গ */}
                          <div className="space-y-1.5 pl-1 text-[11px]">
                            {cSubs.a && (
                              <div className="p-2.5 bg-white rounded-xl border border-slate-200/90 shadow-2xs">
                                <span className="font-extrabold text-indigo-700 mr-1">ক.</span>
                                <MathRenderer text={cSubs.a.q || cSubs.a} />
                                <span className="text-slate-400 font-bold text-[10px] ml-1">[{cSubs.a.marks || 2} নম্বর]</span>
                                {cSubs.a.ans && (
                                  <div className="mt-1 pt-1 border-t border-slate-100 text-[10px] text-emerald-700 font-medium">
                                    <strong>উত্তর:</strong> <MathRenderer text={cSubs.a.ans} />
                                  </div>
                                )}
                              </div>
                            )}

                            {cSubs.b && (
                              <div className="p-2.5 bg-white rounded-xl border border-slate-200/90 shadow-2xs">
                                <span className="font-extrabold text-indigo-700 mr-1">খ.</span>
                                <MathRenderer text={cSubs.b.q || cSubs.b} />
                                <span className="text-slate-400 font-bold text-[10px] ml-1">[{cSubs.b.marks || 4} নম্বর]</span>
                                {cSubs.b.ans && (
                                  <div className="mt-1 pt-1 border-t border-slate-100 text-[10px] text-emerald-700 font-medium">
                                    <strong>উত্তর:</strong> <MathRenderer text={cSubs.b.ans} />
                                  </div>
                                )}
                              </div>
                            )}

                            {cSubs.c && (
                              <div className="p-2.5 bg-white rounded-xl border border-slate-200/90 shadow-2xs">
                                <span className="font-extrabold text-indigo-700 mr-1">গ.</span>
                                <MathRenderer text={cSubs.c.q || cSubs.c} />
                                <span className="text-slate-400 font-bold text-[10px] ml-1">[{cSubs.c.marks || 4} নম্বর]</span>
                                {cSubs.c.ans && (
                                  <div className="mt-1 pt-1 border-t border-slate-100 text-[10px] text-emerald-700 font-medium">
                                    <strong>উত্তর:</strong> <MathRenderer text={cSubs.c.ans} />
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      ) : isSQ ? (
                        /* 2. SQ SHORT QUESTION CARD */
                        <div className="space-y-1.5 pt-1 text-slate-800">
                          <div className="font-bold text-slate-900 leading-relaxed text-xs">
                            <MathRenderer text={q?.question || q?.stem} />
                          </div>
                          {q?.shortAnswer && (
                            <div className="p-2.5 bg-emerald-50/90 rounded-xl border border-emerald-200 text-[11px] text-emerald-900 font-semibold">
                              <strong>সংক্ষিপ্ত উত্তর:</strong> <MathRenderer text={q.shortAnswer} />
                            </div>
                          )}
                        </div>
                      ) : (
                        /* 3. MCQ QUESTION CARD: Options stacked vertically */
                        <div className="space-y-2 pt-1 text-slate-800">
                          <div className="font-bold text-slate-900 leading-relaxed text-xs">
                            <MathRenderer text={q?.question || q?.stem} />
                          </div>

                          {Array.isArray(q?.options) && q.options.length > 0 && (
                            <div className="space-y-1.5 pt-1 pl-1">
                              {q.options.map((opt, oIdx) => {
                                const bLabels = ['(ক)', '(খ)', '(গ)', '(ঘ)'];
                                const cleanOpt = String(opt).replace(/^[কখগঘabcdABCD][\)\.\-:]\s*/, '');
                                return (
                                  <div
                                    key={oIdx}
                                    className="flex items-start space-x-2 text-xs text-slate-800 bg-white p-2 rounded-xl border border-slate-200/80 shadow-2xs"
                                  >
                                    <span className="font-extrabold text-indigo-700 shrink-0">
                                      {bLabels[oIdx] || `(${oIdx + 1})`}
                                    </span>
                                    <div className="flex-1 font-medium">
                                      <MathRenderer text={cleanOpt} />
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}

                          {q?.explanation && (
                            <div className="text-[10px] bg-white p-2.5 rounded-xl border border-slate-100 text-slate-600 mt-1 leading-relaxed">
                              <strong className="text-indigo-700">ব্যাখ্যা ও সমাধান:</strong> <MathRenderer text={q.explanation} />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Live Paper Preview & Controls */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-4">
            
            {/* Header & Controls */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 flex-wrap gap-2">
              <div>
                <h3 className="font-black text-sm text-slate-900 uppercase tracking-wider">
                  ২. প্রশ্নপত্র প্রিভিউ ও প্রিন্টার ({selectedPaperQuestions.length} টি)
                </h3>
                <p className="text-[11px] text-slate-500">মোট পূর্ণমান: {totalMarks} | সময়: {examDuration} মিনিট</p>
              </div>

              <div className="flex items-center space-x-1.5">
                <button
                  type="button"
                  onClick={handleCopyPaper}
                  disabled={selectedPaperQuestions.length === 0}
                  className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors disabled:opacity-40 cursor-pointer"
                  title="কপিক্লিপবোর্ড"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handlePrintExam}
                  disabled={selectedPaperQuestions.length === 0}
                  className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors flex items-center space-x-1.5 disabled:opacity-40 cursor-pointer shadow-sm"
                >
                  <Printer className="w-4 h-4" />
                  <span>A4 প্রিন্ট</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowPublishModal(true)}
                  disabled={selectedPaperQuestions.length === 0}
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-colors flex items-center space-x-1.5 disabled:opacity-40 cursor-pointer shadow-sm"
                >
                  <PlayCircle className="w-4 h-4" />
                  <span>লাইভ প্রকাশ</span>
                </button>
              </div>
            </div>

            {/* Paper Header Configuration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="md:col-span-2">
                <label className="text-[11px] font-bold text-slate-600 block mb-0.5">পরীক্ষার শিরোনাম:</label>
                <input
                  type="text"
                  value={examTitle}
                  onChange={(e) => setExamTitle(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs font-bold"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-0.5">শ্রেণি:</label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs font-bold cursor-pointer"
                >
                  {CLASSES_LIST.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-indigo-700 block mb-0.5">বিষয় (সিলেক্ট করলে বামে প্রশ্ন ফিল্টার হবে):</label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full p-2 bg-indigo-50/70 border border-indigo-300 rounded-xl text-xs font-bold text-indigo-900 cursor-pointer focus:ring-2 focus:ring-indigo-500"
                >
                  {SUBJECTS_LIST.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            {/* Paper Questions Live Preview */}
            <div className="max-h-[480px] overflow-y-auto space-y-3 pr-1 custom-scrollbar">
              {selectedPaperQuestions.length === 0 ? (
                <div className="p-12 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-400 space-y-2">
                  <FileText className="w-8 h-8 mx-auto text-slate-300" />
                  <p className="text-xs font-bold text-slate-700">কোনো প্রশ্ন নির্বাচন করা হয়নি</p>
                  <p className="text-[11px] text-slate-400">বাম পাশের ভাণ্ডার থেকে প্রশ্নের টিক বক্সে ক্লিক করে নির্বাচন করুন।</p>
                </div>
              ) : (
                selectedPaperQuestions.map((q, idx) => {
                  const qId = q?.id || q?.M_ID || idx;
                  const isCQ = q?.type === 'CQ' || Boolean(q?.creativeSubQuestions || q?.subQuestions);
                  const isSQ = q?.type === 'SQ';
                  const cSubs = q?.creativeSubQuestions || q?.subQuestions;

                  return (
                    <div key={qId} className="p-3.5 bg-white border border-slate-200 rounded-2xl text-xs space-y-2 shadow-xs relative">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-teal-700">প্রশ্ন #{idx + 1} ({q?.type || 'MCQ'})</span>
                        <div className="flex items-center space-x-1.5">
                          <span className="font-bold text-slate-500">[{q?.marks || (isCQ ? 10 : isSQ ? 2 : 1)} নম্বর]</span>
                          <button
                            type="button"
                            onClick={() => setSelectedPaperQuestions(prev => prev.filter((_, i) => i !== idx))}
                            className="text-slate-400 hover:text-rose-600 p-1 rounded-lg transition-colors cursor-pointer"
                            title="প্রশ্নপত্র থেকে বাদ দিন"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* 1. CQ PREVIEW */}
                      {isCQ && cSubs ? (
                        <div className="space-y-2 text-slate-800">
                          <div className="p-2.5 bg-purple-50/70 rounded-xl border border-purple-200 text-xs font-semibold">
                            <span className="text-[10px] font-black text-purple-700 uppercase block mb-0.5">উদ্দীপক:</span>
                            <MathRenderer text={q?.question?.split('\n\n**ক.**')[0]?.replace(/^\[.*?\]\s*উদ্দীপক:\s*/i, '') || q?.question} />
                          </div>
                          <div className="space-y-1 pl-1 text-[11px]">
                            {cSubs.a && <div><span className="font-bold text-indigo-700">ক. </span><MathRenderer text={cSubs.a.q || cSubs.a} /> <span className="text-slate-400 font-bold">[{cSubs.a.marks || 2} নম্বর]</span></div>}
                            {cSubs.b && <div><span className="font-bold text-indigo-700">খ. </span><MathRenderer text={cSubs.b.q || cSubs.b} /> <span className="text-slate-400 font-bold">[{cSubs.b.marks || 4} নম্বর]</span></div>}
                            {cSubs.c && <div><span className="font-bold text-indigo-700">গ. </span><MathRenderer text={cSubs.c.q || cSubs.c} /> <span className="text-slate-400 font-bold">[{cSubs.c.marks || 4} নম্বর]</span></div>}
                          </div>
                        </div>
                      ) : isSQ ? (
                        /* 2. SQ PREVIEW */
                        <div className="space-y-1 text-slate-800">
                          <div className="font-bold text-slate-900">
                            <MathRenderer text={q?.question || q?.stem} />
                          </div>
                          {q?.shortAnswer && (
                            <div className="text-[11px] text-emerald-800 font-semibold">
                              <strong>উত্তর:</strong> <MathRenderer text={q.shortAnswer} />
                            </div>
                          )}
                        </div>
                      ) : (
                        /* 3. MCQ PREVIEW: Options vertically stacked */
                        <div className="space-y-1.5 text-slate-800">
                          <div className="font-bold text-slate-900">
                            <MathRenderer text={q?.question || q?.stem} />
                          </div>
                          {Array.isArray(q?.options) && q.options.length > 0 && (
                            <div className="space-y-1 pl-1 text-[11px]">
                              {q.options.map((opt, oIdx) => {
                                const bLabels = ['(ক)', '(খ)', '(গ)', '(ঘ)'];
                                const cleanOpt = String(opt).replace(/^[কখগঘabcdABCD][\)\.\-:]\s*/, '');
                                return (
                                  <div key={oIdx} className="flex items-start space-x-1.5">
                                    <span className="font-bold text-indigo-600 shrink-0">{bLabels[oIdx] || `(${oIdx + 1})`}</span>
                                    <div><MathRenderer text={cleanOpt} /></div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Publish to Online Exam Modal */}
      {showPublishModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-black text-sm text-slate-900 flex items-center space-x-2">
                <PlayCircle className="w-5 h-5 text-emerald-600" />
                <span>অনলাইন পরীক্ষা লাইভ প্রকাশ করুন</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowPublishModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">পরীক্ষার নাম:</label>
                <input
                  type="text"
                  value={examTitle}
                  onChange={(e) => setExamTitle(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">পরীক্ষার তারিখ:</label>
                  <input
                    type="date"
                    value={publishDate}
                    onChange={(e) => setPublishDate(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">সময় (মিনিট):</label>
                  <input
                    type="number"
                    value={examDuration}
                    onChange={(e) => setExamDuration(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  />
                </div>
              </div>

              <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-[11px] font-bold">
                মোট নির্বাচিত প্রশ্ন: {selectedPaperQuestions.length} টি • পূর্ণমান: {totalMarks}
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowPublishModal(false)}
                className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                বাতিল
              </button>
              <button
                type="button"
                onClick={handlePublishExam}
                disabled={isPublishing}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer disabled:opacity-50"
              >
                {isPublishing ? 'প্রকাশ হচ্ছে...' : 'নিশ্চিত ও প্রকাশ করুন'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
