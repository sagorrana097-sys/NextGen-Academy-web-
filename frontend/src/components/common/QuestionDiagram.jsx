import React from 'react';

/**
 * QuestionDiagram renders crisp, scalable vector SVG diagrams for both Mathematics and Physics.
 */
export default function QuestionDiagram({ type, data = {}, className = '' }) {
  if (!type) return null;

  switch (type) {
    // -------------------------------------------------------------
    // PHYSICS DIAGRAMS
    // -------------------------------------------------------------
    
    // 1. মুখোমুখি সংঘর্ষ (Collision Head-on)
    case 'COLLISION_HEAD_ON':
      return (
        <div className={`flex flex-col items-center justify-center p-3 bg-white rounded-2xl border border-slate-200/90 shadow-2xs my-2 max-w-md mx-auto ${className}`}>
          <svg viewBox="0 0 320 120" className="w-64 sm:w-72 h-auto">
            {/* Ground line */}
            <line x1="20" y1="90" x2="300" y2="90" stroke="#94a3b8" strokeWidth="2" />
            
            {/* Ball A */}
            <circle cx="80" cy="65" r="25" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="2" />
            <text x="80" y="70" fontSize="13" fontWeight="bold" fill="#ffffff" textAnchor="middle">A</text>
            <text x="80" y="30" fontSize="11" fontWeight="bold" fill="#1e293b" textAnchor="middle">m₁ = 12 kg</text>
            
            {/* Arrow A */}
            <line x1="110" y1="65" x2="145" y2="65" stroke="#ef4444" strokeWidth="2.5" markerEnd="url(#arrow)" />
            <polygon points="145,61 155,65 145,69" fill="#ef4444" />
            <text x="130" y="55" fontSize="10" fontWeight="bold" fill="#ef4444" textAnchor="middle">u₁ = 10 m/s</text>

            {/* Ball B */}
            <circle cx="230" cy="70" r="20" fill="#10b981" stroke="#047857" strokeWidth="2" />
            <text x="230" y="75" fontSize="12" fontWeight="bold" fill="#ffffff" textAnchor="middle">B</text>
            <text x="230" y="35" fontSize="11" fontWeight="bold" fill="#1e293b" textAnchor="middle">m₂ = 8 kg</text>
            
            {/* Arrow B */}
            <line x1="255" y1="70" x2="280" y2="70" stroke="#ef4444" strokeWidth="2.5" />
            <polygon points="280,66 290,70 280,74" fill="#ef4444" />
            <text x="270" y="60" fontSize="10" fontWeight="bold" fill="#ef4444" textAnchor="middle">u₂ = 5 m/s</text>
          </svg>
          <span className="text-[11px] font-bold text-slate-500 mt-1">চিত্র: দুটি গতিশীল বস্তুর সংঘর্ষের রূপরেখা</span>
        </div>
      );

    // 2. উচ্চতা ও মুক্তভাবে পড়ন্ত বস্তু (Free Fall Divided Height)
    case 'FREE_FALL_DIVIDED_HEIGHT':
      return (
        <div className={`flex flex-col items-center justify-center p-3 bg-white rounded-2xl border border-slate-200/90 shadow-2xs my-2 max-w-sm mx-auto ${className}`}>
          <svg viewBox="0 0 200 240" className="w-44 sm:w-52 h-auto">
            {/* Height vertical line */}
            <line x1="60" y1="30" x2="60" y2="210" stroke="#64748b" strokeWidth="2" strokeDasharray="4 2" />
            <line x1="45" y1="30" x2="75" y2="30" stroke="#64748b" strokeWidth="2" />
            <line x1="45" y1="210" x2="75" y2="210" stroke="#64748b" strokeWidth="2" />
            
            {/* Height label */}
            <text x="35" y="125" fontSize="11" fontWeight="bold" fill="#6366f1" textAnchor="middle" transform="rotate(-90 35 125)">100 m</text>

            {/* Mass at top */}
            <circle cx="120" cy="30" r="14" fill="#ef4444" stroke="#b91c1c" strokeWidth="2" />
            <text x="120" y="34" fontSize="10" fontWeight="bold" fill="#ffffff" textAnchor="middle">10 kg</text>

            {/* Points P, Q, R, S, T, O */}
            <circle cx="120" cy="30" r="3" fill="#0f172a" />
            <text x="140" y="34" fontSize="11" fontWeight="bold" fill="#0f172a">P</text>
            
            <circle cx="120" cy="66" r="3" fill="#0f172a" />
            <text x="140" y="70" fontSize="11" fontWeight="bold" fill="#0f172a">Q</text>
            
            <circle cx="120" cy="102" r="3" fill="#0f172a" />
            <text x="140" y="106" fontSize="11" fontWeight="bold" fill="#0f172a">R</text>
            
            <circle cx="120" cy="138" r="3" fill="#0f172a" />
            <text x="140" y="142" fontSize="11" fontWeight="bold" fill="#0f172a">S</text>
            
            <circle cx="120" cy="174" r="3" fill="#0f172a" />
            <text x="140" y="178" fontSize="11" fontWeight="bold" fill="#0f172a">T</text>
            
            {/* Ground */}
            <line x1="90" y1="210" x2="160" y2="210" stroke="#0f172a" strokeWidth="3" />
            <text x="140" y="214" fontSize="11" fontWeight="bold" fill="#0f172a">O (ভূমি)</text>
          </svg>
          <span className="text-[11px] font-bold text-slate-500 mt-1">চিত্র: উচ্চতা থেকে পড়ন্ত বস্তুর বিভিন্ন বিন্দু</span>
        </div>
      );

    // 3. তরঙ্গ সঞ্চালন ও তরঙ্গদৈর্ঘ্য (Wave Propagation)
    case 'WAVE_PROPAGATION_TRANSVERSE':
      return (
        <div className={`flex flex-col items-center justify-center p-3 bg-white rounded-2xl border border-slate-200/90 shadow-2xs my-2 max-w-md mx-auto ${className}`}>
          <svg viewBox="0 0 320 130" className="w-64 sm:w-72 h-auto">
            {/* Equilibrium line */}
            <line x1="20" y1="65" x2="300" y2="65" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="3 3" />
            
            {/* Sine wave path */}
            <path d="M 30,65 Q 65,15 100,65 T 170,65 T 240,65 T 300,65" fill="none" stroke="#2563eb" strokeWidth="2.5" />
            
            {/* Nodes and Antinodes */}
            <circle cx="30" cy="65" r="4" fill="#1e293b" />
            <text x="30" y="85" fontSize="11" fontWeight="bold" fill="#1e293b" textAnchor="middle">A</text>
            
            <circle cx="100" cy="65" r="4" fill="#1e293b" />
            <text x="100" y="85" fontSize="11" fontWeight="bold" fill="#1e293b" textAnchor="middle">B</text>
            
            <circle cx="170" cy="65" r="4" fill="#1e293b" />
            <text x="170" y="85" fontSize="11" fontWeight="bold" fill="#1e293b" textAnchor="middle">C</text>
            
            <circle cx="240" cy="65" r="4" fill="#1e293b" />
            <text x="240" y="85" fontSize="11" fontWeight="bold" fill="#1e293b" textAnchor="middle">D</text>

            {/* Length marker */}
            <line x1="30" y1="110" x2="240" y2="110" stroke="#6366f1" strokeWidth="1.5" />
            <line x1="30" y1="105" x2="30" y2="115" stroke="#6366f1" strokeWidth="1.5" />
            <line x1="240" y1="105" x2="240" y2="115" stroke="#6366f1" strokeWidth="1.5" />
            <text x="135" y="105" fontSize="11" fontWeight="bold" fill="#6366f1" textAnchor="middle">3 m</text>
            
            {/* Direction arrow */}
            <line x1="240" y1="25" x2="290" y2="25" stroke="#ef4444" strokeWidth="2" />
            <polygon points="290,21 300,25 290,29" fill="#ef4444" />
            <text x="265" y="18" fontSize="9" fontWeight="bold" fill="#ef4444" textAnchor="middle">তরঙ্গ প্রবাহের দিক</text>
          </svg>
          <span className="text-[11px] font-bold text-slate-500 mt-1">চিত্র: অনুপ্রস্থ তরঙ্গ সঞ্চালন (A হতে C সময় = 0.2 s)</span>
        </div>
      );

    // 4. অবতল দর্পণ ও প্রতিবিম্ব গঠন (Concave Mirror Optics)
    case 'CONCAVE_MIRROR_OBJECT_IMAGE':
      return (
        <div className={`flex flex-col items-center justify-center p-3 bg-white rounded-2xl border border-slate-200/90 shadow-2xs my-2 max-w-sm mx-auto ${className}`}>
          <svg viewBox="0 0 280 150" className="w-56 sm:w-64 h-auto">
            {/* Principal Axis */}
            <line x1="20" y1="75" x2="260" y2="75" stroke="#334155" strokeWidth="2" />
            
            {/* Concave Mirror Arc */}
            <path d="M 220,20 A 90 90 0 0 1 220,130" fill="none" stroke="#4338ca" strokeWidth="4" />
            {/* Silvering marks */}
            <line x1="222" y1="25" x2="228" y2="20" stroke="#94a3b8" strokeWidth="1.5" />
            <line x1="225" y1="50" x2="231" y2="45" stroke="#94a3b8" strokeWidth="1.5" />
            <line x1="227" y1="75" x2="233" y2="70" stroke="#94a3b8" strokeWidth="1.5" />
            <line x1="225" y1="100" x2="231" y2="95" stroke="#94a3b8" strokeWidth="1.5" />
            <line x1="222" y1="125" x2="228" y2="120" stroke="#94a3b8" strokeWidth="1.5" />

            {/* Mirror Labels M, M', P */}
            <text x="210" y="16" fontSize="11" fontWeight="bold" fill="#1e293b">M</text>
            <text x="210" y="142" fontSize="11" fontWeight="bold" fill="#1e293b">M'</text>
            <text x="232" y="80" fontSize="12" fontWeight="bold" fill="#4338ca">P</text>

            {/* Focus F and Center C */}
            <circle cx="160" cy="75" r="3" fill="#dc2626" />
            <text x="160" y="93" fontSize="11" fontWeight="bold" fill="#dc2626" textAnchor="middle">F</text>
            
            <circle cx="100" cy="75" r="3" fill="#2563eb" />
            <text x="100" y="93" fontSize="11" fontWeight="bold" fill="#2563eb" textAnchor="middle">C</text>

            {/* Object at u = 15 cm (between C and F) */}
            <line x1="130" y1="75" x2="130" y2="35" stroke="#16a34a" strokeWidth="3" />
            <polygon points="126,35 130,25 134,35" fill="#16a34a" />
            <text x="130" y="93" fontSize="11" fontWeight="bold" fill="#16a34a" textAnchor="middle">O</text>
          </svg>
          <span className="text-[11px] font-bold text-slate-500 mt-1">চিত্র: অবতল দর্পণ (OC = 20 cm, OQ = 15 cm)</span>
        </div>
      );

    // 5. কুলম্বের সূত্র ও চার্জ ব্যবস্থা (Point Charges Coulomb)
    case 'POINT_CHARGES_COULOMB':
      return (
        <div className={`flex flex-col items-center justify-center p-3 bg-white rounded-2xl border border-slate-200/90 shadow-2xs my-2 max-w-sm mx-auto ${className}`}>
          <svg viewBox="0 0 280 100" className="w-56 sm:w-64 h-auto">
            {/* Connecting line */}
            <line x1="50" y1="50" x2="230" y2="50" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4 2" />
            
            {/* Charge A (+50 C) */}
            <circle cx="50" cy="50" r="22" fill="#ef4444" stroke="#b91c1c" strokeWidth="2" />
            <text x="50" y="54" fontSize="11" fontWeight="bold" fill="#ffffff" textAnchor="middle">+50 C</text>
            <text x="50" y="85" fontSize="12" fontWeight="bold" fill="#0f172a" textAnchor="middle">A</text>

            {/* Charge B (+25 C) */}
            <circle cx="230" cy="50" r="18" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="2" />
            <text x="230" y="54" fontSize="10" fontWeight="bold" fill="#ffffff" textAnchor="middle">+25 C</text>
            <text x="230" y="85" fontSize="12" fontWeight="bold" fill="#0f172a" textAnchor="middle">B</text>

            {/* Distance label */}
            <line x1="50" y1="20" x2="230" y2="20" stroke="#6366f1" strokeWidth="1.5" />
            <line x1="50" y1="15" x2="50" y2="25" stroke="#6366f1" strokeWidth="1.5" />
            <line x1="230" y1="15" x2="230" y2="25" stroke="#6366f1" strokeWidth="1.5" />
            <text x="140" y="15" fontSize="11" fontWeight="bold" fill="#6366f1" textAnchor="middle">100 cm</text>
          </svg>
          <span className="text-[11px] font-bold text-slate-500 mt-1">চিত্র: দুটি বিন্দু আধান ব্যবস্থা (+50 C ও +25 C)</span>
        </div>
      );

    // 6. ট্রান্সফরমার স্কিম্যাটিক (Transformer Circuit)
    case 'TRANSFORMER_SCHEMATIC':
      return (
        <div className={`flex flex-col items-center justify-center p-3 bg-white rounded-2xl border border-slate-200/90 shadow-2xs my-2 max-w-sm mx-auto ${className}`}>
          <svg viewBox="0 0 260 140" className="w-52 sm:w-60 h-auto">
            {/* Core */}
            <rect x="100" y="20" width="60" height="100" rx="4" fill="#f1f5f9" stroke="#334155" strokeWidth="2.5" />
            <rect x="115" y="35" width="30" height="70" rx="2" fill="#ffffff" stroke="#334155" strokeWidth="2" />

            {/* Primary Coil (Left) */}
            <path d="M 60,35 Q 90,40 100,45 Q 90,55 100,65 Q 90,75 100,85 Q 90,95 60,100" fill="none" stroke="#dc2626" strokeWidth="3" />
            <text x="40" y="45" fontSize="10" fontWeight="bold" fill="#dc2626">V₁ = 440 V</text>
            <text x="40" y="65" fontSize="10" fontWeight="bold" fill="#dc2626">n₁ = 100</text>
            <text x="40" y="85" fontSize="10" fontWeight="bold" fill="#dc2626">I₁ = 2 A</text>

            {/* Secondary Coil (Right) */}
            <path d="M 200,45 Q 170,55 160,65 Q 170,75 160,85 Q 170,95 200,100" fill="none" stroke="#2563eb" strokeWidth="3" />
            <text x="210" y="70" fontSize="10" fontWeight="bold" fill="#2563eb">I₂ = 5 A</text>
            <text x="210" y="90" fontSize="10" fontWeight="bold" fill="#2563eb">1000 W মোটর</text>
          </svg>
          <span className="text-[11px] font-bold text-slate-500 mt-1">চিত্র: বৈদ্যুতিক ট্রান্সফরমার বর্তনী</span>
        </div>
      );

    // 7. সরণ-সময় লেখচিত্র (Displacement-Time Graph)
    case 'GRAPH_DISPLACEMENT_TIME':
      return (
        <div className={`flex flex-col items-center justify-center p-3 bg-white rounded-2xl border border-slate-200/90 shadow-2xs my-2 max-w-sm mx-auto ${className}`}>
          <svg viewBox="0 0 260 180" className="w-52 sm:w-60 h-auto">
            {/* Axes */}
            <line x1="40" y1="150" x2="240" y2="150" stroke="#0f172a" strokeWidth="2" markerEnd="url(#arrow)" />
            <line x1="40" y1="150" x2="40" y2="20" stroke="#0f172a" strokeWidth="2" markerEnd="url(#arrow)" />
            <text x="240" y="165" fontSize="11" fontWeight="bold" fill="#0f172a">সময় (s)</text>
            <text x="25" y="25" fontSize="11" fontWeight="bold" fill="#0f172a" transform="rotate(-90 25 25)">সরণ (m)</text>

            {/* Curve */}
            <path d="M 40,150 Q 110,135 150,90 L 190,45 L 220,30" fill="none" stroke="#6366f1" strokeWidth="2.5" />
            
            {/* Points */}
            <circle cx="40" cy="150" r="3" fill="#0f172a" />
            <text x="32" y="165" fontSize="10">O</text>
            
            <circle cx="150" cy="90" r="3.5" fill="#ef4444" />
            <text x="150" y="80" fontSize="11" fontWeight="bold" fill="#ef4444">C (8s, 45m)</text>
            
            <circle cx="190" cy="45" r="3.5" fill="#2563eb" />
            <text x="190" y="38" fontSize="11" fontWeight="bold" fill="#2563eb">D (12s, 105m)</text>
          </svg>
          <span className="text-[11px] font-bold text-slate-500 mt-1">চিত্র: সরণ বনাম সময় লেখচিত্র (OC সমত্বরণ)</span>
        </div>
      );

    // 8. হাইড্রোলিক প্রেস সিলিন্ডার (Hydraulic Press)
    case 'HYDRAULIC_PRESS_CYLINDERS':
      return (
        <div className={`flex flex-col items-center justify-center p-3 bg-white rounded-2xl border border-slate-200/90 shadow-2xs my-2 max-w-sm mx-auto ${className}`}>
          <svg viewBox="0 0 260 150" className="w-52 sm:w-60 h-auto">
            {/* Fluid reservoir */}
            <path d="M 40,50 L 40,120 L 220,120 L 220,40 L 170,40 L 170,90 L 90,90 L 90,50 Z" fill="#e0f2fe" stroke="#0284c7" strokeWidth="2" />

            {/* Small piston */}
            <rect x="42" y="45" width="46" height="15" fill="#64748b" stroke="#334155" strokeWidth="1.5" />
            <line x1="65" y1="15" x2="65" y2="45" stroke="#ef4444" strokeWidth="2.5" />
            <polygon points="61,35 65,45 69,35" fill="#ef4444" />
            <text x="65" y="12" fontSize="10" fontWeight="bold" fill="#ef4444" textAnchor="middle">F₁ = 250 N</text>
            <text x="65" y="75" fontSize="9" fontWeight="bold" fill="#0369a1" textAnchor="middle">A₁=6 cm²</text>

            {/* Large piston with load P */}
            <rect x="172" y="35" width="46" height="18" fill="#64748b" stroke="#334155" strokeWidth="1.5" />
            <circle cx="195" cy="18" r="14" fill="#10b981" stroke="#047857" strokeWidth="1.5" />
            <text x="195" y="22" fontSize="9" fontWeight="bold" fill="#ffffff" textAnchor="middle">P=250kg</text>
            <text x="195" y="65" fontSize="9" fontWeight="bold" fill="#0369a1" textAnchor="middle">A₂=30 cm²</text>
          </svg>
          <span className="text-[11px] font-bold text-slate-500 mt-1">চিত্র: হাইড্রোলিক প্রেস ও পিস্টন ব্যবস্থা</span>
        </div>
      );

    // -------------------------------------------------------------
    // MATHEMATICS & GEOMETRY DIAGRAMS
    // -------------------------------------------------------------

    // 9. বৃত্তস্থ চতুর্ভুজ ও ব্যাস (Cyclic Quadrilateral)
    case 'CYCLIC_QUAD_DIAMETER':
      return (
        <div className={`flex flex-col items-center justify-center p-3 bg-white rounded-2xl border border-slate-200/90 shadow-2xs my-2 max-w-xs mx-auto ${className}`}>
          <svg viewBox="0 0 200 200" className="w-44 sm:w-48 h-auto">
            <circle cx="100" cy="100" r="70" fill="#f8fafc" stroke="#3b82f6" strokeWidth="2.5" />
            <circle cx="100" cy="100" r="3" fill="#ef4444" />
            <text x="100" y="93" fontSize="11" fontWeight="bold" fill="#ef4444" textAnchor="middle">O</text>
            
            {/* Inscribed Quadrilateral ABCD */}
            <polygon points="100,30 170,100 100,170 30,100" fill="rgba(99, 102, 241, 0.08)" stroke="#4338ca" strokeWidth="2" />
            <text x="100" y="23" fontSize="11" fontWeight="bold" fill="#0f172a" textAnchor="middle">A</text>
            <text x="183" y="104" fontSize="11" fontWeight="bold" fill="#0f172a">B</text>
            <text x="100" y="185" fontSize="11" fontWeight="bold" fill="#0f172a" textAnchor="middle">C</text>
            <text x="18" y="104" fontSize="11" fontWeight="bold" fill="#0f172a">D</text>

            {/* Diagonals */}
            <line x1="100" y1="30" x2="100" y2="170" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="3 3" />
            <line x1="30" y1="100" x2="170" y2="100" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="3 3" />
          </svg>
          <span className="text-[11px] font-bold text-slate-500 mt-1">চিত্র: বৃত্তে অন্তর্লিখিত চতুর্ভুজ ও কর্ণ ব্যবস্থা</span>
        </div>
      );

    // 10. গাছ ভাঙা ও দূরত্ব-উচ্চতা (Broken Tree Height Distance)
    case 'BROKEN_TREE_DISTANCE':
      return (
        <div className={`flex flex-col items-center justify-center p-3 bg-white rounded-2xl border border-slate-200/90 shadow-2xs my-2 max-w-sm mx-auto ${className}`}>
          <svg viewBox="0 0 240 160" className="w-52 sm:w-60 h-auto">
            {/* Ground */}
            <line x1="30" y1="130" x2="210" y2="130" stroke="#334155" strokeWidth="2" />
            
            {/* Standing tree part */}
            <line x1="60" y1="130" x2="60" y2="60" stroke="#16a34a" strokeWidth="4" />
            <text x="45" y="95" fontSize="11" fontWeight="bold" fill="#16a34a">h</text>
            <text x="60" y="145" fontSize="11" fontWeight="bold" fill="#0f172a" textAnchor="middle">B (গোড়া)</text>
            <text x="60" y="52" fontSize="11" fontWeight="bold" fill="#0f172a" textAnchor="middle">A (ভাঙা অংশ)</text>

            {/* Broken part touching ground */}
            <line x1="60" y1="60" x2="180" y2="130" stroke="#ca8a04" strokeWidth="3" strokeDasharray="4 2" />
            <text x="130" y="85" fontSize="11" fontWeight="bold" fill="#ca8a04">x</text>
            <text x="180" y="145" fontSize="11" fontWeight="bold" fill="#0f172a" textAnchor="middle">C</text>

            {/* Angle at top */}
            <path d="M 60,80 A 20 20 0 0 0 75,69" fill="none" stroke="#dc2626" strokeWidth="1.5" />
            <text x="80" y="80" fontSize="10" fontWeight="bold" fill="#dc2626">30°</text>

            {/* Distance BC = 18m */}
            <line x1="60" y1="140" x2="180" y2="140" stroke="#6366f1" strokeWidth="1.5" />
            <text x="120" y="153" fontSize="10" fontWeight="bold" fill="#6366f1" textAnchor="middle">18 m</text>
          </svg>
          <span className="text-[11px] font-bold text-slate-500 mt-1">চিত্র: ঝড়ে গাছ ভেঙে ভূমি স্পর্শের জ্যামিতিক চিত্র</span>
        </div>
      );

    // 11. স্থানাঙ্ক জ্যামিতি ও ত্রিভুজ (Coordinate Triangle)
    case 'COORDINATE_GEOMETRY_QUADRILATERAL':
      return (
        <div className={`flex flex-col items-center justify-center p-3 bg-white rounded-2xl border border-slate-200/90 shadow-2xs my-2 max-w-sm mx-auto ${className}`}>
          <svg viewBox="0 0 240 180" className="w-52 sm:w-60 h-auto">
            {/* Coordinate axes */}
            <line x1="20" y1="100" x2="220" y2="100" stroke="#94a3b8" strokeWidth="1.5" />
            <line x1="120" y1="10" x2="120" y2="170" stroke="#94a3b8" strokeWidth="1.5" />
            <text x="220" y="95" fontSize="10" fill="#64748b">X</text>
            <text x="125" y="20" fontSize="10" fill="#64748b">Y</text>
            <text x="110" y="112" fontSize="10" fill="#64748b">O</text>

            {/* Polygon points */}
            <polygon points="120,85 100,50 180,20 200,50" fill="rgba(59, 130, 246, 0.15)" stroke="#2563eb" strokeWidth="2" />
            <circle cx="120" cy="85" r="3" fill="#ef4444" />
            <text x="115" y="78" fontSize="9" fontWeight="bold" fill="#0f172a">A(0,-1)</text>
            <circle cx="100" cy="50" r="3" fill="#ef4444" />
            <text x="65" y="48" fontSize="9" fontWeight="bold" fill="#0f172a">B(-2,3)</text>
            <circle cx="180" cy="20" r="3" fill="#ef4444" />
            <text x="180" y="15" fontSize="9" fontWeight="bold" fill="#0f172a">C(6,7)</text>
            <circle cx="200" cy="50" r="3" fill="#ef4444" />
            <text x="202" y="55" fontSize="9" fontWeight="bold" fill="#0f172a">D(8,3)</text>
          </svg>
          <span className="text-[11px] font-bold text-slate-500 mt-1">চিত্র: স্থানাঙ্ক তলে চতুর্ভুজ ABCD</span>
        </div>
      );

    default:
      return null;
  }
}

