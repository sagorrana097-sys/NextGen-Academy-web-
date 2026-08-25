import React, { useState, lazy, Suspense } from 'react';
import { Rotate3d, Atom, Heart, Sparkles, Battery, BatteryCharging, Flame, Sliders } from 'lucide-react';
import LoadingFallback from '../common/LoadingFallback';

const Virtual3DScienceLab = lazy(() => import('./Virtual3DScienceLab'));
const PeriodicTable3D = lazy(() => import('./PeriodicTable3D'));
const VirtualBiologyLab3D = lazy(() => import('./VirtualBiologyLab3D'));
const ElectronConfigurationVisualizer = lazy(() => import('./ElectronConfigurationVisualizer'));
const GalvanicCellSimulation = lazy(() => import('./GalvanicCellSimulation'));
const DaniellCellSimulation = lazy(() => import('./DaniellCellSimulation'));
const DryCellSimulation = lazy(() => import('./DryCellSimulation'));
const RedoxOxidationEngine = lazy(() => import('./RedoxOxidationEngine'));

export default function Science3DHub({ defaultSubTab = 'lab' }) {
  const [activeSubTab, setActiveSubTab] = useState(defaultSubTab); // 'lab' | 'periodic' | 'electron' | 'daniell' | 'dry-cell' | 'galvanic' | 'redox' | 'biology'

  return (
    <div className="space-y-6">
      {/* Subject Lab Selector Bar */}
      <div className="flex flex-wrap items-center gap-2 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 w-fit text-xs font-bold shadow-lg backdrop-blur-sm">
        <button
          type="button"
          onClick={() => setActiveSubTab('lab')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
            activeSubTab === 'lab'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 font-black'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Rotate3d className="w-3.5 h-3.5" />
          <span>৩ডি ফিজিক্স ও সায়েন্স ল্যাব</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('periodic')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
            activeSubTab === 'periodic'
              ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30 font-black'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Atom className="w-3.5 h-3.5" />
          <span>৩ডি পর্যায় সারণি ও কেমিস্ট্রি</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('electron')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
            activeSubTab === 'electron'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-black'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>ইলেকট্রন বিন্যাস ও বোর অরবিট ল্যাব</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('daniell')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
            activeSubTab === 'daniell'
              ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30 font-black'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <BatteryCharging className="w-3.5 h-3.5" />
          <span>ড্যানিয়েল কোষ (Zn-Cu)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('dry-cell')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
            activeSubTab === 'dry-cell'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-black'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Battery className="w-3.5 h-3.5" />
          <span>শুষ্ক কোষ (Dry Cell)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('galvanic')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
            activeSubTab === 'galvanic'
              ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30 font-black'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>কাস্টম গ্যালভানিক কোষ</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('redox')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
            activeSubTab === 'redox'
              ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30 font-black'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Flame className="w-3.5 h-3.5" />
          <span>জারণ-বিজারণ ও জারণ সংখ্যা ইঞ্জিন</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('biology')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
            activeSubTab === 'biology'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 font-black'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Heart className="w-3.5 h-3.5" />
          <span>৩ডি বায়োলজি ও অ্যানাটমি</span>
        </button>
      </div>

      {/* Dynamic Sub-Tab Content */}
      <Suspense fallback={<LoadingFallback message="৩ডি সায়েন্স ল্যাব লোড হচ্ছে..." />}>
        {activeSubTab === 'lab' && <Virtual3DScienceLab />}
        {activeSubTab === 'periodic' && <PeriodicTable3D />}
        {activeSubTab === 'electron' && <ElectronConfigurationVisualizer />}
        {activeSubTab === 'daniell' && <DaniellCellSimulation />}
        {activeSubTab === 'dry-cell' && <DryCellSimulation />}
        {activeSubTab === 'galvanic' && <GalvanicCellSimulation />}
        {activeSubTab === 'redox' && <RedoxOxidationEngine />}
        {activeSubTab === 'biology' && <VirtualBiologyLab3D />}
      </Suspense>
    </div>
  );
}
