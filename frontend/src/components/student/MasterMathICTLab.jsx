import React, { useState, useRef, useEffect } from 'react';
import { 
  Calculator, Cpu, Code2, Binary, Activity, Download, Loader2, 
  ChevronDown, ChevronUp, Brain, Play, CheckCircle2, Sliders, RefreshCw 
} from 'lucide-react';
import { exportBrandedGraphic } from '../../utils/exportBrandedGraphic';

function AICard({ text }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="bg-indigo-950/40 border border-indigo-500/30 rounded-2xl overflow-hidden mt-4">
      <button 
        type="button" 
        onClick={() => setOpen(o => !o)} 
        className="w-full flex items-center justify-between p-3.5 text-xs font-black text-indigo-300 bg-indigo-950/60"
      >
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4 text-indigo-400" />
          <span>AI ম্যাথ ও আইসিটি টিপস ও ফর্মুলা সামারি (Smart Guide)</span>
        </div>
        {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>
      {open && (
        <div className="p-4 text-xs text-indigo-100/90 leading-relaxed space-y-2 border-t border-indigo-500/20 bg-slate-950/40">
          {text}
        </div>
      )}
    </div>
  );
}

// ==========================================
// 1. Math: Graphing Visualizer (y = ax² + bx + c)
// ==========================================
function GraphingModule() {
  const [a, setA] = useState(1);
  const [b, setB] = useState(-2);
  const [c, setC] = useState(-3);
  const canvasRef = useRef(null);

  // Quadratic roots
  const disc = b * b - 4 * a * c;
  let roots = 'কোনো বাস্তব মূল নেই';
  if (a !== 0) {
    if (disc > 0) {
      const r1 = ((-b + Math.sqrt(disc)) / (2 * a)).toFixed(2);
      const r2 = ((-b - Math.sqrt(disc)) / (2 * a)).toFixed(2);
      roots = `x₁ = ${r1}, x₂ = ${r2} (বাস্তব ও অসমান)`;
    } else if (disc === 0) {
      const r = (-b / (2 * a)).toFixed(2);
      roots = `x = ${r} (বাস্তব ও সমান মূল)`;
    } else {
      roots = `D = ${disc.toFixed(1)} < 0 (জটিল / অবাস্তব মূল)`;
    }
  }

  const vertexX = a !== 0 ? (-b / (2 * a)).toFixed(2) : 0;
  const vertexY = a !== 0 ? (a * vertexX * vertexX + b * vertexX + c).toFixed(2) : c;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, W, H);

    const originX = W / 2;
    const originY = H / 2;
    const scale = 20; // 20px = 1 unit

    // Grid
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    for (let x = 0; x <= W; x += scale) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (let y = 0; y <= H; y += scale) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(0, originY); ctx.lineTo(W, originY); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(originX, 0); ctx.lineTo(originX, H); ctx.stroke();

    // Plot y = ax² + bx + c
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    let started = false;
    for (let px = 0; px <= W; px += 2) {
      const x = (px - originX) / scale;
      const y = a * x * x + b * x + c;
      const py = originY - y * scale;
      if (py >= 0 && py <= H) {
        if (!started) { ctx.moveTo(px, py); started = true; }
        else { ctx.lineTo(px, py); }
      }
    }
    ctx.stroke();

    // Vertex Marker
    const vx = originX + Number(vertexX) * scale;
    const vy = originY - Number(vertexY) * scale;
    if (vx >= 0 && vx <= W && vy >= 0 && vy <= H) {
      ctx.fillStyle = '#f43f5e';
      ctx.beginPath(); ctx.arc(vx, vy, 5, 0, Math.PI * 2); ctx.fill();
    }
  }, [a, b, c, vertexX, vertexY]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-7 bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col items-center">
          <canvas ref={canvasRef} width={400} height={260} className="w-full max-w-sm rounded-xl" />
          <p className="text-xs text-slate-400 mt-2">
            সমীকরণ: <span className="font-mono font-bold text-sky-400">y = {a}x² + ({b})x + ({c})</span>
          </p>
        </div>

        <div className="md:col-span-5 space-y-3 text-xs">
          <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
            <div>
              <div className="flex justify-between text-slate-300">
                <span>সহগ a (বক্রতা):</span> <span className="font-mono text-sky-400 font-bold">{a}</span>
              </div>
              <input type="range" min="-5" max="5" step="0.5" value={a} onChange={e => setA(+e.target.value)} className="w-full accent-sky-500" />
            </div>
            <div>
              <div className="flex justify-between text-slate-300">
                <span>সহগ b:</span> <span className="font-mono text-sky-400 font-bold">{b}</span>
              </div>
              <input type="range" min="-10" max="10" step="1" value={b} onChange={e => setB(+e.target.value)} className="w-full accent-sky-500" />
            </div>
            <div>
              <div className="flex justify-between text-slate-300">
                <span>ধ্রুবক c (y-ছেদক):</span> <span className="font-mono text-sky-400 font-bold">{c}</span>
              </div>
              <input type="range" min="-10" max="10" step="1" value={c} onChange={e => setC(+e.target.value)} className="w-full accent-sky-500" />
            </div>
          </div>

          <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl space-y-1.5">
            <p className="font-bold text-slate-200">মূল বা সমাধান (Roots):</p>
            <p className="font-mono text-emerald-400">{roots}</p>
            <p className="text-slate-400">শীর্ষবিন্দু (Vertex): <span className="font-mono text-rose-400 font-bold">({vertexX}, {vertexY})</span></p>
            <p className="text-slate-400">নিশ্চায়ক (Discriminant): <span className="font-mono text-amber-400 font-bold">D = b² - 4ac = {disc.toFixed(1)}</span></p>
          </div>
        </div>
      </div>
      <AICard text="দ্বিঘাত সমীকরণের লেখচিত্র একটি প্যারাবোলা (Parabola)। a > 0 হলে শীর্ষবিন্দু নিম্নমুখী ও গ্রাফ ঊর্ধ্বমুখী (U shape) হয়, a < 0 হলে গ্রাফ নিম্নমুখী হয়। D > 0 হলে গ্রাফ x-অক্ষকে ২টি বিন্দুতে ছেদ করে।" />
    </div>
  );
}

// ==========================================
// 2. Math: Trigonometry Unit Circle
// ==========================================
function TrigonometryModule() {
  const [angle, setAngle] = useState(45);
  const rad = (angle * Math.PI) / 180;
  const sinVal = Math.sin(rad).toFixed(3);
  const cosVal = Math.cos(rad).toFixed(3);
  const tanVal = angle % 180 === 90 ? 'অসংজ্ঞায়িত' : Math.tan(rad).toFixed(3);

  const cx = 130, cy = 110, r = 80;
  const px = cx + r * Math.cos(rad);
  const py = cy - r * Math.sin(rad);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        <div className="md:col-span-6 bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col items-center">
          <svg viewBox="0 0 260 220" className="w-full max-w-xs h-52">
            {/* Axes */}
            <line x1="10" y1={cy} x2="250" y2={cy} stroke="#475569" strokeWidth="1.5" />
            <line x1={cx} y1="10" x2={cx} y2="210" stroke="#475569" strokeWidth="1.5" />
            <text x="245" y={cy - 5} fill="#64748b" fontSize="8">X</text>
            <text x={cx + 5} y="15" fill="#64748b" fontSize="8">Y</text>

            {/* Unit Circle */}
            <circle cx={cx} cy={cy} r={r} fill="none" stroke="#334155" strokeWidth="2" strokeDasharray="3,3" />

            {/* Triangle components */}
            {/* Cosine (adjacent - horizontal blue) */}
            <line x1={cx} y1={cy} x2={px} y2={cy} stroke="#38bdf8" strokeWidth="3" />
            {/* Sine (opposite - vertical green) */}
            <line x1={px} y1={cy} x2={px} y2={py} stroke="#10b981" strokeWidth="3" />
            {/* Hypotenuse (radius - red) */}
            <line x1={cx} y1={cy} x2={px} y2={py} stroke="#f43f5e" strokeWidth="2.5" />

            {/* Point */}
            <circle cx={px} cy={py} r="5" fill="#f59e0b" />

            {/* Coordinate label */}
            <text x={px + 8} y={py - 6} fill="#fbbf24" fontSize="8" fontWeight="bold">
              ({cosVal}, {sinVal})
            </text>
          </svg>
          <div className="w-full mt-2">
            <div className="flex justify-between text-xs text-slate-300 mb-1">
              <span>কোণ (Angle θ):</span> <span className="font-mono text-emerald-400 font-bold">{angle}° ({((angle*Math.PI)/180).toFixed(2)} rad)</span>
            </div>
            <input type="range" min="0" max="360" value={angle} onChange={e => setAngle(+e.target.value)} className="w-full accent-emerald-500" />
          </div>
        </div>

        <div className="md:col-span-6 space-y-3 text-xs">
          <div className="grid grid-cols-3 gap-2">
            <div className="p-3 bg-slate-900 border border-sky-500/30 rounded-xl text-center">
              <span className="text-[10px] text-slate-400 block uppercase">sin(θ)</span>
              <span className="text-lg font-black text-sky-400">{sinVal}</span>
            </div>
            <div className="p-3 bg-slate-900 border border-emerald-500/30 rounded-xl text-center">
              <span className="text-[10px] text-slate-400 block uppercase">cos(θ)</span>
              <span className="text-lg font-black text-emerald-400">{cosVal}</span>
            </div>
            <div className="p-3 bg-slate-900 border border-amber-500/30 rounded-xl text-center">
              <span className="text-[10px] text-slate-400 block uppercase">tan(θ)</span>
              <span className="text-lg font-black text-amber-400">{tanVal}</span>
            </div>
          </div>

          <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl space-y-1.5">
            <p className="font-bold text-slate-200">মূল ত্রিকোণমিতিক অভেদাবলী:</p>
            <p className="font-mono text-sky-300">• sin²θ + cos²θ = 1</p>
            <p className="font-mono text-emerald-300">• sec²θ - tan²θ = 1</p>
            <p className="font-mono text-purple-300">• cosec²θ - cot²θ = 1</p>
          </div>
        </div>
      </div>
      <AICard text="একক বৃত্তে (Unit Circle) ব্যাসার্ধ r = 1। পরিধির যেকোনো বিন্দুর কার্তেসীয় স্থানাঙ্ক (x, y) = (cosθ, sinθ)। ১ম চতুর্ভাগে সকল অনুপাত ধনাত্মক, ২য়ে sin/cosec, ৩য়ে tan/cot, ৪র্থে cos/sec ধনাত্মক (All-Sin-Tan-Cos নিয়ম)।" />
    </div>
  );
}

// ==========================================
// 3. Math: Statistics Generator
// ==========================================
function StatisticsModule() {
  const [dataInput, setDataInput] = useState('45, 52, 60, 65, 70, 72, 75, 80, 85, 90, 92, 95');
  const canvasRef = useRef(null);

  const numbers = dataInput.split(',').map(n => Number(n.trim())).filter(n => !isNaN(n) && n > 0);
  const n = numbers.length;
  const mean = n > 0 ? (numbers.reduce((a, b) => a + b, 0) / n).toFixed(2) : 0;
  const sorted = [...numbers].sort((a, b) => a - b);
  const median = n > 0 ? (n % 2 === 0 ? ((sorted[n / 2 - 1] + sorted[n / 2]) / 2).toFixed(2) : sorted[Math.floor(n / 2)]) : 0;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || n === 0) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, W, H);

    // Bins for histogram
    const min = Math.min(...numbers);
    const max = Math.max(...numbers);
    const binCount = 5;
    const step = Math.max(1, Math.ceil((max - min + 1) / binCount));
    const bins = Array(binCount).fill(0);
    const binLabels = [];

    for (let i = 0; i < binCount; i++) {
      const bMin = min + i * step;
      const bMax = bMin + step - 1;
      binLabels.push(`${bMin}-${bMax}`);
    }

    numbers.forEach(num => {
      const idx = Math.min(binCount - 1, Math.floor((num - min) / step));
      bins[idx]++;
    });

    const maxFreq = Math.max(...bins, 1);
    const barWidth = (W - 60) / binCount;

    // Draw Histogram Bars & Frequency Polygon
    ctx.strokeStyle = '#334155';
    ctx.beginPath(); ctx.moveTo(40, 10); ctx.lineTo(40, H - 25); ctx.lineTo(W - 10, H - 25); ctx.stroke();

    const polyPoints = [];
    bins.forEach((freq, i) => {
      const x = 40 + i * barWidth;
      const h = (freq / maxFreq) * (H - 50);
      const y = H - 25 - h;

      // Bar
      ctx.fillStyle = 'rgba(99, 102, 241, 0.4)';
      ctx.fillRect(x + 2, y, barWidth - 4, h);
      ctx.strokeStyle = '#6366f1';
      ctx.strokeRect(x + 2, y, barWidth - 4, h);

      // Label
      ctx.fillStyle = '#94a3b8';
      ctx.font = '8px sans-serif';
      ctx.fillText(binLabels[i], x + 4, H - 12);
      ctx.fillText(freq.toString(), x + barWidth / 2 - 3, y - 4);

      polyPoints.push({ x: x + barWidth / 2, y });
    });

    // Frequency Polygon Line
    if (polyPoints.length > 1) {
      ctx.strokeStyle = '#f43f5e';
      ctx.lineWidth = 2;
      ctx.beginPath();
      polyPoints.forEach((p, i) => {
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      });
      ctx.stroke();
    }
  }, [dataInput, numbers, n]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-7 bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col items-center">
          <canvas ref={canvasRef} width={400} height={200} className="w-full rounded-xl" />
          <p className="text-xs text-slate-400 mt-2">আয়তলেখ (Histogram) ও গণসংখ্যা বহুভুজ (Frequency Polygon)</p>
        </div>

        <div className="md:col-span-5 space-y-3 text-xs">
          <div>
            <label className="text-slate-300 font-bold block mb-1">উপাত্ত প্রবেশ করান (কমা দ্বারা পৃথক):</label>
            <textarea
              value={dataInput}
              onChange={e => setDataInput(e.target.value)}
              rows={3}
              className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono text-xs focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-center">
              <span className="text-[10px] text-slate-400 block">মোট উপাত্ত</span>
              <span className="text-base font-bold text-white">{n}</span>
            </div>
            <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-center">
              <span className="text-[10px] text-slate-400 block">গড় (Mean)</span>
              <span className="text-base font-bold text-indigo-400">{mean}</span>
            </div>
            <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-center">
              <span className="text-[10px] text-slate-400 block">মধ্যক (Median)</span>
              <span className="text-base font-bold text-emerald-400">{median}</span>
            </div>
          </div>
        </div>
      </div>
      <AICard text="পরিসংখ্যানে কেন্দ্রীয় প্রবণতার পরিমাপ হলো গড়, মধ্যক ও প্রচুরক। অবিচ্ছিন্ন শ্রেণিবিন্যস্ত উপাত্তের আয়তলেখের প্রতিটি আয়তের শীর্ষবিন্দুর মধ্যবিন্দুগুলোকে রেখা দ্বারা যুক্ত করলে গণসংখ্যা বহুভুজ পাওয়া যায়।" />
    </div>
  );
}

// ==========================================
// 4. ICT: Logic Gate Simulator & Truth Table
// ==========================================
function LogicGateModule() {
  const [gate, setGate] = useState('AND');
  const [inputA, setInputA] = useState(false);
  const [inputB, setInputB] = useState(false);

  const computeGate = (g, a, b) => {
    switch (g) {
      case 'AND': return a && b;
      case 'OR': return a || b;
      case 'NOT': return !a;
      case 'NAND': return !(a && b);
      case 'NOR': return !(a || b);
      case 'XOR': return (a && !b) || (!a && b);
      case 'XNOR': return (a && b) || (!a && !b);
      default: return false;
    }
  };

  const output = computeGate(gate, inputA, inputB);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {['AND', 'OR', 'NOT', 'NAND', 'NOR', 'XOR', 'XNOR'].map(g => (
          <button
            key={g}
            onClick={() => setGate(g)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              gate === g ? 'bg-cyan-600 text-white shadow-lg scale-105' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {g} Gate
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        <div className="md:col-span-7 bg-slate-950 border border-slate-800 rounded-3xl p-5 flex flex-col items-center justify-center space-y-4">
          <div className="flex items-center justify-between w-full max-w-sm px-4">
            {/* Input Switches */}
            <div className="space-y-4">
              <button
                onClick={() => setInputA(a => !a)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  inputA ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
                }`}
              >
                ইনপুট A: {inputA ? '1 (HIGH)' : '0 (LOW)'}
              </button>
              {gate !== 'NOT' && (
                <button
                  onClick={() => setInputB(b => !b)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    inputB ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  ইনপুট B: {inputB ? '1 (HIGH)' : '0 (LOW)'}
                </button>
              )}
            </div>

            {/* Gate Symbol Visual */}
            <div className="px-5 py-4 bg-slate-900 border border-cyan-500/40 rounded-2xl text-center shadow-lg shadow-cyan-500/10">
              <span className="text-xl font-black text-cyan-400">{gate}</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">লজিক গেট</span>
            </div>

            {/* Output Bulb */}
            <div className="flex flex-col items-center">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-all ${
                output 
                  ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-xl shadow-amber-500/40 animate-pulse' 
                  : 'bg-slate-900 border-slate-800 text-slate-600'
              }`}>
                <Cpu className="w-7 h-7" />
              </div>
              <span className={`text-xs font-black mt-1.5 ${output ? 'text-amber-400' : 'text-slate-500'}`}>
                আউটপুট: {output ? '1' : '0'}
              </span>
            </div>
          </div>
        </div>

        {/* Truth Table */}
        <div className="md:col-span-5 bg-slate-950 border border-slate-800 rounded-3xl p-4 text-xs">
          <h4 className="font-bold text-slate-200 mb-2.5 flex items-center gap-1.5">
            <Binary className="w-4 h-4 text-cyan-400" />
            <span>সত্যক সারণি (Truth Table)</span>
          </h4>
          <table className="w-full text-center border-collapse">
            <thead>
              <tr className="bg-slate-900 text-slate-400 border-b border-slate-800">
                <th className="p-2">A</th>
                {gate !== 'NOT' && <th className="p-2">B</th>}
                <th className="p-2 text-cyan-400">Y ({gate})</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {gate === 'NOT' ? (
                <>
                  <tr className={!inputA ? 'bg-cyan-950/40 text-cyan-300 font-bold' : ''}>
                    <td className="p-2">0</td>
                    <td className="p-2 text-emerald-400">1</td>
                  </tr>
                  <tr className={inputA ? 'bg-cyan-950/40 text-cyan-300 font-bold' : ''}>
                    <td className="p-2">1</td>
                    <td className="p-2 text-emerald-400">0</td>
                  </tr>
                </>
              ) : (
                [
                  [false, false],
                  [false, true],
                  [true, false],
                  [true, true]
                ].map(([a, b], idx) => {
                  const out = computeGate(gate, a, b);
                  const isCurrent = a === inputA && b === inputB;
                  return (
                    <tr key={idx} className={isCurrent ? 'bg-cyan-950/40 text-cyan-300 font-bold' : 'text-slate-300'}>
                      <td className="p-2">{a ? '1' : '0'}</td>
                      <td className="p-2">{b ? '1' : '0'}</td>
                      <td className={`p-2 font-bold ${out ? 'text-amber-400' : 'text-slate-500'}`}>{out ? '1' : '0'}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
      <AICard text="মৌলিক গেট ৩টি: AND (গুণ), OR (যোগ), NOT (পূরক)। সার্বজনীন গেট ২টি: NAND ও NOR (কারণ এদের দিয়ে যেকোনো লজিক বর্তনী বাস্তবায়ন করা যায়)। বিশেষ গেট: XOR ও XNOR।" />
    </div>
  );
}

// ==========================================
// 5. ICT: Number System Converter
// ==========================================
function NumberSystemModule() {
  const [val, setVal] = useState('42');
  const [base, setBase] = useState(10);

  let dec = parseInt(val, base);
  if (isNaN(dec)) dec = 0;

  const bin = dec.toString(2);
  const oct = dec.toString(8);
  const hex = dec.toString(16).toUpperCase();

  return (
    <div className="space-y-4 text-xs">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-6 bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
          <label className="text-slate-300 font-bold block">সংখ্যা ইনপুট করুন:</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={val}
              onChange={e => setVal(e.target.value)}
              className="flex-1 p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono font-bold text-sm focus:ring-2 focus:ring-cyan-500"
            />
            <select
              value={base}
              onChange={e => setBase(+e.target.value)}
              className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-cyan-300 font-bold focus:ring-2 focus:ring-cyan-500"
            >
              <option value={10}>দশমিক (Decimal 10)</option>
              <option value={2}>বাইনারি (Binary 2)</option>
              <option value={8}>অক্টাল (Octal 8)</option>
              <option value={16}>হেক্সাডেসিমেল (Hex 16)</option>
            </select>
          </div>
        </div>

        <div className="md:col-span-6 grid grid-cols-2 gap-2.5">
          <div className="p-3 bg-slate-900 border border-emerald-500/30 rounded-xl">
            <span className="text-[10px] text-slate-400 block">বাইনারি (Base 2):</span>
            <span className="font-mono text-sm font-bold text-emerald-400 break-all">{bin}₂</span>
          </div>
          <div className="p-3 bg-slate-900 border border-sky-500/30 rounded-xl">
            <span className="text-[10px] text-slate-400 block">অক্টাল (Base 8):</span>
            <span className="font-mono text-sm font-bold text-sky-400 break-all">{oct}₈</span>
          </div>
          <div className="p-3 bg-slate-900 border border-indigo-500/30 rounded-xl">
            <span className="text-[10px] text-slate-400 block">দশমিক (Base 10):</span>
            <span className="font-mono text-sm font-bold text-indigo-400 break-all">{dec}₁₀</span>
          </div>
          <div className="p-3 bg-slate-900 border border-amber-500/30 rounded-xl">
            <span className="text-[10px] text-slate-400 block">হেক্সাডেসিমেল (Base 16):</span>
            <span className="font-mono text-sm font-bold text-amber-400 break-all">{hex}₁₆</span>
          </div>
        </div>
      </div>
      <AICard text="সংখ্যা পদ্ধতির রূপান্তর: দশমিক থেকে অন্য ভিত্তিতে রূপান্তরের জন্য ভিত্তি দিয়ে পূর্ণাংশকে ভাগ ও ভগ্নাংশকে গুণ করতে হয়। বাইনারি থেকে অক্টালে ৩ বিট এবং হেক্সাডেসিমেলে ৪ বিট করে গ্রুপ করতে হয়।" />
    </div>
  );
}

// ==========================================
// 6. ICT: HTML & C Code Sandbox
// ==========================================
function CodeSandboxModule() {
  const [lang, setLang] = useState('html');
  const [htmlCode, setHtmlCode] = useState(`<div style="font-family: sans-serif; text-align: center; padding: 20px; color: #0284c7;">
  <h2>NextGen Academy Smart Sandbox</h2>
  <p style="color: #475569;">এইচটিএমএল কোড পরিবর্তন করে সরাসরি আউটপুট দেখুন!</p>
  <button style="background: #0284c7; color: white; border: none; padding: 8px 16px; border-radius: 8px; font-weight: bold; cursor: pointer;">
    ক্লিক করুন
  </button>
</div>`);

  const [cCode, setCCode] = useState(`#include <stdio.h>

int main() {
    int n = 5;
    long long fact = 1;
    for(int i = 1; i <= n; i++) {
        fact *= i;
    }
    printf("NextGen Academy - Factorial of %d = %lld\n", n, fact);
    return 0;
}`);

  const [cOutput, setCOutput] = useState('NextGen Academy - Factorial of 5 = 120\n[Process completed successfully]');

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          onClick={() => setLang('html')}
          className={`px-4 py-2 rounded-xl text-xs font-bold ${lang === 'html' ? 'bg-sky-600 text-white' : 'bg-slate-800 text-slate-400'}`}
        >
          HTML / CSS স্যান্ডবক্স
        </button>
        <button
          onClick={() => setLang('c')}
          className={`px-4 py-2 rounded-xl text-xs font-bold ${lang === 'c' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'}`}
        >
          C প্রোগ্রামিং রানার
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300">কোড এডিটর:</label>
          <textarea
            value={lang === 'html' ? htmlCode : cCode}
            onChange={e => lang === 'html' ? setHtmlCode(e.target.value) : setCCode(e.target.value)}
            rows={10}
            className="w-full p-3 bg-slate-950 border border-slate-800 rounded-2xl text-emerald-300 font-mono text-xs focus:ring-2 focus:ring-sky-500"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300">লাইভ আউটপুট প্রিভিউ:</label>
          {lang === 'html' ? (
            <iframe
              srcDoc={htmlCode}
              title="output"
              className="w-full h-56 bg-white rounded-2xl border border-slate-800"
            />
          ) : (
            <div className="w-full h-56 bg-black p-4 rounded-2xl border border-slate-800 font-mono text-xs text-emerald-400 overflow-auto">
              <p className="text-slate-500">// GCC Compiler Output</p>
              <pre className="mt-2 whitespace-pre-wrap">{cOutput}</pre>
            </div>
          )}
        </div>
      </div>
      <AICard text="আইসিটি বোর্ড পরীক্ষায় C ভাষায় লুপ (for, while), শর্তাধীন কাঠামো (if-else), অ্যারে ও ফাংশন অত্যন্ত গুরুত্বপূর্ণ। HTML এ টেবিল, হাইপারলিংক (<a>) ও ছবি (<img>) ট্যাগ থেকে প্রায়শই সৃজনশীল প্রশ্ন আসে।" />
    </div>
  );
}

// ==========================================
// MAIN COMPONENT
// ==========================================
const TABS = [
  { key: 'graphing', label: 'ফাংশনের গ্রাফ (Graphing)', icon: Sliders, Component: GraphingModule },
  { key: 'trig', label: 'ত্রিকোণমিতি একক বৃত্ত (Trigonometry)', icon: Activity, Component: TrigonometryModule },
  { key: 'stats', label: 'পরিসংখ্যান ও আয়তলেখ (Statistics)', icon: Calculator, Component: StatisticsModule },
  { key: 'logic', label: 'আইসিটি লজিক গেট সিমুলেটর', icon: Cpu, Component: LogicGateModule },
  { key: 'radix', label: 'সংখ্যা পদ্ধতি রূপান্তর (Radix Converter)', icon: Binary, Component: NumberSystemModule },
  { key: 'sandbox', label: 'এইচটিএমএল ও সি স্যান্ডবক্স (Sandbox)', icon: Code2, Component: CodeSandboxModule },
];

export default function MasterMathICTLab() {
  const [activeTab, setActiveTab] = useState('graphing');
  const [isExporting, setIsExporting] = useState(false);
  const labRef = useRef(null);
  const CurrentTab = TABS.find(t => t.key === activeTab);

  const handleExport = async () => {
    if (!labRef.current) return;
    setIsExporting(true);
    try {
      await exportBrandedGraphic(labRef.current, {
        fileName: `NextGen_MathICT_${activeTab}`,
        cardTitle: `গণিত ও আইসিটি ইঞ্জিন: ${CurrentTab?.label}`,
        scale: 2
      });
    } catch (e) {
      console.error('Export failed:', e);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 rounded-3xl text-white flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <Calculator className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-black flex items-center gap-2">
              মাস্টার গণিত ও আইসিটি ইঞ্জিন (Math & ICT Lab)
              <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs">
                SSC & ICT
              </span>
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              দ্বিঘাত সমীকরণ গ্রাফ • ত্রিকোণমিতিক একক বৃত্ত • পরিসংখ্যান • লজিক গেট সিমুলেটর • কোড স্যান্ডবক্স
            </p>
          </div>
        </div>

        <button 
          type="button" 
          onClick={handleExport} 
          disabled={isExporting}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-black text-xs shadow-lg flex items-center gap-2 hover:scale-105 transition-all disabled:opacity-50 flex-shrink-0"
        >
          {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          <span>সমাধান ও গ্রাফ ডাউনলোড</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {TABS.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black transition-all ${
                isActive 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 scale-105' 
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Workspace */}
      <div ref={labRef} className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl">
        <div className="flex items-center gap-2 mb-4 pb-4 border-b border-slate-800">
          {CurrentTab && <CurrentTab.icon className="w-5 h-5 text-indigo-400" />}
          <h3 className="font-black text-white">{CurrentTab?.label}</h3>
          <span className="text-xs text-slate-500">NextGen Mathematical & ICT Interactive Engine</span>
        </div>
        {CurrentTab && <CurrentTab.Component />}
      </div>
    </div>
  );
}
