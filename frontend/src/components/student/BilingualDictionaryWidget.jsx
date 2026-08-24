import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  BookA,
  Languages,
  Search,
  Volume2,
  X,
  Sparkles,
  Bookmark,
  BookmarkCheck,
  ChevronRight,
  Atom,
  FlaskConical,
  Dna,
  Calculator,
  Layers,
  Copy,
  Check,
  ExternalLink,
  Info
} from 'lucide-react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { GENERAL_DICTIONARY, SCIENCE_GLOSSARY } from '../../data/bilingualDictionaryData';

function RenderLatex({ math }) {
  try {
    const html = katex.renderToString(math, { throwOnError: false });
    return <span dangerouslySetInnerHTML={{ __html: html }} className="inline-block px-1 text-emerald-300 font-mono" />;
  } catch (e) {
    return <span className="font-mono text-emerald-400">{math}</span>;
  }
}

export default function BilingualDictionaryWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('ALL'); // 'ALL' | 'PHYSICS' | 'CHEMISTRY' | 'BIOLOGY' | 'MATH'
  const [searchQuery, setSearchQuery] = useState('');
  const [speakingWord, setSpeakingWord] = useState(null);
  const [copiedWord, setCopiedWord] = useState(null);
  const [savedWords, setSavedWords] = useState(() => {
    try {
      const raw = localStorage.getItem('nga_saved_dictionary_words');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  // Magic Tool Tooltip State
  const [magicTooltip, setMagicTooltip] = useState(null); // { word, data, x, y }
  const searchInputRef = useRef(null);

  // Flatten Science Glossary
  const allScienceTerms = useMemo(() => {
    return [
      ...SCIENCE_GLOSSARY.PHYSICS.map(item => ({ ...item, category: 'PHYSICS', type: 'SCIENCE' })),
      ...SCIENCE_GLOSSARY.CHEMISTRY.map(item => ({ ...item, category: 'CHEMISTRY', type: 'SCIENCE' })),
      ...SCIENCE_GLOSSARY.BIOLOGY.map(item => ({ ...item, category: 'BIOLOGY', type: 'SCIENCE' })),
      ...SCIENCE_GLOSSARY.MATHEMATICS.map(item => ({ ...item, category: 'MATH', type: 'SCIENCE' })),
    ];
  }, []);

  // Save/Unsave word handler
  const toggleSaveWord = (wordItem) => {
    const key = wordItem.word || wordItem.term;
    setSavedWords(prev => {
      const exists = prev.some(w => (w.word || w.term) === key);
      let updated;
      if (exists) {
        updated = prev.filter(w => (w.word || w.term) !== key);
      } else {
        updated = [...prev, wordItem];
      }
      try {
        localStorage.setItem('nga_saved_dictionary_words', JSON.stringify(updated));
      } catch (_) {}
      return updated;
    });
  };

  // Text-To-Speech Pronunciation helper
  const handleSpeak = (text) => {
    if (!text || typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.85;
    utterance.onstart = () => setSpeakingWord(text);
    utterance.onend = () => setSpeakingWord(null);
    utterance.onerror = () => setSpeakingWord(null);
    window.speechSynthesis.speak(utterance);
  };

  // Copy Definition Helper
  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedWord(key);
    setTimeout(() => setCopiedWord(null), 2000);
  };

  // Quick lookup helper for word or text
  const lookupWord = (query) => {
    if (!query) return null;
    const clean = query.trim().toLowerCase();
    
    // 1. Look in General Dictionary
    const foundGeneral = GENERAL_DICTIONARY.find(d => 
      d.word.toLowerCase() === clean || 
      d.word.toLowerCase().startsWith(clean) ||
      d.meaningBn.includes(clean)
    );
    if (foundGeneral) return { type: 'GENERAL', ...foundGeneral };

    // 2. Look in Science Glossary
    const foundScience = allScienceTerms.find(s => 
      s.term.toLowerCase() === clean || 
      s.termBn.toLowerCase().includes(clean) ||
      s.term.toLowerCase().startsWith(clean)
    );
    if (foundScience) return { type: 'SCIENCE', ...foundScience };

    return null;
  };

  // =========================================================================
  // 3. MAGIC "SELECT TO SEARCH" TOOL EFFECT
  // =========================================================================
  useEffect(() => {
    const handleMouseUp = (e) => {
      // Don't trigger if clicked inside the widget itself
      if (e.target.closest('#nextgen-dictionary-widget-container')) return;

      const selection = window.getSelection();
      if (!selection || selection.isCollapsed) {
        setMagicTooltip(null);
        return;
      }

      const selectedText = selection.toString().trim();
      // Only process selections of 1-3 words (length <= 35)
      if (!selectedText || selectedText.length > 35 || selectedText.split(/\s+/).length > 3) {
        setMagicTooltip(null);
        return;
      }

      const matched = lookupWord(selectedText);
      if (matched) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();

        setMagicTooltip({
          word: selectedText,
          data: matched,
          x: Math.max(10, Math.min(window.innerWidth - 300, rect.left + rect.width / 2 - 140)),
          y: Math.max(10, rect.top - 85 + window.scrollY)
        });
      } else {
        setMagicTooltip(null);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setMagicTooltip(null);
        setIsOpen(false);
      }
    };

    const handleToggleEvent = () => {
      setIsOpen((prev) => !prev);
    };

    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('toggle-nextgen-dictionary', handleToggleEvent);
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('toggle-nextgen-dictionary', handleToggleEvent);
    };

  }, [allScienceTerms]);

  // Filtered List for Dictionary Drawer
  const filteredList = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    if (activeTab === 'SAVED') {
      return savedWords.filter(item => {
        const title = item.word || item.term || '';
        const meaning = item.meaningBn || item.definitionBn || '';
        return !q || title.toLowerCase().includes(q) || meaning.toLowerCase().includes(q);
      });
    }

    if (activeTab === 'ALL') {
      const genMatches = GENERAL_DICTIONARY.filter(item => {
        return !q || item.word.toLowerCase().includes(q) || item.meaningBn.toLowerCase().includes(q) || item.meaningEn.toLowerCase().includes(q);
      }).map(item => ({ ...item, type: 'GENERAL' }));

      const sciMatches = allScienceTerms.filter(item => {
        return !q || item.term.toLowerCase().includes(q) || item.termBn.toLowerCase().includes(q) || item.definitionBn.toLowerCase().includes(q);
      });

      return [...genMatches, ...sciMatches];
    }

    if (['PHYSICS', 'CHEMISTRY', 'BIOLOGY', 'MATH'].includes(activeTab)) {
      return allScienceTerms
        .filter(item => item.category === activeTab)
        .filter(item => !q || item.term.toLowerCase().includes(q) || item.termBn.toLowerCase().includes(q) || item.definitionBn.toLowerCase().includes(q));
    }

    return [];
  }, [searchQuery, activeTab, savedWords, allScienceTerms]);

  return (
    <div id="nextgen-dictionary-widget-container">
      {/* ========================================================================= */}
      {/* 1. MAGIC WORD TOOLTIP (HIGHLIGHT SELECTION TOOL) */}
      {/* ========================================================================= */}
      {magicTooltip && (
        <div
          style={{
            position: 'absolute',
            left: `${magicTooltip.x}px`,
            top: `${magicTooltip.y}px`,
            zIndex: 99999
          }}
          className="w-72 bg-slate-950/95 text-white p-3 rounded-2xl border border-emerald-500/40 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150 space-y-2 pointer-events-auto"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-black text-xs text-emerald-400 capitalize truncate">
                  {magicTooltip.data.word || magicTooltip.data.term}
                </span>
                {magicTooltip.data.phonetic && (
                  <span className="text-[10px] text-slate-400 font-mono">
                    {magicTooltip.data.phonetic}
                  </span>
                )}
                {magicTooltip.data.pos && (
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 italic">
                    {magicTooltip.data.pos}
                  </span>
                )}
              </div>
              <p className="text-[11px] font-bold text-slate-200 mt-0.5 leading-snug">
                {magicTooltip.data.meaningBn || magicTooltip.data.definitionBn}
              </p>
            </div>

            <div className="flex items-center space-x-1 flex-shrink-0">
              <button
                type="button"
                onClick={() => handleSpeak(magicTooltip.data.word || magicTooltip.data.term)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-emerald-600/30 text-emerald-400 transition-colors"
                title="উচ্চারণ শুনুন"
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setMagicTooltip(null)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </div>

          <div className="pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
            <span className="text-slate-400 text-[9px] flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              NextGen Magic Lookup
            </span>
            <button
              type="button"
              onClick={() => {
                setSearchQuery(magicTooltip.data.word || magicTooltip.data.term);
                setIsOpen(true);
                setMagicTooltip(null);
              }}
              className="text-emerald-400 hover:underline font-bold flex items-center gap-0.5"
            >
              <span>বিস্তারিত দেখুন</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. FLOATING LAUNCHER BUTTON */}
      {/* ========================================================================= */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center">
        <button
          type="button"
          onClick={() => {
            setIsOpen(!isOpen);
            setTimeout(() => searchInputRef.current?.focus(), 150);
          }}
          className="group relative flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-2 border-emerald-500/50 hover:border-emerald-400 text-white rounded-full shadow-2xl shadow-emerald-500/20 backdrop-blur-xl transition-all duration-300 hover:scale-105 active:scale-95"
          title="অভিধান ও বিজ্ঞান পরিভাষা"
        >
          {/* Neon Glow Aura */}
          <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-md group-hover:opacity-100 opacity-60 transition-opacity pointer-events-none"></div>

          <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 group-hover:rotate-12 transition-transform">
            <Languages className="w-3.5 h-3.5" />
          </div>
          <div className="text-left hidden sm:block">
            <span className="text-xs font-black text-white block leading-none">ডিকশনারি</span>
            <span className="text-[9px] text-emerald-400 font-bold block leading-none mt-0.5">বিজ্ঞান পরিভাষা</span>
          </div>
          <span className="px-1.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-black text-[9px] shadow-sm">
            বিকাশ
          </span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 3. SLEEK DICTIONARY SIDEBAR DRAWER OVERLAY */}
      {/* ========================================================================= */}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop (light tint to preserve page visibility) */}
          <div
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm transition-opacity"
            onClick={() => setIsOpen(false)}
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-slate-900/95 border-l border-slate-800 shadow-2xl backdrop-blur-2xl text-white flex flex-col justify-between animate-in slide-in-from-right duration-300">
              
              {/* Drawer Top Header */}
              <div className="p-5 bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-950 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    <BookA className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-white flex items-center gap-1.5">
                      <span>অভিধান ও বিজ্ঞান পরিভাষা</span>
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      ইংরেজি-বাংলা শব্দকোষ ও প্রযুক্তিগত সংজ্ঞা
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Search Bar & Instant Filter */}
              <div className="p-4 bg-slate-950/60 border-b border-slate-800/80 space-y-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="যেকোনো ইংরেজি বা বাংলা শব্দ খুঁজুন..."
                    className="w-full pl-10 pr-9 py-2.5 bg-slate-800/90 border border-slate-700 rounded-xl text-sm font-medium text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Category Pill Switcher */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px] font-bold">
                  <button
                    type="button"
                    onClick={() => setActiveTab('ALL')}
                    className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all ${
                      activeTab === 'ALL'
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                        : 'bg-slate-800/80 text-slate-400 hover:text-white'
                    }`}
                  >
                    📖 সার্বজনীন শব্দকোষ
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('PHYSICS')}
                    className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all flex items-center gap-1 ${
                      activeTab === 'PHYSICS'
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                        : 'bg-slate-800/80 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Atom className="w-3 h-3 text-blue-300" />
                    <span>পদার্থবিজ্ঞান</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('CHEMISTRY')}
                    className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all flex items-center gap-1 ${
                      activeTab === 'CHEMISTRY'
                        ? 'bg-teal-600 text-white shadow-md shadow-teal-600/30'
                        : 'bg-slate-800/80 text-slate-400 hover:text-white'
                    }`}
                  >
                    <FlaskConical className="w-3 h-3 text-teal-300" />
                    <span>রসায়ন</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('BIOLOGY')}
                    className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all flex items-center gap-1 ${
                      activeTab === 'BIOLOGY'
                        ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                        : 'bg-slate-800/80 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Dna className="w-3 h-3 text-amber-300" />
                    <span>জীববিজ্ঞান</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('MATH')}
                    className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all flex items-center gap-1 ${
                      activeTab === 'MATH'
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                        : 'bg-slate-800/80 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Calculator className="w-3 h-3 text-indigo-300" />
                    <span>উচ্চতর গণিত</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('SAVED')}
                    className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all flex items-center gap-1 ${
                      activeTab === 'SAVED'
                        ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                        : 'bg-slate-800/80 text-slate-400 hover:text-white'
                    }`}
                  >
                    <BookmarkCheck className="w-3 h-3 text-purple-300" />
                    <span>সংরক্ষিত ({savedWords.length})</span>
                  </button>
                </div>
              </div>

              {/* Word List Container */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-900/60">
                {filteredList.length === 0 ? (
                  <div className="p-10 text-center text-slate-400 space-y-2">
                    <Info className="w-8 h-8 mx-auto text-slate-600" />
                    <p className="font-bold text-sm">কোনো পরিভাষা বা শব্দ পাওয়া যায়নি</p>
                    <p className="text-xs text-slate-500">অন্য শব্দ দিয়ে অনুসন্ধান করুন বা ক্যাটাগরি পরিবর্তন করুন।</p>
                  </div>
                ) : (
                  filteredList.map((item, idx) => {
                    const isScience = item.type === 'SCIENCE' || !!item.termBn;
                    const wordTitle = isScience ? item.term : item.word;
                    const wordBn = isScience ? item.termBn : item.meaningBn;
                    const isSaved = savedWords.some(w => (w.word || w.term) === wordTitle);

                    return (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-slate-800/70 border border-slate-700/70 hover:border-emerald-500/50 hover:bg-slate-800 transition-all duration-200 shadow-sm space-y-2.5 group"
                      >
                        {/* Word Header */}
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="text-base font-black text-white capitalize group-hover:text-emerald-400 transition-colors">
                                {wordTitle}
                              </h4>
                              {item.phonetic && (
                                <span className="text-xs text-slate-400 font-mono bg-slate-900 px-2 py-0.5 rounded-lg border border-slate-700/80">
                                  {item.phonetic}
                                </span>
                              )}
                              {item.pos && (
                                <span className="text-[10px] text-amber-300 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 font-bold uppercase tracking-wider">
                                  {item.pos}
                                </span>
                              )}
                              {item.subject && (
                                <span className="text-[10px] text-teal-300 px-2 py-0.5 rounded-full bg-teal-500/10 border border-teal-500/20 font-bold">
                                  {item.subject}
                                </span>
                              )}
                            </div>
                            <h5 className="text-sm font-black text-emerald-400 mt-1 leading-snug">
                              {wordBn}
                            </h5>
                          </div>

                          {/* Quick Action Icons */}
                          <div className="flex items-center space-x-1 flex-shrink-0">
                            <button
                              type="button"
                              onClick={() => handleSpeak(wordTitle)}
                              className={`p-1.5 rounded-xl border transition-all ${
                                speakingWord === wordTitle
                                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 scale-110'
                                  : 'bg-slate-900 text-slate-400 hover:text-emerald-400 border-slate-700'
                              }`}
                              title="উচ্চারণ শুনুন"
                            >
                              <Volume2 className="w-4 h-4" />
                            </button>

                            <button
                              type="button"
                              onClick={() => toggleSaveWord(item)}
                              className={`p-1.5 rounded-xl border transition-all ${
                                isSaved
                                  ? 'bg-purple-600/30 text-purple-400 border-purple-500/50'
                                  : 'bg-slate-900 text-slate-400 hover:text-purple-400 border-slate-700'
                              }`}
                              title={isSaved ? 'সংরক্ষণ বাতিল করুন' : 'বুকমার্ক করুন'}
                            >
                              {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                            </button>

                            <button
                              type="button"
                              onClick={() => handleCopy(`${wordTitle}: ${wordBn}`, wordTitle)}
                              className="p-1.5 rounded-xl bg-slate-900 text-slate-400 hover:text-white border border-slate-700 transition-colors"
                              title="সংজ্ঞা কপি করুন"
                            >
                              {copiedWord === wordTitle ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>

                        {/* Detailed Definitions */}
                        {isScience ? (
                          <div className="space-y-1.5 text-xs text-slate-300 leading-relaxed">
                            <p className="text-slate-300">
                              {item.definitionBn}
                            </p>
                            {item.keyFormula && (
                              <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-700/80 flex items-center justify-between text-xs font-mono">
                                <span className="text-[10px] text-slate-400 uppercase font-bold">মূল সূত্র:</span>
                                <RenderLatex math={item.keyFormula} />
                              </div>
                            )}
                            {item.chapter && (
                              <span className="inline-block text-[10px] text-indigo-300 font-semibold bg-indigo-950/50 px-2 py-0.5 rounded-lg border border-indigo-800/40">
                                📌 {item.chapter}
                              </span>
                            )}
                          </div>
                        ) : (
                          <div className="space-y-1.5 text-xs text-slate-300 leading-relaxed">
                            <p className="text-slate-400">
                              <strong className="text-slate-200">English:</strong> {item.meaningEn}
                            </p>
                            {item.example && (
                              <p className="text-slate-400 italic bg-slate-950/40 p-2 rounded-xl border border-slate-800">
                                💬 "{item.example}"
                              </p>
                            )}
                            {item.synonyms?.length > 0 && (
                              <div className="flex items-center gap-1 flex-wrap text-[11px]">
                                <span className="text-slate-500 font-bold">Synonyms:</span>
                                {item.synonyms.map((syn, sIdx) => (
                                  <span key={sIdx} className="px-2 py-0.5 rounded-lg bg-slate-900 text-slate-300 border border-slate-700/60 font-mono text-[10px]">
                                    {syn}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              {/* Drawer Bottom Status Footer */}
              <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span className="text-[11px]">
                  মোট শব্দ ও পরিভাষা: <strong className="text-white font-mono">{filteredList.length}টি</strong>
                </span>
                <span className="text-[10px] text-emerald-400 font-medium">
                  NextGen Fast Dict v2.0
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
