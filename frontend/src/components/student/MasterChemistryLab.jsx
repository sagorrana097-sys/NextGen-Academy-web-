import React, { useState, useRef, useMemo } from 'react';
import {
  FlaskConical,
  Atom,
  Table2,
  Zap,
  Flame,
  Download,
  Loader2,
  ChevronDown,
  ChevronUp,
  Brain,
  Calculator,
  Droplets,
  Rotate3d,
  Sparkles,
  Search,
  Filter,
  HelpCircle,
  Layers,
  CheckCircle2,
  Activity,
  Play,
  RefreshCw,
  X,
  ArrowRight,
  Sliders,
  Scale,
  Beaker,
  Info,
  Battery,
  BatteryCharging,
  BookOpen,
  Award,
  Wind
} from 'lucide-react';
import { exportBrandedGraphic } from '../../utils/exportBrandedGraphic';
import ChemistryChapter6MathSolver from './ChemistryChapter6MathSolver';
import ChemistryChapter5BondingSolver from './ChemistryChapter5BondingSolver';
import GalvanicCellSimulation from './GalvanicCellSimulation';
import DaniellCellSimulation from './DaniellCellSimulation';
import DryCellSimulation from './DryCellSimulation';
import RedoxOxidationEngine from './RedoxOxidationEngine';

// =========================================================================
// 1. COMPREHENSIVE HSC & SSC CHEMICAL REACTIONS DATABASE
// =========================================================================
const MASTER_REACTIONS_DB = [
  // -------------------------------------------------------------
  // A. REDOX REACTIONS (জারণ-বিজারণ বিক্রিয়া)
  // -------------------------------------------------------------
  {
    id: 'rx-redox-1',
    category: 'redox',
    catName: 'জারণ-বিজারণ (Redox)',
    titleBn: 'অম্লীয় মাধ্যমে KMnO₄ দ্বারা FeSO₄ এর জারণ',
    reactantsStr: '2KMnO₄ + 10FeSO₄ + 8H₂SO₄',
    productsStr: 'K₂SO₄ + 2MnSO₄ + 5Fe₂(SO₄)₃ + 8H₂O',
    reactants: [
      { formula: 'KMnO₄', name: 'পটাশিয়াম পারম্যাঙ্গানেট', coeff: 2, mw: 158.03, state: '(aq)' },
      { formula: 'FeSO₄', name: 'ফেরাস সালফেটের দ্রবণ', coeff: 10, mw: 151.91, state: '(aq)' },
      { formula: 'H₂SO₄', name: 'সালফিউরিক এসিড', coeff: 8, mw: 98.08, state: '(aq)' }
    ],
    products: [
      { formula: 'K₂SO₄', name: 'পটাশিয়াম সালফেট', coeff: 1, mw: 174.26, state: '(aq)' },
      { formula: 'MnSO₄', name: 'ম্যাঙ্গানাস সালফেট', coeff: 2, mw: 151.00, state: '(aq)' },
      { formula: 'Fe₂(SO₄)₃', name: 'ফেরিক সালফেট', coeff: 5, mw: 399.88, state: '(aq)' },
      { formula: 'H₂O', name: 'পানি', coeff: 8, mw: 18.02, state: '(l)' }
    ],
    gases: [],
    balancingLogic: [
      '১. জারণ অর্ধ-বিক্রিয়া: Fe²⁺ → Fe³⁺ + e⁻  (প্রতিটি Fe²⁺ ১টি ইলেকট্রন ত্যাগ করে)',
      '২. বিজারণ অর্ধ-বিক্রিয়া: MnO₄⁻ + 8H⁺ + 5e⁻ → Mn²⁺ + 4H₂O  (Mn⁺⁷ ৫টি ইলেকট্রন গ্রহণ করে)',
      '৩. ইলেকট্রন সমতা: জারণ অর্ধ-বিক্রিয়াকে ৫ দিয়ে গুণ করে বিজারণের সাথে যোগ করলে কঙ্কাল সমীকরণ দাঁড়ায়: MnO₄⁻ + 5Fe²⁺ + 8H⁺ → Mn²⁺ + 5Fe³⁺ + 4H₂O',
      '৪. পূর্ণ আণবিক রূপ: দর্শক আয়ন (K⁺ ও SO₄²⁻) সমন্বয়ের জন্য সমীকরণকে ২ দ্বারা গুণ করে পাওয়া যায়: 2KMnO₄ + 10FeSO₄ + 8H₂SO₄ → K₂SO₄ + 2MnSO₄ + 5Fe₂(SO₄)₃ + 8H₂O'
    ],
    whyOccurs: 'KMnO₄ এর ম্যাঙ্গানিজ (+7) একটি অতি তীব্র ইলেকট্রনগ্রাহী জারক। অম্লীয় মাধ্যমে এটি Fe²⁺ থেকে সহজেই ইলেকট্রন গ্রহণ করে নিজে হালকা গোলাপি/বর্ণহীন Mn²⁺ আয়নে বিজারিত হয়।',
    examNote: 'টাইট্রেশনে নির্দেশক হিসেবে কোনো অতিরিক্ত সূচক প্রয়োজন হয় না কারণ KMnO₄ নিজেই স্ব-নির্দেশক (Self-indicator)।'
  },
  {
    id: 'rx-redox-2',
    category: 'redox',
    catName: 'জারণ-বিজারণ (Redox)',
    titleBn: 'অম্লীয় মাধ্যমে K₂Cr₂O₇ দ্বারা FeSO₄ এর জারণ',
    reactantsStr: 'K₂Cr₂O₇ + 6FeSO₄ + 7H₂SO₄',
    productsStr: 'K₂SO₄ + Cr₂(SO₄)₃ + 3Fe₂(SO₄)₃ + 7H₂O',
    reactants: [
      { formula: 'K₂Cr₂O₇', name: 'পটাশিয়াম ডাইক্রোমেট', coeff: 1, mw: 294.18, state: '(aq)' },
      { formula: 'FeSO₄', name: 'ফেরাস সালফেট', coeff: 6, mw: 151.91, state: '(aq)' },
      { formula: 'H₂SO₄', name: 'সালফিউরিক এসিড', coeff: 7, mw: 98.08, state: '(aq)' }
    ],
    products: [
      { formula: 'K₂SO₄', name: 'পটাশিয়াম সালফেট', coeff: 1, mw: 174.26, state: '(aq)' },
      { formula: 'Cr₂(SO₄)₃', name: 'ক্রোমিক সালফেট (সবুজ)', coeff: 1, mw: 392.18, state: '(aq)' },
      { formula: 'Fe₂(SO₄)₃', name: 'ফেরিক সালফেট', coeff: 3, mw: 399.88, state: '(aq)' },
      { formula: 'H₂O', name: 'পানি', coeff: 7, mw: 18.02, state: '(l)' }
    ],
    gases: [],
    balancingLogic: [
      '১. জারণ অর্ধ-বিক্রিয়া: Fe²⁺ → Fe³⁺ + e⁻',
      '২. বিজারণ অর্ধ-বিক্রিয়া: Cr₂O₇²⁻ + 14H⁺ + 6e⁻ → 2Cr³⁺ + 7H₂O  (প্রতিটি Cr⁺⁶ ৩টি করে মোট ৬টি ইলেকট্রন গ্রহণ করে)',
      '৩. জারণ অর্ধ-বিক্রিয়াকে ৬ দিয়ে গুণ করে যোগ করলে: Cr₂O₇²⁻ + 6Fe²⁺ + 14H⁺ → 2Cr³⁺ + 6Fe³⁺ + 7H₂O',
      '৪. প্রয়োজনীয় দর্শক আয়ন (2K⁺ ও 7SO₄²⁻) যোগ করে সমতাকৃত সমীকরণ গঠিত হয়।'
    ],
    whyOccurs: 'ডাইক্রোমেট মূলকের Cr⁺⁶ অত্যন্ত উচ্চ জারণ অবস্থায় থাকায় এটি প্রবলভাবে ইলেকট্রন আকর্ষণ করে সবুজ বর্ণের Cr³⁺ এ রূপান্তরিত হয়।',
    examNote: 'বিক্রিয়া সম্পন্ন হলে দ্রবণের কমলা বর্ণ সম্পূর্ণ বিলীন হয়ে সবুজ বর্ণ ধারণ করে।'
  },
  {
    id: 'rx-redox-3',
    category: 'redox',
    catName: 'জারণ-বিজারণ (Redox)',
    titleBn: 'কপার ও গাঢ় নাইট্রিক এসিডের বিক্রিয়া (NO₂ গ্যাস উৎপাদন)',
    reactantsStr: 'Cu + 4HNO₃ (গাঢ়)',
    productsStr: 'Cu(NO₃)₂ + 2NO₂ ↑ + 2H₂O',
    reactants: [
      { formula: 'Cu', name: 'তামার কুচি (কপার)', coeff: 1, mw: 63.55, state: '(s)' },
      { formula: 'HNO₃', name: 'গাঢ় নাইট্রিক এসিড', coeff: 4, mw: 63.01, state: '(aq)' }
    ],
    products: [
      { formula: 'Cu(NO₃)₂', name: 'কপার নাইট্রেট দ্রবণ (নীল)', coeff: 1, mw: 187.56, state: '(aq)' },
      { formula: 'NO₂', name: 'নাইট্রোজেন ডাইঅক্সাইড গ্যাস', coeff: 2, mw: 46.01, state: '(g)', isGas: true },
      { formula: 'H₂O', name: 'পানি', coeff: 2, mw: 18.02, state: '(l)' }
    ],
    gases: [{ formula: 'NO₂', coeff: 2, name: 'নাইট্রোজেন ডাইঅক্সাইড' }],
    balancingLogic: [
      '১. জারণ: Cu → Cu²⁺ + 2e⁻  (তামা জারিত হয়)',
      '২. বিজারণ: NO₃⁻ + 2H⁺ + e⁻ → NO₂ + H₂O  (N⁺⁵ বিজারিত হয়ে N⁺⁴ এ পরিণত হয়)',
      '৩. বিজারণ সমীকরণকে ২ দ্বারা গুণ করে জারণের সাথে যোগ করলে কঙ্কাল সমীকরণ: Cu + 2NO₃⁻ + 4H⁺ → Cu²⁺ + 2NO₂ + 2H₂O',
      '৪. বামে ও ডানে ২টি নাইট্রেট দর্শক আয়ন (2NO₃⁻) যুক্ত করে পূর্ণ সমীকরণ পাওয়া যায়।'
    ],
    whyOccurs: 'গাঢ় নাইট্রিক এসিড একটি শক্তিশালী অক্সিডাইজিং এজেন্ট। এটি কপার ধাতুকে দ্রবীভূত করে Cu²⁺ এ জারিত করে এবং নিজে বাদামি রঙের NO₂ গ্যাসে বিজারিত হয়।',
    examNote: 'যদি লঘু নাইট্রিক এসিড ব্যবহার করা হতো, তবে NO₂ এর পরিবর্তে বর্ণহীন NO গ্যাস উৎপন্ন হতো (3Cu + 8HNO₃ → 3Cu(NO₃)₂ + 2NO + 4H₂O)।'
  },
  {
    id: 'rx-redox-4',
    category: 'redox',
    catName: 'জারণ-বিজারণ (Redox)',
    titleBn: 'জিঙ্ক ও সালফিউরিক এসিডের বিক্রিয়ায় হাইড্রোজেন গ্যাস প্রস্তুতি',
    reactantsStr: 'Zn + H₂SO₄',
    productsStr: 'ZnSO₄ + H₂ ↑',
    reactants: [
      { formula: 'Zn', name: 'দস্তা / জিঙ্ক ধাতু', coeff: 1, mw: 65.38, state: '(s)' },
      { formula: 'H₂SO₄', name: 'সালফিউরিক এসিড', coeff: 1, mw: 98.08, state: '(aq)' }
    ],
    products: [
      { formula: 'ZnSO₄', name: 'জিঙ্ক সালফেট দ্রবণ', coeff: 1, mw: 161.47, state: '(aq)' },
      { formula: 'H₂', name: 'হাইড্রোজেন গ্যাস', coeff: 1, mw: 2.016, state: '(g)', isGas: true }
    ],
    gases: [{ formula: 'H₂', coeff: 1, name: 'হাইড্রোজেন গ্যাস' }],
    balancingLogic: [
      '১. জারণ: Zn(s) → Zn²⁺(aq) + 2e⁻  (জিঙ্ক ইলেকট্রন ত্যাগ করে জারিত হয়)',
      '২. বিজারণ: 2H⁺(aq) + 2e⁻ → H₂(g)  (এসিডের প্রোটন ইলেকট্রন গ্রহণ করে গ্যাসে পরিণত হয়)',
      '৩. উভয় পাশে পরমাণু সংখ্যা ১টি Zn, ২টি H এবং ১টি SO₄ আয়ন সমান থাকায় অনুপাত ১:১।'
    ],
    whyOccurs: 'সক্রিয়তা সিরিজে জিঙ্ক হাইড্রোজেনের উপরে অবস্থিত (E° = -0.76 V)। ফলে জিঙ্ক এসিড হতে হাইড্রোজেন আয়নকে বিজারিত ও প্রতিস্থাপিত করতে সক্ষম।',
    examNote: 'পরীক্ষাগারে হাইড্রোজেন গ্যাস প্রস্তুতির এটি সবচেয়ে জনপ্রিয় সাধারণ পদ্ধতি।'
  },

  // -------------------------------------------------------------
  // B. ORGANIC CONVERSIONS (জৈব রসায়ন রূপান্তর)
  // -------------------------------------------------------------
  {
    id: 'rx-org-1',
    category: 'organic',
    catName: 'জৈব রূপান্তর (Organic)',
    titleBn: 'ডিকার্বক্সিলেশন বিক্রিয়া (সোডিয়াম ইথানয়েট থেকে মিথেন প্রস্তুতি)',
    reactantsStr: 'CH₃COONa + NaOH',
    productsStr: 'CH₄ ↑ + Na₂CO₃',
    reactants: [
      { formula: 'CH₃COONa', name: 'সোডিয়াম ইথানয়েট (অ্যাসিটেট)', coeff: 1, mw: 82.03, state: '(s)' },
      { formula: 'NaOH', name: 'সোডালাইম (NaOH + CaO)', coeff: 1, mw: 40.00, state: '(s)' }
    ],
    products: [
      { formula: 'CH₄', name: 'মিথেন গ্যাস', coeff: 1, mw: 16.04, state: '(g)', isGas: true },
      { formula: 'Na₂CO₃', name: 'সোডিয়াম কার্বনেট', coeff: 1, mw: 105.99, state: '(s)' }
    ],
    gases: [{ formula: 'CH₄', coeff: 1, name: 'মিথেন গ্যাস' }],
    balancingLogic: [
      '১. সোডিয়াম ইথানয়েটের -COONa অংশ এবং কস্টিক সোডার -ONa অংশ যুক্ত হয়ে Na₂CO₃ গঠন করে।',
      '২. অবশিষ্টাংশ মিথাইল মূলক (-CH₃) এবং সোডালাইমের হাইড্রোজেন যুক্ত হয়ে মিথেন গ্যাস (CH₄) উৎপন্ন করে।',
      '৩. কার্বন চেইনে ১টি কার্বন পরমাণু হ্রাস পায় (Decarboxylation)।'
    ],
    whyOccurs: 'CaO এর উপস্থিতিতে উত্তপ্ত করলে শুষ্ক সোডালাইম এসিড লবণ হতে কার্বক্সিলেট মূলককে কার্বনেট আয়ন হিসেবে অপসারণ করে উচ্চ তাপীয় সুস্থিতি লাভ করে।',
    examNote: 'এই বিক্রিয়ার মাধ্যমে জৈব যৌগের শিকল এক কার্বন বিশিষ্ট ছোট করা যায় (Chain degradation)।'
  },
  {
    id: 'rx-org-2',
    category: 'organic',
    catName: 'জৈব রূপান্তর (Organic)',
    titleBn: 'ইথানলের নিরুদন দ্বারা ইথিন (অ্যালকিন) প্রস্তুতি',
    reactantsStr: 'C₂H₅OH (গাঢ় H₂SO₄, 170°C)',
    productsStr: 'C₂H₄ ↑ + H₂O',
    reactants: [
      { formula: 'C₂H₅OH', name: 'ইথানল (ইথাইল অ্যালকোহল)', coeff: 1, mw: 46.07, state: '(l)' }
    ],
    products: [
      { formula: 'C₂H₄', name: 'ইথিন / ইথিলিন গ্যাস', coeff: 1, mw: 28.05, state: '(g)', isGas: true },
      { formula: 'H₂O', name: 'পানি', coeff: 1, mw: 18.02, state: '(l)' }
    ],
    gases: [{ formula: 'C₂H₄', coeff: 1, name: 'ইথিন গ্যাস' }],
    balancingLogic: [
      '১. ইথানলের আলফা কার্বন হতে -OH মূলক এবং বিটা কার্বন হতে -H পরমাণু অপসারিত হয়ে ১ অণু পানি (H₂O) উৎপন্ন হয়।',
      '২. দুটি কার্বনের মাঝে দ্বিবন্ধন গঠিত হয়ে অসম্পৃক্ত হাইড্রোকার্বন ইথিন (CH₂=CH₂) তৈরি হয়।'
    ],
    whyOccurs: '১৭০°C তাপমাত্রায় অতিরিক্ত গাঢ় সালফিউরিক এসিড তীব্র নিরুদক হিসেবে কাজ করে অ্যালকোহল অণু হতে পানি শোষণ করে নেয়।',
    examNote: 'তাপমাত্রা ১৪০°C এ রাখলে ইথিনের পরিবর্তে ডাই-ইথাইল ইথার ((C₂H₅)₂O) তৈরি হতো।'
  },
  {
    id: 'rx-org-3',
    category: 'organic',
    catName: 'জৈব রূপান্তর (Organic)',
    titleBn: 'ক্যালসিয়াম কার্বাইড হতে অ্যাসিটিলিন (ইথাইন) প্রস্তুতি',
    reactantsStr: 'CaC₂ + 2H₂O',
    productsStr: 'C₂H₂ ↑ + Ca(OH)₂',
    reactants: [
      { formula: 'CaC₂', name: 'ক্যালসিয়াম কার্বাইড', coeff: 1, mw: 64.10, state: '(s)' },
      { formula: 'H₂O', name: 'পানি', coeff: 2, mw: 18.02, state: '(l)' }
    ],
    products: [
      { formula: 'C₂H₂', name: 'ইথাইন / অ্যাসিটিলিন গ্যাস', coeff: 1, mw: 26.04, state: '(g)', isGas: true },
      { formula: 'Ca(OH)₂', name: 'ক্যালসিয়াম হাইড্রোক্সাইড (স্লেকড চুন)', coeff: 1, mw: 74.09, state: '(aq)' }
    ],
    gases: [{ formula: 'C₂H₂', coeff: 1, name: 'অ্যাসিটিলিন গ্যাস' }],
    balancingLogic: [
      '১. কার্বাইড অ্যানায়ন (C₂²⁻) পানির প্রোটন (H⁺) গ্রহণ করে ত্রিবন্ধনযুক্ত ইথাইন গ্যাস (HC≡CH) গঠন করে।',
      '২. ক্যালসিয়াম আয়ন পানির হাইড্রোক্সিল আয়ন (OH⁻) গ্রহণ করে Ca(OH)₂ গঠন করে।'
    ],
    whyOccurs: 'কার্বাইড আয়নের তীব্র প্রোটনগ্রাহী প্রকৃতির কারণে কক্ষ তাপমাত্রায় পানির সংস্পর্শে আসা মাত্রই তীব্রভাবে হাইড্রোলাইসিস ঘটে।',
    examNote: 'অক্সি-অ্যাসিটিলিন শিখা (৩০০০°C) তৈরি করতে এবং ফল পাকাতে এই গ্যাস ব্যবহৃত হয়।'
  },
  {
    id: 'rx-org-4',
    category: 'organic',
    catName: 'জৈব রূপান্তর (Organic)',
    titleBn: 'এস্টারিফিকেশন বিক্রিয়া (ইথাইল ইথানয়েট সুগন্ধি এস্টার প্রস্তুতি)',
    reactantsStr: 'CH₃COOH + C₂H₅OH (গাঢ় H₂SO₄)',
    productsStr: 'CH₃COOC₂H₅ + H₂O',
    reactants: [
      { formula: 'CH₃COOH', name: 'ইথানয়িক এসিড (অ্যাসিটিক এসিড)', coeff: 1, mw: 60.05, state: '(l)' },
      { formula: 'C₂H₅OH', name: 'ইথানল', coeff: 1, mw: 46.07, state: '(l)' }
    ],
    products: [
      { formula: 'CH₃COOC₂H₅', name: 'ইথাইল ইথানয়েট (মিষ্টি ফলের গন্ধযুক্ত এস্টার)', coeff: 1, mw: 88.11, state: '(l)' },
      { formula: 'H₂O', name: 'পানি', coeff: 1, mw: 18.02, state: '(l)' }
    ],
    gases: [],
    balancingLogic: [
      '১. কার্বক্সিলিক এসিডের -COOH অংশ হতে -OH এবং অ্যালকোহলের -OH হতে -H পরমাণু অপসারিত হয়ে পানি গঠিত হয়।',
      '২. অবশিষ্ট অ্যাসিটাইল ও অ্যালকোক্সি মূলক পরস্পর যুক্ত হয়ে এস্টার বন্ধন (-COO-) সৃষ্টি করে।'
    ],
    whyOccurs: 'এসিড প্রভাবকের উপস্থিতিতে নিউক্লিওফিলিক প্রতিস্থাপন বিক্রিয়া ঘটে এবং উৎপন্ন পানিকে H₂SO₄ শোষণ করায় সাম্যাবস্থা ডানে ধাবিত হয়।',
    examNote: 'এস্টারগুলো মিষ্টি ফলের গন্ধযুক্ত হওয়ায় সুগন্ধি পারফিউম ও কৃত্রিম ফ্লেভার তৈরিতে ব্যবহৃত হয়।'
  },

  // -------------------------------------------------------------
  // C. PRECIPITATION REACTIONS (অধঃক্ষেপণ বিক্রিয়া)
  // -------------------------------------------------------------
  {
    id: 'rx-ppt-1',
    category: 'ppt',
    catName: 'অধঃক্ষেপণ (Precipitation)',
    titleBn: 'সিলভার নাইট্রেট ও খাবার লবণের বিক্রিয়ায় AgCl এর সাদা অধঃক্ষেপ',
    reactantsStr: 'AgNO₃ + NaCl',
    productsStr: 'AgCl ↓ (সাদা অধঃক্ষেপ) + NaNO₃',
    reactants: [
      { formula: 'AgNO₃', name: 'সিলভার নাইট্রেট দ্রবণ', coeff: 1, mw: 169.87, state: '(aq)' },
      { formula: 'NaCl', name: 'সোডিয়াম ক্লোরাইড (খাবার লবণ)', coeff: 1, mw: 58.44, state: '(aq)' }
    ],
    products: [
      { formula: 'AgCl', name: 'সিলভার ক্লোরাইড (দধির মতো সাদা অধঃক্ষেপ)', coeff: 1, mw: 143.32, state: '(s)' },
      { formula: 'NaNO₃', name: 'সোডিয়াম নাইট্রেট', coeff: 1, mw: 84.99, state: '(aq)' }
    ],
    gases: [],
    balancingLogic: [
      '১. দ্বৈত প্রতিস্থাপন (Double displacement) প্রক্রিয়ায় Ag⁺ আয়ন Cl⁻ আয়নের সাথে যুক্ত হয়ে কঠিন AgCl তৈরি করে।',
      '২. Na⁺ ও NO₃⁻ আয়ন দর্শক আয়ন হিসেবে দ্রবণে দ্রবীভূত থাকে।'
    ],
    whyOccurs: 'পানিতে সিলভার ক্লোরাইডের দ্রাব্যতা গুণফল (Ksp = 1.8 × 10⁻¹⁰) অত্যন্ত কম। আয়ন দুটির দ্রবণ মিশ্রিত করামাত্র আয়ন গুণফল Ksp অতিক্রম করায় সাথে সাথে সাদা অধঃক্ষেপ পড়ে।',
    examNote: 'এই অধঃক্ষেপ লঘু HNO₃ এ অদ্রবণীয় হলেও অতিরিক্ত NH₄OH দ্রবণে দ্রবীভূত হয়ে ডাইঅ্যামিন সিলভার কমপ্লেক্স ([Ag(NH₃)₂]Cl) গঠন করে।'
  },
  {
    id: 'rx-ppt-2',
    category: 'ppt',
    catName: 'অধঃক্ষেপণ (Precipitation)',
    titleBn: 'বেরিয়াম ক্লোরাইড ও সোডিয়াম সালফেটের বিক্রিয়ায় BaSO₄ অধঃক্ষেপ',
    reactantsStr: 'BaCl₂ + Na₂SO₄',
    productsStr: 'BaSO₄ ↓ (ভারী সাদা অধঃক্ষেপ) + 2NaCl',
    reactants: [
      { formula: 'BaCl₂', name: 'বেরিয়াম ক্লোরাইড', coeff: 1, mw: 208.23, state: '(aq)' },
      { formula: 'Na₂SO₄', name: 'সোডিয়াম সালফেট', coeff: 1, mw: 142.04, state: '(aq)' }
    ],
    products: [
      { formula: 'BaSO₄', name: 'বেরিয়াম সালফেট (ভারী সাদা অধঃক্ষেপ)', coeff: 1, mw: 233.38, state: '(s)' },
      { formula: 'NaCl', name: 'সোডিয়াম ক্লোরাইড', coeff: 2, mw: 58.44, state: '(aq)' }
    ],
    gases: [],
    balancingLogic: [
      '১. Ba²⁺ ক্যাটায়ন SO₄²⁻ অ্যানায়নের সাথে যুক্ত হয়ে অবিশ্লেষ্য BaSO₄ ল্যাটিস গঠন করে।',
      '২. সোডিয়াম এবং ক্লোরিনের চার্জ সমতা করার জন্য উৎপাদে ২ মোল NaCl তৈরি হয়।'
    ],
    whyOccurs: 'BaSO₄ এর ল্যাটিস এনথালপি অত্যন্ত উচ্চ এবং এটি কোনো তীব্র খনিজ এসিডেও (HCl, HNO₃) দ্রবীভূত হয় না।',
    examNote: 'সালফেট আয়ন (SO₄²⁻) নিশ্চিতকরণ পরীক্ষার এটি প্রধান আদর্শ টেস্ট।'
  },
  {
    id: 'rx-ppt-3',
    category: 'ppt',
    catName: 'অধঃক্ষেপণ (Precipitation)',
    titleBn: 'লেড নাইট্রেট ও পটাশিয়াম আয়োডাইডের সোনালী হলুদ অধঃক্ষেপ',
    reactantsStr: 'Pb(NO₃)₂ + 2KI',
    productsStr: 'PbI₂ ↓ (উজ্জ্বল সোনালী হলুদ) + 2KNO₃',
    reactants: [
      { formula: 'Pb(NO₃)₂', name: 'লেড নাইট্রেট দ্রবণ', coeff: 1, mw: 331.20, state: '(aq)' },
      { formula: 'KI', name: 'পটাশিয়াম আয়োডাইড', coeff: 2, mw: 166.00, state: '(aq)' }
    ],
    products: [
      { formula: 'PbI₂', name: 'লেড আয়োডাইড (Golden Rain Ppt)', coeff: 1, mw: 461.01, state: '(s)' },
      { formula: 'KNO₃', name: 'পটাশিয়াম নাইট্রেট', coeff: 2, mw: 101.10, state: '(aq)' }
    ],
    gases: [],
    balancingLogic: [
      '১. Pb²⁺ আয়ন দুটি I⁻ আয়নের সাথে যুক্ত হয়ে PbI₂ গঠন করে।',
      '২. নাইট্রেট আয়নকে ব্যালেন্স করার জন্য ২ মোল KI এবং ২ মোল KNO₃ প্রয়োজন।'
    ],
    whyOccurs: 'PbI₂ একটি বিখ্যাত সোনালী চকচকে অধঃক্ষেপ। গরম পানিতে দ্রবীভূত হয়ে ঠান্ডা করলে স্বর্ণরেণুর মতো চমকাতে থাকে (Golden Spangles)।',
    examNote: 'লেড আয়ন (Pb²⁺) শনাক্তকরণ পরীক্ষায় উজ্জ্বল হলুদ অধঃক্ষেপ নিশ্চিত প্রমাণ দেয়।'
  },

  // -------------------------------------------------------------
  // D. ACID-BASE NEUTRALIZATION (এসিড-ক্ষার প্রশমন)
  // -------------------------------------------------------------
  {
    id: 'rx-neutral-1',
    category: 'neutral',
    catName: 'এসিড-ক্ষার প্রশমন (Neutralization)',
    titleBn: 'তীব্র এসিড (HCl) ও তীব্র ক্ষারের (NaOH) প্রশমন বিক্রিয়া',
    reactantsStr: 'HCl + NaOH',
    productsStr: 'NaCl + H₂O (ΔH = -57.34 kJ/mol)',
    reactants: [
      { formula: 'HCl', name: 'হাইড্রোক্লোরিক এসিড', coeff: 1, mw: 36.46, state: '(aq)' },
      { formula: 'NaOH', name: 'সোডিয়াম হাইড্রোক্সাইড (কস্টিক সোডা)', coeff: 1, mw: 40.00, state: '(aq)' }
    ],
    products: [
      { formula: 'NaCl', name: 'সোডিয়াম ক্লোরাইড (খাবার লবণ)', coeff: 1, mw: 58.44, state: '(aq)' },
      { formula: 'H₂O', name: 'পানি', coeff: 1, mw: 18.02, state: '(l)' }
    ],
    gases: [],
    balancingLogic: [
      '১. এসিড হতে আগত প্রোটন (H⁺) এবং ক্ষার হতে আগত হাইড্রোক্সিল আয়ন (OH⁻) যুক্ত হয়ে ১ মোল পানি (H₂O) গঠন করে।',
      '২. দর্শক আয়ন Na⁺ ও Cl⁻ মিলে লবণ NaCl দ্রবণ আকারে থাকে।'
    ],
    whyOccurs: 'H⁺ ও OH⁻ মিলিত হয়ে পানি তৈরির বিক্রিয়াটি একটি তীব্র তাপোৎপাদী প্রক্রিয়া যার প্রশমন তাপ সর্বদা ধ্রুবক (-৫৭.৩৪ কিলোজুল/মোল)।',
    examNote: 'যেকোনো তীব্র এসিড ও তীব্র ক্ষারের প্রশমন তাপ সর্বদা ধ্রুবক (-57.34 kJ/mol) থাকে।'
  },
  {
    id: 'rx-neutral-2',
    category: 'neutral',
    catName: 'এসিড-ক্ষার প্রশমন (Neutralization)',
    titleBn: 'চুনাপাথর ও হাইড্রোক্লোরিক এসিডের বিক্রিয়ায় CO₂ গ্যাস প্রস্তুতি',
    reactantsStr: 'CaCO₃ + 2HCl',
    productsStr: 'CaCl₂ + CO₂ ↑ + H₂O',
    reactants: [
      { formula: 'CaCO₃', name: 'ক্যালসিয়াম কার্বনেট (চুনাপাথর/মার্বেল)', coeff: 1, mw: 100.09, state: '(s)' },
      { formula: 'HCl', name: 'হাইড্রোক্লোরিক এসিড', coeff: 2, mw: 36.46, state: '(aq)' }
    ],
    products: [
      { formula: 'CaCl₂', name: 'ক্যালসিয়াম ক্লোরাইড', coeff: 1, mw: 110.98, state: '(aq)' },
      { formula: 'CO₂', name: 'কার্বন ডাইঅক্সাইড গ্যাস (বুদবুদ)', coeff: 1, mw: 44.01, state: '(g)', isGas: true },
      { formula: 'H₂O', name: 'পানি', coeff: 1, mw: 18.02, state: '(l)' }
    ],
    gases: [{ formula: 'CO₂', coeff: 1, name: 'কার্বন ডাইঅক্সাইড' }],
    balancingLogic: [
      '১. কার্বনেট আয়ন (CO₃²⁻) ২টি H⁺ আয়নের সাথে বিক্রিয়া করে অস্থায়ী কার্বনিক এসিড (H₂CO₃) গঠন করে।',
      '২. কার্বনিক এসিড তাৎক্ষণিক ভেঙে গিয়ে CO₂ গ্যাস ও H₂O উৎপন্ন করে।'
    ],
    whyOccurs: 'কার্বনেট লবণের চেয়ে শক্তিশালী এসিড যোগ করলে কার্বন ডাইঅক্সাইড তীব্র বুদবুদ আকারে দ্রুত নির্গত হয়ে বিক্রিয়াকে সামনে এগিয়ে নেয়।',
    examNote: 'নির্গত গ্যাস চুনের পানিতে চালনা করলে পানি ঘোলা হয় (CaCO₃ গঠনের কারণে)।'
  }
];

const CATEGORIES = [
  { id: 'ALL', name: 'সকল বিক্রিয়া (All Reactions)', icon: Sparkles },
  { id: 'redox', name: 'জারণ-বিজারণ (Redox)', icon: Flame },
  { id: 'organic', name: 'জৈব রূপান্তর (Organic)', icon: Atom },
  { id: 'ppt', name: 'অধঃক্ষেপণ (Precipitation)', icon: Droplets },
  { id: 'neutral', name: 'এসিড-ক্ষার প্রশমন (Neutralization)', icon: Scale }
];

// =========================================================================
// 2. MAIN COMPONENT: MASTER CHEMISTRY LAB
// =========================================================================
export default function MasterChemistryLab() {
  const [selectedCat, setSelectedCat] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeReactionId, setActiveReactionId] = useState(MASTER_REACTIONS_DB[0].id);
  const [moleMultiplier, setMoleMultiplier] = useState(1.0); // 1x to 10x interactive slider
  const [isExporting, setIsExporting] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState('reactions-hub'); // 'reactions-hub' | 'redox-engine' | 'galvanic' | 'bonding-ch5' | 'math-ch6'
  const labRef = useRef(null);

  // Active Reaction Object
  const currentRx = useMemo(() => {
    return MASTER_REACTIONS_DB.find(r => r.id === activeReactionId) || MASTER_REACTIONS_DB[0];
  }, [activeReactionId]);

  // Filtered reactions list
  const filteredReactions = useMemo(() => {
    return MASTER_REACTIONS_DB.filter(rx => {
      const matchCat = selectedCat === 'ALL' || rx.category === selectedCat;
      const q = searchQuery.toLowerCase().trim();
      const matchQ =
        !q ||
        rx.titleBn.toLowerCase().includes(q) ||
        rx.reactantsStr.toLowerCase().includes(q) ||
        rx.productsStr.toLowerCase().includes(q) ||
        rx.catName.toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  }, [selectedCat, searchQuery]);

  // Total Reactant and Product Mass calculations
  const reactionMetrics = useMemo(() => {
    let totalReactantMass = 0;
    currentRx.reactants.forEach(r => {
      totalReactantMass += r.coeff * r.mw * moleMultiplier;
    });

    let totalProductMass = 0;
    currentRx.products.forEach(p => {
      totalProductMass += p.coeff * p.mw * moleMultiplier;
    });

    // Total gas volume at STP
    let totalGasVolume = 0;
    currentRx.gases?.forEach(g => {
      totalGasVolume += g.coeff * 22.4 * moleMultiplier;
    });

    return {
      reactantMass: totalReactantMass.toFixed(2),
      productMass: totalProductMass.toFixed(2),
      gasVolumeSTP: totalGasVolume.toFixed(2),
      hasGas: (currentRx.gases?.length || 0) > 0
    };
  }, [currentRx, moleMultiplier]);

  // Export card
  const handleExport = async () => {
    if (!labRef.current) return;
    setIsExporting(true);
    try {
      await exportBrandedGraphic(labRef.current, {
        fileName: `NextGen_Master_Chemistry_${currentRx.id}`,
        cardTitle: `মাস্টার কেমিস্ট্রি বিক্রিয়া ও স্টয়কিওমিতি: ${currentRx.titleBn}`,
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
      <div className="p-6 bg-gradient-to-r from-slate-900 via-emerald-950/50 to-slate-900 border border-slate-800 rounded-3xl shadow-xl text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="p-3.5 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-inner">
            <FlaskConical className="w-9 h-9 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black text-white">রসায়ন মাস্টার ল্যাব ও বিক্রিয়া ইঞ্জিন (Master Chemistry Lab)</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold font-mono">
                SSC & HSC Complete 🧪
              </span>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              জারণ-বিজারণ, জৈব রূপান্তর, অধঃক্ষেপণ ও এসিড-ক্ষার প্রশমন সমীকরণ, স্টয়কিওমিতি মোলার ভর ও STP গ্যাস আয়তন সিমুলেটর
            </p>
          </div>
        </div>

        {/* Master Lab Switcher */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveSubTab('reactions-hub')}
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                activeSubTab === 'reactions-hub' ? 'bg-emerald-600 text-white shadow-md font-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              <FlaskConical className="w-3.5 h-3.5" />
              <span>বিক্রিয়া ও সমতাকরণ</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSubTab('redox-engine')}
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                activeSubTab === 'redox-engine' ? 'bg-rose-600 text-white shadow-md font-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>জারণ সংখ্যা ল্যাব</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSubTab('daniell')}
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                activeSubTab === 'daniell' ? 'bg-amber-600 text-white shadow-md font-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              <BatteryCharging className="w-3.5 h-3.5" />
              <span>ড্যানিয়েল কোষ (Zn-Cu)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSubTab('dry-cell')}
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                activeSubTab === 'dry-cell' ? 'bg-indigo-600 text-white shadow-md font-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Battery className="w-3.5 h-3.5" />
              <span>শুষ্ক কোষ (Dry Cell)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSubTab('galvanic')}
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                activeSubTab === 'galvanic' ? 'bg-cyan-600 text-white shadow-md font-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>কাস্টম গ্যালভানিক কোষ</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleExport}
            disabled={isExporting}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
          >
            {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            <span>ডাউনলোড (HD)</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SUB-VIEW 1: MASTER CHEMICAL REACTIONS & STOICHIOMETRY HUB */}
      {/* ========================================================================= */}
      {activeSubTab === 'reactions-hub' && (
        <div className="space-y-6">
          {/* Category Filter Pills & Search Bar */}
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl text-white">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="বিক্রিয়া, যৌগ বা নাম দিয়ে খুঁজুন (যেমন: KMnO4, ইথিন, AgCl)..."
                className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 text-xs font-bold scrollbar-none">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isSelected = selectedCat === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCat(cat.id)}
                    className={`px-3 py-2 rounded-xl whitespace-nowrap transition-all text-xs font-bold flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-emerald-600 text-white shadow-md scale-105'
                        : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{cat.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Reaction Select Grid */}
          <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-3xl">
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-xs font-black text-slate-400 uppercase tracking-wider">
                উপলব্ধ বিক্রিয়াসমূহ ({filteredReactions.length}টি সমীকরণ)
              </span>
              <span className="text-xs text-slate-500 italic hidden sm:inline">
                💡 যেকোনো সমীকরণে ক্লিক করে ব্যালেন্সিং ও স্টয়কিওমিতি সিমুলেশন দেখুন
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredReactions.map((rx) => {
                const isSelected = activeReactionId === rx.id;
                return (
                  <button
                    key={rx.id}
                    type="button"
                    onClick={() => setActiveReactionId(rx.id)}
                    className={`p-3.5 rounded-2xl border-2 text-left transition-all hover:scale-[1.02] flex flex-col justify-between gap-2 ${
                      isSelected
                        ? 'bg-emerald-950/40 border-emerald-500 shadow-lg shadow-emerald-500/20'
                        : 'bg-slate-950/80 border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-900 text-emerald-300 font-bold font-mono">
                          {rx.catName}
                        </span>
                        {rx.gases?.length > 0 && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold flex items-center gap-1">
                            <Wind className="w-2.5 h-2.5" /> গ্যাস
                          </span>
                        )}
                      </div>
                      <h4 className="font-bold text-xs text-white mt-1.5 line-clamp-1">{rx.titleBn}</h4>
                    </div>
                    <p className="font-mono text-[11px] text-cyan-300 bg-slate-900/90 p-2 rounded-xl border border-slate-800/80 truncate">
                      {rx.reactantsStr} → {rx.productsStr}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Detailed Reaction Breakdown & Interactive Stoichiometry Stage */}
          <div ref={labRef} className="bg-slate-900 border-2 border-emerald-500/40 rounded-3xl p-6 sm:p-8 text-white shadow-2xl space-y-6 relative overflow-hidden">
            {/* Header & Reaction Overview */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold border border-emerald-500/30">
                  {currentRx.catName}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white mt-1.5">{currentRx.titleBn}</h3>
              </div>

              {/* Mole Multiplier Interactive Slider */}
              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 w-full sm:w-72 space-y-1.5 shadow-inner">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-400">মোল স্কেলার (Multiplier):</span>
                  <span className="text-emerald-400 font-mono font-black text-sm">{moleMultiplier}x মোল</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="10"
                  step="0.5"
                  value={moleMultiplier}
                  onChange={(e) => setMoleMultiplier(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>0.5x</span>
                  <span>1.0x (Standard)</span>
                  <span>10.0x</span>
                </div>
              </div>
            </div>

            {/* Fully Balanced Chemical Equation Box */}
            <div className="p-6 rounded-3xl bg-slate-950 border-2 border-cyan-500/40 text-center space-y-3 shadow-inner">
              <span className="text-xs font-black text-cyan-400 uppercase tracking-widest block">
                সম্পূর্ণ সমতাকৃত সমীকরণ (Fully Balanced Reaction)
              </span>
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 inline-block max-w-full overflow-x-auto">
                <span className="font-mono text-base sm:text-xl font-black text-cyan-300 tracking-wide">
                  {currentRx.reactants.map((r, idx) => (
                    <span key={idx}>
                      <strong className="text-emerald-400 font-bold">{(r.coeff * moleMultiplier).toFixed(r.coeff * moleMultiplier % 1 === 0 ? 0 : 1)}</strong>
                      {r.formula}{r.state}{' '}
                      {idx < currentRx.reactants.length - 1 ? '+ ' : ''}
                    </span>
                  ))}
                  <span className="text-amber-400 font-black px-2">→</span>
                  {currentRx.products.map((p, idx) => (
                    <span key={idx}>
                      <strong className="text-cyan-400 font-bold">{(p.coeff * moleMultiplier).toFixed(p.coeff * moleMultiplier % 1 === 0 ? 0 : 1)}</strong>
                      {p.formula}{p.state}{' '}
                      {idx < currentRx.products.length - 1 ? '+ ' : ''}
                    </span>
                  ))}
                </span>
              </div>
            </div>

            {/* Stoichiometric Mass & Molar Volume Gauges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 shadow-inner">
                <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">
                  বিক্রিয়কের মোট ভর (Reactant Mass):
                </span>
                <strong className="text-2xl font-black text-emerald-400 font-mono mt-1 block">
                  {reactionMetrics.reactantMass} <span className="text-xs font-sans text-slate-400">গ্রাম (g)</span>
                </strong>
                <span className="text-[10px] text-slate-500 font-mono">ভরের নিত্যতা সূত্র মেনে চলে</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 shadow-inner">
                <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">
                  উৎপাদের মোট ভর (Product Mass):
                </span>
                <strong className="text-2xl font-black text-cyan-400 font-mono mt-1 block">
                  {reactionMetrics.productMass} <span className="text-xs font-sans text-slate-400">গ্রাম (g)</span>
                </strong>
                <span className="text-[10px] text-slate-500 font-mono">বিক্রিয়ক ভর ≡ উৎপাদ ভর</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-amber-500/40 shadow-inner">
                <span className="text-[10px] text-amber-300 block font-bold uppercase tracking-wider flex items-center gap-1">
                  <Wind className="w-3.5 h-3.5" />
                  STP তে নির্গত গ্যাস আয়তন (Molar Volume):
                </span>
                <strong className="text-2xl font-black text-amber-400 font-mono mt-1 block">
                  {reactionMetrics.hasGas ? `${reactionMetrics.gasVolumeSTP} L` : 'N/A (গ্যাস নেই)'}
                </strong>
                <span className="text-[10px] text-slate-400 font-mono">1 mol Gas = 22.4 L at STP (0°C, 1 atm)</span>
              </div>
            </div>

            {/* 2-Column: Step-by-step Balancing Logic & Why This Reaction Occurs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Step-by-Step Balancing Logic */}
              <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 space-y-3 shadow-inner">
                <h4 className="font-black text-emerald-400 text-xs uppercase tracking-wider flex items-center gap-2">
                  <Scale className="w-4 h-4 text-emerald-400" />
                  ধাপে ধাপে সমতাকরণ যুক্তি (Step-by-Step Balancing Logic)
                </h4>
                <div className="space-y-2 pt-1 text-xs">
                  {currentRx.balancingLogic.map((logic, lIdx) => (
                    <div key={lIdx} className="p-3 rounded-2xl bg-slate-900 border border-slate-800/80 text-slate-200 leading-relaxed font-mono">
                      {logic}
                    </div>
                  ))}
                </div>
              </div>

              {/* Scientific Explanation & Exam Keynotes */}
              <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 space-y-3 shadow-inner">
                <h4 className="font-black text-cyan-400 text-xs uppercase tracking-wider flex items-center gap-2">
                  <Brain className="w-4 h-4 text-cyan-400" />
                  বিক্রিয়াটি কেন ঘটে? (Why Reaction Occurs - Student Clarity)
                </h4>
                <div className="space-y-3 text-xs">
                  <div className="p-3.5 rounded-2xl bg-slate-900 border border-cyan-500/30 text-cyan-100/90 leading-relaxed">
                    <strong className="text-cyan-300 block mb-1 font-bold">💡 বিক্রিয়ার মূল চালিকাশক্তি (Driving Force):</strong>
                    {currentRx.whyOccurs}
                  </div>
                  <div className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-100/90 leading-relaxed">
                    <strong className="text-emerald-300 block mb-1 font-bold">📌 বোর্ড পরীক্ষার স্মার্ট টিপস (Exam Keynote):</strong>
                    {currentRx.examNote}
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
      )}

      {/* ========================================================================= */}
      {/* SUB-VIEW 2: REDOX & OXIDATION NUMBER ENGINE */}
      {/* ========================================================================= */}
      {activeSubTab === 'redox-engine' && <RedoxOxidationEngine />}

      {/* ========================================================================= */}
      {/* SUB-VIEW 3: CLASSIC DANIELL CELL (Zn-Cu) SIMULATOR */}
      {/* ========================================================================= */}
      {activeSubTab === 'daniell' && <DaniellCellSimulation />}

      {/* ========================================================================= */}
      {/* SUB-VIEW 4: DRY CELL (LECLANCHE CELL) SIMULATOR */}
      {/* ========================================================================= */}
      {activeSubTab === 'dry-cell' && <DryCellSimulation />}

      {/* ========================================================================= */}
      {/* SUB-VIEW 5: CUSTOM GALVANIC CELL SIMULATOR */}
      {/* ========================================================================= */}
      {activeSubTab === 'galvanic' && <GalvanicCellSimulation />}
    </div>
  );
}
