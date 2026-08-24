import React, { useState, useRef, useMemo } from 'react';
import {
  Zap, Atom, Brain, Download, Loader2, Sparkles, BookOpen,
  CheckCircle2, Layers, ArrowRight, Droplets, Compass,
  HelpCircle, Eye, RefreshCw, ShieldAlert, ShieldCheck, Activity,
  Info, Cpu
} from 'lucide-react';
import { exportBrandedGraphic } from '../../utils/exportBrandedGraphic';

// Standard 118 Elements lookup for Symbolic Element Decoder
const PERIODIC_LOOKUP = [
  { n: 1, sym: 'H', nameBn: 'হাইড্রোজেন', group: 1, period: 1, val: 1, en: 2.20, ec: '1s¹', valConf: '1s¹' },
  { n: 2, sym: 'He', nameBn: 'হিলিয়াম', group: 18, period: 1, val: 0, en: 0, ec: '1s²', valConf: '1s²' },
  { n: 3, sym: 'Li', nameBn: 'লিথিয়াম', group: 1, period: 2, val: 1, en: 0.98, ec: '[He] 2s¹', valConf: '2s¹' },
  { n: 4, sym: 'Be', nameBn: 'বেরিলিয়াম', group: 2, period: 2, val: 2, en: 1.57, ec: '[He] 2s²', valConf: '2s²' },
  { n: 5, sym: 'B', nameBn: 'বোরন', group: 13, period: 2, val: 3, en: 2.04, ec: '[He] 2s² 2p¹', valConf: '2s² 2p¹' },
  { n: 6, sym: 'C', nameBn: 'কার্বন', group: 14, period: 2, val: 4, en: 2.55, ec: '[He] 2s² 2p²', valConf: '2s² 2p²' },
  { n: 7, sym: 'N', nameBn: 'নাইট্রোজেন', group: 15, period: 2, val: 3, en: 3.04, ec: '[He] 2s² 2p³', valConf: '2s² 2p³' },
  { n: 8, sym: 'O', nameBn: 'অক্সিজেন', group: 16, period: 2, val: 2, en: 3.44, ec: '[He] 2s² 2p⁴', valConf: '2s² 2p⁴' },
  { n: 9, sym: 'F', nameBn: 'ফ্লোরিন', group: 17, period: 2, val: 1, en: 3.98, ec: '[He] 2s² 2p⁵', valConf: '2s² 2p⁵' },
  { n: 10, sym: 'Ne', nameBn: 'নিয়ন', group: 18, period: 2, val: 0, en: 0, ec: '[He] 2s² 2p⁶', valConf: '2s² 2p⁶' },
  { n: 11, sym: 'Na', nameBn: 'সোডিয়াম', group: 1, period: 3, val: 1, en: 0.93, ec: '[Ne] 3s¹', valConf: '3s¹' },
  { n: 12, sym: 'Mg', nameBn: 'ম্যাগনেসিয়াম', group: 2, period: 3, val: 2, en: 1.31, ec: '[Ne] 3s²', valConf: '3s²' },
  { n: 13, sym: 'Al', nameBn: 'অ্যালুমিনিয়াম', group: 13, period: 3, val: 3, en: 1.61, ec: '[Ne] 3s² 3p¹', valConf: '3s² 3p¹' },
  { n: 14, sym: 'Si', nameBn: 'সিলিকন', group: 14, period: 3, val: 4, en: 1.90, ec: '[Ne] 3s² 3p²', valConf: '3s² 3p²' },
  { n: 15, sym: 'P', nameBn: 'ফসফরাস', group: 15, period: 3, val: 3, en: 2.19, ec: '[Ne] 3s² 3p³', valConf: '3s² 3p³' },
  { n: 16, sym: 'S', nameBn: 'সালফার', group: 16, period: 3, val: 2, en: 2.58, ec: '[Ne] 3s² 3p⁴', valConf: '3s² 3p⁴' },
  { n: 17, sym: 'Cl', nameBn: 'ক্লোরিন', group: 17, period: 3, val: 1, en: 3.16, ec: '[Ne] 3s² 3p⁵', valConf: '3s² 3p⁵' },
  { n: 18, sym: 'Ar', nameBn: 'আর্গন', group: 18, period: 3, val: 0, en: 0, ec: '[Ne] 3s² 3p⁶', valConf: '3s² 3p⁶' },
  { n: 19, sym: 'K', nameBn: 'পটাশিয়াম', group: 1, period: 4, val: 1, en: 0.82, ec: '[Ar] 4s¹', valConf: '4s¹' },
  { n: 20, sym: 'Ca', nameBn: 'ক্যালসিয়াম', group: 2, period: 4, val: 2, en: 1.00, ec: '[Ar] 4s²', valConf: '4s²' },
];

// Preloaded Comprehensive Compounds Library for Lewis Diagrams & Octet Exceptions
const BONDING_COMPOUNDS = [
  {
    formula: 'CCl4',
    name: 'কার্বন টেট্রাক্লোরাইড (CCl₄)',
    type: 'covalent',
    centralAtom: 'C',
    bondedAtoms: [{ sym: 'Cl', count: 4, singleBonds: 1 }],
    centralValenceElectrons: 4,
    bondPairs: 4,
    lonePairs: 0,
    octetStatus: 'পূর্ণ (অষ্টক নিয়ম মানে)',
    octetExplanation: 'কার্বনের যোজনী স্তরের ৪টি ইলেকট্রন ৪টি ক্লোরিনের ৪টি ইলেকট্রনের সাথে শেয়ার করে মোট ৮টি ইলেকট্রন অর্জন করেছে।',
    enDiff: 0.61,
    isPolar: false, // symmetric tetrahedral nonpolar
    solubility: 'অদ্রবণীয় (অপোলার সমযোজী যৌগ, পানিতে দ্রবীভূত হয় না)'
  },
  {
    formula: 'PCl5',
    name: 'ফসফরাস পেন্টাক্লোরাইড (PCl₅)',
    type: 'covalent',
    centralAtom: 'P',
    bondedAtoms: [{ sym: 'Cl', count: 5, singleBonds: 1 }],
    centralValenceElectrons: 5,
    bondPairs: 5,
    lonePairs: 0,
    octetStatus: 'অষ্টক সম্প্রসারণ (Octet Expansion - ১০টি ইলেকট্রন)',
    octetExplanation: 'ফসফরাসের যোজ্যতা স্তরের ৫টি ইলেকট্রন ৫টি ক্লোরিনের সাথে ৫ জোড়া বন্ধন তৈরি করে মোট ১০টি ইলেকট্রন ধারণ করে, যা অষ্টক সম্প্রসারণের ব্যতিক্রম।',
    enDiff: 0.97,
    isPolar: false, // symmetric trigonal bipyramidal nonpolar
    solubility: 'হাইড্রোলাইসিস বিক্রিয়ায় বিয়োজিত হয়'
  },
  {
    formula: 'BF3',
    name: 'বোরন ট্রাইফ্লোরাইড (BF₃)',
    type: 'covalent',
    centralAtom: 'B',
    bondedAtoms: [{ sym: 'F', count: 3, singleBonds: 1 }],
    centralValenceElectrons: 3,
    bondPairs: 3,
    lonePairs: 0,
    octetStatus: 'অষ্টক সংকোচন (Octet Contraction - ৬টি ইলেকট্রন)',
    octetExplanation: 'বোরনের ৩টি যোজনী ইলেকট্রন ৩টি ফ্লোরিনের সাথে শেয়ার করে মোট ৬টি ইলেকট্রন অর্জন করে, ফলে এর অষ্টক অপূর্ণ থেকে যায় (অষ্টক সংকোচন)।',
    enDiff: 1.94,
    isPolar: false, // symmetric trigonal planar nonpolar
    solubility: 'লুইস অ্যাসিড হিসেবে বিক্রিয়া করে'
  },
  {
    formula: 'H2O',
    name: 'পানি (H₂O)',
    type: 'covalent',
    centralAtom: 'O',
    bondedAtoms: [{ sym: 'H', count: 2, singleBonds: 1 }],
    centralValenceElectrons: 6,
    bondPairs: 2,
    lonePairs: 2,
    octetStatus: 'পূর্ণ (অষ্টক নিয়ম মানে)',
    octetExplanation: 'অক্সিজেনের ৬টি ইলেকট্রনের মধ্যে ২টি ইলেকট্রন ২টি H পরমাণুর সাথে শেয়ার হয় (২ জোড়া বন্ধন) এবং বাকি ৪টি ইলেকট্রন ২ জোড়া মুক্তজোড় (Lone pair) হিসেবে থাকে।',
    enDiff: 1.24,
    isPolar: true, // Bent structure dipole moment != 0
    solubility: 'পোলার সমযোজী দ্রাবক (Universal Solvent)'
  },
  {
    formula: 'NH3',
    name: 'অ্যামোনিয়া (NH₃)',
    type: 'covalent',
    centralAtom: 'N',
    bondedAtoms: [{ sym: 'H', count: 3, singleBonds: 1 }],
    centralValenceElectrons: 5,
    bondPairs: 3,
    lonePairs: 1,
    octetStatus: 'পূর্ণ (অষ্টক নিয়ম মানে)',
    octetExplanation: 'নাইট্রোজেনের ৫টি যোজনী ইলেকট্রনের মধ্যে ৩টি ইলেকট্রন ৩টি হাইড্রোজেনের সাথে ৩ জোড়া বন্ধন এবং ১ জোড়া মুক্তজোড় (Lone Pair) গঠন করে মোট ৮টি ইলেকট্রন পূর্ণ করে।',
    enDiff: 0.84,
    isPolar: true,
    solubility: 'পানিতে অত্যন্ত দ্রবণীয় (হাইড্রোজেন বন্ধন গঠন করে)'
  },
  {
    formula: 'NaCl',
    name: 'সোডিয়াম ক্লোরাইড (NaCl)',
    type: 'ionic',
    centralAtom: 'Na⁺',
    bondedAtoms: [{ sym: 'Cl⁻', count: 1 }],
    centralValenceElectrons: 8,
    bondPairs: 0,
    lonePairs: 4,
    octetStatus: 'পূর্ণ (আয়নিক অষ্টক পূরণ)',
    octetExplanation: 'সোডিয়াম (Na) ১টি ইলেকট্রন বর্জন করে Na⁺ ক্যাটায়নে এবং ক্লোরিন (Cl) সেই ইলেকট্রন গ্রহণ করে Cl⁻ অ্যানায়নে পরিণত হয়ে উভয়েই নিষ্ক্রিয় গ্যাসের স্থিতিশীল অষ্টক লাভ করে।',
    enDiff: 2.23,
    isPolar: true,
    solubility: 'পানিতে সম্পূর্ণ দ্রবণীয় (আয়ন-ডাইপোল আকর্ষণ ও হাইড্রেশন শক্তি দ্বারা ল্যাটিস ভেঙে যায়)'
  },
  {
    formula: 'CaCl2',
    name: 'ক্যালসিয়াম ক্লোরাইড (CaCl₂)',
    type: 'ionic',
    centralAtom: 'Ca²⁺',
    bondedAtoms: [{ sym: 'Cl⁻', count: 2 }],
    centralValenceElectrons: 8,
    bondPairs: 0,
    lonePairs: 4,
    octetStatus: 'পূর্ণ (আয়নিক অষ্টক পূরণ)',
    octetExplanation: 'ক্যালসিয়াম (Ca) ২টি ইলেকট্রন বর্জন করে Ca²⁺ এবং ২টি ক্লোরিন পরমাণু প্রত্যেকে ১টি করে ইলেকট্রন গ্রহণ করে ২টি Cl⁻ আয়ন তৈরি করে।',
    enDiff: 2.16,
    isPolar: true,
    solubility: 'পানিতে অত্যন্ত দ্রবণীয়'
  }
];

export default function ChemistryChapter5BondingSolver() {
  const [activeTab, setActiveTab] = useState('decoder'); // 'decoder' | 'lewis' | 'octet' | 'polarity' | 'board-cq'
  const [isExporting, setIsExporting] = useState(false);
  const containerRef = useRef(null);

  // 1. Symbolic Element Decoder State
  const [decoderType, setDecoderType] = useState('periodGroup'); // 'periodGroup' | 'valConfig' | 'atomicNum'
  const [selectedPeriod, setSelectedPeriod] = useState(3);
  const [selectedGroup, setSelectedGroup] = useState(15);
  const [atomicNumInput, setAtomicNumInput] = useState(15);
  const [valConfigInput, setValConfigInput] = useState('ns2 np3');

  // Decoded Element
  const decodedElement = useMemo(() => {
    if (decoderType === 'periodGroup') {
      return PERIODIC_LOOKUP.find(e => e.period === selectedPeriod && e.group === selectedGroup) || PERIODIC_LOOKUP[14]; // P
    } else if (decoderType === 'atomicNum') {
      return PERIODIC_LOOKUP.find(e => e.n === atomicNumInput) || PERIODIC_LOOKUP[14];
    } else {
      // Config matching
      if (valConfigInput.includes('np3')) return PERIODIC_LOOKUP[14]; // P
      if (valConfigInput.includes('np5')) return PERIODIC_LOOKUP[16]; // Cl
      if (valConfigInput.includes('ns1')) return PERIODIC_LOOKUP[10]; // Na
      if (valConfigInput.includes('np4')) return PERIODIC_LOOKUP[7]; // O
      return PERIODIC_LOOKUP[14];
    }
  }, [decoderType, selectedPeriod, selectedGroup, atomicNumInput, valConfigInput]);

  // 2. Lewis & Octet Selected Compound State
  const [selectedCompoundKey, setSelectedCompoundKey] = useState('PCl5');
  const compound = useMemo(() => {
    return BONDING_COMPOUNDS.find(c => c.formula === selectedCompoundKey) || BONDING_COMPOUNDS[0];
  }, [selectedCompoundKey]);

  // 3. Hydration Animation State
  const [isDissolved, setIsDissolved] = useState(false);

  // Export Solved Worksheet
  const handleExport = async () => {
    if (!containerRef.current) return;
    setIsExporting(true);
    try {
      await exportBrandedGraphic(containerRef.current, {
        fileName: `NextGen_SSC_Chemistry_Ch5_Bonding_Solved`,
        cardTitle: 'এসএসসি রসায়ন ৫ম অধ্যায়: রাসায়নিক বন্ধন ও সৃজনশীল ভিজ্যুয়ালাইজার (AI Bonding Engine)',
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
      <div className="p-6 bg-gradient-to-r from-slate-900 via-teal-950/40 to-slate-900 border border-slate-800 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-teal-500/20 text-teal-400 border border-teal-500/30">
            <Zap className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-black flex items-center gap-2">
              রসায়ন ৫ম অধ্যায়: রাসায়নিক বন্ধন সৃজনশীল সলভার ও ডট-ক্রস ইঞ্জিন
              <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs">
                SSC চ্যাপ্টার-৫
              </span>
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              প্রতীকী মৌল ডিকোডার • ডট-ক্রস লুইস ডায়াগ্রাম • অষ্টক সম্প্রসারণ ও সংকোচন • পোলারিটি ও হাইড্রেশন সিমুলেটর
            </p>
          </div>
        </div>

        <button
          onClick={handleExport}
          disabled={isExporting}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-indigo-600 text-white font-black text-xs shadow-lg flex items-center gap-2 hover:scale-105 transition-all disabled:opacity-50 flex-shrink-0"
        >
          {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          <span>বন্ধন সমাধান ডাউনলোড (Watermarked)</span>
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: 'decoder', label: '১. প্রতীকী মৌল ডিকোডার (Element Decoder)', icon: Cpu },
          { id: 'lewis', label: '২. ডট-ক্রস লুইস গঠন (Lewis Dot-Cross)', icon: Atom },
          { id: 'octet', label: '৩. অষ্টক নিয়ম ও ব্যতিক্রম (Octet Validator)', icon: ShieldCheck },
          { id: 'polarity', label: '৪. পোলারিটি ও পানিতে দ্রাব্যতা (Hydration)', icon: Droplets },
          { id: 'board-cq', label: '৫. বোর্ড সৃজনশীল (CQ) সমাধান ব্যাংক', icon: BookOpen }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black transition-all ${
                isActive
                  ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/30 scale-105'
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
        {/* TAB 1: SYMBOLIC ELEMENT DECODER                                           */}
        {/* ========================================================================= */}
        {activeTab === 'decoder' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <h3 className="font-black text-sm text-white flex items-center gap-2">
                <Cpu className="w-4 h-4 text-teal-400" />
                <span>উদ্দীপকের প্রতীকী মৌল ডিকোডার (Symbolic Unknown Element Decoder)</span>
              </h3>
              <span className="text-xs text-slate-400 font-mono">X, Y, Z মৌল শনাক্তকরণ ইঞ্জিন</span>
            </div>

            {/* Input Selection Mode */}
            <div className="flex gap-2">
              {[
                { id: 'periodGroup', label: 'পর্যায় ও গ্রুপ দ্বারা শনাক্তকরণ' },
                { id: 'valConfig', label: 'যোজনী স্তরের ইলেকট্রন বিন্যাস দ্বারা' },
                { id: 'atomicNum', label: 'পারমাণবিক সংখ্যা দ্বারা' }
              ].map(m => (
                <button
                  key={m.id}
                  onClick={() => setDecoderType(m.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${decoderType === m.id ? 'bg-teal-600 text-white shadow-md' : 'bg-slate-950 text-slate-400 hover:text-white'}`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {/* Dynamic Controls based on Selection */}
            <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl">
              {decoderType === 'periodGroup' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="text-slate-400 font-bold block mb-1">পর্যায় (Period): {selectedPeriod}</label>
                    <select
                      value={selectedPeriod}
                      onChange={e => setSelectedPeriod(+e.target.value)}
                      className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white font-bold"
                    >
                      {[1, 2, 3, 4].map(p => (
                        <option key={p} value={p}>পর্যায় {p}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-slate-400 font-bold block mb-1">গ্রুপ (Group): {selectedGroup}</label>
                    <select
                      value={selectedGroup}
                      onChange={e => setSelectedGroup(+e.target.value)}
                      className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white font-bold"
                    >
                      {[1, 2, 13, 14, 15, 16, 17, 18].map(g => (
                        <option key={g} value={g}>গ্রুপ {g}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {decoderType === 'valConfig' && (
                <div className="space-y-2 text-xs">
                  <label className="text-slate-400 font-bold block">সর্ববহিঃস্থ স্তরের সাধারণ ইলেকট্রন বিন্যাস নির্বাচন করুন:</label>
                  <select
                    value={valConfigInput}
                    onChange={e => setValConfigInput(e.target.value)}
                    className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white font-bold"
                  >
                    <option value="ns2 np3">ns² np³ (যেমন: ৩য় পর্যায়ের ১৫ নং গ্রুপ ➔ P)</option>
                    <option value="ns2 np5">ns² np⁵ (যেমন: হ্যালোজেন ➔ Cl)</option>
                    <option value="ns1">ns¹ (যেমন: ক্ষার ধাতু ➔ Na)</option>
                    <option value="ns2 np4">ns² np⁴ (যেমন: চ্যালকোজেন ➔ O)</option>
                  </select>
                </div>
              )}

              {decoderType === 'atomicNum' && (
                <div className="space-y-2 text-xs">
                  <label className="text-slate-400 font-bold block">প্রতীকী মৌল X এর পারমাণবিক সংখ্যা: {atomicNumInput}</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={atomicNumInput}
                    onChange={e => setAtomicNumInput(Math.min(20, Math.max(1, +e.target.value)))}
                    className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono font-bold"
                  />
                </div>
              )}
            </div>

            {/* Decoded Element Result Card */}
            {decodedElement && (
              <div className="p-6 bg-gradient-to-r from-slate-950 via-teal-950/50 to-slate-950 border border-teal-500/40 rounded-3xl space-y-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-4">
                  <div>
                    <span className="text-[10px] text-teal-400 uppercase tracking-widest font-mono">শনাক্তকৃত আসল মৌল (Decoded Element):</span>
                    <h3 className="text-2xl font-black text-white flex items-center gap-3 mt-1">
                      <span className="w-12 h-12 rounded-2xl bg-teal-500/20 border-2 border-teal-500 flex items-center justify-center text-teal-300 font-mono text-xl">
                        {decodedElement.sym}
                      </span>
                      <span>প্রতীকী মৌল X = {decodedElement.nameBn} ({decodedElement.sym})</span>
                    </h3>
                  </div>
                  <span className="px-4 py-1.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/40 text-xs font-bold">
                    পারমাণবিক সংখ্যা: {decodedElement.n}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <span className="text-slate-500 block">অবস্থান:</span>
                    <strong className="text-white font-mono">Period {decodedElement.period}, Group {decodedElement.group}</strong>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <span className="text-slate-500 block">যোজ্যতা (Valency):</span>
                    <strong className="text-amber-400 font-mono">{decodedElement.val}</strong>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <span className="text-slate-500 block">তড়িৎঋণাত্মকতা (EN):</span>
                    <strong className="text-cyan-400 font-mono">{decodedElement.en}</strong>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <span className="text-slate-500 block">যোজনী স্তরের কনফিগ:</span>
                    <strong className="text-emerald-400 font-mono">{decodedElement.valConf}</strong>
                  </div>
                </div>

                <div className="p-3 bg-slate-900 rounded-xl text-xs space-y-1 font-mono text-slate-300">
                  <span className="text-slate-500 font-bold block">সম্পূর্ণ ইলেকট্রন বিন্যাস:</span>
                  <p className="text-teal-300 font-bold">{decodedElement.ec}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: DYNAMIC DOT-CROSS (LEWIS) STRUCTURE GENERATOR                      */}
        {/* ========================================================================= */}
        {activeTab === 'lewis' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <h3 className="font-black text-sm text-white flex items-center gap-2">
                <Atom className="w-4 h-4 text-indigo-400" />
                <span>ডট-ক্রস (Lewis Dot-Cross) চিত্র ও বন্ধন জোড় জেনারেটর</span>
              </h3>
              <span className="text-xs text-slate-400 font-mono">• (ডট) ও × (ক্রস) ইলেকট্রন শেয়ারিং</span>
            </div>

            {/* Select Compound */}
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2 text-xs">
              <label className="text-slate-400 font-bold block">যৌগ নির্বাচন করুন:</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {BONDING_COMPOUNDS.map(c => (
                  <button
                    key={c.formula}
                    onClick={() => setSelectedCompoundKey(c.formula)}
                    className={`p-2.5 rounded-xl font-bold transition-all text-center ${selectedCompoundKey === c.formula ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 scale-105' : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'}`}
                  >
                    {c.formula} ({c.type === 'covalent' ? 'সমযোজী' : 'আয়নিক'})
                  </button>
                ))}
              </div>
            </div>

            {/* Lewis Diagram SVG Canvas */}
            <div className="p-6 bg-slate-950 border border-slate-800 rounded-3xl flex flex-col items-center justify-center space-y-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{compound.name} এর লুইস ডট-ক্রস চিত্র:</span>
              
              <svg viewBox="0 0 320 220" className="w-full max-w-sm h-56 bg-slate-900 rounded-2xl border border-slate-800 shadow-inner">
                {/* Central Atom */}
                <circle cx="160" cy="110" r="28" fill="#312e81" stroke="#818cf8" strokeWidth="2" />
                <text x="160" y="116" fill="#ffffff" fontSize="14" fontWeight="bold" textAnchor="middle">
                  {compound.centralAtom}
                </text>

                {/* Bonded Surrounding Atoms with Dot & Cross */}
                {compound.bondedAtoms.map((bAt, idx) => {
                  const total = compound.bondedAtoms.reduce((acc, a) => acc + a.count, 0);
                  const angle = (idx / total) * 2 * Math.PI - Math.PI / 2;
                  const bx = 160 + 80 * Math.cos(angle);
                  const by = 110 + 80 * Math.sin(angle);
                  const midX = (160 + bx) / 2;
                  const midY = (110 + by) / 2;

                  return (
                    <g key={idx}>
                      {/* Connecting bond indicator */}
                      <line x1="160" y1="110" x2={bx} y2={by} stroke="rgba(129, 140, 248, 0.4)" strokeWidth="1.5" strokeDasharray="3,3" />
                      
                      {/* Bond Pair Dot-Cross Indicator */}
                      <circle cx={midX - 4} cy={midY} r="3" fill="#38bdf8" />
                      <text x={midX + 4} y={midY + 4} fill="#f43f5e" fontSize="10" fontWeight="bold">✕</text>

                      {/* Surrounding Atom */}
                      <circle cx={bx} cy={by} r="22" fill="#064e3b" stroke="#34d399" strokeWidth="2" />
                      <text x={bx} y={by + 5} fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle">
                        {bAt.sym}
                      </text>
                    </g>
                  );
                })}
              </svg>

              <div className="flex items-center gap-6 text-xs text-slate-400">
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-sky-400"></span> • কেন্দ্রীয় পরমাণুর ইলেকট্রন</span>
                <span className="flex items-center gap-1.5"><span className="text-rose-500 font-black">✕</span> প্রান্তীয় পরমাণুর ইলেকট্রন</span>
              </div>
            </div>

            {/* Electron Pair Counts */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-2xl">
                <span className="text-slate-400 block text-[10px]">বন্ধন জোড় (Bond Pairs - bp):</span>
                <strong className="text-xl font-black text-sky-400 font-mono block mt-1">{compound.bondPairs} জোড়া</strong>
              </div>
              <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-2xl">
                <span className="text-slate-400 block text-[10px]">মুক্তজোড় (Lone Pairs - lp):</span>
                <strong className="text-xl font-black text-amber-400 font-mono block mt-1">{compound.lonePairs} জোড়া</strong>
              </div>
              <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-2xl">
                <span className="text-slate-400 block text-[10px]">বন্ধন প্রকৃতি:</span>
                <strong className="text-base font-black text-emerald-400 block mt-1 capitalize">{compound.type === 'covalent' ? 'সমযোজী বন্ধন' : 'আয়নিক বন্ধন'}</strong>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: OCTET RULE VALIDATOR & EXCEPTION ANALYZER                          */}
        {/* ========================================================================= */}
        {activeTab === 'octet' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <h3 className="font-black text-sm text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>অষ্টক নিয়ম পরীক্ষক ও ব্যতিক্রম বিশ্লেষণ (Octet Rule Validator)</span>
              </h3>
              <span className="text-xs text-slate-400">অষ্টক সম্প্রসারণ ও সংকোচন</span>
            </div>

            <div className="p-5 bg-gradient-to-r from-slate-950 via-indigo-950/40 to-slate-950 border border-indigo-500/40 rounded-3xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-indigo-300 font-bold uppercase tracking-wider">নির্বাচিত যৌগ:</span>
                  <h3 className="text-xl font-black text-white mt-0.5">{compound.name}</h3>
                </div>
                <span className={`px-3 py-1 rounded-xl text-xs font-bold ${compound.octetStatus.includes('ব্যতিক্রম') || compound.octetStatus.includes('সংকোচন') || compound.octetStatus.includes('সম্প্রসারণ') ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'}`}>
                  {compound.octetStatus}
                </span>
              </div>

              <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 text-xs leading-relaxed space-y-2">
                <span className="font-bold text-amber-300 block flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-amber-400" />
                  অষ্টক নিয়মের বিশদ বৈজ্ঞানিক ব্যাখ্যা:
                </span>
                <p className="text-slate-300 font-mono text-[11px]">{compound.octetExplanation}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-1">
                  <span className="text-slate-400 font-bold block">অষ্টক সংকোচন যৌগসমূহ (Octet Contraction):</span>
                  <p className="text-slate-300 font-mono">BF₃ (৬টি e⁻), BeCl₂ (৪টি e⁻), AlCl₃ (৬টি e⁻)</p>
                </div>
                <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-1">
                  <span className="text-slate-400 font-bold block">অষ্টক সম্প্রসারণ যৌগসমূহ (Octet Expansion):</span>
                  <p className="text-slate-300 font-mono">PCl₅ (১০টি e⁻), SF₆ (১২টি e⁻), IF₇ (১৪টি e⁻)</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: POLARITY & HYDRATION (SOLUBILITY) SIMULATOR                         */}
        {/* ========================================================================= */}
        {activeTab === 'polarity' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <h3 className="font-black text-sm text-white flex items-center gap-2">
                <Droplets className="w-4 h-4 text-sky-400" />
                <span>পোলারিটি ও পানিতে দ্রাব্যতা/হাইড্রেশন সিমুলেটর (Hydration Simulator)</span>
              </h3>
              <span className="text-xs text-slate-400">ΔEN & আয়ন-ডাইপোল আকর্ষণ</span>
            </div>

            {/* Molecule Polarity Status Card */}
            <div className="p-5 bg-slate-950 border border-slate-800 rounded-3xl space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-mono">তড়িৎঋণাত্মকতার পার্থক্য (ΔEN):</span>
                  <div className="text-2xl font-black text-white font-mono mt-0.5">{compound.enDiff}</div>
                </div>
                <span className={`px-3 py-1.5 rounded-xl font-bold ${compound.isPolar ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40' : 'bg-slate-800 text-slate-400'}`}>
                  {compound.isPolar ? '⚡ পোলার যৌগ (Polar Molecule)' : '🛡️ অপোলার যৌগ (Non-Polar)'}
                </span>
              </div>

              <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 text-slate-300 leading-relaxed">
                <strong>দ্রাব্যতা বিশ্লেষণ:</strong> {compound.solubility}
              </div>
            </div>

            {/* Interactive Hydration & Lattice Breakdown Canvas */}
            <div className="p-6 bg-slate-950 border border-slate-800 rounded-3xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-teal-400" />
                  পানিতে দ্রবীভূত হওয়ার লাইভ মেকানিজম (Hydration & Dissolution Animation):
                </span>
                <button
                  onClick={() => setIsDissolved(prev => !prev)}
                  className="px-4 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isDissolved ? 'animate-spin' : ''}`} />
                  <span>{isDissolved ? 'পুনরায় ল্যাটিসে সাজান' : 'পানিতে দ্রবীভূত করুন (Dissolve)'}</span>
                </button>
              </div>

              {/* Animation Container */}
              <div className="p-8 bg-slate-900 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-center gap-8 min-h-[180px]">
                {compound.type === 'ionic' ? (
                  <div className="flex items-center gap-8 transition-all duration-700">
                    {/* Cation surrounded by Water Oxygen delta- */}
                    <div className={`flex flex-col items-center space-y-2 transition-all duration-700 ${isDissolved ? 'scale-110 translate-x-[-20px]' : ''}`}>
                      <div className="w-16 h-16 rounded-full bg-teal-500/20 border-2 border-teal-500 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-teal-500/20">
                        {compound.centralAtom}
                      </div>
                      <span className="text-[10px] text-teal-300 font-bold">
                        {isDissolved ? 'δ⁻ অক্সিজেন দ্বারা বেষ্টিত' : 'ক্যাটায়ন'}
                      </span>
                    </div>

                    <div className="text-xs font-bold text-slate-500">
                      {isDissolved ? '🌊 আয়ন-ডাইপোল আকর্ষণ (হাইড্রেশন)' : '⚡ শক্তিশালী আয়নিক ল্যাটিস'}
                    </div>

                    {/* Anion surrounded by Water Hydrogen delta+ */}
                    <div className={`flex flex-col items-center space-y-2 transition-all duration-700 ${isDissolved ? 'scale-110 translate-x-[20px]' : ''}`}>
                      <div className="w-16 h-16 rounded-full bg-rose-500/20 border-2 border-rose-500 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-rose-500/20">
                        {compound.bondedAtoms[0]?.sym || 'Cl⁻'}
                      </div>
                      <span className="text-[10px] text-rose-300 font-bold">
                        {isDissolved ? 'δ⁺ হাইড্রোজেন দ্বারা বেষ্টিত' : 'অ্যানায়ন'}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center space-y-2">
                    <div className="w-16 h-16 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center text-white font-black">
                      {compound.formula}
                    </div>
                    <span className="text-xs text-slate-400 font-bold">
                      {compound.isPolar ? 'পোলার পানির সাথে হাইড্রোজেন বন্ধন তৈরি করে দ্রবীভূত হয়।' : 'অপোলার হওয়ায় পানির ডাইপোলের সাথে আকর্ষণ ঘটে না (অদ্রবণীয়)।'}
                    </span>
                  </div>
                )}
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
                <span>৫ম অধ্যায় বোর্ড সৃজনশীল (CQ) মডেল সমাধান ব্যাংক</span>
              </h3>
              <span className="text-slate-400">ঢাকা ও চট্টগ্রাম বোর্ড স্ট্যান্ডার্ড</span>
            </div>

            <div className="space-y-4">
              {/* CQ 1: Element Decoder & Lewis Structure */}
              <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                <h4 className="font-bold text-amber-300 text-sm">
                  উদ্দীপক ১: পর্যায় সারণির ৩য় পর্যায়ের দুটি মৌল X ও Y যাদের সর্ববহিঃস্থ স্তরের ইলেকট্রন সংখ্যা যথাক্রমে ৫ এবং ৭।
                </h4>
                <div className="space-y-2 p-3.5 bg-slate-900 rounded-xl font-mono text-slate-300">
                  <p className="text-teal-400 font-bold">প্রশ্ন (গ): উদ্দীপকের X মৌলটি শনাক্ত করে XY₅ যৌগের লুইস ডট-ক্রস চিত্র অঙ্কন করো। [মান: ৩]</p>
                  <p className="pl-3 border-l-2 border-teal-500">
                    সমাধান:<br/>
                    ৩য় পর্যায় ও ৫টি যোজনী ইলেকট্রনবিশিষ্ট মৌল X হলো ফসফরাস (₁₅P: 1s² 2s² 2p⁶ 3s² 3p³)।<br/>
                    ৭টি যোজনী ইলেকট্রনবিশিষ্ট মৌল Y হলো ক্লোরিন (₁₇Cl: 1s² 2s² 2p⁶ 3s² 3p⁵)।<br/>
                    গঠিত যৌগ = PCl₅। এর লুইস ডট-ক্রস চিত্রে কেন্দ্রীয় P পরমাণুর ৫টি যোজনী ইলেকট্রন ৫টি Cl পরমাণুর সাথে ৫ জোড়া বন্ধন গঠন করে।
                  </p>
                  <p className="text-indigo-400 font-bold mt-2">প্রশ্ন (ঘ): XY₅ যৌগটি অষ্টক নিয়ম মানে কি? বিশ্লেষণ করো। [মান: ৪]</p>
                  <p className="pl-3 border-l-2 border-indigo-500">
                    সমাধান:<br/>
                    PCl₅ যৌগে ফসফরাস (P) এর সর্ববহিঃস্থ স্তরের ৫টি ইলেকট্রন ৫টি ক্লোরিন (Cl) পরমাণুর সাথে ৫ জোড়া (১০টি) ইলেকট্রন শেয়ার করে।<br/>
                    ফলে বন্ধন গঠনের পর ফসফরাসের শেষ কক্ষপথে মোট ১০টি ইলেকট্রন বিদ্যমান থাকে, যা স্বাভাবিক অষ্টকের (৮টি) চেয়ে বেশি।<br/>
                    অতএব XY₅ (PCl₅) যৌগটি অষ্টক নিয়ম মানে না; এটি অষ্টক সম্প্রসারণের (Octet Expansion) একটি ব্যতিক্রম।
                  </p>
                </div>
              </div>

              {/* CQ 2: Polarity & Solubility */}
              <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                <h4 className="font-bold text-amber-300 text-sm">
                  উদ্দীপক ২: দুটি যৌগ NaCl এবং CCl₄।
                </h4>
                <div className="space-y-2 p-3.5 bg-slate-900 rounded-xl font-mono text-slate-300">
                  <p className="text-teal-400 font-bold">প্রশ্ন (ঘ): উদ্দীপকের কোন যৌগটি পানিতে দ্রবীভূত হবে এবং কেন? হাইড্রেশন মডেলের আলোকে ব্যাখ্যা করো। [মান: ৪]</p>
                  <p className="pl-3 border-l-2 border-teal-500">
                    সমাধান:<br/>
                    ১. NaCl একটি আয়নিক যৌগ (ΔEN = 2.23)। পানি একটি পোলার সমযোজী দ্রাবক যেখানে অক্সিজেনে আংশিক ঋণাত্মক (δ⁻) এবং হাইড্রোজেনে আংশিক ধনাত্মক (δ⁺) চার্জ থাকে।<br/>
                    ২. NaCl কে পানিতে দিলে পানির ঋণাত্মক প্রান্ত (O^δ⁻) সোডিয়াম ক্যাটায়ন (Na⁺) কে এবং ধনাত্মক প্রান্ত (H^δ⁺) ক্লোরাইড অ্যানায়ন (Cl⁻) কে আকর্ষণ করে ঘিরে ফেলে।<br/>
                    ৩. উৎপন্ন হাইড্রেশন শক্তি ল্যাটিস শক্তি অপেক্ষা বেশি হওয়ায় NaCl পানিতে সম্পূর্ণরূপে দ্রবীভূত হয়।<br/>
                    অপরদিকে, CCl₄ অপোলার সমযোজী যৌগ হওয়ায় এটি পানির সাথে কোনো আয়ন-ডাইপোল বা হাইড্রোজেন বন্ধন গঠন করতে পারে না, তাই পানিতে অদ্রবণীয়।
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
