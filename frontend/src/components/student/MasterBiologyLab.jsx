import React, { useState, useRef, useEffect } from 'react';
import { 
  Heart, Activity, Dna, Sparkles, Download, Loader2, ChevronDown, 
  ChevronUp, Brain, Leaf, Sun, Droplets, Microscope, Eye, ShieldCheck 
} from 'lucide-react';
import { exportBrandedGraphic } from '../../utils/exportBrandedGraphic';

function AICard({ text }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-2xl overflow-hidden mt-4">
      <button 
        type="button" 
        onClick={() => setOpen(o => !o)} 
        className="w-full flex items-center justify-between p-3.5 text-xs font-black text-emerald-300 bg-emerald-950/60"
      >
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4 text-emerald-400" />
          <span>AI বায়োলজিক্যাল বিশ্লেষণ ও পরীক্ষার নোট (Smart Summary)</span>
        </div>
        {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>
      {open && (
        <div className="p-4 text-xs text-emerald-100/90 leading-relaxed space-y-2 border-t border-emerald-500/20 bg-slate-950/40">
          {text}
        </div>
      )}
    </div>
  );
}

// ==========================================
// 1. Human Anatomy: Heart & Organ Systems
// ==========================================
function HumanAnatomyModule() {
  const [bpm, setBpm] = useState(72);
  const [activeOrgan, setActiveOrgan] = useState('heart');
  const [nephronPressure, setNephronPressure] = useState(60);
  const [breathRate, setBreathRate] = useState(16);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {[
          { key: 'heart', label: 'হৃদপিণ্ড ও রক্ত সংবহন (Heart & Blood Circulation)' },
          { key: 'respiratory', label: 'শ্বসনতন্ত্র ও অ্যালভিওলাই (Lungs & Alveoli)' },
          { key: 'digestive', label: 'পরিপাকতন্ত্র (Digestive System & Enzymes)' },
          { key: 'nephron', label: 'রেচনতন্ত্র ও নেফ্রন (Kidney & Nephron)' },
        ].map(item => (
          <button
            key={item.key}
            onClick={() => setActiveOrgan(item.key)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeOrgan === item.key 
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30 scale-105' 
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {activeOrgan === 'heart' && (
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-sm text-white flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-500 animate-pulse" />
              <span>মানব হৃদপিণ্ড ও দ্বি-সংবহন তন্ত্র (Double Circulation Simulator)</span>
            </h4>
            <span className="text-xs font-mono text-rose-400 bg-rose-950/40 border border-rose-500/30 px-3 py-1 rounded-full">
              হৃদস্পন্দন: {bpm} BPM
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col items-center justify-center">
              <svg viewBox="0 0 260 220" className="w-full max-w-[240px] h-48">
                {/* Main Heart Chambers */}
                {/* Left Atrium & Ventricle (Oxygenated - Red) */}
                <path 
                  d="M130 50 C130 20 180 20 195 55 C210 90 190 140 130 190 C70 140 50 90 65 55 C80 20 130 20 130 50 Z" 
                  fill="#881337" 
                  stroke="#f43f5e" 
                  strokeWidth="2.5"
                  className="animate-pulse"
                  style={{ animationDuration: `${60/bpm}s` }}
                />
                {/* Septum */}
                <line x1="130" y1="50" x2="130" y2="185" stroke="#0f172a" strokeWidth="6" />
                
                {/* Chambers Text */}
                <text x="95" y="80" fill="#60a5fa" fontSize="9" fontWeight="bold" textAnchor="middle">ডান অলিন্দ (RA)</text>
                <text x="95" y="130" fill="#3b82f6" fontSize="9" fontWeight="bold" textAnchor="middle">ডান নিলয় (RV)</text>
                <text x="165" y="80" fill="#f87171" fontSize="9" fontWeight="bold" textAnchor="middle">বাম অলিন্দ (LA)</text>
                <text x="165" y="130" fill="#ef4444" fontSize="9" fontWeight="bold" textAnchor="middle">বাম নিলয় (LV)</text>

                {/* Valves */}
                <ellipse cx="95" cy="100" rx="12" ry="3" fill="#f59e0b" />
                <text x="95" y="103" fill="#000" fontSize="6" textAnchor="middle">ট্রাইকাসপিড</text>
                <ellipse cx="165" cy="100" rx="12" ry="3" fill="#f59e0b" />
                <text x="165" y="103" fill="#000" fontSize="6" textAnchor="middle">বাইকাসপিড</text>

                {/* Blood flow labels */}
                <path d="M40 70 Q70 65 90 75" fill="none" stroke="#38bdf8" strokeWidth="2" markerEnd="url(#arrow)" />
                <text x="35" y="65" fill="#38bdf8" fontSize="7">CO₂ যুক্ত রক্ত</text>
                
                <path d="M220 70 Q190 65 170 75" fill="none" stroke="#f43f5e" strokeWidth="2" />
                <text x="225" y="65" fill="#f43f5e" fontSize="7">O₂ যুক্ত রক্ত</text>
              </svg>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">হৃদস্পন্দনের গতি নিয়ন্ত্রণ (BPM): {bpm}</label>
                <input 
                  type="range" 
                  min="40" 
                  max="160" 
                  value={bpm} 
                  onChange={e => setBpm(+e.target.value)} 
                  className="w-full accent-rose-500" 
                />
              </div>

              <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1.5">
                <p className="font-bold text-rose-300">রক্ত সংবহন চক্র:</p>
                <p className="text-slate-300">১. ঊর্ধ্ব ও নিম্ন মহাশিরা → ডান অলিন্দ → ডান নিলয়</p>
                <p className="text-slate-300">২. ফুসফুসীয় ধমনি → ফুসফুস (গ্যাসীয় বিনিময় O₂ সংগ্রহ)</p>
                <p className="text-slate-300">৩. ফুসফুসীয় শিরা → বাম অলিন্দ → বাম নিলয়</p>
                <p className="text-slate-300">৪. মহাধমনি (Aorta) → সমগ্র দেহ</p>
              </div>
            </div>
          </div>

          <AICard text="মানবদেহের সংবহন দ্বি-চক্রীয় (Double Circulation): সিস্টেমিক ও পালমোনারি সংবহন। বাম নিলয়ের প্রাচীর সবচেয়ে পুরু কারণ এটি উচ্চচাপে মহাধমনির মাধ্যমে সারা দেহে রক্ত পাঠায়। সিস্টোলিক রক্তচাপ (সংকোচন) সাধারণত ১২০ mmHg ও ডায়াস্টোলিক (প্রসারণ) ৮০ mmHg।" />
        </div>
      )}

      {activeOrgan === 'respiratory' && (
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 space-y-4">
          <h4 className="font-bold text-sm text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <span>ফুসফুস ও অ্যালভিওলাইয়ের গ্যাসীয় বিনিময় (Alveolar Gas Exchange)</span>
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col items-center">
              <svg viewBox="0 0 200 160" className="w-full h-40">
                {/* Trachea and Bronchi */}
                <path d="M100 10 L100 50 L60 80 M100 50 L140 80" fill="none" stroke="#64748b" strokeWidth="6" strokeLinecap="round" />
                {/* Lungs */}
                <path d="M50 70 C20 90 25 140 70 145 C80 145 85 120 75 80 Z" fill="rgba(244,63,94,0.3)" stroke="#f43f5e" strokeWidth="2" />
                <path d="M150 70 C180 90 175 140 130 145 C120 145 115 120 125 80 Z" fill="rgba(244,63,94,0.3)" stroke="#f43f5e" strokeWidth="2" />
                {/* Alveolus Zoom */}
                <circle cx="150" cy="115" r="22" fill="#0369a1" stroke="#38bdf8" strokeWidth="2" />
                <text x="150" y="112" fill="#ffffff" fontSize="7" textAnchor="middle" fontWeight="bold">Alveoli</text>
                <text x="150" y="122" fill="#a5f3fc" fontSize="6" textAnchor="middle">O₂ in / CO₂ out</text>
              </svg>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">শ্বাস-প্রশ্বাসের হার: {breathRate}/মিনিট</label>
                <input 
                  type="range" 
                  min="10" 
                  max="40" 
                  value={breathRate} 
                  onChange={e => setBreathRate(+e.target.value)} 
                  className="w-full accent-cyan-500" 
                />
              </div>
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
                <p className="font-bold text-cyan-300">অ্যালভিওলাইয়ের বৈশিষ্ট্য:</p>
                <p className="text-slate-300">• পাতলা স্কোয়ামাস এপিথেলিয়াম দ্বারা গঠিত</p>
                <p className="text-slate-300">• কৈশিক জালিকা দিয়ে অত্যন্ত নিবিড়ভাবে আবৃত</p>
                <p className="text-slate-300">• ব্যাপন (Diffusion) প্রক্রিয়ায় গ্যাসীয় বিনিময় সম্পন্ন হয়</p>
              </div>
            </div>
          </div>
          <AICard text="অ্যালভিওলাই হলো ফুসফুসের কার্যকরী একক। ফুসফুসে প্রায় ৩০-৪০ কোটি অ্যালভিওলাই থাকে, যা গ্যাসীয় বিনিময়ের জন্য বিশাল পৃষ্ঠতল (Surface area) তৈরি করে।" />
        </div>
      )}

      {activeOrgan === 'nephron' && (
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 space-y-4">
          <h4 className="font-bold text-sm text-white">বৃক্ক ও নেফ্রনের মূত্র উৎপাদন কৌশল (Nephron Ultrafiltration)</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
              <svg viewBox="0 0 240 160" className="w-full h-40">
                {/* Bowman's Capsule */}
                <path d="M40 50 C40 25 80 25 80 50 C80 65 70 75 55 75 C40 75 40 60 40 50 Z" fill="none" stroke="#f59e0b" strokeWidth="2.5" />
                {/* Glomerulus */}
                <circle cx="60" cy="45" r="14" fill="#dc2626" opacity="0.6" />
                <text x="60" y="48" fill="#fff" fontSize="6" textAnchor="middle" fontWeight="bold">গ্লোমেরুলাস</text>
                
                {/* Tubules (PCT, Henle Loop, DCT) */}
                <path d="M55 75 Q70 100 80 90 T100 130 T120 70 T150 90 L180 90" fill="none" stroke="#f59e0b" strokeWidth="2" />
                {/* Collecting Duct */}
                <line x1="180" y1="30" x2="180" y2="150" stroke="#10b981" strokeWidth="4" />
                <text x="180" y="25" fill="#10b981" fontSize="7" textAnchor="middle">সংগ্রাহী নালিকা</text>
                <text x="100" y="145" fill="#f59e0b" fontSize="7" textAnchor="middle">হেনলির লুপ</text>
              </svg>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">গ্লোমেরুলার পরিস্রাবণ চাপ: {nephronPressure} mmHg</label>
                <input 
                  type="range" 
                  min="30" 
                  max="90" 
                  value={nephronPressure} 
                  onChange={e => setNephronPressure(+e.target.value)} 
                  className="w-full accent-amber-500" 
                />
              </div>
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
                <p className="font-bold text-amber-300">মূত্র তৈরির ৩টি প্রধান ধাপ:</p>
                <p className="text-slate-300">১. আল্ট্রাফিল্ট্রেশন (গ্লোমেরুলাসে ছাঁকন)</p>
                <p className="text-slate-300">২. পুনঃশোষণ (গ্লুকোজ, লবণ ও পানির শোষণ)</p>
                <p className="text-slate-300">৩. সক্রিয় ক্ষরণ ও মূত্র নিষ্কাশন</p>
              </div>
            </div>
          </div>
          <AICard text="প্রতিটি বৃক্কে প্রায় ১০ থেকে ১২ লক্ষ নেফ্রন থাকে। গ্লোমেরুলাস উচ্চ রক্তচাপের মাধ্যমে রক্ত থেকে ইউরিয়া, ইউরিক এসিড, পানি ও খনিজ উপাদান ছেঁকে বোম্যান্স ক্যাপসুলে পাঠায় যাকে আল্ট্রাফিল্ট্রেট বলে।" />
        </div>
      )}

      {activeOrgan === 'digestive' && (
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 space-y-3">
          <h4 className="font-bold text-sm text-white">পরিপাকনালি ও প্রধান এনজাইমসমূহ</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            {[
              { organ: 'মুখগহ্বর (Mouth)', ph: 'pH ~6.8', enzyme: 'টায়ালিন ও মল্টেজ', target: 'শর্করা → মল্টোজ' },
              { organ: 'পাকস্থলী (Stomach)', ph: 'pH ~1.5 - 2.0', enzyme: 'পেপসিন ও রেনিন (HCl উপস্থিতিতে)', target: 'আমিষ → পেপটন' },
              { organ: 'ক্ষুদ্রান্ত্র (Duodenum)', ph: 'pH ~8.0', enzyme: 'ট্রিপসিন, অ্যামাইলেজ, লাইপেজ', target: 'আমিষ, শর্করা ও স্নেহ পরিপাক' },
            ].map((d, i) => (
              <div key={i} className="p-3.5 bg-slate-900 border border-slate-800 rounded-2xl space-y-1.5">
                <p className="font-black text-emerald-400">{d.organ}</p>
                <p className="text-slate-400 font-mono">{d.ph}</p>
                <p className="text-slate-200"><strong>এনজাইম:</strong> {d.enzyme}</p>
                <p className="text-slate-400 text-[11px]">{d.target}</p>
              </div>
            ))}
          </div>
          <AICard text="পাকস্থলীতে নিঃসৃত হাইড্রোক্লোরিক এসিড (HCl) খাদ্যদ্রব্যের ক্ষতিকর ব্যাকটেরিয়া ধ্বংস করে এবং নিষ্ক্রিয় পেপসিনোজেনকে সক্রিয় পেপসিনে রূপান্তরিত করে।" />
        </div>
      )}
    </div>
  );
}

// ==========================================
// 2. Cell Biology & DNA Explorer
// ==========================================
function CellAndDNAModule() {
  const [cellType, setCellType] = useState('plant');
  const [selectedOrganelle, setSelectedOrganelle] = useState(null);

  const plantOrganelles = [
    { name: 'ক্লোরোপ্লাস্ট (Chloroplast)', role: 'সালোকসংশ্লেষণের মাধ্যমে খাদ্য তৈরি করে (সবুজ প্লাস্টিড)। গ্রানা ও স্ট্রোমা সমন্বিত।' },
    { name: 'কোষপ্রাচীর (Cell Wall)', role: 'সেলুলোজ নির্মিত দৃঢ় প্রাচীর যা উদ্ভিদ কোষকে নির্দিষ্ট আকৃতি ও সুরক্ষা দেয়।' },
    { name: 'নিউক্লিয়াস (Nucleus)', role: 'কোষের প্রাণকেন্দ্র। ক্রোমাটিন তন্তু, নিউক্লিওলাস ও নিউক্লিওপ্লাজম ধারণ করে।' },
    { name: 'মাইটোকন্ড্রিয়া (Mitochondria)', role: 'কোষের পাওয়ার হাউজ (Powerhouse)। শ্বসন প্রক্রিয়ায় এটিপি (ATP) তৈরি করে।' },
    { name: 'কোষ গহ্বর (Large Central Vacuole)', role: 'কোষরস ধারণ করে এবং ভেতরের তরল চাপ বজায় রাখে।' },
  ];

  const animalOrganelles = [
    { name: 'সেন্ট্রোসোম (Centrosome & Centriole)', role: 'কোষ বিভাজনের সময় স্পিন্ডল তন্তু তৈরি করে।' },
    { name: 'নিউক্লিয়াস (Nucleus)', role: 'কোষের সকল জৈবিক কার্যাবলী ও বংশগতির তথ্য নিয়ন্ত্রণ করে।' },
    { name: 'মাইটোকন্ড্রিয়া (Mitochondria)', role: 'অক্সিজেন ব্যবহার করে খাদ্য ভেঙে শক্তি বা ATP উৎপাদন করে।' },
    { name: 'লাইসোসোম (Lysosome)', role: 'হাইড্রোলাইটিক এনজাইম সমৃদ্ধ যা ব্যাক্টেরিয়া ও ক্ষতিগ্রস্ত অঙ্গাণু হজম করে (আত্মঘাতী থলিকা)।' },
    { name: 'গলগি বস্তু (Golgi Apparatus)', role: 'প্রোটিন ও লিপিড প্যাকিং এবং ক্ষরণ কাজে নিয়োজিত।' },
  ];

  const activeList = cellType === 'plant' ? plantOrganelles : animalOrganelles;

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <button 
          onClick={() => { setCellType('plant'); setSelectedOrganelle(null); }}
          className={`px-4 py-2 rounded-xl text-xs font-bold ${cellType === 'plant' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'}`}
        >
          উদ্ভিদ কোষ (Plant Cell)
        </button>
        <button 
          onClick={() => { setCellType('animal'); setSelectedOrganelle(null); }}
          className={`px-4 py-2 rounded-xl text-xs font-bold ${cellType === 'animal' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'}`}
        >
          প্রাণী কোষ (Animal Cell)
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-6 bg-slate-950 border border-slate-800 rounded-3xl p-5 flex flex-col items-center justify-center">
          <svg viewBox="0 0 240 220" className="w-full max-w-[240px] h-52">
            {cellType === 'plant' ? (
              <>
                {/* Plant Cell Outer Wall (Hexagonal) */}
                <polygon points="120,10 210,50 210,170 120,210 30,170 30,50" fill="#064e3b" stroke="#10b981" strokeWidth="4" />
                <polygon points="120,18 200,54 200,166 120,202 40,166 40,54" fill="#022c22" stroke="#047857" strokeWidth="2" />
                {/* Large Central Vacuole */}
                <ellipse cx="120" cy="120" rx="45" ry="35" fill="rgba(56,189,248,0.25)" stroke="#38bdf8" strokeWidth="1.5" />
                <text x="120" y="123" fill="#bae6fd" fontSize="7" textAnchor="middle">কোষ গহ্বর</text>
                {/* Nucleus at the side */}
                <circle cx="165" cy="65" r="18" fill="#581c87" stroke="#a855f7" strokeWidth="1.5" />
                <circle cx="165" cy="65" r="5" fill="#d8b4fe" />
                <text x="165" y="90" fill="#d8b4fe" fontSize="6" textAnchor="middle">নিউক্লিয়াস</text>
                {/* Chloroplasts */}
                <ellipse cx="70" cy="60" rx="12" ry="7" fill="#15803d" stroke="#22c55e" strokeWidth="1" />
                <ellipse cx="65" cy="155" rx="12" ry="7" fill="#15803d" stroke="#22c55e" strokeWidth="1" />
                <ellipse cx="160" cy="165" rx="12" ry="7" fill="#15803d" stroke="#22c55e" strokeWidth="1" />
                <text x="70" y="73" fill="#86efac" fontSize="5" textAnchor="middle">ক্লোরোপ্লাস্ট</text>
              </>
            ) : (
              <>
                {/* Animal Cell Membrane (Irregular rounded) */}
                <path d="M120 20 C180 15 220 60 215 120 C210 180 160 205 110 200 C50 195 20 150 25 90 C30 30 70 25 120 20 Z" fill="#1e1b4b" stroke="#6366f1" strokeWidth="3" />
                {/* Center Nucleus */}
                <circle cx="120" cy="110" r="28" fill="#4c1d95" stroke="#a855f7" strokeWidth="2" />
                <circle cx="120" cy="110" r="8" fill="#d8b4fe" />
                <text x="120" y="145" fill="#e9d5ff" fontSize="7" textAnchor="middle">নিউক্লিয়াস</text>
                {/* Mitochondria */}
                <ellipse cx="65" cy="70" rx="14" ry="8" fill="#991b1b" stroke="#ef4444" strokeWidth="1.5" />
                <text x="65" y="85" fill="#fca5a5" fontSize="6" textAnchor="middle">মাইটোকন্ড্রিয়া</text>
                {/* Centrosome */}
                <circle cx="165" cy="70" r="8" fill="#f59e0b" stroke="#fbbf24" strokeWidth="1" />
                <text x="165" y="83" fill="#fef08a" fontSize="5" textAnchor="middle">সেন্ট্রোসোম</text>
              </>
            )}
          </svg>
        </div>

        <div className="md:col-span-6 space-y-2">
          <h4 className="font-bold text-xs text-slate-300">অঙ্গাণুর তালিকা (ক্লিক করে বিস্তারিত দেখুন):</h4>
          <div className="space-y-2">
            {activeList.map((org, i) => (
              <button
                key={i}
                onClick={() => setSelectedOrganelle(org)}
                className={`w-full text-left p-3 rounded-xl border text-xs transition-all ${
                  selectedOrganelle?.name === org.name 
                    ? 'border-emerald-500 bg-emerald-950/40 text-emerald-200' 
                    : 'border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700'
                }`}
              >
                <p className="font-bold">{org.name}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">{org.role}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* DNA Double Helix Visualizer */}
      <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 space-y-3">
        <h4 className="font-bold text-sm text-white flex items-center gap-2">
          <Dna className="w-4 h-4 text-indigo-400" />
          <span>ডিএনএ ডাবল-হেলিক্স ও ক্ষারক জোড় (Watson-Crick Model: A=T, G≡C)</span>
        </h4>
        <div className="p-4 bg-slate-900 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
          <svg viewBox="0 0 300 80" className="w-full max-w-sm h-20">
            {/* Double helix strands */}
            <path d="M10 20 Q50 60 90 20 T170 20 T250 20 T330 20" fill="none" stroke="#6366f1" strokeWidth="2.5" />
            <path d="M10 60 Q50 20 90 60 T170 60 T250 60 T330 60" fill="none" stroke="#ec4899" strokeWidth="2.5" />
            {/* Hydrogen bonds / Base pairs */}
            {[30, 50, 70, 110, 130, 150, 190, 210, 230].map((x, i) => (
              <line key={i} x1={x} y1="28" x2={x} y2="52" stroke="#10b981" strokeWidth="2" strokeDasharray="2,2" />
            ))}
          </svg>
          <div className="grid grid-cols-2 gap-2 text-xs w-full md:w-auto flex-shrink-0">
            <div className="p-2 rounded-xl bg-slate-950 border border-emerald-500/30 text-emerald-300 text-center font-bold">
              Adenine (A) = Thymine (T) <br/><span className="text-[10px] text-slate-400 font-normal">২টি হাইড্রোজেন বন্ধন</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-950 border border-indigo-500/30 text-indigo-300 text-center font-bold">
              Guanine (G) ≡ Cytosine (C) <br/><span className="text-[10px] text-slate-400 font-normal">৩টি হাইড্রোজেন বন্ধন</span>
            </div>
          </div>
        </div>
      </div>

      <AICard text="১৯৫৩ সালে ওয়াটসন ও ক্রিক ডিএনএ-র দ্বি-সূত্রক হেলিক্স মডেল আবিষ্কার করেন। প্রতিটি ঘূর্ণনে ১০ জোড়া মনোনিউক্লিওটাইড থাকে এবং একটি পূর্ণ ঘূর্ণনের দৈর্ঘ্য ৩৪ Å (3.4 nm)।" />
    </div>
  );
}

// ==========================================
// 3. Plant Physiology: Photosynthesis
// ==========================================
function PlantPhysiologyModule() {
  const [lightIntensity, setLightIntensity] = useState(70);
  const [co2Level, setCo2Level] = useState(50);
  const [stomataOpen, setStomataOpen] = useState(true);

  const rate = Math.round((lightIntensity * 0.5 + co2Level * 0.5) * (stomataOpen ? 1 : 0.2));

  return (
    <div className="space-y-6">
      <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 space-y-4">
        <h4 className="font-bold text-sm text-white flex items-center gap-2">
          <Leaf className="w-4 h-4 text-emerald-400" />
          <span>সালোকসংশ্লেষণ ও প্রস্বেদন সিমুলেটর (Photosynthesis & Transpiration)</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-slate-400 text-xs block mb-1">সূর্যালোকের তীব্রতা (Light Intensity): {lightIntensity}%</label>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={lightIntensity} 
                onChange={e => setLightIntensity(+e.target.value)} 
                className="w-full accent-amber-500" 
              />
            </div>
            <div>
              <label className="text-slate-400 text-xs block mb-1">CO₂ ঘনমাত্রা (Carbon Dioxide Level): {co2Level}%</label>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={co2Level} 
                onChange={e => setCo2Level(+e.target.value)} 
                className="w-full accent-cyan-500" 
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-900 border border-slate-800 rounded-xl">
              <span className="text-xs text-slate-300 font-bold">পত্ররন্ধ্র (Stomata Guard Cells):</span>
              <button 
                onClick={() => setStomataOpen(o => !o)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  stomataOpen ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                }`}
              >
                {stomataOpen ? 'উন্মুক্ত (Open)' : 'বন্ধ (Closed)'}
              </button>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
            <div className="space-y-2">
              <p className="text-xs font-bold text-slate-300">সালোকসংশ্লেষণের সমীকরণ:</p>
              <p className="font-mono text-xs text-emerald-300 p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                6CO₂ + 12H₂O <span className="text-amber-400">→ (আলো/ক্লোরোফিল) →</span> C₆H₁₂O₆ + 6H₂O + 6O₂↑
              </p>
            </div>

            <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-center mt-3">
              <p className="text-xs text-slate-400">উৎপাদনের গতিবেগ (Photosynthesis Rate):</p>
              <p className="text-2xl font-black text-emerald-400">{rate}%</p>
            </div>
          </div>
        </div>

        <AICard text="সালোকসংশ্লেষণ দুটি ধাপে ঘটে: আলোক নির্ভর অধ্যায় (থাইলাকয়েডে এটিপি ও NADPH₂ তৈরি) এবং আলোক নিরপেক্ষ বা ক্যালভিন চক্র (স্ট্রোমায় গ্লুকোজ তৈরি)। পত্ররন্ধ্র দিয়ে প্রস্বেদন প্রক্রিয়ায় শতকরা ৯৯ ভাগ পানি বাষ্পাকারে বের হয়ে যায়।" />
      </div>
    </div>
  );
}

// ==========================================
// MAIN COMPONENT
// ==========================================
const TABS = [
  { key: 'anatomy', label: 'মানব শারীরস্থান (Anatomy & Systems)', icon: Heart, Component: HumanAnatomyModule },
  { key: 'cell-dna', label: 'কোষ জীববিজ্ঞান ও ডিএনএ (Cell & DNA)', icon: Microscope, Component: CellAndDNAModule },
  { key: 'physiology', label: 'উদ্ভিদ শারীরতত্ত্ব (Plant Physiology)', icon: Leaf, Component: PlantPhysiologyModule },
];

export default function MasterBiologyLab() {
  const [activeTab, setActiveTab] = useState('anatomy');
  const [isExporting, setIsExporting] = useState(false);
  const labRef = useRef(null);
  const CurrentTab = TABS.find(t => t.key === activeTab);

  const handleExport = async () => {
    if (!labRef.current) return;
    setIsExporting(true);
    try {
      await exportBrandedGraphic(labRef.current, {
        fileName: `NextGen_Biology_${activeTab}`,
        cardTitle: `জীববিজ্ঞান মাস্টার ল্যাব: ${CurrentTab?.label}`,
        scale: 2
      });
    } catch (e) {
      console.error('Export failed:', e);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 bg-gradient-to-r from-slate-900 via-rose-950/40 to-slate-900 border border-slate-800 rounded-3xl text-white flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
            <Microscope className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-black flex items-center gap-2">
              জীববিজ্ঞান মাস্টার থ্রিডি ল্যাব (Biology 3D Lab)
              <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs">
                SSC সম্পূর্ণ
              </span>
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              হৃদপিণ্ড ও রক্তসংবহন • ফুসফুস ও নেফ্রন • উদ্ভিদ ও প্রাণী কোষ • ডিএনএ মডেল • সালোকসংশ্লেষণ
            </p>
          </div>
        </div>

        <button 
          type="button" 
          onClick={handleExport} 
          disabled={isExporting}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 text-white font-black text-xs shadow-lg flex items-center gap-2 hover:scale-105 transition-all disabled:opacity-50 flex-shrink-0"
        >
          {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          <span>চিহ্নিত চিত্র ও নোট ডাউনলোড</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {TABS.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black transition-all ${
                isActive 
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30 scale-105' 
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Workspace */}
      <div ref={labRef} className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl">
        <div className="flex items-center gap-2 mb-4 pb-4 border-b border-slate-800">
          {CurrentTab && <CurrentTab.icon className="w-5 h-5 text-rose-400" />}
          <h3 className="font-black text-white">{CurrentTab?.label}</h3>
          <span className="text-xs text-slate-500">SSC Biology Anatomy & Physiology</span>
        </div>
        {CurrentTab && <CurrentTab.Component />}
      </div>
    </div>
  );
}
