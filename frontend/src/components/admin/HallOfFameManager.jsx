import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { achieverAPI } from '../../services/api';
import UniversalFileUploader from '../common/UniversalFileUploader';
import {
  Trophy,
  Award,
  Sparkles,
  Plus,
  Edit3,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Search,
  Filter,
  GraduationCap,
  Medal,
  Quote,
  Eye,
  Check,
  X,
  RefreshCw,
  Image as ImageIcon
} from 'lucide-react';

export default function HallOfFameManager() {
  const { lang } = useLanguage();
  const [achievers, setAchievers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const initialForm = {
    nameBn: '',
    nameEn: '',
    studentPhoto: '',
    examType: 'HSC',
    examYear: '২০২৫',
    gpa: 'GPA 5.00 (Golden A+)',
    institute: 'ঢাকা নটর ডেম কলেজ',
    badge: '🏆 ১ম স্থান (বোর্ড মেধা)',
    quoteBn: 'নেক্সটজেন একাডেমির মানসম্মত অনলাইন লাইভ ক্লাস ও নিয়মিত মডেল টেস্ট আমার বোর্ড পরীক্ষায় গোল্ডেন এ+ অর্জনে সবচেয়ে বড় ভূমিকা রেখেছে।',
    order: 1,
    isActive: true
  };

  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    fetchAchievers();
  }, []);

  const fetchAchievers = async () => {
    setLoading(true);
    try {
      const res = await achieverAPI.getAll();
      if (res.success && res.data) {
        setAchievers(res.data);
      }
    } catch (err) {
      console.error('Failed to load achievers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    setEditingId(null);
    setFormData({
      ...initialForm,
      order: achievers.length + 1
    });
    setFeedback(null);
    setShowModal(true);
  };

  const handleOpenEditModal = (item) => {
    setEditingId(item.id);
    setFormData({
      nameBn: item.nameBn || '',
      nameEn: item.nameEn || '',
      studentPhoto: item.studentPhoto || '',
      examType: item.examType || 'HSC',
      examYear: item.examYear || '২০২৫',
      gpa: item.gpa || '',
      institute: item.institute || '',
      badge: item.badge || '',
      quoteBn: item.quoteBn || '',
      order: item.order || 1,
      isActive: item.isActive !== false
    });
    setFeedback(null);
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.nameBn || !formData.gpa) {
      setFeedback({ type: 'error', message: 'শিক্ষার্থীর নাম ও জিপিএ/স্কোর আবশ্যক!' });
      return;
    }

    setSaving(true);
    setFeedback(null);
    try {
      if (editingId) {
        const res = await achieverAPI.update(editingId, formData);
        if (res.success) {
          setShowModal(false);
          fetchAchievers();
        } else {
          setFeedback({ type: 'error', message: res.error?.message || 'আপডেট করতে সমস্যা হয়েছে' });
        }
      } else {
        const res = await achieverAPI.create(formData);
        if (res.success) {
          setShowModal(false);
          fetchAchievers();
        } else {
          setFeedback({ type: 'error', message: res.error?.message || 'সংরক্ষণ করতে সমস্যা হয়েছে' });
        }
      }
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'নেটওয়ার্ক এরর' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`আপনি কি নিশ্চিত যে "${name}"-কে হল অফ ফেম থেকে মুছে ফেলতে চান?`)) {
      return;
    }
    try {
      const res = await achieverAPI.delete(id);
      if (res.success) {
        setAchievers((prev) => prev.filter((a) => a.id !== id));
      }
    } catch (err) {
      alert(err.message || 'মুছে ফেলতে সমস্যা হয়েছে');
    }
  };

  const filteredAchievers = achievers.filter((a) => {
    const matchesFilter = filterType === 'ALL' || a.examType === filterType;
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      (a.nameBn && a.nameBn.toLowerCase().includes(query)) ||
      (a.nameEn && a.nameEn.toLowerCase().includes(query)) ||
      (a.institute && a.institute.toLowerCase().includes(query));
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Action Bar & Summary */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            <span>টপ স্কোরার ও হল অফ ফেম ম্যানেজমেন্ট</span>
          </h3>
          <p className="text-xs text-slate-500">
            ওয়েবসাইটের পাবলিক ল্যান্ডিং পেইজ ও রেজাল্ট দেয়ালে প্রদর্শনের জন্য কৃতি শিক্ষার্থীদের প্রোফাইল পরিচালনা করুন
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreateModal}
          className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center space-x-2 self-start md:self-auto transform active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>+ নতুন কৃতি শিক্ষার্থী যোগ করুন</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {['ALL', 'HSC', 'SSC', 'মডেল টেস্ট'].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterType === type
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {type === 'ALL' ? 'সকল পরীক্ষা' : type}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="নাম বা কলেজের নাম দিয়ে খুঁজুন..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Achievers Grid */}
      {loading ? (
        <div className="p-12 text-center text-slate-400">
          <RefreshCw className="w-8 h-8 text-amber-500 animate-spin mx-auto mb-2" />
          <p className="text-xs font-bold">তালিকা লোড হচ্ছে...</p>
        </div>
      ) : filteredAchievers.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-slate-200">
          <Award className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <h4 className="font-bold text-sm text-slate-700">কোনো কৃতি শিক্ষার্থীর তথ্য পাওয়া যায়নি</h4>
          <p className="text-xs text-slate-400 mt-1">উপরের বাটনে ক্লিক করে নতুন শিক্ষার্থী যোগ করুন</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredAchievers.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center space-x-3">
                    <img
                      src={
                        item.studentPhoto ||
                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'
                      }
                      alt={item.nameBn}
                      className="w-14 h-14 rounded-2xl object-cover ring-2 ring-amber-400/50 shadow"
                    />
                    <div>
                      <h4 className="font-black text-sm text-slate-900">{item.nameBn}</h4>
                      <p className="text-[11px] text-slate-500 font-medium">{item.institute}</p>
                      <span className="inline-block mt-0.5 px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 text-[10px] font-bold border border-amber-200">
                        {item.examType} • {item.examYear}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      item.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {item.isActive ? 'সক্রিয়' : 'লুকানো'}
                  </span>
                </div>

                <div className="p-3 bg-amber-50/60 rounded-2xl border border-amber-200/60 space-y-1">
                  <span className="text-[10px] font-bold text-amber-700 block">{item.badge}</span>
                  <div className="text-xs font-black text-slate-900">{item.gpa}</div>
                </div>

                {item.quoteBn && (
                  <p className="text-xs text-slate-600 italic line-clamp-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    "{item.quoteBn}"
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-mono">ক্রম: #{item.order}</span>
                <div className="flex items-center space-x-1.5">
                  <button
                    type="button"
                    onClick={() => handleOpenEditModal(item)}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center space-x-1"
                    title="সম্পাদনা করুন"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>এডিট</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id, item.nameBn)}
                    className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition-all"
                    title="মুছে ফেলুন"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Achiever Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 my-8 max-h-[92vh] overflow-y-auto border border-slate-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-amber-50 text-amber-700">
                  <Trophy className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    {editingId ? 'কৃতি শিক্ষার্থীর তথ্য সম্পাদনা' : 'নতুন কৃতি শিক্ষার্থী যোগ করুন'}
                  </h3>
                  <p className="text-[11px] text-slate-500">হল অফ ফেম ও ফলাফল দেয়ালে প্রদর্শিত হবে</p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {feedback && (
              <div
                className={`p-3 rounded-2xl text-xs font-bold flex items-center space-x-2 ${
                  feedback.type === 'error'
                    ? 'bg-rose-50 border border-rose-200 text-rose-800'
                    : 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                }`}
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{feedback.message}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4 text-xs font-medium">
              {/* Photo Upload with UniversalFileUploader */}
              <div className="space-y-1.5">
                <label className="block font-bold text-slate-700">শিক্ষার্থীর ছবি (Student Photo):</label>
                <UniversalFileUploader
                  label="ছবি আপলোড অথবা ওয়েব লিংক দিন"
                  accept="image/*,.jpg,.jpeg,.png"
                  maxSizeMB={5}
                  value={formData.studentPhoto}
                  onChange={(output) => {
                    const photoUrl = typeof output === 'string' ? output : output?.url || '';
                    setFormData((prev) => ({ ...prev, studentPhoto: photoUrl }));
                  }}
                />
              </div>

              {/* Name bn & en */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block font-bold text-slate-700">শিক্ষার্থীর পূর্ণ নাম (বাংলা) *</label>
                  <input
                    type="text"
                    required
                    value={formData.nameBn}
                    onChange={(e) => setFormData({ ...formData, nameBn: e.target.value })}
                    placeholder="যেমন: সামিরুল ইসলাম"
                    className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-bold text-slate-900"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block font-bold text-slate-700">নাম (English)</label>
                  <input
                    type="text"
                    value={formData.nameEn}
                    onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                    placeholder="e.g. Samirul Islam"
                    className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-800"
                  />
                </div>
              </div>

              {/* Exam type & year */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block font-bold text-slate-700">পরীক্ষার ধরন</label>
                  <select
                    value={formData.examType}
                    onChange={(e) => setFormData({ ...formData, examType: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-bold"
                  >
                    <option value="HSC">HSC বোর্ড পরীক্ষা</option>
                    <option value="SSC">SSC বোর্ড পরীক্ষা</option>
                    <option value="JSC">JSC পরীক্ষা</option>
                    <option value="মডেল টেস্ট">অনলাইন মডেল টেস্ট</option>
                    <option value="বিশ্ববিদ্যালয় ভর্তি">ভার্সিটি ভর্তি পরীক্ষা</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block font-bold text-slate-700">পরীক্ষার সাল/সেশন</label>
                  <input
                    type="text"
                    value={formData.examYear}
                    onChange={(e) => setFormData({ ...formData, examYear: e.target.value })}
                    placeholder="যেমন: ২০২৫"
                    className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-800"
                  />
                </div>
              </div>

              {/* GPA & Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block font-bold text-slate-700">প্রাপ্ত GPA / স্কোর *</label>
                  <input
                    type="text"
                    required
                    value={formData.gpa}
                    onChange={(e) => setFormData({ ...formData, gpa: e.target.value })}
                    placeholder="যেমন: GPA 5.00 (Golden A+)"
                    className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-bold text-emerald-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-bold text-slate-700">মেধা সম্মাননা / ব্যাজ</label>
                  <input
                    type="text"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    placeholder="যেমন: 🏆 ১ম স্থান (বোর্ড মেধা)"
                    className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-800"
                  />
                </div>
              </div>

              {/* College / Institute */}
              <div className="space-y-1">
                <label className="block font-bold text-slate-700">কলেজ / স্কুল / বর্তমান প্রতিষ্ঠান</label>
                <input
                  type="text"
                  value={formData.institute}
                  onChange={(e) => setFormData({ ...formData, institute: e.target.value })}
                  placeholder="যেমন: ঢাকা নটর ডেম কলেজ"
                  className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-800"
                />
              </div>

              {/* Inspiring quote */}
              <div className="space-y-1">
                <label className="block font-bold text-slate-700">শিক্ষার্থীর অনুপ্রেরণামূলক মন্তব্য / রিভিউ</label>
                <textarea
                  rows="3"
                  value={formData.quoteBn}
                  onChange={(e) => setFormData({ ...formData, quoteBn: e.target.value })}
                  placeholder="নেক্সটজেন একাডেমিতে পড়ার অভিজ্ঞতা ও সাফল্যের পেছনের কারণ..."
                  className="w-full p-3 bg-slate-50 rounded-xl border border-slate-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-800"
                ></textarea>
              </div>

              {/* Order & Status */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="space-y-1">
                  <label className="block font-bold text-slate-700">প্রদর্শন ক্রম (Order)</label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div className="space-y-1 flex flex-col justify-end">
                  <label className="flex items-center space-x-2 cursor-pointer pb-2">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-slate-300"
                    />
                    <span className="font-bold text-slate-700">ওয়েবসাইটে দৃশ্যমান রাখুন</span>
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black rounded-xl text-xs shadow-md shadow-amber-500/25 flex items-center space-x-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>{saving ? 'সংরক্ষণ হচ্ছে...' : editingId ? 'আপডেট সম্পন্ন করুন' : 'সংরক্ষণ করুন'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
