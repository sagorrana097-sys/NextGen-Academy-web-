import React, { useState, useMemo } from 'react';
import {
  Film,
  Sparkles,
  BookOpen,
  Search,
  SlidersHorizontal,
  Play,
  Share2,
  Facebook,
  Award,
  TrendingUp,
  Eye,
  Clock,
  Layers,
  ChevronRight,
  Flame
} from 'lucide-react';
import VideoCard, { CATEGORY_CONFIG } from './VideoCard';
import FacebookPageWidget from './FacebookPageWidget';
import VideoModalPlayer from './VideoModalPlayer';

const DEFAULT_VIDEOS = [
  // 1. Cinematic Promotional Videos
  {
    id: 'promo-1',
    titleBn: 'NextGen Academy — ২০২৬ শিক্ষাবর্ষে আপনার সন্তানের উজ্জ্বল ভবিষ্যতের প্রতিশ্রুতি',
    titleEn: 'NextGen Academy Campus Tour & Vision 2026',
    category: 'PROMO',
    duration: '০৩:৪৫',
    views: '৪.৫K',
    date: '১ দিন আগে',
    facebookUrl: 'https://www.facebook.com/NextGenAcademyBD/videos/10158492049182',
    isFacebookNative: true,
    thumbnailUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80',
    description: 'আধুনিক স্মার্ট ক্লাসরুম, অভিজ্ঞ শিক্ষক মণ্ডলী এবং ডিজিটাল লার্নিংয়ের সমন্বয়ে NextGen Academy-র পথচলা। গাজীপুর বাস-স্ট্যান্ড ক্যাম্পাসের এক্সক্লুসিভ ট্যুর।',
    featured: true
  },
  {
    id: 'promo-2',
    titleBn: 'সফলতার গল্প — কিভাবে গণিত ও বিজ্ঞানে ৯০%+ নম্বর অর্জন করবেন?',
    titleEn: 'Success Stories of NextGen High Achievers',
    category: 'PROMO',
    duration: '০৫:১২',
    views: '৩.৮K',
    date: '৩ দিন আগে',
    facebookUrl: 'https://www.facebook.com/NextGenAcademyBD/videos/10158492049183',
    isFacebookNative: true,
    thumbnailUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
    description: 'শিক্ষক মো: আলমগীর হোসেন (সাগর) স্যারের বিশেষ দিকনির্দেশনায় গত বছরের বোর্ড পরীক্ষায় সেরা ফলাফলকারী শিক্ষার্থীদের অভিজ্ঞতা ও অনুপ্রেরণামূলক বক্তব্য।'
  },
  {
    id: 'promo-3',
    titleBn: 'কেন NextGen Academy আলাদা? স্মার্ট স্টুডেন্ট পোর্টাল ও AI ডাউট সলভার',
    titleEn: 'Why NextGen Academy is Different',
    category: 'PROMO',
    duration: '০২:৩০',
    views: '৫.১K',
    date: '১ সপ্তাহ আগে',
    facebookUrl: 'https://www.facebook.com/NextGenAcademyBD/videos/10158492049184',
    isFacebookNative: true,
    thumbnailUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
    description: '২৪/৭ এআই শিক্ষক, ওএমআর অটোমেশন এবং লাইভ ক্লাসের আধুনিক সমন্বয়ে পরিচালিত অনন্য শিক্ষা পদ্ধতি।'
  },

  // 2. Guidelines & Tips
  {
    id: 'tips-1',
    titleBn: 'পরীক্ষার আগের রাতে রিভিশন ও টাইম ম্যানেজমেন্টের সেরা ৫টি টেকনিক',
    titleEn: 'Top 5 Exam Time Management Techniques',
    category: 'TIPS',
    duration: '০৮:১৫',
    views: '৬.২K',
    date: '২ দিন আগে',
    facebookUrl: 'https://www.facebook.com/NextGenAcademyBD/videos/10158492049185',
    isFacebookNative: true,
    thumbnailUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80',
    description: 'মো: আলমগীর হোসেন (সাগর) স্যারের লাইভ টিপস: কিভাবে পরীক্ষার হলে ভীতি দূর করবেন এবং সময়ের সঠিক সদ্ব্যবহার করে সম্পূর্ণ উত্তর লিখবেন।'
  },
  {
    id: 'tips-2',
    titleBn: 'পদার্থবিজ্ঞান ও রসায়নের জটিল সূত্র সহজে মনে রাখার ম্যাজিক ট্রিকস',
    titleEn: 'Science Formulas Memorization Tricks',
    category: 'TIPS',
    duration: '০৭:৪০',
    views: '২.৯K',
    date: '৫ দিন আগে',
    facebookUrl: 'https://www.facebook.com/NextGenAcademyBD/videos/10158492049186',
    isFacebookNative: true,
    thumbnailUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80',
    description: 'বিজ্ঞানের দুর্বোধ্য সমীকরণ ও সূত্রগুলো মনের খাতায় স্থায়ীভাবে গেঁথে নেওয়ার বৈজ্ঞানিক কৌশল।'
  },
  {
    id: 'tips-3',
    titleBn: 'দৈনিক পড়ার রুটিন তৈরি ও স্টাডি স্ট্রিক ধরে রাখার সহজ উপায়',
    titleEn: 'Daily Study Habit & Streak Builder',
    category: 'TIPS',
    duration: '০৬:০০',
    views: '১.৮K',
    date: '১ সপ্তাহ আগে',
    facebookUrl: 'https://www.facebook.com/NextGenAcademyBD/videos/10158492049187',
    isFacebookNative: true,
    thumbnailUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80',
    description: 'পড়ালেখায় মনোযোগ ধরে রাখতে এবং প্রতিদিনের টার্গেট পূরণ করতে একটি কার্যকর ডেইলি রুটিন তৈরির গাইডলাইন।'
  },

  // 3. Recorded Classes
  {
    id: 'recorded-1',
    titleBn: '৯ম-১০ম শ্রেণি পদার্থবিজ্ঞান — অধ্যায় ৪: কাজ, ক্ষমতা ও শক্তি (সম্পূর্ণ ব্যাখ্যা)',
    titleEn: 'Class 9-10 Physics: Work, Power & Energy',
    category: 'RECORDED',
    duration: '৪৫:২০',
    views: '৮.৭K',
    date: '৩ দিন আগে',
    facebookUrl: 'https://www.facebook.com/NextGenAcademyBD/videos/10158492049188',
    isFacebookNative: true,
    thumbnailUrl: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?auto=format&fit=crop&w=800&q=80',
    description: 'বোর্ড প্রশ্ন বিশ্লেষণ এবং গাণিতিক সমস্যার সমাধান সহ সম্পূর্ণ অধ্যায়ের বিস্তারিত লেকচার।'
  },
  {
    id: 'recorded-2',
    titleBn: 'উচ্চতর গণিত — ত্রিকোণমিতিক অনুপাত ও অভেদাবলি (শর্টকাট মেথড)',
    titleEn: 'Higher Math: Trigonometric Identities',
    category: 'RECORDED',
    duration: '৩৮:১০',
    views: '৪.৩K',
    date: '৬ দিন আগে',
    facebookUrl: 'https://www.facebook.com/NextGenAcademyBD/videos/10158492049189',
    isFacebookNative: true,
    thumbnailUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=800&q=80',
    description: 'ত্রিকোণমিতির সৃজনশীল ও নৈর্ব্যক্তিক প্রশ্নের দ্রুত সমাধান কৌশল।'
  },
  {
    id: 'recorded-3',
    titleBn: '৮ম শ্রেণি সাধারণ বিজ্ঞান — অম্ল, ক্ষারক ও নির্দেশক (প্র্যাকটিক্যাল ডেমো)',
    titleEn: 'Class 8 Science: Acids, Bases & Indicators',
    category: 'RECORDED',
    duration: '৩২:৪৫',
    views: '৩.১K',
    date: '২ সপ্তাহ আগে',
    facebookUrl: 'https://www.facebook.com/NextGenAcademyBD/videos/10158492049190',
    isFacebookNative: true,
    thumbnailUrl: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=800&q=80',
    description: 'ল্যাবরেটরি পরীক্ষার ভিডিও প্রদর্শনীর মাধ্যমে সহজ ভাষায় বিজ্ঞান শিক্ষা।'
  }
];

export default function MediaCenter({ studentProfile }) {
  const [activeCategory, setActiveCategory] = useState('ALL'); // 'ALL' | 'PROMO' | 'TIPS' | 'RECORDED'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVideo, setSelectedVideo] = useState(null);

  // Filtered video collection
  const filteredVideos = useMemo(() => {
    return DEFAULT_VIDEOS.filter((v) => {
      const matchesCat = activeCategory === 'ALL' || v.category === activeCategory;
      const matchesSearch =
        searchQuery.trim() === '' ||
        (v.titleBn && v.titleBn.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (v.titleEn && v.titleEn.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (v.description && v.description.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCat && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const featuredVideo = DEFAULT_VIDEOS.find((v) => v.featured) || DEFAULT_VIDEOS[0];

  return (
    <div className="space-y-8 text-slate-100">
      {/* 1. Hero Spotlight Banner (Cinematic Style) */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950/40 border border-slate-800 shadow-2xl p-6 sm:p-10">
        <div className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-luminosity filter blur-[1px]" style={{ backgroundImage: `url(${featuredVideo.thumbnailUrl})` }} />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="px-3.5 py-1 rounded-full bg-amber-500 text-slate-950 text-xs font-black tracking-wider uppercase flex items-center gap-1.5 shadow-lg shadow-amber-500/20">
              <Flame className="w-3.5 h-3.5 fill-slate-950" />
              ফিচার্ড ভিডিও
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-xs text-amber-300 font-bold backdrop-blur-md">
              NextGen Academy Exclusive
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight tracking-tight drop-shadow-md">
            {featuredVideo.titleBn}
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
            {featuredVideo.description}
          </p>

          {/* Instructor & CTA Actions */}
          <div className="pt-2 flex flex-wrap items-center gap-4">
            <button
              onClick={() => setSelectedVideo(featuredVideo)}
              className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/25 transition-all transform hover:scale-105"
            >
              <Play className="w-5 h-5 fill-slate-950" />
              এখনই প্লে করুন
            </button>

            <a
              href="https://www.facebook.com/NextGenAcademyBD"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition-all"
            >
              <Facebook className="w-4 h-4 fill-white" />
              ফেসবুক পেজে ফলো করুন
            </a>
          </div>
        </div>
      </div>

      {/* 2. Top Facebook Follow & Connect Banner */}
      <FacebookPageWidget variant="banner" />

      {/* 3. Search & Category Filters Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-4 rounded-2xl backdrop-blur-md">
        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <button
            onClick={() => setActiveCategory('ALL')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeCategory === 'ALL'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            সকল ভিডিও ({DEFAULT_VIDEOS.length})
          </button>

          {Object.values(CATEGORY_CONFIG).map((cat) => {
            const Icon = cat.icon;
            const count = DEFAULT_VIDEOS.filter((v) => v.category === cat.key).length;
            const isSelected = activeCategory === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap border ${
                  isSelected
                    ? 'bg-slate-800 border-amber-400 text-amber-300 shadow-md'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {cat.nameBn} ({count})
              </button>
            );
          })}
        </div>

        {/* Search Bar */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ভিডিও বা টপিক খুঁজুন..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
          />
        </div>
      </div>

      {/* 4. Video Grid with Netflix/YouTube Style Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Video Stream List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-white flex items-center gap-2">
              <Film className="w-5 h-5 text-amber-400" />
              {activeCategory === 'ALL'
                ? 'সর্বশেষ ভিডিও গ্যালারি'
                : CATEGORY_CONFIG[activeCategory]?.nameBn}
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 font-bold">
                {filteredVideos.length}টি কনটেন্ট
              </span>
            </h3>
          </div>

          {filteredVideos.length === 0 ? (
            <div className="text-center py-16 bg-slate-900/50 rounded-2xl border border-slate-800 p-8 space-y-3">
              <Film className="w-12 h-12 text-slate-600 mx-auto" />
              <h4 className="font-bold text-slate-300">কোনো ভিডিও পাওয়া যায়নি</h4>
              <p className="text-xs text-slate-500">অন্য কোনো কি-ওয়ার্ড দিয়ে সার্চ করুন অথবা ফিল্টার পরিবর্তন করুন।</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {filteredVideos.map((video) => (
                <VideoCard
                  key={video.id}
                  video={video}
                  onPlay={(v) => setSelectedVideo(v)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right Sidebar: Connect with Us & Academy Highlights */}
        <div className="space-y-6">
          <FacebookPageWidget variant="card" />

          {/* Academy Contact & Location Card */}
          <div className="bg-gradient-to-br from-amber-500/10 via-slate-900 to-slate-950 rounded-2xl border border-amber-500/20 p-5 space-y-3 shadow-lg">
            <div className="flex items-center gap-2 text-amber-400 font-black text-sm">
              <Award className="w-4 h-4" />
              NextGen Academy
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              সরাসরি যোগাযোগ ও ক্লাসের বিস্তারিত জানতে আমাদের গাজীপুর হেড অফিসে যোগাযোগ করুন।
            </p>
            <div className="space-y-1.5 text-xs text-slate-300 pt-1">
              <p>👨‍🏫 <strong>শিক্ষক:</strong> মো: আলমগীর হোসেন (সাগর)</p>
              <p>📞 <strong>হটলাইন:</strong> ০১৭৯২৮১৮০০৫</p>
              <p>📍 <strong>ঠিকানা:</strong> পশ্চিম জয়দেবপুর, বাস-স্ট্যান্ড, গাজীপুর</p>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Modal Video Player */}
      {selectedVideo && (
        <VideoModalPlayer
          video={selectedVideo}
          onClose={() => setSelectedVideo(null)}
        />
      )}
    </div>
  );
}
