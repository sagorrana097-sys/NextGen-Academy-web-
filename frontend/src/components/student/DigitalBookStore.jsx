import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { studentAPI } from '../../services/api';
import InteractiveGrammarBook from '../grammar/InteractiveGrammarBook';


const BRAND = {
  name: 'NextGen Academy',
  teacher: 'মো: আলমগীর হোসেন (সাগর)',
  phone: '০১৭৯২৮১৮০০৫',
  address: 'পশ্চিম জয়দেবপুর, বাস-স্ট্যান্ড, গাজীপুর',
  tagline: 'LEARN · GROW · SUCCEED',
};

const CATALOG = [
  {
    id: 'bs-bangla-grammar',
    title: 'বাংলা ব্যাকরণ ও নির্মিতি (৪০টি অধ্যায় সম্পূর্ণ ডিজিটাল পাঠ্যবই)',
    category: 'PARALLEL_TEXTBOOK',
    subject: 'বাংলা ব্যাকরণ',
    grade: 'SSC/HSC',
    price: 0,
    coinPrice: 0,
    pages: 480,
    rating: 5.0,
    previewPages: 40,
    coverColor: '#059669',
    badge: 'ডিজিটাল পাঠ্যবই',
    isInteractiveGrammar: true,
    grammarSubject: 'BANGLA',
    summary: '১ম থেকে ৪০তম অধ্যায়ের সম্পূর্ণ নিয়ম, ব্যাকরণিক সূত্র, ৮৫টি টপিক, ২২৫টি বোর্ড MCQ ও ৪০টি মডেল টেস্ট সহ সম্পূর্ণ ইন্টারেক্টিভ ডিজিটাল পাঠ্যবই।'
  },
  {
    id: 'bs-english-grammar',
    title: 'Complete English Grammar & Composition (23 Chapters Digital Textbook)',
    category: 'PARALLEL_TEXTBOOK',
    subject: 'English Grammar',
    grade: 'SSC/HSC',
    price: 0,
    coinPrice: 0,
    pages: 350,
    rating: 5.0,
    previewPages: 23,
    coverColor: '#4f46e5',
    badge: 'ডিজিটাল পাঠ্যবই',
    isInteractiveGrammar: true,
    grammarSubject: 'ENGLISH',
    summary: '23 Chapters, 133 topics, grammar rules, formulas, 283 MCQs, drills and model tests for Class 6-12 & SSC/HSC.'
  },
  { id: 'bs-1', title: 'SSC পদার্থবিজ্ঞান সম্পূর্ণ গাইড ২০২৬', category: 'PARALLEL_TEXTBOOK', subject: 'পদার্থবিজ্ঞান', grade: 'SSC', price: 150, coinPrice: 300, pages: 312, rating: 4.8, previewPages: 4, coverColor: '#3b82f6', badge: 'বেস্টসেলার' },
  { id: 'bs-2', title: 'HSC উচ্চতর গণিত লেকচার শিট (সম্পূর্ণ)', category: 'LECTURE_SHEET', subject: 'উচ্চতর গণিত', grade: 'HSC', price: 80, coinPrice: 150, pages: 120, rating: 4.9, previewPages: 3, coverColor: '#8b5cf6', badge: 'টপ রেটেড' },
  { id: 'bs-3', title: 'বৃত্তি পরীক্ষা প্রস্তুতি — সম্পূর্ণ প্যাকেজ', category: 'SCHOLARSHIP_PREP', subject: 'সকল বিষয়', grade: 'JSC/SSC', price: 200, coinPrice: 400, pages: 450, rating: 4.7, previewPages: 5, coverColor: '#f59e0b', badge: 'জনপ্রিয়' },
  { id: 'bs-4', title: 'SSC রসায়ন হ্যান্ডনোট (হাতে লেখা রঙিন)', category: 'LECTURE_SHEET', subject: 'রসায়ন', grade: 'SSC', price: 60, coinPrice: 120, pages: 80, rating: 4.6, previewPages: 3, coverColor: '#10b981', badge: 'নতুন' },
  { id: 'bs-5', title: 'HSC জীববিজ্ঞান সৃজনশীল প্রশ্নোত্তর গাইড', category: 'PARALLEL_TEXTBOOK', subject: 'জীববিজ্ঞান', grade: 'HSC', price: 120, coinPrice: 250, pages: 280, rating: 4.5, previewPages: 4, coverColor: '#ef4444', badge: 'হট' },
  { id: 'bs-6', title: 'মো: আলমগীর (সাগর) স্যারের স্পেশাল ফিজিক্স নোট', category: 'LECTURE_SHEET', subject: 'পদার্থবিজ্ঞান', grade: 'SSC/HSC', price: 0, coinPrice: 0, pages: 45, rating: 5.0, previewPages: 45, coverColor: '#6366f1', badge: 'ফ্রি' },
];

const CAT_LABELS = {
  ALL: 'সব',
  PARALLEL_TEXTBOOK: 'প্যারালেল টেক্সটবুক',
  LECTURE_SHEET: 'লেকচার শিট',
  SCHOLARSHIP_PREP: 'বৃত্তি পরীক্ষা প্রস্তুতি',
};

function Stars({ rating }) {
  return (
    <span>
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ color: i <= Math.round(rating) ? '#fbbf24' : '#334155', fontSize: 12 }}>★</span>
      ))}
      <span style={{ color: '#64748b', fontSize: 11, marginLeft: 4 }}>{rating}</span>
    </span>
  );
}

function BookCover({ book, coverRef }) {
  return (
    <div ref={coverRef} style={{
      background: `linear-gradient(135deg, ${book.coverColor}dd, ${book.coverColor}88)`,
      borderRadius: 10,
      overflow: 'hidden',
      height: 180,
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    }}>
      {/* Badge */}
      <div style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(0,0,0,.5)', color: '#fff', borderRadius: 6, padding: '3px 10px', fontSize: 11, fontWeight: 700 }}>
        {book.badge}
      </div>
      {/* Content */}
      <div style={{ padding: '18px 16px 0' }}>
        <div style={{ color: '#fff', fontSize: 10, opacity: 0.8, marginBottom: 6 }}>{book.subject} · {book.grade}</div>
        <div style={{ color: '#fff', fontWeight: 800, fontSize: 14, lineHeight: 1.4 }}>{book.title}</div>
      </div>
      {/* MANDATORY Watermark Footer */}
      <div style={{
        background: 'rgba(0,0,0,.65)',
        padding: '6px 12px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 4,
      }}>
        <div>
          <div style={{ color: '#fff', fontWeight: 700, fontSize: 9 }}>{BRAND.name}</div>
          <div style={{ color: '#c7d2fe', fontSize: 8 }}>{BRAND.teacher}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ color: '#c7d2fe', fontSize: 8 }}>{BRAND.phone}</div>
          <div style={{ color: '#a5b4fc', fontSize: 7 }}>{BRAND.address}</div>
        </div>
      </div>
    </div>
  );
}

function PreviewModal({ book, onClose, onOpenGrammar }) {
  const [page, setPage] = useState(0);
  const total = Math.min(book.previewPages || 5, 5);

  if (book.isInteractiveGrammar) {
    const isBangla = book.grammarSubject === 'BANGLA';
    return (
      <div style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(0,0,0,.9)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }} onClick={onClose}>
        <div style={{
          background: '#0f172a', borderRadius: 20, maxWidth: 640, width: '95%',
          overflow: 'hidden', boxShadow: '0 0 60px rgba(99,102,241,0.4)',
          border: `1px solid ${book.coverColor}88`
        }} onClick={e => e.stopPropagation()}>
          {/* Modal header */}
          <div style={{ background: '#1e293b', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #334155' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 24 }}>{isBangla ? '🇧🇩' : '🇬🇧'}</span>
              <div>
                <div style={{ color: '#f1f5f9', fontWeight: 800, fontSize: 15 }}>{book.title}</div>
                <div style={{ color: '#94a3b8', fontSize: 12 }}>{isBangla ? 'জাতীয় শিক্ষাক্রম (NCTB) ২০২৬ প্রমিত ডিজিটাল পাঠ্যবই' : 'NCTB 2026 Curriculum Standard Interactive E-Book'}</div>
              </div>
            </div>
            <button onClick={onClose} style={{ background: '#374151', color: '#94a3b8', border: 'none', borderRadius: 8, padding: '6px 14px', cursor: 'pointer', fontSize: 13, fontWeight: 'bold' }}>✕</button>
          </div>

          {/* Book Details */}
          <div style={{ padding: '24px', background: '#0b0f19' }}>
            <div style={{ background: 'linear-gradient(135deg, rgba(30,41,59,0.8), rgba(15,23,42,0.9))', border: '1px solid #334155', borderRadius: 16, padding: '18px', marginBottom: 20 }}>
              <div style={{ color: '#38bdf8', fontWeight: 700, fontSize: 13, marginBottom: 6 }}>
                📌 {isBangla ? 'ডিজিটাল পাঠ্যবইয়ের বৈশিষ্ট্যসমূহ:' : 'Digital Textbook Key Highlights:'}
              </div>
              <p style={{ color: '#cbd5e1', fontSize: 13, lineHeight: 1.6, margin: 0 }}>
                {book.summary}
              </p>
            </div>

            {/* Badges Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 10, marginBottom: 20 }}>
              <div style={{ background: '#1e293b', padding: '10px 14px', borderRadius: 12, textAlign: 'center', border: '1px solid #334155' }}>
                <div style={{ color: '#a5b4fc', fontSize: 11, fontWeight: 600 }}>অধ্যায় সংখ্যা</div>
                <div style={{ color: '#fff', fontSize: 16, fontWeight: 800, marginTop: 2 }}>{isBangla ? '৪০টি অধ্যায়' : '23 Chapters'}</div>
              </div>
              <div style={{ background: '#1e293b', padding: '10px 14px', borderRadius: 12, textAlign: 'center', border: '1px solid #334155' }}>
                <div style={{ color: '#6ee7b7', fontSize: 11, fontWeight: 600 }}>টপিক ও নিয়ম</div>
                <div style={{ color: '#fff', fontSize: 16, fontWeight: 800, marginTop: 2 }}>{isBangla ? '৮৫টি টপিক' : '133 Topics'}</div>
              </div>
              <div style={{ background: '#1e293b', padding: '10px 14px', borderRadius: 12, textAlign: 'center', border: '1px solid #334155' }}>
                <div style={{ color: '#fde047', fontSize: 11, fontWeight: 600 }}>বোর্ড প্রশ্ন MCQ</div>
                <div style={{ color: '#fff', fontSize: 16, fontWeight: 800, marginTop: 2 }}>{isBangla ? '২২৫টি প্রশ্ন' : '283 Questions'}</div>
              </div>
              <div style={{ background: '#1e293b', padding: '10px 14px', borderRadius: 12, textAlign: 'center', border: '1px solid #334155' }}>
                <div style={{ color: '#f472b6', fontSize: 11, fontWeight: 600 }}>মডেল টেস্ট</div>
                <div style={{ color: '#fff', fontSize: 16, fontWeight: 800, marginTop: 2 }}>{isBangla ? '৪০টি টেস্ট' : '8 Model Tests'}</div>
              </div>
            </div>

            {/* Checklist */}
            <div style={{ color: '#94a3b8', fontSize: 12, display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 20 }}>
              <div>✅ {isBangla ? 'প্রমিত ব্যাকরণ সূত্র, সংজ্ঞা ও বাস্তব জীবনের প্রয়োগ' : 'Formulas, standard grammar rules, and contextual examples'}</div>
              <div>✅ {isBangla ? 'অধ্যায়ভিত্তিক ও রেন্ডম কুইজ প্র্যাকটিস সিস্টেম' : 'Chapter-wise MCQ, timed quiz and interactive exams'}</div>
              <div>✅ {isBangla ? 'বুকমার্ক, টপিক প্রগ্রেস ট্র্যাকিং ও পারফরম্যান্স অ্যানালিটিক্স' : 'Live topic tracking, personal bookmarks and performance review'}</div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={() => {
                  onClose();
                  if (onOpenGrammar) onOpenGrammar(book.grammarSubject);
                }}
                style={{
                  flex: 1,
                  background: isBangla ? 'linear-gradient(135deg, #059669, #10b981)' : 'linear-gradient(135deg, #4f46e5, #6366f1)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 12,
                  padding: '12px 18px',
                  cursor: 'pointer',
                  fontWeight: 700,
                  fontSize: 14,
                  boxShadow: '0 4px 15px rgba(16,185,129,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8
                }}
              >
                <span>📖 সম্পূর্ণ ডিজিটাল পাঠ্যবই খুলুন</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(0,0,0,.9)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }} onClick={onClose}>
      <div style={{
        background: '#0f172a', borderRadius: 18, maxWidth: 560, width: '95%',
        overflow: 'hidden', boxShadow: '0 0 60px #6366f166',
      }} onClick={e => e.stopPropagation()}>
        {/* Modal header */}
        <div style={{ background: '#1e293b', padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ color: '#f1f5f9', fontWeight: 700, fontSize: 14 }}>{book.title}</div>
            <div style={{ color: '#64748b', fontSize: 12 }}>পৃষ্ঠা {page + 1}/{total} (প্রিভিউ)</div>
          </div>
          <button onClick={onClose} style={{ background: '#374151', color: '#94a3b8', border: 'none', borderRadius: 8, padding: '6px 14px', cursor: 'pointer', fontSize: 13 }}>✕</button>
        </div>
        {/* Page content */}
        <div style={{ padding: '20px', minHeight: 300, background: '#fff' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#1e293b', marginBottom: 16 }}>{book.title} — পৃষ্ঠা {page + 1}</div>
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} style={{ height: 14, background: i % 4 === 0 ? '#e2e8f0' : '#f1f5f9', borderRadius: 4, marginBottom: 8, width: i % 3 === 0 ? '70%' : '95%' }} />
          ))}
          {/* MANDATORY watermark footer on every page */}
          <div style={{
            marginTop: 20, borderTop: '2px solid #6366f1', paddingTop: 8,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            background: 'linear-gradient(90deg,#4f46e5,#7c3aed)',
            margin: '20px -20px -20px',
            padding: '8px 20px',
          }}>
            <div>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: 10 }}>{BRAND.name}</div>
              <div style={{ color: '#c7d2fe', fontSize: 9 }}>{BRAND.teacher} · {BRAND.phone}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ color: '#a5b4fc', fontSize: 9 }}>{BRAND.address}</div>
              <div style={{ color: '#c7d2fe', fontSize: 8 }}>পৃষ্ঠা {page + 1}/{total}</div>
            </div>
          </div>
        </div>
        {/* Nav */}
        <div style={{ padding: '14px 20px', display: 'flex', justifyContent: 'space-between', background: '#1e293b' }}>
          <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
            style={{ background: page === 0 ? '#334155' : '#6366f1', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 20px', cursor: page === 0 ? 'default' : 'pointer', fontWeight: 600, fontSize: 13 }}>
            ← আগের পৃষ্ঠা
          </button>
          <button onClick={() => setPage(p => Math.min(total - 1, p + 1))} disabled={page === total - 1}
            style={{ background: page === total - 1 ? '#334155' : '#6366f1', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 20px', cursor: page === total - 1 ? 'default' : 'pointer', fontWeight: 600, fontSize: 13 }}>
            পরের পৃষ্ঠা →
          </button>
        </div>
      </div>
    </div>
  );
}

function BookCard({ book, coins, onUnlock, unlocked, onReadGrammar }) {
  const coverRef = useRef(null);
  const [toast, setToast] = useState('');

  const downloadCover = async () => {
    if (!coverRef.current) return;
    try {
      const { exportBrandedGraphic } = await import('../../utils/exportBrandedGraphic');
      await exportBrandedGraphic(coverRef.current, {
        filename: `${book.title.slice(0, 20)}_NextGen_Cover`,
        format: 'png',
        quality: 0.95
      });
    } catch (err) {
      console.error('Failed to export book cover:', err);
    }
  };

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const handleUnlock = () => {
    if (coins < book.coinPrice) {
      showToast('❌ পর্যাপ্ত কয়েন নেই। আরও কয়েন অর্জন করুন।');
      return;
    }
    onUnlock(book);
  };

  return (
    <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 16, overflow: 'hidden', transition: 'transform .2s, box-shadow .2s' }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = `0 8px 30px ${book.coverColor}33`; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}>
      
      <div style={{ position: 'relative' }}>
        <BookCover book={book} coverRef={coverRef} />
        <button onClick={downloadCover} title="কভার ডাউনলোড করুন"
          style={{ position: 'absolute', top: 8, left: 8, background: 'rgba(0,0,0,.6)', color: '#fff', border: 'none', borderRadius: 6, width: 28, height: 28, cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          📥
        </button>
      </div>

      <div style={{ padding: '16px 18px' }}>
        <div style={{ marginBottom: 8 }}>
          <Stars rating={book.rating} />
          <span style={{ color: '#64748b', fontSize: 12, marginLeft: 8 }}>{book.pages} পৃষ্ঠা</span>
        </div>
        <div style={{ color: '#f1f5f9', fontWeight: 700, fontSize: 14, marginBottom: 12, lineHeight: 1.4 }}>{book.title}</div>
        
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button onClick={() => onUnlock(book, true)}
            style={{ flex: 1, background: '#1e293b', color: '#94a3b8', border: '1px solid #334155', borderRadius: 8, padding: '8px 12px', cursor: 'pointer', fontWeight: 600, fontSize: 12 }}>
            👁️ প্রিভিউ
          </button>
          {book.isInteractiveGrammar ? (
            <button
              onClick={() => onReadGrammar(book.grammarSubject)}
              style={{
                flex: 1.2,
                background: book.grammarSubject === 'BANGLA' ? 'linear-gradient(135deg, #059669, #10b981)' : 'linear-gradient(135deg, #4f46e5, #6366f1)',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                padding: '8px 12px',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: 12,
                boxShadow: '0 0 12px rgba(99,102,241,0.3)'
              }}
            >
              📖 অনলাইনে পড়ুন
            </button>
          ) : book.coinPrice === 0 ? (
            <button style={{ flex: 1, background: '#14532d', color: '#86efac', border: 'none', borderRadius: 8, padding: '8px 12px', cursor: 'pointer', fontWeight: 700, fontSize: 12 }}>
              ⬇️ ফ্রি ডাউনলোড
            </button>
          ) : unlocked ? (
            <button style={{ flex: 1, background: '#14532d', color: '#86efac', border: 'none', borderRadius: 8, padding: '8px 12px', cursor: 'pointer', fontWeight: 700, fontSize: 12 }}>
              ✅ আনলক হয়েছে
            </button>
          ) : (
            <button onClick={handleUnlock}
              style={{ flex: 1, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 12px', cursor: 'pointer', fontWeight: 700, fontSize: 12, boxShadow: '0 0 12px #6366f144' }}>
              🔓 {book.coinPrice} 🪙
            </button>
          )}
        </div>
        {toast && <div style={{ marginTop: 8, color: '#f87171', fontSize: 12, padding: '4px 0' }}>{toast}</div>}
      </div>
    </div>
  );
}

export default function DigitalBookStore({ onOpenGrammar }) {
  const [filter, setFilter] = useState('ALL');
  const [previewBook, setPreviewBook] = useState(null);
  const [readingGrammarSubject, setReadingGrammarSubject] = useState(null);
  const [coins, setCoins] = useState(0);
  const [unlocked, setUnlocked] = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem('nextgen_unlocked_books') || '[]')); } catch { return new Set(); }
  });

  useEffect(() => {
    studentAPI.getCoins().then(res => { if (res.success) setCoins(res.data?.balance || 0); }).catch(() => {});
  }, []);

  const handleReadGrammar = (grammarSubject) => {
    if (onOpenGrammar) {
      onOpenGrammar(grammarSubject);
    } else {
      setReadingGrammarSubject(grammarSubject);
    }
  };

  const handleUnlock = async (book, previewOnly = false) => {
    if (book.isInteractiveGrammar) {
      if (previewOnly) {
        setPreviewBook(book);
      } else {
        handleReadGrammar(book.grammarSubject);
      }
      return;
    }
    if (previewOnly) { setPreviewBook(book); return; }
    if (book.coinPrice === 0 || unlocked.has(book.id)) { setPreviewBook(book); return; }
    try {
      const res = await studentAPI.buyReward({ itemId: book.id, itemTitle: book.title, coinCost: book.coinPrice });
      if (res.success) {
        setCoins(c => c - book.coinPrice);
        const next = new Set(unlocked);
        next.add(book.id);
        setUnlocked(next);
        localStorage.setItem('nextgen_unlocked_books', JSON.stringify([...next]));
        setPreviewBook(book);
      }
    } catch (e) {
      console.warn('unlock failed', e);
    }
  };

  const filtered = filter === 'ALL' ? CATALOG : CATALOG.filter(b => b.category === filter);

  return (
    <div style={{ fontFamily: "'Hind Siliguri', sans-serif", color: '#e2e8f0' }}>
      {previewBook && (
        <PreviewModal
          book={previewBook}
          onClose={() => setPreviewBook(null)}
          onOpenGrammar={handleReadGrammar}
        />
      )}

      {/* Full-Screen Interactive Grammar E-Book Modal */}
      {readingGrammarSubject && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 99999,
          background: 'rgba(15, 23, 42, 0.95)',
          backdropFilter: 'blur(8px)',
          display: 'flex', flexDirection: 'column',
          padding: '12px'
        }}>
          <div style={{
            background: '#0f172a',
            border: '1px solid #334155',
            borderRadius: 20,
            overflow: 'hidden',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
          }}>
            <div style={{
              padding: '12px 20px',
              background: '#1e293b',
              borderBottom: '1px solid #334155',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 22 }}>📖</span>
                <div>
                  <h3 style={{ margin: 0, color: '#f8fafc', fontWeight: 800, fontSize: 15 }}>
                    {readingGrammarSubject === 'BANGLA'
                      ? 'বাংলা ব্যাকরণ ও নির্মিতি — সম্পূর্ণ ডিজিটাল পাঠ্যবই (৪০টি অধ্যায়)'
                      : 'Complete English Grammar & Composition — Digital Textbook (23 Chapters)'}
                  </h3>
                  <span style={{ color: '#94a3b8', fontSize: 11 }}>
                    জাতীয় শিক্ষাক্রম ও পাঠ্যপুস্তক বোর্ড (NCTB) প্রমিত কারিকুলাম সংস্করণ ২০২৬
                  </span>
                </div>
              </div>
              <button
                onClick={() => setReadingGrammarSubject(null)}
                style={{
                  background: '#ef4444',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 10,
                  padding: '8px 16px',
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: 'pointer'
                }}
              >
                ✕ বন্ধ করুন (Close)
              </button>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', background: '#020617', padding: '12px' }}>
              <InteractiveGrammarBook initialSubject={readingGrammarSubject} />
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg,#1e1b4b,#0f172a)', borderRadius: 16, padding: '22px 28px', marginBottom: 24, border: '1px solid #312e81', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ margin: 0, color: '#a5b4fc', fontWeight: 800, fontSize: 22 }}>📚 ডিজিটাল বুক স্টোর ও স্টাডি ম্যাটেরিয়াল হাব</h2>
          <p style={{ margin: '6px 0 0', color: '#4f46e5', fontSize: 13 }}>
            {BRAND.name} — {BRAND.teacher} স্যারের কিউরেটেড রিসোর্স কালেকশন
          </p>
        </div>
        <div style={{ background: '#312e81', borderRadius: 10, padding: '8px 18px', textAlign: 'center' }}>
          <div style={{ color: '#fbbf24', fontWeight: 800, fontSize: 20 }}>{coins} 🪙</div>
          <div style={{ color: '#94a3b8', fontSize: 11 }}>আপনার কয়েন</div>
        </div>
      </div>

      {/* Category Filter */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 24 }}>
        {Object.entries(CAT_LABELS).map(([key, label]) => (
          <button key={key} onClick={() => setFilter(key)}
            style={{
              padding: '8px 18px', borderRadius: 20, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 13,
              background: filter === key ? '#6366f1' : '#1e293b',
              color: filter === key ? '#fff' : '#94a3b8',
              boxShadow: filter === key ? '0 0 12px #6366f188' : 'none',
            }}>
            {label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 20 }}>
        {filtered.map(book => (
          <BookCard
            key={book.id}
            book={book}
            coins={coins}
            onUnlock={handleUnlock}
            unlocked={unlocked.has(book.id)}
            onReadGrammar={handleReadGrammar}
          />
        ))}
      </div>

      {/* Branding Footer */}
      <div style={{ marginTop: 40, padding: '16px 24px', background: 'linear-gradient(90deg,#1e1b4b,#0f172a)', borderRadius: 12, textAlign: 'center', border: '1px solid #312e81' }}>
        <div style={{ color: '#6366f1', fontWeight: 800, fontSize: 14 }}>{BRAND.name}</div>
        <div style={{ color: '#64748b', fontSize: 12, marginTop: 4 }}>
          {BRAND.teacher} · {BRAND.phone} · {BRAND.address}
        </div>
        <div style={{ color: '#312e81', fontSize: 11, marginTop: 2 }}>{BRAND.tagline}</div>
      </div>
    </div>
  );
}
