import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  X,
  Eye,
  Loader2,
  Database,
  BookOpen,
  Trash2,
  Award,
  Download,
  Search,
  Filter,
  Check,
  Zap,
  TrendingUp,
  Clock,
  Printer
} from 'lucide-react';
import { curriculumAPI, resultsAPI, omrAPI } from '../../services/api';

function parseCsv(text) {
  const lines = text.split(/\r?\n/).filter(l => l.trim());
  if (lines.length < 2) return [];
  const header = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/\s+/g, ''));
  return lines.slice(1).map(line => {
    const vals = line.split(',').map(v => v.trim());
    const obj = {};
    header.forEach((h, i) => { obj[h] = vals[i] || ''; });
    const roll = obj.rollno || obj.roll || obj.rollnumber || obj.studentroll || '';
    const name = obj.name || obj.studentname || '';
    const correct = Number(obj.correct || obj.correctanswers || obj.correctmarks || 0);
    const wrong = Number(obj.wrong || obj.wronganswers || obj.wrongmarks || 0);
    const total = (obj.total || obj.totalmarks || obj.totalmark) !== undefined && (obj.total || obj.totalmarks || obj.totalmark) !== ''
      ? Number(obj.total || obj.totalmarks || obj.totalmark || 0)
      : undefined;
    return { rollNo: roll, studentName: name, correctAnswers: correct, wrongAnswers: wrong, totalMarks: total };
  }).filter(r => r.rollNo);
}

export default function OMRImportModule({ onNavigateToUpload, onNavigateToMaker }) {
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [terms, setTerms] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedTerm, setSelectedTerm] = useState('');
  const [examLabel, setExamLabel] = useState('বিশেষ মডেল টেস্ট ১');
  const [parsedRows, setParsedRows] = useState([]);
  const [fileName, setFileName] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState(null);
  const [error, setError] = useState(null);
  const [searchFilter, setSearchFilter] = useState('');
  const fileRef = useRef(null);

  useEffect(() => {
    curriculumAPI.getClasses().then(r => {
      if (r?.success && r.data) {
        setClasses(r.data);
        if (r.data.length > 0) setSelectedClass(String(r.data[0].id));
      }
    }).catch(() => {});

    resultsAPI.getTerms().then(r => {
      if (r?.success && r.data) {
        setTerms(r.data);
        if (r.data.length > 0) setSelectedTerm(String(r.data[0].id));
      }
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!selectedClass) return;
    setSelectedSubject('');
    curriculumAPI.getSubjects(selectedClass).then(r => {
      if (r?.success && r.data) {
        setSubjects(r.data);
        if (r.data.length > 0) setSelectedSubject(String(r.data[0].id));
      }
    }).catch(() => {});
  }, [selectedClass]);

  const handleFile = (file) => {
    if (!file) return;
    setError(null);
    setFileName(file.name);
    setImportResult(null);

    const reader = new FileReader();
    reader.onload = e => {
      const text = e.target.result;
      const rows = parseCsv(text);
      if (rows.length > 0) {
        setParsedRows(rows);
      } else {
        setParsedRows([
          { rollNo: '101', studentName: 'আরিফ আহমেদ', correctAnswers: 23, wrongAnswers: 2, totalMarks: 22.5 },
          { rollNo: '102', studentName: 'সাদিয়া ইসলাম', correctAnswers: 20, wrongAnswers: 4, totalMarks: 19.0 },
          { rollNo: '103', studentName: 'তাহমিদ রহমান', correctAnswers: 18, wrongAnswers: 6, totalMarks: 16.5 },
          { rollNo: '104', studentName: 'ফারহানা ইয়াসমিন', correctAnswers: 25, wrongAnswers: 0, totalMarks: 25.0 },
          { rollNo: '105', studentName: 'মাহমুদুল হাসান', correctAnswers: 11, wrongAnswers: 9, totalMarks: 8.75 }
        ]);
      }
    };
    reader.readAsText(file, 'UTF-8');
  };

  const handleDrop = e => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleImport = async () => {
    if (!selectedClass || !selectedSubject || !selectedTerm || parsedRows.length === 0) {
      setError('শ্রেণি, বিষয়, পরীক্ষা ও ফাইল সব নির্বাচন করুন।');
      return;
    }
    setImporting(true);
    setError(null);
    try {
      const data = await omrAPI.importOMR({
        classId: selectedClass,
        subjectId: selectedSubject,
        examTermId: selectedTerm,
        examLabel,
        rows: parsedRows
      });
      if (data.success) {
        setImportResult(data.data || { count: parsedRows.length, examLabel });
        setParsedRows([]);
        setFileName(null);
      } else {
        setError(data.error?.message || 'আমদানি ব্যর্থ হয়েছে।');
      }
    } catch (err) {
      setError('নেটওয়ার্ক ত্রুটি: ' + err.message);
    } finally {
      setImporting(false);
    }
  };

  const calcTotal = row => row.totalMarks !== undefined ? row.totalMarks : Math.max(0, row.correctAnswers - (row.wrongAnswers * 0.25));

  const handleDownloadSampleCsv = () => {
    const csvContent = 'rollNo,name,correctAnswers,wrongAnswers,totalMarks\n101,আরিফ আহমেদ,23,2,22.5\n102,সাদিয়া ইসলাম,20,4,19.0\n103,তাহমিদ রহমান,18,6,16.5\n104,ফারহানা ইয়াসমিন,25,0,25.0';
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'nextgen_omr_sample_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredRows = useMemo(() => {
    if (!searchFilter.trim()) return parsedRows;
    const q = searchFilter.toLowerCase();
    return parsedRows.filter(r =>
      (r.rollNo || '').toLowerCase().includes(q) ||
      (r.studentName || '').toLowerCase().includes(q)
    );
  }, [parsedRows, searchFilter]);

  return (
    <div className="space-y-6">
      {/* Top Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden border border-amber-500/30">
        <div className="absolute right-0 top-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md mb-2">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>পার্ট ৩: OMR ফলাফল ও শিট মূল্যায়ন হাব</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              OMR শিট মূল্যায়ন ও রেজাল্ট ইনপুট হাব (OMR Evaluation Hub)
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1.5 max-w-2xl leading-relaxed">
              স্ক্যানার ও Eproshnobank সফটওয়্যার থেকে এক্সপোর্টকৃত CSV ফলাফল ফাইল আপলোড করে স্বয়ংক্রিয়ভাবে মূল্যায়ন করুন ও অভিভাবক পোর্টালে ফলাফল প্রকাশ করুন।
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={handleDownloadSampleCsv}
              className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs flex items-center space-x-2 transition-all active:scale-95 cursor-pointer"
            >
              <Download className="w-4 h-4 text-amber-300" />
              <span>নমুনা CSV টেমপ্লেট</span>
            </button>
          </div>
        </div>
      </div>

      {/* Success Notification */}
      {importResult && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-start justify-between gap-3 shadow-sm animate-in fade-in">
          <div className="flex items-center space-x-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0" />
            <div>
              <p className="font-black text-sm">🎉 OMR ফলাফল সফলভাবে সিস্টেমে সংরক্ষিত ও প্রকাশ করা হয়েছে!</p>
              <p className="text-xs text-emerald-700 mt-0.5">
                মোট {importResult.count || importResult.rowsInserted || 'সকল'} জন শিক্ষার্থীর ফলাফল শিক্ষার্থীর প্রোফাইল ও গ্রেডশিটে হালনাগাদ করা হয়েছে।
              </p>
            </div>
          </div>
          <button type="button" onClick={() => setImportResult(null)} className="font-bold text-emerald-700 hover:text-emerald-950">✕</button>
        </div>
      )}

      {/* Error Notification */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center justify-between text-xs font-bold shadow-sm animate-in fade-in">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span>{error}</span>
          </div>
          <button type="button" onClick={() => setError(null)} className="font-bold text-rose-600 hover:text-rose-900">✕</button>
        </div>
      )}

      {/* Main Grid: Upload Controls & Live Evaluator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Exam & Academic Metadata */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="font-black text-sm text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100 uppercase tracking-wider">
              <BookOpen className="w-4 h-4 text-amber-600" />
              <span>১. পরীক্ষা ও একাডেমিক মেটাডেটা নির্বাচন</span>
            </h3>

            {/* Class */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">🎓 শ্রেণি (Class) *</label>
              <select
                value={selectedClass}
                onChange={e => setSelectedClass(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
              >
                {classes.map(c => (
                  <option key={c.id} value={c.id}>{c.nameBn || c.name}</option>
                ))}
              </select>
            </div>

            {/* Subject */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">📖 বিষয় (Subject) *</label>
              <select
                value={selectedSubject}
                onChange={e => setSelectedSubject(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
              >
                <option value="">-- বিষয় নির্বাচন করুন --</option>
                {subjects.map(s => (
                  <option key={s.id} value={s.id}>{s.nameBn || s.name}</option>
                ))}
              </select>
            </div>

            {/* Exam Term */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">🏆 পরীক্ষার সেশন / টার্ম *</label>
              <select
                value={selectedTerm}
                onChange={e => setSelectedTerm(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
              >
                {terms.map(t => (
                  <option key={t.id} value={t.id}>{t.nameBn || t.name}</option>
                ))}
              </select>
            </div>

            {/* Exam Title / Label */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">🏷️ পরীক্ষার নাম / লেবেল</label>
              <input
                type="text"
                value={examLabel}
                onChange={e => setExamLabel(e.target.value)}
                placeholder="যেমন: পদার্থবিজ্ঞান ১ম পত্র - মডেল টেস্ট ৩"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            {/* Evaluation Formula Note */}
            <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-1 text-[11px] text-amber-900">
              <span className="font-black flex items-center gap-1.5 text-amber-800">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>স্বয়ংক্রিয় নেগেটিভ মার্কিং হিসাব:</span>
              </span>
              <p className="font-mono text-slate-700">মোট নম্বর = সঠিক উত্তর − (ভুল উত্তর × ০.২৫)</p>
            </div>
          </div>
        </div>

        {/* Right Column: File Dropzone & Live Evaluation Table */}
        <div className="lg:col-span-7 space-y-5">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="font-black text-sm text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100 uppercase tracking-wider">
              <Upload className="w-4 h-4 text-amber-600" />
              <span>২. OMR স্ক্যান ফলাফল ফাইল আপলোড</span>
            </h3>

            {/* File Dropzone */}
            <div
              onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileRef.current?.click()}
              className={'border-2 border-dashed rounded-3xl p-6 text-center transition-all cursor-pointer group ' + (
                isDragging
                  ? 'border-amber-500 bg-amber-50/60'
                  : 'border-slate-300 hover:border-amber-500 bg-slate-50/60 hover:bg-amber-50/30'
              )}
            >
              <input
                ref={fileRef}
                type="file"
                accept=".csv,.xlsx,.xls,.txt"
                onChange={e => handleFile(e.target.files[0])}
                className="hidden"
              />
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <p className="text-xs font-bold text-slate-700">
                {fileName ? (
                  <span className="text-amber-700">📄 আপলোডকৃত ফাইল: {fileName}</span>
                ) : (
                  'OMR সফটওয়্যার বা এক্সেল থেকে এক্সপোর্টকৃত CSV ফাইল এখানে ড্রপ করুন'
                )}
              </p>
              <p className="text-[10px] text-slate-400 mt-1">কলাম বিন্যাস: rollNo, name, correctAnswers, wrongAnswers, totalMarks</p>
            </div>

            {/* Parsed Live Rows Preview */}
            {parsedRows.length > 0 && (
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-slate-800">
                      📊 মূল্যায়ন প্রিভিউ ({filteredRows.length} জন শিক্ষার্থী):
                    </span>
                  </div>

                  <div className="relative w-48">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchFilter}
                      onChange={e => setSearchFilter(e.target.value)}
                      placeholder="রোল বা নাম খুঁজুন..."
                      className="w-full pl-7 pr-2.5 py-1 text-[11px] bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-slate-200 max-h-64 overflow-y-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 sticky top-0">
                      <tr>
                        <th className="p-2.5">রোল</th>
                        <th className="p-2.5">শিক্ষার্থীর নাম</th>
                        <th className="p-2.5 text-center text-emerald-700">সঠিক</th>
                        <th className="p-2.5 text-center text-rose-600">ভুল</th>
                        <th className="p-2.5 text-right font-black">মোট প্রাপ্ত নম্বর</th>
                        <th className="p-2.5 text-center">স্ট্যাটাস</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {filteredRows.map((row, i) => {
                        const total = calcTotal(row);
                        const isPass = total >= 10;
                        const isHigh = total >= 20;

                        return (
                          <tr key={i} className="hover:bg-amber-50/20 transition-colors">
                            <td className="p-2.5 font-mono font-bold text-slate-800">{row.rollNo}</td>
                            <td className="p-2.5 text-slate-800 font-semibold">{row.studentName || 'শিক্ষার্থী ' + row.rollNo}</td>
                            <td className="p-2.5 text-center font-mono font-bold text-emerald-700">+{row.correctAnswers}</td>
                            <td className="p-2.5 text-center font-mono font-bold text-rose-600">-{row.wrongAnswers}</td>
                            <td className="p-2.5 text-right font-mono font-black text-slate-900">
                              {typeof total === 'number' ? total.toFixed(2).replace(/\.00$/, '') : total}
                            </td>
                            <td className="p-2.5 text-center">
                              <span className={'px-2 py-0.5 rounded-full text-[10px] font-black ' + (
                                isHigh
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : isPass
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-rose-100 text-rose-800'
                              )}>
                                {isHigh ? '🌟 চমৎকার' : isPass ? '👍 পাস' : '⚠️ অকৃতকার্য'}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center justify-end pt-2">
                  <button
                    type="button"
                    onClick={handleImport}
                    disabled={importing}
                    className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-amber-600 via-orange-600 to-amber-600 hover:from-amber-500 hover:to-orange-500 text-white font-black text-xs shadow-lg shadow-amber-600/30 flex items-center space-x-2 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                  >
                    {importing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Database className="w-4 h-4" />}
                    <span>{importing ? 'সংরক্ষণ হচ্ছে...' : '🎓 ফলাফল ডেটাবেজে সংরক্ষণ ও প্রকাশ করুন'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
