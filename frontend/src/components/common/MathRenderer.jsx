import React, { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// KaTeX এর CSS ইম্পোর্ট
import 'katex/dist/katex.min.css'; 

/**
 * Normalizes LaTeX expressions (\(...\), \[...\], or un-delimited LaTeX)
 * so KaTeX and remark-math render them cleanly.
 */
export function normalizeMathText(rawText) {
  if (!rawText || typeof rawText !== 'string') return '';

  let text = rawText;

  // 1. Convert \[ ... \] to $$ ... $$ (display math)
  text = text.replace(/\\\[([\s\S]*?)\\\]/g, (m, p1) => `$$${p1}$$`);

  // 2. Convert \( ... \) to $ ... $ (inline math)
  text = text.replace(/\\\(([\s\S]*?)\\\)/g, (m, p1) => `$${p1}$`);

  // 3. Convert parenthesized LaTeX expressions like (2.96\text{ cm}) to $...$
  text = text.replace(/\(([^()\n]*?\\text\{[^()]*?\}[^()\n]*?)\)/g, (m, p1) => `$${p1}$`);

  // 4. Standalone formulas with LaTeX commands
  if (!text.includes('$') && (/\\(frac|sqrt|times|implies|Delta|pi|pm|le|ge|in|cup|cap|setminus|therefore|approx|alpha|beta|theta|cdot)/.test(text))) {
    text = `$${text}$`;
  }

  // 5. Clean isolated \text{...} outside math delimiters
  const parts = text.split(/(\$\$[\s\S]*?\$\$|\$[^$\n]*?\$)/g);
  const processedParts = parts.map((part) => {
    if (part.startsWith('$')) {
      return part;
    }
    return part.replace(/\\text\{([^{}]+)\}/g, '$1');
  });

  return processedParts.join('');
}

export default function MathRenderer({ text, className = '' }) {
  if (!text) return null;

  const formattedText = useMemo(() => normalizeMathText(text), [text]);

  return (
    <div className={`math-renderer-content inline-block ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[[rehypeKatex, { strict: false, output: 'htmlAndMathml' }]]}
      >
        {formattedText}
      </ReactMarkdown>
    </div>
  );
}
