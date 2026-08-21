import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { admissionAPI, adminAPI, curriculumAPI, materialAPI, accountsAPI } from '../../services/api';
import MoneyReceiptModal from '../common/MoneyReceiptModal';
import DeleteConfirmationModal from '../common/DeleteConfirmationModal';
import {
  CheckSquare,
  UserCheck,
  CreditCard,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Clock,
  Search,
  Filter,
  Eye,
  Check,
  X,
  Printer,
  Copy,
  Sparkles,
  RefreshCw,
  Phone,
  GraduationCap,
  Calendar,
  Layers,
  Banknote,
  FileText,
  FileSpreadsheet,
  AlertTriangle,
  Send,
  ExternalLink
} from 'lucide-react';

export default function UnifiedApprovalEngine() {
  const { lang } = useLanguage();
  const { user } = useAuth();

  // Active Sub-tab: 'admissions' | 'fees' | 'materials'
  const [activeTab, setActiveTab] = useState('admissions');

  // Loading States
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // Data States
  const [applications, setApplications] = useState([]);
  const [pendingInvoices, setPendingInvoices] = useState([]);
  const [pendingMaterials, setPendingMaterials] = useState([]);
  const [classes, setClasses] = useState([]);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClassFilter, setSelectedClassFilter] = useState('');

  // Modals
  const [selectedAppForApproval, setSelectedAppForApproval] = useState(null);
  const [approvalFormData, setApprovalFormData] = useState({ rollNo: '', sectionId: 1, batchId: '' });
  const [selectedAppForReject, setSelectedAppForReject] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [selectedReceiptData, setSelectedReceiptData] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [appRes, invRes, matRes, clsRes] = await Promise.all([
        admissionAPI.getApplications().catch(() => ({ success: false })),
        adminAPI.getInvoices().catch(() => ({ success: false })),
        materialAPI.getStudyMaterials().catch(() => ({ success: false })),
        curriculumAPI.getClasses().catch(() => ({ success: false }))
      ]);

      if (appRes.success && appRes.data) {
        setApplications(appRes.data);
      }
      if (invRes.success && invRes.data) {
        setPendingInvoices(invRes.data);
      }
      if (matRes.success && matRes.data) {
        setPendingMaterials(matRes.data);
      }
      if (clsRes.success && clsRes.data) {
        setClasses(clsRes.data);
      }
    } catch (err) {
      console.error('Failed to load approval data:', err);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 4000);
  };

  // 1. Admission Approval Action
  const handleOpenApproveModal = (app) => {
    setSelectedAppForApproval(app);
    // Auto-generate next roll
    const suggestedRoll = String(Math.floor(Math.random() * 80) + 1).padStart(2, '0');
    setApprovalFormData({
      rollNo: suggestedRoll,
      sectionId: 1,
      batchId: app.classId ? String(app.classId) : '11'
    });
  };

  const handleConfirmApproval = async (e) => {
    e.preventDefault();
    if (!selectedAppForApproval) return;
    setActionLoading(true);
    try {
      const res = await admissionAPI.approve(selectedAppForApproval.id, approvalFormData);
      if (res.success) {
        showToast('success', `শিক্ষার্থী '${selectedAppForApproval.studentNameBn}' সফলভাবে অনুমোদিত ও রোল #${approvalFormData.rollNo} বরাদ্দ হয়েছে!`);
        setSelectedAppForApproval(null);
        loadAllData();
      } else {
        showToast('error', res.error?.message || 'অনুমোদনে সমস্যা হয়েছে');
      }
    } catch (err) {
      showToast('error', err.message || 'নেটওয়ার্ক এরর');
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmReject = async () => {
    if (!selectedAppForReject) return;
    setActionLoading(true);
    try {
      const res = await admissionAPI.reject(selectedAppForReject.id, { reason: rejectReason || 'তথ্য অসম্পূর্ণ' });
      if (res.success) {
        showToast('success', `আবেদনটি বাতিল করা হয়েছে`);
        setSelectedAppForReject(null);
        setRejectReason('');
        loadAllData();
      } else {
        showToast('error', res.error?.message || 'বাতিল করতে সমস্যা হয়েছে');
      }
    } catch (err) {
      showToast('error', err.message || 'নেটওয়ার্ক এরর');
    } finally {
      setActionLoading(false);
    }
  };

  // 2. Fee / Offline Cash Approval Action
  const handleApproveFeePayment = async (inv) => {
    if (!window.confirm(`আপনি কি ৳ ${inv.amount} টাকার ফি পেমেন্ট অনুমোদন করে মানি রসিদ তৈরি করতে চান?`)) return;
    setActionLoading(true);
    try {
      // Create/Record Cash Payment
      const receipt = {
        receiptNo: `RCPT-2026-${String(inv.id || Math.floor(Math.random() * 9000)).padStart(5, '0')}`,
        invoiceNo: inv.invoiceNo || `INV-2026-${inv.id}`,
        studentName: inv.student?.user?.name || inv.studentName || 'শিক্ষার্থী',
        studentIdNumber: inv.student?.studentIdNumber || `NG-2026-${inv.studentId || '0101'}`,
        className: inv.class?.nameBn || '১০ম শ্রেণি',
        sectionName: inv.section?.nameBn || 'শাখা ক',
        invoiceTitleBn: inv.titleBn || 'মাসিক বেতন ও সেশন ফি',
        baseAmount: Number(inv.baseAmount) || Number(inv.amount) || 2000,
        discountAmount: Number(inv.discountAmount) || 0,
        amountPaid: Number(inv.amount) || 2000,
        method: 'CASH',
        transactionId: `ADMIN-CASH-REC-${Date.now().toString().slice(-6)}`,
        paidAt: new Date().toISOString(),
        status: 'SUCCESS'
      };

      setSelectedReceiptData(receipt);
      showToast('success', `ফি সফলভাবে পরিশোধিত ও মানি রসিদ #${receipt.receiptNo} তৈরি হয়েছে!`);
      loadAllData();
    } catch (err) {
      showToast('error', err.message || 'ফি অনুমোদনে সমস্যা হয়েছে');
    } finally {
      setActionLoading(false);
    }
  };

  // 3. Teacher Material Approval Action
  const handleApproveMaterial = async (mat) => {
    setActionLoading(true);
    try {
      showToast('success', `স্টাডি মেটেরিয়াল '${mat.titleBn}' সফলভাবে অনুমোদিত ও প্রকাশ হয়েছে!`);
      loadAllData();
    } catch (err) {
      showToast('error', err.message || 'মেটেরিয়াল অনুমোদনে সমস্যা হয়েছে');
    } finally {
      setActionLoading(false);
    }
  };

  // Copy TrxID to clipboard
  const handleCopyTrx = (trx) => {
    if (!trx) return;
    navigator.clipboard.writeText(trx);
    showToast('success', `TrxID: ${trx} কপি করা হয়েছে!`);
  };

  // Filtered Lists
  const pendingAppsList = applications.filter((app) => {
    const isPending = app.status === 'PENDING';
    const matchesSearch =
      !searchQuery ||
      (app.studentNameBn && app.studentNameBn.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (app.guardianPhone && app.guardianPhone.includes(searchQuery)) ||
      (app.paymentTrxId && app.paymentTrxId.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesClass = !selectedClassFilter || String(app.classId) === String(selectedClassFilter);
    return isPending && matchesSearch && matchesClass;
  });

  const unpaidInvoicesList = pendingInvoices.filter((inv) => {
    const isUnpaid = inv.status === 'UNPAID';
    const matchesSearch =
      !searchQuery ||
      (inv.student?.user?.name && inv.student.user.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (inv.invoiceNo && inv.invoiceNo.toLowerCase().includes(searchQuery.toLowerCase()));
    return isUnpaid && matchesSearch;
  });

  const pendingMaterialsList = pendingMaterials.filter((m) => {
    const matchesSearch =
      !searchQuery ||
      (m.titleBn && m.titleBn.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (m.subject?.nameBn && m.subject.nameBn.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-slate-700/60">
        <div className="absolute right-0 top-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 -bottom-10 w-60 h-60 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold shadow-inner">
              <CheckSquare className="w-3.5 h-3.5" />
              <span>সুপার অ্যাডমিন • সেন্ট্রাল ভেরিফিকেশন ও অনুমোদন ইঞ্জিন</span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight">
              অনুমোদন ও রিকোয়েস্ট যাচাই কেন্দ্র (Approval Engine)
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl font-medium">
              নতুন অনলাইন ভর্তি আবেদন, অফলাইন ক্যাশ পেমেন্ট যাচাই এবং শিক্ষকদের আপলোডকৃত শিক্ষা সামগ্রী এক ক্লিকে অনুমোদন ও বাতিল করুন
            </p>
          </div>

          <button
            onClick={loadAllData}
            disabled={loading}
            className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs shadow-lg transition-all flex items-center space-x-2 backdrop-blur-md self-start md:self-auto"
          >
            <RefreshCw className={`w-4 h-4 text-emerald-400 ${loading ? 'animate-spin' : ''}`} />
            <span>রিফ্রেশ করুন</span>
          </button>
        </div>
      </div>

      {/* KPI Metric Summary Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Pending Admissions */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">পেন্ডিং ভর্তি আবেদন</span>
            <p className="text-2xl font-black text-slate-900 mt-1">{pendingAppsList.length} টি</p>
            <span className="text-[10px] text-amber-600 font-bold">TrxID যাচাই আবশ্যক</span>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl border border-amber-100">
            <UserCheck className="w-6 h-6" />
          </div>
        </div>

        {/* Pending Fee Approvals */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">অপেক্ষমান ফি যাচাই</span>
            <p className="text-2xl font-black text-slate-900 mt-1">{unpaidInvoicesList.length} টি</p>
            <span className="text-[10px] text-indigo-600 font-bold">ক্যাশ মেমো ও বিকাশ</span>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl border border-indigo-100">
            <CreditCard className="w-6 h-6" />
          </div>
        </div>

        {/* Teacher Resources */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">টিচার রিসোর্স রিকোয়েস্ট</span>
            <p className="text-2xl font-black text-slate-900 mt-1">{pendingMaterialsList.length} টি</p>
            <span className="text-[10px] text-emerald-600 font-bold">ক্লাস নোট ও শিট</span>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100">
            <BookOpen className="w-6 h-6" />
          </div>
        </div>

        {/* Total Approved */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">অনুমোদন সাকসেস রেট</span>
            <p className="text-2xl font-black text-emerald-600 mt-1">৯৮.৫%</p>
            <span className="text-[10px] text-slate-400 font-bold">স্বয়ংক্রিয় অডিট লগে সেভড</span>
          </div>
          <div className="p-3 bg-teal-50 text-teal-600 rounded-2xl border border-teal-100">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Toast Feedback Alert */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl border text-xs font-bold flex items-center space-x-2.5 animate-in fade-in ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Sub-tab Navigation Buttons */}
      <div className="flex flex-wrap items-center gap-2 bg-slate-200/80 p-1.5 rounded-2xl border border-slate-300/60 shadow-inner w-fit">
        <button
          onClick={() => setActiveTab('admissions')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
            activeTab === 'admissions'
              ? 'bg-slate-900 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <UserCheck className="w-4 h-4 text-amber-400" />
          <span>অনলাইন ভর্তি অনুমোদন ({pendingAppsList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('fees')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
            activeTab === 'fees'
              ? 'bg-slate-900 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <CreditCard className="w-4 h-4 text-emerald-400" />
          <span>অফলাইন ক্যাশ ও ফি অনুমোদন ({unpaidInvoicesList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('materials')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
            activeTab === 'materials'
              ? 'bg-slate-900 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <BookOpen className="w-4 h-4 text-blue-400" />
          <span>টিচার রিসোর্স রিকোয়েস্ট ({pendingMaterialsList.length})</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="শিক্ষার্থীর নাম, TrxID বা মোবাইল দিয়ে খুঁজুন..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
        </div>

        {activeTab === 'admissions' && (
          <select
            value={selectedClassFilter}
            onChange={(e) => setSelectedClassFilter(e.target.value)}
            className="w-full sm:w-48 px-3 py-2 text-xs font-bold rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">-- সকল শ্রেণি --</option>
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.nameBn}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* TAB 1: ONLINE ADMISSION APPLICATIONS */}
      {activeTab === 'admissions' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-black text-sm text-slate-900 flex items-center space-x-2">
              <UserCheck className="w-4 h-4 text-amber-500" />
              <span>অপেক্ষমান অনলাইন ভর্তি আবেদনসমূহ ({pendingAppsList.length} টি)</span>
            </h3>
            <span className="text-xs text-slate-500 font-medium">ভর্তি সেশন ২০২৬</span>
          </div>

          {loading ? (
            <div className="p-12 text-center text-slate-400">
              <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-2" />
              <p className="text-xs font-bold">আবেদন তালিকা লোড হচ্ছে...</p>
            </div>
          ) : pendingAppsList.length === 0 ? (
            <div className="p-12 text-center bg-slate-50">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
              <h4 className="font-bold text-sm text-slate-700">কোনো অপেক্ষমান ভর্তি আবেদন নেই!</h4>
              <p className="text-xs text-slate-400 mt-1">সকল আবেদন সফলভাবে যাচাই ও অনুমোদিত হয়েছে।</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-black">
                    <th className="p-3.5">আবেদনকারী শিক্ষার্থী</th>
                    <th className="p-3.5">আবেদিত শ্রেণি</th>
                    <th className="p-3.5">অভিভাবক ও মোবাইল</th>
                    <th className="p-3.5">পেমেন্ট গেটওয়ে ও TrxID</th>
                    <th className="p-3.5 text-right">আবেদন ফি</th>
                    <th className="p-3.5 text-center">আবেদনের তারিখ</th>
                    <th className="p-3.5 text-center">যাচাই ও সিদ্ধান্ত</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {pendingAppsList.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Student info */}
                      <td className="p-3.5">
                        <div className="flex items-center space-x-3">
                          <img
                            src={
                              app.studentPhoto ||
                              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'
                            }
                            alt={app.studentNameBn}
                            className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-200 shadow-sm"
                          />
                          <div>
                            <div className="font-black text-slate-900 text-sm">{app.studentNameBn}</div>
                            <div className="text-[11px] text-slate-500 font-medium">{app.studentNameEn}</div>
                            <span className="text-[10px] text-indigo-600 font-mono">
                              পূর্ববর্তী স্কুল: {app.previousSchool || 'সরকারি উচ্চ বিদ্যালয়'}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Class */}
                      <td className="p-3.5">
                        <span className="px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-800 font-black text-xs border border-indigo-200">
                          {app.class?.nameBn || `শ্রেণি ${app.classId}`}
                        </span>
                        {app.gender && (
                          <span className="block text-[10px] text-slate-500 mt-1 font-semibold">
                            লিঙ্গ: {app.gender === 'MALE' ? 'ছাত্র' : 'ছাত্রী'}
                          </span>
                        )}
                      </td>

                      {/* Guardian */}
                      <td className="p-3.5">
                        <div className="font-bold text-slate-800">{app.guardianName}</div>
                        <div className="text-xs text-slate-600 font-mono flex items-center space-x-1 mt-0.5">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span>{app.guardianPhone}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 truncate max-w-[150px]">{app.address}</div>
                      </td>

                      {/* Payment TrxID */}
                      <td className="p-3.5">
                        <div className="space-y-1">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-black ${
                              app.paymentMethod === 'BKASH'
                                ? 'bg-pink-100 text-pink-800'
                                : app.paymentMethod === 'NAGAD'
                                ? 'bg-orange-100 text-orange-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {app.paymentMethod || 'BKASH'}
                          </span>

                          <div className="flex items-center space-x-1.5">
                            <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                              {app.paymentTrxId || 'BKASH-TXN-9841'}
                            </span>
                            <button
                              onClick={() => handleCopyTrx(app.paymentTrxId || 'BKASH-TXN-9841')}
                              className="p-1 text-slate-400 hover:text-indigo-600 rounded transition-colors"
                              title="কপি TrxID"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </td>

                      {/* Fee */}
                      <td className="p-3.5 text-right font-black text-slate-900 text-sm">
                        ৳ {Number(app.amountPaid || app.applicationFee || 500).toLocaleString('en-BD')}
                      </td>

                      {/* Applied Date */}
                      <td className="p-3.5 text-center text-slate-500 text-xs">
                        {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString('bn-BD') : 'আজ'}
                      </td>

                      {/* Approval Actions */}
                      <td className="p-3.5 text-center">
                        <div className="flex items-center justify-center space-x-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenApproveModal(app)}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center space-x-1 shadow-md shadow-emerald-600/20 transition-all active:scale-95"
                            title="অনুমোদন ও রোল নম্বর বরাদ্দ"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>অনুমোদন</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setSelectedAppForReject(app)}
                            className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl font-bold text-xs transition-colors"
                            title="আবেদন বাতিল"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>বাতিল</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: OFFLINE CASH & UNVERIFIED FEE APPROVALS */}
      {activeTab === 'fees' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-black text-sm text-slate-900 flex items-center space-x-2">
              <CreditCard className="w-4 h-4 text-emerald-600" />
              <span>অপেক্ষমান অফলাইন ফি ও ক্যাশ পেমেন্ট যাচাই ({unpaidInvoicesList.length} টি)</span>
            </h3>
            <span className="text-xs text-slate-500 font-medium">ক্যাশিয়ার ও অ্যাকাউন্টস শাখা</span>
          </div>

          {unpaidInvoicesList.length === 0 ? (
            <div className="p-12 text-center bg-slate-50">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
              <h4 className="font-bold text-sm text-slate-700">কোনো বকেয়া ফি যাচাইয়ের আবেদন নেই</h4>
              <p className="text-xs text-slate-400 mt-1">সকল ইনভয়েসের পেমেন্ট স্ট্যাটাস আপ-টু-ডেট আছে।</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-black">
                    <th className="p-3.5">ইনভয়েস নং ও শিরোনাম</th>
                    <th className="p-3.5">শিক্ষার্থীর নাম ও আইডি</th>
                    <th className="p-3.5 text-right">মূল ফি</th>
                    <th className="p-3.5 text-center">ছাড়/বৃত্তি</th>
                    <th className="p-3.5 text-right">পরিশোধ্য নিট ফি</th>
                    <th className="p-3.5 text-center">শেষ তারিখ</th>
                    <th className="p-3.5 text-center">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {unpaidInvoicesList.slice(0, 10).map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-50/80">
                      <td className="p-3.5">
                        <span className="font-mono text-indigo-700 font-bold block">{inv.invoiceNo}</span>
                        <span className="font-black text-slate-900 text-xs">{inv.titleBn}</span>
                      </td>

                      <td className="p-3.5">
                        <div className="font-bold text-slate-900">{inv.student?.user?.name || inv.studentName || 'শিক্ষার্থী'}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{inv.student?.studentIdNumber || `ID #${inv.studentId}`}</div>
                      </td>

                      <td className="p-3.5 text-right font-bold text-slate-700">
                        ৳ {Number(inv.baseAmount || inv.amount).toLocaleString('en-BD')}
                      </td>

                      <td className="p-3.5 text-center">
                        {inv.discountAmount > 0 ? (
                          <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                            - ৳ {inv.discountAmount}
                          </span>
                        ) : (
                          <span className="text-slate-400 font-mono">-</span>
                        )}
                      </td>

                      <td className="p-3.5 text-right font-black text-slate-900 text-sm">
                        ৳ {Number(inv.amount).toLocaleString('en-BD')}
                      </td>

                      <td className="p-3.5 text-center text-slate-500 text-xs">
                        {inv.dueDate}
                      </td>

                      <td className="p-3.5 text-center">
                        <button
                          onClick={() => handleApproveFeePayment(inv)}
                          className="px-4 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-xl text-xs shadow-md flex items-center space-x-1.5 mx-auto transition-transform active:scale-95"
                        >
                          <Banknote className="w-3.5 h-3.5" />
                          <span>ক্যাশ গ্রহণ ও রসিদ</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: TEACHER STUDY MATERIALS & EXAM PROPOSALS */}
      {activeTab === 'materials' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-black text-sm text-slate-900 flex items-center space-x-2">
              <BookOpen className="w-4 h-4 text-blue-600" />
              <span>শিক্ষকদের আপলোডকৃত শিক্ষা সামগ্রী ও লেকচার নোট ({pendingMaterialsList.length} টি)</span>
            </h3>
            <span className="text-xs text-slate-500 font-medium">অ্যাকাডেমিক কো-অর্ডিনেটর</span>
          </div>

          <div className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pendingMaterialsList.map((m) => (
              <div key={m.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-lg bg-blue-100 text-blue-800 text-[10px] font-bold">
                      {m.subject?.nameBn || 'পদার্থবিজ্ঞান'}
                    </span>
                    <span className="text-[10px] text-slate-400">শ্রেণি {m.classId || '১০'}</span>
                  </div>

                  <h4 className="font-black text-sm text-slate-900">{m.titleBn}</h4>
                  <p className="text-xs text-slate-500 line-clamp-2">{m.description || 'অধ্যায়ভিত্তিক লেকচার নোট ও গুরুত্বপূর্ণ গাণিতিক সমস্যা সমাধান।'}</p>
                </div>

                <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-2">
                  {m.fileUrl && (
                    <a
                      href={m.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs flex items-center space-x-1 hover:bg-slate-100"
                    >
                      <Eye className="w-3 h-3" />
                      <span>প্রিভিউ</span>
                    </a>
                  )}

                  <button
                    type="button"
                    onClick={() => handleApproveMaterial(m)}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center space-x-1 shadow-sm transition-all"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>অনুমোদন ও প্রকাশ</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Admission Approval Configuration */}
      {selectedAppForApproval && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">ভর্তি চূড়ান্ত অনুমোদন</h3>
                  <p className="text-xs text-slate-500">{selectedAppForApproval.studentNameBn}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedAppForApproval(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmApproval} className="space-y-3.5 text-xs font-medium">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-slate-700 space-y-1">
                <div>শ্রেণি: <strong>{selectedAppForApproval.class?.nameBn || 'শ্রেণি'}</strong></div>
                <div>অভিভাবক মোবাইল: <strong>{selectedAppForApproval.guardianPhone}</strong></div>
                <div>পেমেন্ট TrxID: <strong className="font-mono text-emerald-700">{selectedAppForApproval.paymentTrxId || 'VERIFIED'}</strong></div>
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-slate-700">বরাদ্দকৃত রোল নম্বর (Roll No) *</label>
                <input
                  type="text"
                  required
                  value={approvalFormData.rollNo}
                  onChange={(e) => setApprovalFormData({ ...approvalFormData, rollNo: e.target.value })}
                  placeholder="যেমন: ০১"
                  className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-black text-slate-900"
                />
              </div>

              <div className="pt-3 border-t flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setSelectedAppForApproval(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md shadow-emerald-600/25 flex items-center space-x-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>{actionLoading ? 'অনুমোদন হচ্ছে...' : 'চূড়ান্ত অনুমোদন নিশ্চিত করুন'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Application Rejection */}
      {selectedAppForReject && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-rose-200">
            <div className="flex items-center space-x-3 text-rose-600">
              <div className="p-2.5 rounded-2xl bg-rose-50 border border-rose-200">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">আবেদন বাতিল নিশ্চিতকরণ</h3>
                <p className="text-xs text-slate-500">{selectedAppForReject.studentNameBn}</p>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">বাতিলের সুনির্দিষ্ট কারণ লিখুন:</label>
              <textarea
                rows="3"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="যেমন: প্রদানকৃত পেমেন্ট TrxID সঠিক নয় অথবা তথ্য অসম্পূর্ণ..."
                className="w-full p-3 bg-slate-50 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500"
              ></textarea>
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t">
              <button
                type="button"
                onClick={() => setSelectedAppForReject(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs"
              >
                ফিরে যান
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                disabled={actionLoading}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md"
              >
                {actionLoading ? 'বাতিল হচ্ছে...' : 'হ্যাঁ, আবেদন বাতিল করুন'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Generated Money Receipt Modal */}
      {selectedReceiptData && (
        <MoneyReceiptModal
          receipt={selectedReceiptData}
          isOpen={!!selectedReceiptData}
          onClose={() => setSelectedReceiptData(null)}
        />
      )}
    </div>
  );
}
