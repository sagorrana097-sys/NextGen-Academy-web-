import React from 'react';
import { Sparkles, Loader2 } from 'lucide-react';

export default function LoadingFallback({
  message = 'লোড হচ্ছে...',
  subtext = 'NextGen Academy হাই-স্পিড অপটিমাইজড ইঞ্জিন প্রস্তুত হচ্ছে',
  minHeight = 'min-h-[350px]'
}) {
  return (
    <div className={`w-full ${minHeight} flex flex-col items-center justify-center p-8 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md relative overflow-hidden my-4 shadow-xl`}>
      {/* Background Glowing Ambient Orbs */}
      <div className="absolute -top-12 -left-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
      <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" style={{ animationDelay: '1s' }}></div>

      <div className="relative z-10 flex flex-col items-center text-center space-y-4">
        {/* Glowing Rings Spinner */}
        <div className="relative w-16 h-16 flex items-center justify-center">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 opacity-20 blur-md animate-ping" style={{ animationDuration: '2s' }}></div>
          <div className="w-14 h-14 rounded-2xl bg-slate-950 border-2 border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/20">
            <Loader2 className="w-7 h-7 animate-spin text-emerald-400" />
          </div>
          <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 border-2 border-slate-950 flex items-center justify-center text-[8px] text-slate-950 font-bold">
            ⚡
          </div>
        </div>

        {/* Text Details */}
        <div className="space-y-1.5 max-w-sm">
          <h4 className="text-sm sm:text-base font-black text-white flex items-center justify-center gap-1.5">
            <span>{message}</span>
            <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-spin" style={{ animationDuration: '4s' }} />
          </h4>
          <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
            {subtext}
          </p>
        </div>

        {/* Skeleton Shimmer Bar */}
        <div className="w-48 h-1.5 bg-slate-800 rounded-full overflow-hidden relative">
          <div className="h-full bg-gradient-to-r from-emerald-500 via-teal-300 to-emerald-500 rounded-full w-24 animate-[shimmer_1.5s_infinite_linear]" style={{
            backgroundImage: 'linear-gradient(90deg, transparent, rgba(16, 185, 129, 0.8), transparent)'
          }}></div>
        </div>
      </div>
    </div>
  );
}
