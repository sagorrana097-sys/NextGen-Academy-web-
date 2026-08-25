import React, { useState, Suspense } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { SettingsProvider } from './context/SettingsContext';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import NewsTicker from './components/layout/NewsTicker';
import LoadingFallback from './components/common/LoadingFallback';
import ErrorBoundary from './components/common/ErrorBoundary';
import InactivityAutoLock from './components/common/InactivityAutoLock';
import FloatingToolboxDock from './components/common/FloatingToolboxDock';
import { lazyRetry } from './utils/lazyRetry';

// Resilient code-split top-level pages with automatic chunk retry
const Login = lazyRetry(() => import('./pages/Login'));
const LandingPage = lazyRetry(() => import('./pages/LandingPage'));
const AdmissionForm = lazyRetry(() => import('./pages/AdmissionForm'));
const AdminDashboard = lazyRetry(() => import('./pages/AdminDashboard'));
const TeacherDashboard = lazyRetry(() => import('./pages/TeacherDashboard'));
const ParentDashboard = lazyRetry(() => import('./pages/ParentDashboard'));
const StudentDashboard = lazyRetry(() => import('./pages/StudentDashboard'));

function MainApp() {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [publicView, setPublicView] = useState('landing');

  if (!isAuthenticated) {
    if (publicView === 'admission') {
      return (
        <ErrorBoundary>
          <Suspense fallback={<LoadingFallback message="ভর্তি পোর্টাল লোড হচ্ছে..." />}>
            <AdmissionForm 
              onBackToHome={() => setPublicView('landing')} 
              onNavigateLogin={() => setPublicView('login')} 
            />
          </Suspense>
        </ErrorBoundary>
      );
    }
    if (publicView === 'login') {
      return (
        <ErrorBoundary>
          <div className="relative min-h-[100dvh] bg-slate-950 text-white flex flex-col">
            <div className="p-3 bg-slate-900 border-b border-slate-800 text-center flex items-center justify-between px-4 sm:px-6">
              <button 
                onClick={() => setPublicView('landing')}
                className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
              >
                ← মূল হোমপেজে ফিরে যান (Home)
              </button>
              <button 
                onClick={() => setPublicView('admission')}
                className="text-xs font-black text-cyan-400 hover:underline cursor-pointer"
              >
                অনলাইন ভর্তি ফরম →
              </button>
            </div>
            <div className="flex-1">
              <Suspense fallback={<LoadingFallback message="লগইন উইন্ডো লোড হচ্ছে..." />}>
                <Login />
              </Suspense>
            </div>
          </div>
        </ErrorBoundary>
      );
    }
    return (
      <ErrorBoundary>
        <Suspense fallback={<LoadingFallback message="নেক্সটজেন হোমপেজ লোড হচ্ছে..." />}>
          <LandingPage 
            onNavigateLogin={() => setPublicView('login')} 
            onNavigateAdmission={() => setPublicView('admission')} 
            onExploreLab={() => setPublicView('login')} 
          />
        </Suspense>
      </ErrorBoundary>
    );
  }

  const renderDashboard = () => {
    const role = String(user?.role || '').toUpperCase();
    return (
      <ErrorBoundary>
        <Suspense fallback={<LoadingFallback message="ড্যাশবোর্ড প্রস্তুত হচ্ছে..." />}>
          {(() => {
            switch (role) {
              case 'SUPER_ADMIN':
              case 'ADMIN':
                return <AdminDashboard activeTab={activeTab} />;
              case 'TEACHER':
                return <TeacherDashboard activeTab={activeTab} />;
              case 'PARENT':
                return <ParentDashboard activeTab={activeTab} />;
              case 'STUDENT':
              default:
                return <StudentDashboard activeTab={activeTab} />;
            }
          })()}
        </Suspense>
      </ErrorBoundary>
    );
  };

  return (
    <InactivityAutoLock>
      <div className="min-h-[100dvh] min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans w-full overflow-x-hidden">
        <Navbar
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          isSidebarOpen={isSidebarOpen}
        />

        {/* Global Live News Ticker (Sticky top-16 just below Navbar) */}
        <NewsTicker />

        <div className="flex flex-1 relative w-full overflow-x-hidden">
          <Sidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />

          <main className="flex-1 lg:pl-64 p-3 sm:p-6 lg:p-8 pb-28 max-w-7xl w-full mx-auto transition-all">
            {renderDashboard()}
          </main>
        </div>

        {/* Unified Floating Smart Dock & Toolbox (AI Doubt, Calculator, WhatsApp) */}
        <FloatingToolboxDock />
      </div>
    </InactivityAutoLock>
  );
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
