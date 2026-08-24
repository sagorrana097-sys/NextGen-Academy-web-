import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useSettings } from '../../context/SettingsContext';
import {
  MapPin,
  Phone,
  MessageCircle,
  Navigation,
  Clock,
  Mail,
  ExternalLink,
  ShieldCheck,
  Building2,
  Sparkles
} from 'lucide-react';

export default function GazipurCampusLocationCard() {
  const { lang } = useLanguage();
  const { settings } = useSettings();

  const phone = settings?.contactPhone || settings?.phone || '+880 1792818005';
  const whatsapp = settings?.whatsappPhone || '01792818005';
  const email = settings?.contactEmail || settings?.email || 'info@nextgen.edu.bd';
  const address = settings?.address || 'পশ্চিম জয়দেবপুর, বাস-স্ট্যান্ড, গাজীপুর';

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('NextGen Academy Gazipur Campus Board Bazar Gazipur Bangladesh')}`;
  
  // Interactive Google Map Embed URL (Gazipur Sadar / Board Bazar coordinates)
  const mapEmbedUrl = 'https://maps.google.com/maps?q=Joydebpur%20Gazipur%20Bangladesh&t=&z=14&ie=UTF8&iwloc=&output=embed';

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm overflow-hidden space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-black mb-2">
            <Building2 className="w-3.5 h-3.5" />
            <span>গাজীপুর প্রধান ক্যাম্পাস ও যোগাযোগ</span>
          </div>
          <h3 className="text-xl font-black text-slate-900 dark:text-slate-100">
            ক্যাম্পাস লোকেশন ও সরাসরি দিকনির্দেশনা (Location Map & Directions)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            আমাদের গাজীপুর ক্যাম্পাসে সরাসরি উপস্থিত হয়ে ভর্তি সংক্রান্ত পরামর্শ ও পরিদর্শন করতে পারেন
          </p>
        </div>

        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noreferrer"
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center space-x-2 active:scale-95 flex-shrink-0"
        >
          <Navigation className="w-4 h-4" />
          <span>গুগল ম্যাপে খুলুন (Open in Maps)</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Main Grid: Details + Map Embed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Side: Campus Details Cards */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          <div className="space-y-3.5">
            {/* Address Card */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-start space-x-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <span className="text-[11px] font-bold text-slate-400 uppercase">ক্যাম্পাস ঠিকানা</span>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-relaxed">
                  {address}
                </p>
              </div>
            </div>

            {/* Office Hours */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-start space-x-3">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <span className="text-[11px] font-bold text-slate-400 uppercase">অফিস ও কাউন্সেলিং সময়</span>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  শনিবার - বৃহস্পতিবার: সকাল ৮:০০ - বিকাল ৫:০০ (শুক্রবার বন্ধ)
                </p>
              </div>
            </div>

            {/* Contact Hotline */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-start space-x-3">
              <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <span className="text-[11px] font-bold text-slate-400 uppercase">হেল্পলাইন ও ইমেইল</span>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 font-mono">
                  {phone} • {email}
                </p>
              </div>
            </div>
          </div>

          {/* Action Button Strip */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <a
              href={`tel:${phone.replace(/[^0-9+]/g, '')}`}
              className="py-2.5 px-3 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center space-x-2 transition-all shadow-sm active:scale-95"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>সরাসরি কল করুন</span>
            </a>

            <a
              href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('আসসালামু আলাইকুম, আমি গাজীপুর ক্যাম্পাসে ভর্তি ও তথ্য বিষয়ে জানতে চাচ্ছি।')}`}
              target="_blank"
              rel="noreferrer"
              className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center space-x-2 transition-all shadow-sm active:scale-95"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp চ্যাট</span>
            </a>
          </div>
        </div>

        {/* Right Side: Interactive Google Map Iframe */}
        <div className="lg:col-span-7 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-inner bg-slate-100 dark:bg-slate-800 relative min-h-[300px]">
          <iframe
            title="NextGen Academy Gazipur Campus Location"
            src={mapEmbedUrl}
            width="100%"
            height="100%"
            className="w-full h-full min-h-[320px] border-0"
            loading="lazy"
            allowFullScreen
          />
          <div className="absolute bottom-3 right-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-[11px] font-bold text-slate-700 dark:text-slate-200 shadow-md pointer-events-none">
            📍 নেক্সটজেন একাডেমি গাজীপুর ক্যাম্পাস
          </div>
        </div>
      </div>
    </div>
  );
}
