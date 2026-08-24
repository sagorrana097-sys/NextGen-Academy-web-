import React, { useState, useEffect, useRef } from 'react';
import { gamificationCmsAPI } from '../../services/api';

// ─── Branding constants ───────────────────────────────────────────────────────
const BRAND = {
  name: 'NextGen Academy',
  teacher: 'মো: আলমগীর হোসেন (সাগর)',
  phone: '০১৭৯২৮১৮০০৫',
  address: 'পশ্চিম জয়দেবপুর, বাস-স্ট্যান্ড, গাজীপুর',
  tagline: 'LEARN · GROW · SUCCEED',
};

// ─── Shared styles ────────────────────────────────────────────────────────────
const S = {
  pill: (active) => ({
    padding: '8px 18px',
    borderRadius: 20,
    border: 'none',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: 13,
    transition: 'all .2s',
    background: active ? '#6366f1' : '#1e293b',
    color: active ? '#fff' : '#94a3b8',
    boxShadow: active ? '0 0 14px #6366f188' : 'none',
  }),
  card: {
    background: '#0f172a',
    border: '1px solid #1e293b',
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    background: '#1e293b',
    border: '1px solid #334155',
    borderRadius: 10,
    padding: '10px 14px',
    color: '#e2e8f0',
    fontSize: 14,
    outline: 'none',
    boxSizing: 'border-box',
  },
  label: {
    display: 'block',
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: 600,
    marginBottom: 5,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  btn: (color = '#6366f1') => ({
    padding: '9px 20px',
    background: color,
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    cursor: 'pointer',
    fontWeight: 700,
    fontSize: 13,
  }),
  sectionTitle: {
    color: '#f1f5f9',
    fontWeight: 700,
    fontSize: 17,
    marginBottom: 16,
    paddingBottom: 10,
    borderBottom: '1px solid #1e293b',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    background: '#1e293b',
    color: '#94a3b8',
    fontSize: 12,
    padding: '10px 12px',
    textAlign: 'left',
    fontWeight: 700,
    letterSpacing: 0.5,
  },
  td: {
    borderBottom: '1px solid #1e293b',
    color: '#e2e8f0',
    fontSize: 13,
    padding: '10px 12px',
    verticalAlign: 'middle',
  },
};

// ─── Watermark Preview Card ────────────────────────────────────────────────────
function WatermarkPreview({ title = 'ফর্মুলা / নোট কার্ড' }) {
  return (
    <div style={{
      background: 'linear-gradient(135deg,#0f172a 60%,#1e1b4b)',
      border: '2px solid #6366f1',
      borderRadius: 14,
      overflow: 'hidden',
      maxWidth: 380,
    }}>
      {/* header */}
      <div style={{ background: '#4f46e5', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 20 }}>🎓</span>
        <div>
          <div style={{ color: '#fff', fontWeight: 800, fontSize: 15 }}>{BRAND.name}</div>
          <div style={{ color: '#c7d2fe', fontSize: 11 }}>{BRAND.tagline}</div>
        </div>
      </div>
      {/* body */}
      <div style={{ padding: '16px 18px' }}>
        <div style={{ color: '#c7d2fe', fontSize: 12, marginBottom: 6 }}>📘 {title}</div>
        <div style={{
          background: '#1e293b',
          borderRadius: 10,
          padding: '12px 16px',
          color: '#94a3b8',
          fontSize: 12,
          fontStyle: 'italic',
          minHeight: 48,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          [ গ্রাফিক / ফর্মুলা এখানে রেন্ডার হবে ]
        </div>
      </div>
      {/* footer watermark */}
      <div style={{
        background: 'linear-gradient(90deg,#4f46e5,#7c3aed)',
        padding: '8px 16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 4,
      }}>
        <div>
          <div style={{ color: '#fff', fontWeight: 700, fontSize: 11 }}>{BRAND.teacher}</div>
          <div style={{ color: '#c7d2fe', fontSize: 10 }}>{BRAND.phone}</div>
        </div>
        <div style={{ color: '#a5b4fc', fontSize: 10, textAlign: 'right' }}>{BRAND.address}</div>
      </div>
    </div>
  );
}

// ─── TAB: Reward Settings ──────────────────────────────────────────────────────
function RewardSettingsTab({ config, onSaved }) {
  const [form, setForm] = useState({
    dailyLoginReward: config.dailyLoginReward ?? 10,
    mcqWinReward: config.mcqWinReward ?? 50,
    quizParticipationReward: config.quizParticipationReward ?? 5,
    streakBonus7Days: config.streakBonus7Days ?? 50,
  });
  const [rewardItems, setRewardItems] = useState(config.rewardStoreItems || []);
  const [newItem, setNewItem] = useState({ titleBn: '', category: 'SPECIAL_NOTES', price: '', badge: 'নতুন', description: '', downloadUrl: '' });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const saveSettings = async () => {
    setSaving(true);
    try {
      const res = await gamificationCmsAPI.updateSettings(form);
      setMsg(res.message || 'সংরক্ষিত হয়েছে ✓');
      onSaved?.();
    } catch (e) {
      setMsg('❌ সংরক্ষণ ব্যর্থ হয়েছে');
    }
    setSaving(false);
    setTimeout(() => setMsg(''), 3000);
  };

  const addItem = async () => {
    if (!newItem.titleBn || !newItem.price) return;
    const res = await gamificationCmsAPI.addReward(newItem);
    if (res.success) {
      setRewardItems(prev => [res.data, ...prev]);
      setNewItem({ titleBn: '', category: 'SPECIAL_NOTES', price: '', badge: 'নতুন', description: '', downloadUrl: '' });
    }
  };

  const deleteItem = async (id) => {
    await gamificationCmsAPI.deleteReward(id);
    setRewardItems(prev => prev.filter(i => i.id !== id));
  };

  const Field = ({ label, field, type = 'number' }) => (
    <div>
      <label style={S.label}>{label}</label>
      <input
        type={type}
        value={form[field]}
        onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
        style={{ ...S.input, width: 100 }}
      />
    </div>
  );

  return (
    <div>
      {/* Coin Rules */}
      <div style={S.card}>
        <div style={S.sectionTitle}>🪙 কয়েন রিওয়ার্ড নিয়মাবলী</div>
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', marginBottom: 16 }}>
          <Field label="দৈনিক লগইন (+কয়েন)" field="dailyLoginReward" />
          <Field label="MCQ ব্যাটেল জয় (+কয়েন)" field="mcqWinReward" />
          <Field label="কুইজ অংশগ্রহণ (+কয়েন)" field="quizParticipationReward" />
          <Field label="৭-দিনের স্ট্রিক বোনাস" field="streakBonus7Days" />
        </div>
        <button style={S.btn()} onClick={saveSettings} disabled={saving}>
          {saving ? '⏳ সংরক্ষণ হচ্ছে...' : '💾 সেটিংস সংরক্ষণ করুন'}
        </button>
        {msg && <div style={{ marginTop: 10, color: '#4ade80', fontSize: 13 }}>{msg}</div>}
      </div>

      {/* Reward Store CRUD */}
      <div style={S.card}>
        <div style={S.sectionTitle}>🛒 রিওয়ার্ড স্টোর আইটেম ম্যানেজার</div>
        {/* Add Form */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
          <div>
            <label style={S.label}>আইটেমের নাম (বাংলা) *</label>
            <input style={S.input} value={newItem.titleBn} onChange={e => setNewItem(f => ({ ...f, titleBn: e.target.value }))} placeholder="যেমন: স্পেশাল ফিজিক্স হ্যান্ডনোট" />
          </div>
          <div>
            <label style={S.label}>ক্যাটাগরি</label>
            <select style={S.input} value={newItem.category} onChange={e => setNewItem(f => ({ ...f, category: e.target.value }))}>
              <option value="SPECIAL_NOTES">Special Notes</option>
              <option value="MODEL_TESTS">Model Tests</option>
              <option value="BOOSTER">Booster Pack</option>
              <option value="VIDEO_ACCESS">Video Access</option>
            </select>
          </div>
          <div>
            <label style={S.label}>কয়েন মূল্য *</label>
            <input type="number" style={S.input} value={newItem.price} onChange={e => setNewItem(f => ({ ...f, price: e.target.value }))} placeholder="500" />
          </div>
          <div>
            <label style={S.label}>ব্যাজ লেবেল</label>
            <input style={S.input} value={newItem.badge} onChange={e => setNewItem(f => ({ ...f, badge: e.target.value }))} placeholder="নতুন / সেরা / প্রিমিয়াম" />
          </div>
          <div style={{ gridColumn: '1/-1' }}>
            <label style={S.label}>বিবরণ</label>
            <input style={S.input} value={newItem.description} onChange={e => setNewItem(f => ({ ...f, description: e.target.value }))} placeholder="এই আইটেম সম্পর্কে সংক্ষিপ্ত বিবরণ..." />
          </div>
          <div style={{ gridColumn: '1/-1' }}>
            <label style={S.label}>ডাউনলোড URL (ঐচ্ছিক)</label>
            <input style={S.input} value={newItem.downloadUrl} onChange={e => setNewItem(f => ({ ...f, downloadUrl: e.target.value }))} placeholder="https://..." />
          </div>
        </div>
        <button style={S.btn('#10b981')} onClick={addItem}>➕ আইটেম যোগ করুন</button>

        {/* Table */}
        <div style={{ overflowX: 'auto', marginTop: 20 }}>
          <table style={S.table}>
            <thead>
              <tr>
                {['আইটেম নাম', 'ক্যাটাগরি', 'মূল্য (🪙)', 'ব্যাজ', 'মুছুন'].map(h => <th key={h} style={S.th}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {rewardItems.map(item => (
                <tr key={item.id}>
                  <td style={S.td}>{item.titleBn}</td>
                  <td style={S.td}><span style={{ background: '#1e3a5f', color: '#93c5fd', borderRadius: 6, padding: '2px 8px', fontSize: 11 }}>{item.category}</span></td>
                  <td style={S.td}><strong style={{ color: '#fbbf24' }}>{item.price} 🪙</strong></td>
                  <td style={S.td}>{item.badge}</td>
                  <td style={S.td}>
                    <button onClick={() => deleteItem(item.id)} style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 10px', cursor: 'pointer', fontSize: 12 }}>🗑️ মুছুন</button>
                  </td>
                </tr>
              ))}
              {rewardItems.length === 0 && (
                <tr><td colSpan={5} style={{ ...S.td, textAlign: 'center', color: '#475569' }}>কোনো আইটেম নেই।</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── TAB: Formula Vault CMS ────────────────────────────────────────────────────
function FormulaVaultTab({ config }) {
  const [formulas, setFormulas] = useState(config.formulas || []);
  const [form, setForm] = useState({ subject: 'PHYSICS', subjectBn: 'পদার্থবিজ্ঞান', topic: '', titleBn: '', latex: '', explanation: '' });

  const addFormula = async () => {
    if (!form.titleBn || !form.latex) return;
    const res = await gamificationCmsAPI.addFormula(form);
    if (res.success) {
      setFormulas(prev => [res.data, ...prev]);
      setForm({ subject: 'PHYSICS', subjectBn: 'পদার্থবিজ্ঞান', topic: '', titleBn: '', latex: '', explanation: '' });
    }
  };

  const deleteFormula = async (id) => {
    await gamificationCmsAPI.deleteFormula(id);
    setFormulas(prev => prev.filter(f => f.id !== id));
  };

  return (
    <div>
      <div style={S.card}>
        <div style={S.sectionTitle}>➕ নতুন ফর্মুলা যোগ করুন</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
          <div>
            <label style={S.label}>বিষয় (বাংলা) *</label>
            <input style={S.input} value={form.subjectBn} onChange={e => setForm(f => ({ ...f, subjectBn: e.target.value }))} placeholder="পদার্থবিজ্ঞান" />
          </div>
          <div>
            <label style={S.label}>টপিক</label>
            <input style={S.input} value={form.topic} onChange={e => setForm(f => ({ ...f, topic: e.target.value }))} placeholder="গতিবিদ্যা (Kinematics)" />
          </div>
          <div style={{ gridColumn: '1/-1' }}>
            <label style={S.label}>ফর্মুলার শিরোনাম (বাংলা) *</label>
            <input style={S.input} value={form.titleBn} onChange={e => setForm(f => ({ ...f, titleBn: e.target.value }))} placeholder="গতির মৌলিক সমীকরণসমূহ" />
          </div>
          <div style={{ gridColumn: '1/-1' }}>
            <label style={S.label}>LaTeX ফর্মুলা কোড *</label>
            <input style={{ ...S.input, fontFamily: 'monospace' }} value={form.latex} onChange={e => setForm(f => ({ ...f, latex: e.target.value }))} placeholder="v = u + at \qquad s = ut + \frac{1}{2}at^2" />
            {form.latex && (
              <div style={{ marginTop: 8, padding: '8px 12px', background: '#1e293b', borderRadius: 8, color: '#a5b4fc', fontFamily: 'monospace', fontSize: 12 }}>
                📐 LaTeX: <code>{form.latex}</code>
              </div>
            )}
          </div>
          <div style={{ gridColumn: '1/-1' }}>
            <label style={S.label}>ব্যাখ্যা</label>
            <input style={S.input} value={form.explanation} onChange={e => setForm(f => ({ ...f, explanation: e.target.value }))} placeholder="সূত্রটির ব্যাখ্যা ও প্রয়োগ..." />
          </div>
        </div>
        <button style={S.btn('#6366f1')} onClick={addFormula}>➕ ফর্মুলা যোগ করুন</button>
      </div>

      {/* Watermark Preview */}
      <div style={S.card}>
        <div style={S.sectionTitle}>🖼️ ওয়াটারমার্ক প্রিভিউ (ডাউনলোড গ্রাফিক)</div>
        <p style={{ color: '#64748b', fontSize: 13, marginBottom: 16 }}>
          প্রতিটি ফর্মুলা কার্ড ডাউনলোড করলে নিচের ব্র্যান্ডিং অটোমেটিক্যালি যুক্ত হবে:
        </p>
        <WatermarkPreview title={form.titleBn || 'ফর্মুলা কার্ড'} />
      </div>

      {/* Formula List */}
      <div style={S.card}>
        <div style={S.sectionTitle}>📚 বিদ্যমান ফর্মুলাসমূহ ({formulas.length}টি)</div>
        <div style={{ overflowX: 'auto' }}>
          <table style={S.table}>
            <thead>
              <tr>
                {['বিষয়', 'শিরোনাম', 'LaTeX', 'মুছুন'].map(h => <th key={h} style={S.th}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {formulas.map(f => (
                <tr key={f.id}>
                  <td style={S.td}><span style={{ background: '#1e3a5f', color: '#93c5fd', borderRadius: 6, padding: '2px 8px', fontSize: 11 }}>{f.subjectBn}</span></td>
                  <td style={S.td}>{f.titleBn}</td>
                  <td style={{ ...S.td, fontFamily: 'monospace', fontSize: 11, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>{f.latex}</td>
                  <td style={S.td}>
                    <button onClick={() => deleteFormula(f.id)} style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 10px', cursor: 'pointer', fontSize: 12 }}>🗑️</button>
                  </td>
                </tr>
              ))}
              {formulas.length === 0 && <tr><td colSpan={4} style={{ ...S.td, textAlign: 'center', color: '#475569' }}>কোনো ফর্মুলা নেই।</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── TAB: Live Battle MCQ Manager ─────────────────────────────────────────────
function LiveBattleTab({ config }) {
  const [questions, setQuestions] = useState(config.battleQuestions || []);
  const blank = { subject: 'পদার্থবিজ্ঞান', question: '', optionA: '', optionB: '', optionC: '', optionD: '', correctIndex: 0, timeLimit: 30, explanation: '' };
  const [form, setForm] = useState(blank);

  const addQ = async () => {
    if (!form.question || !form.optionA || !form.optionB) return;
    const res = await gamificationCmsAPI.addBattleQuestion(form);
    if (res.success) {
      setQuestions(prev => [res.data, ...prev]);
      setForm(blank);
    }
  };

  const deleteQ = async (id) => {
    await gamificationCmsAPI.deleteBattleQuestion(id);
    setQuestions(prev => prev.filter(q => q.id !== id));
  };

  const optLabels = ['A', 'B', 'C', 'D'];

  return (
    <div>
      <div style={S.card}>
        <div style={S.sectionTitle}>➕ নতুন ১v১ ব্যাটেল প্রশ্ন যোগ করুন</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
          <div>
            <label style={S.label}>বিষয়</label>
            <select style={S.input} value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}>
              {['পদার্থবিজ্ঞান', 'রসায়ন', 'জীববিজ্ঞান', 'উচ্চতর গণিত', 'সাধারণ বিজ্ঞান', 'বাংলা', 'ইংরেজি'].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label style={S.label}>সময়সীমা (সেকেন্ড)</label>
            <input type="number" style={S.input} value={form.timeLimit} onChange={e => setForm(f => ({ ...f, timeLimit: e.target.value }))} />
          </div>
          <div style={{ gridColumn: '1/-1' }}>
            <label style={S.label}>প্রশ্ন *</label>
            <textarea style={{ ...S.input, minHeight: 70, resize: 'vertical' }} value={form.question} onChange={e => setForm(f => ({ ...f, question: e.target.value }))} placeholder="MCQ প্রশ্নটি লিখুন..." />
          </div>
          {['optionA', 'optionB', 'optionC', 'optionD'].map((opt, i) => (
            <div key={opt}>
              <label style={S.label}>অপশন {optLabels[i]} {i < 2 ? '*' : ''}</label>
              <input style={S.input} value={form[opt]} onChange={e => setForm(f => ({ ...f, [opt]: e.target.value }))} placeholder={`অপশন ${optLabels[i]}`} />
            </div>
          ))}
          <div>
            <label style={S.label}>সঠিক উত্তর</label>
            <select style={S.input} value={form.correctIndex} onChange={e => setForm(f => ({ ...f, correctIndex: Number(e.target.value) }))}>
              {optLabels.map((l, i) => <option key={i} value={i}>অপশন {l}</option>)}
            </select>
          </div>
          <div>
            <label style={S.label}>ব্যাখ্যা (ঐচ্ছিক)</label>
            <input style={S.input} value={form.explanation} onChange={e => setForm(f => ({ ...f, explanation: e.target.value }))} placeholder="উত্তরের ব্যাখ্যা..." />
          </div>
        </div>
        <button style={S.btn('#f59e0b')} onClick={addQ}>➕ প্রশ্ন যোগ করুন</button>
      </div>

      {/* Questions Table */}
      <div style={S.card}>
        <div style={S.sectionTitle}>⚔️ প্রশ্ন ব্যাংক ({questions.length}টি)</div>
        <div style={{ overflowX: 'auto' }}>
          <table style={S.table}>
            <thead>
              <tr>
                {['বিষয়', 'প্রশ্ন', 'সঠিক উত্তর', 'সময়', 'মুছুন'].map(h => <th key={h} style={S.th}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {questions.map(q => (
                <tr key={q.id}>
                  <td style={S.td}><span style={{ background: '#14532d', color: '#86efac', borderRadius: 6, padding: '2px 8px', fontSize: 11 }}>{q.subject}</span></td>
                  <td style={{ ...S.td, maxWidth: 220 }}>{q.question}</td>
                  <td style={S.td}>
                    <span style={{ background: '#4f46e5', color: '#fff', borderRadius: 6, padding: '2px 8px', fontSize: 11 }}>
                      {optLabels[q.correctIndex]}: {[q.optionA, q.optionB, q.optionC, q.optionD][q.correctIndex]}
                    </span>
                  </td>
                  <td style={S.td}>{q.timeLimit}s</td>
                  <td style={S.td}>
                    <button onClick={() => deleteQ(q.id)} style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 10px', cursor: 'pointer', fontSize: 12 }}>🗑️</button>
                  </td>
                </tr>
              ))}
              {questions.length === 0 && <tr><td colSpan={5} style={{ ...S.td, textAlign: 'center', color: '#475569' }}>কোনো প্রশ্ন নেই।</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── TAB: 3D Lab Controls ────────────────────────────────────────────────────
function Lab3DTab() {
  const [toggles, setToggles] = useState({ biology: true, chemistry: true, physics: true, orbitControls: true });

  const Toggle = ({ label, field, icon }) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: '#1e293b', borderRadius: 12, marginBottom: 10 }}>
      <span style={{ color: '#e2e8f0', fontSize: 14 }}>{icon} {label}</span>
      <button
        onClick={() => setToggles(t => ({ ...t, [field]: !t[field] }))}
        style={{
          width: 50, height: 26, borderRadius: 13, border: 'none', cursor: 'pointer',
          background: toggles[field] ? '#6366f1' : '#334155',
          position: 'relative', transition: 'background .2s',
        }}
      >
        <span style={{
          position: 'absolute', top: 3, left: toggles[field] ? 26 : 4,
          width: 20, height: 20, borderRadius: '50%', background: '#fff',
          transition: 'left .2s', display: 'block',
        }} />
      </button>
    </div>
  );

  return (
    <div style={S.card}>
      <div style={S.sectionTitle}>🧪 ভার্চুয়াল ৩ডি সায়েন্স ল্যাব কন্ট্রোল</div>
      <p style={{ color: '#64748b', fontSize: 13, marginBottom: 20 }}>স্টুডেন্ট ল্যাবে কোন কোন ৩ডি মডেল দৃশ্যমান থাকবে তা নিয়ন্ত্রণ করুন।</p>
      <Toggle label="জীববিজ্ঞান - Animal Cell মডেল" field="biology" icon="🧬" />
      <Toggle label="রসায়ন - Molecule মডেল (H₂O, CH₄)" field="chemistry" icon="⚗️" />
      <Toggle label="পদার্থবিজ্ঞান - ভেক্টর ফিল্ড মডেল" field="physics" icon="🔭" />
      <Toggle label="OrbitControls (ঘোরানো ও জুম)" field="orbitControls" icon="🕹️" />
      <div style={{ marginTop: 16, padding: '12px 16px', background: '#1e3a5f', borderRadius: 10, color: '#93c5fd', fontSize: 12 }}>
        ℹ️ টগল পরিবর্তন করে Save করুন। সার্ভার রিস্টার্ট ছাড়া তাৎক্ষণিক কার্যকর হবে।
      </div>
      <button style={{ ...S.btn('#6366f1'), marginTop: 14 }}>💾 ল্যাব সেটিংস সংরক্ষণ</button>
    </div>
  );
}

// ─── TAB: Smart Notes ────────────────────────────────────────────────────────
function SmartNotesTab({ config }) {
  const [notes, setNotes] = useState(config.smartNotes || []);
  const [form, setForm] = useState({ subject: '', chapter: '', summary: '' });
  const [msg, setMsg] = useState('');

  const handleAdd = () => {
    if (!form.subject || !form.chapter) return;
    const newNote = {
      id: `note-${Date.now()}`,
      ...form,
      date: new Date().toLocaleDateString('bn-BD'),
      slidesCount: 5,
    };
    setNotes(prev => [newNote, ...prev]);
    setForm({ subject: '', chapter: '', summary: '' });
    setMsg('✅ স্মার্ট নোট যোগ করা হয়েছে!');
    setTimeout(() => setMsg(''), 3000);
  };

  return (
    <div>
      <div style={S.card}>
        <div style={S.sectionTitle}>📋 নতুন স্মার্ট নোট আপলোড করুন</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
          <div>
            <label style={S.label}>বিষয় *</label>
            <input style={S.input} value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} placeholder="পদার্থবিজ্ঞান" />
          </div>
          <div>
            <label style={S.label}>অধ্যায় *</label>
            <input style={S.input} value={form.chapter} onChange={e => setForm(f => ({ ...f, chapter: e.target.value }))} placeholder="অধ্যায় ৪: কাজ, ক্ষমতা ও শক্তি" />
          </div>
          <div style={{ gridColumn: '1/-1' }}>
            <label style={S.label}>সারসংক্ষেপ</label>
            <input style={S.input} value={form.summary} onChange={e => setForm(f => ({ ...f, summary: e.target.value }))} placeholder="নোটের সারসংক্ষেপ..." />
          </div>
        </div>
        <button style={S.btn('#10b981')} onClick={handleAdd}>➕ নোট যোগ করুন</button>
        {msg && <div style={{ marginTop: 10, color: '#4ade80', fontSize: 13 }}>{msg}</div>}
      </div>

      {/* Watermark Preview */}
      <div style={S.card}>
        <div style={S.sectionTitle}>🖼️ স্মার্ট নোট স্লাইড ওয়াটারমার্ক প্রিভিউ</div>
        <p style={{ color: '#64748b', fontSize: 13, marginBottom: 16 }}>প্রতিটি স্লাইড ডাউনলোড করলে নিচের ব্র্যান্ডিং যুক্ত হবে:</p>
        <WatermarkPreview title={form.chapter || 'স্মার্টবোর্ড নোট স্লাইড'} />
      </div>

      {/* Notes list */}
      <div style={S.card}>
        <div style={S.sectionTitle}>📚 বিদ্যমান স্মার্ট নোটসমূহ ({notes.length}টি)</div>
        <div style={{ display: 'grid', gap: 10 }}>
          {notes.map(n => (
            <div key={n.id} style={{ background: '#1e293b', borderRadius: 10, padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ color: '#e2e8f0', fontWeight: 600, fontSize: 13 }}>{n.chapter}</div>
                <div style={{ color: '#64748b', fontSize: 12 }}>{n.subject} · {n.date} · {n.slidesCount} স্লাইড</div>
              </div>
              <button onClick={() => setNotes(prev => prev.filter(x => x.id !== n.id))} style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 10px', cursor: 'pointer', fontSize: 12 }}>🗑️</button>
            </div>
          ))}
          {notes.length === 0 && <div style={{ color: '#475569', fontSize: 13 }}>কোনো নোট নেই।</div>}
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function InteractiveGamificationCMS() {
  const [activeTab, setActiveTab] = useState('reward-settings');
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const tabs = [
    { id: 'reward-settings', label: '🪙 রিওয়ার্ড সেটিংস' },
    { id: 'formula-vault', label: '📐 ফর্মুলা ভল্ট' },
    { id: 'live-battle', label: '⚔️ লাইভ ব্যাটেল MCQ' },
    { id: '3d-lab', label: '🧪 ৩ডি ল্যাব' },
    { id: 'smart-notes', label: '📋 স্মার্ট নোটস' },
  ];

  useEffect(() => {
    (async () => {
      try {
        const res = await gamificationCmsAPI.getSettings();
        if (res.success) setConfig(res.data);
        else setError('ডেটা লোড ব্যর্থ হয়েছে।');
      } catch (e) {
        setError('সার্ভার সংযোগ ব্যর্থ হয়েছে।');
      }
      setLoading(false);
    })();
  }, []);

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 300, color: '#6366f1', fontSize: 18 }}>
      ⏳ লোড হচ্ছে...
    </div>
  );

  if (error) return (
    <div style={{ padding: 30, color: '#f87171', fontSize: 15 }}>❌ {error}</div>
  );

  return (
    <div style={{ fontFamily: "'Hind Siliguri', sans-serif", color: '#e2e8f0' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg,#1e1b4b,#0f172a)', borderRadius: 16, padding: '20px 24px', marginBottom: 24, border: '1px solid #312e81' }}>
        <h2 style={{ margin: 0, color: '#a5b4fc', fontWeight: 800, fontSize: 20 }}>
          🎮 ইন্টারেক্টিভ লার্নিং ও গ্যামিফিকেশন কন্ট্রোল
        </h2>
        <p style={{ margin: '6px 0 0', color: '#4f46e5', fontSize: 13 }}>
          ফর্মুলা ভল্ট, রিওয়ার্ড স্টোর, ব্যাটেল প্রশ্ন ব্যাংক ও স্মার্ট নোট ম্যানেজ করুন
        </p>
      </div>

      {/* Tab Pills */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 24 }}>
        {tabs.map(t => (
          <button key={t.id} style={S.pill(activeTab === t.id)} onClick={() => setActiveTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'reward-settings' && <RewardSettingsTab config={config} onSaved={() => {}} />}
      {activeTab === 'formula-vault' && <FormulaVaultTab config={config} />}
      {activeTab === 'live-battle' && <LiveBattleTab config={config} />}
      {activeTab === '3d-lab' && <Lab3DTab />}
      {activeTab === 'smart-notes' && <SmartNotesTab config={config} />}
    </div>
  );
}
