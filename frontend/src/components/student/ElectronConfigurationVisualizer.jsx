import React, { useState, useMemo, useRef } from 'react';
import {
  Atom,
  Sparkles,
  Zap,
  Search,
  Download,
  Info,
  Layers,
  ChevronRight,
  ChevronDown,
  RotateCcw,
  Sliders,
  CheckCircle2,
  Brain,
  Award,
  Play,
  Pause,
  HelpCircle,
  TrendingUp,
  Compass,
  Magnet,
  Filter,
  Loader2,
  ZoomIn,
  ZoomOut,
  Maximize2
} from 'lucide-react';
import { exportBrandedGraphic } from '../../utils/exportBrandedGraphic';

// Comprehensive dataset with subshell distributions, shells, magnetic properties, and exam notes
const ELEMENTS_DB = [
  // Period 1
  { n: 1, sym: 'H', nameBn: 'হাইড্রোজেন', nameEn: 'Hydrogen', mass: 1.008, group: 1, period: 1, block: 's', cat: 'nonmetal', state: 'Gas', en: 2.20, val: 1, ec: '1s¹', shells: [1], subshells: [{ name: '1s', cap: 2, count: 1 }], desc: 'মহাবিশ্বের সবচেয়ে হালকা ও প্রাচুর্যপূর্ণ গ্যাসীয় মৌল।' },
  { n: 2, sym: 'He', nameBn: 'হিলিয়াম', nameEn: 'Helium', mass: 4.0026, group: 18, period: 1, block: 's', cat: 'noble', state: 'Gas', en: 0, val: 0, ec: '1s²', shells: [2], subshells: [{ name: '1s', cap: 2, count: 2 }], desc: 'দ্বৈত নিয়ম (Duet Rule) মেনে স্থিতিশীল নিষ্ক্রিয় গ্যাস।' },

  // Period 2
  { n: 3, sym: 'Li', nameBn: 'লিথিয়াম', nameEn: 'Lithium', mass: 6.94, group: 1, period: 2, block: 's', cat: 'alkali', state: 'Solid', en: 0.98, val: 1, ec: '1s² 2s¹', shells: [2, 1], subshells: [{ name: '1s', cap: 2, count: 2 }, { name: '2s', cap: 2, count: 1 }], desc: 'সবচেয়ে হালকা ক্ষার ধাতু; রিচার্জেবল ব্যাটারির প্রাণ।' },
  { n: 4, sym: 'Be', nameBn: 'বেরিলিয়াম', nameEn: 'Beryllium', mass: 9.0122, group: 2, period: 2, block: 's', cat: 'alkaline', state: 'Solid', en: 1.57, val: 2, ec: '1s² 2s²', shells: [2, 2], subshells: [{ name: '1s', cap: 2, count: 2 }, { name: '2s', cap: 2, count: 2 }], desc: 'মৃৎক্ষার ধাতু; উচ্চ গলনাঙ্ক ও এক্স-রে জানালায় ব্যবহৃত।' },
  { n: 5, sym: 'B', nameBn: 'বোরন', nameEn: 'Boron', mass: 10.81, group: 13, period: 2, block: 'p', cat: 'metalloid', state: 'Solid', en: 2.04, val: 3, ec: '1s² 2s² 2p¹', shells: [2, 3], subshells: [{ name: '1s', cap: 2, count: 2 }, { name: '2s', cap: 2, count: 2 }, { name: '2p', cap: 6, count: 1 }], desc: 'অপধাতু; কাচ, সিরামিক ও সেমিকন্ডাক্টরে ব্যবহৃত।' },
  { n: 6, sym: 'C', nameBn: 'কার্বন', nameEn: 'Carbon', mass: 12.011, group: 14, period: 2, block: 'p', cat: 'nonmetal', state: 'Solid', en: 2.55, val: 4, ec: '1s² 2s² 2p²', shells: [2, 4], subshells: [{ name: '1s', cap: 2, count: 2 }, { name: '2s', cap: 2, count: 2 }, { name: '2p', cap: 6, count: 2 }], desc: 'জৈব রসায়নের মূল ভিত্তি; হীরা ও গ্রাফাইটের মৌল।' },
  { n: 7, sym: 'N', nameBn: 'নাইট্রোজেন', nameEn: 'Nitrogen', mass: 14.007, group: 15, period: 2, block: 'p', cat: 'nonmetal', state: 'Gas', en: 3.04, val: 3, ec: '1s² 2s² 2p³', shells: [2, 5], subshells: [{ name: '1s', cap: 2, count: 2 }, { name: '2s', cap: 2, count: 2 }, { name: '2p', cap: 6, count: 3 }], desc: 'হুন্ডের নীতি অনুযায়ী ২p উপস্তরে ৩টি সমমুখী অযুগ্ম ইলেকট্রন রয়েছে।' },
  { n: 8, sym: 'O', nameBn: 'অক্সিজেন', nameEn: 'Oxygen', mass: 15.999, group: 16, period: 2, block: 'p', cat: 'nonmetal', state: 'Gas', en: 3.44, val: 2, ec: '1s² 2s² 2p⁴', shells: [2, 6], subshells: [{ name: '1s', cap: 2, count: 2 }, { name: '2s', cap: 2, count: 2 }, { name: '2p', cap: 6, count: 4 }], desc: 'জীবদেহের শ্বসন ও দহনের মূল সহায়ক মৌল।' },
  { n: 9, sym: 'F', nameBn: 'ফ্লোরিন', nameEn: 'Fluorine', mass: 18.998, group: 17, period: 2, block: 'p', cat: 'halogen', state: 'Gas', en: 3.98, val: 1, ec: '1s² 2s² 2p⁵', shells: [2, 7], subshells: [{ name: '1s', cap: 2, count: 2 }, { name: '2s', cap: 2, count: 2 }, { name: '2p', cap: 6, count: 5 }], desc: 'পর্যায় সারণির সর্বাধিক তড়িৎ-ঋণাত্মক মৌল (EN = 3.98)।' },
  { n: 10, sym: 'Ne', nameBn: 'নিয়ন', nameEn: 'Neon', mass: 20.18, group: 18, period: 2, block: 'p', cat: 'noble', state: 'Gas', en: 0, val: 0, ec: '1s² 2s² 2p⁶', shells: [2, 8], subshells: [{ name: '1s', cap: 2, count: 2 }, { name: '2s', cap: 2, count: 2 }, { name: '2p', cap: 6, count: 6 }], desc: 'অষ্টক পূর্ণ (Octet Rule) নিষ্ক্রিয় গ্যাস।' },

  // Period 3
  { n: 11, sym: 'Na', nameBn: 'সোডিয়াম', nameEn: 'Sodium', mass: 22.99, group: 1, period: 3, block: 's', cat: 'alkali', state: 'Solid', en: 0.93, val: 1, ec: '[Ne] 3s¹', shells: [2, 8, 1], subshells: [{ name: '1s', cap: 2, count: 2 }, { name: '2s', cap: 2, count: 2 }, { name: '2p', cap: 6, count: 6 }, { name: '3s', cap: 2, count: 1 }], desc: 'নরম ক্ষার ধাতু; ১টি ইলেকট্রন ত্যাগ করে Na⁺ গঠন করে।' },
  { n: 12, sym: 'Mg', nameBn: 'ম্যাগনেসিয়াম', nameEn: 'Magnesium', mass: 24.305, group: 2, period: 3, block: 's', cat: 'alkaline', state: 'Solid', en: 1.31, val: 2, ec: '[Ne] 3s²', shells: [2, 8, 2], subshells: [{ name: '1s', cap: 2, count: 2 }, { name: '2s', cap: 2, count: 2 }, { name: '2p', cap: 6, count: 6 }, { name: '3s', cap: 2, count: 2 }], desc: 'উদ্ভিদের ক্লোরোফিলের কেন্দ্রীয় ধাতু আয়ন।' },
  { n: 13, sym: 'Al', nameBn: 'অ্যালুমিনিয়াম', nameEn: 'Aluminium', mass: 26.982, group: 13, period: 3, block: 'p', cat: 'post-transition', state: 'Solid', en: 1.61, val: 3, ec: '[Ne] 3s² 3p¹', shells: [2, 8, 3], subshells: [{ name: '1s', cap: 2, count: 2 }, { name: '2s', cap: 2, count: 2 }, { name: '2p', cap: 6, count: 6 }, { name: '3s', cap: 2, count: 2 }, { name: '3p', cap: 6, count: 1 }], desc: 'হালকা, টেকসই ও জারণরোধী সংকর ধাতু তৈরিতে প্রধান।' },
  { n: 14, sym: 'Si', nameBn: 'সিলিকন', nameEn: 'Silicon', mass: 28.085, group: 14, period: 3, block: 'p', cat: 'metalloid', state: 'Solid', en: 1.90, val: 4, ec: '[Ne] 3s² 3p²', shells: [2, 8, 4], subshells: [{ name: '1s', cap: 2, count: 2 }, { name: '2s', cap: 2, count: 2 }, { name: '2p', cap: 6, count: 6 }, { name: '3s', cap: 2, count: 2 }, { name: '3p', cap: 6, count: 2 }], desc: 'কম্পিউটার মাইক্রোচিপস ও সৌর প্যানেলের মেরুদণ্ড।' },
  { n: 15, sym: 'P', nameBn: 'ফসফরাস', nameEn: 'Phosphorus', mass: 30.974, group: 15, period: 3, block: 'p', cat: 'nonmetal', state: 'Solid', en: 2.19, val: 3, ec: '[Ne] 3s² 3p³', shells: [2, 8, 5], subshells: [{ name: '1s', cap: 2, count: 2 }, { name: '2s', cap: 2, count: 2 }, { name: '2p', cap: 6, count: 6 }, { name: '3s', cap: 2, count: 2 }, { name: '3p', cap: 6, count: 3 }], desc: '৩p উপস্তরে ৩টি সমমুখী অযুগ্ম ইলেকট্রন রয়েছে।' },
  { n: 16, sym: 'S', nameBn: 'সালফার', nameEn: 'Sulfur', mass: 32.06, group: 16, period: 3, block: 'p', cat: 'nonmetal', state: 'Solid', en: 2.58, val: 2, ec: '[Ne] 3s² 3p⁴', shells: [2, 8, 6], subshells: [{ name: '1s', cap: 2, count: 2 }, { name: '2s', cap: 2, count: 2 }, { name: '2p', cap: 6, count: 6 }, { name: '3s', cap: 2, count: 2 }, { name: '3p', cap: 6, count: 4 }], desc: 'পরিবর্তনশীল যোজনী (২, ৪, ৬) প্রদর্শনকারী অধাতু।' },
  { n: 17, sym: 'Cl', nameBn: 'ক্লোরিন', nameEn: 'Chlorine', mass: 35.45, group: 17, period: 3, block: 'p', cat: 'halogen', state: 'Gas', en: 3.16, val: 1, ec: '[Ne] 3s² 3p⁵', shells: [2, 8, 7], subshells: [{ name: '1s', cap: 2, count: 2 }, { name: '2s', cap: 2, count: 2 }, { name: '2p', cap: 6, count: 6 }, { name: '3s', cap: 2, count: 2 }, { name: '3p', cap: 6, count: 5 }], desc: 'খাবার লবণ ও ব্লিচিং পাউডারের তীব্র জারক হ্যালোজেন।' },
  { n: 18, sym: 'Ar', nameBn: 'আর্গন', nameEn: 'Argon', mass: 39.948, group: 18, period: 3, block: 'p', cat: 'noble', state: 'Gas', en: 0, val: 0, ec: '[Ne] 3s² 3p⁶', shells: [2, 8, 8], subshells: [{ name: '1s', cap: 2, count: 2 }, { name: '2s', cap: 2, count: 2 }, { name: '2p', cap: 6, count: 6 }, { name: '3s', cap: 2, count: 2 }, { name: '3p', cap: 6, count: 6 }], desc: 'অষ্টক পূর্ণ নিষ্ক্রিয় গ্যাস; বৈদ্যুতিক বাল্বে ব্যবহৃত।' },

  // Period 4
  { n: 19, sym: 'K', nameBn: 'পটাশিয়াম', nameEn: 'Potassium', mass: 39.098, group: 1, period: 4, block: 's', cat: 'alkali', state: 'Solid', en: 0.82, val: 1, ec: '[Ar] 4s¹', shells: [2, 8, 8, 1], subshells: [{ name: '1s', cap: 2, count: 2 }, { name: '2s', cap: 2, count: 2 }, { name: '2p', cap: 6, count: 6 }, { name: '3s', cap: 2, count: 2 }, { name: '3p', cap: 6, count: 6 }, { name: '4s', cap: 2, count: 1 }], desc: 'আউফবাউ নীতি অনুযায়ী ১৯তম ইলেকট্রন ৩d-তে না গিয়ে নিম্নশক্তির ৪s-এ যায় (n+l মান ৪s<৩d)।' },
  { n: 20, sym: 'Ca', nameBn: 'ক্যালসিয়াম', nameEn: 'Calcium', mass: 40.078, group: 2, period: 4, block: 's', cat: 'alkaline', state: 'Solid', en: 1.00, val: 2, ec: '[Ar] 4s²', shells: [2, 8, 8, 2], subshells: [{ name: '1s', cap: 2, count: 2 }, { name: '2s', cap: 2, count: 2 }, { name: '2p', cap: 6, count: 6 }, { name: '3s', cap: 2, count: 2 }, { name: '3p', cap: 6, count: 6 }, { name: '4s', cap: 2, count: 2 }], desc: 'হাড় ও দাঁতের গঠনকারী প্রধান মৃৎক্ষার ধাতু।' },
  { n: 21, sym: 'Sc', nameBn: 'স্ক্যান্ডিয়াম', nameEn: 'Scandium', mass: 44.956, group: 3, period: 4, block: 'd', cat: 'transition', state: 'Solid', en: 1.36, val: 3, ec: '[Ar] 3d¹ 4s²', shells: [2, 8, 9, 2], subshells: [{ name: '3d', cap: 10, count: 1 }, { name: '4s', cap: 2, count: 2 }], desc: 'প্রথম ডি-ব্লক মৌল; সংকর ধাতু তৈরিতে ব্যবহৃত।' },
  { n: 22, sym: 'Ti', nameBn: 'টাইটানিয়াম', nameEn: 'Titanium', mass: 47.867, group: 4, period: 4, block: 'd', cat: 'transition', state: 'Solid', en: 1.54, val: 4, ec: '[Ar] 3d² 4s²', shells: [2, 8, 10, 2], subshells: [{ name: '3d', cap: 10, count: 2 }, { name: '4s', cap: 2, count: 2 }], desc: 'মহাকাশযান ও চিকিৎসা ইমপ্লান্টে ব্যবহৃত হালকা ও অত্যন্ত শক্তিশালী ধাতু।' },
  { n: 23, sym: 'V', nameBn: 'ভ্যানাডিয়াম', nameEn: 'Vanadium', mass: 50.942, group: 5, period: 4, block: 'd', cat: 'transition', state: 'Solid', en: 1.63, val: 5, ec: '[Ar] 3d³ 4s²', shells: [2, 8, 11, 2], subshells: [{ name: '3d', cap: 10, count: 3 }, { name: '4s', cap: 2, count: 2 }], desc: 'স্পর্শ পদ্ধতিতে সালফিউরিক এসিড উৎপাদনে V2O5 প্রভাবক হিসেবে কাজ করে।' },
  { n: 24, sym: 'Cr', nameBn: 'ক্রোমিয়াম', nameEn: 'Chromium', mass: 51.996, group: 6, period: 4, block: 'd', cat: 'transition', state: 'Solid', en: 1.66, val: 3, ec: '[Ar] 3d⁵ 4s¹ (ব্যতিক্রম)', shells: [2, 8, 13, 1], subshells: [{ name: '3d', cap: 10, count: 5 }, { name: '4s', cap: 2, count: 1 }], desc: '⚠️ আউফবাউ নিয়মের ব্যতিক্রম! অর্ধপূর্ণ d⁵ অরবিটালের প্রতিসাম্য ও উচ্চ স্থিতিশীলতার জন্য বিন্যাসটি [Ar] 3d⁵ 4s¹ হয়।' },
  { n: 25, sym: 'Mn', nameBn: 'ম্যাঙ্গানিজ', nameEn: 'Manganese', mass: 54.938, group: 7, period: 4, block: 'd', cat: 'transition', state: 'Solid', en: 1.55, val: 2, ec: '[Ar] 3d⁵ 4s²', shells: [2, 8, 13, 2], subshells: [{ name: '3d', cap: 10, count: 5 }, { name: '4s', cap: 2, count: 2 }], desc: 'KMnO4 তীব্র জারক পদার্থ হিসেবে পরিচিত।' },
  { n: 26, sym: 'Fe', nameBn: 'আয়রন (লোহা)', nameEn: 'Iron', mass: 55.845, group: 8, period: 4, block: 'd', cat: 'transition', state: 'Solid', en: 1.83, val: 2, ec: '[Ar] 3d⁶ 4s²', shells: [2, 8, 14, 2], subshells: [{ name: '3d', cap: 10, count: 6 }, { name: '4s', cap: 2, count: 2 }], desc: 'রক্তের হিমোগ্লোবিন এবং ফেরোম্যাগনেটিক ধাতু (২৬টি প্রোটন ও ৩০টি নিউট্রন)।' },
  { n: 27, sym: 'Co', nameBn: 'কোবাল্ট', nameEn: 'Cobalt', mass: 58.933, group: 9, period: 4, block: 'd', cat: 'transition', state: 'Solid', en: 1.88, val: 2, ec: '[Ar] 3d⁷ 4s²', shells: [2, 8, 15, 2], subshells: [{ name: '3d', cap: 10, count: 7 }, { name: '4s', cap: 2, count: 2 }], desc: 'ভিটামিন বি-১২ এর কেন্দ্রীয় মৌল; Co-60 রেডিওথেরাপিতে ব্যবহৃত।' },
  { n: 28, sym: 'Ni', nameBn: 'নিকেল', nameEn: 'Nickel', mass: 58.693, group: 10, period: 4, block: 'd', cat: 'transition', state: 'Solid', en: 1.91, val: 2, ec: '[Ar] 3d⁸ 4s²', shells: [2, 8, 16, 2], subshells: [{ name: '3d', cap: 10, count: 8 }, { name: '4s', cap: 2, count: 2 }], desc: 'তেল থেকে ঘি তৈরির হাইড্রোজিনেশন বিক্রিয়ার বিখ্যাত প্রভাবক।' },
  { n: 29, sym: 'Cu', nameBn: 'কপার (তামা)', nameEn: 'Copper', mass: 63.546, group: 11, period: 4, block: 'd', cat: 'transition', state: 'Solid', en: 1.90, val: 2, ec: '[Ar] 3d¹⁰ 4s¹ (ব্যতিক্রম)', shells: [2, 8, 18, 1], subshells: [{ name: '3d', cap: 10, count: 10 }, { name: '4s', cap: 2, count: 1 }], desc: '⚠️ আউফবাউ নিয়মের ব্যতিক্রম! পূর্ণ d¹⁰ অরবিটালের অধিক স্থিতিশীলতার জন্য বিন্যাসটি [Ar] 3d¹⁰ 4s¹ হয়।' },
  { n: 30, sym: 'Zn', nameBn: 'জিঙ্ক (দস্তা)', nameEn: 'Zinc', mass: 65.38, group: 12, period: 4, block: 'd', cat: 'transition', state: 'Solid', en: 1.65, val: 2, ec: '[Ar] 3d¹⁰ 4s²', shells: [2, 8, 18, 2], subshells: [{ name: '3d', cap: 10, count: 10 }, { name: '4s', cap: 2, count: 2 }], desc: 'গ্যালভানাইজিং ও রোগ প্রতিরোধ ক্ষমতা বৃদ্ধিতে অপরিহার্য।' },
  { n: 35, sym: 'Br', nameBn: 'ব্রোমিন', nameEn: 'Bromine', mass: 79.904, group: 17, period: 4, block: 'p', cat: 'halogen', state: 'Liquid', en: 2.96, val: 1, ec: '[Ar] 3d¹⁰ 4s² 4p⁵', shells: [2, 8, 18, 7], subshells: [{ name: '4s', cap: 2, count: 2 }, { name: '4p', cap: 6, count: 5 }], desc: 'একমাত্র স্বাভাবিক তাপমাত্রায় তরল লালচে-বাদামি অধাতু।' },
  { n: 47, sym: 'Ag', nameBn: 'সিলভার (রূপা)', nameEn: 'Silver', mass: 107.87, group: 11, period: 5, block: 'd', cat: 'transition', state: 'Solid', en: 1.93, val: 1, ec: '[Kr] 4d¹⁰ 5s¹ (ব্যতিক্রম)', shells: [2, 8, 18, 18, 1], subshells: [{ name: '4d', cap: 10, count: 10 }, { name: '5s', cap: 2, count: 1 }], desc: 'সর্বোচ্চ বিদ্যুৎ ও তাপ পরিবাহী ধাতু; পূর্ণ d¹⁰ ব্যতিক্রমী বিন্যাস।' },
  { n: 79, sym: 'Au', nameBn: 'গোল্ড (স্বর্ণ)', nameEn: 'Gold', mass: 196.97, group: 11, period: 6, block: 'd', cat: 'transition', state: 'Solid', en: 2.54, val: 3, ec: '[Xe] 4f¹⁴ 5d¹⁰ 6s¹', shells: [2, 8, 18, 32, 18, 1], subshells: [{ name: '5d', cap: 10, count: 10 }, { name: '6s', cap: 2, count: 1 }], desc: 'অভিজাত ধাতু; অম্লরাজ (Aqua Regia) ছাড়া সাধারণ এসিডে দ্রবীভূত হয় না।' },
  { n: 80, sym: 'Hg', nameBn: 'মার্কারি (পারদ)', nameEn: 'Mercury', mass: 200.59, group: 12, period: 6, block: 'd', cat: 'transition', state: 'Liquid', en: 2.00, val: 2, ec: '[Xe] 4f¹⁴ 5d¹⁰ 6s²', shells: [2, 8, 18, 32, 18, 2], subshells: [{ name: '5d', cap: 10, count: 10 }, { name: '6s', cap: 2, count: 2 }], desc: 'একমাত্র স্বাভাবিক তাপমাত্রায় তরল ধাতব মৌল।' },
  { n: 92, sym: 'U', nameBn: 'ইউরেনিয়াম', nameEn: 'Uranium', mass: 238.03, group: 3, period: 7, block: 'f', cat: 'actinide', state: 'Solid', en: 1.38, val: 6, ec: '[Rn] 5f³ 6d¹ 7s²', shells: [2, 8, 18, 32, 21, 9, 2], subshells: [{ name: '5f', cap: 14, count: 3 }, { name: '6d', cap: 10, count: 1 }, { name: '7s', cap: 2, count: 2 }], desc: 'পারমাণবিক চুল্লি ও পারমাণবিক বোমার প্রধান তেজস্ক্রিয় জ্বালানি।' }
];

export default function ElectronConfigurationVisualizer() {
  const [selectedZ, setSelectedZ] = useState(26); // Default: Iron (Fe)
  const [isRotating, setIsRotating] = useState(true);
  const [viewMode, setViewMode] = useState('atom'); // 'atom' | 'nucleus'
  const [isExporting, setIsExporting] = useState(false);
  const flashcardRef = useRef(null);

  // Active element calculation
  const element = useMemo(() => {
    return ELEMENTS_DB.find((e) => e.n === selectedZ) || ELEMENTS_DB[0];
  }, [selectedZ]);

  // Nucleon calculations
  const protonCount = element.n;
  const massNumber = Math.round(element.mass);
  const neutronCount = Math.max(0, massNumber - protonCount);

  // Generate 3D-like dense packed cluster points for Zoomed Nucleus
  const nucleusCluster = useMemo(() => {
    const totalNucleons = protonCount + neutronCount;
    // Cap visual spheres to 90 for optimal performance while preserving ratio
    const visualTotal = Math.min(totalNucleons, 75);
    const protonRatio = protonCount / totalNucleons;
    const visualProtons = Math.round(visualTotal * protonRatio);
    const visualNeutrons = visualTotal - visualProtons;

    const list = [];
    // Distribute Protons (Red) and Neutrons (Gray)
    for (let i = 0; i < visualProtons; i++) list.push({ type: 'P', label: 'p⁺' });
    for (let i = 0; i < visualNeutrons; i++) list.push({ type: 'N', label: 'n⁰' });

    // Shuffle deterministically
    const seedShuffle = (arr) => {
      const seeded = [...arr];
      let seed = selectedZ * 37;
      for (let i = seeded.length - 1; i > 0; i--) {
        seed = (seed * 9301 + 49297) % 233280;
        const j = Math.floor((seed / 233280) * (i + 1));
        [seeded[i], seeded[j]] = [seeded[j], seeded[i]];
      }
      return seeded;
    };
    const shuffled = seedShuffle(list);

    // Compute 2.5D concentric spiral sphere distribution
    return shuffled.map((item, idx) => {
      const phi = idx * 137.5 * (Math.PI / 180); // Golden angle
      const r = Math.sqrt(idx + 1) * 12.5; // Packing radius
      const x = Math.cos(phi) * r;
      const y = Math.sin(phi) * r;
      const depth = Math.sin(idx * 2.3) * 0.4 + 0.8; // Z-depth scale
      return {
        id: idx,
        type: item.type,
        label: item.label,
        x,
        y,
        depth
      };
    });
  }, [protonCount, neutronCount, selectedZ]);

  // Unpaired electrons and magnetic behavior
  const magneticInfo = useMemo(() => {
    let unpairedCount = 0;
    element.subshells.forEach((sub) => {
      let boxCount = 1;
      if (sub.name.includes('p')) boxCount = 3;
      else if (sub.name.includes('d')) boxCount = 5;
      else if (sub.name.includes('f')) boxCount = 7;

      for (let i = 0; i < boxCount; i++) {
        const hasUp = sub.count > i;
        const hasDown = sub.count > (i + boxCount);
        if (hasUp && !hasDown) unpairedCount++;
      }
    });

    return {
      unpairedCount,
      isParamagnetic: unpairedCount > 0,
      propertyBn: unpairedCount > 0 ? 'প্যারাম্যাগনেটিক (চৌম্বক ক্ষেত্র দ্বারা আকর্ষিত হয়)' : 'ডায়াম্যাগনেটিক (চৌম্বক ক্ষেত্র দ্বারা বিকর্ষিত হয়)',
      propertyEn: unpairedCount > 0 ? 'Paramagnetic' : 'Diamagnetic'
    };
  }, [element]);

  // Handle Export Flashcard
  const handleExport = async () => {
    if (!flashcardRef.current) return;
    setIsExporting(true);
    try {
      await exportBrandedGraphic(flashcardRef.current, {
        fileName: `NextGen_Bohr_Nucleus_${element.sym}_${element.nameEn}`,
        cardTitle: `বোর মডেল ও নিউক্লিয়াস ফ্ল্যাশকার্ড: ${element.nameBn} (${element.sym})`,
        scale: 2
      });
    } catch (err) {
      console.error('Failed to export graphic:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header Card */}
      <div className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-3xl shadow-xl text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="p-3.5 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shadow-inner">
            <Atom className="w-9 h-9 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black text-white">ডাইনামিক বোর পরমাণু মডেল ও নিউক্লিয়াস সিমুলেটর</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold font-mono">
                Bohr Multi-Orbit & Nucleus 3D
              </span>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              শক্তিস্তরে ঘূর্ণায়মান ইলেকট্রন অরবিট (K, L, M, N), কেন্দ্রস্থ নিউক্লিয়াসের অভ্যন্তরীণ প্রোটন-নিউট্রন ক্লাস্টার ও হুন্ডের অরবিটাল স্পিন
            </p>
          </div>
        </div>

        {/* Quick Stepper Controller */}
        <div className="flex items-center gap-2 bg-slate-950/80 p-2 rounded-2xl border border-slate-800 shadow-inner">
          <button
            type="button"
            onClick={() => setSelectedZ((prev) => Math.max(1, prev - 1))}
            disabled={selectedZ <= 1}
            className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-white font-black text-sm flex items-center justify-center transition-all"
          >
            -
          </button>
          <div className="px-3 text-center">
            <span className="text-[10px] text-slate-400 font-bold block">পারমাণবিক সংখ্যা</span>
            <span className="text-sm font-mono font-black text-cyan-400">Z = {element.n}</span>
          </div>
          <button
            type="button"
            onClick={() => setSelectedZ((prev) => Math.min(92, prev + 1))}
            className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-black text-sm flex items-center justify-center transition-all"
          >
            +
          </button>
        </div>
      </div>

      {/* Control Bar: Element Selector Dropdown & Slider & Mode Switch */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg">
        {/* Dropdown Selector */}
        <div className="w-full md:w-80">
          <label className="text-xs font-bold text-slate-400 block mb-1">মৌল নির্বাচন করুন (Select Chemical Element):</label>
          <select
            value={selectedZ}
            onChange={(e) => setSelectedZ(Number(e.target.value))}
            className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono"
          >
            {ELEMENTS_DB.map((el) => (
              <option key={el.n} value={el.n}>
                Z = {el.n} • {el.nameBn} ({el.sym} - {el.nameEn}) • {el.ec}
              </option>
            ))}
          </select>
        </div>

        {/* Atomic Number Slider */}
        <div className="w-full md:flex-1 px-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-1">
            <span>স্লাইডার দিয়ে দ্রুত মৌল পরিবর্তন:</span>
            <span className="text-cyan-400 font-mono font-bold">{element.nameBn} ({element.sym}) — Z={element.n}, A={massNumber}</span>
          </div>
          <input
            type="range"
            min="1"
            max="92"
            value={selectedZ}
            onChange={(e) => setSelectedZ(Number(e.target.value))}
            className="w-full accent-cyan-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
          />
        </div>

        {/* Export Button */}
        <button
          type="button"
          onClick={handleExport}
          disabled={isExporting}
          className="w-full md:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-cyan-600/30 flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
        >
          {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          <span>ফ্ল্যাশকার্ড ডাউনলোড</span>
        </button>
      </div>

      {/* Main Interactive Stage */}
      <div
        ref={flashcardRef}
        className="bg-slate-900 border-2 border-cyan-500/40 rounded-3xl p-6 sm:p-8 text-white shadow-2xl space-y-6 relative overflow-hidden"
      >
        {/* Element Header Card */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 text-cyan-300 border-2 border-cyan-500/40 flex flex-col items-center justify-center font-mono font-black shadow-lg">
              <span className="text-2xl leading-none">{element.sym}</span>
              <span className="text-[10px] mt-0.5 opacity-80">Z={element.n}</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-2xl text-white">{element.nameBn} ({element.nameEn})</h3>
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-xs font-bold border border-cyan-500/30">
                  {element.cat.toUpperCase()}
                </span>
                {element.ec.includes('ব্যতিক্রম') && (
                  <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-bold animate-pulse">
                    ⚠️ ব্যতিক্রমী বিন্যাস
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 font-mono mt-1">
                গ্রুপ: {element.group} • পর্যায়: {element.period} • ব্লক: {element.block.toUpperCase()} • ভর: {element.mass} u (ভর সংখ্যা: {massNumber})
              </p>
            </div>
          </div>

          {/* View Mode Toggle: Atom Orbits vs. Zoomed Nucleus Cluster */}
          <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 text-xs font-bold shadow-inner">
            <button
              type="button"
              onClick={() => setViewMode('atom')}
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                viewMode === 'atom' ? 'bg-cyan-600 text-white shadow-md font-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Atom className="w-3.5 h-3.5" />
              <span>বোর অরবিট ভিউ</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('nucleus')}
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                viewMode === 'nucleus' ? 'bg-rose-600 text-white shadow-md font-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              <ZoomIn className="w-3.5 h-3.5" />
              <span>🔍 নিউক্লিয়াস জুম ভিউ (P+N)</span>
            </button>

            <button
              type="button"
              onClick={() => setIsRotating((r) => !r)}
              className={`px-3 py-2 rounded-xl border text-xs font-bold flex items-center gap-1 transition-all ${
                isRotating
                  ? 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              }`}
              title="অরবিট ঘূর্ণন চালু বা বন্ধ করুন"
            >
              {isRotating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* 2-Column Core Architecture */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column (5 Cols): Dynamic Simulation Stage (Atom Orbits OR Zoomed Nucleus Cluster) */}
          <div className="lg:col-span-5 p-6 rounded-3xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-between shadow-inner relative overflow-hidden min-h-[380px]">
            {/* Stage Header */}
            <div className="w-full flex items-center justify-between z-10">
              <span className="text-xs font-black text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                {viewMode === 'atom' ? (
                  <>
                    <Atom className="w-4 h-4 text-cyan-400 animate-spin-slow" />
                    বোর অরবিট ইলেকট্রন ডিস্ট্রিবিউশন
                  </>
                ) : (
                  <>
                    <ZoomIn className="w-4 h-4 text-rose-400 animate-pulse" />
                    নিউক্লিয়াসের অভ্যন্তরীণ প্রোটন ও নিউট্রন ক্লাস্টার
                  </>
                )}
              </span>
              <span className="text-[10px] text-slate-400 font-mono font-bold">
                {viewMode === 'atom' ? `শেল: ${element.shells?.length || 1}টি` : `মোট নিউক্লিয়ন: ${massNumber}টি`}
              </span>
            </div>

            {/* VIEW MODE 1: BOHR CONCENTRIC ORBITS VIEW */}
            {viewMode === 'atom' && (
              <div className="relative w-64 h-64 flex items-center justify-center my-3">
                {/* Central Nucleus with Click-to-Zoom */}
                <button
                  type="button"
                  onClick={() => setViewMode('nucleus')}
                  title="ক্লিক করে নিউক্লিয়াসের ভেতরের প্রোটন ও নিউট্রন জুম করুন"
                  className="w-16 h-16 rounded-full bg-gradient-to-tr from-rose-500 via-amber-400 to-rose-600 flex flex-col items-center justify-center text-[10px] font-black text-slate-950 shadow-2xl shadow-rose-500/50 z-20 animate-pulse border-2 border-white/50 text-center hover:scale-110 transition-transform cursor-pointer group"
                >
                  <span className="font-mono font-black text-xs leading-none group-hover:hidden">{element.sym}</span>
                  <span className="text-[8px] font-mono leading-none mt-0.5 font-bold group-hover:hidden">p={protonCount}</span>
                  <span className="text-[8px] font-bold hidden group-hover:block text-slate-950 leading-tight">🔍 জুম ইন</span>
                </button>

                {/* Concentric Bohr Shells (K, L, M, N, O, P, Q) */}
                {element.shells?.map((count, sIdx) => {
                  const size = 76 + (sIdx + 1) * 34;
                  const shellNames = ['K', 'L', 'M', 'N', 'O', 'P', 'Q'];
                  const shellColors = ['border-cyan-500/50', 'border-indigo-500/50', 'border-emerald-500/50', 'border-amber-500/50', 'border-rose-500/50', 'border-purple-500/50', 'border-teal-500/50'];
                  const spinClass = isRotating ? (sIdx % 2 === 0 ? 'animate-spin-slow' : 'animate-spin-reverse') : '';

                  return (
                    <div
                      key={sIdx}
                      style={{ width: `${size}px`, height: `${size}px` }}
                      className={`absolute rounded-full border ${shellColors[sIdx % shellColors.length]} ${spinClass} flex items-center justify-center`}
                    >
                      {/* Orbiting Electron Spheres */}
                      {Array.from({ length: Math.min(count, 18) }).map((_, eIdx) => {
                        const angle = (eIdx / Math.min(count, 18)) * 2 * Math.PI;
                        const radius = size / 2;
                        const x = Math.cos(angle) * radius;
                        const y = Math.sin(angle) * radius;

                        return (
                          <div
                            key={eIdx}
                            style={{
                              transform: `translate(${x}px, ${y}px)`
                            }}
                            className="absolute w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-md shadow-cyan-400/90 border border-white"
                          />
                        );
                      })}
                      <span className="absolute -top-3 text-[9px] font-bold text-slate-500 font-mono">
                        {shellNames[sIdx]} ({count})
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* VIEW MODE 2: ZOOMED NUCLEUS INTERNAL CLUSTER VIEW */}
            {viewMode === 'nucleus' && (
              <div className="relative w-64 h-64 flex items-center justify-center my-3 bg-radial-glow">
                {/* Visual Nucleus Boundary Shell */}
                <div className="absolute w-56 h-56 rounded-full border border-dashed border-rose-500/30 bg-rose-950/20 animate-pulse pointer-events-none" />

                {/* Nucleus Particle Cluster */}
                <div className="relative w-48 h-48 flex items-center justify-center">
                  {nucleusCluster.map((particle) => (
                    <div
                      key={particle.id}
                      style={{
                        transform: `translate(${particle.x}px, ${particle.y}px) scale(${particle.depth})`,
                        zIndex: Math.round(particle.depth * 10)
                      }}
                      className={`absolute w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-black text-white shadow-md transition-transform hover:scale-125 cursor-pointer ${
                        particle.type === 'P'
                          ? 'bg-gradient-to-tr from-red-600 via-rose-500 to-amber-400 border border-rose-200 shadow-rose-600/60'
                          : 'bg-gradient-to-tr from-slate-600 via-slate-400 to-slate-200 border border-slate-300 text-slate-950 shadow-slate-600/60'
                      }`}
                      title={`${particle.type === 'P' ? 'প্রোটন (Proton): চার্জ +1e, ভর ~1 u' : 'নিউট্রন (Neutron): চার্জ 0, ভর ~1 u'}`}
                    >
                      {particle.label}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bottom Info Bar */}
            <div className="w-full space-y-2 z-10">
              {viewMode === 'atom' ? (
                <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400 font-bold">শক্তিস্তরে বণ্টন:</span>
                  <div className="flex items-center gap-1.5">
                    {element.shells?.map((count, idx) => {
                      const shellNames = ['K (n=1)', 'L (n=2)', 'M (n=3)', 'N (n=4)', 'O (n=5)', 'P (n=6)', 'Q (n=7)'];
                      return (
                        <span key={idx} className="px-2 py-0.5 rounded-lg bg-cyan-950 text-cyan-300 border border-cyan-800 text-xs font-bold" title={`${shellNames[idx]}: ${count} electrons`}>
                          {count}
                        </span>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400 font-bold">কণা সংক্ষেপ:</span>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-lg bg-rose-950 text-rose-300 border border-rose-800 text-xs font-bold">
                      🔴 P = {protonCount}
                    </span>
                    <span className="px-2 py-0.5 rounded-lg bg-slate-800 text-slate-200 border border-slate-700 text-xs font-bold">
                      ⚪ N = {neutronCount}
                    </span>
                    <span className="px-2 py-0.5 rounded-lg bg-amber-950 text-amber-300 border border-amber-800 text-xs font-bold">
                      ⚖️ A = {massNumber}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column (7 Cols): Nucleon Badges, Aufbau Subshell Notation & Hund's Rule Box Spin Diagram */}
          <div className="lg:col-span-7 space-y-4">
            {/* Dynamic Nucleon Breakdown Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              <div className="p-3 rounded-2xl bg-slate-950 border border-rose-500/40 shadow-sm">
                <span className="text-[10px] text-rose-300 block font-bold uppercase tracking-wider flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-rose-500 inline-block animate-pulse"></span>
                  প্রোটন (Protons, p⁺)
                </span>
                <strong className="text-lg font-black text-rose-400 font-mono mt-0.5 block">{protonCount} টি</strong>
                <span className="text-[9px] text-slate-400 font-mono">আধান: +{protonCount}e</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-600/50 shadow-sm">
                <span className="text-[10px] text-slate-300 block font-bold uppercase tracking-wider flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-slate-400 inline-block"></span>
                  নিউট্রন (Neutrons, n⁰)
                </span>
                <strong className="text-lg font-black text-slate-200 font-mono mt-0.5 block">{neutronCount} টি</strong>
                <span className="text-[9px] text-slate-400 font-mono">A - Z = {massNumber} - {protonCount}</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950 border border-cyan-500/40 shadow-sm">
                <span className="text-[10px] text-cyan-300 block font-bold uppercase tracking-wider flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block"></span>
                  ইলেকট্রন (Electrons, e⁻)
                </span>
                <strong className="text-lg font-black text-cyan-400 font-mono mt-0.5 block">{protonCount} টি</strong>
                <span className="text-[9px] text-slate-400 font-mono">আধান: -{protonCount}e</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950 border border-amber-500/40 shadow-sm">
                <span className="text-[10px] text-amber-300 block font-bold uppercase tracking-wider flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-400 inline-block"></span>
                  ভর সংখ্যা (Mass No, A)
                </span>
                <strong className="text-lg font-black text-amber-400 font-mono mt-0.5 block">{massNumber}</strong>
                <span className="text-[9px] text-slate-400 font-mono">p⁺ + n⁰ = {massNumber}</span>
              </div>
            </div>

            {/* Expanded Electronic Configuration Notation */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 shadow-inner">
              <span className="text-xs font-black text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                আউফবাউ উপস্তর ইলেকট্রন বিন্যাস (Aufbau Notation)
              </span>
              <p className="font-mono text-base font-black text-cyan-300 tracking-wide bg-slate-900/90 p-3 rounded-xl border border-slate-800 shadow-sm">
                {element.ec}
              </p>
            </div>

            {/* Subshell Orbital Spin Boxes (Hund's Rule) */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 shadow-inner">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-400" />
                  হুন্ডের নীতি ও অরবিটাল স্পিন ডায়াগ্রাম (Hund's Rule)
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  অযুগ্ম ইলেকট্রন: <strong className="text-cyan-400 font-bold">{magneticInfo.unpairedCount}টি</strong>
                </span>
              </div>

              {/* Orbital Spin Boxes */}
              <div className="flex flex-wrap items-center gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800 overflow-x-auto">
                {element.subshells?.map((sub, sIdx) => {
                  let boxCount = 1;
                  let subLabels = ['s'];
                  if (sub.name.includes('p')) {
                    boxCount = 3;
                    subLabels = ['px', 'py', 'pz'];
                  } else if (sub.name.includes('d')) {
                    boxCount = 5;
                    subLabels = ['dxy', 'dyz', 'dzx', 'dx2-y2', 'dz2'];
                  } else if (sub.name.includes('f')) {
                    boxCount = 7;
                    subLabels = ['f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7'];
                  }

                  const boxes = [];
                  for (let i = 0; i < boxCount; i++) {
                    const hasSpinUp = sub.count > i;
                    const hasSpinDown = sub.count > (i + boxCount);
                    boxes.push({
                      id: i,
                      label: subLabels[i],
                      hasSpinUp,
                      hasSpinDown,
                      isFull: hasSpinUp && hasSpinDown,
                      isUnpaired: hasSpinUp && !hasSpinDown
                    });
                  }

                  return (
                    <div key={sIdx} className="flex flex-col items-center gap-1">
                      <div className="flex items-center gap-1.5 p-1.5 rounded-xl bg-slate-950/80 border border-slate-700/80 shadow-inner">
                        {boxes.map((box) => (
                          <div
                            key={box.id}
                            className={`w-9 h-11 rounded-lg border flex flex-col items-center justify-center relative transition-all ${
                              box.isFull
                                ? 'border-cyan-500/60 bg-cyan-950/40 shadow-sm shadow-cyan-500/20'
                                : box.isUnpaired
                                ? 'border-emerald-500/60 bg-emerald-950/30'
                                : 'border-slate-700/60 bg-slate-900/50 border-dashed'
                            }`}
                          >
                            <div className="flex items-center justify-center gap-0.5">
                              {box.hasSpinUp && (
                                <span className="text-cyan-400 font-bold text-base leading-none" title="Spin Up (+1/2)">
                                  ↑
                                </span>
                              )}
                              {box.hasSpinDown && (
                                <span className="text-amber-400 font-bold text-base leading-none" title="Spin Down (-1/2)">
                                  ↓
                                </span>
                              )}
                              {!box.hasSpinUp && !box.hasSpinDown && (
                                <span className="text-[10px] text-slate-600 font-mono">-</span>
                              )}
                            </div>
                            <span className="text-[7px] text-slate-500 font-mono mt-0.5">{box.label}</span>
                          </div>
                        ))}
                      </div>
                      <span className="text-[10px] font-bold text-slate-300 font-mono bg-slate-800/80 px-2 py-0.5 rounded-full border border-slate-700">
                        {sub.name}<sup>{sub.count}</sup>
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Spin Legends */}
              <div className="flex items-center gap-4 text-[10px] text-slate-400 pt-1">
                <div className="flex items-center gap-1">
                  <span className="text-cyan-400 font-bold text-xs">↑</span>
                  <span>Spin Up (ms = +1/2)</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-amber-400 font-bold text-xs">↓</span>
                  <span>Spin Down (ms = -1/2)</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded border border-dashed border-slate-600 bg-slate-900 inline-block"></span>
                  <span>ফাঁকা অরবিটাল</span>
                </div>
              </div>
            </div>

            {/* Magnetic Property & Chemical Properties Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-bold">চৌম্বক ধর্ম (Magnetic Property):</span>
                <strong className={`font-mono text-sm block mt-0.5 ${magneticInfo.isParamagnetic ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {magneticInfo.propertyEn}
                </strong>
                <span className="text-[10px] text-slate-400 block truncate">{magneticInfo.propertyBn}</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-bold">তড়িৎ-ঋণাত্মকতা (Electronegativity):</span>
                <strong className="text-cyan-400 font-mono text-sm block mt-0.5">{element.en || 'N/A'}</strong>
                <span className="text-[10px] text-slate-400">Pauling Scale</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-bold">যোজনী (Valency):</span>
                <strong className="text-emerald-400 font-mono text-sm block mt-0.5">{element.val}</strong>
                <span className="text-[10px] text-slate-400">সর্বশেষ স্তরের যোজন ইলেকট্রন</span>
              </div>
            </div>

            {/* Board Exam Note */}
            <div className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 text-xs text-emerald-100 flex items-start gap-2.5">
              <Brain className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-emerald-300 block font-black mb-0.5">বোর্ড পরীক্ষার স্মার্ট নোট (NCTB Keynote):</strong>
                <p className="text-emerald-100/90 leading-relaxed text-[11px]">{element.desc}</p>
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
