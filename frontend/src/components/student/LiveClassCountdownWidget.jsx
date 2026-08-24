import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';

const BRAND = {
  name: 'NextGen Academy',
  teacher: 'মো: আলমগীর হোসেন (সাগর)',
  phone: '০১৭৯২৮১৮০০৫',
  address: 'পশ্চিম জয়দেবপুর, বাস-স্ট্যান্ড, গাজীপুর',
};

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function request(endpoint, options = {}) {
  const token = localStorage.getItem('nextgen_token');
  const headers = { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...options.headers };
  return fetch(`${API_BASE}${endpoint}`, { ...options, headers }).then(r => r.json());
}

function formatCountdown(ms) {
  if (ms <= 0) return '00:00:00';
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
}

function LiveClassCard({ cls }) {
  const [msLeft, setMsLeft] = useState(() => cls.msLeft);

  useEffect(() => {
    setMsLeft(cls.msLeft);
    const iv = setInterval(() => setMsLeft(prev => Math.max(0, prev - 1000)), 1000);
    return () => clearInterval(iv);
  }, [cls.msLeft]);

  const isLive = msLeft <= 0;
  const isIminent = msLeft > 0 && msLeft < 5 * 60 * 1000;
  const subjectColors = {
    'পদার্থবিজ্ঞান': '#3b82f6', 'রসায়ন': '#10b981', 'উচ্চতর গণিত': '#8b5cf6',
    'সাধারণ গণিত': '#6366f1', 'জীববিজ্ঞান': '#f59e0b', 'ইংরেজি': '#ef4444',
  };
  const subColor = subjectColors[cls.subject] || '#6366f1';

  return (
    <div style={{
      background: '#0f172a',
      border: isLive ? '2px solid #10b981' : '1px solid #1e293b',
      borderRadius: 16,
      padding: '20px 24px',
      marginBottom: 16,
      boxShadow: isLive ? '0 0 24px #10b98133' : 'none',
      transition: 'box-shadow .3s',
    }}>
      <style>{`
        @keyframes livePulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
          50% { box-shadow: 0 0 0 14px rgba(239, 68, 68, 0); }
        }
        @keyframes greenPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
          50% { box-shadow: 0 0 0 14px rgba(16, 185, 129, 0); }
        }
      `}</style>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ flex: 1 }}>
          <span style={{ background: subColor + '22', color: subColor, borderRadius: 6, padding: '3px 10px', fontSize: 11, fontWeight: 700, marginBottom: 8, display: 'inline-block' }}>
            📚 {cls.subject}
          </span>
          <div style={{ color: '#f1f5f9', fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{cls.title}</div>
          <div style={{ color: '#64748b', fontSize: 13 }}>
            🏫 {cls.className} · ⏰ {new Date(cls.scheduledAt).toLocaleString('bn-BD', { weekday: 'short', hour: '2-digit', minute: '2-digit' })}
          </div>
          {isIminent && (
            <div style={{ color: '#f59e0b', fontWeight: 700, fontSize: 13, marginTop: 6 }}>
              ⚠️ মাত্র {Math.ceil(msLeft / 60000)} মিনিট বাকি!
            </div>
          )}
        </div>
        <div style={{ textAlign: 'center', flexShrink: 0 }}>
          {isLive ? (
            <a href={cls.meetingLink || '#'} target="_blank" rel="noopener noreferrer"
              style={{
                display: 'inline-block', background: 'linear-gradient(135deg,#10b981,#059669)',
                color: '#fff', fontWeight: 800, fontSize: 15, padding: '12px 24px', borderRadius: 12,
                textDecoration: 'none', animation: 'greenPulse 1.5s infinite',
              }}>
              🔴 ক্লাসে যোগ দিন
            </a>
          ) : (
            <div>
              <div style={{ color: '#94a3b8', fontSize: 12, marginBottom: 4 }}>ক্লাস শুরু হবে</div>
              <div style={{
                fontFamily: 'monospace', fontSize: 28, fontWeight: 800,
                color: isIminent ? '#f59e0b' : '#6366f1',
                textShadow: isIminent ? '0 0 12px #f59e0b66' : '0 0 12px #6366f166',
              }}>
                {formatCountdown(msLeft)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function LiveClassCountdownWidget() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', subject: '', className: '', scheduledAt: '', meetingLink: '' });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const fetchClasses = useCallback(async () => {
    try {
      const res = await request('/live-classes/upcoming-scheduled');
      if (res.success) setClasses(res.data || []);
    } catch { setClasses([]); }
    setLoading(false);
  }, []);

  useEffect(() => { fetchClasses(); }, [fetchClasses]);

  const handleSchedule = async () => {
    if (!form.title || !form.scheduledAt) return;
    setSaving(true);
    try {
      const res = await request('/live-classes', {
        method: 'POST',
        body: JSON.stringify({ ...form, status: 'SCHEDULED' }),
      });
      if (res.success) {
        setMsg('✅ লাইভ ক্লাস সফলভাবে নির্ধারণ করা হয়েছে!');
        setForm({ title: '', subject: '', className: '', scheduledAt: '', meetingLink: '' });
        setShowForm(false);
        fetchClasses();
      }
    } catch { setMsg('❌ সংরক্ষণ ব্যর্থ হয়েছে।'); }
    setSaving(false);
    setTimeout(() => setMsg(''), 4000);
  };

  const inputStyle = {
    width: '100%', background: '#1e293b', border: '1px solid #334155', borderRadius: 10,
    padding: '10px 14px', color: '#e2e8f0', fontSize: 14, outline: 'none', boxSizing: 'border-box',
  };
  const labelStyle = { display: 'block', color: '#94a3b8', fontSize: 12, fontWeight: 700, marginBottom: 5, textTransform: 'uppercase', letterSpacing: 1 };

  return (
    <div style={{ fontFamily: "'Hind Siliguri', sans-serif", color: '#e2e8f0' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg,#0f172a,#1e1b4b)', borderRadius: 16, padding: '22px 28px', marginBottom: 24, border: '1px solid #312e81' }}>
        <h2 style={{ margin: 0, color: '#a5b4fc', fontWeight: 800, fontSize: 22 }}>📡 লাইভ ক্লাসরুম সিস্টেম</h2>
        <p style={{ margin: '6px 0 0', color: '#4f46e5', fontSize: 13 }}>
          {BRAND.name} · {BRAND.teacher} স্যার · {BRAND.phone}
        </p>
      </div>

      {/* Admin Schedule Form */}
      {isAdmin && (
        <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 16, padding: '20px 24px', marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: showForm ? 20 : 0 }}>
            <h3 style={{ margin: 0, color: '#f1f5f9', fontWeight: 700, fontSize: 16 }}>📋 লাইভ ক্লাস শিডিউল করুন (Admin)</h3>
            <button onClick={() => setShowForm(f => !f)}
              style={{ background: '#6366f1', color: '#fff', border: 'none', borderRadius: 10, padding: '8px 18px', cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>
              {showForm ? '✕ বন্ধ করুন' : '+ নতুন ক্লাস যোগ করুন'}
            </button>
          </div>
          {showForm && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div style={{ gridColumn: '1/-1' }}>
                <label style={labelStyle}>ক্লাসের শিরোনাম *</label>
                <input style={inputStyle} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="যেমন: পদার্থবিজ্ঞান — নিউটনের গতিসূত্র (লাইভ প্রশ্নোত্তর)" />
              </div>
              <div>
                <label style={labelStyle}>বিষয়</label>
                <input style={inputStyle} value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} placeholder="পদার্থবিজ্ঞান" />
              </div>
              <div>
                <label style={labelStyle}>শ্রেণি/সেকশন</label>
                <input style={inputStyle} value={form.className} onChange={e => setForm(f => ({ ...f, className: e.target.value }))} placeholder="SSC ২০২৬" />
              </div>
              <div>
                <label style={labelStyle}>তারিখ ও সময় *</label>
                <input type="datetime-local" style={inputStyle} value={form.scheduledAt} onChange={e => setForm(f => ({ ...f, scheduledAt: e.target.value }))} />
              </div>
              <div>
                <label style={labelStyle}>মিটিং লিঙ্ক (Zoom/Meet)</label>
                <input style={inputStyle} value={form.meetingLink} onChange={e => setForm(f => ({ ...f, meetingLink: e.target.value }))} placeholder="https://meet.google.com/..." />
              </div>
              <div style={{ gridColumn: '1/-1' }}>
                <button onClick={handleSchedule} disabled={saving}
                  style={{ background: '#10b981', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 24px', cursor: 'pointer', fontWeight: 700, fontSize: 14 }}>
                  {saving ? '⏳ সংরক্ষণ হচ্ছে...' : '📅 ক্লাস শিডিউল করুন'}
                </button>
                {msg && <span style={{ marginLeft: 14, color: msg.startsWith('✅') ? '#4ade80' : '#f87171', fontSize: 13 }}>{msg}</span>}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Class List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 40, color: '#6366f1' }}>⏳ লোড হচ্ছে...</div>
      ) : classes.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 40, color: '#475569' }}>
          📅 কোনো আসন্ন লাইভ ক্লাস নেই।
        </div>
      ) : (
        classes.map(cls => <LiveClassCard key={cls.id} cls={cls} />)
      )}
    </div>
  );
}
