import React, { useState, useMemo, useRef } from 'react';
import {
  Battery,
  BatteryCharging,
  Zap,
  Power,
  Lightbulb,
  Download,
  RefreshCw,
  Info,
  Scale,
  Brain,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Eye,
  Loader2,
  Table2,
  Clock
} from 'lucide-react';
import { exportBrandedGraphic } from '../../utils/exportBrandedGraphic';

export default function DryCellSimulation() {
  const [isCircuitClosed, setIsCircuitClosed] = useState(true);
  const [dischargeLevel, setDischargeLevel] = useState(100); // 100% to 0%
  const [selectedLayer, setSelectedLayer] = useState('carbon-rod'); // 'carbon-rod' | 'mno2-mix' | 'nh4cl-paste' | 'zinc-can' | 'brass-cap'
  const [activeTab, setActiveTab] = useState('simulation'); // 'simulation' | 'layers' | 'comparison'
  const [isExporting, setIsExporting] = useState(false);
  const cellRef = useRef(null);

  // Dry Cell Voltage Calculation based on discharge level:
  // Fresh = 1.50V, Mid = 1.30V, Dead = 0.85V
  const cellVoltage = useMemo(() => {
    if (!isCircuitClosed) return '0.00';
    const v = 0.85 + (dischargeLevel / 100) * 0.65;
    return v.toFixed(2);
  }, [isCircuitClosed, dischargeLevel]);

  const bulbGlowPercentage = useMemo(() => {
    if (!isCircuitClosed) return 0;
    return Math.round((dischargeLevel / 100) * 100);
  }, [isCircuitClosed, dischargeLevel]);

  // Layers metadata
  const LAYERS_INFO = {
    'brass-cap': {
      title: 'ধাতব টুপি / ধনাত্মক প্রান্ত (+ Cap)',
      type: 'ক্যাথোড সংযোগস্থল (+)',
      material: 'পিতল / ধাতব ক্যাপ (Brass Top Cap)',
      role: 'বহিঃবর্তনীতে ইলেকট্রন গ্রহণের টার্মিনাল হিসেবে কাজ করে।',
      reaction: 'বহিঃস্থ বর্তনী থেকে ইলেকট্রন গ্রহণ করে গ্রাফাইট দণ্ডে পাঠায়।'
    },
    'carbon-rod': {
      title: 'গ্রাফাইট / কার্বন দণ্ড (Cathode Rod)',
      type: 'ক্যাথোড ইলেকট্রোড (+)',
      material: 'বিশুদ্ধ কার্বন / গ্রাফাইট (Inert Graphite)',
      role: 'নিষ্ক্রিয় তড়িৎদ্বার হিসেবে ইলেকট্রন পরিবহন করে $MnO_2$ মিশ্রণে সরবরাহ করে।',
      reaction: 'ক্যাথোড নিজে ক্ষয়প্রাপ্ত হয় না; এটি ইলেকট্রন পরিবাহী হিসেবে কাজ করে।'
    },
    'mno2-mix': {
      title: 'ম্যাঙ্গানিজ ডাইঅক্সাইড ও কার্বন গুঁড়ার স্তর',
      type: 'ক্যাথোড সংলগ্ন জারক মিশ্রণ (Depolarizer)',
      material: 'ম্যাঙ্গানিজ ডাইঅক্সাইড ($MnO_2$) + কার্বন ব্ল্যাক পাউডার',
      role: 'বিজারণ ঘটিয়ে উৎপন্ন হাইড্রোজেন গ্যাস ও পোলারাইজেশন রোধ করে।',
      reaction: '2MnO₂(s) + 2NH₄⁺(aq) + 2e⁻ → Mn₂O₃(s) + 2NH₃(aq) + H₂O(l)'
    },
    'nh4cl-paste': {
      title: 'অ্যামোনিয়াম ক্লোরাইডের আর্দ্র পেস্ট (Electrolyte Paste)',
      type: 'তড়িৎ-বিশ্লেষ্য পেস্ট (Moist Electrolyte)',
      material: 'NH₄Cl + ZnCl₂ + স্টার্চ / আঠা ও সামান্য পানি',
      role: 'আয়ন চলাচলের মাধ্যমে অভ্যন্তরীণ বর্তনী সচল রাখে এবং শুষ্ক অবস্থায় পেস্ট হিসেবে কাজ করে।',
      reaction: 'ZnCl₂ যুক্ত করায় উৎপন্ন ক্ষতিকর NH₃ গ্যাস [Zn(NH₃)₄]²⁺ জটিল আয়ন হিসেবে দ্রবীভূত হয়।'
    },
    'zinc-can': {
      title: 'দস্তার তৈরি পাত্র / অ্যানোড ঋণাত্মক প্রান্ত (Zinc Anode Can)',
      type: 'অ্যানোড পাত্র (-)',
      material: 'বিশুদ্ধ জিঙ্ক ধাতু ($Zn$ Casing)',
      role: 'কোষের বহিঃস্থ ধারক এবং ইলেকট্রন ত্যাগকারী সক্রিয় অ্যানোড।',
      reaction: 'Zn(s) → Zn²⁺(aq) + 2e⁻  (জিঙ্ক ক্ষয়প্রাপ্ত হয়ে ইলেকট্রন মুক্ত করে)'
    }
  };

  const currentLayer = LAYERS_INFO[selectedLayer] || LAYERS_INFO['carbon-rod'];

  // Export card
  const handleExport = async () => {
    if (!cellRef.current) return;
    setIsExporting(true);
    try {
      await exportBrandedGraphic(cellRef.current, {
        fileName: 'NextGen_Dry_Cell_Simulation',
        cardTitle: 'শুষ্ক কোষ সিমুলেশন (Dry Cell / Leclanché Cell) • E = 1.50V',
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
      <div className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 rounded-3xl shadow-xl text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="p-3.5 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 shadow-inner">
            <Battery className="w-9 h-9 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black text-white">শুষ্ক কোষ ল্যাব ও সিমুলেটর (Dry Cell / Leclanché Cell)</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold font-mono">
                1.50 Volts ⚡
              </span>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              দস্তার পাত্র (অ্যানোড), কেন্দ্রীয় কার্বন দণ্ড (ক্যাথোড), $MnO_2$ ও $NH_4Cl$ পেস্টের অভ্যন্তরীণ ব্যবচ্ছেদ ও রাসায়নিক বিক্রিয়া
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Circuit Switch Toggle */}
          <button
            type="button"
            onClick={() => setIsCircuitClosed(c => !c)}
            className={`px-4 py-2.5 rounded-2xl font-bold text-xs shadow-lg flex items-center gap-2 transition-all hover:scale-105 active:scale-95 ${
              isCircuitClosed
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
                : 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30'
            }`}
          >
            <Power className="w-4 h-4" />
            <span>{isCircuitClosed ? 'সার্কিট অন (Closed ⚡)' : 'সার্কিট অফ (Open ⭕)'}</span>
          </button>

          {/* Reset Standard */}
          <button
            type="button"
            onClick={() => { setDischargeLevel(100); setIsCircuitClosed(true); }}
            className="px-3.5 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold transition-all flex items-center gap-1.5 border border-slate-700"
            title="নতুন ব্যাটারি রিসেট (1.50V)"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>নতুন ব্যাটারি (100%)</span>
          </button>

          {/* Export HD */}
          <button
            type="button"
            onClick={handleExport}
            disabled={isExporting}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
          >
            {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            <span>ডাউনলোড (HD)</span>
          </button>
        </div>
      </div>

      {/* Control Panel Toolbar */}
      <div className="p-5 bg-slate-900 border border-slate-800 rounded-3xl grid grid-cols-1 md:grid-cols-3 gap-4 shadow-xl text-white">
        {/* 1. Discharge Level Slider */}
        <div className="space-y-1.5 p-3.5 bg-slate-950 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-indigo-300 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" /> ব্যাটারি চার্জ / স্থায়িত্ব (Life):
            </span>
            <span className="text-amber-400 font-mono font-black">{dischargeLevel}%</span>
          </div>
          <input
            type="range"
            min="5"
            max="100"
            step="5"
            value={dischargeLevel}
            onChange={(e) => setDischargeLevel(Number(e.target.value))}
            className="w-full accent-indigo-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
          />
          <div className="text-[10px] text-slate-400 flex justify-between font-mono">
            <span>নিঃশেষ (0.85V)</span>
            <span>অর্ধেক (1.20V)</span>
            <span className="text-emerald-400">নতুন (1.50V)</span>
          </div>
        </div>

        {/* 2. Interactive Layer Selector */}
        <div className="space-y-1.5 p-3.5 bg-slate-950 rounded-2xl border border-slate-800">
          <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            ব্যবচ্ছেদ স্তর নির্বাচন (Cross-Section Layer):
          </label>
          <select
            value={selectedLayer}
            onChange={(e) => setSelectedLayer(e.target.value)}
            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
          >
            <option value="brass-cap">১. পিতলের টুপি (ধাতব ধনাত্মক ক্যাপ)</option>
            <option value="carbon-rod">২. কেন্দ্রীয় কার্বন/গ্রাফাইট দণ্ড (ক্যাথোড)</option>
            <option value="mno2-mix">৩. MnO₂ ও কার্বন গুঁড়া স্তর (Depolarizer)</option>
            <option value="nh4cl-paste">৪. NH₄Cl ও ZnCl₂ আর্দ্র পেস্ট (Electrolyte)</option>
            <option value="zinc-can">৫. দস্তার তৈরি চোঙ/পাত্র (অ্যানোড)</option>
          </select>
        </div>

        {/* 3. Sub-Tab Mode Switcher */}
        <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">মোড নির্বাচন:</span>
          <div className="grid grid-cols-2 gap-1.5 text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveTab('simulation')}
              className={`py-1.5 rounded-xl transition-all flex items-center justify-center gap-1 ${
                activeTab === 'simulation' ? 'bg-indigo-600 text-white font-black' : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>সিমুলেশন ভিউ</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('comparison')}
              className={`py-1.5 rounded-xl transition-all flex items-center justify-center gap-1 ${
                activeTab === 'comparison' ? 'bg-purple-600 text-white font-black' : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              <Table2 className="w-3.5 h-3.5" />
              <span>তুলনামূলক ছক</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Vector Simulation Stage */}
      <div
        ref={cellRef}
        className="bg-slate-900 border-2 border-indigo-500/40 rounded-3xl p-6 sm:p-8 text-white shadow-2xl space-y-6 relative overflow-hidden"
      >
        {/* Top Metric Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 bg-slate-950 border border-indigo-500/40 rounded-2xl shadow-inner">
            <span className="text-[10px] text-indigo-300 block font-bold uppercase tracking-wider">
              শুষ্ক কোষ ভোল্টেজ (Voltage):
            </span>
            <span className="text-2xl font-black text-amber-400 font-mono mt-0.5 block flex items-baseline gap-1">
              {cellVoltage} <span className="text-xs text-amber-300 font-bold">Volts</span>
            </span>
            <span className="text-[10px] text-slate-400 font-mono">আদর্শ E = 1.50 V</span>
          </div>

          <div className="p-3.5 bg-slate-950 border border-rose-500/40 rounded-2xl shadow-inner">
            <span className="text-[10px] text-rose-300 block font-bold uppercase tracking-wider">
              অ্যানোড অর্ধ-বিক্রিয়া (Zinc Casing):
            </span>
            <span className="text-base font-black text-rose-300 font-mono mt-1 block truncate">
              Zn(s) → Zn²⁺ + 2e⁻
            </span>
            <span className="text-[10px] text-slate-400 block truncate">দস্তার পাত্র জারিত হয়</span>
          </div>

          <div className="p-3.5 bg-slate-950 border border-cyan-500/40 rounded-2xl shadow-inner">
            <span className="text-[10px] text-cyan-300 block font-bold uppercase tracking-wider">
              ক্যাথোড অর্ধ-বিক্রিয়া (Carbon Rod):
            </span>
            <span className="text-base font-black text-cyan-300 font-mono mt-1 block truncate">
              2MnO₂ + 2NH₄⁺ + 2e⁻ → Mn₂O₃
            </span>
            <span className="text-[10px] text-slate-400 block truncate">+ 2NH₃ + H₂O</span>
          </div>

          <div className="p-3.5 bg-slate-950 border border-emerald-500/40 rounded-2xl shadow-inner">
            <span className="text-[10px] text-emerald-300 block font-bold uppercase tracking-wider">
              লোড / বাল্বের উজ্জ্বলতা:
            </span>
            <div className="flex items-center gap-2 mt-1">
              <Lightbulb
                className="w-6 h-6 transition-all"
                style={{
                  color: isCircuitClosed && bulbGlowPercentage > 0 ? '#fbbf24' : '#64748b',
                  filter: isCircuitClosed && bulbGlowPercentage > 0 ? `drop-shadow(0 0 ${bulbGlowPercentage / 6}px #f59e0b)` : 'none'
                }}
              />
              <span className="text-xl font-black text-emerald-400 font-mono">
                {bulbGlowPercentage}% <span className="text-xs text-slate-400 font-bold font-sans">গ্লো</span>
              </span>
            </div>
            <span className="text-[10px] text-slate-400">প্রাথমিক কোষ (Non-rechargeable)</span>
          </div>
        </div>

        {/* 2D Vector Cross-Section Diagram of Dry Cell */}
        {activeTab === 'simulation' && (
          <div className="relative w-full h-[450px] bg-slate-950 rounded-3xl border border-slate-800 flex items-center justify-center overflow-hidden p-4 shadow-inner">
            <style>{`
              @keyframes dryCellElectronFlow {
                from { stroke-dashoffset: 32; }
                to { stroke-dashoffset: 0; }
              }
            `}</style>

            <svg className="w-full h-full max-w-4xl" viewBox="0 0 800 420" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <filter id="bulbGlowDry" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation={bulbGlowPercentage / 8} result="glow" />
                  <feMerge>
                    <feMergeNode in="glow" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter id="dryEGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="3" result="glow" />
                  <feMerge>
                    <feMergeNode in="glow" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* EXTERNAL CIRCUIT WIRE: FROM ZINC BOTTOM/SIDE TO TOP BRASS CAP */}
              <path
                d="M 330 360 L 150 360 L 150 50 L 370 50"
                stroke="#b45309"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
              <path
                d="M 430 50 L 650 50 L 650 360 L 470 360"
                stroke="#b45309"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
              <path
                d="M 400 50 L 400 80"
                stroke="#fbbf24"
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
              />

              {/* Animated Current Overlay on Circuit */}
              {isCircuitClosed && Number(cellVoltage) > 0 && (
                <>
                  <path
                    d="M 330 360 L 150 360 L 150 50 L 370 50"
                    stroke="#38bdf8"
                    strokeWidth="3"
                    strokeDasharray="8 8"
                    fill="none"
                    style={{ animation: 'dryCellElectronFlow 0.8s linear infinite' }}
                  />
                  <path
                    d="M 430 50 L 650 50 L 650 360 L 470 360"
                    stroke="#38bdf8"
                    strokeWidth="3"
                    strokeDasharray="8 8"
                    fill="none"
                    style={{ animation: 'dryCellElectronFlow 0.8s linear infinite' }}
                  />
                </>
              )}

              {/* Flowing Electron Particles along Left Wire (Zinc to Bulb) */}
              {isCircuitClosed && Number(cellVoltage) > 0 && [0, 0.6, 1.2, 1.8, 2.4].map((delay, idx) => (
                <g key={`left-e-${idx}`}>
                  <circle r="5" fill="#38bdf8" filter="url(#dryEGlow)">
                    <animateMotion
                      dur="3s"
                      repeatCount="indefinite"
                      begin={`${delay}s`}
                      path="M 330 360 L 150 360 L 150 50 L 370 50"
                      calcMode="linear"
                    />
                  </circle>
                  <circle r="2" fill="#ffffff">
                    <animateMotion
                      dur="3s"
                      repeatCount="indefinite"
                      begin={`${delay}s`}
                      path="M 330 360 L 150 360 L 150 50 L 370 50"
                      calcMode="linear"
                    />
                  </circle>
                </g>
              ))}

              {/* VOLTMETER & LIGHT BULB AT TOP */}
              <g transform="translate(360, 20)">
                <rect x="0" y="0" width="80" height="55" rx="12" fill="#0f172a" stroke="#475569" strokeWidth="2" />
                <rect x="10" y="8" width="60" height="22" rx="6" fill="#020617" stroke="#334155" />
                <text x="40" y="24" fill="#38bdf8" fontSize="13" fontWeight="900" textAnchor="middle" fontFamily="monospace">
                  {cellVoltage}V
                </text>
                <text x="40" y="44" fill="#94a3b8" fontSize="9" fontWeight="bold" textAnchor="middle">
                  DRY CELL
                </text>

                {/* Light Bulb */}
                <g transform="translate(40, -25)">
                  {bulbGlowPercentage > 0 && (
                    <circle
                      cx="0"
                      cy="0"
                      r={18 + bulbGlowPercentage / 5}
                      fill="#f59e0b"
                      opacity={bulbGlowPercentage / 180}
                      filter="url(#bulbGlowDry)"
                    />
                  )}
                  <circle
                    cx="0"
                    cy="0"
                    r="14"
                    fill={bulbGlowPercentage > 0 ? '#fbbf24' : '#334155'}
                    stroke="#e2e8f0"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M -4 2 L 0 -5 L 4 2"
                    stroke={bulbGlowPercentage > 0 ? '#fff' : '#64748b'}
                    strokeWidth="1.5"
                    fill="none"
                  />
                  <rect x="-5" y="10" width="10" height="5" fill="#64748b" rx="1" />
                </g>
              </g>

              {/* ========================================================= */}
              {/* DRY CELL CROSS-SECTIONAL CYLINDER STRUCTURE */}
              {/* ========================================================= */}
              <g transform="translate(300, 80)">
                {/* 1. OUTER ZINC ANODE CASING (দস্তার পাত্র) */}
                <rect
                  x="0"
                  y="20"
                  width="200"
                  height="280"
                  rx="14"
                  fill="#64748b"
                  stroke={selectedLayer === 'zinc-can' ? '#f43f5e' : '#475569'}
                  strokeWidth={selectedLayer === 'zinc-can' ? 4 : 2}
                  className="cursor-pointer transition-all"
                  onClick={() => setSelectedLayer('zinc-can')}
                />
                {/* Zinc Bottom Cap Base (-) */}
                <rect x="40" y="295" width="120" height="10" rx="4" fill="#475569" stroke="#334155" />
                <text x="100" y="303" fill="#cbd5e1" fontSize="9" fontWeight="black" textAnchor="middle">
                  নেগেটিভ প্রান্ত (-)
                </text>

                {/* 2. ELECTROLYTE PASTE LAYER (NH4Cl + ZnCl2) */}
                <rect
                  x="14"
                  y="34"
                  width="172"
                  height="250"
                  rx="10"
                  fill="#fef08a"
                  opacity="0.85"
                  stroke={selectedLayer === 'nh4cl-paste' ? '#eab308' : 'none'}
                  strokeWidth="3"
                  className="cursor-pointer transition-all"
                  onClick={() => setSelectedLayer('nh4cl-paste')}
                />

                {/* 3. MnO2 & CARBON POWDER MIXTURE (কালো স্তর) */}
                <rect
                  x="40"
                  y="45"
                  width="120"
                  height="230"
                  rx="8"
                  fill="#1e293b"
                  stroke={selectedLayer === 'mno2-mix' ? '#a855f7' : '#0f172a'}
                  strokeWidth={selectedLayer === 'mno2-mix' ? 3 : 1}
                  className="cursor-pointer transition-all"
                  onClick={() => setSelectedLayer('mno2-mix')}
                />

                {/* 4. CENTRAL GRAPHITE / CARBON CATHODE ROD */}
                <rect
                  x="86"
                  y="10"
                  width="28"
                  height="255"
                  rx="4"
                  fill="#020617"
                  stroke={selectedLayer === 'carbon-rod' ? '#38bdf8' : '#334155'}
                  strokeWidth={selectedLayer === 'carbon-rod' ? 3 : 1.5}
                  className="cursor-pointer transition-all"
                  onClick={() => setSelectedLayer('carbon-rod')}
                />

                {/* 5. TOP BRASS / METAL CAP (+) */}
                <path
                  d="M 80 10 L 80 0 Q 80 -8 88 -8 L 112 -8 Q 120 -8 120 0 L 120 10 Z"
                  fill="#eab308"
                  stroke={selectedLayer === 'brass-cap' ? '#fbbf24' : '#ca8a04'}
                  strokeWidth={selectedLayer === 'brass-cap' ? 3 : 1.5}
                  className="cursor-pointer transition-all"
                  onClick={() => setSelectedLayer('brass-cap')}
                />
                <text x="100" y="2" fill="#78350f" fontSize="8" fontWeight="black" textAnchor="middle">
                  + CAP
                </text>

                {/* Top Pitch / Insulator Seal */}
                <rect x="14" y="20" width="172" height="14" rx="3" fill="#0f172a" opacity="0.9" />

                {/* Microscopic Reaction Particle Indicators */}
                {isCircuitClosed && (
                  <>
                    {/* Dissolving Zn2+ ions at casing */}
                    <circle cx="8" cy="150" r="5" fill="#f43f5e" className="animate-pulse" />
                    <circle cx="192" cy="150" r="5" fill="#f43f5e" className="animate-pulse" />
                    {/* Active Reduction at Carbon/MnO2 boundary */}
                    <circle cx="70" cy="180" r="4" fill="#a855f7" className="animate-ping" opacity="0.7" />
                    <circle cx="130" cy="180" r="4" fill="#a855f7" className="animate-ping" opacity="0.7" />
                  </>
                )}
              </g>

              {/* Callout Labels with Pointers */}
              {/* Left Pointers */}
              <g transform="translate(80, 160)" className="text-xs">
                <line x1="120" y1="0" x2="300" y2="40" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="3 3" />
                <rect x="0" y="-12" width="130" height="24" rx="6" fill="#0f172a" stroke="#f43f5e" strokeWidth="1" />
                <text x="65" y="4" fill="#f43f5e" fontSize="10" fontWeight="bold" textAnchor="middle">
                  দস্তার চোঙ (Zn Anode)
                </text>

                <line x1="120" y1="70" x2="314" y2="90" stroke="#eab308" strokeWidth="1.5" strokeDasharray="3 3" />
                <rect x="0" y="58" width="130" height="24" rx="6" fill="#0f172a" stroke="#eab308" strokeWidth="1" />
                <text x="65" y="74" fill="#fde047" fontSize="10" fontWeight="bold" textAnchor="middle">
                  NH₄Cl আর্দ্র পেস্ট
                </text>
              </g>

              {/* Right Pointers */}
              <g transform="translate(590, 160)" className="text-xs">
                <line x1="0" y1="-30" x2="-190" y2="-70" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="3 3" />
                <rect x="0" y="-42" width="130" height="24" rx="6" fill="#0f172a" stroke="#fbbf24" strokeWidth="1" />
                <text x="65" y="-26" fill="#facc15" fontSize="10" fontWeight="bold" textAnchor="middle">
                  পিতলের টুপি (+ Cap)
                </text>

                <line x1="0" y1="20" x2="-200" y2="0" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3 3" />
                <rect x="0" y="8" width="130" height="24" rx="6" fill="#0f172a" stroke="#38bdf8" strokeWidth="1" />
                <text x="65" y="24" fill="#38bdf8" fontSize="10" fontWeight="bold" textAnchor="middle">
                  কার্বন দণ্ড (Cathode)
                </text>

                <line x1="0" y1="80" x2="-230" y2="40" stroke="#a855f7" strokeWidth="1.5" strokeDasharray="3 3" />
                <rect x="0" y="68" width="130" height="24" rx="6" fill="#0f172a" stroke="#a855f7" strokeWidth="1" />
                <text x="65" y="84" fill="#d8b4fe" fontSize="10" fontWeight="bold" textAnchor="middle">
                  MnO₂ ও কার্বন গুঁড়া
                </text>
              </g>
            </svg>
          </div>
        )}

        {/* Selected Layer Microscopic Chemistry Card */}
        <div className="p-5 rounded-3xl bg-slate-950 border-2 border-indigo-500/50 space-y-3 shadow-inner">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800">
            <div>
              <span className="text-[10px] font-black text-indigo-400 uppercase tracking-wider block">
                নির্বাচিত স্তরের রসায়ন (Selected Layer Chemistry):
              </span>
              <h4 className="text-base font-black text-white">{currentLayer.title}</h4>
            </div>
            <span className="text-xs px-3 py-1 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800 font-mono font-bold w-fit">
              {currentLayer.type}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 block font-bold">উপাদান ও রাসায়নিক ভূমিকা:</span>
              <strong className="text-cyan-300 block">{currentLayer.material}</strong>
              <p className="text-slate-300 text-[11px] leading-relaxed">{currentLayer.role}</p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-900 border border-indigo-500/30 space-y-1">
              <span className="text-[10px] text-indigo-300 block font-bold">সংঘটিত অর্ধ-বিক্রিয়া / কার্যপদ্ধতি:</span>
              <div className="p-2 rounded-xl bg-slate-950 font-mono text-emerald-400 font-bold text-xs">
                {currentLayer.reaction}
              </div>
            </div>
          </div>
        </div>

        {/* Comparison Table: Dry Cell vs Galvanic / Daniell Cell */}
        {activeTab === 'comparison' && (
          <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 space-y-4 shadow-inner">
            <h4 className="font-black text-amber-400 text-xs uppercase tracking-wider flex items-center gap-2">
              <Table2 className="w-4 h-4 text-amber-400" />
              শুষ্ক কোষ বনাম গ্যালভানিক / ড্যানিয়েল কোষ তুলনামূলক বিশ্লেষণ (Comparison)
            </h4>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-mono uppercase text-[10px]">
                    <th className="p-3">বৈশিষ্ট্য (Property)</th>
                    <th className="p-3 text-indigo-400">শুষ্ক কোষ (Dry Cell)</th>
                    <th className="p-3 text-cyan-400">ড্যানিয়েল কোষ (Daniell Cell)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-200">
                  <tr className="hover:bg-slate-900/50">
                    <td className="p-3 font-bold text-white">১. তড়িৎ-বিশ্লেষ্যের অবস্থা</td>
                    <td className="p-3 text-indigo-200">আর্দ্র পেস্ট (Moist Paste of NH₄Cl + ZnCl₂)</td>
                    <td className="p-3 text-cyan-200">তরল দ্রবণ (Liquid Solutions of ZnSO₄ & CuSO₄)</td>
                  </tr>
                  <tr className="hover:bg-slate-900/50">
                    <td className="p-3 font-bold text-white">২. বহনযোগ্যতা (Portability)</td>
                    <td className="p-3 text-emerald-300 font-bold">সহজে যেকোনো যন্ত্রে বহনযোগ্য (Leak-proof)</td>
                    <td className="p-3 text-rose-300">তরল পড়ে যাওয়ার ঝুঁকি থাকায় বহন করা কঠিন</td>
                  </tr>
                  <tr className="hover:bg-slate-900/50">
                    <td className="p-3 font-bold text-white">৩. কোষ বিভব (Voltage)</td>
                    <td className="p-3 font-mono font-bold text-amber-300">১.৫০ ভোল্ট (1.50 V)</td>
                    <td className="p-3 font-mono font-bold text-amber-300">১.১০ ভোল্ট (1.10 V)</td>
                  </tr>
                  <tr className="hover:bg-slate-900/50">
                    <td className="p-3 font-bold text-white">৪. অ্যানোড ধাতু</td>
                    <td className="p-3 font-mono">দস্তার পাত্র / চোঙ (Zn Can)</td>
                    <td className="p-3 font-mono">জিঙ্ক দণ্ড (Zn Rod in ZnSO₄)</td>
                  </tr>
                  <tr className="hover:bg-slate-900/50">
                    <td className="p-3 font-bold text-white">৫. ক্যাথোড পদার্থ</td>
                    <td className="p-3 font-mono">গ্রাফাইট দণ্ড + MnO₂ পাউডার</td>
                    <td className="p-3 font-mono">কপার দণ্ড (Cu Rod in CuSO₄)</td>
                  </tr>
                  <tr className="hover:bg-slate-900/50">
                    <td className="p-3 font-bold text-white">৬. রিচার্জযোগ্যতা</td>
                    <td className="p-3 text-slate-400">প্রাথমিক কোষ (Non-rechargeable)</td>
                    <td className="p-3 text-slate-400">প্রাথমিক গ্যালভানিক কোষ</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Electrochemistry Equations Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <h4 className="font-black text-amber-400 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              শুষ্ক কোষের বিক্রিয়াসমূহ (Chemical Reactions)
            </h4>
            <div className="space-y-2 font-mono text-slate-300">
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-rose-400 font-bold block text-[10px]">অ্যানোড জারণ (Oxidation at Zinc Can):</span>
                <span className="text-white font-bold">Zn(s) → Zn²⁺(aq) + 2e⁻</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-cyan-400 font-bold block text-[10px]">ক্যাথোড বিজারণ (Reduction at Carbon/MnO₂):</span>
                <span className="text-white font-bold">2MnO₂(s) + 2NH₄⁺(aq) + 2e⁻ → Mn₂O₃(s) + 2NH₃(aq) + H₂O(l)</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-indigo-500/40">
                <span className="text-indigo-300 font-bold block text-[10px]">গ্যাস প্রতিরোধক জটিল আয়ন গঠন (Ammonia Trapping):</span>
                <span className="text-emerald-300 font-bold">Zn²⁺ + 4NH₃ → [Zn(NH₃)₄]²⁺</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <h4 className="font-black text-cyan-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              শুষ্ক কোষের সুবিধা ও সতর্কতা (NCTB Notes)
            </h4>
            <ul className="space-y-2 text-slate-300 text-[11px] leading-relaxed">
              <li className="p-2 rounded-xl bg-slate-900 border border-slate-800/80">
                <strong className="text-white block">১. আর্দ্র পেস্টের সুবিধা:</strong>
                তরল দ্রবণের পরিবর্তে আর্দ্র পেস্ট ব্যবহার করায় এটি টর্চলাইট, রিমোট, ঘড়িতে সহজে ব্যবহার করা যায়।
              </li>
              <li className="p-2 rounded-xl bg-slate-900 border border-slate-800/80">
                <strong className="text-white block">২. জারণে পাত্র ক্ষয়:</strong>
                অ্যানোড নিজেই পাত্র হওয়ায় দীর্ঘদিন ব্যবহারে দস্তা ফুটো হয়ে পেস্ট বের হতে পারে, তাই মেয়াদোত্তীর্ণ ব্যাটারি ডিভাইস থেকে সরানো উচিত।
              </li>
            </ul>
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
