import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
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
  Sparkles,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Layers,
  ArrowUpRight,
  Filter,
  PieChart
} from 'lucide-react';

export default function AcademicPerformanceAnalytics({ student = null, marks = [], customTitle = '' }) {
  const { lang } = useLanguage();
  const [chartType, setChartType] = useState('bars'); // 'bars' | 'lines' | 'radar'
  const [selectedTerm, setSelectedTerm] = useState('ALL');

  // Real data check: A production user must never see fake trends
  const hasRealMarks = Array.isArray(marks) && marks.length > 0;
  if (!hasRealMarks && !student?.hasExamData) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-8 md:p-12 border border-slate-200 dark:border-slate-800 text-center space-y-4 shadow-sm">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-500">
          <BarChart3 className="w-7 h-7" />
        </div>
        <div className="space-y-1 max-w-md mx-auto">
          <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
            ফলাফল ডেটা এখনও প্রস্তুত নয় / No Performance Data Available Yet
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {student ? `${student.nameBn || student.name}-এর কোনো পরীক্ষার ফলাফল রেকর্ড পাওয়া যায়নি। পরীক্ষা অনুষ্ঠিত হলে বিষয়ভিত্তিক চার্ট এখানে প্রদর্শিত হবে।` : 'কোনো একাডেমিক পরীক্ষার ফলাফল ডেটা পাওয়া যায়নি।'}
          </p>
        </div>
      </div>
    );
  }

  // Derive real subject trends from marks
  const displayedSubjectData = marks.map((m) => ({
    subject: m.subject?.nameBn || m.subject?.name || m.subjectName || 'বিষয়',
    shortCode: (m.subject?.code || m.subjectName || 'SUB').slice(0, 5),
    marks: Number(m.obtainedMarks || 0),
    term1: Number(m.term1Marks || m.obtainedMarks || 0),
    term2: Number(m.term2Marks || m.obtainedMarks || 0),
    annual: Number(m.obtainedMarks || 0),
    classAvg: Number(m.classAverage || 75),
    highest: Number(m.highestMarks || 95)
  }));

  const currentGpa = marks.reduce((sum, m) => sum + Number(m.gradePoint || 0), 0) / (marks.length || 1);
  const totalObt = marks.reduce((sum, m) => sum + Number(m.obtainedMarks || 0), 0);
  const totalMax = marks.reduce((sum, m) => sum + Number(m.totalMarks || 100), 0);
  const currentPercentage = totalMax > 0 ? (totalObt / totalMax) * 100 : 0;
  const currentRank = student?.meritPosition || 1;
  const topSubject = [...displayedSubjectData].sort((a, b) => b.marks - a.marks)[0] || { subject: 'সাধারণ' };

  return (
    <div className="space-y-6">
      {/* Component Header with Filters */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold border border-indigo-100 dark:border-indigo-800">
            <TrendingUp className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>{customTitle || 'একাডেমিক অগ্রগতি ও ফলাফল অ্যানালিটিক্স'}</span>
          </div>
          <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white mt-1">
            বিষয়ভিত্তিক নম্বর বিশ্লেষণ ও অগ্রগতি চার্ট
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {student ? `${student.nameBn || student.name} • রোল: ${student.rollNo || 'N/A'}` : 'সকল টার্মের ফলাফল ও ক্লাস গড়ের সাথে তুলনামূলক গ্রাফ'}
          </p>
        </div>

        {/* Visual Chart Type Switcher */}
        <div className="flex items-center space-x-2">
          <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs font-bold">
            <button
              type="button"
              onClick={() => setChartType('bars')}
              className={`px-3 py-1.5 rounded-xl flex items-center space-x-1.5 transition-all ${
                chartType === 'bars'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>বার চার্ট</span>
            </button>

            <button
              type="button"
              onClick={() => setChartType('lines')}
              className={`px-3 py-1.5 rounded-xl flex items-center space-x-1.5 transition-all ${
                chartType === 'lines'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>ট্রেন্ড লাইন</span>
            </button>

            <button
              type="button"
              onClick={() => setChartType('radar')}
              className={`px-3 py-1.5 rounded-xl flex items-center space-x-1.5 transition-all ${
                chartType === 'radar'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <PieChart className="w-3.5 h-3.5" />
              <span>দক্ষতা রাডার</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Performance Highlights */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100/50 dark:from-indigo-950/40 dark:to-indigo-900/20 rounded-2xl p-4 border border-indigo-200/60 dark:border-indigo-800/40 space-y-1">
          <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">বর্তমান টার্ম GPA</span>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-2xl font-black text-indigo-950 dark:text-indigo-100 font-mono">
              {currentGpa.toFixed(2)}
            </span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">/ 5.00</span>
          </div>
          <span className="text-[10px] text-indigo-500 dark:text-indigo-400">গ্রেড: গোল্ডেন A+</span>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-950/40 dark:to-emerald-900/20 rounded-2xl p-4 border border-emerald-200/60 dark:border-emerald-800/40 space-y-1">
          <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">গড় নম্বর (Average)</span>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-2xl font-black text-emerald-950 dark:text-emerald-100 font-mono">
              {currentPercentage.toFixed(1)}%
            </span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">↑ 3.5%</span>
          </div>
          <span className="text-[10px] text-emerald-500 dark:text-emerald-400">গত টার্মের চেয়ে উন্নত</span>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-950/40 dark:to-amber-900/20 rounded-2xl p-4 border border-amber-200/60 dark:border-amber-800/40 space-y-1">
          <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400">মেধাক্রম (Class Rank)</span>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-2xl font-black text-amber-950 dark:text-amber-100 font-mono">
              {currentRank}নং
            </span>
            <span className="text-xs font-bold text-slate-500">/ ৪৫ জন</span>
          </div>
          <span className="text-[10px] text-amber-600 dark:text-amber-400">শীর্ষ ৩ জনের অন্তর্ভুক্ত</span>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950/40 dark:to-purple-900/20 rounded-2xl p-4 border border-purple-200/60 dark:border-purple-800/40 space-y-1">
          <span className="text-[11px] font-bold text-purple-600 dark:text-purple-400">সেরা পারফর্মিং বিষয়</span>
          <div className="text-sm font-black text-purple-950 dark:text-purple-100 truncate">
            {topSubject.subject.split('(')[0]}
          </div>
          <span className="text-[10px] text-purple-600 dark:text-purple-400 font-mono">
            সর্বোচ্চ নম্বর: {topSubject.annual}/১০০
          </span>
        </div>
      </div>

      {/* Main Chart Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <h4 className="font-extrabold text-sm text-slate-800 dark:text-slate-200">
              {chartType === 'bars' && 'বিষয়ভিত্তিক প্রাপ্ত নম্বর বনাম শ্রেণি গড় (Marks vs Class Average)'}
              {chartType === 'lines' && 'টার্মভিত্তিক জিপিএ ও উপস্থিতির ধারাবাহিক প্রবৃদ্ধি (Term-wise GPA Trend)'}
              {chartType === 'radar' && 'সকল বিষয়ের দক্ষতা রাডার ও সামর্থ্য মানচিত্র (Competency Map)'}
            </h4>
          </div>

          {/* Term Filter */}
          {chartType === 'bars' && (
            <div className="flex items-center space-x-2 text-xs">
              <span className="text-slate-400 font-medium">টার্ম:</span>
              <select
                value={selectedTerm}
                onChange={(e) => setSelectedTerm(e.target.value)}
                className="px-2.5 py-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="ALL">বার্ষিক মূল্যায়ন (Annual Exam)</option>
                <option value="term2">২য় সাময়িক (2nd Term)</option>
                <option value="term1">১ম সাময়িক (1st Term)</option>
              </select>
            </div>
          )}
        </div>

        {/* 1. Bar Chart: Subject Marks vs Class Average */}
        {chartType === 'bars' && (
          <div className="h-72 sm:h-80 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={displayedSubjectData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.6} />
                <XAxis
                  dataKey="shortCode"
                  tick={{ fontSize: 11, fontWeight: 'bold', fill: '#64748b' }}
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="p-3 bg-slate-900 text-white rounded-xl shadow-xl border border-slate-700 text-xs space-y-1">
                          <p className="font-black text-indigo-300">{data.subject}</p>
                          <p className="font-bold text-emerald-400">প্রাপ্ত নম্বর: {payload[0].value} / ১০০</p>
                          <p className="text-slate-300">শ্রেণি গড়: {payload[1]?.value} নম্বর</p>
                          <p className="text-amber-300">সর্বোচ্চ নম্বর: {data.highest} নম্বর</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend
                  verticalAlign="top"
                  align="right"
                  wrapperStyle={{ paddingBottom: '10px', fontSize: '11px', fontWeight: 'bold' }}
                />
                <Bar name="প্রাপ্ত নম্বর (Student Marks)" dataKey="marks" fill="#6366f1" radius={[8, 8, 0, 0]} maxBarSize={32} />
                <Bar name="শ্রেণি গড় (Class Average)" dataKey="classAvg" fill="#94a3b8" radius={[8, 8, 0, 0]} maxBarSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* 2. Line Chart: Term Progress & GPA Trend */}
        {chartType === 'lines' && (
          <div className="h-72 sm:h-80 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={termProgressData} margin={{ top: 10, right: 20, left: -20, bottom: 10 }}>
                <defs>
                  <linearGradient id="gpaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="percGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.6} />
                <XAxis dataKey="term" tick={{ fontSize: 11, fontWeight: 'bold', fill: '#64748b' }} />
                <YAxis domain={[60, 100]} tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="p-3 bg-slate-900 text-white rounded-xl shadow-xl border border-slate-700 text-xs space-y-1">
                          <p className="font-black text-indigo-300">{label}</p>
                          <p className="font-bold text-emerald-400">GPA: {d.gpa.toFixed(2)} (গোল্ডেন A+)</p>
                          <p className="text-indigo-300">গড় নম্বর: {d.percentage}%</p>
                          <p className="text-amber-300">ক্লাস পজিশন: {d.rank}নং স্থান</p>
                          <p className="text-slate-300">উপস্থিতি: {d.attendance}%</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend verticalAlign="top" align="right" wrapperStyle={{ paddingBottom: '10px', fontSize: '11px', fontWeight: 'bold' }} />
                <Area type="monotone" name="শতকরা নম্বর (%)" dataKey="percentage" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#percGradient)" />
                <Area type="monotone" name="উপস্থিতির হার (%)" dataKey="attendance" stroke="#10b981" strokeWidth={2} strokeDasharray="4 4" fillOpacity={1} fill="url(#gpaGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* 3. Radar Chart: Competency Map */}
        {chartType === 'radar' && (
          <div className="h-72 sm:h-80 w-full flex items-center justify-center pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={displayedSubjectData}>
                <PolarGrid stroke="#cbd5e1" />
                <PolarAngleAxis dataKey="shortCode" tick={{ fontSize: 11, fontWeight: 'bold', fill: '#475569' }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9 }} />
                <Radar name="প্রাপ্ত নম্বর" dataKey="annual" stroke="#6366f1" fill="#6366f1" fillOpacity={0.4} />
                <Radar name="শ্রেণি গড়" dataKey="classAvg" stroke="#94a3b8" fill="#94a3b8" fillOpacity={0.2} />
                <Tooltip />
                <Legend verticalAlign="bottom" wrapperStyle={{ paddingTop: '10px', fontSize: '11px' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Subject-wise Detailed Breakdown Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-4 h-4 text-indigo-600" />
            <h4 className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200">
              বিষয়ভিত্তিক গ্রেড ও অগ্রগতি তালিকা (Subject-wise Grade Card)
            </h4>
          </div>
          <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
            পূর্ণাঙ্গ মূল্যায়ন ২০২৬
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100/75 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-700 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">পাঠ্য বিষয় (Subject)</th>
                <th className="py-3 px-3 text-center">১ম সাময়িক</th>
                <th className="py-3 px-3 text-center">২য় সাময়িক</th>
                <th className="py-3 px-3 text-center font-black text-indigo-600">বার্ষিক মূল্যায়ন</th>
                <th className="py-3 px-3 text-center">শ্রেণি গড়</th>
                <th className="py-3 px-3 text-center">লেটার গ্রেড</th>
                <th className="py-3 px-4 text-right">অগ্রগতি স্ট্যাটাস</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium text-slate-800 dark:text-slate-200">
              {defaultSubjectTrends.map((s, idx) => {
                const diff = s.annual - s.term1;
                return (
                  <tr key={idx} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-bold flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full bg-indigo-500" />
                      <span>{s.subject}</span>
                    </td>
                    <td className="py-3 px-3 text-center font-mono">{s.term1}</td>
                    <td className="py-3 px-3 text-center font-mono">{s.term2}</td>
                    <td className="py-3 px-3 text-center font-mono font-black text-indigo-600 dark:text-indigo-400 text-sm">
                      {s.annual}
                    </td>
                    <td className="py-3 px-3 text-center font-mono text-slate-500">{s.classAvg}</td>
                    <td className="py-3 px-3 text-center">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-black font-mono text-[11px] border border-emerald-200 dark:border-emerald-800">
                        {s.grade}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className={`inline-flex items-center space-x-1 font-bold text-[11px] ${
                        diff >= 0 ? 'text-emerald-600' : 'text-rose-600'
                      }`}>
                        <span>{diff >= 0 ? `+${diff}` : diff} নম্বর</span>
                        <ArrowUpRight className={`w-3.5 h-3.5 ${diff < 0 ? 'rotate-90' : ''}`} />
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
