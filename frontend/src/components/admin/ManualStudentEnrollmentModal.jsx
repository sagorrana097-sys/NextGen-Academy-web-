import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useSettings } from '../../context/SettingsContext';
import { studentAPI } from '../../services/api';
import {
  UserPlus,
  User,
  Phone,
  Mail,
  GraduationCap,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  CheckCircle2,
  Copy,
  Check,
  Send,
  MessageCircle,
  X,
  RefreshCw,
  Layers,
  Calendar,
  Building2,
  Printer
} from 'lucide-react';

export default function ManualStudentEnrollmentModal({
  isOpen,
  onClose,
  classes = [],
  batches = [],
  onEnrollmentComplete
}) {
  const { lang } = useLanguage();
  const { settings } = useSettings();
  const availableGroups = settings?.academic?.groups || ['বিজ্ঞান', 'মানবিক', 'ব্যবসায় শিক্ষা'];

  // Generate unique sequential Student ID: NGA-26-XXXX
  const generateStudentId = () => {
    const random4 = Math.floor(1000 + Math.random() * 9000);
    return `NGA-26-${random4}`;
  };

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    classId: classes[0]?.id ? String(classes[0].id) : '1',
    batchId: '',
    group: '',
    email: '',
    customPassword: '',
    studentIdNumber: generateStudentId()
  });

  const [useCustomPassword, setUseCustomPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [createdCredentials, setCreatedCredentials] = useState(null);
  const [copied, setCopied] = useState(false);

  const selectedClassObj = classes.find((c) => String(c.id) === String(formData.classId));
  const selectedClassName = selectedClassObj?.nameEn || selectedClassObj?.nameBn || selectedClassObj?.name || '';
  const requiresGroup = ['Class 9', 'Class 10', 'Class 11', 'Class 12', '9', '10', '11', '12', '৯ম', '১০ম', 'একাদশ', 'দ্বাদশ', 'SSC', 'HSC'].some(
    (c) => selectedClassName.includes(c) || Number(selectedClassObj?.numericGrade) >= 9
  );

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: '',
        phone: '',
        classId: classes[0]?.id ? String(classes[0].id) : '1',
        batchId: '',
        group: '',
        email: '',
        customPassword: '',
        studentIdNumber: generateStudentId()
      });
      setCreatedCredentials(null);
      setError(null);
      setCopied(false);
    }
  }, [isOpen, classes]);

  if (!isOpen) return null;

  const handleRegenerateId = () => {
    setFormData((prev) => ({
      ...prev,
      studentIdNumber: generateStudentId()
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim()) {
      setError(lang === 'bn' ? 'শিক্ষার্থীর সম্পূর্ণ নাম আবশ্যক' : 'Student full name is required');
      return;
    }

    if (!formData.phone.trim()) {
      setError(lang === 'bn' ? 'শিক্ষার্থী বা অভিভাবকের মোবাইল নম্বর আবশ্যক' : 'Phone number is required');
      return;
    }

    if (requiresGroup && !formData.group) {
      setError(lang === 'bn' ? '৯ম থেকে ১২শ শ্রেণির শিক্ষার্থীদের জন্য বিভাগ (Group) নির্বাচন করুন' : 'Please select a Group for Class 9-12');
      return;
    }

    setLoading(true);

    try {
      const activePassword = useCustomPassword && formData.customPassword.trim()
        ? formData.customPassword.trim()
        : formData.phone.trim();

      const payload = {
        name: formData.name.trim(),
        nameBn: formData.name.trim(),
        phone: formData.phone.trim(),
        guardianPhone: formData.phone.trim(),
        classId: Number(formData.classId),
        batchId: formData.batchId ? Number(formData.batchId) : null,
        group: requiresGroup ? (formData.group || 'Science') : null,
        email: formData.email.trim() || undefined,
        password: activePassword,
        studentIdNumber: formData.studentIdNumber.trim(),
        rollNo: Math.floor(10 + Math.random() * 90)
      };

      const res = await studentAPI.create(payload);

      if (res.success && res.data) {
        const credentials = res.data.credentials || {
          studentName: formData.name.trim(),
          studentId: formData.studentIdNumber.trim(),
          phone: formData.phone.trim(),
          password: activePassword,
          email: formData.email.trim() || `${formData.studentIdNumber.toLowerCase().replace(/[^a-z0-9]/g, '')}@nextgen.edu.bd`,
          className: classes.find((c) => String(c.id) === String(formData.classId))?.nameBn || 'শ্রেণি',
          group: requiresGroup ? formData.group : null
        };

        setCreatedCredentials(credentials);

        if (onEnrollmentComplete) {
          onEnrollmentComplete(res.data.student || res.data);
        }
      } else {
        throw new Error(res.error?.message || 'Failed to enroll student');
      }
    } catch (err) {
      console.error('Enrollment error:', err);
      setError(err.message || (lang === 'bn' ? 'শিক্ষার্থী ভর্তি সম্পন্ন করতে সমস্যা হয়েছে' : 'Failed to complete student enrollment'));
    } finally {
      setLoading(false);
    }
  };

  const getShareableText = () => {
    if (!createdCredentials) return '';
    return `🏛️ নেক্সটজেন একাডেমি (NextGen Academy)
পশ্চিম জয়দেবপুর, বাস-স্ট্যান্ড, গাজীপুর
-----------------------------------
🎉 অভিনন্দন! আপনার ভর্তি সফলভাবে সম্পন্ন হয়েছে।

👤 শিক্ষার্থীর নাম: ${createdCredentials.studentName}
🆔 লগইন স্টুডেন্ট আইডি: ${createdCredentials.studentId}
🔑 পাসওয়ার্ড: ${createdCredentials.password}
📱 রেজিস্টার্ড মোবাইল: ${createdCredentials.phone}
🏫 শ্রেণি/কোর্স: ${createdCredentials.className}
🌐 লগইন পোর্টাল: ${window.location.origin}

হেল্পলাইন: 01792818005 • info@nextgen.edu.bd`;
  };

  const handleCopyCredentials = () => {
    const text = getShareableText();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSendWhatsApp = () => {
    if (!createdCredentials?.phone) return;
    let cleanPhone = createdCredentials.phone.replace(/\D/g, '');
    if (cleanPhone.startsWith('0')) {
      cleanPhone = `880${cleanPhone.substring(1)}`;
    } else if (!cleanPhone.startsWith('880')) {
      cleanPhone = `880${cleanPhone}`;
    }

    const message = encodeURIComponent(getShareableText());
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full shadow-2xl p-6 sm:p-8 text-white space-y-6 relative overflow-hidden my-auto">
        {/* Glowing ambient orbs */}
        <div className="absolute -top-24 -right-24 w-52 h-52 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-52 h-52 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 relative z-10">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 text-emerald-400 border border-emerald-500/30 shadow-md">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-white">
                {createdCredentials
                  ? 'ভর্তি সম্পন্ন ও অ্যাক্সেস কার্ড'
                  : 'নতুন শিক্ষার্থী সরাসরি ভর্তি'}
              </h3>
              <p className="text-[11px] text-slate-400">
                {createdCredentials
                  ? 'স্টুডেন্ট আইডি ও পাসওয়ার্ড ক্রেডেনশিয়াল'
                  : 'স্বয়ংক্রিয় আইডি ও পাসওয়ার্ড জেনারেটর'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Alert Banner */}
        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-center space-x-2.5 animate-in fade-in">
            <X className="w-4 h-4 text-rose-400 shrink-0" />
            <span className="font-semibold">{error}</span>
          </div>
        )}

        {/* ==================================================================== */}
        {/* VIEW 1: ENROLLMENT FORM */}
        {/* ==================================================================== */}
        {!createdCredentials ? (
          <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
            {/* Auto-Generated Student ID Pill */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-emerald-500/30 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-400 block tracking-wider">
                  স্বয়ংক্রিয় স্টুডেন্ট আইডি (Auto-Generated ID)
                </span>
                <span className="text-sm font-black font-mono text-white tracking-widest">
                  {formData.studentIdNumber}
                </span>
              </div>
              <button
                type="button"
                onClick={handleRegenerateId}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-400 transition-colors"
                title="নতুন আইডি জেনারেট করুন"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            {/* Student Full Name */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                শিক্ষার্থীর পূর্ণ নাম (Full Name) *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  autoFocus
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. তানভীর আহমেদ অথবা Tanvir Ahmed"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                মোবাইল নম্বর (Phone Number) *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="e.g. 01792818005"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all"
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                ℹ️ এই নম্বরটি স্বয়ংক্রিয়ভাবে শিক্ষার্থীর ডিফল্ট লগইন পাসওয়ার্ড হিসেবে সেট হবে।
              </p>
            </div>

            {/* Class & Batch & Group Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  শ্রেণি (Class) *
                </label>
                <div className="relative">
                  <GraduationCap className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <select
                    value={formData.classId}
                    onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-2xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 appearance-none transition-all cursor-pointer"
                  >
                    {classes.map((cls) => (
                      <option key={cls.id} value={cls.id} className="bg-slate-900 text-white">
                        {cls.nameBn || cls.nameEn}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Dynamic Group Field for Class 9 to 12 */}
              {requiresGroup ? (
                <div>
                  <label className="block text-xs font-bold text-amber-300 mb-1.5">
                    বিভাগ (Group) *
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <select
                      value={formData.group || ''}
                      onChange={(e) => setFormData({ ...formData, group: e.target.value })}
                      required={requiresGroup}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-amber-500/40 rounded-2xl text-xs text-white font-bold focus:outline-none focus:ring-2 focus:ring-emerald-400 appearance-none transition-all cursor-pointer"
                    >
                      <option value="" className="bg-slate-900 text-slate-400">নির্বাচন করুন...</option>
                      {availableGroups.map((grp) => (
                        <option key={grp} value={grp} className="bg-slate-900 text-white">
                          {grp}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ) : (
                /* Dynamic Section Field when NOT requiring group */
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    শাখা / সেকশন (Section) *
                  </label>
                  <div className="relative">
                    <Layers className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <select
                      value={formData.sectionName || ''}
                      onChange={(e) => setFormData({ ...formData, sectionName: e.target.value, section: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-2xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 appearance-none transition-all cursor-pointer"
                    >
                      <option value="" className="bg-slate-900 text-slate-400">শাখা নির্বাচন করুন...</option>
                      {(settings?.academic?.sections || ['পদ্মা', 'মেঘনা', 'যমুনা']).map((sec, idx) => (
                        <option key={idx} value={sec} className="bg-slate-900 text-white">
                          {sec}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* When requiresGroup is active, render Section field in full width row */}
            {requiresGroup && (
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  শাখা / সেকশন (Section) *
                </label>
                <div className="relative">
                  <Layers className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <select
                    value={formData.sectionName || ''}
                    onChange={(e) => setFormData({ ...formData, sectionName: e.target.value, section: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-2xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 appearance-none transition-all cursor-pointer"
                  >
                    <option value="" className="bg-slate-900 text-slate-400">শাখা নির্বাচন করুন...</option>
                    {(settings?.academic?.sections || ['পদ্মা', 'মেঘনা', 'যমুনা']).map((sec, idx) => (
                      <option key={idx} value={sec} className="bg-slate-900 text-white">
                        {sec}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Optional Email Address */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                ইমেইল ঠিকানা (Optional Email)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="student@example.com (ফাঁকা রাখলে অটো ইমেইল তৈরি হবে)"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Custom Password Toggle */}
            <div className="pt-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300 flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={useCustomPassword}
                    onChange={(e) => setUseCustomPassword(e.target.checked)}
                    className="rounded text-emerald-500 focus:ring-emerald-400 h-4 w-4 bg-slate-950 border-slate-700"
                  />
                  <span>কাস্টম পাসওয়ার্ড সেট করতে চান?</span>
                </label>
              </div>

              {useCustomPassword && (
                <div className="mt-2 relative animate-in fade-in">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.customPassword}
                    onChange={(e) => setFormData({ ...formData, customPassword: e.target.value })}
                    placeholder="পাসওয়ার্ড লিখুন (ন্যূনতম ৬ অক্ষর)"
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-950 border border-slate-700 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-3 space-y-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs sm:text-sm shadow-xl shadow-emerald-600/30 transition-all flex items-center justify-center space-x-2 active:scale-95 disabled:opacity-50"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>ভর্তি সম্পন্ন ও আইডি কার্ড তৈরি করুন</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-2 text-xs font-bold text-slate-400 hover:text-white flex items-center justify-center space-x-1.5 transition-colors"
              >
                <span>বাতিল করুন</span>
              </button>
            </div>
          </form>
        ) : (
          /* ==================================================================== */
          /* VIEW 2: ADMISSION SUCCESS & CREDENTIAL SHARE CARD */
          /* ==================================================================== */
          <div className="space-y-5 relative z-10 animate-in zoom-in-95">
            {/* Header Success Celebration */}
            <div className="text-center space-y-1.5">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-2xl animate-bounce">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h4 className="text-base sm:text-lg font-black text-white">
                🎉 শিক্ষার্থী ভর্তি সম্পন্ন হয়েছে!
              </h4>
              <p className="text-xs text-slate-400">
                নিচের লগইন আইডি ও পাসওয়ার্ড ব্যবহার করে শিক্ষার্থী পোর্টালে প্রবেশ করতে পারবে।
              </p>
            </div>

            {/* Credential Card */}
            <div className="p-5 rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border border-amber-500/30 shadow-2xl space-y-3.5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <div className="flex items-center space-x-2 text-amber-300">
                  <Building2 className="w-4 h-4" />
                  <span className="text-xs font-black uppercase tracking-wider">
                    নেক্সটজেন একাডেমি লগইন তথ্য
                  </span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                  সক্রিয় অ্যাকাউন্ট
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">শিক্ষার্থীর নাম</span>
                  <span className="font-bold text-white text-sm truncate block mt-0.5">
                    {createdCredentials.studentName}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">শ্রেণি / কোর্স</span>
                  <span className="font-bold text-emerald-300 text-sm truncate block mt-0.5">
                    {createdCredentials.className}
                  </span>
                </div>
              </div>

              {/* Login ID Row */}
              <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">লগইন স্টুডেন্ট আইডি</span>
                  <span className="text-base font-black font-mono text-amber-300 tracking-wider">
                    {createdCredentials.studentId}
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">বা মোবাইল নম্বর</span>
              </div>

              {/* Password Row */}
              <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">ডিফল্ট পাসওয়ার্ড</span>
                  <span className="text-base font-black font-mono text-emerald-300 tracking-wider">
                    {createdCredentials.password}
                  </span>
                </div>
                <span className="text-[10px] text-slate-500">গোপন রাখুন</span>
              </div>

              <div className="text-[10px] text-slate-400 text-center pt-1">
                📍 পশ্চিম জয়দেবপুর, বাস-স্ট্যান্ড, গাজীপুর • হেল্পলাইন: ০১৭৯২৮১৮০০৫
              </div>
            </div>

            {/* Action Buttons: Copy & WhatsApp */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <button
                type="button"
                onClick={handleCopyCredentials}
                className="py-3 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs shadow-md border border-slate-600 transition-all flex items-center justify-center space-x-2 active:scale-95"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-300">কপি সম্পন্ন হয়েছে!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-amber-400" />
                    <span>📋 কপি করুন</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleSendWhatsApp}
                className="py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center space-x-2 active:scale-95"
              >
                <MessageCircle className="w-4 h-4" />
                <span>💬 WhatsApp এ পাঠান</span>
              </button>
            </div>

            {/* Finish Actions */}
            <div className="pt-2 flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setCreatedCredentials(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all"
              >
                + আরেকটি নতুন ভর্তি করুন
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition-all"
              >
                সম্পন্ন (Done)
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
