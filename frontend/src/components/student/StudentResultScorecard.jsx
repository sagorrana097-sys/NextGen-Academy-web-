import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import {
  Award,
  TrendingUp,
  CheckCircle,
  FileSpreadsheet,
  Download,
  Printer,
  Sparkles,
  BookOpen
} from 'lucide-react';

export default function StudentResultScorecard({ results, studentName = 'তাহমিদ হাসান', studentRoll = '1001', studentClass = 'Class 10' }) {
  const { lang, t } = useLanguage();

  // Calculate or mock totals if needed
  const sampleSubjects = [
    { code: '101', name: 'বাংলা (Bangla)', fullMarks: 100, obtainedMarks: 88, gpa: '5.00', grade: 'A+' },
    { code: '107', name: 'ইংরেজি (English)', fullMarks: 100, obtainedMarks: 82, gpa: '5.00', grade: 'A+' },
    { code: '109', name: 'সাধারণ গণিত (General Math)', fullMarks: 100, obtainedMarks: 94, gpa: '5.00', grade: 'A+' },
    { code: '136', name: 'পদার্থবিজ্ঞান (Physics)', fullMarks: 100, obtainedMarks: 85, gpa: '5.00', grade: 'A+' },
    { code: '137', name: 'রসায়ন (Chemistry)', fullMarks: 100, obtainedMarks: 79, gpa: '4.00', grade: 'A' },
    { code: '138', name: 'জীববিজ্ঞান (Biology)', fullMarks: 100, obtainedMarks: 90, gpa: '5.00', grade: 'A+' },
    { code: '154', name: 'আইসিটি (ICT)', fullMarks: 50, obtainedMarks: 48, gpa: '5.00', grade: 'A+' }
  ];

  const totalFull = sampleSubjects.reduce((acc, s) => acc + s.fullMarks, 0);
  const totalObtained = sampleSubjects.reduce((acc, s) => acc + s.obtainedMarks, 0);
  const percentage = ((totalObtained / totalFull) * 100).toFixed(1);
  const cgpa = '4.95';

  // SVG circular progress calculation
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-7 shadow-sm space-y-6">
      {/* Top Banner with CGPA Progress Ring */}
      <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 rounded-3xl p-6 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-2 text-center md:text-left z-10">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-black">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>শিক্ষাবর্ষ ২০২৬ • ১ম সাময়িক পরীক্ষা ফলাফল</span>
          </div>

          <h3 className="text-2xl font-black text-white">
            অটোমেটেড একাডেমিক রেজাল্ট স্কোরকার্ড
          </h3>
          <p className="text-xs text-slate-300">
            শিক্ষার্থী: <strong className="text-white">{studentName}</strong> • রোল: <strong className="text-white font-mono">{studentRoll}</strong> • শ্রেণি: <strong className="text-white">{studentClass}</strong>
          </p>
        </div>

        {/* Circular Progress Ring */}
        <div className="flex items-center space-x-5 z-10 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
          <div className="relative w-24 h-24 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r={radius}
                className="text-white/20 stroke-current"
                strokeWidth="8"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r={radius}
                className="text-amber-400 stroke-current transition-all duration-1000 ease-out"
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-sm font-black text-white font-mono">{percentage}%</span>
              <span className="text-[9px] text-amber-200 font-bold uppercase">নম্বর হার</span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] text-indigo-200 font-bold block uppercase tracking-wider">সর্বমোট জিপিএ</span>
            <div className="flex items-baseline space-x-1">
              <span className="text-2xl font-black text-white font-mono">{cgpa}</span>
              <span className="text-xs text-slate-300 font-bold">/ 5.00</span>
            </div>
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-500/30 text-emerald-300 text-[10px] font-black border border-emerald-400/40">
              🌟 গোল্ডেন A+
            </span>
          </div>
        </div>
      </div>

      {/* Subject-Wise Breakdown Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-black border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th className="p-3.5">কোড</th>
              <th className="p-3.5">বিষয় ও পত্র</th>
              <th className="p-3.5 text-center">পূর্ণমান</th>
              <th className="p-3.5 text-center">প্রাপ্ত নম্বর</th>
              <th className="p-3.5 text-center">লেটার গ্রেড</th>
              <th className="p-3.5 text-center">গ্রেড পয়েন্ট (GPA)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
            {sampleSubjects.map((sub) => (
              <tr key={sub.code} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                <td className="p-3.5 font-mono text-slate-400 dark:text-slate-500 font-bold">{sub.code}</td>
                <td className="p-3.5 font-bold text-slate-800 dark:text-slate-100 flex items-center space-x-2">
                  <BookOpen className="w-4 h-4 text-indigo-500" />
                  <span>{sub.name}</span>
                </td>
                <td className="p-3.5 text-center font-mono font-bold text-slate-600 dark:text-slate-400">{sub.fullMarks}</td>
                <td className="p-3.5 text-center font-mono font-black text-indigo-600 dark:text-indigo-400 text-sm">
                  {sub.obtainedMarks}
                </td>
                <td className="p-3.5 text-center">
                  <span className="px-2.5 py-0.5 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-black text-xs">
                    {sub.grade}
                  </span>
                </td>
                <td className="p-3.5 text-center font-mono font-black text-slate-800 dark:text-slate-200">
                  {sub.gpa}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Printable Action Footer */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
          মোট নম্বর: <strong className="text-slate-900 dark:text-slate-100 font-mono">{totalObtained}</strong> / {totalFull}
        </span>

        <button
          onClick={() => window.print()}
          className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-700 text-white font-bold text-xs flex items-center space-x-1.5 transition-all shadow-md active:scale-95"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>মার্কশিট প্রিন্ট করুন</span>
        </button>
      </div>
    </div>
  );
}
