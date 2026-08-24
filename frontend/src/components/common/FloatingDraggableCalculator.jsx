import React, { useState } from 'react';
import DraggableFloatingContainer from './DraggableFloatingContainer';
import {
  Calculator,
  X,
  Minus,
  Maximize2,
  Copy,
  Check,
  History,
  Trash2,
  Move
} from 'lucide-react';

export default function FloatingDraggableCalculator() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('');
  const [history, setHistory] = useState([]);
  const [angleMode, setAngleMode] = useState('DEG'); // 'DEG' | 'RAD'
  const [copied, setCopied] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const evaluateExpression = (expr) => {
    if (!expr || !expr.trim()) return '';
    try {
      let processed = expr
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/π/g, 'Math.PI')
        .replace(/\be\b/g, 'Math.E')
        .replace(/%/g, '/100')
        .replace(/\^/g, '**');

      if (angleMode === 'DEG') {
        processed = processed.replace(/sin\(([^)]+)\)/g, 'Math.sin(($1) * Math.PI / 180)');
        processed = processed.replace(/cos\(([^)]+)\)/g, 'Math.cos(($1) * Math.PI / 180)');
        processed = processed.replace(/tan\(([^)]+)\)/g, 'Math.tan(($1) * Math.PI / 180)');
      } else {
        processed = processed.replace(/sin\(/g, 'Math.sin(');
        processed = processed.replace(/cos\(/g, 'Math.cos(');
        processed = processed.replace(/tan\(/g, 'Math.tan(');
      }

      processed = processed.replace(/sqrt\(/g, 'Math.sqrt(');
      processed = processed.replace(/log\(/g, 'Math.log10(');
      processed = processed.replace(/ln\(/g, 'Math.log(');

      // eslint-disable-next-line no-new-func
      const evalFunc = new Function('Math', `return (${processed});`);
      const evaluated = evalFunc(Math);

      if (typeof evaluated === 'number') {
        if (Number.isNaN(evaluated)) return 'Math Error';
        if (!Number.isFinite(evaluated)) return 'Infinity';
        return Number(evaluated.toFixed(8)).toString();
      }
      return String(evaluated);
    } catch (err) {
      return 'Error';
    }
  };

  const handleInput = (val) => setExpression(prev => prev + val);
  const handleClear = () => { setExpression(''); setResult(''); };
  const handleBackspace = () => setExpression(prev => prev.slice(0, -1));

  const handleEqual = () => {
    if (!expression.trim()) return;
    const res = evaluateExpression(expression);
    setResult(res);
    if (res && res !== 'Error' && res !== 'Math Error') {
      setHistory(prev => [{ expr: expression, res }, ...prev.slice(0, 15)]);
    }
  };

  const handleCopyResult = () => {
    const textToCopy = result || expression;
    if (!textToCopy) return;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const initPos = {
    x: typeof window !== 'undefined' ? Math.max(10, window.innerWidth - 75) : 1100,
    y: 110
  };

  return (
    <DraggableFloatingContainer
      id="calculator_widget"
      initialPosition={initPos}
      handleSelector="[data-drag-handle]"
      className="z-[92]"
    >
      {({ isDragging }) => (
        <div className="relative">
          {/* 1. COLLAPSED FLOATING LAUNCHER BUTTON */}
          {!isOpen && (
            <div
              data-drag-handle
              className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-600 via-orange-600 to-amber-500 hover:from-amber-500 hover:to-orange-500 text-white flex items-center justify-center shadow-2xl shadow-amber-950/60 border border-amber-300/40 ring-1 ring-amber-400/30 cursor-grab active:cursor-grabbing transition-transform hover:scale-110 active:scale-95 group"
              title="স্মার্ট ক্যালকুলেটর (ড্র্যাগ করুন বা ক্লিক করে ওপেন করুন)"
            >
              <button
                type="button"
                data-no-drag
                onClick={() => {
                  setIsOpen(true);
                  setIsMinimized(false);
                }}
                className="w-full h-full flex items-center justify-center"
              >
                <Calculator className="w-6 h-6 group-hover:rotate-12 transition-transform text-white" />
              </button>
            </div>
          )}

          {/* 2. MINIMIZED FLOATING BADGE */}
          {isOpen && isMinimized && (
            <div
              data-drag-handle
              className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-slate-900/95 border border-amber-500/50 text-white shadow-2xl backdrop-blur-xl cursor-grab active:cursor-grabbing"
            >
              <Calculator className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold text-slate-200">ক্যালকুলেটর</span>
              <button
                type="button"
                data-no-drag
                onClick={() => setIsMinimized(false)}
                className="p-1 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs"
                title="বড় করুন"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                data-no-drag
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white text-xs"
                title="বন্ধ করুন"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* 3. FULL EXPANDED CALCULATOR WINDOW */}
          {isOpen && !isMinimized && (
            <div className="w-[300px] sm:w-[320px] bg-slate-900/95 backdrop-blur-2xl border border-amber-500/40 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-white animate-in zoom-in-95 duration-150">
              
              {/* Header & Drag Handle */}
              <div
                data-drag-handle
                className="p-3 bg-gradient-to-r from-amber-950 via-slate-900 to-slate-900 border-b border-amber-500/30 flex items-center justify-between cursor-grab active:cursor-grabbing"
              >
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 rounded-xl bg-amber-500 text-slate-950 font-black">
                    <Calculator className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-white">স্মার্ট ক্যালকুলেটর</h4>
                    <p className="text-[9px] text-amber-300 font-mono">Scientific & Standard</p>
                  </div>
                </div>

                <div className="flex items-center space-x-1">
                  <div className="p-1 text-slate-400 hover:text-white" title="ড্র্যাগ করুন">
                    <Move className="w-3.5 h-3.5" />
                  </div>
                  <button
                    type="button"
                    data-no-drag
                    onClick={() => setAngleMode(angleMode === 'DEG' ? 'RAD' : 'DEG')}
                    className="px-1.5 py-0.5 rounded bg-slate-800 text-[9px] font-bold text-amber-300 border border-slate-700"
                    title="ডিগ্রি / রেডিয়ান মোড"
                  >
                    {angleMode}
                  </button>
                  <button
                    type="button"
                    data-no-drag
                    onClick={() => setShowHistory(!showHistory)}
                    className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                    title="হিস্ট্রি"
                  >
                    <History className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    data-no-drag
                    onClick={() => setIsMinimized(true)}
                    className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                    title="মিনিমাইজ"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    data-no-drag
                    onClick={() => setIsOpen(false)}
                    className="p-1 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/40"
                    title="বন্ধ করুন"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Calculator Screen / Display */}
              <div className="p-3 bg-slate-950/80 border-b border-slate-800 flex flex-col justify-end text-right min-h-[72px]" data-no-drag>
                <div className="text-slate-400 text-xs font-mono tracking-wider overflow-x-auto whitespace-nowrap">
                  {expression || '0'}
                </div>
                <div className="text-xl sm:text-2xl font-black text-amber-300 font-mono tracking-tight flex items-center justify-between mt-1">
                  <button
                    type="button"
                    onClick={handleCopyResult}
                    className="p-1 rounded text-slate-500 hover:text-amber-300 text-[10px]"
                    title="ফলাফল কপি করুন"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <span>{result || (expression ? '=' : '0')}</span>
                </div>
              </div>

              {/* History Panel Overlay */}
              {showHistory && (
                <div className="p-2 bg-slate-950/90 border-b border-slate-800 max-h-32 overflow-y-auto space-y-1 text-xs" data-no-drag>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 pb-1 border-b border-slate-800">
                    <span>হিস্ট্রি</span>
                    <button
                      type="button"
                      onClick={() => setHistory([])}
                      className="text-rose-400 hover:text-rose-300 flex items-center gap-0.5"
                    >
                      <Trash2 className="w-3 h-3" /> ক্লিয়ার
                    </button>
                  </div>
                  {history.length === 0 ? (
                    <p className="text-[10px] text-slate-500 py-1 text-center">কোনো পূর্ববর্তী হিসাব নেই</p>
                  ) : (
                    history.map((h, i) => (
                      <div
                        key={i}
                        onClick={() => {
                          setExpression(h.res);
                          setResult('');
                          setShowHistory(false);
                        }}
                        className="p-1.5 rounded-lg bg-slate-900/60 hover:bg-slate-800/80 cursor-pointer flex items-center justify-between text-[11px] font-mono"
                      >
                        <span className="text-slate-400 truncate">{h.expr}</span>
                        <span className="text-amber-300 font-bold ml-2">{h.res}</span>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Keypad Grid */}
              <div className="p-3 grid grid-cols-4 gap-1.5 text-xs font-bold" data-no-drag>
                {/* Row 1: Sci Functions */}
                <button type="button" onClick={() => handleInput('sin(')} className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-[11px]">sin</button>
                <button type="button" onClick={() => handleInput('cos(')} className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-[11px]">cos</button>
                <button type="button" onClick={() => handleInput('tan(')} className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-[11px]">tan</button>
                <button type="button" onClick={() => handleInput('^')} className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-[11px]">xʸ</button>

                {/* Row 2 */}
                <button type="button" onClick={() => handleInput('sqrt(')} className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-[11px]">√</button>
                <button type="button" onClick={() => handleInput('π')} className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-[11px]">π</button>
                <button type="button" onClick={() => handleInput('(')} className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-[11px]">(</button>
                <button type="button" onClick={() => handleInput(')')} className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-[11px]">)</button>

                {/* Row 3: Clear & Operators */}
                <button type="button" onClick={handleClear} className="p-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-black">C</button>
                <button type="button" onClick={handleBackspace} className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold">⌫</button>
                <button type="button" onClick={() => handleInput('%')} className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300">%</button>
                <button type="button" onClick={() => handleInput('÷')} className="p-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-sm">÷</button>

                {/* Row 4 */}
                <button type="button" onClick={() => handleInput('7')} className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white font-mono text-sm">7</button>
                <button type="button" onClick={() => handleInput('8')} className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white font-mono text-sm">8</button>
                <button type="button" onClick={() => handleInput('9')} className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white font-mono text-sm">9</button>
                <button type="button" onClick={() => handleInput('×')} className="p-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-sm">×</button>

                {/* Row 5 */}
                <button type="button" onClick={() => handleInput('4')} className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white font-mono text-sm">4</button>
                <button type="button" onClick={() => handleInput('5')} className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white font-mono text-sm">5</button>
                <button type="button" onClick={() => handleInput('6')} className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white font-mono text-sm">6</button>
                <button type="button" onClick={() => handleInput('-')} className="p-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-sm">-</button>

                {/* Row 6 */}
                <button type="button" onClick={() => handleInput('1')} className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white font-mono text-sm">1</button>
                <button type="button" onClick={() => handleInput('2')} className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white font-mono text-sm">2</button>
                <button type="button" onClick={() => handleInput('3')} className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white font-mono text-sm">3</button>
                <button type="button" onClick={() => handleInput('+')} className="p-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-sm">+</button>

                {/* Row 7 */}
                <button type="button" onClick={() => handleInput('0')} className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white font-mono text-sm col-span-2">0</button>
                <button type="button" onClick={() => handleInput('.')} className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white font-mono text-sm">.</button>
                <button type="button" onClick={handleEqual} className="p-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-sm shadow-md shadow-amber-500/20">=</button>
              </div>

            </div>
          )}
        </div>
      )}
    </DraggableFloatingContainer>
  );
}
