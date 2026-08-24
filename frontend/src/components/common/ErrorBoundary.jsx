import React from 'react';
import { RefreshCw, AlertTriangle, ShieldCheck } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[NextGen React App Caught Error]:', error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  handleRecover = () => {
    try {
      localStorage.removeItem('nga_site_settings_cache');
      localStorage.removeItem('admin_stats');
      localStorage.removeItem('student_profile');
    } catch (e) {}
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center font-sans">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-bold border border-slate-700">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>NextGen Academy Portal</span>
              </div>
              <h2 className="text-xl font-black text-white">
                সাময়িক সমস্যা হয়েছে
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                ড্যাশবোর্ড তাৎক্ষণিক রিকভার করতে নিচের বাটনে ক্লিক করুন। আপনার ডেটা সুরক্ষিত রয়েছে।
              </p>
            </div>

            <div className="space-y-2.5">
              <button
                type="button"
                onClick={this.handleRecover}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-xs font-black shadow-lg shadow-emerald-600/30 flex items-center justify-center space-x-2 transition-all active:scale-95"
              >
                <RefreshCw className="w-4 h-4" />
                <span>তাৎক্ষণিক পুনরুদ্ধার করুন (Auto Recover)</span>
              </button>

              <button
                type="button"
                onClick={this.handleReload}
                className="w-full py-2.5 px-6 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold border border-slate-700 transition-colors"
              >
                পেজ রিলোড করুন (Reload)
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
