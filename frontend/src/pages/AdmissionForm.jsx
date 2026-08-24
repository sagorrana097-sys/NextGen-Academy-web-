import React, { useState } from 'react';
import { 
  User, BookOpen, CreditCard, CheckCircle2, ArrowRight, 
  ArrowLeft, Download, ShieldCheck, Tag, Loader2, Sparkles, AlertCircle 
} from 'lucide-react';
import { exportBrandedGraphic } from '../utils/exportBrandedGraphic';

export default function AdmissionForm({ onBackToHome, onNavigateLogin }) {
  const [step, setStep] = useState(1);
  const [isExporting, setIsExporting] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    school: '',
    classLevel: 'Class 9',
    roll: '',
    guardianName: '',
    mobile: '',
    address: '',
    subjects: ['general-math', 'physics', 'chemistry'],
    paymentMethod: 'bkash',
    trxId: '',
  });

  const receiptRef = React.useRef(null);

  const SUBJECT_LIST = [
    { id: 'general-math', name: 'সাধারণ গণিত (General Math)', fee: 800 },
    { id: 'higher-math', name: 'উচ্চতর গণিত (Higher Math)', fee: 800 },
    { id: 'physics', name: 'পদার্থবিজ্ঞান (Physics)', fee: 800 },
    { id: 'chemistry', name: 'রসায়ন (Chemistry)', fee: 800 },
    { id: 'biology', name: 'জীববিজ্ঞান (Biology)', fee: 800 },
    { id: 'ict', name: 'তথ্য ও যোগাযোগ প্রযুক্তি (ICT)', fee: 600 },
    { id: 'english', name: 'ইংরেজি ও গ্রামার (English Grammar)', fee: 600 },
  ];

  const handleSubjectToggle = (id) => {
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects.includes(id)
        ? prev.subjects.filter(s => s !== id)
        : [...prev.subjects, id]
    }));
  };

  const baseFee = formData.subjects.reduce((sum, sId) => {
    const sub = SUBJECT_LIST.find(s => s.id === sId);
    return sum + (sub ? sub.fee : 0);
  }, 0);

  const admissionFee = 500;
  const subtotal = baseFee + admissionFee;
  const totalPayable = Math.max(0, subtotal - discountAmount);

  const applyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (code === 'NEXTGEN50' || code === 'SAGOR50' || code === 'PROMO2026') {
      const discount = Math.round(subtotal * 0.2); // 20% discount
      setDiscountAmount(discount);
      setPromoApplied(true);
    } else {
      alert('দুঃখিত, প্রোমো কোডটি সঠিক নয় বা মেয়াদোত্তীর্ণ। (চেষ্টা করুন: NEXTGEN50)');
    }
  };

  const handleDownloadReceipt = async () => {
    if (!receiptRef.current) return;
    setIsExporting(true);
    try {
      await exportBrandedGraphic(receiptRef.current, {
        fileName: `NextGen_Admission_${formData.roll || 'Receipt'}`,
        cardTitle: 'অনলাইন ভর্তি মানি রিসিট ও নিশ্চিতকরণ কপি',
        scale: 2
      });
    } catch (e) {
      console.error(e);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={onBackToHome}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>হোমপেজে ফিরে যান</span>
          </button>
          <button
            onClick={onNavigateLogin}
            className="text-xs font-bold text-indigo-400 hover:text-indigo-300"
          >
            ইতিমধ্যে একাউন্ট আছে? লগইন করুন
          </button>
        </div>

        {/* Title */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            NextGen Academy অনলাইন ভর্তি ফরম
          </h1>
          <p className="text-xs text-slate-400">
            সহজ ৩টি ধাপে ঘরে বসেই নিশ্চিত করুন আপনার ভর্তির আবেদন
          </p>
        </div>

        {/* Wizard Stepper */}
        <div className="flex items-center justify-between p-4 bg-slate-900 border border-slate-800 rounded-2xl">
          {[
            { n: 1, title: 'ব্যক্তিগত তথ্য', icon: User },
            { n: 2, title: 'বিষয় নির্বাচন', icon: BookOpen },
            { n: 3, title: 'পেমেন্ট ও প্রোমো', icon: CreditCard },
          ].map(s => {
            const Icon = s.icon;
            const isPassed = step > s.n || isSubmitted;
            const isCurrent = step === s.n && !isSubmitted;
            return (
              <div key={s.n} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black transition-all ${
                  isPassed ? 'bg-emerald-600 text-white' : isCurrent ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/40 scale-110' : 'bg-slate-800 text-slate-500'
                }`}>
                  {isPassed ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                </div>
                <span className={`text-xs font-bold hidden sm:inline ${isCurrent ? 'text-white' : 'text-slate-500'}`}>
                  {s.title}
                </span>
              </div>
            );
          })}
        </div>

        {/* Step Content */}
        {!isSubmitted ? (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
            {/* Step 1: Basic Info */}
            {step === 1 && (
              <div className="space-y-4">
                <h3 className="text-base font-black text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                  <User className="w-5 h-5 text-indigo-400" />
                  <span>ধাপ ১: শিক্ষার্থীর প্রাথমিক তথ্য</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="text-slate-400 block mb-1 font-bold">শিক্ষার্থীর পুরো নাম (বাংলা/ইংরেজি) *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      placeholder="যেমন: তানভীর আহমেদ"
                      className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white font-medium focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1 font-bold">পূর্ববর্তী/বর্তমান স্কুলের নাম *</label>
                    <input
                      type="text"
                      value={formData.school}
                      onChange={e => setFormData({ ...formData, school: e.target.value })}
                      placeholder="যেমন: জয়দেবপুর সরকারি পাইলট উচ্চ বিদ্যালয়"
                      className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white font-medium focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1 font-bold">ভর্তিকৃত শ্রেণি *</label>
                    <select
                      value={formData.classLevel}
                      onChange={e => setFormData({ ...formData, classLevel: e.target.value })}
                      className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white font-bold focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="Class 9">নবম শ্রেণি (Class 9)</option>
                      <option value="Class 10">দশম শ্রেণি (Class 10)</option>
                      <option value="SSC Batch">এসএসসি বিশেষ ব্যাচ (SSC Batch)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1 font-bold">শ্রেণি রোল নং (যদি থাকে)</label>
                    <input
                      type="text"
                      value={formData.roll}
                      onChange={e => setFormData({ ...formData, roll: e.target.value })}
                      placeholder="যেমন: ১২"
                      className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white font-medium focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1 font-bold">অভিভাবকের নাম *</label>
                    <input
                      type="text"
                      value={formData.guardianName}
                      onChange={e => setFormData({ ...formData, guardianName: e.target.value })}
                      placeholder="পিতা / মাতার নাম"
                      className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white font-medium focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1 font-bold">মোবাইল নম্বর (এসএমএস নোটিফিকেশন যাবে) *</label>
                    <input
                      type="text"
                      value={formData.mobile}
                      onChange={e => setFormData({ ...formData, mobile: e.target.value })}
                      placeholder="০১৭XXXXXXXX"
                      className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white font-medium focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    onClick={() => {
                      if (!formData.name || !formData.mobile) {
                        alert('অনুগ্রহ করে নাম এবং মোবাইল নম্বর প্রদান করুন।');
                        return;
                      }
                      setStep(2);
                    }}
                    className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs flex items-center gap-2"
                  >
                    <span>পরবর্তী ধাপ: বিষয় নির্বাচন</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Subject Selection */}
            {step === 2 && (
              <div className="space-y-4">
                <h3 className="text-base font-black text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                  <BookOpen className="w-5 h-5 text-indigo-400" />
                  <span>ধাপ ২: যে বিষয়গুলোতে পড়তে চাও (Select Subjects)</span>
                </h3>

                <div className="space-y-2.5">
                  {SUBJECT_LIST.map(sub => {
                    const isSelected = formData.subjects.includes(sub.id);
                    return (
                      <div
                        key={sub.id}
                        onClick={() => handleSubjectToggle(sub.id)}
                        className={`p-3.5 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                          isSelected
                            ? 'bg-indigo-950/40 border-indigo-500 text-white shadow-md'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {}}
                            className="rounded accent-indigo-600 w-4 h-4"
                          />
                          <span className="text-xs font-bold">{sub.name}</span>
                        </div>
                        <span className="text-xs font-mono font-bold text-indigo-300">৳{sub.fee}/মাস</span>
                      </div>
                    );
                  })}
                </div>

                <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-bold">নির্বাচিত বিষয় সংখ্যা: {formData.subjects.length} টি</span>
                  <span className="text-white font-bold">মাসিক টিউশন ফি: <span className="font-mono text-emerald-400 font-black">৳{baseFee}</span></span>
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    onClick={() => setStep(1)}
                    className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>পূর্ববর্তী ধাপ</span>
                  </button>
                  <button
                    onClick={() => {
                      if (formData.subjects.length === 0) {
                        alert('কমপক্ষে একটি বিষয় নির্বাচন করুন।');
                        return;
                      }
                      setStep(3);
                    }}
                    className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs flex items-center gap-2"
                  >
                    <span>পরবর্তী ধাপ: ফি ও পেমেন্ট</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Payment & Promo */}
            {step === 3 && (
              <div className="space-y-4">
                <h3 className="text-base font-black text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                  <CreditCard className="w-5 h-5 text-indigo-400" />
                  <span>ধাপ ৩: ভর্তি ফি ও পেমেন্ট বিবরণ</span>
                </h3>

                {/* Promo Code Box */}
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Tag className="w-4 h-4 text-amber-400" />
                    <span>প্রোমো কোড / রেফারেল কোড আছে?</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={e => setPromoCode(e.target.value)}
                      placeholder="যেমন: NEXTGEN50"
                      className="flex-1 p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono uppercase text-xs focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                      onClick={applyPromo}
                      className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-black text-xs rounded-xl transition-all"
                    >
                      প্রয়োগ করুন
                    </button>
                  </div>
                  {promoApplied && (
                    <p className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>প্রোমো কোড সফল! ২০% ছাড় (৳{discountAmount}) প্রযোজ্য হয়েছে।</span>
                    </p>
                  )}
                </div>

                {/* Bill Breakdown */}
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>১ম মাসের বিষয়ভিত্তিক টিউশন ফি:</span>
                    <span className="font-mono text-white">৳{baseFee}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>ভর্তি ও রেজিস্ট্রেশন ফি (এককালীন):</span>
                    <span className="font-mono text-white">৳{admissionFee}</span>
                  </div>
                  {promoApplied && (
                    <div className="flex justify-between text-emerald-400 font-bold">
                      <span>প্রোমো কোড ছাড়:</span>
                      <span className="font-mono">-৳{discountAmount}</span>
                    </div>
                  )}
                  <div className="pt-2 border-t border-slate-800 flex justify-between text-sm font-black text-white">
                    <span>সর্বমোট প্রদেয় ফি:</span>
                    <span className="font-mono text-emerald-400 text-base">৳{totalPayable}</span>
                  </div>
                </div>

                {/* Payment Instructions */}
                <div className="p-4 bg-indigo-950/30 border border-indigo-500/30 rounded-2xl text-xs space-y-2">
                  <p className="font-bold text-indigo-300">পেমেন্ট নির্দেশনা (বিকাশ / নগদ / রকেট):</p>
                  <p className="text-slate-300">
                    Send Money বা পেমেন্ট করুন আমাদের হেল্পলাইন নম্বরে: <strong className="text-white font-mono">01792818005</strong>
                  </p>
                  <div>
                    <label className="text-slate-400 block mb-1">পেমেন্ট Transaction ID (TrxID) প্রদান করুন *</label>
                    <input
                      type="text"
                      value={formData.trxId}
                      onChange={e => setFormData({ ...formData, trxId: e.target.value })}
                      placeholder="যেমন: 9J4K2L8X"
                      className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono text-xs focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    onClick={() => setStep(2)}
                    className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>পূর্ববর্তী ধাপ</span>
                  </button>
                  <button
                    onClick={() => {
                      if (!formData.trxId) {
                        alert('অনুগ্রহ করে পেমেন্ট ট্রানজেকশন আইডি (TrxID) প্রদান করুন।');
                        return;
                      }
                      setIsSubmitted(true);
                    }}
                    className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-xs shadow-lg shadow-emerald-600/30 flex items-center gap-2 hover:scale-105 transition-all"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>ভর্তি নিশ্চিত করুন ও রিসিট নিন</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Confirmation Receipt Card */
          <div className="space-y-6">
            <div ref={receiptRef} className="bg-slate-900 border border-emerald-500/40 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-white">ভর্তি সফল ও নিশ্চিত হয়েছে!</h2>
                    <p className="text-xs text-slate-400">NextGen Academy Admission Token #NGA-{Math.floor(100000 + Math.random() * 900000)}</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 font-black text-xs rounded-full">
                  পেইড ও অনুমোদিত
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block">শিক্ষার্থীর নাম:</span>
                  <span className="text-white font-bold">{formData.name}</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block">শ্রেণি:</span>
                  <span className="text-white font-bold">{formData.classLevel}</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block">মোবাইল:</span>
                  <span className="text-white font-mono font-bold">{formData.mobile}</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block">পেমেন্ট ট্রানজেকশন ID:</span>
                  <span className="text-emerald-400 font-mono font-bold">{formData.trxId}</span>
                </div>
              </div>

              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-xs space-y-1.5">
                <p className="font-bold text-slate-300">ভর্তিকৃত বিষয়সমূহ ({formData.subjects.length} টি):</p>
                <div className="flex flex-wrap gap-1.5">
                  {formData.subjects.map(sId => {
                    const sub = SUBJECT_LIST.find(s => s.id === sId);
                    return (
                      <span key={sId} className="px-2.5 py-1 bg-indigo-950/60 border border-indigo-500/30 text-indigo-300 font-bold rounded-lg text-[11px]">
                        {sub?.name.split('(')[0]}
                      </span>
                    );
                  })}
                </div>
                <p className="pt-2 text-right font-bold text-slate-200">
                  পরিশোধিত মোট ফি: <span className="font-mono text-emerald-400 font-black text-sm">৳{totalPayable}</span>
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleDownloadReceipt}
                disabled={isExporting}
                className="flex-1 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 hover:scale-105 transition-all"
              >
                {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                <span>অফিসিয়াল মানি রিসিট ডাউনলোড</span>
              </button>
              <button
                onClick={onNavigateLogin}
                className="px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-black text-xs rounded-xl transition-all"
              >
                ড্যাশবোর্ডে লগইন করুন
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
