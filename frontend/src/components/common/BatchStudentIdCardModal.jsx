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
  Filter,
  CheckCircle2,
  Users
} from 'lucide-react';

export default function BatchStudentIdCardModal({
  students = [],
  classes = [],
  batches = [],
  isOpen,
  onClose
}) {
  const { lang } = useLanguage();
  const { settings } = useSettings();
  const [selectedClassId, setSelectedClassId] = useState('ALL');
  const [cardLayout, setCardLayout] = useState('GRID'); // 'GRID' | 'COMPACT'
  const printRef = useRef(null);

  if (!isOpen) return null;

  const academyName = settings?.academyName || 'নেক্সটজেন একাডেমি';
  const academyNameEn = settings?.academyNameEn || 'NEXTGEN ACADEMY';
  const academyLogo = settings?.logoUrl || '/logo.png';
  const hotline = settings?.hotline || '01792818005';
  const campusAddress = settings?.address || 'গাজীপুর ক্যাম্পাস, ঢাকা, বাংলাদেশ';

  // Filter students by class if specified
  const filteredStudents = students.filter((st) => {
    if (selectedClassId === 'ALL') return true;
    return String(st.classId) === String(selectedClassId) || String(st.class?.id) === String(selectedClassId);
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Dedicated Print Stylesheet for Multi-Card A4 Sheets */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-batch-id-cards, #printable-batch-id-cards * {
            visibility: visible;
          }
          #printable-batch-id-cards {
            position: fixed;
            left: 0;
            top: 0;
            width: 100vw;
            height: 100vh;
            margin: 0;
            padding: 12mm;
            background: white !important;
            z-index: 99999;
          }
          .batch-cards-print-grid {
            display: grid !important;
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 8mm !important;
            page-break-inside: avoid !important;
          }
          .id-card-unit {
            page-break-inside: avoid !important;
            box-shadow: none !important;
            border: 1px dashed #94a3b8 !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-6xl w-full shadow-2xl flex flex-col overflow-hidden text-white my-auto max-h-[94vh]">
        {/* Header Bar */}
        <div className="p-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-b border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
          <div className="flex items-center space-x-3.5">
            <div className="p-2.5 rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/30">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base sm:text-lg font-black text-white">
                  🪪 ব্যাচ স্টুডেন্ট আইডি কার্ড প্রিন্টার (Batch Student ID Cards)
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-black uppercase">
                  CR80 Wallet Standard
                </span>
              </div>
              <p className="text-xs text-slate-400">
                এক ক্লিকে সকল শিক্ষার্থীর ডিজিটাল কিউআর কোডসহ ওয়ালেট-সাইজ অফিসিয়াল আইডি কার্ড প্রিন্ট করুন
              </p>
            </div>
          </div>

          {/* Controls & Filter */}
          <div className="flex items-center space-x-2.5">
            {/* Class Filter */}
            <div className="flex items-center space-x-1.5 bg-slate-800 p-1.5 rounded-2xl border border-slate-700 text-xs">
              <Filter className="w-3.5 h-3.5 text-slate-400 ml-1.5" />
              <select
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
                className="bg-transparent text-white font-bold pr-2 focus:outline-none"
              >
                <option value="ALL" className="bg-slate-900 text-white">সকল শ্রেণি ({students.length} জন)</option>
                {classes.map((c) => (
                  <option key={c.id} value={c.id} className="bg-slate-900 text-white">
                    {c.nameBn || c.nameEn}
                  </option>
                ))}
              </select>
            </div>

            {/* Print Trigger */}
            <button
              type="button"
              onClick={handlePrint}
              disabled={filteredStudents.length === 0}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs shadow-lg shadow-emerald-600/30 flex items-center space-x-2 transition-all transform active:scale-95 disabled:opacity-40"
            >
              <Printer className="w-4 h-4" />
              <span>সব আইডি প্রিন্ট ({filteredStudents.length}টি)</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body / Printable Cards Grid */}
        <div className="p-6 overflow-y-auto flex-1 bg-slate-950/50">
          {filteredStudents.length === 0 ? (
            <div className="p-12 text-center text-slate-400 space-y-2">
              <Users className="w-10 h-10 mx-auto text-slate-600" />
              <p className="font-bold">কোনো শিক্ষার্থীর তথ্য পাওয়া যায়নি</p>
            </div>
          ) : (
            <div id="printable-batch-id-cards" className="space-y-6">
              <div className="hidden print:block text-center pb-4 border-b border-slate-300">
                <h2 className="text-base font-black text-slate-900 uppercase tracking-wider">{academyName}</h2>
                <p className="text-[10px] text-slate-600">শিক্ষার্থী অফিসিয়াল ব্যাচ আইডি কার্ড শীট • সেশন ২০২৬ • প্রিন্ট তারিখ: {new Date().toLocaleDateString('bn-BD')}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 batch-cards-print-grid">
                {filteredStudents.map((student, idx) => {
                  const studentIdDisplay = student.studentIdNumber || `NG-2026-${String(student.rollNo || student.id).padStart(4, '0')}`;
                  const classNameDisplay = student.class?.nameBn || student.class?.nameEn || student.className || '৯ম শ্রেণি';
                  const sectionDisplay = student.section?.nameBn || student.section?.nameEn || student.sectionName || 'পদ্মা';
                  const batchDisplay = student.batch?.name || student.batchName || 'মর্নিং স্টার ব্যাচ';
                  const primaryParent = student.guardians?.find((g) => g.isPrimary)?.parent || student.guardians?.[0]?.parent;
                  const guardianPhone = primaryParent?.phone || student.user?.phone || hotline;
                  const qrCodeData = `https://nextgen.edu.bd/verify/student?id=${student.id}&roll=${student.rollNo || ''}&name=${encodeURIComponent(student.nameBn || student.name || '')}&session=2026`;
                  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(qrCodeData)}&margin=1`;

                  return (
                    <div
                      key={student.id || idx}
                      className="id-card-unit bg-white text-slate-900 rounded-2xl border-2 border-slate-200 shadow-md overflow-hidden flex flex-col justify-between relative max-w-[340px] mx-auto w-full"
                      style={{ height: '216px' }}
                    >
                      {/* Top Header Banner */}
                      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white px-3.5 py-2 flex items-center justify-between border-b-2 border-amber-400/80">
                        <div className="flex items-center space-x-2">
                          <img
                            src={academyLogo}
                            alt="Logo"
                            className="w-7 h-7 object-contain rounded-full bg-white/10 p-0.5"
                          />
                          <div>
                            <h4 className="font-black text-[11px] leading-tight tracking-tight uppercase">
                              {academyName}
                            </h4>
                            <p className="text-[8px] text-amber-300 font-mono tracking-wider">
                              STUDENT IDENTITY CARD
                            </p>
                          </div>
                        </div>

                        <span className="px-1.5 py-0.5 rounded bg-amber-400 text-slate-950 font-black text-[8px] uppercase">
                          2026
                        </span>
                      </div>

                      {/* Card Center Content */}
                      <div className="p-3 flex items-center space-x-3 flex-1">
                        {/* Student Photo & Blood Group */}
                        <div className="flex flex-col items-center space-y-1 flex-shrink-0">
                          <div className="w-16 h-18 rounded-xl bg-slate-100 border-2 border-indigo-600/30 overflow-hidden shadow-inner flex items-center justify-center">
                            {student.photo || student.user?.avatar ? (
                              <img
                                src={student.photo || student.user?.avatar}
                                alt={student.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <User className="w-8 h-8 text-slate-400" />
                            )}
                          </div>
                          {student.bloodGroup && (
                            <span className="px-1.5 py-0.2 rounded-full bg-rose-50 border border-rose-200 text-rose-700 font-black text-[8px] flex items-center space-x-0.5">
                              <Droplet className="w-2.5 h-2.5 fill-current text-rose-500" />
                              <span>{student.bloodGroup}</span>
                            </span>
                          )}
                        </div>

                        {/* Student Details Grid */}
                        <div className="flex-1 space-y-0.5 text-[10px] leading-tight overflow-hidden">
                          <h5 className="font-black text-xs text-slate-900 truncate">
                            {student.nameBn || student.name}
                          </h5>
                          <div className="text-[9px] text-slate-500 truncate font-english">
                            {student.user?.name || student.nameEn || ''}
                          </div>

                          <div className="pt-1 space-y-0.5 text-slate-700">
                            <div className="flex items-center justify-between">
                              <span className="text-slate-400">আইডি নং:</span>
                              <strong className="font-mono text-indigo-700 text-[10px]">{studentIdDisplay}</strong>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-slate-400">শ্রেণি ও শাখা:</span>
                              <strong>{classNameDisplay} ({sectionDisplay})</strong>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-slate-400">রোল নম্বর:</span>
                              <strong className="font-mono">{student.rollNo || '০১'}</strong>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-slate-400">অভিভাবক:</span>
                              <strong className="font-mono text-[9px]">{guardianPhone}</strong>
                            </div>
                          </div>
                        </div>

                        {/* Verification QR Code */}
                        <div className="flex-shrink-0 flex flex-col items-center space-y-0.5">
                          <img
                            src={qrCodeUrl}
                            alt="QR Verification"
                            className="w-14 h-14 p-0.5 bg-white border border-slate-300 rounded-lg shadow-sm"
                          />
                          <span className="text-[7px] font-bold text-slate-400 uppercase tracking-tighter">VERIFIED</span>
                        </div>
                      </div>

                      {/* Card Footer */}
                      <div className="bg-slate-50 px-3 py-1 border-t border-slate-200 flex items-center justify-between text-[8px] text-slate-500">
                        <span>{campusAddress}</span>
                        <div className="flex items-center space-x-1 font-bold text-indigo-900">
                          <span>অধ্যক্ষের স্বাক্ষর</span>
                          <span className="text-[9px] text-indigo-600 font-serif italic underline">NextGen</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between no-print">
          <div className="text-xs text-slate-400">
            মোট নির্বাচিত কার্ড: <strong className="text-white">{filteredStudents.length}টি</strong> (A4 শীটে প্রতি পৃষ্ঠায় ৬টি কার্ড ফিট হবে)
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all"
            >
              বন্ধ করুন
            </button>

            <button
              onClick={handlePrint}
              disabled={filteredStudents.length === 0}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs shadow-lg shadow-emerald-600/30 flex items-center space-x-1.5 transition-all active:scale-95 disabled:opacity-40"
            >
              <Printer className="w-4 h-4" />
              <span>প্রিন্ট / PDF ডাউনলোড করুন</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
