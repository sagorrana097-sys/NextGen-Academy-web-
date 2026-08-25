import React from 'react';
import { AlertTriangle, RefreshCw, Home, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

/**
 * NextGen Academy - Resilient Mobile-Ready Error Boundary
 * Prevents mobile white-screen/blank page rendering crashes.
 * Gracefully captures render-time errors, ChunkLoadErrors, and missing contexts.
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error('[NextGen ErrorBoundary Caught Exception]:', error, errorInfo);

    // Auto-recover from dynamic import chunk load failures on mobile
    if (
      error?.message?.includes('Failed to fetch dynamically imported module') ||
      error?.name === 'ChunkLoadError' ||
      error?.message?.includes('Loading chunk')
    ) {
      const reloadKey = 'nextgen_chunk_reload_' + (error.message || 'err').slice(0, 30);
      if (!sessionStorage.getItem(reloadKey)) {
        sessionStorage.setItem(reloadKey, 'true');
        window.location.reload();
      }
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (this.props.onReset) {
      this.props.onReset();
    } else {
      window.location.reload();
    }
  };

  handleClearCacheAndReload = () => {
    try {
      sessionStorage.clear();
      // Keep essential tokens if possible or wipe cache keys
      const keysToKeep = ['token', 'nextgen_user', 'nextgen_token'];
      const preserved = {};
      keysToKeep.forEach(k => {
        try { preserved[k] = localStorage.getItem(k); } catch (_) {}
      });
      localStorage.clear();
      Object.entries(preserved).forEach(([k, v]) => {
        if (v) {
          try { localStorage.setItem(k, v); } catch (_) {}
        }
      });
    } catch (_) {}
    window.location.reload();
  };

  handleGoHome = () => {
    try {
      window.location.href = '/';
    } catch (_) {
      this.handleReset();
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return typeof this.props.fallback === 'function'
          ? this.props.fallback({ error: this.state.error, reset: this.handleReset })
          : this.props.fallback;
      }

      const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
      const errorMsg = this.state.error?.message || 'একটি অপ্রত্যাশিত সমস্যা দেখা দিয়েছে';

      return (
        <div className="min-h-[100dvh] min-h-screen w-full bg-slate-950 text-slate-100 flex items-center justify-center p-4 sm:p-6 select-none">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 text-center relative overflow-hidden">
            {/* Glowing Ambient Background */}
            <div className="absolute -top-16 -left-16 w-48 h-48 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center mx-auto shadow-lg shadow-rose-500/20">
                <AlertTriangle className="w-8 h-8 animate-pulse" />
              </div>

              <div className="space-y-1.5">
                <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                  পৃষ্ঠা লোড করতে সাময়িক সমস্যা হয়েছে
                </h2>
                <p className="text-xs text-slate-400 leading-relaxed font-medium">
                  মোবাইল ব্রাউজার বা নেটওয়ার্ক সমস্যার কারণে পৃষ্ঠাটি দৃশ্যমান হতে পারেনি। অনুগ্রহ করে নিচের বাটনে ক্লিক করে রিফ্রেশ করুন।
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-2">
                <button
                  type="button"
                  onClick={this.handleReset}
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-emerald-600/30 transition-all active:scale-95 cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>পেজ পুনরায় লোড করুন (Reload Page)</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={this.handleClearCacheAndReload}
                    className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all border border-slate-700"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>ক্যাশ ক্লিয়ার</span>
                  </button>

                  <button
                    type="button"
                    onClick={this.handleGoHome}
                    className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all border border-slate-700"
                  >
                    <Home className="w-3.5 h-3.5 text-indigo-400" />
                    <span>মূল পাতায় যান</span>
                  </button>
                </div>
              </div>

              {/* Technical Details Toggle */}
              <div className="pt-2 border-t border-slate-800/80">
                <button
                  type="button"
                  onClick={() => this.setState({ showDetails: !this.state.showDetails })}
                  className="text-[11px] font-semibold text-slate-500 hover:text-slate-400 flex items-center justify-center space-x-1 mx-auto"
                >
                  <span>কারিগরি তথ্য</span>
                  {this.state.showDetails ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>

                {this.state.showDetails && (
                  <div className="mt-2 p-3 bg-slate-950/80 border border-slate-800 rounded-xl text-left text-[10px] text-rose-300 font-mono overflow-x-auto max-h-32">
                    <p className="font-bold">{errorMsg}</p>
                    {this.state.errorInfo?.componentStack && (
                      <pre className="mt-1 text-slate-500 text-[9px] whitespace-pre-wrap">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
