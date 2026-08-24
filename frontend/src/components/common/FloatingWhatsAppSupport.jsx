import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';
import DraggableFloatingContainer from './DraggableFloatingContainer';
import { MessageCircle, Move, Minus, Maximize2 } from 'lucide-react';

/**
 * High-performance Draggable Floating WhatsApp Support Widget
 */
export default function FloatingWhatsAppSupport() {
  const { user, isAdmin, isSuperAdmin } = useAuth();
  const { settings } = useSettings();

  const [isMinimized, setIsMinimized] = useState(() => {
    try {
      return localStorage.getItem('nextgen_whatsapp_min') === 'true';
    } catch (e) {
      return false;
    }
  });

  const isUserAdmin = isAdmin || isSuperAdmin || user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';
  if (isUserAdmin) return null;

  const phone = '8801792818005';
  const prefilledMessage = 'Hello NextGen Academy, আমি ভর্তি সংক্রান্ত তথ্য জানতে চাই।';
  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(prefilledMessage)}`;

  const toggleMinimize = (e) => {
    e.stopPropagation();
    const next = !isMinimized;
    setIsMinimized(next);
    try {
      localStorage.setItem('nextgen_whatsapp_min', String(next));
    } catch (e) {}
  };

  const initPos = {
    x: typeof window !== 'undefined' ? Math.max(10, window.innerWidth - 270) : 1000,
    y: typeof window !== 'undefined' ? Math.max(10, window.innerHeight - 80) : 650
  };

  return (
    <DraggableFloatingContainer
      id="whatsapp_support"
      initialPosition={initPos}
      handleSelector="[data-drag-handle]"
      className="z-[90]"
    >
      {({ isDragging }) => (
        <div className="relative">
          {isMinimized ? (
            /* Minimized Round WhatsApp Icon */
            <div
              data-drag-handle
              className="relative group p-0.5 cursor-grab active:cursor-grabbing"
              title="WhatsApp কাউন্সেলিং (ড্র্যাগ করে যেকোনো জায়গায় রাখুন)"
            >
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-no-drag
                className="w-12 h-12 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white flex items-center justify-center shadow-2xl shadow-emerald-950/50 border-2 border-white/30 transition-transform transform hover:scale-110 active:scale-95"
              >
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                </svg>
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-300 rounded-full ring-2 ring-slate-950 animate-ping" />
              </a>
              <button
                type="button"
                data-no-drag
                onClick={toggleMinimize}
                className="absolute -top-2 -left-2 w-5 h-5 rounded-full bg-slate-900 border border-slate-700 text-slate-300 hover:text-white flex items-center justify-center text-[10px] shadow"
                title="বড় করুন"
              >
                <Maximize2 className="w-2.5 h-2.5" />
              </button>
            </div>
          ) : (
            /* Full Draggable WhatsApp Pill */
            <div
              data-drag-handle
              className="flex items-center bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-full shadow-2xl shadow-emerald-950/50 border border-white/30 pl-3.5 pr-2 py-2 gap-2 text-xs font-bold cursor-grab active:cursor-grabbing group transition-all"
            >
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-no-drag
                className="flex items-center gap-2"
                title="সরাসরি ভর্তি কাউন্সেলিং | WhatsApp"
              >
                <div className="relative">
                  <svg className="w-5 h-5 fill-current flex-shrink-0 group-hover:rotate-12 transition-transform" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                  </svg>
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-300 rounded-full animate-ping" />
                </div>
                <span className="whitespace-nowrap font-bold">ভর্তি কাউন্সেলিং | WhatsApp</span>
              </a>

              <div className="flex items-center pl-1 border-l border-white/30 gap-1">
                <button
                  type="button"
                  data-no-drag
                  onClick={toggleMinimize}
                  className="p-1 rounded-full hover:bg-black/20 text-white transition-colors"
                  title="মিনিমাইজ করুন"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <div className="p-0.5 text-white/70 hover:text-white" title="ড্র্যাগ করে সরান">
                  <Move className="w-3 h-3" />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </DraggableFloatingContainer>
  );
}
