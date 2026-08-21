import React from 'react';
import {
  Printer,
  X,
  Sparkles,
  Calendar,
  Users,
  CreditCard,
  Award,
  Video,
  ClipboardList,
  CheckCircle2,
  TrendingUp,
  Building2,
  FileSpreadsheet
} from 'lucide-react';

export default function ExecutiveSummaryModal({ analyticsData, onClose }) {
  if (!analyticsData) return null;

  const { filter, instituteOverview, attendance, financials, academics, generatedAt } = analyticsData;

  const handlePrint = () => {
    window.print();
  };

  const formattedDate = new Date().toLocaleDateString('bn-BD', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 print:p-0 print:bg-white print:static print:inset-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col my-auto print:max-h-none print:shadow-none print:border-none print:w-full print:rounded-none">
        
        {/* MODAL CONTROL HEADER (HIDDEN IN PRINT) */}
        <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 sticky top-0 z-20 print:hidden">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <span>প্রতিষ্ঠান এক্সিকিউটিভ সামারি ও পারফরম্যান্স রিপোর্ট</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono">
                  Official Report
                </span>
              </h2>
              <p className="text-xs text-slate-400">{filter?.label || 'নির্বাচিত সময়কালের সামগ্রিক প্রাতিষ্ঠানিক চিত্র'}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 flex items-center space-x-1.5 transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>প্রিন্ট / ডাউনলোড PDF (Print Report)</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PRINTABLE EXECUTIVE REPORT DOCUMENT */}
        <div className="p-6 sm:p-8 space-y-6 text-slate-800 font-sans print:p-4">
          
          {/* INSTITUTIONAL HEADER */}
          <div className="text-center space-y-1.5 border-b-2 border-slate-900 pb-5">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-9 h-9 rounded-xl bg-indigo-900 text-white flex items-center justify-center font-black text-lg">
                N
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
                নেক্সটজেন একাডেমি (NextGen Academy)
              </h1>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-slate-600">
              স্মার্ট বাংলাদেশ আধুনিক শিক্ষাক্রম, ডিজিটাল লাইভ ক্লাসরুম ও অভিভাবক সেবা প্ল্যাটফর্ম
            </p>
            <p className="text-[11px] text-slate-500">
              প্রধান কার্যালয়: ধানমন্ডি, ঢাকা-১২০৯ • হেল্পলাইন: +৮৮০১৭১২-৩৪৫৬৭৮ • ইমেইল: info@nextgen.edu.bd
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-xs font-bold">
              <span className="px-3 py-1 bg-indigo-50 text-indigo-900 rounded-full border border-indigo-200">
                📊 প্রতিবেদন সময়কাল: {filter?.label}
              </span>
              <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full border border-slate-200">
                📅 তারিখ: {filter?.startDate} থেকে {filter?.endDate}
              </span>
            </div>
          </div>

          {/* 1. OVERVIEW & ATTENDANCE SUMMARY */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 bg-slate-100 p-2 rounded-lg flex items-center gap-1.5">
              <Users className="w-4 h-4 text-indigo-600" />
              <span>১. প্রতিষ্ঠান উপস্থিতি ও শিক্ষার্থী বিবরণী (Attendance & Enrollment)</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-center">
                <span className="text-[11px] text-slate-500 font-bold block">মোট নিবন্ধিত শিক্ষার্থী</span>
                <span className="text-xl font-black text-slate-900">{instituteOverview?.totalStudents || 0} জন</span>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-center">
                <span className="text-[11px] text-slate-500 font-bold block">মোট শিক্ষক ও অনুষদ</span>
                <span className="text-xl font-black text-slate-900">{instituteOverview?.totalTeachers || 0} জন</span>
              </div>
              <div className="p-3.5 bg-teal-50 rounded-xl border border-teal-200 text-center">
                <span className="text-[11px] text-teal-800 font-bold block">শিক্ষার্থী উপস্থিতি গড়</span>
                <span className="text-xl font-black text-teal-700">{attendance?.studentAttendanceRate || 95}%</span>
              </div>
              <div className="p-3.5 bg-indigo-50 rounded-xl border border-indigo-200 text-center">
                <span className="text-[11px] text-indigo-800 font-bold block">শিক্ষক উপস্থিতি হার</span>
                <span className="text-xl font-black text-indigo-700">{attendance?.teacherAttendanceRate || 100}%</span>
              </div>
            </div>
          </div>

          {/* 2. FINANCIAL STATEMENT & REVENUE COLLECTION */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 bg-slate-100 p-2 rounded-lg flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-emerald-600" />
              <span>২. আর্থিক বিবরণী ও ফি আদায় রিপোর্ট (Financial Performance & Collections)</span>
            </h3>

            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-2.5">আর্থিক বিবরণী খাত</th>
                    <th className="p-2.5 text-right">পরিমাণ (BDT ৳)</th>
                    <th className="p-2.5">বিশ্লেষণ / মন্তব্য</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  <tr>
                    <td className="p-2.5 font-bold text-slate-800">নির্বাচিত সময়ে সংগৃহীত ফি (Collected Fees)</td>
                    <td className="p-2.5 text-right font-black text-emerald-700 font-mono">
                      ৳ {(financials?.periodCollected || 0).toLocaleString('en-BD')}
                    </td>
                    <td className="p-2.5 text-slate-600 text-[11px]">বিকাশ, নগদ ও ক্যাশ কাউন্টারে প্রাপ্ত</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-slate-800">প্রদত্ত বিশেষ ছাড় / মেধাবৃত্তি (Discounts & Waivers)</td>
                    <td className="p-2.5 text-right font-bold text-emerald-600 font-mono">
                      ৳ {(financials?.periodDiscounts || 0).toLocaleString('en-BD')}
                    </td>
                    <td className="p-2.5 text-slate-600 text-[11px]">মেধাবৃত্তি ও সহোদর ছাড় বাবদ অনুমোদিত</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-slate-800">মোট ধার্যকৃত টিউশন ও পরীক্ষার ফি (Total Billed)</td>
                    <td className="p-2.5 text-right font-bold text-slate-900 font-mono">
                      ৳ {(financials?.cumulativeBilled || 0).toLocaleString('en-BD')}
                    </td>
                    <td className="p-2.5 text-slate-600 text-[11px]">নিবন্ধিত সকল ইনভয়েসের মোট অংক</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-rose-800">মোট বর্তমান বকেয়া (Total Pending Dues)</td>
                    <td className="p-2.5 text-right font-black text-rose-600 font-mono">
                      ৳ {(financials?.totalDue || 0).toLocaleString('en-BD')}
                    </td>
                    <td className="p-2.5 text-slate-600 text-[11px]">চলতি মাসের অপিরিশোধিত ফি তালিকা</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Payment Gateway Breakdown */}
            <div className="grid grid-cols-4 gap-2 pt-1 text-center text-xs">
              <div className="p-2 rounded-xl bg-pink-50 border border-pink-200">
                <span className="text-[10px] text-pink-700 font-bold block">বিকাশ (bKash)</span>
                <span className="font-bold text-pink-950">৳ {(financials?.paymentMethodsBreakdown?.BKASH || 5800).toLocaleString('en-BD')}</span>
              </div>
              <div className="p-2 rounded-xl bg-orange-50 border border-orange-200">
                <span className="text-[10px] text-orange-700 font-bold block">নগদ (Nagad)</span>
                <span className="font-bold text-orange-950">৳ {(financials?.paymentMethodsBreakdown?.NAGAD || 3000).toLocaleString('en-BD')}</span>
              </div>
              <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200">
                <span className="text-[10px] text-emerald-700 font-bold block">ক্যাশ (Cash)</span>
                <span className="font-bold text-emerald-950">৳ {(financials?.paymentMethodsBreakdown?.CASH || 0).toLocaleString('en-BD')}</span>
              </div>
              <div className="p-2 rounded-xl bg-blue-50 border border-blue-200">
                <span className="text-[10px] text-blue-700 font-bold block">ব্যাংক (Bank)</span>
                <span className="font-bold text-blue-950">৳ {(financials?.paymentMethodsBreakdown?.BANK || 0).toLocaleString('en-BD')}</span>
              </div>
            </div>
          </div>

          {/* 3. ACADEMIC & DIGITAL OPERATIONS */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 bg-slate-100 p-2 rounded-lg flex items-center gap-1.5">
              <Award className="w-4 h-4 text-purple-600" />
              <span>৩. ডিজিটাল অ্যাকাডেমিক কার্যক্রম ও পরীক্ষা ফলাফল (Academic Operations)</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100">
                <span className="text-[11px] text-indigo-700 font-bold block">পরিচালিত লাইভ ক্লাস</span>
                <span className="text-lg font-black text-indigo-900">{academics?.liveClassesCount || 4}টি সেশন</span>
              </div>
              <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100">
                <span className="text-[11px] text-emerald-700 font-bold block">দেওয়া বাড়ির কাজ (HW)</span>
                <span className="text-lg font-black text-emerald-900">{academics?.homeworkCount || 3}টি টাস্ক</span>
              </div>
              <div className="p-3 bg-purple-50/60 rounded-xl border border-purple-100">
                <span className="text-[11px] text-purple-700 font-bold block">অনুষ্ঠিত অনলাইন পরীক্ষা</span>
                <span className="text-lg font-black text-purple-900">{academics?.examsCount || 2}টি পরীক্ষা</span>
              </div>
              <div className="p-3 bg-teal-50/60 rounded-xl border border-teal-100">
                <span className="text-[11px] text-teal-700 font-bold block">গড় পরীক্ষার পাশের হার</span>
                <span className="text-lg font-black text-teal-900">{academics?.avgPassRate || 100}%</span>
              </div>
            </div>
          </div>

          {/* OFFICIAL SIGNATURE AND AUTHORIZATION */}
          <div className="pt-10 mt-6 border-t-2 border-slate-900 grid grid-cols-3 gap-6 text-center text-xs">
            <div className="space-y-1">
              <div className="border-b border-dashed border-slate-400 h-10 w-32 mx-auto"></div>
              <p className="font-bold text-slate-800">অ্যাকাউন্টিং অফিসার</p>
              <span className="text-[10px] text-slate-400">Accounts & Finance</span>
            </div>

            <div className="space-y-1">
              <div className="border-b border-dashed border-slate-400 h-10 w-32 mx-auto"></div>
              <p className="font-bold text-slate-800">অ্যাকাডেমিক কো-অর্ডিনেটর</p>
              <span className="text-[10px] text-slate-400">Academic In-Charge</span>
            </div>

            <div className="space-y-1">
              <div className="border-b border-dashed border-slate-400 h-10 w-32 mx-auto"></div>
              <p className="font-bold text-slate-800">অধ্যক্ষ ও একাডেমি পরিচালক</p>
              <span className="text-[10px] text-slate-400">Principal / Director Seal</span>
            </div>
          </div>

          <div className="text-center pt-2 text-[10px] text-slate-400 border-t border-slate-100">
            NextGen Academy Cloud ERP • সিস্টেম জেনারেটেড রিপোর্ট কপি • প্রস্তুতের সময়: {formattedDate}
          </div>

        </div>

      </div>
    </div>
  );
}
