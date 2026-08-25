import React, { useState, useMemo, useRef } from 'react';
import {
  Zap,
  BatteryCharging,
  Power,
  RotateCcw,
  Sparkles,
  Sliders,
  Download,
  Brain,
  Layers,
  HelpCircle,
  TrendingUp,
  Activity,
  Award,
  Info,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  Flame,
  Loader2
} from 'lucide-react';
import { exportBrandedGraphic } from '../../utils/exportBrandedGraphic';

// Standard Reduction Potentials (E°red in Volts) & Physical properties
const ANODE_METALS = [
  {
    id: 'Mg',
    nameBn: 'ম্যাগনেসিয়াম (Mg)',
    nameEn: 'Magnesium',
    sym: 'Mg',
    ion: 'Mg²⁺',
    n: 2,
    e0_red: -2.372,
    color: '#cbd5e1', // Silvery gray
    solColor: 'rgba(226, 232, 240, 0.25)', // Clear/light gray
    saltName: 'MgSO₄',
    oxHalf: 'Mg(s) → Mg²⁺(aq) + 2e⁻',
    desc: 'অতি সক্রিয় বিজারক ধাতু; তীব্র তড়িৎ বিভব সৃষ্টি করে।'
  },
  {
    id: 'Al',
    nameBn: 'অ্যালুমিনিয়াম (Al)',
    nameEn: 'Aluminium',
    sym: 'Al',
    ion: 'Al³⁺',
    n: 3,
    e0_red: -1.662,
    color: '#94a3b8', // Silver
    solColor: 'rgba(203, 213, 225, 0.25)',
    saltName: 'Al(NO₃)₃',
    oxHalf: 'Al(s) → Al³⁺(aq) + 3e⁻',
    desc: '৩টি ইলেকট্রন ত্যাগ করে জারিত হয়; উচ্চ সেল ভোল্টেজ প্রদান করে।'
  },
  {
    id: 'Zn',
    nameBn: 'জিঙ্ক / দস্তা (Zn)',
    nameEn: 'Zinc',
    sym: 'Zn',
    ion: 'Zn²⁺',
    n: 2,
    e0_red: -0.762,
    color: '#a1a1aa', // Bluish zinc gray
    solColor: 'rgba(212, 212, 216, 0.25)', // Colorless ZnSO4
    saltName: 'ZnSO₄',
    oxHalf: 'Zn(s) → Zn²⁺(aq) + 2e⁻',
    desc: 'চিরায়ত ড্যানিয়েল কোষের আদর্শ অ্যানোড ইলেক্ট্রোড।'
  },
  {
    id: 'Fe',
    nameBn: 'আয়রন / লোহা (Fe)',
    nameEn: 'Iron',
    sym: 'Fe',
    ion: 'Fe²⁺',
    n: 2,
    e0_red: -0.440,
    color: '#64748b', // Dark iron slate
    solColor: 'rgba(187, 247, 208, 0.35)', // Pale green FeSO4
    saltName: 'FeSO₄',
    oxHalf: 'Fe(s) → Fe²⁺(aq) + 2e⁻',
    desc: 'লোহা ক্ষয় হয়ে Fe²⁺ দ্রবণে মুক্ত হয় ও ইলেকট্রন অ্যানোড তারে পাঠায়।'
  },
  {
    id: 'Pb',
    nameBn: 'লেড / সীসা (Pb)',
    nameEn: 'Lead',
    sym: 'Pb',
    ion: 'Pb²⁺',
    n: 2,
    e0_red: -0.126,
    color: '#475569', // Slate
    solColor: 'rgba(241, 245, 249, 0.25)',
    saltName: 'Pb(NO₃)₂',
    oxHalf: 'Pb(s) → Pb²⁺(aq) + 2e⁻',
    desc: 'লেড এসিড ব্যাটারির গুরুত্বপূর্ণ অ্যানোড উপাদান।'
  }
];

const CATHODE_METALS = [
  {
    id: 'Cu',
    nameBn: 'কপার / তামা (Cu)',
    nameEn: 'Copper',
    sym: 'Cu',
    ion: 'Cu²⁺',
    n: 2,
    e0_red: 0.340,
    color: '#f97316', // Metallic copper reddish-orange
    solColor: 'rgba(14, 165, 233, 0.55)', // Vibrant blue CuSO4
    saltName: 'CuSO₄',
    redHalf: 'Cu²⁺(aq) + 2e⁻ → Cu(s)',
    desc: 'তামার ক্যাথোড দণ্ডে Cu²⁺ আয়ন ইলেকট্রন গ্রহণ করে ধাতব তামা হিসেবে জমা হয়।'
  },
  {
    id: 'Ag',
    nameBn: 'সিলভার / রূপা (Ag)',
    nameEn: 'Silver',
    sym: 'Ag',
    ion: 'Ag⁺',
    n: 1,
    e0_red: 0.800,
    color: '#e2e8f0', // Shiny Silver
    solColor: 'rgba(248, 250, 252, 0.25)', // Colorless AgNO3
    saltName: 'AgNO₃',
    redHalf: 'Ag⁺(aq) + e⁻ → Ag(s)',
    desc: 'উচ্চ বিজারণ বিভববিশিষ্ট অভিজাত ধাতু; ক্যাথোড দণ্ড দ্রুত রুপালি আস্তরণ পায়।'
  },
  {
    id: 'Ni',
    nameBn: 'নিকেল (Ni)',
    nameEn: 'Nickel',
    sym: 'Ni',
    ion: 'Ni²⁺',
    n: 2,
    e0_red: -0.257,
    color: '#94a3b8',
    solColor: 'rgba(34, 197, 94, 0.45)', // Emerald green NiSO4
    saltName: 'NiSO₄',
    redHalf: 'Ni²⁺(aq) + 2e⁻ → Ni(s)',
    desc: 'নিকেল ক্যাটায়ন বিজারিত হয়ে ক্যাথোড পৃষ্ঠে সঞ্চিত হয়।'
  },
  {
    id: 'Au',
    nameBn: 'গোল্ড / স্বর্ণ (Au)',
    nameEn: 'Gold',
    sym: 'Au',
    ion: 'Au³⁺',
    n: 3,
    e0_red: 1.500,
    color: '#fbbf24', // Golden yellow
    solColor: 'rgba(254, 240, 138, 0.4)', // Golden yellow solution
    saltName: 'AuCl₃',
    redHalf: 'Au³⁺(aq) + 3e⁻ → Au(s)',
    desc: 'সর্বোচ্চ বিজারণ বিভব ও শক্তিশালী ক্যাথোড কার্যক্ষমতা।'
  }
];

const SALT_BRIDGES = [
  { id: 'KNO3', name: 'পটাশিয়াম নাইট্রেট (KNO₃)', cation: 'K⁺', anion: 'NO₃⁻', desc: 'আয়ন দুটির গতিবেগ প্রায় সমান হওয়ায় তরল সংযোগ বিভব সর্বনিম্ন থাকে।' },
  { id: 'KCl', name: 'পটাশিয়াম ক্লোরাইড (KCl)', cation: 'K⁺', anion: 'Cl⁻', desc: 'বহুল ব্যবহৃত লবণ সেতু তড়িৎ-বিশ্লেষ্য (Ag⁺ দ্রবণ ছাড়া)।' },
  { id: 'NH4NO3', name: 'অ্যামোনিয়াম নাইট্রেট (NH₄NO₃)', cation: 'NH₄⁺', anion: 'NO₃⁻', desc: 'আয়নিক ভারসাম্য রক্ষায় অত্যন্ত কার্যকরী।' }
];

export default function GalvanicCellSimulation() {
  const [anodeId, setAnodeId] = useState('Zn');
  const [cathodeId, setCathodeId] = useState('Cu');
  const [anodeConc, setAnodeConc] = useState(1.0); // 1.0 M
  const [cathodeConc, setCathodeConc] = useState(1.0); // 1.0 M
  const [saltBridgeId, setSaltBridgeId] = useState('KNO3');
  const [isCircuitClosed, setIsCircuitClosed] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const cellRef = useRef(null);

  // Selected Metal Objects
  const anode = useMemo(() => ANODE_METALS.find(m => m.id === anodeId) || ANODE_METALS[2], [anodeId]);
  const cathode = useMemo(() => CATHODE_METALS.find(m => m.id === cathodeId) || CATHODE_METALS[0], [cathodeId]);
  const saltBridge = useMemo(() => SALT_BRIDGES.find(s => s.id === saltBridgeId) || SALT_BRIDGES[0], [saltBridgeId]);

  // Standard Cell EMF: E°cell = E°cathode - E°anode
  const e0_cell = useMemo(() => {
    return +(cathode.e0_red - anode.e0_red).toFixed(3);
  }, [anode, cathode]);

  // Real-time Cell Potential using Nernst Equation (at 298 K, 25°C):
  // E_cell = E°_cell - (0.0592 / n) * log10([Anode] / [Cathode])
  const e_cell = useMemo(() => {
    if (!isCircuitClosed) return 0;
    const n = Math.max(anode.n, cathode.n);
    const qRatio = anodeConc / Math.max(0.001, cathodeConc);
    const nernstFactor = (0.0592 / n) * Math.log10(qRatio);
    const voltage = e0_cell - nernstFactor;
    return +(Math.max(0, voltage)).toFixed(3);
  }, [e0_cell, anodeConc, cathodeConc, isCircuitClosed, anode.n, cathode.n]);

  // Bulb Glow Intensity & Color (0% to 100%)
  const bulbGlowPercentage = useMemo(() => {
    if (!isCircuitClosed || e_cell <= 0) return 0;
    return Math.min(100, Math.round((e_cell / 3.0) * 100));
  }, [e_cell, isCircuitClosed]);

  // Handle Export Graphic
  const handleExport = async () => {
    if (!cellRef.current) return;
    setIsExporting(true);
    try {
      await exportBrandedGraphic(cellRef.current, {
        fileName: `NextGen_Galvanic_Cell_${anode.sym}_${cathode.sym}`,
        cardTitle: `ইন্টারেক্টিভ গ্যালভানিক কোষ: ${anode.sym}-${cathode.sym} (E = ${e_cell}V)`,
        scale: 2
      });
    } catch (err) {
      console.error('Export error:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header Banner */}
      <div className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-3xl shadow-xl text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="p-3.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 shadow-inner">
            <BatteryCharging className="w-9 h-9 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black text-white">ইন্টারেক্টিভ গ্যালভানিক কোষ ও তড়িৎ-রাসায়নিক সিমুলেটর</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold font-mono">
                Galvanic & Nernst Lab ⚡
              </span>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              রিয়েল-টাইম ইলেক্ট্রোড মেটিরিয়াল পরিবর্তন, দ্রবণ ঘনমাত্রা নিয়ন্ত্রণ, ইলেকট্রন প্রবাহ, সল্ট ব্রিজ আয়ন মাইগ্রেশন ও নার্নস্ট সমীকরণ সেল বিভব গণনা
            </p>
          </div>
        </div>

        {/* Action Buttons: Circuit Switch & Graphic Export */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsCircuitClosed(c => !c)}
            className={`px-4 py-2.5 rounded-2xl border font-black text-xs flex items-center gap-2 transition-all ${
              isCircuitClosed
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-400 shadow-lg shadow-emerald-600/30'
                : 'bg-rose-950/60 hover:bg-rose-900 text-rose-300 border-rose-500/40'
            }`}
          >
            <Power className="w-4 h-4" />
            <span>{isCircuitClosed ? 'সার্কিট অন (Closed ⚡)' : 'সার্কিট অফ (Open ⭕)'}</span>
          </button>

          <button
            type="button"
            onClick={handleExport}
            disabled={isExporting}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-cyan-600/30 flex items-center gap-2 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
          >
            {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            <span>ডাউনলোড (HD)</span>
          </button>
        </div>
      </div>

      {/* Control Panel Toolbar */}
      <div className="p-5 bg-slate-900 border border-slate-800 rounded-3xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 shadow-xl text-white">
        {/* 1. Anode Metal Selector */}
        <div className="space-y-1.5 p-3.5 bg-slate-950 rounded-2xl border border-slate-800">
          <label className="text-xs font-black text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500 inline-block animate-pulse"></span>
            অ্যানোড ধাতু নির্বাচন (Anode - Negative)
          </label>
          <select
            value={anodeId}
            onChange={(e) => setAnodeId(e.target.value)}
            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-rose-500 font-mono"
          >
            {ANODE_METALS.map((m) => (
              <option key={m.id} value={m.id}>
                {m.nameBn} • E°={m.e0_red}V
              </option>
            ))}
          </select>
          <div className="text-[11px] text-slate-400 font-mono flex justify-between pt-1">
            <span>E°(ox) = {(-anode.e0_red).toFixed(3)} V</span>
            <span className="text-rose-300 font-bold">{anode.saltName}</span>
          </div>
        </div>

        {/* 2. Cathode Metal Selector */}
        <div className="space-y-1.5 p-3.5 bg-slate-950 rounded-2xl border border-slate-800">
          <label className="text-xs font-black text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-500 inline-block animate-pulse"></span>
            ক্যাথোড ধাতু নির্বাচন (Cathode - Positive)
          </label>
          <select
            value={cathodeId}
            onChange={(e) => setCathodeId(e.target.value)}
            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono"
          >
            {CATHODE_METALS.map((m) => (
              <option key={m.id} value={m.id}>
                {m.nameBn} • E°=+{m.e0_red}V
              </option>
            ))}
          </select>
          <div className="text-[11px] text-slate-400 font-mono flex justify-between pt-1">
            <span>E°(red) = {cathode.e0_red > 0 ? `+${cathode.e0_red}` : cathode.e0_red} V</span>
            <span className="text-cyan-300 font-bold">{cathode.saltName}</span>
          </div>
        </div>

        {/* 3. Anode Concentration Slider */}
        <div className="space-y-1.5 p-3.5 bg-slate-950 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-slate-300">অ্যানোড দ্রবণ [{anode.ion}]:</span>
            <span className="text-rose-400 font-mono font-black">{anodeConc} M</span>
          </div>
          <input
            type="range"
            min="0.01"
            max="2.50"
            step="0.05"
            value={anodeConc}
            onChange={(e) => setAnodeConc(Number(e.target.value))}
            className="w-full accent-rose-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
          />
          <div className="text-[10px] text-slate-500 flex justify-between font-mono">
            <span>0.01 M</span>
            <span>1.0 M (Standard)</span>
            <span>2.5 M</span>
          </div>
        </div>

        {/* 4. Cathode Concentration Slider & Salt Bridge */}
        <div className="space-y-1.5 p-3.5 bg-slate-950 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-slate-300">ক্যাথোড দ্রবণ [{cathode.ion}]:</span>
            <span className="text-cyan-400 font-mono font-black">{cathodeConc} M</span>
          </div>
          <input
            type="range"
            min="0.01"
            max="2.50"
            step="0.05"
            value={cathodeConc}
            onChange={(e) => setCathodeConc(Number(e.target.value))}
            className="w-full accent-cyan-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
          />
          <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
            <span>লবণ সেতু:</span>
            <select
              value={saltBridgeId}
              onChange={(e) => setSaltBridgeId(e.target.value)}
              className="bg-slate-900 text-amber-300 font-bold border border-slate-700 rounded px-1.5 py-0.5 text-[10px] focus:outline-none"
            >
              {SALT_BRIDGES.map(s => (
                <option key={s.id} value={s.id}>{s.id}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Dynamic Vector Simulation Stage */}
      <div
        ref={cellRef}
        className="bg-slate-900 border-2 border-amber-500/40 rounded-3xl p-6 sm:p-8 text-white shadow-2xl space-y-6 relative overflow-hidden"
      >
        {/* Top Metric Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 bg-slate-950 border border-amber-500/40 rounded-2xl shadow-inner">
            <span className="text-[10px] text-amber-300 block font-bold uppercase tracking-wider">
              তড়িৎ-চালক বল (Cell EMF - E_cell):
            </span>
            <span className="text-2xl font-black text-amber-400 font-mono mt-0.5 block flex items-baseline gap-1">
              {e_cell} <span className="text-xs text-amber-300 font-bold">Volts</span>
            </span>
            <span className="text-[10px] text-slate-400 font-mono">আদর্শ E° = {e0_cell} V</span>
          </div>

          <div className="p-3.5 bg-slate-950 border border-rose-500/40 rounded-2xl shadow-inner">
            <span className="text-[10px] text-rose-300 block font-bold uppercase tracking-wider">
              অ্যানোড অর্ধ-কোষ (Oxidation):
            </span>
            <span className="text-base font-black text-rose-300 font-mono mt-1 block truncate">
              {anode.sym} / {anode.ion}
            </span>
            <span className="text-[10px] text-slate-400 block truncate">{anode.oxHalf}</span>
          </div>

          <div className="p-3.5 bg-slate-950 border border-cyan-500/40 rounded-2xl shadow-inner">
            <span className="text-[10px] text-cyan-300 block font-bold uppercase tracking-wider">
              ক্যাথোড অর্ধ-কোষ (Reduction):
            </span>
            <span className="text-base font-black text-cyan-300 font-mono mt-1 block truncate">
              {cathode.ion} / {cathode.sym}
            </span>
            <span className="text-[10px] text-slate-400 block truncate">{cathode.redHalf}</span>
          </div>

          <div className="p-3.5 bg-slate-950 border border-emerald-500/40 rounded-2xl shadow-inner">
            <span className="text-[10px] text-emerald-300 block font-bold uppercase tracking-wider">
              বাল্ব উজ্জ্বলতা ও শক্তি আউটপুট:
            </span>
            <div className="flex items-center gap-2 mt-1">
              <Lightbulb
                className="w-6 h-6 transition-all"
                style={{
                  color: isCircuitClosed && e_cell > 0 ? '#fbbf24' : '#64748b',
                  filter: isCircuitClosed && e_cell > 0 ? `drop-shadow(0 0 ${bulbGlowPercentage / 6}px #f59e0b)` : 'none'
                }}
              />
              <span className="text-xl font-black text-emerald-400 font-mono">
                {bulbGlowPercentage}% <span className="text-xs text-slate-400 font-bold font-sans">গ্লো</span>
              </span>
            </div>
            <span className="text-[10px] text-slate-400">স্বতঃস্ফূর্ত বিক্রিয়া (ΔG &lt; 0)</span>
          </div>
        </div>

        {/* 2D / 2.5D Animated Galvanic Cell SVG Canvas */}
        <div className="relative w-full h-[400px] bg-slate-950 rounded-3xl border border-slate-800 flex items-center justify-center overflow-hidden p-4 shadow-inner">
          <svg className="w-full h-full max-w-4xl" viewBox="0 0 800 400" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              {/* Glow Filters */}
              <filter id="bulbGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation={isCircuitClosed && e_cell > 0 ? bulbGlowPercentage / 8 : 0} result="glow" />
                <feMerge>
                  <feMergeNode in="glow" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <linearGradient id="anodeGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={anode.color} />
                <stop offset="100%" stopColor="#475569" />
              </linearGradient>
              <linearGradient id="cathodeGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={cathode.color} />
                <stop offset="100%" stopColor="#7c2d12" />
              </linearGradient>
            </defs>

            {/* EXTERNAL CIRCUIT WIRE */}
            {/* Left Wire: Anode to Voltmeter/Bulb */}
            <path
              d="M 180 180 L 180 50 L 370 50"
              stroke="#fbbf24"
              strokeWidth="4"
              strokeLinecap="round"
            />
            {/* Right Wire: Bulb/Voltmeter to Cathode */}
            <path
              d="M 430 50 L 620 50 L 620 180"
              stroke="#fbbf24"
              strokeWidth="4"
              strokeLinecap="round"
            />

            {/* Animated Electrons in Wire (Moving Left to Right) */}
            {isCircuitClosed && e_cell > 0 && (
              <>
                <circle cx="210" cy="50" r="4" fill="#38bdf8" className="animate-ping" opacity="0.8" />
                <circle cx="270" cy="50" r="4" fill="#38bdf8" className="animate-pulse" />
                <circle cx="330" cy="50" r="4" fill="#38bdf8" />
                <circle cx="470" cy="50" r="4" fill="#38bdf8" />
                <circle cx="530" cy="50" r="4" fill="#38bdf8" className="animate-pulse" />
                <circle cx="590" cy="50" r="4" fill="#38bdf8" className="animate-ping" opacity="0.8" />
                <text x="280" y="40" fill="#38bdf8" fontSize="11" fontWeight="bold" fontFamily="monospace">
                  ইলেকট্রন প্রবাহ (e⁻ →)
                </text>
              </>
            )}

            {/* CENTRAL VOLTMETER & LIGHT BULB */}
            <g transform="translate(360, 20)">
              {/* Meter Box */}
              <rect x="0" y="0" width="80" height="55" rx="12" fill="#0f172a" stroke="#475569" strokeWidth="2" />
              {/* LCD Display */}
              <rect x="10" y="8" width="60" height="22" rx="6" fill="#020617" stroke="#334155" />
              <text x="40" y="24" fill="#38bdf8" fontSize="13" fontWeight="900" textAnchor="middle" fontFamily="monospace">
                {e_cell}V
              </text>
              <text x="40" y="44" fill="#94a3b8" fontSize="9" fontWeight="bold" textAnchor="middle">
                VOLTMETER
              </text>

              {/* Light Bulb */}
              <g transform="translate(40, -25)">
                {/* Glow Halo */}
                {isCircuitClosed && e_cell > 0 && (
                  <circle
                    cx="0"
                    cy="0"
                    r={18 + bulbGlowPercentage / 5}
                    fill="#f59e0b"
                    opacity={bulbGlowPercentage / 180}
                    filter="url(#bulbGlow)"
                  />
                )}
                {/* Bulb Glass */}
                <circle
                  cx="0"
                  cy="0"
                  r="14"
                  fill={isCircuitClosed && e_cell > 0 ? '#fbbf24' : '#334155'}
                  stroke="#e2e8f0"
                  strokeWidth="1.5"
                />
                {/* Filament */}
                <path
                  d="M -4 2 L 0 -5 L 4 2"
                  stroke={isCircuitClosed && e_cell > 0 ? '#fff' : '#64748b'}
                  strokeWidth="1.5"
                  fill="none"
                />
                <rect x="-5" y="10" width="10" height="5" fill="#64748b" rx="1" />
              </g>
            </g>

            {/* LEFT BEAKER: ANODE HALF-CELL */}
            <g transform="translate(100, 150)">
              {/* Glass Beaker Container */}
              <rect x="0" y="0" width="160" height="210" rx="16" fill="rgba(15, 23, 42, 0.6)" stroke="#475569" strokeWidth="2.5" />
              
              {/* Liquid Solution */}
              <rect x="4" y="50" width="152" height="154" rx="12" fill={anode.solColor} />

              {/* Anode Metal Electrode Bar */}
              <rect
                x="65"
                y="10"
                width="30"
                height="150"
                rx="4"
                fill="url(#anodeGrad)"
                stroke="#64748b"
                strokeWidth="1.5"
              />

              {/* Anode Label */}
              <text x="80" y="-12" fill="#f43f5e" fontSize="13" fontWeight="900" textAnchor="middle">
                অ্যানোড (-) [{anode.sym}]
              </text>
              <text x="80" y="190" fill="#f8fafc" fontSize="11" fontWeight="bold" textAnchor="middle">
                {anode.saltName} ({anodeConc}M)
              </text>

              {/* Anode Reaction Ions Dissolving (Zn -> Zn2+ + 2e-) */}
              {isCircuitClosed && e_cell > 0 && (
                <g className="animate-pulse">
                  <circle cx="50" cy="110" r="10" fill="#f43f5e" opacity="0.3" />
                  <text x="50" y="113" fill="#fda4af" fontSize="9" fontWeight="bold" textAnchor="middle">{anode.ion}</text>
                  <circle cx="110" cy="130" r="10" fill="#f43f5e" opacity="0.3" />
                  <text x="110" y="133" fill="#fda4af" fontSize="9" fontWeight="bold" textAnchor="middle">{anode.ion}</text>
                </g>
              )}
            </g>

            {/* RIGHT BEAKER: CATHODE HALF-CELL */}
            <g transform="translate(540, 150)">
              {/* Glass Beaker Container */}
              <rect x="0" y="0" width="160" height="210" rx="16" fill="rgba(15, 23, 42, 0.6)" stroke="#475569" strokeWidth="2.5" />
              
              {/* Liquid Solution */}
              <rect x="4" y="50" width="152" height="154" rx="12" fill={cathode.solColor} />

              {/* Cathode Metal Electrode Bar */}
              <rect
                x="65"
                y="10"
                width="30"
                height="150"
                rx="4"
                fill="url(#cathodeGrad)"
                stroke="#ea580c"
                strokeWidth="1.5"
              />

              {/* Cathode Label */}
              <text x="80" y="-12" fill="#38bdf8" fontSize="13" fontWeight="900" textAnchor="middle">
                ক্যাথোড (+) [{cathode.sym}]
              </text>
              <text x="80" y="190" fill="#f8fafc" fontSize="11" fontWeight="bold" textAnchor="middle">
                {cathode.saltName} ({cathodeConc}M)
              </text>

              {/* Cathode Reaction Ions Depositing (Cu2+ + 2e- -> Cu) */}
              {isCircuitClosed && e_cell > 0 && (
                <g className="animate-pulse">
                  <circle cx="50" cy="120" r="10" fill="#38bdf8" opacity="0.4" />
                  <text x="50" y="123" fill="#bae6fd" fontSize="9" fontWeight="bold" textAnchor="middle">{cathode.ion}</text>
                  <circle cx="110" cy="100" r="10" fill="#38bdf8" opacity="0.4" />
                  <text x="110" y="103" fill="#bae6fd" fontSize="9" fontWeight="bold" textAnchor="middle">{cathode.ion}</text>
                </g>
              )}
            </g>

            {/* U-TUBE SALT BRIDGE (connecting left and right beakers) */}
            <g transform="translate(230, 135)">
              {/* Inverted U-Shape Tube */}
              <path
                d="M 15 130 L 15 25 Q 15 0 40 0 L 300 0 Q 325 0 325 25 L 325 130"
                fill="none"
                stroke="#64748b"
                strokeWidth="24"
                strokeLinecap="round"
              />
              {/* Gel Interior */}
              <path
                d="M 15 130 L 15 25 Q 15 0 40 0 L 300 0 Q 325 0 325 130"
                fill="none"
                stroke="#fef08a"
                strokeWidth="16"
                strokeLinecap="round"
                opacity="0.85"
              />

              {/* Salt Bridge Label */}
              <rect x="110" y="-14" width="120" height="22" rx="8" fill="#0f172a" stroke="#eab308" strokeWidth="1.5" />
              <text x="170" y="1" fill="#facc15" fontSize="10" fontWeight="bold" textAnchor="middle">
                লবণ সেতু ({saltBridge.id})
              </text>

              {/* Anion Migration (Left to Anode) and Cation Migration (Right to Cathode) */}
              {isCircuitClosed && e_cell > 0 && (
                <>
                  {/* NO3- / Cl- flowing Left towards Anode */}
                  <text x="65" y="16" fill="#f43f5e" fontSize="9" fontWeight="black" textAnchor="middle">
                    ← {saltBridge.anion}
                  </text>
                  {/* K+ flowing Right towards Cathode */}
                  <text x="275" y="16" fill="#38bdf8" fontSize="9" fontWeight="black" textAnchor="middle">
                    {saltBridge.cation} →
                  </text>
                </>
              )}
            </g>
          </svg>
        </div>

        {/* Electrochemistry Equations & Comprehensive Analysis */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Reaction Equations Card */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <h4 className="font-black text-amber-400 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              কোষ বিক্রিয়া ও তড়িৎ-রাসায়নিক সমীকরণ (Redox Reactions)
            </h4>
            <div className="space-y-2 font-mono text-xs">
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-rose-400 font-bold block text-[10px]">অ্যানোড জারণ অর্ধ-বিক্রিয়া (Oxidation):</span>
                <span className="text-white font-bold">{anode.oxHalf}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-cyan-400 font-bold block text-[10px]">ক্যাথোড বিজারণ অর্ধ-বিক্রিয়া (Reduction):</span>
                <span className="text-white font-bold">{cathode.redHalf}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-emerald-500/30">
                <span className="text-emerald-400 font-bold block text-[10px]">সামগ্রিক কোষ বিক্রিয়া (Net Cell Reaction):</span>
                <span className="text-emerald-200 font-bold">
                  {anode.sym}(s) + {cathode.sym}{cathode.n === 1 ? '⁺' : '²⁺'}(aq) → {anode.sym}{anode.n === 1 ? '⁺' : '²⁺'}(aq) + {cathode.sym}(s)
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 font-bold block text-[10px]">কোষ সংকেত (Cell Notation):</span>
                <span className="text-cyan-300 font-bold">
                  {anode.sym}(s) | {anode.ion}(aq, {anodeConc}M) || {cathode.ion}(aq, {cathodeConc}M) | {cathode.sym}(s)
                </span>
              </div>
            </div>
          </div>

          {/* NCTB Exam Keynotes & Nernst Principle */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <h4 className="font-black text-emerald-400 flex items-center gap-2">
              <Brain className="w-4 h-4 text-emerald-400" />
              বোর্ড পরীক্ষার স্মার্ট গাইড ও নার্নস্ট তত্ত্ব (Nernst Law)
            </h4>
            <div className="space-y-2 text-[11px] leading-relaxed text-slate-300">
              <p className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <strong className="text-white block mb-0.5">📌 নার্নস্ট সমীকরণ (২৫°C এ):</strong>
                <code className="text-amber-300 font-mono block">E_cell = E°_cell - (0.0592 / n) × log₁₀([অ্যানোড] / [ক্যাথোড])</code>
              </p>
              <p className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <strong className="text-cyan-300 block mb-0.5">💡 ঘনমাত্রার প্রভাব:</strong>
                ক্যাথোড দ্রবণের ঘনমাত্রা বৃদ্ধি পেলে বা অ্যানোড দ্রবণের ঘনমাত্রা হ্রাস পেলে কোষের বিভব (Voltage) বৃদ্ধি পায়।
              </p>
              <p className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <strong className="text-rose-300 block mb-0.5">🌉 লবণ সেতুর গুরুত্ব:</strong>
                লবণ সেতু উভয় অর্ধ-কোষের তড়িৎ নিরপেক্ষতা রক্ষা করে এবং বর্তনীকে সম্পূর্ণ করে বিদ্যুৎ প্রবাহ অব্যাহত রাখে।
              </p>
            </div>
          </div>
        </div>

        {/* Footer Academy Branding */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <span>NextGen Academy • পরিচালক: মো: আলমগীর হোসেন (সাগর) • ০১৭৯২৮১৮০০৫</span>
          <span>পশ্চিম জয়দেবপুর, গাজীপুর • LEARN · GROW · SUCCEED</span>
        </div>
      </div>
    </div>
  );
}
