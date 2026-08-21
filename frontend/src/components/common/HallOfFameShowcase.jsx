import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { achieverAPI } from '../../services/api';
import {
  Trophy,
  Award,
  Sparkles,
  GraduationCap,
  Star,
  Quote,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Filter,
  Medal,
  RefreshCw
} from 'lucide-react';

export default function HallOfFameShowcase({ title, subtitle, maxItems }) {
  const { lang } = useLanguage();
  const [achievers, setAchievers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('ALL'); // 'ALL' | 'HSC' | 'SSC' | 'মডেল টেস্ট'

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

  const filterOptions = [
    { id: 'ALL', labelBn: '🌟 সকল কৃতি শিক্ষার্থী', labelEn: 'All Top Achievers' },
    { id: 'HSC', labelBn: '🎓 HSC বোর্ড টপার', labelEn: 'HSC Board Toppers' },
    { id: 'SSC', labelBn: '🥇 SSC গোল্ডেন A+', labelEn: 'SSC Golden A+' },
    { id: 'মডেল টেস্ট', labelBn: '🎯 মডেল টেস্ট চ্যাম্পিয়ন', labelEn: 'Model Test Champions' }
  ];

  const filteredAchievers = achievers.filter((a) => {
    if (selectedFilter === 'ALL') return true;
    return a.examType === selectedFilter;
  });

  const displayedList = maxItems ? filteredAchievers.slice(0, maxItems) : filteredAchievers;

  return (
    <section className="py-8 space-y-6">
      {/* Section Header */}
      <div className="text-center space-y-2 max-w-2xl mx-auto px-4">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-bold shadow-inner">
          <Trophy className="w-4 h-4 text-amber-400" />
          <span>{lang === 'bn' ? 'হল অফ ফেম • সফলতার গল্প' : 'Hall of Fame • Success Stories'}</span>
        </div>

        <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight">
          {title || (lang === 'bn' ? 'নেক্সটজেন একাডেমির কৃতি শিক্ষার্থীদের গৌরবোজ্জ্বল সাফল্য' : 'Our Top Achievers & Proud Stars')}
        </h2>
        <p className="text-xs sm:text-sm text-slate-300">
          {subtitle || (lang === 'bn' ? 'বোর্ড পরীক্ষা ও জাতীয় প্রতিযোগিতায় আমাদের শিক্ষার্থীদের সেরা ফলাফলের গল্প' : 'Inspiring stories of excellence in board exams and model tests')}
        </p>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-3">
          {filterOptions.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setSelectedFilter(f.id)}
              className={`px-3.5 py-1.5 rounded-2xl text-xs font-bold transition-all ${
                selectedFilter === f.id
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-lg shadow-amber-500/20 scale-105'
                  : 'bg-white/10 text-slate-300 hover:bg-white/20 border border-white/10'
              }`}
            >
              {lang === 'bn' ? f.labelBn : f.labelEn}
            </button>
          ))}
        </div>
      </div>

      {/* Achievers Grid */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 space-y-2">
          <RefreshCw className="w-8 h-8 text-amber-400 animate-spin mx-auto" />
          <p className="text-xs font-semibold">কৃতি শিক্ষার্থীদের তালিকা লোড হচ্ছে...</p>
        </div>
      ) : displayedList.length === 0 ? (
        <div className="p-10 text-center bg-white/5 rounded-3xl border border-white/10 text-slate-400 max-w-md mx-auto">
          <Award className="w-10 h-10 text-slate-500 mx-auto mb-2" />
          <p className="text-xs font-bold">এই ক্যাটাগরিতে এখনো কোনো রেকর্ড নেই</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 px-4 sm:px-6">
          {displayedList.map((item) => (
            <div
              key={item.id}
              className="bg-slate-900/90 backdrop-blur-xl rounded-3xl border border-amber-500/30 p-5 shadow-2xl hover:border-amber-400/80 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between relative group overflow-hidden"
            >
              {/* Glowing Corner Aura */}
              <div className="absolute -right-8 -top-8 w-24 h-24 bg-amber-500/10 rounded-full blur-xl group-hover:bg-amber-500/20 transition-all pointer-events-none" />

              {/* Card Top */}
              <div className="space-y-4">
                {/* Photo & Crown Badge */}
                <div className="relative mx-auto w-24 h-24">
                  <div className="w-full h-full rounded-2xl p-1 bg-gradient-to-tr from-amber-400 via-yellow-200 to-amber-500 shadow-xl overflow-hidden">
                    <img
                      src={
                        item.studentPhoto ||
                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'
                      }
                      alt={item.nameBn || item.nameEn}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-1 px-2 py-0.5 rounded-full bg-slate-950 text-amber-400 text-[10px] font-black border border-amber-400/60 shadow flex items-center gap-0.5">
                    <Medal className="w-3 h-3 text-amber-400" />
                    <span>{item.examYear || '২০২৫'}</span>
                  </div>
                </div>

                {/* Name & College */}
                <div className="text-center space-y-1">
                  <h3 className="font-black text-sm text-white leading-tight">
                    {item.nameBn}
                  </h3>
                  <p className="text-[11px] font-medium text-slate-400">
                    {item.institute || 'নেক্সটজেন একাডেমি'}
                  </p>
                </div>

                {/* GPA & Badge Strip */}
                <div className="p-2.5 rounded-2xl bg-gradient-to-r from-amber-500/20 via-yellow-500/10 to-amber-500/20 border border-amber-400/40 text-center space-y-1 shadow-inner">
                  <span className="text-[10px] font-extrabold text-amber-300 uppercase tracking-wider block">
                    {item.badge || '🏆 মেধা তালিকা'}
                  </span>
                  <div className="font-black text-xs text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-white to-amber-300">
                    {item.gpa}
                  </div>
                </div>

                {/* Inspiring Quote */}
                {item.quoteBn && (
                  <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-[11px] text-slate-300 leading-relaxed relative">
                    <Quote className="w-3.5 h-3.5 text-amber-400/40 absolute top-2 right-2" />
                    <p className="line-clamp-3 italic">"{item.quoteBn}"</p>
                  </div>
                )}
              </div>

              {/* Card Footer Tag */}
              <div className="pt-3 mt-3 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
                <span className="font-semibold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>ভেরিফায়েড কৃতি শিক্ষার্থী</span>
                </span>
                <span className="font-mono text-amber-400 font-bold">{item.examType}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
