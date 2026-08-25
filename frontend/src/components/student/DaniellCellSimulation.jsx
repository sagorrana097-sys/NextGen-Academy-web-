import React, { useState, useMemo, useRef } from 'react';
import {
  BatteryCharging,
  Zap,
  Rotate3d,
  Lightbulb,
  Download,
  Power,
  Play,
  Pause,
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
  Loader2
} from 'lucide-react';
import { exportBrandedGraphic } from '../../utils/exportBrandedGraphic';

export default function DaniellCellSimulation() {
  // Simulation Controls State
  const [isCircuitClosed, setIsCircuitClosed] = useState(true);
  const [hasSaltBridge, setHasSaltBridge] = useState(true);
  const [znConc, setZnConc] = useState(1.0); // 0.01M to 2.0M Zn2+
  const [cuConc, setCuConc] = useState(1.0); // 0.01M to 2.0M Cu2+
  const [activeTab, setActiveTab] = useState('simulation'); // 'simulation' | 'microscopic' | 'theory'
  const [isExporting, setIsExporting] = useState(false);
  const cellRef = useRef(null);

  // Standard Standard EMF: E0(Zn2+/Zn) = -0.76V, E0(Cu2+/Cu) = +0.34V
  const E0_CELL = 1.10;

  // Real-time Nernst Equation Cell Potential Calculation:
  // E_cell = E0_cell - (0.0592 / 2) * log10([Zn2+] / [Cu2+])
  const cellMetrics = useMemo(() => {
    if (!isCircuitClosed || !hasSaltBridge) {
      return {
        e_cell: '0.00',
        e0_cell: '1.10',
        deltaG: '0.0',
        bulbGlow: 0,
        status: !hasSaltBridge ? 'লবণ সেতু অনুপস্থিত (সার্কিট বিচ্ছিন্ন)' : 'সার্কিট অফ (Open Circuit)',
        statusType: 'off'
      };
    }

    const Q = znConc / cuConc;
    const nernstE = E0_CELL - (0.0592 / 2) * Math.log10(Q);
    const effectiveE = Math.max(0, nernstE);

    // Delta G = -n * F * E_cell (kJ/mol)
    // n = 2, F = 96485 C/mol
    const deltaGVal = -2 * 96.485 * effectiveE;

    // Bulb glow percentage (0 to 100%)
    const glow = Math.min(100, Math.max(0, Math.round((effectiveE / 1.3) * 100)));

    return {
      e_cell: effectiveE.toFixed(3),
      e0_cell: E0_CELL.toFixed(2),
      deltaG: deltaGVal.toFixed(1),
      bulbGlow: glow,
      status: effectiveE > 0 ? 'স্বতঃস্ফূর্ত বিদ্যুৎ উৎপাদন চলমান (Active)' : 'সাম্যাবস্থায় উপনীত (E=0V)',
      statusType: effectiveE > 0 ? 'active' : 'equilibrium'
    };
  }, [isCircuitClosed, hasSaltBridge, znConc, cuConc]);

  // Reset to Standard Daniell Cell (1.0M / 1.0M)
  const handleResetStandard = () => {
    setZnConc(1.0);
    setCuConc(1.0);
    setHasSaltBridge(true);
    setIsCircuitClosed(true);
  };

  // Export card
  const handleExport = async () => {
    if (!cellRef.current) return;
    setIsExporting(true);
    try {
      await exportBrandedGraphic(cellRef.current, {
        fileName: 'NextGen_Daniell_Cell_Simulation',
        cardTitle: 'আদর্শ ড্যানিয়েল কোষ (Daniell Cell Simulation) • E° = 1.10V',
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
      <div className="p-6 bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-900 border border-slate-800 rounded-3xl shadow-xl text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="p-3.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 shadow-inner">
            <BatteryCharging className="w-9 h-9 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black text-white">আদর্শ ড্যানিয়েল কোষ ল্যাব (Daniell Cell Simulator)</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold font-mono">
                E°cell = 1.10 V ⚡
              </span>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              জিঙ্ক ও কপার তড়িৎদ্বার, লবণ সেতু আয়ন পরিবহন এবং ইলেকট্রন প্রবাহের ডায়নামিক সায়েন্টিফিক সিমুলেটর
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
            onClick={handleResetStandard}
            className="px-3.5 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold transition-all flex items-center gap-1.5 border border-slate-700"
            title="আদর্শ ড্যানিয়েল কোষে ফিরে যান (1.0M/1.0M)"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>আদর্শ রূপ (1.10V)</span>
          </button>

          {/* Export HD */}
          <button
            type="button"
            onClick={handleExport}
            disabled={isExporting}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-xs shadow-lg shadow-amber-600/30 flex items-center gap-2 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
          >
            {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            <span>ডাউনলোড (HD)</span>
          </button>
        </div>
      </div>

      {/* Control Panel Toolbar */}
      <div className="p-5 bg-slate-900 border border-slate-800 rounded-3xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 shadow-xl text-white">
        {/* 1. Anode Info & Concentration */}
        <div className="space-y-1.5 p-3.5 bg-slate-950 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-rose-400 font-mono">অ্যানোড [Zn²⁺] দ্রবণ:</span>
            <span className="text-rose-400 font-mono font-black">{znConc} M</span>
          </div>
          <input
            type="range"
            min="0.01"
            max="2.00"
            step="0.05"
            value={znConc}
            onChange={(e) => setZnConc(Number(e.target.value))}
            className="w-full accent-rose-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
          />
          <div className="text-[10px] text-slate-400 flex justify-between font-mono">
            <span>ZnSO₄ (জারণ)</span>
            <span className="text-rose-300 font-bold">E°(ox) = +0.76V</span>
          </div>
        </div>

        {/* 2. Cathode Info & Concentration */}
        <div className="space-y-1.5 p-3.5 bg-slate-950 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-cyan-400 font-mono">ক্যাথোড [Cu²⁺] দ্রবণ:</span>
            <span className="text-cyan-400 font-mono font-black">{cuConc} M</span>
          </div>
          <input
            type="range"
            min="0.01"
            max="2.00"
            step="0.05"
            value={cuConc}
            onChange={(e) => setCuConc(Number(e.target.value))}
            className="w-full accent-cyan-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
          />
          <div className="text-[10px] text-slate-400 flex justify-between font-mono">
            <span>CuSO₄ (বিজারণ)</span>
            <span className="text-cyan-300 font-bold">E°(red) = +0.34V</span>
          </div>
        </div>

        {/* 3. Salt Bridge Toggle */}
        <div className="space-y-2 p-3.5 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-300">লবণ সেতু (Salt Bridge):</span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              hasSaltBridge ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-rose-950 text-rose-300 border border-rose-800'
            }`}>
              {hasSaltBridge ? 'সংযুক্ত (KCl)' : 'বিচ্ছিন্ন (Removed)'}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setHasSaltBridge(s => !s)}
            className={`w-full py-1.5 rounded-xl text-xs font-bold transition-all ${
              hasSaltBridge ? 'bg-slate-800 text-amber-400 hover:bg-slate-700' : 'bg-amber-600 text-white shadow-md'
            }`}
          >
            {hasSaltBridge ? 'লবণ সেতু অপসারণ করুন' : 'লবণ সেতু পুনঃস্থাপন করুন'}
          </button>
        </div>

        {/* 4. Sub-Tab Switcher */}
        <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">ভিউ মোড নির্বাচন:</span>
          <div className="grid grid-cols-2 gap-1.5 text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveTab('simulation')}
              className={`py-1.5 rounded-xl transition-all flex items-center justify-center gap-1 ${
                activeTab === 'simulation' ? 'bg-amber-600 text-white font-black' : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              <BatteryCharging className="w-3.5 h-3.5" />
              <span>মূল বর্তনী</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('microscopic')}
              className={`py-1.5 rounded-xl transition-all flex items-center justify-center gap-1 ${
                activeTab === 'microscopic' ? 'bg-cyan-600 text-white font-black' : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>আণবিক জুম</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Simulation Stage Card */}
      <div
        ref={cellRef}
        className="bg-slate-900 border-2 border-amber-500/40 rounded-3xl p-6 sm:p-8 text-white shadow-2xl space-y-6 relative overflow-hidden"
      >
        {/* Top Metric Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 bg-slate-950 border border-amber-500/40 rounded-2xl shadow-inner">
            <span className="text-[10px] text-amber-300 block font-bold uppercase tracking-wider">
              ড্যানিয়েল সেল ভোল্টেজ (E_cell):
            </span>
            <span className="text-2xl font-black text-amber-400 font-mono mt-0.5 block flex items-baseline gap-1">
              {cellMetrics.e_cell} <span className="text-xs text-amber-300 font-bold">Volts</span>
            </span>
            <span className="text-[10px] text-slate-400 font-mono">আদর্শ E° = 1.10 V</span>
          </div>

          <div className="p-3.5 bg-slate-950 border border-rose-500/40 rounded-2xl shadow-inner">
            <span className="text-[10px] text-rose-300 block font-bold uppercase tracking-wider">
              অ্যানোড অর্ধ-বিক্রিয়া (Oxidation):
            </span>
            <span className="text-base font-black text-rose-300 font-mono mt-1 block truncate">
              Zn(s) → Zn²⁺ + 2e⁻
            </span>
            <span className="text-[10px] text-slate-400 block truncate">ইলেকট্রন ত্যাগ (ক্ষয়প্রাপ্ত হয়)</span>
          </div>

          <div className="p-3.5 bg-slate-950 border border-cyan-500/40 rounded-2xl shadow-inner">
            <span className="text-[10px] text-cyan-300 block font-bold uppercase tracking-wider">
              ক্যাথোড অর্ধ-বিক্রিয়া (Reduction):
            </span>
            <span className="text-base font-black text-cyan-300 font-mono mt-1 block truncate">
              Cu²⁺ + 2e⁻ → Cu(s)
            </span>
            <span className="text-[10px] text-slate-400 block truncate">ইলেকট্রন গ্রহণ (সঞ্চিত হয়)</span>
          </div>

          <div className="p-3.5 bg-slate-950 border border-emerald-500/40 rounded-2xl shadow-inner">
            <span className="text-[10px] text-emerald-300 block font-bold uppercase tracking-wider">
              মুক্ত শক্তি পরিবর্তন (ΔG°):
            </span>
            <span className="text-xl font-black text-emerald-400 font-mono mt-1 block">
              {cellMetrics.deltaG} <span className="text-xs text-slate-400">kJ/mol</span>
            </span>
            <span className="text-[10px] text-slate-400">ΔG &lt; 0 (স্বতঃস্ফূর্ত বিক্রিয়া)</span>
          </div>
        </div>

        {/* 2D Vector Circuit Simulation Canvas */}
        {activeTab === 'simulation' && (
          <div className="relative w-full h-[420px] bg-slate-950 rounded-3xl border border-slate-800 flex items-center justify-center overflow-hidden p-4 shadow-inner">
            <style>{`
              @keyframes electronDashFlow {
                from { stroke-dashoffset: 32; }
                to { stroke-dashoffset: 0; }
              }
            `}</style>

            <svg className="w-full h-full max-w-4xl" viewBox="0 0 800 400" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <filter id="bulbGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation={cellMetrics.bulbGlow / 8} result="glow" />
                  <feMerge>
                    <feMergeNode in="glow" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter id="eGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="3" result="glow" />
                  <feMerge>
                    <feMergeNode in="glow" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <linearGradient id="znGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#94a3b8" />
                  <stop offset="100%" stopColor="#475569" />
                </linearGradient>
                <linearGradient id="cuGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#f97316" />
                  <stop offset="100%" stopColor="#9a3412" />
                </linearGradient>
              </defs>

              {/* EXTERNAL CIRCUIT COPPER WIRE */}
              <path
                d="M 180 160 L 180 50 L 620 50 L 620 160"
                stroke="#b45309"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
              <path
                d="M 180 160 L 180 50 L 620 50 L 620 160"
                stroke="#fbbf24"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />

              {/* Animated Current Overlay Track */}
              {isCircuitClosed && hasSaltBridge && Number(cellMetrics.e_cell) > 0 && (
                <path
                  d="M 180 160 L 180 50 L 620 50 L 620 160"
                  stroke="#38bdf8"
                  strokeWidth="3"
                  strokeDasharray="8 8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                  style={{ animation: 'electronDashFlow 0.8s linear infinite' }}
                />
              )}

              {/* 10 Continuous Flowing Electron Particles along Wire */}
              {isCircuitClosed && hasSaltBridge && Number(cellMetrics.e_cell) > 0 && [0, 0.4, 0.8, 1.2, 1.6, 2.0, 2.4, 2.8, 3.2, 3.6].map((delay, idx) => (
                <g key={idx}>
                  <circle r="6.5" fill="#0284c7" opacity="0.6">
                    <animateMotion
                      dur="4s"
                      repeatCount="indefinite"
                      begin={`${delay}s`}
                      path="M 180 160 L 180 50 L 620 50 L 620 160"
                      calcMode="linear"
                    />
                  </circle>
                  <circle r="4.5" fill="#38bdf8" filter="url(#eGlow)">
                    <animateMotion
                      dur="4s"
                      repeatCount="indefinite"
                      begin={`${delay}s`}
                      path="M 180 160 L 180 50 L 620 50 L 620 160"
                      calcMode="linear"
                    />
                  </circle>
                  <circle r="2" fill="#ffffff">
                    <animateMotion
                      dur="4s"
                      repeatCount="indefinite"
                      begin={`${delay}s`}
                      path="M 180 160 L 180 50 L 620 50 L 620 160"
                      calcMode="linear"
                    />
                  </circle>
                </g>
              ))}

              {/* Direction Badges */}
              {isCircuitClosed && hasSaltBridge && (
                <>
                  <rect x="200" y="24" width="150" height="20" rx="6" fill="#0f172a" stroke="#38bdf8" strokeWidth="1" />
                  <text x="275" y="38" fill="#38bdf8" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                    ইলেকট্রন প্রবাহ (e⁻ ➔ ➔)
                  </text>

                  <rect x="450" y="24" width="155" height="20" rx="6" fill="#0f172a" stroke="#f59e0b" strokeWidth="1" />
                  <text x="527" y="38" fill="#fbbf24" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                    বিদ্যুৎ প্রবাহ (I ⬅ ⬅)
                  </text>
                </>
              )}

              {/* CENTRAL VOLTMETER & LIGHT BULB */}
              <g transform="translate(360, 20)">
                <rect x="0" y="0" width="80" height="55" rx="12" fill="#0f172a" stroke="#475569" strokeWidth="2" />
                <rect x="10" y="8" width="60" height="22" rx="6" fill="#020617" stroke="#334155" />
                <text x="40" y="24" fill="#38bdf8" fontSize="13" fontWeight="900" textAnchor="middle" fontFamily="monospace">
                  {cellMetrics.e_cell}V
                </text>
                <text x="40" y="44" fill="#94a3b8" fontSize="9" fontWeight="bold" textAnchor="middle">
                  DANIELL CELL
                </text>

                {/* Light Bulb */}
                <g transform="translate(40, -25)">
                  {cellMetrics.bulbGlow > 0 && (
                    <circle
                      cx="0"
                      cy="0"
                      r={18 + cellMetrics.bulbGlow / 5}
                      fill="#f59e0b"
                      opacity={cellMetrics.bulbGlow / 180}
                      filter="url(#bulbGlow)"
                    />
                  )}
                  <circle
                    cx="0"
                    cy="0"
                    r="14"
                    fill={cellMetrics.bulbGlow > 0 ? '#fbbf24' : '#334155'}
                    stroke="#e2e8f0"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M -4 2 L 0 -5 L 4 2"
                    stroke={cellMetrics.bulbGlow > 0 ? '#fff' : '#64748b'}
                    strokeWidth="1.5"
                    fill="none"
                  />
                  <rect x="-5" y="10" width="10" height="5" fill="#64748b" rx="1" />
                </g>
              </g>

              {/* LEFT BEAKER: ZINC ANODE HALF-CELL */}
              <g transform="translate(100, 150)">
                <rect x="0" y="0" width="160" height="210" rx="16" fill="rgba(15, 23, 42, 0.6)" stroke="#475569" strokeWidth="2.5" />
                <rect x="4" y="50" width="152" height="154" rx="12" fill="rgba(148, 163, 184, 0.2)" />

                {/* Zinc Electrode Bar */}
                <rect
                  x="65"
                  y="10"
                  width="30"
                  height="150"
                  rx="4"
                  fill="url(#znGrad)"
                  stroke="#64748b"
                  strokeWidth="1.5"
                />

                <text x="80" y="-12" fill="#f43f5e" fontSize="13" fontWeight="900" textAnchor="middle">
                  অ্যানোড (-) [Zn দণ্ড]
                </text>
                <text x="80" y="190" fill="#f8fafc" fontSize="11" fontWeight="bold" textAnchor="middle">
                  ZnSO₄ দ্রবণ ({znConc}M)
                </text>

                {/* Zn2+ dissolving ions */}
                {isCircuitClosed && hasSaltBridge && (
                  <g className="animate-pulse">
                    <circle cx="48" cy="105" r="10" fill="#f43f5e" opacity="0.35" />
                    <text x="48" y="108" fill="#fda4af" fontSize="9" fontWeight="bold" textAnchor="middle">Zn²⁺</text>
                    <circle cx="112" cy="125" r="10" fill="#f43f5e" opacity="0.35" />
                    <text x="112" y="128" fill="#fda4af" fontSize="9" fontWeight="bold" textAnchor="middle">Zn²⁺</text>
                  </g>
                )}
              </g>

              {/* RIGHT BEAKER: COPPER CATHODE HALF-CELL */}
              <g transform="translate(540, 150)">
                <rect x="0" y="0" width="160" height="210" rx="16" fill="rgba(15, 23, 42, 0.6)" stroke="#475569" strokeWidth="2.5" />
                <rect x="4" y="50" width="152" height="154" rx="12" fill="rgba(14, 165, 233, 0.35)" />

                {/* Copper Electrode Bar */}
                <rect
                  x="65"
                  y="10"
                  width="30"
                  height="150"
                  rx="4"
                  fill="url(#cuGrad)"
                  stroke="#c2410c"
                  strokeWidth="1.5"
                />

                <text x="80" y="-12" fill="#38bdf8" fontSize="13" fontWeight="900" textAnchor="middle">
                  ক্যাথোড (+) [Cu দণ্ড]
                </text>
                <text x="80" y="190" fill="#f8fafc" fontSize="11" fontWeight="bold" textAnchor="middle">
                  CuSO₄ দ্রবণ ({cuConc}M)
                </text>

                {/* Cu2+ depositing ions */}
                {isCircuitClosed && hasSaltBridge && (
                  <g className="animate-pulse">
                    <circle cx="50" cy="115" r="10" fill="#38bdf8" opacity="0.4" />
                    <text x="50" y="118" fill="#bae6fd" fontSize="9" fontWeight="bold" textAnchor="middle">Cu²⁺</text>
                    <circle cx="110" cy="95" r="10" fill="#38bdf8" opacity="0.4" />
                    <text x="110" y="98" fill="#bae6fd" fontSize="9" fontWeight="bold" textAnchor="middle">Cu²⁺</text>
                  </g>
                )}
              </g>

              {/* U-TUBE SALT BRIDGE (KCl) */}
              {hasSaltBridge ? (
                <g transform="translate(230, 135)">
                  <path
                    d="M 15 130 L 15 25 Q 15 0 40 0 L 300 0 Q 325 0 325 25 L 325 130"
                    fill="none"
                    stroke="#64748b"
                    strokeWidth="24"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 15 130 L 15 25 Q 15 0 40 0 L 300 0 Q 325 0 325 130"
                    fill="none"
                    stroke="#fef08a"
                    strokeWidth="16"
                    strokeLinecap="round"
                    opacity="0.85"
                  />

                  <rect x="110" y="-14" width="120" height="22" rx="8" fill="#0f172a" stroke="#eab308" strokeWidth="1.5" />
                  <text x="170" y="1" fill="#facc15" fontSize="10" fontWeight="bold" textAnchor="middle">
                    লবণ সেতু (KCl)
                  </text>

                  {isCircuitClosed && (
                    <>
                      <text x="65" y="16" fill="#f43f5e" fontSize="9" fontWeight="black" textAnchor="middle">
                        ← Cl⁻ (অ্যানায়ন)
                      </text>
                      <text x="275" y="16" fill="#38bdf8" fontSize="9" fontWeight="black" textAnchor="middle">
                        (ক্যাটায়ন) K⁺ →
                      </text>

                      {/* Moving Cl- Anions Leftwards */}
                      {[0, 1.5, 3.0].map((delay, idx) => (
                        <circle key={`anion-${idx}`} r="4" fill="#f43f5e">
                          <animateMotion
                            dur="4.5s"
                            repeatCount="indefinite"
                            begin={`${delay}s`}
                            path="M 325 110 L 325 25 Q 325 0 300 0 L 40 0 Q 15 0 15 25 L 15 110"
                            calcMode="linear"
                          />
                        </circle>
                      ))}

                      {/* Moving K+ Cations Rightwards */}
                      {[0.75, 2.25, 3.75].map((delay, idx) => (
                        <circle key={`cation-${idx}`} r="4" fill="#38bdf8">
                          <animateMotion
                            dur="4.5s"
                            repeatCount="indefinite"
                            begin={`${delay}s`}
                            path="M 15 110 L 15 25 Q 15 0 40 0 L 300 0 Q 325 0 325 25 L 325 110"
                            calcMode="linear"
                          />
                        </circle>
                      ))}
                    </>
                  )}
                </g>
              ) : (
                <g transform="translate(340, 160)">
                  <rect x="0" y="0" width="120" height="30" rx="8" fill="#450a0a" stroke="#f43f5e" strokeWidth="1.5" />
                  <text x="60" y="19" fill="#fca5a5" fontSize="10" fontWeight="bold" textAnchor="middle">
                    ⚠️ লবণ সেতু বিচ্ছিন্ন
                  </text>
                </g>
              )}
            </svg>
          </div>
        )}

        {/* Microscopic Interface Zoom Lens Mode */}
        {activeTab === 'microscopic' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Anode Microscopic Interface */}
            <div className="p-6 rounded-3xl bg-slate-950 border-2 border-rose-500/50 space-y-4 shadow-inner">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-black text-rose-400 uppercase tracking-wider">
                  অ্যানোড পৃষ্ঠে জুম ভিউ (Zn Oxidation Interface)
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-950 text-rose-300 font-mono">
                  জারণ প্রক্রিয়া
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-2">
                <div className="text-xl font-mono font-black text-rose-400">
                  Zn(s) → Zn²⁺(aq) + 2e⁻
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  জিঙ্ক পরমাণু ২টি ইলেকট্রন তড়িৎদ্বারে মুক্ত করে নিজে ক্যাটায়ন (Zn²⁺) হিসেবে দ্রবণে দ্রবীভূত হয়। ফলে অ্যানোড দণ্ডটির ভর ক্রমশ হ্রাস পায়।
                </p>
              </div>
              <div className="text-xs text-slate-400 space-y-1 font-mono">
                <div className="flex justify-between"><span>আদর্শ জারণ বিভব:</span> <strong className="text-white">+0.76 V</strong></div>
                <div className="flex justify-between"><span>লবণ সেতু হতে আগত:</span> <strong className="text-rose-400">Cl⁻ অ্যানায়ন (চার্জ প্রশমনে)</strong></div>
              </div>
            </div>

            {/* Cathode Microscopic Interface */}
            <div className="p-6 rounded-3xl bg-slate-950 border-2 border-cyan-500/50 space-y-4 shadow-inner">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-black text-cyan-400 uppercase tracking-wider">
                  ক্যাথোড পৃষ্ঠে জুম ভিউ (Cu Reduction Interface)
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 font-mono">
                  বিজারণ প্রক্রিয়া
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-2">
                <div className="text-xl font-mono font-black text-cyan-400">
                  Cu²⁺(aq) + 2e⁻ → Cu(s)
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  দ্রবণে থাকা কপার আয়ন (Cu²⁺) তড়িৎদ্বার হতে ২টি ইলেকট্রন গ্রহণ করে ধাতব কপার (Cu) হিসেবে দণ্ডের গায়ে জমা হয়। ফলে ক্যাথোড দণ্ডটি ভারী ও স্থূল হয়।
                </p>
              </div>
              <div className="text-xs text-slate-400 space-y-1 font-mono">
                <div className="flex justify-between"><span>আদর্শ বিজারণ বিভব:</span> <strong className="text-white">+0.34 V</strong></div>
                <div className="flex justify-between"><span>লবণ সেতু হতে আগত:</span> <strong className="text-cyan-400">K⁺ ক্যাটায়ন (চার্জ প্রশমনে)</strong></div>
              </div>
            </div>
          </div>
        )}

        {/* Electrochemistry Equations & NCTB Board Keynotes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Reaction Equations Card */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <h4 className="font-black text-amber-400 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              ড্যানিয়েল কোষ বিক্রিয়া ও সেল সংকেত (Cell Equations)
            </h4>
            <div className="space-y-2 font-mono text-slate-300">
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-rose-400 font-bold block text-[10px]">জারণ অর্ধ-বিক্রিয়া (অ্যানোড):</span>
                <span className="text-white font-bold">Zn(s) → Zn²⁺(aq) + 2e⁻  [E°_ox = +0.76 V]</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-cyan-400 font-bold block text-[10px]">বিজারণ অর্ধ-বিক্রিয়া (ক্যাথোড):</span>
                <span className="text-white font-bold">Cu²⁺(aq) + 2e⁻ → Cu(s)  [E°_red = +0.34 V]</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-amber-500/40">
                <span className="text-amber-400 font-bold block text-[10px]">সামগ্রিক কোষ বিক্রিয়া (Net Cell Reaction):</span>
                <span className="text-amber-200 font-bold">Zn(s) + Cu²⁺(aq) → Zn²⁺(aq) + Cu(s)  [E°_cell = 1.10 V]</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 font-bold block text-[10px]">কোষ সংকেত (IUPAC Cell Notation):</span>
                <span className="text-emerald-400 font-bold">Zn(s) | Zn²⁺({znConc}M) || Cu²⁺({cuConc}M) | Cu(s)</span>
              </div>
            </div>
          </div>

          {/* Functions of Salt Bridge & Theory Card */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <h4 className="font-black text-cyan-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              লবণ সেতুর কাজ ও ড্যানিয়েল কোষের মূলনীতি (NCTB Notes)
            </h4>
            <ul className="space-y-2 text-slate-300 text-[11px] leading-relaxed">
              <li className="p-2 rounded-xl bg-slate-900 border border-slate-800/80">
                <strong className="text-white block">১. তড়িৎ নিরপেক্ষতা রক্ষা:</strong>
                অ্যানোডে অতিরিক্ত Zn²⁺ কে Cl⁻ আয়ন এবং ক্যাথোডে Cu²⁺ হ্রাসে ঘাটতি পূরণ করতে K⁺ আয়ন দ্রবণে প্রবেশ করে তড়িৎ নিরপেক্ষ রাখে।
              </li>
              <li className="p-2 rounded-xl bg-slate-900 border border-slate-800/80">
                <strong className="text-white block">২. বর্তনী পূর্ণকরণ (Circuit Completion):</strong>
                লবণ সেতু দুই অর্ধকোষের তরল সংযোগের সংযোগ বিভব (Liquid Junction Potential) হ্রাস করে অভ্যন্তরীণ বর্তনী সচল রাখে।
              </li>
              <li className="p-2 rounded-xl bg-slate-900 border border-slate-800/80">
                <strong className="text-white block">৩. রাসায়নিক শক্তি থেকে তড়িৎ শক্তি:</strong>
                স্বতঃস্ফূর্ত রেডক্স বিক্রিয়ার মুক্ত শক্তি (ΔG° = -212.3 kJ/mol) সরাসরি বিদ্যুৎ শক্তিতে রূপান্তরিত হয়।
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
