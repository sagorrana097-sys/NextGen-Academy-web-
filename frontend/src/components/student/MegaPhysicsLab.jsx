import React, { useState, useEffect, useRef, Suspense } from 'react';
import { fabric } from 'fabric';
import { Canvas as ThreeCanvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Box, Cylinder, Torus, Text } from '@react-three/drei';
import * as THREE from 'three';
import {
  Zap, Waves, Eye, Magnet, Thermometer, Ruler,
  Download, Loader2, ChevronDown, ChevronUp, Brain, Calculator,
  Play, Pause, RefreshCw, Rotate3d, Move, Sliders, Layers, Maximize2
} from 'lucide-react';
import { exportBrandedGraphic } from '../../utils/exportBrandedGraphic';

// ============================================================
// BRANDING CONSTANTS
// ============================================================
const BRAND = {
  academy: 'NextGen Academy',
  director: 'মো: আলমগীর হোসেন (সাগর)',
  phone: '০১৭৯২৮১৮০০৫',
  address: 'পশ্চিম জয়দেবপুর, বাস-স্ট্যান্ড, গাজীপুর'
};

// ============================================================
// SHARED: Formula Proof Panel
// ============================================================
function FormulaProofPanel({ steps }) {
  return (
    <div className="bg-slate-950 border border-emerald-500/20 rounded-2xl p-4 space-y-2">
      <h4 className="text-[11px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
        <Calculator className="w-3.5 h-3.5" />
        সূত্র প্রমাণ ও লাইভ হিসাব (Real-Time Proof)
      </h4>
      <div className="space-y-1">
        {steps.map((step, i) => (
          <div key={i} className={`text-xs font-mono ${step.highlight ? 'text-emerald-300 font-bold' : 'text-slate-400'}`}>
            {step.highlight ? '➤ ' : '  '}{step.text}
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// SHARED: AI Concept Card
// ============================================================
function AIConceptCard({ text }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="bg-gradient-to-r from-indigo-950/40 to-slate-900 border border-indigo-500/30 rounded-2xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between p-3 text-xs font-black text-indigo-300"
      >
        <div className="flex items-center gap-1.5">
          <Brain className="w-3.5 h-3.5 text-indigo-400" />
          <span>AI ফিজিক্স কনসেপ্ট ও বাস্তব প্রয়োগ (Smart Summary)</span>
        </div>
        {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>
      {open && (
        <div className="px-4 pb-4 text-xs text-indigo-200 leading-relaxed space-y-2">
          {text}
        </div>
      )}
    </div>
  );
}

// ============================================================
// 3D VIEW: 360-Degree OrbitControls Pendulum & Optics Model
// ============================================================
function ThreeDPendulumModel({ length, angle }) {
  const meshRef = useRef();
  const rad = (angle * Math.PI) / 180;
  const bobX = Math.sin(rad) * length * 0.4;
  const bobY = -Math.cos(rad) * length * 0.4;

  return (
    <group position={[0, 2, 0]}>
      {/* Ceiling stand */}
      <Box args={[3, 0.2, 1]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#475569" metalness={0.8} />
      </Box>
      {/* Pivot */}
      <Sphere args={[0.15, 16, 16]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#f59e0b" />
      </Sphere>
      {/* String */}
      <Cylinder
        args={[0.02, 0.02, length * 0.4, 8]}
        position={[bobX / 2, bobY / 2, 0]}
        rotation={[0, 0, -rad]}
      >
        <meshStandardMaterial color="#94a3b8" />
      </Cylinder>
      {/* Bob */}
      <Sphere args={[0.35, 32, 32]} position={[bobX, bobY, 0]}>
        <meshStandardMaterial color="#f43f5e" metalness={0.6} roughness={0.2} />
      </Sphere>
    </group>
  );
}

// ============================================================
// MODULE 1: MEASUREMENT (Vernier Calipers & Screw Gauge - Fabric.js)
// ============================================================
function MeasurementModule() {
  const canvasRef = useRef(null);
  const fabricRef = useRef(null);
  const [vernierPos, setVernierPos] = useState(2.4); // cm
  const [screwAngle, setScrewAngle] = useState(72); // degrees
  const [activeTool, setActiveTool] = useState('vernier'); // 'vernier' | 'screw'

  const vernierLC = 0.01;
  const mainScale = Math.floor(vernierPos);
  const vernierDiv = Math.round(((vernierPos - mainScale) / vernierLC) % 10);
  const totalReading = (mainScale + vernierDiv * vernierLC).toFixed(2);

  // Initialize Fabric Canvas for Vernier
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = new fabric.Canvas(canvasRef.current, {
      width: 500,
      height: 180,
      backgroundColor: '#0f172a',
      selection: true,
    });
    fabricRef.current = canvas;

    // Static Main Scale
    const mainBar = new fabric.Rect({
      left: 20,
      top: 50,
      width: 440,
      height: 40,
      fill: '#1e293b',
      stroke: '#38bdf8',
      strokeWidth: 2,
      rx: 4,
      ry: 4,
      selectable: false,
    });
    canvas.add(mainBar);

    // Fixed Jaw
    const fixedJaw = new fabric.Rect({
      left: 20,
      top: 90,
      width: 14,
      height: 70,
      fill: '#0284c7',
      selectable: false,
    });
    canvas.add(fixedJaw);

    // Main Scale Markings
    for (let i = 0; i <= 10; i++) {
      const x = 50 + i * 36;
      const line = new fabric.Line([x, 50, x, 65], {
        stroke: '#94a3b8',
        strokeWidth: 1.5,
        selectable: false,
      });
      const text = new fabric.Text(i.toString(), {
        left: x - 4,
        top: 68,
        fontSize: 10,
        fill: '#94a3b8',
        selectable: false,
      });
      canvas.add(line, text);
    }

    // Draggable Vernier Sliding Jaw (Group)
    const vernierWidth = 72;
    const vernierBar = new fabric.Rect({
      left: 0,
      top: 0,
      width: vernierWidth,
      height: 34,
      fill: 'rgba(244, 63, 94, 0.4)',
      stroke: '#f43f5e',
      strokeWidth: 2,
      rx: 3,
    });
    const movableJaw = new fabric.Rect({
      left: 0,
      top: 34,
      width: 12,
      height: 70,
      fill: '#f43f5e',
    });
    const label = new fabric.Text('ভার্নিয়ার', {
      left: 18,
      top: 10,
      fontSize: 9,
      fill: '#ffffff',
      fontWeight: 'bold',
    });

    const slidingGroup = new fabric.Group([vernierBar, movableJaw, label], {
      left: 50 + (vernierPos * 36),
      top: 54,
      hasControls: true,
      hasBorders: true,
      lockMovementY: true,
      lockRotation: true,
    });

    slidingGroup.on('moving', (e) => {
      let l = slidingGroup.left;
      if (l < 50) l = 50;
      if (l > 400) l = 400;
      slidingGroup.left = l;
      const calcCm = ((l - 50) / 36);
      setVernierPos(Math.max(0, calcCm));
    });

    canvas.add(slidingGroup);
    canvas.renderAll();

    return () => {
      canvas.dispose();
    };
  }, []);

  // Sync slider to Fabric object
  const handleSliderChange = (newVal) => {
    setVernierPos(newVal);
    if (fabricRef.current) {
      const objs = fabricRef.current.getObjects();
      const sliderObj = objs.find(o => o.type === 'group');
      if (sliderObj) {
        sliderObj.set({ left: 50 + newVal * 36 });
        fabricRef.current.renderAll();
      }
    }
  };

  const steps = [
    { text: 'ভার্নিয়ার ধ্রুবক (VC) = 1 মিমি / 10 = 0.1 মিমি = 0.01 সেমি' },
    { text: `প্রধান স্কেল পাঠ (M) = ${mainScale} সেমি` },
    { text: `ভার্নিয়ার সমপাতন (V) = ${vernierDiv} নং দাগ` },
    { text: `ভার্নিয়ার পাঠ = ${vernierDiv} × 0.01 = ${(vernierDiv * 0.01).toFixed(2)} সেমি` },
    { text: `মোট দৈর্ঘ্য (L) = M + (V × VC) = ${totalReading} সেমি`, highlight: true },
  ];

  return (
    <div className="space-y-4">
      <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-bold text-white">
            <Ruler className="w-4 h-4 text-sky-400" />
            <span>ভার্নিয়ার ক্যালিপার্স: ক্যানভাসে সরাসরি টেনে ধরুন (Direct Drag-and-Drop)</span>
          </div>
          <span className="px-3 py-1 bg-sky-950/60 border border-sky-500/30 text-sky-300 font-mono text-xs font-bold rounded-full">
            পাঠ: {totalReading} cm
          </span>
        </div>

        <div className="overflow-x-auto flex justify-center p-3 bg-slate-900 rounded-2xl border border-slate-800">
          <canvas ref={canvasRef} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="space-y-2">
            <label className="text-slate-400 font-bold block">
              স্লাইডার দিয়ে সমন্বয় (Two-Way Sync): <span className="font-mono text-sky-400">{vernierPos.toFixed(2)} cm</span>
            </label>
            <input
              type="range"
              min="0"
              max="9"
              step="0.05"
              value={vernierPos}
              onChange={(e) => handleSliderChange(parseFloat(e.target.value))}
              className="w-full accent-sky-500"
            />
          </div>
          <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
            <p className="text-slate-300 font-bold">পরিমাপের মূল সূত্রাবলি:</p>
            <p className="font-mono text-emerald-400 text-[11px]">• মোট পাঠ (L) = প্রধান স্কেল (M) + (ভার্নিয়ার সমপাতন V × VC)</p>
          </div>
        </div>
      </div>

      <FormulaProofPanel steps={steps} />
      <AIConceptCard text="ভার্নিয়ার ক্যালিপার্সের মাধ্যমে যেকোনো বস্তুর দৈর্ঘ্য, ব্যাস ও গোলকের ব্যাসার্ধ ০.১ মিলিমিটার পর্যন্ত সূক্ষ্মভাবে মাপা যায়। চোয়ালের অবস্থান টেনে ধরলে রিয়েল-টাইমে সমপাতন ও মোট পাঠ আপডেট হয়।" />
    </div>
  );
}

// ==========================================
// MODULE 2: MOTION & MECHANICS (Inclined Plane & 3D Pendulum)
// ==========================================
function MotionModule() {
  const [angle, setAngle] = useState(30);
  const [length, setLength] = useState(1.5);
  const [mass, setMass] = useState(2);
  const [view3D, setView3D] = useState(false);
  const canvasRef = useRef(null);

  const g = 9.8;
  const period = (2 * Math.PI * Math.sqrt(length / g)).toFixed(2);
  const accAlongPlane = (g * Math.sin((angle * Math.PI) / 180)).toFixed(2);
  const normalForce = (mass * g * Math.cos((angle * Math.PI) / 180)).toFixed(2);

  // 2D Fabric Canvas for Inclined Plane
  useEffect(() => {
    if (view3D || !canvasRef.current) return;
    const canvas = new fabric.Canvas(canvasRef.current, {
      width: 480,
      height: 220,
      backgroundColor: '#0f172a',
    });

    const rad = (angle * Math.PI) / 180;
    const baseW = 320;
    const height = baseW * Math.tan(rad);

    // Wedge
    const wedge = new fabric.Polygon([
      { x: 40, y: 190 },
      { x: 40 + baseW, y: 190 },
      { x: 40, y: Math.max(20, 190 - height) }
    ], {
      fill: 'rgba(56, 189, 248, 0.2)',
      stroke: '#38bdf8',
      strokeWidth: 2,
      selectable: false,
    });
    canvas.add(wedge);

    // Draggable Block with Rotation
    const block = new fabric.Rect({
      left: 140,
      top: 190 - (height * 0.6) - 10,
      width: 45,
      height: 30,
      fill: '#f43f5e',
      stroke: '#ffffff',
      strokeWidth: 1.5,
      angle: -angle,
      hasRotatingPoint: true,
      cornerColor: '#f59e0b',
    });

    block.on('rotating', (e) => {
      const curAngle = Math.abs(Math.round(block.angle || 0)) % 90;
      setAngle(curAngle);
    });

    canvas.add(block);
    canvas.renderAll();

    return () => canvas.dispose();
  }, [angle, view3D]);

  const steps = [
    { text: `সরল দোলকের দৈর্ঘ্য (L) = ${length} m, অভিকর্ষজ ত্বরণ (g) = 9.8 m/s²` },
    { text: `দোলনকাল (T) = 2π√(L/g) = 2 × 3.1416 × √(${length}/9.8)` },
    { text: `কার্যকর দোলনকাল (T) = ${period} সেকেন্ড`, highlight: true },
    { text: `আনত তলের কোণ (θ) = ${angle}°, সমান্তরাল ত্বরণ a = g·sin(θ) = ${accAlongPlane} m/s²` },
    { text: `অভিলম্বিক বল (R) = m·g·cos(θ) = ${normalForce} N`, highlight: true },
  ];

  return (
    <div className="space-y-4">
      <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-sm text-white flex items-center gap-2">
            <Zap className="w-4 h-4 text-rose-500" />
            <span>বল ও গতিবিদ্যা (Interactive Mechanics & 360° 3D Model)</span>
          </h4>
          <button
            onClick={() => setView3D(!view3D)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              view3D ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-800 text-slate-300'
            }`}
          >
            <Rotate3d className="w-4 h-4" />
            <span>{view3D ? '2D ড্রাগ মোডে ফিরুন' : '3D অরবিট ভিউ (360°)'}</span>
          </button>
        </div>

        {view3D ? (
          <div className="h-64 w-full bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden relative">
            <ThreeCanvas camera={{ position: [0, 0, 5], fov: 50 }}>
              <ambientLight intensity={0.7} />
              <pointLight position={[5, 5, 5]} />
              <ThreeDPendulumModel length={length} angle={angle} />
              <OrbitControls enableRotate={true} enableZoom={true} enablePan={true} />
            </ThreeCanvas>
            <div className="absolute bottom-2 right-2 px-2.5 py-1 bg-black/60 backdrop-blur-sm rounded-lg text-[10px] text-slate-400">
              মাউস দিয়ে ৩৬০° ঘুরিয়ে দেখুন (3D Orbit)
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto flex justify-center p-3 bg-slate-900 rounded-2xl border border-slate-800">
            <canvas ref={canvasRef} />
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="text-slate-400 block mb-1">আনত তলের কোণ (Angle θ): {angle}°</label>
            <input
              type="range"
              min="5"
              max="75"
              value={angle}
              onChange={e => setAngle(+e.target.value)}
              className="w-full accent-rose-500"
            />
          </div>
          <div>
            <label className="text-slate-400 block mb-1">দোলক দৈর্ঘ্য (L): {length} m</label>
            <input
              type="range"
              min="0.5"
              max="4.0"
              step="0.1"
              value={length}
              onChange={e => setLength(+e.target.value)}
              className="w-full accent-sky-500"
            />
          </div>
          <div>
            <label className="text-slate-400 block mb-1">বস্তুর ভর (m): {mass} kg</label>
            <input
              type="range"
              min="0.5"
              max="10"
              step="0.5"
              value={mass}
              onChange={e => setMass(+e.target.value)}
              className="w-full accent-emerald-500"
            />
          </div>
        </div>
      </div>

      <FormulaProofPanel steps={steps} />
      <AIConceptCard text="আনত তলে বস্তুর গতি ত্বরণিত হয় কারণ ওজন বলের একটি উপাংশ (mg sin θ) তল বরাবর কাজ করে। সরল দোলকের দোলনকাল ভরের ওপর নির্ভর করে না, কেবল কার্যকর দৈর্ঘ্য ও অভিকর্ষজ ত্বরণের ওপর নির্ভর করে।" />
    </div>
  );
}

// ==========================================
// MODULE 3: OPTICS & RAY TRACING (Fabric.js Draggable Mirrors & Lenses)
// ==========================================
function OpticsModule() {
  const [optType, setOptType] = useState('concave_mirror'); // 'concave_mirror' | 'convex_lens' | 'prism'
  const [u, setU] = useState(30); // Object distance (cm)
  const [f, setF] = useState(15); // Focal length (cm)
  const [h, setH] = useState(10); // Object height (cm)
  const canvasRef = useRef(null);

  // 1/f = 1/u + 1/v => 1/v = 1/f - 1/u => v = (u * f) / (u - f)
  let v = 0;
  let m = 0;
  let nature = '';
  if (u !== f) {
    v = (u * f) / (u - f);
    m = -v / u;
    if (v > 0) nature = 'বাস্তব ও উল্টো (Real & Inverted)';
    else nature = 'অবাস্তব ও সোজা (Virtual & Erect)';
  } else {
    nature = 'অসীমে গঠিত (At Infinity)';
  }

  // Draw Ray Diagram via Fabric.js
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = new fabric.Canvas(canvasRef.current, {
      width: 500,
      height: 220,
      backgroundColor: '#0f172a',
    });

    const cy = 110;
    const cx = 260; // Mirror/Lens center

    // Principal Axis
    const axis = new fabric.Line([10, cy, 490, cy], {
      stroke: '#475569',
      strokeWidth: 1.5,
      strokeDasharray: [4, 4],
      selectable: false,
    });
    canvas.add(axis);

    // Mirror/Lens Visual
    if (optType === 'concave_mirror') {
      const mirror = new fabric.Path('M 260 30 Q 240 110 260 190', {
        fill: '',
        stroke: '#38bdf8',
        strokeWidth: 3.5,
        selectable: false,
      });
      canvas.add(mirror);
    } else if (optType === 'convex_lens') {
      const lens = new fabric.Path('M 260 30 Q 280 110 260 190 Q 240 110 260 30', {
        fill: 'rgba(56, 189, 248, 0.25)',
        stroke: '#38bdf8',
        strokeWidth: 2,
        selectable: false,
      });
      canvas.add(lens);
    } else {
      // Prism
      const prism = new fabric.Polygon([
        { x: 260, y: 40 },
        { x: 310, y: 180 },
        { x: 210, y: 180 }
      ], {
        fill: 'rgba(168, 85, 247, 0.25)',
        stroke: '#a855f7',
        strokeWidth: 2,
        selectable: false,
      });
      canvas.add(prism);
    }

    // Focal Points (F, 2F / C)
    const focalPx = f * 4;
    const fPoint = new fabric.Circle({ left: cx - focalPx - 3, top: cy - 3, radius: 3, fill: '#f59e0b', selectable: false });
    const fText = new fabric.Text('F', { left: cx - focalPx - 4, top: cy + 6, fontSize: 10, fill: '#f59e0b', selectable: false });
    canvas.add(fPoint, fText);

    // Draggable Object (Candle / Arrow) with 360° handle
    const objPx = u * 4;
    const objX = Math.max(20, cx - objPx);
    const objHeightPx = h * 3;

    const arrowShaft = new fabric.Line([0, 0, 0, -objHeightPx], { stroke: '#f43f5e', strokeWidth: 3 });
    const arrowHead = new fabric.Triangle({ left: -4, top: -objHeightPx - 8, width: 8, height: 8, fill: '#f43f5e' });
    const objGroup = new fabric.Group([arrowShaft, arrowHead], {
      left: objX,
      top: cy,
      hasControls: true,
      hasRotatingPoint: true,
      cornerColor: '#38bdf8',
    });

    objGroup.on('moving', (e) => {
      let l = objGroup.left;
      if (l > cx - 10) l = cx - 10;
      if (l < 20) l = 20;
      objGroup.left = l;
      const newU = Math.round((cx - l) / 4);
      setU(Math.max(2, newU));
    });

    canvas.add(objGroup);

    // Light Rays
    if (u !== f && Math.abs(v) < 100) {
      const imgX = cx - (v * 4);
      const imgHeight = h * m * 3;

      // Parallel ray to focal ray
      const r1 = new fabric.Line([objX, cy - objHeightPx, cx, cy - objHeightPx], { stroke: '#fbbf24', strokeWidth: 1.5, selectable: false });
      const r2 = new fabric.Line([cx, cy - objHeightPx, imgX, cy + imgHeight], { stroke: '#fbbf24', strokeWidth: 1.5, selectable: false });
      canvas.add(r1, r2);

      // Inverted Image Arrow
      const imgShaft = new fabric.Line([imgX, cy, imgX, cy + imgHeight], { stroke: '#10b981', strokeWidth: 2.5, strokeDasharray: [3, 2], selectable: false });
      canvas.add(imgShaft);
    }

    canvas.renderAll();
    return () => canvas.dispose();
  }, [optType, u, f, h, v, m]);

  const steps = [
    { text: `দর্পণ/লেন্স সূত্র: 1/f = 1/u + 1/v` },
    { text: `লক্ষ্যবস্তুর দূরত্ব (u) = ${u} সেমি, ফোকাস দূরত্ব (f) = ${f} সেমি` },
    { text: `1/v = 1/${f} - 1/${u} = (${u} - ${f})/(${u}×${f})` },
    { text: `প্রতিবিম্বের দূরত্ব (v) = ${v.toFixed(2)} সেমি`, highlight: true },
    { text: `বিবর্ধন m = -v/u = -(${v.toFixed(2)})/${u} = ${m.toFixed(2)} গুণ`, highlight: true },
    { text: `প্রতিবিম্বের প্রকৃতি: ${nature}`, highlight: true }
  ];

  return (
    <div className="space-y-4">
      <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-2">
            {[
              { id: 'concave_mirror', label: 'অবতল দর্পণ (Concave Mirror)' },
              { id: 'convex_lens', label: 'উত্তল লেন্স (Convex Lens)' },
              { id: 'prism', label: 'প্রিজম বিচ্ছুরণ (Prism)' }
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setOptType(t.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  optType === t.id ? 'bg-sky-600 text-white shadow-lg' : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
          <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-500/30">
            v = {v.toFixed(1)} cm | m = {m.toFixed(2)}x
          </span>
        </div>

        <div className="overflow-x-auto flex justify-center p-3 bg-slate-900 rounded-2xl border border-slate-800">
          <canvas ref={canvasRef} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="text-slate-400 block mb-1">বস্তুর দূরত্ব (u): {u} cm</label>
            <input
              type="range"
              min="5"
              max="60"
              value={u}
              onChange={e => setU(+e.target.value)}
              className="w-full accent-sky-500"
            />
          </div>
          <div>
            <label className="text-slate-400 block mb-1">ফোকাস দূরত্ব (f): {f} cm</label>
            <input
              type="range"
              min="5"
              max="30"
              value={f}
              onChange={e => setF(+e.target.value)}
              className="w-full accent-amber-500"
            />
          </div>
          <div>
            <label className="text-slate-400 block mb-1">বস্তুর উচ্চতা (h): {h} cm</label>
            <input
              type="range"
              min="2"
              max="20"
              value={h}
              onChange={e => setH(+e.target.value)}
              className="w-full accent-rose-500"
            />
          </div>
        </div>
      </div>

      <FormulaProofPanel steps={steps} />
      <AIConceptCard text="অবতল দর্পণে লক্ষ্যবস্তু ফোকাসের বাইরে থাকলে বাস্তব ও উল্টো প্রতিবিম্ব তৈরি হয়। লক্ষ্যবস্তু ফোকাস ও মেরুর মাঝে এলে অবাস্তব ও সোজা বিবর্ধিত প্রতিবিম্ব গঠিত হয় যা দাঁতের চিকিৎসায় ডেন্টাল মিরর হিসেবে ব্যবহৃত হয়।" />
    </div>
  );
}

// ==========================================
// MODULE 4: ELECTRICITY & CIRCUITS (Fabric.js Draggable Components)
// ==========================================
function ElectricityModule() {
  const [voltage, setVoltage] = useState(12); // Volts
  const [resistorR, setResistorR] = useState(6); // Ohms
  const [isSwitchClosed, setIsSwitchClosed] = useState(true);
  const canvasRef = useRef(null);

  const current = isSwitchClosed ? (voltage / resistorR).toFixed(2) : 0;
  const power = isSwitchClosed ? (voltage * current).toFixed(1) : 0;

  // Circuit simulation on Fabric.js
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = new fabric.Canvas(canvasRef.current, {
      width: 480,
      height: 200,
      backgroundColor: '#0f172a',
    });

    // Wire Loop
    const wire = new fabric.Rect({
      left: 60,
      top: 40,
      width: 360,
      height: 120,
      fill: 'transparent',
      stroke: isSwitchClosed ? '#10b981' : '#475569',
      strokeWidth: 3,
      selectable: false,
    });
    canvas.add(wire);

    // Draggable Battery Group with 360° rotation
    const batBody = new fabric.Rect({ width: 50, height: 30, fill: '#0369a1', rx: 3, stroke: '#38bdf8', strokeWidth: 1.5 });
    const batText = new fabric.Text(`${voltage}V`, { left: 8, top: 8, fontSize: 11, fill: '#ffffff', fontWeight: 'bold' });
    const batGroup = new fabric.Group([batBody, batText], {
      left: 60,
      top: 85,
      hasControls: true,
      hasRotatingPoint: true,
      cornerColor: '#38bdf8',
    });
    canvas.add(batGroup);

    // Draggable Resistor Group
    const resBody = new fabric.Rect({ width: 60, height: 26, fill: '#78350f', rx: 3, stroke: '#f59e0b', strokeWidth: 1.5 });
    const resText = new fabric.Text(`${resistorR}Ω`, { left: 12, top: 6, fontSize: 11, fill: '#ffffff', fontWeight: 'bold' });
    const resGroup = new fabric.Group([resBody, resText], {
      left: 210,
      top: 27,
      hasControls: true,
      hasRotatingPoint: true,
      cornerColor: '#f59e0b',
    });
    canvas.add(resGroup);

    // Draggable Light Bulb
    const bulbGlow = new fabric.Circle({
      left: 210,
      top: 135,
      radius: 16,
      fill: isSwitchClosed ? 'rgba(251, 191, 36, 0.8)' : '#334155',
      stroke: isSwitchClosed ? '#f59e0b' : '#64748b',
      strokeWidth: 2,
      hasControls: true,
      hasRotatingPoint: true,
      cornerColor: '#f59e0b',
    });
    canvas.add(bulbGlow);

    // Switch
    const switchArm = new fabric.Line(
      isSwitchClosed ? [360, 40, 400, 40] : [360, 40, 395, 20],
      { stroke: isSwitchClosed ? '#10b981' : '#f43f5e', strokeWidth: 3.5, selectable: false }
    );
    canvas.add(switchArm);

    canvas.renderAll();
    return () => canvas.dispose();
  }, [voltage, resistorR, isSwitchClosed]);

  const steps = [
    { text: `ওহমের সূত্র (Ohm's Law): V = I × R` },
    { text: `কোষের বিভব পার্থক্য (V) = ${voltage} Volt, রোধ (R) = ${resistorR} Ω` },
    { text: `বর্তনী প্রবাহ (I) = V / R = ${voltage} / ${resistorR}` },
    { text: `তড়িৎ প্রবাহ (I) = ${current} Ampere`, highlight: true },
    { text: `ব্যয়িত তড়িৎ ক্ষমতা P = V × I = ${power} Watt`, highlight: true }
  ];

  return (
    <div className="space-y-4">
      <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-sm text-white flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>তড়িৎ বর্তনী ও ওহমের সূত্র (Interactive Circuit with 360° Handles)</span>
          </h4>
          <button
            onClick={() => setIsSwitchClosed(!isSwitchClosed)}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
              isSwitchClosed ? 'bg-emerald-600 text-white shadow-lg' : 'bg-rose-600 text-white'
            }`}
          >
            সুইচ: {isSwitchClosed ? 'অন (ON)' : 'অফ (OFF)'}
          </button>
        </div>

        <div className="overflow-x-auto flex justify-center p-3 bg-slate-900 rounded-2xl border border-slate-800">
          <canvas ref={canvasRef} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="text-slate-400 block mb-1">ভোল্টেজ (Voltage V): {voltage} V</label>
            <input
              type="range"
              min="1"
              max="48"
              value={voltage}
              onChange={e => setVoltage(+e.target.value)}
              className="w-full accent-sky-500"
            />
          </div>
          <div>
            <label className="text-slate-400 block mb-1">রোধের মান (Resistance R): {resistorR} Ω</label>
            <input
              type="range"
              min="1"
              max="20"
              value={resistorR}
              onChange={e => setResistorR(+e.target.value)}
              className="w-full accent-amber-500"
            />
          </div>
        </div>
      </div>

      <FormulaProofPanel steps={steps} />
      <AIConceptCard text="ওহমের সূত্র অনুযায়ী তাপমাত্রা স্থির থাকলে কোনো পরিবাহীর মধ্য দিয়ে প্রবাহিত তড়িৎ প্রবাহ তার দুই প্রান্তের বিভব পার্থক্যের সমানুপাতিক। তড়িৎ ক্ষমতা P = I²R সমীকরণ দিয়ে বাতিটির ঔজ্জ্বল্য নির্ধারিত হয়।" />
    </div>
  );
}

// ==========================================
// MODULE 5: MAGNETISM & INDUCTION (Fabric.js Draggable Magnet)
// ==========================================
function MagnetismModule() {
  const [magAngle, setMagAngle] = useState(0);
  const [distance, setDistance] = useState(8);
  const [fieldStrength, setFieldStrength] = useState(50);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = new fabric.Canvas(canvasRef.current, {
      width: 480,
      height: 200,
      backgroundColor: '#0f172a',
    });

    // Magnetic field curves
    for (let i = 1; i <= 3; i++) {
      const rx = 100 + i * 25;
      const ry = 40 + i * 15;
      const ellipse = new fabric.Ellipse({
        left: 240 - rx,
        top: 100 - ry,
        rx,
        ry,
        fill: 'transparent',
        stroke: 'rgba(56, 189, 248, 0.3)',
        strokeWidth: 1.5,
        strokeDasharray: [5, 4],
        selectable: false,
      });
      canvas.add(ellipse);
    }

    // Draggable Bar Magnet with 360° rotation
    const nPole = new fabric.Rect({ left: 0, top: 0, width: 60, height: 32, fill: '#ef4444' });
    const nText = new fabric.Text('N', { left: 24, top: 8, fontSize: 14, fill: '#ffffff', fontWeight: 'bold' });
    const sPole = new fabric.Rect({ left: 60, top: 0, width: 60, height: 32, fill: '#3b82f6' });
    const sText = new fabric.Text('S', { left: 84, top: 8, fontSize: 14, fill: '#ffffff', fontWeight: 'bold' });

    const magnetGroup = new fabric.Group([nPole, nText, sPole, sText], {
      left: 180,
      top: 84,
      angle: magAngle,
      hasControls: true,
      hasRotatingPoint: true,
      cornerColor: '#f59e0b',
    });

    magnetGroup.on('rotating', (e) => {
      setMagAngle(Math.round(magnetGroup.angle || 0));
    });

    canvas.add(magnetGroup);

    // Draggable Compass Needle
    const needleN = new fabric.Triangle({ left: 380, top: 80, width: 14, height: 25, fill: '#ef4444', angle: 180 + magAngle });
    const needleS = new fabric.Triangle({ left: 380, top: 105, width: 14, height: 25, fill: '#3b82f6', angle: magAngle });
    const needleGroup = new fabric.Group([needleN, needleS], {
      left: 360,
      top: 75,
      hasControls: true,
      hasRotatingPoint: true,
      cornerColor: '#10b981',
    });
    canvas.add(needleGroup);

    canvas.renderAll();
    return () => canvas.dispose();
  }, [magAngle, distance, fieldStrength]);

  const steps = [
    { text: `চৌম্বক ফ্লাক্স ঘনত্ব B = μ₀·I / (2π·r)` },
    { text: `দণ্ড চুম্বকের ঘূর্ণন কোণ (θ) = ${magAngle}°` },
    { text: `কম্পাস সূচকের দিকবিন্যাস = ${(magAngle + 180) % 360}° (বিপরীত মেরুর আকর্ষণ)`, highlight: true },
    { text: `তড়িৎচৌম্বকীয় আবেশ: e = -N·(dΦ/dt)`, highlight: true }
  ];

  return (
    <div className="space-y-4">
      <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 space-y-4">
        <h4 className="font-bold text-sm text-white flex items-center gap-2">
          <Magnet className="w-4 h-4 text-rose-500" />
          <span>দণ্ড চুম্বক ও কম্পাস ফিল্ড সিমুলেটর (360° Draggable Bar Magnet)</span>
        </h4>

        <div className="overflow-x-auto flex justify-center p-3 bg-slate-900 rounded-2xl border border-slate-800">
          <canvas ref={canvasRef} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="text-slate-400 block mb-1">চুম্বক ঘূর্ণন কোণ (Rotation Angle): {magAngle}°</label>
            <input
              type="range"
              min="0"
              max="360"
              value={(magAngle % 360 + 360) % 360}
              onChange={e => setMagAngle(+e.target.value)}
              className="w-full accent-rose-500"
            />
          </div>
          <div>
            <label className="text-slate-400 block mb-1">চৌম্বক ক্ষেত্র তীব্রতা (Field Strength): {fieldStrength} mT</label>
            <input
              type="range"
              min="10"
              max="100"
              value={fieldStrength}
              onChange={e => setFieldStrength(+e.target.value)}
              className="w-full accent-sky-500"
            />
          </div>
        </div>
      </div>

      <FormulaProofPanel steps={steps} />
      <AIConceptCard text="চুম্বকের উত্তর মেরু থেকে বলরেখা বের হয়ে দক্ষিণ মেরুতে প্রবেশ করে। কম্পাস সূচক সর্বদা স্থানীয় চৌম্বক বলরেখার স্পর্শক বরাবর অবস্থান গ্রহণ করে।" />
    </div>
  );
}

// ==========================================
// MAIN MEGA PHYSICS LAB CONTAINER
// ==========================================
const MODULES = [
  { id: 'measurement', label: 'পরিমাপ ও ভার্নিয়ার', icon: Ruler, Component: MeasurementModule },
  { id: 'motion', label: 'বল ও গতিবিদ্যা (3D)', icon: Zap, Component: MotionModule },
  { id: 'optics', label: 'আলো ও অপটিক্স রশ্মিচিত্র', icon: Eye, Component: OpticsModule },
  { id: 'electricity', label: 'তড়িৎ বর্তনী ও ওহম', icon: Zap, Component: ElectricityModule },
  { id: 'magnetism', label: 'চৌম্বকবিজ্ঞান ও আবেশ', icon: Magnet, Component: MagnetismModule },
];

export default function MegaPhysicsLab() {
  const [activeTab, setActiveTab] = useState('measurement');
  const [isExporting, setIsExporting] = useState(false);
  const labRef = useRef(null);

  const CurrentModule = MODULES.find(m => m.id === activeTab);

  const handleExport = async () => {
    if (!labRef.current) return;
    setIsExporting(true);
    try {
      await exportBrandedGraphic(labRef.current, {
        fileName: `NextGen_Physics_${activeTab}`,
        cardTitle: `মেগা ফিজিক্স ল্যাব: ${CurrentModule?.label}`,
        scale: 2
      });
    } catch (e) {
      console.error('Export error:', e);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 bg-gradient-to-r from-slate-900 via-sky-950/40 to-slate-900 border border-slate-800 rounded-3xl text-white flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-sky-500/20 text-sky-400 border border-sky-500/30">
            <Zap className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-black flex items-center gap-2">
              মেগা ফিজিক্স ল্যাব (Physics 2D & 3D Lab Engine)
              <span className="px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 text-xs">
                Fabric.js & 3D OrbitControls
              </span>
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              সরাসরি ক্যানভাসে বস্তু টেনে ধরুন (Drag-and-Drop) • ৩৬০° রোটেশন হ্যান্ডেল • লাইভ সূত্র প্রমাণ
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleExport}
          disabled={isExporting}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 text-white font-black text-xs shadow-lg flex items-center gap-2 hover:scale-105 transition-all disabled:opacity-50 flex-shrink-0"
        >
          {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          <span>ল্যাব রিপোর্ট ডাউনলোড</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {MODULES.map(mod => {
          const Icon = mod.icon;
          const isActive = activeTab === mod.id;
          return (
            <button
              key={mod.id}
              onClick={() => setActiveTab(mod.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black transition-all ${
                isActive
                  ? 'bg-sky-600 text-white shadow-lg shadow-sky-600/30 scale-105'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{mod.label}</span>
            </button>
          );
        })}
      </div>

      {/* Workspace */}
      <div ref={labRef} className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl">
        <div className="flex items-center gap-2 mb-4 pb-4 border-b border-slate-800">
          {CurrentModule && <CurrentModule.icon className="w-5 h-5 text-sky-400" />}
          <h3 className="font-black text-white">{CurrentModule?.label}</h3>
          <span className="text-xs text-slate-500">NextGen Physics Real-Time Mathematical Simulation Engine</span>
        </div>
        {CurrentModule && <CurrentModule.Component />}
      </div>
    </div>
  );
}
