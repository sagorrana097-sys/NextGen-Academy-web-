import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { adminAPI, authAPI } from '../../services/api';
import UniversalFileUploader from '../common/UniversalFileUploader';
import UserAvatar from '../common/UserAvatar';
import {
  ShieldCheck,
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Save,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Clock,
  Shield,
  KeyRound,
  UserCheck,
  UserPlus,
  RefreshCw,
  X,
  Sparkles,
  Search,
  Check,
  Smartphone,
  QrCode,
  LockKeyhole,
  CheckCircle,
  Copy
} from 'lucide-react';

export default function AdminProfileManager({ defaultTab = 'profile' }) {
  const { lang, t } = useLanguage();
  const { user, login, updateUserProfile } = useAuth();

  // Active Sub-Tab: 'profile' | 'admins'
  const [activeTab, setActiveTab] = useState(defaultTab);

  // Profile Form State
  const [profileData, setProfileData] = useState({
    id: null,
    name: '',
    email: '',
    phone: '',
    photo: '',
    role: 'ADMIN',
    isActive: true,
    twoFactorEnabled: false,
    createdAt: ''
  });
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);

  // Password Change Form State
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  // 2FA Setup & Disable State
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [twoFactorData, setTwoFactorData] = useState(null);
  const [verify2FACode, setVerify2FACode] = useState('');
  const [loading2FASetup, setLoading2FASetup] = useState(false);
  const [verifying2FA, setVerifying2FA] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);

  const [showDisable2FAModal, setShowDisable2FAModal] = useState(false);
  const [disable2FAPassword, setDisable2FAPassword] = useState('');
  const [disabling2FA, setDisabling2FA] = useState(false);

  // Admin Users Management State
  const [adminUsers, setAdminUsers] = useState([]);
  const [loadingAdmins, setLoadingAdmins] = useState(false);
  const [adminSearch, setAdminSearch] = useState('');
  const [showAddAdminModal, setShowAddAdminModal] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [submittingAdmin, setSubmittingAdmin] = useState(false);

  // Add/Edit Admin Modal Form
  const [adminForm, setAdminForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    isActive: true
  });
  const [showModalPass, setShowModalPass] = useState(false);

  // Toast Feedback
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    fetchProfile();
    fetchAdminUsers();
  }, []);

  const fetchProfile = async () => {
    setLoadingProfile(true);
    try {
      const res = await adminAPI.getProfile();
      if (res.success && res.data) {
        setProfileData(res.data);
      }
    } catch (err) {
      console.error('Error fetching admin profile:', err);
    } finally {
      setLoadingProfile(false);
    }
  };

  const fetchAdminUsers = async () => {
    setLoadingAdmins(true);
    try {
      const res = await adminAPI.getAdminUsers();
      if (res.success && res.data) {
        setAdminUsers(res.data);
      }
    } catch (err) {
      console.error('Error fetching admin users:', err);
    } finally {
      setLoadingAdmins(false);
    }
  };

  // 1. Update Profile Info
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!profileData.name.trim() || !profileData.email.trim()) {
      showToast('নাম এবং ইমেইল দেওয়া বাধ্যতামূলক', 'error');
      return;
    }

    setSavingProfile(true);
    try {
      const res = await adminAPI.updateProfile({
        name: profileData.name.trim(),
        email: profileData.email.trim(),
        phone: profileData.phone ? profileData.phone.trim() : '',
        photo: profileData.photo || ''
      });

      if (res.success) {
        setProfileData(res.data);
        updateUserProfile({ name: res.data.name, email: res.data.email, phone: res.data.phone, photo: res.data.photo || res.data.avatar || profileData.photo });
        showToast('প্রোফাইল তথ্য সফলভাবে আপডেট করা হয়েছে!', 'success');
        fetchAdminUsers();
      } else {
        showToast(res.error?.message || 'প্রোফাইল আপডেট ব্যর্থ হয়েছে', 'error');
      }
    } catch (err) {
      showToast(err.message || 'প্রোফাইল সংরক্ষণে ত্রুটি দেখা দিয়েছে', 'error');
    } finally {
      setSavingProfile(false);
    }
  };

  // 2. Change Password
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!passwordForm.currentPassword) {
      showToast('বর্তমান পাসওয়ার্ড প্রদান করুন', 'error');
      return;
    }
    if (!passwordForm.newPassword || passwordForm.newPassword.length < 6) {
      showToast('নতুন পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে', 'error');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showToast('নতুন পাসওয়ার্ড এবং কনফার্ম পাসওয়ার্ড মিলছে না', 'error');
      return;
    }

    setChangingPassword(true);
    try {
      const res = await adminAPI.updateProfile({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });

      if (res.success) {
        showToast('পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে!', 'success');
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        showToast(res.error?.message || 'পাসওয়ার্ড পরিবর্তন ব্যর্থ হয়েছে', 'error');
      }
    } catch (err) {
      showToast(err.message || 'পাসওয়ার্ড পরিবর্তনে ত্রুটি হয়েছে', 'error');
    } finally {
      setChangingPassword(false);
    }
  };

  // 3. 2FA Generation & Setup
  const handleOpen2FAModal = async () => {
    setLoading2FASetup(true);
    try {
      const res = await authAPI.generate2FA();
      if (res.success && res.data) {
        setTwoFactorData(res.data);
        setVerify2FACode('');
        setShow2FAModal(true);
      } else {
        showToast('2FA কি তৈরিতে ব্যর্থ হয়েছে', 'error');
      }
    } catch (err) {
      showToast(err.message || '2FA সেটআপে ত্রুটি', 'error');
    } finally {
      setLoading2FASetup(false);
    }
  };

  const handleVerify2FA = async (e) => {
    e.preventDefault();
    if (!verify2FACode || verify2FACode.length < 6) {
      showToast('অনুগ্রহ করে সঠিক ৬-সংখ্যার কোড দিন', 'error');
      return;
    }

    setVerifying2FA(true);
    try {
      const res = await authAPI.verify2FA(twoFactorData.secret, verify2FACode);
      if (res.success) {
        setProfileData((prev) => ({ ...prev, twoFactorEnabled: true }));
        updateUserProfile({ twoFactorEnabled: true });
        setShow2FAModal(false);
        showToast('🎉 দ্বি-স্তরীয় প্রমাণীকরণ (2FA) সফলভাবে সক্রিয় করা হয়েছে!', 'success');
      }
    } catch (err) {
      showToast(err.message || '2FA ভেরিফিকেশন ব্যর্থ হয়েছে', 'error');
    } finally {
      setVerifying2FA(false);
    }
  };

  const handleDisable2FA = async (e) => {
    e.preventDefault();
    if (!disable2FAPassword) {
      showToast('পাসওয়ার্ড আবশ্যক', 'error');
      return;
    }

    setDisabling2FA(true);
    try {
      const res = await authAPI.disable2FA(disable2FAPassword);
      if (res.success) {
        setProfileData((prev) => ({ ...prev, twoFactorEnabled: false }));
        updateUserProfile({ twoFactorEnabled: false });
        setShowDisable2FAModal(false);
        setDisable2FAPassword('');
        showToast('দ্বি-স্তরীয় প্রমাণীকরণ (2FA) নিষ্ক্রিয় করা হয়েছে', 'success');
      }
    } catch (err) {
      showToast(err.message || '2FA নিষ্ক্রিয় করতে ব্যর্থ হয়েছে', 'error');
    } finally {
      setDisabling2FA(false);
    }
  };

  // 4. Trigger Manual Session Lock
  const handleLockSessionNow = () => {
    window.dispatchEvent(new Event('nextgen-lock-session'));
  };

  // 5. Add / Edit Admin User
  const handleSaveAdminUser = async (e) => {
    e.preventDefault();
    if (!adminForm.name.trim() || !adminForm.email.trim()) {
      showToast('নাম এবং ইমেইল আবশ্যক', 'error');
      return;
    }

    if (!editingAdmin && (!adminForm.password || adminForm.password.length < 6)) {
      showToast('পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে', 'error');
      return;
    }

    setSubmittingAdmin(true);
    try {
      if (editingAdmin) {
        const payload = {
          name: adminForm.name.trim(),
          email: adminForm.email.trim(),
          phone: adminForm.phone.trim(),
          isActive: adminForm.isActive
        };
        if (adminForm.password && adminForm.password.trim().length >= 6) {
          payload.newPassword = adminForm.password.trim();
        }
        const res = await adminAPI.updateAdminUser(editingAdmin.id, payload);
        if (res.success) {
          showToast('অ্যাডমিন তথ্য সফলভাবে আপডেট করা হয়েছে!', 'success');
          setShowAddAdminModal(false);
          setEditingAdmin(null);
          fetchAdminUsers();
        }
      } else {
        const res = await adminAPI.createAdminUser({
          name: adminForm.name.trim(),
          email: adminForm.email.trim(),
          phone: adminForm.phone.trim(),
          password: adminForm.password.trim()
        });
        if (res.success) {
          showToast('নতুন অ্যাডমিন সফলভাবে তৈরি করা হয়েছে!', 'success');
          setShowAddAdminModal(false);
          setAdminForm({ name: '', email: '', phone: '', password: '', isActive: true });
          fetchAdminUsers();
        }
      }
    } catch (err) {
      showToast(err.message || 'অ্যাডমিন সংরক্ষণ ব্যর্থ হয়েছে', 'error');
    } finally {
      setSubmittingAdmin(false);
    }
  };

  // 6. Delete Admin User
  const handleDeleteAdmin = async (adminItem) => {
    if (adminItem.id === user?.id || adminItem.id === profileData?.id) {
      showToast('আপনি নিজের অ্যাডমিন অ্যাকাউন্ট মুছে ফেলতে পারবেন না।', 'error');
      return;
    }

    if (!window.confirm(`আপনি কি নিশ্চিতভাবে অ্যাডমিন "${adminItem.name}" (${adminItem.email}) এর অ্যাকাউন্ট মুছে ফেলতে চান?`)) {
      return;
    }

    try {
      const res = await adminAPI.deleteAdminUser(adminItem.id);
      if (res.success) {
        showToast('অ্যাডমিন অ্যাকাউন্ট মুছে ফেলা হয়েছে', 'success');
        fetchAdminUsers();
      } else {
        showToast(res.error?.message || 'মুছে ফেলতে ব্যর্থ হয়েছে', 'error');
      }
    } catch (err) {
      showToast(err.message || 'অ্যাডমিন মুছে ফেলতে সমস্যা হয়েছে', 'error');
    }
  };

  // Filtered Admins
  const filteredAdmins = adminUsers.filter((a) => {
    const q = adminSearch.toLowerCase().trim();
    if (!q) return true;
    return (
      a.name?.toLowerCase().includes(q) ||
      a.email?.toLowerCase().includes(q) ||
      a.phone?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Toast Notification Alert */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-2xl shadow-2xl flex items-center space-x-3 text-xs font-bold transition-all transform animate-in slide-in-from-top-3 ${
            toast.type === 'error'
              ? 'bg-rose-600 text-white shadow-rose-600/30'
              : 'bg-emerald-600 text-white shadow-emerald-600/30'
          }`}
        >
          {toast.type === 'error' ? (
            <AlertCircle className="w-4 h-4 text-white shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 bg-rose-500/20 text-rose-300 border border-rose-500/30 px-3.5 py-1 rounded-full text-xs font-semibold backdrop-blur-md mb-3">
              <Shield className="w-3.5 h-3.5 text-rose-400" />
              <span>সুপার অ্যাডমিন ও হাই-সিকিউরিটি কন্ট্রোল</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              অ্যাডমিন প্রোফাইল ও সিকিউরিটি আর্কিটেকচার
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1.5 max-w-2xl leading-relaxed">
              ব্যক্তিগত প্রোফাইল, 2FA দ্বি-স্তরীয় প্রমাণীকরণ, পাসওয়ার্ড ও সেশন লক কন্ট্রোল পরিচালনা করুন।
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleLockSessionNow}
              className="px-4 py-2.5 rounded-2xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-400/40 text-rose-200 font-bold text-xs flex items-center space-x-2 transition-all active:scale-95 shadow-md"
            >
              <LockKeyhole className="w-4 h-4 text-rose-300" />
              <span>🔒 সেশন লক টেস্ট করুন</span>
            </button>

            <div className="px-4 py-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center">
              <span className="text-[10px] text-rose-200 block font-bold">মোট অ্যাডমিন</span>
              <span className="text-xl font-black text-white">{adminUsers.length} জন</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center space-x-2 bg-slate-200/80 p-1.5 rounded-2xl w-fit border border-slate-300/60 shadow-inner">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
            activeTab === 'profile'
              ? 'bg-slate-900 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <User className="w-4 h-4 text-rose-400" />
          <span>আমার প্রোফাইল ও সিকিউরিটি</span>
        </button>

        <button
          onClick={() => setActiveTab('admins')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
            activeTab === 'admins'
              ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-rose-200" />
          <span>অ্যাডমিন ইউজার ম্যানেজমেন্ট ({adminUsers.length})</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 1. MY PROFILE & SECURITY TAB */}
      {/* ========================================================================= */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Admin Profile Card & Basic Info */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center space-x-3">
                  <UserAvatar
                    src={profileData.photo || profileData.avatar || user?.photo || user?.avatar}
                    name={profileData.name}
                    role={profileData.role || 'SUPER_ADMIN'}
                    size="xl"
                    shape="rounded-2xl"
                    ringColor="ring-rose-500/40"
                  />
                  <div>
                    <h3 className="font-bold text-base text-slate-900">{profileData.name || 'অ্যাডমিন প্রোফাইল'}</h3>
                    <p className="text-xs text-slate-500 font-mono">{profileData.email}</p>
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-[11px] font-extrabold flex items-center space-x-1">
                  <Shield className="w-3 h-3 text-rose-600" />
                  <span>সুপার অ্যাডমিন</span>
                </span>
              </div>

              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">ব্যক্তিগত ও যোগাযোগ তথ্য</h4>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">অ্যাডমিন পুরো নাম (Full Name) *</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      required
                      placeholder="অ্যাডমিনের পুরো নাম লিখুন"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-rose-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700">ইমেইল অ্যাড্রেস (Email Address) *</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        required
                        placeholder="admin@nextgen.edu.bd"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-rose-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700">মোবাইল নম্বর (Phone Number)</label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={profileData.phone || ''}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        placeholder="+880 1800-000000"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-rose-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Profile Photo Uploader */}
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                  <UniversalFileUploader
                    label="অ্যাডমিন প্রোফাইল ছবি / অবতার (Admin Avatar - Device Upload or URL)"
                    value={profileData.photo}
                    previewType="image"
                    accept="*/*"
                    maxMb={100}
                    helperText="পাসপোর্ট সাইজ ফটো, ক্যামেরা স্ন্যাপ বা গুগল ড্রাইভ ছবি লিংক"
                    onChange={({ fileUrl, url }) => {
                      setProfileData(prev => ({ ...prev, photo: fileUrl || url || '' }));
                    }}
                  />
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
                  <button
                    type="submit"
                    disabled={savingProfile}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30 flex items-center space-x-2 transition-all active:scale-95 disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>{savingProfile ? 'সংরক্ষণ হচ্ছে...' : 'প্রোফাইল তথ্য আপডেট করুন'}</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Two-Factor Authentication (2FA) Control Card */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 rounded-2xl bg-indigo-50 text-indigo-700 border border-indigo-100">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-900">
                      দ্বি-স্তরীয় প্রমাণীকরণ (Two-Factor Authentication / 2FA)
                    </h3>
                    <p className="text-xs text-slate-500">
                      Google Authenticator বা Authy অ্যাপের মাধ্যমে ৬-সংখ্যার ওটিপি কোড দিয়ে সর্বোচ্চ নিরাপত্তা নিশ্চিত করুন।
                    </p>
                  </div>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-black border ${
                    profileData.twoFactorEnabled
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-slate-100 text-slate-600 border-slate-200'
                  }`}
                >
                  {profileData.twoFactorEnabled ? '✅ সক্রিয় (Enabled)' : '❌ নিষ্ক্রিয় (Disabled)'}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-slate-600 space-y-1">
                  <p className="font-bold text-slate-800">
                    {profileData.twoFactorEnabled
                      ? 'আপনার অ্যাকাউন্টে TOTP 2FA সক্রিয় আছে।'
                      : 'অ্যাকাউন্ট সুরক্ষার জন্য এখনই 2FA চালু করুন।'}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    লগইন করার সময় পাসওয়ার্ডের পাশাপাশি আপনার মোবাইলের Authenticator অ্যাপ থেকে ওটিপি কোড দিতে হবে।
                  </p>
                </div>

                {profileData.twoFactorEnabled ? (
                  <button
                    onClick={() => setShowDisable2FAModal(true)}
                    className="px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs border border-rose-200 flex-shrink-0 transition-colors"
                  >
                    2FA নিষ্ক্রিয় করুন
                  </button>
                ) : (
                  <button
                    onClick={handleOpen2FAModal}
                    disabled={loading2FASetup}
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/30 flex items-center space-x-2 flex-shrink-0 transition-all active:scale-95 disabled:opacity-50"
                  >
                    <QrCode className="w-4 h-4" />
                    <span>{loading2FASetup ? 'লোড হচ্ছে...' : '2FA সেটআপ করুন'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Security & Password Change */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5">
              <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
                <div className="p-2.5 rounded-xl bg-amber-50 text-amber-700 border border-amber-100">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">সিকিউরিটি ও পাসওয়ার্ড পরিবর্তন</h3>
                  <p className="text-xs text-slate-500">আপনার অ্যাকাউন্টের নিরাপত্তা নিশ্চিত করতে শক্তিশালী পাসওয়ার্ড ব্যবহার করুন</p>
                </div>
              </div>

              <form onSubmit={handleChangePassword} className="space-y-4">
                {/* Current Password */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">বর্তমান পাসওয়ার্ড (Current Password) *</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showCurrentPass ? 'text' : 'password'}
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                      required
                      placeholder="বর্তমান পাসওয়ার্ড লিখুন"
                      className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-rose-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPass(!showCurrentPass)}
                      className="p-2 text-slate-400 hover:text-slate-600 absolute right-1.5 top-1/2 -translate-y-1/2"
                    >
                      {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">নতুন পাসওয়ার্ড (New Password) *</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showNewPass ? 'text' : 'password'}
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                      required
                      placeholder="কমপক্ষে ৬ অক্ষরের নতুন পাসওয়ার্ড"
                      className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-rose-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPass(!showNewPass)}
                      className="p-2 text-slate-400 hover:text-slate-600 absolute right-1.5 top-1/2 -translate-y-1/2"
                    >
                      {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">নতুন পাসওয়ার্ড নিশ্চিত করুন (Confirm Password) *</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showConfirmPass ? 'text' : 'password'}
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                      required
                      placeholder="নতুন পাসওয়ার্ড পুনরায় লিখুন"
                      className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-rose-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPass(!showConfirmPass)}
                      className="p-2 text-slate-400 hover:text-slate-600 absolute right-1.5 top-1/2 -translate-y-1/2"
                    >
                      {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={changingPassword}
                    className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md flex items-center justify-center space-x-2 transition-all active:scale-95 disabled:opacity-50"
                  >
                    <KeyRound className="w-4 h-4 text-amber-400" />
                    <span>{changingPassword ? 'পাসওয়ার্ড পরিবর্তন হচ্ছে...' : 'পাসওয়ার্ড পরিবর্তন সম্পন্ন করুন'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. ADMIN ACCOUNTS MANAGEMENT TAB */}
      {/* ========================================================================= */}
      {activeTab === 'admins' && (
        <div className="space-y-6">
          {/* Header Controls & Search */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={adminSearch}
                onChange={(e) => setAdminSearch(e.target.value)}
                placeholder="নাম, ইমেইল বা ফোন নম্বর দিয়ে খুঁজুন..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-rose-500 focus:outline-none"
              />
            </div>

            <button
              onClick={() => {
                setEditingAdmin(null);
                setAdminForm({ name: '', email: '', phone: '', password: '', isActive: true });
                setShowAddAdminModal(true);
              }}
              className="w-full md:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30 flex items-center justify-center space-x-2 transition-all active:scale-95"
            >
              <UserPlus className="w-4 h-4" />
              <span>+ নতুন অ্যাডমিন যুক্ত করুন</span>
            </button>
          </div>

          {/* Admins Grid / Table */}
          {loadingAdmins ? (
            <div className="p-12 text-center text-slate-400 bg-white rounded-3xl border border-slate-200">
              <div className="w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-sm font-medium">অ্যাডমিন তালিকা লোড হচ্ছে...</p>
            </div>
          ) : filteredAdmins.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-500 space-y-3">
              <Shield className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="font-bold text-slate-700 text-base">কোনো অ্যাডমিন অ্যাকাউন্ট পাওয়া যায়নি</h3>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredAdmins.map((adminItem) => {
                const isSelf = adminItem.id === user?.id || adminItem.id === profileData?.id;

                return (
                  <div
                    key={adminItem.id}
                    className={`bg-white rounded-3xl border transition-all duration-200 p-5 shadow-sm hover:shadow-lg flex flex-col justify-between space-y-4 ${
                      isSelf ? 'border-rose-300 ring-2 ring-rose-500/10' : 'border-slate-200'
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <UserAvatar
                            src={adminItem.photo || adminItem.avatar || adminItem.profilePhoto}
                            name={adminItem.name}
                            role={adminItem.role || 'ADMIN'}
                            size="md"
                            shape="rounded-2xl"
                            ringColor="ring-rose-500/40"
                          />
                          <div>
                            <div className="flex items-center space-x-1.5">
                              <h4 className="font-bold text-sm text-slate-900 truncate max-w-[150px]">
                                {adminItem.name}
                              </h4>
                              {isSelf && (
                                <span className="px-1.5 py-0.5 rounded-md bg-rose-100 text-rose-800 text-[10px] font-black">
                                  আপনি
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-slate-400 font-mono block truncate max-w-[180px]">
                              {adminItem.email}
                            </span>
                          </div>
                        </div>

                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                            adminItem.isActive
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : 'bg-rose-100 text-rose-800 border border-rose-200'
                          }`}
                        >
                          {adminItem.isActive ? 'সক্রিয় (Active)' : 'নিষ্ক্রিয় (Inactive)'}
                        </span>
                      </div>

                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs space-y-1 text-slate-600">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">মোবাইল:</span>
                          <span className="font-semibold text-slate-700">{adminItem.phone || 'অনির্ধারিত'}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">রোল:</span>
                          <span className="font-bold text-rose-700">SYSTEM ADMIN</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <button
                        onClick={() => {
                          setEditingAdmin(adminItem);
                          setAdminForm({
                            name: adminItem.name || '',
                            email: adminItem.email || '',
                            phone: adminItem.phone || '',
                            password: '',
                            isActive: adminItem.isActive !== false
                          });
                          setShowAddAdminModal(true);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center space-x-1.5 transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>সম্পাদনা</span>
                      </button>

                      {!isSelf && (
                        <button
                          onClick={() => handleDeleteAdmin(adminItem)}
                          className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs flex items-center space-x-1.5 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>মুছে ফেলুন</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2FA SETUP MODAL (QR CODE & AUTHENTICATOR PAIRING) */}
      {/* ========================================================================= */}
      {show2FAModal && twoFactorData && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl space-y-5 border border-slate-200 my-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-base text-slate-900">
                    2FA সেটআপ (Google Authenticator)
                  </h3>
                  <p className="text-xs text-slate-500">দ্বি-স্তরীয় প্রমাণীকরণ সক্রিয় করুন</p>
                </div>
              </div>

              <button
                onClick={() => setShow2FAModal(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-center">
              <p className="text-xs text-slate-600 text-left">
                <strong>ধাপ ১:</strong> আপনার মোবাইলের <strong>Google Authenticator</strong> বা <strong>Authy</strong> অ্যাপ দিয়ে নিচের QR কোডটি স্ক্যান করুন:
              </p>

              {/* QR Code */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 inline-block mx-auto shadow-inner">
                <img
                  src={twoFactorData.qrCode}
                  alt="2FA QR Code"
                  className="w-48 h-48 rounded-xl object-contain mx-auto"
                />
              </div>

              {/* Manual Entry Key */}
              <div className="p-3 bg-slate-100 rounded-xl text-xs flex items-center justify-between text-left">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">ম্যানুয়াল সেটআপ কোড (Secret Key):</span>
                  <span className="font-mono font-bold text-slate-800 text-xs select-all">
                    {twoFactorData.secret}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(twoFactorData.secret);
                    setCopiedKey(true);
                    setTimeout(() => setCopiedKey(false), 2500);
                  }}
                  className="p-2 text-indigo-600 hover:text-indigo-800 rounded-lg hover:bg-white transition-colors"
                  title="Copy Secret Key"
                >
                  {copiedKey ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* Step 2 Form */}
              <form onSubmit={handleVerify2FA} className="space-y-3 pt-2 text-left">
                <p className="text-xs text-slate-600">
                  <strong>ধাপ ২:</strong> অ্যাপে প্রদর্শিত ৬-সংখ্যার কোডটি লিখে কনফার্ম করুন:
                </p>

                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    maxLength={6}
                    value={verify2FACode}
                    onChange={(e) => setVerify2FACode(e.target.value.replace(/\D/g, ''))}
                    placeholder="123456"
                    required
                    className="w-full text-center text-lg font-mono font-bold tracking-widest pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShow2FAModal(false)}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs"
                  >
                    বাতিল
                  </button>
                  <button
                    type="submit"
                    disabled={verifying2FA || verify2FACode.length < 6}
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/30 disabled:opacity-50"
                  >
                    {verifying2FA ? 'যাচাই হচ্ছে...' : '2FA সক্রিয় করুন'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2FA DISABLE CONFIRMATION MODAL */}
      {/* ========================================================================= */}
      {showDisable2FAModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-100">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900">2FA নিষ্ক্রিয় করুন</h3>
              <p className="text-xs text-slate-500">
                দ্বি-স্তরীয় প্রমাণীকরণ বন্ধ করতে আপনার বর্তমান লগইন পাসওয়ার্ড প্রদান করুন।
              </p>
            </div>

            <form onSubmit={handleDisable2FA} className="space-y-4">
              <div>
                <input
                  type="password"
                  value={disable2FAPassword}
                  onChange={(e) => setDisable2FAPassword(e.target.value)}
                  placeholder="বর্তমান পাসওয়ার্ড লিখুন"
                  required
                  autoFocus
                  className="w-full text-xs font-medium rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowDisable2FAModal(false);
                    setDisable2FAPassword('');
                  }}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={disabling2FA || !disable2FAPassword}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md disabled:opacity-50"
                >
                  {disabling2FA ? 'প্রক্রিয়াধীন...' : 'নিষ্ক্রিয় সম্পন্ন করুন'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD / EDIT ADMIN USER */}
      {/* ========================================================================= */}
      {showAddAdminModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 border border-slate-200 my-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-rose-50 text-rose-600 border border-rose-100">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-base text-slate-900">
                    {editingAdmin ? 'অ্যাডমিন তথ্য সম্পাদনা' : 'নতুন অ্যাডমিন যুক্ত করুন'}
                  </h3>
                  <p className="text-xs text-slate-500">সিস্টেম অ্যাডমিনিস্ট্রেটর অ্যাকাউন্ট তৈরি বা আপডেট করুন</p>
                </div>
              </div>

              <button
                onClick={() => setShowAddAdminModal(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAdminUser} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">অ্যাডমিনের পুরো নাম *</label>
                <input
                  type="text"
                  value={adminForm.name}
                  onChange={(e) => setAdminForm({ ...adminForm, name: e.target.value })}
                  placeholder="যেমন: ইঞ্জি. শফিউল আলম"
                  required
                  className="w-full text-xs font-medium rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">ইমেইল অ্যাড্রেস *</label>
                <input
                  type="email"
                  value={adminForm.email}
                  onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })}
                  placeholder="admin@nextgen.edu.bd"
                  required
                  className="w-full text-xs font-medium rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">মোবাইল নম্বর</label>
                <input
                  type="text"
                  value={adminForm.phone}
                  onChange={(e) => setAdminForm({ ...adminForm, phone: e.target.value })}
                  placeholder="+880 1800-000000"
                  className="w-full bg-white border border-slate-300 text-slate-900 font-semibold placeholder:text-slate-400 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  {editingAdmin ? 'নতুন পাসওয়ার্ড (পরিবর্তন না করলে খালি রাখুন)' : 'লগইন পাসওয়ার্ড *'}
                </label>
                <div className="relative">
                  <input
                    type={showModalPass ? 'text' : 'password'}
                    value={adminForm.password}
                    onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })}
                    placeholder="কমপক্ষে ৬ অক্ষরের পাসওয়ার্ড"
                    required={!editingAdmin}
                    className="w-full text-xs font-medium rounded-xl border border-slate-300 p-2.5 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowModalPass(!showModalPass)}
                    className="p-2 text-slate-400 hover:text-slate-600 absolute right-1.5 top-1/2 -translate-y-1/2"
                  >
                    {showModalPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {editingAdmin && (
                <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <div>
                    <span className="font-bold text-xs text-slate-800 block">অ্যাকাউন্ট স্ট্যাটাস</span>
                    <span className="text-[11px] text-slate-500">নিষ্ক্রিয় করলে সিস্টেমে লগইন বন্ধ থাকবে</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={adminForm.isActive}
                    onChange={(e) => setAdminForm({ ...adminForm, isActive: e.target.checked })}
                    className="w-5 h-5 rounded text-rose-600 focus:ring-rose-500 cursor-pointer"
                  />
                </div>
              )}

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddAdminModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-bold text-xs"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={submittingAdmin}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-xs shadow-md disabled:opacity-50"
                >
                  {submittingAdmin ? 'সংরক্ষণ হচ্ছে...' : editingAdmin ? 'আপডেট করুন' : 'অ্যাডমিন তৈরি করুন'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
