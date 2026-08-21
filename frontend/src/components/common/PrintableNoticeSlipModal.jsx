import React, { useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useSettings } from '../../context/SettingsContext';
import {
  Printer,
  X,
  BellRing,
  Calendar,
  Sparkles,
  Download,
  Building2,
  CheckCircle2,
  FileText,
  AlertTriangle,
  Share2
} from 'lucide-react';

export default function PrintableNoticeSlipModal({ notice, isOpen, onClose }) {
  const { lang } = useLanguage();
  const { settings } = useSettings();
  const printRef = useRef();

  if (!isOpen || !notice) return null;

  const handlePrint = () => {
    window.print();
  };

  const memoNumber = `NGA/২০২৬/বিজ্ঞপ্তি/${String(notice.id || '101').padStart(3, '0')}`;
  const noticeDate = notice.publishedAt
    ? new Date(notice.publishedAt).toLocaleDateString('bn-BD', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : new Date().toLocaleDateString('bn-BD');

  // Dynamic verification QR
  const verifyUrl = `https://nextgen.edu.bd/verify/notice?id=${notice.id || 1}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(verifyUrl)}&bgcolor=FFFFFF&color=0F172A&margin=2`;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto print:p-0 print:bg-white print:static print:inset-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden border border-slate-200 flex flex-col my-auto max-h-[92vh] print:max-h-none print:shadow-none print:border-none print:rounded-none print:w-full">
        {/* Top Control Bar (Hidden on print) */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-xl bg-emerald-500/20 text-emerald-400">
              <BellRing className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base">অফিসিয়াল নোটিশ স্লিপ (Official Notice PDF)</h3>
              <p className="text-[11px] text-slate-400">{memoNumber}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center space-x-1.5 transition-all active:scale-95"
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

        {/* Printable Notice Sheet */}
        <div ref={printRef} className="p-6 sm:p-12 overflow-y-auto flex-1 bg-white text-slate-900 space-y-6 print:p-6 print:overflow-visible">
          {/* Official Letterhead Header */}
          <div className="border-b-2 border-slate-900 pb-5 text-center relative">
            <div className="flex items-center justify-between">
              <div className="w-16 h-16 rounded-2xl bg-slate-950 p-1 flex items-center justify-center border border-amber-400/50 shadow-sm flex-shrink-0">
                <img
                  src={settings?.logoUrl || '/logo.png'}
                  alt="NextGen Logo"
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>

              <div className="space-y-1 flex-1 px-4 text-center">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-950 uppercase">
                  {settings?.academyName || 'NextGen Academy'}
                </h1>
                <p className="text-xs font-semibold text-slate-600">
                  {settings?.academyAddress || 'রোড #৪, ধানমন্ডি, ঢাকা-১২০৯'} • ফোন: {settings?.academyPhone || '+880 1792818005'}
                </p>
                <p className="text-[11px] text-slate-500 font-mono">
                  ইমেইল: info@nextgen.edu.bd • ওয়েব: www.nextgen.edu.bd
                </p>
              </div>

              <div className="w-16 h-16 p-1 rounded-xl border border-slate-200 shadow-sm flex-shrink-0">
                <img src={qrCodeUrl} alt="Verify QR" className="w-full h-full object-contain" />
              </div>
            </div>
          </div>

          {/* Memo & Date Meta */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs border-b border-slate-200 pb-3">
            <div>
              <span className="text-slate-500 font-medium">স্মারক নং: </span>
              <strong className="text-slate-900 font-mono">{memoNumber}</strong>
            </div>
            <div>
              <span className="text-slate-500 font-medium">তারিখ: </span>
              <strong className="text-slate-900">{noticeDate}</strong>
            </div>
          </div>

          {/* Notice Priority & Recipients */}
          <div className="flex items-center justify-between">
            <span
              className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                notice.priority === 'URGENT'
                  ? 'bg-rose-100 text-rose-800 border border-rose-300'
                  : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
              }`}
            >
              {notice.priority === 'URGENT' ? '🚨 জরুরি বিজ্ঞপ্তি' : '📌 সাধারণ বিজ্ঞপ্তি'}
            </span>

            <span className="text-xs font-bold text-slate-600">
              প্রাপক: <strong>{notice.targetRole === 'ALL' ? 'সকল অভিভাবক, শিক্ষক ও শিক্ষার্থীবৃন্দ' : notice.targetRole === 'STUDENT' ? 'সকল শিক্ষার্থীবৃন্দ' : 'সকল অভিভাবকবৃন্দ'}</strong>
            </span>
          </div>

          {/* Notice Title Banner */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-1">
            <h2 className="text-lg sm:text-xl font-black text-slate-950 leading-tight">
              {notice.titleBn}
            </h2>
            {notice.titleEn && (
              <h3 className="text-xs font-semibold text-slate-500">{notice.titleEn}</h3>
            )}
          </div>

          {/* Notice Content Body */}
          <div className="prose max-w-none text-slate-800 text-xs sm:text-sm leading-relaxed space-y-4 whitespace-pre-line p-2">
            <p>{notice.contentBn || notice.content}</p>
          </div>

          {/* Attachment Link if any */}
          {notice.attachmentUrl && (
            <div className="p-3 bg-indigo-50/60 rounded-2xl border border-indigo-100 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-indigo-600" />
                <span className="font-bold text-indigo-900">সংযুক্ত ফাইল / নির্দেশনাবলী:</span>
              </div>
              <a
                href={notice.attachmentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:text-indigo-800 font-bold underline"
              >
                অনলাইনে দেখুন
              </a>
            </div>
          )}

          {/* Authorized Signature & Seal */}
          <div className="pt-12 border-t border-slate-300 flex items-end justify-between text-xs">
            <div className="text-left space-y-1">
              <span className="text-[10px] text-slate-400 block font-mono">সিস্টেম জেনারেটেড ডিজিটাল কপি</span>
              <span className="text-slate-500 font-medium block">অনুলিপি: প্রশাসনিক আর্কাইভ</span>
            </div>

            <div className="text-center space-y-1">
              <div className="w-40 border-b border-slate-900 pb-1 font-serif text-slate-900 font-black italic text-sm">
                A. Mahmud
              </div>
              <span className="font-bold text-slate-900 block">অধ্যক্ষ / দায়িত্বপ্রাপ্ত কর্মকর্তা</span>
              <span className="text-[10px] text-slate-600">নেক্সটজেন একাডেমি, ঢাকা</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
