import React, { useState, useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Float, Sphere, Cylinder, Torus, Box, MeshDistortMaterial, Line } from '@react-three/drei';
import * as THREE from 'three';
import {
  Atom,
  Dna,
  Compass,
  Rotate3d,
  Sparkles,
  Info,
  Maximize2,
  Minimize2,
  RefreshCw,
  Sliders,
  Layers,
  Award,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';

const BRAND = {
  name: 'NextGen Academy',
  instructor: 'মো: আলমগীর হোসেন (সাগর)',
  contact: '০১৭৯২৮১৮০০৫',
  address: 'পশ্চিম জয়দেবপুর, বাস-স্ট্যান্ড, গাজীপুর'
};

// ----------------------------------------------------
// 1. BIOLOGY 3D CELL MODEL
// ----------------------------------------------------
function BiologicalCell({ organelle, setOrganelle, wireframe }) {
  const nucleusRef = useRef();
  const mitochondriaRef = useRef();
  const cytoplasmRef = useRef();

  useFrame((state, delta) => {
    if (nucleusRef.current) nucleusRef.current.rotation.y += delta * 0.4;
    if (mitochondriaRef.current) mitochondriaRef.current.rotation.x += delta * 0.6;
    if (cytoplasmRef.current) cytoplasmRef.current.rotation.y += delta * 0.1;
  });

  return (
    <group>
      {/* Outer Cell Membrane */}
      <Sphere
        ref={cytoplasmRef}
        args={[2.8, 32, 32]}
        onClick={(e) => {
          e.stopPropagation();
          setOrganelle('membrane');
        }}
      >
        <meshPhysicalMaterial
          color="#38bdf8"
          transmission={0.8}
          opacity={0.4}
          transparent
          roughness={0.1}
          ior={1.2}
          wireframe={wireframe}
        />
      </Sphere>

      {/* Nucleus (Core) */}
      <Sphere
        ref={nucleusRef}
        args={[1.1, 32, 32]}
        position={[0, 0, 0]}
        onClick={(e) => {
          e.stopPropagation();
          setOrganelle('nucleus');
        }}
      >
        <MeshDistortMaterial
          color="#f43f5e"
          speed={2}
          distort={0.3}
          roughness={0.2}
          wireframe={wireframe}
        />
      </Sphere>

      {/* Nucleolus inside Nucleus */}
      <Sphere args={[0.45, 16, 16]} position={[0.2, 0.2, 0.2]}>
        <meshStandardMaterial color="#fbbf24" emissive="#d97706" emissiveIntensity={0.5} />
      </Sphere>

      {/* Mitochondria #1 */}
      <group position={[1.5, 0.8, 0.5]} ref={mitochondriaRef} onClick={(e) => { e.stopPropagation(); setOrganelle('mitochondria'); }}>
        <Cylinder args={[0.25, 0.25, 0.8, 16]} rotation={[0.5, 0.4, 0.8]}>
          <meshStandardMaterial color="#f97316" roughness={0.3} wireframe={wireframe} />
        </Cylinder>
      </group>

      {/* Mitochondria #2 */}
      <group position={[-1.4, -0.7, -0.6]} onClick={(e) => { e.stopPropagation(); setOrganelle('mitochondria'); }}>
        <Cylinder args={[0.25, 0.25, 0.7, 16]} rotation={[-0.4, 0.8, 0.2]}>
          <meshStandardMaterial color="#ea580c" roughness={0.3} wireframe={wireframe} />
        </Cylinder>
      </group>

      {/* Endoplasmic Reticulum Ribbons */}
      <group position={[0, 0, 0]} onClick={(e) => { e.stopPropagation(); setOrganelle('er'); }}>
        <Torus args={[1.6, 0.1, 16, 64]} rotation={[1.2, 0.5, 0]}>
          <meshStandardMaterial color="#a855f7" roughness={0.4} wireframe={wireframe} />
        </Torus>
        <Torus args={[1.9, 0.08, 16, 64]} rotation={[-0.8, 0.7, 0.3]}>
          <meshStandardMaterial color="#c084fc" roughness={0.4} wireframe={wireframe} />
        </Torus>
      </group>

      {/* Ribosomes (Small particles) */}
      {[
        [0.8, 1.2, -0.5],
        [-0.9, 1.1, 0.6],
        [1.1, -1.0, 0.7],
        [-1.2, -1.1, -0.8],
        [0.5, -1.4, -0.9],
        [-0.4, 1.5, -0.7]
      ].map((pos, i) => (
        <Sphere key={i} args={[0.08, 8, 8]} position={pos}>
          <meshStandardMaterial color="#22c55e" emissive="#15803d" emissiveIntensity={0.6} />
        </Sphere>
      ))}
    </group>
  );
}

// ----------------------------------------------------
// 2. CHEMISTRY 3D MOLECULE MODEL (Water H2O & Methane CH4)
// ----------------------------------------------------
function ChemicalMolecule({ molType = 'H2O', wireframe }) {
  const groupRef = useRef();

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.4;
      groupRef.current.rotation.x += delta * 0.2;
    }
  });

  if (molType === 'H2O') {
    return (
      <group ref={groupRef}>
        {/* Oxygen (Central Atom) */}
        <Sphere args={[0.9, 32, 32]} position={[0, 0, 0]}>
          <meshStandardMaterial color="#ef4444" roughness={0.2} wireframe={wireframe} />
        </Sphere>
        {/* Hydrogen 1 */}
        <Sphere args={[0.5, 24, 24]} position={[1.4, 1.1, 0]}>
          <meshStandardMaterial color="#f8fafc" roughness={0.1} wireframe={wireframe} />
        </Sphere>
        {/* Bond 1 */}
        <Cylinder args={[0.1, 0.1, 1.4, 16]} position={[0.7, 0.55, 0]} rotation={[0, 0, -Math.PI / 4]}>
          <meshStandardMaterial color="#94a3b8" />
        </Cylinder>

        {/* Hydrogen 2 */}
        <Sphere args={[0.5, 24, 24]} position={[-1.4, 1.1, 0]}>
          <meshStandardMaterial color="#f8fafc" roughness={0.1} wireframe={wireframe} />
        </Sphere>
        {/* Bond 2 */}
        <Cylinder args={[0.1, 0.1, 1.4, 16]} position={[-0.7, 0.55, 0]} rotation={[0, 0, Math.PI / 4]}>
          <meshStandardMaterial color="#94a3b8" />
        </Cylinder>
      </group>
    );
  }

  // Methane CH4
  return (
    <group ref={groupRef}>
      {/* Carbon (Black / Dark Gray) */}
      <Sphere args={[0.85, 32, 32]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#334155" roughness={0.2} wireframe={wireframe} />
      </Sphere>

      {/* 4 Hydrogens tetrahedral */}
      {[
        [0, 1.6, 0],
        [1.5, -0.6, 0],
        [-0.8, -0.6, 1.3],
        [-0.8, -0.6, -1.3]
      ].map((pos, idx) => (
        <group key={idx}>
          <Sphere args={[0.45, 24, 24]} position={pos}>
            <meshStandardMaterial color="#f8fafc" roughness={0.1} wireframe={wireframe} />
          </Sphere>
          <Cylinder
            args={[0.08, 0.08, 1.4, 16]}
            position={[pos[0] / 2, pos[1] / 2, pos[2] / 2]}
            rotation={[
              pos[2] === 0 ? 0 : pos[2] > 0 ? 0.8 : -0.8,
              0,
              pos[0] === 0 ? 0 : pos[0] > 0 ? -0.8 : 0.8
            ]}
          >
            <meshStandardMaterial color="#94a3b8" />
          </Cylinder>
        </group>
      ))}
    </group>
  );
}

// ----------------------------------------------------
// 3. PHYSICS 3D VECTOR GRAPH & FORCE FIELD
// ----------------------------------------------------
function PhysicsVectorSpace({ vectorMagnitude = 2.5, angle = 45, wireframe }) {
  const groupRef = useRef();

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.15;
    }
  });

  const rad = (angle * Math.PI) / 180;
  const vx = vectorMagnitude * Math.cos(rad);
  const vy = vectorMagnitude * Math.sin(rad);
  const vz = vectorMagnitude * 0.5;

  return (
    <group ref={groupRef}>
      {/* 3D Coordinate Grid Planes */}
      <gridHelper args={[6, 12, '#38bdf8', '#334155']} position={[0, -1.5, 0]} />

      {/* Axis Lines */}
      {/* X-Axis (Red) */}
      <Line points={[[-3, -1.5, 0], [3, -1.5, 0]]} color="#ef4444" lineWidth={3} />
      {/* Y-Axis (Green) */}
      <Line points={[[0, -1.5, 0], [0, 2.5, 0]]} color="#22c55e" lineWidth={3} />
      {/* Z-Axis (Blue) */}
      <Line points={[[0, -1.5, -3], [0, -1.5, 3]]} color="#3b82f6" lineWidth={3} />

      {/* Resultant Vector Arrow (Gold / Amber) */}
      <group position={[0, -1.5, 0]}>
        <Line points={[[0, 0, 0], [vx, vy, vz]]} color="#f59e0b" lineWidth={5} />
        <Sphere args={[0.18, 16, 16]} position={[vx, vy, vz]}>
          <meshStandardMaterial color="#f59e0b" emissive="#b45309" emissiveIntensity={0.8} />
        </Sphere>
      </group>

      {/* Projected Trajectory Arc */}
      <group position={[0, -1.5, 0]}>
        {Array.from({ length: 20 }).map((_, i) => {
          const t = i / 19;
          const px = vx * t;
          const py = vy * t - 0.5 * 1.5 * t * t;
          const pz = vz * t;
          return (
            <Sphere key={i} args={[0.04, 8, 8]} position={[px, Math.max(0, py), pz]}>
              <meshStandardMaterial color="#a855f7" />
            </Sphere>
          );
        })}
      </group>
    </group>
  );
}

// ----------------------------------------------------
// MAIN COMPONENT EXPORT
// ----------------------------------------------------
export default function Virtual3DScienceLab() {
  const [labType, setLabType] = useState('BIOLOGY'); // 'BIOLOGY' | 'CHEMISTRY' | 'PHYSICS'
  const [selectedOrganelle, setSelectedOrganelle] = useState('nucleus');
  const [molType, setMolType] = useState('H2O');
  const [vecMagnitude, setVecMagnitude] = useState(2.5);
  const [vecAngle, setVecAngle] = useState(45);
  const [wireframe, setWireframe] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Organelle info glossary
  const ORGANELLE_INFO = {
    nucleus: {
      nameBn: 'নিউক্লিয়াস (Nucleus)',
      role: 'কোষের প্রাণকেন্দ্র বা মস্তিষ্ক',
      desc: 'কোষের সকল শারীরবৃত্তীয় কার্যক্রম ও বংশগতির উপাদান (DNA/RNA) ধারণ ও নিয়ন্ত্রণ করে।'
    },
    membrane: {
      nameBn: 'কোষঝিল্লি (Cell Membrane)',
      role: 'বহিঃআবরণ ও সুরক্ষা',
      desc: 'কোষের ভেতরের প্রোটোপ্লাজমকে রক্ষা করে এবং অভিস্রবণের মাধ্যমে পুষ্টি উপাদান গ্রহণ ও বর্জ্য নির্গমন নিয়ন্ত্রণ করে।'
    },
    mitochondria: {
      nameBn: 'মাইটোকন্ড্রিয়া (Mitochondria)',
      role: 'কোষের শক্তিঘর (Powerhouse)',
      desc: 'শ্বসন প্রক্রিয়ার মাধ্যমে খাদ্য জারিত করে শক্তি (ATP) উৎপন্ন করে যা কোষের বেঁচে থাকার প্রধান উৎস।'
    },
    er: {
      nameBn: 'এন্ডোপ্লাজমিক রেটিকুলাম (ER)',
      role: 'প্রোটিন ও লিপিড পরিবহন',
      desc: 'কোষের ভেতরে সাইটোপ্লাজমীয় পরিবহন কাঠামো হিসেবে কাজ করে এবং রাইবোসোম ধারণ করে।'
    }
  };

  return (
    <div className="space-y-6 text-slate-100">
      {/* Header & Lab Discipline Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-5 rounded-3xl shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-2xl bg-amber-500/20 text-amber-400 font-bold">
              <Rotate3d className="w-6 h-6 animate-spin-slow" />
            </span>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                ভার্চুয়াল ৩ডি সায়েন্স ল্যাব
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                  ইন্টারেক্টিভ ৩D
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                ৩ডি মডেল ঘুরিয়ে ও জুম করে বায়োলজি সেল, কেমিস্ট্রি মলিকিউল ও ফিজিক্স ভেক্টর পর্যবেক্ষণ করুন
              </p>
            </div>
          </div>
        </div>

        {/* Discipline Tabs */}
        <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 self-start md:self-auto">
          <button
            onClick={() => setLabType('BIOLOGY')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${
              labType === 'BIOLOGY'
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Dna className="w-4 h-4" />
            বায়োলজি (কোষ)
          </button>
          <button
            onClick={() => setLabType('CHEMISTRY')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${
              labType === 'CHEMISTRY'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Atom className="w-4 h-4" />
            কেমিস্ট্রি (মলিকিউল)
          </button>
          <button
            onClick={() => setLabType('PHYSICS')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${
              labType === 'PHYSICS'
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Compass className="w-4 h-4" />
            ফিজিক্স (ভেক্টর)
          </button>
        </div>
      </div>

      {/* Main 3D Canvas Area */}
      <div className={`grid grid-cols-1 lg:grid-cols-3 gap-6 ${isFullscreen ? 'fixed inset-0 z-50 bg-slate-950 p-6' : ''}`}>
        {/* 3D Viewport Box */}
        <div className="lg:col-span-2 relative bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl min-h-[460px] flex flex-col justify-between">
          {/* Viewport Top Overlay Controls */}
          <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between pointer-events-auto">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-xl bg-slate-900/90 text-xs font-mono font-bold text-amber-400 border border-slate-700 backdrop-blur-md flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                {labType === 'BIOLOGY' ? '3D Animal Cell Structure' : labType === 'CHEMISTRY' ? `3D Molecule: ${molType}` : '3D Vector Force Field'}
              </span>
              <button
                onClick={() => setWireframe(!wireframe)}
                className={`px-3 py-1 rounded-xl text-xs font-bold border transition-colors ${
                  wireframe ? 'bg-amber-500 text-slate-950 border-amber-400' : 'bg-slate-900/80 text-slate-300 border-slate-700 hover:bg-slate-800'
                }`}
              >
                Wireframe
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition-colors"
                title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Three.js 3D Canvas */}
          <div className="w-full h-[460px] relative cursor-grab active:cursor-grabbing">
            <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
              <ambientLight intensity={0.7} />
              <pointLight position={[10, 10, 10]} intensity={1.2} />
              <pointLight position={[-10, -10, -10]} color="#38bdf8" intensity={0.8} />

              <Suspense fallback={null}>
                {labType === 'BIOLOGY' && (
                  <BiologicalCell
                    organelle={selectedOrganelle}
                    setOrganelle={setSelectedOrganelle}
                    wireframe={wireframe}
                  />
                )}
                {labType === 'CHEMISTRY' && (
                  <ChemicalMolecule molType={molType} wireframe={wireframe} />
                )}
                {labType === 'PHYSICS' && (
                  <PhysicsVectorSpace
                    vectorMagnitude={vecMagnitude}
                    angle={vecAngle}
                    wireframe={wireframe}
                  />
                )}
              </Suspense>

              <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
            </Canvas>
          </div>

          {/* Mandatory Watermark Overlay at Bottom of 3D Canvas */}
          <div className="p-3 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 z-10">
            <div className="flex items-center gap-2 font-bold text-slate-200">
              <span className="text-amber-400 font-black">🎓 {BRAND.name}</span>
              <span>•</span>
              <span className="text-emerald-400">শিক্ষক: {BRAND.instructor}</span>
            </div>
            <div className="text-[10px] text-slate-500">
              📞 {BRAND.contact} | 📍 {BRAND.address}
            </div>
          </div>
        </div>

        {/* Right Controls & Educational Inspector Panel */}
        <div className="space-y-4">
          {/* Discipline Specific Interactive Controls */}
          {labType === 'BIOLOGY' && (
            <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-5 space-y-4 shadow-xl">
              <h4 className="font-extrabold text-sm text-white flex items-center gap-2">
                <Dna className="w-4 h-4 text-rose-500" />
                কোষ অঙ্গাণু নির্বাচন ও পর্যবেক্ষণ
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {Object.keys(ORGANELLE_INFO).map((key) => (
                  <button
                    key={key}
                    onClick={() => setSelectedOrganelle(key)}
                    className={`p-2.5 rounded-xl text-xs font-bold transition-all text-left border ${
                      selectedOrganelle === key
                        ? 'bg-rose-500/20 border-rose-500 text-rose-300 shadow-md'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                    }`}
                  >
                    {ORGANELLE_INFO[key].nameBn.split(' ')[0]}
                  </button>
                ))}
              </div>

              {/* Inspector Card */}
              {ORGANELLE_INFO[selectedOrganelle] && (
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-rose-400">
                      {ORGANELLE_INFO[selectedOrganelle].nameBn}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold">
                      {ORGANELLE_INFO[selectedOrganelle].role}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {ORGANELLE_INFO[selectedOrganelle].desc}
                  </p>
                </div>
              )}
            </div>
          )}

          {labType === 'CHEMISTRY' && (
            <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-5 space-y-4 shadow-xl">
              <h4 className="font-extrabold text-sm text-white flex items-center gap-2">
                <Atom className="w-4 h-4 text-blue-500" />
                মলিকিউলার মডেল নির্বাচন
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setMolType('H2O')}
                  className={`p-3 rounded-xl text-xs font-bold border transition-all text-center ${
                    molType === 'H2O'
                      ? 'bg-blue-600/20 border-blue-500 text-blue-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  💧 পানি (H₂O)
                </button>
                <button
                  onClick={() => setMolType('CH4')}
                  className={`p-3 rounded-xl text-xs font-bold border transition-all text-center ${
                    molType === 'CH4'
                      ? 'bg-blue-600/20 border-blue-500 text-blue-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  🔥 মিথেন (CH₄)
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                <p className="font-black text-blue-400">
                  {molType === 'H2O' ? 'পানির অণুর গঠন (Bent Shape - 104.5°)' : 'মিথেন অণুর গঠন (Tetrahedral - 109.5°)'}
                </p>
                <p className="text-slate-300 leading-relaxed">
                  {molType === 'H2O'
                    ? '১টি অক্সিজেন পরমাণুর সাথে ২টি হাইড্রোজেন পরমাণু সমযোজী বন্ধনে আবদ্ধ। নিঃসঙ্গ ইলেকট্রন জোড়ের বিকর্ষণে বন্ধন কোণ ১০৪.৫° হয়।'
                    : '১টি কার্বন পরমাণু sp³ সংকরায়নের মাধ্যমে ৪টি হাইড্রোজেন পরমাণুর সাথে চতুস্তলকীয়ভাবে যুক্ত থাকে।'}
                </p>
              </div>
            </div>
          )}

          {labType === 'PHYSICS' && (
            <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-5 space-y-4 shadow-xl">
              <h4 className="font-extrabold text-sm text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-amber-500" />
                ভেক্টর মান ও কোণ পরিবর্তন
              </h4>

              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between font-bold text-slate-300 mb-1">
                    <span>ভেক্টর মান (Magnitude):</span>
                    <span className="text-amber-400">{vecMagnitude.toFixed(1)} N</span>
                  </div>
                  <input
                    type="range"
                    min="1.0"
                    max="4.5"
                    step="0.1"
                    value={vecMagnitude}
                    onChange={(e) => setVecMagnitude(parseFloat(e.target.value))}
                    className="w-full accent-amber-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between font-bold text-slate-300 mb-1">
                    <span>নিক্ষেপণ কোণ (Angle θ):</span>
                    <span className="text-amber-400">{vecAngle}°</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="80"
                    step="5"
                    value={vecAngle}
                    onChange={(e) => setVecAngle(parseInt(e.target.value))}
                    className="w-full accent-amber-500"
                  />
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-1 text-slate-300">
                <p><strong>X-উপাংশ ($V_x$):</strong> {(vecMagnitude * Math.cos((vecAngle * Math.PI) / 180)).toFixed(2)} N</p>
                <p><strong>Y-উপাংশ ($V_y$):</strong> {(vecMagnitude * Math.sin((vecAngle * Math.PI) / 180)).toFixed(2)} N</p>
              </div>
            </div>
          )}

          {/* Quick Guide Card */}
          <div className="p-4 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 text-xs text-slate-400 space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-200">
              <Info className="w-4 h-4 text-amber-400" />
              ল্যাব নির্দেশিকা
            </div>
            <p className="leading-relaxed text-[11px]">
              • মাউস বা আঙুল দিয়ে ড্র্যাগ করে ৩ডি মডেলটি ৩৬০° ঘুরিয়ে দেখুন।
              <br />
              • স্ক্রল করে জুম-ইন ও জুম-আউট করুন।
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
