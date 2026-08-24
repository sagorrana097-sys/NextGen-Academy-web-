import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { backupAPI } from '../../services/api';
import {
  Database,
  Download,
  FileSpreadsheet,
  FileCode,
  Table,
  CheckCircle2,
  Clock,
  ShieldCheck,
  HardDrive,
  Sparkles,
  RefreshCw,
  FileText,
  Users,
  CreditCard,
  Award,
  GraduationCap,
  Layers,
  HelpCircle,
  ArrowDownToLine,
  Check
} from 'lucide-react';

export default function DataBackupManager() {
  const { t, lang } = useLanguage();
  const { token } = useAuth();

  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(null);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    fetchSummary();
  }, []);

  const showToast = (msg, type = 'success') => {
    setFeedback({ msg, type });
    setTimeout(() => setFeedback(null), 4000);
  };

  const fetchSummary = async () => {
    setLoading(true);
    try {
      const res = await backupAPI.getSummary();
      if (res.success && res.data) {
        setSummary(res.data);
      }
    } catch (err) {
      console.error('Fetch backup summary error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (url, defaultFilename, label) => {
    setDownloading(label);
    try {
      const authToken = token || localStorage.getItem('token') || localStorage.getItem('adminToken') || localStorage.getItem('nextgen_token');
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });

      if (!response.ok) {
        throw new Error('ডাউনলোড করতে সমস্যা হয়েছে।');
      }

      // Extract filename from header if available
      let filename = defaultFilename;
      const disposition = response.headers.get('Content-Disposition');
      if (disposition && disposition.includes('filename=')) {
        const matches = disposition.match(/filename="?([^"]+)"?/);
        if (matches && matches[1]) {
          filename = matches[1];
        }
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);

      showToast(`'${filename}' সফলভাবে ডাউনলোড হয়েছে!`);
    } catch (err) {
      console.error('Download error:', err);
      alert(err.message || 'ফাইল ডাউনলোড ব্যর্থ হয়েছে');
    } finally {
      setDownloading(null);
    }
  };

  const exportCategories = [
    {
      id: 'students',
      nameBn: 'শিক্ষার্থী ডাটাবেজ (Student Directory)',
      nameEn: 'Students Directory & Academic Profile',
      descBn: 'শিক্ষার্থীর নাম, ইউনিক আইডি (NGA-2026-XXXX), রোল, শ্রেণি, ব্যাচ, রক্তের গ্রুপ, অভিভাবকের ফোন ও ঠিকানা।',
      descEn: 'Student names, ID, Roll, Class, Batch, Blood Group, Guardian phone & addresses.',
      icon: GraduationCap,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-200',
      btnColor: 'bg-emerald-600 hover:bg-emerald-700 text-white',
      badge: 'মাস্টার ডাটা'
    },
    {
      id: 'accounts',
      nameBn: 'হিসাব ও ফি লেজার (Billing & Expenses)',
      nameEn: 'Accounts, Invoices & Expense Log',
      descBn: 'ইনভয়েস নম্বর, শিক্ষার্থী নাম ও আইডি, আদায়কৃত ফি, বকেয়া, পেমেন্ট মেথড, ট্রানজেকশন আইডি ও খরচের তালিকা।',
      descEn: 'Invoice numbers, student fees, payment methods, transaction IDs and expense vouchers.',
      icon: CreditCard,
      color: 'bg-indigo-50 text-indigo-600 border-indigo-200',
      btnColor: 'bg-indigo-600 hover:bg-indigo-700 text-white',
      badge: 'ফিন্যান্সিয়াল'
    },
    {
      id: 'results',
      nameBn: 'পরীক্ষার ফলাফল ও মেরিট শিট (Exam Results)',
      nameEn: 'Exam Marks & Merit Ranking Sheet',
      descBn: 'পরীক্ষার নাম, শ্রেণি, বিষয়ভিত্তিক CQ, MCQ, ব্যবহারিক মার্কস, মোট নম্বর, GPA, গ্রেড ও মেধা তালিকা।',
      descEn: 'Exam terms, subject-wise CQ, MCQ, Practical marks, total scores, GPA and merit list.',
      icon: Award,
      color: 'bg-amber-50 text-amber-600 border-amber-200',
      btnColor: 'bg-amber-600 hover:bg-amber-700 text-white',
      badge: 'ফলাফল'
    },
    {
      id: 'teachers',
      nameBn: 'শিক্ষক ও পেরোল বিবরণী (Teachers & Payroll)',
      nameEn: 'Teachers Directory & Salary Payroll',
      descBn: 'শিক্ষকদের প্রোফাইল, পদবি, বিষয় বিশেষজ্ঞতা, ইমেইল, মোবাইল, মূল বেতন, ভাতা ও নেট পেরোল বিবরণ।',
      descEn: 'Teacher profile, designation, specialization, email, phone, base salary, allowance and net pay.',
      icon: Users,
      color: 'bg-blue-50 text-blue-600 border-blue-200',
      btnColor: 'bg-blue-600 hover:bg-blue-700 text-white',
      badge: 'এইচআর ও পেরোল'
    },
    {
      id: 'admissions',
      nameBn: 'অনলাইন ভর্তি আবেদন (Online Admissions)',
      nameEn: 'Online Admission Applications Log',
      descBn: 'ট্র্যাকিং কোড (ADM-2026-XXXX), আবেদনকারীর নাম, শ্রেণি, ব্যাচ, পূর্ববর্তী GPA ও যাচাইকরণ অবস্থা।',
      descEn: 'Tracking IDs, applicant names, target classes, previous GPAs and review status.',
      icon: FileSpreadsheet,
      color: 'bg-teal-50 text-teal-600 border-teal-200',
      btnColor: 'bg-teal-600 hover:bg-teal-700 text-white',
      badge: 'ভর্তি ইনটেক'
    },
    {
      id: 'batches',
      nameBn: 'ব্যাচ ও সাপ্তাহিক রুটিন (Batches & Routines)',
      nameEn: 'Batches & Routine Schedules',
      descBn: 'সকল সক্রিয় ব্যাচ, আসন ক্ষমতা, বর্তমান ভর্তি শিক্ষার্থী, শিফট, রুম নম্বর ও সাপ্তাহিক ক্লাস শিডিউল।',
      descEn: 'Active batches, capacity, enrolled counts, shifts, rooms and routine schedules.',
      icon: Layers,
      color: 'bg-purple-50 text-purple-600 border-purple-200',
      btnColor: 'bg-purple-600 hover:bg-purple-700 text-white',
      badge: 'একাডেমিক'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-slate-700/60">
        <div className="absolute right-0 top-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 -bottom-10 w-60 h-60 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold">
              <Database className="w-3.5 h-3.5" />
              <span>{lang === 'bn' ? 'ডাটা সিকিউরিটি ও ব্যাকআপ কন্ট্রোল' : 'Database Security & Backup Engine'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white">
              {t('dataBackupTitle')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl font-medium">
              {t('dataBackupSubtitle')}
            </p>
          </div>

          {/* Quick Full Dumps */}
          <div className="flex flex-wrap sm:flex-nowrap gap-2.5">
            <button
              onClick={() =>
                handleDownload(
                  backupAPI.getJsonDumpUrl(),
                  `NextGen_Academy_Full_Backup_${new Date().toISOString().split('T')[0]}.json`,
                  'json_dump'
                )
              }
              disabled={downloading !== null}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 flex items-center space-x-2 transition-all transform active:scale-95 disabled:opacity-50"
            >
              <HardDrive className="w-4 h-4" />
              <span>{downloading === 'json_dump' ? 'ডাউনলোড হচ্ছে...' : t('fullJsonBackup')}</span>
            </button>

            <button
              onClick={() =>
                handleDownload(
                  backupAPI.getSqlDumpUrl(),
                  `NextGen_Academy_Full_Backup_${new Date().toISOString().split('T')[0]}.sql`,
                  'sql_dump'
                )
              }
              disabled={downloading !== null}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center space-x-2 transition-all transform active:scale-95 disabled:opacity-50"
            >
              <FileCode className="w-4 h-4" />
              <span>{downloading === 'sql_dump' ? 'ডাউনলোড হচ্ছে...' : t('fullSqlDump')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Toast Feedback */}
      {feedback && (
        <div className={`p-4 rounded-2xl border text-xs font-bold flex items-center space-x-2.5 animate-in fade-in ${
          feedback.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'
        }`}>
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{feedback.msg}</span>
        </div>
      )}

      {/* KPI Cards: Database Health */}
      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase">{t('totalDatabaseRecords')}</span>
              <div className="p-2.5 rounded-2xl bg-indigo-50 text-indigo-600">
                <Layers className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-black text-slate-900 mt-2 font-mono">{summary.totalRecords}</p>
            <span className="text-[11px] text-indigo-700 font-bold mt-1 inline-block">সকল টেবিলের মোট রেকর্ড</span>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase">ডাটাবেজ টেবিল সংখ্যা</span>
              <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-600">
                <Table className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-black text-emerald-700 mt-2 font-mono">{summary.totalTables}</p>
            <span className="text-[11px] text-emerald-700 font-bold mt-1 inline-block">সম্পূর্ণ রিলেশনাল স্কিমা</span>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase">ডাটাবেজ ফাইল সাইজ</span>
              <div className="p-2.5 rounded-2xl bg-amber-50 text-amber-600">
                <HardDrive className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-black text-amber-700 mt-2 font-mono">{summary.fileSizeKb} KB</p>
            <span className="text-[11px] text-amber-700 font-bold mt-1 inline-block">JSON রিলেশনাল স্টোরেজ</span>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase">সিস্টেম সিকিউরিটি স্ট্যাটাস</span>
              <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-600">
                <ShieldCheck className="w-5 h-5" />
              </div>
            </div>
            <p className="text-lg font-black text-emerald-800 mt-3 flex items-center space-x-1">
              <span>✓ সুরক্ষিত ও সিঙ্কড</span>
            </p>
            <span className="text-[10px] text-slate-500 font-mono mt-1 inline-block truncate">
              আপডেট: {summary.lastModified?.split('T')[0]} {summary.lastModified?.split('T')[1]?.slice(0, 5)}
            </span>
          </div>
        </div>
      )}

      {/* SECTION 1: MODULAR CATEGORY EXPORTERS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
              <FileSpreadsheet className="w-5 h-5 text-indigo-600" />
              <span>ক্যাটাগরিভিত্তিক এক্সেল ও CSV এক্সপোর্ট (Modular Data Exporters)</span>
            </h3>
            <p className="text-xs text-slate-500">
              প্রয়োজনীয় টেবিল নির্বাচন করে সরাসরি এক্সেল বা CSV স্প্রেডশীটে ওয়ান-ক্লিকে ডাউনলোড করুন
            </p>
          </div>
          <button
            onClick={fetchSummary}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            title="রিফ্রেশ করুন"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {exportCategories.map((cat) => {
            const Icon = cat.icon;
            const isDownloading = downloading === cat.id;

            return (
              <div
                key={cat.id}
                className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-2xl border ${cat.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-black">
                      {cat.badge}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-black text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {lang === 'bn' ? cat.nameBn : cat.nameEn}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      {lang === 'bn' ? cat.descBn : cat.descEn}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                  <button
                    onClick={() =>
                      handleDownload(
                        backupAPI.getCategoryExportUrl(cat.id),
                        `NextGen_${cat.id}_${new Date().toISOString().split('T')[0]}.csv`,
                        cat.id
                      )
                    }
                    disabled={downloading !== null}
                    className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs shadow-sm flex items-center justify-center space-x-1.5 transition-all transform active:scale-95 disabled:opacity-50 ${cat.btnColor}`}
                  >
                    <ArrowDownToLine className="w-3.5 h-3.5" />
                    <span>{isDownloading ? 'প্রসেসিং...' : 'CSV / Excel ডাউনলোড'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: DATABASE TABLES DIRECTORY */}
      {summary && summary.tables && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
                <Table className="w-5 h-5 text-emerald-600" />
                <span>{t('databaseTablesSummary')} ({summary.tables.length} টি টেবিল)</span>
              </h3>
              <p className="text-xs text-slate-500">
                ডাটাবেজের অভ্যন্তরীণ টেবিল তালিকা এবং সংরক্ষিত রেকর্ড বিশ্লেষণ
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {summary.tables.map((tbl) => (
              <div
                key={tbl.id}
                className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200 flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-slate-900 text-xs">{tbl.nameBn}</div>
                  <div className="text-[10px] font-mono text-slate-500">{tbl.id} ({tbl.category})</div>
                </div>
                <span className="px-2 py-0.5 rounded-xl bg-indigo-100 text-indigo-800 font-mono font-black text-xs">
                  {tbl.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
