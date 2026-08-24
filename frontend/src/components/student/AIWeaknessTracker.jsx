import React, { useRef } from 'react';
import { aiRoutineAPI } from '../../services/api';
import { useSWRCache } from '../../utils/swrCache';

const BRAND = {
  name: 'NextGen Academy',
  teacher: 'মো: আলমগীর হোসেন (সাগর)',
  phone: '০১৭৯২৮১৮০০৫',
  address: 'পশ্চিম জয়দেবপুর, বাস-স্ট্যান্ড, গাজীপুর',
};

const DAYS = ['রবিবার','সোমবার','মঙ্গলবার','বুধবার','বৃহস্পতিবার','শুক্রবার','শনিবার'];

const FALLBACK_ANALYSIS = {
  weakSubjects: [
    { subjectName: 'পদার্থবিজ্ঞান', percent: 45, status: 'WEAK' },
    { subjectName: 'রসায়ন', percent: 52, status: 'WEAK' },
    { subjectName: 'উচ্চতর গণিত', percent: 38, status: 'WEAK' },
  ],
  averageSubjects: [
    { subjectName: 'সাধারণ গণিত', percent: 68, status: 'AVERAGE' },
    { subjectName: 'জীববিজ্ঞান', percent: 64, status: 'AVERAGE' },
    { subjectName: 'আইসিটি', percent: 71, status: 'AVERAGE' },
  ],
  strongSubjects: [
    { subjectName: 'বাংলা', percent: 82, status: 'STRONG' },
    { subjectName: 'ইংরেজি', percent: 78, status: 'STRONG' },
  ],
  studyPlan: DAYS.map((day, i) => ({
    day,
    sessions: [
      { subject: 'পদার্থবিজ্ঞান', topic: 'গতিবিদ্যা', duration: 60, priority: 'WEAK' },
      { subject: 'উচ্চতর গণিত', topic: 'সীমা ও ধারাবাহিকতা', duration: 60, priority: 'WEAK' },
      ...(i < 5 ? [{ subject: 'রসায়ন', topic: 'পর্যায় সারণি', duration: 45, priority: 'AVERAGE' }] : []),
    ]
  }))
};


function StatusBadge({ status }) {
  const map = {
    WEAK: { bg: '#7f1d1d', color: '#fca5a5', label: '⚠️ দুর্বল' },
    AVERAGE: { bg: '#78350f', color: '#fcd34d', label: '⚡ মাঝারি' },
    STRONG: { bg: '#14532d', color: '#86efac', label: '✅ শক্তিশালী' },
  };
  const s = map[status] || map.AVERAGE;
  return (
    <span style={{ background: s.bg, color: s.color, borderRadius: 6, padding: '2px 10px', fontSize: 11, fontWeight: 700 }}>
      {s.label}
    </span>
  );
}

function SkeletonBar() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {[1,2,3,4].map(i => (
        <div key={i} style={{ height: 52, background: '#1e293b', borderRadius: 12, animation: 'pulse 1.5s infinite' }} />
      ))}
      <style>{`@keyframes pulse { 0%,100%{opacity:.6} 50%{opacity:1} }`}</style>
    </div>
  );
}

function SubjectBar({ subject, percent, status }) {
  const colors = { WEAK: '#ef4444', AVERAGE: '#f59e0b', STRONG: '#10b981' };
  const color = colors[status] || '#6366f1';
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <span style={{ color: '#e2e8f0', fontSize: 14, fontWeight: 600 }}>{subject}</span>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ color, fontWeight: 800, fontSize: 15 }}>{Math.round(percent)}%</span>
          <StatusBadge status={status} />
        </div>
      </div>
      <div style={{ height: 10, background: '#1e293b', borderRadius: 6, overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          width: `${Math.min(100, percent)}%`,
          background: `linear-gradient(90deg, ${color}88, ${color})`,
          borderRadius: 6,
          transition: 'width 1.2s ease',
          boxShadow: `0 0 8px ${color}66`,
        }} />
      </div>
    </div>
  );
}

export default function AIWeaknessTracker() {
  const { data, isValidating: loading } = useSWRCache(
    'student_ai_weakness_analysis',
    aiRoutineAPI.getWeaknessAnalysis,
    { fallbackData: FALLBACK_ANALYSIS, ttl: 10 * 60 * 1000 }
  );


  const allSubjects = data
    ? [...(data.weakSubjects||[]), ...(data.averageSubjects||[]), ...(data.strongSubjects||[])]
    : [];

  return (
    <div style={{ fontFamily: "'Hind Siliguri', sans-serif", color: '#e2e8f0', paddingBottom: 40 }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg,#1e1b4b,#0f172a)', borderRadius: 16, padding: '22px 28px', marginBottom: 24, border: '1px solid #312e81' }}>
        <h2 style={{ margin: 0, color: '#a5b4fc', fontWeight: 800, fontSize: 22 }}>🤖 AI স্টাডি রুটিন ও দুর্বলতা ট্র্যাকার</h2>
        <p style={{ margin: '6px 0 0', color: '#4f46e5', fontSize: 13 }}>
          আপনার পরীক্ষার স্কোর বিশ্লেষণ করে AI আপনার জন্য ব্যক্তিগতকৃত ৭-দিনের স্টাডি প্ল্যান তৈরি করেছে।
        </p>
      </div>

      {loading ? <SkeletonBar /> : (
        <>
          {/* Stat Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 24 }}>
            {[
              { label: 'দুর্বল বিষয়', count: data.weakSubjects?.length || 0, color: '#ef4444', bg: '#7f1d1d', icon: '⚠️' },
              { label: 'মাঝারি বিষয়', count: data.averageSubjects?.length || 0, color: '#f59e0b', bg: '#78350f', icon: '⚡' },
              { label: 'শক্তিশালী বিষয়', count: data.strongSubjects?.length || 0, color: '#10b981', bg: '#14532d', icon: '✅' },
            ].map(s => (
              <div key={s.label} style={{ background: '#0f172a', border: `1px solid ${s.color}44`, borderRadius: 14, padding: '16px 20px' }}>
                <div style={{ fontSize: 28 }}>{s.icon}</div>
                <div style={{ color: s.color, fontSize: 36, fontWeight: 800, margin: '4px 0' }}>{s.count}</div>
                <div style={{ color: '#64748b', fontSize: 13 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Weakness Heatmap */}
          <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 16, padding: '20px 24px', marginBottom: 24 }}>
            <h3 style={{ color: '#f1f5f9', fontWeight: 700, margin: '0 0 18px', fontSize: 16 }}>📊 বিষয় ভিত্তিক দুর্বলতা বিশ্লেষণ</h3>
            {allSubjects.map(s => (
              <SubjectBar key={s.subjectName} subject={s.subjectName} percent={s.percent} status={s.status} />
            ))}
          </div>

          {/* AI Recommendation Banner */}
          {data.weakSubjects?.length > 0 && (
            <div style={{
              background: 'linear-gradient(135deg,#1e1b4b,#312e81)',
              border: '1px solid #6366f1',
              borderRadius: 16,
              padding: '18px 24px',
              marginBottom: 24,
              boxShadow: '0 0 24px #6366f122',
            }}>
              <div style={{ color: '#a5b4fc', fontWeight: 800, fontSize: 15, marginBottom: 10 }}>🧠 AI বিশ্লেষণ ও সুপারিশ</div>
              {data.weakSubjects.slice(0, 2).map(s => (
                <div key={s.subjectName} style={{ background: '#1e1b4b', borderRadius: 10, padding: '10px 16px', marginBottom: 8 }}>
                  <span style={{ color: '#fca5a5' }}>📌 {s.subjectName}</span>
                  <span style={{ color: '#94a3b8', fontSize: 13, marginLeft: 8 }}>
                    — আজই ২ ঘণ্টা সময় দিন। বোর্ড পরীক্ষায় এই বিষয়ে ৬০%+ পেতে মনোযোগ দিন।
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* 7-Day Study Plan */}
          <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 16, padding: '20px 24px', marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <h3 style={{ color: '#f1f5f9', fontWeight: 700, margin: 0, fontSize: 16 }}>📅 AI তৈরি ৭-দিনের স্টাডি প্ল্যান</h3>
              <button
                onClick={() => { document.title = 'NextGen Academy — AI স্টাডি প্ল্যান'; window.print(); }}
                style={{ background: '#6366f1', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 16px', cursor: 'pointer', fontWeight: 600, fontSize: 13 }}
              >
                🖨️ প্রিন্ট করুন
              </button>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 700 }}>
                <thead>
                  <tr>
                    {(data.studyPlan || []).map(day => (
                      <th key={day.day} style={{ background: '#1e293b', color: '#94a3b8', padding: '10px 8px', fontSize: 12, fontWeight: 700, textAlign: 'center', borderRight: '1px solid #0f172a' }}>
                        {day.day}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {(data.studyPlan || []).map(day => (
                      <td key={day.day} style={{ padding: '10px 6px', verticalAlign: 'top', borderRight: '1px solid #1e293b' }}>
                        {day.sessions.map((session, i) => {
                          const colors = { WEAK: '#7f1d1d', AVERAGE: '#78350f', STRONG: '#14532d' };
                          const textColors = { WEAK: '#fca5a5', AVERAGE: '#fcd34d', STRONG: '#86efac' };
                          return (
                            <div key={i} style={{
                              background: colors[session.priority] || '#1e293b',
                              borderRadius: 8,
                              padding: '6px 8px',
                              marginBottom: 6,
                              fontSize: 11,
                              boxShadow: session.priority === 'WEAK' ? '0 0 8px #ef444433' : 'none',
                            }}>
                              <div style={{ color: textColors[session.priority], fontWeight: 700, marginBottom: 2 }}>{session.subject}</div>
                              <div style={{ color: '#64748b' }}>{session.topic}</div>
                              <div style={{ color: '#475569', fontSize: 10 }}>⏱️ {session.duration} মিনিট</div>
                            </div>
                          );
                        })}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Branding footer */}
          <div style={{ textAlign: 'center', color: '#334155', fontSize: 12 }}>
            {BRAND.name} · {BRAND.teacher} · {BRAND.phone} · {BRAND.address}
          </div>
        </>
      )}
    </div>
  );
}
