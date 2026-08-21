import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { SettingsProvider } from './context/SettingsContext';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import ParentDashboard from './pages/ParentDashboard';
import StudentDashboard from './pages/StudentDashboard';

import InactivityAutoLock from './components/common/InactivityAutoLock';
import FloatingWhatsAppSupport from './components/common/FloatingWhatsAppSupport';

function MainApp() {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (!isAuthenticated) {
    return <Login />;
  }

  const renderDashboard = () => {
    switch (user?.role) {
      case 'SUPER_ADMIN':
      case 'ADMIN':
        return <AdminDashboard activeTab={activeTab} />;
      case 'TEACHER':
        return <TeacherDashboard activeTab={activeTab} />;
      case 'PARENT':
        return <ParentDashboard activeTab={activeTab} />;
      case 'STUDENT':
        return <StudentDashboard activeTab={activeTab} />;
      default:
        return <div className="p-8 text-center text-slate-500">Invalid Role</div>;
    }
  };

  return (
    <InactivityAutoLock>
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
        <Navbar
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          isSidebarOpen={isSidebarOpen}
        />

        <div className="flex flex-1">
          <Sidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />

          <main className="flex-1 lg:pl-64 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            {renderDashboard()}
          </main>
        </div>

        {/* Floating WhatsApp Support Widget */}
        <FloatingWhatsAppSupport />
      </div>
    </InactivityAutoLock>
  );
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Frontend ErrorBoundary caught error:', error, errorInfo);
  }

  handleReset = () => {
    try {
      localStorage.removeItem('nextgen_token');
      localStorage.removeItem('nextgen_user');
    } catch (e) {}
    window.location.reload();
  };

  returnFallback() {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center mb-4">
          <span className="text-2xl font-bold text-rose-400">⚠️</span>
        </div>
        <h1 className="text-xl font-bold text-white mb-2">সাময়িক কারিগরি সমস্যা (Application Error)</h1>
        <p className="text-xs text-slate-400 max-w-md mb-6 leading-relaxed">
          পেজটি রেন্ডার করার সময় একটি সাময়িক সমস্যা হয়েছে। নিচের বাটনে ক্লিক করে সেশন রিসেট করে পুনরায় প্রবেশ করুন।
        </p>
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-left max-w-lg w-full mb-6 font-mono text-[11px] text-rose-300 overflow-auto max-h-40">
          {this.state.error?.toString()}
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all"
          >
            🔄 পেজ রিফ্রেশ করুন
          </button>
          <button
            onClick={this.handleReset}
            className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all"
          >
            🧹 ক্যাশ ও সেশন ক্লিয়ার করুন
          </button>
        </div>
      </div>
    );
  }

  render() {
    if (this.state.hasError) {
      return this.returnFallback();
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <LanguageProvider>
          <SettingsProvider>
            <AuthProvider>
              <MainApp />
            </AuthProvider>
          </SettingsProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
