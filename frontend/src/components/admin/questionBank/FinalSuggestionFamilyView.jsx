import React, { useState, useEffect, useCallback } from 'react';
import {
  Sparkles,
  Layers,
  Search,
  Filter,
  RefreshCw,
  ExternalLink,
  BookOpen,
  Calendar,
  CheckCircle2,
  HelpCircle,
  Eye,
  Award,
  Flame,
  ArrowRight
} from 'lucide-react';
import api from '../../../services/api';
import { DEFAULT_SUGGESTION_FAMILIES } from '../../../data/questionBankDefaultData';

export default function FinalSuggestionFamilyView() {
  const [families, setFamilies] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [minRepeats, setMinRepeats] = useState('1');
  const [search, setSearch] = useState('');
  const [selectedFamily, setSelectedFamily] = useState(null);

  const fetchFamilies = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/questions/final-suggestions', {
        params: { minRepeats, search }
      });
      if (res.data?.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
        setFamilies(res.data.data);
        setTotalCount(res.data.total || res.data.data.length);
        setLoading(false);
        return;
      }
    } catch (err) {
      console.warn('Fetch suggestion families API notice, using built-in vault:', err?.message);
    }

    let list = Array.isArray(DEFAULT_SUGGESTION_FAMILIES) ? [...DEFAULT_SUGGESTION_FAMILIES] : [];
    if (minRepeats) {
      const min = Number(minRepeats) || 1;
      list = list.filter(f => (f.repeatedCount || 1) >= min);
    }
    if (search) {
      const s = search.toLowerCase();
      list = list.filter(f => 
        (f.familyCode && f.familyCode.toLowerCase().includes(s)) ||
        (f.baseQuestionText && f.baseQuestionText.toLowerCase().includes(s)) ||
        (f.chapter && f.chapter.toLowerCase().includes(s))
      );
    }

    setFamilies(list);
    setTotalCount(list.length);
    setLoading(false);
  }, [minRepeats, search]);

  useEffect(() => {
    fetchFamilies();
  }, [fetchFamilies]);

  return (
    <div className="space-y-6">
      {/* 1. HEADER */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/20 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-indigo-400 font-bold text-xs uppercase tracking-wider mb-1">
            <Flame className="w-4 h-4 text-amber-400" />
            <span>Multi-Board Cross-Year Suggestion Engine</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white">
            Final Suggestion & Repeated Question Families
          </h2>
          <p className="text-slate-400 text-xs md:text-sm mt-1">
            বিভিন্ন শিক্ষা বোর্ড ও সালের পরীক্ষায় বারবার আসা গুরুত্বপূর্ণ প্রশ্নগুলো স্বয়ংক্রিয়ভাবে শনাক্ত ও ফ্যামিলি গ্রুপ হিসেবে সংরক্ষিত রয়েছে।
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <div className="px-4 py-2 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 text-xs font-bold flex items-center space-x-2">
            <Award className="w-4 h-4 text-amber-400" />
            <span>মোট {totalCount}টি সাজেশন ফ্যামিলি</span>
          </div>
        </div>
      </div>

      {/* 2. FILTER & SEARCH */}
      <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center gap-3 text-xs shadow-xl">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="ফ্যামিলি কোড (#NG-000...), প্রশ্নের বক্তব্য বা বোর্ড দিয়ে সার্চ করুন..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <select
            value={minRepeats}
            onChange={(e) => setMinRepeats(e.target.value)}
            className="px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 focus:outline-none w-full sm:w-auto"
          >
            <option value="1">সকল ফ্যামিলি (১+ বোর্ড)</option>
            <option value="2">২ বা ততোধিক বোর্ডে আসা প্রশ্ন (২+ বার)</option>
            <option value="3">৩ বা ততোধিক বোর্ডে আসা প্রশ্ন (৩+ বার)</option>
            <option value="4">৪ বা ততোধিক বোর্ডে আসা প্রশ্ন (৪+ বার)</option>
          </select>

          <button
            type="button"
            onClick={fetchFamilies}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition shrink-0"
            title="রিফ্রেশ"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* 3. FAMILIES LIST */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-16 text-center text-slate-400 space-y-3">
            <RefreshCw className="w-8 h-8 mx-auto animate-spin text-indigo-400" />
            <p className="text-xs">সাজেশন ফ্যামিলি লোড হচ্ছে...</p>
          </div>
        ) : families.length === 0 ? (
          <div className="p-16 text-center text-slate-500 bg-slate-900 border border-slate-800 rounded-3xl space-y-3">
            <HelpCircle className="w-10 h-10 mx-auto text-slate-600" />
            <p className="text-sm font-semibold text-slate-400">কোনো সাজেশন ফ্যামিলি পাওয়া যায়নি</p>
            <p className="text-xs text-slate-600">একাধিক বোর্ডের প্রশ্ন আপলোড করলে স্বয়ংক্রিয়ভাবে রিপিটেড ফ্যামিলি তৈরি হবে।</p>
          </div>
        ) : (
          families.map((fam) => {
            const sources = Array.isArray(fam.boardYearSources) ? fam.boardYearSources : [];
            const isHighPriority = sources.length >= 3;

            return (
              <div
                key={fam.id}
                className="p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition space-y-4 shadow-xl"
              >
                {/* HEADER */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center space-x-2.5">
                    <span className="px-3 py-1 rounded-xl bg-indigo-600/20 text-indigo-400 font-mono font-black text-xs">
                      {fam.familyCode || `#NG-${String(fam.id).padStart(6, '0')}`}
                    </span>
                    <span className={`px-3 py-1 rounded-xl font-bold text-xs flex items-center space-x-1.5 ${
                      isHighPriority
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-emerald-500/20 text-emerald-300'
                    }`}>
                      <Flame className="w-3.5 h-3.5" />
                      <span>{sources.length}টি বোর্ড/সালের পরীক্ষায় পুনরাবৃত্তি</span>
                    </span>
                  </div>

                  {fam.chapter && (
                    <span className="text-xs text-slate-400 font-medium">
                      {fam.chapter}
                    </span>
                  )}
                </div>

                {/* CANONICAL QUESTION TEXT */}
                <div className="text-sm font-bold text-white leading-relaxed font-sans">
                  {fam.baseQuestionText}
                </div>

                {/* BOARD & YEAR SOURCES BADGES */}
                <div className="space-y-2 pt-2 border-t border-slate-800/80">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    প্রশ্নের উৎস ও পুনরাবৃত্তির রেকর্ড (All Source References Preserved):
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {sources.map((src, sIdx) => (
                      <div
                        key={sIdx}
                        className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs flex items-center space-x-2 text-slate-300"
                      >
                        <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                        <span className="font-bold text-cyan-300">{src.board} বোর্ড</span>
                        <span className="text-slate-500 font-mono">'{String(src.year).slice(-2)}</span>
                        {src.sourceFileName && (
                          <span className="text-[10px] text-slate-500 max-w-[120px] truncate">({src.sourceFileName})</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
