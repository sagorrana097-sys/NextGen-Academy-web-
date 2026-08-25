import React, { useState, lazy, Suspense } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { SettingsProvider } from './context/SettingsContext';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import NewsTicker from './components/layout/NewsTicker';
import LoadingFallback from './components/common/LoadingFallback';

// Code-split top-level pages with React.lazy
const Login = lazy(() => import('./pages/Login'));
const LandingPage = lazy(() => import('./pages/LandingPage'));
const AdmissionForm = lazy(() => import('./pages/AdmissionForm'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const TeacherDashboard = lazy(() => import('./pages/TeacherDashboard'));
const ParentDashboard = lazy(() => import('./pages/ParentDashboard'));
const StudentDashboard = lazy(() => import('./pages/StudentDashboard'));

import InactivityAutoLock from './components/common/InactivityAutoLock';
import FloatingToolboxDock from './components/common/FloatingToolboxDock';
import ErrorBoundary from './components/common/ErrorBoundary';

function MainApp() {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [publicView, setPublicView] = useState('landing');

  if (!isAuthenticated) {
    if (publicView === 'admission') {
      return (
        <Suspense fallback={<LoadingFallback />}>
          <AdmissionForm 
            onBackToHome={() => setPublicView('landing')} 
            onNavigateLogin={() => setPublicView('login')} 
          />
        </Suspense>
      );
    }
    if (publicView === 'login') {
      return (
        <div className="relative">
          <div className="p-3 bg-slate-900 border-b border-slate-800 text-center flex items-center justify-between px-6">
            <button 
              onClick={() => setPublicView('landing')}
              className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1"
            >
              ← মূল হোমপেজে ফিরে যান (Home)
            </button>
            <button 
              onClick={() => setPublicView('admission')}
              className="text-xs font-black text-cyan-400 hover:underline"
            >
              অনলাইন ভর্তি ফরম →
            </button>
          </div>
          <Suspense fallback={<LoadingFallback />}>
            <Login />
          </Suspense>
        </div>
      );
    }
    return (
      <Suspense fallback={<LoadingFallback />}>
        <LandingPage 
          onNavigateLogin={() => setPublicView('login')} 
          onNavigateAdmission={() => setPublicView('admission')} 
          onExploreLab={() => setPublicView('login')} 
        />
      </Suspense>
    );
  }

  const renderDashboard = () => {
    const role = String(user?.role || '').toUpperCase();
    return (
      <Suspense fallback={<LoadingFallback />}>
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
    );
  };

  return (
    <InactivityAutoLock>
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
        <Navbar
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          isSidebarOpen={isSidebarOpen}
        />

        {/* Global Live News Ticker (Sticky top-16 just below Navbar) */}
        <NewsTicker />

        <div className="flex flex-1">
          <Sidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />

          <main className="flex-1 lg:pl-64 p-4 sm:p-6 lg:p-8 pb-28 max-w-7xl w-full mx-auto">
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
    <ThemeProvider>
      <LanguageProvider>
        <SettingsProvider>
          <AuthProvider>
            <MainApp />
          </AuthProvider>
        </SettingsProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
