import React, { useState } from 'react';

export default function LiveClassScheduler({ onScheduleSuccess }) {
  const [classTitle, setClassTitle] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [duration, setDuration] = useState('60');
  const [platform, setPlatform] = useState('custom');
  const [meetingLink, setMeetingLink] = useState('https://meet.google.com/nga-');
  const [passcode, setPasscode] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // NextGen Academy এর নির্ধারিত শ্রেণি ও বিষয়সমূহ
  const classesList = [
    'ষষ্ঠ শ্রেণি (Class 6)',
    'সপ্তম শ্রেণি (Class 7)',
    'অষ্টম শ্রেণি (Class 8)',
    'নবম শ্রেণি (Class 9)',
    'দশম শ্রেণি (Class 10)',
    'এসএসসি (SSC)',
    'এইচএসসি (HSC)'
  ];

  const subjectsList = [
    'উচ্চতর গণিত',
    'সাধারণ গণিত',
    'পদার্থবিজ্ঞান',
    'রসায়ন',
    'জীববিজ্ঞান',
    'আইসিটি (ICT)',
    'বাংলাদেশ ও বিশ্বপরিচয়',
    'বাংলা',
    'ইংরেজি'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      // ডেটা সাবমিট করার লজিক
      const payload = {
        classTitle,
        selectedClass,
        selectedSubject,
        dateTime,
        duration,
        platform,
        meetingLink,
        passcode
      };

      const response = await fetch('/api/live-class/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const resData = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(resData?.error?.message || 'ক্লাস শিডিউল সংরক্ষণ করতে সমস্যা হয়েছে।');
      }

      setSuccessMsg('লাইভ ক্লাস সফলভাবে শিডিউল করা হয়েছে!');
      alert('লাইভ ক্লাস সফলভাবে শিডিউল করা হয়েছে!');
      
      // Reset form fields
      setClassTitle('');
      setSelectedClass('');
      setSelectedSubject('');
      setDateTime('');
      setPasscode('');

      if (onScheduleSuccess) {
        onScheduleSuccess(resData.data);
      }
    } catch (error) {
      console.error('Schedule error:', error);
      setErrorMsg(error.message || 'ক্লাস সংরক্ষণ করতে সমস্যা হয়েছে।');
      alert(error.message || 'সফলভাবে সংরক্ষিত হয়েছে!');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto text-slate-100 bg-slate-900 min-h-[600px] rounded-2xl shadow-xl border border-slate-800">
      <div className="flex justify-between items-center mb-6 border-b border-slate-700 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>🎥</span> নতুন লাইভ অনলাইন ক্লাস শিডিউল করুন
          </h2>
          <p className="text-xs text-slate-400 mt-1">শ্রেণি, সময়সূচি ও মিটিং প্ল্যাটফর্ম নির্ধারণ করুন</p>
        </div>
      </div>

      {successMsg && (
        <div className="mb-4 p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-semibold flex items-center justify-between">
          <span>✓ {successMsg}</span>
          <button onClick={() => setSuccessMsg('')} className="text-emerald-300 hover:text-white font-bold">✕</button>
        </div>
      )}

      {errorMsg && (
        <div className="mb-4 p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs font-semibold flex items-center justify-between">
          <span>⚠ {errorMsg}</span>
          <button onClick={() => setErrorMsg('')} className="text-rose-300 hover:text-white font-bold">✕</button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">ক্লাসের শিরোনাম *</label>
          <input
            type="text"
            value={classTitle}
            onChange={(e) => setClassTitle(e.target.value)}
            placeholder="যেমন: উচ্চতর গণিত - জ্যামিতি বিশেষ ক্লাস"
            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">শ্রেণি *</label>
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
            <label className="block text-sm font-medium text-slate-300 mb-1">বিষয় *</label>
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
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">তারিখ ও সময়সূচি *</label>
            <input
              type="datetime-local"
              value={dateTime}
              onChange={(e) => setDateTime(e.target.value)}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">স্থায়িত্ব (মিনিট) *</label>
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="30">30 মিনিট</option>
              <option value="45">45 মিনিট</option>
              <option value="60">60 মিনিট (1 Hour)</option>
              <option value="90">90 মিনিট</option>
              <option value="120">120 মিনিট (2 Hours)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">প্ল্যাটফর্ম</label>
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
          >
            <option value="google-meet">Google Meet</option>
            <option value="zoom">Zoom</option>
            <option value="custom">কাস্টম লিংক / Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">মিটিং লিংক *</label>
          <input
            type="url"
            value={meetingLink}
            onChange={(e) => setMeetingLink(e.target.value)}
            placeholder="https://meet.google.com/xxx-yyyy-zzz"
            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">পাসকোড / পিন (ঐচ্ছিক)</label>
          <input
            type="text"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            placeholder="যেমন: nextgen-class8 (ঐচ্ছিক)"
            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition shadow-lg shadow-emerald-600/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? 'সংরক্ষণ হচ্ছে...' : 'ক্লাস শিডিউল সংরক্ষণ করুন'}
          </button>
        </div>
      </form>
    </div>
  );
}
