import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';
import { MessageCircle, X, Move, ChevronRight, Minus, Maximize2 } from 'lucide-react';

/**
 * Fully Draggable & Floating WhatsApp Support Widget
 * Supports desktop mouse & mobile touch drag-and-drop
 * Minimizable to compact floating circular icon or expanded pill
 */
export default function FloatingWhatsAppSupport() {
  const { user, isAdmin, isSuperAdmin } = useAuth();
  const { settings } = useSettings();

  const [position, setPosition] = useState(() => {
    try {
      const saved = localStorage.getItem('nextgen_whatsapp_pos');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return { x: window.innerWidth - 270, y: window.innerHeight - 80 };
  });

  const [isMinimized, setIsMinimized] = useState(() => {
    try {
      return localStorage.getItem('nextgen_whatsapp_min') === 'true';
    } catch (e) {
      return false;
    }
  });

  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef({ startX: 0, startY: 0, initialX: 0, initialY: 0, hasMoved: false });
  const widgetRef = useRef(null);

  // Keep within screen bounds on resize
  useEffect(() => {
    const handleResize = () => {
      setPosition(prev => ({
        x: Math.min(Math.max(10, prev.x), window.innerWidth - 70),
        y: Math.min(Math.max(10, prev.y), window.innerHeight - 70)
      }));
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handlePointerDown = (e) => {
    // Only drag from non-interactive buttons or main handle
    if (e.target.closest('button[data-action="toggle-min"]')) return;

    setIsDragging(true);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialX: position.x,
      initialY: position.y,
      hasMoved: false
    };

    const handlePointerMove = (moveEvent) => {
      const deltaX = moveEvent.clientX - dragRef.current.startX;
      const deltaY = moveEvent.clientY - dragRef.current.startY;

      if (Math.abs(deltaX) > 4 || Math.abs(deltaY) > 4) {
        dragRef.current.hasMoved = true;
      }

      const newX = Math.min(Math.max(10, dragRef.current.initialX + deltaX), window.innerWidth - (isMinimized ? 65 : 270));
      const newY = Math.min(Math.max(10, dragRef.current.initialY + deltaY), window.innerHeight - 65);

      setPosition({ x: newX, y: newY });
    };

    const handlePointerUp = () => {
      setIsDragging(false);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);

      // Save position
      try {
        setPosition(cur => {
          localStorage.setItem('nextgen_whatsapp_pos', JSON.stringify(cur));
          return cur;
        });
      } catch (e) {}
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  const toggleMinimize = (e) => {
    e.stopPropagation();
    const nextState = !isMinimized;
    setIsMinimized(nextState);
    try {
      localStorage.setItem('nextgen_whatsapp_min', String(nextState));
    } catch (e) {}
  };

  // Hide for Admin & Super Admin
  const isUserAdmin = isAdmin || isSuperAdmin || user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';
  if (isUserAdmin) return null;

  const phone = '8801792818005';
  const prefilledMessage = 'Hello NextGen Academy, আমি ভর্তি সংক্রান্ত তথ্য জানতে চাই।';
  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(prefilledMessage)}`;

  const handleClick = (e) => {
    if (dragRef.current.hasMoved) {
      e.preventDefault();
    }
  };

  return (
    <div
      ref={widgetRef}
      onPointerDown={handlePointerDown}
      style={{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: 90
      }}
      className={`select-none no-print transition-shadow duration-200 ${
        isDragging ? 'cursor-grabbing opacity-90 scale-105' : 'cursor-grab'
      }`}
    >
      {isMinimized ? (
        /* Minimized Round Floating WhatsApp Button */
        <div className="relative group">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleClick}
            className="w-12 h-12 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white flex items-center justify-center shadow-2xl shadow-emerald-950/50 border-2 border-white/30 transition-all transform hover:scale-110 active:scale-95"
            title="সরাসরি WhatsApp কাউন্সেলিং (ক্লিক করুন)"
          >
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
            </svg>
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-300 rounded-full ring-2 ring-slate-950 animate-ping" />
          </a>

          {/* Expand Button */}
          <button
            type="button"
            data-action="toggle-min"
            onClick={toggleMinimize}
            className="absolute -top-2 -left-2 w-5 h-5 rounded-full bg-slate-900 border border-slate-700 text-slate-300 hover:text-white flex items-center justify-center text-[10px] shadow"
            title="বড় করুন"
          >
            <Maximize2 className="w-2.5 h-2.5" />
          </button>
        </div>
      ) : (
        /* Full Draggable WhatsApp Pill */
        <div className="flex items-center bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-full shadow-2xl shadow-emerald-950/50 border border-white/30 pl-3 pr-2 py-2 gap-2 text-xs font-bold transition-all group">
          
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleClick}
            className="flex items-center gap-2"
            title="সরাসরি ভর্তি কাউন্সেলিং | WhatsApp"
          >
            <div className="relative">
              <svg className="w-5 h-5 fill-current flex-shrink-0 group-hover:rotate-12 transition-transform" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
              </svg>
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-300 rounded-full animate-ping" />
            </div>

            <span className="whitespace-nowrap font-bold">
              ভর্তি কাউন্সেলিং | WhatsApp
            </span>
          </a>

          {/* Drag Grip & Minimize */}
          <div className="flex items-center pl-1 border-l border-white/30 gap-1">
            <button
              type="button"
              data-action="toggle-min"
              onClick={toggleMinimize}
              className="p-1 rounded-full hover:bg-black/20 text-white transition-colors"
              title="মিনিমাইজ করুন"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <div className="cursor-grab active:cursor-grabbing p-0.5 text-white/70 hover:text-white" title="ড্র্যাগ করে সরান">
              <Move className="w-3 h-3" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
