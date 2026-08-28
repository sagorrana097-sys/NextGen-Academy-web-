import React, { useMemo, useEffect, useRef } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

/**
 * Universal Math & Equation Renderer Component
 * Renders LaTeX formulas ($...$, $$...$$, \(...\), \[...\]) with KaTeX & MathJax 3
 * Automatically detects and formats Sets (e.g. Q = {x : 0 < x < 6}), Power Sets P(Q),
 * Relations, Inequalities (0 < x < 6), and Scientific units (2.5 m s-2)
 */
export default function MathRenderer({ text = '', inline = true, className = '' }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.MathJax && window.MathJax.typesetPromise && containerRef.current) {
      window.MathJax.typesetPromise([containerRef.current]).catch(() => {});
    }
  }, [text]);
  const renderedContent = useMemo(() => {
    if (!text || typeof text !== 'string') return text || '';

    // 1. ONLY PUA (Private Use Area \uF000 - \uF0FF) Symbol conversions (NEVER touch \u0080-\u00FF which are Bijoy chars!)
    const SYMBOL_MAP = {
      '\uF0CE': '∈',
      '\uF0CF': '∉',
      '\uF0A3': '≤',
      '\uF0B3': '≥',
      '\uF0B9': '≠',
      '\uF0C6': '∅',
      '\uF0C8': '∪',
      '\uF0C7': '∩',
      '\uF0CC': '⊂',
      '\uF0CD': '⊆',
      '\uF0D6': '√',
      '\uF0B1': '±',
      '\uF0B4': '×',
      '\uF0B8': '÷',
      '\uF071': 'θ',
      '\uF070': 'π',
      '\uF02D': '−',
      '': '', '': 'N', '': ''
    };

    let processedText = text;
    for (const [k, v] of Object.entries(SYMBOL_MAP)) {
      processedText = processedText.split(k).join(v);
    }

    // 2. Fix mixed Bijoy fragments embedded in Unicode text:
    const BIJOY_FRAGMENT_MAP = {
      '‡K': 'কে', '†K': 'কে',
      '‡L': 'খে', '†L': 'খে',
      '‡M': 'গে', '†M': 'গে',
      '‡N': 'ঘে', '†N': 'ঘে',
      '‡P': 'চে', '†P': 'চে',
      '‡Q': 'ছে', '†Q': 'ছে',
      '‡R': 'জে', '†R': 'জে',
      '‡S': 'ঝে', '†S': 'ঝে',
      '‡T': 'ঞে', '†T': 'ঞে',
      '‡U': 'টে', '†U': 'টে',
      '‡V': 'ঠে', '†V': 'ঠে',
      '‡W': 'ডে', '†W': 'ডে',
      '‡X': 'ঢে', '†X': 'ঢে',
      '‡Y': 'ণে', '†Y': 'ণে',
      '‡Z': 'তে', '†Z': 'তে',
      '‡_': 'থে', '†_': 'থে',
      '‡`': 'দে', '†`': 'দে',
      '‡a': 'ধে', '†a': 'ধে',
      '‡b': 'নে', '†b': 'নে',
      '‡c': 'পে', '†c': 'পে',
      '‡d': 'ফে', '†d': 'ফে',
      '‡e': 'বে', '†e': 'বে',
      '‡f': 'ভে', '†f': 'ভে',
      '‡g': 'মে', '†g': 'মে',
      '‡h': 'যে', '†h': 'যে',
      '‡i': 'রে', '†i': 'রে',
      '‡j': 'লে', '†j': 'লে',
      '‡k': 'শে', '†k': 'শে',
      '‡l': 'ষে', '†l': 'ষে',
      '‡m': 'সে', '†m': 'সে',
      '‡n': 'হে', '†n': 'হে',
      '‡q': 'য়ে', '†q': 'য়ে'
    };

    for (const [k, v] of Object.entries(BIJOY_FRAGMENT_MAP)) {
      processedText = processedText.replace(new RegExp(`([\u0980-\u09FF])${k}`, 'g'), `$1${v}`);
    }

    // 3. Fix Radical/Square root symbol used as Ro-phala (্র) after Bengali consonants:
    processedText = processedText.replace(/([\u0995-\u09B9\u09DC-\u09DF])√/g, '$1\u09CD\u09B0');

    // 4. Fix misplaced Kar signs placed before Virama:
    const VOWEL_KARS = '[\u09BE\u09BF\u09C0\u09C1\u09C2\u09C3\u09C7\u09C8\u09CB\u09CC]';
    const BENGALI_CONS = '[\u0995-\u09B9\u09CE\u09DC-\u09DF]';
    const misplacedKarRegex = new RegExp(`(${BENGALI_CONS})(${VOWEL_KARS})\u09CD(${BENGALI_CONS})`, 'g');
    for (let round = 0; round < 3; round++) {
      processedText = processedText.replace(misplacedKarRegex, '$1\u09CD$3$2');
    }

    // 5. Fix common OCR/Sutonny typo replacements:
    processedText = processedText.replace(/উত্মর([া-ৌ্]|\b|\s|$)/g, 'উত্তর$1');
    processedText = processedText.replace(/উত্মর/g, 'উত্তর');
    processedText = processedText.replace(/উদীপক/g, 'উদ্দীপক');
    processedText = processedText.replace(/তথে্য/g, 'তথ্যে');
    processedText = processedText.replace(/প√শে্নর/g, 'প্রশ্নের');
    processedText = processedText.replace(/চছজ/g, '$\\triangle PQR$');
    processedText = processedText.replace(/চজঝ/g, '$\\angle PRS$');
    processedText = processedText.replace(/PRঝ/g, '$\\angle PRS$');
    processedText = processedText.replace(/গঅউ/g, '$\\angle AOD$');
    processedText = processedText.replace(/তথ্যগুjো/g, 'তথ্যগুলো');
    processedText = processedText.replace(/প্রhোR্য/g, 'প্রযোজ্য');
    processedText = processedText.replace(/সংখ্যাগুjোর/g, 'সংখ্যাগুলোর');
    processedText = processedText.replace(/mে\.gি\./g, 'সে.মি.');
    processedText = processedText.replace(/i¤\^mের/g, 'রম্বসের');
    processedText = processedText.replace(/i¤\^m/g, 'রম্বস');
    processedText = processedText.replace(/iেখার/g, 'রেখার');
    processedText = processedText.replace(/iেখা/g, 'রেখা');

    // 5a. Profit, Loss, and Commercial Math Sutonny mappings
    processedText = processedText.replace(/স্লতিতে/g, 'ক্ষতিতে');
    processedText = processedText.replace(/স্লতি/g, 'ক্ষতি');
    processedText = processedText.replace(/ক্রয়ম্j্য/g, 'ক্রয়মূল্য');
    processedText = processedText.replace(/ক্রয়ম্j্য/g, 'ক্রয়মূল্য');
    processedText = processedText.replace(/eিক্রয়ম্jে্যর/g, 'বিক্রয়মূল্যের');
    processedText = processedText.replace(/eিক্রqম্jে্যর/g, 'বিক্রয়মূল্যের');
    processedText = processedText.replace(/বিক্রয়ম্jে্যর/g, 'বিক্রয়মূল্যের');
    processedText = processedText.replace(/বিক্রয়ম্jে্যর/g, 'বিক্রয়মূল্যের');
    processedText = processedText.replace(/eিক্রয়ম্j্য/g, 'বিক্রয়মূল্য');
    processedText = processedText.replace(/eিক্রqম্j্য/g, 'বিক্রয়মূল্য');
    processedText = processedText.replace(/eিক্রq/g, 'বিক্রয়');
    processedText = processedText.replace(/eিক্রয়/g, 'বিক্রয়');
    processedText = processedText.replace(/eিক্রয়/g, 'বিক্রয়');
    processedText = processedText.replace(/eিক্রি/g, 'বিক্রি');
    processedText = processedText.replace(/ম্jে্যর/g, 'মূল্যের');
    processedText = processedText.replace(/ম্jে্যi/g, 'মূল্যের');
    processedText = processedText.replace(/ম্jে্য/g, 'মূল্যে');
    processedText = processedText.replace(/ম্j্য/g, 'মূল্য');
    processedText = processedText.replace(/jাভে/g, 'লাভে');
    processedText = processedText.replace(/jাভ/g, 'লাভ');
    processedText = processedText.replace(/gূলধন/g, 'মূলধন');
    processedText = processedText.replace(/gুনাফা/g, 'মুনাফা');
    processedText = processedText.replace(/mাসj/g, 'আসল');
    processedText = processedText.replace(/mুদে/g, 'সুদে');
    processedText = processedText.replace(/mুদ/g, 'সুদ');
    processedText = processedText.replace(/হলেv/g, 'হলে');
    processedText = processedText.replace(/হলোv/g, 'হলো');
    processedText = processedText.replace(/ম্লমতা/g, 'ক্ষমতা');
    processedText = processedText.replace(/ম্লমা/g, 'ক্ষমা');
    processedText = processedText.replace(/ম্লুদ্রতম/g, 'ক্ষুদ্রতম');
    processedText = processedText.replace(/ম্লুদ্র/g, 'ক্ষুদ্র');
    processedText = processedText.replace(/eৃহত্তম/g, 'বৃহত্তম');

    // 5b. Geometry Angles: "P = 60, Q = 50, R = 70" -> "$\angle P = 60^\circ, \angle Q = 50^\circ, \angle R = 70^\circ$"
    processedText = processedText.replace(/\bP\s*=\s*(\d+)\s*,\s*Q\s*=\s*(\d+)\s*,\s*R\s*=\s*(\d+)/g, '$\\angle P = $1^\\circ, \\angle Q = $2^\\circ, \\angle R = $3^\\circ$');
    processedText = processedText.replace(/(?<![0-9a-zA-Z\$\\\{])\b([PQR])\s*=\s*(\d+)(?![0-9a-zA-Z\$\\\}])/g, '$\\angle $1 = $2^\\circ$');

    // 5c. Geometry Sides: "চছ = 4" -> "PQ = 4", "ছজ = 7" -> "QR = 7", "চজ = 11" -> "PR = 11"
    processedText = processedText.replace(/চছ/g, 'PQ').replace(/ছজ/g, 'QR').replace(/চজ/g, 'PR');

    // 6. Fix collapsed inequalities and set expressions:
    processedText = processedText.replace(/(\d+)\s{2,}([a-zA-Z])\s*<\s*(\d+)/g, '$1 < $2 < $3');
    processedText = processedText.replace(/(\d+)\s*<\s*([a-zA-Z])\s{2,}(\d+)/g, '$1 < $2 < $3');
    processedText = processedText.replace(/(\d+)\s{2,}([a-zA-Z])\s*([≤<=])\s*(\d+)/g, '$1 ≤ $2 $3 $4');
    processedText = processedText.replace(/(\d+)\s*([≤<=])\s*([a-zA-Z])\s{2,}(\d+)/g, '$1 $2 $3 ≤ $4');
    processedText = processedText.replace(/x\s{2,}:\s*/g, 'x : ');
    processedText = processedText.replace(/x\s+N\s*:/gi, 'x ∈ N : ');
    processedText = processedText.replace(/x\s+R\s*:/gi, 'x ∈ R : ');
    processedText = processedText.replace(/x\s+Z\s*:/gi, 'x ∈ Z : ');

    // 7. Algebraic Fractions auto-formatting:
    // (a) "4a + 1(2a + 1)a - 1" -> "\frac{4^{a+1}}{(2^{a+1})^{a-1}}"
    processedText = processedText.replace(/(\d+)\s*([a-zA-Z])\s*([\+\-])\s*(\d+)\s*\(\s*(\d+)\s*([a-zA-Z])\s*([\+\-])\s*(\d+)\s*\)\s*([a-zA-Z])\s*[-–—−]\s*(\d+)/g, (m, b1, v1, s1, e1, b2, v2, s2, e2, v3, e3) => {
      return `$\\frac{${b1}^{${v1}${s1}${e1}}}{(${b2}^{${v2}${s2}${e2}})^{${v3}-${e3}}}$`;
    });

    // (b) "2a + 1(2a)a - 1" -> "\frac{2^{a+1}}{(2^a)^{a-1}}"
    processedText = processedText.replace(/(\d+)\s*([a-zA-Z])\s*([\+\-])\s*(\d+)\s*\(\s*(\d+)\s*([a-zA-Z])\s*\)\s*([a-zA-Z])\s*[-–—−]\s*(\d+)/g, (m, b1, v1, s1, e1, b2, v2, v3, e3) => {
      return `$\\frac{${b1}^{${v1}${s1}${e1}}}{(${b2}^{${v2}})^{${v3}-${e3}}}$`;
    });

    // (c) "p2 + q2q2 + r2" -> "\frac{p^2 + q^2}{q^2 + r^2}"
    processedText = processedText.replace(/([a-zA-Z])2\s*\+\s*([a-zA-Z])2\s*([a-zA-Z])2\s*\+\s*([a-zA-Z])2/g, (m, v1, v2, v3, v4) => {
      return `$\\frac{${v1}^2 + ${v2}^2}{${v3}^2 + ${v4}^2}$`;
    });

    // (d) "(p - q)2(q - r)2" or "(p − q)2(q − r)2" -> "\frac{(p-q)^2}{(q-r)^2}"
    processedText = processedText.replace(/\(([a-zA-Z])\s*[-–—−]\s*([a-zA-Z])\)\s*(\d+)\s*\(([a-zA-Z])\s*[-–—−]\s*([a-zA-Z])\)\s*(\d+)/g, (m, v1, v2, p1, v3, v4, p2) => {
      return `$\\frac{(${v1} - ${v2})^${p1}}{(${v3} - ${v4})^${p2}}$`;
    });

    // (e) Standard numeric & rational fractions: "1/125", "25/5", "3/4"
    processedText = processedText.replace(/(?<![0-9a-zA-Z\$\\\{])(\d+)\s*\/\s*(\d+)(?![0-9a-zA-Z\$\\\}])/g, (m, num, den) => `$\\frac{${num}}{${den}}$`);

    // (f) "পদ 1125?" -> "\frac{1}{125}"
    processedText = processedText.replace(/(?<=পদ\s+)1(\d{2,3})(?=[?\s।\,]|$)/g, (m, den) => `$\\frac{1}{${den}}$`);

    // (g) Explicit parenthesized quotient: "(p - q)^2 / (q - r)^2"
    processedText = processedText.replace(/(?<!\$)\(([^\)]+)\)\s*\/\s*\(([^\)]+)\)(?!\$)/g, (m, num, den) => `$\\frac{${num}}{${den}}$`);

    // (h) "27/y3", "27/y^3", "1/x^2", "y6 + 27y3"
    processedText = processedText.replace(/(?<![0-9a-zA-Z\$\\\{])y6\s*\+\s*27y3(?![0-9a-zA-Z\$\\\}])/g, `$y^6 + \\frac{27}{y^3}$`);
    processedText = processedText.replace(/(?<![0-9a-zA-Z\$\\\{])(\d+)\s*\/\s*([a-zA-Z](?:\^[0-9a-zA-Z\-]+|\d+)?)(?![0-9a-zA-Z\$\\\}])/g, (m, num, den) => {
      let cleanDen = den.replace(/([a-zA-Z])(\d+)/, '$1^{$2}');
      return `$\\frac{${num}}{${cleanDen}}$`;
    });

    // (i) Algebraic fractions from PDF OCR: "x + 3a  x − 3a + x + 3b  x − 3b"
    processedText = processedText.replace(/(x\s*[\+\-\–\—\−]\s*[0-9a-zA-Z]+)\s{2,}(x\s*[\+\-\–\—\−]\s*[0-9a-zA-Z]+)\s*([\+\-\–\—\−\=])\s*(x\s*[\+\-\–\—\−]\s*[0-9a-zA-Z]+)\s{2,}(x\s*[\+\-\–\—\−]\s*[0-9a-zA-Z]+)/g, (m, n1, d1, op, n2, d2) => {
      return `$\\frac{${n1.trim()}}{${d1.trim()}} ${op} \\frac{${n2.trim()}}{${d2.trim()}}$`;
    });

    // (j) PDF Binomial quotient patterns: "( ) x y + y x 10" -> "(\frac{x}{y} + \frac{y}{x})^{10}"
    processedText = processedText.replace(/\(\s*\)\s*([a-zA-Z0-9]+)\s+([a-zA-Z0-9]+)\s*([\+\-\–\—\−])\s*([a-zA-Z0-9]+)\s+([a-zA-Z0-9]+)\s+([0-9a-zA-Z]+)/g, '($\\frac{$1}{$2} $3 \\frac{$4}{$5}$)^{$6}');
    processedText = processedText.replace(/\(\s*\)\s*([0-9]*[a-zA-Z0-9]+)\s*([\+\-\–\—\−])\s*([0-9]+)\s+([0-9]*[a-zA-Z]+)\s+([0-9a-zA-Z]+)/g, '($$1 $2 \\frac{$3}{$4}$$)^{$5}');
    processedText = processedText.replace(/\(\s*\)\s*([a-zA-Z0-9]+)\s*([\+\-\–\—\−])\s*([0-9a-zA-Z]+)\s+([0-9a-zA-Z]+)\s+([0-9a-zA-Z]+)/g, '($$1 $2 \\frac{$3}{$4}$$)^{$5}');
    processedText = processedText.replace(/\b([0-9]+)\s*([\+\-\–\—\−])\s*([a-zA-Z]+)\s+([0-9]+)\s+([0-9]+)\s+([0-9]+)\b/g, '($$1 $2 \\frac{$3^{$4}}{$5}$$)^{$6}');
    processedText = processedText.replace(/\b([0-9]+)\s*([\+\-\–\—\−])\s*([0-9]+)\s+([a-zA-Z]+)\s+([0-9]+)\s+([0-9]+)\b/g, '($$1 $2 \\frac{$3}{$4^{$5}}$$)^{$6}');

    // (k) Binomial combinations: n C r -> ^nC_r, 8 C 5 -> ^8C_5, n C 5 = n C 7
    processedText = processedText.replace(/\b([a-zA-Z0-9]+)\s+[cC]\s+([a-zA-Z0-9\+\-]+)\b/g, '$^$1C_{$2}$');

    // (l) Parenthesized power expressions: "(1 + y) 5" -> "$(1 + y)^5$", "(1.995) 7" -> "$(1.995)^7$"
    processedText = processedText.replace(/(?<!\$)\(([^()\n]+)\)\s+([0-9a-zA-Z]+)(?=\s|$|[\,\.\;\:\-\?।])(?!\$)/g, '$($1)^{$2}$');

    // 8. Advanced Algebraic Exponents & Equations:
    // (a) "x4 + x- 4 = 119" -> "x^4 + x^{-4} = 119"
    processedText = processedText.replace(/(?<![0-9a-zA-Z\$\\\{])([a-zA-Z])(\d+)\s*\+\s*([a-zA-Z])\s*[-–—−]\s*(\d+)\s*=\s*(\d+)(?![0-9a-zA-Z\$\\\}])/g, (m, v1, p1, v2, p2, val) => {
      return `$${v1}^${p1} + ${v2}^{-${p2}} = ${val}$`;
    });

    // (b) "y = 5 - 2" -> "y = \sqrt{5} - 2"
    processedText = processedText.replace(/(?<![0-9a-zA-Z\$\\\{])y\s*=\s*(?:√|\\sqrt\{5\}|5)\s*[-–—−]\s*2(?![0-9a-zA-Z\$\\\}])/g, `$y = \\sqrt{5} - 2$`);

    // (c) "(3c- 1 + 2d- 1)- 1" -> "(3c^{-1} + 2d^{-1})^{-1}"
    processedText = processedText.replace(/\(\s*(\d+)([a-zA-Z])\s*[-–—−]\s*1\s*\+\s*(\d+)([a-zA-Z])\s*[-–—−]\s*1\s*\)\s*[-–—−]\s*1/g, (m, c1, v1, c2, v2) => {
      return `$(${c1}${v1}^{-1} + ${c2}${v2}^{-1})^{-1}$`;
    });

    // (d) "x2 - 3x - 1 = 0"
    processedText = processedText.replace(/(?<![0-9a-zA-Z\$\\\{])([a-zA-Z])2\s*[-–—−]\s*(\d+[a-zA-Z])\s*[-–—−]\s*(\d+)\s*=\s*(\d+)(?![0-9a-zA-Z\$\\\}])/g, (m, v, t, c, val) => {
      return `$${v}^2 - ${t} - ${c} = ${val}$`;
    });

    // (e) Standard variable exponents: "x4", "x2", "y6", "p2", "q2", "r2", "10 y = 1"
    processedText = processedText.replace(/(?<![a-zA-Z0-9\$\\\{])(10|[a-zA-Z])\s+([0-9a-zA-Z])(?=\s*[\:\=\+\-\*\/]|\s+[\:\=\+\-\*\/]|\s*$|\s+[\,\.\;\?।])(?![a-zA-Z0-9\$\\\}])/g, (m, v, exp) => `$${v}^{${exp}}$`);
    processedText = processedText.replace(/(?<![a-zA-Z0-9\$\\\{])([a-zA-Z])(\d+)(?![a-zA-Z0-9\$\\\}])/g, (m, v, exp) => `$${v}^{${exp}}$`);
    processedText = processedText.replace(/(?<![a-zA-Z0-9\$\\\{])([a-zA-Z])\s*[-–—−]\s*(\d+)(?![a-zA-Z0-9\$\\\}])/g, (m, v, exp) => `$${v}^{-${exp}}$`);

    // 9. Logarithm: e.g. "log3 9" -> "\log_3 9"
    processedText = processedText.replace(/(?<!\$)\blog\s*(\d+)\s*(\d+)\b(?!\$)/g, (m, base, val) => `$\\log_{${base}} ${val}$`);

    // 10. Auto-delimit standalone math expressions if no $ are present
    if (!/\$\$[\s\S]+?\$\$|\$[^\$]+?\$|\\\[[\s\S]+?\\\]|\\\([\s\S]+?\\\)/.test(processedText)) {
      // Auto-wrap set equations: Q = { ... }, S = { ... }
      processedText = processedText.replace(/(?<!\$)\b([A-Z])\s*=\s*\{([^\}]+)\}(?!\$)/g, (m, name, setContent) => {
        const latexSet = setContent
          .replace(/∈/g, '\\in ')
          .replace(/∉/g, '\\notin ')
          .replace(/≤/g, '\\le ')
          .replace(/≥/g, '\\ge ')
          .replace(/≠/g, '\\neq ')
          .replace(/\bN\b/g, '\\mathbb{N}')
          .replace(/\bR\b/g, '\\mathbb{R}')
          .replace(/\bZ\b/g, '\\mathbb{Z}')
          .replace(/\s{2,}/g, ' ')
          .trim();
        return `$${name} = \\{${latexSet}\\}$`;
      });

      // Auto-wrap power sets / function calls: P(Q), f(x), g(x), f(y), P(A)
      processedText = processedText.replace(/(?<!\$)\b([Pfgnh])\(([A-Za-z0-9\s\,\+\-\*\/\^\_]+)\)(?!\$)/g, (m, fn, arg) => {
        return `$${fn}(${arg.trim()})$`;
      });

      // Auto-wrap single sets: { (4, 1), (4, 3) }
      processedText = processedText.replace(/(?<!\$)\{([^\}]+)\}(?!\$)/g, (m, setContent) => {
        const latexSet = setContent
          .replace(/∈/g, '\\in ')
          .replace(/∉/g, '\\notin ')
          .replace(/≤/g, '\\le ')
          .replace(/≥/g, '\\ge ')
          .replace(/\bN\b/g, '\\mathbb{N}')
          .replace(/\s{2,}/g, ' ')
          .trim();
        return `$\\{${latexSet}\\}$`;
      });

      // Auto-wrap physics units: 2.5 m s-2 or 63 km h-1
      processedText = processedText.replace(/(?<!\$)\b(\d+(?:\.\d+)?)\s*(?:m\s*s\s*[-–—−]?\s*2|ms\s*[-–—−]?\s*2)\b(?!\$)/g, (m, val) => `$${val}\\text{ m s}^{-2}$`);
      processedText = processedText.replace(/(?<!\$)\b(\d+(?:\.\d+)?)\s*(?:km\s*h\s*[-–—−]?\s*1|kmh\s*[-–—−]?\s*1)\b(?!\$)/g, (m, val) => `$${val}\\text{ km h}^{-1}$`);
    }

    // Check if text contains LaTeX math delimiters ($...$, $$...$$, \(...\), \[...\])
    const hasLatexDelimiters = /\$\$[\s\S]+?\$\$|\$[^\$]+?\$|\\\[[\s\S]+?\\\]|\\\([\s\S]+?\\\)/.test(processedText);

    if (hasLatexDelimiters) {
      // Split text by LaTeX delimiters and render math parts with KaTeX
      const parts = [];
      const regex = /(\$\$[\s\S]+?\$\$|\$[^\$]+?\$|\\\[[\s\S]+?\\\]|\\\([\s\S]+?\\\))/g;
      let lastIndex = 0;
      let match;

      while ((match = regex.exec(processedText)) !== null) {
        // Push text before math
        if (match.index > lastIndex) {
          parts.push({
            type: 'text',
            content: processedText.slice(lastIndex, match.index)
          });
        }

        const rawMath = match[0];
        let mathStr = rawMath;
        let isDisplay = false;

        if (rawMath.startsWith('$$') && rawMath.endsWith('$$')) {
          mathStr = rawMath.slice(2, -2).trim();
          isDisplay = true;
        } else if (rawMath.startsWith('$') && rawMath.endsWith('$')) {
          mathStr = rawMath.slice(1, -1).trim();
        } else if (rawMath.startsWith('\\[') && rawMath.endsWith('\\]')) {
          mathStr = rawMath.slice(2, -2).trim();
          isDisplay = true;
        } else if (rawMath.startsWith('\\(') && rawMath.endsWith('\\)')) {
          mathStr = rawMath.slice(2, -2).trim();
        }

        try {
          const html = katex.renderToString(mathStr, {
            throwOnError: false,
            displayMode: isDisplay,
            strict: false
          });
          parts.push({
            type: 'math',
            html
          });
        } catch (e) {
          parts.push({
            type: 'text',
            content: rawMath
          });
        }

        lastIndex = regex.lastIndex;
      }

      if (lastIndex < processedText.length) {
        parts.push({
          type: 'text',
          content: processedText.slice(lastIndex)
        });
      }

      return parts;
    }

    return [{ type: 'text', content: processedText }];
  }, [text, inline]);

  if (typeof renderedContent === 'string') {
    return <span ref={containerRef} className={`math-equation-text ${className}`}>{renderedContent}</span>;
  }

  return (
    <span ref={containerRef} className={`math-equation-container inline-block ${className}`}>
      {renderedContent.map((part, idx) => {
        if (part.type === 'math') {
          return (
            <span
              key={idx}
              className="katex-rendered-block mx-0.5 align-middle"
              dangerouslySetInnerHTML={{ __html: part.html }}
            />
          );
        }
        return <span key={idx}>{part.content}</span>;
      })}
    </span>
  );
}
