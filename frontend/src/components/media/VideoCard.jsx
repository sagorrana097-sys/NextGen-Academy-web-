import React, { useState } from 'react';
import {
  Play,
  Share2,
  Check,
  Facebook,
  MessageCircle,
  Eye,
  Clock,
  Sparkles,
  Award,
  BookOpen,
  Film,
  ExternalLink,
  Copy
} from 'lucide-react';

const BRAND = {
  academy: 'NextGen Academy',
  instructor: 'মো: আলমগীর হোসেন (সাগর)',
  phone: '০১৭৯২৮১৮০০৫',
  address: 'পশ্চিম জয়দেবপুর, বাস-স্ট্যান্ড, গাজীপুর'
};

export const CATEGORY_CONFIG = {
  PROMO: {
    key: 'PROMO',
    nameBn: 'সিনেমাটিক প্রমোশনাল ভিডিও',
    nameEn: 'Cinematic Promo',
    badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    icon: Film,
    accentColor: '#f43f5e'
  },
  TIPS: {
    key: 'TIPS',
    nameBn: 'দিকনির্দেশনা ও টিপস',
    nameEn: 'Guidelines & Tips',
    badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    icon: Sparkles,
    accentColor: '#f59e0b'
  },
  RECORDED: {
    key: 'RECORDED',
    nameBn: 'রেকর্ডেড ক্লাস',
    nameEn: 'Recorded Class',
    badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    icon: BookOpen,
    accentColor: '#10b981'
  }
};

export default function VideoCard({ video, onPlay }) {
  const [copied, setCopied] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  const category = CATEGORY_CONFIG[video.category] || CATEGORY_CONFIG.PROMO;
  const CategoryIcon = category.icon;

  const videoShareUrl = video.facebookUrl || video.videoUrl || window.location.href;

  const handleCopyLink = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(videoShareUrl);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
      setShowShareMenu(false);
    }, 2000);
  };

  const handleFacebookShare = (e) => {
    e.stopPropagation();
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(videoShareUrl)}`;
    window.open(shareUrl, '_blank', 'width=600,height=450');
    setShowShareMenu(false);
  };

  const handleWhatsAppShare = (e) => {
    e.stopPropagation();
    const text = `🔥 ${video.titleBn || video.title}\nNextGen Academy (${BRAND.instructor})\nভিডিওটি দেখুন: ${videoShareUrl}`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    setShowShareMenu(false);
  };

  return (
    <div className="group relative bg-slate-900/90 rounded-2xl overflow-hidden border border-slate-800 hover:border-amber-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/10 flex flex-col justify-between">
      {/* Thumbnail Container */}
      <div
        className="relative aspect-video w-full overflow-hidden cursor-pointer bg-slate-950"
        onClick={() => onPlay && onPlay(video)}
      >
        {/* Cover / Placeholder Graphic */}
        {video.thumbnailUrl ? (
          <img
            src={video.thumbnailUrl}
            alt={video.titleBn || video.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-90 group-hover:brightness-100"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-900 via-slate-950 to-amber-950/40 p-4 flex flex-col justify-between relative overflow-hidden">
            {/* Abstract Decorative Light */}
            <div
              className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-2xl opacity-40 pointer-events-none"
              style={{ backgroundColor: category.accentColor }}
            />
            <div className="flex items-center justify-between z-10">
              <span className="text-xs font-black tracking-widest text-amber-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                HD VIDEO
              </span>
              <CategoryIcon className="w-4 h-4 text-slate-400" />
            </div>

            <div className="z-10 text-center my-auto px-2">
              <p className="text-white font-extrabold text-sm line-clamp-2 drop-shadow-md">
                {video.titleBn || video.title}
              </p>
              <p className="text-[11px] text-amber-300 font-semibold mt-1">
                {video.subject || BRAND.academy}
              </p>
            </div>
          </div>
        )}

        {/* Gradient Overlays for Cinematic Contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-black/40 pointer-events-none" />

        {/* Play Button Overlay with Smooth Scale Effect */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-14 h-14 rounded-full bg-amber-500/90 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/30 group-hover:scale-125 group-hover:bg-amber-400 transition-all duration-300 transform backdrop-blur-sm">
            <Play className="w-6 h-6 fill-slate-950 translate-x-0.5" />
          </div>
        </div>

        {/* Category Badge & Duration */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
          <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border backdrop-blur-md flex items-center gap-1 ${category.badgeBg}`}>
            <CategoryIcon className="w-3 h-3" />
            {category.nameBn}
          </span>

          {video.duration && (
            <span className="px-2 py-0.5 rounded-md bg-black/80 text-slate-200 text-[11px] font-mono font-bold backdrop-blur-sm border border-slate-700/50 flex items-center gap-1">
              <Clock className="w-3 h-3 text-amber-400" />
              {video.duration}
            </span>
          )}
        </div>

        {/* MANDATORY BRANDING WATERMARK / FOOTER OVERLAY */}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent p-2.5 pt-6 text-[10px] text-slate-300 pointer-events-none z-10 border-b border-amber-500/30">
          <div className="flex items-center justify-between font-bold">
            <span className="text-amber-400 flex items-center gap-1 tracking-wide font-black">
              🎓 {BRAND.academy}
            </span>
            <span className="text-emerald-400 font-semibold">
              📞 {BRAND.phone}
            </span>
          </div>
          <div className="flex items-center justify-between text-[9px] text-slate-400 mt-0.5">
            <span className="truncate max-w-[55%]">শিক্ষক: {BRAND.instructor}</span>
            <span className="truncate max-w-[45%] text-right text-slate-500">{BRAND.address}</span>
          </div>
        </div>
      </div>

      {/* Card Content & Action Bar */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <h4
            onClick={() => onPlay && onPlay(video)}
            className="text-base font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-2 cursor-pointer leading-snug"
          >
            {video.titleBn || video.title}
          </h4>

          {video.description && (
            <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
              {video.description}
            </p>
          )}
        </div>

        {/* Meta Stats & Instructor */}
        <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-slate-400">
              <Eye className="w-3.5 h-3.5 text-amber-400" />
              {video.views || '১.২K'} ভিউ
            </span>
            {video.isFacebookNative && (
              <span className="flex items-center gap-1 text-blue-400 font-semibold">
                <Facebook className="w-3.5 h-3.5 fill-blue-400" /> FB Video
              </span>
            )}
          </div>

          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowShareMenu(!showShareMenu);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs transition-colors border border-slate-700"
            >
              <Share2 className="w-3.5 h-3.5 text-amber-400" />
              শেয়ার করুন
            </button>

            {/* Quick Share Dropdown Menu */}
            {showShareMenu && (
              <div
                className="absolute right-0 bottom-full mb-2 w-48 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-1.5 z-30 space-y-1 backdrop-blur-md"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={handleFacebookShare}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-200 hover:text-white hover:bg-blue-600/30 rounded-lg transition-colors"
                >
                  <Facebook className="w-3.5 h-3.5 text-blue-400 fill-blue-400" />
                  ফেসবুকে শেয়ার
                </button>
                <button
                  onClick={handleWhatsAppShare}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-200 hover:text-white hover:bg-emerald-600/30 rounded-lg transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                  হোয়াটসঅ্যাপে শেয়ার
                </button>
                <button
                  onClick={handleCopyLink}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-slate-200 hover:text-white hover:bg-slate-800 rounded-lg transition-colors border-t border-slate-800"
                >
                  <span className="flex items-center gap-2">
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-amber-400" />}
                    {copied ? 'কপি হয়েছে!' : 'লিঙ্ক কপি করুন'}
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
