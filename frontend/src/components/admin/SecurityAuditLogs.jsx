import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';
import {
  ShieldCheck,
  Search,
  Filter,
  Eye,
  Calendar,
  User,
  Shield,
  Activity,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
  FileCode,
  X,
  Lock,
  Smartphone,
  Globe,
  Sliders,
  Laptop
} from 'lucide-react';

export default function SecurityAuditLogs() {
  const { lang, t } = useLanguage();

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState('');
  const [selectedAction, setSelectedAction] = useState('ALL');
  const [inspectedLog, setInspectedLog] = useState(null);

  useEffect(() => {
    fetchLogs();
  }, [selectedAction]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const params = { limit: 100 };
      if (selectedAction !== 'ALL') {
        params.action = selectedAction;
      }
      if (search.trim()) {
        params.search = search.trim();
      }

      const res = await adminAPI.getAuditLogs(params);
      if (res.success && res.data) {
        setLogs(res.data.logs || []);
        setTotalCount(res.data.total || 0);
      }
    } catch (err) {
      console.error('Error fetching audit logs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchLogs();
  };

  // Metrics
  const loginAttempts = logs.filter((l) => l.action?.includes('LOGIN')).length;
  const failedAttempts = logs.filter((l) => l.status === 'FAILED' || l.action?.includes('FAIL')).length;
  const securityEvents = logs.filter((l) => l.action?.includes('2FA') || l.action?.includes('SETTINGS') || l.action?.includes('ADMIN')).length;

  const getActionBadge = (action = '', status = 'SUCCESS') => {
    const act = action.toUpperCase();
    if (status === 'FAILED' || act.includes('FAIL')) {
      return {
        label: 'ব্যর্থ চেষ্টা (Failed)',
        color: 'bg-rose-100 text-rose-800 border-rose-200',
        icon: XCircle
      };
    }
    if (act.includes('LOGIN')) {
      return {
        label: 'লগইন (Login)',
        color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        icon: CheckCircle2
      };
    }
    if (act.includes('2FA')) {
      return {
        label: '২এফএ সিকিউরিটি (2FA)',
        color: 'bg-indigo-100 text-indigo-800 border-indigo-200',
        icon: Smartphone
      };
    }
    if (act.includes('CREATE') || act.includes('ADD') || act.includes('PUBLISH')) {
      return {
        label: 'তৈরি / সংযোজন (Create)',
        color: 'bg-teal-100 text-teal-800 border-teal-200',
        icon: Activity
      };
    }
    if (act.includes('UPDATE') || act.includes('EDIT')) {
      return {
        label: 'আপডেট / সংশোধন (Update)',
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: Sliders
      };
    }
    if (act.includes('DELETE') || act.includes('REMOVE')) {
      return {
        label: 'মুছে ফেলা (Delete)',
        color: 'bg-amber-100 text-amber-800 border-amber-200',
        icon: AlertTriangle
      };
    }
    return {
      label: action,
      color: 'bg-slate-100 text-slate-800 border-slate-200',
      icon: Activity
    };
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-3.5 py-1 rounded-full text-xs font-semibold backdrop-blur-md mb-3">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
              <span>এন্টারপ্রাইজ সিকিউরিটি ও অডিট ট্রেইল</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              অডিট ও সিকিউরিটি লগ (Security & Audit Logs)
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1.5 max-w-2xl leading-relaxed">
              সিস্টেমে সংঘটিত সকল অ্যাডমিন অ্যাকশন, প্রমাণীকরণ লগইন, আইপি অ্যাড্রেস এবং অপরিবর্তনীয় নিরাপত্তা রেকর্ড পর্যবেক্ষণ করুন।
            </p>
          </div>

          <button
            onClick={fetchLogs}
            disabled={loading}
            className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/10 flex items-center space-x-2 transition-all active:scale-95 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>লগ রিফ্রেশ করুন</span>
          </button>
        </div>
      </div>

      {/* 4 Security Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm flex items-center space-x-3.5">
          <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-700">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 block uppercase">সর্বমোট লগ রেকর্ড</span>
            <span className="text-xl font-black text-slate-900 font-mono">{totalCount} টি</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm flex items-center space-x-3.5">
          <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-700">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 block uppercase">সফল প্রমাণীকরণ লগইন</span>
            <span className="text-xl font-black text-emerald-950 font-mono">{loginAttempts} টি</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm flex items-center space-x-3.5">
          <div className="p-3 rounded-2xl bg-rose-50 text-rose-700">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 block uppercase">ব্যর্থ চেষ্টা ও সিকিউরিটি অ্যালার্ট</span>
            <span className="text-xl font-black text-rose-950 font-mono">{failedAttempts} টি</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm flex items-center space-x-3.5">
          <div className="p-3 rounded-2xl bg-amber-50 text-amber-700">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 block uppercase">অ্যাক্টিভ সিকিউরিটি প্রটোকল</span>
            <span className="text-xs font-black text-amber-950 block">Rate Limit • 2FA • 15m TTL</span>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="আইপি, ইমেইল, বা বিবরণ দিয়ে খুঁজুন..."
            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </form>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <div className="inline-flex bg-slate-100 p-1 rounded-2xl gap-1 overflow-x-auto w-full sm:w-auto">
            {['ALL', 'LOGIN', '2FA', 'STUDENT', 'TEACHER', 'INVOICE', 'SETTINGS'].map((actKey) => (
              <button
                key={actKey}
                type="button"
                onClick={() => setSelectedAction(actKey)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  selectedAction === actKey
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {actKey === 'ALL'
                  ? 'সব অ্যাকশন'
                  : actKey === 'LOGIN'
                  ? 'লগইন'
                  : actKey === '2FA'
                  ? '২এফএ (2FA)'
                  : actKey === 'STUDENT'
                  ? 'শিক্ষার্থী'
                  : actKey === 'TEACHER'
                  ? 'শিক্ষক'
                  : actKey === 'INVOICE'
                  ? 'ফি ও পেমেন্ট'
                  : 'সেটিংস'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="p-4">অ্যাকশন ও ক্যাটাগরি</th>
                <th className="p-4">অ্যাডমিন / ব্যবহারকারী</th>
                <th className="p-4">কার্যক্রমের বিবরণ</th>
                <th className="p-4">আইপি অ্যাড্রেস ও ডিভাইস</th>
                <th className="p-4">সময় ও তারিখ</th>
                <th className="p-4 text-center">বিশ্লেষণ</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 font-medium">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-slate-400">
                    <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    <span>অডিট লগ লোড হচ্ছে...</span>
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-slate-400">
                    <Shield className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                    <span>কোনো অডিট রেকর্ড পাওয়া যায়নি</span>
                  </td>
                </tr>
              ) : (
                logs.map((log) => {
                  const badge = getActionBadge(log.action, log.status);
                  const BadgeIcon = badge.icon;

                  return (
                    <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Action Badge */}
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-xl text-[11px] font-extrabold border ${badge.color}`}
                        >
                          <BadgeIcon className="w-3.5 h-3.5 shrink-0" />
                          <span>{badge.label}</span>
                        </span>
                        <span className="block text-[10px] text-slate-400 font-mono mt-1">
                          {log.action}
                        </span>
                      </td>

                      {/* User Info */}
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs">
                            {log.adminName ? log.adminName.charAt(0) : log.user?.name ? log.user.name.charAt(0) : 'A'}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{log.adminName || log.user?.name || 'অ্যাডমিন ইউজার'}</p>
                            <span className="text-[10px] text-slate-400 font-mono block">
                              {log.adminEmail || log.user?.email || 'system@nextgen.edu.bd'}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Details */}
                      <td className="p-4">
                        <p className="text-slate-700 line-clamp-2 max-w-sm">{log.details || '-'}</p>
                        {log.targetResource && (
                          <span className="inline-block mt-1 px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-mono">
                            Resource: {log.targetResource}
                          </span>
                        )}
                      </td>

                      {/* IP & User Agent */}
                      <td className="p-4 font-mono text-[11px] text-slate-600">
                        <div className="flex items-center space-x-1 font-bold text-slate-800">
                          <Globe className="w-3 h-3 text-indigo-500" />
                          <span>{log.ipAddress || '127.0.0.1'}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 truncate max-w-[150px] block mt-0.5">
                          {log.userAgent || 'Web Client'}
                        </span>
                      </td>

                      {/* Timestamp */}
                      <td className="p-4 text-slate-500 text-[11px] whitespace-nowrap">
                        <div className="flex items-center space-x-1 text-slate-700 font-semibold">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>{new Date(log.createdAt || log.timestamp).toLocaleTimeString('bn-BD')}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 block">
                          {new Date(log.createdAt || log.timestamp).toLocaleDateString('bn-BD')}
                        </span>
                      </td>

                      {/* Inspect Button */}
                      <td className="p-4 text-center">
                        <button
                          onClick={() => setInspectedLog(log)}
                          className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors inline-flex items-center space-x-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>বিশ্লেষণ</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================== */}
      {/* PAYLOAD INSPECTION MODAL */}
      {/* ========================================================== */}
      {inspectedLog && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-4 border border-slate-200 my-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                  <FileCode className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-base text-slate-900">
                    অডিট লগ বিস্তারিত ও পে-লোড (Audit Payload)
                  </h3>
                  <p className="text-xs text-slate-500 font-mono">ID: #{inspectedLog.id} • {inspectedLog.action}</p>
                </div>
              </div>

              <button
                onClick={() => setInspectedLog(null)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <div>
                  <span className="text-slate-400 block font-bold">অ্যাকশন:</span>
                  <span className="font-bold text-indigo-900">{inspectedLog.action}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-bold">আইপি অ্যাড্রেস:</span>
                  <span className="font-mono text-slate-800">{inspectedLog.ipAddress || '127.0.0.1'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-bold">অ্যাডমিন ইমেইল:</span>
                  <span className="font-mono text-slate-800">{inspectedLog.adminEmail || inspectedLog.user?.email}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-bold">স্ট্যাটাস:</span>
                  <span className="font-bold text-emerald-600">{inspectedLog.status || 'SUCCESS'}</span>
                </div>
              </div>

              <div>
                <span className="font-bold text-slate-700 block mb-1">বিবরণ:</span>
                <p className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-800 leading-relaxed">
                  {inspectedLog.details || 'কোনো বিবরণ লিপিবদ্ধ নেই'}
                </p>
              </div>

              {inspectedLog.newValue && (
                <div>
                  <span className="font-bold text-slate-700 block mb-1">নতুন মান / পে-লোড (New Value):</span>
                  <pre className="p-3 bg-slate-900 text-emerald-400 rounded-xl text-[11px] font-mono overflow-x-auto max-h-48">
                    {JSON.stringify(inspectedLog.newValue, null, 2)}
                  </pre>
                </div>
              )}

              {inspectedLog.oldValue && (
                <div>
                  <span className="font-bold text-slate-700 block mb-1">পূর্বের মান (Old Value):</span>
                  <pre className="p-3 bg-slate-900 text-rose-400 rounded-xl text-[11px] font-mono overflow-x-auto max-h-48">
                    {JSON.stringify(inspectedLog.oldValue, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setInspectedLog(null)}
                className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-all"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
