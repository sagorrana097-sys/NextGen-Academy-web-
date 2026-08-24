import React, { useState, useEffect, useRef } from 'react';
import {
  Calculator,
  X,
  Minus,
  Maximize2,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  History,
  Trash2,
  Move,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export default function ScientificCalculatorWidget({
  isOpen = false,
  onClose = () => {},
  initialPosition = { x: 20, y: 80 }
}) {
  // Calculator Core State (Persisted even when widget is closed/minimized)
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('');
  const [history, setHistory] = useState([]);
  const [angleMode, setAngleMode] = useState('DEG'); // 'DEG' | 'RAD'
  const [isSecondFunc, setIsSecondFunc] = useState(false); // 2nd function toggle
  const [memory, setMemory] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  // Dragging State
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const calculatorRef = useRef(null);

  // Factorial helper
  const factorial = (n) => {
    if (n < 0) return NaN;
    if (n === 0 || n === 1) return 1;
    let res = 1;
    for (let i = 2; i <= Math.min(n, 170); i++) {
      res *= i;
    }
    return res;
  };

  // Safe Math Expression Evaluator
  const evaluateExpression = (expr) => {
    if (!expr || !expr.trim()) return '';

    try {
      // Pre-process expression for mathematical execution
      let processed = expr
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/π/g, 'Math.PI')
        .replace(/\be\b/g, 'Math.E')
        .replace(/%/g, '/100');

      // Replace power operator
      processed = processed.replace(/\^/g, '**');

      // Handle trigonometry with DEG / RAD conversion
      if (angleMode === 'DEG') {
        processed = processed.replace(/sin\(([^)]+)\)/g, 'Math.sin(($1) * Math.PI / 180)');
        processed = processed.replace(/cos\(([^)]+)\)/g, 'Math.cos(($1) * Math.PI / 180)');
        processed = processed.replace(/tan\(([^)]+)\)/g, 'Math.tan(($1) * Math.PI / 180)');
        processed = processed.replace(/asin\(([^)]+)\)/g, '(Math.asin($1) * 180 / Math.PI)');
        processed = processed.replace(/acos\(([^)]+)\)/g, '(Math.acos($1) * 180 / Math.PI)');
        processed = processed.replace(/atan\(([^)]+)\)/g, '(Math.atan($1) * 180 / Math.PI)');
      } else {
        processed = processed.replace(/sin\(/g, 'Math.sin(');
        processed = processed.replace(/cos\(/g, 'Math.cos(');
        processed = processed.replace(/tan\(/g, 'Math.tan(');
        processed = processed.replace(/asin\(/g, 'Math.asin(');
        processed = processed.replace(/acos\(/g, 'Math.acos(');
        processed = processed.replace(/atan\(/g, 'Math.atan(');
      }

      // Hyperbolic & Logs
      processed = processed.replace(/sinh\(/g, 'Math.sinh(');
      processed = processed.replace(/cosh\(/g, 'Math.cosh(');
      processed = processed.replace(/tanh\(/g, 'Math.tanh(');
      processed = processed.replace(/log\(/g, 'Math.log10(');
      processed = processed.replace(/ln\(/g, 'Math.log(');
      processed = processed.replace(/sqrt\(/g, 'Math.sqrt(');
      processed = processed.replace(/cbrt\(/g, 'Math.cbrt(');
      processed = processed.replace(/abs\(/g, 'Math.abs(');

      // Safe Function evaluation
      // eslint-disable-next-line no-new-func
      const evalFunc = new Function('Math', 'factorial', `return (${processed});`);
      const evaluated = evalFunc(Math, factorial);

      if (typeof evaluated === 'number') {
        if (Number.isNaN(evaluated)) return 'Math Error';
        if (!Number.isFinite(evaluated)) return 'Infinity';
        // Round cleanly to avoid floating point precision artifacts (e.g. 0.0000000000000001)
        return Number(evaluated.toFixed(10)).toString();
      }
      return String(evaluated);
    } catch (err) {
      return 'Error';
    }
  };

  // Append token to expression
  const appendToken = (token) => {
    setExpression((prev) => prev + token);
  };

  // Clear All
  const handleClear = () => {
    setExpression('');
    setResult('');
  };

  // Backspace / Delete
  const handleBackspace = () => {
    setExpression((prev) => prev.slice(0, -1));
  };

  // Equals
  const handleEquals = () => {
    if (!expression) return;
    const evaluated = evaluateExpression(expression);
    setResult(evaluated);

    if (evaluated && evaluated !== 'Error' && evaluated !== 'Math Error') {
      setHistory((prev) => [
        {
          expr: expression,
          res: evaluated,
          timestamp: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
        },
        ...prev.slice(0, 19) // Keep last 20 calculations
      ]);
    }
  };

  // Toggle +/-
  const handleToggleSign = () => {
    if (!expression) return;
    if (expression.startsWith('-(') && expression.endsWith(')')) {
      setExpression(expression.slice(2, -1));
    } else {
      setExpression(`-(${expression})`);
    }
  };

  // Copy Result
  const handleCopyResult = () => {
    const textToCopy = result || expression;
    if (!textToCopy) return;
    navigator.clipboard?.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Memory Handlers
  const handleMemoryAdd = () => {
    const currentVal = Number(result || evaluateExpression(expression) || 0);
    if (!Number.isNaN(currentVal)) setMemory((prev) => prev + currentVal);
  };

  const handleMemorySub = () => {
    const currentVal = Number(result || evaluateExpression(expression) || 0);
    if (!Number.isNaN(currentVal)) setMemory((prev) => prev - currentVal);
  };

  const handleMemoryRecall = () => {
    appendToken(memory.toString());
  };

  const handleMemoryClear = () => {
    setMemory(0);
  };

  // Keyboard support while widget is open
  useEffect(() => {
    if (!isOpen || isMinimized) return;

    const handleKeyDown = (e) => {
      // Don't intercept if user is typing in an input/textarea elsewhere
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;

      if ((e.key >= '0' && e.key <= '9') || ['.', '+', '-', '*', '/', '(', ')', '^', '%'].includes(e.key)) {
        e.preventDefault();
        const map = { '*': '×', '/': '÷' };
        appendToken(map[e.key] || e.key);
      } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        handleEquals();
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        handleBackspace();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setIsMinimized(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isMinimized, expression]);

  // Dragging mouse event listeners
  const handleMouseDown = (e) => {
    if (e.target.closest('button') || e.target.closest('input')) return;
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      const newX = Math.max(10, Math.min(window.innerWidth - 380, e.clientX - dragOffset.x));
      const newY = Math.max(10, Math.min(window.innerHeight - 200, e.clientY - dragOffset.y));
      setPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  if (!isOpen) return null;

  return (
    <div
      ref={calculatorRef}
      style={{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: 9999
      }}
      className="select-none animate-in fade-in zoom-in-95 duration-150"
    >
      <div className="w-[340px] sm:w-[380px] bg-slate-950/95 backdrop-blur-2xl rounded-3xl border border-slate-700/80 shadow-2xl shadow-black/80 overflow-hidden text-slate-100 flex flex-col ring-1 ring-white/10">
        {/* Header & Title Bar */}
        <div
          onMouseDown={handleMouseDown}
          className="px-4 py-3 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-800 flex items-center justify-between cursor-move"
        >
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-xs tracking-wide text-white flex items-center space-x-1.5">
                <span>সায়েন্টিফিক ক্যালকুলেটর</span>
                <span className="px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-[9px] font-mono">
                  {angleMode}
                </span>
              </h3>
              <p className="text-[9px] text-slate-400">লাইভ পরীক্ষা মোড • ড্র্যাগ করে সরানো যাবে</p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center space-x-1">
            <button
              type="button"
              onClick={() => setShowHistory(!showHistory)}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                showHistory ? 'bg-emerald-500/30 text-emerald-300' : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              title="পূর্ববর্তী হিসাবের হিস্টোরি"
            >
              <History className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title={isMinimized ? 'বড় করুন' : 'মিনিমাইজ করুন'}
            >
              {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5" />}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 transition-colors"
              title="বন্ধ করুন"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Display Screen */}
        <div className="p-4 bg-slate-900/90 border-b border-slate-800/80 space-y-1 relative">
          {/* Top Info Bar */}
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setAngleMode(angleMode === 'DEG' ? 'RAD' : 'DEG')}
                className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold border border-slate-700 transition-colors"
              >
                {angleMode}
              </button>
              {memory !== 0 && <span className="text-amber-400 font-bold">M ({memory})</span>}
            </div>

            <div className="flex items-center space-x-1">
              <button
                type="button"
                onClick={handleCopyResult}
                className="hover:text-emerald-400 transition-colors flex items-center space-x-1"
                title="ফলাফল কপি করুন"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'কপি হয়েছে' : 'কপি'}</span>
              </button>
            </div>
          </div>

          {/* Expression Line */}
          <div className="text-right text-xs font-mono text-slate-400 min-h-[18px] overflow-x-auto whitespace-nowrap scrollbar-none">
            {expression || '0'}
          </div>

          {/* Result Output Line */}
          <div className="text-right text-2xl font-black font-mono text-emerald-400 tracking-tight overflow-x-auto whitespace-nowrap scrollbar-none">
            {result || (expression ? evaluateExpression(expression) : '0')}
          </div>
        </div>

        {/* Minimized Compact View */}
        {isMinimized ? (
          <div className="p-3 bg-slate-950 flex items-center justify-between text-xs text-slate-300">
            <span>মিনিমাইজ করা হয়েছে</span>
            <button
              type="button"
              onClick={() => setIsMinimized(false)}
              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
            >
              ক্যালকুলেটর খুলুন
            </button>
          </div>
        ) : showHistory ? (
          /* History Tape Panel */
          <div className="p-4 bg-slate-900/60 max-h-[340px] overflow-y-auto space-y-2.5 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="font-bold text-slate-300 text-[11px] uppercase">গণনার ইতিহাস (History)</span>
              {history.length > 0 && (
                <button
                  type="button"
                  onClick={() => setHistory([])}
                  className="text-rose-400 hover:text-rose-300 text-[10px] flex items-center space-x-1"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>মুছে ফেলুন</span>
                </button>
              )}
            </div>

            {history.length === 0 ? (
              <p className="text-slate-500 text-center py-6 text-[11px]">এখনো কোনো গণনা রেকর্ড করা হয়নি</p>
            ) : (
              history.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setExpression(item.expr);
                    setResult(item.res);
                    setShowHistory(false);
                  }}
                  className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-750 border border-slate-700/60 cursor-pointer text-right space-y-0.5 transition-colors group"
                >
                  <div className="text-[10px] text-slate-400 font-mono group-hover:text-slate-200">
                    {item.expr} =
                  </div>
                  <div className="text-sm font-black font-mono text-emerald-400">
                    {item.res}
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          /* Scientific Keypad Grid */
          <div className="p-3 bg-slate-950 space-y-2">
            {/* Top Scientific Function Row 1 */}
            <div className="grid grid-cols-5 gap-1.5 text-xs font-bold">
              <button
                type="button"
                onClick={() => setIsSecondFunc(!isSecondFunc)}
                className={`py-2 rounded-xl text-[11px] transition-all ${
                  isSecondFunc ? 'bg-amber-500 text-slate-950 font-black' : 'bg-slate-800 hover:bg-slate-700 text-amber-300'
                }`}
              >
                2nd
              </button>
              <button
                type="button"
                onClick={() => appendToken(isSecondFunc ? 'asin(' : 'sin(')}
                className="py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 text-[11px]"
              >
                {isSecondFunc ? 'sin⁻¹' : 'sin'}
              </button>
              <button
                type="button"
                onClick={() => appendToken(isSecondFunc ? 'acos(' : 'cos(')}
                className="py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 text-[11px]"
              >
                {isSecondFunc ? 'cos⁻¹' : 'cos'}
              </button>
              <button
                type="button"
                onClick={() => appendToken(isSecondFunc ? 'atan(' : 'tan(')}
                className="py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 text-[11px]"
              >
                {isSecondFunc ? 'tan⁻¹' : 'tan'}
              </button>
              <button
                type="button"
                onClick={() => appendToken('^')}
                className="py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 text-[11px]"
              >
                xʸ
              </button>
            </div>

            {/* Scientific Function Row 2 */}
            <div className="grid grid-cols-5 gap-1.5 text-xs font-bold">
              <button
                type="button"
                onClick={() => appendToken(isSecondFunc ? '10^(' : 'log(')}
                className="py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 text-[11px]"
              >
                {isSecondFunc ? '10ˣ' : 'log'}
              </button>
              <button
                type="button"
                onClick={() => appendToken(isSecondFunc ? 'e^(' : 'ln(')}
                className="py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 text-[11px]"
              >
                {isSecondFunc ? 'eˣ' : 'ln'}
              </button>
              <button
                type="button"
                onClick={() => appendToken('sqrt(')}
                className="py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 text-[11px]"
              >
                √x
              </button>
              <button
                type="button"
                onClick={() => appendToken('π')}
                className="py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 text-[11px]"
              >
                π
              </button>
              <button
                type="button"
                onClick={() => appendToken('e')}
                className="py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 text-[11px]"
              >
                e
              </button>
            </div>

            {/* Scientific Function Row 3: Memory & Brackets */}
            <div className="grid grid-cols-5 gap-1.5 text-xs font-bold">
              <button
                type="button"
                onClick={() => appendToken('(')}
                className="py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px]"
              >
                (
              </button>
              <button
                type="button"
                onClick={() => appendToken(')')}
                className="py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px]"
              >
                )
              </button>
              <button
                type="button"
                onClick={handleMemoryAdd}
                className="py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 text-[10px]"
                title="মেমোরিতে যোগ"
              >
                M+
              </button>
              <button
                type="button"
                onClick={handleMemoryRecall}
                className="py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 text-[10px]"
                title="মেমোরি রিকল"
              >
                MR
              </button>
              <button
                type="button"
                onClick={handleMemoryClear}
                className="py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 text-[10px]"
                title="মেমোরি ক্লিয়ার"
              >
                MC
              </button>
            </div>

            {/* Standard Keypad Grid */}
            <div className="grid grid-cols-4 gap-1.5 text-sm font-bold pt-1">
              {/* Row 1 */}
              <button
                type="button"
                onClick={handleClear}
                className="py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-black shadow-md shadow-rose-600/30 active:scale-95 transition-all"
              >
                AC
              </button>
              <button
                type="button"
                onClick={handleBackspace}
                className="py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 active:scale-95 transition-all"
              >
                DEL
              </button>
              <button
                type="button"
                onClick={() => appendToken('%')}
                className="py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-indigo-300 active:scale-95 transition-all"
              >
                %
              </button>
              <button
                type="button"
                onClick={() => appendToken('÷')}
                className="py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black active:scale-95 transition-all"
              >
                ÷
              </button>

              {/* Row 2 */}
              <button
                type="button"
                onClick={() => appendToken('7')}
                className="py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white border border-slate-800 active:scale-95 transition-all"
              >
                7
              </button>
              <button
                type="button"
                onClick={() => appendToken('8')}
                className="py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white border border-slate-800 active:scale-95 transition-all"
              >
                8
              </button>
              <button
                type="button"
                onClick={() => appendToken('9')}
                className="py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white border border-slate-800 active:scale-95 transition-all"
              >
                9
              </button>
              <button
                type="button"
                onClick={() => appendToken('×')}
                className="py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black active:scale-95 transition-all"
              >
                ×
              </button>

              {/* Row 3 */}
              <button
                type="button"
                onClick={() => appendToken('4')}
                className="py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white border border-slate-800 active:scale-95 transition-all"
              >
                4
              </button>
              <button
                type="button"
                onClick={() => appendToken('5')}
                className="py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white border border-slate-800 active:scale-95 transition-all"
              >
                5
              </button>
              <button
                type="button"
                onClick={() => appendToken('6')}
                className="py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white border border-slate-800 active:scale-95 transition-all"
              >
                6
              </button>
              <button
                type="button"
                onClick={() => appendToken('-')}
                className="py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black active:scale-95 transition-all"
              >
                -
              </button>

              {/* Row 4 */}
              <button
                type="button"
                onClick={() => appendToken('1')}
                className="py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white border border-slate-800 active:scale-95 transition-all"
              >
                1
              </button>
              <button
                type="button"
                onClick={() => appendToken('2')}
                className="py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white border border-slate-800 active:scale-95 transition-all"
              >
                2
              </button>
              <button
                type="button"
                onClick={() => appendToken('3')}
                className="py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white border border-slate-800 active:scale-95 transition-all"
              >
                3
              </button>
              <button
                type="button"
                onClick={() => appendToken('+')}
                className="py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black active:scale-95 transition-all"
              >
                +
              </button>

              {/* Row 5 */}
              <button
                type="button"
                onClick={handleToggleSign}
                className="py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 active:scale-95 transition-all text-xs"
              >
                ±
              </button>
              <button
                type="button"
                onClick={() => appendToken('0')}
                className="py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white border border-slate-800 active:scale-95 transition-all"
              >
                0
              </button>
              <button
                type="button"
                onClick={() => appendToken('.')}
                className="py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white border border-slate-800 active:scale-95 transition-all font-black"
              >
                .
              </button>
              <button
                type="button"
                onClick={handleEquals}
                className="py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black shadow-lg shadow-emerald-600/30 active:scale-95 transition-all"
              >
                =
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
