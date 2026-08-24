import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { admissionAPI, batchAPI } from '../../services/api';
import {
  GraduationCap,
  Users,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Clock,
  Printer,
  Eye,
  Check,
  X,
  Sparkles,
  DollarSign,
  UserCheck,
  Building,
  Phone,
  Mail,
  MapPin,
  Calendar,
  FileText,
  CreditCard,
  Layers,
  ArrowRight
} from 'lucide-react';

export default function AdmissionManager() {
  const { t, lang } = useLanguage();
  const { user } = useAuth();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [classFilter, setClassFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [stats, setStats] = useState(null);

  // Batches for selection during approval
  const [batches, setBatches] = useState([]);

  // Selected Application for Review Modal
  const [selectedApp, setSelectedApp] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);

  // Approval Modal State
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [approveTargetApp, setApproveTargetApp] = useState(null);
  const [approveForm, setApproveForm] = useState({
    targetBatchId: '',
    admissionFee: 3500,
    paymentMethod: 'CASH',
    transactionId: ''
  });

  // Rejection Modal State
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectTargetApp, setRejectTargetApp] = useState(null);
  const [rejectReason, setRejectReason] = useState('আসন সংখ্যা পূর্ণ হওয়ায় আবেদনটি এই মুহূর্তে গ্রহণ করা সম্ভব হয়নি।');

  // Admission Receipt Modal State
  const [receiptData, setReceiptData] = useState(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  // Feedback Notification
  const [feedback, setFeedback] = useState(null);

  const classesList = [
    'Play', 'Nursery', 'KG',
    'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5',
    'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'SSC Candidate',
    'Class 11', 'Class 12', 'HSC Candidate'
  ];

  useEffect(() => {
    fetchApplications();
    fetchStats();
    fetchBatches();
  }, [statusFilter, classFilter]);

  const showToast = (msg, type = 'success') => {
    setFeedback({ msg, type });
    setTimeout(() => setFeedback(null), 4000);
  };

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await admissionAPI.getApplications({
        status: statusFilter,
        className: classFilter,
        search
      });
      if (res.success && res.data) {
        setApplications(res.data.applications || []);
      }
    } catch (err) {
      console.error('Fetch admissions error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await admissionAPI.getStats();
      if (res.success && res.data) {
        setStats(res.data);
      }
    } catch (err) {
      console.error('Fetch stats error:', err);
    }
  };

  const fetchBatches = async () => {
    try {
      const res = await batchAPI.getBatches();
      if (res.success && res.data) {
        setBatches(res.data);
      }
    } catch (err) {
      console.error('Fetch batches error:', err);
    }
  };

  const handleApprove = async (e) => {
    e.preventDefault();
    if (!approveTargetApp) return;
    try {
      const res = await admissionAPI.approve(approveTargetApp.id, approveForm);
      showToast(res.message || 'ভর্তি সফলভাবে অনুমোদিত হয়েছে!');
      setShowApproveModal(false);
      if (res.data) {
        setReceiptData({
          ...res.data,
          applicant: approveTargetApp,
          institute: {
            nameBn: 'নেক্সটজেন একাডেমি',
            nameEn: 'NextGen ACADEMY',
            tagline: 'LEARN · GROW · SUCCEED',
            address: 'বাড়ি নং-১২, রোড নং-০৫, ধানমন্ডি, ঢাকা-১২০৯',
            phone: '+880 1800-NEXTGEN'
          }
        });
        setShowReceiptModal(true);
      }
      fetchApplications();
      fetchStats();
    } catch (err) {
      alert(err.message || 'অনুমোদনে সমস্যা হয়েছে');
    }
  };

  const handleReject = async (e) => {
    e.preventDefault();
    if (!rejectTargetApp) return;
    try {
      const res = await admissionAPI.reject(rejectTargetApp.id, { reason: rejectReason });
      showToast(res.message || 'আবেদনটি বাতিল করা হয়েছে!');
      setShowRejectModal(false);
      fetchApplications();
      fetchStats();
    } catch (err) {
      alert(err.message || 'বাতিল করতে সমস্যা হয়েছে');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-slate-700/60 print:hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 -bottom-10 w-60 h-60 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>{lang === 'bn' ? 'অনলাইন অ্যাডমিশন ও স্টুডেন্ট ইনটেক' : 'Online Admission & Intake Hub'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white">
              {t('onlineAdmissionTitle')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl font-medium">
              {t('onlineAdmissionSubtitle')}
            </p>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 print:hidden">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase">মোট জমা আবেদন</span>
              <div className="p-2.5 rounded-2xl bg-indigo-50 text-indigo-600">
                <FileText className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-black text-slate-900 mt-2 font-mono">{stats.totalCount}</p>
            <span className="text-[11px] text-indigo-700 font-bold mt-1 inline-block">সকল শ্রেণির মোট শিক্ষার্থী</span>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase">অপেক্ষমাণ আবেদন</span>
              <div className="p-2.5 rounded-2xl bg-amber-50 text-amber-600">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-black text-amber-600 mt-2 font-mono">{stats.pendingCount}</p>
            <span className="text-[11px] text-amber-700 font-bold mt-1 inline-block">যাচাই-বাছাই ও অনুমোদন বাকি</span>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase">অনুমোদিত শিক্ষার্থী</span>
              <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-600">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-black text-emerald-700 mt-2 font-mono">{stats.approvedCount}</p>
            <span className="text-[11px] text-emerald-700 font-bold mt-1 inline-block">আইডি ও রোল নম্বর বরাদ্দকৃত</span>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase">বাতিল আবেদন</span>
              <div className="p-2.5 rounded-2xl bg-rose-50 text-rose-600">
                <AlertCircle className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-black text-rose-600 mt-2 font-mono">{stats.rejectedCount}</p>
            <span className="text-[11px] text-rose-700 font-bold mt-1 inline-block">আসন পূর্ণ / অযোগ্য</span>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {feedback && (
        <div className={`p-4 rounded-2xl border text-xs font-bold flex items-center space-x-2.5 animate-in fade-in print:hidden ${
          feedback.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'
        }`}>
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{feedback.msg}</span>
        </div>
      )}

      {/* Applications Table Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden space-y-4 print:hidden">
        {/* Table Header */}
        <div className="p-5 bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <h3 className="font-extrabold text-base flex items-center space-x-2">
              <Users className="w-4 h-4 text-emerald-400" />
              <span>ভর্তি আবেদন তালিকা ও অনুমোদন ড্যাশবোর্ড (Application Log)</span>
            </h3>
            <p className="text-xs text-slate-300">
              অনলাইন পোর্টাল থেকে জমা পড়া শিক্ষার্থীদের তথ্যাদি পর্যালোচনা ও এক ক্লিকে রোল অ্যাসাইনমেন্ট
            </p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1">আবেদনের স্ট্যাটাস</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-bold text-slate-800"
            >
              <option value="ALL">-- সকল স্ট্যাটাস --</option>
              <option value="PENDING">⏳ অপেক্ষমাণ (PENDING)</option>
              <option value="APPROVED">✓ অনুমোদিত (APPROVED)</option>
              <option value="REJECTED">✕ বাতিল (REJECTED)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1">শ্রেণি ফিল্টার</label>
            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-bold text-slate-800"
            >
              <option value="ALL">-- সকল শ্রেণি --</option>
              {classesList.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1">সার্চ (ট্র্যাকিং আইডি / নাম / ফোন)</label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="নাম বা ট্র্যাকিং কোড..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchApplications()}
                className="w-full pl-9 p-2 rounded-xl border border-slate-200 bg-white font-medium text-slate-800"
              />
            </div>
          </div>
        </div>

        {/* Table Content */}
        {loading ? (
          <div className="p-12 text-center text-slate-500">
            <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs font-bold">আবেদন তালিকা লোড হচ্ছে...</p>
          </div>
        ) : (
          <div className="overflow-x-auto p-4">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <th className="py-3 px-3 w-32">ট্র্যাকিং কোড</th>
                  <th className="py-3 px-4 min-w-[180px]">শিক্ষার্থীর নাম ও ছবি</th>
                  <th className="py-3 px-3">শ্রেণি ও ব্যাচ</th>
                  <th className="py-3 px-3">পূর্ববর্তী GPA</th>
                  <th className="py-3 px-3">অভিভাবকের মোবাইল</th>
                  <th className="py-3 px-3 text-center">স্ট্যাটাস</th>
                  <th className="py-3 px-3 text-center">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {applications.map((app) => {
                  const isPending = app.status === 'PENDING';
                  const isApproved = app.status === 'APPROVED';
                  const isRejected = app.status === 'REJECTED';

                  return (
                    <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3 font-mono font-bold text-slate-800">{app.trackingId}</td>
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={app.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'}
                            alt={app.studentNameEn}
                            className="w-9 h-9 rounded-full object-cover border border-slate-200 flex-shrink-0"
                          />
                          <div>
                            <div className="font-bold text-slate-900">{app.studentNameBn}</div>
                            <div className="text-[10px] text-slate-500 font-sans">{app.studentNameEn}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="font-bold text-indigo-950">{app.className}</div>
                        <div className="text-[10px] text-slate-500">{app.batchName || 'সাধারণ ব্যাচ'}</div>
                      </td>
                      <td className="p-3 font-mono font-bold text-amber-700">{app.previousGpa || 'N/A'}</td>
                      <td className="p-3 font-mono text-slate-700">{app.guardianPhone}</td>
                      <td className="p-3 text-center">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black ${
                          isApproved
                            ? 'bg-emerald-100 text-emerald-800'
                            : isRejected
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {isApproved ? '✓ অনুমোদিত' : isRejected ? '✕ বাতিল' : '⏳ অপেক্ষমাণ'}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center space-x-1.5">
                          <button
                            onClick={() => {
                              setSelectedApp(app);
                              setShowReviewModal(true);
                            }}
                            className="p-1.5 rounded-lg text-indigo-600 hover:bg-indigo-50"
                            title="বিস্তারিত প্রোফাইল দেখুন"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {isPending && (
                            <>
                              <button
                                onClick={() => {
                                  setApproveTargetApp(app);
                                  setApproveForm({
                                    targetBatchId: app.batchId || (batches[0]?.id || 1),
                                    admissionFee: 3500,
                                    paymentMethod: 'CASH',
                                    transactionId: ''
                                  });
                                  setShowApproveModal(true);
                                }}
                                className="px-2.5 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] shadow-sm flex items-center space-x-1"
                              >
                                <Check className="w-3 h-3" />
                                <span>অনুমোদন</span>
                              </button>

                              <button
                                onClick={() => {
                                  setRejectTargetApp(app);
                                  setShowRejectModal(true);
                                }}
                                className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50"
                                title="বাতিল করুন"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL 1: APPLICANT REVIEW MODAL */}
      {showReviewModal && selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-5 text-xs text-slate-800 my-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-black text-base text-slate-900 flex items-center space-x-2">
                <GraduationCap className="w-5 h-5 text-indigo-600" />
                <span>আবেদনকারীর বিস্তারিত প্রোফাইল (Application Review)</span>
              </h3>
              <button onClick={() => setShowReviewModal(false)} className="p-1 rounded-lg text-slate-400 hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center space-x-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <img
                src={selectedApp.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'}
                alt={selectedApp.studentNameEn}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-500 flex-shrink-0"
              />
              <div>
                <h4 className="text-base font-black text-slate-900">{selectedApp.studentNameBn}</h4>
                <p className="text-xs font-bold text-indigo-900 font-sans">{selectedApp.studentNameEn}</p>
                <div className="flex items-center space-x-3 text-[11px] text-slate-500 mt-1">
                  <span>শ্রেণি: <strong className="text-slate-800">{selectedApp.className}</strong></span>
                  <span>রক্তের গ্রুপ: <strong className="text-rose-600 font-mono">{selectedApp.bloodGroup}</strong></span>
                  <span>লিঙ্গ: <strong className="text-slate-800">{selectedApp.gender}</strong></span>
                </div>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-3 bg-slate-50/60 p-4 rounded-2xl border border-slate-200 font-semibold">
              <div>
                <span className="text-[10px] text-slate-400 uppercase block">কাঙ্ক্ষিত ব্যাচ</span>
                <span className="font-bold text-emerald-700">{selectedApp.batchName || 'সকাল ব্যাচ'}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase block">ধর্ম (Religion)</span>
                <span className="font-bold text-slate-900">{selectedApp.religion || 'ISLAM'}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase block">পূর্ববর্তী বিদ্যালয়</span>
                <span className="font-bold text-slate-900">{selectedApp.previousSchool || 'N/A'}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase block">পূর্ববর্তী পরীক্ষার জিপিএ</span>
                <span className="font-mono font-black text-amber-700 text-sm">{selectedApp.previousGpa || 'N/A'}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase block">অভিভাবকের নাম</span>
                <span className="font-bold text-slate-900">{selectedApp.guardianName}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase block">অভিভাবকের মোবাইল</span>
                <span className="font-mono font-bold text-slate-900">{selectedApp.guardianPhone}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase block">পেমেন্ট মেথড ও TrxID</span>
                <span className="font-mono font-bold text-indigo-700">{selectedApp.paymentMethod || 'bKash'} • {selectedApp.paymentTrxId || 'অপেক্ষমাণ'}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase block">আবেদন ফি স্ট্যাটাস</span>
                <span className="font-bold text-emerald-700">৳{selectedApp.applicationFee || 500} ({selectedApp.paymentStatus || 'VERIFIED'})</span>
              </div>
              <div className="col-span-2">
                <span className="text-[10px] text-slate-400 uppercase block">বর্তমান ও স্থায়ী ঠিকানা</span>
                <span className="text-slate-800">{selectedApp.address}</span>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowReviewModal(false)}
                className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: APPROVE ADMISSION MODAL */}
      {showApproveModal && approveTargetApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-black text-base text-slate-900 flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>ভর্তি অনুমোদন ও অটো রোল নির্ধারণ</span>
              </h3>
              <button onClick={() => setShowApproveModal(false)} className="p-1 rounded-lg text-slate-400 hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold">শিক্ষার্থীর নাম</span>
              <p className="font-black text-slate-900 text-sm">{approveTargetApp.studentNameBn} ({approveTargetApp.className})</p>
            </div>

            <form onSubmit={handleApprove} className="space-y-3.5">
              <div>
                <label className="block font-bold text-slate-900 mb-1">বরাদ্দকৃত ব্যাচ নির্বাচন করুন *</label>
                <select
                  value={approveForm.targetBatchId}
                  onChange={(e) => setApproveForm({ ...approveForm, targetBatchId: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-bold bg-slate-50 focus:ring-2 focus:ring-emerald-500"
                >
                  {batches.map((b) => (
                    <option key={b.id} value={b.id}>{b.name} ({b.className})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-900 mb-1">ভর্তি ফি (টাকা) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={approveForm.admissionFee}
                    onChange={(e) => setApproveForm({ ...approveForm, admissionFee: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-bold text-emerald-700 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-900 mb-1">পেমেন্ট মেথড</label>
                  <select
                    value={approveForm.paymentMethod}
                    onChange={(e) => setApproveForm({ ...approveForm, paymentMethod: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-bold bg-slate-50 focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="CASH">ক্যাশ (নগদ)</option>
                    <option value="BKASH">বিকাশ</option>
                    <option value="NAGAD">নগদ</option>
                    <option value="BANK_TRANSFER">ব্যাংক ট্রান্সফার</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-900 mb-1">ট্রানজেকশন আইডি / মেমো নং</label>
                <input
                  type="text"
                  placeholder="যেমন: BK889102 বা CSM-9901"
                  value={approveForm.transactionId}
                  onChange={(e) => setApproveForm({ ...approveForm, transactionId: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-medium focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="pt-3 flex items-center justify-end space-x-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowApproveModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md shadow-emerald-600/30 flex items-center space-x-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>অনুমোদন ও আইডি তৈরি</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: REJECT ADMISSION MODAL */}
      {showRejectModal && rejectTargetApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-black text-base text-slate-900 flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-rose-600" />
                <span>আবেদন বাতিলকরণ (Reject Application)</span>
              </h3>
              <button onClick={() => setShowRejectModal(false)} className="p-1 rounded-lg text-slate-400 hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-slate-600 font-medium">
              <strong className="text-slate-900">{rejectTargetApp.studentNameBn}</strong>-এর আবেদন বাতিল করার কারণ উল্লেখ করুন:
            </p>

            <form onSubmit={handleReject} className="space-y-3.5">
              <textarea
                rows="3"
                required
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 font-medium text-slate-800 focus:ring-2 focus:ring-rose-500"
              />

              <div className="pt-3 flex items-center justify-end space-x-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowRejectModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  ফিরে যান
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-md shadow-rose-600/30"
                >
                  বাতিল নিশ্চিত করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: ADMISSION FEE MONEY RECEIPT */}
      {showReceiptModal && receiptData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 text-slate-800 my-auto print:border-none print:shadow-none print:p-0">
            {/* Modal Controls */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 print:hidden">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-emerald-600" />
                <span className="font-black text-sm text-slate-900">ভর্তি মানি রিসিট (Admission Receipt)</span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handlePrint}
                  className="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-md flex items-center space-x-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>রসিদ প্রিন্ট</span>
                </button>
                <button onClick={() => setShowReceiptModal(false)} className="p-1 rounded-lg text-slate-400 hover:bg-slate-100">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Letterhead */}
            <div className="flex items-center space-x-4 pb-4 border-b-2 border-slate-900">
              <img src="/logo.png" alt="NextGen Logo" className="w-16 h-16 object-contain" />
              <div>
                <h2 className="text-lg font-black text-slate-900">নেক্সটজেন একাডেমি</h2>
                <h3 className="text-xs font-black text-indigo-950 tracking-widest uppercase">NextGen ACADEMY</h3>
                <p className="text-[10px] font-bold text-amber-700 tracking-wider">LEARN · GROW · SUCCEED</p>
                <p className="text-[9px] text-slate-500 mt-0.5">ধানমন্ডি ক্যাম্পাস, ঢাকা • হেল্পলাইন: +880 1800-NEXTGEN</p>
              </div>
            </div>

            {/* Receipt Body */}
            <div className="space-y-4 text-xs">
              <div className="bg-emerald-50/80 p-4 rounded-2xl border border-emerald-200 flex justify-between items-center">
                <div>
                  <span className="text-[10px] text-emerald-800 font-bold uppercase block">মানি রিসিট নম্বর</span>
                  <span className="font-mono font-black text-emerald-950 text-base">{receiptData.invoiceNo}</span>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-600 text-white font-black text-xs">
                  ✓ PAID (পরিশোধিত)
                </span>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 grid grid-cols-2 gap-3 font-semibold">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">শিক্ষার্থীর নাম</span>
                  <span className="font-black text-slate-900">{receiptData.applicant?.studentNameBn}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">বরাদ্দকৃত স্টুডেন্ট আইডি</span>
                  <span className="font-mono font-black text-indigo-900">{receiptData.studentIdNumber}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">শ্রেণি ও ব্যাচ</span>
                  <span className="font-bold text-slate-900">{receiptData.applicant?.className}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">বরাদ্দকৃত ক্লাস রোল</span>
                  <span className="font-black text-slate-900 text-sm">{receiptData.rollNo}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">আদায়কৃত ভর্তি ফি</span>
                  <span className="font-mono font-black text-emerald-800 text-base">৳{receiptData.feeAmount?.toLocaleString('en-IN')}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">তারিখ</span>
                  <span className="font-mono font-bold text-slate-800">{new Date().toISOString().split('T')[0]}</span>
                </div>
              </div>

              {/* Signatures */}
              <div className="grid grid-cols-3 gap-6 pt-10 text-center text-xs font-bold text-slate-800">
                <div className="border-t-2 border-slate-400 pt-2">হিসাবরক্ষক কর্মকর্তা</div>
                <div className="border-t-2 border-slate-400 pt-2">ভর্তি কমিটির প্রধান</div>
                <div className="border-t-2 border-slate-400 pt-2">অধ্যক্ষ / প্রিন্সিপাল</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
