import React, { useState, useEffect, useRef, useCallback } from 'react';
import { fabric } from 'fabric';
import {
  PenTool, Eraser, MousePointer, Download, RotateCcw,
  Grid, Compass, Ruler, HelpCircle, Layers, Sliders,
  Trash2, Maximize2, Sparkles, CheckCircle2, ChevronDown,
  ChevronUp, Brain, Eye, Palette, ZoomIn, ZoomOut, Circle as CircleIcon,
  Square, Triangle as TriangleIcon, Box, RefreshCw, Move, Tag, Crosshair
} from 'lucide-react';
import { exportBrandedGraphic } from '../../utils/exportBrandedGraphic';

// Color Palettes
const STROKE_COLORS = [
  { name: 'Emerald', hex: '#10B981' },
  { name: 'Cyan', hex: '#06B6D4' },
  { name: 'Indigo', hex: '#6366F1' },
  { name: 'Amber', hex: '#F59E0B' },
  { name: 'Rose', hex: '#F43F5E' },
  { name: 'White', hex: '#FFFFFF' }
];

const FILL_COLORS = [
  { name: 'None', hex: 'transparent' },
  { name: 'Emerald Light', hex: 'rgba(16, 185, 129, 0.15)' },
  { name: 'Cyan Light', hex: 'rgba(6, 182, 212, 0.15)' },
  { name: 'Indigo Light', hex: 'rgba(99, 102, 241, 0.15)' },
  { name: 'Amber Light', hex: 'rgba(245, 158, 11, 0.15)' },
  { name: 'Rose Light', hex: 'rgba(244, 63, 94, 0.15)' }
];

// SSC Sompadya Presets
const SOMPADYA_PRESETS = [
  {
    id: 'bisector',
    title: 'সম্পাদ্য ১: কোণের সমদ্বিখণ্ডক অঙ্কন (Angle Bisector)',
    desc: 'একটি নির্দিষ্ট কোণকে রুলার ও কম্পাসের সাহায্যে সমান দুই ভাগে বিভক্ত করা।',
    steps: [
      '১. স্কেল দিয়ে যেকোনো কোণ ∠ABC আঁকুন।',
      '২. কম্পাসের কাঁটা B বিন্দুতে বসিয়ে সুবিধাজনক ব্যাসার্ধ নিয়ে ∠ABC এর দুই বাহুকে ছেদ করে চাপ আঁকুন।',
      '৩. ছেদবিন্দুদ্বয় থেকে সমান ব্যাসার্ধ নিয়ে কোণের অভ্যন্তরে দুটি চাপ আঁকুন যা D বিন্দুতে ছেদ করে।',
      '৪. স্কেল দিয়ে B এবং D বিন্দু যুক্ত করে BD রশ্মি টানুন। BD-ই হলো কোণের সমদ্বিখণ্ডক।'
    ]
  },
  {
    id: 'perp_bisector',
    title: 'সম্পাদ্য ২: রেখাংশের লম্ব সমদ্বিখণ্ডক (Perpendicular Bisector)',
    desc: 'একটি নির্দিষ্ট রেখাংশকে লম্বভাবে দ্বিখণ্ডিত করা।',
    steps: [
      '১. স্কেল দিয়ে নির্দিষ্ট দৈর্ঘ্যের রেখাংশ AB আঁকুন।',
      '২. কম্পাসের সাহায্যে AB এর অর্ধেকের বেশি ব্যাসার্ধ নিয়ে A ও B কে কেন্দ্র করে AB এর উভয় পাশে দুটি করে চাপ আঁকুন।',
      '৩. চাপদ্বয়ের ছেদবিন্দু P ও Q চিহ্নিত করুন।',
      '৪. P ও Q স্কেল দিয়ে যুক্ত করুন। PQ রেখাংশ AB কে লম্বভাবে সমদ্বিখণ্ডিত করে।'
    ]
  },
  {
    id: 'incircle',
    title: 'সম্পাদ্য ৩: ত্রিভুজের অন্তর্বৃত্ত অঙ্কন (Incircle of Triangle)',
    desc: 'একটি ত্রিভুজের তিনটি বাহুকেই স্পর্শ করে এমন অন্তর্বৃত্ত আঁকা।',
    steps: [
      '১. স্কেল দিয়ে ত্রিভুজ ABC আঁকুন।',
      '২. কোণ ∠B ও কোণ ∠C এর সমদ্বিখণ্ডকদ্বয় আঁকুন যারা পরস্পর O বিন্দুতে ছেদ করে।',
      '৩. O থেকে BC বাহুর উপর লম্ব OD টানুন।',
      '৪. O কে কেন্দ্র করে OD এর সমান ব্যাসার্ধ নিয়ে বৃত্ত আঁকুন। এটিই নির্ণেয় অন্তর্বৃত্ত।'
    ]
  }
];

export default function VirtualGeometryBoard() {
  const canvasElementRef = useRef(null);
  const fabricCanvasRef = useRef(null);
  const boardRef = useRef(null);

  // Tools: 'SELECT' | 'PENCIL' | 'LINE' | 'OBJECT_ERASER'
  const [activeTool, setActiveTool] = useState('SELECT');
  const [strokeColor, setStrokeColor] = useState('#10B981');
  const [fillColor, setFillColor] = useState('rgba(16, 185, 129, 0.15)');
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [showGrid, setShowGrid] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [activeSompadya, setActiveSompadya] = useState(null);
  const [compassRadius, setCompassRadius] = useState(80);
  
  // Real-time Measurement Tooltip States
  const [showMeasurements, setShowMeasurements] = useState(true);
  const [liveMeasure, setLiveMeasure] = useState(null); // { lengthCm, angleDeg, x, y }

  // Instrument Overlay Toggles
  const [activeInstruments, setActiveInstruments] = useState({
    ruler: false,
    protractor: false,
    compass: false,
    setSquare45: false,
    setSquare3060: false
  });

  // Scale calibration (37.8 pixels approx 1 cm on standard screens)
  const PIXELS_PER_CM = 37.8;

  // Initialize Canvas
  useEffect(() => {
    if (!canvasElementRef.current) return;
    const parent = canvasElementRef.current.parentElement;
    const width = parent.clientWidth || 900;
    const height = 560;

    const canvas = new fabric.Canvas(canvasElementRef.current, {
      width,
      height,
      backgroundColor: '#090d16',
      selection: true,
      preserveObjectStacking: true,
    });
    fabricCanvasRef.current = canvas;

    let isDrawingLine = false;
    let tempLine = null;
    let lineStart = { x: 0, y: 0 };

    // Mouse Down for Interactive Straight Line with Measurement
    canvas.on('mouse:down', (opt) => {
      if (activeTool === 'OBJECT_ERASER' && opt.target) {
        // Prevent deleting permanent instrument overlays if marked
        canvas.remove(opt.target);
        canvas.renderAll();
        return;
      }

      if (activeTool === 'LINE') {
        isDrawingLine = true;
        const ptr = canvas.getPointer(opt.e);
        lineStart = { x: ptr.x, y: ptr.y };

        tempLine = new fabric.Line([ptr.x, ptr.y, ptr.x, ptr.y], {
          stroke: strokeColor,
          strokeWidth: strokeWidth,
          strokeLineCap: 'round',
          selectable: false,
          evented: false,
        });
        canvas.add(tempLine);
      }
    });

    // Mouse Move for Live Measurement Calculation & Angle Snapping
    canvas.on('mouse:move', (opt) => {
      if (isDrawingLine && tempLine) {
        const ptr = canvas.getPointer(opt.e);
        let x2 = ptr.x;
        let y2 = ptr.y;

        const dx = x2 - lineStart.x;
        const dy = y2 - lineStart.y;
        const pxDist = Math.sqrt(dx * dx + dy * dy);
        let angleRad = Math.atan2(dy, dx);
        let angleDeg = Math.round((angleRad * 180) / Math.PI);
        if (angleDeg < 0) angleDeg += 360;

        // Angle Snapping (Snap to standard 0, 30, 45, 60, 90, 120, 135, 150, 180, 270)
        const snapAngles = [0, 30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330, 360];
        snapAngles.forEach(sa => {
          if (Math.abs(angleDeg - sa) <= 3) {
            angleDeg = sa;
            const snapRad = (sa * Math.PI) / 180;
            x2 = lineStart.x + pxDist * Math.cos(snapRad);
            y2 = lineStart.y + pxDist * Math.sin(snapRad);
          }
        });

        tempLine.set({ x2, y2 });
        canvas.renderAll();

        const lengthCm = (pxDist / PIXELS_PER_CM).toFixed(2);
        setLiveMeasure({
          lengthCm,
          angleDeg,
          x: (lineStart.x + x2) / 2,
          y: Math.min(lineStart.y, y2) - 25,
        });
      }
    });

    // Mouse Up - Finalize Line & Optional Persistent Label
    canvas.on('mouse:up', () => {
      if (isDrawingLine && tempLine) {
        isDrawingLine = false;
        tempLine.set({ selectable: true, evented: true, hasControls: true, hasRotatingPoint: true });

        // Add persistent measurement label if enabled
        if (showMeasurements && liveMeasure && parseFloat(liveMeasure.lengthCm) > 0.5) {
          const label = new fabric.Text(`${liveMeasure.lengthCm} cm | ${liveMeasure.angleDeg}°`, {
            left: (tempLine.x1 + tempLine.x2) / 2 - 25,
            top: (tempLine.y1 + tempLine.y2) / 2 - 18,
            fontSize: 10,
            fontFamily: 'monospace',
            fill: '#38bdf8',
            backgroundColor: 'rgba(15, 23, 42, 0.85)',
            selectable: true,
            hasControls: false,
          });
          canvas.add(label);
        }

        tempLine = null;
        setLiveMeasure(null);
        canvas.renderAll();
      }
    });

    const handleResize = () => {
      if (parent && canvas) {
        canvas.setWidth(parent.clientWidth);
        canvas.renderAll();
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.dispose();
    };
  }, [activeTool, strokeColor, strokeWidth, showMeasurements]);

  // Update Tool Mode on Canvas
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    if (activeTool === 'PENCIL') {
      canvas.isDrawingMode = true;
      canvas.freeDrawingBrush.color = strokeColor;
      canvas.freeDrawingBrush.width = strokeWidth;
      canvas.selection = false;
    } else {
      canvas.isDrawingMode = false;
      canvas.selection = activeTool === 'SELECT';
      canvas.forEachObject((obj) => {
        obj.selectable = activeTool === 'SELECT';
        obj.evented = true;
      });
    }
  }, [activeTool, strokeColor, strokeWidth]);

  const getSpawn = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return { left: 200, top: 150 };
    return {
      left: canvas.width / 2 - 100 + (Math.random() * 40 - 20),
      top: canvas.height / 2 - 80 + (Math.random() * 40 - 20)
    };
  };

  // ==========================================
  // INSTRUMENT OVERLAY CONTROLS
  // ==========================================

  // 1. Virtual Ruler (স্কেল - Draggable & 360° Rotatable with Snapping)
  const addRuler = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    const { left, top } = getSpawn();

    const rulerBody = new fabric.Rect({
      left: 0,
      top: 0,
      width: 340,
      height: 52,
      fill: 'rgba(255, 255, 255, 0.1)',
      stroke: '#38bdf8',
      strokeWidth: 1.5,
      rx: 4,
      ry: 4,
    });

    const elements = [rulerBody];

    // Cm Markings (approx 15 cm)
    for (let i = 0; i <= 8; i++) {
      const x = 15 + i * PIXELS_PER_CM;
      elements.push(
        new fabric.Line([x, 0, x, 14], { stroke: '#ffffff', strokeWidth: 1.5 }),
        new fabric.Text(i.toString(), { left: x - 4, top: 16, fontSize: 9, fill: '#38bdf8', fontWeight: 'bold' })
      );
      if (i < 8) {
        for (let m = 1; m < 5; m++) {
          elements.push(new fabric.Line([x + m * 7.5, 0, x + m * 7.5, m === 2 ? 10 : 6], { stroke: '#94a3b8', strokeWidth: 1 }));
        }
      }
    }

    const title = new fabric.Text('NextGen Scale (cm)', { left: 110, top: 34, fontSize: 10, fill: '#f59e0b', fontWeight: 'bold' });
    elements.push(title);

    const rulerGroup = new fabric.Group(elements, {
      left,
      top,
      hasControls: true,
      hasRotatingPoint: true,
      cornerColor: '#38bdf8',
      name: 'instrument_ruler'
    });

    canvas.add(rulerGroup);
    canvas.setActiveObject(rulerGroup);
    setActiveTool('SELECT');
    canvas.renderAll();
  };

  // 2. Virtual Protractor (চাঁদা - 180° Draggable & 360° Rotatable)
  const addProtractor = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    const { left, top } = getSpawn();

    const r = 130;
    const semicircle = new fabric.Circle({
      left: 0,
      top: 0,
      radius: r,
      startAngle: Math.PI,
      endAngle: 0,
      fill: 'rgba(56, 189, 248, 0.12)',
      stroke: '#38bdf8',
      strokeWidth: 2,
    });

    const elements = [semicircle];
    elements.push(new fabric.Line([0, r, r * 2, r], { stroke: '#38bdf8', strokeWidth: 2 }));
    elements.push(new fabric.Circle({ left: r - 3, top: r - 3, radius: 3, fill: '#f43f5e' }));

    const angles = [0, 30, 45, 60, 90, 120, 135, 150, 180];
    angles.forEach(deg => {
      const rad = ((180 - deg) * Math.PI) / 180;
      const x1 = r + (r - 12) * Math.cos(rad);
      const y1 = r - (r - 12) * Math.sin(rad);
      const x2 = r + r * Math.cos(rad);
      const y2 = r - r * Math.sin(rad);

      elements.push(new fabric.Line([x1, y1, x2, y2], { stroke: '#ffffff', strokeWidth: 1.5 }));

      const tx = r + (r - 26) * Math.cos(rad) - 5;
      const ty = r - (r - 26) * Math.sin(rad) - 5;
      elements.push(new fabric.Text(deg.toString(), { left: tx, top: ty, fontSize: 8, fill: '#fbbf24', fontWeight: 'bold' }));
    });

    const protractorGroup = new fabric.Group(elements, {
      left,
      top,
      hasControls: true,
      hasRotatingPoint: true,
      cornerColor: '#f59e0b',
      name: 'instrument_protractor'
    });

    canvas.add(protractorGroup);
    canvas.setActiveObject(protractorGroup);
    setActiveTool('SELECT');
    canvas.renderAll();
  };

  // 3. Virtual Compass (পেন্সিল কম্পাস)
  const addCompass = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    const { left, top } = getSpawn();

    const pin = new fabric.Circle({ left: 0, top: 40, radius: 5, fill: '#f43f5e', stroke: '#ffffff', strokeWidth: 1.5 });
    const arm1 = new fabric.Line([5, 45, 30, 0], { stroke: '#64748b', strokeWidth: 3.5 });
    const hinge = new fabric.Circle({ left: 24, top: -6, radius: 8, fill: '#f59e0b', stroke: '#ffffff', strokeWidth: 1.5 });
    const arm2 = new fabric.Line([30, 0, 75, 45], { stroke: '#64748b', strokeWidth: 3.5 });
    const pencil = new fabric.Triangle({ left: 70, top: 40, width: 10, height: 14, fill: '#10b981' });

    const compassGroup = new fabric.Group([pin, arm1, hinge, arm2, pencil], {
      left,
      top,
      hasControls: true,
      hasRotatingPoint: true,
      cornerColor: '#10b981',
      name: 'instrument_compass'
    });

    canvas.add(compassGroup);
    canvas.setActiveObject(compassGroup);
    setActiveTool('SELECT');
    canvas.renderAll();
  };

  // Draw Arc with Compass
  const drawCompassArc = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    const { left, top } = getSpawn();

    const arc = new fabric.Circle({
      left,
      top,
      radius: compassRadius,
      startAngle: 0,
      endAngle: Math.PI / 1.5,
      fill: 'transparent',
      stroke: strokeColor,
      strokeWidth,
      hasControls: true,
      hasRotatingPoint: true,
      cornerColor: '#10b981',
    });
    canvas.add(arc);
    canvas.setActiveObject(arc);
    canvas.renderAll();
  };

  // 4. Set Square 45°
  const addSetSquare45 = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    const { left, top } = getSpawn();

    const outerTriangle = new fabric.Polygon([
      { x: 0, y: 160 },
      { x: 160, y: 160 },
      { x: 0, y: 0 }
    ], { fill: 'rgba(99, 102, 241, 0.15)', stroke: '#6366f1', strokeWidth: 2 });

    const innerHole = new fabric.Polygon([
      { x: 30, y: 130 },
      { x: 110, y: 130 },
      { x: 30, y: 50 }
    ], { fill: '#090d16', stroke: '#6366f1', strokeWidth: 1 });

    const label = new fabric.Text('45°-45°-90°', { left: 35, top: 135, fontSize: 9, fill: '#818cf8', fontWeight: 'bold' });

    const setSquare = new fabric.Group([outerTriangle, innerHole, label], {
      left,
      top,
      hasControls: true,
      hasRotatingPoint: true,
      cornerColor: '#6366f1',
      name: 'instrument_setsquare'
    });

    canvas.add(setSquare);
    canvas.setActiveObject(setSquare);
    setActiveTool('SELECT');
    canvas.renderAll();
  };

  // 5. Set Square 30°-60°
  const addSetSquare3060 = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    const { left, top } = getSpawn();

    const outerTriangle = new fabric.Polygon([
      { x: 0, y: 180 },
      { x: 110, y: 180 },
      { x: 0, y: 0 }
    ], { fill: 'rgba(236, 72, 153, 0.15)', stroke: '#ec4899', strokeWidth: 2 });

    const innerHole = new fabric.Polygon([
      { x: 25, y: 155 },
      { x: 75, y: 155 },
      { x: 25, y: 55 }
    ], { fill: '#090d16', stroke: '#ec4899', strokeWidth: 1 });

    const label = new fabric.Text('30°-60°-90°', { left: 20, top: 160, fontSize: 9, fill: '#f472b6', fontWeight: 'bold' });

    const setSquare = new fabric.Group([outerTriangle, innerHole, label], {
      left,
      top,
      hasControls: true,
      hasRotatingPoint: true,
      cornerColor: '#ec4899',
      name: 'instrument_setsquare3060'
    });

    canvas.add(setSquare);
    canvas.setActiveObject(setSquare);
    setActiveTool('SELECT');
    canvas.renderAll();
  };

  // 6. Clear Board
  const clearBoard = () => {
    if (window.confirm('আপনি কি নিশ্চিত যে পুরো জ্যামিতি ক্যানভাস মুছে ফেলতে চান?')) {
      const canvas = fabricCanvasRef.current;
      if (canvas) {
        canvas.clear();
        canvas.backgroundColor = '#090d16';
        canvas.renderAll();
      }
    }
  };

  // 7. Export Sheet with Strict Mandatory Branding
  const handleExport = async (hideOverlays = true) => {
    if (!boardRef.current) return;
    const canvas = fabricCanvasRef.current;
    
    // Temporarily hide instrument overlay objects for clean export
    const instruments = canvas ? canvas.getObjects().filter(o => o.name && o.name.startsWith('instrument_')) : [];
    if (hideOverlays) {
      instruments.forEach(inst => inst.set('visible', false));
      canvas.renderAll();
    }

    setIsExporting(true);
    try {
      await exportBrandedGraphic(boardRef.current, {
        fileName: 'NextGen_Geometry_Construction_Sheet',
        cardTitle: activeSompadya ? activeSompadya.title : 'ভার্চুয়াল জ্যামিতি প্র্যাকটিস শিট (Sompadya Construction)',
        scale: 2
      });
    } catch (e) {
      console.error('Export failed:', e);
    } finally {
      if (hideOverlays) {
        instruments.forEach(inst => inst.set('visible', true));
        canvas.renderAll();
      }
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-900 border border-slate-800 rounded-3xl text-white flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <Compass className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-black flex items-center gap-2">
              ভার্চুয়াল জ্যামিতি বক্স ও সম্পাদ্য ল্যাব (Geometry Workbench)
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs">
                Smart Snapping & Measurements
              </span>
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              ডুয়াল লেয়ার স্কেল • চাঁদা • কম্পাস • সেট স্কয়ার • লাইভ দৈর্ঘ্য ও কোণ পরিমাপ টুলটিপ
            </p>
          </div>
        </div>

        <button
          onClick={() => handleExport(true)}
          disabled={isExporting}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-xs shadow-lg flex items-center gap-2 hover:scale-105 transition-all disabled:opacity-50 flex-shrink-0"
        >
          {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          <span>অঙ্কন শিট ডাউনলোড (Watermarked)</span>
        </button>
      </div>

      {/* Floating Instrument Control Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-900/90 border border-slate-800 rounded-2xl backdrop-blur-md shadow-xl text-xs">
        {/* Mode Selector */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setActiveTool('SELECT')}
            className={`p-2.5 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
              activeTool === 'SELECT' ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
            title="সিলেক্ট ও মুভ টুল (Select & Move)"
          >
            <MousePointer className="w-4 h-4" />
            <span className="hidden sm:inline">সিলেক্ট</span>
          </button>

          <button
            onClick={() => setActiveTool('PENCIL')}
            className={`p-2.5 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
              activeTool === 'PENCIL' ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
            title="পেন্সিল ফ্রিহ্যান্ড অঙ্কন (Pencil Draw)"
          >
            <PenTool className="w-4 h-4" />
            <span className="hidden sm:inline">পেন্সিল</span>
          </button>

          <button
            onClick={() => setActiveTool('LINE')}
            className={`p-2.5 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
              activeTool === 'LINE' ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
            title="পরিমাপ সহ সরলরেখা টুল (Line with Live Measurement)"
          >
            <Sliders className="w-4 h-4" />
            <span className="hidden sm:inline">সরলরেখা</span>
          </button>

          <button
            onClick={() => setActiveTool('OBJECT_ERASER')}
            className={`p-2.5 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
              activeTool === 'OBJECT_ERASER' ? 'bg-rose-600 text-white shadow-md' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
            title="অবজেক্ট ইরেজার (Click to Erase)"
          >
            <Eraser className="w-4 h-4" />
            <span className="hidden sm:inline">রাবার</span>
          </button>
        </div>

        {/* Practical Instruments Inserters */}
        <div className="flex items-center gap-1.5 flex-wrap border-t sm:border-t-0 sm:border-l border-slate-800 sm:pl-3 pt-2 sm:pt-0">
          <button
            onClick={addRuler}
            className="px-3 py-2 rounded-xl bg-sky-950/60 border border-sky-500/30 text-sky-300 hover:bg-sky-900/60 font-bold flex items-center gap-1.5 transition-all"
            title="স্কেল যুক্ত করুন (Draggable Ruler)"
          >
            <Ruler className="w-3.5 h-3.5" />
            <span>স্কেল</span>
          </button>

          <button
            onClick={addProtractor}
            className="px-3 py-2 rounded-xl bg-amber-950/60 border border-amber-500/30 text-amber-300 hover:bg-amber-900/60 font-bold flex items-center gap-1.5 transition-all"
            title="চাঁদা যুক্ত করুন (Draggable Protractor)"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>চাঁদা</span>
          </button>

          <button
            onClick={addCompass}
            className="px-3 py-2 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-900/60 font-bold flex items-center gap-1.5 transition-all"
            title="পেন্সিল কম্পাস যুক্ত করুন (Pencil Compass)"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>কম্পাস</span>
          </button>

          <button
            onClick={drawCompassArc}
            className="px-2.5 py-2 rounded-xl bg-teal-950/60 border border-teal-500/30 text-teal-300 hover:bg-teal-900/60 font-bold flex items-center gap-1 transition-all"
            title="চাপ আঁকুন (Draw Arc)"
          >
            <span>বৃত্তচাপ</span>
          </button>

          <button
            onClick={addSetSquare45}
            className="px-2.5 py-2 rounded-xl bg-indigo-950/60 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-900/60 font-bold flex items-center gap-1 transition-all"
            title="৪৫° সেট স্কয়ার (Set Square 45°)"
          >
            <span>সেট স্কয়ার ৪৫°</span>
          </button>

          <button
            onClick={addSetSquare3060}
            className="px-2.5 py-2 rounded-xl bg-pink-950/60 border border-pink-500/30 text-pink-300 hover:bg-pink-900/60 font-bold flex items-center gap-1 transition-all"
            title="৩০°-৬০° সেট স্কয়ার (Set Square 30°-60°)"
          >
            <span>সেট স্কয়ার ৩০°-৬০°</span>
          </button>
        </div>

        {/* Board Options */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowMeasurements(!showMeasurements)}
            className={`px-2.5 py-2 rounded-xl border font-bold flex items-center gap-1 ${
              showMeasurements ? 'bg-sky-950/60 border-sky-500/40 text-sky-300' : 'bg-slate-900 border-slate-800 text-slate-500'
            }`}
            title="পরিমাপ টেক্সট লেবেল অন/অফ"
          >
            <Tag className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">পরিমাপ মান</span>
          </button>

          <button
            onClick={() => setShowGrid(!showGrid)}
            className={`p-2 rounded-xl border ${showGrid ? 'bg-slate-800 border-slate-700 text-emerald-400' : 'bg-slate-900 border-slate-800 text-slate-500'}`}
            title="গ্রিড ব্যাকগ্রাউন্ড অন/অফ"
          >
            <Grid className="w-4 h-4" />
          </button>

          <button
            onClick={clearBoard}
            className="p-2 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-400 hover:bg-rose-900/60"
            title="বোর্ড পরিষ্কার করুন"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Canvas Workspace with Floating Live Measurement Tooltip */}
      <div
        ref={boardRef}
        className="relative bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-2xl overflow-hidden"
      >
        <div
          className={`w-full rounded-2xl overflow-hidden relative ${
            showGrid
              ? 'bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:20px_20px] bg-[#090d16]'
              : 'bg-[#090d16]'
          }`}
        >
          <canvas ref={canvasElementRef} />

          {/* Floating Measurement Tooltip during active line drawing */}
          {liveMeasure && (
            <div
              className="absolute pointer-events-none px-3 py-1 bg-slate-900/90 text-sky-300 border border-sky-500/40 font-mono text-xs font-bold rounded-lg shadow-xl shadow-sky-950/50 flex items-center gap-1.5 backdrop-blur-md"
              style={{ left: `${liveMeasure.x}px`, top: `${liveMeasure.y}px` }}
            >
              <Crosshair className="w-3 h-3 text-amber-400 animate-pulse" />
              <span>{liveMeasure.lengthCm} cm | {liveMeasure.angleDeg}°</span>
            </div>
          )}
        </div>

        {/* Color Palette & Stroke Width Strip */}
        <div className="mt-3 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-bold flex items-center gap-1">
              <Palette className="w-3.5 h-3.5 text-emerald-400" />
              <span>কালার:</span>
            </span>
            <div className="flex gap-1.5">
              {STROKE_COLORS.map(c => (
                <button
                  key={c.hex}
                  onClick={() => setStrokeColor(c.hex)}
                  className={`w-5 h-5 rounded-full border transition-all ${strokeColor === c.hex ? 'scale-125 ring-2 ring-white' : 'border-slate-700 opacity-70'}`}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-slate-400 font-bold">পেন্সিল থিকনেস: {strokeWidth}px</span>
            <input
              type="range"
              min="1"
              max="10"
              value={strokeWidth}
              onChange={e => setStrokeWidth(+e.target.value)}
              className="w-28 accent-emerald-500"
            />
          </div>

          <div className="flex items-center gap-3">
            <span className="text-slate-400 font-bold">কম্পাস ব্যাসার্ধ (Radius): {compassRadius}px</span>
            <input
              type="range"
              min="30"
              max="200"
              value={compassRadius}
              onChange={e => setCompassRadius(+e.target.value)}
              className="w-28 accent-teal-500"
            />
          </div>
        </div>
      </div>

      {/* Sompadya & Construction Step-by-Step Presets */}
      <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="font-black text-sm text-white flex items-center gap-2">
            <Brain className="w-4 h-4 text-emerald-400" />
            <span>এসএসসি জ্যামিতিক সম্পাদ্য অঙ্কন সহকারী (Sompadya Guides)</span>
          </h3>
          <span className="text-xs text-slate-400">ধাপ অনুযায়ী নিজে ক্যানভাসে আঁকুন</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {SOMPADYA_PRESETS.map(p => (
            <button
              key={p.id}
              onClick={() => setActiveSompadya(activeSompadya?.id === p.id ? null : p)}
              className={`p-4 rounded-2xl border text-left transition-all ${
                activeSompadya?.id === p.id
                  ? 'bg-emerald-950/40 border-emerald-500 text-emerald-200 shadow-lg'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <h4 className="font-bold text-xs text-white mb-1">{p.title}</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">{p.desc}</p>
            </button>
          ))}
        </div>

        {activeSompadya && (
          <div className="p-4 bg-slate-900 border border-emerald-500/30 rounded-2xl space-y-2 text-xs">
            <p className="font-black text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{activeSompadya.title} - অঙ্কনের ধারাবাহিক বিবরণ:</span>
            </p>
            <div className="space-y-1.5 pl-2">
              {activeSompadya.steps.map((st, idx) => (
                <p key={idx} className="text-slate-300">{st}</p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
