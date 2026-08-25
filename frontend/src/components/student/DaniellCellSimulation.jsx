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
  Loader2,
  Atom,
  HelpCircle
} from 'lucide-react';
import { exportBrandedGraphic } from '../../utils/exportBrandedGraphic';

export default function DaniellCellSimulation() {
  // Standard Daniell Cell strictly uses Zn Anode in ZnSO4 and Cu Cathode in CuSO4
  const [znConc, setZnConc] = useState(1.0); // 1.0 M ZnSO4
  const [cuConc, setCuConc] = useState(1.0); // 1.0 M CuSO4
  const [hasSaltBridge, setHasSaltBridge] = useState(true);
  const [isCircuitClosed, setIsCircuitClosed] = useState(true);
  const [isZoomMode, setIsZoomMode] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const cellRef = useRef(null);

  // Standard Constants for Daniell Cell
  const E0_ANODE_OX = 0.762; // Zn(s) -> Zn2+(aq) + 2e-
  const E0_CATHODE_RED = 0.340; // Cu2+(aq) + 2e- -> Cu(s)
  const E0_CELL = E0_ANODE_OX + E0_CATHODE_RED; // Exactly 1.102 V (Standard 1.10 V)

  // Nernst Equation Calculation:
  // E_cell = E0_cell - (0.0592 / n) * log10([Zn2+] / [Cu2+])
  const simulationMetrics = useMemo(() => {
    if (!isCircuitClosed || !hasSaltBridge) {
      return {
        e_cell: '0.000',
        e0_cell: E0_CELL.toFixed(2),
        deltaG: '0.0',
        bulbGlow: 0,
        status: !hasSaltBridge
          ? 'লবণ সেতু অনুপস্থিত! অভ্যন্তরীণ বর্তনী ছিন্ন (E = 0V)'
          : 'সার্কিট খোলা (Open Circuit - কারেন্ট বন্ধ)',
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
              <h2 className="text-2xl font-black text-white">আদর্শ ড্যানিয়েল কোষ ল্যাব (Classic Daniell Cell Simulator)</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold font-mono">
                E°cell = 1.10 V • Zn-Cu Benchmark ⚡
              </span>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              চিরায়ত জিংক-কপার ($Zn-Cu$) তড়িৎদ্বার, বর্ণহীন $ZnSO_4$ ও নীল $CuSO_4$ দ্রবণ এবং $KCl$ লবণ সেতুর ইন্টারঅ্যাক্টিভ সিমুলেটর
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
            title="আদর্শ ড্যানিয়েল কোষে ফিরে যান (1.0M/1.0M, E°=1.10V)"
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

      {/* Educational Distinction Banner (Daniell is a specific Galvanic Cell) */}
      <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/40 text-amber-200 text-xs flex items-start gap-3 shadow-lg">
        <Info className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-amber-300 text-sm">
            💡 গুরুত্বপূর্ণ বৈজ্ঞানিক পার্থক্য: ড্যানিয়েল কোষ বনাম সাধারণ গ্যালভানিক কোষ
          </p>
          <p className="text-slate-300 leading-relaxed">
            <strong className="text-amber-400">"সকল ড্যানিয়েল কোষই গ্যালভানিক কোষ, কিন্তু সকল গ্যালভানিক কোষ ড্যানিয়েল কোষ নয়।"</strong> ড্যানিয়েল কোষ হলো গ্যালভানিক কোষ পরিবারের সবচেয়ে আদর্শ ও সুনির্দিষ্ট মডেল—যার অ্যানোড সর্বদাই <strong className="text-rose-400">ZnSO₄ দ্রবণে Zn দণ্ড</strong> এবং ক্যাথোড সর্বদাই <strong className="text-cyan-400">CuSO₄ দ্রবণে Cu দণ্ড</strong>। প্রমাণ অবস্থায় এর কোষ বিভব নির্দিষ্টভাবে <strong className="text-white font-mono font-bold">১.১০ ভোল্ট (1.10 V)</strong>।
          </p>
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
            <span>ZnSO₄ (দস্তা দণ্ড)</span>
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
            <span>CuSO₄ (তামা দণ্ড)</span>
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
            {hasSaltBridge ? '❌ সেতু বিচ্ছিন্ন করুন' : '✅ সেতু সংযুক্ত করুন'}
          </button>
        </div>

        {/* 4. Microscopic Atomic Zoom Toggle */}
        <div className="space-y-2 p-3.5 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-300">ইন্টারফেস জুম:</span>
            <span className="text-[10px] font-mono text-slate-400 font-bold">
              {isZoomMode ? 'আণবিক ভিউ (On)' : 'ম্যাক্রো ভিউ'}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsZoomMode(z => !z)}
            className={`w-full py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              isZoomMode ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{isZoomMode ? 'সাধারণ দৃশ্য' : '🔬 আণবিক জুম ভিউ'}</span>
          </button>
        </div>
      </div>

      {/* Main Vector Simulation Stage */}
      <div
        ref={cellRef}
        className="bg-slate-900 border-2 border-amber-500/40 rounded-3xl p-6 sm:p-8 text-white shadow-2xl space-y-6 relative overflow-hidden"
      >
        {/* Top Metric Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 bg-slate-950 border border-amber-500/40 rounded-2xl shadow-inner">
            <span className="text-[10px] text-amber-300 block font-bold uppercase tracking-wider">
              নার্নস্ট কোষ বিভব (E_cell):
            </span>
            <span className="text-2xl font-black text-amber-400 font-mono mt-0.5 block flex items-baseline gap-1">
              {simulationMetrics.e_cell} <span className="text-xs text-amber-300 font-bold">V</span>
            </span>
            <span className="text-[10px] text-slate-400 font-mono">আদর্শ E° = 1.10 V</span>
          </div>

          <div className="p-3.5 bg-slate-950 border border-rose-500/40 rounded-2xl shadow-inner">
            <span className="text-[10px] text-rose-300 block font-bold uppercase tracking-wider">
              অ্যানোড অর্ধ-কোষ (ZnSO₄):
            </span>
            <span className="text-base font-black text-rose-300 font-mono mt-1 block truncate">
              Zn(s) → Zn²⁺ + 2e⁻
            </span>
            <span className="text-[10px] text-slate-400 font-mono">E°_ox = +0.76 V (দস্তা ক্ষয়)</span>
          </div>

          <div className="p-3.5 bg-slate-950 border border-cyan-500/40 rounded-2xl shadow-inner">
            <span className="text-[10px] text-cyan-300 block font-bold uppercase tracking-wider">
              ক্যাথোড অর্ধ-কোষ (CuSO₄):
            </span>
            <span className="text-base font-black text-cyan-300 font-mono mt-1 block truncate">
              Cu²⁺ + 2e⁻ → Cu(s)
            </span>
            <span className="text-[10px] text-slate-400 font-mono">E°_red = +0.34 V (তামা জমা)</span>
          </div>

          <div className="p-3.5 bg-slate-950 border border-emerald-500/40 rounded-2xl shadow-inner">
            <span className="text-[10px] text-emerald-300 block font-bold uppercase tracking-wider">
              মুক্ত শক্তি ও বাল্ব গ্লো:
            </span>
            <div className="flex items-center gap-2 mt-1">
              <Lightbulb
                className="w-6 h-6 transition-all"
                style={{
                  color: simulationMetrics.bulbGlow > 0 ? '#fbbf24' : '#64748b',
                  filter: simulationMetrics.bulbGlow > 0 ? `drop-shadow(0 0 ${simulationMetrics.bulbGlow / 6}px #f59e0b)` : 'none'
                }}
              />
              <span className="text-base font-black text-emerald-400 font-mono">
                {simulationMetrics.bulbGlow}%
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono truncate">ΔG° = {simulationMetrics.deltaG} kJ/mol</span>
          </div>
        </div>

        {/* 2D Vector Graphic Simulation Canvas */}
        <div className="relative w-full h-[450px] bg-slate-950 rounded-3xl border border-slate-800 flex items-center justify-center overflow-hidden p-4 shadow-inner">
          <style>{`
            @keyframes daniellElectronFlow {
              from { stroke-dashoffset: 32; }
              to { stroke-dashoffset: 0; }
            }
          `}</style>

          <svg className="w-full h-full max-w-4xl" viewBox="0 0 800 420" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <filter id="bulbGlowDnl" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation={simulationMetrics.bulbGlow / 8} result="glow" />
                <feMerge>
                  <feMergeNode in="glow" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="eGlowDnl" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="glow" />
                <feMerge>
                  <feMergeNode in="glow" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* EXTERNAL CIRCUIT WIRE: FROM ZN ANODE (200, 100) -> VOLTMETER & BULB (400, 50) -> CU CATHODE (600, 100) */}
            <path
              d="M 200 130 L 200 50 L 370 50"
              stroke="#b45309"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <path
              d="M 430 50 L 600 50 L 600 130"
              stroke="#b45309"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />

            {/* Animated Electron Dash Line */}
            {isCircuitClosed && hasSaltBridge && Number(simulationMetrics.e_cell) > 0 && (
              <>
                <path
                  d="M 200 130 L 200 50 L 370 50"
                  stroke="#38bdf8"
                  strokeWidth="3"
                  strokeDasharray="8 8"
                  fill="none"
                  style={{ animation: 'daniellElectronFlow 0.8s linear infinite' }}
                />
                <path
                  d="M 430 50 L 600 50 L 600 130"
                  stroke="#38bdf8"
                  strokeWidth="3"
                  strokeDasharray="8 8"
                  fill="none"
                  style={{ animation: 'daniellElectronFlow 0.8s linear infinite' }}
                />
              </>
            )}

            {/* Flowing Glowing Electron Dots (Zn -> Voltmeter -> Cu) */}
            {isCircuitClosed && hasSaltBridge && Number(simulationMetrics.e_cell) > 0 && [0, 0.4, 0.8, 1.2, 1.6, 2.0, 2.4, 2.8].map((delay, idx) => (
              <g key={`e-flow-${idx}`}>
                <circle r="4.5" fill="#38bdf8" filter="url(#eGlowDnl)">
                  <animateMotion
                    dur="3s"
                    repeatCount="indefinite"
                    begin={`${delay}s`}
                    path="M 200 130 L 200 50 L 600 50 L 600 130"
                    calcMode="linear"
                  />
                </circle>
                <circle r="2" fill="#ffffff">
                  <animateMotion
                    dur="3s"
                    repeatCount="indefinite"
                    begin={`${delay}s`}
                    path="M 200 130 L 200 50 L 600 50 L 600 130"
                    calcMode="linear"
                  />
                </circle>
              </g>
            ))}

            {/* VOLTMETER & LIGHT BULB */}
            <g transform="translate(360, 20)">
              {/* Voltmeter Housing */}
              <rect x="0" y="0" width="80" height="55" rx="12" fill="#0f172a" stroke="#475569" strokeWidth="2" />
              <rect x="10" y="8" width="60" height="22" rx="6" fill="#020617" stroke="#334155" />
              <text x="40" y="24" fill="#38bdf8" fontSize="13" fontWeight="900" textAnchor="middle" fontFamily="monospace">
                {simulationMetrics.e_cell}V
              </text>
              <text x="40" y="44" fill="#94a3b8" fontSize="9" fontWeight="bold" textAnchor="middle">
                DANIELL E° 1.10V
              </text>

              {/* Light Bulb */}
              <g transform="translate(40, -25)">
                {simulationMetrics.bulbGlow > 0 && (
                  <circle
                    cx="0"
                    cy="0"
                    r={18 + simulationMetrics.bulbGlow / 5}
                    fill="#f59e0b"
                    opacity={simulationMetrics.bulbGlow / 180}
                    filter="url(#bulbGlowDnl)"
                  />
                )}
                <circle
                  cx="0"
                  cy="0"
                  r="14"
                  fill={simulationMetrics.bulbGlow > 0 ? '#fbbf24' : '#334155'}
                  stroke="#e2e8f0"
                  strokeWidth="1.5"
                />
                <path
                  d="M -4 2 L 0 -5 L 4 2"
                  stroke={simulationMetrics.bulbGlow > 0 ? '#fff' : '#64748b'}
                  strokeWidth="1.5"
                  fill="none"
                />
                <rect x="-5" y="10" width="10" height="5" fill="#64748b" rx="1" />
              </g>
            </g>

            {/* ========================================================= */}
            {/* LEFT BEAKER: ANODE HALF-CELL (Zinc in ZnSO4) */}
            {/* ========================================================= */}
            <g transform="translate(100, 160)">
              {/* Glass Beaker Body */}
              <rect x="0" y="0" width="200" height="210" rx="10" fill="none" stroke="#64748b" strokeWidth="3" />
              {/* ZnSO4 Solution (Clear with slight tint) */}
              <rect x="5" y="50" width="190" height="155" rx="6" fill="rgba(226, 232, 240, 0.15)" />
              {/* Liquid Level Line */}
              <line x1="5" y1="50" x2="195" y2="50" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4 2" />

              {/* Zinc Metal Electrode Rod (Zn) */}
              <rect
                x="85"
                y="-30"
                width="30"
                height="190"
                rx="4"
                fill="#94a3b8"
                stroke="#64748b"
                strokeWidth="2"
                className="transition-all"
              />
              <text x="100" y="-8" fill="#0f172a" fontSize="12" fontWeight="black" textAnchor="middle">
                Zn
              </text>

              {/* Dissolving Zn2+ Particles (Oxidation) */}
              {isCircuitClosed && hasSaltBridge && (
                <>
                  <circle cx="80" cy="90" r="8" fill="#f43f5e" opacity="0.85" className="animate-pulse" />
                  <text x="80" y="93" fill="#fff" fontSize="8" fontWeight="bold" textAnchor="middle">Zn²⁺</text>

                  <circle cx="120" cy="130" r="8" fill="#f43f5e" opacity="0.85" className="animate-pulse" />
                  <text x="120" y="133" fill="#fff" fontSize="8" fontWeight="bold" textAnchor="middle">Zn²⁺</text>
                </>
              )}

              {/* Anode Labels */}
              <rect x="15" y="165" width="170" height="32" rx="8" fill="#0f172a" stroke="#f43f5e" strokeWidth="1" />
              <text x="100" y="178" fill="#f43f5e" fontSize="10" fontWeight="black" textAnchor="middle">
                অ্যানোড: দস্তা দণ্ড (Zn)
              </text>
              <text x="100" y="191" fill="#cbd5e1" fontSize="9" fontWeight="bold" textAnchor="middle">
                দ্রবণ: {znConc}M ZnSO₄ (বর্ণহীন)
              </text>
            </g>

            {/* ========================================================= */}
            {/* RIGHT BEAKER: CATHODE HALF-CELL (Copper in CuSO4) */}
            {/* ========================================================= */}
            <g transform="translate(500, 160)">
              {/* Glass Beaker Body */}
              <rect x="0" y="0" width="200" height="210" rx="10" fill="none" stroke="#64748b" strokeWidth="3" />
              {/* CuSO4 Solution (Deep Vibrant Blue) */}
              <rect x="5" y="50" width="190" height="155" rx="6" fill="rgba(14, 165, 233, 0.55)" />
              {/* Liquid Level Line */}
              <line x1="5" y1="50" x2="195" y2="50" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="4 2" />

              {/* Copper Metal Electrode Rod (Cu) */}
              <rect
                x="85"
                y="-30"
                width="30"
                height="190"
                rx="4"
                fill="#ea580c"
                stroke="#c2410c"
                strokeWidth="2"
                className="transition-all"
              />
              <text x="100" y="-8" fill="#fff" fontSize="12" fontWeight="black" textAnchor="middle">
                Cu
              </text>

              {/* Depositing Cu2+ Particles (Reduction) */}
              {isCircuitClosed && hasSaltBridge && (
                <>
                  <circle cx="80" cy="110" r="8" fill="#38bdf8" opacity="0.85" className="animate-pulse" />
                  <text x="80" y="113" fill="#fff" fontSize="8" fontWeight="bold" textAnchor="middle">Cu²⁺</text>

                  <circle cx="120" cy="80" r="8" fill="#38bdf8" opacity="0.85" className="animate-pulse" />
                  <text x="120" y="83" fill="#fff" fontSize="8" fontWeight="bold" textAnchor="middle">Cu²⁺</text>
                </>
              )}

              {/* Cathode Labels */}
              <rect x="15" y="165" width="170" height="32" rx="8" fill="#0f172a" stroke="#38bdf8" strokeWidth="1" />
              <text x="100" y="178" fill="#38bdf8" fontSize="10" fontWeight="black" textAnchor="middle">
                ক্যাথোড: তামা দণ্ড (Cu)
              </text>
              <text x="100" y="191" fill="#cbd5e1" fontSize="9" fontWeight="bold" textAnchor="middle">
                দ্রবণ: {cuConc}M CuSO₄ (গাঢ় নীল)
              </text>
            </g>

            {/* ========================================================= */}
            {/* U-TUBE SALT BRIDGE (KCl in Agar-Agar Gel) */}
            {/* ========================================================= */}
            {hasSaltBridge ? (
              <g transform="translate(0, 0)">
                {/* U-Tube Outer Glass */}
                <path
                  d="M 270 240 L 270 140 Q 270 110 300 110 L 500 110 Q 530 110 530 140 L 530 240"
                  stroke="#475569"
                  strokeWidth="28"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
                {/* Gel Core with Electrolyte (Agar-Agar + KCl) */}
                <path
                  d="M 270 240 L 270 140 Q 270 110 300 110 L 500 110 Q 530 110 530 140 L 530 240"
                  stroke="#fbbf24"
                  strokeWidth="18"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                  opacity="0.8"
                />

                {/* Salt Bridge Label */}
                <rect x="340" y="125" width="120" height="24" rx="6" fill="#020617" stroke="#f59e0b" strokeWidth="1" />
                <text x="400" y="141" fill="#fbbf24" fontSize="10" fontWeight="black" textAnchor="middle">
                  লবণ সেতু (KCl)
                </text>

                {/* Ion Migration Particles */}
                {isCircuitClosed && (
                  <>
                    {/* Cl- moving left to Anode to neutralize excess Zn2+ */}
                    <g transform="translate(310, 110)">
                      <circle cx="0" cy="0" r="6" fill="#f43f5e" />
                      <text x="0" y="3" fill="#fff" fontSize="8" fontWeight="bold" textAnchor="middle">Cl⁻</text>
                      <text x="-12" y="3" fill="#f43f5e" fontSize="9" fontWeight="bold">⬅</text>
                    </g>
                    {/* K+ moving right to Cathode to compensate consumed Cu2+ */}
                    <g transform="translate(490, 110)">
                      <circle cx="0" cy="0" r="6" fill="#0ea5e9" />
                      <text x="0" y="3" fill="#fff" fontSize="8" fontWeight="bold" textAnchor="middle">K⁺</text>
                      <text x="12" y="3" fill="#0ea5e9" fontSize="9" fontWeight="bold">➔</text>
                    </g>
                  </>
                )}
              </g>
            ) : (
              <g transform="translate(340, 120)">
                <rect x="0" y="0" width="120" height="30" rx="8" fill="#450a0a" stroke="#ef4444" strokeWidth="1.5" />
                <text x="60" y="19" fill="#fca5a5" fontSize="11" fontWeight="black" textAnchor="middle">
                  ⚠️ সেতু বিচ্ছিন্ন!
                </text>
              </g>
            )}

            {/* Electron Flow Direction Badges */}
            <g transform="translate(200, 395)" className="text-xs">
              <rect x="0" y="0" width="190" height="20" rx="6" fill="#020617" stroke="#38bdf8" strokeWidth="1" />
              <text x="95" y="14" fill="#38bdf8" fontSize="9" fontWeight="bold" textAnchor="middle">
                🔵 ইলেকট্রন প্রবাহ (e⁻ ➔ ➔) Zn হতে Cu-তে
              </text>
            </g>

            <g transform="translate(410, 395)" className="text-xs">
              <rect x="0" y="0" width="190" height="20" rx="6" fill="#020617" stroke="#f43f5e" strokeWidth="1" />
              <text x="95" y="14" fill="#f43f5e" fontSize="9" fontWeight="bold" textAnchor="middle">
                🔴 বিদ্যুৎ প্রবাহ (I ⬅ ⬅) Cu হতে Zn-এ
              </text>
            </g>
          </svg>
        </div>

        {/* Microscopic Atomic Interface Overlay */}
        {isZoomMode && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in zoom-in-95 duration-300">
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
