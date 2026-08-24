import React, { useState, useRef } from 'react';
import {
  Laptop,
  Cpu,
  Binary,
  Code,
  Network,
  Database,
  ShieldCheck,
  Globe,
  Award,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  Download,
  RotateCcw,
  Zap,
  Loader2
} from 'lucide-react';
import { exportBrandedGraphic } from '../../utils/exportBrandedGraphic';

const ICT_TOPICS = [
  {
    id: 'LOGIC_GATES',
    title: 'লজিক গেইট ও ডিজিটাল সার্কিট',
    icon: '⚡',
    desc: 'AND, OR, NOT, NAND, NOR, XOR গেইটের লাইভ সিমুলেশন ও সত্যক সারণি'
  },
  {
    id: 'NUMBER_SYSTEM',
    title: 'সংখ্যা পদ্ধতি (Number Systems)',
    icon: '🔢',
    desc: 'ডেসিমাল, বাইনারি, অক্টাল ও হেক্সাডেসিমাল রূপান্তর টুল'
  },
  {
    id: 'WEB_HTML',
    title: 'এইচটিএমএল ও ওয়েব ডিজাইন',
    icon: '🌐',
    desc: 'ট্যাগ, এলিমেন্ট, হাইপারলিঙ্ক ও টেবিল তৈরির বেসিক'
  },
  {
    id: 'PROGRAMMING',
    title: 'সি প্রোগ্রামিং ও অ্যালগরিদম',
    icon: '💻',
    desc: 'ভেরিয়েবল, লুপ, কন্ডিশনাল স্টেটমেন্ট ও ফ্লোচার্ট'
  }
];

const LOGIC_GATES = [
  { name: 'AND', calc: (a, b) => a && b, formula: 'Y = A · B', desc: 'উভয় ইনপুট ১ হলেই আউটপুট ১ হবে।' },
  { name: 'OR', calc: (a, b) => a || b, formula: 'Y = A + B', desc: 'যেকোনো একটি ইনপুট ১ হলেই আউটপুট ১ হবে।' },
  { name: 'NOT', calc: (a) => !a, formula: 'Y = Ā', desc: 'ইনপুটকে বিপরীত করে (০ হলে ১, ১ হলে ০)।' },
  { name: 'NAND', calc: (a, b) => !(a && b), formula: 'Y = (A · B)̄', desc: 'AND গেইটের বিপরীত আউটপুট প্রদান করে।' },
  { name: 'NOR', calc: (a, b) => !(a || b), formula: 'Y = (A + B)̄', desc: 'OR গেইটের বিপরীত আউটপুট প্রদান করে।' },
  { name: 'XOR', calc: (a, b) => a !== b, formula: 'Y = A ⊕ B', desc: 'ইনপুট দুটি অসমান হলেই কেবল আউটপুট ১ হবে।' }
];

const ICT_QUIZ = [
  {
    q: 'বাইনারি সংখ্যা পদ্ধতি (1101)₂ এর ডেসিমাল মান কত?',
    options: ['১১', '১২', '১৩', '১৪'],
    correct: 2,
    explanation: '1×2³ + 1×2² + 0×2¹ + 1×2⁰ = 8 + 4 + 0 + 1 = 13'
  },
  {
    q: 'নিচের কোনটি সার্বজনীন (Universal) লজিক গেইট?',
    options: ['AND ও OR', 'NAND ও NOR', 'XOR ও XNOR', 'NOT ও AND'],
    correct: 1,
    explanation: 'NAND এবং NOR গেইট দিয়ে সকল মৌলিক ও যৌগিক গেইট তৈরি করা যায়।'
  },
  {
    q: 'HTML-এ সবচেয়ে বড় হেডিং ট্যাগ কোনটি?',
    options: ['<h6>', '<head>', '<h1>', '<header>'],
    correct: 2,
    explanation: '<h1> হলো সবচেয়ে বড় হেডিং এবং <h6> হলো সবচেয়ে ছোট হেডিং।'
  },
  {
    q: 'C ভাষায় মেমোরি অ্যাড্রেস নির্দেশ করতে কোন অপারেটর ব্যবহার করা হয়?',
    options: ['*', '&', '%', '$'],
    correct: 1,
    explanation: 'অ্যাম্পারস্যান্ড (&) অপারেটর দিয়ে ভেরিয়েবলের মেমোরি অ্যাড্রেস পাওয়া যায়।'
  }
];

export default function ICTSmartQuizZone() {
  const [activeTab, setActiveTab] = useState('GATES'); // 'GATES' | 'CONVERTER' | 'QUIZ'
  
  // Logic Gate Simulator State
  const [selectedGate, setSelectedGate] = useState(LOGIC_GATES[0]);
  const [inputA, setInputA] = useState(1);
  const [inputB, setInputB] = useState(0);

  // Number Converter State
  const [decimalInput, setDecimalInput] = useState('25');

  // Quiz State
  const [userAnswers, setUserAnswers] = useState({});
  const [isQuizSubmitted, setIsQuizSubmitted] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const exportCardRef = useRef(null);

  const gateOutput = selectedGate.name === 'NOT' 
    ? (selectedGate.calc(inputA) ? 1 : 0)
    : (selectedGate.calc(inputA, inputB) ? 1 : 0);

  const decVal = parseInt(decimalInput, 10) || 0;
  const binaryVal = decVal.toString(2);
  const octalVal = decVal.toString(8);
  const hexVal = decVal.toString(16).toUpperCase();

  const handleExportSheet = async () => {
    if (!exportCardRef.current) return;
    setIsExporting(true);
    try {
      await exportBrandedGraphic(exportCardRef.current, {
        fileName: 'NextGen_ICT_Smart_Study_Sheet',
        cardTitle: 'আইসিটি ও লজিক গেইট স্মার্ট প্র্যাকটিস শিট',
        scale: 2
      });
    } catch (err) {
      console.error('Failed to export ICT sheet:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const calculateScore = () => {
    let score = 0;
    ICT_QUIZ.forEach((q, idx) => {
      if (userAnswers[idx] === q.correct) score += 1;
    });
    return score;
  };

  return (
    <div className="space-y-6">
      {/* Top Header Banner */}
      <div className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-3xl shadow-xl text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="p-3.5 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <Laptop className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black text-white">আইসিটি ও স্মার্ট কুইজ জোন</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold font-mono">
                ICT Lab
              </span>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              ডিজিটাল লজিক গেইট সিমুলেটর, সংখ্যা পদ্ধতি কনভার্টার এবং আইসিটি কুইজ এরিনা
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleExportSheet}
          disabled={isExporting}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white font-black text-xs shadow-lg shadow-cyan-600/30 flex items-center gap-2 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 self-start md:self-auto"
        >
          {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          <span>আইসিটি শিট ডাউনলোড</span>
        </button>
      </div>

      {/* Tab Controls Bar */}
      <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800 w-fit text-xs font-bold">
        <button
          type="button"
          onClick={() => setActiveTab('GATES')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
            activeTab === 'GATES' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          <span>লজিক গেইট সিমুলেটর</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('CONVERTER')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
            activeTab === 'CONVERTER' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Binary className="w-3.5 h-3.5" />
          <span>সংখ্যা পদ্ধতি কনভার্টার</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('QUIZ')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
            activeTab === 'QUIZ' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>আইসিটি সেলফ-কুইজ ({ICT_QUIZ.length})</span>
        </button>
      </div>

      {/* Tab 1: Interactive Logic Gate Simulator */}
      {activeTab === 'GATES' && (
        <div
          ref={exportCardRef}
          className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6 text-white"
        >
          {/* Gate Selection Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {LOGIC_GATES.map((g) => (
              <button
                key={g.name}
                type="button"
                onClick={() => setSelectedGate(g)}
                className={`px-4 py-2 rounded-xl font-bold font-mono text-xs transition-all ${
                  selectedGate.name === g.name
                    ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20 scale-105'
                    : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                }`}
              >
                {g.name} GATE
              </button>
            ))}
          </div>

          {/* Interactive Circuit Canvas Visualizer */}
          <div className="p-8 rounded-3xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-8 shadow-inner">
            {/* Input Switches */}
            <div className="space-y-4 w-full md:w-auto">
              <div className="flex items-center justify-between md:justify-start gap-4 p-3 bg-slate-900 rounded-2xl border border-slate-800">
                <span className="font-mono font-bold text-xs text-slate-400">ইনপুট A:</span>
                <button
                  type="button"
                  onClick={() => setInputA(inputA === 1 ? 0 : 1)}
                  className={`w-12 h-10 rounded-xl font-mono text-sm font-black transition-all flex items-center justify-center ${
                    inputA === 1
                      ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/30'
                      : 'bg-slate-800 text-slate-500 border border-slate-700'
                  }`}
                >
                  {inputA}
                </button>
              </div>

              {selectedGate.name !== 'NOT' && (
                <div className="flex items-center justify-between md:justify-start gap-4 p-3 bg-slate-900 rounded-2xl border border-slate-800">
                  <span className="font-mono font-bold text-xs text-slate-400">ইনপুট B:</span>
                  <button
                    type="button"
                    onClick={() => setInputB(inputB === 1 ? 0 : 1)}
                    className={`w-12 h-10 rounded-xl font-mono text-sm font-black transition-all flex items-center justify-center ${
                      inputB === 1
                        ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/30'
                        : 'bg-slate-800 text-slate-500 border border-slate-700'
                    }`}
                  >
                    {inputB}
                  </button>
                </div>
              )}
            </div>

            {/* Central Gate Representation */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-cyan-950/60 to-slate-900 border-2 border-cyan-500/40 text-center space-y-2 shadow-2xl min-w-[200px]">
              <span className="font-mono text-2xl font-black text-cyan-300 block">{selectedGate.name}</span>
              <span className="font-mono text-sm font-bold text-amber-300 block">{selectedGate.formula}</span>
              <p className="text-[11px] text-slate-300 max-w-xs mx-auto">{selectedGate.desc}</p>
            </div>

            {/* Output Bulb / Value */}
            <div className="flex flex-col items-center gap-2 p-4 bg-slate-900 rounded-2xl border border-slate-800 min-w-[140px]">
              <span className="font-mono font-bold text-xs text-slate-400 uppercase">আউটপুট Y</span>
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center font-mono text-2xl font-black transition-all shadow-xl ${
                  gateOutput === 1
                    ? 'bg-gradient-to-tr from-amber-400 to-amber-500 text-slate-950 shadow-amber-400/50 ring-4 ring-amber-400/30 animate-pulse'
                    : 'bg-slate-950 text-slate-600 border border-slate-800'
                }`}
              >
                {gateOutput}
              </div>
              <span className={`text-[10px] font-bold ${gateOutput === 1 ? 'text-amber-300' : 'text-slate-500'}`}>
                {gateOutput === 1 ? 'HIGH (সক্রিয়)' : 'LOW (নিষ্ক্রিয়)'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Number System Converter */}
      {activeTab === 'CONVERTER' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6 text-white">
          <div className="max-w-md space-y-2">
            <label className="text-xs font-bold text-slate-300 block">দশমিক সংখ্যা ইনপুট দিন (Decimal Value):</label>
            <input
              type="number"
              value={decimalInput}
              onChange={(e) => setDecimalInput(e.target.value)}
              placeholder="যেমন: 25 বা 100"
              className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-2xl font-mono text-lg text-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">বাইনারি (Base 2)</span>
              <p className="font-mono text-xl font-black text-emerald-400 break-all">{binaryVal}₂</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">অক্টাল (Base 8)</span>
              <p className="font-mono text-xl font-black text-amber-400 break-all">{octalVal}₈</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">হেক্সাডেসিমাল (Base 16)</span>
              <p className="font-mono text-xl font-black text-purple-400 break-all">{hexVal}₁₆</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Interactive ICT Quiz */}
      {activeTab === 'QUIZ' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6 text-white">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-lg text-white">এইচএসসি ও মাধ্যমিক আইসিটি সেলফ-কুইজ</h3>
            {isQuizSubmitted && (
              <span className="px-4 py-1.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-xs font-bold border border-cyan-500/40">
                স্কোর: {calculateScore()} / {ICT_QUIZ.length}
              </span>
            )}
          </div>

          <div className="space-y-4">
            {ICT_QUIZ.map((q, qIdx) => (
              <div key={qIdx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <h4 className="font-bold text-sm text-white">
                  {qIdx + 1}. {q.q}
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {q.options.map((opt, oIdx) => {
                    const isChecked = userAnswers[qIdx] === oIdx;
                    let style = 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700';

                    if (isQuizSubmitted) {
                      if (oIdx === q.correct) {
                        style = 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold';
                      } else if (isChecked && isChecked !== (oIdx === q.correct)) {
                        style = 'bg-rose-500/20 border-rose-500 text-rose-300';
                      }
                    } else if (isChecked) {
                      style = 'bg-cyan-600/30 border-cyan-500 text-cyan-200 font-bold';
                    }

                    return (
                      <button
                        key={oIdx}
                        type="button"
                        onClick={() => !isQuizSubmitted && setUserAnswers({ ...userAnswers, [qIdx]: oIdx })}
                        className={`p-3 rounded-xl border text-xs text-left transition-all flex items-center gap-2.5 ${style}`}
                      >
                        <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center font-mono text-[10px]">
                          {String.fromCharCode(65 + oIdx)}
                        </span>
                        <span>{opt}</span>
                      </button>
                    );
                  })}
                </div>

                {isQuizSubmitted && (
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
                    <strong className="text-cyan-400">ব্যাখ্যা:</strong> {q.explanation}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-slate-800">
            {isQuizSubmitted ? (
              <button
                type="button"
                onClick={() => {
                  setUserAnswers({});
                  setIsQuizSubmitted(false);
                }}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
              >
                পুনরায় পরীক্ষা দিন
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsQuizSubmitted(true)}
                disabled={Object.keys(userAnswers).length === 0}
                className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-bold text-xs shadow-lg"
              >
                উত্তর জমা দিন
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
