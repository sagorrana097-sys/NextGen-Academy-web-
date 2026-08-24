import React, { useState } from 'react';
import {
  Facebook,
  ThumbsUp,
  Share2,
  Users,
  ExternalLink,
  MessageCircle,
  Sparkles,
  CheckCircle2,
  Bell
} from 'lucide-react';

const FB_PAGE_URL = 'https://www.facebook.com/NextGenAcademyBD'; // Official NextGen Academy FB Page
const FB_PAGE_NAME = 'NextGen Academy - গাজীপুর';
const FB_APP_ID = ''; // Optional app id

export default function FacebookPageWidget({ variant = 'card', className = '' }) {
  const [following, setFollowing] = useState(false);

  // Facebook Page Plugin Iframe URL with Bengali locale
  const fbPluginSrc = `https://www.facebook.com/plugins/page.php?href=${encodeURIComponent(
    FB_PAGE_URL
  )}&tabs=timeline&width=340&height=400&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId=${FB_APP_ID}`;

  if (variant === 'banner') {
    return (
      <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 border border-blue-600/40 p-5 shadow-xl ${className}`}>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 z-10 relative">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30 flex-shrink-0">
              <Facebook className="w-8 h-8 fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-white">{FB_PAGE_NAME}</h3>
                <span className="p-0.5 rounded-full bg-blue-500 text-white">
                  <CheckCircle2 className="w-3.5 h-3.5 fill-blue-500 text-white" />
                </span>
              </div>
              <p className="text-xs text-blue-200 mt-0.5">
                লাইভ ক্লাস আপডেট, পরীক্ষার প্রশ্ন ও স্পেশাল টিপস পেতে আমাদের ফেসবুক পেজ ফলো করুন!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <a
              href={FB_PAGE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition-all transform hover:-translate-y-0.5"
            >
              <ThumbsUp className="w-4 h-4 fill-white" />
              পেজে লাইক ও ফলো করুন
              <ExternalLink className="w-3.5 h-3.5 opacity-75" />
            </a>

            <a
              href="https://m.me/NextGenAcademyBD"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm border border-slate-700 transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-blue-400" />
              মেসেজ
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4 shadow-xl ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-600/20">
            <Facebook className="w-5 h-5 fill-white" />
          </div>
          <div>
            <h4 className="font-black text-sm text-white flex items-center gap-1.5">
              আমাদের ফেসবুক পেজ
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </h4>
            <p className="text-[11px] text-blue-300">NextGen Academy Community</p>
          </div>
        </div>

        <a
          href={FB_PAGE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-slate-400 hover:text-white transition-colors"
          title="ফেসবুক পেজ খুলুন"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      {/* Embedded Official Facebook Page Iframe Plugin */}
      <div className="relative rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex justify-center min-h-[220px]">
        <iframe
          src={fbPluginSrc}
          width="340"
          height="250"
          style={{ border: 'none', overflow: 'hidden', maxWidth: '100%' }}
          scrolling="no"
          frameBorder="0"
          allowFullScreen={true}
          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
          title="NextGen Academy Facebook Page"
        />
      </div>

      {/* Quick Action CTA Box */}
      <div className="bg-gradient-to-br from-blue-950/40 to-slate-950 rounded-xl p-3 border border-blue-500/20 space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-200">
          <span className="flex items-center gap-1.5 text-blue-300">
            <Users className="w-4 h-4 text-blue-400" />
            ৫,০০০+ শিক্ষার্থী ও অভিভাবক
          </span>
          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px]">
            সক্রিয় কমিউনিটি
          </span>
        </div>

        <p className="text-[11px] text-slate-400">
          নতুন ভিডিও, সাজেশন ও ব্যাচ ভর্তি সংক্রান্ত যেকোনো প্রশ্নের জন্য যুক্ত থাকুন।
        </p>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <a
            href={FB_PAGE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition-all text-center"
          >
            <ThumbsUp className="w-3.5 h-3.5 fill-white" />
            ফলো করুন
          </a>

          <a
            href="https://m.me/NextGenAcademyBD"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs border border-slate-700 transition-colors text-center"
          >
            <MessageCircle className="w-3.5 h-3.5 text-blue-400" />
            মেসেজ পাঠান
          </a>
        </div>
      </div>
    </div>
  );
}
