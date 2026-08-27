import React, { useMemo } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

/**
 * Universal Math & Equation Renderer Component
 * Renders LaTeX formulas ($...$, $$...$$, \(...\), \[...\]) with KaTeX
 * Formats math symbols, Greek letters, sub/superscripts, and chemical formulas seamlessly
 */
export default function MathRenderer({ text = '', inline = true, className = '' }) {
  const renderedContent = useMemo(() => {
    if (!text || typeof text !== 'string') return text || '';

    // Check if text contains LaTeX math delimiters ($...$, $$...$$, \(...\), \[...\])
    const hasLatexDelimiters = /\$\$[\s\S]+?\$\$|\$[^\$]+?\$|\\\[[\s\S]+?\\\]|\\\([\s\S]+?\\\)/.test(text);

    if (hasLatexDelimiters) {
      // Split text by LaTeX delimiters and render math parts with KaTeX
      const parts = [];
      const regex = /(\$\$[\s\S]+?\$\$|\$[^\$]+?\$|\\\[[\s\S]+?\\\]|\\\([\s\S]+?\\\))/g;
      let lastIndex = 0;
      let match;

      while ((match = regex.exec(text)) !== null) {
        // Push text before math
        if (match.index > lastIndex) {
          parts.push({
            type: 'text',
            content: text.slice(lastIndex, match.index)
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

      if (lastIndex < text.length) {
        parts.push({
          type: 'text',
          content: text.slice(lastIndex)
        });
      }

      return parts;
    }

    return [{ type: 'text', content: text }];
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
