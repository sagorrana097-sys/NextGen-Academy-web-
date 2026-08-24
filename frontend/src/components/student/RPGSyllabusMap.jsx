import React, { useState, useEffect, useCallback } from 'react';

const SUBJECTS = [
  { id: 'physics', name: 'পদার্থবিজ্ঞান', icon: '🔭', color: '#3b82f6', chapters: [
    'ভৌত রাশি ও পরিমাপ','গতিবিদ্যা','বল ও গতির সূত্র','কাজ ও শক্তি','তরঙ্গ ও শব্দ'
  ]},
  { id: 'gen-math', name: 'সাধারণ গণিত', icon: '📐', color: '#6366f1', chapters: [
    'বাস্তব সংখ্যা','বীজগাণিতিক রাশি','জ্যামিতি','পরিসংখ্যান','ত্রিকোণমিতি'
  ]},
  { id: 'higher-math', name: 'উচ্চতর গণিত', icon: '🔢', color: '#8b5cf6', chapters: [
    'ম্যাট্রিক্স','ভেক্টর','জটিল সংখ্যা','সীমা ও ধারাবাহিকতা','অবকলন'
  ]},
  { id: 'chemistry', name: 'রসায়ন', icon: '⚗️', color: '#10b981', chapters: [
    'পদার্থের অবস্থা','পর্যায় সারণি','রাসায়নিক বন্ধন','মোল ধারণা','জৈব রসায়ন'
  ]},
  { id: 'biology', name: 'জীববিজ্ঞান', icon: '🧬', color: '#f59e0b', chapters: [
    'কোষ ও কোষের গঠন','জীবের শ্রেণিবিন্যাস','উদ্ভিদ শারীরতত্ত্ব','প্রাণীর পুষ্টি','বংশগতি'
  ]},
  { id: 'ict', name: 'তথ্য ও যোগাযোগ প্রযুক্তি', icon: '💻', color: '#ef4444', chapters: [
    'তথ্য ও যোগাযোগ প্রযুক্তি','কম্পিউটার নেটওয়ার্ক','ডেটাবেজ','প্রোগ্রামিং','ওয়েব ডিজাইন'
  ]},
];

const STORAGE_KEY = 'nextgen_syllabus_progress';

function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set(['physics-0','physics-1','gen-math-0','chemistry-0','biology-0','ict-0']);
  } catch { return new Set(); }
}

function saveProgress(set) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify([...set])); } catch {}
}

// Node positions: zigzag snake path
function getNodePositions(count, width, height) {
  const positions = [];
  const rowH = height / Math.ceil(count / 3);
  for (let i = 0; i < count; i++) {
    const row = Math.floor(i / 3);
    const col = i % 3;
    const evenRow = row % 2 === 0;
    const x = evenRow ? (col + 0.5) * (width / 3) : ((2 - col) + 0.5) * (width / 3);
    const y = 60 + row * rowH;
    positions.push({ x, y });
  }
  return positions;
}

export default function RPGSyllabusMap() {
  const [selectedSubject, setSelectedSubject] = useState('physics');
  const [completed, setCompleted] = useState(loadProgress);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);

  const subject = SUBJECTS.find(s => s.id === selectedSubject);
  const chapters = subject?.chapters || [];
  const color = subject?.color || '#6366f1';

  const isCompleted = (idx) => completed.has(`${selectedSubject}-${idx}`);
  const isUnlocked = (idx) => idx === 0 || isCompleted(idx - 1);

  const markComplete = (idx) => {
    const key = `${selectedSubject}-${idx}`;
    const next = new Set(completed);
    if (next.has(key)) next.delete(key); else next.add(key);
    setCompleted(next);
    saveProgress(next);
  };

  const completedCount = chapters.filter((_, i) => isCompleted(i)).length;
  const xp = chapters.reduce((acc, _, i) => acc + (isCompleted(i) ? 100 : 0), 0);
  const level = Math.floor(xp / 200) + 1;

  const SVG_W = 700;
  const SVG_H = 420;
  const positions = getNodePositions(chapters.length, SVG_W, SVG_H - 60);

  // Build bezier path
  const pathD = positions.reduce((d, p, i) => {
    if (i === 0) return `M ${p.x} ${p.y}`;
    const prev = positions[i - 1];
    const cx1 = (prev.x + p.x) / 2;
    const cy1 = prev.y;
    const cx2 = (prev.x + p.x) / 2;
    const cy2 = p.y;
    return `${d} C ${cx1} ${cy1} ${cx2} ${cy2} ${p.x} ${p.y}`;
  }, '');

  return (
    <div style={{ fontFamily: "'Hind Siliguri', sans-serif", background: '#0a0f1e', minHeight: '100vh', color: '#e2e8f0', paddingBottom: 40 }}>
      <style>{`
        @keyframes nodePulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.12); }
        }
        @keyframes starTwinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        @keyframes glow {
          0%, 100% { filter: drop-shadow(0 0 6px currentColor); }
          50% { filter: drop-shadow(0 0 18px currentColor); }
        }
      `}</style>

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg,#0f172a,#1e1b4b)', padding: '22px 28px', borderBottom: '1px solid #1e293b' }}>
        <h2 style={{ margin: 0, color: '#a5b4fc', fontWeight: 800, fontSize: 22 }}>🗺️ RPG সিলেবাস জার্নি ম্যাপ</h2>
        <p style={{ margin: '4px 0 0', color: '#4f46e5', fontSize: 13 }}>অধ্যায় সম্পন্ন করে XP অর্জন করুন — Level Up করুন!</p>
      </div>

      {/* Subject Pills */}
      <div style={{ padding: '16px 24px', display: 'flex', gap: 10, overflowX: 'auto', background: '#0f172a', borderBottom: '1px solid #1e293b' }}>
        {SUBJECTS.map(s => (
          <button key={s.id} onClick={() => { setSelectedSubject(s.id); setSelectedNode(null); }}
            style={{
              padding: '8px 18px', borderRadius: 20, border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 13, whiteSpace: 'nowrap',
              background: selectedSubject === s.id ? s.color : '#1e293b',
              color: selectedSubject === s.id ? '#fff' : '#94a3b8',
              boxShadow: selectedSubject === s.id ? `0 0 16px ${s.color}88` : 'none',
              transition: 'all .2s',
            }}>
            {s.icon} {s.name}
          </button>
        ))}
      </div>

      {/* Progress Bar & Stats */}
      <div style={{ padding: '16px 24px', background: '#0f172a', display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap', borderBottom: '1px solid #1e293b' }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#94a3b8', marginBottom: 6 }}>
            <span>{subject?.icon} {subject?.name}</span>
            <span>{completedCount}/{chapters.length} অধ্যায় সম্পন্ন</span>
          </div>
          <div style={{ height: 10, background: '#1e293b', borderRadius: 6, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${chapters.length ? (completedCount / chapters.length) * 100 : 0}%`, background: `linear-gradient(90deg, ${color}88, ${color})`, borderRadius: 6, boxShadow: `0 0 8px ${color}66`, transition: 'width .8s' }} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 16, flexShrink: 0 }}>
          <div style={{ textAlign: 'center', background: '#1e293b', borderRadius: 10, padding: '8px 16px' }}>
            <div style={{ color: color, fontWeight: 800, fontSize: 20 }}>{xp}</div>
            <div style={{ color: '#64748b', fontSize: 11 }}>XP</div>
          </div>
          <div style={{ textAlign: 'center', background: '#312e81', borderRadius: 10, padding: '8px 16px' }}>
            <div style={{ color: '#a5b4fc', fontWeight: 800, fontSize: 20 }}>Lv.{level}</div>
            <div style={{ color: '#64748b', fontSize: 11 }}>স্তর</div>
          </div>
        </div>
      </div>

      {/* SVG Journey Map */}
      <div style={{ padding: '24px', overflow: 'hidden' }}>
        <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 20, overflow: 'hidden', position: 'relative' }}>
          <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} width="100%" height={SVG_H} style={{ display: 'block' }}>
            <defs>
              <filter id="glow-filter">
                <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              <radialGradient id={`grad-${selectedSubject}`} cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={color} stopOpacity="1" />
                <stop offset="100%" stopColor={color} stopOpacity="0.4" />
              </radialGradient>
            </defs>

            {/* Star particles */}
            {Array.from({ length: 30 }, (_, i) => (
              <circle key={i} cx={Math.random() * SVG_W} cy={Math.random() * SVG_H} r={Math.random() * 1.5 + 0.5}
                fill="#94a3b8" opacity={0.2 + Math.random() * 0.4}
                style={{ animation: `starTwinkle ${1.5 + Math.random() * 2}s infinite ${Math.random()}s` }} />
            ))}

            {/* Path */}
            <path d={pathD} fill="none" stroke="#1e293b" strokeWidth="4" strokeLinecap="round" />
            {/* Completed path overlay */}
            {chapters.map((_, i) => {
              if (i === 0 || !isCompleted(i - 1)) return null;
              const prev = positions[i - 1];
              const cur = positions[i];
              const cx = (prev.x + cur.x) / 2;
              return (
                <path key={i} d={`M ${prev.x} ${prev.y} C ${cx} ${prev.y} ${cx} ${cur.y} ${cur.x} ${cur.y}`}
                  fill="none" stroke={color} strokeWidth="4" strokeLinecap="round"
                  opacity="0.7" filter="url(#glow-filter)" />
              );
            })}

            {/* Nodes */}
            {chapters.map((chapter, i) => {
              const pos = positions[i];
              const done = isCompleted(i);
              const unlocked = isUnlocked(i);
              const isSelected = selectedNode === i;
              const isHovered = hoveredNode === i;
              const r = isSelected ? 26 : isHovered ? 24 : 22;

              return (
                <g key={i} style={{ cursor: unlocked ? 'pointer' : 'default' }}
                  onClick={() => unlocked && setSelectedNode(isSelected ? null : i)}
                  onMouseEnter={() => setHoveredNode(i)}
                  onMouseLeave={() => setHoveredNode(null)}>
                  {/* Outer pulse ring for next unlocked */}
                  {unlocked && !done && (
                    <circle cx={pos.x} cy={pos.y} r={r + 10} fill="none" stroke={color} strokeWidth="2" opacity="0.5"
                      style={{ animation: 'nodePulse 1.8s infinite' }} />
                  )}
                  {/* Glow for completed */}
                  {done && <circle cx={pos.x} cy={pos.y} r={r + 8} fill={color} opacity="0.2" filter="url(#glow-filter)" />}
                  {/* Main circle */}
                  <circle cx={pos.x} cy={pos.y} r={r}
                    fill={done ? `url(#grad-${selectedSubject})` : unlocked ? '#1e293b' : '#0f172a'}
                    stroke={done ? color : unlocked ? color : '#334155'}
                    strokeWidth={isSelected ? 3 : 2}
                    filter={done ? 'url(#glow-filter)' : 'none'} />
                  {/* Icon */}
                  <text x={pos.x} y={pos.y + 1} textAnchor="middle" dominantBaseline="middle" fontSize={done ? 14 : unlocked ? 13 : 14} fill={done ? '#fff' : unlocked ? color : '#475569'}>
                    {done ? '✓' : unlocked ? String(i + 1) : '🔒'}
                  </text>
                  {/* Chapter label */}
                  <text x={pos.x} y={pos.y + r + 14} textAnchor="middle" fontSize="10" fill={done ? color : unlocked ? '#94a3b8' : '#334155'}
                    style={{ fontFamily: "'Hind Siliguri',sans-serif" }}>
                    {chapter.length > 10 ? chapter.slice(0, 10) + '…' : chapter}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Chapter Detail Panel */}
        {selectedNode !== null && (
          <div style={{ marginTop: 20, background: '#0f172a', border: `1px solid ${color}44`, borderRadius: 16, padding: '20px 24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <div style={{ color: color, fontSize: 12, fontWeight: 700, marginBottom: 4 }}>
                  অধ্যায় {selectedNode + 1} / {chapters.length}
                </div>
                <div style={{ color: '#f1f5f9', fontWeight: 800, fontSize: 18 }}>{chapters[selectedNode]}</div>
                <div style={{ color: '#64748b', fontSize: 13, marginTop: 4 }}>{subject?.name} · {isCompleted(selectedNode) ? '✅ সম্পন্ন' : isUnlocked(selectedNode) ? '🔓 আনলক করা' : '🔒 লক করা'}</div>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                {isUnlocked(selectedNode) && (
                  <>
                    <button style={{ background: '#1e293b', color: '#94a3b8', border: '1px solid #334155', borderRadius: 10, padding: '10px 18px', cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>
                      📖 শুরু করুন
                    </button>
                    <button onClick={() => markComplete(selectedNode)}
                      style={{ background: isCompleted(selectedNode) ? '#374151' : color, color: '#fff', border: 'none', borderRadius: 10, padding: '10px 18px', cursor: 'pointer', fontWeight: 700, fontSize: 13, boxShadow: isCompleted(selectedNode) ? 'none' : `0 0 12px ${color}66` }}>
                      {isCompleted(selectedNode) ? '↩️ অসম্পন্ন করুন' : '✅ সম্পন্ন হিসেবে চিহ্নিত করুন'}
                    </button>
                  </>
                )}
                {!isUnlocked(selectedNode) && (
                  <div style={{ color: '#ef4444', fontSize: 13, padding: '10px 0' }}>🔒 আগের অধ্যায় সম্পন্ন করুন</div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
