import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { studentAPI } from '../../services/api';


const BRAND = {
  name: 'NextGen Academy',
  teacher: 'মো: আলমগীর হোসেন (সাগর)',
  phone: '০১৭৯২৮১৮০০৫',
  address: 'পশ্চিম জয়দেবপুর, বাস-স্ট্যান্ড, গাজীপুর',
  tagline: 'LEARN · GROW · SUCCEED',
};

const CATALOG = [
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

function PreviewModal({ book, onClose }) {
  const [page, setPage] = useState(0);
  const total = Math.min(book.previewPages, 5);

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

function BookCard({ book, coins, onUnlock, unlocked }) {
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
          {book.coinPrice === 0 ? (
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

export default function DigitalBookStore() {
  const [filter, setFilter] = useState('ALL');
  const [previewBook, setPreviewBook] = useState(null);
  const [coins, setCoins] = useState(0);
  const [unlocked, setUnlocked] = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem('nextgen_unlocked_books') || '[]')); } catch { return new Set(); }
  });

  useEffect(() => {
    studentAPI.getCoins().then(res => { if (res.success) setCoins(res.data?.balance || 0); }).catch(() => {});
  }, []);

  const handleUnlock = async (book, previewOnly = false) => {
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
      {previewBook && <PreviewModal book={previewBook} onClose={() => setPreviewBook(null)} />}

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
          <BookCard key={book.id} book={book} coins={coins} onUnlock={handleUnlock} unlocked={unlocked.has(book.id)} />
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
