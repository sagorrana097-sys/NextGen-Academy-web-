import React, { useState } from 'react';

export default function TeacherForm({ initialData, onSaveSuccess }) {
  const [formData, setFormData] = useState({
    name: initialData?.name || 'মো: আলমগীর হোসেন (সাগর)',
    email: initialData?.email || 'sagorrana097@gmail.com',
    password: '',
    education: initialData?.education || initialData?.qualifications || 'বি.এসসি (অনার্স), এম.এসসি - ঢাকা বিশ্ববিদ্যালয়',
    roomNo: initialData?.roomNo || 'শিক্ষক মিলনয়তন (কক্ষ ২০৪)',
    schedule: initialData?.schedule || initialData?.officeHours || 'রবি - বৃহঃ সকাল ৯:৩০ - বিকাল ৩:৩০',
    bio: initialData?.bio || 'নেক্সটজেন একাডেমির অভিজ্ঞ ও নিবেদিতপ্রাণ শিক্ষক।',
    showPhone: initialData?.showPhone ?? initialData?.isPhoneVisible ?? true,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    try {
      // ডেটা সেভ করার এপিআই কল
      const response = await fetch('/api/teacher/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(localStorage.getItem('token') ? { 'Authorization': `Bearer ${localStorage.getItem('token')}` } : {})
        },
        body: JSON.stringify(formData),
      });

      const resData = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(resData?.error?.message || 'সার্ভারে ডেটা সংরক্ষণ করতে সমস্যা হয়েছে।');
      }

      setMessage({ type: 'success', text: resData.message || 'শিক্ষক তথ্য সফলভাবে সংরক্ষিত হয়েছে!' });
      alert(resData.message || 'শিক্ষক তথ্য সফলভাবে সংরক্ষিত হয়েছে!');

      if (onSaveSuccess) {
        onSaveSuccess(resData.data);
      }
    } catch (error) {
      console.error('Save error:', error);
      setMessage({ type: 'error', text: error.message || 'ডেটা সংরক্ষণ করতে সমস্যা হয়েছে।' });
      alert(error.message || 'ডেটা সংরক্ষণ করতে সমস্যা হয়েছে।');
    } finally {
      // আবশ্যিকভাবে লোডিং স্টেট বন্ধ করা হবে যাতে বাটন আর ঝুলে না থাকে
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto text-slate-100 bg-slate-900 min-h-screen rounded-2xl shadow-xl border border-slate-800">
      <div className="flex justify-between items-center mb-6 border-b border-slate-700 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <span>👨‍🏫</span> শিক্ষক প্রোফাইল ও তথ্য ব্যবস্থাপনা
          </h2>
          <p className="text-xs text-slate-400 mt-1">শিক্ষকের ব্যক্তিগত বিবরণ, শিক্ষাগত যোগ্যতা ও কনসালটেশন শিডিউল আপডেট করুন</p>
        </div>
      </div>
      
      {message && (
        <div className={`p-4 mb-4 rounded-xl text-sm flex items-center justify-between ${message.type === 'success' ? 'bg-emerald-900/50 text-emerald-300 border border-emerald-700' : 'bg-red-900/50 text-red-300 border border-red-700'}`}>
          <span>{message.text}</span>
          <button onClick={() => setMessage(null)} className="font-bold text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-slate-800/80 p-6 rounded-2xl border border-slate-700">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">শিক্ষকের পুরো নাম</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="যেমন: মো: আলমগীর হোসেন (সাগর)"
              className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">ইমেইল ঠিকানা</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="teacher@nextgen.edu.bd"
              className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">নতুন পাসওয়ার্ড (পরিবর্তন করতে চাইলে লিখুন)</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="পাসওয়ার্ড অপরিবর্তিত রাখতে ফাঁকা রাখুন"
            className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">শিক্ষাগত যোগ্যতা (Educational Background)</label>
          <input
            type="text"
            name="education"
            value={formData.education}
            onChange={handleChange}
            placeholder="যেমন: বি.এসসি (অনার্স), এম.এসসি - ঢাকা বিশ্ববিদ্যালয়"
            className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">শিক্ষক মিলনয়তন / রুম নং</label>
          <input
            type="text"
            name="roomNo"
            value={formData.roomNo}
            onChange={handleChange}
            placeholder="যেমন: শিক্ষক মিলনয়তন (কক্ষ ২০৪)"
            className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">কনসালটেশন সময়সূচি</label>
          <input
            type="text"
            name="schedule"
            value={formData.schedule}
            onChange={handleChange}
            placeholder="যেমন: রবি - বৃহঃ সকাল ৯:৩০ - বিকাল ৩:৩০"
            className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">সংক্ষিপ্ত পরিচিতি ও বায়ো (Bio)</label>
          <textarea
            name="bio"
            rows="3"
            value={formData.bio}
            onChange={handleChange}
            placeholder="শিক্ষকের সংক্ষিপ্ত অভিজ্ঞতা ও পরিচয়..."
            className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="showPhone"
            id="showPhone"
            checked={formData.showPhone}
            onChange={handleChange}
            className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-emerald-600 focus:ring-emerald-500"
          />
          <label htmlFor="showPhone" className="text-sm text-slate-300 cursor-pointer select-none">ফোন নম্বর ডিরেক্টরিতে দৃশ্যমান রাখুন</label>
        </div>

        <div className="flex justify-end gap-4 pt-4 border-t border-slate-700">
          <button
            type="button"
            onClick={() => setMessage(null)}
            className="px-5 py-2.5 rounded-xl border border-slate-600 text-slate-300 hover:bg-slate-700 transition active:scale-95"
          >
            বাতিল
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition shadow-lg shadow-emerald-600/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? 'সংরক্ষণ হচ্ছে...' : 'সংরক্ষণ করুন'}
          </button>
        </div>
      </form>
    </div>
  );
}
