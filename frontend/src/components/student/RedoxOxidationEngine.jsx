import React, { useState, useMemo, useRef } from 'react';
import {
  Flame,
  Zap,
  Sparkles,
  Search,
  Download,
  Brain,
  Layers,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  TrendingUp,
  Award,
  BookOpen,
  Info,
  Scale,
  RefreshCw,
  Sliders,
  ChevronRight,
  ShieldCheck,
  Activity,
  Loader2
} from 'lucide-react';
import { exportBrandedGraphic } from '../../utils/exportBrandedGraphic';

// Comprehensive database of chemical compounds and their step-by-step oxidation state solutions
const COMPOUNDS_DATABASE = [
  {
    formula: 'KMnO4',
    nameBn: 'পটাশিয়াম পারম্যাঙ্গানেট (KMnO₄)',
    targetAtom: 'Mn',
    targetOx: '+7',
    targetName: 'ম্যাঙ্গানিজ (Mn)',
    color: '#a855f7',
    atoms: [
      { sym: 'K', count: 1, state: '+1', name: 'পটাশিয়াম (গ্রুপ-১ ক্ষার ধাতু)' },
      { sym: 'Mn', count: 1, state: '+7', name: 'ম্যাঙ্গানিজ (নির্ণেয় কেন্দ্রীয় পরমাণু)', isTarget: true },
      { sym: 'O', count: 4, state: '-2', name: 'অক্সিজেন (সাধারণ অক্সাইড)' }
    ],
    totalCharge: 0,
    steps: [
      'ধরি, Mn এর জারণ সংখ্যা = x',
      'K এর জারণ সংখ্যা = +1 (গ্রুপ-১ মৌল)',
      'O এর জারণ সংখ্যা = -2 (সাধারণ অক্সাইড)',
      'নিরপেক্ষ যৌগের মোট জারণ সংখ্যার যোগফল = 0',
      'সমীকরণ: (+1) × 1 + x + (-2) × 4 = 0',
      'বা, +1 + x - 8 = 0',
      'বা, x - 7 = 0',
      'অতএব, x = +7 (KMnO₄ যৌগে ম্যাঙ্গানিজের জারণ সংখ্যা +7)'
    ],
    note: 'Mn এর জারণ অবস্থা সর্বোচ্চ +7 হওয়ায় KMnO₄ একটি তীব্র জারক পদার্থ।'
  },
  {
    formula: 'K2Cr2O7',
    nameBn: 'পটাশিয়াম ডাইক্রোমেট (K₂Cr₂O₇)',
    targetAtom: 'Cr',
    targetOx: '+6',
    targetName: 'ক্রোমিয়াম (Cr)',
    color: '#f97316',
    atoms: [
      { sym: 'K', count: 2, state: '+1', name: 'পটাশিয়াম' },
      { sym: 'Cr', count: 2, state: '+6', name: 'ক্রোমিয়াম (নির্ণেয়)', isTarget: true },
      { sym: 'O', count: 7, state: '-2', name: 'অক্সিজেন' }
    ],
    totalCharge: 0,
    steps: [
      'ধরি, Cr এর জারণ সংখ্যা = x',
      'K এর জারণ সংখ্যা = +1, O এর জারণ সংখ্যা = -2',
      'সমীকরণ: (+1) × 2 + (x) × 2 + (-2) × 7 = 0',
      'বা, +2 + 2x - 14 = 0',
      'বা, 2x - 12 = 0',
      'বা, 2x = +12',
      'অতএব, x = +6 (K₂Cr₂O₇ যৌগে প্রতিটি ক্রোমিয়ামের জারণ সংখ্যা +6)'
    ],
    note: 'কমলা রঙের K₂Cr₂O₇ এসিডীয় মাধ্যমে বিজারিত হয়ে সবুজ রঙের Cr³⁺ এ রূপান্তরিত হয়।'
  },
  {
    formula: 'H2SO4',
    nameBn: 'সালফিউরিক এসিড (H₂SO₄)',
    targetAtom: 'S',
    targetOx: '+6',
    targetName: 'সালফার (S)',
    color: '#eab308',
    atoms: [
      { sym: 'H', count: 2, state: '+1', name: 'হাইড্রোজেন' },
      { sym: 'S', count: 1, state: '+6', name: 'সালফার (নির্ণেয়)', isTarget: true },
      { sym: 'O', count: 4, state: '-2', name: 'অক্সিজেন' }
    ],
    totalCharge: 0,
    steps: [
      'ধরি, S এর জারণ সংখ্যা = x',
      'H এর জারণ সংখ্যা = +1, O এর জারণ সংখ্যা = -2',
      'সমীকরণ: (+1) × 2 + x + (-2) × 4 = 0',
      'বা, +2 + x - 8 = 0',
      'বা, x - 6 = 0',
      'অতএব, x = +6 (H₂SO₄ এ সালফারের জারণ সংখ্যা +6)'
    ],
    note: 'সালফারের সর্বোচ্চ জারণ সংখ্যা +6, তাই এটি তীব্র জারক ও পানিশোষক হিসেবে কাজ করে।'
  },
  {
    formula: 'HNO3',
    nameBn: 'নাইট্রিক এসিড (HNO₃)',
    targetAtom: 'N',
    targetOx: '+5',
    targetName: 'নাইট্রোজেন (N)',
    color: '#06b6d4',
    atoms: [
      { sym: 'H', count: 1, state: '+1', name: 'হাইড্রোজেন' },
      { sym: 'N', count: 1, state: '+5', name: 'নাইট্রোজেন (নির্ণেয়)', isTarget: true },
      { sym: 'O', count: 3, state: '-2', name: 'অক্সিজেন' }
    ],
    totalCharge: 0,
    steps: [
      'ধরি, N এর জারণ সংখ্যা = x',
      'সমীকরণ: (+1) × 1 + x + (-2) × 3 = 0',
      'বা, +1 + x - 6 = 0',
      'বা, x - 5 = 0',
      'অতএব, x = +5 (HNO₃ এ নাইট্রোজেনের জারণ সংখ্যা +5)'
    ],
    note: 'তীব্র জারক এসিড; ধাতুগুলোকে দ্রুত জারিত করে ধাতব নাইট্রেট উৎপন্ন করে।'
  },
  {
    formula: 'H2O2',
    nameBn: 'হাইড্রোজেন পারঅক্সাইড (H₂O₂ - পারঅক্সাইড ব্যতিক্রম)',
    targetAtom: 'O',
    targetOx: '-1',
    targetName: 'অক্সিজেন (O)',
    color: '#ec4899',
    atoms: [
      { sym: 'H', count: 2, state: '+1', name: 'হাইড্রোজেন' },
      { sym: 'O', count: 2, state: '-1', name: 'অক্সিজেন (পারঅক্সাইড লিঙ্কেজ)', isTarget: true }
    ],
    totalCharge: 0,
    steps: [
      'ধরি, O এর জারণ সংখ্যা = x',
      'H এর জারণ সংখ্যা = +1',
      'সমীকরণ: (+1) × 2 + (x) × 2 = 0',
      'বা, +2 + 2x = 0',
      'বা, 2x = -2',
      'অতএব, x = -1 (⚠️ ব্যতিক্রম: পারঅক্সাইডে অক্সিজেনের জারণ সংখ্যা -1 হয়)'
    ],
    note: 'H₂O₂ একই সাথে জারক এবং বিজারক উভয় হিসেবেই কাজ করতে পারে।'
  },
  {
    formula: 'Na2S2O3',
    nameBn: 'সোডিয়াম থায়োসালফেট (Na₂S₂O₃)',
    targetAtom: 'S',
    targetOx: '+2',
    targetName: 'সালফার (S)',
    color: '#10b981',
    atoms: [
      { sym: 'Na', count: 2, state: '+1', name: 'সোডিয়াম' },
      { sym: 'S', count: 2, state: '+2', name: 'সালফার (গড় জারণ সংখ্যা)', isTarget: true },
      { sym: 'O', count: 3, state: '-2', name: 'অক্সিজেন' }
    ],
    totalCharge: 0,
    steps: [
      'ধরি, S এর গড় জারণ সংখ্যা = x',
      'সমীকরণ: (+1) × 2 + (x) × 2 + (-2) × 3 = 0',
      'বা, +2 + 2x - 6 = 0',
      'বা, 2x - 4 = 0',
      'বা, 2x = +4',
      'অতএব, x = +2 (Na₂S₂O₃ এ সালফারের গড় জারণ সংখ্যা +2)'
    ],
    note: 'আয়োডোমিতি টাইট্রেশনে আয়োডিন বিজারণে বহুল ব্যবহৃত বিজারক।'
  },
  {
    formula: 'Cr2O7^2-',
    nameBn: 'ডাইক্রোমেট আয়ন (Cr₂O₇²⁻ - মূলক/আয়ন)',
    targetAtom: 'Cr',
    targetOx: '+6',
    targetName: 'ক্রোমিয়াম (Cr)',
    color: '#f43f5e',
    atoms: [
      { sym: 'Cr', count: 2, state: '+6', name: 'ক্রোমিয়াম (নির্ণেয়)', isTarget: true },
      { sym: 'O', count: 7, state: '-2', name: 'অক্সিজেন' }
    ],
    totalCharge: -2,
    steps: [
      'ধরি, Cr এর জারণ সংখ্যা = x',
      'যেহেতু এটি -2 চার্জযুক্ত আয়ন, তাই মোট যোগফল = -2',
      'সমীকরণ: (x) × 2 + (-2) × 7 = -2',
      'বা, 2x - 14 = -2',
      'বা, 2x = -2 + 14',
      'বা, 2x = +12',
      'অতএব, x = +6 (Cr₂O₇²⁻ আয়নে ক্রোমিয়ামের জারণ সংখ্যা +6)'
    ],
    note: 'আয়নের ক্ষেত্রে জারণ সংখ্যার বীজগাণিতিক যোগফল আয়নের চার্জের সমান হয়।'
  },
  {
    formula: 'OF2',
    nameBn: 'অক্সিজেন ডাইফ্লোরাইড (OF₂ - ব্যতিক্রম)',
    targetAtom: 'O',
    targetOx: '+2',
    targetName: 'অক্সিজেন (O)',
    color: '#38bdf8',
    atoms: [
      { sym: 'O', count: 1, state: '+2', name: 'অক্সিজেন (ধনাত্মক জারণ সংখ্যা)', isTarget: true },
      { sym: 'F', count: 2, state: '-1', name: 'ফ্লোরিন (সর্বাধিক তড়িৎ-ঋণাত্মক)' }
    ],
    totalCharge: 0,
    steps: [
      'ধরি, O এর জারণ সংখ্যা = x',
      'যেহেতু ফ্লোরিনের তড়িৎ-ঋণাত্মকতা অক্সিজেনের চেয়ে বেশি, তাই F = -1',
      'সমীকরণ: x + (-1) × 2 = 0',
      'বা, x - 2 = 0',
      'অতএব, x = +2 (⚠️ ব্যতিক্রম: OF₂ যৌগে অক্সিজেনের জারণ সংখ্যা +2)'
    ],
    note: 'একমাত্র ফ্লোরিনের সাথেই অক্সিজেন ধনাত্মক জারণ অবস্থা (+2) প্রদর্শন করে।'
  },
  {
    formula: 'KO2',
    nameBn: 'পটাশিয়াম সুপারঅক্সাইড (KO₂ - সুপারঅক্সাইড)',
    targetAtom: 'O',
    targetOx: '-1/2',
    targetName: 'অক্সিজেন (O)',
    color: '#f59e0b',
    atoms: [
      { sym: 'K', count: 1, state: '+1', name: 'পটাশিয়াম' },
      { sym: 'O', count: 2, state: '-1/2', name: 'অক্সিজেন (সুপারঅক্সাইড)', isTarget: true }
    ],
    totalCharge: 0,
    steps: [
      'ধরি, O এর জারণ সংখ্যা = x',
      'K এর জারণ সংখ্যা = +1',
      'সমীকরণ: (+1) × 1 + (x) × 2 = 0',
      'বা, +1 + 2x = 0',
      'বা, 2x = -1',
      'অতএব, x = -1/2 (⚠️ ব্যতিক্রম: সুপারঅক্সাইডে অক্সিজেনের জারণ সংখ্যা -1/2 বা -0.5 হয়)'
    ],
    note: 'মহাকাশযান ও সাবমেরিনে কার্বন ডাইঅক্সাইড শোষণ করে অক্সিজেন মুক্ত করতে ব্যবহৃত হয়।'
  }
];

// Classic Complete Redox Reactions with Full Step-by-Step Ion-Electron Balancing
const REDOX_REACTIONS = [
  {
    id: 'kmno4-feso4',
    titleBn: '১. অম্লীয় মাধ্যমে KMnO₄ দ্বারা FeSO₄ এর জারণ',
    reactants: 'KMnO₄ + FeSO₄ + H₂SO₄',
    products: 'K₂SO₄ + MnSO₄ + Fe₂(SO₄)₃ + H₂O',
    oxidizingAgent: {
      formula: 'KMnO₄ (ম্যাঙ্গানিজ আয়ন MnO₄⁻)',
      stateChange: 'Mn⁺⁷ → Mn⁺²',
      gainLoss: '৫টি ইলেকট্রন গ্রহণ (ইলেকট্রন লাভ = বিজারণ)',
      role: 'তীব্র জারক (Oxidizing Agent)'
    },
    reducingAgent: {
      formula: 'FeSO₄ (ফেরাস আয়ন Fe²⁺)',
      stateChange: 'Fe⁺² → Fe⁺³',
      gainLoss: '১টি ইলেকট্রন বর্জন (ইলেকট্রন ত্যাগ = জারণ)',
      role: 'বিজারক (Reducing Agent)'
    },
    oxHalf: 'Fe²⁺ → Fe³⁺ + e⁻  (জারণ অর্ধ-বিক্রিয়া)',
    redHalf: 'MnO₄⁻ + 8H⁺ + 5e⁻ → Mn²⁺ + 4H₂O  (বিজারণ অর্ধ-বিক্রিয়া)',
    multiplier: 'জারণ অর্ধ-বিক্রিয়াকে ৫ দিয়ে গুণ করে বিজারণ অর্ধ-বিক্রিয়ার সাথে যোগ করি:',
    netIonic: 'MnO₄⁻ + 5Fe²⁺ + 8H⁺ → Mn²⁺ + 5Fe³⁺ + 4H₂O',
    spectators: 'উভয় পাশে প্রয়োজনীয় দর্শক আয়ন (K⁺ ও SO₄²⁻) যোগ করে পাই:',
    fullBalanced: '2KMnO₄ + 10FeSO₄ + 8H₂SO₄ → K₂SO₄ + 2MnSO₄ + 5Fe₂(SO₄)₃ + 8H₂O',
    stoichiometryRatio: '২ মোল KMnO₄ ≡ ১০ মোল FeSO₄ ≡ ৮ মোল H₂SO₄ (১ মোল KMnO₄ ≡ ৫ মোল FeSO₄)'
  },
  {
    id: 'k2cr2o7-feso4',
    titleBn: '২. অম্লীয় মাধ্যমে K₂Cr₂O₇ দ্বারা FeSO₄ এর জারণ',
    reactants: 'K₂Cr₂O₇ + FeSO₄ + H₂SO₄',
    products: 'K₂SO₄ + Cr₂(SO₄)₃ + Fe₂(SO₄)₃ + H₂O',
    oxidizingAgent: {
      formula: 'K₂Cr₂O₇ (ডাইক্রোমেট আয়ন Cr₂O₇²⁻)',
      stateChange: 'Cr⁺⁶ (২টি) → Cr⁺³ (২টি)',
      gainLoss: 'মোট ৬টি ইলেকট্রন গ্রহণ (বিজারণ)',
      role: 'কমলা রঙের শক্তিশালী জারক'
    },
    reducingAgent: {
      formula: 'FeSO₄ (Fe²⁺)',
      stateChange: 'Fe⁺² → Fe⁺³',
      gainLoss: '১টি ইলেকট্রন বর্জন (জারণ)',
      role: 'বিজারক'
    },
    oxHalf: 'Fe²⁺ → Fe³⁺ + e⁻  (জারণ অর্ধ-বিক্রিয়া)',
    redHalf: 'Cr₂O₇²⁻ + 14H⁺ + 6e⁻ → 2Cr³⁺ + 7H₂O  (বিজারণ অর্ধ-বিক্রিয়া)',
    multiplier: 'জারণ অর্ধ-বিক্রিয়াকে ৬ দিয়ে গুণ করে বিজারণ অর্ধ-বিক্রিয়ার সাথে যোগ করি:',
    netIonic: 'Cr₂O₇²⁻ + 6Fe²⁺ + 14H⁺ → 2Cr³⁺ + 6Fe³⁺ + 7H₂O',
    spectators: 'উভয় পাশে দর্শক আয়ন (2K⁺ ও 7SO₄²⁻) যোগ করে পাই:',
    fullBalanced: 'K₂Cr₂O₇ + 6FeSO₄ + 7H₂SO₄ → K₂SO₄ + Cr₂(SO₄)₃ + 3Fe₂(SO₄)₃ + 7H₂O',
    stoichiometryRatio: '১ মোল K₂Cr₂O₇ ≡ ৬ মোল FeSO₄ ≡ ৭ মোল H₂SO₄'
  },
  {
    id: 'kmno4-oxalic',
    titleBn: '৩. অম্লীয় মাধ্যমে KMnO₄ দ্বারা অক্সালিক এসিডের (H₂C₂O₄) জারণ',
    reactants: 'KMnO₄ + H₂C₂O₄ + H₂SO₄',
    products: 'K₂SO₄ + MnSO₄ + CO₂ + H₂O',
    oxidizingAgent: {
      formula: 'KMnO₄ (Mn⁺⁷)',
      stateChange: 'Mn⁺⁷ → Mn⁺²',
      gainLoss: '৫টি ইলেকট্রন গ্রহণ (বিজারণ)',
      role: 'জারক'
    },
    reducingAgent: {
      formula: 'H₂C₂O₄ (অক্সালেট আয়ন C₂O₄²⁻)',
      stateChange: 'C⁺³ (২টি) → C⁺⁴ (২টি CO₂ তে)',
      gainLoss: '২টি ইলেকট্রন বর্জন (জারণ)',
      role: 'বিজারক'
    },
    oxHalf: 'C₂O₄²⁻ → 2CO₂ + 2e⁻  (জারণ অর্ধ-বিক্রিয়া)',
    redHalf: 'MnO₄⁻ + 8H⁺ + 5e⁻ → Mn²⁺ + 4H₂O  (বিজারণ অর্ধ-বিক্রিয়া)',
    multiplier: 'জারণ অর্ধ-বিক্রিয়াকে ৫ দ্বারা এবং বিজারণ অর্ধ-বিক্রিয়াকে ২ দ্বারা গুণ করে যোগ করি:',
    netIonic: '2MnO₄⁻ + 5C₂O₄²⁻ + 16H⁺ → 2Mn²⁺ + 10CO₂ + 8H₂O',
    spectators: 'উভয় পাশে দর্শক আয়ন যোগ করে পাই:',
    fullBalanced: '2KMnO₄ + 5H₂C₂O₄ + 3H₂SO₄ → K₂SO₄ + 2MnSO₄ + 10CO₂ + 8H₂O',
    stoichiometryRatio: '২ মোল KMnO₄ ≡ ৫ মোল H₂C₂O₄ ≡ ৩ মোল H₂SO₄'
  },
  {
    id: 'na2s2o3-i2',
    titleBn: '৪. আয়োডিন ও সোডিয়াম থায়োসালফেটের আয়োডোমিতি বিক্রিয়া',
    reactants: 'Na₂S₂O₃ + I₂',
    products: 'Na₂S₄O₆ (সোডিয়াম টেট্রাথায়োনেট) + NaI',
    oxidizingAgent: {
      formula: 'I₂ (মৌলিক আয়োডিন, জারণ সংখ্যা ০)',
      stateChange: 'I₂⁰ → 2I⁻¹',
      gainLoss: '২টি ইলেকট্রন গ্রহণ (বিজারণ)',
      role: 'জারক'
    },
    reducingAgent: {
      formula: 'Na₂S₂O₃ (থায়োসালফেট আয়ন S₂O₃²⁻)',
      stateChange: '2S⁺² (গড়) → S₄⁺²·⁵ (টেট্রাথায়োনেটে)',
      gainLoss: '২টি ইলেকট্রন বর্জন (জারণ)',
      role: 'বিজারক'
    },
    oxHalf: '2S₂O₃²⁻ → S₄O₆²⁻ + 2e⁻  (জারণ অর্ধ-বিক্রিয়া)',
    redHalf: 'I₂ + 2e⁻ → 2I⁻  (বিজারণ অর্ধ-বিক্রিয়া)',
    multiplier: 'উভয় অর্ধ-বিক্রিয়া সরাসরি যোগ করে পাই:',
    netIonic: '2S₂O₃²⁻ + I₂ → S₄O₆²⁻ + 2I⁻',
    spectators: 'উভয় পাশে 2Na⁺ দর্শক আয়ন যোগ করে পাই:',
    fullBalanced: '2Na₂S₂O₃ + I₂ → Na₂S₄O₆ + 2NaI',
    stoichiometryRatio: '২ মোল Na₂S₂O₃ ≡ ১ মোল I₂'
  },
  {
    id: 'cu-conc-hno3',
    titleBn: '৫. কপার (Cu) ও গাঢ় নাইট্রিক এসিডের (HNO₃) জারণ-বিজারণ',
    reactants: 'Cu + HNO₃ (গাঢ়)',
    products: 'Cu(NO₃)₂ + NO₂ (বাদামি গ্যাস) + H₂O',
    oxidizingAgent: {
      formula: 'গাঢ় HNO₃ (নাইট্রেট আয়ন NO₃⁻)',
      stateChange: 'N⁺⁵ → N⁺⁴ (NO₂ গ্যাসে)',
      gainLoss: '১টি ইলেকট্রন গ্রহণ (বিজারণ)',
      role: 'জারক'
    },
    reducingAgent: {
      formula: 'Cu (ধাতব কপার, জারণ সংখ্যা ০)',
      stateChange: 'Cu⁰ → Cu⁺²',
      gainLoss: '২টি ইলেকট্রন বর্জন (জারণ)',
      role: 'বিজারক'
    },
    oxHalf: 'Cu → Cu²⁺ + 2e⁻  (জারণ অর্ধ-বিক্রিয়া)',
    redHalf: 'NO₃⁻ + 2H⁺ + e⁻ → NO₂ + H₂O  (বিজারণ অর্ধ-বিক্রিয়া)',
    multiplier: 'বিজারণ অর্ধ-বিক্রিয়াকে ২ দ্বারা গুণ করে জারণের সাথে যোগ করি:',
    netIonic: 'Cu + 2NO₃⁻ + 4H⁺ → Cu²⁺ + 2NO₂ + 2H₂O',
    spectators: 'উভয় পাশে ২টি নাইট্রেট দর্শক আয়ন (2NO₃⁻) যোগ করে পাই:',
    fullBalanced: 'Cu + 4HNO₃(গাঢ়) → Cu(NO₃)₂ + 2NO₂ + 2H₂O',
    stoichiometryRatio: '১ মোল Cu ≡ ৪ মোল গাঢ় HNO₃'
  }
];

export default function RedoxOxidationEngine() {
  const [engineTab, setEngineTab] = useState('compounds'); // 'compounds' | 'reactions' | 'rules'
  const [selectedCompoundIdx, setSelectedCompoundIdx] = useState(0);
  const [selectedReactionIdx, setSelectedReactionIdx] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const engineRef = useRef(null);

  const selectedCompound = COMPOUNDS_DATABASE[selectedCompoundIdx] || COMPOUNDS_DATABASE[0];
  const selectedReaction = REDOX_REACTIONS[selectedReactionIdx] || REDOX_REACTIONS[0];

  // Filter compounds based on query
  const filteredCompounds = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return COMPOUNDS_DATABASE;
    return COMPOUNDS_DATABASE.filter(c =>
      c.formula.toLowerCase().includes(q) ||
      c.nameBn.toLowerCase().includes(q) ||
      c.targetName.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  // Export card
  const handleExport = async () => {
    if (!engineRef.current) return;
    setIsExporting(true);
    try {
      await exportBrandedGraphic(engineRef.current, {
        fileName: `NextGen_Redox_Engine_${engineTab === 'compounds' ? selectedCompound.formula : selectedReaction.id}`,
        cardTitle: engineTab === 'compounds'
          ? `জারণ সংখ্যা বিশ্লেষণ: ${selectedCompound.nameBn}`
          : `জারণ-বিজারণ সমতাকরণ: ${selectedReaction.titleBn}`,
        scale: 2
      });
    } catch (err) {
      console.error('Export error:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Banner */}
      <div className="p-6 bg-gradient-to-r from-slate-900 via-rose-950/40 to-slate-900 border border-slate-800 rounded-3xl shadow-xl text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="p-3.5 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30 shadow-inner">
            <Flame className="w-9 h-9 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black text-white">জারণ-বিজারণ ও জারণ সংখ্যা ইঞ্জিন (Redox Engine)</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold font-mono">
                Oxidation State & Ion-Electron Lab ⚡
              </span>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              যৌগে পরমাণুর জারণ সংখ্যার স্টেপ-বাই-স্টেপ বীজগণিতিক নির্ণয়, জারক-বিজারক শনাক্তকরণ ও আয়ন-ইলেকট্রন পদ্ধতিতে পূর্ণ সমতাকরণ
            </p>
          </div>
        </div>

        {/* Tab Selector & Export */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 text-xs font-bold">
            <button
              type="button"
              onClick={() => setEngineTab('compounds')}
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                engineTab === 'compounds' ? 'bg-rose-600 text-white shadow-md font-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              <span>জারণ সংখ্যা নির্ণয়ক</span>
            </button>

            <button
              type="button"
              onClick={() => setEngineTab('reactions')}
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                engineTab === 'reactions' ? 'bg-amber-600 text-white shadow-md font-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>জারণ-বিজারণ সমতাকরণ</span>
            </button>

            <button
              type="button"
              onClick={() => setEngineTab('rules')}
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                engineTab === 'rules' ? 'bg-cyan-600 text-white shadow-md font-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>জারণ নিয়ম ও ব্যতিক্রম</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleExport}
            disabled={isExporting}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30 flex items-center gap-2 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
          >
            {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            <span>ডাউনলোড (HD)</span>
          </button>
        </div>
      </div>

      {/* Main Workspace Stage */}
      <div ref={engineRef} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
        {/* ========================================================================= */}
        {/* TAB 1: COMPOUND OXIDATION NUMBER SOLVER */}
        {/* ========================================================================= */}
        {engineTab === 'compounds' && (
          <div className="space-y-6">
            {/* Search & Compound Quick Select Bar */}
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-3">
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="যৌগের সংকেত বা নাম খুঁজুন (যেমন: KMnO4, H2O2)..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 text-xs font-bold scrollbar-none">
                {filteredCompounds.map((comp, idx) => {
                  const isSelected = COMPOUNDS_DATABASE[selectedCompoundIdx]?.formula === comp.formula;
                  return (
                    <button
                      key={comp.formula}
                      type="button"
                      onClick={() => {
                        const realIdx = COMPOUNDS_DATABASE.findIndex(c => c.formula === comp.formula);
                        setSelectedCompoundIdx(realIdx >= 0 ? realIdx : 0);
                      }}
                      className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all text-xs font-mono font-bold flex items-center gap-1.5 ${
                        isSelected ? 'bg-rose-600 text-white shadow-md scale-105' : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <span>{comp.formula}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-950/60 text-amber-300">
                        {comp.targetAtom}={comp.targetOx}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step-by-Step Algebraic Breakdown Presentation */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column (5 Cols): Molecular Formula Atom Badges & Overview */}
              <div className="lg:col-span-5 p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-5 flex flex-col justify-between shadow-inner">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-rose-400 uppercase tracking-wider">
                      নির্বাচিত যৌগ / আয়ন
                    </span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-slate-900 text-slate-400">
                      চার্জ: {selectedCompound.totalCharge === 0 ? 'নিরপেক্ষ (0)' : selectedCompound.totalCharge}
                    </span>
                  </div>

                  <h3 className="text-2xl font-black text-white mt-2 font-mono flex items-baseline gap-2">
                    {selectedCompound.formula}
                    <span className="text-sm font-sans font-normal text-slate-400 block truncate">
                      {selectedCompound.nameBn}
                    </span>
                  </h3>
                </div>

                {/* Target Atom Highlight Badge */}
                <div className="p-4 rounded-2xl bg-gradient-to-tr from-rose-950/50 via-slate-900 to-slate-950 border-2 border-rose-500/50 text-center shadow-lg">
                  <span className="text-xs font-bold text-rose-300 block uppercase tracking-wider">
                    {selectedCompound.targetName} এর জারণ সংখ্যা
                  </span>
                  <div className="text-4xl font-black text-amber-400 font-mono my-1 tracking-wider">
                    {selectedCompound.targetOx}
                  </div>
                  <span className="text-[11px] text-slate-400">
                    সর্বোচ্চ স্থিতিশীল জারণ অবস্থা
                  </span>
                </div>

                {/* Component Atoms Breakdown Grid */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                    যৌগের উপাদান পরমাণুসমূহের জারণ মান:
                  </span>
                  <div className="space-y-2 text-xs">
                    {selectedCompound.atoms.map((at, aIdx) => (
                      <div
                        key={aIdx}
                        className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                          at.isTarget
                            ? 'bg-rose-950/40 border-rose-500/60 shadow-sm'
                            : 'bg-slate-900 border-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-8 h-8 rounded-lg bg-slate-950 text-white font-mono font-black flex items-center justify-center border border-slate-700">
                            {at.sym}
                          </span>
                          <div>
                            <strong className="text-white block">{at.name}</strong>
                            <span className="text-[10px] text-slate-400 font-mono">পরমাণু সংখ্যা: {at.count}টি</span>
                          </div>
                        </div>
                        <span className={`font-mono font-black text-sm px-2.5 py-1 rounded-lg ${
                          at.isTarget ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-slate-800 text-cyan-300'
                        }`}>
                          {at.state}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column (7 Cols): Step-by-Step Mathematical Derivation */}
              <div className="lg:col-span-7 space-y-4">
                <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 space-y-3 shadow-inner">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Brain className="w-4 h-4 text-amber-400" />
                      ধাপে ধাপে গাণিতিক সমীকরণ সমাধান (Step-by-Step Solution)
                    </span>
                    <span className="text-[11px] font-bold text-slate-500">বোর্ড স্ট্যান্ডার্ড ফরম্যাট</span>
                  </div>

                  {/* Step List */}
                  <div className="space-y-2.5 pt-1">
                    {selectedCompound.steps.map((st, sIdx) => {
                      const isLast = sIdx === selectedCompound.steps.length - 1;
                      return (
                        <div
                          key={sIdx}
                          className={`p-3 rounded-2xl flex items-start gap-3 transition-all ${
                            isLast
                              ? 'bg-emerald-950/40 border-2 border-emerald-500/50 text-emerald-200 font-bold'
                              : 'bg-slate-900 border border-slate-800/80 text-slate-200'
                          }`}
                        >
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 mt-0.5 font-mono ${
                            isLast ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-rose-400'
                          }`}>
                            {sIdx + 1}
                          </span>
                          <span className="font-mono text-xs leading-relaxed">{st}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Important Keynote Card */}
                <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 text-xs text-cyan-100 flex items-start gap-3">
                  <Info className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-cyan-300 block font-black mb-0.5">গুরুত্বপূর্ণ রসায়ন নোট:</strong>
                    <p className="text-cyan-100/90 leading-relaxed text-[11px]">{selectedCompound.note}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: COMPLETE REDOX REACTION & ION-ELECTRON BALANCER */}
        {/* ========================================================================= */}
        {engineTab === 'reactions' && (
          <div className="space-y-6">
            {/* Reaction Selector Horizontal Bar */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {REDOX_REACTIONS.map((rx, idx) => (
                <button
                  key={rx.id}
                  type="button"
                  onClick={() => setSelectedReactionIdx(idx)}
                  className={`px-4 py-2.5 rounded-2xl whitespace-nowrap transition-all text-xs font-bold flex items-center gap-2 ${
                    selectedReactionIdx === idx
                      ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30 scale-105 font-black'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>{rx.titleBn}</span>
                </button>
              ))}
            </div>

            {/* Net Balanced Equation Hero */}
            <div className="p-6 rounded-3xl bg-slate-950 border-2 border-amber-500/40 text-center space-y-3 shadow-2xl">
              <span className="text-xs font-black text-amber-400 uppercase tracking-widest block">
                আয়ন-ইলেকট্রন পদ্ধতিতে সম্পূর্ণ সমতাকৃত আণবিক সমীকরণ (Full Balanced Equation)
              </span>
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 inline-block max-w-full overflow-x-auto">
                <span className="font-mono text-base sm:text-lg font-black text-cyan-300 tracking-wide">
                  {selectedReaction.fullBalanced}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                মোলার অনুপাত: <strong className="text-emerald-400 font-bold">{selectedReaction.stoichiometryRatio}</strong>
              </p>
            </div>

            {/* 2-Column Agent Identification: Oxidizing vs Reducing Agent */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Oxidizing Agent Card (জারক) */}
              <div className="p-5 rounded-3xl bg-slate-950 border-2 border-purple-500/50 space-y-3 shadow-inner">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-xs font-black text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-purple-400" />
                    জারক পদার্থ (Oxidizing Agent)
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-800 font-bold">
                    ইলেকট্রন গ্রহণকারী
                  </span>
                </div>

                <div className="space-y-2 text-xs font-mono">
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">জারক উপাদান:</span>
                    <strong className="text-white text-sm">{selectedReaction.oxidizingAgent.formula}</strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">জারণ মানের পরিবর্তন (Reduction):</span>
                    <strong className="text-purple-300 text-sm">{selectedReaction.oxidizingAgent.stateChange}</strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">ইলেকট্রন রূপান্তর:</span>
                    <strong className="text-emerald-300 text-xs">{selectedReaction.oxidizingAgent.gainLoss}</strong>
                  </div>
                </div>
              </div>

              {/* Reducing Agent Card (বিজারক) */}
              <div className="p-5 rounded-3xl bg-slate-950 border-2 border-cyan-500/50 space-y-3 shadow-inner">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-xs font-black text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-cyan-400" />
                    বিজারক পদার্থ (Reducing Agent)
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold">
                    ইলেকট্রন বর্জনকারী
                  </span>
                </div>

                <div className="space-y-2 text-xs font-mono">
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">বিজারক উপাদান:</span>
                    <strong className="text-white text-sm">{selectedReaction.reducingAgent.formula}</strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">জারণ মানের পরিবর্তন (Oxidation):</span>
                    <strong className="text-cyan-300 text-sm">{selectedReaction.reducingAgent.stateChange}</strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">ইলেকট্রন রূপান্তর:</span>
                    <strong className="text-amber-300 text-xs">{selectedReaction.reducingAgent.gainLoss}</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Step-by-Step Ion-Electron Half Reaction Steps */}
            <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 space-y-3 shadow-inner">
              <h4 className="font-black text-emerald-400 flex items-center gap-2 text-xs uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                আয়ন-ইলেকট্রন অর্ধ-বিক্রিয়ার ধাপে ধাপে সমতাকরণ প্রক্রিয়া
              </h4>

              <div className="space-y-2 text-xs font-mono">
                <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-rose-400 font-bold text-[10px] block">ধাপ ১: জারণ অর্ধ-বিক্রিয়া (Oxidation Half):</span>
                    <span className="text-white font-bold">{selectedReaction.oxHalf}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 text-[10px]">ইলেকট্রন ত্যাগ</span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-purple-400 font-bold text-[10px] block">ধাপ ২: বিজারণ অর্ধ-বিক্রিয়া (Reduction Half):</span>
                    <span className="text-white font-bold">{selectedReaction.redHalf}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 text-[10px]">ইলেকট্রন গ্রহণ</span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-900 border border-amber-500/30">
                  <span className="text-amber-400 font-bold text-[10px] block">ধাপ ৩: ইলেকট্রন সমতাকরণ গুণক:</span>
                  <span className="text-slate-300 text-[11px] font-sans">{selectedReaction.multiplier}</span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-900 border border-emerald-500/40">
                  <span className="text-emerald-400 font-bold text-[10px] block">ধাপ ৪: কঙ্কাল আয়নিক সমীকরণ (Net Ionic Equation):</span>
                  <span className="text-emerald-200 font-bold text-sm">{selectedReaction.netIonic}</span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-900 border border-cyan-500/40">
                  <span className="text-cyan-400 font-bold text-[10px] block">ধাপ ৫: দর্শক আয়ন সংযোজন (Full Molecular Equation):</span>
                  <span className="text-cyan-200 font-bold text-sm">{selectedReaction.fullBalanced}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: OXIDATION NUMBER RULES & EXCEPTIONS CHEATSHEET */}
        {/* ========================================================================= */}
        {engineTab === 'rules' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 space-y-3">
              <h4 className="font-black text-cyan-400 text-xs uppercase tracking-wider flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                মৌলিক নিয়মাবলী (Standard Rules)
              </h4>
              <ul className="space-y-2 text-slate-300 text-[11px] leading-relaxed">
                <li className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <strong className="text-white block">১. মুক্ত মৌলের জারণ সংখ্যা:</strong>
                  যেকোনো মুক্ত মৌলিক অবস্থায় (যেমন: H₂, O₂, Cl₂, Fe, Na, S₈) পরমাণুর জারণ সংখ্যা সর্বদা **০ (শূন্য)**।
                </li>
                <li className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <strong className="text-white block">২. গ্রুপ-১ ও গ্রুপ-২ ধাতু:</strong>
                  ক্ষার ধাতুর (Li, Na, K) জারণ সংখ্যা সর্বদা **+১** এবং মৃৎক্ষার ধাতুর (Mg, Ca, Ba) জারণ সংখ্যা সর্বদা **+২**।
                </li>
                <li className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <strong className="text-white block">৩. ফ্লোরিনের জারণ সংখ্যা:</strong>
                  ফ্লোরিন সর্বাধিক তড়িৎ-ঋণাত্মক হওয়ায় এর সকল যৌগে জারণ সংখ্যা সর্বদা **-১**।
                </li>
                <li className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <strong className="text-white block">৪. হাইড্রোজেন:</strong>
                  অধিকাংশ যৌগে H = **+১**, কিন্তু ধাতব হাইড্রাইডে (যেমন: NaH, CaH₂) H = **-১**।
                </li>
              </ul>
            </div>

            <div className="p-5 rounded-3xl bg-slate-950 border border-rose-500/40 space-y-3">
              <h4 className="font-black text-rose-400 text-xs uppercase tracking-wider flex items-center gap-2">
                <Flame className="w-4 h-4 text-rose-400" />
                অক্সিজেনের বিশেষ ব্যতিক্রমসমূহ (Crucial Exceptions)
              </h4>
              <ul className="space-y-2 text-slate-300 text-[11px] leading-relaxed">
                <li className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <strong className="text-white block">১. সাধারণ অক্সাইড (যেমন: H₂O, CO₂):</strong>
                  অক্সিজেনের সাধারণ জারণ সংখ্যা **-২**।
                </li>
                <li className="p-2.5 rounded-xl bg-slate-900 border border-rose-900/40">
                  <strong className="text-rose-300 block">২. পারঅক্সাইড (যেমন: H₂O₂, Na₂O₂):</strong>
                  পারঅক্সাইড লিঙ্কেজে (-O-O-) অক্সিজেনের জারণ সংখ্যা **-১**।
                </li>
                <li className="p-2.5 rounded-xl bg-slate-900 border border-amber-900/40">
                  <strong className="text-amber-300 block">৩. সুপারঅক্সাইড (যেমন: KO₂, RbO₂):</strong>
                  সুপারঅক্সাইডে অক্সিজেনের জারণ সংখ্যা **-১/২ (-0.5)**।
                </li>
                <li className="p-2.5 rounded-xl bg-slate-900 border border-cyan-900/40">
                  <strong className="text-cyan-300 block">৪. অক্সিজেন ডাইফ্লোরাইড (OF₂):</strong>
                  ফ্লোরিন বেশি তড়িৎ-ঋণাত্মক হওয়ায় এখানে অক্সিজেনের জারণ সংখ্যা **+২**।
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Footer Academy Branding */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <span>NextGen Academy • পরিচালক: মো: আলমগীর হোসেন (সাগর) • ০১৭৯২৮১৮০০৫</span>
          <span>পশ্চিম জয়দেবপুর, গাজীপুর • LEARN · GROW · SUCCEED</span>
        </div>
      </div>
    </div>
  );
}
