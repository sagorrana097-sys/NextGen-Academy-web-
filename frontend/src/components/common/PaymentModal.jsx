import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { paymentAPI } from '../../services/api';
import UniversalFileUploader from './UniversalFileUploader';
import confetti from 'canvas-confetti';
import {
  X,
  CheckCircle2,
  AlertCircle,
  Smartphone,
  CreditCard,
  ShieldCheck,
  Lock,
  Building,
  Banknote,
  QrCode,
  Copy,
  Check,
  Sparkles,
  Info
} from 'lucide-react';

export default function PaymentModal({ invoice, isOpen, onClose, onPaymentSuccess }) {
  const { t, lang } = useLanguage();

  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [phone, setPhone] = useState('01712345678');
  const [trxId, setTrxId] = useState('');
  const [pin, setPin] = useState('1234');
  const [copied, setCopied] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [slipUrl, setSlipUrl] = useState('');
  const [slipFileName, setSlipFileName] = useState('');

  const [loadingMethods, setLoadingMethods] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchPaymentMethods();
    }
  }, [isOpen]);

  const fetchPaymentMethods = async () => {
    setLoadingMethods(true);
    try {
      const res = await paymentAPI.getMethods();
      if (res.success && res.data && res.data.length > 0) {
        setPaymentMethods(res.data);
        setSelectedMethod(res.data[0]);
      } else {
        // Fallback default
        const fallback = [
          {
            id: 1,
            provider: 'bKash',
            accountType: 'Merchant',
            accountNumber: '01800-639843',
            instructions: 'বিকাশ অ্যাপের Payment অপশন দিয়ে ফি পরিশোধ করুন এবং TrxID দিন।'
          }
        ];
        setPaymentMethods(fallback);
        setSelectedMethod(fallback[0]);
      }
    } catch (err) {
      console.error('Failed to load active payment methods:', err);
    } finally {
      setLoadingMethods(false);
    }
  };

  const handleCopy = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (!isOpen || !invoice) return null;

  const baseAmount = Number(invoice?.amount || 0);

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

  const { charge: calculatedCharge, rate: chargeRate } = calculateCharge(selectedMethod?.provider, baseAmount);
  const totalPayable = baseAmount + calculatedCharge;

  const handlePay = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await paymentAPI.simulatePayment({
        invoiceId: invoice.id,
        method: selectedMethod?.provider || 'BKASH',
        amount: totalPayable,
        baseAmount: baseAmount,
        chargeAmount: calculatedCharge,
        senderPhone: phone,
        trxId: trxId || `TXN-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        pin
      });

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
        throw new Error(res.error?.message || 'Payment simulation failed');
      }
    } catch (err) {
      setError(err.message || 'পেমেন্ট ব্যর্থ হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  const getProviderBadge = (provider) => {
    const p = (provider || '').toLowerCase();
    if (p.includes('bkash')) {
      return {
        name: 'bKash',
        color: 'bg-[#e2136e] text-white',
        border: 'border-[#e2136e]',
        bgLight: 'bg-[#e2136e]/5',
        activeRing: 'ring-2 ring-[#e2136e]/30 border-[#e2136e]',
        icon: '৳'
      };
    } else if (p.includes('nagad')) {
      return {
        name: 'Nagad',
        color: 'bg-[#f7931e] text-white',
        border: 'border-[#f7931e]',
        bgLight: 'bg-[#f7931e]/5',
        activeRing: 'ring-2 ring-[#f7931e]/30 border-[#f7931e]',
        icon: 'ন'
      };
    } else if (p.includes('rocket')) {
      return {
        name: 'Rocket',
        color: 'bg-[#8c3494] text-white',
        border: 'border-[#8c3494]',
        bgLight: 'bg-[#8c3494]/5',
        activeRing: 'ring-2 ring-[#8c3494]/30 border-[#8c3494]',
        icon: 'র'
      };
    } else if (p.includes('bank')) {
      return {
        name: 'Bank Transfer',
        color: 'bg-blue-600 text-white',
        border: 'border-blue-500',
        bgLight: 'bg-blue-50',
        activeRing: 'ring-2 ring-blue-500/30 border-blue-500',
        icon: <Building className="w-3.5 h-3.5" />
      };
    } else if (p.includes('cash')) {
      return {
        name: 'Cash',
        color: 'bg-emerald-600 text-white',
        border: 'border-emerald-500',
        bgLight: 'bg-emerald-50',
        activeRing: 'ring-2 ring-emerald-500/30 border-emerald-500',
        icon: <Banknote className="w-3.5 h-3.5" />
      };
    }
    return {
      name: provider,
      color: 'bg-slate-700 text-white',
      border: 'border-slate-300',
      bgLight: 'bg-slate-50',
      activeRing: 'ring-2 ring-slate-400 border-slate-700',
      icon: <CreditCard className="w-3.5 h-3.5" />
    };
  };

  const selectedBadge = selectedMethod ? getProviderBadge(selectedMethod.provider) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-5 text-white flex items-center justify-between border-b border-slate-800">
          <div>
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <h3 className="font-extrabold text-base">{t('paymentModalTitle')}</h3>
            </div>
            <p className="text-xs text-slate-300 mt-0.5 font-medium">
              {invoice.titleBn} ({invoice.invoiceNo})
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handlePay} className="p-5 space-y-4 overflow-y-auto flex-1">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Financial Breakdown & Total Amount Box */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            {invoice.discountAmount > 0 ? (
              <div className="space-y-1.5 text-xs pb-2 border-b border-slate-200">
                <div className="flex items-center justify-between text-slate-600">
                  <span>মূল ফি (Base Tuition Fee):</span>
                  <span className="font-semibold">৳ {Number(invoice.baseAmount || invoice.amount).toLocaleString('en-BD')}</span>
                </div>
                <div className="flex items-center justify-between text-emerald-700 font-bold">
                  <div className="flex items-center space-x-1.5">
                    <span>প্রদত্ত ছাড় / স্কলারশিপ:</span>
                    <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 text-[10px]">
                      {invoice.discountReason === 'MERIT_SCHOLARSHIP'
                        ? 'মেধাবৃত্তি'
                        : invoice.discountReason === 'SIBLING_DISCOUNT'
                        ? 'ভাই-বোন ছাড়'
                        : invoice.discountReason === 'SPECIAL_WAIVER'
                        ? 'বিশেষ বিবেচনা'
                        : (invoice.discountType === 'PERCENTAGE' ? `${invoice.discountValue}% ছাড়` : 'ছাড়')}
                    </span>
                  </div>
                  <span>- ৳ {Number(invoice.discountAmount).toLocaleString('en-BD')}</span>
                </div>
              </div>
            ) : null}

            <div className="flex items-center justify-between pt-0.5">
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  {invoice.discountAmount > 0 ? 'পরিশোধযোগ্য মোট ফি' : t('amount')}
                </span>
                <p className="text-2xl font-black text-slate-900 font-mono">
                  ৳ {Number(invoice.amount).toLocaleString('en-BD')}
                </p>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                {t('unpaidStatus')}
              </span>
            </div>
          </div>

          {/* Dynamic Payment Method Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              পেমেন্ট মাধ্যম নির্বাচন করুন (Select Gateway) *
            </label>
            {loadingMethods ? (
              <div className="p-4 text-center text-xs text-slate-400 font-bold">
                পেমেন্ট অপশন লোড হচ্ছে...
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {paymentMethods.map((m) => {
                  const badge = getProviderBadge(m.provider);
                  const isSelected = selectedMethod?.id === m.id;

                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setSelectedMethod(m)}
                      className={`p-3 rounded-2xl border flex flex-col items-center justify-center transition-all ${
                        isSelected
                          ? `${badge.activeRing} ${badge.bgLight}`
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div
                        className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black shadow-sm ${badge.color}`}
                      >
                        {badge.icon}
                      </div>
                      <span className="text-xs font-bold text-slate-900 mt-1.5">
                        {m.provider}
                      </span>
                      <span className="text-[9px] text-slate-500 font-medium">
                        {m.accountType}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Selected Method Dynamic Details Box */}
          {selectedMethod && (
            <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block">
                    অফিসিয়াল {selectedMethod.provider} ({selectedMethod.accountType}) নম্বর
                  </span>
                  <div className="flex items-center space-x-2 mt-0.5">
                    <span className="font-mono text-sm font-black text-slate-900 select-all">
                      {selectedMethod.accountNumber}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(selectedMethod.accountNumber)}
                      className="p-1 rounded-lg text-indigo-600 hover:bg-indigo-100 transition-colors"
                      title="কপি করুন"
                    >
                      {copied ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {selectedMethod.qrCodeUrl && (
                  <button
                    type="button"
                    onClick={() => setShowQrModal(true)}
                    className="flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-white border border-indigo-200 text-indigo-700 text-[10px] font-bold shadow-sm hover:bg-indigo-50 transition-all"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>QR স্ক্যান</span>
                  </button>
                )}
              </div>

              {/* Instructions */}
              <div className="text-[11px] text-slate-600 bg-white/80 p-2.5 rounded-xl border border-indigo-100/80 leading-relaxed font-medium">
                💡 <span className="font-bold">নির্দেশিকা:</span> {selectedMethod.instructions || `আপনার ${selectedMethod.provider} অ্যাপ থেকে চার্জসহ সর্বমোট ৳${totalPayable.toFixed(2)} পেমেন্ট সম্পন্ন করুন।`}
              </div>
            </div>
          )}

          {/* Real-Time Cost Breakdown Card */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-1.5 shadow-sm">
            <div className="flex justify-between text-slate-600 font-medium">
              <span>মূল ইনভয়েস ফি:</span>
              <span className="font-mono font-bold text-slate-900">৳ {baseAmount.toLocaleString('en-BD')}</span>
            </div>
            {selectedMethod?.provider === 'bKash' || selectedMethod?.provider === 'Nagad' || selectedMethod?.provider === 'Rocket' ? (
              <div className="flex justify-between text-rose-600 font-medium">
                <span>{selectedMethod?.provider} গেটওয়ে চার্জ ({chargeRate}):</span>
                <span className="font-mono font-bold">+ ৳ {calculatedCharge.toFixed(2)}</span>
              </div>
            ) : (
              <div className="flex justify-between text-emerald-600 font-medium text-xs">
                <span>গেটওয়ে সার্ভিস চার্জ:</span>
                <span className="font-bold">ফ্রি (৳ ০.০০)</span>
              </div>
            )}
            <div className="flex justify-between text-slate-900 font-black border-t border-slate-300 pt-2 mt-2 text-sm sm:text-base">
              <span>সর্বমোট পরিশোধযোগ্য:</span>
              <span className="text-emerald-700 font-mono font-black text-base sm:text-lg">৳ {totalPayable.toFixed(2)}</span>
            </div>
          </div>

          {/* Payment Form inputs */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-900 mb-1">
                আপনার প্রেরক মোবাইল / অ্যাকাউন্ট নম্বর *
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="017XXXXXXXX"
                  required
                  className="w-full bg-white text-slate-900 placeholder:text-slate-400 border border-slate-300 rounded-lg pl-9 pr-3 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm"
                />
                <Smartphone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-900 mb-1">
                লেনদেন আইডি (TrxID / Transaction Reference)
              </label>
              <input
                type="text"
                value={trxId}
                onChange={(e) => setTrxId(e.target.value)}
                placeholder="যেমন: BKASH-TXN-9A8B7C (সিমুলেশনে ঐচ্ছিক)"
                className="w-full bg-white text-slate-900 placeholder:text-slate-400 border border-slate-300 rounded-lg px-3 py-2.5 text-xs font-mono font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-900 mb-1">
                সিমুলেশন সিকিউরিটি পিন (Default: 1234)
              </label>
              <div className="relative">
                <input
                  type="password"
                  maxLength={6}
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="••••"
                  required
                  className="w-full bg-white text-slate-900 placeholder:text-slate-400 border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-xs font-medium tracking-widest focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                * এটি নেক্সটজেন একাডেমির অটোমেটেড সিকিউর পেমেন্ট টেস্ট গেটওয়ে।
              </p>
            </div>

            {/* Optional Slip / Receipt Screenshot */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
              <UniversalFileUploader
                label="পেমেন্ট রসিদ / স্ক্রিনশট (Payment Slip / Screenshot - Optional)"
                value={slipUrl}
                fileName={slipFileName}
                accept="*/*"
                maxMb={100}
                helperText="পেমেন্ট কনফার্মেশন স্ক্রিনশট বা ব্যাংক রসিদের ছবি"
                onChange={({ fileUrl, url, fileName }) => {
                  setSlipUrl(fileUrl || url || '');
                  setSlipFileName(fileName || '');
                }}
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex items-center space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="w-1/3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-2/3 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold hover:from-emerald-500 hover:to-teal-500 shadow-md shadow-emerald-600/20 disabled:opacity-50 transition-all flex items-center justify-center space-x-2"
            >
              {loading ? (
                <span>{t('processing')}</span>
              ) : (
                <span>
                  {t('confirmPayment')} ৳ {totalPayable.toFixed(2)}
                </span>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* QR Code Modal Preview */}
      {showQrModal && selectedMethod?.qrCodeUrl && (
        <div
          onClick={() => setShowQrModal(false)}
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl p-6 shadow-2xl max-w-xs w-full text-center space-y-4 animate-in zoom-in duration-150"
          >
            <h4 className="text-sm font-black text-slate-800">
              {selectedMethod.provider} QR Code
            </h4>
            <div className="w-56 h-56 mx-auto bg-white p-2 border border-slate-200 rounded-2xl shadow-inner flex items-center justify-center">
              <img
                src={selectedMethod.qrCodeUrl}
                alt="QR Code"
                className="max-w-full max-h-full object-contain"
              />
            </div>
            <p className="text-[11px] font-mono font-bold text-slate-700">
              {selectedMethod.accountNumber}
            </p>
            <button
              onClick={() => setShowQrModal(false)}
              className="px-5 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800"
            >
              বন্ধ করুন
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
