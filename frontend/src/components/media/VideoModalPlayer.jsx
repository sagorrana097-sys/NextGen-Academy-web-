import React, { useState } from 'react';
import {
  X,
  Share2,
  Facebook,
  MessageCircle,
  Copy,
  Check,
  ThumbsUp,
  Clock,
  Eye,
  Sparkles,
  ExternalLink,
  Award,
  BookOpen,
  Film
} from 'lucide-react';
import { CATEGORY_CONFIG } from './VideoCard';

const BRAND = {
  academy: 'NextGen Academy',
  instructor: 'মো: আলমগীর হোসেন (সাগর)',
  phone: '০১৭৯২৮১৮০০৫',
  address: 'পশ্চিম জয়দেবপুর, বাস-স্ট্যান্ড, গাজীপুর'
};

export default function VideoModalPlayer({ video, onClose, onSelectRelated }) {
  const [copied, setCopied] = useState(false);

  if (!video) return null;

  const category = CATEGORY_CONFIG[video.category] || CATEGORY_CONFIG.PROMO;
  const CategoryIcon = category.icon;

  const videoShareUrl = video.facebookUrl || video.videoUrl || window.location.href;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(videoShareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFacebookShare = () => {
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(videoShareUrl)}`;
    window.open(shareUrl, '_blank', 'width=600,height=450');
  };

  const handleWhatsAppShare = () => {
    const text = `🔥 ${video.titleBn || video.title}\nNextGen Academy (${BRAND.instructor})\nভিডিওটি দেখুন: ${videoShareUrl}`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  // Helper to render video player based on source type
  const renderPlayer = () => {
    // 1. Prioritize Facebook Video Native Embed
    if (video.facebookUrl || video.fbVideoId) {
      const fbVideoUrl = video.facebookUrl || `https://www.facebook.com/facebook/videos/${video.fbVideoId}/`;
      const fbEmbedSrc = `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(
        fbVideoUrl
      )}&show_text=false&width=720&t=0&autoplay=true`;

      return (
        <div className="relative aspect-video w-full bg-black rounded-2xl overflow-hidden shadow-2xl">
          <iframe
            src={fbEmbedSrc}
            width="100%"
            height="100%"
            style={{ border: 'none', overflow: 'hidden' }}
            scrolling="no"
            frameBorder="0"
            allowFullScreen={true}
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            title={video.titleBn || video.title}
          />
        </div>
      );
    }

    // 2. YouTube Embed
    if (video.youtubeId || (video.videoUrl && video.videoUrl.includes('youtube'))) {
      const ytId = video.youtubeId || video.videoUrl.split('v=')[1]?.split('&')[0] || video.videoUrl.split('youtu.be/')[1];
      return (
        <div className="relative aspect-video w-full bg-black rounded-2xl overflow-hidden shadow-2xl">
          <iframe
            src={`https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0`}
            width="100%"
            height="100%"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={video.titleBn || video.title}
          />
        </div>
      );
    }

    // 3. Fallback standard HTML5 / Placeholder video stream
    return (
      <div className="relative aspect-video w-full bg-slate-950 rounded-2xl overflow-hidden shadow-2xl flex items-center justify-center p-8 text-center border border-slate-800">
        {video.videoUrl && video.videoUrl.endsWith('.mp4') ? (
          <video
            src={video.videoUrl}
            controls
            autoPlay
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="space-y-4 max-w-md">
            <div className="w-16 h-16 rounded-full bg-amber-500/20 text-amber-400 mx-auto flex items-center justify-center">
              <Film className="w-8 h-8" />
            </div>
            <h4 className="text-white font-bold text-lg">{video.titleBn || video.title}</h4>
            <p className="text-xs text-slate-400">
              ভিডিওটি দেখতে আমাদের অফিশিয়াল ফেসবুক পেজে যুক্ত হন।
            </p>
            <a
              href={videoShareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-500/30 transition-all"
            >
              <Facebook className="w-4 h-4 fill-white" />
              ফেসবুকে ভিডিওটি দেখুন
              <ExternalLink className="w-4 h-4 opacity-80" />
            </a>
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl space-y-4 p-5 sm:p-6 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <span className={`px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md flex items-center gap-1.5 ${category.badgeBg}`}>
              <CategoryIcon className="w-3.5 h-3.5" />
              {category.nameBn}
            </span>
            <span className="text-xs text-slate-400 font-medium">
              NextGen Media Center
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player */}
        {renderPlayer()}

        {/* Video Info & Sharing Controls */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                {video.titleBn || video.title}
              </h2>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1.5">
                <span className="flex items-center gap-1 text-amber-400 font-semibold">
                  <Eye className="w-4 h-4" /> {video.views || '১.২K'} ভিউ
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" /> {video.duration || '১০:০০'}
                </span>
                {video.date && (
                  <>
                    <span>•</span>
                    <span>{video.date}</span>
                  </>
                )}
              </div>
            </div>

            {/* Social Share Buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={handleFacebookShare}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition-all"
              >
                <Facebook className="w-4 h-4 fill-white" />
                FB শেয়ার
              </button>

              <button
                onClick={handleWhatsAppShare}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </button>

              <button
                onClick={handleCopyLink}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-amber-400" />}
                {copied ? 'কপি হয়েছে!' : 'লিঙ্ক কপি'}
              </button>
            </div>
          </div>

          {video.description && (
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-sm text-slate-300 leading-relaxed">
              {video.description}
            </div>
          )}

          {/* Mandatory Academy Branding Footer Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-slate-950 to-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-lg flex-shrink-0">
                🎓
              </div>
              <div>
                <p className="font-extrabold text-white text-sm">
                  {BRAND.academy} — <span className="text-amber-400">{BRAND.instructor}</span>
                </p>
                <p className="text-slate-400 mt-0.5">
                  📍 {BRAND.address}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <a
                href={`tel:${BRAND.phone}`}
                className="px-4 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 font-bold text-xs border border-emerald-500/30 transition-colors flex items-center gap-1.5"
              >
                📞 {BRAND.phone}
              </a>

              <a
                href="https://www.facebook.com/NextGenAcademyBD"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 font-bold text-xs border border-blue-500/30 transition-colors flex items-center gap-1.5"
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                ফেসবুক পেজ
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
