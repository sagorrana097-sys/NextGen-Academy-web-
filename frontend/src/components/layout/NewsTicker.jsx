import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useSettings } from '../../context/SettingsContext';
import { noticeAPI } from '../../services/api';
import PrintableNoticeSlipModal from '../common/PrintableNoticeSlipModal';
import {
  BellRing,
  Sparkles,
  Volume2,
  ChevronRight,
  X,
  Megaphone,
  Calendar,
  Eye,
  ExternalLink,
  Flame,
  Radio,
  Download,
  Printer,
  FileText,
  Clock,
  CheckCircle2
} from 'lucide-react';

export default function NewsTicker() {
  const { lang } = useLanguage();
  const { settings } = useSettings();
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [printableNotice, setPrintableNotice] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  const defaultItems = [
    {
      id: 'd1',
      titleBn: `২০২৬ শিক্ষাবর্ষে ${settings?.academic?.classes?.[0] || '৬ষ্ঠ'} থেকে ${settings?.academic?.classes?.[settings?.academic?.classes?.length - 1] || '১২শ (HSC)'} শ্রেণির সকল ব্যাচে সরাসরি ও অনলাইন ভর্তি চলছে!`,
      titleEn: 'Admissions open for Academic Year 2026 in Offline & Online Batches!',
      tag: 'ভর্তি বিজ্ঞপ্তি',
      date: '২০২৬',
      urgent: true,
      category: 'ADMISSION'
    },
    {
      id: 'd2',
      titleBn: 'এসএসসি ও এইচএসসি স্পেশাল মডেল টেস্ট রুটিন ও সিলেবাস প্রকাশিত হয়েছে (PDF ডাউনলোড করুন)।',
      titleEn: 'SSC & HSC Special Model Test Routine & Syllabus published (Download PDF).',
      tag: 'পরীক্ষার রুটিন',
      date: 'আজকের রুটিন',
      urgent: true,
      category: 'EXAM',
      attachmentName: 'SSC_HSC_Model_Test_Routine_2026.pdf',
      pdfUrl: '#'
    },
    {
      id: 'd3',
      titleBn: `${settings?.academyNameBn || settings?.academyName || 'নেক্সটজেন একাডেমি'}: ${settings?.address || 'পশ্চিম জয়দেবপুর, বাস-স্ট্যান্ড, গাজীপুর'} • হেল্পলাইন: ${settings?.contactNumber || settings?.contactPhone || '০১৭৯২৮১৮০০৫'}`,
      titleEn: `${settings?.academyName || 'NextGen Academy'}: ${settings?.addressEn || 'West Joydebpur, Bus Stand, Gazipur'} • Helpline: ${settings?.contactPhone || '01792818005'}`,
      tag: 'ক্যাম্পাস তথ্য',
      date: 'যোগাযোগ',
      urgent: false,
      category: 'GENERAL'
    },
    {
      id: 'd4',
      titleBn: 'লাইভ ক্লাসরুম ও এআই প্রশ্নব্যাংক (MCQ & CQ জেনারেটর) পোর্টাল এখন শিক্ষার্থীদের জন্য সক্রিয়।',
      titleEn: 'Live Classroom & AI Question Bank (MCQ & CQ Generator) are now active for students.',
      tag: 'এআই পোর্টাল',
      date: 'নতুন ফিচার',
      urgent: false,
      category: 'ACADEMIC'
    }
  ];

  const [newsList, setNewsList] = useState(defaultItems);

  useEffect(() => {
    noticeAPI.getNotices()
      .then((res) => {
        if (res?.success && Array.isArray(res.data) && res.data.length > 0) {
          const apiItems = res.data.map((n) => {
            let tag = 'নোটিশ';
            if (n.category === 'EXAM' || n.category === 'ROUTINE' || n.isExamRoutine) {
              tag = 'পরীক্ষার রুটিন';
            } else if (n.category === 'ADMISSION') {
              tag = 'ভর্তি বিজ্ঞপ্তি';
            } else if (n.isPinned) {
              tag = 'জরুরি নোটিশ';
            }

            return {
              id: n.id,
              titleBn: n.titleBn || n.title,
              titleEn: n.titleEn || n.title,
              descriptionBn: n.contentBn || n.descriptionBn || n.content,
              descriptionEn: n.contentEn || n.descriptionEn || n.content,
              contentBn: n.contentBn || n.descriptionBn || n.content,
              contentEn: n.contentEn || n.descriptionEn || n.content,
              tag,
              date: n.createdAt || n.publishedAt ? new Date(n.createdAt || n.publishedAt).toLocaleDateString('bn-BD') : 'আজ',
              urgent: !!n.isPinned || n.priority === 'URGENT',
              priority: n.priority || 'NORMAL',
              category: n.category || 'ACADEMIC',
              attachmentUrl: n.attachmentUrl || n.pdfUrl || n.routineUrl || '',
              attachmentName: n.attachmentName || (n.attachmentUrl ? 'Exam_Routine.pdf' : ''),
              attachmentSize: n.attachmentSize || '',
              author: n.author
            };
          });
          setNewsList([...apiItems, ...defaultItems]);
        } else {
          setNewsList(defaultItems);
        }
      })
      .catch(() => {
        setNewsList(defaultItems);
      });
  }, [settings]);

  const handleDownloadRoutine = (item) => {
    if (item.attachmentUrl && item.attachmentUrl !== '#') {
      window.open(item.attachmentUrl, '_blank');
    } else {
      // Open printable branded notice slip modal
      setPrintableNotice(item);
    }
  };

  if (isDismissed) return null;

  return (
    <>
      <style>{`
        @keyframes ticker-scroll {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }
        .animate-marquee {
          display: inline-flex;
          white-space: nowrap;
          animation: ticker-scroll 32s linear infinite;
        }
        .animate-marquee:hover, .pause-marquee {
          animation-play-state: paused !important;
        }
        .marquee-fade-mask {
          mask-image: linear-gradient(to right, transparent, black 4%, black 96%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, black 4%, black 96%, transparent);
        }
      `}</style>

      {/* Global Sticky News & Exam Routine Ticker Ribbon */}
      <aside 
        aria-label="Latest Exam Notices and Routines"
        className="sticky top-16 md:top-18 z-20 w-full bg-slate-950/90 backdrop-blur-xl border-b border-amber-500/25 shadow-md shadow-slate-950/50 transition-all duration-300 select-none text-white no-print"
      >
        <div className="flex items-center h-10 px-2.5 sm:px-4 max-w-7xl mx-auto overflow-hidden">
          
          {/* Breaking News / Live Label Badge with Glowing Pulse */}
          <div className="flex items-center space-x-2 bg-gradient-to-r from-rose-600 via-red-600 to-amber-600 text-white font-black text-[11px] sm:text-xs px-3 py-1 rounded-xl shadow-[0_0_15px_rgba(225,29,72,0.35)] flex-shrink-0 z-10 border border-rose-400/40 ring-1 ring-amber-400/30">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-300 opacity-80" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
            </span>
            <span className="tracking-wider uppercase font-english flex items-center space-x-1.5 font-black drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
              <Radio className="w-3.5 h-3.5 text-amber-200 animate-pulse" />
              <span>{lang === 'bn' ? 'পরীক্ষার নোটিশ ও রুটিন' : 'LIVE EXAM NOTICES'}</span>
            </span>
          </div>

          {/* Marquee Ticker Track with Gradient Edge Masks */}
          <div 
            className="flex-1 overflow-hidden relative mx-2 sm:mx-4 cursor-pointer marquee-fade-mask"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div className={`animate-marquee flex items-center space-x-8 ${isPaused ? 'pause-marquee' : ''}`}>
              {/* Duplicate array for seamless continuous loop */}
              {[...newsList, ...newsList].map((item, index) => {
                const title = lang === 'bn' ? item.titleBn : item.titleEn;
                const isExam = item.category === 'EXAM' || item.category === 'ROUTINE' || item.tag.includes('রুটিন');

                return (
                  <button
                    type="button"
                    key={`${item.id}-${index}`}
                    onClick={() => setSelectedNotice(item)}
                    className="inline-flex items-center space-x-2 text-xs sm:text-[13px] text-slate-200 hover:text-amber-300 transition-all group py-1"
                  >
                    {isExam ? (
                      <span className="px-2 py-0.5 rounded-lg bg-gradient-to-r from-amber-500/30 to-orange-500/30 text-amber-300 text-[10px] font-black border border-amber-500/40 shadow-[0_0_8px_rgba(245,158,11,0.2)] flex items-center gap-1">
                        📋 {item.tag}
                        <Download className="w-3 h-3 text-amber-300 inline" />
                      </span>
                    ) : item.urgent ? (
                      <span className="px-2 py-0.5 rounded-lg bg-rose-500/20 text-rose-300 text-[10px] font-black border border-rose-500/40 shadow-[0_0_8px_rgba(244,63,94,0.2)]">
                        ⚡ {item.tag}
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-lg bg-indigo-500/20 text-indigo-300 text-[10px] font-bold border border-indigo-500/30">
                        📌 {item.tag}
                      </span>
                    )}

                    <span className="font-medium tracking-wide text-slate-100 group-hover:text-amber-200 group-hover:underline underline-offset-4">
                      {title}
                    </span>

                    <span className="text-slate-600 text-[10px]">•</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dismiss / Close Button */}
          <div className="flex items-center space-x-1 pl-1 z-10 flex-shrink-0">
            <button
              type="button"
              onClick={() => setIsDismissed(true)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-all text-xs"
              title="টিকার বন্ধ করুন"
              aria-label="Dismiss Ticker"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

        </div>
      </aside>

      {/* Notice & Exam Routine Detail Modal */}
      {selectedNotice && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-lg w-full shadow-2xl p-6 text-white space-y-4 animate-in fade-in zoom-in-95 duration-150">
            
            {/* Modal Top Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-[0_0_12px_rgba(245,158,11,0.2)]">
                  <Megaphone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-black tracking-wider text-amber-400">
                    {selectedNotice.tag || 'অফিসিয়াল নোটিশ ও রুটিন'}
                  </span>
                  <p className="text-xs text-slate-400">নেক্সটজেন একাডেমি বুলেটিন</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedNotice(null)}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="space-y-3">
              <h4 className="text-base sm:text-lg font-black text-slate-100 leading-snug">
                {lang === 'bn' ? selectedNotice.titleBn : selectedNotice.titleEn}
              </h4>

              {(selectedNotice.descriptionBn || selectedNotice.contentBn || selectedNotice.descriptionEn || selectedNotice.contentEn) && (
                <div className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-950/80 p-4 rounded-2xl border border-slate-800/80 whitespace-pre-wrap max-h-48 overflow-y-auto">
                  {lang === 'bn'
                    ? (selectedNotice.descriptionBn || selectedNotice.contentBn)
                    : (selectedNotice.descriptionEn || selectedNotice.contentEn)}
                </div>
              )}

              {/* Action Buttons: PDF Routine Download & Printable Slip */}
              <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-indigo-500/10 border border-amber-500/20 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-amber-300 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-amber-400" />
                    <span>সংযুক্ত রুটিন ও অফিসিয়াল স্লিপ</span>
                  </span>
                  <span className="text-[10px] text-slate-400">NextGen Academy Branded</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {/* Download PDF Routine Button */}
                  <button
                    type="button"
                    onClick={() => handleDownloadRoutine(selectedNotice)}
                    className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs shadow-md shadow-amber-500/20 flex items-center justify-center gap-1.5 transition-all active:scale-95"
                  >
                    <Download className="w-4 h-4" />
                    <span>রুটিন PDF ডাউনলোড</span>
                  </button>

                  {/* Print / View Slip Button */}
                  <button
                    type="button"
                    onClick={() => {
                      setPrintableNotice(selectedNotice);
                      setSelectedNotice(null);
                    }}
                    className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Printer className="w-4 h-4 text-indigo-400" />
                    <span>নোটিশ স্লিপ প্রিন্ট</span>
                  </button>
                </div>
              </div>

              {/* Notice Metadata */}
              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                <span className="flex items-center space-x-1.5 font-mono">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  <span>তারিখ: {selectedNotice.date}</span>
                </span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> অফিশিয়াল নোটিশ
                </span>
              </div>
            </div>

            <div className="pt-1">
              <button
                type="button"
                onClick={() => setSelectedNotice(null)}
                className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 font-bold text-xs transition-all"
              >
                বন্ধ করুন (Close)
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Printable Notice Slip Modal */}
      {printableNotice && (
        <PrintableNoticeSlipModal
          isOpen={!!printableNotice}
          onClose={() => setPrintableNotice(null)}
          notice={printableNotice}
        />
      )}
    </>
  );
}
