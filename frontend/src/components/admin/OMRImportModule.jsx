import React, { useState, useEffect, useRef } from 'react';
import { Upload, FileSpreadsheet, CheckCircle2, AlertCircle, X, Eye, Loader2, Database, BookOpen, Trash2 } from 'lucide-react';
import { curriculumAPI, resultsAPI, omrAPI } from '../../services/api';

const SUPPORTED = ['.csv'];

function parseCsv(text) {
  const lines = text.split(/\r?\n/).filter(l => l.trim());
  if (lines.length < 2) return [];
  const header = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/\s+/g, ''));
  return lines.slice(1).map(line => {
    const vals = line.split(',').map(v => v.trim());
    const obj = {};
    header.forEach((h, i) => { obj[h] = vals[i] || ''; });
    const roll = obj.rollno || obj.roll || obj.rollnumber || '';
    const correct = Number(obj.correct || obj.correctanswers || obj.correctmarks || 0);
    const wrong = Number(obj.wrong || obj.wronganswers || obj.wrongmarks || 0);
    const total = (obj.total || obj.totalmarks || obj.totalmark) !== undefined && (obj.total || obj.totalmarks || obj.totalmark) !== ''
      ? Number(obj.total || obj.totalmarks || obj.totalmark || 0)
      : undefined;
    return { rollNo: roll, correctAnswers: correct, wrongAnswers: wrong, totalMarks: total };
  }).filter(r => r.rollNo);
}

export default function OMRImportModule() {
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [terms, setTerms] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedTerm, setSelectedTerm] = useState('');
  const [examLabel, setExamLabel] = useState('মডেল টেস্ট ১');
  const [parsedRows, setParsedRows] = useState([]);
  const [fileName, setFileName] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState(null);
  const [error, setError] = useState(null);
  const fileRef = useRef();

  useEffect(() => {
    curriculumAPI.getClasses().then(r => {
      if (r?.success && r.data) { setClasses(r.data); if (r.data.length > 0) setSelectedClass(String(r.data[0].id)); }
    }).catch(() => {});
    resultsAPI.getTerms().then(r => {
      if (r?.success && r.data) { setTerms(r.data); if (r.data.length > 0) setSelectedTerm(String(r.data[0].id)); }
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!selectedClass) return;
    setSelectedSubject('');
    curriculumAPI.getSubjects(selectedClass).then(r => {
      if (r?.success && r.data) { setSubjects(r.data); if (r.data.length > 0) setSelectedSubject(String(r.data[0].id)); }
    }).catch(() => {});
  }, [selectedClass]);

  const handleFile = (file) => {
    if (!file) return;
    const ext = '.' + file.name.split('.').pop().toLowerCase();
    if (ext !== '.csv') { setError('শুধুমাত্র CSV ফাইল সাপোর্টেড।'); return; }
    setError(null); setFileName(file.name); setImportResult(null);
    const reader = new FileReader();
    reader.onload = e => { setParsedRows(parseCsv(e.target.result)); };
    reader.readAsText(file, 'UTF-8');
  };

  const handleDrop = e => { e.preventDefault(); setIsDragging(false); handleFile(e.dataTransfer.files[0]); };

  const handleImport = async () => {
    if (!selectedClass || !selectedSubject || !selectedTerm || parsedRows.length === 0) {
      setError('শ্রেণি, বিষয়, পরীক্ষা ও ফাইল সব নির্বাচন করুন।'); return;
    }
    setImporting(true); setError(null);
    try {
      const data = await omrAPI.importOMR({ classId: selectedClass, subjectId: selectedSubject, examTermId: selectedTerm, examLabel, rows: parsedRows });
      if (data.success) { setImportResult(data.data); setParsedRows([]); setFileName(null); }
      else setError(data.error?.message || 'আমদানি ব্যর্থ হয়েছে।');
    } catch (err) { setError('নেটওয়ার্ক ত্রুটি: ' + err.message); }
    finally { setImporting(false); }
  };

  const calcTotal = row => row.totalMarks !== undefined ? row.totalMarks : Math.max(0, row.correctAnswers - Math.floor(row.wrongAnswers * 0.25));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <span className="text-3xl">📋</span> OMR ফলাফল আমদানি মডিউল
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Eproshnobank বা যেকোনো OMR সফটওয়্যার থেকে CSV এক্সপোর্ট করে সরাসরি ডেটাবেজে আপলোড করুন
        </p>
      </div>

      {importResult && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 flex items-start gap-3">
          <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-bold text-emerald-800 dark:text-emerald-200">{importResult.message}</p>
            <p className="text-sm text-emerald-700 dark:text-emerald-300 mt-1">
              মোট রো: {importResult.totalRows} | সফল: {importResult.savedCount}
              {importResult.notFoundRolls?.length > 0 && <span className="ml-2 text-amber-600">| পাওয়া যায়নি: {importResult.notFoundRolls.join(', ')}</span>}
            </p>
          </div>
          <button onClick={() => setImportResult(null)} className="text-emerald-500 hover:text-emerald-700"><X className="w-4 h-4" /></button>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
          <p className="text-sm font-semibold text-rose-700 dark:text-rose-300 flex-1">{error}</p>
          <button onClick={() => setError(null)} className="text-rose-400 hover:text-rose-600"><X className="w-4 h-4" /></button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
            <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-500" /> পরীক্ষার তথ্য
            </h3>
            <div>
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">শ্রেণি</label>
              <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                <option value="">শ্রেণি নির্বাচন করুন</option>
                {classes.map(c => <option key={c.id} value={c.id}>{c.nameBn || c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">বিষয়</label>
              <select value={selectedSubject} onChange={e => setSelectedSubject(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                <option value="">বিষয় নির্বাচন করুন</option>
                {subjects.map(s => <option key={s.id} value={s.id}>{s.nameBn || s.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">পরীক্ষার ধাপ</label>
              <select value={selectedTerm} onChange={e => setSelectedTerm(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                <option value="">পরীক্ষা নির্বাচন করুন</option>
                {terms.map(t => <option key={t.id} value={t.id}>{t.titleBn || t.titleEn}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">পরীক্ষার নাম (লেবেল)</label>
              <input type="text" value={examLabel} onChange={e => setExamLabel(e.target.value)} placeholder="যেমন: মডেল টেস্ট ১" className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
          </div>
          <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-4">
            <h4 className="text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider mb-2">📄 CSV ফরম্যাট গাইড</h4>
            <div className="text-xs text-amber-700 dark:text-amber-400 space-y-1 font-mono">
              <p className="font-bold">Header Row:</p>
              <p>rollNo,correct,wrong,total</p>
              <p className="font-bold mt-2">Example Rows:</p>
              <p>101,25,3,22</p>
              <p>102,18,5,15</p>
              <p className="font-bold mt-2 not-italic font-sans text-amber-600">★ total কলাম না থাকলে স্বয়ংক্রিয়ভাবে গণনা হবে</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div
            onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileRef.current?.click()}
            className={`relative border-2 border-dashed rounded-2xl p-8 cursor-pointer transition-all flex flex-col items-center justify-center text-center min-h-[180px] ${isDragging ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20' : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-emerald-400 hover:bg-emerald-50/30 dark:hover:bg-emerald-950/10'}`}
          >
            <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={e => handleFile(e.target.files[0])} />
            <FileSpreadsheet className="w-12 h-12 text-emerald-500 mb-3" />
            {fileName ? (
              <p className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" /> {fileName}
              </p>
            ) : (
              <p className="font-bold text-slate-700 dark:text-slate-300">CSV ফাইল এখানে ড্রপ করুন</p>
            )}
            {!fileName && <p className="text-sm text-slate-500 mt-1">অথবা <span className="text-emerald-600 font-semibold underline">ক্লিক করে ব্রাউজ</span> করুন</p>}
            {fileName && (
              <button onClick={e => { e.stopPropagation(); setParsedRows([]); setFileName(null); }} className="mt-2 text-xs text-rose-500 hover:text-rose-700 flex items-center gap-1">
                <Trash2 className="w-3 h-3" /> ফাইল সরান
              </button>
            )}
          </div>

          {parsedRows.length > 0 && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                  <Eye className="w-4 h-4 text-blue-500" /> পার্স করা ডেটা প্রিভিউ
                  <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 text-xs font-bold">{parsedRows.length} রো</span>
                </h3>
              </div>
              <div className="overflow-auto max-h-72">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 dark:bg-slate-800/60 sticky top-0">
                    <tr>
                      <th className="px-4 py-2.5 text-left text-xs font-bold text-slate-500 uppercase">#</th>
                      <th className="px-4 py-2.5 text-left text-xs font-bold text-slate-500 uppercase">রোল নং</th>
                      <th className="px-4 py-2.5 text-center text-xs font-bold text-emerald-600 uppercase">সঠিক</th>
                      <th className="px-4 py-2.5 text-center text-xs font-bold text-rose-600 uppercase">ভুল</th>
                      <th className="px-4 py-2.5 text-center text-xs font-bold text-indigo-600 uppercase">মোট মার্কস</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {parsedRows.slice(0, 50).map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="px-4 py-2 text-slate-500 text-xs">{idx + 1}</td>
                        <td className="px-4 py-2 font-bold text-slate-800 dark:text-slate-100">{row.rollNo}</td>
                        <td className="px-4 py-2 text-center font-semibold text-emerald-600">{row.correctAnswers}</td>
                        <td className="px-4 py-2 text-center font-semibold text-rose-600">{row.wrongAnswers}</td>
                        <td className="px-4 py-2 text-center">
                          <span className="px-2.5 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-bold text-xs">{calcTotal(row)}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {parsedRows.length > 50 && <p className="text-center text-xs text-slate-500 py-2">আরও {parsedRows.length - 50}টি রো...</p>}
              </div>
            </div>
          )}

          <button
            onClick={handleImport}
            disabled={importing || parsedRows.length === 0 || !selectedClass || !selectedSubject || !selectedTerm}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:from-slate-300 disabled:to-slate-300 dark:disabled:from-slate-700 dark:disabled:to-slate-700 disabled:cursor-not-allowed text-white font-black text-sm shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
          >
            {importing ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> ডেটাবেজে সংরক্ষণ হচ্ছে...</>
            ) : (
              <><Database className="w-5 h-5" /> OMR ফলাফল ডেটাবেজে আমদানি করুন ({parsedRows.length} রো)</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
