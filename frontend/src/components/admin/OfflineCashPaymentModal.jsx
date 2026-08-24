import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { studentAPI, curriculumAPI, accountsAPI } from '../../services/api';
import UniversalFileUploader from '../common/UniversalFileUploader';
import confetti from 'canvas-confetti';
import {
  Banknote,
  Search,
  Filter,
  User,
  GraduationCap,
  Calendar,
  CheckCircle2,
  AlertCircle,
  X,
  Plus,
  Receipt,
  Sparkles,
  Phone,
  ShieldCheck,
  Check,
  Printer
} from 'lucide-react';

const feeTypePresets = [
  'মাসিক টিউশন ফি (Monthly Tuition Fee)',
  'নতুন ভর্তি ও সেশন ফি (Admission & Session Fee)',
  'অর্ধ-বার্ষিক / বার্ষিক পরীক্ষার ফি (Exam Fee)',
  'মডেল টেস্ট ও স্পেশাল কোচিং ফি (Coaching Fee)',
  'বোর্ড রেজিস্ট্রেশন ও ফরম পূরণ ফি (Board Reg Fee)',
  'আইডি কার্ড, ডায়েরি ও প্রশংসাপত্র ফি (ID & Docs Fee)',
  'ল্যাব, কম্পিউটার ও লাইব্রেরি ফি (Lab & Library)',
  'অন্যান্য বিবিধ ফি (Miscellaneous Fee)'
];

const monthsList = [
  'জানুয়ারি ২০২৬',
  'ফেব্রুয়ারি ২০২৬',
  'মার্চ ২০২৬',
  'এপ্রিল ২০২৬',
  'মে ২০২৬',
  'জুন ২০২৬',
  'জুলাই ২০২৬',
  'আগস্ট ২০২৬ (চলতি মাস)',
  'সেপ্টেম্বর ২০২৬',
  'অক্টোবর ২০২৬',
  'নভেম্বর ২০২৬',
  'ডিসেম্বর ২০২৬'
];

export default function OfflineCashPaymentModal({ isOpen, onClose, onPaymentSuccess }) {
  const { t, lang } = useLanguage();
  const { user } = useAuth();

  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  // Student Search / Selection State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClassId, setSelectedClassId] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Form State
  const [feeType, setFeeType] = useState(feeTypePresets[0]);
  const [month, setMonth] = useState('আগস্ট ২০২৬ (চলতি মাস)');
  const [year, setYear] = useState(2026);
  const [baseAmount, setBaseAmount] = useState(3000);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [discountReason, setDiscountReason] = useState('মেধাবৃত্তি (Merit Scholarship)');
  const [receivedBy, setReceivedBy] = useState(user?.name || 'অফিস ক্যাশ কাউন্টার');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [remarks, setRemarks] = useState('সরাসরি ক্যাশ কাউন্টারে নগদ পরিশোধ করা হয়েছে।');
  const [voucherPhotoUrl, setVoucherPhotoUrl] = useState('');
  const [voucherFileName, setVoucherFileName] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchInitialData();
    }
  }, [isOpen]);

  const fetchInitialData = async () => {
    setLoadingData(true);
    try {
      const [stRes, clsRes] = await Promise.all([
        studentAPI.getAll(),
        curriculumAPI.getClasses()
      ]);
      if (stRes.success && stRes.data) setStudents(stRes.data);
      if (clsRes.success && clsRes.data) setClasses(clsRes.data);

      if (stRes.success && stRes.data?.length > 0 && !selectedStudent) {
        setSelectedStudent(stRes.data[0]);
      }
    } catch (err) {
      console.error('Failed to load students for cash collection:', err);
    } finally {
      setLoadingData(false);
    }
  };

  if (!isOpen) return null;

  // Filter students
  const filteredStudents = students.filter((s) => {
    const userObj = s.user || {};
    const guardian = s.guardians?.[0]?.parent || {};
    const matchSearch =
      !searchTerm ||
      userObj.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.studentIdNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(s.rollNo).includes(searchTerm) ||
      userObj.phone?.includes(searchTerm) ||
      guardian.phone?.includes(searchTerm);

    const matchClass = !selectedClassId || String(s.classId) === String(selectedClassId);
    return matchSearch && matchClass;
  });

  const netPayable = Math.max(0, Number(baseAmount || 0) - Number(discountAmount || 0));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedStudent) {
      setError('দয়া করে একজন শিক্ষার্থী নির্বাচন করুন।');
      return;
    }

    if (netPayable <= 0 && Number(baseAmount) <= 0) {
      setError('টাকার পরিমাণ ০ এর বেশি হতে হবে।');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const payload = {
        studentId: selectedStudent.id,
        feeType,
        month,
        year: Number(year) || 2026,
        baseAmount: Number(baseAmount),
        discountAmount: Number(discountAmount) || 0,
        discountReason: Number(discountAmount) > 0 ? discountReason : '',
        paidAmount: netPayable,
        receivedBy,
        paymentDate,
        remarks
      };

      const res = await accountsAPI.collectOfflineCash(payload);
      if (res.success && res.data?.receipt) {
        try {
          confetti({
            particleCount: 90,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch (e) {
          // ignore
        }

        onPaymentSuccess(res.data.receipt);
      } else {
        throw new Error(res.error?.message || 'ক্যাশ ফি সংগ্রহ ব্যর্থ হয়েছে');
      }
    } catch (err) {
      setError(err.message || 'ক্যাশ এন্ট্রি প্রসেসিং এরর');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden my-6 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-5 text-white flex items-center justify-between border-b border-slate-800 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 shadow-inner">
              <Banknote className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-black text-base">অফলাইন / ক্যাশ ফি কালেকশন এন্ট্রি</h3>
              <p className="text-xs text-slate-300 font-medium">
                সরাসরি নগদ অর্থ গ্রহণ, অটো রসিদ জেনারেশন ও তাৎক্ষণিক মানি রিসিট প্রিন্ট
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1 bg-slate-50/40">
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Step 1: Search and Select Student */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center space-x-1.5">
                <GraduationCap className="w-4 h-4 text-indigo-600" />
                <span>১. শিক্ষার্থী নির্বাচন করুন (Select Student) *</span>
              </label>
              {selectedStudent && (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black border border-emerald-200">
                  নির্বাচিত: {selectedStudent.user?.name}
                </span>
              )}
            </div>

            {/* Search inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
              <div className="sm:col-span-8 relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="শিক্ষার্থীর নাম, রোল, আইডি বা ফোন নম্বর দিয়ে খুঁজুন..."
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              </div>

              <div className="sm:col-span-4">
                <select
                  value={selectedClassId}
                  onChange={(e) => setSelectedClassId(e.target.value)}
                  className="w-full py-2 px-3 text-xs font-bold rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">সকল শ্রেণি (All Classes)</option>
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.nameBn || cls.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Quick Students Selection Grid */}
            <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1 divide-y divide-slate-100 border rounded-xl p-1 bg-slate-50/50">
              {filteredStudents.length === 0 ? (
                <div className="p-3 text-center text-xs text-slate-400 font-medium">
                  কোনো শিক্ষার্থী পাওয়া যায়নি
                </div>
              ) : (
                filteredStudents.slice(0, 8).map((st) => {
                  const isSelected = selectedStudent?.id === st.id;
                  return (
                    <div
                      key={st.id}
                      onClick={() => setSelectedStudent(st)}
                      className={`p-2 rounded-xl flex items-center justify-between cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-indigo-600 text-white font-bold shadow-sm'
                          : 'hover:bg-white text-slate-800'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                            isSelected ? 'bg-white/20 text-white' : 'bg-indigo-50 text-indigo-700'
                          }`}
                        >
                          {st.user?.name?.slice(0, 1) || 'শ'}
                        </div>
                        <div>
                          <div className="text-xs font-black">{st.user?.name}</div>
                          <div className={`text-[10px] ${isSelected ? 'text-indigo-100' : 'text-slate-500'}`}>
                            {st.class?.nameBn || `শ্রেণি ${st.classId}`} • রোল: #{st.rollNo} • আইডি: {st.studentIdNumber}
                          </div>
                        </div>
                      </div>

                      {isSelected && <Check className="w-4 h-4 text-white flex-shrink-0 mr-1" />}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Step 2: Payment Particulars & Calculation */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <label className="text-xs font-black text-slate-900 uppercase tracking-wider block">
              ২. ফির বিবরণ ও টাকার পরিমাণ (Payment Particulars) *
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-900 mb-1">ফির খাত / শিরোনাম *</label>
                <select
                  value={feeType}
                  onChange={(e) => setFeeType(e.target.value)}
                  className="w-full text-xs font-bold rounded-xl border border-slate-300 p-2.5 bg-slate-50 focus:ring-2 focus:ring-emerald-500"
                >
                  {feeTypePresets.map((preset) => (
                    <option key={preset} value={preset}>
                      {preset}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1">প্রযোজ্য মাস *</label>
                <select
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  className="w-full bg-white border border-slate-300 text-slate-900 font-semibold placeholder:text-slate-400 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm text-xs"
                >
                  {monthsList.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1">শিক্ষাবর্ষ / সাল *</label>
                <input
                  type="number"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full text-xs font-bold rounded-xl border border-slate-300 p-2.5 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1">
                  মূল ফি (Base Tuition/Exam Amount) ৳ *
                </label>
                <input
                  type="number"
                  value={baseAmount}
                  onChange={(e) => setBaseAmount(Number(e.target.value))}
                  placeholder="3000"
                  required
                  className="w-full text-xs font-black text-slate-900 rounded-xl border border-slate-300 p-2.5 font-mono focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1">
                  প্রদত্ত ছাড় / বৃত্তি (Scholarship Waiver) ৳
                </label>
                <input
                  type="number"
                  value={discountAmount}
                  onChange={(e) => setDiscountAmount(Number(e.target.value))}
                  placeholder="0"
                  className="w-full text-xs font-bold text-emerald-800 rounded-xl border border-slate-300 p-2.5 font-mono focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {Number(discountAmount) > 0 && (
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-900 mb-1">ছাড় / স্কলারশিপের কারণ</label>
                  <select
                    value={discountReason}
                    onChange={(e) => setDiscountReason(e.target.value)}
                    className="w-full text-xs font-semibold rounded-xl border border-slate-300 p-2.5 bg-emerald-50 text-emerald-950"
                  >
                    <option value="মেধাবৃত্তি (Merit Scholarship)">মেধাবৃত্তি (Merit Scholarship)</option>
                    <option value="সহোদর ছাড় (Sibling Discount)">সহোদর ভাই-বোন ছাড় (Sibling Discount)</option>
                    <option value="দরিদ্র তহবিল ও বিশেষ বিবেচনা">দরিদ্র তহবিল ও বিশেষ বিবেচনা (Special Waiver)</option>
                    <option value="কোচিং ও অগ্রিম ছাড়">কোচিং ও অগ্রিম ছাড়</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1">আদায়কারী কর্মকর্তা (Received By) *</label>
                <input
                  type="text"
                  value={receivedBy}
                  onChange={(e) => setReceivedBy(e.target.value)}
                  placeholder="নাম ও পদবি"
                  required
                  className="w-full text-xs font-semibold rounded-xl border border-slate-300 p-2.5"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1">পরিশোধের তারিখ (Payment Date) *</label>
                <input
                  type="date"
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                  required
                  className="w-full text-xs font-bold rounded-xl border border-slate-300 p-2.5"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-900 mb-1">মন্তব্য (Remarks / Note)</label>
                <input
                  type="text"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="যেমন: সশরীরে ক্যাশ কাউন্টারে জমা"
                  className="w-full bg-white border border-slate-300 text-slate-900 font-semibold placeholder:text-slate-400 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm text-xs"
                />
              </div>

              {/* Cash Voucher / Bank Slip Upload */}
              <div className="sm:col-span-2 p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
                <UniversalFileUploader
                  label="ক্যাশ ভাউচার / জমা রসিদের স্ক্যান কপি (Cash Voucher / Bank Slip - Optional)"
                  value={voucherPhotoUrl}
                  fileName={voucherFileName}
                  accept="image/*,.pdf"
                  maxMb={100}
                  helperText="কাউন্টার ভাউচার, ব্যাংকের জমা স্লিপের ছবি বা গুগল ড্রাইভ লিংক"
                  onChange={({ fileUrl, url, fileName }) => {
                    setVoucherPhotoUrl(fileUrl || url || '');
                    setVoucherFileName(fileName || '');
                  }}
                />
              </div>
            </div>

            {/* Net Amount Auto-Calculation Box */}
            <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
                  সর্বমোট নগদ আদায়যোগ্য টাকা (Net Cash Received)
                </span>
                <span className="text-xs text-emerald-700 font-medium">
                  মূল ফি ৳ {Number(baseAmount || 0).toLocaleString('en-BD')}
                  {discountAmount > 0 && ` — ছাড় ৳ ${Number(discountAmount).toLocaleString('en-BD')}`}
                </span>
              </div>
              <div className="text-2xl font-black text-emerald-900 font-mono">
                ৳ {netPayable.toLocaleString('en-BD')}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-bold text-xs"
            >
              বাতিল
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs shadow-lg shadow-emerald-600/30 flex items-center space-x-2 disabled:opacity-50 transition-all active:scale-95"
            >
              <Receipt className="w-4 h-4" />
              <span>
                {submitting ? 'সংরক্ষণ হচ্ছে...' : `নগদ ফি আদায় সম্পন্ন করুন (৳ ${netPayable.toLocaleString('en-BD')})`}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
