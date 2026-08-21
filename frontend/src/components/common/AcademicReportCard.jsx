import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { resultsAPI } from '../../services/api';
import {
  Award,
  Printer,
  Download,
  Calendar,
  Sparkles,
  Percent,
  CheckCircle2,
  Users,
  GraduationCap
} from 'lucide-react';

export default function AcademicReportCard({ studentId, defaultTermId = 1, showTermPicker = true }) {
  const { t, lang } = useLanguage();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [terms, setTerms] = useState([]);
  const [selectedTermId, setSelectedTermId] = useState(defaultTermId);

  useEffect(() => {
    loadTerms();
  }, []);

  useEffect(() => {
    if (studentId) {
      fetchReport(studentId, selectedTermId);
    }
  }, [studentId, selectedTermId]);

  const loadTerms = async () => {
    try {
      const res = await resultsAPI.getTerms();
      if (res.success) setTerms(res.data || []);
    } catch (err) {
      console.error('Failed to load terms:', err);
    }
  };

  const fetchReport = async (sId, termId) => {
    setLoading(true);
    setError(null);
    try {
      const res = await resultsAPI.getReportCard(sId, { examTermId: termId });
      if (res.success && res.data) {
        setData(res.data);
      } else {
        setError(res.error?.message || 'রিপোর্ট কার্ড পাওয়া যায়নি');
      }
    } catch (err) {
      setError(err.message || 'রিপোর্ট কার্ড লোড করতে ব্যর্থ হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const getGradeBadgeColor = (grade) => {
    switch (grade) {
      case 'A+': return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'A': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'A-': return 'bg-cyan-100 text-cyan-800 border-cyan-300';
      case 'B': return 'bg-indigo-100 text-indigo-800 border-indigo-300';
      case 'C': return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'D': return 'bg-orange-100 text-orange-800 border-orange-300';
      default: return 'bg-rose-100 text-rose-800 border-rose-300';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-500 shadow-sm">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs font-bold">অ্যাকাডেমিক রিপোর্ট কার্ড লোড হচ্ছে...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-rose-50 rounded-2xl border border-rose-200 p-8 text-center text-rose-700">
        <Award className="w-10 h-10 mx-auto text-rose-400 mb-2" />
        <p className="font-bold text-sm">{error || 'রিপোর্ট কার্ড ডেটা পাওয়া যায়নি'}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Control Bar (Hidden on print) */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm print:hidden">
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <div className="p-2 rounded-xl bg-indigo-50 text-indigo-700">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-slate-900">৩৬০° অ্যাকাডেমিক রিপোর্ট কার্ড</h3>
            <p className="text-[11px] text-slate-500">{data.student.name} • {data.student.class}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
          {showTermPicker && terms.length > 0 && (
            <select
              value={selectedTermId}
              onChange={(e) => setSelectedTermId(Number(e.target.value))}
              className="px-3 py-2 text-xs font-bold rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:ring-2 focus:ring-indigo-500"
            >
              {terms.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.titleBn}
                </option>
              ))}
            </select>
          )}

          <button
            onClick={handlePrint}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/30 flex items-center space-x-1.5 transition-all"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{t('printReportCard')}</span>
          </button>
        </div>
      </div>

      {/* Official 360° Academic Report Card Document */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-10 max-w-4xl mx-auto print:border-none print:shadow-none print:p-0 space-y-6 text-slate-800">
        {/* Institution Header with Golden Logo */}
        <div className="flex flex-col sm:flex-row items-center justify-between pb-6 border-b-2 border-slate-900 gap-4 text-center sm:text-left">
          <div className="flex items-center space-x-4">
            <img
              src="/logo.png"
              alt="NextGen Academy Logo"
              className="w-20 h-20 object-contain drop-shadow-md"
            />
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-wide">
                {data.institute?.nameBn || 'নেক্সটজেন একাডেমি'}
              </h1>
              <h2 className="text-sm font-black text-indigo-950 tracking-widest uppercase">
                {data.institute?.nameEn || 'NextGen ACADEMY'}
              </h2>
              <p className="text-[11px] font-bold text-amber-700 tracking-widest mt-0.5">
                {data.institute?.tagline || 'LEARN · GROW · SUCCEED'}
              </p>
              <p className="text-[10px] text-slate-500 mt-1">
                {data.institute?.address || 'ধানমন্ডি, ঢাকা'} • হেল্পলাইন: {data.institute?.phone || '+880 1800-NEXTGEN'}
              </p>
            </div>
          </div>

          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-center sm:text-right">
            <span className="text-[11px] font-black uppercase text-indigo-700 px-3 py-1 bg-indigo-50 rounded-full border border-indigo-200">
              অ্যাকাডেমিক রিপোর্ট কার্ড ২০২৬
            </span>
            <p className="text-xs font-extrabold text-slate-900 mt-2">
              {data.examTerm?.titleBn || '১ম সাময়িক পরীক্ষা ২০২৬'}
            </p>
            <p className="text-[10px] text-slate-500 font-semibold">শিক্ষাবর্ষ: ২০২৬</p>
          </div>
        </div>

        {/* Student Profile Card */}
        <div className="bg-slate-50/80 p-4 sm:p-5 rounded-2xl border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-semibold">
          <div>
            <span className="text-[10px] text-slate-500 font-bold block uppercase">শিক্ষার্থীর নাম</span>
            <span className="text-sm font-black text-slate-900 block mt-0.5">{data.student.name}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 font-bold block uppercase">আইডি নম্বর ও রোল</span>
            <span className="text-xs font-black text-slate-900 block mt-0.5">
              আইডি: {data.student.studentIdNumber} • রোল: {data.student.rollNo}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 font-bold block uppercase">শ্রেণি ও শাখা</span>
            <span className="text-xs font-black text-slate-900 block mt-0.5">
              {data.student.class} ({data.student.section})
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 font-bold block uppercase">ব্যাচ ও শিফট</span>
            <span className="text-xs font-black text-slate-900 block mt-0.5">
              {data.student.batch} ({data.student.shift})
            </span>
          </div>
        </div>

        {/* Subject-wise Marks Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white font-bold">
                <th className="py-2.5 px-3">বিষয় কোড ও নাম</th>
                <th className="py-2.5 px-2 text-center">পূর্ণমান</th>
                <th className="py-2.5 px-2 text-center">CQ</th>
                <th className="py-2.5 px-2 text-center">MCQ</th>
                <th className="py-2.5 px-2 text-center">ব্যবহারিক</th>
                <th className="py-2.5 px-2 text-center font-black">মোট প্রাপ্ত</th>
                <th className="py-2.5 px-2 text-center">সর্বোচ্চ</th>
                <th className="py-2.5 px-2 text-center">GP</th>
                <th className="py-2.5 px-2 text-center">গ্রেড</th>
                <th className="py-2.5 px-3">শিক্ষকের মন্তব্য</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-medium">
              {data.subjects?.map((sub) => (
                <tr key={sub.subjectId} className="hover:bg-slate-50/50">
                  <td className="py-2.5 px-3">
                    <span className="font-black text-slate-900">{sub.subjectNameBn}</span>
                    <span className="text-[10px] text-slate-400 font-mono block">{sub.subjectCode}</span>
                  </td>
                  <td className="py-2.5 px-2 text-center text-slate-600">{sub.fullMarks}</td>
                  <td className="py-2.5 px-2 text-center text-slate-700">{sub.cqMarks}</td>
                  <td className="py-2.5 px-2 text-center text-slate-700">{sub.mcqMarks}</td>
                  <td className="py-2.5 px-2 text-center text-slate-700">{sub.practicalMarks}</td>
                  <td className="py-2.5 px-2 text-center font-black text-slate-900 text-sm">{sub.obtainedMarks}</td>
                  <td className="py-2.5 px-2 text-center text-indigo-700 font-bold">{sub.highestInClass}</td>
                  <td className="py-2.5 px-2 text-center font-bold text-slate-800">{sub.gradePoint?.toFixed(1)}</td>
                  <td className="py-2.5 px-2 text-center">
                    <span className={`px-2 py-0.5 rounded-md font-black text-xs ${getGradeBadgeColor(sub.letterGrade)}`}>
                      {sub.letterGrade}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-[11px] text-slate-600 italic truncate max-w-[150px]">
                    {sub.teacherRemarks}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Overall Summary & Analytics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* GPA Box */}
          <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 text-white p-5 rounded-2xl text-center flex flex-col justify-center items-center shadow-md">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-300">চূড়ান্ত ফলাফল</span>
            <div className="text-4xl font-black text-amber-400 mt-2 font-mono">
              {data.summary?.gpa?.toFixed(2)}
            </div>
            <span className="text-base font-black px-3 py-0.5 rounded-full bg-white/20 text-white mt-1">
              লেটার গ্রেড: {data.summary?.overallGrade}
            </span>
            <span className="text-[11px] text-emerald-300 font-bold mt-2">
              {data.summary?.resultStatus === 'PASSED' ? '✓ উত্তীর্ণ (PASSED)' : '✕ অকৃতকার্য (FAILED)'}
            </span>
          </div>

          {/* Marks & Attendance Metrics */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-500 font-bold">মোট প্রাপ্ত নম্বর:</span>
              <span className="font-black text-slate-900">
                {data.summary?.totalObtained} / {data.summary?.totalPossibleMarks}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-500 font-bold">প্রাপ্ত নম্বর শতকরা:</span>
              <span className="font-black text-slate-900">{data.summary?.percentage}%</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-500 font-bold">উপস্থিতির হার:</span>
              <span className="font-black text-emerald-700">{data.summary?.attendanceRate}%</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500 font-bold">আচরণগত মূল্যায়ন:</span>
              <span className="font-black text-indigo-700">{data.summary?.conductGrade || 'A+ (উত্তম)'}</span>
            </div>
          </div>

          {/* Teacher Remarks Box */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
            <div>
              <span className="text-[10px] font-black uppercase text-indigo-700 block">
                {t('classTeacherRemarks')}:
              </span>
              <p className="text-[11px] text-slate-700 italic mt-0.5">
                "{data.summary?.classTeacherRemarks}"
              </p>
            </div>
            <div className="pt-2 border-t border-slate-200">
              <span className="text-[10px] font-black uppercase text-amber-700 block">
                {t('principalRemarks')}:
              </span>
              <p className="text-[11px] text-slate-700 italic mt-0.5">
                "{data.summary?.principalRemarks}"
              </p>
            </div>
          </div>
        </div>

        {/* Signature Blocks */}
        <div className="grid grid-cols-3 gap-6 pt-12 text-center text-xs font-bold text-slate-800">
          <div className="border-t-2 border-slate-400 pt-2">শ্রেণি শিক্ষক / ক্লাস টিচার</div>
          <div className="border-t-2 border-slate-400 pt-2">অ্যাকাডেমিক কো-অর্ডিনেটর</div>
          <div className="border-t-2 border-slate-400 pt-2">অধ্যক্ষ / প্রিন্সিপাল</div>
        </div>
      </div>
    </div>
  );
}
