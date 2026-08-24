import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';

/**
 * Discrete Floating WhatsApp Support Pill Button
 * Fixed strictly in bottom-right corner with w-auto and z-[100]
 * Direct one-click launch to official WhatsApp chat
 * Hides on Admin Panel / for Admin and Super Admin users.
 */
export default function FloatingWhatsAppSupport() {
  const { user, isAdmin, isSuperAdmin } = useAuth();
  const { settings } = useSettings();

  // 1. Path-based Admin Route Check
  const isAdminRoute = typeof window !== 'undefined' && window.location.pathname.startsWith('/admin');

  // 2. Role-based Admin Check (Hide for Admin & Super Admin)
  const isUserAdmin = isAdmin || isSuperAdmin || user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';

  if (isAdminRoute || isUserAdmin) {
    return null;
  }

  const phone = '8801792818005';
  const prefilledMessage = 'Hello NextGen Academy, আমি ভর্তি সংক্রান্ত তথ্য জানতে চাই।';
  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(prefilledMessage)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 inline-flex items-center justify-center gap-2.5 px-4 sm:px-5 py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold rounded-full shadow-2xl shadow-emerald-950/40 border border-white/20 transition-all duration-300 transform hover:scale-105 active:scale-95 select-none no-print group"
      title="সরাসরি ভর্তি কাউন্সেলিং | WhatsApp"
    >
      {/* WhatsApp SVG Icon */}
      <div className="relative">
        <svg
          className="w-5 h-5 sm:w-6 sm:h-6 fill-current flex-shrink-0 group-hover:rotate-12 transition-transform duration-300"
          viewBox="0 0 24 24"
        >
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
        </svg>
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-300 rounded-full animate-ping"></span>
      </div>

      {/* Full Label */}
      <span className="text-xs sm:text-sm font-bold tracking-wide whitespace-nowrap text-white drop-shadow-sm">
        সরাসরি ভর্তি কাউন্সেলিং | WhatsApp
      </span>
    </a>
  );
}
