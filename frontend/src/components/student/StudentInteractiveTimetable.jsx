import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import PrintableRoutineSlipModal from '../common/PrintableRoutineSlipModal';
import {
  Calendar,
  Clock,
  BookOpen,
  User,
  MapPin,
  ChevronRight,
  Sparkles,
  Download,
  Printer
} from 'lucide-react';

export default function StudentInteractiveTimetable({ routine = [], studentClass = 'Class 10' }) {
  const { lang, t } = useLanguage();
  const [selectedDay, setSelectedDay] = useState('SUNDAY');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showRoutineSlipModal, setShowRoutineSlipModal] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const daysList = [
    { key: 'SUNDAY', labelBn: 'রবিবার', labelEn: 'Sunday' },
    { key: 'MONDAY', labelBn: 'সোমবার', labelEn: 'Monday' },
    { key: 'TUESDAY', labelBn: 'মঙ্গলবার', labelEn: 'Tuesday' },
    { key: 'WEDNESDAY', labelBn: 'বুধবার', labelEn: 'Wednesday' },
    { key: 'THURSDAY', labelBn: 'বৃহস্পতিবার', labelEn: 'Thursday' }
  ];

  // Filter real routine items for the selected day
  const filteredSchedule = Array.isArray(routine)
    ? routine.filter((r) => {
        const dayMatch = (r.day || r.dayOfWeek || '').toUpperCase();
        return dayMatch.includes(selectedDay) || dayMatch.includes(daysList.find(d => d.key === selectedDay)?.labelBn);
      })
    : [];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-black mb-2">
            <Calendar className="w-3.5 h-3.5" />
            <span>সাপ্তাহিক রুটিন ও ক্লাস শিডিউল</span>
          </div>
          <h3 className="text-lg font-black text-slate-900 dark:text-slate-100">
            ইন্টারেক্টিভ ক্লাস টাইমটেবিল ({studentClass})
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            প্রতিটি বিষয়ের সময়সূচি, শিক্ষক এবং ক্লাস রুমের তালিকা
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {filteredSchedule.length > 0 && (
            <button
              type="button"
              onClick={() => setShowRoutineSlipModal(true)}
              className="px-3.5 py-2 rounded-2xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center space-x-1.5 transition-all active:scale-95 border border-indigo-200 shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>পিডিএফ ডাউনলোড</span>
            </button>
          )}
          <div className="flex items-center space-x-2 bg-slate-50 dark:bg-slate-800 p-2 rounded-2xl border border-slate-200 dark:border-slate-700">
            <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400 animate-pulse" />
            <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">
              {currentTime.toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>
      </div>

      {/* Days Selection Pills */}
      <div className="flex flex-wrap gap-2">
        {daysList.map((day) => {
          const isSelected = selectedDay === day.key;
          return (
            <button
              key={day.key}
              onClick={() => setSelectedDay(day.key)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all flex items-center space-x-1.5 ${
                isSelected
                  ? 'bg-slate-900 dark:bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 scale-105'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <span>{lang === 'bn' ? day.labelBn : day.labelEn}</span>
            </button>
          );
        })}
      </div>

      {/* Routine Cards Grid / Empty State */}
      {filteredSchedule.length === 0 ? (
        <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-2">
          <Calendar className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600" />
          <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200">আজকের কোনো ক্লাস শিডিউল নেই</h4>
          <p className="text-xs text-slate-400">এই দিনের জন্য বর্তমানে কোনো ক্লাসের রুটিন নির্ধারিত নেই।</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSchedule.map((item, idx) => (
            <div
              key={item.id || idx}
              className="p-4 rounded-2xl border bg-white dark:bg-slate-800/90 border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500 hover:shadow-md transition-all duration-200 relative overflow-hidden flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-xl text-[10px] font-black bg-indigo-50 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300">
                    পিরিয়ড {item.periodNumber || idx + 1}
                  </span>

                  <div className="flex items-center space-x-1 text-slate-400 text-xs font-mono">
                    <Clock className="w-3.5 h-3.5" />
                    <span className="text-[11px] font-bold">{item.startTime} - {item.endTime}</span>
                  </div>
                </div>

                <h4 className="font-black text-sm text-slate-900 dark:text-slate-100 pt-1">
                  {item.subjectName || item.subject?.nameBn || item.subject?.name || 'বিষয়'}
                </h4>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-center space-x-1.5 truncate max-w-[140px]">
                  <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{item.teacherName || item.teacher?.name || 'বিষয় শিক্ষক'}</span>
                </div>

                <div className="flex items-center space-x-1 font-semibold text-[11px] text-indigo-600 dark:text-indigo-400">
                  <MapPin className="w-3 h-3 shrink-0" />
                  <span>{item.roomNumber || item.room || 'কক্ষ ৩০১'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Printable Routine Slip Modal */}
      {showRoutineSlipModal && filteredSchedule.length > 0 && (
        <PrintableRoutineSlipModal
          routineData={filteredSchedule}
          classInfo={{ nameBn: studentClass }}
          batchInfo={{ nameBn: 'ক্লাস রুটিন' }}
          isOpen={showRoutineSlipModal}
          onClose={() => setShowRoutineSlipModal(false)}
        />
      )}
    </div>
  );
}
