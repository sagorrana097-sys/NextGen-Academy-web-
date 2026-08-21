import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import {
  CalendarCheck,
  CheckCircle,
  XCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  AlertCircle
} from 'lucide-react';

export default function GuardianAttendanceMatrix({ attendanceData = [], studentName = 'শিক্ষার্থী' }) {
  const { lang, t } = useLanguage();
  const [currentMonth, setCurrentMonth] = useState('আগস্ট ২০২৬');

  // Days in month dynamically calculated from real attendanceData
  const daysInMonth = Array.from({ length: 31 }, (_, i) => {
    const day = i + 1;
    const isFriday = day % 7 === 6;
    const isSaturday = day % 7 === 0;
    const isWeekend = isFriday || isSaturday;

    // Find actual log for this day
    const dayStr = String(day).padStart(2, '0');
    const actualLog = Array.isArray(attendanceData)
      ? attendanceData.find((a) => a.date?.endsWith(`-${dayStr}`) || a.day === day)
      : null;

    let status = 'UPCOMING';
    let inTime = '-';
    let outTime = '-';

    if (isWeekend) {
      status = 'WEEKEND';
    } else if (actualLog) {
      status = actualLog.status || 'PRESENT';
      inTime = actualLog.inTime || '০৮:০০ AM';
      outTime = actualLog.outTime || '০১:১৫ PM';
    } else if (day <= new Date().getDate()) {
      status = 'WEEKEND';
    }

    return {
      day,
      status,
      inTime,
      outTime
    };
  });

  const presentDays = daysInMonth.filter(d => d.status === 'PRESENT').length;
  const absentDays = daysInMonth.filter(d => d.status === 'ABSENT').length;
  const lateDays = daysInMonth.filter(d => d.status === 'LATE').length;
  const totalWorkingDays = presentDays + absentDays + lateDays;
  const attendanceRate = totalWorkingDays > 0 ? (((presentDays + lateDays * 0.5) / totalWorkingDays) * 100).toFixed(1) : 100;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-black mb-2">
            <CalendarCheck className="w-3.5 h-3.5" />
            <span>ডিজিটাল বায়োমেট্রিক উপস্থিতি ট্র্যাকার</span>
          </div>
          <h3 className="text-lg font-black text-slate-900 dark:text-slate-100">
            {studentName}-এর মাসিক উপস্থিতি ক্যালেন্ডার
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            প্রতিদিনের ইন-টাইম, আউট-টাইম এবং উপস্থিতির লাইভ স্ট্যাটাস
          </p>
        </div>

        {/* Month Selector */}
        <div className="flex items-center space-x-2 bg-slate-50 dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700">
          <span className="px-3 py-1 text-xs font-bold text-slate-800 dark:text-slate-200">
            {currentMonth}
          </span>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 space-y-1">
          <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 uppercase">উপস্থিতির হার</span>
          <div className="flex items-baseline space-x-1">
            <span className="text-2xl font-black text-emerald-700 dark:text-emerald-400 font-mono">{attendanceRate}%</span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/60 space-y-1">
          <span className="text-[10px] font-bold text-blue-800 dark:text-blue-300 uppercase">উপস্থিত দিন</span>
          <div className="flex items-baseline space-x-1">
            <span className="text-2xl font-black text-blue-700 dark:text-blue-400 font-mono">{presentDays}</span>
            <span className="text-xs text-blue-600 font-bold">দিন</span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/60 space-y-1">
          <span className="text-[10px] font-bold text-rose-800 dark:text-rose-300 uppercase">অনুপস্থিত দিন</span>
          <div className="flex items-baseline space-x-1">
            <span className="text-2xl font-black text-rose-700 dark:text-rose-400 font-mono">{absentDays}</span>
            <span className="text-xs text-rose-600 font-bold">দিন</span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 space-y-1">
          <span className="text-[10px] font-bold text-amber-800 dark:text-amber-300 uppercase">দেরিতে উপস্থিতি</span>
          <div className="flex items-baseline space-x-1">
            <span className="text-2xl font-black text-amber-700 dark:text-amber-400 font-mono">{lateDays}</span>
            <span className="text-xs text-amber-600 font-bold">দিন</span>
          </div>
        </div>
      </div>

      {/* Calendar Grid Matrix with Green/Red Dots */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 px-1">
          <span>আগস্ট ২০২৬ ক্যালেন্ডার ম্যাট্রিক্স</span>
          <div className="flex items-center space-x-4 text-[11px]">
            <span className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>উপস্থিত</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span>অনুপস্থিত</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span>লেট</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700" />
              <span>ছুটি</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {['রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহঃ', 'শুক্র', 'শনি'].map((w, idx) => (
            <div key={idx} className="text-center text-[11px] font-black text-slate-400 dark:text-slate-500 py-1">
              {w}
            </div>
          ))}

          {daysInMonth.map((d) => {
            const isPresent = d.status === 'PRESENT';
            const isAbsent = d.status === 'ABSENT';
            const isLate = d.status === 'LATE';
            const isWeekend = d.status === 'WEEKEND';
            const isUpcoming = d.status === 'UPCOMING';

            return (
              <div
                key={d.day}
                className={`p-2 rounded-2xl border text-center transition-all flex flex-col justify-between min-h-[64px] ${
                  isPresent
                    ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800'
                    : isAbsent
                    ? 'bg-rose-50/60 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800 ring-1 ring-rose-400/40'
                    : isLate
                    ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800'
                    : isWeekend
                    ? 'bg-slate-100/70 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/60 opacity-60'
                    : 'bg-slate-50/50 dark:bg-slate-800/20 border-dashed border-slate-200 dark:border-slate-700 opacity-40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black font-mono text-slate-800 dark:text-slate-200">{d.day}</span>
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isPresent
                        ? 'bg-emerald-500 ring-2 ring-emerald-200'
                        : isAbsent
                        ? 'bg-rose-500 ring-2 ring-rose-200 animate-pulse'
                        : isLate
                        ? 'bg-amber-500 ring-2 ring-amber-200'
                        : 'bg-slate-300 dark:bg-slate-600'
                    }`}
                  />
                </div>

                <div className="text-[9px] font-mono font-bold text-slate-500 dark:text-slate-400 mt-1">
                  {isUpcoming ? '-' : isWeekend ? 'ছুটি' : d.inTime.split(' ')[0]}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
