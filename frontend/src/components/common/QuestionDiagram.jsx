import React from 'react';

/**
 * QuestionDiagram renders crisp, exact geometric and trigonometric SVG diagrams for CQ stems and MCQs.
 */
export default function QuestionDiagram({ type, data = {}, className = '' }) {
  if (!type) return null;

  switch (type) {
    // 1. বৃত্তে অন্তর্লিখিত চতুর্ভুজ ও ব্যাস (Cumilla 2025 CQ 4)
    case 'CYCLIC_QUAD_DIAMETER':
      return (
        <div className={`flex flex-col items-center justify-center p-3 bg-white rounded-2xl border border-slate-200/90 shadow-2xs my-2 max-w-sm mx-auto ${className}`}>
          <svg viewBox="0 0 240 200" className="w-48 sm:w-56 h-auto">
            {/* Circle */}
            <circle cx="120" cy="100" r="80" fill="#f8fafc" stroke="#334155" strokeWidth="2.5" />
            {/* Diameter BD */}
            <line x1="45" y1="120" x2="195" y2="80" stroke="#4f46e5" strokeWidth="2.5" strokeDasharray="4 2" />
            {/* Inscribed Quadrilateral ABCD */}
            <polygon points="120,20 45,120 120,180 195,80" fill="rgba(99, 102, 241, 0.08)" stroke="#1e293b" strokeWidth="2" />
            {/* AM perpendicular to BD */}
            <line x1="120" y1="20" x2="115" y2="101" stroke="#dc2626" strokeWidth="1.8" />
            
            {/* Labels */}
            <text x="120" y="14" fontSize="13" fontWeight="bold" fill="#0f172a" textAnchor="middle">A</text>
            <text x="32" y="125" fontSize="13" fontWeight="bold" fill="#0f172a">B</text>
            <text x="120" y="196" fontSize="13" fontWeight="bold" fill="#0f172a" textAnchor="middle">C</text>
            <text x="202" y="85" fontSize="13" fontWeight="bold" fill="#0f172a">D</text>
            <text x="108" y="105" fontSize="11" fontWeight="bold" fill="#dc2626">M</text>
            <text x="145" y="115" fontSize="10" fill="#4f46e5">ব্যাস BD</text>
          </svg>
          <span className="text-[11px] font-bold text-slate-500 mt-1">চিত্র: বৃত্তে অন্তর্লিখিত চতুর্ভুজ ABCD (BD ব্যাস)</span>
        </div>
      );

    // 2. বৃত্তস্থ চতুর্ভুজ ও ছেদবিন্দু (Chattogram 2025 CQ 4)
    case 'CYCLIC_QUAD_MNOP':
      return (
        <div className={`flex flex-col items-center justify-center p-3 bg-white rounded-2xl border border-slate-200/90 shadow-2xs my-2 max-w-sm mx-auto ${className}`}>
          <svg viewBox="0 0 240 200" className="w-48 sm:w-56 h-auto">
            <circle cx="120" cy="100" r="75" fill="#fdf4ff" stroke="#334155" strokeWidth="2.5" />
            <polygon points="120,25 50,120 120,175 190,90" fill="rgba(168, 85, 247, 0.08)" stroke="#7e22ce" strokeWidth="2" />
            {/* Diagonals MO and NP */}
            <line x1="120" y1="25" x2="120" y2="175" stroke="#3b82f6" strokeWidth="1.8" />
            <line x1="50" y1="120" x2="190" y2="90" stroke="#3b82f6" strokeWidth="1.8" />
            
            <text x="120" y="18" fontSize="13" fontWeight="bold" fill="#0f172a" textAnchor="middle">M</text>
            <text x="35" y="125" fontSize="13" fontWeight="bold" fill="#0f172a">N</text>
            <text x="120" y="193" fontSize="13" fontWeight="bold" fill="#0f172a" textAnchor="middle">O</text>
            <text x="198" y="95" fontSize="13" fontWeight="bold" fill="#0f172a">P</text>
            <text x="125" y="112" fontSize="11" fontWeight="bold" fill="#2563eb">T</text>
          </svg>
          <span className="text-[11px] font-bold text-slate-500 mt-1">চিত্র: বৃত্তে অন্তর্লিখিত চতুর্ভুজ MNOP</span>
        </div>
      );

    // 3. ত্রিভুজ ও মধ্যবিন্দুসমূহ (Barishal 2025 CQ 5 / Police Lines 2025 CQ 5)
    case 'TRIANGLE_MIDPOINTS_BARISHAL':
      return (
        <div className={`flex flex-col items-center justify-center p-3 bg-white rounded-2xl border border-slate-200/90 shadow-2xs my-2 max-w-sm mx-auto ${className}`}>
          <svg viewBox="0 0 240 200" className="w-48 sm:w-56 h-auto">
            <polygon points="120,20 30,170 210,170" fill="#f0fdf4" stroke="#166534" strokeWidth="2.5" />
            {/* Midpoints D on AB, E on AC */}
            <line x1="75" y1="95" x2="165" y2="95" stroke="#047857" strokeWidth="2" strokeDasharray="3 2" />
            {/* Lines joining P, Q, R, S */}
            <polygon points="120,95 52,132 120,170 187,132" fill="rgba(16, 185, 129, 0.15)" stroke="#059669" strokeWidth="1.8" />
            
            <text x="120" y="14" fontSize="13" fontWeight="bold" fill="#0f172a" textAnchor="middle">A</text>
            <text x="18" y="175" fontSize="13" fontWeight="bold" fill="#0f172a">B</text>
            <text x="218" y="175" fontSize="13" fontWeight="bold" fill="#0f172a">C</text>
            <text x="60" y="95" fontSize="12" fontWeight="bold" fill="#1e293b">D</text>
            <text x="175" y="95" fontSize="12" fontWeight="bold" fill="#1e293b">E</text>
            <text x="120" y="90" fontSize="11" fontWeight="bold" fill="#047857" textAnchor="middle">P</text>
            <text x="40" y="135" fontSize="11" fontWeight="bold" fill="#047857">Q</text>
            <text x="120" y="185" fontSize="11" fontWeight="bold" fill="#047857" textAnchor="middle">R</text>
            <text x="195" y="135" fontSize="11" fontWeight="bold" fill="#047857">S</text>
          </svg>
          <span className="text-[11px] font-bold text-slate-500 mt-1">চিত্র: ΔABC এবং মধ্যবিন্দুসমূহ D, E, P, Q, R, S</span>
        </div>
      );

    // 4. সমকোণী ত্রিভুজ ও লম্ব অভিক্ষেপ (Jashore 2025 CQ 4)
    case 'CIRCLE_CHORDS_JASHORE':
      return (
        <div className={`flex flex-col items-center justify-center p-3 bg-white rounded-2xl border border-slate-200/90 shadow-2xs my-2 max-w-sm mx-auto ${className}`}>
          <svg viewBox="0 0 240 200" className="w-48 sm:w-56 h-auto">
            <circle cx="120" cy="100" r="75" fill="#f8fafc" stroke="#334155" strokeWidth="2.5" />
            <line x1="45" y1="100" x2="195" y2="100" stroke="#0284c7" strokeWidth="2" />
            <polygon points="120,25 45,100 120,175 195,100" fill="none" stroke="#64748b" strokeWidth="1.5" />
            <line x1="120" y1="25" x2="120" y2="175" stroke="#0284c7" strokeWidth="2" />
            
            <text x="120" y="18" fontSize="13" fontWeight="bold" fill="#0f172a" textAnchor="middle">A</text>
            <text x="32" y="105" fontSize="13" fontWeight="bold" fill="#0f172a">B</text>
            <text x="120" y="193" fontSize="13" fontWeight="bold" fill="#0f172a" textAnchor="middle">C</text>
            <text x="202" y="105" fontSize="13" fontWeight="bold" fill="#0f172a">D</text>
            <text x="108" y="105" fontSize="11" fontWeight="bold" fill="#0369a1">E</text>
            <text x="128" y="145" fontSize="10" fill="#0284c7">P (PD=3, PF=1)</text>
          </svg>
          <span className="text-[11px] font-bold text-slate-500 mt-1">চিত্র: বৃত্তে জ্যা ও স্পর্শক (PD = 3 সে.মি., PF = 1 সে.মি.)</span>
        </div>
      );

    // 5. কার্তেসীয় স্থানাঙ্ক ও ত্রিকোণমিতিক কোণ θ (Barishal 2024 CQ 7 / Govt Lab 2025 CQ 6)
    case 'CARTESIAN_TRIG_ANGLE':
      return (
        <div className={`flex flex-col items-center justify-center p-3 bg-white rounded-2xl border border-slate-200/90 shadow-2xs my-2 max-w-sm mx-auto ${className}`}>
          <svg viewBox="0 0 240 180" className="w-48 sm:w-56 h-auto">
            {/* Axes */}
            <line x1="20" y1="130" x2="220" y2="130" stroke="#64748b" strokeWidth="2" />
            <line x1="70" y1="20" x2="70" y2="160" stroke="#64748b" strokeWidth="2" />
            {/* Arrows */}
            <polyline points="215,125 220,130 215,135" fill="none" stroke="#64748b" strokeWidth="2" />
            <polyline points="65,25 70,20 75,25" fill="none" stroke="#64748b" strokeWidth="2" />
            
            {/* Ray OA */}
            <line x1="70" y1="130" x2="180" y2="40" stroke="#4f46e5" strokeWidth="2.5" />
            {/* Point P(x, y) & Perpendicular PM */}
            <circle cx="150" cy="65" r="4" fill="#dc2626" />
            <line x1="150" y1="65" x2="150" y2="130" stroke="#dc2626" strokeWidth="1.8" strokeDasharray="3 2" />
            
            {/* Angle Arc θ */}
            <path d="M 95 130 A 25 25 0 0 0 90 115" fill="none" stroke="#4f46e5" strokeWidth="2" />
            
            {/* Labels */}
            <text x="225" y="134" fontSize="12" fontWeight="bold" fill="#64748b">X</text>
            <text x="15" y="134" fontSize="12" fontWeight="bold" fill="#64748b">X'</text>
            <text x="70" y="14" fontSize="12" fontWeight="bold" fill="#64748b" textAnchor="middle">Y</text>
            <text x="70" y="174" fontSize="12" fontWeight="bold" fill="#64748b" textAnchor="middle">Y'</text>
            <text x="58" y="144" fontSize="12" fontWeight="bold" fill="#0f172a">O</text>
            <text x="100" y="122" fontSize="12" fontWeight="bold" fill="#4f46e5">θ</text>
            <text x="156" y="60" fontSize="12" fontWeight="bold" fill="#dc2626">P(x, y)</text>
            <text x="150" y="144" fontSize="12" fontWeight="bold" fill="#0f172a" textAnchor="middle">M</text>
            <text x="188" y="38" fontSize="12" fontWeight="bold" fill="#4f46e5">A</text>
          </svg>
          <span className="text-[11px] font-bold text-slate-500 mt-1">চিত্র: কার্তেসীয় সমতলে কোণ θ এবং P(x, y) বিন্দু</span>
        </div>
      );

    // 6. অর্ধবৃত্ত ও ত্রিভুজ (Dhaka 2025 MCQ 5-6)
    case 'SEMICIRCLE_ABC':
      return (
        <div className={`flex flex-col items-center justify-center p-3 bg-white rounded-2xl border border-slate-200/90 shadow-2xs my-2 max-w-sm mx-auto ${className}`}>
          <svg viewBox="0 0 240 140" className="w-48 sm:w-56 h-auto">
            {/* Semicircle */}
            <path d="M 30 110 A 80 80 0 0 1 190 110 Z" fill="#eff6ff" stroke="#1e293b" strokeWidth="2.5" />
            {/* Triangle ABC */}
            <polygon points="110,30 30,110 190,110" fill="none" stroke="#2563eb" strokeWidth="2" />
            <circle cx="110" cy="110" r="3" fill="#0f172a" />
            
            <text x="110" y="24" fontSize="12" fontWeight="bold" fill="#0f172a" textAnchor="middle">A</text>
            <text x="18" y="115" fontSize="12" fontWeight="bold" fill="#0f172a">B</text>
            <text x="198" y="115" fontSize="12" fontWeight="bold" fill="#0f172a">C</text>
            <text x="110" y="125" fontSize="11" fontWeight="bold" fill="#0f172a" textAnchor="middle">O (OB=2.5cm)</text>
          </svg>
          <span className="text-[11px] font-bold text-slate-500 mt-1">চিত্র: O কেন্দ্রবিশিষ্ট অর্ধবৃত্তে OB = 2.5 সে.মি.</span>
        </div>
      );

    // 7. ক্যাপসুল ঘনবস্তু (Rajshahi 2024 MCQ 2-3)
    case 'CAPSULE_3D':
      return (
        <div className={`flex flex-col items-center justify-center p-3 bg-white rounded-2xl border border-slate-200/90 shadow-2xs my-2 max-w-sm mx-auto ${className}`}>
          <svg viewBox="0 0 160 220" className="w-36 h-auto">
            {/* Top Hemisphere */}
            <path d="M 45 60 A 35 35 0 0 1 115 60" fill="#fef3c7" stroke="#b45309" strokeWidth="2.5" />
            {/* Cylinder Body */}
            <rect x="45" y="60" width="70" height="90" fill="#fef3c7" stroke="#b45309" strokeWidth="2.5" />
            {/* Bottom Hemisphere */}
            <path d="M 45 150 A 35 35 0 0 0 115 150" fill="#fef3c7" stroke="#b45309" strokeWidth="2.5" />
            
            {/* Dimension Lines */}
            <line x1="125" y1="60" x2="125" y2="150" stroke="#64748b" strokeWidth="1.5" />
            <text x="138" y="110" fontSize="11" fontWeight="bold" fill="#0f172a">14 cm</text>
            <line x1="45" y1="45" x2="115" y2="45" stroke="#64748b" strokeWidth="1.5" />
            <text x="80" y="38" fontSize="11" fontWeight="bold" fill="#0f172a" textAnchor="middle">r = 3 cm</text>
          </svg>
          <span className="text-[11px] font-bold text-slate-500 mt-1">চিত্র: ক্যাপসুল (বেলন উচ্চতা 14 সে.মি., ব্যাসার্ধ 3 সে.মি.)</span>
        </div>
      );

    // 8. ট্রাপিজিয়াম ও মধ্যসংযোগ রেখা (Rajshahi 2024 MCQ 1)
    case 'TRAPEZOID_MIDLINE':
      return (
        <div className={`flex flex-col items-center justify-center p-3 bg-white rounded-2xl border border-slate-200/90 shadow-2xs my-2 max-w-sm mx-auto ${className}`}>
          <svg viewBox="0 0 240 140" className="w-48 sm:w-56 h-auto">
            <polygon points="60,25 180,25 210,115 30,115" fill="#f1f5f9" stroke="#334155" strokeWidth="2.5" />
            {/* Midline XY */}
            <line x1="45" y1="70" x2="195" y2="70" stroke="#dc2626" strokeWidth="2" strokeDasharray="4 2" />
            
            <text x="55" y="20" fontSize="12" fontWeight="bold" fill="#0f172a">P</text>
            <text x="185" y="20" fontSize="12" fontWeight="bold" fill="#0f172a">S (6 cm)</text>
            <text x="20" y="125" fontSize="12" fontWeight="bold" fill="#0f172a">Q</text>
            <text x="215" y="125" fontSize="12" fontWeight="bold" fill="#0f172a">R (10 cm)</text>
            <text x="32" y="74" fontSize="12" fontWeight="bold" fill="#dc2626">X</text>
            <text x="202" y="74" fontSize="12" fontWeight="bold" fill="#dc2626">Y</text>
          </svg>
          <span className="text-[11px] font-bold text-slate-500 mt-1">চিত্র: ট্রাপিজিয়াম PQRS (PS = 6 cm, QR = 10 cm)</span>
        </div>
      );

    // 9. সমকোণী ত্রিভুজ ও কোণ ৩০° (Mymensingh 2025 MCQ 2-3)
    case 'RIGHT_TRIANGLE_30':
      return (
        <div className={`flex flex-col items-center justify-center p-3 bg-white rounded-2xl border border-slate-200/90 shadow-2xs my-2 max-w-sm mx-auto ${className}`}>
          <svg viewBox="0 0 200 160" className="w-44 h-auto">
            <polygon points="40,20 40,130 160,130" fill="#f8fafc" stroke="#1e293b" strokeWidth="2.5" />
            <rect x="40" y="115" width="15" height="15" fill="none" stroke="#64748b" strokeWidth="1.5" />
            <text x="40" y="14" fontSize="12" fontWeight="bold" fill="#0f172a">D</text>
            <text x="28" y="135" fontSize="12" fontWeight="bold" fill="#0f172a">E</text>
            <text x="165" y="135" fontSize="12" fontWeight="bold" fill="#0f172a">F</text>
            <text x="120" y="125" fontSize="11" fontWeight="bold" fill="#4f46e5">30°</text>
            <text x="18" y="75" fontSize="11" fontWeight="bold" fill="#0f172a">6 cm</text>
          </svg>
          <span className="text-[11px] font-bold text-slate-500 mt-1">চিত্র: সমকোণী ΔDEF (DF = 6 সে.মি., ∠F = 30°)</span>
        </div>
      );

    // 10. বর্গ ও মধ্যবিন্দুসমূহ (Jhenaidah Cadet College 2025 CQ 5)
    case 'SQUARE_MIDPOINTS':
      return (
        <div className={`flex flex-col items-center justify-center p-3 bg-white rounded-2xl border border-slate-200/90 shadow-2xs my-2 max-w-sm mx-auto ${className}`}>
          <svg viewBox="0 0 200 200" className="w-44 h-auto">
            <rect x="30" y="30" width="140" height="140" fill="#faf5ff" stroke="#581c87" strokeWidth="2.5" />
            <polygon points="100,30 170,100 100,170 30,100" fill="rgba(147, 51, 234, 0.12)" stroke="#9333ea" strokeWidth="2" />
            
            <text x="20" y="30" fontSize="13" fontWeight="bold" fill="#0f172a">A</text>
            <text x="175" y="30" fontSize="13" fontWeight="bold" fill="#0f172a">B</text>
            <text x="175" y="185" fontSize="13" fontWeight="bold" fill="#0f172a">C</text>
            <text x="20" y="185" fontSize="13" fontWeight="bold" fill="#0f172a">D</text>
            <text x="100" y="24" fontSize="12" fontWeight="bold" fill="#7e22ce" textAnchor="middle">P</text>
            <text x="178" y="105" fontSize="12" fontWeight="bold" fill="#7e22ce">Q</text>
            <text x="100" y="186" fontSize="12" fontWeight="bold" fill="#7e22ce" textAnchor="middle">R</text>
            <text x="18" y="105" fontSize="12" fontWeight="bold" fill="#7e22ce">S</text>
          </svg>
          <span className="text-[11px] font-bold text-slate-500 mt-1">চিত্র: বর্গ ABCD এবং মধ্যবিন্দুসমূহ P, Q, R, S</span>
        </div>
      );

    // Default Fallback
    default:
      return null;
  }
}
