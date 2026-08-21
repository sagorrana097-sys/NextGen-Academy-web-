import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';
import { settingsAPI } from '../../services/api';
import PaymentMethodManager from './PaymentMethodManager';
import AdminProfileManager from './AdminProfileManager';
import GlobalSiteContentCMS from './GlobalSiteContentCMS';
import {
  Building,
  ShieldCheck,
  Users,
  KeyRound,
  Sliders,
  Save,
  Plus,
  Edit2,
  Trash2,
  Lock,
  Mail,
  Phone,
  Globe,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  Printer,
  FileText,
  UserPlus,
  RefreshCw,
  X,
  Check,
  Eye,
  EyeOff,
  UserCheck,
  CreditCard,
  Layers,
  Award,
  Video,
  Briefcase,
  Megaphone,
  GraduationCap,
  Share2,
  ToggleLeft,
  ToggleRight,
  ExternalLink,
  HelpCircle
} from 'lucide-react';

export default function AdminSettings() {
  const { t, lang } = useLanguage();
  const { user } = useAuth();
  const { settings: globalSettings, updateSettings: updateGlobalSettings, refreshSettings } = useSettings();

  // Active Tab: 'general' | 'notice' | 'admission' | 'social' | 'staff' | 'roles'
  const [activeTab, setActiveTab] = useState('general');

  // Form State for Site Settings
  const [formData, setFormData] = useState({
    academyName: 'NextGen ACADEMY',
    academyNameBn: 'নেক্সটজেন একাডেমি',
    academyNameEn: 'NextGen ACADEMY',
    tagline: 'LEARN · GROW · SUCCEED',
    taglineBn: 'শিক্ষা · সমৃদ্ধি · সাফল্য',
    taglineEn: 'LEARN · GROW · SUCCEED',
    logoUrl: '/logo.png',
    sealUrl: '/logo.png',
    contactPhone: '+880 1800-NEXTGEN',
    altPhone: '+880 1711-223344',
    contactEmail: 'info@nextgen.edu.bd',
    supportEmail: 'support@nextgen.edu.bd',
    address: 'বাড়ি নং-১২, রোড নং-০৫, ধানমন্ডি, ঢাকা-১২০৯',
    eiin: 'NGA-DHAKA-2026',
    website: 'https://nextgen.edu.bd',
    currencySymbol: '৳',
    noticeText: 'ভর্তি চলছে! শিক্ষাবর্ষ ২০২৬-এ ৬ষ্ঠ থেকে ১২শ শ্রেণিতে সীমিত আসনে ডিজিটাল ভর্তি কার্যক্রম চালু রয়েছে। যোগাযোগ: +880 1800-NEXTGEN',
    noticeTextBn: 'ভর্তি চলছে! শিক্ষাবর্ষ ২০২৬-এ ৬ষ্ঠ থেকে ১২শ শ্রেণিতে সীমিত আসনে ডিজিটাল ভর্তি কার্যক্রম চালু রয়েছে। যোগাযোগ: +880 1800-NEXTGEN',
    noticeTextEn: 'Admission Open for Academic Session 2026 from Class 6 to 12. Helpline: +880 1800-NEXTGEN',
    showNotice: true,
    admissionActive: true,
    admissionSessionYear: '২০২৬',
    admissionHelpline: '+880 1800-NEXTGEN',
    maxApplicationsPerBatch: 60,
    socialLinks: {
      facebook: 'https://facebook.com/NextGenAcademyBD',
      youtube: 'https://youtube.com/@NextGenAcademyBD',
      linkedin: 'https://linkedin.com/company/nextgen-academy-bd',
      twitter: 'https://twitter.com/NextGenAcademy'
    },
    printSettings: {
      headerStyle: 'PREMIUM_GOLD',
      receiptFooterNote: 'বিশেষ দ্রষ্টব্য: পরিশোধিত ফি কোনো অবস্থাতেই অফেরতযোগ্য। এই মানি রিসিটটি পরবর্তী রেফারেন্সের জন্য সংরক্ষণ করুন।',
      admitCardInstructions: '১. পরীক্ষা শুরুর ১৫ মিনিট পূর্বে পরীক্ষার হলে উপস্থিত হতে হবে।\n২. ডিজিটাল ওয়াচ বা মোবাইল ফোন হলে সম্পূর্ণ নিষিদ্ধ।\n৩. এই অ্যাডমিট কার্ড সাথে রাখা বাধ্যতামূলক।',
      signatures: {
        accountant: 'হিসাবরক্ষক কর্মকর্তা',
        examController: 'পরীক্ষা নিয়ন্ত্রক',
        principal: 'অধ্যক্ষ / প্রিন্সিপাল'
      }
    }
  });

  const [savingSettings, setSavingSettings] = useState(false);

  // Staff Management State
  const [staffList, setStaffList] = useState([]);
  const [loadingStaff, setLoadingStaff] = useState(false);
  const [staffSearch, setStaffSearch] = useState('');
  const [staffRoleFilter, setStaffRoleFilter] = useState('ALL');
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [resetTargetStaff, setResetTargetStaff] = useState(null);
  const [newPassword, setNewPassword] = useState('');

  // Staff Form
  const [staffForm, setStaffForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'ACCOUNTANT',
    department: 'Accounts & Finance',
    designation: 'হিসাবরক্ষক'
  });

  // Roles & Permissions State
  const [roles, setRoles] = useState([]);
  const [loadingRoles, setLoadingRoles] = useState(false);
  const [permissionsMatrix, setPermissionsMatrix] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [rolePermissions, setRolePermissions] = useState([]);
  const [showAddRoleModal, setShowAddRoleModal] = useState(false);
  const [newRoleForm, setNewRoleForm] = useState({
    name: '',
    nameBn: '',
    description: '',
    color: 'indigo',
    permissions: []
  });

  // Toast Feedback
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    fetchSettingsData();
    fetchRoles();
    fetchPermissionsMatrix();
    fetchStaff();
  }, []);

  useEffect(() => {
    if (globalSettings) {
      setFormData((prev) => ({
        ...prev,
        ...globalSettings,
        socialLinks: {
          ...prev.socialLinks,
          ...(globalSettings.socialLinks || {})
        },
        printSettings: {
          ...prev.printSettings,
          ...(globalSettings.printSettings || {})
        }
      }));
    }
  }, [globalSettings]);

  const showToast = (msg, type = 'success') => {
    setFeedback({ msg, type });
    setTimeout(() => setFeedback(null), 4000);
  };

  const fetchSettingsData = async () => {
    try {
      const res = await settingsAPI.getSettings();
      if (res.success && res.data) {
        setFormData((prev) => ({
          ...prev,
          ...res.data,
          socialLinks: {
            ...prev.socialLinks,
            ...(res.data.socialLinks || {})
          },
          printSettings: {
            ...prev.printSettings,
            ...(res.data.printSettings || {})
          }
        }));
      }
    } catch (err) {
      console.error('Fetch settings error:', err);
    }
  };

  const handleSaveSettings = async (e) => {
    if (e) e.preventDefault();
    setSavingSettings(true);
    try {
      const res = await updateGlobalSettings(formData);
      if (res.success) {
        showToast(res.message || 'সাইট সেটিংস সফলভাবে সংরক্ষিত হয়েছে!');
        refreshSettings();
      } else {
        showToast(res.error || 'সেটিংস সংরক্ষণ ব্যর্থ হয়েছে', 'error');
      }
    } catch (err) {
      console.error('Save settings error:', err);
      showToast(err.message || 'সেটিংস সংরক্ষণে সমস্যা হয়েছে', 'error');
    } finally {
      setSavingSettings(false);
    }
  };

  const fetchStaff = async () => {
    setLoadingStaff(true);
    try {
      const res = await settingsAPI.getStaff();
      if (res.success && res.data) {
        setStaffList(res.data);
      }
    } catch (err) {
      console.error('Fetch staff error:', err);
    } finally {
      setLoadingStaff(false);
    }
  };

  const fetchRoles = async () => {
    setLoadingRoles(true);
    try {
      const res = await settingsAPI.getRoles();
      if (res.success && res.data) {
        setRoles(res.data);
        if (res.data.length > 0 && !selectedRole) {
          setSelectedRole(res.data[0]);
          setRolePermissions(res.data[0].permissions || []);
        }
      }
    } catch (err) {
      console.error('Fetch roles error:', err);
    } finally {
      setLoadingRoles(false);
    }
  };

  const fetchPermissionsMatrix = async () => {
    try {
      const res = await settingsAPI.getPermissionsMatrix();
      if (res.success && res.data) {
        setPermissionsMatrix(res.data);
      }
    } catch (err) {
      console.error('Fetch permissions matrix error:', err);
    }
  };

  const handleSelectRole = (role) => {
    setSelectedRole(role);
    setRolePermissions(role.permissions || []);
  };

  const handleTogglePermission = (permKey) => {
    if (selectedRole?.isSystem) {
      showToast('সুপার অ্যাডমিন রোলের পারমিশন পরিবর্তনযোগ্য নয়।', 'error');
      return;
    }
    setRolePermissions((prev) =>
      prev.includes(permKey) ? prev.filter((k) => k !== permKey) : [...prev, permKey]
    );
  };

  const handleSaveRolePermissions = async () => {
    if (!selectedRole) return;
    try {
      const res = await settingsAPI.updateRole(selectedRole.id, {
        permissions: rolePermissions
      });
      if (res.success) {
        showToast(`'${selectedRole.nameBn || selectedRole.name}' রোলের পারমিশন সফলভাবে সংরক্ষিত হয়েছে!`);
        fetchRoles();
      }
    } catch (err) {
      console.error('Save role permissions error:', err);
      showToast(err.message || 'পারমিশন সংরক্ষণ ব্যর্থ হয়েছে', 'error');
    }
  };

  const handleAddStaffSubmit = async (e) => {
    e.preventDefault();
    try {
      let res;
      if (editingStaff) {
        res = await settingsAPI.updateStaff(editingStaff.id, staffForm);
      } else {
        res = await settingsAPI.addStaff(staffForm);
      }
      if (res.success) {
        showToast(res.message);
        setShowAddStaffModal(false);
        setEditingStaff(null);
        setStaffForm({
          name: '',
          email: '',
          phone: '',
          password: '',
          role: 'ACCOUNTANT',
          department: 'Accounts & Finance',
          designation: 'হিসাবরক্ষক'
        });
        fetchStaff();
      }
    } catch (err) {
      console.error('Staff submit error:', err);
      showToast(err.message || 'স্টাফ সংরক্ষণ ব্যর্থ হয়েছে', 'error');
    }
  };

  const handleDeleteStaff = async (staff) => {
    if (staff.id === 1) {
      showToast('প্রধান সুপার অ্যাডমিন অ্যাকাউন্ট মোছা যাবে না।', 'error');
      return;
    }
    if (!window.confirm(`আপনি কি নিশ্চিতভাবে '${staff.name}' স্টাফ অ্যাকাউন্ট মুছে ফেলতে চান?`)) return;
    try {
      const res = await settingsAPI.deleteStaff(staff.id);
      if (res.success) {
        showToast(res.message);
        fetchStaff();
      }
    } catch (err) {
      console.error('Delete staff error:', err);
      showToast(err.message || 'স্টাফ মোছা ব্যর্থ হয়েছে', 'error');
    }
  };

  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    if (!resetTargetStaff || !newPassword) return;
    try {
      const res = await settingsAPI.resetStaffPassword(resetTargetStaff.id, { newPassword });
      if (res.success) {
        showToast(res.message);
        setShowResetPasswordModal(false);
        setResetTargetStaff(null);
        setNewPassword('');
      }
    } catch (err) {
      console.error('Reset password error:', err);
      showToast(err.message || 'পাসওয়ার্ড রিসেট ব্যর্থ হয়েছে', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-slate-700/60">
        <div className="absolute right-0 top-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 -bottom-10 w-60 h-60 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold">
              <Sliders className="w-3.5 h-3.5" />
              <span>{lang === 'bn' ? 'সিস্টেম কনফিগারেশন ও সাইট সেটিংস' : 'System Configuration & Site Settings'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white">
              {formData.academyNameBn || formData.academyName}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl font-medium">
              {formData.tagline || 'LEARN · GROW · SUCCEED'} • EIIN: {formData.eiin}
            </p>
          </div>

          <button
            onClick={handleSaveSettings}
            disabled={savingSettings}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 flex items-center space-x-2 transition-all transform active:scale-95 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{savingSettings ? 'সংরক্ষণ হচ্ছে...' : 'সেটিংস সংরক্ষণ করুন'}</span>
          </button>
        </div>
      </div>

      {/* Toast Feedback */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl border text-xs font-bold flex items-center space-x-2.5 animate-in fade-in ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{feedback.msg}</span>
        </div>
      )}

      {/* Settings Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('my-profile')}
          className={`px-4 py-2.5 rounded-2xl font-bold text-xs transition-all flex items-center space-x-2 ${
            activeTab === 'my-profile'
              ? 'bg-rose-600 text-white shadow-md shadow-rose-600/25'
              : 'bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200'
          }`}
        >
          <Lock className="w-4 h-4 text-rose-500" />
          <span>আমার প্রোফাইল ও সিকিউরিটি</span>
        </button>

        <button
          onClick={() => setActiveTab('admin-users')}
          className={`px-4 py-2.5 rounded-2xl font-bold text-xs transition-all flex items-center space-x-2 ${
            activeTab === 'admin-users'
              ? 'bg-rose-600 text-white shadow-md shadow-rose-600/25'
              : 'bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-rose-500" />
          <span>অ্যাডমিন ইউজার ম্যানেজমেন্ট</span>
        </button>

        <button
          onClick={() => setActiveTab('site-cms')}
          className={`px-4 py-2.5 rounded-2xl font-bold text-xs transition-all flex items-center space-x-2 ${
            activeTab === 'site-cms'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/25'
              : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>🌐 সাইট কনটেন্ট CMS</span>
        </button>

        <button
          onClick={() => setActiveTab('general')}
          className={`px-4 py-2.5 rounded-2xl font-bold text-xs transition-all flex items-center space-x-2 ${
            activeTab === 'general'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>সাধারণ তথ্য (General Info)</span>
        </button>

        <button
          onClick={() => setActiveTab('notice')}
          className={`px-4 py-2.5 rounded-2xl font-bold text-xs transition-all flex items-center space-x-2 ${
            activeTab === 'notice'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
          }`}
        >
          <Megaphone className="w-4 h-4" />
          <span>নোটিশ ও ব্যানার (Notice & Banner)</span>
        </button>

        <button
          onClick={() => setActiveTab('admission')}
          className={`px-4 py-2.5 rounded-2xl font-bold text-xs transition-all flex items-center space-x-2 ${
            activeTab === 'admission'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>ভর্তি নিয়ন্ত্রণ (Admission Control)</span>
        </button>

        <button
          onClick={() => setActiveTab('social')}
          className={`px-4 py-2.5 rounded-2xl font-bold text-xs transition-all flex items-center space-x-2 ${
            activeTab === 'social'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
          }`}
        >
          <Share2 className="w-4 h-4" />
          <span>সোশ্যাল ও লিংকস (Social Links)</span>
        </button>

        <button
          onClick={() => setActiveTab('staff')}
          className={`px-4 py-2.5 rounded-2xl font-bold text-xs transition-all flex items-center space-x-2 ${
            activeTab === 'staff'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>স্টাফ ও ইউজার (Staff Users)</span>
        </button>

        <button
          onClick={() => setActiveTab('roles')}
          className={`px-4 py-2.5 rounded-2xl font-bold text-xs transition-all flex items-center space-x-2 ${
            activeTab === 'roles'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
          }`}
        >
          <KeyRound className="w-4 h-4" />
          <span>রোল ও পারমিশন (RBAC)</span>
        </button>

        <button
          onClick={() => setActiveTab('payment-methods')}
          className={`px-4 py-2.5 rounded-2xl font-bold text-xs transition-all flex items-center space-x-2 ${
            activeTab === 'payment-methods'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
              : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>পেমেন্ট মেথড ও গেটওয়ে</span>
        </button>
      </div>

      {/* ========================================================== */}
      {/* TAB 0.0: GLOBAL SITE CONTENT CMS */}
      {/* ========================================================== */}
      {activeTab === 'site-cms' && (
        <GlobalSiteContentCMS />
      )}

      {/* ========================================================== */}
      {/* TAB 0.1: MY PROFILE & SECURITY */}
      {/* ========================================================== */}
      {activeTab === 'my-profile' && (
        <AdminProfileManager defaultTab="profile" />
      )}

      {/* ========================================================== */}
      {/* TAB 0.2: ADMIN ACCOUNTS MANAGEMENT */}
      {/* ========================================================== */}
      {activeTab === 'admin-users' && (
        <AdminProfileManager defaultTab="admins" />
      )}

      {/* ========================================================== */}
      {/* TAB 1: GENERAL INFO & BRANDING */}
      {/* ========================================================== */}
      {activeTab === 'general' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
                <Building className="w-5 h-5 text-indigo-600" />
                <span>প্রতিষ্ঠানের পরিচিতি ও মূল ব্র্যান্ডিং সেটিংস</span>
              </h3>
              <p className="text-xs text-slate-500">
                ওয়েবসাইটের হেডার, ফুটার, মানি রিসিট ও লগইন পেজে প্রদর্শিত তথ্য
              </p>
            </div>
            <button
              onClick={handleSaveSettings}
              disabled={savingSettings}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center space-x-1.5 shadow-sm"
            >
              <Save className="w-3.5 h-3.5" />
              <span>সংরক্ষণ করুন</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">একাডেমির নাম (বাংলা)</label>
              <input
                type="text"
                value={formData.academyNameBn}
                onChange={(e) => setFormData({ ...formData, academyNameBn: e.target.value, nameBn: e.target.value })}
                className="w-full text-xs font-medium rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Academy Name (English)</label>
              <input
                type="text"
                value={formData.academyNameEn}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    academyNameEn: e.target.value,
                    academyName: e.target.value,
                    nameEn: e.target.value
                  })
                }
                className="w-full text-xs font-medium rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">স্লোগান / ট্যাগলাইন (Tagline)</label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value, taglineEn: e.target.value })}
                className="w-full text-xs font-medium rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">লোগো URL (Logo Path)</label>
              <input
                type="text"
                value={formData.logoUrl}
                onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                className="w-full text-xs font-medium rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">অফিসিয়াল ফোন নম্বর</label>
              <input
                type="text"
                value={formData.contactPhone}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value, phone: e.target.value })}
                className="w-full text-xs font-medium rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">অফিসিয়াল ইমেইল অ্যাড্রেস</label>
              <input
                type="email"
                value={formData.contactEmail}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value, email: e.target.value })}
                className="w-full text-xs font-medium rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">EIIN / ইনস্টিটিউট কোড</label>
              <input
                type="text"
                value={formData.eiin}
                onChange={(e) => setFormData({ ...formData, eiin: e.target.value, code: e.target.value })}
                className="w-full text-xs font-medium rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">অফিসিয়াল ওয়েবসাইট URL</label>
              <input
                type="text"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                className="w-full text-xs font-medium rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">মুদ্রা প্রতীক (Currency)</label>
              <input
                type="text"
                value={formData.currencySymbol}
                onChange={(e) => setFormData({ ...formData, currencySymbol: e.target.value })}
                className="w-full text-xs font-medium rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="sm:col-span-2 lg:col-span-3">
              <label className="block text-xs font-bold text-slate-700 mb-1">ক্যাম্পাস পূর্ণাঙ্গ ঠিকানা (Address)</label>
              <textarea
                rows={2}
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full text-xs font-medium rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* TAB 2: NOTICE & BANNER */}
      {/* ========================================================== */}
      {activeTab === 'notice' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
                <Megaphone className="w-5 h-5 text-indigo-600" />
                <span>ডিজিটাল নোটিশ ও টপ অ্যানাউন্সমেন্ট ব্যানার</span>
              </h3>
              <p className="text-xs text-slate-500">
                লগইন পেজ ও অভিভাবক পোর্টালে স্ক্রলিং ব্রেকিং নোটিশ নিয়ন্ত্রণ
              </p>
            </div>
            <button
              onClick={handleSaveSettings}
              disabled={savingSettings}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center space-x-1.5 shadow-sm"
            >
              <Save className="w-3.5 h-3.5" />
              <span>সংরক্ষণ করুন</span>
            </button>
          </div>

          {/* Toggle Switch */}
          <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-xs font-black text-indigo-900 block">নোটিশ বার সক্রিয় রাখুন (Show Notice Banner)</span>
              <span className="text-[11px] text-indigo-700">সক্রিয় রাখলে লগইন পেজ ও পোর্টালে অ্যানাউন্সমেন্ট প্রদর্শিত হবে</span>
            </div>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, showNotice: !formData.showNotice })}
              className={`p-1 rounded-full transition-colors ${
                formData.showNotice ? 'text-emerald-600' : 'text-slate-400'
              }`}
            >
              {formData.showNotice ? (
                <ToggleRight className="w-10 h-10" />
              ) : (
                <ToggleLeft className="w-10 h-10" />
              )}
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">নোটিশ টেক্সট (বাংলা)</label>
              <textarea
                rows={3}
                value={formData.noticeTextBn || formData.noticeText}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    noticeTextBn: e.target.value,
                    noticeText: e.target.value
                  })
                }
                placeholder="যেমন: ভর্তি চলছে! শিক্ষাবর্ষ ২০২৬-এ..."
                className="w-full text-xs font-medium rounded-xl border border-slate-300 p-3 focus:ring-2 focus:ring-indigo-500 leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Notice Text (English)</label>
              <textarea
                rows={3}
                value={formData.noticeTextEn}
                onChange={(e) => setFormData({ ...formData, noticeTextEn: e.target.value })}
                placeholder="e.g. Admission Open for Session 2026..."
                className="w-full text-xs font-medium rounded-xl border border-slate-300 p-3 focus:ring-2 focus:ring-indigo-500 leading-relaxed"
              />
            </div>
          </div>

          {/* Live Preview of Notice */}
          {formData.showNotice && (
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-600">লাইভ নোটিশ প্রিভিউ (Live Preview):</span>
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 flex items-center space-x-3">
                <span className="px-2.5 py-0.5 rounded-lg bg-amber-500 text-slate-950 font-black text-[10px] uppercase tracking-wider flex-shrink-0 animate-pulse">
                  বিজ্ঞপ্তি
                </span>
                <p className="text-xs font-medium">{formData.noticeTextBn || formData.noticeText}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================== */}
      {/* TAB 3: ADMISSION CONTROL */}
      {/* ========================================================== */}
      {activeTab === 'admission' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
                <GraduationCap className="w-5 h-5 text-indigo-600" />
                <span>অনলাইন ভর্তি কার্যক্রম ও সেশন নিয়ন্ত্রণ</span>
              </h3>
              <p className="text-xs text-slate-500">
                পাবলিক অনলাইন আবেদন ফর্ম খোলা/বন্ধ ও হেল্পলাইন কনফিগারেশন
              </p>
            </div>
            <button
              onClick={handleSaveSettings}
              disabled={savingSettings}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center space-x-1.5 shadow-sm"
            >
              <Save className="w-3.5 h-3.5" />
              <span>সংরক্ষণ করুন</span>
            </button>
          </div>

          {/* Toggle Switch */}
          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-xs font-black text-emerald-900 block">
                অনলাইন ভর্তি আবেদন সক্রিয় রাখুন (Admission Portal Open)
              </span>
              <span className="text-[11px] text-emerald-700">
                সক্রিয় রাখলে শিক্ষার্থীরা ওয়েবসাইটে সরাসরি ভর্তি আবেদন করতে পারবে
              </span>
            </div>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, admissionActive: !formData.admissionActive })}
              className={`p-1 rounded-full transition-colors ${
                formData.admissionActive ? 'text-emerald-600' : 'text-slate-400'
              }`}
            >
              {formData.admissionActive ? (
                <ToggleRight className="w-10 h-10" />
              ) : (
                <ToggleLeft className="w-10 h-10" />
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">ভর্তি শিক্ষাবর্ষ (Session Year)</label>
              <input
                type="text"
                value={formData.admissionSessionYear}
                onChange={(e) => setFormData({ ...formData, admissionSessionYear: e.target.value })}
                className="w-full text-xs font-medium rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">ভর্তি হেল্পলাইন মোবাইল</label>
              <input
                type="text"
                value={formData.admissionHelpline}
                onChange={(e) => setFormData({ ...formData, admissionHelpline: e.target.value })}
                className="w-full text-xs font-medium rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">ব্যাচ প্রতি সর্বোচ্চ আবেদন গ্রহণ</label>
              <input
                type="number"
                value={formData.maxApplicationsPerBatch}
                onChange={(e) => setFormData({ ...formData, maxApplicationsPerBatch: Number(e.target.value) })}
                className="w-full text-xs font-medium rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* TAB 4: SOCIAL LINKS */}
      {/* ========================================================== */}
      {activeTab === 'social' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
                <Share2 className="w-5 h-5 text-indigo-600" />
                <span>সোশ্যাল মিডিয়া ও ডিজিটাল প্ল্যাটফর্ম লিংকস</span>
              </h3>
              <p className="text-xs text-slate-500">
                ফুটার ও যোগাযোগ সেকশনে প্রদর্শিত অফিসিয়াল সোশ্যাল পেজ
              </p>
            </div>
            <button
              onClick={handleSaveSettings}
              disabled={savingSettings}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center space-x-1.5 shadow-sm"
            >
              <Save className="w-3.5 h-3.5" />
              <span>সংরক্ষণ করুন</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">ফেসবুক পেজ (Facebook URL)</label>
              <input
                type="text"
                value={formData.socialLinks?.facebook || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    socialLinks: { ...formData.socialLinks, facebook: e.target.value }
                  })
                }
                placeholder="https://facebook.com/..."
                className="w-full text-xs font-medium rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">ইউটিউব চ্যানেল (YouTube URL)</label>
              <input
                type="text"
                value={formData.socialLinks?.youtube || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    socialLinks: { ...formData.socialLinks, youtube: e.target.value }
                  })
                }
                placeholder="https://youtube.com/@..."
                className="w-full text-xs font-medium rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">লিঙ্কডইন প্রোফাইল (LinkedIn URL)</label>
              <input
                type="text"
                value={formData.socialLinks?.linkedin || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    socialLinks: { ...formData.socialLinks, linkedin: e.target.value }
                  })
                }
                placeholder="https://linkedin.com/company/..."
                className="w-full text-xs font-medium rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">টুইটার / এক্স (Twitter URL)</label>
              <input
                type="text"
                value={formData.socialLinks?.twitter || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    socialLinks: { ...formData.socialLinks, twitter: e.target.value }
                  })
                }
                placeholder="https://twitter.com/..."
                className="w-full text-xs font-medium rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* TAB 5: STAFF & USERS */}
      {/* ========================================================== */}
      {activeTab === 'staff' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
                <Users className="w-5 h-5 text-indigo-600" />
                <span>স্টাফ ও প্রশাসনিক ইউজার তালিকা ({staffList.length} জন)</span>
              </h3>
              <p className="text-xs text-slate-500">
                নতুন স্টাফ তৈরি, রোল অ্যাসাইন এবং পাসওয়ার্ড রিসেট করার ব্যবস্থা
              </p>
            </div>
            <button
              onClick={() => {
                setEditingStaff(null);
                setStaffForm({
                  name: '',
                  email: '',
                  phone: '',
                  password: '',
                  role: 'ACCOUNTANT',
                  department: 'Accounts & Finance',
                  designation: 'হিসাবরক্ষক'
                });
                setShowAddStaffModal(true);
              }}
              className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center space-x-1.5 shadow-md shadow-indigo-600/20"
            >
              <UserPlus className="w-4 h-4" />
              <span>+ নতুন স্টাফ যুক্ত করুন</span>
            </button>
          </div>

          {/* Staff Table */}
          <div className="overflow-x-auto border border-slate-100 rounded-2xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">নাম ও আইডি</th>
                  <th className="py-3 px-4">ইমেইল ও ফোন</th>
                  <th className="py-3 px-4">রোল ও পদবি</th>
                  <th className="py-3 px-4">বিভাগ</th>
                  <th className="py-3 px-4 text-center">স্ট্যাটাস</th>
                  <th className="py-3 px-4 text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {staffList.map((staff) => (
                  <tr key={staff.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{staff.name}</div>
                      <div className="text-[10px] font-mono text-slate-400">ID #{staff.id}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-slate-700">{staff.email}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{staff.phone}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {staff.role}
                      </span>
                      <div className="text-[11px] text-slate-500 mt-0.5">{staff.designation || 'স্টাফ'}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{staff.department || 'প্রশাসন'}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        সক্রিয়
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-1.5">
                      <button
                        onClick={() => {
                          setResetTargetStaff(staff);
                          setShowResetPasswordModal(true);
                        }}
                        className="p-1.5 rounded-xl bg-amber-50 text-amber-700 hover:bg-amber-100"
                        title="পাসওয়ার্ড রিসেট"
                      >
                        <KeyRound className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          setEditingStaff(staff);
                          setStaffForm({
                            name: staff.name,
                            email: staff.email,
                            phone: staff.phone,
                            password: '',
                            role: staff.role,
                            department: staff.department || '',
                            designation: staff.designation || ''
                          });
                          setShowAddStaffModal(true);
                        }}
                        className="p-1.5 rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                        title="এডিট করুন"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      {staff.id !== 1 && (
                        <button
                          onClick={() => handleDeleteStaff(staff)}
                          className="p-1.5 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100"
                          title="ডিলিট"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* TAB 6: RBAC ROLES */}
      {/* ========================================================== */}
      {activeTab === 'roles' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-3">
              <h3 className="text-sm font-black text-slate-900 flex items-center space-x-2">
                <KeyRound className="w-4 h-4 text-indigo-600" />
                <span>সিস্টেম রোলসমূহ ({roles.length} টি)</span>
              </h3>
              <div className="space-y-2">
                {roles.map((r) => (
                  <div
                    key={r.id}
                    onClick={() => handleSelectRole(r)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                      selectedRole?.id === r.id
                        ? 'bg-indigo-50/80 border-indigo-300 ring-2 ring-indigo-500/20'
                        : 'bg-slate-50/70 border-slate-200 hover:bg-slate-100/70'
                    }`}
                  >
                    <div>
                      <div className="font-black text-slate-900 text-xs">{r.nameBn || r.name}</div>
                      <div className="text-[10px] text-slate-500">{r.description}</div>
                    </div>
                    <span className="px-2 py-0.5 rounded-lg bg-white text-indigo-700 font-mono font-bold text-[10px] shadow-xs">
                      {r.permissions?.length || 0} পারমিশন
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    '{selectedRole?.nameBn || selectedRole?.name}' পারমিশন ম্যাট্রিক্স
                  </h3>
                  <p className="text-xs text-slate-500">মডিউলভিত্তিক অ্যাক্সেস ও অ্যাকশন পারমিশন নির্বাচন করুন</p>
                </div>
                <button
                  onClick={handleSaveRolePermissions}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center space-x-1.5 shadow-sm"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>পারমিশন সেভ করুন</span>
                </button>
              </div>

              <div className="space-y-5 max-h-[500px] overflow-y-auto pr-2">
                {permissionsMatrix.map((mod) => (
                  <div key={mod.moduleKey} className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-3">
                    <span className="text-xs font-black text-indigo-900 block">{mod.moduleNameBn}</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {mod.permissions.map((p) => {
                        const isChecked = rolePermissions.includes(p.key);
                        return (
                          <label
                            key={p.key}
                            className={`flex items-center space-x-2 p-2.5 rounded-xl border cursor-pointer transition-all ${
                              isChecked
                                ? 'bg-indigo-50 border-indigo-300 text-indigo-900'
                                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleTogglePermission(p.key)}
                              className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                            />
                            <span className="text-xs font-medium">{p.labelBn}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* TAB 7: PAYMENT GATEWAYS & ACCOUNTS */}
      {/* ========================================================== */}
      {activeTab === 'payment-methods' && (
        <PaymentMethodManager />
      )}

      {/* Modal: Add/Edit Staff */}
      {showAddStaffModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
                <UserPlus className="w-5 h-5 text-indigo-600" />
                <span>{editingStaff ? 'স্টাফ তথ্য আপডেট' : 'নতুন স্টাফ যুক্ত করুন'}</span>
              </h3>
              <button
                onClick={() => setShowAddStaffModal(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddStaffSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">স্টাফের পুরো নাম</label>
                <input
                  type="text"
                  value={staffForm.name}
                  onChange={(e) => setStaffForm({ ...staffForm, name: e.target.value })}
                  placeholder="যেমন: মোঃ কামরুল ইসলাম"
                  required
                  className="w-full text-xs font-medium rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">ইমেইল অ্যাড্রেস (লগইনের জন্য)</label>
                <input
                  type="email"
                  value={staffForm.email}
                  onChange={(e) => setStaffForm({ ...staffForm, email: e.target.value })}
                  placeholder="kamrul@nextgen.edu.bd"
                  required
                  className="w-full text-xs font-medium rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">মোবাইল নম্বর</label>
                <input
                  type="text"
                  value={staffForm.phone}
                  onChange={(e) => setStaffForm({ ...staffForm, phone: e.target.value })}
                  placeholder="01712345678"
                  required
                  className="w-full text-xs font-medium rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {!editingStaff && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">লগইন পাসওয়ার্ড</label>
                  <input
                    type="password"
                    value={staffForm.password}
                    onChange={(e) => setStaffForm({ ...staffForm, password: e.target.value })}
                    placeholder="••••••••"
                    required
                    className="w-full text-xs font-medium rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">রোল (Role)</label>
                  <select
                    value={staffForm.role}
                    onChange={(e) => setStaffForm({ ...staffForm, role: e.target.value })}
                    className="w-full text-xs font-bold rounded-xl border border-slate-300 p-2.5 bg-slate-50"
                  >
                    <option value="ADMIN">ADMIN</option>
                    <option value="CO_ADMIN">CO_ADMIN</option>
                    <option value="ACCOUNTANT">ACCOUNTANT</option>
                    <option value="RECEPTIONIST">RECEPTIONIST</option>
                    <option value="TEACHER">TEACHER</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">পদবি (Designation)</label>
                  <input
                    type="text"
                    value={staffForm.designation}
                    onChange={(e) => setStaffForm({ ...staffForm, designation: e.target.value })}
                    placeholder="হিসাবরক্ষক"
                    className="w-full text-xs font-medium rounded-xl border border-slate-300 p-2.5"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddStaffModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold text-xs"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md"
                >
                  {editingStaff ? 'আপডেট করুন' : 'যুক্ত করুন'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Reset Staff Password */}
      {showResetPasswordModal && resetTargetStaff && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
                <KeyRound className="w-5 h-5 text-amber-600" />
                <span>পাসওয়ার্ড রিসেট</span>
              </h3>
              <button
                onClick={() => setShowResetPasswordModal(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleResetPasswordSubmit} className="space-y-3">
              <p className="text-xs text-slate-600">
                ইউজার: <span className="font-bold text-slate-900">{resetTargetStaff.name}</span>
              </p>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">নতুন পাসওয়ার্ড</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="কমপক্ষে ৬ অক্ষর"
                  required
                  className="w-full text-xs font-medium rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowResetPasswordModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold text-xs"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md"
                >
                  রিসেট নিশ্চিত করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
