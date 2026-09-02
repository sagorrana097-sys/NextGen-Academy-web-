import React from 'react';
import {
  Sparkles, Layers, BookOpen, Users, Award, Zap, Clock,
  CheckSquare, BookMarked, Compass, FileText, RefreshCw,
  Volume2, MessageSquare, Flame, ShieldCheck, HelpCircle,
  Tag, Brain, Share2, Type, Globe, Trophy, ChevronRight,
  Search, CheckCircle2, Bookmark
} from 'lucide-react';

const ICON_MAP = {
  Sparkles, Layers, BookOpen, Users, Award, Zap, Clock,
  CheckSquare, BookMarked, Compass, FileText, RefreshCw,
  Volume2, MessageSquare, Flame, ShieldCheck, HelpCircle,
  Tag, Brain, Share2, Type, Globe, Trophy
};

const CATEGORIES = [
  { id: 'ALL', label: 'সকল অধ্যায় (২৩)' },
  { id: 'FOUNDATION', label: 'ভিত্তি ও ব্যাকরণ' },
  { id: 'PARTS_OF_SPEECH', label: 'পার্টস অব স্পিচ' },
  { id: 'VERBS', label: 'ভার্ব ও টেন্স' },
  { id: 'CORE_GRAMMAR', label: 'কোর গ্রামার' },
  { id: 'SENTENCE', label: 'বাক্য ও রূপান্তর' },
  { id: 'ADVANCED_GRAMMAR', label: 'ভয়েস ও ন্যারেশন' },
  { id: 'SSC_SPECIAL', label: 'এসএসসি স্পেশাল' },
  { id: 'VOCABULARY', label: 'শব্দভাণ্ডার' }
];

export default function GrammarChapterNavigator({
  chapters = [],
  selectedCategory,
  setSelectedCategory,
  searchQuery,
  setSearchQuery,
  onSelectChapter,
  completedTopicIds = [],
  bookmarkedTopicIds = []
}) {
  const filteredChapters = chapters.filter(c => {
    const matchesCat = selectedCategory === 'ALL' || c.category === selectedCategory;
    const matchesQuery = !searchQuery ||
      c.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.titleBn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.descriptionBn.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <div className="space-y-6">
      {/* Category Pills & Search */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none text-xs font-bold">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="অধ্যায় বা ব্যাকরণ বিষয় খুঁজুন..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
          />
        </div>
      </div>

      {/* Chapters Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredChapters.map(chapter => {
          const IconComp = ICON_MAP[chapter.icon] || BookOpen;
          return (
            <div
              key={chapter.id}
              onClick={() => onSelectChapter(chapter)}
              className="group bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-xs hover:shadow-xl hover:border-emerald-500/50 transition-all duration-300 cursor-pointer flex flex-col justify-between relative overflow-hidden"
            >
              {/* Top Accent Gradient Bar */}
              <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${chapter.colorGradient}`} />

              <div className="space-y-3 pt-1">
                <div className="flex items-start justify-between gap-2">
                  <div className={`p-3 rounded-2xl bg-gradient-to-br ${chapter.colorGradient} text-white shadow-md shadow-slate-900/10 group-hover:scale-110 transition-transform`}>
                    <IconComp className="w-6 h-6" />
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-mono font-black">
                    অধ্যায় {chapter.chapterNo}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {chapter.titleBn}
                  </h3>
                  <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 font-english mt-0.5">
                    {chapter.titleEn}
                  </h4>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                  {chapter.descriptionBn}
                </p>
              </div>

              <div className="pt-4 mt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400 font-bold text-[11px] flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>{chapter.estimatedTopicsCount}+ টপিক ও রুলস</span>
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 font-black flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>পড়ুন</span>
                  <ChevronRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
