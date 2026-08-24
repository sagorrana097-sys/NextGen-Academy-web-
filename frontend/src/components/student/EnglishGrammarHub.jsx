import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  BookA, Sparkles, Layers, ListChecks, Download, CheckCircle2,
  AlertCircle, HelpCircle, Award, ChevronRight, Search, BookOpen,
  Volume2, RefreshCw, Loader2, ShieldCheck, Brain, Type, Mic2,
  ZapIcon, FileText, Globe
} from 'lucide-react';
import { grammarAPI } from '../../services/api';
import { exportBrandedGraphic } from '../../utils/exportBrandedGraphic';

// ---------------------------------------------------------------------------
// Irregular verb forms lookup (Top 40 irregular verbs)
// ---------------------------------------------------------------------------
const IRREGULAR_VERBS = {
  go:     { v2: 'went',     v3: 'gone' },
  do:     { v2: 'did',      v3: 'done' },
  have:   { v2: 'had',      v3: 'had' },
  make:   { v2: 'made',     v3: 'made' },
  take:   { v2: 'took',     v3: 'taken' },
  come:   { v2: 'came',     v3: 'come' },
  see:    { v2: 'saw',      v3: 'seen' },
  get:    { v2: 'got',      v3: 'got/gotten' },
  give:   { v2: 'gave',     v3: 'given' },
  know:   { v2: 'knew',     v3: 'known' },
  run:    { v2: 'ran',      v3: 'run' },
  think:  { v2: 'thought',  v3: 'thought' },
  say:    { v2: 'said',     v3: 'said' },
  find:   { v2: 'found',    v3: 'found' },
  tell:   { v2: 'told',     v3: 'told' },
  become: { v2: 'became',   v3: 'become' },
  show:   { v2: 'showed',   v3: 'shown' },
  leave:  { v2: 'left',     v3: 'left' },
  feel:   { v2: 'felt',     v3: 'felt' },
  put:    { v2: 'put',      v3: 'put' },
  bring:  { v2: 'brought',  v3: 'brought' },
  begin:  { v2: 'began',    v3: 'begun' },
  keep:   { v2: 'kept',     v3: 'kept' },
  hold:   { v2: 'held',     v3: 'held' },
  write:  { v2: 'wrote',    v3: 'written' },
  stand:  { v2: 'stood',    v3: 'stood' },
  hear:   { v2: 'heard',    v3: 'heard' },
  let:    { v2: 'let',      v3: 'let' },
  mean:   { v2: 'meant',    v3: 'meant' },
  set:    { v2: 'set',      v3: 'set' },
  sing:   { v2: 'sang',     v3: 'sung' },
  ring:   { v2: 'rang',     v3: 'rung' },
  drink:  { v2: 'drank',    v3: 'drunk' },
  swim:   { v2: 'swam',     v3: 'swum' },
  buy:    { v2: 'bought',   v3: 'bought' },
  catch:  { v2: 'caught',   v3: 'caught' },
  teach:  { v2: 'taught',   v3: 'taught' },
  speak:  { v2: 'spoke',    v3: 'spoken' },
  break:  { v2: 'broke',    v3: 'broken' },
  choose: { v2: 'chose',    v3: 'chosen' },
};

function getVerbForms(word) {
  const lw = word.toLowerCase();
  if (IRREGULAR_VERBS[lw]) return { v1: lw, ...IRREGULAR_VERBS[lw] };
  // Regular patterns
  let v2v3 = lw + 'ed';
  if (lw.endsWith('e')) v2v3 = lw + 'd';
  else if (lw.endsWith('y') && !/[aeiou]/.test(lw[lw.length - 2])) v2v3 = lw.slice(0, -1) + 'ied';
  else if (/[^aeiou][aeiou][^aeiou]$/.test(lw) && lw.length <= 5) v2v3 = lw + lw[lw.length - 1] + 'ed';
  return { v1: lw, v2: v2v3, v3: v2v3 };
}

// POS Badge color mapping
const POS_COLORS = {
  noun: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
  verb: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
  adjective: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
  adverb: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
  pronoun: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
  preposition: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
  conjunction: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
  interjection: 'bg-pink-500/20 text-pink-300 border-pink-500/40',
};

function POSBadge({ pos }) {
  const cls = POS_COLORS[pos?.toLowerCase()] || 'bg-slate-700 text-slate-300 border-slate-600';
  return (
    <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-black uppercase tracking-widest ${cls}`}>
      {pos}
    </span>
  );
}

// Highlight searched word in example sentence
function HighlightSentence({ sentence, word }) {
  if (!sentence || !word) return <span>{sentence}</span>;
  const regex = new RegExp(`(\\${word}\\)`, 'gi');
  const parts = sentence.split(regex);
  return (
    <>
      {parts.map((part, i) =>
        regex.test(part)
          ? <mark key={i} className="bg-emerald-500/30 text-emerald-300 font-bold px-0.5 rounded not-italic">{part}</mark>
          : <span key={i}>{part}</span>
      )}
    </>
  );
}

// ---------------------------------------------------------------------------
// Word Analyzer Panel
// ---------------------------------------------------------------------------
function WordAnalyzerPanel({ word, wordCardRef, onExport, isExporting }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (!word || word.trim().length < 2) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    setResult(null);

    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word.trim())}`)
      .then(r => {
        if (!r.ok) throw new Error('NOT_FOUND');
        return r.json();
      })
      .then(data => {
        if (!cancelled && data?.[0]) setResult(data[0]);
        else if (!cancelled) throw new Error('EMPTY');
      })
      .catch(err => {
        if (!cancelled) setError(err.message === 'NOT_FOUND' ? 'NOT_FOUND' : 'NETWORK_ERR');
      })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [word]);

  const firstMeaning = result?.meanings?.[0];
  const pos = firstMeaning?.partOfSpeech;
  const definition = firstMeaning?.definitions?.[0]?.definition || '';
  const example = firstMeaning?.definitions?.[0]?.example || '';
  const phonetic = result?.phonetics?.find(p => p.text)?.text || result?.phonetic || '';
  const isVerb = pos === 'verb';
  const verbForms = isVerb ? getVerbForms(word) : null;

  if (loading) {
    return (
      <div className="p-12 text-center bg-slate-900 rounded-3xl border border-slate-800">
        <Loader2 className="w-8 h-8 mx-auto animate-spin text-emerald-500 mb-3" />
        <p className="text-sm text-slate-400">"{word}" বিশ্লেষণ করা হচ্ছে...</p>
      </div>
    );
  }

  if (error === 'NOT_FOUND') {
    return (
      <div className="p-12 text-center bg-slate-900 rounded-3xl border border-slate-800">
        <AlertCircle className="w-10 h-10 mx-auto text-amber-400 mb-3" />
        <h3 className="font-black text-white text-lg mb-1">"{word}" পাওয়া যায়নি</h3>
        <p className="text-xs text-slate-400">এই শব্দটি ইংরেজি অভিধানে নেই। সঠিক বানান দিয়ে আবার চেষ্টা করুন।</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-12 text-center bg-slate-900 rounded-3xl border border-slate-800">
        <Globe className="w-10 h-10 mx-auto text-rose-400 mb-3" />
        <p className="text-xs text-slate-400">API সংযোগ ব্যর্থ। ইন্টারনেট সংযোগ পরীক্ষা করুন।</p>
      </div>
    );
  }

  if (!result) return null;

  return (
    <div ref={wordCardRef} className="space-y-4">
      {/* Word Header Card */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950/30 to-slate-900 border border-indigo-500/30 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/5 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />

        {/* Word & Pronunciation */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-4xl font-black text-white capitalize">{result.word}</h2>
              {phonetic && (
                <span className="text-sm text-slate-400 font-mono italic">/ {phonetic} /</span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              {result.meanings?.map((m, i) => (
                <POSBadge key={i} pos={m.partOfSpeech} />
              ))}
              <span className="text-[10px] text-slate-500 font-mono">Free Dictionary API</span>
            </div>
          </div>

          <button
            type="button"
            onClick={onExport}
            disabled={isExporting}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs shadow-lg flex items-center gap-2 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 flex-shrink-0"
          >
            {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            <span>Word Card ডাউনলোড</span>
          </button>
        </div>

        {/* Definition */}
        {definition && (
          <div className="mt-4 p-4 bg-slate-950/60 rounded-2xl border border-slate-800">
            <p className="text-[10px] text-emerald-400 font-black uppercase tracking-widest mb-1">সংজ্ঞা (Definition)</p>
            <p className="text-sm text-slate-200 leading-relaxed">{definition}</p>
          </div>
        )}

        {/* Example sentence with highlighted word */}
        {example && (
          <div className="mt-3 p-4 bg-slate-950/60 rounded-2xl border border-slate-800">
            <p className="text-[10px] text-amber-400 font-black uppercase tracking-widest mb-1 flex items-center gap-1">
              <FileText className="w-3 h-3" /> উদাহরণ বাক্য (Example)
            </p>
            <p className="text-sm text-slate-300 italic leading-relaxed">
              "<HighlightSentence sentence={example} word={result.word} />"
            </p>
          </div>
        )}
      </div>

      {/* All Meanings */}
      {result.meanings?.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4">
          <h3 className="font-black text-white text-sm flex items-center gap-2">
            <Type className="w-4 h-4 text-emerald-400" />
            সকল অর্থ ও প্রয়োগ (All Meanings & Usage)
          </h3>

          {result.meanings.map((meaning, mi) => (
            <div key={mi} className="space-y-2">
              <div className="flex items-center gap-2">
                <POSBadge pos={meaning.partOfSpeech} />
                <div className="flex-1 h-px bg-slate-800" />
              </div>

              {meaning.definitions?.slice(0, 3).map((def, di) => (
                <div key={di} className="pl-3 border-l-2 border-slate-700 space-y-1">
                  <p className="text-xs text-slate-200">{di + 1}. {def.definition}</p>
                  {def.example && (
                    <p className="text-[11px] text-slate-400 italic">
                      e.g. "<HighlightSentence sentence={def.example} word={result.word} />"
                    </p>
                  )}
                </div>
              ))}

              {/* Synonyms */}
              {meaning.synonyms?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Synonyms:</span>
                  {meaning.synonyms.slice(0, 5).map((s, si) => (
                    <span key={si} className="px-2 py-0.5 rounded-lg bg-slate-800 text-slate-400 text-[10px] font-mono">{s}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Verb Forms Table */}
      {isVerb && verbForms && (
        <div className="bg-slate-900 border border-emerald-500/20 rounded-3xl p-5 space-y-3">
          <h3 className="font-black text-emerald-300 text-sm flex items-center gap-2">
            <ZapIcon className="w-4 h-4 text-emerald-400" />
            Verb Forms (ক্রিয়ার রূপ)
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'V1 — Base Form', sub: 'Present / Infinitive', value: verbForms.v1, color: 'border-emerald-500/40 bg-emerald-950/20' },
              { label: 'V2 — Past Simple', sub: 'Simple Past Tense', value: verbForms.v2, color: 'border-amber-500/40 bg-amber-950/20' },
              { label: 'V3 — Past Participle', sub: 'Perfect Tenses', value: verbForms.v3, color: 'border-indigo-500/40 bg-indigo-950/20' },
            ].map((f, i) => (
              <div key={i} className={`p-3.5 rounded-2xl border ${f.color} text-center space-y-1`}>
                <p className="text-[10px] text-slate-400 font-bold">{f.label}</p>
                <p className="text-lg font-black text-white">{f.value}</p>
                <p className="text-[9px] text-slate-500 italic">{f.sub}</p>
              </div>
            ))}
          </div>
          {!IRREGULAR_VERBS[verbForms.v1] && (
            <p className="text-[11px] text-slate-500 italic">✔ নিয়মিত ক্রিয়া (Regular Verb) — সাধারণ নিয়মে গঠিত</p>
          )}
          {IRREGULAR_VERBS[verbForms.v1] && (
            <p className="text-[11px] text-amber-400/70 italic">⚠ অনিয়মিত ক্রিয়া (Irregular Verb) — মুখস্থ করা আবশ্যক</p>
          )}
        </div>
      )}

      {/* Phonetics detail */}
      {result.phonetics?.filter(p => p.text).length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-2 flex items-center gap-1">
            <Mic2 className="w-3 h-3" /> উচ্চারণ রীতি (Phonetics)
          </p>
          <div className="flex flex-wrap gap-2">
            {result.phonetics.filter(p => p.text).map((p, i) => (
              <span key={i} className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 font-mono text-xs">{p.text}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------
export default function EnglishGrammarHub() {
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [activeTab, setActiveTab] = useState('RULES');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [userAnswers, setUserAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isWordCardExporting, setIsWordCardExporting] = useState(false);

  // Word Analyzer state
  const [debouncedWord, setDebouncedWord] = useState('');

  const exportCardRef = useRef(null);
  const wordCardRef = useRef(null);

  useEffect(() => { fetchTopics(); }, []);

  const fetchTopics = async () => {
    setLoading(true);
    try {
      const res = await grammarAPI.getTopics();
      if (res?.success && res.data) {
        const published = res.data.filter(t => t.isPublished !== false);
        setTopics(published);
        if (published.length > 0) setSelectedTopic(published[0]);
      }
    } catch (err) {
      console.error('Failed to load grammar topics:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filtered Topics
  const filteredTopics = topics.filter(t => {
    const matchesCat = selectedCategory === 'ALL' || t.category === selectedCategory;
    const matchesQ = !searchQuery || t.title.toLowerCase().includes(searchQuery.toLowerCase()) || (t.summary && t.summary.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesQ;
  });

  // Smart Search: debounce + trigger word analyzer when no topic matches
  useEffect(() => {
    const q = searchQuery.trim();
    if (q.length < 2 || filteredTopics.length > 0) {
      setDebouncedWord('');
      return;
    }
    const timer = setTimeout(() => setDebouncedWord(q), 600);
    return () => clearTimeout(timer);
  }, [searchQuery, filteredTopics.length]);

  const showWordAnalyzer = searchQuery.trim().length >= 2 && filteredTopics.length === 0;

  const handleSelectOption = (questionId, optionIndex) => {
    if (quizSubmitted) return;
    setUserAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
  };

  const calculateScore = () => {
    if (!selectedTopic?.quiz) return 0;
    return selectedTopic.quiz.filter(q => userAnswers[q.id] === q.correctAnswerIndex).length;
  };

  const resetQuiz = () => { setUserAnswers({}); setQuizSubmitted(false); };

  const handleExportRuleChart = async () => {
    if (!exportCardRef.current || !selectedTopic) return;
    setIsExporting(true);
    try {
      await exportBrandedGraphic(exportCardRef.current, {
        fileName: `NextGen-Grammar-${selectedTopic.slug || 'Rules'}`,
        cardTitle: selectedTopic.title,
        scale: 2
      });
    } catch (err) {
      console.error('Failed to export grammar chart:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportWordCard = async () => {
    if (!wordCardRef.current) return;
    setIsWordCardExporting(true);
    try {
      await exportBrandedGraphic(wordCardRef.current, {
        fileName: `NextGen-WordCard-${debouncedWord || 'Word'}`,
        cardTitle: `Word Analysis: ${debouncedWord}`,
        scale: 2
      });
    } catch (err) {
      console.error('Failed to export word card:', err);
    } finally {
      setIsWordCardExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-3xl shadow-xl text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="p-3.5 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <BookA className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white flex items-center gap-2 flex-wrap">
              <span>ইংলিশ গ্রামার মাস্টারক্লাস ও AI Word Analyzer</span>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500 text-white font-black text-[10px] uppercase">
                NextGen Grammar + AI
              </span>
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              গ্রামার টপিক, সেলফ-কুইজ এবং যেকোনো ইংরেজি শব্দের AI বিশ্লেষণ
            </p>
          </div>
        </div>

        {selectedTopic && !showWordAnalyzer && (
          <button
            type="button"
            onClick={handleExportRuleChart}
            disabled={isExporting}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition-all self-start md:self-auto hover:scale-105 active:scale-95 disabled:opacity-50"
          >
            {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            <span>ব্র্যান্ডেড রুল চার্ট ডাউনলোড</span>
          </button>
        )}
      </div>

      {/* Main 2-Column Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Topic Navigation */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
            {/* Smart Search Bar */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="টপিক বা যেকোনো ইংরেজি শব্দ লিখুন..."
                className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder-slate-500"
              />
              {showWordAnalyzer && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Brain className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                </div>
              )}
            </div>

            {/* AI Word Analyzer tip */}
            {showWordAnalyzer && (
              <div className="flex items-center gap-1.5 p-2.5 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-[10px] text-indigo-300">
                <Brain className="w-3 h-3 text-indigo-400 flex-shrink-0" />
                <span>AI Word Analyzer সক্রিয় — "{searchQuery}" বিশ্লেষণ হচ্ছে</span>
              </div>
            )}

            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[10px] font-bold scrollbar-none">
              {['ALL', 'TENSE', 'VOICE', 'VERBS', 'NARRATION', 'CONDITIONALS'].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg whitespace-nowrap transition-colors ${
                    selectedCategory === cat
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {cat === 'ALL' ? 'সকল' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Topics List */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-2 space-y-1 max-h-[500px] overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center text-slate-400">
                <Loader2 className="w-6 h-6 mx-auto animate-spin text-emerald-500 mb-2" />
                <p className="text-xs">লোড হচ্ছে...</p>
              </div>
            ) : filteredTopics.length === 0 && !showWordAnalyzer ? (
              <div className="p-6 text-center text-slate-500 text-xs space-y-2">
                <Brain className="w-8 h-8 mx-auto text-indigo-400 mb-2" />
                <p className="text-indigo-300 font-bold">টপিক পাওয়া যায়নি</p>
                <p className="text-slate-500">"{searchQuery}" শব্দটি AI Word Analyzer দিয়ে বিশ্লেষণ করা হচ্ছে →</p>
              </div>
            ) : (
              filteredTopics.map((t) => {
                const isSelected = selectedTopic?.id === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => { setSelectedTopic(t); resetQuiz(); }}
                    className={`w-full text-left p-3 rounded-xl transition-all flex items-center justify-between group ${
                      isSelected
                        ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 shadow-md'
                        : 'hover:bg-slate-800/80 text-slate-300 border border-transparent'
                    }`}
                  >
                    <div className="min-w-0 pr-2">
                      <h4 className="font-bold text-xs truncate group-hover:text-white">{t.title}</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5 truncate">{t.summary || t.level}</p>
                    </div>
                    <ChevronRight className={`w-4 h-4 flex-shrink-0 transition-transform ${isSelected ? 'translate-x-1 text-emerald-400' : 'text-slate-600'}`} />
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-8 space-y-4">
          {showWordAnalyzer ? (
            <WordAnalyzerPanel
              word={debouncedWord}
              wordCardRef={wordCardRef}
              onExport={handleExportWordCard}
              isExporting={isWordCardExporting}
            />
          ) : selectedTopic ? (
            <div className="space-y-4">
              {/* Tab Switcher */}
              <div className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-2xl p-1.5 text-xs font-bold text-white">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setActiveTab('RULES')}
                    className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                      activeTab === 'RULES'
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>সূত্র ও ব্যাখ্যা (Rules & Notes)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('QUIZ')}
                    className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                      activeTab === 'QUIZ'
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <ListChecks className="w-3.5 h-3.5" />
                    <span>ইন্টারেক্টিভ টেস্ট ({selectedTopic.quiz?.length || 0}টি প্রশ্ন)</span>
                  </button>
                </div>
                <span className="text-[10px] text-slate-400 pr-3 hidden sm:inline">{selectedTopic.level}</span>
              </div>

              {/* Tab 1: Rules */}
              {activeTab === 'RULES' && (
                <div ref={exportCardRef} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white space-y-5 shadow-2xl relative overflow-hidden">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold uppercase tracking-wider">
                        {selectedTopic.category}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">{selectedTopic.level}</span>
                    </div>
                    <h3 className="text-2xl font-black text-white mt-2 leading-tight">{selectedTopic.title}</h3>
                    {selectedTopic.summary && (
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">{selectedTopic.summary}</p>
                    )}
                  </div>

                  {selectedTopic.teacherNotes && (
                    <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/40 to-slate-900 border border-amber-500/40 text-amber-200 text-xs leading-relaxed space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-amber-300 text-xs">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        <span>শিক্ষকের বিশেষ দিকনির্দেশনা ও গোল্ডেন টেকনিক:</span>
                      </div>
                      <p className="pl-5 font-medium text-amber-100/90">{selectedTopic.teacherNotes}</p>
                    </div>
                  )}

                  {selectedTopic.rules?.length > 0 && (
                    <div className="space-y-4">
                      <h4 className="font-extrabold text-sm text-emerald-400 flex items-center gap-2">
                        <Layers className="w-4 h-4" />
                        <span>মূল সূত্র ও স্ট্রাকচার (Master Formulas):</span>
                      </h4>
                      <div className="space-y-3">
                        {selectedTopic.rules.map((r, idx) => (
                          <div key={idx} className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-2.5 hover:border-slate-700 transition-colors">
                            <div className="flex items-center justify-between">
                              <h5 className="font-bold text-sm text-white flex items-center gap-2">
                                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs flex items-center justify-center font-mono">{idx + 1}</span>
                                <span>{r.nameBn || r.name}</span>
                              </h5>
                              {r.name && r.nameBn && (
                                <span className="text-[10px] text-slate-400 font-mono">{r.name}</span>
                              )}
                            </div>
                            {r.formula && (
                              <div className="p-2.5 rounded-xl bg-slate-900 border border-emerald-500/30 font-mono text-xs text-emerald-300 font-bold leading-relaxed">
                                {r.formula}
                              </div>
                            )}
                            {(r.exampleEn || r.exampleBn) && (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs bg-slate-900/50 p-2.5 rounded-xl border border-slate-800/80">
                                {r.exampleEn && (
                                  <div>
                                    <span className="text-[9px] text-slate-500 uppercase font-bold block">English:</span>
                                    <span className="font-semibold text-slate-200">{r.exampleEn}</span>
                                  </div>
                                )}
                                {r.exampleBn && (
                                  <div>
                                    <span className="text-[9px] text-slate-500 uppercase font-bold block">বাংলা অর্থ:</span>
                                    <span className="text-slate-300">{r.exampleBn}</span>
                                  </div>
                                )}
                              </div>
                            )}
                            {r.tips && <p className="text-[11px] text-slate-400 italic">💡 {r.tips}</p>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedTopic.contentHtml && (
                    <div
                      dangerouslySetInnerHTML={{ __html: selectedTopic.contentHtml }}
                      className="pt-4 border-t border-slate-800 text-xs text-slate-300 leading-relaxed"
                    />
                  )}
                </div>
              )}

              {/* Tab 2: Quiz */}
              {activeTab === 'QUIZ' && (
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white space-y-5 shadow-2xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-black text-lg text-white">{selectedTopic.title} — সেলফ কুইজ</h3>
                      <p className="text-xs text-slate-400 mt-0.5">প্রতিটি প্রশ্নের সঠিক উত্তর নির্বাচন করুন এবং নিচে সাবমিট করে ব্যাখ্যা দেখুন</p>
                    </div>
                    {quizSubmitted && (
                      <div className="px-4 py-2 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 font-mono font-black text-sm flex items-center gap-1.5">
                        <Award className="w-4 h-4 text-amber-400" />
                        <span>স্কোর: {calculateScore()} / {selectedTopic.quiz?.length || 0}</span>
                      </div>
                    )}
                  </div>

                  {(!selectedTopic.quiz || selectedTopic.quiz.length === 0) ? (
                    <div className="p-8 text-center text-slate-400 text-xs">এই টপিকে কোনো কুইজ যুক্ত করা হয়নি।</div>
                  ) : (
                    <div className="space-y-4">
                      {selectedTopic.quiz.map((q, qIdx) => {
                        const selectedOpt = userAnswers[q.id];
                        const isCorrect = selectedOpt === q.correctAnswerIndex;
                        return (
                          <div key={q.id || qIdx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                            <h4 className="font-bold text-sm text-white">{qIdx + 1}. {q.question}</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {(q.options || []).map((opt, oIdx) => {
                                const isChecked = selectedOpt === oIdx;
                                let btnStyle = 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700';
                                if (quizSubmitted) {
                                  if (oIdx === q.correctAnswerIndex) btnStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold';
                                  else if (isChecked && !isCorrect) btnStyle = 'bg-rose-500/20 border-rose-500 text-rose-300';
                                } else if (isChecked) {
                                  btnStyle = 'bg-indigo-600/30 border-indigo-500 text-indigo-200 font-bold shadow-md';
                                }
                                return (
                                  <button key={oIdx} type="button" onClick={() => handleSelectOption(q.id, oIdx)}
                                    className={`p-3 rounded-xl border text-xs text-left transition-all flex items-center gap-2.5 ${btnStyle}`}>
                                    <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center font-mono text-[10px] flex-shrink-0">
                                      {String.fromCharCode(65 + oIdx)}
                                    </span>
                                    <span className="leading-snug">{opt}</span>
                                  </button>
                                );
                              })}
                            </div>
                            {quizSubmitted && q.explanation && (
                              <div className={`p-3 rounded-xl text-xs leading-relaxed border ${isCorrect ? 'bg-emerald-950/40 border-emerald-800/50 text-emerald-300' : 'bg-rose-950/40 border-rose-800/50 text-rose-300'}`}>
                                <strong>ব্যাখ্যা:</strong> {q.explanation}
                              </div>
                            )}
                          </div>
                        );
                      })}
                      <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                        {quizSubmitted ? (
                          <button type="button" onClick={resetQuiz}
                            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center gap-1.5">
                            <RefreshCw className="w-3.5 h-3.5" />
                            <span>পুনরায় পরীক্ষা দিন</span>
                          </button>
                        ) : (
                          <button type="button" onClick={() => setQuizSubmitted(true)}
                            disabled={Object.keys(userAnswers).length === 0}
                            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-black text-xs shadow-lg shadow-indigo-600/30">
                            উত্তর জমা দিন (Submit Quiz)
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="p-12 text-center bg-slate-900/60 rounded-3xl border border-slate-800 text-slate-400">
              <BookOpen className="w-12 h-12 mx-auto text-slate-600 mb-3" />
              <p className="font-bold mb-1">বাম পাশের তালিকা থেকে একটি গ্রামার টপিক নির্বাচন করুন</p>
              <p className="text-xs text-slate-500">অথবা যেকোনো ইংরেজি শব্দ টাইপ করলে AI Word Analyzer স্বয়ংক্রিয়ভাবে বিশ্লেষণ শুরু করবে</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
