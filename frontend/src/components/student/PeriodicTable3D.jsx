import React, { useState, useRef, useMemo } from 'react';
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
  Filter,
  CheckCircle2,
  Rotate3d,
  ChevronRight,
  HelpCircle,
  TrendingUp,
  Brain,
  Sliders,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  ZoomIn,
  ZoomOut
} from 'lucide-react';
import { exportBrandedGraphic } from '../../utils/exportBrandedGraphic';

// =========================================================================
// 1. COMPREHENSIVE PERIODIC TABLE DATASET (CORE & EXTENDED REPRESENTATIVES)
// =========================================================================
const ALL_ELEMENTS = [
  // Period 1
  { n: 1, sym: 'H', nameBn: 'হাইড্রোজেন', nameEn: 'Hydrogen', mass: '1.008', group: 1, period: 1, block: 's', cat: 'nonmetal', state: 'Gas', en: 2.20, val: '1', ec: '1s¹', shells: [1], subshells: [{ name: '1s', cap: 2, count: 1 }], desc: 'মহাবিশ্বের সর্বাধিক প্রাচুর্যপূর্ণ মৌলিক গ্যাস।' },
  { n: 2, sym: 'He', nameBn: 'হিলিয়াম', nameEn: 'Helium', mass: '4.0026', group: 18, period: 1, block: 's', cat: 'noble', state: 'Gas', en: 0, val: '0', ec: '1s²', shells: [2], subshells: [{ name: '1s', cap: 2, count: 2 }], desc: 'নিষ্ক্রিয় গ্যাস, হালকা এবং অদাহ্য।' },

  // Period 2
  { n: 3, sym: 'Li', nameBn: 'লিথিয়াম', nameEn: 'Lithium', mass: '6.94', group: 1, period: 2, block: 's', cat: 'alkali', state: 'Solid', en: 0.98, val: '1', ec: '1s² 2s¹', shells: [2, 1], subshells: [{ name: '1s', cap: 2, count: 2 }, { name: '2s', cap: 2, count: 1 }], desc: 'সবচেয়ে হালকা ক্ষার ধাতু, ব্যাটারিতে শীর্ষ ব্যবহৃত।' },
  { n: 4, sym: 'Be', nameBn: 'বেরিলিয়াম', nameEn: 'Beryllium', mass: '9.0122', group: 2, period: 2, block: 's', cat: 'alkaline', state: 'Solid', en: 1.57, val: '2', ec: '1s² 2s²', shells: [2, 2], subshells: [{ name: '1s', cap: 2, count: 2 }, { name: '2s', cap: 2, count: 2 }], desc: 'মৃৎক্ষার ধাতু, সংকর ধাতু ও এক্স-রে জানালায় ব্যবহৃত।' },
  { n: 5, sym: 'B', nameBn: 'বোরন', nameEn: 'Boron', mass: '10.81', group: 13, period: 2, block: 'p', cat: 'metalloid', state: 'Solid', en: 2.04, val: '3', ec: '1s² 2s² 2p¹', shells: [2, 3], subshells: [{ name: '1s', cap: 2, count: 2 }, { name: '2s', cap: 2, count: 2 }, { name: '2p', cap: 6, count: 1 }], desc: 'অপধাতু, কাচ ও সিরামিক শিল্পে বোরিক এসিড হিসেবে ব্যবহৃত।' },
  { n: 6, sym: 'C', nameBn: 'কার্বন', nameEn: 'Carbon', mass: '12.011', group: 14, period: 2, block: 'p', cat: 'nonmetal', state: 'Solid', en: 2.55, val: '2, 4', ec: '1s² 2s² 2p²', shells: [2, 4], subshells: [{ name: '1s', cap: 2, count: 2 }, { name: '2s', cap: 2, count: 2 }, { name: '2p', cap: 6, count: 2 }], desc: 'জৈব রসায়নের ভিত্তি; হীরা ও গ্রাফাইটের মূল উপাদান।' },
  { n: 7, sym: 'N', nameBn: 'নাইট্রোজেন', nameEn: 'Nitrogen', mass: '14.007', group: 15, period: 2, block: 'p', cat: 'nonmetal', state: 'Gas', en: 3.04, val: '3, 5', ec: '1s² 2s² 2p³', shells: [2, 5], subshells: [{ name: '1s', cap: 2, count: 2 }, { name: '2s', cap: 2, count: 2 }, { name: '2p', cap: 6, count: 3 }], desc: 'বায়ুমণ্ডলের ৭৮% গ্যাস; প্রোটিন ও সারের অপরিহার্য উপাদান।' },
  { n: 8, sym: 'O', nameBn: 'অক্সিজেন', nameEn: 'Oxygen', mass: '15.999', group: 16, period: 2, block: 'p', cat: 'nonmetal', state: 'Gas', en: 3.44, val: '2', ec: '1s² 2s² 2p⁴', shells: [2, 6], subshells: [{ name: '1s', cap: 2, count: 2 }, { name: '2s', cap: 2, count: 2 }, { name: '2p', cap: 6, count: 4 }], desc: 'জীবদেহের শ্বসন ও বায়বীয় দহনের মূল সহায়ক মৌল।' },
  { n: 9, sym: 'F', nameBn: 'ফ্লোরিন', nameEn: 'Fluorine', mass: '18.998', group: 17, period: 2, block: 'p', cat: 'halogen', state: 'Gas', en: 3.98, val: '1', ec: '1s² 2s² 2p⁵', shells: [2, 7], subshells: [{ name: '1s', cap: 2, count: 2 }, { name: '2s', cap: 2, count: 2 }, { name: '2p', cap: 6, count: 5 }], desc: 'পর্যায় সারণির সর্বাধিক তড়িৎ-ঋণাত্মক মৌল।' },
  { n: 10, sym: 'Ne', nameBn: 'নিয়ন', nameEn: 'Neon', mass: '20.180', group: 18, period: 2, block: 'p', cat: 'noble', state: 'Gas', en: 0, val: '0', ec: '1s² 2s² 2p⁶', shells: [2, 8], subshells: [{ name: '1s', cap: 2, count: 2 }, { name: '2s', cap: 2, count: 2 }, { name: '2p', cap: 6, count: 6 }], desc: 'নিষ্ক্রিয় গ্যাস; নিয়ন সাইন ও বিজ্ঞাপন আলোতে ব্যবহৃত।' },

  // Period 3
  { n: 11, sym: 'Na', nameBn: 'সোডিয়াম', nameEn: 'Sodium', mass: '22.990', group: 1, period: 3, block: 's', cat: 'alkali', state: 'Solid', en: 0.93, val: '1', ec: '[Ne] 3s¹', shells: [2, 8, 1], subshells: [{ name: '1s', cap: 2, count: 2 }, { name: '2s', cap: 2, count: 2 }, { name: '2p', cap: 6, count: 6 }, { name: '3s', cap: 2, count: 1 }], desc: 'নরম ক্ষার ধাতু; পানিতে তীব্র বিক্রিয়া করে হাইড্রোজেন উৎপন্ন করে।' },
  { n: 12, sym: 'Mg', nameBn: 'ম্যাগনেসিয়াম', nameEn: 'Magnesium', mass: '24.305', group: 2, period: 3, block: 's', cat: 'alkaline', state: 'Solid', en: 1.31, val: '2', ec: '[Ne] 3s²', shells: [2, 8, 2], subshells: [{ name: '1s', cap: 2, count: 2 }, { name: '2s', cap: 2, count: 2 }, { name: '2p', cap: 6, count: 6 }, { name: '3s', cap: 2, count: 2 }], desc: 'উদ্ভিদের ক্লোরোফিলের কেন্দ্রীয় ধাতু; উজ্জ্বল শিখায় জ্বলে।' },
  { n: 13, sym: 'Al', nameBn: 'অ্যালুমিনিয়াম', nameEn: 'Aluminium', mass: '26.982', group: 13, period: 3, block: 'p', cat: 'post-transition', state: 'Solid', en: 1.61, val: '3', ec: '[Ne] 3s² 3p¹', shells: [2, 8, 3], subshells: [{ name: '1s', cap: 2, count: 2 }, { name: '2s', cap: 2, count: 2 }, { name: '2p', cap: 6, count: 6 }, { name: '3s', cap: 2, count: 2 }, { name: '3p', cap: 6, count: 1 }], desc: 'হালকা ও মরিচাহীন সংকর ধাতু তৈরিতে শীর্ষ ব্যবহৃত ধাতু।' },
  { n: 14, sym: 'Si', nameBn: 'সিলিকন', nameEn: 'Silicon', mass: '28.085', group: 14, period: 3, block: 'p', cat: 'metalloid', state: 'Solid', en: 1.90, val: '4', ec: '[Ne] 3s² 3p²', shells: [2, 8, 4], subshells: [{ name: '1s', cap: 2, count: 2 }, { name: '2s', cap: 2, count: 2 }, { name: '2p', cap: 6, count: 6 }, { name: '3s', cap: 2, count: 2 }, { name: '3p', cap: 6, count: 2 }], desc: 'সেমিকন্ডাক্টর, সোলার প্যানেল ও কম্পিউটার প্রসেসরের প্রাণ।' },
  { n: 15, sym: 'P', nameBn: 'ফসফরাস', nameEn: 'Phosphorus', mass: '30.974', group: 15, period: 3, block: 'p', cat: 'nonmetal', state: 'Solid', en: 2.19, val: '3, 5', ec: '[Ne] 3s² 3p³', shells: [2, 8, 5], subshells: [{ name: '1s', cap: 2, count: 2 }, { name: '2s', cap: 2, count: 2 }, { name: '2p', cap: 6, count: 6 }, { name: '3s', cap: 2, count: 2 }, { name: '3p', cap: 6, count: 3 }], desc: 'ডিএনএ ও হাড়ের অন্যতম মূল উপাদান; দেশলাই কাঠিতে ব্যবহৃত।' },
  { n: 16, sym: 'S', nameBn: 'সালফার', nameEn: 'Sulfur', mass: '32.06', group: 16, period: 3, block: 'p', cat: 'nonmetal', state: 'Solid', en: 2.58, val: '2, 4, 6', ec: '[Ne] 3s² 3p⁴', shells: [2, 8, 6], subshells: [{ name: '1s', cap: 2, count: 2 }, { name: '2s', cap: 2, count: 2 }, { name: '2p', cap: 6, count: 6 }, { name: '3s', cap: 2, count: 2 }, { name: '3p', cap: 6, count: 4 }], desc: 'হলুদ রঙের গন্ধক; সালফিউরিক এসিড ও রাবার ভলকানাইজিংয়ে ব্যবহৃত।' },
  { n: 17, sym: 'Cl', nameBn: 'ক্লোরিন', nameEn: 'Chlorine', mass: '35.45', group: 17, period: 3, block: 'p', cat: 'halogen', state: 'Gas', en: 3.16, val: '1, 3, 5, 7', ec: '[Ne] 3s² 3p⁵', shells: [2, 8, 7], subshells: [{ name: '1s', cap: 2, count: 2 }, { name: '2s', cap: 2, count: 2 }, { name: '2p', cap: 6, count: 6 }, { name: '3s', cap: 2, count: 2 }, { name: '3p', cap: 6, count: 5 }], desc: 'পানিশোধন ও জীবাণুনাশক; খাবার লবণ NaCl-এর প্রধান উপাদান।' },
  { n: 18, sym: 'Ar', nameBn: 'আর্গন', nameEn: 'Argon', mass: '39.948', group: 18, period: 3, block: 'p', cat: 'noble', state: 'Gas', en: 0, val: '0', ec: '[Ne] 3s² 3p⁶', shells: [2, 8, 8], subshells: [{ name: '1s', cap: 2, count: 2 }, { name: '2s', cap: 2, count: 2 }, { name: '2p', cap: 6, count: 6 }, { name: '3s', cap: 2, count: 2 }, { name: '3p', cap: 6, count: 6 }], desc: 'বায়ুমণ্ডলের সবচেয়ে সহজলভ্য নিষ্ক্রিয় গ্যাস; বৈদ্যুতিক বাল্বে ব্যবহৃত।' },

  // Period 4
  { n: 19, sym: 'K', nameBn: 'পটাশিয়াম', nameEn: 'Potassium', mass: '39.098', group: 1, period: 4, block: 's', cat: 'alkali', state: 'Solid', en: 0.82, val: '1', ec: '[Ar] 4s¹', shells: [2, 8, 8, 1], subshells: [{ name: '1s', cap: 2, count: 2 }, { name: '2s', cap: 2, count: 2 }, { name: '2p', cap: 6, count: 6 }, { name: '3s', cap: 2, count: 2 }, { name: '3p', cap: 6, count: 6 }, { name: '4s', cap: 2, count: 1 }], desc: 'অত্যাবশ্যকীয় ক্ষার ধাতু সার; স্নায়ু উদ্দীপনা পরিবহনে ভূমিকা রাখে।' },
  { n: 20, sym: 'Ca', nameBn: 'ক্যালসিয়াম', nameEn: 'Calcium', mass: '40.078', group: 2, period: 4, block: 's', cat: 'alkaline', state: 'Solid', en: 1.00, val: '2', ec: '[Ar] 4s²', shells: [2, 8, 8, 2], subshells: [{ name: '1s', cap: 2, count: 2 }, { name: '2s', cap: 2, count: 2 }, { name: '2p', cap: 6, count: 6 }, { name: '3s', cap: 2, count: 2 }, { name: '3p', cap: 6, count: 6 }, { name: '4s', cap: 2, count: 2 }], desc: 'হাড়, দাঁত ও সিমেন্ট-চুনাপাথরের প্রধান গাঠনিক উপাদান।' },
  { n: 21, sym: 'Sc', nameBn: 'স্ক্যান্ডিয়াম', nameEn: 'Scandium', mass: '44.956', group: 3, period: 4, block: 'd', cat: 'transition', state: 'Solid', en: 1.36, val: '3', ec: '[Ar] 3d¹ 4s²', shells: [2, 8, 9, 2], subshells: [{ name: '3d', cap: 10, count: 1 }, { name: '4s', cap: 2, count: 2 }], desc: 'প্রথম ডি-ব্লক মৌল; অ্যালুমিনিয়াম সংকর তৈরিতে ব্যবহৃত।' },
  { n: 22, sym: 'Ti', nameBn: 'টাইটানিয়াম', nameEn: 'Titanium', mass: '47.867', group: 4, period: 4, block: 'd', cat: 'transition', state: 'Solid', en: 1.54, val: '4', ec: '[Ar] 3d² 4s²', shells: [2, 8, 10, 2], subshells: [{ name: '3d', cap: 10, count: 2 }, { name: '4s', cap: 2, count: 2 }], desc: 'ইস্পাতের মতো শক্ত কিন্তু ৪৫% হালকা মহাকাশযান ধাতু।' },
  { n: 23, sym: 'V', nameBn: 'ভ্যানাডিয়াম', nameEn: 'Vanadium', mass: '50.942', group: 5, period: 4, block: 'd', cat: 'transition', state: 'Solid', en: 1.63, val: '2, 3, 4, 5', ec: '[Ar] 3d³ 4s²', shells: [2, 8, 11, 2], subshells: [{ name: '3d', cap: 10, count: 3 }, { name: '4s', cap: 2, count: 2 }], desc: 'সালফিউরিক এসিড তৈরিতে V2O5 প্রভাবক হিসেবে সুপরিচিত।' },
  { n: 24, sym: 'Cr', nameBn: 'ক্রোমিয়াম', nameEn: 'Chromium', mass: '51.996', group: 6, period: 4, block: 'd', cat: 'transition', state: 'Solid', en: 1.66, val: '2, 3, 6', ec: '[Ar] 3d⁵ 4s¹ (ব্যতিক্রম)', shells: [2, 8, 13, 1], subshells: [{ name: '3d', cap: 10, count: 5 }, { name: '4s', cap: 2, count: 1 }], desc: 'আউফবাউ নিয়মের ব্যতিক্রম! অর্ধপূর্ণ d⁵ অরবিটালের অধিক স্থিতিশীলতা।' },
  { n: 25, sym: 'Mn', nameBn: 'ম্যাঙ্গানিজ', nameEn: 'Manganese', mass: '54.938', group: 7, period: 4, block: 'd', cat: 'transition', state: 'Solid', en: 1.55, val: '2, 4, 7', ec: '[Ar] 3d⁵ 4s²', shells: [2, 8, 13, 2], subshells: [{ name: '3d', cap: 10, count: 5 }, { name: '4s', cap: 2, count: 2 }], desc: 'KMnO4 তীব্র জারক পদার্থ তৈরিতে ব্যবহৃত অবস্থান্তর ধাতু।' },
  { n: 26, sym: 'Fe', nameBn: 'আয়রন (লোহা)', nameEn: 'Iron', mass: '55.845', group: 8, period: 4, block: 'd', cat: 'transition', state: 'Solid', en: 1.83, val: '2, 3', ec: '[Ar] 3d⁶ 4s²', shells: [2, 8, 14, 2], subshells: [{ name: '3d', cap: 10, count: 6 }, { name: '4s', cap: 2, count: 2 }], desc: 'রক্তের হিমোগ্লোবিনের মূল ধাতু এবং আধুনিক সভ্যতার মূল মেরুদণ্ড (২৬টি প্রোটন ও ৩০টি নিউট্রন)।' },
  { n: 27, sym: 'Co', nameBn: 'কোবাল্ট', nameEn: 'Cobalt', mass: '58.933', group: 9, period: 4, block: 'd', cat: 'transition', state: 'Solid', en: 1.88, val: '2, 3', ec: '[Ar] 3d⁷ 4s²', shells: [2, 8, 15, 2], subshells: [{ name: '3d', cap: 10, count: 7 }, { name: '4s', cap: 2, count: 2 }], desc: 'ভিটামিন বি-১২ এর কেন্দ্রীয় মৌল; ক্যান্সার থেরাপিতে Co-60 ব্যবহৃত।' },
  { n: 28, sym: 'Ni', nameBn: 'নিকেল', nameEn: 'Nickel', mass: '58.693', group: 10, period: 4, block: 'd', cat: 'transition', state: 'Solid', en: 1.91, val: '2', ec: '[Ar] 3d⁸ 4s²', shells: [2, 8, 16, 2], subshells: [{ name: '3d', cap: 10, count: 8 }, { name: '4s', cap: 2, count: 2 }], desc: 'তেল থেকে ডালডা তৈরির হাইড্রোজিনেশন বিক্রিয়ায় নিকেল প্রভাবক।' },
  { n: 29, sym: 'Cu', nameBn: 'কপার (তামা)', nameEn: 'Copper', mass: '63.546', group: 11, period: 4, block: 'd', cat: 'transition', state: 'Solid', en: 1.90, val: '1, 2', ec: '[Ar] 3d¹⁰ 4s¹ (ব্যতিক্রম)', shells: [2, 8, 18, 1], subshells: [{ name: '3d', cap: 10, count: 10 }, { name: '4s', cap: 2, count: 1 }], desc: 'আউফবাউ নিয়মের ব্যতিক্রম! পূর্ণ d¹⁰ অরবিটালের অধিক স্থিতিশীলতা।' },
  { n: 30, sym: 'Zn', nameBn: 'জিঙ্ক (দস্তা)', nameEn: 'Zinc', mass: '65.38', group: 12, period: 4, block: 'd', cat: 'transition', state: 'Solid', en: 1.65, val: '2', ec: '[Ar] 3d¹⁰ 4s²', shells: [2, 8, 18, 2], subshells: [{ name: '3d', cap: 10, count: 10 }, { name: '4s', cap: 2, count: 2 }], desc: 'লোহায় মরিচা রোধে গ্যালভানাইজিং ও মানবদেহে রোগ প্রতিরোধে কার্যকর।' },
  { n: 35, sym: 'Br', nameBn: 'ব্রোমিন', nameEn: 'Bromine', mass: '79.904', group: 17, period: 4, block: 'p', cat: 'halogen', state: 'Liquid', en: 2.96, val: '1, 3, 5', ec: '[Ar] 3d¹⁰ 4s² 4p⁵', shells: [2, 8, 18, 7], subshells: [{ name: '4s', cap: 2, count: 2 }, { name: '4p', cap: 6, count: 5 }], desc: 'একমাত্র সাধারণ তাপমাত্রায় তরল লালচে-বাদামি অধাতু।' },
  { n: 47, sym: 'Ag', nameBn: 'সিলভার (রূপা)', nameEn: 'Silver', mass: '107.87', group: 11, period: 5, block: 'd', cat: 'transition', state: 'Solid', en: 1.93, val: '1', ec: '[Kr] 4d¹⁰ 5s¹', shells: [2, 8, 18, 18, 1], subshells: [{ name: '4d', cap: 10, count: 10 }, { name: '5s', cap: 2, count: 1 }], desc: 'সর্বাধিক বিদ্যুৎ ও তাপ পরিবাহী ধাতব মৌল।' },
  { n: 79, sym: 'Au', nameBn: 'গোল্ড (স্বর্ণ)', nameEn: 'Gold', mass: '196.97', group: 11, period: 6, block: 'd', cat: 'transition', state: 'Solid', en: 2.54, val: '1, 3', ec: '[Xe] 4f¹⁴ 5d¹⁰ 6s¹', shells: [2, 8, 18, 32, 18, 1], subshells: [{ name: '5d', cap: 10, count: 10 }, { name: '6s', cap: 2, count: 1 }], desc: 'অভিজাত ধাতু, সহজে ক্ষয় বা অক্সিডাইজড হয় না; উৎকৃষ্ট পরিবাহী।' },
  { n: 80, sym: 'Hg', nameBn: 'মার্কারি (পারদ)', nameEn: 'Mercury', mass: '200.59', group: 12, period: 6, block: 'd', cat: 'transition', state: 'Liquid', en: 2.00, val: '1, 2', ec: '[Xe] 4f¹⁴ 5d¹⁰ 6s²', shells: [2, 8, 18, 32, 18, 2], subshells: [{ name: '5d', cap: 10, count: 10 }, { name: '6s', cap: 2, count: 2 }], desc: 'একমাত্র সাধারণ তাপমাত্রায় তরল ধাতু; থার্মোমিটারে ব্যবহৃত।' },
  { n: 92, sym: 'U', nameBn: 'ইউরেনিয়াম', nameEn: 'Uranium', mass: '238.03', group: 3, period: 7, block: 'f', cat: 'actinide', state: 'Solid', en: 1.38, val: '3, 4, 5, 6', ec: '[Rn] 5f³ 6d¹ 7s²', shells: [2, 8, 18, 32, 21, 9, 2], subshells: [{ name: '5f', cap: 14, count: 3 }, { name: '6d', cap: 10, count: 1 }, { name: '7s', cap: 2, count: 2 }], desc: 'পারমাণবিক চুল্লি ও পারমাণবিক বোমার প্রধান ফিশন জ্বালানি।' }
];

const CATEGORIES = [
  { id: 'ALL', name: 'সকল ক্যাটাগরি', color: '#38BDF8' },
  { id: 'alkali', name: 'ক্ষার ধাতু (Alkali)', color: '#EF4444' },
  { id: 'alkaline', name: 'মৃৎক্ষার ধাতু (Alkaline Earth)', color: '#F97316' },
  { id: 'transition', name: 'অবস্থান্তর ধাতু (Transition)', color: '#EC4899' },
  { id: 'metalloid', name: 'অপধাতু (Metalloid)', color: '#10B981' },
  { id: 'nonmetal', name: 'অধাতু (Non-metal)', color: '#38BDF8' },
  { id: 'halogen', name: 'হ্যালোজেন (Halogen)', color: '#FBBF24' },
  { id: 'noble', name: 'নিষ্ক্রিয় গ্যাস (Noble Gas)', color: '#A855F7' },
  { id: 'post-transition', name: 'পোস্ট-অবস্থান্তর ধাতু', color: '#06B6D4' },
  { id: 'actinide', name: 'অ্যাক্টিনাইড (Actinide)', color: '#84CC16' }
];

const BLOCKS = [
  { id: 'ALL', name: 'সকল ব্লক' },
  { id: 's', name: 's-Block (গ্রুপ ১, ২ + He)', desc: 'সর্বশেষ ইলেকট্রন s উপস্তরে প্রবেশ করে' },
  { id: 'p', name: 'p-Block (গ্রুপ ১৩-১৮)', desc: 'সর্বশেষ ইলেকট্রন p উপস্তরে প্রবেশ করে' },
  { id: 'd', name: 'd-Block (গ্রুপ ৩-১২)', desc: 'সর্বশেষ ইলেকট্রন d উপস্তরে প্রবেশ করে' },
  { id: 'f', name: 'f-Block (ল্যান্থানাইড/অ্যাক্টিনাইড)', desc: 'সর্বশেষ ইলেকট্রন f উপস্তরে প্রবেশ করে' }
];

// =========================================================================
// 2. ORBITAL SPIN BOX GENERATOR (HUND'S RULE & PAULI EXCLUSION PRINCIPLE)
// =========================================================================
function renderOrbitalBoxes(subshellName, electronCount) {
  let boxCount = 1;
  let subLabels = ['s'];
  if (subshellName.includes('p')) {
    boxCount = 3;
    subLabels = ['p_x', 'p_y', 'p_z'];
  } else if (subshellName.includes('d')) {
    boxCount = 5;
    subLabels = ['d_{xy}', 'd_{yz}', 'd_{zx}', 'd_{x^2-y^2}', 'd_{z^2}'];
  } else if (subshellName.includes('f')) {
    boxCount = 7;
    subLabels = ['f_1', 'f_2', 'f_3', 'f_4', 'f_5', 'f_6', 'f_7'];
  }

  const boxes = [];
  for (let i = 0; i < boxCount; i++) {
    const hasSpinUp = electronCount > i;
    const hasSpinDown = electronCount > (i + boxCount);
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
    <div className="flex flex-col items-center gap-1">
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
            <div className="flex items-center justify-center gap-1">
              {box.hasSpinUp && (
                <span className="text-cyan-400 font-bold text-base leading-none animate-in fade-in zoom-in" title="Spin Up (+1/2)">
                  ↑
                </span>
              )}
              {box.hasSpinDown && (
                <span className="text-amber-400 font-bold text-base leading-none animate-in fade-in zoom-in" title="Spin Down (-1/2)">
                  ↓
                </span>
              )}
              {!box.hasSpinUp && !box.hasSpinDown && (
                <span className="text-[10px] text-slate-600 font-mono">-</span>
              )}
            </div>
            <span className="text-[8px] text-slate-500 font-mono mt-0.5">{box.label}</span>
          </div>
        ))}
      </div>
      <span className="text-[10px] font-bold text-slate-300 font-mono bg-slate-800/80 px-2 py-0.5 rounded-full border border-slate-700">
        {subshellName}<sup>{electronCount}</sup>
      </span>
    </div>
  );
}

// =========================================================================
// 3. MAIN COMPONENT: INTERACTIVE PERIODIC TABLE & ELECTRON CONFIG LAB
// =========================================================================
export default function PeriodicTable3D() {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedBlock, setSelectedBlock] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeElement, setActiveElement] = useState(ALL_ELEMENTS[22]); // Default: Iron (Fe)
  const [isExporting, setIsExporting] = useState(false);
  const [activeTab, setActiveTab] = useState('table'); // 'table' | 'visualizer' | 'quiz'
  const [viewMode, setViewMode] = useState('atom'); // 'atom' | 'nucleus'
  const [isRotating, setIsRotating] = useState(true);
  const [quizScore, setQuizScore] = useState(0);
  const [quizAnswered, setQuizAnswered] = useState(null);
  const flashcardRef = useRef(null);

  // Nucleon calculations
  const protonCount = activeElement.n;
  const massNumber = Math.round(Number(activeElement.mass));
  const neutronCount = Math.max(0, massNumber - protonCount);

  // Nucleus cluster calculation for zoomed view
  const nucleusCluster = useMemo(() => {
    const totalNucleons = protonCount + neutronCount;
    const visualTotal = Math.min(totalNucleons, 75);
    const protonRatio = protonCount / totalNucleons;
    const visualProtons = Math.round(visualTotal * protonRatio);
    const visualNeutrons = visualTotal - visualProtons;

    const list = [];
    for (let i = 0; i < visualProtons; i++) list.push({ type: 'P', label: 'p⁺' });
    for (let i = 0; i < visualNeutrons; i++) list.push({ type: 'N', label: 'n⁰' });

    const seedShuffle = (arr) => {
      const seeded = [...arr];
      let seed = activeElement.n * 37;
      for (let i = seeded.length - 1; i > 0; i--) {
        seed = (seed * 9301 + 49297) % 233280;
        const j = Math.floor((seed / 233280) * (i + 1));
        [seeded[i], seeded[j]] = [seeded[j], seeded[i]];
      }
      return seeded;
    };
    const shuffled = seedShuffle(list);

    return shuffled.map((item, idx) => {
      const phi = idx * 137.5 * (Math.PI / 180);
      const r = Math.sqrt(idx + 1) * 12.5;
      const x = Math.cos(phi) * r;
      const y = Math.sin(phi) * r;
      const depth = Math.sin(idx * 2.3) * 0.4 + 0.8;
      return {
        id: idx,
        type: item.type,
        label: item.label,
        x,
        y,
        depth
      };
    });
  }, [protonCount, neutronCount, activeElement.n]);

  // Filter elements by category, block, and search query
  const filteredElements = useMemo(() => {
    return ALL_ELEMENTS.filter((el) => {
      const matchesCat = selectedCategory === 'ALL' || el.cat === selectedCategory;
      const matchesBlock = selectedBlock === 'ALL' || el.block === selectedBlock;
      const q = searchQuery.toLowerCase().trim();
      const matchesQ =
        !q ||
        el.nameBn.toLowerCase().includes(q) ||
        el.nameEn.toLowerCase().includes(q) ||
        el.sym.toLowerCase().includes(q) ||
        String(el.n) === q ||
        el.ec.toLowerCase().includes(q);
      return matchesCat && matchesBlock && matchesQ;
    });
  }, [selectedCategory, selectedBlock, searchQuery]);

  // Flashcard Export Handler
  const handleExportFlashcard = async () => {
    if (!flashcardRef.current || !activeElement) return;
    setIsExporting(true);
    try {
      await exportBrandedGraphic(flashcardRef.current, {
        fileName: `NextGen_Periodic_Element_${activeElement.sym}_${activeElement.nameEn}`,
        cardTitle: `মৌল ফ্ল্যাশকার্ড ও ইলেকট্রন বিন্যাস: ${activeElement.nameBn} (${activeElement.sym})`,
        scale: 2
      });
    } catch (err) {
      console.error('Failed to export element flashcard:', err);
    } finally {
      setIsExporting(false);
    }
  };

  // Unpaired electron calculator
  const unpairedElectronsCount = useMemo(() => {
    if (!activeElement?.subshells) return 0;
    let unpaired = 0;
    activeElement.subshells.forEach((sub) => {
      let boxCount = 1;
      if (sub.name.includes('p')) boxCount = 3;
      else if (sub.name.includes('d')) boxCount = 5;
      else if (sub.name.includes('f')) boxCount = 7;

      for (let i = 0; i < boxCount; i++) {
        const hasUp = sub.count > i;
        const hasDown = sub.count > (i + boxCount);
        if (hasUp && !hasDown) unpaired++;
      }
    });
    return unpaired;
  }, [activeElement]);

  return (
    <div className="space-y-6">
      {/* Top Header Banner */}
      <div className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-3xl shadow-xl text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="p-3.5 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shadow-inner">
            <Atom className="w-9 h-9 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black text-white">ইন্টারেক্টিভ পর্যায় সারণি ও ইলেকট্রন বিন্যাস ল্যাব</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold font-mono">
                Bohr & Nucleus 3D
              </span>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              মৌলের বোর মডেল (2n²), ঘূর্ণায়মান অরবিট, নিউক্লিয়াসের অভ্যন্তরীণ প্রোটন-নিউট্রন বিশ্লেষণ ও হুন্ডের উপস্তর স্পিন
            </p>
          </div>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1 bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800 text-xs font-bold shadow-inner">
          <button
            type="button"
            onClick={() => setActiveTab('table')}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'table' ? 'bg-cyan-600 text-white shadow-md font-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>পর্যায় সারণি</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('visualizer')}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'visualizer' ? 'bg-emerald-600 text-white shadow-md font-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>ইলেকট্রন স্পিন ল্যাব</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('quiz')}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'quiz' ? 'bg-amber-600 text-white shadow-md font-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>অনুশীলন কুইজ</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: INTERACTIVE PERIODIC TABLE GRID VIEW */}
      {/* ========================================================================= */}
      {activeTab === 'table' && (
        <div className="space-y-6">
          {/* Search & Category Filter Toolbar */}
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-3 shadow-lg">
            {/* Search Bar */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="প্রতীক, নাম, সংখ্যা (Z) বা বিন্যাস খুঁজুন..."
                className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            {/* Block Pills */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-bold">
              {BLOCKS.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setSelectedBlock(b.id)}
                  className={`px-2.5 py-1 rounded-lg transition-all text-[11px] ${
                    selectedBlock === b.id ? 'bg-cyan-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {b.name}
                </button>
              ))}
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-bold scrollbar-none w-full md:w-auto">
              {CATEGORIES.slice(0, 6).map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all text-xs font-bold ${
                    selectedCategory === cat.id ? 'bg-cyan-600 text-white shadow-md' : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Elements Grid */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-slate-400 uppercase tracking-wider">উপলব্ধ মৌলিক পদার্থসমূহ</span>
                <span className="px-2 py-0.5 rounded-full bg-slate-800 text-cyan-400 font-mono text-xs font-bold">
                  {filteredElements.length}টি মৌল
                </span>
              </div>
              <span className="text-xs text-slate-500 italic hidden sm:inline">
                💡 যেকোনো মৌলে ক্লিক করে বোর মডেল ও সাবশেল অরবিটাল স্পিন বিস্তারিত দেখুন
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-9 gap-3">
              {filteredElements.map((el) => {
                const catObj = CATEGORIES.find((c) => c.id === el.cat) || CATEGORIES[0];
                const isCurrentActive = activeElement?.n === el.n;

                return (
                  <button
                    key={el.n}
                    type="button"
                    onClick={() => setActiveElement(el)}
                    style={{ borderColor: isCurrentActive ? catObj.color : `${catObj.color}40` }}
                    className={`p-3.5 rounded-2xl bg-slate-950/90 hover:bg-slate-800/90 border-2 transition-all hover:scale-105 hover:shadow-xl text-left flex flex-col justify-between group relative overflow-hidden active:scale-95 ${
                      isCurrentActive ? 'ring-2 ring-cyan-400 shadow-lg shadow-cyan-500/20' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] text-slate-400 font-bold">Z={el.n}</span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-bold font-mono">
                        {el.block}-block
                      </span>
                    </div>

                    <div className="my-2">
                      <span
                        className="font-black text-2xl font-mono block leading-none transition-transform group-hover:scale-110"
                        style={{ color: catObj.color }}
                      >
                        {el.sym}
                      </span>
                      <p className="text-xs font-bold text-slate-200 mt-1 truncate">{el.nameBn}</p>
                      <span className="text-[10px] text-slate-500 font-mono block truncate">{el.nameEn}</span>
                    </div>

                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[9px] text-slate-400 font-mono">
                      <span>ভর: {el.mass}</span>
                      <span className="text-cyan-400 font-bold">যোজনী: {el.val}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: LIVE ELECTRON CONFIGURATION & ORBITAL SPIN VISUALIZER LAB */}
      {/* ========================================================================= */}
      {(activeTab === 'visualizer' || activeTab === 'table') && activeElement && (
        <div className="bg-slate-900 border-2 border-cyan-500/40 rounded-3xl p-6 sm:p-8 text-white shadow-2xl space-y-6 relative overflow-hidden" ref={flashcardRef}>
          {/* Header Card with Element Overview */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-4">
              <div
                className="w-16 h-16 rounded-2xl flex flex-col items-center justify-center font-mono font-black shadow-xl border-2"
                style={{
                  backgroundColor: `${CATEGORIES.find((c) => c.id === activeElement.cat)?.color || '#38BDF8'}20`,
                  color: CATEGORIES.find((c) => c.id === activeElement.cat)?.color || '#38BDF8',
                  borderColor: CATEGORIES.find((c) => c.id === activeElement.cat)?.color || '#38BDF8'
                }}
              >
                <span className="text-2xl leading-none">{activeElement.sym}</span>
                <span className="text-[10px] mt-0.5 opacity-80">Z={activeElement.n}</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-2xl text-white">{activeElement.nameBn} ({activeElement.nameEn})</h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-xs font-bold border border-cyan-500/30">
                    {activeElement.cat.toUpperCase()}
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-mono mt-1">
                  গ্রুপ: {activeElement.group} • পর্যায়: {activeElement.period} • ব্লক: {activeElement.block.toUpperCase()} • ভর: {activeElement.mass} u (ভর সংখ্যা: {massNumber})
                </p>
              </div>
            </div>

            {/* View Mode Switcher and Export */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setViewMode('atom')}
                  className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                    viewMode === 'atom' ? 'bg-cyan-600 text-white font-black' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Atom className="w-3.5 h-3.5" />
                  <span>অরবিট</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('nucleus')}
                  className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                    viewMode === 'nucleus' ? 'bg-rose-600 text-white font-black' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                  <span>🔍 নিউক্লিয়াস (P+N)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsRotating((r) => !r)}
                  className="px-2 py-1.5 text-slate-400 hover:text-white"
                  title="অরবিট ঘূর্ণন প্লে/পজ"
                >
                  {isRotating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Download Branded Flashcard Button */}
              <button
                type="button"
                onClick={handleExportFlashcard}
                disabled={isExporting}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-cyan-600/30 flex items-center gap-2 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
              >
                {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                <span>ফ্ল্যাশকার্ড</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column (5 Cols): Dynamic Simulation Stage (Atom Orbits OR Zoomed Nucleus Cluster) */}
            <div className="lg:col-span-5 p-6 rounded-3xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-between shadow-inner relative overflow-hidden min-h-[380px]">
              <div className="w-full flex items-center justify-between z-10">
                <span className="text-xs font-black text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                  {viewMode === 'atom' ? (
                    <>
                      <Atom className="w-4 h-4 text-cyan-400 animate-spin-slow" />
                      বোর অরবিট সিমুলেটর
                    </>
                  ) : (
                    <>
                      <ZoomIn className="w-4 h-4 text-rose-400 animate-pulse" />
                      নিউক্লিয়াস প্রোটন-নিউট্রন ক্লাস্টার
                    </>
                  )}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {viewMode === 'atom' ? `শেল সংখ্যা: ${activeElement.shells?.length || 1}` : `মোট কণা: ${massNumber}টি`}
                </span>
              </div>

              {/* VIEW 1: BOHR ATOM ORBIT SIMULATOR */}
              {viewMode === 'atom' && (
                <div className="relative w-64 h-64 flex items-center justify-center my-3">
                  {/* Central Nucleus with Click-to-Zoom */}
                  <button
                    type="button"
                    onClick={() => setViewMode('nucleus')}
                    title="ক্লিক করে নিউক্লিয়াসের ভেতরের প্রোটন ও নিউট্রন জুম করুন"
                    className="w-16 h-16 rounded-full bg-gradient-to-tr from-rose-500 via-amber-400 to-rose-600 flex flex-col items-center justify-center text-[10px] font-black text-slate-950 shadow-2xl shadow-rose-500/50 z-20 animate-pulse border-2 border-white/50 text-center hover:scale-110 transition-transform cursor-pointer group"
                  >
                    <span className="font-mono font-black text-xs leading-none group-hover:hidden">{activeElement.sym}</span>
                    <span className="text-[8px] font-mono leading-none mt-0.5 font-bold group-hover:hidden">p={protonCount}</span>
                    <span className="text-[8px] font-bold hidden group-hover:block text-slate-950 leading-tight">🔍 জুম</span>
                  </button>

                  {/* Concentric Shells (K, L, M, N, O, P, Q) */}
                  {activeElement.shells?.map((electronCount, sIdx) => {
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
                        {/* Place electrons around circumference */}
                        {Array.from({ length: Math.min(electronCount, 16) }).map((_, eIdx) => {
                          const angle = (eIdx / Math.min(electronCount, 16)) * 2 * Math.PI;
                          const radius = size / 2;
                          const x = Math.cos(angle) * radius;
                          const y = Math.sin(angle) * radius;

                          return (
                            <div
                              key={eIdx}
                              style={{
                                transform: `translate(${x}px, ${y}px)`
                              }}
                              className="absolute w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-md shadow-cyan-400/80 border border-white"
                            />
                          );
                        })}
                        <span className="absolute -top-3 text-[9px] font-bold text-slate-500 font-mono">
                          {shellNames[sIdx]}({electronCount})
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* VIEW 2: ZOOMED NUCLEUS INTERNAL CLUSTER VIEW */}
              {viewMode === 'nucleus' && (
                <div className="relative w-64 h-64 flex items-center justify-center my-3 bg-radial-glow">
                  <div className="absolute w-56 h-56 rounded-full border border-dashed border-rose-500/30 bg-rose-950/20 animate-pulse pointer-events-none" />
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

              {/* Shells Breakdown Pill Bar */}
              <div className="w-full mt-2 p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs font-mono z-10">
                <span className="text-slate-400 font-bold">{viewMode === 'atom' ? 'শেল ইলেকট্রন:' : 'কণা সংক্ষেপ:'}</span>
                <div className="flex items-center gap-1.5">
                  {viewMode === 'atom' ? (
                    activeElement.shells?.map((count, idx) => {
                      const shellNames = ['K', 'L', 'M', 'N', 'O', 'P', 'Q'];
                      return (
                        <span key={idx} className="px-2 py-0.5 rounded-lg bg-cyan-950 text-cyan-300 border border-cyan-800 text-xs font-bold">
                          {shellNames[idx]}={count}
                        </span>
                      );
                    })
                  ) : (
                    <>
                      <span className="px-2 py-0.5 rounded-lg bg-rose-950 text-rose-300 border border-rose-800 text-xs font-bold">
                        🔴 P={protonCount}
                      </span>
                      <span className="px-2 py-0.5 rounded-lg bg-slate-800 text-slate-200 border border-slate-700 text-xs font-bold">
                        ⚪ N={neutronCount}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column (7 Cols): Hund's Rule Orbital Spin Box Visualizer */}
            <div className="lg:col-span-7 space-y-4">
              {/* Nucleon Breakdown Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                <div className="p-3 rounded-2xl bg-slate-950 border border-rose-500/40 shadow-sm">
                  <span className="text-[10px] text-rose-300 block font-bold uppercase tracking-wider">
                    🔴 প্রোটন (p⁺)
                  </span>
                  <strong className="text-lg font-black text-rose-400 font-mono mt-0.5 block">{protonCount} টি</strong>
                  <span className="text-[9px] text-slate-400 font-mono">চার্জ: +{protonCount}e</span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-600/50 shadow-sm">
                  <span className="text-[10px] text-slate-300 block font-bold uppercase tracking-wider">
                    ⚪ নিউট্রন (n⁰)
                  </span>
                  <strong className="text-lg font-black text-slate-200 font-mono mt-0.5 block">{neutronCount} টি</strong>
                  <span className="text-[9px] text-slate-400 font-mono">A - Z = {massNumber - protonCount}</span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950 border border-cyan-500/40 shadow-sm">
                  <span className="text-[10px] text-cyan-300 block font-bold uppercase tracking-wider">
                    🔵 ইলেকট্রন (e⁻)
                  </span>
                  <strong className="text-lg font-black text-cyan-400 font-mono mt-0.5 block">{protonCount} টি</strong>
                  <span className="text-[9px] text-slate-400 font-mono">চার্জ: -{protonCount}e</span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950 border border-amber-500/40 shadow-sm">
                  <span className="text-[10px] text-amber-300 block font-bold uppercase tracking-wider">
                    ⚖️ ভর সংখ্যা (A)
                  </span>
                  <strong className="text-lg font-black text-amber-400 font-mono mt-0.5 block">{massNumber}</strong>
                  <span className="text-[9px] text-slate-400 font-mono">p⁺ + n⁰</span>
                </div>
              </div>

              {/* Electronic Configuration Notation */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 shadow-inner">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    আউফবাউ উপস্তর ইলেকট্রন বিন্যাস (Aufbau Principle)
                  </span>
                  {activeElement.ec.includes('ব্যতিক্রম') && (
                    <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-bold animate-pulse">
                      ⚠️ ব্যতিক্রমী বিন্যাস
                    </span>
                  )}
                </div>

                <p className="font-mono text-base font-black text-cyan-300 tracking-wide bg-slate-900/90 p-3 rounded-xl border border-slate-800 shadow-sm">
                  {activeElement.ec}
                </p>
              </div>

              {/* Subshell Orbital Spin Boxes (Hund's Rule) */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 shadow-inner">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-amber-400" />
                    হুন্ডের নীতি ও অরবিটাল স্পিন ডায়াগ্রাম (Orbital Spins)
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    অযুগ্ম ইলেকট্রন: <strong className="text-cyan-400">{unpairedElectronsCount}টি</strong>
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800 overflow-x-auto">
                  {activeElement.subshells?.map((sub, sIdx) => (
                    <div key={sIdx}>
                      {renderOrbitalBoxes(sub.name, sub.count)}
                    </div>
                  ))}
                </div>

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

              {/* Properties Grid */}
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-bold">পারমাণবিক ভর (Mass):</span>
                  <strong className="text-white font-mono text-sm">{activeElement.mass} u</strong>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-bold">তড়িৎ-ঋণাত্মকতা:</span>
                  <strong className="text-cyan-400 font-mono text-sm">{activeElement.en || 'N/A'}</strong>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-bold">যোজনী (Valency):</span>
                  <strong className="text-emerald-400 font-mono text-sm">{activeElement.val}</strong>
                </div>
              </div>

              {/* Board Exam Note */}
              <div className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 text-xs text-emerald-100 flex items-start gap-2.5">
                <Brain className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-emerald-300 block font-black mb-0.5">বোর্ড পরীক্ষার স্মার্ট নোট (Exam Keynote):</strong>
                  <p className="text-emerald-100/90 leading-relaxed text-[11px]">{activeElement.desc}</p>
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
      )}

      {/* ========================================================================= */}
      {/* TAB 3: PRACTICE QUIZ & REVISION MODE */}
      {/* ========================================================================= */}
      {activeTab === 'quiz' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                <Award className="w-6 h-6 text-amber-400" />
                ইলেকট্রন বিন্যাস ও পর্যায় সারণি কুইজ (Practice Zone)
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                এসএসসি ও এইচএসসি রসায়ন পরীক্ষার বোর্ড স্ট্যান্ডার্ড বহুনির্বাচনী প্রশ্ন অনুশীলন করুন
              </p>
            </div>
            <div className="px-4 py-2 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono font-bold text-sm">
              স্কোর: {quizScore} point
            </div>
          </div>

          {/* Question 1: Chromium Exception */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <span className="text-xs font-black text-cyan-400 uppercase tracking-wider">প্রশ্ন ১: আউফবাউ নিয়মের ব্যতিক্রম</span>
            <p className="text-sm font-bold text-white">
              ক্রোমিয়াম (Z=24) মৌলটির সঠিক এবং স্থিতিশীল ইলেকট্রন বিন্যাস কোনটি?
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
              {[
                { id: 'a', text: '[Ar] 3d⁴ 4s²', correct: false, note: 'ভুল। d⁴ কাঠামো d⁵ এর চেয়ে কম স্থিতিশীল।' },
                { id: 'b', text: '[Ar] 3d⁵ 4s¹', correct: true, note: 'সঠিক! অর্ধপূর্ণ d⁵ অরবিটালের প্রতিসাম্য ও উচ্চ বিনিময় শক্তির কারণে এটি অধিক স্থিতিশীল।' },
                { id: 'c', text: '[Ar] 3d⁶ 4s⁰', correct: false, note: 'ভুল।' },
                { id: 'd', text: '[Ar] 3d³ 4s² 4p¹', correct: false, note: 'ভুল।' }
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    setQuizAnswered(opt.id);
                    if (opt.correct) setQuizScore((s) => s + 10);
                  }}
                  className={`p-3 rounded-xl border text-left text-xs font-mono font-bold transition-all ${
                    quizAnswered === opt.id
                      ? opt.correct
                        ? 'border-emerald-500 bg-emerald-950/60 text-emerald-300'
                        : 'border-rose-500 bg-rose-950/60 text-rose-300'
                      : 'border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span className="text-slate-400 mr-2">({opt.id.toUpperCase()})</span>
                  {opt.text}
                </button>
              ))}
            </div>
          </div>

          {/* Question 2: Hund's Rule Unpaired Electrons */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <span className="text-xs font-black text-cyan-400 uppercase tracking-wider">প্রশ্ন ২: হুন্ডের নীতি ও অযুগ্ম ইলেকট্রন</span>
            <p className="text-sm font-bold text-white">
              ফসফরাস (Z=15) মৌলের যোজনী স্তরের 3p উপস্তরে অযুগ্ম (unpaired) ইলেকট্রন সংখ্যা কত?
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
              {['১টি', '২টি', '৩টি', '৫টি'].map((ans, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    if (ans === '৩টি') alert('সঠিক উত্তর! হুন্ডের নীতি অনুসারে ৩টি p অরবিটালে (px, py, pz) ১টি করে সমমুখী স্পিনের ৩টি অযুগ্ম ইলেকট্রন থাকে।');
                    else alert('ভুল উত্তর। আবার চেষ্টা করুন।');
                  }}
                  className="p-3 rounded-xl border border-slate-800 bg-slate-900 hover:border-cyan-500 text-center font-bold text-xs text-white"
                >
                  {ans}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
