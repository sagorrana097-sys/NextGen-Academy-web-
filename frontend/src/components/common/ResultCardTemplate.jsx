import React, { useRef, useState } from 'react';
import { Download, Share2, Award, Loader2 } from 'lucide-react';

const BRAND = {
  name: 'NextGen Academy',
  instructor: 'মো: আলমগীর হোসেন (সাগর)',
  contact: '০১৭৯২৮১৮০০৫',
  address: 'পশ্চিম জয়দেবপুর, বাস-স্ট্যান্ড, গাজীপুর',
  tagline: 'LEARN · GROW · SUCCEED'
};

function getGradeColor(grade) {
  const map = { 'A+': '#10b981', A: '#3b82f6', 'A-': '#6366f1', B: '#f59e0b', C: '#f97316', D: '#ef4444', F: '#64748b' };
  return map[grade] || '#64748b';
}

function getGP(grade) {
  const gpMap = { 'A+': 5.0, A: 4.0, 'A-': 3.5, B: 3.0, C: 2.0, D: 1.0, F: 0.0 };
  return gpMap[grade] ?? 0.0;
}

function computeGrade(marks) {
  if (marks >= 80) return 'A+';
  if (marks >= 70) return 'A';
  if (marks >= 60) return 'A-';
  if (marks >= 50) return 'B';
  if (marks >= 40) return 'C';
  if (marks >= 33) return 'D';
  return 'F';
}

export default function ResultCardTemplate({
  student,
  examLabel,
  subjectName,
  examTermTitle,
  obtainedMarks = 0,
  totalMarks = 100,
  highestMarks,
  correctAnswers,
  wrongAnswers
}) {
  const cardRef = useRef(null);
  const [downloading, setDownloading] = useState(false);

  const grade = student?.grade || computeGrade(obtainedMarks);
  const percentage = totalMarks > 0 ? Math.round((obtainedMarks / totalMarks) * 100) : 0;
  const gradeColor = getGradeColor(grade);
  const gp = getGP(grade);

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setDownloading(true);
    try {
      // Lazy-load html2canvas at runtime only (not at build time)
      const html2canvasModule = await import(/* @vite-ignore */ 'html2canvas');
      const html2canvas = html2canvasModule.default || html2canvasModule;
      const canvas = await html2canvas(cardRef.current, { scale: 3, useCORS: true, backgroundColor: '#ffffff' });
      const link = document.createElement('a');
      link.download = `result_${(student?.name || 'student').replace(/\s+/g, '_')}_${(examLabel || 'exam').replace(/\s+/g, '_')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (e) {
      alert('ডাউনলোড ব্যর্থ: ' + (e?.message || 'html2canvas লোড করা যায়নি'));
    } finally {
      setDownloading(false);
    }
  };

  const s = {
    wrap: { fontFamily: 'Arial, sans-serif', width: '480px', background: 'linear-gradient(135deg,#0f172a 0%,#1e293b 50%,#0f172a 100%)', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 25px 50px rgba(0,0,0,0.4)', border: '2px solid rgba(245,158,11,0.5)' },
    header: { background: 'linear-gradient(90deg,#d97706,#f59e0b,#d97706)', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
    titleBar: { background: 'rgba(245,158,11,0.1)', borderBottom: '1px solid rgba(245,158,11,0.2)', padding: '10px 24px', textAlign: 'center' },
    studentRow: { padding: '20px 24px 16px', display: 'flex', alignItems: 'center', gap: '16px' },
    avatar: { width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg,#10b981,#059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', fontWeight: '900', color: '#fff', border: '3px solid rgba(16,185,129,0.4)', flexShrink: 0 },
    scoreRow: { padding: '0 24px 20px', display: 'flex', gap: '12px', alignItems: 'stretch' },
    gradeBadge: { flex: '0 0 auto', background: gradeColor, borderRadius: '12px', padding: '16px 20px', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', minWidth: '90px' },
    statsGrid: { flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' },
    statBox: { background: 'rgba(255,255,255,0.05)', borderRadius: '10px', padding: '10px 12px', border: '1px solid rgba(255,255,255,0.1)' },
    progressRow: { padding: '0 24px 20px' },
    progressBg: { height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' },
    progressFill: { height: '100%', width: `${percentage}%`, background: `linear-gradient(90deg, ${gradeColor}, #f59e0b)`, borderRadius: '3px' },
    footer: { background: 'rgba(0,0,0,0.3)', borderTop: '1px solid rgba(245,158,11,0.2)', padding: '14px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Card */}
      <div ref={cardRef} style={s.wrap}>
        {/* Header */}
        <div style={s.header}>
          <div>
            <div style={{ fontSize: '22px', fontWeight: '900', color: '#0f172a', letterSpacing: '2px', textTransform: 'uppercase' }}>{BRAND.name}</div>
            <div style={{ fontSize: '10px', color: '#1e293b', letterSpacing: '3px', fontWeight: '700', marginTop: '2px' }}>{BRAND.tagline}</div>
          </div>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '3px solid #0f172a', fontSize: '22px' }}>🎓</div>
        </div>

        {/* Title */}
        <div style={s.titleBar}>
          <div style={{ fontSize: '13px', color: '#f59e0b', fontWeight: '800', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
            {examTermTitle || 'পরীক্ষার ফলাফল'} — {examLabel || 'Model Test'}
          </div>
          {subjectName && <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>বিষয়: {subjectName}</div>}
        </div>

        {/* Student Info */}
        <div style={s.studentRow}>
          <div style={s.avatar}>{student?.name ? student.name.charAt(0).toUpperCase() : 'S'}</div>
          <div>
            <div style={{ fontSize: '18px', fontWeight: '800', color: '#f1f5f9' }}>{student?.name || 'শিক্ষার্থী'}</div>
            <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '3px' }}>
              রোল: <span style={{ color: '#f59e0b', fontWeight: '700' }}>{student?.rollNo || '—'}</span>
              {student?.class && <> &nbsp;|&nbsp; শ্রেণি: <span style={{ color: '#60a5fa' }}>{student.class}</span></>}
            </div>
            {student?.batch && <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>ব্যাচ: {student.batch}</div>}
          </div>
        </div>

        {/* Scores */}
        <div style={s.scoreRow}>
          <div style={s.gradeBadge}>
            <div style={{ fontSize: '36px', fontWeight: '900', color: '#fff', lineHeight: 1 }}>{grade}</div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.85)', marginTop: '4px', fontWeight: '700' }}>GPA {gp.toFixed(2)}</div>
          </div>
          <div style={s.statsGrid}>
            <div style={s.statBox}>
              <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '700' }}>প্রাপ্ত মার্কস</div>
              <div style={{ fontSize: '22px', fontWeight: '900', color: '#f1f5f9', marginTop: '2px' }}>{obtainedMarks}</div>
              <div style={{ fontSize: '10px', color: '#475569' }}>/ {totalMarks}</div>
            </div>
            <div style={s.statBox}>
              <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '700' }}>শতাংশ</div>
              <div style={{ fontSize: '22px', fontWeight: '900', color: '#f59e0b', marginTop: '2px' }}>{percentage}%</div>
              <div style={{ fontSize: '10px', color: '#475569' }}>স্কোর</div>
            </div>
            {highestMarks !== undefined && (
              <div style={s.statBox}>
                <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '700' }}>সর্বোচ্চ</div>
                <div style={{ fontSize: '22px', fontWeight: '900', color: '#60a5fa', marginTop: '2px' }}>{highestMarks}</div>
                <div style={{ fontSize: '10px', color: '#475569' }}>ক্লাসে</div>
              </div>
            )}
            {correctAnswers !== undefined && (
              <div style={s.statBox}>
                <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '700' }}>সঠিক/ভুল</div>
                <div style={{ fontSize: '16px', fontWeight: '900', color: '#f1f5f9', marginTop: '2px' }}>
                  <span style={{ color: '#10b981' }}>{correctAnswers}</span>/<span style={{ color: '#ef4444' }}>{wrongAnswers || 0}</span>
                </div>
                <div style={{ fontSize: '10px', color: '#475569' }}>MCQ উত্তর</div>
              </div>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div style={s.progressRow}>
          <div style={s.progressBg}><div style={s.progressFill} /></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
            <span style={{ fontSize: '10px', color: '#475569' }}>০%</span>
            <span style={{ fontSize: '10px', color: '#94a3b8', fontWeight: '700' }}>{percentage}% অর্জিত</span>
            <span style={{ fontSize: '10px', color: '#475569' }}>১০০%</span>
          </div>
        </div>

        {/* Footer Branding */}
        <div style={s.footer}>
          <div>
            <div style={{ fontSize: '11px', color: '#f59e0b', fontWeight: '700' }}>শিক্ষক: {BRAND.instructor}</div>
            <div style={{ fontSize: '10px', color: '#64748b', marginTop: '2px' }}>📞 {BRAND.contact}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '10px', color: '#64748b' }}>📍 {BRAND.address}</div>
            <div style={{ fontSize: '9px', color: '#334155', marginTop: '2px' }}>NextGen Academy — সকলের জন্য মানসম্মত শিক্ষা</div>
          </div>
        </div>
      </div>

      {/* Download / Share Buttons */}
      <div className="flex gap-3 flex-wrap justify-center">
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-wait text-white font-bold text-sm shadow-lg shadow-emerald-500/25 transition-all"
        >
          {downloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          PNG ডাউনলোড
        </button>
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-wait text-white font-bold text-sm shadow-lg shadow-blue-500/25 transition-all"
        >
          <Share2 className="w-4 h-4" /> সোশ্যাল মিডিয়ায় শেয়ার
        </button>
      </div>
    </div>
  );
}
