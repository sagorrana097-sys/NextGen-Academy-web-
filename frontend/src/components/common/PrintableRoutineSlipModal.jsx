import React, { useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useSettings } from '../../context/SettingsContext';
import {
  Printer,
  X,
  Calendar,
  Clock,
  BookOpen,
  User,
  GraduationCap,
  Sparkles,
  Download,
  Building2,
  CheckCircle2,
  Share2
} from 'lucide-react';

export default function PrintableRoutineSlipModal({ routineData, classInfo, batchInfo, isOpen, onClose }) {
  const { lang } = useLanguage();
  const { settings } = useSettings();
  const printRef = useRef();

  if (!isOpen || !routineData) return null;

  const handlePrint = () => {
    window.print();
  };

  const daysOfWeek = [
    { key: 'SATURDAY', bn: 'শনিবার', en: 'Saturday' },
    { key: 'SUNDAY', bn: 'রবিবার', en: 'Sunday' },
    { key: 'MONDAY', bn: 'সোমবার', en: 'Monday' },
    { key: 'TUESDAY', bn: 'মঙ্গলবার', en: 'Tuesday' },
    { key: 'WEDNESDAY', bn: 'বুধবার', en: 'Wednesday' },
    { key: 'THURSDAY', bn: 'বৃহস্পতিবার', en: 'Thursday' }
  ];

  // Build verification QR URL
  const verifyUrl = `https://nextgen.edu.bd/verify/routine?classId=${classInfo?.id || 11}&batch=${encodeURIComponent(batchInfo?.nameBn || 'General')}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(verifyUrl)}&bgcolor=FFFFFF&color=0F172A&margin=2`;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto print:p-0 print:bg-white print:static print:inset-auto">
      {/* Container */}
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden border border-slate-200 flex flex-col my-auto max-h-[92vh] print:max-h-none print:shadow-none print:border-none print:rounded-none print:w-full">
        {/* Modal Top Action Bar (Hidden during print) */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-xl bg-indigo-500/20 text-indigo-400">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base">ক্লাস রুটিন ও সময়সূচি (Class Routine PDF Slip)</h3>
              <p className="text-[11px] text-slate-400">
                {classInfo?.nameBn || 'শ্রেণি'} • {batchInfo?.nameBn || 'সাপ্তাহিক ক্লাস শিডিউল'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center space-x-1.5 transition-all active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>পিডিএফ ডাউনলোড / প্রিন্ট</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Routine Document Body */}
        <div ref={printRef} className="p-6 sm:p-10 overflow-y-auto flex-1 bg-white text-slate-900 space-y-6 print:p-4 print:overflow-visible">
          {/* Header */}
          <div className="border-b-2 border-slate-900 pb-5 text-center relative">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <div className="w-16 h-16 rounded-2xl bg-slate-950 p-1 flex items-center justify-center border border-amber-400/50 shadow-sm flex-shrink-0">
                <img
                  src={settings?.logoUrl || '/logo.png'}
                  alt="NextGen Logo"
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>

              {/* Title Info */}
              <div className="space-y-1 flex-1 px-4">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-950 uppercase">
                  {settings?.academyName || 'NextGen Academy'}
                </h1>
                <p className="text-xs font-semibold text-slate-600">
                  {settings?.academyAddress || 'রোড #৪, ধানমন্ডি, ঢাকা-১২০৯'} • হেল্পলাইন: {settings?.academyPhone || '+880 1792818005'}
                </p>
                <div className="inline-block px-4 py-1 rounded-full bg-slate-900 text-white text-xs font-bold tracking-wider uppercase mt-1">
                  সাপ্তাহিক ব্যাচ ও ক্লাস রুটিন • শিক্ষাবর্ষ ২০২৬
                </div>
              </div>

              {/* Verification QR */}
              <div className="w-16 h-16 p-1 rounded-xl border border-slate-200 shadow-sm flex-shrink-0">
                <img src={qrCodeUrl} alt="Verify QR" className="w-full h-full object-contain" />
              </div>
            </div>
          </div>

          {/* Meta Details Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
            <div>
              <span className="text-slate-500 font-medium block">শ্রেণি (Class):</span>
              <strong className="text-slate-900 text-sm">{classInfo?.nameBn || 'নবম শ্রেণি'}</strong>
            </div>
            <div>
              <span className="text-slate-500 font-medium block">ব্যাচ / শাখা:</span>
              <strong className="text-slate-900 text-sm">{batchInfo?.nameBn || 'বিজ্ঞান (Super Batch)'}</strong>
            </div>
            <div>
              <span className="text-slate-500 font-medium block">কার্যকর সেশন:</span>
              <strong className="text-indigo-700 text-sm font-bold">২০২৬ শিক্ষাবর্ষ</strong>
            </div>
            <div>
              <span className="text-slate-500 font-medium block">সর্বশেষ হালনাগাদ:</span>
              <strong className="text-slate-900">{new Date().toLocaleDateString('bn-BD')}</strong>
            </div>
          </div>

          {/* Day-Wise Routine Schedule Grid */}
          <div className="space-y-4">
            <h3 className="font-black text-sm text-slate-900 flex items-center space-x-2 border-b pb-2">
              <Clock className="w-4 h-4 text-indigo-600" />
              <span>দিনভিত্তিক পিরিয়ড ও বিষয়সমূহের পূর্ণাঙ্গ বিবরণী:</span>
            </h3>

            <div className="border border-slate-300 rounded-2xl overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-900 text-white font-bold">
                    <th className="p-3 border-r border-slate-800 w-28">বার / দিন</th>
                    <th className="p-3 border-r border-slate-800">১ম পিরিয়ড</th>
                    <th className="p-3 border-r border-slate-800">২য় পিরিয়ড</th>
                    <th className="p-3 border-r border-slate-800">৩য় পিরিয়ড</th>
                    <th className="p-3">৪র্থ পিরিয়ড / ল্যাব</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-medium">
                  {daysOfWeek.map((day, dIdx) => {
                    const periodsForDay = Array.isArray(routineData)
                      ? routineData.filter((r) => r.dayOfWeek === day.key)
                      : [];

                    return (
                      <tr key={day.key} className={dIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50/70'}>
                        <td className="p-3 font-black text-slate-900 border-r border-slate-200 bg-slate-100/60">
                          {day.bn}
                          <span className="block text-[10px] text-slate-400 font-normal">{day.en}</span>
                        </td>

                        {[1, 2, 3, 4].map((periodNum) => {
                          const slot = periodsForDay.find((p) => p.periodNumber === periodNum);
                          return (
                            <td key={periodNum} className="p-3 border-r border-slate-200 last:border-none align-top">
                              {slot ? (
                                <div className="space-y-1">
                                  <div className="font-bold text-slate-900 text-xs">
                                    {slot.subject?.nameBn || slot.subjectName || 'পদার্থবিজ্ঞান'}
                                  </div>
                                  <div className="text-[11px] text-indigo-700 font-medium flex items-center gap-1">
                                    <User className="w-3 h-3 text-slate-400" />
                                    <span>{slot.teacher?.user?.name || slot.teacherName || 'বিষয় শিক্ষক'}</span>
                                  </div>
                                  <div className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                                    <Clock className="w-3 h-3 text-slate-400" />
                                    <span>{slot.startTime || '10:00 AM'} - {slot.endTime || '11:00 AM'}</span>
                                    {slot.roomNumber && <span>• রুম #{slot.roomNumber}</span>}
                                  </div>
                                </div>
                              ) : (
                                <div className="text-slate-400 text-[11px] italic py-2">
                                  {periodNum === 4 ? 'স্বাধ্যায় / টিফিন' : 'নির্ধারিত ক্লাস নেই'}
                                </div>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Important Rules / Notes */}
          <div className="p-4 bg-indigo-50/60 rounded-2xl border border-indigo-100 space-y-1.5 text-xs text-indigo-950">
            <h5 className="font-bold text-indigo-900">নির্দেশনাসমূহ:</h5>
            <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-700 leading-relaxed">
              <li>শিক্ষার্থীদের নির্ধারিত ক্লাসের অন্তত ৫ মিনিট পূর্বে শ্রেণিকক্ষে বা অনলাইন লাইভ রুমে উপস্থিত হতে হবে।</li>
              <li>সাপ্তাহিক রুটিনের যেকোনো পরিবর্তন নোটিশ বোর্ডে ও এসএমএসের মাধ্যমে জানিয়ে দেওয়া হবে।</li>
              <li>যেকোনো ক্লাস মিস হলে রেকর্ডেড ক্লাস লাইব্রেরি থেকে দেখে নেওয়া যাবে।</li>
            </ul>
          </div>

          {/* Signatures & Seal */}
          <div className="pt-8 border-t border-slate-300 flex items-end justify-between text-xs">
            <div className="text-center space-y-1">
              <div className="w-32 border-b border-slate-400 pb-1 font-mono text-slate-400">NextGen System</div>
              <span className="font-semibold text-slate-600 block">ইনচার্জ (একাডেমিক শাখা)</span>
            </div>

            <div className="text-center space-y-1">
              <div className="w-36 border-b border-slate-900 pb-1 font-serif text-slate-900 font-black italic">
                A. Mahmud
              </div>
              <span className="font-bold text-slate-900 block">অধ্যক্ষ / পরিচালক</span>
              <span className="text-[10px] text-slate-500">নেক্সটজেন একাডেমি</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
