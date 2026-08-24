import React, { useState, useEffect, useRef } from 'react';
import {
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Download,
  Printer,
  X,
  Lock,
  ArrowRight,
  Sparkles,
  Receipt,
  FileText,
  Clock,
  Phone,
  Building,
  KeyRound,
  RotateCcw,
  Check,
  ShoppingBag,
  Zap,
  HelpCircle,
  Calendar,
  User,
  QrCode,
  Tag,
  Loader2
} from 'lucide-react';
import html2canvas from 'html2canvas';
import { paymentAPI, studentAPI, referralAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';


const BRAND = {
  name: 'NextGen Academy',
  nameBn: 'NextGen Academy',
  instructor: 'মো: আলমগীর হোসেন (সাগর)',
  founder: 'মো: আলমগীর হোসেন (সাগর)',
  phone: '০১৭৯২৮১৮০০৫',
  address: 'পশ্চিম জয়দেবপুর, বাস-স্ট্যান্ড, গাজীপুর',
  tagline: 'LEARN · GROW · SUCCEED',
  email: 'info@nextgen.edu.bd',
  website: 'https://nextgen.edu.bd'
};

const PAYMENT_GATEWAYS = [
  {
    id: 'BKASH',
    name: 'বিকাশ (bKash)',
    color: 'from-pink-600 to-rose-600',
    border: 'border-pink-500',
    bgLight: 'bg-pink-500/10 text-pink-400',
    badge: 'সবচেয়ে জনপ্রিয়',
    charge: '০% অতিরিক্ত চার্জ',
    logoText: 'bKash'
  },
  {
    id: 'NAGAD',
    name: 'নগদ (Nagad)',
    color: 'from-orange-600 to-amber-600',
    border: 'border-orange-500',
    bgLight: 'bg-orange-500/10 text-orange-400',
    badge: 'তাৎক্ষণিক ক্যাশব্যাক',
    charge: '০% ফি',
    logoText: 'Nagad'
  },
  {
    id: 'ROCKET',
    name: 'রকেট (Rocket / DBBL)',
    color: 'from-purple-600 to-indigo-600',
    border: 'border-purple-500',
    bgLight: 'bg-purple-500/10 text-purple-400',
    badge: 'DBBL সিকিউরড',
    charge: '০% ফি',
    logoText: 'Rocket'
  },
  {
    id: 'UPAY',
    name: 'উপায় (Upay)',
    color: 'from-yellow-500 to-amber-600',
    border: 'border-yellow-500',
    bgLight: 'bg-yellow-500/10 text-yellow-400',
    badge: 'UCB ব্যাংক পার্টনার',
    charge: '০% ফি',
    logoText: 'Upay'
  },
  {
    id: 'CARDS',
    name: 'কার্ড / SSLCommerz',
    color: 'from-blue-600 to-cyan-600',
    border: 'border-blue-500',
    bgLight: 'bg-blue-500/10 text-blue-400',
    badge: 'ভিসা / মাস্টারকার্ড',
    charge: 'ইন্টারনেট ব্যাংকিং',
    logoText: 'SSL/Cards'
  }
];

const STORE_PREMIUM_ITEMS = [
  {
    id: 'PREM-01',
    title: 'এইচএসসি ও এসএসসি স্পেশাল অল-ফর্মুলা নোট বুকলেট',
    category: 'ডিজিটাল ই-বুক',
    amount: 150,
    icon: '📚'
  },
  {
    id: 'PREM-02',
    title: 'অধ্যায়ভিত্তিক অধ্যায়-ওয়ারি স্পেশাল মডেল টেস্ট বান্ডেল',
    category: 'এক্সাম প্যাক',
    amount: 250,
    icon: '🎯'
  },
  {
    id: 'PREM-03',
    title: 'ভার্চুয়াল ৩ডি সায়েন্স ল্যাব প্রিমিয়াম সিমুলেশন অ্যাক্সেস',
    category: 'ল্যাব পাস',
    amount: 200,
    icon: '🔬'
  }
];

export default function PaymentGatewayCheckout({ defaultInvoice = null, onClose = null, onPaymentSuccess = null }) {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState([]);
  const [loadingInvoices, setLoadingInvoices] = useState(true);

  // Checkout State
  const [paymentType, setPaymentType] = useState(defaultInvoice ? 'INVOICE' : 'INVOICE'); // 'INVOICE' | 'STORE' | 'CUSTOM'
  const [selectedInvoice, setSelectedInvoice] = useState(defaultInvoice);
  const [selectedStoreItem, setSelectedStoreItem] = useState(STORE_PREMIUM_ITEMS[0]);
  const [customAmount, setCustomAmount] = useState('1000');
  const [customNote, setCustomNote] = useState('অগ্রিম একাডেমি ফি');
  const [selectedGateway, setSelectedGateway] = useState('BKASH');

  // Multi-step Interactive Gateway Simulator
  const [step, setStep] = useState(1); // 1: Selection, 2: Gateway Phone/Card, 3: OTP, 4: PIN, 5: Success Receipt
  const [senderPhone, setSenderPhone] = useState(user?.phone || '01792818005');
  const [otp, setOtp] = useState('123456');
  const [pin, setPin] = useState('');
  const [processing, setProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [receiptData, setReceiptData] = useState(null);
  const [downloading, setDownloading] = useState(false);

  const receiptRef = useRef(null);

  useEffect(() => {
    studentAPI.getInvoices().then((res) => {
      if (res?.success && Array.isArray(res.data)) {
        const unpaid = res.data.filter((i) => i.status !== 'PAID');
        setInvoices(unpaid);
        if (defaultInvoice) {
          setSelectedInvoice(defaultInvoice);
        } else if (unpaid.length > 0) {
          setSelectedInvoice(unpaid[0]);
        }
      }
    }).catch(() => {}).finally(() => setLoadingInvoices(false));
  }, [defaultInvoice]);

  // Promo & Referral Code State
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [validatingPromo, setValidatingPromo] = useState(false);
  const [promoError, setPromoError] = useState(null);

  const getRawPayableAmount = () => {
    if (paymentType === 'INVOICE') return selectedInvoice ? Number(selectedInvoice.amount) : 0;
    if (paymentType === 'STORE') return selectedStoreItem ? Number(selectedStoreItem.amount) : 0;
    return Number(customAmount) || 0;
  };

  const getPayableAmount = () => {
    const raw = getRawPayableAmount();
    if (appliedPromo && appliedPromo.discountAmount) {
      return Math.max(0, raw - Number(appliedPromo.discountAmount));
    }
    return raw;
  };

  const handleApplyPromo = async () => {
    if (!promoCodeInput.trim()) return;
    setValidatingPromo(true);
    setPromoError(null);
    try {
      const rawAmt = getRawPayableAmount();
      const res = await referralAPI.validatePromo({
        promoCode: promoCodeInput.trim(),
        studentId: user?.id,
        amount: rawAmt
      });
      if (res?.success && res.data) {
        setAppliedPromo(res.data);
      } else {
        setPromoError(res?.error?.message || 'প্রমো কোডটি সঠিক নয়।');
      }
    } catch (err) {
      setPromoError(err.message || 'প্রমো কোড যাচাই করতে ব্যর্থ হয়েছে।');
    } finally {
      setValidatingPromo(false);
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoCodeInput('');
    setPromoError(null);
  };

  const getPayableTitle = () => {
    if (paymentType === 'INVOICE') return selectedInvoice ? (selectedInvoice.titleBn || selectedInvoice.titleEn) : 'ইনভয়েস ফি';
    if (paymentType === 'STORE') return selectedStoreItem ? selectedStoreItem.title : 'ডিজিটাল স্টোর আইটেম';
    return customNote || 'কাস্টম একাডেমি ফি';
  };

  const handleStartGateway = () => {
    const amt = getPayableAmount();
    if (amt <= 0 && !appliedPromo) {
      setErrorMsg('অনুগ্রহ করে সঠিক টাকার পরিমাণ অথবা একটি ইনভয়েস নির্বাচন করুন।');
      return;
    }
    setErrorMsg(null);
    setStep(2); // Phone / Account input
  };

  const handleSendOTP = () => {
    if (!senderPhone || senderPhone.length < 11) {
      setErrorMsg('সঠিক ১১ ডিজিটের মোবাইল নম্বর লিখুন (যেমন: 017XXXXXXXX)।');
      return;
    }
    setErrorMsg(null);
    setStep(3); // OTP screen
  };

  const handleVerifyOTP = () => {
    if (!otp || otp.length < 4) {
      setErrorMsg('অনুগ্রহ করে ৪-৬ ডিজিটের ওটিপি লিখুন (সিমুলেশন ওটিপি: 123456)।');
      return;
    }
    setErrorMsg(null);
    setStep(4); // PIN screen
  };

  const handleFinalPayment = async () => {
    if (!pin || pin.length < 4) {
      setErrorMsg('অনুগ্রহ করে আপনার ৪-৫ ডিজিটের গোপন পিন নম্বর দিন।');
      return;
    }

    setProcessing(true);
    setErrorMsg(null);

    try {
      const finalAmt = getPayableAmount();
      const payload = {
        invoiceId: paymentType === 'INVOICE' && selectedInvoice ? selectedInvoice.id : null,
        purpose: paymentType === 'INVOICE' ? 'MONTHLY_FEE' : paymentType === 'STORE' ? 'STORE_ITEM' : 'CUSTOM_PAYMENT',
        itemTitle: getPayableTitle(),
        amount: finalAmt,
        method: selectedGateway,
        senderPhone: senderPhone,
        accountNo: senderPhone
      };

      const res = await paymentAPI.checkout(payload);

      if (res?.success && res.data) {
        // Credit referral reward points if promo code used
        if (appliedPromo && appliedPromo.code) {
          referralAPI.applyReward({
            promoCode: appliedPromo.code,
            buyerStudentId: user?.id,
            transactionId: res.data.receipt?.transactionId,
            amountPaid: finalAmt
          }).catch(console.error);
        }

        setReceiptData(res.data.receipt);
        setStep(5); // Receipt view
        if (onPaymentSuccess) onPaymentSuccess(res.data);
      } else {
        setErrorMsg(res?.error?.message || 'পেমেন্ট সম্পন্ন হতে ব্যর্থ হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
      }
    } catch (err) {
      setErrorMsg('নেটওয়ার্ক অথবা গেটওয়ে ত্রুটি: ' + err.message);
    } finally {
      setProcessing(false);
    }
  };


  const handleDownloadReceipt = async () => {
    if (!receiptRef.current) return;
    setDownloading(true);
    try {
      const { exportBrandedGraphic } = await import('../../utils/exportBrandedGraphic');
      await exportBrandedGraphic(receiptRef.current, {
        filename: `NextGen_Academy_Money_Receipt_${receiptData?.receiptNo || '2026'}`,
        backgroundColor: '#ffffff',
        format: 'png',
        quality: 0.95
      });
    } catch (err) {
      console.error('Download failed:', err);
    } finally {
      setDownloading(false);
    }
  };


  const handlePrint = () => {
    window.print();
  };

  const activeGatewayObj = PAYMENT_GATEWAYS.find((g) => g.id === selectedGateway) || PAYMENT_GATEWAYS[0];

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-950 border border-slate-800 shadow-2xl relative overflow-hidden flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 z-10">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-emerald-500/20">
            <CreditCard className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white">
                সিকিউর পেমেন্ট গেটওয়ে ও মানি রিসিট
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> 256-BIT SSL
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              বিকাশ, নগদ, রকেট ও কার্ডের মাধ্যমে তাৎক্ষণিক ফি পরিশোধ এবং ব্যাংক-গ্রেড ডিজিটাল মানি রিসিট
            </p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="p-2 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-all z-10"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Error notification */}
      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-800 text-rose-300 text-xs sm:text-sm font-bold flex items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
          <button onClick={() => setErrorMsg(null)} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 1: PAYMENT PURPOSE & GATEWAY SELECTION */}
      {/* ========================================================================= */}
      {step === 1 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2 Cols: Purpose & Items */}
          <div className="lg:col-span-2 space-y-6">
            {/* Payment Category Select */}
            <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-emerald-400" /> ১. পেমেন্টের ধরন নির্বাচন করুন
              </h3>

              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentType('INVOICE')}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    paymentType === 'INVOICE'
                      ? 'bg-emerald-600/10 border-emerald-500 text-white shadow-md'
                      : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <Receipt className="w-5 h-5 text-emerald-400 mb-1.5" />
                  <p className="text-xs font-black">টিউশন ফি / ইনভয়েস</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">বকেয়া মাসিক ফি</p>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentType('STORE')}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    paymentType === 'STORE'
                      ? 'bg-indigo-600/10 border-indigo-500 text-white shadow-md'
                      : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <ShoppingBag className="w-5 h-5 text-indigo-400 mb-1.5" />
                  <p className="text-xs font-black">ডিজিটাল স্টোর</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">ই-বুক ও স্পেশাল প্যাক</p>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentType('CUSTOM')}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    paymentType === 'CUSTOM'
                      ? 'bg-amber-600/10 border-amber-500 text-white shadow-md'
                      : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <Zap className="w-5 h-5 text-amber-400 mb-1.5" />
                  <p className="text-xs font-black">কাস্টম ফি</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">অগ্রিম বা অন্যান্য ফি</p>
                </button>
              </div>
            </div>

            {/* Invoices List / Store List / Custom Input */}
            {paymentType === 'INVOICE' && (
              <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3 shadow-xl">
                <h3 className="text-xs font-black text-slate-300 flex items-center justify-between">
                  <span>বকেয়া ইনভয়েস তালিকা</span>
                  <span className="text-[10px] font-mono text-slate-500">{invoices.length}টি বকেয়া</span>
                </h3>

                {loadingInvoices ? (
                  <p className="text-xs text-slate-500 py-4 text-center animate-pulse">ইনভয়েস লোড হচ্ছে...</p>
                ) : invoices.length === 0 ? (
                  <div className="p-6 text-center rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                    <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                    <p className="text-xs font-bold text-slate-300">আপনার কোনো বকেয়া ফি নেই!</p>
                    <p className="text-[11px] text-slate-500">অন্যান্য সেবার জন্য 'ডিজিটাল স্টোর' বা 'কাস্টম ফি' নির্বাচন করতে পারেন।</p>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {invoices.map((inv) => (
                      <div
                        key={inv.id}
                        onClick={() => setSelectedInvoice(inv)}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                          selectedInvoice?.id === inv.id
                            ? 'bg-emerald-950/20 border-emerald-500 shadow-md'
                            : 'bg-slate-950 border-slate-800/80 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                            selectedInvoice?.id === inv.id ? 'border-emerald-400 bg-emerald-500 text-slate-950' : 'border-slate-700'
                          }`}>
                            {selectedInvoice?.id === inv.id && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>
                          <div>
                            <p className="text-xs font-black text-white">{inv.titleBn || inv.titleEn}</p>
                            <p className="text-[10px] text-slate-400">ইনভয়েস নং: #{inv.invoiceNo} • মেয়াদ: {inv.dueDate}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-black text-emerald-400 font-mono">৳{inv.amount}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {paymentType === 'STORE' && (
              <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3 shadow-xl">
                <h3 className="text-xs font-black text-slate-300">ডিজিটাল প্রিমিয়াম আইটেম</h3>
                <div className="space-y-2.5">
                  {STORE_PREMIUM_ITEMS.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setSelectedStoreItem(item)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                        selectedStoreItem?.id === item.id
                          ? 'bg-indigo-950/30 border-indigo-500 shadow-md'
                          : 'bg-slate-950 border-slate-800/80 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{item.icon}</span>
                        <div>
                          <p className="text-xs font-black text-white">{item.title}</p>
                          <span className="px-2 py-0.2 rounded-full bg-slate-800 text-[10px] text-indigo-400 font-bold">
                            {item.category}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-black text-indigo-400 font-mono">৳{item.amount}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {paymentType === 'CUSTOM' && (
              <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
                <h3 className="text-xs font-black text-slate-300">কাস্টম ফি বিবরণ</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-400">টাকার পরিমাণ (BDT ৳)</label>
                    <input
                      type="number"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      placeholder="টাকার পরিমাণ লিখুন..."
                      className="w-full bg-slate-950 text-white rounded-xl px-4 py-2.5 text-sm border border-slate-800 focus:border-amber-500 outline-none font-mono mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-400">ফি প্রদানের উদ্দেশ্য / নোট</label>
                    <input
                      type="text"
                      value={customNote}
                      onChange={(e) => setCustomNote(e.target.value)}
                      placeholder="যেমন: অগ্রিম ৩ মাসের কোচিং ফি"
                      className="w-full bg-slate-950 text-white rounded-xl px-4 py-2.5 text-xs border border-slate-800 focus:border-amber-500 outline-none mt-1"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Bangladeshi Payment Gateways List */}
            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-pink-400" /> ২. পেমেন্ট মেথড বাছাই করুন
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PAYMENT_GATEWAYS.map((gw) => (
                  <div
                    key={gw.id}
                    onClick={() => setSelectedGateway(gw.id)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                      selectedGateway === gw.id
                        ? `bg-gradient-to-r ${gw.color}/20 ${gw.border} shadow-lg`
                        : 'bg-slate-950 border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${gw.color} flex items-center justify-center text-white font-black text-xs shadow-md`}>
                        {gw.logoText.slice(0, 3)}
                      </div>
                      <div>
                        <p className="text-xs font-black text-white">{gw.name}</p>
                        <p className="text-[10px] text-slate-400">{gw.charge}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded-md text-[9px] font-black ${gw.bgLight}`}>
                      {gw.badge}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Col: Order Summary & Checkout Trigger */}
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 shadow-2xl sticky top-6">
              <div className="border-b border-slate-800 pb-4">
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-emerald-400" /> পেমেন্ট সামারি
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">নিচে বিলের বিবরণ যাচাই করুন</p>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between text-slate-400">
                  <span>আইটেম / উদ্দেশ্য:</span>
                  <span className="font-bold text-white max-w-[160px] truncate text-right">{getPayableTitle()}</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>পেমেন্ট গেটওয়ে:</span>
                  <span className="font-bold text-emerald-400">{activeGatewayObj.name}</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>গেটওয়ে সার্ভিস চার্জ:</span>
                  <span className="font-bold text-emerald-400">৳০ (ফ্রি)</span>
                </div>

                {/* Promo Code Input Accordion */}
                <div className="pt-2 border-t border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-amber-400" />
                      <span>প্রমো বা রেফারেল কোড আছে?</span>
                    </span>
                    {appliedPromo && (
                      <button
                        type="button"
                        onClick={handleRemovePromo}
                        className="text-[10px] text-rose-400 hover:underline font-bold"
                      >
                        সরান ✕
                      </button>
                    )}
                  </div>

                  {appliedPromo ? (
                    <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-mono font-bold text-emerald-300">{appliedPromo.code}</span>
                        <p className="text-[10px] text-emerald-400">{appliedPromo.message}</p>
                      </div>
                      <span className="font-mono font-bold text-emerald-400 text-xs">
                        -৳{appliedPromo.discountAmount}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        value={promoCodeInput}
                        onChange={(e) => setPromoCodeInput(e.target.value.toUpperCase())}
                        placeholder="যেমন: ALOMGIR005"
                        className="flex-1 px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-xl text-xs font-mono text-amber-300 uppercase outline-none focus:border-amber-500"
                      />
                      <button
                        type="button"
                        onClick={handleApplyPromo}
                        disabled={validatingPromo || !promoCodeInput.trim()}
                        className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-xs flex items-center gap-1"
                      >
                        {validatingPromo ? <Loader2 className="w-3 h-3 animate-spin" /> : 'প্রয়োগ'}
                      </button>
                    </div>
                  )}

                  {promoError && (
                    <p className="text-[10px] font-bold text-rose-400">{promoError}</p>
                  )}
                </div>

                {appliedPromo && (
                  <div className="flex items-center justify-between text-emerald-400 font-bold">
                    <span>বিশেষ প্রমো ছাড় ({appliedPromo.discountPercent}%):</span>
                    <span className="font-mono">-৳{appliedPromo.discountAmount}</span>
                  </div>
                )}

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-sm">
                  <span className="font-bold text-white">মোট পরিশোধযোগ্য:</span>
                  <span className="font-black text-xl text-emerald-400 font-mono">
                    ৳{getPayableAmount()}
                  </span>
                </div>
              </div>


              {/* Security Badges */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-[11px] text-slate-400">
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <ShieldCheck className="w-4 h-4 flex-shrink-0" />
                  <span>ব্যাংক-গ্রেড ২৫৬-বিট এসএসএল এনক্রিপশন</span>
                </div>
                <p className="text-[10px] text-slate-500 leading-relaxed">
                  পেমেন্ট সম্পন্ন হওয়ার সাথে সাথেই স্বয়ংক্রিয়ভাবে প্রাতিষ্ঠানিক ডিজিটাল মানি রিসিট প্রস্তুত হবে।
                </p>
              </div>

              <button
                type="button"
                onClick={handleStartGateway}
                disabled={getPayableAmount() <= 0}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-sm shadow-xl shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-40"
              >
                <span>নিরাপদে পেমেন্ট করুন</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 2: GATEWAY MOBILE NUMBER / ACCOUNT INPUT */}
      {/* ========================================================================= */}
      {step === 2 && (
        <div className="max-w-md mx-auto p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 shadow-2xl">
          <div className="text-center space-y-2">
            <div className={`w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr ${activeGatewayObj.color} flex items-center justify-center text-white font-black text-sm shadow-lg`}>
              {activeGatewayObj.logoText}
            </div>
            <h3 className="text-base font-black text-white">{activeGatewayObj.name} সিকিউর গেটওয়ে</h3>
            <p className="text-xs text-slate-400">আপনার {activeGatewayObj.name} একাউন্ট নম্বর লিখুন</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">পরিশোধের পরিমাণ:</span>
            <span className="text-base font-black text-emerald-400 font-mono">৳{getPayableAmount()}</span>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-pink-400" /> মোবাইল একাউন্ট নম্বর
            </label>
            <input
              type="text"
              value={senderPhone}
              onChange={(e) => setSenderPhone(e.target.value)}
              placeholder="01XXXXXXXXX"
              className="w-full bg-slate-950 text-white rounded-xl px-4 py-3 text-sm border border-slate-800 focus:border-pink-500 outline-none font-mono"
            />
            <p className="text-[10px] text-slate-500">পরবর্তী ধাপে এই নম্বরে একটি ওটিপি (OTP) কোড পাঠানো হবে।</p>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
            >
              ফিরে যান
            </button>
            <button
              type="button"
              onClick={handleSendOTP}
              className="flex-1 py-3 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-black text-xs shadow-lg shadow-pink-600/20"
            >
              ওটিপি পাঠান
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 3: OTP VERIFICATION */}
      {/* ========================================================================= */}
      {step === 3 && (
        <div className="max-w-md mx-auto p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 shadow-2xl">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-pink-500/10 text-pink-400 border border-pink-500/20 flex items-center justify-center">
              <KeyRound className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black text-white">ওটিপি (OTP) যাচাইকরণ</h3>
            <p className="text-xs text-slate-400">
              <span className="text-pink-400 font-mono">{senderPhone}</span> নম্বরে পাঠানো ৬ ডিজিটের কোডটি দিন
            </p>
          </div>

          <div className="p-3 rounded-xl bg-pink-950/20 border border-pink-900/40 text-[11px] text-pink-300 text-center font-mono font-bold">
            💡 ডেমো সিমুলেশন ওটিপি: 123456
          </div>

          <div className="space-y-2">
            <input
              type="text"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="123456"
              className="w-full bg-slate-950 text-white text-center tracking-[0.5em] text-xl rounded-xl px-4 py-3 border border-slate-800 focus:border-pink-500 outline-none font-mono"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
            >
              নম্বর পরিবর্তন
            </button>
            <button
              type="button"
              onClick={handleVerifyOTP}
              className="flex-1 py-3 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-black text-xs shadow-lg shadow-pink-600/20"
            >
              যাচাই করুন
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 4: PIN VERIFICATION & FINAL AUTHORIZATION */}
      {/* ========================================================================= */}
      {step === 4 && (
        <div className="max-w-md mx-auto p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 shadow-2xl">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black text-white">{activeGatewayObj.name} পিন প্রবেশ করুন</h3>
            <p className="text-xs text-slate-400">নিরাপত্তা নিশ্চিতকরণে আপনার গোপন পিন দিন</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">মোট চার্জ করা হবে:</span>
            <span className="text-base font-black text-emerald-400 font-mono">৳{getPayableAmount()}</span>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300">গোপন পিন (PIN)</label>
            <input
              type="password"
              maxLength={5}
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="•••••"
              className="w-full bg-slate-950 text-white text-center tracking-[0.5em] text-2xl rounded-xl px-4 py-3 border border-slate-800 focus:border-emerald-500 outline-none font-mono"
            />
            <p className="text-[10px] text-slate-500 text-center">সিমুলেশন টেস্টের জন্য যেকোনো ৪-৫ ডিজিট দিন (যেমন: 12345)</p>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => setStep(3)}
              disabled={processing}
              className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs disabled:opacity-40"
            >
              ফিরে যান
            </button>
            <button
              type="button"
              onClick={handleFinalPayment}
              disabled={processing}
              className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs shadow-xl shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
            >
              {processing ? (
                <span>যাচাই হচ্ছে...</span>
              ) : (
                <span>পেমেন্ট নিশ্চিত করুন</span>
              )}
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 5: AUTOMATED STRICT BRANDED DIGITAL MONEY RECEIPT */}
      {/* ========================================================================= */}
      {step === 5 && receiptData && (
        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
          {/* Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              <div>
                <h3 className="text-sm font-black text-white">পেমেন্ট সফলভাবে সম্পন্ন হয়েছে!</h3>
                <p className="text-[11px] text-slate-400">ট্রানজেকশন আইডি: <span className="font-mono text-emerald-400">{receiptData.transactionId}</span></p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={handlePrint}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5 border border-slate-700"
              >
                <Printer className="w-4 h-4" /> প্রিন্ট স্লিপ
              </button>
              <button
                type="button"
                onClick={handleDownloadReceipt}
                disabled={downloading}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 text-xs font-black shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-1.5 active:scale-95 disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                {downloading ? 'ডাউনলোড হচ্ছে...' : 'রিসিট ইমেজ ডাউনলোড (PNG)'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setPin('');
                }}
                className="px-3 py-2.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white text-xs"
                title="নতুন পেমেন্ট"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* PRINTABLE / DOWNLOADABLE DIGITAL MONEY RECEIPT (STRICT BRANDING APPLIED) */}
          {/* ========================================================================= */}
          <div className="flex justify-center">
            <div
              ref={receiptRef}
              className="w-full max-w-2xl bg-white text-slate-900 rounded-3xl p-8 sm:p-10 shadow-2xl border-4 border-emerald-600 relative overflow-hidden space-y-6"
              style={{ fontFamily: 'sans-serif' }}
            >
              {/* Top Watermark Background */}
              <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
                <span className="text-8xl font-black rotate-[-30deg] tracking-widest text-slate-900">
                  NEXTGEN ACADEMY
                </span>
              </div>

              {/* ===================================================================== */}
              {/* STRICT MANDATORY INSTITUTION HEADER */}
              {/* ===================================================================== */}
              <div className="border-b-2 border-emerald-600 pb-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
                <div className="space-y-1">
                  <h1 className="text-2xl sm:text-3xl font-black text-emerald-800 tracking-tight">
                    {BRAND.name}
                  </h1>
                  <p className="text-xs font-bold text-slate-700">
                    পরিচালক / প্রধান শিক্ষক: <span className="text-emerald-900 font-extrabold">{BRAND.instructor}</span>
                  </p>
                  <p className="text-xs text-slate-600 font-medium flex items-center justify-center sm:justify-start gap-1">
                    <span>মোবাইল:</span> <span className="font-bold text-slate-900">{BRAND.phone}</span>
                  </p>
                  <p className="text-[11px] text-slate-500">
                    ক্যাম্পাস ঠিকানা: {BRAND.address}
                  </p>
                </div>

                <div className="flex flex-col items-center sm:items-end">
                  <span className="px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-black uppercase tracking-wider shadow-sm">
                    অফিসিয়াল মানি রিসিট
                  </span>
                  <span className="text-[10px] text-slate-400 mt-1 font-mono tracking-wider font-bold">
                    {BRAND.tagline}
                  </span>
                </div>
              </div>

              {/* Receipt & Transaction Meta Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">রিসিট নং</span>
                  <p className="font-bold font-mono text-slate-900">{receiptData.receiptNo}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">ট্রানজেকশন আইডি</span>
                  <p className="font-bold font-mono text-emerald-700">{receiptData.transactionId}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">পেমেন্ট মাধ্যম</span>
                  <p className="font-bold text-slate-900">{receiptData.method}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">তারিখ</span>
                  <p className="font-bold text-slate-900">{receiptData.date}</p>
                </div>
              </div>

              {/* Student Information */}
              <div className="space-y-2">
                <h4 className="text-xs font-black text-slate-500 uppercase tracking-wider">শিক্ষার্থীর বিবরণ:</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <div>
                    <span className="text-slate-500 text-[11px]">শিক্ষার্থীর নাম:</span>
                    <p className="font-bold text-slate-900">{receiptData.student?.name}</p>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[11px]">শিক্ষার্থী আইডি:</span>
                    <p className="font-bold font-mono text-slate-900">{receiptData.student?.studentIdNumber}</p>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[11px]">শ্রেণি ও শাখা:</span>
                    <p className="font-bold text-slate-900">{receiptData.student?.className} ({receiptData.student?.sectionName})</p>
                  </div>
                </div>
              </div>

              {/* Payment Particulars Table */}
              <div className="space-y-2">
                <h4 className="text-xs font-black text-slate-500 uppercase tracking-wider">আদায়কৃত ফি বিবরণী:</h4>
                <div className="border border-slate-200 rounded-2xl overflow-hidden text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-slate-100 border-b border-slate-200">
                      <tr>
                        <th className="p-3 text-slate-600 font-bold">বিবরণ / পারপাস</th>
                        <th className="p-3 text-right text-slate-600 font-bold">টাকার পরিমাণ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr>
                        <td className="p-3 font-bold text-slate-800">
                          {receiptData.purpose}
                          <span className="block text-[10px] text-slate-500 font-normal mt-0.5">
                            ইলেকট্রনিক ফান্ড ট্রান্সফার গেটওয়ে দ্বারা অনুমোদিত
                          </span>
                        </td>
                        <td className="p-3 text-right font-black font-mono text-slate-900 text-sm">
                          ৳{receiptData.amount}
                        </td>
                      </tr>
                    </tbody>
                    <tfoot className="bg-emerald-50 border-t border-emerald-200">
                      <tr>
                        <td className="p-3 font-black text-emerald-900">মোট আদায়কৃত টাকা:</td>
                        <td className="p-3 text-right font-black text-emerald-800 font-mono text-base">
                          ৳{receiptData.amount}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Amount in Words */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
                <span className="font-bold text-slate-900">কথায়: </span>
                <span className="font-semibold text-emerald-800">{receiptData.amountInWords}</span>
              </div>

              {/* Bottom Digital Verification & Signatures */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>ডিজিটালি ভেরিফাইড ও সংরক্ষিত</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-mono">
                    সিকিউরিটি হ্যাশ: {receiptData.securitySeal?.verificationHash}
                  </p>
                </div>

                <div className="text-right">
                  <div className="inline-block border-b border-slate-400 pb-1 px-4 text-center">
                    <span className="text-xs font-bold text-slate-900 font-serif italic">
                      {receiptData.securitySeal?.issuedBy}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-0.5">অনুমোদিত স্বাক্ষরকারী / পরিচালক</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
