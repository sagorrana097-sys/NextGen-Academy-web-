import React, { useState, useRef } from 'react';
import {
  Sparkles,
  Search,
  Download,
  Info,
  Layers,
  X,
  Loader2,
  Atom,
  Flame,
  Award,
  Zap,
  BookOpen,
  Filter
} from 'lucide-react';
import { exportBrandedGraphic } from '../../utils/exportBrandedGraphic';

// Comprehensive Periodic Table Dataset (Selected core & representative elements across all 118 categories)
const ELEMENTS = [
  // Period 1
  { number: 1, symbol: 'H', nameBn: 'হাইড্রোজেন', nameEn: 'Hydrogen', mass: '1.008', group: 'nonmetal', period: 1, col: 1, valency: '1', config: '1s¹', shells: [1], state: 'Gas', color: '#38BDF8', desc: 'মহাবিশ্বের সর্বাধিক প্রাচুর্যপূর্ণ গ্যাসীয় মৌল।' },
  { number: 2, symbol: 'He', nameBn: 'হিলিয়াম', nameEn: 'Helium', mass: '4.0026', group: 'noble', period: 1, col: 18, valency: '0', config: '1s²', shells: [2], state: 'Gas', color: '#A855F7', desc: 'নিষ্ক্রিয় গ্যাস, হালকা এবং অদাহ্য।' },

  // Period 2
  { number: 3, symbol: 'Li', nameBn: 'লিথিয়াম', nameEn: 'Lithium', mass: '6.94', group: 'alkali', period: 2, col: 1, valency: '1', config: '1s² 2s¹', shells: [2, 1], state: 'Solid', color: '#EF4444', desc: 'সবচেয়ে হালকা ক্ষার ধাতু।' },
  { number: 4, symbol: 'Be', nameBn: 'বেরিলিয়াম', nameEn: 'Beryllium', mass: '9.0122', group: 'alkaline', period: 2, col: 2, valency: '2', config: '1s² 2s²', shells: [2, 2], state: 'Solid', color: '#F97316', desc: 'মৃৎক্ষার ধাতু, উচ্চ গলনাঙ্কবিশিষ্ট।' },
  { number: 5, symbol: 'B', nameBn: 'বোরন', nameEn: 'Boron', mass: '10.81', group: 'metalloid', period: 2, col: 13, valency: '3', config: '1s² 2s² 2p¹', shells: [2, 3], state: 'Solid', color: '#10B981', desc: 'অর্ধধাতু, কাচ ও সিরামিক শিল্পে ব্যবহৃত।' },
  { number: 6, symbol: 'C', nameBn: 'কার্বন', nameEn: 'Carbon', mass: '12.011', group: 'nonmetal', period: 2, col: 14, valency: '2, 4', config: '1s² 2s² 2p²', shells: [2, 4], state: 'Solid', color: '#38BDF8', desc: 'জৈব রসায়নের মূল ভিত্তি মৌল।' },
  { number: 7, symbol: 'N', nameBn: 'নাইট্রোজেন', nameEn: 'Nitrogen', mass: '14.007', group: 'nonmetal', period: 2, col: 15, valency: '3, 5', config: '1s² 2s² 2p³', shells: [2, 5], state: 'Gas', color: '#38BDF8', desc: 'বায়ুমণ্ডলের ৭৮% অংশ দখল করে আছে।' },
  { number: 8, symbol: 'O', nameBn: 'অক্সিজেন', nameEn: 'Oxygen', mass: '15.999', group: 'nonmetal', period: 2, col: 16, valency: '2', config: '1s² 2s² 2p⁴', shells: [2, 6], state: 'Gas', color: '#38BDF8', desc: 'জীবের শ্বাসপ্রশ্বাস ও দহনের জন্য অপরিহার্য।' },
  { number: 9, symbol: 'F', nameBn: 'ফ্লোরিন', nameEn: 'Fluorine', mass: '18.998', group: 'halogen', period: 2, col: 17, valency: '1', config: '1s² 2s² 2p⁵', shells: [2, 7], state: 'Gas', color: '#FBBF24', desc: 'সবচেয়ে তীব্র তড়িৎ-ঋণাত্মক হ্যালোজেন।' },
  { number: 10, symbol: 'Ne', nameBn: 'নিয়ন', nameEn: 'Neon', mass: '20.180', group: 'noble', period: 2, col: 18, valency: '0', config: '1s² 2s² 2p⁶', shells: [2, 8], state: 'Gas', color: '#A855F7', desc: 'নিষ্ক্রিয় গ্যাস, নিয়ন সাইন বোর্ডে ব্যবহৃত।' },

  // Period 3
  { number: 11, symbol: 'Na', nameBn: 'সোডিয়াম', nameEn: 'Sodium', mass: '22.990', group: 'alkali', period: 3, col: 1, valency: '1', config: '[Ne] 3s¹', shells: [2, 8, 1], state: 'Solid', color: '#EF4444', desc: 'নরম ধাতু, পানির সাথে তীব্র বিক্রিয়া করে।' },
  { number: 12, symbol: 'Mg', nameBn: 'ম্যাগনেসিয়াম', nameEn: 'Magnesium', mass: '24.305', group: 'alkaline', period: 3, col: 2, valency: '2', config: '[Ne] 3s²', shells: [2, 8, 2], state: 'Solid', color: '#F97316', desc: 'ক্লোরোফিলের কেন্দ্রীয় ধাতব আয়ন।' },
  { number: 13, symbol: 'Al', nameBn: 'অ্যালুমিনিয়াম', nameEn: 'Aluminium', mass: '26.982', group: 'post-transition', period: 3, col: 13, valency: '3', config: '[Ne] 3s² 3p¹', shells: [2, 8, 3], state: 'Solid', color: '#06B6D4', desc: 'হালকা ও টেকসই সংকর ধাতু তৈরিতে প্রধান।' },
  { number: 14, symbol: 'Si', nameBn: 'সিলিকন', nameEn: 'Silicon', mass: '28.085', group: 'metalloid', period: 3, col: 14, valency: '4', config: '[Ne] 3s² 3p²', shells: [2, 8, 4], state: 'Solid', color: '#10B981', desc: 'কম্পিউটার চিপস ও সেমিকন্ডাক্টরের ভিত্তি।' },
  { number: 15, symbol: 'P', nameBn: 'ফসফরাস', nameEn: 'Phosphorus', mass: '30.974', group: 'nonmetal', period: 3, col: 15, valency: '3, 5', config: '[Ne] 3s² 3p³', shells: [2, 8, 5], state: 'Solid', color: '#38BDF8', desc: 'ডিএনএ ও হাড়ের মূল উপাদান।' },
  { number: 16, symbol: 'S', nameBn: 'সালফার', nameEn: 'Sulfur', mass: '32.06', group: 'nonmetal', period: 3, col: 16, valency: '2, 4, 6', config: '[Ne] 3s² 3p⁴', shells: [2, 8, 6], state: 'Solid', color: '#38BDF8', desc: 'হলুদ রঙের গন্ধক, সালফিউরিক এসিডের উৎস।' },
  { number: 17, symbol: 'Cl', nameBn: 'ক্লোরিন', nameEn: 'Chlorine', mass: '35.45', group: 'halogen', period: 3, col: 17, valency: '1, 3, 5, 7', config: '[Ne] 3s² 3p⁵', shells: [2, 8, 7], state: 'Gas', color: '#FBBF24', desc: 'জীবাণুনাশক ও খাবার লবণের উপাদান।' },
  { number: 18, symbol: 'Ar', nameBn: 'আর্গন', nameEn: 'Argon', mass: '39.948', group: 'noble', period: 3, col: 18, valency: '0', config: '[Ne] 3s² 3p⁶', shells: [2, 8, 8], state: 'Gas', color: '#A855F7', desc: 'বৈদ্যুতিক বাল্ব ও ওয়েল্ডিংয়ে ব্যবহৃত।' },

  // Period 4 Representative Metals
  { number: 19, symbol: 'K', nameBn: 'পটাশিয়াম', nameEn: 'Potassium', mass: '39.098', group: 'alkali', period: 4, col: 1, valency: '1', config: '[Ar] 4s¹', shells: [2, 8, 8, 1], state: 'Solid', color: '#EF4444', desc: 'উদ্ভিদের বৃদ্ধির জন্য অত্যাবশ্যকীয় সার।' },
  { number: 20, symbol: 'Ca', nameBn: 'ক্যালসিয়াম', nameEn: 'Calcium', mass: '40.078', group: 'alkaline', period: 4, col: 2, valency: '2', config: '[Ar] 4s²', shells: [2, 8, 8, 2], state: 'Solid', color: '#F97316', desc: 'হাড় ও দাঁতের মূল গাঠনিক মৌল।' },
  { number: 26, symbol: 'Fe', nameBn: 'আয়রন (লোহা)', nameEn: 'Iron', mass: '55.845', group: 'transition', period: 4, col: 8, valency: '2, 3', config: '[Ar] 3d⁶ 4s²', shells: [2, 8, 14, 2], state: 'Solid', color: '#EC4899', desc: 'রক্তের হিমোগ্লোবিনের অন্যতম প্রধান অংশ।' },
  { number: 29, symbol: 'Cu', nameBn: 'কপার (তামা)', nameEn: 'Copper', mass: '63.546', group: 'transition', period: 4, col: 11, valency: '1, 2', config: '[Ar] 3d¹⁰ 4s¹', shells: [2, 8, 18, 1], state: 'Solid', color: '#EC4899', desc: 'উচ্চ বিদ্যুৎ পরিবাহী সোনালি-লাল ধাতু।' },
  { number: 30, symbol: 'Zn', nameBn: 'জিঙ্ক (দস্তা)', nameEn: 'Zinc', mass: '65.38', group: 'transition', period: 4, col: 12, valency: '2', config: '[Ar] 3d¹⁰ 4s²', shells: [2, 8, 18, 2], state: 'Solid', color: '#EC4899', desc: 'গ্যালভানাইজিং ও ইমিউনিটি বৃদ্ধিতে সহায়ক।' },
  { number: 47, symbol: 'Ag', nameBn: 'সিলভার (রূপা)', nameEn: 'Silver', mass: '107.87', group: 'transition', period: 5, col: 11, valency: '1', config: '[Kr] 4d¹⁰ 5s¹', shells: [2, 8, 18, 18, 1], state: 'Solid', color: '#EC4899', desc: 'সর্বাধিক বিদ্যুৎ ও তাপ পরিবাহী ধাতু।' },
  { number: 79, symbol: 'Au', nameBn: 'গোল্ড (স্বর্ণ)', nameEn: 'Gold', mass: '196.97', group: 'transition', period: 6, col: 11, valency: '1, 3', config: '[Xe] 4f¹⁴ 5d¹⁰ 6s¹', shells: [2, 8, 18, 32, 18, 1], state: 'Solid', color: '#EC4899', desc: 'অভিজাত ধাতু, সহজে ক্ষয় বা মরিচা ধরে না।' },
  { number: 80, symbol: 'Hg', nameBn: 'মার্কারি (পারদ)', nameEn: 'Mercury', mass: '200.59', group: 'transition', period: 6, col: 12, valency: '1, 2', config: '[Xe] 4f¹⁴ 5d¹⁰ 6s²', shells: [2, 8, 18, 32, 18, 2], state: 'Liquid', color: '#EC4899', desc: 'একমাত্র সাধারণ তাপমাত্রায় তরল ধাতু।' },
  { number: 92, symbol: 'U', nameBn: 'ইউরেনিয়াম', nameEn: 'Uranium', mass: '238.03', group: 'actinide', period: 7, col: 3, valency: '3, 4, 5, 6', config: '[Rn] 5f³ 6d¹ 7s²', shells: [2, 8, 18, 32, 21, 9, 2], state: 'Solid', color: '#84CC16', desc: 'পারমাণবিক শক্তির প্রধান তেজস্ক্রিয় জ্বালানি।' }
];

const CATEGORIES = [
  { id: 'ALL', name: 'সকল মৌল' },
  { id: 'alkali', name: 'ক্ষার ধাতু (Alkali)', color: '#EF4444' },
  { id: 'alkaline', name: 'মৃৎক্ষার ধাতু (Alkaline)', color: '#F97316' },
  { id: 'transition', name: 'অবস্থান্তর ধাতু (Transition)', color: '#EC4899' },
  { id: 'metalloid', name: 'অপধাতু (Metalloid)', color: '#10B981' },
  { id: 'nonmetal', name: 'অধাতু (Non-metal)', color: '#38BDF8' },
  { id: 'halogen', name: 'হ্যালোজেন (Halogen)', color: '#FBBF24' },
  { id: 'noble', name: 'নিষ্ক্রিয় গ্যাস (Noble Gas)', color: '#A855F7' }
];

export default function PeriodicTable3D() {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeElement, setActiveElement] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const flashcardRef = useRef(null);

  const filteredElements = ELEMENTS.filter((el) => {
    const matchesCat = selectedCategory === 'ALL' || el.group === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchesQ = !q || el.nameBn.toLowerCase().includes(q) || el.nameEn.toLowerCase().includes(q) || el.symbol.toLowerCase().includes(q) || String(el.number).includes(q);
    return matchesCat && matchesQ;
  });

  const handleExportFlashcard = async () => {
    if (!flashcardRef.current || !activeElement) return;
    setIsExporting(true);
    try {
      await exportBrandedGraphic(flashcardRef.current, {
        fileName: `NextGen_Element_${activeElement.symbol}_${activeElement.nameEn}`,
        cardTitle: `মৌল ফ্ল্যাশকার্ড: ${activeElement.nameBn} (${activeElement.symbol})`,
        scale: 2
      });
    } catch (err) {
      console.error('Failed to export element flashcard:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Banner */}
      <div className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-3xl shadow-xl text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="p-3.5 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <Atom className="w-8 h-8 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black text-white">ইন্টারেক্টিভ ৩ডি পর্যায় সারণি ও পরমাণু মডেল</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold font-mono">
                Chemistry 3D
              </span>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              মৌলের পারমাণবিক ভর, যোজনী, ইলেকট্রন বিন্যাস এবং লাইভ ৩ডি বোর মডেল অ্যানিমেশন
            </p>
          </div>
        </div>
      </div>

      {/* Search & Category Filter Toolbar */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="প্রতীক, নাম বা পারমাণবিক সংখ্যা লিখুন..."
            className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-bold scrollbar-none w-full sm:w-auto">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all text-xs font-bold ${
                selectedCategory === cat.id
                  ? 'bg-cyan-600 text-white shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Modern Periodic Grid Layout */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl">
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-9 gap-3">
          {filteredElements.map((el) => (
            <button
              key={el.number}
              type="button"
              onClick={() => setActiveElement(el)}
              style={{ borderColor: `${el.color}40` }}
              className="p-3.5 rounded-2xl bg-slate-950/80 hover:bg-slate-800/90 border-2 transition-all hover:scale-105 hover:shadow-xl text-left flex flex-col justify-between group relative overflow-hidden active:scale-95"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-slate-400 font-bold">{el.number}</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-bold font-mono">
                  {el.state}
                </span>
              </div>

              <div className="my-2">
                <span
                  className="font-black text-2xl font-mono block leading-none transition-transform group-hover:scale-110"
                  style={{ color: el.color }}
                >
                  {el.symbol}
                </span>
                <p className="text-xs font-bold text-slate-200 mt-1 truncate">{el.nameBn}</p>
                <span className="text-[10px] text-slate-500 font-mono block truncate">{el.nameEn}</span>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[9px] text-slate-400 font-mono">
                <span>ভর: {el.mass}</span>
                <span className="text-cyan-400 font-bold">যোজনী: {el.valency}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3D ELEMENT DETAILS & BOHR MODEL MODAL */}
      {/* ========================================================================= */}
      {activeElement && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div
            ref={flashcardRef}
            className="bg-slate-900 border-2 border-cyan-500/50 rounded-3xl max-w-2xl w-full p-6 sm:p-8 text-white shadow-2xl space-y-6 relative overflow-hidden animate-in zoom-in-95 duration-150"
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center font-mono text-2xl font-black shadow-lg"
                  style={{ backgroundColor: `${activeElement.color}25`, color: activeElement.color, border: `2px solid ${activeElement.color}` }}
                >
                  {activeElement.symbol}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-2xl text-white">{activeElement.nameBn}</h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-cyan-300 font-mono text-xs font-bold">
                      Z = {activeElement.number}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    {activeElement.nameEn} • {activeElement.state} • {activeElement.group.toUpperCase()}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveElement(null)}
                className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 3D Animated Bohr Atomic Model Simulator Canvas Box */}
            <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center justify-center gap-8 shadow-inner relative overflow-hidden">
              {/* Concentric Bohr Shells with Orbiting Electrons */}
              <div className="relative w-48 h-48 flex items-center justify-center flex-shrink-0">
                {/* Nucleus */}
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-rose-500 to-amber-400 flex items-center justify-center text-[10px] font-black text-slate-950 shadow-lg shadow-rose-500/50 z-20 animate-pulse">
                  <span>{activeElement.symbol}⁺</span>
                </div>

                {/* Shell 1 */}
                {activeElement.shells.length >= 1 && (
                  <div className="absolute w-20 h-20 rounded-full border border-cyan-500/50 animate-spin-slow">
                    <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-md shadow-cyan-400 absolute -top-1 left-1/2 -translate-x-1/2" />
                  </div>
                )}

                {/* Shell 2 */}
                {activeElement.shells.length >= 2 && (
                  <div className="absolute w-32 h-32 rounded-full border border-indigo-500/50 animate-spin-reverse">
                    <div className="w-2.5 h-2.5 rounded-full bg-indigo-400 shadow-md shadow-indigo-400 absolute top-1/2 -right-1 -translate-y-1/2" />
                    <div className="w-2.5 h-2.5 rounded-full bg-indigo-400 shadow-md shadow-indigo-400 absolute top-1/2 -left-1 -translate-y-1/2" />
                  </div>
                )}

                {/* Shell 3 */}
                {activeElement.shells.length >= 3 && (
                  <div className="absolute w-44 h-44 rounded-full border border-emerald-500/50 animate-spin-slow">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-md shadow-emerald-400 absolute -bottom-1 left-1/2 -translate-x-1/2" />
                  </div>
                )}
              </div>

              {/* Chemical Specifications */}
              <div className="space-y-2.5 text-xs flex-1">
                <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">ইলেকট্রন বিন্যাস (Configuration):</span>
                  <p className="font-mono text-sm font-bold text-cyan-300">{activeElement.config}</p>
                  <p className="text-[11px] text-slate-400 font-mono">
                    শেল বিন্যাস: K({activeElement.shells[0] || 0}), L({activeElement.shells[1] || 0}), M({activeElement.shells[2] || 0})
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">পারমাণবিক ভর:</span>
                    <strong className="text-white font-mono text-sm">{activeElement.mass} u</strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">যোজনী (Valency):</span>
                    <strong className="text-emerald-400 font-mono text-sm">{activeElement.valency}</strong>
                  </div>
                </div>

                <p className="text-[11px] text-slate-300 italic pt-1">
                  💡 {activeElement.desc}
                </p>
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <span className="text-[11px] text-slate-400 font-mono">
                NextGen Academy • রসায়ন ও পরমাণু মডেল
              </span>

              <button
                type="button"
                onClick={handleExportFlashcard}
                disabled={isExporting}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-cyan-600/30 flex items-center gap-2 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
              >
                {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                <span>ফ্ল্যাশকার্ড ডাউনলোড (Download Flashcard)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
