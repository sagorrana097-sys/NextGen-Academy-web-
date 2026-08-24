import React, { useState, useRef } from 'react';
import {
  FileText,
  Download,
  Eye,
  Sparkles,
  BookOpen,
  Layers,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  Share2,
  Calendar,
  CheckCircle2,
  PenTool
} from 'lucide-react';
import confetti from 'canvas-confetti';

const BRAND = {
  name: 'NextGen Academy',
  instructor: 'মো: আলমগীর হোসেন (সাগর)',
  contact: '০১৭৯২৮১৮০০৫',
  address: 'পশ্চিম জয়দেবপুর, বাস-স্ট্যান্ড, গাজীপুর'
};

const SMART_BOARD_LECTURES = [
  {
    id: 'sb-physics-ch4',
    subject: 'পদার্থবিজ্ঞান',
    subjectCode: 'PHY-136',
    chapter: 'অধ্যায় ৪: কাজ, ক্ষমতা ও শক্তি',
    date: '২০ আগস্ট ২০২৬',
    slidesCount: 8,
    accentColor: '#38bdf8',
    summary: 'গাণিতিক সমস্যার সমাধান, বল ও সরণের গ্রাফিক্যাল বিশ্লেষণ এবং যান্ত্রিক শক্তির নিত্যতা সূত্রের প্রমাণসহ পূর্ণাঙ্গ স্মার্টবোর্ড ক্লাস নোট।',
    slides: [
      {
        slideNum: 1,
        title: 'কাজের সমীকরণ ও বিশেষ ক্ষেত্রসমূহ',
        chalkText: 'W = F s cos θ \n• θ = 0° হলে ধনাত্মক কাজ (W = Fs)\n• θ = 90° হলে কাজ শূন্য (W = 0)\n• θ = 180° হলে ঋণাত্মক কাজ (W = -Fs)',
        teacherNote: '👉 বোর্ডের পরীক্ষায় কাজের শূন্য হওয়ার শর্ত প্রায়ই নৈর্ব্যক্তিক প্রশ্নে আসে!'
      },
      {
        slideNum: 2,
        title: 'গতিশক্তি ও বিভব শক্তির নিত্যতা',
        chalkText: 'E = E_k + E_p = ধ্রুবক\nE_k = 1/2 m v^2\nE_p = m g h',
        teacherNote: '👉 মুক্তভাবে পড়ন্ত বস্তুর যেকোনো বিন্দুতে মোট যান্ত্রিক শক্তি সংরক্ষিত থাকে।'
      },
      {
        slideNum: 3,
        title: 'কর্মদক্ষতা (Efficiency, η)',
        chalkText: 'η = (লভ্য কার্যকর শক্তি / মোট প্রদত্ত শক্তি) × ১০০%\nη = (P_out / P_in) × 100%',
        teacherNote: '👉 ইঞ্জিনের ক্ষমতা ও শক্তি অপচয়ের অঙ্কে এই সূত্র ব্যবহার করতে হবে।'
      }
    ]
  },
  {
    id: 'sb-math-trig',
    subject: 'উচ্চতর গণিত',
    subjectCode: 'HM-126',
    chapter: 'অধ্যায় ৮: ত্রিকোণমিতি ও অভেদাবলি',
    date: '১৮ আগস্ট ২০২৬',
    slidesCount: 10,
    accentColor: '#f43f5e',
    summary: 'চতুর্ভাগভিত্তিক চিহ্ন নির্ধারণ, কোণের রেডিয়ান ও ডিগ্রির রূপান্তর এবং জটিল অভেদাবলির শর্টকাট সমাধান।',
    slides: [
      {
        slideNum: 1,
        title: 'চতুর্ভাগে ত্রিকোণমিতিক চিহ্নের নিয়ম (All Sin Tan Cos)',
        chalkText: '১ম চতুর্ভাগ: সকল অনুপাত (+)\n২য় চতুর্ভাগ: sin ও cosec (+)\n৩য় চতুর্ভাগ: tan ও cot (+)\n৪র্থ চতুর্ভাগ: cos ও sec (+)',
        teacherNote: '👉 মনে রাখার সহজ টেকনিক: "All Students Take Coffee"'
      },
      {
        slideNum: 2,
        title: 'সংযুক্ত কোণের ত্রিকোণমিতিক অনুপাত',
        chalkText: 'sin(n × 90° ± θ)\n• n জোড় হলে অনুপাত অপরিবর্তিত থাকে\n• n বিজোড় হলে sin ↔ cos, tan ↔ cot, sec ↔ cosec পরিবর্তিত হয়',
        teacherNote: '👉 চিহ্নের জন্য মূল কোণটি কোন চতুর্ভাগে পড়ে তা খেয়াল করতে হবে।'
      }
    ]
  },
  {
    id: 'sb-chem-periodic',
    subject: 'রসায়ন',
    subjectCode: 'CHEM-176',
    chapter: 'অধ্যায় ৪: পর্যায় সারণি ও মৌলের পর্যায়বৃত্ত ধর্ম',
    date: '১৫ আগস্ট ২০২৬',
    slidesCount: 6,
    accentColor: '#34d399',
    summary: 'পারমাণবিক আকার, আয়নীকরণ শক্তি ও তড়িৎ ঋণাত্মকতার পর্যায়ভিত্তিক পরিবর্তনের স্মার্টবোর্ড ডায়াগ্রাম।',
    slides: [
      {
        slideNum: 1,
        title: 'আয়নীকরণ শক্তি ও তড়িৎ ঋণাত্মকতার প্রবণতা',
        chalkText: '• পর্যায় বরাবর বাম থেকে ডানে গেলে: আয়নীকরণ শক্তি বৃদ্ধি পায়\n• গ্রুপ বরাবর উপর থেকে নিচে গেলে: পারমাণবিক ব্যাসার্ধ বৃদ্ধি পায় ও আয়নীকরণ শক্তি হ্রাস পায়',
        teacherNote: '👉 ব্যতিক্রম: বেরিলিয়াম (Be) ও নাইট্রোজেনের (N) সুস্থিত ইলেকট্রন বিন্যাস।'
      }
    ]
  }
];

export default function AnimatedSmartBoardNotes() {
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [downloading, setDownloading] = useState(false);

  const previewBoardRef = useRef();

  const handleOpenLecture = (lecture) => {
    setSelectedLecture(lecture);
    setCurrentSlideIndex(0);
  };

  const handleDownloadSmartNote = async () => {
    if (!previewBoardRef.current || !selectedLecture) return;
    setDownloading(true);
    try {
      const html2canvasModule = await import('html2canvas');
      const html2canvas = html2canvasModule.default || html2canvasModule;

      const canvas = await html2canvas(previewBoardRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#090d16',
        logging: false
      });

      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `SmartBoard_${selectedLecture.id}_Slide_${currentSlideIndex + 1}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      confetti({ particleCount: 50, spread: 60 });
    } catch (e) {
      console.error('Download error:', e);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-6 text-slate-100">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950/40 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-black uppercase tracking-wider mb-1">
            <PenTool className="w-4 h-4" />
            NextGen Smart Classroom Tech
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight">
            স্মার্ট বোর্ড লেকচার নোটস হাব
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            ক্লাসরুমের ডিজিটাল স্মার্টবোর্ডে শিক্ষক মো: আলমগীর হোসেন (সাগর) স্যারের লাইভ লেকচারের হুবহু বোর্ড নোট ও অ্যানোটেশন।
          </p>
        </div>

        <div className="px-5 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-center">
          <span className="text-xs text-slate-400 font-semibold">মোট লেকচার ফাইল</span>
          <p className="text-2xl font-black text-emerald-400">{SMART_BOARD_LECTURES.length}টি আর্কাইভ</p>
        </div>
      </div>

      {/* Lecture Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SMART_BOARD_LECTURES.map((item) => (
          <div
            key={item.id}
            className="group relative bg-slate-900/90 rounded-3xl border border-slate-800 hover:border-emerald-500/40 overflow-hidden shadow-xl transition-all duration-300 flex flex-col justify-between"
          >
            {/* Smart Board Graphic Cover Preview */}
            <div
              onClick={() => handleOpenLecture(item)}
              className="relative aspect-video w-full bg-slate-950 p-4 border-b border-slate-800 cursor-pointer overflow-hidden flex flex-col justify-between"
              style={{
                backgroundImage: 'radial-gradient(#1e293b 1px, transparent 1px)',
                backgroundSize: '16px 16px'
              }}
            >
              {/* Grid Glow Overlay */}
              <div className="flex items-center justify-between z-10">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {item.subject}
                </span>
                <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> {item.date}
                </span>
              </div>

              {/* Centered Chalk Simulation */}
              <div className="my-auto text-center z-10 px-2">
                <h4 className="text-white font-extrabold text-sm line-clamp-2 drop-shadow-md">
                  {item.chapter}
                </h4>
                <p className="text-[11px] text-amber-300 font-semibold mt-1">
                  {item.slidesCount}টি স্লাইড পৃষ্ঠা
                </p>
              </div>

              {/* Mandatory Watermark on Cover */}
              <div className="z-10 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[9px] text-slate-400">
                <span className="text-amber-400 font-bold">🎓 {BRAND.name}</span>
                <span>{BRAND.contact}</span>
              </div>
            </div>

            {/* Content & Action Bar */}
            <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
              <div>
                <h3
                  onClick={() => handleOpenLecture(item)}
                  className="text-base font-black text-white group-hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  {item.chapter}
                </h3>
                <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                  {item.summary}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-semibold">
                  👨‍🏫 {BRAND.instructor}
                </span>

                <button
                  onClick={() => handleOpenLecture(item)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all"
                >
                  <Eye className="w-3.5 h-3.5" />
                  বোর্ড স্লাইড দেখুন
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Smart Board Interactive Lecture Viewer Modal */}
      {selectedLecture && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 max-w-4xl w-full space-y-4 shadow-2xl my-auto">
            {/* Modal Top Bar */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center font-bold">
                  <PenTool className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white">
                    {selectedLecture.chapter}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {selectedLecture.subject} • স্লাইড {currentSlideIndex + 1} / {selectedLecture.slides.length}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownloadSmartNote}
                  disabled={downloading}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  {downloading ? 'ডাউনলোড হচ্ছে...' : 'বোর্ড স্লাইড ডাউনলোড'}
                </button>
                <button
                  onClick={() => setSelectedLecture(null)}
                  className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Smart Board Canvas Component */}
            <div
              ref={previewBoardRef}
              className="relative aspect-video w-full rounded-2xl bg-slate-950 border-4 border-slate-800 shadow-2xl p-6 flex flex-col justify-between overflow-hidden"
              style={{
                backgroundImage: 'radial-gradient(#1e293b 1.5px, transparent 1.5px)',
                backgroundSize: '20px 20px'
              }}
            >
              {/* Smart Board Header Bar */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="w-3 h-3 rounded-full bg-yellow-500" />
                  <span className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-xs font-mono font-bold text-emerald-400 ml-2">
                    SMARTBOARD LIVE CANVAS #0{currentSlideIndex + 1}
                  </span>
                </div>
                <span className="text-xs font-bold text-slate-400">
                  {selectedLecture.subject}
                </span>
              </div>

              {/* Simulated Neon Chalk Lecture Text */}
              <div className="my-auto space-y-4 py-4 px-2">
                <h4 className="text-lg sm:text-xl font-black text-amber-300 drop-shadow">
                  {selectedLecture.slides[currentSlideIndex]?.title}
                </h4>

                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 font-mono text-sm sm:text-base text-slate-100 whitespace-pre-line leading-relaxed shadow-inner">
                  {selectedLecture.slides[currentSlideIndex]?.chalkText}
                </div>

                {selectedLecture.slides[currentSlideIndex]?.teacherNote && (
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs font-semibold text-amber-200">
                    {selectedLecture.slides[currentSlideIndex]?.teacherNote}
                  </div>
                )}
              </div>

              {/* STRICT MANDATORY WATERMARK FOOTER OVERLAY */}
              <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-300">
                <div className="flex items-center gap-3 font-bold">
                  <span className="text-amber-400 font-black">🎓 {BRAND.name}</span>
                  <span>•</span>
                  <span className="text-emerald-400">শিক্ষক: {BRAND.instructor}</span>
                </div>
                <div className="text-[10px] text-slate-400">
                  📞 {BRAND.contact} | 📍 {BRAND.address}
                </div>
              </div>
            </div>

            {/* Slide Navigation Buttons */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setCurrentSlideIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentSlideIndex === 0}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 font-bold text-xs"
              >
                <ChevronLeft className="w-4 h-4" /> পূর্ববর্তী স্লাইড
              </button>

              <span className="text-xs font-bold text-slate-400">
                {currentSlideIndex + 1} / {selectedLecture.slides.length}
              </span>

              <button
                onClick={() => setCurrentSlideIndex((prev) => Math.min(selectedLecture.slides.length - 1, prev + 1))}
                disabled={currentSlideIndex === selectedLecture.slides.length - 1}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 font-bold text-xs"
              >
                পরবর্তী স্লাইড <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
