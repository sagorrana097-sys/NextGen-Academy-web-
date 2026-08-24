import React from 'react';
import { silentlyLogSystemError } from '../../services/api';
import { RefreshCw, ShieldCheck } from 'lucide-react';

/**
 * Stealth AI Global Error Monitor & Silent Auto-Recovery Boundary
 * Catches unhandled runtime crashes across the entire app silently,
 * logs full diagnostic context to system_errors, and presents a polite,
 * clean maintenance screen to students, parents, and teachers without exposing errors.
 */
export default class GlobalErrorMonitor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      errorId: null,
      retrying: false
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // 1. Silent Background Capture
    try {
      silentlyLogSystemError({
        message: error?.message || 'Unknown React UI Crash',
        stack: error?.stack || null,
        componentStack: errorInfo?.componentStack || null,
        errorType: 'UI_CRASH',
        route: typeof window !== 'undefined' ? window.location.pathname : '/'
      });
    } catch (loggingErr) {
      // Suppressed for complete user stealth
    }
  }

  handleReload = () => {
    this.setState({ retrying: true });
    setTimeout(() => {
      window.location.reload();
    }, 300);
  };

  handleSoftReset = () => {
    this.setState({ hasError: false, retrying: false });
  };

  render() {
    if (this.state.hasError) {
      // Custom polite fallback UI (clean, non-alarming maintenance view in Bengali)
      return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 text-white flex flex-col items-center justify-center p-4 sm:p-6 text-center select-none font-sans">
          <div className="max-w-md w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6 relative overflow-hidden backdrop-blur-xl">
            {/* Ambient subtle glow */}
            <div className="absolute -top-20 -right-20 w-44 h-44 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-44 h-44 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Institution Badge & Calm Status Icon */}
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-inner text-emerald-400">
              <ShieldCheck className="w-8 h-8 animate-pulse" />
            </div>

            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/40 text-[11px] font-bold uppercase tracking-widest inline-block">
                NextGen Academy System
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                সিস্টেম আপডেট চলছে
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed font-medium">
                অনুগ্রহ করে পেজটি রিলোড করুন অথবা কিছুক্ষণ পর পুনরায় চেষ্টা করুন। আপনার ডেটা সুরক্ষিত রয়েছে।
              </p>
            </div>

            {/* Polite Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={this.handleReload}
                disabled={this.state.retrying}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 flex items-center justify-center space-x-2 transition-all active:scale-95 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${this.state.retrying ? 'animate-spin' : ''}`} />
                <span>পেজ রিলোড করুন</span>
              </button>

              <button
                type="button"
                onClick={this.handleSoftReset}
                className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 transition-colors"
              >
                হোমপেজে ফিরুন
              </button>
            </div>

            <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-center space-x-2">
              <span>🏛️ নেক্সটজেন একাডেমি অটো-রিকভারি সিস্টেম</span>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
