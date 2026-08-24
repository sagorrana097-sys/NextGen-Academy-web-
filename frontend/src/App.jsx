import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { SettingsProvider } from './context/SettingsContext';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import NewsTicker from './components/layout/NewsTicker';
import Login from './pages/Login';
import LandingPage from './pages/LandingPage';
import AdmissionForm from './pages/AdmissionForm';
import AdminDashboard from './pages/AdminDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import ParentDashboard from './pages/ParentDashboard';
import StudentDashboard from './pages/StudentDashboard';

import InactivityAutoLock from './components/common/InactivityAutoLock';
import FloatingWhatsAppSupport from './components/common/FloatingWhatsAppSupport';
import FloatingDoubtSolver from './components/student/FloatingDoubtSolver';

function MainApp() {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [publicView, setPublicView] = useState('landing');

  if (!isAuthenticated) {
    if (publicView === 'admission') {
      return (
        <AdmissionForm 
          onBackToHome={() => setPublicView('landing')} 
          onNavigateLogin={() => setPublicView('login')} 
        />
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
          <Login />
        </div>
      );
    }
    return (
      <LandingPage 
        onNavigateLogin={() => setPublicView('login')} 
        onNavigateAdmission={() => setPublicView('admission')} 
        onExploreLab={() => setPublicView('login')} 
      />
    );
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

        {/* Floating WhatsApp Support Widget */}
        <FloatingWhatsAppSupport />

        {/* 24/7 AI Doubt Solver Chatbot for Students */}
        {(user?.role === 'STUDENT' || user?.role === 'PARENT') && (
          <FloatingDoubtSolver
            studentClass={user?.student?.class?.nameBn || user?.student?.class?.name || 'Class 9'}
          />
        )}
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
