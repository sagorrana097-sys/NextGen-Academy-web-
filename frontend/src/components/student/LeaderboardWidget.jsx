import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Star, Crown, Flame, TrendingUp, Loader2, RefreshCw, ChevronRight, Award } from 'lucide-react';
import { omrAPI, curriculumAPI, resultsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import ResultCardTemplate from '../common/ResultCardTemplate';

const RANK_CONFIG = {
  1: { icon: '🥇', label: '১ম স্থান', bg: 'from-amber-400/20 to-yellow-400/20', border: 'border-amber-400/50', text: 'text-amber-500', badge: 'bg-amber-500' },
  2: { icon: '🥈', label: '২য় স্থান', bg: 'from-slate-400/20 to-zinc-400/20', border: 'border-slate-400/50', text: 'text-slate-400', badge: 'bg-slate-400' },
  3: { icon: '🥉', label: '৩য় স্থান', bg: 'from-amber-700/20 to-orange-700/20', border: 'border-amber-700/50', text: 'text-amber-700', badge: 'bg-amber-700' },
};

const ordinalBn = (n) => {
  const map = { 1: '১ম', 2: '২য়', 3: '৩য়', 4: '৪র্থ', 5: '৫ম', 6: '৬ষ্ঠ', 7: '৭ম', 8: '৮ম', 9: '৯ম', 10: '১০ম' };
  return map[n] || `${n}তম`;
};

function GradeChip({ grade }) {
  const colors = {
    'A+': 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300',
    A: 'bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300',
    'A-': 'bg-indigo-100 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300',
    B: 'bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300',
    C: 'bg-orange-100 dark:bg-orange-950/50 text-orange-700 dark:text-orange-300',
    D: 'bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300',
    F: 'bg-slate-100 dark:bg-slate-800 text-slate-500',
  };
  return <span className={`px-2 py-0.5 rounded-full text-xs font-black ${colors[grade] || colors.F}`}>{grade}</span>;
}

export default function LeaderboardWidget({ studentProfile }) {
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);
  const [terms, setTerms] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedTerm, setSelectedTerm] = useState('');
  const [leaderboard, setLeaderboard] = useState([]);
  const [myRank, setMyRank] = useState(null);
  const [myScore, setMyScore] = useState(null);
  const [totalParticipants, setTotalParticipants] = useState(0);
  const [examTerm, setExamTerm] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showResultCard, setShowResultCard] = useState(false);

  useEffect(() => {
    curriculumAPI.getClasses().then(r => {
      if (r?.success && r.data) {
        setClasses(r.data);
        // Auto-select student class if available
        const studentClassId = studentProfile?.classId || studentProfile?.class?.id;
        if (studentClassId) setSelectedClass(String(studentClassId));
        else if (r.data.length > 0) setSelectedClass(String(r.data[0].id));
      }
    }).catch(() => {});
    resultsAPI.getTerms().then(r => {
      if (r?.success && r.data) {
        setTerms(r.data);
        if (r.data.length > 0) setSelectedTerm(String(r.data[0].id));
      }
    }).catch(() => {});
  }, [studentProfile]);

  useEffect(() => {
    if (!selectedClass || !selectedTerm) return;
    fetchLeaderboard();
  }, [selectedClass, selectedTerm]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const studentId = studentProfile?.id || user?.student?.id;
      const params = { examTermId: selectedTerm, classId: selectedClass };
      if (studentId) params.studentId = studentId;
      const res = await omrAPI.getLeaderboard(params);
      if (res?.success && res.data) {
        setLeaderboard(res.data.leaderboard || []);
        setMyRank(res.data.myRank);
        setMyScore(res.data.myScore);
        setTotalParticipants(res.data.totalParticipants || 0);
        setExamTerm(res.data.examTerm);
      }
    } catch (e) {
      console.error('Leaderboard fetch error', e);
    } finally {
      setLoading(false);
    }
  };

  const myStudentData = studentProfile || {};

  return (
    <div className="space-y-5">
      {/* Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-500" /> লিডারবোর্ড ও পারফরম্যান্স
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {examTerm ? examTerm.titleBn || examTerm.titleEn : 'সর্বশেষ পরীক্ষার'} শীর্ষ শিক্ষার্থী
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)} className="text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500">
            {classes.map(c => <option key={c.id} value={c.id}>{c.nameBn || c.name}</option>)}
          </select>
          <select value={selectedTerm} onChange={e => setSelectedTerm(e.target.value)} className="text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500">
            {terms.map(t => <option key={t.id} value={t.id}>{t.titleBn || t.titleEn}</option>)}
          </select>
          <button onClick={fetchLeaderboard} disabled={loading} className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* My Rank Banner */}
      {myRank && (
        <div className={`relative overflow-hidden rounded-2xl p-4 border ${myRank <= 3 ? 'bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border-amber-400/40' : 'bg-gradient-to-r from-indigo-500/10 to-blue-500/10 border-indigo-400/40'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl font-black ${myRank <= 3 ? 'bg-amber-500/20 text-amber-600' : 'bg-indigo-500/20 text-indigo-600'}`}>
                {myRank <= 3 ? ['🥇', '🥈', '🥉'][myRank - 1] : `#${myRank}`}
              </div>
              <div>
                <p className="text-sm font-black text-slate-900 dark:text-white">
                  আপনার বর্তমান অবস্থান: <span className={`${myRank <= 3 ? 'text-amber-600' : 'text-indigo-600'}`}>{ordinalBn(myRank)} স্থান</span>
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {totalParticipants} জন শিক্ষার্থীর মধ্যে &bull; প্রাপ্ত মার্কস: <span className="font-bold text-slate-700 dark:text-slate-200">{myScore?.totalObtained || 0}</span>
                  {myScore?.letterGrade && <> &bull; গ্রেড: <GradeChip grade={myScore.letterGrade} /></>}
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowResultCard(v => !v)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors"
            >
              <Award className="w-3.5 h-3.5" /> রেজাল্ট কার্ড
            </button>
          </div>
          {myRank === 1 && (
            <div className="absolute -top-2 -right-2 w-16 h-16 flex items-center justify-center text-3xl opacity-30 rotate-12 select-none">👑</div>
          )}
        </div>
      )}

      {/* Result Card Preview */}
      {showResultCard && myScore && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-4 bg-slate-50 dark:bg-slate-900/50 flex flex-col items-center gap-4">
          <ResultCardTemplate
            student={{ name: myStudentData.name || myScore.name || 'শিক্ষার্থী', rollNo: myStudentData.rollNo || myScore.rollNo, class: myStudentData.class || '', batch: myStudentData.batch || myScore.batchName || '' }}
            examLabel={examTerm?.titleBn || 'পরীক্ষা'}
            examTermTitle={examTerm?.titleBn}
            obtainedMarks={myScore.totalObtained || 0}
            totalMarks={100}
            highestMarks={leaderboard[0]?.totalObtained || 100}
          />
          <button onClick={() => setShowResultCard(false)} className="text-xs text-slate-500 hover:text-rose-500 underline">বন্ধ করুন</button>
        </div>
      )}

      {/* Leaderboard Table */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
        </div>
      ) : leaderboard.length === 0 ? (
        <div className="text-center py-12 text-slate-400">
          <Trophy className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="font-semibold">এখনো কোনো ফলাফল নেই</p>
          <p className="text-xs mt-1">OMR আমদানি করলে লিডারবোর্ড এখানে দেখাবে</p>
        </div>
      ) : (
        <div className="space-y-2">
          {leaderboard.map((entry, idx) => {
            const rank = entry.rank;
            const rankCfg = RANK_CONFIG[rank] || { icon: `#${rank}`, bg: 'from-slate-500/5 to-slate-500/5', border: 'border-slate-200 dark:border-slate-800', text: 'text-slate-600 dark:text-slate-400', badge: 'bg-slate-500' };
            const isMe = myRank && Number(entry.studentId) === Number(myScore?.studentId);

            return (
              <div
                key={entry.studentId}
                className={`flex items-center gap-3 p-3.5 rounded-2xl border bg-gradient-to-r ${rankCfg.bg} ${rankCfg.border} transition-all ${isMe ? 'ring-2 ring-indigo-500/50 shadow-lg shadow-indigo-500/10' : ''}`}
              >
                {/* Rank Badge */}
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg font-black flex-shrink-0 ${rank <= 3 ? rankCfg.badge + ' text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 text-sm'}`}>
                  {rank <= 3 ? rankCfg.icon : rank}
                </div>

                {/* Avatar */}
                <div className="w-9 h-9 rounded-full flex-shrink-0 bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm overflow-hidden">
                  {entry.photo ? <img src={entry.photo} alt="" className="w-full h-full object-cover" /> : entry.name.charAt(0)}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className={`font-bold text-sm truncate ${isMe ? 'text-indigo-700 dark:text-indigo-300' : 'text-slate-800 dark:text-slate-100'}`}>
                    {entry.name} {isMe && <span className="text-xs bg-indigo-100 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-300 px-1.5 py-0.5 rounded-full font-black ml-1">আপনি</span>}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">রোল: {entry.rollNo}{entry.sectionName && ` • ${entry.sectionName}`}</p>
                </div>

                {/* Score */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <GradeChip grade={entry.letterGrade} />
                  <div className="text-right">
                    <p className="text-sm font-black text-slate-800 dark:text-slate-100">{entry.totalObtained}</p>
                    <p className="text-xs text-slate-500">মার্কস</p>
                  </div>
                </div>
              </div>
            );
          })}

          {totalParticipants > 10 && (
            <p className="text-center text-xs text-slate-400 pt-2">
              মোট {totalParticipants} জন শিক্ষার্থী পরীক্ষায় অংশগ্রহণ করেছে
            </p>
          )}
        </div>
      )}
    </div>
  );
}
