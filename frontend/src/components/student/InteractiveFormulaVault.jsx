import React, { useState, useRef } from 'react';
import {
  Download,
  Search,
  BookOpen,
  Sparkles,
  Calculator,
  Compass,
  Check,
  Share2,
  Filter,
  Eye,
  Award,
  Layers
} from 'lucide-react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

const BRAND = {
  name: 'NextGen Academy',
  instructor: 'মো: আলমগীর হোসেন (সাগর)',
  contact: '০১৭৯২৮১৮০০৫',
  address: 'পশ্চিম জয়দেবপুর, বাস-স্ট্যান্ড, গাজীপুর'
};

const FORMULA_DATABASE = [
  // 1. Physics Kinematics
  {
    id: 'phy-kin-1',
    subject: 'PHYSICS',
    subjectBn: 'পদার্থবিজ্ঞান',
    topic: 'গতিবিদ্যা (Kinematics)',
    titleBn: 'গতির মৌলিক সমীকরণসমূহ',
    latex: 'v = u + at \\qquad s = ut + \\frac{1}{2}at^2 \\qquad v^2 = u^2 + 2as',
    explanation: 'সমত্বরণে চলমান বস্তুর ক্ষেত্রে শেষ বেগ (v), আদি বেগ (u), ত্বরণ (a), সময় (t) ও অতিক্রান্ত দূরত্বের (s) সম্পর্ক।',
    variables: [
      { sym: 'u', name: 'আদিবেগ (m/s)' },
      { sym: 'v', name: 'শেষ বেগ (m/s)' },
      { sym: 'a', name: 'ত্বরণ (m/s²)' },
      { sym: 't', name: 'সময় (s)' },
      { sym: 's', name: 'দূরত্ব (m)' }
    ],
    accent: '#38bdf8'
  },
  // 2. Physics Work, Power & Energy
  {
    id: 'phy-wpe-1',
    subject: 'PHYSICS',
    subjectBn: 'পদার্থবিজ্ঞান',
    topic: 'কাজ, ক্ষমতা ও শক্তি (Work, Power & Energy)',
    titleBn: 'গতিশক্তি ও বিভব শক্তি সমীকরণ',
    latex: 'E_k = \\frac{1}{2}mv^2 \\qquad E_p = mgh \\qquad W = Fs \\cos\\theta',
    explanation: 'গতিশীল বস্তুর কাজ করার সামর্থ্য হলো গতিশক্তি ($E_k$) এবং অবস্থানের পরিবর্তনের জন্য সঞ্চিত শক্তি হলো বিভব শক্তি ($E_p$)।',
    variables: [
      { sym: 'm', name: 'ভর (kg)' },
      { sym: 'v', name: 'বেগ (m/s)' },
      { sym: 'g', name: 'অভিকর্ষজ ত্বরণ (৯.৮ m/s²)' },
      { sym: 'h', name: 'উচ্চতা (m)' }
    ],
    accent: '#fbbf24'
  },
  // 3. Physics Gravitation
  {
    id: 'phy-grav-1',
    subject: 'PHYSICS',
    subjectBn: 'পদার্থবিজ্ঞান',
    topic: 'মহাকর্ষ ও অভিকর্ষ (Gravitation)',
    titleBn: 'নিউটনের মহাকর্ষ সূত্র ও অভিকর্ষজ ত্বরণ',
    latex: 'F = G \\frac{m_1 m_2}{d^2} \\qquad g = \\frac{GM}{R^2}',
    explanation: 'মহাবিশ্বের যেকোনো দুটি বস্তুকণা তাদের ভরের গুণফলের সমানুপাতিক এবং দূরত্বের বর্গের ব্যস্তানুপাতিক বলে একে অপরকে আকর্ষণ করে।',
    variables: [
      { sym: 'G', name: 'মহাকর্ষীয় ধ্রুবক (৬.৬৭৩ × ১০⁻¹¹ N m²/kg²)' },
      { sym: 'M', name: 'পৃথিবীর ভর' },
      { sym: 'R', name: 'পৃথিবীর ব্যাসার্ধ' }
    ],
    accent: '#a855f7'
  },
  // 4. Physics Current Electricity
  {
    id: 'phy-elec-1',
    subject: 'PHYSICS',
    subjectBn: 'পদার্থবিজ্ঞান',
    topic: 'চলতড়িৎ (Current Electricity)',
    titleBn: 'ওহমের সূত্র ও তড়িৎ ক্ষমতা',
    latex: 'V = IR \\qquad P = VI = I^2 R = \\frac{V^2}{R}',
    explanation: 'স্থির তাপমাত্রায় কোনো পরিবাহীর মধ্য দিয়ে প্রবাহিত তড়িৎ প্রবাহমাত্রা পরিবাহীর দুই প্রান্তের বিভব পার্থক্যের সমানুপাতিক।',
    variables: [
      { sym: 'V', name: 'বিভব পার্থক্য (Volt)' },
      { sym: 'I', name: 'তড়িৎ প্রবাহ (Ampere)' },
      { sym: 'R', name: 'রোধ (Ohm, Ω)' },
      { sym: 'P', name: 'তড়িৎ ক্ষমতা (Watt)' }
    ],
    accent: '#34d399'
  },

  // 5. Higher Math Quadratic Equation
  {
    id: 'math-quad-1',
    subject: 'MATH',
    subjectBn: 'উচ্চতর গণিত',
    topic: 'বীজগণিত (Algebra)',
    titleBn: 'দ্বিঘাত সমীকরণের সাধারণ সমাধান ও নিশ্চয়ক',
    latex: 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a} \\qquad D = b^2 - 4ac',
    explanation: 'ax² + bx + c = 0 দ্বিঘাত সমীকরণের মূলদ্বয় নির্ণয়ের শ্রীধর আচার্যের সূত্র। নিশ্চয়ক D > 0 হলে মূলদ্বয় বাস্তব ও অসমান।',
    variables: [
      { sym: 'a, b, c', name: 'সমীকরণের সহগ' },
      { sym: 'D', name: 'নিশ্চায়ক (Discriminant)' }
    ],
    accent: '#f43f5e'
  },
  // 6. Math Trigonometry
  {
    id: 'math-trig-1',
    subject: 'MATH',
    subjectBn: 'উচ্চতর গণিত',
    topic: 'ত্রিকোণমিতি (Trigonometry)',
    titleBn: 'মৌলিক পিথাগোরাসীয় ত্রিকোণমিতিক অভেদাবলি',
    latex: '\\sin^2\\theta + \\cos^2\\theta = 1 \\qquad 1 + \\tan^2\\theta = \\sec^2\\theta \\qquad 1 + \\cot^2\\theta = \\csc^2\\theta',
    explanation: 'ত্রিকোণমিতিক অনুপাতসমূহের সার্বজনীন অভেদাবলি যা কোণ θ-এর সকল মানের জন্য সত্য।',
    variables: [
      { sym: 'θ', name: 'সূক্ষ্মকোণ (ডিগ্রি বা রেডিয়ান)' }
    ],
    accent: '#ec4899'
  },
  // 7. Math Coordinate Geometry
  {
    id: 'math-geom-1',
    subject: 'MATH',
    subjectBn: 'উচ্চতর গণিত',
    topic: 'স্থানাঙ্ক জ্যামিতি (Coordinate Geometry)',
    titleBn: 'দুটি বিন্দুর দূরত্ব ও ঢাল নির্ণয়',
    latex: 'd = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2} \\qquad m = \\frac{y_2 - y_1}{x_2 - x_1}',
    explanation: 'দ্বিমাত্রিক কার্তেসীয় তলে (x₁, y₁) ও (x₂, y₂) বিন্দুদ্বয়ের মধ্যবর্তী রৈখিক দূরত্ব ও সরলরেখার ঢাল (m)।',
    variables: [
      { sym: 'd', name: 'দূরত্ব' },
      { sym: 'm', name: 'রেখার ঢাল (Slope)' }
    ],
    accent: '#8b5cf6'
  },
  // 8. Math Calculus & Vectors
  {
    id: 'math-vec-1',
    subject: 'MATH',
    subjectBn: 'উচ্চতর গণিত',
    topic: 'ভেক্টর (Vectors)',
    titleBn: 'ভেক্টর ডট গুণন ও ক্রস গুণন',
    latex: '\\vec{A} \\cdot \\vec{B} = |A||B| \\cos\\theta \\qquad |\\vec{A} \\times \\vec{B}| = |A||B| \\sin\\theta',
    explanation: 'স্কেলার (ডট) গুণনের ফলাফল স্কেলার রাশি এবং ভেক্টর (ক্রস) গুণনের ফলাফল উভয় ভেক্টরের উপর লম্ব একটি নতুন ভেক্টর রাশি।',
    variables: [
      { sym: 'θ', name: 'ভেক্টরদ্বয়ের মধ্যবর্তী কোণ' }
    ],
    accent: '#06b6d4'
  }
];

function RenderMath({ math }) {
  try {
    const html = katex.renderToString(math, {
      throwOnError: false,
      displayMode: true
    });
    return <div dangerouslySetInnerHTML={{ __html: html }} className="py-2 overflow-x-auto text-center" />;
  } catch (e) {
    return <div className="text-amber-400 font-mono text-center">{math}</div>;
  }
}

export default function InteractiveFormulaVault() {
  const [selectedSubject, setSelectedSubject] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [downloadingId, setDownloadingId] = useState(null);

  const cardRefs = useRef({});

  const filteredFormulas = FORMULA_DATABASE.filter((item) => {
    const matchesSubject = selectedSubject === 'ALL' || item.subject === selectedSubject;
    const matchesSearch =
      searchQuery.trim() === '' ||
      item.titleBn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.explanation.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSubject && matchesSearch;
  });

  const handleDownloadCard = async (formula) => {
    const el = cardRefs.current[formula.id];
    if (!el) return;

    setDownloadingId(formula.id);
    try {
      // Dynamic import html2canvas
      const html2canvasModule = await import('html2canvas');
      const html2canvas = html2canvasModule.default || html2canvasModule;

      const canvas = await html2canvas(el, {
        scale: 2.5,
        useCORS: true,
        backgroundColor: '#090d16',
        logging: false
      });

      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `NextGen_Formula_${formula.id}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Error downloading formula card:', err);
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="space-y-6 text-slate-100">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-black uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            NextGen Academic Vault
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight">
            ইন্টারেক্টিভ ফর্মুলা ভল্ট ও ব্র্যান্ডেড গ্রাফিক্স
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            পদার্থবিজ্ঞান ও গণিতের সকল গুরুত্বপূর্ণ সূত্র সুন্দর ম্যাথমেটিক্যাল ফরম্যাটে পড়ুন এবং এক ক্লিকে হাই-রেজুলেশন ইমেজ হিসেবে ডাউনলোড করুন।
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 self-start md:self-auto">
          <button
            onClick={() => setSelectedSubject('ALL')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
              selectedSubject === 'ALL'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            সকল সূত্র ({FORMULA_DATABASE.length})
          </button>
          <button
            onClick={() => setSelectedSubject('PHYSICS')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
              selectedSubject === 'PHYSICS'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            পদার্থবিজ্ঞান
          </button>
          <button
            onClick={() => setSelectedSubject('MATH')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
              selectedSubject === 'MATH'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            উচ্চতর গণিত
          </button>
        </div>
      </div>

      {/* Search Filter Bar */}
      <div className="flex items-center justify-between bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="সূত্র, অধ্যায় বা টপিক দিয়ে খুঁজুন..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
        <span className="text-xs text-slate-400 font-bold hidden sm:block">
          প্রদর্শিত হচ্ছে: {filteredFormulas.length}টি ফর্মুলা
        </span>
      </div>

      {/* Formula Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredFormulas.map((item) => (
          <div
            key={item.id}
            ref={(el) => (cardRefs.current[item.id] = el)}
            className="bg-slate-900/90 rounded-3xl border border-slate-800 overflow-hidden shadow-xl flex flex-col justify-between relative group hover:border-amber-500/40 transition-all duration-300"
          >
            {/* Card Header */}
            <div className="p-5 pb-3 border-b border-slate-800 flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border"
                    style={{
                      backgroundColor: `${item.accent}15`,
                      color: item.accent,
                      borderColor: `${item.accent}30`
                    }}
                  >
                    {item.subjectBn}
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">• {item.topic}</span>
                </div>
                <h3 className="text-base font-extrabold text-white mt-1.5">{item.titleBn}</h3>
              </div>

              <button
                onClick={() => handleDownloadCard(item)}
                disabled={downloadingId === item.id}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-200 text-xs font-bold transition-all border border-slate-700 hover:border-amber-400 shadow-md"
                title="ব্র্যান্ডেড ইমেজ ডাউনলোড করুন"
              >
                <Download className="w-3.5 h-3.5" />
                {downloadingId === item.id ? 'তৈরি হচ্ছে...' : 'ডাউনলোড'}
              </button>
            </div>

            {/* Latex Math Formula Body (Rendered with KaTeX) */}
            <div className="p-6 bg-slate-950/70 text-amber-300 flex items-center justify-center min-h-[110px] border-b border-slate-800/80">
              <RenderMath math={item.latex} />
            </div>

            {/* Explanation & Variables */}
            <div className="p-5 space-y-3 flex-1 text-xs">
              <p className="text-slate-300 leading-relaxed">{item.explanation}</p>

              {item.variables && (
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1 text-[11px]">
                  <p className="font-bold text-amber-400 mb-1">চলকসমূহের পরিচয়:</p>
                  <div className="grid grid-cols-2 gap-1 text-slate-400 font-mono">
                    {item.variables.map((v, i) => (
                      <div key={i}>
                        <strong className="text-slate-200">{v.sym}:</strong> {v.name}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* MANDATORY BRANDING FOOTER OVERLAY */}
            <div className="p-3 bg-gradient-to-r from-amber-500/10 via-slate-950 to-amber-500/10 border-t border-amber-500/30 text-[10px] text-slate-300">
              <div className="flex items-center justify-between font-bold">
                <span className="text-amber-400 flex items-center gap-1 font-black">
                  🎓 {BRAND.name}
                </span>
                <span className="text-emerald-400 font-bold">
                  📞 {BRAND.contact}
                </span>
              </div>
              <div className="flex items-center justify-between text-[9px] text-slate-400 mt-0.5">
                <span>শিক্ষক: {BRAND.instructor}</span>
                <span className="text-right text-slate-500">{BRAND.address}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
