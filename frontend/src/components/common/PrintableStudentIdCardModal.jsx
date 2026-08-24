import React, { useState, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useSettings } from '../../context/SettingsContext';
import {
  Printer,
  X,
  Sparkles,
  QrCode,
  Droplet,
  Phone,
  MapPin,
  Calendar,
  User,
  ShieldCheck,
  Award,
  Layers,
  GraduationCap,
  Download,
  RotateCw,
  CheckCircle2
} from 'lucide-react';

export default function PrintableStudentIdCardModal({ student, isOpen, onClose }) {
  const { lang } = useLanguage();
  const { settings } = useSettings();
  const [activeSide, setActiveSide] = useState('both'); // 'front' | 'back' | 'both'
  const printRef = useRef(null);

  if (!isOpen || !student) return null;

  const studentIdDisplay = student.studentIdNumber || `NG-2026-${String(student.rollNo || student.id).padStart(4, '0')}`;
  const classNameDisplay = student.class?.nameBn || student.class?.nameEn || student.className || '৯ম শ্রেণি';
  const sectionDisplay = student.section?.nameBn || student.section?.nameEn || student.sectionName || 'শাখা ক';
  const batchDisplay = student.batch?.name || student.batchName || 'মর্নিং স্টার ব্যাচ';
  const academyName = 'NextGen Academy';
  const academyNameEn = 'NextGen Academy';
  const directorName = 'মো: আলমগীর হোসেন (সাগর)';
  const officialPhone = '০১৭৯২৮১৮০০৫';
  const officialAddress = 'পশ্চিম জয়দেবপুর, বাস-স্ট্যান্ড, গাজীপুর';
  const tagline = 'LEARN · GROW · SUCCEED';
  const academyLogo = settings?.logoUrl || '/logo.png';
  const qrCodeData = `https://nextgen.edu.bd/verify/student?id=${student.id}&roll=${student.rollNo || ''}&name=${encodeURIComponent(student.nameBn || student.name || '')}&session=2026`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(qrCodeData)}&margin=1`;


  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Print-Specific Stylesheet */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-id-card-area, #printable-id-card-area * {
            visibility: visible;
          }
          #printable-id-card-area {
            position: fixed;
            left: 0;
            top: 0;
            width: 100vw;
            height: 100vh;
            margin: 0;
            padding: 20px;
            background: white !important;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 99999;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-4xl w-full shadow-2xl flex flex-col overflow-hidden text-white my-auto max-h-[92vh]">
        {/* Header Bar */}
        <div className="p-4 sm:p-5 bg-slate-800/90 border-b border-slate-700 flex items-center justify-between no-print">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">
                ডিজিটাল স্টুডেন্ট আইডি কার্ড (Printable Student ID Card)
              </h3>
              <p className="text-xs text-slate-400">
                {student.nameBn || student.name} • আইডি: <span className="font-mono text-amber-400">{studentIdDisplay}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Side Switcher */}
            <div className="hidden sm:flex p-1 bg-slate-950 rounded-xl border border-slate-700 text-xs font-bold">
              <button
                type="button"
                onClick={() => setActiveSide('both')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeSide === 'both' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                সামনে ও পেছনে (Both)
              </button>
              <button
                type="button"
                onClick={() => setActiveSide('front')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeSide === 'front' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                সম্মুখ ভাগ (Front)
              </button>
              <button
                type="button"
                onClick={() => setActiveSide('back')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeSide === 'back' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                বিপরীত ভাগ (Back)
              </button>
            </div>

            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/30 flex items-center space-x-1.5 transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>প্রিন্ট করুন</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Card Preview Container */}
        <div className="p-6 sm:p-10 overflow-y-auto flex-1 flex flex-col items-center justify-center bg-slate-950/60">
          <div
            id="printable-id-card-area"
            ref={printRef}
            className="flex flex-wrap items-center justify-center gap-8 py-4"
          >
            {/* ========================================================================= */}
            {/* FRONT SIDE ID CARD (CR80 Standard Dimension Ratio) */}
            {/* ========================================================================= */}
            {(activeSide === 'front' || activeSide === 'both') && (
              <div className="w-[320px] h-[500px] bg-gradient-to-b from-slate-900 via-slate-800 to-slate-950 text-slate-800 rounded-3xl overflow-hidden shadow-2xl border-2 border-amber-400/40 relative flex flex-col justify-between select-none">
                {/* Top Decorative Gradient Arc */}
                <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-700 text-white p-4 pt-5 text-center relative overflow-hidden">
                  <div className="absolute -right-6 -bottom-6 w-20 h-20 bg-white/10 rounded-full blur-xl pointer-events-none" />
                  <div className="flex items-center justify-center space-x-2.5 mb-1">
                    <div className="w-9 h-9 rounded-xl bg-white p-1 shadow-md ring-2 ring-amber-300">
                      <img src={academyLogo} alt="Logo" className="w-full h-full object-contain rounded" />
                    </div>
                    <div className="text-left">
                      <h4 className="font-black text-xs leading-tight text-white tracking-wide">{academyName}</h4>
                      <p className="text-[8px] font-bold text-amber-200 uppercase tracking-widest">{academyNameEn}</p>
                    </div>
                  </div>
                  <div className="mt-1">
                    <span className="inline-block px-3 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[9px] uppercase tracking-wider shadow-sm">
                      STUDENT ID CARD • ২০২৬
                    </span>
                  </div>
                </div>

                {/* Photo & Identity Center */}
                <div className="px-5 text-center -mt-2 space-y-2.5">
                  {/* Photo Frame */}
                  <div className="relative inline-block">
                    <div className="w-24 h-28 rounded-2xl bg-slate-800 border-2 border-amber-400 shadow-xl overflow-hidden mx-auto">
                      {student.photo || student.user?.photo ? (
                        <img
                          src={student.photo || student.user?.photo}
                          alt="Student Avatar"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-800 text-slate-500">
                          <User className="w-10 h-10 text-slate-400 mb-1" />
                          <span className="text-[9px] font-bold">ছবি নেই</span>
                        </div>
                      )}
                    </div>
                    {student.bloodGroup && (
                      <span className="absolute -bottom-2 -right-1 px-2 py-0.5 rounded-full bg-rose-600 text-white font-black text-[9px] shadow border border-white flex items-center gap-0.5">
                        <Droplet className="w-2.5 h-2.5" />
                        <span>{student.bloodGroup}</span>
                      </span>
                    )}
                  </div>

                  {/* Student Names */}
                  <div>
                    <h3 className="font-black text-sm text-white leading-tight">
                      {student.nameBn || student.name}
                    </h3>
                    <p className="text-[11px] font-semibold text-slate-300 font-sans tracking-wide">
                      {student.nameEn || student.name}
                    </p>
                  </div>

                  {/* Identification Pill */}
                  <div className="inline-block px-3 py-1 bg-slate-800/90 rounded-xl border border-amber-400/30 text-amber-300 font-mono font-bold text-xs shadow-inner">
                    ID: {studentIdDisplay}
                  </div>

                  {/* Academic Info Grid */}
                  <div className="grid grid-cols-2 gap-1.5 p-2.5 bg-slate-800/80 rounded-2xl border border-slate-700/80 text-[11px] text-left">
                    <div>
                      <span className="text-[9px] text-slate-400 block font-semibold">শ্রেণি (Class):</span>
                      <span className="font-bold text-white truncate block">{classNameDisplay}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 block font-semibold">রোল নং (Roll):</span>
                      <span className="font-black text-amber-300 font-mono block">
                        {String(student.rollNo || 1).padStart(2, '0')}
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 block font-semibold">শাখা (Section):</span>
                      <span className="font-bold text-slate-200 truncate block">{sectionDisplay}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 block font-semibold">ব্যাচ (Batch):</span>
                      <span className="font-bold text-emerald-400 truncate block text-[10px]">{batchDisplay}</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Card Footer */}
                <div className="p-3 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-t border-slate-800 text-center flex items-center justify-between px-4">
                  <div className="text-left">
                    <span className="text-[8px] text-slate-500 uppercase font-bold block">মেয়াদ উত্তীর্ণ:</span>
                    <span className="text-[9px] text-slate-300 font-semibold">৩১ ডিসে, ২০২৬</span>
                  </div>
                  <div className="text-right">
                    <div className="h-6 flex items-end justify-end">
                      <span className="font-serif text-[10.5px] text-amber-300 font-bold border-b border-slate-600 px-1 tracking-tight">
                        {directorName}
                      </span>
                    </div>
                    <span className="text-[8px] text-slate-400 font-bold block mt-0.5">পরিচালক ও প্রতিষ্ঠাতা</span>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* BACK SIDE ID CARD */}
            {/* ========================================================================= */}
            {(activeSide === 'back' || activeSide === 'both') && (
              <div className="w-[320px] h-[500px] bg-gradient-to-b from-slate-900 via-slate-800 to-slate-950 text-slate-200 rounded-3xl overflow-hidden shadow-2xl border-2 border-amber-400/40 relative flex flex-col justify-between select-none">
                {/* Header Strip */}
                <div className="bg-slate-950 p-3 text-center border-b border-slate-800">
                  <h4 className="text-[11px] font-black text-amber-400 uppercase tracking-wider">
                    জরুরি ও অভিভাবক তথ্য
                  </h4>
                </div>

                {/* QR Code & Verification Center */}
                <div className="px-5 py-2 text-center space-y-3">
                  <div className="inline-block p-2 bg-white rounded-2xl shadow-xl border border-slate-300">
                    <img
                      src={qrCodeUrl}
                      alt="Student Verification QR Code"
                      className="w-24 h-24 object-contain"
                    />
                  </div>
                  <p className="text-[9px] text-slate-400 font-medium">
                    স্ক্যান করে অনলাইন ডাটাবেজ ভেরিফিকেশন সম্পন্ন করুন
                  </p>

                  {/* Guardian & Contact Info */}
                  <div className="p-3 bg-slate-800/90 rounded-2xl border border-slate-700/80 text-left space-y-1.5 text-[11px]">
                    <div>
                      <span className="text-[9px] text-slate-400 block font-semibold">পিতার নাম (Father):</span>
                      <span className="font-bold text-white block truncate">{student.fatherName || 'মো: রফিকুল ইসলাম'}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 block font-semibold">মাতার নাম (Mother):</span>
                      <span className="font-bold text-white block truncate">{student.motherName || 'মোসা: নাজমুন নাহার'}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 block font-semibold">জরুরি যোগাযোগ (Guardian Phone):</span>
                      <span className="font-mono font-bold text-amber-400 block">
                        {student.guardianPhone || student.fatherPhone || '01712-345678'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 block font-semibold">ঠিকানা (Address):</span>
                      <span className="text-slate-300 text-[10px] block line-clamp-2">
                        {student.presentAddress || student.address || 'ঢাকা, বাংলাদেশ'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Terms and Academy Return Note with Institutional Branding */}
                <div className="p-3 bg-slate-950 border-t border-slate-800 text-[9px] text-slate-300 text-center space-y-1.5">
                  <p className="leading-relaxed text-[8.5px] text-slate-400">
                    💡 <strong>নির্দেশনা:</strong> এই কার্ডটি {academyName}-এর সম্পত্তি। কার্ডটি কোথাও পাওয়া গেলে অনুগ্রহ করে নিচের ঠিকানায় ফেরত দিন।
                  </p>
                  <div className="pt-1 border-t border-slate-800/80 space-y-0.5">
                    <p className="text-[9px] font-bold text-amber-400">
                      📍 {officialAddress}
                    </p>
                    <p className="text-[8.5px] text-emerald-400 font-mono font-bold">
                      পরিচালক: {directorName} • হেল্পলাইন: {officialPhone}
                    </p>
                    <p className="text-[7.5px] text-slate-500 font-mono">
                      {tagline} • www.nextgen.edu.bd
                    </p>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 bg-slate-800/90 border-t border-slate-700 flex items-center justify-between no-print">
          <span className="text-xs text-slate-400">
            * কার্ডটি PVC কার্ড প্রিন্টারে বা A4 ফটো পেপারে প্রিন্ট করার উপযোগী।
          </span>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs rounded-xl"
            >
              বন্ধ করুন
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/30 flex items-center space-x-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>আইডি কার্ড প্রিন্ট (Print)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
