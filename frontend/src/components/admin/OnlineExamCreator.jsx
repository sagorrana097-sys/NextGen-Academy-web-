import React, { useState } from 'react';

export default function OnlineExamCreator({ onExamCreated }) {
  const [examTitle, setExamTitle] = useState('৯ম শ্রেণির ৯ম সাময়িক পরীক্ষার টেস্ট');
  const [englishTitle, setEnglishTitle] = useState('');
  const [selectedClass, setSelectedClass] = useState('৯ম শ্রেণি (Class 9 - SSC)');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [examType, setExamType] = useState('MCQ');
  const [date, setDate] = useState('31/08/2026');
  const [startTime, setStartTime] = useState('11:00');
  const [duration, setDuration] = useState('15');
  const [totalMarks, setTotalMarks] = useState('5');
  const [passMarks, setPassMarks] = useState('2');
  const [instructions, setInstructions] = useState('প্রতিটি প্রশ্নের ৪টি অপশন থেকে সঠিক উত্তরটি নির্বাচন করো। সময়সীমা ১৫ মিনিট। সাবমিট করার সাথে সাথেই ফলাফল দেখা যাবে।');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState(null);

  // NextGen Academy-এর নির্ধারিত শ্রেণি তালিকা
  const classesList = [
    'সপ্তম শ্রেণি (Class 7)',
    'অষ্টম শ্রেণি (Class 8)',
    '৯ম শ্রেণি (Class 9 - SSC)',
    'দশম শ্রেণি (Class 10 - SSC)',
    'একাদশ-দ্বাদশ শ্রেণি (HSC)'
  ];

  // NextGen Academy-এর নির্ধারিত বিষয়সমূহ
  const subjectsList = [
    'পদার্থবিজ্ঞান (Physics)',
    'রসায়ন (Chemistry)',
    'সাধারণ গণিত (General Math)',
    'উচ্চতর গণিত (Higher Math)',
    'জীববিজ্ঞান (Biology)',
    'তথ্য ও যোগাযোগ প্রযুক্তি (ICT)',
    'বাংলা (Bangla)',
    'ইংরেজি (English)',
    'বাংলাদেশ ও বিশ্বপরিচয় (BGS)'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    try {
      const payload = {
        examTitle,
        englishTitle,
        selectedClass,
        selectedSubject,
        examType,
        date,
        startTime,
        duration,
        totalMarks,
        passMarks,
        instructions
      };

      const response = await fetch('/api/online-exam/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(localStorage.getItem('token') ? { 'Authorization': `Bearer ${localStorage.getItem('token')}` } : {})
        },
        body: JSON.stringify(payload)
      });

      const resData = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(resData?.error?.message || 'পরীক্ষা তৈরি করতে সমস্যা হয়েছে।');
      }

      setMessage({ type: 'success', text: 'অনলাইন পরীক্ষা সফলভাবে তৈরি ও সংরক্ষিত হয়েছে!' });
      alert('অনলাইন পরীক্ষা সফলভাবে তৈরি ও সংরক্ষিত হয়েছে!');

      if (onExamCreated) {
        onExamCreated(resData.data);
      }
    } catch (error) {
      console.error('Exam save error:', error);
      setMessage({ type: 'error', text: error.message || 'পরীক্ষা সংরক্ষণ করতে সমস্যা হয়েছে।' });
      alert(error.message || 'সফলভাবে সংরক্ষিত হয়েছে!');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto text-slate-100 bg-slate-900 min-h-screen rounded-2xl shadow-xl border border-slate-800">
      <div className="flex justify-between items-center mb-6 border-b border-slate-700 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>📝</span> + নতুন অনলাইন পরীক্ষা তৈরি করুন
          </h2>
          <p className="text-xs text-slate-400 mt-1">MCQ কুইজ ও সৃজনশীল লিখিত পরীক্ষার প্রশ্নপত্র প্রণয়ন</p>
        </div>
      </div>

      {message && (
        <div className={`p-4 mb-4 rounded-xl text-sm flex items-center justify-between ${message.type === 'success' ? 'bg-emerald-900/50 text-emerald-300 border border-emerald-700' : 'bg-red-900/50 text-red-300 border border-red-700'}`}>
          <span>{message.text}</span>
          <button onClick={() => setMessage(null)} className="font-bold text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">পরীক্ষার নাম / শিরোনাম (Bangla Title) *</label>
          <input
            type="text"
            value={examTitle}
            onChange={(e) => setExamTitle(e.target.value)}
            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">ইংরেজি নাম (English Title)</label>
          <input
            type="text"
            value={englishTitle}
            onChange={(e) => setEnglishTitle(e.target.value)}
            placeholder="e.g. Class 8 Science 1st Term Quiz"
            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">শ্রেণি (Class) *</label>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
            required
          >
            <option value="">-- শ্রেণি নির্বাচন করুন --</option>
            {classesList.map((cls, index) => (
              <option key={index} value={cls}>{cls}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">বিষয় (Subject) *</label>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
            required
          >
            <option value="">-- বিষয় নির্বাচন করুন --</option>
            {subjectsList.map((sub, index) => (
              <option key={index} value={sub}>{sub}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">পরীক্ষার ধরন (Exam Type) *</label>
          <select
            value={examType}
            onChange={(e) => setExamType(e.target.value)}
            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
          >
            <option value="MCQ">বহুনির্বাচনী (MCQ)</option>
            <option value="CQ">সৃজনশীল (CQ)</option>
            <option value="SQ">সংক্ষিপ্ত প্রশ্ন (SQ)</option>
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">তারিখ (Date)</label>
            <input
              type="text"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              placeholder="DD/MM/YYYY"
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">শুরুর সময়</label>
            <input
              type="text"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              placeholder="11:00 AM"
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">সময়সীমা (মিনিট)</label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">মোট নম্বর</label>
            <input
              type="number"
              value={totalMarks}
              onChange={(e) => setTotalMarks(e.target.value)}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">পাস নম্বর</label>
            <input
              type="number"
              value={passMarks}
              onChange={(e) => setPassMarks(e.target.value)}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">নির্দেশনাবলী (Instructions)</label>
          <textarea
            rows="3"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition shadow-lg shadow-emerald-600/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? 'সংরক্ষণ হচ্ছে...' : 'পরীক্ষা সংরক্ষণ করুন'}
          </button>
        </div>
      </form>
    </div>
  );
}
