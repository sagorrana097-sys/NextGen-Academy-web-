import React, { useState, useEffect } from 'react';
import { studentAPI } from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';
import PrintableStudentIdCardModal from './PrintableStudentIdCardModal';
import {
  User,
  GraduationCap,
  CalendarCheck,
  Award,
  CreditCard,
  ClipboardList,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Sparkles,
  Printer,
  X,
  CheckCircle2,
  AlertCircle,
  Clock,
  Download,
  BookOpen,
  FileText,
  ShieldCheck,
  RefreshCw,
  HelpCircle,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export default function Student360Modal({ studentId, onClose }) {
  const { t, lang } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview'); // overview, attendance, results, fees, homework
  const [showIdCardModal, setShowIdCardModal] = useState(false);

  const loadSummary = async () => {
    if (!studentId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await studentAPI.getFullSummary(studentId);
      if (res.success && res.data) {
        setData(res.data);
      } else {
        setError('শিক্ষার্থীর তথ্য লোড করা সম্ভব হয়নি');
      }
    } catch (err) {
      setError(err.message || 'ডেটা লোড করতে সমস্যা হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSummary();
  }, [studentId]);

  const handlePrint = () => {
    window.print();
  };

  if (!studentId) return null;

  const student = data?.student;
  const metrics = data?.metrics || {};
  const guardian = student?.guardians?.[0]?.parent;
  const admDate = student?.admissionDate || student?.admission_date;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 print:p-0 print:bg-white print:static print:inset-auto">
      <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col my-auto print:max-h-none print:shadow-none print:border-none print:w-full print:rounded-none">
        
        {/* MODAL CONTROLS HEADER (HIDDEN IN PRINT) */}
        <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 sticky top-0 z-20 print:hidden">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <span>শিক্ষার্থীর সম্পূর্ণ প্রোফাইল ও ৩৬০° ডেটা ভিউ</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
                  Student 360°
                </span>
              </h2>
              <p className="text-xs text-slate-400">ব্যক্তিগত, অ্যাকাডেমিক, উপস্থিতি, ফি ও হোমওয়ার্কের সমন্বিত ড্যাশবোর্ড</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setShowIdCardModal(true)}
              className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 flex items-center space-x-1.5 transition-all"
              title="ডিজিটাল স্টুডেন্ট আইডি কার্ড প্রিন্ট করুন"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">আইডি কার্ড প্রিন্ট (ID Card)</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/30 flex items-center space-x-1.5 transition-all"
              title="প্রিন্টযোগ্য রিপোর্ট কার্ড প্রিন্ট বা PDF সেভ করুন"
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">রিপোর্ট কার্ড (Report Card)</span>
            </button>

            <button
              type="button"
              onClick={loadSummary}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="রিফ্রেশ করুন"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-400' : ''}`} />
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white transition-colors"
              title="বন্ধ করুন"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* LOADING & ERROR STATES */}
        {loading && !data ? (
          <div className="p-16 text-center space-y-4">
            <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-sm font-bold text-slate-700">শিক্ষার্থীর পূর্ণাঙ্গ ডেটাবেজ বিশ্লেষণ ও লোড করা হচ্ছে...</p>
          </div>
        ) : error ? (
          <div className="p-12 text-center space-y-3">
            <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
            <p className="text-sm font-bold text-rose-700">{error}</p>
            <button onClick={loadSummary} className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold">
              পুনরায় চেষ্টা করুন
            </button>
          </div>
        ) : data && (
          <div className="p-4 sm:p-6 space-y-6">
            
            {/* OFFICIAL PRINTABLE REPORT CARD HEADER (VISIBLE IN PRINT & SCREEN) */}
            <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-5 sm:p-6 rounded-3xl shadow-lg relative overflow-hidden print:bg-white print:text-slate-900 print:border print:border-slate-300 print:p-4 print:rounded-2xl">
              <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 relative z-10">
                
                {/* Student Photo & Quick Specs */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-3 sm:space-y-0 sm:space-x-4 text-center sm:text-left">
                  {student?.user?.avatar || student?.photo ? (
                    <img
                      src={student.user?.avatar || student.photo}
                      alt={student.user?.name}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-emerald-400 shadow-md print:border-slate-400"
                    />
                  ) : (
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-emerald-600/20 text-emerald-300 border border-emerald-500/40 flex items-center justify-center font-black text-2xl print:bg-slate-100 print:text-slate-800">
                      {student?.user?.name ? student.user.name.charAt(0) : 'S'}
                    </div>
                  )}

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold border border-emerald-500/30 print:border-slate-400 print:text-slate-800">
                        আইডি: {student?.studentIdNumber}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[11px] font-bold border border-indigo-500/30 print:border-slate-400 print:text-slate-800">
                        রোল: {student?.rollNo}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[11px] font-bold border border-rose-500/30 print:border-slate-400 print:text-slate-800">
                        রক্ত: {student?.bloodGroup || 'B+'}
                      </span>
                    </div>

                    <h1 className="text-xl sm:text-2xl font-black tracking-tight">{student?.user?.name}</h1>
                    <p className="text-xs sm:text-sm text-slate-300 font-medium print:text-slate-600">
                      {student?.class?.nameBn} ({student?.class?.nameEn}) • শাখা: {student?.section?.nameBn || 'পদ্মা'}
                    </p>

                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-1 text-[11px] text-slate-300 print:text-slate-600">
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-emerald-400" />
                        <span>অভিভাবক: <strong>{guardian?.name || 'অভিভাবক'}</strong></span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{guardian?.phone || student?.user?.phone || '০১৭০০০০০০০০'}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Academy Official Branding / Print Letterhead Badge */}
                {/* Right Institution Branding */}
                <div className="flex flex-col items-center sm:items-end space-y-1.5 bg-white/5 p-2 rounded-2xl border border-white/10 backdrop-blur-sm print:bg-transparent print:border-none print:p-0">
                  <div className="w-11 h-11 rounded-xl bg-slate-950 border border-amber-500/40 p-0.5 flex items-center justify-center overflow-hidden shadow-sm ring-1 ring-amber-400/40">
                    <img src="/logo.png" alt="NextGen Academy" className="w-full h-full object-cover rounded-lg" />
                  </div>
                  <p className="text-[10px] text-slate-300 print:text-slate-500 font-medium">
                    রিপোর্ট তৈরি: {new Date().toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
              </div>
            </div>

            {/* 4 KEY KPI STAT CARDS */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 print:grid-cols-4">
              {/* GPA & Merit */}
              <div className="p-4 rounded-2xl bg-purple-50/80 border border-purple-200 shadow-sm">
                <div className="flex items-center justify-between text-purple-900">
                  <span className="text-xs font-bold uppercase tracking-wider">জিপিএ ও মেধা স্থান</span>
                  <Award className="w-4 h-4 text-purple-600" />
                </div>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-2xl font-black text-purple-950 font-mono">
                    {metrics.gpa || '5.00'}
                  </span>
                  <span className="px-2 py-0.5 bg-purple-200 text-purple-900 text-xs font-black rounded-md">
                    {metrics.letterGrade || 'A+'}
                  </span>
                </div>
                <p className="text-[11px] text-purple-700 font-semibold mt-1">
                  শ্রেণিতে অবস্থান: <strong>{metrics.meritPosition === 1 ? '১ম স্থান (Top 1)' : `${metrics.meritPosition}তম`}</strong>
                </p>
              </div>

              {/* Attendance % */}
              <div className="p-4 rounded-2xl bg-teal-50/80 border border-teal-200 shadow-sm">
                <div className="flex items-center justify-between text-teal-900">
                  <span className="text-xs font-bold uppercase tracking-wider">উপস্থিতি হিসেব</span>
                  <CalendarCheck className="w-4 h-4 text-teal-600" />
                </div>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-2xl font-black text-teal-950 font-mono">
                    {metrics.attendanceRate || 95}%
                  </span>
                  <span className="text-xs text-teal-800 font-bold">
                    {metrics.presentDays} / {metrics.totalAttDays} দিন
                  </span>
                </div>
                <p className="text-[11px] text-teal-700 font-semibold mt-1">
                  অনুপস্থিত: {metrics.absentDays} দিন | ছুটি: {metrics.leaveDays} দিন
                </p>
              </div>

              {/* Financials Summary */}
              <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 shadow-sm">
                <div className="flex items-center justify-between text-emerald-900">
                  <span className="text-xs font-bold uppercase tracking-wider">ফি ও আর্থিক অবস্থা</span>
                  <CreditCard className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-2xl font-black text-emerald-950 font-mono">
                    ৳ {(metrics.totalPaid || 0).toLocaleString('en-BD')}
                  </span>
                  {metrics.totalDue > 0 ? (
                    <span className="px-2 py-0.5 bg-rose-100 text-rose-800 text-[10px] font-bold rounded-md">
                      বকেয়া ৳ {metrics.totalDue}
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 bg-emerald-200 text-emerald-800 text-[10px] font-bold rounded-md">
                      পরিশোধিত
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-emerald-700 font-semibold mt-1">
                  প্রাপ্ত ছাড়/বৃত্তি: <strong>৳ {(metrics.totalDiscountAmount || 0).toLocaleString('en-BD')}</strong>
                </p>
              </div>

              {/* Homework Status */}
              <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200 shadow-sm">
                <div className="flex items-center justify-between text-blue-900">
                  <span className="text-xs font-bold uppercase tracking-wider">হোমওয়ার্ক প্রোগ্রেস</span>
                  <ClipboardList className="w-4 h-4 text-blue-600" />
                </div>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-2xl font-black text-blue-950 font-mono">
                    {metrics.homeworkCompletionRate || 100}%
                  </span>
                  <span className="text-xs text-blue-800 font-bold">
                    {metrics.completedHomeworks} / {metrics.totalHomeworks} সম্পন্ন
                  </span>
                </div>
                <p className="text-[11px] text-blue-700 font-semibold mt-1">
                  পেন্ডিং কাজ: {metrics.pendingHomeworks}টি
                </p>
              </div>
            </div>

            {/* TAB NAVIGATION BAR (HIDDEN IN PRINT) */}
            <div className="flex items-center space-x-1.5 border-b border-slate-200 overflow-x-auto pb-1 print:hidden">
              <button
                type="button"
                onClick={() => setActiveTab('overview')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 whitespace-nowrap ${
                  activeTab === 'overview'
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>ব্যক্তিগত ও অভিভাবক তথ্য</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('attendance')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 whitespace-nowrap ${
                  activeTab === 'attendance'
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <CalendarCheck className="w-3.5 h-3.5" />
                <span>উপস্থিতি বিবরণী ({data.attendance?.records?.length || 0})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('results')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 whitespace-nowrap ${
                  activeTab === 'results'
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Award className="w-3.5 h-3.5" />
                <span>পরীক্ষার ফলাফল ও ট্রান্সক্রিপ্ট</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('fees')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 whitespace-nowrap ${
                  activeTab === 'fees'
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>ফি, ডিসকাউন্ট ও রসিদ</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('homework')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 whitespace-nowrap ${
                  activeTab === 'homework'
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <ClipboardList className="w-3.5 h-3.5" />
                <span>বাড়ির কাজ ও অ্যাসাইনমেন্ট</span>
              </button>
            </div>

            {/* TAB CONTENTS (FOR SCREEN AND PRINT) */}
            <div className="space-y-6">
              
              {/* TAB 1: PERSONAL & GUARDIAN PROFILE */}
              {(activeTab === 'overview' || window.matchMedia?.('print').matches) && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                    <User className="w-4 h-4 text-emerald-600" />
                    <span>১. ব্যক্তিগত ও পারিবারিক পরিচিতি (Personal & Guardian Profile)</span>
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Student Info Card */}
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5 text-xs">
                      <h4 className="font-bold text-slate-800 border-b border-slate-200 pb-2 flex items-center justify-between">
                        <span>শিক্ষার্থীর প্রাতিষ্ঠানিক তথ্য</span>
                        <span className="text-emerald-700 font-mono font-bold">Active Student</span>
                      </h4>
                      <div className="grid grid-cols-2 gap-2 text-slate-600">
                        <div>
                          <span className="text-slate-400 block text-[10px]">শিক্ষার্থীর নাম</span>
                          <strong className="text-slate-900">{student?.user?.name}</strong>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">স্টুডেন্ট আইডি ও রোল</span>
                          <strong className="text-slate-900">{student?.studentIdNumber} (রোল: {student?.rollNo})</strong>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">শ্রেণি ও শাখা</span>
                          <strong className="text-slate-900">{student?.class?.nameBn} ({student?.section?.nameBn})</strong>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">জন্ম তারিখ ও লিঙ্গ</span>
                          <strong className="text-slate-900">{student?.dob || '2012-05-14'} ({student?.gender === 'MALE' ? 'ছাত্র' : 'ছাত্রী'})</strong>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">রক্তের গ্রুপ</span>
                          <strong className="text-rose-600 font-black">{student?.bloodGroup || 'B+'}</strong>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">ভর্তির তারিখ</span>
                          <strong className="text-slate-900">{admDate || '2024-01-01'}</strong>
                        </div>
                      </div>
                      <div className="pt-2 border-t border-slate-200 text-slate-600">
                        <span className="text-slate-400 block text-[10px]">বর্তমান ঠিকানা</span>
                        <span className="font-medium text-slate-800">{student?.address || 'ধানমন্ডি, ঢাকা-১২০৯'}</span>
                      </div>
                    </div>

                    {/* Guardian Info Card */}
                    <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-200 space-y-2.5 text-xs">
                      <h4 className="font-bold text-indigo-900 border-b border-indigo-200 pb-2 flex items-center justify-between">
                        <span>অভিভাবকের বিবরণ (Guardian Details)</span>
                        <span className="text-indigo-700 text-[10px] font-bold">প্রাথমিক অভিভাবক</span>
                      </h4>
                      <div className="grid grid-cols-2 gap-2 text-slate-700">
                        <div>
                          <span className="text-slate-400 block text-[10px]">অভিভাবকের নাম</span>
                          <strong className="text-slate-900">{guardian?.name || 'মোহাম্মদ রফিকুল ইসলাম'}</strong>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">সম্পর্ক</span>
                          <strong className="text-indigo-800">পিতা (Father)</strong>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">মোবাইল নম্বর</span>
                          <a href={`tel:${guardian?.phone || '01712345678'}`} className="font-bold text-emerald-700 hover:underline flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            <span>{guardian?.phone || '01712345678'}</span>
                          </a>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">ইমেইল ঠিকানা</span>
                          <span className="font-medium text-slate-600 truncate block">{guardian?.email || 'parent@nextgen.edu.bd'}</span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-indigo-200 flex items-center gap-2">
                        <a
                          href={`tel:${guardian?.phone || '01712345678'}`}
                          className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-center flex items-center justify-center space-x-1"
                        >
                          <Phone className="w-3 h-3" />
                          <span>কল করুন</span>
                        </a>
                        <a
                          href={`mailto:${guardian?.email || 'parent@nextgen.edu.bd'}`}
                          className="flex-1 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-center flex items-center justify-center space-x-1"
                        >
                          <Mail className="w-3 h-3" />
                          <span>ইমেইল পাঠান</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: ATTENDANCE SUMMARY & LOG */}
              {(activeTab === 'attendance' || activeTab === 'overview') && (
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                    <CalendarCheck className="w-4 h-4 text-teal-600" />
                    <span>২. উপস্থিতি হিসেব ও লগ (Attendance Records)</span>
                  </h3>

                  <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                        <tr>
                          <th className="p-3">তারিখ (Date)</th>
                          <th className="p-3 text-center">উপস্থিতি স্ট্যাটাস</th>
                          <th className="p-3">হাজিরার বিবরণ / মন্তব্য</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">
                        {data.attendance?.records?.slice(0, 10).map((att) => {
                          const isPresent = att.status === 'PRESENT';
                          const isLate = att.status === 'LATE';
                          const isAbsent = att.status === 'ABSENT';
                          const isLeave = att.status === 'LEAVE';

                          return (
                            <tr key={att.id} className="hover:bg-slate-50/80">
                              <td className="p-3 font-semibold text-slate-900">{att.date}</td>
                              <td className="p-3 text-center">
                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                  isPresent
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : isLate
                                    ? 'bg-amber-100 text-amber-800'
                                    : isLeave
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-rose-100 text-rose-800'
                                }`}>
                                  {isPresent ? 'উপস্থিত' : isLate ? 'দেরিতে' : isLeave ? 'ছুটি' : 'অনুপস্থিত'}
                                </span>
                              </td>
                              <td className="p-3 text-slate-600">
                                {att.remarks || (isPresent ? 'যথাযথ সময়ে উপস্থিত' : isLeave ? 'অনুমোদিত পারিবারিক ছুটি' : 'নিয়মিত')}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 3: ACADEMIC RESULTS & MERIT */}
              {(activeTab === 'results' || activeTab === 'overview') && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                    <Award className="w-4 h-4 text-purple-600" />
                    <span>৩. পরীক্ষার ফলাফল ও প্রোগ্রেস (Academic Results & Marksheet)</span>
                  </h3>

                  {/* Offline Term Exam Marksheet */}
                  <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                        <tr>
                          <th className="p-3">বিষয় (Subject)</th>
                          <th className="p-3 text-center">পূর্ণমান</th>
                          <th className="p-3 text-center">প্রাপ্ত নম্বর</th>
                          <th className="p-3 text-center">গ্রেড পয়েন্ট (GP)</th>
                          <th className="p-3 text-center">লেটার গ্রেড</th>
                          <th className="p-3">শিক্ষকের মূল্যায়ন মন্তব্য</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">
                        {data.academicResults?.termMarks?.map((m) => (
                          <tr key={m.id} className="hover:bg-slate-50/80">
                            <td className="p-3">
                              <span className="font-bold text-slate-900">{m.subject?.nameBn}</span>
                              <span className="text-[10px] text-slate-400 block">{m.subject?.code}</span>
                            </td>
                            <td className="p-3 text-center font-mono">{m.subject?.totalMarks || 100}</td>
                            <td className="p-3 text-center font-bold text-slate-900 font-mono">{m.obtainedMarks}</td>
                            <td className="p-3 text-center font-bold text-purple-700 font-mono">{m.gradePoint}</td>
                            <td className="p-3 text-center">
                              <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 font-bold text-[11px]">
                                {m.letterGrade}
                              </span>
                            </td>
                            <td className="p-3 text-slate-600 italic">{m.teacherRemarks || 'চমৎকার পারফরম্যান্স'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Online Exam Submissions */}
                  {data.academicResults?.onlineSubmissions?.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-slate-800">অনলাইন কুইজ ও অ্যাসাইনমেন্ট পরীক্ষা:</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {data.academicResults.onlineSubmissions.map((sub) => (
                          <div key={sub.id} className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-1.5 text-xs">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-slate-900">{sub.exam?.titleBn}</span>
                              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-md">
                                Passed ({sub.percentage}%)
                              </span>
                            </div>
                            <p className="text-slate-500 text-[11px]">
                              প্রাপ্ত স্কোর: <strong>{sub.obtainedScore} / {sub.totalScore}</strong> • তারিখ: {sub.submittedAt?.split('T')[0]}
                            </p>
                            {sub.teacherFeedback && (
                              <p className="text-slate-600 bg-white p-2 rounded-xl border border-slate-100 text-[11px]">
                                💬 <strong>শিক্ষকের মন্তব্য:</strong> {sub.teacherFeedback}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: FEES & PAYMENT HISTORY */}
              {(activeTab === 'fees' || activeTab === 'overview') && (
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                    <CreditCard className="w-4 h-4 text-emerald-600" />
                    <span>৪. ফি, ডিসকাউন্ট ও পেমেন্ট বিবরণী (Fees & Financial Statement)</span>
                  </h3>

                  <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                        <tr>
                          <th className="p-3">ইনভয়েস নং ও বিবরণ</th>
                          <th className="p-3 text-right">মূল ফি</th>
                          <th className="p-3 text-right">ছাড় / বৃত্তি</th>
                          <th className="p-3 text-right">প্রদেয় অর্থ</th>
                          <th className="p-3">জমার শেষ তারিখ</th>
                          <th className="p-3 text-center">স্ট্যাটাস</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">
                        {data.financials?.invoices?.map((inv) => (
                          <tr key={inv.id} className="hover:bg-slate-50/80">
                            <td className="p-3">
                              <span className="font-bold text-slate-900">{inv.titleBn}</span>
                              <span className="text-[10px] text-slate-400 block font-mono">{inv.invoiceNo}</span>
                            </td>
                            <td className="p-3 text-right font-mono">৳ {(inv.baseAmount || inv.amount).toLocaleString('en-BD')}</td>
                            <td className="p-3 text-right font-mono text-emerald-600 font-bold">
                              {inv.discountAmount > 0 ? `- ৳ ${inv.discountAmount.toLocaleString('en-BD')}` : '৳ ০'}
                            </td>
                            <td className="p-3 text-right font-mono font-black text-slate-900">
                              ৳ {inv.amount.toLocaleString('en-BD')}
                            </td>
                            <td className="p-3 font-semibold text-slate-600">{inv.dueDate}</td>
                            <td className="p-3 text-center">
                              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                inv.status === 'PAID'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-rose-100 text-rose-800'
                              }`}>
                                {inv.status === 'PAID' ? 'পরিশোধিত' : 'বকেয়া'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 5: HOMEWORK & ASSIGNMENTS */}
              {(activeTab === 'homework' || activeTab === 'overview') && (
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                    <ClipboardList className="w-4 h-4 text-blue-600" />
                    <span>৫. বাড়ির কাজ ও অ্যাসাইনমেন্ট ট্র্যাকার (Homework Tracker)</span>
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {data.homework?.list?.map((hw) => (
                      <div key={hw.id} className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="px-2.5 py-0.5 rounded-lg bg-blue-100 text-blue-800 text-[10px] font-bold">
                            {hw.subject?.nameBn || 'বিষয়'}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            hw.status === 'COMPLETED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {hw.status === 'COMPLETED' ? '✓ জমা দেওয়া সম্পন্ন' : '⏳ পেন্ডিং'}
                          </span>
                        </div>

                        <h4 className="font-bold text-slate-900">{hw.topicBn}</h4>
                        <p className="text-slate-600 text-[11px] leading-relaxed line-clamp-2">{hw.descriptionBn}</p>
                        
                        <div className="pt-1.5 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-400">
                          <span>জমার তারিখ: {hw.dueDate}</span>
                          <span>শিক্ষক: {hw.teacher?.user?.name || 'বিষয় শিক্ষক'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* OFFICIAL REPORT CARD FOOTER SIGNATURE BOX (VISIBLE IN PRINT & SCREEN) */}
              <div className="pt-8 mt-6 border-t-2 border-slate-200 grid grid-cols-2 sm:grid-cols-3 gap-6 text-center text-xs">
                <div className="space-y-1">
                  <div className="border-b border-dashed border-slate-400 h-10 w-36 mx-auto"></div>
                  <p className="font-bold text-slate-800">শ্রেণি শিক্ষকের স্বাক্ষর</p>
                  <span className="text-[10px] text-slate-400">Class Teacher</span>
                </div>

                <div className="space-y-1">
                  <div className="border-b border-dashed border-slate-400 h-10 w-36 mx-auto"></div>
                  <p className="font-bold text-slate-800">অভিভাবকের স্বাক্ষর</p>
                  <span className="text-[10px] text-slate-400">Guardian Signature</span>
                </div>

                <div className="space-y-1 col-span-2 sm:col-span-1">
                  <div className="border-b border-dashed border-slate-400 h-10 w-36 mx-auto"></div>
                  <p className="font-bold text-slate-800">অধ্যক্ষ / প্রধান শিক্ষক</p>
                  <span className="text-[10px] text-slate-400">Principal Signature & Seal</span>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>

      {/* Printable Digital ID Card Modal */}
      {showIdCardModal && data?.student && (
        <PrintableStudentIdCardModal
          student={data.student}
          isOpen={showIdCardModal}
          onClose={() => setShowIdCardModal(false)}
        />
      )}
    </div>
  );
}
