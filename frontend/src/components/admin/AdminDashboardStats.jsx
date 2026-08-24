import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import {
  GraduationCap,
  UserCheck,
  UserX,
  TrendingUp,
  AlertCircle,
  RefreshCw,
  Users,
  Sparkles,
  ShieldCheck,
  ArrowUpRight
} from 'lucide-react';

export default function AdminDashboardStats({ onRefreshParent, className = '' }) {
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeStudents: 0,
    inactiveStudents: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStudentMetrics();
  }, []);

  const fetchStudentMetrics = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch dynamic student roster from database to calculate real-time status counts
      const res = await adminAPI.getStudents();
      if (res.success && Array.isArray(res.data)) {
        const studentsList = res.data;
        const total = studentsList.length;

        // Calculate active and inactive counts based on student status
        const active = studentsList.filter((s) => {
          const st = (s.status || '').toLowerCase();
          return st === 'active' || (!st && s.user?.isActive !== false);
        }).length;

        const inactive = studentsList.filter((s) => {
          const st = (s.status || '').toLowerCase();
          return (
            st === 'suspended' ||
            st === 'inactive' ||
            st === 'left' ||
            s.user?.isActive === false
          );
        }).length;

        setStats({
          totalStudents: total,
          activeStudents: active,
          inactiveStudents: inactive
        });
      } else {
        // Fallback to /admin/stats if available
        const statsRes = await adminAPI.getStats();
        if (statsRes.success && statsRes.data) {
          const d = statsRes.data;
          setStats({
            totalStudents: d.totalStudents || 0,
            activeStudents: d.activeStudents !== undefined ? d.activeStudents : d.totalStudents || 0,
            inactiveStudents: d.inactiveStudents || 0
          });
        }
      }
    } catch (err) {
      console.error('Failed to fetch admin dashboard student metrics:', err);
      setError('পরিসংখ্যান লোড করতে সমস্যা হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  // Calculate percentages
  const activePercent =
    stats.totalStudents > 0
      ? Math.round((stats.activeStudents / stats.totalStudents) * 100)
      : 0;

  const inactivePercent =
    stats.totalStudents > 0
      ? Math.round((stats.inactiveStudents / stats.totalStudents) * 100)
      : 0;

  // -------------------------------------------------------------
  // SKELETON LOADING STATE
  // -------------------------------------------------------------
  if (loading) {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 ${className}`}>
        {[1, 2, 3].map((idx) => (
          <div
            key={idx}
            className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm animate-pulse space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-3.5 bg-slate-200 rounded-md w-28"></div>
                <div className="h-2.5 bg-slate-100 rounded-md w-20"></div>
              </div>
              <div className="w-12 h-12 bg-slate-100 rounded-2xl"></div>
            </div>
            <div className="h-9 bg-slate-200 rounded-xl w-24"></div>
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div className="h-3 bg-slate-100 rounded w-16"></div>
              <div className="h-3 bg-slate-100 rounded w-20"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* ========================================================================= */}
        {/* CARD 1: মোট শিক্ষার্থী (Total Students) - Blue/Indigo Theme */}
        {/* ========================================================================= */}
        <div className="relative overflow-hidden bg-gradient-to-br from-white via-indigo-50/30 to-blue-50/50 rounded-3xl p-6 border border-indigo-100 shadow-sm hover:shadow-md transition-all duration-300 group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none"></div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-black tracking-wider text-indigo-900 uppercase">
                মোট শিক্ষার্থী
              </span>
              <p className="text-[11px] font-semibold text-slate-500 mt-0.5">
                Total Enrolled Students
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
          </div>

          <div className="mt-4 flex items-baseline justify-between">
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl sm:text-4xl font-black text-slate-900 font-mono tracking-tight">
                {stats.totalStudents.toLocaleString('en-BD')}
              </span>
              <span className="text-xs font-bold text-indigo-700">জন</span>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-800 text-[10px] font-black tracking-wider uppercase">
              ১০০% মোট
            </span>
          </div>

          <div className="mt-4 pt-3.5 border-t border-indigo-100/80 flex items-center justify-between text-xs">
            <span className="text-[11px] font-bold text-slate-600 flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
              <span>সকল শ্রেণি ও ব্যাচ</span>
            </span>
            <span className="text-[11px] font-extrabold text-indigo-600 flex items-center space-x-0.5">
              <span>অ্যাকাডেমিক ২০২৬</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* CARD 2: সক্রিয় শিক্ষার্থী (Active Students) - Emerald/Green Theme */}
        {/* ========================================================================= */}
        <div className="relative overflow-hidden bg-gradient-to-br from-white via-emerald-50/30 to-teal-50/50 rounded-3xl p-6 border border-emerald-100 shadow-sm hover:shadow-md transition-all duration-300 group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none"></div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-black tracking-wider text-emerald-900 uppercase">
                সক্রিয় শিক্ষার্থী
              </span>
              <p className="text-[11px] font-semibold text-slate-500 mt-0.5">
                Active & Attending
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-600/30 group-hover:scale-105 transition-transform">
              <UserCheck className="w-6 h-6" />
            </div>
          </div>

          <div className="mt-4 flex items-baseline justify-between">
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl sm:text-4xl font-black text-slate-900 font-mono tracking-tight text-emerald-950">
                {stats.activeStudents.toLocaleString('en-BD')}
              </span>
              <span className="text-xs font-bold text-emerald-700">জন</span>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black tracking-wider font-mono">
              {activePercent}% সক্রিয়
            </span>
          </div>

          <div className="mt-4 pt-3.5 border-t border-emerald-100/80 flex items-center justify-between text-xs">
            <span className="text-[11px] font-bold text-slate-600 flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>নিয়মিত পাঠদান ও পরীক্ষা</span>
            </span>
            <span className="text-[11px] font-extrabold text-emerald-700 flex items-center space-x-0.5">
              <span>অনলাইন পোর্টাল সক্ষম</span>
            </span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* CARD 3: স্থগিত / নিষ্ক্রিয় (Inactive) - Rose/Red Theme */}
        {/* ========================================================================= */}
        <div className="relative overflow-hidden bg-gradient-to-br from-white via-rose-50/30 to-red-50/50 rounded-3xl p-6 border border-rose-100 shadow-sm hover:shadow-md transition-all duration-300 group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none"></div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-black tracking-wider text-rose-900 uppercase">
                স্থগিত / নিষ্ক্রিয়
              </span>
              <p className="text-[11px] font-semibold text-slate-500 mt-0.5">
                Suspended / Inactive / Left
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center shadow-lg shadow-rose-600/30 group-hover:scale-105 transition-transform">
              <UserX className="w-6 h-6" />
            </div>
          </div>

          <div className="mt-4 flex items-baseline justify-between">
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl sm:text-4xl font-black text-slate-900 font-mono tracking-tight text-rose-950">
                {stats.inactiveStudents.toLocaleString('en-BD')}
              </span>
              <span className="text-xs font-bold text-rose-700">জন</span>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 text-[10px] font-black tracking-wider font-mono">
              {inactivePercent}% নিষ্ক্রিয়
            </span>
          </div>

          <div className="mt-4 pt-3.5 border-t border-rose-100/80 flex items-center justify-between text-xs">
            <span className="text-[11px] font-bold text-slate-600 flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              <span>স্থগিত বা ছাড়পত্রপ্রাপ্ত</span>
            </span>
            <button
              type="button"
              onClick={fetchStudentMetrics}
              className="text-[11px] font-extrabold text-rose-700 hover:text-rose-800 flex items-center space-x-1 transition-colors"
              title="পুনরায় রিফ্রেশ করুন"
            >
              <RefreshCw className="w-3 h-3" />
              <span>রিফ্রেশ</span>
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-rose-600" />
            <span>{error}</span>
          </div>
          <button
            onClick={fetchStudentMetrics}
            className="font-bold underline hover:text-rose-900"
          >
            আবার চেষ্টা করুন
          </button>
        </div>
      )}
    </div>
  );
}
