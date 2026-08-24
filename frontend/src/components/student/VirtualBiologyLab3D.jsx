import React, { useState, useRef } from 'react';
import {
  Heart,
  Activity,
  Layers,
  Download,
  Info,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Sparkles,
  Award,
  CheckCircle2,
  BookOpen,
  Eye,
  Loader2
} from 'lucide-react';
import { exportBrandedGraphic } from '../../utils/exportBrandedGraphic';

const BIOLOGY_MODELS = [
  {
    id: 'HEART',
    nameBn: 'মানব হৃদপিণ্ড (Human Heart)',
    icon: '❤️',
    category: 'মানব শারীরস্থান',
    tagline: 'রক্ত সংবহনতন্ত্রের প্রধান পাম্পিং অঙ্গ',
    hotspots: [
      { id: 'h1', title: 'ডান অলিন্দ (Right Atrium)', role: 'সারা শরীর থেকে কার্বন ডাই-অক্সাইডযুক্ত রক্ত গ্রহণ করে।', examTip: 'বোর্ড প্রশ্ন: উচ্চ ও নিম্ন মহাশিরা দিয়ে রক্ত প্রথম এই প্রকোষ্ঠে আসে।' },
      { id: 'h2', title: 'বাম অলিন্দ (Left Atrium)', role: 'ফুসফুস থেকে অক্সিজেনসমৃদ্ধ বিশুদ্ধ রক্ত গ্রহণ করে।', examTip: 'ফুসফুসীয় শিরার মাধ্যমে ৪টি শাখা দিয়ে রক্ত প্রবেশ করে।' },
      { id: 'h3', title: 'বাম নিলয় (Left Ventricle)', role: 'সবচেয়ে পুরু পেশিযুক্ত প্রকোষ্ঠ, যা মহাধমনী দিয়ে সারা দেহে অক্সিজেনযুক্ত রক্ত পাম্প করে।', examTip: 'এর প্রাচীর ডান নিলয়ের চেয়ে প্রায় ৩ গুণ বেশি পুরু।' },
      { id: 'h4', title: 'ডান নিলয় (Right Ventricle)', role: 'কার্বন ডাই-অক্সাইডযুক্ত রক্ত ফুসফুসীয় ধমনী দিয়ে ফুসফুসে পাঠায়।', examTip: 'এখানে ট্রাইকাসপিড কপাটিকা রক্ত একমুখী রাখতে সাহায্য করে।' },
      { id: 'h5', title: 'মহাধমনী (Aorta)', role: 'হৃৎপিণ্ডের মূল ধমনী যা সারা শরীরে বিশুদ্ধ রক্ত সরবরাহ করে।', examTip: 'মানবদেহের বৃহত্তম ধমনী।' }
    ]
  },
  {
    id: 'DIGESTIVE',
    nameBn: 'মানব পরিপাকতন্ত্র (Digestive System)',
    icon: '🫁',
    category: 'পরিপাক ও শোষণ',
    tagline: 'খাদ্য পরিপাক ও পুষ্টি শোষণের সম্পূর্ণ নালি',
    hotspots: [
      { id: 'd1', title: 'পাকস্থলী (Stomach)', role: 'হাইড্রোক্লোরিক এসিড (HCl) ও পেপসিন দিয়ে আমিষ জাতীয় খাদ্য পরিপাক শুরু করে।', examTip: 'গ্যাস্ট্রিক গ্রন্থি থেকে পাচক রস নিঃসৃত হয়।' },
      { id: 'd2', title: 'যকৃত (Liver)', role: 'দেহের সর্ববৃহৎ গ্রন্থি। পিত্তরস তৈরি করে যা স্নেহ পদার্থ পরিপাকে সাহায্য করে।', examTip: 'একে দেহের জৈব রসায়নাগার বলা হয়।' },
      { id: 'd3', title: 'অগ্ন্যাশয় (Pancreas)', role: 'মিশ্র গ্রন্থি। ইনসুলিন, গ্লুকাগন এবং ট্রিপসিন এনজাইম ক্ষরণ করে।', examTip: 'রক্তে গ্লুকোজের মাত্রা নিয়ন্ত্রণে প্রধান ভূমিকা পালন করে।' },
      { id: 'd4', title: 'ক্ষুদ্রান্ত্র (Small Intestine)', role: 'খাদ্যের সম্পূর্ণ পরিপাক ও ভিলাই (Villi) এর মাধ্যমে পুষ্টি উপাদান রক্তে শোষিত হয়।', examTip: 'ডিউডেনাম, জেজুনাম ও ইলিয়াম নিয়ে গঠিত।' }
    ]
  },
  {
    id: 'PLANT_CELL',
    nameBn: 'উদ্ভিদ কোষ (Plant Cell)',
    icon: '🌿',
    category: 'কোষ ও কলা',
    tagline: 'সেলুলোজ প্রাচীর ও ক্লোরোপ্লাস্টযুক্ত আদর্শ কোষ',
    hotspots: [
      { id: 'p1', title: 'কোষপ্রাচীর (Cell Wall)', role: 'সেলুলোজ নির্মিত জড় প্রাচীর যা কোষকে নির্দিষ্ট আকৃতি ও দৃঢ়তা দেয়।', examTip: 'প্রাণী কোষে কোষপ্রাচীর থাকে না।' },
      { id: 'p2', title: 'ক্লোরোপ্লাস্ট (Chloroplast)', role: 'সালোকসংশ্লেষণ প্রক্রিয়ায় ক্লোরোফিলের সাহায্যে সৌরশক্তিকে রাসায়নিক শক্তিতে রূপান্তর করে।', examTip: 'একে উদ্ভিদের রান্নাঘর বলা হয়।' },
      { id: 'p3', title: 'কেন্দ্রীয় কোষগহ্বর (Central Vacuole)', role: 'কোষের রসস্ফীতি চাপ নিয়ন্ত্রণ ও বর্জ্য পদার্থ ধারণ করে।', examTip: 'উদ্ভিদ কোষে কোষগহ্বরটি কেন্দ্রে বড় আকারে অবস্থান করে।' },
      { id: 'p4', title: 'নিউক্লিয়াস (Nucleus)', role: 'কোষের সকল জৈবিক কার্যাবলি নিয়ন্ত্রণ করে।', examTip: 'নিউক্লিওলাস, ক্রোমাটিন তন্তু ও নিউক্লিয়ার ঝিল্লি নিয়ে গঠিত।' }
    ]
  },
  {
    id: 'ANIMAL_CELL',
    nameBn: 'প্রাণী কোষ (Animal Cell)',
    icon: '🧬',
    category: 'কোষ ও জিনতত্ত্ব',
    tagline: 'কোষঝিল্লি ও সেন্ট্রিওলসমৃদ্ধ ইউক্যারিওটিক কোষ',
    hotspots: [
      { id: 'a1', title: 'মাইটোকন্ড্রিয়া (Mitochondria)', role: 'ক্রেবস চক্র ও শ্বসনের মাধ্যমে ATP (শক্তি) উৎপাদন করে।', examTip: 'একে কোষের পাওয়ার হাউস (Power House) বলা হয়।' },
      { id: 'a2', title: 'সেন্ট্রিওল (Centriole)', role: 'কোষ বিভাজনের সময় অ্যাস্টার রে ও স্পিন্ডল যন্ত্র তৈরি করে।', examTip: 'উদ্ভিদ কোষে সাধারণত সেন্ট্রিওল অনুপস্থিত।' },
      { id: 'a3', title: 'গলজি বস্তু (Golgi Body)', role: 'হরমোন ও এনজাইম ক্ষরণ এবং প্রোটিন প্যাকেজিং করে।', examTip: 'কোষের ট্রাফিক পুলিশ হিসেবে পরিচিত।' },
      { id: 'a4', title: 'লাইসোজোম (Lysosome)', role: 'ফ্যাগোসাইটোসিস পদ্ধতিতে জীবাণু ধ্বংস করে এবং এনজাইম ক্ষরণ করে।', examTip: 'একে কোষের আত্মঘাতী থলিকা (Suicide Bag) বলা হয়।' }
    ]
  }
];

export default function VirtualBiologyLab3D() {
  const [selectedModel, setSelectedModel] = useState(BIOLOGY_MODELS[0]);
  const [activeHotspot, setActiveHotspot] = useState(BIOLOGY_MODELS[0].hotspots[0]);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isExporting, setIsExporting] = useState(false);
  const diagramRef = useRef(null);

  const handleSelectModel = (model) => {
    setSelectedModel(model);
    setActiveHotspot(model.hotspots[0]);
    setRotationAngle(0);
  };

  const handleExportDiagram = async () => {
    if (!diagramRef.current) return;
    setIsExporting(true);
    try {
      await exportBrandedGraphic(diagramRef.current, {
        fileName: `NextGen_Biology_${selectedModel.id}`,
        cardTitle: `বায়োলজি ৩ডি অ্যানাটমি নোট: ${selectedModel.nameBn}`,
        scale: 2
      });
    } catch (err) {
      console.error('Failed to export biology diagram:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 border border-slate-800 rounded-3xl shadow-xl text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="p-3.5 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <Heart className="w-8 h-8 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black text-white">৩ডি ইন্টারঅ্যাকটিভ বায়োলজি ল্যাব ও অ্যানাটমি</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold font-mono">
                Biology 3D
              </span>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              হৃৎপিণ্ড, পরিপাকতন্ত্র, উদ্ভিদ ও প্রাণী কোষের লাইভ ৩ডি মডেল এবং স্পট-অন হটস্পট বিশ্লেষণ
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleExportDiagram}
          disabled={isExporting}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 self-start md:self-auto"
        >
          {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          <span>লেবেলযুক্ত ডায়াগ্রাম ডাউনলোড</span>
        </button>
      </div>

      {/* Model Category Selector Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {BIOLOGY_MODELS.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => handleSelectModel(m)}
            className={`p-4 rounded-2xl border text-left transition-all flex items-center gap-3 ${
              selectedModel.id === m.id
                ? 'bg-emerald-500/20 border-emerald-500 text-white shadow-lg shadow-emerald-500/10 scale-102 ring-1 ring-emerald-500'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
            }`}
          >
            <span className="text-3xl p-2 rounded-xl bg-slate-950 border border-slate-800">{m.icon}</span>
            <div className="min-w-0">
              <h4 className="font-bold text-xs text-white truncate">{m.nameBn}</h4>
              <span className="text-[10px] text-slate-400 block truncate">{m.category}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Main 3D Model Viewer & Hotspot Inspector Grid */}
      <div
        ref={diagramRef}
        className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: 3D Interactive Anatomical Stage */}
          <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-3xl p-6 relative overflow-hidden flex flex-col items-center justify-between min-h-[460px]">
            {/* Model Title & Controls Bar */}
            <div className="w-full flex items-center justify-between z-10">
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                  ৩ডি মডেল ভিউয়ার
                </span>
                <h3 className="font-black text-lg text-white">{selectedModel.nameBn}</h3>
              </div>

              {/* Rotation & Zoom Controls */}
              <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setRotationAngle((p) => (p + 45) % 360)}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                  title="ঘোরান (+45° Rotate)"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setZoomLevel((p) => Math.min(1.4, p + 0.1))}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                  title="জুম ইন"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setZoomLevel((p) => Math.max(0.8, p - 0.1))}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                  title="জুম আউট"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* 3D Anatomical Render Canvas Simulation with Clickable Hotspots */}
            <div
              className="relative my-auto flex items-center justify-center transition-all duration-300"
              style={{
                transform: `rotate(${rotationAngle}deg) scale(${zoomLevel})`
              }}
            >
              {/* Graphic Central Representation */}
              <div className="relative w-64 h-64 rounded-full bg-gradient-to-br from-emerald-950/60 via-slate-900 to-indigo-950/60 border-2 border-emerald-500/40 flex items-center justify-center shadow-2xl">
                <span className="text-8xl select-none filter drop-shadow-2xl animate-bounce-slow">
                  {selectedModel.icon}
                </span>

                {/* Hotspot Floating Badges */}
                {selectedModel.hotspots.map((hs, hIdx) => {
                  const angle = (hIdx / selectedModel.hotspots.length) * 2 * Math.PI;
                  const radius = 100;
                  const x = Math.cos(angle) * radius;
                  const y = Math.sin(angle) * radius;
                  const isSelected = activeHotspot?.id === hs.id;

                  return (
                    <button
                      key={hs.id}
                      type="button"
                      onClick={() => setActiveHotspot(hs)}
                      style={{
                        transform: `translate(${x}px, ${y}px)`
                      }}
                      className={`absolute w-8 h-8 rounded-full border-2 flex items-center justify-center font-mono text-xs font-black shadow-xl transition-transform hover:scale-125 active:scale-95 ${
                        isSelected
                          ? 'bg-amber-400 text-slate-950 border-white ring-4 ring-amber-400/40 z-30 scale-125'
                          : 'bg-emerald-600 text-white border-emerald-300 hover:bg-emerald-500 z-20'
                      }`}
                    >
                      {hIdx + 1}
                    </button>
                  );
                })}
              </div>
            </div>

            <p className="text-[11px] text-slate-500 font-mono z-10">
              💡 কোনো অংশে ক্লিক করে বিস্তারিত বিবরণ দেখুন (হটস্পট ১-{selectedModel.hotspots.length})
            </p>
          </div>

          {/* Right Column: Interactive Hotspot Inspector & Board Exam Notes */}
          <div className="lg:col-span-5 space-y-4">
            {/* Active Hotspot Detail Card */}
            {activeHotspot ? (
              <div className="p-5 rounded-3xl bg-slate-950 border border-emerald-500/40 space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold">
                    হটস্পট বিশ্লেষণ
                  </span>
                  <span className="text-xs text-slate-400 font-mono">NextGen Biology</span>
                </div>

                <div>
                  <h4 className="font-black text-lg text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                    <span>{activeHotspot.title}</span>
                  </h4>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800">
                    {activeHotspot.role}
                  </p>
                </div>

                {/* Exam Key Tip */}
                <div className="p-3.5 rounded-2xl bg-amber-950/30 border border-amber-500/30 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-amber-400 text-xs">
                    <Award className="w-4 h-4" />
                    <span>বোর্ড পরীক্ষার জন্য গুরুত্বপূর্ণ নোট:</span>
                  </div>
                  <p className="text-[11px] text-amber-200/90 pl-5">
                    {activeHotspot.examTip}
                  </p>
                </div>
              </div>
            ) : null}

            {/* List of All Hotspots for Quick Selection */}
            <div className="bg-slate-950 border border-slate-800 rounded-3xl p-4 space-y-2">
              <h5 className="font-bold text-xs text-slate-400 uppercase tracking-wider mb-2">
                সকল অঙ্গাণু ও অংশসমূহ:
              </h5>
              <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
                {selectedModel.hotspots.map((hs, idx) => (
                  <button
                    key={hs.id}
                    type="button"
                    onClick={() => setActiveHotspot(hs)}
                    className={`w-full text-left p-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                      activeHotspot?.id === hs.id
                        ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-transparent'
                    }`}
                  >
                    <span>{idx + 1}. {hs.title}</span>
                    <Eye className="w-3.5 h-3.5 opacity-60" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
