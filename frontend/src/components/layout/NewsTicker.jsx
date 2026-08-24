import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useSettings } from '../../context/SettingsContext';
import { noticeAPI } from '../../services/api';
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
  Flame
} from 'lucide-react';

export default function NewsTicker() {
  const { lang } = useLanguage();
  const { settings } = useSettings();
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  const defaultItems = [
    {
      id: 'd1',
      titleBn: `২০২৬ শিক্ষাবর্ষে ${settings?.academic?.classes?.[0] || '৬ষ্ঠ'} থেকে ${settings?.academic?.classes?.[settings?.academic?.classes?.length - 1] || '১২শ (HSC)'} শ্রেণির সকল ব্যাচে সরাসরি ও অনলাইন ভর্তি চলছে!`,
      titleEn: 'Admissions open for Academic Year 2026 in Offline & Online Batches!',
      tag: 'ভর্তি বিজ্ঞপ্তি',
      date: '২০২৬',
      urgent: true
    },
    {
      id: 'd2',
      titleBn: 'স্পেশাল পদার্থবিজ্ঞান ও উচ্চতর গণিত মডেল টেস্টের ফলাফল এবং এআই লিডারবোর্ড প্রকাশিত হয়েছে।',
      titleEn: 'Special Physics & Higher Math Model Test Results & AI Leaderboard are now live.',
      tag: 'ফলাফল',
      date: 'আজকের আপডেট',
      urgent: false
    },
    {
      id: 'd3',
      titleBn: `${settings?.academyNameBn || settings?.academyName || 'নেক্সটজেন একাডেমি'}: ${settings?.address || 'পশ্চিম জয়দেবপুর, বাস-স্ট্যান্ড, গাজীপুর'} • হেল্পলাইন: ${settings?.contactNumber || settings?.contactPhone || '০১৭৯২৮১৮০০৫'}`,
      titleEn: `${settings?.academyName || 'NextGen Academy'}: ${settings?.addressEn || 'West Joydebpur, Bus Stand, Gazipur'} • Helpline: ${settings?.contactPhone || '01792818005'}`,
      tag: 'ক্যাম্পাস তথ্য',
      date: 'যোগাযোগ',
      urgent: false
    },
    {
      id: 'd4',
      titleBn: 'লাইভ ক্লাসরুম ও এআই প্রশ্নব্যাংক (MCQ & CQ জেনারেটর) পোর্টাল এখন শিক্ষার্থীদের জন্য সক্রিয়।',
      titleEn: 'Live Classroom & AI Question Bank (MCQ & CQ Generator) are now active for students.',
      tag: 'এআই পোর্টাল',
      date: 'নতুন ফিচার',
      urgent: true
    }
  ];

  const [newsList, setNewsList] = useState(defaultItems);

  useEffect(() => {
    // Fetch live published notices from backend
    noticeAPI.getNotices()
      .then((res) => {
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          const apiItems = res.data.map((n) => ({
            id: n.id,
            titleBn: n.titleBn || n.title,
            titleEn: n.titleEn || n.title,
            descriptionBn: n.descriptionBn || n.content,
            descriptionEn: n.descriptionEn || n.content,
            tag: n.isPinned ? 'জরুরি নোটিশ' : 'নোটিশ',
            date: n.createdAt ? new Date(n.createdAt).toLocaleDateString('bn-BD') : 'আজ',
            urgent: !!n.isPinned
          }));
          // Combine dynamic notices with institutional highlights
          setNewsList([...apiItems, ...defaultItems]);
        } else {
          setNewsList(defaultItems);
        }
      })
      .catch(() => {
        // Fallback to default institutional highlights
        setNewsList(defaultItems);
      });
  }, [settings]);

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
          animation: ticker-scroll 35s linear infinite;
        }
        .animate-marquee:hover, .pause-marquee {
          animation-play-state: paused !important;
        }
      `}</style>

      {/* Global Sticky News Ticker Bar (Flush below Navbar at top-16) */}
      <aside 
        aria-label="Latest News and Notices"
        className="sticky top-16 z-20 w-full bg-slate-950 border-b border-amber-500/20 shadow-md backdrop-blur-md transition-all duration-300 select-none text-white no-print"
      >
        <div className="flex items-center h-10 px-2 sm:px-4 max-w-7xl mx-auto overflow-hidden">
          {/* Breaking News / Live Label Badge */}
          <div className="flex items-center space-x-2 bg-gradient-to-r from-rose-600 via-red-600 to-amber-600 text-white font-black text-[11px] sm:text-xs px-3 py-1 rounded-xl shadow-lg flex-shrink-0 z-10 border border-rose-400/40">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-200 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            <span className="tracking-wide uppercase font-english flex items-center space-x-1">
              <Megaphone className="w-3.5 h-3.5 text-amber-200" />
              <span>{lang === 'bn' ? 'তাজা খবর' : 'LIVE UPDATES'}</span>
            </span>
          </div>

          {/* Marquee Ticker Track */}
          <div 
            className="flex-1 overflow-hidden relative mx-2 sm:mx-4 cursor-pointer"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div className={`animate-marquee flex items-center space-x-8 ${isPaused ? 'pause-marquee' : ''}`}>
              {/* Render items twice to create seamless loop */}
              {[...newsList, ...newsList].map((item, index) => {
                const title = lang === 'bn' ? item.titleBn : item.titleEn;
                return (
                  <button
                    type="button"
                    key={`${item.id}-${index}`}
                    onClick={() => setSelectedNotice(item)}
                    className="inline-flex items-center space-x-2 text-xs text-slate-200 hover:text-amber-300 transition-colors group py-1"
                  >
                    {item.urgent ? (
                      <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px] font-black border border-rose-500/40">
                        ⚡ {item.tag}
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30">
                        📌 {item.tag}
                      </span>
                    )}

                    <span className="font-semibold tracking-normal group-hover:underline underline-offset-4">
                      {title}
                    </span>

                    <span className="text-slate-500 text-[10px]">•</span>
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
              className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-all text-xs"
              title="টিকার বন্ধ করুন"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Notice Detail Modal (When Clicked) */}
      {selectedNotice && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full shadow-2xl p-6 text-white space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  <Megaphone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-amber-400">
                    {selectedNotice.tag || 'নোটিশ ও আপডেট'}
                  </span>
                  <p className="text-xs text-slate-400">নেক্সটজেন একাডেমি বুলেটিন</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedNotice(null)}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <h4 className="text-base sm:text-lg font-black text-slate-100 leading-snug">
                {lang === 'bn' ? selectedNotice.titleBn : selectedNotice.titleEn}
              </h4>

              {(selectedNotice.descriptionBn || selectedNotice.descriptionEn) && (
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                  {lang === 'bn' ? selectedNotice.descriptionBn : selectedNotice.descriptionEn}
                </p>
              )}

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                <span className="flex items-center space-x-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  <span>তারিখ: {selectedNotice.date}</span>
                </span>
                <span className="text-emerald-400 font-bold">✓ অফিশিয়াল আপডেট</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setSelectedNotice(null)}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs shadow-lg transition-all"
              >
                ঠিক আছে (Close)
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
