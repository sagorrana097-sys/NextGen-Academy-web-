import React, { useState, useRef, useMemo } from 'react';
import {
  Calculator, Sparkles, BookOpen, Download, Brain, CheckCircle2,
  HelpCircle, RefreshCw, Layers, ArrowRight, Beaker, Scale,
  ChevronRight, Award, Copy, Check, FileText, Loader2, Info,
  Flame, Droplets, AlertTriangle, CheckCircle, ShieldCheck, Thermometer
} from 'lucide-react';
import { exportBrandedGraphic } from '../../utils/exportBrandedGraphic';

// Standard Reactant Data for Acid-Base Mixing
const SOLUTES_ACID_BASE = {
  HCl: { id: 'HCl', name: 'হাইড্রোক্লোরিক অ্যাসিড (HCl)', type: 'acid', M: 36.46, basicity: 1, color: '#38bdf8' },
  H2SO4: { id: 'H2SO4', name: 'সালফিউরিক অ্যাসিড (H₂SO₄)', type: 'acid', M: 98.08, basicity: 2, color: '#f43f5e' },
  HNO3: { id: 'HNO3', name: 'নাইট্রিক অ্যাসিড (HNO₃)', type: 'acid', M: 63.01, basicity: 1, color: '#ec4899' },
  NaOH: { id: 'NaOH', name: 'সোডিয়াম হাইড্রোক্সাইড (NaOH)', type: 'base', M: 40.0, acidity: 1, color: '#10b981' },
  KOH: { id: 'KOH', name: 'পটাশিয়াম হাইড্রোক্সাইড (KOH)', type: 'base', M: 56.11, acidity: 1, color: '#059669' },
  Na2CO3: { id: 'Na2CO3', name: 'সোডিয়াম কার্বনেট (Na₂CO₃)', type: 'base', M: 105.99, acidity: 2, color: '#0d9488' },
  NaHCO3: { id: 'NaHCO3', name: 'সোডিয়াম বাইকার্বনেট (NaHCO₃)', type: 'base', M: 84.01, acidity: 1, color: '#14b8a6' },
  CaOH2: { id: 'CaOH2', name: 'ক্যালসিয়াম হাইড্রোক্সাইড (Ca(OH)₂)', type: 'base', M: 74.09, acidity: 2, color: '#06b6d4' }
};

// Thermal Decomposition Reactions Suite
const THERMAL_REACTIONS = [
  {
    id: 'kclo3',
    name: '2KClO₃ ➔ 2KCl + 3O₂ (পটাশিয়াম ক্লোরেটের তাপীয় বিয়োজন)',
    reactant: 'KClO₃ (পটাশিয়াম ক্লোরেট)',
    M_react: 122.55,
    coeff_react: 2,
    product: 'O₂ (অক্সিজেন গ্যাস)',
    M_prod: 32.0,
    coeff_prod: 3,
    solidProduct: 'KCl (পটাশিয়াম ক্লোরাইড)',
    M_solid: 74.55,
    coeff_solid: 2,
    gasCoeff: 3
  },
  {
    id: 'caco3',
    name: 'CaCO₃ ➔ CaO + CO₂ (চুনাপাথরের তাপীয় বিয়োজন)',
    reactant: 'CaCO₃ (ক্যালসিয়াম কার্বনেট)',
    M_react: 100.09,
    coeff_react: 1,
    product: 'CO₂ (কার্বন ডাইঅক্সাইড)',
    M_prod: 44.01,
    coeff_prod: 1,
    solidProduct: 'CaO (চুন)',
    M_solid: 56.08,
    coeff_solid: 1,
    gasCoeff: 1
  },
  {
    id: 'nahco3',
    name: '2NaHCO₃ ➔ Na₂CO₃ + H₂O + CO₂ (বেকিং সোডার তাপীয় বিয়োজন)',
    reactant: 'NaHCO₃ (বেকিং সোডা)',
    M_react: 84.01,
    coeff_react: 2,
    product: 'CO₂ (কার্বন ডাইঅক্সাইড)',
    M_prod: 44.01,
    coeff_prod: 1,
    solidProduct: 'Na₂CO₃ (সোডা অ্যাশ)',
    M_solid: 105.99,
    coeff_solid: 1,
    gasCoeff: 1
  }
];

const NA = 6.022e23;

export default function ChemistryChapter6MathSolver() {
  const [activeTab, setActiveTab] = useState('beaker'); // 'beaker' | 'thermal' | 'mole' | 'molarity' | 'empirical' | 'board-cq'
  const [solutionTab, setSolutionTab] = useState('unitary'); // 'unitary' | 'formula'
  const [isExporting, setIsExporting] = useState(false);
  const containerRef = useRef(null);

  // =========================================================
  // 1. BEAKER SOLUTION MIXING STATE & LOGIC
  // =========================================================
  const [beakerA, setBeakerA] = useState({ soluteKey: 'HCl', inputType: 'mass', vol: 200, mass: 7.3, molarity: 1.0 });
  const [beakerB, setBeakerB] = useState({ soluteKey: 'NaOH', inputType: 'mass', vol: 100, mass: 8.0, molarity: 2.0 });

  const soluteA = SOLUTES_ACID_BASE[beakerA.soluteKey];
  const soluteB = SOLUTES_ACID_BASE[beakerB.soluteKey];

  // Calculate Moles in Beaker A
  const molesA = beakerA.inputType === 'mass'
    ? beakerA.mass / soluteA.M
    : (beakerA.molarity * beakerA.vol) / 1000;
  const massA = beakerA.inputType === 'mass' ? beakerA.mass : (molesA * soluteA.M);

  // Calculate Moles in Beaker B
  const molesB = beakerB.inputType === 'mass'
    ? beakerB.mass / soluteB.M
    : (beakerB.molarity * beakerB.vol) / 1000;
  const massB = beakerB.inputType === 'mass' ? beakerB.mass : (molesB * soluteB.M);

  // Equivalent Acid H+ and Base OH- moles for neutralization
  const eqAcid = soluteA.type === 'acid' ? molesA * soluteA.basicity : molesB * soluteB.basicity;
  const eqBase = soluteA.type === 'base' ? molesA * soluteA.acidity : molesB * soluteB.acidity;

  const totalMixVol = Number(beakerA.vol) + Number(beakerB.vol);
  const isNeutral = Math.abs(eqAcid - eqBase) < 0.0001;
  const isAcidic = eqAcid > eqBase + 0.0001;
  const isBasic = eqBase > eqAcid + 0.0001;

  const excessEq = Math.abs(eqAcid - eqBase);
  const limitingSolute = eqAcid < eqBase ? (soluteA.type === 'acid' ? soluteA : soluteB) : (soluteA.type === 'base' ? soluteA : soluteB);
  const excessSolute = eqAcid > eqBase ? (soluteA.type === 'acid' ? soluteA : soluteB) : (soluteA.type === 'base' ? soluteA : soluteB);

  const excessMoles = excessSolute.type === 'acid'
    ? excessEq / excessSolute.basicity
    : excessEq / excessSolute.acidity;
  const excessMassGrams = (excessMoles * excessSolute.M).toFixed(3);

  const litmusVerdict = isNeutral
    ? 'নিরপেক্ষ (লিটমাস পেপারের কোনো বর্ণ পরিবর্তন হবে না)'
    : isAcidic
    ? 'অম্লীয় (নীল লিটমাস লাল বর্ণ ধারণ করবে)'
    : 'ক্ষারীয় (লাল লিটমাস নীল বর্ণ ধারণ করবে)';

  // =========================================================
  // 2. THERMAL DECOMPOSITION & % YIELD STATE & LOGIC
  // =========================================================
  const [thermalRxnId, setThermalRxnId] = useState('kclo3');
  const [reactMassInput, setReactMassInput] = useState(24.5); // g KClO3
  const [actualObtainedYield, setActualObtainedYield] = useState(8.5); // g O2

  const curThermal = THERMAL_REACTIONS.find(r => r.id === thermalRxnId) || THERMAL_REACTIONS[0];
  const molesReactant = reactMassInput / curThermal.M_react;
  const theoMolesProd = (molesReactant / curThermal.coeff_react) * curThermal.coeff_prod;
  const theoMassProd = theoMolesProd * curThermal.M_prod;
  const theoGasVolSTP = theoMolesProd * 22.4;
  const percentYield = ((actualObtainedYield / (theoMassProd || 1)) * 100).toFixed(2);

  // =========================================================
  // 3. MOLE, PARTICLES & ATOMS STATE
  // =========================================================
  const [moleSubstance, setMoleSubstance] = useState('H2SO4');
  const [inputMassMole, setInputMassMole] = useState(9.8);
  const SUBSTANCES_LIB = {
    H2SO4: { name: 'সালফিউরিক অ্যাসিড (H₂SO₄)', M: 98.08, atoms: [{ sym: 'H', count: 2 }, { sym: 'S', count: 1 }, { sym: 'O', count: 4 }] },
    CH4: { name: 'মিথেন গ্যাস (CH₄)', M: 16.04, atoms: [{ sym: 'C', count: 1 }, { sym: 'H', count: 4 }] },
    CaCO3: { name: 'ক্যালসিয়াম কার্বনেট (CaCO₃)', M: 100.09, atoms: [{ sym: 'Ca', count: 1 }, { sym: 'C', count: 1 }, { sym: 'O', count: 3 }] },
    H2O: { name: 'পানি (H₂O)', M: 18.015, atoms: [{ sym: 'H', count: 2 }, { sym: 'O', count: 1 }] },
    CO2: { name: 'কার্বন ডাইঅক্সাইড (CO₂)', M: 44.01, atoms: [{ sym: 'C', count: 1 }, { sym: 'O', count: 2 }] },
    C6H12O6: { name: 'গ্লুকোজ (C₆H₁₂O₆)', M: 180.16, atoms: [{ sym: 'C', count: 6 }, { sym: 'H', count: 12 }, { sym: 'O', count: 6 }] }
  };
  const curMoleSub = SUBSTANCES_LIB[moleSubstance] || SUBSTANCES_LIB.H2SO4;
  const calcMoles = inputMassMole / curMoleSub.M;
  const calcMolecules = calcMoles * NA;
  const calcVolSTP = calcMoles * 22.4;

  // =========================================================
  // 4. MOLARITY & EMPIRICAL FORMULA STATE
  // =========================================================
  const [targetMolarity, setTargetMolarity] = useState(0.25);
  const [targetVol, setTargetVol] = useState(250);
  const [soluteMolarityKey, setSoluteMolarityKey] = useState('Na2CO3');
  const reqSolute = SOLUTES_ACID_BASE[soluteMolarityKey] || SOLUTES_ACID_BASE.Na2CO3;
  const reqMassW = (targetMolarity * reqSolute.M * targetVol) / 1000;

  const [percC, setPercC] = useState(40.0);
  const [percH, setPercH] = useState(6.67);
  const [percO, setPercO] = useState(53.33);
  const [molWeightEmp, setMolWeightEmp] = useState(180);
  const rC = percC / 12.01;
  const rH = percH / 1.008;
  const rO = percO / 16.0;
  const minR = Math.min(rC, rH, rO) || 1;
  const eC = Math.round(rC / minR);
  const eH = Math.round(rH / minR);
  const eO = Math.round(rO / minR);
  const empMassCalc = eC * 12.01 + eH * 1.008 + eO * 16.0;
  const factorN = Math.max(1, Math.round(molWeightEmp / (empMassCalc || 1)));

  // Export Solved CQ Worksheet
  const handleExport = async () => {
    if (!containerRef.current) return;
    setIsExporting(true);
    try {
      await exportBrandedGraphic(containerRef.current, {
        fileName: `NextGen_SSC_Chemistry_Ch6_CQ_Solved`,
        cardTitle: 'এসএসসি রসায়ন ৬ষ্ঠ অধ্যায়: বোর্ড স্ট্যান্ডার্ড সৃজনশীল গাণিতিক সমাধান (AI Math Solver)',
        scale: 2
      });
    } catch (e) {
      console.error(e);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6 text-slate-100">
      {/* Top Banner */}
      <div className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <Calculator className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-black flex items-center gap-2">
              রসায়ন ৬ষ্ঠ অধ্যায়: পাত্রভিত্তিক দ্রবণ মিশ্রণ ও বোর্ড CQ সলভার
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs">
                SSC গ ও ঘ সমাধান
              </span>
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              পাত্র-১ ও পাত্র-২ মিশ্রণ • প্রশমন ও লিটমাস পেপার পরীক্ষা • তাপীয় বিয়োজন ও শতকরা উৎপাদ • ঐকিক নিয়ম ও বোর্ড প্রমাণ
            </p>
          </div>
        </div>

        <button
          onClick={handleExport}
          disabled={isExporting}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-emerald-600 text-white font-black text-xs shadow-lg flex items-center gap-2 hover:scale-105 transition-all disabled:opacity-50 flex-shrink-0"
        >
          {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          <span>CQ সমাধান শিট ডাউনলোড (Watermarked)</span>
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: 'beaker', label: '১. পাত্রভিত্তিক দ্রবণ মিশ্রণ ও প্রশমন (Beaker Mixing)', icon: Beaker },
          { id: 'thermal', label: '২. তাপীয় বিয়োজন ও % উৎপাদ (Thermal Decomposition)', icon: Flame },
          { id: 'mole', label: '৩. মোল, কণা ও আয়তন (Mole & Particles)', icon: Sparkles },
          { id: 'molarity', label: '৪. মোলারিটি ও স্থূল সংকেত (Molarity & Empirical)', icon: Layers },
          { id: 'board-cq', label: '৫. এসএসসি বোর্ড সৃজনশীল (গ ও ঘ) মডেল ব্যাংক', icon: BookOpen }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 scale-105'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Solver Workspace */}
      <div ref={containerRef} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">

        {/* ========================================================================= */}
        {/* TAB 1: DUAL BEAKER SOLUTION MIXING & NEUTRALIZATION                       */}
        {/* ========================================================================= */}
        {activeTab === 'beaker' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <h3 className="font-black text-sm text-white flex items-center gap-2">
                <Beaker className="w-4 h-4 text-sky-400" />
                <span>পাত্র-১ ও পাত্র-২ দ্রবণ মিশ্রণ সিমুলেটর (Dual Beaker Neutralization Engine)</span>
              </h3>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 font-bold border border-sky-500/30">
                বোর্ড 'ঘ' নম্বর উচ্চতর দক্ষতার স্ট্যান্ডার্ড
              </span>
            </div>

            {/* Beaker A and Beaker B Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
              {/* Beaker A */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <span className="font-black text-sky-400 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-pulse"></span>
                    পাত্র-১ (Beaker A)
                  </span>
                  <div className="flex gap-1">
                    {['mass', 'molarity'].map(t => (
                      <button
                        key={t}
                        onClick={() => setBeakerA(prev => ({ ...prev, inputType: t }))}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${beakerA.inputType === t ? 'bg-sky-600 text-white' : 'bg-slate-900 text-slate-400'}`}
                      >
                        {t === 'mass' ? 'ভর (W)' : 'মোলারিটি (S)'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-slate-400 font-bold block">দ্রব নির্বাচন (Solute A):</label>
                  <select
                    value={beakerA.soluteKey}
                    onChange={e => setBeakerA(prev => ({ ...prev, soluteKey: e.target.value }))}
                    className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white font-bold"
                  >
                    {Object.entries(SOLUTES_ACID_BASE).map(([k, v]) => (
                      <option key={k} value={k}>{v.name} (M = {v.M})</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-slate-400 font-bold block">আয়তন V₁ (mL):</label>
                    <input
                      type="number"
                      min="10"
                      max="1000"
                      value={beakerA.vol}
                      onChange={e => setBeakerA(prev => ({ ...prev, vol: Math.max(1, +e.target.value) }))}
                      className="w-full p-2 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono"
                    />
                  </div>
                  {beakerA.inputType === 'mass' ? (
                    <div>
                      <label className="text-slate-400 font-bold block">দ্রবের ভর W₁ (g):</label>
                      <input
                        type="number"
                        min="0.1"
                        max="100"
                        step="0.1"
                        value={beakerA.mass}
                        onChange={e => setBeakerA(prev => ({ ...prev, mass: Math.max(0.1, +e.target.value) }))}
                        className="w-full p-2 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono"
                      />
                    </div>
                  ) : (
                    <div>
                      <label className="text-slate-400 font-bold block">মোলারিটি S₁ (M):</label>
                      <input
                        type="number"
                        min="0.01"
                        max="5"
                        step="0.05"
                        value={beakerA.molarity}
                        onChange={e => setBeakerA(prev => ({ ...prev, molarity: Math.max(0.01, +e.target.value) }))}
                        className="w-full p-2 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono"
                      />
                    </div>
                  )}
                </div>

                <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800/80 font-mono text-[11px] text-slate-300 flex justify-between">
                  <span>মোল সংখ্যা n₁ = {molesA.toFixed(4)} mol</span>
                  <span className="text-sky-300 font-bold">{massA.toFixed(2)} g {soluteA.id}</span>
                </div>
              </div>

              {/* Beaker B */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <span className="font-black text-emerald-400 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    পাত্র-২ (Beaker B)
                  </span>
                  <div className="flex gap-1">
                    {['mass', 'molarity'].map(t => (
                      <button
                        key={t}
                        onClick={() => setBeakerB(prev => ({ ...prev, inputType: t }))}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${beakerB.inputType === t ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-slate-400'}`}
                      >
                        {t === 'mass' ? 'ভর (W)' : 'মোলারিটি (S)'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-slate-400 font-bold block">দ্রব নির্বাচন (Solute B):</label>
                  <select
                    value={beakerB.soluteKey}
                    onChange={e => setBeakerB(prev => ({ ...prev, soluteKey: e.target.value }))}
                    className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white font-bold"
                  >
                    {Object.entries(SOLUTES_ACID_BASE).map(([k, v]) => (
                      <option key={k} value={k}>{v.name} (M = {v.M})</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-slate-400 font-bold block">আয়তন V₂ (mL):</label>
                    <input
                      type="number"
                      min="10"
                      max="1000"
                      value={beakerB.vol}
                      onChange={e => setBeakerB(prev => ({ ...prev, vol: Math.max(1, +e.target.value) }))}
                      className="w-full p-2 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono"
                    />
                  </div>
                  {beakerB.inputType === 'mass' ? (
                    <div>
                      <label className="text-slate-400 font-bold block">দ্রবের ভর W₂ (g):</label>
                      <input
                        type="number"
                        min="0.1"
                        max="100"
                        step="0.1"
                        value={beakerB.mass}
                        onChange={e => setBeakerB(prev => ({ ...prev, mass: Math.max(0.1, +e.target.value) }))}
                        className="w-full p-2 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono"
                      />
                    </div>
                  ) : (
                    <div>
                      <label className="text-slate-400 font-bold block">মোলারিটি S₂ (M):</label>
                      <input
                        type="number"
                        min="0.01"
                        max="5"
                        step="0.05"
                        value={beakerB.molarity}
                        onChange={e => setBeakerB(prev => ({ ...prev, molarity: Math.max(0.01, +e.target.value) }))}
                        className="w-full p-2 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono"
                      />
                    </div>
                  )}
                </div>

                <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800/80 font-mono text-[11px] text-slate-300 flex justify-between">
                  <span>মোল সংখ্যা n₂ = {molesB.toFixed(4)} mol</span>
                  <span className="text-emerald-300 font-bold">{massB.toFixed(2)} g {soluteB.id}</span>
                </div>
              </div>
            </div>

            {/* Mixing Result & Litmus Paper Indicator Banner */}
            <div className="p-5 bg-gradient-to-r from-slate-950 via-indigo-950/40 to-slate-950 border border-indigo-500/40 rounded-3xl space-y-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="space-y-1">
                  <span className="text-[10px] text-indigo-300 font-bold uppercase tracking-wider">মিশ্রণের প্রকৃতি ও লিটমাস পেপার পরীক্ষা:</span>
                  <div className="text-lg font-black flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-xl ${isNeutral ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : isAcidic ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'bg-sky-500/20 text-sky-300 border border-sky-500/40'}`}>
                      {isNeutral ? '✅ সম্পূর্ণ প্রশমিত (নিরপেক্ষ)' : isAcidic ? '🧪 অম্লীয় দ্রবণ (Acidic)' : '🫧 ক্ষারীয় দ্রবণ (Basic)'}
                    </span>
                    <span className="text-xs text-slate-300 font-mono">মোট আয়তন = {totalMixVol} mL</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-900 rounded-2xl border border-slate-800 text-xs flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-amber-400" />
                  <span><strong>লিটমাস পেপার রায়:</strong> {litmusVerdict}</span>
                </div>
              </div>

              {/* Excess Reactant Remaining Metric */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">লিমিটিং বিক্রিয়ক (সম্পূর্ণ শেষ হবে):</span>
                  <strong className="text-rose-400 font-mono text-sm block mt-0.5">{limitingSolute.name}</strong>
                </div>

                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">অতিরিক্ত বিক্রিয়কের নাম:</span>
                  <strong className="text-amber-400 font-mono text-sm block mt-0.5">{isNeutral ? 'কোনোটিই নয় (উভয়ই শেষ)' : excessSolute.name}</strong>
                </div>

                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">মিশ্রণে অবশিষ্ট অতিরিক্ত ভর:</span>
                  <strong className="text-emerald-400 font-mono text-base block mt-0.5">{isNeutral ? '0.00 g' : `${excessMassGrams} g (${excessMoles.toFixed(4)} mol)`}</strong>
                </div>
              </div>
            </div>

            {/* Step-by-Step Board Standard CQ Solution Breakdown */}
            <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-bold text-white flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-indigo-400" />
                  <span>বোর্ড পরীক্ষা 'ঘ' নম্বর উচ্চতর দক্ষতার গাণিতিক সমাধান (Board Standard Solution):</span>
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSolutionTab('unitary')}
                    className={`px-2.5 py-1 rounded-lg font-bold text-[11px] ${solutionTab === 'unitary' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
                  >
                    ঐকিক নিয়ম
                  </button>
                  <button
                    onClick={() => setSolutionTab('formula')}
                    className={`px-2.5 py-1 rounded-lg font-bold text-[11px] ${solutionTab === 'formula' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
                  >
                    সূত্র পদ্ধতি
                  </button>
                </div>
              </div>

              {solutionTab === 'unitary' ? (
                <div className="space-y-1.5 font-mono text-slate-300 leading-relaxed text-[11px]">
                  <p><strong>ধাপ ১: পাত্র-১ এ অ্যাসিডের মোল সংখ্যা গণনা:</strong></p>
                  <p>১ মোল {soluteA.id} = {soluteA.M} গ্রাম। অতএব {massA.toFixed(2)} গ্রাম {soluteA.id} = ({massA.toFixed(2)} / {soluteA.M}) = <strong>{molesA.toFixed(4)} মোল</strong></p>
                  <p className="mt-1"><strong>ধাপ ২: পাত্র-২ এ ক্ষারের মোল সংখ্যা গণনা:</strong></p>
                  <p>১ মোল {soluteB.id} = {soluteB.M} গ্রাম। অতএব {massB.toFixed(2)} গ্রাম {soluteB.id} = ({massB.toFixed(2)} / {soluteB.M}) = <strong>{molesB.toFixed(4)} মোল</strong></p>
                  <p className="mt-1"><strong>ধাপ ৩: সমতাকৃত বিক্রিয়া ও সমতুল্য অনুপাত:</strong></p>
                  <p>{soluteA.id} + {soluteB.id} ➔ লবণ + পানি</p>
                  <p>১ মোল অ্যাসিড প্রশমিত করতে প্রয়োজনীয় ক্ষার = ১ মোল। এখানে অ্যাসিডের মোল = {molesA.toFixed(4)} mol এবং ক্ষারের মোল = {molesB.toFixed(4)} mol</p>
                  <p className="mt-1"><strong>ধাপ ৪: সিদ্ধান্ত ও লিটমাস পরীক্ষা:</strong></p>
                  <p>যেহেতু {excessSolute.name} এর পরিমাণ বেশি, তাই লিমিটিং বিক্রিয়ক হলো {limitingSolute.name}। বিক্রিয়া শেষে পাত্রে অবশিষ্ট থাকবে <strong>{excessMassGrams} গ্রাম {excessSolute.id}</strong>।</p>
                  <p className="text-emerald-400 font-bold">অতএব মিশ্রিত দ্রবণের প্রকৃতি {isNeutral ? 'নিরপেক্ষ' : isAcidic ? 'অম্লীয়' : 'ক্ষারীয়'} হবে এবং {litmusVerdict}।</p>
                </div>
              ) : (
                <div className="space-y-1.5 font-mono text-slate-300 leading-relaxed text-[11px]">
                  <p>আমরা জানি, মোল সংখ্যা n = W / M = (S × V_mL) / 1000</p>
                  <p>পাত্র-১ এ n₁ = ({beakerA.vol} × {soluteA.type === 'acid' ? soluteA.M : 1}) / ... = <strong>{molesA.toFixed(4)} mol {soluteA.id}</strong></p>
                  <p>পাত্র-২ এ n₂ = <strong>{molesB.toFixed(4)} mol {soluteB.id}</strong></p>
                  <p>তুল্য অনুপাত (Equivalent Ratio) Δn = |{eqAcid.toFixed(4)} - {eqBase.toFixed(4)}| = <strong>{excessEq.toFixed(4)} eq</strong></p>
                  <p>অবশিষ্ট অতিরিক্ত দ্রবের ভর W(excess) = n(excess) × M = {excessMoles.toFixed(4)} × {excessSolute.M} = <strong className="text-emerald-400">{excessMassGrams} g</strong></p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: THERMAL DECOMPOSITION & % YIELD                                    */}
        {/* ========================================================================= */}
        {activeTab === 'thermal' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <h3 className="font-black text-sm text-white flex items-center gap-2">
                <Flame className="w-4 h-4 text-rose-400" />
                <span>তাপীয় বিয়োজন ও উৎপাদের শতকরা পরিমাণ (% Yield Engine)</span>
              </h3>
              <span className="text-xs text-slate-400 font-mono">% Yield = (Actual / Theoretical) × 100</span>
            </div>

            {/* Reaction Select */}
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2 text-xs">
              <label className="text-slate-400 font-bold block">তাপীয় বিয়োজন সমীকরণ নির্বাচন করুন:</label>
              <select
                value={thermalRxnId}
                onChange={e => setThermalRxnId(e.target.value)}
                className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white font-bold"
              >
                {THERMAL_REACTIONS.map(r => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
            </div>

            {/* Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                <label className="text-slate-400 font-bold block">বিক্রিয়কের গৃহীত ভর ({curThermal.reactant}): {reactMassInput} g</label>
                <input
                  type="number"
                  min="0.5"
                  max="500"
                  step="0.5"
                  value={reactMassInput}
                  onChange={e => setReactMassInput(Math.max(0.1, +e.target.value))}
                  className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono"
                />
              </div>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                <label className="text-slate-400 font-bold block">বাস্তবে প্রাপ্ত উৎপাদের ভর ({curThermal.product}): {actualObtainedYield} g</label>
                <input
                  type="number"
                  min="0.1"
                  max="500"
                  step="0.1"
                  value={actualObtainedYield}
                  onChange={e => setActualObtainedYield(Math.max(0.1, +e.target.value))}
                  className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono"
                />
              </div>
            </div>

            {/* Outputs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl">
                <span className="text-slate-400 block text-[10px] uppercase">তাত্ত্বিক উৎপাদ (Theoretical Yield):</span>
                <span className="text-2xl font-black text-white font-mono mt-1 block">{theoMassProd.toFixed(2)} g</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">এসটিপিতে আয়তন = {theoGasVolSTP.toFixed(2)} L</span>
              </div>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl">
                <span className="text-slate-400 block text-[10px] uppercase">বাস্তবে প্রাপ্ত ভর (Actual Yield):</span>
                <span className="text-2xl font-black text-amber-300 font-mono mt-1 block">{actualObtainedYield} g</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">পরীক্ষাগারে সংগৃহীত</span>
              </div>

              <div className="p-4 bg-gradient-to-br from-emerald-950/60 to-slate-950 border border-emerald-500/40 rounded-2xl">
                <span className="text-emerald-300 block text-[10px] uppercase font-bold">উৎপাদের শতকরা হার (% Yield):</span>
                <span className="text-3xl font-black text-emerald-400 font-mono mt-1 block">{percentYield}%</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">% Yield = (Actual / Theoretical) × 100</span>
              </div>
            </div>

            {/* Step-by-Step Derivation */}
            <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-2 text-xs font-mono text-slate-300">
              <p><strong>গাণিতিক সমাধান ধাপসমূহ:</strong></p>
              <p>১. বিক্রিয়ার সমীকরণ: {curThermal.name}</p>
              <p>২. {curThermal.coeff_react} × {curThermal.M_react} = {(curThermal.coeff_react * curThermal.M_react).toFixed(2)} গ্রাম {curThermal.reactant} থেকে তাত্ত্বিকভাবে উৎপন্ন হয় = {(curThermal.coeff_prod * curThermal.M_prod).toFixed(2)} গ্রাম {curThermal.product}</p>
              <p>৩. অতএব {reactMassInput} গ্রাম {curThermal.reactant} থেকে তাত্ত্বিক উৎপাদ = ({reactMassInput} × {(curThermal.coeff_prod * curThermal.M_prod).toFixed(2)}) / {(curThermal.coeff_react * curThermal.M_react).toFixed(2)} = <strong className="text-white">{theoMassProd.toFixed(2)} গ্রাম</strong></p>
              <p>৪. উৎপাদের শতকরা হার = (বাস্তব উৎপাদ / তাত্ত্বিক উৎপাদ) × ১০০ = ({actualObtainedYield} / {theoMassProd.toFixed(2)}) × ১০০ = <strong className="text-emerald-400">{percentYield}%</strong></p>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: MOLE, PARTICLES & ATOMS CONVERTER                                  */}
        {/* ========================================================================= */}
        {activeTab === 'mole' && (
          <div className="space-y-5 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-black text-sm text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>মোল, অণু ও পৃথক পরমাণু সংখ্যা ক্যালকুলেটর</span>
              </h3>
              <span className="text-slate-400 font-mono">n = W/M = N/NA = V/22.4L</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                <label className="text-slate-400 font-bold block">পদার্থ নির্বাচন:</label>
                <select
                  value={moleSubstance}
                  onChange={e => setMoleSubstance(e.target.value)}
                  className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white font-bold"
                >
                  {Object.entries(SUBSTANCES_LIB).map(([k, v]) => (
                    <option key={k} value={k}>{v.name} (M = {v.M})</option>
                  ))}
                </select>
              </div>

              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                <label className="text-slate-400 font-bold block">ভর W (গ্রাম): {inputMassMole} g</label>
                <input
                  type="number"
                  min="0.1"
                  max="500"
                  step="0.1"
                  value={inputMassMole}
                  onChange={e => setInputMassMole(Math.max(0.1, +e.target.value))}
                  className="w-full p-2 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 bg-indigo-950/40 border border-indigo-500/30 rounded-2xl">
                <span className="text-slate-400 block text-[10px]">মোল সংখ্যা (n):</span>
                <span className="text-2xl font-black text-indigo-300 font-mono mt-1 block">{calcMoles.toFixed(4)} mol</span>
              </div>
              <div className="p-4 bg-emerald-950/40 border border-emerald-500/30 rounded-2xl">
                <span className="text-slate-400 block text-[10px]">মোট অণু সংখ্যা (N):</span>
                <span className="text-xl font-black text-emerald-300 font-mono mt-1 block">{calcMolecules.toExponential(3)} টি</span>
              </div>
              <div className="p-4 bg-sky-950/40 border border-sky-500/30 rounded-2xl">
                <span className="text-slate-400 block text-[10px]">এসটিপিতে আয়তন (V):</span>
                <span className="text-2xl font-black text-sky-300 font-mono mt-1 block">{calcVolSTP.toFixed(2)} L</span>
              </div>
            </div>

            {/* Individual Atom Breakdown */}
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
              <span className="text-amber-300 font-bold block">প্রতিটি পরমাণুর পৃথক সংখ্যা:</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {curMoleSub.atoms.map(at => (
                  <div key={at.sym} className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block">{at.sym} পরমাণু ({at.count}টি/অণু):</span>
                    <strong className="text-white font-mono">{(calcMolecules * at.count).toExponential(3)} টি</strong>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: MOLARITY & EMPIRICAL FORMULA                                       */}
        {/* ========================================================================= */}
        {activeTab === 'molarity' && (
          <div className="space-y-6 text-xs">
            {/* Molarity Section */}
            <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
              <h4 className="font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-sky-400" />
                <span>প্রয়োজনীয় দ্রবের ভর নির্ণয় (W = SMV / 1000):</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-400 font-bold block">দ্রব:</label>
                  <select
                    value={soluteMolarityKey}
                    onChange={e => setSoluteMolarityKey(e.target.value)}
                    className="w-full p-2 bg-slate-900 border border-slate-800 rounded-xl text-white font-bold"
                  >
                    {Object.entries(SOLUTES_ACID_BASE).map(([k, v]) => (
                      <option key={k} value={k}>{v.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 font-bold block">কাঙ্ক্ষিত মোলারিটি S (M):</label>
                  <input type="number" step="0.05" value={targetMolarity} onChange={e => setTargetMolarity(+e.target.value)} className="w-full p-2 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono" />
                </div>
                <div>
                  <label className="text-slate-400 font-bold block">দ্রবণের আয়তন V (mL):</label>
                  <input type="number" step="10" value={targetVol} onChange={e => setTargetVol(+e.target.value)} className="w-full p-2 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono" />
                </div>
              </div>
              <div className="p-3 bg-slate-900 rounded-xl flex justify-between items-center">
                <span>প্রয়োজনীয় দ্রবের ভর (W):</span>
                <span className="text-xl font-black text-sky-400 font-mono">{reqMassW.toFixed(3)} গ্রাম</span>
              </div>
            </div>

            {/* Empirical Formula Section */}
            <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
              <h4 className="font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-teal-400" />
                <span>শতকরা সংযুতি থেকে স্থূল সংকেত ও আণবিক সংকেত:</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                <div>
                  <label className="text-slate-400 block">% C:</label>
                  <input type="number" step="0.1" value={percC} onChange={e => setPercC(+e.target.value)} className="w-full p-2 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono" />
                </div>
                <div>
                  <label className="text-slate-400 block">% H:</label>
                  <input type="number" step="0.1" value={percH} onChange={e => setPercH(+e.target.value)} className="w-full p-2 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono" />
                </div>
                <div>
                  <label className="text-slate-400 block">% O:</label>
                  <input type="number" step="0.1" value={percO} onChange={e => setPercO(+e.target.value)} className="w-full p-2 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono" />
                </div>
                <div>
                  <label className="text-slate-400 block">আণবিক ভর M:</label>
                  <input type="number" value={molWeightEmp} onChange={e => setMolWeightEmp(+e.target.value)} className="w-full p-2 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-teal-950/40 border border-teal-500/40 rounded-xl flex justify-between items-center">
                  <span>স্থূল সংকেত:</span>
                  <strong className="text-teal-300 font-mono text-lg">C{eC > 1 ? eC : ''}H{eH > 1 ? eH : ''}O{eO > 1 ? eO : ''}</strong>
                </div>
                <div className="p-3 bg-indigo-950/40 border border-indigo-500/40 rounded-xl flex justify-between items-center">
                  <span>আণবিক সংকেত:</span>
                  <strong className="text-indigo-300 font-mono text-lg">C{eC * factorN}H{eH * factorN}O{eO * factorN}</strong>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: SSC BOARD CREATIVE QUESTION (CQ) BANK                             */}
        {/* ========================================================================= */}
        {activeTab === 'board-cq' && (
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-black text-sm text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-400" />
                <span>এসএসসি বোর্ড স্ট্যান্ডার্ড সৃজনশীল প্রশ্ন (গ ও ঘ সমাধান ব্যাংক)</span>
              </h3>
              <span className="text-slate-400">ঢাকা, চট্টগ্রাম, রাজশাহী ও যশোর বোর্ড অনুরূপ</span>
            </div>

            <div className="space-y-4">
              {/* CQ 1: Beaker Mixing */}
              <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                <h4 className="font-bold text-amber-300 text-sm">
                  উদ্দীপক ১: পাত্র-A তে ২৫০ mL 0.1 M HCl এবং পাত্র-B তে ১০০ mL 0.2 M NaOH দ্রবণ রাখা আছে।
                </h4>
                <div className="space-y-2 p-3.5 bg-slate-900 rounded-xl font-mono text-slate-300">
                  <p className="text-sky-400 font-bold">প্রশ্ন (গ): পাত্র-A এর দ্রবণে কত গ্রাম দ্রবীভূত HCl বিদ্যমান? [মান: ৩]</p>
                  <p className="pl-3 border-l-2 border-sky-500">
                    সমাধান: W = (S × M × V) / 1000 = (0.1 × 36.5 × 250) / 1000 = <strong>0.9125 গ্রাম HCl</strong>
                  </p>
                  <p className="text-emerald-400 font-bold mt-2">প্রশ্ন (ঘ): পাত্র-A ও পাত্র-B এর দ্রবণ মিশ্রিত করলে মিশ্রণটি লিটমাস পেপারের বর্ণ পরিবর্তন করবে কি? গাণিতিকভাবে বিশ্লেষণ করো। [মান: ৪]</p>
                  <p className="pl-3 border-l-2 border-emerald-500">
                    সমাধান: পাত্র-A তে অ্যাসিডের মোল = (0.1 × 250) / 1000 = 0.025 mol HCl<br/>
                    পাত্র-B তে ক্ষারের মোল = (0.2 × 100) / 1000 = 0.020 mol NaOH<br/>
                    বিক্রিয়া: HCl + NaOH ➔ NaCl + H₂O<br/>
                    এখানে 0.020 mol NaOH প্রশমিত করতে 0.020 mol HCl প্রয়োজন।<br/>
                    পাত্রে অবশিষ্ট অ্যাসিডের পরিমাণ = 0.025 - 0.020 = 0.005 মোল = (0.005 × 36.5) = <strong>0.1825 গ্রাম HCl</strong>।<br/>
                    যেহেতু মিশ্রণে অ্যাসিড অবশিষ্ট থাকবে, তাই দ্রবণটি অম্লীয় হবে এবং নীল লিটমাস পেপারকে লাল করবে।
                  </p>
                </div>
              </div>

              {/* CQ 2: Thermal Decomposition & % Yield */}
              <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                <h4 className="font-bold text-amber-300 text-sm">
                  উদ্দীপক ২: গবেষণাগারে ২৪.৫ গ্রাম KClO₃ তাপীয় বিয়োজন করে বাস্তবে ৮.০ গ্রাম O₂ গ্যাস পাওয়া গেল।
                </h4>
                <div className="space-y-2 p-3.5 bg-slate-900 rounded-xl font-mono text-slate-300">
                  <p className="text-sky-400 font-bold">প্রশ্ন (গ): এসটিপিতে তাত্ত্বিকভাবে কত লিটার অক্সিজেন গ্যাস উৎপন্ন হওয়া সম্ভব? [মান: ৩]</p>
                  <p className="pl-3 border-l-2 border-sky-500">
                    সমাধান: 2KClO₃ (245.1g) ➔ 2KCl + 3O₂ (3 × 22.4 = 67.2 L)<br/>
                    ২৪.৫ গ্রাম KClO₃ থেকে প্রাপ্ত O₂ = (২৪.৫ × ৬৭.২) / ২৪৫.১ = <strong>৬.৭২ লিটার</strong>
                  </p>
                  <p className="text-emerald-400 font-bold mt-2">প্রশ্ন (ঘ): উদ্দীপকে বিক্রিয়াটির উৎপাদের শতকরা পরিমাণ (% Yield) নির্ণয় করে মন্তব্য করো। [মান: ৪]</p>
                  <p className="pl-3 border-l-2 border-emerald-500">
                    সমাধান: ২৪৫.১ গ্রাম KClO₃ থেকে তাত্ত্বিক O₂ ভর = ৩ × ৩২ = ৯৬ গ্রাম<br/>
                    ২৪.৫ গ্রাম KClO₃ থেকে তাত্ত্বিক ভর = (২৪.৫ × ৯৬) / ২৪৫.১ = ৯.৬০ গ্রাম<br/>
                    বাস্তবে প্রাপ্ত ভর = ৮.০ গ্রাম<br/>
                    উৎপাদের শতকরা হার (% Yield) = (৮.০ / ৯.৬০) × ১০০ = <strong>৮৩.৩৩%</strong>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
