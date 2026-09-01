import React, { useState, useMemo, useEffect } from 'react';
import {
  Sparkles,
  BookOpen,
  Calculator,
  Atom,
  FlaskConical,
  Sigma,
  Plus,
  Trash2,
  Copy,
  Printer,
  Save,
  CheckCircle2,
  HelpCircle,
  Layers,
  FileText,
  Sliders,
  Flame,
  Search,
  RefreshCw,
  Eye,
  Check,
  Send,
  ArrowRight,
  Filter,
  Share2,
  ChevronDown
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { questionRepositoryAPI, examAPI } from '../../services/api';
import MathRenderer from '../common/MathRenderer';
import QuestionDiagram from '../common/QuestionDiagram';
import { DEFAULT_QUESTION_BANK } from '../../data/questionBankDefaultData';
import PhysicsChapter1MathProblemSolver from '../student/PhysicsChapter1MathProblemSolver';

// 1. Comprehensive Subject, Chapter & Topic Syllabus Data
export const SYLLABUS_DATABASE = {
  'GENERAL_MATH': {
    id: 'GENERAL_MATH',
    nameBn: 'সাধারণ গণিত',
    nameEn: 'General Mathematics',
    icon: Calculator,
    color: 'from-blue-600 to-indigo-600',
    badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    chapters: [
      {
        id: 'gm-ch-1',
        number: '১ম অধ্যায়',
        title: 'বাস্তব সংখ্যা (Real Numbers)',
        topics: ['মূলদ ও অমূলদ সংখ্যা প্রমাণ', 'পৌনঃপুনিক ও আবৃত্ত দশমিক', 'ভগ্নাংশের সরলীকরণ', 'বাস্তব সংখ্যার শ্রেণিবিভাগ']
      },
      {
        id: 'gm-ch-2',
        number: '২য় অধ্যায়',
        title: 'সেট ও ফাংশন (Set & Function)',
        topics: ['সেট গঠন ও তালিকা পদ্ধতি', 'উপসেট ও প্রকৃত উপসেট', 'ভেনচিত্র ও সেটের সংযোগ-ছেদ', 'কার্তেসীয় গুণজ সেট', 'ডোমেন ও রেঞ্জ নির্ণয়']
      },
      {
        id: 'gm-ch-3',
        number: '৩য় অধ্যায়',
        title: 'বীজগাণিতিক রাশি (Algebraic Expressions)',
        topics: ['বর্গের সূত্রাবলী ও মান নির্ণয়', 'ঘনের সূত্রাবলী ও মান নির্ণয়', 'উৎপাদকে বিশ্লেষণ (মধ্যপদ)', 'ভাগশেষ উপপাদ্য', 'বাস্তব সমস্যার সমীকরণ']
      },
      {
        id: 'gm-ch-4',
        number: '৪র্থ অধ্যায়',
        title: 'সূচক ও লগারিদম (Exponents & Logarithms)',
        topics: ['সূচকের নিয়মাবলী ও সরল', 'লগারিদমের ধর্মাবলী', 'সাধারণ লগারিদম ও বৈশিষ্ট্য', 'লগের মান নির্ণয় ও প্রমাণ']
      },
      {
        id: 'gm-ch-5',
        number: '৫ম অধ্যায়',
        title: 'এক চলকবিশিষ্ট সমীকরণ (Linear Equations in 1 Var)',
        topics: ['একঘাত সমীকরণ সমাধান', 'দ্বিঘাত সমীকরণের মূল', 'বাস্তবভিত্তিক গাণিতিক সমস্যা']
      },
      {
        id: 'gm-ch-6',
        number: '৬ষ্ঠ অধ্যায়',
        title: 'রেখা, কোণ ও ত্রিভুজ (Lines, Angles & Triangles)',
        topics: ['সমকোণী ত্রিভুজ সংক্রান্ত উপপাদ্য', 'ত্রিভুজের সর্বসমতা', 'সদৃশতা ও ক্ষেত্রফল অনুপাত']
      },
      {
        id: 'gm-ch-7',
        number: '৭ম অধ্যায়',
        title: 'ব্যবহারিক জ্যামিতি (Practical Geometry)',
        topics: ['ত্রিভুজ অঙ্কন (ভূমি ও উচ্চতা)', 'চতুর্ভুজ ও সামান্তরিক অঙ্কন', 'ট্রাপিজিয়াম অঙ্কন']
      },
      {
        id: 'gm-ch-8',
        number: '৮ম অধ্যায়',
        title: 'বৃত্ত (Circle)',
        topics: ['বৃত্তের জ্যা সংক্রান্ত উপপাদ্য', 'বৃত্তস্থ কোণ ও কেন্দ্রস্থ কোণ', 'বৃত্তস্থ চতুর্ভুজ', 'বৃত্তের স্পর্শক ও সাধারণ স্পর্শক']
      },
      {
        id: 'gm-ch-9',
        number: '৯ম অধ্যায়',
        title: 'ত্রিকোণমিতিক অনুপাত (Trigonometric Ratios)',
        topics: ['ত্রিকোণমিতিক অভেদাবলী প্রমাণ', 'নির্দিষ্ট কোণের অনুপাত (30°, 45°, 60°)', 'ত্রিকোণমিতিক মান নির্ণয় ও সরলীকরণ']
      },
      {
        id: 'gm-ch-10',
        number: '১০ম অধ্যায়',
        title: 'দূরত্ব ও উচ্চতা (Distance & Elevation)',
        topics: ['উন্নতি কোণ ও অবনতি কোণ', 'একক বিন্দুর উন্নতি কোণ সমস্যা', 'নদীর বিস্তার ও টাওয়ারের উচ্চতা']
      },
      {
        id: 'gm-ch-11',
        number: '১১শ অধ্যায়',
        title: 'বীজগাণিতিক অনুপাত ও সমানুপাত (Ratio & Proportion)',
        topics: ['অনুপাত রূপান্তর (যোজন-বিয়োজন)', 'ধারাবাহিক অনুপাত', 'বাস্তব সমস্যা সমাধান']
      },
      {
        id: 'gm-ch-12',
        number: '১২শ অধ্যায়',
        title: 'দুই চলকবিশিষ্ট সরল সহসমীকরণ (Simultaneous Equations)',
        topics: ['প্রতিস্থাপন পদ্ধতি', 'অপনয়ন পদ্ধতি', 'আরজগুণন পদ্ধতি', 'লেখচিত্রের সাহায্যে সমাধান']
      },
      {
        id: 'gm-ch-13',
        number: '১৩শ অধ্যায়',
        title: 'সসীম ধারা (Finite Series)',
        topics: ['সমান্তর ধারার n-তম পদ', 'সমান্তর ধারার সমষ্টি নির্ণয়', 'গুণোত্তর ধারার পদ ও সমষ্টি', 'ধারার সৃজনশীল সমস্যা']
      },
      {
        id: 'gm-ch-16',
        number: '১৬শ অধ্যায়',
        title: 'পরিমিতি (Mensuration)',
        topics: ['ত্রিভুজ ও চতুর্ভুজের ক্ষেত্রফল', 'বৃত্তের পরিধি ও বৃত্তাংশের ক্ষেত্রফল', 'আয়তাকার ঘনবস্তু ও বেলন (সিলিন্ডার)']
      },
      {
        id: 'gm-ch-17',
        number: '১৭শ অধ্যায়',
        title: 'পরিসংখ্যান (Statistics)',
        topics: ['শ্রেণি বিন্যাস ও ক্রমযোজিত গণসংখ্যা', 'সংক্ষিপ্ত পদ্ধতিতে গড় নির্ণয়', 'মধ্যক ও প্রচুরক নির্ণয়', 'আয়তলেখ ও অজিব রেখা']
      }
    ]
  },

  'HIGHER_MATH': {
    id: 'HIGHER_MATH',
    nameBn: 'উচ্চতর গণিত',
    nameEn: 'Higher Mathematics',
    icon: Sigma,
    color: 'from-purple-600 to-indigo-600',
    badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    chapters: [
      {
        id: 'hm-ch-1-1',
        number: 'অনুশীলনী ১.১',
        title: 'সেট (Set Theory & Proofs)',
        topics: ['সার্বিক সেট ও শক্তি সেট P(A)', 'পূরক সেট ও সেটের অন্তর A \\ B', 'ভেনচিত্র ও দ্য মরগানের সূত্র', 'সমতুল ও সসীম-অসীম সেট']
      },
      {
        id: 'hm-ch-1-2',
        number: 'অনুশীলনী ১.২',
        title: 'ফাংশন ও অন্বয় (Functions & Graphs)',
        topics: ['ফাংশনের ডোমেন ও রেঞ্জ নির্ণয়', 'এক-এক ও সার্বিক (Onto) ফাংশন', 'বিপরীত ফাংশন f⁻¹(x)', 'বৃত্তীয় ও অন্বয়ের লেখচিত্র']
      },
      {
        id: 'hm-ch-2',
        number: '২য় অধ্যায়',
        title: 'বীজগাণিতিক রাশি (Algebraic Expressions)',
        topics: ['সমমাত্রিক ও প্রতিসম বহুপদী', 'চক্রক্রমিক রাশি ও উৎপাদক', 'আংশিক ভগ্নাংশে প্রকাশ (Partial Fractions)']
      },
      {
        id: 'hm-ch-3',
        number: '৩য় অধ্যায়',
        title: 'জ্যামিতি (Advanced Geometry)',
        topics: ['অ্যাপোলোনিয়াসের উপপাদ্য ও মধ্যমা', 'টলেমির উপপাদ্য ও ব্রহ্মগুপ্তের সূত্র', 'লম্ব অভিক্ষেপ ও পিথাগোরাসের বিস্তৃতি']
      },
      {
        id: 'hm-ch-5',
        number: '৫ম অধ্যায়',
        title: 'সমীকরণ (Quadratic Equations)',
        topics: ['দ্বিঘাত সমীকরণের মূল ও নিশ্চায়ক', 'মূলের প্রকৃতি বিশ্লেষণ', 'দ্বিঘাত সমীকরণ গঠন']
      },
      {
        id: 'hm-ch-6',
        number: '৬ষ্ঠ অধ্যায়',
        title: 'অসমতা (Inequalities)',
        topics: ['এক চলকের একঘাত অসমতা', 'পরমমান সম্বলিত অসমতা |ax+b| ≤ c', 'সংখ্যারেখায় অসমতার সমাধান সেট']
      },
      {
        id: 'hm-ch-7',
        number: '৭ম অধ্যায়',
        title: 'অসীম ধারা (Infinite Geometric Series)',
        topics: ['অনন্ত গুণোত্তর ধারার সাধারণ পদ', 'অসীমতক সমষ্টি S_∞ = a/(1-r) শর্ত', 'পৌনঃপুনিক দশমিককে মূলদীয় ভগ্নাংশে প্রকাশ']
      },
      {
        id: 'hm-ch-8',
        number: '৮ম অধ্যায়',
        title: 'ত্রিকোণমিতি (Trigonometry & Radians)',
        topics: ['রেডিয়ান কোণ ও বৃত্তচাপ s = rθ', 'চতুর্ভাগে ত্রিকোণমিতিক চিহ্নের রূপান্তর', 'সংযুক্ত কোণের ত্রিকোণমিতিক মান']
      },
      {
        id: 'hm-ch-9',
        number: '৯ম অধ্যায়',
        title: 'সূচকীয় ও লগারিদমীয় ফাংশন (Exponential & Log)',
        topics: ['সূচকীয় সমীকরণ সমাধান', 'প্রাকৃতিক লগ (ln x) ও লগের ভিত্তি রূপান্তর', 'সূচকীয় ও লগ ফাংশনের ডোমেন-রেঞ্জ']
      },
      {
        id: 'hm-ch-10',
        number: '১০ম অধ্যায়',
        title: 'দ্বিপদী বিস্তার (Binomial Expansion)',
        topics: ['প্যাসকেলের ত্রিভুজ বিধি', 'দ্বিপদী উপপাদ্য ও পদসংখ্যা', 'সাধারণ পদ T_{r+1} ও মধ্যপদ নির্ণয়', 'x-বর্জিত বা ধ্রুবপদ নির্ণয়']
      },
      {
        id: 'hm-ch-11',
        number: '১১শ অধ্যায়',
        title: 'স্থানাঙ্ক জ্যামিতি (Coordinate Geometry)',
        topics: ['বিন্দুদ্বয়ের দূরত্ব ও ক্ষেত্রফল', 'সরলরেখার ঢাল m = (y₂-y₁)/(x₂-x₁)', 'সরলরেখার সমীকরণ y = mx+c', 'সমরেখ বিন্দু প্রমাণ']
      },
      {
        id: 'hm-ch-12',
        number: '১২শ অধ্যায়',
        title: 'সমতলীয় ভেক্টর (Planar Vectors)',
        topics: ['অবস্থান ভেক্টর ও একক ভেক্টর', 'ভেক্টর যোগের ত্রিভুজ ও সামান্তরিক বিধি', 'ভেক্টর পদ্ধতিতে জ্যামিতিক প্রমাণ']
      },
      {
        id: 'hm-ch-13',
        number: '১৩শ অধ্যায়',
        title: 'ঘন জ্যামিতি (Solid Geometry)',
        topics: ['আয়তাকার ঘনবস্তু ও গোলক', 'সুষম প্রিজম ও পিরামিড', 'কোণক ও সমগ্রতলের ক্ষেত্রফল']
      },
      {
        id: 'hm-ch-14',
        number: '১৪শ অধ্যায়',
        title: 'সম্ভাবনা (Probability)',
        topics: ['মৌলিক সম্ভাবনা P(A) = n(A)/n(S)', 'মুদ্রা ও ছক্কার নমুনা ক্ষেত্র', 'প্রবাবিলিটি ট্রি (Probability Tree)']
      }
    ]
  },

  'PHYSICS': {
    id: 'PHYSICS',
    nameBn: 'পদার্থবিজ্ঞান',
    nameEn: 'Physics',
    icon: Atom,
    color: 'from-sky-600 to-blue-600',
    badgeColor: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
    chapters: [
      {
        id: 'phy-ch-1',
        number: '১ম অধ্যায়',
        title: 'ভৌত রাশি ও পরিমাপ (Physical Quantities)',
        topics: ['মৌলিক ও লব্ধ রাশি', 'স্লাইড ক্যালিপার্স ও ভার্নিয়ার ধ্রুবক (VC)', 'স্ক্রু গজ ও পিচ-নূনাঙ্ক (LC)', 'পরিমাপের ত্রুটি ও মাত্রা সমীকরণ']
      },
      {
        id: 'phy-ch-2',
        number: '২য় অধ্যায়',
        title: 'গতি (Motion)',
        topics: ['স্কেলার ও ভেক্টর রাশি', 'দূরত্ব, সরণ, দ্রুতি ও বেগ', 'ত্বরণ ও মন্দন', 'গতির ৪টি সমীকরণ (v=u+at, s=ut+½at², v²=u²+2as)', 'পরন্ত বস্তুর সূত্র ও লেখচিত্র']
      },
      {
        id: 'phy-ch-3',
        number: '৩য় অধ্যায়',
        title: 'বল (Force)',
        topics: ['জড়তা ও নিউটনের ১ম সূত্র', 'ভরবেগ ও নিউটনের ২য় সূত্র (F=ma)', 'নিউটনের ৩য় সূত্র ও ক্রিয়াপ্রতিক্রিয়া', 'ভরবেগের নিত্যতা সূত্র', 'ঘর্ষণ বল ও ঘর্ষণ গুণাঙ্ক']
      },
      {
        id: 'phy-ch-4',
        number: '৪র্থ অধ্যায়',
        title: 'কাজ, ক্ষমতা ও শক্তি (Work, Power & Energy)',
        topics: ['কাজ (W = Fs cos θ)', 'গতিশক্তি (Ek = ½mv²) ও বিভবশক্তি (Ep = mgh)', 'শক্তির রূপান্তর ও সংরক্ষণশীলতা নীতি', 'ক্ষমতা (P = W/t) ও কর্মদক্ষতা (η)']
      },
      {
        id: 'phy-ch-5',
        number: '৫ম অধ্যায়',
        title: 'পদার্থের অবস্থা ও চাপ (States of Matter & Pressure)',
        topics: ['চাপ (P = F/A) ও ঘনত্ব (ρ = m/V)', 'তরলের অভ্যন্তরে চাপ (P = hρg)', 'প্যাসকেলের সূত্র ও বল বৃদ্ধিকরণ নীতি', 'আর্কিমিডিসের সূত্র ও প্লবতা', 'হুকের সূত্র ও স্থিতিস্থাপকতা']
      },
      {
        id: 'phy-ch-6',
        number: '৬ষ্ঠ অধ্যায়',
        title: 'বস্তুর উপর তাপের প্রভাব (Thermal Effects)',
        topics: ['তাপমাত্রা ও থার্মোমিটার স্কেল রূপান্তর', 'কঠিন পদার্থের প্রসারণ গুণাঙ্ক (α, β, γ)', 'তাপধারণ ক্ষমতা ও আপেক্ষিক তাপ (Q = msΔθ)', 'ক্যালরিমিতির মূলনীতি ও সুপ্ততাপ']
      },
      {
        id: 'phy-ch-7',
        number: '৭ম অধ্যায়',
        title: 'তরঙ্গ ও শব্দ (Waves & Sound)',
        topics: ['অনুপ্রস্থ ও অনুদৈর্ঘ্য তরঙ্গ', 'তরঙ্গদৈর্ঘ্য, কম্পাঙ্ক ও বেগ (v = fλ)', 'শব্দের বেগ ও প্রতিধ্বনি শোনার শর্ত (d ≥ 16.6m)', 'শব্দোত্তর ও শব্দেতর তরঙ্গের ব্যবহার']
      },
      {
        id: 'phy-ch-8',
        number: '৮ম অধ্যায়',
        title: 'আলোর প্রতিফলন (Reflection of Light)',
        topics: ['প্রতিফলনের সূত্রাবলী', 'অবতল ও উত্তল দর্পণ', 'দর্পণের সমীকরণ (1/u + 1/v = 1/f)', 'বিবর্ধন (m = -v/u) ও প্রতিবিম্ব গঠন']
      },
      {
        id: 'phy-ch-9',
        number: '৯ম অধ্যায়',
        title: 'আলোর প্রতিসরণ (Refraction of Light)',
        topics: ['প্রতিসরণের সূত্র ও স্নেলের নিয়ম (n = sin i / sin r)', 'ক্রান্তি কোণ ও পূর্ণ অভ্যন্তরীণ প্রতিফলন', 'লেন্সের সমীকরণ ও লেন্সের ক্ষমতা (P = 1/f)']
      },
      {
        id: 'phy-ch-10',
        number: '১০ম অধ্যায়',
        title: 'স্থির বিদ্যুৎ (Static Electricity)',
        topics: ['আধান ও চার্জিতকরণ', 'কুলম্বের সূত্র (F = kq₁q₂/r²)', 'তড়িৎ প্রাবল্য (E = F/q) ও তড়িৎ বিভব (V = W/q)']
      },
      {
        id: 'phy-ch-11',
        number: '১১শ অধ্যায়',
        title: 'চল বিদ্যুৎ (Current Electricity)',
        topics: ['ওহমের সূত্র (V = IR)', 'রোধের সমবায় (শ্রেণি ও সমান্তরাল)', 'আপেক্ষিক রোধ (R = ρL/A)', 'তড়িৎ ক্ষমতা ও বিদ্যুৎ বিল হিসাব (kWh)']
      },
      {
        id: 'phy-ch-12',
        number: '১২শ অধ্যায়',
        title: 'বিদ্যুতের চৌম্বক ক্রিয়া (Magnetic Effect of Current)',
        topics: ['তড়িৎচৌম্বক ও সলিনয়েড', 'তড়িৎচৌম্বকীয় আবেশ ও ফ্যারাডের সূত্র', 'স্টেপ-আপ ও স্টেপ-ডাউন ট্রান্সফরমার']
      }
    ]
  },

  'CHEMISTRY': {
    id: 'CHEMISTRY',
    nameBn: 'রসায়ন',
    nameEn: 'Chemistry',
    icon: FlaskConical,
    color: 'from-emerald-600 to-teal-600',
    badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    chapters: [
      {
        id: 'chem-ch-1',
        number: '১ম অধ্যায়',
        title: 'রসায়নের ধারণা (Concepts of Chemistry)',
        topics: ['রসায়নের পরিধি ও ক্ষেত্র', 'পরীক্ষাগার নিরাপত্তা ও সতর্কতা বিধি', 'হ্যাজার্ড সিম্বল ও ঝুঁকির মাত্রা']
      },
      {
        id: 'chem-ch-2',
        number: '২য় অধ্যায়',
        title: 'পদার্থের অবস্থা (States of Matter)',
        topics: ['কণার গতিতত্ত্ব ও অবস্থা পরিবর্তন', 'ব্যাপন ও নিঃসরণ (গ্রাহামের নিয়ম)', 'গলনাঙ্ক, স্ফুটনাঙ্ক ও শীতলীকরণ বক্ররেখা', 'ঊর্ধ্বপাতন ও পাতন প্রক্রিয়া']
      },
      {
        id: 'chem-ch-3',
        number: '৩য় অধ্যায়',
        title: 'পদার্থের গঠন (Structure of Matter)',
        topics: ['রাদারফোর্ড ও বোর পরমাণু মডেল', 'আইসোটোপ ও শতকরা প্রাচুর্যতা', 'শক্তিস্তর ও উপশক্তিস্তর (আউফবাউ নীতি)', 'ইলেকট্রন বিন্যাস ও ব্যতিক্রম']
      },
      {
        id: 'chem-ch-4',
        number: '৪র্থ অধ্যায়',
        title: 'পর্যায় সারণি (Periodic Table)',
        topics: ['পর্যায় ও গ্রুপ নির্ণয় পদ্ধতি', 'পর্যায়বৃত্ত ধর্ম (পারমাণবিক ব্যাসার্ধ, আয়নিকরণ শক্তি, ইলেকট্রন আসক্তি, তড়িৎ ঋণাত্মকতা)', 'মৌলের বিশেষ শ্রেণিবিভাগ (ক্ষার ধাতু, হ্যালোজেন, নিষ্ক্রিয় গ্যাস)']
      },
      {
        id: 'chem-ch-5',
        number: '৫ম অধ্যায়',
        title: 'রাসায়নিক বন্ধন (Chemical Bonding)',
        topics: ['যোজ্যতা ও যোজনী ইলেকট্রন', 'আয়নিক বন্ধন ও ল্যাটিস শক্তি', 'সমযোজী বন্ধন ও ডট-ক্রস গঠন', 'মুক্তজোড় ও বন্ধনজোড় ইলেকট্রন', 'ধাতব বন্ধন ও বিদ্যুৎ পরিবাহিতা']
      },
      {
        id: 'chem-ch-6',
        number: '৬ষ্ঠ অধ্যায়',
        title: 'মৌলের ধারণা ও রাসায়নিক গণনা (Mole & Chemical Calculations)',
        topics: ['মোল ও অ্যাভোগাড্রো সংখ্যা', 'মোলার দ্রবণ ও মোলারিটি (S = 1000W / MV)', 'শতকরা সংযুতি ও স্থূল/আণবিক সংকেত', 'লিমিটিং বিক্রিয়ক ও উৎপাদের শতকরা পরিমাণ']
      },
      {
        id: 'chem-ch-7',
        number: '৭ম অধ্যায়',
        title: 'রাসায়নিক বিক্রিয়া (Chemical Reactions)',
        topics: ['সংযোজন, বিয়োজন, প্রতিস্থাপন ও দহন', 'জারণ-বিজারণ ও জারণ সংখ্যা নির্ণয়', 'লা-শাতেলিয়ার নীতি (তাপ, চাপ ও ঘনমাত্রা)', 'বিক্রিয়ার গতিবেগ ও সাম্যাবস্থা']
      },
      {
        id: 'chem-ch-8',
        number: '৮ম অধ্যায়',
        title: 'রসায়ন ও শক্তি (Chemistry & Energy)',
        topics: ['তাপোৎপাদী ও তাপহারী বিক্রিয়া (ΔH)', 'বন্ধন শক্তি হিসাব (ΔH = বিক্রিয়ক বন্ধন - উৎপাদ বন্ধন)', 'ড্যানিয়েল কোষ ও গ্যালভানিক সেল', 'শুষ্ক কোষ (Leclanché Cell) ও তড়িৎ বিশ্লেষণ']
      },
      {
        id: 'chem-ch-9',
        number: '৯ম অধ্যায়',
        title: 'এসিড-ক্ষার সমতা (Acids & Bases Equilibrium)',
        topics: ['তীব্র ও মৃদু এসিড-ক্ষারক', 'pH স্কেল ও pH গণনা', 'প্রশমন বিক্রিয়া ও প্রশমন তাপ', 'এসিড বৃষ্টির কারণ ও প্রতিকার']
      },
      {
        id: 'chem-ch-11',
        number: '১১শ অধ্যায়',
        title: 'খনিজ সম্পদ: জীবাশ্ম ও জৈব রসায়ন (Fossil & Hydrocarbons)',
        topics: ['অ্যালকেন প্রস্তুতি ও ক্লোরিনেশন', 'অ্যালকিন ও ব্রোমিন দ্রবণ পরীক্ষা', 'অ্যালকোহল, অ্যালডিহাইড ও জৈব এসিড', 'পলিমারকরণ ও প্লাস্টিক প্রস্তুতি']
      },
      {
        id: 'chem-ch-12',
        number: '১২শ অধ্যায়',
        title: 'আমাদের জীবনে রসায়ন (Chemistry in Daily Life)',
        topics: ['বেকিং সোডা ও ভিনেগারের ব্যবহার', 'ব্লিচিং পাউডার প্রস্তুতি ও জীবাণুনাশক ক্রিয়া', 'সাবান ও ডিটারজেন্টের ময়লা পরিষ্কারের কৌশল']
      }
    ]
  }
};

// 2. Intelligent Topic-Specific Question Generation Template Engine
export function generateTopicQuestionsTemplate(subjectKey, chapterTitle, topicName, questionType = 'MCQ', count = 5, difficulty = 'MEDIUM') {
  const generated = [];

  const questionBankPool = {
    'GENERAL_MATH': [
      {
        stem: `${topicName} সংক্রান্ত সমস্যা: যদি \\( x + \\frac{1}{x} = 3 \\) হয়, তবে \\( x^2 + \\frac{1}{x^2} \\) এর মান কত?`,
        options: ['ক) 7', 'খ) 9', 'গ) 11', 'ঘ) 6'],
        answer: 0,
        explanation: '\\( x^2 + \\frac{1}{x^2} = (x + \\frac{1}{x})^2 - 2(x)(\\frac{1}{x}) = 3^2 - 2 = 9 - 2 = 7 \\)।'
      },
      {
        stem: `${topicName} অনুযায়ী: \\( \\log_2 64 \\) এর মান কোনটি?`,
        options: ['ক) 4', 'খ) 6', 'গ) 8', 'ঘ) 32'],
        answer: 1,
        explanation: '\\( 64 = 2^6 \\implies \\log_2 2^6 = 6 \\log_2 2 = 6 \\)।'
      },
      {
        stem: `${topicName}: একটি সমান্তর ধারার ১ম পদ 3 এবং সাধারণ অন্তর 4 হলে, ধারাটির 10-তম পদ কত?`,
        options: ['ক) 39', 'খ) 43', 'গ) 36', 'ঘ) 40'],
        answer: 0,
        explanation: '\\( a_n = a + (n-1)d \\implies a_{10} = 3 + (10-1)\\times 4 = 3 + 36 = 39 \\)।'
      },
      {
        stem: `${topicName}: \\( \\sin \\theta = \\frac{1}{2} \\) হলে, \\( \\tan \\theta \\) এর মান কত? (যেখানে \\( 0^\\circ < \\theta < 90^\\circ \\))`,
        options: ['ক) \\( \\frac{1}{\\sqrt{3}} \\)', 'খ) \\( \\sqrt{3} \\)', 'গ) 1', 'ঘ) \\( \\frac{\\sqrt{3}}{2} \\)'],
        answer: 0,
        explanation: '\\( \\theta = 30^\\circ \\implies \\tan 30^\\circ = \\frac{1}{\\sqrt{3}} \\)।'
      },
      {
        stem: `${topicName} সম্পর্কিত: বৃত্তের ব্যাসার্ধ 7 সেমি হলে এর ক্ষেত্রফল কত বর্গ সেমি? (\\( \\pi = \\frac{22}{7} \\))`,
        options: ['ক) 154', 'খ) 44', 'গ) 308', 'ঘ) 77'],
        answer: 0,
        explanation: '\\( A = \\pi r^2 = \\frac{22}{7} \\times 7^2 = 22 \\times 7 = 154 \\) বর্গ সেমি।'
      }
    ],
    'HIGHER_MATH': [
      {
        stem: `${topicName}: \\( f(x) = \\sqrt{2x - 6} \\) ফাংশনটির ডোমেন কত?`,
        options: ['ক) \\( [3, \\infty) \\)', 'খ) \\( (3, \\infty) \\)', 'গ) \\( [0, \\infty) \\)', 'ঘ) \\( \\mathbb{R} \\)'],
        answer: 0,
        explanation: 'বাস্তব মানের জন্য \\( 2x - 6 \\ge 0 \\implies 2x \\ge 6 \\implies x \\ge 3 \\)। ∴ ডোমেন = \\( [3, \\infty) \\)।'
      },
      {
        stem: `${topicName}: \\( (2x - \\frac{1}{x})^6 \\) এর বিস্তৃতিতে x-বর্জিত বা ধ্রুবপদ কোনটি?`,
        options: ['ক) -160', 'খ) 160', 'গ) 20', 'ঘ) -20'],
        answer: 0,
        explanation: 'সাধারণ পদ \\( T_{r+1} = \\binom{6}{r}(2x)^{6-r}(-\\frac{1}{x})^r = \\binom{6}{r}2^{6-r}(-1)^r x^{6-2r} \\)। x-বর্জিত পদের জন্য \\( 6-2r = 0 \\implies r=3 \\)। \\( T_4 = \\binom{6}{3}2^3(-1)^3 = 20 \\times 8 \\times (-1) = -160 \\)।'
      },
      {
        stem: `${topicName}: অসীম গুণোত্তর ধারা \\( 1 + \\frac{1}{3} + \\frac{1}{9} + \\dots \\) এর অসীমতক সমষ্টি \\( S_\\infty \\) কত?`,
        options: ['ক) \\( \\frac{3}{2} \\)', 'খ) \\( \\frac{2}{3} \\)', 'গ) 3', 'ঘ) 2'],
        answer: 0,
        explanation: '\\( a = 1, r = \\frac{1}{3} < 1 \\implies S_\\infty = \\frac{a}{1 - r} = \\frac{1}{1 - 1/3} = \\frac{3}{2} \\)।'
      },
      {
        stem: `${topicName}: \\( (2, 3) \\) এবং \\( (4, 7) \\) বিন্দুগামী সরলরেখার ঢাল (Slope) কত?`,
        options: ['ক) 2', 'খ) \\( \\frac{1}{2} \\)', 'গ) 4', 'ঘ) -2'],
        answer: 0,
        explanation: '\\( m = \\frac{y_2 - y_1}{x_2 - x_1} = \\frac{7 - 3}{4 - 2} = \\frac{4}{2} = 2 \\)।'
      },
      {
        stem: `${topicName}: একটি মুদ্রা ও একটি ছক্কা একসাথে নিক্ষেপ করলে মুদ্রায় হেড (H) এবং ছক্কায় বিজোড় সংখ্যা আসার সম্ভাবনা কত?`,
        options: ['ক) \\( \\frac{1}{4} \\)', 'খ) \\( \\frac{1}{2} \\)', 'গ) \\( \\frac{1}{6} \\)', 'ঘ) \\( \\frac{1}{12} \\)'],
        answer: 0,
        explanation: '\\( P(H) = \\frac{1}{2}, P(\\text{বিজোড়}) = \\frac{3}{6} = \\frac{1}{2} \\implies P(H \\cap \\text{বিজোড়}) = \\frac{1}{2} \\times \\frac{1}{2} = \\frac{1}{4} \\)।'
      }
    ],
    'PHYSICS': [
      {
        stem: `${topicName}: একটি গাড়ি স্থির অবস্থান থেকে \\( 2\\text{ m/s}^2 \\) সুষম ত্বরণে চলা শুরু করলে 5 সেকেন্ড পর এর বেগ কত হবে?`,
        options: ['ক) 10 m/s', 'খ) 25 m/s', 'গ) 5 m/s', 'ঘ) 20 m/s'],
        answer: 0,
        explanation: '\\( v = u + at = 0 + (2)(5) = 10\\text{ m/s} \\)।'
      },
      {
        stem: `${topicName}: 10 kg ভরের একটি বস্তুকে ভূ-পৃষ্ঠ হতে 20 মিটার উঁচুতে তুললে এর বিভবশক্তি কত জুল হবে? (\\( g = 9.8\\text{ m/s}^2 \\))`,
        options: ['ক) 1960 J', 'খ) 200 J', 'গ) 980 J', 'ঘ) 196 J'],
        answer: 0,
        explanation: '\\( E_p = mgh = 10 \\times 9.8 \\times 20 = 1960\\text{ J} \\)।'
      },
      {
        stem: `${topicName}: বাতাসে শব্দের বেগ 340 m/s এবং কম্পাঙ্ক 170 Hz হলে, তরঙ্গদৈর্ঘ্য (\\( \\lambda \\)) কত?`,
        options: ['ক) 2 m', 'খ) 0.5 m', 'গ) 57800 m', 'ঘ) 4 m'],
        answer: 0,
        explanation: '\\( v = f\\lambda \\implies \\lambda = \\frac{v}{f} = \\frac{340}{170} = 2\\text{ m} \\)।'
      },
      {
        stem: `${topicName}: একটি অবতল দর্পণের বক্রতার ব্যাসার্ধ 40 সেমি হলে এর ফোকাস দূরত্ব কত?`,
        options: ['ক) 20 cm', 'খ) 40 cm', 'গ) 80 cm', 'ঘ) 10 cm'],
        answer: 0,
        explanation: '\\( f = \\frac{r}{2} = \\frac{40}{2} = 20\\text{ cm} \\)।'
      },
      {
        stem: `${topicName}: \\( 4\\,\\Omega \\) এবং \\( 6\\,\\Omega \\) মানের দুটি রোধ সমান্তরাল সমবায়ে যুক্ত করলে তুল্যরোধ কত হবে?`,
        options: ['ক) 2.4 Ω', 'খ) 10 Ω', 'গ) 2 Ω', 'ঘ) 1.5 Ω'],
        answer: 0,
        explanation: '\\( \\frac{1}{R_p} = \\frac{1}{4} + \\frac{1}{6} = \\frac{5}{12} \\implies R_p = \\frac{12}{5} = 2.4\\,\\Omega \\)।'
      }
    ],
    'CHEMISTRY': [
      {
        stem: `${topicName}: নিচের কোনটিতে সমযোজী বন্ধন ও দ্বিবন্ধন বিদ্যমান?`,
        options: ['ক) \\( \\text{O}_2 \\)', 'খ) \\( \\text{N}_2 \\)', 'গ) \\( \\text{CH}_4 \\)', 'ঘ) \\( \\text{NaCl} \\)'],
        answer: 0,
        explanation: 'অক্সিজেন অণুতে (\\( \\text{O}=\\text{O} \\)) দুটি অক্সিজেন পরমাণুর মধ্যে ৪টি ইলেকট্রন শেয়ারের মাধ্যমে সমযোজী দ্বিবন্ধন গঠিত হয়।'
      },
      {
        stem: `${topicName}: প্রমাণ তাপমাত্রা ও চাপে (STP) 44 গ্রাম \\( \\text{CO}_2 \\) গ্যাসের আয়তন কত লিটার?`,
        options: ['ক) 22.4 L', 'খ) 44.8 L', 'গ) 11.2 L', 'ঘ) 24.789 L'],
        answer: 0,
        explanation: '\\( \\text{CO}_2 \\) এর মোলার ভর = 44 g/mol। 1 মোল যেকোনো গ্যাসের STP তে মোলার আয়তন = 22.4 L।'
      },
      {
        stem: `${topicName}: \\( \\text{H}_2\\text{SO}_4 \\) যৌগে সালফারের (S) জারণ সংখ্যা কত?`,
        options: ['ক) +6', 'খ) +4', 'গ) -2', 'ঘ) +2'],
        answer: 0,
        explanation: '\\( (+1)\\times 2 + x + (-2)\\times 4 = 0 \\implies 2 + x - 8 = 0 \\implies x = +6 \\)।'
      },
      {
        stem: `${topicName}: পর্যায় সারণিতে পারমাণবিক ব্যাসার্ধের সঠিক ক্রম কোনটি?`,
        options: ['ক) \\( \\text{Na} > \\text{Mg} > \\text{Al} \\)', 'খ) \\( \\text{Al} > \\text{Mg} > \\text{Na} \\)', 'গ) \\( \\text{F} > \\text{Cl} > \\text{Br} \\)', 'ঘ) \\( \\text{Li} < \\text{Be} < \\text{B} \\)'],
        answer: 0,
        explanation: 'একই পর্যায়ে বাম থেকে ডানে গেলে নিউক্লিয়ার চার্জ বৃদ্ধি পাওয়ায় পরমাণুর আকার বা ব্যাসার্ধ হ্রাস পায়।'
      },
      {
        stem: `${topicName}: একটি দ্রবণের হাইড্রোজেন আয়নের ঘনমাত্রা \\( [\\text{H}^+] = 10^{-4}\\text{ M} \\) হলে দ্রবণটির pH কত?`,
        options: ['ক) 4', 'খ) 10', 'গ) 7', 'ঘ) 14'],
        answer: 0,
        explanation: '\\( \\text{pH} = -\\log_{10}[\\text{H}^+] = -\\log_{10}(10^{-4}) = 4 \\)। দ্রবণটি অম্লীয়।'
      }
    ]
  };

  const pool = questionBankPool[subjectKey] || questionBankPool['GENERAL_MATH'];

  for (let i = 0; i < count; i++) {
    const base = pool[i % pool.length];
    const qId = `gen-${subjectKey.toLowerCase()}-${Date.now()}-${i + 1}`;
    
    if (questionType === 'CQ') {
      generated.push({
        id: qId,
        M_ID: qId,
        type: 'CQ',
        subject: SYLLABUS_DATABASE[subjectKey]?.nameBn || 'সাধারণ গণিত',
        book: SYLLABUS_DATABASE[subjectKey]?.nameBn || 'সাধারণ গণিত',
        chapter: chapterTitle,
        topic: topicName,
        difficulty: difficulty,
        marks: 10,
        badge: `[${SYLLABUS_DATABASE[subjectKey]?.nameBn}] ${chapterTitle}`,
        stem: `উদ্দীপক: ${topicName} সম্পর্কিত একটি ব্যবহারিক মডেল বিবেচনা করো যেখানে প্রাথমিক ইনপুট এবং রূপান্তর সম্পর্কিত গাণিতিক সম্পর্ক বিদ্যমান।`,
        subQuestions: {
          a: { q: `${topicName} এর সংজ্ঞা দাও।`, marks: 1 },
          b: { q: `প্রদত্ত ধারণার মূল বৈশিষ্ট্যসমূহ ব্যাখ্যা করো।`, marks: 2 },
          c: { q: `উদ্দীপকের আলোকে সংশ্লিষ্ট রাশিটির সাংখ্যিক মান নির্ণয় করো।`, marks: 3 },
          d: { q: `শর্ত পরিবর্তন হলে ফলাফল কীভাবে পরিবর্তিত হবে তা গাণিতিকভাবে বিশ্লেষণ করো।`, marks: 4 }
        }
      });
    } else if (questionType === 'SQ') {
      generated.push({
        id: qId,
        M_ID: qId,
        type: 'SQ',
        subject: SYLLABUS_DATABASE[subjectKey]?.nameBn || 'সাধারণ গণিত',
        book: SYLLABUS_DATABASE[subjectKey]?.nameBn || 'সাধারণ গণিত',
        chapter: chapterTitle,
        topic: topicName,
        difficulty: difficulty,
        marks: 2,
        badge: `[${SYLLABUS_DATABASE[subjectKey]?.nameBn}] ${chapterTitle}`,
        question: `${topicName}: ${base.stem}`,
        shortAnswer: base.explanation,
        explanation: base.explanation
      });
    } else {
      // Default MCQ
      generated.push({
        id: qId,
        M_ID: qId,
        type: 'MCQ',
        subject: SYLLABUS_DATABASE[subjectKey]?.nameBn || 'সাধারণ গণিত',
        book: SYLLABUS_DATABASE[subjectKey]?.nameBn || 'সাধারণ গণিত',
        chapter: chapterTitle,
        topic: topicName,
        difficulty: difficulty,
        marks: 1,
        badge: `[${SYLLABUS_DATABASE[subjectKey]?.nameBn}] ${chapterTitle}`,
        question: base.stem,
        options: base.options,
        correctAnswer: base.answer,
        explanation: base.explanation
      });
    }
  }

  return generated;
}

export default function ChapterTopicQuestionGenerator() {
  const { lang } = useLanguage();

  // 1. Topic Selection State
  const [selectedSubjectKey, setSelectedSubjectKey] = useState('HIGHER_MATH');
  const [selectedChapterId, setSelectedChapterId] = useState('hm-ch-1-1');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [activeEngineView, setActiveEngineView] = useState('GENERATOR'); // 'GENERATOR' | 'CONCEPT_SOLVER'

  // 2. Generation & Filter Configuration
  const [genQuestionType, setGenQuestionType] = useState('MCQ'); // 'MCQ' | 'CQ' | 'SQ'
  const [genCount, setGenCount] = useState(5);
  const [genDifficulty, setGenDifficulty] = useState('MEDIUM'); // 'EASY' | 'MEDIUM' | 'HARD'
  const [isGenerating, setIsGenerating] = useState(false);

  // 3. Generated & Active Questions Bank
  const [topicQuestions, setTopicQuestions] = useState([]);
  const [selectedPaperQuestions, setSelectedPaperQuestions] = useState([]);

  // 4. Custom Manual Creator Modal/Form State
  const [showManualForm, setShowManualForm] = useState(false);
  const [manualStem, setManualStem] = useState('');
  const [manualOptA, setManualOptA] = useState('');
  const [manualOptB, setManualOptB] = useState('');
  const [manualOptC, setManualOptC] = useState('');
  const [manualOptD, setManualOptD] = useState('');
  const [manualAnswer, setManualAnswer] = useState(0);
  const [manualExplanation, setManualExplanation] = useState('');

  // 5. Paper Builder Config
  const [examTitle, setExamTitle] = useState('NextGen Academy - অধ্যায়ভিত্তিক মডেল টেস্ট');
  const [instituteName, setInstituteName] = useState('NextGen Academy');
  const [examDuration, setExamDuration] = useState(30);

  // Active Subject & Chapters
  const activeSubject = SYLLABUS_DATABASE[selectedSubjectKey] || SYLLABUS_DATABASE['HIGHER_MATH'];
  const activeChapter = useMemo(() => {
    return activeSubject.chapters.find(c => c.id === selectedChapterId) || activeSubject.chapters[0];
  }, [activeSubject, selectedChapterId]);

  // Set default topic on chapter change
  useEffect(() => {
    if (activeChapter?.topics?.length > 0) {
      setSelectedTopic(activeChapter.topics[0]);
    }
  }, [activeChapter]);

  // Filter states for Year and Board
  const [selectedYearFilter, setSelectedYearFilter] = useState('সকল সাল');
  const [selectedBoardFilter, setSelectedBoardFilter] = useState('সকল বোর্ড');

  // Load existing questions matching chapter from Vault
  useEffect(() => {
    handleGenerateQuestions(true);
  }, [selectedSubjectKey, selectedChapterId, genQuestionType, selectedYearFilter, selectedBoardFilter]);

  // Generation Action
  const handleGenerateQuestions = (isInitial = false) => {
    setIsGenerating(true);
    setTimeout(() => {
      // 1. First, check if vault has questions matching this chapter
      let vaultMatches = [];
      if (selectedSubjectKey === 'HIGHER_MATH') {
        const chNum = String(activeChapter?.number || '').toLowerCase();
        const chTitle = String(activeChapter?.title || '').toLowerCase();

        vaultMatches = (DEFAULT_QUESTION_BANK || []).filter(q => {
          const isHigherMath = q.tags?.some(t => String(t).includes('উচ্চতর গণিত')) || String(q.book || '').includes('উচ্চতর');
          if (!isHigherMath) return false;

          const matchesType = !genQuestionType || q.questionType === genQuestionType;
          if (!matchesType) return false;

          // Year Filter
          if (selectedYearFilter && selectedYearFilter !== 'সকল সাল') {
            const qYear = String(q.year || '');
            const targetY = String(selectedYearFilter).replace(/[^০-৯0-9]/g, '');
            if (!qYear.includes(targetY) && !qYear.includes(selectedYearFilter)) return false;
          }

          // Board Filter
          if (selectedBoardFilter && selectedBoardFilter !== 'সকল বোর্ড') {
            const bKey = selectedBoardFilter.replace(' বোর্ড', '').trim().toLowerCase();
            const qB = String(q.board || q.institutionOrBoard || '').toLowerCase();
            if (!qB.includes(bKey)) return false;
          }

          // Chapter Filter
          const qChapter = String(q.chapter || '').toLowerCase();
          const qText = String(q.questionText || '').toLowerCase();

          if (chNum.includes('১') || chTitle.includes('সেট') || chTitle.includes('ফাংশন')) {
            return qChapter.includes('১') || qChapter.includes('সেট') || qChapter.includes('ফাংশন') || qText.includes('ডোমেন') || qText.includes('ফাংশন');
          }
          if (chNum.includes('২') || chTitle.includes('বীজগাণিতিক')) {
            return qChapter.includes('২') || qChapter.includes('বীজগাণিতিক') || qChapter.includes('বহুপদী') || qText.includes('উৎপাদক') || qText.includes('আংশিক ভগ্নাংশ');
          }
          if (chNum.includes('৩') || chTitle.includes('জ্যামিতি')) {
            return qChapter.includes('৩') || qChapter.includes('জ্যামিতি') || qText.includes('অ্যাপোলোনিয়াস') || qText.includes('টলেমি') || qText.includes('মধ্যমা');
          }
          if (chNum.includes('৭') || chTitle.includes('ধারা')) {
            return qChapter.includes('৭') || qChapter.includes('ধারা') || qText.includes('গুণোত্তর ধারা') || qText.includes('অসীমতক');
          }
          if (chNum.includes('৮') || chTitle.includes('ত্রিকোণমিতি')) {
            return qChapter.includes('৮') || qChapter.includes('ত্রিকোণমিতি') || qText.includes('sin') || qText.includes('cos') || qText.includes('tan') || qText.includes('রেডিয়ান');
          }
          if (chNum.includes('৯') || chTitle.includes('সূচক')) {
            return qChapter.includes('৯') || qChapter.includes('সূচক') || qChapter.includes('লগারিদম') || qText.includes('log') || qText.includes('ln');
          }
          if (chNum.includes('১০') || chTitle.includes('দ্বিপদী')) {
            return qChapter.includes('১০') || qChapter.includes('দ্বিপদী') || qText.includes('বিস্তৃতি') || qText.includes('প্যাসকেল');
          }
          if (chNum.includes('১১') || chTitle.includes('স্থানাঙ্ক')) {
            return qChapter.includes('১১') || qChapter.includes('স্থানাঙ্ক') || qText.includes('ঢাল') || qText.includes('সরলরেখা') || qText.includes('ক্ষেত্রফল');
          }
          if (chNum.includes('১২') || chTitle.includes('ভেক্টর')) {
            return qChapter.includes('১২') || qChapter.includes('ভেক্টর') || qText.includes('ভেক্টর');
          }
          if (chNum.includes('১৩') || chTitle.includes('ঘন')) {
            return qChapter.includes('১৩') || qChapter.includes('ঘন') || qText.includes('সিলিন্ডার') || qText.includes('গোলক') || qText.includes('কোণক');
          }
          if (chNum.includes('১৪') || chTitle.includes('সম্ভাবনা')) {
            return qChapter.includes('১৪') || qChapter.includes('সম্ভাবনা') || qText.includes('সম্ভাবনা') || qText.includes('ছক্কা') || qText.includes('মুদ্রা');
          }

          return true;
        }).map(q => ({
          id: `vault-${q.id}`,
          M_ID: `vault-${q.id}`,
          type: q.questionType || 'MCQ',
          subject: 'উচ্চতর গণিত',
          book: 'উচ্চতর গণিত',
          chapter: q.chapter,
          section: q.section,
          topic: q.topic || selectedTopic || activeChapter.topics[0],
          difficulty: q.difficulty || 'MEDIUM',
          marks: q.marks || (q.questionType === 'CQ' ? 10 : q.questionType === 'SQ' ? 2 : 1),
          badge: q.badge || (q.board ? `[${q.board}]` : '[বোর্ড প্রশ্ন]'),
          question: q.questionText,
          stem: q.questionText,
          shortAnswer: q.shortAnswer || q.answerText || '',
          diagramType: q.diagramType || null,
          creativeSubQuestions: q.creativeSubQuestions,
          options: q.options || [],
          correctAnswer: q.answer === 'A' ? 0 : q.answer === 'B' ? 1 : q.answer === 'C' ? 2 : q.answer === 'D' ? 3 : 0,
          explanation: q.explanation || ''
        }));
      } else if (selectedSubjectKey === 'GENERAL_MATH') {
        vaultMatches = (DEFAULT_QUESTION_BANK || []).filter(q => 
          q.tags?.includes('সাধারণ গণিত') && (!genQuestionType || q.questionType === genQuestionType)
        ).map(q => ({
          id: `vault-${q.id}`,
          M_ID: `vault-${q.id}`,
          type: q.questionType || 'MCQ',
          subject: 'সাধারণ গণিত',
          book: 'সাধারণ গণিত',
          chapter: q.chapter,
          topic: q.topic || selectedTopic || activeChapter.topics[0],
          difficulty: q.difficulty || 'MEDIUM',
          marks: q.marks || (q.questionType === 'CQ' ? 10 : 1),
          badge: `[সাধারণ গণিত] ${q.board || ''} ${q.year || ''}`.trim(),
          question: q.questionText,
          stem: q.questionText,
          creativeSubQuestions: q.creativeSubQuestions,
          options: q.options || [],
          correctAnswer: q.answer === 'A' ? 0 : q.answer === 'B' ? 1 : q.answer === 'C' ? 2 : q.answer === 'D' ? 3 : 0,
          explanation: q.explanation || ''
        }));
      } else if (selectedSubjectKey === 'PHYSICS') {
        vaultMatches = (DEFAULT_QUESTION_BANK || []).filter(q => 
          q.tags?.includes('পদার্থবিজ্ঞান')
        ).map(q => ({
          id: `vault-${q.id}`,
          M_ID: `vault-${q.id}`,
          type: q.questionType || 'MCQ',
          subject: 'পদার্থবিজ্ঞান',
          book: 'পদার্থবিজ্ঞান',
          chapter: q.chapter,
          topic: q.topic || selectedTopic || activeChapter.topics[0],
          difficulty: q.difficulty || 'MEDIUM',
          marks: q.marks || 1,
          badge: `[পদার্থবিজ্ঞান] ${q.board || ''} ${q.year || ''}`.trim(),
          question: q.questionText,
          options: q.options || [],
          correctAnswer: q.answer === 'A' ? 0 : q.answer === 'B' ? 1 : q.answer === 'C' ? 2 : q.answer === 'D' ? 3 : 0,
          explanation: q.explanation || ''
        }));
      } else if (selectedSubjectKey === 'CHEMISTRY') {
        vaultMatches = (DEFAULT_QUESTION_BANK || []).filter(q => 
          q.tags?.includes('রসায়ন')
        ).map(q => ({
          id: `vault-${q.id}`,
          M_ID: `vault-${q.id}`,
          type: q.questionType || 'MCQ',
          subject: 'রসায়ন',
          book: 'রসায়ন',
          chapter: q.chapter,
          topic: q.topic || selectedTopic || activeChapter.topics[0],
          difficulty: q.difficulty || 'MEDIUM',
          marks: q.marks || 1,
          badge: `[রসায়ন] ${q.board || ''} ${q.year || ''}`.trim(),
          question: q.questionText,
          options: q.options || [],
          correctAnswer: q.answer === 'A' ? 0 : q.answer === 'B' ? 1 : q.answer === 'C' ? 2 : q.answer === 'D' ? 3 : 0,
          explanation: q.explanation || ''
        }));
      }

      // 2. Generate new smart topic questions template
      const generated = generateTopicQuestionsTemplate(
        selectedSubjectKey,
        `${activeChapter.number}: ${activeChapter.title}`,
        selectedTopic || activeChapter.topics[0],
        genQuestionType,
        Number(genCount) || 5,
        genDifficulty
      );

      const merged = [...vaultMatches, ...generated];
      setTopicQuestions(merged);
      setIsGenerating(false);
    }, isInitial ? 100 : 400);
  };

  // Add question to Exam Paper Cart
  const toggleSelectQuestion = (q) => {
    const qId = q.id || q.M_ID;
    const exists = selectedPaperQuestions.some(item => (item.id || item.M_ID) === qId);
    if (exists) {
      setSelectedPaperQuestions(prev => prev.filter(item => (item.id || item.M_ID) !== qId));
    } else {
      setSelectedPaperQuestions(prev => [...prev, q]);
    }
  };

  // Add all to Paper
  const handleSelectAll = () => {
    const newItems = topicQuestions.filter(q => {
      const qId = q.id || q.M_ID;
      return !selectedPaperQuestions.some(sq => (sq.id || sq.M_ID) === qId);
    });
    setSelectedPaperQuestions(prev => [...prev, ...newItems]);
  };

  // Total Marks Calculation
  const totalMarks = useMemo(() => {
    return selectedPaperQuestions.reduce((acc, q) => {
      const m = Number(q.marks) || (q.type === 'CQ' ? 10 : q.type === 'SQ' ? 2 : 1);
      return acc + m;
    }, 0);
  }, [selectedPaperQuestions]);

  // Handle Manual Question Submit
  const handleSaveManualQuestion = (e) => {
    e.preventDefault();
    if (!manualStem.trim()) return;

    const newQ = {
      id: `manual-custom-${Date.now()}`,
      M_ID: `manual-custom-${Date.now()}`,
      type: 'MCQ',
      subject: activeSubject.nameBn,
      book: activeSubject.nameBn,
      chapter: `${activeChapter.number}: ${activeChapter.title}`,
      topic: selectedTopic || activeChapter.topics[0],
      difficulty: genDifficulty,
      marks: 1,
      badge: `[${activeSubject.nameBn}] কাস্টম প্রশ্ন`,
      question: manualStem,
      options: [
        manualOptA ? `ক) ${manualOptA}` : 'ক) বিকল্প ১',
        manualOptB ? `খ) ${manualOptB}` : 'খ) বিকল্প ২',
        manualOptC ? `গ) ${manualOptC}` : 'গ) বিকল্প ৩',
        manualOptD ? `ঘ) ${manualOptD}` : 'ঘ) বিকল্প ৪'
      ],
      correctAnswer: Number(manualAnswer) || 0,
      explanation: manualExplanation || ''
    };

    setTopicQuestions(prev => [newQ, ...prev]);
    setSelectedPaperQuestions(prev => [newQ, ...prev]);

    // Reset Form
    setManualStem('');
    setManualOptA('');
    setManualOptB('');
    setManualOptC('');
    setManualOptD('');
    setManualExplanation('');
    setShowManualForm(false);
    alert('✅ প্রশ্নটি সফলভাবে তৈরি ও প্রশ্নপত্রে যুক্ত করা হয়েছে!');
  };

  // Print A4 Exam Paper
  const handlePrintExam = () => {
    if (selectedPaperQuestions.length === 0) {
      alert('প্রশ্নপত্র প্রিন্ট করার আগে অন্তত একটি প্রশ্ন নির্বাচন করুন।');
      return;
    }

    const printWin = window.open('', '_blank', 'width=850,height=1000');
    if (!printWin) {
      window.print();
      return;
    }

    let html = `
<!DOCTYPE html>
<html lang="bn">
<head>
  <meta charset="utf-8" />
  <title>${examTitle}</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css">
  <script src="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/contrib/auto-render.min.js"></script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;600;700;800&display=swap');
    @page { size: A4 portrait; margin: 15mm 15mm 15mm 15mm; }
    body {
      font-family: 'Hind Siliguri', sans-serif;
      color: #0f172a;
      line-height: 1.45;
      padding: 0;
      margin: 0;
    }
    .header {
      text-align: center;
      border-bottom: 2px solid #0f172a;
      padding-bottom: 8px;
      margin-bottom: 16px;
    }
    .inst-name { font-size: 22px; font-weight: 800; }
    .exam-title { font-size: 16px; font-weight: 700; color: #1e293b; margin-top: 2px; }
    .meta-bar {
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      font-weight: 700;
      margin-top: 6px;
      padding-top: 4px;
      border-top: 1px dashed #cbd5e1;
    }
    .q-list { display: flex; flex-direction: column; gap: 12px; }
    .q-item { page-break-inside: avoid; }
    .q-head { font-weight: 800; font-size: 13px; display: flex; justify-content: space-between; }
    .q-stem { margin: 2px 0 6px 0; white-space: pre-wrap; }
    .options-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 4px 16px; font-size: 12px; }
    .footer { margin-top: 24px; padding-top: 8px; border-top: 1px solid #cbd5e1; font-size: 10px; display: flex; justify-content: space-between; color: #64748b; }
  </style>
</head>
<body>
  <div class="header">
    <div class="inst-name">${instituteName}</div>
    <div class="exam-title">${examTitle}</div>
    <div class="meta-bar">
      <span>বিষয়: ${activeSubject.nameBn} • অধ্যায়: ${activeChapter.title}</span>
      <span>সময়: ${examDuration} মিনিট | পূর্ণমান: ${totalMarks}</span>
    </div>
  </div>

  <div class="q-list">
`;

    selectedPaperQuestions.forEach((q, idx) => {
      html += `
    <div class="q-item">
      <div class="q-head">
        <span>প্রশ্ন ${idx + 1}.</span>
        <span>[${q.marks || (q.type === 'CQ' ? 10 : 1)} নম্বর]</span>
      </div>
`;

      if (q.type === 'CQ' && q.creativeSubQuestions) {
        const c = q.creativeSubQuestions;
        const cleanA = (c.a?.text || c.a?.q || '').replace(/^[কখগঘabcdABCD][\)\.\-:]\s*/, '');
        const cleanB = (c.b?.text || c.b?.q || '').replace(/^[কখগঘabcdABCD][\)\.\-:]\s*/, '');
        const cleanC = (c.c?.text || c.c?.q || '').replace(/^[কখগঘabcdABCD][\)\.\-:]\s*/, '');
        const cleanD = (c.d?.text || c.d?.q || '').replace(/^[কখগঘabcdABCD][\)\.\-:]\s*/, '');

        let cleanStem = q.stem || q.question || '';
        cleanStem = cleanStem.replace(/^\s*\[[^\]]*\]\s*/g, '').replace(/^উদ্দীপক:\s*/g, '').split('\n\n**ক.**')[0].trim();

        let diagramSvg = '';
        if (q.diagramType === 'COLLISION_HEAD_ON') {
          diagramSvg = `<div style="text-align: center; margin: 6px 0;"><svg viewBox="0 0 320 100" style="width: 220px; height: auto;"><line x1="20" y1="80" x2="300" y2="80" stroke="#94a3b8" stroke-width="2"/><circle cx="80" cy="55" r="22" fill="#3b82f6"/><text x="80" y="60" font-size="12" font-weight="bold" fill="#ffffff" text-anchor="middle">A (12kg)</text><line x1="105" y1="55" x2="140" y2="55" stroke="#ef4444" stroke-width="2"/><polygon points="140,51 148,55 140,59" fill="#ef4444"/><text x="125" y="47" font-size="9" fill="#ef4444" text-anchor="middle">u₁=10m/s</text><circle cx="230" cy="60" r="18" fill="#10b981"/><text x="230" y="65" font-size="11" font-weight="bold" fill="#ffffff" text-anchor="middle">B (8kg)</text><line x1="250" y1="60" x2="275" y2="60" stroke="#ef4444" stroke-width="2"/><polygon points="275,56 283,60 275,64" fill="#ef4444"/><text x="265" y="52" font-size="9" fill="#ef4444" text-anchor="middle">u₂=5m/s</text></svg></div>`;
        } else if (q.diagramType === 'FREE_FALL_DIVIDED_HEIGHT') {
          diagramSvg = `<div style="text-align: center; margin: 6px 0;"><svg viewBox="0 0 160 160" style="width: 140px; height: auto;"><line x1="40" y1="20" x2="40" y2="140" stroke="#64748b" stroke-width="1.5" stroke-dasharray="3 2"/><text x="25" y="85" font-size="10" font-weight="bold" fill="#6366f1">100m</text><circle cx="90" cy="20" r="10" fill="#ef4444"/><text x="90" y="24" font-size="9" font-weight="bold" fill="#fff" text-anchor="middle">10kg</text><text x="110" y="24" font-size="10">P</text><text x="110" y="50" font-size="10">Q</text><text x="110" y="80" font-size="10">R</text><text x="110" y="110" font-size="10">S</text><text x="110" y="140" font-size="10">T (ভূমি O)</text><line x1="70" y1="140" x2="150" y2="140" stroke="#0f172a" stroke-width="2"/></svg></div>`;
        } else if (q.diagramType === 'WAVE_PROPAGATION_TRANSVERSE') {
          diagramSvg = `<div style="text-align: center; margin: 6px 0;"><svg viewBox="0 0 280 80" style="width: 220px; height: auto;"><line x1="20" y1="40" x2="260" y2="40" stroke="#cbd5e1" stroke-dasharray="2 2"/><path d="M 30,40 Q 60,10 90,40 T 150,40 T 210,40 T 260,40" fill="none" stroke="#2563eb" stroke-width="2"/><text x="30" y="55" font-size="10">A</text><text x="90" y="55" font-size="10">B</text><text x="150" y="55" font-size="10">C</text><text x="210" y="55" font-size="10">D</text><line x1="30" y1="70" x2="210" y2="70" stroke="#6366f1" stroke-width="1.5"/><text x="120" y="68" font-size="10" font-weight="bold" fill="#6366f1">3 m</text></svg></div>`;
        } else if (q.diagramType === 'CONCAVE_MIRROR_OBJECT_IMAGE') {
          diagramSvg = `<div style="text-align: center; margin: 6px 0;"><svg viewBox="0 0 240 100" style="width: 200px; height: auto;"><line x1="20" y1="50" x2="220" y2="50" stroke="#334155" stroke-width="1.5"/><path d="M 190,15 A 60 60 0 0 1 190,85" fill="none" stroke="#4338ca" stroke-width="3"/><text x="200" y="55" font-size="11" font-weight="bold">P</text><text x="145" y="65" font-size="10" fill="#dc2626">F</text><text x="100" y="65" font-size="10" fill="#2563eb">C</text><line x1="120" y1="50" x2="120" y2="25" stroke="#16a34a" stroke-width="2.5"/><polygon points="117,25 120,18 123,25" fill="#16a34a"/><text x="120" y="65" font-size="10" fill="#16a34a">O</text></svg></div>`;
        } else if (q.diagramType === 'POINT_CHARGES_COULOMB') {
          diagramSvg = `<div style="text-align: center; margin: 6px 0;"><svg viewBox="0 0 240 70" style="width: 200px; height: auto;"><line x1="40" y1="35" x2="200" y2="35" stroke="#94a3b8" stroke-dasharray="3 2"/><circle cx="40" cy="35" r="15" fill="#ef4444"/><text x="40" y="39" font-size="9" font-weight="bold" fill="#fff" text-anchor="middle">+50C</text><text x="40" y="62" font-size="10" font-weight="bold">A</text><circle cx="200" cy="35" r="12" fill="#3b82f6"/><text x="200" y="39" font-size="8" font-weight="bold" fill="#fff" text-anchor="middle">+25C</text><text x="200" y="62" font-size="10" font-weight="bold">B</text><text x="120" y="25" font-size="10" font-weight="bold" fill="#6366f1" text-anchor="middle">100 cm</text></svg></div>`;
        } else if (q.diagramType === 'TRANSFORMER_SCHEMATIC') {
          diagramSvg = `<div style="text-align: center; margin: 6px 0;"><svg viewBox="0 0 240 100" style="width: 190px; height: auto;"><rect x="90" y="15" width="50" height="70" rx="3" fill="#f1f5f9" stroke="#334155" stroke-width="2"/><rect x="102" y="25" width="26" height="50" rx="2" fill="#fff" stroke="#334155" stroke-width="1.5"/><text x="40" y="35" font-size="8" font-weight="bold" fill="#dc2626">V₁=440V</text><text x="40" y="50" font-size="8" font-weight="bold" fill="#dc2626">n₁=100</text><text x="40" y="65" font-size="8" font-weight="bold" fill="#dc2626">I₁=2A</text><text x="150" y="55" font-size="8" font-weight="bold" fill="#2563eb">I₂=5A</text><text x="150" y="70" font-size="8" font-weight="bold" fill="#2563eb">1000W মোটর</text></svg></div>`;
        } else if (q.diagramType === 'CYCLIC_QUAD_DIAMETER') {
          diagramSvg = `<div style="text-align: center; margin: 6px 0;"><svg viewBox="0 0 160 160" style="width: 130px; height: auto;"><circle cx="80" cy="80" r="55" fill="#f8fafc" stroke="#3b82f6" stroke-width="2"/><polygon points="80,25 135,80 80,135 25,80" fill="rgba(99,102,241,0.1)" stroke="#4338ca" stroke-width="1.5"/><text x="80" y="20" font-size="9" font-weight="bold" text-anchor="middle">A</text><text x="145" y="83" font-size="9" font-weight="bold">B</text><text x="80" y="147" font-size="9" font-weight="bold" text-anchor="middle">C</text><text x="15" y="83" font-size="9" font-weight="bold">D</text><line x1="80" y1="25" x2="80" y2="135" stroke="#94a3b8" stroke-dasharray="2 2"/><line x1="25" y1="80" x2="135" y2="80" stroke="#94a3b8" stroke-dasharray="2 2"/></svg></div>`;
        } else if (q.diagramType === 'BROKEN_TREE_DISTANCE') {
          diagramSvg = `<div style="text-align: center; margin: 6px 0;"><svg viewBox="0 0 200 120" style="width: 160px; height: auto;"><line x1="20" y1="100" x2="180" y2="100" stroke="#334155" stroke-width="1.5"/><line x1="40" y1="100" x2="40" y2="40" stroke="#16a34a" stroke-width="3"/><line x1="40" y1="40" x2="140" y2="100" stroke="#ca8a04" stroke-width="2" stroke-dasharray="3 2"/><text x="40" y="112" font-size="8" text-anchor="middle">B</text><text x="40" y="32" font-size="8" text-anchor="middle">A</text><text x="140" y="112" font-size="8" text-anchor="middle">C</text><text x="55" y="55" font-size="8" fill="#dc2626">30°</text><text x="90" y="110" font-size="8" fill="#6366f1">18 m</text></svg></div>`;
        } else if (q.diagramType === 'COORDINATE_GEOMETRY_QUADRILATERAL') {
          diagramSvg = `<div style="text-align: center; margin: 6px 0;"><svg viewBox="0 0 200 130" style="width: 160px; height: auto;"><line x1="10" y1="70" x2="190" y2="70" stroke="#94a3b8"/><line x1="100" y1="10" x2="100" y2="120" stroke="#94a3b8"/><polygon points="100,60 80,30 150,15 165,35" fill="rgba(59,130,246,0.15)" stroke="#2563eb" stroke-width="1.5"/><text x="95" y="55" font-size="8">A</text><text x="65" y="30" font-size="8">B</text><text x="150" y="12" font-size="8">C</text><text x="168" y="40" font-size="8">D</text></svg></div>`;
        }

        html += `
      <div class="q-stem" style="margin-bottom: 6px; font-weight: 600;">
        ${q.badge ? `<span style="color: #4338ca; font-weight: 800;">${q.badge}</span> ` : ''}
        <strong>উদ্দীপক:</strong> ${cleanStem}
      </div>
      ${diagramSvg}
      <div style="margin-left: 10px; display: flex; flex-direction: column; gap: 4px; font-size: 12px;">
        <div style="display: flex; justify-content: space-between;"><span><strong>ক.</strong> ${cleanA}</span> <span style="font-weight: bold; color: #64748b;">[${c.a?.marks || 1} নম্বর]</span></div>
        <div style="display: flex; justify-content: space-between;"><span><strong>খ.</strong> ${cleanB}</span> <span style="font-weight: bold; color: #64748b;">[${c.b?.marks || 2} নম্বর]</span></div>
        <div style="display: flex; justify-content: space-between;"><span><strong>গ.</strong> ${cleanC}</span> <span style="font-weight: bold; color: #64748b;">[${c.c?.marks || 3} নম্বর]</span></div>
        ${cleanD ? `<div style="display: flex; justify-content: space-between;"><span><strong>ঘ.</strong> ${cleanD}</span> <span style="font-weight: bold; color: #64748b;">[${c.d?.marks || 4} নম্বর]</span></div>` : ''}
      </div>
`;
      } else {
        html += `<div class="q-stem">${q.question || q.stem || ''}</div>`;
      }

      if (Array.isArray(q.options) && q.options.length > 0) {
        html += `<div class="options-grid">`;
        q.options.forEach(opt => {
          html += `<div>${opt}</div>`;
        });
        html += `</div>`;
      }

      html += `</div>`;
    });

    html += `
  </div>
  <div class="footer">
    <span>NextGen Academy Question Engine</span>
    <span>Generated: ${new Date().toLocaleDateString('bn-BD')}</span>
  </div>
  <script>
    window.onload = function() {
      if (window.renderMathInElement) {
        renderMathInElement(document.body, {
          delimiters: [
            {left: '$$', right: '$$', display: true},
            {left: '$', right: '$', display: false},
            {left: '\\\\(', right: '\\\\)', display: false},
            {left: '\\\\[', right: '\\\\]', display: true}
          ],
          throwOnError: false
        });
      }
      setTimeout(function() { window.print(); }, 400);
    }
  </script>
</body>
</html>
`;

    printWin.document.write(html);
    printWin.document.close();
  };

  // Copy Paper to Clipboard
  const handleCopyPaper = () => {
    if (selectedPaperQuestions.length === 0) return;
    let text = `${instituteName}\n${examTitle}\nবিষয়: ${activeSubject.nameBn} | পূর্ণমান: ${totalMarks} | সময়: ${examDuration} মিনিট\n\n`;

    selectedPaperQuestions.forEach((q, idx) => {
      text += `প্রশ্ন ${idx + 1}: ${q.question || q.stem || ''} [${q.marks || 1} নম্বর]\n`;
      if (Array.isArray(q.options) && q.options.length > 0) {
        q.options.forEach(opt => {
          text += `   ${opt}\n`;
        });
      }
      text += '\n';
    });

    navigator.clipboard.writeText(text);
    alert('✅ প্রশ্নপত্র ক্লিপবোর্ডে কপি করা হয়েছে!');
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* 1. TOP HERO BANNER */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden border border-indigo-500/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center space-x-2 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md mb-2">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>NCTB সিলেবাসভিত্তিক প্রশ্ন ইঞ্জিন</span>
            </div>
            <h2 className="text-xl md:text-2xl font-black tracking-tight">
              অধ্যায় ও টপিকভিত্তিক প্রশ্ন প্রস্তুতকারক ও জেনারেটর
            </h2>
            <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-2xl">
              সাধারণ গণিত, উচ্চতর গণিত, পদার্থবিজ্ঞান ও রসায়নের প্রতিটি অধ্যায় ও নির্দিষ্ট টপিক সিলেক্ট করে স্বয়ংক্রিয়ভাবে স্ট্যান্ডার্ড প্রশ্ন তৈরি করুন, প্রিন্ট করুন বা সরাসরি অনলাইন পরীক্ষা নিন।
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowManualForm(!showManualForm)}
              className="px-4 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>নিজে নতুন প্রশ্ন লিখুন</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. ENGINE MODE SWITCHER */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-200/70 rounded-2xl border border-slate-300/80 w-fit flex-wrap">
        <button
          type="button"
          onClick={() => setActiveEngineView('GENERATOR')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center space-x-2 cursor-pointer ${
            activeEngineView === 'GENERATOR'
              ? 'bg-white text-indigo-700 shadow-sm'
              : 'text-slate-700 hover:text-slate-900'
          }`}
        >
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <span>🎯 ৪টি বিষয়ের অধ্যায় ও টপিকভিত্তিক প্রশ্ন ইঞ্জিন</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveEngineView('CONCEPT_SOLVER')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center space-x-2 cursor-pointer ${
            activeEngineView === 'CONCEPT_SOLVER'
              ? 'bg-slate-900 text-white shadow-md'
              : 'text-slate-700 hover:text-slate-900'
          }`}
        >
          <Atom className="w-4 h-4 text-sky-400" />
          <span>📐 পদার্থবিজ্ঞান: ১ম অধ্যায় Concept-wise গাণিতিক সমস্যা ভল্ট (৬৫টি সমস্যা)</span>
        </button>
      </div>

      {activeEngineView === 'CONCEPT_SOLVER' ? (
        <PhysicsChapter1MathProblemSolver />
      ) : (
        <>
          {/* 3. SUBJECT SELECTOR TABS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {Object.values(SYLLABUS_DATABASE).map((subj) => {
          const Icon = subj.icon;
          const isSelected = selectedSubjectKey === subj.id;

          return (
            <button
              key={subj.id}
              type="button"
              onClick={() => {
                setSelectedSubjectKey(subj.id);
                setSelectedChapterId(subj.chapters[0].id);
              }}
              className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                isSelected
                  ? 'bg-slate-900 text-white border-indigo-500 shadow-lg shadow-indigo-500/20 ring-2 ring-indigo-500/40'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className={`p-2.5 rounded-xl ${isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'}`}>
                  <Icon className="w-5 h-5" />
                </div>
                {isSelected && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                )}
              </div>
              <div className="mt-3">
                <div className="font-extrabold text-sm leading-tight">{subj.nameBn}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">{subj.chapters.length}টি অধ্যায়</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* 3. CHAPTER & TOPIC SELECTOR TOOLBAR */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Chapter Selector Dropdown */}
          <div className="md:col-span-5 space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center space-x-1.5">
              <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
              <span>১. অধ্যায় নির্বাচন করুন:</span>
            </label>
            <select
              value={selectedChapterId}
              onChange={(e) => setSelectedChapterId(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              {activeSubject.chapters.map((ch) => (
                <option key={ch.id} value={ch.id}>
                  {ch.number}: {ch.title}
                </option>
              ))}
            </select>
          </div>

          {/* Topic Selector */}
          <div className="md:col-span-4 space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center space-x-1.5">
              <Layers className="w-3.5 h-3.5 text-purple-600" />
              <span>২. নির্দিষ্ট টপিক নির্বাচন:</span>
            </label>
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-purple-500 focus:outline-none"
            >
              {(activeChapter?.topics || []).map((tp, idx) => (
                <option key={idx} value={tp}>
                  🎯 {tp}
                </option>
              ))}
            </select>
          </div>

          {/* Question Type, Year & Board Filters */}
          <div className="md:col-span-3 grid grid-cols-3 gap-1.5 items-end">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-600">টাইপ:</label>
              <select
                value={genQuestionType}
                onChange={(e) => setGenQuestionType(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="MCQ">MCQ</option>
                <option value="CQ">CQ</option>
                <option value="SQ">SQ</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-600">সাল / বছর:</label>
              <select
                value={selectedYearFilter}
                onChange={(e) => setSelectedYearFilter(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="সকল সাল">সকল সাল</option>
                <option value="২০২৫">২০২৫</option>
                <option value="২০২৪">২০২৪</option>
                <option value="২০২৩">২০২৩</option>
                <option value="২০২২">২০২২</option>
                <option value="২০২১">২০২১</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-600">বোর্ড:</label>
              <select
                value={selectedBoardFilter}
                onChange={(e) => setSelectedBoardFilter(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="সকল বোর্ড">সকল বোর্ড</option>
                <option value="ঢাকা বোর্ড">ঢাকা বোর্ড</option>
                <option value="রাজশাহী বোর্ড">রাজশাহী বোর্ড</option>
                <option value="যশোর বোর্ড">যশোর বোর্ড</option>
                <option value="কুমিল্লা বোর্ড">কুমিল্লা বোর্ড</option>
                <option value="চট্টগ্রাম বোর্ড">চট্টগ্রাম বোর্ড</option>
                <option value="সিলেট বোর্ড">সিলেট বোর্ড</option>
                <option value="বরিশাল বোর্ড">বরিশাল বোর্ড</option>
                <option value="দিনাজপুর বোর্ড">দিনাজপুর বোর্ড</option>
                <option value="ময়মনসিংহ বোর্ড">ময়মনসিংহ বোর্ড</option>
                <option value="ক্যাডেট কলেজ">ক্যাডেট কলেজ</option>
              </select>
            </div>
          </div>
        </div>

        {/* Quick Topic Chips */}
        <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-bold text-slate-400">টপিকসমূহ:</span>
          {(activeChapter?.topics || []).map((tp, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setSelectedTopic(tp)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                selectedTopic === tp
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tp}
            </button>
          ))}
        </div>
      </div>

      {/* 4. MANUAL QUESTION CREATOR FORM (MODAL/DRAWER) */}
      {showManualForm && (
        <div className="bg-white rounded-3xl border-2 border-teal-500/40 p-6 shadow-xl space-y-4 animate-in slide-in-from-top-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-xl bg-teal-50 text-teal-700 font-bold">✍️</div>
              <div>
                <h3 className="text-sm font-black text-slate-900">
                  {activeSubject.nameBn} • {activeChapter.number} ({selectedTopic}) এর কাস্টম প্রশ্ন তৈরি
                </h3>
                <p className="text-[11px] text-slate-500">বাংলা ইউনিকোড ও গাণিতিক সূত্রাবলী সমর্থনযোগ্য</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowManualForm(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSaveManualQuestion} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                প্রশ্নের বিবরণ / উদ্দীপক (Question Text):
              </label>
              <textarea
                value={manualStem}
                onChange={(e) => setManualStem(e.target.value)}
                placeholder="যেমন: নিচের কোনটি সার্বিক সেট নির্দেশ করে?"
                rows={2}
                required
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">ক) বিকল্প ১:</label>
                <input
                  type="text"
                  value={manualOptA}
                  onChange={(e) => setManualOptA(e.target.value)}
                  placeholder="বিকল্প ক"
                  required
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">খ) বিকল্প ২:</label>
                <input
                  type="text"
                  value={manualOptB}
                  onChange={(e) => setManualOptB(e.target.value)}
                  placeholder="বিকল্প খ"
                  required
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">গ) বিকল্প ৩:</label>
                <input
                  type="text"
                  value={manualOptC}
                  onChange={(e) => setManualOptC(e.target.value)}
                  placeholder="বিকল্প গ"
                  required
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">ঘ) বিকল্প ৪:</label>
                <input
                  type="text"
                  value={manualOptD}
                  onChange={(e) => setManualOptD(e.target.value)}
                  placeholder="বিকল্প ঘ"
                  required
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">সঠিক উত্তর নির্বাচন:</label>
                <select
                  value={manualAnswer}
                  onChange={(e) => setManualAnswer(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                >
                  <option value={0}>ক (বিকল্প ১)</option>
                  <option value={1}>খ (বিকল্প ২)</option>
                  <option value={2}>গ (বিকল্প ৩)</option>
                  <option value={3}>ঘ (বিকল্প ৪)</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">ব্যাখ্যা (Explanation):</label>
                <input
                  type="text"
                  value={manualExplanation}
                  onChange={(e) => setManualExplanation(e.target.value)}
                  placeholder="সমাধানের সংক্ষিপ্ত ব্যাখ্যা..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowManualForm(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
              >
                বাতিল
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-black rounded-xl shadow-md flex items-center space-x-1.5"
              >
                <Save className="w-4 h-4" />
                <span>সংরক্ষণ ও প্রশ্নপত্রে যোগ করুন</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 5. MAIN WORKSPACE: LEFT TOPIC QUESTIONS, RIGHT EXAM PAPER PREVIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Generated Topic Questions */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 flex-wrap gap-2">
              <div>
                <h3 className="font-black text-sm text-slate-900 uppercase tracking-wider">
                  ১. টপিকভিত্তিক প্রশ্ন তালিকা ({topicQuestions.length} টি)
                </h3>
                <p className="text-[11px] text-slate-500">
                  {activeSubject.nameBn} • {activeChapter.number} ({selectedTopic})
                </p>
              </div>
              <button
                type="button"
                onClick={handleSelectAll}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 cursor-pointer"
              >
                + সব যোগ করুন
              </button>
            </div>

            <div className="max-h-[580px] overflow-y-auto space-y-3 pr-1 custom-scrollbar">
              {topicQuestions.length === 0 ? (
                <div className="p-8 text-center text-slate-400 space-y-2">
                  <HelpCircle className="w-8 h-8 mx-auto text-slate-300" />
                  <p className="text-xs font-bold">এই টপিকের কোনো প্রশ্ন এখনো লোড হয়নি। 'জেনারেট' বাটনে ক্লিক করুন।</p>
                </div>
              ) : (
                topicQuestions.map((q, idx) => {
                  const qId = q.id || q.M_ID || idx;
                  const isSelected = selectedPaperQuestions.some(sq => (sq.id || sq.M_ID) === qId);

                  return (
                    <div
                      key={qId}
                      onClick={() => toggleSelectQuestion(q)}
                      className={`p-4 rounded-2xl border text-xs space-y-2 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-indigo-50/70 border-indigo-400 shadow-xs'
                          : 'bg-slate-50 border-slate-200 hover:bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {}}
                            className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                          />
                          <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                            q.type === 'CQ' ? 'bg-purple-100 text-purple-800' : q.type === 'SQ' ? 'bg-emerald-100 text-emerald-800' : 'bg-indigo-100 text-indigo-800'
                          }`}>
                            {q.type === 'CQ' ? 'CQ সৃজনশীল' : q.type === 'SQ' ? 'SQ সংক্ষিপ্ত' : 'MCQ'}
                          </span>
                          <span className="text-[10px] font-bold text-slate-500">
                            {q.badge || `[${q.topic || 'টপিক'}]`}
                          </span>
                        </div>
                        <span className="font-bold text-slate-700 text-[11px]">
                          [{q.marks || 1} নম্বর]
                        </span>
                      </div>

                      {q.type === 'SQ' ? (
                        <div className="space-y-1.5 pt-1 text-slate-800">
                          <div className="font-bold text-slate-900 leading-relaxed text-xs">
                            <MathRenderer text={q.question || q.stem} />
                          </div>
                          {q.shortAnswer && (
                            <div className="p-2.5 bg-emerald-50/90 rounded-xl border border-emerald-200 text-[11px] text-emerald-900 font-semibold">
                              <strong>সংক্ষিপ্ত উত্তর:</strong> <MathRenderer text={q.shortAnswer} />
                            </div>
                          )}
                        </div>
                      ) : q.type === 'CQ' && q.creativeSubQuestions ? (
                        <div className="space-y-2 pt-1 text-slate-800">
                          <div className="p-3 rounded-xl bg-purple-50/70 border border-purple-200/80 leading-relaxed font-semibold">
                            <span className="text-[10px] font-black text-purple-700 uppercase tracking-wide block mb-1">
                              উদ্দীপক:
                            </span>
                            <MathRenderer text={q.question?.split('\n\n**ক.**')[0]?.replace(/^\[.*?\]\s*উদ্দীপক:\s*/i, '') || q.question} />
                            {q.diagramType && <QuestionDiagram type={q.diagramType} />}
                          </div>

                          <div className="space-y-1.5 pl-1 text-[11px]">
                            {['a', 'b', 'c', 'd'].map((key) => {
                              const sub = q.creativeSubQuestions[key];
                              if (!sub || (!sub.text && !sub.q)) return null;
                              const bLabels = { a: 'ক.', b: 'খ.', c: 'গ.', d: 'ঘ.' };
                              const rawText = sub.text || sub.q || '';
                              const cleanText = rawText.replace(/^[কখগঘabcdABCD][\)\.\-:]\s*/, '').replace(/^\*\*.*?\*\*\s*/, '').trim();
                              const defaultMarks = key === 'a' ? 1 : key === 'b' ? 2 : key === 'c' ? 3 : 4;
                              const solText = sub.solution || sub.ans;

                              return (
                                <div key={key} className="p-2.5 bg-white rounded-xl border border-slate-200/90 shadow-2xs">
                                  <div className="flex items-start justify-between gap-1">
                                    <div className="flex-1 font-medium">
                                      <span className="font-extrabold text-indigo-700 mr-1.5">{bLabels[key]}</span>
                                      <MathRenderer text={cleanText} />
                                    </div>
                                    <span className="text-slate-400 font-bold text-[10px] shrink-0 ml-1">
                                      [{sub.marks || defaultMarks} নম্বর]
                                    </span>
                                  </div>
                                  {solText && (
                                    <div className="mt-1.5 pt-1.5 border-t border-slate-100 text-[10px] text-emerald-700 font-medium">
                                      <strong>উত্তর:</strong> <MathRenderer text={solText} />
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ) : (
                        <div className="font-bold text-slate-800 leading-relaxed">
                          <MathRenderer text={q.question || q.stem} />
                        </div>
                      )}

                      {Array.isArray(q.options) && q.options.length > 0 && (
                        <div className="space-y-1.5 pt-1 text-xs text-slate-800">
                          {q.options.map((opt, oIdx) => {
                            const bLabels = ['(ক)', '(খ)', '(গ)', '(ঘ)'];
                            const cleanOpt = String(opt).replace(/^[কখগঘabcdABCD][\)\.\-:]\s*/, '');
                            return (
                              <div key={oIdx} className="p-2 bg-white rounded-xl border border-slate-200/80 shadow-2xs flex items-start space-x-2">
                                <span className="font-extrabold text-indigo-700 shrink-0">{bLabels[oIdx] || `(${oIdx + 1})`}</span>
                                <div className="flex-1 font-medium"><MathRenderer text={cleanOpt} /></div>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {q.explanation && (
                        <div className="text-[10px] bg-white p-2.5 rounded-xl border border-slate-100 text-slate-600 mt-1 leading-relaxed">
                          <strong className="text-indigo-700">ব্যাখ্যা ও সমাধান:</strong> <MathRenderer text={q.explanation} />
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right: Live Paper Cart & Action Hub */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 flex-wrap gap-2">
              <div>
                <h3 className="font-black text-sm text-slate-900 uppercase tracking-wider">
                  ২. মডেল টেস্ট প্রশ্নপত্র প্রিভিউ ({selectedPaperQuestions.length} টি)
                </h3>
                <p className="text-[11px] text-slate-500">
                  পূর্ণমান: {totalMarks} | সময়: {examDuration} মিনিট
                </p>
              </div>

              <div className="flex items-center space-x-1.5">
                <button
                  type="button"
                  onClick={handleCopyPaper}
                  disabled={selectedPaperQuestions.length === 0}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center space-x-1 cursor-pointer disabled:opacity-40"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>কপি</span>
                </button>

                <button
                  type="button"
                  onClick={handlePrintExam}
                  disabled={selectedPaperQuestions.length === 0}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1 cursor-pointer shadow-md disabled:opacity-40"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>A4 প্রিন্ট</span>
                </button>
              </div>
            </div>

            {/* Config Fields */}
            <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-100">
              <div>
                <label className="text-[10px] font-bold text-slate-500 block mb-0.5">পরীক্ষার শিরোনাম:</label>
                <input
                  type="text"
                  value={examTitle}
                  onChange={(e) => setExamTitle(e.target.value)}
                  className="w-full p-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 block mb-0.5">সময়সীমা (মিনিট):</label>
                <input
                  type="number"
                  value={examDuration}
                  onChange={(e) => setExamDuration(e.target.value)}
                  className="w-full p-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold"
                />
              </div>
            </div>

            {/* Selected Questions List */}
            <div className="max-h-[480px] overflow-y-auto space-y-2.5 pr-1 custom-scrollbar">
              {selectedPaperQuestions.length === 0 ? (
                <div className="p-10 text-center bg-slate-50/60 rounded-2xl border border-dashed border-slate-200 text-slate-400 space-y-2">
                  <FileText className="w-8 h-8 mx-auto text-slate-300" />
                  <p className="text-xs font-bold text-slate-600">বাম পাশের তালিকা থেকে প্রশ্ন যোগ করুন</p>
                </div>
              ) : (
                selectedPaperQuestions.map((q, idx) => (
                  <div key={q.id || idx} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1 relative group">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-indigo-700">প্রশ্ন {idx + 1}.</span>
                      <button
                        type="button"
                        onClick={() => toggleSelectQuestion(q)}
                        className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                        title="মুছে ফেলুন"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="font-medium text-slate-800">
                      <MathRenderer text={q.question || q.stem} />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
        </>
      )}
    </div>
  );
}
