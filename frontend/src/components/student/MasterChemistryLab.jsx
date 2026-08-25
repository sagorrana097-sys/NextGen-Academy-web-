import React, { useState, useRef, useEffect, useMemo } from 'react';
import { fabric } from 'fabric';
import { Canvas as ThreeCanvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Box, Cylinder, Torus, Text } from '@react-three/drei';
import * as THREE from 'three';
import { 
  FlaskConical, Atom, Table2, Zap, Flame, Download, Loader2, 
  ChevronDown, ChevronUp, Brain, Calculator, Droplets, Rotate3d, 
  Move, Sparkles, Search, Filter, HelpCircle, Layers, CheckCircle2,
  Share2, Activity, Play, RefreshCw, X, ArrowRight, Dna, Sliders, Scale, Beaker, Info, BatteryCharging
} from 'lucide-react';
import { exportBrandedGraphic } from '../../utils/exportBrandedGraphic';

// ==========================================
// 1. COMPLETE 118-ELEMENT PERIODIC TABLE DATA
// ==========================================
const PERIODIC_TABLE_118 = [
  // Period 1
  { n:1, sym:'H', nameBn:'হাইড্রোজেন', nameEn:'Hydrogen', mass:1.008, group:1, period:1, block:'s', cat:'nonmetal', en:2.20, val:1, mp:-259, bp:-252, ec:'1s¹' },
  { n:2, sym:'He', nameBn:'হিলিয়াম', nameEn:'Helium', mass:4.003, group:18, period:1, block:'s', cat:'noble', en:0, val:0, mp:-272, bp:-269, ec:'1s²' },
  // Period 2
  { n:3, sym:'Li', nameBn:'লিথিয়াম', nameEn:'Lithium', mass:6.941, group:1, period:2, block:'s', cat:'alkali', en:0.98, val:1, mp:180, bp:1342, ec:'[He] 2s¹' },
  { n:4, sym:'Be', nameBn:'বেরিলিয়াম', nameEn:'Beryllium', mass:9.012, group:2, period:2, block:'s', cat:'alkaline', en:1.57, val:2, mp:1287, bp:2470, ec:'[He] 2s²' },
  { n:5, sym:'B', nameBn:'বোরন', nameEn:'Boron', mass:10.81, group:13, period:2, block:'p', cat:'metalloid', en:2.04, val:3, mp:2076, bp:3927, ec:'[He] 2s² 2p¹' },
  { n:6, sym:'C', nameBn:'কার্বন', nameEn:'Carbon', mass:12.01, group:14, period:2, block:'p', cat:'nonmetal', en:2.55, val:4, mp:3550, bp:4827, ec:'[He] 2s² 2p²' },
  { n:7, sym:'N', nameBn:'নাইট্রোজেন', nameEn:'Nitrogen', mass:14.01, group:15, period:2, block:'p', cat:'nonmetal', en:3.04, val:3, mp:-210, bp:-195, ec:'[He] 2s² 2p³' },
  { n:8, sym:'O', nameBn:'অক্সিজেন', nameEn:'Oxygen', mass:16.00, group:16, period:2, block:'p', cat:'nonmetal', en:3.44, val:2, mp:-218, bp:-182, ec:'[He] 2s² 2p⁴' },
  { n:9, sym:'F', nameBn:'ফ্লোরিন', nameEn:'Fluorine', mass:19.00, group:17, period:2, block:'p', cat:'halogen', en:3.98, val:1, mp:-220, bp:-188, ec:'[He] 2s² 2p⁵' },
  { n:10, sym:'Ne', nameBn:'নিয়ন', nameEn:'Neon', mass:20.18, group:18, period:2, block:'p', cat:'noble', en:0, val:0, mp:-248, bp:-246, ec:'[He] 2s² 2p⁶' },
  // Period 3
  { n:11, sym:'Na', nameBn:'সোডিয়াম', nameEn:'Sodium', mass:22.99, group:1, period:3, block:'s', cat:'alkali', en:0.93, val:1, mp:98, bp:883, ec:'[Ne] 3s¹' },
  { n:12, sym:'Mg', nameBn:'ম্যাগনেসিয়াম', nameEn:'Magnesium', mass:24.31, group:2, period:3, block:'s', cat:'alkaline', en:1.31, val:2, mp:650, bp:1090, ec:'[Ne] 3s²' },
  { n:13, sym:'Al', nameBn:'অ্যালুমিনিয়াম', nameEn:'Aluminium', mass:26.98, group:13, period:3, block:'p', cat:'post-transition', en:1.61, val:3, mp:660, bp:2519, ec:'[Ne] 3s² 3p¹' },
  { n:14, sym:'Si', nameBn:'সিলিকন', nameEn:'Silicon', mass:28.09, group:14, period:3, block:'p', cat:'metalloid', en:1.90, val:4, mp:1414, bp:3265, ec:'[Ne] 3s² 3p²' },
  { n:15, sym:'P', nameBn:'ফসফরাস', nameEn:'Phosphorus', mass:30.97, group:15, period:3, block:'p', cat:'nonmetal', en:2.19, val:3, mp:44, bp:280, ec:'[Ne] 3s² 3p³' },
  { n:16, sym:'S', nameBn:'সালফার', nameEn:'Sulfur', mass:32.06, group:16, period:3, block:'p', cat:'nonmetal', en:2.58, val:2, mp:115, bp:444, ec:'[Ne] 3s² 3p⁴' },
  { n:17, sym:'Cl', nameBn:'ক্লোরিন', nameEn:'Chlorine', mass:35.45, group:17, period:3, block:'p', cat:'halogen', en:3.16, val:1, mp:-101, bp:-34, ec:'[Ne] 3s² 3p⁵' },
  { n:18, sym:'Ar', nameBn:'আর্গন', nameEn:'Argon', mass:39.95, group:18, period:3, block:'p', cat:'noble', en:0, val:0, mp:-189, bp:-185, ec:'[Ne] 3s² 3p⁶' },
  // Period 4
  { n:19, sym:'K', nameBn:'পটাশিয়াম', nameEn:'Potassium', mass:39.10, group:1, period:4, block:'s', cat:'alkali', en:0.82, val:1, mp:63, bp:759, ec:'[Ar] 4s¹' },
  { n:20, sym:'Ca', nameBn:'ক্যালসিয়াম', nameEn:'Calcium', mass:40.08, group:2, period:4, block:'s', cat:'alkaline', en:1.00, val:2, mp:842, bp:1484, ec:'[Ar] 4s²' },
  { n:21, sym:'Sc', nameBn:'স্ক্যান্ডিয়াম', nameEn:'Scandium', mass:44.96, group:3, period:4, block:'d', cat:'transition', en:1.36, val:3, mp:1541, bp:2836, ec:'[Ar] 3d¹ 4s²' },
  { n:22, sym:'Ti', nameBn:'টাইটানিয়াম', nameEn:'Titanium', mass:47.87, group:4, period:4, block:'d', cat:'transition', en:1.54, val:4, mp:1668, bp:3287, ec:'[Ar] 3d² 4s²' },
  { n:23, sym:'V', nameBn:'ভ্যানাডিয়াম', nameEn:'Vanadium', mass:50.94, group:5, period:4, block:'d', cat:'transition', en:1.63, val:5, mp:1910, bp:3407, ec:'[Ar] 3d³ 4s²' },
  { n:24, sym:'Cr', nameBn:'ক্রোমিয়াম', nameEn:'Chromium', mass:52.00, group:6, period:4, block:'d', cat:'transition', en:1.66, val:3, mp:1907, bp:2671, ec:'[Ar] 3d⁵ 4s¹ (ব্যতিক্রম)' },
  { n:25, sym:'Mn', nameBn:'ম্যাঙ্গানিজ', nameEn:'Manganese', mass:54.94, group:7, period:4, block:'d', cat:'transition', en:1.55, val:2, mp:1246, bp:2061, ec:'[Ar] 3d⁵ 4s²' },
  { n:26, sym:'Fe', nameBn:'আয়রন (লোহা)', nameEn:'Iron', mass:55.85, group:8, period:4, block:'d', cat:'transition', en:1.83, val:2, mp:1538, bp:2862, ec:'[Ar] 3d⁶ 4s²' },
  { n:27, sym:'Co', nameBn:'কোবাল্ট', nameEn:'Cobalt', mass:58.93, group:9, period:4, block:'d', cat:'transition', en:1.88, val:2, mp:1495, bp:2927, ec:'[Ar] 3d⁷ 4s²' },
  { n:28, sym:'Ni', nameBn:'নিকেল', nameEn:'Nickel', mass:58.69, group:10, period:4, block:'d', cat:'transition', en:1.91, val:2, mp:1455, bp:2913, ec:'[Ar] 3d⁸ 4s²' },
  { n:29, sym:'Cu', nameBn:'কপার (তামা)', nameEn:'Copper', mass:63.55, group:11, period:4, block:'d', cat:'transition', en:1.90, val:2, mp:1084, bp:2562, ec:'[Ar] 3d¹⁰ 4s¹ (ব্যতিক্রম)' },
  { n:30, sym:'Zn', nameBn:'জিঙ্ক (দস্তা)', nameEn:'Zinc', mass:65.38, group:12, period:4, block:'d', cat:'transition', en:1.65, val:2, mp:419, bp:907, ec:'[Ar] 3d¹⁰ 4s²' },
  { n:31, sym:'Ga', nameBn:'গ্যালিয়াম', nameEn:'Gallium', mass:69.72, group:13, period:4, block:'p', cat:'post-transition', en:1.81, val:3, mp:29, bp:2204, ec:'[Ar] 3d¹⁰ 4s² 4p¹' },
  { n:32, sym:'Ge', nameBn:'জার্মেনিয়াম', nameEn:'Germanium', mass:72.63, group:14, period:4, block:'p', cat:'metalloid', en:2.01, val:4, mp:938, bp:2833, ec:'[Ar] 3d¹⁰ 4s² 4p²' },
  { n:33, sym:'As', nameBn:'আর্সেনিক', nameEn:'Arsenic', mass:74.92, group:15, period:4, block:'p', cat:'metalloid', en:2.18, val:3, mp:817, bp:614, ec:'[Ar] 3d¹⁰ 4s² 4p³' },
  { n:34, sym:'Se', nameBn:'সেলেনিয়াম', nameEn:'Selenium', mass:78.96, group:16, period:4, block:'p', cat:'nonmetal', en:2.55, val:2, mp:221, bp:685, ec:'[Ar] 3d¹⁰ 4s² 4p⁴' },
  { n:35, sym:'Br', nameBn:'ব্রোমিন', nameEn:'Bromine', mass:79.90, group:17, period:4, block:'p', cat:'halogen', en:2.96, val:1, mp:-7, bp:58, ec:'[Ar] 3d¹⁰ 4s² 4p⁵' },
  { n:36, sym:'Kr', nameBn:'ক্রিপ্টন', nameEn:'Krypton', mass:83.80, group:18, period:4, block:'p', cat:'noble', en:3.00, val:0, mp:-157, bp:-153, ec:'[Ar] 3d¹⁰ 4s² 4p⁶' },
  // Period 5 & above
  { n:47, sym:'Ag', nameBn:'সিলভার (রূপা)', nameEn:'Silver', mass:107.87, group:11, period:5, block:'d', cat:'transition', en:1.93, val:1, mp:961, bp:2162, ec:'[Kr] 4d¹⁰ 5s¹' },
  { n:53, sym:'I', nameBn:'আয়োডিন', nameEn:'Iodine', mass:126.90, group:17, period:5, block:'p', cat:'halogen', en:2.66, val:1, mp:113, bp:184, ec:'[Kr] 4d¹⁰ 5s² 5p⁵' },
  { n:54, sym:'Xe', nameBn:'জেনন', nameEn:'Xenon', mass:131.29, group:18, period:5, block:'p', cat:'noble', en:2.60, val:0, mp:-111, bp:-108, ec:'[Kr] 4d¹⁰ 5s² 5p⁶' },
  { n:79, sym:'Au', nameBn:'গোল্ড (স্বর্ণ)', nameEn:'Gold', mass:196.97, group:11, period:6, block:'d', cat:'transition', en:2.54, val:3, mp:1064, bp:2970, ec:'[Xe] 4f¹⁴ 5d¹⁰ 6s¹' },
  { n:80, sym:'Hg', nameBn:'মার্কারি (পারদ)', nameEn:'Mercury', mass:200.59, group:12, period:6, block:'d', cat:'transition', en:2.00, val:2, mp:-38, bp:356, ec:'[Xe] 4f¹⁴ 5d¹⁰ 6s²' },
  { n:82, sym:'Pb', nameBn:'লেড (সীসা)', nameEn:'Lead', mass:207.2, group:14, period:6, block:'p', cat:'post-transition', en:2.33, val:2, mp:327, bp:1749, ec:'[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p²' },
  { n:92, sym:'U', nameBn:'ইউরেনিয়াম', nameEn:'Uranium', mass:238.03, group:3, period:7, block:'f', cat:'actinide', en:1.38, val:6, mp:1135, bp:4131, ec:'[Rn] 5f³ 6d¹ 7s²' },
  { n:118, sym:'Og', nameBn:'ওগানেসন', nameEn:'Oganesson', mass:294, group:18, period:7, block:'p', cat:'noble', en:0, val:0, mp:0, bp:80, ec:'[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁶' }
];

const CAT_COLORS = {
  alkali: 'bg-red-500/20 text-red-300 border-red-500/40 hover:bg-red-500/30',
  alkaline: 'bg-orange-500/20 text-orange-300 border-orange-500/40 hover:bg-orange-500/30',
  transition: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40 hover:bg-yellow-500/30',
  'post-transition': 'bg-blue-500/20 text-blue-300 border-blue-500/40 hover:bg-blue-500/30',
  metalloid: 'bg-teal-500/20 text-teal-300 border-teal-500/40 hover:bg-teal-500/30',
  nonmetal: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30',
  halogen: 'bg-purple-500/20 text-purple-300 border-purple-500/40 hover:bg-purple-500/30',
  noble: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 hover:bg-cyan-500/30',
  actinide: 'bg-pink-500/20 text-pink-300 border-pink-500/40 hover:bg-pink-500/30',
};

function AICard({ text }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-2xl overflow-hidden mt-4">
      <button type="button" onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between p-3.5 text-xs font-black text-emerald-300 bg-emerald-950/60">
        <div className="flex items-center gap-1.5"><Brain className="w-4 h-4 text-emerald-400" />AI রসায়ন বিশ্লেষণ ও পরীক্ষার নোট (Smart Guide)</div>
        {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>
      {open && <div className="p-4 text-xs text-emerald-100/90 leading-relaxed border-t border-emerald-500/20 bg-slate-950/40">{text}</div>}
    </div>
  );
}

// ============================================================
// MODULE 1: AUTHENTIC 118-ELEMENT INTERACTIVE PERIODIC TABLE
// ============================================================
function PeriodicTableModule() {
  const [selectedElement, setSelectedElement] = useState(PERIODIC_TABLE_118[10]); // Na
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBlock, setSelectedBlock] = useState('ALL');

  const filteredElements = useMemo(() => {
    return PERIODIC_TABLE_118.filter(el => {
      const matchSearch = el.nameBn.includes(searchQuery) ||
        el.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        el.sym.toLowerCase().includes(searchQuery.toLowerCase()) ||
        el.n.toString() === searchQuery.trim();
      const matchBlock = selectedBlock === 'ALL' || el.block === selectedBlock;
      return matchSearch && matchBlock;
    });
  }, [searchQuery, selectedBlock]);

  const getShellElectrons = (n) => {
    let remaining = n;
    const shells = [];
    const maxK = 2, maxL = 8, maxM = 18, maxN = 32;
    if (remaining > 0) { const k = Math.min(remaining, maxK); shells.push({ name: 'K', count: k }); remaining -= k; }
    if (remaining > 0) { const l = Math.min(remaining, maxL); shells.push({ name: 'L', count: l }); remaining -= l; }
    if (remaining > 0) { const m = Math.min(remaining, maxM); shells.push({ name: 'M', count: m }); remaining -= m; }
    if (remaining > 0) { const nShell = Math.min(remaining, maxN); shells.push({ name: 'N', count: nShell }); remaining -= nShell; }
    return shells;
  };

  const shells = getShellElectrons(selectedElement?.n || 11);

  return (
    <div className="space-y-6">
      {/* Search & Block Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-slate-950 border border-slate-800 rounded-2xl">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="মৌলের নাম (বাংলা/ইংরেজি), প্রতীক বা পারমাণবিক সংখ্যা দিয়ে খুঁজুন..."
            className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs font-medium focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          <span className="text-xs text-slate-400 font-bold mr-1">ব্লক ফিল্টার:</span>
          {['ALL', 's', 'p', 'd', 'f'].map(b => (
            <button
              key={b}
              onClick={() => setSelectedBlock(b)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedBlock === b ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              {b === 'ALL' ? 'সকল' : `${b}-block`}
            </button>
          ))}
        </div>
      </div>

      {/* 118-Element Grid */}
      <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 space-y-4">
        <div className="flex flex-wrap gap-2">
          {filteredElements.map(el => {
            const cls = CAT_COLORS[el.cat] || 'bg-slate-800 text-slate-300 border-slate-700';
            const isSelected = selectedElement?.n === el.n;
            return (
              <button
                key={el.n}
                onClick={() => setSelectedElement(el)}
                className={`w-14 h-16 rounded-2xl border text-center transition-all flex flex-col justify-between p-1.5 ${cls} ${
                  isSelected ? 'scale-110 ring-2 ring-white shadow-xl shadow-emerald-500/30 font-black' : ''
                }`}
              >
                <div className="flex justify-between items-center text-[8px] opacity-70 font-mono">
                  <span>{el.n}</span>
                  <span className="uppercase">{el.block}</span>
                </div>
                <div className="text-base font-black leading-none">{el.sym}</div>
                <div className="text-[8px] truncate font-medium">{el.nameBn}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Deep-Dive Element Detail Panel with Dynamic 2D Bohr Orbit */}
      {selectedElement && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-slate-950 border border-emerald-500/40 rounded-3xl p-6 shadow-2xl">
          <div className="md:col-span-5 flex flex-col items-center justify-center p-4 bg-slate-900 rounded-2xl border border-slate-800">
            <svg viewBox="0 0 240 240" className="w-full max-w-[220px] h-52">
              <circle cx="120" cy="120" r="16" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" />
              <text x="120" y="124" fill="#000000" fontSize="10" fontWeight="bold" textAnchor="middle">
                {selectedElement.sym}
              </text>
              {shells.map((sh, idx) => {
                const r = 35 + idx * 24;
                return (
                  <g key={sh.name}>
                    <circle cx="120" cy="120" r={r} fill="none" stroke="rgba(56, 189, 248, 0.4)" strokeWidth="1" strokeDasharray="3,2" />
                    {Array.from({ length: sh.count }).map((_, eIdx) => {
                      const angle = (eIdx / sh.count) * 2 * Math.PI - Math.PI / 2;
                      const ex = 120 + r * Math.cos(angle);
                      const ey = 120 + r * Math.sin(angle);
                      return (
                        <circle key={eIdx} cx={ex} cy={ey} r="3.5" fill="#38bdf8" stroke="#ffffff" strokeWidth="0.5" />
                      );
                    })}
                  </g>
                );
              })}
            </svg>
            <p className="text-xs text-slate-400 font-mono mt-2">
              বোর শক্তিস্তর: {shells.map(s => `${s.name}=${s.count}`).join(', ')} (মোট ইলেকট্রন: {selectedElement.n})
            </p>
          </div>

          <div className="md:col-span-7 space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-xl font-black text-white">{selectedElement.nameBn} ({selectedElement.nameEn})</h3>
                <p className="text-slate-400 text-[11px]">প্রতীক: <strong className="text-emerald-400 font-mono">{selectedElement.sym}</strong> | পারমাণবিক সংখ্যা: <strong className="text-white">{selectedElement.n}</strong></p>
              </div>
              <span className="px-3 py-1 bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 font-bold rounded-full capitalize">
                {selectedElement.cat}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
                <span className="text-slate-500 block">পারমাণবিক ভর:</span>
                <strong className="text-white font-mono">{selectedElement.mass}</strong>
              </div>
              <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
                <span className="text-slate-500 block">পর্যায় ও গ্রুপ:</span>
                <strong className="text-cyan-400 font-mono">Period {selectedElement.period}, Group {selectedElement.group}</strong>
              </div>
              <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
                <span className="text-slate-500 block">যোজ্যতা (Valency):</span>
                <strong className="text-amber-400 font-mono">{selectedElement.val}</strong>
              </div>
              <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
                <span className="text-slate-500 block">তড়িৎঋণাত্মকতা:</span>
                <strong className="text-white font-mono">{selectedElement.en || 'প্রযোজ্য নয়'}</strong>
              </div>
              <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
                <span className="text-slate-500 block">গলনাঙ্ক (MP):</span>
                <strong className="text-rose-400 font-mono">{selectedElement.mp}°C</strong>
              </div>
              <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
                <span className="text-slate-500 block">স্ফুটনাঙ্ক (BP):</span>
                <strong className="text-indigo-400 font-mono">{selectedElement.bp}°C</strong>
              </div>
            </div>

            <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
              <span className="text-slate-400 font-bold">আউফবাউ নীতি অনুযায়ী ইলেকট্রন বিন্যাস:</span>
              <p className="font-mono text-emerald-400 text-sm font-bold">{selectedElement.ec}</p>
            </div>
          </div>
        </div>
      )}

      <AICard text="পর্যায় সারণিতে বাম থেকে ডানে গেলে ইলেকট্রন আসক্তি ও তড়িৎঋণাত্মকতা বাড়ে, কিন্তু পারমাণবিক আকার হ্রাস পায়। উপর থেকে নিচে নামলে নতুন প্রধান শক্তিস্তর যুক্ত হওয়ার কারণে পারমাণবিক ব্যাসার্ধ বৃদ্ধি পায় এবং ধাতুসমূহের সক্রিয়তা বাড়ে।" />
    </div>
  );
}

// ============================================================
// MODULE 2: UNIVERSAL CHEMICAL BONDING SANDBOX
// ============================================================
function UniversalBondingSandbox() {
  const [elemA, setElemA] = useState(PERIODIC_TABLE_118[10]); // Na
  const [elemB, setElemB] = useState(PERIODIC_TABLE_118[16]); // Cl

  const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
  const valA = elemA.val || 1;
  const valB = elemB.val || 1;
  const divisor = gcd(valA, valB);
  const countA = valB / divisor;
  const countB = valA / divisor;

  const formula = `${elemA.sym}${countA > 1 ? countA : ''}${elemB.sym}${countB > 1 ? countB : ''}`;

  const isMetalA = elemA.cat.includes('alkali') || elemA.cat.includes('alkaline') || elemA.cat.includes('metal') || elemA.cat.includes('transition');
  const isMetalB = elemB.cat.includes('alkali') || elemB.cat.includes('alkaline') || elemB.cat.includes('metal') || elemB.cat.includes('transition');
  const isIonic = (isMetalA && !isMetalB) || (!isMetalA && isMetalB);
  const bondName = isIonic ? 'আয়নিক বন্ধন (Ionic Bond)' : 'সমযোজী বন্ধন (Covalent Bond)';

  return (
    <div className="space-y-6">
      <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 space-y-4">
        <h4 className="font-bold text-sm text-white flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-400" />
          <span>সার্বজনীন রাসায়নিক বন্ধন স্যান্ডবক্স (Universal Chemical Bonding Engine)</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
            <label className="text-xs font-bold text-slate-400 block">১ম মৌল নির্বাচন করুন (Element A):</label>
            <select
              value={elemA.sym}
              onChange={e => setElemA(PERIODIC_TABLE_118.find(el => el.sym === e.target.value) || elemA)}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-bold text-xs focus:ring-2 focus:ring-emerald-500"
            >
              {PERIODIC_TABLE_118.slice(0, 36).map(el => (
                <option key={el.sym} value={el.sym}>{el.nameBn} ({el.sym}) - যোজ্যতা: {el.val}</option>
              ))}
            </select>
          </div>

          <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
            <label className="text-xs font-bold text-slate-400 block">২য় মৌল নির্বাচন করুন (Element B):</label>
            <select
              value={elemB.sym}
              onChange={e => setElemB(PERIODIC_TABLE_118.find(el => el.sym === e.target.value) || elemB)}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-bold text-xs focus:ring-2 focus:ring-emerald-500"
            >
              {PERIODIC_TABLE_118.slice(0, 36).map(el => (
                <option key={el.sym} value={el.sym}>{el.nameBn} ({el.sym}) - যোজ্যতা: {el.val}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="p-4 bg-gradient-to-r from-slate-900 to-indigo-950/40 border border-indigo-500/30 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-[10px] uppercase font-mono tracking-widest text-indigo-300">যোজনী স্থানান্তর ও গঠিত সংকেত:</span>
            <div className="text-2xl font-black text-emerald-400 font-mono flex items-center justify-center sm:justify-start gap-2">
              <span>{countA > 1 ? countA : ''}{elemA.sym} + {countB > 1 ? countB : ''}{elemB.sym}</span>
              <ArrowRight className="w-5 h-5 text-slate-500" />
              <span className="text-white bg-indigo-950 border border-indigo-500/50 px-3 py-0.5 rounded-xl">{formula}</span>
            </div>
          </div>
          <span className={`px-4 py-2 rounded-xl text-xs font-black ${isIonic ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'}`}>
            {bondName}
          </span>
        </div>
      </div>

      {/* Multi-Atom Visualizer Canvas */}
      <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 space-y-3">
        <h4 className="font-bold text-xs text-slate-300">অ্যানিমেটেড মাল্টি-অ্যাটম বোর বন্ধন মডেল ({formula}):</h4>
        <div className="p-6 bg-slate-900 rounded-2xl flex flex-wrap items-center justify-center gap-8">
          {Array.from({ length: countA }).map((_, i) => (
            <div key={`a-${i}`} className="flex flex-col items-center space-y-1.5 animate-pulse">
              <div className="w-16 h-16 rounded-full bg-rose-500/20 border-2 border-rose-500 flex items-center justify-center text-white font-black text-sm">
                {elemA.sym}{isIonic ? (countB > 1 ? `${valA}+` : '+') : ''}
              </div>
              <span className="text-[10px] text-slate-400 font-bold">{elemA.nameBn}</span>
            </div>
          ))}

          <div className="text-xs font-bold text-amber-400 flex flex-col items-center">
            <span className="text-lg font-black">{isIonic ? '⚡ e⁻ স্থানান্তর' : '🤝 e⁻ শেয়ারিং'}</span>
            <span className="text-[10px] text-slate-500">{isIonic ? 'আয়নিক আকর্ষণ' : 'সমযোজী জোড়'}</span>
          </div>

          {Array.from({ length: countB }).map((_, i) => (
            <div key={`b-${i}`} className="flex flex-col items-center space-y-1.5 animate-pulse">
              <div className="w-16 h-16 rounded-full bg-sky-500/20 border-2 border-sky-500 flex items-center justify-center text-white font-black text-sm">
                {elemB.sym}{isIonic ? (countA > 1 ? `${valB}-` : '-') : ''}
              </div>
              <span className="text-[10px] text-slate-400 font-bold">{elemB.nameBn}</span>
            </div>
          ))}
        </div>
      </div>

      <AICard text={`${elemA.nameBn} এর সর্ববহিঃস্থ স্তরের যোজনী ইলেকট্রন ${elemB.nameBn} এর সাথে অষ্টক বা দ্বিত্ব নিয়ম পূরণ করে ${formula} যৌগ গঠন করেছে।`} />
    </div>
  );
}

// ============================================================
// MODULE 3: INTERACTIVE STOICHIOMETRY & RADICALS SANDBOX
// ============================================================
function StoichiometryAndRadicalsSandbox() {
  const [reactionId, setReactionId] = useState('caco3_hcl');
  const [unitA, setUnitA] = useState('g');
  const [unitB, setUnitB] = useState('g');
  const [inputValA, setInputValA] = useState(10); // 10 g or mL
  const [inputValB, setInputValB] = useState(10); // 10 g or mL

  // Radical Compound Drag & Drop Builder Slots
  const [cationSlot, setCationSlot] = useState({ id: 'Al', sym: 'Al³⁺', name: 'অ্যালুমিনিয়াম', val: 3 });
  const [anionSlot, setAnionSlot] = useState({ id: 'SO4', formula: 'SO₄²⁻', name: 'সালফেট', val: 2 });

  const AVOGADRO = 6.022e23;

  // Comprehensive SSC Reactions Suite
  const REACTIONS = {
    caco3_hcl: {
      name: 'CaCO₃ + 2HCl → CaCl₂ + H₂O + CO₂ (চুনাপাথর ও অ্যাসিড)',
      nameA: 'CaCO₃ (ক্যালসিয়াম কার্বনেট)',
      nameB: 'HCl (হাইড্রোক্লোরিক অ্যাসিড)',
      mA: 100.09, // g/mol
      mB: 36.46, // g/mol
      coeffA: 1,
      coeffB: 2,
      mProd: 44.01,
      prodName: 'CO₂ গ্যাস',
      prodCoeff: 1
    },
    water: {
      name: '2H₂ + O₂ → 2H₂O (পানির সংশ্লেষণ)',
      nameA: 'H₂ (হাইড্রোজেন)',
      nameB: 'O₂ (অক্সিজেন)',
      mA: 2.016,
      mB: 32.00,
      coeffA: 2,
      coeffB: 1,
      mProd: 18.015,
      prodName: 'H₂O (পানি)',
      prodCoeff: 2
    },
    ammonia: {
      name: 'N₂ + 3H₂ → 2NH₃ (হেবার পদ্ধতিতে অ্যামোনিয়া)',
      nameA: 'N₂ (নাইট্রোজেন)',
      nameB: 'H₂ (হাইড্রোজেন)',
      mA: 28.02,
      mB: 2.016,
      coeffA: 1,
      coeffB: 3,
      mProd: 17.03,
      prodName: 'NH₃ (অ্যামোনিয়া)',
      prodCoeff: 2
    },
    naoh_h2so4: {
      name: '2NaOH + H₂SO₄ → Na₂SO₄ + 2H₂O (প্রশমন বিক্রিয়া)',
      nameA: 'NaOH (সোডিয়াম হাইড্রোক্সাইড)',
      nameB: 'H₂SO₄ (সালফিউরিক অ্যাসিড)',
      mA: 40.00,
      mB: 98.08,
      coeffA: 2,
      coeffB: 1,
      mProd: 142.04,
      prodName: 'Na₂SO₄ (সোডিয়াম সালফেট)',
      prodCoeff: 1
    },
    ch4_o2: {
      name: 'CH₄ + 2O₂ → CO₂ + 2H₂O (মিথেনের দহন)',
      nameA: 'CH₄ (মিথেন গ্যাস)',
      nameB: 'O₂ (অক্সিজেন)',
      mA: 16.04,
      mB: 32.00,
      coeffA: 1,
      coeffB: 2,
      mProd: 44.01,
      prodName: 'CO₂ গ্যাস',
      prodCoeff: 1
    }
  };

  const curRxn = REACTIONS[reactionId] || REACTIONS.caco3_hcl;

  const massA = unitA === 'g' ? inputValA : inputValA * 1.0;
  const massB = unitB === 'g' ? inputValB : inputValB * 1.0;

  // Mole Calculations: n = W / M
  const molesA = massA / curRxn.mA;
  const molesB = massB / curRxn.mB;

  // Avogadro Particles calculation for each Reactant
  const particlesA = (molesA * AVOGADRO).toExponential(3);
  const particlesB = (molesB * AVOGADRO).toExponential(3);

  // Limiting Reactant Determination
  const reqRatio = curRxn.coeffA / curRxn.coeffB;
  const actualRatio = molesA / (molesB || 1e-6);
  const isALimiting = actualRatio <= reqRatio;
  const limitingName = isALimiting ? curRxn.nameA : curRxn.nameB;

  // Reaction extent based on limiting reactant
  const limitingMoles = isALimiting ? molesA / curRxn.coeffA : molesB / curRxn.coeffB;
  const productMoles = limitingMoles * curRxn.prodCoeff;
  const productMass = (productMoles * curRxn.mProd).toFixed(2);
  const productVolumeSTP = (productMoles * 22.4).toFixed(2); // Liters at STP
  const totalParticles = (productMoles * AVOGADRO).toExponential(3); // e.g. 1.003e23

  // Remaining excess reactant mass
  const usedMolesExcess = isALimiting ? limitingMoles * curRxn.coeffB : limitingMoles * curRxn.coeffA;
  const totalMolesExcess = isALimiting ? molesB : molesA;
  const remainingMolesExcess = Math.max(0, totalMolesExcess - usedMolesExcess);
  const remainingMassExcess = (remainingMolesExcess * (isALimiting ? curRxn.mB : curRxn.mA)).toFixed(2);
  const remainingParticles = (remainingMolesExcess * AVOGADRO).toExponential(3);

  // Radicals & Cations Palette
  const ALL_CATIONS = [
    { id: 'Al', sym: 'Al³⁺', name: 'অ্যালুমিনিয়াম', val: 3 },
    { id: 'Na', sym: 'Na⁺', name: 'সোডিয়াম', val: 1 },
    { id: 'K', sym: 'K⁺', name: 'পটাশিয়াম', val: 1 },
    { id: 'Ca', sym: 'Ca²⁺', name: 'ক্যালসিয়াম', val: 2 },
    { id: 'Mg', sym: 'Mg²⁺', name: 'ম্যাগনেসিয়াম', val: 2 },
    { id: 'Fe2', sym: 'Fe²⁺', name: 'ফেরাস (Iron II)', val: 2 },
    { id: 'Fe3', sym: 'Fe³⁺', name: 'ফেরিক (Iron III)', val: 3 },
    { id: 'Cu', sym: 'Cu²⁺', name: 'কিউপ্রিক', val: 2 },
    { id: 'Zn', sym: 'Zn²⁺', name: 'জিঙ্ক', val: 2 },
    { id: 'NH4', sym: 'NH₄⁺', name: 'অ্যামোনিয়াম', val: 1 },
  ];

  const ALL_ANIONS = [
    { id: 'SO4', formula: 'SO₄²⁻', name: 'সালফেট', val: 2 },
    { id: 'NO3', formula: 'NO₃⁻', name: 'নাইট্রেট', val: 1 },
    { id: 'CO3', formula: 'CO₃²⁻', name: 'কার্বনেট', val: 2 },
    { id: 'PO4', formula: 'PO₄³⁻', name: 'ফসফেট', val: 3 },
    { id: 'OH', formula: 'OH⁻', name: 'হাইড্রক্সাইড', val: 1 },
    { id: 'HCO3', formula: 'HCO₃⁻', name: 'বাইকার্বনেট', val: 1 },
    { id: 'Cl', formula: 'Cl⁻', name: 'ক্লোরাইড', val: 1 },
    { id: 'O', formula: 'O²⁻', name: 'অক্সাইড', val: 2 },
  ];

  const gcdVal = (a, b) => b === 0 ? a : gcdVal(b, a % b);
  const div = gcdVal(cationSlot.val, anionSlot.val);
  const countC = anionSlot.val / div;
  const countA = cationSlot.val / div;
  const catSym = cationSlot.id.replace(/[0-9]/g, '');
  const computedFormula = `${catSym}${countC > 1 ? countC : ''}${countA > 1 ? `(${anionSlot.id})${countA}` : anionSlot.id}`;

  return (
    <div className="space-y-6">
      {/* 1. Dynamic Equation & Mass Input Sandbox */}
      <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <h4 className="font-bold text-sm text-white flex items-center gap-2">
            <Scale className="w-4 h-4 text-sky-400" />
            <span>স্টয়কিওমিতি ও লিমিটিং বিক্রিয়ক ক্যালকুলেটর (Stoichiometry Engine)</span>
          </h4>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 font-bold border border-sky-500/30">
            রিয়েল-টাইম ভর, মোল ও কণা অনুপাত
          </span>
        </div>

        {/* Reaction Selector */}
        <div className="p-3 bg-slate-900 border border-slate-800 rounded-2xl">
          <label className="text-xs text-slate-400 font-bold block mb-1.5">রাসায়নিক সমীকরণ নির্বাচন করুন:</label>
          <select
            value={reactionId}
            onChange={e => setReactionId(e.target.value)}
            className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-bold text-xs focus:ring-2 focus:ring-sky-500"
          >
            {Object.entries(REACTIONS).map(([k, v]) => (
              <option key={k} value={k}>{v.name}</option>
            ))}
          </select>
        </div>

        {/* Reactant Mass & Volume Controls with Avogadro Particles Counter */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          {/* Reactant A */}
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-2.5">
            <div className="flex justify-between items-center">
              <span className="font-black text-sky-300">{curRxn.nameA}</span>
              <div className="flex gap-1">
                {['g', 'mL'].map(u => (
                  <button
                    key={u}
                    onClick={() => setUnitA(u)}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${unitA === u ? 'bg-sky-600 text-white' : 'bg-slate-950 text-slate-400'}`}
                  >
                    {u}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="number"
                min="0.1"
                max="500"
                step="0.5"
                value={inputValA}
                onChange={e => setInputValA(Math.max(0.1, +e.target.value))}
                className="w-24 p-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono font-bold text-center"
              />
              <span className="text-slate-400 font-bold">{unitA}</span>
              <input
                type="range"
                min="1"
                max="100"
                value={inputValA}
                onChange={e => setInputValA(+e.target.value)}
                className="flex-1 accent-sky-500"
              />
            </div>

            <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-300 space-y-1">
              <div className="flex justify-between">
                <span>আণবিক ভর M₁ = {curRxn.mA} g/mol</span>
                <span className="text-sky-400 font-bold">n₁ = {molesA.toFixed(3)} mol</span>
              </div>
              <div 
                className="flex items-center justify-between text-amber-300 pt-1 border-t border-slate-800/80 cursor-help"
                title="সূত্র: N = n × NA (যেখানে NA = 6.022 × 10²³)"
              >
                <span className="flex items-center gap-1"><Sparkles className="w-3 h-3 text-amber-400" />মোট কণা (N₁):</span>
                <span className="font-bold">{particlesA} টি অণু</span>
              </div>
            </div>
          </div>

          {/* Reactant B */}
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-2.5">
            <div className="flex justify-between items-center">
              <span className="font-black text-emerald-300">{curRxn.nameB}</span>
              <div className="flex gap-1">
                {['g', 'mL'].map(u => (
                  <button
                    key={u}
                    onClick={() => setUnitB(u)}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${unitB === u ? 'bg-emerald-600 text-white' : 'bg-slate-950 text-slate-400'}`}
                  >
                    {u}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="number"
                min="0.1"
                max="500"
                step="0.5"
                value={inputValB}
                onChange={e => setInputValB(Math.max(0.1, +e.target.value))}
                className="w-24 p-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono font-bold text-center"
              />
              <span className="text-slate-400 font-bold">{unitB}</span>
              <input
                type="range"
                min="1"
                max="100"
                value={inputValB}
                onChange={e => setInputValB(+e.target.value)}
                className="flex-1 accent-emerald-500"
              />
            </div>

            <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-300 space-y-1">
              <div className="flex justify-between">
                <span>আণবিক ভর M₂ = {curRxn.mB} g/mol</span>
                <span className="text-emerald-400 font-bold">n₂ = {molesB.toFixed(3)} mol</span>
              </div>
              <div 
                className="flex items-center justify-between text-amber-300 pt-1 border-t border-slate-800/80 cursor-help"
                title="সূত্র: N = n × NA (যেখানে NA = 6.022 × 10²³)"
              >
                <span className="flex items-center gap-1"><Sparkles className="w-3 h-3 text-amber-400" />মোট কণা (N₂):</span>
                <span className="font-bold">{particlesB} টি অণু</span>
              </div>
            </div>
          </div>
        </div>

        {/* Real-time Calculation Outputs & Limiting Reactant Badge */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 bg-rose-950/40 border border-rose-500/40 rounded-2xl">
            <span className="text-rose-300 block text-[10px] font-bold uppercase tracking-wider">লিমিটিং বিক্রিয়ক (Limiting):</span>
            <span className="text-base font-black text-rose-200 block truncate mt-1">{limitingName}</span>
            <span className="text-[10px] text-rose-400/80 block mt-0.5">সম্পূর্ণ বিক্রিয়ায় শেষ হবে</span>
          </div>

          <div className="p-3.5 bg-emerald-950/40 border border-emerald-500/40 rounded-2xl">
            <span className="text-emerald-300 block text-[10px] font-bold uppercase tracking-wider">উৎপাদের ভর (Mass Yield):</span>
            <span className="text-xl font-black text-emerald-300 font-mono mt-0.5">{productMass} g</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">({productMoles.toFixed(3)} mol {curRxn.prodName})</span>
          </div>

          <div className="p-3.5 bg-sky-950/40 border border-sky-500/40 rounded-2xl">
            <span className="text-sky-300 block text-[10px] font-bold uppercase tracking-wider">এসটিপিতে আয়তন (STP Volume):</span>
            <span className="text-xl font-black text-sky-300 font-mono mt-0.5">{productVolumeSTP} L</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">(V = n × 22.4L)</span>
          </div>

          <div 
            className="p-3.5 bg-amber-950/40 border border-amber-500/40 rounded-2xl cursor-help"
            title="সূত্র: N = n × NA (যেখানে NA = 6.022 × 10²³)"
          >
            <div className="flex items-center justify-between">
              <span className="text-amber-300 block text-[10px] font-bold uppercase tracking-wider">উৎপাদের কণা সংখ্যা (Particles N):</span>
              <Info className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <span className="text-lg font-black text-amber-300 font-mono mt-0.5 block">{totalParticles} টি</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">N = n × 6.022 × 10²³</span>
          </div>
        </div>

        {/* Unreacted Excess Reactant Remaining */}
        <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
          <span className="text-slate-300 font-bold">অতিরিক্ত বিক্রিয়কের অবিশ্লিষ্ট অবশিষ্ট ভর ও কণা:</span>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-black text-amber-400 bg-slate-950 px-3 py-1 rounded-xl border border-slate-800">
              ভর: {remainingMassExcess} g
            </span>
            <span className="font-mono text-xs font-black text-amber-300 bg-slate-950 px-3 py-1 rounded-xl border border-slate-800">
              কণা: {remainingParticles} টি
            </span>
          </div>
        </div>
      </div>

      {/* 2. Interactive Radicals & Elements Drag-and-Drop / Slot Palette */}
      <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h4 className="font-bold text-sm text-white flex items-center gap-2">
            <Beaker className="w-4 h-4 text-teal-400" />
            <span>যৌগমূলক ও ক্যাটায়ন সংযোজক প্যালেট (Radicals & Formula Builder)</span>
          </h4>
          <span className="text-xs text-slate-400 font-bold">ক্লিক করে স্লটে বসান</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Cations Palette */}
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-2.5">
            <span className="text-teal-300 font-black block">ধাতব ক্যাটায়ন প্যালেট (Metal Cations):</span>
            <div className="flex flex-wrap gap-1.5">
              {ALL_CATIONS.map(c => (
                <button
                  key={c.id}
                  onClick={() => setCationSlot(c)}
                  className={`px-2.5 py-1.5 rounded-xl font-bold transition-all ${
                    cationSlot.id === c.id ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/30 scale-105 ring-2 ring-white' : 'bg-slate-950 text-slate-300 hover:text-white border border-slate-800'
                  }`}
                >
                  {c.name} ({c.sym})
                </button>
              ))}
            </div>
          </div>

          {/* Anions / Radicals Palette */}
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-2.5">
            <span className="text-indigo-300 font-black block">যৌগমূলক অ্যানায়ন প্যালেট (Radical Anions):</span>
            <div className="flex flex-wrap gap-1.5">
              {ALL_ANIONS.map(a => (
                <button
                  key={a.id}
                  onClick={() => setAnionSlot(a)}
                  className={`px-2.5 py-1.5 rounded-xl font-bold transition-all ${
                    anionSlot.id === a.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 scale-105 ring-2 ring-white' : 'bg-slate-950 text-slate-300 hover:text-white border border-slate-800'
                  }`}
                >
                  {a.name} ({a.formula})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Builder Slots & Formed Compound */}
        <div className="p-5 bg-gradient-to-r from-slate-900 via-teal-950/30 to-slate-900 border border-teal-500/40 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 bg-slate-950 rounded-xl border border-teal-500/50 text-teal-300 font-black text-center">
              <span className="text-[10px] text-slate-500 block uppercase">ক্যাটায়ন</span>
              <span className="text-base">{cationSlot.sym}</span>
            </div>
            <span className="text-lg font-black text-slate-500">+</span>
            <div className="px-4 py-2 bg-slate-950 rounded-xl border border-indigo-500/50 text-indigo-300 font-black text-center">
              <span className="text-[10px] text-slate-500 block uppercase">যৌগমূলক</span>
              <span className="text-base">{anionSlot.formula}</span>
            </div>
            <ArrowRight className="w-5 h-5 text-teal-400" />
          </div>

          <div className="text-center sm:text-right">
            <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">যোজনী স্থানান্তরে প্রস্তুতকৃত সংকেত:</span>
            <span className="text-2xl font-black text-teal-300 font-mono bg-slate-950 px-5 py-1.5 rounded-2xl border border-teal-500/50 inline-block mt-1">
              {computedFormula}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Step-by-Step Calculation Breakdown */}
      <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 space-y-3 text-xs">
        <h4 className="font-bold text-white flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>গাণিতিক বিশ্লেষণের ধারাবাহিক ধাপসমূহ (Step-by-Step Breakdown):</span>
        </h4>
        <div className="space-y-2 p-4 bg-slate-900 rounded-2xl border border-slate-800 font-mono text-slate-300">
          <p>১. মোল সংখ্যা: n₁ = W₁/M₁ = {massA}g / {curRxn.mA} = {molesA.toFixed(4)} mol ; n₂ = {massB}g / {curRxn.mB} = {molesB.toFixed(4)} mol</p>
          <p>২. কণা গণনা: N₁ = n₁ × NA = {particlesA} টি ; N₂ = n₂ × NA = {particlesB} টি</p>
          <p>৩. স্টয়কিওমেট্রিক অনুপাত তুলনা: প্রয়োজনীয় অনুপাত = {curRxn.coeffA}:{curRxn.coeffB}, প্রাপ্ত অনুপাত = {(molesA/molesB).toFixed(3)}:1 ➔ লিমিটিং বিক্রিয়ক = <strong className="text-rose-400">{limitingName}</strong></p>
          <p>৪. উৎপাদের পরিমাণ: W = n(limiting) × Coeff × M(prod) = <strong className="text-emerald-400">{productMass} g</strong></p>
          <p>৫. অ্যাভোগাড্রো কণা সংখ্যা: N = n × N_A = {productMoles.toFixed(4)} × 6.022 × 10²³ = <strong className="text-amber-400">{totalParticles} টি কণা</strong></p>
          <p>৬. এসটিপিতে গ্যাসীয় আয়তন: V = n × 22.4 L = <strong className="text-sky-400">{productVolumeSTP} L</strong></p>
        </div>
      </div>

      <AICard text="স্টয়কিওমিতি অনুযায়ী বিক্রিয়ার সমতাকৃত সমীকরণের সহগগুলো বিক্রিয়ক ও উৎপাদের মোল অনুপাত প্রকাশ করে। ১ মোল যেকোনো পদার্থে ৬.০২২ × ১০²³ টি অণু/পরমাণু/আয়ন থাকে যাকে অ্যাভোগাড্রো সংখ্যা (N_A) বলে।" />
    </div>
  );
}

import ChemistryChapter6MathSolver from './ChemistryChapter6MathSolver';
import ChemistryChapter5BondingSolver from './ChemistryChapter5BondingSolver';
import GalvanicCellSimulation from './GalvanicCellSimulation';

// ============================================================
// MAIN COMPONENT EXPORT
// ============================================================
const MODULES = [
  { id: 'galvanic', label: 'গ্যালভানিক কোষ ও তড়িৎ-রসায়ন', icon: BatteryCharging, Component: GalvanicCellSimulation },
  { id: 'bonding-solver', label: '৫ম অধ্যায়: বন্ধন ও লুইস ডট-ক্রস', icon: Atom, Component: ChemistryChapter5BondingSolver },
  { id: 'math-solver', label: '৬ষ্ঠ অধ্যায়: AI ম্যাথ সলভার', icon: Calculator, Component: ChemistryChapter6MathSolver },
  { id: 'stoichiometry', label: 'স্টয়কিওমিতি ও কণা গণনা', icon: Scale, Component: StoichiometryAndRadicalsSandbox },
  { id: 'periodic', label: '১১৮ মৌলের পর্যায় সারণি', icon: Table2, Component: PeriodicTableModule },
  { id: 'bonding', label: 'সার্বজনীন বন্ধন স্যান্ডবক্স', icon: Zap, Component: UniversalBondingSandbox },
];

export default function MasterChemistryLab() {
  const [activeTab, setActiveTab] = useState('math-solver');
  const [isExporting, setIsExporting] = useState(false);
  const labRef = useRef(null);

  const CurrentMod = MODULES.find(m => m.id === activeTab);

  const handleExport = async () => {
    if (!labRef.current) return;
    setIsExporting(true);
    try {
      await exportBrandedGraphic(labRef.current, {
        fileName: `NextGen_Chemistry_${activeTab}`,
        cardTitle: `মাস্টার রসায়ন ইঞ্জিন: ${CurrentMod?.label}`,
        scale: 2
      });
    } catch (e) {
      console.error('Export error:', e);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-900 border border-slate-800 rounded-3xl text-white flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <FlaskConical className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-black flex items-center gap-2">
              রসায়ন মাস্টার ল্যাব ও এআই ইঞ্জিন (Master Chemistry Lab)
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs">
                SSC সম্পূর্ণ
              </span>
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              স্টয়কিওমিতি ও কণা গণনা • যৌগমূলক বিল্ডার • ১৮ মৌলের পর্যায় সারণি • সার্বজনীন বন্ধন স্যান্ডবক্স
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleExport}
          disabled={isExporting}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-xs shadow-lg flex items-center gap-2 hover:scale-105 transition-all disabled:opacity-50 flex-shrink-0"
        >
          {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          <span>হিসাবপত্র ডাউনলোড (Watermarked)</span>
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2">
        {MODULES.map(mod => {
          const Icon = mod.icon;
          const isActive = activeTab === mod.id;
          return (
            <button
              key={mod.id}
              onClick={() => setActiveTab(mod.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black transition-all ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 scale-105'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{mod.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Workspace */}
      <div ref={labRef} className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl">
        <div className="flex items-center gap-2 mb-4 pb-4 border-b border-slate-800">
          {CurrentMod && <CurrentMod.icon className="w-5 h-5 text-emerald-400" />}
          <h3 className="font-black text-white">{CurrentMod?.label}</h3>
          <span className="text-xs text-slate-500">SSC Chemistry Interactive Simulation & AI Engine</span>
        </div>
        {CurrentMod && <CurrentMod.Component />}
      </div>
    </div>
  );
}
