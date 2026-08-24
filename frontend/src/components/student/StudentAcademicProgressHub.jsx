import React, { useState, useMemo } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useSettings } from '../../context/SettingsContext';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import {
  TrendingUp,
  Award,
  BarChart3,
  CalendarCheck,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  Printer,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Layers,
  FileText,
  Target,
  Zap,
  Clock,
  ShieldCheck,
  ChevronRight,
  Filter
} from 'lucide-react';
import GuardianAttendanceMatrix from '../parent/GuardianAttendanceMatrix';

export default function StudentAcademicProgressHub({
  profile = null,
  attendanceData = [],
  resultsData = null,
  customTitle = ''
}) {
  const { lang, t } = useLanguage();
  const { settings } = useSettings();

  const [activeSubTab, setActiveSubTab] = useState('analytics'); // 'analytics' | 'subjects' | 'attendance' | 'report'
  const [chartType, setChartType] = useState('bars'); // 'bars' | 'trends' | 'radar'
  const [selectedTerm, setSelectedTerm] = useState('FINAL');

  // Academic dataset for comprehensive analysis
  const subjectAnalytics = useMemo(() => [
    {
      id: 1,
      subject: 'পদার্থবিজ্ঞান (Physics)',
      shortCode: 'PHY',
      cqMarks: 48,
      mcqMarks: 24,
      practicalMarks: 23,
      totalObtained: 95,
      fullMarks: 100,
      classAvg: 73.5,
      highestMark: 98,
      letterGrade: 'A+',
      gradePoint: 5.0,
      term1: 88,
      term2: 92,
      final: 95,
      status: 'EXCELLENT',
      remarks: 'অনুধাবন ও গাণিতিক অংশে অসাধারণ দক্ষতা।'
    },
    {
      id: 2,
      subject: 'রসায়ন (Chemistry)',
      shortCode: 'CHEM',
      cqMarks: 45,
      mcqMarks: 23,
      practicalMarks: 23,
      totalObtained: 91,
      fullMarks: 100,
      classAvg: 69.8,
      highestMark: 94,
      letterGrade: 'A+',
      gradePoint: 5.0,
      term1: 82,
      term2: 86,
      final: 91,
      status: 'EXCELLENT',
      remarks: 'রাসায়নিক বিক্রিয়া ও সমীকরণ গঠনে দৃঢ় দখল।'
    },
    {
      id: 3,
      subject: 'উচ্চতর গণিত (Higher Math)',
      shortCode: 'HMATH',
      cqMarks: 49,
      mcqMarks: 25,
      practicalMarks: 24,
      totalObtained: 98,
      fullMarks: 100,
      classAvg: 66.2,
      highestMark: 100,
      letterGrade: 'A+',
      gradePoint: 5.0,
      term1: 94,
      term2: 96,
      final: 98,
      status: 'OUTSTANDING',
      remarks: 'জ্যামিতি ও ক্যালকুলাসে ক্লাসের সেরা ফলাফল।'
    },
    {
      id: 4,
      subject: 'জীববিজ্ঞান (Biology)',
      shortCode: 'BIO',
      cqMarks: 44,
      mcqMarks: 22,
      practicalMarks: 23,
      totalObtained: 89,
      fullMarks: 100,
      classAvg: 72.0,
      highestMark: 92,
      letterGrade: 'A+',
      gradePoint: 5.0,
      term1: 78,
      term2: 84,
      final: 89,
      status: 'GOOD',
      remarks: 'চিত্রাঙ্কন ও লেবেলিংয়ে আরও নির্ভুল হওয়া প্রয়োজন।'
    },
    {
      id: 5,
      subject: 'বাংলা ১ম ও ২য় (Bangla)',
      shortCode: 'BAN',
      cqMarks: 58,
      mcqMarks: 28,
      practicalMarks: 0,
      totalObtained: 86,
      fullMarks: 100,
      classAvg: 75.4,
      highestMark: 90,
      letterGrade: 'A+',
      gradePoint: 5.0,
      term1: 80,
      term2: 83,
      final: 86,
      status: 'GOOD',
      remarks: 'রচনামূলক ও ভাবসম্প্রসারণে ভালো লিখেছে।'
    },
    {
      id: 6,
      subject: 'English (1st & 2nd)',
      shortCode: 'ENG',
      cqMarks: 65,
      mcqMarks: 27,
      practicalMarks: 0,
      totalObtained: 92,
      fullMarks: 100,
      classAvg: 71.0,
      highestMark: 95,
      letterGrade: 'A+',
      gradePoint: 5.0,
      term1: 85,
      term2: 89,
      final: 92,
      status: 'EXCELLENT',
      remarks: 'Strong vocabulary and grammar command.'
    },
    {
      id: 7,
      subject: 'তথ্য ও যোগাযোগ প্রযুক্তি (ICT)',
      shortCode: 'ICT',
      cqMarks: 0,
      mcqMarks: 24,
      practicalMarks: 24,
      totalObtained: 48,
      fullMarks: 50,
      classAvg: 38.5,
      highestMark: 50,
      letterGrade: 'A+',
      gradePoint: 5.0,
      term1: 45,
      term2: 47,
      final: 48,
      status: 'OUTSTANDING',
      remarks: 'এইচটিএমএল ও সি প্রোগ্রামিংয়ে নিখুঁত।'
    }
  ], []);

  // Performance timeline data across terms
  const termTimeline = useMemo(() => [
    { term: '১ম সাময়িক', gpa: 4.86, percentage: 85.8, classAvg: 69.4, attendance: 96.5 },
    { term: '২য় সাময়িক', gpa: 4.93, percentage: 89.6, classAvg: 71.2, attendance: 98.0 },
    { term: 'মডেল টেস্ট', gpa: 5.00, percentage: 94.2, classAvg: 72.8, attendance: 100.0 },
    { term: 'বার্ষিক মূল্যায়ন', gpa: 5.00, percentage: 93.8, classAvg: 73.1, attendance: 98.2 }
  ], []);

  // Radar strength metrics
  const radarData = useMemo(() => [
    { subject: 'পদার্থবিজ্ঞান', studentScore: 95, classAvg: 73.5, fullMark: 100 },
    { subject: 'রসায়ন', studentScore: 91, classAvg: 69.8, fullMark: 100 },
    { subject: 'উচ্চতর গণিত', studentScore: 98, classAvg: 66.2, fullMark: 100 },
    { subject: 'জীববিজ্ঞান', studentScore: 89, classAvg: 72.0, fullMark: 100 },
    { subject: 'বাংলা', studentScore: 86, classAvg: 75.4, fullMark: 100 },
    { subject: 'English', studentScore: 92, classAvg: 71.0, fullMark: 100 },
    { subject: 'ICT', studentScore: 96, classAvg: 77.0, fullMark: 100 }
  ], []);

  // Calculated overall metrics
  const overallStats = useMemo(() => {
    const totalObtained = subjectAnalytics.reduce((sum, s) => sum + s.totalObtained, 0);
    const totalFull = subjectAnalytics.reduce((sum, s) => sum + s.fullMarks, 0);
    const totalAvg = subjectAnalytics.reduce((sum, s) => sum + s.classAvg, 0);
    const overallPercentage = ((totalObtained / totalFull) * 100).toFixed(1);
    const classAvgPercentage = ((totalAvg / totalFull) * 100).toFixed(1);
    const gapFromAvg = (Number(overallPercentage) - Number(classAvgPercentage)).toFixed(1);

    return {
      gpa: '5.00',
      grade: 'A+',
      overallPercentage,
      classAvgPercentage,
      gapFromAvg,
      meritRank: '২য় স্থান',
      totalSubjects: subjectAnalytics.length,
      attendanceRate: '98.2%'
    };
  }, [subjectAnalytics]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* ========================================================================= */}
      {/* TOP HERO HEADER & ADVANCED NAVIGATION TABS */}
      {/* ========================================================================= */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white border border-slate-800 shadow-2xl relative overflow-hidden">
        {/* Background glow accents */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-black">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>{customTitle || 'একাডেমিক অগ্রগতি ও পারফরম্যান্স হাব'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              {profile?.user?.name || 'শিক্ষার্থী'}-এর সার্বিক পারফরম্যান্স ড্যাশবোর্ড
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              বিষয়ভিত্তিক ফলাফল বিশ্লেষণ, টার্মভিত্তিক উন্নতির গ্রাফ, শ্রেণি গড়ের সাথে তুলনামূলক পরিমাপ ও বায়োমেট্রিক উপস্থিতি রেকর্ড।
            </p>
          </div>

          {/* Quick Action: Official Report Print */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              onClick={handlePrint}
              className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black flex items-center space-x-2 shadow-lg shadow-emerald-600/30 transition-all active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>রিপোর্ট স্লিপ প্রিন্ট</span>
            </button>
          </div>
        </div>

        {/* 4 Multi-Metric KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mt-6 pt-6 border-t border-slate-800/80">
          <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 backdrop-blur-md space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-wider text-indigo-300 font-bold">সার্বিক গ্রেড ও GPA</span>
              <Award className="w-4 h-4 text-amber-400" />
            </div>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-2xl sm:text-3xl font-black text-white font-mono">{overallStats.gpa}</span>
              <span className="px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-black">
                {overallStats.grade}
              </span>
            </div>
            <p className="text-[10px] text-slate-400">গোল্ডেন জিপিএ অর্জন</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 backdrop-blur-md space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-wider text-emerald-300 font-bold">গড় নম্বর অর্জন</span>
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">{overallStats.overallPercentage}%</span>
              <span className="text-[10px] text-emerald-300 font-bold">+{overallStats.gapFromAvg}%</span>
            </div>
            <p className="text-[10px] text-slate-400">শ্রেণি গড়ের চেয়ে এগিয়ে</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 backdrop-blur-md space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-wider text-blue-300 font-bold">বায়োমেট্রিক উপস্থিতি</span>
              <CalendarCheck className="w-4 h-4 text-blue-400" />
            </div>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-2xl sm:text-3xl font-black text-blue-400 font-mono">{overallStats.attendanceRate}</span>
            </div>
            <p className="text-[10px] text-slate-400">ধারাবাহিক নিয়মিত উপস্থিতি</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 backdrop-blur-md space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-wider text-amber-300 font-bold">ব্যাচ মেরিট পজিশন</span>
              <Target className="w-4 h-4 text-amber-400" />
            </div>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-2xl sm:text-3xl font-black text-amber-300 font-mono">{overallStats.meritRank}</span>
            </div>
            <p className="text-[10px] text-slate-400">টপ ৫% শিক্ষার্থীর অন্তর্ভুক্ত</p>
          </div>
        </div>

        {/* Navigation Tabs Pill Switcher */}
        <div className="flex items-center gap-2 mt-6 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setActiveSubTab('analytics')}
            className={`px-4 py-2 rounded-2xl text-xs font-black transition-all flex items-center space-x-2 flex-shrink-0 ${
              activeSubTab === 'analytics'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>অগ্রগতির গ্রাফ ও তুলনামূলক চার্ট</span>
          </button>

          <button
            onClick={() => setActiveSubTab('subjects')}
            className={`px-4 py-2 rounded-2xl text-xs font-black transition-all flex items-center space-x-2 flex-shrink-0 ${
              activeSubTab === 'subjects'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>বিষয়ভিত্তিক বিস্তারিত নম্বর বিশ্লেষণ</span>
          </button>

          <button
            onClick={() => setActiveSubTab('attendance')}
            className={`px-4 py-2 rounded-2xl text-xs font-black transition-all flex items-center space-x-2 flex-shrink-0 ${
              activeSubTab === 'attendance'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300'
            }`}
          >
            <CalendarCheck className="w-3.5 h-3.5" />
            <span>উপস্থিতি হিস্ট্রি ও ক্যালেন্ডার</span>
          </button>

          <button
            onClick={() => setActiveSubTab('report')}
            className={`px-4 py-2 rounded-2xl text-xs font-black transition-all flex items-center space-x-2 flex-shrink-0 ${
              activeSubTab === 'report'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>একাডেমিক প্রগ্রেস শিট ও মূল্যায়ন</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SUB-TAB 1: PROGRESS CHARTS & COMPARATIVE TRENDS */}
      {/* ========================================================================= */}
      {activeSubTab === 'analytics' && (
        <div className="space-y-6">
          {/* Chart View Controller */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                পারফরম্যান্স ট্রেন্ড ও শ্রেণি গড়ের তুলনা
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                প্রাপ্ত নম্বর বনাম শ্রেণির গড় নম্বর ও সর্বোচ্চ স্কোরের গ্রাফিকাল চিত্র
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setChartType('bars')}
                  className={`px-3 py-1.5 rounded-xl flex items-center space-x-1.5 transition-all ${
                    chartType === 'bars'
                      ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-300 shadow-sm'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>তুলনামূলক বার চার্ট</span>
                </button>

                <button
                  type="button"
                  onClick={() => setChartType('trends')}
                  className={`px-3 py-1.5 rounded-xl flex items-center space-x-1.5 transition-all ${
                    chartType === 'trends'
                      ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-300 shadow-sm'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>টার্ম প্রগ্রেস ট্রেন্ড</span>
                </button>

                <button
                  type="button"
                  onClick={() => setChartType('radar')}
                  className={`px-3 py-1.5 rounded-xl flex items-center space-x-1.5 transition-all ${
                    chartType === 'radar'
                      ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-300 shadow-sm'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>দক্ষতা রাডার</span>
                </button>
              </div>
            </div>
          </div>

          {/* Chart Canvas Area */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="h-80 sm:h-96 w-full">
              {chartType === 'bars' && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={subjectAnalytics} margin={{ top: 20, right: 30, left: 0, bottom: 25 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.6} />
                    <XAxis dataKey="shortCode" stroke="#64748b" fontSize={11} tickLine={false} />
                    <YAxis stroke="#64748b" fontSize={11} domain={[0, 100]} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderColor: '#334155',
                        borderRadius: '16px',
                        color: '#fff',
                        fontSize: '12px'
                      }}
                    />
                    <Legend wrapperStyle={{ paddingTop: '15px' }} />
                    <Bar dataKey="totalObtained" name="শিক্ষার্থীর প্রাপ্ত নম্বর" fill="#10b981" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="classAvg" name="শ্রেণির গড় স্কোর" fill="#64748b" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="highestMark" name="ব্যাচের সর্বোচ্চ নম্বর" fill="#f59e0b" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}

              {chartType === 'trends' && (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={termTimeline} margin={{ top: 20, right: 30, left: 0, bottom: 25 }}>
                    <defs>
                      <linearGradient id="colorPercentage" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="colorAvg" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.6} />
                    <XAxis dataKey="term" stroke="#64748b" fontSize={11} />
                    <YAxis stroke="#64748b" fontSize={11} domain={[50, 100]} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderColor: '#334155',
                        borderRadius: '16px',
                        color: '#fff'
                      }}
                    />
                    <Legend wrapperStyle={{ paddingTop: '15px' }} />
                    <Area
                      type="monotone"
                      dataKey="percentage"
                      name="শিক্ষার্থীর গড় % স্কোর"
                      stroke="#10b981"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorPercentage)"
                    />
                    <Area
                      type="monotone"
                      dataKey="classAvg"
                      name="শ্রেণির গড় % স্কোর"
                      stroke="#6366f1"
                      strokeWidth={2}
                      strokeDasharray="4 4"
                      fillOpacity={1}
                      fill="url(#colorAvg)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}

              {chartType === 'radar' && (
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart outerRadius="75%" data={radarData}>
                    <PolarGrid stroke="#e2e8f0" />
                    <PolarAngleAxis dataKey="subject" stroke="#64748b" fontSize={11} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#cbd5e1" />
                    <Radar
                      name="শিক্ষার্থীর দক্ষতা (%)"
                      dataKey="studentScore"
                      stroke="#10b981"
                      fill="#10b981"
                      fillOpacity={0.4}
                    />
                    <Radar
                      name="শ্রেণির গড় মান (%)"
                      dataKey="classAvg"
                      stroke="#6366f1"
                      fill="#6366f1"
                      fillOpacity={0.2}
                    />
                    <Legend />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Comparative Insight Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-3xl bg-emerald-50/80 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/60 space-y-2">
              <div className="flex items-center space-x-2 text-emerald-800 dark:text-emerald-300 font-bold text-xs">
                <ArrowUpRight className="w-4 h-4 text-emerald-600" />
                <span>শীর্ষ শক্তিশালী বিষয় (Top Strengths)</span>
              </div>
              <p className="text-sm font-black text-emerald-950 dark:text-emerald-100">
                উচ্চতর গণিত (৯৮%), ICT (৯৬%), পদার্থবিজ্ঞান (৯৫%)
              </p>
              <p className="text-xs text-emerald-700 dark:text-emerald-400 leading-relaxed">
                এই বিষয়গুলোতে শিক্ষার্থীর পারফরম্যান্স ক্লাসের গড় স্কোরের চেয়ে ২০%+ বেশি।
              </p>
            </div>

            <div className="p-5 rounded-3xl bg-blue-50/80 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/60 space-y-2">
              <div className="flex items-center space-x-2 text-blue-800 dark:text-blue-300 font-bold text-xs">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                <span>ধারাবাহিক অগ্রগতি (Consistency)</span>
              </div>
              <p className="text-sm font-black text-blue-950 dark:text-blue-100">
                ১ম টার্ম (৮৫.৮%) ➔ বার্ষিক (৯৩.৮%)
              </p>
              <p className="text-xs text-blue-700 dark:text-blue-400 leading-relaxed">
                টার্মভিত্তিক স্কোরে ক্রমাগত ৮.০% সামগ্রিক বৃদ্ধি ও নিয়মিত উন্নতি লক্ষ্য করা গেছে।
              </p>
            </div>

            <div className="p-5 rounded-3xl bg-amber-50/80 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/60 space-y-2">
              <div className="flex items-center space-x-2 text-amber-800 dark:text-amber-300 font-bold text-xs">
                <Target className="w-4 h-4 text-amber-600" />
                <span>অগ্রাধিকার ক্ষেত্র (Target Focus)</span>
              </div>
              <p className="text-sm font-black text-amber-950 dark:text-amber-100">
                বাংলা ১ম ও ২য় পত্র (৮৬%), জীববিজ্ঞান (৮৯%)
              </p>
              <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
                বোর্ড পরীক্ষায় গোল্ডেন এ+ নিশ্চিত করতে রচনামূলক ও জীববিজ্ঞান চিত্রে আরও জোর দিন।
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 2: SUBJECT-WISE MARK ANALYSIS */}
      {/* ========================================================================= */}
      {activeSubTab === 'subjects' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {subjectAnalytics.map((sub) => {
              const diffFromAvg = (sub.totalObtained - sub.classAvg).toFixed(1);
              const percentage = ((sub.totalObtained / sub.fullMarks) * 100).toFixed(0);

              return (
                <div
                  key={sub.id}
                  className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 hover:border-emerald-300 dark:hover:border-emerald-700/60 transition-all"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-bold text-xs flex items-center justify-center border border-emerald-100 dark:border-emerald-800">
                        {sub.shortCode}
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-slate-900 dark:text-white">{sub.subject}</h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">পূর্ণমান: {sub.fullMarks} নম্বর</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="px-2.5 py-1 rounded-xl bg-emerald-500 text-white font-black text-xs font-mono shadow-sm">
                        {sub.letterGrade} ({sub.gradePoint.toFixed(1)})
                      </span>
                    </div>
                  </div>

                  {/* Mark Breakdown (CQ, MCQ, Practical) */}
                  <div className="grid grid-cols-3 gap-2 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl text-center">
                    <div>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold block">সৃজনশীল (CQ)</span>
                      <span className="text-sm font-black text-slate-800 dark:text-slate-200 font-mono">{sub.cqMarks}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold block">নৈর্ব্যক্তিক (MCQ)</span>
                      <span className="text-sm font-black text-slate-800 dark:text-slate-200 font-mono">{sub.mcqMarks}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold block">ব্যবহারিক (PRAC)</span>
                      <span className="text-sm font-black text-slate-800 dark:text-slate-200 font-mono">{sub.practicalMarks}</span>
                    </div>
                  </div>

                  {/* Visual Progress Bar: Student vs Class Avg */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-700 dark:text-slate-300">
                        প্রাপ্ত স্কোর: <strong className="text-emerald-600 dark:text-emerald-400 font-mono text-sm">{sub.totalObtained}</strong> / {sub.fullMarks} ({percentage}%)
                      </span>
                      <span className="text-emerald-600 dark:text-emerald-400 text-[11px]">
                        +{diffFromAvg} গড় থেকে এগিয়ে
                      </span>
                    </div>

                    <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden relative">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
                      <span>শ্রেণির গড়: {sub.classAvg}</span>
                      <span>সর্বোচ্চ নম্বর: {sub.highestMark}</span>
                    </div>
                  </div>

                  {/* Teacher Feedback / Remarks */}
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 flex items-start space-x-2">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <p><strong className="text-slate-800 dark:text-slate-200">মূল্যায়ন:</strong> {sub.remarks}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 3: BIOMETRIC ATTENDANCE MATRIX & CALENDAR */}
      {/* ========================================================================= */}
      {activeSubTab === 'attendance' && (
        <div className="space-y-6">
          <GuardianAttendanceMatrix
            attendanceData={attendanceData}
            studentName={profile?.user?.name || 'শিক্ষার্থী'}
          />
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 4: DETAILED ACADEMIC PROGRESS REPORT & PRINTABLE LEDGER */}
      {/* ========================================================================= */}
      {activeSubTab === 'report' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          {/* Printable Report Header */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white font-black text-xl flex items-center justify-center shadow-lg shadow-emerald-600/20">
                {settings?.academyName ? settings.academyName.charAt(0) : 'N'}
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  {settings?.academyName || 'NextGen Academy'} — অফিসিয়াল একাডেমিক প্রগ্রেস রিপোর্ট
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  পরিচালক: মো: আলমগীর হোসেন (সাগর) • হেল্পলাইন: ০১৭৯২৮১৮০০৫
                </p>
              </div>
            </div>

            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-black rounded-xl flex items-center space-x-2 transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>প্রিন্ট করুন</span>
            </button>
          </div>

          {/* Student Bio Quick Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs">
            <div>
              <span className="text-slate-500 font-medium block">শিক্ষার্থীর নাম:</span>
              <span className="font-bold text-slate-900 dark:text-white">{profile?.user?.name || 'তাহমিদ হাসান'}</span>
            </div>
            <div>
              <span className="text-slate-500 font-medium block">রোল ও আইডি:</span>
              <span className="font-bold text-slate-900 dark:text-white">রোল {profile?.rollNo || '০১'} • {profile?.studentIdNumber || 'NGA-26-4821'}</span>
            </div>
            <div>
              <span className="text-slate-500 font-medium block">শ্রেণি ও শাখা:</span>
              <span className="font-bold text-slate-900 dark:text-white">{profile?.class?.nameBn || '১০ম শ্রেণি'} (বিজ্ঞান)</span>
            </div>
            <div>
              <span className="text-slate-500 font-medium block">শিক্ষাবর্ষ:</span>
              <span className="font-bold text-slate-900 dark:text-white">২০২৬ শিক্ষাবর্ষ</span>
            </div>
          </div>

          {/* Detailed Tabular Ledger */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-black uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-3.5">বিষয়</th>
                  <th className="p-3.5 text-center">CQ</th>
                  <th className="p-3.5 text-center">MCQ</th>
                  <th className="p-3.5 text-center">PRAC</th>
                  <th className="p-3.5 text-center">মোট প্রাপ্ত</th>
                  <th className="p-3.5 text-center">শ্রেণি গড়</th>
                  <th className="p-3.5 text-center">সর্বোচ্চ</th>
                  <th className="p-3.5 text-center">লেটার গ্রেড</th>
                  <th className="p-3.5 text-center">গ্রেড পয়েন্ট</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                {subjectAnalytics.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="p-3.5 font-bold">{row.subject}</td>
                    <td className="p-3.5 text-center font-mono">{row.cqMarks}</td>
                    <td className="p-3.5 text-center font-mono">{row.mcqMarks}</td>
                    <td className="p-3.5 text-center font-mono">{row.practicalMarks}</td>
                    <td className="p-3.5 text-center font-black text-emerald-600 dark:text-emerald-400 font-mono text-sm">
                      {row.totalObtained}
                    </td>
                    <td className="p-3.5 text-center font-mono text-slate-500">{row.classAvg}</td>
                    <td className="p-3.5 text-center font-mono text-amber-600 font-bold">{row.highestMark}</td>
                    <td className="p-3.5 text-center">
                      <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold font-mono">
                        {row.letterGrade}
                      </span>
                    </td>
                    <td className="p-3.5 text-center font-black font-mono">{row.gradePoint.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-50 dark:bg-slate-800/80 font-black border-t-2 border-slate-200 dark:border-slate-700">
                <tr>
                  <td className="p-3.5">সার্বিক ফলাফল (Overall Result)</td>
                  <td colSpan={3} className="p-3.5 text-center text-slate-500">
                    মোট প্রাপ্ত: {overallStats.overallPercentage}%
                  </td>
                  <td className="p-3.5 text-center text-emerald-600 font-mono text-base">
                    {subjectAnalytics.reduce((a, b) => a + b.totalObtained, 0)}
                  </td>
                  <td className="p-3.5 text-center text-slate-500 font-mono">{overallStats.classAvgPercentage}%</td>
                  <td className="p-3.5 text-center text-amber-600 font-mono">GPA {overallStats.gpa}</td>
                  <td className="p-3.5 text-center">
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-black">
                      {overallStats.grade}
                    </span>
                  </td>
                  <td className="p-3.5 text-center text-emerald-600 font-mono text-sm">{overallStats.gpa}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Director Signature & Seal Endorsement */}
          <div className="pt-8 mt-6 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-3 gap-6 text-center text-xs">
            <div className="space-y-1">
              <p className="font-bold text-slate-800 dark:text-slate-200">মো: আলমগীর হোসেন (সাগর)</p>
              <p className="text-[10px] text-slate-500">পরিচালক ও প্রধান শিক্ষক</p>
              <div className="w-32 h-0.5 bg-slate-300 mx-auto mt-2" />
            </div>

            <div className="space-y-1">
              <p className="font-bold text-slate-800 dark:text-slate-200">ক্লাস টিচার ও কো-অর্ডিনেটর</p>
              <p className="text-[10px] text-slate-500">একাডেমিক মূল্যায়ন বিভাগ</p>
              <div className="w-32 h-0.5 bg-slate-300 mx-auto mt-2" />
            </div>

            <div className="col-span-2 sm:col-span-1 space-y-1">
              <p className="font-bold text-emerald-700 dark:text-emerald-400">NextGen Academy সিল</p>
              <p className="text-[10px] text-slate-500">পশ্চিম জয়দেবপুর, গাজীপুর</p>
              <div className="w-32 h-0.5 bg-emerald-400 mx-auto mt-2" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
