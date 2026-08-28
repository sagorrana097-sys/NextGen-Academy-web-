import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// KaTeX এর CSS ইম্পোর্ট করা হলো যাতে ফন্ট ভেঙে না যায়
import 'katex/dist/katex.min.css'; 

export default function MathRenderer({ text }) {
  // যদি কোনো কারণে টেক্সট না থাকে বা খালি হয়
  if (!text) return null;

  return (
    <div className="math-renderer-content inline-block">
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        // strict: false এবং একক $ সাইন সাপোর্ট নিশ্চিত করার জন্য কনফিগারেশন
        rehypePlugins={[[rehypeKatex, { strict: false, output: 'htmlAndMathml' }]]}
      >
        {text}
      </ReactMarkdown>
    </div>
  );
}
