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
  FolderOpen
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { questionRepositoryAPI, examAPI } from '../../services/api';
import MathRenderer from '../common/MathRenderer';

const CLASSES_LIST = [
  'ষষ্ঠ শ্রেণি (Class 6)',
  'সপ্তম শ্রেণি (Class 7)',
  'অষ্টম শ্রেণি (Class 8)',
  'নবম শ্রেণি (Class 9)',
  'দশম শ্রেণি (Class 10)',
  'একাদশ শ্রেণি (Class 11)',
  'দ্বাদশ শ্রেণি (Class 12)',
  'Class 9-10 (SSC)',
  'Class 11-12 (HSC)'
];

const SUBJECTS_LIST = [
  'সাধারণ গণিত (General Math)',
  'উচ্চতর গণিত (Higher Math)',
  'পদার্থবিজ্ঞান (Physics)',
  'রসায়ন (Chemistry)',
  'জীববিজ্ঞান (Biology)',
  'তথ্য ও যোগাযোগ প্রযুক্তি / আইসিটি (ICT)',
  'বাংলাদেশ ও বিশ্বপরিচয় (BGS)',
  'সাধারণ বিজ্ঞান (General Science)',
  'ইসলাম ও নৈতিক শিক্ষা',
  'হিন্দুধর্ম ও নৈতিক শিক্ষা',
  'বাংলা ১ম পত্র (সাহিত্য)',
  'বাংলা ২য় পত্র (বাংলা ব্যাকরণ ও নির্মিতি)',
  'ইংরেজি ১ম পত্র (English 1st Paper)',
  'ইংরেজি ২য় পত্র (English 2nd Paper)',
  'হিসাববিজ্ঞান (Accounting)',
  'ফিন্যান্স ও ব্যাংকিং (Finance & Banking)',
  'ব্যবসায় উদ্যোগ (Business Studies)'
];

export default function AIQuestionMakerHub({ onNavigateToUpload, onNavigateToOMR }) {
  const { lang } = useLanguage();

  // Paper Configuration
  const [examTitle, setExamTitle] = useState('NextGen Academy - বিশেষ মডেল টেস্ট');
  const [instituteName, setInstituteName] = useState('NextGen Academy');
  const [selectedClass, setSelectedClass] = useState(CLASSES_LIST[4]);
  const [selectedSubject, setSelectedSubject] = useState(SUBJECTS_LIST[2]);
  const [examDuration, setExamDuration] = useState(30);

  // Vault Browsing & Selection State
  const [repoQuestions, setRepoQuestions] = useState([]);
  const [loadingRepo, setLoadingRepo] = useState(false);
  const [vaultFilter, setVaultFilter] = useState('ALL'); // 'ALL' | 'MCQ' | 'CQ' | 'SQ'
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
      const res = await questionRepositoryAPI.getQuestions();
      let list = [];
      if (res?.data?.questions && Array.isArray(res.data.questions)) {
        list = res.data.questions;
      } else if (Array.isArray(res?.data)) {
        list = res.data;
      } else if (Array.isArray(res?.questions)) {
        list = res.questions;
      } else if (Array.isArray(res)) {
        list = res;
      }

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

  // Filtered Vault Questions
  const filteredVaultQuestions = useMemo(() => {
    const safe = Array.isArray(repoQuestions) ? repoQuestions : [];
    return safe.filter(q => {
      const rawType = String(q?.type || '').toUpperCase().trim();
      const targetFilter = String(vaultFilter || 'ALL').toUpperCase().trim();
      
      let matchesType = targetFilter === 'ALL';
      if (!matchesType) {
        if (targetFilter === 'MCQ') {
          matchesType = rawType === 'MCQ' || rawType === 'MULTIPLE_CHOICE' || (Array.isArray(q?.options) && q.options.length > 0);
        } else if (targetFilter === 'CQ') {
          matchesType = rawType === 'CQ' || rawType === 'CREATIVE' || Boolean(q?.subQuestions && Object.keys(q.subQuestions).length > 0);
        } else if (targetFilter === 'SQ') {
          matchesType = rawType === 'SQ' || rawType === 'SHORT' || rawType === 'SHORT_QUESTION' || Boolean(q?.shortAnswer);
        } else {
          matchesType = rawType === targetFilter;
        }
      }

      const qText = String(q?.question || q?.stem || '').toLowerCase();
      const qInst = String(q?.institutionOrBoard || q?.boardOrInstitute || q?.category || '').toLowerCase();
      const qSubject = String(q?.book || q?.subject || '').toLowerCase();
      const search = (searchTerm || '').toLowerCase().trim();

      const matchesSearch = !search || qText.includes(search) || qInst.includes(search) || qSubject.includes(search);
      return matchesType && matchesSearch;
    });
  }, [repoQuestions, vaultFilter, searchTerm]);

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

  // Print A4 Exam Sheet
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
  <style>
    @page { size: A4 portrait; margin: 15mm 12mm 15mm 12mm; }
    body {
      font-family: 'SolaimanLipi', 'Kalpurush', 'Noto Sans Bengali', Arial, sans-serif;
      color: #0f172a;
      line-height: 1.45;
      font-size: 13px;
      margin: 0;
      padding: 0;
      background: #fff;
    }
    .header {
      text-align: center;
      border-bottom: 2px solid #0f172a;
      padding-bottom: 8px;
      margin-bottom: 12px;
    }
    .inst-name {
      font-size: 22px;
      font-weight: 900;
      color: #047857;
      margin: 0;
      text-transform: uppercase;
    }
    .exam-title {
      font-size: 16px;
      font-weight: 800;
      color: #0f172a;
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
      gap: 12px;
    }
    .q-item {
      page-break-inside: avoid;
    }
    .q-head {
      font-weight: 800;
      font-size: 13px;
      display: flex;
      justify-content: space-between;
    }
    .q-stem {
      margin: 2px 0 6px 0;
      text-align: justify;
    }
    .options-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 4px 16px;
      margin-top: 4px;
      font-size: 12px;
    }
    .sub-q-list {
      margin-left: 12px;
      margin-top: 4px;
      font-size: 12px;
    }
    .sub-q-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 3px;
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
    ${selectedPaperQuestions.map((q, idx) => `
      <div class="q-item">
        <div class="q-head">
          <span><strong>প্রশ্ন ${idx + 1}.</strong> [${q?.type || 'প্রশ্ন'}]</span>
          <span>[${q?.marks || (q?.type === 'CQ' ? 10 : q?.type === 'SQ' ? 2 : 1)}]</span>
        </div>
        <div class="q-stem">${q?.question || q?.stem || ''}</div>
        ${q?.type === 'MCQ' && Array.isArray(q?.options) ? `
          <div class="options-grid">
            ${q.options.map((opt, oIdx) => `<div>(${String.fromCharCode(97 + oIdx)}) ${opt}</div>`).join('')}
          </div>
        ` : ''}
        ${q?.type === 'CQ' && q?.subQuestions ? `
          <div class="sub-q-list">
            <div class="sub-q-row"><span>(ক) ${q.subQuestions.a?.q || q.subQuestions.a || ''}</span><span>[১]</span></div>
            <div class="sub-q-row"><span>(খ) ${q.subQuestions.b?.q || q.subQuestions.b || ''}</span><span>[২]</span></div>
            <div class="sub-q-row"><span>(গ) ${q.subQuestions.c?.q || q.subQuestions.c || ''}</span><span>[৩]</span></div>
            <div class="sub-q-row"><span>(ঘ) ${q.subQuestions.d?.q || q.subQuestions.d || ''}</span><span>[৪]</span></div>
          </div>
        ` : ''}
      </div>
    `).join('')}
  </div>

  <div class="footer">
    <span>NextGen Academy • সুরক্ষিত প্রশ্নপত্র প্রণয়ন ইঞ্জিন</span>
    <span>পৃষ্ঠা ১ / ১</span>
  </div>

  <script>
    window.onload = function() {
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
        q.options.forEach((opt, oIdx) => {
          text += `  (${String.fromCharCode(97 + oIdx)}) ${opt}\n`;
        });
      }
      if (q?.type === 'CQ' && q?.subQuestions) {
        text += `  (ক) ${q.subQuestions.a?.q || q.subQuestions.a || ''}\n`;
        text += `  (খ) ${q.subQuestions.b?.q || q.subQuestions.b || ''}\n`;
        text += `  (গ) ${q.subQuestions.c?.q || q.subQuestions.c || ''}\n`;
        text += `  (ঘ) ${q.subQuestions.d?.q || q.subQuestions.d || ''}\n`;
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
              ভাণ্ডার থেকে MCQ, CQ ও SQ প্রশ্ন নির্বাচন করে সাজান, A4 প্রিন্ট করুন অথবা লাইভ প্রকাশ করুন।
            </p>
          </div>

          <div className="flex items-center gap-2">
            {onNavigateToUpload && (
              <button
                type="button"
                onClick={onNavigateToUpload}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center space-x-1.5"
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
        <div className="lg:col-span-6 space-y-5">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 flex-wrap gap-2">
              <div className="flex items-center space-x-2">
                <Database className="w-4 h-4 text-teal-600" />
                <h3 className="font-black text-sm text-slate-900 uppercase tracking-wider">
                  ১. ভাণ্ডার থেকে প্রশ্ন নির্বাচন করুন ({filteredVaultQuestions.length} টি)
                </h3>
              </div>
              <button
                type="button"
                onClick={handleSelectAllVisible}
                className="text-xs font-bold text-teal-600 hover:text-teal-700 cursor-pointer"
              >
                + দৃশ্যমান সব যোগ করুন
              </button>
            </div>

            {/* Filter Tabs: ALL | MCQ | CQ | SQ */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                type="button"
                onClick={() => setVaultFilter('ALL')}
                className={'px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ' + (
                  vaultFilter === 'ALL' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                )}
              >
                সকল ({repoQuestions.length})
              </button>
              <button
                type="button"
                onClick={() => setVaultFilter('MCQ')}
                className={'px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ' + (
                  vaultFilter === 'MCQ' ? 'bg-indigo-600 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                )}
              >
                MCQ ({repoQuestions.filter(q => q?.type === 'MCQ').length})
              </button>
              <button
                type="button"
                onClick={() => setVaultFilter('CQ')}
                className={'px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ' + (
                  vaultFilter === 'CQ' ? 'bg-purple-600 text-white' : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
                )}
              >
                CQ ({repoQuestions.filter(q => q?.type === 'CQ').length})
              </button>
              <button
                type="button"
                onClick={() => setVaultFilter('SQ')}
                className={'px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ' + (
                  vaultFilter === 'SQ' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                )}
              >
                SQ ({repoQuestions.filter(q => q?.type === 'SQ' || q?.type === 'SHORT').length})
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="প্রশ্ন, বিষয় বা বোর্ড দিয়ে খুঁজুন..."
                className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            {/* Questions Selection List */}
            <div className="max-h-[520px] overflow-y-auto space-y-2.5 pr-1 custom-scrollbar">
              {loadingRepo ? (
                <div className="p-8 text-center text-slate-400 space-y-2">
                  <RefreshCw className="w-6 h-6 animate-spin mx-auto text-teal-600" />
                  <p className="text-xs font-bold">ভাণ্ডার থেকে প্রশ্ন লোড হচ্ছে...</p>
                </div>
              ) : filteredVaultQuestions.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-100 text-slate-400 space-y-2">
                  <FolderOpen className="w-8 h-8 mx-auto text-slate-300" />
                  <p className="text-xs font-bold text-slate-700">কোনো প্রশ্ন পাওয়া যায়নি</p>
                </div>
              ) : (
                filteredVaultQuestions.map((q, idx) => {
                  const qId = q?.id || q?.M_ID || idx;
                  const isSelected = selectedPaperQuestions.some(sq => (sq?.id || sq?.M_ID) === qId);

                  return (
                    <div
                      key={qId}
                      onClick={() => toggleSelectQuestion(q)}
                      className={'p-3 rounded-2xl border text-xs space-y-1.5 transition-all cursor-pointer ' + (
                        isSelected
                          ? 'bg-teal-50/70 border-teal-400 shadow-xs'
                          : 'bg-slate-50 border-slate-200 hover:bg-white hover:border-slate-300'
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {}}
                            className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 cursor-pointer"
                          />
                          <span className={'px-2 py-0.5 rounded-md font-bold text-[10px] ' + (
                            q?.type === 'CQ' ? 'bg-purple-100 text-purple-800' : q?.type === 'SQ' ? 'bg-emerald-100 text-emerald-800' : 'bg-indigo-100 text-indigo-800'
                          )}>
                            {q?.type || 'MCQ'}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400">
                            {q?.badge || `[${q?.book || 'বিষয়'}]`}
                          </span>
                        </div>
                        <span className="font-bold text-slate-700 text-[11px]">
                          [{q?.marks || (q?.type === 'CQ' ? 10 : q?.type === 'SQ' ? 2 : 1)} নম্বর]
                        </span>
                      </div>

                      <div className="font-bold text-slate-800 line-clamp-2">
                        <MathRenderer text={q?.question || q?.stem} />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Live Paper Preview & Controls */}
        <div className="lg:col-span-6 space-y-5">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 flex-wrap gap-2">
              <div>
                <h3 className="font-black text-sm text-slate-900 uppercase tracking-wider">
                  ২. প্রশ্নপত্র প্রিভিউ ও প্রিন্টার ({selectedPaperQuestions.length} টি প্রশ্ন)
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
                  className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors flex items-center space-x-1.5 disabled:opacity-40 cursor-pointer shadow-sm"
                >
                  <Printer className="w-4 h-4" />
                  <span>A4 প্রিন্ট</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowPublishModal(true)}
                  disabled={selectedPaperQuestions.length === 0}
                  className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-colors flex items-center space-x-1.5 disabled:opacity-40 cursor-pointer shadow-sm"
                >
                  <PlayCircle className="w-4 h-4" />
                  <span>লাইভ প্রকাশ</span>
                </button>
              </div>
            </div>

            {/* Paper Header Configuration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 p-3 bg-slate-50 rounded-2xl border border-slate-200">
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
                  className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs font-bold"
                >
                  {CLASSES_LIST.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-0.5">বিষয়:</label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs font-bold"
                >
                  {SUBJECTS_LIST.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            {/* Paper Questions Live Preview */}
            <div className="max-h-[460px] overflow-y-auto space-y-3 pr-1 custom-scrollbar">
              {selectedPaperQuestions.length === 0 ? (
                <div className="p-12 text-center bg-slate-50 rounded-2xl border border-slate-100 text-slate-400 space-y-2">
                  <FileText className="w-8 h-8 mx-auto text-slate-300" />
                  <p className="text-xs font-bold text-slate-700">কোনো প্রশ্ন নির্বাচন করা হয়নি</p>
                  <p className="text-[11px] text-slate-400">বাম পাশের ভাণ্ডার থেকে প্রশ্ন টিক চিহ্ন দিয়ে নির্বাচন করুন।</p>
                </div>
              ) : (
                selectedPaperQuestions.map((q, idx) => {
                  const qId = q?.id || q?.M_ID || idx;

                  return (
                    <div key={qId} className="p-3.5 bg-white border border-slate-200 rounded-2xl text-xs space-y-2 shadow-xs relative">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-teal-700">প্রশ্ন #{idx + 1} ({q?.type || 'MCQ'})</span>
                        <div className="flex items-center space-x-1.5">
                          <span className="font-bold text-slate-500">[{q?.marks || (q?.type === 'CQ' ? 10 : q?.type === 'SQ' ? 2 : 1)} নম্বর]</span>
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

                      <div className="font-bold text-slate-800">
                        <MathRenderer text={q?.question || q?.stem} />
                      </div>

                      {/* Options for MCQ */}
                      {q?.type === 'MCQ' && Array.isArray(q?.options) && (
                        <div className="grid grid-cols-2 gap-1 pt-1 text-[11px] text-slate-600">
                          {q.options.map((opt, oIdx) => (
                            <div key={oIdx}>
                              <span className="font-bold text-indigo-600">({String.fromCharCode(97 + oIdx)})</span> <MathRenderer text={opt} />
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Sub-questions for CQ */}
                      {q?.type === 'CQ' && q?.subQuestions && (
                        <div className="space-y-0.5 pt-1 text-[11px] text-slate-600">
                          <div>(ক) <MathRenderer text={q.subQuestions.a?.q || q.subQuestions.a || ''} /> [১]</div>
                          <div>(খ) <MathRenderer text={q.subQuestions.b?.q || q.subQuestions.b || ''} /> [২]</div>
                          <div>(গ) <MathRenderer text={q.subQuestions.c?.q || q.subQuestions.c || ''} /> [৩]</div>
                          <div>(ঘ) <MathRenderer text={q.subQuestions.d?.q || q.subQuestions.d || ''} /> [৪]</div>
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
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
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
                className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl"
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
