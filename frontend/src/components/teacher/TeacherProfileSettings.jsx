import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { teacherAPI } from '../../services/api';
import UniversalFileUploader from '../common/UniversalFileUploader';
import {
  UserCheck,
  Phone,
  Mail,
  Shield,
  Eye,
  EyeOff,
  Save,
  CheckCircle2,
  AlertCircle,
  GraduationCap,
  Clock,
  MapPin,
  FileText,
  Sparkles,
  BookOpen
} from 'lucide-react';

export default function TeacherProfileSettings() {
  const { t, lang } = useLanguage();
  const { user } = useAuth();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Form states
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [qualifications, setQualifications] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [officeHours, setOfficeHours] = useState('');
  const [roomNo, setRoomNo] = useState('');
  const [bio, setBio] = useState('');
  const [photo, setPhoto] = useState('');
  const [isPhoneVisible, setIsPhoneVisible] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      const res = await teacherAPI.getMyProfile();
      if (res.success && res.data) {
        setProfile(res.data);
        setPhone(res.data.phone || res.data.mobile_number || '');
        setEmail(res.data.email || res.data.contact_email || '');
        setQualifications(res.data.qualifications || '');
        setSpecialization(res.data.specialization || '');
        setOfficeHours(res.data.officeHours || '');
        setRoomNo(res.data.roomNo || '');
        setBio(res.data.bio || '');
        setPhoto(res.data.photo || res.data.user?.photo || '');
        setIsPhoneVisible(res.data.is_phone_visible !== false);
      }
    } catch (err) {
      console.error('Failed to load profile:', err);
      setErrorMessage(err.message || 'প্রোফাইল লোড করতে ব্যর্থ হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePrivacy = async () => {
    const nextVal = !isPhoneVisible;
    setIsPhoneVisible(nextVal);
    try {
      await teacherAPI.togglePrivacy(nextVal);
      setSuccessMessage(
        nextVal
          ? (lang === 'bn' ? 'মোবাইল নম্বরটি এখন অভিভাবক ও শিক্ষার্থীদের কাছে দৃশ্যমান।' : 'Phone number is now visible to parents and students.')
          : (lang === 'bn' ? 'মোবাইল নম্বরটি সফলভাবে গোপন রাখা হয়েছে।' : 'Phone number is now hidden from parents and students.')
      );
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setIsPhoneVisible(!nextVal); // revert
      setErrorMessage(err.message || 'প্রাইভেসী সেটিংস সংরক্ষণ ব্যর্থ হয়েছে');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const payload = {
        phone,
        email,
        qualifications,
        specialization,
        officeHours,
        roomNo,
        bio,
        photo,
        is_phone_visible: isPhoneVisible
      };

      const res = await teacherAPI.updateMyProfile(payload);
      if (res.success) {
        setProfile(res.data);
        setSuccessMessage(
          lang === 'bn'
            ? 'প্রোফাইল ও যোগাযোগ তথ্য সফলভাবে আপডেট হয়েছে!'
            : 'Profile & contact details updated successfully!'
        );
        setTimeout(() => setSuccessMessage(''), 4000);
      }
    } catch (err) {
      console.error('Failed to update profile:', err);
      setErrorMessage(err.message || 'প্রোফাইল সংরক্ষণ করতে ত্রুটি হয়েছে');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[350px] bg-white rounded-3xl border border-slate-200">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-slate-700/50">
        <div className="absolute right-0 top-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold">
              <Shield className="w-3.5 h-3.5" />
              <span>{lang === 'bn' ? 'ব্যক্তিগত গোপনীয়তা ও যোগাযোগ নিয়ন্ত্রণ' : 'Privacy & Contact Controls'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              {t('myProfileSettings')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl font-medium">
              {lang === 'bn'
                ? 'আপনার প্রোফাইল তথ্য, যোগাযোগের নম্বর এবং অভিভাবক-শিক্ষার্থীদের কাছে নম্বর প্রদর্শন বা গোপন রাখার নিয়ন্ত্রণ করুন।'
                : 'Manage your faculty profile details, contact information, and toggle phone visibility.'}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/10 flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold text-lg">
              {profile?.name?.charAt(0) || 'T'}
            </div>
            <div>
              <p className="text-xs font-bold text-white truncate max-w-[150px]">{profile?.name}</p>
              <p className="text-[11px] text-emerald-300">{profile?.designation}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center space-x-2 animate-in fade-in">
          <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Form */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
          {/* Privacy Toggle Box */}
          <div className={`p-5 rounded-2xl border transition-all ${
            isPhoneVisible ? 'bg-emerald-50/60 border-emerald-200' : 'bg-amber-50/60 border-amber-200'
          }`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-xl mt-0.5 ${
                  isPhoneVisible ? 'bg-emerald-600 text-white' : 'bg-amber-600 text-white'
                }`}>
                  {isPhoneVisible ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900">
                    {t('privacyToggleLabel')}
                  </h4>
                  <p className="text-xs text-slate-600 mt-1">
                    {isPhoneVisible
                      ? (lang === 'bn' ? 'সবুজ চিহ্নিত: নিবন্ধিত অভিভাবক ও শিক্ষার্থীরা আপনার মোবাইল নম্বর দেখতে পারবে এবং সরাসরি কল/হোয়াটসঅ্যাপ করতে পারবে।' : 'Visible: Registered parents & students can view your phone and call/WhatsApp.')
                      : (lang === 'bn' ? 'হলুদ চিহ্নিত: নম্বর গোপন রাখা হয়েছে। অভিভাবকরা শুধু ইমেইল বা পোর্টালের মাধ্যমে বার্তা পাঠাতে পারবে।' : 'Hidden: Parents can only message via email or portal contact request.')}
                  </p>
                </div>
              </div>

              {/* Toggle Switch */}
              <button
                type="button"
                onClick={handleTogglePrivacy}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  isPhoneVisible ? 'bg-emerald-600' : 'bg-slate-300'
                }`}
                role="switch"
                aria-checked={isPhoneVisible}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    isPhoneVisible ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <h3 className="font-bold text-sm text-slate-900 pb-2 border-b border-slate-100 flex items-center space-x-2">
              <UserCheck className="w-4 h-4 text-emerald-600" />
              <span>{lang === 'bn' ? 'প্রোফাইল ও যোগাযোগ বিবরণী সম্পাদনা' : 'Edit Profile & Contact Info'}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-900 mb-1">
                  {t('contactNumber')} <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    placeholder="01811000000"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-900 mb-1">
                  {lang === 'bn' ? 'অফিসিয়াল ইমেইল' : 'Official Email'} <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="teacher@nextgen.edu.bd"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-900 mb-1">
                  {t('qualifications')}
                </label>
                <div className="relative">
                  <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={qualifications}
                    onChange={(e) => setQualifications(e.target.value)}
                    placeholder="বি.এসসি (অনার্স), এম.এসসি (গণিত, ঢাবি)"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-900 mb-1">
                  {t('specialization')}
                </label>
                <div className="relative">
                  <BookOpen className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                    placeholder="General & Higher Mathematics"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-900 mb-1">
                  {t('officeRoom')}
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={roomNo}
                    onChange={(e) => setRoomNo(e.target.value)}
                    placeholder="রুম ২০৪ (বিজ্ঞান ভবন)"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-900 mb-1">
                  {t('officeHours')}
                </label>
                <div className="relative">
                  <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={officeHours}
                    onChange={(e) => setOfficeHours(e.target.value)}
                    placeholder="রবি - বৃহঃ সকাল ৯:৩০ - বিকাল ৩:৩০"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-900 mb-1">
                {lang === 'bn' ? 'শিক্ষক পরিচিতি / বায়ো' : 'Bio / Short Introduction'}
              </label>
              <div className="relative">
                <textarea
                  rows="3"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="আপনার শিক্ষকতা অভিজ্ঞতা, বিশেষ দক্ষতা ও শিক্ষার্থীদের উদ্দেশ্যে বার্তা..."
                  className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>
            </div>

            {/* Profile Photo Uploader */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
              <UniversalFileUploader
                label="প্রোফাইল ছবি / অবতার (Profile Photo - Device Upload or URL)"
                value={photo}
                previewType="image"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.txt,.csv,.zip,image/*,audio/*,video/*"
                maxMb={100}
                helperText="পাসপোর্ট সাইজ ফটো, ক্যামেরা স্ন্যাপ বা গুগল ড্রাইভ ছবি লিংক"
                onChange={({ fileUrl, url }) => {
                  setPhoto(fileUrl || url || '');
                }}
              />
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-lg shadow-emerald-600/20 flex items-center space-x-2 transition-all disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? t('processing') : t('save')}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right 1 Col: Live Preview */}
        <div className="space-y-4">
          <div className="bg-slate-900 text-white p-4 rounded-2xl flex items-center justify-between">
            <span className="text-xs font-bold flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{lang === 'bn' ? 'অভিভাবকদের ভিউ লাইভ প্রিভিউ' : 'Live Preview for Parents'}</span>
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              isPhoneVisible ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
            }`}>
              {isPhoneVisible ? (lang === 'bn' ? 'নম্বর দৃশ্যমান' : 'Phone Visible') : (lang === 'bn' ? 'নম্বর গোপন' : 'Phone Hidden')}
            </span>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-800 text-white font-black text-xl flex items-center justify-center shadow-md">
                {profile?.name?.charAt(0) || 'T'}
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900">{profile?.name}</h4>
                <p className="text-[11px] font-semibold text-emerald-700">{specialization || 'বিষয় শিক্ষক'}</p>
                <p className="text-[10px] text-slate-500">{profile?.designation}</p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 text-xs text-slate-600">
              <p className="text-[11px] truncate">🎓 {qualifications || 'যোগ্যতা যুক্ত করা হয়নি'}</p>
              <p className="text-[11px] truncate">📍 {roomNo || 'রুম নম্বর'}</p>
              <p className="text-[11px] truncate">⏰ {officeHours || 'সময়সূচি'}</p>
            </div>

            {/* Preview Contact Actions */}
            {isPhoneVisible ? (
              <div className="space-y-2">
                <div className="p-2 bg-emerald-50 rounded-lg border border-emerald-100 text-center font-mono font-bold text-xs text-emerald-800">
                  {phone || '01811000000'}
                </div>
                <div className="grid grid-cols-3 gap-1 text-[10px] font-bold text-center text-white">
                  <span className="p-1.5 rounded-lg bg-emerald-600">📞 কল</span>
                  <span className="p-1.5 rounded-lg bg-teal-600">💬 চ্যাট</span>
                  <span className="p-1.5 rounded-lg bg-slate-800">📩 এসএমএস</span>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-center text-[11px] text-amber-800 font-semibold space-y-1.5">
                <p>🔒 শিক্ষকের অনুরোধে নম্বরটি গোপন রয়েছে</p>
                <span className="inline-block px-3 py-1 bg-blue-600 text-white rounded-lg text-[10px] font-bold">
                  ✉️ ইমেইল পাঠান
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
