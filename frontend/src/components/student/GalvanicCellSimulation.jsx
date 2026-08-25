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
  Loader2,
  Table2
} from 'lucide-react';
import { exportBrandedGraphic } from '../../utils/exportBrandedGraphic';

// Standard Reduction Potentials E° (at 298 K, 1 atm, 1 M)
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

  // Is Currently Standard Daniell Cell?
  const isDaniellSetup = useMemo(() => {
    return anodeId === 'Zn' && cathodeId === 'Cu';
  }, [anodeId, cathodeId]);

  // Quick Preset Handlers
  const applyPreset = (anodeKey, cathodeKey) => {
    setAnodeId(anodeKey);
    setCathodeId(cathodeKey);
    setAnodeConc(1.0);
    setCathodeConc(1.0);
    setIsCircuitClosed(true);
  };

  // Standard Cell EMF: E°cell = E°cathode - E°anode
  const E0_cell = useMemo(() => {
    return cathode.e0_red - anode.e0_red;
  }, [anode, cathode]);

  // Number of electrons transferred (LCM of n_anode and n_cathode)
  const n_transfer = useMemo(() => {
    const a = anode.n;
    const c = cathode.n;
    // LCM calculation
    const gcd = (x, y) => (!y ? x : gcd(y, x % y));
    return (a * c) / gcd(a, c);
  }, [anode, cathode]);

  // Nernst Equation calculation at 298 K (25°C):
  // E_cell = E°cell - (0.0592 / n) * log10( [Anode Ion]^(c_coeff) / [Cathode Ion]^(a_coeff) )
  const { E_cell, isValidCell, deltaG, reactionQuotient } = useMemo(() => {
    if (E0_cell <= 0) {
      return {
        E_cell: '0.000',
        isValidCell: false,
        deltaG: '0.0',
        reactionQuotient: '1.00'
      };
    }

    const a_coeff = n_transfer / anode.n;
    const c_coeff = n_transfer / cathode.n;
    const Q = Math.pow(anodeConc, a_coeff) / Math.pow(cathodeConc, c_coeff);
    const nernstE = E0_cell - (0.0592 / n_transfer) * Math.log10(Q);
    const effectiveE = Math.max(0, nernstE);

    // Delta G = -n * F * E_cell (in kJ/mol)
    const dG = -n_transfer * 96.485 * effectiveE;

    return {
      E_cell: effectiveE.toFixed(3),
      isValidCell: true,
      deltaG: dG.toFixed(1),
      reactionQuotient: Q.toFixed(3)
    };
  }, [E0_cell, n_transfer, anode, cathode, anodeConc, cathodeConc]);

  // Bulb glow percentage (0 to 100%)
  const bulbGlowPercentage = useMemo(() => {
    if (!isCircuitClosed || !isValidCell) return 0;
    const v = parseFloat(E_cell);
    return Math.min(100, Math.max(0, Math.round((v / 3.0) * 100)));
  }, [isCircuitClosed, isValidCell, E_cell]);

  // Balanced overall cell equation
  const overallEquation = useMemo(() => {
    const a_coeff = n_transfer / anode.n;
    const c_coeff = n_transfer / cathode.n;
    const aStr = a_coeff > 1 ? a_coeff : '';
    const cStr = c_coeff > 1 ? c_coeff : '';
    return `${aStr}${anode.sym}(s) + ${cStr}${cathode.ion}(aq) ➔ ${aStr}${anode.ion}(aq) + ${cStr}${cathode.sym}(s)`;
  }, [anode, cathode, n_transfer]);

  // IUPAC Cell Notation
  const cellNotation = useMemo(() => {
    return `${anode.sym}(s) | ${anode.ion}(${anodeConc}M) || ${cathode.ion}(${cathodeConc}M) | ${cathode.sym}(s)`;
  }, [anode, cathode, anodeConc, cathodeConc]);

  // Export card
  const handleExport = async () => {
    if (!cellRef.current) return;
    setIsExporting(true);
    try {
      await exportBrandedGraphic(cellRef.current, {
        fileName: `NextGen_Galvanic_Cell_${anode.sym}_${cathode.sym}`,
        cardTitle: `কাস্টম গ্যালভানিক কোষ (${anode.sym}-${cathode.sym}) • E_cell = ${E_cell}V`,
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
      <div className="p-6 bg-gradient-to-r from-slate-900 via-cyan-950/40 to-slate-900 border border-slate-800 rounded-3xl shadow-xl text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="p-3.5 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shadow-inner">
            <Sliders className="w-9 h-9 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black text-white">কাস্টম গ্যালভানিক কোষ ল্যাব (Customizable Galvanic Cell)</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold font-mono">
                Multi-Electrode Simulator ⚡
              </span>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              যেকোনো সক্রিয় ধাতু জোড়া ($Mg, Al, Zn, Fe, Pb$ বনাম $Cu, Ag, Ni, Au$) নির্বাচন করে নার্নস্ট বিভব ও তড়িৎ প্রবাহ সিমুলেট করুন
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

          {/* Export HD */}
          <button
            type="button"
            onClick={handleExport}
            disabled={isExporting}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-600/30 flex items-center gap-2 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
          >
            {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            <span>ডাউনলোড (HD)</span>
          </button>
        </div>
      </div>

      {/* Preset Electrode Pairs & Distinction Bar */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            জনপ্রিয় গ্যালভানিক জোড়া প্রিসেট (Quick Presets):
          </span>

          {isDaniellSetup && (
            <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold font-mono animate-pulse">
              ⭐ নির্বাচিত: ক্লাসিক্যাল ড্যানিয়েল কোষ (Zn-Cu)
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
          <button
            type="button"
            onClick={() => applyPreset('Zn', 'Cu')}
            className={`px-3 py-1.5 rounded-xl border transition-all ${
              anodeId === 'Zn' && cathodeId === 'Cu'
                ? 'bg-amber-600 text-white border-amber-400 font-black shadow-md'
                : 'bg-slate-950 text-slate-300 border-slate-700 hover:text-white hover:border-slate-500'
            }`}
          >
            📌 ড্যানিয়েল কোষ (Zn-Cu, 1.10V)
          </button>

          <button
            type="button"
            onClick={() => applyPreset('Mg', 'Cu')}
            className={`px-3 py-1.5 rounded-xl border transition-all ${
              anodeId === 'Mg' && cathodeId === 'Cu'
                ? 'bg-cyan-600 text-white border-cyan-400 font-black shadow-md'
                : 'bg-slate-950 text-slate-300 border-slate-700 hover:text-white hover:border-slate-500'
            }`}
          >
            ⚡ হাই-ভোল্টেজ সেল (Mg-Cu, 2.71V)
          </button>

          <button
            type="button"
            onClick={() => applyPreset('Zn', 'Ag')}
            className={`px-3 py-1.5 rounded-xl border transition-all ${
              anodeId === 'Zn' && cathodeId === 'Ag'
                ? 'bg-cyan-600 text-white border-cyan-400 font-black shadow-md'
                : 'bg-slate-950 text-slate-300 border-slate-700 hover:text-white hover:border-slate-500'
            }`}
          >
            🪙 সিলভার সেল (Zn-Ag, 1.56V)
          </button>

          <button
            type="button"
            onClick={() => applyPreset('Mg', 'Ag')}
            className={`px-3 py-1.5 rounded-xl border transition-all ${
              anodeId === 'Mg' && cathodeId === 'Ag'
                ? 'bg-cyan-600 text-white border-cyan-400 font-black shadow-md'
                : 'bg-slate-950 text-slate-300 border-slate-700 hover:text-white hover:border-slate-500'
            }`}
          >
            🔋 মেগা ভোল্টেজ সেল (Mg-Ag, 3.17V)
          </button>

          <button
            type="button"
            onClick={() => applyPreset('Fe', 'Cu')}
            className={`px-3 py-1.5 rounded-xl border transition-all ${
              anodeId === 'Fe' && cathodeId === 'Cu'
                ? 'bg-cyan-600 text-white border-cyan-400 font-black shadow-md'
                : 'bg-slate-950 text-slate-300 border-slate-700 hover:text-white hover:border-slate-500'
            }`}
          >
            🌿 আয়রন-কপার সেল (Fe-Cu, 0.78V)
          </button>
        </div>
      </div>

      {/* Control Panel Toolbar */}
      <div className="p-5 bg-slate-900 border border-slate-800 rounded-3xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 shadow-xl text-white">
        {/* 1. Anode Selector & Concentration */}
        <div className="space-y-2 p-3.5 bg-slate-950 rounded-2xl border border-slate-800">
          <label className="text-xs font-bold text-rose-400 flex items-center justify-between">
            <span>অ্যানোড ধাতু (Anode / জারণ):</span>
            <span className="font-mono">{anode.sym}</span>
          </label>
          <select
            value={anodeId}
            onChange={(e) => setAnodeId(e.target.value)}
            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
          >
            {ANODE_METALS.map((m) => (
              <option key={m.id} value={m.id}>
                {m.nameBn} [E° = {m.e0_red > 0 ? '+' : ''}{m.e0_red}V]
              </option>
            ))}
          </select>
          <div className="space-y-1 pt-1">
            <div className="flex justify-between text-[11px] font-mono text-slate-400">
              <span>ঘনমাত্রা:</span>
              <strong className="text-rose-400 font-bold">{anodeConc} M</strong>
            </div>
            <input
              type="range"
              min="0.01"
              max="2.00"
              step="0.05"
              value={anodeConc}
              onChange={(e) => setAnodeConc(Number(e.target.value))}
              className="w-full accent-rose-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />
          </div>
        </div>

        {/* 2. Cathode Selector & Concentration */}
        <div className="space-y-2 p-3.5 bg-slate-950 rounded-2xl border border-slate-800">
          <label className="text-xs font-bold text-cyan-400 flex items-center justify-between">
            <span>ক্যাথোড ধাতু (Cathode / বিজারণ):</span>
            <span className="font-mono">{cathode.sym}</span>
          </label>
          <select
            value={cathodeId}
            onChange={(e) => setCathodeId(e.target.value)}
            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            {CATHODE_METALS.map((m) => (
              <option key={m.id} value={m.id}>
                {m.nameBn} [E° = {m.e0_red > 0 ? '+' : ''}{m.e0_red}V]
              </option>
            ))}
          </select>
          <div className="space-y-1 pt-1">
            <div className="flex justify-between text-[11px] font-mono text-slate-400">
              <span>ঘনমাত্রা:</span>
              <strong className="text-cyan-400 font-bold">{cathodeConc} M</strong>
            </div>
            <input
              type="range"
              min="0.01"
              max="2.00"
              step="0.05"
              value={cathodeConc}
              onChange={(e) => setCathodeConc(Number(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />
          </div>
        </div>

        {/* 3. Salt Bridge Selector */}
        <div className="space-y-2 p-3.5 bg-slate-950 rounded-2xl border border-slate-800">
          <label className="text-xs font-bold text-amber-300">লবণ সেতু (Salt Bridge):</label>
          <select
            value={saltBridgeId}
            onChange={(e) => setSaltBridgeId(e.target.value)}
            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            {SALT_BRIDGES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
          <p className="text-[10px] text-slate-400 leading-tight">
            ক্যাটায়ন: <span className="text-cyan-300 font-mono font-bold">{saltBridge.cation}</span> | অ্যানায়ন: <span className="text-rose-300 font-mono font-bold">{saltBridge.anion}</span>
          </p>
        </div>

        {/* 4. Cell Status & Potential Card */}
        <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">কোষ অবস্থা:</span>
          <div>
            <span className={`text-xl font-black font-mono block ${
              isValidCell ? 'text-emerald-400' : 'text-rose-400'
            }`}>
              {isValidCell ? `E = ${E_cell} V` : 'বিক্রিয়া সম্ভব নয়'}
            </span>
            <span className="text-[10px] text-slate-400 block font-mono">
              প্রমাণ E° = {E0_cell.toFixed(2)} V
            </span>
          </div>
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold w-fit ${
            isValidCell ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-rose-950 text-rose-300 border border-rose-800'
          }`}>
            {isValidCell ? 'স্বতঃস্ফূর্ত (Spontaneous)' : 'অস্বতঃস্ফূর্ত'}
          </span>
        </div>
      </div>

      {/* Main Simulation Stage */}
      <div
        ref={cellRef}
        className="bg-slate-900 border-2 border-cyan-500/40 rounded-3xl p-6 sm:p-8 text-white shadow-2xl space-y-6 relative overflow-hidden"
      >
        {/* Metric Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 bg-slate-950 border border-cyan-500/40 rounded-2xl shadow-inner">
            <span className="text-[10px] text-cyan-300 block font-bold uppercase tracking-wider">
              নার্নস্ট বিভব (Nernst EMF):
            </span>
            <span className="text-2xl font-black text-cyan-400 font-mono mt-0.5 block flex items-baseline gap-1">
              {E_cell} <span className="text-xs text-cyan-300 font-bold">V</span>
            </span>
            <span className="text-[10px] text-slate-400 font-mono">প্রমাণ E° = {E0_cell.toFixed(2)}V</span>
          </div>

          <div className="p-3.5 bg-slate-950 border border-rose-500/40 rounded-2xl shadow-inner">
            <span className="text-[10px] text-rose-300 block font-bold uppercase tracking-wider">
              অ্যানোড ({anode.sym}) জারণ বিভব:
            </span>
            <span className="text-base font-black text-rose-300 font-mono mt-1 block truncate">
              {anode.oxHalf}
            </span>
            <span className="text-[10px] text-slate-400 font-mono">E°_ox = {(-anode.e0_red).toFixed(2)}V</span>
          </div>

          <div className="p-3.5 bg-slate-950 border border-emerald-500/40 rounded-2xl shadow-inner">
            <span className="text-[10px] text-emerald-300 block font-bold uppercase tracking-wider">
              ক্যাথোড ({cathode.sym}) বিজারণ বিভব:
            </span>
            <span className="text-base font-black text-emerald-300 font-mono mt-1 block truncate">
              {cathode.redHalf}
            </span>
            <span className="text-[10px] text-slate-400 font-mono">E°_red = {cathode.e0_red.toFixed(2)}V</span>
          </div>

          <div className="p-3.5 bg-slate-950 border border-amber-500/40 rounded-2xl shadow-inner">
            <span className="text-[10px] text-amber-300 block font-bold uppercase tracking-wider">
              মুক্ত শক্তি ও বাল্ব গ্লো:
            </span>
            <div className="flex items-center gap-2 mt-1">
              <Lightbulb
                className="w-6 h-6 transition-all"
                style={{
                  color: bulbGlowPercentage > 0 ? '#fbbf24' : '#64748b',
                  filter: bulbGlowPercentage > 0 ? `drop-shadow(0 0 ${bulbGlowPercentage / 6}px #f59e0b)` : 'none'
                }}
              />
              <span className="text-base font-black text-amber-400 font-mono">
                {bulbGlowPercentage}%
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono truncate">ΔG = {deltaG} kJ/mol</span>
          </div>
        </div>

        {/* 2D Vector Graphic Simulation Canvas */}
        <div className="relative w-full h-[450px] bg-slate-950 rounded-3xl border border-slate-800 flex items-center justify-center overflow-hidden p-4 shadow-inner">
          <style>{`
            @keyframes galvanicElectronFlow {
              from { stroke-dashoffset: 32; }
              to { stroke-dashoffset: 0; }
            }
          `}</style>

          <svg className="w-full h-full max-w-4xl" viewBox="0 0 800 420" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <filter id="bulbGlowGalv" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation={bulbGlowPercentage / 8} result="glow" />
                <feMerge>
                  <feMergeNode in="glow" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="eGlowGalv" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="glow" />
                <feMerge>
                  <feMergeNode in="glow" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* EXTERNAL CIRCUIT WIRE: FROM ANODE (200, 100) -> VOLTMETER & BULB (400, 50) -> CATHODE (600, 100) */}
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
            {isCircuitClosed && isValidCell && Number(E_cell) > 0 && (
              <>
                <path
                  d="M 200 130 L 200 50 L 370 50"
                  stroke="#38bdf8"
                  strokeWidth="3"
                  strokeDasharray="8 8"
                  fill="none"
                  style={{ animation: 'galvanicElectronFlow 0.8s linear infinite' }}
                />
                <path
                  d="M 430 50 L 600 50 L 600 130"
                  stroke="#38bdf8"
                  strokeWidth="3"
                  strokeDasharray="8 8"
                  fill="none"
                  style={{ animation: 'galvanicElectronFlow 0.8s linear infinite' }}
                />
              </>
            )}

            {/* Flowing Glowing Electron Dots (Anode -> Voltmeter -> Cathode) */}
            {isCircuitClosed && isValidCell && Number(E_cell) > 0 && [0, 0.4, 0.8, 1.2, 1.6, 2.0, 2.4, 2.8].map((delay, idx) => (
              <g key={`e-flow-g-${idx}`}>
                <circle r="4.5" fill="#38bdf8" filter="url(#eGlowGalv)">
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
              <rect x="0" y="0" width="80" height="55" rx="12" fill="#0f172a" stroke="#475569" strokeWidth="2" />
              <rect x="10" y="8" width="60" height="22" rx="6" fill="#020617" stroke="#334155" />
              <text x="40" y="24" fill="#38bdf8" fontSize="13" fontWeight="900" textAnchor="middle" fontFamily="monospace">
                {E_cell}V
              </text>
              <text x="40" y="44" fill="#94a3b8" fontSize="9" fontWeight="bold" textAnchor="middle">
                {anode.sym} - {cathode.sym}
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
                    filter="url(#bulbGlowGalv)"
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
            {/* LEFT BEAKER: ANODE HALF-CELL */}
            {/* ========================================================= */}
            <g transform="translate(100, 160)">
              <rect x="0" y="0" width="200" height="210" rx="10" fill="none" stroke="#64748b" strokeWidth="3" />
              <rect x="5" y="50" width="190" height="155" rx="6" fill={anode.solColor} />
              <line x1="5" y1="50" x2="195" y2="50" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4 2" />

              {/* Anode Metal Electrode */}
              <rect
                x="85"
                y="-30"
                width="30"
                height="190"
                rx="4"
                fill={anode.color}
                stroke="#64748b"
                strokeWidth="2"
              />
              <text x="100" y="-8" fill="#0f172a" fontSize="12" fontWeight="black" textAnchor="middle">
                {anode.sym}
              </text>

              {/* Anode Labels */}
              <rect x="15" y="165" width="170" height="32" rx="8" fill="#0f172a" stroke="#f43f5e" strokeWidth="1" />
              <text x="100" y="178" fill="#f43f5e" fontSize="10" fontWeight="black" textAnchor="middle">
                অ্যানোড: {anode.nameBn}
              </text>
              <text x="100" y="191" fill="#cbd5e1" fontSize="9" fontWeight="bold" textAnchor="middle">
                দ্রবণ: {anodeConc}M {anode.saltName}
              </text>
            </g>

            {/* ========================================================= */}
            {/* RIGHT BEAKER: CATHODE HALF-CELL */}
            {/* ========================================================= */}
            <g transform="translate(500, 160)">
              <rect x="0" y="0" width="200" height="210" rx="10" fill="none" stroke="#64748b" strokeWidth="3" />
              <rect x="5" y="50" width="190" height="155" rx="6" fill={cathode.solColor} />
              <line x1="5" y1="50" x2="195" y2="50" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="4 2" />

              {/* Cathode Metal Electrode */}
              <rect
                x="85"
                y="-30"
                width="30"
                height="190"
                rx="4"
                fill={cathode.color}
                stroke="#64748b"
                strokeWidth="2"
              />
              <text x="100" y="-8" fill="#0f172a" fontSize="12" fontWeight="black" textAnchor="middle">
                {cathode.sym}
              </text>

              {/* Cathode Labels */}
              <rect x="15" y="165" width="170" height="32" rx="8" fill="#0f172a" stroke="#38bdf8" strokeWidth="1" />
              <text x="100" y="178" fill="#38bdf8" fontSize="10" fontWeight="black" textAnchor="middle">
                ক্যাথোড: {cathode.nameBn}
              </text>
              <text x="100" y="191" fill="#cbd5e1" fontSize="9" fontWeight="bold" textAnchor="middle">
                দ্রবণ: {cathodeConc}M {cathode.saltName}
              </text>
            </g>

            {/* ========================================================= */}
            {/* U-TUBE SALT BRIDGE */}
            {/* ========================================================= */}
            <g transform="translate(0, 0)">
              <path
                d="M 270 240 L 270 140 Q 270 110 300 110 L 500 110 Q 530 110 530 140 L 530 240"
                stroke="#475569"
                strokeWidth="28"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
              <path
                d="M 270 240 L 270 140 Q 270 110 300 110 L 500 110 Q 530 110 530 140 L 530 240"
                stroke="#fbbf24"
                strokeWidth="18"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                opacity="0.8"
              />
              <rect x="340" y="125" width="120" height="24" rx="6" fill="#020617" stroke="#f59e0b" strokeWidth="1" />
              <text x="400" y="141" fill="#fbbf24" fontSize="10" fontWeight="black" textAnchor="middle">
                লবণ সেতু ({saltBridge.id})
              </text>

              {/* Ion Migration Badges */}
              {isCircuitClosed && isValidCell && (
                <>
                  <g transform="translate(310, 110)">
                    <circle cx="0" cy="0" r="6" fill="#f43f5e" />
                    <text x="0" y="3" fill="#fff" fontSize="8" fontWeight="bold" textAnchor="middle">{saltBridge.anion}</text>
                    <text x="-14" y="3" fill="#f43f5e" fontSize="9" fontWeight="bold">⬅</text>
                  </g>
                  <g transform="translate(490, 110)">
                    <circle cx="0" cy="0" r="6" fill="#0ea5e9" />
                    <text x="0" y="3" fill="#fff" fontSize="8" fontWeight="bold" textAnchor="middle">{saltBridge.cation}</text>
                    <text x="14" y="3" fill="#0ea5e9" fontSize="9" fontWeight="bold">➔</text>
                  </g>
                </>
              )}
            </g>

            {/* Electron Flow Badges */}
            <g transform="translate(200, 395)" className="text-xs">
              <rect x="0" y="0" width="190" height="20" rx="6" fill="#020617" stroke="#38bdf8" strokeWidth="1" />
              <text x="95" y="14" fill="#38bdf8" fontSize="9" fontWeight="bold" textAnchor="middle">
                🔵 ইলেকট্রন প্রবাহ (e⁻ ➔ ➔) {anode.sym} হতে {cathode.sym}-এ
              </text>
            </g>

            <g transform="translate(410, 395)" className="text-xs">
              <rect x="0" y="0" width="190" height="20" rx="6" fill="#020617" stroke="#f43f5e" strokeWidth="1" />
              <text x="95" y="14" fill="#f43f5e" fontSize="9" fontWeight="bold" textAnchor="middle">
                🔴 বিদ্যুৎ প্রবাহ (I ⬅ ⬅) {cathode.sym} হতে {anode.sym}-এ
              </text>
            </g>
          </svg>
        </div>

        {/* Reaction Breakdown Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <h4 className="font-black text-cyan-400 flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              কোষ বিক্রিয়া ও সমীকরণ (Cell Equations)
            </h4>
            <div className="space-y-2 font-mono text-slate-300">
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-rose-400 font-bold block text-[10px]">অ্যানোড জারণ:</span>
                <span className="text-white font-bold">{anode.oxHalf}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-cyan-400 font-bold block text-[10px]">ক্যাথোড বিজারণ:</span>
                <span className="text-white font-bold">{cathode.redHalf}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-cyan-500/40">
                <span className="text-cyan-400 font-bold block text-[10px]">সামগ্রিক কোষ বিক্রিয়া:</span>
                <span className="text-cyan-200 font-bold">{overallEquation}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 font-bold block text-[10px]">কোষ সংকেত:</span>
                <span className="text-emerald-400 font-bold">{cellNotation}</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <h4 className="font-black text-amber-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              নার্নস্ট সমীকরণ ও মুক্ত শক্তি হিসাব (Calculations)
            </h4>
            <div className="space-y-2 text-slate-300 font-mono text-[11px]">
              <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block">নার্নস্ট সূত্র (at 298 K):</span>
                <span className="text-white font-bold">E_cell = E°_cell - (0.0592/n) × log₁₀(Q)</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block">বিক্রিয়া অনুপাত (Q):</span>
                <span className="text-amber-300 font-bold">Q = [{anode.ion}] / [{cathode.ion}] = {reactionQuotient}</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block">গিবস মুক্ত শক্তি (ΔG):</span>
                <span className="text-emerald-400 font-bold">ΔG = -nFE_cell = {deltaG} kJ/mol</span>
              </div>
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
