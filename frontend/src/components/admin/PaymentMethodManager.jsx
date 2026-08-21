import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { paymentAPI } from '../../services/api';
import UniversalFileUploader from '../common/UniversalFileUploader';
import {
  CreditCard,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  QrCode,
  Smartphone,
  Building,
  Banknote,
  Copy,
  Check,
  ToggleLeft,
  ToggleRight,
  Upload,
  Camera,
  Eye,
  X,
  Save,
  RefreshCw,
  Sparkles,
  HelpCircle,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

export default function PaymentMethodManager() {
  const { t, lang } = useLanguage();

  const [methods, setMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null);

  // Modals
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [editingMethod, setEditingMethod] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingMethod, setDeletingMethod] = useState(null);
  const [previewQrUrl, setPreviewQrUrl] = useState(null);

  // Feedback toast
  const [toast, setToast] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const initialFormState = {
    provider: 'bKash',
    accountType: 'Merchant',
    accountNumber: '',
    qrCodeUrl: '',
    instructions: 'বিকাশ অ্যাপের "Payment" অপশন অথবা *247# ডায়াল করে পেমেন্ট করুন। রেফারেন্সে শিক্ষার্থীর রোল/আইডি লিখুন এবং প্রাপ্ত TrxID প্রদান করুন।',
    isActive: true
  };
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchMethods();
  }, []);

  const showFeedback = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchMethods = async () => {
    setLoading(true);
    try {
      const res = await paymentAPI.getAdminMethods();
      if (res.success && res.data) {
        setMethods(res.data);
      }
    } catch (err) {
      console.error('Fetch payment methods error:', err);
      showFeedback('পেমেন্ট মাধ্যমসমূহ লোড করতে সমস্যা হয়েছে', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  // QR Code file upload to Base64
  const handleQrUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showFeedback('দয়া করে একটি ছবি ফাইল নির্বাচন করুন (JPG, PNG, WebP)', 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showFeedback('QR ছবির আকার সর্বোচ্চ 5MB হতে পারবে', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      setFormData((prev) => ({
        ...prev,
        qrCodeUrl: uploadEvent.target.result
      }));
      showFeedback('QR কোড সফলভাবে আপলোড হয়েছে!', 'success');
    };
    reader.readAsDataURL(file);
  };

  const handleOpenAdd = () => {
    setEditingMethod(null);
    setFormData(initialFormState);
    setShowAddEditModal(true);
  };

  const handleOpenEdit = (m) => {
    setEditingMethod(m);
    setFormData({
      provider: m.provider || 'bKash',
      accountType: m.accountType || 'Merchant',
      accountNumber: m.accountNumber || '',
      qrCodeUrl: m.qrCodeUrl || '',
      instructions: m.instructions || '',
      isActive: m.isActive !== false
    });
    setShowAddEditModal(true);
  };

  const handleProviderPresetChange = (providerName) => {
    let defaultInstr = formData.instructions;
    if (providerName === 'bKash') {
      defaultInstr = 'বিকাশ অ্যাপের "Payment" অপশন অথবা *247# ডায়াল করে পেমেন্ট করুন। রেফারেন্সে শিক্ষার্থীর রোল/আইডি লিখুন এবং প্রাপ্ত TrxID প্রদান করুন।';
    } else if (providerName === 'Nagad') {
      defaultInstr = 'নগদ অ্যাপের "মার্চেন্ট পে" অথবা *167# ডায়াল করে বিল পরিশোধ করুন। কাউন্টার নম্বর ১ দিন এবং TrxID সংরক্ষণ করুন।';
    } else if (providerName === 'Rocket') {
      defaultInstr = 'ডিবিবিএল রকেট অ্যাপ বা *322# এর মাধ্যমে একাডেমি বিলার কোড (NGA-2026) ব্যবহার করে ফি জমা দিন।';
    } else if (providerName === 'Bank Transfer') {
      defaultInstr = 'হিসাবের নাম: NextGen ACADEMY | শাখা: ধানমন্ডি শাখা, ঢাকা | রাউটিং নং: 125271890। ডিপোজিট স্লিপের রেফারেন্স TrxID এন্ট্রি দিন।';
    } else if (providerName === 'Cash') {
      defaultInstr = 'একাডেমির হিসাব শাখায় সশরীরে উপস্থিত হয়ে অফিস চলাকালীন সময়ে সরাসরি নগদ ফি জমা দিয়ে অটোমেটেড রসিদ গ্রহণ করুন।';
    }

    setFormData((prev) => ({
      ...prev,
      provider: providerName,
      instructions: defaultInstr
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingMethod) {
        const res = await paymentAPI.updateMethod(editingMethod.id, formData);
        if (res.success) {
          showFeedback('পেমেন্ট মাধ্যম সফলভাবে আপডেট করা হয়েছে!');
          setShowAddEditModal(false);
          fetchMethods();
        }
      } else {
        const res = await paymentAPI.createMethod(formData);
        if (res.success) {
          showFeedback('নতুন পেমেন্ট মাধ্যম সফলভাবে যুক্ত করা হয়েছে!');
          setShowAddEditModal(false);
          fetchMethods();
        }
      }
    } catch (err) {
      console.error('Submit payment method error:', err);
      showFeedback(err.message || 'পেমেন্ট মাধ্যম সংরক্ষণ ব্যর্থ হয়েছে', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (m) => {
    const newStatus = !m.isActive;
    try {
      const res = await paymentAPI.toggleMethodStatus(m.id, newStatus);
      if (res.success) {
        showFeedback(
          newStatus
            ? `'${m.provider}' মাধ্যমটি সক্রিয় করা হয়েছে`
            : `'${m.provider}' মাধ্যমটি নিষ্ক্রিয় করা হয়েছে`
        );
        fetchMethods();
      }
    } catch (err) {
      console.error('Toggle status error:', err);
      showFeedback(err.message || 'স্ট্যাটাস পরিবর্তন ব্যর্থ হয়েছে', 'error');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingMethod) return;
    setSubmitting(true);
    try {
      const res = await paymentAPI.deleteMethod(deletingMethod.id);
      if (res.success) {
        showFeedback('পেমেন্ট মাধ্যমটি সফলভাবে মুছে ফেলা হয়েছে!');
        setShowDeleteModal(false);
        setDeletingMethod(null);
        fetchMethods();
      }
    } catch (err) {
      console.error('Delete method error:', err);
      showFeedback(err.message || 'ডিলিট ব্যর্থ হয়েছে', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Provider Styling Helpers
  const getProviderConfig = (provider) => {
    const p = (provider || '').toLowerCase();
    if (p.includes('bkash')) {
      return {
        name: 'bKash (বিকাশ)',
        color: 'bg-[#e2136e] text-white',
        border: 'border-[#e2136e]/30',
        badge: 'bg-[#e2136e]/10 text-[#e2136e] border-[#e2136e]/20',
        icon: '৳'
      };
    } else if (p.includes('nagad')) {
      return {
        name: 'Nagad (নগদ)',
        color: 'bg-[#f7931e] text-white',
        border: 'border-[#f7931e]/30',
        badge: 'bg-[#f7931e]/10 text-[#f7931e] border-[#f7931e]/20',
        icon: 'ন'
      };
    } else if (p.includes('rocket')) {
      return {
        name: 'Rocket (রকেট)',
        color: 'bg-[#8c3494] text-white',
        border: 'border-[#8c3494]/30',
        badge: 'bg-[#8c3494]/10 text-[#8c3494] border-[#8c3494]/20',
        icon: 'র'
      };
    } else if (p.includes('bank')) {
      return {
        name: 'Bank Transfer (ব্যাংক)',
        color: 'bg-blue-600 text-white',
        border: 'border-blue-200',
        badge: 'bg-blue-50 text-blue-700 border-blue-200',
        icon: <Building className="w-4 h-4" />
      };
    } else if (p.includes('cash')) {
      return {
        name: 'Cash (নগদ কালেকশন বুথ)',
        color: 'bg-emerald-600 text-white',
        border: 'border-emerald-200',
        badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        icon: <Banknote className="w-4 h-4" />
      };
    }
    return {
      name: provider,
      color: 'bg-slate-700 text-white',
      border: 'border-slate-200',
      badge: 'bg-slate-100 text-slate-700 border-slate-200',
      icon: <CreditCard className="w-4 h-4" />
    };
  };

  const activeCount = methods.filter((m) => m.isActive).length;
  const mfsCount = methods.filter((m) =>
    ['bkash', 'nagad', 'rocket'].some((k) => (m.provider || '').toLowerCase().includes(k))
  ).length;

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Toast */}
      {toast && (
        <div
          className={`p-4 rounded-2xl border text-xs font-bold flex items-center space-x-2.5 shadow-lg ${
            toast.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
          )}
          <span>{toast.msg}</span>
        </div>
      )}

      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-slate-700/60">
        <div className="absolute right-0 top-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold">
              <CreditCard className="w-3.5 h-3.5" />
              <span>{lang === 'bn' ? 'পেমেন্ট গেটওয়ে ও অ্যাকাউন্ট সেটিংস' : 'Payment Gateway Hub'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white">
              {lang === 'bn' ? 'ডায়নামিক পেমেন্ট মেথড ব্যবস্থাপনা' : 'Payment Methods & Gateway Settings'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl font-medium">
              বিকাশ, নগদ, রকেট, ব্যাংক ও ক্যাশ বুথের অ্যাকাউন্ট নম্বর, কিউআর কোড (QR Code) এবং অর্থ প্রদানের দিক-নির্দেশনা রিয়েল-টাইমে পরিচালনা করুন
            </p>
          </div>

          <button
            onClick={handleOpenAdd}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs shadow-lg shadow-emerald-600/30 flex items-center space-x-2 transition-all transform active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>+ নতুন পেমেন্ট মাধ্যম যোগ করুন</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center space-x-3.5">
          <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-500">মোট মেথড</div>
            <div className="text-xl font-black text-slate-900">{methods.length} টি</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center space-x-3.5">
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-500">সক্রিয় গেটওয়ে</div>
            <div className="text-xl font-black text-emerald-600">{activeCount} টি</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center space-x-3.5">
          <div className="p-3 rounded-xl bg-rose-50 text-[#e2136e]">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-500">MFS অ্যাকাউন্ট</div>
            <div className="text-xl font-black text-[#e2136e]">{mfsCount} টি</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center space-x-3.5">
          <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
            <Building className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-500">ব্যাংক ও বুথ</div>
            <div className="text-xl font-black text-blue-600">{methods.length - mfsCount} টি</div>
          </div>
        </div>
      </div>

      {/* Methods Cards Grid */}
      {loading ? (
        <div className="p-12 text-center text-slate-500 space-y-3 bg-white rounded-3xl border border-slate-200">
          <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin mx-auto" />
          <p className="text-xs font-bold">পেমেন্ট মেথড লোড হচ্ছে...</p>
        </div>
      ) : methods.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
          <CreditCard className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-700">কোনো পেমেন্ট মাধ্যম যুক্ত নেই</h3>
          <p className="text-xs text-slate-400">নতুন মাধ্যম যুক্ত করতে উপরের বাটনে ক্লিক করুন</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {methods.map((m) => {
            const config = getProviderConfig(m.provider);
            const isMFS = ['bkash', 'nagad', 'rocket'].some((k) =>
              (m.provider || '').toLowerCase().includes(k)
            );

            return (
              <div
                key={m.id}
                className={`bg-white rounded-3xl border p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 relative overflow-hidden ${
                  m.isActive ? 'border-slate-200 ring-1 ring-slate-100' : 'border-slate-200 opacity-60 bg-slate-50/50'
                }`}
              >
                {/* Top Status & Provider */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black text-base shadow-sm ${config.color}`}
                      >
                        {config.icon}
                      </div>
                      <div>
                        <h4 className="font-extrabold text-slate-900 text-sm">{m.provider}</h4>
                        <span
                          className={`inline-block px-2 py-0.2 rounded-md text-[10px] font-bold border mt-0.5 ${config.badge}`}
                        >
                          {m.accountType || 'Merchant'} Account
                        </span>
                      </div>
                    </div>

                    {/* Active Toggle Switch */}
                    <button
                      onClick={() => handleToggleStatus(m)}
                      title="স্ট্যাটাস টগল করতে ক্লিক করুন"
                      className={`px-2.5 py-1 rounded-full text-[10px] font-black border transition-all flex items-center space-x-1 ${
                        m.isActive
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                          : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${m.isActive ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                      <span>{m.isActive ? 'সক্রিয়' : 'নিষ্ক্রিয়'}</span>
                    </button>
                  </div>

                  {/* Account Number Box */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      হিসাব / অ্যাকাউন্ট নম্বর
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-sm font-black text-slate-900 break-all select-all">
                        {m.accountNumber}
                      </span>
                      <button
                        onClick={() => handleCopy(m.accountNumber, m.id)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-white transition-all flex-shrink-0"
                        title="নম্বর কপি করুন"
                      >
                        {copiedId === m.id ? (
                          <Check className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* QR Code & Instructions */}
                  <div className="flex items-start gap-3 pt-1">
                    {m.qrCodeUrl ? (
                      <div
                        onClick={() => setPreviewQrUrl(m.qrCodeUrl)}
                        className="w-16 h-16 rounded-xl bg-white border border-slate-200 p-1 flex-shrink-0 shadow-sm cursor-pointer group hover:border-indigo-400 transition-all text-center"
                        title="বড় করে দেখতে ক্লিক করুন"
                      >
                        <img
                          src={m.qrCodeUrl}
                          alt="QR Code"
                          className="w-full h-full object-contain rounded-lg"
                        />
                        <span className="text-[8px] text-indigo-600 font-bold block mt-0.5 opacity-0 group-hover:opacity-100">
                          জুম
                        </span>
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-slate-100 border border-dashed border-slate-300 flex items-center justify-center flex-shrink-0 text-slate-400 text-center p-1">
                        <QrCode className="w-6 h-6 opacity-40" />
                      </div>
                    )}

                    <div className="flex-1 text-[11px] text-slate-600 font-medium leading-relaxed bg-slate-50/60 p-2.5 rounded-xl border border-slate-100 line-clamp-3">
                      {m.instructions || 'পেমেন্ট সম্পন্ন করে TrxID সংগ্রহ করুন।'}
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => handleOpenEdit(m)}
                    className="p-2 rounded-xl bg-amber-50 text-amber-700 hover:bg-amber-100 font-bold text-xs flex items-center space-x-1 transition-colors"
                    title="এডিট"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>এডিট</span>
                  </button>
                  <button
                    onClick={() => {
                      setDeletingMethod(m);
                      setShowDeleteModal(true);
                    }}
                    className="p-2 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold text-xs flex items-center space-x-1 transition-colors"
                    title="ডিলিট"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>ডিলিট</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal: Add or Edit Payment Method */}
      {showAddEditModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
                <CreditCard className="w-5 h-5 text-emerald-600" />
                <span>
                  {editingMethod ? 'পেমেন্ট মাধ্যম সম্পাদন (Edit Payment Method)' : 'নতুন পেমেন্ট মাধ্যম যোগ (Add Payment Method)'}
                </span>
              </h3>
              <button
                onClick={() => setShowAddEditModal(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              {/* Quick Provider Presets */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  পেমেন্ট গেটওয়ে / প্রদানকারী (Provider) *
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-2">
                  {['bKash', 'Nagad', 'Rocket', 'Bank Transfer', 'Cash'].map((prov) => (
                    <button
                      key={prov}
                      type="button"
                      onClick={() => handleProviderPresetChange(prov)}
                      className={`p-2 rounded-xl text-xs font-bold border transition-all ${
                        formData.provider === prov
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-500/20'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      {prov}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={formData.provider}
                  onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                  placeholder="যেমন: bKash / Nagad / Upay"
                  required
                  className="w-full text-xs font-semibold rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    অ্যাকাউন্টের ধরন (Account Type) *
                  </label>
                  <select
                    value={formData.accountType}
                    onChange={(e) => setFormData({ ...formData, accountType: e.target.value })}
                    className="w-full text-xs font-bold rounded-xl border border-slate-300 p-2.5 bg-slate-50"
                  >
                    <option value="Merchant">মার্চেন্ট অ্যাকাউন্ট (Merchant)</option>
                    <option value="Personal">ব্যক্তিগত নম্বর (Personal)</option>
                    <option value="Agent">এজেন্ট নম্বর (Agent)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    অ্যাকাউন্ট / মোবাইল নম্বর *
                  </label>
                  <input
                    type="text"
                    value={formData.accountNumber}
                    onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                    placeholder="যেমন: 01800-639843"
                    required
                    className="w-full text-xs font-semibold rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* QR Code Upload / Cloud Link */}
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
                <UniversalFileUploader
                  label="কিউআর কোড (QR Code - Device Upload / Image Link)"
                  value={formData.qrCodeUrl}
                  previewType="image"
                  accept="image/*"
                  maxMb={5}
                  helperText="বিকাশ, নগদ বা রকেটের মার্চেন্ট/পার্সোনাল কিউআর কোড ছবি বা লিংক"
                  placeholder="https://... বা গুগল ড্রাইভ ইমেজ লিংক"
                  onChange={({ fileUrl, url }) => {
                    setFormData(prev => ({ ...prev, qrCodeUrl: fileUrl || url || '' }));
                  }}
                />
              </div>

              {/* Instructions */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  শিক্ষার্থী/অভিভাবকের জন্য পেমেন্ট নির্দেশিকা (Payment Instructions) *
                </label>
                <textarea
                  rows={3}
                  value={formData.instructions}
                  onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                  placeholder="যেমন: বিকাশ অ্যাপের Payment অপশন দিয়ে ফি পরিশোধ করুন..."
                  required
                  className="w-full text-xs font-medium rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-emerald-500 leading-relaxed"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                  />
                  <span className="text-xs font-bold text-slate-700">পেমেন্ট গেটওয়ে সক্রিয় রাখুন (Active)</span>
                </label>

                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowAddEditModal(false)}
                    className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold text-xs"
                  >
                    বাতিল
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md disabled:opacity-50"
                  >
                    {submitting ? 'সংরক্ষণ হচ্ছে...' : editingMethod ? 'আপডেট করুন' : 'যোগ করুন'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Delete Confirmation */}
      {showDeleteModal && deletingMethod && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center space-x-3 text-rose-600">
              <div className="p-2.5 rounded-2xl bg-rose-50 border border-rose-200">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-slate-900">পেমেন্ট মাধ্যম ডিলিট নিশ্চিতকরণ</h3>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              আপনি কি নিশ্চিতভাবে <span className="font-bold text-slate-900">'{deletingMethod.provider}'</span> ({deletingMethod.accountNumber}) মুছে ফেলতে চান?
            </p>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold text-xs"
              >
                বাতিল
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={submitting}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md disabled:opacity-50"
              >
                {submitting ? 'মুছে ফেলা হচ্ছে...' : 'হ্যাঁ, মুছে ফেলুন'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: QR Preview Zoom */}
      {previewQrUrl && (
        <div
          onClick={() => setPreviewQrUrl(null)}
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl p-6 shadow-2xl max-w-xs w-full text-center space-y-4 animate-in zoom-in duration-150"
          >
            <h4 className="text-xs font-black text-slate-700">QR Code Scan</h4>
            <div className="w-56 h-56 mx-auto bg-white p-2 border border-slate-200 rounded-2xl shadow-inner flex items-center justify-center">
              <img src={previewQrUrl} alt="QR Big Preview" className="max-w-full max-h-full object-contain" />
            </div>
            <button
              onClick={() => setPreviewQrUrl(null)}
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
