import React, { useMemo } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

/**
 * Universal Math & Equation Renderer Component
 * Renders LaTeX formulas ($...$, $$...$$, \(...\), \[...\]) with KaTeX
 * Automatically detects and formats Sets (e.g. Q = {x : 0 < x < 6}), Power Sets P(Q),
 * Relations, Inequalities (0 < x < 6), and Scientific units (2.5 m s-2)
 */
export default function MathRenderer({ text = '', inline = true, className = '' }) {
  const renderedContent = useMemo(() => {
    if (!text || typeof text !== 'string') return text || '';

    // 1. Symbol font PUA characters conversion
    const SYMBOL_MAP = {
      '\uF0CE': '∈', '\u00CE': '∈',
      '\uF0CF': '∉', '\u00CF': '∉',
      '\uF0A3': '≤', '\u00A3': '≤',
      '\uF0B3': '≥', '\u00B3': '≥',
      '\uF0B9': '≠', '\u00B9': '≠',
      '\uF0C6': '∅', '\u00C6': '∅',
      '\uF0C8': '∪', '\u00C8': '∪',
      '\uF0C7': '∩', '\u00C7': '∩',
      '\uF0CC': '⊂', '\u00CC': '⊂',
      '\uF0CD': '⊆', '\u00CD': '⊆',
      '\uF0D6': '√', '\u00D6': '√',
      '\uF0B1': '±', '\u00B1': '±',
      '\uF0B4': '×', '\u00B4': '×',
      '\uF0B8': '÷', '\u00B8': '÷',
      '\uF071': 'θ',
      '\uF070': 'π',
      '\uF02D': '−'
    };

    let processedText = text;
    for (const [k, v] of Object.entries(SYMBOL_MAP)) {
      processedText = processedText.split(k).join(v);
    }

    // 2. Fix collapsed inequalities and set expressions:
    processedText = processedText.replace(/(\d+)\s{2,}([a-zA-Z])\s*<\s*(\d+)/g, '$1 < $2 < $3');
    processedText = processedText.replace(/(\d+)\s*<\s*([a-zA-Z])\s{2,}(\d+)/g, '$1 < $2 < $3');
    processedText = processedText.replace(/(\d+)\s{2,}([a-zA-Z])\s*([≤<=])\s*(\d+)/g, '$1 ≤ $2 $3 $4');
    processedText = processedText.replace(/(\d+)\s*([≤<=])\s*([a-zA-Z])\s{2,}(\d+)/g, '$1 $2 $3 ≤ $4');
    processedText = processedText.replace(/x\s{2,}:\s*/g, 'x : ');
    processedText = processedText.replace(/x\s+N\s*:/gi, 'x ∈ N : ');
    processedText = processedText.replace(/x\s+R\s*:/gi, 'x ∈ R : ');
    processedText = processedText.replace(/x\s+Z\s*:/gi, 'x ∈ Z : ');

    // 3. Auto-delimit standalone math expressions if no $ are present
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
      processedText = processedText.replace(/(?<!\$)\b(\d+(?:\.\d+)?)\s*(?:m\s*s\s*[-–—−]?\s*2|ms\s*[-–—−]?\s*2)\b(?!\$)/g, '$$$1\\text{ m s}^{-2}$');
      processedText = processedText.replace(/(?<!\$)\b(\d+(?:\.\d+)?)\s*(?:km\s*h\s*[-–—−]?\s*1|kmh\s*[-–—−]?\s*1)\b(?!\$)/g, '$$$1\\text{ km h}^{-1}$');
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
    return <span className={`math-equation-text ${className}`}>{renderedContent}</span>;
  }

  return (
    <span className={`math-equation-container inline-block ${className}`}>
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
