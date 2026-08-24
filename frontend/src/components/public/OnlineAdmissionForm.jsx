import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useSettings } from '../../context/SettingsContext';
import { admissionAPI, batchAPI, paymentAPI } from '../../services/api';
import UniversalFileUploader from '../common/UniversalFileUploader';
import {
  GraduationCap,
  User,
  Users,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Building,
  Award,
  Upload,
  CheckCircle2,
  AlertCircle,
  Clock,
  Printer,
  Search,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  X,
  FileText,
  ShieldCheck,
  Check,
  ChevronRight,
  CreditCard,
  QrCode,
  Lock,
  Wallet
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function OnlineAdmissionForm({ onClose, onOpenLogin }) {
  const { t, lang } = useLanguage();
  const { settings } = useSettings();

  const [activeTab, setActiveTab] = useState('apply'); // 'apply' | 'track'

  // Multi-Step State: 1: Student Info, 2: Guardian & Address, 3: Payment & TrxID
  const [currentStep, setCurrentStep] = useState(1);
  const [stepError, setStepError] = useState('');

  // Payment Methods
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedMethod, setSelectedMethod] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    studentNameBn: '',
    studentNameEn: '',
    className: 'Class 9',
    classId: 3,
    group: '',
    batchName: 'সকাল ব্যাচ (সকাল ৮:০০ - ১০:০০)',
    bloodGroup: 'B+',
    religion: 'ISLAM',
    dob: '2010-01-01',
    gender: 'MALE',
    previousSchool: '',
    previousGpa: '',
    guardianName: '',
    guardianPhone: '',
    guardianProfession: '',
    guardianEmail: '',
    address: '',
    photoUrl: '',
    photoFileName: '',
    birthCertUrl: '',
    birthCertFileName: '',
    marksheetUrl: '',
    marksheetFileName: '',
    applicationFee: 500,
    paymentMethod: 'bKash',
    paymentNumber: '',
    paymentTrxId: '',
    paymentSlipUrl: '',
    paymentSlipFileName: '',
    remarks: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const [showSlipModal, setShowSlipModal] = useState(false);

  // Tracking State
  const [trackQuery, setTrackQuery] = useState('');
  const [trackResult, setTrackResult] = useState(null);
  const [loadingTrack, setLoadingTrack] = useState(false);
  const [trackError, setTrackError] = useState(null);

  const classesList = [
    // Pre-Primary
    { id: 1, name: 'Play', labelBn: 'প্লে গ্রুপ (Play)', category: 'PRE_PRIMARY' },
    { id: 2, name: 'Nursery', labelBn: 'নার্সারি (Nursery)', category: 'PRE_PRIMARY' },
    { id: 3, name: 'KG', labelBn: 'কেজি (Kindergarten / KG)', category: 'PRE_PRIMARY' },
    // Primary (Class 1-5)
    { id: 4, name: 'Class 1', labelBn: '১ম শ্রেণি (Class 1)', category: 'PRIMARY' },
    { id: 5, name: 'Class 2', labelBn: '২য় শ্রেণি (Class 2)', category: 'PRIMARY' },
    { id: 6, name: 'Class 3', labelBn: '৩য় শ্রেণি (Class 3)', category: 'PRIMARY' },
    { id: 7, name: 'Class 4', labelBn: '৪র্থ শ্রেণি (Class 4)', category: 'PRIMARY' },
    { id: 8, name: 'Class 5', labelBn: '৫ম শ্রেণি (Class 5)', category: 'PRIMARY' },
    // Junior Secondary (Class 6-8)
    { id: 9, name: 'Class 6', labelBn: '৬ষ্ঠ শ্রেণি (Class 6)', category: 'JUNIOR_SECONDARY' },
    { id: 10, name: 'Class 7', labelBn: '৭ম শ্রেণি (Class 7)', category: 'JUNIOR_SECONDARY' },
    { id: 11, name: 'Class 8', labelBn: '৮ম শ্রেণি (Class 8)', category: 'JUNIOR_SECONDARY' },
    // Secondary / SSC
    { id: 12, name: 'Class 9', labelBn: '৯ম শ্রেণি (Class 9 - SSC)', category: 'SECONDARY' },
    { id: 13, name: 'Class 10', labelBn: '১০ম শ্রেণি (Class 10 - SSC)', category: 'SECONDARY' },
    { id: 14, name: 'SSC Candidate', labelBn: 'এসএসসি পরীক্ষার্থী (SSC Candidate)', category: 'SECONDARY' },
    // Higher Secondary / HSC
    { id: 15, name: 'Class 11', labelBn: 'একাদশ শ্রেণি (11th - HSC)', category: 'HIGHER_SECONDARY' },
    { id: 16, name: 'Class 12', labelBn: 'দ্বাদশ শ্রেণি (12th - HSC)', category: 'HIGHER_SECONDARY' },
    { id: 17, name: 'HSC Candidate', labelBn: 'এইচএসসি পরীক্ষার্থী (HSC Candidate)', category: 'HIGHER_SECONDARY' }
  ];

  // 1. Realistic Batch Options
  const batchOptionsList = [
    'সকাল ব্যাচ (সকাল ৮:০০ - ১০:০০)',
    'দুপুর ব্যাচ (দুপুর ২:০০ - ৪:০০)',
    'বিকাল ব্যাচ (বিকাল ৪:০০ - ৬:০০)',
    'সান্ধ্য ব্যাচ (সন্ধ্যা ৬:০০ - ৮:০০)',
    'স্পেশাল কেয়ার ব্যাচ'
  ];

  // 2. Religion Options
  const religionOptions = [
    { value: 'ISLAM', labelBn: 'ইসলাম (Islam)' },
    { value: 'HINDUISM', labelBn: 'হিন্দু (Hinduism)' },
    { value: 'BUDDHISM', labelBn: 'বৌদ্ধ (Buddhism)' },
    { value: 'CHRISTIANITY', labelBn: 'খ্রিষ্টান (Christianity)' },
    { value: 'OTHERS', labelBn: 'অন্যান্য (Others)' }
  ];

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

  const [batches, setBatches] = useState([]);
  const [loadingBatches, setLoadingBatches] = useState(false);

  useEffect(() => {
    fetchPaymentMethods();
    fetchDynamicBatches();
  }, []);

  const fetchDynamicBatches = async () => {
    setLoadingBatches(true);
    try {
      const res = await batchAPI.getAll();
      if (res.success && res.data && res.data.length > 0) {
        const activeList = res.data.filter(b => b.isActive !== false && b.status !== 'INACTIVE');
        setBatches(activeList);
        if (activeList.length > 0) {
          const first = activeList[0];
          setFormData((prev) => ({
            ...prev,
            batchName: `${first.nameBn || first.name} (${first.timeSlot || 'সকাল ৮:০০ - ১০:০০'})`
          }));
        }
      }
    } catch (err) {
      console.error('Fetch batches error:', err);
    } finally {
      setLoadingBatches(false);
    }
  };

  const fetchPaymentMethods = async () => {
    try {
      const res = await paymentAPI.getMethods();
      if (res.success && res.data && res.data.length > 0) {
        setPaymentMethods(res.data);
        setSelectedMethod(res.data[0]);
        setFormData((prev) => ({
          ...prev,
          paymentMethod: res.data[0].provider
        }));
      } else {
        // Fallback default methods
        const defaults = [
          {
            id: 1,
            provider: 'bKash',
            accountType: 'Merchant',
            accountNumber: '01800-000000',
            instructions: 'বিকাশ অ্যাপ থেকে পেমেন্ট অপশনে গিয়ে এই নম্বরে ৳৫০০ পাঠান এবং TrxID দিন।'
          },
          {
            id: 2,
            provider: 'Nagad',
            accountType: 'Merchant',
            accountNumber: '01900-000000',
            instructions: 'নগদ অ্যাপ বা *167# ডায়াল করে পেমেন্ট করুন।'
          },
          {
            id: 3,
            provider: 'Rocket',
            accountType: 'Personal',
            accountNumber: '01700-0000008',
            instructions: 'রকেট সেন্ড মানি করুন।'
          }
        ];
        setPaymentMethods(defaults);
        setSelectedMethod(defaults[0]);
      }
    } catch (err) {
      console.error('Fetch payment methods error:', err);
    }
  };

  const handleClassChange = (selectedClassName) => {
    const cls = classesList.find((c) => c.name === selectedClassName);
    setFormData({
      ...formData,
      className: selectedClassName,
      classId: cls ? cls.id : 1
    });
  };

  // 3. Step Validation & Navigation
  const validateCurrentStep = () => {
    setStepError('');

    const requiresGroup = ['Class 9', 'Class 10', 'Class 11', 'Class 12', '9', '10', '11', '12', '৯ম', '১০ম', 'একাদশ', 'দ্বাদশ', 'SSC', 'HSC'].some(
      (c) => (formData.className || '').includes(c)
    );

    if (currentStep === 1) {
      if (!formData.studentNameBn.trim()) {
        setStepError('শিক্ষার্থীর বাংলা নাম প্রদান করা বাধ্যতামূলক');
        return false;
      }
      if (!formData.studentNameEn.trim()) {
        setStepError('শিক্ষার্থীর ইংরেজি নাম প্রদান করা বাধ্যতামূলক');
        return false;
      }
      if (requiresGroup && !formData.group) {
        setStepError('৯ম থেকে ১২শ শ্রেণির শিক্ষার্থীদের জন্য বিভাগ (Group) নির্বাচন করুন');
        return false;
      }
      if (!formData.dob) {
        setStepError('জন্ম তারিখ নির্বাচন করুন');
        return false;
      }
    } else if (currentStep === 2) {
      if (!formData.guardianName.trim()) {
        setStepError('অভিভাবকের নাম প্রদান করা আবশ্যক');
        return false;
      }
      if (!formData.guardianPhone.trim() || formData.guardianPhone.trim().length < 11) {
        setStepError('সঠিক ১১-সংখ্যার অভিভাবকের মোবাইল নম্বর দিন');
        return false;
      }
      if (!formData.address.trim()) {
        setStepError('বর্তমান ও স্থায়ী ঠিকানা প্রদান করুন');
        return false;
      }
    } else if (currentStep === 3) {
      if (!formData.paymentNumber.trim()) {
        setStepError('যে নম্বর থেকে টাকা পাঠিয়েছেন তা লিখুন');
        return false;
      }
      if (!formData.paymentTrxId.trim() || formData.paymentTrxId.trim().length < 6) {
        setStepError('সঠিক পেমেন্ট ট্রানজেকশন আইডি (TrxID) লিখুন');
        return false;
      }
    }

    return true;
  };

  const handleNextStep = (e) => {
    if (e) e.preventDefault();
    if (validateCurrentStep()) {
      setCurrentStep((prev) => Math.min(3, prev + 1));
      window.scrollTo({ top: 150, behavior: 'smooth' });
    }
  };

  const handlePrevStep = () => {
    setStepError('');
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  // Dynamic MFS Transaction Charge Calculation Logic
  const baseAmount = Number(settings?.admissionFee || formData.applicationFee || 1000);

  const calculateCharge = (provider, base) => {
    const prov = (provider || '').toLowerCase();
    if (prov.includes('bkash')) {
      return { charge: base * 0.0185, rate: '1.85%', name: 'bKash' };
    }
    if (prov.includes('nagad')) {
      return { charge: base * 0.015, rate: '1.50%', name: 'Nagad' };
    }
    if (prov.includes('rocket')) {
      return { charge: base * 0.015, rate: '1.50%', name: 'Rocket' };
    }
    return { charge: 0, rate: '0%', name: provider || 'Other' };
  };

  const requiresGroup = ['Class 9', 'Class 10', 'Class 11', 'Class 12', '9', '10', '11', '12', '৯ম', '১০ম', 'একাদশ', 'দ্বাদশ', 'SSC', 'HSC'].some(
    (c) => (formData.className || '').includes(c)
  );

  const { charge: calculatedCharge, rate: chargeRate } = calculateCharge(formData.paymentMethod, baseAmount);
  const totalPayable = baseAmount + calculatedCharge;

  // Final Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateCurrentStep()) return;

    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        group: requiresGroup ? (formData.group || 'Science') : null,
        applicationFee: baseAmount,
        gatewayCharge: calculatedCharge,
        totalPayable: totalPayable
      };
      const res = await admissionAPI.apply(payload);
      if (res.success && res.data) {
        setSubmittedData(res.data);
        setShowSlipModal(true);
        try {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch (e) {}
      }
    } catch (err) {
      setStepError(err.message || 'ভর্তি আবেদন সাবমিট করতে সমস্যা হয়েছে');
    } finally {
      setSubmitting(false);
    }
  };

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!trackQuery.trim()) return;
    setLoadingTrack(true);
    setTrackError(null);
    setTrackResult(null);
    try {
      const res = await admissionAPI.track(trackQuery);
      if (res.success && res.data) {
        setTrackResult(res.data);
      }
    } catch (err) {
      setTrackError(err.message || 'কোনো আবেদন পাওয়া যায়নি। সঠিক ট্র্যাকিং কোড বা মোবাইল নম্বর লিখুন।');
    } finally {
      setLoadingTrack(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-slate-900/95 min-h-screen py-8 px-4 sm:px-6 lg:px-8 text-slate-100 flex flex-col items-center justify-center animate-in fade-in">
      <div className="max-w-4xl w-full space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-800/80 backdrop-blur-md p-6 rounded-3xl border border-slate-700 shadow-2xl">
          <div className="flex items-center space-x-4">
            <img
              src={settings?.logoUrl || '/logo.png'}
              alt="NextGen Academy Logo"
              className="w-14 h-14 object-contain drop-shadow-lg"
            />
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-black text-white tracking-wide">
                  {lang === 'bn' ? (settings?.academyNameBn || 'নেক্সটজেন একাডেমি') : (settings?.academyNameEn || 'NextGen ACADEMY')}
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-[10px] font-black uppercase">
                  {settings?.admissionSessionYear || '২০২৬'} সেশন ভর্তি
                </span>
              </div>
              <p className="text-xs text-slate-300 font-medium mt-0.5">
                ডিজিটাল ভর্তি ও অনলাইন আবেদন পোর্টাল (Online Admission Portal)
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {onClose && (
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-2xl bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold transition-all"
              >
                বন্ধ করুন ✕
              </button>
            )}
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center justify-center">
          <div className="bg-slate-800 p-1.5 rounded-2xl border border-slate-700 shadow-inner flex space-x-2">
            <button
              onClick={() => {
                setActiveTab('apply');
                setCurrentStep(1);
              }}
              className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all flex items-center space-x-2 ${
                activeTab === 'apply'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>অনলাইনে আবেদন করুন</span>
            </button>

            <button
              onClick={() => setActiveTab('track')}
              className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all flex items-center space-x-2 ${
                activeTab === 'track'
                  ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>আবেদনের অবস্থা ট্র্যাক করুন</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: PUBLIC ADMISSION MULTI-STEP FORM */}
        {/* ========================================================================= */}
        {activeTab === 'apply' && (
          <div className="bg-slate-800/90 backdrop-blur-md rounded-3xl border border-slate-700/80 p-6 sm:p-8 shadow-2xl space-y-6 text-xs text-slate-200">
            {/* Step Wizard Indicator */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 pb-4 border-b border-slate-700">
              <div
                className={`p-3 rounded-2xl flex items-center space-x-3 transition-all ${
                  currentStep === 1
                    ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300'
                    : currentStep > 1
                    ? 'bg-slate-700/60 text-slate-300'
                    : 'bg-slate-900/60 text-slate-500'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs ${
                    currentStep === 1
                      ? 'bg-emerald-500 text-slate-950 shadow-md'
                      : currentStep > 1
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {currentStep > 1 ? <Check className="w-4 h-4" /> : '১'}
                </div>
                <div className="hidden sm:block">
                  <p className="font-bold text-xs leading-none">শিক্ষার্থীর তথ্য</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">ব্যক্তিগত ও শিক্ষা</p>
                </div>
              </div>

              <div
                className={`p-3 rounded-2xl flex items-center space-x-3 transition-all ${
                  currentStep === 2
                    ? 'bg-amber-500/20 border border-amber-500/40 text-amber-300'
                    : currentStep > 2
                    ? 'bg-slate-700/60 text-slate-300'
                    : 'bg-slate-900/60 text-slate-500'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs ${
                    currentStep === 2
                      ? 'bg-amber-500 text-slate-950 shadow-md'
                      : currentStep > 2
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {currentStep > 2 ? <Check className="w-4 h-4" /> : '২'}
                </div>
                <div className="hidden sm:block">
                  <p className="font-bold text-xs leading-none">অভিভাবক ও ঠিকানা</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">যোগাযোগের বিবরণ</p>
                </div>
              </div>

              <div
                className={`p-3 rounded-2xl flex items-center space-x-3 transition-all ${
                  currentStep === 3
                    ? 'bg-indigo-500/20 border border-indigo-500/40 text-indigo-300'
                    : 'bg-slate-900/60 text-slate-500'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs ${
                    currentStep === 3
                      ? 'bg-indigo-500 text-white shadow-md'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  ৩
                </div>
                <div className="hidden sm:block">
                  <p className="font-bold text-xs leading-none">আবেদন ফি ও TrxID</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">অনলাইন পেমেন্ট</p>
                </div>
              </div>
            </div>

            {/* Error Alert */}
            {stepError && (
              <div className="p-3.5 rounded-2xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs font-bold flex items-center space-x-2 animate-in slide-in-from-top-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{stepError}</span>
              </div>
            )}

            {/* ========================================================================= */}
            {/* STEP 1: STUDENT PERSONAL & ACADEMIC INFO */}
            {/* ========================================================================= */}
            {currentStep === 1 && (
              <div className="space-y-5 animate-in fade-in">
                <div className="flex items-center space-x-2 text-emerald-400 font-black text-sm pb-2 border-b border-slate-700/60">
                  <User className="w-4 h-4" />
                  <span>১. শিক্ষার্থীর ব্যক্তিগত ও ব্যাচ নির্বাচন (Student Information)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">শিক্ষার্থীর পূর্ণ নাম (বাংলায়) *</label>
                    <input
                      type="text"
                      required
                      placeholder="যেমন: মুহতাসিম ফুয়াদ"
                      value={formData.studentNameBn}
                      onChange={(e) => setFormData({ ...formData, studentNameBn: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-600 bg-slate-900 font-bold text-white focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">শিক্ষার্থীর পুরো নাম (ইংরেজিতে) *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Muhtasim Fuad"
                      value={formData.studentNameEn}
                      onChange={(e) => setFormData({ ...formData, studentNameEn: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-600 bg-slate-900 font-bold text-white focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">ভর্তির কাঙ্ক্ষিত শ্রেণি (Class) *</label>
                    <select
                      value={formData.className}
                      onChange={(e) => handleClassChange(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-600 bg-slate-900 font-bold text-white focus:ring-2 focus:ring-emerald-500"
                    >
                      <optgroup label="👶 প্রাক-প্রাথমিক (Pre-Primary)">
                        {classesList.filter(c => c.category === 'PRE_PRIMARY').map(c => (
                          <option key={c.id} value={c.name}>{c.labelBn}</option>
                        ))}
                      </optgroup>
                      <optgroup label="🎒 প্রাথমিক (Primary ১-৫ম)">
                        {classesList.filter(c => c.category === 'PRIMARY').map(c => (
                          <option key={c.id} value={c.name}>{c.labelBn}</option>
                        ))}
                      </optgroup>
                      <optgroup label="📚 নিম্ন মাধ্যমিক (Junior Secondary ৬-৮ম)">
                        {classesList.filter(c => c.category === 'JUNIOR_SECONDARY').map(c => (
                          <option key={c.id} value={c.name}>{c.labelBn}</option>
                        ))}
                      </optgroup>
                      <optgroup label="🎯 মাধ্যমিক (Secondary ৯-১০ম / SSC)">
                        {classesList.filter(c => c.category === 'SECONDARY').map(c => (
                          <option key={c.id} value={c.name}>{c.labelBn}</option>
                        ))}
                      </optgroup>
                      <optgroup label="🎓 উচ্চ মাধ্যমিক (HSC একাদশ-দ্বাদশ)">
                        {classesList.filter(c => c.category === 'HIGHER_SECONDARY').map(c => (
                          <option key={c.id} value={c.name}>{c.labelBn}</option>
                        ))}
                      </optgroup>
                    </select>
                  </div>

                  {/* Dynamic Group Field for Class 9 to 12 */}
                  {requiresGroup && (
                    <div>
                      <label className="block font-bold text-amber-300 mb-1">
                        বিভাগ (Group) *
                      </label>
                      <select
                        value={formData.group || ''}
                        onChange={(e) => setFormData({ ...formData, group: e.target.value })}
                        required={requiresGroup}
                        className="w-full p-2.5 rounded-xl border border-amber-500/50 bg-slate-900 font-bold text-white focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="">নির্বাচন করুন...</option>
                        {(settings?.academic?.groups || ['বিজ্ঞান', 'মানবিক', 'ব্যবসায় শিক্ষা']).map((grp) => (
                          <option key={grp} value={grp}>{grp}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* 1. Dynamic Batch Options */}
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">
                      কাঙ্ক্ষিত ব্যাচ (ঐচ্ছিক) * {loadingBatches && <span className="text-[10px] text-emerald-400 font-normal">(লোড হচ্ছে...)</span>}
                    </label>
                    <select
                      value={formData.batchName}
                      onChange={(e) => setFormData({ ...formData, batchName: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-600 bg-slate-900 font-bold text-emerald-400 focus:ring-2 focus:ring-emerald-500"
                    >
                      {batches.length > 0 ? (
                        batches.map((b) => (
                          <option key={b.id} value={`${b.nameBn || b.name} (${b.timeSlot || 'সকাল ৮:০০ - ১০:০০'})`}>
                            {b.nameBn || b.name} — ⏰ {b.timeSlot || 'সকাল ৮:০০ - ১০:০০'}
                          </option>
                        ))
                      ) : (
                        batchOptionsList.map((batchOption, idx) => (
                          <option key={idx} value={batchOption}>
                            {batchOption}
                          </option>
                        ))
                      )}
                    </select>
                  </div>

                  {/* 2. Religion Field */}
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">ধর্ম (Religion) *</label>
                    <select
                      value={formData.religion}
                      onChange={(e) => setFormData({ ...formData, religion: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-600 bg-slate-900 font-bold text-white focus:ring-2 focus:ring-emerald-500"
                    >
                      {religionOptions.map((rel) => (
                        <option key={rel.value} value={rel.value}>
                          {rel.labelBn}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">রক্তের গ্রুপ (Blood Group)</label>
                    <select
                      value={formData.bloodGroup}
                      onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-600 bg-slate-900 font-bold text-white focus:ring-2 focus:ring-emerald-500"
                    >
                      {bloodGroups.map((bg) => (
                        <option key={bg} value={bg}>{bg}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">জন্ম তারিখ (Date of Birth) *</label>
                    <input
                      type="date"
                      required
                      value={formData.dob}
                      onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-600 bg-slate-900 font-medium text-white focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">লিঙ্গ (Gender) *</label>
                    <select
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-600 bg-slate-900 font-medium text-white focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="MALE">ছাত্র (Male)</option>
                      <option value="FEMALE">ছাত্রী (Female)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">পূর্ববর্তী স্কুলের নাম</label>
                    <input
                      type="text"
                      placeholder="যেমন: সেন্ট যোসেফ উচ্চ বিদ্যালয়"
                      value={formData.previousSchool}
                      onChange={(e) => setFormData({ ...formData, previousSchool: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-600 bg-slate-900 font-medium text-white focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">পূর্ববর্তী পরীক্ষার জিপিএ (GPA)</label>
                    <input
                      type="text"
                      placeholder="যেমন: ৫.০০ (GPA 5.00)"
                      value={formData.previousGpa}
                      onChange={(e) => setFormData({ ...formData, previousGpa: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-600 bg-slate-900 font-bold text-amber-400 focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  {/* Student Photo Upload */}
                  <div className="sm:col-span-2 p-3.5 bg-slate-900/90 rounded-2xl border border-slate-700/80">
                    <UniversalFileUploader
                      label="শিক্ষার্থীর রঙিন পাসপোর্ট সাইজ ছবি (Student Photo)"
                      value={formData.photoUrl}
                      fileName={formData.photoFileName}
                      previewType="image"
                      accept="*/*"
                      maxMb={100}
                      helperText="সরাসরি ফোন/পিসি থেকে ছবি নির্বাচন করুন অথবা গুগল ড্রাইভ লিংক দিন (সর্বোচ্চ 10MB)"
                      onChange={({ fileUrl, url, fileName }) => {
                        setFormData(prev => ({
                          ...prev,
                          photoUrl: fileUrl || url || '',
                          photoFileName: fileName || ''
                        }));
                      }}
                    />
                  </div>
                </div>

                {/* Step 1 Actions */}
                <div className="flex items-center justify-end pt-4 border-t border-slate-700">
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 flex items-center space-x-2 transition-all active:scale-95"
                  >
                    <span>পরবর্তী ধাপ (অভিভাবক তথ্য)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* STEP 2: GUARDIAN & CONTACT DETAILS */}
            {/* ========================================================================= */}
            {currentStep === 2 && (
              <div className="space-y-5 animate-in fade-in">
                <div className="flex items-center space-x-2 text-amber-400 font-black text-sm pb-2 border-b border-slate-700/60">
                  <Users className="w-4 h-4" />
                  <span>২. অভিভাবকের বিবরণ ও যোগাযোগ (Guardian Details)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">অভিভাবকের পূর্ণ নাম *</label>
                    <input
                      type="text"
                      required
                      placeholder="পিতা / মাতার পূর্ণ নাম"
                      value={formData.guardianName}
                      onChange={(e) => setFormData({ ...formData, guardianName: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-600 bg-slate-900 font-bold text-white focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">অভিভাবকের মোবাইল নম্বর *</label>
                    <input
                      type="tel"
                      required
                      placeholder="017XXXXXXXX"
                      value={formData.guardianPhone}
                      onChange={(e) => setFormData({ ...formData, guardianPhone: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-600 bg-slate-900 font-mono font-bold text-white focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">অভিভাবকের পেশা</label>
                    <input
                      type="text"
                      placeholder="যেমন: সরকারি চাকরি / ব্যবসা / শিক্ষকতা"
                      value={formData.guardianProfession}
                      onChange={(e) => setFormData({ ...formData, guardianProfession: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-600 bg-slate-900 font-medium text-white focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">অভিভাবকের ইমেইল (ঐচ্ছিক)</label>
                    <input
                      type="email"
                      placeholder="guardian@gmail.com"
                      value={formData.guardianEmail}
                      onChange={(e) => setFormData({ ...formData, guardianEmail: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-600 bg-slate-900 font-medium text-white focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-bold text-slate-300 mb-1">বর্তমান ও স্থায়ী ঠিকানা *</label>
                    <input
                      type="text"
                      required
                      placeholder="বাড়ি নং, রোড, থানা, জেলা"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-600 bg-slate-900 font-medium text-white focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-bold text-slate-300 mb-1">বিশেষ কোনো মন্তব্য বা অনুরোধ (ঐচ্ছিক)</label>
                    <textarea
                      rows={2}
                      placeholder="স্কুল বা শিক্ষার্থীর কোনো বিশেষ চাহিদা থাকলে এখানে উল্লেখ করুন..."
                      value={formData.remarks}
                      onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-600 bg-slate-900 font-medium text-white focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  {/* Document Uploads: Birth Certificate & Marksheet */}
                  <div className="sm:col-span-2 space-y-4 pt-2 border-t border-slate-700/60">
                    <div className="p-3.5 bg-slate-900/90 rounded-2xl border border-slate-700/80">
                      <UniversalFileUploader
                        label="জন্ম নিবন্ধন / জাতীয় পরিচয়পত্রের কপি (Birth Certificate / NID)"
                        value={formData.birthCertUrl}
                        fileName={formData.birthCertFileName}
                        accept="*/*"
                        maxMb={100}
                        helperText="জন্ম নিবন্ধন বা এনআইডির ছবি / পিডিএফ বা গুগল ড্রাইভ লিংক"
                        onChange={({ fileUrl, url, fileName }) => {
                          setFormData(prev => ({
                            ...prev,
                            birthCertUrl: fileUrl || url || '',
                            birthCertFileName: fileName || ''
                          }));
                        }}
                      />
                    </div>

                    <div className="p-3.5 bg-slate-900/90 rounded-2xl border border-slate-700/80">
                      <UniversalFileUploader
                        label="পূর্ববর্তী শ্রেণির মার্কশিট / প্রশংসাপত্র (Previous Marksheet / Testimonial)"
                        value={formData.marksheetUrl}
                        fileName={formData.marksheetFileName}
                        accept="*/*"
                        maxMb={100}
                        helperText="সর্বশেষ বার্ষিক পরীক্ষার রেজাল্ট কার্ড বা প্রশংসাপত্রের কপি"
                        onChange={({ fileUrl, url, fileName }) => {
                          setFormData(prev => ({
                            ...prev,
                            marksheetUrl: fileUrl || url || '',
                            marksheetFileName: fileName || ''
                          }));
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Step 2 Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="px-5 py-2.5 rounded-xl border border-slate-600 text-slate-300 hover:bg-slate-700 font-bold text-xs flex items-center space-x-1.5 transition-all"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>পূর্ববর্তী ধাপ</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-xs shadow-lg shadow-amber-600/30 flex items-center space-x-2 transition-all active:scale-95"
                  >
                    <span>পরবর্তী ধাপ (আবেদন ফি ও পেমেন্ট)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* STEP 3: APPLICATION FEE & ONLINE PAYMENT */}
            {/* ========================================================================= */}
            {currentStep === 3 && (
              <div className="space-y-5 animate-in fade-in">
                <div className="flex items-center space-x-2 text-indigo-400 font-black text-sm pb-2 border-b border-slate-700/60">
                  <CreditCard className="w-4 h-4" />
                  <span>৩. আবেদন ফি ও মোবাইল ব্যাংকিং পেমেন্ট (Payment & TrxID)</span>
                </div>

                {/* Fee Summary Banner */}
                <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="space-y-1 text-center sm:text-left">
                    <span className="text-[11px] text-indigo-300 font-bold uppercase tracking-wider block">নির্ধারিত অনলাইন আবেদন ফি</span>
                    <p className="text-2xl font-black text-white font-mono">
                      ৳ {totalPayable.toFixed(2)}{' '}
                      <span className="text-xs text-slate-400 font-normal">
                        (মূল ফি: ৳{baseAmount} {calculatedCharge > 0 ? `+ ${formData.paymentMethod} চার্জ: ৳${calculatedCharge.toFixed(2)}` : ''})
                      </span>
                    </p>
                    <p className="text-[11px] text-slate-400">ভর্তি ফরম প্রসেসিং ও লিখিত/মৌখিক পরীক্ষার ফি বাবদ</p>
                  </div>

                  <div className="px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-black">
                    🔒 সুরক্ষিত পেমেন্ট গেটওয়ে
                  </div>
                </div>

                {/* Payment Methods Selection */}
                <div className="space-y-2">
                  <label className="block font-bold text-slate-300">পেমেন্ট মেথড নির্বাচন করুন *</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {paymentMethods.map((pm) => {
                      const isSelected = selectedMethod?.provider === pm.provider || formData.paymentMethod === pm.provider;
                      const pmCharge = calculateCharge(pm.provider, baseAmount);
                      return (
                        <button
                          key={pm.id || pm.provider}
                          type="button"
                          onClick={() => {
                            setSelectedMethod(pm);
                            setFormData({ ...formData, paymentMethod: pm.provider });
                          }}
                          className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center space-y-1 ${
                            isSelected
                              ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-600/30 scale-105'
                              : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white hover:border-slate-500'
                          }`}
                        >
                          <span className="font-black text-sm">{pm.provider}</span>
                          <span className="text-[10px] opacity-80">
                            {pmCharge.charge > 0 ? `চার্জ: +${pmCharge.rate}` : 'চার্জ ফ্রি (0%)'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Real-Time Cost Breakdown */}
                <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-700/80 text-sm mt-3 space-y-2">
                  <div className="flex justify-between text-slate-400 font-medium">
                    <span>মূল ভর্তি ফি:</span>
                    <span className="font-mono font-bold text-white">৳ {baseAmount.toLocaleString('en-BD')}</span>
                  </div>
                  {formData.paymentMethod === 'bKash' || formData.paymentMethod === 'Nagad' || formData.paymentMethod === 'Rocket' ? (
                    <div className="flex justify-between text-rose-400 font-medium">
                      <span>{formData.paymentMethod} খরচ (Charge {chargeRate}):</span>
                      <span className="font-mono font-bold">+ ৳ {calculatedCharge.toFixed(2)}</span>
                    </div>
                  ) : (
                    <div className="flex justify-between text-emerald-400 font-medium text-xs">
                      <span>{formData.paymentMethod} খরচ (Charge):</span>
                      <span className="font-bold">ফ্রি (৳ ০.০০)</span>
                    </div>
                  )}
                  <div className="flex justify-between text-white font-black border-t border-slate-700 pt-2 mt-2 text-base">
                    <span>সর্বমোট পরিশোধযোগ্য:</span>
                    <span className="text-emerald-400 font-mono text-lg font-black">৳ {totalPayable.toFixed(2)}</span>
                  </div>
                </div>

                {/* Selected Method Instructions */}
                {selectedMethod && (
                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-700 space-y-3">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pb-2 border-b border-slate-800">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">
                          {selectedMethod.provider} {selectedMethod.accountType} নম্বর:
                        </span>
                        <span className="text-lg font-black text-amber-400 font-mono select-all">
                          {selectedMethod.accountNumber}
                        </span>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-black">
                        পরিশোধযোগ্য: ৳ {totalPayable.toFixed(2)}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      💡 <strong>পেমেন্ট নিয়মাবলী:</strong> {selectedMethod.instructions || `আপনার ${selectedMethod.provider} অ্যাপ থেকে চার্জসহ সর্বমোট ৳${totalPayable.toFixed(2)} Send Money / Payment করুন এবং নিচের ঘরে প্রেরক নম্বর ও TrxID লিখুন।`}
                    </p>
                  </div>
                )}

                {/* Sender Mobile & TrxID inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">প্রেরকের মোবাইল নম্বর (Sender Number) *</label>
                    <input
                      type="tel"
                      required
                      placeholder="01XXXXXXXXX"
                      value={formData.paymentNumber}
                      onChange={(e) => setFormData({ ...formData, paymentNumber: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-600 bg-slate-900 font-mono font-bold text-white focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">পেমেন্ট ট্রানজেকশন আইডি (TrxID) *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. BK8929XKJ1"
                      value={formData.paymentTrxId}
                      onChange={(e) => setFormData({ ...formData, paymentTrxId: e.target.value.toUpperCase() })}
                      className="w-full p-2.5 rounded-xl border border-slate-600 bg-slate-900 font-mono font-bold text-amber-400 uppercase focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  {/* Payment Slip / Voucher Upload */}
                  <div className="sm:col-span-2 p-3.5 bg-slate-900/90 rounded-2xl border border-slate-700/80">
                    <UniversalFileUploader
                      label="পেমেন্ট রসিদ / স্ক্রিনশট আপলোড (Payment Slip / Screenshot - Optional)"
                      value={formData.paymentSlipUrl}
                      fileName={formData.paymentSlipFileName}
                      accept="*/*"
                      maxMb={100}
                      helperText="বিকাশ/নগদ এর কনফার্মেশন মেসেজের স্ক্রিনশট বা ব্যাংক রসিদের ছবি"
                      onChange={({ fileUrl, url, fileName }) => {
                        setFormData(prev => ({
                          ...prev,
                          paymentSlipUrl: fileUrl || url || '',
                          paymentSlipFileName: fileName || ''
                        }));
                      }}
                    />
                  </div>
                </div>

                {/* Step 3 Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="px-5 py-2.5 rounded-xl border border-slate-600 text-slate-300 hover:bg-slate-700 font-bold text-xs flex items-center space-x-1.5 transition-all"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>পূর্ববর্তী ধাপ</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="px-8 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm shadow-xl shadow-emerald-600/30 flex items-center space-x-2 transition-all transform active:scale-95 disabled:opacity-50"
                  >
                    {submitting ? (
                      <span>আবেদন জমা হচ্ছে...</span>
                    ) : (
                      <>
                        <ShieldCheck className="w-5 h-5" />
                        <span>ভর্তি আবেদন ও পেমেন্ট সম্পন্ন করুন</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: APPLICATION TRACKING */}
        {/* ========================================================================= */}
        {activeTab === 'track' && (
          <div className="bg-slate-800/90 backdrop-blur-md rounded-3xl border border-slate-700/80 p-6 sm:p-8 shadow-2xl space-y-6 text-xs text-slate-200">
            <div className="text-center max-w-lg mx-auto space-y-2">
              <h3 className="text-lg font-black text-white">আবেদনের বর্তমান অবস্থা যাচাই (Track Status)</h3>
              <p className="text-slate-400">
                ভর্তি আবেদন করার সময় প্রাপ্ত <span className="text-amber-400 font-bold">ট্র্যাকিং কোড (যেমন: ADM-2026-0801)</span> অথবা অভিভাবকের মোবাইল নম্বর লিখুন।
              </p>

              <form onSubmit={handleTrack} className="flex gap-2 pt-3">
                <input
                  type="text"
                  required
                  placeholder="ট্র্যাকিং আইডি বা মোবাইল নম্বর লিখুন..."
                  value={trackQuery}
                  onChange={(e) => setTrackQuery(e.target.value)}
                  className="w-full p-3 rounded-2xl border border-slate-600 bg-slate-900 font-mono font-bold text-white focus:ring-2 focus:ring-indigo-500 text-sm"
                />
                <button
                  type="submit"
                  disabled={loadingTrack}
                  className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center space-x-1.5 flex-shrink-0"
                >
                  <Search className="w-4 h-4" />
                  <span>ট্র্যাক করুন</span>
                </button>
              </form>
            </div>

            {trackError && (
              <div className="p-4 rounded-2xl bg-rose-950/60 border border-rose-800 text-rose-300 text-center font-bold">
                {trackError}
              </div>
            )}

            {trackResult && (
              <div className="bg-slate-900 p-6 rounded-3xl border border-slate-700 shadow-xl space-y-5 animate-in fade-in">
                <div className="flex flex-col sm:flex-row items-center justify-between pb-4 border-b border-slate-800 gap-3">
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 font-bold uppercase block">ট্র্যাকিং কোড:</span>
                    <span className="text-lg font-black text-amber-400 font-mono">{trackResult.trackingId}</span>
                  </div>

                  <div className="text-center sm:text-right">
                    <span className={`px-3 py-1 rounded-full text-xs font-black border ${
                      trackResult.status === 'APPROVED'
                        ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                        : trackResult.status === 'REJECTED'
                        ? 'bg-rose-500/20 border-rose-400 text-rose-300'
                        : 'bg-amber-500/20 border-amber-400 text-amber-300'
                    }`}>
                      {trackResult.status === 'APPROVED'
                        ? '✓ আবেদন অনুমোদিত (APPROVED)'
                        : trackResult.status === 'REJECTED'
                        ? '✕ আবেদন বাতিল (REJECTED)'
                        : '⏳ যাচাই প্রক্রিয়ায় অপেক্ষমাণ (PENDING REVIEW)'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-semibold">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">শিক্ষার্থীর নাম</span>
                    <span className="font-bold text-white text-sm mt-0.5">{trackResult.studentNameBn} ({trackResult.studentNameEn})</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">শ্রেণি ও ব্যাচ</span>
                    <span className="font-bold text-slate-200 mt-0.5">{trackResult.className} • {trackResult.batchName || 'সকাল ব্যাচ'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">অভিভাবকের মোবাইল</span>
                    <span className="font-mono font-bold text-slate-200 mt-0.5">{trackResult.guardianPhone}</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-800/80 rounded-2xl border border-slate-700 flex items-center justify-between text-xs">
                  <span className="text-slate-400">
                    পেমেন্ট স্ট্যাটাস: <strong className="text-emerald-400 font-bold">{trackResult.paymentTrxId ? `পরিশোধিত (TrxID: ${trackResult.paymentTrxId})` : 'যাচাই হচ্ছে'}</strong>
                  </span>
                  <span className="text-slate-500 text-[11px]">
                    তারিখ: {new Date(trackResult.createdAt).toLocaleDateString('bn-BD')}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* MODAL: PRINTABLE ADMISSION SLIP */}
      {/* ========================================================================= */}
      {showSlipModal && submittedData && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white text-slate-900 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 my-6 border border-slate-200">
            {/* Slip Header */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div className="flex items-center space-x-3">
                <img
                  src={settings?.logoUrl || '/logo.png'}
                  alt="Academy Logo"
                  className="w-12 h-12 object-contain"
                />
                <div>
                  <h2 className="font-black text-lg text-slate-900">{settings?.academyNameBn || 'নেক্সটজেন একাডেমি'}</h2>
                  <p className="text-xs text-slate-500 font-semibold">ডিজিটাল ভর্তি আবেদন ও পেমেন্ট মানি স্লিপ</p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">ট্র্যাকিং কোড</span>
                <span className="text-base font-black text-indigo-700 font-mono">{submittedData.trackingId}</span>
              </div>
            </div>

            {/* Slip Body Details */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <span className="text-slate-400 block text-[11px]">শিক্ষার্থীর নাম</span>
                  <span className="font-bold text-slate-800 text-sm">{submittedData.studentNameBn}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">ইংরেজি নাম</span>
                  <span className="font-semibold text-slate-700">{submittedData.studentNameEn}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">শ্রেণি</span>
                  <span className="font-bold text-indigo-700">{submittedData.className}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">কাঙ্ক্ষিত ব্যাচ</span>
                  <span className="font-bold text-slate-800">{submittedData.batchName || formData.batchName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">ধর্ম (Religion)</span>
                  <span className="font-semibold text-slate-700">{submittedData.religion || formData.religion}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">রক্তের গ্রুপ ও লিঙ্গ</span>
                  <span className="font-semibold text-slate-700">{submittedData.bloodGroup} • {submittedData.gender}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">অভিভাবকের নাম</span>
                  <span className="font-bold text-slate-800">{submittedData.guardianName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">অভিভাবকের ফোন</span>
                  <span className="font-mono font-bold text-slate-800">{submittedData.guardianPhone}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">পেমেন্ট TrxID</span>
                  <span className="font-mono font-black text-emerald-700 text-xs">{submittedData.paymentTrxId || formData.paymentTrxId}</span>
                </div>
              </div>
            </div>

            {/* Verification Notice */}
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800 flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>
                আপনার ভর্তি আবেদন ও ফি সফলভাবে জমা হয়েছে। একাডেমি কর্তৃপক্ষ আপনার আবেদনটি যাচাই করার পর এসএমএস দিয়ে জানিয়ে দেবে।
              </span>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end space-x-3 pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setShowSlipModal(false)}
                className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100"
              >
                বন্ধ করুন
              </button>
              <button
                type="button"
                onClick={handlePrint}
                className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md flex items-center space-x-1.5 active:scale-95"
              >
                <Printer className="w-4 h-4" />
                <span>স্লিপ প্রিন্ট / PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
