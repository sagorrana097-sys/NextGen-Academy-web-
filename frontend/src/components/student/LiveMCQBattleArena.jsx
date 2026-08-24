import React, { useState, useEffect, useRef } from 'react';
import {
  Swords,
  Timer,
  Zap,
  Award,
  Crown,
  Sparkles,
  RefreshCw,
  Flame,
  CheckCircle2,
  XCircle,
  Users,
  ChevronRight,
  ShieldAlert,
  Trophy,
  Loader2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { studentAPI } from '../../services/api';

const SAMPLE_BATTLE_QUESTIONS = [
  {
    id: 1,
    subject: 'পদার্থবিজ্ঞান',
    question: 'কোনো বস্তুর বেগ দ্বিগুণ করা হলে তার গতিশক্তি কতগুণ বৃদ্ধি পাবে?',
    options: ['২ গুণ', '৪ গুণ', '৮ গুণ', 'অপরিবর্তিত থাকবে'],
    correctIndex: 1,
    explanation: 'গতিশক্তি E_k = 1/2 m v²। বেগ দ্বিগুণ হলে (2v)² = 4v², অর্থাৎ গতিশক্তি ৪ গুণ হবে।'
  },
  {
    id: 2,
    subject: 'উচ্চতর গণিত',
    question: 'যদি sin θ = 4/5 হয়, তবে tan θ এর মান কত?',
    options: ['3/5', '4/3', '3/4', '5/4'],
    correctIndex: 1,
    explanation: 'sin θ = 4/5 হলে cos θ = √(1 - 16/25) = 3/5। সুতরাং tan θ = sin/cos = (4/5)/(3/5) = 4/3।'
  },
  {
    id: 3,
    subject: 'রসায়ন',
    question: 'পানির অণুর (H₂O) বন্ধন কোণ (Bond Angle) কত ডিগ্রি?',
    options: ['১০৯.৫°', '১০৪.৫°', '১২০°', '১৮০°'],
    correctIndex: 1,
    explanation: 'অক্সিজেনের ২টি নিঃসঙ্গ ইলেকট্রন জোড়ের বিকর্ষণের কারণে পানির বন্ধন কোণ ১০৪.৫° হয়।'
  },
  {
    id: 4,
    subject: 'জীববিজ্ঞান',
    question: 'কোষের শক্তিঘর (Powerhouse of the cell) কাকে বলা হয়?',
    options: ['রাইবোসোম', 'নিউক্লিয়াস', 'মাইটোকন্ড্রিয়া', 'গলজি বডি'],
    correctIndex: 2,
    explanation: 'শ্বসন প্রক্রিয়ার মাধ্যমে ATP শক্তি উৎপাদনের কারণে মাইটোকন্ড্রিয়াকে কোষের শক্তিঘর বলা হয়।'
  },
  {
    id: 5,
    subject: 'পদার্থবিজ্ঞান',
    question: 'মহাকর্ষীয় ধ্রুবক (G) এর আন্তর্জাতিক একক কোনটি?',
    options: ['N m²/kg²', 'N m/kg', 'N/kg²', 'm/s²'],
    correctIndex: 0,
    explanation: 'নিউটনের সূত্রানুসারে F = G(m1*m2)/d² => G = F*d²/(m1*m2), যার একক N m²/kg²।'
  }
];

const OPPONENTS = [
  { name: 'তানভীর আহমেদ (রোল: ১০২)', score: 0, avatar: '👨‍🎓', streak: 3 },
  { name: 'সাদিয়া ইসলাম (রোল: ১০৫)', score: 0, avatar: '👩‍🎓', streak: 5 },
  { name: 'আরিফুল হক (রোল: ১০৮)', score: 0, avatar: '🧑‍🎓', streak: 2 }
];

export default function LiveMCQBattleArena({ studentName = 'আপনি (শিক্ষার্থী)' }) {
  const [gameState, setGameState] = useState('LOBBY'); // 'LOBBY' | 'MATCHING' | 'PLAYING' | 'ROUND_OVER' | 'GAME_OVER'
  const [currentRound, setCurrentRound] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [playerScore, setPlayerScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [playerCombo, setPlayerCombo] = useState(1);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [opponentAnswered, setOpponentAnswered] = useState(false);
  const [activeOpponent, setActiveOpponent] = useState(OPPONENTS[0]);
  const [winner, setWinner] = useState(null);
  const [rewardClaimed, setRewardClaimed] = useState(false);

  const timerRef = useRef(null);

  // Start matchmaking simulation
  const startMatchmaking = () => {
    setGameState('MATCHING');
    setTimeout(() => {
      const opp = OPPONENTS[Math.floor(Math.random() * OPPONENTS.length)];
      setActiveOpponent(opp);
      setPlayerScore(0);
      setOpponentScore(0);
      setCurrentRound(0);
      setPlayerCombo(1);
      setWinner(null);
      setRewardClaimed(false);
      startRound(0);
    }, 2000);
  };

  const startRound = (roundIdx) => {
    setCurrentRound(roundIdx);
    setTimeLeft(30);
    setSelectedAnswer(null);
    setOpponentAnswered(false);
    setGameState('PLAYING');

    // Simulate opponent AI response timing
    const opponentResponseTime = 3000 + Math.random() * 6000;
    setTimeout(() => {
      setOpponentAnswered(true);
      // 75% opponent accuracy
      const isOppCorrect = Math.random() > 0.25;
      if (isOppCorrect) {
        setOpponentScore((prev) => prev + 50);
      }
    }, opponentResponseTime);
  };

  // Timer Tick
  useEffect(() => {
    if (gameState !== 'PLAYING') return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [gameState, currentRound]);

  const handleTimeUp = () => {
    evaluateRound();
  };

  const handleSelectOption = (idx) => {
    if (selectedAnswer !== null || gameState !== 'PLAYING') return;
    setSelectedAnswer(idx);

    const currQ = SAMPLE_BATTLE_QUESTIONS[currentRound];
    const isCorrect = idx === currQ.correctIndex;

    if (isCorrect) {
      const points = 50 * playerCombo;
      setPlayerScore((prev) => prev + points);
      setPlayerCombo((prev) => Math.min(prev + 1, 3));
      confetti({ particleCount: 40, spread: 60 });
    } else {
      setPlayerCombo(1);
    }

    setTimeout(() => {
      evaluateRound();
    }, 1500);
  };

  const evaluateRound = () => {
    if (currentRound + 1 < SAMPLE_BATTLE_QUESTIONS.length) {
      setGameState('ROUND_OVER');
      setTimeout(() => {
        startRound(currentRound + 1);
      }, 2500);
    } else {
      // Game Over
      setGameState('GAME_OVER');
      const isPlayerWin = playerScore >= opponentScore;
      setWinner(isPlayerWin ? 'PLAYER' : 'OPPONENT');
      if (isPlayerWin) {
        confetti({ particleCount: 150, spread: 100, origin: { y: 0.5 } });
      }
    }
  };

  const handleClaimVictoryReward = async () => {
    try {
      setRewardClaimed(true);
      await studentAPI.submitBattleReward({ isWinner: true, points: 50, coins: 25 });
      confetti({ particleCount: 100, spread: 80 });
    } catch (e) {
      console.error('Error claiming battle reward:', e);
    }
  };

  const currentQ = SAMPLE_BATTLE_QUESTIONS[currentRound] || SAMPLE_BATTLE_QUESTIONS[0];

  return (
    <div className="space-y-6 text-slate-100">
      {/* 1. Arena Header */}
      <div className="relative rounded-3xl bg-gradient-to-r from-rose-950 via-slate-900 to-amber-950/50 border border-rose-500/30 p-6 shadow-2xl overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-rose-600 flex items-center justify-center text-white shadow-xl shadow-rose-600/30 animate-pulse">
              <Swords className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black tracking-widest text-rose-400 uppercase">
                  Real-time Battle Arena
                </span>
                <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-[10px] font-bold border border-red-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                  LIVE
                </span>
              </div>
              <h2 className="text-2xl font-black text-white">
                ১v১ লাইভ MCQ ব্যাটেল অ্যারেনা
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">
                অন্যান্য শিক্ষার্থীদের সাথে সরাসরি কুইজ লড়াইয়ে অংশ নিন এবং পয়েন্ট ও কয়েন অর্জন করুন!
              </p>
            </div>
          </div>

          {gameState === 'LOBBY' && (
            <button
              onClick={startMatchmaking}
              className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-black text-sm shadow-xl shadow-rose-600/30 transition-all transform hover:scale-105 cursor-pointer"
            >
              <Swords className="w-5 h-5" />
              ম্যাচ খুঁজুন (Find Match)
            </button>
          )}
        </div>
      </div>

      {/* 2. Matchmaking Screen */}
      {gameState === 'MATCHING' && (
        <div className="p-12 text-center bg-slate-900/90 rounded-3xl border border-slate-800 space-y-4 shadow-xl">
          <div className="w-20 h-20 rounded-full bg-rose-500/20 text-rose-400 mx-auto flex items-center justify-center animate-spin">
            <RefreshCw className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-black text-white">প্রতিদ্বন্দ্বী খোঁজা হচ্ছে...</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            NextGen Academy এর সক্রিয় শিক্ষার্থীদের সাথে আপনার লেভেলের ম্যাচমেকিং হচ্ছে। অপেক্ষা করুন।
          </p>
        </div>
      )}

      {/* 3. Live Battle Arena Split Screen */}
      {(gameState === 'PLAYING' || gameState === 'ROUND_OVER') && (
        <div className="space-y-6">
          {/* Split Screen Player vs Opponent HUD */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Player 1 (You) */}
            <div className="p-5 rounded-3xl bg-slate-900 border-2 border-emerald-500/50 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 text-2xl flex items-center justify-center border border-emerald-500/30">
                    👨‍🎓
                  </div>
                  <div>
                    <h4 className="font-extrabold text-white text-sm">{studentName}</h4>
                    <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5" /> কম্বো: {playerCombo}x
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">স্কোর</span>
                  <div className="text-2xl font-black text-emerald-400 font-mono">
                    {playerScore} pts
                  </div>
                </div>
              </div>

              {/* Score Progress Bar */}
              <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
                  style={{ width: `${Math.min((playerScore / 250) * 100, 100)}%` }}
                />
              </div>
            </div>

            {/* Player 2 (Opponent) */}
            <div className="p-5 rounded-3xl bg-slate-900 border-2 border-rose-500/50 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-rose-600/20 text-2xl flex items-center justify-center border border-rose-500/30">
                    {activeOpponent.avatar}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-white text-sm">{activeOpponent.name}</h4>
                    <span className="text-[11px] text-rose-400 font-bold flex items-center gap-1">
                      {opponentAnswered ? '⚡ উত্তর প্রদান করেছে' : 'চিন্তা করছে...'}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">স্কোর</span>
                  <div className="text-2xl font-black text-rose-400 font-mono">
                    {opponentScore} pts
                  </div>
                </div>
              </div>

              {/* Opponent Score Progress Bar */}
              <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-rose-500 to-orange-400 transition-all duration-500"
                  style={{ width: `${Math.min((opponentScore / 250) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Central Question Card with Timer */}
          <div className="bg-slate-900/95 rounded-3xl border border-slate-800 p-6 sm:p-8 space-y-6 shadow-2xl">
            {/* Round info & Timer */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <span className="px-3 py-1 rounded-xl bg-slate-800 text-amber-300 font-black text-xs">
                রাউন্ড: {currentRound + 1} / {SAMPLE_BATTLE_QUESTIONS.length}
              </span>

              {/* 30s Countdown Timer */}
              <div className="flex items-center gap-2 px-4 py-1.5 rounded-2xl bg-slate-950 border border-slate-800">
                <Timer className={`w-5 h-5 ${timeLeft <= 5 ? 'text-rose-500 animate-ping' : 'text-amber-400'}`} />
                <span className={`text-xl font-black font-mono ${timeLeft <= 5 ? 'text-rose-400 animate-pulse' : 'text-white'}`}>
                  {timeLeft}s
                </span>
              </div>

              <span className="text-xs text-slate-400 font-semibold">{currentQ.subject}</span>
            </div>

            {/* Question Text */}
            <h3 className="text-lg sm:text-xl font-black text-white leading-relaxed">
              {currentQ.question}
            </h3>

            {/* 4 MCQ Option Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {currentQ.options.map((opt, idx) => {
                const isSelected = selectedAnswer === idx;
                const isCorrect = idx === currentQ.correctIndex;
                const showResult = selectedAnswer !== null || gameState === 'ROUND_OVER';

                let btnStyle = 'bg-slate-950 border-slate-800 text-slate-200 hover:border-amber-500/50 hover:bg-slate-800/80';
                if (showResult) {
                  if (isCorrect) btnStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 shadow-lg shadow-emerald-500/20';
                  else if (isSelected && !isCorrect) btnStyle = 'bg-rose-950/80 border-rose-500 text-rose-200';
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    disabled={selectedAnswer !== null}
                    className={`p-4 rounded-2xl border-2 text-left font-bold text-sm transition-all duration-200 flex items-center justify-between ${btnStyle}`}
                  >
                    <span>{opt}</span>
                    {showResult && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />}
                    {showResult && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />}
                  </button>
                );
              })}
            </div>

            {/* Explanation box after answer */}
            {(selectedAnswer !== null || gameState === 'ROUND_OVER') && (
              <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 text-xs text-slate-300 space-y-1">
                <span className="font-bold text-amber-400">ব্যাখ্যা:</span>
                <p>{currentQ.explanation}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. Victory / Game Over Modal */}
      {gameState === 'GAME_OVER' && (
        <div className="p-8 sm:p-12 text-center bg-slate-900 rounded-3xl border border-amber-500/40 shadow-2xl space-y-6 max-w-xl mx-auto">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-5xl mx-auto shadow-2xl shadow-amber-500/40 ring-4 ring-amber-400/20 animate-bounce">
            {winner === 'PLAYER' ? '🏆' : '⚔️'}
          </div>

          <div>
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              {winner === 'PLAYER' ? '🎉 বিজয় অর্জন (Victory)!' : 'ভালো লড়াই হয়েছে (Well Played)!'}
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              আপনার স্কোর: <strong className="text-emerald-400">{playerScore} pts</strong> | প্রতিপক্ষের স্কোর: <strong className="text-rose-400">{opponentScore} pts</strong>
            </p>
          </div>

          {/* Victory Coin Reward Box */}
          {winner === 'PLAYER' && (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-xs">
              <span className="font-bold text-amber-300">ম্যাচ বিজয়ের পুরস্কার:</span>
              <button
                onClick={handleClaimVictoryReward}
                disabled={rewardClaimed}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:bg-slate-800 text-slate-950 disabled:text-slate-500 font-black transition-all flex items-center gap-1.5"
              >
                {rewardClaimed ? 'পুরস্কার সংগৃহীত (+২৫ 🪙)' : '🪙 ২৫ কয়েন ক্লেইম করুন'}
              </button>
            </div>
          )}

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setGameState('LOBBY')}
              className="px-6 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs"
            >
              লবিতে ফিরে যান
            </button>
            <button
              onClick={startMatchmaking}
              className="px-6 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs shadow-lg shadow-rose-600/30"
            >
              পুনরায় ম্যাচ খেলুন
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
